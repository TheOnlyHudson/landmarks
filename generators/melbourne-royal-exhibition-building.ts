/**
 * Royal Exhibition Building, Carlton Gardens, Melbourne: procedural, CC0-1.0.
 * bun generators/melbourne-royal-exhibition-building.ts
 *
 * Map frame: x east, y north, z up, metres, built turned to bearing 8 (the
 * outline's main edges run 8 and 98 degrees). Origin at the area centroid
 * of OSM way/4817059 (144.9715028, -37.8047115). The building is
 * symmetric about the crossing, which sits 0.1 m east and 3.9 m south of
 * the centroid (OSM's dome octagon way/284244385); everything is authored
 * about the crossing and shifted by (XC, YC) on output.
 *
 * Joseph Reed's Great Hall of 1879-80 (World Heritage, 2004): a cross plan
 * with a long east-west nave and aisles, a short south arm (the main
 * entrance with its two towers), a longer north arm (also with two
 * towers), pedimented east and west ends with great fan lunettes, four
 * domed corner pavilions, and the crossing's square base, octagonal drum
 * and ribbed octagonal dome after Brunelleschi's Florence dome, with a
 * green and gilt lantern. Rendered brick, cream; slate dome.
 *
 * Published (Wikipedia "Royal Exhibition Building"): "an octagonal drum and
 * dome rising 68 metres, and 18.3 metres across" (read as to the top of
 * the flagstaff; see below); 150 m long Great Hall
 * (the OSM outline is 169 m over the end porticoes); dome modelled on
 * Florence Cathedral; brick, timber, steel and slate.
 *
 * OSM (turned frame, crossing-centred u/v): outline u +-84.6, v -34.3..60.8;
 * nave and aisle mass v +-24.9 to the corner pavilions (u +-69.2..80,
 * v +-24.5..35, way/284815459, 284821669-71); crossing base a square +-16
 * with 5 m notches at the corners (way/284244384); the dome octagon
 * 19.4 m across the flats (way/284244385); south arm u +-7.2 to v -33 with its two
 * towers u +-7.2..14.6 (way/284820982, 284821828, h 35); north arm u +-10
 * (aisles to +-16) to v 52.5, its front block u +-13 to v 60.8
 * (way/284821967); east/west end blocks to u +-82.6 and the porticoes'
 * frontispieces to +-84.6; 6 m wide side projections at u +-39.6..45.8.
 *
 * Heights, from photos scaled by OSM's plan dimensions (OSM's height tags
 * of 30-67 m disagree with every photo and were not used):
 * r9 (west end, frontal, distant): the frontispiece is 22.4 m wide = 400 px
 * (0.056 m/px at the front), giving the corner pavilions' cornice 15,
 * attic 17.5, dome top 21.5; the frontispiece's entablature 15.8-16.8,
 * pediment apex 23.5, fan arch springing 11.0, radius 7, its head rising
 * through the entablature into the pediment. The drum (19.4 m across
 * = 190 px, 0.102 m/px) and the two scales place the camera's horizon and
 * give the dome's base 42.6, lantern base 54.8, gilt ball 59.6. So the
 * published "68 metres" is read as the top of the flagstaff (detail
 * model only). r1 (northwest, long lens): drum 13.6 : dome 10.1 :
 * lantern 4.9 against the drum's width; the crossing base's parapet only
 * just above the nave ridge (26.2, lowered in review: r4 and r9 show no
 * base above the frontispieces), the drum's plinth rising from it to 32. r3: the drum's stages 0.27 / 0.42 / 0.31.
 * r4 (south front, 0.05 m/px from the 7.5 m towers): main cornice 20.5,
 * arch 12 m wide springing at 11.5, belfry to 25, cupola to 28.5. After
 * the lead's review the frontispieces are drawn bolder than that reading:
 * towers 6.8 m (OSM 7.5) framing an arch 13.5 m wide that rises to just
 * under a 21.2 m cornice with a low attic, belfry stages to 28 and
 * cupolas to about 32.5,
 * toward OSM's 35 m tower tag.
 * r1/r7 for the long walls: plinth 1.2, ground windows 1.8-6.4, blind
 * arches with roundels 7.0-9.0, panelled upper storey, cornice 15,
 * balustrade to 17; clerestory windows 17.6-19.4, eaves 19.8.
 * Estimated: nave ridge 23.5 (hidden behind the pediments in r9), the
 * north front's towers (as the south's, cornice 20, r7/r8), bay counts
 * (5.9 m bays, r1), the crossing base's windows, the lantern (r3).
 * Left out: the 1880 annexes (demolished), the forecourt, fountains and
 * gardens (map ground), the dome promenade's railings, statues on the
 * portico, lettering and banners.
 *
 * Colours (tools/sample.ts on the photos): render sunlit #c2c1bf (r1),
 * #cbc6bb (r9), warm in r4/r9 sunlight (#e6d6b4, lead's review), shade
 * #b9b0a5 (r3) -> warm cream 0xeadcc0; dome slate sunlit #c9c8cc, shade
 * #91939c -> grey-blue 0x878d97, with its two red-brown bands #a89386 /
 * #796966 (r3, r9) -> 0x9a7166; nave roofs and pavilion domes pale grey
 * (#c2c1bf, r1; #cbc6bb, r9) -> 0xb9bcbd; the lantern, dormer hoods and
 * doors are dark green in reality (#31343d shaded, r7) but share the
 * slate here to free a material for the bands; lantern cupola gilt
 * -> 0xd8b55a.

 * Night: the stone is floodlit (r10, the public-domain night photo, shows
 * the whole south front and dome washed in warm light); windows glow.
 *
 * LODs: the low model has the bays as real window recesses and pilasters,
 * the balustrades as parapets pierced with real openings, the fan lunettes
 * with bold bars, the real arches of the porticoes, the octagonal drum with
 * its arched windows, the ribbed dome, lantern and cupolas. The detail
 * model adds the blind arches with roundels and the upper storey's sunk
 * panels on every bay, the three-light ground windows, balusters, the
 * fans' full radial bars, the drum's colonettes, more urns, the dome's
 * dormers, and flagpoles.
 *
 * Photos (Wikimedia Commons; all evidence):
 * - r1 "Royal Exhibition Building, Melbourne, northwest view 20230219 1.jpg", DXR, CC BY-SA 4.0
 * - r3 "Royal Exhibition Building - Dome.jpg", Bernard Gagnon, CC BY-SA 4.0
 * - r4 "Royal exhibition building tulips straight.jpg", Diliff, CC BY 2.5 (south front)
 * - r5 "Aerial Photo of Royal Exhibition Building, Melbourne.jpg", Andrew Lukaris, CC BY-SA 2.0 (plan, roofs)
 * - r6 "Eastern entrance to the Royal Exhibition Building December 2020.jpg", Nick-D, CC BY-SA 4.0
 * - r7 "Northern side of the Royal Exhibition Building December 2020.jpg", Nick-D, CC BY-SA 4.0
 * - r8 "Melbourne Royal Exhibition Building (Back).jpg", Boyd159, CC BY-SA 4.0 (north front)
 * - r9 "Royal Exhibition Building Melbourne.jpg", John Torcasio, CC BY-SA 4.0 (west end)
 * - r10 "Royal exhibition building melbourne night time.jpg", Tortakoon Sriruangsakun, public domain
 * No look-only references.
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { polyTris } from './berlin-oberbaum-bridge'
import { arch, box, face, lathe, loftRings, prism, tube, type Layer, type XY } from './sydney-tower-eye'

// ---------------------------------------------------------------------------------------------------------
// Shared helpers (also used by melbourne-shrine-of-remembrance and melbourne-st-pauls-cathedral)

export type Hole = { pts: XY[]; glass?: Part | null }

/**
 * A facade skin on the wall line a->b (outside on the right of a->b): a slab
 * `depth` thick standing proud of the line, z0..z1, pierced by holes (in
 * [s, z] along the wall). Each hole has real reveals back to the line and,
 * when it has `glass`, a panel at its back; without, it is a blind recess
 * showing the mass behind. With `through`, holes run right through a slab
 * that has its own back face (a parapet, an open screen).
 */
