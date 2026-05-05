#!/usr/bin/env node
/**
 * Content lint — anti-slop gates for autonomous publishing.
 * Run before every push to main. Blocks the push if any post fails.
 *
 * Reads the Velite-built JSON (.velite/posts.json) so we have post bodies
 * already extracted from frontmatter.
 *
 * Exit codes:
 *   0 — all posts pass
 *   1 — at least one post failed; details printed to stderr
 *   2 — setup error (no Velite output, etc.)
 */

import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const POSTS_JSON = resolve(".velite", "posts.json");
const CONCEPTS_JSON = resolve(".velite", "concepts.json");

const TRUSTED_SOURCE_DOMAINS = [
  "federalreserve.gov",
  "bls.gov",
  "treasury.gov",
  "newyorkfed.org",
  "nyfed.org",
  "cbo.gov",
  "imf.org",
  "bis.org",
  "ecb.europa.eu",
  "bankofengland.co.uk",
  "boj.or.jp",
  "ft.com",
  "bloomberg.com",
  "reuters.com",
  "wsj.com",
  "economist.com",
  "barrons.com",
  "marketwatch.com",
  "morningstar.com",
  "sec.gov",
  "fred.stlouisfed.org",
  "stlouisfed.org",
  "atlantafed.org",
  "bea.gov",
  "eia.gov",
];

const BANNED_PHRASES = [
  /in today'?s volatile/i,
  /amid (economic|market|geopolitical) uncertainty/i,
  /as we navigate/i,
  /experts say/i,
  /it'?s important to note/i,
  /it should be noted/i,
  /delve into/i,
  /in this article/i,
  /this article will discuss/i,
  /\bin conclusion\b/i,
  /navigate the complexit/i,
  /unprecedented times/i,
  /game[- ]changer/i,
  /paradigm shift/i,
  /cutting[- ]edge/i,
  /\bleverage\s+(synergies|opportunities)/i,
  /pivotal moment/i,
  /the world of finance/i,
  /at the end of the day/i,
];

const WIRE_OPENING_PATTERNS = [
  /^The Federal Reserve (announced|said|stated)/,
  /^The Fed (announced|said|stated)/,
  /^Markets reacted/,
  /^Stocks (rose|fell|gained|lost)/,
  /^The Dow (rose|fell|gained|lost)/,
  /^The S&P 500 (rose|fell|gained|lost)/,
];

const FORWARD_SECTION_PATTERN =
  /^#{2,3}\s+(what i'?m watching|what i'?d watch|looking ahead|what to watch|what i'll be watching|signals to watch|what comes next|next up|on the radar|what i watch)/im;

const NUMBER_REGEX =
  /\b\d{1,4}(?:[.,]\d{1,4})?\s*(?:bps|basis points?|bp|%|percent|percentage points?|pp|trillion|billion|million|thousand)/gi;
const DOLLAR_REGEX = /\$\s?\d{1,4}(?:[.,]\d{1,4})?\s*(?:trillion|billion|million|thousand)?/gi;

const DATE_REGEX = new RegExp(
  [
    "Q[1-4]\\s*20\\d{2}",
    "(?:January|February|March|April|May|June|July|August|September|October|November|December)\\s+\\d{1,2}(?:,\\s*20\\d{2})?",
    "(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\\s+\\d{1,2}",
    "\\b20\\d{2}-\\d{2}-\\d{2}\\b",
    "\\bH[12]\\s*20\\d{2}\\b",
    "(?:FOMC|ECB|BOE|BOJ)\\s+(?:meeting|decision)",
    "\\bweek\\s+of\\s+(?:January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)",
    "\\b(?:in|since|by|through|until|after|before|during)\\s+(?:19|20)\\d{2}\\b",
    "\\b(?:end-|mid-|early-|late-)20\\d{2}\\b",
  ].join("|"),
  "gi"
);

