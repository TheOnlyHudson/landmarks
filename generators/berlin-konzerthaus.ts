/**
 * Konzerthaus Berlin (the Schauspielhaus, Karl Friedrich Schinkel, 1818-1821;
 * rebuilt 1979-1984), Gendarmenmarkt: procedural, CC0-1.0, no textures.
 * bun generators/berlin-konzerthaus.ts
 *
 * Writes models/berlin-konzerthaus.glb (low) and
 * models/berlin-konzerthaus.detail.glb (detail). Also exports the small
 * classical kit the other Gendarmenmarkt generators import (`gableBlock`,
 * `bays`, `statue`, `tripodBowl`, `stair`, `sculpt`, `mat`): merge this one
 * before berlin-franzoesischer-dom.ts, berlin-deutscher-dom.ts.
 *
 * Map frame: x east, y north, z up, metres, turned to BEARING 354.35 (the
 * long walls of OSM way/217512230): model +y is compass 354.35, so the
 * portico faces model +x (compass 84.35, onto the Gendarmenmarkt). Anchor:
 * the area centroid of way/217512230, lng 13.391816, lat 52.513584.
 * z = 0 is the square's paving (the site is flat).
 *
 * What makes it the Konzerthaus, and how each is drawn
 * - The raised hexastyle Ionic portico on the east front: six real round
 *   columns (8 sides low, 14 detail) with volute capitals on a podium a
 *   full storey up, the entablature (the "KONZERTHAUS BERLIN" frieze is a
 *   plain band), the pediment with Tieck's Niobid relief (relief figures in
 *   the detail model).
 * - The broad open stair (Freitreppe) up to the portico between its two
 *   massive cheek blocks, each carrying a bronze group (lion and panther with
 *   a music-making putto).
 * - The raised central block (Oberbau) over the theatre with its row of
 *   attic windows between pilasters and its own pediments east and west;
 *   Apollo in the griffin chariot (Tieck) on the east apex, Pegasus on the
 *   west apex, the green bronze tripod bowls on the four pediment corners,
 *   and the stone figures on the portico pediment.
 * - The two lower wings (north and south) on Schinkel's pier grid: piers
 *   between tall grouped windows over a rusticated ground floor, the
 *   pediments on the wing ends (Bacchanal north, Orpheus south) with
 *   figures on their apexes and corners.
 *
 * Evidence
 * - OSM (ODbL): way/217512230 (building=theatre "Konzerthaus Berlin",
 *   wikidata Q702548) and its parts way/767535327 (central block, gabled),
 *   way/767535328, way/767535329 (the flanks beside the portico),
 *   way/767535330, way/767535332 (the wings, gabled), way/767535331 (the
 *   portico). No heights are tagged.
 * - Published (de.wikipedia "Konzerthaus Berlin"): Schinkel 1818-21 on the
 *   old foundations; the centre widened east and west and raised by an
 *   Oberbau with a second gable; four pediment reliefs (Niobids over the
 *   portico, the stage arts in the gable above, a Bacchanal north, Orpheus
 *   and Eurydice south); Tieck's bronze lion and panther with putti beside
 *   the stair; columns and cornices in sandstone, the rest clad in
 *   sandstone 1883/84.
 * - Photos (Wikimedia Commons), each as evidence:
 *   "150418 Konzerthaus Berlin.jpg", Ansgar Koreng, CC BY 3.0 de
 *     https://commons.wikimedia.org/wiki/File:150418_Konzerthaus_Berlin.jpg
 *     (square-on east front: every height and width below);
 *   "Berlin Konzerthaus BW 1.jpg", Berthold Werner, CC BY-SA 3.0
 *     https://commons.wikimedia.org/wiki/File:Berlin_Konzerthaus_BW_1.jpg
 *   "Berlin-Gendarmenmarkt-40-Konzerthaus-2017-gje.jpg", Gerd Eichmann,
 *     CC BY-SA 4.0 (east front, colours under cloud)
 *     https://commons.wikimedia.org/wiki/File:Berlin-Gendarmenmarkt-40-Konzerthaus-2017-gje.jpg
 *   "Konzerthaus-Gendarmenmarkt-Berlin-Mitte-02-2018a.jpg", Gunnar Klack,
 *     CC BY-SA 4.0 (from the south-east: the south wing's end pediment, the
 *     Oberbau's side windows, the depth of portico, cheeks and stair)
 *     https://commons.wikimedia.org/wiki/File:Konzerthaus-Gendarmenmarkt-Berlin-Mitte-02-2018a.jpg
 *   "Konzerthaus, Gendarmenmarkt, Berlin, 1818-1821 (5) (25311525447).jpg",
 *     Richard Mortel, CC BY 2.0 (the portico and stair close up)
 *     https://commons.wikimedia.org/wiki/File:Konzerthaus,_Gendarmenmarkt,_Berlin,_1818-1821_(5)_(25311525447).jpg
 *   "Schauspielhaus (Berlin-Mitte).Tieck.Apollo im Greifenwagen.09065015.ajb.jpg"
 *     and "...Tieck.Pegasus.09065015.ajb.jpg", Ajepbah, CC BY-SA 3.0 de
 *     (the Apollo group, the Pegasus and the tripod bowls)
 *     https://commons.wikimedia.org/wiki/File:Schauspielhaus_(Berlin-Mitte).Tieck.Apollo_im_Greifenwagen.09065015.ajb.jpg
 *     https://commons.wikimedia.org/wiki/File:Schauspielhaus_(Berlin-Mitte).Tieck.Pegasus.09065015.ajb.jpg
 *   "Gendarmenmarkt-Konzerthaus-Franzoesischer-Dom-2015.jpg", Tuxyso,
 *     CC BY-SA 3.0; "Konzerthaus Berlin Gendarmenmarkt 2.JPG", Schlaier,
 *     public domain (context, the north wing).
 * - Measured from the Koreng photo, with the camera placed by OSM widths
 *   (focal length about 1020 px; camera about 90 m east of the anchor,
 *   1.6 m up): wing cornice 19.0 m, wing gable apex 24.0; portico podium
 *   5.4, column tops 16.8, the cornice carried round portico and flanks at
 *   20.3, portico apex 23.9; Oberbau cornice 28.8, apex 32.7; the Apollo
 *   group to 37.4; column diameter 1.6 m. Plan from OSM.
 * - Estimated: the stair runs 10.2 m out from the portico (27 steps of
 *   0.2 m); cheek blocks 3.2 m wide; window sizes from the photos; the west
 *   front (on the Charlottenstrasse: no photo used) is drawn like the sides
 *   with the Oberbau's west pediment and Pegasus over it.
 * - The porch behind the columns is drawn 9 m deep with its back wall, side
 *   walls and ceiling in the darker weathered stone (it is in deep shade in
 *   every photo); the roofs are kept low behind blocking courses (wing
 *   gables to 21.4 m), as from the square they barely show.
 * - Invented/simplified: sculpture as bold figure, griffin, horse and lion
 *   forms in the real poses; the pediment reliefs (detail only) as a row of
 *   standing and reclining figures; the roofs as plain grey metal.
 * - Look-only references: none.
 * - Doubts: no licensed photo of the west front; the wing gables' pitch
 *   from one statue on the far apex.
 *
 * Night: the facades are floodlit (`_FLOODLIGHT`), strongest on the east
 * front and portico; the windows glow; the bronze stays dark.
 */
