'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Ghost, Gamepad2, Home, AlertTriangle } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Ambient Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 text-center max-w-2xl mx-auto">
                {/* 404 Animated Text */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, type: 'spring', bounce: 0.5 }}
                    className="relative"
                >
                    <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600 drop-shadow-[0_0_15px_rgba(234,88,12,0.5)]">
                        404
                    </h1>

                    {/* Floating Icons */}
                    <motion.div
                        animate={{ y: [-10, 10, -10], rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute -top-12 -right-8 text-gray-700 opacity-50"
                    >
                        <Ghost className="w-24 h-24" />
                    </motion.div>

                    <motion.div
                        animate={{ y: [10, -10, 10], rotate: [0, -15, 15, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                        className="absolute -bottom-8 -left-12 text-gray-700 opacity-50"
                    >
                        <Gamepad2 className="w-20 h-20" />
                    </motion.div>
                </motion.div>

                {/* Message */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="mt-8 space-y-4"
                >
                    <h2 className="text-3xl font-bold text-white">
                        Level Not Found
                    </h2>
                    <p className="text-gray-400 text-lg max-w-md mx-auto">
                        Looks like you've ventured into an glitched area of the map.
                        This level hasn't been developed yet or has been removed by the admins.
                    </p>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="mt-10 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4"
                >
                    <Link
                        href="/"
                        className="group flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium shadow-lg hover:shadow-orange-500/25 hover:scale-105 transition-all duration-300"
                    >
                        <Home className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
                        <span>Return to Base</span>
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="group flex items-center space-x-2 px-8 py-3 bg-gray-800 text-gray-300 rounded-xl font-medium hover:bg-gray-700 hover:text-white transition-all duration-300"
                    >
                        <AlertTriangle className="w-5 h-5" />
                        <span>Go Back</span>
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
