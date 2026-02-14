'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { apiFetch } from '@/lib/api';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, Flag, ChevronRight, MessageSquare, CheckCircle2, Lock, AlertCircle } from 'lucide-react';

const STATUS_CONFIG = {
    open: { label: 'Open', color: 'text-orange-500', bg: 'bg-orange-500/10 border-orange-500/20', icon: Flag },
    resolved: { label: 'Resolved', color: 'text-green-500', bg: 'bg-green-500/10 border-green-500/20', icon: CheckCircle2 },
    closed: { label: 'Closed', color: 'text-gray-500', bg: 'bg-white/5 border-white/10', icon: Lock },
};

const REASON_LABELS = {
    invalid_credentials: 'Invalid Credentials',
    wrong_account: 'Wrong Account',
    not_as_described: 'Not As Described',
    other: 'Other',
};

export default function TicketsPage() {
    const { user, loading: authLoading } = useAuth();
    const { formatPrice } = useCurrency();
    const router = useRouter();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login?next=/ticket');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (!user) return;
        const fetchTickets = async () => {
            setLoading(true);
            try {
                const url = statusFilter ? `/tickets?status=${statusFilter}` : '/tickets';
                const data = await apiFetch(url);
                setTickets(data.tickets || []);
            } catch (err) {
                console.error('Failed to fetch tickets:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchTickets();
    }, [user, statusFilter]);

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
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-6xl font-black italic tracking-tighter uppercase mb-3 leading-none">
                            MY <span className="text-orange-500">DISPUTES</span>
                        </h1>
                        <p className="text-gray-400 text-lg max-w-2xl font-medium leading-relaxed">
                            Track and manage your order disputes.
                        </p>
                    </div>
                </div>

                {/* Status Filter */}
                <div className="flex gap-2 mb-8 flex-wrap">
                    {[
                        { value: '', label: 'All' },
                        { value: 'open', label: 'Open' },
                        { value: 'resolved', label: 'Resolved' },
                        { value: 'closed', label: 'Closed' },
                    ].map(f => (
                        <button
                            key={f.value}
                            onClick={() => setStatusFilter(f.value)}
                            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${
                                statusFilter === f.value
                                    ? 'bg-orange-500/15 border-orange-500/30 text-orange-400'
                                    : 'bg-white/[0.02] border-white/5 text-gray-500 hover:border-white/10 hover:text-gray-300'
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* Tickets List */}
                {tickets.length > 0 ? (
                    <div className="grid gap-4">
                        {tickets.map((ticket, idx) => {
                            const cfg = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.open;
                            const StatusIcon = cfg.icon;
                            const snapshot = ticket.order?.product_snapshot;
                            const title = snapshot?.title || `Order #${ticket.order_id}`;

                            return (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.04 }}
                                    key={ticket.id}
                                >
                                    <Link
                                        href={`/ticket/${ticket.id}`}
                                        className="group block bg-[#0a0a0a] border border-white/5 rounded-3xl p-6 hover:border-orange-500/30 transition-all hover:bg-white/[0.02]"
                                    >
                                        <div className="flex flex-col md:flex-row items-center gap-5">
                                            {/* Icon */}
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 border ${cfg.bg}`}>
                                                <StatusIcon className={`w-6 h-6 ${cfg.color}`} />
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 text-center md:text-left min-w-0">
                                                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                                                        Ticket #{ticket.id}
                                                    </span>
                                                    <span className="hidden md:inline text-gray-700">•</span>
                                                    <span className="text-[10px] font-bold text-gray-400">
                                                        Order #{ticket.order_id}
                                                    </span>
                                                    <span className="hidden md:inline text-gray-700">•</span>
                                                    <span className="text-[10px] font-bold text-gray-400">
                                                        {new Date(ticket.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <h3 className="text-lg font-black italic uppercase tracking-tighter group-hover:text-orange-500 transition-colors truncate">
                                                    {title}
                                                </h3>
                                                <p className="text-xs text-gray-500 font-bold mt-0.5">
                                                    {REASON_LABELS[ticket.reason] || ticket.reason}
                                                </p>
                                            </div>

                                            {/* Status + Unread */}
                                            <div className="flex flex-col items-end gap-2">
                                                <div className={`px-4 py-2 rounded-xl border ${cfg.bg}`}>
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${cfg.color}`}>
                                                        {cfg.label}
                                                    </span>
                                                </div>
                                                {ticket.unread_count > 0 && (
                                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20">
                                                        <MessageSquare className="w-3 h-3 text-orange-500" />
                                                        <span className="text-[10px] font-black text-orange-400">
                                                            {ticket.unread_count} new
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Price */}
                                            <div className="text-right">
                                                <p className="text-lg font-black tracking-tight">
                                                    {formatPrice(ticket.order?.total_price)}
                                                </p>
                                            </div>

                                            <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-40 text-center bg-[#0a0a0a] border border-dashed border-white/10 rounded-[3rem]">
                        <Flag className="w-12 h-12 text-gray-700 mx-auto mb-6" />
                        <h3 className="text-2xl font-black italic uppercase tracking-tighter text-gray-500">No Disputes Found</h3>
                        <p className="text-gray-600 mt-2">
                            {statusFilter ? `No ${statusFilter} disputes.` : "You haven't opened any disputes yet."}
                        </p>
                        <Link href="/orders" className="inline-block mt-8 px-8 py-3 bg-orange-600 text-white font-bold uppercase rounded-xl hover:bg-orange-500 transition-colors">
                            View Orders
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
