// The GenLayer mark, traced onto a 100 x 100 grid, and the markup each
// variant needs. Every page renders from here, so the five demos, the size
// ladders and the copyable snippets can never drift apart.

export const WING_L = "45.8,8.2 45.8,37.9 30.4,69.9 44.9,77.5 4.9,93.1";
export const WING_R = "54.2,8.2 95.1,93.1 55.1,77.5 69.6,69.9 54.2,37.9";
export const CORE = "50,48.7 58.8,66.4 50,70.8 41.2,66.4";

export const MARK =
  "M45.8 8.2 45.8 37.9 30.4 69.9 44.9 77.5 4.9 93.1Z " +
  "M54.2 8.2 95.1 93.1 55.1 77.5 69.6 69.9 54.2 37.9Z " +
  "M50 48.7 58.8 66.4 50 70.8 41.2 66.4Z";

/** The brief's diagonal delays: 0 1 2 / 1 2 3 / 2 3 4 */
export const TILES = [
  { x: 0, y: 0, d: 0 },
  { x: 33.3, y: 0, d: 100 },
  { x: 66.6, y: 0, d: 200 },
  { x: 0, y: 33.3, d: 100 },
  { x: 33.3, y: 33.3, d: 200 },
  { x: 66.6, y: 33.3, d: 300 },
  { x: 0, y: 66.6, d: 200 },
  { x: 33.3, y: 66.6, d: 300 },
  { x: 66.6, y: 66.6, d: 400 },
];

let clipSeq = 0;

/**
 * Markup for one loader.
 *
 * @param {string} variant  converge | prism | vault | ripple | honeycomb
 * @param {object} opts     size (px or css length), label, klass, style, aria
 */
export function loader(variant, opts = {}) {
  const {
    size = 96,
    label = "Loading",
    klass = "",
    hidden = false,
    style = "",
    extra = "",
  } = opts;

  const fontSize = typeof size === "number" ? size + "px" : size;
  const cls = ["gl", "gl--" + variant, klass].filter(Boolean).join(" ");
  const attrs = hidden
    ? 'aria-hidden="true"'
    : 'role="status" aria-label="' + label + '"';
  const css = "font-size:" + fontSize + (style ? ";" + style : "");

  if (variant === "orbit") {
    return orbit({ size, attrs, extra, style });
  }

  return (
    '<span class="' +
    cls +
    '" ' +
    attrs +
    (extra ? " " + extra : "") +
    ' style="' +
    css +
    '">' +
    body(variant) +
    "</span>"
  );
}

function body(variant) {
  if (variant === "converge") {
    return (
      '<svg class="gl-cv" viewBox="0 0 100 100" aria-hidden="true">' +
      '<polygon class="gl-cv-l" points="' +
      WING_L +
      '"/>' +
      '<polygon class="gl-cv-r" points="' +
      WING_R +
      '"/>' +
      '<polygon class="gl-cv-c" points="' +
      CORE +
      '"/>' +
      "</svg>"
    );
  }

  if (variant === "prism") {
    return (
      '<span class="gl-cube">' +
      '<svg class="gl-core" viewBox="0 0 100 100" aria-hidden="true"><path d="' +
      MARK +
      '"/></svg>' +
      '<span class="gl-side"><i></i></span>'.repeat(6) +
      "</span>"
    );
  }

  if (variant === "vault") {
    const face =
      '<span class="gl-facet"><svg viewBox="0 0 100 100" aria-hidden="true"><path d="' +
      MARK +
      '"/></svg></span>';
    return (
      '<span class="gl-box">' +
      face.repeat(4) +
      '<span class="gl-facet"></span><span class="gl-facet"></span>' +
      "</span>" +
      '<span class="gl-shadow"></span>'
    );
  }

  if (variant === "ripple") {
    const id = "glclip" + ++clipSeq;
    const rects = TILES.map(
      (t) =>
        '<rect class="gl-tile" x="' +
        t.x +
        '" y="' +
        t.y +
        '" width="33.4" height="33.4" style="animation-delay:' +
        t.d +
        'ms"/>',
    ).join("");
    return (
      '<svg viewBox="0 0 100 100" aria-hidden="true">' +
      '<defs><clipPath id="' +
      id +
      '"><path d="' +
      MARK +
      '"/></clipPath></defs>' +
      '<g clip-path="url(#' +
      id +
      ')">' +
      rects +
      "</g>" +
      "</svg>"
    );
  }

  if (variant === "honeycomb") {
    return (
      '<span class="gl-comb">' +
      "<i></i>".repeat(6) +
      '<svg class="gl-comb-core" viewBox="0 0 100 100" aria-hidden="true"><path d="' +
      MARK +
      '"/></svg>' +
      "</span>"
    );
  }

  throw new Error("unknown variant: " + variant);
}

