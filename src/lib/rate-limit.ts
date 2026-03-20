type Entry = {
  count: number;
  resetAt: number;
};

const store = new Map<string, Entry>();

function now() {
  return Date.now();
}

export function getClientIp(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return headers.get('x-real-ip') || 'unknown';
}

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; retryAfterSec: number } {
  const current = now();
  const existing = store.get(key);

  if (!existing || current >= existing.resetAt) {
    store.set(key, { count: 1, resetAt: current + windowMs });
    return { allowed: true, retryAfterSec: 0 };
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      retryAfterSec: Math.max(1, Math.ceil((existing.resetAt - current) / 1000)),
    };
  }

  existing.count += 1;
  store.set(key, existing);
  return { allowed: true, retryAfterSec: 0 };
}
