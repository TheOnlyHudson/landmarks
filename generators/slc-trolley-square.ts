/**
 * Trolley Square, 602 East 500 South, Salt Lake City: the 1908 Utah Light &
 * Railway car barns (Mission Revival, red brick), a shopping centre since
 * 1972, and its 1908 steel water tower. Procedural, CC0-1.0.
 * bun generators/slc-trolley-square.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (the barns follow the
 * city grid, OSM edges at 0.2 degrees). Origin: the area centroid of the main
 * barn, OSM way/41527646 (-111.8724681, 40.7568955). y = 0 is the lowest
 * ground under the footprint, the main barn's south-west corner on 600
 * South; the ground rises to the north and east (Mapterhorn, lidar): about
 * +2.7 m at the south-east corner, +3.0 at the north-west, +4.2 at the
 * north-east, +3.0 to +3.9 under the north barn and +4.4 at the tower.
 * Openings follow that ground (`G`); the walls all run down to y = 0.
 *
 * Modelled: the main barn (way/41527646, x -64.0..67.9, y -45.3..46.6, plus
 * its full-height strip west to x -75.2 south of y -20.7), the north barn
 * across the lane (way/41527684, x -72.7..-3.9, y 49.6..92.2) and the water
 * tower (OSM node/1615675467, at x 76.9, y 66.8, beside 700 East).
 *
 * Roofs: lidar (USGS_LPC_UT_Wasatch_L4_2013_LAS_2016, flown 2013) shows
 * the main barn as five east-west gabled bays of ~18.4 m (ridges at the
 * lidar's y 46, 28.5, 11.5, -5.5, -24.5), measured eaves and valleys 10.1-
 * 10.6 m and ridges 12.9-14.2 m above y = 0 (rising a little to the east
 * with the ground): drawn eaves 10.2, ridges 13.6. The north barn: three
 * bays of ~14.2 m, eaves 10.0, ridges 12.6 (measured). NAIP shows pale
 * roofs with skylight strips along each slope.
 * Mission gable parapets, round-arched windows, cream cornice lines and the
 * red brick come from p2 (the north barn's north and east fronts); the main
 * barn's fronts are drawn the same way (no licensed photo of them was found:
 * a doubt). Parapet shape and the arched windows are estimated from p2.
 *
 * Water tower: 97 ft (29.6 m) overall (published: Wikipedia, "Trolley
 * Square"). Proportions from p3 (the tank ~6.5 m across, estimated from
 * the 50,000 US gal capacity): legs to 14 m above its ground, the gallery
 * and the white tank with its rounded bottom, the grey conical roof, the
 * openwork dome cage and the tall finial. The tank's "TROLLEY SQUARE"
 * letters are drawn as plain lit plaques (STYLE: signs that are not the
 * landmark stay plain); which sides carry them is not shown by the photos
 * (drawn facing west and east, a doubt). At night the tower is lit with
 * coloured LED strips (formerly neon, the weather beacon): the plaques are
 * `neon`.
 *
 * Photos (EVIDENCE):
 *  p1 https://commons.wikimedia.org/wiki/File:Salt_Lake_City_(UT,_USA),_Trolley_Square_--_2022_--_190112.jpg
 *     Dietmar Rabich, CC BY-SA 4.0 (the entrance sign arch; not modelled)
 *  p2 https://commons.wikimedia.org/wiki/File:Salt_Lake_City,_Utah_(2021)_-_176.jpg
 *     Another Believer, CC BY-SA 4.0 (from 500 South looking south down the
 *     lane: the north barn's gables and arched windows on the right)
 *  p3 https://commons.wikimedia.org/wiki/File:Trolley_Square_water_tower,_Aug_17.jpg
 *     An Errant Knight, CC BY-SA 4.0 (the water tower, direction unsure)
 * Aerial: USGS NAIP (public domain). Lidar: as above.
 * Left out: the arched entrance sign over the lane, the sky bridge over 600
 * South, awnings, the tower's spiral stair (drawn as a solid core), its
 * cross-bracing and railing detail.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { poly, prism, box, rect, type XY, type Face } from './slc-beehive-house'
import { wallShape, lathe } from './slc-saltair'

const brick = new Part(), roof = new Part(), trim = new Part(), win = new Part(), steel = new Part(), neon = new Part()

/** Ground above y = 0 at a point, bilinear over the site (Mapterhorn/lidar). */
function G(x: number, y: number) {
  const u = Math.min(1, Math.max(0, (x + 75) / 143)), v = Math.min(1, Math.max(0, (y + 45) / 92))
  const s = 0 + 2.7 * u, n = 3.0 + 1.2 * u
  return Math.min(4.2, s + (n - s) * v)
}

