'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    Loader2,
    CheckCircle2,
    CalendarDays,
    Wallet,
    ClipboardList,
    Heart,
    MessageCircle,
    Settings,
    Crown,
    LogOut,
    Sparkles,
    AlertTriangle,
    Check,
    X,
} from 'lucide-react';

const quickActions = [
    { label: 'Wallet', icon: Wallet, href: '/wallet', color: 'orange' },
    { label: 'Orders', icon: ClipboardList, href: '/orders', color: 'blue' },
    { label: 'Library', icon: Heart, href: '/wishlist', color: 'pink' },
    { label: 'Chat', icon: MessageCircle, href: null, color: 'green', action: 'chat' },
    { label: 'Settings', icon: Settings, href: '/settings', color: 'purple' },
];

const colorMap = {
    orange: { border: 'border-orange-500/60', text: 'text-orange-400', bg: 'bg-orange-500/10', hover: 'hover:bg-orange-500/20' },
    blue: { border: 'border-blue-500/60', text: 'text-blue-400', bg: 'bg-blue-500/10', hover: 'hover:bg-blue-500/20' },
    pink: { border: 'border-pink-500/60', text: 'text-pink-400', bg: 'bg-pink-500/10', hover: 'hover:bg-pink-500/20' },
    green: { border: 'border-green-500/60', text: 'text-green-400', bg: 'bg-green-500/10', hover: 'hover:bg-green-500/20' },
    purple: { border: 'border-purple-500/60', text: 'text-purple-400', bg: 'bg-purple-500/10', hover: 'hover:bg-purple-500/20' },
};

