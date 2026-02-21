'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { motion } from 'framer-motion';

const FeaturedProductsGrid = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const res = await axios.get('https://api.escuelajs.co/api/v1/products?offset=0&limit=6');
                const mapped = res.data.map(item => ({
                    ...item,
                    image: (item.images && item.images.length > 0) ? cleanImageUrl(item.images[0]) : 'https://placehold.co/600x400',
                    brand: item.category ? item.category.name : 'Generic'
                }));
                setProducts(mapped);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch featured", err);
                setLoading(false);
            }
        };
        fetchFeatured();
    }, []);

    const cleanImageUrl = (url) => {
        if (!url) return 'https://placehold.co/600x400';
        let cleaned = url.replace(/[\[\]"]/g, '');
        try {
            if (cleaned.startsWith('http')) return cleaned;
            return JSON.parse(url);
        } catch (e) {
            return cleaned;
        }
    };

    if (loading) return <div className="text-center py-10">Loading Featured...</div>;

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {products.map((product) => (
                <Link key={product.id} href={`/product/${product.id}`}>
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-white rounded-md overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer border border-gray-100 group"
                    >
                        <div className="h-48 md:h-56 overflow-hidden bg-gray-50 relative">
                            <img src={product.image} alt={product.title} className="w-full h-full object-contain mix-blend-multiply p-4" />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="bg-white text-black text-xs font-bold px-3 py-2 rounded uppercase tracking-wider">View Details</span>
                            </div>
                        </div>
                        <div className="p-3 text-center">
                            <p className="text-xs text-gray-500 font-bold uppercase mb-1">{product.brand}</p>
                            <p className="text-sm font-bold text-gray-900 truncate mb-1">{product.title}</p>
                            <p className="text-sm text-primary font-black">${product.price}</p>
                        </div>
                    </motion.div>
                </Link>
            ))}
        </div>
    );
};

export default FeaturedProductsGrid;
