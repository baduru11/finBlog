import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { MdxRenderer } from "@/components/mdx/MdxRenderer";
import { groupConceptsByCategory, totalConcepts } from "@/lib/site-stats";
import { formatLongDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Concepts",
  description:
    "A growing glossary of finance concepts — explained in plain language.",
};

export default function ConceptsPage() {
  const total = totalConcepts();
  const groups = groupConceptsByCategory();

  return (
    <>
      <Nav />
      <div className="container-page py-16 sm:py-24">
        <header className="max-w-[760px] mb-16 sm:mb-20 border-b-2 border-[color:var(--rule-strong)] pb-12">
          <div className="text-kicker mb-4">Glossary</div>
          <div className="flex items-baseline gap-5 mb-5">
            <span
              className="stat-number font-[family-name:var(--font-display)] text-[5rem] sm:text-[7rem] leading-none font-semibold text-[color:var(--accent)] tracking-tight"
              style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
            >
              {total}
            </span>
            <h1 className="text-h1 text-[color:var(--ink)]">concepts and counting</h1>
          </div>
          <p className="text-dek max-w-[640px]">
            Every term explained across the blog, grouped by category. Each entry
            links to the posts that use it. New concepts get added with every post.
          </p>
        </header>

        <div className="space-y-20">
          {groups.map((group) => (
            <section key={group.category} id={`category-${group.category}`}>
              <div className="flex items-baseline gap-6 mb-8">
                <h2 className="text-kicker">{group.label}</h2>
                <div className="flex-1 border-b border-[color:var(--rule)]" />
                <span className="text-meta text-[color:var(--ink-subtle)]">
                  {group.items.length}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                {group.items.map(({ concept, postCount, lastUsedDate, lastUsedTitle }) => (
                  <article
                    key={concept.slugAsParams}
                    id={concept.slugAsParams}
                    className="border-l-2 border-[color:var(--rule)] hover:border-[color:var(--accent)] transition-colors pl-5"
                  >
                    <h3
                      className="font-[family-name:var(--font-display)] text-[1.3125rem] font-semibold text-[color:var(--ink)] mb-3 tracking-tight"
                      style={{ fontVariationSettings: '"opsz" 48, "SOFT" 50' }}
                    >
                      {concept.term}
                    </h3>
                    <div className="text-[0.9375rem] leading-[1.65] text-[color:var(--ink-muted)] [&_p]:mb-2">
                      <MdxRenderer code={concept.content} />
                    </div>
                    <div className="text-byline mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="text-[color:var(--ink-subtle)]">
                        Used in {postCount} {postCount === 1 ? "post" : "posts"}
                      </span>
                      {lastUsedDate && lastUsedTitle ? (
                        <>
                          <span className="text-[color:var(--ink-subtle)]">·</span>
                          <span className="text-[color:var(--ink-subtle)]">
                            Last in &ldquo;{lastUsedTitle.length > 40
                              ? lastUsedTitle.slice(0, 40) + "…"
                              : lastUsedTitle}
                            &rdquo; ({formatLongDate(lastUsedDate)})
                          </span>
                        </>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>

        {groups.length === 0 ? (
          <p className="text-[color:var(--ink-muted)] py-12">
            The glossary grows with each post.
          </p>
        ) : null}
      </div>
    </>
  );
}
