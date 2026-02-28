'use client';

import React, { useState, useRef, useEffect } from 'react';

import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { BsCart3, BsHeart, BsPerson, BsSearch, BsCamera } from 'react-icons/bs';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useSession, signOut } from 'next-auth/react';

const Navbar = () => {
  const { data: session } = useSession();
  const { cartCount, wishlist } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const closeTimeoutRef = useRef(null);

  const handleProfileEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    setIsProfileOpen(true);
  };

  const handleProfileLeave = () => {
    // Keep it open for 1 second (per user request for it to stay longer)
    closeTimeoutRef.current = setTimeout(() => {
      setIsProfileOpen(false);
    }, 1000);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  return (
    <nav className="bg-primary border-b border-primary-hover fixed w-full top-0 left-0 z-50 h-20 flex items-center shadow-lg">
      <div className="max-w-screen-xl mx-auto px-4 w-full flex justify-between items-center h-full">
        {/* Logo Section */}
        <div className="flex items-center">
          <Link href="/">
            <span className="text-2xl font-black tracking-tighter text-white cursor-pointer italic">
              CART<span className="text-white/80 NOT-italic">ZEN</span>
            </span>
          </Link>
        </div>

        <div className="hidden lg:flex items-center space-x-8 h-full">
          {[
            { name: 'CONTACT', href: '/contact' },
            { name: 'FAQ', href: '/faq' },
            { name: 'SHIPPING', href: '/shipping' },
            { name: 'TERMS', href: '/terms' },
            { name: 'DASHBOARD', href: '/dashboard' },
          ].map((item) => (
            <Link key={item.name} href={item.href}>
              <span className="text-[13px] font-black text-white/90 hover:text-white hover:border-b-4 hover:border-white h-20 flex items-center transition-all cursor-pointer tracking-wider">
                {item.name}
              </span>
            </Link>
          ))}
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex items-center bg-white/10 border border-transparent focus-within:bg-white/20 focus-within:border-white/30 rounded px-4 py-2 w-80 transition-all group">
          <BsSearch className="text-white/60 mr-3 group-focus-within:text-white" />
          <input
            type="text"
            placeholder="Search for products, brands and more"
            className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none text-white placeholder-white/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {/* Visual Search (Camera Icon) */}
          <div className="relative ml-2">
            <BsCamera
              className="text-white/60 hover:text-white cursor-pointer transition-colors text-lg"
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
          <div
            className="relative"
            onMouseEnter={handleProfileEnter}
            onMouseLeave={handleProfileLeave}
          >
            <Link href={session ? "/profile" : "/login"}>
              <div className="flex flex-col items-center cursor-pointer group">
                {session?.user?.image ? (
                  <img src={session.user.image} alt="Profile" className="w-6 h-6 rounded-full object-cover border border-white/20 group-hover:border-white" />
                ) : (
                  <BsPerson className="text-xl text-white group-hover:text-white/80" />
                )}
                <span className="text-[10px] font-bold text-white group-hover:text-white/80">
                  {session ? session.user.name.split(' ')[0] : 'Profile'}
                </span>
              </div>
            </Link>

            {/* Simple Dropdown for Logout */}
            {session && (
              <div className={`absolute top-full right-0 w-32 bg-white shadow-xl rounded py-2 mt-2 transition-all duration-300 border border-gray-100 ${isProfileOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                <Link href="/profile" className="block px-4 py-2 text-xs font-black text-gray-700 hover:bg-gray-50 uppercase tracking-widest">My Account</Link>
                <Link href="/orders" className="block px-4 py-2 text-xs font-black text-gray-700 hover:bg-gray-50 uppercase tracking-widest">Orders</Link>
                <button
                  onClick={() => signOut()}
                  className="w-full text-left px-4 py-2 text-xs font-black text-primary hover:bg-gray-50 uppercase tracking-widest border-t border-gray-50 mt-1"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Wishlist */}
          <Link href="/wishlist">
            <div className="flex flex-col items-center cursor-pointer group relative">
              <BsHeart className="text-xl text-white group-hover:text-white/80" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-primary text-[8px] font-bold rounded-full px-1">
                  {wishlist.length}
                </span>
              )}
              <span className="text-[10px] font-bold text-white group-hover:text-white/80">Wishlist</span>
            </div>
          </Link>

          {/* Bag/Cart */}
          <Link href="/cart">
            <div className="flex flex-col items-center cursor-pointer group relative">
              <BsCart3 className="text-xl text-white group-hover:text-white/80" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-primary text-[8px] font-bold rounded-full px-1">
                  {cartCount}
                </span>
              )}
              <span className="text-[10px] font-bold text-white group-hover:text-white/80">Bag</span>
            </div>
          </Link>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;


