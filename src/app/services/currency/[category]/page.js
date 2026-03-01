'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { getBackgroundForOrigin } from '@/constants/backgroundMappings';
import { getProductCategoryLogo } from '@/constants/productCategoryLogos';
import {
    Coins, Loader2, ShieldCheck, Clock, Package, ChevronRight, ArrowLeft
} from 'lucide-react';
import { motion } from 'framer-motion';

function safeJsonParse(v) {
    if (!v) return null;
    if (typeof v === 'object') return v;
    try { return JSON.parse(String(v)); } catch { return null; }
}

// ─── Product Card ─────────────────────────────────────────────────────────────

function CurrencyProductCard({ product, allVariants, category }) {
    const unitPrice = Number(product.unit_price);
    const inStock = Number(product.in_stock);
    const unit = product.unit || 'k';
    const logo = product.thumbnail_image || getProductCategoryLogo(category);

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            className="group"
        >
            <Link
                href={`/services/currency/${encodeURIComponent(category)}/${product.id}`}
                className="block text-left bg-[#0a0a0a] border border-white/5 rounded-2xl p-5 hover:border-orange-500/30 hover:shadow-[0_0_30px_rgba(249,115,22,0.1)] transition-all duration-300 w-full"
            >
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    {logo ? (
                        <img src={logo} alt={product.name} className="w-12 h-12 rounded-xl object-contain flex-shrink-0 bg-white/5 p-1" />
                    ) : (
                        <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center flex-shrink-0">
                            <Coins className="w-6 h-6 text-orange-500" />
                        </div>
                    )}
                    <div className="min-w-0">
                        <h3 className="font-black italic uppercase tracking-tight text-white group-hover:text-orange-400 transition-colors truncate">
                            {product.name}
                        </h3>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mt-0.5">
                            {allVariants.length > 1 ? `${allVariants.length} options available` : 'Single option'}
                        </p>
                    </div>
                </div>

                {/* Price row */}
                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-0.5">From</p>
                        <p className="text-xl font-black italic text-orange-500">
                            ${unitPrice.toFixed(4)}
                            <span className="text-sm text-gray-500 font-bold"> /{unit}</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-orange-500/10 border border-orange-500/20 group-hover:bg-orange-500/20 transition-colors">
                        <span className="text-xs font-black text-orange-400">View</span>
                        <ChevronRight className="w-3.5 h-3.5 text-orange-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                </div>

                {/* Stock indicator */}
                <div className="mt-3 flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${inStock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                        {inStock > 0 ? `${inStock.toLocaleString()}${unit} available` : 'Out of stock'}
                    </span>
                </div>
            </Link>
        </motion.div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CurrencyCategoryPage({ params }) {
    const { category } = React.use(params);

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            const data = await apiFetch(`/currency?category=${encodeURIComponent(category)}`);
            setProducts((data.products || []).map(p => ({
                ...p,
                specs: safeJsonParse(p.specs),
                unit_price: Number(p.unit_price),
            })));
        } catch {
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, [category]);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    // Group by name, show cheapest variant as the card
    const productGroups = products.reduce((acc, p) => {
        if (!acc[p.name]) acc[p.name] = [];
        acc[p.name].push(p);
        return acc;
    }, {});

    const halfPageBg = getBackgroundForOrigin(category);

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden">
            {halfPageBg && (
                <>
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-cover bg-center opacity-30"
                        style={{ backgroundImage: `url(${halfPageBg})` }} />
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-transparent via-black/50 to-black pointer-events-none" />
                </>
            )}

            <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">

                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-10 uppercase tracking-[0.15em]">
                        <Link href="/" className="hover:text-white transition-colors text-[10px]">Home</Link>
                        <span>/</span>
                        <Link href="/services" className="hover:text-white transition-colors text-[10px]">Services</Link>
                        <span>/</span>
                        <Link href="/services/currency" className="hover:text-white transition-colors text-[10px]">Currency</Link>
                        <span>/</span>
                        <span className="text-orange-500 text-[10px] uppercase">{category}</span>
                    </div>

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div>
                            <h1 className="text-6xl font-black italic tracking-tighter uppercase mb-3 leading-none">
                                {category} <span className="text-orange-500">Currency</span>
                            </h1>
                            <p className="text-gray-400 text-lg font-medium">
                                Buy <span className="text-white font-bold">{category}</span> in-game currency at the lowest prices.
                            </p>
                        </div>
                        <div className="px-5 py-3 bg-[#0a0a0a] border border-white/5 rounded-2xl flex items-center gap-3">
                            <ShieldCheck className="w-5 h-5 text-orange-500" />
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">Protection</p>
                                <p className="text-xs font-black italic">SECURE TRADE</p>
                            </div>
                        </div>
                    </div>

                    {/* Products grid */}
                    {loading ? (
                        <div className="flex items-center justify-center py-32">
                            <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
                        </div>
                    ) : Object.keys(productGroups).length === 0 ? (
                        <div className="text-center py-32 bg-[#0a0a0a] rounded-3xl border border-dashed border-white/10">
                            <Package className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                            <p className="text-gray-500 font-bold">No currency products available in {category} yet.</p>
                            <Link href="/services/currency" className="mt-4 inline-flex items-center gap-2 text-orange-500 hover:text-orange-400 text-sm font-bold">
                                <ArrowLeft className="w-4 h-4" /> Back to Currency
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {Object.entries(productGroups).map(([name, variants]) => {
                                const cheapest = variants.reduce((a, b) =>
                                    Number(a.unit_price) <= Number(b.unit_price) ? a : b
                                );
                                return (
                                    <CurrencyProductCard
                                        key={name}
                                        product={cheapest}
                                        allVariants={variants}
                                        category={category}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
