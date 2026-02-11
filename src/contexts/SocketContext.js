'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
    const { user } = useAuth();
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState(null);

    const connect = useCallback(() => {
        if (!user) {
            if (socket) {
                socket.disconnect();
                setSocket(null);
                setIsConnected(false);
            }
            return;
        }

        const url = process.env.NEXT_PUBLIC_BACKEND_API_URL;
        if (!url) {
            setError('NEXT_PUBLIC_BACKEND_API_URL is not set');
            return;
        }

        // Avoid creating duplicate connections
        if (socket?.connected) return;

        const newSocket = io(url, {
            withCredentials: true,
            transports: ['websocket'],
        });

        newSocket.on('connect', () => {
            console.log('Socket connected');
            setIsConnected(true);
            setError(null);
        });

        newSocket.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason);
            setIsConnected(false);
        });

        newSocket.on('connect_error', (err) => {
            console.error('Socket connection error:', err.message);
            setError(err.message);
            setIsConnected(false);
        });

        newSocket.on('chat:connected', (payload) => {
            console.log('Chat session:', payload);
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [user]);

    const disconnect = useCallback(() => {
        if (socket) {
            socket.disconnect();
            setSocket(null);
            setIsConnected(false);
        }
    }, [socket]);

    useEffect(() => {
        connect();
        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, [connect]);

    const emit = useCallback((event, data, callback) => {
        if (!socket || !isConnected) {
            console.warn('Socket not connected, cannot emit:', event);
            return;
        }
        socket.emit(event, data, callback);
    }, [socket, isConnected]);

    const on = useCallback((event, handler) => {
        if (!socket) return;
        socket.on(event, handler);
    }, [socket]);

    const off = useCallback((event, handler) => {
        if (!socket) return;
        socket.off(event, handler);
    }, [socket]);

    const value = {
        socket,
        isConnected,
        error,
        emit,
        on,
        off,
        connect,
        disconnect,
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
}

export function useSocket() {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
}
