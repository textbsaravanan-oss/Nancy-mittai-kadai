import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, Tag, LogOut, Menu, X, FolderTree } from 'lucide-react';
import { useState } from 'react';

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const menuItems = [
        { path: '/admin', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/admin/products', name: 'Products', icon: <Package size={20} /> },
        { path: '/admin/categories', name: 'Categories', icon: <FolderTree size={20} /> },
        { path: '/admin/orders', name: 'Orders', icon: <ShoppingCart size={20} /> },
        { path: '/admin/customers', name: 'Customers', icon: <Users size={20} /> },
        { path: '/admin/coupons', name: 'Coupons', icon: <Tag size={20} /> },
    ];

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    return (
        <div className="bg-gray-50 min-h-screen pt-20 flex">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`fixed md:sticky top-20 left-0 h-[calc(100vh-80px)] w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-brand-dark flex items-center gap-2">
                        <span className="bg-brand-orange text-white p-1 rounded-md">NM</span> Admin
                    </h2>
                    <button onClick={toggleSidebar} className="md:hidden text-gray-500 hover:text-brand-orange">
                        <X size={24} />
                    </button>
                </div>

                <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${isActive
                                        ? 'bg-orange-50 text-brand-orange shadow-sm'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-brand-orange'
                                    }`}
                            >
                                <span className={`${isActive ? 'text-brand-orange' : 'text-gray-400'}`}>{item.icon}</span>
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-500 hover:bg-red-50 transition-all font-medium"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 w-full max-w-full md:max-w-[calc(100vw-256px)] overflow-x-hidden">
                {/* Mobile Header Bar Context (Only visible on small screens to toggle sidebar) */}
                <div className="md:hidden bg-white p-4 border-b border-gray-200 flex items-center gap-3 sticky top-20 z-30">
                    <button onClick={toggleSidebar} className="text-gray-600 hover:text-brand-orange p-1 bg-gray-100 rounded-md">
                        <Menu size={24} />
                    </button>
                    <span className="font-semibold text-gray-800">Admin Menu</span>
                </div>

                <div className="p-4 md:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
