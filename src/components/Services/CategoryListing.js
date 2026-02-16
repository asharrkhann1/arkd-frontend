'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Star,
    Clock,
    Info,
    X,
    ArrowUpRight,
    ShieldCheck,
    Maximize2,
    Trophy,
    ShoppingCart,
} from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useWishlist } from '@/contexts/WishlistContext';

const ITEMS_PER_PAGE = 24;

export default function CategoryListing({
    initialItems = [],
    type,
    category,
    serviceTitle,
    quickKeywords = [],
    currentPage = 1,
    totalPages: initialTotalPages = 1,
    totalItems: initialTotalItems = 0
}) {
    const { formatPrice, selectedCurrency } = useCurrency();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const [searchQuery, setSearchQuery] = useState('');
    const [priceRange, setPriceRange] = useState([0, 2000]);
    const [sortBy, setSortBy] = useState('recent-added');
    const [localPage, setLocalPage] = useState(1);
    const [activeFilters, setActiveFilters] = useState({});
    const [openDropdowns, setOpenDropdowns] = useState({});
    const dropdownRefs = useRef({});

    const toggleDropdown = (key) => {
        setOpenDropdowns(prev => {
            // Close all other dropdowns, only open the clicked one
            const newState = {};
            Object.keys(prev).forEach(k => {
                newState[k] = k === key ? !prev[k] : false;
            });
            newState[key] = !prev[key];
            return newState;
        });
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            const isOutside = Object.keys(dropdownRefs.current).every(key => {
                const ref = dropdownRefs.current[key];
                return ref && !ref.contains(event.target);
            });

            if (isOutside) {
                setOpenDropdowns({});
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
        })).sort((a, b) => {
            if (a.type === 'select' && b.type === 'range') return -1;
            if (a.type === 'range' && b.type === 'select') return 1;
            return 0;
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
        setLocalPage(1);
    };

    const handleKeywordClick = (keyword) => {
        setSearchQuery(prev => prev === keyword ? '' : keyword);
        setLocalPage(1);
    };

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
        });
    }, [initialItems, searchQuery, priceRange, activeFilters]);

    const sortedItems = useMemo(() => {
        const items = [...filteredItems];
        if (sortBy === 'price-high') return items.sort((a, b) => Number(b.price) - Number(a.price));
        if (sortBy === 'price-low') return items.sort((a, b) => Number(a.price) - Number(b.price));
        if (sortBy === 'most-purchased') return items.sort((a, b) => (b.purchases_count || 0) - (a.purchases_count || 0));
        if (sortBy === 'recent-added') return items.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
        return items;
    }, [filteredItems, sortBy]);

    const totalFilteredItems = sortedItems.length;
    const calculatedTotalPages = Math.ceil(totalFilteredItems / ITEMS_PER_PAGE);
    const effectivePage = Math.min(localPage, calculatedTotalPages || 1);

    const paginatedItems = useMemo(() => {
        const start = (effectivePage - 1) * ITEMS_PER_PAGE;
        return sortedItems.slice(start, start + ITEMS_PER_PAGE);
    }, [sortedItems, effectivePage]);

    const handlePageChange = (newPage) => {
        setLocalPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const clearFilters = () => {
        setSearchQuery('');
        setPriceRange([0, 2000]);
        setActiveFilters({});
        setOpenDropdowns({});
        setLocalPage(1);
    };

    const activeFilterCount = Object.keys(activeFilters).length + (searchQuery ? 1 : 0);

    return (
        <div className="space-y-6">
            {/* Horizontal Filter Bar */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-4 space-y-4">
                {/* Top Row: Search, Sort, Results Count */}
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 w-full lg:w-auto">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => { setSearchQuery(e.target.value); setLocalPage(1); }}
                                className="w-full bg-black border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm focus:border-orange-500/50 outline-none transition-all"
                            />
                        </div>

                        {quickKeywords.length > 0 && (
                            <div className="hidden xl:flex items-center gap-2">
                                {quickKeywords.slice(0, 4).map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => handleKeywordClick(tag)}
                                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-tighter transition-all border ${searchQuery === tag
                                            ? 'bg-orange-500 border-orange-400 text-white'
                                            : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                            }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-3 w-full lg:w-auto">
                        <p className="text-xs text-gray-500 whitespace-nowrap">
                            <span className="text-white font-bold">{totalFilteredItems}</span> items
                        </p>

                        {/* Filter-Style Sort Dropdown */}
                        <div className="relative" ref={el => dropdownRefs.current['sort'] = el}>
                            <button
                                onClick={() => toggleDropdown('sort')}
                                className={`flex items-center gap-2 px-3 py-2 bg-black border rounded-xl text-xs transition-all ${sortBy !== 'recent-added' ? 'border-orange-500/50 text-orange-400' : 'border-white/10 text-gray-300 hover:border-orange-500/30'
                                    }`}
                            >
                                <span className="text-[10px] uppercase font-bold">Sort</span>
                                {/* <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400">
                                    {sortBy === 'recent-added' ? '🆕' : sortBy === 'most-purchased' ? '🔥' : sortBy === 'price-high' ? '💎' : '💰'}
                                </span> */}
                                <ChevronDown className={`w-3 h-3 transition-transform ${openDropdowns['sort'] ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {openDropdowns['sort'] && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute top-full mt-2 left-0 w-48 bg-gradient-to-b from-[#1a1a1f] to-[#141419] border border-white/[0.12] rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.4)] z-50 p-2"
                                    >
                                        {[
                                            { value: 'recent-added', label: 'Recent Added' },
                                            { value: 'most-purchased', label: 'Most Purchased' },
                                            { value: 'price-high', label: 'Price: High → Low' },
                                            { value: 'price-low', label: 'Price: Low → High' }
                                        ].map((option) => (
                                            <label
                                                key={option.value}
                                                className="relative flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-white/5 transition-colors"
                                            >
                                                <input
                                                    type="radio"
                                                    name="sort"
                                                    value={option.value}
                                                    checked={sortBy === option.value}
                                                    onChange={(e) => {
                                                        setSortBy(e.target.value);
                                                        setOpenDropdowns(prev => ({ ...prev, sort: false }));
                                                    }}
                                                    className="sr-only"
                                                />
                                                <div className={`w-4 h-4 border-2 rounded-full transition-all ${sortBy === option.value
                                                    ? 'border-orange-500 bg-orange-500'
                                                    : 'border-gray-600'
                                                    }`}>
                                                    {sortBy === option.value && (
                                                        <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                                                    )}
                                                </div>
                                                <span className={`text-xs font-medium ${sortBy === option.value ? 'text-orange-400' : 'text-gray-400'
                                                    }`}>
                                                    {option.label}
                                                </span>
                                            </label>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

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

                {/* Second Row: Dynamic Filters */}
                {dynamicFilters.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mr-2">Filters:</span>

                        {/* Price Range */}
                        <div className="relative" ref={el => dropdownRefs.current['price'] = el}>
                            <button
                                onClick={() => toggleDropdown('price')}
                                className={`flex items-center gap-2 px-3 py-2 bg-black border rounded-xl text-xs transition-all ${priceRange[0] > 0 || priceRange[1] < 2000 ? 'border-orange-500/50 text-orange-400' : 'border-white/10 text-gray-300 hover:border-orange-500/30'}`}
                            >
                                <span className="text-[10px] uppercase font-bold">Price</span>
                                <ChevronDown className={`w-3 h-3 transition-transform ${openDropdowns['price'] ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {openDropdowns['price'] && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute top-full mt-2 left-0 w-64 bg-gradient-to-b from-[#1a1a1f] to-[#141419] border border-white/[0.12] rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.4)] z-50 p-4"
                                    >
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-[10px] font-bold uppercase text-gray-500">Price Range</span>
                                            <span className="text-xs font-bold text-orange-500">{formatPrice(priceRange[1])}</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="2000"
                                            step="10"
                                            value={priceRange[1]}
                                            onChange={(e) => { setPriceRange([0, parseInt(e.target.value)]); setLocalPage(1); }}
                                            className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Dynamic Select Filters */}
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

            {/* Products Grid - 4 columns x 6 rows = 24 items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {paginatedItems.map((item) => (
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

            {/* Pagination */}
            {calculatedTotalPages > 1 && (
                <div className="flex flex-col items-center gap-3 pt-8">
                    <div className="flex justify-center items-center gap-2">
                        <button
                            disabled={effectivePage <= 1}
                            onClick={() => handlePageChange(effectivePage - 1)}
                            className="p-3 bg-[#0a0a0a] border border-white/10 rounded-xl text-white disabled:opacity-30 disabled:cursor-not-allowed hover:border-orange-500/50 transition-all"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-1.5">
                            {[...Array(Math.min(calculatedTotalPages, 10))].map((_, i) => {
                                const pageNum = i + 1;
                                return (
                                    <button
                                        key={i}
                                        onClick={() => handlePageChange(pageNum)}
                                        className={`w-10 h-10 rounded-xl font-bold text-sm transition-all border ${effectivePage === pageNum
                                            ? 'bg-orange-600 border-orange-500 text-white shadow-[0_0_15px_rgba(234,88,12,0.4)]'
                                            : 'bg-[#0a0a0a] border-white/10 text-gray-500 hover:text-white hover:border-white/20'
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                            {calculatedTotalPages > 10 && (
                                <>
                                    <span className="text-gray-600 px-1">...</span>
                                    <button
                                        onClick={() => handlePageChange(calculatedTotalPages)}
                                        className={`w-10 h-10 rounded-xl font-bold text-sm transition-all border ${effectivePage === calculatedTotalPages
                                            ? 'bg-orange-600 border-orange-500 text-white'
                                            : 'bg-[#0a0a0a] border-white/10 text-gray-500 hover:text-white hover:border-white/20'
                                            }`}
                                    >
                                        {calculatedTotalPages}
                                    </button>
                                </>
                            )}
                        </div>

                        <button
                            disabled={effectivePage >= calculatedTotalPages}
                            onClick={() => handlePageChange(effectivePage + 1)}
                            className="p-3 bg-[#0a0a0a] border border-white/10 rounded-xl text-white disabled:opacity-30 disabled:cursor-not-allowed hover:border-orange-500/50 transition-all"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                    <p className="text-xs text-gray-500">
                        Page {effectivePage} of {calculatedTotalPages} • {((effectivePage - 1) * ITEMS_PER_PAGE) + 1}-{Math.min(effectivePage * ITEMS_PER_PAGE, totalFilteredItems)} of {totalFilteredItems}
                    </p>
                </div>
            )}

            {/* Empty State */}
            {paginatedItems.length === 0 && (
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
        </div>
    );
}

function ProductCard({ item, type, category, formatPrice, selectedCurrency, toggleWishlist, isInWishlist }) {
    const [isInfoOpen, setIsInfoOpen] = useState(false);
    const [currentImgIndex, setCurrentImgIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const productSlug = item.slug || item.id;
    const productHref = `/services/${type}/${category}/${productSlug}`;

    const images = useMemo(() => {
        const all = [];
        if (item.thumbnail_image) all.push(item.thumbnail_image);
        if (item.images && Array.isArray(item.images)) {
            item.images.forEach(img => {
                if (img !== item.thumbnail_image && !all.includes(img)) all.push(img);
            });
        }
        if (all.length === 0) all.push("https://placehold.co/400x300");
        return all;
    }, [item.thumbnail_image, item.images]);

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

    return (
        <>
            <div className="group bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] hover:border-orange-500/50 transition-all hover:-translate-y-2 shadow-2xl relative overflow-hidden">
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
                                <button onClick={prevImg} className="p-3 bg-black/80 backdrop-blur-xl rounded-full text-white hover:bg-orange-500 transition-all pointer-events-auto border border-white/5 shadow-2xl">
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button onClick={nextImg} className="p-3 bg-black/80 backdrop-blur-xl rounded-full text-white hover:bg-orange-500 transition-all pointer-events-auto border border-white/5 shadow-2xl">
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </Link>

                    {/* Badges Layer (NOT Clipped - to allow dropdowns) */}
                    <div className="absolute inset-0 pointer-events-none z-20">
                        {/* Top Left: Info & Delivery Type */}
                        <div className="absolute top-6 left-6 flex flex-col gap-2 pointer-events-auto">
                            <div onMouseEnter={() => setIsInfoOpen(true)} onMouseLeave={() => setIsInfoOpen(false)} className="relative">
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
                                                        <span className="text-[9px] font-black text-white uppercase">{item.stock_mode === 'unlimited' ? 'In Stock' : (item.quantity_available > 0 ? `${item.quantity_available} Units` : 'Out')}</span>
                                                    </div>
                                                    {item.purchases_count > 0 && (
                                                        <div className="flex justify-between items-center bg-white/[0.03] p-2 rounded-lg border border-white/5">
                                                            <span className="text-[9px] font-bold text-gray-500 uppercase">Purchases</span>
                                                            <span className="text-[9px] font-black text-orange-500 uppercase">{item.purchases_count}</span>
                                                        </div>
                                                    )}
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
                            <div className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase backdrop-blur-xl border shadow-lg ${(item.stock_mode !== 'limited' || (item.quantity_available > 0))
                                ? 'bg-green-500/20 border-green-500/50 text-green-400'
                                : 'bg-red-500/20 border-red-500/50 text-red-500'
                                }`}>
                                {item.stock_mode === 'unlimited' ? 'In Stock' : (item.quantity_available > 0 ? `${item.quantity_available} In Stock` : 'Out of Stock')}
                            </div>
                        </div>

                        {/* Bottom Left: Delivery Time */}
                        <div className="absolute bottom-6 left-6 flex items-center gap-2 px-3 py-1.5 bg-black/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl pointer-events-auto">
                            <Clock className="w-3.5 h-3.5 text-orange-500" />
                            <span className="text-[10px] font-black uppercase text-white tracking-[0.1em]">
                                {(item.delivery_type === 'auto' || item.delivery_type === 'instant') ? 'Instant' : (item.delivery_time || 'Instant')}
                            </span>
                        </div>

                        {/* Bottom Right: Maximize */}
                        <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsLightboxOpen(true); }}
                            className="absolute bottom-6 right-6 p-3 bg-black/80 backdrop-blur-xl rounded-2xl text-white hover:bg-orange-500 hover:scale-110 transition-all shadow-xl border border-white/10 pointer-events-auto"
                        >
                            <Maximize2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="p-8">
                    {/* Meta Row */}
                    <div className="flex items-center justify-between gap-3 mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-orange-500/80">
                        <div className="flex items-center gap-2 min-w-0">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                            <span className="truncate">{item.type || 'Service'}</span>
                            <span className="text-gray-800 mx-1">•</span>
                            <span className="truncate">{item.product_category || category || 'Global'}</span>
                        </div>
                        {/* Purchases or Hot Badge */}
                        <div className="flex items-center gap-2">
                            {item.purchases_count > 0 ? (
                                <span className="text-[9px] font-black text-orange-500">{item.purchases_count} sold</span>
                            ) : (
                                <span className="flex items-center gap-1 text-[9px] font-black text-orange-500">
                                    <span className="text-orange-500">!</span> HOT
                                </span>
                            )}
                        </div>
                    </div>

                    <Link href={productHref}>
                        <h3 className="text-xl font-black mb-6 line-clamp-2 group-hover:text-orange-500 transition-colors uppercase italic leading-[1.1] tracking-tighter min-h-[3rem]">
                            {item.title?.toUpperCase()}
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
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {isLightboxOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4"
                        onClick={() => setIsLightboxOpen(false)}
                    >
                        <button className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-red-500 text-white rounded-xl transition-all">
                            <X className="w-6 h-6" />
                        </button>
                        <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
                            <img src={images[currentImgIndex]} alt="Preview" className="w-full h-auto max-h-[70vh] object-contain rounded-2xl" />
                            {images.length > 1 && (
                                <>
                                    <button onClick={prevImg} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/80 rounded-full text-white hover:bg-orange-500">
                                        <ChevronLeft className="w-6 h-6" />
                                    </button>
                                    <button onClick={nextImg} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/80 rounded-full text-white hover:bg-orange-500">
                                        <ChevronRight className="w-6 h-6" />
                                    </button>
                                    <div className="flex justify-center gap-2 mt-4">
                                        {images.map((img, idx) => (
                                            <button key={idx} onClick={() => setCurrentImgIndex(idx)} className={`w-16 h-12 rounded-lg overflow-hidden border-2 ${idx === currentImgIndex ? 'border-orange-500' : 'border-white/10'}`}>
                                                <img src={img} className="w-full h-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
