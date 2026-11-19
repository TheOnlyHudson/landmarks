/**
 * The Cabildo, Jackson Square, New Orleans (1795-99, Gilberto Guillemard;
 * mansard roof and cupola 1847) — procedural, CC0-1.0, no textures.
 * bun generators/nola-cabildo.ts
 *
 * Also the kit for its near-twin, the Presbytère (nola-presbytere.ts imports
 * `buildCasa` and friends from here). The Cabildo itself is only written when
 * this file is run directly.
 *
 * Map frame: x = model east, y = model north, z up, metres; origin at the
 * anchor on the ground. Placed at bearing 307.9, the bearing at which the
 * OSM outline's walls run square to the axes (the cathedral next door is at
 * 307): model −y is the front on Chartres Street, facing compass 128 over
 * Jackson Square; model +x runs along Chartres toward the cathedral (compass
 * 38), model −x is St. Peter Street. Anchor: the area centroid of the OSM
 * outline way/329364483.
 *
 * Identity, in order: the two-storey pale stucco front of nine bays, an open
 * ground-floor arcade of round arches and an upper storey of round-headed
 * windows behind iron balconies, between pilasters; the central pediment
 * over three bays with its sculpture; the 1847 slate mansard roof with a
 * white round-headed dormer over every bay; the square-based cupola with its
 * white balustrade, drum, slate dome and spike.
 *
 * Evidence
 * - OSM way/329364483 (outline; 34.5 m front, the main block 17.5 m deep,
 *   rear wings round a courtyard to 28 m) and its parts way/1548518176 (the
 *   main mansard block, L-shaped along St. Peter), way/1548518175 (the
 *   mansard rear wing on St. Peter), way/1548518174 (the L-shaped rear
 *   wings, 13 m), way/1548518177 (a 6 m link), way/1548518178/179/180 (the
 *   cupola's base, dome and spike).
 * - Lidar: USGS 3DEP LA_2021GNO_1_C22 (Greater New Orleans, flown 2021-22),
 *   0.5 m grid read in the model frame. Ground flat (0.3 m over the grid's
 *   minimum all round, z = 0). Front cornice/roof edge 14.6 one cell in,
 *   the mansard rising to a ridge of 18.5-18.9 along the block's middle
 *   (hipped at the ends), the roof along St. Peter 15.7-17.7 back to the
 *   rear wing, the rear wings 10-12.7, the cupola 24.1 (sparse).
 * - Terrain (Mapterhorn): flat within 0.6 m. elevation 0.
 * - Photos (Wikimedia Commons, all evidence):
 *   - "New Orleans - French Quarter - Jackson Square - The Cabildo.jpg",
 *     Jared422, CC BY-SA 3.0: face-on from the square, every front
 *     proportion (31 px/m on the 34.5 m front: storey line 6.4, cornice
 *     13.4, pediment apex ~15.7, ridge ~18.5), the bay count, dormers
 *     https://commons.wikimedia.org/wiki/File:New_Orleans_-_French_Quarter_-_Jackson_Square_-_The_Cabildo.jpg
 *   - "The Cabildo, New Orleans, USA1.jpg", Diego Delso, CC BY-SA 3.0: the
 *     front from the cathedral side, the dormers' scrolled surrounds, the
 *     balconies, the cupola
 *     https://commons.wikimedia.org/wiki/File:The_Cabildo,_New_Orleans,_USA1.jpg
 *   - "The Cabildo, New Orleans, October 2011.jpg", Elisa.rolle,
 *     CC BY-SA 4.0: the front from St. Peter Street in sun (colours)
 *     https://commons.wikimedia.org/wiki/File:The_Cabildo,_New_Orleans,_October_2011.jpg
 *   - "New Orleans October 2024 - Cabildo from the River.jpg", lukeharold,
 *     CC0: the roof from the river, the upper hip over the steep slope
 *     https://commons.wikimedia.org/wiki/File:New_Orleans_October_2024_-_Cabildo_from_the_River.jpg
 *   - "Facade from St. Peter Street. May 1936. ... HABS LA,36-NEWOR,4-1",
 *     Richard Koch (HABS, Library of Congress), public domain: the St.
 *     Peter side, its arches and dormers
 *     https://commons.wikimedia.org/wiki/File:Facade_from_St._Peter_Street._May_1936._Photos_by_Richard_Koch._-_The_Cabildo,_711_Chartres_Street,_New_Orleans,_Orleans_Parish,_LA_HABS_LA,36-NEWOR,4-1.tif
 *   - "The Cabildo, New Orleans.jpg", Yair Haklai, CC BY-SA 4.0: inside
 *     the arcade (its depth, the dark doors, the arch open to St. Peter)
 *     https://commons.wikimedia.org/wiki/File:The_Cabildo,_New_Orleans.jpg
 *   - "Aerial photograph of Jackson Square, New Orleans, Louisiana.jpg",
 *     Mark Westguard, CC0: the roof plan from above
 *     https://commons.wikimedia.org/wiki/File:Aerial_photograph_of_Jackson_Square,_New_Orleans,_Louisiana.jpg
 *   - "Jackson Square Aerial Photo.jpg", Jordon Dopp, CC BY-SA 4.0: the
 *     Cabildo, cathedral and Presbytère together, both cupolas
 *     https://commons.wikimedia.org/wiki/File:Jackson_Square_Aerial_Photo.jpg
 * - Published: Wikipedia, "Cabildo (New Orleans)": built 1795-99, the
 *   mansard roof and cupola added 1847; rebuilt after the 1988 fire.
 *
 * Measured (lidar): the plan from OSM checked against the grid, the ridge
 * 18.8, the St. Peter wing's ridge ~17, the rear wings' eaves 10 and tops
 * 12.7, the cupola's dome top ~24. Estimated from the face-on photo: the
 * storey line 6.4, cornice 13.4, the arch and window sizes (arches 2.45 m
 * wide to 5.3, windows 1.85 m wide to 10.85), the pediment (apex 15.7), the
 * steep slope (2.4 m rise over 1.1 m) and the dormers (to 16.35), the
 * cupola's stages (base to 19.6, balustrade to 20.4, drum to 21.7, dome to
 * 23.9, spike to 26.6). The St. Peter and alley sides, and the rear, follow
 * the front's storeys with a window per bay; their counts are estimated.
 * Left out: the fence, lamps, the lettering on the frieze, the courtyard's
 * galleries, the pediment's carving (a plain raised panel stands for it).
 *
 * Doubts: OSM's cupola base sits 0.5 m east of the front's centre line; the
 * cupola is drawn on the centre line. The rear wings' roofs are simplified
 * to low hips.
 *
 * Drawing choices (review round 1): proud pilasters (0.45 m) on every pier,
 * both storeys, paired at the corners and the pediment's bays, carried round
 * the end walls; the storey-line entablature and the heavy cornice under the
 * mansard are pale bands (trim) so the order reads in the map's flat light;
 * the slate is a neutral blue-grey; the lantern is pale with dark arched
 * openings; the arcade's openings are a dark recessed shadow colour on the
 * loggia's back wall, 3.4 m behind the arches.
 *
 * Night: the front is floodlit (`floodlight` on the stucco), the windows
 * glow (`window`).
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE, type Swatch } from './palette'
import { finishModel, type XY } from './nyc-570-lexington'
import { block, dome, hipRoof, archPanel, rectPanel, discPanel, band, parapet } from './nyc-city-hall'

// ===========================================================================
// Kit (shared with nola-presbytere.ts)
// ===========================================================================

export type Parts = { stucco: Part; trim: Part; slate: Part; win: Part; iron: Part; door: Part }
export const newParts = (): Parts => ({ stucco: new Part(), trim: new Part(), slate: new Part(), win: new Part(), iron: new Part(), door: new Part() })

/** A triangle / quad wound to face along n (flat-shaded). */
export function triN(p: Part, a: V3, b: V3, c: V3, n: V3) {
  const g = [(b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]), (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]), (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])]
  if (Math.hypot(g[0], g[1], g[2]) < 1e-9) return
  if (g[0] * n[0] + g[1] * n[1] + g[2] * n[2] >= 0) p.tri(a, b, c); else p.tri(a, c, b)
}
export function quadN(p: Part, a: V3, b: V3, c: V3, d: V3, n: V3) { triN(p, a, b, c, n); triN(p, a, c, d, n) }

