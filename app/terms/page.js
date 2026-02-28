'use client';

import React from 'react';

export default function TermsPage() {
    return (
        <div className="bg-white min-h-screen pt-32 pb-20 px-4">
            <div className="max-w-screen-md mx-auto prose prose-sm prose-gray">
                <div className="text-center mb-16 not-prose">
                    <h1 className="text-3xl font-black text-gray-900 uppercase tracking-[0.2em] mb-4">Terms & Conditions</h1>
                    <div className="w-20 h-1 bg-primary mx-auto"></div>
                </div>

                <div className="space-y-8 text-gray-600 font-medium">
                    <section>
                        <h2 className="text-gray-900 font-black uppercase tracking-tight text-lg mb-4">1. Introduction</h2>
                        <p>Welcome to CartZen. By accessing and using this website, you agree to comply with and be bound by the following terms and conditions. If you disagree with any part of these terms, please do not use our website.</p>
                    </section>

                    <section>
                        <h2 className="text-gray-900 font-black uppercase tracking-tight text-lg mb-4">2. Intellectual Property</h2>
                        <p>The content, layout, design, data, databases and graphics on this website are protected by intellectual property laws and are owned by CartZen. Unless expressly permitted in writing, you may not copy, download, transmit or store any material from this website.</p>
                    </section>

                    <section>
                        <h2 className="text-gray-900 font-black uppercase tracking-tight text-lg mb-4">3. Use of Website</h2>
                        <p>You agree to use this website only for lawful purposes and in a manner that does not infringe the rights of, or restrict the use and enjoyment of this website by any third party.</p>
                    </section>

                    <section>
                        <h2 className="text-gray-900 font-black uppercase tracking-tight text-lg mb-4">4. Order & Payments</h2>
                        <p>All orders placed through our website are subject to availability and acceptance. Prices are subject to change without notice. We reserve the right to refuse service to anyone for any reason at any time.</p>
                    </section>

                    <section>
                        <h2 className="text-gray-900 font-black uppercase tracking-tight text-lg mb-4">5. Limitation of Liability</h2>
                        <p>CartZen shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use the services or products purchased through the website.</p>
                    </section>

                    <section>
                        <h2 className="text-gray-900 font-black uppercase tracking-tight text-lg mb-4">6. Changes to Terms</h2>
                        <p>We reserve the right to modify these terms at any time. Your continued use of the website following any changes signifies your acceptance of the new terms.</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