/** A round-headed window panel (a true semicircle on its jambs). */
function arched(face: Face, plane: number, u: number, w: number, z0: number, z1: number, part = win, off = 0.06) {
  const r = w / 2, zs = z1 - r, pts: [number, number][] = [[u - r, z0], [u + r, z0]]
  for (let k = 0; k <= 6; k++) { const a = (k / 6) * Math.PI; pts.push([u + r * Math.cos(a), zs + r * Math.sin(a)]) }
  wallShape(part, face, plane, pts, off)
}

/**
 * A Mission gable end wall, across one bay (u0..u1 along the wall, at
 * `plane`), from y = 0 to the eave ze and up to a curved parapet whose flat
 * top stands `lift` over the ridge zr. Extruded `t` inward.
 */
function missionGable(face: "E" | "W", plane: number, u0: number, u1: number, ze: number, zr: number, lift = 2.3, t = 0.45) {
  const W = u1 - u0, top = zr + lift
  // half profile, edge to centre: a short pier, an ogee sweep, a flat crest
  const half: [number, number][] = [[0, ze + 0.6], [0.06 * W, ze + 0.6], [0.06 * W, ze + 1.5]]
  for (let k = 1; k <= 3; k++) {
    const s = k / 3, e = s * s * (3 - 2 * s)
    half.push([0.06 * W + s * 0.22 * W, ze + 1.5 + e * (top - 0.6 - ze - 1.5)])
  }
  half.push([0.28 * W, top - 0.6], [0.3 * W, top], [0.5 * W, top])
  const prof: [number, number][] = [...half, ...half.slice(0, -1).reverse().map(([a, z]) => [W - a, z] as [number, number])]
  const dir = face === 'E' ? -1 : 1 // inward
  const at = (a: number, z: number, d: number): V3 => [plane + dir * d, u0 + a, z]
  const nOut: V3 = [face === 'E' ? 1 : -1, 0, 0]
  // outer and inner faces in vertical strips (the profile is single-valued)
  for (let i = 0; i < prof.length - 1; i++) {
    const [a0, z0] = prof[i], [a1, z1] = prof[i + 1]
    if (Math.abs(a1 - a0) < 1e-6) continue
    poly(brick, [at(a0, 0, 0), at(a1, 0, 0), at(a1, z1, 0), at(a0, z0, 0)], nOut)
    poly(brick, [at(a0, 0, t), at(a1, 0, t), at(a1, z1, t), at(a0, z0, t)], [-nOut[0], 0, 0])
  }
  // the coping along the top edge (cream), and its outer-edge faces
  for (let i = 0; i < prof.length - 1; i++) {
    const [a0, z0] = prof[i], [a1, z1] = prof[i + 1]
    const n: V3 = [0, -(z1 - z0), a1 - a0]
    poly(trim, [at(a0, z0, -0.08), at(a1, z1, -0.08), at(a1, z1, t + 0.05), at(a0, z0, t + 0.05)], n)
  }
  for (const a of [0, W]) poly(brick, [at(a, 0, 0), at(a, 0, t), at(a, ze + 0.6, t), at(a, ze + 0.6, 0)], [0, a === 0 ? -1 : 1, 0])
  return { W, top }
}

