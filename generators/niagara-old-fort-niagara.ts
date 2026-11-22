/**
 * Old Fort Niagara, Youngstown, New York: procedural, CC0-1.0.
 * bun generators/niagara-old-fort-niagara.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0. The origin is the
 * centroid of OSM's fort outline way/137364896 (the walls, a
 * barrier=city_wall ring). The model is the fort's stone buildings, each
 * at its OSM outline and turned to it; the earthworks, the brick-faced
 * ramparts, the palisades, the paths and the ground are the map's.
 *
 * Buildings (OSM way, dates from the fort's NRHP/NHL record and Wikipedia):
 * - French Castle, 1726-27 (way/117216451): 29.3 x 15.1 m, two stone
 *   storeys, a two-pitch hipped slate roof (a steep lower band carrying
 *   nine dormers a side, a low upper hip), five chimneys;
 * - Bakehouse, 1762 (way/117216427) and the small hipped stone building
 *   west of it (way/117216449, unnamed in OSM), both at the castle's
 *   south-west end;
 * - North Redoubt and South Redoubt, 1770-71 (way/117216415,
 *   way/117216445): 10.8 m square stone blockhouses with an overhanging
 *   timber gallery under a low hipped roof and a brick chimney; the South
 *   Redoubt's arched gateway under a pediment;
 * - Provision Storehouse, 1762 (way/117216430): 40.5 x 8.4 m, gabled;
 * - Powder Magazine, 1757 (way/117216459): 15.7 x 9.0 m, gabled, windowless.
 * Left out: the log cabin (timber), the Gate of the Five Nations (part of
 * the wall), the Coast Guard buildings and everything outside the walls,
 * including the Fort Niagara lighthouse.
 *
 * Heights: USGS 3DEP NY_FEMAR2_Central_B1_2018 lidar (flown 2018), above
 * each building's own lowest ground (each stands at y = 0 and the map
 * drapes it onto its own ground; the fort's plateau is 8-9 m above the
 * beach, which the map's base sits on):
 * - French Castle: eaves 9.0 over the lake-side ground (the parade side is
 *   1.0 m higher), the roof's break 10.6 about 2 m in, ridge 12.4 over the
 *   middle 14 m, chimneys 13.1 (the 2 m cells miss their tops: drawn 14.0, from
 *   the parade photo, scaled on the wall);
 * - redoubts: eaves 10.0, apex 12.6 (a 23-degree hip), chimney 13.1;
 * - storehouse: ridge 7.5, eaves about 4 (the edge cells are noisy);
 * - magazine: ridge 8.4, eaves about 6.
 * From photos: the castle's nine bays a side, its doors (three on the
 *   parade front) and window sizes; the dormers; the redoubts' stone body
 *   to 8.0 and the open gallery above (scaled on DanielPenfield's photo); the storehouse's gable-end chimney.
 * Estimated: window and door sizes and positions on sides no photo shows
 *   (repeated from the photographed ones); the bakehouse's and the small
 *   building's heights (photo, against the castle); the magazine's door;
 *   which face carries the South Redoubt's gate (the north-west, inward).
 *
 * Colour: grey-buff limestone, dark slate roofs, weathered grey-brown
 * timber, red brick chimneys on the redoubts, all from the photos and
 * pulled to the palette's lightness. Night: windows are `window`.
 *
 * Photos (Wikimedia Commons):
 * - "French Castle at Fort Niagara (2) (22134680910).jpg", Larry Koester, CC BY 2.0 (castle, parade front)
 * - "French castle at Fort Niagara.JPG", Ad Meskens, CC BY-SA 3.0 (castle, parade front and south-west end, bakehouse)
 * - "North Redoubt, Old Fort Niagara.JPG", Ken Smith, CC BY-SA 3.0 (north redoubt)
 * - "OldFortNiagara2023SouthRedoubtAndProvisionStorehouseFromRampart.jpg", DanielPenfield, CC BY-SA 4.0 (south redoubt, storehouse)
 * Look-only: none. No photo of the powder magazine was found: it is a plain
 * gabled block at its lidar heights.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const D2R = Math.PI / 180
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]

const stone = new Part()
const roof = new Part()
const wood = new Part()
const win = new Part()
const brick = new Part()
const shade = new Part() // the redoubt galleries' shadowed inner walls

/** A flat convex polygon, wound to face along `hint`. */
function poly(p: Part, pts: V3[], hint: V3) {
  const n = cross(sub(pts[1], pts[0]), sub(pts[2], pts[0]))
  const q = dot(n, hint) >= 0 ? pts : [...pts].reverse()
  for (let i = 1; i < q.length - 1; i++) p.tri(q[0], q[i], q[i + 1])
}

