/**
 * Salesforce Tower, Indianapolis (formerly Bank One / Chase Tower, 1990,
 * HOK): procedural, CC0-1.0.
 * bun generators/indy-salesforce-tower.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres. The origin is the centroid of
 * OSM way/338986226 (-86.15709, 39.76960). The outline is a clean rectangle
 * turned 1.6 degrees clockwise from north, so the model is drawn square and
 * placed at bearing 1.6. In that frame the outline is x ±63.9, y ±18.0: the
 * tower part (way/352344049) x ±28.6, and a four-storey wing on each side
 * (way/352344047 west, way/352344048 east).
 *
 * Form: a granite slab tower with ribbon windows, its corners notched in
 * steps as it rises (a dark glazed "zipper" at each corner), a dark glazed
 * slot down the middle of each long face, a pale stepped hip crown (a
 * ziggurat roof with a short east-west ridge) on a pale band with dark
 * openings, and two tall white masts standing on the ends of the ridge.
 * The "salesforce" sign sits on the crown's south slope.
 *
 * Sources
 * - OSM (ODbL): way/338986226 (outline, height 214, 61 levels as tagged),
 *   building:parts way/352344049 (tower, 49 levels, height 214),
 *   way/352344047 and way/352344048 (4-level wings).
 * - Published (Wikipedia, "Salesforce Tower (Indianapolis)"; CTBUH): 811 ft
 *   (247 m) to the spire tips, 701 ft (214 m) to the roof, 48/49 floors,
 *   completed 1990. Tallest building in Indiana.
 * - Lidar: USGS 3DEP USGS_LPC_IN_Central_MarionCo_2016_LAS_2018 (flown
 *   2016), 1 m DSM, heights above the street (217.4 m): wings 17.7; tower
 *   walls and roof ring 182; crown base band to 191; crown steps rising to
 *   a ridge at 214 (x about -10..+12, y about ±2); masts at x ≈ -7 and +9
 *   on the ridge, reading 250-251.6 at their tips (antenna whips; the
 *   published 247 m is used). Corner notches: the corner blocks read 49 m
 *   and 88 m, so the corners step in at those heights. The lidar footprint
 *   agrees with OSM to about a metre.
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   "Chase Tower, Indianápolis, Estados Unidos, 2012-10-22, DD 01.jpg"
 *     (Diego Delso, CC BY-SA 3.0) - granite colour, ribbon windows, the
 *     stepped corner notches and the dark glazed slot, lobby glazing;
 *     https://commons.wikimedia.org/wiki/File:Chase_Tower,_Indian%C3%A1polis,_Estados_Unidos,_2012-10-22,_DD_01.jpg
 *   "ChaseTowerIndianapolis.jpg" (Durin, CC BY-SA 3.0), from the south-west
 *     by Monument Circle - corner steps at about a quarter and a half of the
 *     height, the south face's slot, the twin masts;
 *     https://commons.wikimedia.org/wiki/File:ChaseTowerIndianapolis.jpg
 *   "Salesforce Tower - August 2017 - Jeffrey Hayes.jpg" (Jeffrey Hayes,
 *     CC BY 2.0) - the pale stepped crown, its band of dark openings, the
 *     masts and the sign;
 *     https://commons.wikimedia.org/wiki/File:Salesforce_Tower_-_August_2017_-_Jeffrey_Hayes.jpg
 *   "Soldiers and Sailors, Chase Tower, night.jpg" (Josh Hallett, CC BY-SA
 *     2.0) - night: lit office windows, the crown's base faintly lit.
 *     https://commons.wikimedia.org/wiki/File:Soldiers_and_Sailors,_Chase_Tower,_night.jpg
 * - Look-only: none.
 *
 * Estimated: notch sizes (3 m at 49 m; two 3 m steps from 88 m; lidar
 * shows 4-6 m), the slot's width and depth (no lidar return; from photos),
 * the number of crown steps (10 drawn; the real crown has more, finer
 * ones), the crown openings, the mast diameters (about 3 m, scaled from the
 * Hayes photo), the sign's size and place, window bays (two floors a panel).
 * Doubts: the slot is drawn on both long faces, but only the south one is
 * clearly photographed; the sign is drawn on the south slope only (the
 * Hayes photo shows it there; other faces are unphotographed). The
 * neighbouring Chase Center (way/338986225, 111 Monument Circle) is a
 * separate 12-storey building and is not modelled or replaced.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]

const granite = new Part(), win = new Part(), crown = new Part()
const roof = new Part(), mast = new Part(), sign = new Part()

const at = (p: XY, z: number): V3 => [p[0], p[1], z]
const norm2 = (v: XY): XY => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l] }
const outward = (a: XY, b: XY): XY => norm2([b[1] - a[1], -(b[0] - a[0])])

/** A wall over the counter-clockwise edge a→b, facing out. */
function wall(part: Part, a: XY, b: XY, z0: number, z1: number) {
  part.quad(at(a, z0), at(b, z0), at(b, z1), at(a, z1))
}

