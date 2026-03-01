'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getServiceConfig, normalizeServiceType } from '@/constants/servicesConfig';
import { getProductCategoryLogo } from '@/constants/productCategoryLogos';
import { useData } from '@/contexts/DataContext';

export default function ServicesPage() {
    const { services, categoryToServicesMap } = useData();
    const [hoveredCard, setHoveredCard] = React.useState(null);
    
    console.log('🔍 Debug - Services from context:', services);
    console.log('🔍 Debug - Category to services map from context:', categoryToServicesMap);

    // Build services with categories from existing data
    const servicesWithCategories = services.map(serviceType => {
        const normalizedServiceType = normalizeServiceType(serviceType);
        const categories = Object.keys(categoryToServicesMap).filter(category => 
            (categoryToServicesMap[category] || []).some(type => normalizeServiceType(type) === normalizedServiceType)
        ).slice(0, 4); // Get first 4 categories
        
        console.log(`🔍 Debug - Categories for ${serviceType}:`, categories);
        
        return {
            type: serviceType,
            config: getServiceConfig(serviceType),
            categories: categories
        };
    });

    console.log('🔍 Debug - Services with categories:', servicesWithCategories);

    // Filter out services without configs
    const activeServices = servicesWithCategories.filter(item => item.config);
    console.log('🔍 Debug - Active services (with configs):', activeServices);

    return (
        <div className="min-h-screen bg-black text-white py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-6xl font-black italic tracking-tighter mb-4 uppercase">Our Services</h1>
                    <p className="text-gray-400 text-xl font-medium max-w-2xl mx-auto">
                        Explore our wide range of digital services, from game accounts to instant top-ups.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {activeServices.map((serviceData) => {
                        const { config: service, categories } = serviceData;
                        const Icon = service.icon;
                        const isHovered = hoveredCard === service.id;
                        const isDimmed = hoveredCard !== null && hoveredCard !== service.id;
                        
                        // Generate gradient colors based on service color
                        const bgColor = service.color?.replace('to-', 'to-') || 'from-gray-900/20 to-gray-800/20';
                        const glowColor = service.color?.replace('to-', 'via-')?.replace('from-', 'to-') || 'from-gray-600/40 via-gray-500/30 to-gray-700/40';
                        
                        return (
                            <div
                                key={service.id}
                                onMouseEnter={() => setHoveredCard(service.id)}
                                onMouseLeave={() => setHoveredCard(null)}
                                className={`group relative h-[350px] rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ${
                                    isDimmed ? "opacity-40 scale-95" : "opacity-100 scale-100"
                                }`}
                            >
                                <Link href={service.href} className="block w-full h-full">
                                    <div
                                        className={`absolute inset-0 bg-gradient-to-br transition-all duration-500 ${
                                            isHovered ? glowColor : bgColor
                                        }`}
                                    />
                                    <div className="absolute inset-0 border border-white/10 rounded-2xl transition-all duration-500" />
                                    <div className="relative h-full p-6 flex flex-col justify-between">
                                        {/* Top Section - Service Name */}
                                        <div className="text-xs font-bold text-white/80 uppercase tracking-wider">
                                            {service.name}
                                        </div>
                                        
                                        {/* Center Section - Large Watermark */}
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <h3 className="text-6xl font-black text-white/5 uppercase tracking-tight text-center leading-none">
                                                {service.name?.split(" ")[0]}
                                            </h3>
                                        </div>
                                        
                                        {/* Service Icon */}
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${service.color} p-0.5 shadow-2xl`}>
                                                <div className="w-full h-full bg-black/80 rounded-xl flex items-center justify-center">
                                                    <Icon className="w-10 h-10 text-white" />
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Bottom Section - Categories and Button */}
                                        <div className="flex justify-between items-end">
                                            {/* Categories */}
                                            <div className="flex gap-1">
                                                {categories.slice(0, 3).map((category, idx) => {
                                                    const logo = getProductCategoryLogo(category);
                                                    return (
                                                        <div 
                                                            key={category}
                                                            className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center"
                                                            title={category}
                                                        >
                                                            <img 
                                                                src={logo} 
                                                                alt={category}
                                                                className="w-5 h-5 object-contain"
                                                                onError={(e) => {
                                                                    e.target.src = '/logos/steam.png';
                                                                }}
                                                            />
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            
                                            {/* Buy Now Button */}
                                            <div className="relative overflow-hidden bg-gray-800/80 group-hover:bg-gray-800 rounded-full px-4 py-2.5 flex items-center gap-2 transition-all duration-500 group-hover:pr-5">
                                                <span className="text-white text-sm font-semibold whitespace-nowrap opacity-0 max-w-0 group-hover:opacity-100 group-hover:max-w-[80px] transition-all duration-500 overflow-hidden">
                                                    Explore
                                                </span>
                                                <div className="relative w-5 h-5 flex items-center justify-center">
                                                    <ArrowRight className="w-5 h-5 text-white transition-transform duration-500 group-hover:translate-x-1" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
