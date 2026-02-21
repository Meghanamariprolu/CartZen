'use client';

import React, { useState, useRef, useEffect } from 'react';

import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { BsCart3, BsHeart, BsPerson, BsSearch, BsCamera } from 'react-icons/bs';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const { cartCount, wishlist } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    // Check for saved profile image on mount and when local storage changes
    const loadProfileImage = () => {
      const savedProfile = localStorage.getItem('user_profile');
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        if (parsed.image) {
          setProfileImage(parsed.image);
        }
      }
    };

    loadProfileImage();

    // Optional: Listen for storage events to update immediately if changed in another tab
    window.addEventListener('storage', loadProfileImage);
    return () => window.removeEventListener('storage', loadProfileImage);
  }, []);

  const handleCameraClick = () => {
    // Simplified for web environment:
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Simulate visual search by navigating with a query param
      router.push(`/shop?visual_search=true&img=${file.name}`);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-100 fixed w-full top-0 left-0 z-50 h-20 flex items-center shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4 w-full flex justify-between items-center h-full">
        {/* Logo Section */}
        <div className="flex items-center">
          <Link href="/">
            <span className="text-2xl font-black tracking-tighter text-gray-900 cursor-pointer italic">
              CART<span className="text-primary NOT-italic">ZEN</span>
            </span>
          </Link>
        </div>

        <div className="hidden lg:flex items-center space-x-8 h-full">
          {[
            { name: 'HOME', slug: 'home-decoration' },
            { name: 'WATCHES', slug: 'mens-watches' },
            { name: 'DASHBOARD', href: '/dashboard' }
          ].map((item) => (
            <Link key={item.name} href={item.href || `/shop?category=${item.slug}`}>
              <span className="text-[13px] font-black text-gray-800 hover:border-b-4 hover:border-primary h-20 flex items-center transition-all cursor-pointer tracking-wider">
                {item.name}
              </span>
            </Link>
          ))}
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex items-center bg-gray-100 border border-transparent focus-within:bg-white focus-within:border-gray-200 rounded px-4 py-2 w-80 transition-all group">
          <BsSearch className="text-gray-400 mr-3 group-focus-within:text-gray-900" />
          <input
            type="text"
            placeholder="Search for products, brands and more"
            className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {/* Visual Search (Camera Icon) */}
          <div className="relative ml-2">
            <BsCamera
              className="text-gray-400 hover:text-primary cursor-pointer transition-colors text-lg"
              onClick={handleCameraClick}
              title="Search by image"
            />
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>
        </div>

        {/* Icons Section */}
        <div className="flex items-center space-x-6">
          {/* Profile */}
          <Link href="/profile">
            <div className="flex flex-col items-center cursor-pointer group">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-6 h-6 rounded-full object-cover border border-gray-200 group-hover:border-primary" />
              ) : (
                <BsPerson className="text-xl text-gray-800 group-hover:text-primary" />
              )}
              <span className="text-[10px] font-bold text-gray-800 group-hover:text-primary">Profile</span>
            </div>
          </Link>

          {/* Wishlist */}
          <Link href="/wishlist">
            <div className="flex flex-col items-center cursor-pointer group relative">
              <BsHeart className="text-xl text-gray-800 group-hover:text-primary" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[8px] font-bold rounded-full px-1">
                  {wishlist.length}
                </span>
              )}
              <span className="text-[10px] font-bold text-gray-800 group-hover:text-primary">Wishlist</span>
            </div>
          </Link>

          {/* Bag/Cart */}
          <Link href="/cart">
            <div className="flex flex-col items-center cursor-pointer group relative">
              <BsCart3 className="text-xl text-gray-800 group-hover:text-primary" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[8px] font-bold rounded-full px-1">
                  {cartCount}
                </span>
              )}
              <span className="text-[10px] font-bold text-gray-800 group-hover:text-primary">Bag</span>
            </div>
          </Link>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;


