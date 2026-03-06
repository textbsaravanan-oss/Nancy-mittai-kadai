import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { cartItems, itemsPrice, shippingPrice, totalPrice, clearCart } = useCart();
    const { userInfo, authHeader } = useAuth();
    const [step, setStep] = useState(1);
    const [shipping, setShipping] = useState({
        name: userInfo?.name || '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        state: 'Tamil Nadu'
    });
    const [paymentMethod, setPaymentMethod] = useState('Razorpay');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handlePlaceOrder = async () => {
        setLoading(true);
        setError(null);
        try {
            const orderData = {
                orderItems: cartItems.map(item => ({
                    name: item.name,
                    qty: item.qty,
                    image: item.image || '',
                    price: item.offerPrice || item.price,
                    product: item._id,
                })),
                shippingAddress: {
                    address: shipping.address,
                    city: shipping.city,
                    postalCode: shipping.postalCode,
                    country: 'India',
                },
                paymentMethod,
                itemsPrice,
                shippingPrice,
                totalPrice,
            };

            const { data } = await axios.post('/api/orders', orderData, authHeader());
            clearCart();
            navigate('/order-success', { state: { orderId: data._id } });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to place order. Please try again.');
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        navigate('/cart');
        return null;
    }

    return (
        <div className="bg-gray-50 min-h-screen pt-32 pb-20">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-4xl font-display font-black text-center text-brand-dark mb-10">Checkout</h1>

                {/* Stepper */}
                <div className="flex justify-center items-center mb-12 relative max-w-lg mx-auto">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 transform -translate-y-1/2"></div>
                    <div className="absolute top-1/2 left-0 h-1 bg-brand-orange -z-10 transform -translate-y-1/2 transition-all" style={{ width: step === 1 ? '50%' : '100%' }}></div>
                    <div className="flex justify-between w-full z-10">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white transition-colors ${step >= 1 ? 'bg-brand-orange shadow-md' : 'bg-gray-300'}`}>1</div>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white transition-colors ${step >= 2 ? 'bg-brand-orange shadow-md' : 'bg-gray-300'}`}>2</div>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 text-sm font-medium">
                        {error}
                    </div>
                )}

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Form Section */}
                    <div className="w-full md:w-2/3">
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            {step === 1 && (
                                <div>
                                    <h2 className="text-2xl font-bold mb-6">📍 Shipping Address</h2>
                                    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                                                <input required type="text" className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-brand-orange focus:ring-0 outline-none" value={shipping.name} onChange={(e) => setShipping({ ...shipping, name: e.target.value })} placeholder="Your name" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                                                <input required type="tel" className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-brand-orange focus:ring-0 outline-none" value={shipping.phone} onChange={(e) => setShipping({ ...shipping, phone: e.target.value })} placeholder="+91 XXXXXXXXXX" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Complete Address</label>
                                            <textarea required rows="3" className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-brand-orange focus:ring-0 outline-none" value={shipping.address} onChange={(e) => setShipping({ ...shipping, address: e.target.value })} placeholder="Street name, landmark..." />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">City</label>
                                                <input required type="text" className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-brand-orange focus:ring-0 outline-none" value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })} />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">PIN Code</label>
                                                <input required type="text" className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-brand-orange focus:ring-0 outline-none" value={shipping.postalCode} onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })} />
                                            </div>
                                        </div>
                                        <button type="submit" className="btn-primary w-full py-4 mt-6 text-xl">Continue to Payment</button>
                                    </form>
                                </div>
                            )}

                            {step === 2 && (
                                <div>
                                    <h2 className="text-2xl font-bold mb-6">💳 Payment Method</h2>
                                    <div className="space-y-4 mb-8">
                                        <label className={`block border-2 rounded-xl p-4 cursor-pointer transition-all ${paymentMethod === 'Razorpay' ? 'border-brand-orange bg-brand-orange/5' : 'border-gray-200 hover:border-brand-yellow'}`}>
                                            <div className="flex items-center gap-4">
                                                <input type="radio" name="payment" className="w-5 h-5 accent-brand-orange" checked={paymentMethod === 'Razorpay'} onChange={() => setPaymentMethod('Razorpay')} />
                                                <div className="flex-1">
                                                    <span className="font-bold block text-lg">Razorpay Checkout</span>
                                                    <span className="text-sm text-gray-500">Secure UPI, Cards, Netbanking</span>
                                                </div>
                                                <div className="bg-blue-50 text-blue-900 border border-blue-200 px-2 py-1 rounded font-bold text-xs">Powered by Razorpay</div>
                                            </div>
                                        </label>

                                        <label className={`block border-2 rounded-xl p-4 cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-brand-orange bg-brand-orange/5' : 'border-gray-200 hover:border-brand-yellow'}`}>
                                            <div className="flex items-center gap-4">
                                                <input type="radio" name="payment" className="w-5 h-5 accent-brand-orange" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} />
                                                <div className="flex-1">
                                                    <span className="font-bold block text-lg">Cash on Delivery</span>
                                                    <span className="text-sm text-gray-500">Pay when your order arrives</span>
                                                </div>
                                                <div className="text-2xl">💵</div>
                                            </div>
                                        </label>
                                    </div>

                                    <div className="flex gap-4">
                                        <button onClick={() => setStep(1)} className="btn-secondary py-4 px-8">Back</button>
                                        <button
                                            onClick={handlePlaceOrder}
                                            disabled={loading}
                                            className="btn-primary flex-1 py-4 text-xl disabled:opacity-60 flex items-center justify-center gap-2"
                                        >
                                            {loading ? (
                                                <><div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div> Placing Order...</>
                                            ) : (
                                                `Place Order • ₹${totalPrice.toFixed(2)}`
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="w-full md:w-1/3">
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-brand-yellow/30 sticky top-28">
                            <h3 className="text-lg font-bold mb-4 border-b pb-2">Order Summary</h3>
                            <div className="space-y-2 mb-4 text-sm">
                                {cartItems.map(item => (
                                    <div key={item._id} className="flex justify-between text-gray-600">
                                        <span className="line-clamp-1 flex-1 pr-2">{item.name} × {item.qty}</span>
                                        <span className="font-medium">₹{((item.offerPrice || item.price) * item.qty).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t pt-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Total</span>
                                    <span className="text-3xl font-black text-brand-red">₹{totalPrice.toFixed(2)}</span>
                                </div>
                            </div>
                            {step === 2 && (
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mt-4">
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Delivering to</p>
                                    <p className="font-bold text-gray-800">{shipping.name}</p>
                                    <p className="text-sm text-gray-600 line-clamp-2">{shipping.address}, {shipping.city}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