import { Part, type V3, type MaterialSpec } from './mesh'
import { writeModel } from './london-buckingham-palace'
import { cbox, rect, qf, tf, cylinder, type Rect } from './dc-white-house'
import { ionic, lodKit, faceOf, fpanel, fblock, type Lod, type Face } from './london-british-museum'
import { place, figure, wing, ell, LOW, HIGH, type Q } from './london-albert-memorial'
import { ellipsoid, tube, solid, slab, lathe, TAU } from './nyc-columbus-monument'
import { lion, quadrupedWithWings } from './berlin-altes-museum'
import { welded } from './berlin-reichstag'

export const ID = 'berlin-konzerthaus'
export const BEARING = 354.35

// ===========================================================================
// Shared Gendarmenmarkt kit
// ===========================================================================

export function mat(name: string, color: number, roughness = 0.85): MaterialSpec {
  return { name, color, roughness }
}

/** Smooth-shaded sculpture placed at `at`, facing yaw (local +y forward). */
export function sculpt(dst: Part, at: V3, yaw: number, make: (q: Part) => void, k = 1) {
  place(dst, at, yaw, k, make, sculptCrease)
}
let sculptCrease = 70
/** Sculpture smoothing: the low model welds every corner (crease 179) so small figures stay small in bytes. */
export function setSculptCrease(c: number) { sculptCrease = c }

/**
 * A gabled block over rectangle r: walls from z0 to the eave ze, a gable
 * (pitched roof) to the apex za with the ridge along `along`, and the
 * tympana at both gable ends in `wall`. `cornice` (a Part) gets a
 * projecting eave cornice and the raking cornices; `ends` limits which
 * gable ends get a tympanum [low, high].
 */
