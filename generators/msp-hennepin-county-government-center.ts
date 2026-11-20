/**
 * Hennepin County Government Center (1974-77, John Carl Warnecke &
 * Associates), Minneapolis — original procedural geometry, CC0-1.0.
 * bun generators/msp-hennepin-county-government-center.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, turned to the downtown street
 * grid (placement bearing 30.5°: the model's +y runs along 3rd/4th Avenue
 * South toward City Hall). Origin at the anchor, the area centroid of the
 * OSM outline way/27518018 (-93.2666104, 44.9758171), on the lowest ground
 * under it (~258.0 m NAVD88).
 *
 * Form: two 24-storey slabs of pink-brown granite, 31.7 and 32.5 m wide and
 * 66 m long, side by side 7.5 m apart. The gap between them is a full-height
 * atrium glazed at both ends with a lattice of bronze-coloured X braces; the
 * glazed ends are set back 6.5-7 m from the slab ends, so each end shows a
 * slot between two blank granite walls. The long east and west faces carry
 * ribbon windows; the ends are blank. South 6th Street passes through the
 * building in a ~5.5 m high building passage across the middle.
 *
 * Sources
 * - OSM: outline way/27518018 (height 123, 24 levels); building:part
 *   way/1512791636 (the 26 m band over 6th Street, building:min_level 1);
 *   South 6th Street way/147499348 (tunnel=building_passage).
 * - Lidar (measured, USGS 3DEP MN_CentralMissRiver_4_B22, flown 2022, class
 *   18 kept; heights above 258.0 m): slab roofs 120-121 m, mechanical
 *   penthouses to ~124 (west x -28..-20, east x 8..20, y -24..24), atrium
 *   roof 113-114, the open end slots down to a ~6 m lobby roof. The slab
 *   edges match the OSM outline to within a metre.
 * - Photos (Wikimedia Commons, all evidence):
 *   McGhiever, "Hennepin County Government Center 2018.jpg", CC BY-SA 4.0
 *     (from the north-west): both slabs, the end slot and its X lattice,
 *     ribbon windows on the long face.
 *     https://commons.wikimedia.org/wiki/File:Hennepin_County_Government_Center_2018.jpg
 *   Michael Barera, "Minneapolis April 2025 12 (Hennepin County Government
 *     Center).jpg", CC BY-SA 4.0 (end-on from the plaza): blank ends, slot,
 *     lobby at the base.
 *     https://commons.wikimedia.org/wiki/File:Minneapolis_April_2025_12_(Hennepin_County_Government_Center).jpg
 *   AlexiusHoratius, "Hennepin County Government Center 5.jpg", CC BY-SA 3.0
 *     (from the north-east). https://commons.wikimedia.org/wiki/File:Hennepin_County_Government_Center_5.jpg
 *   Tony Webster, "Hennepin County Government Center, Minneapolis
 *     (23358338505).jpg", CC BY-SA 2.0: the 6th Street passage and its fascia.
 *     https://commons.wikimedia.org/wiki/File:Hennepin_County_Government_Center,_Minneapolis_(23358338505).jpg
 *   Joe Passe, "Hennepin County Government Center" (Flickr 15652959561),
 *     CC BY-SA 2.0: the slot's glazing and braces.
 *     https://www.flickr.com/photos/98623843@N05/15652959561
 *
 * Estimated: passage height (5.5 m, from Webster's photo against a car),
 * the ribbon windows drawn two floors to a panel, the X braces (one X per
 * ~14 m, from Passe's photo), the bevel where the slot widens at the top.
 * Colours: granite from the sunlit McGhiever photo, pulled light; the slot's
 * glass is dark grey-green with bronze braces.
 *
 * Night: the ribbon windows and the lobby glazing glow; the atrium glass
 * stays dark.
 *
 * Doubts: the plaza, fountain, skyways and the low south-side structures
 * are left to the map; the passage's exact width is OSM's part (26 m).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, finishGlb } from './sea-rainier-square-tower'

const W = { x0: -41.2, x1: -9.5 }, E = { x0: -2.0, x1: 30.5 }
const Y0 = -32.8, Y1 = 33.6
const AY0 = -26.0, AY1 = 26.8 // atrium glazing set back from the slab ends
const Z = { top: 120.5, atrium: 113.7, pass: 5.5, lobby: 6, pent: 123 }
const PY = 12.6 // half width of the 6th Street passage

/** A box with all six faces (or without the bottom). */
function box(part: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, bottom = false, skip: string[] = []) {
  const P = (x: number, y: number, z: number): V3 => [x, y, z]
  if (!skip.includes('s')) part.quad(P(x0, y0, z0), P(x1, y0, z0), P(x1, y0, z1), P(x0, y0, z1))
  if (!skip.includes('e')) part.quad(P(x1, y0, z0), P(x1, y1, z0), P(x1, y1, z1), P(x1, y0, z1))
  if (!skip.includes('n')) part.quad(P(x1, y1, z0), P(x0, y1, z0), P(x0, y1, z1), P(x1, y1, z1))
  if (!skip.includes('w')) part.quad(P(x0, y1, z0), P(x0, y0, z0), P(x0, y0, z1), P(x0, y1, z1))
  if (!skip.includes('t')) part.quad(P(x0, y0, z1), P(x1, y0, z1), P(x1, y1, z1), P(x0, y1, z1))
  if (bottom) part.quad(P(x0, y1, z0), P(x1, y1, z0), P(x1, y0, z0), P(x0, y0, z0))
}