export function skin2(p: Part, a: XY, b: XY, z0: number, z1: number, depth: number, holes: Hole[], o: { ends?: boolean; top?: boolean; through?: boolean; s0?: number; s1?: number } = {}) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nrm: XY = [u[1], -u[0]]
  const s0 = o.s0 ?? 0, s1 = o.s1 ?? L
  const W = (s: number, z: number, d: number): V3 => [a[0] + u[0] * s + nrm[0] * d, a[1] + u[1] * s + nrm[1] * d, z]
  const outline: XY[] = [[s0, z0], [s1, z0], [s1, z1], [s0, z1]]
  const N: V3 = [nrm[0], nrm[1], 0]
  const hp = holes.map((h) => h.pts)
  for (const [q, r, t] of polyTris(outline, hp)) face(p, [W(q[0], q[1], depth), W(r[0], r[1], depth), W(t[0], t[1], depth)], N)
  const back = o.through ? -depth : 0
  for (const h of holes) {
    const pts = h.pts
    const cs = pts.reduce((s, q) => s + q[0], 0) / pts.length, cz = pts.reduce((s, q) => s + q[1], 0) / pts.length
    for (let i = 0; i < pts.length; i++) {
      const q = pts[i], r = pts[(i + 1) % pts.length]
      const es = r[0] - q[0], ez = r[1] - q[1]
      let ns = -ez, nz = es
      if (ns * (cs - (q[0] + r[0]) / 2) + nz * (cz - (q[1] + r[1]) / 2) < 0) { ns = -ns; nz = -nz }
      face(p, [W(q[0], q[1], depth), W(r[0], r[1], depth), W(r[0], r[1], back), W(q[0], q[1], back)], [u[0] * ns, u[1] * ns, nz])
    }
    if (h.glass && !o.through) for (const [q, r, t] of polyTris(pts)) face(h.glass, [W(q[0], q[1], 0.03), W(r[0], r[1], 0.03), W(t[0], t[1], 0.03)], N)
  }
  if (o.through) for (const [q, r, t] of polyTris(outline, hp)) face(p, [W(q[0], q[1], -depth), W(r[0], r[1], -depth), W(t[0], t[1], -depth)], [-nrm[0], -nrm[1], 0])
  if (o.top !== false) face(p, [W(s0, z1, o.through ? -depth : 0), W(s1, z1, o.through ? -depth : 0), W(s1, z1, depth), W(s0, z1, depth)], [0, 0, 1])
  if (o.ends !== false) {
    const bk = o.through ? -depth : 0
    face(p, [W(s0, z0, bk), W(s0, z0, depth), W(s0, z1, depth), W(s0, z1, bk)], [-u[0], -u[1], 0])
    face(p, [W(s1, z0, bk), W(s1, z0, depth), W(s1, z1, depth), W(s1, z1, bk)], [u[0], u[1], 0])
  }
}

/**
 * The cheap twin of skin2 for a low model: one slab face, and each glazed
 * hole as a flush panel just proud of it (blind holes are dropped).
 */
export function flatSkin(p: Part, a: XY, b: XY, z0: number, z1: number, depth: number, holes: Hole[], o: { ends?: boolean; top?: boolean } = {}) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nrm: XY = [u[1], -u[0]]
  const W = (s: number, z: number, d: number): V3 => [a[0] + u[0] * s + nrm[0] * d, a[1] + u[1] * s + nrm[1] * d, z]
  const N: V3 = [nrm[0], nrm[1], 0]
  face(p, [W(0, z0, depth), W(L, z0, depth), W(L, z1, depth), W(0, z1, depth)], N)
  for (const h of holes) if (h.glass) for (const [q, r, t] of polyTris(h.pts)) face(h.glass, [W(q[0], q[1], depth + 0.04), W(r[0], r[1], depth + 0.04), W(t[0], t[1], depth + 0.04)], N)
  if (o.top !== false) face(p, [W(0, z1, 0), W(L, z1, 0), W(L, z1, depth), W(0, z1, depth)], [0, 0, 1])
  if (o.ends !== false) {
    face(p, [W(0, z0, 0), W(0, z0, depth), W(0, z1, depth), W(0, z1, 0)], [-u[0], -u[1], 0])
    face(p, [W(L, z0, 0), W(L, z0, depth), W(L, z1, depth), W(L, z1, 0)], [u[0], u[1], 0])
  }
}

/** A point on wall line a->b at distance s along it, d out (to the right), height z. */
export function onWall(a: XY, b: XY, s: number, d: number, z: number): V3 {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  return [a[0] + u[0] * s + u[1] * d, a[1] + u[1] * s - u[0] * d, z]
}

/** A box set against wall line a->b: s0..s1 along, d0..d1 out, z0..z1. */
export const wallBoxDefaults = { back: true, lean: false }
export function wallBox(p: Part, a: XY, b: XY, s0: number, s1: number, d0: number, d1: number, z0: number, z1: number, o: { top?: boolean; bottom?: boolean; back?: boolean } = {}) {
  if ((o.back ?? wallBoxDefaults.back) === false) {
    // the face against the wall is never seen: front, ends, top and bottom only
    const P = (s: number, d: number, z: number) => onWall(a, b, s, d, z)
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: V3 = [(b[0] - a[0]) / L, (b[1] - a[1]) / L, 0], n: V3 = [u[1], -u[0], 0]
    face(p, [P(s0, d1, z0), P(s1, d1, z0), P(s1, d1, z1), P(s0, d1, z1)], n)
    if (!(wallBoxDefaults.lean && s1 - s0 > 3 && z1 - z0 < 3)) {
      face(p, [P(s0, d0, z0), P(s0, d1, z0), P(s0, d1, z1), P(s0, d0, z1)], [-u[0], -u[1], 0])
      face(p, [P(s1, d1, z0), P(s1, d0, z0), P(s1, d0, z1), P(s1, d1, z1)], [u[0], u[1], 0])
    }
    if (o.top !== false) face(p, [P(s0, d0, z1), P(s0, d1, z1), P(s1, d1, z1), P(s1, d0, z1)], [0, 0, 1])
    if (o.bottom && !wallBoxDefaults.lean) face(p, [P(s0, d0, z0), P(s1, d0, z0), P(s1, d1, z0), P(s0, d1, z0)], [0, 0, -1])
    return
  }
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  const c = onWall(a, b, (s0 + s1) / 2, (d0 + d1) / 2, 0)
  box(p, [c[0], c[1]], (s1 - s0) / 2, (d1 - d0) / 2, z0, z1, Math.atan2(u[1], u[0]), o)
}

/** A flat panel on wall line a->b (s0..s1, z0..z1) standing d out: two triangles. */
export function panel(p: Part, a: XY, b: XY, s0: number, s1: number, d: number, z0: number, z1: number) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n: V3 = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L, 0]
  face(p, [onWall(a, b, s0, d, z0), onWall(a, b, s1, d, z0), onWall(a, b, s1, d, z1), onWall(a, b, s0, d, z1)], n)
}

/** An urn or ball finial: a small turned shape. */
export function urn(p: Part, c: XY, z: number, h: number, n = 8) {
  const r = h * 0.28
  if (n <= 6) {
    lathe(p, c, [[r * 0.9, z], [r * 0.9, z + h * 0.5], [0.0001, z + h]], 4, { phase: Math.PI / 4, bottom: false, crease: 20 })
    return
  }
  lathe(p, c, [[r * 0.8, z], [r * 0.45, z + h * 0.22], [r, z + h * 0.5], [r * 0.25, z + h * 0.8], [0.0001, z + h]], n, { crease: 50 })
}

/** A gable-end triangle (or pediment face) on wall line a->b, from z0 up to apex zA at the middle, `t` thick outward. */
export function gable(p: Part, a: XY, b: XY, z0: number, zA: number, t: number) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const P = (s: number, d: number, z: number) => onWall(a, b, s, d, z)
  const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: V3 = [u[1], -u[0], 0]
  face(p, [P(0, t, z0), P(L, t, z0), P(L / 2, t, zA)], n)
  face(p, [P(0, 0, z0), P(L / 2, 0, zA), P(L, 0, z0)], [-n[0], -n[1], 0])
  const sl = (zA - z0) / (L / 2)
  face(p, [P(0, 0, z0), P(0, t, z0), P(L / 2, t, zA), P(L / 2, 0, zA)], [-u[0] * sl, -u[1] * sl, 1])
  face(p, [P(L, t, z0), P(L, 0, z0), P(L / 2, 0, zA), P(L / 2, t, zA)], [u[0] * sl, u[1] * sl, 1])
  face(p, [P(0, 0, z0), P(L, 0, z0), P(L, t, z0), P(0, t, z0)], [0, 0, -1])
}

