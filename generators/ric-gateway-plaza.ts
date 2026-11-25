/**
 * Gateway Plaza (800 East Canal Street, 2016), Richmond, Virginia —
 * original procedural geometry, CC0-1.0.
 * bun generators/ric-gateway-plaza.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/307599476,
 * 37.537202,-77.438041. Its sides run at 36.8° / 126.8°, so the catalog
 * bearing is 36.8 (+y = 36.8°, up 9th Street; +x = 126.8°).
 *
 * Identity, in order: a dark blue-grey glass slab on the south-east, ribbed
 * with vertical fins that run on past the roof as an open screen crown;
 * against its north-west side a smooth, lighter glass slice a storey lower
 * and set back from both ends; the glazed ground storey set back behind
 * columns; the silver panel-clad parking block (podium) on the north-west.
 *
 * Rework after review (2026-11): the single pale box is split into the two
 * volumes seen in gw1/gw2 (gw1, from the east: the finned slab's end is
 * ~45% of the north-east end, the lighter slice the rest, set back and
 * lower; gw2, from the south-east: the slice beyond the finned corner; the
 * slice's south-west end also shows at the far left of gw1). The slab glass
 * is darker (#5a6b7d, the darkest of Richmond's towers), the slice light
 * (#9fb3c4). Fins drawn every 4.2 m as thin silver lines (real ~1.5 m) so
 * they read as a mullion rhythm, not stripes. Slice roof 72 m (estimated:
 * one storey under the slab roof in gw1); slab/slice split at x = 13.5
 * (estimated from gw1); 2 m end set-backs (estimated).
 *
 * Evidence:
 *  - plan: OSM outline way/307599476 (building=commercial) and the tower
 *    part way/466009778 (building:part, 19 levels, height 73.24), a 36 ×
 *    64.5 m slab on the south-east two-thirds of the outline. The rest of the
 *    outline is the garage. Turned into this frame.
 *  - heights: not in the lidar (USGS_LPC_VA_Sandy_2014_LAS_2015, flown about
 *    2014, before construction). Published: 276 ft / 84.1 m, 18 floors
 *    (Wikipedia, List of tallest buildings in Richmond), taken as the top of
 *    the fin screen; OSM's 73.2 m roof is raised to 76 m so the screen is
 *    ~8 m, as in APK's elevated photo (screen ≈ two storeys). Lobby ~6 m;
 *    garage 23 m, photo-scaled against the tower's floors.
 *  - colours: the slab glass reads dark blue-grey in gw1 and deep blue in
 *    gw2, pulled to palette lightness; the slice reflects light; fins and
 *    garage panels silver-grey (one finish).
 *  - ground: the site is flat (Mapterhorn varies ~1 m).
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 *  - Gateway_Plaza_(Richmond,_Virginia).jpg, APK, CC BY 4.0 (elevated, from
 *    the north). https://commons.wikimedia.org/wiki/File:Gateway_Plaza_(Richmond,_Virginia).jpg
 *  - Gateway_Plaza_(Towne_Bank_building)_in_Richmond,_Virginia.jpg, Bdl2001,
 *    CC BY 4.0 (street level, from the south).
 *    https://commons.wikimedia.org/wiki/File:Gateway_Plaza_(Towne_Bank_building)_in_Richmond,_Virginia.jpg
 * No look-only sources. No commercial imagery.
 *
 * Left out: the TowneBank sign, rooftop plant behind the screen, the
 * garage's patterned perforations.
 * Doubts: the south-west end is not photographed close; drawn like the
 * north-east end. The screen height, garage height, slice depth and height
 * are photo estimates. In gw1 the slab's north-east end below the screen
 * reads as smooth glass rather than finned; it is drawn finned.
 */
import { Part } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { type XY, walls, cap, panel, save, rect, block, inset } from './chi-aon-center'

const TOWER: XY[] = [[-6.2, -32.1], [30.1, -31.3], [29.9, 32.2], [-6.5, 32.4]]
const GARAGE: XY[] = [[-30.3, -33.0], [-6.2, -32.1], [-6.5, 32.4], [-29.2, 32.1]]
// The tower drawn square to the frame (OSM's sides are within 0.4 m of it).
const X0 = -6.3, X1 = 30.0, Y0 = -31.7, Y1 = 32.3
// The finned slab on the south-east, the smooth lighter slice on the
// north-west (gw1: the slab's end ~45%, the slice ~55% of the north-east end).
const XS = 13.5, SET = 2.0

