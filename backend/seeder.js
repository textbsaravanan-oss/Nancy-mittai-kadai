const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const bcrypt = require('bcryptjs');

dotenv.config();
connectDB();

const generateProducts = () => {
    const categories = ['Kadalai Muttai', 'Koko Muttai', 'Traditional Candies', 'Gift Packs'];
    const products = [];

    // Generate Kadalai Muttai variants
    const pricesKadalai = [1, 2, 5, 10];
    pricesKadalai.forEach((p, idx) => {
        products.push({
            name: `${p}rs Kadalai Muttai`,
            image: `/images/kadalai_${p}rs.jpg`,
            description: `Authentic traditional ${p}rs Kadalai Muttai made with pure standard jaggery and peanuts.`,
            category: 'Kadalai Muttai',
            price: p === 1 ? 29 : p === 2 ? 58 : p === 5 ? 42 : 44,
            countInStock: 100 + (idx * 10)
        });
    });

    // Generate Koko Muttai variants
    const pricesKoko = [1, 2, 5, 10];
    pricesKoko.forEach((p, idx) => {
        products.push({
            name: `${p}rs Koko Muttai`,
            image: `/images/koko_${p}rs.jpg`,
            description: `Sweet and nostalgic ${p}rs Koko Muttai that brings back 90s memories.`,
            category: 'Koko Muttai',
            price: p === 1 ? 29 : p === 2 ? 58 : p === 5 ? 42 : 44,
            countInStock: 150 + (idx * 10)
        });
    });

    // Generate remaining up to 100 products
    for (let i = 1; i <= 92; i++) {
        const pType = i % 2 === 0 ? 'Candy' : 'Sweet Pack';
        const pCat = i % 3 === 0 ? 'Gift Packs' : 'Traditional Candies';
        products.push({
            name: `Nostalgic 90s ${pType} Variant ${i}`,
            image: `/images/nostalgic_${i}.jpg`,
            description: `A classic retro candy from the 90s. Perfect for your sweet tooth.`,
            category: pCat,
            price: Math.floor(Math.random() * 100) + 10,
            countInStock: Math.floor(Math.random() * 200) + 20
        });
    }

    return products;
};

const importData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash('123456', salt);

        const createdUser = await User.create({
            name: 'N. Balamurugan',
            email: 'saravanankb2004@gmail.com',
            password: passwordHash,
            isAdmin: true,
            phone: '9443571641'
        });

        const sampleProducts = generateProducts();

        await Product.insertMany(sampleProducts);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
