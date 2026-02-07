'use client';
import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, Mail, MapPin, Phone, ArrowRight, Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-black border-t border-gray-800 pt-16 pb-8 relative overflow-hidden">
            {/* Ambient Glow */}
            <div className="absolute bottom-0 left-0 w-full h-[500px] bg-gradient-to-t from-orange-900/10 to-transparent pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">Ark</span>
                            </div>
                            <span className="text-xl font-bold text-white">ARKD</span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            The world's most secure marketplace for gamers. Buy, sell, and trade virtual assets with confidence and instant delivery.
                        </p>
                        <div className="flex space-x-4">
                            {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:bg-orange-500 hover:text-white transition-all duration-300">
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Marketplace</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><Link href="/services/accounts" className="hover:text-orange-500 transition-colors">Game Accounts</Link></li>
                            <li><Link href="/services/items" className="hover:text-orange-500 transition-colors">In-Game Items</Link></li>
                            <li><Link href="/services/currencies" className="hover:text-orange-500 transition-colors">Currencies</Link></li>
                            <li><Link href="/services/top-ups" className="hover:text-orange-500 transition-colors">Top Ups</Link></li>
                            <li><Link href="/services/gift-cards" className="hover:text-orange-500 transition-colors">Gift Cards</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Support</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><Link href="/help" className="hover:text-orange-500 transition-colors">Help Center</Link></li>
                            <li><Link href="/contact" className="hover:text-orange-500 transition-colors">Contact Us</Link></li>
                            <li><Link href="/faq" className="hover:text-orange-500 transition-colors">FAQ</Link></li>
                            <li><Link href="/terms" className="hover:text-orange-500 transition-colors">Terms of Service</Link></li>
                            <li><Link href="/privacy" className="hover:text-orange-500 transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Contact & Newsletter */}
                    <div className="space-y-6">
                        <h4 className="text-white font-bold mb-6">Stay Updated</h4>
                        <p className="text-gray-400 text-sm">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
                        <div className="relative">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full bg-gray-900 border border-gray-800 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                            />
                            <button className="absolute right-2 top-2 p-1.5 bg-orange-500 rounded-lg text-white hover:bg-orange-600 transition-colors">
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
                    <p>&copy; 2024 ARKD. All rights reserved.</p>
                    <div className="flex items-center space-x-1 mt-4 md:mt-0">
                        <span>Made with</span>
                        <Heart className="w-3 h-3 text-red-500 fill-current" />
                        <span>for gamers</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
