/**
 * Telstra Tower (Black Mountain Tower), Black Mountain, Canberra:
 * procedural, CC0-1.0.
 * bun generators/canberra-telstra-tower.ts
 *
 * Builds with the kit exported by generators/sydney-tower-eye.ts (lathe,
 * tube, box, prism, saveLods); merge that file first.
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (the tower is round).
 * Origin on the shaft's axis: the centroid of OSM's tower outline way/37693613
 * (149.097773, -35.275535), a 34 m circle that matches the antenna platform.
 * y = 0 is the summit ground at the shaft's foot. The base building is OSM
 * way/653355549 (building=retail, the visitor/base building around the shaft).
 *
 * Designed by Richard Ure and the Commonwealth Department of Works; built
 * 1973-1980 (opened 15 May 1980). A concrete shaft carries a three-floor
 * antenna platform ringed with white drum dish antennas, a two-storey turret
 * (former revolving restaurant and indoor observation deck) with an open deck
 * on its roof, two small discs higher up, a tapering upper shaft, and a red
 * and white lattice mast.
 *
 * Published:
 * - 195.2 m above the summit (Wikipedia "Telstra Tower"; Telstra).
 * - levels (Structurae, structurae.net/en/structures/telstra-tower):
 *   platforms 30.5 m and 42.7 m (the antenna platform's floor and roof; the
 *   three business floors lie between, Wikipedia), restaurant 54 m, indoor
 *   observation deck 58.5 m, open-air decks 62 m and 66.1 m, upper platforms
 *   74.6 m and 80.8 m, concrete shaft 132.3 m.
 * Photo-scaled:
 * - t5 (distant, from Lake Burley Griffin): the published levels land within
 *   a metre of where t5 puts the platform roof, the turret top, the two discs
 *   and the shaft top at a common 5.0 px/m, so the remaining levels are read
 *   there: turret soffit 50-55 m, turret wall 55-63.5 m, the roof drum to
 *   66.1 m, the mast's wide lattice to about 160 m and the rod above 190 m.
 * - widths, as ratios to the turret in t6 (near-level, south-west) with the
 *   turret 25 m across (t5: 26 m; t1: 23.6 m): antenna platform 33.5 m (OSM's
 *   circle: 34 m), lower shaft 10.8 m, neck under the turret 8.8 m, discs
 *   15 m, shaft at the discs 7 m, shaft top about 3.6 m, collar 6 m, mast
 *   lattice about 2.5 m at its foot (t5 reads it no wider than the shaft top; t6 about 3.5 m).
 * Estimated: the antenna platform's core (r 11) and its intermediate deck;
 *   the dish count and spacing (two rings of drums, from t6, t7, t8); the
 *   base building's height (about 6.5 m, t2) and the lobby drum and round
 *   canopy at the shaft's foot (t2, t8).
 * Left out: railings (detail model only), small panel antennas, the
 *   external lift/stair cage on the turret's north side.
 *
 * Terrain (Mapterhorn z12 only): the summit rises about 5 m across the
 *   base building's footprint to the north; the base walls run down to y = 0
 *   and sink into the hill there.
 *
 * Colours from daylight photos: the concrete reads warm pale beige
 *   (#d4c6b5 t2 upper shaft, #d6cfba t6) -> concrete 0xd8ccb8; the mast's red
 *   bands orange-red -> 0xc4502f; dishes white -> trim; windows dark.
 * Night (t9, from Aranda): the whole tower is floodlit warm, red aviation
 *   lights at the tip, mid-mast and the collar -> concrete and mast carry
 *   _FLOODLIGHT; turret windows are `window`; the beads are `neon-aviation-red`.
 *
 * LODs: the low model draws the mast as a solid banded prism and 24 dishes;
 *   the detail model (models/canberra-telstra-tower.detail.glb) builds the
 *   mast as a real lattice (four legs and cross bracing), every dish, deck
 *   railings and smoother lathes.
 *
 * Photos (Wikimedia Commons; all evidence):
 * - t1 "Telstra Tower Canberra Australia.jpg", Трансаэро, CC BY-SA 3.0
 * - t2 "Telstra Tower 2009.jpg", Bidgee, CC BY-SA 3.0 (from the car park, south)
 * - t3 "Black Mountain and Black Mountain Tower.jpg", Bidgee, CC BY-SA 3.0
 * - t5 "Black Mountain Tower 001.JPG", Dhx1, CC0 (distant, from the lake)
 * - t6 "Black Mountain Telecom Tower - 3 (3071709660).jpg", Pascal Vuylsteker, CC BY-SA 2.0
 * - t7 "Telstra Tower front.JPG", Redlands597198, public domain
 * - t8 "Telstra Tower in Canberra.jpg", Chondryma, CC BY-SA 4.0
 * - t9 "Telstra Tower, Canberra, from Aranda Nature Reserve at night.JPG", Thennicke, CC BY-SA 4.0
 * No look-only references.
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { lathe, tube, box, prism, face, saveLods, type Layer, type XY } from './sydney-tower-eye'

const O: XY = [0, 0]

// OSM way/653355549 (base building), in the frame, metres east/north of the anchor.
const BASE: XY[] = [[-28.5, 32.3], [8.2, 42.3], [23.5, -12.7], [-13.2, -22.8], [-22.9, 12.2]]
const BASE_TOP = 6.5

type Set = { con: Part; win: Part; white: Part; red: Part; neon: Part }
const mk = (): Set => ({ con: new Part(), win: new Part(), white: new Part(), red: new Part(), neon: new Part() })
const low = mk(), det = mk()

/** A drum dish antenna (radome) at angle t, radius r, height z, facing outward. */
function dish(p: Part, t: number, r: number, z: number, rad: number, n: number) {
  const c = Math.cos(t), s = Math.sin(t)
  tube(p, [[c * r, s * r, z], [c * (r + 1.1), s * (r + 1.1), z]], rad, n, true)
}

