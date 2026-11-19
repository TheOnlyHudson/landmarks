/**
 * Schloss Charlottenburg, Spandauer Damm, Berlin (Arnold Nering 1695-99,
 * Johann Friedrich Eosander 1702-13 with the dome tower 1709-12; Neuer
 * Flügel by Georg Wenzeslaus von Knobelsdorff 1740-46; theatre by Carl
 * Gotthard Langhans 1788-91; rebuilt after 1943, the dome in 1957):
 * procedural, CC0-1.0, no textures. bun generators/berlin-schloss-charlottenburg.ts
 *
 * Writes models/berlin-schloss-charlottenburg.glb (low) and
 * models/berlin-schloss-charlottenburg.detail.glb (detail: window
 * surrounds and pilasters, the tower's pilasters, dormers and crowns, the
 * balustrade statues, roof dormers, the court gate's railing and piers).
 *
 * Map frame: x along the palace range (+x is compass 84.3, east), y across
 * it (+y is compass 354.3, north, the garden side), z up, metres, BEARING
 * 354.3 (the range's long walls in OSM). Anchor: the area centroid of the
 * outline way/186517395, lng 13.295355, lat 52.520781. z = 0 is the ground
 * (the site is flat).
 *
 * The whole range under the OSM outline is modelled, since the map hides
 * all of it once the outline is replaced: the Langhans theatre at the west
 * end, the Große Orangerie with its centre pavilion, the old palace (corps
 * de logis) with the dome tower and the two wings round the court of
 * honour, the link east and Knobelsdorff's Neuer Flügel. Left out: the
 * Great Elector's equestrian statue in the court, the Kleine Orangerie,
 * the Neuer Pavillon and the Belvedere (separate buildings), the gardens.
 *
 * What makes it Schloss Charlottenburg, and how each is drawn
 * - The dome tower over the corps de logis: square base storey, round drum
 *   with arched windows and paired pilasters, a green copper bell dome with
 *   oval dormers and gilt crowns, the lantern with its balcony, and the
 *   gilded Fortuna (a weathervane) on a ball at the top.
 * - The long ochre facades with white pilasters, cornices and window
 *   surrounds; the corps's balustrade with statues; the court side's
 *   central risalit with its pediment and three tall arched windows.
 * - The court of honour opening south between two wings with red
 *   mansard roofs and pedimented end pavilions.
 * - The red-tiled roofs of the Orangerie (one tall storey of arched
 *   windows, the taller centre pavilion), the theatre and the Neuer Flügel
 *   (two storeys, its centre risalit pedimented).
 *
 * Evidence
 * - OSM (ODbL): outline way/186517395 (building=castle, "Schloss
 *   Charlottenburg", wikidata Q154996), 496 m long; parts: Theaterbau
 *   way/122384013, the Orangerie's wings way/122384011 and /009 (gabled)
 *   and centre way/122384017 (hipped), the corps de logis way/122384037,
 *   /021, /035, the court wings way/122384031, /040 (gambrel), the tower
 *   way/122401455 (an octagon 13 m across), the Neuer Flügel way/122384007
 *   (hipped), two one-storey links way/704632957, /958. No heights tagged.
 * - Published (de.wikipedia "Schloss Charlottenburg"): the dates above;
 *   the dome rebuilt 1957; Fortuna 4.50 m, gilded copper, a weathervane.
 * - Photos (Wikimedia Commons), each as evidence:
 *   "Berlin Schloss Charlottenburg (S41 2558).jpg", Michael F. H. Barth,
 *     CC BY-SA 4.0 (the garden front square on: 7.9 px/m, the 140 m corps
 *     as scale; cornice 14.5, balustrade 15.9; tower stages scaled for its
 *     22 m set-back: drum to 28.5, dome to 35.5, lantern to 42.5, Fortuna's
 *     top 48)
 *     https://commons.wikimedia.org/wiki/File:Berlin_Schloss_Charlottenburg_(S41_2558).jpg
 *   "Charlottenburg Palace 2.jpg", Leonhard Lenz, CC BY-SA 4.0 (the court
 *     front: risalit, pediment, arched windows, the drum and dome)
 *     https://commons.wikimedia.org/wiki/File:Charlottenburg_Palace_2.jpg
 *   "Charlottenburg Hohenzollern 2.jpg", ernstol, CC BY-SA 3.0 (the court
 *     of honour with both wings, their mansards and end pavilions)
 *     https://commons.wikimedia.org/wiki/File:Charlottenburg_Hohenzollern_2.jpg
 *   "Aerial image of Schloss Charlottenburg (view from the southwest).jpg",
 *     Carsten Steger, CC BY-SA 4.0 (the whole range: roof colours, the
 *     Orangerie and theatre, the Neuer Flügel)
 *     https://commons.wikimedia.org/wiki/File:Aerial_image_of_Schloss_Charlottenburg_(view_from_the_southwest).jpg
 *   "Große Orangerie Schloss Charlottenburg.jpg", Oraber2006, CC BY-SA 4.0
 *     (the Orangerie's arched windows and centre pavilion)
 *     https://commons.wikimedia.org/wiki/File:Gro%C3%9Fe_Orangerie_Schloss_Charlottenburg.jpg
 *   "Schloss Charlottenburg rear view 1.jpg", Seanf, CC BY-SA 3.0 (the dome
 *     at night: dormers, crowns, lantern, Fortuna)
 *     https://commons.wikimedia.org/wiki/File:Schloss_Charlottenburg_rear_view_1.jpg
 *   "Schloss Charlottenburg, Nordansicht.jpg", PumpChecker, CC BY-SA 4.0;
 *   "2010-07-10 Berlin Charlottenburg Palace Fortuna.jpg", Sir James, CC
 *     BY-SA 3.0; "Schloss Charlottenburg nachts (Zuschnitt).jpg", Thomas
 *     Wolf, CC BY-SA 3.0 de (night: floodlit facades, lit windows).
 * - Estimated (from the photos, scaled by the corps's cornice): the wings'
 *   and the Neuer Flügel's eaves (12.5-13.5 m) and ridges (19-20 m); the
 *   Orangerie's eave (9.8 m) and ridge (15 m), its pavilion 14.5/20.5; the
 *   theatre 12.5/18; window bays 5.2 m.
 * - Invented/simplified: the roofs are hips or mansards (a steep lower
 *   slope, then a hip) on rectangles; the wings' mansards rise to 19.6 m,
 *   the corps's flanks to 18.6 behind the balustrade; window sizes are one pattern per block;
 *   the balustrade statues are small plain figures.
 * - Look-only references: none.
 * - Doubts: the theatre's roof (under scaffolding in the aerial photo);
 *   heights are photo-scaled, none are tagged or published.
 *
 * Night: the facades are floodlit (`_FLOODLIGHT`), windows glow, Fortuna
 * shines gold.
 */
