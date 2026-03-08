import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CATEGORY_STYLES = [
    { color: 'bg-brand-orange', emoji: '🥜' },
    { color: 'bg-brand-dark', emoji: '🍫' },
    { color: 'bg-brand-pink', emoji: '🍬' },
    { color: 'bg-brand-red', emoji: '🎁' },
    { color: 'bg-purple-500', emoji: '🍭' },
    { color: 'bg-teal-500', emoji: '🫙' },
];

const Categories = () => {
    const [cats, setCats] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get('/api/categories');
                const mapped = data.map((c, i) => ({
                    name: c.name,
                    color: CATEGORY_STYLES[i % CATEGORY_STYLES.length].color,
                    emoji: CATEGORY_STYLES[i % CATEGORY_STYLES.length].emoji,
                }));
                setCats(mapped);
            } catch {
                // fallback
                setCats([
                    { name: 'Kadalai Mittai', color: 'bg-brand-orange', emoji: '🥜' },
                    { name: 'Koko Mittai', color: 'bg-brand-dark', emoji: '🍫' },
                    { name: 'Traditional Candies', color: 'bg-brand-pink', emoji: '🍬' },
                    { name: 'Gift Packs', color: 'bg-brand-red', emoji: '🎁' },
                ]);
            }
        };
        fetchCategories();
    }, []);

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl text-brand-dark mb-4">Shop by <span className="text-brand-orange">Category</span></h2>
                    <div className="w-24 h-1 bg-brand-yellow mx-auto rounded-full"></div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {cats.map((cat, idx) => (
                        <div
                            key={idx}
                            onClick={() => navigate(`/shop?category=${cat.name}`)}
                            className={`${cat.color} rounded-3xl p-8 text-center cursor-pointer transform hover:-translate-y-2 transition-all duration-300 shadow-md hover:shadow-xl border-4 border-transparent hover:border-white group`}
                        >
                            <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform">{cat.emoji}</div>
                            <h3 className="text-xl font-bold text-white mb-2">{cat.name}</h3>
                            <span className="text-white/80 text-sm font-medium inline-block bg-black/10 px-3 py-1 rounded-full">Explore &rarr;</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Categories;
