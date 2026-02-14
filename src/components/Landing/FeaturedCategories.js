'use client';
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Search, X } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { serviceConfigs } from '@/constants/servicesConfig';

const FeaturedCategories = () => {
    const { services, serviceCategories } = useData();
    const [searchQuery, setSearchQuery] = useState('');

    const activeServices = services
        ? services.map(s => {
            const type = typeof s === 'string' ? s : s.type;
            return { type, config: serviceConfigs[type] };
        }).filter(item => item.config)
        : [];

    // Filter services and categories based on search
    const filteredServices = useMemo(() => {
        if (!searchQuery.trim()) return activeServices;
        
        const query = searchQuery.toLowerCase();
        
        return activeServices.filter(({ type, config: svc }) => {
            // Check if service name matches
            if (svc.name.toLowerCase().includes(query)) return true;
            if (svc.title.toLowerCase().includes(query)) return true;
            
            // Check if any category matches
            const cats = serviceCategories[type] || [];
            return cats.some(cat => cat.toLowerCase().includes(query));
        });
    }, [activeServices, searchQuery, serviceCategories]);

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
                    {searchQuery && (
                        <p className="text-center text-xs text-gray-500 mt-2">
                            Found {filteredServices.length} matching {filteredServices.length === 1 ? 'service' : 'services'}
                        </p>
                    )}
                </div>

                {/* Premium Window-style cards */}
                <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide px-1 justify-center flex-wrap">
                    {filteredServices.map(({ type, config: svc }) => {
                        const Icon = svc.icon;
                        const cats = serviceCategories[type] || [];
                        
                        // Filter categories if search is active
                        const filteredCats = searchQuery.trim()
                            ? cats.filter(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()))
                            : cats;

                        return (
                            <div
                                key={svc.id}
                                className="snap-start flex-shrink-0 w-[300px] rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/[0.12] backdrop-blur-sm overflow-hidden flex flex-col group hover:border-orange-500/30 hover:shadow-[0_0_40px_rgba(249,115,22,0.15)] transition-all duration-500"
                            >
                                {/* Premium Window Title Bar */}
                                <Link
                                    href={svc.href}
                                    className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-white/[0.06] to-transparent border-b border-white/[0.08] hover:from-white/[0.08] transition-all"
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
                                    <span className="flex-1 text-sm font-black text-white uppercase tracking-wider truncate">
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
                                <div className="p-5 flex flex-col gap-4">
                                    <div className="flex flex-wrap gap-2">
                                        {filteredCats.length > 0 ? (
                                            filteredCats.slice(0, 6).map((cat) => (
                                                <Link
                                                    key={cat}
                                                    href={`${svc.href}/${cat}`}
                                                    className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs font-semibold text-gray-400 hover:text-white hover:bg-orange-500/10 hover:border-orange-500/30 transition-all uppercase"
                                                >
                                                    {cat}
                                                </Link>
                                            ))
                                        ) : searchQuery ? (
                                            <span className="text-xs text-gray-600 uppercase">No matching categories</span>
                                        ) : (
                                            <span className="text-xs text-gray-600 uppercase">No categories</span>
                                        )}
                                        {filteredCats.length > 6 && (
                                            <Link
                                                href={svc.href}
                                                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-500/30 text-xs font-bold text-orange-400 hover:from-orange-500/30 hover:to-orange-600/30 transition-all uppercase"
                                            >
                                                +{filteredCats.length - 6} More
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* No Results State */}
                {searchQuery && filteredServices.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No services or categories match your search</p>
                        <button
                            onClick={() => setSearchQuery('')}
                            className="mt-4 text-orange-500 hover:text-orange-400 text-sm font-medium"
                        >
                            Clear search
                        </button>
                    </div>
                )}

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
