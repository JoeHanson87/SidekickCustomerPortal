'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import type { CartItem } from '@/context/CartContext';

interface OrderData {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  vat: number;
  grandTotal: number;
  contactName: string;
  contactEmail: string;
  company: string;
  phone: string;
  poNumber: string;
  deliveryLine1: string;
  deliveryLine2: string;
  deliveryCity: string;
  deliveryPostcode: string;
  notes: string;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function OrderPage({ params }: PageProps) {
  const { id } = use(params);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem(`order_${id}`);
    if (raw) {
      try {
        setOrder(JSON.parse(raw) as OrderData);
      } catch {
        setNotFound(true);
      }
    } else {
      setNotFound(true);
    }
  }, [id]);

  if (notFound) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-brand-dark mb-3">Order not found</h1>
        <p className="text-gray-500 mb-6">This order may have expired. Please check your email for confirmation.</p>
        <Link href="/dashboard" className="text-brand-accent hover:underline">← Back to products</Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-8 h-8 border-2 border-brand-accent border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  const orderDate = new Date(order.date);
  const invoiceNumber = `INV-${order.id}`;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Success banner */}
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 flex items-start gap-4 mb-8 no-print">
        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shrink-0">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold text-green-900">Order placed successfully!</h1>
          <p className="text-green-700 text-sm mt-1">
            Thank you, {order.contactName.split(' ')[0]}. Your order has been received and the Sidekick team will be in touch shortly.
          </p>
          <p className="text-green-600 text-xs mt-2">
            A confirmation has been sent to <strong>{order.contactEmail}</strong>
          </p>
        </div>
      </div>

      {/* Invoice / Job Ticket */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden" id="invoice">

        {/* Invoice header */}
        <div className="bg-brand-dark p-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <SidekickLogo />
            <div>
              <p className="text-white font-bold text-lg">Sidekick Ltd</p>
              <p className="text-white/50 text-xs">hello@sidekickltd.com · sidekickltd.com</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-brand-accent font-bold text-xl">{invoiceNumber}</p>
            <p className="text-white/60 text-xs mt-1">
              {orderDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Billing / delivery details */}
        <div className="grid sm:grid-cols-2 gap-6 p-6 border-b border-gray-100">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-2">Bill To</p>
            <p className="font-semibold text-gray-900">{order.company}</p>
            <p className="text-sm text-gray-600">{order.contactName}</p>
            <p className="text-sm text-gray-600">{order.contactEmail}</p>
            {order.phone && <p className="text-sm text-gray-600">{order.phone}</p>}
            {order.poNumber && (
              <p className="text-sm text-gray-500 mt-1">PO: {order.poNumber}</p>
            )}
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-2">Deliver To</p>
            <p className="text-sm text-gray-700">{order.deliveryLine1}</p>
            {order.deliveryLine2 && <p className="text-sm text-gray-700">{order.deliveryLine2}</p>}
            <p className="text-sm text-gray-700">{order.deliveryCity}</p>
            <p className="text-sm text-gray-700">{order.deliveryPostcode}</p>
          </div>
        </div>

        {/* Order items table */}
        <div className="p-6">
          <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-3">Order Items</p>
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
        </div>

        {/* Totals */}
        <div className="px-6 pb-6">
          <div className="ml-auto max-w-xs space-y-2 text-sm border-t border-gray-100 pt-4">
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
        </div>

        {/* Job ticket section */}
        <div className="mx-6 mb-6 border border-dashed border-gray-200 rounded-xl p-5 bg-gray-50">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-brand-accent text-white text-xs font-bold px-2 py-0.5 rounded">JOB TICKET</span>
            <span className="text-xs text-gray-400">For Sidekick internal use</span>
          </div>
          <div className="grid sm:grid-cols-3 gap-3 text-sm">
            <div>
              <p className="text-xs text-gray-400">Order ref</p>
              <p className="font-mono font-semibold text-gray-800">{order.id}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Date received</p>
              <p className="font-medium text-gray-700">
                {orderDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Client</p>
              <p className="font-medium text-gray-700">{order.company}</p>
            </div>
          </div>
          {order.notes && (
            <div className="mt-3 pt-3 border-t border-dashed border-gray-200">
              <p className="text-xs text-gray-400">Special instructions</p>
              <p className="text-sm text-gray-700 mt-0.5">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-100 px-6 py-4 text-xs text-gray-400 text-center">
          Sidekick Ltd · Registered in England & Wales · This is a pro-forma invoice
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-wrap gap-3 no-print">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 font-medium rounded-xl px-5 py-2.5 text-sm transition"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print / Save as PDF
        </button>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 bg-brand-accent hover:bg-brand-accent-hover text-white font-semibold rounded-xl px-5 py-2.5 text-sm transition"
        >
          Place another order →
        </Link>
      </div>
    </div>
  );
}

function SidekickLogo() {
  return (
    <svg width="36" height="36" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="#E8A020" />
      <path d="M8 20c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="16" cy="13" r="3" fill="white" />
    </svg>
  );
}
