import React from 'react';
import { serviceConfigs } from '@/constants/servicesConfig';
import ProductDetail from '@/components/Services/ProductDetail';

async function getProduct(category, type, slug) {
    const normalizedType = type.toLowerCase();
    const normalizedCategory = category.toLowerCase();

    try {
        // Attempt 1: Direct ID endpoint
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/${slug}`, {
            cache: 'no-store'
        });

        if (res.ok) {
            const data = await res.json();
            return data.product || data;
        }

        // Attempt 2: Fallback to category fetch and find (less efficient but safe)
        const catRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/${normalizedCategory}/${normalizedType}`, {
            cache: 'no-store'
        });

        if (catRes.ok) {
            const catData = await catRes.json();
            const products = catData.products || [];
            return products.find(p => p.slug === slug || p.id === slug);
        }

        return null;
    } catch (err) {
        console.error("Failed to fetch product:", err);
        return null;
    }
}

export async function generateMetadata({ params }) {
    const { type, category, slug } = await params;
    const product = await getProduct(category, type, slug);

    return {
        title: product ? `${product.title} | ARKD Marketplace` : 'Product Detail | ARKD',
        description: product ? product.description : 'View details for this premium gaming service.',
    };
}

export default async function SingleProductPage({ params }) {
    const { type, category, slug } = await params;
    const product = await getProduct(category, type, slug);

    if (!product) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-black italic uppercase italic">Product Not Found</h1>
                    <p className="text-gray-500">The product you are looking for does not exist or has been removed.</p>
                </div>
            </div>
        );
    }

    return (
        <ProductDetail
            product={product}
            type={type}
            category={category}
        />
    );
}
