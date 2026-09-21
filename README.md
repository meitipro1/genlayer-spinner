# GenLayer Portal spinner

Six animated loading indicators built from the GenLayer mark, submitted to the
Portal spinner mission.

**https://meitipro.github.io/genlayer-spinner/**

Every shape in the set is traced from the GenLayer symbol on its own 100 unit
grid. The animation is CSS. There is no JavaScript in any loader, no npm
package, no icon font, and no image file in any of the five general purpose
variants.

| | Variant | Role | Loop | Size | Accent, light | Accent, dark |
| --- | --- | --- | --- | --- | --- | --- |
| 01 | [Converge](https://meitipro.github.io/genlayer-spinner/converge.html) | the default, everywhere | 2s | 16 to 160px | `#110FFF` 7.59:1 | `#4B49FF` 3.55:1 |
| 02 | [Prism](https://meitipro.github.io/genlayer-spinner/prism.html) | hero and full page | 2.4s | 48 to 160px | `#110FFF` 7.59:1 | `#4B49FF` 3.55:1 |
| 03 | [Vault](https://meitipro.github.io/genlayer-spinner/vault.html) | marketing surfaces | 2.4s | 56 to 160px | `#008081` 4.37:1 | `#00AAAB` 7.04:1 |
| 04 | [Ripple](https://meitipro.github.io/genlayer-spinner/ripple.html) | panels and cards | 1.5s | 32 to 128px | `#110FFF` 7.59:1 | `#4A49FF` 3.54:1 |
| 05 | [Honeycomb](https://meitipro.github.io/genlayer-spinner/honeycomb.html) | panels | 2.1s | 40 to 128px | `#B06F00` 3.76:1 | `#ED990E` 8.79:1 |
| 06 | [Orbit](https://meitipro.github.io/genlayer-spinner/orbit.html) | ecosystem and landing | 7s to 18s | 240 to 640px | `#110FFF` 7.59:1 | `#4B49FF` 3.55:1 |

Converge is the one intended for general use across the Portal. It is the only
variant whose geometry still resolves at 16px, and its assembled frame is the
mark itself, held for 40% of every loop.

Orbit is not a general purpose spinner. It places GenLayer at the centre with
nineteen ecosystem projects on five tilted rings, each chip counter spinning by
exactly its ring's duration so no logo ever inverts. It requires 240px or more
and it is the only variant that loads files.

## Construction

**One number.** Every internal dimension is `em`, including the perspective on
the three 3D variants, so a single instance scales from 16px to 160px and
projects identically at both ends.

**The footprint is the box.** Each variant reserves the room its own motion
needs inside its own `font-size`, as padding. No frame of any loop paints
outside the box the layout gave it. Each page measures this in the browser at
load: it walks the loop in 48 steps, holds every frame with a negative
animation delay, unions every painted box, and prints the result against 1.000.

| Variant | Widest frame, across | Down |
| --- | --- | --- |
| Converge | 1.001 | 0.761 |
| Prism | 0.956 | 0.967 |
| Vault | 0.750 | 0.959 |
| Ripple | 1.000 | 1.000 |
| Honeycomb | 1.000 | 0.882 |
| Orbit | 0.960 | 0.960 |

**One flat colour each.** No gradients, no glows, no drop shadows carrying
meaning. Depth is opacity. The single ramp that survives is the ripple's,
because there the ramp is what makes the diagonal legible.

**Hard edges.** Zero border radius, squares rather than circles, flat top
hexagons cut with a single clip path.

**Loops close on their own first frame,** so there is no jump on repeat, and
nothing runs slower than 2.4s.

## Colour

Kinetic Cobalt `#110FFF` is GenLayer's single brand accent and the default. No
one hex clears 3:1 on both Carbon Void `#070707` and Ceramic Node `#F5F5F5`, so
each hue is published twice with its measured ratio.

| Hue | Light surface | on `#F5F5F5` | Dark surface | on `#070707` |
| --- | --- | --- | --- | --- |
| Kinetic Cobalt | `#110FFF` | 7.59:1 | `#4B49FF` | 3.55:1 |
| Teal | `#008081` | 4.37:1 | `#00AAAB` | 7.04:1 |
| Amber | `#B06F00` | 3.76:1 | `#ED990E` | 8.79:1 |

Brand cobalt on Carbon Void measures 2.43:1, below the 3:1 floor WCAG 1.4.11
sets for a graphic that carries meaning, which is why the dark value lifts.
Mark a surface and the nearest set applies to everything inside it:

```html
<div data-gl-surface="dark"> ... </div>
```

A project that marks nothing gets the correct set from `prefers-color-scheme`.
These are custom properties rather than selector overrides, so the nearest
marked ancestor wins and a light panel inside a dark page is one attribute at
any depth.

The geometry uses `currentColor` throughout, so `color` on the root or on any
ancestor overrides all of it.

## Accessibility

`role="status"` and an accessible name sit on the root; every shape inside is
`aria-hidden`. The loading screen wraps that in `aria-live="polite"` so the
status line is announced as it changes rather than the geometry.

Under `prefers-reduced-motion` every loop stops and each variant settles on a
readable still. Only the transforms that were animated are neutralised, so the
prism and vault faces do not collapse onto one plane and the honeycomb ring
does not shift off centre.

## Implementation

One stylesheet, then the markup for the variant.

```html
<link rel="stylesheet" href="genlayer-loader.css">

<span class="gl gl--converge" role="status" aria-label="Loading"
      style="font-size:96px">
  <svg class="gl-cv" viewBox="0 0 100 100" aria-hidden="true">
    <polygon class="gl-cv-l" points="45.8,8.2 45.8,37.9 30.4,69.9 44.9,77.5 4.9,93.1"/>
    <polygon class="gl-cv-r" points="54.2,8.2 95.1,93.1 55.1,77.5 69.6,69.9 54.2,37.9"/>
    <polygon class="gl-cv-c" points="50,48.7 58.8,66.4 50,70.8 41.2,66.4"/>
  </svg>
</span>
```

`src/genlayer-loader.tsx` is the same set as a React component with a `variant`
prop, and `registry/` carries a shadcn registry item pointing at it. Converge
and Ripple also exist as single animated SVG files in `download/`, each
carrying its own `prefers-color-scheme` and `prefers-reduced-motion` rules.

| Where | Size |
| --- | --- |
| Route or page load | 96 to 128px |
| Panel, table, card | 32 to 48px |
| Button, inline field | 16 to 24px |

## Corrections to the source component

Eight defects were found and fixed while measuring the set.

- **Prism was a slab.** Faces sat at `.5em` on a `.78em` cube, making the box
  1em deep and .78em wide, with the four sides half an em apart and gaps at the
  corners. Faces now sit at half the side.
- **Vault had the same defect, more visibly.** `.5em` faces on a `.5em` block
  produced a box twice as deep as it was wide, so the side faces never met the
  front.
- **The vault's floor bar tumbled with the block.** It was a child of the
  rotating element, so it inherited `preserve-3d` and pitched and rolled along
  with the object it is meant to lie under. It is a sibling now.
- **Honeycomb painted outside its own box.** The ring is 2.83 cells wide inside
  a 1em box, so it reached 0.92em past its footprint on each side and 1em above
  it, enough to overlap a neighbouring label at any size.
- **The ripple's ramp was invisible on dark surfaces.** Its first four tiles
  measured 2.43, 2.57, 2.88 and 3.18 to one against Carbon Void, so half the
  wave was not there. A dark ramp now takes over and every tile clears 3:1.
- **Orbit's chips were sheared into slivers.** Each one unwound the ecliptic
  tilt first and its own arm angle second. Rotations do not commute, so what
  remained on the image was `Rx(64) Rz(deg) Rx(-64) Rz(-deg)`, the identity only
  at 0 and 180 degrees; every logo in between rendered as a tilted sliver.
  Unwinding in reverse, `rotate(-deg)` then `rotateX(-64deg)`, cancels the chain
  exactly, and the accumulated matrix on every chip now measures as a pure
  translation.
- **Orbit's chips collapsed to zero width under a common CSS reset.** They hang
  from a zero by zero point on the ring, so an `img { max-width: 100% }` in the
  host page, which is in Tailwind's preflight and in most other resets, clamped
  each one to nothing while leaving its height alone. The component sets its own
  `max-width` now rather than asking the project not to.
- **Orbit's ring borders carried the rotation** that walks the chips around, so
  a square box painting a circle turned with them to no effect. The border is
  static and a carrier inside it does the turn. Ring diameters also came down to
  0.78 of the footprint, because a ring tilted 64 degrees under a point
  projection paints wider than it measures.

Perspective moved from `px` to `em` on all three 3D variants, so a loader
projects identically at every size rather than flattening as it grows.

## Licence

MIT. The GenLayer symbol and palette belong to GenLayer.
