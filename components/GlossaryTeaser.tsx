import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAllConcepts } from "@/lib/posts";
import { totalConcepts } from "@/lib/site-stats";

export function GlossaryTeaser() {
  const total = totalConcepts();
  const featured = getAllConcepts().slice(0, 5);
  return (
    <aside className="border border-[color:var(--rule)] bg-[color:var(--bg-elevated)] p-6 sm:p-7">
      <div className="text-kicker mb-5">From the glossary</div>
      <ul className="space-y-4">
        {featured.map((c) => (
          <li key={c.slugAsParams} className="border-b border-[color:var(--rule)] pb-3 last:border-0 last:pb-0">
            <Link
              href={`/concepts#${c.slugAsParams}`}
              className="cursor-pointer group block"
            >
              <div
                className="font-[family-name:var(--font-display)] text-[1rem] font-semibold text-[color:var(--ink)] group-hover:text-[color:var(--accent)] transition-colors mb-0.5"
                style={{ fontVariationSettings: '"opsz" 24, "SOFT" 50' }}
              >
                {c.term}
              </div>
              <p className="text-[0.8125rem] leading-snug text-[color:var(--ink-muted)] line-clamp-2">
                {c.shortDef}
              </p>
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href="/concepts"
        className="cursor-pointer mt-6 inline-flex items-center gap-1.5 text-meta text-[color:var(--accent)] hover:gap-2.5 transition-all"
      >
        Browse all {total} <ArrowRight size={12} strokeWidth={2.5} />
      </Link>
    </aside>
  );
}
