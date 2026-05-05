export function EditorialNote() {
  return (
    <section className="my-16 sm:my-24">
      <div className="max-w-[56ch] mx-auto text-center">
        <div className="text-kicker mb-6">From the editor</div>
        <p
          className="font-[family-name:var(--font-display)] text-[1.375rem] sm:text-[1.5rem] leading-[1.45] italic text-[color:var(--ink)] mb-5"
          style={{ fontVariationSettings: '"opsz" 24, "SOFT" 100' }}
        >
          This is a writing-first publication. Every post is short, opinionated, and
          honest about what I&apos;m still learning.
        </p>
        <p
          className="font-[family-name:var(--font-display)] text-[1.0625rem] leading-[1.6] italic text-[color:var(--ink-muted)]"
          style={{ fontVariationSettings: '"opsz" 24, "SOFT" 100' }}
        >
          The concepts that show up in posts are explained inline and indexed in the
          glossary. If you find an error, write to the editor.
        </p>
        <hr className="rule-stub mx-auto mt-8" style={{ borderTopColor: "var(--accent)" }} />
      </div>
    </section>
  );
}