/**
 * A slab: a prism along y whose cross-section (x, z) is a rectangle with a
 * small chamfer on the outer corners and a 45° bevel on the top inner edge
 * (toward the atrium). `inner` is +1 if the atrium is on the +x side.
 */
function slab(stone: Part, x0: number, x1: number, inner: 1 | -1, z0: number, z1: number) {
  const c = 0.5, b = 4.5
  // profile, counter-clockwise seen from -y (x right, z up)
  const prof: [number, number][] = inner > 0
    ? [[x0, z0], [x1, z0], [x1, z1 - b], [x1 - b, z1], [x0 + c, z1], [x0, z1 - c]]
    : [[x0, z0], [x1, z0], [x1, z1 - c], [x1 - c, z1], [x0 + b, z1], [x0, z1 - b]]
  // the outer vertical edges chamfered in plan too
  for (let i = 0; i < prof.length; i++) {
    const [ax, az] = prof[i], [bx, bz] = prof[(i + 1) % prof.length]
    if (az === z0 && bz === z0) continue // bottom: drawn below
    stone.quad([ax, Y1, az], [bx, Y1, bz], [bx, Y0, bz], [ax, Y0, az])
  }
  // end faces (y = Y0 facing -y, y = Y1 facing +y): fan over the convex profile
  for (let i = 1; i < prof.length - 1; i++) {
    const p0 = prof[0], p1 = prof[i], p2 = prof[i + 1]
    stone.tri([p0[0], Y0, p0[1]], [p1[0], Y0, p1[1]], [p2[0], Y0, p2[1]])
    stone.tri([p0[0], Y1, p0[1]], [p2[0], Y1, p2[1]], [p1[0], Y1, p1[1]])
  }
  // the soffit over the passage and the underside elsewhere is hidden by the
  // lower blocks; draw only the soffit
  stone.quad([x0, PY, z0], [x1, PY, z0], [x1, -PY, z0], [x0, -PY, z0])
}