/** A wall face: a→b along the wall in counter-clockwise ring order, so the outside is to its right. */
export type Face = { a: XY; b: XY }
export function frame(F: Face) {
  const L = Math.hypot(F.b[0] - F.a[0], F.b[1] - F.a[1])
  const ux = (F.b[0] - F.a[0]) / L, uy = (F.b[1] - F.a[1]) / L, nx = uy, ny = -ux
  /** s along the wall from a, d out from it, z up. */
  const P = (s: number, d: number, z: number): V3 => [F.a[0] + ux * s + nx * d, F.a[1] + uy * s + ny * d, z]
  /** A direction from (along, out, up) components. */
  const D = (cu: number, cn: number, cz: number): V3 => [ux * cu + nx * cn, uy * cu + ny * cn, cz]
  return { L, P, D }
}
/** Faces of an axis-aligned rectangle (outside to the right). */
export const faces = (x0: number, y0: number, x1: number, y1: number) => ({
  s: { a: [x0, y0], b: [x1, y0] } as Face,
  e: { a: [x1, y0], b: [x1, y1] } as Face,
  n: { a: [x1, y1], b: [x0, y1] } as Face,
  w: { a: [x0, y1], b: [x0, y0] } as Face,
})

/** A box on a face: along s0..s1, out d0..d1, z0..z1. */
export function wbox(p: Part, F: Face, s0: number, s1: number, d0: number, d1: number, z0: number, z1: number, bottom = false) {
  const f = frame(F)
  const ring = (z: number): V3[] => [f.P(s0, d0, z), f.P(s0, d1, z), f.P(s1, d1, z), f.P(s1, d0, z)]
  p.loft([ring(z0), ring(z1)]); p.cap(ring(z1), true); if (bottom) p.cap(ring(z0), false)
}

