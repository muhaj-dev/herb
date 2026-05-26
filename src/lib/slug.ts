import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Normalise free text to a URL-safe slug.
 * Empty input returns "untitled" so we never produce an empty slug.
 */
export function slugify(text: string): string {
  const base = text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip diacritics (e.g. Ibà → iba)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return base || "untitled";
}

/**
 * Return a slug that's unique within `table` by appending `-2`, `-3`, … if
 * the base slug (or its lower-numbered variants) are already taken.
 *
 * `ignoreId` lets the caller exclude the row being updated, so renaming a
 * record back to its own current slug doesn't trigger a false collision.
 *
 * We fetch all matching slugs in one query rather than looping with
 * `select…eq…maybeSingle` so we don't make N round-trips on a busy table.
 */
export async function ensureUniqueSlug(
  supabase: SupabaseClient,
  table: string,
  base: string,
  ignoreId?: string
): Promise<string> {
  const root = slugify(base);

  let query = supabase
    .from(table)
    .select("slug, id")
    .or(`slug.eq.${root},slug.like.${root}-%`);
  if (ignoreId) query = query.neq("id", ignoreId);

  const { data, error } = await query;
  if (error) {
    // Don't block the caller on a query error — fall back to the base slug
    // and let the DB unique constraint surface anything we missed.
    console.warn(`[ensureUniqueSlug] lookup failed on ${table}:`, error);
    return root;
  }

  const taken = new Set((data ?? []).map((r) => (r as { slug: string }).slug));
  if (!taken.has(root)) return root;

  // Find the lowest unused suffix. Cap the loop at a large number so a
  // pathological case can't spin forever.
  for (let n = 2; n < 10_000; n++) {
    const candidate = `${root}-${n}`;
    if (!taken.has(candidate)) return candidate;
  }
  // Extremely unlikely fallback.
  return `${root}-${Date.now()}`;
}
