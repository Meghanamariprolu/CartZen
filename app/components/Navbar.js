'use client'; // Ensure it's a client-side component
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BsCart3 } from 'react-icons/bs'; // Import the BsCart3 icon from react-icons/bs

const Navbar = ({ cartCount }) => {
  return (
    <nav className=" text-white p-4 fixed w-full top-0 left-0 z-50 bg-gradient-to-r from-teal-400 via-purple-500 to-pink-500">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center">
        {/* Left Section (Logo or Home) */}
        <div className="flex items-center space-x-6">
          <Link href="/">
            <span className="text-2xl font-bold text-black-300 cursor-pointer">CartZen</span>
          </Link>
        </div>

        {/* Right Section (Shop, Payment, Cart, Logout) */}
        <div className="flex items-center space-x-4">
          {/* Shop Page Link */}
          <Link href="/shop">
            <span className="hover:text-blue-400 cursor-pointer">Shop</span>
          </Link>

          {/* Cart Link with Icon and Cart Count */}
          <Link href="/cart" className="relative flex items-center space-x-2 hover:text-blue-400 cursor-pointer">
            <BsCart3 className="text-xl" /> {/* Cart Icon */}
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs px-2 py-1 -mt-2 -mr-2">
                {cartCount}
              </span>
            )}
            <span>Cart</span>
          </Link>

          {/* Payment Page Link */}
          <Link href="/payment">
            <span className="hover:text-blue-400 cursor-pointer">Payment</span>
          </Link>

          {/* Login Page Link */}
          <Link href="/wishlist">
            <span className="hover:text-blue-400 cursor-pointer">Wishlist</span>
          </Link>

          {/* Register Page Link */}
          <Link href="/register">
            <span className="hover:text-blue-400 cursor-pointer">AboutUs</span>
          </Link>

          {/* Logout Page Link */}
          <Link href="/logout">
            <span className="hover:text-blue-400 cursor-pointer">Logout</span> {/* Added Logout Link */}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