/** A polygon (s, z) on a face, star-shaped about its centroid (or `c`), extruded out d0..d1. */
export function wpoly(p: Part, F: Face, poly: [number, number][], d0: number, d1: number, c?: [number, number], back = true) {
  const f = frame(F)
  const cc = c ?? [poly.reduce((s, q) => s + q[0], 0) / poly.length, poly.reduce((s, q) => s + q[1], 0) / poly.length]
  const nOut = f.D(0, 1, 0), nIn = f.D(0, -1, 0)
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length]
    triN(p, f.P(cc[0], d1, cc[1]), f.P(a[0], d1, a[1]), f.P(b[0], d1, b[1]), nOut)
    if (back) triN(p, f.P(cc[0], d0, cc[1]), f.P(a[0], d0, a[1]), f.P(b[0], d0, b[1]), nIn)
    let ns = b[1] - a[1], nz = -(b[0] - a[0])
    if (ns * ((a[0] + b[0]) / 2 - cc[0]) + nz * ((a[1] + b[1]) / 2 - cc[1]) < 0) { ns = -ns; nz = -nz }
    quadN(p, f.P(a[0], d0, a[1]), f.P(b[0], d0, b[1]), f.P(b[0], d1, b[1]), f.P(a[0], d1, a[1]), f.D(ns, 0, nz))
  }
}

/** A round-headed outline (s, z): width w on base z0, top at zTop. */
export function archOutline(s: number, w: number, z0: number, zTop: number, segs = 8): [number, number][] {
  const r = w / 2, spring = zTop - r, pts: [number, number][] = [[s - r, z0], [s + r, z0]]
  for (let k = 0; k <= segs; k++) { const t = (k / segs) * Math.PI; pts.push([s + r * Math.cos(t), spring + r * Math.sin(t)]) }
  return pts
}

export type Arch = { c: number; w: number; top: number }
/**
 * A wall slab on a face, along s0..s1, z0..z1, thickness t behind the face,
 * pierced by round-headed openings (true semicircles). Both faces, the
 * soffits and jambs are drawn, so the arcade reads from any side.
 */
export function archWall(p: Part, F: Face, s0: number, s1: number, z0: number, z1: number, t: number, arches: Arch[], segs = 6) {
  const f = frame(F)
  const A = [...arches].sort((a, b) => a.c - b.c)
  for (const [d, sign] of [[0, 1], [-t, -1]] as [number, number][]) {
    const n = f.D(0, sign, 0)
    let prev = s0
    for (const a of A) {
      const r = a.w / 2, spring = a.top - r
      if (a.c - r > prev + 1e-6) quadN(p, f.P(prev, d, z0), f.P(a.c - r, d, z0), f.P(a.c - r, d, z1), f.P(prev, d, z1), n)
      prev = a.c + r
      const zt = spring + r
      for (let i = 0; i < segs; i++) {
        const t0 = (i / segs) * Math.PI, t1 = ((i + 1) / segs) * Math.PI
        const s0a = a.c + r * Math.cos(t0), s1a = a.c + r * Math.cos(t1)
        quadN(p, f.P(s0a, d, spring + r * Math.sin(t0)), f.P(s1a, d, spring + r * Math.sin(t1)), f.P(s1a, d, zt), f.P(s0a, d, zt), n)
      }
      if (z1 > zt + 1e-6) quadN(p, f.P(a.c - r, d, zt), f.P(a.c + r, d, zt), f.P(a.c + r, d, z1), f.P(a.c - r, d, z1), n)
    }
    if (s1 > prev + 1e-6) quadN(p, f.P(prev, d, z0), f.P(s1, d, z0), f.P(s1, d, z1), f.P(prev, d, z1), n)
  }
  for (const a of A) {
    const r = a.w / 2, spring = a.top - r
    quadN(p, f.P(a.c - r, 0, z0), f.P(a.c - r, -t, z0), f.P(a.c - r, -t, spring), f.P(a.c - r, 0, spring), f.D(1, 0, 0))
    quadN(p, f.P(a.c + r, 0, z0), f.P(a.c + r, -t, z0), f.P(a.c + r, -t, spring), f.P(a.c + r, 0, spring), f.D(-1, 0, 0))
    for (let i = 0; i < segs; i++) {
      const t0 = (i / segs) * Math.PI, t1 = ((i + 1) / segs) * Math.PI, tm = (t0 + t1) / 2
      const q0 = [a.c + r * Math.cos(t0), spring + r * Math.sin(t0)], q1 = [a.c + r * Math.cos(t1), spring + r * Math.sin(t1)]
      quadN(p, f.P(q0[0], 0, q0[1]), f.P(q1[0], 0, q1[1]), f.P(q1[0], -t, q1[1]), f.P(q0[0], -t, q0[1]), f.D(-Math.cos(tm), 0, -Math.sin(tm)))
    }
  }
  quadN(p, f.P(s0, 0, z1), f.P(s1, 0, z1), f.P(s1, -t, z1), f.P(s0, -t, z1), [0, 0, 1])
  quadN(p, f.P(s0, 0, z0), f.P(s0, -t, z0), f.P(s0, -t, z1), f.P(s0, 0, z1), f.D(-1, 0, 0))
  quadN(p, f.P(s1, 0, z0), f.P(s1, -t, z0), f.P(s1, -t, z1), f.P(s1, 0, z1), f.D(1, 0, 0))
}

