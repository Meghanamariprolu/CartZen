'use client';

import React from 'react';

export default function PrivacyPage() {
    return (
        <div className="bg-white min-h-screen pt-32 pb-20 px-4">
            <div className="max-w-screen-md mx-auto prose prose-sm prose-gray">
                <div className="text-center mb-16 not-prose">
                    <h1 className="text-3xl font-black text-gray-900 uppercase tracking-[0.2em] mb-4">Privacy Policy</h1>
                    <div className="w-20 h-1 bg-primary mx-auto"></div>
                </div>

                <div className="space-y-8 text-gray-600 font-medium">
                    <section>
                        <h2 className="text-gray-900 font-black uppercase tracking-tight text-lg mb-4">1. Information We Collect</h2>
                        <p>We collect information you provide directly to us when you create an account, make a purchase, or contact our support team. This may include your name, email, phone number, and shipping address.</p>
                    </section>

                    <section>
                        <h2 className="text-gray-900 font-black uppercase tracking-tight text-lg mb-4">2. How We Use Your Information</h2>
                        <p>We use the information we collect to process your orders, communicate with you about your purchases, and improve our services. We may also send you promotional emails about new products and special offers.</p>
                    </section>

                    <section>
                        <h2 className="text-gray-900 font-black uppercase tracking-tight text-lg mb-4">3. Data Security</h2>
                        <p>We take the security of your personal data seriously and use appropriate technical and organizational measures to protect your information from unauthorized access, loss, or theft.</p>
                    </section>

                    <section>
                        <h2 className="text-gray-900 font-black uppercase tracking-tight text-lg mb-4">4. Sharing Your Information</h2>
                        <p>We do not sell or rent your personal information to third parties. We may share your information with trusted service providers who help us operate our website and process your orders.</p>
                    </section>

                    <section>
                        <h2 className="text-gray-900 font-black uppercase tracking-tight text-lg mb-4">5. Cookies</h2>
                        <p>Our website uses cookies to enhance your browsing experience. You can choose to disable cookies through your browser settings, although this may affect the functionality of our website.</p>
                    </section>

                    <section>
                        <h2 className="text-gray-900 font-black uppercase tracking-tight text-lg mb-4">6. Your Rights</h2>
                        <p>You have the right to access, correct, or delete your personal information held by us. If you wish to exercise any of these rights, please contact us at privacy@cartzen.com.</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
