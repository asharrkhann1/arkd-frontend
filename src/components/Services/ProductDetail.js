'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
    ChevronLeft,
    ShoppingCart,
    Zap,
    ShieldCheck,
    Clock,
    CheckCircle2,
    Package,
    ArrowRight,
    Star,
    ExternalLink,
    Maximize2,
    Info,
    Wallet,
    Heart,
    Check,
    X,
    Minus,
    Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function ProductDetail({ product, type, category }) {
    const { formatPrice, selectedCurrency } = useCurrency();
    const { user, refreshMe } = useAuth();
    const router = useRouter();
    const { isInWishlist, toggleWishlist } = useWishlist();
    const [isToggling, setIsToggling] = useState(false);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [selectedQuantity, setSelectedQuantity] = useState(1);

    const maxQuantity = product.stock_mode === 'limited'
        ? (product.quantity_available || 1)
        : 99;

    // Image handling
    const images = useMemo(() => {
        const all = [];
        if (product.thumbnail_image) all.push(product.thumbnail_image);
        if (product.images && Array.isArray(product.images)) {
            product.images.forEach(img => {
                if (img !== product.thumbnail_image && !all.includes(img)) {
                    all.push(img);
                }
            });
        }
        return all;
    }, [product.thumbnail_image, product.images]);

    const [mainImage, setMainImage] = useState(images[0]);

    const isVerified = user?.is_verified;
    const isOutOfStock = product.stock_mode === 'limited' && (product.quantity_available || 0) < 1;

    const handleOrderClick = () => {
        if (!user) return;

        if (isOutOfStock) {
            toast.error("This product is currently out of stock.");
            return;
        }

        if (!isVerified) {
            toast.error("Please verify your account to place orders.");
            return;
        }

        setIsOrderModalOpen(true);
    };

    const isWishlisted = isInWishlist(product.id);

    const handleWishlistToggle = async () => {
        setIsToggling(true);
        await toggleWishlist(product);
        setIsToggling(false);
    };

    return (
        <div className="min-h-screen bg-black text-white pb-24">
            {/* Header / Breadcrumbs */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-8">
                    <Link href="/" className="hover:text-white transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/services" className="hover:text-white transition-colors">Services</Link>
                    <span>/</span>
                    <Link href={`/services/${type}/${category}`} className="hover:text-white transition-colors">{category}</Link>
                    <span>/</span>
                    <span className="text-orange-500">{product.title}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column: Gallery */}
                    <div className="lg:col-span-7 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="aspect-[16/10] rounded-[3rem] overflow-hidden bg-white/[0.02] border border-white/5 relative group"
                        >
                            <img
                                src={mainImage}
                                alt={product.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />

                            <div className="absolute top-8 left-8 flex flex-col gap-3">
                                {(product.delivery_type === 'auto' || product.delivery_type === 'instant') && (
                                    <div className="px-5 py-2 bg-orange-600 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white flex items-center gap-2 shadow-[0_0_30px_rgba(234,88,12,0.4)]">
                                        <Zap className="w-4 h-4 fill-current" /> Instant Delivery
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        <div className="grid grid-cols-4 gap-4">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setMainImage(img)}
                                    className={`aspect-video rounded-2xl overflow-hidden border-2 transition-all ${mainImage === img ? 'border-orange-500 scale-105 ring-4 ring-orange-500/10' : 'border-white/5 opacity-50 hover:opacity-100'
                                        }`}
                                >
                                    <img src={img} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>

                        {/* Description Section */}
                        <div className="pt-12">
                            <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-6 flex items-center gap-3">
                                <Info className="w-6 h-6 text-orange-500" />
                                Information
                            </h2>
                            <div className="prose prose-invert max-w-none">
                                <p className="text-gray-400 text-lg leading-relaxed font-medium whitespace-pre-wrap">
                                    {product.description || `Experience the ultimate ${category} service with this premium listing. Our products are tested and verified for the highest security standards.`}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Purchase Options & Specs */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="sticky top-12">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-10 bg-[#0a0a0a] border border-white/5 rounded-[3rem] shadow-2xl space-y-8"
                            >
                                <div className="space-y-2">
                                    <h1 className="text-4xl lg:text-5xl font-black italic uppercase tracking-tighter leading-[0.9]">
                                        {product.title}
                                    </h1>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-5xl font-black italic text-white tracking-tighter">
                                            {formatPrice(product.price)}
                                        </span>
                                        {selectedCurrency !== 'USD' && (
                                            <span className="text-sm font-bold text-gray-600 uppercase">
                                                ~ ${Number(product.price).toFixed(2)} USD
                                            </span>
                                        )}
                                    </div>
                                    <div className={`flex items-center gap-3 py-1 px-4 rounded-full w-fit border ${(product.stock_mode !== 'limited' || (product.quantity_available != null && product.quantity_available > 0))
                                        ? 'bg-green-500/10 border-green-500/20'
                                        : 'bg-red-500/10 border-red-500/20'
                                        }`}>
                                        <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${(product.stock_mode !== 'limited' || (product.quantity_available != null && product.quantity_available > 0))
                                            ? 'bg-green-500'
                                            : 'bg-red-500'
                                            }`} />
                                        <span className={`text-[10px] font-black uppercase tracking-widest leading-none ${(product.stock_mode !== 'limited' || (product.quantity_available != null && product.quantity_available > 0))
                                            ? 'text-green-500'
                                            : 'text-red-500'
                                            }`}>
                                            {product.stock_mode === 'unlimited'
                                                ? 'IN STOCK'
                                                : product.stock_mode === 'limited'
                                                    ? ((product.quantity_available != null && product.quantity_available > 0) ? `${product.quantity_available} IN STOCK` : 'OUT OF STOCK')
                                                    : 'IN STOCK'}
                                        </span>
                                    </div>
                                </div>

                                {/* Quantity Selector */}
                                <div className="flex items-center justify-between p-4 bg-white/[0.03] rounded-2xl border border-white/5">
                                    <span className="text-[11px] font-black uppercase tracking-widest text-gray-400">Quantity</span>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setSelectedQuantity(q => Math.max(1, q - 1))}
                                            disabled={selectedQuantity <= 1}
                                            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="w-10 text-center font-black text-xl">{selectedQuantity}</span>
                                        <button
                                            onClick={() => setSelectedQuantity(q => Math.min(maxQuantity, q + 1))}
                                            disabled={selectedQuantity >= maxQuantity}
                                            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                {selectedQuantity > 1 && (
                                    <div className="flex items-baseline justify-between px-2">
                                        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Total</span>
                                        <span className="text-2xl font-black italic text-orange-500 tracking-tighter">
                                            {formatPrice(Number(product.price) * selectedQuantity)}
                                        </span>
                                    </div>
                                )}

                                {/* Purchase Buttons */}
                                <div className="grid gap-4">
                                    <button
                                        onClick={handleWishlistToggle}
                                        disabled={!user || isToggling}
                                        className={`w-full py-5 rounded-[2rem] font-black italic uppercase tracking-[0.1em] text-lg transition-all flex items-center justify-center gap-3 relative overflow-hidden group ${isWishlisted
                                            ? 'bg-red-600/10 border border-red-500/50 text-red-500 hover:bg-red-600/20'
                                            : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                                            }`}
                                    >
                                        <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} />
                                        {isWishlisted ? 'IN WISHLIST' : 'ADD TO WISHLIST'}
                                    </button>

                                    <button
                                        onClick={handleOrderClick}
                                        disabled={!user || isOutOfStock}
                                        className={`w-full py-5 rounded-[2rem] font-black italic uppercase tracking-[0.1em] text-lg transition-all flex items-center justify-center gap-3 ${!user
                                            ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                                            : isOutOfStock
                                                ? 'bg-red-500/10 border border-red-500/20 text-red-500 cursor-not-allowed'
                                                : 'bg-white text-black hover:bg-gray-100 hover:-translate-y-1'
                                            }`}
                                    >
                                        <Wallet className="w-6 h-6" />
                                        {!user
                                            ? 'LOGIN TO BUY'
                                            : isOutOfStock
                                                ? 'OUT OF STOCK'
                                                : 'INSTANT BUY'
                                        }
                                    </button>
                                </div>

                                {/* Quick Specs Table */}
                                <div className="space-y-4 pt-4">
                                    <p className="text-[10px] font-black uppercase text-gray-500 tracking-[0.3em] pl-1">Technical Intel</p>
                                    <div className="grid grid-cols-1 gap-2">
                                        <div className="flex justify-between items-center p-4 bg-white/[0.03] rounded-2xl border border-white/5">
                                            <span className="text-[11px] font-bold text-gray-400">DELIVERY SPEED</span>
                                            <span className="text-[11px] font-black text-orange-500 flex items-center gap-1.5">
                                                <Clock className="w-3.5 h-3.5" />
                                                {(product.delivery_type === 'auto' || product.delivery_type === 'instant') ? 'INSTANT' : (product.delivery_time || 'INSTANT')}
                                            </span>
                                        </div>
                                        {Object.entries(product.specs || {}).map(([key, spec]) => (
                                            <div key={key} className="flex justify-between items-center p-4 bg-white/[0.03] rounded-2xl border border-white/5">
                                                <span className="text-[11px] font-bold text-gray-400 capitalize">{spec.label || key.replace('_', ' ')}</span>
                                                <span className="text-[11px] font-black text-white">{spec.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4 flex items-center justify-between opacity-50 px-2">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck className="w-5 h-5 text-green-500" />
                                        <span className="text-[9px] font-black tracking-widest uppercase">Verified Trade</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            <OrderConfirmationModal
                isOpen={isOrderModalOpen}
                onClose={() => setIsOrderModalOpen(false)}
                product={product}
                user={user}
                formatPrice={formatPrice}
                refreshAuth={refreshMe}
                initialQuantity={selectedQuantity}
                onSuccess={() => router.push('/orders')}
            />
        </div>
    );
}

function OrderConfirmationModal({ isOpen, onClose, product, user, formatPrice, refreshAuth, initialQuantity = 1, onSuccess }) {
    const [step, setStep] = useState('summary');
    const [selectedAddons, setSelectedAddons] = useState({});
    const [quantity, setQuantity] = useState(initialQuantity);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const maxQuantity = product.stock_mode === 'limited'
        ? (product.quantity_available || 1)
        : 99;

    // Initialize step and default options
    useEffect(() => {
        if (isOpen) {
            const hasAddons = product.addons && Object.keys(product.addons).length > 0;

            setStep(hasAddons ? 'addons' : 'summary');
            setQuantity(initialQuantity);
            setTermsAccepted(false);
            setIsProcessing(false);

            // Default selections
            const defaults = {};
            if (hasAddons) {
                Object.entries(product.addons || {}).forEach(([category, options]) => {
                    const defaultOption = options.find(o => o.default) || options[0];
                    if (defaultOption) defaults[category] = defaultOption.key;
                });
            }
            setSelectedAddons(defaults);
        }
    }, [isOpen, product]);

    const handleOptionChange = (category, key) => {
        setSelectedAddons(prev => ({ ...prev, [category]: key }));
    };

    const handleConfirm = async () => {
        setIsProcessing(true);
        try {
            const payload = {
                product_id: product.id,
                quantity,
                terms_and_agreed_checked: true,
                addons: selectedAddons
            };

            await apiFetch('/orders', {
                method: 'POST',
                body: payload
            });

            toast.success('Order placed successfully!');
            if (refreshAuth) await refreshAuth();
            onClose();
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error(error);
            toast.error(error.message || 'Failed to place order');
        } finally {
            setIsProcessing(false);
        }
    };

    const addonsList = useMemo(() => {
        if (!product.addons) return [];
        return Object.entries(product.addons || {}).flatMap(([category, options]) => {
            const selectedKey = selectedAddons[category];
            const option = options.find(o => o.key === selectedKey);
            return option ? [{ ...option, category }] : [];
        });
    }, [product.addons, selectedAddons]);

    const unitPrice = useMemo(() => {
        const base = Number(product.price) || 0;
        const addonsTotal = addonsList.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);
        return base + addonsTotal;
    }, [product.price, addonsList]);

    const totalPrice = unitPrice * quantity;

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => !isProcessing && onClose()}
                    className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                />
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden"
                >
                    {/* Background Glow */}
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-orange-500/10 blur-[100px] rounded-full pointer-events-none" />
                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-orange-500/5 blur-[100px] rounded-full pointer-events-none" />

                    <div className="relative space-y-8">
                        <div className="flex justify-between items-start">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-black italic uppercase tracking-tighter">
                                    {step === 'addons' ? 'Customize Order' : 'Order Summary'}
                                </h2>
                                <div className="w-12 h-1 bg-orange-500 rounded-full" />
                            </div>
                            <button
                                onClick={onClose}
                                disabled={isProcessing}
                                className="p-2 hover:bg-white/5 rounded-full text-gray-500 hover:text-white transition-colors disabled:opacity-50"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {step === 'addons' && (
                            <div className="space-y-6">
                                <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                                    {Object.entries(product.addons || {}).map(([category, options]) => (
                                        <div key={category} className="space-y-3">
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                                {category.replace('_', ' ')}
                                            </h3>
                                            <div className="grid gap-2">
                                                {options.map((option) => {
                                                    const isSelected = selectedAddons[category] === option.key;
                                                    return (
                                                        <button
                                                            key={option.key}
                                                            onClick={() => handleOptionChange(category, option.key)}
                                                            className={`flex items-center justify-between p-4 rounded-xl border transition-all text-left ${isSelected ? 'bg-orange-500/10 border-orange-500 text-white' : 'bg-white/5 border-transparent hover:bg-white/10 text-gray-400'}`}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${isSelected ? 'border-orange-500 bg-orange-500' : 'border-gray-600'}`}>
                                                                    {isSelected && <Check className="w-3 h-3 text-white" />}
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className="font-bold uppercase tracking-tight text-xs">{option.label}</span>
                                                                    {option.duration_days && (
                                                                        <span className={`text-[9px] uppercase tracking-widest font-medium ${isSelected ? 'text-orange-200/70' : 'text-gray-500'}`}>
                                                                            {option.duration_days} Days Coverage
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <span className="text-xs font-black">
                                                                {option.price > 0 ? `+${formatPrice(option.price)}` : 'FREE'}
                                                            </span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setStep('summary')}
                                    className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-black italic uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2"
                                >
                                    Review Order <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        )}

                        {step === 'summary' && (
                            <div className="space-y-6">
                                <div className="bg-white/5 rounded-2xl p-6 space-y-4 border border-white/5">
                                    <div className="flex justify-between items-start pb-4 border-b border-white/5">
                                        <div>
                                            <h3 className="font-black italic uppercase text-lg">{product.title}</h3>
                                            <p className="text-xs text-gray-500 font-bold tracking-widest">{product.product_category}</p>
                                        </div>
                                        <p className="font-black text-xl">{formatPrice(product.price)}</p>
                                    </div>

                                    {addonsList.length > 0 && (
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Addons</p>
                                            {addonsList.map((addon, idx) => (
                                                <div key={idx} className="flex justify-between text-sm">
                                                    <span className="text-gray-300">{addon.label}</span>
                                                    <span className="text-gray-400">{addon.price > 0 ? `+${formatPrice(addon.price)}` : 'FREE'}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Quantity Selector */}
                                    <div className="flex justify-between items-center pt-4 border-t border-white/5">
                                        <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Quantity</span>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                                disabled={quantity <= 1 || isProcessing}
                                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="w-10 text-center font-black text-lg">{quantity}</span>
                                            <button
                                                onClick={() => setQuantity(q => Math.min(maxQuantity, q + 1))}
                                                disabled={quantity >= maxQuantity || isProcessing}
                                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    {product.stock_mode === 'limited' && (
                                        <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest text-right">
                                            {product.quantity_available} available
                                        </p>
                                    )}

                                    <div className="pt-4 border-t border-white/5 space-y-1">
                                        {quantity > 1 && (
                                            <div className="flex justify-between items-center text-gray-500 text-xs">
                                                <span className="font-bold uppercase tracking-widest">Unit Price</span>
                                                <span className="font-black">{formatPrice(unitPrice)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-center text-orange-500">
                                            <span className="font-black uppercase tracking-widest text-sm">Total</span>
                                            <span className="font-black text-2xl">{formatPrice(totalPrice)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-black/20 rounded-xl p-4 border border-white/5 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white/5 rounded-lg">
                                            <Wallet className="w-5 h-5 text-gray-400" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Available Balance</p>
                                            <p className="font-bold text-white">{formatPrice(user?.credits || 0)}</p>
                                        </div>
                                    </div>
                                    {Number(user?.credits || 0) < totalPrice && (
                                        <span className="text-xs font-black text-red-500 bg-red-500/10 px-2 py-1 rounded">Insufficient Funds</span>
                                    )}
                                </div>

                                <label className="flex gap-4 cursor-pointer group">
                                    <div className="relative flex items-start pt-1">
                                        <input
                                            type="checkbox"
                                            className="peer sr-only"
                                            checked={termsAccepted}
                                            onChange={(e) => setTermsAccepted(e.target.checked)}
                                            disabled={isProcessing}
                                        />
                                        <div className="w-5 h-5 border border-white/20 rounded-md bg-white/5 peer-checked:bg-orange-500 peer-checked:border-orange-500 transition-all" />
                                        <Check className="absolute top-1.5 left-0.5 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                                    </div>
                                    <p className="text-xs text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                                        I have read, understood, and agree to the Terms, Refund Policy, Warranty Policy, and Anti-Chargeback terms. I acknowledge that all digital sales are final and that I am responsible for account security.
                                    </p>
                                </label>

                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => {
                                            if (product.addons && Object.keys(product.addons).length > 0) {
                                                setStep('addons');
                                            } else {
                                                onClose();
                                            }
                                        }}
                                        disabled={isProcessing}
                                        className="py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black italic uppercase tracking-widest transition-all disabled:opacity-50"
                                    >
                                        {step === 'summary' && product.addons && Object.keys(product.addons).length > 0 ? 'Back' : 'Cancel'}
                                    </button>
                                    <button
                                        onClick={handleConfirm}
                                        disabled={!termsAccepted || Number(user?.credits || 0) < totalPrice || isProcessing}
                                        className="py-4 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-black italic uppercase tracking-widest transition-all shadow-lg hover:shadow-orange-500/20 flex items-center justify-center gap-2"
                                    >
                                        {isProcessing ? 'Processing...' : 'Confirm'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
