'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { apiFetch } from '@/lib/api';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Loader2, Package, Clock, ChevronRight, Search, Filter } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function OrdersPage() {
    const { user, loading: authLoading } = useAuth();
    const { formatPrice } = useCurrency();
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login?next=/orders');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (!user) return;

        const fetchOrders = async () => {
            try {
                // Assuming endpoint to get user's orders
                const data = await apiFetch('/orders/me');
                // Adjust based on actual API response structure (data or data.orders)
                const ordersList = Array.isArray(data) ? data : (data.orders || []);
                setOrders(ordersList);
            } catch (error) {
                console.error('Failed to fetch orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    const filteredOrders = orders.filter(order =>
        (order.id && order.id.toString().includes(searchQuery)) ||
        (order.product_snapshot?.title && order.product_snapshot.title.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (authLoading || (loading && user)) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-6xl font-black italic tracking-tighter uppercase mb-3 leading-none">
                            MY <span className="text-orange-500">ORDERS</span>
                        </h1>
                        <p className="text-gray-400 text-lg max-w-2xl font-medium leading-relaxed">
                            Track your purchases and access your digital assets.
                        </p>
                    </div>
                </div>

                {/* Search & Filters */}
                <div className="mb-8 relative max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search by Order ID or Product..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white text-sm focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 outline-none transition-all shadow-inner"
                    />
                </div>

                {/* Orders List */}
                {filteredOrders.length > 0 ? (
                    <div className="grid gap-4">
                        {filteredOrders.map((order, idx) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                key={order.id}
                            >
                                <Link href={`/orders/${order.id}`} className="group block bg-[#0a0a0a] border border-white/5 rounded-3xl p-6 hover:border-orange-500/30 transition-all hover:bg-white/[0.02]">
                                    <div className="flex flex-col md:flex-row items-center gap-6">
                                        {/* Icon/Image Placeholder */}
                                        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                            <Package className="w-8 h-8 text-gray-600 group-hover:text-orange-500 transition-colors" />
                                        </div>

                                        {/* info */}
                                        <div className="flex-1 text-center md:text-left">
                                            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                                                    #{order.id}
                                                </span>
                                                <span className="hidden md:inline text-gray-700">•</span>
                                                <span className="text-[10px] font-bold text-gray-400">
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-black italic uppercase tracking-tighter group-hover:text-orange-500 transition-colors">
                                                {order.product_snapshot?.title || `Order #${order.id}`}
                                            </h3>
                                        </div>

                                        {/* Status */}
                                        <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/5">
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${order.status === 'completed' ? 'text-green-500' :
                                                order.status === 'pending' ? 'text-orange-500' :
                                                    order.status === 'cancelled' ? 'text-red-500' :
                                                        'text-gray-400'
                                                }`}>
                                                {order.status || 'Pending'}
                                            </span>
                                        </div>

                                        {/* Price */}
                                        <div className="text-right">
                                            <p className="text-xl font-black tracking-tight">{formatPrice(order.total_price || order.price)}</p>
                                        </div>

                                        <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="py-40 text-center bg-[#0a0a0a] border border-dashed border-white/10 rounded-[3rem]">
                        <Package className="w-12 h-12 text-gray-700 mx-auto mb-6" />
                        <h3 className="text-2xl font-black italic uppercase tracking-tighter text-gray-500">No Orders Found</h3>
                        <p className="text-gray-600 mt-2">You haven't placed any orders yet.</p>
                        <Link href="/services" className="inline-block mt-8 px-8 py-3 bg-orange-600 text-white font-bold uppercase rounded-xl hover:bg-orange-500 transition-colors">
                            Browse Services
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
