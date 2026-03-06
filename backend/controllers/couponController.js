const Coupon = require('../models/Coupon');

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Public
const getCoupons = async (req, res) => {
    const coupons = await Coupon.find({});
    res.json(coupons);
};

// @desc    Create a coupon
// @route   POST /api/coupons
// @access  Private/Admin
const createCoupon = async (req, res) => {
    const { code, discountPercentage, description, validUntil, isActive } = req.body;

    const couponExists = await Coupon.findOne({ code });
    if (couponExists) {
        res.status(400);
        throw new Error('Coupon already exists');
    }

    const coupon = await Coupon.create({
        code,
        discountPercentage,
        description,
        expiryDate: validUntil,
        isActive
    });
    res.status(201).json(coupon);
};

// @desc    Delete a coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
const deleteCoupon = async (req, res) => {
    const coupon = await Coupon.findById(req.params.id);

    if (coupon) {
        await coupon.deleteOne();
        res.json({ message: 'Coupon removed' });
    } else {
        res.status(404);
        throw new Error('Coupon not found');
    }
};

module.exports = { getCoupons, createCoupon, deleteCoupon };