for (const [s, d] of [[low, false], [det, true]] as [Set, boolean][]) {
  const N = d ? 32 : 20

  // ---- Base building and lobby at the shaft's foot ------------------------------------------
  // The base: concrete walls with deep vertical fins; glazing set between them.
  prism(s.con, BASE, 0, BASE_TOP)
  {
    const ring = BASE
    for (let i = 0; i < ring.length; i++) {
      const a = ring[i], b = ring[(i + 1) % ring.length]
      const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
      // outward normal: on the right of a counter-clockwise ring
      const area = ring.reduce((acc, q, k) => { const w = ring[(k + 1) % ring.length]; return acc + q[0] * w[1] - w[0] * q[1] }, 0)
      const nrm: XY = area > 0 ? [u[1], -u[0]] : [-u[1], u[0]]
      const bays = Math.max(2, Math.round(L / 3.2))
      for (let k = 1; k < bays; k++) {
        const sx = (k / bays) * L
        const cx = a[0] + u[0] * sx + nrm[0] * 0.35, cy = a[1] + u[1] * sx + nrm[1] * 0.35
        box(s.con, [cx, cy], 0.22, 0.35, 0, BASE_TOP - 0.4, Math.atan2(u[1], u[0]))
      }
      // a glazing band on the wall between the fins, ground to 5 m
      const W = (sx: number, z: number): V3 => [a[0] + u[0] * sx + nrm[0] * 0.04, a[1] + u[1] * sx + nrm[1] * 0.04, z]
      face(s.win, [W(0.6, 0.5), W(L - 0.6, 0.5), W(L - 0.6, 4.2), W(0.6, 4.2)], [nrm[0], nrm[1], 0])
    }
  }
  // Glazed lobby drum and the round canopy over it, on the base's roof.
  lathe(s.win, O, [[9.6, BASE_TOP], [9.6, BASE_TOP + 3.2]], N)
  lathe(s.con, O, [[12.6, BASE_TOP + 3.2], [12.8, BASE_TOP + 3.6], [12.8, BASE_TOP + 4.4], [5.4, BASE_TOP + 4.6]], d ? 24 : 16, { crease: 30 })
  lathe(s.con, O, [[12.6, BASE_TOP + 3.2], [5.4, BASE_TOP + 3.2]].reverse() as [number, number][], d ? 24 : 16)

  // ---- Shaft and antenna platform ----------------------------------------------------------------
  lathe(s.con, O, [[5.4, 0], [5.4, 26]], d ? 24 : 16)
  // soffit dish
  lathe(s.con, O, [[5.4, 26], [10, 28], [14.2, 29.6], [16.7, 30.1], [16.7, 30.9], [11, 30.9]], N, { crease: 30 })
  // core building, three business floors with window bands
  for (const [z0, z1] of [[30.9, 36.2], [37.0, 42.0]]) {
    lathe(s.con, O, [[11, z0], [11, z0 + 1.2]], N)
    lathe(s.win, O, [[11, z0 + 1.2], [11, z1 - 0.9]], N)
    lathe(s.con, O, [[11, z1 - 0.9], [11, z1]], N)
  }
  // intermediate deck and the roof deck
  lathe(s.con, O, [[11, 36.2], [16.3, 36.2], [16.3, 37.0], [11, 37.0]], N, { crease: 30 })
  lathe(s.con, O, [[11, 42.0], [16.5, 42.0], [16.5, 42.9], [4.6, 43.2]], N, { crease: 30 })
  // deck edge posts holding the dishes, and the dishes in two rings plus a few hung under the floor
  const posts = d ? 24 : 12
  for (let i = 0; i < posts; i++) {
    const t = (i / posts) * Math.PI * 2 + Math.PI / posts
    box(s.white, [Math.cos(t) * 15.8, Math.sin(t) * 15.8], 0.16, 0.16, 30.9, 42.0, t)
  }
  const ring1 = d ? 18 : 10, ring2 = d ? 16 : 9, hung = d ? 10 : 5
  const dn = d ? 12 : 8
  for (let i = 0; i < ring1; i++) dish(s.white, (i / ring1) * Math.PI * 2 + 0.1, 15.6, 39.3, 1.8, dn)
  for (let i = 0; i < ring2; i++) dish(s.white, (i / ring2) * Math.PI * 2 + 0.33, 15.6, 33.4, 1.8, dn)
  for (let i = 0; i < hung; i++) dish(s.white, (i / hung) * Math.PI * 2 + 0.7, 16.0, 28.2, 1.6, dn)
  if (d) {
    // railings at the deck edges
    for (const z of [31.0, 37.1, 43.0]) {
      const r = z > 42 ? 16.3 : 16.2
      lathe(s.white, O, [[r - 0.06, z + 1.05], [r + 0.06, z + 1.05], [r + 0.06, z + 1.15], [r - 0.06, z + 1.15], [r - 0.06, z + 1.05]], 48)
    }
  }

  // ---- Neck and turret ------------------------------------------------------------------------------
  lathe(s.con, O, [[4.4, 43], [4.4, 49.5]], d ? 24 : 16)
  lathe(s.con, O, [[4.4, 49.5], [8.5, 51.6], [11.4, 53.6], [12.5, 55]], N, { crease: 40 })
  // wall: two window rows between concrete bands, with piers between the lights
  const rowsZ: [number, number][] = [[56.6, 58.5], [59.6, 61.6]]
  let z = 55
  for (const [a, b] of rowsZ) {
    lathe(s.con, O, [[12.5, z], [12.5, a]], N)
    lathe(s.win, O, [[12.38, a], [12.38, b]], N)
    z = b
  }
  lathe(s.con, O, [[12.5, z], [12.5, 63.5], [12.2, 63.9], [9.2, 63.9]], N, { crease: 30 })
  const piers = d ? 48 : 32
  for (const [a, b] of rowsZ)
    for (let i = 0; i < piers; i++) {
      const t = (i / piers) * Math.PI * 2
      box(s.con, [Math.cos(t) * 12.42, Math.sin(t) * 12.42], 0.12, 0.3, a, b, t + Math.PI / 2)
    }
  // roof drum with the open deck's glazing, its roof
  lathe(s.con, O, [[9.2, 63.9], [9.2, 64.3]], N)
  lathe(s.win, O, [[9.2, 64.3], [9.2, 65.6]], N)
  lathe(s.con, O, [[9.2, 65.6], [9.2, 66.1], [4.1, 66.5]], N, { crease: 30 })
  if (d) lathe(s.white, O, [[12.0, 65.0], [12.1, 65.0], [12.1, 65.1], [12.0, 65.1], [12.0, 65.0]], 48)

  // ---- Upper discs and the tapering shaft ---------------------------------------------------------
  const M = d ? 24 : 16
  lathe(s.con, O, [[4.0, 66.5], [4.0, 71.5]], M)
  lathe(s.con, O, [[4.0, 71.5], [7.5, 74.2], [7.5, 75.2], [4.5, 75.5]], M, { crease: 35 })
  lathe(s.con, O, [[4.5, 75.5], [4.5, 77.6]], M)
  lathe(s.con, O, [[4.5, 77.6], [7.5, 80.4], [7.5, 81.4], [3.6, 81.7]], M, { crease: 35 })
  lathe(s.con, O, [[3.6, 81.7], [3.0, 100], [2.35, 118], [1.8, 131]], d ? 20 : 12, { crease: 20 })
  // collar at the shaft's top
  lathe(s.con, O, [[1.8, 131], [3.0, 131.6], [3.0, 133], [1.7, 133.2]], d ? 20 : 12, { crease: 30, top: true })

  // ---- Mast: red and white bands, wide lattice to ~160 m, narrower above, rod to the tip --------
  const bands: [number, number, boolean][] = [] // z0, z1, red?
  const stops = [133.2, 140, 146.5, 153, 159.5, 166.5, 173, 179.5, 186, 190]
  for (let k = 0; k < stops.length - 1; k++) bands.push([stops[k], stops[k + 1], k % 2 === 0])
  const halfAt = (zz: number) => (zz < 159.5 ? 1.25 - ((zz - 133.2) / 26.3) * 0.2 : 0.8 - ((zz - 159.5) / 30.5) * 0.2)
  if (!d) {
    for (const [z0, z1, red] of bands) {
      const top = z1 === 159.5 ? halfAt(159.4) : halfAt(z1)
      const ring = (h: number, zz: number): V3[] => [[-h, -h, zz], [h, -h, zz], [h, h, zz], [-h, h, zz]]
      const p = red ? s.red : s.white
      const A = ring(halfAt(z0), z0), B = ring(top, z1)
      for (let i = 0; i < 4; i++) {
        const j = (i + 1) % 4
        const nx = (A[i][0] + A[j][0]) / 2, ny = (A[i][1] + A[j][1]) / 2
        face(p, [A[i], A[j], B[j], B[i]], [nx, ny, 0.1])
      }
      if (z1 === 159.5 || z1 === 190) face(p, B, [0, 0, 1])
    }
    lathe(s.white, O, [[0.22, 190], [0.12, 195.2]], 6)
  } else {
    // a real lattice: four corner legs, a horizontal frame at each band joint, X bracing on each face
    for (const [z0, z1, red] of bands) {
      const p = red ? s.red : s.white
      const h0 = halfAt(z0), h1 = z1 === 159.5 ? halfAt(159.4) : halfAt(z1)
      const C = (h: number, zz: number): V3[] => [[-h, -h, zz], [h, -h, zz], [h, h, zz], [-h, h, zz]]
      const A = C(h0, z0), B = C(h1, z1)
      for (let i = 0; i < 4; i++) tube(p, [A[i], B[i]], 0.16, 5)
      const steps = 3
      for (let k = 0; k <= steps; k++) {
        const t = k / steps, zz = z0 + (z1 - z0) * t, h = h0 + (h1 - h0) * t
        const R = C(h, zz)
        if (k < steps) {
          const t2 = (k + 1) / steps, z2 = z0 + (z1 - z0) * t2, hh = h0 + (h1 - h0) * t2
          const R2 = C(hh, z2)
          for (let i = 0; i < 4; i++) {
            const j = (i + 1) % 4
            tube(p, [R[i], R2[j]], 0.08, 4)
            tube(p, [R[j], R2[i]], 0.08, 4)
          }
        }
        for (let i = 0; i < 4; i++) tube(p, [R[i], R[(i + 1) % 4]], 0.09, 4)
      }
    }
    // small platforms at the joints between the wide and the narrow lattice, and at the top
    for (const [zz, h] of [[159.5, 1.3], [190, 0.75]] as [number, number][]) box(s.white, O, h, h, zz - 0.15, zz + 0.15, 0, { bottom: true })
    lathe(s.white, O, [[0.22, 190], [0.12, 195.2]], 8)
  }
  // aviation lights
  for (const zz of [195.4, 160.2, 133.6]) {
    if (zz === 195.4) lathe(s.neon, O, [[0.01, zz - 0.9], [0.7, zz - 0.8], [0.7, zz + 0.1], [0.01, zz + 0.2]], 8)
    else for (let i = 0; i < 4; i++) {
      const t = (i / 4) * Math.PI * 2 + Math.PI / 4, rr = zz > 150 ? 1.2 : 2.9
      box(s.neon, [Math.cos(t) * rr, Math.sin(t) * rr], 0.5, 0.5, zz - 0.5, zz + 0.5, t, { bottom: true })
    }
  }
}