/** Fan cap over a ring that is star-shaped about `c`. */
function cap(part: Part, ring: XY[], z: number, c: XY = [0, 0]) {
  for (let i = 0; i < ring.length; i++) part.tri(at(c, z), at(ring[i], z), at(ring[(i + 1) % ring.length], z))
}

/** Cut a small chamfer at every convex corner of a counter-clockwise ring. */
function chamfer(ring: XY[], c: number): XY[] {
  const out: XY[] = []
  const n = ring.length
  for (let i = 0; i < n; i++) {
    const p = ring[(i + n - 1) % n], q = ring[i], r = ring[(i + 1) % n]
    const a = norm2([q[0] - p[0], q[1] - p[1]]), b = norm2([r[0] - q[0], r[1] - q[1]])
    const convex = a[0] * b[1] - a[1] * b[0] > 0
    const la = Math.hypot(q[0] - p[0], q[1] - p[1]), lb = Math.hypot(r[0] - q[0], r[1] - q[1])
    const k = Math.min(c, la / 3, lb / 3)
    if (convex) out.push([q[0] - a[0] * k, q[1] - a[1] * k], [q[0] + b[0] * k, q[1] + b[1] * k])
    else out.push(q)
  }
  return out
}

/**
 * Window panels on the wall a→b: two floors a group, bays about `bayW`
 * wide, granite piers and spandrels between (STYLE.md, Windows).
 */
const Z_BASE = 18, FLOOR = 3.8, GROUP = 2 * FLOOR, SPANDREL = 3.2, PROUD = 0.05
function panels(a: XY, b: XY, z0: number, z1: number, bayW = 9.5, pier = 1.1, spandrel = SPANDREL) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (L < 2.2) return
  const n = outward(a, b), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  const bays = Math.max(1, Math.round(L / bayW)), bay = L / bays
  const pr = Math.min(pier, bay * 0.3)
  for (let g = Math.floor((z0 - Z_BASE) / GROUP); Z_BASE + g * GROUP < z1; g++) {
    const lo = Math.max(Z_BASE + g * GROUP + spandrel / 2, z0 + 0.8)
    const hi = Math.min(Z_BASE + (g + 1) * GROUP - spandrel / 2, z1 - 0.8)
    if (hi - lo < 2.5) continue
    for (let k = 0; k < bays; k++) {
      const p: XY = [a[0] + t[0] * (k * bay + pr / 2) + n[0] * PROUD, a[1] + t[1] * (k * bay + pr / 2) + n[1] * PROUD]
      const q: XY = [a[0] + t[0] * ((k + 1) * bay - pr / 2) + n[0] * PROUD, a[1] + t[1] * ((k + 1) * bay - pr / 2) + n[1] * PROUD]
      wall(win, p, q, lo, hi)
    }
  }
}

// ---------- the tower shaft ----------
const X = 28.6, Y = 18.0
const SLOT = 3.2, SLOT_D = 2.4 // the dark slot down each long face: half-width, depth

/** The tier plan, counter-clockwise from the south-west, quarter by quarter. */
function plan(notch: 0 | 1 | 2, slot: boolean): XY[] {
  // one corner, (X, -Y) south-east, walking from the south face to the east face
  const corner = (): XY[] => {
    if (notch === 0) return [[X, -Y]]
    if (notch === 1) return [[X - 3, -Y], [X - 3, -Y + 3], [X, -Y + 3]]
    return [[X - 6, -Y], [X - 6, -Y + 3], [X - 3, -Y + 3], [X - 3, -Y + 6], [X, -Y + 6]]
  }
  const southSlot: XY[] = slot ? [[-SLOT, -Y], [-SLOT, -Y + SLOT_D], [SLOT, -Y + SLOT_D], [SLOT, -Y]] : []
  const se = corner()
  const rot = (p: XY): XY => [-p[0], -p[1]] // half-turn
  const mirrorX = (p: XY): XY => [-p[0], p[1]]
  // south face: SW corner (mirror of SE, reversed), slot, SE corner
  const sw = se.map(mirrorX).reverse()
  const half: XY[] = [...sw, ...southSlot, ...se]
  return [...half, ...half.map(rot)]
}

