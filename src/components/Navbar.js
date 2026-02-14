'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '@/contexts/DataContext';
import {
    Search,
    User,
    Plus,
    Heart,
    X,
    LogIn,
    Settings,
    LogOut,
    Globe,
    ChevronDown,
    Users,
    Coins,
    Package,
    Wallet,
    Gift,
    Zap,
    Headphones,
    Shield,
    Star,
    Menu,
    Bell,
    Flag
} from 'lucide-react';
import {
    serviceConfigs
} from '../constants/servicesConfig';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useWishlist } from '@/contexts/WishlistContext';

const Navbar = ({ initialPendingOrders = [] }) => {
    const { user, loading, logout } = useAuth();
    const { services, orders = [] } = useData();
    const { wishlist } = useWishlist();
    const { selectedCurrency, setSelectedCurrency, formatPrice, availableCurrencies } = useCurrency();
    const wishlistCount = wishlist.length;

    const navigate = useRouter();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [currencyMenuOpen, setCurrencyMenuOpen] = useState(false);
    const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);

    // Derive pending orders from pre-fetched orders
    const pendingOrders = user && orders.length > 0
        ? orders.filter(order => order.status !== 'delivered' && order.status !== 'completed')
        : [];

    // Mobile Accordion States
    const [servicesMenuOpen, setServicesMenuOpen] = useState(false);
    const [mobileCurrencyOpen, setMobileCurrencyOpen] = useState(false);

    const servicesRef = useRef(null);
    const currencyRef = useRef(null);
    const userMenuRef = useRef(null);
    const notificationRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (servicesRef.current && !servicesRef.current.contains(event.target)) {
                setServicesMenuOpen(false);
            }
            if (currencyRef.current && !currencyRef.current.contains(event.target)) {
                setCurrencyMenuOpen(false);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setUserMenuOpen(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setNotificationMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        setUserMenuOpen(false);
        navigate.push('/');
    };

    const handleCurrencyChange = (currencyCode) => {
        setSelectedCurrency(currencyCode);
        setCurrencyMenuOpen(false);
        setMobileCurrencyOpen(false);
    };

    return (
        <header className="sticky top-0 z-50 bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-xl border-b border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo and Main Navigation */}
                    <div className="flex items-center space-x-6">
                        <Link href="/" className="flex items-center space-x-2 group">
                            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.4)] group-hover:shadow-[0_0_20px_rgba(249,115,22,0.6)] transition-shadow">
                                <span className="text-white font-bold text-sm">Ark</span>
                            </div>
                            <span className="text-xl font-black text-white uppercase tracking-tight">
                                ARKD
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-6">
                            {/* Services Mega Menu */}
                            <div
                                className="relative"
                                ref={servicesRef}
                            >
                                <button
                                    type="button"
                                    onClick={() => setServicesMenuOpen(prev => !prev)}
                                    className="flex items-center space-x-1 text-gray-300 hover:text-orange-500 transition-colors py-2 z-50 relative"
                                >
                                    <span>Services</span>
                                    <ChevronDown className={`w-4 h-4 transition-transform ${servicesMenuOpen ? 'rotate-180' : ''} pointer-events-none`} />
                                </button>

                                <AnimatePresence>
                                    {servicesMenuOpen && (
                                        <>
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                onClick={() => setServicesMenuOpen(false)}
                                                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 top-[64px]"
                                            />
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.2 }}
                                                className="fixed left-1/2 top-20 -translate-x-1/2 w-[95vw] max-w-[850px] bg-gradient-to-b from-[#1a1a1f]/90 to-[#141419]/90 backdrop-blur-xl border border-white/[0.12] rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] z-50 overflow-hidden"
                                            >
                                                {/* Services Grid */}
                                                <div className="grid grid-cols-3 gap-6 p-6">
                                                    {services && services.map((service) => {
                                                        const type = typeof service === 'string' ? service : service.type;
                                                        const config = serviceConfigs[type];
                                                        if (!config) return null;
                                                        const Icon = config.icon;
                                                        return (
                                                            <Link
                                                                key={type}
                                                                href={config.href}
                                                                className="group flex items-start space-x-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-orange-500/10 hover:border-orange-500/30 transition-all duration-200"
                                                                onClick={() => setServicesMenuOpen(false)}
                                                            >
                                                                <div className={`p-2 bg-gradient-to-br ${config.color} rounded-lg bg-opacity-20 group-hover:scale-110 transition-transform`}>
                                                                    <Icon className="w-5 h-5 text-white" />
                                                                </div>
                                                                <div>
                                                                    <h3 className="text-white font-bold group-hover:text-orange-400 transition-colors">{config.title}</h3>
                                                                    <p className="text-xs text-gray-500">{config.description}</p>
                                                                </div>
                                                            </Link>
                                                        );
                                                    })}
                                                </div>

                                                {/* Premium Bottom Bar - Feature Highlights */}
                                                <div className="border-t border-white/[0.08] bg-white/[0.02] px-8 py-4">
                                                    <div className="flex items-center justify-around">
                                                        <div className="flex items-center space-x-2 text-sm">
                                                            <div className="w-6 h-6 rounded-md bg-orange-500/20 flex items-center justify-center">
                                                                <Zap className="w-3.5 h-3.5 text-orange-400" />
                                                            </div>
                                                            <span className="text-gray-300 font-medium">Instant Delivery</span>
                                                        </div>
                                                        <div className="flex items-center space-x-2 text-sm">
                                                            <div className="w-6 h-6 rounded-md bg-blue-500/20 flex items-center justify-center">
                                                                <Headphones className="w-3.5 h-3.5 text-blue-400" />
                                                            </div>
                                                            <span className="text-gray-300 font-medium">24/7 Support</span>
                                                        </div>
                                                        <div className="flex items-center space-x-2 text-sm">
                                                            <div className="w-6 h-6 rounded-md bg-green-500/20 flex items-center justify-center">
                                                                <Shield className="w-3.5 h-3.5 text-green-400" />
                                                            </div>
                                                            <span className="text-gray-300 font-medium">Free Warranty</span>
                                                        </div>
                                                        <div className="flex items-center space-x-2 text-sm">
                                                            <div className="w-6 h-6 rounded-md bg-purple-500/20 flex items-center justify-center">
                                                                <Star className="w-3.5 h-3.5 text-purple-400" />
                                                            </div>
                                                            <span className="text-gray-300 font-medium">+1.3M Reviews</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>
                        </nav>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center space-x-4">
                        {/* Desktop Wishlist */}
                        <Link
                            href="/wishlist"
                            className="hidden md:flex relative p-2 text-gray-300 hover:text-orange-500 transition-colors"
                        >
                            <Heart className="w-6 h-6" />
                            {wishlistCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-600 text-[10px] font-bold text-white ring-2 ring-black">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>

                        {/* Desktop Notifications Bell */}
                        {user && (
                            <div className="relative hidden md:block" ref={notificationRef}>
                                <button
                                    onClick={() => setNotificationMenuOpen(!notificationMenuOpen)}
                                    className="relative p-2 text-gray-300 hover:text-orange-500 transition-colors"
                                >
                                    <Bell className="w-6 h-6" />
                                    {pendingOrders.length > 0 && (
                                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-600 text-[10px] font-bold text-white ring-2 ring-black">
                                            {pendingOrders.length}
                                        </span>
                                    )}
                                </button>

                                <AnimatePresence>
                                    {notificationMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 mt-2 w-80 bg-gradient-to-b from-[#1a1a1f] to-[#141419] backdrop-blur-xl border border-white/[0.12] rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.4)] z-50 overflow-hidden"
                                        >
                                            <div className="p-4 border-b border-white/[0.08] bg-white/[0.02]">
                                                <h3 className="text-sm font-black uppercase tracking-widest text-white">Pending Orders</h3>
                                            </div>
                                            <div className="max-h-96 overflow-y-auto">
                                                {pendingOrders.length > 0 ? (
                                                    pendingOrders.map((order) => (
                                                        <Link
                                                            key={order.id}
                                                            href={`/orders/${order.id}`}
                                                            onClick={() => setNotificationMenuOpen(false)}
                                                            className="block p-4 hover:bg-white/5 transition-colors border-b border-gray-800/50"
                                                        >
                                                            <div className="flex items-start gap-3">
                                                                <div className="p-2 bg-orange-500/10 rounded-lg flex-shrink-0">
                                                                    <Package className="w-4 h-4 text-orange-500" />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-sm font-bold text-white truncate">
                                                                        {order.product_snapshot?.title || `Order #${order.id}`}
                                                                    </p>
                                                                    <p className="text-xs text-gray-400 mt-1">
                                                                        Order #{order.id}
                                                                    </p>
                                                                    <div className="flex items-center gap-2 mt-2">
                                                                        <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-full ${order.status === 'pending' ? 'bg-orange-500/10 text-orange-500' :
                                                                            order.status === 'processing' ? 'bg-blue-500/10 text-blue-500' :
                                                                                'bg-gray-500/10 text-gray-500'
                                                                            }`}>
                                                                            {order.status}
                                                                        </span>
                                                                        <span className="text-[9px] text-gray-600">
                                                                            {new Date(order.created_at).toLocaleDateString()}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    ))
                                                ) : (
                                                    <div className="p-8 text-center">
                                                        <Package className="w-8 h-8 text-gray-700 mx-auto mb-3" />
                                                        <p className="text-sm text-gray-500">No pending orders</p>
                                                    </div>
                                                )}
                                            </div>
                                            {pendingOrders.length > 0 && (
                                                <div className="p-3 border-t border-gray-700 bg-gray-800/20">
                                                    <Link
                                                        href="/orders"
                                                        onClick={() => setNotificationMenuOpen(false)}
                                                        className="block text-center text-xs font-bold uppercase tracking-widest text-orange-500 hover:text-orange-400 transition-colors"
                                                    >
                                                        View All Orders
                                                    </Link>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}

                        {/* Desktop Currency Selector */}
                        <div className="relative hidden md:block" ref={currencyRef}>
                            <button
                                onClick={() => setCurrencyMenuOpen(!currencyMenuOpen)}
                                className="flex items-center space-x-2 p-2 text-gray-300 hover:text-orange-500 transition-colors"
                            >
                                <span className="text-sm font-medium">{selectedCurrency}</span>
                                <ChevronDown className={`w-4 h-4 transition-transform ${currencyMenuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {currencyMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 mt-2 w-32 bg-gradient-to-b from-[#1a1a1f] to-[#141419] backdrop-blur-xl border border-white/[0.12] rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.4)] z-50 overflow-hidden"
                                    >
                                        <div className="py-1">
                                            {availableCurrencies.map((currency) => (
                                                <button
                                                    key={currency.code}
                                                    onClick={() => handleCurrencyChange(currency.code)}
                                                    className={`w-full flex items-center justify-between px-4 py-2 text-sm transition-colors ${selectedCurrency === currency.code
                                                        ? 'bg-gradient-to-r from-orange-500/10 to-orange-600/10 text-orange-500'
                                                        : 'text-gray-300 hover:bg-white/[0.03]'
                                                        }`}
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <span>{currency.flag}</span>
                                                        <span>{currency.code}</span>
                                                    </div>
                                                    <span className="text-gray-500">{currency.symbol}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* User Menu */}
                        {loading ? (
                            <div className="p-2">
                                <div className="w-8 h-8 rounded-full border-2 border-orange-500/20 border-t-orange-500 animate-spin" />
                            </div>
                        ) : user ? (
                            <div className="relative" ref={userMenuRef}>
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center space-x-2 p-2 text-gray-300 hover:text-orange-500 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                                        <User className="w-5 h-5 text-orange-500" />
                                    </div>
                                    <div className="hidden sm:flex flex-col items-start leading-tight">
                                        <span className="text-sm font-semibold text-white group-hover:text-orange-500 transition-colors">
                                            {user.username || user.name}
                                        </span>
                                        <span className="text-[10px] text-gray-400 capitalize">{user.role || 'Member'}</span>
                                    </div>
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {userMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 mt-2 w-56 bg-gradient-to-b from-[#1a1a1f] to-[#141419] backdrop-blur-3xl border border-white/[0.12] rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.4)] z-50 overflow-hidden glassmorphism"
                                        >
                                            <div className="p-4 border-b border-white/[0.08] bg-white/[0.02] space-y-3">
                                                <div className="flex flex-col">
                                                    <p className="text-sm font-bold text-white truncate">{user.username || user.name}</p>
                                                    <p className="text-[10px] text-gray-400 truncate uppercase tracking-widest">{user.email}</p>
                                                </div>
                                                <div className="flex items-center justify-between p-2.5 bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-lg glassmorphism">
                                                    <div className="flex items-center gap-2">
                                                        <Wallet className="w-3.5 h-3.5 text-orange-500" />
                                                        <span className="text-[10px] font-black uppercase text-gray-500 tracking-wider">Balance</span>
                                                    </div>
                                                    <span className="text-xs font-black italic text-orange-500 tracking-tighter">{formatPrice(user.credits || 0)}</span>
                                                </div>
                                            </div>

                                            <div className="p-2">
                                                <Link
                                                    href="/wallet"
                                                    className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-300 hover:bg-orange-500/10 hover:text-orange-500 rounded-lg transition-colors"
                                                    onClick={() => setUserMenuOpen(false)}
                                                >
                                                    <Plus className="w-4 h-4" />
                                                    <span>Add Balance</span>
                                                </Link>
                                                <Link
                                                    href="/orders"
                                                    className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-300 hover:bg-orange-500/10 hover:text-orange-500 rounded-lg transition-colors"
                                                    onClick={() => setUserMenuOpen(false)}
                                                >
                                                    <Package className="w-4 h-4" />
                                                    <span>My Orders</span>
                                                </Link>
                                                <Link
                                                    href="/ticket"
                                                    className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-300 hover:bg-orange-500/10 hover:text-orange-500 rounded-lg transition-colors"
                                                    onClick={() => setUserMenuOpen(false)}
                                                >
                                                    <Flag className="w-4 h-4" />
                                                    <span>My Disputes</span>
                                                </Link>
                                                <Link
                                                    href="/profile"
                                                    className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-300 hover:bg-orange-500/10 hover:text-orange-500 rounded-lg transition-colors"
                                                    onClick={() => setUserMenuOpen(false)}
                                                >
                                                    <User className="w-4 h-4" />
                                                    <span>My Profile</span>
                                                </Link>
                                                {user.role === 'admin' && (
                                                    <Link
                                                        href="/admin"
                                                        className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-300 hover:bg-orange-500/10 hover:text-orange-500 rounded-lg transition-colors"
                                                        onClick={() => setUserMenuOpen(false)}
                                                    >
                                                        <Settings className="w-4 h-4" />
                                                        <span>Admin Dashboard</span>
                                                    </Link>
                                                )}
                                                <div className="my-2 border-t border-gray-700" />
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center space-x-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors w-full text-left"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    <span>Logout Account</span>
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-xl hover:from-orange-500 hover:to-orange-400 transition-all duration-300 shadow-[0_4px_15px_rgba(234,88,12,0.3)] hover:shadow-[0_8px_25px_rgba(234,88,12,0.4)] transform hover:-translate-y-0.5"
                            >
                                <LogIn className="w-4 h-4" />
                                <span className="font-semibold text-sm">Login</span>
                            </Link>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 text-gray-300"
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden border-t border-gray-800 mt-4 pt-4"
                        >
                            <nav className="flex flex-col space-y-4 pb-6 px-2">
                                {/* Mobile Services Accordion */}
                                <div className="border rounded-lg border-gray-700 overflow-hidden">
                                    <button
                                        onClick={() => setServicesMenuOpen(!servicesMenuOpen)}
                                        className="w-full flex items-center justify-between p-3 bg-gray-800/50 text-gray-200"
                                    >
                                        <span className="font-medium">Services</span>
                                        <ChevronDown className={`w-4 h-4 transition-transform ${servicesMenuOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    <AnimatePresence>
                                        {servicesMenuOpen && (
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: 'auto' }}
                                                exit={{ height: 0 }}
                                                className="overflow-hidden bg-gray-900/50"
                                            >
                                                <div className="p-2 space-y-1">
                                                    {services && services.map((service) => {
                                                        const type = typeof service === 'string' ? service : service.type;
                                                        const config = serviceConfigs[type];
                                                        if (!config) return null;
                                                        return (
                                                            <Link
                                                                key={type}
                                                                href={config.href}
                                                                className="block p-2 text-sm text-gray-400 hover:text-orange-500 rounded hover:bg-gray-800"
                                                                onClick={() => {
                                                                    setServicesMenuOpen(false);
                                                                    setMobileMenuOpen(false);
                                                                }}
                                                            >
                                                                {config.title}
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Mobile Currency Accordion */}
                                <div className="border rounded-lg border-gray-700 overflow-hidden">
                                    <button
                                        onClick={() => setMobileCurrencyOpen(!mobileCurrencyOpen)}
                                        className="w-full flex items-center justify-between p-3 bg-gray-800/50 text-gray-200"
                                    >
                                        <span className="font-medium">Currency ({selectedCurrency})</span>
                                        <ChevronDown className={`w-4 h-4 transition-transform ${mobileCurrencyOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    <AnimatePresence>
                                        {mobileCurrencyOpen && (
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: 'auto' }}
                                                exit={{ height: 0 }}
                                                className="overflow-hidden bg-gray-900/50"
                                            >
                                                <div className="p-2 space-y-1">
                                                    {availableCurrencies.map((currency) => (
                                                        <button
                                                            key={currency.code}
                                                            onClick={() => handleCurrencyChange(currency.code)}
                                                            className={`w-full flex items-center justify-between p-2 text-sm rounded transition-colors ${selectedCurrency === currency.code
                                                                ? 'bg-orange-900/40 text-orange-500'
                                                                : 'text-gray-400 hover:bg-gray-800'
                                                                }`}
                                                        >
                                                            <div className="flex items-center space-x-2">
                                                                <span className="text-lg">{currency.flag}</span>
                                                                <span>{currency.code}</span>
                                                            </div>
                                                            <span className="text-gray-500 font-medium">{currency.symbol}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Mobile Wishlist Link */}
                                <Link
                                    href="/wishlist"
                                    className="flex items-center justify-between p-3 border border-gray-700 rounded-lg bg-gray-800/50 text-gray-200 hover:border-orange-500/50 hover:text-orange-500 transition-all"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <div className="flex items-center space-x-3">
                                        <Heart className="w-5 h-5" />
                                        <span className="font-medium">Wishlist</span>
                                    </div>
                                    <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">{wishlistCount}</span>
                                </Link>
                                {/* Mobile User Actions */}
                                <div className="pt-4 border-t border-gray-800 flex flex-col space-y-3">
                                    {loading ? (
                                        <div className="flex items-center justify-center p-4">
                                            <div className="w-6 h-6 border-2 border-orange-500/20 border-t-orange-500 animate-spin rounded-full" />
                                        </div>
                                    ) : user ? (
                                        <>
                                            <div className="flex flex-col bg-gray-800/40 rounded-xl border border-gray-700 overflow-hidden">
                                                <div className="flex items-center space-x-3 p-3 border-b border-gray-700">
                                                    <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                                                        <User className="w-6 h-6 text-orange-500" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-white font-bold">{user.username || user.name}</span>
                                                        <span className="text-xs text-gray-400 truncate">{user.email}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-orange-600/5">
                                                    <div className="flex items-center gap-2">
                                                        <Wallet className="w-4 h-4 text-orange-500" />
                                                        <span className="text-xs font-black uppercase text-gray-500 tracking-wider">Balance</span>
                                                    </div>
                                                    <span className="text-sm font-black italic text-orange-500 tracking-tighter">{formatPrice(user.credits || 0)}</span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <Link
                                                    href="/wallet"
                                                    className="flex items-center justify-center space-x-2 bg-orange-600/10 p-2.5 rounded-lg text-sm text-orange-500 border border-orange-500/20"
                                                    onClick={() => setMobileMenuOpen(false)}
                                                >
                                                    <Plus className="w-4 h-4" />
                                                    <span>Add Balance</span>
                                                </Link>
                                                <Link
                                                    href="/orders"
                                                    className="flex items-center justify-center space-x-2 bg-gray-800 p-2.5 rounded-lg text-sm text-gray-300"
                                                    onClick={() => setMobileMenuOpen(false)}
                                                >
                                                    <Package className="w-4 h-4" />
                                                    <span>Orders</span>
                                                </Link>
                                                <Link
                                                    href="/ticket"
                                                    className="flex items-center justify-center space-x-2 bg-gray-800 p-2.5 rounded-lg text-sm text-gray-300"
                                                    onClick={() => setMobileMenuOpen(false)}
                                                >
                                                    <Flag className="w-4 h-4" />
                                                    <span>Disputes</span>
                                                </Link>
                                                <Link
                                                    href="/profile"
                                                    className="flex items-center justify-center space-x-2 bg-gray-800 p-2.5 rounded-lg text-sm text-gray-300"
                                                    onClick={() => setMobileMenuOpen(false)}
                                                >
                                                    <User className="w-4 h-4" />
                                                    <span>Profile</span>
                                                </Link>
                                                <button onClick={handleLogout} className="flex items-center justify-center space-x-2 bg-red-500/10 p-2.5 rounded-lg text-sm text-red-400">
                                                    <LogOut className="w-4 h-4" />
                                                    <span>Logout</span>
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <Link
                                            href="/login"
                                            className="w-full py-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white text-center rounded-xl font-bold shadow-lg"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Login / Create Account
                                        </Link>
                                    )}
                                </div>
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
};

export default Navbar;