/** The five rings of the orbit showcase, in the design's own proportions.
 *  Diameters are scaled to 0.78 of the footprint: the rings are tilted 64
 *  degrees under a point projection, so the near half of each comes toward the
 *  viewer and paints wider than the ring measures, and the chips ride centred
 *  on the ring with half their own width hanging outside it. */
export const RINGS = [
  {
    d: 0.234,
    secs: 7,
    planets: [
      { n: "01", deg: 0, size: 0.062 },
      { n: "02", deg: 120, size: 0.055 },
      { n: "03", deg: 240, size: 0.058 },
    ],
  },
  {
    d: 0.374,
    secs: 9.5,
    planets: [
      { n: "04", deg: 35, size: 0.07 },
      { n: "05", deg: 125, size: 0.06 },
      { n: "06", deg: 215, size: 0.062 },
      { n: "07", deg: 305, size: 0.058 },
    ],
  },
  {
    d: 0.515,
    secs: 12,
    planets: [
      { n: "08", deg: 10, size: 0.066 },
      { n: "09", deg: 82, size: 0.058 },
      { n: "10", deg: 154, size: 0.062 },
      { n: "11", deg: 226, size: 0.058 },
      { n: "12", deg: 298, size: 0.06 },
    ],
  },
  {
    d: 0.656,
    secs: 15,
    planets: [
      { n: "13", deg: 50, size: 0.06 },
      { n: "14", deg: 140, size: 0.056 },
      { n: "15", deg: 230, size: 0.062 },
      { n: "16", deg: 320, size: 0.056 },
    ],
  },
  {
    d: 0.78,
    secs: 18,
    planets: [
      { n: "17", deg: 20, size: 0.056 },
      { n: "18", deg: 140, size: 0.058 },
      { n: "19", deg: 260, size: 0.054 },
    ],
  },
];

export function orbit({
  size = "min(380px, 74vw)",
  base = "assets/eco/",
  attrs = 'aria-hidden="true"',
  extra = "",
  style = "",
} = {}) {
  const rings = RINGS.map((ring) => {
    const arms = ring.planets
      .map(
        (p) =>
          '<span class="gl-orbit-arm" style="transform:rotate(' +
          p.deg +
          'deg)">' +
          '<span class="gl-orbit-hold" style="animation-duration:' +
          ring.secs +
          's">' +
          '<img src="' +
          base +
          p.n +
          '.png" alt="" decoding="async" fetchpriority="low" style="width:' +
          p.size +
          "em;height:" +
          p.size +
          "em;margin:" +
          -p.size / 2 +
          "em;transform:rotate(" +
          -p.deg +
          'deg) rotateX(-64deg)">' +
          "</span></span>",
      )
      .join("");
    return (
      '<span class="gl-orbit-ring" style="width:' +
      ring.d +
      "em;height:" +
      ring.d +
      'em">' +
      '<span class="gl-orbit-spin" style="animation-duration:' +
      ring.secs +
      's">' +
      arms +
      "</span></span>"
    );
  }).join("");

  return (
    '<span class="gl gl--orbit" ' +
    attrs +
    (extra ? " " + extra : "") +
    ' style="font-size:' +
    (typeof size === "number" ? size + "px" : size) +
    (style ? ";" + style : "") +
    '">' +
    '<span class="gl-orbit">' +
    '<span class="gl-orbit-sweep"></span>' +
    rings +
    '<svg class="gl-orbit-sun" viewBox="0 0 100 100"><path d="' +
    MARK +
    '"/></svg>' +
    "</span></span>"
  );
}

/** The GenLayer mark as a plain, still glyph - used for the site chrome. */
export function glyph(size = 20, cls = "glyph") {
  return (
    '<svg class="' +
    cls +
    '" viewBox="0 0 100 100" width="' +
    size +
    '" height="' +
    size +
    '" aria-hidden="true"><path d="' +
    MARK +
    '"/></svg>'
  );
}
