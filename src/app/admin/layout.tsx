'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAdmin } from '@/lib/admin';
import AdminNav from '@/components/AdminNav';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin';

  useEffect(() => {
    if (!isLoginPage && !isAdmin()) {
      router.replace('/admin');
    }
  }, [router, isLoginPage]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AdminNav />
      <main className="flex-1">{children}</main>
      <footer className="bg-brand-dark text-white/40 text-xs text-center py-4 mt-auto">
        © {new Date().getFullYear()} Sidekick Ltd · Admin Portal
      </footer>
    </div>
  );
}