export function gableBlock(wall: Part, roof: Part, cornice: Part | null, r: Rect, z0: number, ze: number, za: number, along: 'x' | 'y', o: { ends?: [boolean, boolean]; over?: number; walls?: boolean; ct?: number } = {}) {
  const ends = o.ends ?? [true, true], ov = o.over ?? 0.6, ct = o.ct ?? 0.9
  if (o.walls !== false) cbox(wall, r, z0, ze - (cornice ? ct : 0), { top: false })
  if (cornice) cbox(cornice, rect(r.x0 - ov, r.x1 + ov, r.y0 - ov, r.y1 + ov), ze - ct, ze, { top: false, bottom: true, b: 0 })
  const R = cornice ? rect(r.x0 - ov, r.x1 + ov, r.y0 - ov, r.y1 + ov) : r
  if (along === 'x') {
    const ym = (R.y0 + R.y1) / 2
    qf(roof, [R.x0, R.y0, ze], [R.x1, R.y0, ze], [R.x1, ym, za], [R.x0, ym, za], [0, -(za - ze), ym - R.y0])
    qf(roof, [R.x0, R.y1, ze], [R.x1, R.y1, ze], [R.x1, ym, za], [R.x0, ym, za], [0, za - ze, R.y1 - ym])
    for (const [k, x] of [[0, r.x0], [1, r.x1]] as const) {
      const s = k ? 1 : -1
      if (ends[k]) {
        tf(wall, [x, r.y0, ze], [x, r.y1, ze], [x, (r.y0 + r.y1) / 2, za - (cornice ? 0.35 : 0)], [s, 0, 0])
        if (cornice) {
          // Raking cornices: two sloped bands standing proud of the tympanum.
          const xo = x + s * ov
          for (const e of [-1, 1]) {
            const yA = e < 0 ? R.y0 : R.y1
            qf(cornice, [xo, yA, ze], [xo, ym, za], [xo, ym, za - 0.55], [xo, yA - e * 0.0, ze - 0.55], [s, 0, 0])
            qf(cornice, [x, yA, ze - 0.55], [xo, yA, ze - 0.55], [xo, ym, za - 0.55], [x, ym, za - 0.55], [0, 0, -1])
          }
        }
      } else tf(roof, [x, R.y0, ze], [x, R.y1, ze], [x, ym, za], [s, 0, 0])
    }
  } else {
    const xm = (R.x0 + R.x1) / 2
    qf(roof, [R.x0, R.y0, ze], [R.x0, R.y1, ze], [xm, R.y1, za], [xm, R.y0, za], [-(za - ze), 0, xm - R.x0])
    qf(roof, [R.x1, R.y0, ze], [R.x1, R.y1, ze], [xm, R.y1, za], [xm, R.y0, za], [za - ze, 0, R.x1 - xm])
    for (const [k, y] of [[0, r.y0], [1, r.y1]] as const) {
      const s = k ? 1 : -1
      if (ends[k]) {
        tf(wall, [r.x0, y, ze], [r.x1, y, ze], [(r.x0 + r.x1) / 2, y, za - (cornice ? 0.35 : 0)], [0, s, 0])
        if (cornice) {
          const yo = y + s * ov
          for (const e of [-1, 1]) {
            const xA = e < 0 ? R.x0 : R.x1
            qf(cornice, [xA, yo, ze], [xm, yo, za], [xm, yo, za - 0.55], [xA, yo, ze - 0.55], [0, s, 0])
            qf(cornice, [xA, y, ze - 0.55], [xA, yo, ze - 0.55], [xm, yo, za - 0.55], [xm, y, za - 0.55], [0, 0, -1])
          }
        }
      } else tf(roof, [R.x0, y, ze], [R.x1, y, ze], [xm, y, za], [0, s, 0])
    }
  }
}

/**
 * Window bays along a face: n bays evenly between s0 and s1, a window panel
 * per bay for each [z0, z1, width] row, and (optionally) proud piers
 * between the bays from pz0 to pz1.
 */
export function bays(win: Part, pier: Part | null, f: Face, s0: number, s1: number, n: number, rows: [number, number, number][], o: { pz?: [number, number]; pw?: number; pd?: number; ends?: boolean } = {}) {
  const step = (s1 - s0) / n
  for (let k = 0; k < n; k++) {
    const s = s0 + step * (k + 0.5)
    for (const [z0, z1, w] of rows) fpanel(win, f, s - w / 2, s + w / 2, z0, z1, 0.05)
  }
  if (pier && o.pz) {
    const pw = o.pw ?? 0.8, pd = o.pd ?? 0.25
    for (let k = o.ends ? 0 : 1; k <= (o.ends ? n : n - 1); k++) {
      const s = s0 + step * k
      fblock(pier, f, s - pw / 2, s + pw / 2, o.pz[0], o.pz[1], 0, pd)
    }
  }
}

/** A standing stone figure on a small plinth, h tall, facing yaw. */
export function statue(dst: Part, Q: Q, at: V3, yaw: number, h: number, pose = 0) {
  sculpt(dst, at, yaw, (q) => {
    const arms: V3[][] = [
      [[0.13, 0, 0.78], [0.2, 0.1, 0.62], [0.17, 0.2, 0.5 + 0.35 * (pose % 2)]],
      [[-0.13, 0, 0.78], [-0.19, 0.05, 0.6], [-0.15, 0.12, 0.45 + 0.2 * ((pose >> 1) % 2)]],
    ]
    figure(q, Q, h, { arms, lean: 0.05, girth: 1.3, stride: Q.detail ? 0.3 : 0 })
  })
}

/**
 * Relief figures across a tympanum: n figures at u positions along it
 * (centred on u = 0, half width hw), each 0.8 of the tympanum's local
 * height, standing on z0 on a face with outward yaw `yaw` at depth along
 * `at(u)`.
 */
