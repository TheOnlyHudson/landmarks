/**
 * Lenovo Center (opened 1999 as the Raleigh Entertainment and Sports Arena,
 * later RBC Center and PNC Arena; Odell Associates): procedural, CC0-1.0.
 * bun generators/ral-lenovo-center.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 142.5, the
 * drum's long axis; +y is the south-east end with the curved glass entrance
 * pavilion, −y the north-west end with two entrance blocks, ±x the side
 * blocks (−x faces north-east, +x south-west).
 * Origin: the drum's centre (-78.721897, 35.803346), from a fit to OSM.
 *
 * Plan (measured, OSM way/47732090 "Lenovo Center", building=stadium, no
 * height): the drum is a superellipse |x/66|^2.3 + |y/86|^2.3 = 1, which
 * the outline's drum vertices fit to about 1.5 m; the entrance pavilions
 * are the outline's own vertices outside it.
 * Ground (Mapterhorn z13, `terrain.ts check`): the plaza round most of the
 * arena stands about G = 10.5 m above the lowest ground under the
 * footprint, which falls away north-westward to the service level at the
 * −y end (about 6.5 m at y = −75, 0–4 m at y = −105). Facade detail starts
 * at `ground(y)`.
 * Elevation 0.
 * Heights (no lidar in Wake County; none published): photo-scaled from l02
 *   against its 2.4 m doors: storefront glass to 4.2 m, canopy at 4.4 m,
 *   the curtain-wall band 5.3–11.7 m, the pavilions' parapet 16.5 m over
 *   the plaza; the drum's fascia 18.5 m over the plaza, a little over the
 *   pavilions (l02, l03 show them nearly level; NAIP's drum shadow about
 *   12 m long fits a ~57° sun); the event floor is about the service
 *   level's height below the plaza, so the drum stands ~29 m over y = 0;
 *   the roof a very flat dome rising about 3.5 m (l03), estimated.
 *
 * Photos (evidence):
 *  l02 "PNC Arena Raleigh.JPG", Alexisrael, CC BY-SA 3.0 (the curved glass entrance)
 *      https://commons.wikimedia.org/wiki/File:PNC_Arena_Raleigh.JPG
 *  l03 "PNCArena-RaleighNC.jpg", Edward T. Funkhouser, CC BY-SA 3.0 (from above)
 *      https://commons.wikimedia.org/wiki/File:PNCArena-RaleighNC.jpg
 *  l13 "Lenovo Center Side.jpg", CavsFan45, CC BY-SA 4.0 (2025)
 *      https://commons.wikimedia.org/wiki/File:Lenovo_Center_Side.jpg
 *  l17 "Lenovo Center Exterior View 2025 Distant.jpg", CavsFan45, CC BY-SA 4.0
 *      https://commons.wikimedia.org/wiki/File:Lenovo_Center_Exterior_View_2025_Distant.jpg
 * Aerial: USGS NAIP (public domain): plan, the white roof, shadows.
 *
 * Colours: pale precast panels; teal-green glass, pulled light; white
 * roof; grey metal fascia band at the drum's top and the canopies; the 2025
 * red Lenovo sign boxes (l13, l17).
 * Left out: flags and flagpoles, the cable bracing on the curtain wall, the
 * lettering ("Lenovo Center"; signs are plain red boxes), rooftop units.
 * Doubts: which pavilions carry the big curtain wall: l02 shows the curved
 * south-east one; l13 shows a glazed pavilion and a plain panel block either
 * side of the drum, taken here as the north-west pair (glazed) and the side
 * blocks (plain). The renovation under way since 2024 may change the
 * entrances. All heights are photo-scaled. The north-west service level is
 * from the coarse z13 terrain only.
 * Night: the glass glows; the red signs are neon.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { type XY, type Face, ccw, capRing, wallEdge, outward, finishGlb, writeModel, flatShape } from './sea-tacoma-union-station'
import { quadO, panel } from './nash-tennessee-state-capitol'

const OUTLINE: XY[] = [[-63.2, -32.9], [-64.2, -21.2], [-78.7, -21.5], [-78.6, 19.7], [-64.7, 20.3], [-62.0, 39.1], [-56.1, 52.4], [-51.7, 59.5], [-38.9, 72.2], [-32.5, 74.6], [-37.7, 85.9], [-32.6, 88.2], [-17.8, 93.9], [-3.2, 95.6], [8.7, 94.8], [20.1, 92.7], [32.8, 87.9], [37.2, 85.6], [32.1, 76.6], [40.1, 71.2], [48.1, 63.7], [52.5, 58.2], [60.5, 43.2], [63.7, 32.2], [64.8, 20.2], [74.8, 21.2], [75.3, -21.3], [65.0, -21.1], [62.8, -37.0], [57.9, -50.4], [53.8, -57.4], [42.5, -69.7], [57.0, -86.9], [46.8, -94.5], [34.9, -100.6], [21.3, -105.4], [14.9, -84.0], [1.5, -85.8], [-9.8, -84.7], [-17.1, -106.5], [-33.8, -101.2], [-45.3, -95.2], [-55.7, -87.5], [-43.2, -68.6], [-49.6, -62.5], [-57.5, -50.4]]

const DA = 66, DB = 86, DN = 2.3 // the drum superellipse
const G = 10.5 // the plaza over y = 0
const PAV = G + 16.5, DRUM = G + 18.5, DOME = 3.5
const ground = (y: number) => (y >= -30 ? G : y >= -74.5 ? G - ((-30 - y) / 44.5) * 4 : Math.max(1, 6.5 - ((-74.5 - y) / 30) * 5.5))

/** The drum's outline, scaled by k, counter-clockwise. */
function drumRing(k: number, n = 72): XY[] {
  const out: XY[] = []
  for (let i = 0; i < n; i++) {
    const t = (2 * Math.PI * i) / n, c = Math.cos(t), s = Math.sin(t)
    out.push([k * DA * Math.sign(c) * Math.abs(c) ** (2 / DN), k * DB * Math.sign(s) * Math.abs(s) ** (2 / DN)])
  }
  return out
}
/** > 1 outside the drum. */
const drumQ = (x: number, y: number) => (Math.abs(x / DA) ** DN + Math.abs(y / DB) ** DN) ** (1 / DN)
function inside(r: XY[], x: number, y: number) {
  let c = false
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    const [xi, yi] = r[i], [xj, yj] = r[j]
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c
  }
  return c
}

