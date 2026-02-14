import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { serviceConfigs } from '@/constants/servicesConfig';
import { getBackgroundForOrigin } from '@/constants/backgroundMappings';
import { getServiceCardImage } from '@/constants/serviceCardImages';

async function getServiceDetails(type) {
    // Normalize type (e.g., top-ups -> topups)
    const normalizedType = type.replace('-', '');
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/services/${normalizedType}`, {
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

    // Get background for the first category (or try to match origin)
    const halfPageBg = categories.length > 0
        ? getBackgroundForOrigin(categories[0])
        : null;

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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {categories.map((cat) => {
                            const cardImage = getServiceCardImage(cat);
                            return (
                                <Link
                                    key={cat}
                                    href={`${config?.href || `/services/${type}`}/${cat}`}
                                    className="group relative block aspect-[4/5] rounded-2xl overflow-hidden bg-[#0a0a0a] border border-white/5 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/10 hover:border-orange-500/20"
                                >
                                    <div className="absolute inset-0 w-full h-full">
                                        {cardImage ? (
                                            <Image
                                                src={cardImage}
                                                alt={cat}
                                                fill
                                                className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-orange-600/20 via-purple-600/20 to-blue-600/20" />
                                        )}
                                    </div>

                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
                                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    <div className="absolute inset-0 p-5 flex flex-col justify-between z-10">
                                        <div className="flex justify-between items-start">
                                            <span className="px-3 py-1 bg-orange-500/90 backdrop-blur-sm text-white text-[10px] font-black uppercase tracking-wider rounded-full">
                                                {cat.charAt(0).toUpperCase() + cat.slice(1, 4)}
                                            </span>
                                        </div>

                                        <div className="space-y-3">
                                            <h3 className="text-xl font-black text-white uppercase tracking-tight leading-tight drop-shadow-lg">
                                                {cat.replace(/-/g, ' ')}
                                            </h3>

                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full group-hover:bg-orange-500 group-hover:border-orange-500 transition-all duration-300">
                                                    <span className="text-sm font-bold text-white">View</span>
                                                    <ChevronRight className="w-4 h-4 text-white transition-transform duration-300 group-hover:translate-x-1" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                </Link>
                            );
                        })}
                    </div>

                    {categories.length === 0 && (
                        <div className="text-center py-32 bg-[#0a0a0a] rounded-3xl border border-dashed border-white/10">
                            <p className="text-gray-500 font-medium">No categories available for this service yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
