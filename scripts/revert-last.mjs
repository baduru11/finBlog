#!/usr/bin/env node
/**
 * One-command revert for an autonomously-published post that turned out bad.
 *
 *  - Inspects HEAD on main.
 *  - REFUSES to run unless the commit only touches /content/.
 *  - Creates a `git revert` commit and pushes immediately.
 *  - Vercel auto-deploys the revert in ~60s.
 *
 * Usage:  npm run revert-last  [--dry-run]
 */
import { execSync } from "node:child_process";
import { exit } from "node:process";

const dry = process.argv.includes("--dry-run");

function run(cmd) {
  return execSync(cmd, { encoding: "utf8" }).trim();
}

function safeRun(cmd) {
  try {
    return run(cmd);
  } catch (err) {
    console.error(`✗ \`${cmd}\` failed:`, err.stderr || err.message);
    exit(2);
  }
}

const branch = safeRun("git rev-parse --abbrev-ref HEAD");
if (branch !== "main") {
  console.error(`✗ Not on main (currently on "${branch}"). Aborting.`);
  exit(2);
}

const headSha = safeRun("git rev-parse HEAD");
const headSubject = safeRun(`git log -1 --pretty=%s ${headSha}`);
const filesChanged = safeRun(`git show --name-only --pretty="" ${headSha}`)
  .split("\n")
  .map((l) => l.trim())
  .filter(Boolean);

console.log(`HEAD: ${headSha.slice(0, 8)}  "${headSubject}"`);
console.log(`Files in this commit:`);
for (const f of filesChanged) console.log(`  · ${f}`);

const allowedPrefixes = ["content/posts/", "content/concepts/"];
const allOk = filesChanged.every((f) =>
  allowedPrefixes.some((p) => f.startsWith(p))
);
if (!allOk) {
  console.error(
    `\n✗ This commit touches files outside ${allowedPrefixes.join(", ")}. Refusing to auto-revert. Use \`git revert\` manually if you really mean it.`
  );
  exit(2);
}

const revertMsg = `revert: ${headSubject}\n\nThis revert was triggered by scripts/revert-last.mjs. The reverted post had quality or accuracy issues.`;

if (dry) {
  console.log("\n[dry-run] Would run:");
  console.log(`  git revert --no-edit ${headSha}`);
  console.log(`  git commit --amend -m "${revertMsg.split("\n")[0]}"`);
  console.log(`  git push origin main`);
  exit(0);
}

console.log("\nReverting…");
safeRun(`git revert --no-edit ${headSha}`);
safeRun(`git commit --amend -m ${JSON.stringify(revertMsg)}`);
safeRun(`git push origin main`);
console.log("\n✓ Reverted and pushed. Vercel will redeploy in ~60s.");
