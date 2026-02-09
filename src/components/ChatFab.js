'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageCircle, Paperclip, SendHorizonal, Volume2, VolumeX, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSocketChat } from '@/lib/useSocketChat';
import { apiFetch } from '@/lib/api';

export default function ChatFab() {
  const { user } = useAuth();
  const pathname = usePathname();

  const BEEP_KEY = 'chat_beep_muted_v1';

  const [chatOpen, setChatOpen] = useState(false);
  const [unseenCount, setUnseenCount] = useState(0);
  const [input, setInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [beepMuted, setBeepMuted] = useState(false);
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
  const lastProcessedMessageIdRef = useRef(null);
  const beepCooldownRef = useRef(0);

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
      if (senderRole !== 'admin') return;
      if (!m?.id) return;
      if (m?.is_seen) return;
      markMessageSeen(m.id);
    });
  }, [chatOpen, isAdmin, markMessageSeen, messages, role]);

  useEffect(() => {
    setChatOpen(false);
  }, [pathname]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(BEEP_KEY);
      setBeepMuted(raw === '1');
    } catch {
      setBeepMuted(false);
    }
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

  async function playBeep() {
    if (beepMuted) return;
    const now = Date.now();
    if (now - (beepCooldownRef.current || 0) < 700) return;
    beepCooldownRef.current = now;

    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      const ctx = new Ctx();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 880;
      gain.gain.value = 0.03;

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.08);

      osc.onended = () => {
        try { ctx.close(); } catch {
          // ignore
        }
      };
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    if (!chatOpen) return;
    setError('');
    setInput('');
    setUnseenCount(0);
    const last = messages && messages.length ? messages[messages.length - 1] : null;
    const lastId = last && last.id != null ? String(last.id) : null;
    if (lastId) lastProcessedMessageIdRef.current = lastId;
  }, [chatOpen, isAdmin, setError]);

  useEffect(() => {
    if (!messages || messages.length === 0) return;

    const last = messages[messages.length - 1];
    const lastId = last && last.id != null ? String(last.id) : null;
    if (!lastId) return;
    if (lastProcessedMessageIdRef.current === lastId) return;

    lastProcessedMessageIdRef.current = lastId;

    if (chatOpen) return;

    const myRole = role || (isAdmin ? 'admin' : 'user');
    const senderRole = getRole(last);
    if (senderRole && senderRole !== myRole) {
      setUnseenCount((c) => Math.min(99, (c || 0) + 1));
      playBeep();
    }
  }, [chatOpen, isAdmin, messages, role, beepMuted]);

  useEffect(() => {
    if (!chatOpen) return;
    if (!bottomRef.current) return;
    bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [chatOpen, messages.length]);

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

  function handleSend() {
    if (!isAuthed) return;
    const text = input.trim();
    if (!text) return;

    setError('');
    setInput('');
    sendMessage({ message_type: 'text', message: text });
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
    } catch (e) {
      setError(e?.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  return (
    <div ref={containerRef} className="fixed bottom-5 right-5 z-[1000]">
      {chatOpen && (
        <div className="mb-3 w-[360px] max-w-[90vw] rounded-3xl border border-white/10 bg-gradient-to-b from-[#0b0b0b]/95 to-[#050505]/95 backdrop-blur-2xl shadow-[0_30px_90px_rgba(0,0,0,0.75)] overflow-hidden">
          <div className="relative px-5 py-4 border-b border-white/10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.15),transparent_60%)]" />
            <div className="relative flex items-center justify-between">
              <div className="flex flex-col">
                <div className="text-sm font-bold text-white">Chat with Admin</div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleBeepMuted}
                  className="h-9 w-9 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-gray-300 hover:text-white transition-all flex items-center justify-center"
                  aria-label={beepMuted ? 'Unmute notifications' : 'Mute notifications'}
                  title={beepMuted ? 'Unmute notifications' : 'Mute notifications'}
                >
                  {beepMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>

                <button
                  type="button"
                  onClick={() => setChatOpen(false)}
                  className="h-9 w-9 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-gray-300 hover:text-white transition-all flex items-center justify-center"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="h-[360px] px-4 py-4 overflow-y-auto overflow-x-hidden">
            {busy && messages.length === 0 && (
              <div className="text-sm text-slate-500 px-1">Loading...</div>
            )}
            {error && (
              <div className="text-xs text-red-400 px-1 mb-3">{error}</div>
            )}

            <div className="flex flex-col gap-3">
              {messages.map((m, idx) => {
                const senderRole = getRole(m);
                const myRole = role || (isAdmin ? 'admin' : 'user');
                const mine = senderRole === myRole;
                const text = getText(m);
                const type = getMessageType(m);
                const mediaUrl = getMedia(m);
                const mediaKind = getMediaKind(m);
                const internalPath = type === 'text' ? extractFirstInternalServiceUrl(text) : null;

                return (
                  <div key={m?.id ?? `m-${idx}`} className={`flex min-w-0 ${mine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] min-w-0 ${mine ? 'items-end' : 'items-start'} flex flex-col gap-2`}>
                      {type === 'media' && mediaUrl ? (
                        <div
                          className={`rounded-3xl overflow-hidden border ${
                            mine
                              ? 'border-orange-500/25 bg-orange-500/10'
                              : 'border-white/10 bg-white/[0.03]'
                          } shadow-[0_20px_50px_rgba(0,0,0,0.35)]`}
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
                          className={`px-4 py-3 text-[13px] leading-relaxed rounded-3xl border w-fit max-w-full min-w-0 whitespace-pre-wrap break-words [word-break:break-word] ${
                            mine
                              ? 'bg-orange-500/10 border-orange-500/25 text-white'
                              : 'bg-white/[0.03] border-white/10 text-gray-100'
                          }`}
                        >
                          {text || '...'}
                        </div>
                      ) : null}

                      {mine && m?.id ? (
                        <div className="text-[10px] text-gray-500 px-1">{m?.is_seen ? 'Seen' : ''}</div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>
          </div>

          <div className="px-4 pb-4">
            <div className="flex items-end gap-2 rounded-3xl border border-white/10 bg-white/[0.03] p-2">
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
                className="h-10 w-10 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all"
                aria-label="Attach"
              >
                <Paperclip className="h-4 w-4" />
              </button>

              <div className="flex-1">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSend();
                  }}
                  placeholder={uploading ? 'Uploading...' : 'Type your message'}
                  disabled={uploading}
                  className="w-full h-10 px-3 rounded-2xl bg-transparent text-gray-100 placeholder:text-gray-600 outline-none"
                />
              </div>

              <button
                type="button"
                onClick={handleSend}
                disabled={!isAuthed || uploading}
                className="h-10 w-10 rounded-2xl border border-orange-500/25 bg-orange-500/10 hover:bg-orange-500/20 hover:border-orange-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all"
                aria-label="Send"
              >
                <SendHorizonal className="h-4 w-4 text-orange-300" />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => {
          if (!isAuthed) {
            setError('Login required');
            return;
          }
          setChatOpen((v) => !v);
        }}
        className="relative h-14 w-14 rounded-full border border-white/10 bg-gradient-to-b from-orange-500/25 to-orange-500/10 backdrop-blur-2xl shadow-[0_30px_80px_rgba(0,0,0,0.75)] flex items-center justify-center hover:from-orange-500/35 hover:to-orange-500/15 transition-all"
        aria-label="Open chat"
      >
        <MessageCircle className="h-6 w-6 text-orange-300" />

        {unseenCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] leading-[18px] font-extrabold text-center shadow-[0_6px_20px_rgba(0,0,0,0.45)]">
            {unseenCount >= 99 ? '99' : unseenCount}
          </span>
        )}
      </button>
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
        className={`px-4 py-3 text-[13px] leading-relaxed rounded-3xl border ${
          mine ? 'bg-orange-500/10 border-orange-500/25 text-white' : 'bg-white/[0.03] border-white/10 text-gray-100'
        }`}
      >
        {fallbackText || '...'}
      </div>
    );
  }

  return (
    <Link
      href={card.href}
      className={`block rounded-3xl overflow-hidden border shadow-[0_20px_50px_rgba(0,0,0,0.35)] transition-all hover:-translate-y-[1px] ${
        mine ? 'border-orange-500/25 bg-orange-500/10' : 'border-white/10 bg-white/[0.03]'
      }`}
    >
      <div className="flex gap-3 p-3">
        <div className="h-16 w-16 rounded-2xl overflow-hidden border border-white/10 bg-black/40 flex-shrink-0">
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
