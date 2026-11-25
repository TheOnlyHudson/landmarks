/**
 * The Beehive (Executive Wing, New Zealand Parliament Buildings), Molesworth
 * Street, Wellington: procedural, CC0-1.0.
 * bun generators/wellington-beehive.ts
 *
 * Also exports `radialFin`, a fin in a radial plane, used by the other
 * `wellington-` generators of this batch. Merge this file first.
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (the tower is round).
 * Origin at the centroid of OSM's Beehive outline way/26022581
 * (174.7766259, -41.2784371), a 51-node circle of r 27.25 m: the floor slab
 * ring at the colonnade's foot. y = 0 is the lowest ground at the podium's
 * foot (the Bowen Street / Molesworth Street side).
 *
 * Designed by Sir Basil Spence, built 1969-81. A round, tapering tower of
 * ten storeys above ground on a one-storey marble-clad podium: a double-
 * height colonnade of pale piers in front of dark glass, five stepped
 * office tiers each with a pale spandrel band and a ring of wedge-shaped
 * concrete fins in front of its window band, a glazed top floor under a
 * deep eave, a steep copper-clad roof storey with six recessed window bays
 * screened by tall copper blades, and a copper plant drum with the flag
 * mast.
 *
 * OSM: the Beehive outline r 27.25; building:parts way/740174285..292 give
 * the tier radii (25.9 the colonnade, then 23.75, 22.6, 21.35, 20.15, 19.05,
 * the copper roof 17.9 and the drum 8.75). Their heights (28, 35 ... 70, 72 m)
 * step 7 m a tier and don't match the photos; not used. The podium is
 * way/153924620 (building=government, 1 level, marble), drawn here as the
 * tower's own base and replaced with it.
 *
 * Published: 72 m, ten floors above ground and four below (Wikipedia "The
 * Beehive"); the 72 m counts the basements; the tower's height above the
 * street is photo-scaled below.
 *
 * Photo-scaled (b5, from Lambton Quay ~250 m east, near level; scale from
 * the 54.5 m base ring and checked on the drum, 17.7 m against OSM's 17.5):
 * colonnade 11.4 m; five tiers of 3.75 m with 0.7 m bands; glazed top floor
 * 2.3 m; eave soffit and fascia 1.45 m; copper roof wall 5.7 m; drum 3.3 m.
 * With the podium deck at 6 m (estimated from b8, where the colonnade's
 * foot stands about 3.5 m above the northern forecourt, which is itself
 * above the lower streets) the drum's top is 50.6 m above y = 0, the mast
 * about 59 m.
 * Roof bays: six, 60 degrees apart, one facing east (b5), each ~10.3 m wide
 * and 4.7 m tall with about ten blades (b1, b3, b5).
 * Estimated: colonnade pier count (24, from b4/b5), fin count (80 a tier
 * from b1; 40 in the low model), fin and pier depths, the podium's height.
 * Left out: the balcony railings (detail model draws the colonnade's), the
 * flag, the security entrance pavilion on the north (way/1030567129, a
 * separate OSM building), the Beehive Annex to the west.
 *
 * Lead review round 1: the tiers' bands and fins are bronze-dark 0x6b5d50 (greyer, round 2)
 * and the glass near-black 0x33383e, as b5 reads overall; the profile is a
 * bell (radii 24.2, 23.5, 22.6, 21.45, 19.95, 18.2), the colonnade taller
 * (to 18.7 m, tiers 3.51 m) with slimmer piers. Pale concrete stays on the
 * slab ring, the colonnade slab and the top floor's struts.
 * Earlier colour notes (sample.ts in the work folder): spandrels and fins sunlit
 * #c5c3ae / #c8cab8 (b1), #a5a89c (b4, shade) -> concrete 0xd2cdbd; copper
 * roof (overcast b3) #7f635f, darker in shade; sunlit it reads red-brown ->
 * 0x8a5e4e; podium marble grey (b8) -> 0xc4c4bd; deck grey -> roof.
 *
 * Night (b6): window bands lit, colonnade glass lit; the concrete is not
 * floodlit. Windows are `window`.
 *
 * LODs: the low model has every form with 40 fins a tier and 24 piers; the
 * detail model has 80 fins a tier, the colonnade's soffit brackets and
 * railing, more blades and the tripod mast.
 *
 * Photos (Wikimedia Commons; all evidence):
 * - b1 "Wellington, Beehive, May 2015.jpg", Michal Klajban, CC BY-SA 4.0
 * - b2 "Beehive, Wellington from behind.jpg", Ballofstring, CC BY-SA 4.0
 * - b3 "Beehive, Wellington - view from above.jpg", Ballofstring, CC BY-SA 4.0
 * - b4 "Beehive, Wellington - New Zealand - DSC00141.jpg", Daderot, CC0
 * - b5 "Wellington, Beehive, 2016-01-25.jpg", Szilas, public domain
 * - b6 "Beehive and Parliament House at night.jpg", Pseudopanax, public domain
 * - b8 "Beehive (New Zealand Parliament Building).jpg", Paasikivi, CC BY-SA 4.0
 * No look-only references.
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { lathe, tube, prism, face, ccw, saveLods, type XY, type Layer } from './sydney-tower-eye'
import { polyTris } from './berlin-oberbaum-bridge'

/**
 * A fin in the radial plane at azimuth `a` (radians from +x, anticlockwise),
 * `t` thick, with outline `poly` in [r, z] (convex, any winding). `skip`
 * lists edge indices (edge i runs poly[i] -> poly[i+1]) to leave open where
 * they sit against a wall.
 */
