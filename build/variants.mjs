// The five spinners. One entry per page.

export const SURFACE_LIGHT = "#F5F5F5";
export const SURFACE_DARK = "#070707";

/** The seven states a GenLayer transaction actually moves through. */
export const STATES = [
  "Pending",
  "Proposing",
  "Committing",
  "Leader revealing",
  "Revealing",
  "Accepted",
  "Finalized",
];

export const VARIANTS = [
  {
    slug: "converge",
    n: "01",
    name: "Converge",
    role: "The default",
    tagline:
      "The three parts of the mark fly in from three directions and lock into the finished logo.",
    lede: "Three parts arrive on their own and agree on one shape. The wait ends on the GenLayer mark, assembled, holding for four tenths of every loop.",
    why: "This is the protocol's own shape. Validators reason apart and a majority locks the result, so a loader built from parts that converge is not a metaphor bolted onto the logo - it is the logo doing the thing the network does. The assembled frame is the mark exactly as the brand kit draws it, which is why this one reads at 16px where the others do not.",
    accent: { name: "Kinetic Cobalt", light: "#110FFF", dark: "#4B49FF" },
    duration: "2s",
    easing: "cubic-bezier(.5, 0, .35, 1)",
    pieces: "3 polygons",
    nodes: 4,
    min: 16,
    max: 160,
    stage: 128,
    ladder: [16, 24, 32, 48, 64, 96, 128],
    where: "Everywhere. Buttons, fields, panels, route loads, full pages.",
    timeline: [
      ["0%", "Parts apart. Wings thrown 26 units out and 15 down, core 20 up, all three at 12% opacity."],
      ["30%", "Landed. Every part on its mark, full opacity, the logo complete."],
      ["70%", "Still complete. The mark holds for 40% of the loop, which is what makes it read as a logo and not as motion."],
      ["100%", "Back out to the first frame's position, so the loop closes on itself with no jump."],
    ],
    changed:
      "Nothing. The design's numbers already reserve exactly the throw distance: 26 of the mark's 100 units is .148em at the assembled mark's 70.4%, which is the padding to the tenth of a unit.",
    hasSvg: true,
    react: `import { GlLoader } from "@/components/ui/genlayer-loader"

<GlLoader size={96} />                       // route load
<GlLoader size={16} label="Submitting" />    // inside a pending button`,
  },

  {
    slug: "prism",
    n: "02",
    name: "Prism",
    role: "Hero and full page",
    tagline:
      "A wireframe cube breathes open around the mark and closes again, turning the whole time.",
    lede: "Six faces pull out to 1.76 times the cube's half-side and fade to 28%, then close back onto it. The mark sits at the centre, pulsing at half the loop, so it is never obscured.",
    why: "GenVM is the box a contract runs inside. A structure that opens, shows what it is holding, and closes again is that idea with nothing added: the mark is the payload and the cube is the sandbox. It needs room to breathe, so it belongs on a hero or a full page rather than in a toolbar.",
    accent: { name: "Kinetic Cobalt", light: "#110FFF", dark: "#4B49FF" },
    duration: "2.4s turn / 2.4s breath / 1.2s core",
    easing: "linear turn, ease-in-out breath",
    pieces: "6 faces + core",
    nodes: 14,
    min: 48,
    max: 160,
    stage: 128,
    ladder: [32, 48, 64, 96, 128, 160],
    where: "Route level and full page loads. 64px and up.",
    timeline: [
      ["0%", "Closed. Faces at half the cube's side, so the six of them meet as a cube. Full opacity. Core at 66%."],
      ["50%", "Open. Faces out to 1.76x, down to 28% opacity. Core at 104% and full opacity, so the mark is brightest when the shell is faintest."],
      ["100%", "Closed again."],
      ["throughout", "A constant 360 degree turn on Y, tilted 16 degrees, at a linear rate so the turn never appears to hesitate."],
    ],
    changed:
      "The cube was a slab. Faces sat at .5em on a .78em cube, which made the box 1em deep and .78em wide, and left the four sides half an em apart with gaps at the corners. Faces now sit at half the side. Perspective moved from 1100px to 11.5em, so the projection is identical at 16px and at 160px instead of flattening as the loader grows.",
    hasSvg: false,
    react: `import { GlLoader } from "@/components/ui/genlayer-loader"

<GlLoader variant="prism" size={128} />`,
  },

  {
    slug: "vault",
    n: "03",
    name: "Vault",
    role: "Marketing surfaces",
    tagline:
      "A solid block tumbles on one axis with the mark printed on four of its faces.",
    lede: "The symbol is on screen at every angle of the turn, because four faces carry it. A hard bar under the block stretches and fades as it passes, which is the only shadow in the set.",
    why: "Finality as a single object. A sealed block turning over is what a finalized transaction looks like if you had to draw one, and putting the mark on four faces means the brand never rotates out of view. The teal marks it as the one variant that is not the default.",
    accent: { name: "Deep Teal", light: "#008081", dark: "#00AAAB" },
    duration: "2.4s",
    easing: "cubic-bezier(.5, 0, .5, 1)",
    pieces: "6 faces + floor bar",
    nodes: 12,
    min: 56,
    max: 160,
    stage: 128,
    ladder: [32, 48, 64, 96, 128, 160],
    where: "Marketing and landing surfaces. 56px and up.",
    timeline: [
      ["0%", "Face on. The mark reads straight at the viewer."],
      ["25%", "A quarter turn. The next face's mark arrives as the first leaves."],
      ["50%", "Half turn, third face."],
      ["75%", "Three quarters, fourth face."],
      ["100%", "Back to the first face."],
      ["floor", "The bar under the block stretches to 1.5x and drops to 14% opacity at the halfway point, then returns."],
    ],
    changed:
      "Three things. The same slab bug as the prism, in a sharper form: .5em faces on a .5em block made the box twice as deep as it was wide, so the side faces never met the front, and faces now sit at a quarter of the footprint. The floor bar was a child of the block, which meant it inherited preserve-3d and pitched and rolled along with the thing it is supposed to be lying under, and it is now a sibling. The vanishing point moved to 50% 39%, because the padding under the block is larger than the padding above it and a centred origin was tilting the block upward.",
    hasSvg: false,
    react: `import { GlLoader } from "@/components/ui/genlayer-loader"

<GlLoader variant="vault" size={128} />`,
  },

  {
    slug: "ripple",
    n: "04",
    name: "Ripple",
    role: "Panels and cards",
    tagline:
      "Nine tiles clipped to the mark's silhouette fill in on a diagonal wave.",
    lede: "The tiles never leave the logo's outline, so the wave reads as the mark filling in rather than as nine loose squares. The one place a colour ramp survives, because the ramp is what makes the diagonal legible.",
    why: "Votes arriving one at a time until the shape is complete. The delays run 0, 100, 200 across the top row and step down from there, so the fill crosses the mark corner to corner in the order a quorum actually assembles. Clipping to the silhouette is the whole trick: without it this is a generic tile grid, with it it is the logo.",
    accent: { name: "Cobalt to Rose ramp", light: "#110FFF", dark: "#4A49FF" },
    duration: "1.5s",
    easing: "ease-in-out, 0 to 400ms stagger",
    pieces: "9 tiles, clipped",
    nodes: 12,
    min: 32,
    max: 128,
    stage: 128,
    ladder: [24, 32, 48, 64, 96, 128],
    where: "Panels, cards and tables. 32px and up.",
    timeline: [
      ["0%", "Every tile at 8%. The mark is present but unlit."],
      ["26%", "The tile peaks at full opacity."],
      ["62%", "Back to 8%, and it holds there until the loop restarts."],
      ["delays", "0 / 100 / 200 across the top row, 100 / 200 / 300 across the middle, 200 / 300 / 400 across the bottom, so the wave travels on the diagonal."],
    ],
    changed:
      "The nine fills moved out of the markup and into custom properties. The flat ramp measured 2.43, 2.57, 2.88 and 3.18 to one on Carbon Void for its first four tiles, so half the wave was invisible on a dark surface; a dark set now takes over and every tile clears 3:1. On a light surface the design's original nine are unchanged.",
    hasSvg: true,
    react: `import { GlLoader } from "@/components/ui/genlayer-loader"

<GlLoader variant="ripple" size={96} />`,
  },

  {
    slug: "honeycomb",
    n: "05",
    name: "Honeycomb",
    role: "Panels",
    tagline: "Six cells close around the mark on a tenth of a second stagger.",
    lede: "A ring of flat top hexagons scales in one after another while the mark at the centre counter-pulses on the same 2.1 second loop at half their amplitude.",
    why: "The validator set drawn around a single question. Six cells is the smallest ring that still reads as a ring, and the stagger going round rather than in and out is what makes it look like an assembly and not a heartbeat. Amber, so the one variant that is about the crowd rather than the result is not wearing the result's colour.",
    accent: { name: "Amber", light: "#B06F00", dark: "#ED990E" },
    duration: "2.1s",
    easing: "ease-in-out, 0 to 500ms stagger",
    pieces: "6 cells + core",
    nodes: 8,
    min: 40,
    max: 128,
    stage: 128,
    ladder: [24, 32, 48, 64, 96, 128],
    where: "Panels and cards. 40px and up.",
    timeline: [
      ["0%", "Cell at 34% scale, 10% opacity."],
      ["12%", "Cell at full size and full opacity."],
      ["62%", "Still full. Each cell holds half the loop."],
      ["100%", "Back down."],
      ["stagger", "0.1s between neighbours, going round the ring, so the close travels clockwise."],
      ["core", "The mark runs its own 2.1s loop from 80% to 100% scale, out of phase with the cells."],
    ],
    changed:
      "The ring is 2.83 cells wide and its box was 1em, so the comb painted 0.92em past its own footprint on each side and 1em above it - enough to sit on top of a neighbouring label at any size. The comb now runs at .3529em of the root, which puts the ring exactly 1em wide, and drops a quarter of its own em so the ring's centre lands on the box's centre rather than 0.25em above it.",
    hasSvg: false,
    react: `import { GlLoader } from "@/components/ui/genlayer-loader"

<GlLoader variant="honeycomb" size={96} />`,
  },
  {
    slug: "orbit",
    n: "06",
    name: "Orbit",
    role: "Ecosystem and landing",
    showcase: true,
    tagline:
      "GenLayer at the centre and nineteen ecosystem projects turning around it on five tilted rings.",
    lede: "The only one in the set that is not a general purpose spinner. Five rings on an ecliptic tilt, each turning at its own rate, with every project chip counter-spinning by exactly its ring's duration so no logo ever turns upside down.",
    why: "The rest of the set draws the protocol. This one draws who is on it. A full page load on an ecosystem or landing surface is the one moment a visitor will hold still long enough to read nineteen logos, so the wait becomes the pitch instead of an apology for it. Rings turn at 7, 9.5, 12, 15 and 18 seconds, which are deliberately not multiples of each other, so the arrangement never repeats itself inside a load anyone will sit through.",
    accent: { name: "Kinetic Cobalt", light: "#110FFF", dark: "#4B49FF" },
    duration: "7s to 18s per ring",
    easing: "linear, five rates",
    pieces: "5 rings, 19 chips",
    nodes: 62,
    min: 240,
    max: 640,
    stage: 340,
    ladder: [200, 300],
    where: "Ecosystem pages, landing pages, a marketing route load. 240px and up, never in a button.",
    timeline: [
      ["ring 1", "0.282em across, one revolution every 7s, 3 projects."],
      ["ring 2", "0.451em, 9.5s, 4 projects."],
      ["ring 3", "0.62em, 12s, 5 projects."],
      ["ring 4", "0.79em, 15s, 4 projects."],
      ["ring 5", "0.94em, 18s, 3 projects."],
      ["sweep", "A dashed circle counter-rotating on 22s, flat to the screen, so the tilted rings have something to read against."],
      ["centre", "The mark itself, breathing from 94% to 104% on 2.6s."],
      ["chips", "Each ring carries a static arm at the project's angle. The chip counter-spins by the ring's own duration and undoes both the 64 degree ecliptic tilt and the arm angle, so a logo is never upside down and never on its side."],
    ],
    changed:
      "The chips were sheared. Each one unwound the ecliptic tilt first and its own arm angle second, and rotations do not commute, so what was left on the image was Rx(64) Rz(deg) Rx(-64) Rz(-deg) - the identity only at 0 and 180 degrees. Every logo in between rendered as a tilted sliver. Unwinding in reverse, rotate(-deg) then rotateX(-64deg), cancels the chain exactly, and the accumulated matrix on every chip now measures as a pure translation. Two more: an `img { max-width: 100% }` in the host page, which is in Tailwind's preflight and in most other resets, clamped every chip to zero wide against the zero width point it hangs from, so the component now sets max-width itself. And the ring borders were carrying the rotation that walks the chips round, turning a square box that paints a circle to no effect; the border is static and a carrier inside it does the turn. Ring diameters came down to 0.78 of the footprint, because a ring tilted 64 degrees under a point projection paints wider than it measures, and perspective moved from 1600px to 4.2em so the tilt holds at any size.",
    hasSvg: false,
    react: `import { GlLoader, GlLoadingScreen } from "@/components/ui/genlayer-loader"

// the nineteen logos in public/eco, on the five default rings
<GlLoader variant="orbit" size={380} />

// or a full page load, with the status line under it
<GlLoadingScreen variant="orbit" size={380} />

// your own projects: each planet takes an angle on its ring,
// so a ring holds any number of them
<GlLoader
  variant="orbit"
  size={420}
  rings={[
    { d: 0.42, secs: 8, planets: [
      { src: "/eco/a.png", deg: 0,   size: 0.07 },
      { src: "/eco/b.png", deg: 180, size: 0.06 },
    ] },
  ]}
/>`,
  },
];

export const BY_SLUG = Object.fromEntries(VARIANTS.map((v) => [v.slug, v]));
