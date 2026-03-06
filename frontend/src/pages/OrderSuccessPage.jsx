import { Link, useLocation } from 'react-router-dom';

const OrderSuccessPage = () => {
    const location = useLocation();
    const orderId = location.state?.orderId;

    return (
        <div className="bg-brand-yellow min-h-screen pt-32 pb-20 flex items-center justify-center">
            <div className="container mx-auto px-4 max-w-2xl">
                <div className="bg-white rounded-3xl p-12 text-center shadow-xl border-4 border-brand-pink relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#FF4500 2px, transparent 2px)', backgroundSize: '20px 20px' }}></div>

                    <div className="relative z-10">
                        <div className="text-8xl mb-6">🎉</div>
                        <h1 className="text-4xl md:text-5xl font-display font-black text-brand-dark mb-4 filter drop-shadow">
                            Order <span className="text-brand-orange">Successful!</span>
                        </h1>
                        <p className="text-lg text-gray-600 mb-8 font-medium">
                            Thank you for your purchase! We've received your order and are packing your 90s nostalgia right away.
                        </p>

                        {orderId && (
                            <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
                                <p className="font-bold text-gray-700 mb-2">Order ID:</p>
                                <p className="font-mono text-sm tracking-widest text-brand-red font-black break-all">{orderId}</p>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/" className="btn-primary inline-block text-xl px-10 py-4 shadow-brand-orange/50">
                                Back to Home
                            </Link>
                            <Link to="/shop" className="btn-secondary inline-block text-xl px-10 py-4">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccessPage;

