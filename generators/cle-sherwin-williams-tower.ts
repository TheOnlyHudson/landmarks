/**
 * Sherwin-Williams Headquarters Tower (2022-2025, Pickard Chilton), Cleveland:
 * procedural, CC0-1.0.
 * bun generators/cle-sherwin-williams-tower.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, placed at bearing 0. The origin
 * is the OSM outline's area centroid (-81.6963392, 41.4989795). Geometry is
 * laid out in the building's own grid: u runs along bearing 146 (south-east,
 * along W 3rd Street), v along bearing 56 (north-east, toward W 3rd Street).
 *
 * Form: a 36-storey silver-blue glass tower made of two parallel slabs, side
 * by side across the building, with a recessed core spine between them that
 * shows as a slot at both ends. Each slab ends in a skillion top sloping the
 * opposite way: the north-east slab rises to the 188 m summit at its
 * south-east end and falls about 22 m to the north-west; the south-west slab
 * is highest (about 180 m) at its north-west end and falls gently to the
 * south-east. A recessed one-storey band of terraces (floor 14) cuts round
 * one half of each slab, in rotational symmetry: the south-east half of the
 * north-east face and the north-west half of the south-west face. A
 * three-storey glass lobby podium fills the rest of the outline, and a white
 * LED line runs down the centre of both long faces.
 *
 * Sources
 * - OSM (ODbL): outline way/1191713344 (height 188, 36 levels); parts
 *   way/1534268802 (188, skillion), way/1534564253 (166, the spine),
 *   way/1534564254 (188, skillion), all replaced. The outline gives the plan:
 *   its north-east edge (71 m) and north-west end are the tower's own faces;
 *   the OSM parts are drawn shorter (55 m) than the faces the photos show, so
 *   the tower's length follows the outline and the photos, the slab and spine
 *   widths the parts. Relation/16122665 is the campus landuse, not drawn; the
 *   Pavilion way/1191713345 across W 3rd Street is a separate building, not
 *   drawn.
 * - No lidar: the tower is newer than the USGS 3DEP OH_Statewide_Phase1_1_2019
 *   flight. USGS NAIP Plus orthophoto (public domain, 2023, mid-construction)
 *   shows the tower on the outline's north-east part and a low podium deck on
 *   its south-west part.
 * - Published: 616 ft (188 m), 36 storeys, floors 1-3 lobby, floor 14
 *   conference rooms and terraces, the LED line down the centre, the name on
 *   the east and west faces (Wikipedia "Sherwin-Williams Headquarters", citing
 *   CTBUH and Sherwin-Williams' city submissions).
 * - Photos (Wikimedia Commons, evidence, all dated after completion of the
 *   enclosure unless noted):
 *   Geowizical, "Sherwin-Williams HQ August 2025.jpg" (CC BY-SA 4.0, from the
 *     east-north-east: north-east face, both slab tops, the notch, the slot);
 *   Geowizical, "Sherwin Williams HQ 060122024 (Cropped).jpg" (CC BY-SA 4.0,
 *     from Public Square, June 2024);
 *   Cards84664, "Sherwin Williams HQ February 2024.png" (CC BY-SA 4.0, from
 *     Euclid Avenue);
 *   Erik Drost, "Cleveland Skyline 6-2026.jpg" (CC BY 4.0, from the south-west,
 *     near frontal on the south-west face: its gentle skillion and the
 *     north-east slab's steep one rising behind);
 *   Erik Drost, "Cleveland skyline from Edgewater Park, May 2025.jpg" (CC BY
 *     2.0, from the west-south-west: the south-west face's notch);
 *   Cards84664, "Sherwin-Williams Headquarters (September 2023).jpg" and
 *     "(2)" (CC BY-SA 4.0, construction, east and west);
 *   Geowizical, "Sherwin-Williams construction 2023.jpg" and Cards84664,
 *     "Sherwin Williams HQ, August 2023.png" (CC BY-SA 4.0, the lobby podium).
 * Estimated: the face length (71 m: 47 curtain-wall modules of about 1.5 m and
 *   15.8 storeys counted across the south-west face in the 2026 photo, which
 *   agrees with the outline); the depth (35 m, from the width ratios of the
 *   faces in the east and west photos); the skillion heights (north-east slab
 *   188 to 166 m, south-west slab 180 to 174 m, scaled from the 2026 and
 *   August 2025 photos); the notch band (63-70 m, from the June 2024 and
 *   Edgewater photos and the floor-14 terraces); the podium height (16 m,
 *   three lobby storeys, from the 2023 photos); the storey height (4.3 m).
 * Colours: reflective silver-blue glass in daylight, drawn as a light
 *   sky-grey window colour with pale silver mullion and floor lines.
 * Left out: the SHERWIN-WILLIAMS letters, the skybridges, rooftop screens,
 *   the columns in the terrace notch.
 * Doubts: no photo from straight north-west or south-east; the south-west
 *   slab's exact depth and the podium's height on its south-west side; the
 *   south-west slab's south-east end may sit 6 m further out (the outline's
 *   jog), drawn flush with the north-east slab.
 * Night: office glass glows (window, window-2); the LED line glows white
 *   (neon); roofs stay dark.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { type XY, ccw, capRing, outward, finishGlb } from './sea-columbia-center'
import { wallQuad, panels, type Grid, writeModel } from './cle-200-public-square'

const D = Math.PI / 180
const EV: XY = [Math.sin(56 * D), Math.cos(56 * D)] // +v, north-east
const EU: XY = [Math.sin(146 * D), Math.cos(146 * D)] // +u, south-east
/** (v, u) in the building's grid → east/north about the anchor */
const P = (v: number, u: number): XY => [v * EV[0] + u * EU[0], v * EV[1] + u * EU[1]]

