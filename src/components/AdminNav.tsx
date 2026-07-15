'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { logoutAdmin } from '@/lib/admin';

export default function AdminNav() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logoutAdmin();
    router.push('/admin');
  };

  return (
    <header className="bg-brand-dark text-white sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-24">
        <div className="flex items-center gap-3">
          <SidekickLogo />
          <span className="text-white/40 text-sm hidden sm:block">Admin Portal</span>
        </div>

        <nav className="flex items-center gap-6 text-sm">
          <NavLink href="/admin/dashboard" active={pathname === '/admin/dashboard'}>
            Dashboard
          </NavLink>
          <NavLink href="/admin/clients" active={pathname.startsWith('/admin/clients')}>
            Clients
          </NavLink>
          <NavLink href="/admin/products" active={pathname === '/admin/products'}>
            Products
          </NavLink>
        </nav>

        <button
          onClick={handleLogout}
          className="text-sm text-white/70 hover:text-white transition"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`transition font-medium ${active ? 'text-brand-accent' : 'text-white/80 hover:text-white'}`}
    >
      {children}
    </Link>
  );
}

function SidekickLogo() {
  return (
    <svg width="144" height="144" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="#E8A020" />
      <path
        d="M8 20c0-4.418 3.582-8 8-8s8 3.582 8 8"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="16" cy="13" r="3" fill="white" />
    </svg>
  );
}
