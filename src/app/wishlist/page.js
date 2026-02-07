'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Heart,
    ArrowUpRight,
    MoreHorizontal,
    LayoutGrid,
    ShieldCheck,
    X,
    ChevronLeft,
    ChevronRight,
    Maximize2,
    Info,
    Clock
} from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useWishlist } from '@/contexts/WishlistContext';

// ... imports remain the same

export default function WishlistPage() {
    const { wishlist, toggleWishlist, isInWishlist } = useWishlist();
    const { formatPrice, selectedCurrency } = useCurrency();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredItems = useMemo(() => {
        return wishlist.filter(item => {
            return item.title.toLowerCase().includes(searchQuery.toLowerCase());
        });
    }, [wishlist, searchQuery]);

    return (
        <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12 text-center md:text-left">
                    <h1 className="text-6xl font-black italic tracking-tighter uppercase mb-3 leading-none">
                        MY <span className="text-orange-500">WISHLIST</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl font-medium leading-relaxed">
                        Your curated collection of premium digital assets.
                    </p>
                </div>

                {/* Search */}
                <div className="mb-8 relative max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search your wishlist..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white text-sm focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 outline-none transition-all shadow-inner"
                    />
                </div>

                {/* List View */}
                {wishlist.length > 0 ? (
                    <div className="flex flex-col space-y-4">
                        {filteredItems.map((item) => (
                            <ProductListItem
                                key={item.id}
                                item={item}
                                type={item.type || 'service'}
                                category={item.product_category || 'general'}
                                formatPrice={formatPrice}
                                selectedCurrency={selectedCurrency}
                                toggleWishlist={toggleWishlist}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="py-40 text-center bg-[#0a0a0a] border border-dashed border-white/10 rounded-[3rem] shadow-inner">
                        <div className="w-24 h-24 bg-white/[0.02] rounded-full flex items-center justify-center mx-auto mb-8 border border-white/5">
                            <Heart className="w-10 h-10 text-gray-700" />
                        </div>
                        <h3 className="text-2xl font-black mb-3 uppercase italic tracking-tighter">Your wishlist is empty</h3>
                        <p className="text-gray-500 max-w-sm mx-auto font-medium text-lg leading-relaxed px-4">
                            Start exploring our premium services and add items to your wishlist.
                        </p>
                        <Link href="/services" className="inline-block mt-8 px-8 py-3 bg-orange-600 text-white font-bold uppercase rounded-xl hover:bg-orange-500 transition-colors">
                            Browse Services
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

function ProductListItem({ item, type, category, formatPrice, selectedCurrency, toggleWishlist }) {
    const productSlug = item.slug || item.id;
    const productHref = `/services/${type}/${category}/${productSlug}`;
    const image = item.thumbnail_image || (item.images && item.images[0]) || "https://placehold.co/600x400";

    return (
        <div className="group flex flex-col sm:flex-row gap-6 p-4 bg-[#0a0a0a] border border-white/5 rounded-3xl hover:border-orange-500/30 transition-all hover:bg-white/[0.02] relative overflow-hidden">
            {/* Thumbnail */}
            <div className="w-full sm:w-48 h-32 flex-shrink-0 rounded-2xl overflow-hidden relative border border-white/5">
                <img src={image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-center min-w-0">
                <div className="flex items-center gap-2 mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-orange-500/80">
                    <span>{type}</span>
                    <span className="text-gray-800">•</span>
                    <span>{category}</span>
                </div>

                <Link href={productHref} className="block">
                    <h3 className="text-xl font-black italic uppercase tracking-tighter text-white group-hover:text-orange-500 transition-colors mb-2 truncate">
                        {item.title}
                    </h3>
                </Link>

                <div className="flex items-center gap-4 text-xs text-gray-400 font-medium">
                    <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-orange-500" />
                        <span>{(item.delivery_type === 'auto' || item.delivery_type === 'instant') ? 'Instant Delivery' : (item.delivery_time || 'Instant')}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                        <span>Verified</span>
                    </div>
                </div>
            </div>

            {/* Actions & Price */}
            <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 pl-0 sm:pl-6 border-t sm:border-t-0 sm:border-l border-white/5 pt-4 sm:pt-0 mt-2 sm:mt-0">
                <div className="text-right">
                    <p className="text-2xl font-black italic text-white tracking-tighter leading-none">
                        {formatPrice(item.price)}
                    </p>
                    {selectedCurrency !== 'USD' && (
                        <p className="text-[9px] font-bold text-gray-600 mt-1 uppercase tracking-wider">
                            ${Number(item.price).toFixed(2)}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => toggleWishlist(item)}
                        className="p-3 rounded-xl bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-500 transition-colors border border-white/5"
                        title="Remove from wishlist"
                    >
                        <X className="w-4 h-4" />
                    </button>
                    <Link
                        href={productHref}
                        className="px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg hover:shadow-orange-500/20 flex items-center gap-2"
                    >
                        <span>View</span>
                        <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
