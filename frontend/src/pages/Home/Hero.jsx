import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <section className="relative bg-brand-yellow pt-32 pb-20 overflow-hidden">
            <div className="absolute inset-0 opacity-10 pattern-dots"></div>
            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="md:w-1/2 text-center md:text-left">
                        <span className="bg-brand-pink text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider mb-6 inline-block">Since 1990s</span>
                        <h1 className="text-5xl md:text-7xl text-brand-red mb-6 leading-tight drop-shadow-sm">
                            Taste the Real <br />
                            <span className="text-brand-dark">90s Sweet Memories</span>
                        </h1>
                        <p className="text-xl text-gray-800 mb-8 font-medium">
                            Authentic traditional Kadalai Muttai, Koko Muttai and classic candies delivered straight to your door.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                            <Link to="/shop" className="btn-primary text-lg px-8 py-4">Shop Now</Link>
                            <Link to="/categories" className="btn-secondary text-lg px-8 py-4 bg-white">Explore Categories</Link>
                        </div>
                    </div>
                    <div className="md:w-1/2 relative">
                        {/* Interactive floating elements mimicking candies */}
                        <div className="absolute -top-10 -left-10 w-20 h-20 bg-brand-pink rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                        <div className="absolute top-0 -right-4 w-24 h-24 bg-brand-orange rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                        <div className="absolute -bottom-8 left-20 w-24 h-24 bg-brand-red rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

                        <div className="bg-white p-4 rounded-3xl shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500 relative z-10 border-4 border-brand-pink/20">
                            <div className="aspect-square bg-gradient-to-tr from-brand-yellow to-brand-orange rounded-2xl flex items-center justify-center overflow-hidden">
                                <h2 className="text-6xl font-display font-black text-white text-center transform -rotate-12 drop-shadow-lg">Nancy<br />Muttai<br />Kadai</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .pattern-dots { background-image: radial-gradient(#FF4500 2px, transparent 2px); background-size: 30px 30px; }
            `}</style>
        </section>
    );
};

export default Hero;