function tier(z0: number, z1: number, notch: 0 | 1 | 2, slot: boolean, windows = true) {
  const ring = chamfer(plan(notch, slot), 0.5)
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    wall(granite, a, b, z0, z1)
    if (windows) {
      const L = Math.hypot(b[0] - a[0], b[1] - a[1])
      // the slot's and the notches' faces read as dark glass with granite bands
      if (L < 7) panels(a, b, z0, z1, 7, 0.3, 0.8)
      else panels(a, b, z0, z1)
    }
  }
  cap(roof, ring, z1)
}

// Base 0–18: the lobby, tall glazing between broad granite piers.
{
  const ring = chamfer(plan(0, false), 0.5)
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    wall(granite, a, b, 0, Z_BASE)
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 10) continue
    const n = outward(a, b), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
    const bays = Math.round(L / 6.5), bay = L / bays
    for (let k = 0; k < bays; k++) {
      const s = k * bay + 1.1, e = (k + 1) * bay - 1.1
      const p: XY = [a[0] + t[0] * s + n[0] * PROUD, a[1] + t[1] * s + n[1] * PROUD]
      const q: XY = [a[0] + t[0] * e + n[0] * PROUD, a[1] + t[1] * e + n[1] * PROUD]
      wall(win, p, q, 0.3, 9.5)
      wall(win, p, q, 11.5, 16.6)
    }
  }
}
tier(Z_BASE, 49, 0, true)
tier(49, 88, 1, true)
tier(88, 182, 2, true)

// ---------- the wings, 0–17.7 ----------
for (const s of [-1, 1]) {
  const x0 = s * X, x1 = s * 63.9, H = 17.7
  let ring: XY[] = [[Math.min(x0, x1), -Y], [Math.max(x0, x1), -Y], [Math.max(x0, x1), Y], [Math.min(x0, x1), Y]]
  ring = chamfer(ring, 0.5)
  const cx = (x0 + x1) / 2
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    // the face against the tower is hidden
    if (Math.abs(a[0] - x0) < 1e-6 && Math.abs(b[0] - x0) < 1e-6) continue
    wall(granite, a, b, 0, H)
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 6) continue
    const n = outward(a, b), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
    const bays = Math.round(L / 4.7), bay = L / bays
    for (const [lo, hi] of [[1.0, 7.4], [9.6, 16.2]]) {
      for (let k = 0; k < bays; k++) {
        const p: XY = [a[0] + t[0] * (k * bay + .65) + n[0] * PROUD, a[1] + t[1] * (k * bay + .65) + n[1] * PROUD]
        const q: XY = [a[0] + t[0] * ((k + 1) * bay - .65) + n[0] * PROUD, a[1] + t[1] * ((k + 1) * bay - .65) + n[1] * PROUD]
        wall(win, p, q, lo, hi)
      }
    }
  }
  cap(roof, ring, H, [cx, 0])
}

