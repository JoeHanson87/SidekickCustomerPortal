'use client';

import { useEffect, useRef, useState } from 'react';
import PRODUCTS from '@/lib/products';
import type { ProofImageRecord } from '@/app/api/proof-images/route';

export default function AdminProductsPage() {
  const totalProofs = PRODUCTS.reduce((sum, p) => sum + p.proofs.length, 0);
  const [proofImages, setProofImages] = useState<ProofImageRecord[]>([]);
  const [uploading, setUploading] = useState<string | null>(null); // tracks "categoryId-proofId"
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    async function loadImages() {
      try {
        const res = await fetch('/api/proof-images');
        if (!res.ok) return;
        const json = await res.json() as { images: ProofImageRecord[] };
        setProofImages(json.images ?? []);
      } catch {
        // ignore
      }
    }
    loadImages();
  }, []);

  const getImage = (categoryId: string, proofId: string) =>
    proofImages.find((img) => img.categoryId === categoryId && img.proofId === proofId);

  const handleUpload = async (categoryId: string, proofId: string, file: File) => {
    const key = `${categoryId}-${proofId}`;
    setUploading(key);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('categoryId', categoryId);
      fd.append('proofId', proofId);
      const res = await fetch('/api/proof-images', { method: 'POST', body: fd });
      if (!res.ok) return;
      const json = await res.json() as { image: ProofImageRecord };
      setProofImages((prev) => {
        const filtered = prev.filter((img) => !(img.categoryId === categoryId && img.proofId === proofId));
        return [...filtered, json.image];
      });
    } finally {
      setUploading(null);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      await fetch(`/api/proof-images/${id}`, { method: 'DELETE' });
      setProofImages((prev) => prev.filter((img) => img.id !== id));
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-brand-dark">Product Catalogue</h1>
        <p className="text-gray-500 mt-1">
          {PRODUCTS.length} product categories · {totalProofs} total proofs · Upload proof images per item
        </p>
      </div>

      <div className="space-y-6">
        {PRODUCTS.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
          >
            {/* Category header */}
            <div
              className="px-6 py-4 flex items-center gap-4"
              style={{
                background: `linear-gradient(135deg, ${product.colorFrom}25, ${product.colorTo}10)`,
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xl shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${product.colorFrom}, ${product.colorTo})`,
                }}
              >
                <CategoryEmoji id={product.id} />
              </div>
              <div>
                <h2 className="font-bold text-brand-dark text-lg">{product.name}</h2>
                <p className="text-sm text-gray-500">{product.tagline}</p>
              </div>
              <span className="ml-auto text-xs text-gray-400">
                {product.proofs.length} proof{product.proofs.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Proofs */}
            <div className="divide-y divide-gray-50">
              {product.proofs.map((proof) => {
                const img = getImage(product.id, proof.id);
                const key = `${product.id}-${proof.id}`;
                const isUploading = uploading === key;
                const isDeleting = deleting === img?.id;

                return (
                  <div key={proof.id} className="px-6 py-5">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800">{proof.name}</h3>
                        <p className="text-xs text-gray-400 mt-0.5">{proof.description}</p>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {proof.specifications.map((spec, i) => (
                          <span
                            key={i}
                            className="text-xs bg-gray-100 text-gray-500 rounded-md px-2 py-0.5"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Proof image section */}
                    <div className="mb-4 flex flex-wrap items-start gap-4">
                      {img ? (
                        <div className="relative w-32 h-24 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={img.imageUrl}
                            alt={`Proof image for ${proof.name}`}
                            className="w-full h-full object-contain bg-gray-50"
                          />
                        </div>
                      ) : (
                        <div className="w-32 h-24 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center shrink-0">
                          <span className="text-xs text-gray-400 text-center px-2">No image</span>
                        </div>
                      )}

                      <div className="flex flex-col gap-2">
                        <UploadButton
                          categoryId={product.id}
                          proofId={proof.id}
                          uploading={isUploading}
                          onUpload={handleUpload}
                        />
                        {img && (
                          <button
                            onClick={() => handleDelete(img.id)}
                            disabled={isDeleting}
                            className="text-xs text-red-500 hover:text-red-700 transition disabled:opacity-50"
                          >
                            {isDeleting ? 'Removing…' : 'Remove image'}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="text-xs w-full min-w-[280px]">
                        <thead>
                          <tr className="text-gray-400 border-b border-gray-100">
                            <th className="text-left pb-1.5 font-medium">Quantity</th>
                            <th className="text-right pb-1.5 font-medium">Unit price</th>
                            <th className="text-right pb-1.5 font-medium">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {proof.priceTiers.map((tier, i) => (
                            <tr key={i} className="text-gray-600">
                              <td className="py-1">{tier.quantity.toLocaleString()} units</td>
                              <td className="py-1 text-right">£{tier.unitPrice.toFixed(2)}</td>
                              <td className="py-1 text-right font-medium">
                                £{tier.total.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UploadButton({
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Upload image
          </>
        )}
      </button>
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
