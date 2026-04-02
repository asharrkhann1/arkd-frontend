'use client';

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageCircle, Paperclip, SendHorizonal, Volume2, VolumeX, X, ChevronDown, Filter, Package, Calendar, Home, HelpCircle, MessageSquare, BookOpen, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useSocket } from '@/contexts/SocketContext';
import { useSocketChat } from '@/lib/useSocketChat';
import { apiFetch } from '@/lib/api';
import { articles, getArticlesBySection } from '@/constants/articles';

export default function ChatFab() {
  const { user } = useAuth();
  const { emit: socketEmit, isConnected: socketConnected } = useSocket();
  const pathname = usePathname();

  // Add keyframe animation for highlight effect
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideHighlight {
        0% {
          transform: translateX(-100%);
          opacity: 0;
        }
        20% {
          opacity: 1;
        }
        80% {
          opacity: 1;
        }
        100% {
          transform: translateX(100%);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const BEEP_KEY = 'chat_beep_muted_v1';

  const [chatOpen, setChatOpen] = useState(false);

  // Expose openChat function globally for "Start Live Chat" buttons
  useEffect(() => {
    window.openChat = () => {
      setChatOpen(true);
      setActiveTab('messages');
    };
    return () => {
      delete window.openChat;
    };
  }, []);
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'help', 'messages'
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [selectedTocIndex, setSelectedTocIndex] = useState(0);
  const [highlightedSection, setHighlightedSection] = useState(null);
  const articleContentRef = useRef(null);
  const [unseenCount, setUnseenCount] = useState(0);
  const [input, setInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [beepMuted, setBeepMuted] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filterFrom, setFilterFrom] = useState('');
  const [filterTo, setFilterTo] = useState('');
  const [orderMessages, setOrderMessages] = useState([]);
  const [selectedOrderJump, setSelectedOrderJump] = useState('');
  const [jumpLoading, setJumpLoading] = useState(false);
  const [filteredMessages, setFilteredMessages] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(-1);
  const [systemMessages, setSystemMessages] = useState([]);
  const receiverId = 1;

  const isAuthed = !!user;
  const isAdmin = !!(user && user.is_admin);

  const userId = useMemo(() => {
    if (!user) return null;
    if (typeof user.id === 'number' || typeof user.id === 'string') return user.id;
    if (typeof user.user_id === 'number' || typeof user.user_id === 'string') return user.user_id;
    if (typeof user._id === 'number' || typeof user._id === 'string') return user._id;
    return null;
  }, [user]);

  const containerRef = useRef(null);
  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const lastProcessedMessageIdRef = useRef(null);
  const beepCooldownRef = useRef(0);
  const audioCtxRef = useRef(null);

  const productCardCacheRef = useRef(new Map());

  const {
    session,
    role,
    messages,
    busy,
    error,
    setError,
    loadHistory,
    sync,
    sendMessage,
    markMessageSeen,
  } = useSocketChat({
    enabled: isAuthed,
    activeUserId: userId,
    receiverId,
    loadHistoryOnConnect: chatOpen,
  });

  useEffect(() => {
    if (!chatOpen) return;
    if (!messages || messages.length === 0) return;
    const myRole = role || (isAdmin ? 'admin' : 'user');
    if (myRole !== 'user') return;

    messages.forEach((m) => {
      const senderRole = getRole(m);
      if (senderRole !== 'admin' && senderRole !== 'system') return;
      if (!m?.id) return;
      if (m?.is_seen) return;
      markMessageSeen(m.id);
    });
  }, [chatOpen, isAdmin, markMessageSeen, messages, role]);

  useEffect(() => {
    setChatOpen(false);
  }, [pathname]);

  const scrollToMessageId = useCallback((messageId) => {
    if (!messageId) return;
    setTimeout(() => {
      const el = document.querySelector(`[data-message-id="${messageId}"]`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('ring-2', 'ring-orange-500/60');
        setTimeout(() => el.classList.remove('ring-2', 'ring-orange-500/60'), 2500);
      }
    }, 300);
  }, []);

  useEffect(() => {
    const openHandler = async (e) => {
      setChatOpen(true);
      const orderId = e?.detail?.orderId;
      if (orderId) {
        try {
          setJumpLoading(true);
          const data = await apiFetch(`/chat/order-message/${orderId}`);
          if (data.message_id) {
            scrollToMessageId(data.message_id);
          }
        } catch { /* silent */ } finally {
          setJumpLoading(false);
        }
      }
    };
    window.addEventListener('open-chat', openHandler);
    return () => window.removeEventListener('open-chat', openHandler);
  }, [scrollToMessageId]);

  // Fetch system messages for the dropdown
  useEffect(() => {
    if (!chatOpen || !isAuthed) return;
    apiFetch('/chat/system-messages').then(data => {
      setSystemMessages(data.messages || []);
      // Keep backward compatibility
      setOrderMessages(data.messages?.filter(m => m.type === 'order').map(m => ({
        order_id: m.meta?.order_id,
        message_id: m.message_id,
        type: m.meta?.type || 'order',
        product_title: m.meta?.product_title || m.subtitle,
        created_at: m.created_at
      })) || []);
    }).catch(() => { });
  }, [chatOpen, isAuthed]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(BEEP_KEY);
      setBeepMuted(raw === '1');
    } catch {
      setBeepMuted(false);
    }
    // Pre-warm AudioContext on first user click so beep works
    const warmAudio = () => {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx && !audioCtxRef.current) {
        audioCtxRef.current = new Ctx();
      }
      if (audioCtxRef.current?.state === 'suspended') {
        audioCtxRef.current.resume();
      }
    };
    document.addEventListener('click', warmAudio, { once: true });
    return () => document.removeEventListener('click', warmAudio);
  }, []);

  function toggleBeepMuted() {
    setBeepMuted((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(BEEP_KEY, next ? '1' : '0');
      } catch {
        // ignore
      }
      return next;
    });
  }

  function getAudioCtx() {
    if (!audioCtxRef.current) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null;
      audioCtxRef.current = new Ctx();
    }
    if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
    return audioCtxRef.current;
  }

  function playBeep() {
    if (beepMuted) return;
    const now = Date.now();
    if (now - (beepCooldownRef.current || 0) < 700) return;
    beepCooldownRef.current = now;

    try {
      const ctx = getAudioCtx();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 880;
      gain.gain.value = 0.15;

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    if (socketConnected) {
      if (chatOpen) {
        socketEmit('chat:focus');
      } else {
        socketEmit('chat:blur');
      }
    }
  }, [chatOpen, socketConnected, socketEmit]);

  useEffect(() => {
    if (!chatOpen) return;
    setError('');
    setInput('');
    setUnseenCount(0);
    setShowScrollBtn(false);
    const last = messages && messages.length ? messages[messages.length - 1] : null;
    const lastId = last && last.id != null ? String(last.id) : null;
    if (lastId) lastProcessedMessageIdRef.current = lastId;
    // Scroll to bottom on open
    setTimeout(() => {
      if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ block: 'end' });
      }
    }, 50);
  }, [chatOpen, isAdmin, setError]);

  useEffect(() => {
    if (!messages || messages.length === 0) return;

    const last = messages[messages.length - 1];
    const lastId = last && last.id != null ? String(last.id) : null;
    if (!lastId) return;
    if (lastProcessedMessageIdRef.current === lastId) return;

    lastProcessedMessageIdRef.current = lastId;

    if (chatOpen) {
      // Auto-scroll to newest message when chat is open
      setTimeout(() => {
        if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 50);
    } else {
      const myRole = role || (isAdmin ? 'admin' : 'user');
      const senderRole = getRole(last);
      if (senderRole && senderRole !== myRole) {
        setUnseenCount((c) => Math.min(99, (c || 0) + 1));
        playBeep();
      }
    }
  }, [chatOpen, isAdmin, messages, role, beepMuted]);

  // Scroll detection for showing "scroll to bottom" button
  const handleScroll = useCallback((e) => {
    const el = e.target;
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
    setShowScrollBtn(!isNearBottom);
  }, []);

  const scrollToBottom = useCallback(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, []);

  function extractFirstInternalServiceUrl(text) {
    if (!text) return null;
    const raw = String(text);

    const match = raw.match(/(https?:\/\/[^\s]+)?(\/services\/[a-z0-9-_]+\/[a-z0-9-_]+\/[a-z0-9-_]+)/i);
    if (!match) return null;
    const full = match[0];

    try {
      if (full.startsWith('http://') || full.startsWith('https://')) {
        const u = new URL(full);
        return u.pathname;
      }
    } catch {
      // ignore
    }

    if (full.startsWith('/services/')) return full;
    return null;
  }

  async function fetchProductCardData(servicePath) {
    if (!servicePath) return null;
    if (productCardCacheRef.current.has(servicePath)) {
      return productCardCacheRef.current.get(servicePath);
    }

    const m = String(servicePath).match(/^\/services\/([^/]+)\/([^/]+)\/([^/]+)/i);
    if (!m) return null;

    const type = decodeURIComponent(m[1]);
    const category = decodeURIComponent(m[2]);
    const slug = decodeURIComponent(m[3]);

    try {
      const data = await apiFetch(`/${category}/${type}/${slug}`);
      const product = data && typeof data === 'object' ? (data.product || data) : null;
      if (!product) return null;
      const card = {
        title: product.title,
        description: product.description,
        price: product.price,
        thumbnail: product.thumbnail_image,
        href: servicePath,
      };
      productCardCacheRef.current.set(servicePath, card);
      return card;
    } catch {
      productCardCacheRef.current.set(servicePath, null);
      return null;
    }
  }

  function getText(m) {
    if (!m) return '';
    if (typeof m.message === 'string') return m.message;
    if (m.message && typeof m.message === 'object' && typeof m.message.text === 'string') return m.message.text;
    return '';
  }

  function getMedia(m) {
    if (!m || !m.message || typeof m.message !== 'object') return null;
    if (typeof m.message.url === 'string' && m.message.url) return m.message.url;
    return null;
  }

  function getMediaKind(m) {
    if (!m || !m.message || typeof m.message !== 'object') return null;
    if (typeof m.message.kind === 'string' && m.message.kind) return m.message.kind;
    const mime = typeof m.message.mime === 'string' ? m.message.mime : null;
    if (mime && mime.startsWith('video/')) return 'video';
    if (mime && mime.startsWith('image/')) return 'image';
    return null;
  }

  function getMessageType(m) {
    if (!m || typeof m !== 'object') return 'text';
    return m.message_type === 'media' ? 'media' : 'text';
  }

  function getRole(m) {
    if (!m) return 'other';
    if (m.sender_role) return m.sender_role;
    return 'other';
  }

  const handleApplyFilters = useCallback(async () => {
    if (!filterFrom && !filterTo) {
      setFilteredMessages(null);
      return;
    }
    try {
      setJumpLoading(true);
      const params = new URLSearchParams();
      if (filterFrom) params.set('from', filterFrom);
      if (filterTo) params.set('to', filterTo);
      const data = await apiFetch(`/chat/messages/search?${params.toString()}`);
      setFilteredMessages(data.messages || []);
      if (data.first_message_id) {
        scrollToMessageId(data.first_message_id);
      }
    } catch { /* silent */ } finally {
      setJumpLoading(false);
    }
  }, [filterFrom, filterTo, scrollToMessageId]);

  const handleClearFilters = useCallback(() => {
    setFilterFrom('');
    setFilterTo('');
    setFilteredMessages(null);
    setShowFilters(false);
  }, []);

  const handleOrderJump = useCallback(async (messageId) => {
    if (!messageId) return;
    setSelectedOrderJump(messageId);
    scrollToMessageId(Number(messageId));
  }, [scrollToMessageId]);

  const displayMessages = useMemo(() => {
    if (filteredMessages !== null) return filteredMessages;

    // Combine regular messages with system messages
    const allMessages = [...messages];

    // Add system messages that aren't already in the messages array
    systemMessages.forEach(sysMsg => {
      const exists = messages.some(m => m.id === sysMsg.message_id);
      if (!exists && sysMsg.message_id) {
        // Convert system message format to match chat message format
        allMessages.push({
          id: sysMsg.message_id,
          conversation_id: null,
          sender_role: 'system',
          sender_id: 0,
          message_type: 'text',
          message: { text: sysMsg.text },
          is_seen: 0,
          created_at: sysMsg.created_at,
        });
      }
    });

    // Sort by creation date
    allMessages.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    return allMessages;
  }, [filteredMessages, messages, systemMessages]);

  const handleSearch = useCallback(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      setSearchResults([]);
      setCurrentSearchIndex(-1);
      return;
    }

    const results = displayMessages.filter(m => {
      const text = getText(m);
      return text.toLowerCase().includes(query);
    });
    setSearchResults(results);
    setCurrentSearchIndex(results.length > 0 ? 0 : -1);

    if (results.length > 0) {
      const msg = results[0];
      const messageId = msg?.message_id || msg?.id;
      if (messageId) {
        scrollToMessageId(messageId);
      }
    }
  }, [searchQuery, filteredMessages, messages, systemMessages, scrollToMessageId]);

  const handleSearchNext = useCallback(() => {
    if (searchResults.length === 0) return;
    const next = (currentSearchIndex + 1) % searchResults.length;
    setCurrentSearchIndex(next);
    const msg = searchResults[next];
    const messageId = msg?.message_id || msg?.id;
    if (messageId) {
      scrollToMessageId(messageId);
    }
  }, [searchResults, currentSearchIndex, scrollToMessageId]);

  const handleSearchPrev = useCallback(() => {
    if (searchResults.length === 0) return;
    const prev = (currentSearchIndex - 1 + searchResults.length) % searchResults.length;
    setCurrentSearchIndex(prev);
    const msg = searchResults[prev];
    const messageId = msg?.message_id || msg?.id;
    if (messageId) {
      scrollToMessageId(messageId);
    }
  }, [searchResults, currentSearchIndex, scrollToMessageId]);

  function handleSend() {
    if (!isAuthed) return;
    const text = input.trim();
    if (!text) return;

    setError('');
    setInput('');
    if (filteredMessages !== null) {
      setFilteredMessages(null);
      setFilterFrom('');
      setFilterTo('');
    }
    sendMessage({ message_type: 'text', message: text });
    setTimeout(() => {
      if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);
  }

  async function handleUploadFile(file) {
    if (!isAuthed) return;
    if (!file) return;

    const mime = file.type ? String(file.type) : '';
    if (!mime.startsWith('image/') && !mime.startsWith('video/')) {
      setError('Only images and videos are allowed');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const form = new FormData();
      form.append('file', file);

      const res = await fetch('/api/chat/upload', {
        method: 'POST',
        credentials: 'include',
        body: form,
      });

      const data = await res.json().catch(() => null);
      if (!res.ok || !data || data.success === false) {
        throw new Error((data && data.message) || 'Upload failed');
      }

      sendMessage({
        message_type: 'media',
        message: { url: data.url, mime: data.mime, kind: data.kind },
      });
      setTimeout(() => {
        if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 100);
    } catch (e) {
      setError(e?.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  return (
    <div>
      {/* Backdrop */}
      {chatOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999] transition-opacity duration-300"
          onClick={() => setChatOpen(false)}
        />
      )}

      {/* Chat Drawer */}
      <div
        ref={containerRef}
        className={`fixed top-0 right-0 h-full w-[420px] sm:w-[480px] max-w-[92vw] z-[1000] transform transition-transform duration-300 ease-out ${chatOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="h-full flex flex-col border-l border-white/[0.08] bg-white/[0.04] backdrop-blur-[14px] shadow-[-30px_0_90px_rgba(0,0,0,0.75)]">
          {/* Top Bar Row */}
          <div className="relative px-[14px] py-4 border-b border-white/[0.08] bg-gradient-to-b from-orange-500/10 to-transparent">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.15),transparent_60%)]" />
            <div className="relative flex items-center justify-between">
              <div className="flex flex-col">
                <div className="text-[14px] font-black uppercase tracking-[0.12em] text-orange-500/85">Support Center</div>
                <div className="text-[10px] text-gray-500 mt-1">How can we help you today?</div>
              </div>

              <div className="flex items-center gap-2">
                {activeTab === 'messages' && (
                  <>
                    <button
                      type="button"
                      onClick={() => setShowFilters(v => !v)}
                      className={`h-9 w-9 rounded-[10px] border bg-white/[0.04] hover:border-orange-500/35 text-gray-300 hover:text-white transition-all flex items-center justify-center ${showFilters || filteredMessages ? 'border-orange-500/50 text-orange-400' : 'border-white/[0.08]'}`}
                      aria-label="Filters"
                      title="Filters & Orders"
                    >
                      <Filter className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={toggleBeepMuted}
                      className="h-9 w-9 rounded-[10px] border border-white/[0.08] bg-white/[0.04] hover:border-orange-500/35 text-gray-300 hover:text-white transition-all flex items-center justify-center"
                      aria-label={beepMuted ? 'Unmute notifications' : 'Mute notifications'}
                      title={beepMuted ? 'Unmute notifications' : 'Mute notifications'}
                    >
                      {beepMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => setChatOpen(false)}
                  className="h-9 w-9 rounded-[10px] border border-white/[0.08] bg-white/[0.04] hover:border-orange-500/35 text-gray-300 hover:text-white transition-all flex items-center justify-center"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-white/[0.08] bg-[#0b0b0b]">
            {[
              { id: 'home', label: 'Home', icon: Home },
              { id: 'help', label: 'Help', icon: HelpCircle },
              { id: 'messages', label: 'Messages', icon: MessageSquare },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSelectedArticle(null);
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold uppercase tracking-wider transition-all ${activeTab === tab.id
                  ? 'text-orange-500 border-b-2 border-orange-500 bg-orange-500/5'
                  : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.02]'
                  }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'home' && (
            <div className="flex-1 overflow-y-auto bg-[#0b0b0b] px-4 py-6" style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(249, 115, 22, 0.4) transparent',
            }}>
              <div className="max-w-md mx-auto space-y-6">
                {/* Greeting */}
                <div className="text-center space-y-3">
                  <div className="text-2xl font-black text-white">Hi there! 👋</div>
                  <p className="text-gray-400 text-sm">How can we help you today?</p>
                  <button
                    onClick={() => setActiveTab('messages')}
                    className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Send us a message
                  </button>
                </div>

                {/* Quick Articles */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest text-gray-500">Popular Articles</h3>
                  {articles.map((article, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedArticle(article);
                        setActiveTab('help');
                      }}
                      className="w-full p-4 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-orange-500/30 rounded-xl text-left transition-all group"
                    >
                      <div className="flex items-start gap-3">
                        <BookOpen className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors">
                            {article.metadata?.name || 'Article'}
                          </div>
                          <div className="text-xs text-gray-500 mt-1 capitalize">{article.metadata?.section || 'general'}</div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-orange-500 transition-colors flex-shrink-0" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'help' && !selectedArticle && (
            <div className="flex-1 overflow-y-auto bg-[#0b0b0b] px-4 py-6" style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(249, 115, 22, 0.4) transparent',
            }}>
              <div className="max-w-md mx-auto space-y-6">
                <h2 className="text-xl font-black text-white">Help Center</h2>
                {Object.entries(getArticlesBySection()).map(([section, sectionArticles]) => (
                  <div key={section} className="space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 capitalize">{section}</h3>
                    {sectionArticles.map((article, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedArticle(article);
                          setSelectedTocIndex(0);
                        }}
                        className="w-full p-4 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-orange-500/30 rounded-xl text-left transition-all group"
                      >
                        <div className="flex items-start gap-3">
                          <BookOpen className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors">
                              {article.metadata?.name || 'Article'}
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-orange-500 transition-colors flex-shrink-0" />
                        </div>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'help' && selectedArticle && (
            <div className="flex-1 flex flex-col bg-[#0b0b0b] overflow-hidden">
              {/* Article Header with TOC */}
              <div className="px-4 py-4 border-b border-white/[0.08] space-y-3">
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <ChevronRight className="w-4 h-4 rotate-180" />
                  Back to articles
                </button>
                <h2 className="text-lg font-black text-white">{selectedArticle.metadata?.name}</h2>

                {/* Table of Contents Dropdown */}
                {selectedArticle.contents && selectedArticle.contents.length > 0 && (
                  <div className="relative">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 block mb-1">Jump to section</label>
                    <select
                      value={selectedTocIndex}
                      onChange={(e) => {
                        const idx = Number(e.target.value);
                        setSelectedTocIndex(idx);
                        setHighlightedSection(idx);
                        setTimeout(() => {
                          const el = document.getElementById(`article-section-${idx}`);
                          if (el) {
                            // Scroll element into view with center alignment
                            el.scrollIntoView({
                              behavior: 'smooth',
                              block: 'center',
                              inline: 'nearest'
                            });
                          }
                        }, 50);
                        // Remove highlight after animation
                        setTimeout(() => setHighlightedSection(null), 2000);
                      }}
                      className="w-full px-3 py-2 bg-white/[0.03] border border-white/[0.08] rounded-lg text-sm text-white outline-none focus:border-orange-500/50 appearance-none cursor-pointer"
                    >
                      {selectedArticle.contents.map((section, idx) => (
                        <option key={idx} value={idx} className="bg-black">
                          {section.title}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-[26px] w-4 h-4 text-gray-500 pointer-events-none" />
                  </div>
                )}
              </div>

              {/* Article Content */}
              <div
                ref={articleContentRef}
                className="flex-1 overflow-y-auto px-4 py-6"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgba(249, 115, 22, 0.4) transparent',
                }}
                onWheel={(e) => {
                  // Prevent scroll from propagating to background
                  const container = articleContentRef.current;
                  if (container) {
                    const { scrollTop, scrollHeight, clientHeight } = container;
                    const isAtTop = scrollTop === 0;
                    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

                    if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
                      e.preventDefault();
                    } else {
                      e.stopPropagation();
                    }
                  }
                }}
              >
                <div className="max-w-2xl mx-auto space-y-8">
                  {selectedArticle.contents?.map((section, idx) => (
                    <div key={idx} id={`article-section-${idx}`} className="scroll-mt-4">
                      <h3 className={`text-base font-black text-white mb-3 relative overflow-hidden ${highlightedSection === idx ? 'animate-highlight' : ''
                        }`}>
                        {highlightedSection === idx && (
                          <span
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/30 to-transparent"
                            style={{
                              animation: 'slideHighlight 2s ease-out forwards'
                            }}
                          />
                        )}
                        <span className="relative z-10">{section.title}</span>
                      </h3>
                      <div
                        className="prose prose-sm prose-invert max-w-none text-gray-300"
                        dangerouslySetInnerHTML={{ __html: section.content }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <>
              {!isAuthed ? (
                <div className="flex-1 flex items-center justify-center bg-[#0b0b0b] px-4 py-12">
                  <div className="max-w-sm text-center space-y-4">
                    <MessageSquare className="w-16 h-16 text-orange-500/50 mx-auto" />
                    <h3 className="text-xl font-black text-white">Login Required</h3>
                    <p className="text-gray-400 text-sm">Please log in to send messages and chat with our support team.</p>
                    <Link
                      href="/login"
                      className="inline-block px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-sm transition-all"
                    >
                      Login to Continue
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  {showFilters && (
                    <div className="relative mt-3 space-y-2">
                      {/* Timestamp filters */}
                      <div className="flex gap-2 items-end">
                        <div className="flex-1">
                          <label className="text-[9px] font-bold uppercase tracking-widest text-gray-500 block mb-1">From</label>
                          <input
                            type="date"
                            value={filterFrom}
                            onChange={(e) => setFilterFrom(e.target.value)}
                            className="w-full h-8 px-2 rounded-lg bg-black/40 border border-white/[0.08] text-gray-200 text-[11px] outline-none focus:border-orange-500/40"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="text-[9px] font-bold uppercase tracking-widest text-gray-500 block mb-1">To</label>
                          <input
                            type="date"
                            value={filterTo}
                            onChange={(e) => setFilterTo(e.target.value)}
                            className="w-full h-8 px-2 rounded-lg bg-black/40 border border-white/[0.08] text-gray-200 text-[11px] outline-none focus:border-orange-500/40"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleApplyFilters}
                          disabled={jumpLoading}
                          className="h-8 px-3 rounded-lg bg-orange-500/15 border border-orange-500/30 text-orange-400 text-[10px] font-bold uppercase hover:bg-orange-500/25 transition-all disabled:opacity-50"
                        >
                          {jumpLoading ? '...' : 'Apply'}
                        </button>
                        {filteredMessages && (
                          <button
                            type="button"
                            onClick={handleClearFilters}
                            className="h-8 px-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-gray-400 text-[10px] font-bold uppercase hover:text-white transition-all"
                          >
                            Clear
                          </button>
                        )}
                      </div>

                      {/* Search */}
                      <div>
                        <label className="text-[9px] font-bold uppercase tracking-widest text-gray-500 block mb-1">Search Messages</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleSearch();
                              }
                            }}
                            placeholder="Type to search..."
                            className="flex-1 h-8 px-2 rounded-lg bg-black/40 border border-white/[0.08] text-gray-200 text-[11px] outline-none focus:border-orange-500/40 placeholder-gray-500"
                          />
                          <button
                            type="button"
                            onClick={handleSearch}
                            className="h-8 px-3 rounded-lg bg-orange-500/15 border border-orange-500/30 text-orange-400 text-[10px] font-bold uppercase hover:bg-orange-500/25 transition-all"
                          >
                            Search
                          </button>
                        </div>
                        {searchResults.length > 0 && (
                          <div className="flex items-center justify-between mt-2">
                            <div className="text-[10px] text-gray-500 font-bold">
                              {currentSearchIndex + 1} of {searchResults.length} results
                            </div>
                            <div className="flex gap-1">
                              <button
                                type="button"
                                onClick={handleSearchPrev}
                                className="h-6 px-2 rounded bg-white/[0.04] border border-white/[0.08] text-gray-400 text-[9px] font-bold hover:text-white transition-all"
                              >
                                ↑
                              </button>
                              <button
                                type="button"
                                onClick={handleSearchNext}
                                className="h-6 px-2 rounded bg-white/[0.04] border border-white/[0.08] text-gray-400 text-[9px] font-bold hover:text-white transition-all"
                              >
                                ↓
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* System messages jump dropdown */}
                      {systemMessages.length > 0 && (
                        <div>
                          <label className="text-[9px] font-bold uppercase tracking-widest text-gray-500 block mb-1">Jump to Message</label>
                          <select
                            value={selectedOrderJump}
                            onChange={(e) => handleOrderJump(e.target.value)}
                            className="w-full h-8 px-2 rounded-lg bg-black/40 border border-white/[0.08] text-gray-200 text-[11px] outline-none focus:border-orange-500/40 appearance-none cursor-pointer"
                          >
                            <option value="" className="bg-black">Select a message...</option>
                            {systemMessages.map(m => {
                              const icon = m.type === 'order' ? '🛒' : m.type === 'dispute' ? '⚠️' : m.type === 'ticket' ? '🎫' : '📢';
                              return (
                                <option key={m.message_id} value={m.message_id} className="bg-black">
                                  {icon} {m.title} — {m.subtitle} ({new Date(m.created_at).toLocaleDateString()})
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      )}

                      {searchQuery.trim() && (
                        <div className="text-[10px] text-gray-500 font-bold">
                          Search: {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}" (jumping to {currentSearchIndex + 1})
                        </div>
                      )}
                      {filteredMessages && !searchQuery.trim() && (
                        <div className="text-[10px] text-gray-500 font-bold">
                          Showing {filteredMessages.length} filtered message{filteredMessages.length !== 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  )}

                  <div
                    className="flex-1 px-3 py-3 overflow-y-auto overflow-x-hidden bg-[#0b0b0b]"
                    onScroll={handleScroll}
                    style={{
                      scrollbarWidth: 'thin',
                      scrollbarColor: 'rgba(249, 115, 22, 0.4) transparent',
                    }}
                  >
                    {busy && messages.length === 0 && (
                      <div className="text-xs text-gray-400 px-1">Loading...</div>
                    )}
                    {error && (
                      <div className="text-xs text-red-400 px-1 mb-3">{error}</div>
                    )}

                    <div className="flex flex-col gap-3">
                      {displayMessages.map((m, idx) => {
                        const senderRole = getRole(m);
                        const myRole = role || (isAdmin ? 'admin' : 'user');
                        const mine = senderRole === myRole;
                        const text = getText(m);
                        const type = getMessageType(m);
                        const mediaUrl = getMedia(m);
                        const mediaKind = getMediaKind(m);
                        const internalPath = type === 'text' ? extractFirstInternalServiceUrl(text) : null;

                        if (senderRole === 'system') {
                          return (
                            <div key={m?.id ?? `m-${idx}`} data-message-id={m?.id} className="flex justify-center transition-all duration-300 rounded-2xl">
                              <div className="max-w-[90%] px-4 py-2.5 text-[11px] leading-relaxed text-center rounded-2xl bg-white/[0.04] border border-white/[0.06] text-gray-400 whitespace-pre-wrap break-words [word-break:break-word]">
                                {text || '...'}
                                <div className="text-[9px] text-gray-600 mt-1">
                                  {m?.created_at ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                </div>
                              </div>
                            </div>
                          );
                        }

                        return (
                          <div key={m?.id ?? `m-${idx}`} data-message-id={m?.id} className={`flex min-w-0 transition-all duration-300 rounded-2xl ${mine ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] min-w-0 ${mine ? 'items-end' : 'items-start'} flex flex-col gap-2`}>
                              {type === 'media' && mediaUrl ? (
                                <div
                                  className={`rounded-[18px] overflow-hidden border ${mine
                                    ? 'border-orange-500/35 bg-orange-500/15'
                                    : 'border-white/[0.08] bg-white/[0.03]'
                                    }`}
                                >
                                  {mediaKind === 'video' ? (
                                    <video src={mediaUrl} controls className="max-w-[280px] w-full h-auto" />
                                  ) : (
                                    <img src={mediaUrl} alt="upload" className="max-w-[280px] w-full h-auto object-cover" />
                                  )}
                                </div>
                              ) : null}

                              {type === 'text' && internalPath ? (
                                <ProductCard
                                  mine={mine}
                                  servicePath={internalPath}
                                  fetcher={fetchProductCardData}
                                  fallbackText={text}
                                />
                              ) : null}

                              {type === 'text' && !internalPath ? (
                                <div
                                  className={`px-[12px] py-[10px] text-[13px] leading-relaxed rounded-[18px] border w-fit max-w-full min-w-0 whitespace-pre-wrap break-words [word-break:break-word] ${mine
                                    ? 'bg-orange-500/15 border-orange-500/35 text-white'
                                    : 'bg-white/[0.03] border-white/[0.08] text-gray-100'
                                    }`}
                                >
                                  {text || '...'}
                                  <div className={`text-[10px] text-gray-500 mt-1 ${mine ? 'text-right' : 'text-left'}`}>
                                    {m?.created_at ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                    {mine && m?.id ? <span className="ml-2">{m?.is_seen ? 'Seen' : ''}</span> : null}
                                  </div>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        );
                      })}
                      <div ref={bottomRef} />
                    </div>

                    {/* Scroll to bottom button */}
                    {showScrollBtn && (
                      <button
                        onClick={scrollToBottom}
                        className="absolute bottom-24 left-1/2 -translate-x-1/2 h-8 px-3 rounded-full border border-white/[0.08] bg-white/[0.08] hover:bg-white/[0.12] text-white text-xs font-medium flex items-center gap-1 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
                      >
                        <ChevronDown className="h-3 w-3" />
                        New messages
                      </button>
                    )}

                    {/* Empty spacer at the end */}
                    <div className="h-4" />
                  </div>

                  <div className="px-3 pb-6 bg-[#0b0b0b] border-t border-white/[0.08] shrink-0">
                    <div className="flex items-end gap-2 pt-4">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,video/*"
                        className="hidden"
                        onChange={(e) => handleUploadFile(e.target.files && e.target.files[0])}
                      />

                      <button
                        type="button"
                        onClick={() => fileInputRef.current && fileInputRef.current.click()}
                        disabled={!isAuthed || uploading}
                        className="h-10 w-10 rounded-[10px] border border-white/[0.08] bg-white/[0.04] hover:border-orange-500/35 text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all shrink-0"
                        aria-label="Attach"
                      >
                        <Paperclip className="h-4 w-4" />
                      </button>

                      <div className="flex-1">
                        <input
                          ref={textareaRef}
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleSend();
                            }
                          }}
                          placeholder={uploading ? 'Uploading...' : 'Type a message...'}
                          disabled={uploading}
                          type="text"
                          className="w-full h-[40px] px-4 py-2 rounded-[12px] bg-black/25 border border-white/[0.08] text-gray-100 placeholder:text-gray-500 outline-none focus:border-orange-500/35"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={handleSend}
                        disabled={!isAuthed || uploading}
                        className="h-10 w-10 rounded-[10px] border border-orange-500/35 bg-orange-500/15 hover:bg-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all shrink-0"
                        aria-label="Send"
                      >
                        <SendHorizonal className="h-4 w-4 text-orange-300" />
                      </button>
                    </div>
                  </div>

                </>
              )}
            </>
          )}

          {/* Bottom Navigation Menu (Mobile Style) */}
          <div className="shrink-0 border-t border-white/[0.08] bg-[#0b0b0b]">
            <div className="flex items-center justify-around py-2">
              {[
                { id: 'home', label: 'Home', icon: Home },
                { id: 'help', label: 'Help', icon: HelpCircle },
                { id: 'messages', label: 'Messages', icon: MessageSquare },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSelectedArticle(null);
                  }}
                  className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${activeTab === tab.id
                    ? 'text-orange-500 bg-orange-500/10'
                    : 'text-gray-500 hover:text-gray-300'
                    }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {!chatOpen && (
        <button
          type="button"
          onClick={() => setChatOpen((v) => !v)}
          className="fixed bottom-5 right-5 h-14 w-14 rounded-[14px] border border-white/[0.08] bg-white/[0.04] backdrop-blur-[14px] flex items-center justify-center hover:border-orange-500/35 hover:bg-orange-500/10 transition-all shadow-[0_20px_60px_rgba(0,0,0,0.6)] z-[1001]"
          aria-label="Open chat"
        >
          <MessageCircle className="h-6 w-6 text-orange-400" />

          {unseenCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-[6px] rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center shadow-[0_6px_20px_rgba(0,0,0,0.45)]">
              {unseenCount >= 99 ? '99' : unseenCount}
            </span>
          )}
        </button>
      )}
    </div>
  );
}

function ProductCard({ mine, servicePath, fetcher, fallbackText }) {
  const [card, setCard] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const data = await fetcher(servicePath);
      if (!alive) return;
      setCard(data);
    })();
    return () => {
      alive = false;
    };
  }, [fetcher, servicePath]);

  if (!card) {
    return (
      <div
        className={`px-[12px] py-[10px] text-[13px] leading-relaxed rounded-[18px] border ${mine ? 'bg-orange-500/15 border-orange-500/35 text-white' : 'bg-white/[0.03] border-white/[0.08] text-gray-100'
          }`}
      >
        {fallbackText || '...'}
      </div>
    );
  }

  return (
    <Link
      href={card.href}
      className={`block rounded-[18px] overflow-hidden border transition-all hover:-translate-y-[1px] ${mine ? 'border-orange-500/35 bg-orange-500/15' : 'border-white/[0.08] bg-white/[0.03]'
        }`}
    >
      <div className="flex gap-3 p-3">
        <div className="h-16 w-16 rounded-[14px] overflow-hidden border border-white/[0.08] bg-black/40 flex-shrink-0">
          {card.thumbnail ? (
            <img src={card.thumbnail} alt="thumb" className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-black uppercase tracking-[0.2em] text-orange-500/80">Product</div>
          <div className="text-sm font-bold text-white truncate">{card.title}</div>
          <div className="text-xs text-gray-400 line-clamp-2 mt-1">{card.description || 'View details'}</div>
        </div>
      </div>
    </Link>
  );
}
