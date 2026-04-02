'use client';
import React from 'react';
import Link from 'next/link';
import { Shield, FileText, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const TermsOfService = () => {
    return (
        <div className="min-h-screen bg-black">
            {/* Header */}
            <div className="bg-gradient-to-b from-orange-500/10 to-black border-b border-white/[0.08] py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] mb-6">
                            <FileText className="w-4 h-4 text-orange-400" />
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Legal Document</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 uppercase tracking-tight">
                            TERMS OF SERVICE & <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">POLICY CENTER</span>
                        </h1>
                        <p className="text-gray-400 text-sm">Last Updated: April 2, 2026</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    {/* Section 1 */}
                    <section className="mb-12 p-8 rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-sm border border-white/[0.08]">
                        <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                            <Shield className="w-6 h-6 text-orange-400" />
                            1. Introduction
                        </h2>
                        
                        <div className="space-y-6 text-gray-300">
                            <div>
                                <h3 className="text-lg font-bold text-white mb-3">1.1 Agreement to Terms</h3>
                                <p className="leading-relaxed mb-3">
                                    This Policy Center constitutes a legally binding agreement between the user ('Buyer', 'User', 'Customer') and the operator of this website ('Company', 'We', 'Us', 'Our').
                                </p>
                                <p className="leading-relaxed mb-3">
                                    By accessing, browsing, registering, or placing an order on this website, you acknowledge that you have read, understood, and agreed to be legally bound by all policies, terms, and conditions stated herein.
                                </p>
                                <p className="leading-relaxed mb-3">
                                    If you do not agree with these policies, you must immediately discontinue use of this website and refrain from placing any orders.
                                </p>
                                <p className="leading-relaxed">
                                    The Company reserves the absolute right to refuse service, cancel orders, suspend accounts, or permanently deny access to any individual who violates or attempts to circumvent these policies.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 2 */}
                    <section className="mb-12 p-8 rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-sm border border-white/[0.08]">
                        <h2 className="text-2xl font-black text-white mb-6">2. Nature of Our Business</h2>
                        
                        <div className="space-y-6 text-gray-300">
                            <div>
                                <h3 className="text-lg font-bold text-white mb-3">2.1 Single-Seller Digital Store</h3>
                                <p className="leading-relaxed mb-3">This website operates strictly as a single-seller digital goods store.</p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>All products listed are owned by our company</li>
                                    <li>All products are supplied directly by our company</li>
                                    <li>All products are delivered exclusively by our company</li>
                                    <li>There are no third-party sellers, vendors, or marketplace participants involved</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-white mb-3">2.2 Products Offered</h3>
                                <p className="leading-relaxed mb-3">The website offers the following digital products:</p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Gaming accounts (e.g., Fortnite, Valorant)</li>
                                    <li>Digital gift cards</li>
                                    <li>Game top-ups and in-game currency</li>
                                </ul>
                                <p className="leading-relaxed mt-3">All products are intangible digital goods delivered electronically.</p>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-white mb-3">2.3 Non-Affiliation Disclaimer</h3>
                                <p className="leading-relaxed">
                                    This website is not affiliated with or endorsed by any game developer or publisher including Epic Games, Riot Games, Valve, Ubisoft, or Electronic Arts. All trademarks belong to their respective owners and are used for descriptive purposes only.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 3 */}
                    <section className="mb-12 p-8 rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-sm border border-white/[0.08]">
                        <h2 className="text-2xl font-black text-white mb-6">3. Digital Products Policy</h2>
                        
                        <div className="space-y-6 text-gray-300">
                            <div>
                                <h3 className="text-lg font-bold text-white mb-3">3.1 Digital-Only Products</h3>
                                <p className="leading-relaxed">
                                    All products sold are strictly digital. No physical goods will be shipped. Delivery is completed electronically via email or customer dashboard.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-white mb-3">3.2 Irreversible Digital Delivery</h3>
                                <p className="leading-relaxed">
                                    Once login credentials or codes are delivered and accessed, the product is considered used and cannot be returned or revoked.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 4 */}
                    <section className="mb-12 p-8 rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-sm border border-white/[0.08]">
                        <h2 className="text-2xl font-black text-white mb-6">4. Buyer Responsibilities</h2>
                        
                        <div className="space-y-6 text-gray-300">
                            <div>
                                <h3 className="text-lg font-bold text-white mb-3">4.1 Accurate Checkout Information</h3>
                                <p className="leading-relaxed">
                                    Buyers must provide accurate information during checkout. Delivery failures due to incorrect details are not the seller's responsibility.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-white mb-3">4.2 Product Awareness</h3>
                                <p className="leading-relaxed">
                                    Buyers must review product descriptions carefully before purchasing. Misunderstanding product details does not qualify for refunds.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-white mb-3">4.3 Account Security</h3>
                                <p className="leading-relaxed">
                                    After delivery, buyers must change passwords, secure associated emails, and enable two-factor authentication (2FA).
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-white mb-3">4.4 Responsibility After Delivery</h3>
                                <p className="leading-relaxed">
                                    Buyers assume full responsibility for account security after delivery. Failure to follow security practices may void warranty coverage.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 5 */}
                    <section className="mb-12 p-8 rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-sm border border-white/[0.08]">
                        <h2 className="text-2xl font-black text-white mb-6">5. Payment Policy</h2>
                        
                        <div className="space-y-6 text-gray-300">
                            <div>
                                <h3 className="text-lg font-bold text-white mb-3">5.1 Full Payment Requirement</h3>
                                <p className="leading-relaxed">
                                    All orders must be paid in full before processing. Orders with failed or disputed payments will not be delivered.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-white mb-3">5.2 Payment Processing</h3>
                                <p className="leading-relaxed">
                                    Payments are processed through secure third-party providers such as PayPal, Stripe, and cryptocurrency processors. Sensitive payment data is never stored by our website.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 6 */}
                    <section className="mb-12 p-8 rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-sm border border-white/[0.08]">
                        <h2 className="text-2xl font-black text-white mb-6">6. Taxes & Fees</h2>
                        
                        <div className="space-y-6 text-gray-300">
                            <div>
                                <h3 className="text-lg font-bold text-white mb-3">6.1 Tax Inclusion</h3>
                                <p className="leading-relaxed">
                                    All prices displayed include applicable VAT, GST, or service fees unless otherwise stated.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-white mb-3">6.2 Refund Tax Limitation</h3>
                                <p className="leading-relaxed">
                                    Only the base product price may be refunded. Processing fees, currency conversion losses, and taxes are non-refundable.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 7 */}
                    <section className="mb-12 p-8 rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-sm border border-white/[0.08]">
                        <h2 className="text-2xl font-black text-white mb-6">7. Delivery Policy</h2>
                        
                        <div className="space-y-6 text-gray-300">
                            <div>
                                <h3 className="text-lg font-bold text-white mb-3">7.1 Delivery Time</h3>
                                <p className="leading-relaxed">
                                    Delivery is usually instant or within the timeframe stated on the product page.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-white mb-3">7.2 Transfer of Responsibility</h3>
                                <p className="leading-relaxed">
                                    Once delivery information has been sent, responsibility for securing the product transfers to the buyer.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 8 */}
                    <section className="mb-12 p-8 rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-sm border border-white/[0.08]">
                        <h2 className="text-2xl font-black text-white mb-6">8. Refund & Cancellation Policy</h2>
                        
                        <div className="space-y-6 text-gray-300">
                            <div>
                                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                                    <XCircle className="w-5 h-5 text-red-400" />
                                    8.1 No Change-of-Mind Refunds
                                </h3>
                                <p className="leading-relaxed">
                                    Due to the digital nature of products, all sales are final after delivery.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                    8.2 Limited Refund Eligibility
                                </h3>
                                <p className="leading-relaxed">
                                    Refunds may be considered only in cases of non-delivery, invalid credentials, or incorrect product description.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-white mb-3">8.3 Non-Refundable Cases</h3>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Delivered accounts</li>
                                    <li>Redeemed gift cards</li>
                                    <li>Completed top-ups</li>
                                    <li>Post-delivery bans</li>
                                    <li>Buyer negligence</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Section 9 */}
                    <section className="mb-12 p-8 rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-sm border border-white/[0.08]">
                        <h2 className="text-2xl font-black text-white mb-6">9. Account Warranty Policy</h2>
                        
                        <div className="space-y-6 text-gray-300">
                            <div>
                                <h3 className="text-lg font-bold text-white mb-3">9.1 Warranty Scope (Pullback Only)</h3>
                                <p className="leading-relaxed">
                                    Warranty coverage applies only if the original owner regains access to the account without buyer involvement.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-white mb-3">9.2 Warranty Exclusions</h3>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Email changes</li>
                                    <li>Lost credentials</li>
                                    <li>Hacked buyer email</li>
                                    <li>Weak security practices</li>
                                    <li>Publisher bans</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-white mb-3">9.3 Warranty Duration</h3>
                                <p className="leading-relaxed">
                                    All accounts include a 14-day pullback-only warranty from the date of delivery.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-white mb-3">9.4 Extended Warranty</h3>
                                <p className="leading-relaxed">
                                    Buyers may purchase extended warranty coverage (3 or 6 months) before the standard warranty expires.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 10 */}
                    <section className="mb-12 p-8 rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-sm border border-white/[0.08]">
                        <h2 className="text-2xl font-black text-white mb-6">10. Game Publisher Policy</h2>
                        <p className="text-gray-300 leading-relaxed">
                            Some game publishers prohibit account trading. Any warnings, suspensions, or bans imposed by publishers are outside our control.
                        </p>
                    </section>

                    {/* Section 11 */}
                    <section className="mb-12 p-8 rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-sm border border-white/[0.08]">
                        <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                            <AlertCircle className="w-6 h-6 text-red-400" />
                            11. Prohibited Buyer Actions
                        </h2>
                        <ul className="list-disc list-inside space-y-2 ml-4 text-gray-300">
                            <li>Chargeback abuse</li>
                            <li>Fraud or misrepresentation</li>
                            <li>Warranty manipulation</li>
                            <li>Attempts to bypass policies</li>
                        </ul>
                    </section>

                    {/* Section 12 */}
                    <section className="mb-12 p-8 rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-sm border border-white/[0.08]">
                        <h2 className="text-2xl font-black text-white mb-6">12. Privacy Policy</h2>
                        
                        <div className="space-y-6 text-gray-300">
                            <div>
                                <h3 className="text-lg font-bold text-white mb-3">12.1 Information Collected</h3>
                                <p className="leading-relaxed">
                                    We collect only necessary information such as email addresses, order details, and payment confirmation metadata.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-white mb-3">12.2 Use of Information</h3>
                                <p className="leading-relaxed">
                                    Customer information is used solely for order fulfillment, customer support, fraud prevention, and internal record keeping.
                                </p>
                            </div>
                        </div>
                        
                        <div className="mt-6">
                            <Link href="/privacy" className="text-orange-400 hover:text-orange-300 transition-colors font-semibold">
                                View Full Privacy Policy →
                            </Link>
                        </div>
                    </section>

                    {/* Section 13 */}
                    <section className="mb-12 p-8 rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-sm border border-white/[0.08]">
                        <h2 className="text-2xl font-black text-white mb-6">13. Support & Dispute Policy</h2>
                        <p className="text-gray-300 leading-relaxed">
                            Customers must contact support before initiating disputes or chargebacks.
                        </p>
                        <div className="mt-6">
                            <Link href="/contact" className="text-orange-400 hover:text-orange-300 transition-colors font-semibold">
                                Contact Support →
                            </Link>
                        </div>
                    </section>

                    {/* Section 14 */}
                    <section className="mb-12 p-8 rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-sm border border-white/[0.08]">
                        <h2 className="text-2xl font-black text-white mb-6">14. Policy Updates</h2>
                        <p className="text-gray-300 leading-relaxed">
                            We reserve the right to modify these policies at any time. Continued use of the website constitutes acceptance of the updated policies.
                        </p>
                    </section>

                    {/* Quick Links */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
                        <Link href="/privacy" className="p-6 rounded-xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/[0.08] hover:border-orange-500/30 transition-all group">
                            <Shield className="w-8 h-8 text-orange-400 mb-3" />
                            <h3 className="text-white font-bold mb-2">Privacy Policy</h3>
                            <p className="text-gray-400 text-sm">Learn how we protect your data</p>
                        </Link>
                        
                        <Link href="/faq" className="p-6 rounded-xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/[0.08] hover:border-orange-500/30 transition-all group">
                            <FileText className="w-8 h-8 text-orange-400 mb-3" />
                            <h3 className="text-white font-bold mb-2">FAQ</h3>
                            <p className="text-gray-400 text-sm">Common questions answered</p>
                        </Link>
                        
                        <Link href="/contact" className="p-6 rounded-xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/[0.08] hover:border-orange-500/30 transition-all group">
                            <AlertCircle className="w-8 h-8 text-orange-400 mb-3" />
                            <h3 className="text-white font-bold mb-2">Contact Us</h3>
                            <p className="text-gray-400 text-sm">Get in touch with support</p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
