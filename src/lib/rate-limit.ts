/**
 * Simple in-memory sliding-window rate limiter.
 *
 * Good enough for a single-instance Next.js deployment / dev environment.
 * For multi-instance production use, swap this for Upstash Redis or similar.
 *
 * Each bucket tracks the timestamps of recent hits and expires entries
 * older than `windowMs`. When the bucket exceeds `max`, `check()` returns
 * `{ allowed: false }` plus the seconds until the oldest hit ages out.
 */

type Bucket = { hits: number[] };

const buckets = new Map<string, Bucket>();

// Periodically prune empty buckets so the Map doesn't grow without bound.
// (Runs once on module load — Next.js keeps the module alive across requests.)
const PRUNE_INTERVAL_MS = 60_000;
let pruneTimer: ReturnType<typeof setInterval> | null = null;
function ensurePruner(windowMs: number) {
  if (pruneTimer) return;
  pruneTimer = setInterval(() => {
    const cutoff = Date.now() - windowMs;
    for (const [key, bucket] of buckets) {
      bucket.hits = bucket.hits.filter((t) => t > cutoff);
      if (bucket.hits.length === 0) buckets.delete(key);
    }
  }, PRUNE_INTERVAL_MS);
  // Don't keep the Node process alive just for the pruner.
  if (typeof pruneTimer === "object" && "unref" in pruneTimer) {
    (pruneTimer as unknown as { unref: () => void }).unref();
  }
}

export type RateLimitResult =
  | { allowed: true; remaining: number }
  | { allowed: false; retryAfterSeconds: number };

export function rateLimit(
  key: string,
  opts: { max: number; windowMs: number }
): RateLimitResult {
  ensurePruner(opts.windowMs);
  const now = Date.now();
  const cutoff = now - opts.windowMs;

  const bucket = buckets.get(key) ?? { hits: [] };
  // Drop expired hits.
  bucket.hits = bucket.hits.filter((t) => t > cutoff);

  if (bucket.hits.length >= opts.max) {
    const oldest = bucket.hits[0];
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((oldest + opts.windowMs - now) / 1000)
    );
    buckets.set(key, bucket);
    return { allowed: false, retryAfterSeconds };
  }

  bucket.hits.push(now);
  buckets.set(key, bucket);
  return { allowed: true, remaining: opts.max - bucket.hits.length };
}

/**
 * Reset a bucket — call this after a successful login so a user who finally
 * remembers their password isn't penalised for earlier wrong attempts.
 */
export function resetRateLimit(key: string) {
  buckets.delete(key);
}
