import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, Star, ShieldCheck, Zap } from 'lucide-react';
import { serviceConfigs } from '@/constants/servicesConfig';
import { getBackgroundForOrigin } from '@/constants/backgroundMappings';
import CategoryListing from '@/components/Services/CategoryListing';
import { quickSearchKeywords } from '@/constants/quickSearch';

async function getCategoryProducts(type, category, page = 1) {
    const normalizedType = type.toLowerCase();
    const normalizedCategory = category.toLowerCase();
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/${normalizedCategory}/${normalizedType}?page=${page}`, {
            cache: 'no-store'
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data;
    } catch (err) {
        console.error("Failed to fetch products:", err);
        return null;
    }
}

export default async function CategoryProductsPage({ params, searchParams }) {
    const { type, category } = await params;
    const { page } = await searchParams;
    const currentPage = parseInt(page) || 1;
    const data = await getCategoryProducts(type, category, currentPage);

    const normalizedType = type.replace('-', '').toLowerCase();
    const keywords = quickSearchKeywords[normalizedType]?.[category.toLowerCase()] || [];

    const config = Object.values(serviceConfigs).find(c =>
        c.href === `/services/${type}` || c.id === normalizedType
    );

    // Use fetched data (empty array if none)
    const items = data?.products || [];

    // Get background for the category origin
    const halfPageBg = getBackgroundForOrigin(category);

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden">
            {/* Half Page Background */}
            {halfPageBg && (
                <>
                    <div
                        className="absolute top-0 right-0 w-1/2 h-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${halfPageBg})` }}
                    />
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-transparent via-black/30 to-black pointer-events-none" />
                </>
            )}

            <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header Section */}
                    <div className="mb-12 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2 text-sm font-medium text-gray-500 mb-6 uppercase tracking-[0.15em]">
                            <Link href="/" className="hover:text-white transition-colors text-[10px]">Home</Link>
                            <span>/</span>
                            <Link href="/services" className="hover:text-white transition-colors text-[10px]">Services</Link>
                            <span>/</span>
                            <Link href={config?.href || `/services/${type}`} className="hover:text-white transition-colors text-[10px]">{config?.title || type}</Link>
                            <span>/</span>
                            <span className="text-orange-500 text-[10px] uppercase">{category}</span>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                            <div className="flex-1">
                                <h1 className="text-6xl font-black italic tracking-tighter uppercase mb-3 leading-none">
                                    {category} <span className="text-orange-500">{config?.title || ''}</span>
                                </h1>
                                <p className="text-gray-400 text-lg max-w-2xl font-medium leading-relaxed">
                                    Premium <span className="text-white font-bold">{category}</span> selection with
                                    verified sellers and instant delivery options.
                                </p>
                            </div>

                            <div className="flex gap-4 justify-center md:justify-end">
                                <div className="px-6 py-4 bg-[#0a0a0a] border border-white/5 rounded-2xl flex items-center gap-4 group">
                                    <div className="p-2 bg-orange-500/10 rounded-lg group-hover:bg-orange-500/20 transition-colors">
                                        <ShieldCheck className="w-6 h-6 text-orange-500" />
                                    </div>
                                    <div className="hidden sm:block text-left">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Protection</p>
                                        <p className="text-sm font-black italic">SECURE TRADE</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area with Filters */}
                    <CategoryListing
                        initialItems={items}
                        type={type}
                        category={category}
                        serviceTitle={config?.title}
                        quickKeywords={keywords}
                        currentPage={currentPage}
                        totalPages={data?.pagination?.totalPages || 1}
                        totalItems={data?.pagination?.total || items.length}
                    />
                </div>
            </div>
        </div>
    );
}
