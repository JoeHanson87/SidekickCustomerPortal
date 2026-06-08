'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import PRODUCTS from '@/lib/products';

export default function BasketPage() {
  const router = useRouter();
  const { items, subtotal, vat, grandTotal, removeItem, updateQuantity } = useCart();

  const handleQuantityChange = (
    itemId: string,
    categoryId: string,
    proofId: string,
    tierIndex: number
  ) => {
    const product = PRODUCTS.find((p) => p.id === categoryId);
    const proof = product?.proofs.find((pr) => pr.id === proofId);
    if (!proof) return;
    const tier = proof.priceTiers[tierIndex];
    if (!tier) return;
    updateQuantity(itemId, tier.quantity, tier.unitPrice, tier.total);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-brand-dark mb-2">Your basket is empty</h1>
        <p className="text-gray-500 mb-8">Browse your products and add items to get started.</p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 bg-brand-accent hover:bg-brand-accent-hover text-white font-semibold rounded-xl px-6 py-3 text-sm transition"
        >
          ← Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark">Your Basket</h1>
          <p className="text-gray-500 text-sm mt-1">{items.length} item{items.length !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/dashboard" className="text-sm text-gray-400 hover:text-brand-accent transition">
          ← Continue shopping
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Item list */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const product = PRODUCTS.find((p) => p.id === item.categoryId);
            const proof = product?.proofs.find((pr) => pr.id === item.proofId);
            const currentTierIndex = proof?.priceTiers.findIndex(
              (t) => t.quantity === item.quantity
            ) ?? 0;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col sm:flex-row gap-4 animate-fade-in"
              >
                {/* Color swatch */}
                <div
                  className="w-16 h-16 rounded-xl shrink-0 flex items-center justify-center text-white text-2xl"
                  style={{
                    background: product
                      ? `linear-gradient(135deg, ${product.colorFrom}, ${product.colorTo})`
                      : '#374151',
                  }}
                >
                  <CategoryEmoji id={item.categoryId} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-brand-dark">{item.proofName}</h3>
                      <p className="text-xs text-gray-400">{item.categoryName}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-300 hover:text-red-400 transition shrink-0"
                      aria-label="Remove item"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  <div className="mt-3 flex flex-wrap items-end gap-4">
                    {/* Quantity dropdown */}
                    {proof && (
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Quantity</label>
                        <select
                          value={currentTierIndex >= 0 ? currentTierIndex : 0}
                          onChange={(e) =>
                            handleQuantityChange(
                              item.id,
                              item.categoryId,
                              item.proofId,
                              Number(e.target.value)
                            )
                          }
                          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent bg-white"
                        >
                          {proof.priceTiers.map((tier, i) => (
                            <option key={i} value={i}>
                              {tier.quantity.toLocaleString()} units
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div>
                      <p className="text-xs text-gray-400 mb-1">Unit price</p>
                      <p className="text-sm text-gray-600">£{item.unitPrice.toFixed(2)}</p>
                    </div>

                    <div className="ml-auto text-right">
                      <p className="text-xs text-gray-400 mb-1">Subtotal</p>
                      <p className="text-lg font-bold text-brand-dark">£{item.total.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24 space-y-4">
            <h2 className="font-bold text-brand-dark text-lg">Order Summary</h2>

            <div className="space-y-2 text-sm">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-gray-600">
                  <span className="truncate mr-2">{item.proofName}</span>
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
              onClick={() => router.push('/checkout')}
              className="w-full bg-brand-accent hover:bg-brand-accent-hover text-white font-bold rounded-xl py-3.5 text-sm transition flex items-center justify-center gap-2"
            >
              Proceed to checkout
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>

            <p className="text-xs text-gray-400 text-center">
              Prices shown exclude VAT unless stated
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoryEmoji({ id }: { id: string }) {
  const map: Record<string, string> = {
    stationery: '📄',
    brochures: '📚',
    clothing: '👕',
    fliers: '📃',
    promotional: '🎁',
  };
  return <span>{map[id] ?? '📦'}</span>;
}
