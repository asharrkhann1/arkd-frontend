'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshMe = useCallback(async () => {
    try {
      const data = await apiFetch('/auth/me');
      setUser(data && data.user ? data.user : null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshMe();
  }, [refreshMe]);

  const signup = useCallback(async ({ username, email, password }) => {
    const data = await apiFetch('/auth/signup', {
      method: 'POST',
      body: { username, email, password },
    });
    setUser(data && data.user ? data.user : null);
    return data;
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    setUser(data && data.user ? data.user : null);
    return data;
  }, []);

  const logout = useCallback(async () => {
    await apiFetch('/auth/logout', { method: 'POST' });
    setUser(null);
  }, []);

  const requestOtp = useCallback(async ({ email, purpose }) => {
    return apiFetch('/auth/otp/request', {
      method: 'POST',
      body: { email, purpose },
    });
  }, []);

  const verifyOtp = useCallback(async ({ email, otp, purpose }) => {
    return apiFetch('/auth/otp/verify', {
      method: 'POST',
      body: { email, otp, purpose },
    });
  }, []);

  const forgotPassword = useCallback(async ({ email }) => {
    return apiFetch('/auth/password/forgot', {
      method: 'POST',
      body: { email },
    });
  }, []);

  const changePassword = useCallback(async ({ currentPassword, newPassword }) => {
    return apiFetch('/auth/password/change', {
      method: 'POST',
      body: { currentPassword, newPassword },
    });
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      signup,
      login,
      logout,
      refreshMe,
      requestOtp,
      verifyOtp,
      forgotPassword,
      changePassword,
    }),
    [
      user,
      loading,
      signup,
      login,
      logout,
      refreshMe,
      requestOtp,
      verifyOtp,
      forgotPassword,
      changePassword,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
