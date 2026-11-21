/**
 * Indiana World War Memorial (1926–1965, Walker and Weeks), on the
 * American Legion Mall, Indianapolis: procedural, CC0-1.0.
 * bun generators/indy-world-war-memorial.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres. The origin is the area centroid
 * of the OSM outline way/339760249 (-86.1569437, 39.7733757); the plan is
 * turned 0.86 degrees clockwise from true north (the downtown grid), so the
 * model is drawn square and placed at bearing 0.86. y = 0 is the street at
 * the foot of the south steps, the lowest ground under the outline (lidar
 * ground 2.5 m over the grid minimum).
 *
 * Identity (from the photos below):
 *  1. A tall, nearly square limestone shrine standing on a broad podium,
 *     with a giant screen of six Ionic columns in antis, set back between
 *     solid corner piers, on each of its four faces.            (S, aerial)
 *  2. The stepped pyramid roof on an attic, after the Mausoleum at
 *     Halicarnassus, with a small block at its top.        (aerial, lidar)
 *  3. The rusticated base storey with the bronze doors, over a long flight
 *     of steps on the south between the two podium wings.        (S, aerial)
 *  4. The low podium with its row of small windows, a parapet, and square
 *     pedestals at its corners; lower terraces and steps on the north.
 *
 * Sources
 * - OSM (ODbL): way/339760249 (building=yes, height 63): the podium x
 *   -27.9..28.3, y -31.9..27.3, the south steps x -10.3..8.5 to y -52.9,
 *   the north terraces to y 45.3.
 * - USGS 3DEP lidar USGS_LPC_IN_Central_MarionCo_2016_LAS_2018 (flown
 *   2016), 1 m grid read in the model frame (tools/lidar_frame.py).
 *   Measured: the shrine x -16.5..15.5, y -18.5..14.5 (32.5 m square about
 *   (-0.5, -2)); its main cornice 38.2 m; the attic, set in about 1 m, to
 *   45.9 m; the pyramid from about 49 m at 14 m from the axis to its top
 *   block at 62.9 m (a slope of about 47 degrees); the podium deck 10.0 m,
 *   its corner pedestals to about 14 m; the south steps from 1 m at y -52
 *   to 8.2 m at y -32; the north terraces about 5.5 m, the north stair's
 *   landing 7.7 m.
 * - Published (Wikipedia, "Indiana World War Memorial Plaza"; NRHP 1989):
 *   210 ft (64 m) tall; limestone; Ionic colonnades; the pyramid roof
 *   modelled on the Mausoleum at Halicarnassus. The lidar's 62.9 m agrees.
 * - Photos (Wikimedia Commons):
 *   "Indiana World War Memorial.jpg" (Daniel Schwen, CC BY-SA 4.0,
 *   https://commons.wikimedia.org/wiki/File:Indiana_World_War_Memorial.jpg),
 *   the south front from the steps: the base storey, the door, the six
 *   columns, the attic with its statues;
 *   "Indiana War Memorial.jpg" (Daniel Schwen, CC BY-SA 4.0,
 *   https://commons.wikimedia.org/wiki/File:Indiana_War_Memorial.jpg),
 *   from high to the south: the podium, wings, steps, the pyramid;
 *   "Indiana World War Memorial Plaza, Indianápolis, Estados Unidos,
 *   2012-10-22, DD 11.jpg" (Diego Delso, CC BY-SA 3.0,
 *   https://commons.wikimedia.org/wiki/File:Indiana_World_War_Memorial_Plaza,_Indian%C3%A1polis,_Estados_Unidos,_2012-10-22,_DD_11.jpg).
 *
 * Estimated (from the photos against the lidar heights): the base storey
 *   10.0..20.5, the columns 20.5..31.5 (1.5 m thick), the entablature and
 *   statue band 31.5..36.8, the colonnade 19 m of the 31 m face, the piers'
 *   depth; the podium windows; the stairs' step count. The north face of
 *   the shrine is drawn like the south (the aerial shows the colonnade on
 *   the east and west too).
 * Left out: the statues on the attic, the inscriptions, the lions and the
 *   lamps on the steps, the "Pro Patria" statue on the steps, balustrades,
 *   the side entrances on the east and west, the plaza beyond the outline.
 * Night: the shrine is floodlit (the stone carries a floodlight wash), the
 *   doors are `entrance`, the windows behind the columns glow.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, prism, rect, arc, chamfer, lathe, flatShape, capRing, finishGlb, writeModel, type Face } from './sea-tacoma-union-station'

// ---------------------------------------------------------------- helpers
// Shared by my Indianapolis models (indy-*): import from this file.

/** An Ionic or Doric column: base, tapering shaft, capital. */
export function column(part: Part, x: number, y: number, z0: number, z1: number, r: number, segs = 8, cap = 1.3) {
  lathe(part, x, y, [[r * 1.25, z0], [r * 1.25, z0 + 0.45], [r, z0 + 0.6], [r * 0.86, z1 - 0.7], [r * cap, z1 - 0.3], [r * cap, z1], [0.001, z1]], segs)
}
/**
 * A straight flight of steps over the rectangle x0..x1, y0..y1, rising from
 * z0 at the `foot` side ('s', 'n', 'e' or 'w') to z1 at the far side, as
 * `n` stacked blocks (risers, treads and solid sides).
 */
