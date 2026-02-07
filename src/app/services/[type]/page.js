import React from 'react';
import Link from 'next/link';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { serviceConfigs } from '@/constants/servicesConfig';

async function getServiceDetails(type) {
    // Normalize type (e.g., top-ups -> topups)
    const normalizedType = type.replace('-', '');
    const res = await fetch(`${process.env.BACKEND_URL}/services/${normalizedType}`, {
        cache: 'no-store'
    });

    if (!res.ok) return null;
    return res.json();
}

export default async function ServiceTypePage({ params }) {
    const { type } = await params;
    const serviceData = await getServiceDetails(type);

    // Find config by matching href or normalized ID
    const config = Object.values(serviceConfigs).find(c =>
        c.href === `/services/${type}` || c.id === type.replace('-', '')
    );

    if (!serviceData || !serviceData.success) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold text-white mb-4">Service Not Found</h1>
                <Link href="/" className="text-orange-500 hover:underline flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>
            </div>
        );
    }

    const { categories } = serviceData;
    const Icon = config?.icon || ChevronRight;

    return (
        <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Breadcrumbs / Back */}
                <div className="mb-8">
                    <Link href="/services" className="text-gray-500 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
                        <ArrowLeft className="w-4 h-4" /> Back to Services
                    </Link>
                </div>

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="flex items-center gap-6">
                        <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${config?.color || 'from-gray-700 to-gray-900'} p-0.5 shadow-2xl shadow-orange-500/10`}>
                            <div className="w-full h-full bg-black rounded-[22px] flex items-center justify-center">
                                <Icon className="w-10 h-10 text-white" />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    Service Category
                                </span>
                                {config?.badge && (
                                    <span className="px-3 py-1 bg-orange-500 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-[0_0_15px_rgba(249,115,22,0.4)]">
                                        {config.badge}
                                    </span>
                                )}
                            </div>
                            <h1 className="text-5xl font-black italic tracking-tighter">{config?.name || type}</h1>
                            <p className="text-gray-400 mt-2 max-w-xl text-lg font-medium leading-relaxed">
                                {config?.description || 'Browse our premium selection of game services and digital items.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categories.map((cat) => (
                        <Link
                            key={cat}
                            href={`${config?.href || `/services/${type}`}/${cat}`}
                            className="group relative"
                        >
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                            <div className="relative bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 h-full transition-all duration-300 group-hover:border-white/10 group-hover:-translate-y-1 shadow-2xl">
                                <div className="flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                            <span className="text-2xl font-black text-orange-500 uppercase">{cat.charAt(0)}</span>
                                        </div>
                                        <div className="p-2 rounded-full border border-white/5 group-hover:border-orange-500/50 transition-colors">
                                            <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-orange-500 transition-colors" />
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">{cat}</h3>
                                    <p className="text-gray-500 text-sm font-medium mb-6">
                                        Explore premium {cat} offers with instant delivery.
                                    </p>

                                    <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-orange-500/70">View Products</span>
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="w-6 h-6 rounded-full border-2 border-black bg-gray-800" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Empty State */}
                {categories.length === 0 && (
                    <div className="text-center py-32 bg-[#0a0a0a] rounded-3xl border border-dashed border-white/10">
                        <p className="text-gray-500 font-medium">No categories available for this service yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
