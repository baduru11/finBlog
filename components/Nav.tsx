import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { SITE } from "@/lib/utils";
import { Monogram } from "./Monogram";

const sections = [
  { href: "/posts", label: "Posts" },
  { href: "/concepts", label: "Concepts" },
  { href: "/about", label: "About" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-30 border-b border-[color:var(--rule-strong)] bg-[color:var(--bg)]/90 backdrop-blur-md">
      <div className="container-page flex h-14 items-center justify-between">
        <Link
          href="/"
          aria-label={SITE.name}
          className="cursor-pointer flex items-center gap-3 text-[color:var(--ink)] hover:text-[color:var(--accent)] transition-colors"
        >
          <Monogram size={28} />
          <span className="text-meta">{SITE.name}</span>
        </Link>
        <nav className="flex items-center gap-1">
          {sections.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="cursor-pointer rounded-full px-3 py-1.5 text-meta text-[color:var(--ink-muted)] transition-colors hover:text-[color:var(--accent)]"
            >
              {s.label}
            </Link>
          ))}
          <span className="ml-1">
            <ThemeToggle />
          </span>
        </nav>
      </div>
    </header>
  );
}