export function stairs(part: Part, x0: number, y0: number, x1: number, y1: number, foot: 's' | 'n' | 'e' | 'w', z0: number, z1: number, n: number) {
  for (let k = 0; k < n; k++) {
    const f = k / n, za = k === 0 ? 0 : z0 + ((z1 - z0) * k) / n, zb = z0 + ((z1 - z0) * (k + 1)) / n
    const r: [number, number, number, number] =
      foot === 's' ? [x0, y0 + (y1 - y0) * f, x1, y1] : foot === 'n' ? [x0, y0, x1, y1 - (y1 - y0) * f]
        : foot === 'w' ? [x0 + (x1 - x0) * f, y0, x1, y1] : [x0, y0, x1 - (x1 - x0) * f, y1]
    prism(part, part, rect(...r), za, zb)
  }
}
/** Flush window panels along a wall edge a→b (outward to the right of a→b for a counter-clockwise ring). */
export function windowRow(part: Part, a: XY, b: XY, z0: number, z1: number, bay: number, w: number, margin = 1.5, skip?: (s: number) => boolean) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (L < 2 * margin + w) return
  const n = Math.max(1, Math.round((L - 2 * margin) / bay))
  const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nn: XY = [t[1], -t[0]]
  for (let k = 0; k < n; k++) {
    const s = margin + ((L - 2 * margin) * (k + 0.5)) / n
    if (skip?.(s)) continue
    const P = (u: number, z: number): V3 => [a[0] + t[0] * u + nn[0] * 0.06, a[1] + t[1] * u + nn[1] * 0.06, z]
    part.quad(P(s - w / 2, z0), P(s + w / 2, z0), P(s + w / 2, z1), P(s - w / 2, z1))
  }
}
/** A box from (x0,y0,z0) to (x1,y1,z1), with an optional top part. */
export function box(wall: Part, top: Part | null, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, bevel = 0) {
  prism(wall, top, bevel > 0 ? chamfer(rect(x0, y0, x1, y1), bevel) : rect(x0, y0, x1, y1), z0, z1)
}
/** A hollow rectangular band (a parapet): outer and inner walls and a top, `w` thick. */
export function ringBand(part: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, w: number) {
  const o = rect(x0, y0, x1, y1), i = rect(x0 + w, y0 + w, x1 - w, y1 - w)
  prism(part, null, o, z0, z1)
  prism(part, null, [...i].reverse(), z0, z1)
  for (let k = 0; k < 4; k++) {
    const a = o[k], b = o[(k + 1) % 4], c = i[(k + 1) % 4], d = i[k]
    part.quad([a[0], a[1], z1], [b[0], b[1], z1], [c[0], c[1], z1], [d[0], d[1], z1])
  }
}
/** Floodlight: walls lit, faces looking up barely. */
export const wallLit = (p: V3, n: V3): number => (n[2] > 0.7 ? 0.25 : 0.9)

