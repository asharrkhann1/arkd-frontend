'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import {
    Coins,
    Loader2,
    Minus,
    Plus,
    ShieldCheck,
    Zap,
    Clock,
    ChevronDown,
    AlertCircle,
    CheckCircle2,
    Package,
    ArrowRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

function parseDeliveryTime(dt) {
    if (!dt) return '';
    return String(dt).replace(/(\d+)d/g, '$1 day ').replace(/(\d+)h/g, '$1 hr ').replace(/(\d+)m/g, '$1 min ').replace(/(\d+)s/g, '$1 sec ').trim();
}

export default function CurrencyPage() {
    const { user, loading: authLoading, refreshMe } = useAuth();
    const { formatPrice } = useCurrency();
    const router = useRouter();

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedSpecs, setSelectedSpecs] = useState({});
    const [quantity, setQuantity] = useState(0);
    const [termsAgreed, setTermsAgreed] = useState(false);
    const [ordering, setOrdering] = useState(false);
    const [hoveredCard, setHoveredCard] = useState(null);

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            const data = await apiFetch('/currency');
            const prods = data.products || [];
            setProducts(prods);

            const cats = [...new Set(prods.map(p => p.category))];
            setCategories(cats);
            if (cats.length > 0 && !selectedCategory) {
                setSelectedCategory(cats[0]);
            }
        } catch {
            // silent
        } finally {
            setLoading(false);
        }
    }, [selectedCategory]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Get products for selected category
    const categoryProducts = products.filter(p => p.category === selectedCategory);

    // Group by name (e.g., "FC Coins" might have multiple variants for different platforms)
    const productNames = [...new Set(categoryProducts.map(p => p.name))];

    // When a product is selected, set default specs and quantity
    useEffect(() => {
        if (selectedProduct) {
            const specs = selectedProduct.specs || {};
            const defaults = {};
            Object.entries(specs).forEach(([key, spec]) => {
                if (spec && spec.value) {
                    defaults[key] = spec.value;
                }
            });
            setSelectedSpecs(defaults);
            setQuantity(Number(selectedProduct.min_stock) || 0);
        }
    }, [selectedProduct]);

    // Find the matching product based on selected specs
    const getMatchingProduct = useCallback(() => {
        if (!selectedProduct) return null;

        // Find product that matches the selected specs
        const matching = categoryProducts.find(p => {
            if (p.name !== selectedProduct.name) return false;
            const specs = p.specs || {};
            return Object.entries(selectedSpecs).every(([key, val]) => {
                const spec = specs[key];
                return spec && spec.value === val;
            });
        });

        return matching || selectedProduct;
    }, [selectedProduct, selectedSpecs, categoryProducts]);

    const activeProduct = getMatchingProduct();
    const unitPrice = activeProduct ? Number(activeProduct.unit_price) : 0;
    const unit = activeProduct ? activeProduct.unit : 'k';
    const minStock = activeProduct ? Number(activeProduct.min_stock) : 0;
    const inStock = activeProduct ? Number(activeProduct.in_stock) : 0;
    const totalPrice = Math.round(unitPrice * quantity * 100) / 100;

    // Get all unique spec options for the selected product name
    const getSpecOptions = useCallback((specKey) => {
        if (!selectedProduct) return [];
        const sameName = categoryProducts.filter(p => p.name === selectedProduct.name);
        const options = new Set();
        sameName.forEach(p => {
            const specs = p.specs || {};
            if (specs[specKey] && specs[specKey].value) {
                options.add(specs[specKey].value);
            }
        });
        return [...options];
    }, [selectedProduct, categoryProducts]);

    const handleSpecChange = (key, value) => {
        const newSpecs = { ...selectedSpecs, [key]: value };
        setSelectedSpecs(newSpecs);

        // Find the matching product with new specs
        const matching = categoryProducts.find(p => {
            if (p.name !== selectedProduct.name) return false;
            const specs = p.specs || {};
            return Object.entries(newSpecs).every(([k, v]) => {
                const spec = specs[k];
                return spec && spec.value === v;
            });
        });

        if (matching) {
            setSelectedProduct(matching);
            setQuantity(Math.max(Number(matching.min_stock) || 0, quantity));
        }
    };

    const handleOrder = async () => {
        if (!user) {
            router.push('/login?next=/currency');
            return;
        }
        if (!activeProduct) return;
        if (quantity < minStock) {
            toast.error(`Minimum quantity is ${minStock}${unit}`);
            return;
        }
        if (quantity > inStock) {
            toast.error(`Only ${inStock}${unit} in stock`);
            return;
        }
        if (!termsAgreed) {
            toast.error('Please agree to the terms');
            return;
        }

        setOrdering(true);
        try {
            const data = await apiFetch('/orders/currency', {
                method: 'POST',
                body: {
                    currency_product_id: activeProduct.id,
                    quantity,
                    specs: selectedSpecs,
                    terms_and_agreed_checked: true,
                },
            });
            toast.success(`Order #${data.order.id} placed successfully!`);
            refreshMe();
            router.push(`/orders/${data.order.id}`);
        } catch (err) {
            toast.error(err.message || 'Failed to place order');
        } finally {
            setOrdering(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-10">

                {/* Header */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 mb-2">
                        <Coins className="w-4 h-4" /> In-Game Currency
                    </div>
                    <h1 className="text-6xl font-black italic uppercase tracking-tighter leading-none">
                        Game <span className="text-orange-500">Currency</span>
                    </h1>
                    <p className="text-gray-500 font-medium">Buy in-game currency at the best prices. Fast delivery guaranteed.</p>
                </div>

                {/* Category Tabs */}
                {categories.length > 1 && (
                    <div className="flex gap-2 flex-wrap">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => { setSelectedCategory(cat); setSelectedProduct(null); }}
                                className={`px-5 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all border ${
                                    selectedCategory === cat
                                        ? 'bg-orange-600 border-orange-500 text-white'
                                        : 'bg-white/[0.02] border-white/5 text-gray-400 hover:text-white hover:bg-white/[0.05]'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                )}

                {/* Product Cards Grid */}
                {!selectedProduct ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {productNames.map(name => {
                            const variants = categoryProducts.filter(p => p.name === name);
                            const first = variants[0];
                            const minPrice = Math.min(...variants.map(v => Number(v.unit_price)));
                            const isHovered = hoveredCard === name;
                            const isDimmed = hoveredCard !== null && hoveredCard !== name;

                            return (
                                <div
                                    key={name}
                                    onMouseEnter={() => setHoveredCard(name)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                    onClick={() => setSelectedProduct(first)}
                                    className={`group relative h-[350px] rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ${
                                        isDimmed ? "opacity-40 scale-95" : "opacity-100 scale-100"
                                    }`}
                                >
                                    <div
                                        className={`absolute inset-0 bg-gradient-to-br transition-all duration-500 ${
                                            isHovered ? "from-orange-500/40 via-orange-400/30 to-orange-600/40" : "from-orange-900/20 to-orange-800/20"
                                        }`}
                                    />
                                    <div className="absolute inset-0 border border-white/10 rounded-2xl transition-all duration-500" />
                                    <div className="relative h-full p-6 flex flex-col justify-between">
                                        {/* Top Section - Product Name */}
                                        <div className="text-xs font-bold text-white/80 uppercase tracking-wider">
                                            {name}
                                        </div>
                                        
                                        {/* Center Section - Large Watermark */}
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <h3 className="text-6xl font-black text-white/5 uppercase tracking-tight text-center leading-none">
                                                {name?.split(" ")[0]}
                                            </h3>
                                        </div>
                                        
                                        {/* Product Icon */}
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                            {first.thumbnail_image ? (
                                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 p-0.5 shadow-2xl">
                                                    <div className="w-full h-full bg-black/80 rounded-xl flex items-center justify-center">
                                                        <img src={first.thumbnail_image} alt={name} className="w-10 h-10 object-contain" />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 p-0.5 shadow-2xl">
                                                    <div className="w-full h-full bg-black/80 rounded-xl flex items-center justify-center">
                                                        <Coins className="w-10 h-10 text-white" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Bottom Section - Price and Button */}
                                        <div className="flex justify-between items-end">
                                            {/* Price Info */}
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600">From</p>
                                                <p className="text-lg font-black italic text-orange-500">${minPrice.toFixed(4)}</p>
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{variants.length} variants</p>
                                            </div>
                                            
                                            {/* Explore Button */}
                                            <div className="relative overflow-hidden bg-gray-800/80 group-hover:bg-gray-800 rounded-full px-4 py-2.5 flex items-center gap-2 transition-all duration-500 group-hover:pr-5">
                                                <span className="text-white text-sm font-semibold whitespace-nowrap opacity-0 max-w-0 group-hover:opacity-100 group-hover:max-w-[80px] transition-all duration-500 overflow-hidden">
                                                    Explore
                                                </span>
                                                <div className="relative w-5 h-5 flex items-center justify-center">
                                                    <ArrowRight className="w-5 h-5 text-white transition-transform duration-500 group-hover:translate-x-1" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {productNames.length === 0 && (
                            <div className="col-span-full py-20 text-center">
                                <Package className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                                <p className="text-gray-600 font-bold">No currency products available in this category.</p>
                            </div>
                        )}
                    </div>
                ) : (
                    /* Product Detail View */
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        {/* Back button */}
                        <button
                            onClick={() => setSelectedProduct(null)}
                            className="text-sm font-bold text-gray-500 hover:text-white transition-colors"
                        >
                            &larr; Back to list
                        </button>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Left: Product Info */}
                            <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 space-y-6">
                                {/* Title + Spec Selectors */}
                                <div className="flex items-center gap-4">
                                    {activeProduct?.thumbnail_image ? (
                                        <img src={activeProduct.thumbnail_image} alt={activeProduct.name} className="w-14 h-14 rounded-xl object-cover" />
                                    ) : (
                                        <div className="w-14 h-14 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                                            <Coins className="w-7 h-7 text-orange-500" />
                                        </div>
                                    )}
                                    <div>
                                        <h2 className="text-2xl font-black italic uppercase tracking-tight">{selectedProduct.name}</h2>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{selectedProduct.category}</p>
                                    </div>
                                </div>

                                {/* Spec Selectors (e.g., Platform) */}
                                {activeProduct?.specs && Object.keys(activeProduct.specs).length > 0 && (
                                    <div className="space-y-4">
                                        {Object.entries(activeProduct.specs).map(([key, spec]) => {
                                            const options = getSpecOptions(key);
                                            if (!spec || spec.type !== 'select' || options.length <= 1) return null;

                                            return (
                                                <div key={key}>
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">
                                                        {spec.label || key}
                                                    </label>
                                                    <div className="relative">
                                                        <select
                                                            value={selectedSpecs[key] || ''}
                                                            onChange={(e) => handleSpecChange(key, e.target.value)}
                                                            className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-3 px-4 text-white text-sm font-bold appearance-none cursor-pointer focus:border-orange-500/50 outline-none"
                                                        >
                                                            {options.map(opt => (
                                                                <option key={opt} value={opt} className="bg-black">{opt}</option>
                                                            ))}
                                                        </select>
                                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Info rows */}
                                <div className="space-y-3 pt-2">
                                    {activeProduct?.specs && Object.entries(activeProduct.specs).map(([key, spec]) => {
                                        if (!spec || spec.type === 'select') return null;
                                        return (
                                            <div key={key} className="flex justify-between items-center py-3 border-b border-white/5">
                                                <span className="text-gray-500 text-sm font-bold">{spec.label || key}</span>
                                                <span className="text-white text-sm font-black">{spec.value || '-'}</span>
                                            </div>
                                        );
                                    })}

                                    <div className="flex justify-between items-center py-3 border-b border-white/5">
                                        <span className="text-gray-500 text-sm font-bold">Delivery time</span>
                                        <span className="text-white text-sm font-black">{parseDeliveryTime(activeProduct?.delivery_time)}</span>
                                    </div>
                                </div>

                                {/* Description */}
                                {activeProduct?.description && (
                                    <div className="pt-2">
                                        <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-wrap">{activeProduct.description}</p>
                                    </div>
                                )}
                            </div>

                            {/* Right: Price & Order */}
                            <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 space-y-6 h-fit sticky top-8">
                                {/* Price */}
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 text-sm font-bold">Price</span>
                                    <span className="text-2xl font-black italic text-white">${unitPrice.toFixed(4)} <span className="text-sm text-gray-500 font-bold">/ {unit.toUpperCase()}</span></span>
                                </div>

                                {/* Quantity Selector */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setQuantity(Math.max(minStock, quantity - (minStock || 1)))}
                                            disabled={quantity <= minStock}
                                            className="w-12 h-12 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-center text-white hover:bg-white/[0.05] disabled:opacity-30 transition-all"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <div className="flex-1">
                                            <input
                                                type="number"
                                                value={quantity}
                                                onChange={(e) => {
                                                    const v = Number(e.target.value);
                                                    if (Number.isFinite(v) && v >= 0) setQuantity(v);
                                                }}
                                                className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-3 text-center text-xl font-black italic text-white outline-none focus:border-orange-500/50"
                                            />
                                        </div>
                                        <span className="text-sm font-black text-gray-400 uppercase">{unit}</span>
                                        <button
                                            onClick={() => setQuantity(Math.min(inStock, quantity + (minStock || 1)))}
                                            disabled={quantity >= inStock}
                                            className="w-12 h-12 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-center text-white hover:bg-white/[0.05] disabled:opacity-30 transition-all"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-600 px-1">
                                        <span>Min qty: {minStock.toLocaleString()} {unit.toUpperCase()}</span>
                                        <span>In stock: {inStock.toLocaleString()} {unit.toUpperCase()}</span>
                                    </div>
                                </div>

                                {/* Terms */}
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={termsAgreed}
                                        onChange={(e) => setTermsAgreed(e.target.checked)}
                                        className="mt-1 w-4 h-4 rounded accent-orange-500"
                                    />
                                    <span className="text-[11px] text-gray-500 leading-relaxed">
                                        I agree to the terms and conditions. All sales are subject to delivery time and availability.
                                    </span>
                                </label>

                                {/* Buy Button */}
                                <button
                                    onClick={handleOrder}
                                    disabled={ordering || !termsAgreed || quantity < minStock || quantity > inStock || quantity <= 0}
                                    className="w-full py-5 bg-orange-600 hover:bg-orange-500 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-2xl font-black italic uppercase tracking-widest text-base transition-all shadow-2xl flex items-center justify-center gap-3"
                                >
                                    {ordering ? (
                                        <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                                    ) : (
                                        <>${totalPrice.toFixed(2)} | Buy Now</>
                                    )}
                                </button>

                                {/* Trust badges */}
                                <div className="space-y-2 pt-2">
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500">
                                        <ShieldCheck className="w-3.5 h-3.5 text-green-500/60" />
                                        <span>Money-back Guarantee</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500">
                                        <Zap className="w-3.5 h-3.5 text-orange-500/60" />
                                        <span>Fast Delivery</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500">
                                        <Clock className="w-3.5 h-3.5 text-blue-500/60" />
                                        <span>24/7 Live Support</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
