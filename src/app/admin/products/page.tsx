'use client';

import { useEffect, useState } from 'react';
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from '@/lib/products';
import type { ProductCategory, Proof, PriceTier } from '@/lib/products';

const EMPTY_PRODUCT: ProductCategory = {
  id: '',
  name: '',
  description: '',
  tagline: '',
  colorFrom: '#4F46E5',
  colorTo: '#7C3AED',
  proofs: [],
};

const EMPTY_PROOF: Proof = {
  id: '',
  name: '',
  description: '',
  specifications: [''],
  priceTiers: [
    { quantity: 100, unitPrice: 0, total: 0 },
    { quantity: 250, unitPrice: 0, total: 0 },
    { quantity: 500, unitPrice: 0, total: 0 },
    { quantity: 1000, unitPrice: 0, total: 0 },
  ],
};

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ProductCategory | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [formError, setFormError] = useState('');

  const refresh = async () => {
    setLoading(true);
    const data = await getProducts();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleAdd = () => {
    setIsNew(true);
    setEditing({ ...EMPTY_PRODUCT, id: Date.now().toString() });
    setFormError('');
  };

  const handleEdit = (product: ProductCategory) => {
    setIsNew(false);
    setEditing(JSON.parse(JSON.stringify(product)));
    setFormError('');
  };

  const handleSave = async () => {
    if (!editing) return;
    setFormError('');

    if (!editing.name.trim()) {
      setFormError('Product name is required.');
      return;
    }
    if (!editing.description.trim()) {
      setFormError('Description is required.');
      return;
    }
    if (!editing.colorFrom.trim() || !editing.colorTo.trim()) {
      setFormError('Both gradient colours are required.');
      return;
    }

    const productId = isNew ? slugify(editing.name) : editing.id;
    if (isNew && products.some((p) => p.id === productId)) {
      setFormError('A product with this name already exists.');
      return;
    }

    const productToSave: ProductCategory = {
      ...editing,
      id: productId,
      proofs: editing.proofs
        .filter((proof) => proof.name.trim())
        .map((proof) => ({
          ...proof,
          id: proof.id || slugify(proof.name),
          specifications: proof.specifications.filter((s) => s.trim()),
          priceTiers: proof.priceTiers.map((tier) => ({
            quantity: tier.quantity,
            unitPrice: tier.unitPrice,
            total: Math.round(tier.quantity * tier.unitPrice * 100) / 100,
          })),
        })),
    };

    if (isNew) {
      await addProduct(productToSave);
    } else {
      await updateProduct(productToSave.id, productToSave);
    }
    await refresh();
    setEditing(null);
  };

  const handleDelete = async (id: string) => {
    await deleteProduct(id);
    await refresh();
    setDeleteConfirmId(null);
  };

  const updateEditing = (updates: Partial<ProductCategory>) => {
    setEditing((prev) => (prev ? { ...prev, ...updates } : prev));
  };

  const updateProof = (index: number, updates: Partial<Proof>) => {
    setEditing((prev) => {
      if (!prev) return prev;
      const proofs = [...prev.proofs];
      proofs[index] = { ...proofs[index], ...updates };
      return { ...prev, proofs };
    });
  };

  const updateTier = (
    proofIndex: number,
    tierIndex: number,
    field: 'quantity' | 'unitPrice',
    value: number
  ) => {
    setEditing((prev) => {
      if (!prev) return prev;
      const proofs = prev.proofs.map((proof, pi) => {
        if (pi !== proofIndex) return proof;
        const priceTiers = proof.priceTiers.map((tier, ti) => {
          if (ti !== tierIndex) return tier;
          const quantity = field === 'quantity' ? value : tier.quantity;
          const unitPrice = field === 'unitPrice' ? value : tier.unitPrice;
          return {
            quantity,
            unitPrice,
            total: Math.round(quantity * unitPrice * 100) / 100,
          };
        });
        return { ...proof, priceTiers };
      });
      return { ...prev, proofs };
    });
  };

  const addProof = () => {
    setEditing((prev) => {
      if (!prev) return prev;
      return { ...prev, proofs: [...prev.proofs, { ...EMPTY_PROOF }] };
    });
  };

  const removeProof = (index: number) => {
    setEditing((prev) => {
      if (!prev) return prev;
      const proofs = prev.proofs.filter((_, i) => i !== index);
      return { ...prev, proofs };
    });
  };

  const updateSpecification = (proofIndex: number, specIndex: number, value: string) => {
    setEditing((prev) => {
      if (!prev) return prev;
      const proofs = prev.proofs.map((proof, pi) => {
        if (pi !== proofIndex) return proof;
        const specifications = [...proof.specifications];
        specifications[specIndex] = value;
        return { ...proof, specifications };
      });
      return { ...prev, proofs };
    });
  };

  const addSpecification = (proofIndex: number) => {
    setEditing((prev) => {
      if (!prev) return prev;
      const proofs = prev.proofs.map((proof, pi) => {
        if (pi !== proofIndex) return proof;
        return { ...proof, specifications: [...proof.specifications, ''] };
      });
      return { ...prev, proofs };
    });
  };

  const removeSpecification = (proofIndex: number, specIndex: number) => {
    setEditing((prev) => {
      if (!prev) return prev;
      const proofs = prev.proofs.map((proof, pi) => {
        if (pi !== proofIndex) return proof;
        const specifications = proof.specifications.filter((_, i) => i !== specIndex);
        return { ...proof, specifications };
      });
      return { ...prev, proofs };
    });
  };

  const totalProofs = products.reduce((sum, p) => sum + p.proofs.length, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-brand-dark">Product Catalogue</h1>
          <p className="text-gray-500 mt-1">
            {products.length} product categories · {totalProofs} total proofs · Manage products and pricing
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-brand-accent hover:bg-brand-accent-hover text-white font-semibold rounded-xl px-5 py-2.5 text-sm transition"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add product
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-gray-400 text-sm">Loading products…</div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center text-gray-400 text-sm">
          No products yet. Click &ldquo;Add product&rdquo; to get started.
        </div>
      ) : (
        <div className="space-y-6">
          {products.map((product) => (
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
                {product.proofs.map((proof) => (
                  <div key={proof.id} className="px-6 py-5">
                    {/* Proof description and specs */}
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

                    {/* Pricing table */}
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
                ))}
              </div>

              {/* Actions */}
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  onClick={() => handleEdit(product)}
                  className="text-brand-accent hover:underline font-medium text-xs"
                >
                  Edit
                </button>
                {deleteConfirmId === product.id ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">Confirm?</span>
                    <button
                      onClick={() => handleDelete(product.id)}
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
                    onClick={() => setDeleteConfirmId(product.id)}
                    className="text-xs text-gray-400 hover:text-red-400 transition"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit product modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-brand-dark">
                {isNew ? 'Add Product' : 'Edit Product'}
              </h2>
              <button
                onClick={() => setEditing(null)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Basic details */}
              <section className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700">Product details</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      value={editing.name}
                      onChange={(e) => updateEditing({ name: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent"
                      placeholder="e.g. Stationery"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Tagline
                    </label>
                    <input
                      value={editing.tagline}
                      onChange={(e) => updateEditing({ tagline: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent"
                      placeholder="e.g. Business Cards · Letterheads"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Description <span className="text-red-400">*</span>
                  </label>
                  <input
                    value={editing.description}
                    onChange={(e) => updateEditing({ description: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent"
                    placeholder="Short description of the product category"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Gradient from <span className="text-red-400">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={editing.colorFrom}
                        onChange={(e) => updateEditing({ colorFrom: e.target.value })}
                        className="w-10 h-10 rounded border border-gray-200 p-0.5"
                      />
                      <input
                        value={editing.colorFrom}
                        onChange={(e) => updateEditing({ colorFrom: e.target.value })}
                        className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Gradient to <span className="text-red-400">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={editing.colorTo}
                        onChange={(e) => updateEditing({ colorTo: e.target.value })}
                        className="w-10 h-10 rounded border border-gray-200 p-0.5"
                      />
                      <input
                        value={editing.colorTo}
                        onChange={(e) => updateEditing({ colorTo: e.target.value })}
                        className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Proofs */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-700">Proofs</h3>
                  <button
                    onClick={addProof}
                    className="text-xs font-medium text-brand-accent hover:text-brand-accent-hover transition"
                  >
                    + Add proof
                  </button>
                </div>

                {editing.proofs.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4 bg-gray-50 rounded-xl">
                    No proofs yet. Click &ldquo;Add proof&rdquo; to add one.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {editing.proofs.map((proof, proofIndex) => (
                      <div key={proofIndex} className="border border-gray-100 rounded-xl p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-brand-dark">Proof {proofIndex + 1}</h4>
                          <button
                            onClick={() => removeProof(proofIndex)}
                            className="text-xs text-gray-400 hover:text-red-400 transition"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                            <input
                              value={proof.name}
                              onChange={(e) => updateProof(proofIndex, { name: e.target.value })}
                              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent"
                              placeholder="e.g. Business Cards"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                            <input
                              value={proof.description}
                              onChange={(e) => updateProof(proofIndex, { description: e.target.value })}
                              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent"
                              placeholder="Short description"
                            />
                          </div>
                        </div>

                        {/* Specifications */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Specifications</label>
                          <div className="space-y-2">
                            {proof.specifications.map((spec, specIndex) => (
                              <div key={specIndex} className="flex items-center gap-2">
                                <input
                                  value={spec}
                                  onChange={(e) => updateSpecification(proofIndex, specIndex, e.target.value)}
                                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent"
                                  placeholder="e.g. A4 (210mm × 297mm)"
                                />
                                <button
                                  onClick={() => removeSpecification(proofIndex, specIndex)}
                                  className="text-xs text-gray-400 hover:text-red-400 transition"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                            <button
                              onClick={() => addSpecification(proofIndex)}
                              className="text-xs font-medium text-brand-accent hover:text-brand-accent-hover transition"
                            >
                              + Add specification
                            </button>
                          </div>
                        </div>

                        {/* Pricing tiers */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Pricing tiers</label>
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="text-gray-400 text-left">
                                <th className="pb-1.5 font-medium w-1/3">Quantity</th>
                                <th className="pb-1.5 font-medium w-1/3">Unit price (£)</th>
                                <th className="pb-1.5 font-medium w-1/3 text-right">Total (£)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {proof.priceTiers.map((tier, tierIndex) => (
                                <tr key={tierIndex}>
                                  <td className="py-1 pr-2">
                                    <input
                                      type="number"
                                      min={1}
                                      value={tier.quantity}
                                      onChange={(e) =>
                                        updateTier(proofIndex, tierIndex, 'quantity', Number(e.target.value))
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
                                        updateTier(proofIndex, tierIndex, 'unitPrice', Number(e.target.value))
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
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {formError && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2.5">
                  {formError}
                </p>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="bg-brand-accent hover:bg-brand-accent-hover text-white font-semibold rounded-lg px-5 py-2 text-sm transition"
                >
                  {isNew ? 'Add product' : 'Save changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function _DefaultCategoryEmoji() {
  return <span>📦</span>;
}

