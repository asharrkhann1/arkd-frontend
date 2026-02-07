'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { apiFetch } from '@/lib/api';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Loader2, Package, CheckCircle2, AlertCircle, Terminal, Copy, ArrowLeft, Download, ShieldCheck, Clock } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';

export default function OrderDetailPage() {
    const { user, loading: authLoading } = useAuth();
    const { formatPrice } = useCurrency();
    const router = useRouter();
    const params = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push(`/login?next=/orders/${params.id}`);
        }
    }, [user, authLoading, router, params.id]);

    useEffect(() => {
        if (!user || !params.id) return;

        const fetchOrder = async () => {
            try {
                const data = await apiFetch(`/orders/${params.id}`);
                const orderData = data.order || data;

                if (!orderData) throw new Error('Order not found');

                // Attach items if they exist in the root response
                if (data.items) {
                    orderData.items = data.items;
                }

                // Client-side ownership check (redundant if API is secure, but requested)
                if (orderData.user_id && orderData.user_id !== user.id) {
                    throw new Error('Unauthorized access to this order');
                }

                setOrder(orderData);
            } catch (err) {
                console.error('Failed to fetch order:', err);
                setError(err.message || 'Failed to load order');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [user, params.id]);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard');
    };

    if (authLoading || (loading && user)) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
            </div>
        );
    }

    if (!user) return null;

    if (error) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
                <AlertCircle className="w-16 h-16 text-red-500 mb-6" />
                <h1 className="text-3xl font-black italic uppercase tracking-tighter mb-2">Access Denied</h1>
                <p className="text-gray-500 mb-8">{error}</p>
                <Link href="/orders" className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold uppercase tracking-widest transition-all">
                    Back to Orders
                </Link>
            </div>
        );
    }

    if (!order) return null;

    let deliverables = order.delivery_data || order.credentials || order.keys;

    // Check items for delivered data if main order doesn't have it
    if (!deliverables && order.items && Array.isArray(order.items)) {
        // Collect all delivered data
        const itemsData = order.items
            .filter(item => item.delivered_data)
            .map(item => item.delivered_data);

        if (itemsData.length > 0) {
            // If explicit single item, use it directly, otherwise array
            deliverables = itemsData.length === 1 ? itemsData[0] : itemsData;
        }
    }

    const hasDeliverables = deliverables && (typeof deliverables === 'string' || Object.keys(deliverables).length > 0);

    return (
        <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <Link href="/orders" className="inline-flex items-center gap-2 text-gray-500 hover:text-white mb-8 transition-colors text-sm font-bold uppercase tracking-widest">
                    <ArrowLeft className="w-4 h-4" /> Back to Orders
                </Link>

                {/* Header Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-8 md:p-12 mb-8 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Package className="w-40 h-40 text-orange-500" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                        Order #{order.id}
                                    </span>
                                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white mb-2">
                                    {order.product_snapshot?.title || 'Digital Asset'}
                                </h1>
                                <p className="text-gray-500 font-medium">
                                    {order.product_snapshot?.product_category || 'Service'}
                                </p>
                            </div>

                            <div className={`px-6 py-3 rounded-2xl border backdrop-blur-sm ${order.status === 'completed' ? 'bg-green-500/10 border-green-500/20 text-green-500' :
                                order.status === 'pending' ? 'bg-orange-500/10 border-orange-500/20 text-orange-500' :
                                    'bg-red-500/10 border-red-500/20 text-red-500'
                                }`}>
                                <div className="flex items-center gap-2">
                                    {order.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> :
                                        order.status === 'pending' ? <Clock className="w-5 h-5" /> :
                                            <AlertCircle className="w-5 h-5" />}
                                    <span className="text-sm font-black uppercase tracking-widest">
                                        {order.status || 'Processing'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Order Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-6 bg-white/[0.02] rounded-2xl border border-white/5">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">Amount Paid</h3>
                                <p className="text-2xl font-black italic tracking-tight">{formatPrice(order.total_price || order.price)}</p>
                            </div>
                            <div className="p-6 bg-white/[0.02] rounded-2xl border border-white/5">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">Quantity</h3>
                                <p className="text-2xl font-black italic tracking-tight">{order.quantity || 1}</p>
                            </div>
                            <div className="p-6 bg-white/[0.02] rounded-2xl border border-white/5">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">Type</h3>
                                <p className="text-xl font-bold text-gray-300 capitalize">{order.product_snapshot?.type || 'Digital Product'}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Deliverables Section (Keys/Accounts) */}
                {hasDeliverables && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-[#0a0a0a] border border-green-500/20 rounded-[3rem] p-8 md:p-12 mb-8 relative overflow-hidden"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-green-500/10 rounded-xl text-green-500">
                                <Terminal className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black italic uppercase tracking-tighter">Access Credentials</h2>
                                <p className="text-sm text-gray-500 font-bold">Your secure delivery data</p>
                            </div>
                        </div>

                        <div className="bg-black border border-white/10 rounded-2xl p-6 font-mono text-sm relative group">
                            <button
                                onClick={() => copyToClipboard(typeof deliverables === 'string' ? deliverables : JSON.stringify(deliverables, null, 2))}
                                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg text-gray-400 hover:text-white transition-colors"
                            >
                                <Copy className="w-4 h-4" />
                            </button>
                            <pre className="text-green-400 overflow-x-auto whitespace-pre-wrap break-all">
                                {typeof deliverables === 'string' ? deliverables : JSON.stringify(deliverables, null, 2)}
                            </pre>
                        </div>

                        <div className="mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                            <ShieldCheck className="w-4 h-4" />
                            <span>This data is encrypted and only visible to you.</span>
                        </div>
                    </motion.div>
                )}

                {/* Addons Section */}
                {(order.product_snapshot?.selected_addons?.length > 0 || (order.addons && Object.keys(order.addons).length > 0)) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-8 md:p-12"
                    >
                        <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-6">Selected Addons</h2>
                        <div className="space-y-4">
                            {order.product_snapshot?.selected_addons ? (
                                order.product_snapshot.selected_addons.map((addon, idx) => (
                                    <div key={idx} className="flex justify-between items-center p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                                        <span className="font-bold uppercase tracking-tight text-gray-300">{addon.group.replace('_', ' ')}</span>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-bold text-gray-500 uppercase">{formatPrice(addon.price)}</span>
                                            <span className="px-3 py-1 bg-white/5 rounded-lg text-xs font-mono text-orange-500">{addon.value}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                Object.entries(order.addons).map(([key, value]) => (
                                    <div key={key} className="flex justify-between items-center p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                                        <span className="font-bold uppercase tracking-tight text-gray-300">{key.replace('_', ' ')}</span>
                                        <span className="px-3 py-1 bg-white/5 rounded-lg text-xs font-mono text-orange-500">{value}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Order History & Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                    {/* Timeline */}
                    {order.commits && order.commits.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-8 md:p-12 h-full"
                        >
                            <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-8 flex items-center gap-3">
                                <Clock className="w-6 h-6 text-gray-500" />
                                Order History
                            </h2>
                            <div className="space-y-8 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
                                {order.commits.map((commit, idx) => (
                                    <div key={idx} className="relative pl-10">
                                        <div className={`absolute left-0 top-1 w-7 h-7 rounded-full border-4 border-[#0a0a0a] ${idx === 0 ? 'bg-orange-500' : 'bg-gray-700'}`} />
                                        <p className="text-sm font-bold text-white mb-1 capitalize">
                                            {commit.message || commit.action?.replace(/_/g, ' ') || 'Update'}
                                        </p>
                                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                            <span>{new Date(commit.at).toLocaleString()}</span>
                                            <span>•</span>
                                            <span>{commit.by}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Additional Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                        className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-8 md:p-12 h-full"
                    >
                        <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-8 flex items-center gap-3">
                            <Package className="w-6 h-6 text-gray-500" />
                            Order Info
                        </h2>
                        <div className="space-y-4">
                            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex justify-between items-center">
                                <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Delivery Mode</span>
                                <span className="text-sm font-black text-white uppercase">{order.delivery_mode || 'Manual'}</span>
                            </div>
                            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex justify-between items-center">
                                <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Items Count</span>
                                <span className="text-sm font-black text-white uppercase">{order.items?.length || 0} Items</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
