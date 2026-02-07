'use client';
import { motion } from 'framer-motion';
import { LogIn } from 'lucide-react';
import Link from 'next/link';

export default function GoogleLoginPage() {
  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-black via-[#0a0a0a] to-black font-sans text-slate-200">
      {/* Background Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />

      <div className="relative z-10 w-full max-w-[480px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0a0a0a]/80 backdrop-blur-2xl rounded-[32px] border border-blue-500/20 p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center text-center gap-8"
        >
          {/* Icon Header */}
          <div className="w-20 h-20 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)] mb-2">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-white tracking-tight">Google Login</h1>
            <p className="text-slate-400 text-[15px] max-w-[280px]">
              Securely access your account using your Google profile.
            </p>
          </div>

          <div className="w-full flex flex-col gap-4">
            <button
              onClick={handleGoogleLogin}
              className="group w-full flex items-center justify-center gap-3 p-4 bg-white text-black font-bold rounded-2xl hover:bg-slate-100 transition-all duration-300 transform hover:-translate-y-1 shadow-[0_10px_20px_rgba(255,255,255,0.1)]"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>

            <Link
              href="/login"
              className="text-slate-500 hover:text-slate-300 transition-colors text-sm font-medium"
            >
              Go back to login
            </Link>
          </div>

          {/* Footer text */}
          <p className="text-[11px] text-slate-600 uppercase tracking-widest font-black">
            Secure Authentication
          </p>
        </motion.div>
      </div>
    </div>
  );
}