/** Write the low model and the detail model, checking the budgets (LOD_DRAFT=1 skips the low cap while drafting). */
export async function saveLods(id: string, name: string, low: Layer[], detail: Layer[], extras: Record<string, unknown>, lowMax = 5000) {
  const draft = !!process.env.LOD_DRAFT
  for (const [file, layers, maxT, maxB] of [[`${id}.glb`, low, lowMax, 250 * 1024], [`${id}.detail.glb`, detail, 40000, 1536 * 1024]] as [string, Layer[], number, number][]) {
    const used = layers.filter((l) => l.part.triangles > 0)
    const tris = used.reduce((s, l) => s + l.part.triangles, 0)
    const glb = writeGlb(name, used, { license: 'CC0-1.0', ...extras })
    const msg = `${file}: ${tris} triangles, ${glb.length} bytes (${used.map((l) => `${l.material.name} ${l.part.triangles}`).join(', ')})`
    if (used.length > 6 || ((tris > maxT || glb.length > maxB) && !draft)) throw new Error(`over budget: ${msg}`)
    await Bun.write(new URL(`../models/${file}`, import.meta.url), glb)
    console.log(msg)
  }
}

/**
 * A pediment on wall line a->b (outside to the right), base z0, apex zA,
 * `t` thick outward from the line, with a semicircular notch where an arch
 * (centre at s = n.c, springing n.zs, radius n.r) rises through its base.
 */
export function notchedPediment(p: Part, a: XY, b: XY, z0: number, zA: number, t: number, n: { c: number; r: number; zs: number }, seg = 10) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const th0 = Math.asin(Math.max(-1, Math.min(1, (z0 - n.zs) / n.r)))
  const arc: XY[] = []
  for (let i = 0; i <= seg; i++) { const t2 = Math.PI - th0 - ((Math.PI - 2 * th0) * i) / seg; arc.push([n.c + n.r * Math.cos(t2), n.zs + n.r * Math.sin(t2)]) }
  const poly: XY[] = [[0, z0], ...arc, [L, z0], [L / 2, zA]]
  const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nrm: V3 = [u[1], -u[0], 0]
  const P = (q: XY, d: number) => onWall(a, b, q[0], d, q[1])
  for (const [x, y, z] of polyTris(poly)) { face(p, [P(x, t), P(y, t), P(z, t)], nrm); face(p, [P(x, 0), P(z, 0), P(y, 0)], [-nrm[0], -nrm[1], 0]) }
  for (let i = 0; i < poly.length; i++) {
    const q = poly[i], r = poly[(i + 1) % poly.length]
    const es = r[0] - q[0], ez = r[1] - q[1], l = Math.hypot(es, ez) || 1
    // outward normal of a ccw (s, z) outline
    const ns = ez / l, nz = -es / l
    face(p, [P(q, 0), P(r, 0), P(r, t), P(q, t)], [u[0] * ns, u[1] * ns, nz])
  }
}

/** Shift every vertex of a part by (dx, dy) in the map frame (glTF x, -z). */
export function shift(p: Part, dx: number, dy: number) {
  for (let i = 0; i < p.pos.length; i += 3) { p.pos[i] += dx; p.pos[i + 2] -= dy }
}

// ---------------------------------------------------------------------------------------------------------
// Royal Exhibition Building

const XC = 0.1, YC = -3.9 // the crossing, from the outline centroid
const D = 0.35 // facade skin depth (recess depth)
const CORN = 15.0, PAR = 17.0 // main cornice, balustrade top
const BAY = 5.9

type Set = { render: Part; roof: Part; slate: Part; win: Part; green: Part; gold: Part; band: Part }
const mk = (): Set => ({ render: new Part(), roof: new Part(), slate: new Part(), win: new Part(), green: new Part(), gold: new Part(), band: new Part() })
const low = mk(), det = mk()

let DET = false
const rect = (s0: number, s1: number, z0: number, z1: number): XY[] => [[s0, z0], [s1, z0], [s1, z1], [s0, z1]]
// round-headed opening; in the low model a small one is drawn square-headed to its crown's mean height
const ra = (s0: number, s1: number, zb: number, zs: number, seg: number) => (!DET && s1 - s0 < 2.6 ? rect(s0, s1, zb, zs + (s1 - s0) * 0.39) : arch(s0, s1, zb, zs, false, seg))

/**
 * The standard two-storey bay facade on wall line a->b (the outline; the
 * mass behind is inset by D): pilasters, ground windows, blind arches with
 * roundels, panelled upper storey, cornice and a pierced balustrade.
 */
function bayWall(s: Set, d: boolean, a: XY, b: XY, o: { corn?: number; par?: number; doorMid?: boolean; nb?: number; ends?: boolean } = {}) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const corn = o.corn ?? CORN, par = o.par ?? PAR
  const nb = o.nb ?? Math.max(1, Math.round(L / BAY)), w = L / nb
  const ai = onWall(a, b, 0, -D, 0), bi = onWall(a, b, L, -D, 0)
  const A: XY = [ai[0], ai[1]], B: XY = [bi[0], bi[1]]
  const holes: Hole[] = []
  for (let k = 0; k < nb; k++) {
    const c = w * (k + 0.5)
    const door = o.doorMid && k === Math.floor(nb / 2)
    if (door) {
      holes.push({ pts: ra(c - 1.3, c + 1.3, 0.3, 4.6, d ? 8 : 6), glass: s.green })
    } else if (d) {
      for (const j of [-1, 0, 1]) holes.push({ pts: rect(c + j * 1.05 - 0.4, c + j * 1.05 + 0.4, 1.8, 6.4), glass: s.win })
    } else holes.push({ pts: rect(c - 1.45, c + 1.45, 1.8, 6.4), glass: s.win })
    if (d) holes.push({ pts: ra(c - 1.65, c + 1.65, 7.0, 7.3, 6), glass: null })
  }
  ;(d ? skin2 : flatSkin)(s.render, A, B, 0, corn - 0.3, D, holes, { ends: o.ends ?? false })
  // plinth, pilasters, string course, cornice
  if (d) wallBox(s.render, A, B, 0, L, D, D + 0.25, 0, 1.2, { top: true })
  for (let k = 0; k <= nb; k++) if (d || nb > 2 || k === 0 || k === nb) wallBox(s.render, A, B, k * w - 0.45, k * w + 0.45, D, D + 0.3, 0, corn - 0.3, { top: d })
  if (d) wallBox(s.render, A, B, 0, L, D, D + 0.2, 6.6, 6.9, { top: true, bottom: true })
  if (d) wallBox(s.render, A, B, 0, L, D, D + 0.2, 9.6, 9.9, { top: true, bottom: true })
  if (d) for (let k = 0; k < nb; k++) {
    // roundel in each blind arch
    const c = w * (k + 0.5), p0 = onWall(A, B, c, D * 0.4, 8.2)
    const t: XY = [(B[0] - A[0]) / L, (B[1] - A[1]) / L]
    const ring: V3[] = Array.from({ length: 8 }, (_, i) => { const th = (i / 8) * Math.PI * 2; return [p0[0] + t[0] * 0.55 * Math.cos(th), p0[1] + t[1] * 0.55 * Math.cos(th), p0[2] + 0.55 * Math.sin(th)] })
    const nn: V3 = [t[1], -t[0], 0]
    face(s.render, ring.map((q) => [q[0] + nn[0] * 0.25, q[1] + nn[1] * 0.25, q[2]] as V3), nn)
    loftRings(s.render, [ring, ring.map((q) => [q[0] + nn[0] * 0.25, q[1] + nn[1] * 0.25, q[2]] as V3)])
  }
  wallBox(s.render, A, B, -0.2, L + 0.2, D, D + 0.65, corn - 0.3, corn + 0.2, { top: true, bottom: true })
  if (par - corn < 1.5) return
  if (!d) { wallBox(s.render, A, B, 0, L, 0.17, 0.53, corn + 0.2, par, { top: true }); return }
  // balustrade: a parapet pierced between its dies
  const ph: Hole[] = []
  for (let k = 0; k < nb; k++) for (const h of [0, 1]) ph.push({ pts: rect(k * w + 0.75 + h * (w - 1.2) / 2, k * w + 0.75 + (h + 1) * (w - 1.2) / 2 - 0.3, corn + 0.6, par - 0.45) })
  skin2(s.render, onWall(A, B, 0, 0.35, 0).slice(0, 2) as XY, onWall(A, B, L, 0.35, 0).slice(0, 2) as XY, corn + 0.2, par, 0.18, ph, { through: true })
  if (d) for (let k = 0; k <= nb; k++) { const pc = onWall(A, B, k * w, 0.35, 0); urn(s.render, [pc[0], pc[1]], par, 1.2, 6) }
}

/** A wall line with a plain skin and given holes (no bays). */
function plainWall(s: Set, a: XY, b: XY, z0: number, z1: number, holes: Hole[], o: { ends?: boolean; real?: boolean } = {}) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const ai = onWall(a, b, 0, -D, 0), bi = onWall(a, b, L, -D, 0)
  ;(o.real || DET ? skin2 : flatSkin)(s.render, [ai[0], ai[1]], [bi[0], bi[1]], z0, z1, D, holes, { ends: o.ends ?? false })
}