function build() {
  const wall = new Part(), glass = new Part(), roof = new Part(), metal = new Part(), neon = new Part()

  // ------------------------------------------------------------ the drum
  const D = drumRing(1.004)
  for (let i = 0; i < D.length; i++) {
    const a = D[i], b = D[(i + 1) % D.length], m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
    const n = outward(a, b)
    const under = inside(OUTLINE, m[0] + n[0] * 1.5, m[1] + n[1] * 1.5) // a pavilion stands against it
    // walls in two lifts so the low part follows the ground
    wallEdge(wall, D, i, 0, DRUM - 2.6)
    // the metal fascia band at the top, a little proud
    const P = (p: XY, d: number, z: number): V3 => [p[0] + n[0] * d, p[1] + n[1] * d, z]
    quadO(metal, P(a, 0.2, DRUM - 2.6), P(b, 0.2, DRUM - 2.6), P(b, 0.2, DRUM + 0.4), P(a, 0.2, DRUM + 0.4), [n[0], n[1], 0])
    quadO(metal, P(a, 0, DRUM - 2.6), P(b, 0, DRUM - 2.6), P(b, 0.2, DRUM - 2.6), P(a, 0.2, DRUM - 2.6), [0, 0, -1])
    if (!under) {
      // storefront glass round the drum's foot, at the plaza (l13, l03)
      const g = ground(m[1])
      quadO(glass, P(a, 0.06, g + 0.2), P(b, 0.06, g + 0.2), P(b, 0.06, g + 4.6), P(a, 0.06, g + 4.6), [n[0], n[1], 0])
    }
  }
  // the roof: a flat rim 7 m wide inside the fascia, then a very flat dome
  {
    const rings: { r: XY[]; z: number }[] = [{ r: drumRing(1.007), z: DRUM + 0.4 }, { r: drumRing(0.995), z: DRUM + 0.4 }, { r: drumRing(0.995), z: DRUM }]
    for (const k of [0.92, 0.8, 0.64, 0.44, 0.22]) rings.push({ r: drumRing(k), z: DRUM + DOME * (1 - (k / 0.92) ** 2) })
    for (let j = 0; j + 1 < rings.length; j++) {
      const A = rings[j], B = rings[j + 1]
      for (let i = 0; i < A.r.length; i++) {
        const l = (i + 1) % A.r.length
        const a: V3 = [A.r[i][0], A.r[i][1], A.z], b: V3 = [A.r[l][0], A.r[l][1], A.z], c: V3 = [B.r[l][0], B.r[l][1], B.z], d: V3 = [B.r[i][0], B.r[i][1], B.z]
        const part = j < 2 ? metal : roof
        if (j === 1) quadO(part, a, b, c, d, [-A.r[i][0], -A.r[i][1], 0]) // the inner face of the fascia's lip
        else quadO(part, a, b, c, d, [0, 0, 1])
      }
    }
    capRing(roof, rings[rings.length - 1].r.map((p) => p), DRUM + DOME * (1 - (0.22 / 0.92) ** 2))
  }

  // ------------------------------------------------------------ the pavilions
  const R = ccw(OUTLINE)
  capRing(roof, R, PAV)
  for (let i = 0; i < R.length; i++) {
    const a = R[i], b = R[(i + 1) % R.length]
    const m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
    if (drumQ(m[0], m[1]) < 1.01) continue // on the drum: hidden
    const n = outward(a, b), L = Math.hypot(b[0] - a[0], b[1] - a[1])
    wallEdge(wall, R, i, 0, PAV, 20)
    const f: Face = { o: [a[0], a[1], 0], n }
    const g = ground(m[1])
    const side = Math.abs(m[0]) > 64 && Math.abs(m[1]) < 23 // the plain side blocks
    // parapet coping
    panel(metal, f, L / 2, L, PAV - 0.7, PAV, 0.1)
    if (L < 2.5) continue
    // storefront glass under the canopy
    panel(glass, f, L / 2, L - 1.0, g + 0.2, g + 4.2, 0.06)
    if (!side) {
      // the curtain wall: one broad band, two storeys, with a pale transom line
      panel(glass, f, L / 2, L - 0.6, G + 5.3, G + 11.7, 0.06)
      panel(wall, f, L / 2, L - 0.6, G + 8.4, G + 8.7, 0.1)
    } else {
      // the side blocks: plain panels with a tall window pair (l13)
      for (const s of [L * 0.3, L * 0.7]) panel(glass, f, s, 3.2, G + 6, G + 12.5, 0.06)
    }
    // the canopy: a thin slab 2.6 m out
    const P = (s: number, d: number, z: number): V3 => [a[0] + ((b[0] - a[0]) / L) * s + n[0] * d, a[1] + ((b[1] - a[1]) / L) * s + n[1] * d, z]
    const z0 = g + 4.4, z1 = g + 4.9, d = 2.6
    quadO(metal, P(0, 0, z1), P(L, 0, z1), P(L, d, z1), P(0, d, z1), [0, 0, 1])
    quadO(metal, P(0, 0, z0), P(L, 0, z0), P(L, d, z0), P(0, d, z0), [0, 0, -1])
    quadO(metal, P(0, d, z0), P(L, d, z0), P(L, d, z1), P(0, d, z1), [n[0], n[1], 0])
  }

  // ------------------------------------------------------------ the red signs
  // over the curved south-east entrance (l02's sign position), and a box on
  // the north-west pavilions' parapet (l13)
  {
    const f: Face = { o: [2.75, 95.2, 0], n: [0.067, 0.998] }
    flatShape(neon, f, [[-6.5, PAV - 4.6], [6.5, PAV - 4.6], [6.5, PAV - 1.6], [-6.5, PAV - 1.6]], 0.25)
  }
  for (const sx of [-1, 1]) {
    // a vertical sign on the drum between the side block and the north-west pavilion
    const t = sx > 0 ? -0.62 : Math.PI + 0.62
    const c = Math.cos(t), s = Math.sin(t)
    const x = 1.004 * DA * Math.sign(c) * Math.abs(c) ** (2 / DN), y = 1.004 * DB * Math.sign(s) * Math.abs(s) ** (2 / DN)
    const gx = Math.sign(x) * Math.abs(x / DA) ** (DN - 1) / DA, gy = Math.sign(y) * Math.abs(y / DB) ** (DN - 1) / DB
    const l = Math.hypot(gx, gy) // normal from the gradient
    const f: Face = { o: [x, y, 0], n: [gx / l, gy / l] }
    flatShape(neon, f, [[-1.6, G + 9], [1.6, G + 9], [1.6, G + 18], [-1.6, G + 18]], 0.25)
  }

  return finishGlb('Lenovo Center', [
    { part: wall, material: finish('lenovo-panel', 0xe9e5dd) },
    { part: glass, material: windowVariant(2, 0x8cbfb6) },
    { part: roof, material: finish('lenovo-roof', 0xdcdfe0) },
    { part: metal, material: PALETTE.roof },
    { part: neon, material: finish('neon-lenovo-red', 0xd23a3c) },
  ], { bearing: 142.5, height: DRUM + DOME, replaces: ['way/47732090'] }, 5000)
}

if (import.meta.main) await writeModel('ral-lenovo-center', build())
