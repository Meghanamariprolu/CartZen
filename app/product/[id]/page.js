'use client';

import { useParams } from 'next/navigation';  // Correct hook for dynamic routing in the app directory
import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';  // Use this relative path
import Link from 'next/link';  // For Back to Shop

const ProductDetails = () => {
  const { id } = useParams();  // Get the product ID from the URL params
  const [product, setProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [showNotification, setShowNotification] = useState(false);  // State to manage the notification

  // Fetch product data
  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        const res = await fetch(`https://fakestoreapi.com/products/${id}`);
        const data = await res.json();
        setProduct(data);
      };

      fetchProduct();
    }
  }, [id]);

  // Load cart and wishlist from localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const savedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    setCart(savedCart);
    setWishlist(savedWishlist);
  }, []);

  // Add product to the cart
  const handleAddToCart = (product) => {
    const updatedCart = [...cart];
    const existingProductIndex = updatedCart.findIndex((item) => item.id === product.id);
    if (existingProductIndex > -1) {
      updatedCart[existingProductIndex].quantity += 1;  // Increment quantity if product already in cart
    } else {
      updatedCart.push({ ...product, quantity: 1 });  // Add product if not in cart
    }
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));  // Save to localStorage

    // Show the notification for 2 seconds
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);  // Hide notification after 2 seconds
    }, 2000);
  };

  // Add product to the wishlist
  const handleAddToWishlist = (product) => {
    const updatedWishlist = [...wishlist];
    const existingProductIndex = updatedWishlist.findIndex((item) => item.id === product.id);
    if (existingProductIndex === -1) {
      updatedWishlist.push(product);  // Add product to wishlist if not already present
    }
    setWishlist(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));  // Save to localStorage

    // Show the notification for 2 seconds
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);  // Hide notification after 2 seconds
    }, 2000);
  };

  // Check if product is already in the cart
  const productInCart = cart.find((item) => item.id === product?.id);

  // Check if product is already in the wishlist
  const productInWishlist = wishlist.find((item) => item.id === product?.id);

  if (!product) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-black p-8 mt-8">
      {/* Include Navbar */}
      <Navbar cartCount={cart.length} wishlistCount={wishlist.length} showNotification={showNotification} />

      {/* Product Details Section */}
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-center bg-purple-200 rounded-lg shadow-lg p-8 mt-8 space-y-8 lg:space-y-0 lg:space-x-8">
        {/* Product Image */}
        <div className="flex justify-center lg:w-1/2">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
          />
        </div>

        {/* Product Info */}
        <div className="lg:w-1/2 text-center lg:text-left">
          <h1 className="text-4xl font-semibold text-black mb-4">{product.title}</h1>
          <p className="text-2xl font-bold text-gray-700 mb-4">${product.price}</p>
          <p className="text-lg text-gray-600 mb-4">{product.description}</p>

          {/* Buttons: Add to Cart or Update Quantity */}
          <div className="flex justify-center lg:justify-start space-x-4 mt-6">
            <button
              onClick={() => handleAddToCart(product)}
              className="bg-purple-500 text-white px-6 py-2  rounded-lg hover:bg-purple-600 transition"
            >
              {productInCart ? 'In Cart' : 'Add to Cart'}
            </button>

            <button
              onClick={() => handleAddToWishlist(product)}
              className={`bg-blue-500 text-white px-6 py-2  rounded-lg hover:bg-blue-600 transition ${productInWishlist ? 'bg-blue-300' : ''}`}
            >
              {productInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
            </button>

            <Link href="/shop">
              <button className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition">
                Back to Shop
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;