/** A building's own frame: a along its long axis (bearing `brg`), b to its left, z up. */
type Frame = (a: number, b: number, z: number) => V3
function frame(cx: number, cy: number, brg: number): Frame & { ea: V3; eb: V3 } {
  const ea: V3 = [Math.sin(brg * D2R), Math.cos(brg * D2R), 0], eb: V3 = [-ea[1], ea[0], 0]
  const f = ((a: number, b: number, z: number): V3 => [cx + a * ea[0] + b * eb[0], cy + a * ea[1] + b * eb[1], z]) as any
  f.ea = ea; f.eb = eb
  return f
}

/** A box in a frame, centred at (a, b), with its vertical corners chamfered by c. */
function box(p: Part, F: Frame, a: number, b: number, ha: number, hb: number, z0: number, z1: number, c = 0) {
  const k = Math.min(c, ha * 0.4, hb * 0.4)
  const pts: [number, number][] = k > 0
    ? [[ha - k, -hb], [ha, -hb + k], [ha, hb - k], [ha - k, hb], [-ha + k, hb], [-ha, hb - k], [-ha, -hb + k], [-ha + k, -hb]]
    : [[ha, -hb], [ha, hb], [-ha, hb], [-ha, -hb]]
  const ring = (z: number) => pts.map(([u, v]) => F(a + u, b + v, z))
  p.loft([ring(z0), ring(z1)])
  p.cap(ring(z1), true)
  if (z0 > 0.01) p.cap(ring(z0), false)
}

/** Outward normal of a frame's side: 'a+', 'a-', 'b+', 'b-'. */
function sideN(F: ReturnType<typeof frame>, side: string): V3 {
  const e = side[0] === 'a' ? F.ea : F.eb
  return side[1] === '+' ? e : mul(e, -1)
}

/** A flat panel on a wall face: side, the face's half-depth, position along it, width, z range. */
function panel(p: Part, F: ReturnType<typeof frame>, side: string, half: number, t: number, w: number, z0: number, z1: number, arch = false) {
  const s = side[1] === '+' ? 1 : -1, d = half + 0.04
  const at = (u: number, z: number): V3 => (side[0] === 'a' ? F(s * d, u, z) : F(u, s * d, z))
  const n = sideN(F, side)
  // u runs along the face; t is its centre.
  const pts: V3[] = [at(t - w / 2, z0), at(t + w / 2, z0)]
  if (arch) {
    const r = w / 2, zs = z1 - r
    for (let i = 0; i <= 8; i++) { const q = (i / 8) * Math.PI; pts.push(at(t + r * Math.cos(q), zs + r * Math.sin(q))) }
  } else pts.push(at(t + w / 2, z1), at(t - w / 2, z1))
  poly(p, pts, n)
}

/**
 * A hipped roof over a ha x hb plan: rings [half-a, half-b, z] from the eave
 * up, ending in the ridge (half-b 0). Soffit under the eave, fascia round it.
 */