/** Inset rectangle mass. */
function mass(s: Set, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) {
  prism(s.render, [[x0 + D, y0 + D], [x1 - D, y0 + D], [x1 - D, y1 - D], [x0 + D, y1 - D]], z0, z1, { top: true })
}

/** Corners of a rectangle as ccw wall lines: [south, east, north, west]. */
const sides = (x0: number, x1: number, y0: number, y1: number): [XY, XY][] => [
  [[x0, y0], [x1, y0]], [[x1, y0], [x1, y1]], [[x1, y1], [x0, y1]], [[x0, y1], [x0, y0]],
]

/** A pitched roof, ridge along x (from x0 to x1) over y0..y1, or along y. */
function pitched(p: Part, x0: number, x1: number, y0: number, y1: number, zE: number, zR: number, along: 'x' | 'y', ov = 0.5) {
  if (along === 'x') {
    const yc = (y0 + y1) / 2, h = (zR - zE) * ov / ((y1 - y0) / 2)
    face(p, [[x0, y0 - ov, zE - h], [x1, y0 - ov, zE - h], [x1, yc, zR], [x0, yc, zR]], [0, -(zR - zE), (y1 - y0) / 2])
    face(p, [[x1, y1 + ov, zE - h], [x0, y1 + ov, zE - h], [x0, yc, zR], [x1, yc, zR]], [0, (zR - zE), (y1 - y0) / 2])
    face(p, [[x0, y0 - ov, zE - h], [x0, y1 + ov, zE - h], [x1, y1 + ov, zE - h], [x1, y0 - ov, zE - h]], [0, 0, -1])
  } else {
    const xc = (x0 + x1) / 2, h = (zR - zE) * ov / ((x1 - x0) / 2)
    face(p, [[x0 - ov, y1, zE - h], [x0 - ov, y0, zE - h], [xc, y0, zR], [xc, y1, zR]], [-(zR - zE), 0, (x1 - x0) / 2])
    face(p, [[x1 + ov, y0, zE - h], [x1 + ov, y1, zE - h], [xc, y1, zR], [xc, y0, zR]], [(zR - zE), 0, (x1 - x0) / 2])
    face(p, [[x0 - ov, y0, zE - h], [x1 + ov, y0, zE - h], [x1 + ov, y1, zE - h], [x0 - ov, y1, zE - h]], [0, 0, -1])
  }
}

/** A lean-to roof falling from zH at the inner line to zL at the outer line. */
function leanTo(p: Part, corners: [V3, V3, V3, V3]) {
  const [a, b, c] = corners
  const e1: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], e2: V3 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  let n: V3 = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]]
  if (n[2] < 0) n = n.map((x) => -x) as V3
  face(p, corners, n)
  face(p, corners, n.map((x) => -x) as V3)
}

/** A fan lunette: a semicircular window on wall line a->b, centred at s=c, springing zs, radius r, with radial bars. */
function fan(s: Set, d: boolean, a: XY, b: XY, c: number, zs: number, r: number, dOut: number) {
  const seg = d ? 16 : 10
  const pts: V3[] = [onWall(a, b, c - r, dOut, zs)]
  for (let i = 0; i <= seg; i++) { const t = Math.PI - (Math.PI * i) / seg; pts.push(onWall(a, b, c + r * Math.cos(t), dOut, zs + r * Math.sin(t))) }
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n: V3 = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L, 0]
  const ctr = onWall(a, b, c, dOut, zs)
  for (let i = 1; i < pts.length - 1; i++) face(s.win, [ctr, pts[i], pts[i + 1]], n)
  // bars: radial spokes, an inner ring and the fan's hub
  const nb = d ? 13 : 5
  for (let i = 0; i <= nb; i++) {
    const t = (Math.PI * i) / nb
    const p0 = onWall(a, b, c + r * 0.3 * Math.cos(t), dOut + 0.08, zs + r * 0.3 * Math.sin(t))
    const p1 = onWall(a, b, c + r * 0.98 * Math.cos(t), dOut + 0.08, zs + r * 0.98 * Math.sin(t))
    if (d) tube(s.render, [p0, p1], 0.12, 4)
    else flatBar(s.render, p0, p1, 0.4, n)
  }
  const ring = (rr: number, k: number) => Array.from({ length: k + 1 }, (_, i) => { const t = (Math.PI * i) / k; return onWall(a, b, c + rr * Math.cos(t), dOut + 0.08, zs + rr * Math.sin(t)) })
  if (d) tube(s.render, ring(r * 0.3, 8), 0.18, 4)

  if (d) tube(s.render, ring(r * 0.66, 14), 0.13, 4)
  if (d) tube(s.render, [onWall(a, b, c - r, dOut + 0.08, zs + 0.1), onWall(a, b, c + r, dOut + 0.08, zs + 0.1)], 0.2, 4)
  else flatBar(s.render, onWall(a, b, c - r, dOut + 0.08, zs + 0.15), onWall(a, b, c + r, dOut + 0.08, zs + 0.15), 0.4, n)
}

/** A flat bar (two triangles) from p to q, `w` wide, facing n. */
function flatBar(p: Part, a: V3, b: V3, w: number, n: V3) {
  const t: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]]
  let x: V3 = [n[1] * t[2] - n[2] * t[1], n[2] * t[0] - n[0] * t[2], n[0] * t[1] - n[1] * t[0]]
  const l = Math.hypot(...x) || 1
  x = x.map((v) => (v / l) * w / 2) as V3
  face(p, [[a[0] - x[0], a[1] - x[1], a[2] - x[2]], [a[0] + x[0], a[1] + x[1], a[2] + x[2]], [b[0] + x[0], b[1] + x[1], b[2] + x[2]], [b[0] - x[0], b[1] - x[1], b[2] - x[2]]], n)
}

/** A small domed cupola on a square stage: lathe dome, finial (and flagpole in the detail model). */
function cupola(s: Set, d: boolean, c: XY, z: number, r: number, h: number, mat: Part, flag: number) {
  const n = d ? 16 : 6
  if (d) lathe(mat, c, [[r, z], [r, z + 0.3], [r * 0.97, z + h * 0.3], [r * 0.85, z + h * 0.58], [r * 0.6, z + h * 0.82], [r * 0.3, z + h * 0.96], [0.0001, z + h]], n, { bottom: true, crease: 35 })
  else lathe(mat, c, [[r, z], [r * 0.95, z + h * 0.35], [r * 0.7, z + h * 0.72], [0.0001, z + h]], n, { crease: 35 })
  if (d && r > 3.5) for (let i = 0; i < 8; i++) {
    const t = (i / 8) * Math.PI * 2, P = (rr: number, zz: number): V3 => [c[0] + rr * Math.cos(t), c[1] + rr * Math.sin(t), zz]
    tube(mat, [P(r * 1.02, z + 0.3), P(r * 0.99, z + h * 0.3), P(r * 0.87, z + h * 0.58), P(r * 0.62, z + h * 0.82), P(r * 0.31, z + h * 0.96)], 0.12, 3)
  }
  lathe(s.render, c, d ? [[0.35, z + h - 0.1], [0.35, z + h + 0.4], [0.2, z + h + 0.6], [0.3, z + h + 0.9], [0.0001, z + h + 1.4]] : [[0.35, z + h - 0.1], [0.3, z + h + 0.7], [0.0001, z + h + 1.4]], d ? 6 : 4, { crease: 50 })
  if (d) tube(s.render, [[c[0], c[1], z + h + 1.2], [c[0], c[1], z + h + flag]], 0.07, 4)
}

/** Mirror a part north-south (map y -> -y), keeping faces wound outward. */
function mirrorY(p: Part) {
  for (let t = 0; t < p.pos.length; t += 9) {
    for (let v = 0; v < 3; v++) { p.pos[t + v * 3 + 2] *= -1; p.nrm[t + v * 3 + 2] *= -1 }
    for (let c = 0; c < 3; c++) {
      const a = t + 3 + c, b = t + 6 + c
      ;[p.pos[a], p.pos[b]] = [p.pos[b], p.pos[a]]
      ;[p.nrm[a], p.nrm[b]] = [p.nrm[b], p.nrm[a]]
    }
    const u = (t / 9) * 6
    ;[p.uv[u + 2], p.uv[u + 4]] = [p.uv[u + 4], p.uv[u + 2]]
    ;[p.uv[u + 3], p.uv[u + 5]] = [p.uv[u + 5], p.uv[u + 3]]
  }
}

type Front = { xi: number; xo: number; yF: number; setback: number; yTB: number; yBack: number; CT: number; UT: number; AR: number; AZ: number; cupR: number; cupH: number }

