'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getProductsForClient } from '@/lib/admin';
import { getUser } from '@/lib/auth';
import { useCart } from '@/context/CartContext';
import type { Proof, ProductCategory } from '@/lib/products';
import type { User } from '@/lib/auth';
import ProofImage from '@/components/ProofImage';
import ChangesModal from '@/components/ChangesModal';

interface PageProps {
  params: Promise<{ category: string }>;
}

export default function ProductPage({ params }: PageProps) {
  const { category } = use(params);
  const router = useRouter();
  const { addItem } = useCart();

  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<ProductCategory[]>([]);
  const [activeProof, setActiveProof] = useState<Proof | null>(null);
  const [selectedTierIndex, setSelectedTierIndex] = useState(0);
  const [showChangesModal, setShowChangesModal] = useState(false);
  const [addedToBasket, setAddedToBasket] = useState(false);

  useEffect(() => {
    const u = getUser();
    setUser(u);
    if (u) setProducts(getProductsForClient(u.email));
  }, []);

  const product = products.find((p) => p.id === category);

  useEffect(() => {
    if (product && product.proofs.length > 0) {
      setActiveProof(product.proofs[0]);
      setSelectedTierIndex(0);
    }
  }, [product]);

  const handleProofChange = (proof: Proof) => {
    setActiveProof(proof);
    setSelectedTierIndex(0);
    setAddedToBasket(false);
  };

  const handleAddToBasket = () => {
    if (!activeProof || !product) return;
    const tier = activeProof.priceTiers[selectedTierIndex];
    addItem({
      id: `${product.id}-${activeProof.id}`,
      categoryId: product.id,
      categoryName: product.name,
      proofId: activeProof.id,
      proofName: activeProof.name,
      quantity: tier.quantity,
      unitPrice: tier.unitPrice,
      total: tier.total,
    });
    setAddedToBasket(true);
    setTimeout(() => setAddedToBasket(false), 3000);
  };

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-brand-dark mb-3">Product not found</h1>
        <Link href="/dashboard" className="text-brand-accent hover:underline">
          ← Back to dashboard
        </Link>
      </div>
    );
  }

  const selectedTier = activeProof?.priceTiers[selectedTierIndex];

  return (
    <>
      {showChangesModal && activeProof && user && (
        <ChangesModal
          productName={activeProof.name}
          categoryName={product.name}
          proofId={activeProof.id}
          userName={user.name}
          userEmail={user.email}
          onClose={() => setShowChangesModal(false)}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/dashboard" className="hover:text-brand-accent transition">Products</Link>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-600 font-medium">{product.name}</span>
        </nav>

        {/* Page header */}
        <div className="flex items-center gap-4 mb-8">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-2xl shrink-0"
            style={{ background: `linear-gradient(135deg, ${product.colorFrom}, ${product.colorTo})` }}
          >
            <CategoryEmoji id={product.id} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-brand-dark">{product.name}</h1>
            <p className="text-gray-500 text-sm">{product.description}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left: Proof selector + image */}
          <div className="lg:col-span-3 space-y-5">
            {/* Proof tabs */}
            <div className="flex flex-wrap gap-2">
              {product.proofs.map((proof) => (
                <button
                  key={proof.id}
                  onClick={() => handleProofChange(proof)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition border ${
                    activeProof?.id === proof.id
                      ? 'border-brand-accent bg-amber-50 text-brand-dark'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50 bg-white'
                  }`}
                >
                  {proof.name}
                </button>
              ))}
            </div>

            {/* Proof image */}
            {activeProof && (
              <div className="animate-fade-in">
                <ProofImage
                  productName={activeProof.name}
                  company={user?.company ?? 'Your Company'}
                  categoryId={product.id}
                />
                <p className="text-xs text-gray-400 text-center mt-2">
                  Proof reference: PROOF-{activeProof.id.toUpperCase()} · Click to zoom (coming soon)
                </p>
              </div>
            )}

            {/* Specifications */}
            {activeProof && (
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Specifications</h3>
                <div className="grid grid-cols-2 gap-2">
                  {activeProof.specifications.map((spec, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-accent shrink-0" />
                      {spec}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Order panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24 space-y-6">
              {activeProof ? (
                <>
                  <div>
                    <h2 className="text-xl font-bold text-brand-dark">{activeProof.name}</h2>
                    <p className="text-sm text-gray-500 mt-1">{activeProof.description}</p>
                  </div>

                  {/* Quantity & price selector */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Select quantity
                    </label>
                    <select
                      value={selectedTierIndex}
                      onChange={(e) => {
                        setSelectedTierIndex(Number(e.target.value));
                        setAddedToBasket(false);
                      }}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition bg-white"
                    >
                      {activeProof.priceTiers.map((tier, i) => (
                        <option key={i} value={i}>
                          {tier.quantity.toLocaleString()} units — £{tier.total.toFixed(2)}
                          {' '}(£{tier.unitPrice.toFixed(2)} each)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price breakdown */}
                  {selectedTier && (
                    <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                      <div className="flex justify-between text-gray-600">
                        <span>{selectedTier.quantity.toLocaleString()} × £{selectedTier.unitPrice.toFixed(2)}</span>
                        <span>£{selectedTier.total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>VAT (20%)</span>
                        <span>£{(selectedTier.total * 0.2).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-brand-dark border-t border-gray-200 pt-2">
                        <span>Total inc. VAT</span>
                        <span>£{(selectedTier.total * 1.2).toFixed(2)}</span>
                      </div>
                    </div>
                  )}

                  {/* Add to basket */}
                  <button
                    onClick={handleAddToBasket}
                    className={`w-full font-semibold rounded-xl py-3 text-sm transition flex items-center justify-center gap-2 ${
                      addedToBasket
                        ? 'bg-green-500 text-white'
                        : 'bg-brand-accent hover:bg-brand-accent-hover text-white'
                    }`}
                  >
                    {addedToBasket ? (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Added to basket!
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                        </svg>
                        Add to basket
                      </>
                    )}
                  </button>

                  {/* Need changes button */}
                  <button
                    onClick={() => setShowChangesModal(true)}
                    className="w-full border-2 border-dashed border-gray-200 hover:border-brand-accent text-gray-500 hover:text-brand-dark font-medium rounded-xl py-3 text-sm transition flex items-center justify-center gap-2 group"
                  >
                    <svg className="w-4 h-4 group-hover:text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Need to make changes?
                  </button>

                  {addedToBasket && (
                    <div className="flex items-center justify-between text-sm animate-fade-in">
                      <span className="text-gray-500">Item added to your basket</span>
                      <button
                        onClick={() => router.push('/basket')}
                        className="text-brand-accent hover:underline font-medium"
                      >
                        View basket →
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-gray-400 text-sm">Select a product above to see pricing.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
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
