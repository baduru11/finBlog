import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Masthead } from "@/components/Masthead";
import { GlossaryTeaser } from "@/components/GlossaryTeaser";
import { EditorialNote } from "@/components/EditorialNote";
import { getAllPosts } from "@/lib/posts";
import { formatLongDate } from "@/lib/utils";

export default function HomePage() {
  const posts = getAllPosts();
  const [featured, ...rest] = posts;
  const secondary = rest.slice(0, 6);

  return (
    <>
      <Masthead />
      <div className="container-page">
        {featured ? (
          <section className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 lg:gap-16 py-12 sm:py-16">
            <article>
              <div className="text-kicker mb-5">
                {featured.tags[0] ?? "Lead story"}
              </div>
              <Link
                href={`/posts/${featured.slugAsParams}`}
                className="cursor-pointer group block"
              >
                <h2
                  className="font-[family-name:var(--font-display)] text-[2rem] sm:text-[2.75rem] lg:text-[3.25rem] leading-[1.05] font-semibold text-[color:var(--ink)] tracking-tight mb-5 group-hover:text-[color:var(--accent)] transition-colors"
                  style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
                >
                  {featured.title}
                </h2>
                <p className="text-dek max-w-[620px] mb-6">{featured.summary}</p>
              </Link>
              <div className="text-byline flex flex-wrap items-center gap-x-4 gap-y-1 mb-6">
                <span>By {featured.author}</span>
                <span className="text-[color:var(--ink-subtle)]">·</span>
                <time dateTime={featured.date}>{formatLongDate(featured.date)}</time>
                <span className="text-[color:var(--ink-subtle)]">·</span>
                <span>{featured.readingTimeText}</span>
              </div>
              <Link
                href={`/posts/${featured.slugAsParams}`}
                className="cursor-pointer inline-flex items-center gap-1.5 text-[0.9375rem] font-medium text-[color:var(--accent)] hover:gap-2.5 transition-all"
              >
                Continue reading <ArrowRight size={15} strokeWidth={2.25} />
              </Link>
            </article>
            <GlossaryTeaser />
          </section>
        ) : (
          <section className="py-16">
            <p className="text-[color:var(--ink-muted)]">First edition coming soon.</p>
          </section>
        )}

        {secondary.length > 0 && (
          <section className="border-t-2 border-[color:var(--rule-strong)] pt-10 sm:pt-14">
            <div className="flex items-baseline justify-between mb-8">
              <h2 className="text-kicker">Also in this edition</h2>
              <Link
                href="/posts"
                className="cursor-pointer text-meta text-[color:var(--ink-muted)] hover:text-[color:var(--accent)] transition-colors"
              >
                Archive →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 lg:divide-x divide-[color:var(--rule)] gap-y-2">
              {secondary.map((p, i) => (
                <article
                  key={p.slugAsParams}
                  className={
                    "pb-8 border-b border-[color:var(--rule)] sm:pb-0 sm:border-b-0 " +
                    (i > 0 ? "lg:pl-10" : "")
                  }
                >
                  <Link href={`/posts/${p.slugAsParams}`} className="cursor-pointer group block">
                    <div className="text-kicker mb-3">{p.tags[0] ?? "Note"}</div>
                    <h3
                      className="font-[family-name:var(--font-display)] text-[1.375rem] leading-[1.2] font-semibold text-[color:var(--ink)] tracking-tight mb-2 group-hover:text-[color:var(--accent)] transition-colors"
                      style={{ fontVariationSettings: '"opsz" 48, "SOFT" 50' }}
                    >
                      {p.title}
                    </h3>
                    <p className="text-[0.9375rem] leading-relaxed text-[color:var(--ink-muted)] line-clamp-2 mb-3">
                      {p.summary}
                    </p>
                    <div className="text-byline flex items-center gap-x-3">
                      <time dateTime={p.date}>{formatLongDate(p.date)}</time>
                      <span className="text-[color:var(--ink-subtle)]">·</span>
                      <span>{p.readingTimeText}</span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}

        <EditorialNote />
      </div>
    </>
  );
}
