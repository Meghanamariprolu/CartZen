'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useCart } from '../context/CartContext';
import { BsShieldCheck, BsCreditCard, BsCashStack, BsLightningCharge, BsCheckCircleFill, BsArrowLeft } from 'react-icons/bs';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';

const CheckoutContent = () => {
    const { data: session } = useSession();
    const searchParams = useSearchParams();
    const isDirect = searchParams.get('direct') === 'true';
    const productId = searchParams.get('productId');

    const { cart, cartCount, clearCart } = useCart();
    const [step, setStep] = useState(2); // 2: Address, 3: Payment
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Direct Purchase State
    const [directItem, setDirectItem] = useState(null);

    // Address State
    const [address, setAddress] = useState({
        name: '',
        street: '',
        city: '',
        zip: '',
        phone: ''
    });
    const [addressError, setAddressError] = useState('');

    useEffect(() => {
        if (isDirect && productId) {
            fetchDirectProduct(productId);
        }
        if (session) {
            fetchUserAddress();
        }
    }, [isDirect, productId, session]);

    const fetchDirectProduct = async (id) => {
        try {
            const res = await axios.get(`https://dummyjson.com/products/${id}`);
            const item = res.data;
            setDirectItem({
                ...item,
                quantity: 1,
                thumbnail: item.thumbnail
            });
        } catch (err) {
            console.error("Failed to fetch direct product:", err);
        }
    };

    const fetchUserAddress = async () => {
        try {
            const res = await axios.get('/api/user/profile');
            const data = res.data;
            if (data.address) {
                setAddress({
                    name: data.name || '',
                    street: data.address || '',
                    city: 'Hyderabad', // Default or from API
                    zip: '500001',
                    phone: data.phone || ''
                });
            }
        } catch (err) {
            console.error("Failed to fetch user address:", err);
        }
    };

    const checkoutItems = isDirect ? (directItem ? [directItem] : []) : cart;
    const itemsCount = isDirect ? 1 : cartCount;

    const subtotal = checkoutItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const totalMRP = checkoutItems.reduce((total, item) => total + (item.price * 1.5 * item.quantity), 0);
    const discountAmount = totalMRP - subtotal;
    const isCouponEligible = subtotal > 50;
    const couponDiscount = isCouponEligible ? subtotal * 0.1 : 0;
    const totalAmount = subtotal - couponDiscount;

    const handleAddressSubmit = (e) => {
        e.preventDefault();
        if (!address.name || !address.street || !address.city || !address.zip || !address.phone) {
            setAddressError('Please fill in all address fields.');
            return;
        }
        setAddressError('');
        setStep(3); // Proceed to Payment
    };

    const handlePlaceOrder = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);
            clearCart();
        }, 2000);
    };

    if (!isSuccess && ((!isDirect && cart.length === 0) || (isDirect && !directItem))) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
                <h2 className="text-xl font-bold text-gray-800 mb-4">{isDirect ? 'Loading product...' : 'Your bag is empty!'}</h2>
                <Link href="/shop" className="text-primary font-bold hover:underline">Continue Shopping</Link>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center"
                >
                    <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <BsCheckCircleFill className="text-6xl text-green-500" />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-4">Order Placed Successfully!</h2>
                    <p className="text-gray-500 mb-8 max-w-sm mx-auto font-medium">
                        Thank you {address.name}! Your order has been confirmed and will be shipped to {address.city}.
                    </p>
                    <Link href="/shop">
                        <button className="bg-primary text-white px-10 py-4 font-black uppercase tracking-widest rounded shadow-lg hover:bg-primary-hover transition-colors">Continue Shopping</button>
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen pb-20">
            {/* Checkout Navbar/Header */}
            <div className="border-b border-gray-100 py-6 mb-10 sticky top-20 bg-white z-40">
                <div className="max-w-screen-xl mx-auto px-4 flex justify-between items-center">
                    <Link href="/cart" className="flex items-center text-gray-500 hover:text-gray-900 transition-colors">
                        <BsArrowLeft className="mr-2" />
                        <span className="text-xs font-bold uppercase tracking-widest">Back to Bag</span>
                    </Link>

                    <div className="flex items-center space-x-4 md:space-x-8">
                        <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-primary' : 'text-gray-300'}`}>
                            <span className="text-[10px] font-black border-2 border-current rounded-full w-5 h-5 flex items-center justify-center">1</span>
                            <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Bag</span>
                        </div>
                        <div className="w-8 h-[2px] bg-gray-100" />
                        <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-primary' : 'text-gray-300'}`}>
                            <span className={`text-[10px] font-black border-2 border-current rounded-full w-5 h-5 flex items-center justify-center ${step === 2 ? 'bg-primary text-white border-primary' : ''}`}>2</span>
                            <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Address</span>
                        </div>
                        <div className="w-8 h-[2px] bg-gray-100" />
                        <div className={`flex items-center space-x-2 ${step >= 3 ? 'text-primary' : 'text-gray-300'}`}>
                            <span className={`text-[10px] font-black border-2 border-current rounded-full w-5 h-5 flex items-center justify-center ${step === 3 ? 'bg-primary text-white border-primary' : ''}`}>3</span>
                            <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Payment</span>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center text-gray-400 space-x-2">
                        <BsShieldCheck className="text-green-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest">100% SECURE</span>
                    </div>
                </div>
            </div>

            <div className="max-w-screen-xl mx-auto px-4 flex flex-col lg:flex-row gap-12">

                {/* Left Section: Content based on Step */}
                <div className="lg:w-2/3">

                    {/* STEP 2: ADDRESS FORM / SELECTION */}
                    {step === 2 && (
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="font-black text-gray-900 uppercase tracking-widest text-sm">Shipping Address</h3>
                                {session && profile?.savedAddresses?.length > 0 && (
                                    <button
                                        onClick={() => setAddressError('') || (!address.street ? null : setAddress({ name: '', street: '', city: '', zip: '', phone: '' }))}
                                        className="text-xs text-primary font-bold hover:underline uppercase tracking-widest"
                                    >
                                        {address.street ? 'Add New Address' : 'Select Saved'}
                                    </button>
                                )}
                            </div>

                            {/* Saved Addresses List */}
                            {session && profile?.savedAddresses?.length > 0 && !address.street && (
                                <div className="space-y-4 mb-8">
                                    {profile.savedAddresses.map((addr) => (
                                        <div
                                            key={addr._id}
                                            onClick={() => setAddress({
                                                name: addr.name,
                                                street: addr.street,
                                                city: addr.city,
                                                zip: addr.zip,
                                                phone: addr.phone
                                            })}
                                            className={`p-4 border rounded cursor-pointer transition-all hover:border-primary ${address.street === addr.street ? 'border-primary bg-primary/5' : 'border-gray-100'}`}
                                        >
                                            <p className="font-black text-xs uppercase mb-1">{addr.name}</p>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase">{addr.street}, {addr.city}-{addr.zip}</p>
                                            <p className="text-[10px] text-gray-400 font-bold">MOBILE: {addr.phone}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {(!profile?.savedAddresses?.length || address.street || !session) && (
                                <form onSubmit={handleAddressSubmit} className="space-y-6 max-w-lg">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            value={address.name}
                                            onChange={(e) => setAddress({ ...address, name: e.target.value })}
                                            className="w-full border border-gray-200 p-3 rounded text-sm font-bold focus:ring-1 focus:ring-primary outline-none"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Street Address</label>
                                        <input
                                            type="text"
                                            value={address.street}
                                            onChange={(e) => setAddress({ ...address, street: e.target.value })}
                                            className="w-full border border-gray-200 p-3 rounded text-sm font-bold focus:ring-1 focus:ring-primary outline-none"
                                            placeholder="123 Main St, Apt 4B"
                                        />
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">City</label>
                                            <input
                                                type="text"
                                                value={address.city}
                                                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                                className="w-full border border-gray-200 p-3 rounded text-sm font-bold focus:ring-1 focus:ring-primary outline-none"
                                                placeholder="New York"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Zip Code</label>
                                            <input
                                                type="text"
                                                value={address.zip}
                                                onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                                                className="w-full border border-gray-200 p-3 rounded text-sm font-bold focus:ring-1 focus:ring-primary outline-none"
                                                placeholder="10001"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Phone Number</label>
                                        <input
                                            type="tel"
                                            value={address.phone}
                                            onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                                            className="w-full border border-gray-200 p-3 rounded text-sm font-bold focus:ring-1 focus:ring-primary outline-none"
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>

                                    {addressError && <p className="text-red-500 text-xs font-bold">{addressError}</p>}
                                </form>
                            )}

                            {address.street && (
                                <button
                                    onClick={() => setStep(3)}
                                    className="w-full bg-primary text-white py-4 font-black uppercase tracking-widest rounded hover:bg-primary-hover transition-colors mt-8"
                                >
                                    Deliver to this Address
                                </button>
                            )}
                        </motion.div>
                    )}

                    {/* STEP 3: PAYMENT */}
                    {step === 3 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="font-black text-gray-900 uppercase tracking-widest text-sm">Choose Payment Mode</h3>
                                <button onClick={() => setStep(2)} className="text-xs text-primary font-bold hover:underline">Edit Address</button>
                            </div>

                            <div className="border border-gray-100 rounded flex flex-col md:flex-row overflow-hidden overflow-y-auto">
                                {/* Tabs */}
                                <div className="w-full md:w-64 bg-[#f5f5f6]">
                                    {[
                                        { id: 'card', name: 'Credit / Debit Card', icon: <BsCreditCard /> },
                                        { id: 'upi', name: 'UPI (PhonePe, GPay)', icon: <BsLightningCharge /> },
                                        { id: 'cod', name: 'Cash On Delivery', icon: <BsCashStack /> }
                                    ].map((method) => (
                                        <button
                                            key={method.id}
                                            onClick={() => setPaymentMethod(method.id)}
                                            className={`w-full text-left px-6 py-6 flex items-center space-x-3 transition-all border-b border-gray-200 md:border-b-0 md:border-l-4
                            ${paymentMethod === method.id ? 'bg-white border-primary text-gray-900 font-black' : 'border-transparent text-gray-500 font-bold hover:bg-gray-100'}`}
                                        >
                                            <span className="text-lg">{method.icon}</span>
                                            <span className="text-xs uppercase tracking-tight">{method.name}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Tab Content */}
                                <div className="flex-1 p-8">
                                    <AnimatePresence mode="wait">
                                        {paymentMethod === 'card' && (
                                            <motion.div
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="space-y-6"
                                            >
                                                <h4 className="font-black text-gray-900 text-xs uppercase tracking-widest mb-6 border-b border-gray-100 pb-2">Credit / Debit Card</h4>
                                                <div className="space-y-4">
                                                    <input type="text" placeholder="Card Number" className="w-full border border-gray-200 p-3 rounded text-sm font-bold focus:ring-1 focus:ring-primary outline-none" />
                                                    <input type="text" placeholder="Name on Card" className="w-full border border-gray-200 p-3 rounded text-sm font-bold focus:ring-1 focus:ring-primary outline-none" />
                                                    <div className="flex gap-4">
                                                        <input type="text" placeholder="MM / YY" className="flex-1 border border-gray-200 p-3 rounded text-sm font-bold focus:ring-1 focus:ring-primary outline-none" />
                                                        <input type="text" placeholder="CVV" className="flex-1 border border-gray-200 p-3 rounded text-sm font-bold focus:ring-1 focus:ring-primary outline-none" />
                                                    </div>
                                                    <button
                                                        onClick={handlePlaceOrder}
                                                        disabled={isProcessing}
                                                        className="w-full bg-primary text-white py-4 font-black uppercase tracking-widest rounded hover:bg-primary-hover transition-colors disabled:opacity-50"
                                                    >
                                                        {isProcessing ? 'Processing...' : `Pay $${totalAmount.toFixed(2)}`}
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}

                                        {paymentMethod === 'upi' && (
                                            <motion.div
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="space-y-6"
                                            >
                                                <h4 className="font-black text-gray-900 text-xs uppercase tracking-widest mb-6 border-b border-gray-100 pb-2">Pay via UPI</h4>
                                                <div className="bg-gray-50 p-6 rounded-sm border border-dashed border-gray-200 text-center">
                                                    <p className="text-xs font-bold text-gray-500 mb-4 uppercase">Scan QR or Enter UPI ID</p>
                                                    <div className="w-32 h-32 bg-white mx-auto mb-6 flex items-center justify-center border border-gray-100 italic font-black text-gray-300">QR CODE</div>
                                                    <input type="text" placeholder="username@upi" className="w-full border border-gray-200 p-3 rounded text-center text-sm font-bold mb-4 focus:ring-1 focus:ring-primary outline-none" />
                                                    <button
                                                        onClick={handlePlaceOrder}
                                                        disabled={isProcessing}
                                                        className="w-full bg-primary text-white py-4 font-black uppercase tracking-widest rounded hover:bg-primary-hover transition-colors disabled:opacity-50"
                                                    >
                                                        {isProcessing ? 'Verifying...' : 'Pay Now'}
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}

                                        {paymentMethod === 'cod' && (
                                            <motion.div
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="space-y-6"
                                            >
                                                <h4 className="font-black text-gray-900 text-xs uppercase tracking-widest mb-6 border-b border-gray-100 pb-2">Cash on Delivery</h4>
                                                <div className="bg-gray-50 p-6 rounded-sm border border-gray-100">
                                                    <p className="text-sm font-bold text-gray-700 mb-6 leading-relaxed">You can pay via cash/card or UPI at the time of delivery. An additional fee of <span className="text-primary">$2</span> might apply for COD orders in some regions.</p>
                                                    <button
                                                        onClick={handlePlaceOrder}
                                                        disabled={isProcessing}
                                                        className="w-full bg-gray-900 text-white py-4 font-black uppercase tracking-widest rounded hover:bg-black transition-colors disabled:opacity-50"
                                                    >
                                                        {isProcessing ? 'Submitting...' : 'Confirm Order'}
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Right Section: Price Summary */}
                <div className="lg:w-1/3">
                    <div className="sticky top-44">
                        <h3 className="font-black text-gray-900 uppercase tracking-widest text-xs mb-6">Order Summary ({itemsCount} Items)</h3>

                        <div className="space-y-4 text-sm text-gray-700 mb-8 max-h-48 overflow-y-auto pr-2 no-scrollbar">
                            {checkoutItems.map(item => (
                                <div key={item.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                                    <div className="flex items-center space-x-3">
                                        <img src={item.thumbnail} className="w-10 h-10 object-contain" />
                                        <div className="truncate max-w-[150px]">
                                            <p className="text-[10px] font-black truncate uppercase">{item.title}</p>
                                            <p className="text-[10px] text-gray-400">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <span className="font-black text-xs text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4 text-sm text-gray-700 mb-6">
                            <div className="flex justify-between font-medium">
                                <span>Total MRP</span>
                                <span>${totalMRP.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-medium text-green-600">
                                <span>Discount on MRP</span>
                                <span>-${discountAmount.toFixed(2)}</span>
                            </div>
                            {isCouponEligible && (
                                <div className="flex justify-between font-bold text-primary">
                                    <span className="flex items-center space-x-1">
                                        <BsLightningCharge />
                                        <span>Auto Coupon (10% OFF)</span>
                                    </span>
                                    <span>-${couponDiscount.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between font-medium">
                                <span>Shipping Fee</span>
                                <span className="text-green-600 font-bold uppercase text-[10px]">Free</span>
                            </div>
                        </div>

                        <hr className="mb-6 border-gray-100" />

                        <div className="flex justify-between font-black text-gray-900 text-lg mb-8">
                            <span>Total Amount</span>
                            <span>${totalAmount.toFixed(2)}</span>
                        </div>

                        <div className="bg-gray-50 p-4 rounded flex items-center space-x-3">
                            <BsShieldCheck className="text-green-500 text-2xl" />
                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-wider">Safe and secure payments. 100% Authentic products.</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

const CheckoutPage = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        }>
            <CheckoutContent />
        </Suspense>
    );
};

export default CheckoutPage;
