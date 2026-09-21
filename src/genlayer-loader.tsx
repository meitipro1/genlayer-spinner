"use client"

import * as React from "react"

/**
 * GenLayer loader - community submission for the Portal spinner mission.
 *
 * The geometry is the GenLayer symbol itself, traced from the source mark onto
 * a 100 x 100 grid. Nothing else is drawn: one flat accent, no gradients, no
 * glows, no images, no npm dependencies.
 *
 * Size is driven by a single number. Every internal dimension is em or a
 * percentage, so one instance scales from 16px to 160px, and `size` is the
 * loader's whole footprint at every frame of every loop.
 *
 * Colour comes from `currentColor`. genlayer-loader.css ships a light pair and
 * a dark pair for each hue; mark a surface with `data-gl-surface="dark"` and
 * the nearest one wins.
 */

/** The three parts of the mark, as separate polygons. */
export const WING_L = "45.8,8.2 45.8,37.9 30.4,69.9 44.9,77.5 4.9,93.1"
export const WING_R = "54.2,8.2 95.1,93.1 55.1,77.5 69.6,69.9 54.2,37.9"
export const CORE = "50,48.7 58.8,66.4 50,70.8 41.2,66.4"

/** The whole mark as one path - handy for clip paths and fills. */
export const MARK =
  "M45.8 8.2 45.8 37.9 30.4 69.9 44.9 77.5 4.9 93.1Z " +
  "M54.2 8.2 95.1 93.1 55.1 77.5 69.6 69.9 54.2 37.9Z " +
  "M50 48.7 58.8 66.4 50 70.8 41.2 66.4Z"

export type GlLoaderVariant =
  | "converge"
  | "prism"
  | "vault"
  | "ripple"
  | "honeycomb"
  | "orbit"

export interface GlLoaderProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Which motion to use. Default "converge". */
  variant?: GlLoaderVariant
  /** Rendered size in px, and the loader's whole footprint. Default 48. */
  size?: number
  /** Accessible name announced to screen readers. Default "Loading". */
  label?: string
  /**
   * Only used by variant="orbit": the ecosystem logos to put in orbit,
   * innermost ring first. Pass your own paths; the defaults assume the files
   * shipped in public/eco.
   */
  rings?: OrbitRing[]
}

/** One orbital ring: its diameter as a fraction of `size`, how long a full
 *  revolution takes, and the logos riding on it. */
export interface OrbitRing {
  /** Ring diameter, 0 to 1, as a fraction of `size`. */
  d: number
  /** Seconds per revolution. */
  secs: number
  planets: Array<{
    src: string
    /** Angle on the ring in degrees, 0 = east, clockwise. */
    deg: number
    /** Chip size, as a fraction of `size`. */
    size: number
  }>
}

/** All nineteen ecosystem projects, spread over five rings. */
export const DEFAULT_RINGS: OrbitRing[] = [
  {
    d: 0.3,
    secs: 7,
    planets: [
      { src: "/eco/01.png", deg: 0, size: 0.062 },
      { src: "/eco/02.png", deg: 120, size: 0.055 },
      { src: "/eco/03.png", deg: 240, size: 0.058 },
    ],
  },
  {
    d: 0.48,
    secs: 9.5,
    planets: [
      { src: "/eco/04.png", deg: 35, size: 0.07 },
      { src: "/eco/05.png", deg: 125, size: 0.06 },
      { src: "/eco/06.png", deg: 215, size: 0.062 },
      { src: "/eco/07.png", deg: 305, size: 0.058 },
    ],
  },
  {
    d: 0.66,
    secs: 12,
    planets: [
      { src: "/eco/08.png", deg: 10, size: 0.066 },
      { src: "/eco/09.png", deg: 82, size: 0.058 },
      { src: "/eco/10.png", deg: 154, size: 0.062 },
      { src: "/eco/11.png", deg: 226, size: 0.058 },
      { src: "/eco/12.png", deg: 298, size: 0.06 },
    ],
  },
  {
    d: 0.84,
    secs: 15,
    planets: [
      { src: "/eco/13.png", deg: 50, size: 0.06 },
      { src: "/eco/14.png", deg: 140, size: 0.056 },
      { src: "/eco/15.png", deg: 230, size: 0.062 },
      { src: "/eco/16.png", deg: 320, size: 0.056 },
    ],
  },
  {
    d: 1,
    secs: 18,
    planets: [
      { src: "/eco/17.png", deg: 20, size: 0.056 },
      { src: "/eco/18.png", deg: 140, size: 0.058 },
      { src: "/eco/19.png", deg: 260, size: 0.054 },
    ],
  },
]

/** The brief's diagonal delays: 0 1 2 / 1 2 3 / 2 3 4. Fills live in the
 *  stylesheet as custom properties, so a dark surface gets a ramp that clears
 *  3:1 instead of the flat one. */
const TILES = [
  { x: 0, y: 0, d: 0 },
  { x: 33.3, y: 0, d: 100 },
  { x: 66.6, y: 0, d: 200 },
  { x: 0, y: 33.3, d: 100 },
  { x: 33.3, y: 33.3, d: 200 },
  { x: 66.6, y: 33.3, d: 300 },
  { x: 0, y: 66.6, d: 200 },
  { x: 33.3, y: 66.6, d: 300 },
  { x: 66.6, y: 66.6, d: 400 },
]

