'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSocket } from './SocketContext';

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
  const { socket, isConnected, session: socketSession, error: socketError } = useSocket();
  const [messages, setMessages] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const role = socketSession?.role || null;

  const convoKey = useMemo(() => {
    const userIdForKey = role === 'admin' ? receiverId : activeUserId;
    return getConversationKey({ role: role || 'unknown', userId: userIdForKey || 'unknown' });
  }, [activeUserId, receiverId, role]);

  const lastMessageIdRef = useRef(null);
  const pendingByClientIdRef = useRef(new Map());
  const seenSentRef = useRef(new Set());

  useEffect(() => {
    if (socketError) {
      setError(socketError);
    }
  }, [socketError]);

  const markMessageSeen = useCallback(
    async (messageId) => {
      const idNum = safeParseInt(messageId);
      if (!idNum) return;
      if (!enabled) return;

      if (!socket) return;

      const key = String(idNum);
      if (seenSentRef.current.has(key)) return;
      seenSentRef.current.add(key);

      socket.emit('message:seen', { message_id: idNum });
    },
    [enabled, socket]
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
      if (!socket) return;
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

      socket.emit('chat:history', payload, (res) => {
        setBusy(false);
        if (res && res.success === false) {
          setError(res.message || 'Failed to load history');
          return;
        }
        setHistory(res);
      });
    },
    [activeUserId, receiverId, role, setHistory, socket]
  );

  const sync = useCallback(() => {
    if (!socket) return;
    const targetUserId = role === 'admin' ? receiverId : activeUserId;
      if (!targetUserId) return;

      const stored = readLastMessageId(convoKey);
      const afterId = safeParseInt(lastMessageIdRef.current) || stored;
      if (!afterId) return;

      socket.emit('chat:sync', { user_id: targetUserId, after_id: afterId }, (res) => {
        if (res && res.success === false) return;
        const list = res && typeof res === 'object' && Array.isArray(res.messages) ? res.messages : [];
        list.forEach((m) => appendMessage(m));
      });
    },
    [activeUserId, receiverId, role, convoKey, appendMessage, socket]
  );

  const sendMessage = useCallback(
    ({ text, media }) => {
      if (!socket) return;

      const type = media && typeof media === 'object' ? 'media' : 'text';
      const msgText = type === 'text' && text ? String(text).trim() : '';

      if (type === 'text' && !msgText) {
        setError('Message cannot be empty');
        return;
      }
      if (type === 'media' && (!media || typeof media !== 'object')) {
        setError('Media is required');
        return;
      }

      const clientId = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const payload =
        type === 'text'
          ? { message_type: 'text', message: { text: msgText }, client_message_id: clientId }
          : {
              message_type: 'media',
              message: { media },
              client_message_id: clientId,
            };

      pendingByClientIdRef.current.set(clientId, true);
      appendMessage({
        client_message_id: clientId,
        message_type: type,
        message: type === 'text' ? { text: msgText } : media,
        sender_role: role || 'user',
        is_seen: false,
      });

      socket.emit('message:send', payload);
    },
    [appendMessage, role, socket]
  );

  useEffect(() => {
    if (!enabled || !socket) return;

    function onConnect() {
      setError('');
      if (loadHistoryOnConnect) {
        if (role === 'admin') {
          if (receiverId) loadHistory();
        } else {
          if (activeUserId) loadHistory();
        }
        sync();
      }
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

    socket.on('message:new', onMessageNew);
    socket.on('message:sent', onMessageSent);
    socket.on('message:error', onMessageError);
    socket.on('message:seen:update', onMessageSeenUpdate);

    if (isConnected) {
      onConnect();
    }

    return () => {
      socket.off('message:new', onMessageNew);
      socket.off('message:sent', onMessageSent);
      socket.off('message:error', onMessageError);
      socket.off('message:seen:update', onMessageSeenUpdate);
    };
  }, [
    enabled,
    socket,
    isConnected,
    activeUserId,
    receiverId,
    role,
    loadHistoryOnConnect,
    loadHistory,
    sync,
    appendMessage,
  ]);

  useEffect(() => {
    if (!enabled) return;
    if (!convoKey) return;
    lastMessageIdRef.current = readLastMessageId(convoKey);
  }, [convoKey, enabled]);

  return {
    session: socketSession,
    role,
    messages,
    busy,
    error,
    setError,
    loadHistory,
    sync,
    sendMessage,
    markMessageSeen,
    isConnected,
  };
}
