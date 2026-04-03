'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { apiFetch } from '@/lib/api';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Loader2, Package, CheckCircle2, AlertCircle, Terminal, Copy, ArrowLeft, Download, ShieldCheck, Clock, XCircle, Ban, Flag, MessageCircle } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { getProductCategoryLogo } from '@/constants/productCategoryLogos';

function parseDeliveryTimeMs(deliveryTime) {
    if (!deliveryTime) return 0;
    const str = String(deliveryTime).trim().toLowerCase();
    const match = str.match(/^(\d+)\s*(m|min|mins|minute|minutes|h|hr|hrs|hour|hours|d|day|days)$/);
    if (match) {
        const num = parseInt(match[1], 10);
        const unit = match[2];
        if (unit.startsWith('m')) return num * 60 * 1000;
        if (unit.startsWith('h')) return num * 60 * 60 * 1000;
        if (unit.startsWith('d')) return num * 24 * 60 * 60 * 1000;
    }
    const plain = parseInt(str, 10);
    if (!isNaN(plain) && plain > 0) return plain * 60 * 60 * 1000;
    return 0;
}

function formatCountdown(ms) {
    if (ms <= 0) return '0s';
    const totalSeconds = Math.floor(ms / 1000);
    const d = Math.floor(totalSeconds / 86400);
    const h = Math.floor((totalSeconds % 86400) / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    const parts = [];
    if (d > 0) parts.push(`${d}d`);
    if (h > 0) parts.push(`${h}h`);
    if (m > 0) parts.push(`${m}m`);
    parts.push(`${s}s`);
    return parts.join(' ');
}

const DISPUTE_REASONS = [
    { value: 'invalid_credentials', label: 'Invalid login credentials' },
    { value: 'wrong_account', label: 'Wrong account delivered' },
    { value: 'not_as_described', label: 'Product not as described' },
    { value: 'other', label: 'Other' },
];

export default function OrderDetailPage() {
    const { user, loading: authLoading } = useAuth();
    const { formatPrice } = useCurrency();
    const router = useRouter();
    const params = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [cancelLoading, setCancelLoading] = useState(false);
    const [disputeEligibility, setDisputeEligibility] = useState(null);
    const [countdown, setCountdown] = useState(null);
    const [showDisputeModal, setShowDisputeModal] = useState(false);
    const [disputeReason, setDisputeReason] = useState('');
    const [disputeDescription, setDisputeDescription] = useState('');
    const [disputeSubmitting, setDisputeSubmitting] = useState(false);

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

    useEffect(() => {
        if (!order) return;
        const checkEligibility = async () => {
            try {
                const data = await apiFetch(`/tickets/eligibility/${order.id}`);
                setDisputeEligibility(data);
            } catch (err) {
                console.error('Failed to check dispute eligibility:', err);
                // Fallback: client-side eligibility based on order status
                if (['cancelled', 'refunded', 'dispute'].includes(order.status)) {
                    setDisputeEligibility({ eligible: false, reason: 'Not eligible' });
                } else if (order.status === 'delivered') {
                    setDisputeEligibility({ eligible: true, reason: null });
                } else if (order.delivery_mode === 'manual' && order.status === 'pending') {
                    const dtMs = parseDeliveryTimeMs(order.product_snapshot?.delivery_time);
                    if (dtMs > 0) {
                        const expires = new Date(order.created_at).getTime() + dtMs;
                        setDisputeEligibility({ eligible: Date.now() >= expires, reason: Date.now() < expires ? 'Delivery time has not expired' : null });
                    } else {
                        setDisputeEligibility({ eligible: true, reason: null });
                    }
                }
            }
        };
        checkEligibility();
    }, [order]);

    useEffect(() => {
        if (!order || order.delivery_mode !== 'manual' || order.status !== 'pending') {
            setCountdown(null);
            return;
        }
        const deliveryTimeMs = parseDeliveryTimeMs(order.product_snapshot?.delivery_time);
        if (deliveryTimeMs <= 0) {
            setCountdown(null);
            return;
        }
        const orderCreatedAt = new Date(order.created_at).getTime();
        const expiresAt = orderCreatedAt + deliveryTimeMs;
        const tick = () => {
            const remaining = expiresAt - Date.now();
            if (remaining <= 0) {
                setCountdown(null);
                apiFetch(`/tickets/eligibility/${order.id}`).then(data => {
                    setDisputeEligibility(data);
                }).catch(() => {});
                return false;
            }
            setCountdown(remaining);
            return true;
        };
        if (!tick()) return;
        const interval = setInterval(() => {
            if (!tick()) clearInterval(interval);
        }, 1000);
        return () => clearInterval(interval);
    }, [order]);

    const handleOpenDispute = async () => {
        if (!disputeReason) {
            toast.error('Please select a dispute reason');
            return;
        }
        if (!disputeDescription || disputeDescription.trim().length < 10) {
            toast.error('Please provide a description (min 10 characters)');
            return;
        }
        setDisputeSubmitting(true);
        try {
            await apiFetch(`/tickets/open/${order.id}`, {
                method: 'POST',
                body: { reason: disputeReason, description: disputeDescription.trim() }
            });
            toast.success('Dispute opened successfully');
            setShowDisputeModal(false);
            setDisputeReason('');
            setDisputeDescription('');
            const data = await apiFetch(`/orders/${params.id}`);
            const orderData = data.order || data;
            if (data.items) orderData.items = data.items;
            setOrder(orderData);
        } catch (err) {
            toast.error(err.message || 'Failed to open dispute');
        } finally {
            setDisputeSubmitting(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard');
    };

    const hasPendingCancellation = order?.commits?.some(c => c.action === 'cancellation_requested' &&
        !order.commits.some(c2 => (c2.action === 'cancellation_approved' || c2.action === 'cancellation_declined') && new Date(c2.at) > new Date(c.at))
    );

    const canRequestCancel = order && order.status === 'pending' && !hasPendingCancellation;

    const handleRequestCancel = async () => {
        setCancelLoading(true);
        try {
            await apiFetch(`/orders/${order.id}/request-cancel`, {
                method: 'POST',
                body: { reason: cancelReason }
            });
            toast.success('Cancellation request submitted');
            setShowCancelModal(false);
            setCancelReason('');
            // Refresh order data
            const data = await apiFetch(`/orders/${params.id}`);
            const orderData = data.order || data;
            if (data.items) orderData.items = data.items;
            setOrder(orderData);
        } catch (err) {
            toast.error(err.message || 'Failed to submit cancellation request');
        } finally {
            setCancelLoading(false);
        }
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
                    <div className="absolute top-0 right-0 p-8 opacity-[0.07]">
                        {order.product_snapshot?.product_category ? (
                            <img
                                src={getProductCategoryLogo(order.product_snapshot.product_category)}
                                alt=""
                                className="w-40 h-40 object-contain"
                            />
                        ) : (
                            <Package className="w-40 h-40 text-orange-500" />
                        )}
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

                            <div className="flex flex-col items-end gap-3">
                                <div className={`px-6 py-3 rounded-2xl border backdrop-blur-sm ${order.status === 'delivered' ? 'bg-green-500/10 border-green-500/20 text-green-500' :
                                    order.status === 'pending' ? 'bg-orange-500/10 border-orange-500/20 text-orange-500' :
                                    order.status === 'cancelled' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                                        'bg-red-500/10 border-red-500/20 text-red-500'
                                    }`}>
                                    <div className="flex items-center gap-2">
                                        {order.status === 'delivered' ? <CheckCircle2 className="w-5 h-5" /> :
                                            order.status === 'pending' ? <Clock className="w-5 h-5" /> :
                                            order.status === 'cancelled' ? <Ban className="w-5 h-5" /> :
                                                <AlertCircle className="w-5 h-5" />}
                                        <span className="text-sm font-black uppercase tracking-widest">
                                            {order.status || 'Processing'}
                                        </span>
                                    </div>
                                </div>
                                {hasPendingCancellation && (
                                    <div className="px-4 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                        <Clock className="w-3.5 h-3.5" />
                                        Cancellation Pending
                                    </div>
                                )}
                                {canRequestCancel && (
                                    <button
                                        onClick={() => setShowCancelModal(true)}
                                        className="px-5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-black uppercase tracking-widest hover:bg-red-500/20 hover:border-red-500/40 transition-all flex items-center gap-2"
                                    >
                                        <XCircle className="w-4 h-4" />
                                        Request Cancellation
                                    </button>
                                )}
                                {countdown !== null && (() => {
                                    const deliveryTimeMs = parseDeliveryTimeMs(order.product_snapshot?.delivery_time);
                                    const elapsed = deliveryTimeMs - countdown;
                                    const progress = deliveryTimeMs > 0 ? Math.min(100, Math.max(0, (elapsed / deliveryTimeMs) * 100)) : 0;
                                    return (
                                        <div className="px-5 py-3 rounded-xl bg-orange-500/10 border border-orange-500/20 space-y-2 w-full md:w-auto md:min-w-[260px]">
                                            <div className="flex items-center gap-3">
                                                <Clock className="w-4 h-4 text-orange-500 animate-pulse" />
                                                <div className="flex-1">
                                                    <p className="text-[9px] font-black uppercase tracking-widest text-orange-500/70 mb-0.5">Dispute available in</p>
                                                    <p className="text-sm font-black text-orange-400 tracking-wider font-mono">{formatCountdown(countdown)}</p>
                                                </div>
                                            </div>
                                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all duration-1000 ease-linear"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                            <p className="text-[8px] font-bold text-gray-600 text-right">{Math.round(progress)}% elapsed</p>
                                        </div>
                                    );
                                })()}
                                {disputeEligibility?.eligible && countdown === null && (
                                    <button
                                        onClick={() => setShowDisputeModal(true)}
                                        className="px-5 py-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-black uppercase tracking-widest hover:bg-orange-500/20 hover:border-orange-500/40 transition-all flex items-center gap-2"
                                    >
                                        <Flag className="w-4 h-4" />
                                        Open Dispute
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        window.dispatchEvent(new CustomEvent('open-chat', { detail: { orderId: order.id } }));
                                    }}
                                    className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-xs font-black uppercase tracking-widest hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-2"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    Open Chat
                                </button>
                            </div>
                        </div>

                        {/* Order Details Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-6 bg-white/[0.02] rounded-2xl border border-white/5">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">Unit Price</h3>
                                <p className="text-2xl font-black italic tracking-tight">
                                    {formatPrice(order.product_snapshot?.pricing?.unit_price || order.product_snapshot?.price || order.total_price)}
                                </p>
                            </div>
                            <div className="p-6 bg-white/[0.02] rounded-2xl border border-white/5">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">Quantity</h3>
                                <p className="text-2xl font-black italic tracking-tight">{order.quantity || order.product_snapshot?.pricing?.quantity || 1}</p>
                            </div>
                            <div className="p-6 bg-white/[0.02] rounded-2xl border border-white/5">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">Total Paid</h3>
                                <p className="text-2xl font-black italic tracking-tight text-orange-500">{formatPrice(order.total_price || order.price)}</p>
                            </div>
                            <div className="p-6 bg-white/[0.02] rounded-2xl border border-white/5">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">Type</h3>
                                <p className="text-xl font-bold text-gray-300 capitalize">{order.product_snapshot?.type || 'Digital Product'}</p>
                            </div>
                        </div>
                        {/* Pricing Breakdown */}
                        {order.product_snapshot?.pricing && (order.quantity > 1 || order.product_snapshot.pricing.addons_unit_total > 0) && (
                            <div className="mt-4 p-6 bg-white/[0.02] rounded-2xl border border-white/5 space-y-3">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3">Pricing Breakdown</h3>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400 font-bold">Base Price</span>
                                    <span className="text-white font-black">{formatPrice(order.product_snapshot.pricing.base_unit_price)}</span>
                                </div>
                                {order.product_snapshot.pricing.addons_unit_total > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400 font-bold">Addons</span>
                                        <span className="text-white font-black">+{formatPrice(order.product_snapshot.pricing.addons_unit_total)}</span>
                                    </div>
                                )}
                                {order.quantity > 1 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400 font-bold">Unit Price x {order.quantity}</span>
                                        <span className="text-white font-black">{formatPrice(order.product_snapshot.pricing.unit_price)} x {order.quantity}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm pt-3 border-t border-white/5">
                                    <span className="text-gray-300 font-black uppercase tracking-widest text-xs">Total</span>
                                    <span className="text-orange-500 font-black text-lg">{formatPrice(order.product_snapshot.pricing.total_price)}</span>
                                </div>
                            </div>
                        )}
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

                        <div className="space-y-3">
                            {(() => {
                                let items = [];
                                if (typeof deliverables === 'string') {
                                    try {
                                        const parsed = JSON.parse(deliverables);
                                        if (Array.isArray(parsed)) items = parsed;
                                        else items = [deliverables];
                                    } catch {
                                        items = [deliverables];
                                    }
                                } else if (Array.isArray(deliverables)) {
                                    items = deliverables;
                                } else {
                                    items = [JSON.stringify(deliverables, null, 2)];
                                }

                                return items.map((item, idx) => {
                                    const text = typeof item === 'string' ? item : JSON.stringify(item, null, 2);
                                    return (
                                        <div key={idx} className="bg-black border border-white/10 rounded-2xl p-5 flex items-center justify-between gap-4 group hover:border-orange-500/30 transition-all">
                                            <p className="font-mono text-sm text-orange-400 break-all whitespace-pre-wrap flex-1">{text}</p>
                                            <button
                                                onClick={() => copyToClipboard(text)}
                                                className="p-2.5 bg-white/5 hover:bg-orange-500/20 border border-white/10 hover:border-orange-500/30 rounded-xl text-gray-400 hover:text-orange-400 transition-all flex-shrink-0"
                                                title="Copy"
                                            >
                                                <Copy className="w-4 h-4" />
                                            </button>
                                        </div>
                                    );
                                });
                            })()}
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
                                {order.commits.map((commit, idx) => {
                                    const isCancelRequest = commit.action === 'cancellation_requested';
                                    const isCancelApproved = commit.action === 'cancellation_approved';
                                    const isCancelDeclined = commit.action === 'cancellation_declined';
                                    const dotColor = isCancelRequest ? 'bg-yellow-500' :
                                        isCancelApproved ? 'bg-green-500' :
                                        isCancelDeclined ? 'bg-red-500' :
                                        idx === 0 ? 'bg-orange-500' : 'bg-gray-700';

                                    return (
                                        <div key={idx} className="relative pl-10">
                                            <div className={`absolute left-0 top-1 w-7 h-7 rounded-full border-4 border-[#0a0a0a] ${dotColor}`} />
                                            <p className={`text-sm font-bold mb-1 capitalize ${
                                                isCancelRequest ? 'text-yellow-400' :
                                                isCancelApproved ? 'text-green-400' :
                                                isCancelDeclined ? 'text-red-400' : 'text-white'
                                            }`}>
                                                {commit.message || commit.action?.replace(/_/g, ' ') || 'Update'}
                                            </p>
                                            {commit.reason && (
                                                <p className="text-xs text-gray-400 mb-1 italic">
                                                    Reason: {commit.reason}
                                                </p>
                                            )}
                                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                                <span>{new Date(commit.at).toLocaleString()}</span>
                                                <span>•</span>
                                                <span>{commit.by}</span>
                                            </div>
                                        </div>
                                    );
                                })}
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

            {/* Cancel Request Modal */}
            {showCancelModal && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4"
                    onClick={() => setShowCancelModal(false)}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-red-500/10 rounded-xl">
                                <XCircle className="w-6 h-6 text-red-500" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black italic uppercase tracking-tighter">Request Cancellation</h3>
                                <p className="text-xs text-gray-500 font-bold">Order #{order.id}</p>
                            </div>
                        </div>

                        <p className="text-sm text-gray-400 mb-4">
                            Your cancellation request will be sent to the admin for review. You will be notified once it is approved or declined.
                        </p>

                        <div className="mb-6">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Reason (optional)</label>
                            <textarea
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                                placeholder="Tell us why you want to cancel this order..."
                                rows={3}
                                className="w-full bg-black border border-white/10 rounded-xl p-4 text-white text-sm placeholder:text-gray-600 outline-none focus:border-red-500/50 resize-none transition-all"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowCancelModal(false)}
                                className="flex-1 py-3 px-6 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
                            >
                                Go Back
                            </button>
                            <button
                                onClick={handleRequestCancel}
                                disabled={cancelLoading}
                                className="flex-1 py-3 px-6 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-bold uppercase tracking-widest hover:bg-red-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {cancelLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                                {cancelLoading ? 'Submitting...' : 'Request Cancel'}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}

            {showDisputeModal && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4"
                    onClick={() => setShowDisputeModal(false)}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-orange-500/10 rounded-xl">
                                <Flag className="w-6 h-6 text-orange-500" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black italic uppercase tracking-tighter">Open Dispute</h3>
                                <p className="text-xs text-gray-500 font-bold">Order #{order.id}</p>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Dispute Reason</label>
                            <select
                                value={disputeReason}
                                onChange={(e) => setDisputeReason(e.target.value)}
                                className="w-full bg-black border border-white/10 rounded-xl p-4 text-white text-sm outline-none focus:border-orange-500/50 transition-all appearance-none cursor-pointer"
                            >
                                <option value="" disabled>Select a reason...</option>
                                {DISPUTE_REASONS.map(r => (
                                    <option key={r.value} value={r.value}>{r.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-6">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Description</label>
                            <textarea
                                value={disputeDescription}
                                onChange={(e) => setDisputeDescription(e.target.value)}
                                placeholder="Describe the issue in detail..."
                                rows={4}
                                className="w-full bg-black border border-white/10 rounded-xl p-4 text-white text-sm placeholder:text-gray-600 outline-none focus:border-orange-500/50 resize-none transition-all"
                            />
                            <p className="text-[10px] text-gray-600 mt-1 font-bold">Minimum 10 characters{disputeReason === 'other' ? ' (20 for "Other")' : ''}</p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDisputeModal(false)}
                                className="flex-1 py-3 px-6 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleOpenDispute}
                                disabled={disputeSubmitting}
                                className="flex-1 py-3 px-6 rounded-xl bg-orange-500/20 border border-orange-500/30 text-orange-400 text-sm font-bold uppercase tracking-widest hover:bg-orange-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {disputeSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Flag className="w-4 h-4" />}
                                {disputeSubmitting ? 'Submitting...' : 'Open Dispute'}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
}
