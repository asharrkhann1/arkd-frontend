'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ShieldCheck, Zap, ArrowRight } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';

export default function AddonModal({
    isOpen,
    onClose,
    onConfirm,
    product,
    initialSelected = {},
    showPrices = false,
    title = "Customize Your Service",
    description = "Select your preferred addons to enhance your experience."
}) {
    const { formatPrice } = useCurrency();
    const [selectedAddons, setSelectedAddons] = useState(initialSelected || {});

    // Sync selected addons when initialSelected or product changes
    useEffect(() => {
        if (isOpen) {
            const defaults = { ...(initialSelected || {}) };
            if (product?.addons) {
                Object.entries(product.addons).forEach(([category, options]) => {
                    if (!defaults[category]) {
                        const defaultOption = options.find(o => o.default) || options[0];
                        if (defaultOption) {
                            defaults[category] = defaultOption.key;
                        }
                    }
                });
            }
            setSelectedAddons(defaults);
        }
    }, [isOpen, product, initialSelected]);

    // If no addons are available, we shouldn't even show the modal.
    // The parent should handle this, but as a fallback:
    if (!isOpen) return null;

    const actualAddons = product?.addons || {};
    const addonCategories = Object.keys(actualAddons);
    const hasAnyAddons = addonCategories.length > 0;

    if (!hasAnyAddons) {
        // If we reach here and it's open but no addons, confirm immediately and return null
        return null;
    }

    const handleOptionChange = (category, key) => {
        setSelectedAddons(prev => ({
            ...prev,
            [category]: key
        }));
    };

    const handleNext = () => {
        onConfirm(selectedAddons);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                    />
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden"
                    >
                        {/* Background Glow */}
                        <div className="absolute -top-24 -left-24 w-64 h-64 bg-orange-500/10 blur-[100px] rounded-full pointer-events-none" />
                        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-orange-500/5 blur-[100px] rounded-full pointer-events-none" />

                        <div className="relative space-y-8">
                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <h2 className="text-4xl font-black italic uppercase tracking-tighter">
                                        {title}
                                    </h2>
                                    <p className="text-gray-500 text-sm font-medium">
                                        {description}
                                    </p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-500 hover:text-white"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-8 max-h-[50vh] overflow-y-auto pr-4 custom-scrollbar">
                                {Object.entries(product.addons).map(([category, options]) => (
                                    <div key={category} className="space-y-4">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                            {category.replace('_', ' ')}
                                        </h3>
                                        <div className="grid gap-3">
                                            {options.map((option) => {
                                                const isSelected = selectedAddons[category] === option.key;
                                                return (
                                                    <button
                                                        key={option.key}
                                                        onClick={() => handleOptionChange(category, option.key)}
                                                        className={`flex items-center justify-between p-5 rounded-2xl border transition-all text-left group ${isSelected
                                                            ? 'bg-orange-600/10 border-orange-500/50 ring-1 ring-orange-500/50'
                                                            : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected
                                                                ? 'border-orange-500 bg-orange-500'
                                                                : 'border-white/10 bg-transparent'
                                                                }`}>
                                                                {isSelected && <Check className="w-3 h-3 text-white stroke-[4]" />}
                                                            </div>
                                                            <div>
                                                                <p className={`font-black italic uppercase tracking-tight ${isSelected ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'}`}>
                                                                    {option.label}
                                                                </p>
                                                                {option.duration_days && (
                                                                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">
                                                                        Duration: {option.duration_days} Days
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {showPrices && option.price > 0 && (
                                                            <div className="text-right">
                                                                <p className="text-lg font-black italic text-orange-500 tracking-tighter">
                                                                    +{formatPrice(option.price)}
                                                                </p>
                                                            </div>
                                                        )}
                                                        {showPrices && option.price === 0 && (
                                                            <div className="text-right">
                                                                <p className="text-[10px] font-black italic text-green-500 uppercase tracking-widest">
                                                                    FREE
                                                                </p>
                                                            </div>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-4 flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={onClose}
                                    className="flex-1 py-5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-2xl font-black italic uppercase tracking-widest transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="flex-[2] py-5 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-black italic uppercase tracking-widest transition-all shadow-[0_15px_35px_rgba(234,88,12,0.3)] hover:-translate-y-1 flex items-center justify-center gap-3"
                                >
                                    Next <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
