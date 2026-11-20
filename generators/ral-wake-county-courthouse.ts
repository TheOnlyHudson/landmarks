/**
 * Wake County Courthouse, Raleigh (1970) — original procedural geometry,
 * CC0-1.0.
 * bun generators/ral-wake-county-courthouse.ts [out.glb]
 *
 * Uses the kit in ral-wells-fargo-capitol-center.ts.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of OSM way/47663721, 35.776268,
 * -78.639894. Bearing 2: the outline's edges run 2.07° east of north; in
 * that frame it is a 44.5 m square, x and y ±22.25.
 *
 * Identity (photos below): a pale granite-aggregate cube. On every face
 * sixteen continuous slit windows run between broad projecting piers from
 * the fourth storey to just under a solid attic pierced by a row of small
 * square vents; below the slits each pier kinks outward and drops as a
 * battered buttress to the ground, framing a recessed glazed ground floor;
 * on the Fayetteville Street (east) front a bronze county seal over a wide
 * glazed entrance. A square penthouse stands on the roof.
 *
 * Evidence:
 *  - plan: OSM way/47663721. Penthouse 28 m square, centred: measured on
 *    USGS NAIP (0.11 m/px).
 *  - heights: 65 m published in OSM (height=65, source WakeGIS), 14 levels.
 *    Main parapet 62 m and penthouse to 65 m: estimated (the penthouse is
 *    not seen from the street; its shadow on NAIP is about 4 m). Ground
 *    storey 5.5 m, kinked pier zone to 12.5 m, slits to 57 m, attic 57–62
 *    m: estimated by scaling Daderot's photo of the east front against the
 *    44.5 m face width. Pier projection 0.7 m, 2.0 m at the foot:
 *    estimated from Matt Walter's photo along the north side.
 *  - ground: Mapterhorn z13 slopes ~2.5 m down to the south-west; y = 0 is
 *    the lowest corner, and each face's storefront and kink start at that
 *    face's own ground (east +2.1, north +2.0, west +0.5, south +1.0 m).
 *    Elevation 0.
 *  - colours from the photos: warm pale granite aggregate, dark glass,
 *    bronze seal; pulled to the palette's lightness.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Wake County Courthouse - Raleigh, NC - DSC05816.JPG, Daderot, public
 *    domain https://commons.wikimedia.org/wiki/File:Wake_County_Courthouse_-_Raleigh,_NC_-_DSC05816.JPG
 *    (east front square on: slits, piers, attic vents, seal, entrance)
 *  - Wake County Courthouse - Flickr - matt.walter.jpg, Matt Walter, CC BY
 *    2.0 https://commons.wikimedia.org/wiki/File:Wake_County_Courthouse_-_Flickr_-_matt.walter.jpg
 *    (north side at dusk, looking along the kinked pier feet)
 * USGS NAIP for the roof and the west face (sixteen bays, seen in the
 * image's lean). No look-only sources used (State Archives postcards show
 * the earlier courthouse). No commercial imagery.
 *
 * Doubts: the south and west faces are seen only in the leaning aerial and
 * assumed like the north and east; the slits are drawn in three-storey
 * groups (STYLE.md) though the real ones are nearly continuous; the attic
 * vents and the penthouse height are estimates; the front steps and plaza
 * are the map's.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type Face, rect, ringFaces, plate, coping, cap } from './ral-wells-fargo-capitol-center'
import { write, add2 } from './atl-one-atlantic-center'

const stone = new Part(), glass = new Part(), entry = new Part(), roof = new Part(), seal = new Part()

const H = 22.25, ATTIC0 = 57, TOP = 62, PENT = 65
const SLITS = 16, PIER_OUT = 0.7, FOOT_OUT = 2.0
const ground = (x: number, y: number) => Math.max(0, 1.55 + 0.028 * x + 0.022 * y)

const P = (f: Face, s: number, z: number, out: number): V3 => {
  const q = add2(add2(f.a, f.t, s), f.n, out)
  return [q[0], q[1], z]
}

/** A pier standing out of face f from s0 to s1, profile [z, out] bottom to top. */
/** With `corner`, the pier also fills the square outside the building's corner at s = 0. */
function pier(f: Face, s0: number, s1: number, prof: Array<[number, number]>, corner = false) {
  for (let i = 0; i < prof.length - 1; i++) {
    const [z0, o0] = prof[i], [z1, o1] = prof[i + 1]
    const a0 = corner ? -o0 : s0, a1 = corner ? -o1 : s0
    stone.quad(P(f, a0, z0, o0), P(f, s1, z0, o0), P(f, s1, z1, o1), P(f, a1, z1, o1))
    stone.quad(P(f, a0, z0, 0), P(f, a0, z0, o0), P(f, a1, z1, o1), P(f, a1, z1, 0))
    if (!corner) stone.quad(P(f, s1, z0, o0), P(f, s1, z0, 0), P(f, s1, z1, 0), P(f, s1, z1, o1))
  }
}

