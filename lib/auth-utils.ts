// lib/auth-utils.ts
import type { User } from '@/payload-types';

/**
 * بررسی می‌کند آیا کاربر نقش مشخصی دارد یا نه.
 * هم string و هم آرایه را پشتیبانی می‌کند.
 */
export function hasRole(
  user: User | null | undefined,
  role: 'admin' | 'user' | string,
): boolean {
  if (!user) return false;
  const r = (user as any).role;
  if (!r) return false;
  if (Array.isArray(r)) return r.includes(role);
  return r === role;
}

export function isAdmin(user: User | null | undefined): boolean {
  return hasRole(user, 'admin');
}