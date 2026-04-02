'use client';
import React from 'react';
import Link from 'next/link';
import { Shield, Lock, Eye, Database, UserCheck, FileText } from 'lucide-react';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-black">
            {/* Header */}
            <div className="bg-gradient-to-b from-orange-500/10 to-black border-b border-white/[0.08] py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] mb-6">
                            <Shield className="w-4 h-4 text-orange-400" />
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Your Privacy Matters</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 uppercase tracking-tight">
                            PRIVACY <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">POLICY</span>
                        </h1>
                        <p className="text-gray-400 text-sm">Last Updated: April 2, 2026</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    {/* Introduction */}
                    <section className="mb-12 p-8 rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-sm border border-white/[0.08]">
                        <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                            <Shield className="w-6 h-6 text-orange-400" />
                            Our Commitment to Privacy
                        </h2>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            At ARKD, we take your privacy seriously. This Privacy Policy explains how we collect, use, protect, and handle your personal information when you use our digital marketplace.
                        </p>
                        <p className="text-gray-300 leading-relaxed">
                            By using our website, you agree to the collection and use of information in accordance with this policy.
                        </p>
                    </section>

                    {/* Information We Collect */}
                    <section className="mb-12 p-8 rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-sm border border-white/[0.08]">
                        <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                            <Database className="w-6 h-6 text-orange-400" />
                            Information We Collect
                        </h2>
                        
                        <div className="space-y-6 text-gray-300">
                            <div>
                                <h3 className="text-lg font-bold text-white mb-3">Personal Information</h3>
                                <p className="leading-relaxed mb-3">
                                    We collect only the necessary information required to provide our services:
                                </p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Email address (for account creation and communication)</li>
                                    <li>Username (for account identification)</li>
                                    <li>Order details (product purchased, quantity, price)</li>
                                    <li>Payment confirmation metadata (transaction ID, payment method)</li>
                                    <li>IP address (for security and fraud prevention)</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-white mb-3">Information We DO NOT Collect</h3>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Credit card numbers or banking details (handled by payment processors)</li>
                                    <li>Social security numbers or government IDs</li>
                                    <li>Unnecessary personal information</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-white mb-3">Automatically Collected Information</h3>
                                <p className="leading-relaxed mb-3">
                                    When you visit our website, we may automatically collect:
                                </p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Browser type and version</li>
                                    <li>Device information</li>
                                    <li>Pages visited and time spent</li>
                                    <li>Referring website</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* How We Use Information */}
                    <section className="mb-12 p-8 rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-sm border border-white/[0.08]">
                        <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                            <Eye className="w-6 h-6 text-orange-400" />
                            How We Use Your Information
                        </h2>
                        
                        <div className="space-y-4 text-gray-300">
                            <p className="leading-relaxed">
                                Customer information is used solely for the following purposes:
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li><strong className="text-white">Order Fulfillment:</strong> Processing and delivering your digital products</li>
                                <li><strong className="text-white">Customer Support:</strong> Responding to inquiries and resolving issues</li>
                                <li><strong className="text-white">Fraud Prevention:</strong> Detecting and preventing fraudulent activities</li>
                                <li><strong className="text-white">Internal Record Keeping:</strong> Maintaining transaction history and account records</li>
                                <li><strong className="text-white">Service Improvement:</strong> Analyzing usage patterns to enhance user experience</li>
                                <li><strong className="text-white">Legal Compliance:</strong> Meeting legal and regulatory requirements</li>
                            </ul>
                        </div>
                    </section>

                    {/* Data Protection */}
                    <section className="mb-12 p-8 rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-sm border border-white/[0.08]">
                        <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                            <Lock className="w-6 h-6 text-orange-400" />
                            How We Protect Your Data
                        </h2>
                        
                        <div className="space-y-6 text-gray-300">
                            <div>
                                <h3 className="text-lg font-bold text-white mb-3">Security Measures</h3>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>SSL/TLS encryption for all data transmission</li>
                                    <li>Secure database storage with encryption at rest</li>
                                    <li>Regular security audits and updates</li>
                                    <li>Access controls and authentication protocols</li>
                                    <li>Firewall protection and intrusion detection</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-white mb-3">Payment Security</h3>
                                <p className="leading-relaxed">
                                    All payment processing is handled by trusted third-party providers (PayPal, Stripe, cryptocurrency processors). We never store your complete credit card information or banking details on our servers.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Data Sharing */}
                    <section className="mb-12 p-8 rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-sm border border-white/[0.08]">
                        <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                            <UserCheck className="w-6 h-6 text-orange-400" />
                            Data Sharing & Third Parties
                        </h2>
                        
                        <div className="space-y-6 text-gray-300">
                            <div>
                                <h3 className="text-lg font-bold text-white mb-3">We DO NOT Sell Your Data</h3>
                                <p className="leading-relaxed">
                                    We will never sell, rent, or trade your personal information to third parties for marketing purposes.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-white mb-3">Limited Third-Party Sharing</h3>
                                <p className="leading-relaxed mb-3">
                                    We may share limited information with trusted third parties only for:
                                </p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li><strong className="text-white">Payment Processing:</strong> PayPal, Stripe, and cryptocurrency processors</li>
                                    <li><strong className="text-white">Email Services:</strong> Transactional email delivery providers</li>
                                    <li><strong className="text-white">Analytics:</strong> Anonymous usage statistics (no personal identification)</li>
                                    <li><strong className="text-white">Legal Requirements:</strong> When required by law or to protect our rights</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Cookies */}
                    <section className="mb-12 p-8 rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-sm border border-white/[0.08]">
                        <h2 className="text-2xl font-black text-white mb-6">Cookies & Tracking</h2>
                        
                        <div className="space-y-6 text-gray-300">
                            <div>
                                <h3 className="text-lg font-bold text-white mb-3">What Are Cookies?</h3>
                                <p className="leading-relaxed">
                                    Cookies are small text files stored on your device that help us provide a better user experience.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-white mb-3">How We Use Cookies</h3>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li><strong className="text-white">Essential Cookies:</strong> Required for login and cart functionality</li>
                                    <li><strong className="text-white">Preference Cookies:</strong> Remember your settings and preferences</li>
                                    <li><strong className="text-white">Analytics Cookies:</strong> Help us understand how visitors use our site</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-white mb-3">Managing Cookies</h3>
                                <p className="leading-relaxed">
                                    You can control cookies through your browser settings. However, disabling certain cookies may affect website functionality.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Your Rights */}
                    <section className="mb-12 p-8 rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-sm border border-white/[0.08]">
                        <h2 className="text-2xl font-black text-white mb-6">Your Privacy Rights</h2>
                        
                        <div className="space-y-4 text-gray-300">
                            <p className="leading-relaxed">You have the right to:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li><strong className="text-white">Access:</strong> Request a copy of your personal data</li>
                                <li><strong className="text-white">Correction:</strong> Request correction of inaccurate information</li>
                                <li><strong className="text-white">Deletion:</strong> Request deletion of your account and data (subject to legal requirements)</li>
                                <li><strong className="text-white">Portability:</strong> Request your data in a portable format</li>
                                <li><strong className="text-white">Opt-Out:</strong> Unsubscribe from marketing communications</li>
                                <li><strong className="text-white">Object:</strong> Object to certain data processing activities</li>
                            </ul>
                            <p className="leading-relaxed mt-4">
                                To exercise these rights, please contact us at <a href="mailto:privacy@arkd.com" className="text-purple-400 hover:text-purple-300">privacy@arkd.com</a>
                            </p>
                        </div>
                    </section>

                    {/* Data Retention */}
                    <section className="mb-12 p-8 rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-sm border border-white/[0.08]">
                        <h2 className="text-2xl font-black text-white mb-6">Data Retention</h2>
                        <div className="text-gray-300 space-y-4">
                            <p className="leading-relaxed">
                                We retain your personal information only for as long as necessary to:
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Provide our services and support</li>
                                <li>Comply with legal obligations</li>
                                <li>Resolve disputes and enforce agreements</li>
                                <li>Maintain warranty and refund records</li>
                            </ul>
                            <p className="leading-relaxed">
                                Inactive accounts may be deleted after 2 years of inactivity, with prior notice.
                            </p>
                        </div>
                    </section>

                    {/* Children's Privacy */}
                    <section className="mb-12 p-8 rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-sm border border-white/[0.08]">
                        <h2 className="text-2xl font-black text-white mb-6">Children's Privacy</h2>
                        <p className="text-gray-300 leading-relaxed">
                            Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
                        </p>
                    </section>

                    {/* International Users */}
                    <section className="mb-12 p-8 rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-sm border border-white/[0.08]">
                        <h2 className="text-2xl font-black text-white mb-6">International Data Transfers</h2>
                        <p className="text-gray-300 leading-relaxed">
                            Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy and applicable laws.
                        </p>
                    </section>

                    {/* Changes to Policy */}
                    <section className="mb-12 p-8 rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-sm border border-white/[0.08]">
                        <h2 className="text-2xl font-black text-white mb-6">Changes to This Policy</h2>
                        <p className="text-gray-300 leading-relaxed">
                            We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page and updating the "Last Updated" date. Continued use of our services after changes constitutes acceptance of the updated policy.
                        </p>
                    </section>

                    {/* Contact */}
                    <section className="mb-12 p-8 rounded-2xl bg-gradient-to-b from-orange-500/10 to-white/[0.02] backdrop-blur-sm border border-orange-500/30">
                        <h2 className="text-2xl font-black text-white mb-6">Contact Us About Privacy</h2>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
                        </p>
                        <div className="space-y-2 text-gray-300">
                            <p><strong className="text-white">Email:</strong> <a href="mailto:support@arkd.shop" className="text-orange-400 hover:text-orange-300">support@arkd.shop</a></p>
                            <p><strong className="text-white">Support:</strong> <button onClick={() => window.openChat?.()} className="text-orange-400 hover:text-orange-300 font-semibold">Start Live Chat</button></p>
                        </div>
                    </section>

                    {/* Quick Links */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
                        <Link href="/terms" className="p-6 rounded-xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/[0.08] hover:border-orange-500/30 transition-all group">
                            <FileText className="w-8 h-8 text-orange-400 mb-3" />
                            <h3 className="text-white font-bold mb-2">Terms of Service</h3>
                            <p className="text-gray-400 text-sm">Read our terms and conditions</p>
                        </Link>
                        
                        <Link href="/faq" className="p-6 rounded-xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/[0.08] hover:border-orange-500/30 transition-all group">
                            <Shield className="w-8 h-8 text-orange-400 mb-3" />
                            <h3 className="text-white font-bold mb-2">FAQ</h3>
                            <p className="text-gray-400 text-sm">Common questions answered</p>
                        </Link>
                        
                        <button onClick={() => window.openChat?.()} className="p-6 rounded-xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/[0.08] hover:border-orange-500/30 transition-all group text-left w-full">
                            <UserCheck className="w-8 h-8 text-orange-400 mb-3" />
                            <h3 className="text-white font-bold mb-2">Start Live Chat</h3>
                            <p className="text-gray-400 text-sm">Get instant support 24/7</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