function build() {
  const glass = new Part(), light = new Part(), silver = new Part(), roof = new Part(), dark = new Part()
  const LOBBY = 6.0, ROOF = 76.0, SLICE = 72.0, SCREEN = 84.1, GAR = 23.0

  // --- Garage block (the podium), silver panels, dark vehicle entries.
  walls(silver, GARAGE, 0, GAR)
  cap(roof, GARAGE, GAR)
  for (const [a, b] of [[GARAGE[0], GARAGE[1]], [GARAGE[2], GARAGE[3]], [GARAGE[3], GARAGE[0]]] as [XY, XY][]) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    panel(dark, a, b, L * 0.3, L * 0.3 + 7.0, 0, 4.2, 0.05) // vehicle entry
    // a pale band at the deck top, as in gw1
    panel(silver, a, b, 0, L, GAR - 1.2, GAR, 0.06)
  }

  // --- Lobby: glazed, set back 2 m behind round-ish columns.
  const foot = rect(X0, Y0, X1, Y1)
  const lob = inset(foot, 2.0)
  walls(glass, lob, 0, LOBBY)
  cap(silver, foot, LOBBY, false) // soffit
  for (let i = 0; i < 4; i++) {
    const a = foot[i], b = foot[(i + 1) % 4], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (i === 3) continue // against the garage
    const n = Math.round(L / 8.5)
    for (let k = 0; k <= n; k++) {
      const s = 0.9 + (k * (L - 1.8)) / n, u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nn: XY = [u[1], -u[0]]
      const c: XY = [a[0] + u[0] * s - nn[0] * 0.9, a[1] + u[1] * s - nn[1] * 0.9]
      walls(silver, rect(c[0] - 0.4, c[1] - 0.4, c[0] + 0.4, c[1] + 0.4), 0, LOBBY)
    }
    panel(silver, a, b, 0, L, LOBBY, LOBBY + 1.0, 0.06) // pale band at the lobby head
  }

  // --- The smooth, lighter slice on the north-west, set back from both
  // ends and a storey lower; it rises over the garage roof.
  const slice = rect(X0, Y0 + SET, XS, Y1 - SET)
  walls(light, slice, LOBBY, SLICE - 1.0)
  block(silver, roof, slice, SLICE - 1.0, SLICE, 0.3)
  // a few floor lines so it reads as glass, not a box
  for (const [a, b] of [[slice[0], slice[1]], [slice[2], slice[3]], [slice[3], slice[0]]] as [XY, XY][]) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    for (let z = LOBBY + 16; z < SLICE - 6; z += 16) panel(silver, a, b, 0, L, z, z + 0.45, 0.05)
  }
  // the slice's end faces between the slab and the set-back
  // (already drawn by walls; the strip of the slab's NW face above the slice
  // shows the slab's darker glass)

  // --- The finned slab on the south-east, darker glass.
  const slab = rect(XS, Y0, X1, Y1)
  walls(glass, slab, LOBBY, ROOF)
  cap(roof, slab, ROOF - 0.2)

  // Fins: a few pale vertical lines on the slab's three outer faces and the
  // part of its north-west face above the slice, running past the roof as
  // the screen crown.
  const PITCH = 4.2, DEPTH = 0.5, W = 0.35
  const faces: [XY, XY, number][] = [
    [slab[0], slab[1], LOBBY + 1.0], // south-west end
    [slab[1], slab[2], LOBBY + 1.0], // south-east long face
    [slab[2], slab[3], LOBBY + 1.0], // north-east end
    [slab[3], slab[0], SLICE], // north-west, above the slice
  ]
  for (const [a, b, bot] of faces) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nn: XY = [u[1], -u[0]]
    const n = Math.round(L / PITCH)
    for (let k = 0; k <= n; k++) {
      const s = W / 2 + (k * (L - W)) / n
      const c: XY = [a[0] + u[0] * s, a[1] + u[1] * s]
      const f: XY[] = [
        [c[0] - u[0] * W / 2, c[1] - u[1] * W / 2],
        [c[0] - u[0] * W / 2 + nn[0] * DEPTH, c[1] - u[1] * W / 2 + nn[1] * DEPTH],
        [c[0] + u[0] * W / 2 + nn[0] * DEPTH, c[1] + u[1] * W / 2 + nn[1] * DEPTH],
        [c[0] + u[0] * W / 2, c[1] + u[1] * W / 2],
      ]
      for (let e = 0; e < 3; e++) {
        const p = f[e], q = f[e + 1]
        silver.quad([p[0], p[1], bot], [q[0], q[1], bot], [q[0], q[1], SCREEN], [p[0], p[1], SCREEN])
      }
      cap(silver, f, SCREEN)
    }
    // the screen's inner face, seen through the fins
    panel(roof, b, a, 0, L, ROOF - 0.2, SCREEN - 0.6, 0.05)
  }
  // Top rail of the screen.
  block(silver, null, inset(slab, -0.5), SCREEN - 0.5, SCREEN, 0)
  void TOWER

  return [
    { part: glass, material: windowVariant(2, 0x5a6b7d) },
    { part: light, material: windowVariant(3, 0x9fb3c4) },
    { part: silver, material: finish('gw-silver', 0xd3d6d8) },
    { part: roof, material: PALETTE.roof },
    { part: dark, material: finish('gw-shadow', 0x5e636a) },
  ]
}

if (import.meta.main) await save('ric-gateway-plaza', 'Gateway Plaza', [37.537202, -77.438041], 36.8, build())
