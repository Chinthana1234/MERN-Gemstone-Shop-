import Product from '../models/Product.js';

// Fetch all products
// GET /api/products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Create a new product
// POST /api/products
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, imageUrl, category } = req.body;

    const product = new Product({
      name,
      description,
      price,
      imageUrl,
      category
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