/** Plain walls of an axis-aligned block (no top), so roofs can sit on them. */
export function walls(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number) {
  const r = (z: number): V3[] => [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]]
  p.loft([r(z0), r(z1)])
}

// Storey heights shared by both buildings (from the face-on photos, scaled
// to the lidar's ridge): the arcade storey to the balcony line, the upper
// storey to the cornice's top.
export const G = 6.4, C = 13.4, LOGGIA = 3.4
export const STEEP_H = 2.4, STEEP_IN = 1.1, SLOPE = 0.4

/**
 * A mansard on an axis-aligned rectangle: a steep slate slope from the
 * cornice (z0) up STEEP_H over STEEP_IN, then a hipped upper roof at SLOPE.
 * Returns the ridge height.
 */
export function mansard(p: Part, x0: number, y0: number, x1: number, y1: number, z0 = C) {
  const r0: V3[] = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]]
  const i = STEEP_IN, z1 = z0 + STEEP_H
  const r1: V3[] = [[x0 + i, y0 + i, z1], [x1 - i, y0 + i, z1], [x1 - i, y1 - i, z1], [x0 + i, y1 - i, z1]]
  p.loft([r0, r1])
  const k = Math.min(x1 - x0, y1 - y0) / 2 - i
  hipRoof(p, x0 + i, y0 + i, x1 - i, y1 - i, z1, k * SLOPE)
  return z1 + k * SLOPE
}

/** A round-headed dormer on the steep slope above face F at s: a white scrolled surround on a slate body. */
export function dormer(P: Parts, F: Face, s: number, z0 = C, scale = 1.32, lift = 0, back = 0) {
  const k = scale
  const base = z0 + 0.05 + lift
  const outline: [number, number][] = [[-1.0, 0], [1.0, 0], [0.85, 0.5], [0.72, 1.1], [0.72, 2.2]]
  for (let j = 1; j < 4; j++) { const t = (j / 4) * Math.PI; outline.push([0.72 * Math.cos(t), 2.2 + 0.72 * Math.sin(t)]) }
  outline.push([-0.72, 2.2], [-0.72, 1.1], [-0.85, 0.5])
  const pts = outline.map(([a, b]) => [s + a * k, base + b * k] as [number, number])
  wpoly(P.trim, F, pts, -0.42 - back, -0.2 - back, [s, base + 1.3 * k], false)
  wpoly(P.slate, F, archOutline(s, 1.3 * k, base - lift, base + 2.75 * k, 4), -2.9 - back, -0.42 - back, undefined, false)
  archPanel(P.win, F.a, F.b, s, 0.82 * k, base + 0.5 * k, base + 2.5 * k, -0.16 - back, 6)
}

