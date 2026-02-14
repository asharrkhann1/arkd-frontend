'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Loader2, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function ForgotPassword() {
    const { forgotPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    async function onSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await forgotPassword({ email });
            setSuccess(true);
        } catch (err) {
            setError(err.message || 'Failed to send reset email. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-black via-[#0a0a0a] to-black font-sans text-slate-200">
            {/* Background Blur */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-500/15 rounded-full blur-[80px] animate-pulse duration-[8000ms]" />

            {/* Particles */}
            <div
                className="absolute inset-0 w-full h-full animate-[particleFloat_20s_ease-in-out_infinite]"
                style={{
                    backgroundImage: `
                        radial-gradient(2px 2px at 20% 30%, rgba(249, 115, 22, 0.3), transparent),
                        radial-gradient(2px 2px at 60% 70%, rgba(249, 115, 22, 0.2), transparent),
                        radial-gradient(1px 1px at 50% 50%, rgba(251, 146, 60, 0.3), transparent),
                        radial-gradient(1px 1px at 80% 10%, rgba(249, 115, 22, 0.3), transparent)
                    `,
                    backgroundSize: '200% 200%'
                }}
            />

            <style jsx global>{`
                @keyframes particleFloat {
                    0%, 100% { background-position: 0% 0%; }
                    50% { background-position: 100% 100%; }
                }
            `}</style>

            {/* Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-[480px] max-w-[95vw] bg-[#0a0a0a]/70 backdrop-blur-[20px] rounded-[24px] border border-orange-500/25 shadow-[0_0_60px_rgba(249,115,22,0.2),0_20px_80px_rgba(0,0,0,0.8)] overflow-hidden"
            >
                {/* Close Button */}
                <Link
                    href="/login"
                    className="absolute top-6 right-6 w-10 h-10 bg-[#141414]/80 border border-orange-500/30 rounded-lg flex items-center justify-center text-slate-300 hover:bg-[#1e1e1e]/90 hover:border-orange-500/60 hover:text-slate-100 hover:rotate-90 hover:shadow-[0_0_12px_rgba(249,115,22,0.3)] transition-all duration-300 z-20 cursor-pointer"
                    aria-label="Back to login"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>

                <div className="p-8 md:p-12 flex flex-col gap-8">
                    {/* Header */}
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-[0_0_25px_rgba(249,115,22,0.4)]">
                            <Mail className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-black text-slate-100 mb-2 tracking-tight">Forgot Password?</h1>
                        <p className="text-[15px] text-slate-400">
                            No worries! Enter your email and we'll send you a reset link.
                        </p>
                    </div>

                    {/* Success State */}
                    {success ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center space-y-6"
                        >
                            <div className="w-20 h-20 mx-auto rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                                <CheckCircle2 className="w-10 h-10 text-green-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white mb-2">Check Your Email!</h2>
                                <p className="text-sm text-slate-400">
                                    We've sent a password reset link to <span className="text-orange-400 font-medium">{email}</span>
                                </p>
                            </div>
                            <Link
                                href="/login"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-br from-orange-500 to-orange-600 text-white font-semibold text-sm rounded-xl shadow-[0_4px_16px_rgba(249,115,22,0.3)] hover:from-orange-600 hover:to-orange-700 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(249,115,22,0.4)] transition-all duration-300"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Login
                            </Link>
                        </motion.div>
                    ) : (
                        <>
                            {/* Error */}
                            {error && (
                                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                                    {error}
                                </div>
                            )}

                            {/* Form */}
                            <form onSubmit={onSubmit} className="flex flex-col gap-4">
                                <div className="relative">
                                    <input
                                        type="email"
                                        placeholder="Enter your email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={loading}
                                        required
                                        className="w-full p-4 pl-12 bg-black/60 border border-orange-500/30 rounded-xl text-[15px] text-slate-100 placeholder-slate-500 focus:outline-none focus:bg-black/80 focus:border-orange-500/60 focus:ring-[3px] focus:ring-orange-500/15 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="group w-full flex items-center justify-center gap-2 p-4 bg-gradient-to-br from-orange-500 to-orange-600 text-white font-semibold text-base rounded-xl shadow-[0_4px_16px_rgba(249,115,22,0.3)] hover:from-orange-600 hover:to-orange-700 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(249,115,22,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            Send Reset Link
                                            <svg className="transition-transform duration-300 group-hover:translate-x-1" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Footer */}
                            <p className="text-center text-sm text-slate-400">
                                Remember your password?{' '}
                                <Link href="/login" className="text-orange-500 font-medium hover:text-orange-400 transition-colors">
                                    Sign in
                                </Link>
                            </p>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