/** A run of east-west gabled bays between x0 and x1, bays stacked in y. */
function barn(x0: number, x1: number, ys: number[], ze: number, zr: number, longWalls: { south: boolean; north: boolean }) {
  const n = ys.length - 1
  for (let b = 0; b < n; b++) {
    const y0 = ys[b], y1 = ys[b + 1], yc = (y0 + y1) / 2
    // the roof: two slopes, inside the parapets
    for (const [ya, s] of [[y0, -1], [y1, 1]] as [number, number][]) {
      const q: V3[] = [[x0 + 0.3, ya, ze], [x1 - 0.3, ya, ze], [x1 - 0.3, yc, zr], [x0 + 0.3, yc, zr]]
      poly(roof, q, [0, s, 1])
    }
    // gable ends with the Mission parapet; a big arched window and an oculus
    for (const [face, plane] of [['E', x1], ['W', x0]] as ['E' | 'W', number][]) {
      missionGable(face, plane, y0, y1, ze, zr)
      const g = G(plane, yc)
      const wide = Math.min(5.2, (y1 - y0) * 0.32)
      arched(face, plane, yc, wide, g + 1.0, ze - 0.6)
      for (const s of [-1, 1]) arched(face, plane, yc + s * (y1 - y0) * 0.33, 1.8, g + 1.0, g + 4.8)
      const oz = (ze + zr) / 2 + 0.6, r = 0.85, pts: [number, number][] = []
      for (let k = 0; k < 12; k++) { const a = (k / 12) * 2 * Math.PI; pts.push([yc + r * Math.cos(a), oz + r * Math.sin(a)]) }
      wallShape(win, face, plane, pts, 0.06)
    }
  }
  // long walls to the eave with a cream cornice and sill band
  const yS = ys[0], yN = ys[n]
  for (const [y, face, on] of [[yS, 'S', longWalls.south], [yN, 'N', longWalls.north]] as [number, Face, boolean][]) {
    const k = Math.ceil((x1 - x0) / 5)
    for (let i = 0; i < k; i++) {
      const a = x0 + ((x1 - x0) * i) / k, b = x0 + ((x1 - x0) * (i + 1)) / k
      if (face === 'S') poly(brick, [[a, y, 0], [b, y, 0], [b, y, ze], [a, y, ze]], [0, -1, 0])
      else poly(brick, [[b, y, 0], [a, y, 0], [a, y, ze], [b, y, ze]], [0, 1, 0])
    }
    const o = face === 'S' ? -1 : 1
    box(trim, x0 - 0.1, Math.min(y, y + o * 0.35), x1 + 0.1, Math.max(y, y + o * 0.35), ze - 0.55, ze + 0.15, true)
    if (!on) continue
    // bays of ~6 m: a tall round-arched opening, a smaller window above
    const m = Math.round((x1 - x0) / 6.1), w = (x1 - x0) / m
    for (let i = 0; i < m; i++) {
      const u = x0 + (i + 0.5) * w, g = G(u, y)
      arched(face, y, u, 3.6, g + 0.3, g + 5.6)
      wallShape(trim, face, y, [[u - 2.2, g + 6.2], [u + 2.2, g + 6.2], [u + 2.2, g + 6.5], [u - 2.2, g + 6.5]], 0.04)
      if (ze - g > 8.4) arched(face, y, u, 2.4, g + 6.9, Math.min(ze - 0.9, g + 9.0))
    }
  }
}

// ---------------------------------------------------------- main barn ---
const MAIN_YS = Array.from({ length: 6 }, (_, i) => -45.3 + (i * 91.9) / 5)
barn(-64.0, 67.9, MAIN_YS, 10.2, 13.6, { south: true, north: true })
// the full-height strip west of the bays, south of the notch (flat roof)
{
  const r = rect(-75.2, -45.3, -64.0, -20.7)
  prism(brick, r, 0, 10.6, false)
  poly(roof, r.map(([x, y]) => [x, y, 10.3] as V3), [0, 0, 1])
  prism(trim, rect(-75.4, -45.5, -63.9, -20.5), 10.3, 10.8, false)
  for (const y of [-40.5, -33.0, -25.5]) arched('W', -75.2, y, 3.2, G(-75, y) + 0.4, G(-75, y) + 5.4)
  for (const x of [-72.3, -67.0]) arched('S', -45.3, x, 3.2, 0.4, 5.4)
  for (const x of [-72.3, -67.0]) arched('S', -45.3, x, 2.2, 6.9, 9.0)
}

// ---------------------------------------------------------- north barn ---
barn(-72.7, -3.9, Array.from({ length: 4 }, (_, i) => 49.6 + (i * 42.6) / 3), 10.0, 12.6, { south: false, north: true })

