'use client'
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Register() {
    const router = useRouter();
    const { signup } = useAuth();

    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);

    async function onSubmit(e) {
        e.preventDefault();
        setError('');
        setBusy(true);
        try {
            await signup({ username: name, email, password });
            router.push('/');
        } catch (err) {
            setError(err.message || 'Signup failed');
        } finally {
            setBusy(false);
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

            {/* Register Card */}
            <div className="relative w-[920px] max-w-[95vw] bg-[#0a0a0a]/70 backdrop-blur-[20px] rounded-[24px] border border-orange-500/25 shadow-[0_0_60px_rgba(249,115,22,0.2),0_20px_80px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col md:flex-row">

                {/* Close Button */}
                <button
                    onClick={() => window.history.back()}
                    className="absolute top-6 right-6 w-10 h-10 bg-[#141414]/80 border border-orange-500/30 rounded-lg flex items-center justify-center text-slate-300 hover:bg-[#1e1e1e]/90 hover:border-orange-500/60 hover:text-slate-100 hover:rotate-90 hover:shadow-[0_0_12px_rgba(249,115,22,0.3)] transition-all duration-300 z-20 cursor-pointer"
                    aria-label="Close"
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>

                {/* Left Section */}
                <div className="flex-1 p-8 md:p-14 lg:p-16 flex flex-col gap-8">
                    <div>
                        <h1 className="text-5xl font-bold text-slate-100 mb-3 tracking-tight">Create Account</h1>
                        <p className="text-[15px] text-slate-400">
                            Already have an account? <Link href="/login" className="text-orange-500 font-medium hover:text-orange-400 transition-colors">Login here</Link>.
                        </p>
                    </div>

                    {/* Google Login Button */}
                    <button
                        onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`}
                        className="w-full flex items-center justify-center gap-3 p-4 bg-[#141414]/70 border border-orange-500/30 rounded-xl text-slate-300 font-medium hover:bg-[#1e1e1e]/90 hover:border-orange-500/60 hover:-translate-y-0.5 hover:shadow-[0_8px_16px_rgba(249,115,22,0.3)] transition-all duration-300 group"
                        aria-label="Continue with Google"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        <span className="group-hover:text-white transition-colors">Continue with Google</span>
                    </button>

                    {/* Divider */}
                    <div className="relative text-center my-2">
                        <div className="absolute left-0 top-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500/20 to-transparent"></div>
                        <span className="relative bg-[#0a0a0a]/90 px-4 text-[13px] text-slate-400 font-medium tracking-wide">Or Register With Email</span>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={onSubmit} className="flex flex-col gap-4">
                        <input
                            type="text"
                            placeholder="Username"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={busy}
                            required
                            className="w-full p-4 bg-black/60 border border-orange-500/30 rounded-xl text-[15px] text-slate-100 placeholder-slate-500 focus:outline-none focus:bg-black/80 focus:border-orange-500/60 focus:ring-[3px] focus:ring-orange-500/15 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={busy}
                            required
                            className="w-full p-4 bg-black/60 border border-orange-500/30 rounded-xl text-[15px] text-slate-100 placeholder-slate-500 focus:outline-none focus:bg-black/80 focus:border-orange-500/60 focus:ring-[3px] focus:ring-orange-500/15 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={busy}
                                required
                                className="w-full p-4 bg-black/60 border border-orange-500/30 rounded-xl text-[15px] text-slate-100 placeholder-slate-500 focus:outline-none focus:bg-black/80 focus:border-orange-500/60 focus:ring-[3px] focus:ring-orange-500/15 transition-all duration-300 pr-12 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-200 transition-colors focus:outline-none"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={busy}
                            className="group w-full flex items-center justify-center gap-2 p-4 bg-gradient-to-br from-orange-500 to-orange-600 text-white font-semibold text-base rounded-xl shadow-[0_4px_16px_rgba(249,115,22,0.3)] hover:from-orange-600 hover:to-orange-700 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(249,115,22,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {busy ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Create Account
                                    <svg className="transition-transform duration-300 group-hover:translate-x-1" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Right Section - Crown Thing */}
                <div className="relative w-full md:w-[360px] bg-gradient-to-br from-[#0f0f0f]/50 to-[#080808]/70 border-l border-orange-500/20 overflow-hidden min-h-[300px] md:min-h-auto flex items-center justify-center">
                    {/* Overlay Grid Pattern */}
                    <div className="absolute inset-0 z-0 opacity-[0.03]"
                        style={{
                            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 20px, #f97316 20px, #f97316 21px), repeating-linear-gradient(90deg, transparent, transparent 20px, #f97316 20px, #f97316 21px)`
                        }}
                    />

                    {/* Background Pulse */}
                    <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] -translate-x-1/2 -translate-y-1/2 bg-orange-500/15 rounded-full blur-[60px] animate-[pulse_6s_ease-in-out_infinite]" />

                    {/* Glow behind crown */}
                    <div className="absolute top-1/2 left-1/2 w-[280px] h-[280px] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-10">
                        {/* Rotating Ring */}
                        <div className="absolute inset-[-40px] rounded-full bg-[conic-gradient(from_0deg,rgba(249,115,22,0)_0deg,rgba(249,115,22,0.2)_90deg,rgba(249,115,22,0)_180deg,rgba(249,115,22,0.2)_270deg,rgba(249,115,22,0)_360deg)] animate-[spin_8s_linear_infinite]" />

                        {/* Floating Crown */}
                        <motion.div
                            animate={{
                                y: [0, -15, 0],
                                rotate: [0, 5, 0]
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="relative z-10 drop-shadow-[0_0_20px_rgba(249,115,22,0.6)]"
                        >
                            <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                                <defs>
                                    <linearGradient id="crownGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#f97316" />
                                        <stop offset="100%" stopColor="#ea580c" />
                                    </linearGradient>
                                    <filter id="glow">
                                        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                                        <feMerge>
                                            <feMergeNode in="coloredBlur" />
                                            <feMergeNode in="SourceGraphic" />
                                        </feMerge>
                                    </filter>
                                </defs>
                                <rect x="20" y="50" width="80" height="40" rx="8" fill="url(#crownGradient)" filter="url(#glow)" />
                                <polygon points="30,50 40,30 50,50" fill="url(#crownGradient)" filter="url(#glow)" />
                                <polygon points="50,50 60,25 70,50" fill="url(#crownGradient)" filter="url(#glow)" />
                                <polygon points="70,50 80,30 90,50" fill="url(#crownGradient)" filter="url(#glow)" />
                                <circle cx="40" cy="35" r="4" fill="#fb923c" />
                                <circle cx="60" cy="30" r="4" fill="#fb923c" />
                                <circle cx="80" cy="35" r="4" fill="#fb923c" />
                            </svg>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
