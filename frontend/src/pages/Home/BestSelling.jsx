import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../context/CartContext';

const BestSelling = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await axios.get('/api/products');
                // Get top 4 products (most stocked = best sellers)
                const sorted = [...data].sort((a, b) => b.countInStock - a.countInStock);
                setProducts(sorted.slice(0, 4));
            } catch {
                // Fallback to hardcoded if API fails
                setProducts([
                    { _id: '1', name: '1rs Kadalai Muttai', price: 29, category: 'Kadalai Muttai', countInStock: 150 },
                    { _id: '2', name: '5rs Koko Muttai', price: 42, category: 'Koko Muttai', countInStock: 100 },
                    { _id: '3', name: '90s Sweet Candy', price: 15, category: 'Traditional Candies', countInStock: 80 },
                    { _id: '4', name: 'Gift Pack Combo', price: 150, category: 'Gift Packs', countInStock: 50 },
                ]);
            }
            setLoading(false);
        };
        fetchProducts();
    }, []);

    const getEmoji = (category) => {
        if (category?.includes('Kadalai')) return '🥜';
        if (category?.includes('Koko')) return '🍫';
        if (category?.includes('Gift')) return '🎁';
        return '🍬';
    };

    return (
        <section className="py-20 bg-gray-50 bg-opacity-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-4xl text-brand-dark mb-2">Our <span className="text-brand-red">Best Sellers</span></h2>
                        <p className="text-gray-600">The most loved 90s snacks by our customers.</p>
                    </div>
                    <Link to="/shop" className="text-brand-orange font-bold hover:text-brand-red transition flex items-center gap-1 hidden sm:flex">
                        View All &rarr;
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="bg-white rounded-2xl h-72 animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <div key={product._id} className="card group">
                                <Link to={`/product/${product._id}`} className="relative h-48 bg-gray-100 flex items-center justify-center overflow-hidden block">
                                    {product.image ? (
                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                                    ) : (
                                        <div className="text-8xl transform group-hover:scale-110 transition-transform duration-500 drop-shadow-xl">
                                            {getEmoji(product.category)}
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-brand-yellow/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </Link>
                                <div className="p-6">
                                    <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1">{product.name}</h3>
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-xl font-black text-brand-red">
                                            ₹{product.offerPrice || product.price}
                                        </span>
                                        <div className="flex text-brand-yellow text-sm">{'★'.repeat(5)}</div>
                                    </div>
                                    <button
                                        onClick={() => addToCart(product, 1)}
                                        disabled={product.countInStock === 0}
                                        className="w-full bg-brand-dark text-white font-bold py-3 rounded-xl hover:bg-brand-orange transition-colors disabled:opacity-50"
                                    >
                                        {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-8 text-center sm:hidden">
                    <Link to="/shop" className="btn-secondary w-full inline-block">View All Products</Link>
                </div>
            </div>
        </section>
    );
};

export default BestSelling;
