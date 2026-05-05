import Link from "next/link";
import type { Post } from "@/lib/posts";
import { formatDate } from "@/lib/utils";

interface PostCardProps {
  post: Post;
  variant?: "card" | "row";
}

export function PostCard({ post, variant = "card" }: PostCardProps) {
  const primaryTag = post.tags[0];
  if (variant === "row") {
    return (
      <article className="group border-b border-[color:var(--rule)] py-8 first:pt-0">
        <Link href={`/posts/${post.slugAsParams}`} className="block cursor-pointer">
          <div className="flex items-center gap-3 mb-3">
            <time className="text-meta text-[color:var(--ink-subtle)]">
              {formatDate(post.date)}
            </time>
            <span className="text-[color:var(--ink-subtle)]">·</span>
            <span className="text-meta text-[color:var(--ink-subtle)]">
              {post.readingTimeText}
            </span>
            {primaryTag ? (
              <>
                <span className="text-[color:var(--ink-subtle)]">·</span>
                <span className="text-meta text-[color:var(--accent)]">{primaryTag}</span>
              </>
            ) : null}
          </div>
          <h2 className="text-h2 text-[color:var(--ink)] transition-colors group-hover:text-[color:var(--accent)] mb-2">
            {post.title}
          </h2>
          <p className="text-[color:var(--ink-muted)] line-clamp-2 max-w-prose">
            {post.summary}
          </p>
        </Link>
      </article>
    );
  }

  return (
    <article className="group flex flex-col gap-3 border-b border-[color:var(--rule)] pb-8">
      <Link href={`/posts/${post.slugAsParams}`} className="block cursor-pointer">
        <div className="flex items-center gap-3 mb-2">
          <time className="text-meta text-[color:var(--ink-subtle)]">
            {formatDate(post.date)}
          </time>
          <span className="text-[color:var(--ink-subtle)]">·</span>
          <span className="text-meta text-[color:var(--ink-subtle)]">
            {post.readingTimeText}
          </span>
        </div>
        <h3
          className="font-[family-name:var(--font-display)] text-[1.5rem] leading-[1.2] font-semibold text-[color:var(--ink)] transition-colors group-hover:text-[color:var(--accent)] tracking-tight mb-2"
          style={{ fontVariationSettings: '"opsz" 36' }}
        >
          {post.title}
        </h3>
        <p className="text-[color:var(--ink-muted)] line-clamp-2 text-[0.9375rem] leading-relaxed">
          {post.summary}
        </p>
        {post.tags.length ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="text-[0.6875rem] tracking-wider uppercase font-medium text-[color:var(--ink-subtle)]"
              >
                {t}
              </span>
            ))}
          </div>
        ) : null}
      </Link>
    </article>
  );
}
