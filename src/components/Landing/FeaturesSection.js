'use client';
import React, { useState } from 'react';
import { MousePointer2, ShieldCheck, PlayCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const steps = [
    {
        id: 'select',
        title: "Select Service",
        desc: "Browse our extensive catalog of accounts, top-ups, and currencies and pick what suits you best.",
        icon: MousePointer2,
        details: "Choose from thousands of verified products across 50+ popular titles. Our filters make it easy to find exactly what you're looking for.",
        imagePath: "/step1.webp" // Placeholders
    },
    {
        id: 'secure',
        title: "Secure Payment",
        desc: "Checkout with our fully encrypted and protected payment gateways.",
        icon: ShieldCheck,
        details: "Multiple payment methods supported. Every transaction is monitored by our anti-fraud systems to ensure 100% safety.",
        imagePath: "/step2.webp"
    },
    {
        id: 'order',
        title: "Order Starts",
        desc: "Our automated system or manual agents begin processing your request immediately.",
        icon: PlayCircle,
        details: "Real-time updates on your order status. Most orders enter the processing phase in less than 60 seconds.",
        imagePath: "/step3.webp"
    },
    {
        id: 'completed',
        title: "Order Completed",
        desc: "Receive your goods instantly and enjoy your new level of gaming.",
        icon: CheckCircle2,
        details: "Full warranty included with every purchase. Join our community and share your success stories!",
        imagePath: "/step4.webp"
    }
];

const FeaturesSection = () => {
    const [activeStep, setActiveStep] = useState(0);

    return (
        <section className="py-24 bg-[#0a0a0a] overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-4 italic uppercase tracking-tighter">
                        HOW <span className="text-orange-500 underline decoration-orange-500/50 underline-offset-8">ARKD WORKS</span>
                    </h2>
                    <p className="text-gray-500 max-w-xl mx-auto uppercase text-sm font-bold tracking-widest">Simple steps to power up your game</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* LEFT SIDE: STEPS */}
                    <div className="space-y-4">
                        {steps.map((step, idx) => (
                            <button
                                key={step.id}
                                onClick={() => setActiveStep(idx)}
                                className={`w-full text-left p-6 rounded-2xl border transition-all duration-500 group relative overflow-hidden ${activeStep === idx
                                    ? 'bg-[#171717] border-orange-500/50 shadow-[0_0_30px_rgba(249,115,22,0.1)]'
                                    : 'bg-transparent border-gray-800 hover:border-gray-700'
                                    }`}
                            >
                                {activeStep === idx && (
                                    <motion.div
                                        layoutId="active-pill"
                                        className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent pointer-events-none"
                                    />
                                )}

                                <div className="flex items-center space-x-6 relative z-10">
                                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-500 ${activeStep === idx
                                        ? 'bg-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.4)] scale-110'
                                        : 'bg-[#111] text-gray-500 group-hover:text-gray-300'
                                        }`}>
                                        <step.icon className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h3 className={`text-xl font-black transition-colors duration-500 italic uppercase ${activeStep === idx ? 'text-white' : 'text-gray-500 group-hover:text-gray-400'
                                            }`}>
                                            {step.title}
                                        </h3>
                                        <p className={`text-sm transition-colors duration-500 ${activeStep === idx ? 'text-gray-300' : 'text-gray-600 group-hover:text-gray-500'
                                            }`}>
                                            {step.desc}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* RIGHT SIDE: DETAILS/IMAGE */}
                    <div className="relative">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4 }}
                                className="bg-[#111] border border-gray-800 rounded-3xl p-8 md:p-12 min-h-[400px] flex flex-col justify-center relative overflow-hidden group shadow-2xl"
                            >
                                {/* Background Decorative Elements */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] -ml-32 -mb-32 pointer-events-none" />

                                <div className="relative z-10 text-center lg:text-left">
                                    <span className="text-orange-500 font-black text-6xl opacity-10 absolute -top-8 -left-4 lg:-left-8 select-none">
                                        0{activeStep + 1}
                                    </span>
                                    <h2 className="text-3xl md:text-4xl font-black text-white mb-6 uppercase italic">
                                        {steps[activeStep].title}
                                    </h2>
                                    <p className="text-gray-400 text-lg leading-relaxed mb-8">
                                        {steps[activeStep].details}
                                    </p>

                                    <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                                        <div className="px-4 py-2 bg-[#1a1a1a] rounded-lg border border-gray-800 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                            Verified Service
                                        </div>
                                        <div className="px-4 py-2 bg-[#1a1a1a] rounded-lg border border-gray-800 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                            Fast Support
                                        </div>
                                    </div>
                                </div>

                                {/* Decorative Progress Bar */}
                                <div className="absolute bottom-0 left-0 h-1 bg-orange-500 w-full transform origin-left transition-transform duration-[4000ms] ease-linear scale-x-100" />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