// ---------------------------------------------------------------- the model
if (import.meta.main) {
  const stone = new Part(), trim = new Part(), deck = new Part(), win = new Part(), door = new Part(), niche = deck
  const arcPts = (sc: number, zs: number, r: number): XY[] => arc(sc, zs, r, 0, 180, 6).slice(1, -1)

  const CX = -0.5, CY = -2.0 // the shrine's axis
  const D = 15.6 // half-width of the shrine's walls
  const PODIUM = 10.0, BASE = 20.5, COL1 = 31.5, ENT = 33.0, CORN0 = 37.0, CORN = 38.2
  const ATTIC = 45.9, TOP = 61.6, APEX = 62.9

  // ---------------------------------------------------- the podium
  const PX0 = -27.7, PX1 = 28.0, PY0 = -31.5, PY1 = 27.2
  box(stone, deck, PX0, PY0, PX1, PY1, 0, PODIUM, 0.4)
  // the parapet round the deck: a low band at the edge
  {
    const o = rect(PX0, PY0, PX1, PY1), i = rect(PX0 + 0.6, PY0 + 0.6, PX1 - 0.6, PY1 - 0.6)
    prism(trim, null, o, PODIUM, PODIUM + 1.0)
    prism(trim, null, [...i].reverse(), PODIUM, PODIUM + 1.0)
    for (let k = 0; k < 4; k++) {
      const a = o[k], b = o[(k + 1) % 4], c = i[(k + 1) % 4], d = i[k]
      trim.quad([a[0], a[1], PODIUM + 1.0], [b[0], b[1], PODIUM + 1.0], [c[0], c[1], PODIUM + 1.0], [d[0], d[1], PODIUM + 1.0])
    }
  }
  // the cornice band under the parapet, and the base course
  prism(trim, null, chamfer(rect(PX0 - 0.25, PY0 - 0.25, PX1 + 0.25, PY1 + 0.25), 0.3), PODIUM - 1.0, PODIUM)
  // square pedestals at the corners, with an urn
  for (const [x, y] of [[PX0 + 1.2, PY0 + 1.2], [PX1 - 1.2, PY0 + 1.2], [PX1 - 1.2, PY1 - 1.2], [PX0 + 1.2, PY1 - 1.2]]) {
    box(trim, trim, x - 1.0, y - 1.0, x + 1.0, y + 1.0, PODIUM, PODIUM + 2.6, 0.2)
    lathe(trim, x, y, [[0.6, PODIUM + 2.6], [0.85, PODIUM + 3.2], [0.7, PODIUM + 3.8], [0.3, PODIUM + 4.1], [0.001, PODIUM + 4.2]], 8)
  }
  // the podium's windows: a row high in the wall, all round (none behind the stairs)
  const ring = rect(PX0, PY0, PX1, PY1)
  ring.forEach((a, k) => {
    const b = ring[(k + 1) % 4]
    windowRow(win, a, b, 5.2, 7.8, 4.0, 1.7, 2.5, k === 0 ? (s) => Math.abs(PX0 + s - (-0.9)) < 11.5 : k === 2 ? (s) => Math.abs(PX1 - s - 0.6) < 13 : undefined)
  })

  // ---------------------------------------------------- the south steps
  {
    const SX0 = -10.3, SX1 = 8.5, Y0 = -52.6, Y1 = PY0
    stairs(deck, SX0, Y0, SX1, Y1, 's', 0.4, PODIUM, 18)
    // the cheek walls either side, stepping down
    for (const x of [SX0 - 1.4, SX1]) {
      box(stone, trim, x, -44, x + 1.4, Y1, 0, 8.4, 0.2)
      box(stone, trim, x, Y0 + 0.3, x + 1.4, -44, 0, 4.2, 0.2)
    }
  }
  // ---------------------------------------------------- the north terraces and stair
  for (const [x0, x1] of [[-25.0, -11.8], [13.0, 26.1]]) {
    box(stone, deck, x0, PY1, x1, 37.0, 0, 5.6, 0.3)
    prism(trim, null, rect(x0 - 0.2, PY1, x1 + 0.2, 37.2), 5.0, 5.6)
    windowRow(win, [x1, 37.0], [x0, 37.0], 1.8, 3.8, 3.6, 1.6, 1.8)
  }
  box(stone, deck, -11.8, PY1, 13.0, 30.0, 0, 7.7)
  stairs(deck, -11.8, 30.0, 13.0, 45.0, 'n', 0.6, 7.7, 12)

  // ---------------------------------------------------- the shrine
  const S = (x0: number, y0: number, x1: number, y1: number): XY[] => rect(CX + x0, CY + y0, CX + x1, CY + y1)
  // the rusticated base storey and its band
  prism(stone, null, chamfer(S(-D, -D, D, D), 0.4), PODIUM, BASE)
  prism(trim, null, chamfer(S(-D - 0.3, -D - 0.3, D + 0.3, D + 0.3), 0.4), BASE - 0.8, BASE)
  prism(trim, null, chamfer(S(-D - 0.3, -D - 0.3, D + 0.3, D + 0.3), 0.4), PODIUM, PODIUM + 0.8)
  // the colonnade storey: a recessed core with solid corner piers
  const CORE = D - 1.9, PIER = 9.9
  prism(stone, null, S(-CORE, -CORE, CORE, CORE), BASE, COL1)
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const xa = sx < 0 ? -D : PIER, xb = sx < 0 ? -PIER : D, ya = sy < 0 ? -D : PIER, yb = sy < 0 ? -PIER : D
    prism(stone, null, chamfer(S(xa, ya, xb, yb), 0.3), BASE, COL1)
  }
  // the entablature, the band of statues in their niches, a cornice
  prism(trim, null, chamfer(S(-D, -D, D, D), 0.4), COL1, ENT)
  prism(stone, null, chamfer(S(-D, -D, D, D), 0.4), ENT, CORN0)
  prism(trim, trim, chamfer(S(-D - 0.4, -D - 0.4, D + 0.4, D + 0.4), 0.4), CORN0, CORN)
  for (const { n, t } of [{ n: [0, -1], t: [1, 0] }, { n: [1, 0], t: [0, 1] }, { n: [0, 1], t: [-1, 0] }, { n: [-1, 0], t: [0, -1] }] as { n: XY; t: XY }[]) {
    // the six niches over the columns, shallow shadowed recesses
    const f: Face = { o: [CX + n[0] * D, CY + n[1] * D, 0], n }
    for (const s of [-8.3, -5.0, -1.7, 1.7, 5.0, 8.3]) flatShape(niche, f, [[s - 0.75, ENT + 0.4], [s + 0.75, ENT + 0.4], [s + 0.75, CORN0 - 0.9], ...arcPts(s, CORN0 - 0.9, 0.75)], 0.04)
  }
  // six columns and five tall windows on each face
  const faces: { n: XY; t: XY }[] = [{ n: [0, -1], t: [1, 0] }, { n: [1, 0], t: [0, 1] }, { n: [0, 1], t: [-1, 0] }, { n: [-1, 0], t: [0, -1] }]
  const COLS = [-8.3, -5.0, -1.7, 1.7, 5.0, 8.3]
  for (const { n, t } of faces) {
    for (const s of COLS) column(trim, CX + n[0] * (CORE + 1.05) + t[0] * s, CY + n[1] * (CORE + 1.05) + t[1] * s, BASE, COL1, 0.72, 8, 1.45)
    const f: Face = { o: [CX + n[0] * CORE, CY + n[1] * CORE, 0], n }
    for (let k = 0; k < 5; k++) {
      const sc = (COLS[k] + COLS[k + 1]) / 2
      flatShape(win, f, [[sc - 1.05, BASE + 1.2], [sc + 1.05, BASE + 1.2], [sc + 1.05, COL1 - 0.8], [sc - 1.05, COL1 - 0.8]], 0.06)
    }
    // the corner piers' small panels and the attic's carved plaques read as plain stone
  }
  // the bronze doors on the south and north, in a pale surround
  for (const n of [[0, -1], [0, 1]] as XY[]) {
    const f: Face = { o: [CX, CY + n[1] * D, 0], n }
    flatShape(trim, f, [[-2.6, PODIUM], [2.6, PODIUM], [2.6, PODIUM + 7.6], [-2.6, PODIUM + 7.6]], 0.05)
    flatShape(door, f, [[-1.7, PODIUM], [1.7, PODIUM], [1.7, PODIUM + 6.4], [-1.7, PODIUM + 6.4]], 0.1)
  }

  // ---------------------------------------------------- the attic and the stepped pyramid
  // the attic, set in, with the heavy cornice the pyramid stands on
  prism(stone, null, chamfer(S(-D + 0.8, -D + 0.8, D - 0.8, D - 0.8), 0.3), CORN, ATTIC - 1.2)
  prism(trim, trim, chamfer(S(-D - 0.1, -D - 0.1, D + 0.1, D + 0.1), 0.4), ATTIC - 1.2, ATTIC)
  {
    // stepped courses from 14 m out at the attic to the top block (lidar: about 50 degrees)
    const N = 10, R0 = 14.0, R1 = 1.7
    for (let k = 0; k < N; k++) {
      const r = R0 - ((R0 - R1) * k) / N, z0 = ATTIC + ((TOP - ATTIC) * k) / N, z1 = ATTIC + ((TOP - ATTIC) * (k + 1)) / N
      prism(stone, stone, S(-r, -r, r, r), z0, z1)
    }
    prism(trim, trim, chamfer(S(-R1, -R1, R1, R1), 0.3), TOP, APEX)
  }

  const limestone = { ...finish('indy-wwm-limestone', 0xe6dfd1), floodlight: wallLit }
  const built = finishGlb('Indiana World War Memorial', [
    { part: stone, material: limestone },
    { part: trim, material: { ...PALETTE.trim, floodlight: wallLit } },
    { part: deck, material: finish('indy-wwm-paving', 0xcfcac1) },
    { part: win, material: PALETTE.window },
    { part: door, material: finish('entrance', 0xb08a52) },
  ], { bearing: 0.86, height: APEX, replaces: ['way/339760249'] }, 5000)
  await writeModel('indy-world-war-memorial', built)
}
