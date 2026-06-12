import * as http from 'node:http';

// Simple in-memory rate limiter (per IP, sliding minute window).
const WINDOW_MS = 60_000;
const MAX_TRACKED_IPS = 10_000;
const DEFAULT_TRUSTED_PROXIES = new Set(['127.0.0.1', '::1', '::ffff:127.0.0.1']);

const attempts = new Map<string, number[]>();

function trustedProxies(): Set<string> {
  const configured = process.env.TRUSTED_PROXY_IPS;
  if (!configured) return DEFAULT_TRUSTED_PROXIES;
  return new Set(configured.split(',').map((s) => s.trim()).filter(Boolean));
}

function normalizeIp(ip: string): string {
  if (ip.startsWith('::ffff:')) return ip.slice('::ffff:'.length);
  return ip;
}

export function requestIp(req: http.IncomingMessage): string {
  const remote = normalizeIp(String(req.socket?.remoteAddress ?? 'unknown').trim());
  if (!trustedProxies().has(remote)) return remote;

  const forwarded = String(req.headers['x-forwarded-for'] ?? '')
    .split(',')[0]
    .trim();
  return forwarded ? normalizeIp(forwarded) : remote;
}

export function rateLimited(req: http.IncomingMessage, maxPerMinute = 20): boolean {
  const ip = requestIp(req);
  const now = Date.now();
  const windowStart = now - WINDOW_MS;
  const list = (attempts.get(ip) ?? []).filter((t) => t > windowStart);
  const updated = [...list, now];
  attempts.set(ip, updated);
  if (attempts.size > MAX_TRACKED_IPS) attempts.clear(); // memory backstop
  return updated.length > maxPerMinute;
}