/**
 * A south-facing entrance front: two towers (xi..xo either side of the
 * axis, front at yF, back at yTB) with their belfry stages and cupolas, and
 * between them the great arch (radius AR springing at AZ) recessed 3.5 m,
 * its fan filling the head over a dark door screen, the cornice at CT and an attic over it;
 * behind, the arm to yBack with its roof up to the nave ridge.
 */
function frontPavilion(s: Set, d: boolean, f: Front) {
  const { xi, xo, CT, UT } = f
  const yC = f.yF + f.setback // the centre's face
  const RIDGE = 23.5
  // arm: walls to the cornice, roof
  const RD = 3.5 // the arch's recess, deep enough to hold its shadow
  mass(s, -xi, xi, yC + RD - D, f.yBack, 0, CT)
  pitched(s.roof, -xi, xi, yC + 0.5, f.yBack + 1, CT, RIDGE, 'y', 0.4)
  if (f.yBack > -24.6) {
    plainWall(s, [xi, -24.6], [xi, f.yBack], CORN, CT, [])
    plainWall(s, [-xi, f.yBack], [-xi, -24.6], CORN, CT, [])
  }
  // centre: the great arch through a deep skin, the fan filling its head, a dark door screen below
  const a: XY = [-xi, yC], b: XY = [xi, yC], W = 2 * xi
  const ai = onWall(a, b, 0, -RD, 0), bi = onWall(a, b, W, -RD, 0)
  const A2: XY = [ai[0], ai[1]], B2: XY = [bi[0], bi[1]]
  skin2(s.render, A2, B2, 0, CT, RD, [{ pts: ra(xi - f.AR, xi + f.AR, 0.01, f.AZ, d ? 12 : 8), glass: null }], { ends: true })
  fan(s, d, A2, B2, xi, f.AZ + 0.3, f.AR - 0.4, 0.02)
  wallBox(s.render, A2, B2, xi - f.AR, xi + f.AR, 0, 0.5, f.AZ - 0.3, f.AZ + 0.3, { top: true, bottom: true })
  panel(s.green, A2, B2, xi - f.AR, xi + f.AR, 0.03, 0.01, f.AZ - 0.3)
  for (const dc of [-3.4, -1.15, 1.15, 3.4]) panel(s.win, A2, B2, xi + dc - 0.95, xi + dc + 0.95, 0.06, 5.0, f.AZ - 0.7)
  const ring: V3[] = Array.from({ length: (d ? 12 : 8) + 1 }, (_, i) => { const t = Math.PI * i / (d ? 12 : 8); return onWall(a, b, xi + (f.AR + 0.35) * Math.cos(t), 0.15, f.AZ + (f.AR + 0.35) * Math.sin(t)) })
  tube(s.render, ring, 0.4, 4)
  wallBox(s.render, a, b, -0.2, W + 0.2, 0, 0.7, CT - 0.2, CT + 0.5, { top: true, bottom: true })
  wallBox(s.render, a, b, 0, W, 0, 0.3, 0, 1.2, { top: true })
  // the attic over the arch
  wallBox(s.render, a, b, 0, W, -0.3, 0.2, CT + 0.5, CT + 1.4, { top: true })
  wallBox(s.render, a, b, -0.1, W + 0.1, -0.3, 0.45, CT + 1.4, CT + 1.8, { top: true, bottom: true })
  // towers
  for (const sg of [-1, 1]) {
    const x0 = sg > 0 ? xi : -xo, x1 = sg > 0 ? xo : -xi, y0 = f.yF, y1 = f.yTB
    mass(s, x0, x1, y0, y1, 0, CT)
    for (const [p, q] of sides(x0, x1, y0, y1)) {
      const L = Math.hypot(q[0] - p[0], q[1] - p[1])
      const front = p[1] === y0 && q[1] === y0
      if (p[1] === y1 && q[1] === y1) continue
      const inner = p[0] === q[0] && Math.abs(p[0]) === xi
      if (inner && f.setback < 0.5) continue
      const holes: Hole[] = inner ? [] : [{ pts: ra(L / 2 - 0.8, L / 2 + 0.8, 9.6, 12.8, d ? 8 : 5), glass: s.win }, { pts: rect(L / 2 - 0.8, L / 2 + 0.8, 15.2, 17.6), glass: s.win }]
      if (front) holes.push({ pts: ra(L / 2 - 1.1, L / 2 + 1.1, 0.01, 3.6, d ? 8 : 5), glass: s.green })
      else if (!inner) holes.push({ pts: rect(L / 2 - 0.7, L / 2 + 0.7, 2.0, 5.6), glass: s.win })
      plainWall(s, p, q, 0, CT - 0.3, holes, { ends: true })
      const pi = onWall(p, q, 0, -D, 0), qi = onWall(p, q, L, -D, 0)
      const A: XY = [pi[0], pi[1]], B: XY = [qi[0], qi[1]]
      if (!inner) for (const sc of [0.5, L - 0.5]) wallBox(s.render, A, B, sc - 0.5, sc + 0.5, D, D + 0.3, 0, CT - 0.3, { top: true })
      wallBox(s.render, A, B, -0.3, L + 0.3, D, D + 0.7, CT - 0.4, CT + 0.5, { top: true, bottom: true })
      if (d) wallBox(s.render, A, B, 0, L, D, D + 0.25, 0, 1.2, { top: true })
      if (d) wallBox(s.render, A, B, 0, L, D, D + 0.2, 8.6, 9.0, { top: true, bottom: true })
    }
    // belfry stage: square at the front of the tower, arched pair on each face
    const bx0 = x0 + 0.25, bx1 = x1 - 0.25, by0 = y0 + 0.25, by1 = by0 + (bx1 - bx0)
    mass(s, bx0, bx1, by0, by1, CT + 0.5, UT)
    for (const [p, q] of sides(bx0, bx1, by0, by1)) {
      const L = Math.hypot(q[0] - p[0], q[1] - p[1])
      plainWall(s, p, q, CT + 0.5, UT, [-1, 1].map((j) => ({ pts: ra(L / 2 + j * 1.05 - 0.5, L / 2 + j * 1.05 + 0.5, CT + 1.4, UT - 1.6, d ? 6 : 4), glass: s.win })), { ends: true })
      const pi = onWall(p, q, 0, 0, 0), qi = onWall(p, q, L, 0, 0)
      wallBox(s.render, [pi[0], pi[1]], [qi[0], qi[1]], -0.3, L + 0.3, -0.2, 0.5, UT, UT + 0.6, { top: true, bottom: true })
    }
    const c: XY = [(bx0 + bx1) / 2, (by0 + by1) / 2]
    cupola(s, d, c, UT + 0.6, f.cupR, f.cupH, s.roof, 9)
    for (const [px, py] of [[bx0 + 0.3, by0 + 0.3], [bx1 - 0.3, by0 + 0.3], [bx1 - 0.3, by1 - 0.3], [bx0 + 0.3, by1 - 0.3]] as XY[]) { if (d) urn(s.render, [px, py], UT + 0.6, 1.2, 6) }
  }
}

