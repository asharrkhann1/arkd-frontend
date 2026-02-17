'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useSearchParams } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import {
    Wallet,
    Plus,
    History,
    ArrowUpRight,
    ArrowDownLeft,
    ChevronRight,
    ShieldCheck,
    Zap,
    AlertCircle,
    CheckCircle2,
    Clock,
    XCircle,
    X,
    Loader2,
    RefreshCw,
    ExternalLink,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_MAP = {
    completed: { color: 'text-green-500', bg: 'bg-green-500', icon: CheckCircle2, label: 'Completed' },
    pending: { color: 'text-yellow-500', bg: 'bg-yellow-500', icon: Clock, label: 'Pending' },
    failed: { color: 'text-red-500', bg: 'bg-red-500', icon: XCircle, label: 'Failed' },
};

const TYPE_MAP = {
    topup: { icon: ArrowUpRight, color: 'text-green-500', label: 'Top Up', sign: '+' },
    purchase: { icon: ArrowDownLeft, color: 'text-red-400', label: 'Purchase', sign: '-' },
    refund: { icon: ArrowUpRight, color: 'text-blue-400', label: 'Refund', sign: '+' },
    admin: { icon: ArrowUpRight, color: 'text-purple-400', label: 'Admin', sign: '+' },
};

function fmtDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
        ' ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export default function WalletPage() {
    const { user, refreshMe } = useAuth();
    const { formatPrice } = useCurrency();
    const searchParams = useSearchParams();

    const [showTopUp, setShowTopUp] = useState(false);
    const [selectedAmount, setSelectedAmount] = useState(null);
    const [customAmount, setCustomAmount] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const [transactions, setTransactions] = useState([]);
    const [txLoading, setTxLoading] = useState(true);

    const presets = [5, 10, 25, 50, 100];
    const finalAmount = customAmount ? parseFloat(customAmount) : (selectedAmount || 0);
    const taxFee = finalAmount * 0.05; // 5% tax
    const totalWithTax = finalAmount + taxFee;

    const fetchTransactions = useCallback(async () => {
        try {
            setTxLoading(true);
            const data = await apiFetch('/payment/transactions');
            setTransactions(data.transactions || []);
        } catch {
            // silent
        } finally {
            setTxLoading(false);
        }
    }, []);

    useEffect(() => {
        if (user) fetchTransactions();
    }, [user, fetchTransactions]);

    // Handle redirect from Lemon Squeezy
    useEffect(() => {
        const status = searchParams ? searchParams.get('status') : null;
        if (status === 'success') {
            setSuccessMsg('Payment successful! Your credits will be added shortly.');
            refreshMe();
            fetchTransactions();
            // Clean URL
            window.history.replaceState({}, '', '/wallet');
        }
    }, [searchParams, refreshMe, fetchTransactions]);

    const handleCheckout = async () => {
        if (!finalAmount || finalAmount < 1 || finalAmount > 1000) {
            setError('Amount must be between $1 and $1,000 (before tax)');
            return;
        }

        setError('');
        setIsProcessing(true);

        try {
            const data = await apiFetch('/payment/checkout', {
                method: 'POST',
                body: { amount: totalWithTax },
            });

            if (data.checkoutUrl) {
                window.location.href = data.checkoutUrl;
            }
        } catch (err) {
            setError(err.message || 'Failed to create checkout');
        } finally {
            setIsProcessing(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4">
                <div className="text-center space-y-4">
                    <AlertCircle className="w-16 h-16 text-orange-500 mx-auto" />
                    <h1 className="text-2xl font-black text-white italic uppercase">Session Expired</h1>
                    <p className="text-gray-500">Please login to manage your wallet.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-12">

                {/* Success Banner */}
                <AnimatePresence>
                    {successMsg && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4 flex items-center justify-between"
                        >
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                                <span className="text-green-400 font-bold text-sm">{successMsg}</span>
                            </div>
                            <button onClick={() => setSuccessMsg('')} className="text-green-500/60 hover:text-green-400">
                                <X className="w-4 h-4" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 mb-2">
                            <Wallet className="w-4 h-4" /> Financial Overview
                        </div>
                        <h1 className="text-6xl font-black italic uppercase tracking-tighter leading-none">
                            My <span className="text-orange-500">Wallet</span>
                        </h1>
                        <p className="text-gray-500 font-medium">Manage your balance and view transaction history.</p>
                    </div>

                    <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-[2.5rem] flex items-center gap-8 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-3xl rounded-full" />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Available Balance</p>
                            <p className="text-4xl font-black italic text-white tracking-tighter">{formatPrice(user.credits || 0)}</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center border border-orange-500/20 group-hover:scale-110 transition-transform">
                            <Zap className="w-6 h-6 text-orange-500 fill-current" />
                        </div>
                    </div>
                </div>

                {/* Top Up Button */}
                <div>
                    <button
                        onClick={() => { setShowTopUp(true); setError(''); setSuccessMsg(''); }}
                        className="py-5 px-10 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-black italic uppercase tracking-widest text-sm transition-all shadow-2xl flex items-center gap-3 group"
                    >
                        <Plus className="w-5 h-5" /> Top Up Balance
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                {/* Transaction History */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black italic uppercase tracking-tight flex items-center gap-3">
                            <History className="w-6 h-6 text-orange-500" /> Transaction History
                        </h2>
                        <button
                            onClick={fetchTransactions}
                            className="text-gray-500 hover:text-white transition-colors p-2"
                        >
                            <RefreshCw className={`w-4 h-4 ${txLoading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>

                    {txLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className="text-center py-20 space-y-4">
                            <Wallet className="w-12 h-12 text-gray-700 mx-auto" />
                            <p className="text-gray-600 font-bold">No transactions yet</p>
                            <p className="text-gray-700 text-sm">Top up your wallet to get started.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {transactions.map((tx) => {
                                const typeInfo = TYPE_MAP[tx.type] || TYPE_MAP.topup;
                                const statusInfo = STATUS_MAP[tx.status] || STATUS_MAP.pending;
                                const TxIcon = typeInfo.icon;
                                const StatusIcon = statusInfo.icon;
                                const amountUsd = tx.amount_cents / 100;

                                return (
                                    <div
                                        key={tx.id}
                                        className="group bg-[#0a0a0a] border border-white/5 rounded-2xl p-5 hover:border-orange-500/20 transition-all flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <TxIcon className={`w-5 h-5 ${typeInfo.color}`} />
                                            </div>
                                            <div>
                                                <p className="text-white font-black italic uppercase tracking-tight text-sm">{typeInfo.label}</p>
                                                <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{fmtDate(tx.created_at)}</p>
                                                {tx.provider_order_id && (
                                                    <p className="text-[10px] text-orange-500/70 font-mono uppercase tracking-widest mt-1">
                                                        Order: {tx.provider_order_id.substring(0, 8)}...
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right flex items-center gap-4">
                                            <div>
                                                <p className={`text-lg font-black italic ${typeInfo.color}`}>
                                                    {typeInfo.sign}{formatPrice(amountUsd)}
                                                </p>
                                                <p className="text-[10px] text-gray-600 font-bold">{tx.credits} credits</p>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <StatusIcon className={`w-3.5 h-3.5 ${statusInfo.color}`} />
                                                <span className={`text-[9px] font-black uppercase tracking-[0.15em] ${statusInfo.color}`}>
                                                    {statusInfo.label}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Top Up Overlay */}
            <AnimatePresence>
                {showTopUp && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={(e) => { if (e.target === e.currentTarget) setShowTopUp(false); }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 md:p-10 w-full max-w-lg space-y-8 shadow-2xl relative"
                        >
                            {/* Close */}
                            <button
                                onClick={() => setShowTopUp(false)}
                                className="absolute top-6 right-6 text-gray-600 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Title */}
                            <div>
                                <h2 className="text-2xl font-black italic uppercase tracking-tight flex items-center gap-3">
                                    <Plus className="w-6 h-6 text-orange-500" /> Top Up Credits
                                </h2>
                                <p className="text-gray-600 text-sm mt-1">$1 = 1 Credit (before 5% tax). Min $1, Max $1,000.</p>
                            </div>

                            {/* Preset Amounts */}
                            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                                {presets.map((amt) => (
                                    <button
                                        key={amt}
                                        onClick={() => { setSelectedAmount(amt); setCustomAmount(''); setError(''); }}
                                        className={`py-4 rounded-xl font-black italic text-lg transition-all border ${
                                            selectedAmount === amt && !customAmount
                                                ? 'bg-orange-600 border-orange-500 text-white shadow-[0_8px_16px_rgba(234,88,12,0.3)]'
                                                : 'bg-white/[0.02] border-white/5 text-gray-400 hover:bg-white/[0.05] hover:text-white'
                                        }`}
                                    >
                                        ${amt}
                                    </button>
                                ))}
                            </div>

                            {/* Custom Amount */}
                            <div className="space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Custom Amount</p>
                                <div className="relative">
                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl font-black italic text-orange-500">$</span>
                                    <input
                                        type="number"
                                        min="1"
                                        max="1000"
                                        step="1"
                                        value={customAmount}
                                        onChange={(e) => {
                                            setCustomAmount(e.target.value);
                                            setSelectedAmount(null);
                                            setError('');
                                        }}
                                        placeholder="Enter amount"
                                        className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-4 pl-10 pr-6 text-xl font-black italic text-white placeholder:text-gray-800 focus:border-orange-500/50 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Summary */}
                            {finalAmount > 0 && (
                                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5 space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500 font-bold">Amount</span>
                                        <span className="font-black italic text-white">${finalAmount.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500 font-bold">Tax (5%)</span>
                                        <span className="font-black italic text-yellow-400">${taxFee.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500 font-bold">Credits</span>
                                        <span className="font-black italic text-orange-400">{finalAmount} credits</span>
                                    </div>
                                    <div className="pt-3 border-t border-white/5 flex justify-between items-center">
                                        <span className="font-black italic uppercase text-sm">Total</span>
                                        <span className="text-2xl font-black italic text-orange-500">${totalWithTax.toFixed(2)}</span>
                                    </div>
                                </div>
                            )}

                            {/* Error */}
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                                    <span className="text-red-400 text-sm font-bold">{error}</span>
                                </div>
                            )}

                            {/* Checkout Button */}
                            <button
                                onClick={handleCheckout}
                                disabled={!finalAmount || finalAmount < 1 || isProcessing}
                                className="w-full py-5 bg-orange-600 hover:bg-orange-500 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-2xl font-black italic uppercase tracking-widest text-base transition-all shadow-2xl flex items-center justify-center gap-3"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                                    </>
                                ) : (
                                    <>
                                        <ExternalLink className="w-5 h-5" /> Pay with Lemon Squeezy
                                    </>
                                )}
                            </button>

                            <div className="flex items-center justify-center gap-3 text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                                <ShieldCheck className="w-3.5 h-3.5 text-green-500/60" /> Secure checkout powered by Lemon Squeezy
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
