'use client';
import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, Mail, MapPin, Phone, ArrowRight, Heart, Sparkles } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-black border-t border-white/[0.08] pt-16 pb-8 relative overflow-hidden">
            {/* Background gradient orbs */}
            <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full h-[500px] bg-gradient-to-t from-orange-900/10 to-transparent pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {/* Brand Column */}
                    <div className="p-6 rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-sm border border-white/[0.08] space-y-6">
                        <Link href="/" className="flex items-center space-x-2 group">
                            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.4)] group-hover:shadow-[0_0_20px_rgba(249,115,22,0.6)] transition-shadow">
                                <span className="text-white font-bold text-sm">Ark</span>
                            </div>
                            <span className="text-xl font-black text-white uppercase tracking-tight">ARKD</span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            The world's most secure marketplace for gamers. Buy, sell, and trade virtual assets with confidence and instant delivery.
                        </p>
                        <div className="flex space-x-3">
                            {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-gray-400 hover:bg-orange-500/10 hover:border-orange-500/30 hover:text-orange-400 transition-all duration-300">
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="p-6 rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-sm border border-white/[0.08]">
                        <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Marketplace</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link href="/services/accounts" className="hover:text-orange-400 transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-orange-500/50"></span>Game Accounts</Link></li>
                            <li><Link href="/services/items" className="hover:text-orange-400 transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-orange-500/50"></span>In-Game Items</Link></li>
                            <li><Link href="/services/currencies" className="hover:text-orange-400 transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-orange-500/50"></span>Currencies</Link></li>
                            <li><Link href="/services/top-ups" className="hover:text-orange-400 transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-orange-500/50"></span>Top Ups</Link></li>
                            <li><Link href="/services/gift-cards" className="hover:text-orange-400 transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-orange-500/50"></span>Gift Cards</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="p-6 rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-sm border border-white/[0.08]">
                        <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Support</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link href="/help" className="hover:text-orange-400 transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-blue-500/50"></span>Help Center</Link></li>
                            <li><Link href="/contact" className="hover:text-orange-400 transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-blue-500/50"></span>Contact Us</Link></li>
                            <li><Link href="/faq" className="hover:text-orange-400 transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-blue-500/50"></span>FAQ</Link></li>
                            <li><Link href="/terms" className="hover:text-orange-400 transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-blue-500/50"></span>Terms of Service</Link></li>
                            <li><Link href="/privacy" className="hover:text-orange-400 transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-blue-500/50"></span>Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Contact & Newsletter */}
                    <div className="p-6 rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-sm border border-white/[0.08] space-y-6">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-orange-400" />
                            <h4 className="text-white font-bold uppercase tracking-wider text-sm">Stay Updated</h4>
                        </div>
                        <p className="text-gray-400 text-sm">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
                        <div className="relative">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full bg-white/[0.04] border border-white/[0.08] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-orange-500/30 focus:bg-white/[0.06] transition-colors"
                            />
                            <button className="absolute right-2 top-2 p-1.5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg text-white hover:shadow-[0_0_15px_rgba(249,115,22,0.4)] transition-shadow">
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/[0.08] pt-8 flex flex-col md:flex-row items-center justify-center text-xs text-gray-500">
                    <p>&copy; 2024 ARKD. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
