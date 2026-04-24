'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

export default function PaymentSuccessPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const sessionId = searchParams.get('session_id');

    const [status, setStatus] = useState('loading'); // loading | found | pending | error
    const [orderId, setOrderId] = useState(null);
    const [attempts, setAttempts] = useState(0);

    useEffect(() => {
        if (!sessionId) {
            setStatus('error');
            return;
        }

        let cancelled = false;
        let timer;

        const poll = async () => {
            if (cancelled) return;

            try {
                const data = await apiFetch(`/payment/session/${sessionId}`);

                if (data.success && data.orderId) {
                    if (!cancelled) {
                        setOrderId(data.orderId);
                        setStatus('found');
                        setTimeout(() => router.push(`/orders/${data.orderId}`), 1800);
                    }
                    return;
                }

                if (data.pending) {
                    if (!cancelled) {
                        setAttempts(a => {
                            const next = a + 1;
                            if (next >= 20) {
                                setStatus('error');
                            } else {
                                setStatus('pending');
                                timer = setTimeout(poll, 2000);
                            }
                            return next;
                        });
                    }
                    return;
                }

                if (!cancelled) setStatus('error');
            } catch {
                if (!cancelled) {
                    setAttempts(a => {
                        const next = a + 1;
                        if (next >= 20) {
                            setStatus('error');
                        } else {
                            timer = setTimeout(poll, 2000);
                        }
                        return next;
                    });
                }
            }
        };

        poll();

        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, [sessionId, router]);

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
            <div className="text-center space-y-6 max-w-md w-full">

                {status === 'loading' || status === 'pending' ? (
                    <>
                        <div className="relative inline-flex items-center justify-center">
                            <div className="absolute inset-0 bg-orange-500/20 blur-3xl rounded-full" />
                            <div className="relative w-24 h-24 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                                <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-4xl font-black italic uppercase tracking-tighter">
                                Payment <span className="text-orange-500">Confirmed</span>
                            </h1>
                            <p className="text-gray-500 font-medium">
                                {status === 'pending'
                                    ? 'Creating your order, please wait…'
                                    : 'Verifying payment…'}
                            </p>
                            {attempts > 0 && (
                                <p className="text-[11px] text-gray-700 uppercase tracking-widest">
                                    Checking… {attempts}/20
                                </p>
                            )}
                        </div>
                    </>
                ) : status === 'found' ? (
                    <>
                        <div className="relative inline-flex items-center justify-center">
                            <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full" />
                            <div className="relative w-24 h-24 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                                <CheckCircle2 className="w-12 h-12 text-green-500" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-4xl font-black italic uppercase tracking-tighter">
                                Order <span className="text-green-500">Placed!</span>
                            </h1>
                            <p className="text-gray-400 font-medium">
                                Order #{orderId} created successfully.
                            </p>
                            <p className="text-gray-600 text-sm">Redirecting to your order…</p>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="relative inline-flex items-center justify-center">
                            <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full" />
                            <div className="relative w-24 h-24 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                                <AlertCircle className="w-12 h-12 text-red-500" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-4xl font-black italic uppercase tracking-tighter">
                                Something <span className="text-red-500">Went Wrong</span>
                            </h1>
                            <p className="text-gray-500 font-medium">
                                Payment was received but we couldn&apos;t confirm your order automatically.
                            </p>
                            <p className="text-gray-600 text-sm">
                                Please contact support — your payment is safe and your order will be processed.
                            </p>
                        </div>
                        <button
                            onClick={() => router.push('/orders')}
                            className="px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-black italic uppercase tracking-widest transition-all"
                        >
                            View My Orders
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
