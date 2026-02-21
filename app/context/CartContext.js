'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
        const savedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        setCart(savedCart);
        setWishlist(savedWishlist);
        setIsInitialized(true);
    }, []);

    // Sync with localStorage on change (only after initialization)
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }, [cart, isInitialized]);

    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
        }
    }, [wishlist, isInitialized]);

    const addToCart = (product) => {
        // Normalize image property for consistency if needed
        const normalizedProduct = {
            ...product,
            image: product.image || product.thumbnail || (product.images && product.images[0])
        };

        setCart((prevCart) => {
            const existing = prevCart.find((item) => item.id === product.id);
            if (existing) {
                return prevCart.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...normalizedProduct, quantity: 1 }];
        });
    };

    const removeFromCart = (productId) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    };

    const updateQuantity = (productId, quantity) => {
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === productId ? { ...item, quantity: Math.max(0, quantity) } : item
            ).filter(item => item.quantity > 0)
        );
    };

    const clearCart = () => setCart([]);

    const toggleWishlist = (product) => {
        const normalizedProduct = {
            ...product,
            image: product.image || product.thumbnail || (product.images && product.images[0])
        };

        setWishlist((prevWishlist) => {
            const exists = prevWishlist.find((item) => item.id === product.id);
            if (exists) {
                return prevWishlist.filter((item) => item.id !== product.id);
            }
            return [...prevWishlist, normalizedProduct];
        });
    };

    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cart,
                wishlist,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                toggleWishlist,
                cartCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
