import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { getCache, setCache, clearProductCache } from '../utils/redis.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const cacheKey = `products:listings:${JSON.stringify(req.query)}`;

    // Attempt cache retrieval
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      console.log('Serving products from Redis cache...');
      return res.json(cachedData);
    }

    const pageSize = Number(req.query.pageSize) || 9; // Allow override or default to 9
    const page = Number(req.query.pageNumber) || 1;

    const { category, minPrice, maxPrice, minCarat, maxCarat, sort, keyword } = req.query;
    let filter = {};

    if (keyword) {
      filter.name = {
        $regex: keyword,
        $options: 'i',
      };
    }

    // Categories (comma separated)
    if (category && category !== 'All') {
      const categories = category.split(',').map(c => new RegExp(c.trim(), 'i'));
      filter.category = { $in: categories };
    }

    // Price range
    if ((minPrice !== undefined && minPrice !== '') || (maxPrice !== undefined && maxPrice !== '')) {
      filter.price = {};
      if (minPrice !== undefined && minPrice !== '') filter.price.$gte = Number(minPrice);
      if (maxPrice !== undefined && maxPrice !== '') filter.price.$lte = Number(maxPrice);
    }

    // Carat range
    if ((minCarat !== undefined && minCarat !== '') || (maxCarat !== undefined && maxCarat !== '')) {
      filter.carat = {};
      if (minCarat !== undefined && minCarat !== '') filter.carat.$gte = Number(minCarat);
      if (maxCarat !== undefined && maxCarat !== '') filter.carat.$lte = Number(maxCarat);
    }

    // Determine sort option
    let sortOption = { createdAt: -1 }; // default to newest
    if (sort === 'priceAsc') sortOption = { price: 1 };
    if (sort === 'priceDesc') sortOption = { price: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'nameAsc') sortOption = { name: 1 };
    if (sort === 'nameDesc') sortOption = { name: -1 };

    // If we want all products (e.g. for counting in frontend), fetchAll
    if (req.query.fetchAll === 'true') {
      const products = await Product.find(filter).sort(sortOption);
      const result = { products, page: 1, pages: 1, count: products.length };
      await setCache(cacheKey, result, 3600); // cache for 1 hour
      return res.json(result);
    }

    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort(sortOption)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    const result = { products, page, pages: Math.ceil(count / pageSize), count };
    await setCache(cacheKey, result, 3600); // cache for 1 hour
    res.json(result);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const cacheKey = `products:single:${req.params.id}`;

    // Attempt cache retrieval
    const cachedProduct = await getCache(cacheKey);
    if (cachedProduct) {
      console.log('Serving single product from Redis cache...');
      return res.json(cachedProduct);
    }

    const product = await Product.findById(req.params.id);
    if (product) {
      await setCache(cacheKey, product, 3600); // cache for 1 hour
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, imageUrl, category, stock, carat, origin } = req.body;
    const product = new Product({
      name, description, price, imageUrl, category,
      stock: stock || 0, carat: carat || 0, origin: origin || ''
    });
    const savedProduct = await product.save();

    // Invalidate product caches
    await clearProductCache();

    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const { name, description, price, imageUrl, category, stock, carat, origin } = req.body;
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.imageUrl = imageUrl || product.imageUrl;
    product.category = category || product.category;
    product.stock = stock ?? product.stock;
    product.carat = carat ?? product.carat;
    product.origin = origin || product.origin;

    const updatedProduct = await product.save();

    // Invalidate product caches
    await clearProductCache(product._id);

    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await product.deleteOne();

    // Invalidate product caches
    await clearProductCache(product._id);

    res.json({ message: 'Product removed' });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user && r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ message: 'Product already reviewed' });
      }

      // Check if user has purchased the product
      const hasPurchased = await Order.findOne({
        user: req.user._id,
        isDelivered: true,
        'orderItems.product': product._id
      });

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
        isVerifiedPurchase: !!hasPurchased
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

      await product.save();

      // Invalidate product caches
      await clearProductCache(product._id);

      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get all product reviews
// @route   GET /api/products/reviews/all
// @access  Private/Admin
export const getAllReviews = async (req, res) => {
  try {
    const products = await Product.find({});
    let allReviews = [];
    products.forEach(product => {
      if (product.reviews) {
        product.reviews.forEach(review => {
          allReviews.push({
            _id: review._id,
            productId: product._id,
            productName: product.name,
            user: review.user,
            name: review.name,
            rating: review.rating,
            comment: review.comment,
            isVerifiedPurchase: review.isVerifiedPurchase,
            createdAt: review.createdAt
          });
        });
      }
    });
    // Sort by createdAt descending
    allReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(allReviews);
  } catch (error) {
    console.error("Error fetching all reviews:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Delete a review from product (Admin)
// @route   DELETE /api/products/:id/reviews/:reviewId
// @access  Private/Admin
export const deleteProductReviewAdmin = async (req, res) => {
  try {
    const { id, reviewId } = req.params;
    const product = await Product.findById(id);

    if (product) {
      const reviewIndex = product.reviews.findIndex(
        (r) => r._id.toString() === reviewId
      );

      if (reviewIndex === -1) {
        return res.status(404).json({ message: 'Review not found' });
      }

      product.reviews.splice(reviewIndex, 1);
      product.numReviews = product.reviews.length;
      if (product.reviews.length > 0) {
        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
      } else {
        product.rating = 0;
      }

      await product.save();

      // Invalidate product caches
      await clearProductCache(id);

      res.json({ message: 'Review removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
