import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { VARIANTS, STATES, SURFACE_LIGHT, SURFACE_DARK } from "./variants.mjs";
import { loader, orbit, glyph, MARK, WING_L, WING_R, CORE, TILES } from "./mark.mjs";
import { page, section, codeBlock, esc } from "./template.mjs";
import { ratio } from "./color.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const CSS = readFileSync(join(ROOT, "assets", "genlayer-loader.css"), "utf8");

/* ---------- helpers ---------- */

/** Slice one commented block out of the shipped stylesheet, so every snippet
 *  on the site is the file people actually download and never a retyping. */
function cssSection(name) {
  const start = CSS.indexOf("/* ---------- " + name + " ----------");
  if (start === -1) throw new Error("no css section: " + name);
  const rest = CSS.indexOf("/* ---------- ", start + 10);
  return CSS.slice(start, rest === -1 ? CSS.length : rest).trimEnd();
}

/** Pretty-print the generated markup so the copy button hands over something
 *  a person would have written. */
function prettyHtml(html) {
  let out = "";
  let depth = 0;
  const parts = html.replace(/></g, ">\n<").split("\n");
  for (const raw of parts) {
    const line = raw.trim();
    if (!line) continue;
    if (/^<\//.test(line)) depth = Math.max(0, depth - 1);
    out += "  ".repeat(depth) + line + "\n";
    const opens =
      /^<[a-zA-Z]/.test(line) &&
      !/\/>$/.test(line) &&
      !/^<(img|br|hr|meta|link|input|use)\b/.test(line) &&
      !/<\/[a-zA-Z-]+>$/.test(line);
    if (opens) depth++;
  }
  return out.trimEnd();
}

function surfacePane(surface, html, label) {
  return (
    '<div class="stage-pane surface" data-gl-surface="' +
    surface +
    '"><span class="surface-label">' +
    esc(label) +
    "</span>" +
    html +
    "</div>"
  );
}

/* ---------- the band at the top of a variant page ---------- */

function variantBand(v) {
  const facts = [
    v.duration + " loop",
    v.pieces,
    v.min + " to " + v.max + "px",
    v.accent.name,
  ];
  return `<div class="band">
  <div class="shell">
    <p class="eyebrow">Portal spinner / variant ${v.n} of ${String(VARIANTS.length).padStart(2, "0")} / ${esc(v.role)}</p>
    <h1>${esc(v.name)}</h1>
    <p class="lede">${esc(v.lede)}</p>
    <div class="facts">${facts.map((f) => "<span>" + esc(f) + "</span>").join("")}</div>
  </div>
</div>`;
}

/* ---------- stage ---------- */

function stage(v) {
  const box = (surface) =>
    '<div class="stage-box" style="width:' +
    v.stage +
    "px;height:" +
    v.stage +
    'px">' +
    loader(v.slug, {
      size: v.stage,
      label: "Loading",
      klass: surface === "dark" ? "" : "",
    }) +
    "</div>";

  return `<div class="stage" data-stage>
  <div class="stage-panes">
    ${surfacePane("dark", box("dark"), "Carbon Void " + SURFACE_DARK)}
    ${surfacePane("light", box("light"), "Ceramic Node " + SURFACE_LIGHT)}
  </div>
  <div class="controls">
    <div class="ctl">
      <label for="size-${v.slug}">Size</label>
      <input id="size-${v.slug}" type="range" min="${v.min}" max="${v.max}" step="1" value="${v.stage}" data-size>
      <output data-size-out>${v.stage}px</output>
    </div>
    <div class="ctl">
      <span class="ctl-name">Colour</span>
      <div class="swatches">
        <button class="swatch" type="button" data-color="" aria-pressed="true" title="The variant's own pair" style="background:linear-gradient(135deg, ${v.accent.dark} 0 50%, ${v.accent.light} 50% 100%)"><span class="sr"></span></button>
        <button class="swatch" type="button" data-color="#110FFF" aria-pressed="false" title="Kinetic Cobalt #110FFF" style="background:#110FFF"></button>
        <button class="swatch" type="button" data-color="#00AAAB" aria-pressed="false" title="Teal #00AAAB" style="background:#00AAAB"></button>
        <button class="swatch" type="button" data-color="#ED990E" aria-pressed="false" title="Amber #ED990E" style="background:#ED990E"></button>
        <button class="swatch" type="button" data-color="#A9C719" aria-pressed="false" title="Chartreuse #A9C719" style="background:#A9C719"></button>
        <button class="swatch" type="button" data-color="currentColor" aria-pressed="false" title="Whatever the text is" style="background:linear-gradient(135deg,#F5F5F5 0 50%,#070707 50% 100%)"></button>
      </div>
    </div>
    <div class="ctl">
      <button class="btn" type="button" data-pause aria-pressed="false">Pause</button>
      <button class="btn" type="button" data-outline aria-pressed="false">Show the footprint</button>
    </div>
  </div>
</div>`;
}

/* ---------- ladder ---------- */

function ladder(v, surface) {
  const rungs = v.ladder
    .map(
      (px) =>
        '<div class="rung">' +
        loader(v.slug, { size: px, hidden: true }) +
        '<span class="n">' +
        px +
        "</span></div>",
    )
    .join("");
  return (
    '<div class="surface" data-gl-surface="' +
    surface +
    '"><div class="ladder">' +
    rungs +
    "</div></div>"
  );
}

/* ---------- footprint probe ---------- */

function probe(v) {
  return `<div class="probe" data-probe>
  <div class="surface" data-gl-surface="dark" style="padding:34px 20px">
    <div class="stage-box show-box" style="width:150px;height:150px">
      ${loader(v.slug, { size: 150, hidden: true, extra: "data-probe-target" })}
    </div>
  </div>
  <div class="probe-read">
    <p>The dashed square is exactly <b>font-size</b>. On load this page walks the
    whole loop in 48 steps, holds each frame with a negative animation delay,
    and unions every painted box in the loader. If any frame reached past the
    square, the number below would be over 1.000 and something in your layout
    would be getting painted on.</p>
    <div class="probe-nums">
      <div><span>widest frame, across</span><b data-probe-out="w">measuring</b></div>
      <div><span>widest frame, down</span><b data-probe-out="h">measuring</b></div>
      <div><span>loop sampled at</span><b data-probe-out="steps">48</b></div>
      <div><span>period</span><b data-probe-out="period">-</b></div>
      <div><span>measured at</span><b data-probe-out="size">-</b></div>
      <div><span>verdict</span><b data-probe-out="verdict">measuring</b></div>
    </div>
  </div>
</div>`;
}

/* ---------- in context ---------- */

function context(v) {
  if (v.showcase) {
    return `<div class="grid" style="grid-template-columns:minmax(0,1fr)">
  <div class="ctx">
    <h3>A full page load on an ecosystem surface</h3>
    <div class="mock" data-gl-surface="dark" style="min-height:420px;padding:36px 18px">
      <div class="gl-screen" data-states="${esc(STATES.join("|"))}" data-interval="1500">
        ${loader(v.slug, { size: "min(360px, 74vw)", hidden: true })}
        <p class="gl-screen-status" style="color:#9A9A9A"><span data-state-slot>${esc(STATES[0])}</span><span class="gl-screen-dots" style="color:#4B49FF"><i></i><i></i><i></i></span></p>
      </div>
    </div>
    <p class="note">${esc(v.where)} Nineteen chips is nineteen image requests, so
    every one of them is lazy loaded and decoded off the main thread. Nothing
    else in the set loads a single file.</p>
  </div>
</div>`;
  }

  const small = Math.max(v.min, 16);
  const mid = Math.max(v.min, 32);
  const big = Math.max(v.min, 96);

  const buttonMock =
    v.min <= 24
      ? `<div class="mock" data-gl-surface="light">
      <button class="mock-btn" type="button" disabled>${loader(v.slug, { size: 16, hidden: true })} Submitting</button>
    </div>`
      : `<div class="mock" data-gl-surface="light">
      <div class="mock-panel">${loader(v.slug, { size: small, hidden: true })}<span class="surface-label">too small for this one - use converge</span></div>
    </div>`;

  return `<div class="grid g3">
  <div class="ctx">
    <h3>Inline, in a pending button</h3>
    ${buttonMock}
    <p class="note">${
      v.min <= 24
        ? "16px, beside a label, on the Portal's own button. The loader's box is 16px square, so the label never shifts when it appears."
        : "This variant is not for button sizes. Its smallest honest size is " +
          v.min +
          "px, and converge is the one to reach for inline."
    }</p>
  </div>
  <div class="ctx">
    <h3>A panel waiting on data</h3>
    <div class="mock" data-gl-surface="light">
      <div class="mock-panel">
        ${loader(v.slug, { size: mid, hidden: true })}
        <div class="mock-row" style="color:#070707"><span class="mock-bar"></span><span class="mock-bar" style="width:70%"></span></div>
      </div>
    </div>
    <p class="note">${mid}px, centred in a card while its rows resolve.</p>
  </div>
  <div class="ctx">
    <h3>A route load</h3>
    <div class="mock" data-gl-surface="dark" style="min-height:190px">
      <div class="gl-screen" data-states="${esc(STATES.join("|"))}" data-interval="1400">
        ${loader(v.slug, { size: big, hidden: true })}
        <p class="gl-screen-status" style="color:#9A9A9A"><span data-state-slot>${esc(STATES[0])}</span><span class="gl-screen-dots" style="color:#4B49FF"><i></i><i></i><i></i></span></p>
      </div>
    </div>
    <p class="note">${big}px on Carbon Void, under the seven states a GenLayer
    transaction actually moves through. The loop stays in CSS and only the words
    are state, so the animation never restarts when the text changes.</p>
  </div>
</div>`;
}

/* ---------- loop timeline ---------- */

function timeline(v) {
  return (
    '<div class="loop">' +
    v.timeline
      .map(
        ([at, what]) =>
          '<div class="loop-row"><div class="loop-at">' +
          esc(at) +
          '</div><div class="loop-what">' +
          esc(what) +
          "</div></div>",
      )
      .join("") +
    "</div>"
  );
}

/* ---------- contrast ---------- */

function verdict(r) {
  return r >= 3
    ? '<span class="pass">passes 3:1</span>'
    : '<span class="fail">' + r + ":1, under 3:1</span>";
}

function contrastTable(v) {
  const rows = [
    {
      what: "This page's light value",
      hex: v.accent.light,
      on: SURFACE_LIGHT,
      onName: "Ceramic Node",
    },
    {
      what: "This page's dark value",
      hex: v.accent.dark,
      on: SURFACE_DARK,
      onName: "Carbon Void",
    },
  ];

  const body = rows
    .map((r) => {
      const n = ratio(r.hex, r.on);
      return (
        "<tr><td>" +
        esc(r.what) +
        '</td><td class="num"><span class="chip" style="background:' +
        r.hex +
        '"></span>' +
        r.hex.toUpperCase() +
        "</td><td>" +
        esc(r.onName) +
        ' ' +
        r.on +
        '</td><td class="num">' +
        n.toFixed(2) +
        ":1</td><td>" +
        verdict(n) +
        "</td></tr>"
      );
    })
    .join("");

  const cross = [
    {
      what: "The same light value, on Carbon Void",
      hex: v.accent.light,
      on: SURFACE_DARK,
      onName: "Carbon Void",
    },
    {
      what: "The same dark value, on Ceramic Node",
      hex: v.accent.dark,
      on: SURFACE_LIGHT,
      onName: "Ceramic Node",
    },
  ]
    .map((r) => {
      const n = ratio(r.hex, r.on);
      return (
        "<tr><td>" +
        esc(r.what) +
        '</td><td class="num"><span class="chip" style="background:' +
        r.hex +
        '"></span>' +
        r.hex.toUpperCase() +
        "</td><td>" +
        esc(r.onName) +
        " " +
        r.on +
        '</td><td class="num">' +
        n.toFixed(2) +
        ":1</td><td>" +
        verdict(n) +
        "</td></tr>"
      );
    })
    .join("");

  return `<div class="scroll-x"><table class="tbl">
  <thead><tr><th>Value</th><th>Hex</th><th>Surface</th><th>Ratio</th><th>WCAG 1.4.11</th></tr></thead>
  <tbody>${body}${cross}</tbody>
</table></div>`;
}

/* ---------- code ---------- */

function paletteNote() {
  return `/* genlayer-loader.css carries the palette. Both sets are in the file;
   mark a surface and the nearest one wins.

   <div data-gl-surface="dark"> ... the loader ... </div>

   With nothing marked, prefers-color-scheme picks. */`;
}

function codeFor(v, svgSource) {
  const html = prettyHtml(loader(v.slug, { size: v.stage }));
  const panes = [
    {
      key: "html",
      label: "HTML",
      code:
        '<link rel="stylesheet" href="genlayer-loader.css">\n\n' + html,
    },
    {
      key: "css",
      label: "CSS",
      code: paletteNote() + "\n\n" + cssSection(v.slug),
    },
    { key: "react", label: "React", code: v.react },
  ];
  if (svgSource) {
    panes.unshift({ key: "svg", label: "SVG", code: svgSource });
  }
  return codeBlock(panes);
}

/* ---------- standalone animated SVGs ---------- */

function convergeSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-21.1 -12.95 142.2 142.2" width="96" height="96" role="img" aria-label="Loading">
  <title>GenLayer loading</title>
  <style>
    .l, .r, .c { animation: 2s cubic-bezier(.5,0,.35,1) infinite; fill: #110FFF }
    .l { animation-name: l } .r { animation-name: r } .c { animation-name: c }
    @keyframes l {
      0%       { transform: translate(-26px, 15px); opacity: .12 }
      30%, 70% { transform: translate(0, 0);        opacity: 1 }
      100%     { transform: translate(-26px, 15px); opacity: .12 }
    }
    @keyframes r {
      0%       { transform: translate(26px, 15px);  opacity: .12 }
      30%, 70% { transform: translate(0, 0);        opacity: 1 }
      100%     { transform: translate(26px, 15px);  opacity: .12 }
    }
    @keyframes c {
      0%       { transform: translate(0, -20px);    opacity: .12 }
      30%, 70% { transform: translate(0, 0);        opacity: 1 }
      100%     { transform: translate(0, -20px);    opacity: .12 }
    }
    @media (prefers-color-scheme: dark) { .l, .r, .c { fill: #4B49FF } }
    @media (prefers-reduced-motion: reduce) {
      .l, .r, .c { animation: none; opacity: 1 }
    }
  </style>
  <polygon class="l" points="${WING_L}"/>
  <polygon class="r" points="${WING_R}"/>
  <polygon class="c" points="${CORE}"/>
</svg>
`;
}

function rippleSvg() {
  const light = [
    "#110FFF",
    "#3D14FA",
    "#6318F7",
    "#7D1FEF",
    "#9727E7",
    "#B11FCD",
    "#CA13B3",
    "#DA31A6",
    "#EA5098",
  ];
  const dark = [
    "#4A49FF",
    "#6241FB",
    "#7736F8",
    "#862FF0",
    "#9727E7",
    "#B11FCD",
    "#CA13B3",
    "#DA31A6",
    "#EA5098",
  ];
  const rects = TILES.map(
    (t, i) =>
      '  <rect class="t t' +
      (i + 1) +
      '" x="' +
      t.x +
      '" y="' +
      t.y +
      '" width="33.4" height="33.4" style="animation-delay:' +
      t.d +
      'ms"/>',
  ).join("\n");
  const fills = light.map((c, i) => "    .t" + (i + 1) + " { fill: " + c + " }").join("\n");
  const darkFills = dark
    .map((c, i) => "      .t" + (i + 1) + " { fill: " + c + " }")
    .join("\n");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="96" height="96" role="img" aria-label="Loading">
  <title>GenLayer loading</title>
  <style>
    .t { animation: wave 1.5s ease-in-out infinite }
${fills}
    @keyframes wave {
      0%        { opacity: .08 }
      26%       { opacity: 1 }
      62%, 100% { opacity: .08 }
    }
    @media (prefers-color-scheme: dark) {
${darkFills}
    }
    @media (prefers-reduced-motion: reduce) { .t { animation: none; opacity: 1 } }
  </style>
  <defs><clipPath id="m"><path d="${MARK}"/></clipPath></defs>
  <g clip-path="url(#m)">
${rects}
  </g>
</svg>
`;
}

/* ---------- pager ---------- */

function pager(i) {
  const prev = VARIANTS[(i - 1 + VARIANTS.length) % VARIANTS.length];
  const next = VARIANTS[(i + 1) % VARIANTS.length];
  return `<div class="shell"><div class="pager">
  <a href="${prev.slug}.html"><span class="dir">Previous</span><span class="to">${prev.n} ${esc(prev.name)}</span></a>
  <a href="${next.slug}.html"><span class="dir">Next</span><span class="to">${next.n} ${esc(next.name)}</span></a>
</div></div>`;
}

/* ---------- variant page ---------- */

function variantPage(v, i) {
  const svg =
    v.slug === "converge"
      ? convergeSvg()
      : v.slug === "ripple"
        ? rippleSvg()
        : null;

  const body = [
    section({
      eyebrow: "The stage",
      h2: "Both surfaces, side by side",
      sub:
        esc(v.tagline) +
        " Drag the size, swap the colour, hold the loop still, or draw the footprint the loader promises to stay inside.",
      html: stage(v),
    }),

    section({
      eyebrow: "Legibility",
      h2: "The sizes it is actually asked for",
      sub:
        "Same markup, one number changed. " +
        esc(v.where) +
        " Below its floor the geometry stops resolving, which is why each variant carries one.",
      html:
        '<div class="grid" style="grid-template-columns:minmax(0,1fr)">' +
        ladder(v, "dark") +
        (v.showcase ? "" : ladder(v, "light")) +
        "</div>",
    }),

    section({
      eyebrow: "Footprint",
      h2: "Measured in front of you, not claimed",
      sub: "",
      html: probe(v),
    }),

    section({
      eyebrow: "In context",
      h2: "Where it goes",
      sub: "",
      html: context(v),
    }),

    section({
      eyebrow: "The loop",
      h2: v.duration + ", closing on its own first frame",
      sub:
        "Easing is <span class=\"mono\">" +
        esc(v.easing) +
        "</span>. Nothing here uses JavaScript, so a stalled main thread does not stall the spinner.",
      html: timeline(v),
    }),

    section({
      eyebrow: "Contrast, measured",
      h2: "One hex cannot hold on both surfaces",
      sub:
        "WCAG 1.4.11 asks 3:1 of a graphic that carries meaning. A loading indicator carries meaning, so each hue ships as a pair and the nearest marked surface picks. The bottom two rows are what happens if you use the wrong one.",
      html: contrastTable(v),
    }),

    section({
      eyebrow: "The reasoning",
      h2: "Why this one is GenLayer",
      sub: "",
      html:
        '<div class="grid g2"><div class="cell"><p class="tag">The idea</p><h3>' +
        esc(v.name) +
        "</h3><p>" +
        esc(v.why) +
        '</p></div><div class="cell"><p class="tag">Changed from the design files</p><h3>What the port fixed</h3><p>' +
        esc(v.changed) +
        "</p></div></div>",
    }),

    section({
      eyebrow: "Take it",
      h2: "Three ways in, no dependencies in any of them",
      sub: svg
        ? 'This variant also exists as a single animated SVG file - <a href="download/genlayer-' +
          v.slug +
          '.svg" download>download it</a> and point an <span class="mono">img</span> at it, no CSS and no framework.'
        : "This variant is 3D CSS, so it does not reduce to a single SVG file. The stylesheet and the markup are the whole of it.",
      html: codeFor(v, svg),
    }),

    pager(i),
  ].join("\n\n");

  return page({
    title: v.name + " / GenLayer Portal spinner",
    description: v.tagline,
    active: v.slug,
    band: variantBand(v),
    body,
  });
}

/* ---------- index ---------- */

function indexBand() {
  return `<div class="band">
  <div class="shell">
    <p class="eyebrow">Community submission / Design the GenLayer Spinner</p>
    <h1>A loading system for the Portal, built out of the mark itself</h1>
    <p class="lede">Six spinners on one component and one variant prop. Each is
    drawn from the GenLayer symbol on its own 100 unit grid, animates in CSS
    alone, holds on Carbon Void and Ceramic Node, and scales from a button to a
    full page on a single number.</p>
    <div class="facts">
      <span>6 variants</span>
      <span>CSS animation, no JavaScript</span>
      <span>0 dependencies</span>
      <span>16px to full page</span>
      <span>reduced motion respected</span>
    </div>
  </div>
</div>`;
}

function indexCards() {
  return (
    '<div class="grid g3">' +
    VARIANTS.map((v) => {
      const spec = [
        v.duration,
        v.pieces,
        v.min + " to " + v.max + "px",
        v.accent.name,
      ].join(" / ");
      return (
        '<a class="card-link" href="' +
        v.slug +
        '.html">' +
        '<div class="card-seam">' +
        '<div class="surface" data-gl-surface="dark">' +
        loader(v.slug, { size: 84, hidden: true }) +
        "</div>" +
        '<div class="surface" data-gl-surface="light">' +
        loader(v.slug, { size: 84, hidden: true }) +
        "</div>" +
        "</div>" +
        '<div class="card-meta"><div class="head"><h3>' +
        v.n +
        " - " +
        esc(v.name) +
        '</h3><span class="role">' +
        esc(v.role) +
        "</span></div><p>" +
        esc(v.tagline) +
        '</p><div class="spec">' +
        esc(spec) +
        "</div></div></a>"
      );
    }).join("") +
    "</div>"
  );
}

const RULES = [
  [
    "R1",
    "The mark's own geometry",
    "Every shape in the set is traced from the GenLayer symbol on a 100 unit grid, not approximated. Where the logo appears it is the logo, to the tenth of a unit.",
  ],
  [
    "R2",
    "One flat colour each",
    "No gradients, no glows, no drop shadows carrying meaning. Depth is opacity. The one ramp that survives is the ripple's, because there the ramp is what makes the wave legible.",
  ],
  [
    "R3",
    "Hard edges only",
    "Zero border radius anywhere, squares rather than circles, and flat top hexagons cut with a single clip path rather than stacked triangles.",
  ],
  [
    "R4",
    "Sized by one number",
    "Every internal dimension is em, including the perspective, so one instance scales from 16px to 160px on font-size alone and the 3D variants project identically at both ends.",
  ],
  [
    "R5",
    "The footprint is the box",
    "Each variant reserves its own motion inside its own size as padding, so no frame of any loop ever paints on a neighbouring label. Every page measures this live.",
  ],
  [
    "R6",
    "Both surfaces, no second component",
    "Each hue ships as a light pair and a dark pair, chosen by the nearest marked surface or by prefers-color-scheme. Every value clears WCAG 1.4.11.",
  ],
  [
    "R7",
    "Loops close on their own first frame",
    "The last keyframe is the first, so there is no jump on repeat, and no loop is slower than 2.4s - a spinner that slow reads as a stalled request.",
  ],
  [
    "R8",
    "Nothing to wait on",
    "No npm package, no icon font, no JavaScript, and no image file in any of the five spinners. A loader that is waiting on a network request should not itself be waiting on one. Orbit is the exception and says so.",
  ],
];

function indexPage() {
  const body = [
    section({
      eyebrow: "The six",
      h2: "One component, one variant prop",
      sub: "Each has its own page: the stage on both surfaces, the size ladder, a live footprint measurement, the contexts it belongs in, the loop broken down frame by frame, and the code.",
      html: indexCards(),
    }),

    section({
      eyebrow: "The rules",
      h2: "What every one of them had to satisfy",
      sub: "",
      html:
        '<div class="grid g4">' +
        RULES.map(
          ([tag, h, p]) =>
            '<div class="cell"><p class="tag">' +
            tag +
            "</p><h3>" +
            esc(h) +
            "</h3><p>" +
            esc(p) +
            "</p></div>",
        ).join("") +
        "</div>",
    }),

    section({
      eyebrow: "The set, at a glance",
      h2: "Which one goes where",
      sub: "",
      html:
        '<div class="scroll-x"><table class="tbl"><thead><tr><th>Variant</th><th>Role</th><th>Loop</th><th>Size range</th><th>Accent, light</th><th>Accent, dark</th></tr></thead><tbody>' +
        VARIANTS.map(
          (v) =>
            "<tr><td><a href=\"" +
            v.slug +
            '.html">' +
            v.n +
            " " +
            esc(v.name) +
            "</a></td><td>" +
            esc(v.role) +
            '</td><td class="num">' +
            esc(v.duration) +
            '</td><td class="num">' +
            v.min +
            " to " +
            v.max +
            'px</td><td class="num"><span class="chip" style="background:' +
            v.accent.light +
            '"></span>' +
            v.accent.light +
            ' <span style="color:var(--mute)">' +
            ratio(v.accent.light, SURFACE_LIGHT).toFixed(2) +
            ':1</span></td><td class="num"><span class="chip" style="background:' +
            v.accent.dark +
            '"></span>' +
            v.accent.dark +
            ' <span style="color:var(--mute)">' +
            ratio(v.accent.dark, SURFACE_DARK).toFixed(2) +
            ":1</span></td></tr>",
        ).join("") +
        "</tbody></table></div>",
    }),

    section({
      eyebrow: "The one that is not a spinner",
      h2: "Orbit",
      sub: "GenLayer at the centre and nineteen ecosystem projects on five rings, each chip counter-spinning by its ring's own duration so no project logo ever turns upside down. Not a general-purpose spinner: it wants 240px or more and it loads one image per project, so it belongs on an ecosystem or landing page and never in a button. It has <a href='orbit.html'>its own page</a> like the rest, and it is the only thing in the repository that loads a file.",
      html:
        '<div class="showcase" data-gl-surface="dark">' +
        '<div class="gl-screen" data-states="' +
        esc(STATES.join("|")) +
        '" data-interval="1500">' +
        orbit() +
        '<p class="gl-screen-status"><span data-state-slot>' +
        esc(STATES[0]) +
        '</span><span class="gl-screen-dots"><i></i><i></i><i></i></span></p>' +
        "</div></div>",
    }),

    section({
      eyebrow: "Install",
      h2: "Two files, or one",
      sub: "",
      html: codeBlock([
        {
          key: "css",
          label: "Plain HTML",
          code: `<!-- one stylesheet, then the markup for the variant you want -->
<link rel="stylesheet" href="genlayer-loader.css">

<span class="gl gl--converge" role="status" aria-label="Loading"
      style="font-size:96px">
  <svg class="gl-cv" viewBox="0 0 100 100" aria-hidden="true">
    <polygon class="gl-cv-l" points="${WING_L}"/>
    <polygon class="gl-cv-r" points="${WING_R}"/>
    <polygon class="gl-cv-c" points="${CORE}"/>
  </svg>
</span>`,
        },
        {
          key: "react",
          label: "React",
          code: `// components/ui/genlayer-loader.tsx + genlayer-loader.css
import { GlLoader, GlLoadingScreen } from "@/components/ui/genlayer-loader"

<GlLoader size={96} />                          // converge, the default
<GlLoader variant="prism" size={128} />
<GlLoader size={16} label="Submitting" />       // inside a pending button

// app/loading.tsx
export default function Loading() {
  return <GlLoadingScreen size={96} />
}`,
        },
        {
          key: "shadcn",
          label: "shadcn",
          code: `npx shadcn@latest add https://<this-repo>/registry/genlayer-loader.json

# reads components.json, drops the component at your components/ui alias
# and copies the stylesheet next to it`,
        },
        {
          key: "img",
          label: "No build step",
          code: `<!-- converge and ripple are also single animated SVG files -->
<img src="genlayer-converge.svg" width="48" height="48" alt="Loading">
<img src="genlayer-ripple.svg" width="48" height="48" alt="Loading">

<!-- both carry their own prefers-color-scheme and
     prefers-reduced-motion rules inside the file -->`,
        },
      ]),
    }),

    section({
      eyebrow: "Accessibility",
      h2: "What it does when motion is unwelcome",
      sub: "",
      html: `<div class="grid g3">
  <div class="cell"><p class="tag">Reduced motion</p><h3>Every loop stops</h3><p>Under prefers-reduced-motion the animations are cancelled and each variant settles on a readable still: the mark assembled, the cube closed, the tiles lit. Only the transforms that were animated are neutralised, so the six faces of the prism and the vault do not collapse onto one plane and the honeycomb does not slide off centre.</p></div>
  <div class="cell"><p class="tag">Screen readers</p><h3>One status, not seven</h3><p>The root carries role=status and an accessible name; every shape inside is aria-hidden. A loading screen wraps that in aria-live=polite so the state line is announced as it changes rather than the geometry.</p></div>
  <div class="cell"><p class="tag">Contrast</p><h3>Measured, not asserted</h3><p>Every accent in the set is published with its ratio against both surfaces, and each variant page recomputes them at build time from the same file the stylesheet uses, so a value cannot drift away from its published number.</p></div>
</div>`,
    }),
  ].join("\n\n");

  return page({
    title: "GenLayer Portal spinner / six variants",
    description:
      "Six animated loading spinners built from the GenLayer mark. CSS only, no dependencies, light and dark, 16px to a full page.",
    active: "index",
    band: indexBand(),
    body,
  });
}

/* ---------- write ---------- */

mkdirSync(join(ROOT, "download"), { recursive: true });

writeFileSync(join(ROOT, "index.html"), indexPage());
VARIANTS.forEach((v, i) => {
  writeFileSync(join(ROOT, v.slug + ".html"), variantPage(v, i));
});
writeFileSync(join(ROOT, "download", "genlayer-converge.svg"), convergeSvg());
writeFileSync(join(ROOT, "download", "genlayer-ripple.svg"), rippleSvg());
writeFileSync(join(ROOT, "src", "genlayer-loader.css"), CSS);

console.log(
  "built index.html + " +
    VARIANTS.map((v) => v.slug + ".html").join(", ") +
    " + 2 standalone svg",
);
