'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { logout, getUser } from '@/lib/auth';
import { useCart } from '@/context/CartContext';
import { useEffect, useState } from 'react';
import type { User } from '@/lib/auth';

export default function Nav() {
  const router = useRouter();
  const pathname = usePathname();
  const { itemCount } = useCart();
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="bg-brand-dark text-white sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <SidekickLogo />
          <span className="font-bold text-white tracking-wide text-lg">Sidekick</span>
          <span className="text-white/40 text-sm hidden sm:block">Partner Portal</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <NavLink href="/dashboard" active={pathname === '/dashboard'}>Products</NavLink>
          <Link
            href="/basket"
            className="relative flex items-center gap-1.5 hover:text-brand-accent transition"
          >
            <CartIcon />
            <span>Basket</span>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-brand-accent text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {itemCount}
              </span>
            )}
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {user && (
            <span className="hidden sm:block text-white/60 text-xs">
              {user.company}
            </span>
          )}

          {/* Mobile basket */}
          <Link href="/basket" className="relative md:hidden">
            <CartIcon />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-brand-accent text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {itemCount}
              </span>
            )}
          </Link>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition rounded-full px-3 py-1.5 text-sm"
            >
              <span className="w-6 h-6 bg-brand-accent rounded-full flex items-center justify-center text-white text-xs font-bold">
                {user?.name?.[0] ?? '?'}
              </span>
              <span className="hidden sm:block">{user?.name?.split(' ')[0] ?? 'User'}</span>
              <ChevronIcon />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 text-sm text-gray-700 animate-fade-in">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 transition"
                >
                  Products
                </Link>
                <Link
                  href="/basket"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 transition"
                >
                  Basket {itemCount > 0 && `(${itemCount})`}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-50 transition text-red-500"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
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
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="#E8A020" />
      <path d="M8 20c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="16" cy="13" r="3" fill="white" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}
