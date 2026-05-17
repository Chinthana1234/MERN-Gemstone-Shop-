import Order from '../models/Order.js';
import Product from '../models/Product.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
    try {
        const { orderItems, shippingAddress, paymentMethod } = req.body;

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items provided' });
        }

        // Verify stock and get current prices from DB
        const verifiedItems = [];
        for (const item of orderItems) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ message: `Product not found: ${item.name}` });
            }
            if (product.stock < item.qty) {
                return res.status(400).json({ 
                    message: `Insufficient stock for ${product.name}. Only ${product.stock} available.` 
                });
            }
            verifiedItems.push({
                name: product.name,
                qty: item.qty,
                price: product.price,
                imageUrl: product.imageUrl,
                product: product._id
            });
        }

        // Calculate prices
        const itemsPrice = verifiedItems.reduce((sum, item) => sum + item.price * item.qty, 0);
        const shippingPrice = 0; // Free shipping
        const totalPrice = itemsPrice + shippingPrice;

        // Create order
        const order = new Order({
            user: req.user._id,
            orderItems: verifiedItems,
            shippingAddress,
            paymentMethod: paymentMethod || 'Cash on Delivery',
            itemsPrice,
            shippingPrice,
            totalPrice,
            status: 'Confirmed'
        });

        const createdOrder = await order.save();

        // Decrement stock for each product
        for (const item of verifiedItems) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: -item.qty }
            });
        }

        res.status(201).json(createdOrder);
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Ensure user can only access their own orders (unless admin)
        if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Not authorized to view this order' });
        }

        res.json(order);
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get logged-in user's orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error('Get my orders error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
