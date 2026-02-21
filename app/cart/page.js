'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { BsTrash, BsShieldCheck, BsTruck, BsPlus, BsDash } from 'react-icons/bs';
import { motion, AnimatePresence } from 'framer-motion';

const BagPage = () => {
  const { cart, removeFromCart, updateQuantity, cartCount } = useCart();

  const totalMRP = cart.reduce((total, item) => total + (item.price * 1.5 * item.quantity), 0);
  const totalDiscount = totalMRP - (cart.reduce((total, item) => total + (item.price * item.quantity), 0));
  const totalAmount = totalMRP - totalDiscount;

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <img src="/empty-bag.png" alt="Empty Bag" className="w-64 mb-8 opacity-20" onError={(e) => e.target.style.display = 'none'} />
        <h2 className="text-xl font-bold text-gray-800 mb-2">Hey, it feels so light!</h2>
        <p className="text-gray-500 mb-8 text-center max-w-xs">There is nothing in your bag. Let's add some items.</p>
        <Link href="/wishlist">
          <button className="border border-primary text-primary px-10 py-3 font-bold rounded uppercase tracking-widest hover:bg-primary/5 transition-colors mb-4">Add items from wishlist</button>
        </Link>
        <Link href="/shop" className="text-primary font-bold hover:underline">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-12 px-4">
      <div className="max-w-screen-xl mx-auto flex flex-col lg:flex-row gap-8">

        {/* Left Section: Items */}
        <div className="lg:w-2/3">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
            <div className="flex items-center space-x-4">
              <span className="font-bold text-gray-900 uppercase tracking-widest text-sm">Check Delivery Services</span>
              <span className="text-xs text-primary font-bold border border-primary px-2 py-1 rounded">ENTER PIN CODE</span>
            </div>
          </div>

          <div className="bg-primary/5 p-4 rounded-sm flex items-center space-x-4 mb-6 border border-primary/20">
            <BsTruck className="text-primary text-xl" />
            <p className="text-sm font-bold text-gray-700">Yay! <span className="text-gray-900">No convenience fee</span> on this order.</p>
          </div>

          <div className="space-y-4">
            <AnimatePresence>
              {cart.map((item) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  key={item.id}
                  className="flex border border-gray-100 p-4 rounded group relative"
                >
                  <div className="w-24 h-32 bg-gray-50 rounded flex-shrink-0">
                    <img src={item.image} alt={item.title} className="w-full h-full object-contain p-2" />
                  </div>
                  <div className="ml-4 flex-grow">
                    <h3 className="font-bold text-gray-900 text-sm mb-1 truncate uppercase">CartZen Exclusive</h3>
                    <p className="text-sm text-gray-500 mb-2 truncate max-w-md">{item.title}</p>

                    <div className="flex items-center space-x-4 mb-4">
                      <div className="bg-gray-100 px-2 py-1 rounded text-[10px] font-bold text-gray-700 flex items-center space-x-2">
                        <span>Size: M</span>
                      </div>
                      <div className="bg-gray-100 px-2 py-1 rounded text-[10px] font-bold text-gray-700 flex items-center space-x-2">
                        <span>Qty: {item.quantity}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                      <span className="text-xs text-gray-400 line-through">${(item.price * 1.5 * item.quantity).toFixed(2)}</span>
                      <span className="text-xs text-orange-400 font-bold">33% OFF</span>
                    </div>

                    <div className="absolute top-4 right-4 flex space-x-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                        <BsTrash className="text-lg" />
                      </button>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center mt-4 border border-gray-100 w-fit rounded overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 hover:bg-gray-50 text-gray-600 border-r border-gray-100"
                      >
                        <BsDash />
                      </button>
                      <span className="px-4 text-sm font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 hover:bg-gray-50 text-gray-600 border-l border-gray-100"
                      >
                        <BsPlus />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Section: Price Summary */}
        <div className="lg:w-1/3">
          <div className="sticky top-24">
            <h3 className="font-bold text-gray-900 uppercase tracking-widest text-xs mb-6">Price Details ({cartCount} Items)</h3>

            <div className="space-y-4 text-sm text-gray-700 mb-6">
              <div className="flex justify-between">
                <span>Total MRP</span>
                <span>${totalMRP.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Discount on MRP</span>
                <span>-${totalDiscount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Coupon Discount</span>
                <span className="text-primary font-bold cursor-pointer">Apply Coupon</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="text-green-600 font-bold uppercase text-[10px]">Free</span>
              </div>
            </div>

            <hr className="mb-6 border-gray-100" />

            <div className="flex justify-between font-black text-gray-900 text-lg mb-8">
              <span>Total Amount</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>

            <Link href="/checkout">
              <button className="w-full bg-primary text-white py-4 rounded font-bold uppercase tracking-widest hover:bg-primary-hover transition-colors mb-6">
                Place Order
              </button>
            </Link>


            <div className="bg-gray-50 p-4 rounded flex items-center space-x-3">
              <BsShieldCheck className="text-gray-400 text-2xl" />
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Safe and secure payments. Easy returns. 100% Authentic products.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BagPage;