/** A round-headed upper window: a white frame, the glass, a white transom and mullion. */
export function upperWindow(P: Parts, F: Face, s: number, w: number, z0: number, top: number, d = 0, bars = true) {
  archPanel(P.trim, F.a, F.b, s, w + 0.4, z0 - 0.1, top + 0.2, d + 0.04, 6)
  archPanel(P.win, F.a, F.b, s, w, z0, top, d + 0.07, 6)
  if (!bars) return
  const spring = top - w / 2
  // the fanlight: a pale sunburst with a dark eye
  fanPanel(P.trim, F, s, spring, w / 2 - 0.12, d + 0.085)
  fanPanel(P.win, F, s, spring, w * 0.2, d + 0.1)
  rectPanel(P.trim, F.a, F.b, s, w, spring - 0.08, spring + 0.08, d + 0.09)
  rectPanel(P.trim, F.a, F.b, s, 0.12, z0, spring - 0.08, d + 0.09)
}

/** A flat half-disc (the head of a fanlight) on a face, centre (s, z). */
export function fanPanel(p: Part, F: Face, s: number, z: number, r: number, d: number, segs = 6) {
  const f = frame(F)
  for (let i = 0; i < segs; i++) {
    const t0 = (i / segs) * Math.PI, t1 = ((i + 1) / segs) * Math.PI
    triN(p, f.P(s, d, z), f.P(s + r * Math.cos(t0), d, z + r * Math.sin(t0)), f.P(s + r * Math.cos(t1), d, z + r * Math.sin(t1)), f.D(0, 1, 0))
  }
}

/** A plain arched-window side facade: lower doors/windows and upper windows with balconettes, per bay. */
export function sideBays(P: Parts, F: Face, centres: number[], o: { lower?: 'door' | 'window' | 'none'; upper?: boolean; balcony?: boolean; h?: number } = {}) {
  const h = o.h ?? C
  for (const s of centres) {
    if (o.lower === 'door') { archPanel(P.trim, F.a, F.b, s, 2.2, 0.3, 4.9, 0.04, 6); archPanel(P.door, F.a, F.b, s, 1.8, 0.3, 4.7, 0.07, 6) }
    else if (o.lower !== 'none') upperWindow(P, F, s, 1.4, 1.4, h > 11 ? 4.6 : 4.2, 0, false)
    if (o.upper !== false) {
      if (h > 11) upperWindow(P, F, s, 1.6, G + 0.3, 10.6, 0, false)
      else upperWindow(P, F, s, 1.4, 6.2, 9.0, 0, false)
      if (o.balcony) {
        const zb = h > 11 ? G : 5.8
        wbox(P.stucco, F, s - 1.1, s + 1.1, 0, 0.45, zb - 0.25, zb)
        wbox(P.iron, F, s - 1.05, s + 1.05, 0.35, 0.43, zb, zb + 0.95)
      }
    }
  }
}

/** A pilaster on face F at s: three faces and a top (its back is in the wall), w wide, d proud. */
export function pilaster(p: Part, F: Face, s: number, w: number, d: number, z0: number, z1: number) {
  const f = frame(F), a = s - w / 2, b = s + w / 2
  quadN(p, f.P(a, d, z0), f.P(b, d, z0), f.P(b, d, z1), f.P(a, d, z1), f.D(0, 1, 0))
  quadN(p, f.P(a, 0, z0), f.P(a, d, z0), f.P(a, d, z1), f.P(a, 0, z1), f.D(-1, 0, 0))
  quadN(p, f.P(b, 0, z0), f.P(b, d, z0), f.P(b, d, z1), f.P(b, 0, z1), f.D(1, 0, 0))
  quadN(p, f.P(a, 0, z1), f.P(b, 0, z1), f.P(b, d, z1), f.P(a, d, z1), [0, 0, 1])
}

/** Evenly spaced centres across s0..s1. */
export const spaced = (s0: number, s1: number, n: number) => Array.from({ length: n }, (_, k) => s0 + ((s1 - s0) * (k + 0.5)) / n)

