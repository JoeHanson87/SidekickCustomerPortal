import { getProducts } from './products';
import type { ProductCategory, PriceTier } from './products';

export type { PriceTier };

export interface ClientRecord {
  id: string;
  email: string;
  password: string;
  company: string;
  name: string;
  /** Product category IDs the client can access */
  enabledProducts: string[];
  /** proofId → custom price tiers (empty means use defaults) */
  customPricing: Record<string, PriceTier[]>;
}

const ADMIN_CREDENTIALS = {
  email: 'admin@sidekickltd.com',
  password: 'admin123',
};

const ADMIN_AUTH_KEY = 'sidekick_admin';

// ---------------------------------------------------------------------------
// Admin auth
// ---------------------------------------------------------------------------

export function loginAsAdmin(email: string, password: string): boolean {
  if (
    email.toLowerCase() === ADMIN_CREDENTIALS.email &&
    password === ADMIN_CREDENTIALS.password
  ) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(ADMIN_AUTH_KEY, 'true');
    }
    return true;
  }
  return false;
}

export function logoutAdmin(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ADMIN_AUTH_KEY);
  }
}

export function isAdmin(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
}

export const ADMIN_EMAIL = ADMIN_CREDENTIALS.email;

// ---------------------------------------------------------------------------
// Client store (Supabase-persisted via API routes)
// ---------------------------------------------------------------------------

export async function getClients(): Promise<ClientRecord[]> {
  const res = await fetch('/api/clients');
  if (!res.ok) return [];
  const json = await res.json() as { clients: ClientRecord[] };
  return json.clients ?? [];
}

export async function addClient(client: Omit<ClientRecord, 'id'>): Promise<ClientRecord> {
  const res = await fetch('/api/clients', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(client),
  });
  const json = await res.json() as { client: ClientRecord };
  return json.client;
}

export async function updateClient(id: string, updates: Partial<Omit<ClientRecord, 'id'>>): Promise<void> {
  await fetch(`/api/clients/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
}

export async function deleteClient(id: string): Promise<void> {
  await fetch(`/api/clients/${id}`, { method: 'DELETE' });
}

export async function getClientById(id: string): Promise<ClientRecord | null> {
  const res = await fetch(`/api/clients/${id}`);
  if (!res.ok) return null;
  const json = await res.json() as { client: ClientRecord };
  return json.client ?? null;
}

export async function getClientByEmail(email: string): Promise<ClientRecord | null> {
  const clients = await getClients();
  return clients.find((c) => c.email.toLowerCase() === email.toLowerCase()) ?? null;
}

// ---------------------------------------------------------------------------
// Product resolution for a client
// ---------------------------------------------------------------------------

export async function getClientProofs(clientId: string): Promise<string[]> {
  const res = await fetch(`/api/client-proofs?clientId=${clientId}`);
  if (!res.ok) return [];
  const json = await res.json() as { proofIds: string[] };
  return json.proofIds ?? [];
}

export async function updateClientProofs(clientId: string, proofIds: string[]): Promise<void> {
  await fetch('/api/client-proofs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientId, proofIds }),
  });
}

export async function getClientProofImages(clientId: string): Promise<string[]> {
  const res = await fetch(`/api/client-proof-images?clientId=${clientId}`);
  if (!res.ok) return [];
  const json = await res.json() as { proofImageIds: string[] };
  return json.proofImageIds ?? [];
}

export async function updateClientProofImages(clientId: string, proofImageIds: string[]): Promise<void> {
  await fetch('/api/client-proof-images', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientId, proofImageIds }),
  });
}

export async function getClientSpecificProofImages(
  clientId: string
): Promise<Array<{ id: string; categoryId: string; proofId: string; imageUrl: string }>> {
  const res = await fetch(`/api/client-specific-proof-images?clientId=${clientId}`);
  if (!res.ok) return [];
  const json = await res.json() as {
    images: Array<{ id: string; clientId: string; categoryId: string; proofId: string; imageUrl: string }>;
  };
  return (json.images ?? []).map((img) => ({
    id: img.id,
    categoryId: img.categoryId,
    proofId: img.proofId,
    imageUrl: img.imageUrl,
  }));
}

export async function uploadClientProofImage(
  clientId: string,
  categoryId: string,
  proofId: string,
  file: File
): Promise<{ id: string; categoryId: string; proofId: string; imageUrl: string }> {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('clientId', clientId);
  fd.append('categoryId', categoryId);
  fd.append('proofId', proofId);

  const res = await fetch('/api/client-specific-proof-images', {
    method: 'POST',
    body: fd,
  });

  if (!res.ok) {
    throw new Error('Failed to upload image');
  }

  const json = await res.json() as {
    image: { id: string; clientId: string; categoryId: string; proofId: string; imageUrl: string };
  };
  return {
    id: json.image.id,
    categoryId: json.image.categoryId,
    proofId: json.image.proofId,
    imageUrl: json.image.imageUrl,
  };
}

export async function deleteClientProofImage(id: string): Promise<void> {
  await fetch(`/api/client-specific-proof-images?id=${id}`, { method: 'DELETE' });
}

export async function getProductsForClient(email: string): Promise<ProductCategory[]> {
  const client = await getClientByEmail(email);
  const products = await getProducts();
  if (!client) return products;

  // Get the client's allowed proofs
  const allowedProofIds = await getClientProofs(client.id);

  return products.filter((p) => client.enabledProducts.includes(p.id)).map((p) => ({
    ...p,
    proofs: p.proofs
      .filter((proof) => allowedProofIds.length === 0 || allowedProofIds.includes(proof.id))
      .map((proof) => ({
        ...proof,
        priceTiers: client.customPricing[proof.id] ?? proof.priceTiers,
      })),
  }));
}
