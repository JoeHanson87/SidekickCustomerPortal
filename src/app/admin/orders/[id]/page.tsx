'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getOrderById, updateOrderStatus } from '@/lib/admin';
import type { OrderRecord } from '@/lib/admin';

interface PageProps {
  params: Promise<{ id: string }>;
}

const STATUSES = ['pending', 'processing', 'shipped', 'completed', 'cancelled'];

export default function OrderDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getOrderById(id);
      if (data) {
        setOrder(data);
        setStatus(data.status);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  const handleStatusChange = async () => {
    if (!order || status === order.status) return;
    setSaving(true);
    await updateOrderStatus(order.id, status);
    setOrder((prev) => (prev ? { ...prev, status } : prev));
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-8 h-8 border-2 border-brand-accent border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-brand-dark mb-3">Order not found</h1>
        <p className="text-gray-500 mb-6">The order you are looking for does not exist.</p>
        <Link href="/admin/orders" className="text-brand-accent hover:underline">
          ← Back to orders
        </Link>
      </div>
    );
  }

  const orderDate = new Date(order.createdAt);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <Link href="/admin/orders" className="text-sm text-brand-accent hover:underline">
          ← Back to orders
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
          <div>
            <h1 className="text-3xl font-bold text-brand-dark">{order.id}</h1>
            <p className="text-gray-500 text-sm mt-1">
              Placed on {orderDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
            <button
              onClick={handleStatusChange}
              disabled={saving || status === order.status}
              className="bg-brand-accent hover:bg-brand-accent-hover text-white font-semibold rounded-lg px-4 py-2 text-sm transition disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Update status'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Section title="Order Items">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  <th className="pb-2 text-gray-500 font-medium">Product</th>
                  <th className="pb-2 text-gray-500 font-medium text-center">Qty</th>
                  <th className="pb-2 text-gray-500 font-medium text-right">Unit</th>
                  <th className="pb-2 text-gray-500 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-3">
                      <p className="font-medium text-gray-900">{item.proofName}</p>
                      <p className="text-xs text-gray-400">{item.categoryName}</p>
                    </td>
                    <td className="py-3 text-center text-gray-700">{item.quantity.toLocaleString()}</td>
                    <td className="py-3 text-right text-gray-700">£{item.unitPrice.toFixed(2)}</td>
                    <td className="py-3 text-right font-medium text-gray-900">£{item.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-sm max-w-xs ml-auto">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>£{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>VAT (20%)</span>
                <span>£{order.vat.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-brand-dark text-base border-t border-gray-200 pt-2">
                <span>Total</span>
                <span>£{order.grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </Section>

          {order.notes && (
            <Section title="Special Instructions">
              <p className="text-sm text-gray-700">{order.notes}</p>
            </Section>
          )}
        </div>

        <div className="space-y-6">
          <Section title="Customer">
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Company</p>
                <p className="font-medium text-gray-900">{order.company}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Contact</p>
                <p className="text-gray-700">{order.contactName}</p>
                <p className="text-gray-500">{order.contactEmail}</p>
                {order.phone && <p className="text-gray-500">{order.phone}</p>}
              </div>
              {order.poNumber && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">PO Number</p>
                  <p className="text-gray-700">{order.poNumber}</p>
                </div>
              )}
            </div>
          </Section>

          <Section title="Delivery Address">
            <div className="space-y-1 text-sm text-gray-700">
              <p>{order.deliveryLine1}</p>
              {order.deliveryLine2 && <p>{order.deliveryLine2}</p>}
              <p>{order.deliveryCity}</p>
              <p>{order.deliveryPostcode}</p>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="font-semibold text-brand-dark text-base mb-4 pb-3 border-b border-gray-100">
        {title}
      </h2>
      {children}
    </div>
  );
}
