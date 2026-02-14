'use client';
import React from 'react';
import { motion } from 'framer-motion';

const AnimatedDivider = () => {
    return (
        <div className="relative w-full h-24 bg-black/50 py-8 flex items-center overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-50" />
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-50" />

            <div className="w-full relative flex overflow-hidden">
                <motion.div
                    className="flex space-x-12 whitespace-nowrap"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 30
                    }}
                >
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-12">
                            <span className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 uppercase tracking-tighter select-none">
                                LEVEL UP YOUR GAME
                            </span>
                            <span className="text-orange-600 text-xl font-bold">///</span>
                            <span className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 uppercase tracking-tighter select-none">
                                INSTANT DELIVERY
                            </span>
                            <span className="text-orange-600 text-xl font-bold">///</span>
                            <span className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 uppercase tracking-tighter select-none">
                                SECURE PAYMENTS
                            </span>
                            <span className="text-orange-600 text-xl font-bold">///</span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default AnimatedDivider;
