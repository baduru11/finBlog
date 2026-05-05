import Link from "next/link";
import type { Post } from "@/lib/posts";
import { formatLongDate } from "@/lib/utils";
import { issueNumberFor } from "@/lib/site-stats";

interface ArticleHeaderProps {
  post: Post;
}

export function ArticleHeader({ post }: ArticleHeaderProps) {
  const issue = issueNumberFor(post);
  return (
    <header className="mb-10 sm:mb-12">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-6">
        {post.tags.map((t) => (
          <Link
            key={t}
            href={`/tags/${t}`}
            className="text-kicker cursor-pointer hover:underline underline-offset-4 decoration-[color:var(--accent)] transition-all"
          >
            {t}
          </Link>
        ))}
      </div>
      <h1 className="text-h1 text-[color:var(--ink)] mb-5">{post.title}</h1>
      <p className="text-dek max-w-[640px]">{post.summary}</p>
      <hr className="rule-stub my-7" style={{ borderTopColor: "var(--ink)" }} />
      <div className="text-byline flex flex-wrap items-center gap-x-4 gap-y-1">
        <span>By {post.author}</span>
        <span className="text-[color:var(--ink-subtle)]">·</span>
        <time dateTime={post.date}>{formatLongDate(post.date)}</time>
        <span className="text-[color:var(--ink-subtle)]">·</span>
        <span>{post.readingTimeText}</span>
        <span className="text-[color:var(--ink-subtle)]">·</span>
        <span>Edition № {String(issue).padStart(3, "0")}</span>
      </div>
    </header>
  );
}
