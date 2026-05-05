import type { ReactNode } from "react";

interface ConceptBoxProps {
  term: string;
  children: ReactNode;
}

export function ConceptBox({ term, children }: ConceptBoxProps) {
  return (
    <aside
      role="note"
      className="my-8 not-prose border-l-2 border-[color:var(--accent)] bg-[color:var(--accent-soft)] px-5 py-4 rounded-r-sm"
    >
      <div className="text-[0.6875rem] uppercase tracking-[0.12em] font-semibold text-[color:var(--accent)] mb-1">
        Concept
      </div>
      <div className="font-[family-name:var(--font-display)] text-[1.0625rem] font-semibold text-[color:var(--ink)] mb-1.5">
        {term}
      </div>
      <div className="text-[0.9375rem] leading-relaxed text-[color:var(--ink-muted)]">
        {children}
      </div>
    </aside>
  );
}
