'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSocket } from '@/contexts/SocketContext';

const IDLE_AFTER_MS = 60_000;
const HEARTBEAT_MS = 25_000;

export default function PresenceTracker() {
  const { user } = useAuth();
  const { socket, isConnected, emit, on, off } = useSocket();
  const lastStateRef = useRef(null);
  const idleTimerRef = useRef(null);
  const heartbeatRef = useRef(null);

  useEffect(() => {
    if (!user || !isConnected) return;

    function emitState(state) {
      if (!state) return;
      if (lastStateRef.current === state) return;
      lastStateRef.current = state;
      emit('presence:state', { state });
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

    on('connect', onConnect);
    if (isConnected) onConnect();

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('mousemove', onActivity, { passive: true });
    window.addEventListener('keydown', onActivity);
    window.addEventListener('scroll', onActivity, { passive: true });
    window.addEventListener('touchstart', onActivity, { passive: true });

    heartbeatRef.current = setInterval(() => {
      const state = document.hidden ? 'idle' : (lastStateRef.current || 'online');
      emit('presence:heartbeat', { state });
    }, HEARTBEAT_MS);

    return () => {
      off('connect', onConnect);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('mousemove', onActivity);
      window.removeEventListener('keydown', onActivity);
      window.removeEventListener('scroll', onActivity);
      window.removeEventListener('touchstart', onActivity);

      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);

      // best-effort
      try {
        emit('presence:state', { state: 'offline' });
      } catch {
        // no-op
      }
    };
  }, [user, isConnected, emit, on, off]);

  return null;
}
