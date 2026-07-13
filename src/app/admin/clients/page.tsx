'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getClients, addClient, deleteClient } from '@/lib/admin';
import PRODUCTS from '@/lib/products';
import type { ClientRecord } from '@/lib/admin';

const ALL_PRODUCT_IDS = PRODUCTS.map((p) => p.id);

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    company: '',
    enabledProducts: [...ALL_PRODUCT_IDS],
  });
  const [formError, setFormError] = useState('');

  const refresh = () => setClients(getClients());

  useEffect(() => {
    refresh();
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    const existing = getClients();
    if (existing.some((c) => c.email.toLowerCase() === form.email.toLowerCase())) {
      setFormError('A client with this email already exists.');
      return;
    }
    addClient({ ...form, customPricing: {} });
    refresh();
    setShowAdd(false);
    setForm({ name: '', email: '', password: '', company: '', enabledProducts: [...ALL_PRODUCT_IDS] });
  };

  const handleDelete = (id: string) => {
    deleteClient(id);
    refresh();
    setDeleteConfirmId(null);
  };

  const toggleProduct = (productId: string) => {
    setForm((prev) => ({
      ...prev,
      enabledProducts: prev.enabledProducts.includes(productId)
        ? prev.enabledProducts.filter((id) => id !== productId)
        : [...prev.enabledProducts, productId],
    }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-brand-dark">Clients</h1>
          <p className="text-gray-500 mt-1">
            {clients.length} registered client{clients.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-brand-accent hover:bg-brand-accent-hover text-white font-semibold rounded-xl px-5 py-2.5 text-sm transition"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add client
        </button>
      </div>

      {/* Client table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {clients.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-sm">
            No clients yet. Click &ldquo;Add client&rdquo; to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-left text-xs text-gray-500 uppercase tracking-wide">
                  <th className="px-6 py-3">Company</th>
                  <th className="px-6 py-3">Contact</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3 text-center">Products</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {clients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-brand-dark">{client.company}</td>
                    <td className="px-6 py-4 text-gray-600">{client.name}</td>
                    <td className="px-6 py-4 text-gray-500">{client.email}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-block bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full px-2.5 py-0.5">
                        {client.enabledProducts.length} / {PRODUCTS.length}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/admin/clients/${client.id}`}
                          className="text-brand-accent hover:underline font-medium text-xs"
                        >
                          Edit
                        </Link>
                        {deleteConfirmId === client.id ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">Confirm?</span>
                            <button
                              onClick={() => handleDelete(client.id)}
                              className="text-xs text-red-500 hover:underline font-medium"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="text-xs text-gray-400 hover:underline"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(client.id)}
                            className="text-xs text-gray-400 hover:text-red-400 transition"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add client modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-brand-dark">Add Client</h2>
              <button
                onClick={() => setShowAdd(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Company name <span className="text-red-400">*</span>
                  </label>
                  <input
                    required
                    value={form.company}
                    onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent"
                    placeholder="Acme Corp"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Contact name <span className="text-red-400">*</span>
                  </label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent"
                    placeholder="Jane Smith"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent"
                  placeholder="jane@company.com"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Password <span className="text-red-400">*</span>
                </label>
                <input
                  required
                  type="text"
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent font-mono"
                  placeholder="set-a-password"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Enabled products
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PRODUCTS.map((p) => (
                    <label
                      key={p.id}
                      className="flex items-center gap-2 text-sm cursor-pointer py-1"
                    >
                      <input
                        type="checkbox"
                        checked={form.enabledProducts.includes(p.id)}
                        onChange={() => toggleProduct(p.id)}
                        className="accent-brand-accent w-4 h-4"
                      />
                      {p.name}
                    </label>
                  ))}
                </div>
              </div>

              {formError && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2.5">
                  {formError}
                </p>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-brand-accent hover:bg-brand-accent-hover text-white font-semibold rounded-lg px-5 py-2 text-sm transition"
                >
                  Add client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
