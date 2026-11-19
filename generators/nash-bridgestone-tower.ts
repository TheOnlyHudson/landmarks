/**
 * Bridgestone Tower (Bridgestone Americas headquarters; 200 4th Avenue
 * South), Nashville (2017, Gresham Smith) — original procedural geometry,
 * CC0-1.0.
 * bun generators/nash-bridgestone-tower.ts [out.glb]
 * (Uses the small kit exported by generators/nash-pinnacle.ts.)
 *
 * Map frame: x, y in plan, z up, metres; origin at the anchor on the lowest
 * ground under the footprint. Anchor = area centroid of OSM way/592008296
 * (36.1587817, -86.7753041). Bearing 62°: +y faces 62° (the north slab's
 * face, toward 3rd Ave); -y faces 242° (the Country Music Hall of Fame
 * side, with the sign and the sky terrace); the long axis runs along x
 * (+x = 152°, toward the south-south-east end).
 *
 * What makes it recognisable, each drawn as plain geometry:
 * - three tall, parallel glass slabs side by side, each ~12-16 m deep,
 *   shifted along their length against each other, so both narrow ends
 *   read as stepped layers;
 * - the glass faces of the slabs run on ~10 m past the roof as open glass
 *   screens (the outer faces and both joints between slabs), so the top
 *   reads as four thin blades; seen from the ends they make the "split"
 *   crown with the white plant box between;
 * - lower glass fins (111.6 m) at the ends of the outer slabs;
 * - the two-storey sky-terrace notch with three white columns low on the
 *   Hall of Fame face, and the BRIDGESTONE sign at that face's top corner;
 * - blue-grey reflective glass with bright pale vertical mullions.
 *
 * Evidence
 * - OSM: outline way/592008296 (building, height 140, 30 levels, wikidata
 *   Q42529751). No building:parts. Read in this frame the outline steps at
 *   both ends exactly where the lidar shows the three slabs.
 * - Lidar: USGS 3DEP TN_DavidsonCo_1_2022 (2022 flight), 0.5 m grid, read in
 *   this frame. Ground under the footprint 1.9-2.4 m above the box's
 *   ground_min (flat; Mapterhorn varies < 1 m). Measured above the lowest
 *   ground: roof 124.5 m on all three slabs; glass screens 133.5-134.6 m in
 *   lines at y = -20, -6, 4.5 and 18.5 (the slab faces and joints); end
 *   fins 111.6 m (west end of the north slab, both ends of the south slab,
 *   east end of the north slab); plant boxes 132 m (x -21..12) and 128 m
 *   (x 12..24). The lidar sits ~1.5 m south of OSM on the north face; the
 *   OSM outline is used for the plan.
 * - Published: 30 storeys, completed 2017 (Wikipedia "Bridgestone Tower").
 *   OSM's 140 m is not borne out by the lidar (134.6 m to the screen tops);
 *   the lidar is used.
 * - Photos (Wikimedia Commons), all EVIDENCE:
 *   Bridgestone Americas HQ 1.jpg, Louis Chader, CC BY-SA 4.0 (the Hall of
 *     Fame face from the south-west: the layered west end, the sky terrace,
 *     the sign, the screens above the roof);
 *   Bridgestone Americas HQ.jpg, Lchader, CC BY-SA 4.0 (the same side, far);
 *   Bridgestone Americas Tower.jpg and ... b.jpg, Wobbanight, CC0 (the
 *     north-west end from Commerce St: three slabs, the screen blades and
 *     the white plant box between them).
 *   No look-only sources were used. No commercial imagery.
 * - Colours from those photos, pulled to the palette: blue-grey glass,
 *   pale grey-white mullions, white plant box and terrace columns.
 * - Night: the office floors glow (window); the screens above the roof are
 *   open glass and stay dark (glass); the sign is a plain pale box.
 *
 * Estimated: the sky terrace's height (28-39 m, 6 m deep) and extent (photo-scaled,
 *   from Chader's photo); the mullion spacing (drawn every ~6 m, much
 *   sparser than real); the sign's size.
 * Doubts: the east (+x) end and the 62° face have no close photo; they are
 *   drawn from lidar and OSM only, with no terrace.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, at, ccw, rect, prism, bevel, walls, cap, outN, save, type Layer } from './nash-pinnacle'

const ROOF = 124.5, SCREEN = 134.5, FIN = 111.6
const STOREY = 4.1, BASE = 1.0

// The slabs: [x0, x1, y0, y1, west fin width, east fin width]
const SLABS: [number, number, number, number, number, number][] = [
  [-29.5, 37.5, -20.5, -6.5, 2.5, 2.5],  // south (Hall of Fame face)
  [-35.0, 35.0, -6.5, 4.0, 0, 0],        // middle
  [-38.5, 31.0, 4.0, 20.5, 3.0, 2.0],    // north
]

/** A vertical box between plan corners, all sides and top. */
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, top: Part | null = p) {
  prism(p, rect(x0, y0, x1, y1), z0, z1, top)
}

