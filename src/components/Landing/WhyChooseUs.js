'use client';
import React from 'react';
import { Zap, ShieldCheck, Headphones, BadgeDollarSign, Lock, Users, Sparkles } from 'lucide-react';

const features = [
    {
        icon: Zap,
        title: 'Instant Delivery',
        desc: 'Your order will be delivered by an automated system seconds after you make the transaction.',
        color: 'from-orange-500 to-orange-600',
        textColor: 'text-orange-400',
    },
    {
        icon: Headphones,
        title: '24/7 Live Support',
        desc: 'Available to assist you via live chat 24/7.',
        color: 'from-green-500 to-emerald-600',
        textColor: 'text-green-400',
    },
    {
        icon: ShieldCheck,
        title: 'Warranty',
        desc: 'Not Decided!',
        color: 'from-blue-500 to-blue-600',
        textColor: 'text-blue-400',
    },
    {
        icon: BadgeDollarSign,
        title: 'Best Prices',
        desc: 'We aim to offer the most competitive rates available.',
        color: 'from-yellow-500 to-amber-600',
        textColor: 'text-yellow-400',
    },
    {
        icon: Lock,
        title: 'Secure Payments',
        desc: 'Fully encrypted payment gateways with real-time fraud monitoring on every transaction.',
        color: 'from-purple-500 to-violet-600',
        textColor: 'text-purple-400',
    }
];

const WhyChooseUs = () => {
    return (
        <section className="py-24 bg-black relative overflow-hidden">
            {/* Background gradient orbs */}
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Premium Section Header */}
                <div className="text-center mb-14">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] mb-6">
                        <Sparkles className="w-4 h-4 text-orange-400" />
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Why We're #1</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-4 uppercase tracking-tight">
                        WHY CHOOSE <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">ARKD?</span>
                    </h2>
                    <p className="text-gray-500 max-w-xl mx-auto text-sm font-medium leading-relaxed">
                        Built by gamers, for gamers. Fast, safe, and reliable — the marketplace we always wanted.
                    </p>
                </div>

                {/* Premium Glassmorphism Cards */}
                <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 place-items-center">
                    {features.map((f, idx) => {
                        const Icon = f.icon;
                        return (
                            <div
                                key={idx}
                                className="rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-sm border border-white/[0.12] p-6 hover:border-orange-500/30 hover:shadow-[0_0_30px_rgba(249,115,22,0.15)] transition-all duration-500 group w-full h-64 flex flex-col justify-center"
                            >
                                {/* Premium Icon with gradient border */}
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} p-[1px] mb-4 group-hover:scale-110 transition-transform duration-500 mx-auto`}>
                                    <div className="w-full h-full rounded-xl bg-[#141419] flex items-center justify-center">
                                        <Icon className={`w-5 h-5 ${f.textColor}`} />
                                    </div>
                                </div>
                                <div className="flex-1 flex flex-col justify-center">
                                    <h3 className="text-lg font-black text-white mb-2 text-center">{f.title}</h3>
                                    <p className="text-sm text-gray-400 leading-relaxed text-center">{f.desc}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
