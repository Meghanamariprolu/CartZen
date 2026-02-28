'use client';

import React from 'react';
import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import { BsPatchCheck, BsArrowCounterclockwise } from 'react-icons/bs';

const Footer = () => {
    return (
        <footer className="bg-[#111827] border-t border-gray-800 pt-16 pb-8 mt-20 text-gray-400">
            <div className="max-w-screen-xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
                <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-6">Online Shopping</h3>
                    <ul className="space-y-3 text-sm">
                        <li><Link href="/shop?category=mens-shirts" className="hover:text-primary transition-colors">Men</Link></li>
                        <li><Link href="/shop?category=womens-dresses" className="hover:text-primary transition-colors">Women</Link></li>
                        <li><Link href="/shop?category=fragrances" className="hover:text-primary transition-colors">Beauty</Link></li>
                        <li><Link href="/shop?category=skincare" className="hover:text-primary transition-colors">Skincare</Link></li>
                        <li><Link href="/shop?category=home-decoration" className="hover:text-primary transition-colors">Home & Living</Link></li>
                        <li><Link href="/shop" className="hover:text-primary transition-colors">Gift Cards</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-6">Customer Policies</h3>
                    <ul className="space-y-3 text-sm">
                        <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
                        <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
                        <li><Link href="/terms" className="hover:text-primary transition-colors">T&C</Link></li>
                        <li><Link href="/terms" className="hover:text-primary transition-colors">Terms Of Use</Link></li>
                        <li><Link href="/shipping" className="hover:text-primary transition-colors">Track Orders</Link></li>
                        <li><Link href="/shipping" className="hover:text-primary transition-colors">Shipping</Link></li>
                        <li><Link href="/shipping" className="hover:text-primary transition-colors">Cancellation</Link></li>
                        <li><Link href="/shipping" className="hover:text-primary transition-colors">Returns</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-6">Experience App on Mobile</h3>
                    <div className="flex space-x-4 mb-8">
                        <div className="bg-black border border-gray-700 text-white px-3 py-1 rounded flex items-center space-x-2 cursor-pointer hover:border-gray-500 transition-colors">
                            <span className="text-xs">GET IT ON <br /><span className="text-sm font-bold">Google Play</span></span>
                        </div>
                        <div className="bg-black border border-gray-700 text-white px-3 py-1 rounded flex items-center space-x-2 cursor-pointer hover:border-gray-500 transition-colors">
                            <span className="text-xs">Download on the <br /><span className="text-sm font-bold">App Store</span></span>
                        </div>
                    </div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Keep in touch</h3>
                    <div className="flex space-x-6">
                        <FaFacebook className="text-gray-400 text-xl cursor-pointer hover:text-white transition-colors" />
                        <FaTwitter className="text-gray-400 text-xl cursor-pointer hover:text-white transition-colors" />
                        <FaYoutube className="text-gray-400 text-xl cursor-pointer hover:text-white transition-colors" />
                        <FaInstagram className="text-gray-400 text-xl cursor-pointer hover:text-white transition-colors" />
                    </div>
                </div>
                <div className="flex flex-col items-start space-y-6">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center border border-white/5 shadow-inner">
                            <BsPatchCheck className="text-2xl text-white" />
                        </div>
                        <p className="text-sm text-gray-400 font-bold leading-tight uppercase tracking-tight">100% ORIGINAL <span className="font-normal block text-[10px] mt-1 text-gray-500 tracking-tighter">guarantee for all products</span></p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center border border-white/5 shadow-inner">
                            <BsArrowCounterclockwise className="text-2xl text-white" />
                        </div>
                        <p className="text-sm text-gray-400 font-bold leading-tight uppercase tracking-tight">EASY RETURNS <span className="font-normal block text-[10px] mt-1 text-gray-500 tracking-tighter">within 14 days of delivery</span></p>
                    </div>
                </div>
            </div>
            <div className="max-w-screen-xl mx-auto px-4 mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
                <p>&copy; 2026 CartZen. All Rights Reserved.</p>
                <p className="mt-4 md:mt-0 italic font-bold">Made with ❤️ by Meghana</p>
            </div>
        </footer>
    );
};

export default Footer;
