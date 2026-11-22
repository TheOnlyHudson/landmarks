/**
 * Salt Lake City and County Building (1891-94, Monheim, Bird & Proudfoot),
 * Washington Square, 451 South State Street. Richardsonian Romanesque, grey
 * Kyune sandstone. Procedural, CC0-1.0.
 * bun generators/slc-city-and-county-building.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0. Origin: the area
 * centroid of OSM way/33155164 (-111.8867963, 40.7595626). The site is flat
 * (Mapterhorn and lidar ground within 0.3 m under the outline), so the
 * ground floor starts at y = 0.
 *
 * Form (OSM outline and parts, photos p1-p2): a long block, 40 x 84 m,
 * symmetric on both axes. Four storeys over a raised basement under a
 * dark slate gabled roof whose ridge runs north-south; a higher cross
 * roof spans the building at mid-length and ends in a gabled entrance
 * pavilion on the east and west fronts, each flanked by two square towers
 * with steep pyramid roofs. A round turret with a conical cap stands
 * half-out of the long walls each side of the pavilions. The four corners
 * are taller pavilions with steep hipped roofs; between them the north and
 * south fronts have a gabled entrance pavilion. In the middle the clock
 * tower rises from the ridge: a plain square shaft with tall paired
 * round-headed openings, a band of corner bartizans, the clock stage with
 * a clock on each face, corner turrets with conical caps, a steep slate
 * pyramid with dormers, an open lantern and the statue of Columbia.
 *
 * Numbers:
 *  - plan: OSM way/33155164 and its 21 building:parts (mirrored to make the
 *    plan exactly symmetric; the mapped halves differ by < 0.5 m).
 *  - heights: measured, USGS lidar (USGS_LPC_UT_Wasatch_L4_2013_LAS_2016,
 *    flown 2013), 1 m grid, read in the model frame: main eaves 22.5 m,
 *    main ridge 32.4 m; cross roof ridge 34.0 m; pavilion towers' cornice
 *    31 m, pyramid tips 38.5 m; corner pavilions' eaves 26.2 m, hips 35.5 m;
 *    end-wing ridge 29.8 m; clock tower shaft cornice 56 m, corner turrets
 *    ~61 m, pyramid ~67 m, highest return 75.1 m (lantern/statue).
 *  - total height: published 256 ft (78 m) to the top of Columbia
 *    (Wikipedia); the statue's head is thinner than the lidar spacing, so
 *    the statue is drawn to 77 m.
 *  - storey heights, window bays, arch sizes, the tower's stages between the
 *    measured levels (bartizans at 41-50 m, clock centre 51.5 m): estimated
 *    from p1 and p2, scaled by the OSM widths.
 * Left out: carved ornament, the statues of Justice etc. on the gables,
 *  chimneys, finials smaller than 0.5 m, window muntins.
 *
 * Photos (EVIDENCE):
 *  p1 https://commons.wikimedia.org/wiki/File:Salt_lake_city_county_bldg.jpg
 *     Sean Breazeal, public domain (the west front and clock tower from the
 *     south-west across Washington Square, winter)
 *  p2 https://commons.wikimedia.org/wiki/File:Salt_Lake_City_and_County_Building_(Old_City_Hall)_in_Utah.jpg
 *     Alede2010, CC BY-SA 4.0 (an east/west entrance pavilion straight on;
 *     which of the two is not certain from the photo)
 * Doubts: the north and south fronts are seen only obliquely (their
 *  entrance pavilions are drawn from the lidar and the plan, with the
 *  E/W pavilions' details); the turret cone tips are lidar holes (steep),
 *  set at 32 m from the photos.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, gable, hip, panel, poly, prism, rect, type Face, type XY } from './slc-beehive-house'

const stone = new Part(), trim = new Part(), slate = new Part(), win = new Part(), bronze = new Part()

// ------------------------------------------------------------- numbers ---
const XM = 16.9, YM = 28.7 // main body half-width, half-length (to the corner pavilions)
const XE = 12.0, YE = 40.1 // end wings between the corner pavilions
const XC = 20.0, YC = 41.9 // corner pavilions' outer faces
const XP = 21.2, YP = 6.8 // east/west entrance pavilion front, half-width
const TX0 = 16.0, TX1 = 22.4, TY0 = 6.8, TY1 = 13.4 // pavilion towers
const XN = 5.4, YN = 41.8 // north/south entrance pavilion
const TU: XY = [16.9, 21.1], RT = 2.8 // turrets: centre, radius
const ZE = 22.5, ZR = 32.4 // main eaves, ridge
const ZPE = 28.5, ZPR = 34.0 // cross roof eaves, ridge
const ZT = 31.0, ZTT = 38.5 // pavilion towers: cornice, tip
const ZCE = 26.2, ZCR = 35.5 // corner pavilions
const ZWR = 29.8 // end-wing ridge
const ZNE = 27.0, ZNR = 33.0 // north/south pavilion gable

// floors: raised basement, then four storeys (sill, head)
const F: [number, number][] = [[2.2, 5.4], [7.2, 10.4], [12.2, 15.4], [17.0, 20.4]]

/** A cylinder (n sides, first face centred on angle a0) with a cone cap. */
function turret(p: Part, cap: Part, cx: number, cy: number, r: number, z0: number, z1: number, tip: number, n = 12, a0 = Math.PI / 12) {
  const ring = (rr: number, z: number): V3[] => Array.from({ length: n }, (_, i) => {
    const a = a0 + (i / n) * 2 * Math.PI
    return [cx + rr * Math.cos(a), cy + rr * Math.sin(a), z] as V3
  })
  p.loft([ring(r, z0), ring(r, z1)])
  trim.loft([ring(r + 0.25, z1 - 0.5), ring(r + 0.25, z1)])
  trim.cap(ring(r + 0.25, z1 - 0.5), false)
  const top = ring(r + 0.35, z1)
  for (let i = 0; i < n; i++) cap.tri(top[i], top[(i + 1) % n], [cx, cy, tip])
}

