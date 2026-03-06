import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Package, Star, ArrowLeft } from 'lucide-react';

const ProductPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [qty, setQty] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [addedToCart, setAddedToCart] = useState(false);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            setError(null);
            try {
                const { data } = await axios.get(`/api/products/${id}`);
                setProduct(data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Product not found');
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        addToCart(product, qty);
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-32 pb-20 flex justify-center items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-brand-orange"></div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen pt-32 text-center">
                <div className="text-6xl mb-4">😢</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Product not found</h2>
                <p className="text-gray-500 mb-6">{error}</p>
                <Link to="/shop" className="btn-secondary">Back to Shop</Link>
            </div>
        );
    }

    const emoji = product.category?.includes('Kadalai') ? '🥜'
        : product.category?.includes('Koko') ? '🍫'
            : product.category?.includes('Gift') ? '🎁' : '🍬';

    const displayPrice = product.offerPrice || product.price;
    const originalPrice = product.offerPrice ? product.price : null;

    return (
        <div className="bg-gray-50 min-h-screen pt-32 pb-20">
            <div className="container mx-auto px-4">
                {/* Breadcrumbs */}
                <div className="text-sm font-medium text-gray-500 mb-8 flex items-center gap-2">
                    <Link to="/" className="hover:text-brand-orange">Home</Link>
                    <span>/</span>
                    <Link to={`/shop?category=${product.category}`} className="hover:text-brand-orange">{product.category}</Link>
                    <span>/</span>
                    <span className="text-brand-dark">{product.name}</span>
                </div>

                <div className="bg-white rounded-3xl p-6 md:p-12 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-12">
                    {/* Product Image */}
                    <div className="w-full md:w-1/2">
                        <div className="aspect-square bg-gradient-to-tr from-brand-yellow/20 to-brand-pink/20 rounded-2xl flex items-center justify-center shadow-inner relative overflow-hidden group">
                            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#FF69B4 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
                            {product.image ? (
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover rounded-2xl"
                                    onError={e => { e.target.style.display = 'none'; }}
                                />
                            ) : (
                                <span className="relative z-10 text-[10rem] transform group-hover:scale-110 transition-transform duration-500 drop-shadow-2xl">{emoji}</span>
                            )}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="w-full md:w-1/2 flex flex-col">
                        <div className="mb-2">
                            <span className="bg-brand-orange text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{product.category}</span>
                        </div>

                        <h1 className="text-4xl lg:text-5xl font-display font-black text-brand-dark mb-4 drop-shadow-sm">{product.name}</h1>

                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex text-brand-yellow text-lg">★★★★★</div>
                            <span className="text-gray-500 font-medium text-sm">(Verified Quality)</span>
                        </div>

                        {/* Price */}
                        <div className="flex items-end gap-3 mb-6">
                            <span className="text-5xl font-black text-brand-red tracking-tight">₹{displayPrice}</span>
                            {originalPrice && (
                                <span className="text-xl text-gray-400 font-medium line-through mb-1">₹{originalPrice}</span>
                            )}
                            {product.packetRate && (
                                <span className="text-sm text-gray-500 mb-1 ml-2">Packet: ₹{product.packetRate}</span>
                            )}
                        </div>

                        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                            {product.description || 'Experience the rich, authentic taste of our traditional candy. Made with premium ingredients and pure flavors, satisfying your sweet cravings.'}
                        </p>

                        {/* Stock Indicator */}
                        <div className="flex items-center gap-2 mb-6">
                            <Package size={18} className={product.countInStock > 0 ? 'text-green-500' : 'text-red-500'} />
                            <span className={`font-medium ${product.countInStock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                {product.countInStock > 0 ? `${product.countInStock} in stock` : 'Out of Stock'}
                            </span>
                        </div>

                        <div className="mt-auto">
                            {product.countInStock > 0 ? (
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden w-full sm:w-32 h-14 bg-white">
                                        <button className="px-4 text-gray-500 hover:text-brand-dark hover:bg-gray-100 h-full font-bold transition-colors" onClick={() => setQty(qty > 1 ? qty - 1 : 1)}>-</button>
                                        <input
                                            type="number"
                                            className="w-full text-center font-bold outline-none no-spin"
                                            value={qty}
                                            onChange={(e) => setQty(Number(e.target.value))}
                                            min="1"
                                            max={product.countInStock}
                                        />
                                        <button className="px-4 text-gray-500 hover:text-brand-dark hover:bg-gray-100 h-full font-bold transition-colors" onClick={() => setQty(qty < product.countInStock ? qty + 1 : qty)}>+</button>
                                    </div>
                                    <button
                                        onClick={handleAddToCart}
                                        className={`btn-primary flex-1 h-14 text-xl flex items-center justify-center gap-2 transition-all ${addedToCart ? 'bg-green-500 hover:bg-green-500' : ''}`}
                                    >
                                        <ShoppingCart size={22} />
                                        {addedToCart ? '✓ Added to Cart!' : 'Add to Cart'}
                                    </button>
                                </div>
                            ) : (
                                <button disabled className="btn-primary w-full bg-gray-400 cursor-not-allowed hover:bg-gray-400 hover:shadow-md transform-none h-14 text-xl">
                                    Out of Stock
                                </button>
                            )}
                            <p className="text-center text-sm font-medium text-gray-500 mt-4">Safe & Secure Payment via Razorpay</p>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`.no-spin::-webkit-inner-spin-button, .no-spin::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }`}</style>
        </div>
    );
};

export default ProductPage;