function build() {
  const granite = new Part(), win = new Part(), glass = new Part(), brace = new Part(), roof = new Part()

  // ---------------------------------------------------------------- slabs
  for (const [S, inner] of [[W, 1], [E, -1]] as [{ x0: number; x1: number }, 1 | -1][]) {
    slab(granite, S.x0, S.x1, inner, Z.pass, Z.top)
    // ground storey either side of the passage
    box(granite, S.x0, Y0, S.x1, -PY, 0, Z.pass, false, ['t'])
    box(granite, S.x0, PY, S.x1, Y1, 0, Z.pass, false, ['t'])
    // penthouse
    const px = inner > 0 ? [-27.5, -20.5] : [9, 18]
    box(roof, px[0], -24, px[1], 24, Z.top - 0.5, Z.pent)
  }

  // ---------------------------------------------------------------- atrium
  const AX0 = W.x1, AX1 = E.x0
  // glazed ends, from the lobby roof up to the atrium roof
  glass.quad([AX0, AY0, Z.lobby], [AX1, AY0, Z.lobby], [AX1, AY0, Z.atrium], [AX0, AY0, Z.atrium])
  glass.quad([AX1, AY1, Z.lobby], [AX0, AY1, Z.lobby], [AX0, AY1, Z.atrium], [AX1, AY1, Z.atrium])
  glass.quad([AX0, AY0, Z.atrium], [AX1, AY0, Z.atrium], [AX1, AY1, Z.atrium], [AX0, AY1, Z.atrium])
  // the X lattice on each glazed end: diagonal bars corner to corner of
  // ~14 m modules, both ways, set just proud of the glass
  const NM = 10, mod = (Z.atrium - Z.lobby) / NM
  for (const [y, s] of [[AY0, -1], [AY1, 1]] as [number, number][]) {
    const yy = y + s * 0.08, w = 0.9
    const bar = (x0: number, z0: number, x1: number, z1: number) => {
      const dx = x1 - x0, dz = z1 - z0, L = Math.hypot(dx, dz), nx = (-dz / L) * w / 2, nz = (dx / L) * w / 2
      const q: V3[] = [[x0 - nx, yy, z0 - nz], [x1 - nx, yy, z1 - nz], [x1 + nx, yy, z1 + nz], [x0 + nx, yy, z0 + nz]]
      if (s < 0) brace.quad(q[0], q[1], q[2], q[3]); else brace.quad(q[3], q[2], q[1], q[0])
    }
    for (let k = 0; k < NM; k++) {
      const z0 = Z.lobby + k * mod, z1 = z0 + mod
      bar(AX0 + 0.3, z0, AX1 - 0.3, z1)
      bar(AX1 - 0.3, z0, AX0 + 0.3, z1)
      // a horizontal transom at each module line
      const zt = z1
      const q: V3[] = [[AX0, yy, zt - 0.3], [AX1, yy, zt - 0.3], [AX1, yy, zt + 0.3], [AX0, yy, zt + 0.3]]
      if (s < 0) brace.quad(q[0], q[1], q[2], q[3]); else brace.quad(q[3], q[2], q[1], q[0])
    }
  }
  // lobbies in the end slots: glazed fronts under a granite roof
  for (const [ya, yb] of [[Y0 + 0.8, AY0], [AY1, Y1 - 0.8]]) {
    box(granite, AX0, ya, AX1, yb, Z.lobby - 0.8, Z.lobby, true)
    const yf = ya < 0 ? ya : yb, s = ya < 0 ? -1 : 1
    const q: V3[] = [[AX0, yf + s * 0.06, 0], [AX1, yf + s * 0.06, 0], [AX1, yf + s * 0.06, Z.lobby - 0.8], [AX0, yf + s * 0.06, Z.lobby - 0.8]]
    if (s > 0) win.quad(q[1], q[0], q[3], q[2]); else win.quad(q[0], q[1], q[2], q[3])
  }

  // ---------------------------------------------------------------- ribbon windows
  // long faces only: two floors to a panel, piers every ~6.5 m
  const groups: [number, number][] = []
  for (let z = 9.2; z + 5 < Z.top - 2.5; z += 9.2) groups.push([z, z + 5.4])
  const ribbon = (x: number, nx: number) => {
    const bays = 3, bw = (Y1 - Y0 - 2) / bays
    for (let k = 0; k < bays; k++) {
      const ya = Y0 + 1 + k * bw + 0.6, yb = Y0 + 1 + (k + 1) * bw - 0.6
      for (const [z0, z1] of groups) {
        const xx = x + nx * 0.06
        if (nx > 0) win.quad([xx, ya, z0], [xx, yb, z0], [xx, yb, z1], [xx, ya, z1])
        else win.quad([xx, yb, z0], [xx, ya, z0], [xx, ya, z1], [xx, yb, z1])
      }
    }
  }
  ribbon(W.x0, -1)
  ribbon(E.x1, 1)
  // the passage fascia: a dark band at the mouth on both long faces
  for (const [x, nx] of [[W.x0, -1], [E.x1, 1]] as [number, number][]) {
    const xx = x + nx * 0.06
    if (nx > 0) win.quad([xx, -PY + 1, 6.8], [xx, PY - 1, 6.8], [xx, PY - 1, 8.4], [xx, -PY + 1, 8.4])
    else win.quad([xx, PY - 1, 6.8], [xx, -PY + 1, 6.8], [xx, -PY + 1, 8.4], [xx, PY - 1, 8.4])
  }

  return finishGlb('msp-hennepin-county-government-center', 'Hennepin County Government Center', [
    { part: granite, material: finish('hcgc-granite', 0xb4a49e) },
    { part: win, material: PALETTE.window },
    { part: glass, material: { ...PALETTE.glass, color: 0x5f7177 } },
    { part: brace, material: { ...PALETTE.metal, color: 0xa68a66 } },
    { part: roof, material: PALETTE.roof },
  ], {
    bearing: 30.5, height: Z.pent,
    replaces: ['way/27518018', 'way/1512791636'],
  })
}

if (import.meta.main) {
  const { glb, triangles } = build()
  const out = process.argv[2] ?? new URL('../models/msp-hennepin-county-government-center.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
}
