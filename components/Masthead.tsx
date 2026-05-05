import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { SITE } from "@/lib/utils";
import {
  formatEditionDate,
  isoEditionStamp,
  latestPostDate,
  totalIssues,
} from "@/lib/site-stats";

const sections = [
  { href: "/posts", label: "Posts" },
  { href: "/concepts", label: "Concepts" },
  { href: "/about", label: "About" },
];

const footnav = [
  { href: "/feed.xml", label: "RSS" },
  { href: "/posts", label: "Archive" },
];

export function Masthead() {
  const issue = totalIssues();
  const date = latestPostDate();
  const day = formatEditionDate(date);
  const stamp = isoEditionStamp(date);

  return (
    <header className="border-b border-[color:var(--rule-strong)] bg-[color:var(--bg)]">
      {/* Edition strip */}
      <div className="container-page flex items-center justify-between py-2.5 border-b border-[color:var(--rule)]">
        <span className="text-meta text-[color:var(--ink-subtle)]">
          Edition № {String(issue).padStart(3, "0")}
        </span>
        <span className="text-meta text-[color:var(--ink-subtle)]">
          {day} · {stamp}
        </span>
      </div>

      {/* Nameplate */}
      <div className="container-page hero-vignette text-center py-10 sm:py-14">
        <Link
          href="/"
          className="block cursor-pointer text-[color:var(--ink)] hover:text-[color:var(--accent)] transition-colors"
        >
          <h1 className="text-nameplate">{SITE.name}</h1>
        </Link>
        <p className="text-dek mt-4 max-w-[640px] mx-auto text-[color:var(--ink-muted)]">
          {SITE.tagline}
        </p>
      </div>

      {/* Section bar */}
      <div className="container-page flex items-center justify-between py-3 border-t border-[color:var(--rule-strong)] border-b border-[color:var(--rule-strong)]">
        <nav className="flex items-center gap-6">
          {sections.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="cursor-pointer text-meta text-[color:var(--ink)] hover:text-[color:var(--accent)] transition-colors"
            >
              {s.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-5">
          {footnav.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="cursor-pointer text-meta text-[color:var(--ink-muted)] hover:text-[color:var(--accent)] transition-colors"
            >
              {s.label}
            </Link>
          ))}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
