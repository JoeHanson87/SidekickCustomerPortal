'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isLoggedIn } from '@/lib/auth';
import Nav from '@/components/Nav';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace('/');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1">{children}</main>
      <footer className="bg-brand-dark text-white/40 text-xs text-center py-4 mt-auto">
        © {new Date().getFullYear()} Sidekick Ltd · All rights reserved
      </footer>
    </div>
  );
}
