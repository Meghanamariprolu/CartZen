'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Slider from 'react-slick'; // Import the carousel slider
import 'slick-carousel/slick/slick.css'; // Carousel styles
import 'slick-carousel/slick/slick-theme.css'; // Carousel theme styles

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState(''); // Track the selected sort option
  const [cart, setCart] = useState([]);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch('https://fakestoreapi.com/products');
      const data = await res.json();
      setProducts(data);
    };
    fetchProducts();
  }, []);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
  }, []);

  // Filter products based on search query
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(search.toLowerCase())
  );

  // Sort products based on price
  const sortedProducts = filteredProducts.sort((a, b) => {
    if (sort === 'price_asc') {
      return a.price - b.price; // Sort from low to high
    }
    if (sort === 'price_desc') {
      return b.price - a.price; // Sort from high to low
    }
    return 0; // Default sorting (no sorting)
  });

  // Add product to cart or update quantity
  const handleAddToCart = (product) => {
    const updatedCart = [...cart];
    const existingProductIndex = updatedCart.findIndex((item) => item.id === product.id);
    if (existingProductIndex > -1) {
      updatedCart[existingProductIndex].quantity += 1;
    } else {
      updatedCart.push({ ...product, quantity: 1 });
    }
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart)); // Save to localStorage
  };

  // Calculate total number of items in the cart
  const totalItemsInCart = cart.reduce((total, item) => total + item.quantity, 0);

  // Carousel settings
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true, // Add arrows to navigate the carousel
  };

  return (
    <div className="bg-black min-h-screen mt-5 pt-5 ">
      <Navbar cartCount={totalItemsInCart} /> {/* Pass cartCount as prop */}

      {/* Carousel Section */}
      <div className="container mx-auto p-4 mt-8">
        <Slider {...carouselSettings}>
          <div className="relative">
            <img
              src="/e4.jpg" // Update with your carousel image path
              alt="carousel-img-1"
              className="w-500 h-[500px] object-cover rounded-lg"
            />
            <div className="absolute bottom-8 left-8 text-white text-3xl font-bold">Special Offer</div>
          </div>
          <div className="relative">
            <img
              src="e5.jpg" // Update with your carousel image path
              alt="carousel-img-2"
              className="w-500 h-[500px] object-cover rounded-lg"
            />
            <div className="absolute bottom-8 left-8 text-white text-3xl font-bold">Exclusive Discount</div>
          </div>
          <div className="relative">
            <img
              src="e3.jpg" // Update with your carousel image path
              alt="carousel-img-3"
              className="w-500 h-[500px] object-cover rounded-lg"
            />
            <div className="absolute bottom-8 left-8 text-white text-3xl font-bold">New Arrivals</div>
          </div>
        </Slider>
      </div>

      {/* Product Section */}
      <div className="container mx-auto p-4 ">
        {/* Search bar and Sort dropdown */}
        <div className="text-black flex justify-between items-center mb-6 space-x-4">
          <input
            type="text"
            className="border p-2 w-1/2 border-black rounded-lg placeholder-black"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for products"
          />
          <select
            onChange={(e) => setSort(e.target.value)}
            className="border p-2 w-1/4 border-black rounded-lg text-black"
          >
            <option value="">Sort by Price Range</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>

        {/* Display products with animation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <div
              key={product.id}
              className="bg-purple-200 p-4 rounded-lg shadow-lg hover:shadow-2xl transition-all animate__animated animate__fadeIn"
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-48 object-cover rounded-lg"
              />
              <h2 className="text-xl mt-2 font-semibold text-black">{product.title}</h2>
              <p className="text-black text-lg">${product.price}</p>
              <Link href={`/product/${product.id}`}>
                <button className="bg-green-500 text-white px-6 py-2 mt-4 ml-4 rounded-lg hover:bg-green-600 transition mb-4">
                  View Details
                </button>
              </Link>
              <button
                onClick={() => handleAddToCart(product)}
                className="bg-purple-500 text-white px-6 py-2 mt-4 ml-5 rounded-lg hover:bg-purple-600 transition"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>

        {/* Cart count display */}
        <div className="mt-6 text-center">
          <Link href="/cart">
            <span className="bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 transition">
              Cart ({totalItemsInCart} items)
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;