/** A pyramid over a rectangle. */
function pyramid(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, tip: number) {
  const c: V3 = [(x0 + x1) / 2, (y0 + y1) / 2, tip]
  const q: V3[] = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]]
  for (let i = 0; i < 4; i++) p.tri(q[i], q[(i + 1) % 4], c)
}

/** A string course / cornice band round a rectangle. */
const band = (x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, o = 0.3) =>
  prism(trim, rect(x0 - o, y0 - o, x1 + o, y1 + o), z0, z1, true, true)

// windows on a wall segment: n bays between u0 and u1, one panel per floor
function bays(face: Face, plane: number, u0: number, u1: number, n: number, w = 2.2, floors = F) {
  for (let k = 0; k < n; k++) {
    const u = u0 + ((k + 0.5) / n) * (u1 - u0)
    floors.forEach(([a, b], i) => panel(win, face, plane, u, w, a, b, i === 3 ? 'round' : 'flat', 0.05))
  }
}

// ---------------------------------------------------------- main masses ---
box(stone, -XM, -YM, XM, YM, 0, ZE)
for (const s of [-1, 1]) {
  const ya = s < 0 ? -YE : YM, yb = s < 0 ? -YM : YE
  box(stone, -XE, ya, XE, yb, 0, ZE)
  // corner pavilions
  for (const sx of [-1, 1]) {
    const xa = sx < 0 ? -XC : XE, xb = sx < 0 ? -XE : XC
    const y0 = s < 0 ? -YC : YM, y1 = s < 0 ? -YM : YC
    box(stone, xa, y0, xb, y1, 0, ZCE)
    band(xa, y0, xb, y1, ZCE - 0.7, ZCE)
    band(xa, y0, xb, y1, 1.3, 1.8, 0.15)
    hip(slate, xa - 0.35, y0 - 0.35, xb + 0.35, y1 + 0.35, ZCE, ZCR, (xb - xa) / 2 + 0.15, true)
    // windows: outer long face and end face
    const fx: Face = sx < 0 ? 'W' : 'E', fy: Face = s < 0 ? 'S' : 'N'
    bays(fx, sx * XC, y0 + 1, y1 - 1, 2)
    bays(fy, s * YC, xa + 1, xb - 1, 2, 2.0)
    // a fifth-storey window pair in the tall pavilion
    for (const u of [y0 + (y1 - y0) / 3, y0 + (2 * (y1 - y0)) / 3]) panel(win, fx, sx * XC, u, 1.6, 21.8, 24.6, 'round')
  }
  // north/south entrance pavilion
  const ny0 = s < 0 ? -YN : YE - 3, ny1 = s < 0 ? -YE + 3 : YN
  box(stone, -XN, ny0, XN, ny1, 0, ZNE)
  gable(slate, stone, -XN, ny0, XN, ny1, ZNE, ZNR, 'y', 0.35)
  band(-XN, ny0, XN, ny1, ZNE - 0.6, ZNE)
  // corner pinnacles of the pavilion
  for (const sx of [-1, 1]) turret(stone, slate, sx * (XN - 0.5), s * (YN - 0.5), 0.75, ZNE - 3, ZNE + 1.2, 31.5, 8, Math.PI / 8)
  const fy: Face = s < 0 ? 'S' : 'N'
  // the arched entrance and the windows above
  panel(trim, fy, s * YN, 0, 5.2, 0, 7.6, 'round', 0.03)
  panel(bronze, fy, s * YN, 0, 3.8, 0, 6.9, 'round', 0.06)
  for (const u of [-3.1, 3.1]) panel(win, fy, s * YN, u, 1.4, 2.4, 5.6, 'round')
  for (const u of [-3.1, 0, 3.1]) for (const [a, b] of F.slice(1, 3)) panel(win, fy, s * YN, u, 1.8, a, b)
  for (const u of [-3.1, -1.05, 1.05, 3.1]) panel(win, fy, s * YN, u, 1.4, 17.0, 22.4, 'round')
  panel(win, fy, s * YN, 0, 1.8, 27.4, 30.0, 'round')
  // end-wing faces between the pavilions
  for (const sx of [-1, 1]) bays(fy, s * YE, sx < 0 ? -XE : XN, sx < 0 ? -XN : XE, 2, 2.0)
  // end-wing roof
  gable(slate, null, -XE - 0.35, s < 0 ? -YE - 0.3 : YM - 2, XE + 0.35, s < 0 ? -YM + 2 : YE + 0.3, ZE, ZWR, 'y', 0)
  band(-XE, s < 0 ? -YE : YM, XE, s < 0 ? -YM : YE, ZE - 0.7, ZE)
}
// end-wing gable ends (stone triangles under the end-wing roof)
for (const s of [-1, 1]) poly(stone, [[-XE, s * YE, ZE], [XE, s * YE, ZE], [0, s * YE, ZWR]], [0, s, 0])

