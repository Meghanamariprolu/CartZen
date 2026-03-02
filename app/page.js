'use client';

import React from 'react';
import Link from 'next/link';
import Slider from 'react-slick';
import { motion } from 'framer-motion';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import FeaturedProductsGrid from './components/FeaturedProductsGrid';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const HomePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Hero Carousel Settings
  const heroSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    fade: true,
    arrows: false,
    customPaging: (i) => (
      <div className="w-2 h-2 bg-gray-300 rounded-full mt-4 mx-1 transition-all"></div>
    ),
    appendDots: (dots) => (
      <div style={{ bottom: '20px' }}>
        <ul className="m-0 flex justify-center"> {dots} </ul>
      </div>
    ),
  };

  const categories = [
    { name: 'Men', image: '/e7.jpg', slug: 'mens-shirts' },
    { name: 'Women', image: '/e5.jpg', slug: 'womens-dresses' },
    { name: 'Beauty', image: '/e9.jpg', slug: 'beauty' },
    { name: 'Watches', image: '/e6.jpg', slug: 'mens-watches' },
    { name: 'Furniture', image: '/e10.jpg', slug: 'furniture' },
    { name: 'Gadgets', image: '/e11.png', slug: 'smartphones' },
  ];

  const coupons = [
    { title: 'FLAT $500 OFF', code: 'CART500', min: 'on min purchase of $1999' },
    { title: 'FREE SHIPPING', code: 'FREESHIP', min: 'on your first order' },
  ];

  return (
    <div className="pb-20">
      {/* Category Navigation (Circles) */}
      <div className="py-10 overflow-hidden">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex justify-between items-center overflow-x-auto no-scrollbar space-x-4 md:space-x-0">
            {categories.map((cat, idx) => (
              <Link key={cat.name} href={`/shop?category=${cat.slug}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex flex-col items-center min-w-[80px] group cursor-pointer"
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden mb-2 border-2 border-transparent group-hover:border-primary transition-all">
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <span className="text-[10px] md:text-xs font-bold text-gray-800 uppercase tracking-wider">{cat.name}</span>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Carousel */}
      <div className="max-w-screen-2xl mx-auto px-0 md:px-4 mb-12">
        <Slider {...heroSettings}>
          {[1, 2, 3].map((num) => (
            <div key={num} className="relative outline-none">
              <div className="h-[250px] md:h-[500px] w-full overflow-hidden bg-gray-100 rounded-none md:rounded-lg">
                <img
                  src={`/home${num === 1 ? '3' : num === 2 ? '2' : '3'}.jpg`} // Fallback logic for demo
                  alt={`Hero ${num}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent flex items-center px-12">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  className="text-white max-w-lg"
                >
                  <h2 className="text-4xl md:text-6xl font-black mb-4 uppercase tracking-tighter">Season Finale</h2>
                  <p className="text-lg md:text-2xl font-light mb-8 italic">Up to 70% Off on Top Brands</p>
                  <Link href="/shop">
                    <button className="bg-white text-black px-8 py-3 font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-colors">Shop Now</button>
                  </Link>
                </motion.div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Coupons / Quick Wins */}
      <div className="max-w-screen-xl mx-auto px-4 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {coupons.map((coupon) => (
            <div key={coupon.code} className="bg-primary/5 border border-dashed border-primary p-6 rounded-lg flex justify-between items-center group hover:bg-primary/10 transition-colors">
              <div>
                <h4 className="text-2xl font-black text-primary">{coupon.title}</h4>
                <p className="text-sm text-gray-600 uppercase font-bold tracking-widest">{coupon.min}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-gray-400 mb-1">Use Code</p>
                <div className="bg-white border-2 border-primary text-primary px-4 py-2 font-mono font-bold rounded">
                  {coupon.code}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products (Dynamic Platzi Data) */}
      <div className="max-w-screen-xl mx-auto px-4 mb-20">
        <h3 className="text-2xl font-bold text-gray-800 uppercase tracking-[0.2em] mb-10 text-center">Featured Products</h3>

        {/* We need a client-side fetch here since we switched to dynamic API */}
        <FeaturedProductsGrid />
      </div>

      {/* Brand Highlights (Banners) */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-screen-xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-gray-800 uppercase tracking-[0.2em] mb-10">Iconic Brands</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              { name: 'Apple', color: 'bg-gray-900 text-white shadow-lg shadow-gray-200' },
              { name: 'Gucci', color: 'bg-emerald-900 text-white shadow-lg shadow-emerald-100' },
              { name: 'Dior', color: 'bg-rose-900 text-white shadow-lg shadow-rose-100' },
              { name: 'Huawei', color: 'bg-red-600 text-white shadow-lg shadow-red-100' },
              { name: 'Calvin Klein', color: 'bg-blue-900 text-white shadow-lg shadow-blue-100' },
            ].map((brand) => (
              <Link key={brand.name} href={`/shop?brand=${brand.name}`}>
                <div className={`${brand.color} p-6 rounded-xl flex items-center justify-center hover:scale-105 transition-all duration-300 cursor-pointer h-32 relative overflow-hidden group`}>
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                  <span className="text-xl md:text-2xl font-black tracking-tighter uppercase italic z-10 text-center">
                    {brand.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;






