'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BsBoxSeam, BsClock, BsCheckCircle, BsTruck } from 'react-icons/bs';

const MockOrdersPage = () => {
    const orders = [
        {
            id: 'ORD-2024-001',
            date: 'March 15, 2024',
            status: 'Delivered',
            total: '$129.50',
            items: [
                { name: 'Essence Mascara Lash Princess', price: '$9.99', qty: 1 },
                { name: 'Eyeshadow Palette with Mirror', price: '$19.99', qty: 2 }
            ],
            icon: <BsCheckCircle className="text-green-500" />
        },
        {
            id: 'ORD-2024-002',
            date: 'March 28, 2024',
            status: 'Processing',
            total: '$45.00',
            items: [
                { name: 'Powder Canister', price: '$14.99', qty: 3 }
            ],
            icon: <BsClock className="text-amber-500" />
        },
        {
            id: 'ORD-2024-003',
            date: 'April 02, 2024',
            status: 'Shipped',
            total: '$89.00',
            items: [
                { name: 'Red Lipstick', price: '$12.99', qty: 1 },
                { name: 'Floral Summer Dress', price: '$85.00', qty: 1 }
            ],
            icon: <BsTruck className="text-blue-500" />
        }
    ];

    return (
        <div className="min-h-screen pt-28 pb-20 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4">
                <div className="flex items-center space-x-4 mb-8">
                    <div className="p-3 bg-primary/10 rounded-2xl">
                        <BsBoxSeam className="text-3xl text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">My Orders</h1>
                        <p className="text-gray-500 text-sm font-medium">Track and manage your recent purchases</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {orders.map((order, idx) => (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Order ID</p>
                                    <p className="text-sm font-bold text-gray-900">{order.id}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Date</p>
                                    <p className="text-sm font-bold text-gray-900">{order.date}</p>
                                </div>
                                <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1 rounded-full">
                                    {order.icon}
                                    <span className="text-xs font-black uppercase tracking-wider text-gray-700">{order.status}</span>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total</p>
                                    <p className="text-lg font-black text-primary">{order.total}</p>
                                </div>
                            </div>
                            <div className="p-6 bg-gray-50/30">
                                <ul className="space-y-4">
                                    {order.items.map((item, i) => (
                                        <li key={i} className="flex justify-between items-center">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-white rounded border border-gray-100 flex items-center justify-center text-xs font-bold text-gray-400">
                                                    IMG
                                                </div>
                                                <span className="text-sm font-bold text-gray-800">{item.name}</span>
                                                <span className="text-xs text-gray-400 font-medium">x{item.qty}</span>
                                            </div>
                                            <span className="text-sm font-bold text-gray-900">{item.price}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-6 flex justify-end space-x-3">
                                    <button className="px-4 py-2 text-xs font-black uppercase tracking-widest text-gray-600 hover:text-primary transition-colors">Order Details</button>
                                    <button className="px-6 py-2 bg-[#131826] text-white text-xs font-black uppercase tracking-widest rounded-lg hover:bg-primary transition-colors">Reorder</button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <Link href="/shop" className="inline-flex items-center space-x-2 text-primary font-black uppercase tracking-widest text-xs hover:underline">
                        <span>Continue Shopping</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default MockOrdersPage;
