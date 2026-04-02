'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { BookOpen, ChevronRight, Search, MessageCircle, FileText, HelpCircle, Folder } from 'lucide-react';
import { articles, getArticlesBySection, getAllSections } from '@/constants/articles';

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const articlesBySection = getArticlesBySection();
  const sections = getAllSections();

  // Filter articles based on search
  const filteredArticles = searchQuery
    ? articles.filter(article =>
        article.metadata?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

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
              HOW CAN WE <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">HELP YOU?</span>
            </h1>
            <p className="text-gray-400 text-sm max-w-2xl mx-auto">
              Browse our help articles and guides to find answers to your questions
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Search Bar */}
          <div className="mb-12">
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search help articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:bg-white/[0.06] transition-all"
                />
              </div>
            </div>
          </div>

          {/* Search Results or Section Categories */}
          {searchQuery && filteredArticles ? (
            <div className="mb-12">
              <h2 className="text-2xl font-black text-white mb-6">Search Results</h2>
              {filteredArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredArticles.map((article, idx) => {
                    const section = article.metadata?.section || 'general';
                    const articleSlug = article.metadata?.name?.toLowerCase().replace(/\s+/g, '-') || 'article';
                    return (
                      <Link
                        key={idx}
                        href={`/help/${section}/${articleSlug}`}
                        className="p-6 rounded-xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/[0.08] hover:border-orange-500/30 transition-all text-left group"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 p-[2px] flex-shrink-0">
                            <div className="w-full h-full rounded-xl bg-black flex items-center justify-center">
                              <BookOpen className="w-6 h-6 text-orange-400" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-white font-bold mb-2 group-hover:text-orange-400 transition-colors">
                              {article.metadata?.name}
                            </h3>
                            <p className="text-sm text-gray-400">
                              {article.contents?.[0]?.content?.replace(/<[^>]*>/g, '').substring(0, 100)}...
                            </p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-orange-400 transition-colors flex-shrink-0" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400">No articles found matching your search.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="mb-12">
              <h2 className="text-2xl font-black text-white mb-6">Browse by Category</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sections.map((section) => {
                  const sectionArticles = articlesBySection[section] || [];
                  return (
                    <Link
                      key={section}
                      href={`/help/${section}`}
                      className="p-8 rounded-xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/[0.08] hover:border-orange-500/30 transition-all group"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 p-[2px] flex-shrink-0">
                          <div className="w-full h-full rounded-xl bg-black flex items-center justify-center">
                            <Folder className="w-8 h-8 text-orange-400" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-black text-white mb-2 capitalize group-hover:text-orange-400 transition-colors">
                            {section}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {sectionArticles.length} {sectionArticles.length === 1 ? 'article' : 'articles'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-400 group-hover:text-orange-400 transition-colors">
                        <span>View all articles</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
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
