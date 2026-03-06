import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { ShoppingCart } from 'lucide-react';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    const handleAddToCart = (e) => {
        e.preventDefault();
        if (product.countInStock > 0) {
            addToCart(product, 1);
        }
    };

    // Show image if available, otherwise fallback emoji
    const emoji = product.category?.includes('Kadalai') ? '🥜'
        : product.category?.includes('Koko') ? '🍫'
            : product.category?.includes('Gift') ? '🎁' : '🍬';

    return (
        <div className="card group flex flex-col h-full">
            <Link to={`/product/${product._id}`} className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center overflow-hidden block">
                {product.countInStock === 0 && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-20 backdrop-blur-sm">
                        <span className="bg-red-500 text-white font-bold px-4 py-1 rounded-full text-sm transform -rotate-12 shadow-lg">Out of Stock</span>
                    </div>
                )}
                {product.offerPrice && product.countInStock > 0 && (
                    <span className="absolute top-4 left-4 bg-brand-pink text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-sm animate-pulse">
                        OFFER
                    </span>
                )}
                {product.image ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                        onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                    />
                ) : null}
                <div
                    className={`w-full h-full flex items-center justify-center text-8xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 drop-shadow-xl z-10 ${product.image ? 'hidden' : 'flex'}`}
                >
                    {emoji}
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-brand-yellow/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </Link>

            <div className="p-6 flex flex-col flex-grow">
                <div className="mb-2">
                    <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">{product.category}</span>
                </div>
                <Link to={`/product/${product._id}`}>
                    <h3 className="text-xl font-bold text-gray-800 mb-2 leading-tight hover:text-brand-red transition-colors line-clamp-2">
                        {product.name}
                    </h3>
                </Link>

                <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                    <div>
                        {product.offerPrice ? (
                            <>
                                <span className="text-2xl font-black text-brand-red font-display tracking-tight">₹{product.offerPrice}</span>
                                <span className="text-sm text-gray-400 line-through ml-2">₹{product.price}</span>
                            </>
                        ) : (
                            <span className="text-2xl font-black text-brand-red font-display tracking-tight">₹{product.price}</span>
                        )}
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={product.countInStock === 0}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all transform active:scale-95 ${product.countInStock === 0
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-brand-dark text-white hover:bg-brand-orange hover:shadow-lg hover:-translate-y-1'
                            }`}
                        title="Add to Cart"
                    >
                        <ShoppingCart size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
