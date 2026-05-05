import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Monogram } from "@/components/Monogram";
import { SITE } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About",
  description: `About ${SITE.author} and ${SITE.name}.`,
};

const principles = [
  "Numbers over narratives.",
  "Concepts get explained inline.",
  "If I get it wrong, I correct it.",
  "Short over long.",
  "No clickbait, no marketing voice.",
];

const stack = [
  { label: "Framework", value: "Next.js · App Router" },
  { label: "Styling", value: "Tailwind v4" },
  { label: "Content", value: "MDX · Velite" },
  { label: "Type", value: "Fraunces · Geist" },
  { label: "Hosting", value: "Vercel" },
];

export default function AboutPage() {
  return (
    <>
      <Nav />
      <div className="container-page py-16 sm:py-24">
        <header className="max-w-[760px] mb-12 border-b-2 border-[color:var(--rule-strong)] pb-10">
          <div className="text-kicker mb-4">Colophon</div>
          <h1 className="text-h1 text-[color:var(--ink)]">About the editor</h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-12 lg:gap-20">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="border border-[color:var(--rule-strong)] bg-[color:var(--bg-elevated)] p-8 flex flex-col items-center">
              <Monogram size={120} variant="stamp" />
              <div className="mt-6 text-meta text-[color:var(--ink-subtle)]">Editor</div>
              <div
                className="font-[family-name:var(--font-display)] text-[1.5rem] font-semibold text-[color:var(--ink)] mt-1"
                style={{ fontVariationSettings: '"opsz" 48, "SOFT" 50' }}
              >
                {SITE.author}
              </div>
            </div>
            <a
              href={`mailto:${SITE.email}`}
              className="cursor-pointer block mt-6 text-byline text-[color:var(--ink-muted)] hover:text-[color:var(--accent)] transition-colors text-center"
            >
              {SITE.email}
            </a>
          </aside>

          <div className="max-w-[640px]">
            <div className="prose-finblog text-[1.0625rem] leading-[1.75]">
              <p>
                Hi — I&apos;m {SITE.author}. This blog is where I think out loud
                about markets, macro, and the policy that pushes them around. Posts
                are short, opinionated, and try to be honest about what I don&apos;t
                know.
              </p>
              <p>
                Every post pairs the story of the week with the concepts a careful
                reader needs to understand it — defined in plain language, no jargon
                left as decoration. If I get something wrong, I&apos;ll come back and
                fix it with a note about what I missed.
              </p>
            </div>

            <hr className="rule my-12" />

            <section>
              <div className="text-kicker mb-6">Editorial principles</div>
              <ol className="space-y-3">
                {principles.map((p, i) => (
                  <li key={p} className="flex gap-4 items-baseline">
                    <span
                      className="font-[family-name:var(--font-display)] text-[1.25rem] font-semibold text-[color:var(--accent)] w-6 shrink-0"
                      style={{ fontVariationSettings: '"opsz" 48, "SOFT" 50' }}
                    >
                      {i + 1}.
                    </span>
                    <span
                      className="font-[family-name:var(--font-display)] text-[1.25rem] leading-[1.4] text-[color:var(--ink)] tracking-tight"
                      style={{ fontVariationSettings: '"opsz" 24, "SOFT" 50' }}
                    >
                      {p}
                    </span>
                  </li>
                ))}
              </ol>
            </section>

            <hr className="rule my-12" />

            <section>
              <div className="text-kicker mb-6">The masthead</div>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8">
                {stack.map((s) => (
                  <div
                    key={s.label}
                    className="flex flex-col gap-0.5 border-b border-[color:var(--rule)] pb-3"
                  >
                    <dt className="text-meta text-[color:var(--ink-subtle)]">
                      {s.label}
                    </dt>
                    <dd className="text-[0.9375rem] text-[color:var(--ink)] font-[family-name:var(--font-mono)]">
                      {s.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
