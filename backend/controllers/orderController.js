import Order from '../models/Order.js';
import Product from '../models/Product.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
    try {
        const { orderItems, shippingAddress, paymentMethod, paymentResult, couponCode } = req.body;

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

        let discountAmount = 0;
        let appliedCoupon = '';

        const totalPrice = Math.max(0, itemsPrice + shippingPrice - discountAmount);

        const isPaid = (paymentMethod === 'Credit Card (Stripe)' || paymentMethod === 'PayPal') && paymentResult?.status === 'succeeded';

        // Create order
        const order = new Order({
            user: req.user._id,
            orderItems: verifiedItems,
            shippingAddress,
            paymentMethod: paymentMethod || 'Cash on Delivery',
            itemsPrice,
            shippingPrice,
            totalPrice,
            isPaid,
            paidAt: isPaid ? new Date() : undefined,
            status: 'Confirmed',
            couponApplied: appliedCoupon,
            discountAmount
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

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name').sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error('Get all orders error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update order to delivered/shipped
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
export const updateOrderToDelivered = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.status = 'Shipped';

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error('Update order to delivered error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update order status generically
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // If transitioning to Cancelled, return stock
        if (status === 'Cancelled' && order.status !== 'Cancelled') {
            for (const item of order.orderItems) {
                await Product.findByIdAndUpdate(item.product, {
                    $inc: { stock: item.qty }
                });
            }
        }
        // If transitioning out of Cancelled, reduce stock
        else if (order.status === 'Cancelled' && status !== 'Cancelled') {
            for (const item of order.orderItems) {
                await Product.findByIdAndUpdate(item.product, {
                    $inc: { stock: -item.qty }
                });
            }
        }

        order.status = status;
        if (status === 'Delivered') {
            order.isDelivered = true;
            order.deliveredAt = new Date();
        } else if (status === 'Shipped') {
            order.isDelivered = true; // Wait, original code treats "Shipped" as isDelivered: true or isDelivered: false?
            // In the admin dashboard it displayed "Shipped" when order.isDelivered was true. Let's look at AdminDashboard:
            // order.isDelivered ? "Shipped" : "Processing".
            // So yes, in this app, isDelivered is used to indicate it has been dispatched/shipped!
            order.isDelivered = true;
            order.deliveredAt = new Date();
        } else if (status === 'Processing' || status === 'Confirmed' || status === 'Cancelled') {
            order.isDelivered = false;
            order.deliveredAt = undefined;
        }

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Cancel order by user
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check ownership
        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to cancel this order' });
        }

        // Only allow if Processing or Confirmed
        if (order.status !== 'Processing' && order.status !== 'Confirmed') {
            return res.status(400).json({ message: 'Order cannot be cancelled as it has already been shipped or delivered' });
        }

        order.status = 'Cancelled';
        order.isDelivered = false;
        order.deliveredAt = undefined;

        // Return stock
        for (const item of order.orderItems) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: item.qty }
            });
        }

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        console.error('Cancel order error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