import { Part, type V3 } from './mesh'
import { writeModel } from './london-buckingham-palace'
import { mat } from './berlin-konzerthaus'
import { lathe } from './berlin-fernsehturm'
import { ellipsoid, tube } from './nyc-columbus-monument'
import { box, cone, fquad, ftri, wallPlate, beam } from './berlin-oberbaum-bridge'

export const ID = 'berlin-schloss-charlottenburg'
export const BEARING = 354.3

type XY = [number, number]
const TAU = Math.PI * 2

type Mats = { wall: Part; trim: Part; roof: Part; patina: Part; gold: Part; win: Part }

/** A block of the palace: a rectangle, its eave, its roof and its window rows. */
type Block = {
  name: string
  r: [number, number, number, number] // x0, y0, x1, y1
  eave: number
  ridge: number // the roof's top (= eave for flat)
  rows: [number, number][] // window rows, sill to head
  arched?: boolean // round-headed windows (the Orangerie)
  pitch?: number
  balustrade?: boolean // a balustrade round a low roof (the corps)
  inset?: number // roof starts this far in from the walls
  mansard?: number // the height of a mansard's steep lower slope (its break)
}

const BLOCKS: Block[] = [
  { name: 'theatre', r: [-248.6, -8.5, -197.5, 11.4], eave: 12.5, ridge: 18.0, rows: [[1.2, 4.6], [6.2, 10.0]] },
  { name: 'orangerie-w', r: [-197.5, -3.7, -131.1, 6.6], eave: 9.8, ridge: 15.0, rows: [[0.9, 7.6]], arched: true, pitch: 5.6 },
  { name: 'orangerie-c', r: [-131.1, -5.2, -111.1, 8.0], eave: 14.5, ridge: 20.5, rows: [[0.9, 6.0], [8.0, 11.5]], arched: true },
  { name: 'orangerie-e', r: [-111.1, -3.7, -44.7, 6.7], eave: 9.8, ridge: 15.0, rows: [[0.9, 7.6]], arched: true, pitch: 5.6 },
  { name: 'corps-w', r: [-44.7, -2.9, 3.8, 25.1], eave: 14.5, ridge: 18.6, rows: [[1.0, 4.6], [6.0, 11.0]], balustrade: true, inset: 1.6, pitch: 4.3, mansard: 2.6 },
  { name: 'corps-c', r: [3.8, 5.5, 47.0, 23.5], eave: 14.5, ridge: 17.0, rows: [[1.0, 4.6], [6.0, 11.0]], balustrade: true, inset: 1.6, pitch: 4.3 },
  { name: 'corps-e', r: [47.0, 5.0, 95.1, 25.6], eave: 14.5, ridge: 18.6, rows: [[1.0, 4.6], [6.0, 11.0]], balustrade: true, inset: 1.6, pitch: 4.3, mansard: 2.6 },
  { name: 'wing-w', r: [-22.0, -52.0, -11.4, 5.0], eave: 12.5, ridge: 19.6, rows: [[1.0, 4.4], [5.8, 10.2]], mansard: 4.3 },
  { name: 'wing-w-end', r: [-27.8, -62.7, -11.4, -52.0], eave: 12.5, ridge: 19.6, rows: [[1.0, 4.4], [5.8, 10.2]], mansard: 4.3 },
  { name: 'wing-e', r: [62.1, -53.0, 72.5, 5.0], eave: 12.5, ridge: 19.6, rows: [[1.0, 4.4], [5.8, 10.2]], mansard: 4.3 },
  { name: 'wing-e-end', r: [62.1, -63.0, 79.0, -53.0], eave: 12.5, ridge: 19.6, rows: [[1.0, 4.4], [5.8, 10.2]], mansard: 4.3 },
  { name: 'link-e', r: [72.5, -4.0, 95.1, 5.0], eave: 12.5, ridge: 19.6, rows: [[1.0, 4.4], [5.8, 10.2]], mansard: 4.3 },
  { name: 'neuer-fluegel', r: [95.1, -3.6, 247.6, 8.0], eave: 13.5, ridge: 19.5, rows: [[1.0, 5.0], [6.6, 11.2]] },
  { name: 'nf-risalit', r: [159.4, -4.9, 182.3, 8.9], eave: 14.5, ridge: 20.5, rows: [[1.0, 5.0], [6.6, 11.2]] },
  { name: 'link-w1', r: [-31.2, 6.5, -21.7, 13.6], eave: 5.0, ridge: 5.0, rows: [] },
  { name: 'link-e1', r: [72.0, 8.7, 83.4, 15.0], eave: 5.0, ridge: 5.0, rows: [] },
]