export default function ProfilePage() {
    const { user, loading, logout, requestAccountVerify, confirmAccountVerify } = useAuth();
    const { formatPrice } = useCurrency();
    const router = useRouter();

    // Verification state
    const [verifyOtp, setVerifyOtp] = useState('');
    const [verifyStep, setVerifyStep] = useState(1); // 1 = request, 2 = verify
    const [verifyLoading, setVerifyLoading] = useState(false);
    const [verifyMsg, setVerifyMsg] = useState({ type: '', text: '' });

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login?next=/profile');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
            </div>
        );
    }

    if (!user) return null;

    const initials = (user.username || user.email || '?').slice(0, 2).toUpperCase();
    const memberSince = user.created_at
        ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        : 'N/A';

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    const handleQuickAction = (item) => {
        if (item.action === 'chat') {
            window.openChat?.();
            return;
        }
        if (item.href) router.push(item.href);
    };

    const handleRequestVerifyOtp = async () => {
        setVerifyMsg({ type: '', text: '' });
        setVerifyLoading(true);
        try {
            await requestAccountVerify();
            setVerifyMsg({ type: 'success', text: 'Verification code sent to your email' });
            setVerifyStep(2);
        } catch (err) {
            setVerifyMsg({ type: 'error', text: err.message });
        } finally {
            setVerifyLoading(false);
        }
    };

    const handleConfirmVerify = async () => {
        setVerifyMsg({ type: '', text: '' });
        if (!verifyOtp.trim()) {
            setVerifyMsg({ type: 'error', text: 'Enter the verification code' });
            return;
        }
        setVerifyLoading(true);
        try {
            await confirmAccountVerify({ otp: verifyOtp.trim() });
            setVerifyMsg({ type: 'success', text: 'Account verified successfully!' });
            setVerifyOtp('');
            setVerifyStep(1);
        } catch (err) {
            setVerifyMsg({ type: 'error', text: err.message });
        } finally {
            setVerifyLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white py-10 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
            {/* Background gradient orbs */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-3xl mx-auto space-y-6 relative z-10">

                {/* ─── Verification Banner ─────────────────────────────── */}
                {!user.is_verified && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-2xl border border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 backdrop-blur-xl p-5 sm:p-6 shadow-[0_0_40px_rgba(0,0,0,0.3)]"
                    >
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <h3 className="text-sm font-black text-yellow-400 uppercase tracking-wider">Account Not Verified</h3>
                                <p className="text-xs text-gray-400 mt-1">Verify your account to access all features. We'll send a verification code to your email.</p>
                                
                                <div className="mt-4 space-y-3">
                                    <AnimatePresence>
                                        {verifyMsg.text && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className={`flex items-center gap-2 p-3 rounded-xl text-xs font-bold ${
                                                    verifyMsg.type === 'success'
                                                        ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                                                        : 'bg-red-500/10 border border-red-500/20 text-red-400'
                                                }`}
                                            >
                                                {verifyMsg.type === 'success' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                                                {verifyMsg.text}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {verifyStep === 1 ? (
                                        <button
                                            onClick={handleRequestVerifyOtp}
                                            disabled={verifyLoading}
                                            className="px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-[0_0_20px_rgba(249,115,22,0.3)]"
                                        >
                                            {verifyLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                            Send Verification Code
                                        </button>
                                    ) : (
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <input
                                                type="text"
                                                value={verifyOtp}
                                                onChange={(e) => setVerifyOtp(e.target.value)}
                                                placeholder="Enter 6-digit code"
                                                maxLength={6}
                                                className="bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder-gray-600 outline-none focus:border-orange-500/50 transition-all w-48"
                                            />
                                            <button
                                                onClick={handleConfirmVerify}
                                                disabled={verifyLoading}
                                                className="px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-[0_0_20px_rgba(249,115,22,0.3)]"
                                            >
                                                {verifyLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                                Verify
                                            </button>
                                            <button
                                                onClick={() => { setVerifyStep(1); setVerifyMsg({ type: '', text: '' }); }}
                                                className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                                            >
                                                Resend
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ─── Profile Header Card ─────────────────────────────── */}
                <div className="relative rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-xl p-6 sm:p-8 shadow-[0_0_40px_rgba(0,0,0,0.3)]">
                    {/* Premium badge */}
                    {/* Logout button */}
                    <button
                        onClick={handleLogout}
                        className="absolute top-5 right-5 flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-500/10 border border-transparent hover:border-red-500/20"
                    >
                        <LogOut className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Logout</span>
                    </button>

                    <div className="flex items-center gap-5 sm:gap-7">
                        {/* Avatar with premium glow ring */}
                        <div className="relative flex-shrink-0">
                            {/* Outer glow */}
                            <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-orange-500 via-purple-600 to-orange-500 opacity-40 blur-md animate-pulse" />
                            {/* Ring */}
                            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full p-[3px] bg-gradient-to-br from-orange-400 via-purple-500 to-orange-400 shadow-[0_0_25px_rgba(249,115,22,0.4)]">
                                <div className="w-full h-full rounded-full bg-gradient-to-br from-[#1a1a1f] to-[#0f0f12] flex items-center justify-center overflow-hidden">
                                    {user.avatar_url ? (
                                        <img src={user.avatar_url} alt={user.username} className="w-full h-full object-cover rounded-full" />
                                    ) : (
                                        <span className="text-xl sm:text-2xl font-black text-white select-none">{initials}</span>
                                    )}
                                </div>
                            </div>
                            {/* Crown badge */}
                            {/* <div className="absolute -bottom-1 -left-1 w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center border-2 border-[#0d1117] shadow-[0_0_10px_rgba(249,115,22,0.5)]">
                                <Crown className="w-3.5 h-3.5 text-white" />
                            </div> */}
                        </div>

                        {/* Info */}
                        <div className="min-w-0">
                            <h1 className="text-2xl sm:text-3xl font-black tracking-tight truncate">
                                {user.username || user.name}
                            </h1>
                            <p className="text-gray-500 text-sm sm:text-base truncate mt-0.5">
                                {user.email}
                            </p>

                            {/* Badges */}
                            <div className="flex flex-wrap gap-2 mt-3">
                                {/* Verified badge */}
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border shadow-sm ${user.is_verified
                                        ? 'border-green-500/40 bg-gradient-to-r from-green-500/20 to-green-600/10 text-green-400 shadow-green-500/20'
                                        : 'border-red-500/40 bg-gradient-to-r from-red-500/20 to-red-600/10 text-red-400 shadow-red-500/20'
                                    }`}>
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    Verified Status: {user.is_verified ? 'Verified' : 'Unverified'}
                                </span>

                                {/* Member since badge */}
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border border-purple-500/40 bg-gradient-to-r from-purple-500/20 to-purple-600/10 text-purple-400 shadow-sm shadow-purple-500/20">
                                    <CalendarDays className="w-3.5 h-3.5" />
                                    Member Since: {memberSince}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─── Quick Actions Card ──────────────────────────────── */}
                <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-xl p-5 sm:p-6 shadow-[0_0_40px_rgba(0,0,0,0.3)]">
                    <div className="grid grid-cols-5 gap-3 sm:gap-6">
                        {quickActions.map((item) => {
                            const c = colorMap[item.color];
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.label}
                                    onClick={() => handleQuickAction(item)}
                                    className="flex flex-col items-center gap-2 group"
                                >
                                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl border ${c.border} bg-gradient-to-br ${c.bg} from-white/[0.05] to-transparent ${c.hover} flex items-center justify-center transition-all group-hover:scale-105 shadow-lg`}>
                                        <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${c.text}`} />
                                    </div>
                                    <span className="text-[11px] sm:text-xs font-semibold text-gray-400 group-hover:text-white transition-colors">
                                        {item.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ─── Account Details Card ─────────────────────────────── */}
                <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.3)]">
                    <div className="px-6 py-4 border-b border-white/[0.08] bg-white/[0.02] flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-orange-400" />
                        <h2 className="text-sm font-black uppercase tracking-wider text-gray-400">Account Details</h2>
                    </div>
                    <div className="divide-y divide-white/[0.04]">
                        <DetailRow label="Username" value={user.username || '—'} />
                        <DetailRow label="Email" value={user.email || '—'} />
                        <DetailRow label="Account Type" value={user.is_admin ? 'Admin' : 'Member'} />
                        <DetailRow
                            label="Verification"
                            value={user.is_verified ? 'Verified' : 'Not Verified'}
                            valueColor={user.is_verified ? 'text-green-400' : 'text-red-400'}
                        />
                        <DetailRow label="Credits" value={formatPrice(user.credits || 0)} valueColor="text-orange-400" />
                        <DetailRow label="Member Since" value={memberSince} />
                    </div>
                </div>

            </div>
        </div>
    );
}

function DetailRow({ label, value, valueColor = 'text-white' }) {
    return (
        <div className="flex items-center justify-between px-6 py-3.5">
            <span className="text-sm text-gray-500">{label}</span>
            <span className={`text-sm font-semibold ${valueColor}`}>{value}</span>
        </div>
    );
}
