/**
 * South Carolina State Museum, Columbia: the 1894 Columbia Mill (Columbia
 * Duck Mill), the first textile mill in the world driven entirely by
 * electricity, a long four-storey brick block on the Columbia Canal, now
 * the State Museum; with the 2014 Boeing Observatory's silver telescope
 * dome on its roof near the front.
 *
 * Frame: turned to the mill, bearing 339° (its long front runs along +x,
 * towards 69°, and faces -y, towards 159°, over the entrance plaza on
 * Gervais Street). Origin at the OSM outline's centroid.
 *
 * Sources
 * - OSM way/571395290 (building=museum, height=21, building:levels=4): the
 *   outline, which is rectilinear in this frame and covers the whole
 *   complex: the front mill block, the north wing, the west block with the
 *   glazed atrium between, a stair tower and the low east wing.
 *   way/1319322541 (building=yes, height=25) is a 3 × 3 m box inside the
 *   outline at the atrium's foot; the model covers it.
 * - USGS 3DEP lidar SC_SavannahPeeDee_5_2019 (2019), 1 m grid: main roofs
 *   73.45–73.65 m (NAVD88); the west block 72.0 m; the stair tower 74.5 m;
 *   the atrium's low roof 62.3 m rising to about 67.5 m against the north
 *   wing; the east wing 60.2 m with a 63.3 m strip on its east side; the
 *   dome's top 77.1 m. Ground 51.7 m at the south-west corner (y = 0),
 *   54.4 m at the south-east, about 58.2 m along the north side.
 * - USGS NAIP orthophoto (public domain): plan, the dome's place and size
 *   (about 8 m across), the atrium skylight strip, the roofs' grey.
 * - Photos (EVIDENCE):
 *   - Abductive, "SCStateMuseum.JPG", CC0: the front from the south-east:
 *     orange-red brick, four storeys of tall segmental-headed windows, one
 *     per bay, a pale coping, the glazed entrance with its white canopy.
 *     https://commons.wikimedia.org/wiki/File:SCStateMuseum.JPG
 *   - "Columbia - The Columbia Duck Mill 01.jpg", postcard (The Acmegraph
 *     Co., public domain): the canal (west and south) sides about 1910,
 *     the same four storeys of regular bays.
 *     https://commons.wikimedia.org/wiki/File:Columbia_-_The_Columbia_Duck_Mill_01.jpg
 *
 * Numbers
 * - Measured: plan (OSM); every roof height and the ground (lidar, less
 *   51.7 m); dome position and diameter (NAIP, lidar).
 * - Estimated: bay pitch 4.6 m and window rows (the CC0 photo, scaled to
 *   the lidar roof); the entrance pavilion's height (7 m, photo); the dome
 *   as a hemisphere 3.8 m in radius on the roof (NAIP and lidar give its
 *   size and top; its profile is not photographed).
 * - Doubts: the north, east and atrium sides are not photographed (window
 *   bays there follow the front's rhythm); the east wing's walls are drawn
 *   as brick though only its white roof is seen; the brief's "tower" is
 *   read as the stair block on the north-east, only 1 m over the roof in
 *   lidar; no licensed photo of the observatory's dome close up was found
 *   (it is drawn as the round dome NAIP shows, not a cone).
 *
 * Night: windows and the entrance glazing glow; the dome and skylight stay dark.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { cbox, grow, panel, qf, rect, tf, type Rect, type Side } from './dc-white-house'
import { lathe, saveModel } from './dc-nga-west'

const BRICK = finish('columbia-mill-brick', 0xb9775d)
const ROOF = finish('columbia-mill-roof', 0xc6c8c6)
const DOME = finish('museum-dome', 0xcfd3d6, 0.4)

const NRM: Record<Side, V3> = { n: [0, 1, 0], s: [0, -1, 0], e: [1, 0, 0], w: [-1, 0, 0] }

/** A window panel with a shallow segmental head (rise r) on a face. */
export function segWindow(win: Part, side: Side, at: number, c: number, w: number, z0: number, z1: number, r = 0.35, d = 0.05, frame?: Part) {
  if (frame) panel(frame, side, at, c - w / 2 - 0.16, c + w / 2 + 0.16, z0 - 0.16, z1 + 0.1, 0.03)
  panel(win, side, at, c - w / 2, c + w / 2, z0, z1, d)
  const ns = side === 'n' || side === 's', n = NRM[side]
  const off = at + (ns ? n[1] : n[0]) * d
  const P = (a: number, z: number): V3 => (ns ? [c + a, off, z] : [off, c + a, z])
  const pts: V3[] = [-1, -0.5, 0, 0.5, 1].map((t) => P((t * w) / 2, z1 + r * (1 - t * t)))
  for (let i = 0; i < 4; i++) tf(win, P(0, z1), pts[i], pts[i + 1], n)
}

