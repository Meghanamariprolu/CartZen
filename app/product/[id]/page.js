'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { BsHeart, BsHeartFill, BsStarFill, BsShieldCheck, BsArrowLeftRight, BsCamera, BsBagFill, BsFillLightningFill } from 'react-icons/bs';
import UnifiedTryOn from '../../components/TryOn/UnifiedTryOn';
import { useCart } from '../../context/CartContext';
import Link from 'next/link';

const ProductDetails = () => {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart, toggleWishlist, wishlist } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [error, setError] = useState(null);
  const [isAROpen, setIsAROpen] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [isRecommending, setIsRecommending] = useState(false);
  const [errorDetail, setErrorDetail] = useState("");

  const handleSizeRecommendation = async () => {
    setIsRecommending(true);
    try {
      // Mock user body metrics
      const userMetrics = {
        height_cm: 180,
        weight_kg: 75,
        gender: 'male',
        fit_preference: 'slim'
      };

      const response = await axios.post('/api/ai/size-recommend', {
        product_id: id,
        user_measurements: userMetrics
      });

      setRecommendation(response.data);
    } catch (err) {
      console.error("AI Recommendation Error:", err);
    } finally {
      setIsRecommending(false);
    }
  };

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const response = await axios.get(`https://dummyjson.com/products/${id}`);
          const item = response.data;

          const mappedProduct = {
            ...item,
            image: item.thumbnail || (item.images?.length > 0 ? item.images[0] : 'https://placehold.co/600x400?text=No+Image'),
            images: item.images || [],
            category: item.category ? item.category.toLowerCase() : 'uncategorized',
            rating: {
              rate: item.rating ? item.rating.toFixed(1) : (Math.random() * 2 + 3).toFixed(1),
              count: item.reviews?.length || Math.floor(Math.random() * 500)
            },
            brand: item.brand || 'Generic'
          };

          setProduct(mappedProduct);
          setLoading(false);
        } catch (err) {
          console.error("Error fetching product:", err);
          setError("Failed to load product details.");
          setErrorDetail(err.message || String(err));
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id]);

  const handleBuyNow = () => {
    router.push(`/checkout?direct=true&productId=${id}&qty=1`);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center h-screen">
      <p className="text-xl font-bold text-gray-800 mb-2">{error}</p>
      <p className="text-xs text-red-500 mb-4">Diagnostic: {errorDetail}</p>
      <Link href="/shop" className="text-primary font-bold hover:underline">Back to Shop</Link>
    </div>
  );

  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
  // Safety check for wishlist
  const isInWishlist = product && wishlist.some(item => item.id === product.id);

  if (!product) return null;

  return (
    <div className="bg-white min-h-screen pt-10 pb-20">
      <div className="max-w-screen-xl mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="mb-8 flex items-center space-x-2 text-xs text-gray-400">
          <Link href="/" className="hover:text-gray-900">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-gray-900 capitalize">{product.category}</Link>
          <span>/</span>
          <span className="text-gray-900 font-bold truncate">{product.title}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left: Image Gallery (Single large image for demo) */}
          <div className="lg:w-3/5">
            <div className="bg-gray-50 rounded-lg p-8 sticky top-28 flex justify-center items-center h-[500px] md:h-[700px]">
              <motion.img
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                src={product.image}
                alt={product.title}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="lg:w-2/5">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{product.title}</h1>
            <p className="text-lg text-gray-400 mb-4">{product.category}</p>

            {/* Rating */}
            <div className="flex items-center space-x-2 border border-gray-100 px-3 py-1 w-fit rounded-sm mb-6 bg-gray-50">
              <span className="text-sm font-bold">{product.rating.rate}</span>
              <BsStarFill className="text-green-600 text-xs" />
              <div className="border-l border-gray-300 h-4 mx-2"></div>
              <span className="text-sm text-gray-500">{product.rating.count} Ratings</span>
            </div>

            <hr className="mb-6 border-gray-100" />

            {/* Price */}
            <div className="flex items-end space-x-4 mb-8">
              <span className="text-2xl font-bold text-gray-900">${product.price}</span>
              <span className="text-lg text-gray-400 line-through">${(product.price * 1.5).toFixed(2)}</span>
              <span className="text-lg text-orange-400 font-bold"> (33% OFF)</span>
            </div>

            <p className="text-xs font-bold text-green-600 mb-8 tracking-widest uppercase">inclusive of all taxes</p>

            {/* Select Size */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-sm uppercase tracking-widest text-gray-900">Select Size</span>
                <button className="text-primary text-xs font-bold hover:underline">SIZE CHART</button>
              </div>
              <div className="flex flex-wrap gap-4">
                {sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 md:w-14 md:h-14 rounded-full border text-sm font-bold transition-all flex items-center justify-center
                      ${selectedSize === size
                        ? 'border-primary text-primary bg-primary/5'
                        : 'border-gray-200 text-gray-700 hover:border-primary'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* AR & AI Intelligence Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <button
                onClick={() => setIsAROpen(true)}
                className="flex items-center justify-center space-x-2 bg-black text-white py-3 rounded-sm font-black uppercase tracking-widest text-[10px] hover:bg-gray-800 transition-all border border-black shadow-lg shadow-black/10 group"
              >
                <BsCamera className="text-primary group-hover:scale-110 transition-transform" />
                <span>Virtual Try-On</span>
              </button>

              <button
                onClick={handleSizeRecommendation}
                disabled={isRecommending}
                className="flex items-center justify-center space-x-2 bg-white text-gray-900 py-3 rounded-sm font-black uppercase tracking-widest text-[10px] hover:bg-gray-50 transition-all border border-gray-200"
              >
                <BsStarFill className="text-primary" />
                <span>{isRecommending ? 'AI Analyzing...' : 'What\'s my size?'}</span>
              </button>
            </div>

            {/* AI Recommendation Result */}
            <AnimatePresence>
              {recommendation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-8 p-4 bg-primary/5 border border-primary/20 rounded-sm relative overflow-hidden"
                >
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary text-white p-2 rounded-full mt-1">
                      <BsStarFill size={10} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-primary tracking-widest mb-1">AI Recommendation</p>
                      <p className="text-xs font-bold text-gray-900 leading-relaxed">{recommendation.fit_analysis}</p>
                      <div className="mt-2 flex items-center space-x-2">
                        <span className="text-[10px] font-black text-gray-400 capitalize">Recommended:</span>
                        <span className="bg-primary text-white text-[10px] font-black px-2 py-0.5 rounded-sm uppercase tracking-tighter">Size {recommendation.recommended_size}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <button
                onClick={() => addToCart(product)}
                className="flex-grow bg-primary text-white py-4 px-8 rounded font-bold uppercase tracking-widest hover:bg-primary-hover transition-all flex items-center justify-center space-x-3"
              >
                <BsBagFill />
                <span>Add to Bag</span>
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-grow border-2 border-primary text-primary py-4 px-8 rounded font-bold uppercase tracking-widest hover:bg-primary/5 transition-all flex items-center justify-center space-x-3"
              >
                <BsFillLightningFill className="text-xl" />
                <span>Buy Now</span>
              </button>
            </div>

            <button
              onClick={() => toggleWishlist(product)}
              className="w-full border border-gray-200 py-3 rounded font-bold uppercase tracking-widest flex items-center justify-center space-x-3 hover:border-gray-900 transition-colors mb-8 text-xs"
            >
              {isInWishlist ? <BsHeartFill className="text-primary" /> : <BsHeart />}
              <span>{isInWishlist ? 'Wishlisted' : 'Add to Wishlist'}</span>
            </button>

            <UnifiedTryOn isOpen={isAROpen} onClose={() => setIsAROpen(false)} product={product} />

            <hr className="mb-8 border-gray-100" />

            {/* Product Details Section */}
            <div className="mb-8">
              <h4 className="font-bold text-sm uppercase tracking-widest text-gray-900 mb-4">Product Details</h4>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                {product.description}
              </p>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-gray-50 rounded-full text-gray-600"><BsArrowLeftRight /></div>
                  <span className="text-sm font-bold text-gray-700">14 day return & exchange</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-gray-50 rounded-full text-gray-600"><BsShieldCheck /></div>
                  <span className="text-sm font-bold text-gray-700">100% Original Products</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
