'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BsArrowUpRight, BsArrowDownRight, BsBagCheck, BsPeople, BsCurrencyDollar, BsCartX, BsGraphUp } from 'react-icons/bs';

const Dashboard = () => {
    // Mock Data for Visuals
    const stats = [
        { label: 'Total Sales', value: '$84,232', change: '+12.5%', isUp: true, icon: <BsCurrencyDollar /> },
        { label: 'Orders', value: '1,240', change: '+8.2%', isUp: true, icon: <BsBagCheck /> },
        { label: 'Conversion', value: '3.2%', change: '-0.4%', isUp: false, icon: <BsGraphUp /> },
        { label: 'Active Users', value: '8,432', change: '+14.1%', isUp: true, icon: <BsPeople /> },
    ];

    const salesData = [30, 45, 35, 60, 55, 80, 75, 90, 85, 100, 95, 110];
    const categoryData = [
        { name: 'Watches', value: 40, color: '#ff3f6c' },
        { name: 'Home', value: 25, color: '#14cda8' },
        { name: 'Gadgets', value: 20, color: '#3e4152' },
        { name: 'Others', value: 15, color: '#7e818c' },
    ];

    return (
        <div className="bg-[#f5f5f6] min-h-screen pt-24 pb-12 px-4">
            <div className="max-w-screen-xl mx-auto">
                <header className="mb-10">
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase mb-2">Business Dashboard</h1>
                    <p className="text-sm text-gray-500 font-medium tracking-wide italic">Real-time visualization of your e-commerce performance.</p>
                </header>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white p-6 rounded-sm border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-gray-50 rounded-full text-primary text-xl">
                                    {stat.icon}
                                </div>
                                <div className={`flex items-center space-x-1 text-xs font-black ${stat.isUp ? 'text-green-500' : 'text-red-500'}`}>
                                    <span>{stat.change}</span>
                                    {stat.isUp ? <BsArrowUpRight /> : <BsArrowDownRight />}
                                </div>
                            </div>
                            <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</h3>
                            <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                    {/* Sales Chart (SVG Visualization) */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white lg:col-span-2 p-8 rounded-sm border border-gray-100 shadow-sm"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">Revenue Growth (12 Months)</h2>
                            <div className="flex space-x-4">
                                <span className="flex items-center space-x-2 text-[10px] font-bold text-gray-500">
                                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                                    <span>2024 Revenue</span>
                                </span>
                            </div>
                        </div>

                        <div className="relative h-64 w-full group">
                            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="#ff3f6c" stopOpacity="0.3" />
                                        <stop offset="100%" stopColor="#ff3f6c" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                <path
                                    d={`M 0 256 ${salesData.map((d, i) => `L ${(i / (salesData.length - 1)) * 100}% ${256 - d * 2}`).join(' ')} L 100% 256 Z`}
                                    fill="url(#gradient)"
                                />
                                <motion.path
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 1.5, ease: "easeInOut" }}
                                    d={`M 0 ${256 - salesData[0] * 2} ${salesData.slice(1).map((d, i) => `L ${((i + 1) / (salesData.length - 1)) * 100}% ${256 - d * 2}`).join(' ')}`}
                                    fill="none"
                                    stroke="#ff3f6c"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                />
                                {/* Grid Lines */}
                                {[0, 1, 2, 3, 4].map(i => (
                                    <line key={i} x1="0" y1={i * 64} x2="100%" y2={i * 64} stroke="#f0f0f0" strokeDasharray="5,5" />
                                ))}
                            </svg>
                            {/* Value Markers */}
                            <div className="absolute inset-0 flex justify-between items-end pb-2">
                                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                                    <span key={m} className="text-[10px] font-bold text-gray-400">{m}</span>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Category Distribution (Donut Chart visualization) */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white p-8 rounded-sm border border-gray-100 shadow-sm"
                    >
                        <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-10 text-center">Top Categories</h2>

                        <div className="relative w-48 h-48 mx-auto mb-10">
                            <svg className="w-full h-full transform -rotate-90">
                                {categoryData.reduce((acc, cat, idx) => {
                                    const prevValue = acc.total;
                                    const circumference = 2 * Math.PI * 40;
                                    const offset = (prevValue / 100) * circumference;
                                    const strokeDasharray = `${(cat.value / 100) * circumference} ${circumference}`;
                                    acc.total += cat.value;
                                    acc.elements.push(
                                        <circle
                                            key={idx}
                                            cx="50%" cy="50%" r="40%"
                                            fill="none"
                                            stroke={cat.color}
                                            strokeWidth="20"
                                            strokeDasharray={strokeDasharray}
                                            strokeDashoffset={-offset}
                                            className="transition-all duration-1000"
                                        />
                                    );
                                    return acc;
                                }, { total: 0, elements: [] }).elements}
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-2xl font-black text-gray-900">100%</span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Inventory</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {categoryData.map((cat, idx) => (
                                <div key={idx} className="flex justify-between items-center">
                                    <div className="flex items-center space-x-3">
                                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></span>
                                        <span className="text-xs font-bold text-gray-600 tracking-tight">{cat.name}</span>
                                    </div>
                                    <span className="text-xs font-black text-gray-900">{cat.value}%</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Recent Activity / Low Inventory Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-8 rounded-sm border border-gray-100 shadow-sm overflow-x-auto"
                >
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">Low Inventory Alert</h2>
                        <button className="text-xs text-primary font-bold hover:underline uppercase tracking-tight">View All Inventory</button>
                    </div>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100 italic">
                                <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Product Name</th>
                                <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</th>
                                <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Stock</th>
                                <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Potential Loss</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {[
                                { name: 'Premium Leather Watch', cat: 'Watches', stock: 5, loss: '$420' },
                                { name: 'Eco-flow Wall Decor', cat: 'Home', stock: 2, loss: '$140' },
                                { name: 'Smart Chronograph X', cat: 'Watches', stock: 8, loss: '$1200' },
                                { name: 'Rustic Vase Set', cat: 'Home', stock: 12, loss: '$60' },
                            ].map((row, idx) => (
                                <tr key={idx} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                                    <td className="py-4 font-bold text-gray-900">{row.name}</td>
                                    <td className="py-4 text-gray-500 font-medium">{row.cat}</td>
                                    <td className="py-4 text-center">
                                        <span className={`px-2 py-1 rounded-sm text-[10px] font-black ${row.stock < 5 ? 'bg-red-50 text-red-500' : 'bg-orange-50 text-orange-500'}`}>
                                            {row.stock} ONLY
                                        </span>
                                    </td>
                                    <td className="py-4 text-right font-black text-gray-900">{row.loss}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;