export function relief(dst: Part, Q: Q, n: number, hw: number, rise: number, z0: number, yaw: number, at: (u: number) => [number, number]) {
  for (let k = 0; k < n; k++) {
    const u = -hw + ((k + 0.5) * 2 * hw) / n, local = rise * (1 - Math.abs(u) / hw)
    const h = 0.8 * local
    if (h < 0.9) continue
    const [x, y] = at(u)
    sculpt(dst, [x, y, z0], yaw, (q) => figure(q, { ...Q, ring: 6, ell: 6 }, h, { arms: [[[0.13, 0, 0.78], [0.22, 0.06, 0.62]], [[-0.13, 0, 0.78], [-0.2, 0.06, 0.92]]], girth: 1.05, lean: 0.12 * Math.sign(u) }))
  }
}

/** The bronze tripod bowl on a square pedestal (as on the Konzerthaus gables). */
export function tripodBowl(dst: Part, Q: Q, x: number, y: number, z: number, k = 1) {
  cbox(dst, rect(x - 0.7 * k, x + 0.7 * k, y - 0.7 * k, y + 0.7 * k), z, z + 0.7 * k, { b: 0.06 })
  const n = Q.detail ? 14 : 7
  const prof: [number, number][] = [[0.25, 0.7], [0.18, 1.1], [0.25, 1.25], [0.55, 1.45], [0.95, 1.85], [1.0, 1.92], [0.15, 1.9]]
  lathe(dst, prof.map(([r, h]) => [r * k, z + h * k] as [number, number]), n, x, y)
}

/** Append what `make` builds, moved by (dx, dy, dz) in the map frame. */
export function moved(dst: Part, dx: number, dy: number, dz: number, make: (q: Part) => void) {
  const q = new Part()
  make(q)
  for (let i = 0; i < q.pos.length; i += 3) { q.pos[i] += dx; q.pos[i + 1] += dz; q.pos[i + 2] -= dy }
  dst.pos.push(...q.pos); dst.nrm.push(...q.nrm); dst.uv.push(...q.uv)
}

/** A straight flight of steps rising from x0 (z = 0) to x1 (z = h), between y0 and y1. */
export function stair(p: Part, x0: number, x1: number, y0: number, y1: number, h: number, n: number) {
  for (let k = 0; k < n; k++) {
    const t0 = k / n, t1 = (k + 1) / n
    const xa = x0 + (x1 - x0) * t0
    cbox(p, rect(Math.min(xa, x1), Math.max(xa, x1), y0, y1), h * t0, h * t1, { top: true })
  }
}

// ===========================================================================
// The Konzerthaus
// ===========================================================================

// Plan (OSM, model frame).
const WX0 = -22.5, WX1 = 14.4 // wings, west and east faces
const WY0 = 15.1, WY1 = 38.7 // wings, inner and outer ends (mirrored south)
const CX0 = -26.0, CX1 = 24.5, CY = 15.2 // central block
const FX1 = 24.5, FY = 22.4 // flanks beside the portico
const PX1 = 31.3, PY = 13.7 // portico front, half width
const OX1 = 23.6 // Oberbau east face (set back from the central block)
const PB = 21.0 // the porch's back wall, deep behind the columns
// Heights (photo, see header).
const ZWE = 19.0, ZWA = 21.4 // wing eave and (low) gable apex
const ZP = 5.4 // portico podium
const ZCAP = 16.8 // column tops
const ZE = 20.3 // cornice round portico, flanks and central block
const ZPA = 23.9 // portico apex
const ZO = 28.8, ZOA = 32.7 // Oberbau cornice and apex
const SX1 = 41.5 // foot of the stair
const CHY0 = 13.0, CHY1 = 16.2 // stair cheek blocks (|y|)

/** The griffin: a leaping lion body with an eagle's head and raised wings; faces +y, hind feet at z = 0. */
function griffin(q: Part, Q: Q, s: number) {
  lion(q, Q, s, { leap: 0.55 })
  // Eagle head with an open hooked beak, over the lion's head.
  const a = 0.55 * 0.7
  const R = (y: number, z: number): V3 => [0, (-0.55 + (y + 0.55) * Math.cos(a) - z * Math.sin(a)) * s, ((y + 0.55) * Math.sin(a) + z * Math.cos(a)) * s]
  const h = R(0.7, 1.0)
  ellipsoid(q, h, [0.15 * s, 0.2 * s, 0.17 * s], Q.ell, Q.rows)
  tube(q, [[0, h[1] + 0.15 * s, h[2]], [0, h[1] + 0.32 * s, h[2] - 0.04 * s], [0, h[1] + 0.36 * s, h[2] - 0.12 * s]], [0.07 * s, 0.045 * s, 0.015 * s], 4)
  if (Q.detail) for (const e of [-1, 1]) tube(q, [[e * 0.07 * s, h[1] - 0.02 * s, h[2] + 0.1 * s], [e * 0.09 * s, h[1] - 0.06 * s, h[2] + 0.24 * s]], [0.03 * s, 0.008 * s], 3)
  // Wings raised and swept back from the shoulders.
  const sh = R(0.3, 0.9)
  for (const e of [-1, 1] as const) wing(q, Q, [e * 0.14 * s, sh[1], sh[2]], e, 1.15 * s, 1.2, 0.5)
}

