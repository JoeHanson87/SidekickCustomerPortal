import { getClients } from './admin';

export interface User {
  email: string;
  company: string;
  name: string;
}

const AUTH_KEY = 'sidekick_user';

export function login(email: string, password: string): User | null {
  const client = getClients().find(
    (c) => c.email.toLowerCase() === email.toLowerCase() && c.password === password
  );
  if (!client) return null;
  const userData: User = { email: client.email, company: client.company, name: client.name };
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
  }
  return userData;
}

export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_KEY);
  }
}

export function getUser(): User | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(AUTH_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function isLoggedIn(): boolean {
  return getUser() !== null;
}
