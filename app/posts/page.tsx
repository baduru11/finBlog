import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { getAllPosts, getAllTags } from "@/lib/posts";
import { formatLongDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Archive",
  description: "Every post — markets, macro, politics, and the concepts behind them.",
};

export default function PostsIndexPage() {
  const posts = getAllPosts();
  const tags = getAllTags();

  // Group by year
  const byYear = new Map<string, typeof posts>();
  for (const p of posts) {
    const y = p.date.slice(0, 4);
    if (!byYear.has(y)) byYear.set(y, []);
    byYear.get(y)!.push(p);
  }
  const years = Array.from(byYear.keys()).sort((a, b) => +b - +a);

  return (
    <>
      <Nav />
      <div className="container-page py-16 sm:py-24">
        <header className="max-w-[760px] mb-12 border-b-2 border-[color:var(--rule-strong)] pb-10">
          <div className="text-kicker mb-4">Archive</div>
          <h1 className="text-h1 text-[color:var(--ink)] mb-5">
            Every story published here
          </h1>
          <p className="text-dek">
            Newest first, grouped by year. Each post explains the concepts it relies
            on, in plain language.
          </p>
        </header>

        {tags.length > 0 ? (
          <div className="flex flex-wrap gap-2 mb-14">
            <span className="text-meta text-[color:var(--ink-subtle)] mr-2 self-center">
              Sections
            </span>
            {tags.map(({ tag, count }) => (
              <Link
                key={tag}
                href={`/tags/${tag}`}
                className="cursor-pointer inline-flex items-baseline gap-1.5 rounded-full border border-[color:var(--rule)] px-3 py-1 text-[0.8125rem] text-[color:var(--ink-muted)] hover:border-[color:var(--accent)] hover:text-[color:var(--accent)] transition-colors"
              >
                {tag}
                <span className="text-[0.6875rem] text-[color:var(--ink-subtle)] font-[family-name:var(--font-mono)]">
                  {count}
                </span>
              </Link>
            ))}
          </div>
        ) : null}

        <div className="max-w-[820px] space-y-16">
          {posts.length === 0 ? (
            <p className="text-[color:var(--ink-muted)] py-12">
              No posts yet — first one is being drafted.
            </p>
          ) : (
            years.map((year) => (
              <section key={year}>
                <div className="flex items-baseline gap-6 mb-6 sm:mb-8">
                  <h2
                    className="font-[family-name:var(--font-display)] text-[3rem] sm:text-[4rem] leading-none font-semibold text-[color:var(--accent)]"
                    style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
                  >
                    {year}
                  </h2>
                  <div className="flex-1 border-b border-[color:var(--rule)]" />
                  <span className="text-meta text-[color:var(--ink-subtle)]">
                    {byYear.get(year)!.length}{" "}
                    {byYear.get(year)!.length === 1 ? "post" : "posts"}
                  </span>
                </div>
                <div>
                  {byYear.get(year)!.map((p) => (
                    <article
                      key={p.slugAsParams}
                      className="border-b border-[color:var(--rule)] py-7 first:pt-0"
                    >
                      <Link
                        href={`/posts/${p.slugAsParams}`}
                        className="cursor-pointer group block"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-kicker">{p.tags[0] ?? "Note"}</span>
                          <span className="text-[color:var(--ink-subtle)]">·</span>
                          <time className="text-byline" dateTime={p.date}>
                            {formatLongDate(p.date)}
                          </time>
                          <span className="text-[color:var(--ink-subtle)]">·</span>
                          <span className="text-byline">{p.readingTimeText}</span>
                        </div>
                        <h3
                          className="font-[family-name:var(--font-display)] text-[1.5rem] sm:text-[1.75rem] leading-[1.2] font-semibold text-[color:var(--ink)] mb-2 group-hover:text-[color:var(--accent)] transition-colors tracking-tight"
                          style={{ fontVariationSettings: '"opsz" 48, "SOFT" 50' }}
                        >
                          {p.title}
                        </h3>
                        <p className="text-[color:var(--ink-muted)] line-clamp-2 max-w-prose">
                          {p.summary}
                        </p>
                      </Link>
                    </article>
                  ))}
                </div>
              </section>
            ))
          )}
        </div>
      </div>
    </>
  );
}