/** The cupola: a slate-clad square base, a white balustraded platform, the white drum, slate dome and spike. */
export function cupola(P: Parts, cx: number, cy: number, zBase: number) {
  const h = 2.45
  // the slate base, its pale cornice and the white balustrade
  walls(P.slate, cx - h, cy - h, cx + h, cy + h, zBase, 19.3)
  block(P.trim, cx - h - 0.2, cy - h - 0.2, cx + h + 0.2, cy + h + 0.2, 19.3, 19.6)
  parapet(P.trim, [[cx - h - 0.1, cy - h - 0.1], [cx + h + 0.1, cy - h - 0.1], [cx + h + 0.1, cy + h + 0.1], [cx - h - 0.1, cy + h + 0.1]], 19.6, 20.3, 0.2)
  for (const [x, y] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) block(P.trim, cx + x * (h + 0.1) - 0.2, cy + y * (h + 0.1) - 0.2, cx + x * (h + 0.1) + 0.2, cy + y * (h + 0.1) + 0.2, 19.6, 20.45)
  // the pale octagonal lantern with an arched opening in each face
  const R = 1.6, oct: XY[] = Array.from({ length: 8 }, (_, i) => [cx + R * Math.cos((i + 0.5) * Math.PI / 4), cy + R * Math.sin((i + 0.5) * Math.PI / 4)])
  P.trim.loft([oct.map(([x, y]) => [x, y, 19.6] as V3), oct.map(([x, y]) => [x, y, 22.4] as V3)])
  for (let i = 0; i < 8; i++) {
    const a = oct[i], b = oct[(i + 1) % 8], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    archPanel(P.win, a, b, L / 2, 0.75, 20.4, 22.0, 0.03, 4)
  }
  band(P.trim, oct, 22.4, 22.7, 0.18)
  P.trim.cap(oct.map(([x, y]) => [x, y, 22.7] as V3), true)
  // the grey slate dome and the finial
  dome(P.slate, cx, cy, 1.6, 22.7, 1.6, 12, 4)
  const ring = (r: number, z: number): V3[] => Array.from({ length: 8 }, (_, i) => [cx + r * Math.cos(i * Math.PI / 4), cy + r * Math.sin(i * Math.PI / 4), z])
  P.trim.loft([ring(0.3, 24.1), ring(0.3, 24.6), ring(0.12, 24.75)])
  const top = ring(0.12, 24.75)
  for (let i = 0; i < 8; i++) P.slate.tri(top[i], top[(i + 1) % 8], [cx, cy, 26.8])
}

export type CasaOpts = {
  /** The main block: front wall at yF (facing −y), rear wall at yB. */
  x0: number; x1: number; yF: number; yB: number
  tympanum: 'relief' | 'oculus'
  /** Bays on the end walls' upper storey and mansard, beyond the loggia (centres in y). */
  endBays: number[]
  /** Rear dormer and window bays (centres in x). */
  rearBays: number[]
  /** Rear upper-storey windows (centres in x) where no wing covers the wall; rearBays when absent. */
  rearWindows?: number[]
  cupolaX?: number
}

/**
 * The Casa Curial front shared by the Cabildo and the Presbytère: the main
 * block with its arcaded loggia, upper storey, cornice, pediment, mansard,
 * dormers and cupola. Wings are the caller's.
 */