// The tower (OSM's octagon), its centre, and the court-side risalit.
const TC: XY = [25.35, 8.7]
const RISALIT: [number, number, number, number] = [18.6, 0.6, 32.1, 5.5]
const GARDEN_OVAL: [number, number, number, number] = [18.8, 23.5, 31.9, 30.9]

const insideBlock = (p: XY, skip: Block | null, pad = 0) => BLOCKS.some((b) => b !== skip && p[0] > b.r[0] - pad && p[0] < b.r[2] + pad && p[1] > b.r[1] - pad && p[1] < b.r[3] + pad)

/** A hipped roof over a rectangle from z0 to z1, ridge along the longer side. */
function hip(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number) {
  const w = x1 - x0, d = y1 - y0
  const ring0: V3[] = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]]
  let top: V3[]
  if (w >= d) {
    const i = d / 2, cy = (y0 + y1) / 2
    top = [[x0 + i, cy - 0.05, z1], [x1 - i, cy - 0.05, z1], [x1 - i, cy + 0.05, z1], [x0 + i, cy + 0.05, z1]]
  } else {
    const i = w / 2, cx = (x0 + x1) / 2
    top = [[cx - 0.05, y0 + i, z1], [cx + 0.05, y0 + i, z1], [cx + 0.05, y1 - i, z1], [cx - 0.05, y1 - i, z1]]
  }
  p.loft([ring0, top])
  p.cap(top, true)
}

/** A mansard: a steep lower slope (in 1.3 m over `brk`), then a hip to the ridge. */
function mansard(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, brk: number, z1: number) {
  const k = 1.3
  const r0: V3[] = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]]
  const r1: V3[] = [[x0 + k, y0 + k, z0 + brk], [x1 - k, y0 + k, z0 + brk], [x1 - k, y1 - k, z0 + brk], [x0 + k, y1 - k, z0 + brk]]
  p.loft([r0, r1])
  hip(p, x0 + k, y0 + k, x1 - k, y1 - k, z0 + brk, z1)
}

/** The four faces of a rectangle, each as an origin, a unit run and an outward normal. */
function faces(r: [number, number, number, number]) {
  const [x0, y0, x1, y1] = r
  return [
    { o: [x0, y0] as XY, u: [1, 0] as XY, n: [0, -1] as XY, len: x1 - x0 },
    { o: [x1, y0] as XY, u: [0, 1] as XY, n: [1, 0] as XY, len: y1 - y0 },
    { o: [x1, y1] as XY, u: [-1, 0] as XY, n: [0, 1] as XY, len: x1 - x0 },
    { o: [x0, y1] as XY, u: [0, -1] as XY, n: [-1, 0] as XY, len: y1 - y0 },
  ]
}

/** A window opening drawn flush: a panel, round-headed if asked, a surround in detail. */
function windowAt(m: Mats, f: ReturnType<typeof faces>[number], s: number, w: number, z0: number, z1: number, arched: boolean, detail: boolean) {
  const at = (u: number, d: number, z: number): V3 => [f.o[0] + f.u[0] * u + f.n[0] * d, f.o[1] + f.u[1] * u + f.n[1] * d, z]
  const n: V3 = [f.n[0], f.n[1], 0]
  if (arched) {
    const k = detail ? 8 : 3, zs = z1 - w / 2
    const pts: XY[] = [[s - w / 2, z0], [s + w / 2, z0], [s + w / 2, zs]]
    for (let i = 1; i < k; i++) { const a = (Math.PI * i) / k; pts.push([s + (w / 2) * Math.cos(a), zs + (w / 2) * Math.sin(a)]) }
    pts.push([s - w / 2, zs])
    for (let i = 1; i < pts.length - 1; i++) ftri(m.win, at(pts[0][0], 0.04, pts[0][1]), at(pts[i][0], 0.04, pts[i][1]), at(pts[i + 1][0], 0.04, pts[i + 1][1]), n)
  } else fquad(m.win, at(s - w / 2, 0.04, z0), at(s + w / 2, 0.04, z0), at(s + w / 2, 0.04, z1), at(s - w / 2, 0.04, z1), n)
  if (detail) {
    // A pale surround: sill, jambs, a cornice over the head.
    const t = 0.22, dd = 0.1
    const strip = (u0: number, u1: number, za: number, zb: number) => {
      const P = (u: number, d: number, z: number) => at(u, d, z)
      fquad(m.trim, P(u0, dd, za), P(u1, dd, za), P(u1, dd, zb), P(u0, dd, zb), n)
      fquad(m.trim, P(u0, dd, zb), P(u1, dd, zb), P(u1, 0, zb), P(u0, 0, zb), [0, 0, 1])
      fquad(m.trim, P(u0, 0, za), P(u1, 0, za), P(u1, dd, za), P(u0, dd, za), [0, 0, -1])
    }
    strip(s - w / 2 - t, s + w / 2 + t, z0 - t, z0)
    strip(s - w / 2 - t, s - w / 2, z0, z1)
    strip(s + w / 2, s + w / 2 + t, z0, z1)
    if (!arched) strip(s - w / 2 - t * 1.6, s + w / 2 + t * 1.6, z1, z1 + 0.35)
  }
}