/** A thin vertical bar standing `out` proud of the wall a→b at t along it, w wide, z0..z1. */
function bar(p: Part, a: XY, b: XY, t: number, w: number, out: number, z0: number, z1: number) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = outN(a, b)
  const c = (s: number, o: number): XY => [a[0] + u[0] * s + n[0] * o, a[1] + u[1] * s + n[1] * o]
  const p0 = c(t - w / 2, 0), p1 = c(t - w / 2, out), p2 = c(t + w / 2, out), p3 = c(t + w / 2, 0)
  p.quad(at(p0, z0), at(p1, z0), at(p1, z1), at(p0, z1))
  p.quad(at(p1, z0), at(p2, z0), at(p2, z1), at(p1, z1))
  p.quad(at(p2, z0), at(p3, z0), at(p3, z1), at(p2, z1))
  p.quad(at(p0, z1), at(p1, z1), at(p2, z1), at(p3, z1))
}

function build(): Layer[] {
  const win = new Part()     // the curtain wall (glows at night)
  const trim = new Part()    // pale mullions, floor lines, plant box, columns, sign
  const screen = new Part()  // open glass screens above the roof (dark at night)
  const roof = new Part()
  const deep = new Part()    // the terrace's recessed glazing (darker; glows at night)

  // a slab piece: glass walls, a roof, floor lines every three storeys, mullions on its walls
  const piece = (x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, bottom = false, wm = win) => {
    const r = ccw(bevel(rect(x0, y0, x1, y1), 0.4))
    walls(wm, r, z0, z1); cap(roof, r, z1)
    if (bottom) cap(roof, r, z0, false)
    for (let z = BASE + 3 * STOREY; z < z1 - 2; z += 3 * STOREY) if (z > z0 + 1) lipRing(r, z)
    const c = rect(x0, y0, x1, y1)
    for (let i = 0; i < 4; i++) {
      const a = c[i], b = c[(i + 1) % 4], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      const n = Math.max(1, Math.round(L / 6.2))
      for (let k = 1; k < n; k++) bar(trim, a, b, (k * L) / n, 0.35, 0.12, z0, z1)
    }
  }
  const lipRing = (r: XY[], z: number) => {
    // a floor line 0.5 m tall standing 0.1 m proud
    const n = r.length
    for (let i = 0; i < n; i++) {
      const a = r[i], b = r[(i + 1) % n], o = outN(a, b)
      const a1: XY = [a[0] + o[0] * 0.1, a[1] + o[1] * 0.1], b1: XY = [b[0] + o[0] * 0.1, b[1] + o[1] * 0.1]
      trim.quad(at(a1, z), at(b1, z), at(b1, z + 0.5), at(a1, z + 0.5))
      trim.quad(at(a, z + 0.5), at(a1, z + 0.5), at(b1, z + 0.5), at(b, z + 0.5))
    }
  }

  // --- the three slabs, with their lower end fins ---
  const T0 = 28, T1 = 39, TX = 1, TD = 6   // the sky terrace on the south face
  SLABS.forEach(([x0, x1, y0, y1, fw, fe], i) => {
    const c0 = x0 + fw, c1 = x1 - fe
    if (i === 0) {
      // south slab: the terrace notch, x0..TX, recessed TD deep
      piece(x0, c1, y0, y1, 0, T0)
      piece(x0, TX, y0 + TD, y1, T0, T1, false, deep)
      piece(TX, c1, y0, y1, T0, T1)
      piece(c0, c1, y0, y1, T1, ROOF, true)
      piece(x0, c0, y0, y1, T1, FIN, true)
      piece(c1, x1, y0, y1, 0, FIN)
      for (const x of [-15.5, -8.5, -1.5]) {
        const r = ccw(bevel(rect(x - 0.6, y0 + 0.6, x + 0.6, y0 + 1.8), 0.3))
        walls(trim, r, T0, T1)
      }
    } else {
      piece(c0, c1, y0, y1, 0, ROOF)
      if (fw > 0) piece(x0, c0, y0, y1, 0, FIN)
      if (fe > 0) piece(c1, x1, y0, y1, 0, FIN)
    }
  })

  // --- the glass screens above the roof: the outer faces and the two joints ---
  const scr = (x0: number, x1: number, y0: number, y1: number) => box(screen, x0, x1, y0, y1, ROOF, SCREEN)
  scr(-27.0, 35.0, -20.5, -20.1)
  scr(-27.0, 35.0, -6.7, -6.3)
  scr(-35.0, 29.0, 3.8, 4.2)
  scr(-35.5, 29.0, 20.1, 20.5)

  // --- the white plant boxes between the screens ---
  box(trim, -21, 12, -10, 2, ROOF, 132.0)
  box(trim, -21, 12, 2, 8, ROOF, 131.0)
  box(trim, 12, 24, -6, 3.5, ROOF, 128.0)

  // --- the BRIDGESTONE sign: a pale panel high on the south face's west end ---
  box(trim, -26.5, -9.5, -20.9, -20.5, 115.5, 122.5)

  return [
    { part: win, material: { ...PALETTE.window, color: 0x7f97b0 } },
    { part: trim, material: finish('bridgestone-mullion', 0xe4e8ea) },
    { part: screen, material: { ...PALETTE.glass, color: 0x9cb3c9 } },
    { part: roof, material: PALETTE.roof },
    { part: deep, material: { ...PALETTE.window, name: 'window-2', color: 0x4f6072 } },
  ]
}

if (import.meta.main) {
  await save('nash-bridgestone-tower', 'Bridgestone Tower', build(), {
    bearing: 62, height: SCREEN, replaces: ['way/592008296'],
  })
}
