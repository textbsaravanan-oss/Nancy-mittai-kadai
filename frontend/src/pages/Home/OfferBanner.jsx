import { Link } from 'react-router-dom';

const OfferBanner = () => {
    return (
        <section className="py-10">
            <div className="container mx-auto px-4">
                <div className="bg-gradient-to-r from-brand-orange to-brand-red rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-2xl border-4 border-brand-yellow">
                    {/* Decorative Background circles */}
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-24 left-10 w-48 h-48 bg-brand-yellow opacity-20 rounded-full blur-2xl"></div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="md:w-2/3 text-center md:text-left">
                            <span className="bg-white text-brand-red px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-4 inline-block shadow-sm">
                                Festival Special Offer
                            </span>
                            <h2 className="text-4xl md:text-5xl font-display font-black mb-4 leading-tight drop-shadow-md">
                                Get 20% OFF on all <br className="hidden md:block" />
                                <span className="text-brand-yellow">Gift Packs!</span>
                            </h2>
                            <p className="text-white/90 text-lg mb-0 font-medium max-w-xl">
                                Use code <strong className="font-mono bg-black/20 px-2 py-1 rounded">NANCY90S</strong> at checkout. Offer valid till stocks last.
                            </p>
                        </div>

                        <div className="md:w-1/3 flex flex-col items-center">
                            <div className="text-6xl mb-4 animate-bounce drop-shadow-xl">🎁</div>
                            <Link to="/shop?category=Gift Packs" className="bg-white text-brand-red font-bold text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:bg-brand-yellow hover:text-brand-dark transition-all transform hover:-translate-y-1 w-full text-center">
                                Shop Gift Packs
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OfferBanner;
