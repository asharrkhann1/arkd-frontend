'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { HelpCircle, ChevronDown, ChevronUp, Shield, CreditCard, Package, RefreshCw, AlertCircle, Clock } from 'lucide-react';

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const faqs = [
        {
            category: 'Products & Services',
            icon: Package,
            color: 'text-orange-400',
            questions: [
                {
                    question: 'Are your products physical or digital?',
                    answer: 'All products are digital and delivered electronically. We do not ship any physical goods. Delivery is completed via email or through your customer dashboard immediately after purchase.'
                },
                {
                    question: 'What types of products do you sell?',
                    answer: 'We offer gaming accounts (Fortnite, Valorant, etc.), digital gift cards, game top-ups, and in-game currency. All products are intangible digital goods owned and supplied directly by our company.'
                },
                {
                    question: 'Are you affiliated with game publishers?',
                    answer: 'No. This website is not affiliated with or endorsed by any game developer or publisher including Epic Games, Riot Games, Valve, Ubisoft, or Electronic Arts. All trademarks belong to their respective owners and are used for descriptive purposes only.'
                }
            ]
        },
        {
            category: 'Orders & Delivery',
            icon: Clock,
            color: 'text-orange-400',
            questions: [
                {
                    question: 'How long does delivery take?',
                    answer: 'Delivery is usually instant or within the timeframe stated on the product page. Most digital products are delivered immediately after payment confirmation. You will receive your product details via email and in your account dashboard.'
                },
                {
                    question: 'What if I provided wrong information at checkout?',
                    answer: 'Buyers must provide accurate information during checkout. Delivery failures due to incorrect email addresses or other details are not the seller\'s responsibility. Please double-check all information before completing your purchase.'
                },
                {
                    question: 'What happens after I receive my product?',
                    answer: 'Once delivery information has been sent, responsibility for securing the product transfers to you. You must immediately change passwords, secure associated emails, and enable two-factor authentication (2FA) to protect your purchase.'
                }
            ]
        },
        {
            category: 'Payments & Pricing',
            icon: CreditCard,
            color: 'text-orange-400',
            questions: [
                {
                    question: 'What payment methods do you accept?',
                    answer: 'We accept PayPal, Stripe (credit/debit cards), and various cryptocurrencies. All payments are processed through secure third-party providers. We never store your complete payment information on our servers.'
                },
                {
                    question: 'Are taxes included in the price?',
                    answer: 'Yes, unless stated otherwise. All prices displayed include applicable VAT, GST, or service fees. The price you see is the price you pay.'
                },
                {
                    question: 'What if my payment fails?',
                    answer: 'Orders with failed or disputed payments will not be delivered. All orders must be paid in full before processing. If your payment fails, please try again or contact your payment provider.'
                }
            ]
        },
        {
            category: 'Refunds & Cancellations',
            icon: RefreshCw,
            color: 'text-orange-400',
            questions: [
                {
                    question: 'Can I get a refund if I change my mind?',
                    answer: 'No. Due to the digital nature of products, all sales are final after delivery. Once login credentials or codes are delivered and accessed, the product is considered used and cannot be returned or revoked.'
                },
                {
                    question: 'When can I get a refund?',
                    answer: 'Refunds may be considered only in cases of non-delivery, invalid credentials, or incorrect product description. You must contact support with proof before initiating any disputes or chargebacks.'
                },
                {
                    question: 'What cases are NOT refundable?',
                    answer: 'Non-refundable cases include: delivered accounts that work as described, redeemed gift cards, completed top-ups, post-delivery bans by game publishers, and issues caused by buyer negligence or failure to secure the account.'
                },
                {
                    question: 'Are processing fees refundable?',
                    answer: 'No. Only the base product price may be refunded. Processing fees, currency conversion losses, and taxes are non-refundable.'
                }
            ]
        },
        {
            category: 'Warranty & Account Security',
            icon: Shield,
            color: 'text-orange-400',
            questions: [
                {
                    question: 'What warranty do accounts include?',
                    answer: 'All accounts include a 14-day pullback-only warranty from the date of delivery. This means we will replace or refund the account only if the original owner regains access without any involvement from you.'
                },
                {
                    question: 'What does the warranty NOT cover?',
                    answer: 'Warranty does NOT cover: email changes you made, lost credentials, hacked buyer email accounts, weak security practices, or bans imposed by game publishers. You are responsible for account security after delivery.'
                },
                {
                    question: 'Can I extend the warranty?',
                    answer: 'Yes. Buyers may purchase extended warranty coverage (3 or 6 months) before the standard 14-day warranty expires. Extended warranties must be purchased proactively.'
                },
                {
                    question: 'Who is responsible for account security?',
                    answer: 'The buyer is fully responsible after delivery. You must change passwords, secure associated emails, and enable two-factor authentication (2FA). Failure to follow security practices may void warranty coverage.'
                },
                {
                    question: 'What if the account gets banned?',
                    answer: 'Publisher bans are outside our control. Some game publishers prohibit account trading. Any warnings, suspensions, or bans imposed by publishers after delivery are not covered by warranty.'
                }
            ]
        },
        {
            category: 'Support & Disputes',
            icon: AlertCircle,
            color: 'text-orange-400',
            questions: [
                {
                    question: 'How do I claim warranty or get support?',
                    answer: 'Contact our support team within the warranty period with proof of the issue. You must contact support BEFORE initiating disputes or chargebacks. We are here to help resolve legitimate issues.'
                },
                {
                    question: 'What happens if I file a chargeback?',
                    answer: 'Chargeback abuse is strictly prohibited. If you file a chargeback without contacting support first, your account may be permanently suspended, and you may be denied future service. Always contact us first to resolve issues.'
                },
                {
                    question: 'How quickly will I get a response?',
                    answer: 'Our support team typically responds within 24 hours. For urgent issues, please clearly mark your ticket as urgent. We are committed to resolving all legitimate concerns promptly.'
                }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-black">
            {/* Header */}
            <div className="bg-gradient-to-b from-orange-500/10 to-black border-b border-white/[0.08] py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] mb-6">
                            <HelpCircle className="w-4 h-4 text-orange-400" />
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Help Center</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 uppercase tracking-tight">
                            FREQUENTLY ASKED <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">QUESTIONS</span>
                        </h1>
                        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
                            Find answers to common questions about our products, services, and policies. Can't find what you're looking for? Contact our support team.
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    {faqs.map((category, categoryIndex) => {
                        const CategoryIcon = category.icon;
                        return (
                            <section key={categoryIndex} className="mb-12">
                                <div className="mb-6 flex items-center gap-3">
                                    <CategoryIcon className={`w-6 h-6 ${category.color}`} />
                                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                                        {category.category}
                                    </h2>
                                </div>
                                
                                <div className="space-y-4">
                                    {category.questions.map((faq, faqIndex) => {
                                        const globalIndex = `${categoryIndex}-${faqIndex}`;
                                        const isOpen = openIndex === globalIndex;
                                        
                                        return (
                                            <div
                                                key={faqIndex}
                                                className="rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-sm border border-white/[0.08] overflow-hidden transition-all duration-300 hover:border-white/[0.15]"
                                            >
                                                <button
                                                    onClick={() => toggleFAQ(globalIndex)}
                                                    className="w-full p-6 flex items-center justify-between text-left transition-all duration-300"
                                                >
                                                    <h3 className="text-lg font-bold text-white pr-4">
                                                        {faq.question}
                                                    </h3>
                                                    <div className={`flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                                                        {isOpen ? (
                                                            <ChevronUp className={`w-5 h-5 ${category.color}`} />
                                                        ) : (
                                                            <ChevronDown className="w-5 h-5 text-gray-400" />
                                                        )}
                                                    </div>
                                                </button>
                                                
                                                <div
                                                    className={`transition-all duration-300 ease-in-out ${
                                                        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                                    } overflow-hidden`}
                                                >
                                                    <div className="px-6 pb-6">
                                                        <div className={`h-px bg-gradient-to-r from-transparent via-white/[0.1] to-transparent mb-4`} />
                                                        <p className="text-gray-300 leading-relaxed">
                                                            {faq.answer}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        );
                    })}

                    {/* Still Have Questions */}
                    <section className="mt-16 p-8 rounded-2xl bg-gradient-to-b from-orange-500/10 to-white/[0.02] backdrop-blur-sm border border-orange-500/30 text-center">
                        <HelpCircle className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-black text-white mb-4">Still Have Questions?</h2>
                        <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                            Can't find the answer you're looking for? Our support team is here to help you with any questions or concerns.
                        </p>
                        <button
                            onClick={() => window.openChat?.()}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)]"
                        >
                            Start Live Chat
                        </button>
                    </section>

                    {/* Quick Links */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
                        <Link href="/terms" className="p-6 rounded-xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/[0.08] hover:border-orange-500/30 transition-all group">
                            <Shield className="w-8 h-8 text-orange-400 mb-3" />
                            <h3 className="text-white font-bold mb-2">Terms of Service</h3>
                            <p className="text-gray-400 text-sm">Read our complete terms and policies</p>
                        </Link>
                        
                        <Link href="/privacy" className="p-6 rounded-xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/[0.08] hover:border-orange-500/30 transition-all group">
                            <Shield className="w-8 h-8 text-orange-400 mb-3" />
                            <h3 className="text-white font-bold mb-2">Privacy Policy</h3>
                            <p className="text-gray-400 text-sm">Learn how we protect your data</p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQ;
