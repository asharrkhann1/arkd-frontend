'use client';

import { io } from 'socket.io-client';

let socket;

export function getSocket() {
  if (socket) return socket;

  const url = "http://localhost:3000";
  if (!url) {
    throw new Error('BACKEND_URL is not set');
  }

  socket = io(url, {
    withCredentials: true,
    transports: ['websocket'],
  });

  return socket;
}

export function disconnectSocket() {
  if (!socket) return;
  socket.disconnect();
  socket = undefined;
}