const HALLUCINATION_MARKERS = [
  /\[?\s*todo\s*\]?/i,
  /\bxxx\b/i,
  /lorem ipsum/i,
  /\[citation needed\]/i,
  /\[insert\b/i,
  /\bplaceholder\b/i,
];

const ABSOLUTE_LIMITS = {
  minWords: 500,
  maxWords: 1300,
  minNumbers: 5,
  numbersPer600Words: 5,
  minDates: 2,
  minSourceLinks: 1,
  maxBodyLengthChars: 12000,
};

function loadJson(path) {
  if (!existsSync(path)) {
    console.error(`✗ Missing ${path}. Run \`npm run content\` first.`);
    process.exit(2);
  }
  return readFile(path, "utf8").then(JSON.parse);
}

function stripMdxBoilerplate(body) {
  return body
    // fenced code blocks
    .replace(/```[\s\S]*?```/g, "")
    // self-closing JSX components: <Foo ... />  — props can span lines but no nested angle brackets
    .replace(/<[A-Z]\w*[^<>]*\/>/g, "")
    // opening JSX tags (children are kept as prose)
    .replace(/<[A-Z]\w*[^>]*>/g, "")
    // closing JSX tags
    .replace(/<\/[A-Z]\w*>/g, "")
    // inline code
    .replace(/`[^`]*`/g, "");
}

function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function findLinkDomains(body) {
  const domains = [];
  const linkRegex = /\[[^\]]+\]\(\s*(https?:\/\/[^)\s]+)/gi;
  let match;
  while ((match = linkRegex.exec(body)) !== null) {
    try {
      const u = new URL(match[1]);
      domains.push(u.hostname.replace(/^www\./, ""));
    } catch {
      // ignore unparseable
    }
  }
  return domains;
}

function checkPost(post, conceptSlugs) {
  const errors = [];
  const warnings = [];
  const body = String(post.raw ?? post.excerpt ?? "");
  const cleanBody = stripMdxBoilerplate(body);
  const words = countWords(cleanBody);

  // 1. Word count bounds
  if (words < ABSOLUTE_LIMITS.minWords) {
    errors.push(`word count ${words} < ${ABSOLUTE_LIMITS.minWords} minimum`);
  }
  if (words > ABSOLUTE_LIMITS.maxWords) {
    errors.push(`word count ${words} > ${ABSOLUTE_LIMITS.maxWords} maximum`);
  }

  // 2. Numeric density (proportional to length)
  const numbers = [
    ...(cleanBody.match(NUMBER_REGEX) ?? []),
    ...(cleanBody.match(DOLLAR_REGEX) ?? []),
  ];
  const requiredNumbers = Math.max(
    ABSOLUTE_LIMITS.minNumbers,
    Math.round((words / 600) * ABSOLUTE_LIMITS.numbersPer600Words)
  );
  if (numbers.length < requiredNumbers) {
    errors.push(
      `numeric-density ${numbers.length} < ${requiredNumbers} (need ${ABSOLUTE_LIMITS.numbersPer600Words} per 600 words; saw ${numbers.length} in ${words} words)`
    );
  }

  // 3. Date specificity
  const dates = cleanBody.match(DATE_REGEX) ?? [];
  if (dates.length < ABSOLUTE_LIMITS.minDates) {
    errors.push(
      `date-specificity ${dates.length} < ${ABSOLUTE_LIMITS.minDates} specific dates`
    );
  }

  // 4. Source citations from trusted domains
  const linkDomains = findLinkDomains(body);
  const trusted = linkDomains.filter((d) =>
    TRUSTED_SOURCE_DOMAINS.some((t) => d === t || d.endsWith("." + t))
  );
  if (trusted.length < ABSOLUTE_LIMITS.minSourceLinks) {
    errors.push(
      `source-citations ${trusted.length} < ${ABSOLUTE_LIMITS.minSourceLinks} (links to trusted domains; got domains: ${linkDomains.join(", ") || "none"})`
    );
  }

  // 5. Banned phrases
  for (const re of BANNED_PHRASES) {
    if (re.test(cleanBody)) {
      errors.push(`banned-phrase matched ${re}`);
    }
  }

  // 6. Wire-style opening
  const firstParagraph =
    cleanBody.split(/\n\s*\n/).find((p) => p.trim().length > 60) ?? "";
  for (const re of WIRE_OPENING_PATTERNS) {
    if (re.test(firstParagraph.trim())) {
      errors.push(`wire-style opening: matched ${re}`);
    }
  }

  // 7. Forward-looking section
  if (!FORWARD_SECTION_PATTERN.test(body)) {
    errors.push(
      `no forward-looking section (need an H2/H3 starting with "What I'm watching", "Looking ahead", etc.)`
    );
  }

  // 8. Concept usage
  const usesConceptBox = /<ConceptBox\b/i.test(body);
  const conceptCount = (post.concepts ?? []).length;
  if (!usesConceptBox && conceptCount < 2) {
    errors.push(
      `concept-usage: need at least 1 <ConceptBox> OR ≥ 2 concepts: [] entries`
    );
  }

  // 9. Concept slugs resolve
  for (const slug of post.concepts ?? []) {
    if (!conceptSlugs.has(slug)) {
      errors.push(`concept "${slug}" referenced in frontmatter but not present in /content/concepts/`);
    }
  }

  // 10. Hallucination markers
  for (const re of HALLUCINATION_MARKERS) {
    if (re.test(body)) {
      errors.push(`hallucination-marker matched ${re}`);
    }
  }

  // 11. Vague time anchors must be paired with specific dates in same paragraph
  const paragraphs = cleanBody.split(/\n\s*\n/);
  for (const para of paragraphs) {
    if (/\b(this week|last week|recently|lately|in recent days)\b/i.test(para)) {
      if (!DATE_REGEX.test(para)) {
        warnings.push(
          `paragraph mentions vague time ("this week"/"recently") without an anchoring specific date: "${para.slice(0, 80)}…"`
        );
        DATE_REGEX.lastIndex = 0;
      }
    }
  }

  return { errors, warnings, stats: { words, numbers: numbers.length, dates: dates.length, trustedSources: trusted.length } };
}

async function main() {
  const posts = await loadJson(POSTS_JSON);
  const concepts = await loadJson(CONCEPTS_JSON);
  const conceptSlugs = new Set(
    concepts.map((c) => c.slug.replace(/^concepts\//, ""))
  );

  let failed = 0;
  let totalWarnings = 0;

  // Cross-post checks: duplicates
  const titles = new Map();
  const slugs = new Map();
  const dates = new Map();
  for (const post of posts) {
    if (post.status !== "published") continue;
    if (titles.has(post.title)) {
      console.error(`✗ DUPLICATE title: "${post.title}" in ${post.slug} and ${titles.get(post.title)}`);
      failed++;
    }
    titles.set(post.title, post.slug);
    if (slugs.has(post.slugAsParams)) {
      console.error(`✗ DUPLICATE slug: ${post.slugAsParams}`);
      failed++;
    }
    slugs.set(post.slugAsParams, post.slug);
    const dateKey = post.date.slice(0, 10);
    if (dates.has(dateKey)) {
      console.error(`⚠ Two posts on the same date ${dateKey}: ${post.slug} and ${dates.get(dateKey)}`);
    }
    dates.set(dateKey, post.slug);
  }

  // Per-post checks
  for (const post of posts) {
    if (post.status !== "published") continue;
    const { errors, warnings, stats } = checkPost(post, conceptSlugs);
    const slug = post.slugAsParams;
    if (errors.length === 0) {
      console.log(
        `✓ ${slug}  [words ${stats.words} · nums ${stats.numbers} · dates ${stats.dates} · sources ${stats.trustedSources}]`
      );
      if (warnings.length > 0) {
        for (const w of warnings) {
          console.log(`  ⚠ ${w}`);
          totalWarnings++;
        }
      }
    } else {
      failed++;
      console.error(
        `✗ ${slug}  [words ${stats.words} · nums ${stats.numbers} · dates ${stats.dates} · sources ${stats.trustedSources}]`
      );
      for (const e of errors) {
        console.error(`    × ${e}`);
      }
      for (const w of warnings) {
        console.error(`    ⚠ ${w}`);
        totalWarnings++;
      }
    }
  }

  console.log("");
  if (failed > 0) {
    console.error(`Content lint FAILED: ${failed} post(s), ${totalWarnings} warning(s).`);
    process.exit(1);
  }
  console.log(`Content lint passed: ${posts.filter((p) => p.status === "published").length} post(s), ${totalWarnings} warning(s).`);
}

main().catch((err) => {
  console.error("lint-content crashed:", err);
  process.exit(2);
});
