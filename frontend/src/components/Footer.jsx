const Footer = () => {
    return (
        <footer className="bg-brand-dark text-white pt-16 pb-8 border-t-4 border-brand-yellow">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h3 className="text-2xl font-display text-brand-yellow mb-4">nancy mittai kadai</h3>
                    <p className="text-gray-400 mb-4 italic">"From Our Kadaai to Your Heart – Authentic Traditional Sweets"</p>
                </div>
                <div>
                    <h4 className="text-xl font-bold mb-4 text-brand-pink">Contact Us</h4>
                    <p className="text-gray-300">Owner: N. Balamurugan</p>
                    <p className="text-gray-300">Phone: +91 9443571641</p>
                    <p className="text-gray-300">Email: saravanankb2004@gmail.com</p>
                    <p className="text-gray-300">Location: Tamil Nadu, India</p>
                </div>
                <div>
                    <h4 className="text-xl font-bold mb-4 text-brand-orange">Quick Links</h4>
                    <ul className="space-y-2 text-gray-300">
                        <li><a href="/shop" className="hover:text-brand-yellow transition">Shop All</a></li>
                        <li><a href="/about" className="hover:text-brand-yellow transition">About Us</a></li>
                        <li><a href="/policy" className="hover:text-brand-yellow transition">Privacy Policy</a></li>
                    </ul>
                </div>
            </div>
            <div className="container mx-auto px-4 text-center mt-12 pt-8 border-t border-gray-700 text-gray-500">
                <p>&copy; {new Date().getFullYear()} nancy mittai kadai. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