/** Window rows (sill, head) above y = 0; the first floor stands about 3.3 m up. */
const ROWS: [number, number][] = [[3.6, 6.9], [8.2, 11.5], [12.8, 16.1], [17.3, 20.3]]

/** Ground (lidar, less 51.7 m) under a point: bilinear between the corners. */
function ground(x: number, y: number) {
  const u = Math.min(1, Math.max(0, (x + 85) / 148)), v = Math.min(1, Math.max(0, (y + 47.5) / 122.5))
  return (1 - v) * ((1 - u) * 0 + u * 2.7) + v * ((1 - u) * 6.5 + u * 4.2)
}

/** Bays of windows along a stretch of a face; rows below `zmin` or under the ground there are skipped. */
function bays(win: Part, frame: Part, side: Side, at: number, a0: number, a1: number, o: { zmin?: number; zmax?: number; pitch?: number; skip?: (c: number) => boolean } = {}) {
  const n = Math.max(1, Math.round((a1 - a0) / (o.pitch ?? 4.6))), step = (a1 - a0) / n
  const ns = side === 'n' || side === 's'
  for (let i = 0; i < n; i++) {
    const c = a0 + step * (i + 0.5)
    if (o.skip?.(c)) continue
    const g = ns ? ground(c, at) : ground(at, c)
    for (const [z0, z1] of ROWS) {
      if (z0 < (o.zmin ?? 0) || z0 < g + 0.6 || z1 > (o.zmax ?? 99)) continue
      segWindow(win, side, at, c, 2.6, z0, z1, 0.35, 0.05, frame)
    }
    // the half-sunk basement's low windows, where the ground falls away enough to show them
    if ((o.zmin ?? 0) === 0 && g < 0.5) panel(win, side, at, c - 1.1, c + 1.1, g + 0.7, 2.7, 0.05)
  }
}

