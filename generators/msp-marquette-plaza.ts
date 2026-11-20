/**
 * Marquette Plaza (former Federal Reserve Bank of Minneapolis, 1968-73,
 * Gunnar Birkerts), Minneapolis — original procedural geometry, CC0-1.0.
 * bun generators/msp-marquette-plaza.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, turned to the downtown street
 * grid (placement bearing 30.5°: the model's +y runs along Marquette and 2nd
 * Avenues). Origin at the anchor, the area centroid of the OSM outline
 * way/45500036 (-93.2676373, 44.9808505), on the lowest ground under it
 * (~256 m NAVD88, the street).
 *
 * Form: a 98 m slab of glass between two solid grey end towers, under a deep
 * solid band at the top that houses the trusses. The office floors hang from
 * two catenary cables, one in each long face, so each long face shows the
 * catenary as a great U from the top corners down to the bottom of the slab:
 * above the curve the glass sits back behind deep vertical fins, below it the
 * glass is flush. The slab is lifted off the plaza on the end towers; the
 * ground storey under it is a recessed glass lobby.
 *
 * Sources
 * - OSM: outline way/45500036 (height 67, 13 levels; no parts).
 * - Lidar (measured, USGS 3DEP MN_CentralMissRiver_4_B22, flown 2022, class
 *   18 kept; heights above 256 m): roof 61-63 m over the whole outline, parts
 *   of the east side 54-55; outline x -10..26, y -50..48 matches OSM.
 * - USGS NAIP (public domain): the plan, a split roof with mechanical plant.
 * - Published: completed 1973, 16 storeys (Wikipedia, "Marquette Plaza");
 *   OSM's 67 m is ~5 m above the lidar roof from the street.
 * - Photos (Wikimedia Commons, all evidence):
 *   Bobak Ha'Eri, "051907-011-MarquettePlaza.jpg", CC BY 3.0 (long face,
 *     head-on): pier and band proportions, the catenary's shape.
 *     https://commons.wikimedia.org/wiki/File:051907-011-MarquettePlaza.jpg
 *   Burt Levy, "Marquette Plaza.jpg", public domain (from the south-west,
 *     1970s): end tower, fins above the curve, flush glass below, open base.
 *     https://commons.wikimedia.org/wiki/File:Marquette_Plaza.jpg
 *   August Schwerdfeger, "Marquette Plaza, Minneapolis 2017-07-29.jpg",
 *     CC BY 4.0 (east face). https://commons.wikimedia.org/wiki/File:Marquette_Plaza,_Minneapolis_2017-07-29.jpg
 *   Sharon Mollerus, "The Marq (Marquette Plaza), July 2024.jpg", CC BY 2.0
 *     (west face from the plaza): colours today, the lobby.
 *     https://commons.wikimedia.org/wiki/File:The_Marq_(Marquette_Plaza),_July_2024.jpg
 *   SusanLesch, "Fed-20080928.jpg", CC BY-SA 3.0: the end and the lobby under
 *     the slab. https://commons.wikimedia.org/wiki/File:Fed-20080928.jpg
 *
 * Estimated from Ha'Eri's head-on photo (scaled to the 98 m length): end
 * towers 7 m thick, top band 8 m deep, slab bottom at 9 m; the catenary as
 * z = 9 + 25 (cosh(y/25) - 1) between the towers (sag 44 m). Fin spacing
 * (3 m, drawn every 6 m) and the 1.2 m recess of the glass above the curve.
 *
 * Night: the office glass and the lobby glazing glow.
 *
 * Doubts: the plaza to the west is landscaped ground and left to the map; the
 * roof plant (lidar spots to ~67 m) is left out, as no street photo shows it
 * above the band; the end faces are drawn solid.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { finishGlb } from './sea-rainier-square-tower'

const X0 = -10.2, X1 = 25.8, Y0 = -49.8, Y1 = 48.2
const T = 7 // end tower thickness
const SY0 = Y0 + T, SY1 = Y1 - T // the slab between the towers
const Z = { top: 62, band: 54, slab: 9, lobby: 6.2 }
const YC = (SY0 + SY1) / 2, A = 25
const cat = (y: number) => Math.min(Z.band, Z.slab + A * (Math.cosh((y - YC) / A) - 1))
const BEV = 0.5

function box(part: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, faces = 'senwt', c = 0) {
  // optional chamfer c on the four vertical edges
  const r: [number, number][] = c > 0
    ? [[x0 + c, y0], [x1 - c, y0], [x1, y0 + c], [x1, y1 - c], [x1 - c, y1], [x0 + c, y1], [x0, y1 - c], [x0, y0 + c]]
    : [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  const side = (i: number) => {
    // which face an edge belongs to, for skipping
    const [a, b] = [r[i], r[(i + 1) % r.length]]
    if (a[1] === y0 && b[1] === y0) return 's'
    if (a[0] === x1 && b[0] === x1) return 'e'
    if (a[1] === y1 && b[1] === y1) return 'n'
    if (a[0] === x0 && b[0] === x0) return 'w'
    return 'c'
  }
  for (let i = 0; i < r.length; i++) {
    const s = side(i)
    if (s !== 'c' && !faces.includes(s)) continue
    const a = r[i], b = r[(i + 1) % r.length]
    part.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
  if (faces.includes('t')) for (let i = 1; i < r.length - 1; i++) part.tri([r[0][0], r[0][1], z1], [r[i][0], r[i][1], z1], [r[i + 1][0], r[i + 1][1], z1])
  if (faces.includes('b')) for (let i = 1; i < r.length - 1; i++) part.tri([r[0][0], r[0][1], z0], [r[i + 1][0], r[i + 1][1], z0], [r[i][0], r[i][1], z0])
}

function build() {
  const stone = new Part(), upper = new Part(), lower = new Part(), steel = new Part(), roof = new Part()

  // ---------------------------------------------------------------- end towers and top band
  box(stone, X0, Y0, X1, SY0, 0, Z.top, 'senwt', BEV)
  box(stone, X0, SY1, X1, Y1, 0, Z.top, 'senwt', BEV)
  box(stone, X0, SY0 - 0.01, X1, SY1 + 0.01, Z.band, Z.top, 'ewbt')
  // a shallow parapet lip and the roof
  box(roof, X0 + 1.2, Y0 + 1.2, X1 - 1.2, Y1 - 1.2, Z.top, Z.top + 0.25, 'senwt')

  // ---------------------------------------------------------------- the long faces
  const N = 28
  for (const side of [-1, 1]) {
    const xf = side > 0 ? X1 - 0.4 : X0 + 0.4 // flush glass plane (below the curve)
    const xr = xf - side * 1.2 // recessed glass plane (above the curve)
    const P = (x: number, y: number, z: number): V3 => [x, y, z]
    // quads wound to face +x (side 1) or -x (side -1)
    const face = (part: Part, x: number, ya: number, yb: number, za0: number, za1: number, zb0: number, zb1: number) => {
      if (side > 0) part.quad(P(x, ya, za0), P(x, yb, zb0), P(x, yb, zb1), P(x, ya, za1))
      else part.quad(P(x, yb, zb0), P(x, ya, za0), P(x, ya, za1), P(x, yb, zb1))
    }
    for (let i = 0; i < N; i++) {
      const ya = SY0 + ((SY1 - SY0) * i) / N, yb = SY0 + ((SY1 - SY0) * (i + 1)) / N
      const ca = cat(ya), cb = cat(yb)
      // below the curve: flush glass from the slab bottom up to the curve
      if (ca > Z.slab + 0.05 || cb > Z.slab + 0.05) face(lower, xf, ya, yb, Z.slab, ca, Z.slab, cb)
      // above the curve: recessed glass up to the band
      face(upper, xr, ya, yb, ca, Z.band, cb, Z.band)
      // the ledge along the curve (the top of the flush part), and the cable
      // drawn as a dark band on the flush plane just under the curve
      if (side > 0) steel.quad(P(xf, ya, ca), P(xf, yb, cb), P(xr, yb, cb), P(xr, ya, ca))
      else steel.quad(P(xf, yb, cb), P(xf, ya, ca), P(xr, ya, ca), P(xr, yb, cb))
      face(steel, xf + side * 0.02, ya, yb, ca - 0.9, ca, cb - 0.9, cb)
    }
    // deep vertical fins above the curve, every ~6 m, from the recessed glass
    // out to the flush plane
    for (let k = 1; k < 14; k++) {
      const y = SY0 + ((SY1 - SY0) * k) / 14, z0 = cat(y)
      if (z0 > Z.band - 1) continue
      const w = 0.25
      // the fin's outer face and two sides
      face(stone, xf, y - w, y + w, z0, Z.band, z0, Z.band)
      for (const s of [-1, 1]) {
        const yy = y + s * w
        const q: V3[] = [P(xr, yy, z0), P(xf, yy, z0), P(xf, yy, Z.band), P(xr, yy, Z.band)]
        if (side * s > 0) stone.quad(q[0], q[1], q[2], q[3]); else stone.quad(q[1], q[0], q[3], q[2])
      }
    }
  }
  // the slab's underside and the recessed lobby below it
  stone.quad([X0 + 0.4, SY1, Z.slab], [X1 - 0.4, SY1, Z.slab], [X1 - 0.4, SY0, Z.slab], [X0 + 0.4, SY0, Z.slab])
  box(upper, X0 + 3.4, SY0, X1 - 3.4, SY1, 0, Z.lobby, 'ew')
  // the lobby's own soffit band above the glass
  box(stone, X0 + 3.4, SY0, X1 - 3.4, SY1, Z.lobby, Z.slab, 'ew')

  return finishGlb('msp-marquette-plaza', 'Marquette Plaza', [
    { part: stone, material: finish('marquette-grey', 0xc4c7c8) },
    { part: upper, material: { ...PALETTE.window, color: 0x5d7387 } },
    { part: lower, material: windowVariant(2, 0x93abc0) },
    { part: steel, material: { ...PALETTE.metal, color: 0x4d545c } },
    { part: roof, material: PALETTE.roof },
  ], {
    bearing: 30.5, height: Z.top + 0.25,
    replaces: ['way/45500036'],
  })
}

if (import.meta.main) {
  const { glb, triangles } = build()
  const out = process.argv[2] ?? new URL('../models/msp-marquette-plaza.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
}
