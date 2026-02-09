import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { serviceConfigs } from '@/constants/servicesConfig';

async function getAllServices() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/services`, {
            cache: 'no-store'
        });

        if (!res.ok) return [];
        const data = await res.json();
        return data.services || []; // Extract the services array from the response object
    } catch (err) {
        console.error("Failed to fetch services:", err);
        return [];
    }
}

export default async function ServicesPage() {
    const services = await getAllServices();

    // Map the fetched services to our local configs
    const activeServices = services.map(type => {
        return serviceConfigs[type];
    }).filter(Boolean);

    return (
        <div className="min-h-screen bg-black text-white py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-6xl font-black italic tracking-tighter mb-4 uppercase">Our Services</h1>
                    <p className="text-gray-400 text-xl font-medium max-w-2xl mx-auto">
                        Explore our wide range of digital services, from game accounts to instant top-ups.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {activeServices.map((service) => {
                        const Icon = service.icon;
                        return (
                            <Link
                                key={service.id}
                                href={service.href}
                                className="group relative"
                            >
                                <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                                <div className="relative h-full bg-[#0a0a0a] border border-white/5 rounded-3xl p-10 transition-all duration-300 group-hover:border-white/10 group-hover:-translate-y-2 shadow-2xl">
                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} p-0.5 mb-8 shadow-lg`}>
                                        <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center">
                                            <Icon className="w-8 h-8 text-white" />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-3xl font-black uppercase tracking-tight">{service.title}</h3>
                                            <ArrowRight className="w-6 h-6 text-gray-700 group-hover:text-orange-500 group-hover:translate-x-2 transition-all" />
                                        </div>
                                        <p className="text-gray-400 font-medium text-lg leading-relaxed">
                                            {service.description}
                                        </p>
                                    </div>

                                    <div className="mt-10 pt-8 border-t border-white/5 flex items-center gap-4">
                                        <div className="flex -space-x-3">
                                            {[1, 2, 3, 4].map((i) => (
                                                <div key={i} className="w-10 h-10 rounded-full border-4 border-[#0a0a0a] bg-gray-900 overflow-hidden" />
                                            ))}
                                        </div>
                                        <span className="text-sm font-black uppercase tracking-widest text-orange-500">
                                            1.3M+ Trusted Sellers
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
