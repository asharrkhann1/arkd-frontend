'use client';
import React from 'react';
import Link from 'next/link';
import { Mail, MessageCircle, AlertCircle,CheckCircle, MessageSquare, Send, Headphones, Shield, HelpCircle } from 'lucide-react';

const ContactUs = () => {

    return (
        <div className="min-h-screen bg-black">
            {/* Header */}
            <div className="bg-gradient-to-b from-orange-500/10 to-black border-b border-white/[0.08] py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] mb-6">
                            <MessageSquare className="w-4 h-4 text-orange-400" />
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Get In Touch</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 uppercase tracking-tight">
                            CONTACT <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">SUPPORT</span>
                        </h1>
                        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
                            Feel free to contact us 24/7 with any questions that you have about Arkd. We are always online to help you out!
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Contact Info Sidebar */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Quick Contact Options */}
                            <div className="p-6 rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-sm border border-white/[0.08]">
                                <Headphones className="w-8 h-8 text-orange-400 mb-4" />
                                <h3 className="text-lg font-bold text-white mb-3">Quick Contact</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                        <span className="text-green-400 font-semibold">Live Chat: Available 24/7</span>
                                    </div>
                                    <div className="text-gray-300">
                                        <p className="mb-2"><strong className="text-white">Email:</strong></p>
                                        <a href="mailto:support@arkd.shop" className="text-orange-400 hover:text-orange-300 font-semibold block">
                                            support@arkd.shop
                                        </a>
                                    </div>
                                </div>
                                <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                                    <p className="text-xs text-green-300">
                                        <strong>Always Online:</strong> We are always online to help you out!
                                    </p>
                                </div>
                            </div>

                            {/* Why Choose Live Chat */}
                            <div className="p-6 rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-sm border border-white/[0.08]">
                                <MessageCircle className="w-8 h-8 text-orange-400 mb-4" />
                                <h3 className="text-lg font-bold text-white mb-3">Why Live Chat?</h3>
                                <ul className="space-y-2 text-sm text-gray-300">
                                    <li className="flex items-start gap-2">
                                        <span className="text-orange-400 mt-1">•</span>
                                        <span>Instant responses in real-time</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-orange-400 mt-1">•</span>
                                        <span>No waiting for email replies</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-orange-400 mt-1">•</span>
                                        <span>Quick problem resolution</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-orange-400 mt-1">•</span>
                                        <span>Available 24 hours, 7 days a week</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Important Notice */}
                            <div className="p-6 rounded-2xl bg-gradient-to-b from-red-500/10 to-white/[0.02] backdrop-blur-sm border border-red-500/30">
                                <AlertCircle className="w-8 h-8 text-red-400 mb-4" />
                                <h3 className="text-lg font-bold text-white mb-3">Before Filing a Chargeback</h3>
                                <p className="text-sm text-gray-300 leading-relaxed">
                                    Please contact us first! Chargeback abuse may result in permanent account suspension. We're here to resolve all legitimate issues.
                                </p>
                            </div>

                            {/* Quick Links */}
                            <div className="p-6 rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-sm border border-white/[0.08]">
                                <HelpCircle className="w-8 h-8 text-orange-400 mb-4" />
                                <h3 className="text-lg font-bold text-white mb-3">Quick Links</h3>
                                <div className="space-y-2 text-sm">
                                    <Link href="/faq" className="block text-orange-400 hover:text-orange-300 transition-colors">
                                        → Frequently Asked Questions
                                    </Link>
                                    <Link href="/terms" className="block text-orange-400 hover:text-orange-300 transition-colors">
                                        → Terms of Service
                                    </Link>
                                    <Link href="/privacy" className="block text-orange-400 hover:text-orange-300 transition-colors">
                                        → Privacy Policy
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Live Chat & Contact Options */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Live Chat Card */}
                            <div className="p-8 rounded-2xl bg-gradient-to-b from-orange-500/10 to-white/[0.02] backdrop-blur-sm border border-orange-500/30">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 p-[2px]">
                                        <div className="w-full h-full rounded-xl bg-black flex items-center justify-center">
                                            <MessageCircle className="w-8 h-8 text-orange-400" />
                                        </div>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-white">Start Live Chat</h2>
                                        <p className="text-gray-400">Get instant help from our support team</p>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                                        <span className="text-green-400 font-semibold">Available Now</span>
                                    </div>
                                    <p className="text-gray-300 leading-relaxed">
                                        Connect with our support team instantly through live chat. We're online 24/7 to help you with any questions about Arkd.
                                    </p>
                                </div>

                                <button 
                                    onClick={() => window.openChat?.()}
                                    className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] flex items-center justify-center gap-2"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                    Start Live Chat
                                </button>
                            </div>

                            {/* Email Contact Card */}
                            <div className="p-8 rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-sm border border-white/[0.08]">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-[2px]">
                                        <div className="w-full h-full rounded-xl bg-black flex items-center justify-center">
                                            <Mail className="w-8 h-8 text-blue-400" />
                                        </div>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-white">Email Us</h2>
                                        <p className="text-gray-400">Send us a detailed message</p>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-6">
                                    <p className="text-gray-300 leading-relaxed">
                                        If you prefer, you can write us an email instead at <strong className="text-blue-400">support@arkd.shop</strong>
                                    </p>
                                    <p className="text-gray-300 leading-relaxed">
                                        We'll respond to your email as quickly as possible, typically within a few hours.
                                    </p>
                                </div>

                                <a
                                    href="mailto:support@arkd.shop"
                                    className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] flex items-center justify-center gap-2"
                                >
                                    <Mail className="w-5 h-5" />
                                    Send Email
                                </a>
                            </div>

                            {/* 24/7 Availability */}
                            <div className="p-6 rounded-2xl bg-gradient-to-b from-green-500/10 to-white/[0.02] backdrop-blur-sm border border-green-500/30">
                                <div className="flex items-start gap-4">
                                    <Headphones className="w-8 h-8 text-green-400 flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-2">24/7 Support Available</h3>
                                        <p className="text-sm text-gray-300 leading-relaxed">
                                            Feel free to contact us 24/7 with any questions that you have about Arkd. We are always online to help you out! Whether it's day or night, our support team is ready to assist you.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Info Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                        <div className="p-6 rounded-xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/[0.08] text-center">
                            <Shield className="w-10 h-10 text-orange-400 mx-auto mb-3" />
                            <h3 className="text-white font-bold mb-2">Secure Communication</h3>
                            <p className="text-sm text-gray-400">All messages are encrypted and handled securely</p>
                        </div>

                        <div className="p-6 rounded-xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/[0.08] text-center">
                            <MessageSquare className="w-10 h-10 text-orange-400 mx-auto mb-3" />
                            <h3 className="text-white font-bold mb-2">Professional Support</h3>
                            <p className="text-sm text-gray-400">Experienced team ready to help with any issue</p>
                        </div>

                        <div className="p-6 rounded-xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/[0.08] text-center">
                            <CheckCircle className="w-10 h-10 text-orange-400 mx-auto mb-3" />
                            <h3 className="text-white font-bold mb-2">Quick Resolution</h3>
                            <p className="text-sm text-gray-400">We aim to resolve all issues promptly</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