// ---------------------------------------------------------------- plan (v, u), from the OSM outline about its centroid
const NW = -37.3, SE = 33.85 // the tower's ends
const V_NE = 33, V_SP1 = 18.2, V_SP0 = 13.8, V_SW = -2 // slab and spine faces
const POD = 16 // lobby podium top
const N0 = 63, N1 = 70 // floor-14 terrace notch
const NOTCH = 2.6 // its recess
const STOREY = 4.3

const glassP = new Part(), frame = new Part(), dark = new Part(), roof = new Part(), led = new Part()

const towerGrid: Grid = { bay: 4.4, pier: 0.5, group: 3 * STOREY, spandrel: 0.8, from: POD, edge: 0.5, head: 1.2, foot: 0.4 }

/** A wall over a→b (ccw) from z0 to a top that runs linearly from za (at a) to zb (at b), with glass panels. */
function slopedWall(a: XY, b: XY, z0: number, za: number, zb: number, grid: Grid | null, wall = frame, win = glassP) {
  const zl = Math.min(za, zb)
  if (zl > z0) wallQuad(wall, a, b, z0, zl)
  if (Math.abs(za - zb) > 0.01) {
    // the triangle above the lower end
    if (za > zb) wall.tri([a[0], a[1], zl], [b[0], b[1], zl], [a[0], a[1], za])
    else wall.tri([a[0], a[1], zl], [b[0], b[1], zl], [b[0], b[1], zb])
  }
  if (!grid) return
  // panels bay by bay, each up to the top over it
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), edge = grid.edge ?? 0.5
  const n = Math.max(1, Math.round((L - 2 * edge + grid.pier) / (grid.bay + grid.pier)))
  const w = (L - 2 * edge + grid.pier) / n
  for (let k = 0; k < n; k++) {
    const s0 = edge + k * w, s1 = s0 + w - grid.pier
    const t0 = s0 / L, t1 = s1 / L
    const top = Math.min(za + (zb - za) * t0, za + (zb - za) * t1)
    const A: XY = [a[0] + (b[0] - a[0]) * t0, a[1] + (b[1] - a[1]) * t0]
    const B: XY = [a[0] + (b[0] - a[0]) * t1, a[1] + (b[1] - a[1]) * t1]
    panels(win, A, B, z0, top, { ...grid, bay: s1 - s0, edge: 0, pier: 0 })
  }
}

