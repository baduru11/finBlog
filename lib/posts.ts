import readingTime from "reading-time";
import { posts as rawPosts, concepts as rawConcepts } from "#site/content";

export type Post = (typeof rawPosts)[number] & {
  readingTimeText: string;
  readingMinutes: number;
};

export type Concept = (typeof rawConcepts)[number];

function withReadingTime(post: (typeof rawPosts)[number]): Post {
  const stats = readingTime(post.metadata?.readingTime ? "" : "" );
  const text = `${Math.max(1, Math.round((post.metadata?.readingTime ?? stats.minutes) || 1))} min read`;
  return {
    ...post,
    readingTimeText: text,
    readingMinutes: post.metadata?.readingTime ?? Math.max(1, Math.round(stats.minutes || 1)),
  };
}

export function getAllPosts(): Post[] {
  return rawPosts
    .filter((p) => p.status === "published")
    .map(withReadingTime)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export function getPostBySlug(slug: string): Post | undefined {
  const found = rawPosts.find((p) => p.slugAsParams === slug);
  return found ? withReadingTime(found) : undefined;
}

export function getAllConcepts(): Concept[] {
  return [...rawConcepts].sort((a, b) => a.term.localeCompare(b.term));
}

export function getConceptBySlug(slug: string): Concept | undefined {
  return rawConcepts.find((c) => c.slugAsParams === slug);
}

export function getConceptsByPost(post: Post): Concept[] {
  if (!post.concepts?.length) return [];
  return post.concepts
    .map((slug) => rawConcepts.find((c) => c.slugAsParams === slug))
    .filter((c): c is Concept => Boolean(c));
}

export function getAllTags(): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const p of getAllPosts()) {
    for (const tag of p.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export function getPostsByTag(tag: string): Post[] {
  return getAllPosts().filter((p) => p.tags.includes(tag));
}

export function getPostsByConcept(conceptSlug: string): Post[] {
  return getAllPosts().filter((p) => p.concepts.includes(conceptSlug));
}
