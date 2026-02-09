'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSocket } from '@/lib/SocketContext';

const IDLE_AFTER_MS = 60_000;
const HEARTBEAT_MS = 25_000;

export default function PresenceTracker() {
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();
  const lastStateRef = useRef(null);
  const idleTimerRef = useRef(null);
  const heartbeatRef = useRef(null);
  const handlersAttached = useRef(false);

  useEffect(() => {
    if (!user || !socket) return;

    function emitState(state) {
      if (!state) return;
      if (lastStateRef.current === state) return;
      lastStateRef.current = state;
      socket.emit('presence:state', { state });
    }

    function setIdleTimer() {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        emitState('idle');
      }, IDLE_AFTER_MS);
    }

    function onVisibilityChange() {
      if (document.hidden) {
        emitState('idle');
      } else {
        emitState('online');
        setIdleTimer();
      }
    }

    function onActivity() {
      if (!document.hidden) {
        emitState('online');
        setIdleTimer();
      }
    }

    function onConnect() {
      const next = document.hidden ? 'idle' : 'online';
      emitState(next);
      setIdleTimer();
    }

    if (handlersAttached.current) return;
    handlersAttached.current = true;

    socket.on('connect', onConnect);
    if (isConnected) onConnect();

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('mousemove', onActivity, { passive: true });
    window.addEventListener('keydown', onActivity);
    window.addEventListener('scroll', onActivity, { passive: true });
    window.addEventListener('touchstart', onActivity, { passive: true });

    heartbeatRef.current = setInterval(() => {
      const state = document.hidden ? 'idle' : (lastStateRef.current || 'online');
      socket.emit('presence:heartbeat', { state });
    }, HEARTBEAT_MS);

    return () => {
      socket.off('connect', onConnect);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('mousemove', onActivity);
      window.removeEventListener('keydown', onActivity);
      window.removeEventListener('scroll', onActivity);
      window.removeEventListener('touchstart', onActivity);

      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
      handlersAttached.current = false;

      // best-effort
      try {
        socket.emit('presence:state', { state: 'offline' });
      } catch {
        // no-op
      }
    };
  }, [user, socket, isConnected]);

  return null;
}
