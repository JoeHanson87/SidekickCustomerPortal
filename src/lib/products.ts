export interface PriceTier {
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Proof {
  id: string;
  name: string;
  description: string;
  specifications: string[];
  priceTiers: PriceTier[];
  /** URL of the uploaded proof image, if one has been set by admin */
  imageUrl?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  tagline: string;
  colorFrom: string;
  colorTo: string;
  proofs: Proof[];
}

export async function getProducts(): Promise<ProductCategory[]> {
  const res = await fetch('/api/products');
  if (!res.ok) return [];
  const json = await res.json() as { products: ProductCategory[] };
  return json.products ?? [];
}

export async function getProductById(id: string): Promise<ProductCategory | null> {
  const res = await fetch(`/api/products/${id}`);
  if (!res.ok) return null;
  const json = await res.json() as { product: ProductCategory };
  return json.product ?? null;
}

export async function addProduct(product: ProductCategory): Promise<ProductCategory> {
  const res = await fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  const json = await res.json() as { product: ProductCategory };
  return json.product;
}

export async function updateProduct(id: string, updates: Partial<ProductCategory>): Promise<void> {
  await fetch(`/api/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
}

export async function deleteProduct(id: string): Promise<void> {
  await fetch(`/api/products/${id}`, { method: 'DELETE' });
}

const PRODUCTS: ProductCategory[] = [];

export default PRODUCTS;
