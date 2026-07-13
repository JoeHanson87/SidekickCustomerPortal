'use client';

import { use, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  getClientById,
  updateClient,
  getClients,
  getClientProofs,
  updateClientProofs,
  getClientSpecificProofImages,
  uploadClientProofImage,
  deleteClientProofImage,
} from '@/lib/admin';
import PRODUCTS from '@/lib/products';
import type { ClientRecord, PriceTier } from '@/lib/admin';

interface PageProps {
  params: Promise<{ id: string }>;
}

interface ClientSpecificImage {
  id: string;
  categoryId: string;
  proofId: string;
  imageUrl: string;
}

export default function ClientEditPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();

  const [client, setClient] = useState<ClientRecord | null>(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', company: '' });
  const [enabledProducts, setEnabledProducts] = useState<string[]>([]);
  const [customPricing, setCustomPricing] = useState<Record<string, PriceTier[]>>({});
  const [clientProofIds, setClientProofIds] = useState<string[]>([]);
  const [clientSpecificImages, setClientSpecificImages] = useState<ClientSpecificImage[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [uploadingProof, setUploadingProof] = useState<string | null>(null);
  const [deletingImage, setDeletingImage] = useState<string | null>(null);

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
      const images = await getClientSpecificProofImages(c.id);
      setClientSpecificImages(images);
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

  const handleProofImageUpload = async (categoryId: string, proofId: string, file: File) => {
    if (!client) return;
    const key = `${categoryId}-${proofId}`;
    setUploadingProof(key);
    try {
      const image = await uploadClientProofImage(client.id, categoryId, proofId, file);
      setClientSpecificImages((prev) => {
        const filtered = prev.filter(
          (img) => !(img.categoryId === categoryId && img.proofId === proofId)
        );
        return [...filtered, image];
      });
    } catch {
      // Error handling could be improved with toast notifications
    } finally {
      setUploadingProof(null);
    }
  };

  const handleProofImageDelete = async (imageId: string) => {
    setDeletingImage(imageId);
    try {
      await deleteClientProofImage(imageId);
      setClientSpecificImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch {
      // Error handling could be improved with toast notifications
    } finally {
      setDeletingImage(null);
    }
  };

  const getClientImage = (categoryId: string, proofId: string) =>
    clientSpecificImages.find((img) => img.categoryId === categoryId && img.proofId === proofId);

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

        {/* Proof images - Client specific uploads */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-brand-dark mb-1">Proof images</h2>
          <p className="text-sm text-gray-500 mb-5">
            Upload proof images specific to this client. These images will be shown exclusively to this client.
          </p>

          {enabledProducts.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">
              No products enabled. Enable products above to upload proof images.
            </p>
          ) : (
            <div className="space-y-6">
              {PRODUCTS.filter((p) => enabledProducts.includes(p.id)).map((product) => (
                <div key={product.id}>
                  <h3 className="text-sm font-semibold text-brand-dark mb-3">{product.name}</h3>
                  <div className="space-y-3">
                    {product.proofs.map((proof) => {
                      const image = getClientImage(product.id, proof.id);
                      const key = `${product.id}-${proof.id}`;
                      const isUploading = uploadingProof === key;
                      const isDeleting = deletingImage === image?.id;

                      return (
                        <div
                          key={proof.id}
                          className="flex items-start gap-4 p-4 rounded-lg border border-gray-100 hover:border-brand-accent/20 transition"
                        >
                          {/* Image preview */}
                          <div className="shrink-0">
                            {image ? (
                              <div className="relative w-24 h-20 rounded-lg overflow-hidden border border-gray-200">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={image.imageUrl}
                                  alt={`Proof image for ${proof.name}`}
                                  className="w-full h-full object-contain bg-gray-50"
                                />
                              </div>
                            ) : (
                              <div className="w-24 h-20 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center bg-gray-50">
                                <span className="text-xs text-gray-400 text-center px-1">No image</span>
                              </div>
                            )}
                          </div>

                          {/* Proof info and actions */}
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-800">{proof.name}</h4>
                            <p className="text-xs text-gray-400 mt-0.5">{proof.description}</p>
                            <div className="flex gap-2 mt-3">
                              <ClientImageUploadButton
                                categoryId={product.id}
                                proofId={proof.id}
                                uploading={isUploading}
                                onUpload={handleProofImageUpload}
                              />
                              {image && (
                                <button
                                  onClick={() => handleProofImageDelete(image.id)}
                                  disabled={isDeleting}
                                  className="text-xs text-red-500 hover:text-red-700 transition disabled:opacity-50"
                                >
                                  {isDeleting ? 'Removing…' : 'Remove'}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function ClientImageUploadButton({
  categoryId,
  proofId,
  uploading,
  onUpload,
}: {
  categoryId: string;
  proofId: string;
  uploading: boolean;
  onUpload: (categoryId: string, proofId: string, file: File) => Promise<void>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await onUpload(categoryId, proofId, file);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex items-center gap-1.5 text-xs font-medium text-brand-accent hover:text-brand-accent-hover border border-brand-accent hover:border-brand-accent-hover rounded-lg px-3 py-1.5 transition disabled:opacity-50"
      >
        {uploading ? (
          'Uploading…'
        ) : (
          <>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            Upload
          </>
        )}
      </button>
    </>
  );
}
