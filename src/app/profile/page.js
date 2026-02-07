'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Calendar, Settings, LogOut, Loader2, Check, X } from 'lucide-react';

export default function ProfilePage() {
    const { user, loading, logout } = useAuth();
    const router = useRouter();

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

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-5xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="flex items-center gap-5">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 p-1 flex items-center justify-center shadow-[0_0_30px_rgba(234,88,12,0.3)]">
                            <div className="w-full h-full bg-black rounded-xl flex items-center justify-center">
                                <User className="w-12 h-12 text-orange-500" />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-4xl font-black tracking-tight">{user.username || user.name}</h1>
                            <p className="text-gray-400 flex items-center gap-2 mt-1">
                                <Mail className="w-4 h-4" /> {user.email}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-6 py-3 bg-gray-900 border border-gray-800 rounded-xl hover:bg-gray-800 transition-all font-bold text-sm">
                            <Settings className="w-4 h-4" /> Edit Profile
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-6 py-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl hover:bg-red-500/20 transition-all font-bold text-sm"
                        >
                            <LogOut className="w-4 h-4" /> Logout
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Stats/Info */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl backdrop-blur-sm">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-orange-500/10 rounded-lg">
                                        <Shield className="w-5 h-5 text-orange-500" />
                                    </div>
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">Account Type</h3>
                                </div>
                                <p className="text-2xl font-black capitalize">{user.is_admin ? 'Admin' : 'Member'}</p>
                            </div>

                            <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl backdrop-blur-sm">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-blue-500/10 rounded-lg">
                                        <Check className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">Verified status</h3>
                                </div>
                                <p className="text-2xl font-black">
                                    {user.is_verified ? 'Verified' : 'Not Verified'}
                                </p>
                            </div>
                            <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl backdrop-blur-sm">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-blue-500/10 rounded-lg">
                                        <Calendar className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">Member Since</h3>
                                </div>
                                <p className="text-2xl font-black">
                                    {user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A'}
                                </p>
                            </div>
                        </div>

                        {/* Raw Data Section (Requested) */}
                        <div className="bg-gray-900/30 border border-gray-800 rounded-2xl overflow-hidden">
                            <div className="p-4 border-b border-gray-800 bg-gray-900/50 flex items-center justify-between">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">Debug Data (Raw User Object)</h3>
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-orange-500/20 border border-orange-500/50"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50"></div>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="rounded-xl border border-gray-800 bg-black/50 p-4">
                                    <pre className="text-xs font-mono text-orange-400/80 overflow-auto whitespace-pre-wrap leading-relaxed">
                                        {JSON.stringify(user, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
