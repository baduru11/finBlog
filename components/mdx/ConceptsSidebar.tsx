import Link from "next/link";
import type { Concept } from "@/lib/posts";

interface ConceptsSidebarProps {
  concepts: Concept[];
}

export function ConceptsSidebar({ concepts }: ConceptsSidebarProps) {
  if (!concepts.length) return null;

  return (
    <>
      <aside className="hidden xl:block sticky top-24 self-start w-[280px] shrink-0">
        <div className="text-[0.6875rem] uppercase tracking-[0.14em] font-semibold text-[color:var(--accent)] mb-4">
          Concepts in this post
        </div>
        <div className="space-y-5 border-l border-[color:var(--rule)] pl-5">
          {concepts.map((c) => (
            <div key={c.slugAsParams}>
              <Link
                href={`/concepts#${c.slugAsParams}`}
                className="cursor-pointer group block"
              >
                <div className="font-[family-name:var(--font-display)] text-[0.9375rem] font-semibold text-[color:var(--ink)] group-hover:text-[color:var(--accent)] transition-colors mb-1">
                  {c.term}
                </div>
                <p className="text-[0.8125rem] leading-relaxed text-[color:var(--ink-muted)] line-clamp-3">
                  {c.shortDef}
                </p>
              </Link>
            </div>
          ))}
        </div>
      </aside>

      <details className="xl:hidden not-prose mb-8 border-y border-[color:var(--rule)] py-3">
        <summary className="cursor-pointer text-[0.6875rem] uppercase tracking-[0.14em] font-semibold text-[color:var(--accent)] flex items-center justify-between">
          <span>Concepts in this post ({concepts.length})</span>
          <span className="text-[color:var(--ink-subtle)] text-base">+</span>
        </summary>
        <div className="mt-4 space-y-4">
          {concepts.map((c) => (
            <Link
              key={c.slugAsParams}
              href={`/concepts#${c.slugAsParams}`}
              className="cursor-pointer block group"
            >
              <div className="font-[family-name:var(--font-display)] text-[0.9375rem] font-semibold group-hover:text-[color:var(--accent)] transition-colors">
                {c.term}
              </div>
              <p className="text-[0.8125rem] leading-relaxed text-[color:var(--ink-muted)] mt-0.5">
                {c.shortDef}
              </p>
            </Link>
          ))}
        </div>
      </details>
    </>
  );
}
