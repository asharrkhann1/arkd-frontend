'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api';
import { getBackgroundForOrigin } from '@/constants/backgroundMappings';
import { getProductCategoryLogo } from '@/constants/productCategoryLogos';
import {
    Coins, Loader2, Minus, Plus, ShieldCheck, Zap, Clock,
    ChevronDown, ArrowLeft, Package, Star, Users
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

function safeJsonParse(v) {
    if (!v) return null;
    if (typeof v === 'object') return v;
    try { return JSON.parse(String(v)); } catch { return null; }
}

function parseDeliveryTime(dt) {
    if (!dt) return 'Instant';
    return String(dt)
        .replace(/(\d+)d/g, '$1 days ')
        .replace(/(\d+)h/g, '$1h ')
        .replace(/(\d+)m/g, '$1m ')
        .trim() || 'Instant';
}

export default function CurrencyProductPage({ params }) {
    const { category, id } = React.use(params);
    const { user } = useAuth();
    const router = useRouter();

    const [allVariants, setAllVariants] = useState([]);
    const [activeProduct, setActiveProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    const [selectedSpecs, setSelectedSpecs] = useState({});
    const [quantity, setQuantity] = useState(0);
    const [termsAgreed, setTermsAgreed] = useState(false);
    const [ordering, setOrdering] = useState(false);

    // Fetch product + all variants in same category/name
    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            // Fetch the specific product first
            const productData = await apiFetch(`/currency/${id}`);
            const product = productData.product;
            if (!product) { setLoading(false); return; }

            // Fetch all in category to get variants by same name
            const catData = await apiFetch(`/currency?category=${encodeURIComponent(category)}`);
            const variants = (catData.products || []).filter(p => p.name === product.name);
            const parsed = variants.map(p => ({ ...p, specs: safeJsonParse(p.specs), unit_price: Number(p.unit_price) }));

            setAllVariants(parsed.length > 0 ? parsed : [{ ...product, specs: safeJsonParse(product.specs), unit_price: Number(product.unit_price) }]);

            // Set active product (the one from URL)
            const active = parsed.find(p => String(p.id) === String(id)) || parsed[0];
            setActiveProduct(active);

            // Set default specs
            const specs = safeJsonParse(active?.specs) || {};
            const defaults = {};
            Object.entries(specs).forEach(([key, spec]) => {
                if (spec?.value) defaults[key] = spec.value;
            });
            setSelectedSpecs(defaults);
            setQuantity(Number(active?.min_stock) || 0);
        } catch {
            // ignore
        } finally {
            setLoading(false);
        }
    }, [id, category]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const getSpecOptions = (specKey) => {
        const options = new Set();
        allVariants.forEach(p => {
            const specs = safeJsonParse(p.specs) || {};
            if (specs[specKey]?.value) options.add(specs[specKey].value);
        });
        return [...options];
    };

    const handleSpecChange = (key, value) => {
        const newSpecs = { ...selectedSpecs, [key]: value };
        setSelectedSpecs(newSpecs);
        const matching = allVariants.find(p => {
            const specs = safeJsonParse(p.specs) || {};
            return Object.entries(newSpecs).every(([k, v]) => specs[k]?.value === v);
        });
        if (matching) {
            setActiveProduct(matching);
            setQuantity(prev => Math.max(Number(matching.min_stock) || 0, prev));
            router.replace(`/services/currency/${encodeURIComponent(category)}/${matching.id}`, { scroll: false });
        }
    };

    const handleOrder = async () => {
        if (!user) {
            router.push(`/login?next=${encodeURIComponent(window.location.pathname)}`);
            return;
        }
        if (quantity < minStock) { toast.error(`Minimum is ${minStock}${unit}`); return; }
        if (quantity > inStock) { toast.error(`Only ${inStock}${unit} in stock`); return; }
        if (!termsAgreed) { toast.error('Please agree to the terms'); return; }

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
            toast.success(`Order #${data.order.id} placed!`);
            router.push(`/orders/${data.order.id}`);
        } catch (err) {
            toast.error(err.message || 'Failed to place order');
        } finally {
            setOrdering(false);
        }
    };

    const halfPageBg = getBackgroundForOrigin(category);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
            </div>
        );
    }

    if (!activeProduct) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4 text-white">
                <Package className="w-12 h-12 text-gray-600" />
                <p className="text-gray-400 font-bold">Product not found.</p>
                <Link href={`/services/currency/${encodeURIComponent(category)}`}
                    className="text-orange-500 hover:text-orange-400 flex items-center gap-2 text-sm font-bold">
                    <ArrowLeft className="w-4 h-4" /> Back to {category}
                </Link>
            </div>
        );
    }

    const unitPrice = Number(activeProduct.unit_price) || 0;
    const unit = activeProduct.unit || 'k';
    const minStock = Number(activeProduct.min_stock) || 0;
    const inStock = Number(activeProduct.in_stock) || 0;
    const totalPrice = Math.round(unitPrice * quantity * 100) / 100;
    const activeSpecs = safeJsonParse(activeProduct.specs) || {};
    const logo = activeProduct.thumbnail_image || getProductCategoryLogo(category);

    const selectSpecs = Object.entries(activeSpecs).filter(([, spec]) => spec?.type === 'select');
    const infoSpecs = Object.entries(activeSpecs).filter(([, spec]) => spec?.type !== 'select');

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden">
            {/* Background */}
            {halfPageBg && (
                <>
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-cover bg-center opacity-20"
                        style={{ backgroundImage: `url(${halfPageBg})` }} />
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-transparent via-black/60 to-black pointer-events-none" />
                </>
            )}

            <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">

                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-gray-500 mb-10 uppercase tracking-[0.15em]">
                        <Link href="/" className="hover:text-white transition-colors text-[10px]">Home</Link>
                        <span>/</span>
                        <Link href="/services/currency" className="hover:text-white transition-colors text-[10px]">Currency</Link>
                        <span>/</span>
                        <Link href={`/services/currency/${encodeURIComponent(category)}`} className="hover:text-white transition-colors text-[10px]">{category}</Link>
                        <span>/</span>
                        <span className="text-orange-500 text-[10px] truncate max-w-[200px]">{activeProduct.name}</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

                        {/* ── Left: Product Info ─────────────────────────────── */}
                        <div className="lg:col-span-3 space-y-6">
                            {/* Product header card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8"
                            >
                                <div className="flex items-start gap-6 mb-6">
                                    {logo ? (
                                        <img src={logo} alt={activeProduct.name}
                                            className="w-20 h-20 rounded-2xl object-contain bg-white/5 p-2 flex-shrink-0" />
                                    ) : (
                                        <div className="w-20 h-20 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center flex-shrink-0">
                                            <Coins className="w-10 h-10 text-orange-500" />
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1">{category} Currency</p>
                                        <h1 className="text-3xl font-black italic uppercase tracking-tight leading-none mb-2">
                                            {activeProduct.name}
                                        </h1>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${inStock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                                            <span className="text-sm font-bold text-gray-400">
                                                {inStock > 0 ? `${inStock.toLocaleString()}${unit} in stock` : 'Out of stock'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {activeProduct.description && (
                                    <p className="text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-5">
                                        {activeProduct.description}
                                    </p>
                                )}

                                {/* Info specs (non-select) */}
                                {infoSpecs.length > 0 && (
                                    <div className="grid grid-cols-2 gap-3 mt-5 border-t border-white/5 pt-5">
                                        {infoSpecs.map(([key, spec]) => spec && (
                                            <div key={key} className="bg-white/[0.02] rounded-xl px-4 py-3">
                                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600 mb-1">{spec.label || key}</p>
                                                <p className="text-sm font-bold text-white">{spec.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>

                            {/* Trust row */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="grid grid-cols-3 gap-4"
                            >
                                {[
                                    { icon: ShieldCheck, color: 'text-green-500', label: 'Guaranteed', sub: '100% safe' },
                                    { icon: Zap, color: 'text-orange-500', label: 'Fast Delivery', sub: parseDeliveryTime(activeProduct.delivery_time) },
                                    { icon: Clock, color: 'text-blue-500', label: '24/7 Support', sub: 'Always online' },
                                ].map(({ icon: Icon, color, label, sub }) => (
                                    <div key={label} className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-4 text-center">
                                        <Icon className={`w-6 h-6 ${color} mx-auto mb-2`} />
                                        <p className="text-xs font-black text-white">{label}</p>
                                        <p className="text-[10px] text-gray-600 mt-0.5">{sub}</p>
                                    </div>
                                ))}
                            </motion.div>
                        </div>

                        {/* ── Right: Purchase Panel ──────────────────────────── */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.05 }}
                            className="lg:col-span-2 sticky top-6 space-y-4"
                        >
                            <div className="bg-[#0d0d0d] border border-white/8 rounded-3xl overflow-hidden">
                                {/* Price header */}
                                <div className="px-6 py-5 border-b border-white/5 bg-gradient-to-r from-orange-500/5 to-transparent">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1">Price per {unit.toUpperCase()}</p>
                                    <p className="text-4xl font-black italic text-orange-500">
                                        ${unitPrice.toFixed(4)}
                                    </p>
                                </div>

                                <div className="px-6 py-5 space-y-5">
                                    {/* Spec selectors */}
                                    {selectSpecs.map(([key, spec]) => {
                                        const options = getSpecOptions(key);
                                        if (options.length <= 1) return null;
                                        return (
                                            <div key={key}>
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">
                                                    {spec?.label || key}
                                                </label>
                                                <div className="relative">
                                                    <select
                                                        value={selectedSpecs[key] || ''}
                                                        onChange={(e) => handleSpecChange(key, e.target.value)}
                                                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 px-4 text-white text-sm font-bold appearance-none cursor-pointer focus:border-orange-500/50 outline-none"
                                                    >
                                                        {options.map(opt => (
                                                            <option key={opt} value={opt} className="bg-[#111]">{opt}</option>
                                                        ))}
                                                    </select>
                                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {/* Quantity */}
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Quantity</label>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => setQuantity(q => Math.max(minStock, q - (minStock || 1)))}
                                                disabled={quantity <= minStock}
                                                className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center hover:bg-white/[0.06] disabled:opacity-30 transition-all text-xl font-black"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <input
                                                type="number"
                                                value={quantity}
                                                min={minStock}
                                                max={inStock}
                                                onChange={(e) => {
                                                    const v = Number(e.target.value);
                                                    if (Number.isFinite(v) && v >= 0) setQuantity(v);
                                                }}
                                                className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl py-3 text-center text-xl font-black italic text-white outline-none focus:border-orange-500/50"
                                            />
                                            <span className="text-sm font-black text-gray-500 uppercase">{unit}</span>
                                            <button
                                                onClick={() => setQuantity(q => Math.min(inStock, q + (minStock || 1)))}
                                                disabled={quantity >= inStock}
                                                className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center hover:bg-white/[0.06] disabled:opacity-30 transition-all text-xl font-black"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="flex justify-between mt-2 text-[10px] font-bold uppercase tracking-widest text-gray-700 px-1">
                                            <span>Min: {minStock.toLocaleString()}{unit}</span>
                                            <span>Max: {inStock.toLocaleString()}{unit}</span>
                                        </div>
                                    </div>

                                    {/* Total */}
                                    <div className="flex justify-between items-center py-4 border-y border-white/5">
                                        <span className="text-sm font-bold text-gray-500">Total</span>
                                        <span className="text-2xl font-black italic text-white">${totalPrice.toFixed(2)}</span>
                                    </div>

                                    {/* Terms */}
                                    <label className="flex items-start gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={termsAgreed}
                                            onChange={(e) => setTermsAgreed(e.target.checked)}
                                            className="mt-1 w-4 h-4 rounded accent-orange-500 flex-shrink-0"
                                        />
                                        <span className="text-[11px] text-gray-500 leading-relaxed">
                                            I agree to the terms and conditions. All sales are subject to delivery time and stock availability.
                                        </span>
                                    </label>

                                    {/* Buy Button */}
                                    <button
                                        onClick={handleOrder}
                                        disabled={ordering || !termsAgreed || quantity < minStock || quantity > inStock || inStock === 0 || quantity <= 0}
                                        className="w-full py-4 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-2xl font-black italic uppercase tracking-widest text-sm transition-all shadow-[0_4px_30px_rgba(234,88,12,0.3)] hover:shadow-[0_8px_40px_rgba(234,88,12,0.5)] flex items-center justify-center gap-3"
                                    >
                                        {ordering ? (
                                            <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                                        ) : !user ? (
                                            'Login to Buy'
                                        ) : (
                                            `Buy ${quantity.toLocaleString()}${unit} — $${totalPrice.toFixed(2)}`
                                        )}
                                    </button>

                                    {!user && (
                                        <p className="text-center text-[11px] text-gray-600">
                                            <Link href={`/login?next=${encodeURIComponent(`/services/currency/${category}/${id}`)}`}
                                                className="text-orange-500 hover:text-orange-400 font-bold">Sign in</Link> to purchase
                                        </p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
