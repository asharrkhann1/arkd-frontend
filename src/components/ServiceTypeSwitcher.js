'use client';
import React, { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { serviceConfigs } from '@/constants/servicesConfig';
import { useData } from '@/contexts/DataContext';

const ServiceTypeSwitcher = ({ currentType, currentCategory }) => {
    const router = useRouter();
    const { categoryToServicesMap } = useData();

    // Get available service types for the current category
    const availableServiceTypes = currentCategory && categoryToServicesMap
        ? categoryToServicesMap[currentCategory] || []
        : [];

    return (
        <div className="mb-8 flex justify-center">
            <div className="flex flex-wrap gap-2 justify-center items-center bg-white/[0.03] border border-white/[0.08] rounded-xl p-1 backdrop-blur-sm">
                {Object.entries(serviceConfigs).map(([key, serviceConfig]) => {
                    const Icon = serviceConfig.icon;
                    const isActive = serviceConfig.id === currentType.replace('-', '') || serviceConfig.href === `/services/${currentType}`;

                    const isAvailable = availableServiceTypes.includes(serviceConfig.id) ||
                        availableServiceTypes.includes(serviceConfig.id.replace('-', ''));

                    if (!isActive && !isAvailable) {
                        return null;
                    }

                    return (
                        <button
                            key={key}
                            className={`
                                relative px-6 py-3 rounded-lg flex items-center gap-3 transition-all duration-300
                                ${isActive
                                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25'
                                    : isAvailable
                                        ? 'text-gray-400 hover:text-white hover:bg-white/[0.05]'
                                        : 'text-gray-600 cursor-not-allowed opacity-50'
                                }
                            `}
                            onClick={() => {
                                if (!isActive && isAvailable) {
                                    const href = currentCategory
                                        ? `${serviceConfig.href}/${currentCategory}`
                                        : serviceConfig.href;
                                    router.push(href);
                                }
                            }}
                            title={isAvailable ? `Switch to ${serviceConfig.name}` : `${serviceConfig.name} not available for ${currentCategory}`}
                        >
                            <Icon className="w-4 h-4" />
                            <span className="text-sm font-bold uppercase tracking-wider">
                                {serviceConfig.name}
                            </span>
                            {isActive && (
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-lg" />
                            )}
                            {!isAvailable && (
                                <div className="absolute inset-0 bg-gray-500/10 rounded-lg" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default ServiceTypeSwitcher;