export function radialFin(p: Part, c: XY, a: number, t: number, poly: [number, number][], skip: number[] = []) {
  const cs = Math.cos(a), sn = Math.sin(a)
  const P = (r: number, z: number, s: number): V3 => [c[0] + r * cs - s * sn, c[1] + r * sn + s * cs, z]
  const tan: V3 = [-sn, cs, 0]
  face(p, poly.map(([r, z]) => P(r, z, t / 2)), tan)
  face(p, poly.map(([r, z]) => P(r, z, -t / 2)), [sn, -cs, 0])
  const cr = poly.reduce((s, q) => s + q[0], 0) / poly.length, cz = poly.reduce((s, q) => s + q[1], 0) / poly.length
  for (let i = 0; i < poly.length; i++) {
    if (skip.includes(i)) continue
    const [r0, z0] = poly[i], [r1, z1] = poly[(i + 1) % poly.length]
    let nr = z1 - z0, nz = -(r1 - r0)
    if (nr * ((r0 + r1) / 2 - cr) + nz * ((z0 + z1) / 2 - cz) < 0) { nr = -nr; nz = -nz }
    face(p, [P(r0, z0, -t / 2), P(r1, z1, -t / 2), P(r1, z1, t / 2), P(r0, z0, t / 2)], [nr * cs, nr * sn, nz])
  }
}

// ---- Dimensions ------------------------------------------------------------------------------------------

const O: XY = [0, 0]
const DECK = 6.0 // podium deck
const RING_R = 27.25, RING_Z0 = 5.5, RING_Z1 = 7.0 // floor slab ring at the colonnade's foot
const COL_TOP = 18.7, COL_SLAB = 19.6, COL_R = 26.2, COL_GLASS = 23.9 // colonnade
const PITCH = 3.51, BAND = 0.7
const R = [24.2, 23.5, 22.6, 21.45, 19.95, 18.2] // band k outer radius: a bell, steep below and rounding in under the roof (lead review; OSM's parts step evenly)
const bandZ = (k: number) => COL_SLAB + PITCH * k
const TOP_FLOOR = bandZ(5) + BAND // 37.85
const EAVE = TOP_FLOOR + 2.3, FASCIA = EAVE + 0.85 // soffit underside, fascia top
const ROOF_R0 = 17.9, ROOF_R1 = 17.05, ROOF_TOP = FASCIA + 5.7
const DRUM_R = 8.85, DRUM_TOP = 50.6
const TOP_GLASS = 16.0

// Podium, OSM way/153924620 in this frame.
const PODIUM: XY[] = [[-41.9, 29.0], [-5.8, 27.6], [3.2, 27.2], [28.4, 26.2], [26.7, -28.9], [-43.7, -26.1]]

type Set = { conc: Part; bronze: Part; win: Part; cop: Part; roof: Part; marble: Part }
const mk = (): Set => ({ conc: new Part(), bronze: new Part(), win: new Part(), cop: new Part(), roof: new Part(), marble: new Part() })
const low = mk(), det = mk()
const deg = Math.PI / 180

