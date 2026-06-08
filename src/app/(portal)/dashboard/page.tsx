'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getUser } from '@/lib/auth';
import PRODUCTS from '@/lib/products';
import type { User } from '@/lib/auth';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Welcome header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-brand-dark">
          Welcome back{user ? `, ${user.name.split(' ')[0]}` : ''}!
        </h1>
        <p className="text-gray-500 mt-1">
          {user?.company} · Select a product category to view your proofs and place an order.
        </p>
      </div>

      {/* Product tile grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {PRODUCTS.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
          >
            {/* Gradient header */}
            <div
              className="h-44 flex items-center justify-center relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${product.colorFrom}, ${product.colorTo})`,
              }}
            >
              {/* Decorative circles */}
              <div
                className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-20"
                style={{ background: product.colorTo }}
              />
              <div
                className="absolute -bottom-12 -left-6 w-32 h-32 rounded-full opacity-15"
                style={{ background: product.colorFrom }}
              />

              {/* Product icon */}
              <div className="relative z-10 w-20 h-20 bg-white/15 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <ProductIcon id={product.id} />
              </div>
            </div>

            {/* Card body */}
            <div className="p-5">
              <h2 className="font-bold text-brand-dark text-lg group-hover:text-[var(--brand-accent-hover)] transition-colors">
                {product.name}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5 mb-3">{product.tagline}</p>
              <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  {product.proofs.length} proof{product.proofs.length !== 1 ? 's' : ''} available
                </span>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-brand-accent group-hover:gap-2 transition-all">
                  View proofs
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Help banner */}
      <div className="mt-12 bg-brand-dark rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-white font-bold text-lg">Need something different?</h3>
          <p className="text-white/60 text-sm mt-1">
            Can&apos;t see what you&apos;re looking for? Get in touch with the Sidekick team.
          </p>
        </div>
        <a
          href="mailto:hello@sidekickltd.com"
          className="shrink-0 bg-brand-accent hover:bg-brand-accent-hover text-white font-semibold rounded-xl px-6 py-3 text-sm transition"
        >
          Contact Us
        </a>
      </div>
    </div>
  );
}

function ProductIcon({ id }: { id: string }) {
  const icons: Record<string, React.ReactNode> = {
    stationery: (
      <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8H7M17 12H7M11 16H7" />
        <rect x="14" y="2" width="4" height="6" rx="1" fill="currentColor" opacity="0.4" />
      </svg>
    ),
    brochures: (
      <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    clothing: (
      <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 3l4 4-3 3v10H7V10L4 7l4-4 4 2 4-2z" />
      </svg>
    ),
    fliers: (
      <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 5H9a2 2 0 00-2 2v10a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9h6M9 13h4" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 2v3M9 2v3" />
      </svg>
    ),
    promotional: (
      <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13c0-2.21-1.79-4-4-4S4 5.79 4 8h8zm0 0c0-2.21 1.79-4 4-4s4 1.79 4 4h-8z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h18v2H3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 10v9a2 2 0 002 2h10a2 2 0 002-2v-9" />
      </svg>
    ),
  };
  return <>{icons[id] ?? icons.stationery}</>;
}