function palaceBlock(m: Mats, b: Block, detail: boolean) {
  const [x0, y0, x1, y1] = b.r
  // Walls with a plinth line; the cornice as a projecting band.
  box(m.wall, x0, y0, x1, y1, 0, b.eave - 0.6, false, false)
  const c = 0.45
  box(m.trim, x0 - c, y0 - c, x1 + c, y1 + c, b.eave - 0.6, b.eave, true, b.ridge <= b.eave)
  if (b.balustrade) {
    // A balustrade round the roof's edge: a solid rail in low, balusters in detail.
    const h = 1.4
    for (const f of faces(b.r)) {
      const a: XY = [f.o[0], f.o[1]], e: XY = [f.o[0] + f.u[0] * f.len, f.o[1] + f.u[1] * f.len]
      const inn: XY = [f.n[0] * -0.35, f.n[1] * -0.35]
      const A: V3 = [a[0] + inn[0], a[1] + inn[1], b.eave], E: V3 = [e[0] + inn[0], e[1] + inn[1], b.eave]
      if (detail) {
        beam(m.trim, [A[0], A[1], b.eave + h - 0.15], [E[0], E[1], b.eave + h - 0.15], 0.5, [0, 0, 1], true, 0.3)
        beam(m.trim, [A[0], A[1], b.eave + 0.12], [E[0], E[1], b.eave + 0.12], 0.5, [0, 0, 1], true, 0.24)
        const n = Math.floor(f.len / 0.8)
        for (let i = 1; i < n; i++) {
          const t = i / n, P: V3 = [A[0] + (E[0] - A[0]) * t, A[1] + (E[1] - A[1]) * t, b.eave + 0.24]
          beam(m.trim, P, [P[0], P[1], b.eave + h - 0.3], 0.2, [f.n[0], f.n[1], 0], false)
        }
        // Statues on the balustrade's piers, every other bay along the long fronts.
        if (f.len > 30) for (let s = 5.2; s < f.len - 2; s += 10.4) {
          const P: V3 = [A[0] + f.u[0] * s, A[1] + f.u[1] * s, b.eave + h]
          if (insideBlock([P[0] + f.n[0] * 1.5, P[1] + f.n[1] * 1.5], b)) continue
          box(m.trim, P[0] - 0.35, P[1] - 0.35, P[0] + 0.35, P[1] + 0.35, b.eave, b.eave + h + 0.15)
          tube(m.trim, [[P[0], P[1], b.eave + h + 0.15], [P[0], P[1], b.eave + h + 1.3], [P[0], P[1], b.eave + h + 1.75]], [0.32, 0.26, 0.2], 5)
          ellipsoid(m.trim, [P[0], P[1], b.eave + h + 1.95], [0.17, 0.17, 0.2], 5, 3)
        }
      } else {
        wallPlate(m.trim, [[0, b.eave], [f.len, b.eave], [f.len, b.eave + h], [0, b.eave + h]], [], 0.3, (s, w, z) => [A[0] + f.u[0] * s + f.n[0] * w, A[1] + f.u[1] * s + f.n[1] * w, z], [f.n[0], f.n[1], 0])
      }
    }
  }
  if (b.ridge > b.eave) {
    const i = b.inset ?? 0
    const rr = [x0 + i - (i ? 0 : c), y0 + i - (i ? 0 : c), x1 - i + (i ? 0 : c), y1 - i + (i ? 0 : c)] as const
    if (b.mansard) mansard(m.roof, rr[0], rr[1], rr[2], rr[3], b.eave, b.mansard, b.ridge)
    else hip(m.roof, rr[0], rr[1], rr[2], rr[3], b.eave, b.ridge)
  }
  // Windows on every face that is open air, at the block's pitch.
  const pitch = b.pitch ?? 5.2
  for (const f of faces(b.r)) {
    const n = Math.floor((f.len - 1.6) / pitch)
    if (n < 1) continue
    const start = (f.len - n * pitch) / 2 + pitch / 2
    for (let i = 0; i < n; i++) {
      const s = start + i * pitch
      const q: XY = [f.o[0] + f.u[0] * s + f.n[0] * 0.8, f.o[1] + f.u[1] * s + f.n[1] * 0.8]
      if (insideBlock(q, b, 0.2)) continue
      if (q[0] > RISALIT[0] - 0.5 && q[0] < RISALIT[2] + 0.5 && q[1] > RISALIT[1] - 1 && q[1] < RISALIT[3] + 1) continue
      if (q[0] > GARDEN_OVAL[0] - 0.5 && q[0] < GARDEN_OVAL[2] + 0.5 && q[1] > GARDEN_OVAL[1] - 1 && q[1] < GARDEN_OVAL[3] + 1) continue
      for (const [z0, z1] of b.rows) windowAt(m, f, s, b.arched ? 2.4 : 1.9, z0, z1, !!b.arched, detail)
      // Pilasters between the bays (detail).
      if (detail && i < n - 1 && b.eave > 10) {
        const u = s + pitch / 2
        const A: V3 = [f.o[0] + f.u[0] * u + f.n[0] * 0.08, f.o[1] + f.u[1] * u + f.n[1] * 0.08, 0.6]
        beam(m.trim, A, [A[0], A[1], b.eave - 0.6], 0.6, [f.n[0], f.n[1], 0], false, 0.16)
      }
    }
  }
  // Roof dormers on the Orangerie, the wings and the Neuer Flügel (detail).
  if (detail && b.ridge - b.eave > 4 && !b.balustrade) {
    const [ax0, ay0, ax1, ay1] = b.r
    const long = ax1 - ax0 >= ay1 - ay0
    const L = long ? ax1 - ax0 : ay1 - ay0, D = long ? ay1 - ay0 : ax1 - ax0
    const nD = Math.floor((L - 10) / (b.pitch ?? 5.2))
    for (const side of [-1, 1]) for (let i = 0; i < nD; i++) {
      const s = (long ? ax0 : ay0) + 5 + (i + 0.5) * ((L - 10) / nD)
      const off = D / 2 - 1.6, zc = b.eave + 1.0
      const cx = long ? s : (ax0 + ax1) / 2 + side * off, cy = long ? (ay0 + ay1) / 2 + side * off : s
      if (insideBlock([cx + (long ? 0 : side * 2), cy + (long ? side * 2 : 0)], b)) continue
      const ox = long ? 0 : side, oy = long ? side : 0
      const P = (u: number, d: number, z: number): V3 => long ? [cx + u, cy + oy * d, z] : [cx + ox * d, cy + u, z]
      fquad(m.wall, P(-0.6, 0, zc), P(0.6, 0, zc), P(0.6, 0, zc + 1.5), P(-0.6, 0, zc + 1.5), [ox, oy, 0])
      fquad(m.win, P(-0.35, 0.03, zc + 0.2), P(0.35, 0.03, zc + 0.2), P(0.35, 0.03, zc + 1.25), P(-0.35, 0.03, zc + 1.25), [ox, oy, 0])
      fquad(m.roof, P(-0.75, 0.1, zc + 1.5), P(0.75, 0.1, zc + 1.5), P(0.75, -1.4, zc + 2.2), P(-0.75, -1.4, zc + 2.2), [ox * 0.4, oy * 0.4, 1])
    }
  }
}

