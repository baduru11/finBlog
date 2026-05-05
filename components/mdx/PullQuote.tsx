import type { ReactNode } from "react";

interface PullQuoteProps {
  children: ReactNode;
  attribution?: string;
}

export function PullQuote({ children, attribution }: PullQuoteProps) {
  return (
    <figure className="my-12 not-prose -mx-4 sm:mx-0 sm:lg:-ml-12 sm:lg:-mr-12 xl:-ml-20 xl:-mr-20 border-y-2 border-[color:var(--rule-strong)] py-7 px-4 sm:px-0">
      <blockquote
        className="font-[family-name:var(--font-display)] italic text-[color:var(--ink)] text-[1.5rem] sm:text-[1.75rem] leading-[1.3] tracking-tight"
        style={{ fontVariationSettings: '"opsz" 96, "SOFT" 100' }}
      >
        &ldquo;{children}&rdquo;
      </blockquote>
      {attribution ? (
        <figcaption className="text-meta text-[color:var(--ink-subtle)] mt-4">
          {attribution}
        </figcaption>
      ) : null}
    </figure>
  );
}
