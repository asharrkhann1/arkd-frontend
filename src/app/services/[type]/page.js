'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { getServiceConfig, normalizeServiceType } from '@/constants/servicesConfig';
import { getBackgroundForOrigin } from '@/constants/backgroundMappings';
import { getServiceCardImage } from '@/constants/serviceCardImages';
import { getProductCategoryLogo } from '@/constants/productCategoryLogos';

const GAME_GRADIENTS = [
    {
        name: "Fortnite",
        bgColor: "from-red-900/20 to-rose-900/20",
        glowColor: "from-rose-500/40 via-red-500/30 to-rose-600/40",
        width: "w-120",
        height: "h-72"
    },
    {
        name: "World of Warcraft",
        bgColor: "from-slate-900/20 to-gray-800/20",
        glowColor: "from-slate-600/40 via-gray-500/30 to-slate-700/40",
        width: "w-120",
        height: "h-80"
    },
    {
        name: "League of Legends",
        bgColor: "from-teal-900/20 to-cyan-900/20",
        glowColor: "from-cyan-500/40 via-teal-400/30 to-cyan-600/40",
        width: "w-120",
        height: "h-62"
    },
    {
        name: "Marvel Rivals",
        bgColor: "from-yellow-900/20 to-orange-900/20",
        glowColor: "from-orange-500/40 via-yellow-500/30 to-orange-600/40",
        width: "w-120",
        height: "h-80"
    },
    {
        name: "Rainbow Six Siege",
        bgColor: "from-gray-900/20 to-slate-800/20",
        glowColor: "from-slate-500/40 via-gray-600/30 to-slate-600/40",
        width: "w-120",
        height: "h-80"
    },
    {
        name: "Rocket League",
        bgColor: "from-blue-900/20 to-indigo-900/20",
        glowColor: "from-indigo-500/40 via-blue-500/30 to-indigo-600/40",
        width: "w-120",
        height: "h-80"
    },
    {
        name: "FC 26",
        bgColor: "from-green-900/20 to-emerald-900/20",
        glowColor: "from-emerald-500/40 via-green-500/30 to-emerald-600/40",
        width: "w-120",
        height: "h-80"
    },
    {
        name: "Valorant",
        bgColor: "from-red-900/20 to-rose-900/20",
        glowColor: "from-rose-500/40 via-red-500/30 to-rose-600/40",
        width: "w-120",
        height: "h-80"
    },
    {
        name: "Clash Royale",
        bgColor: "from-blue-900/20 to-purple-900/20",
        glowColor: "from-blue-600/40 via-blue-500/30 to-purple-600/40",
        width: "w-120",
        height: "h-80"
    }
];

