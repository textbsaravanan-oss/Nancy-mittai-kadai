const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

const getDashboardStats = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();
        const totalCustomers = await User.countDocuments({ isAdmin: false });

        const orders = await Order.find({});
        const totalRevenue = orders.reduce((acc, order) => acc + (order.isPaid ? order.totalPrice : 0), 0);

        const lowStockProducts = await Product.countDocuments({ countInStock: { $lt: 20 } });

        const recentOrders = await Order.find({})
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .limit(5);

        // Sales by day for the last 7 days chart (mock logic or basic grouping)
        // Here we just send basic stats
        res.json({
            totalProducts,
            totalOrders,
            totalCustomers,
            totalRevenue,
            lowStockProducts,
            recentOrders,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getDashboardStats };
