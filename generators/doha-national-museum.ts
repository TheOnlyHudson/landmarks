/**
 * National Museum of Qatar, Doha (Ateliers Jean Nouvel, 2019) — original procedural geometry, CC0-1.0.
 * bun generators/doha-national-museum.ts
 *
 * Writes two levels of detail in the same frame:
 * - models/doha-national-museum.glb (low, ≤ 6,500 triangles);
 * - models/doha-national-museum.detail.glb (from zoom 16, ≤ 40,000).
 *
 * Frame: map frame (bearing 0), origin = centroid of the OSM outline
 * way/680315530 (51.5491750, 25.2877051).
 *
 * The "desert rose": the building is a cluster of large intersecting discs,
 * thin plates of sand-coloured fibre concrete (1–2 m at the rim, gently
 * dished), most of them standing steeply (30–90°) and crossing each other
 * like petals, a few lying flatter as roofs, with dark blue glazing set deep
 * between them. Here every disc is a real 3D shell 1.2 m thick with a slight
 * dish (2.5% of its radius) and a crisp rim, placed at its own tilt.
 *
 * Layout: the OSM outline's lobes are found by a greedy fit (the largest
 * circle that fits inside the outline, then the next). Each lobe not already
 * under one carries a big roof disc, 40–87 m across (1.55 × the lobe's
 * radius, at least 20 m and at most 43.5 m in radius), so each spans two or
 * more lobes and overhangs the glazing deeply; they lie near flat (3–10°)
 * in four tiers at 13, 20, 27 and 33 m. Under each, two or three big steep
 * plates (24–48 m across, 55–87°) slice from below the ground up towards the
 * roof, only their upper segment showing, with dark glazing in the shadowed
 * slots between them; the biggest roofs carry one smaller disc between
 * tiers. Positions, tilts and tier order are a seeded pattern matched to the
 * photos' look, not surveyed: no open aerial or drawing gives each of the
 * 539 discs.
 *
 * Evidence
 * - OSM way/680315530 (building, height 20, 5 levels): the outline, 230 ×
 *   300 m of round lobes around the old palace courtyard. The old palace of
 *   Sheikh Abdullah (way/770358222-251 etc.) stands in the courtyard outside
 *   the outline and is left to the map. way/680315535, a 45 × 24 m round
 *   annex just south of the outline, is drawn as two discs and replaced.
 * - Published (Ateliers Jean Nouvel; archello; architecturelab): 539 discs,
 *   14 to 87 m across; about 40 m at the highest; 52,000 m².
 * - Photos (EVIDENCE):
 *   "National Museum of Qatar." (young shanahan, CC BY 2.0) — the entrance
 *     side under the stacked discs: tilts, rims, the steep support discs;
 *     https://www.flickr.com/photos/young_shanahan/54156728992 (live.staticflickr.com/65535/54156728992_9562803cd7_b.jpg)
 *   "National Museum of Qatar." (young shanahan, CC BY 2.0) — a large disc
 *     lying almost flat over the terrace; live.staticflickr.com/65535/52624405651_33dde9564d_b.jpg
 *   "Desert Rose Museum" (mikecogh / Michael Coghlan, CC BY-SA 2.0) — the
 *     upright domed disc over the roof discs, the blue glazing, colour;
 *     https://www.flickr.com/photos/mikecogh/52956792898
 *   "2024-Doha National Museum" (www.wbayer.com, CC0) — four views of the
 *     interlocking discs; live.staticflickr.com/65535/53554799962_53fd7f830f_b.jpg,
 *     53554800152_8cf399ab7d, 53555649651_ea9fcc6e49, 53555988379_f5c0b734b8
 *   "National Museum of Qatar under construction.jpg" (Alex Sergeev,
 *     CC BY-SA 3.0) — the whole cluster of discs from afar;
 *     https://commons.wikimedia.org/wiki/File:National_Museum_of_Qatar_under_construction.jpg
 * Colour: sunlit disc tops near white (#d5d6d6 against a hazy sky), shaded
 * undersides warm sand; drawn as one pale sand #e6d7c0. Glazing deep blue,
 * drawn #3f5170.
 *
 * Doubts: individual disc positions, sizes and tilts are a stylised pattern
 * fitted to the outline, not a survey; the glazing's heights are
 * estimated (up to 6.5 m).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { otri, writeModel, type Mat, type P2 } from './doha-museum-of-islamic-art'

const ANCHOR = { lng: 51.549175, lat: 25.2877051 }
const OUTLINE: P2[] = [[67.1,-126.4],[69.5,-126.5],[75.3,-125.0],[80.3,-122.3],[76.8,-113.2],[82.3,-109.7],[83.9,-111.0],[88.3,-115.2],[94.6,-119.0],[102.2,-122.2],[107.4,-122.4],[112.2,-118.7],[115.8,-111.3],[115.7,-103.2],[111.3,-96.9],[105.4,-92.9],[100.7,-91.6],[95.6,-84.9],[94.2,-82.1],[93.7,-75.6],[90.1,-65.8],[90.3,-57.7],[88.7,-47.1],[86.5,-42.7],[81.8,-36.4],[75.5,-32.0],[70.5,-28.6],[71.3,-22.2],[71.4,-15.9],[72.4,-9.7],[72.0,-3.3],[68.6,6.5],[62.3,12.3],[62.9,18.7],[62.1,26.8],[58.5,33.0],[58.5,37.6],[59.0,45.1],[58.7,50.6],[55.2,58.7],[48.1,63.0],[41.7,65.6],[37.9,65.9],[33.2,66.0],[31.2,75.0],[25.8,80.7],[19.1,85.7],[21.3,90.2],[22.3,92.2],[23.6,100.2],[22.6,104.9],[21.8,108.5],[17.4,116.0],[10.7,121.4],[1.5,124.1],[3.0,131.6],[-0.9,134.8],[-1.5,141.7],[-3.5,151.0],[-7.8,157.1],[-12.5,160.7],[-18.5,168.2],[-26.7,171.4],[-37.4,170.2],[-45.1,165.8],[-50.3,160.0],[-52.9,153.8],[-53.8,146.2],[-53.2,138.6],[-51.1,134.6],[-48.3,131.0],[-52.3,130.9],[-56.0,130.3],[-59.5,128.8],[-62.6,126.9],[-68.0,121.2],[-74.3,113.1],[-78.2,110.0],[-79.9,111.6],[-82.4,113.4],[-87.4,116.6],[-93.9,117.3],[-99.8,116.0],[-104.7,112.8],[-107.7,109.3],[-109.7,105.7],[-111.2,101.6],[-111.3,98.6],[-105.6,97.7],[-100.1,96.4],[-97.1,88.4],[-93.6,84.7],[-90.2,82.9],[-91.8,74.1],[-90.4,69.3],[-88.2,66.8],[-86.5,63.9],[-82.7,60.8],[-80.1,60.2],[-77.3,60.7],[-69.3,64.0],[-60.8,59.7],[-57.2,58.8],[-50.5,60.4],[-46.8,62.1],[-44.8,63.7],[-42.7,67.4],[-42.1,70.7],[-41.7,74.3],[-42.4,78.4],[-44.1,82.4],[-41.4,83.4],[-39.2,85.0],[-37.2,86.8],[-34.1,90.0],[-29.7,93.5],[-21.7,99.7],[-18.7,95.1],[-13.9,90.0],[-9.2,85.7],[-1.2,82.1],[-8.4,69.5],[-8.4,61.0],[-7.4,54.8],[-5.3,48.1],[-2.6,43.1],[4.8,36.4],[2.8,30.1],[3.1,23.3],[5.8,17.9],[12.3,13.1],[14.7,3.4],[17.3,0.2],[20.4,-1.9],[17.4,-7.6],[15.8,-14.6],[15.5,-20.5],[18.1,-27.3],[21.1,-31.2],[20.1,-38.7],[17.7,-44.0],[13.9,-47.0],[8.2,-48.1],[3.9,-49.7],[-0.1,-53.2],[-4.0,-51.1],[-8.0,-49.1],[-11.6,-41.1],[-14.8,-37.5],[-16.7,-35.6],[-16.7,-29.8],[-18.2,-26.8],[-20.4,-23.7],[-23.6,-20.6],[-27.6,-19.4],[-26.6,-15.3],[-24.8,-8.5],[-26.0,-0.8],[-28.7,5.3],[-31.1,8.8],[-34.3,11.6],[-38.9,14.2],[-43.6,15.4],[-48.9,16.3],[-54.2,16.0],[-58.8,14.4],[-63.3,12.1],[-67.7,8.0],[-71.2,2.2],[-74.6,-5.7],[-78.5,-7.6],[-80.0,-11.2],[-80.9,-15.3],[-79.2,-20.0],[-76.2,-23.5],[-79.0,-28.2],[-78.9,-32.0],[-77.7,-35.3],[-75.2,-38.2],[-67.3,-40.7],[-69.7,-52.2],[-70.4,-54.7],[-73.5,-56.7],[-76.4,-61.8],[-78.0,-68.5],[-76.4,-75.0],[-76.4,-77.2],[-76.9,-81.9],[-75.9,-87.8],[-74.8,-89.8],[-73.3,-91.7],[-70.7,-92.6],[-67.7,-93.6],[-65.1,-93.9],[-60.6,-93.6],[-58.1,-96.5],[-55.8,-98.8],[-52.2,-101.4],[-47.7,-103.5],[-44.6,-108.3],[-41.7,-111.5],[-38.3,-113.9],[-34.4,-115.7],[-30.2,-116.6],[-26.1,-116.6],[-22.1,-115.9],[-18.3,-114.3],[-14.9,-112.0],[-12.0,-109.1],[-9.7,-105.7],[-8.2,-102.0],[-3.2,-96.2],[-1.7,-93.6],[1.2,-88.6],[1.8,-92.0],[3.3,-94.2],[5.2,-96.0],[7.5,-97.4],[10.0,-98.4],[12.8,-98.9],[15.6,-98.8],[19.4,-102.6],[23.2,-106.9],[27.5,-110.5],[32.4,-113.5],[36.8,-115.3],[41.3,-116.6],[45.9,-117.3],[50.6,-117.4],[52.3,-119.8],[54.3,-122.0],[56.7,-123.7],[59.6,-125.1],[62.7,-125.9],[65.9,-126.1]]
const ANNEX: P2[] = [[16.4,-147.4],[19.3,-148.8],[22.2,-149.8],[25.4,-149.9],[28.4,-149.0],[30.9,-147.2],[32.8,-144.7],[33.9,-141.8],[33.9,-138.6],[33.0,-135.7],[31.2,-133.1],[28.7,-131.2],[25.7,-130.2],[21.3,-129.8],[18.5,-127.4],[14.9,-126.1],[10.5,-126.3],[6.9,-127.8],[3.3,-126.0],[0.1,-125.5],[-3.1,-125.8],[-5.4,-126.4],[-8.6,-129.0],[-10.0,-131.5],[-10.9,-134.7],[-10.7,-137.6],[-10.2,-140.6],[-8.6,-143.1],[-6.5,-145.0],[-3.8,-146.9],[-0.9,-147.6],[3.4,-147.4],[6.5,-145.7],[9.4,-147.1],[12.5,-147.9]]

/** A seeded random stream, so the rose is the same every build. */
function rng(seed: number) {
  let s = seed >>> 0
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296 }
}

