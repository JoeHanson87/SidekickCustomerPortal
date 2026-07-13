'use client';

import PRODUCTS from '@/lib/products';

export default function AdminProductsPage() {
  const totalProofs = PRODUCTS.reduce((sum, p) => sum + p.proofs.length, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-brand-dark">Product Catalogue</h1>
        <p className="text-gray-500 mt-1">
          {PRODUCTS.length} product categories · {totalProofs} total proofs
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
              {product.proofs.map((proof) => (
                <div key={proof.id} className="px-6 py-5">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
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
          </div>
        ))}
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
