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

  const login = useCallback(async ({ email, password, twoFaToken }) => {
    const body = { email, password };
    if (twoFaToken) body.twoFaToken = twoFaToken;
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body,
    });
    if (data && data.user) setUser(data.user);
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

  // Settings functions
  const changeUsername = useCallback(async ({ password, newUsername }) => {
    const data = await apiFetch('/settings/username', {
      method: 'POST',
      body: { password, newUsername },
    });
    if (data.success) setUser(prev => prev ? { ...prev, username: data.username } : prev);
    return data;
  }, []);

  const requestEmailChange = useCallback(async ({ password, newEmail }) => {
    return apiFetch('/settings/email/request', {
      method: 'POST',
      body: { password, newEmail },
    });
  }, []);

  const confirmEmailChange = useCallback(async ({ newEmail, otp }) => {
    const data = await apiFetch('/settings/email/confirm', {
      method: 'POST',
      body: { newEmail, otp },
    });
    if (data.success) setUser(prev => prev ? { ...prev, email: data.email } : prev);
    return data;
  }, []);

  const changePasswordSettings = useCallback(async ({ currentPassword, newPassword, confirmPassword }) => {
    return apiFetch('/settings/password', {
      method: 'POST',
      body: { currentPassword, newPassword, confirmPassword },
    });
  }, []);

  const generate2FASecret = useCallback(async () => {
    return apiFetch('/settings/2fa/generate', { method: 'POST' });
  }, []);

  const enable2FA = useCallback(async ({ token }) => {
    const data = await apiFetch('/settings/2fa/enable', {
      method: 'POST',
      body: { token },
    });
    if (data.success) setUser(prev => prev ? { ...prev, two_fa_enabled: true } : prev);
    return data;
  }, []);

  const disable2FA = useCallback(async ({ password, token }) => {
    const data = await apiFetch('/settings/2fa/disable', {
      method: 'POST',
      body: { password, token },
    });
    if (data.success) setUser(prev => prev ? { ...prev, two_fa_enabled: false } : prev);
    return data;
  }, []);

  const requestAccountVerify = useCallback(async () => {
    return apiFetch('/settings/verify/request', { method: 'POST' });
  }, []);

  const confirmAccountVerify = useCallback(async ({ otp }) => {
    const data = await apiFetch('/settings/verify/confirm', {
      method: 'POST',
      body: { otp },
    });
    if (data.success) setUser(prev => prev ? { ...prev, is_verified: true } : prev);
    return data;
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
      changeUsername,
      requestEmailChange,
      confirmEmailChange,
      changePasswordSettings,
      generate2FASecret,
      enable2FA,
      disable2FA,
      requestAccountVerify,
      confirmAccountVerify,
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
      changeUsername,
      requestEmailChange,
      confirmEmailChange,
      changePasswordSettings,
      generate2FASecret,
      enable2FA,
      disable2FA,
      requestAccountVerify,
      confirmAccountVerify,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
