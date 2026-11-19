/**
 * Old Courthouse (St. Louis County Courthouse), St. Louis (1839–1862; Henry
 * Singleton, Robert S. Mitchell, William Twombly; cast-iron dome by William
 * Rumbold, 1861–1864) — original procedural geometry, CC0-1.0.
 * bun generators/stl-old-courthouse.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 16.8: the model's north is the building's north
 * front, turned with the downtown street grid (OSM way/42341614's long walls
 * run at 106.8°). Anchor = the crossing under the dome, -90.189304,
 * 38.625699.
 *
 * Identity (from the photos below):
 *  1. The cast-iron dome on its drum: an octagonal base over the roofs, a
 *     colonnaded drum with round-headed windows, an attic ringed with round
 *     oculi, a ribbed green-grey dome, a lantern with arched openings, a
 *     small cap and a gilt ball.        (antony, pd2012, daderot, brossais)
 *  2. A cross plan: long east–west arms, and north–south arms ending in
 *     T-shaped heads whose east and west ends are pediments.
 *                                                  (overhead, noble, daderot)
 *  3. The big east portico on the Arch side, six columns across and deep
 *     enough to show columns on its flanks; a shallower six-column west
 *     portico on Broadway; pedimented frontispieces on the north and south.
 *                                           (antony, mollerus, brossais)
 *  4. White painted limestone and stucco, three storeys of plain windows,
 *     grey low-pitched metal roofs with many chimneys.     (daderot, mollerus)
 *
 * Plan: OSM way/42341614 turned to bearing 16.8 (it agrees with the lidar
 * within a metre): E–W arm 70.4 x 20.7 m (east end 37.9 m from the dome
 * axis, west end 32.5 m), N–S necks 20.6 m wide, heads 38.4 x 13.4 m;
 * N/S frontispieces 2.3 m deep. Dome drum: OSM way/397853921 (octagon,
 * apothem 9.8 m), lantern way/1057719414.
 *
 * Heights: USGS 3DEP lidar, USGS_LPC_MO_StLouis_2017_LAS_2018, 1 m grid,
 * read with tools/lidar_frame.py, above the lowest ground at the north-east
 * corner (5.4 m over the box's ground_min; the south side is 2 m higher).
 * Measured: eaves 16.4, arm ridges 19.1, head ridges 18.8, the drum's
 * cornice ring 32.7 at r 9.8, attic top 35.3, dome 38.5 at r 8, 42.6 at
 * r 4.8, crown 43.9, lantern cornice 46.4, lantern cap 52.6, ball 54.9
 * (a flagpole above to 58 is left out). OSM: height 19.5 (agrees),
 * dome part 45.72, lantern 59.
 *
 * Estimated: the drum's tiers below the lidar's cornice ring (octagonal
 * base to 23.3, from lidar corner returns; colonnade 23.3–31.6), read off
 * the daderot photo at 7.1 px/m; column sizes and counts on the porticoes
 * (east six by four, west six); the window rows (three storeys) and bays
 * (~3.6 m); door positions; the depth of the porticoes (east 8.5 m from
 * the mollerus and overhead photos, west 4 m). Left out: the chimneys, the
 * dome's ribs, the pilasters on the walls, the flagpole, the steps. The
 * lantern is drawn to the pd2012 photo's proportions (openings to 47.7,
 * cornice 48.4, cap to 52.6): the lidar's ring at 46.4 reads lower; doubt.
 *
 * Night: the dome, drum and porticoes are floodlit (St Louis night
 * photos show the dome lit white-green); the lantern glows.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  antony   "Old St. Louis County Courthouse 2025.jpg", Antony-22,
 *           CC BY-SA 4.0 (east front)
 *  brossais "Old Courthouse de Saint-Louis.jpg", Mathieu BROSSAIS,
 *           CC BY 4.0 (west front, Kiener Plaza)
 *  mollerus "Old Courthouse, St. Louis, Missouri, 2025.jpg", Sharon
 *           Mollerus, CC BY 2.0 (north-east: a head's pediment, the east
 *           portico's flank)
 *  daderot  "The Old Courthouse, Saint Louis, Missouri.JPG", Daderot,
 *           CC BY-SA 3.0 (south-east, elevated)
 *  pd2012   "Old Courthouse (2012).jpg", United States District Court for
 *           the Eastern District of Missouri, public
 *           domain (the dome and lantern)
 *  overhead "Old St. Louis County Courthouse from overhead.jpg", Մարի13,
 *           CC BY-SA 4.0 (from the Arch)
 *  noble    "Old Courthouse St. Louis, Missouri.jpg", Jeremy Noble,
 *           CC BY 2.0 (from the Arch)
 * No look-only sources. No commercial imagery.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { archShape, box, ccw, cornice, gableRoof, onWall, prism, rectShape, revolve, save, type XY } from './atl-tech-tower'

const stone = new Part(), roof = new Part(), dome = new Part(), win = new Part(), gilt = new Part(), door = new Part()
const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => ccw([[x0, y0], [x1, y0], [x1, y1], [x0, y1]])

const EAVE = 16.4, RIDGE = 19.1, HEAD_RIDGE = 18.8
const AW = 10.35, E = 37.9, W = -32.5 // the E–W arm
const NW = 10.3, HX = 19.2, H0 = 19.8, H1 = 33.2 // necks and heads
const EP = 29.4, WP = -28.5 // the walls behind the east and west porticoes

// ── Massing ──
const blocks: XY[][] = [
  rect(WP, EP, -AW, AW), // E–W arm (the portico bays are open)
  rect(-NW, NW, AW, H0), rect(-NW, NW, -H0, -AW), // necks
  rect(-HX, HX, H0, H1), rect(-HX, HX, -H1, -H0), // heads
]
for (const r of blocks) {
  prism(stone, r, 0, EAVE, null, 0)
  cornice(stone, r, EAVE - 1.1, 1.1, 0.5, null)
}
// frontispieces on the north and south
for (const s of [-1, 1]) {
  const r = s > 0 ? rect(-NW, NW, H1, H1 + 2.3) : rect(-NW, NW, -H1 - 2.3, -H1)
  prism(stone, r, 0, EAVE, null, 0)
  cornice(stone, r, EAVE - 1.1, 1.1, 0.5, null)
}
// Roofs: the E–W arm (pediments over the porticoes), the N–S ridge over
// necks and heads, and the heads' own E–W ridges with pediments.
gableRoof(roof, stone, W, E, -AW, AW, EAVE, RIDGE, 'x', 0.5, 0.4)
gableRoof(roof, stone, -NW, NW, -H1 - 2.3, H1 + 2.3, EAVE, RIDGE, 'y', 0.5, 0.4)
for (const [y0, y1] of [[H0, H1], [-H1, -H0]]) gableRoof(roof, stone, -HX, HX, y0, y1, EAVE, HEAD_RIDGE, 'x', 0.5, 0.4)

// ── Porticoes ──
const column = (c: XY, z0: number, z1: number, r = 0.72) =>
  revolve(stone, c, [[r + 0.25, z0], [r + 0.25, z0 + 0.5], [r, z0 + 0.6], [r * 0.86, z1 - 0.7], [r + 0.3, z1 - 0.3], [r + 0.3, z1]], 10, 0, false, true)
const PZ = 1.6, ENT = EAVE - 2.6 // podium top, entablature underside
// east: six across, four deep
box(stone, EP, E, -AW, AW, 0, PZ, stone, 0.2)
box(stone, EP, E, -AW, AW, ENT, EAVE, null, 0.1, true)
cornice(stone, rect(EP, E, -AW, AW), EAVE - 1.1, 1.1, 0.5, null)
for (let k = 0; k < 6; k++) column([E - 0.9, -AW + 0.9 + (k * (2 * AW - 1.8)) / 5], PZ, ENT)
for (const y of [-AW + 0.9, AW - 0.9]) for (const x of [EP + 1.4, EP + 3.6, EP + 5.8]) column([x, y], PZ, ENT)
// west: six across, one deep
box(stone, W, WP, -AW, AW, 0, PZ, stone, 0.2)
box(stone, W, WP, -AW, AW, ENT, EAVE, null, 0.1, true)
cornice(stone, rect(W, WP, -AW, AW), EAVE - 1.1, 1.1, 0.5, null)
for (let k = 0; k < 6; k++) column([W + 0.9, -AW + 0.9 + (k * (2 * AW - 1.8)) / 5], PZ, ENT)
// doors behind the porticoes, and on the frontispieces
const doorAt = (a: XY, b: XY, s: number, z0: number, w = 2.2, h = 4.6) => {
  onWall(door, a, b, rectShape(s - w / 2, s + w / 2, z0, z0 + h), 0.06)
  onWall(win, a, b, archShape(s, w, z0 + h, z0 + h + 0.01, 6), 0.06)
}
doorAt([EP, -AW], [EP, AW], AW, PZ, 2.6, 5.2)
for (const s of [AW - 5.6, AW + 5.6]) doorAt([EP, -AW], [EP, AW], s, PZ, 1.8, 4)
doorAt([WP, AW], [WP, -AW], AW, PZ, 2.6, 5.2)
doorAt([-NW, -H1 - 2.3], [NW, -H1 - 2.3], NW, 2, 2.4, 4.4)
doorAt([NW, H1 + 2.3], [-NW, H1 + 2.3], NW, 1, 2.4, 4.4)

// ── Windows: three storeys round every outside wall ──
const ROWS: [number, number][] = [[2.6, 4.9], [6.6, 9.8], [11.4, 13.4]]
const inBlock = (p: XY) => [...blocks, rect(EP, E, -AW, AW), rect(W, WP, -AW, AW)].some((r) => {
  const xs = r.map((q) => q[0]), ys = r.map((q) => q[1])
  return p[0] > Math.min(...xs) + 0.05 && p[0] < Math.max(...xs) - 0.05 && p[1] > Math.min(...ys) + 0.05 && p[1] < Math.max(...ys) - 0.05
})
for (const r of blocks) {
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const n: XY = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L]
    const k = Math.floor((L - 2.4) / 3.6)
    for (let j = 0; j < k; j++) {
      const s = L / 2 + (j - (k - 1) / 2) * 3.6, t = s / L
      const p: XY = [a[0] + (b[0] - a[0]) * t + n[0] * 0.6, a[1] + (b[1] - a[1]) * t + n[1] * 0.6]
      if (inBlock(p)) continue
      if (Math.abs(p[1]) > H1 && Math.abs(p[0]) < NW + 0.5) continue // behind the frontispieces
      for (const [z0, z1] of ROWS) onWall(win, a, b, rectShape(s - 0.65, s + 0.65, z0, z1))
    }
  }
}
// the frontispieces' windows beside their doors
for (const s of [-1, 1]) {
  const y = s * (H1 + 2.3), a: XY = s > 0 ? [NW, y] : [-NW, y], b: XY = s > 0 ? [-NW, y] : [NW, y]
  for (const off of [-6.6, -3.3, 3.3, 6.6]) for (const [z0, z1] of ROWS) if (!(z0 < 7 && Math.abs(off) < 4)) onWall(win, a, b, rectShape(NW + off - 0.65, NW + off + 0.65, z0, z1))
}

// ── The dome ──
const C: XY = [0, 0]
revolve(stone, C, [[10.6, RIDGE - 3], [10.6, 22.6], [11, 22.8], [11, 23.3], [9.8, 23.3]], 8, Math.PI / 8, true, false) // octagonal base
revolve(stone, C, [[8.7, 23.3], [8.7, 31.6]], 16, 0, true, false) // the drum's wall behind the columns
revolve(stone, C, [[8.7, 31.6], [10.1, 31.6], [10.1, 32.7], [9.2, 32.7], [9.2, 35.3], [9.4, 35.3], [9.4, 35.7], [8.8, 35.7]], 16, 0, false, false)
const N = 16
for (let i = 0; i < N; i++) {
  const a = ((i + 0.5) / N) * Math.PI * 2
  column([9.5 * Math.cos(a), 9.5 * Math.sin(a)], 23.3, 31.6, 0.42)
  const a0 = (i / N) * Math.PI * 2, a1 = ((i + 1) / N) * Math.PI * 2
  const p0: XY = [8.7 * Math.cos(a0), 8.7 * Math.sin(a0)], p1: XY = [8.7 * Math.cos(a1), 8.7 * Math.sin(a1)]
  const w = 2 * 8.7 * Math.sin(Math.PI / N)
  onWall(win, p0, p1, archShape(w / 2, 1.5, 24.6, 29.6, 6), 0.04)
  const q0: XY = [9.2 * Math.cos(a0), 9.2 * Math.sin(a0)], q1: XY = [9.2 * Math.cos(a1), 9.2 * Math.sin(a1)]
  const wq = 2 * 9.2 * Math.sin(Math.PI / N)
  onWall(win, q0, q1, Array.from({ length: 10 }, (_, k) => [wq / 2 + 0.75 * Math.cos((k / 10) * Math.PI * 2), 34 + 0.75 * Math.sin((k / 10) * Math.PI * 2)] as [number, number]), 0.04)
}
// the dome: fitted to the lidar profile
const prof: [number, number][] = [[8.8, 35.7], [8.5, 37.2], [8, 38.5], [7.1, 39.7], [6.1, 41], [4.8, 42.3], [3.4, 43.3], [2.3, 43.9]]
revolve(dome, C, prof, N, 0, false, false)
// the lantern: arched openings, cornice, cap, gilt ball
revolve(stone, C, [[2.6, 43.6], [2.6, 44.2], [2.3, 44.2], [2.3, 47.7], [2.65, 47.8], [2.65, 48.4], [2.2, 48.4]], 8, Math.PI / 8, true, false)
revolve(dome, C, [[2.2, 48.4], [2.05, 49.3], [1.6, 50.3], [0.9, 51.1], [0.45, 51.4], [0.45, 52.6], [0, 52.7]], 8, Math.PI / 8, false, false)
revolve(gilt, C, [[0.01, 52.6], [0.6, 52.8], [1.05, 53.6], [1.05, 54], [0.6, 54.75], [0, 54.9]], 8, 0, false, false)
for (let i = 0; i < 8; i++) {
  const a0 = Math.PI / 8 + (i / 8) * Math.PI * 2, a1 = Math.PI / 8 + ((i + 1) / 8) * Math.PI * 2
  const r = 2.3 / Math.cos(Math.PI / 8)
  const p0: XY = [r * Math.cos(a0), r * Math.sin(a0)], p1: XY = [r * Math.cos(a1), r * Math.sin(a1)]
  onWall(win, p0, p1, archShape(Math.hypot(p1[0] - p0[0], p1[1] - p0[1]) / 2, 1.0, 44.6, 46.5, 5), 0.04)
}

const floodlit = (p: [number, number, number], n: [number, number, number]) => {
  if (n[2] > 0.8) return 0.1
  if (p[2] > RIDGE - 3 && Math.hypot(p[0], p[1]) < 11.5) return 1
  if (p[0] > EP - 0.5 || p[0] < WP + 0.5) return 0.8 // the porticoes
  return 0.35
}
await save('stl-old-courthouse', 'Old Courthouse', [
  { part: stone, material: { ...finish('stl-limestone', 0xeee7da), floodlight: floodlit } },
  { part: roof, material: PALETTE.roof },
  { part: dome, material: { ...finish('stl-dome', 0x8cb59e), floodlight: (p, n) => (n[2] > 0.95 ? 0.3 : 0.9) } },
  { part: win, material: PALETTE.window },
  { part: gilt, material: finish('stl-gilt', 0xc9a24a) },
  { part: door, material: finish('stl-door', 0x6e5c4a) },
], { height: 54.9, anchor: [38.625699, -90.189304], bearing: 16.8 }, 6500)