const norm = (a: V3): V3 => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l] }
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]

/**
 * A lens-shaped disc of radius R centred at c, its axis n: a domed top
 * (rise sagT), a deeper underside (sagB), a rim 2e thick. Vertices below the
 * ground are set on it.
 */
function disc(part: Part, c: V3, n: V3, R: number, seg: number, rings: number, sagT = 0.035 * R, sagB = 0.07 * R, e = 0.35) {
  n = norm(n)
  const ref: V3 = Math.abs(n[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]
  const u = norm(cross(n, ref)), v = cross(n, u)
  const clampZ = (p: V3): V3 => [p[0], p[1], Math.max(0, p[2])]
  // a triangle lying in the ground after clamping is left out (it would be a flat patch on the terrain)
  const T = (a: V3, b: V3, c: V3, ns: V3[]) => { if (Math.max(a[2], b[2], c[2]) > 0.6) part.tri(a, b, c, [0, 0], [0, 0], [0, 0], ns) }
  const surf = (rho: number, th: number, side: 1 | -1): [V3, V3] => {
    const sag = side > 0 ? sagT : sagB
    const h = side * (e + sag * (1 - rho * rho))
    const dh = side * (-2 * sag * rho / R) // dh/dr
    const ct = Math.cos(th), st = Math.sin(th)
    const rad: V3 = [u[0] * ct + v[0] * st, u[1] * ct + v[1] * st, u[2] * ct + v[2] * st]
    const r = rho * R
    const p: V3 = [c[0] + rad[0] * r + n[0] * h, c[1] + rad[1] * r + n[1] * h, c[2] + rad[2] * r + n[2] * h]
    const nn = norm([side * n[0] - side * dh * rad[0], side * n[1] - side * dh * rad[1], side * n[2] - side * dh * rad[2]])
    return [clampZ(p), nn]
  }
  for (const side of [1, -1] as const) {
    for (let k = 0; k < rings; k++) {
      const r0 = k / rings, r1 = (k + 1) / rings
      for (let i = 0; i < seg; i++) {
        const a = (2 * Math.PI * i) / seg, b = (2 * Math.PI * (i + 1)) / seg
        const [p1, n1] = surf(r1, a, side), [p2, n2] = surf(r1, b, side)
        if (k === 0) {
          const [p0, n0] = surf(0, 0, side)
          T(p0, p1, p2, [n0, n1, n2])
        } else {
          const [q1, m1] = surf(r0, a, side), [q2, m2] = surf(r0, b, side)
          T(q1, p1, p2, [m1, n1, n2])
          T(q1, p2, q2, [m1, n2, m2])
        }
      }
    }
  }
  // the rim
  for (let i = 0; i < seg; i++) {
    const a = (2 * Math.PI * i) / seg, b = (2 * Math.PI * (i + 1)) / seg
    const [t1] = surf(1, a, 1), [t2] = surf(1, b, 1), [b1] = surf(1, a, -1), [b2] = surf(1, b, -1)
    const ra: V3 = [u[0] * Math.cos(a) + v[0] * Math.sin(a), u[1] * Math.cos(a) + v[1] * Math.sin(a), u[2] * Math.cos(a) + v[2] * Math.sin(a)]
    const rb: V3 = [u[0] * Math.cos(b) + v[0] * Math.sin(b), u[1] * Math.cos(b) + v[1] * Math.sin(b), u[2] * Math.cos(b) + v[2] * Math.sin(b)]
    T(b1, b2, t2, [ra, rb, rb])
    T(b1, t2, t1, [ra, rb, ra])
  }
}

function inside(p: P2, poly: P2[]) {
  let c = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i], b = poly[j]
    if ((a[1] > p[1]) !== (b[1] > p[1]) && p[0] < ((b[0] - a[0]) * (p[1] - a[1])) / (b[1] - a[1]) + a[0]) c = !c
  }
  return c
}
function edgeDist(p: P2, poly: P2[]) {
  let d = Infinity
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length]
    const dx = b[0] - a[0], dy = b[1] - a[1], t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy)))
    d = Math.min(d, Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy))
  }
  return d
}

