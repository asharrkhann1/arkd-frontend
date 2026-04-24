'use client';

import React from 'react';
import { useCart } from '@/contexts/CartContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import {
    Trash2,
    Minus,
    Plus,
    ShoppingCart,
    ArrowRight,
    ShieldCheck,
    ChevronLeft,
    CreditCard,
    Zap
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { User } from 'lucide-react';
import AddonModal from '@/components/Services/AddonModal';

export default function CartClient() {
    const { cart, removeFromCart, updateQuantity, updateAddons, cartCount } = useCart();
    const { formatPrice } = useCurrency();
    const { user } = useAuth();

    const [isCheckoutOpen, setIsCheckoutOpen] = React.useState(false);
    const [isLoginPromptOpen, setIsLoginPromptOpen] = React.useState(false);
    const [isAgreed, setIsAgreed] = React.useState(false);
    const [isProcessing, setIsProcessing] = React.useState(false);

    // Addon Review step for instant buy
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isAddonReviewOpen, setIsAddonReviewOpen] = React.useState(false);
    const [instantProduct, setInstantProduct] = React.useState(null);

    React.useEffect(() => {
        const checkout = searchParams.get('checkout');
        const productId = searchParams.get('productId');

        if (checkout === 'true' && productId && cart.length > 0) {
            const product = cart.find(item => item.id.toString() === productId.toString());
            if (product && !isAddonReviewOpen) {
                setInstantProduct(product);
                setIsAddonReviewOpen(true);
            }
        }
    }, [searchParams, cart, isAddonReviewOpen]);

    const handleAddonReviewConfirm = (updatedAddons) => {
        setIsAddonReviewOpen(false);
        if (instantProduct) {
            updateAddons(instantProduct.id, updatedAddons);
        }
        if (!user) {
            setIsLoginPromptOpen(true);
        } else {
            setIsCheckoutOpen(true);
        }
        // Clean up URL to prevent modal re-opening on refresh
        router.replace('/cart', { scroll: false });
    };

    const getItemPrice = (item) => {
        let price = Number(item.price || 0);
        if (item.selected_addons && item.addons) {
            Object.entries(item.selected_addons).forEach(([category, key]) => {
                const options = item.addons[category];
                if (Array.isArray(options)) {
                    const option = options.find(o => o.key === key);
                    if (option) {
                        price += Number(option.price || 0);
                    }
                }
            });
        }
        return price;
    };

    const subtotal = cart.reduce((acc, item) => acc + (getItemPrice(item) * (item.quantity || 1)), 0);
    const platformFee = subtotal * 0.05;
    const total = subtotal + platformFee;

    const handlePayment = async () => {
        setIsProcessing(true);
        try {
            const cartPayload = cart.map(item => ({
                product_id: item.id,
                quantity: item.quantity || 1,
                addons: item.selected_addons || {},
            }));

            const data = await import('@/lib/api').then(m => m.apiFetch('/payment/create-checkout', {
                method: 'POST',
                body: {
                    type: 'cart',
                    cart_items: cartPayload,
                    terms_agreed: isAgreed,
                },
            }));

            window.location.href = data.checkoutUrl;
        } catch (err) {
            setIsProcessing(false);
            alert(err.message || 'Failed to start checkout');
        }
    };

    const handleCheckoutClick = () => {
        if (!user) {
            setIsLoginPromptOpen(true);
        } else {
            setIsCheckoutOpen(true);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-8"
                >
                    <div className="relative inline-block">
                        <div className="absolute -inset-4 bg-orange-500/20 blur-3xl rounded-full" />
                        <ShoppingCart className="w-24 h-24 text-gray-800 relative" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black italic uppercase italic tracking-tighter">Your Basket is Empty</h1>
                        <p className="text-gray-500 max-w-sm mx-auto font-medium">Looks like you haven't added any premium services to your collection yet.</p>
                    </div>
                    <Link
                        href="/services"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-black italic uppercase tracking-wider transition-all shadow-[0_10px_30px_rgba(234,88,12,0.3)] hover:-translate-y-1"
                    >
                        Browse Services <ArrowRight className="w-5 h-5" />
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="space-y-2">
                        <Link href="/services" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-orange-500 transition-colors mb-4">
                            <ChevronLeft className="w-4 h-4" /> Back to Services
                        </Link>
                        <h1 className="text-6xl font-black italic uppercase tracking-tighter leading-none">
                            Your <span className="text-orange-500">Basket</span>
                        </h1>
                        <p className="text-gray-500 font-medium">Review your items and proceed to secure checkout.</p>
                    </div>
                    <div className="px-6 py-4 bg-[#0a0a0a] border border-white/5 rounded-2xl flex items-center gap-4">
                        <div className="p-2 bg-green-500/10 rounded-lg">
                            <ShieldCheck className="w-6 h-6 text-green-500" />
                        </div>
                        <div className="text-left">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Secure Checkout</p>
                            <p className="text-sm font-black italic text-white">Powered by Stripe</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Cart Items */}
                    <div className="lg:col-span-8 space-y-6">
                        <AnimatePresence mode="popLayout">
                            {cart.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="group relative bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-6 hover:border-orange-500/30 transition-all shadow-xl"
                                >
                                    <div className="flex flex-col sm:flex-row gap-8 items-center">
                                        {/* Thumbnail */}
                                        <Link
                                            href={item.product_url || '#'}
                                            className="w-32 h-32 rounded-3xl overflow-hidden bg-gray-900 border border-white/10 shrink-0 block"
                                        >
                                            <img
                                                src={item.thumbnail_image || item.images?.[0] || "https://placehold.co/400x400"}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </Link>

                                        {/* Details */}
                                        <div className="flex-1 space-y-4 text-center sm:text-left">
                                            <div>
                                                <div className="flex items-center justify-center sm:justify-start gap-2 text-[9px] font-black uppercase tracking-widest text-orange-500/80 mb-1">
                                                    <span>{item.type || 'Service'}</span>
                                                    {(item.delivery_type === 'auto' || item.delivery_type === 'instant') && (
                                                        <>
                                                            <span className="text-gray-800">•</span>
                                                            <span className="flex items-center gap-1"><Zap className="w-3 h-3 fill-current" /> Instant</span>
                                                        </>
                                                    )}
                                                </div>
                                                <Link href={item.product_url || '#'}>
                                                    <h3 className="text-xl font-black italic uppercase tracking-tight line-clamp-1 hover:text-orange-500 transition-colors">
                                                        {item.title || 'Loading...'}
                                                    </h3>
                                                </Link>
                                            </div>

                                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                                                {Object.entries(item.specs || {}).slice(0, 2).map(([key, spec]) => (
                                                    <span key={key} className="px-3 py-1 bg-white/[0.03] border border-white/5 rounded-full text-[9px] font-bold text-gray-400 uppercase">
                                                        {spec.label || key}: <span className="text-white">{spec.value}</span>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Price & Qty */}
                                        <div className="flex flex-col items-center sm:items-end gap-6 min-w-[140px]">
                                            <div className="text-2xl font-black italic text-white tracking-tighter text-right">
                                                {formatPrice(getItemPrice(item) * (item.quantity || 1))}
                                                {item.selected_addons && Object.keys(item.selected_addons).length > 0 && (
                                                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">
                                                        Incl. Addons
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex flex-col items-center sm:items-end gap-2">
                                                {item.selected_addons && Object.entries(item.selected_addons).map(([category, key]) => {
                                                    const option = item.addons?.[category]?.find(o => o.key === key);
                                                    if (!option) return null;
                                                    return (
                                                        <div key={category} className="flex items-center gap-1.5 text-[9px] font-black uppercase text-orange-500/60">
                                                            <span>{category}:</span>
                                                            <span className="text-white">{option.label}</span>
                                                            {option.price > 0 && <span>(+{formatPrice(option.price)})</span>}
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center bg-black border border-white/10 rounded-xl overflow-hidden">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, -1)}
                                                        className="p-2 hover:bg-white/5 transition-colors text-gray-500 hover:text-white"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="w-8 text-center text-xs font-black">{item.quantity || 1}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, 1)}
                                                        className="p-2 hover:bg-white/5 transition-colors text-gray-500 hover:text-white"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="p-2 text-gray-700 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-12 space-y-6">
                            <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl space-y-8">
                                <h2 className="text-2xl font-black italic uppercase italic tracking-tighter">Order Summary</h2>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500 font-bold uppercase tracking-wider">Subtotal</span>
                                        <span className="font-black italic text-white">{formatPrice(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500 font-bold uppercase tracking-wider">Platform Fee</span>
                                        <span className="font-black italic text-white">{formatPrice(platformFee)}</span>
                                    </div>
                                    <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                                        <span className="text-lg font-black italic uppercase tracking-tight">Total</span>
                                        <span className="text-3xl font-black italic text-orange-500 tracking-tighter">{formatPrice(total)}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCheckoutClick}
                                    className="w-full py-5 bg-orange-600 hover:bg-orange-500 text-white rounded-[2rem] font-black italic uppercase tracking-widest text-lg transition-all shadow-[0_15px_35px_rgba(234,88,12,0.3)] hover:-translate-y-1 flex items-center justify-center gap-3"
                                >
                                    <CreditCard className="w-6 h-6" /> SECURE CHECKOUT
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Checkout Modal */}
            <AnimatePresence>
                {isCheckoutOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCheckoutOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-xl bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden"
                        >
                            <div className="absolute -top-24 -left-24 w-64 h-64 bg-orange-500/10 blur-[100px] rounded-full pointer-events-none" />

                            <div className="relative space-y-8">
                                <div className="text-center space-y-2">
                                    <h2 className="text-4xl font-black italic uppercase tracking-tighter">Confirm <span className="text-orange-500">Order</span></h2>
                                    <p className="text-gray-500 text-sm font-medium">Please review your final bag contents.</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-orange-500/10 rounded-xl">
                                                <ShoppingCart className="w-5 h-5 text-orange-500" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Total Payable</p>
                                                <p className="text-2xl font-black text-white italic">{formatPrice(total)}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Via Stripe</p>
                                            <CreditCard className="w-6 h-6 text-orange-500 ml-auto mt-1" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <label className="flex gap-4 group cursor-pointer p-4 bg-white/[0.01] hover:bg-white/[0.03] rounded-2xl border border-white/5 transition-all">
                                        <div className="pt-1">
                                            <input
                                                type="checkbox"
                                                checked={isAgreed}
                                                onChange={(e) => setIsAgreed(e.target.checked)}
                                                className="w-5 h-5 rounded border-white/10 bg-black text-orange-600 focus:ring-orange-500/50 transition-all cursor-pointer"
                                            />
                                        </div>
                                        <p className="text-[11px] leading-relaxed text-gray-500 font-medium group-hover:text-gray-300 transition-colors">
                                            I have read, understood, and agree to the <span className="text-white hover:text-orange-500 cursor-help underline decoration-white/20">Terms</span>, <span className="text-white hover:text-orange-500 cursor-help underline decoration-white/20">Refund Policy</span>, <span className="text-white hover:text-orange-500 cursor-help underline decoration-white/20">Warranty Policy</span>, and <span className="text-white hover:text-orange-500 cursor-help underline decoration-white/20">Anti-Chargeback terms</span>. I acknowledge that all digital sales are final and that I am responsible for account security.
                                        </p>
                                    </label>

                                    <div className="flex gap-4">
                                        <button
                                            disabled={!isAgreed || isProcessing}
                                            onClick={handlePayment}
                                            className="flex-1 py-5 bg-orange-600 disabled:opacity-30 disabled:grayscale hover:bg-orange-500 text-white rounded-2xl font-black italic uppercase tracking-widest transition-all shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-3"
                                        >
                                            {isProcessing ? (
                                                <div className="w-6 h-6 border-4 border-white/20 border-t-white animate-spin rounded-full" />
                                            ) : (
                                                <><CreditCard className="w-5 h-5" /> Pay with Stripe</>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Login Prompt Modal */}
            <AnimatePresence>
                {isLoginPromptOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsLoginPromptOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-[0_30px_100px_rgba(0,0,0,0.8)] text-center"
                        >
                            <div className="absolute -top-24 -left-24 w-64 h-64 bg-orange-500/10 blur-[100px] rounded-full pointer-events-none" />

                            <div className="relative space-y-8">
                                <div className="mx-auto w-20 h-20 bg-orange-500/10 rounded-3xl flex items-center justify-center border border-orange-500/20">
                                    <User className="w-10 h-10 text-orange-500" />
                                </div>

                                <div className="space-y-2">
                                    <h2 className="text-3xl font-black italic uppercase tracking-tighter">Login <span className="text-orange-500">Required</span></h2>
                                    <p className="text-gray-500 text-sm font-medium">You need to be logged in to proceed with your purchase.</p>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={() => router.push('/login?redirect=/cart')}
                                        className="w-full py-5 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-black italic uppercase tracking-widest transition-all shadow-2xl hover:-translate-y-1"
                                    >
                                        Login to Account
                                    </button>
                                    <button
                                        onClick={() => setIsLoginPromptOpen(false)}
                                        className="w-full py-4 bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white rounded-2xl font-black italic uppercase transition-all"
                                    >
                                        Maybe Later
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AddonModal
                isOpen={isAddonReviewOpen}
                onClose={() => setIsAddonReviewOpen(false)}
                onConfirm={handleAddonReviewConfirm}
                product={instantProduct}
                initialSelected={instantProduct?.selected_addons}
                showPrices={true}
                title="Review Order"
                description="Verify your selected addons and total price before finalizing."
            />
        </div>
    );
}
