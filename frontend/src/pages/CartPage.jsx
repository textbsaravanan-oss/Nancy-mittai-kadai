import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingCart } from 'lucide-react';
import axios from 'axios';

const CartPage = () => {
    const navigate = useNavigate();
    const { cartItems, removeFromCart, updateQty, clearCart, itemsPrice, shippingPrice, totalPrice } = useCart();
    const [coupon, setCoupon] = useState('');
    const [discount, setDiscount] = useState(0);
    const [couponLoading, setCouponLoading] = useState(false);

    const discountAmount = itemsPrice * discount;
    const finalTotal = totalPrice - discountAmount;

    const applyCoupon = async () => {
        setCouponLoading(true);
        try {
            const { data } = await axios.get(`/api/coupons?code=${coupon.toUpperCase()}`);
            const found = data.find(c => c.code === coupon.toUpperCase() && c.isActive);
            if (found) {
                setDiscount(found.discount / 100);
                alert(`Coupon Applied! ${found.discount}% off`);
            } else {
                alert('Invalid or expired coupon code');
                setDiscount(0);
            }
        } catch {
            // Fallback for hardcoded test coupon
            if (coupon.toUpperCase() === 'NANCY90S') {
                setDiscount(0.20);
                alert('Coupon Applied! 20% off');
            } else {
                alert('Invalid Coupon Code');
                setDiscount(0);
            }
        }
        setCouponLoading(false);
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen pt-32 pb-20 flex flex-col justify-center items-center bg-gray-50">
                <ShoppingCart size={80} className="text-gray-300 mb-6" />
                <h2 className="text-3xl font-display font-bold text-gray-800 mb-4">Your cart is empty</h2>
                <p className="text-gray-500 mb-8 max-w-md text-center">Looks like you haven't added any of our delicious treats to your cart yet.</p>
                <Link to="/shop" className="btn-primary text-xl px-10 py-4">Start Shopping</Link>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pt-32 pb-20">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-display font-black text-brand-dark mb-8">
                    Shopping Cart <span className="text-brand-orange">({cartItems.length} items)</span>
                </h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Cart Items */}
                    <div className="w-full lg:w-2/3">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                            {/* Header (Desktop) */}
                            <div className="hidden md:grid grid-cols-6 gap-4 p-6 bg-gray-50 border-b border-gray-100 font-bold text-gray-600">
                                <div className="col-span-3">Product</div>
                                <div className="text-center">Price</div>
                                <div className="text-center">Quantity</div>
                                <div className="text-right">Total</div>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {cartItems.map((item) => {
                                    const itemPrice = item.offerPrice || item.price;
                                    const emoji = item.category?.includes('Kadalai') ? '🥜'
                                        : item.category?.includes('Koko') ? '🍫'
                                            : item.category?.includes('Gift') ? '🎁' : '🍬';

                                    return (
                                        <div key={item._id} className="grid grid-cols-1 md:grid-cols-6 gap-4 p-6 items-center">
                                            <div className="col-span-1 md:col-span-3 flex items-center gap-4">
                                                <div className="w-24 h-24 bg-gradient-to-tr from-brand-yellow/10 to-brand-orange/10 rounded-2xl flex items-center justify-center text-4xl shadow-inner flex-shrink-0 overflow-hidden">
                                                    {item.image ? (
                                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-2xl" onError={e => { e.target.style.display = 'none'; }} />
                                                    ) : (
                                                        <span className="text-4xl">{emoji}</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <Link to={`/product/${item._id}`} className="text-lg font-bold text-gray-800 hover:text-brand-red transition-colors line-clamp-2">
                                                        {item.name}
                                                    </Link>
                                                    <p className="text-xs text-gray-400 mt-1">{item.category}</p>
                                                    <button onClick={() => removeFromCart(item._id)} className="text-red-500 text-sm font-medium mt-2 flex items-center gap-1 hover:text-red-700">
                                                        <Trash2 size={14} /> Remove
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="text-center font-bold text-gray-700 hidden md:block">
                                                ₹{itemPrice}
                                            </div>

                                            <div className="flex items-center justify-between md:justify-center mt-4 md:mt-0">
                                                <div className="md:hidden font-bold text-gray-700">₹{itemPrice}</div>
                                                <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden w-28 h-10 bg-white">
                                                    <button className="w-1/3 text-gray-500 hover:bg-gray-100 h-full font-bold" onClick={() => updateQty(item._id, item.qty - 1)}>-</button>
                                                    <input
                                                        type="number"
                                                        className="w-1/3 text-center font-bold outline-none no-spin bg-transparent"
                                                        value={item.qty}
                                                        onChange={(e) => updateQty(item._id, Number(e.target.value))}
                                                        min="1"
                                                        max={item.countInStock}
                                                    />
                                                    <button className="w-1/3 text-gray-500 hover:bg-gray-100 h-full font-bold" onClick={() => updateQty(item._id, item.qty + 1)}>+</button>
                                                </div>
                                            </div>

                                            <div className="text-right font-black text-brand-red text-xl mt-4 md:mt-0">
                                                ₹{(item.qty * itemPrice).toFixed(2)}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="w-full lg:w-1/3">
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-brand-yellow/30 sticky top-28">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-4">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-600 font-medium">
                                    <span>Subtotal</span>
                                    <span>₹{itemsPrice.toFixed(2)}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-green-500 font-bold">
                                        <span>Discount ({(discount * 100).toFixed(0)}%)</span>
                                        <span>-₹{discountAmount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-gray-600 font-medium">
                                    <span>Shipping</span>
                                    <span>{shippingPrice === 0 ? <span className="text-green-500 font-bold">FREE</span> : `₹${shippingPrice}`}</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-6 mb-8">
                                <div className="flex justify-between items-end">
                                    <span className="text-xl font-bold text-gray-800">Total</span>
                                    <span className="text-4xl font-black text-brand-red">₹{finalTotal.toFixed(2)}</span>
                                </div>
                                <p className="text-right text-xs text-gray-400 mt-1">Inclusive of all taxes</p>
                            </div>

                            <div className="mb-8">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Apply Coupon</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Enter coupon code"
                                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 font-mono uppercase focus:border-brand-orange focus:ring-0 outline-none"
                                        value={coupon}
                                        onChange={(e) => setCoupon(e.target.value)}
                                    />
                                    <button onClick={applyCoupon} disabled={couponLoading} className="bg-gray-800 text-white font-bold px-6 py-3 rounded-xl hover:bg-black transition-colors disabled:opacity-60">
                                        {couponLoading ? '...' : 'Apply'}
                                    </button>
                                </div>
                            </div>

                            <button onClick={() => navigate('/checkout')} className="btn-primary w-full py-4 text-xl shadow-brand-red/30">
                                Proceed to Checkout
                            </button>

                            <div className="mt-6 flex justify-center items-center gap-2">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Secured By</span>
                                <span className="font-bold text-blue-900 border border-blue-200 px-2 py-1 rounded bg-blue-50 text-xs">Razorpay</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`.no-spin::-webkit-inner-spin-button, .no-spin::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }`}</style>
        </div>
    );
};

export default CartPage;
