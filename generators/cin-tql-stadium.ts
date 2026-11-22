/**
 * TQL Stadium, Cincinnati (MLS, FC Cincinnati; opened 2021, Populous with
 * Meis Architects) — procedural, CC0-1.0, no textures.
 * bun generators/cin-tql-stadium.ts
 *
 * Map frame: x across the pitch (+x the east touchline), y along it (+y
 * the north end, The Bailey), z up, metres. Placed at bearing 350°, the
 * long sides of the pitch (inner way/782006754, end edges at 79.6°).
 * Anchor -84.522304, 39.111044, the area centroid of the outline
 * way/782006755. (The point in the batch list, -84.52197 39.11110, is 29 m
 * east of it, on the east stand.)
 *
 * z = 0 is the pitch. The lidar puts the street on the west and north
 * 1 m below it and the east plaza 8 m above it; `elevation` is 0. The pitch
 * is the map's.
 *
 * What makes it read as itself, from the photos and the aerial: a closed
 * rounded-rectangle bowl under one continuous white roof ring whose inner
 * edge follows the pitch, pitched gently down to the outside; the band of
 * silver twisted fins wrapping the upper half of the outside all round; a
 * dark grey base with plazas and stairs; blue seats in two steep tiers.
 *
 * The lidar (USGS 3DEP OH_StatewideP3_6_B21) was flown with the stadium's
 * structure and roof complete: the roof is in the point cloud.
 *
 * Evidence
 * - OSM: building relation/20082149 (TQL Stadium; 34 building:part ways:
 *   seating sections, suite and concourse blocks, the Jumbotron), building
 *   outline relation/10845745 (outer way/782006755, inner way/782006754 the
 *   pitch), roof part relation/19895540 (outer way/1454496958, white
 *   #f3f1f2, pitched), leisure=stadium way/1445692208 (Q54465634); building:colour
 *   #394163 on the stand parts, seat roofs #2147a3.
 * - Measured, lidar: OH_StatewideP3_6_B21 (about 2021), 1 m, rays from the
 *   pitch centre every 15°: roof inner edge 33 m above the pitch, directly
 *   over the pitch's edge on all four sides; falling to 29-30 m at the
 *   outer edge, 46 m out at the sides and 40 m at the ends; the corners
 *   follow the outline's rounded corners.
 * - Measured, USGS NAIP orthophoto: plan, the white roof ring with its
 *   lettering (not drawn), the fin band's dark fringe.
 * - Published (Wikipedia, "TQL Stadium"): opened 2021; capacity 26,000;
 *   architects Populous and Meis; roof covers the seats; the north end
 *   ("The Bailey") is a steep supporters' stand.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   Hayden Schiff, "TQL Stadium (PXL 20230306 154655503) (cropped)" (CC BY
 *   4.0; the east side from the street: fin band, base, stairs)
 *     https://commons.wikimedia.org/wiki/File:TQL_Stadium_(PXL_20230306_154655503)_(cropped).jpg
 *   Phasmatisnox, "Elevated view of TQL Stadium and its environs from 12th
 *   St and Central" (CC BY-SA 4.0; from the south-east)
 *     https://commons.wikimedia.org/wiki/File:Elevated_view_of_TQL_Stadium_and_its_environs_from_12th_St_and_Central.jpg
 *   Isaac Freeman, "TQL Stadium - West End", "- North End", "- East End"
 *   (CC BY-SA 4.0; inside: the roof's underside and trusses, two tiers,
 *   the suite levels)
 *     https://commons.wikimedia.org/wiki/File:TQL_Stadium_-_West_End.jpg
 *     https://commons.wikimedia.org/wiki/File:TQL_Stadium_-_North_End.jpg
 *     https://commons.wikimedia.org/wiki/File:TQL_Stadium_-_East_End.jpg
 * - Estimated: the tiers under the roof (lower tier to 8 m 14 m out, a club
 *   glass band, the upper tier to 30 m), hidden from the lidar, from the
 *   inside photos; fins from
 *   9.5 m on the long sides to 14.5 m at the ends up to the roof, 2 m wide
 *   every 4.6 m leaning 18° (the real fins are twisted blades), over a dark skin,
 *   the base set 3 m back; the roof overhanging the skin by 2.5 m; roof
 *   white from OSM roof:colour #f3f1f2; all from the street photo.
 * - Not drawn: the fins' twist, the roof
 *   lettering, the Jumbotron, the stairs and plazas, the roof trusses.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, rayHit, type XY } from './dc-nationals-park'
import { densify, pathFrame, sec, sweep } from './cin-nippert-stadium'

// The pitch's edge, a rectangle with small rounded corners, walked
// counter-clockwise from above so outward is on the right.
const PX0 = -39, PX1 = 41.5, PY0 = -57.5, PY1 = 58.5, PR = 4
const rounded = (x0: number, x1: number, y0: number, y1: number, r: number, n: number): XY[] => {
  const out: XY[] = []
  const cs: [number, number, number][] = [[x0 + r, y1 - r, 180], [x1 - r, y1 - r, 90], [x1 - r, y0 + r, 0], [x0 + r, y0 + r, -90]]
  for (const [cx, cy, a0] of cs) for (let k = 0; k <= n; k++) {
    const a = ((a0 - (90 * k) / n) * Math.PI) / 180
    out.push([cx + r * Math.cos(a), cy + r * Math.sin(a)])
  }
  return out
}
const pitch = rounded(PX0, PX1, PY0, PY1, PR, 8).reverse()
const PATH = pathFrame(densify([...pitch, pitch[0]], 10).slice(0, -1), true)
// The outline, smoothed: its rounded corners carry the roof and fin band.
const OUTLINE = rounded(-86, 85, -98, 96, 32, 6)

const seats = new Part(), white = new Part(), glass = new Part(), grey = new Part(), fins = new Part(), base = new Part()
const Z_FRONT = 33, Z_BACK = 29.5, Z_FIN = 9.5

sweep(PATH, PATH.map(({ p, n }) => {
  const dB = rayHit(OUTLINE, p, n)
  return sec([
    [0, 0, grey], [0, 1.5, seats], [14, 8, grey], [14.6, 8, glass], [14.6, 12, grey], [15.6, 12.6, seats],
    [dB - 9, 28.5, grey], [dB - 3, 28.5, null], [dB - 3, 0, null],
  ])
}), null, true)
// The roof ring, overhanging the skin by 2.5 m, white on top and grey
// underneath.
sweep(PATH, PATH.map(({ p, n }) => {
  const dB = rayHit(OUTLINE, p, n)
  return sec([
    [-1, Z_FRONT - 1.6, white], [-1, Z_FRONT, white], [dB + 2.5, Z_BACK - 0.3, white], [dB + 2.5, Z_BACK - 1.3, grey],
    [dB - 3.5, Z_BACK - 2.1, grey], [-1, Z_FRONT - 1.6, null],
  ])
}), null, true)
// The skin behind the fins: dark, from the roof down to where the fins
// stop (lower on the long sides, where the bowl rises highest), then the
// base set 3 m back.
const finBottom = (n: XY) => Z_FIN + 5 * Math.abs(n[1]) / Math.hypot(n[0], n[1])
sweep(PATH, PATH.map(({ p, n }) => {
  const dB = rayHit(OUTLINE, p, n), zb = finBottom(n)
  return sec([[dB, Z_BACK - 1.6, base], [dB, zb, base], [dB - 3, zb, base], [dB - 3, 0, null]])
}), null, true)
// The fins: pale silver blades 2 m wide every 4.6 m round the outline, leaning 18°
// in the facade's plane, so the skin reads as a ribbed band.
{
  const ring = [...OUTLINE, OUTLINE[0]]
  let carry = 0
  for (let i = 0; i < ring.length - 1; i++) {
    const a = ring[i], b = ring[i + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const t: V3 = [(b[0] - a[0]) / L, (b[1] - a[1]) / L, 0]
    const nn: XY = [t[1], -t[0]] // outward (the outline runs clockwise)
    for (let u = carry; u < L; u += 4.6) {
      const zb = finBottom(nn), zt = Z_BACK - 1.6, h = zt - zb
      const lean = (18 * Math.PI) / 180
      const ax: V3 = [t[0] * Math.sin(lean), t[1] * Math.sin(lean), Math.cos(lean)]
      const c: V3 = [a[0] + t[0] * u + nn[0] * 0.45, a[1] + t[1] * u + nn[1] * 0.45, (zb + zt) / 2]
      box(fins, c, [t, [nn[0], nn[1], 0], ax], [1.0, 0.45, h / 2 / Math.cos(lean) - 0.2])
    }
    carry = (carry - L) % 4.6
    if (carry < 0) carry += 4.6
  }
}

const parts = [
  { part: seats, material: finish('fcc-blue', 0x5a74b0) },
  { part: white, material: finish('roof-white', 0xf3f1f2) },
  { part: glass, material: PALETTE.window },
  { part: grey, material: PALETTE.roof },
  { part: fins, material: finish('fin-silver', 0xdadee2) },
  { part: base, material: finish('tql-base', 0x6f7682) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (import.meta.main) {
  for (const { part, material } of parts) console.log(material.name.padEnd(16), part.triangles)
  if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('TQL Stadium', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
    bearing: 350, osm: 'relation/10845745', height: Z_FRONT,
  })
  if (glb.length > 240000) throw new Error(`File budget exceeded: ${glb.length}`)
  const out = new URL('../models/cin-tql-stadium.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}
