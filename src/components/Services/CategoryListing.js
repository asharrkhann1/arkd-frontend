'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Filter,
    ChevronDown,
    ShoppingCart,
    ArrowUpRight,
    MoreHorizontal,
    Star,
    Zap,
    LayoutGrid,
    List,
    SlidersHorizontal,
    ShieldCheck,
    X,
    ChevronLeft,
    ChevronRight,
    Trophy,
    Clock,
    Ghost,
    Maximize2,
    ExternalLink,
    Info
} from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useWishlist } from '@/contexts/WishlistContext';

export default function CategoryListing({
    initialItems = [],
    type,
    category,
    serviceTitle,
    quickKeywords = [],
    currentPage = 1,
    totalPages = 1,
    totalItems = 0
}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { formatPrice, selectedCurrency } = useCurrency();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const [searchQuery, setSearchQuery] = useState('');
    const [priceRange, setPriceRange] = useState([0, 2000]);
    const [sortBy, setSortBy] = useState('featured');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Dynamic Filter State
    const [activeFilters, setActiveFilters] = useState({});
    const [openDropdowns, setOpenDropdowns] = useState({}); // Track which dropdowns are open

    const toggleDropdown = (key) => {
        setOpenDropdowns(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    // 1. Extract dynamic filters with Type Handling
    const dynamicFilters = useMemo(() => {
        const filters = {};
        initialItems.forEach(item => {
            if (item.specs) {
                Object.entries(item.specs).forEach(([key, specObj]) => {
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
        })).reverse().sort((a, b) => {
            // Priority: select types first, then range types
            if (a.type === 'select' && b.type === 'range') return -1;
            if (a.type === 'range' && b.type === 'select') return 1;
            return 0; // Maintain reversed order within the same type
        });
    }, [initialItems]);

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

    const handleKeywordClick = (keyword) => {
        setSearchQuery(prev => prev === keyword ? '' : keyword);
    };

    // Filter Logic
    const filteredItems = useMemo(() => {
        return initialItems.filter(item => {
            const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesPrice = Number(item.price) >= priceRange[0] && Number(item.price) <= priceRange[1];

            const matchesDynamic = Object.entries(activeFilters).every(([key, filterVal]) => {
                const specItem = item.specs?.[key];
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

            return matchesSearch && matchesPrice && matchesDynamic;
        }).sort((a, b) => {
            if (sortBy === 'price-low') return a.price - b.price;
            if (sortBy === 'price-high') return b.price - a.price;
            if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
            return 0;
        });
    }, [initialItems, searchQuery, priceRange, activeFilters, sortBy]);

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Mobile Filter Toggle */}
            <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="lg:hidden flex items-center justify-center gap-2 w-full p-4 bg-gray-900 border border-white/5 rounded-2xl text-white font-bold"
            >
                <Filter className="w-4 h-4" /> {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
            </button>

            {/* Sidebar Filters */}
            <aside className={`
                ${isFilterOpen ? 'block' : 'hidden'} lg:block
                w-full lg:w-72 space-y-8
            `}>
                {/* Search */}
                <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 underline underline-offset-8 decoration-orange-500/50">Market Search</h3>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Keywords..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white text-sm focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 outline-none transition-all shadow-inner"
                        />
                    </div>

                    {quickKeywords.length > 0 && (
                        <div className="space-y-3">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">Quick Tags</p>
                            <div className="flex flex-wrap gap-2">
                                {quickKeywords.map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => handleKeywordClick(tag)}
                                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all duration-300 border ${searchQuery === tag
                                            ? 'bg-orange-500 border-orange-400 text-white shadow-[0_0_15px_rgba(249,115,22,0.3)] scale-105'
                                            : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                            }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Price Range */}
                <div className="space-y-4 px-1">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xs font-black uppercase tracking-widest text-gray-500">Max Budget</h3>
                        <span className="text-xs font-bold text-orange-500">{formatPrice(priceRange[1])}</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="2000"
                        step="10"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                        className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                    />
                </div>

                {/* Dynamic Filters with Type Handling */}
                <div className="space-y-4">
                    {dynamicFilters.map(filter => (
                        <div key={filter.key} className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden">
                            {filter.type === 'range' ? (
                                <div className="p-4 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500">{filter.label}</h3>
                                        <span className="text-[10px] font-black text-orange-500">{activeFilters[filter.key]?.[1] || filter.max}</span>
                                    </div>
                                    <div className="px-1">
                                        <input
                                            type="range"
                                            min={filter.min}
                                            max={filter.max}
                                            value={activeFilters[filter.key]?.[1] || filter.max}
                                            onChange={(e) => handleFilterChange(filter.key, [filter.min, parseInt(e.target.value)], 'range')}
                                            className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-orange-400"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <button
                                        onClick={() => toggleDropdown(filter.key)}
                                        className="w-full flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-gray-300 transition-colors">
                                                {filter.label}
                                            </h3>
                                            {activeFilters[filter.key]?.length > 0 && (
                                                <span className="bg-orange-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                                                    {activeFilters[filter.key].length}
                                                </span>
                                            )}
                                        </div>
                                        <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${openDropdowns[filter.key] ? 'rotate-180 text-orange-500' : ''}`} />
                                    </button>

                                    <AnimatePresence>
                                        {openDropdowns[filter.key] && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                                className="overflow-hidden border-t border-white/5"
                                            >
                                                <div className="p-4 space-y-2 max-h-60 overflow-y-auto custom-scrollbar bg-black/20">
                                                    {filter.options.map(option => (
                                                        <label key={option} className="flex items-center gap-3 cursor-pointer group/item py-1">
                                                            <div className="relative flex items-center justify-center">
                                                                <input
                                                                    type="checkbox"
                                                                    className="peer sr-only"
                                                                    checked={activeFilters[filter.key]?.includes(option) || false}
                                                                    onChange={() => handleFilterChange(filter.key, option, 'select')}
                                                                />
                                                                <div className="w-5 h-5 border border-white/10 rounded-lg bg-[#111] peer-checked:bg-orange-500 peer-checked:border-orange-500 transition-all shadow-inner" />
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity">
                                                                    <polyline points="20 6 9 17 4 12" />
                                                                </svg>
                                                            </div>
                                                            <span className="text-sm text-gray-400 group-hover/item:text-orange-500 transition-colors capitalize font-medium">
                                                                {option}
                                                            </span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </>
                            )}
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => {
                        setSearchQuery('');
                        setPriceRange([0, 2000]);
                        setActiveFilters({});
                        setOpenDropdowns({});
                    }}
                    className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-all border border-dashed border-white/10 rounded-2xl hover:bg-orange-500/5 hover:border-orange-500/30"
                >
                    Reset Market Filters
                </button>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-center bg-[#0a0a0a] border border-white/5 p-4 rounded-3xl gap-4 shadow-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-500/10 rounded-2xl flex items-center justify-center border border-orange-500/20">
                            <LayoutGrid className="w-5 h-5 text-orange-500" />
                        </div>
                        <p className="text-sm text-gray-400 font-medium tracking-tight">
                            Loaded <span className="text-white font-black">{totalItems || filteredItems.length}</span> verified results
                        </p>
                    </div>

                    <div className="flex items-center gap-4 bg-black/40 p-2 rounded-2xl border border-white/5">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-transparent text-xs font-black text-white outline-none px-4 cursor-pointer uppercase tracking-widest"
                        >
                            <option value="featured">Featured First</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="rating">Top Rated</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredItems.map((item) => (
                        <ProductCard
                            key={item.id}
                            item={item}
                            type={type}
                            category={category}
                            formatPrice={formatPrice}
                            selectedCurrency={selectedCurrency}
                            toggleWishlist={toggleWishlist}
                            isInWishlist={isInWishlist}
                        />
                    ))}
                </div>

                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 pt-12">
                        <button
                            disabled={currentPage <= 1}
                            onClick={() => {
                                const params = new URLSearchParams(searchParams);
                                params.set('page', currentPage - 1);
                                router.push(`${pathname}?${params.toString()}`);
                            }}
                            className="p-4 bg-[#0a0a0a] border border-white/5 rounded-2xl text-white disabled:opacity-30 disabled:cursor-not-allowed hover:border-orange-500/50 transition-all shadow-xl"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-2">
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        const params = new URLSearchParams(searchParams);
                                        params.set('page', i + 1);
                                        router.push(`${pathname}?${params.toString()}`);
                                    }}
                                    className={`w-12 h-12 rounded-2xl font-black text-sm transition-all border ${currentPage === i + 1
                                        ? 'bg-orange-600 border-orange-500 text-white shadow-[0_0_20px_rgba(234,88,12,0.4)]'
                                        : 'bg-[#0a0a0a] border-white/5 text-gray-500 hover:text-white hover:border-white/10'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>

                        <button
                            disabled={currentPage >= totalPages}
                            onClick={() => {
                                const params = new URLSearchParams(searchParams);
                                params.set('page', currentPage + 1);
                                router.push(`${pathname}?${params.toString()}`);
                            }}
                            className="p-4 bg-[#0a0a0a] border border-white/5 rounded-2xl text-white disabled:opacity-30 disabled:cursor-not-allowed hover:border-orange-500/50 transition-all shadow-xl"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {filteredItems.length === 0 && (
                    <div className="py-40 text-center bg-[#0a0a0a] border border-dashed border-white/10 rounded-[3rem] shadow-inner">
                        <div className="w-24 h-24 bg-white/[0.02] rounded-full flex items-center justify-center mx-auto mb-8 border border-white/5">
                            <Search className="w-10 h-10 text-gray-700" />
                        </div>
                        <h3 className="text-2xl font-black mb-3 uppercase italic tracking-tighter">Negative scan results</h3>
                        <p className="text-gray-500 max-w-sm mx-auto font-medium text-lg leading-relaxed px-4">
                            No products match your current filtering criteria. Try expanding your search horizons.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

function ProductCard({ item, type, category, formatPrice, selectedCurrency, toggleWishlist, isInWishlist }) {
    const [isInfoOpen, setIsInfoOpen] = useState(false);
    const [isWishlistMenuOpen, setIsWishlistMenuOpen] = useState(false);
    const productSlug = item.slug || item.id;
    const productHref = `/services/${type}/${category}/${productSlug}`;

    const images = useMemo(() => {
        const all = [];
        if (item.thumbnail_image) all.push(item.thumbnail_image);
        if (item.images && Array.isArray(item.images)) {
            item.images.forEach(img => {
                if (img !== item.thumbnail_image && !all.includes(img)) {
                    all.push(img);
                }
            });
        }
        if (all.length === 0) all.push("https://placehold.co/600x400");
        return all;
    }, [item.thumbnail_image, item.images]);

    const [currentImgIndex, setCurrentImgIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    const nextImg = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImgIndex(prev => (prev + 1) % images.length);
    };

    const prevImg = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImgIndex(prev => (prev - 1 + images.length) % images.length);
    };


    // https://sgncmmwt-3001.inc1.devtunnels.ms/

    return (
        <>
            <div className="group bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] hover:border-orange-500/50 transition-all hover:-translate-y-2 shadow-2xl relative">
                {/* Image & Overlay Container */}
                <div className="aspect-[4/3] relative">
                    {/* Image Layer (Clipped) */}
                    <Link href={productHref} className="block absolute inset-0 overflow-hidden rounded-t-[2.5rem]">
                        <img
                            src={images[currentImgIndex]}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />

                        {/* Navigation Arrows (Inside Clip) */}
                        {images.length > 1 && (
                            <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                <button
                                    onClick={prevImg}
                                    className="p-3 bg-black/80 backdrop-blur-xl rounded-full text-white hover:bg-orange-500 transition-all pointer-events-auto border border-white/5 shadow-2xl"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={nextImg}
                                    className="p-3 bg-black/80 backdrop-blur-xl rounded-full text-white hover:bg-orange-500 transition-all pointer-events-auto border border-white/5 shadow-2xl"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </Link>

                    {/* Badges Layer (NOT Clipped - to allow dropdowns) */}
                    <div className="absolute inset-0 pointer-events-none z-20">
                        {/* Top Left: Info & Delivery Type */}
                        <div className="absolute top-6 left-6 flex flex-col gap-2 pointer-events-auto">
                            <div
                                className="relative"
                                onMouseEnter={() => setIsInfoOpen(true)}
                                onMouseLeave={() => setIsInfoOpen(false)}
                            >
                                <button className="p-2 bg-black/80 backdrop-blur-xl rounded-xl text-white border border-white/10 hover:bg-orange-500 hover:border-orange-500 transition-all shadow-xl">
                                    <Info className="w-4 h-4" />
                                </button>

                                <AnimatePresence>
                                    {isInfoOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                            className="absolute top-full left-0 mt-2 w-64 bg-black/98 backdrop-blur-3xl border border-white/10 rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 overflow-hidden"
                                        >
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                                                    <p className="text-[10px] font-black uppercase text-orange-500 tracking-widest">Product Intel</p>
                                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                                                </div>

                                                <div className="grid grid-cols-1 gap-1.5 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                                                    <div className="flex justify-between items-center bg-white/[0.03] p-2 rounded-lg border border-white/5">
                                                        <span className="text-[9px] font-bold text-gray-500 uppercase">Category</span>
                                                        <span className="text-[9px] font-black text-white uppercase">{item.type || 'Service'}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center bg-white/[0.03] p-2 rounded-lg border border-white/5">
                                                        <span className="text-[9px] font-bold text-gray-500 uppercase">Delivery</span>
                                                        <span className="text-[9px] font-black text-white uppercase">{(item.delivery_type === 'auto' || item.delivery_type === 'instant') ? 'Instant' : (item.delivery_time || 'Instant')}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center bg-white/[0.03] p-2 rounded-lg border border-white/5">
                                                        <span className="text-[9px] font-bold text-gray-500 uppercase">Stock</span>
                                                        <span className="text-[9px] font-black text-white uppercase">
                                                            {item.stock_mode === 'unlimited'
                                                                ? 'In Stock'
                                                                : item.stock_mode === 'limited'
                                                                    ? ((item.quantity_available != null && item.quantity_available > 0) ? `${item.quantity_available} Units` : 'Out of Stock')
                                                                    : 'In Stock'
                                                            }
                                                        </span>
                                                    </div>
                                                    {Object.entries(item.specs || {}).map(([key, spec]) => (
                                                        <div key={key} className="flex justify-between items-center bg-white/[0.03] p-2 rounded-lg border border-white/5">
                                                            <span className="text-[9px] font-bold text-gray-500 uppercase">{spec.label || key}</span>
                                                            <span className="text-[9px] font-black text-white uppercase">{spec.value}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="pt-2 border-t border-white/5">
                                                    <div className="flex items-center gap-2">
                                                        <ShieldCheck className="w-3 h-3 text-green-500" />
                                                        <span className="text-[8px] font-black text-gray-500 uppercase tracking-tighter">Verified & Protected Trade</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Top Right: Quantity Available */}
                        <div className="absolute top-6 right-6 pointer-events-auto">
                            {(() => {
                                console.log('Stock Debug:', {
                                    title: item.title,
                                    stock_mode: item.stock_mode,
                                    quantity_available: item.quantity_available,
                                    type_of_quantity: typeof item.quantity_available,
                                    is_null: item.quantity_available === null,
                                    is_undefined: item.quantity_available === undefined,
                                    check_result: (item.stock_mode !== 'limited' || (item.quantity_available != null && item.quantity_available > 0))
                                });
                                return null;
                            })()}
                            <div className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase backdrop-blur-xl border shadow-lg ${(item.stock_mode !== 'limited' || (item.quantity_available != null && item.quantity_available > 0))
                                ? 'bg-green-500/20 border-green-500/50 text-green-400'
                                : 'bg-red-500/20 border-red-500/50 text-red-500'
                                }`}>
                                {item.stock_mode === 'unlimited'
                                    ? 'In Stock'
                                    : item.stock_mode === 'limited'
                                        ? ((item.quantity_available != null && item.quantity_available > 0) ? `${item.quantity_available} In Stock` : 'Out of Stock')
                                        : 'In Stock'
                                }
                            </div>
                        </div>

                        {/* Bottom Left: Delivery Time */}
                        <div className="absolute bottom-6 left-6 flex items-center gap-2 px-3 py-1.5 bg-black/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl pointer-events-auto">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                className="flex items-center justify-center"
                            >
                                <Clock className="w-3.5 h-3.5 text-orange-500" />
                            </motion.div>
                            <span className="text-[10px] font-black uppercase text-white tracking-[0.1em]">
                                {(item.delivery_type === 'auto' || item.delivery_type === 'instant') ? 'Instant' : (item.delivery_time || 'Instant')}
                            </span>
                        </div>

                        {/* Bottom Right: Maximize */}
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsLightboxOpen(true);
                            }}
                            className="absolute bottom-6 right-6 p-3 bg-black/80 backdrop-blur-xl rounded-2xl text-white hover:bg-orange-500 hover:scale-110 transition-all shadow-xl border border-white/10 pointer-events-auto"
                        >
                            <Maximize2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="p-8">
                    <div className="flex items-center justify-between gap-3 mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-orange-500/80">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                        <div className="flex items-center gap-2 min-w-0">
                            <span className="truncate">{item.type || 'Service'}</span>
                            <span className="text-gray-800 mx-1">•</span>
                            <span className="truncate">{item.product_category || category || 'Global'}</span>
                        </div>

                        <div className="relative flex items-center gap-2">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setIsWishlistMenuOpen((v) => !v);
                                }}
                                className="p-2 rounded-xl bg-black/40 border border-white/10 text-gray-300 hover:text-white hover:border-orange-500/40 transition-all"
                                aria-label="Wishlist menu"
                            >
                                <MoreHorizontal className="w-4 h-4" />
                            </button>

                            <AnimatePresence>
                                {isWishlistMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                                        className="absolute right-0 top-full mt-2 w-44 bg-black/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                    >
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                toggleWishlist(item);
                                                setIsWishlistMenuOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/5 transition-colors"
                                        >
                                            {isInWishlist(item.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <Link href={productHref}>
                        <h3 className="text-xl font-black mb-6 line-clamp-2 group-hover:text-orange-500 transition-colors uppercase italic leading-[1.1] tracking-tighter min-h-[3rem]">
                            {item.title}
                        </h3>
                    </Link>

                    <div className="mb-8">
                        <p className="text-[11px] text-gray-400 font-medium line-clamp-1 italic uppercase tracking-wider">
                            {item.description || `Premium quality ${item.title} with verified security standards`}...
                        </p>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                        <div className="space-y-0.5">
                            <div className="flex flex-col">
                                <p className="text-2xl font-black italic text-white tracking-tighter leading-none">
                                    {formatPrice(item.price)}
                                </p>
                                {selectedCurrency !== 'USD' && (
                                    <p className="text-[9px] font-bold text-gray-600 mt-1 uppercase tracking-wider">
                                        USD Equivalent: <span className="text-gray-500">${Number(item.price).toFixed(2)}</span>
                                    </p>
                                )}
                            </div>
                        </div>

                        <Link
                            href={productHref}
                            className="p-4 rounded-2xl transition-all shadow-[0_10px_25px_rgba(234,88,12,0.3)] hover:shadow-[0_15px_35px_rgba(234,88,12,0.4)] group-hover:scale-105 active:scale-95 border bg-[#0a0a0a] border-white/10 text-gray-400 hover:text-orange-500 hover:border-orange-500/50"
                            aria-label="Visit product"
                        >
                            <ArrowUpRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div >

            <AnimatePresence>
                {isLightboxOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/98 backdrop-blur-2xl p-4 md:p-12"
                        onClick={() => setIsLightboxOpen(false)}
                    >
                        <button
                            onClick={() => setIsLightboxOpen(false)}
                            className="absolute top-10 right-10 p-4 bg-white/5 hover:bg-red-600 text-white rounded-[1.5rem] transition-all z-50 border border-white/10 shadow-2xl"
                        >
                            <X className="w-8 h-8" />
                        </button>

                        <div
                            className="relative max-w-6xl w-full h-full flex flex-col items-center justify-center gap-10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <motion.div
                                key={currentImgIndex}
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                className="relative flex-1 w-full rounded-[3rem] overflow-hidden border border-white/10 bg-black/60 shadow-[0_0_100px_rgba(0,0,0,0.5)]"
                            >
                                <img
                                    src={images[currentImgIndex]}
                                    alt="Gallery Preview"
                                    className="w-full h-full object-contain"
                                />

                                {images.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevImg}
                                            className="absolute left-8 top-1/2 -translate-y-1/2 p-6 bg-black/80 backdrop-blur-2xl rounded-full text-white hover:bg-orange-600 transition-all border border-white/10 shadow-2xl"
                                        >
                                            <ChevronLeft className="w-8 h-8" />
                                        </button>
                                        <button
                                            onClick={nextImg}
                                            className="absolute right-8 top-1/2 -translate-y-1/2 p-6 bg-black/80 backdrop-blur-2xl rounded-full text-white hover:bg-orange-600 transition-all border border-white/10 shadow-2xl"
                                        >
                                            <ChevronRight className="w-8 h-8" />
                                        </button>
                                    </>
                                )}
                            </motion.div>

                            <div className="flex gap-4 p-5 bg-white/[0.02] rounded-[2rem] border border-white/10 overflow-x-auto max-w-full no-scrollbar shadow-2xl backdrop-blur-md">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentImgIndex(idx)}
                                        className={`relative w-28 h-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${idx === currentImgIndex
                                            ? 'border-orange-500 scale-110 shadow-[0_0_30px_rgba(249,115,22,0.4)] z-10'
                                            : 'border-white/5 opacity-40 hover:opacity-100'
                                            }`}
                                    >
                                        <img src={img} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )
                }
            </AnimatePresence >
        </>
    );
}