/** Apollo in the griffin chariot (Tieck): faces +y, pedestal top at z = 0. */
function apolloGroup(q: Part, Q: Q) {
  const D = Q.detail
  // The two griffins abreast, leaping forward.
  for (const e of [-1, 1]) moved(q, e * 0.62, 0.9, 0, (g) => griffin(g, Q, 1.35))
  // Pole and yoke.
  tube(q, [[0, -0.9, 0.75], [0, 0.6, 1.0]], [0.06, 0.05], 4)
  // The car: a round-fronted shell on two wheels.
  const cy = -1.25, m = D ? 14 : 8
  solid(q, [ell(0, cy, 0.55, 0.7, 0.5, m), ell(0, cy + 0.05, 1.15, 0.78, 0.55, m), ell(0, cy + 0.1, 1.55, 0.72, 0.5, m)])
  for (const e of [-1, 1]) {
    const xc = e * 0.85, zc = 0.62, r = 0.62, n = D ? 18 : 8
    const rim: V3[] = Array.from({ length: n + 1 }, (_, k): V3 => [xc, cy - 0.1 + r * Math.cos((k * TAU) / n), zc + r * Math.sin((k * TAU) / n)])
    tube(q, rim, rim.map(() => (D ? 0.06 : 0.09)), D ? 5 : 3)
    for (let k = 0; k < (D ? 8 : 4); k++) {
      const t = (k * TAU) / (D ? 8 : 4)
      tube(q, [[xc, cy - 0.1, zc], [xc, cy - 0.1 + (r - 0.05) * Math.cos(t), zc + (r - 0.05) * Math.sin(t)]], [0.04, 0.03], 3)
    }
  }
  // Apollo standing in the car, right arm thrown up, the cloak flying back.
  moved(q, 0, cy - 0.05, 0.75, (f) => figure(f, Q, 2.9, {
    arms: [[[0.13, 0, 0.78], [0.2, 0.05, 0.95], [0.21, 0.08, 1.12]], [[-0.13, 0, 0.78], [-0.2, 0.15, 0.68], [-0.12, 0.32, 0.64]]],
    lean: 0.1, girth: 1.25,
  }))
  slab(q, [0, cy - 0.35, 2.85], [0, -0.45, -0.9], [1, 0, 0], [[0, -0.35], [1.5, -0.55], [1.7, 0.5], [0, 0.35]], 0.08)
}

/** Lion (or panther) carrying a putto with a lyre: faces +y, plinth top at z = 0. */
function beastWithPutto(q: Part, Q: Q, panther: boolean) {
  const s = panther ? 1.25 : 1.45
  lion(q, Q, s)
  moved(q, 0, -0.05 * s, 0.78 * s, (f) => figure(f, Q, 1.1, {
    seated: true, girth: 1.4, legs: true,
    arms: [[[0.13, 0, 0.7], [0.2, 0.15, 0.75], [0.12, 0.25, 0.85]], [[-0.13, 0, 0.7], [-0.18, 0.15, 0.7], [-0.1, 0.25, 0.8]]],
    wings: Q.detail ? { span: 0.35, lift: 0.9, back: 0.6 } : undefined,
  }))
}

