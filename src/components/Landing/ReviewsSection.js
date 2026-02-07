'use client';
import React from 'react';
import { Star, CheckCircle, ShieldCheck, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const reviews = [
    { id: 1, user: "AlexGamer99", rating: 5, title: "Fastest delivery ever!", content: "Bought a Valorant account, received details instantly. Everything works perfectly.", date: "2h ago" },
    { id: 2, user: "SarahPlays", rating: 5, title: "Legit service", content: "Was skeptical at first but the support team helped me through the process. Got my skins in 5 mins.", date: "5h ago" },
    { id: 3, user: "ProNoob_X", rating: 4, title: "Good prices", content: "Cheapest V-Bucks I found online. Would give 5 stars if the website loaded a bit faster on mobile.", date: "1d ago" },
    { id: 4, user: "MobaKing", rating: 5, title: "Excellent", content: "Top tier support and very secure. Will buy again for sure.", date: "2d ago" },
    { id: 5, user: "JinxMain", rating: 5, title: "Instant", content: "Code arrived immediately. No hassle.", date: "3d ago" },
    { id: 6, user: "GhostRyder", rating: 5, title: "Perfect", content: "Exactly what I ordered. Account stats were as described.", date: "3d ago" },
    { id: 7, user: "Katarina_L", rating: 4, title: "Good so far", content: "Everything works, just wished there were more payment options.", date: "4d ago" },
    { id: 8, user: "SupportTank", rating: 5, title: "Great Support", content: "Had an issue with redemption, live chat fixed it in seconds.", date: "5d ago" }
];

// Double the arrays for seamless loop (0% to -50%)
const col1 = [...reviews, ...reviews];
const col2 = [...[...reviews].reverse(), ...[...reviews].reverse()];

const ReviewCard = ({ review }) => (
    <div className="bg-[#171717] p-5 rounded-xl border border-gray-800 mb-4 hover:border-orange-500/30 transition-colors w-full">
        <div className="flex mb-2">
            {[...Array(5)].map((_, s) => (
                <Star
                    key={s}
                    className={`w-3.5 h-3.5 ${s < review.rating ? 'text-green-500 fill-green-500' : 'text-gray-700'}`}
                />
            ))}
        </div>
        <h4 className="text-white font-bold text-sm mb-1 truncate">{review.title}</h4>
        <p className="text-gray-400 text-xs mb-3 line-clamp-3 leading-relaxed">"{review.content}"</p>
        <div className="flex items-center justify-between pt-2 border-t border-gray-800/50">
            <span className="text-xs font-semibold text-gray-300">{review.user}</span>
            <span className="text-[10px] text-gray-600">{review.date}</span>
        </div>
    </div>
);

const ReviewsSection = () => {
    return (
        <section className="py-24 bg-black relative overflow-hidden">
            {/* Left Gradient Glow */}
            <div className="absolute top-1/2 left-0 w-96 h-96 bg-orange-500/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2" />

            {/* CSS Animations */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes scroll-up {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(-50%); }
                }
                @keyframes scroll-down {
                    0% { transform: translateY(-50%); }
                    100% { transform: translateY(0); }
                }
                .animate-scroll-up {
                    animation: scroll-up 30s linear infinite;
                }
                .animate-scroll-down {
                    animation: scroll-down 35s linear infinite;
                }
                .pause-on-hover:hover .animate-scroll-up,
                .pause-on-hover:hover .animate-scroll-down {
                    animation-play-state: paused;
                }
                .masked-gradient {
                    mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
                }
             `}} />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* LEFT SIDE: Trust Content */}
                    <div className="space-y-8">
                        <div>
                            <div className="flex items-center space-x-2 text-green-500 mb-4">
                                <Star className="w-5 h-5 fill-current" />
                                <span className="font-bold">Trustpilot</span>
                            </div>
                            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
                                TRUSTED BY <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400">
                                    Clients
                                </span>
                            </h2>
                            <p className="text-gray-400 text-lg max-w-md leading-relaxed">
                                Join over 500,000+ peoples who trust ARKD for safe, instant, and secure transactions every single day.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-[#0a0a0a] p-4 rounded-xl border border-gray-800">
                                <div className="text-3xl font-bold text-white mb-1">4.9/5</div>
                                <div className="text-sm text-gray-500">Average Rating</div>
                            </div>
                            <div className="bg-[#0a0a0a] p-4 rounded-xl border border-gray-800">
                                <div className="text-3xl font-bold text-white mb-1">12k+</div>
                                <div className="text-sm text-gray-500">Verified Reviews</div>
                            </div>
                        </div>

                        <div className="space-y-3 pt-4">
                            {[
                                "100% Money Back Guarantee",
                                "Verified Sellers Only",
                                "24/7 Human Review Process"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center space-x-3 text-gray-300">
                                    <CheckCircle className="w-5 h-5 text-orange-500" />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT SIDE: Vertical Infinite Scroll */}
                    <div className="relative h-[600px] overflow-hidden masked-gradient">
                        <div className="grid grid-cols-2 gap-4 h-full pause-on-hover px-2">
                            {/* Column 1 - Moving UP */}
                            <div className="relative h-full overflow-hidden">
                                <div className="animate-scroll-up w-full">
                                    {col1.map((review, i) => (
                                        <ReviewCard key={`col1-${i}`} review={review} />
                                    ))}
                                </div>
                            </div>

                            {/* Column 2 - Moving DOWN */}
                            <div className="relative h-full overflow-hidden">
                                <div className="animate-scroll-down w-full">
                                    {col2.map((review, i) => (
                                        <ReviewCard key={`col2-${i}`} review={review} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ReviewsSection;
