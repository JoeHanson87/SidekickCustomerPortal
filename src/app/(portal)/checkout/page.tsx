'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { getUser } from '@/lib/auth';
import type { User } from '@/lib/auth';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, vat, grandTotal, clearCart } = useCart();
  const [user, setUser] = useState<User | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    contactName: '',
    contactEmail: '',
    company: '',
    phone: '',
    poNumber: '',
    deliveryLine1: '',
    deliveryLine2: '',
    deliveryCity: '',
    deliveryPostcode: '',
    notes: '',
  });

  useEffect(() => {
    const u = getUser();
    setUser(u);
    if (u) {
      setForm((prev) => ({
        ...prev,
        contactName: u.name,
        contactEmail: u.email,
        company: u.company,
      }));
    }
  }, []);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));

    const orderId = `SK-${Date.now().toString(36).toUpperCase()}`;
    const orderData = {
      id: orderId,
      date: new Date().toISOString(),
      items,
      subtotal,
      vat,
      grandTotal,
      ...form,
    };
    sessionStorage.setItem(`order_${orderId}`, JSON.stringify(orderData));
    clearCart();
    router.push(`/order/${orderId}`);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-brand-dark mb-3">Nothing to checkout</h1>
        <p className="text-gray-500 mb-6">Your basket is empty.</p>
        <Link href="/dashboard" className="text-brand-accent hover:underline">
          ← Back to products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <Link href="/basket" className="hover:text-brand-accent transition">Basket</Link>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-600 font-medium">Checkout</span>
        </nav>
        <h1 className="text-2xl font-bold text-brand-dark">Checkout</h1>
        <p className="text-gray-500 text-sm">
          Logged in as {user?.company ?? '—'}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact details */}
            <FormSection title="Contact Details">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field
                  label="Full name"
                  required
                  value={form.contactName}
                  onChange={(v) => handleChange('contactName', v)}
                  placeholder="Jane Smith"
                />
                <Field
                  label="Email address"
                  type="email"
                  required
                  value={form.contactEmail}
                  onChange={(v) => handleChange('contactEmail', v)}
                  placeholder="jane@company.com"
                />
                <Field
                  label="Company"
                  required
                  value={form.company}
                  onChange={(v) => handleChange('company', v)}
                  placeholder="Your Company Ltd"
                />
                <Field
                  label="Phone"
                  type="tel"
                  value={form.phone}
                  onChange={(v) => handleChange('phone', v)}
                  placeholder="+44 7700 900000"
                />
              </div>
            </FormSection>

            {/* Delivery address */}
            <FormSection title="Delivery Address">
              <div className="space-y-3">
                <Field
                  label="Address line 1"
                  required
                  value={form.deliveryLine1}
                  onChange={(v) => handleChange('deliveryLine1', v)}
                  placeholder="123 High Street"
                />
                <Field
                  label="Address line 2"
                  value={form.deliveryLine2}
                  onChange={(v) => handleChange('deliveryLine2', v)}
                  placeholder="Apartment, suite, etc. (optional)"
                />
                <div className="grid sm:grid-cols-2 gap-3">
                  <Field
                    label="Town / City"
                    required
                    value={form.deliveryCity}
                    onChange={(v) => handleChange('deliveryCity', v)}
                    placeholder="London"
                  />
                  <Field
                    label="Postcode"
                    required
                    value={form.deliveryPostcode}
                    onChange={(v) => handleChange('deliveryPostcode', v)}
                    placeholder="EC1A 1BB"
                  />
                </div>
              </div>
            </FormSection>

            {/* Additional */}
            <FormSection title="Additional Information">
              <div className="space-y-3">
                <Field
                  label="Purchase Order number (optional)"
                  value={form.poNumber}
                  onChange={(v) => handleChange('poNumber', v)}
                  placeholder="PO-12345"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Special instructions (optional)
                  </label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    placeholder="Any special delivery instructions or notes for the Sidekick team…"
                    rows={3}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition resize-none"
                  />
                </div>
              </div>
            </FormSection>
          </div>

          {/* Order summary sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24 space-y-4">
              <h2 className="font-bold text-brand-dark text-lg">Order Summary</h2>

              <div className="space-y-2 text-sm">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-gray-600">
                    <div className="mr-2 min-w-0">
                      <p className="font-medium text-gray-800 truncate">{item.proofName}</p>
                      <p className="text-gray-400 text-xs">{item.quantity.toLocaleString()} units</p>
                    </div>
                    <span className="shrink-0">£{item.total.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>£{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>VAT (20%)</span>
                  <span>£{vat.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-brand-dark text-base border-t border-gray-100 pt-2">
                  <span>Total</span>
                  <span>£{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-brand-accent hover:bg-brand-accent-hover text-white font-bold rounded-xl py-3.5 text-sm transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Placing order…
                  </>
                ) : (
                  <>
                    Place order
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </>
                )}
              </button>

              <p className="text-xs text-gray-400 text-center leading-relaxed">
                By placing your order you agree to our terms. An invoice will be generated and the Sidekick team will be notified.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <h2 className="font-semibold text-brand-dark text-base mb-4 pb-3 border-b border-gray-100">
        {title}
      </h2>
      {children}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition"
      />
    </div>
  );
}
