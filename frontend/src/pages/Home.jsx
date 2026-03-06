import Hero from './Home/Hero';
import Categories from './Home/Categories';
import BestSelling from './Home/BestSelling';
import OfferBanner from './Home/OfferBanner';

const Home = () => {
    return (
        <div className="bg-gray-50 min-h-screen">
            <Hero />
            <Categories />
            <OfferBanner />
            <BestSelling />
        </div>
    );
};

export default Home;