const ring = rect(-H, -H, H, H)
for (const f of ringFaces(ring, 0, TOP)) {
  const mid = add2(f.a, f.t, f.len / 2), g = ground(mid[0], mid[1])
  const G1 = g + 5.5, KINK = g + 12.5
  const front = f.n[0] > 0.9 // the Fayetteville Street front
  // the core wall: stone above the storefront, slits in three-storey groups
  plate(stone, f, 0, f.len, G1, ATTIC0, 0, 0)
  plate(glass, f, 0, f.len, 0, G1, -1.2, 0) // the recessed ground-floor glazing
  // soffit over the recessed storefront
  stone.quad(P(f, 0, G1, -1.2), P(f, f.len, G1, -1.2), P(f, f.len, G1, 0), P(f, 0, G1, 0))
  const corner = 1.6
  const bay = (f.len - 2 * corner) / SLITS
  const slitW = 0.8, pierW = bay - slitW, footW = 1.3 // slits a third of a bay; pier feet narrower
  const storey = (ATTIC0 - KINK) / 12
  for (let k = 0; k <= SLITS; k++) {
    // piers sit between the slits; the corner piers are wider
    const c = corner + k * bay
    const s0 = k === 0 ? 0 : c - pierW / 2, s1 = k === SLITS ? f.len : c + pierW / 2
    const f0 = k === 0 ? 0 : c - footW / 2, f1 = k === SLITS ? f.len : c + footW / 2
    pier(f, s0, s1, [[KINK, PIER_OUT], [ATTIC0, PIER_OUT]], k === 0)
    // the underside of the upper pier where it overhangs the narrower foot
    // over the entrance (east front, middle three bays) the piers stop at the kink
    const open = front && k >= 7 && k <= 9
    if (open) {
      stone.quad(P(f, s0, KINK, 0), P(f, s1, KINK, 0), P(f, s1, KINK, PIER_OUT), P(f, s0, KINK, PIER_OUT))
    } else {
      if (k > 0) stone.quad(P(f, s0, KINK, 0), P(f, f0, KINK, 0), P(f, f0, KINK, PIER_OUT), P(f, s0, KINK, PIER_OUT))
      if (k < SLITS) stone.quad(P(f, f1, KINK, 0), P(f, s1, KINK, 0), P(f, s1, KINK, PIER_OUT), P(f, f1, KINK, PIER_OUT))
      pier(f, f0, f1, [[0, FOOT_OUT], [G1, FOOT_OUT], [KINK, PIER_OUT]], k === 0)
    }
    if (k < SLITS) {
      const a = c + pierW / 2 + 0.05, b = a + slitW - 0.1
      for (let gI = 0; gI < 4; gI++) {
        const z0 = KINK + 0.4 + gI * 3 * storey, z1 = KINK + (gI + 1) * 3 * storey - 0.4
        plate(glass, f, a, b, z0, z1, 0.05)
      }
    }
  }
  // the attic: flush with the pier fronts, a row of small square vents, bevelled lip
  plate(stone, f, -PIER_OUT, f.len, ATTIC0, TOP - 0.4, PIER_OUT, PIER_OUT)
  for (let k = 0; k < SLITS; k++) {
    const c = corner + (k + 0.5) * bay
    plate(glass, f, c - 0.35, c + 0.35, ATTIC0 + 2.0, ATTIC0 + 3.4, PIER_OUT + 0.05)
  }
  coping(stone, { ...f, a: add2(add2(f.a, f.n, PIER_OUT), f.t, -PIER_OUT), b: add2(add2(f.b, f.n, PIER_OUT), f.t, PIER_OUT), z1: TOP } as Face, 0.6, 0.0, 0.35)
  if (front) {
    // the wide glazed entrance between the middle piers, and the bronze seal
    const m = f.len / 2
    plate(entry, f, m - 5.2, m + 5.2, g, G1 - 0.4, -1.1)
    const r = 2.0, zc = g + 9.2, segs = 16
    for (let i = 0; i < segs; i++) {
      const a0 = (2 * Math.PI * i) / segs, a1 = (2 * Math.PI * (i + 1)) / segs
      seal.tri(P(f, m, zc, 0.12), P(f, m + r * Math.cos(a0), zc + r * Math.sin(a0), 0.12), P(f, m + r * Math.cos(a1), zc + r * Math.sin(a1), 0.12))
    }
  }
}
// the roof inside the attic lip, and the penthouse
cap(roof, rect(-H - PIER_OUT, -H - PIER_OUT, H + PIER_OUT, H + PIER_OUT), TOP)
{
  const pen = rect(-14, -14, 14, 14)
  for (const f of ringFaces(pen, TOP, PENT)) {
    plate(stone, f, 0, f.len, TOP, PENT, 0, 0)
    coping(stone, f, 0.6, 0.1, 0.3)
  }
  cap(roof, pen, PENT)
}

await write('ral-wake-county-courthouse', 'Wake County Courthouse', [
  { part: stone, material: finish('wake-granite', 0xe9e2d4) },
  { part: glass, material: PALETTE.window },
  { part: entry, material: PALETTE.entrance },
  { part: seal, material: finish('wake-bronze', 0x8a7a62) },
  { part: roof, material: PALETTE.roof },
], { bearing: 2, elevation: 0, height: PENT, replaces: ['way/47663721'] })
