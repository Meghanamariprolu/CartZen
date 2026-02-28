'use client';

import React, { useState } from 'react';
import { BsEnvelope, BsPhone, BsGeoAlt, BsClock, BsCheckCircle } from 'react-icons/bs';
import { motion } from 'framer-motion';

export default function ContactPage() {
    const [status, setStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message'),
        };

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (res.ok) {
                setStatus('success');
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="bg-white min-h-screen pt-32 pb-20 px-4">
            <div className="max-w-screen-xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-3xl font-black text-gray-900 uppercase tracking-[0.2em] mb-4">Contact Us</h1>
                    <div className="w-20 h-1 bg-primary mx-auto"></div>
                    <p className="mt-6 text-gray-500 max-w-2xl mx-auto font-medium">
                        We love hearing from you! Whether you have a question about our collections, orders, or just want to say hello, our team is here for you.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Contact Info */}
                    <div className="space-y-12">
                        <div className="flex items-start space-x-6">
                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center flex-shrink-0">
                                <BsEnvelope className="text-xl text-primary" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-1">Email Us</h3>
                                <p className="text-gray-500 font-medium">support@cartzen.com</p>
                                <p className="text-gray-500 font-medium">meghana@cartzen.com</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-6">
                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center flex-shrink-0">
                                <BsPhone className="text-xl text-primary" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-1">Call Us</h3>
                                <p className="text-gray-500 font-medium">+91 98765 43210</p>
                                <p className="text-gray-500 font-medium">+1 (555) 000-0000</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-6">
                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center flex-shrink-0">
                                <BsGeoAlt className="text-xl text-primary" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-1">Our Studio</h3>
                                <p className="text-gray-500 font-medium">123 Fashion Street, Design District</p>
                                <p className="text-gray-500 font-medium">Mumbai, India - 400001</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-6">
                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center flex-shrink-0">
                                <BsClock className="text-xl text-primary" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-1">Working Hours</h3>
                                <p className="text-gray-500 font-medium">Mon - Sat: 10:00 AM - 7:00 PM</p>
                                <p className="text-gray-500 font-medium">Sunday: Closed</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-gray-50 p-8 sm:p-12 rounded-2xl shadow-sm border border-gray-100">
                        {status === 'success' ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="h-full flex flex-col items-center justify-center text-center py-10"
                            >
                                <BsCheckCircle className="text-6xl text-green-500 mb-6" />
                                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-2">Message Sent!</h2>
                                <p className="text-gray-500 font-medium">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                                <button
                                    onClick={() => setStatus('')}
                                    className="mt-8 text-primary font-black uppercase text-xs tracking-widest hover:underline"
                                >
                                    Send another message
                                </button>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Name</label>
                                        <input required name="name" type="text" className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary transition-all font-bold" placeholder="Your Name" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Email</label>
                                        <input required name="email" type="email" className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary transition-all font-bold" placeholder="me@example.com" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Subject</label>
                                    <input required name="subject" type="text" className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary transition-all font-bold" placeholder="How can we help?" />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Message</label>
                                    <textarea required name="message" rows="5" className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary transition-all font-bold resize-none" placeholder="Your message here..."></textarea>
                                </div>
                                <button type="submit" className="w-full bg-primary text-white font-black uppercase tracking-widest py-4 rounded-lg hover:bg-primary-hover transition-all shadow-lg shadow-primary/20">
                                    Send Message
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
