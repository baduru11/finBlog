import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ConceptsSidebar } from "@/components/mdx/ConceptsSidebar";
import { MdxRenderer } from "@/components/mdx/MdxRenderer";
import { ArticleHeader } from "@/components/ArticleHeader";
import { ReadingProgress } from "@/components/ReadingProgress";
import { Nav } from "@/components/Nav";
import {
  getAllPosts,
  getConceptsByPost,
  getPostBySlug,
} from "@/lib/posts";
import { formatLongDate, SITE } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slugAsParams }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      publishedTime: post.date,
      authors: [SITE.author],
      url: `${SITE.url}/posts/${post.slugAsParams}`,
      images: [{ url: `/og/${post.slugAsParams}`, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.summary },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const concepts = getConceptsByPost(post);
  const more = getAllPosts()
    .filter((p) => p.slugAsParams !== post.slugAsParams)
    .slice(0, 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.summary,
    datePublished: post.date,
    author: { "@type": "Person", name: post.author, url: SITE.url },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
    },
    image: `${SITE.url}/og/${post.slugAsParams}`,
    mainEntityOfPage: `${SITE.url}/posts/${post.slugAsParams}`,
  };

  return (
    <>
      <Nav />
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="container-page py-12 sm:py-20">
        <div className="xl:grid xl:grid-cols-[1fr_minmax(0,680px)_280px_1fr] xl:gap-12">
          <div className="hidden xl:block" />

          <div>
            <ArticleHeader post={post} />

            <div className="prose-finblog dropcap-host">
              <MdxRenderer code={post.content} />
            </div>

            <hr className="rule mt-16" />

            {concepts.length > 0 && (
              <section className="mt-10">
                <h3 className="text-kicker mb-4">Concepts referenced</h3>
                <div className="flex flex-wrap gap-2">
                  {concepts.map((c) => (
                    <Link
                      key={c.slugAsParams}
                      href={`/concepts#${c.slugAsParams}`}
                      className="cursor-pointer inline-block rounded-full border border-[color:var(--rule)] px-3 py-1 text-[0.8125rem] text-[color:var(--ink-muted)] hover:border-[color:var(--accent)] hover:text-[color:var(--accent)] transition-colors"
                    >
                      {c.term}
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {more.length > 0 && (
              <section className="mt-16 pt-10 border-t-2 border-[color:var(--rule-strong)]">
                <h3 className="text-kicker mb-6">More from this edition</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-2">
                  {more.map((p) => (
                    <Link
                      key={p.slugAsParams}
                      href={`/posts/${p.slugAsParams}`}
                      className="cursor-pointer group block py-4 border-b border-[color:var(--rule)]"
                    >
                      <div className="text-byline mb-1.5">{formatLongDate(p.date)}</div>
                      <div
                        className="font-[family-name:var(--font-display)] text-[1.25rem] leading-[1.25] font-semibold text-[color:var(--ink)] group-hover:text-[color:var(--accent)] transition-colors"
                        style={{ fontVariationSettings: '"opsz" 48, "SOFT" 50' }}
                      >
                        {p.title}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          <ConceptsSidebar concepts={concepts} />
          <div className="hidden xl:block" />
        </div>
      </article>
    </>
  );
}
