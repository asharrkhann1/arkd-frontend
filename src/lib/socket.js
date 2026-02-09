'use client';

import { io } from 'socket.io-client';

let socket;
let sessionId = null;

// Get session ID from backend (workaround for third-party cookie blocking)
async function fetchSessionId() {
  try {
    const url = process.env.NEXT_PUBLIC_BACKEND_API_URL;
    const res = await fetch(`${url}/auth/session`, {
      credentials: 'include',
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        sessionId = data.sessionId;
        console.log('[Socket] Got session ID:', sessionId);
      }
    }
  } catch (err) {
    console.log('[Socket] Failed to get session ID:', err.message);
  }
}

export async function getSocket() {
  if (socket) return socket;

  // First, try to get session ID (for cross-domain cookie workaround)
  if (!sessionId) {
    await fetchSessionId();
  }

  const url = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  if (!url) {
    throw new Error('BACKEND_URL is not set');
  }

  socket = io(url, {
    withCredentials: true,
    // Pass session ID in auth as fallback when cookie is blocked
    auth: { sessionId },
    // Let Socket.IO use HTTP polling first (cookies work better), then upgrade to WebSocket
    transports: ['polling', 'websocket'],
  });

  return socket;
}

export function disconnectSocket() {
  if (!socket) return;
  socket.disconnect();
  socket = undefined;
}