function build(hi: boolean) {
  const L: Lod = lodKit(hi)
  const Q: Q = hi ? HIGH : LOW
  setSculptCrease(hi ? 70 : 179)
  const stone = new Part(), trim = new Part(), roof = new Part(), win = new Part(), bronze = new Part(), dark = new Part()

  // ===== Wings (north and south, mirrored) ==================================
  for (const sy of [-1, 1]) {
    const y0 = sy * WY0, y1 = sy * WY1
    const r = rect(WX0, WX1, Math.min(y0, y1), Math.max(y0, y1))
    // Body and the gable with its pediment on the outer end.
    gableBlock(stone, roof, trim, r, 0, ZWE, ZWA, 'y', { ends: sy > 0 ? [false, true] : [true, false], over: 0.55 })
    // Rusticated ground-floor band and the string course.
    cbox(trim, rect(WX0 - 0.15, WX1 + 0.15, r.y0 - (sy < 0 ? 0.15 : 0), r.y1 + (sy > 0 ? 0.15 : 0)), 0, 0.9, { top: true })
    cbox(trim, rect(WX0 - 0.2, WX1 + 0.2, r.y0 - (sy < 0 ? 0.2 : 0), r.y1 + (sy > 0 ? 0.2 : 0)), 5.6, 6.0, { top: true, bottom: true })
    cbox(trim, rect(WX0 - 0.15, WX1 + 0.15, r.y0 - (sy < 0 ? 0.15 : 0), r.y1 + (sy > 0 ? 0.15 : 0)), 15.9, 16.4, { top: true, bottom: true })
    // Windows: a small ground-floor window and the two tall upper windows
    // per bay, Schinkel's piers between the bays.
    const rows: [number, number, number][] = [[1.6, 4.4, 1.3], [6.8, 10.5, 1.5], [11.5, 15.4, 1.5]]
    const piers = { pz: [6.0, 15.9] as [number, number], pw: 0.75, pd: 0.22 }
    // East face, from the flank to the corner.
    const fe = sy > 0 ? faceOf([WX1, FY], [WX1, WY1]) : faceOf([WX1, -WY1], [WX1, -FY])
    bays(win, stone, fe, 1.8, fe.len - 1.8, 4, rows, piers)
    fblock(trim, fe, 0, 1.6, 0.9, 15.9, 0, 0.35); fblock(trim, fe, fe.len - 1.6, fe.len, 0.9, 15.9, 0, 0.35)
    // Outer end under the pediment.
    const fo = sy > 0 ? faceOf([WX1, WY1], [WX0, WY1]) : faceOf([WX0, -WY1], [WX1, -WY1])
    bays(win, stone, fo, 2.2, fo.len - 2.2, 13, rows, piers)
    fblock(trim, fo, 0, 2.0, 0.9, 15.9, 0, 0.35); fblock(trim, fo, fo.len - 2.0, fo.len, 0.9, 15.9, 0, 0.35)
    // West face.
    const fw = sy > 0 ? faceOf([WX0, WY1], [WX0, WY0]) : faceOf([WX0, -WY0], [WX0, -WY1])
    bays(win, stone, fw, 1.8, fw.len - 1.8, 8, rows, piers)
    // The blocking course along the long sides, hiding the low roof.
    for (const x of [WX1, WX0]) {
      const xi = x > 0 ? x - 0.45 : x - 0.15, xo = x > 0 ? x + 0.15 : x + 0.45
      cbox(stone, rect(xi, xo, r.y0 + (sy < 0 ? 0.6 : 0), r.y1 - (sy > 0 ? 0.6 : 0)), ZWE, ZWE + 1.1, { b: 0.08 })
    }
    // Figures on the gable apex and the front corners.
    const apexY = sy * (WY1 + 0.3)
    cbox(trim, rect((WX0 + WX1) / 2 - 0.8, (WX0 + WX1) / 2 + 0.8, apexY - 0.8, apexY + 0.8), ZWA - 0.6, ZWA + 0.4)
    statue(dark, Q, [(WX0 + WX1) / 2, apexY, ZWA + 0.4], sy > 0 ? 0 : Math.PI, 2.3, 1)
    for (const x of [WX1 - 1.0, WX0 + 1.0]) {
      const y = sy * (WY1 - 1.0)
      cbox(trim, rect(x - 0.9, x + 0.9, y - 0.9, y + 0.9), ZWE, ZWE + 1.3, { b: 0.1 })
      statue(dark, Q, [x, y, ZWE + 1.3], x > 0 ? -Math.PI / 2 : Math.PI / 2, 2.2, x > 0 ? 2 : 3)
    }
    // Relief figures in the pediment (detail).
    if (hi) relief(trim, Q, 9, (WX1 - WX0) / 2, ZWA - ZWE - 0.4, ZWE + 0.02, sy > 0 ? 0 : Math.PI, (u) => [(WX0 + WX1) / 2 + u, sy * (WY1 + 0.1)])
  }

  // ===== Flanks beside the portico ==========================================
  for (const sy of [-1, 1]) {
    const r = rect(WX1, FX1, sy > 0 ? WY0 : -FY, sy > 0 ? FY : -WY0)
    cbox(stone, r, 0, ZE - 2.2, { top: false })
    cbox(trim, rect(r.x0, r.x1 + 0.25, r.y0 - (sy < 0 ? 0.25 : 0), r.y1 + (sy > 0 ? 0.25 : 0)), ZE - 2.2, ZE - 0.8, { top: false, bottom: true })
    cbox(trim, rect(r.x0, r.x1 + 0.6, r.y0 - (sy < 0 ? 0.6 : 0), r.y1 + (sy > 0 ? 0.6 : 0)), ZE - 0.8, ZE, { top: roof, bottom: true, b: 0.2 })
    cbox(trim, rect(r.x0, r.x1 + 0.15, r.y0 - (sy < 0 ? 0.15 : 0), r.y1 + (sy > 0 ? 0.15 : 0)), 0, 0.9, { top: true })
    // East face: three tall windows in two storeys between piers.
    const fe = faceOf([FX1, r.y0], [FX1, r.y1])
    bays(win, stone, fe, 0.9, fe.len - 0.9, 3, [[1.6, 4.4, 1.4], [6.8, 11.0, 1.6], [12.0, 16.6, 1.6]], { pz: [5.8, 17.2], pw: 0.7, pd: 0.25, ends: true })
    // Outer side (towards the wing's end) above the wing roof is not seen; the
    // side facing the square's north and south carries windows.
    const fs = sy > 0 ? faceOf([FX1, FY], [WX1, FY]) : faceOf([WX1, -FY], [FX1, -FY])
    bays(win, stone, fs, 0.8, fs.len - 0.8, 3, [[1.6, 4.4, 1.3], [6.8, 10.5, 1.5], [11.5, 15.4, 1.5]])
  }

  // ===== Central block and the Oberbau ======================================
  // Body to the cornice (the portico covers its east face; the wings its sides).
  cbox(stone, rect(CX0, PB, -CY, CY), 0, ZE - 2.2, { top: false })
  for (const s of [-1, 1]) cbox(stone, rect(PB, CX1, s > 0 ? PY : -CY, s > 0 ? CY : -PY), 0, ZE - 2.2, { top: false })
  cbox(trim, rect(CX0 - 0.25, CX1, -CY - 0.25, CY + 0.25), ZE - 2.2, ZE - 0.8, { top: false, bottom: true })
  cbox(trim, rect(CX0 - 0.6, CX1, -CY - 0.6, CY + 0.6), ZE - 0.8, ZE, { top: roof, bottom: true, b: 0.2 })
  // West front of the central block: windows in three storeys.
  bays(win, stone, faceOf([CX0, CY], [CX0, -CY]), 1.5, 2 * CY - 1.5, 9, [[1.6, 4.4, 1.3], [6.8, 10.8, 1.5], [11.8, 16.4, 1.5]], { pz: [6.0, 17.6], pw: 0.75, pd: 0.25 })
  // The Oberbau, set back on the body.
  gableBlock(stone, roof, trim, rect(CX0 + 0.6, OX1, -CY + 0.6, CY - 0.6), ZE, ZO, ZOA, 'x', { over: 0.6 })
  cbox(trim, rect(CX0 + 0.4, OX1 + 0.2, -CY + 0.4, CY - 0.4), ZE, ZE + 0.6, { top: false })
  cbox(trim, rect(CX0 + 0.45, OX1 + 0.15, -CY + 0.45, CY - 0.45), ZO - 2.3, ZO - 1.6, { top: false, bottom: true })
  // Blocking course along the Oberbau's long sides, over its cornice.
  for (const sy of [-1, 1]) cbox(stone, rect(CX0 + 1.0, OX1 - 0.4, sy > 0 ? CY - 1.0 : -CY + 0.4, sy > 0 ? CY - 0.4 : -CY + 1.0), ZO, ZO + 0.9, { b: 0.08 })
  // Its row of attic windows between pilasters, on all four sides.
  const ob = { x0: CX0 + 0.6, x1: OX1, y: CY - 0.6 }
  const oRows: [number, number, number][] = [[22.6, 26.0, 1.3]]
  const oP = { pz: [21.0, 26.5] as [number, number], pw: 0.7, pd: 0.2, ends: true }
  bays(win, stone, faceOf([ob.x1, -ob.y], [ob.x1, ob.y]), 0.8, 2 * ob.y - 0.8, 9, oRows, oP)
  bays(win, stone, faceOf([ob.x0, ob.y], [ob.x0, -ob.y]), 0.8, 2 * ob.y - 0.8, 9, oRows, oP)
  bays(win, stone, faceOf([ob.x1, ob.y], [ob.x0, ob.y]), 0.8, ob.x1 - ob.x0 - 0.8, 16, oRows, oP)
  bays(win, stone, faceOf([ob.x0, -ob.y], [ob.x1, -ob.y]), 0.8, ob.x1 - ob.x0 - 0.8, 16, oRows, oP)
  // Apollo in the griffin chariot on the east apex, Pegasus on the west.
  cbox(trim, rect(OX1 - 1.4, OX1 + 0.9, -1.6, 1.6), ZOA - 0.5, ZOA + 0.5, { b: 0.1 })
  sculpt(bronze, [OX1 + 0.2, 0, ZOA + 0.5], -Math.PI / 2, (q) => apolloGroup(q, Q), 1.25)
  cbox(trim, rect(CX0 - 0.2, CX0 + 2.2, -1.4, 1.4), ZOA - 0.5, ZOA + 0.5, { b: 0.1 })
  sculpt(bronze, [CX0 + 1.4, 0, ZOA + 0.5], Math.PI / 2, (q) => quadrupedWithWings(q, Q, 1.8, { rear: 0.25, lift: 0.9, toss: 0.05, girth: 1.25 }, 1.6))
  // Tripod bowls on the four corners of the Oberbau gables.
  for (const x of [OX1 - 0.2, CX0 + 1.2]) for (const y of [-CY + 1.4, CY - 1.4]) tripodBowl(bronze, Q, x, y, ZO, 0.9)
  // The Oberbau's east tympanum relief (detail).
  if (hi) relief(trim, Q, 11, CY - 0.6, ZOA - ZO - 0.4, ZO + 0.02, -Math.PI / 2, (u) => [OX1 + 0.1, u])

  // ===== Portico, podium, stair and cheeks ==================================
  // Podium under the portico.
  cbox(stone, rect(PB, PX1 + 0.3, -PY, PY), 0, ZP, { top: stone })
  cbox(stone, rect(CX1, PX1 + 0.3, -PY - 0.3, PY + 0.3), 0, ZP, { top: stone })
  // The wall behind the columns: doors at podium level, windows over them.
  const fb = faceOf([PB, -PY], [PB, PY])
  // The porch in deep shade: its back wall, side walls and ceiling in the
  // darker weathered stone, so the light columns stand clear in front.
  fpanel(dark, fb, 0, fb.len, ZP, ZCAP, 0.03)
  for (const s of [-1, 1]) {
    const fsd = s > 0 ? faceOf([CX1, PY], [PB, PY]) : faceOf([PB, -PY], [CX1, -PY])
    // These face into the porch: flip the face so its outward side looks inward.
    const fin = s > 0 ? faceOf([PB, PY], [CX1, PY]) : faceOf([CX1, -PY], [PB, -PY])
    fpanel(dark, fin, 0, fin.len, ZP, ZCAP, 0.0)
    void fsd
  }
  qf(dark, [PB, -PY, ZCAP - 0.02], [PX1 - 1.9, -PY, ZCAP - 0.02], [PX1 - 1.9, PY, ZCAP - 0.02], [PB, PY, ZCAP - 0.02], [0, 0, -1])
  bays(win, dark, fb, 0.0, fb.len, 5, [[ZP, ZP + 5.0, 2.2], [ZP + 6.0, ZP + 10.2, 2.2]], { pz: [ZP, ZCAP], pw: 1.1, pd: 0.3, ends: true })
  // Six Ionic columns.
  const colY = (k: number) => -PY + 1.1 + (k * (2 * PY - 2.2)) / 5
  for (let k = 0; k < 6; k++) ionic(L, trim, trim, PX1 - 0.95, colY(k), ZP, ZCAP, 0.85, [0, 1])
  // Antae at the back corners.
  for (const s of [-1, 1]) cbox(trim, rect(CX1, CX1 + 1.2, s * PY - 0.6, s * PY + 0.6), ZP, ZCAP, { top: false })
  // The porch's open sides above the podium are carried by the antae; its ceiling beams span to the back wall.
  // Entablature (its underside is the portico ceiling) and the pediment.
  cbox(trim, rect(PB, PX1, -PY, PY), ZCAP, ZE - 1.0, { top: false, bottom: true })
  fpanel(stone, faceOf([PX1, -PY + 0.5], [PX1, PY - 0.5]), 0, 2 * PY - 1.0, ZCAP + 1.4, ZCAP + 2.4, 0.04)
  gableBlock(stone, roof, trim, rect(CX1 - 1.0, PX1, -PY, PY), ZE - 1.0, ZE, ZPA, 'x', { ends: [false, true], over: 0.5, walls: false, ct: 1.0 })
  // Figures on the portico pediment: apex and corners.
  statue(dark, Q, [PX1 - 0.2, 0, ZPA + 0.2], -Math.PI / 2, 2.6, 0)
  for (const s of [-1, 1]) statue(dark, Q, [PX1 - 0.6, s * (PY - 0.6), ZE + 0.4], -Math.PI / 2, 2.4, s > 0 ? 1 : 2)
  // The Niobid relief (detail).
  if (hi) relief(trim, Q, 11, PY, ZPA - ZE - 0.4, ZE + 0.02, -Math.PI / 2, (u) => [PX1 + 0.1, u])
  // The stair from the square up to the podium.
  stair(stone, SX1, PX1 + 0.3, -CHY0, CHY0, ZP, hi ? 27 : 7)
  // Cheek blocks with their cornice and the bronze groups.
  for (const s of [-1, 1]) {
    const r = rect(PX1 - 3.0, SX1 + 0.3, s > 0 ? CHY0 : -CHY1, s > 0 ? CHY1 : -CHY0)
    cbox(stone, r, 0, ZP + 0.1, { top: false, c: 0.1 })
    cbox(trim, rect(r.x0, r.x1 + 0.25, r.y0 - 0.25, r.y1 + 0.25), ZP + 0.1, ZP + 0.6, { b: 0.15, bottom: true })
    cbox(trim, rect(r.x0, r.x1 + 0.15, r.y0 - 0.15, r.y1 + 0.15), 0, 0.8, { top: true })
    const gx = PX1 + 1.5, gy = (r.y0 + r.y1) / 2
    cbox(trim, rect(gx - 1.6, gx + 1.6, gy - 1.0, gy + 1.0), ZP + 0.6, ZP + 1.2, { b: 0.1 })
    sculpt(bronze, [gx, gy, ZP + 1.2], -Math.PI / 2, (q) => beastWithPutto(q, Q, s > 0), 1.45)
  }

  // ===== Materials and night ================================================
  const lit = (p: V3, n: V3) => (n[2] > 0.8 ? 0.25 : p[0] > 13 ? 0.95 : 0.7)
  const W = (p: Part) => welded(p, 30)
  return [
    { part: W(stone), material: { ...mat('konzerthaus-sandstone', 0xdcc7a0), floodlight: lit } },
    { part: W(trim), material: { ...mat('trim', 0xe8d8b6), floodlight: lit } },
    { part: W(roof), material: mat('roof', 0x9da6ad) },
    { part: W(win), material: mat('window', 0x64798a, 0.35) },
    { part: welded(bronze, hi ? 60 : 179), material: mat('patina', 0x6fa596, 0.6) },
    { part: welded(dark, hi ? 60 : 179), material: mat('weathered-stone', 0x6c675e) },
  ] as Array<{ part: Part; material: MaterialSpec }>
}

if (import.meta.main) {
  const extras = { landmark: 'Konzerthaus Berlin', wikidata: 'Q702548', bearing: BEARING, osm: 'way/217512230' }
  writeModel('Konzerthaus Berlin', ID, build(false), extras, 6500)
  writeModel('Konzerthaus Berlin', ID, build(true), extras, 40000, `${ID}.detail`)
}
