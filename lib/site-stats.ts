import { getAllPosts, getAllConcepts, type Post, type Concept } from "./posts";

export function totalIssues(): number {
  return getAllPosts().length;
}

export function issueNumberFor(post: Pick<Post, "slugAsParams" | "date">): number {
  const ordered = getAllPosts().slice().sort((a, b) => +new Date(a.date) - +new Date(b.date));
  const idx = ordered.findIndex((p) => p.slugAsParams === post.slugAsParams);
  return idx >= 0 ? idx + 1 : ordered.length + 1;
}

export function latestPostDate(): string {
  const all = getAllPosts();
  return all[0]?.date ?? new Date().toISOString().slice(0, 10);
}

export function totalConcepts(): number {
  return getAllConcepts().length;
}

export interface ConceptStats {
  concept: Concept;
  postCount: number;
  lastUsedDate?: string;
  lastUsedTitle?: string;
}

export function conceptStats(): ConceptStats[] {
  const posts = getAllPosts();
  return getAllConcepts().map((concept) => {
    const used = posts.filter((p) => p.concepts.includes(concept.slugAsParams));
    const latest = used[0];
    return {
      concept,
      postCount: used.length,
      lastUsedDate: latest?.date,
      lastUsedTitle: latest?.title,
    };
  });
}

export const CATEGORY_ORDER = [
  "monetary-policy",
  "rates",
  "equities",
  "fx",
  "general",
] as const;

export const CATEGORY_LABELS: Record<string, string> = {
  "monetary-policy": "Monetary policy",
  rates: "Rates & fixed income",
  equities: "Equities",
  fx: "Currencies & FX",
  general: "General",
};

export function groupConceptsByCategory(): Array<{
  category: string;
  label: string;
  items: ConceptStats[];
}> {
  const stats = conceptStats();
  const buckets = new Map<string, ConceptStats[]>();
  for (const s of stats) {
    const cat = s.concept.category ?? "general";
    if (!buckets.has(cat)) buckets.set(cat, []);
    buckets.get(cat)!.push(s);
  }
  const ordered = Array.from(buckets.keys()).sort((a, b) => {
    const ai = CATEGORY_ORDER.indexOf(a as (typeof CATEGORY_ORDER)[number]);
    const bi = CATEGORY_ORDER.indexOf(b as (typeof CATEGORY_ORDER)[number]);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });
  return ordered.map((category) => ({
    category,
    label: CATEGORY_LABELS[category] ?? category,
    items: buckets.get(category)!.sort((a, b) => a.concept.term.localeCompare(b.concept.term)),
  }));
}

export function postsPerMonthForTag(tag: string): Array<{ x: string; y: number }> {
  const posts = getAllPosts().filter((p) => p.tags.includes(tag));
  const counts = new Map<string, number>();
  for (const p of posts) {
    const key = p.date.slice(0, 7);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([x, y]) => ({ x, y }))
    .sort((a, b) => a.x.localeCompare(b.x));
}

export function topConceptForTag(tag: string): Concept | undefined {
  const posts = getAllPosts().filter((p) => p.tags.includes(tag));
  const tally = new Map<string, number>();
  for (const p of posts) {
    for (const c of p.concepts) tally.set(c, (tally.get(c) ?? 0) + 1);
  }
  const top = Array.from(tally.entries()).sort((a, b) => b[1] - a[1])[0];
  if (!top) return undefined;
  return getAllConcepts().find((c) => c.slugAsParams === top[0]);
}

export function formatEditionDate(iso: string): string {
  const d = new Date(iso);
  return d
    .toLocaleDateString("en-US", { weekday: "long" })
    .toUpperCase();
}

export function isoEditionStamp(iso: string): string {
  return iso.slice(0, 10).replace(/-/g, "·");
}