/**
 * One slab: rectangle v0..v1 × u0..u1, its top a skillion from zNW (u0) to
 * zSE (u1). `notch` names the half and faces of the terrace band; `z0s`
 * gives each face's foot (NE, SE, SW, NW).
 */
function slab(v0: number, v1: number, u0: number, u1: number, zNW: number, zSE: number, notch: null | 'ne-se' | 'sw-nw', z0s: [number, number, number, number], ledAt?: 'ne' | 'sw') {
  const z = (u: number) => zNW + ((u - u0) / (u1 - u0)) * (zSE - zNW)
  const um = (u0 + u1) / 2
  // corners counter-clockwise from above: in (v,u) with v east-ish, u south-ish, ccw in map is NE-face→...; build and let ccw() order it
  const face = (pa: [number, number], pb: [number, number], z0: number, lo: number, hi: number | null) => {
    // pa→pb in (v,u); draws from z0 up to the top, or to `hi` if given (a band piece)
    const a = P(...pa), b = P(...pb)
    const ta = hi ?? z(pa[1]), tb = hi ?? z(pb[1])
    if (hi !== null) { wallQuad(lo === N0 ? dark : frame, a, b, lo, hi); return }
    slopedWall(a, b, Math.max(z0, lo), ta, tb, towerGrid)
  }
  // each face as a list of [from,to] in (v,u), going ccw round the slab seen from above (map frame):
  // in map terms +v is NE and +u is SE, so ccw (NE face → NW end → SW face → SE end) is: NE face from SE to NW…
  const ne: [[number, number], [number, number]] = [[v1, u1], [v1, u0]]
  const nw: [[number, number], [number, number]] = [[v1, u0], [v0, u0]]
  const sw: [[number, number], [number, number]] = [[v0, u0], [v0, u1]]
  const se: [[number, number], [number, number]] = [[v0, u1], [v1, u1]]
  const ring = (vA: number, vB: number, uA: number, uB: number): XY[] => ccw([P(vB, uB), P(vB, uA), P(vA, uA), P(vA, uB)])
  if (!notch) {
    for (const [f, z0] of [[ne, z0s[0]], [se, z0s[1]], [sw, z0s[2]], [nw, z0s[3]]] as const) face(f[0], f[1], z0, 0, null)
  } else {
    // below the notch, the notch band, above it
    const n = NOTCH
    const bandRing = notch === 'ne-se'
      ? ccw([P(v1, u0), P(v0, u0), P(v0, u1 - n), P(v1 - n, u1 - n), P(v1 - n, um), P(v1, um)])
      : ccw([P(v1, u1), P(v1, u0 + n), P(v0 + n, u0 + n), P(v0 + n, um), P(v0, um), P(v0, u1)])
    for (const [f, z0] of [[ne, z0s[0]], [se, z0s[1]], [sw, z0s[2]], [nw, z0s[3]]] as const) {
      const a = P(...f[0]), b = P(...f[1])
      wallQuad(frame, a, b, z0, N0)
      panels(glassP, a, b, z0, N0, { ...towerGrid, head: 0.4 })
      slopedWall(a, b, N1, z(f[0][1]), z(f[1][1]), { ...towerGrid, from: N1 })
    }
    const outer = ring(v0, v1, u0, u1)
    const onOuter = (q: XY) => outer.some((o, k) => {
      const p2 = outer[(k + 1) % outer.length], L = Math.hypot(p2[0] - o[0], p2[1] - o[1])
      const cr = ((p2[0] - o[0]) * (q[1] - o[1]) - (p2[1] - o[1]) * (q[0] - o[0])) / L
      return Math.abs(cr) < 0.05
    })
    for (let i = 0; i < bandRing.length; i++) {
      const a = bandRing[i], b = bandRing[(i + 1) % bandRing.length]
      const m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
      if (onOuter(m)) { wallQuad(frame, a, b, N0, N1); panels(glassP, a, b, N0, N1, { ...towerGrid, from: N0, group: N1 - N0, spandrel: 0.6, foot: 0, head: 0 }) }
      else wallQuad(dark, a, b, N0, N1)
    }
    const full = ring(v0, v1, u0, u1)
    capRing(frame, full, N0) // the terrace floor
    capRing(frame, full, N1, false) // the soffit over it
  }
  // the sloped roof
  const r: [number, number][] = [[v1, u1], [v1, u0], [v0, u0], [v0, u1]]
  const pts = r.map(([v, u]) => [...P(v, u), z(u)] as V3)
  const c = ccw(r.map(([v, u]) => P(v, u)))
  const ordered = c.map((q) => pts.find((p) => Math.abs(p[0] - q[0]) < 1e-6 && Math.abs(p[1] - q[1]) < 1e-6)!)
  roof.quad(ordered[0], ordered[1], ordered[2], ordered[3])
  // the LED line down the middle of the long face
  if (ledAt) {
    const vv = ledAt === 'ne' ? v1 : v0, sgn = ledAt === 'ne' ? 1 : -1
    const a = P(vv + sgn * 0.09, um - 0.5), b = P(vv + sgn * 0.09, um + 0.5)
    const [A, B] = sgn > 0 ? [b, a] : [a, b]
    led.quad([A[0], A[1], POD], [B[0], B[1], POD], [B[0], B[1], z(um) - 0.6], [A[0], A[1], z(um) - 0.6])
  }
}

