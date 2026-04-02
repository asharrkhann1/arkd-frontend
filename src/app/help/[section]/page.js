'use client';
import React from 'react';
import Link from 'next/link';
import { BookOpen, ChevronRight, ArrowLeft, MessageCircle, HelpCircle, FileText } from 'lucide-react';
import { getArticlesBySection } from '@/constants/articles';
import { useParams } from 'next/navigation';

export default function SectionPage() {
  const params = useParams();
  const section = params.section;
  
  const articlesBySection = getArticlesBySection();
  const sectionArticles = articlesBySection[section] || [];

  if (sectionArticles.length === 0) {
    return (
      <div className="min-h-screen bg-black">
        <div className="bg-gradient-to-b from-orange-500/10 to-black border-b border-white/[0.08] py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-black text-white mb-4 uppercase tracking-tight">
                SECTION NOT <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">FOUND</span>
              </h1>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-gray-400 mb-6">This section doesn't exist or has no articles yet.</p>
            <Link
              href="/help"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold hover:from-orange-600 hover:to-orange-700 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Help Center
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gradient-to-b from-orange-500/10 to-black border-b border-white/[0.08] py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/help"
              className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-semibold">Back to Help Center</span>
            </Link>
            
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] mb-6">
              <BookOpen className="w-4 h-4 text-orange-400" />
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                {section}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 uppercase tracking-tight capitalize">
              {section} <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">ARTICLES</span>
            </h1>
            <p className="text-gray-400 text-sm">
              {sectionArticles.length} {sectionArticles.length === 1 ? 'article' : 'articles'} in this section
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Articles List */}
          <div className="space-y-4 mb-12">
            {sectionArticles.map((article, idx) => {
              const articleSlug = article.metadata?.name?.toLowerCase().replace(/\s+/g, '-') || 'article';
              return (
                <Link
                  key={idx}
                  href={`/help/${section}/${articleSlug}`}
                  className="block p-6 rounded-xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/[0.08] hover:border-orange-500/30 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 p-[2px] flex-shrink-0">
                      <div className="w-full h-full rounded-xl bg-black flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-orange-400" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                        {article.metadata?.name}
                      </h3>
                      <p className="text-sm text-gray-400 leading-relaxed">
                        {article.contents?.[0]?.content?.replace(/<[^>]*>/g, '').substring(0, 150)}...
                      </p>
                    </div>
                    <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-orange-400 transition-colors flex-shrink-0" />
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => window.openChat?.()}
              className="p-6 rounded-xl bg-gradient-to-b from-orange-500/10 to-white/[0.02] border border-orange-500/30 hover:border-orange-500/50 transition-all text-left group"
            >
              <MessageCircle className="w-8 h-8 text-orange-400 mb-3" />
              <h3 className="text-white font-bold mb-2">Start Live Chat</h3>
              <p className="text-sm text-gray-400">Get instant help from our support team</p>
            </button>

            <Link
              href="/faq"
              className="p-6 rounded-xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/[0.08] hover:border-orange-500/30 transition-all text-left group"
            >
              <HelpCircle className="w-8 h-8 text-orange-400 mb-3" />
              <h3 className="text-white font-bold mb-2">FAQ</h3>
              <p className="text-sm text-gray-400">Common questions answered</p>
            </Link>

            <Link
              href="/contact"
              className="p-6 rounded-xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/[0.08] hover:border-orange-500/30 transition-all text-left group"
            >
              <FileText className="w-8 h-8 text-orange-400 mb-3" />
              <h3 className="text-white font-bold mb-2">Contact Support</h3>
              <p className="text-sm text-gray-400">Email us for assistance</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