function hip(F: Frame, a: number, b: number, rings: [number, number, number][], soffit = true) {
  const ring = ([ha, hb, z]: [number, number, number]): V3[] =>
    [F(a + ha, b - hb, z), F(a + ha, b + hb, z), F(a - ha, b + hb, z), F(a - ha, b - hb, z)]
  const R = rings.map(ring)
  for (let k = 0; k < R.length - 1; k++) {
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4
      const q = [R[k][i], R[k][j], R[k + 1][j], R[k + 1][i]]
      const top = rings[k + 1]
      if (top[1] === 0 && (i === 0 || i === 2)) poly(roof, [q[0], q[1], q[2]], [0, 0, 1]) // hip end triangle
      else if (top[0] === 0 && top[1] === 0) poly(roof, [q[0], q[1], q[2]], [0, 0, 1])
      else poly(roof, q, [0, 0, 1])
    }
  }
  const e = rings[0], f: [number, number, number] = [e[0], e[1], e[2] - 0.22]
  const E = R[0], Fz = ring(f)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    const mid = mul(add(E[i], E[j]), 0.5), c = F(a, b, e[2])
    poly(roof, [Fz[i], Fz[j], E[j], E[i]], sub(mid, c))
  }
  if (soffit) poly(roof, Fz, [0, 0, -1])
}

/** A gabled roof: ridge along a, eaves at z0 over half-width hb + o, gable walls in stone at ±ha. */
function gable(F: Frame, ha: number, hb: number, z0: number, rise: number, o: number, gableStone = true) {
  const ea = ha + o, eb = hb + o
  for (const s of [1, -1]) {
    const q = [F(-ea, s * eb, z0), F(ea, s * eb, z0), F(ea, 0, z0 + rise), F(-ea, 0, z0 + rise)]
    poly(roof, q, [0, 0, 1])
    poly(roof, q, [0, 0, -1])
    const fz = [F(-ea, s * eb, z0 - 0.2), F(ea, s * eb, z0 - 0.2), F(ea, s * eb, z0), F(-ea, s * eb, z0)]
    poly(roof, fz, sub(F(0, s, 0), F(0, 0, 0)))
  }
  if (gableStone) for (const s of [1, -1]) poly(stone, [F(s * ha, -hb, z0), F(s * ha, hb, z0), F(s * ha, 0, z0 + rise * (1 - o / eb))], sub(F(s, 0, 0), F(0, 0, 0)))
}

// ======================================================= French Castle ===
{
  const F = frame(-81.83, 25.35, 49)
  const HA = 14.65, HB = 7.55, EAVE = 9.0, PARADE = 1.0 // b- is the parade (south-east) side
  box(stone, F, 0, 0, HA, HB, 0, EAVE, 0.25)
  // Two-pitch hipped roof: steep band to the break, then a low hip.
  hip(F, 0, 0, [[HA + 0.35, HB + 0.35, EAVE], [HA - 1.7, HB - 1.7, 10.6], [HA - HB, 0, 12.4]])
  const bays = [-4, -3, -2, -1, 0, 1, 2, 3, 4].map((i) => i * 3.1)
  for (const [side, g] of [['b-', PARADE], ['b+', 0]] as [string, number][]) {
    for (const [i, t] of bays.entries()) {
      const door = side === 'b-' && (i === 1 || i === 4 || i === 7)
      if (door) panel(wood, F, side, HB, t, 1.2, g + 0.02, g + 2.4)
      else panel(win, F, side, HB, t, 1.15, g + 1.0, g + 2.9)
      if (!(side === 'b-' && i === 4)) panel(win, F, side, HB, t, 1.15, 5.2, 6.9)
      else panel(win, F, side, HB, t, 0.8, 5.5, 6.6) // the arms over the main door
      // Dormers in the steep band, one over each bay.
      const s = side === 'b-' ? -1 : 1
      const b0 = s * (HB - 0.15), b1 = s * (HB - 2.9)
      const ring = (b: number, z: number) => [F(t - 0.7, b, z), F(t + 0.7, b, z)]
      const z0 = EAVE - 0.1, z1 = EAVE + 1.35, z2 = EAVE + 1.85
      const fr = [...ring(b0, z0), ...ring(b0, z1).reverse()]
      poly(roof, fr, sideN(F, side))
      for (const u of [-0.7, 0.7]) poly(roof, [F(t + u, b0, z0), F(t + u, b1, z0), F(t + u, b1, z1), F(t + u, b0, z1)], mul(F.ea, Math.sign(u)))
      poly(roof, [F(t - 0.7, b0, z1), F(t + 0.7, b0, z1), F(t, b0, z2)], sideN(F, side))
      for (const u of [-0.85, 0.85]) {
        const q = [F(t, b0 + s * 0.3, z2), F(t, b1, z2), F(t + u, b1, z1 - 0.1), F(t + u, b0 + s * 0.3, z1 - 0.1)]
        poly(roof, q, [0, 0, 1])
        poly(roof, q, [0, 0, -1])
      }
      panel(win, F, side, Math.abs(b0) + 0.0, t, 0.75, z0 + 0.3, z1 - 0.15)
    }
  }
  for (const side of ['a+', 'a-']) for (const t of [-3.2, 3.2]) {
    panel(win, F, side, HA, t, 1.1, 1.4, 3.1)
    panel(win, F, side, HA, t, 1.1, 5.2, 6.9)
  }
  // Chimneys, where the lidar finds them.
  for (const [a, b] of [[14.0, 0], [14.0, -5.6], [-13.6, -5.0], [-3.0, -3.0], [5.0, 2.0]]) box(stone, F, a, b, 0.7, 0.55, 8, 14.0, 0.1)
}

