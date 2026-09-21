/* House style check.
 *
 * The connector in every string a person reads is a spaced hyphen. No em dash,
 * no en dash, no separator dot, no ellipsis, and none of the four other
 * codepoints that look like a hyphen and slip past a check that only knows
 * about U+2014 and U+2013.
 *
 * The patterns are built from escape sequences on purpose. Written as literal
 * characters, this file's own source would contain them and the check would
 * report itself on every clean run.
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, extname } from "node:path";
import { fileURLToPath } from "node:url";

/* new URL(...).pathname leaves %20 in a path under a directory with a space in
   its name, and the walk then finds nothing and reports clean */
const ROOT = fileURLToPath(new URL("..", import.meta.url));

const BANNED = [
  ["\u2014", "em dash"],
  ["\u2013", "en dash"],
  ["\u2010", "hyphen"],
  ["\u2012", "figure dash"],
  ["\u2015", "horizontal bar"],
  ["\u2212", "minus sign"],
  ["\u00b7", "middle dot"],
  ["\u2022", "bullet"],
  ["\u2026", "ellipsis"],
];

/* the same characters written as HTML entities, which only become themselves
   once a browser renders them */
const ENTITIES = [
  ["&mdash;", "em dash entity"],
  ["&ndash;", "en dash entity"],
  ["&middot;", "middle dot entity"],
  ["&bull;", "bullet entity"],
  ["&hellip;", "ellipsis entity"],
  ["&#8212;", "em dash entity"],
  ["&#8211;", "en dash entity"],
  ["&#183;", "middle dot entity"],
  ["&#8226;", "bullet entity"],
  ["&#8230;", "ellipsis entity"],
];

const SKIP_DIRS = new Set([
  "node_modules",
  ".git",
  "assets/fonts",
  "assets/eco",
]);

const EXTENSIONS = new Set([
  ".html",
  ".css",
  ".js",
  ".mjs",
  ".ts",
  ".tsx",
  ".json",
  ".md",
  ".svg",
  ".txt",
]);

/* Files exempt by name, each with the reason written out. Nothing is exempt by
   pattern - a banned character anywhere else still fails. */
const EXEMPT = new Set([
  "scripts/check.mjs", // this file names the characters it is looking for
]);

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const rel = relative(ROOT, full).split("\\").join("/");
    if (SKIP_DIRS.has(entry) || SKIP_DIRS.has(rel)) continue;
    if (statSync(full).isDirectory()) walk(full, out);
    else if (EXTENSIONS.has(extname(entry))) out.push(full);
  }
  return out;
}

let hits = 0;
let scanned = 0;

for (const file of walk(ROOT)) {
  const rel = relative(ROOT, file).split("\\").join("/");
  if (EXEMPT.has(rel)) continue;
  scanned++;
  const text = readFileSync(file, "utf8");
  const lines = text.split(/\r?\n/);

  for (const [char, name] of BANNED) {
    lines.forEach((line, i) => {
      let at = line.indexOf(char);
      while (at !== -1) {
        hits++;
        console.log(
          rel + ":" + (i + 1) + "  " + name + "  " + line.trim().slice(0, 96),
        );
        at = line.indexOf(char, at + 1);
      }
    });
  }
  for (const [entity, name] of ENTITIES) {
    lines.forEach((line, i) => {
      if (line.includes(entity)) {
        hits++;
        console.log(
          rel + ":" + (i + 1) + "  " + name + "  " + line.trim().slice(0, 96),
        );
      }
    });
  }
}

if (hits) {
  console.log("");
  console.log(
    "FAIL  " + hits + " banned character(s) across " + scanned + " files",
  );
  process.exit(1);
}

console.log(
  "clean  " +
    (BANNED.length + ENTITIES.length) +
    " patterns checked across " +
    scanned +
    " files",
);
