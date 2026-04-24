'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { XCircle, ArrowLeft } from 'lucide-react';

export default function PaymentCancelPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
            <div className="text-center space-y-6 max-w-md w-full">
                <div className="relative inline-flex items-center justify-center">
                    <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full" />
                    <div className="relative w-24 h-24 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                        <XCircle className="w-12 h-12 text-red-500" />
                    </div>
                </div>

                <div className="space-y-2">
                    <h1 className="text-4xl font-black italic uppercase tracking-tighter">
                        Payment <span className="text-red-500">Cancelled</span>
                    </h1>
                    <p className="text-gray-500 font-medium">
                        Your payment was cancelled. No charge was made.
                    </p>
                </div>

                <div className="flex flex-col gap-3 items-center">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-black italic uppercase tracking-widest transition-all shadow-lg hover:-translate-y-0.5"
                    >
                        <ArrowLeft className="w-5 h-5" /> Try Again
                    </button>
                    <button
                        onClick={() => router.push('/services')}
                        className="px-6 py-3 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-2xl font-black italic uppercase tracking-wider transition-all text-sm"
                    >
                        Browse Services
                    </button>
                </div>
            </div>
        </div>
    );
}
