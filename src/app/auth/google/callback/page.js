'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function GoogleCallbackPage() {
  const router = useRouter();
  const { refreshMe } = useAuth();

  useEffect(() => {
    const completeLogin = async () => {
      try {
        await refreshMe();
        // Brief delay to show off the nice loading state
        setTimeout(() => {
          router.replace('/profile');
        }, 1000);
      } catch (error) {
        console.error('Google callback error:', error);
        router.replace('/login?error=google');
      }
    };
    completeLogin();
  }, [refreshMe, router]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-black via-[#0a0a0a] to-black font-sans text-slate-200">
      {/* Background Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] animate-pulse" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 flex flex-col items-center gap-6 p-12 bg-[#0a0a0a]/70 backdrop-blur-xl rounded-[32px] border border-blue-500/20 shadow-2xl"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse" />
          <Loader2 className="w-16 h-16 text-blue-500 animate-spin relative z-10" />
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white tracking-tight">Authenticating</h2>
          <p className="text-slate-400 text-sm">Completing your secure login with Google...</p>
        </div>

        {/* Decorative elements */}
        <div className="flex gap-2">
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}
            className="w-1.5 h-1.5 rounded-full bg-blue-500"
          />
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
            className="w-1.5 h-1.5 rounded-full bg-blue-500"
          />
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}
            className="w-1.5 h-1.5 rounded-full bg-blue-500"
          />
        </div>
      </motion.div>
    </div>
  );
}
