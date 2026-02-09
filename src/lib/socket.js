'use client';

import { io } from 'socket.io-client';

let socket;

export function getSocket() {
  if (socket) return socket;

  const url = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  if (!url) {
    throw new Error('BACKEND_URL is not set');
  }

  socket = io(url, {
    withCredentials: true,
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
