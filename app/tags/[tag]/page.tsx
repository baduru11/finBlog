import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { MiniChart } from "@/components/mdx/MiniChart";
import { getAllTags, getPostsByTag } from "@/lib/posts";
import { postsPerMonthForTag, topConceptForTag } from "@/lib/site-stats";
import { formatLongDate } from "@/lib/utils";

interface PageProps {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  return getAllTags().map(({ tag }) => ({ tag }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tag } = await params;
  return {
    title: `${tag} · Section`,
    description: `Every post tagged ${tag}.`,
  };
}

export default async function TagPage({ params }: PageProps) {
  const { tag } = await params;
  const posts = getPostsByTag(tag);
  if (!posts.length) notFound();

  const series = postsPerMonthForTag(tag);
  const top = topConceptForTag(tag);

  return (
    <>
      <Nav />
      <div className="container-page py-16 sm:py-24">
        <header className="max-w-[760px] mb-12 border-b-2 border-[color:var(--rule-strong)] pb-10">
          <div className="text-kicker mb-4">Section</div>
          <h1
            className="font-[family-name:var(--font-display)] text-[3rem] sm:text-[4rem] leading-none font-semibold text-[color:var(--ink)] tracking-tight uppercase mb-6"
            style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100', letterSpacing: "0.02em" }}
          >
            {tag}
          </h1>
          <p className="text-dek max-w-[600px]">
            {posts.length} {posts.length === 1 ? "post" : "posts"} in this section
            {top ? (
              <>
                . Mostly about{" "}
                <Link
                  href={`/concepts#${top.slugAsParams}`}
                  className="cursor-pointer text-[color:var(--accent)] underline decoration-1 underline-offset-3 hover:decoration-2 transition-all"
                >
                  {top.term.toLowerCase()}
                </Link>
                .
              </>
            ) : (
              "."
            )}
          </p>
        </header>

        {series.length > 1 ? (
          <section className="mb-16 max-w-[760px]">
            <div className="text-kicker mb-4">Publishing rhythm</div>
            <MiniChart
              data={series}
              caption={`Posts per month tagged ${tag}.`}
              source="this blog"
              height={140}
            />
          </section>
        ) : null}

        <div className="max-w-[820px]">
          {posts.map((p) => (
            <article
              key={p.slugAsParams}
              className="border-b border-[color:var(--rule)] py-7"
            >
              <Link
                href={`/posts/${p.slugAsParams}`}
                className="cursor-pointer group block"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-kicker">{p.tags[0]}</span>
                  <span className="text-[color:var(--ink-subtle)]">·</span>
                  <time className="text-byline" dateTime={p.date}>
                    {formatLongDate(p.date)}
                  </time>
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
      </div>
    </>
  );
}
