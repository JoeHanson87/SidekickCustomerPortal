'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getClients } from '@/lib/admin';
import PRODUCTS from '@/lib/products';

export default function AdminDashboard() {
  const [clientCount, setClientCount] = useState(0);

  useEffect(() => {
    setClientCount(getClients().length);
  }, []);

  const totalProofs = PRODUCTS.reduce((sum, p) => sum + p.proofs.length, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-brand-dark">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Manage clients, products, and pricing.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <StatCard
          label="Clients"
          value={clientCount}
          description="Active client accounts"
          colorClass="bg-indigo-500"
          icon={<UsersIcon />}
          href="/admin/clients"
        />
        <StatCard
          label="Product Categories"
          value={PRODUCTS.length}
          description="Available product types"
          colorClass="bg-amber-500"
          icon={<ProductsIcon />}
          href="/admin/products"
        />
        <StatCard
          label="Total Proofs"
          value={totalProofs}
          description="Across all categories"
          colorClass="bg-emerald-500"
          icon={<ProofsIcon />}
          href="/admin/products"
        />
      </div>

      {/* Quick links */}
      <div className="grid sm:grid-cols-2 gap-6">
        <QuickLinkCard
          href="/admin/clients"
          title="Manage Clients"
          description="Add new clients, edit their details, assign product access, and configure custom pricing."
          icon={<UsersIcon />}
        />
        <QuickLinkCard
          href="/admin/products"
          title="View Product Catalogue"
          description="Browse all product categories and proof specifications available in the system."
          icon={<ProductsIcon />}
        />
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  description,
  colorClass,
  icon,
  href,
}: {
  label: string;
  value: number;
  description: string;
  colorClass: string;
  icon: React.ReactNode;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow flex items-start gap-4"
    >
      <div className={`${colorClass} rounded-xl p-3 text-white shrink-0`}>{icon}</div>
      <div>
        <p className="text-3xl font-bold text-brand-dark">{value}</p>
        <p className="text-sm font-medium text-gray-700">{label}</p>
        <p className="text-xs text-gray-400 mt-0.5">{description}</p>
      </div>
    </Link>
  );
}

function QuickLinkCard({
  href,
  title,
  description,
  icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md hover:-translate-y-0.5 transition-all flex gap-4"
    >
      <div className="text-brand-accent mt-0.5">{icon}</div>
      <div>
        <h3 className="font-bold text-brand-dark">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
    </Link>
  );
}

function UsersIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

function ProductsIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"
      />
    </svg>
  );
}

function ProofsIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
}
