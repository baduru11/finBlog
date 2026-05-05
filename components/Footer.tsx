import Link from "next/link";
import { SITE } from "@/lib/utils";
import { totalIssues } from "@/lib/site-stats";

const editorial = [
  { label: "About", href: "/about" },
  { label: "Concepts", href: "/concepts" },
  { label: "Posts", href: "/posts" },
];

const distribution = [
  { label: "RSS", href: "/feed.xml" },
  { label: "Sitemap", href: "/sitemap.xml" },
  { label: "GitHub", href: "https://github.com/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/" },
  { label: "Email", href: `mailto:${SITE.email}` },
];

export function Footer() {
  const issue = totalIssues();
  return (
    <footer className="mt-24 border-t-2 border-[color:var(--rule-strong)] bg-[color:var(--bg)]">
      <div className="container-page py-12 sm:py-16">
        <div className="flex flex-wrap items-baseline justify-between border-b border-[color:var(--rule)] pb-8 mb-10 gap-y-4">
          <div className="max-w-[480px]">
            <div className="font-[family-name:var(--font-display)] text-[1.25rem] font-semibold tracking-wide uppercase text-[color:var(--ink)]"
              style={{ fontVariationSettings: '"opsz" 96, "SOFT" 100', letterSpacing: "0.06em" }}
            >
              {SITE.name}
            </div>
            <p className="text-[0.9375rem] text-[color:var(--ink-muted)] leading-relaxed mt-2">
              A weekly note on markets, macro, and the concepts behind them. Set in
              Fraunces and Geist · Published on the web.
            </p>
          </div>
          <div className="text-meta text-[color:var(--ink-subtle)]">
            № {String(issue).padStart(3, "0")}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
          <FooterColumn title="Editorial">
            {editorial.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="cursor-pointer block py-1 text-[0.875rem] text-[color:var(--ink-muted)] hover:text-[color:var(--accent)] transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </FooterColumn>
          <FooterColumn title="Distribution">
            {distribution.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="cursor-pointer block py-1 text-[0.875rem] text-[color:var(--ink-muted)] hover:text-[color:var(--accent)] transition-colors"
              >
                {l.label}
              </a>
            ))}
          </FooterColumn>
          <FooterColumn title="Legal">
            <p className="text-[0.875rem] text-[color:var(--ink-muted)] leading-relaxed">
              &copy; {new Date().getFullYear()} {SITE.author}.
              <br />
              All thoughts are my own.
              <br />
              Text licensed CC-BY-4.0.
            </p>
          </FooterColumn>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-meta text-[color:var(--ink-subtle)] mb-3">{title}</div>
      {children}
    </div>
  );
}