// main roof, ridge north-south; gable ends in stone above the end wings
gable(slate, stone, -XM - 0.4, -YM, XM + 0.4, YM, ZE, ZR, 'y', 0.4)
band(-XM, -YM, XM, YM, ZE - 0.7, ZE)
band(-XM, -YM, XM, YM, 1.3, 1.8, 0.15)
band(-XE, -YE, XE, YE, 1.3, 1.8, 0.15)

// ------------------------------------------- east and west pavilions ---
for (const sx of [-1, 1]) {
  const fx: Face = sx < 0 ? 'W' : 'E'
  const xa = sx < 0 ? -XP : XM - 1, xb = sx < 0 ? -XM + 1 : XP
  box(stone, xa, -YP, xb, YP, 0, ZPE)
  band(xa, -YP, xb, YP, ZPE - 0.6, ZPE)
  // entrance arcade: three round arches, doors in the middle one
  panel(trim, fx, sx * XP, 0, 11.4, 0, 1.6, 'flat', 0.03)
  for (const [u, w, h] of [[-3.7, 2.8, 6.4], [0, 4.0, 7.4], [3.7, 2.8, 6.4]] as [number, number, number][]) {
    panel(trim, fx, sx * XP, u, w + 0.8, 1.6, h + 0.5, 'round', 0.03)
    panel(u === 0 ? bronze : win, fx, sx * XP, u, w, 1.6, h, 'round', 0.06)
  }
  // second floor: four windows; third and fourth: four tall arches
  for (const u of [-4.2, -1.4, 1.4, 4.2]) {
    panel(win, fx, sx * XP, u, 1.8, 8.6, 11.0)
    panel(win, fx, sx * XP, u, 2.0, 12.4, 19.8, 'round')
    panel(win, fx, sx * XP, u, 1.4, 21.4, 23.6)
  }
  band(xa, -YP, xb, YP, 11.6, 12.1, 0.12)
  // the gable front with its round window
  const gx = sx * (XP + 0.02)
  poly(stone, [[gx, -YP, ZPE], [gx, YP, ZPE], [gx, 0, ZPR + 1.0]], [sx, 0, 0])
  panel(win, fx, sx * XP, 0, 2.6, 28.9, 31.5, 'round')
  // flanking towers
  for (const sy of [-1, 1]) {
    const ta = sx < 0 ? -TX1 : TX0, tb = sx < 0 ? -TX0 : TX1
    const ya = sy < 0 ? -TY1 : TY0, yb = sy < 0 ? -TY0 : TY1
    box(stone, ta, ya, tb, yb, 0, ZT)
    band(ta, ya, tb, yb, ZT - 0.8, ZT, 0.35)
    band(ta, ya, tb, yb, 1.3, 1.8, 0.15)
    pyramid(slate, ta - 0.35, ya - 0.35, tb + 0.35, yb + 0.35, ZT, ZTT)
    box(trim, (ta + tb) / 2 - 0.2, (ya + yb) / 2 - 0.2, (ta + tb) / 2 + 0.2, (ya + yb) / 2 + 0.2, ZTT - 0.5, ZTT + 1.3)
    const uy = (ya + yb) / 2
    for (const [a, b] of F) panel(win, fx, sx * TX1, uy, 2.2, a, b)
    panel(win, fx, sx * TX1, uy - 0.75, 1.1, 23.0, 28.0, 'round')
    panel(win, fx, sx * TX1, uy + 0.75, 1.1, 23.0, 28.0, 'round')
    const fy: Face = sy < 0 ? 'S' : 'N'
    for (const [a, b] of F.slice(1)) panel(win, fy, sy * TY1, (ta + tb) / 2, 1.8, a, b)
  }
  // long walls between the towers, turrets and corner pavilions
  for (const sy of [-1, 1]) {
    const lo = sy < 0 ? -(TU[1] - RT) : TY1, hi = sy < 0 ? -TY1 : TU[1] - RT
    bays(fx, sx * XM, lo, hi, 1)
    const lo2 = sy < 0 ? -YM : TU[1] + RT, hi2 = sy < 0 ? -(TU[1] + RT) : YM
    bays(fx, sx * XM, lo2, hi2, 1)
    // the round turret and its cross gable on the main roof
    turret(stone, slate, sx * TU[0], sy * TU[1], RT, 0, ZE + 1.2, 32.0)
    // a window per floor on the turret's outward face (a face of the 12-gon points straight out)
    for (const [a, b] of F) panel(win, fx, sx * (TU[0] + RT * Math.cos(Math.PI / 12)), sy * TU[1], 1.1, a, b)
    const ca = sx < 0 ? -XM - 0.3 : 4.0, cb = sx < 0 ? -4.0 : XM + 0.3
    gable(slate, stone, ca, sy * TU[1] - RT, cb, sy * TU[1] + RT, ZE, 28.2, 'x', 0.3)
  }
}
// the cross roof over the pavilions, ridge east-west
gable(slate, null, -XP - 0.4, -YP, XP + 0.4, YP, ZPE, ZPR, 'x', 0.4)