/** A triangular pediment on a face, from u0 to u1 at height z, rising h. */
function pediment(m: Mats, o: XY, u: XY, n: XY, u0: number, u1: number, z: number, h: number, d: number) {
  const P = (s: number, w: number, zz: number): V3 => [o[0] + u[0] * s + n[0] * w, o[1] + u[1] * s + n[1] * w, zz]
  wallPlate(m.trim, [[u0, z], [u1, z], [(u0 + u1) / 2, z + h]], [], d, (s, w, zz) => P(s, w, zz), [n[0], n[1], 0])
}

/** The court-side risalit and the oval garden hall under the tower. */
function centre(m: Mats, detail: boolean) {
  const [x0, y0, x1, y1] = RISALIT
  box(m.wall, x0, y0, x1, 6.0, 0, 15.0)
  box(m.trim, x0 - 0.45, y0 - 0.45, x1 + 0.45, 6.4, 14.4, 15.0)
  // The pediment over the risalit's court front.
  pediment(m, [x0, y0], [1, 0], [0, -1], -0.4, x1 - x0 + 0.4, 15.0, 3.4, 0.9)
  // Three tall arched windows over the doors, two side windows each floor.
  const f = { o: [x0, y0] as XY, u: [1, 0] as XY, n: [0, -1] as XY, len: x1 - x0 }
  for (const s of [3.4, 6.75, 10.1]) {
    windowAt(m, f, s, 2.3, 6.0, 11.6, true, detail)
    windowAt(m, f, s, 1.9, 0.2, 4.2, true, detail)
  }
  // Paired pilasters on the risalit (detail).
  if (detail) for (const s of [0.6, 1.4, 5.1, 8.4, 12.1, 12.9]) beam(m.trim, [x0 + s, y0 - 0.08, 0.6], [x0 + s, y0 - 0.08, 14.4], 0.5, [0, -1, 0], false, 0.16)
  // The oval garden hall: a round-ended projection with tall windows.
  const [gx0, gy0, gx1, gy1] = GARDEN_OVAL
  const r = (gx1 - gx0) / 2, cx = (gx0 + gx1) / 2, cy = gy1 - r
  const k = detail ? 16 : 8
  const ring = (z: number, grow = 0): V3[] => {
    const pts: V3[] = [[gx0 - grow, gy0, z], [gx1 + grow, gy0, z]]
    for (let i = 0; i <= k; i++) { const a = (Math.PI * i) / k; pts.push([cx + (r + grow) * Math.cos(a), cy + (r + grow) * Math.sin(a), z]) }
    return pts
  }
  m.wall.loft([ring(0), ring(14.0)])
  m.trim.loft([ring(14.0, 0.45), ring(14.5, 0.45)])
  m.trim.cap(ring(14.5, 0.45), true)
  for (let i = 1; i < k; i += 2) {
    const a = (Math.PI * i) / k, c: XY = [cx + (r + 0.04) * Math.cos(a), cy + (r + 0.04) * Math.sin(a)]
    const n: XY = [Math.cos(a), Math.sin(a)], t: XY = [-n[1], n[0]]
    const ff = { o: [c[0] - t[0] * 5, c[1] - t[1] * 5] as XY, u: t, n, len: 10 }
    windowAt(m, ff, 5, 1.5, 6.0, 11.0, true, detail)
    windowAt(m, ff, 5, 1.5, 0.8, 4.6, true, detail)
  }
}

