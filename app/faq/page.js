'use client';

import React, { useState } from 'react';
import { BsPlus, BsDash } from 'react-icons/bs';

const faqData = [
    {
        question: "How do I track my order?",
        answer: "Once your order is shipped, you will receive an email and SMS with the tracking ID and a link to the courier's website. You can also track your order in the 'Orders' section of your profile."
    },
    {
        question: "What is your return policy?",
        answer: "We offer a 14-day hassle-free return policy for most products. The items must be unused, in their original packaging, and with all tags intact. Some products like innerwear and jewelry are non-returnable for hygiene reasons."
    },
    {
        question: "How long does shipping take?",
        answer: "Standard shipping usually takes 3-5 business days for metro cities and 5-7 business days for other locations. Express shipping (where available) takes 1-2 business days."
    },
    {
        question: "Is there a delivery charge?",
        answer: "Shipping is FREE on all orders above $50. For orders below $50, a nominal delivery charge of $2.99 is applied."
    },
    {
        question: "How can I cancel my order?",
        answer: "You can cancel your order anytime before it has been shipped. Go to 'Profile' > 'Orders', select the order, and click 'Cancel Order'. If the order has already been shipped, you can refuse it at the time of delivery or initiate a return later."
    },
    {
        question: "What payment methods do you accept?",
        answer: "We accept all major Credit/Debit cards (Visa, Mastercard, Amex), Net Banking, UPI, and popular digital wallets. Cash on Delivery (COD) is also available for most pin codes."
    }
];

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <div className="bg-white min-h-screen pt-32 pb-20 px-4">
            <div className="max-w-screen-md mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-3xl font-black text-gray-900 uppercase tracking-[0.2em] mb-4">Frequently Asked Questions</h1>
                    <div className="w-20 h-1 bg-primary mx-auto"></div>
                    <p className="mt-6 text-gray-500 font-medium">
                        Everything you need to know about shopping with CartZen.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqData.map((item, index) => (
                        <div key={index} className="border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:border-primary/20 transition-colors">
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                                className="w-full flex items-center justify-between p-6 text-left bg-white transition-colors"
                            >
                                <span className="text-sm font-black text-gray-900 uppercase tracking-tight">{item.question}</span>
                                {openIndex === index ? (
                                    <BsDash className="text-2xl text-primary" />
                                ) : (
                                    <BsPlus className="text-2xl text-gray-400" />
                                )}
                            </button>
                            {openIndex === index && (
                                <div className="p-6 pt-0 text-gray-500 text-sm leading-relaxed font-medium bg-white animate-fade-in">
                                    {item.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-20 text-center bg-gray-50 p-10 rounded-2xl border border-dashed border-gray-200">
                    <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-2">Still have questions?</h2>
                    <p className="text-gray-500 text-sm mb-6">If you cannot find the answer you are looking for, please contact our support team.</p>
                    <a href="/contact" className="inline-block bg-primary text-white font-black uppercase tracking-widest px-8 py-3 rounded-lg hover:bg-primary-hover transition-all">
                        Contact Support
                    </a>
                </div>
            </div>
        </div>
    );
}