// ---- Materials and output ----------------------------------------------------------------------------

// The whole tower is floodlit warm at night; up-facing faces barely, the base building not.
const towerLit = (p: V3, n: V3) => (Math.hypot(p[0], p[1]) > 13.5 && p[2] < BASE_TOP + 1 ? 0 : n[2] > 0.8 ? 0.25 : 0.8)
const CONCRETE: MaterialSpec = { ...finish('concrete', 0xd8ccb8), floodlight: towerLit }
const WHITE: MaterialSpec = { ...PALETTE.trim, floodlight: (p) => (p[2] > 130 ? 0.6 : 0.3) }
const RED: MaterialSpec = { ...finish('mast-red', 0xc4502f), floodlight: () => 0.6 }
const NEON: MaterialSpec = finish('neon-aviation-red', 0xe0302a, 0.5)
const layers = (s: Set): Layer[] => [
  { part: s.con, material: CONCRETE },
  { part: s.win, material: PALETTE.window },
  { part: s.white, material: WHITE },
  { part: s.red, material: RED },
  { part: s.neon, material: NEON },
]

if (import.meta.main) {
  await saveLods('canberra-telstra-tower', 'Telstra Tower', layers(low), layers(det), {
    frame: 'Y up, -Z north, +X east, metres; origin on the shaft axis at the summit',
    bearing: 0, height: 195.2,
  }, 6500)
}