/** The dome tower over the centre, from the roof to Fortuna. */
function towerUnscaled(m: Mats, detail: boolean) {
  const [cx, cy] = TC
  const k = detail ? 32 : 14
  // Square base storey (an octagon-chamfered square, as in OSM) above the roof.
  const oct = (h: number, ch: number, z: number): V3[] => [
    [cx - h + ch, cy - h, z], [cx + h - ch, cy - h, z], [cx + h, cy - h + ch, z], [cx + h, cy + h - ch, z],
    [cx + h - ch, cy + h, z], [cx - h + ch, cy + h, z], [cx - h, cy + h - ch, z], [cx - h, cy - h + ch, z],
  ]
  m.wall.loft([oct(6.5, 1.6, 14.5), oct(6.5, 1.6, 17.0)])
  m.trim.loft([oct(6.8, 1.7, 17.0), oct(6.8, 1.7, 17.5)])
  m.trim.cap(oct(6.8, 1.7, 17.5), true)
  m.trim.loft([oct(6.8, 1.7, 14.5), oct(6.8, 1.7, 15.0)])
  // Drum, cornice, bell dome, lantern with its balcony, cap, ball.
  const R = 5.7
  lathe([[R, 17.5], [R, 29.4]], () => m.wall, k, 40, TC)
  lathe([[R + 0.5, 29.4], [R + 0.5, 30.2], [R + 0.2, 30.2]], () => m.trim, k, 40, TC)
  const dome: [number, number][] = [[R + 0.2, 30.2], [R + 0.1, 31.6], [R - 0.4, 33.1], [R - 1.3, 34.6], [R - 2.6, 35.9], [2.3, 36.5], [1.9, 36.8]]
  lathe(dome, () => m.patina, k, 50, TC)
  lathe([[2.5, 36.8], [2.5, 37.2], [1.7, 37.2]], () => m.gold, k, 40, TC) // gilt balcony rail
  lathe([[1.7, 37.2], [1.7, 40.4], [2.0, 40.4], [2.0, 40.8], [1.3, 41.4], [0.5, 42.2], [0.35, 42.6]], () => m.patina, k, 45, TC)
  ellipsoid(m.gold, [cx, cy, 43.0], [0.5, 0.5, 0.5], detail ? 12 : 6, detail ? 6 : 3)
  // Arched windows and paired pilasters round the drum; the clock faces.
  const nW = 8
  for (let i = 0; i < nW; i++) {
    const a = (i * TAU) / nW + Math.PI / 8 - Math.PI / 2, n: XY = [Math.cos(a), Math.sin(a)], t: XY = [-n[1], n[0]]
    const c: XY = [cx + n[0] * (R + 0.02), cy + n[1] * (R + 0.02)]
    const f = { o: [c[0] - t[0] * 2, c[1] - t[1] * 2] as XY, u: t, n, len: 4 }
    windowAt(m, f, 2, 1.6, 19.6, 25.6, true, detail)
    if (detail) {
      const b = (i * TAU) / nW - Math.PI / 2, nb: XY = [Math.cos(b), Math.sin(b)]
      for (const off of [-0.45, 0.45]) {
        const tb: XY = [-nb[1], nb[0]], P: XY = [cx + nb[0] * (R + 0.1) + tb[0] * off, cy + nb[1] * (R + 0.1) + tb[1] * off]
        beam(m.trim, [P[0], P[1], 17.5], [P[0], P[1], 29.4], 0.38, [nb[0], nb[1], 0], false, 0.22)
      }
    }
  }
  // Clocks over the arches facing the court and the garden.
  for (const sy of [-1, 1]) {
    const kk = detail ? 16 : 8
    const circ: XY[] = Array.from({ length: kk }, (_, i) => [0.95 * Math.cos((i * TAU) / kk), 27.6 + 0.95 * Math.sin((i * TAU) / kk)] as XY)
    wallPlate(m.win, circ, [], 0.08, (s, w, z) => [cx + s * -sy, cy + sy * (R + 0.08 + w), z], [0, sy, 0], { faces: [true, false] })
  }
  // Oval dormers on the dome with gilt crowns over them.
  for (let i = 0; i < 4; i++) {
    const a = (i * TAU) / 4 - Math.PI / 2, n: XY = [Math.cos(a), Math.sin(a)], t: XY = [-n[1], n[0]]
    const r0 = R - 0.6, z0 = 32.3
    const base: XY = [cx + n[0] * r0, cy + n[1] * r0]
    const P = (u: number, d: number, z: number): V3 => [base[0] + t[0] * u + n[0] * d, base[1] + t[1] * u + n[1] * d, z]
    // The dormer: a small box with a round window.
    const F: V3[] = [P(-0.9, 0.6, z0 - 0.4), P(0.9, 0.6, z0 - 0.4), P(0.9, 0.6, z0 + 1.8), P(-0.9, 0.6, z0 + 1.8)]
    fquad(m.patina, F[0], F[1], F[2], F[3], [n[0], n[1], 0])
    fquad(m.patina, F[3], F[2], P(0.9, -0.8, z0 + 1.8), P(-0.9, -0.8, z0 + 1.8), [0, 0, 1])
    fquad(m.patina, F[0], F[3], P(-0.9, -0.8, z0 + 1.8), P(-0.9, -0.8, z0 - 0.4), [-t[0], -t[1], 0])
    fquad(m.patina, F[1], P(0.9, -0.8, z0 - 0.4), P(0.9, -0.8, z0 + 1.8), F[2], [t[0], t[1], 0])
    const kk = detail ? 12 : 6
    const ov: XY[] = Array.from({ length: kk }, (_, j) => [0.55 * Math.cos((j * TAU) / kk), z0 + 0.7 + 0.7 * Math.sin((j * TAU) / kk)] as XY)
    wallPlate(m.win, ov, [], 0.06, (s, w, z) => P(s, 0.63 + w, z), [n[0], n[1], 0], { faces: [true, false] })
    // The crown: a gilt drum with a cross-ball (bold, for the phone views).
    cone(m.gold, ...P(0, 0.2, 0).slice(0, 2) as XY, 0.55, 0.65, z0 + 1.8, z0 + 2.5, detail ? 10 : 5)
    ellipsoid(m.gold, P(0, 0.2, z0 + 2.75), [0.3, 0.3, 0.3], detail ? 8 : 4, detail ? 4 : 2)
  }
  fortuna(m, cx, cy, 43.45, detail)
}

