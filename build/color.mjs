// WCAG relative luminance and contrast, plus the lift used to move a brand
// hue onto a surface it does not clear. No dependencies.

export function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

export function rgbToHex([r, g, b]) {
  const c = (n) =>
    Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
  return "#" + c(r) + c(g) + c(b);
}

function channel(v) {
  const s = v / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

export function luminance(hex) {
  const [r, g, b] = hexToRgb(hex);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrast(a, b) {
  const la = luminance(a);
  const lb = luminance(b);
  const hi = Math.max(la, lb);
  const lo = Math.min(la, lb);
  return (hi + 0.05) / (lo + 0.05);
}

export function ratio(a, b) {
  return Math.round(contrast(a, b) * 100) / 100;
}

/**
 * Walk a colour toward white (or toward black) in 1% steps until it clears
 * `target` against `surface`. Hue is preserved because the walk is a straight
 * line in sRGB toward the surface's opposite, which is what a tint or a shade
 * of the same ink is.
 */
export function lift(hex, surface, target = 3) {
  const towardWhite = luminance(surface) < 0.5;
  const [r, g, b] = hexToRgb(hex);
  const end = towardWhite ? [255, 255, 255] : [0, 0, 0];
  for (let t = 0; t <= 100; t++) {
    const mix = rgbToHex([
      r + (end[0] - r) * (t / 100),
      g + (end[1] - g) * (t / 100),
      b + (end[2] - b) * (t / 100),
    ]);
    if (contrast(mix, surface) >= target) return mix;
  }
  return towardWhite ? "#FFFFFF" : "#000000";
}
