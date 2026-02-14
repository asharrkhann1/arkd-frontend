'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    ChevronRight,
    Shield,
    Zap,
    Star,
    Sparkles,
} from 'lucide-react';
import { slides } from '@/constants/slides'; // import the slides constant

const HeroCarousel = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 4500);

        return () => clearInterval(interval);
    }, [isAutoPlaying, slides.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    const currentSlideData = slides[currentSlide];

    return (
        <div className="relative w-full h-[60vh] md:h-[60vh] sm:h-[70vh] overflow-hidden bg-black">
            {/* Background gradient orbs */}
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[150px] pointer-events-none z-0" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none z-0" />

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                    className={`absolute inset-0 bg-gradient-to-br ${currentSlideData.bgColor}`}
                >
                    {/* Background Image Overlay */}
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${currentSlideData.image})` }}
                    />

                    {/* Animated Background Elements */}
                    <div className="absolute inset-0 overflow-hidden">
                        <motion.div
                            animate={{
                                rotate: [0, 360],
                                scale: [1, 1.2, 1],
                            }}
                            transition={{
                                duration: 20,
                                repeat: Infinity,
                                ease: 'linear',
                            }}
                            className="absolute -top-20 -right-20 w-96 h-96 border border-white/10 rounded-full"
                        />
                        <motion.div
                            animate={{
                                rotate: [360, 0],
                                scale: [1.2, 1, 1.2],
                            }}
                            transition={{
                                duration: 15,
                                repeat: Infinity,
                                ease: 'linear',
                            }}
                            className="absolute -bottom-32 -left-32 w-80 h-80 border border-white/5 rounded-full"
                        />
                    </div>

                    {/* Content Container */}
                    <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-center">
                        <div className="flex items-center justify-between w-full">
                            {/* Text Content */}
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="text-left space-y-4 md:space-y-6 max-w-[600px] flex-1"
                            >
                                {/* Premium Category Badge */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.3 }}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.06] backdrop-blur-md rounded-full border border-white/[0.12] w-fit"
                                >
                                    <Sparkles className="w-4 h-4 text-orange-400" />
                                    <span className="text-white font-bold uppercase text-xs tracking-wider">
                                        {currentSlideData.ctaText.replace(
                                            /^(Shop|Buy|Get|Browse)\s/,
                                            ''
                                        )}
                                    </span>
                                </motion.div>

                                {/* Main Headline */}
                                <motion.h1
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.4 }}
                                    className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight"
                                >
                                    <span
                                        className={`bg-gradient-to-r ${currentSlideData.bgColor.replace('from-', '').split(' ')[0].includes('orange') ? 'from-orange-400 to-orange-600' : 'from-blue-400 to-purple-600'} bg-clip-text text-transparent`}
                                    >
                                        {currentSlideData.headline
                                            .split(' ')
                                            .slice(0, -2)
                                            .join(' ')}
                                    </span>
                                    <br />
                                    <span className="text-white">
                                        {currentSlideData.headline.split(' ').slice(-2).join(' ')}
                                    </span>
                                </motion.h1>

                                {/* Subtext */}
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.6 }}
                                    className="text-lg md:text-xl text-gray-300 leading-relaxed"
                                >
                                    {currentSlideData.subtext}
                                </motion.p>

                                {/* Premium Features List */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.7 }}
                                    className="flex flex-wrap gap-4"
                                >
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08]">
                                        <Shield className="w-4 h-4 text-orange-400" />
                                        <span className="text-white/80 text-sm font-medium uppercase">Secure</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08]">
                                        <Zap className="w-4 h-4 text-yellow-400" />
                                        <span className="text-white/80 text-sm font-medium uppercase">Instant</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08]">
                                        <Star className="w-4 h-4 text-purple-400" />
                                        <span className="text-white/80 text-sm font-medium uppercase">Premium</span>
                                    </div>
                                </motion.div>

                                {/* Premium CTA Button */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.8 }}
                                    className="pt-2 md:pt-4"
                                >
                                    <Link
                                        href={currentSlideData.ctaLink}
                                        className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl text-white font-bold uppercase tracking-wider shadow-[0_0_30px_rgba(249,115,22,0.3)] hover:shadow-[0_0_40px_rgba(249,115,22,0.5)] hover:scale-105 transition-all duration-300"
                                    >
                                        <span>{currentSlideData.ctaText}</span>
                                        <motion.div
                                            animate={{ x: [0, 5, 0] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </motion.div>
                                    </Link>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Premium Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 z-20 p-3 bg-white/[0.06] backdrop-blur-md border border-white/[0.12] rounded-full hover:bg-white/[0.12] hover:border-orange-500/30 transition-all duration-300 group"
            >
                <ChevronLeft className="w-6 h-6 text-white group-hover:text-orange-400 transition-colors" />
            </button>

            <button
                onClick={nextSlide}
                className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 z-20 p-3 bg-white/[0.06] backdrop-blur-md border border-white/[0.12] rounded-full hover:bg-white/[0.12] hover:border-orange-500/30 transition-all duration-300 group"
            >
                <ChevronRight className="w-6 h-6 text-white group-hover:text-orange-400 transition-colors" />
            </button>

            {/* Premium Slide Indicators */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide
                            ? 'w-8 bg-gradient-to-r from-orange-500 to-orange-600'
                            : 'w-2 bg-white/30 hover:bg-white/60 border border-white/50'
                            }`}
                    />
                ))}
            </div>

            {/* Premium Progress Bar */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10 z-20">
                <motion.div
                    key={currentSlide}
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 4.5, ease: 'linear' }}
                    className="h-full bg-gradient-to-r from-orange-500 to-orange-600"
                />
            </div>
        </div>
    );
};

export default HeroCarousel;
