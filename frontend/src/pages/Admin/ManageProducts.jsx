import { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Plus, Search, Edit, Trash2, Upload } from 'lucide-react';

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [uploading, setUploading] = useState(false);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/api/products');
            setProducts(data);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                await axios.delete(`/api/products/${id}`, config);
                fetchProducts();
            } catch (err) {
                alert(err.response?.data?.message || err.message);
            }
        }
    };

    const handleBulkUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            setUploading(true);
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            await axios.post('/api/products/bulk', formData, config);
            setUploading(false);
            alert('Products uploaded successfully');
            fetchProducts();
        } catch (err) {
            setUploading(false);
            alert(err.response?.data?.message || err.message);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-display font-black text-gray-800">Manage Products</h1>
                <div className="flex gap-3">
                    <label className="btn-secondary flex items-center gap-2 cursor-pointer opacity-90 hover:opacity-100">
                        {uploading ? <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-brand-dark"></div> : <Upload size={18} />}
                        <span>Bulk Upload</span>
                        <input type="file" className="hidden" accept=".xlsx, .xls, .csv" onChange={handleBulkUpload} />
                    </label>
                    <button className="btn-primary flex items-center gap-2">
                        <Plus size={18} /> Add Product
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                <div className="p-4 bg-gray-50 border-b border-gray-100">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white border text-sm border-gray-200 rounded-lg pl-10 pr-4 py-2 focus:border-brand-orange focus:ring-0 outline-none w-64"
                        />
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex justify-center items-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-orange"></div></div>
                    ) : error ? (
                        <div className="p-4 text-red-500">{error}</div>
                    ) : (
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Product</th>
                                    <th className="px-6 py-4 font-medium">Price</th>
                                    <th className="px-6 py-4 font-medium">Category</th>
                                    <th className="px-6 py-4 font-medium">Stock</th>
                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredProducts.map(p => (
                                    <tr key={p._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                                                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <div className="font-medium">{p.name}</div>
                                                <div className="text-xs text-gray-500">#{p._id.substring(0, 8)}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">₹{p.price}</td>
                                        <td className="px-6 py-4">
                                            <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full">{p.category}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`font-medium ${p.countInStock > 0 ? 'text-green-600' : 'text-red-500'}`}>{p.countInStock}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                                                    <Edit size={18} />
                                                </button>
                                                <button onClick={() => deleteHandler(p._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredProducts.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No products found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageProducts;
