'use client';  // Mark this as a Client Component

import { useState } from 'react';
import { useRouter } from 'next/navigation';  // For redirecting to the home page after successful login

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Retrieve user data from localStorage
    const userData = localStorage.getItem(email);

    if (userData) {
      const { password: storedPassword } = JSON.parse(userData);

      // Check if password matches
      if (storedPassword === password) {
        setMessage('Login successful! Redirecting to shop...');
        
        // Redirect to the shop page
        setTimeout(() => {
          router.push('/shop');
        }, 2000);
      } else {
        setMessage('Incorrect password, please try again.');
      }
    } else {
      setMessage('You didn’t register yet, please sign up first.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          {/* Forgot password link */}
        <p className="text-left mt-4 mb-4">
          Forgot your password?{' '}
          <a href="#" className="text-indigo-600 hover:text-indigo-700">Click here</a>
        </p>
        
          
          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Login
          </button>
        </form>
        
        {/* Message display */}
        {message && <div className="mt-4 p-3 text-center text-white bg-red-400 rounded-lg">{message}</div>}
        
        {/* Forgot password link
        <p className="text-center mt-4">
          Forgot your password?{' '}
          <a href="#" className="text-indigo-600 hover:text-indigo-700">Click here</a>
        </p> */}
        
        {/* Register and Home links */}
        <p className="text-center mt-4">
          Don’t have an account?{' '}
          <a href="/register" className="text-indigo-600 hover:text-indigo-700">Register here</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;







