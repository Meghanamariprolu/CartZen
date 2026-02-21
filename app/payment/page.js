'use client';  // Ensure it's a client-side component

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';

const PaymentPage = () => {
  const [cart, setCart] = useState([]);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
  }, []);

  // Handle confirming the payment
  const handlePayment = () => {
    // Simulating payment processing (this would be replaced by actual payment gateway integration)
    const transactionId = Math.random().toString(36).substring(7);  // Simulated transaction ID
    const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

    // Simulate successful payment
    setPaymentDetails({
      transactionId,
      amount: totalAmount,
      date: new Date().toLocaleString(),
    });
    
    // Set payment success state
    setPaymentSuccess(true);

    // Clear cart from localStorage after payment
    localStorage.removeItem('cart');
    setCart([]);
  };

  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-semibold text-center mb-6 text-white">Payment</h1>

        {!paymentSuccess ? (
          <>
            {/* Display cart items */}
            {cart.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {cart.map((product) => (
                  <div key={product.id} className="bg-purple-200 p-4 rounded-lg shadow-lg hover:shadow-2xl transition-all">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <h2 className="text-xl mt-2 font-semibold text-black">{product.title}</h2>
                    <p className="text-black text-lg">${product.price}</p>
                    <span className="text-black text-sm">Quantity: {product.quantity}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-xl text-white">Your cart is empty.</p>
            )}

            {/* Cart Total */}
            {cart.length > 0 && (
              <div className="mt-6 text-center">
                <h2 className="text-2xl font-semibold text-white">
                  Total: ${cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
                </h2>

                {/* Payment Button */}
                <button
                  onClick={handlePayment}
                  className="bg-green-500 text-white px-6 py-3 mt-4 rounded-lg hover:bg-green-600 transition"
                >
                  Proceed to Payment
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Payment Successful Receipt */}
            <div className="bg-white p-4 rounded-lg shadow-lg mb-6">
              <h2 className="text-2xl font-semibold text-black mb-4 text-center mt-3">Payment Successful</h2>

              <div className="text-black text-center">
                <p><strong>Transaction ID:</strong> {paymentDetails.transactionId}</p>
                <p><strong>Amount:</strong> ${paymentDetails.amount}</p>
                <p><strong>Date:</strong> {paymentDetails.date}</p>
              </div>
            </div>
          </>
        )}

        {/* Link to Cancel/Go back */}
        {!paymentSuccess && (
          <div className="mt-4 text-center">
            <Link href="/shop">
              <button className="bg-blue-500 text-black px-6 py-3 mt-4 rounded-lg hover:bg-purple-600 transition">
                  Go to shop
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
