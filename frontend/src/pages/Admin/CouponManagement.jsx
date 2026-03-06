import { useState, useEffect } from 'react';
import axios from 'axios';
import { Tag, Trash2, Percent } from 'lucide-react';

const CouponManagement = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Form state
    const [code, setCode] = useState('');
    const [discount, setDiscount] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [isActive, setIsActive] = useState(true);

    const fetchCoupons = async () => {
        try {
            setLoading(true);
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.get('/api/coupons', config);
            setCoupons(data);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            await axios.post('/api/coupons', { code, discount, expiryDate, isActive }, config);

            setCode('');
            setDiscount('');
            setExpiryDate('');
            setIsActive(true);
            fetchCoupons();
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        }
    };

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this coupon?')) {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                await axios.delete(`/api/coupons/${id}`, config);
                fetchCoupons();
            } catch (err) {
                alert(err.response?.data?.message || err.message);
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-display font-black text-gray-800">Coupon Management</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit lg:col-span-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Tag size={20} className="text-brand-orange" />
                        Create Coupon
                    </h3>
                    <form onSubmit={submitHandler} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value.toUpperCase())}
                                required
                                placeholder="e.g. DIWALI50"
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 focus:ring-brand-orange focus:border-brand-orange outline-none uppercase"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Discount %</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={discount}
                                    onChange={(e) => setDiscount(e.target.value)}
                                    required
                                    min="1"
                                    max="100"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-4 pr-10 py-2 focus:ring-brand-orange focus:border-brand-orange outline-none"
                                />
                                <Percent size={16} className="absolute right-3 top-3 text-gray-400" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                            <input
                                type="date"
                                value={expiryDate}
                                onChange={(e) => setExpiryDate(e.target.value)}
                                required
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 focus:ring-brand-orange focus:border-brand-orange outline-none"
                            />
                        </div>
                        <div className="flex items-center gap-2 pt-2">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={isActive}
                                onChange={(e) => setIsActive(e.target.checked)}
                                className="rounded text-brand-orange focus:ring-brand-orange w-4 h-4"
                            />
                            <label htmlFor="isActive" className="text-sm font-medium text-gray-700 cursor-pointer">
                                Active Status
                            </label>
                        </div>
                        <button type="submit" className="w-full btn-primary py-2 rounded-lg mt-4">Create Coupon</button>
                    </form>
                </div>

                {/* List */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 font-medium">Code</th>
                                <th className="px-6 py-4 font-medium">Discount</th>
                                <th className="px-6 py-4 font-medium">Expiry Date</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan="5" className="text-center py-8">Loading...</td></tr>
                            ) : error ? (
                                <tr><td colSpan="5" className="text-center py-8 text-red-500">{error}</td></tr>
                            ) : coupons.map(c => (
                                <tr key={c._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-mono font-bold text-gray-900">{c.code}</td>
                                    <td className="px-6 py-4 font-medium text-brand-orange">{c.discount}% OFF</td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {new Date(c.expiryDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {c.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => deleteHandler(c._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {!loading && coupons.length === 0 && (
                                <tr><td colSpan="5" className="text-center py-8 text-gray-500">No coupons found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CouponManagement;
