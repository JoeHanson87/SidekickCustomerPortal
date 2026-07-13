'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [demoAccounts, setDemoAccounts] = useState<{ email: string; password: string; company: string }[]>([]);

  useEffect(() => {
    async function loadDemos() {
      try {
        const res = await fetch('/api/clients');
        if (!res.ok) return;
        const json = await res.json() as { clients: { email: string; password: string; company: string }[] };
        setDemoAccounts(
          (json.clients ?? []).map(({ email, password, company }) => ({ email, password, company }))
        );
      } catch {
        // ignore — demo list is cosmetic
      }
    }
    loadDemos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const user = await login(email, password);
    if (user) {
      router.push('/dashboard');
    } else {
      setError('Invalid email or password. Please try again.');
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setShowDemo(false);
    setError('');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-brand-dark px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <SidekickLogo />
          <span className="text-white text-sm font-medium tracking-wide opacity-70">
            Partner Portal
          </span>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-brand-dark">Welcome back</h1>
              <p className="text-gray-500 mt-1 text-sm">
                Sign in to access your branded products
              </p>
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
                  placeholder="you@company.com"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
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

            <div className="mt-6 pt-5 border-t border-gray-100">
              <button
                onClick={() => setShowDemo(!showDemo)}
                className="w-full text-xs text-gray-400 hover:text-gray-600 transition text-center"
              >
                {showDemo ? 'Hide demo accounts ▲' : 'View demo accounts ▼'}
              </button>

              {showDemo && (
                <div className="mt-3 space-y-2 animate-fade-in">
                  {demoAccounts.map((d) => (
                    <button
                      key={d.email}
                      onClick={() => fillDemo(d.email, d.password)}
                      className="w-full text-left px-4 py-3 rounded-lg border border-gray-100 hover:border-brand-accent hover:bg-amber-50 transition text-sm group"
                    >
                      <span className="font-medium text-gray-800 group-hover:text-brand-dark">
                        {d.company}
                      </span>
                      <span className="block text-xs text-gray-400 mt-0.5">{d.email}</span>
                    </button>
                  ))}
                  <p className="text-xs text-gray-400 text-center pt-1">
                    All demo accounts use password: <code className="font-mono">demo123</code>
                  </p>
                </div>
              )}
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            Need access?{' '}
            <a href="mailto:hello@sidekickltd.com" className="text-brand-accent hover:underline">
              Contact Sidekick
            </a>
          </p>
          <p className="text-center text-xs text-gray-400 mt-2">
            <a href="/admin" className="hover:text-gray-500 transition">
              Admin login →
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

function SidekickLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
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
