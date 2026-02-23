'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSocket } from '@/contexts/SocketContext';
import { apiFetch } from '@/lib/api';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import {
    Loader2, ArrowLeft, Flag, CheckCircle2, Lock, SendHorizonal,
    Paperclip, AlertCircle, Package, Clock, ChevronDown,
} from 'lucide-react';

const REASON_LABELS = {
    invalid_credentials: 'Invalid Credentials',
    wrong_account: 'Wrong Account',
    not_as_described: 'Not As Described',
    other: 'Other',
};

export default function TicketChatPage() {
    const { user, loading: authLoading } = useAuth();
    const { socket, isConnected, emit, on, off } = useSocket();
    const router = useRouter();
    const params = useParams();
    const ticketId = params.id ? Number(params.id) : null;

    const [ticket, setTicket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [input, setInput] = useState('');
    const [sending, setSending] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [typing, setTyping] = useState(false);
    const [showScrollBtn, setShowScrollBtn] = useState(false);
    const [resolveLoading, setResolveLoading] = useState(false);

    const scrollRef = useRef(null);
    const bottomRef = useRef(null);
    const fileInputRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const lastProcessedIdRef = useRef(null);

    const isAdmin = !!(user && user.is_admin);

    // ── Fetch ticket + initial messages via REST ──
    useEffect(() => {
        if (!authLoading && !user) {
            router.push(`/login?next=/ticket/${params.id}`);
        }
    }, [user, authLoading, router, params.id]);

    useEffect(() => {
        if (!user || !ticketId) return;
        const load = async () => {
            try {
                const data = await apiFetch(`/tickets/${ticketId}`);
                setTicket(data.ticket);
                const msgs = (data.messages || []).reverse();
                setMessages(msgs);
            } catch (err) {
                setError(err.message || 'Failed to load ticket');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [user, ticketId]);

    // ── Socket: load history on connect ──
    useEffect(() => {
        if (!isConnected || !ticketId || !ticket) return;

        emit('ticket:history', { ticket_id: ticketId, limit: 100 }, (res) => {
            if (res && res.success && res.messages) {
                const msgs = res.messages.reverse();
                setMessages(msgs);
            }
        });
    }, [isConnected, ticketId, ticket, emit]);

    // ── Socket: new message listener ──
    useEffect(() => {
        if (!socket || !ticketId) return;

        const handleNewMessage = (msg) => {
            if (Number(msg.ticket_id) !== ticketId) return;
            setMessages(prev => {
                if (prev.some(m => m.id === msg.id)) return prev;
                return [...prev, msg];
            });
        };

        const handleSeenUpdate = (data) => {
            if (Number(data.ticket_id) !== ticketId) return;
            setMessages(prev => prev.map(m =>
                m.id === data.message_id ? { ...m, is_seen: true } : m
            ));
        };

        let typingClearTimer = null;
        const handleTyping = (data) => {
            if (Number(data.ticket_id) !== ticketId) return;
            const shouldHandle = (isAdmin && data.role === 'user') || (!isAdmin && data.role === 'admin');
            if (!shouldHandle) return;
            setTyping(data.typing);
            clearTimeout(typingClearTimer);
            if (data.typing) {
                typingClearTimer = setTimeout(() => setTyping(false), 4000);
            }
        };

        const handleTicketUpdated = (data) => {
            if (Number(data.ticket_id) !== ticketId) return;
            setTicket(prev => prev ? { ...prev, status: data.status || prev.status } : prev);
        };

        socket.on('ticket:message:new', handleNewMessage);
        socket.on('ticket:message:seen:update', handleSeenUpdate);
        socket.on('ticket:typing', handleTyping);
        socket.on('ticket:updated', handleTicketUpdated);

        return () => {
            clearTimeout(typingClearTimer);
            socket.off('ticket:message:new', handleNewMessage);
            socket.off('ticket:message:seen:update', handleSeenUpdate);
            socket.off('ticket:typing', handleTyping);
            socket.off('ticket:updated', handleTicketUpdated);
        };
    }, [socket, ticketId, isAdmin]);

    // ── Auto-scroll on new messages ──
    useEffect(() => {
        if (!messages.length) return;
        const last = messages[messages.length - 1];
        if (!last?.id) return;
        if (lastProcessedIdRef.current === String(last.id)) return;
        lastProcessedIdRef.current = String(last.id);

        setTimeout(() => {
            if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }, 60);
    }, [messages]);

    // ── Mark messages as seen ──
    useEffect(() => {
        if (!isConnected || !messages.length || !ticket) return;
        const myRole = isAdmin ? 'admin' : 'user';
        messages.forEach(m => {
            if (!m?.id || m.is_seen) return;
            if (myRole === 'user' && (m.sender_role === 'admin' || m.sender_role === 'system')) {
                emit('ticket:message:seen', { message_id: m.id });
            }
            if (myRole === 'admin' && m.sender_role === 'user') {
                emit('ticket:message:seen', { message_id: m.id });
            }
        });
    }, [messages, isConnected, isAdmin, ticket, emit]);

    // ── Scroll detection ──
    const handleScroll = useCallback((e) => {
        const el = e.target;
        const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
        setShowScrollBtn(!isNearBottom);
    }, []);

    const scrollToBottom = useCallback(() => {
        if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, []);

    // ── Send message ──
    const handleSend = () => {
        const text = input.trim();
        if (!text || !isConnected || ticket?.status !== 'open') return;
        setSending(true);
        setInput('');
        emit('ticket:message:send', {
            ticket_id: ticketId,
            message_type: 'text',
            message: text,
        });
        setSending(false);
        setTimeout(() => {
            if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }, 100);
    };

    // ── Typing indicator ──
    const handleInputChange = (e) => {
        setInput(e.target.value);
        if (!isConnected || ticket?.status !== 'open') return;
        emit('ticket:typing', { ticket_id: ticketId, typing: true });
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            emit('ticket:typing', { ticket_id: ticketId, typing: false });
        }, 2000);
    };

    // ── Upload media ──
    const handleUpload = async (file) => {
        if (!file || !isConnected || ticket?.status !== 'open') return;
        const mime = file.type || '';
        if (!mime.startsWith('image/') && !mime.startsWith('video/')) {
            toast.error('Only images and videos are allowed');
            return;
        }
        setUploading(true);
        try {
            const form = new FormData();
            form.append('file', file);
            const res = await fetch('/api/chat/upload', { method: 'POST', credentials: 'include', body: form });
            const data = await res.json().catch(() => null);
            if (!res.ok || !data || data.success === false) throw new Error(data?.message || 'Upload failed');

            emit('ticket:message:send', {
                ticket_id: ticketId,
                message_type: 'media',
                message: { url: data.url, mime: data.mime, kind: data.kind },
            });
            setTimeout(() => {
                if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }, 100);
        } catch (err) {
            toast.error(err.message || 'Upload failed');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    // ── Resolve ticket ──
    const handleResolve = async () => {
        setResolveLoading(true);
        try {
            await apiFetch(`/tickets/${ticketId}/resolve`, { method: 'POST' });
            toast.success('Dispute resolved');
            setTicket(prev => prev ? { ...prev, status: 'resolved' } : prev);
        } catch (err) {
            toast.error(err.message || 'Failed to resolve');
        } finally {
            setResolveLoading(false);
        }
    };

    // ── Helpers ──
    function getText(m) {
        if (!m) return '';
        if (typeof m.message === 'string') return m.message;
        if (m.message && typeof m.message === 'object' && typeof m.message.text === 'string') return m.message.text;
        return '';
    }

    function getMedia(m) {
        if (!m?.message || typeof m.message !== 'object') return null;
        return typeof m.message.url === 'string' ? m.message.url : null;
    }

    function getMediaKind(m) {
        if (!m?.message || typeof m.message !== 'object') return null;
        if (typeof m.message.kind === 'string') return m.message.kind;
        const mime = typeof m.message.mime === 'string' ? m.message.mime : '';
        if (mime.startsWith('video/')) return 'video';
        if (mime.startsWith('image/')) return 'image';
        return null;
    }

    // ── Loading / Error states ──
    if (authLoading || (loading && user)) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
            </div>
        );
    }

    if (!user) return null;

    if (error) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
                <AlertCircle className="w-16 h-16 text-red-500 mb-6" />
                <h1 className="text-3xl font-black italic uppercase tracking-tighter mb-2">Error</h1>
                <p className="text-gray-500 mb-8">{error}</p>
                <Link href="/ticket" className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold uppercase tracking-widest transition-all">
                    Back to Disputes
                </Link>
            </div>
        );
    }

    if (!ticket) return null;

    const snapshot = ticket.order?.product_snapshot;
    const statusOpen = ticket.status === 'open';

    return (
        <div className="min-h-screen bg-black text-white font-sans flex flex-col">
            {/* ── Header ── */}
            <div className="border-b border-white/5 bg-[#0a0a0a] sticky top-0 z-30">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
                    <div className="flex items-center gap-4">
                        <Link href="/ticket" className="p-2 rounded-xl hover:bg-white/5 transition-colors">
                            <ArrowLeft className="w-5 h-5 text-gray-400" />
                        </Link>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                                    Ticket #{ticket.id}
                                </span>
                                <span className="text-gray-700">•</span>
                                <Link href={`/orders/${ticket.order_id}`} className="text-[10px] font-bold text-orange-500/70 hover:text-orange-400 transition-colors">
                                    Order #{ticket.order_id}
                                </Link>
                            </div>
                            <h1 className="text-lg font-black italic uppercase tracking-tighter truncate">
                                {snapshot?.title || `Order #${ticket.order_id}`}
                            </h1>
                            <p className="text-[10px] text-gray-500 font-bold">
                                {REASON_LABELS[ticket.reason] || ticket.reason}
                            </p>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                            <div className={`px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest ${
                                ticket.status === 'open' ? 'bg-orange-500/10 border-orange-500/20 text-orange-500' :
                                ticket.status === 'resolved' ? 'bg-green-500/10 border-green-500/20 text-green-500' :
                                'bg-white/5 border-white/10 text-gray-500'
                            }`}>
                                {ticket.status}
                            </div>
                            {statusOpen && !isAdmin && (
                                <button
                                    onClick={handleResolve}
                                    disabled={resolveLoading}
                                    className="px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-black uppercase tracking-widest hover:bg-green-500/20 transition-all disabled:opacity-50 flex items-center gap-1.5"
                                >
                                    {resolveLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                                    Resolve
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Chat Area ── */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 relative"
                onScroll={handleScroll}
                style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(249,115,22,0.4) transparent' }}
            >
                <div className="max-w-4xl mx-auto flex flex-col gap-3">
                    {messages.map((m, idx) => {
                        const senderRole = m.sender_role || 'other';
                        const myRole = isAdmin ? 'admin' : 'user';
                        const mine = senderRole === myRole;
                        const text = getText(m);
                        const mediaUrl = getMedia(m);
                        const mediaKind = getMediaKind(m);
                        const isMedia = m.message_type === 'media';

                        if (senderRole === 'system') {
                            return (
                                <div key={m.id ?? `m-${idx}`} className="flex justify-center my-2">
                                    <div className="max-w-[85%] px-5 py-3 text-[11px] leading-relaxed text-center rounded-2xl bg-white/[0.04] border border-white/[0.06] text-gray-400 whitespace-pre-wrap break-words">
                                        {text || '...'}
                                        <div className="text-[9px] text-gray-600 mt-1.5">
                                            {m.created_at ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                        </div>
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <div key={m.id ?? `m-${idx}`} className={`flex min-w-0 ${mine ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] min-w-0 flex flex-col gap-1 ${mine ? 'items-end' : 'items-start'}`}>
                                    {isMedia && mediaUrl ? (
                                        <div className={`rounded-2xl overflow-hidden border ${mine ? 'border-orange-500/35 bg-orange-500/15' : 'border-white/[0.08] bg-white/[0.03]'}`}>
                                            {mediaKind === 'video' ? (
                                                <video src={mediaUrl} controls className="max-w-[320px] w-full h-auto" />
                                            ) : (
                                                <img src={mediaUrl} alt="upload" className="max-w-[320px] w-full h-auto object-cover" />
                                            )}
                                        </div>
                                    ) : (
                                        <div className={`px-4 py-3 text-[13px] leading-relaxed rounded-2xl border w-fit max-w-full min-w-0 whitespace-pre-wrap break-words [word-break:break-word] ${
                                            mine ? 'bg-orange-500/15 border-orange-500/35 text-white' : 'bg-white/[0.03] border-white/[0.08] text-gray-100'
                                        }`}>
                                            {text || '...'}
                                        </div>
                                    )}
                                    <div className={`flex items-center gap-2 text-[10px] text-gray-600 px-1 ${mine ? 'flex-row-reverse' : ''}`}>
                                        <span>{m.created_at ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                                        {mine && m.id && <span>{m.is_seen ? 'Seen' : ''}</span>}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {typing && (
                        <div className="flex justify-start">
                            <div className="px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-gray-400 text-[13px]">
                                <span className="animate-pulse">typing...</span>
                            </div>
                        </div>
                    )}

                    <div ref={bottomRef} />
                </div>

                {showScrollBtn && (
                    <button
                        onClick={scrollToBottom}
                        className="fixed bottom-24 right-8 h-9 px-4 rounded-full border border-white/[0.08] bg-white/[0.08] hover:bg-white/[0.12] text-white text-xs font-medium flex items-center gap-1.5 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.5)] z-20"
                    >
                        <ChevronDown className="h-3.5 w-3.5" />
                        Latest
                    </button>
                )}
            </div>

            {/* ── Input Bar ── */}
            <div className="border-t border-white/5 bg-[#0a0a0a] sticky bottom-0 z-30">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3">
                    {statusOpen ? (
                        <div className="flex items-end gap-2">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*,video/*"
                                className="hidden"
                                onChange={(e) => handleUpload(e.target.files?.[0])}
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className="h-11 w-11 rounded-xl border border-white/[0.08] bg-white/[0.04] hover:border-orange-500/35 text-gray-300 disabled:opacity-50 flex items-center justify-center transition-all shrink-0"
                            >
                                <Paperclip className="h-4 w-4" />
                            </button>
                            <input
                                value={input}
                                onChange={handleInputChange}
                                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSend(); } }}
                                placeholder={uploading ? 'Uploading...' : 'Type a message...'}
                                disabled={uploading || sending}
                                className="flex-1 h-11 px-4 rounded-xl bg-black/25 border border-white/[0.08] text-gray-100 placeholder:text-gray-500 outline-none focus:border-orange-500/35 transition-all"
                            />
                            <button
                                type="button"
                                onClick={handleSend}
                                disabled={!input.trim() || uploading || sending}
                                className="h-11 w-11 rounded-xl border border-orange-500/35 bg-orange-500/15 hover:bg-orange-500/25 disabled:opacity-50 flex items-center justify-center transition-all shrink-0"
                            >
                                <SendHorizonal className="h-4 w-4 text-orange-300" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center gap-2 py-2 text-gray-500 text-sm font-bold">
                            <Lock className="w-4 h-4" />
                            This dispute is {ticket.status}. No new messages can be sent.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