// ===================================================== the bakehouse ===
{
  const F = frame(-84.28, 2.75, 318)
  box(stone, F, 0, 0, 5.85, 3.4, 0, 3.6, 0.15)
  hip(F, 0, 0, [[6.15, 3.7, 3.6], [6.15 - 3.7, 0, 7.0]])
  panel(wood, F, 'b-', 3.4, 1.0, 1.1, 0.02, 2.2)
  panel(win, F, 'b-', 3.4, -2.6, 0.9, 1.0, 2.3)
  panel(win, F, 'b+', 3.4, 0, 0.9, 1.0, 2.3)
  box(stone, F, -3.8, 1.5, 0.55, 0.55, 3, 7.6, 0.08)
}
// The small hipped building west of it.
{
  const F = frame(-96.1, 13.0, 49)
  box(stone, F, 0, 0, 3.7, 3.45, 0, 3.6, 0.15)
  hip(F, 0, 0, [[4.0, 3.75, 3.6], [0.25, 0, 6.6]])
  panel(wood, F, 'b-', 3.45, 0, 1.0, 0.02, 2.1)
  box(stone, F, 2.4, 0, 0.5, 0.5, 3, 7.2, 0.08)
}

// ======================================================== the redoubts ===
function redoubt(cx: number, cy: number, brg: number, chimney: [number, number], gateSide?: string) {
  const F = frame(cx, cy, brg)
  const H = 5.35, STONE = 8.0
  box(stone, F, 0, 0, H, H, 0, STONE, 0.3)
  box(wood, F, 0, 0, 6.0, 6.0, STONE, STONE + 0.3)          // gallery floor
  box(shade, F, 0, 0, 4.7, 4.7, STONE + 0.3, 9.8)           // the gallery's shadowed inside
  for (const u of [-5.8, -2.9, 0, 2.9, 5.8]) for (const s of [-1, 1]) {
    box(wood, F, u, s * 5.8, 0.2, 0.2, STONE + 0.3, 9.8)
    if (Math.abs(u) < 5) box(wood, F, s * 5.8, u, 0.2, 0.2, STONE + 0.3, 9.8)
  }
  for (const s of [-1, 1]) {                                 // the gallery's low rail
    box(wood, F, 0, s * 5.85, 5.95, 0.1, STONE + 0.8, STONE + 1.0)
    box(wood, F, s * 5.85, 0, 0.1, 5.95, STONE + 0.8, STONE + 1.0)
    box(wood, F, 0, s * 5.85, 5.95, 0.12, 9.5, 9.8) // the plate under the eaves
    box(wood, F, s * 5.85, 0, 0.12, 5.95, 9.5, 9.8)
  }
  hip(F, 0, 0, [[6.9, 6.9, 9.95], [0, 0, 12.6]])
  box(brick, F, chimney[0], chimney[1], 0.55, 0.55, 8, 13.1, 0.08)
  for (const side of ['a+', 'a-', 'b+', 'b-']) {
    const ts = side === gateSide ? [-3.4, 3.4] : [-2.6, 2.6]
    for (const t of ts) panel(win, F, side, H, t, 0.75, 5.3, 6.4)
    for (const t of [-1.3, 1.3]) if (side !== gateSide) panel(win, F, side, H, t, 0.3, 1.6, 2.4)
  }
  if (gateSide) {
    // A shallow projecting bay with a pediment, round-arched gateway, timber doors.
    const s = gateSide[1] === '+' ? 1 : -1
    box(stone, F, s * (H + 0.15), 0, 0.2, 2.3, 0, 7.0, 0.05)
    const n = sideN(F, gateSide), d = s * (H + 0.35)
    poly(stone, [F(d, -2.5, 7.0), F(d, 2.5, 7.0), F(d, 0, 7.95)], n)
    poly(stone, [F(s * (H - 0.1), -2.5, 7.0), F(d, -2.5, 7.0), F(d, 0, 7.95), F(s * (H - 0.1), 0, 7.95)], [0, 0, 1])
    poly(stone, [F(s * (H - 0.1), 2.5, 7.0), F(d, 2.5, 7.0), F(d, 0, 7.95), F(s * (H - 0.1), 0, 7.95)], [0, 0, 1])
    panel(stone, F, gateSide, H + 0.35, 0, 3.2, 0.02, 5.0, true)
    panel(wood, F, gateSide, H + 0.39, 0, 2.6, 0.02, 4.6, true)
  }
}
redoubt(38.05, 95.6, 53, [-4.5, -2.0])
redoubt(50.4, -51.45, 30, [-4.0, -2.0], 'b+')