// ---------- the crown ----------
// A pale band (182–191) set in from the shaft's notched top, with dark
// openings, then a stepped hip roof rising to a short ridge at 214.
const CX = 23.4, CY = 16.4, BAND0 = 182, BAND1 = 191, RIDGE = 214
const RX = 11, RY = 1.6, STEPS = 10
{
  const ring = chamfer([[-CX, -CY], [CX, -CY], [CX, CY], [-CX, CY]], 0.5)
  for (let i = 0; i < ring.length; i++) wall(crown, ring[i], ring[(i + 1) % ring.length], BAND0, BAND1)
  cap(crown, ring, BAND1)
  // dark openings in the band: two on each long face, one on each end
  const open = (a: XY, b: XY) => wall(win, a, b, 183.6, 189.6)
  for (const s of [-1, 1]) {
    const y = s * (CY + PROUD)
    for (const x of [-10.5, 10.5]) {
      const p: XY = [x - 5, y], q: XY = [x + 5, y]
      open(s < 0 ? p : q, s < 0 ? q : p)
    }
    const x = s * (CX + PROUD)
    const p: XY = [x, -5.5], q: XY = [x, 5.5]
    open(s > 0 ? p : q, s > 0 ? q : p)
  }
}
const stepRect = (k: number) => {
  const t = k / STEPS
  return { hx: CX - 1.2 - (CX - 1.2 - RX) * t, hy: CY - 1 - (CY - 1 - RY) * t }
}
const rise = (RIDGE - BAND1) / STEPS
for (let k = 0; k < STEPS; k++) {
  const { hx, hy } = stepRect(k + 1 === STEPS ? STEPS : k)
  const z0 = BAND1 + k * rise, z1 = z0 + rise
  const r: XY[] = [[-hx, -hy], [hx, -hy], [hx, hy], [-hx, hy]]
  for (let i = 0; i < 4; i++) wall(crown, r[i], r[(i + 1) % 4], z0, z1)
  cap(crown, r, z1)
}

// ---------- the sign on the south slope ----------
{
  const zs = 199.5, h = 3.4, w = 15, xc = 3
  const k = Math.floor((zs - BAND1) / rise)
  const { hy } = stepRect(k)
  const y0 = -(hy + 0.5), y1 = -(hy - 0.4)
  const r: XY[] = [[xc - w / 2, y0], [xc + w / 2, y0], [xc + w / 2, y1], [xc - w / 2, y1]]
  for (let i = 0; i < 4; i++) wall(sign, r[i], r[(i + 1) % 4], zs, zs + h)
  cap(sign, r, zs + h)
}

// ---------- the twin masts ----------
function cylinder(part: Part, c: XY, r: number, z0: number, z1: number, segs = 12, topR = r) {
  const ring = (rad: number): XY[] => Array.from({ length: segs }, (_, i) => {
    const a = (i + .5) / segs * 2 * Math.PI
    return [c[0] + rad * Math.cos(a), c[1] + rad * Math.sin(a)]
  })
  const lo = ring(r), hi = ring(topR)
  for (let i = 0; i < segs; i++) {
    const j = (i + 1) % segs
    const nA = norm2([lo[i][0] - c[0], lo[i][1] - c[1]]), nB = norm2([lo[j][0] - c[0], lo[j][1] - c[1]])
    const NA: V3 = [nA[0], nA[1], 0], NB: V3 = [nB[0], nB[1], 0]
    part.tri(at(lo[i], z0), at(lo[j], z0), at(hi[j], z1), undefined, undefined, undefined, [NA, NB, NB])
    part.tri(at(lo[i], z0), at(hi[j], z1), at(hi[i], z1), undefined, undefined, undefined, [NA, NB, NA])
  }
  cap(part, hi, z1, c)
}
for (const x of [-8, 8]) {
  cylinder(mast, [x, 0], 1.9, RIDGE - 1, 236)
  cylinder(mast, [x, 0], 2.3, 222, 223.2)        // a platform ring part-way up
  cylinder(mast, [x, 0], 0.75, 236, 245, 8, 0.6)
  cylinder(mast, [x, 0], 0.35, 245, 247, 6, 0.2)
}

// ---------- write ----------
// Warm pinkish-beige granite (Delso, Durin), pulled to the palette's
// lightness; a pale off-white crown; white masts; the sign's blue.
const crownLit = (p: V3) => p[2] < BAND1 + 0.5 ? 0.8 : 0.35
const parts = [
  { part: granite, material: finish('sf-granite', 0xdfcdbf) },
  { part: win, material: PALETTE.window },
  { part: crown, material: { ...finish('sf-crown', 0xefebe4), floodlight: crownLit } },
  { part: roof, material: PALETTE.roof },
  { part: mast, material: finish('sf-mast', 0xe4e6e8, 0.6) },
  { part: sign, material: finish('neon-salesforce', 0x3b9fd6, 0.5) },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Salesforce Tower', parts, {
  license: 'CC0-1.0', bearing: 1.6, elevation: 0, height: 247,
  frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground',
  replaces: ['way/338986226', 'way/352344047', 'way/352344048', 'way/352344049'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = process.argv[2] ?? new URL('../models/indy-salesforce-tower.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
