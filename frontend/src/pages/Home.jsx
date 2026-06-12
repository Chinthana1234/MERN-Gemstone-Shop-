import React from 'react';
import Hero from '../components/home/Hero';
import Collections from '../components/home/Collections';
import FeaturedGems from '../components/home/FeaturedGems';
import Categories from '../components/home/Categories';

function Home() {
    return (
        <div className="flex flex-col w-full bg-white">
            <Hero />
            <Collections />
            <FeaturedGems />
            <Categories />
        </div>
    );
}

export default Home;