// ================================================ provision storehouse ===
{
  const F = frame(28.0, -73.3, 26)
  const HA = 20.25, HB = 4.2, EAVE = 4.2
  box(stone, F, 0, 0, HA, HB, 0, EAVE, 0.15)
  gable(F, HA, HB, EAVE, 3.5, 0.3)
  box(stone, F, HA - 0.5, 0, 0.5, 0.6, 6, 8.9, 0.08)
  box(stone, F, 3.0, 0, 0.5, 0.6, 6, 8.7, 0.08)
  for (const side of ['b+', 'b-']) for (const [i, t] of [-17, -12.5, -8, -3.5, 1, 5.5, 10, 14.5, 18].entries()) {
    if (i % 3 === 1) panel(wood, F, side, HB, t, 1.2, 0.02, 2.3)
    else panel(win, F, side, HB, t, 0.9, 1.0, 2.4)
  }
  for (const t of [-2, 2]) {
    panel(win, F, 'a+', HA, t, 0.9, 1.0, 2.3)
    panel(win, F, 'a+', HA, t, 0.9, 3.2, 4.3)
    panel(win, F, 'a-', HA, t, 0.9, 1.0, 2.3)
  }
}

// ===================================================== powder magazine ===
{
  const F = frame(1.2, -81.5, 113)
  const HA = 7.85, HB = 4.5, EAVE = 5.6
  box(stone, F, 0, 0, HA, HB, 0, EAVE, 0.2)
  gable(F, HA, HB, EAVE, 2.8, 0.3)
  panel(wood, F, 'a+', HA, 0, 1.2, 0.02, 2.2)
}

// ---------------------------------------------------------------- output ---
const parts = [
  { part: stone, material: finish('fort-limestone', 0xddd6c8) },
  { part: roof, material: finish('fort-slate', 0x868c93) },
  { part: wood, material: finish('fort-timber', 0x8c8172) },
  { part: win, material: PALETTE.window },
  { part: brick, material: finish('fort-brick', 0xb37462) },
  { part: shade, material: finish('fort-gallery-shadow', 0x55504a) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Old Fort Niagara', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: 13.1,
})
if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
const out = new URL('../models/niagara-old-fort-niagara.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
