'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { BookOpen, ArrowLeft, MessageCircle, ChevronRight } from 'lucide-react';
import { articles } from '@/constants/articles';
import { useParams } from 'next/navigation';

export default function ArticlePage() {
  const params = useParams();
  const section = params.section;
  const articleSlug = params.article;
  
  const [selectedTocIndex, setSelectedTocIndex] = useState(0);

  // Find the article by slug
  const article = articles.find(a => {
    const slug = a.metadata?.name?.toLowerCase().replace(/\s+/g, '-');
    return slug === articleSlug && a.metadata?.section === section;
  });

  const handleTocClick = (index) => {
    setSelectedTocIndex(index);
    const element = document.getElementById(`section-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (!article) {
    return (
      <div className="min-h-screen bg-black">
        <div className="bg-gradient-to-b from-orange-500/10 to-black border-b border-white/[0.08] py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-black text-white mb-4 uppercase tracking-tight">
                ARTICLE NOT <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">FOUND</span>
              </h1>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-gray-400 mb-6">This article doesn't exist or has been moved.</p>
            <div className="flex gap-4 justify-center">
              <Link
                href={`/help/${section}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold hover:from-orange-600 hover:to-orange-700 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to {section}
              </Link>
              <Link
                href="/help"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white font-bold hover:bg-white/[0.08] transition-all"
              >
                Help Center
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gradient-to-b from-orange-500/10 to-black border-b border-white/[0.08] py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
              <Link href="/help" className="hover:text-orange-400 transition-colors">
                Help Center
              </Link>
              <ChevronRight className="w-4 h-4" />
              <Link href={`/help/${section}`} className="hover:text-orange-400 transition-colors capitalize">
                {section}
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">{article.metadata?.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Table of Contents Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <Link
                  href={`/help/${section}`}
                  className="flex items-center gap-2 text-orange-400 hover:text-orange-300 mb-6 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="font-semibold">Back to {section}</span>
                </Link>

                <div className="p-6 rounded-xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/[0.08]">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Table of Contents</h3>
                  <div className="space-y-2">
                    {article.contents?.map((section, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleTocClick(idx)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                          selectedTocIndex === idx
                            ? 'bg-orange-500/20 text-orange-400 font-semibold'
                            : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                        }`}
                      >
                        <span className="text-sm">{section.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Article Content */}
            <div className="lg:col-span-3">
              <div className="p-8 rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/[0.08]">
                <div className="mb-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 mb-4">
                    <BookOpen className="w-4 h-4 text-orange-400" />
                    <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                      {article.metadata?.section}
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-black text-white">
                    {article.metadata?.name}
                  </h1>
                </div>

                <div className="space-y-8">
                  {article.contents?.map((section, idx) => (
                    <div key={idx} id={`section-${idx}`} className="scroll-mt-24">
                      <h2 className="text-xl font-bold text-white mb-4">{section.title}</h2>
                      <div
                        className="prose prose-invert max-w-none text-gray-300"
                        dangerouslySetInnerHTML={{ __html: section.content }}
                        style={{
                          color: '#d1d5db',
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* Need More Help */}
                <div className="mt-12 p-6 rounded-xl bg-gradient-to-b from-orange-500/10 to-white/[0.02] border border-orange-500/30">
                  <h3 className="text-lg font-bold text-white mb-2">Still need help?</h3>
                  <p className="text-gray-300 mb-4">Our support team is available 24/7 to assist you.</p>
                  <button
                    onClick={() => window.openChat?.()}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] flex items-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Start Live Chat
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
