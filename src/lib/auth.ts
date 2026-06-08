export interface User {
  email: string;
  company: string;
  name: string;
}

const DEMO_USERS: (User & { password: string })[] = [
  { email: 'hello@acmecorp.com', password: 'demo123', company: 'Acme Corporation', name: 'Sarah Thompson' },
  { email: 'admin@techstart.co.uk', password: 'demo123', company: 'TechStart Ltd', name: 'James Carter' },
  { email: 'info@bloomdesign.com', password: 'demo123', company: 'Bloom Design Studio', name: 'Emma Wilson' },
];

const AUTH_KEY = 'sidekick_user';

export function login(email: string, password: string): User | null {
  const user = DEMO_USERS.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (!user) return null;
  const { password: _pw, ...userData } = user;
  void _pw;
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

export const DEMO_CREDENTIALS = DEMO_USERS.map(({ email, password, company }) => ({
  email,
  password,
  company,
}));
