const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        image: { type: String, required: true },
        description: { type: String, required: true },
        category: { type: String, required: true },
        price: { type: Number, required: true },
        packetRate: { type: Number },
        offerPrice: { type: Number },
        countInStock: { type: Number, required: true, default: 0 },
        status: { type: String, enum: ['Active', 'Out of Stock'], default: 'Active' }
    },
    { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