function build() {
  const brick = new Part(), trim = new Part(), roof = new Part(), win = new Part(), glass = new Part(), dome = new Part()

  /** A flat-roofed block: brick walls to a pale coping. */
  const blockAt = (r: Rect, top: number) => {
    cbox(brick, r, 0, top - 0.7, { top: false })
    cbox(trim, grow(r, 0.2), top - 0.7, top, { b: 0.18, bottom: true, top: roof })
  }

  // ---- Massing (plan: OSM; tops: lidar).
  const A1 = rect(-85, -7, -47.5, -8.5) // the front mill block, west part (deeper)
  const A2 = rect(-7, 63, -47.5, -15.8) // the front block, east part
  const B = rect(-7, 34.4, -15.8, 75) // the north wing
  const C = rect(-38, -7, 30, 49.4) // the west block
  const C2 = rect(-38, -7, -8.5, 30) // the atrium wing between
  const T = rect(34.4, 45.5, 35.3, 48.7) // the stair tower
  const E = rect(34.4, 64, -15.8, 27.6) // the low east wing
  const E2 = rect(55, 64, -15.8, 23.3)
  blockAt(A1, 21.9)
  blockAt(A2, 21.9)
  blockAt(B, 21.8)
  blockAt(C, 20.35)
  blockAt(C2, 10.65)
  blockAt(T, 22.9)
  blockAt(E, 8.6)
  blockAt(E2, 11.5)

  // the atrium's skylight, a lean-to of glass against the north wing's west wall
  {
    const x0 = -13, x1 = -7, y0 = -8.5, y1 = 30, z0 = 10.65, z1 = 16.2
    qf(glass, [x0, y0, z0], [x1, y0, z1], [x1, y1, z1], [x0, y1, z0], [-0.7, 0, 0.7])
    tf(brick, [x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [0, -1, 0])
    tf(brick, [x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [0, 1, 0])
  }

  // ---- The entrance pavilion on the front: a glazed box under a white canopy, 7 m tall.
  {
    const r = rect(-16, -6, -51.6, -47.5)
    cbox(trim, r, 0, 7.0, { b: 0.15, top: roof })
    panel(win, 's', r.y0, r.x0 + 0.5, r.x1 - 0.5, 0.6, 6.2, 0.05)
    panel(win, 'e', r.x1, r.y0 + 0.4, r.y1 - 0.1, 0.6, 6.2, 0.05)
    panel(win, 'w', r.x0, r.y0 + 0.4, r.y1 - 0.1, 0.6, 6.2, 0.05)
    // the canopy reaching out over the steps
    cbox(trim, rect(-20, -2, -56, -51.6), 7.0, 7.5, { bottom: true })
    for (const x of [-19.5, -2.5]) cbox(trim, rect(x - 0.2, x + 0.2, -55.8, -55.4), 0, 7.0, { top: false })
    // the glazed bay above it in the mill front
    panel(win, 's', -47.5, -15, -7, 8.0, 16.3, 0.05)
  }

  // ---- Windows: one segmental-headed light per 4.6 m bay, four rows.
  const entrance = (c: number) => c > -16.5 && c < -5.5
  bays(win, trim, 's', -47.5, -84, 62, { skip: entrance })
  bays(win, trim, 'w', -85, -47, -9)
  bays(win, trim, 'n', -8.5, -84, -38)
  bays(win, trim, 'e', 63, -47, -16.3)
  bays(win, trim, 'n', -15.8, 35, 62.5, { zmin: 12 })
  bays(win, trim, 'n', 75, -6.5, 34)
  bays(win, trim, 'w', -7, 49.9, 74.5)
  bays(win, trim, 'w', -7, -8, 29.5, { zmin: 17 })
  bays(win, trim, 'e', 34.4, 49.2, 74.5)
  bays(win, trim, 'e', 34.4, 27.9, 35)
  bays(win, trim, 'w', -38, 30.5, 49)
  bays(win, trim, 'n', 49.4, -37.5, -7.5)
  bays(win, trim, 's', 30, -37.5, -13.5, { zmin: 12 })
  bays(win, trim, 'w', -38, -8, 29.5, { zmax: 10 })
  bays(win, trim, 'e', 64, -15.3, 23, { zmax: 10 })
  bays(win, trim, 'n', 27.6, 35, 54.5, { zmax: 8 })
  bays(win, trim, 'n', 48.7, 35, 45)
  bays(win, trim, 'e', 45.5, 35.6, 48.4)

  // a white mechanical penthouse on the roof's east end (photo; lidar 25.5–26 m)
  cbox(trim, rect(40, 50, -28, -20), 21.9, 25.6, { b: 0.1 })

  // ---- The Boeing Observatory's telescope dome on the front block's roof.
  {
    const cx = -8.9, cy = -41.3, z = 21.9, R = 3.8
    cbox(trim, rect(cx - 4.6, cx + 4.6, cy - 4.6, cy + 4.6), z, z + 0.5, { c: 1.4, top: true })
    const prof: [number, number][] = []
    for (let k = 0; k <= 6; k++) { const t = (k / 6) * (Math.PI / 2); prof.push([R * Math.cos(t), z + 0.5 + R * Math.sin(t)]) }
    prof[prof.length - 1][0] = 0
    lathe(dome, cx, cy, prof, 16, false)
    // the shutter slot, a darker band over the top
    qf(win, [cx - 0.6, cy - R * 0.55, z + 0.5 + R * 0.84 + 0.04], [cx + 0.6, cy - R * 0.55, z + 0.5 + R * 0.84 + 0.04],
      [cx + 0.6, cy - R * 0.95, z + 0.5 + R * 0.31 + 0.04], [cx - 0.6, cy - R * 0.95, z + 0.5 + R * 0.31 + 0.04], [0, -0.6, 0.8])
  }

  return [
    { part: brick, material: BRICK },
    { part: trim, material: PALETTE.trim },
    { part: roof, material: ROOF },
    { part: win, material: PALETTE.window },
    { part: glass, material: PALETTE.glass },
    { part: dome, material: DOME },
  ]
}

if (import.meta.main) {
  await saveModel('cola-sc-state-museum', 'South Carolina State Museum', build(), { source: 'generators/cola-sc-state-museum.ts' }, 5000)
}
