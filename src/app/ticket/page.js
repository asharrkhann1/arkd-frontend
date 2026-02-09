'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function TicketMockPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-[70vh] px-6 py-10">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold text-white">Ticket</h1>
          <p className="mt-3 text-slate-300">You must be logged in to access tickets.</p>
          <Link href="/login" className="inline-block mt-4 text-blue-400 hover:text-blue-300">
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-white">Ticket (Mock)</h1>
        <p className="mt-3 text-slate-300">This is a mock ticket page.</p>
      </div>
    </div>
  );
}
