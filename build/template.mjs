import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

import { VARIANTS } from "./variants.mjs";
import { glyph, MARK } from "./mark.mjs";

export function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* Short content hashes on the three assets, so a redeploy is never served
   from a stale cache. */
const ASSETS = fileURLToPath(new URL("../assets/", import.meta.url));
const stamp = (name) =>
  name +
  "?v=" +
  createHash("sha1").update(readFileSync(join(ASSETS, name))).digest("hex").slice(0, 8);

export const SITE_CSS = stamp("site.css");
export const LOADER_CSS = stamp("genlayer-loader.css");
export const SITE_JS = stamp("site.js");

const FAVICON =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path fill="#110FFF" d="' +
      MARK +
      '"/></svg>',
  );

function nav(active) {
  const items = [
    { href: "index.html", label: "Overview", key: "index" },
    ...VARIANTS.map((v) => ({
      href: v.slug + ".html",
      label: v.n + " " + v.name,
      key: v.slug,
    })),
  ];
  return items
    .map(
      (i) =>
        '<a href="' +
        i.href +
        '"' +
        (i.key === active ? ' aria-current="page"' : "") +
        ">" +
        esc(i.label) +
        "</a>",
    )
    .join("");
}

export function page({
  title,
  description,
  active,
  band,
  body,
  bodyClass = "",
}) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="color-scheme" content="light dark">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:type" content="website">
<link rel="icon" href="${FAVICON}">
<link rel="preload" href="assets/fonts/space-grotesk-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="assets/${SITE_CSS}">
<link rel="stylesheet" href="assets/${LOADER_CSS}">
<script>try{var t=localStorage.getItem('gl-theme');if(t)document.documentElement.setAttribute('data-theme',t)}catch(e){}</script>
</head>
<body${bodyClass ? ' class="' + bodyClass + '"' : ""}>
<a class="skip" href="#main">Skip to content</a>

<header class="site-head">
  <div class="shell">
    <a class="brand" href="index.html">${glyph(17)} GenLayer Spinner</a>
    <nav class="site-nav" aria-label="Spinners">${nav(active)}</nav>
    <button class="theme-toggle" type="button">Dark</button>
  </div>
</header>

${band}

<main id="main">
${body}
</main>

<footer class="site-foot">
  <div class="shell">
    <p class="mono">GenLayer Portal spinner mission / submission</p>
    <p>Built from the GenLayer mark on its own 100 unit grid. The symbol and the
    palette belong to GenLayer. Code is MIT.</p>
  </div>
</footer>

<script src="assets/${SITE_JS}" defer></script>
</body>
</html>
`;
}

export function section({ eyebrow, h2, sub, html }) {
  return `<section class="sec">
  <div class="shell">
    ${eyebrow ? '<p class="eyebrow">' + esc(eyebrow) + "</p>" : ""}
    ${h2 ? "<h2>" + esc(h2) + "</h2>" : ""}
    ${sub ? '<p class="sub">' + sub + "</p>" : ""}
    ${html}
  </div>
</section>`;
}

export function codeBlock(panes) {
  const tabs = panes
    .map(
      (p, i) =>
        '<button class="code-tab" type="button" role="tab" data-tab="' +
        p.key +
        '" aria-selected="' +
        (i === 0) +
        '">' +
        esc(p.label) +
        "</button>",
    )
    .join("");
  const bodies = panes
    .map(
      (p, i) =>
        '<div data-pane="' +
        p.key +
        '"' +
        (i === 0 ? "" : " hidden") +
        "><pre><code>" +
        esc(p.code) +
        "</code></pre></div>",
    )
    .join("");
  return `<div class="code">
  <div class="code-tabs" role="tablist">${tabs}</div>
  <div class="code-body">
    <button class="copy" type="button">Copy</button>
    ${bodies}
  </div>
</div>`;
}
