'use client';

import React from 'react';
import { BsTruck, BsArrowLeftRight, BsShieldCheck, BsArrowCounterclockwise } from 'react-icons/bs';

export default function ShippingPage() {
    return (
        <div className="bg-white min-h-screen pt-32 pb-20 px-4">
            <div className="max-w-screen-xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-3xl font-black text-gray-900 uppercase tracking-[0.2em] mb-4">Shipping & Returns</h1>
                    <div className="w-20 h-1 bg-primary mx-auto"></div>
                    <p className="mt-6 text-gray-500 max-w-2xl mx-auto font-medium">
                        Everything you need to know about our delivery services and how we handle returns and cancellations.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Shipping Info */}
                    <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm">
                            <BsTruck className="text-2xl text-primary" />
                        </div>
                        <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-4">Shipping Policy</h2>
                        <div className="space-y-4 text-gray-600 font-medium text-sm leading-relaxed">
                            <p>We deliver to over 20,000 pin codes across India and internationally to selected countries.</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>FREE shipping on orders above $50.</li>
                                <li>$2.99 standard shipping charge for orders below $50.</li>
                                <li>Standard Delivery: 3-5 business days.</li>
                                <li>Express Delivery: 1-2 business days (available in metro cities).</li>
                            </ul>
                        </div>
                    </div>

                    {/* Returns Info */}
                    <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm">
                            <BsArrowCounterclockwise className="text-2xl text-primary" />
                        </div>
                        <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-4">Returns & Exchange</h2>
                        <div className="space-y-4 text-gray-600 font-medium text-sm leading-relaxed">
                            <p>We want you to be 100% satisfied with your purchase. If not, we offer a 14-day return window.</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Hassle-free 14-day return policy.</li>
                                <li>Reverse pickup available for most locations.</li>
                                <li>Refund initiated within 48 hours of item pickup.</li>
                                <li>Exchanges available for size issues.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Cancellation Info */}
                    <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm">
                            <BsArrowLeftRight className="text-2xl text-primary" />
                        </div>
                        <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-4">Cancellation Policy</h2>
                        <div className="space-y-4 text-gray-600 font-medium text-sm leading-relaxed">
                            <p>Orders can be cancelled anytime before they are shipped for a full refund.</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Instant refund for cancellations before shipment.</li>
                                <li>Cancellations are not possible once the order is in transit.</li>
                                <li>Partial cancellations are supported for multi-item orders.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Quality Check */}
                    <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm">
                            <BsShieldCheck className="text-2xl text-primary" />
                        </div>
                        <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-4">Quality Guarantee</h2>
                        <div className="space-y-4 text-gray-600 font-medium text-sm leading-relaxed">
                            <p>Every product undergoes a 3-layer quality check before dispatch.</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>100% Original products guaranteed.</li>
                                <li>Secure packaging to prevent transit damage.</li>
                                <li>Dedicated support for any quality-related concerns.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