for (const [s, d] of [[low, false], [det, true]] as [Set, boolean][]) {
  const N = d ? 96 : 36 // around the big rings
  const NF = d ? 84 : 56 // fins a tier
  const NP = 24 // colonnade piers

  // Podium: marble walls, grey deck, a coping lip.
  prism(s.marble, PODIUM, 0, DECK - 0.4, { top: false })
  prism(s.conc, PODIUM, DECK - 0.4, DECK, { top: false })
  for (const [a, b, c] of polyTris(ccw(PODIUM))) face(s.roof, [[a[0], a[1], DECK], [b[0], b[1], DECK], [c[0], c[1], DECK]], [0, 0, 1])

  // Floor slab ring at the colonnade's foot.
  lathe(s.conc, O, [[COL_GLASS, RING_Z0], [RING_R, RING_Z0], [RING_R, RING_Z1], [COL_GLASS, RING_Z1]], N, { crease: 30 })

  // Colonnade: dark glass drum, pale piers, the deep slab over them.
  lathe(s.win, O, [[COL_GLASS, RING_Z1], [COL_GLASS, COL_TOP]], N)
  for (let i = 0; i < NP; i++) {
    const a = ((i + 0.5) / NP) * Math.PI * 2
    radialFin(s.conc, O, a, d ? 0.8 : 0.95, [[COL_GLASS - 0.1, RING_Z1], [25.9, RING_Z1], [25.9, COL_TOP], [COL_GLASS - 0.1, COL_TOP]], [1, 3])
    if (d) {
      // a slim mullion fin between each pair of piers
      const b = ((i + 1) / NP) * Math.PI * 2
      radialFin(s.conc, O, b, 0.3, [[COL_GLASS - 0.05, RING_Z1], [24.6, RING_Z1], [24.6, COL_TOP], [COL_GLASS - 0.05, COL_TOP]], [1, 3])
    }
  }
  lathe(s.conc, O, [[COL_GLASS, COL_TOP], [COL_R, COL_TOP], [COL_R, COL_SLAB], [R[0], COL_SLAB]], N, { crease: 30 })
  if (d) {
    // soffit brackets, two a bay, and the balcony railing
    for (let i = 0; i < NP * 2; i++) {
      const a = (i / (NP * 2)) * Math.PI * 2
      radialFin(s.conc, O, a, 0.35, [[COL_GLASS, COL_TOP], [COL_R - 0.2, COL_TOP], [COL_GLASS, COL_TOP - 1.1]], [0])
    }
    lathe(s.conc, O, [[COL_R - 0.15, COL_SLAB], [COL_R - 0.15, COL_SLAB + 1.0], [COL_R - 0.3, COL_SLAB + 1.0], [COL_R - 0.3, COL_SLAB]], N, { crease: 30 })
  }

  // Five finned tiers: band k, then the window band behind fins up to band k+1.
  for (let k = 0; k < 6; k++) {
    const z0 = bandZ(k), z1 = z0 + BAND
    const inner = k < 5 ? R[k + 1] - 0.55 : TOP_GLASS
    // band face, its top back to the window wall
    lathe(s.bronze, O, [[R[k], z0], [R[k], z1], [inner, z1]], N, { crease: 30 })
    if (k === 5) break
    const zt = bandZ(k + 1)
    lathe(s.win, O, [[inner, z1], [inner, zt]], N)
    // underside of the next band
    lathe(s.bronze, O, [[inner, zt], [R[k + 1], zt]], N)
    for (let i = 0; i < NF; i++) {
      const a = (i / NF) * Math.PI * 2
      radialFin(s.bronze, O, a, d ? 0.3 : 0.36, [[inner - 0.05, z1], [R[k] - 0.05, z1], [R[k + 1] - 0.02, zt], [inner - 0.05, zt]], [0, 2, 3])
    }
  }

  // Glazed top floor, slanted struts to the eave, the eave and its fascia.
  lathe(s.win, O, [[TOP_GLASS, TOP_FLOOR], [TOP_GLASS, EAVE]], N)
  const NS = 24
  for (let i = 0; i < NS; i++) {
    const a = ((i + 0.5) / NS) * Math.PI * 2
    radialFin(s.conc, O, a, 0.45, [[TOP_GLASS, TOP_FLOOR], [TOP_GLASS + 0.5, TOP_FLOOR], [ROOF_R0 - 0.4, EAVE], [TOP_GLASS, EAVE]], [3])
  }
  lathe(s.conc, O, [[TOP_GLASS, EAVE], [ROOF_R0, EAVE], [ROOF_R0, FASCIA]], N, { crease: 30 })

  // Copper roof storey: a steep wall with six recessed bays, then the flat to the drum.
  const BAYS = 6, BAY_W = 34 * deg, BAY_TOP = FASCIA + 4.7
  const bayC = (j: number) => (j / BAYS) * Math.PI * 2 // 0 = east, every 60 degrees
  const rAt = (z: number) => ROOF_R0 + ((ROOF_R1 - ROOF_R0) * (z - FASCIA)) / (ROOF_TOP - FASCIA)
  const segs = d ? 14 : 7
  for (let j = 0; j < BAYS; j++) {
    const a0 = bayC(j) + BAY_W / 2, a1 = bayC(j + 1) - BAY_W / 2
    // wall between bays, full height
    lathe(s.cop, O, [[ROOF_R0, FASCIA], [ROOF_R1, ROOF_TOP]], segs, { arc: [a0, a1] })
    // over the bay: the band above the opening
    const b0 = bayC(j) - BAY_W / 2, b1 = bayC(j) + BAY_W / 2
    lathe(s.cop, O, [[rAt(BAY_TOP), BAY_TOP], [ROOF_R1, ROOF_TOP]], d ? 6 : 3, { arc: [b0, b1] })
    // recess: soffit, back wall (glass), sill, sides
    const BACK = 15.9
    lathe(s.cop, O, [[BACK, BAY_TOP], [rAt(BAY_TOP), BAY_TOP]], d ? 6 : 3, { arc: [b0, b1] })
    lathe(s.win, O, [[BACK, FASCIA], [BACK, BAY_TOP]], d ? 6 : 3, { arc: [b0, b1] })
    lathe(s.cop, O, [[ROOF_R0, FASCIA], [BACK, FASCIA]], d ? 6 : 3, { arc: [b0, b1] })
    for (const [e, sg] of [[b0, 1], [b1, -1]] as [number, number][]) {
      const P = (r: number, z: number): V3 => [r * Math.cos(e), r * Math.sin(e), z]
      face(s.cop, [P(BACK, FASCIA), P(ROOF_R0, FASCIA), P(rAt(BAY_TOP), BAY_TOP), P(BACK, BAY_TOP)], [-Math.sin(e) * sg, Math.cos(e) * sg, 0])
    }
    // the blades, standing a little above the roof's edge
    const NB = d ? 11 : 7
    for (let b = 0; b < NB; b++) {
      const a = b0 + ((b + 0.5) / NB) * BAY_W
      radialFin(s.cop, O, a, d ? 0.22 : 0.3, [[BACK + 0.1, FASCIA], [ROOF_R0 + 0.15, FASCIA], [ROOF_R1 + 0.25, ROOF_TOP + 1.0], [BACK + 0.6, ROOF_TOP + 1.0]], [])
    }
  }
  lathe(s.cop, O, [[ROOF_R1, ROOF_TOP], [DRUM_R + 0.2, ROOF_TOP + 0.45]], N)

  // Plant drum.
  lathe(s.cop, O, [[DRUM_R, ROOF_TOP + 0.3], [DRUM_R, DRUM_TOP], [DRUM_R - 0.4, DRUM_TOP]], N, { crease: 30 })
  lathe(s.roof, O, [[DRUM_R - 0.4, DRUM_TOP], [0.01, DRUM_TOP + 0.3]], N)

  // Flag mast on a tripod.
  const MAST = DRUM_TOP + 8.5
  if (d) {
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2 + 0.3
      tube(s.conc, [[Math.cos(a) * 1.6, Math.sin(a) * 1.6, DRUM_TOP + 0.3], [0, 0, DRUM_TOP + 3.2]], 0.08, 5)
    }
    tube(s.conc, [[0, 0, DRUM_TOP + 0.2], [0, 0, MAST]], 0.11, 6, true)
  } else {
    tube(s.conc, [[0, 0, DRUM_TOP + 0.2], [0, 0, MAST]], 0.16, 4, true)
  }
}

// ---- Materials and output --------------------------------------------------------------------------------

const CONC: MaterialSpec = finish('beehive-concrete', 0xd2cdbd)
const WIN: MaterialSpec = { ...PALETTE.window, color: 0x33383e } // dark glass (b1, b5)
const BRONZE: MaterialSpec = finish('beehive-bronze', 0x6b5d50) // tiers and fins, lead review against b5
const COP: MaterialSpec = finish('beehive-copper', 0x7a5244, 0.7)
const ROOF: MaterialSpec = PALETTE.roof
const MARBLE: MaterialSpec = finish('podium-marble', 0xc4c4bd)
const layers = (s: Set): Layer[] => [
  { part: s.conc, material: CONC },
  { part: s.bronze, material: BRONZE },
  { part: s.win, material: WIN },
  { part: s.cop, material: COP },
  { part: s.roof, material: ROOF },
  { part: s.marble, material: MARBLE },
]

if (import.meta.main) {
  await saveLods('wellington-beehive', 'The Beehive', layers(low), layers(det), {
    frame: 'Y up, -Z north, +X east, metres; origin at the centre of the Beehive outline (way/26022581), lowest ground',
    bearing: 0, height: 59,
  }, 6500)
}
