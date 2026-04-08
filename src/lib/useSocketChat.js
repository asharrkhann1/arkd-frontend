'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSocket } from '@/contexts/SocketContext';

function safeParseInt(v) {
  if (v === null || v === undefined) return null;
  if (typeof v === 'number') return Number.isFinite(v) ? v : null;
  const s = String(v).trim();
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function getConversationKey({ role, userId }) {
  return `${role || 'unknown'}:${userId || 'unknown'}`;
}

function getLastMessageIdKey(conversationKey) {
  return `chat:lastMessageId:${conversationKey}`;
}

function readLastMessageId(conversationKey) {
  try {
    const raw = localStorage.getItem(getLastMessageIdKey(conversationKey));
    const id = safeParseInt(raw);
    return id;
  } catch {
    return null;
  }
}

function writeLastMessageId(conversationKey, lastMessageId) {
  try {
    if (!conversationKey) return;
    if (!lastMessageId) return;
    localStorage.setItem(getLastMessageIdKey(conversationKey), String(lastMessageId));
  } catch {
    // no-op
  }
}

export function useSocketChat({ enabled, activeUserId, receiverId, loadHistoryOnConnect = true }) {
  const { socket, isConnected, emit, on, off } = useSocket();
  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const role = session && session.role ? session.role : null;

  const convoKey = useMemo(() => {
    const userIdForKey = role === 'admin' ? receiverId : activeUserId;
    return getConversationKey({ role: role || 'unknown', userId: userIdForKey || 'unknown' });
  }, [activeUserId, receiverId, role]);

  const lastMessageIdRef = useRef(null);
  const pendingByClientIdRef = useRef(new Map());
  const seenSentRef = useRef(new Set());

  const markMessageSeen = useCallback(
    (messageId) => {
      const idNum = safeParseInt(messageId);
      if (!idNum) return;
      if (!enabled) return;

      const key = String(idNum);
      if (seenSentRef.current.has(key)) return;
      seenSentRef.current.add(key);

      emit('message:seen', { message_id: idNum });
    },
    [enabled, emit]
  );

  const appendMessage = useCallback(
    (msg) => {
      if (!msg || typeof msg !== 'object') return;

      setMessages((prev) => {
        if (msg.id && prev.some((m) => m && m.id === msg.id)) return prev;

        const clientId = msg.client_message_id;
        if (clientId && pendingByClientIdRef.current.has(clientId)) {
          const pendingIdx = prev.findIndex((m) => m && m.client_message_id === clientId && !m.id);
          if (pendingIdx >= 0) {
            const next = [...prev];
            next[pendingIdx] = msg;
            return next;
          }
        }

        return [...prev, msg];
      });

      if (msg.id) {
        const idNum = safeParseInt(msg.id);
        if (idNum) {
          lastMessageIdRef.current = Math.max(lastMessageIdRef.current || 0, idNum);
          writeLastMessageId(convoKey, lastMessageIdRef.current);
        }
      }
    },
    [convoKey]
  );

  const setHistory = useCallback(
    (res) => {
      if (!res || typeof res !== 'object') return;
      const list = Array.isArray(res.messages) ? res.messages : [];
      const ordered = [...list].reverse();
      setMessages(ordered);

      const maxId = ordered.reduce((acc, m) => {
        const id = m && typeof m === 'object' ? safeParseInt(m.id) : null;
        return id ? Math.max(acc, id) : acc;
      }, 0);

      if (maxId) {
        lastMessageIdRef.current = maxId;
        writeLastMessageId(convoKey, maxId);
      }
    },
    [convoKey]
  );

  const loadHistory = useCallback(
    ({ beforeId } = {}) => {
      const targetUserId = role === 'admin' ? receiverId : activeUserId;
      if (!targetUserId) {
        setError(role === 'admin' ? 'receiver_id is required' : 'Missing user id');
        return;
      }

      setBusy(true);
      setError('');

      const payload = {
        user_id: targetUserId,
        limit: 50,
        ...(beforeId ? { before_id: beforeId } : {}),
      };

      emit('chat:history', payload, (res) => {
        setBusy(false);
        if (res && res.success === false) {
          setError(res.message || 'Failed to load history');
          return;
        }
        setHistory(res);
      });
    },
    [activeUserId, receiverId, role, setHistory, emit]
  );

  const sync = useCallback(() => {
    const targetUserId = role === 'admin' ? receiverId : activeUserId;
    if (!targetUserId) return;

    const stored = readLastMessageId(convoKey);
    const afterId = safeParseInt(lastMessageIdRef.current) || stored;
    if (!afterId) return;

    emit('chat:sync', { user_id: targetUserId, after_id: afterId }, (res) => {
      if (res && res.success === false) return;
      const list = res && typeof res === 'object' && Array.isArray(res.messages) ? res.messages : [];
      const ordered = [...list].reverse();
      ordered.forEach(appendMessage);
    });
  }, [activeUserId, appendMessage, convoKey, receiverId, role, emit]);

  const sendMessage = useCallback(
    ({ message_type = 'text', message, client_message_id } = {}) => {
      const type = message_type === 'media' ? 'media' : 'text';
      const msgText = type === 'text' ? (typeof message === 'string' ? message : '') : null;
      const mediaObj = type === 'media' ? (message && typeof message === 'object' ? message : (typeof message === 'string' ? { url: message } : null)) : null;

      if (type === 'text') {
        if (!msgText.trim()) return;
      } else {
        if (!mediaObj || !mediaObj.url) return;
      }

      const clientId = client_message_id || `${Date.now()}-${Math.random().toString(16).slice(2)}`;

      const payload = {
        client_message_id: clientId,
        message_type: type,
        message: type === 'text' ? msgText : mediaObj,
        ...(role === 'admin' ? { receiver_id: receiverId } : {}),
      };

      if (role === 'admin' && !receiverId) {
        setError('receiver_id is required');
        return;
      }

      pendingByClientIdRef.current.set(clientId, true);
      appendMessage({
        client_message_id: clientId,
        message_type: type,
        message: type === 'text' ? { text: msgText } : mediaObj,
        sender_role: role || 'user',
        is_seen: false,
      });

      emit('message:send', payload);
    },
    [appendMessage, receiverId, role, emit]
  );

  useEffect(() => {
    if (!enabled || !isConnected) return;

    function onChatConnected(payload) {
      if (!payload || typeof payload !== 'object') return;
      const uid = payload.user_id ?? payload.id;
      const r = payload.role;
      if (!r) return;
      setSession({ user_id: uid, role: r });
    }

    function onConnect() {
      setError('');
      sync();
      if (loadHistoryOnConnect) {
        if (role === 'admin') {
          if (receiverId) loadHistory();
        } else {
          if (activeUserId) loadHistory();
        }
      }
    }

    function onConnectError(err) {
      setBusy(false);
      setError(err?.message || 'Socket connection error');
    }

    function onMessageNew(msg) {
      appendMessage(msg);
    }

    function onMessageSent(msg) {
      appendMessage(msg);
    }

    function onMessageError(payload) {
      const message = payload && typeof payload === 'object' ? payload.message : null;
      setError(message || 'Failed to send message');
    }

    function onMessageSeenUpdate(payload) {
      const messageId = payload && typeof payload === 'object' ? safeParseInt(payload.message_id) : null;
      if (!messageId) return;
      setMessages((prev) =>
        prev.map((m) => {
          if (!m || typeof m !== 'object') return m;
          if (safeParseInt(m.id) !== messageId) return m;
          return { ...m, is_seen: true };
        })
      );
    }

    on('chat:connected', onChatConnected);
    on('connect', onConnect);
    on('connect_error', onConnectError);
    on('message:new', onMessageNew);
    on('message:sent', onMessageSent);
    on('message:error', onMessageError);
    on('message:seen:update', onMessageSeenUpdate);

    if (isConnected) onConnect();

    return () => {
      off('chat:connected', onChatConnected);
      off('connect', onConnect);
      off('connect_error', onConnectError);
      off('message:new', onMessageNew);
      off('message:sent', onMessageSent);
      off('message:error', onMessageError);
      off('message:seen:update', onMessageSeenUpdate);
    };
  }, [
    activeUserId,
    appendMessage,
    enabled,
    isConnected,
    loadHistory,
    loadHistoryOnConnect,
    markMessageSeen,
    off,
    on,
    receiverId,
    role,
    sync,
  ]);

  useEffect(() => {
    if (!enabled) return;
    if (!convoKey) return;
    lastMessageIdRef.current = readLastMessageId(convoKey);
  }, [convoKey, enabled]);

  return {
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
  };
}
