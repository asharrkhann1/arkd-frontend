'use client';
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Search, X } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { serviceConfigs, getServiceConfig } from '@/constants/servicesConfig';
import { getGameIcon, getGameColors } from '@/constants/gameIcons';
import { getProductCategoryLogo, getAdditionalLogos } from '@/constants/productCategoryLogos';

const FeaturedCategories = () => {
    const { services, serviceCategories, categoryToServicesMap } = useData();
    const [searchQuery, setSearchQuery] = useState('');

    const activeServices = services
        ? services.map(s => {
            const type = typeof s === 'string' ? s : s.type;
            return { type, config: getServiceConfig(type) };
        }).filter(item => item.config)
        : [];

    // Fuzzy search function
    const fuzzyMatch = (text, query) => {
        if (!text || !query) return false;
        const lowerText = text.toLowerCase();
        const lowerQuery = query.toLowerCase();

        // Exact match
        if (lowerText.includes(lowerQuery)) return true;

        // Fuzzy match - check if all characters in query appear in order in text
        let queryIndex = 0;
        for (let i = 0; i < lowerText.length && queryIndex < lowerQuery.length; i++) {
            if (lowerText[i] === lowerQuery[queryIndex]) {
                queryIndex++;
            }
        }
        return queryIndex === lowerQuery.length;
    };

    // Search results with fuzzy matching
    const searchResults = useMemo(() => {
        if (!searchQuery.trim()) return [];

        const query = searchQuery.trim();
        const results = [];

        // Search in categories first (priority)
        Object.entries(categoryToServicesMap || {}).forEach(([category, serviceTypes]) => {
            if (fuzzyMatch(category, query)) {
                results.push({
                    type: 'category',
                    title: category,
                    serviceTypes: serviceTypes,
                    isExact: category.toLowerCase() === query.toLowerCase()
                });
            }
        });

        // Then search in service names
        activeServices.forEach(({ type, config: svc }) => {
            if (fuzzyMatch(svc.name, query) || fuzzyMatch(svc.title, query)) {
                const cats = serviceCategories[type] || [];
                results.push({
                    type: 'service',
                    title: svc.name,
                    config: svc,
                    categories: cats,
                    serviceType: type,
                    isExact: svc.name.toLowerCase() === query.toLowerCase() || svc.title.toLowerCase() === query.toLowerCase()
                });
            }
        });

        // Sort results: exact matches first, then by relevance
        return results.sort((a, b) => {
            if (a.isExact && !b.isExact) return -1;
            if (!a.isExact && b.isExact) return 1;
            return 0;
        });
    }, [activeServices, searchQuery, serviceCategories, categoryToServicesMap]);

    return (
        <section className="py-20 relative overflow-hidden">
            {/* Background gradient orbs */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Premium Section Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] mb-4">
                        <Sparkles className="w-4 h-4 text-orange-400" />
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Premium Services</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
                        Browse what we <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">offer</span>
                    </h2>
                    <p className="text-gray-500 text-sm mt-3 font-medium max-w-md mx-auto">Explore our curated collection of premium gaming services and digital assets</p>
                </div>

                {/* Search Bar */}
                <div className="max-w-xl mx-auto mb-10">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative flex items-center bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden backdrop-blur-sm group-hover:border-orange-500/30 transition-colors duration-300">
                            <div className="pl-4">
                                <Search className="w-5 h-5 text-gray-500 group-hover:text-orange-400 transition-colors" />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search services or categories..."
                                className="flex-1 bg-transparent px-4 py-3.5 text-white placeholder:text-gray-600 outline-none text-sm"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="pr-4 text-gray-500 hover:text-white transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                    {/* Search Results */}
                    {searchQuery && searchResults.length > 0 && (
                        <div className="mt-4 p-4 bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/[0.08] rounded-xl backdrop-blur-sm">
                            <div className="space-y-3">
                                {searchResults.map((result, idx) => {
                                    if (result.type === 'category') {
                                        const GameIcon = getGameIcon(result.title);
                                        const gameColors = getGameColors(result.title);
                                        return (
                                            <div key={`category-${result.title}-${idx}`} className="flex items-center gap-4">
                                                {/* Game Icon */}
                                                <div className="flex items-center gap-3 flex-shrink-0">
                                                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gameColors.dot} p-[1px]`}>
                                                        <div className="w-full h-full rounded-lg bg-[#141419] flex items-center justify-center">
                                                            <GameIcon className="w-4 h-4 text-white" />
                                                        </div>
                                                    </div>
                                                    <span className="text-sm font-black text-white uppercase tracking-wider">
                                                        {result.title}
                                                    </span>
                                                </div>

                                                {/* Available Services */}
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    {result.serviceTypes.map(serviceType => {
                                                        const config = getServiceConfig(serviceType);
                                                        if (!config) return null;
                                                        const Icon = config.icon;
                                                        return (
                                                            <Link
                                                                key={serviceType}
                                                                href={`${config.href}/${result.title}`}
                                                                className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs font-semibold text-gray-400 hover:text-white hover:bg-orange-500/10 hover:border-orange-500/30 transition-all uppercase flex items-center gap-1"
                                                                onClick={() => setSearchQuery('')}
                                                            >
                                                                <Icon className="w-3 h-3" />
                                                                {config.name}
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    } else {
                                        // Service result
                                        const Icon = result.config.icon;
                                        return (
                                            <div key={`service-${result.serviceType}-${idx}`} className="flex items-center gap-4">
                                                {/* Service Icon & Name */}
                                                <div className="flex items-center gap-3 flex-shrink-0">
                                                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${result.config.color} p-[1px]`}>
                                                        <div className="w-full h-full rounded-lg bg-[#141419] flex items-center justify-center">
                                                            <Icon className="w-4 h-4 text-white" />
                                                        </div>
                                                    </div>
                                                    <span className="text-sm font-black text-white uppercase tracking-wider">
                                                        {result.title}
                                                    </span>
                                                </div>

                                                {/* Categories */}
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    {result.categories.slice(0, 4).map((cat) => (
                                                        <Link
                                                            key={cat}
                                                            href={`${result.config.href}/${cat}`}
                                                            className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs font-semibold text-gray-400 hover:text-white hover:bg-orange-500/10 hover:border-orange-500/30 transition-all uppercase"
                                                            onClick={() => setSearchQuery('')}
                                                        >
                                                            {cat}
                                                        </Link>
                                                    ))}
                                                    {result.categories.length > 4 && (
                                                        <div className="col-span-3 flex items-center justify-center mt-1">
                                                            <Link
                                                                href={result.config.href}
                                                                className="px-2 py-1 rounded-lg bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-500/30 text-[10px] font-bold text-orange-400 hover:from-orange-500/30 hover:to-orange-600/30 transition-all uppercase"
                                                                onClick={() => setSearchQuery('')}
                                                            >
                                                                +{result.categories.length - 4} More
                                                            </Link>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    }
                                })}
                            </div>
                        </div>
                    )}

                    {searchQuery && searchResults.length === 0 && (
                        <p className="text-center text-xs text-gray-500 mt-2">
                            No services or categories found
                        </p>
                    )}
                </div>

                {/* Premium Window-style cards - Always show all services */}
                <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide px-1 justify-center flex-wrap">
                    {activeServices.map(({ type, config: svc }) => {
                        const Icon = svc.icon;
                        const cats = serviceCategories[type] || [];

                        return (
                            <div
                                key={svc.id}
                                className="snap-start flex-shrink-0 w-[280px] rounded-xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/[0.12] backdrop-blur-sm overflow-hidden flex flex-col group hover:border-orange-500/30 hover:shadow-[0_0_40px_rgba(249,115,22,0.15)] transition-all duration-500"
                            >
                                {/* Premium Window Title Bar */}
                                <Link
                                    href={svc.href}
                                    className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-white/[0.06] to-transparent border-b border-white/[0.08] hover:from-white/[0.08] transition-all"
                                >
                                    {/* Glowing accent dot */}
                                    <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-br ${svc.color} shadow-[0_0_10px_rgba(249,115,22,0.5)]`} />

                                    {/* Premium Icon container */}
                                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${svc.color} p-[1px]`}>
                                        <div className="w-full h-full rounded-lg bg-[#141419] flex items-center justify-center">
                                            <Icon className="w-4 h-4 text-white" />
                                        </div>
                                    </div>

                                    {/* Premium Title - UPPERCASE */}
                                    <span className="flex-1 text-base font-black text-white uppercase tracking-wider truncate">
                                        {svc.name}
                                    </span>

                                    {/* Badge */}
                                    {svc.badge && (
                                        <span className="px-2 py-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-md text-[9px] font-black uppercase shadow-lg">
                                            {svc.badge}
                                        </span>
                                    )}
                                </Link>

                                {/* Premium Content Area */}
                                <div className="p-3 flex flex-col gap-2">
                                    <div className="grid grid-cols-3 gap-2">
                                        {cats.length > 0 ? (
                                            cats.slice(0, 6).map((cat) => {
                                                const logo = getProductCategoryLogo(cat);
                                                return (
                                                    <Link
                                                        key={cat}
                                                        href={`${svc.href}/${cat}`}
                                                        className="group relative overflow-hidden rounded bg-white/[0.04] border border-white/[0.06] hover:border-orange-500/30 hover:bg-orange-500/10 transition-all duration-300 aspect-square flex items-center justify-center"
                                                        title={cat}
                                                    >
                                                        {/* Logo image */}
                                                        <img
                                                            src={logo}
                                                            alt={cat}
                                                            className="w-8 h-8 object-contain opacity-60 group-hover:opacity-90 transition-opacity"
                                                            onError={(e) => {
                                                                e.target.src = '/logos/steam.png'; // Fallback
                                                            }}
                                                        />
                                                    </Link>
                                                );
                                            })
                                        ) : (
                                            <div className="col-span-3 text-xs text-gray-600 uppercase text-center py-4">
                                                No categories
                                            </div>
                                        )}
                                    </div>

                                    {/* +4 More section */}
                                    {cats.length > 6 && (
                                        <div className="grid grid-cols-4 gap-1 mt-1">
                                            {getAdditionalLogos(4).map((logo, idx) => (
                                                <div
                                                    key={`additional-${idx}`}
                                                    className="relative overflow-hidden rounded bg-white/[0.02] border border-white/[0.04] aspect-square flex items-center justify-center"
                                                >
                                                    <img
                                                        src={logo}
                                                        alt={`Additional service ${idx + 1}`}
                                                        className="w-8 h-8 object-contain opacity-50"
                                                    />
                                                </div>
                                            ))}
                                            <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30 aspect-square flex items-center justify-center group cursor-pointer">
                                                <Link
                                                    href={svc.href}
                                                    className="absolute inset-0 flex items-center justify-center"
                                                >
                                                    <span className="text-lg font-black text-orange-400 group-hover:text-orange-300 transition-colors">
                                                        +{cats.length - 6}
                                                    </span>
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Premium View All Button */}
                <div className="text-center mt-10">
                    <Link
                        href="/services"
                        className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl text-white font-bold uppercase tracking-wider shadow-[0_0_30px_rgba(249,115,22,0.3)] hover:shadow-[0_0_40px_rgba(249,115,22,0.5)] hover:scale-105 transition-all duration-300"
                    >
                        <span>View All Services</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FeaturedCategories;