/**
 * The tower, scaled up 30% about its foot on the roof (14.5 m): the photos
 * from the court show it rising about twice the corps's height, the drum,
 * dome and lantern each larger than the first measurement gave.
 */
const TOWER_SCALE = 1.3
function tower(m: Mats, detail: boolean) {
  const t: Mats = { wall: new Part(), trim: new Part(), roof: new Part(), patina: new Part(), gold: new Part(), win: new Part() }
  towerUnscaled(t, detail)
  for (const key of Object.keys(t) as (keyof Mats)[]) {
    const src = t[key], dst = m[key]
    // Part positions are stored in the glTF frame: (x, z, -y).
    for (let i = 0; i < src.pos.length; i += 3) {
      dst.pos.push(TC[0] + (src.pos[i] - TC[0]) * TOWER_SCALE, 14.5 + (src.pos[i + 1] - 14.5) * TOWER_SCALE, -TC[1] + (src.pos[i + 2] + TC[1]) * TOWER_SCALE)
    }
    dst.nrm.push(...src.nrm)
    dst.uv.push(...src.uv)
  }
}

/** Fortuna on her ball: standing on one foot, the billowing veil held over her head. */
function fortuna(m: Mats, cx: number, cy: number, z: number, detail: boolean) {
  const s = 4.5 / 4.0 // published 4.5 m with the veil
  const sides = detail ? 7 : 4
  const P = (x: number, y: number, zz: number): V3 => [cx + x * s, cy + y * s, z + zz * s]
  // Standing leg, the other leg kicked back, the body, head.
  tube(m.gold, [P(0, 0, 0), P(0.05, 0, 0.9), P(0.1, 0, 1.6)], [0.13 * s, 0.16 * s, 0.22 * s], sides)
  tube(m.gold, [P(0.1, 0, 1.5), P(-0.45, 0, 1.15), P(-0.9, 0, 1.3)], [0.17 * s, 0.13 * s, 0.09 * s], sides)
  tube(m.gold, [P(0.1, 0, 1.55), P(0.12, 0, 2.2), P(0.1, 0, 2.75)], [0.26 * s, 0.24 * s, 0.17 * s], sides)
  ellipsoid(m.gold, P(0.12, 0, 2.97), [0.17 * s, 0.17 * s, 0.2 * s], detail ? 8 : 4, detail ? 4 : 2)
  // Arms raised to the veil.
  for (const e of [-1, 1]) tube(m.gold, [P(0.1, e * 0.2, 2.65), P(0.15 + 0.35 * e, e * 0.45, 3.15), P(0.2 + 0.7 * e, e * 0.5, 3.55)], [0.08 * s, 0.07 * s, 0.06 * s], sides)
  // The veil: a curved sail from hand to hand over her head (two-sided).
  const n = detail ? 8 : 4
  const arc: V3[] = [], arc2: V3[] = []
  for (let i = 0; i <= n; i++) {
    const t = i / n, a = Math.PI * t
    arc.push(P(0.2 - 0.7 * Math.cos(a), -0.5 * Math.cos(a) - 0.25 * Math.sin(a), 3.55 + 0.45 * Math.sin(a)))
    arc2.push(P(0.2 - 0.95 * Math.cos(a) - 0.2, -0.5 * Math.cos(a) - 0.5 * Math.sin(a), 3.2 + 0.3 * Math.sin(a)))
  }
  for (let i = 0; i < n; i++) {
    m.gold.tri(arc[i], arc[i + 1], arc2[i + 1]); m.gold.tri(arc[i], arc2[i + 1], arc2[i])
    m.gold.tri(arc[i], arc2[i + 1], arc[i + 1]); m.gold.tri(arc[i], arc2[i], arc2[i + 1])
  }
}

