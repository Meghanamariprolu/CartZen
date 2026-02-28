'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BsArrowUpRight, BsArrowDownRight, BsBagCheck, BsPeople, BsCurrencyDollar, BsGraphUp, BsChatDots } from 'react-icons/bs';

const Dashboard = () => {
    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/dashboard/stats');
                const json = await res.json();
                setData(json);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="min-h-screen flex items-center justify-center font-black uppercase tracking-widest text-primary italic">Loading Dashboard...</div>;
    if (!data) return null;

    const { stats, revenueGrowth, recentActivity } = data;

    const iconMap = {
        dollar: <BsCurrencyDollar />,
        bag: <BsBagCheck />,
        chat: <BsChatDots />,
        people: <BsPeople />,
        graph: <BsGraphUp />
    };

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
                                    {iconMap[stat.icon]}
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
                                    d={`M 0 256 ${revenueGrowth.map((d, i) => `L ${(i / (revenueGrowth.length - 1)) * 100}% ${256 - d * 2}`).join(' ')} L 100% 256 Z`}
                                    fill="url(#gradient)"
                                />
                                <motion.path
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 1.5, ease: "easeInOut" }}
                                    d={`M 0 ${256 - revenueGrowth[0] * 2} ${revenueGrowth.slice(1).map((d, i) => `L ${((i + 1) / (revenueGrowth.length - 1)) * 100}% ${256 - d * 2}`).join(' ')}`}
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

                        {/* Static Data for Chart visualization */}
                        <div className="relative w-48 h-48 mx-auto mb-10">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="50%" cy="50%" r="40%" fill="none" stroke="#ff3f6c" strokeWidth="20" strokeDasharray="160 251" />
                                <circle cx="50%" cy="50%" r="40%" fill="none" stroke="#14cda8" strokeWidth="20" strokeDasharray="50 251" strokeDashoffset="-160" />
                                <circle cx="50%" cy="50%" r="40%" fill="none" stroke="#3e4152" strokeWidth="20" strokeDasharray="41 251" strokeDashoffset="-210" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-2xl font-black text-gray-900">100%</span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Inventory</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {[
                                { name: 'Smartphones', value: 65, color: '#ff3f6c' },
                                { name: 'Beauty', value: 20, color: '#14cda8' },
                                { name: 'Others', value: 15, color: '#3e4152' },
                            ].map((cat, idx) => (
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

                {/* Recent Activity Table */}
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
                            {(recentActivity || []).map((row, idx) => (
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