// ---------------------------------------------------------- water tower ---
{
  const cx = 76.9, cy = 66.8, g = 4.4
  const zLegTop = g + 14.0, zBowl = g + 12.2, zCyl0 = g + 15.3, zCyl1 = g + 20.5, R = 3.25
  // four splayed legs, a solid stair core, two rings of struts
  const legs: XY[] = [[-1, -1], [1, -1], [1, 1], [-1, 1]]
  for (const [sx, sy] of legs) {
    const b: XY = [cx + sx * 3.9, cy + sy * 3.9], t: XY = [cx + sx * 2.35, cy + sy * 2.35], h = 0.24
    const ring = (p: XY, z: number): V3[] => [[p[0] - h, p[1] - h, z], [p[0] + h, p[1] - h, z], [p[0] + h, p[1] + h, z], [p[0] - h, p[1] + h, z]]
    steel.loft([ring(b, 0), ring(t, zLegTop)])
  }
  lathe(steel, cx, cy, 0, [[0.7, 0], [0.7, zBowl + 0.2]], 10)
  for (const f of [0.38, 0.72]) {
    const z = g + 14.0 * f, d = 3.9 - (3.9 - 2.35) * (g * 0 + (z / zLegTop))
    prism(steel, rect(cx - d, cy - d, cx + d, cy + d), z - 0.15, z + 0.15, true)
    prism(steel, rect(cx - d + 0.3, cy - d + 0.3, cx + d - 0.3, cy + d - 0.3).reverse() as XY[], z - 0.15, z + 0.15, false)
  }
  // the rounded tank bottom and the tank
  const bowl: [number, number][] = [[0.6, 0], [1.6, 0.25], [2.4, 0.6], [2.95, 1.2], [R, 2.0], [R, zCyl0 - zBowl]]
  lathe(trim, cx, cy, zBowl, bowl, 16, true)
  lathe(trim, cx, cy, zCyl0, [[R, 0], [R, zCyl1 - zCyl0]], 16)
  // a cream band at the gallery and two thin bands on the tank (p3)
  lathe(steel, cx, cy, zCyl0 - 0.9, [[4.35, 0], [4.35, 0.3]], 16, true)
  lathe(steel, cx, cy, zCyl0 - 0.6, [[4.3, 0], [4.3, 0.85]], 16)
  lathe(steel, cx, cy, zCyl0 - 0.6, [[4.15, 0.85], [4.15, 0]], 16)
  // the lettered plaques (lit), west and east
  for (const s of [-1, 1]) {
    const pts: V3[] = []
    const a0 = (s < 0 ? Math.PI : 0) - 0.55, a1 = (s < 0 ? Math.PI : 0) + 0.55
    for (let k = 0; k <= 4; k++) {
      const a = a0 + ((a1 - a0) * k) / 4
      pts.push([cx + (R + 0.06) * Math.cos(a), cy + (R + 0.06) * Math.sin(a), zCyl0 + 1.4], [cx + (R + 0.06) * Math.cos(a), cy + (R + 0.06) * Math.sin(a), zCyl0 + 3.9])
    }
    for (let k = 0; k < 4; k++) {
      const [p0, p1, q0, q1] = [pts[2 * k], pts[2 * k + 1], pts[2 * k + 2], pts[2 * k + 3]]
      const am = a0 + ((a1 - a0) * (k + 0.5)) / 4
      poly(neon, [p0, q0, q1, p1], [Math.cos(am), Math.sin(am), 0])
    }
  }
  // grey conical roof, the openwork dome cage and the finial
  lathe(roof, cx, cy, zCyl1, [[R + 0.35, 0], [R + 0.35, 0.25], [1.2, 1.5], [0.25, 2.0], [0, 2.1]], 16, true)
  const zc = zCyl1 + 0.2, rc = 3.85, hc = 3.7
  for (let k = 0; k < 8; k++) {
    const a = (k / 8) * 2 * Math.PI, ca = Math.cos(a), sa = Math.sin(a)
    const secs: V3[][] = []
    for (let j = 0; j <= 6; j++) {
      const t = (j / 6) * (Math.PI / 2), r = rc * Math.cos(t) + 0.05, z = zc + hc * Math.sin(t)
      const px = -sa * 0.1, py = ca * 0.1
      secs.push([[cx + r * ca - px, cy + r * sa - py, z - 0.1], [cx + r * ca + px, cy + r * sa + py, z - 0.1], [cx + r * ca + px, cy + r * sa + py, z + 0.1], [cx + r * ca - px, cy + r * sa - py, z + 0.1]])
    }
    steel.sweep(secs)
  }
  lathe(steel, cx, cy, zc - 0.05, [[rc + 0.12, 0], [rc + 0.12, 0.25]], 16)
  lathe(steel, cx, cy, zc + hc, [[0.2, 0], [0.14, 4.0], [0, 4.6]], 8)
  lathe(steel, cx, cy, zc + hc + 1.6, [[0.01, -0.45], [0.45, 0], [0.01, 0.45]], 8)
}

// ---------------------------------------------------------------- output ---
// Colours from p2 (sunlit brick, cream stone bands, pale roofs) and p3
// (white tank, grey roof, black steel pulled to charcoal).
const parts = [
  { part: brick, material: finish('trolley-brick', 0xb4705a) },
  { part: roof, material: finish('trolley-roof', 0xc4c8cb) },
  { part: trim, material: PALETTE.stone },
  { part: win, material: PALETTE.window },
  { part: steel, material: finish('trolley-steel', 0x4a4f57) },
  { part: neon, material: finish('neon-trolley-gold', 0xe2b45a) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Trolley Square', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: 4.4 + 29.6,
})
await Bun.write(new URL('../models/slc-trolley-square.glb', import.meta.url), glb)
console.log(`slc-trolley-square.glb: ${triangles} triangles, ${glb.length} bytes`)