for (const [s, d] of [[low, false], [det, true]] as [Set, boolean][]) {
  DET = d
  wallBoxDefaults.back = false
  wallBoxDefaults.lean = !d
  // ---- Aisle mass and long walls ----
  const VA = 24.9 // long walls
  mass(s, -76.7, 76.7, -VA, VA, 0, CORN + 0.2)
  for (const sg of [1, -1]) {
    // long walls, east and west of the arms, on both sides (outside right of a->b)
    for (const [u0, u1] of [[16, 39.6], [45.8, 69.2]] as XY[]) {
      // south wall runs west->east (outside south), north wall east->west
      bayWall(s, d, [sg * (sg > 0 ? u0 : u1), -VA], [sg * (sg > 0 ? u1 : u0), -VA], { nb: 4 })
      bayWall(s, d, [sg * (sg > 0 ? u1 : u0), VA], [sg * (sg > 0 ? u0 : u1), VA], { nb: 4 })
    }
    // side entrance projections, 1 m proud, with a taller attic
    for (const vs of [-1, 1]) {
      const v0 = vs * VA, v1 = vs * (VA + 1)
      mass(s, sg > 0 ? 39.6 : -45.8, sg > 0 ? 45.8 : -39.6, Math.min(v0, v1) - (vs < 0 ? 0 : D), Math.max(v0, v1) + (vs < 0 ? D : 0), 0, CORN + 2.4)
      const a: XY = vs < 0 ? [sg > 0 ? 39.6 : -45.8, v1] : [sg > 0 ? 45.8 : -39.6, v1]
      const b: XY = vs < 0 ? [sg > 0 ? 45.8 : -39.6, v1] : [sg > 0 ? 39.6 : -45.8, v1]
      bayWall(s, d, a, b, { nb: 1, doorMid: true, par: PAR + 0.8, ends: true })
    }
  }

  // ---- Clerestory and nave roof ----
  const VN = 10.0, EAVE = 19.8, RIDGE = 23.5
  for (const sg of [1, -1]) {
    for (const vs of [-1, 1]) {
      const a: XY = vs < 0 ? [sg > 0 ? 16 : -82.6, -VN] : [sg > 0 ? 82.6 : -16, VN]
      const b: XY = vs < 0 ? [sg > 0 ? 82.6 : -16, -VN] : [sg > 0 ? 16 : -82.6, VN]
      const L = 66.6, nb = 11, w = L / nb
      const holes: Hole[] = []
      for (let k = 0; k < nb; k++) {
        const c = w * (k + 0.5)
        if (d) holes.push({ pts: ra(c - 1.2, c + 1.2, 17.6, 18.6, 6), glass: s.win })
        else holes.push({ pts: rect(c - 1.25, c + 1.25, 17.6, 19.4), glass: s.win })
      }
      plainWall(s, a, b, CORN, EAVE, holes)
      const ai = onWall(a, b, 0, -D, 0), bi = onWall(a, b, L, -D, 0)
      wallBox(s.render, [ai[0], ai[1]], [bi[0], bi[1]], 0, L, D, D + 0.4, EAVE - 0.4, EAVE, { top: true, bottom: true })
      // aisle roof: from behind the balustrade up to the clerestory
      const x0 = sg > 0 ? 16 : -76.7, x1 = sg > 0 ? 76.7 : -16
      leanTo(s.roof, [[x0, vs * (VA - 0.3), PAR - 0.6], [x1, vs * (VA - 0.3), PAR - 0.6], [x1, vs * VN, 17.2], [x0, vs * VN, 17.2]])
    }
    prism(s.render, [[sg > 0 ? 16 : -82.6, -VN + D], [sg > 0 ? 82.6 : -16, -VN + D], [sg > 0 ? 82.6 : -16, VN - D], [sg > 0 ? 16 : -82.6, VN - D]], CORN, EAVE, { top: false })
    pitched(s.roof, sg > 0 ? 15 : -82.4, sg > 0 ? 82.4 : -15, -VN, VN, EAVE, RIDGE, 'x', 0.6)
  }

  // ---- East and west ends: end blocks, frontispiece with the great fan arch rising into the pediment ----
  for (const sg of [1, -1]) {
    const X0 = 76.7, X1 = 82.6, X2 = 84.6, VE = 15, VF = 11.2
    mass(s, sg > 0 ? X0 : -X1, sg > 0 ? X1 : -X0, -VE, VE, 0, CORN + 0.2)
    // the end block's faces either side of the frontispiece, and its returns
    for (const vs of [-1, 1]) {
      const a: XY = [sg * X1, vs * (sg * vs > 0 ? VF : VE)], b: XY = [sg * X1, vs * (sg * vs > 0 ? VE : VF)]
      bayWall(s, d, a, b, { nb: 1, ends: true })
      const r0: XY = [sg * X0, vs * VE], r1: XY = [sg * X1, vs * VE]
      // return walls facing north/south (outside away from the axis)
      bayWall(s, d, sg * vs > 0 ? r1 : r0, sg * vs > 0 ? r0 : r1, { nb: 1 })
      // wing walls from the end block back to the pavilion (u 76.7, v 15..24.5)
      const w0: XY = [sg * X0, vs * VE], w1: XY = [sg * X0, vs * 24.5]
      bayWall(s, d, sg * vs > 0 ? w0 : w1, sg * vs > 0 ? w1 : w0, { nb: 2 })
    }
    // frontispiece: piers, the arch (springing 11, radius 7) recessed 2 m
    const a: XY = [sg * X2, -sg * VF], b: XY = [sg * X2, sg * VF] // outside is +u for sg 1
    const archR = 7, archZ = 11, ENT = 15.8, PED = 16.8, APEX = 23.5
    mass(s, sg > 0 ? X1 - 0.5 - D : -(X2 - 2.0) - D, sg > 0 ? X2 - 2.0 + D : -(X1 - 0.5) + D, -VF + D, VF - D, 0, PED)
    const L = 2 * VF
    const ai = onWall(a, b, 0, -2.0, 0), bi = onWall(a, b, L, -2.0, 0)
    const A2: XY = [ai[0], ai[1]], B2: XY = [bi[0], bi[1]]
    // the skin runs to the entablature's top; the arch's head rises through it into the pediment
    skin2(s.render, A2, B2, 0, PED, 2.0, [{ pts: ra(VF - archR, VF + archR, 0.01, archZ, d ? 12 : 8).map(([x, z]) => [x, Math.min(z, PED - 0.03)] as XY).filter((q, i, arr) => i === 0 || Math.abs(q[0] - arr[i - 1][0]) + Math.abs(q[1] - arr[i - 1][1]) > 1e-4), glass: null }], { ends: true })
    fan(s, d, A2, B2, VF, archZ + 0.3, archR - 0.4, 0.02)
    wallBox(s.render, A2, B2, VF - archR, VF + archR, 0, 0.5, archZ - 0.2, archZ + 0.4, { top: true, bottom: true })
    for (const dc of [-3.2, 0, 3.2]) panel(s.green, A2, B2, VF + dc - 1.2, VF + dc + 1.2, 0.06, 0.2, 4.8)
    for (const dc of [-3.2, 0, 3.2]) panel(s.win, A2, B2, VF + dc - 1.0, VF + dc + 1.0, 0.06, 5.6, 8.6)
    // paired pilasters on the piers, plinth, entablature on the piers
    for (const sc of [0.5, 2.6, L - 2.6, L - 0.5]) wallBox(s.render, a, b, sc - 0.5, sc + 0.5, 0, 0.45, 1.2, ENT, { top: true })
    wallBox(s.render, a, b, -0.3, L + 0.3, 0, 0.3, 0, 1.2, { top: true })
    for (const [e0, e1] of [[-0.4, VF - archR - 0.6], [VF + archR + 0.6, L + 0.4]]) wallBox(s.render, a, b, e0, e1, -0.2, 0.8, ENT, PED, { top: true, bottom: true })
    if (d) for (const sc of [1.55, L - 1.55]) { panel(s.win, a, b, sc - 0.45, sc + 0.45, 0.03, 10.4, 12.8); panel(s.win, a, b, sc - 0.45, sc + 0.45, 0.03, 4.2, 7.6) }
    // the archivolt: a moulded ring round the arch head, proud of the face
    const ring: V3[] = Array.from({ length: (d ? 12 : 8) + 1 }, (_, i) => { const t = Math.PI * i / (d ? 12 : 8); return onWall(a, b, VF + (archR + 0.35) * Math.cos(t), 0.15, archZ + (archR + 0.35) * Math.sin(t)) })
    tube(s.render, ring, 0.4, 4)
    // pediment with the arch's notch, raking cornices, acroteria
    notchedPediment(s.render, onWall(a, b, -0.5, -2.4, 0).slice(0, 2) as XY, onWall(a, b, L + 0.5, -2.4, 0).slice(0, 2) as XY, PED, APEX, 2.7, { c: VF + 0.5, r: archR + 0.75, zs: archZ }, d ? 12 : 8)
    const apex = onWall(a, b, L / 2, 0.55, APEX + 0.3)
    for (const e of [-0.6, L + 0.6]) { const q = onWall(a, b, e, 0.55, PED - 0.1); tube(s.render, [q, apex], 0.32, 4) }
    for (const sc of [0.4, L - 0.4]) { if (!d) continue; const q = onWall(a, b, sc, 0.3, 0); urn(s.render, [q[0], q[1]], PED, 1.8, d ? 8 : 6) }
    const q = onWall(a, b, L / 2, 0.2, 0); urn(s.render, [q[0], q[1]], APEX, 1.9, d ? 8 : 6)
  }

  // ---- Corner pavilions ----
  for (const sg of [1, -1]) for (const vs of [1, -1]) {
    const x0 = sg > 0 ? 69.2 : -80, x1 = sg > 0 ? 80 : -69.2
    const y0 = vs > 0 ? 24.5 : -35, y1 = vs > 0 ? 35 : -24.5
    mass(s, x0, x1, y0, y1, 0, 17.5)
    for (const [a, b] of sides(x0, x1, y0, y1)) {
      // skip the face against the aisle mass
      const inner = Math.abs(a[1]) === 24.5 && Math.abs(b[1]) === 24.5
      if (inner) continue
      bayWall(s, d, a, b, { nb: 2, par: 15.6, ends: true })
      // attic with three arched windows
      const L = Math.hypot(b[0] - a[0], b[1] - a[1])
      const holes: Hole[] = [-1, 0, 1].map((j) => ({ pts: ra(L / 2 + j * 2.4 - 0.5, L / 2 + j * 2.4 + 0.5, 15.6, 16.6, d ? 6 : 4), glass: s.win }))
      plainWall(s, a, b, CORN + 0.2, 17.5, holes, { ends: true })
      const ai = onWall(a, b, 0, 0, 0), bi = onWall(a, b, L, 0, 0)
      wallBox(s.render, [ai[0], ai[1]], [bi[0], bi[1]], -0.3, L + 0.3, -0.2, 0.55, 17.5, 18.0, { top: true, bottom: true })
    }
    const c: XY = [(x0 + x1) / 2, (y0 + y1) / 2]
    if (d) lathe(s.render, c, [[4.9, 17.9], [4.9, 18.3]], 16, {})
    cupola(s, d, c, 18.3, 4.8, 3.3, s.roof, 10)
    for (const [px, py] of [[x0 + 0.4, y0 + 0.4], [x1 - 0.4, y0 + 0.4], [x1 - 0.4, y1 - 0.4], [x0 + 0.4, y1 - 0.4]] as XY[]) { if (d) urn(s.render, [px, py], 18.0, 1.3, 6) }
  }

  // ---- Crossing: base (a square with notched corners), drum, dome, lantern ----
  const ZB = 24.6, ZP = 26.2
  for (const [hx, hy] of [[16, 11.1], [11.1, 16]] as XY[]) {
    prism(s.render, [[-hx + D, -hy + D], [hx - D, -hy + D], [hx - D, hy - D], [-hx + D, hy - D]], 15, ZB, { top: true })
  }
  // faces of the cross (outside right of a->b, ccw)
  const crossFaces: [XY, XY][] = [
    [[-11.1, -16], [11.1, -16]], [[11.1, -16], [11.1, -11.1]], [[11.1, -11.1], [16, -11.1]], [[16, -11.1], [16, 11.1]],
    [[16, 11.1], [11.1, 11.1]], [[11.1, 11.1], [11.1, 16]], [[11.1, 16], [-11.1, 16]], [[-11.1, 16], [-11.1, 11.1]],
    [[-11.1, 11.1], [-16, 11.1]], [[-16, 11.1], [-16, -11.1]], [[-16, -11.1], [-11.1, -11.1]], [[-11.1, -11.1], [-11.1, -16]],
  ]
  for (const [a, b] of crossFaces) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const big = L > 10
    const holes: Hole[] = big ? [-1, 1].map((j) => ({ pts: ra(L / 2 + j * 5 - 0.7, L / 2 + j * 5 + 0.7, 19.0, 22.2, d ? 8 : 4), glass: s.win })) : []
    if (big) holes.push({ pts: ra(L / 2 - 1.4, L / 2 + 1.4, 18.6, 21.6, d ? 10 : 6), glass: s.win })
    plainWall(s, a, b, 15, ZB - 0.3, holes, { ends: d })
    const ai = onWall(a, b, 0, -D, 0), bi = onWall(a, b, L, -D, 0)
    const A: XY = [ai[0], ai[1]], B: XY = [bi[0], bi[1]]
    if (d || big) for (const sc of [0.5, L - 0.5]) wallBox(s.render, A, B, sc - 0.5, sc + 0.5, D, D + 0.3, 15, ZB - 0.3, { top: true })
    wallBox(s.render, A, B, -0.3, L + 0.3, D, D + 0.7, ZB - 0.4, ZB + 0.2, { top: true, bottom: true })
    const ph: Hole[] = L > 10 ? [0, 1, 2].map((k) => ({ pts: rect(0.8 + k * (L - 1.6) / 3 + 0.4, 0.8 + (k + 1) * (L - 1.6) / 3 - 0.4, ZB + 0.6, ZP - 0.4) })) : [{ pts: rect(0.8, L - 0.8, ZB + 0.6, ZP - 0.4) }]
    if (d) skin2(s.render, onWall(A, B, 0, 0.35, 0).slice(0, 2) as XY, onWall(A, B, L, 0.35, 0).slice(0, 2) as XY, ZB + 0.2, ZP, 0.18, ph, { through: true })
    else wallBox(s.render, A, B, 0, L, 0.17, 0.53, ZB + 0.2, ZP, { top: true })
    if (d) for (const sc of [0, L]) { const q = onWall(A, B, sc, 0.35, 0); urn(s.render, [q[0], q[1]], ZP, 1.6, 6) }
  }
  // flat roof of the base, a step below the parapet
  prism(s.roof, [[-15.5, -10.6], [15.5, -10.6], [15.5, 10.6], [-15.5, 10.6]], ZB, ZB + 0.25, { top: true })
  prism(s.roof, [[-10.6, -15.5], [10.6, -15.5], [10.6, 15.5], [-10.6, 15.5]], ZB, ZB + 0.25, { top: true })

  // drum: octagon, flats facing the axes
  const oct = (ap: number, z: number): V3[] => Array.from({ length: 8 }, (_, i) => {
    const t = Math.PI / 8 + (i * Math.PI) / 4, r = ap / Math.cos(Math.PI / 8)
    return [r * Math.cos(t), r * Math.sin(t), z]
  })
  const D0 = ZB + 0.2, D1 = 32.0, D2 = 38.4, D3 = 42.6
  loftRings(s.render, [oct(9.75, D0), oct(9.75, D1)])
  loftRings(s.render, [oct(9.95, D1 - 0.1), oct(9.95, D1 + 0.4)], { bottom: true, top: true })
  const ap2 = 9.45
  // window stage: each face a skin with two arched windows (real recesses)
  for (let i = 0; i < 8; i++) {
    const t0 = Math.PI / 8 + (i * Math.PI) / 4, t1 = t0 + Math.PI / 4, r = (ap2 - D) / Math.cos(Math.PI / 8)
    const a: XY = [r * Math.cos(t0), r * Math.sin(t0)], b: XY = [r * Math.cos(t1), r * Math.sin(t1)]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const holes: Hole[] = [-1, 1].map((j) => ({ pts: ra(L / 2 + j * 1.3 - 0.7, L / 2 + j * 1.3 + 0.7, 32.7, 37.0, d ? 8 : 5), glass: s.win }))
    ;(d ? skin2 : flatSkin)(s.render, a, b, D1 + 0.4, D2, D + 0.15, holes, { ends: false, top: false })
    // corner pilaster clusters and the colonette between the pair
    const outA = onWall(a, b, 0, 0, 0)
    box(s.render, [outA[0] * 1.03, outA[1] * 1.03], 0.55, 0.55, D1 + 0.4, D2, t0, { top: true })
    if (d) wallBox(s.render, a, b, L / 2 - 0.18, L / 2 + 0.18, D + 0.15, D + 0.4, 32.8, 37.6, { top: true })
  }
  prism(s.render, oct(ap2 - D, 0).map((q) => [q[0], q[1]] as XY), D1 + 0.4, D2, { top: false })
  loftRings(s.render, [oct(10.0, D2), oct(10.0, D2 + 0.6)], { bottom: true, top: true })
  loftRings(s.render, [oct(9.6, D2 + 0.6), oct(9.6, D3 - 0.6)])
  loftRings(s.render, [oct(10.05, D3 - 0.6), oct(10.05, D3)], { bottom: true, top: true })
  if (d) for (let i = 0; i < 8; i++) {
    // sunk panels on the attic
    const t0 = Math.PI / 8 + (i * Math.PI) / 4, t1 = t0 + Math.PI / 4, r = 9.6 / Math.cos(Math.PI / 8)
    const a: XY = [r * Math.cos(t0), r * Math.sin(t0)], b: XY = [r * Math.cos(t1), r * Math.sin(t1)]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    wallBox(s.render, a, b, 0.9, L - 0.9, 0, 0.12, D2 + 1.2, D2 + 1.6, { top: true, bottom: true })
    wallBox(s.render, a, b, 0.9, L - 0.9, 0, 0.12, D3 - 1.6, D3 - 1.2, { top: true, bottom: true })
  }
  // urns: at the corners (and mid-faces in detail) on the drum top
  for (let i = 0; i < (d ? 16 : 0); i++) {
    const t = Math.PI / 8 + (i * Math.PI) / (d ? 8 : 4)
    const r = (i % 2 === 1 && d ? 9.7 : 9.7 / Math.cos(Math.PI / 8)) - 0.35
    urn(s.render, [r * Math.cos(t), r * Math.sin(t)], D3, 1.5, d ? 8 : 6)
  }
  // dome: octagonal cloister vault, faces flat, ribs on the angles
  const prof: [number, number][] = [[9.35, D3], [9.3, D3 + 1.2], [9.0, D3 + 2.8], [8.35, D3 + 4.6], [7.3, D3 + 6.4], [5.85, D3 + 8.1], [4.0, D3 + 9.7], [2.1, D3 + 11.0], [1.9, D3 + 11.2]]
  const rings = prof.map(([r, z]) => oct(r, z))
  // the slate's two red-brown bands (r3, r9) on the third and fifth courses of the profile
  for (let k = 0; k < rings.length - 1; k++) loftRings(k === 2 || k === 4 ? s.band : s.slate, [rings[k], rings[k + 1]])
  face(s.slate, rings[rings.length - 1], [0, 0, 1])
  for (let i = 0; i < 8; i++) {
    const t = Math.PI / 8 + (i * Math.PI) / 4
    const pts = prof.filter((_, k) => d || k % 2 === 0 || k === prof.length - 1).map(([r, z]) => { const rr = r / Math.cos(Math.PI / 8) + 0.05; return [rr * Math.cos(t), rr * Math.sin(t), z + 0.05] as V3 })
    if (d) tube(s.roof, pts, 0.3, 4)
    else for (let k = 0; k < pts.length - 1; k++) {
      // a ridge of two faces along the angle, standing 0.35 proud
      const tg: V3 = [-Math.sin(t) * 0.45, Math.cos(t) * 0.45, 0], A = pts[k], B = pts[k + 1]
      const up = (q: V3, f: number): V3 => [q[0] + Math.cos(t) * 0.35 * f, q[1] + Math.sin(t) * 0.35 * f, q[2] + 0.2 * f]
      for (const sg of [1, -1]) face(s.roof, [[A[0] + tg[0] * sg, A[1] + tg[1] * sg, A[2]], [B[0] + tg[0] * sg, B[1] + tg[1] * sg, B[2]], up(B, 1), up(A, 1)], [Math.cos(t) + tg[0] * sg * 2, Math.sin(t) + tg[1] * sg * 2, 0.4])
    }
  }
  // dormers: a green hooded oculus on each face, two-thirds up
  for (let i = 0; i < 8; i++) {
    const t = (i * Math.PI) / 4, k = 4 // between rings 4 and 5 (z ~ 57.4)
    const z = D3 + 7.0, r = (prof[k][0] + prof[k + 1][0]) / 2 - 0.2
    const c: XY = [r * Math.cos(t), r * Math.sin(t)]
    box(s.green, c, 0.6, 0.9, z - 0.6, z + 0.8, t, { top: true })
    if (d) {
      const n: V3 = [Math.cos(t), Math.sin(t), 0], tg: V3 = [-Math.sin(t), Math.cos(t), 0]
      const ring: V3[] = Array.from({ length: 8 }, (_, j) => { const th = (j / 8) * Math.PI * 2; return [c[0] + n[0] * 0.62 + tg[0] * 0.45 * Math.cos(th), c[1] + n[1] * 0.62 + tg[1] * 0.45 * Math.cos(th), z + 0.1 + 0.45 * Math.sin(th)] })
      face(s.win, ring, n)
      lathe(s.green, [c[0] + n[0] * 0.3, c[1] + n[1] * 0.3], [[0.25, z + 0.8], [0.0001, z + 1.5]], 4)
    }
  }
  // lantern: green octagon with openings, gilt cupola, ball and finial
  const LZ = D3 + 11.2
  const lo = (ap: number, z: number) => oct(ap, z)
  loftRings(s.green, [lo(2.3, LZ), lo(2.3, LZ + 0.5)], { top: true })
  if (d) {
    for (let i = 0; i < 8; i++) {
      const t = Math.PI / 8 + (i * Math.PI) / 4, r = 1.95 / Math.cos(Math.PI / 8)
      box(s.green, [r * Math.cos(t), r * Math.sin(t)], 0.22, 0.22, LZ + 0.5, LZ + 2.8, t)
    }
    lathe(s.green, [0, 0], [[1.5, LZ + 0.5], [1.5, LZ + 2.8]], 8, { phase: Math.PI / 8 })
  } else loftRings(s.green, [lo(1.95, LZ + 0.5), lo(1.95, LZ + 2.8)])
  loftRings(s.green, [lo(2.35, LZ + 2.8), lo(2.35, LZ + 3.3)], { bottom: true, top: true })
  lathe(s.gold, [0, 0], [[2.0, LZ + 3.3], [2.05, LZ + 3.6], [1.75, LZ + 4.3], [1.0, LZ + 4.9], [0.35, LZ + 5.2], [0.0001, LZ + 5.25]], d ? 16 : 8, { crease: 35 })
  lathe(s.gold, [0, 0], [[0.18, LZ + 5.15], [0.45, LZ + 5.45], [0.45, LZ + 5.75], [0.12, LZ + 6.05], [0.0001, LZ + 6.8]], d ? 10 : 6, { crease: 50 })
  if (d) tube(s.render, [[0, 0, LZ + 6.6], [0, 0, 68]], 0.1, 4)

  // ---- South front (towers, great arch) and the south arm behind it ----
  frontPavilion(s, d, { xi: 7.0, xo: 13.8, yF: -34.3, setback: 1.3, yTB: -23.3, yBack: -16, CT: 21.2, UT: 28.0, AR: 6.75, AZ: 13.3, cupR: 3.2, cupH: 4.0 })

  // ---- North arm and front ----
  {
    const VS = 16, VE = 52.5, VF = 60.8
    mass(s, -16, 16, VA - 1, VE, 0, CORN + 0.2)
    bayWall(s, d, [16, VA], [16, VE], { nb: 5 })
    bayWall(s, d, [-16, VE], [-16, VA], { nb: 5 })
    for (const sg of [1, -1]) {
      const a: XY = sg > 0 ? [10, VS] : [-10, VE], b: XY = sg > 0 ? [10, VE] : [-10, VS]
      const holes: Hole[] = []
      for (let k = 0; k < 6; k++) { const c = 36.5 / 6 * (k + 0.5); holes.push({ pts: d ? ra(c - 1.2, c + 1.2, 17.6, 18.6, 6) : rect(c - 1.2, c + 1.2, 17.6, 19.4), glass: s.win }) }
      plainWall(s, a, b, CORN, EAVE, holes)
      leanTo(s.roof, [[sg * 15.7, VA - 0.8, PAR - 0.6], [sg * 15.7, VE, PAR - 0.6], [sg * 10, VE, 17.2], [sg * 10, VA - 0.8, 17.2]])
    }
    prism(s.render, [[-10 + D, VS], [10 - D, VS], [10 - D, VE], [-10 + D, VE]], CORN, EAVE, { top: false })
    pitched(s.roof, -10, 10, VS, VE + 1.0, EAVE, RIDGE, 'y', 0.6)
    // the north front: the same composition, mirrored
    const n = mk()
    frontPavilion(n, d, { xi: 7.0, xo: 13.0, yF: -VF, setback: 0, yTB: -VE, yBack: -VE, CT: 20.8, UT: 27.5, AR: 6.75, AZ: 12.9, cupR: 2.8, cupH: 3.6 })
    for (const key of Object.keys(n) as (keyof Set)[]) { mirrorY(n[key]); s[key].pos.push(...n[key].pos); s[key].nrm.push(...n[key].nrm); s[key].uv.push(...n[key].uv) }
  }
}

