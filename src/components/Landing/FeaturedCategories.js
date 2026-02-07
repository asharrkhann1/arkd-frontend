'use client';
import React from 'react';
import Link from 'next/link';
import { Users, Zap, Coins, ArrowRight, Gift, Package, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';
import { useData } from '@/contexts/DataContext'

import { serviceConfigs } from '@/constants/servicesConfig';

const FeaturedCategories = () => {
    const { services } = useData();
    const activeCategories = services ? services.map(s => {
        const type = typeof s === 'string' ? s : s.type;
        return serviceConfigs[type];
    }).filter(Boolean) : [];

    return (
        <section className="py-12 relative">
            <div className="container mx-auto px-4">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white uppercase tracking-wider">
                        Browse what we <span className="text-orange-500">offer</span>
                    </h2>
                </div>

                <div className="max-w-2xl mx-auto">
                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-8">
                        {activeCategories.map((cat, idx) => (
                            <Link
                                key={cat.id}
                                href={cat.href}
                                className="group flex flex-col items-center"
                            >
                                <motion.div
                                    className="w-20 h-20 bg-gray-900/40 backdrop-blur-sm rounded-2xl border border-gray-800 transition-all duration-300 group-hover:border-orange-500/50 group-hover:bg-gray-800/80 group-hover:-translate-y-1 flex items-center justify-center mb-3 shadow-lg relative"
                                >
                                    {cat.badge && (
                                        <div className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-orange-500 rounded-lg z-10 shadow-[0_0_10px_rgba(249,115,22,0.5)]">
                                            <span className="text-[9px] font-black text-white uppercase tracking-tighter leading-none">
                                                {cat.badge}
                                            </span>
                                        </div>
                                    )}
                                    <cat.icon className="w-10 h-10 text-gray-400 group-hover:text-orange-500 transition-colors duration-300 group-hover:scale-110" />
                                </motion.div>

                                <div className="text-center space-y-1">
                                    <h3 className="text-sm font-bold text-white group-hover:text-orange-500 transition-colors leading-tight">{cat.name}</h3>
                                    <p className="text-[10px] text-gray-500 leading-tight hidden sm:block">{cat.description}</p>
                                </div>
                            </Link>
                        ))}

                        {/* See More Card */}
                        <Link href="/services" className="group flex flex-col items-center">
                            <motion.div
                                className="w-20 h-20 bg-gradient-to-br from-orange-600/10 to-orange-500/5 backdrop-blur-sm rounded-2xl border border-orange-500/30 transition-all duration-300 group-hover:border-orange-500 group-hover:bg-orange-500/20 group-hover:-translate-y-1 overflow-hidden flex items-center justify-center mb-3 shadow-lg"
                            >
                                <ArrowRight className="w-10 h-10 text-orange-500 group-hover:text-white transition-colors duration-300" />
                            </motion.div>

                            <div className="text-center">
                                <h3 className="text-sm font-bold text-white uppercase tracking-wide group-hover:text-orange-500 transition-colors">See More</h3>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturedCategories;