/** The Neuer Flügel's risalit pediments and the wings' end pediments. */
function pediments(m: Mats) {
  // Neuer Flügel risalit, both fronts.
  pediment(m, [165.0, -4.9], [1, 0], [0, -1], 0, 11.7, 14.5, 2.6, 0.8)
  pediment(m, [176.7, 8.9], [-1, 0], [0, 1], 0, 11.7, 14.5, 2.6, 0.8)
  // The court wings' end pavilions face the street (south).
  pediment(m, [-27.8, -62.7], [1, 0], [0, -1], 2.0, 14.4, 12.5, 2.2, 0.8)
  pediment(m, [62.1, -63.0], [1, 0], [0, -1], 2.3, 14.6, 12.5, 2.2, 0.8)
  // Orangerie centre pavilion, garden and court sides.
  pediment(m, [-128.0, -5.2], [1, 0], [0, -1], 0, 13.9, 14.5, 2.0, 0.8)
  pediment(m, [-114.1, 8.0], [-1, 0], [0, 1], 0, 13.9, 14.5, 2.0, 0.8)
}

/** The court's gate: railing between the wings' ends and the two piers (detail). */
function courtGate(m: Mats) {
  const y = -63.5
  for (const x of [17.5, 32.5]) {
    box(m.trim, x - 1.2, y - 1.2, x + 1.2, y + 1.2, 0, 4.2)
    box(m.trim, x - 1.45, y - 1.45, x + 1.45, y + 1.45, 4.2, 4.7)
    // The Borghese fencer on each pier, lunging.
    tube(m.trim, [[x - 0.8, y, 4.7], [x, y, 5.6], [x + 0.6, y, 6.4], [x + 0.9, y, 6.9]], [0.18, 0.28, 0.26, 0.2], 6)
    tube(m.trim, [[x, y, 5.6], [x + 0.7, y, 4.7]], [0.2, 0.15], 6)
    ellipsoid(m.trim, [x + 1.05, y, 7.1], [0.18, 0.18, 0.2], 6, 3)
  }
  for (const [a, b] of [[-11.4, 16.3], [18.7, 31.3], [33.7, 62.1]]) {
    beam(m.metal(), [a, y, 3.0], [b, y, 3.0], 0.12)
    beam(m.metal(), [a, y, 0.3], [b, y, 0.3], 0.15)
    for (let x = a + 0.4; x < b; x += 0.8) beam(m.metal(), [x, y, 0.3], [x, y, 3.2], 0.06, [0, -1, 0], false)
  }
}

function build(detail: boolean) {
  const gate = new Part()
  const m: Mats & { metal: () => Part } = { wall: new Part(), trim: new Part(), roof: new Part(), patina: new Part(), gold: new Part(), win: new Part(), metal: () => m.patina }
  for (const b of BLOCKS) palaceBlock(m, b, detail)
  centre(m, detail)
  tower(m, detail)
  pediments(m)
  if (detail) courtGate(m as any)
  void gate
  return m
}

function write(detail: boolean) {
  const m = build(detail)
  const flood = (p: V3, n: V3) => (n[2] > 0.7 ? 0.15 : p[2] < 22 ? 0.85 : 0.6)
  writeModel('Schloss Charlottenburg', ID, [
    { part: m.wall, material: { ...mat('charlottenburg-ochre', 0xe8cfa0), floodlight: flood } },
    { part: m.trim, material: { ...mat('trim', 0xf6efe2), floodlight: flood } },
    { part: m.roof, material: mat('terracotta', 0xb5634c, 0.9) },
    { part: m.patina, material: { ...mat('patina', 0x6f9c87), floodlight: (p) => (p[2] > 28 ? 0.7 : 0) } },
    { part: m.gold, material: { ...mat('gilt', 0xd9b25a, 0.4), floodlight: () => 1 } },
    { part: m.win, material: mat('window', 0x64798a, 0.35) },
  ], { bearing: BEARING, osm: 'way/186517395', height: 58.0 }, detail ? 40000 : 6500, detail ? `${ID}.detail` : ID)
}

if (import.meta.main) {
  write(false)
  write(true)
}