function getServiceDetails(type) {
    // Validate type parameter
    if (!type || typeof type !== 'string') {
        console.error('Invalid type parameter:', type);
        return null;
    }

    const normalizedType = normalizeServiceType(type);
    return fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/services/${normalizedType}`, {
        cache: 'no-store'
    }).then(res => res.ok ? res.json() : null);
}

export default function ServiceTypePage({ params }) {
    const { type } = React.use(params);
    const [serviceData, setServiceData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [hoveredCard, setHoveredCard] = React.useState(null);

    React.useEffect(() => {
        async function fetchData() {
            if (!type) return;

            setLoading(true);
            const data = await getServiceDetails(type);
            setServiceData(data);
            setLoading(false);
        }

        fetchData();
    }, [type]);

    // Validate type parameter
    if (!type || typeof type !== 'string') {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold text-white mb-4">Invalid Service Type</h1>
                <Link href="/services" className="text-orange-500 hover:underline flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back to Services
                </Link>
            </div>
        );
    }

    const config = getServiceConfig(type);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

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

            {/* Hero Banner */}
            <div className="relative z-10 mx-6 mt-8">
                <div className="relative flex flex-col lg:flex-row items-center justify-between overflow-hidden border border-orange-500/20 rounded-[20px] bg-gradient-to-b from-gray-950/90 via-gray-900/90 to-gray-950/90 backdrop-blur-sm">
                    {/* Left Section */}
                    <div className="relative z-10 flex flex-col justify-center w-full lg:w-1/2 px-10 py-16 space-y-6">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-500 uppercase tracking-[0.15em]">
                            <Link href="/" className="hover:text-white transition-colors text-[10px]">Home</Link>
                            <span>/</span>
                            <Link href="/services" className="hover:text-white transition-colors text-[10px]">Services</Link>
                            <span>/</span>
                            <span className="text-orange-500 text-[10px] uppercase">{config?.name || type}</span>
                        </div>

                        <h1 className="text-5xl md:text-6xl font-black text-white leading-tight">
                            {config?.name || type}
                        </h1>
                        <p className="text-xl md:text-2xl font-medium text-white">
                            {config?.description || 'Browse our premium selection of game services and digital items.'}
                        </p>

                        <div className="flex flex-wrap items-center gap-6">
                            <div className="flex items-center gap-2 text-sm">
                                <span>Rated</span>
                                <span className="text-xl font-bold text-orange-500">4.9</span>
                                <span className="text-xl text-yellow-400">★</span>
                                <span>by over</span>
                                <span className="font-semibold text-orange-500">10,000+</span>
                                <span>customers</span>
                            </div>
                            <Link href="#categories" className="bg-orange-500 text-white font-semibold px-6 py-3 rounded-full hover:bg-orange-600 transition-all duration-300">
                                Browse Now
                            </Link>
                        </div>
                    </div>

                    {/* Right Side - Placeholder */}
                    <div className="relative w-full lg:w-1/2 h-[400px] overflow-hidden">
                        <div className="absolute inset-0 [clip-path:polygon(10%_0%,100%_0%,100%_100%,0%_100%)] overflow-hidden">
                            <img
                                src="https://placehold.co/800x400/1a1a2e/f5d38b?text=Coming+Soon"
                                alt="Hero"
                                className="object-cover w-full h-full"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div id="categories" className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-8xl mx-auto">

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                        {categories.map((cat, index) => {
                            const cardImage = getServiceCardImage(cat);
                            const isHovered = hoveredCard === index;
                            const isDimmed = hoveredCard !== null && hoveredCard !== index;

                            // Get gradient theme for this category
                            const game = GAME_GRADIENTS[index % GAME_GRADIENTS.length];

                            return (
                                <div
                                    key={cat}
                                    onMouseEnter={() => setHoveredCard(index)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                    onClick={() => window.location.href = `${config?.href || `/services/${type}`}/${cat}`}
                                    className={`group relative h-[350px] rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ${isDimmed ? "opacity-40 scale-95" : "opacity-100 scale-100"
                                        }`}
                                >
                                    <div
                                        className={`absolute inset-0 bg-gradient-to-br transition-all duration-500 ${isHovered ? game.glowColor : game.bgColor
                                            }`}
                                    />
                                    <div className="absolute inset-0 border border-white/10 rounded-2xl transition-all duration-500" />
                                    <div className="relative h-full p-6 flex flex-col justify-between">
                                        <div className="text-xs font-bold text-white/80 uppercase tracking-wider">
                                            {cat.replace(/-/g, ' ')}
                                        </div>
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <h3 className="text-6xl font-black text-white/5 uppercase tracking-tight text-center leading-none">
                                                {cat.split('-')[0]}
                                            </h3>
                                        </div>
                                        <img
                                            src={cardImage || getProductCategoryLogo(cat)}
                                            alt={cat}
                                            className={`absolute bottom-0 right-0 object-contain opacity-90 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110 pointer-events-none ${game.width || "w-60"
                                                } ${game.height || "h-80"}`}
                                        />
                                        <div className="flex justify-start">
                                            <div className="relative overflow-hidden bg-gray-800/80 group-hover:bg-gray-800 rounded-full px-4 py-2.5 flex items-center gap-2 transition-all duration-500 group-hover:pr-5">
                                                <span className="text-white text-sm font-semibold whitespace-nowrap opacity-0 max-w-0 group-hover:opacity-100 group-hover:max-w-[80px] transition-all duration-500 overflow-hidden">
                                                    Buy Now
                                                </span>
                                                <div className="relative w-5 h-5 flex items-center justify-center">
                                                    <ChevronRight className="w-5 h-5 text-white transition-transform duration-500 group-hover:translate-x-1" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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
