'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getClientById, updateClient, getClients, getClientProofs, updateClientProofs, getClientProofImages, updateClientProofImages } from '@/lib/admin';
import PRODUCTS from '@/lib/products';
import type { ClientRecord, PriceTier } from '@/lib/admin';
import type { ProofImageRecord } from '@/app/api/proof-images/route';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ClientEditPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();

  const [client, setClient] = useState<ClientRecord | null>(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', company: '' });
  const [enabledProducts, setEnabledProducts] = useState<string[]>([]);
  const [customPricing, setCustomPricing] = useState<Record<string, PriceTier[]>>({});
  const [clientProofIds, setClientProofIds] = useState<string[]>([]);
  const [clientProofImageIds, setClientProofImageIds] = useState<string[]>([]);
  const [allProofImages, setAllProofImages] = useState<ProofImageRecord[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    async function load() {
      const c = await getClientById(id);
      if (!c) {
        router.replace('/admin/clients');
        return;
      }
      setClient(c);
      setForm({ name: c.name, email: c.email, password: c.password, company: c.company });
      setEnabledProducts([...c.enabledProducts]);
      setCustomPricing(JSON.parse(JSON.stringify(c.customPricing)));
      const proofIds = await getClientProofs(c.id);
      setClientProofIds(proofIds);
      const proofImageIds = await getClientProofImages(c.id);
      setClientProofImageIds(proofImageIds);
      
      // Load all available proof images
      try {
        const res = await fetch('/api/proof-images');
        if (res.ok) {
          const json = await res.json() as { images: ProofImageRecord[] };
          setAllProofImages(json.images ?? []);
        }
      } catch {
        // ignore
      }
    }
    load();
  }, [id, router]);

  const handleSave = async () => {
    if (!client) return;
    setEmailError('');
    const others = (await getClients()).filter((c) => c.id !== id);
    if (others.some((c) => c.email.toLowerCase() === form.email.toLowerCase())) {
      setEmailError('Another client already uses this email.');
      return;
    }
    await updateClient(id, { ...form, enabledProducts, customPricing });
    await updateClientProofs(id, clientProofIds);
    await updateClientProofImages(id, clientProofImageIds);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const toggleProduct = (productId: string) => {
    setEnabledProducts((prev) =>
      prev.includes(productId) ? prev.filter((pid) => pid !== productId) : [...prev, productId]
    );
  };

  const toggleProof = (proofId: string) => {
    setClientProofIds((prev) =>
      prev.includes(proofId) ? prev.filter((pid) => pid !== proofId) : [...prev, proofId]
    );
  };

  const toggleProofImage = (proofImageId: string) => {
    setClientProofImageIds((prev) =>
      prev.includes(proofImageId) ? prev.filter((id) => id !== proofImageId) : [...prev, proofImageId]
    );
  };

  const getEffectiveTiers = (proofId: string): PriceTier[] => {
    if (customPricing[proofId]) return customPricing[proofId];
    const proof = PRODUCTS.flatMap((p) => p.proofs).find((pr) => pr.id === proofId);
    return proof?.priceTiers.map((t) => ({ ...t })) ?? [];
  };

  const updateTier = (
    proofId: string,
    tierIndex: number,
    field: 'quantity' | 'unitPrice',
    value: number
  ) => {
    setCustomPricing((prev) => {
      const currentTiers = getEffectiveTiers(proofId);
      const updated = currentTiers.map((t, i) => {
        if (i !== tierIndex) return t;
        const newQuantity = field === 'quantity' ? value : t.quantity;
        const newUnitPrice = field === 'unitPrice' ? value : t.unitPrice;
        return {
          quantity: newQuantity,
          unitPrice: newUnitPrice,
          total: Math.round(newQuantity * newUnitPrice * 100) / 100,
        };
      });
      return { ...prev, [proofId]: updated };
    });
  };

  const resetPricing = (proofId: string) => {
    setCustomPricing((prev) => {
      const next = { ...prev };
      delete next[proofId];
      return next;
    });
  };

  if (!client) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/admin/clients" className="hover:text-brand-accent transition">
          Clients
        </Link>
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-gray-600 font-medium">{client.company}</span>
      </nav>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-brand-dark">Edit Client</h1>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 font-semibold rounded-xl px-6 py-2.5 text-sm transition ${
            saved
              ? 'bg-green-500 text-white'
              : 'bg-brand-accent hover:bg-brand-accent-hover text-white'
          }`}
        >
          {saved ? (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Saved!
            </>
          ) : (
            'Save changes'
          )}
        </button>
      </div>

      <div className="space-y-6">
        {/* Basic details */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-brand-dark mb-5">Client details</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Company name</label>
              <input
                value={form.company}
                onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Contact name</label>
              <input
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent"
              />
              {emailError && <p className="text-xs text-red-500 mt-1">{emailError}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
              <input
                type="text"
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent font-mono"
              />
            </div>
          </div>
        </section>

        {/* Product access */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-brand-dark mb-1">Product access</h2>
          <p className="text-sm text-gray-500 mb-5">
            Choose which product categories this client can see and order from.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {PRODUCTS.map((p) => (
              <label
                key={p.id}
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-brand-accent/40 cursor-pointer transition group"
              >
                <input
                  type="checkbox"
                  checked={enabledProducts.includes(p.id)}
                  onChange={() => toggleProduct(p.id)}
                  className="accent-brand-accent w-4 h-4 shrink-0"
                />
                <div>
                  <p className="text-sm font-medium text-brand-dark group-hover:text-brand-accent transition">
                    {p.name}
                  </p>
                  <p className="text-xs text-gray-400">{p.proofs.length} proof{p.proofs.length !== 1 ? 's' : ''}</p>
                </div>
              </label>
            ))}
          </div>
        </section>

        {/* Custom pricing */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-brand-dark mb-1">Custom pricing</h2>
          <p className="text-sm text-gray-500 mb-5">
            Override price tiers per proof. Totals are auto-calculated from quantity × unit price.
            Leave unchanged to use standard pricing.
          </p>

          {enabledProducts.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">
              No products enabled. Enable products above to configure pricing.
            </p>
          ) : (
            <div className="space-y-3">
              {PRODUCTS.filter((p) => enabledProducts.includes(p.id)).map((p) => {
                const hasCustom = p.proofs.some((pr) => !!customPricing[pr.id]);
                const isExpanded = expandedCategory === p.id;

                return (
                  <div key={p.id} className="border border-gray-100 rounded-xl overflow-hidden">
                    {/* Category header */}
                    <button
                      onClick={() => setExpandedCategory(isExpanded ? null : p.id)}
                      className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition text-left"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{
                            background: `linear-gradient(135deg, ${p.colorFrom}, ${p.colorTo})`,
                          }}
                        />
                        <span className="font-medium text-brand-dark text-sm">{p.name}</span>
                        {hasCustom && (
                          <span className="text-xs bg-amber-100 text-amber-700 rounded-full px-2 py-0.5 font-medium">
                            Custom
                          </span>
                        )}
                      </div>
                      <svg
                        className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Proof pricing rows */}
                    {isExpanded && (
                      <div className="divide-y divide-gray-50">
                        {p.proofs.map((proof) => {
                          const isCustom = !!customPricing[proof.id];
                          const tiers = getEffectiveTiers(proof.id);

                          return (
                            <div key={proof.id} className="p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <p className="text-sm font-medium text-gray-800">{proof.name}</p>
                                  {isCustom && (
                                    <p className="text-xs text-amber-600 mt-0.5">
                                      Custom pricing applied
                                    </p>
                                  )}
                                </div>
                                <button
                                  onClick={() => resetPricing(proof.id)}
                                  disabled={!isCustom}
                                  className="text-xs text-gray-400 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed transition"
                                >
                                  Reset to default
                                </button>
                              </div>

                              <table className="w-full text-xs">
                                <thead>
                                  <tr className="text-gray-400 text-left">
                                    <th className="pb-1.5 font-medium w-1/3">Quantity</th>
                                    <th className="pb-1.5 font-medium w-1/3">Unit price (£)</th>
                                    <th className="pb-1.5 font-medium w-1/3 text-right">
                                      Total (£)
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {tiers.map((tier, i) => (
                                    <tr key={i}>
                                      <td className="py-1 pr-2">
                                        <input
                                          type="number"
                                          min={1}
                                          value={tier.quantity}
                                          onChange={(e) =>
                                            updateTier(proof.id, i, 'quantity', Number(e.target.value))
                                          }
                                          className="w-full border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-brand-accent"
                                        />
                                      </td>
                                      <td className="py-1 pr-2">
                                        <input
                                          type="number"
                                          min={0}
                                          step={0.01}
                                          value={tier.unitPrice}
                                          onChange={(e) =>
                                            updateTier(
                                              proof.id,
                                              i,
                                              'unitPrice',
                                              Number(e.target.value)
                                            )
                                          }
                                          className="w-full border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-brand-accent"
                                        />
                                      </td>
                                      <td className="py-1 text-right text-gray-600 font-medium">
                                        £{tier.total.toFixed(2)}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Proof access */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-brand-dark mb-1">Proof access</h2>
          <p className="text-sm text-gray-500 mb-5">
            Select which individual proofs this client can see and order.
          </p>

          {enabledProducts.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">
              No products enabled. Enable products above to configure proof access.
            </p>
          ) : (
            <div className="space-y-4">
              {PRODUCTS.filter((p) => enabledProducts.includes(p.id)).map((p) => (
                <div key={p.id}>
                  <h3 className="text-sm font-semibold text-brand-dark mb-3">{p.name}</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {p.proofs.map((proof) => (
                      <label
                        key={proof.id}
                        className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-brand-accent/40 cursor-pointer transition group"
                      >
                        <input
                          type="checkbox"
                          checked={clientProofIds.includes(proof.id)}
                          onChange={() => toggleProof(proof.id)}
                          className="accent-brand-accent w-4 h-4 shrink-0"
                        />
                        <div>
                          <p className="text-sm font-medium text-brand-dark group-hover:text-brand-accent transition">
                            {proof.name}
                          </p>
                          <p className="text-xs text-gray-400">{proof.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Proof images */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-brand-dark mb-1">Proof images</h2>
          <p className="text-sm text-gray-500 mb-5">
            Assign specific proof images for this client. They will see only their assigned images when viewing proofs.
          </p>

          {allProofImages.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">
              No proof images available. Upload images in the proof images management area.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {allProofImages.map((image) => (
                <label
                  key={image.id}
                  className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:border-brand-accent/40 cursor-pointer transition group"
                >
                  <input
                    type="checkbox"
                    checked={clientProofImageIds.includes(image.id)}
                    onChange={() => toggleProofImage(image.id)}
                    className="accent-brand-accent w-4 h-4 shrink-0 mt-1"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start gap-2">
                      <Image
                        src={image.imageUrl}
                        alt={`${image.proofId} - ${image.categoryId}`}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded object-cover flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-brand-dark group-hover:text-brand-accent transition truncate">
                          {image.proofId}
                        </p>
                        <p className="text-xs text-gray-400 truncate">{image.categoryId}</p>
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