function build() {
  // ------------------------------------------------------------ the lobby podium: the OSM outline, about its centroid
  const outline: [number, number][] = [
    [32.8, -37.2], [V_SP1, -37.25], [V_SP0, -37.25], [V_SW, -37.3], [-33.0, -37.4], [-32.9, 18.5], [-28.4, 18.55], [-28.4, 40.05],
    [14.1, 40.2], [14.1, 33.8], [V_SP1, 33.82], [33.0, 33.85], [33.0, 28.8], [32.9, 0.17],
  ]
  const ring = ccw(outline.map(([v, u]) => P(v, u)))
  const podGrid: Grid = { bay: 3.2, pier: 0.6, group: 5.3, spandrel: 0.9, from: 0, edge: 0.8, head: 1.6, foot: 0.4 }
  // podium faces flush with the tower are the tower's own; skip them
  const onTower = (m: XY) => {
    // back to (v,u)
    const v = m[0] * EV[0] + m[1] * EV[1], u = m[0] * EU[0] + m[1] * EU[1]
    const spine = v > V_SP0 && v < V_SP1
    return (Math.abs(v - V_NE) < 0.6) || (Math.abs(u - NW) < 0.6 && v > V_SW - 0.1 && !spine) || (Math.abs(u - SE) < 0.6 && v > V_SP1 - 0.1)
  }
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    if (onTower([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2])) continue
    wallQuad(frame, a, b, 0, POD)
    panels(dark, a, b, 0, POD, podGrid)
  }
  capRing(roof, ring, POD)

  // ------------------------------------------------------------ the tower
  // north-east slab: summit at its south-east end, notch on the south-east half of the NE face
  slab(V_SP1, V_NE, NW, SE, 166, 188, 'ne-se', [0, 0, 0, 0], 'ne')
  // the spine between the slabs, set back 2 m from both ends
  slab(V_SP0, V_SP1, NW + 2, SE - 2, 166, 166, null, [0, POD, 0, POD])
  // south-west slab: highest at its north-west end, notch on the north-west half of the SW face
  slab(V_SW, V_SP0, NW, SE, 180, 174, 'sw-nw', [0, POD, POD, 0], 'sw')

  return finishGlb('cle-sherwin-williams-tower', 'Sherwin-Williams Headquarters Tower', [
    { part: glassP, material: windowVariant(2, 0x9bb5cc) },
    { part: frame, material: finish('sw-mullion', 0xcdd6de) },
    { part: dark, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: led, material: finish('neon-led', 0xf3f5f7) },
  ], { bearing: 0, height: 188, replaces: ['way/1191713344', 'way/1534268802', 'way/1534564253', 'way/1534564254'] }, 6500)
}

if (import.meta.main) await writeModel('cle-sherwin-williams-tower', build())
