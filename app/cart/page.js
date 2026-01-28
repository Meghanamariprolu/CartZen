'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';

const CartPage = () => {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
  }, []);

  // Handle incrementing product quantity
  const handleIncrement = (product) => {
    const updatedCart = [...cart];
    const existingProductIndex = updatedCart.findIndex(item => item.id === product.id);

    if (existingProductIndex > -1) {
      updatedCart[existingProductIndex].quantity += 1;
    }

    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Handle decrementing product quantity
  const handleDecrement = (product) => {
    const updatedCart = [...cart];
    const existingProductIndex = updatedCart.findIndex(item => item.id === product.id);

    if (existingProductIndex > -1 && updatedCart[existingProductIndex].quantity > 1) {
      updatedCart[existingProductIndex].quantity -= 1;
    }

    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Handle removing product from cart
  const handleRemove = (product) => {
    const updatedCart = cart.filter(item => item.id !== product.id);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-semibold text-center mb-6 text-black">Your Cart</h1>

        {/* Display cart items */}
        {cart.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {cart.map((product) => (
              <div key={product.id} className="bg-white p-4 rounded-lg shadow-lg hover:shadow-2xl transition-all">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <h2 className="text-xl mt-2 font-semibold text-black">{product.title}</h2>
                <p className="text-black text-lg">${product.price}</p>

                {/* Increment/Decrement buttons */}
                <div className="flex items-center space-x-4 mt-4">
                  <button
                    onClick={() => handleDecrement(product)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    -
                  </button>

                  <span className="text-lg text-black">{product.quantity}</span>

                  <button
                    onClick={() => handleIncrement(product)}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
                  >
                    +
                  </button>
                </div>

                {/* Remove product button */}
                <button
                  onClick={() => handleRemove(product)}
                  className="bg-gray-500 text-white px-4 py-2 mt-4 rounded-lg hover:bg-gray-600 transition"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-xl text-white">Your cart is empty.</p>
        )}

        {/* Cart Total and Checkout button */}
        {cart.length > 0 && (
          <div className="mt-6 text-center">
            <h2 className="text-2xl font-semibold text-black">
              Total: ${cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
            </h2>
            <Link href="/payment">
              <button className="bg-green-500 text-white px-6 py-3 mt-4 rounded-lg hover:bg-green-600 transition">
                Proceed to checkout
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;