/** Greedy circle cover of a polygon: largest inscribed first. */
function lobes(poly: P2[], step: number, minR: number, keep: number): { c: P2; r: number }[] {
  let pts: { p: P2; d: number }[] = []
  const xs = poly.map((p) => p[0]), ys = poly.map((p) => p[1])
  for (let x = Math.min(...xs); x <= Math.max(...xs); x += step) for (let y = Math.min(...ys); y <= Math.max(...ys); y += step) {
    const p: P2 = [x, y]
    if (inside(p, poly)) pts.push({ p, d: edgeDist(p, poly) })
  }
  const out: { c: P2; r: number }[] = []
  while (pts.length) {
    let best = pts[0]
    for (const q of pts) if (q.d > best.d) best = q
    if (best.d < minR) break
    out.push({ c: best.p, r: best.d })
    pts = pts.filter((q) => Math.hypot(q.p[0] - best.p[0], q.p[1] - best.p[1]) > best.d * keep)
  }
  return out
}

function build(detail: boolean): Mat[] {
  const crete = new Part(), glass = new Part()
  const rand = rng(detail ? 1009 : 7)
  const seg = detail ? 36 : 20, rings = detail ? 3 : 1
  /**
   * A thin plate: a shell 1.2 m thick with a slight dish (rise 2.5% of its
   * radius), crisp at the rim; its highest point kept under the published 40 m.
   */
  const plate = (c: V3, n: V3, R: number) => {
    const nn = norm(n), sag = 0.025 * R, reach = R * Math.sqrt(1 - nn[2] * nn[2]) + sag + 0.7
    disc(crete, [c[0], c[1], Math.min(c[2], 40 - reach)], nn, R, seg, rings, sag, -sag, 0.6)
  }
  const tilt = (deg: number, az: number): V3 => { const t = (deg * Math.PI) / 180; return [Math.sin(t) * Math.cos(az), Math.sin(t) * Math.sin(az), Math.cos(t)] }
  // dark glazing set back under the plates: a low faceted wall, flat-shaded
  const glazing = (cx: number, cy: number, r: number, h: number) => {
    const n = 7, a0 = rand() * 2 * Math.PI
    for (let i = 0; i < n; i++) {
      const a = a0 + (2 * Math.PI * i) / n, b = a0 + (2 * Math.PI * (i + 1)) / n
      const p: V3 = [cx + r * Math.cos(a), cy + r * Math.sin(a), 0], q: V3 = [cx + r * Math.cos(b), cy + r * Math.sin(b), 0]
      const m: V3 = [Math.cos((a + b) / 2), Math.sin((a + b) / 2), 0]
      otri(glass, p, q, [q[0], q[1], h], m); otri(glass, p, [q[0], q[1], h], [p[0], p[1], h], m)
      otri(glass, [p[0], p[1], h], [q[0], q[1], h], [cx, cy, h], [0, 0, 1])
    }
  }

  const TIERS = [13, 20, 27, 33]
  for (const [poly, minR, keep] of [[OUTLINE, 7, 1.0], [ANNEX, 4, 1.2]] as [P2[], number, number][]) {
    const L = lobes(poly, 2, minR, keep).sort((p, q) => q.r - p.r)
    // 1. the big roof discs, 40–87 m across, each spanning two or more lobes,
    //    near horizontal (3–10°), stacked in four tiers, rims overhanging deeply
    const big: { c: P2; R: number; z: number }[] = []
    for (const { c, r } of L) {
      if (poly === ANNEX) { big.push({ c, R: r + 3, z: 8 }); continue }
      const R = Math.min(43.5, Math.max(20, 1.55 * r, r + 9))
      if (big.some((b) => Math.hypot(b.c[0] - c[0], b.c[1] - c[1]) < 0.75 * Math.max(b.R, R))) continue
      big.push({ c, R, z: 0 })
    }
    big.forEach((b, i) => { if (!b.z) b.z = TIERS[(i * 3 + 1) % 4] + rand() * 2 })
    for (const b of big) {
      plate([b.c[0], b.c[1], b.z], tilt(3 + rand() * 7, rand() * 2 * Math.PI), b.R)
      // 2. a few big steep plates (20–40 m across) slicing down under it to the
      //    ground, the slots between them deep in shadow
      const n = poly === ANNEX ? 1 : b.R > 30 ? 3 : 2
      const a0 = rand() * 2 * Math.PI
      for (let k = 0; k < n; k++) {
        const a = a0 + (2 * Math.PI * (k + rand() * 0.4)) / n, off = (0.25 + rand() * 0.3) * b.R
        const steep = 55 + rand() * 32, rv = poly === ANNEX ? 8 : Math.min(24, 12 + 0.35 * b.R) * (0.85 + rand() * 0.15)
        const s = Math.sin((steep * Math.PI) / 180)
        // its top meets the underside of the roof disc above it
        const zc = Math.min(0.15 * rv * s, Math.max(-0.45 * rv * s, b.z - rv * s + 1)) // sunk: only the upper segment shows, a blade from the ground to the roof
        plate([b.c[0] + off * Math.cos(a), b.c[1] + off * Math.sin(a), zc], tilt(steep, a + Math.PI / 2 + (rand() - 0.5) * 1.2), rv)
      }
      glazing(b.c[0], b.c[1], 0.32 * b.R, Math.min(6.5, b.z - 2))
    }
    // a second, smaller near-flat disc between tiers on the biggest roofs (detail adds more)
    for (const b of big.filter((b) => b.R > (detail ? 25 : 34))) {
      const a = rand() * 2 * Math.PI, off = 0.4 * b.R
      plate([b.c[0] + off * Math.cos(a), b.c[1] + off * Math.sin(a), b.z + (rand() < 0.5 ? -6 : 5)], tilt(6 + rand() * 10, rand() * 2 * Math.PI), b.R * 0.55)
    }
  }
  return [
    { part: crete, material: { ...finish('nmoq-concrete', 0xe6d7c0), floodlight: (p: V3, n: V3) => (n[2] < -0.3 ? 0.7 : 0.35) } },
    { part: glass, material: { ...PALETTE.window, color: 0x3f5170 } },
  ]
}

/** Drop vertices closer than d to the last kept one, then sharp spikes stay. */
function simplify(p: P2[], d: number): P2[] {
  const out: P2[] = [p[0]]
  for (const q of p.slice(1)) if (Math.hypot(q[0] - out[out.length - 1][0], q[1] - out[out.length - 1][1]) >= d) out.push(q)
  return out
}

if (import.meta.main) {
  const extras = { anchor: ANCHOR, bearing: 0, height: 40 }
  await writeModel('doha-national-museum.glb', 'National Museum of Qatar', build(false), 6500, 250 * 1024, extras)
  await writeModel('doha-national-museum.detail.glb', 'National Museum of Qatar', build(true), 40000, 1536 * 1024, extras)
}
