import PRODUCTS from './products';
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
const CLIENTS_KEY = 'sidekick_clients';

const ALL_PRODUCT_IDS = ['stationery', 'brochures', 'clothing', 'fliers', 'promotional'];

const SEED_CLIENTS: ClientRecord[] = [
  {
    id: '1',
    email: 'hello@acmecorp.com',
    password: 'demo123',
    company: 'Acme Corporation',
    name: 'Sarah Thompson',
    enabledProducts: [...ALL_PRODUCT_IDS],
    customPricing: {},
  },
  {
    id: '2',
    email: 'admin@techstart.co.uk',
    password: 'demo123',
    company: 'TechStart Ltd',
    name: 'James Carter',
    enabledProducts: [...ALL_PRODUCT_IDS],
    customPricing: {},
  },
  {
    id: '3',
    email: 'info@bloomdesign.com',
    password: 'demo123',
    company: 'Bloom Design Studio',
    name: 'Emma Wilson',
    enabledProducts: [...ALL_PRODUCT_IDS],
    customPricing: {},
  },
];

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
// Client store (localStorage-persisted)
// ---------------------------------------------------------------------------

export function getClients(): ClientRecord[] {
  if (typeof window === 'undefined') return [...SEED_CLIENTS];
  const raw = localStorage.getItem(CLIENTS_KEY);
  if (!raw) {
    const seeded = SEED_CLIENTS.map((c) => ({ ...c }));
    saveClients(seeded);
    return seeded;
  }
  try {
    return JSON.parse(raw) as ClientRecord[];
  } catch {
    return [...SEED_CLIENTS];
  }
}

export function saveClients(clients: ClientRecord[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
  }
}

export function addClient(client: Omit<ClientRecord, 'id'>): ClientRecord {
  const newClient: ClientRecord = { ...client, id: Date.now().toString() };
  const clients = getClients();
  saveClients([...clients, newClient]);
  return newClient;
}

export function updateClient(id: string, updates: Partial<Omit<ClientRecord, 'id'>>): void {
  const clients = getClients();
  saveClients(clients.map((c) => (c.id === id ? { ...c, ...updates } : c)));
}

export function deleteClient(id: string): void {
  saveClients(getClients().filter((c) => c.id !== id));
}

export function getClientById(id: string): ClientRecord | null {
  return getClients().find((c) => c.id === id) ?? null;
}

export function getClientByEmail(email: string): ClientRecord | null {
  return getClients().find((c) => c.email.toLowerCase() === email.toLowerCase()) ?? null;
}

// ---------------------------------------------------------------------------
// Product resolution for a client
// ---------------------------------------------------------------------------

export function getProductsForClient(email: string): ProductCategory[] {
  const client = getClientByEmail(email);
  if (!client) return PRODUCTS;

  return PRODUCTS.filter((p) => client.enabledProducts.includes(p.id)).map((p) => ({
    ...p,
    proofs: p.proofs.map((proof) => ({
      ...proof,
      priceTiers: client.customPricing[proof.id] ?? proof.priceTiers,
    })),
  }));
}
