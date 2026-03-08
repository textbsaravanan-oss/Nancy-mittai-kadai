import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import {
    TrendingUp, TrendingDown, ShoppingBag, Users, IndianRupee, AlertTriangle, Package
} from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };
                const { data } = await axios.get('/api/admin/stats', config);
                setStats(data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-orange"></div></div>;
    if (error) return <div className="text-red-500 bg-red-50 p-4 rounded-lg border border-red-200">{error}</div>;

    // Dummy data for charts since backend only returns basic stats currently
    const revenueData = [
        { name: 'Mon', revenue: 4000 },
        { name: 'Tue', revenue: 3000 },
        { name: 'Wed', revenue: 2000 },
        { name: 'Thu', revenue: 2780 },
        { name: 'Fri', revenue: 1890 },
        { name: 'Sat', revenue: 2390 },
        { name: 'Sun', revenue: 3490 },
    ];

    const categoryData = [
        { name: 'Kadalai Mittai', value: 400 },
        { name: 'Koko Mittai', value: 300 },
        { name: 'Candies', value: 300 },
        { name: 'Gift Packs', value: 200 },
    ];

    const COLORS = ['#FFD700', '#FFA500', '#FF69B4', '#FF4500'];

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-display font-black text-gray-800">Overview</h1>
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm font-bold text-gray-600 border border-gray-200">
                    Today
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-brand-orange/10 rounded-bl-full -z-0 transition-transform group-hover:scale-110"></div>
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-gray-500 font-medium">Total Revenue</p>
                            <div className="bg-orange-50 p-2 rounded-lg text-brand-orange">
                                <IndianRupee size={20} />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-gray-800 mb-1">₹{stats?.totalRevenue?.toLocaleString() || 0}</h3>
                            <p className="text-sm text-green-500 flex items-center gap-1 font-medium">
                                <TrendingUp size={14} /> +12.5% <span className="text-gray-400 font-normal">vs last month</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-bl-full -z-0 transition-transform group-hover:scale-110"></div>
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-gray-500 font-medium">Total Orders</p>
                            <div className="bg-blue-50 p-2 rounded-lg text-blue-500">
                                <ShoppingBag size={20} />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-gray-800 mb-1">{stats?.totalOrders || 0}</h3>
                            <p className="text-sm text-green-500 flex items-center gap-1 font-medium">
                                <TrendingUp size={14} /> +8.2% <span className="text-gray-400 font-normal">vs last month</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-brand-pink/10 rounded-bl-full -z-0 transition-transform group-hover:scale-110"></div>
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-gray-500 font-medium">Products</p>
                            <div className="bg-pink-50 p-2 rounded-lg text-brand-pink">
                                <Package size={20} />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-gray-800 mb-1">{stats?.totalProducts || 0}</h3>
                            <p className={`text-sm flex items-center gap-1 font-medium ${stats?.lowStockProducts > 0 ? 'text-red-500' : 'text-gray-400'}`}>
                                {stats?.lowStockProducts > 0 ? <AlertTriangle size={14} /> : null}
                                {stats?.lowStockProducts || 0} low stock
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-bl-full -z-0 transition-transform group-hover:scale-110"></div>
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-gray-500 font-medium">Total Customers</p>
                            <div className="bg-purple-50 p-2 rounded-lg text-purple-500">
                                <Users size={20} />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-gray-800 mb-1">{stats?.totalCustomers || 0}</h3>
                            <p className="text-sm text-green-500 flex items-center gap-1 font-medium">
                                <TrendingUp size={14} /> +5.1% <span className="text-gray-400 font-normal">vs last month</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 lg:col-span-2 relative overflow-hidden">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Revenue Analytics (Last 7 Days)</h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revenueData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dx={-10} tickFormatter={(value) => `₹${value}`} />
                                <Tooltip
                                    cursor={{ fill: '#FFF7ED' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
                                    formatter={(value) => [`₹${value}`, 'Revenue']}
                                />
                                <Bar dataKey="revenue" fill="#FFA500" radius={[4, 4, 0, 0]} maxBarSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Sales by Category</h3>
                    <div className="h-64 h-full w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
                                />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#4B5563' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-800">Recent Orders</h3>
                    <button className="text-brand-orange text-sm font-medium hover:underline">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 font-medium">Order ID</th>
                                <th className="px-6 py-4 font-medium">Customer</th>
                                <th className="px-6 py-4 font-medium">Date</th>
                                <th className="px-6 py-4 font-medium">Amount</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {stats?.recentOrders?.length > 0 ? (
                                stats.recentOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-mono font-medium text-gray-900">#{order._id.substring(0, 8)}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{order.user?.name || 'Guest'}</div>
                                            <div className="text-gray-500 text-xs">{order.user?.email}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            ₹{order.totalPrice.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' :
                                                order.orderStatus === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                                                    order.orderStatus === 'Packed' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-gray-100 text-gray-700'
                                                }`}>
                                                {order.orderStatus || 'Pending'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                        No recent orders found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
