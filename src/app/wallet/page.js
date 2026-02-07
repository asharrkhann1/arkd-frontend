'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import {
    Wallet,
    Plus,
    CreditCard,
    History,
    ArrowUpRight,
    ChevronRight,
    ShieldCheck,
    Lock,
    Zap,
    AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_HISTORY = [
    { id: 1, date: '2024-02-01 14:30', amount: 50.00, tax: 2.50, status: 'Completed', method: 'Visa •••• 4242' },
    { id: 2, date: '2024-01-25 09:15', amount: 20.00, tax: 1.00, status: 'Completed', method: 'Mastercard •••• 8888' },
    { id: 3, date: '2024-01-15 22:45', amount: 100.00, tax: 5.00, status: 'Completed', method: 'Visa •••• 4242' },
    { id: 4, date: '2024-01-05 11:20', amount: 30.00, tax: 1.50, status: 'Completed', method: 'Visa •••• 4242' },
];

export default function WalletPage() {
    const { user } = useAuth();
    const { formatPrice } = useCurrency();
    const [selectedAmount, setSelectedAmount] = useState(20);
    const [customAmount, setCustomAmount] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [step, setStep] = useState('amount'); // 'amount' or 'payment'

    const presets = [15, 20, 30, 50];
    const finalAmount = customAmount ? parseFloat(customAmount) : selectedAmount;
    const serviceTax = finalAmount * 0.05;
    const totalToPay = finalAmount + serviceTax;

    const handleAddBalance = (e) => {
        e.preventDefault();
        setIsProcessing(true);
        // Mock processing
        setTimeout(() => {
            setIsProcessing(false);
            alert(`Succesfully added ${finalAmount} credits to your wallet!`);
            setStep('amount');
            setCustomAmount('');
        }, 2000);
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4">
                <div className="text-center space-y-4">
                    <AlertCircle className="w-16 h-16 text-orange-500 mx-auto" />
                    <h1 className="text-2xl font-black text-white italic uppercase italic">Session Expired</h1>
                    <p className="text-gray-500">Please login to manage your wallet.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 mb-2">
                            <Wallet className="w-4 h-4" /> Financial Overview
                        </div>
                        <h1 className="text-6xl font-black italic uppercase italic tracking-tighter leading-none">
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

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left: Add Balance Section */}
                    <div className="lg:col-span-12">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <motion.div
                                layout
                                className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-8 md:p-12 shadow-2xl space-y-8 h-full"
                            >
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-black italic uppercase italic tracking-tight flex items-center gap-3">
                                        <Plus className="w-6 h-6 text-orange-500" /> Add Credits
                                    </h2>
                                    {step === 'payment' && (
                                        <button
                                            onClick={() => setStep('amount')}
                                            className="text-xs font-black uppercase text-gray-500 hover:text-white transition-colors"
                                        >
                                            Change Amount
                                        </button>
                                    )}
                                </div>

                                {step === 'amount' ? (
                                    <div className="space-y-8">
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                            {presets.map((amt) => (
                                                <button
                                                    key={amt}
                                                    onClick={() => {
                                                        setSelectedAmount(amt);
                                                        setCustomAmount('');
                                                    }}
                                                    className={`py-6 rounded-2xl font-black italic text-xl transition-all border ${selectedAmount === amt && !customAmount
                                                            ? 'bg-orange-600 border-orange-500 text-white shadow-[0_10px_20px_rgba(234,88,12,0.3)]'
                                                            : 'bg-white/[0.02] border-white/5 text-gray-400 hover:bg-white/[0.05] hover:text-white'
                                                        }`}
                                                >
                                                    ${amt}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="space-y-4">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Or enter custom amount</p>
                                            <div className="relative">
                                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black italic text-orange-500">$</span>
                                                <input
                                                    type="number"
                                                    value={customAmount}
                                                    onChange={(e) => setCustomAmount(e.target.value)}
                                                    placeholder="0.00"
                                                    className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-6 pl-12 pr-6 text-2xl font-black italic text-white placeholder:text-gray-800 focus:border-orange-500/50 outline-none transition-all"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            disabled={!finalAmount || finalAmount <= 0}
                                            onClick={() => setStep('payment')}
                                            className="w-full py-6 bg-orange-600 hover:bg-orange-500 disabled:opacity-30 disabled:grayscale text-white rounded-[2rem] font-black italic uppercase tracking-widest text-lg transition-all shadow-2xl flex items-center justify-center gap-3 group"
                                        >
                                            Continue to Payment <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleAddBalance} className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-4">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-500 font-bold uppercase tracking-wider">Topup Amount</span>
                                                <span className="font-black italic text-white">${finalAmount.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm text-orange-500/70">
                                                <span className="font-bold uppercase tracking-wider">Service Tax (5%)</span>
                                                <span className="font-black italic">${serviceTax.toFixed(2)}</span>
                                            </div>
                                            <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                                                <span className="text-lg font-black italic uppercase tracking-tight">Total Due</span>
                                                <span className="text-3xl font-black italic text-orange-500 tracking-tighter">${totalToPay.toFixed(2)}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="relative">
                                                <CreditCard className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                                <input
                                                    required
                                                    placeholder="Card Number"
                                                    className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-sm font-bold text-white placeholder:text-gray-700 focus:border-orange-500/50 outline-none"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <input
                                                    required
                                                    placeholder="MM/YY"
                                                    className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-5 px-6 text-sm font-bold text-white placeholder:text-gray-700 focus:border-orange-500/50 outline-none"
                                                />
                                                <div className="relative">
                                                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                                    <input
                                                        required
                                                        placeholder="CVC"
                                                        className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-sm font-bold text-white placeholder:text-gray-700 focus:border-orange-500/50 outline-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 text-[10px] text-gray-500 font-bold uppercase tracking-widest px-2">
                                            <ShieldCheck className="w-4 h-4 text-green-500" /> Secured by 256-bit SSL Encryption
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isProcessing}
                                            className="w-full py-6 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white rounded-[2rem] font-black italic uppercase tracking-widest text-lg transition-all shadow-2xl flex items-center justify-center gap-3"
                                        >
                                            {isProcessing ? (
                                                <div className="w-6 h-6 border-4 border-white/20 border-t-white animate-spin rounded-full" />
                                            ) : (
                                                <>Pay ${totalToPay.toFixed(2)}</>
                                            )}
                                        </button>
                                    </form>
                                )}
                            </motion.div>

                            <div className="space-y-8">
                                <h2 className="text-2xl font-black italic uppercase italic tracking-tight flex items-center gap-3 p-2">
                                    <History className="w-6 h-6 text-orange-500" /> History
                                </h2>

                                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                    {MOCK_HISTORY.map((item) => (
                                        <div
                                            key={item.id}
                                            className="group bg-[#0a0a0a] border border-white/5 rounded-3xl p-6 hover:border-orange-500/30 transition-all flex items-center justify-between shadow-xl"
                                        >
                                            <div className="flex items-center gap-6">
                                                <div className="w-14 h-14 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <ArrowUpRight className="w-6 h-6 text-green-500" />
                                                </div>
                                                <div>
                                                    <p className="text-white font-black italic uppercase tracking-tight">Funds Added</p>
                                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{item.date}</p>
                                                    <p className="text-[10px] text-orange-500/50 font-black uppercase tracking-widest mt-1">{item.method}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-black italic text-white">+{formatPrice(item.amount)}</p>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Tax: ${item.tax.toFixed(2)}</p>
                                                <div className="flex items-center gap-1.5 justify-end mt-1">
                                                    <div className="w-1 h-1 rounded-full bg-green-500" />
                                                    <span className="text-[9px] font-black text-green-500 uppercase tracking-[0.2em]">{item.status}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
