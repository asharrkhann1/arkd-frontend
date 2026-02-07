'use client';
import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const reasons = [
    "Instant Automated Delivery System",
    "24/7 Live Chat Support (Real Humans)",
    "Lifetime Warranty on Accounts",
    "Best Price Guarantee",
    "100% Secure Payment Gateways",
    "Over 1 Million Satisfied Customers"
];

const WhyChooseUs = () => {
    return (
        <section className="py-24 bg-[#0a0a0a] relative">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Visual Side */}
                    <div className="relative order-2 lg:order-1">
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl blur-2xl opacity-20 transform -rotate-3"></div>
                        <div className="relative bg-[#141414] border border-gray-800 rounded-3xl p-8 md:p-12 overflow-hidden shadow-2xl">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -ml-16 -mb-16 pointer-events-none" />

                            <div className="relative z-10">
                                <div className="text-6xl font-black text-white/10 mb-6">01</div>
                                <h3 className="text-3xl font-bold text-white mb-4">Premium Quality</h3>
                                <p className="text-gray-400 mb-8">We verify every seller and product manually to ensure you get exactly what you pay for. No scams, no hassle.</p>

                                <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                                    <div className="w-3/4 h-full bg-orange-500 rounded-full"></div>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 mt-2">
                                    <span>Customer Satisfaction</span>
                                    <span>99.8%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Side */}
                    <div className="order-1 lg:order-2">
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                            WHY CHOOSE <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400">GAMEMARKET?</span>
                        </h2>
                        <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                            We aren't just a marketplace; we are gamers serving gamers. We built the platform we always wanted to use - fast, safe, and reliable.
                        </p>

                        <div className="space-y-4">
                            {reasons.map((reason, idx) => (
                                <div key={idx} className="flex items-start space-x-3">
                                    <CheckCircle2 className="w-6 h-6 text-orange-500 shrink-0 mt-0.5" />
                                    <span className="text-gray-300 font-medium">{reason}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