export function buildCasa(P: Parts, o: CasaOpts) {
  const { x0, x1, yF, yB } = o
  const W = x1 - x0, E = 1.35, B = (W - 2 * E) / 9
  const bound = (k: number) => E + B * k               // pilaster lines, s from x0
  const bay = (i: number) => E + B * (i + 0.5)
  const F = faces(x0, yF, x1, yB)
  const front = F.s
  const sc = W / 2

  // Body: the loggia's back wall and everything behind it, the upper storey over the loggia.
  walls(P.stucco, x0, yF + LOGGIA, x1, yB, 0, C)
  block(P.stucco, x0, yF, x1, yF + LOGGIA, G - 0.05, C, true)
  // The arcade: nine open round arches across the front, one at each end of the loggia.
  const archW = B - 0.95
  archWall(P.stucco, front, 0, W, 0, G, 0.7, Array.from({ length: 9 }, (_, i) => ({ c: bay(i), w: archW, top: 5.5 })))
  archWall(P.stucco, F.w, yB - yF - LOGGIA, yB - yF, 0, G, 0.8, [{ c: yB - yF - LOGGIA / 2, w: 2.0, top: 4.9 }])
  archWall(P.stucco, F.e, 0, LOGGIA, 0, G, 0.8, [{ c: LOGGIA / 2, w: 2.0, top: 4.9 }])
  // Through each arch, the dark doors on the loggia's back wall.
  const back: Face = { a: [x0, yF + LOGGIA], b: [x1, yF + LOGGIA] }
  for (let i = 0; i < 9; i++) archPanel(P.door, back.a, back.b, bay(i), archW - 0.4, 0, 5.0, 0.05)
  // The order: proud pilasters on every pier, both storeys, paired at the
  // corners and either side of the pediment's three bays.
  const pils = [0.45, ...Array.from({ length: 10 }, (_, k) => bound(k)), W - 0.45, bound(3) - 0.78, bound(6) + 0.78]
  for (const s of pils) {
    pilaster(P.stucco, front, s, 0.72, 0.45, 0, G - 0.95)
    pilaster(P.trim, front, s, 0.9, 0.55, 0, 0.5)
  }
  // The storey line (a bold string course) and the balcony slab, round the whole block.
  const ring: XY[] = [[x0, yF], [x1, yF], [x1, yB], [x0, yB]]
  // The storey-line entablature: a bold band right round, the balcony slab on it.
  band(P.trim, ring, G - 0.95, G - 0.3, 0.62)
  wbox(P.stucco, front, -0.4, W + 0.4, 0, 0.8, G - 0.3, G - 0.08)
  // Upper storey: pilasters with capitals, the arched windows, iron balconies between the pilasters.
  for (const s of pils) {
    pilaster(P.stucco, front, s, 0.66, 0.45, G - 0.08, C - 2.1)
    pilaster(P.trim, front, s, 0.86, 0.55, C - 2.1, C - 1.75)
  }
  for (let i = 0; i < 9; i++) {
    upperWindow(P, front, bay(i), 2.2, G + 0.25, 11.05)
    wbox(P.iron, front, bound(i) + 0.36, bound(i + 1) - 0.36, 0.62, 0.7, G - 0.08, G + 0.9)
  }
  // Entablature and cornice round the block.
  // Entablature and the heavy cornice under the mansard, round the block.
  band(P.stucco, ring, C - 1.75, C - 0.75, 0.55)
  band(P.trim, ring, C - 0.75, C, 1.05)

  // The pediment over the three central bays, a short gable roof behind it.
  const pL = bound(3) - 0.5, pR = bound(6) + 0.5, ph = 2.45
  wpoly(P.stucco, front, [[pL - 0.45, C], [pR + 0.45, C], [sc, C + ph + 0.35]], -0.3, 0.75)
  wpoly(P.stucco, front, [[pL + 0.4, C + 0.3], [pR - 0.4, C + 0.3], [sc, C + ph - 0.25]], 0.75, 0.82)
  {
    const f = frame(front), yb = -3.2
    const L1 = f.P(pL - 0.45, -0.3, C), R1 = f.P(pR + 0.45, -0.3, C), T1 = f.P(sc, -0.3, C + ph + 0.35)
    const L2 = f.P(pL - 0.45, yb, C), R2 = f.P(pR + 0.45, yb, C), T2 = f.P(sc, yb, C + ph + 0.35)
    quadN(P.slate, L1, T1, T2, L2, f.D(-0.5, 0, 1)); quadN(P.slate, T1, R1, R2, T2, f.D(0.5, 0, 1))
  }
  if (o.tympanum === 'relief') {
    // the carved group (an eagle between scrolls), as one raised panel
    const pts: [number, number][] = [[sc - 2.6, C + 0.45], [sc + 2.6, C + 0.45]]
    for (let k = 1; k < 8; k++) { const t = (k / 8) * Math.PI; pts.push([sc + 2.6 * Math.cos(t), C + 0.45 + 1.1 * Math.sin(t)]) }
    wpoly(P.trim, front, pts, 0.8, 0.9)
  } else {
    discPanel(P.trim, front.a, front.b, sc, C + 1.05, 0.72, 0.86, 14)
    discPanel(P.win, front.a, front.b, sc, C + 1.05, 0.5, 0.9, 14)
  }

  // Mansard and dormers.
  const ridge = mansard(P.slate, x0, yF, x1, yB)
  // The three behind the pediment stand further up the slope, the middle one over its apex.
  for (let i = 0; i < 9; i++) dormer(P, front, bay(i), C, 1.32, i === 4 ? 1.9 : i === 3 || i === 5 ? 0.9 : 0, i === 4 ? 0.85 : i === 3 || i === 5 ? 0.4 : 0)
  for (const y of o.endBays) { dormer(P, F.w, yB - y); dormer(P, F.e, y - yF) }
  for (const x of o.rearBays) dormer(P, F.n, x1 - x)
  cupola(P, o.cupolaX ?? (x0 + x1) / 2, (yF + yB) / 2, ridge - 0.6)

  // The end walls' upper storeys and the rear's.
  sideBays(P, F.w, o.endBays.map((y) => yB - y), { lower: 'door', balcony: true })
  sideBays(P, F.e, o.endBays.map((y) => y - yF), { lower: 'door', balcony: true })
  sideBays(P, F.n, (o.rearWindows ?? o.rearBays).map((x) => x1 - x), { lower: 'none', balcony: true })
  // the order carried round the ends: pilasters between the bays, both storeys
  for (const [Fs, sv] of [[F.w, yB - yF - 0.45], [F.e, 0.45]] as [Face, number][]) { pilaster(P.stucco, Fs, sv, 0.72, 0.45, 0, G - 0.95); pilaster(P.stucco, Fs, sv, 0.66, 0.45, G - 0.08, C - 1.75) }
  const step = o.endBays.length > 1 ? o.endBays[1] - o.endBays[0] : 3.4
  for (const y of [...o.endBays.map((v) => v - step / 2), o.endBays[o.endBays.length - 1] + step / 2]) {
    if (y > yB - 0.5) continue
    for (const [Fs, sv] of [[F.w, yB - y], [F.e, y - yF]] as [Face, number][]) {
      pilaster(P.stucco, Fs, sv, 0.66, 0.45, 0, G - 0.95)
      pilaster(P.stucco, Fs, sv, 0.62, 0.45, G - 0.08, C - 1.75)
    }
  }
  return { ridge, faces: F }
}