export function GlLoader({
  variant = "converge",
  size = 48,
  label = "Loading",
  rings = DEFAULT_RINGS,
  className,
  style,
  ...props
}: GlLoaderProps) {
  const clipId = React.useId()
  const root = ["gl", "gl--" + variant, className].filter(Boolean).join(" ")

  return (
    <span
      role="status"
      aria-label={label}
      className={root}
      style={{ fontSize: size, ...style }}
      {...props}
    >
      {variant === "converge" && (
        <svg className="gl-cv" viewBox="0 0 100 100" aria-hidden="true">
          <polygon className="gl-cv-l" points={WING_L} />
          <polygon className="gl-cv-r" points={WING_R} />
          <polygon className="gl-cv-c" points={CORE} />
        </svg>
      )}

      {variant === "prism" && (
        <span className="gl-cube">
          <svg className="gl-core" viewBox="0 0 100 100" aria-hidden="true">
            <path d={MARK} />
          </svg>
          <span className="gl-side">
            <i />
          </span>
          <span className="gl-side">
            <i />
          </span>
          <span className="gl-side">
            <i />
          </span>
          <span className="gl-side">
            <i />
          </span>
          <span className="gl-side">
            <i />
          </span>
          <span className="gl-side">
            <i />
          </span>
        </span>
      )}

      {variant === "vault" && (
        <span className="gl-box">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="gl-facet">
              <svg viewBox="0 0 100 100" aria-hidden="true">
                <path d={MARK} />
              </svg>
            </span>
          ))}
          <span className="gl-facet" />
          <span className="gl-facet" />
        </span>
      )}
      {/* the floor bar is a sibling of the block: inside it, it would inherit
          preserve-3d and tumble along with the thing it lies under */}
      {variant === "vault" && <span className="gl-shadow" />}

      {variant === "ripple" && (
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <defs>
            <clipPath id={clipId}>
              <path d={MARK} />
            </clipPath>
          </defs>
          <g clipPath={`url(#${clipId})`}>
            {TILES.map((t, i) => (
              <rect
                key={i}
                className="gl-tile"
                x={t.x}
                y={t.y}
                width={33.4}
                height={33.4}
                style={{ animationDelay: t.d + "ms" }}
              />
            ))}
          </g>
        </svg>
      )}

      {variant === "orbit" && (
        <span className="gl-orbit" aria-hidden="true">
          <span className="gl-orbit-sweep" />
          {rings.map((ring) => (
            <span
              key={ring.d}
              className="gl-orbit-ring"
              style={{
                width: ring.d + "em",
                height: ring.d + "em",
                animationDuration: ring.secs + "s",
              }}
            >
              {ring.planets.map((p) => (
                <span
                  key={p.src}
                  className="gl-orbit-arm"
                  style={{ transform: "rotate(" + p.deg + "deg)" }}
                >
                  <span
                    className="gl-orbit-hold"
                    style={{ animationDuration: ring.secs + "s" }}
                  >
                    <img
                      src={p.src}
                      alt=""
                      decoding="async"
                      fetchPriority="low"
                      style={{
                        width: p.size + "em",
                        height: p.size + "em",
                        margin: "-" + p.size / 2 + "em",
                        transform: "rotate(" + -p.deg + "deg) rotateX(-64deg)",
                      }}
                    />
                  </span>
                </span>
              ))}
            </span>
          ))}
          <svg className="gl-orbit-sun" viewBox="0 0 100 100">
            <path d={MARK} />
          </svg>
        </span>
      )}

      {variant === "honeycomb" && (
        <span className="gl-comb">
          <i />
          <i />
          <i />
          <i />
          <i />
          <i />
          <svg className="gl-comb-core" viewBox="0 0 100 100" aria-hidden="true">
            <path d={MARK} />
          </svg>
        </span>
      )}
    </span>
  )
}

export default GlLoader

/** The seven states a GenLayer transaction actually moves through. */
export const DEFAULT_STATES = [
  "Pending",
  "Proposing",
  "Committing",
  "Leader revealing",
  "Revealing",
  "Accepted",
  "Finalized",
]

export interface GlLoadingScreenProps extends Omit<GlLoaderProps, "label"> {
  /** Lines to cycle through under the loader. */
  states?: string[]
  /** Milliseconds each line stays up. Default 1500. */
  interval?: number
}

/**
 * A loader with a cycling status line under it, for route level and full page
 * loads. The loop is CSS; only the words are state, so the animation never
 * restarts when the text changes.
 */
export function GlLoadingScreen({
  states = DEFAULT_STATES,
  interval = 1500,
  size = 96,
  className,
  ...props
}: GlLoadingScreenProps) {
  const [i, setI] = React.useState(0)

  React.useEffect(() => {
    if (states.length < 2) return
    const t = setInterval(
      () => setI((n) => (n + 1) % states.length),
      interval,
    )
    return () => clearInterval(t)
  }, [states, interval])

  return (
    <div
      role="status"
      aria-live="polite"
      className={["gl-screen", className].filter(Boolean).join(" ")}
    >
      <GlLoader size={size} aria-hidden="true" {...props} />
      <p className="gl-screen-status">
        {states[i]}
        <span className="gl-screen-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </p>
    </div>
  )
}
