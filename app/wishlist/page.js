'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { BsTrash, BsBag, BsHeart, BsStarFill } from 'react-icons/bs';
import { motion, AnimatePresence } from 'framer-motion';

const WishlistPage = () => {
  const { wishlist, toggleWishlist, addToCart } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 bg-white">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
          <BsHeart className="text-4xl text-gray-200" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 uppercase tracking-widest mb-2">Your wishlist is empty</h2>
        <p className="text-gray-500 mb-8 text-center max-w-xs text-sm">Save items that you like in your wishlist. Review them anytime and easily move them to the bag.</p>
        <Link href="/shop" className="border-2 border-primary text-primary px-12 py-3 font-black uppercase tracking-widest rounded hover:bg-primary/5 transition-colors inline-block">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-32 pb-12 px-4">
      <div className="max-w-screen-xl mx-auto">
        <h1 className="text-xl font-black text-gray-900 uppercase tracking-[0.2em] mb-10 border-b border-gray-100 pb-6">
          My Wishlist <span className="text-gray-400 font-normal ml-2">({wishlist.length} items)</span>
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <AnimatePresence>
            {wishlist.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={item.id}
                className="group border border-gray-100 rounded-sm relative"
              >
                {/* Image Section */}
                <div className="relative aspect-[3/4] overflow-hidden bg-[#f5f5f6]">
                  <img src={item.image} alt={item.title} className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110" />

                  {/* Remove Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault(); // Prevent link click
                      e.stopPropagation();
                      toggleWishlist(item);
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full text-gray-400 hover:text-red-500 transition-colors shadow-sm z-10 hover:bg-white"
                  >
                    <BsTrash className="text-sm" />
                  </button>

                  <div className="absolute bottom-2 left-2 bg-white/90 px-1.5 py-0.5 rounded-sm text-[9px] font-black flex items-center space-x-1">
                    <span>{typeof item.rating === 'object' ? item.rating.rate : (item.rating || '4.0')}</span>
                    <BsStarFill className="text-green-600 text-[7px]" />
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-3 border-t border-gray-100">
                  <h3 className="text-[12px] font-black text-gray-900 uppercase tracking-tight truncate">{item.brand || 'CartZen'}</h3>
                  <p className="text-[11px] text-gray-500 truncate mb-1.5">{item.title}</p>
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-[13px] font-black text-gray-900">${item.price}</span>
                    {item.discountPercentage && (
                      <span className="text-[10px] text-orange-400 font-bold">({item.discountPercentage.toFixed(0)}% OFF)</span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      addToCart(item);
                      toggleWishlist(item);
                      // Optional: Navigate to cart or show toast. For now, just add.
                    }}
                    className="w-full border-t border-gray-100 pt-3 flex items-center justify-center space-x-2 text-primary font-black uppercase text-[10px] tracking-widest hover:text-primary-hover transition-colors"
                  >
                    <BsBag />
                    <span>Move to Bag</span>
                  </button>
                </div>

                <Link href={`/product/${item.id}`} className="absolute inset-x-0 top-0 h-[70%] z-[1]"></Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
