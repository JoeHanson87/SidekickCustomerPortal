'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SidekickLogo from '@/components/SidekickLogo';
import { loginAsAdmin } from '@/lib/admin';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const ok = loginAsAdmin(email, password);
    if (ok) {
      router.push('/admin/dashboard');
    } else {
      setError('Invalid admin credentials. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-brand-dark px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <SidekickLogo />
          <span className="text-white text-sm font-medium tracking-wide opacity-70">
            Admin Portal
          </span>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-brand-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-7 h-7 text-brand-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-brand-dark">Admin sign in</h1>
              <p className="text-gray-500 mt-1 text-sm">Sidekick administration portal</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@sidekickltd.com"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2.5">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-accent hover:bg-brand-accent-hover text-white font-semibold rounded-lg py-2.5 text-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            <a href="/" className="text-brand-accent hover:underline">
              ← Back to client portal
            </a>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-brand-dark text-white/40 text-xs text-center py-4">
        © {new Date().getFullYear()} Sidekick Ltd · All rights reserved
      </footer>
    </div>
  );
}

