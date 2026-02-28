'use client';
export const dynamic = 'force-dynamic';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { BsHeart, BsHeartFill, BsStarFill, BsFilter, BsX, BsSearch } from 'react-icons/bs';
import { useCart } from '../context/CartContext';
import { useSearchParams } from 'next/navigation';
import Navbar from '../components/Navbar'; // Added Navbar import as per instruction, though not used in the snippet

const ShopContent = () => {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const visualSearchParam = searchParams.get('visual_search');
  const uploadedImgName = searchParams.get('img');
  const brandParam = searchParams.get('brand'); // New param

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sort, setSort] = useState('recommended');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { addToCart, toggleWishlist, wishlist } = useCart();

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory('all');
    }
    // Pre-fill search if brand param exists to simulate brand filtering or implement specific brand filter
    if (brandParam) {
      setSearch(brandParam);
    }
  }, [categoryParam, brandParam]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('https://dummyjson.com/products?limit=0');
        const mappedProducts = res.data.products.map(item => ({
          ...item,
          image: item.thumbnail || (item.images?.length > 0 ? item.images[0] : 'https://placehold.co/600x400?text=No+Image'),
          thumbnail: item.thumbnail || (item.images?.length > 0 ? item.images[0] : 'https://placehold.co/600x400?text=No+Image'),
          category: item.category ? item.category.toLowerCase() : 'uncategorized',
          rating: item.rating ? item.rating.toFixed(1) : (Math.random() * 2 + 3).toFixed(1),
          discountPercentage: item.discountPercentage || 0,
          brand: item.brand || (item.category ? item.category : 'Generic')
        }));
        setProducts(mappedProducts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = [...products];

    // Visual Search Mode
    if (visualSearchParam === 'true') {
      result = result.filter(p => ['tops', 'mens-shirts', 'womens-dresses', 'womens-bags'].includes(p.category)).slice(0, 8);
    } else {
      // Category filter
      if (selectedCategory !== 'all') {
        result = result.filter(p => p.category === selectedCategory);
      }

      // Search (and Brand) filter
      if (search) {
        result = result.filter(p =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          (p.brand && p.brand.toLowerCase().includes(search.toLowerCase()))
        );
      }
    }

    // Sorting
    if (sort === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    setFilteredProducts(result);
  }, [search, selectedCategory, sort, products, visualSearchParam]);

  // Extract unique categories (already mapped to lowercase strings)
  const categories = ['all', ...new Set(products.map(p => p.category))];

  return (
    <div className="min-h-screen">
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        {/* Breadcrumbs & Header */}
        <div className="mb-8">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">
            Home / {visualSearchParam === 'true' ? 'Visual Search' : 'Clothing'} /
            <span className="text-gray-900 font-bold capitalize">
              {visualSearchParam === 'true' ? ' Related Items' : (selectedCategory === 'all' ? 'All Products' : ` ${selectedCategory.replace('-', ' ')}`)}
            </span>
          </p>

          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900 uppercase tracking-tight">
              {visualSearchParam === 'true' ? `Visual Search: ${uploadedImgName}` : (selectedCategory === 'all' ? 'All Products' : selectedCategory.replace('-', ' '))}
              <span className="text-gray-400 font-normal ml-3">({filteredProducts.length} items)</span>
            </h1>

            {visualSearchParam === 'true' && (
              <Link href="/shop" className="text-primary font-bold text-xs uppercase tracking-widest hover:underline mt-2 md:mt-0 italic flex items-center">
                <BsX className="mr-1 text-lg" /> Clear Visual Search
              </Link>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar / Filters (Desktop) */}
          <aside className="hidden md:block w-64 flex-shrink-0 border-r border-gray-100 pr-6">
            <div className="sticky top-24">
              <h3 className="font-bold text-gray-900 uppercase text-xs tracking-widest mb-6">Filters</h3>

              <div className="mb-8">
                <h4 className="font-bold text-gray-800 text-sm mb-4">Categories</h4>
                <div className="space-y-2 max-h-[60vh] overflow-y-auto no-scrollbar pr-2">
                  {categories.map(cat => (
                    <label key={cat} className="flex items-center space-x-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="category"
                        className="form-radio text-primary focus:ring-primary h-4 w-4 border-gray-300"
                        checked={selectedCategory === cat}
                        onChange={() => setSelectedCategory(cat)}
                      />
                      <span className={`text-[13px] capitalize ${selectedCategory === cat ? 'text-primary font-bold' : 'text-gray-600 group-hover:text-gray-900'}`}>{cat.replace('-', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Top Bar (Search & Sort) */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 space-y-4 sm:space-y-0 pb-4 border-b border-gray-50">
              <div className="relative w-full sm:w-64 group">
                <input
                  type="text"
                  placeholder="Search items..."
                  className="w-full bg-gray-50 border-none rounded px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary transition-all pr-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <BsSearch className="absolute right-3 top-3.5 text-gray-400 group-focus-within:text-primary transition-colors" />
              </div>

              <div className="flex items-center space-x-4 w-full sm:w-auto">
                <button
                  className="md:hidden flex items-center space-x-2 text-sm font-bold text-gray-700 border border-gray-200 px-4 py-2 rounded"
                  onClick={() => setIsSidebarOpen(true)}
                >
                  <BsFilter /> <span>Filters</span>
                </button>
                <select
                  className="text-sm border-gray-200 rounded px-4 py-2.5 focus:ring-primary focus:border-primary flex-1 sm:flex-none font-bold text-gray-700"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="recommended">Recommended</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">No items found matching your filters.</p>
                <button
                  onClick={() => { setSearch(''); setSelectedCategory('all'); }}
                  className="text-primary font-bold mt-4 hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10">
                {filteredProducts.map((product) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={product.id}
                    className="group relative"
                  >
                    {/* Image Box */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-[#f5f5f6] rounded-sm">
                      <img
                        src={product.thumbnail || (product.images && product.images[0])}
                        alt={product.title}
                        className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
                      />

                      {/* Overlay Actions */}
                      <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform bg-white/95 z-10">
                        <button
                          onClick={() => addToCart(product)}
                          className="w-full border border-gray-200 text-gray-900 text-[11px] font-black py-2.5 uppercase tracking-widest hover:border-primary hover:text-primary transition-colors"
                        >
                          Add to Bag
                        </button>
                      </div>

                      {/* Wishlist Icon */}
                      <button
                        onClick={() => toggleWishlist(product)}
                        className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full myntra-shadow hover:bg-white transition-all transform hover:scale-110 z-10"
                      >
                        {wishlist.some(item => item.id === product.id) ? (
                          <BsHeartFill className="text-primary text-sm" />
                        ) : (
                          <BsHeart className="text-gray-800 text-sm" />
                        )}
                      </button>

                      {/* Rating Label */}
                      <div className="absolute bottom-3 left-3 bg-white/90 px-1.5 py-0.5 rounded-sm text-[10px] font-black flex items-center space-x-1 shadow-sm">
                        <span>{product.rating}</span>
                        <BsStarFill className="text-green-600 text-[8px]" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="mt-3 px-1">
                      <h3 className="text-[13px] font-black text-gray-900 truncate uppercase tracking-tight">{product.brand || 'CartZen'}</h3>
                      <p className="text-[13px] text-gray-500 truncate mb-1.5">{product.title}</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-black text-gray-900">${product.price}</span>
                        <span className="text-[11px] text-gray-400 line-through">${(product.price * (1 + (product.discountPercentage / 100))).toFixed(0)}</span>
                        <span className="text-[11px] text-orange-400 font-bold">({product.discountPercentage.toFixed(0)}% OFF)</span>
                      </div>
                      <Link href={`/product/${product.id}`} className="absolute inset-0 z-[1]"></Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>


      {/* Mobile Filters Modal */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[100]"
              onClick={() => setIsSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="fixed top-0 left-0 h-full w-4/5 bg-white z-[101] p-6 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8 pb-4 border-b">
                <h3 className="font-bold text-lg uppercase tracking-widest">Filters</h3>
                <BsX className="text-3xl cursor-pointer" onClick={() => setIsSidebarOpen(false)} />
              </div>

              <div className="mb-8">
                <h4 className="font-bold text-gray-800 text-sm mb-4 uppercase tracking-widest">Categories</h4>
                <div className="grid grid-cols-1 gap-4">
                  {categories.map(cat => (
                    <label
                      key={cat}
                      className={`flex items-center justify-between p-3 rounded-md border ${selectedCategory === cat ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 text-gray-600'}`}
                      onClick={() => { setSelectedCategory(cat); setIsSidebarOpen(false); }}
                    >
                      <span className="text-sm font-bold capitalize">{cat.replace('-', ' ')}</span>
                      {selectedCategory === cat && <div className="w-2 h-2 bg-primary rounded-full" />}
                    </label>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const ShopPage = () => {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>}>
      <ShopContent />
    </Suspense>
  );
};

export default ShopPage;
