import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthPage = () => {
    const location = useLocation();
    const [isLogin, setIsLogin] = useState(location.pathname !== '/register');
    const navigate = useNavigate();
    const { login, register, loading, error } = useAuth();

    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [localError, setLocalError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError(null);
        try {
            if (isLogin) {
                await login(formData.email, formData.password);
            } else {
                await register(formData.name, formData.email, formData.password);
            }
            navigate('/');
        } catch (err) {
            setLocalError(err.message);
        }
    };

    const displayError = localError || error;

    return (
        <div className="bg-gradient-to-br from-brand-yellow/30 to-brand-pink/20 min-h-screen flex items-center justify-center py-20 px-4">
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border flex flex-col md:flex-row w-full max-w-5xl overflow-hidden relative">

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange rounded-full mix-blend-multiply filter blur-3xl opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-pink rounded-full mix-blend-multiply filter blur-3xl opacity-20 transform -translate-x-1/2 translate-y-1/2"></div>

                {/* Info Panel */}
                <div className="w-full md:w-1/2 flex flex-col justify-center pr-0 md:pr-12 border-r-0 md:border-r border-gray-100 mb-10 md:mb-0 relative z-10">
                    <span className="bg-brand-orange text-white text-xs font-bold px-4 py-1 rounded-full w-max mb-6 uppercase tracking-wider hidden md:block">Welcome Back!</span>
                    <h1 className="text-4xl md:text-5xl font-display font-black text-brand-dark mb-4 leading-tight">
                        Authentic Sweets <br />
                        <span className="text-brand-red">Await You.</span>
                    </h1>
                    <p className="text-lg text-gray-600 mb-8 font-medium">Log in to track your nostalgic orders, manage gift addresses, and save items to your wishlist.</p>

                    <div className="hidden md:grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center gap-3">
                            <span className="text-3xl">🚚</span>
                            <span className="font-bold text-sm text-gray-700">Fast Delivery</span>
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center gap-3">
                            <span className="text-3xl">🛡️</span>
                            <span className="font-bold text-sm text-gray-700">Secure Payments</span>
                        </div>
                    </div>
                </div>

                {/* Form Panel */}
                <div className="w-full md:w-1/2 pl-0 md:pl-12 relative z-10">
                    <div className="flex bg-gray-100 p-1 rounded-xl mb-8 relative">
                        <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm transition-all duration-300 ${isLogin ? 'left-1' : 'left-[calc(50%+2px)]'}`}></div>
                        <button className={`flex-1 py-3 text-sm font-bold relative z-10 transition-colors ${isLogin ? 'text-brand-red' : 'text-gray-500'}`} onClick={() => setIsLogin(true)}>Log In</button>
                        <button className={`flex-1 py-3 text-sm font-bold relative z-10 transition-colors ${!isLogin ? 'text-brand-red' : 'text-gray-500'}`} onClick={() => setIsLogin(false)}>Sign Up</button>
                    </div>

                    {displayError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-4 text-sm font-medium">
                            {displayError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text" required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:border-brand-orange focus:ring-0 outline-none transition-all"
                                    placeholder="Your full name"
                                />
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email" required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:border-brand-orange focus:ring-0 outline-none transition-all"
                                placeholder="name@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
                            <input
                                type="password" required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:border-brand-orange focus:ring-0 outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-4 text-xl mt-4 disabled:opacity-60 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <><div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div> Please wait...</>
                            ) : (
                                isLogin ? 'Log In to Account' : 'Create Account'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
