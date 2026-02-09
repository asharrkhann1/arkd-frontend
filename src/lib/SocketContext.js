'use client';

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

// Get session ID from backend (workaround for third-party cookie blocking)
async function fetchSessionId(apiUrl) {
  try {
    const res = await fetch(`${apiUrl}/auth/session`, {
      credentials: 'include',
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        return data.sessionId;
      }
    }
  } catch (err) {
    console.log('[Socket] Failed to get session ID:', err.message);
  }
  return null;
}

export function SocketProvider({ children, apiUrl }) {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [session, setSession] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!apiUrl || typeof window === 'undefined') return;

    let mounted = true;

    async function initSocket() {
      try {
        // Fetch session ID for cross-domain cookie workaround
        const sessionId = await fetchSessionId(apiUrl);
        console.log('[Socket] Session ID:', sessionId);

        const s = io(apiUrl, {
          withCredentials: true,
          auth: { sessionId },
          query: { authkey: sessionId },
          transports: ['polling', 'websocket'],
        });

        if (!mounted) {
          s.disconnect();
          return;
        }

        socketRef.current = s;
        setSocket(s);

        s.on('connect', () => {
          console.log('[Socket] Connected');
          setIsConnected(true);
          setError(null);
        });

        s.on('disconnect', () => {
          console.log('[Socket] Disconnected');
          setIsConnected(false);
        });

        s.on('connect_error', (err) => {
          console.error('[Socket] Connection error:', err.message);
          setError(err.message);
          setIsConnected(false);
        });

        s.on('chat:connected', (payload) => {
          if (payload?.role) {
            setSession({ user_id: payload.user_id, role: payload.role });
          }
        });

        if (s.connected) {
          setIsConnected(true);
        }
      } catch (err) {
        console.error('[Socket] Init error:', err);
        setError('Failed to initialize socket');
      }
    }

    initSocket();

    return () => {
      mounted = false;
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [apiUrl]);

  const value = {
    socket,
    isConnected,
    error,
    session,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
}
