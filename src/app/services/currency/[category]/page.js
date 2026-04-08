'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { getBackgroundForOrigin } from '@/constants/backgroundMappings';
import { getProductCategoryLogo } from '@/constants/productCategoryLogos';
import {
    Coins, Loader2, ShieldCheck, Clock, Package, ChevronRight, ArrowLeft, Search, ChevronDown, X, Trophy
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilters, setActiveFilters] = useState({});
    const [openDropdowns, setOpenDropdowns] = useState({});
    const dropdownRefs = useRef({});

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

    // Extract dynamic filters from product specs
    const dynamicFilters = useMemo(() => {
        const filters = {};
        products.forEach(p => {
            if (p.specs) {
                Object.entries(p.specs).forEach(([key, specObj]) => {
                    if (specObj && specObj.value !== undefined) {
                        const type = specObj.type || 'select';
                        if (!filters[key]) {
                            filters[key] = {
                                label: specObj.label || key.charAt(0).toUpperCase() + key.slice(1),
                                type: type,
                                options: new Set(),
                                min: Infinity,
                                max: -Infinity
                            };
                        }
                        if (type === 'range') {
                            const val = Number(specObj.value);
                            if (val < filters[key].min) filters[key].min = val;
                            if (val > filters[key].max) filters[key].max = val;
                        } else {
                            filters[key].options.add(specObj.value);
                        }
                    }
                });
            }
        });
        return Object.entries(filters).map(([key, data]) => ({
            key,
            label: data.label,
            type: data.type,
            options: data.type === 'select' ? Array.from(data.options).sort() : [],
            min: data.type === 'range' ? data.min : 0,
            max: data.type === 'range' ? data.max : 0
        })).sort((a, b) => {
            if (a.type === 'select' && b.type === 'range') return -1;
            if (a.type === 'range' && b.type === 'select') return 1;
            return 0;
        });
    }, [products]);

    // Filter products
    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesSpecs = Object.entries(activeFilters).every(([key, filterVal]) => {
                const specItem = p.specs?.[key];
                if (!specItem) return true;
                if (specItem.type === 'range') {
                    const itemValue = Number(specItem.value);
                    const [min, max] = filterVal;
                    return itemValue >= min && itemValue <= max;
                } else {
                    if (!filterVal || filterVal.length === 0) return true;
                    return filterVal.includes(specItem.value);
                }
            });
            return matchesSearch && matchesSpecs;
        });
    }, [products, searchQuery, activeFilters]);

    const toggleDropdown = (key) => {
        setOpenDropdowns(prev => {
            const newState = {};
            Object.keys(prev).forEach(k => newState[k] = k === key ? !prev[k] : false);
            newState[key] = !prev[key];
            return newState;
        });
    };

    const handleFilterChange = (key, value, type) => {
        setActiveFilters(prev => {
            if (type === 'range') {
                return { ...prev, [key]: value };
            }
            const current = prev[key] || [];
            if (current.includes(value)) {
                const next = current.filter(v => v !== value);
                const newState = { ...prev };
                if (next.length === 0) delete newState[key];
                else newState[key] = next;
                return newState;
            }
            return { ...prev, [key]: [...current, value] };
        });
    };

    const clearFilters = () => {
        setSearchQuery('');
        setActiveFilters({});
        setOpenDropdowns({});
    };

    const activeFilterCount = Object.keys(activeFilters).length + (searchQuery ? 1 : 0);

    // Group by name, show cheapest variant as the card
    const filteredProductGroups = filteredProducts.reduce((acc, p) => {
        if (!acc[p.name]) acc[p.name] = [];
        acc[p.name].push(p);
        return acc;
    }, {});

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

                    {/* Filter Bar */}
                    <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-4 space-y-4 mb-8">
                        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                            <div className="flex items-center gap-3 flex-1 w-full lg:w-auto">
                                <div className="relative flex-1 max-w-md">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-black border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm focus:border-orange-500/50 outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-3 w-full lg:w-auto">
                                <p className="text-xs text-gray-500 whitespace-nowrap">
                                    <span className="text-white font-bold">{filteredProducts.length}</span> items
                                </p>
                                {activeFilterCount > 0 && (
                                    <button
                                        onClick={clearFilters}
                                        className="flex items-center gap-1.5 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-red-400 hover:text-red-300 transition-colors border border-red-500/20 rounded-xl hover:bg-red-500/10"
                                    >
                                        <X className="w-3 h-3" />
                                        Clear ({activeFilterCount})
                                    </button>
                                )}
                            </div>
                        </div>
                        {dynamicFilters.length > 0 && (
                            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mr-2">Filters:</span>
                                {dynamicFilters.filter(f => f.type === 'select').map(filter => (
                                    <div key={filter.key} className="relative" ref={el => dropdownRefs.current[filter.key] = el}>
                                        <button
                                            onClick={() => toggleDropdown(filter.key)}
                                            className={`flex items-center gap-2 px-3 py-2 bg-black border rounded-xl text-xs transition-all ${activeFilters[filter.key]?.length > 0 ? 'border-orange-500/50 text-orange-400' : 'border-white/10 text-gray-300 hover:border-orange-500/30'}`}
                                        >
                                            <span className="text-[10px] uppercase font-bold">{filter.label}</span>
                                            {activeFilters[filter.key]?.length > 0 && (
                                                <span className="bg-orange-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                                                    {activeFilters[filter.key].length}
                                                </span>
                                            )}
                                            <ChevronDown className={`w-3 h-3 transition-transform ${openDropdowns[filter.key] ? 'rotate-180' : ''}`} />
                                        </button>
                                        <AnimatePresence>
                                            {openDropdowns[filter.key] && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                                                    className="absolute top-full left-0 mt-2 w-56 bg-black border border-white/10 rounded-xl p-3 shadow-2xl z-50 max-h-64 overflow-y-auto"
                                                >
                                                    <div className="space-y-1">
                                                        {filter.options.map(option => (
                                                            <label key={option} className="flex items-center gap-2 cursor-pointer group p-1.5 rounded-lg hover:bg-white/5">
                                                                <input
                                                                    type="checkbox"
                                                                    className="peer sr-only"
                                                                    checked={activeFilters[filter.key]?.includes(option) || false}
                                                                    onChange={() => handleFilterChange(filter.key, option, 'select')}
                                                                />
                                                                <div className="w-4 h-4 border border-white/20 rounded peer-checked:bg-orange-500 peer-checked:border-orange-500 transition-all flex items-center justify-center">
                                                                    <svg className="w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                                                                        <polyline points="20 6 9 17 4 12" />
                                                                    </svg>
                                                                </div>
                                                                <span className="text-xs text-gray-400 group-hover:text-white capitalize">{option}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
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
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                {Object.entries(filteredProductGroups).map(([name, variants]) => {
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
                            {Object.keys(filteredProductGroups).length === 0 && (
                                <div className="py-20 text-center bg-[#0a0a0a] border border-dashed border-white/10 rounded-3xl">
                                    <div className="w-16 h-16 bg-white/[0.02] rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                                        <Search className="w-8 h-8 text-gray-600" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 uppercase tracking-tight">No products found</h3>
                                    <p className="text-gray-500 max-w-sm mx-auto text-sm">
                                        Try adjusting your filters or search query to find what you're looking for.
                                    </p>
                                    <button
                                        onClick={clearFilters}
                                        className="mt-4 px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-xl text-orange-400 text-sm font-bold hover:bg-orange-500/20 transition-all"
                                    >
                                        Clear all filters
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
