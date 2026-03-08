import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/Product/ProductCard';

const Shop = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const initialCategory = queryParams.get('category') || 'All';

    const [products, setProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState(initialCategory);
    const [sort, setSort] = useState('');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch products from backend
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get('/api/products');
                setAllProducts(data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load products');
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Fetch categories from backend
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get('/api/categories');
                setCategories(['All', ...data.map(c => c.name)]);
            } catch {
                setCategories(['All', 'Kadalai Mittai', 'Koko Mittai', 'Traditional Candies', 'Gift Packs']);
            }
        };
        fetchCategories();
    }, []);

    // Filter & sort products whenever dependencies change
    useEffect(() => {
        let filtered = [...allProducts];

        if (category !== 'All') {
            filtered = filtered.filter(p => p.category === category);
        }

        if (search.trim()) {
            filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
        }

        if (sort === 'priceLowToHigh') filtered.sort((a, b) => a.price - b.price);
        else if (sort === 'priceHighToLow') filtered.sort((a, b) => b.price - a.price);
        else if (sort === 'popularity') filtered.sort((a, b) => b.countInStock - a.countInStock);

        setProducts(filtered);
    }, [allProducts, category, sort, search]);

    const handleCategoryChange = (cat) => {
        setCategory(cat);
        navigate(cat === 'All' ? '/shop' : `/shop?category=${cat}`);
    };

    return (
        <div className="bg-gray-50 min-h-screen pt-24 pb-20">
            {/* Page Header */}
            <div className="bg-brand-red py-12 mb-12 border-b-[6px] border-brand-yellow relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 2px, transparent 2px)', backgroundSize: '20px 20px' }}></div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-display font-black text-white mb-4 drop-shadow-md">
                        Shop Our <span className="text-brand-yellow">Nostalgia</span>
                    </h1>
                    <p className="text-white/90 text-lg max-w-2xl mx-auto">
                        Browse through traditional candies and mittais. Fresh and carefully packed.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <div className="w-full md:w-1/4">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-28">
                            <h3 className="text-xl font-bold text-gray-800 mb-6">⚙️ Filters</h3>

                            {/* Search */}
                            <div className="mb-6">
                                <h4 className="font-bold text-gray-700 mb-3">Search</h4>
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-2 focus:border-brand-orange focus:ring-0 outline-none text-sm"
                                />
                            </div>

                            <div className="mb-6">
                                <h4 className="font-bold text-gray-700 mb-3">Categories</h4>
                                <ul className="space-y-2">
                                    {categories.map((cat) => (
                                        <li key={cat}>
                                            <button
                                                onClick={() => handleCategoryChange(cat)}
                                                className={`w-full text-left px-4 py-2 rounded-lg transition-colors font-medium text-sm ${category === cat ? 'bg-brand-pink text-white font-bold shadow-md' : 'text-gray-600 hover:bg-brand-yellow/20 hover:text-brand-dark'}`}
                                            >
                                                {cat}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="w-full md:w-3/4">
                        {/* Toolbar */}
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-center mb-8">
                            <p className="text-gray-600 font-medium mb-4 sm:mb-0">
                                Showing <span className="font-bold text-brand-dark">{products.length}</span> products
                            </p>
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <label htmlFor="sort" className="text-gray-600 font-medium text-sm whitespace-nowrap">Sort by:</label>
                                <select
                                    id="sort"
                                    value={sort}
                                    onChange={(e) => setSort(e.target.value)}
                                    className="border-2 border-gray-200 rounded-lg px-4 py-2 w-full sm:w-auto text-sm font-medium focus:border-brand-orange focus:ring-0 outline-none transition-colors cursor-pointer"
                                >
                                    <option value="">Default Sorting</option>
                                    <option value="popularity">Popularity</option>
                                    <option value="priceLowToHigh">Price: Low to High</option>
                                    <option value="priceHighToLow">Price: High to Low</option>
                                </select>
                            </div>
                        </div>

                        {/* Product Grid */}
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-brand-pink"></div>
                            </div>
                        ) : error ? (
                            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                                <div className="text-6xl mb-4">⚠️</div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">Failed to load products</h3>
                                <p className="text-gray-500">{error}</p>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                                <div className="text-6xl mb-4">😢</div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">No products found</h3>
                                <p className="text-gray-500 mb-6">Try selecting a different category or clearing filters.</p>
                                <button onClick={() => { handleCategoryChange('All'); setSearch(''); }} className="btn-secondary">View All Products</button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {products.map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shop;