// ------------------------------------------------------- clock tower ---
const H = 5.0 // half-width of the shaft
box(stone, -H, -H, H, H, ZE, 56.0)
band(-H, -H, H, H, ZR + 0.4, ZR + 1.0, 0.25)
band(-H, -H, H, H, 44.0, 44.8, 0.35)
band(-H, -H, H, H, 55.2, 56.2, 0.45)
const FACES: [Face, number][] = [['S', -H], ['N', H], ['E', H], ['W', -H]]
for (const [f, pl] of FACES) {
  // tall paired round-headed openings in the shaft
  for (const u of [-1.35, 1.35]) panel(win, f, pl, u, 1.6, 35.0, 43.0, 'round')
  // the clock: a pale disc with a dark ring, and paired openings over it
  const n: V3 = f === 'S' ? [0, -1, 0] : f === 'N' ? [0, 1, 0] : f === 'E' ? [1, 0, 0] : [-1, 0, 0]
  const at = (r: number, a: number, off: number): V3 => {
    const t = r * Math.cos(a), z = 50.6 + r * Math.sin(a)
    return f === 'S' || f === 'N' ? [t, pl + n[1] * off, z] : [pl + n[0] * off, t, z]
  }
  const ringSeg = 16
  const disc = (part: Part, r: number, off: number) => poly(part, Array.from({ length: ringSeg }, (_, i) => at(r, (i / ringSeg) * 2 * Math.PI, off)), n)
  disc(win, 2.1, 0.05)
  disc(trim, 1.7, 0.09)
  panel(win, f, pl, -1.0, 0.9, 53.0, 55.0, 'round')
  panel(win, f, pl, 1.0, 0.9, 53.0, 55.0, 'round')
}
// corner bartizans and the corner turrets of the clock stage
for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
  turret(stone, slate, sx * H, sy * H, 0.95, 41.5, 47.0, 49.8, 8, Math.PI / 8)
  turret(stone, slate, sx * H, sy * H, 1.0, 52.5, 57.6, 61.4, 8, Math.PI / 8)
}
// the steep slate pyramid, with a gabled dormer on each face
{
  const z0 = 56.2, z1 = 66.8, r0 = H + 0.2, r1 = 1.4
  slate.loft([
    [[-r0, -r0, z0], [r0, -r0, z0], [r0, r0, z0], [-r0, r0, z0]],
    [[-r1, -r1, z1], [r1, -r1, z1], [r1, r1, z1], [-r1, r1, z1]],
  ])
  slate.cap([[-r1, -r1, z1], [r1, -r1, z1], [r1, r1, z1], [-r1, r1, z1]], true)
  for (const [f] of FACES) {
    const w = 1.3
    if (f === 'S' || f === 'N') {
      const s = f === 'S' ? -1 : 1
      const y0 = s < 0 ? -r0 - 0.1 : r0 - 2.6, y1 = s < 0 ? -r0 + 2.6 : r0 + 0.1
      box(stone, -w, y0, w, y1, z0, z0 + 3.0)
      gable(slate, stone, -w, y0, w, y1, z0 + 3.0, z0 + 4.6, 'y', 0.2)
      panel(win, f, s * (r0 + 0.1), 0, 1.0, z0 + 0.5, z0 + 3.4, 'round')
    } else {
      const s = f === 'W' ? -1 : 1
      const x0 = s < 0 ? -r0 - 0.1 : r0 - 2.6, x1 = s < 0 ? -r0 + 2.6 : r0 + 0.1
      box(stone, x0, -w, x1, w, z0, z0 + 3.0)
      gable(slate, stone, x0, -w, x1, w, z0 + 3.0, z0 + 4.6, 'x', 0.2)
      panel(win, f, s * (r0 + 0.1), 0, 1.0, z0 + 0.5, z0 + 3.4, 'round')
    }
  }
  // the lantern, its cap, and Columbia
  turret(stone, slate, 0, 0, 1.25, z1, 70.4, 72.4, 8, Math.PI / 8)
  for (const [f, pl] of [['S', -1.16], ['N', 1.16], ['E', 1.16], ['W', -1.16]] as [Face, number][]) panel(win, f, pl, 0, 0.6, 67.6, 69.8, 'round', 0.04)
  box(bronze, -0.45, -0.45, 0.45, 0.45, 72.2, 73.2)
  const ring = (r: number, z: number): V3[] => [[-r, -r * 0.8, z], [r, -r * 0.8, z], [r, r * 0.8, z], [-r, r * 0.8, z]]
  bronze.loft([ring(0.6, 73.2), ring(0.4, 75.4), ring(0.32, 76.2)])
  bronze.cap(ring(0.32, 76.2), true)
  box(bronze, -0.2, -0.2, 0.2, 0.2, 76.2, 77.0)
  box(bronze, 0.3, -0.12, 0.55, 0.12, 74.5, 77.0) // the raised arm with the torch
}

// ---------------------------------------------------------------- output ---
// Colours from p1 and p2: pale grey-buff Kyune sandstone (warmer in low
// sun), paler cornices, dark blue-grey slate roofs (OSM roof:colour
// #57728d, pulled lighter), slate windows, bronze doors and statue.
const parts = [
  { part: stone, material: finish('ccb-sandstone', 0xd5cbb8) },
  { part: trim, material: finish('ccb-sandstone-light', 0xe9dfcc) },
  { part: slate, material: finish('ccb-slate', 0x66717d) },
  { part: win, material: PALETTE.window },
  { part: bronze, material: finish('ccb-bronze', 0x8a7556) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Salt Lake City and County Building', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: 77.0,
})
await Bun.write(new URL('../models/slc-city-and-county-building.glb', import.meta.url), glb)
console.log(`slc-city-and-county-building.glb: ${triangles} triangles, ${glb.length} bytes`)
