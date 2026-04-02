'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
    Loader2,
    User,
    Mail,
    Lock,
    Shield,
    ShieldCheck,
    ShieldAlert,
    Eye,
    EyeOff,
    Check,
    X,
    AlertTriangle,
    Copy,
    CheckCircle2,
} from 'lucide-react';

// ─── Reusable Components ────────────────────────────────────────────────────

function SectionCard({ title, icon: Icon, children, accentColor = 'orange' }) {
    return (
        <div className="bg-gradient-to-b from-white/[0.04] to-transparent border border-white/[0.08] rounded-2xl p-6 relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-${accentColor}-500/60 to-transparent`} />
            <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-xl bg-${accentColor}-500/10 border border-${accentColor}-500/20 flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 text-${accentColor}-500`} />
                </div>
                <h2 className="text-lg font-black text-white uppercase tracking-wider">{title}</h2>
            </div>
            {children}
        </div>
    );
}

function InputField({ label, type = 'text', value, onChange, placeholder, disabled }) {
    const [showPass, setShowPass] = useState(false);
    const isPassword = type === 'password';

    return (
        <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{label}</label>
            <div className="relative">
                <input
                    type={isPassword && showPass ? 'text' : type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder-gray-600 outline-none focus:border-orange-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                    >
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                )}
            </div>
        </div>
    );
}

function StatusMessage({ type, message }) {
    if (!message) return null;
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`flex items-center gap-2 p-3 rounded-xl text-xs font-bold ${type === 'success'
                    ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                    : 'bg-red-500/10 border border-red-500/20 text-red-400'
                }`}
        >
            {type === 'success' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
            {message}
        </motion.div>
    );
}

function ActionButton({ onClick, loading, disabled, children, variant = 'primary' }) {
    const base = 'px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';
    const variants = {
        primary: 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-[0_0_20px_rgba(249,115,22,0.3)]',
        danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]',
        secondary: 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white',
    };

    return (
        <button onClick={onClick} disabled={disabled || loading} className={`${base} ${variants[variant]}`}>
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {children}
        </button>
    );
}

// ─── Main Settings Page ─────────────────────────────────────────────────────

export default function SettingsPage() {
    const {
        user,
        loading: authLoading,
        changeUsername,
        requestEmailChange,
        confirmEmailChange,
        changePasswordSettings,
        generate2FASecret,
        enable2FA,
        disable2FA,
        requestAccountVerify,
        confirmAccountVerify,
    } = useAuth();
    const router = useRouter();

    // Username
    const [newUsername, setNewUsername] = useState('');
    const [usernamePassword, setUsernamePassword] = useState('');
    const [usernameLoading, setUsernameLoading] = useState(false);
    const [usernameMsg, setUsernameMsg] = useState({ type: '', text: '' });

    // Email
    const [newEmail, setNewEmail] = useState('');
    const [emailPassword, setEmailPassword] = useState('');
    const [emailOtp, setEmailOtp] = useState('');
    const [emailStep, setEmailStep] = useState(1); // 1 = request, 2 = verify
    const [emailLoading, setEmailLoading] = useState(false);
    const [emailMsg, setEmailMsg] = useState({ type: '', text: '' });

    // Password
    const [currentPass, setCurrentPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [passLoading, setPassLoading] = useState(false);
    const [passMsg, setPassMsg] = useState({ type: '', text: '' });

    // 2FA
    const [twoFAStep, setTwoFAStep] = useState('idle'); // idle, setup, verify, disable
    const [twoFASecret, setTwoFASecret] = useState('');
    const [twoFAQR, setTwoFAQR] = useState('');
    const [twoFAToken, setTwoFAToken] = useState('');
    const [twoFAPassword, setTwoFAPassword] = useState('');
    const [twoFALoading, setTwoFALoading] = useState(false);
    const [twoFAMsg, setTwoFAMsg] = useState({ type: '', text: '' });
    const [secretCopied, setSecretCopied] = useState(false);

    // Verification
    const [verifyOtp, setVerifyOtp] = useState('');
    const [verifyStep, setVerifyStep] = useState(1); // 1 = request, 2 = verify
    const [verifyLoading, setVerifyLoading] = useState(false);
    const [verifyMsg, setVerifyMsg] = useState({ type: '', text: '' });

    useEffect(() => {
        if (!authLoading && !user) router.push('/');
    }, [authLoading, user, router]);

    if (authLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
            </div>
        );
    }

    if (!user) return null;

    // ─── Handlers ───────────────────────────────────────────────────────────

    const handleChangeUsername = async () => {
        setUsernameMsg({ type: '', text: '' });
        if (!newUsername.trim() || !usernamePassword) {
            setUsernameMsg({ type: 'error', text: 'Fill in all fields' });
            return;
        }
        setUsernameLoading(true);
        try {
            await changeUsername({ password: usernamePassword, newUsername: newUsername.trim() });
            setUsernameMsg({ type: 'success', text: 'Username changed successfully' });
            setNewUsername('');
            setUsernamePassword('');
        } catch (err) {
            setUsernameMsg({ type: 'error', text: err.message });
        } finally {
            setUsernameLoading(false);
        }
    };

    const handleRequestEmailOtp = async () => {
        setEmailMsg({ type: '', text: '' });
        if (!newEmail.trim() || !emailPassword) {
            setEmailMsg({ type: 'error', text: 'Fill in all fields' });
            return;
        }
        setEmailLoading(true);
        try {
            await requestEmailChange({ password: emailPassword, newEmail: newEmail.trim().toLowerCase() });
            setEmailMsg({ type: 'success', text: 'OTP sent to your new email' });
            setEmailStep(2);
        } catch (err) {
            setEmailMsg({ type: 'error', text: err.message });
        } finally {
            setEmailLoading(false);
        }
    };

    const handleConfirmEmailChange = async () => {
        setEmailMsg({ type: '', text: '' });
        if (!emailOtp.trim()) {
            setEmailMsg({ type: 'error', text: 'Enter the OTP' });
            return;
        }
        setEmailLoading(true);
        try {
            await confirmEmailChange({ newEmail: newEmail.trim().toLowerCase(), otp: emailOtp.trim() });
            setEmailMsg({ type: 'success', text: 'Email changed successfully' });
            setNewEmail('');
            setEmailPassword('');
            setEmailOtp('');
            setEmailStep(1);
        } catch (err) {
            setEmailMsg({ type: 'error', text: err.message });
        } finally {
            setEmailLoading(false);
        }
    };

    const handleChangePassword = async () => {
        setPassMsg({ type: '', text: '' });
        if (!currentPass || !newPass || !confirmPass) {
            setPassMsg({ type: 'error', text: 'Fill in all fields' });
            return;
        }
        if (newPass !== confirmPass) {
            setPassMsg({ type: 'error', text: 'New passwords do not match' });
            return;
        }
        setPassLoading(true);
        try {
            await changePasswordSettings({ currentPassword: currentPass, newPassword: newPass, confirmPassword: confirmPass });
            setPassMsg({ type: 'success', text: 'Password changed successfully' });
            setCurrentPass('');
            setNewPass('');
            setConfirmPass('');
        } catch (err) {
            setPassMsg({ type: 'error', text: err.message });
        } finally {
            setPassLoading(false);
        }
    };

    const handleGenerate2FA = async () => {
        setTwoFAMsg({ type: '', text: '' });
        setTwoFALoading(true);
        try {
            const data = await generate2FASecret();
            setTwoFASecret(data.secret);
            setTwoFAQR(data.qrCode);
            setTwoFAStep('setup');
        } catch (err) {
            setTwoFAMsg({ type: 'error', text: err.message });
        } finally {
            setTwoFALoading(false);
        }
    };

    const handleEnable2FA = async () => {
        setTwoFAMsg({ type: '', text: '' });
        if (!twoFAToken.trim()) {
            setTwoFAMsg({ type: 'error', text: 'Enter the 6-digit code from your authenticator app' });
            return;
        }
        setTwoFALoading(true);
        try {
            await enable2FA({ token: twoFAToken.trim() });
            setTwoFAMsg({ type: 'success', text: '2FA enabled successfully!' });
            setTwoFAStep('idle');
            setTwoFAToken('');
            setTwoFASecret('');
            setTwoFAQR('');
        } catch (err) {
            setTwoFAMsg({ type: 'error', text: err.message });
        } finally {
            setTwoFALoading(false);
        }
    };

    const handleDisable2FA = async () => {
        setTwoFAMsg({ type: '', text: '' });
        if (!twoFAPassword || !twoFAToken.trim()) {
            setTwoFAMsg({ type: 'error', text: 'Enter your password and 2FA code' });
            return;
        }
        setTwoFALoading(true);
        try {
            await disable2FA({ password: twoFAPassword, token: twoFAToken.trim() });
            setTwoFAMsg({ type: 'success', text: '2FA disabled successfully' });
            setTwoFAStep('idle');
            setTwoFAToken('');
            setTwoFAPassword('');
        } catch (err) {
            setTwoFAMsg({ type: 'error', text: err.message });
        } finally {
            setTwoFALoading(false);
        }
    };

    const handleRequestVerifyOtp = async () => {
        setVerifyMsg({ type: '', text: '' });
        setVerifyLoading(true);
        try {
            await requestAccountVerify();
            setVerifyMsg({ type: 'success', text: 'Verification OTP sent to your email' });
            setVerifyStep(2);
        } catch (err) {
            setVerifyMsg({ type: 'error', text: err.message });
        } finally {
            setVerifyLoading(false);
        }
    };

    const handleConfirmVerify = async () => {
        setVerifyMsg({ type: '', text: '' });
        if (!verifyOtp.trim()) {
            setVerifyMsg({ type: 'error', text: 'Enter the OTP' });
            return;
        }
        setVerifyLoading(true);
        try {
            await confirmAccountVerify({ otp: verifyOtp.trim() });
            setVerifyMsg({ type: 'success', text: 'Account verified successfully!' });
            setVerifyOtp('');
            setVerifyStep(1);
        } catch (err) {
            setVerifyMsg({ type: 'error', text: err.message });
        } finally {
            setVerifyLoading(false);
        }
    };

    const copySecret = () => {
        navigator.clipboard.writeText(twoFASecret);
        setSecretCopied(true);
        setTimeout(() => setSecretCopied(false), 2000);
    };

    // ─── Render ─────────────────────────────────────────────────────────────

    return (
        <div className="min-h-screen bg-[#0a0a0a] pt-28 pb-16">
            <div className="container mx-auto px-4 max-w-3xl">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter italic">
                        Account <span className="text-orange-500">Settings</span>
                    </h1>
                    <p className="text-sm text-gray-500 mt-2 uppercase tracking-wider font-bold">
                        Manage your account security and profile
                    </p>
                </div>

                {/* Account Verification Banner */}
                {!user.is_verified && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-2xl"
                    >
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <h3 className="text-sm font-black text-yellow-400 uppercase tracking-wider">Account Not Verified</h3>
                                <p className="text-xs text-gray-400 mt-1">Verify your account to access all features. We'll send a verification code to your email.</p>
                                <div className="mt-3 space-y-3">
                                    <AnimatePresence>
                                        <StatusMessage type={verifyMsg.type} message={verifyMsg.text} />
                                    </AnimatePresence>

                                    {verifyStep === 1 ? (
                                        <ActionButton onClick={handleRequestVerifyOtp} loading={verifyLoading}>
                                            Send Verification Code
                                        </ActionButton>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="text"
                                                value={verifyOtp}
                                                onChange={(e) => setVerifyOtp(e.target.value)}
                                                placeholder="Enter 6-digit OTP"
                                                maxLength={6}
                                                className="bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder-gray-600 outline-none focus:border-orange-500/50 transition-all w-48"
                                            />
                                            <ActionButton onClick={handleConfirmVerify} loading={verifyLoading}>
                                                Verify
                                            </ActionButton>
                                            <button
                                                onClick={() => { setVerifyStep(1); setVerifyMsg({ type: '', text: '' }); }}
                                                className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                                            >
                                                Resend
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                <div className="space-y-6">
                    {/* ─── Change Username ────────────────────────────────────── */}
                    <SectionCard title="Change Username" icon={User}>
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 p-3 bg-white/[0.02] rounded-xl border border-white/5">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Current:</span>
                                <span className="text-sm font-bold text-white">{user.username}</span>
                            </div>
                            <InputField
                                label="New Username"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                                placeholder="Enter new username"
                            />
                            <InputField
                                label="Current Password"
                                type="password"
                                value={usernamePassword}
                                onChange={(e) => setUsernamePassword(e.target.value)}
                                placeholder="Enter your password to confirm"
                            />
                            <AnimatePresence>
                                <StatusMessage type={usernameMsg.type} message={usernameMsg.text} />
                            </AnimatePresence>
                            <ActionButton onClick={handleChangeUsername} loading={usernameLoading}>
                                Update Username
                            </ActionButton>
                        </div>
                    </SectionCard>

                    {/* ─── Change Email ───────────────────────────────────────── */}
                    <SectionCard title="Change Email" icon={Mail}>
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 p-3 bg-white/[0.02] rounded-xl border border-white/5">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Current:</span>
                                <span className="text-sm font-bold text-white">{user.email}</span>
                            </div>

                            {emailStep === 1 ? (
                                <>
                                    <InputField
                                        label="New Email"
                                        type="email"
                                        value={newEmail}
                                        onChange={(e) => setNewEmail(e.target.value)}
                                        placeholder="Enter new email address"
                                    />
                                    <InputField
                                        label="Current Password"
                                        type="password"
                                        value={emailPassword}
                                        onChange={(e) => setEmailPassword(e.target.value)}
                                        placeholder="Enter your password to confirm"
                                    />
                                    <AnimatePresence>
                                        <StatusMessage type={emailMsg.type} message={emailMsg.text} />
                                    </AnimatePresence>
                                    <ActionButton onClick={handleRequestEmailOtp} loading={emailLoading}>
                                        Send Verification Code
                                    </ActionButton>
                                </>
                            ) : (
                                <>
                                    <p className="text-xs text-gray-400">
                                        We sent a 6-digit code to <span className="text-orange-400 font-bold">{newEmail}</span>
                                    </p>
                                    <InputField
                                        label="Verification Code"
                                        value={emailOtp}
                                        onChange={(e) => setEmailOtp(e.target.value)}
                                        placeholder="Enter 6-digit OTP"
                                    />
                                    <AnimatePresence>
                                        <StatusMessage type={emailMsg.type} message={emailMsg.text} />
                                    </AnimatePresence>
                                    <div className="flex items-center gap-3">
                                        <ActionButton onClick={handleConfirmEmailChange} loading={emailLoading}>
                                            Confirm Email Change
                                        </ActionButton>
                                        <button
                                            onClick={() => { setEmailStep(1); setEmailMsg({ type: '', text: '' }); setEmailOtp(''); }}
                                            className="text-xs text-gray-500 hover:text-gray-300 transition-colors underline"
                                        >
                                            Go back
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </SectionCard>

                    {/* ─── Change Password ────────────────────────────────────── */}
                    <SectionCard title="Change Password" icon={Lock}>
                        <div className="space-y-4">
                            <InputField
                                label="Current Password"
                                type="password"
                                value={currentPass}
                                onChange={(e) => setCurrentPass(e.target.value)}
                                placeholder="Enter current password"
                            />
                            <InputField
                                label="New Password"
                                type="password"
                                value={newPass}
                                onChange={(e) => setNewPass(e.target.value)}
                                placeholder="Enter new password (min 6 chars)"
                            />
                            <InputField
                                label="Confirm New Password"
                                type="password"
                                value={confirmPass}
                                onChange={(e) => setConfirmPass(e.target.value)}
                                placeholder="Re-enter new password"
                            />
                            <AnimatePresence>
                                <StatusMessage type={passMsg.type} message={passMsg.text} />
                            </AnimatePresence>
                            <ActionButton onClick={handleChangePassword} loading={passLoading}>
                                Update Password
                            </ActionButton>
                        </div>
                    </SectionCard>

                    {/* ─── Two-Factor Authentication ──────────────────────────── */}
                    <SectionCard
                        title="Two-Factor Authentication"
                        icon={user.two_fa_enabled ? ShieldCheck : Shield}
                        accentColor={user.two_fa_enabled ? 'green' : 'orange'}
                    >
                        <div className="space-y-4">
                            {/* Status indicator */}
                            <div className={`flex items-center gap-3 p-3 rounded-xl border ${user.two_fa_enabled
                                    ? 'bg-green-500/5 border-green-500/20'
                                    : 'bg-yellow-500/5 border-yellow-500/20'
                                }`}>
                                {user.two_fa_enabled ? (
                                    <>
                                        <ShieldCheck className="w-5 h-5 text-green-500" />
                                        <span className="text-sm font-bold text-green-400">2FA is enabled</span>
                                    </>
                                ) : (
                                    <>
                                        <ShieldAlert className="w-5 h-5 text-yellow-500" />
                                        <span className="text-sm font-bold text-yellow-400">2FA is not enabled</span>
                                    </>
                                )}
                            </div>

                            <AnimatePresence>
                                <StatusMessage type={twoFAMsg.type} message={twoFAMsg.text} />
                            </AnimatePresence>

                            {/* Enable Flow */}
                            {!user.two_fa_enabled && twoFAStep === 'idle' && (
                                <ActionButton onClick={handleGenerate2FA} loading={twoFALoading}>
                                    Enable 2FA
                                </ActionButton>
                            )}

                            {!user.two_fa_enabled && twoFAStep === 'setup' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-4"
                                >
                                    <p className="text-xs text-gray-400">
                                        Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                                    </p>

                                    {/* QR Code */}
                                    <div className="flex justify-center">
                                        <div className="p-4 bg-white rounded-xl">
                                            <img src={twoFAQR} alt="2FA QR Code" className="w-48 h-48" />
                                        </div>
                                    </div>

                                    {/* Manual Secret */}
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Or enter this key manually</label>
                                        <div className="flex items-center gap-2">
                                            <code className="flex-1 bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-xs text-orange-400 font-mono tracking-wider break-all">
                                                {twoFASecret}
                                            </code>
                                            <button
                                                onClick={copySecret}
                                                className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"
                                            >
                                                {secretCopied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Verify Token */}
                                    <InputField
                                        label="Enter 6-digit code from app"
                                        value={twoFAToken}
                                        onChange={(e) => setTwoFAToken(e.target.value)}
                                        placeholder="000000"
                                    />

                                    <div className="flex items-center gap-3">
                                        <ActionButton onClick={handleEnable2FA} loading={twoFALoading}>
                                            Verify & Enable
                                        </ActionButton>
                                        <button
                                            onClick={() => { setTwoFAStep('idle'); setTwoFAMsg({ type: '', text: '' }); }}
                                            className="text-xs text-gray-500 hover:text-gray-300 transition-colors underline"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Disable Flow */}
                            {user.two_fa_enabled && twoFAStep === 'idle' && (
                                <ActionButton
                                    onClick={() => setTwoFAStep('disable')}
                                    variant="danger"
                                >
                                    Disable 2FA
                                </ActionButton>
                            )}

                            {user.two_fa_enabled && twoFAStep === 'disable' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-4"
                                >
                                    <p className="text-xs text-red-400 font-bold">
                                        Disabling 2FA will make your account less secure. Enter your password and a 2FA code to confirm.
                                    </p>
                                    <InputField
                                        label="Current Password"
                                        type="password"
                                        value={twoFAPassword}
                                        onChange={(e) => setTwoFAPassword(e.target.value)}
                                        placeholder="Enter your password"
                                    />
                                    <InputField
                                        label="2FA Code"
                                        value={twoFAToken}
                                        onChange={(e) => setTwoFAToken(e.target.value)}
                                        placeholder="Enter 6-digit code"
                                    />
                                    <div className="flex items-center gap-3">
                                        <ActionButton onClick={handleDisable2FA} loading={twoFALoading} variant="danger">
                                            Confirm Disable
                                        </ActionButton>
                                        <button
                                            onClick={() => { setTwoFAStep('idle'); setTwoFAMsg({ type: '', text: '' }); setTwoFAToken(''); setTwoFAPassword(''); }}
                                            className="text-xs text-gray-500 hover:text-gray-300 transition-colors underline"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </SectionCard>
                </div>
            </div>
        </div>
    );
}