const render: MaterialSpec = {
  ...finish('reb-render', 0xeadcc0),
  floodlight: (p, n) => (n[2] > 0.7 ? 0.25 : Math.max(0.35, 1 - p[2] / 90)),
}
const slate: MaterialSpec = { ...finish('reb-dome-slate', 0x878d97), floodlight: (p, n) => (p[2] > 45 ? 0.7 : 0) }
const layers = (s: Set): Layer[] => {
  for (const p of Object.values(s)) shift(p, XC, YC)
  // the lantern, dormer hoods and doors share the slate's dark grey-blue (their own green would be a 7th material)
  s.slate.pos.push(...s.green.pos); s.slate.nrm.push(...s.green.nrm); s.slate.uv.push(...s.green.uv)
  return [
    { part: s.render, material: render },
    { part: s.roof, material: finish('reb-roof', 0xb9bcbd) },
    { part: s.slate, material: slate },
    { part: s.win, material: PALETTE.window },
    { part: s.band, material: finish('reb-dome-band', 0x9a7166) },
    { part: s.gold, material: finish('reb-gilt', 0xd8b55a, 0.5) },
  ]
}

wallBoxDefaults.back = true
wallBoxDefaults.lean = false
if (import.meta.main) {
  await saveLods('melbourne-royal-exhibition-building', 'Royal Exhibition Building', layers(low), layers(det), {
    frame: 'Y up, -Z north, +X east, metres; origin at the OSM outline centroid on the ground; bearing 8',
    bearing: 8, height: 68,
  }, 6500)
}
