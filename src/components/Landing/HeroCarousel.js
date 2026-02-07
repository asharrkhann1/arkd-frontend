'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    ChevronRight,
    User,
    Coins,
    Gift,
    Package,
    Shield,
    Zap,
    Star,
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
        <div className="relative w-full h-[60vh] md:h-[60vh] sm:h-[70vh] overflow-hidden">
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
                        className="absolute inset-0 bg-cover bg-center opacity-20"
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
                                {/* Category Badge */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.3 }}
                                    className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/30 w-fit"
                                >
                                    <currentSlideData.icon className="w-5 h-5 text-white" />
                                    <span className="text-white font-medium">
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
                                        className={`bg-orange-500 bg-clip-text text-transparent`}
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
                                    className="text-lg md:text-xl text-gray-200 leading-relaxed"
                                >
                                    {currentSlideData.subtext}
                                </motion.p>

                                {/* Features List */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.7 }}
                                    className="flex flex-wrap gap-6 text-white/80"
                                >
                                    <div className="flex items-center space-x-2">
                                        <Shield className="w-5 h-5 text-white" />
                                        <span>Secure</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Zap className="w-5 h-5 text-white" />
                                        <span>Instant</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Star className="w-5 h-5 text-white" />
                                        <span>Premium</span>
                                    </div>
                                </motion.div>

                                {/* CTA Button */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.8 }}
                                    className="pt-2 md:pt-4"
                                >
                                    <Link
                                        href={currentSlideData.ctaLink}
                                        className="group inline-flex items-center space-x-3 px-6 md:px-8 py-3 md:py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-bold text-base md:text-lg rounded-full hover:bg-white/20 transition-all duration-300 transform hover:scale-105 active:scale-95 w-fit"
                                    >
                                        <span>{currentSlideData.ctaText}</span>
                                        <motion.div
                                            animate={{ x: [0, 5, 0] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                        >
                                            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                        </motion.div>
                                    </Link>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 z-20 p-3 bg-black/30 backdrop-blur-sm hover:bg-black/50 rounded-full transition-all duration-300 group border border-white/30"
            >
                <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
            </button>

            <button
                onClick={nextSlide}
                className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 z-20 p-3 bg-black/30 backdrop-blur-sm hover:bg-black/50 rounded-full transition-all duration-300 group border border-white/30"
            >
                <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
                            ? 'bg-white scale-125'
                            : 'bg-white/30 hover:bg-white/60 border border-white/50'
                            }`}
                    />
                ))}
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10 z-20">
                <motion.div
                    key={currentSlide}
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 4.5, ease: 'linear' }}
                    className={`h-full bg-orange-500`}
                />
            </div>
        </div>
    );
};

export default HeroCarousel;
