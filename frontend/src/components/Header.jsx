import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, User, LogOut } from 'lucide-react';

const Header = () => {
    const { cartCount } = useCart();
    const { userInfo, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="fixed w-full top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-brand-yellow/30">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2">
                    <span className="text-2xl font-display font-bold text-brand-red">Nancy Muttai Kadai</span>
                </Link>

                <nav className="hidden md:flex items-center gap-8 font-semibold text-gray-600">
                    <Link to="/" className="hover:text-brand-orange transition-colors">Home</Link>
                    <Link to="/shop" className="hover:text-brand-orange transition-colors">Shop</Link>
                    <Link to="/categories" className="hover:text-brand-orange transition-colors">Categories</Link>
                </nav>

                <div className="flex items-center gap-4">
                    <Link to="/cart" className="relative group p-2">
                        <ShoppingCart size={26} className="text-gray-700 group-hover:text-brand-orange transition-colors" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-brand-pink text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {userInfo ? (
                        <div className="flex items-center gap-3">
                            <span className="hidden md:flex items-center gap-1 text-sm font-semibold text-gray-700">
                                <User size={16} /> {userInfo.name}
                            </span>
                            {userInfo.isAdmin && (
                                <Link to="/admin" className="hidden md:block text-xs bg-brand-dark text-white px-3 py-1 rounded-full font-bold hover:bg-brand-orange transition-colors">
                                    Admin Panel
                                </Link>
                            )}
                            <button onClick={handleLogout} className="hidden md:flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-red-600 transition-colors">
                                <LogOut size={16} />
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="btn-secondary hidden md:block">Login</Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
