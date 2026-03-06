const Product = require('../models/Product');
const xlsx = require('xlsx');
const fs = require('fs');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    const keyword = req.query.keyword
        ? { name: { $regex: req.query.keyword, $options: 'i' } }
        : {};
    let sortObj = {};
    if (req.query.sort === 'priceLowToHigh') sortObj = { price: 1 };
    else if (req.query.sort === 'priceHighToLow') sortObj = { price: -1 };

    // allow category filter
    if (req.query.category) {
        keyword.category = req.query.category;
    }

    const products = await Product.find({ ...keyword }).sort(sortObj);
    res.json(products);
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
    const product = new Product({
        name: 'Sample name',
        price: 0,
        countInStock: 0,
        category: 'Sample category',
        image: '/images/sample.jpg',
        description: 'Sample description'
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
    const { name, price, description, image, category, countInStock, offerPrice, packetRate, status } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name || product.name;
        product.price = price !== undefined ? price : product.price;
        product.description = description || product.description;
        product.image = image || product.image;
        product.category = category || product.category;
        product.countInStock = countInStock !== undefined ? countInStock : product.countInStock;
        product.offerPrice = offerPrice !== undefined ? offerPrice : product.offerPrice;
        product.packetRate = packetRate !== undefined ? packetRate : product.packetRate;
        product.status = status || product.status;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        await product.deleteOne();
        res.json({ message: 'Product removed' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
};

// @desc    Bulk upload products
// @route   POST /api/products/bulk
// @access  Private/Admin
const uploadProductsBulk = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file' });
        }

        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        if (data.length === 0) {
            return res.status(400).json({ message: 'File is empty' });
        }

        const products = data.map(item => ({
            name: item.name,
            price: item.price || 0,
            description: item.description || 'No description',
            image: item.image || '/images/sample.jpg',
            category: item.category || 'Uncategorized',
            countInStock: item.countInStock || 0,
            offerPrice: item.offerPrice,
            packetRate: item.packetRate,
            status: item.status || 'Active'
        }));

        await Product.insertMany(products);

        fs.unlinkSync(req.file.path);

        res.status(201).json({ message: `${products.length} products added successfully` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct, uploadProductsBulk };