/** A plain stucco rear wing: walls to h, a cornice, a low hip (or flat) slate roof. */
export function wing(P: Parts, x0: number, y0: number, x1: number, y1: number, h: number, roofH: number) {
  walls(P.stucco, x0, y0, x1, y1, 0, h)
  band(P.stucco, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], h - 0.4, h, 0.3)
  if (roofH > 0) hipRoof(P.slate, x0, y0, x1, y1, h, roofH)
  else block(P.slate, x0 + 0.05, y0 + 0.05, x1 - 0.05, y1 - 0.05, h - 0.1, h + 0.05)
  return faces(x0, y0, x1, y1)
}

/** Floodlight: the front (facing −y, near the front wall) fully, the rest faintly. */
export const frontLight = (yF: number) => (p: V3, n: V3): number => {
  const up = n[2] > 0.7 ? 0.35 : 1
  if (p[1] < yF + 1.2 && n[1] < -0.3) return up
  if (p[1] < yF + 4) return 0.6 * up
  return 0.2 * up
}

export const SLATE: Swatch = finish('mansard-slate', 0x7c858d)
export const IRON: Swatch = finish('iron', 0x4a514c)
export const DOOR: Swatch = { ...PALETTE.entrance, name: 'door', color: 0x4c5560 }

// ===========================================================================
// The Cabildo
// ===========================================================================

function build() {
  const P = newParts()
  const x0 = -17.1, x1 = 17.4, yF = -12.9, yB = 4.6
  const { faces: F } = buildCasa(P, {
    x0, x1, yF, yB, tympanum: 'relief',
    endBays: spaced(yF + LOGGIA, yB, 4),
    rearBays: spaced(-2.5, x1, 5),
  })

  // The mansard carries on back along St. Peter Street: the L-shaped arm
  // (to the 6 m link) and the rear wing beyond it, both with dormers on the
  // street side.
  walls(P.stucco, x0, yB, -3.0, 10.5, 0, C)
  walls(P.stucco, x0, 10.5, -8.1, 15.0, 0, C)
  band(P.stucco, [[x0, yB], [-3.0, yB], [-3.0, 10.5], [-8.1, 10.5], [-8.1, 15.0], [x0, 15.0]], C - 0.55, C, 0.5)
  band(P.stucco, [[x0, yB], [-3.0, yB], [-3.0, 10.5], [-8.1, 10.5], [-8.1, 15.0], [x0, 15.0]], G - 0.75, G - 0.35, 0.3)
  mansard(P.slate, x0, -4.0, -3.0, 10.5)
  mansard(P.slate, x0, 8.0, -8.1, 15.0)
  const stPeter: Face = { a: [x0, 15.0], b: [x0, yB] }
  const armBays = spaced(0, 15.0 - yB, 3)
  sideBays(P, stPeter, armBays, { lower: 'door', balcony: true })
  for (const s of armBays) dormer(P, stPeter, s)
  const armBack: Face = { a: [-8.1, 15.0], b: [x0, 15.0] }
  sideBays(P, armBack, spaced(0, 9.0, 2), { lower: 'window' })
  // The 6 m link in the courtyard's corner.
  block(P.stucco, -8.1, 10.5, -3.0, 11.5, 0, 6.0)
  // The L-shaped rear wings round the courtyard (lidar: eaves ~10, tops 12.7).
  const eW = wing(P, 9.6, yB, x1, 11.3, 10.0, 2.6)
  const rW = wing(P, -1.1, 11.3, x1, 15.1, 10.0, 1.9)
  sideBays(P, eW.e, spaced(0, 11.3 - yB, 2), { lower: 'window', h: 10 })
  sideBays(P, rW.e, spaced(0, 15.1 - 11.3, 1), { lower: 'window', h: 10 })
  sideBays(P, rW.n, spaced(0, x1 + 1.1, 5), { lower: 'window', h: 10 })

  finishModel('The Cabildo', 'nola-cabildo', [
    { part: P.stucco, material: { ...finish('cabildo-stucco', 0xdcd5c8), floodlight: frontLight(yF) } },
    { part: P.trim, material: PALETTE.trim },
    { part: P.slate, material: SLATE },
    { part: P.win, material: PALETTE.window },
    { part: P.iron, material: IRON },
    { part: P.door, material: DOOR },
  ], { bearing: 307.9, osm: 'way/329364483', height: 26.8 }, 6500)
}

if (import.meta.main) build()
