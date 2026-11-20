/**
 * NC State Memorial Belltower, Raleigh (1921–1949; William H. Deitrick
 * completed the design of Hobart Upjohn's memorial): procedural, CC0-1.0.
 * bun generators/ral-memorial-belltower.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, bearing 0 (the OSM square is
 * axis-aligned). Origin: the centroid of OSM way/47917976 (-78.663500,
 * 35.786141). y = 0 is the lowest ground under the footprint; Mapterhorn
 * (z13; z14–15 missing here) falls ~0.5 m to the south-east corner of the
 * terrace. Elevation 0.
 *
 * OSM: way/47917976 "Memorial Belltower" (height 35, historic=monument):
 * a 14.2 × 13.9 m square, which is the raised granite terrace the tower
 * stands on (NAIP and b09 show the plinth well inside it). The model
 * draws that terrace as a 0.5 m step so the replaced square is filled.
 *
 * Published: 115 ft (35.05 m) tall, granite (NC State University
 * Libraries "Memorial Belltower" history; Wikipedia "Memorial Belltower").
 * No lidar covers Wake County. Every other number is photo-scaled from
 * b09, a near-level view from ~50 m, against the published 35 m, and
 * checked against b08 (a telephoto from a high building, little vertical
 * distortion):
 *  - terrace 0–0.5; plinth 0.5–4.0, 8.8 m square, with a weathered cap to
 *    4.9 (b09: 180 px of 1380);
 *  - shaft 4.9–26.6, tapering 7.6 → 6.1 m (b09/b03 width ratios
 *    plinth : shaft foot : shaft top ≈ 1.17 : 1 : 0.8);
 *  - each shaft face: a recessed central channel with two raised ribs and
 *    slit windows, the slits staggered between faces (b09: 13.2–14.4 and
 *    20.6–22 on one face, 11.5–12.6 and 18.8–20 on the next);
 *  - dentil belt 26.6–27.0; clock stage 27.0–29.6 with a square dial
 *    flanked by carved eagles (b06, b09);
 *  - open belfry 29.6–33.6: per face three round-headed openings divided
 *    by two round columns, the middle one wider (b06, b09);
 *  - parapet to 34.2, the corner piers rising as stepped turrets to 35.0,
 *    a moulded arch over the middle opening (b09, crop of b08).
 * Estimated: all of the above but the total height; the plinth doors on
 * all four faces (b09 shows them on two faces, b03 on a third).
 *
 * Photos (evidence, Wikimedia Commons):
 *  b01 "The Memorial Belltower in NC State, September 2022.jpg", DiscoA340, CC BY-SA 4.0
 *      https://commons.wikimedia.org/wiki/File:The_Memorial_Belltower_in_NC_State,_September_2022.jpg
 *  b02 "North Carolina State's Bell Tower.jpg", Melizabethi123, CC BY-SA 3.0 (dusk, floodlit)
 *      https://commons.wikimedia.org/wiki/File:North_Carolina_State%27s_Bell_Tower.jpg
 *  b03 "NCSU campus 043.JPG", Haruhide000, CC BY-SA 3.0
 *      https://commons.wikimedia.org/wiki/File:NCSU_campus_043.JPG
 *  b04 "North Carolina State Bell Tower.jpg", Melizabethi123, CC BY-SA 3.0
 *      https://commons.wikimedia.org/wiki/File:North_Carolina_State_Bell_Tower.jpg
 *  b05 "Belltower ncsu.jpg", Suzie Tremmel, CC BY 2.0
 *      https://commons.wikimedia.org/wiki/File:Belltower_ncsu.jpg
 *  b06 "NCSU Bell Tower.jpg", Melizabethi123, CC BY-SA 3.0 (shaft and belfry close up)
 *      https://commons.wikimedia.org/wiki/File:NCSU_Bell_Tower.jpg
 *  b07 "My Red Bell Tower.jpg", Vamsikarthik, CC BY-SA 4.0 (night, lit red)
 *      https://commons.wikimedia.org/wiki/File:My_Red_Bell_Tower.jpg
 *  b08 "Ncsutower2.jpg", Kamran rab, CC BY-SA 3.0 (from above)
 *      https://commons.wikimedia.org/wiki/File:Ncsutower2.jpg
 *  b09 "North Carolina State University Belltower.JPG", Surrahwall, CC BY-SA 3.0
 *      https://commons.wikimedia.org/wiki/File:North_Carolina_State_University_Belltower.JPG
 *  b10 "KKC Finish.JPG", Theanphibian, public domain
 *      https://commons.wikimedia.org/wiki/File:KKC_Finish.JPG
 * Aerial: USGS NAIP (public domain): the terrace and the plinth's plan.
 * Look-only: none.
 *
 * Colours: pale grey granite (b03, b09) a touch warm; the open belfry and
 * the slits dark; the dial pale.
 * Left out: the carved garlands at the foot of the shaft, the eagles'
 * carving (drawn as plain relief blocks), the bells, the terrace's steps
 * and the bronze lanterns.
 * Night: the tower is floodlit white from the ground (b02), red after wins
 * (b07, not modelled): `_FLOODLIGHT` on the granite, strongest low down.
 * Doubts: which face b09 shows (so which faces carry the higher slits);
 * the exact plinth and shaft widths (photo ratios, ±0.4 m).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'
import { type XY, type Face, onFace, flatShape, extrudeShape, arc, lathe, rect, chamfer, prism, capRing, finishGlb, writeModel } from './sea-tacoma-union-station'
import { box, panel } from './nash-tennessee-state-capitol'

const TOP = 35.0
const TERR = 0.5, PLINTH = 4.0, CAP = 4.9
const SHAFT0 = 3.6, SHAFT1 = 2.75, BELT = 26.6
const CLOCK0 = 27.0, CLOCK1 = 29.6, BELL = 2.5, BELL1 = 33.7, PARA = 34.3
const N: XY[] = [[0, -1], [1, 0], [0, 1], [-1, 0]]

const face = (k: number, h: number): Face => ({ o: [N[k][0] * h, N[k][1] * h, 0], n: N[k] })
const halfAt = (z: number) => SHAFT0 + ((SHAFT1 - SHAFT0) * (z - CAP)) / (BELT - CAP)

/** A square-section block on a face: s0..s1 along it, d0..d1 out from the face plane, z0..z1. */
function faceBox(p: Part, f: Face, s0: number, s1: number, d0: number, d1: number, z0: number, z1: number) {
  const P = (s: number, d: number, z: number) => onFace(f, s, z, d)
  const r = [P(s0, d0, 0), P(s1, d0, 0), P(s1, d1, 0), P(s0, d1, 0)].map((v) => [v[0], v[1]] as XY)
  // ring orientation: make it counter-clockwise from above
  const a = r.reduce((t, q, i) => { const w = r[(i + 1) % 4]; return t + q[0] * w[1] - w[0] * q[1] }, 0)
  const ring = a < 0 ? r.reverse() : r
  prism(p, p, ring, z0, z1)
  capRing(p, ring, z0, false)
}

function build() {
  const granite = new Part(), dark = new Part(), dial = new Part(), roof = new Part()

  // ------------------------------------------------------------ terrace and plinth
  box(granite, -7.1, -6.95, 7.1, 6.95, 0, TERR, granite, 0)
  box(granite, -4.2, -4.2, 4.2, 4.2, TERR, PLINTH, granite, 0.25)
  // the weathered cap: a ledge, then a slope up to the shaft
  const capR = chamfer(rect(-4.45, -4.45, 4.45, 4.45), 0.2)
  prism(granite, null, capR, PLINTH, PLINTH + 0.4)
  capRing(granite, capR, PLINTH, false)
  const capTop = capR.map((p) => [p[0], p[1], PLINTH + 0.4] as V3)
  const shaftFoot = chamfer(rect(-SHAFT0, -SHAFT0, SHAFT0, SHAFT0), 0.2).map((p) => [p[0], p[1], CAP] as V3)
  granite.loft([capTop, shaftFoot])
  for (let k = 0; k < 4; k++) {
    const f = face(k, 4.2)
    // the central projecting panel and its door
    faceBox(granite, f, -1.3, 1.3, -0.1, 0.15, TERR, PLINTH)
    panel(dark, f, 0, 1.1, TERR, TERR + 2.3, 0.18)
    // recessed side panels
    for (const s of [-2.7, 2.7]) panel(granite, f, s, 2.0, TERR + 0.6, PLINTH - 0.5, 0.04)
  }

  // ------------------------------------------------------------ the shaft
  // ring at height z: a chamfered square with a recessed channel on each face
  const CH0 = 1.1, CH1 = 0.85, D = 0.4, CHZ = 6.0
  const ring = (z: number, notch: boolean): V3[] => {
    const H = halfAt(z), cw = CH0 + ((CH1 - CH0) * (z - CAP)) / (BELT - CAP), c = 0.2
    const out: V3[] = []
    for (let k = 0; k < 4; k++) {
      const f = face(k, H)
      const pts: [number, number][] = notch ? [[-H + c, 0], [-cw, 0], [-cw, -D], [cw, -D], [cw, 0], [H - c, 0]] : [[-H + c, 0], [H - c, 0]]
      for (const [s, d] of pts) out.push(onFace(f, s, z, d))
    }
    return out
  }
  granite.loft([ring(CAP, false), ring(CHZ, false)])
  granite.loft([ring(CHZ, true), ring(BELT, true)])
  // the channel floors where the channel starts (facing up)
  for (let k = 0; k < 4; k++) {
    const H = halfAt(CHZ), f = face(k, H)
    const a = onFace(f, -CH0 + 0.0, CHZ, -D), b = onFace(f, CH0, CHZ, -D), c = onFace(f, CH0, CHZ, 0), d = onFace(f, -CH0, CHZ, 0)
    granite.quad(a, b, c, d)
  }
  // ribs and slits in each channel
  const SLITS = [[13.2, 14.4, 20.6, 22.0], [11.5, 12.6, 18.8, 20.0]]
  for (let k = 0; k < 4; k++) {
    for (const sc of [-0.62, 0.62]) {
      const at = (z: number) => {
        const t = (z - CAP) / (BELT - CAP), H = halfAt(z), f = face(k, H), s = sc * (1 - 0.23 * t)
        return [onFace(f, s - 0.14, z, -D), onFace(f, s + 0.14, z, -D), onFace(f, s + 0.14, z, -0.08), onFace(f, s - 0.14, z, -0.08)]
      }
      const b = at(CHZ + 0.4), t = at(BELT)
      // loft wants counter-clockwise rings; these run round the rib, so make them CCW from above
      const cw = (r: V3[]) => { const a = r.reduce((s, q, i) => { const w = r[(i + 1) % 4]; return s + q[0] * w[1] - w[0] * q[1] }, 0); return a < 0 ? [...r].reverse() : r }
      granite.loft([cw(b), cw(t)])
      granite.cap(cw(b), true)
    }
    const sl = SLITS[k % 2]
    for (let i = 0; i < sl.length; i += 2) {
      const zm = (sl[i] + sl[i + 1]) / 2, H = halfAt(zm), f = face(k, H)
      panel(dark, f, 0, 0.55, sl[i], sl[i + 1], -D + 0.04)
    }
  }

  // ------------------------------------------------------------ belt and clock stage
  box(granite, -3.05, -3.05, 3.05, 3.05, BELT, CLOCK0, granite, 0.12)
  box(granite, -2.8, -2.8, 2.8, 2.8, CLOCK0, CLOCK1 - 0.3, granite, 0.15)
  box(granite, -2.95, -2.95, 2.95, 2.95, CLOCK1 - 0.3, CLOCK1, granite, 0.12)
  for (let k = 0; k < 4; k++) {
    const f = face(k, 2.8)
    // the dial: a square pale face, with hands
    const zc = (CLOCK0 + CLOCK1 - 0.3) / 2
    panel(dial, f, 0, 1.9, zc - 0.95, zc + 0.95, 0.05)
    flatShape(dark, f, [[-0.08, zc], [0.08, zc], [0.08, zc + 0.75], [-0.08, zc + 0.75]], 0.08)
    flatShape(dark, f, [[0, zc - 0.08], [0.55, zc - 0.08], [0.55, zc + 0.08], [0, zc + 0.08]], 0.08)
    // the carved eagles either side: relief blocks
    for (const s of [-1.75, 1.75]) faceBox(granite, f, s - 0.45, s + 0.45, -0.05, 0.14, CLOCK0 + 0.15, CLOCK1 - 0.45)
  }

  // ------------------------------------------------------------ the open belfry
  const B = BELL, PIER = 0.8, WALL = 0.45
  // floor (dark) and the solid head over the openings
  capRing(dark, rect(-B + 0.01, -B + 0.01, B - 0.01, B - 0.01), CLOCK1 + 0.01, true)
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const x0 = sx < 0 ? -B : B - PIER, y0 = sy < 0 ? -B : B - PIER
    box(granite, x0, y0, x0 + PIER, y0 + PIER, CLOCK1, PARA + 0.4, null, 0.08)
    // stepped turret top
    box(granite, x0 + 0.1, y0 + 0.1, x0 + PIER - 0.1, y0 + PIER - 0.1, PARA + 0.4, PARA + 0.58, null, 0.06)
    const cx = x0 + PIER / 2, cy = y0 + PIER / 2
    lathe(roof, cx, cy, [[0.34, PARA + 0.58], [0.24, TOP - 0.1], [0.0, TOP]], 4, 45, 405)
  }
  const SIDE = 0.75, MID = 1.1, COL = 0.4, ZO = CLOCK1 + 0.3
  const sideC = MID / 2 + COL + SIDE / 2 // 1.5
  const zSide = 32.9, zMid = 32.9
  for (let k = 0; k < 4; k++) {
    const f = face(k, B), fi: Face = { o: [N[k][0] * (B - WALL), N[k][1] * (B - WALL), 0], n: [-N[k][0], -N[k][1]] }
    const span = B - PIER
    // sill
    faceBox(granite, f, -span, span, -WALL, 0, CLOCK1, ZO)
    // columns: round shafts on square bases, under square capitals
    for (const s of [-(MID / 2 + COL / 2), MID / 2 + COL / 2]) {
      const p = onFace(f, s, 0, -WALL / 2)
      lathe(granite, p[0], p[1], [[0.17, ZO], [0.14, zMid - 0.2]], 8)
      faceBox(granite, f, s - 0.2, s + 0.2, -WALL + 0.02, -0.02, zMid - 0.2, zMid)
    }
    // the head: a wall band with the three arches cut in it
    const head: XY[] = [
      [-span, zSide], ...arc(-sideC, zSide, SIDE / 2, 180, 0, 8), [-MID / 2, zMid], ...arc(0, zMid, MID / 2, 180, 0, 10).slice(1),
      [sideC - SIDE / 2, zSide], ...arc(sideC, zSide, SIDE / 2, 180, 0, 8).slice(1), [span, BELL1], [-span, BELL1],
    ]
    const headPoly = head.filter((p, i) => i === 0 || Math.hypot(p[0] - head[i - 1][0], p[1] - head[i - 1][1]) > 1e-4)
    // side posts between the side openings' arch springing and the head
    extrudeShape(granite, f, headPoly, -WALL, 0)
    flatShape(granite, fi, headPoly.map(([s, z]) => [-s, z] as XY), 0)
    // the moulded arch over the middle opening (pale relief)
    const band: XY[] = [...arc(0, zMid, MID / 2 + 0.28, 180, 0, 12), ...arc(0, zMid, MID / 2 + 0.05, 0, 180, 12)]
    flatShape(dial, f, band, 0.06)
    // underside of the head over each opening is the arch soffit: dark
  }
  // the bells' frame inside, dark through the openings
  box(dark, -0.9, -0.9, 0.9, 0.9, ZO, 32.6, dark, 0)
  // the roof slab over the head and the parapet
  box(granite, -B + WALL - 0.05, -B + WALL - 0.05, B - WALL + 0.05, B - WALL + 0.05, 33.5, BELL1, roof, 0)
  for (let k = 0; k < 4; k++) {
    const f = face(k, B)
    faceBox(granite, f, -(B - PIER), B - PIER, -0.35, 0, BELL1, PARA)
    // the cornice under the parapet
    faceBox(granite, f, -(B - PIER), B - PIER, -0.1, 0.12, BELL1 - 0.25, BELL1)
  }

  const flood = (p: V3, n: V3) => (n[2] > 0.7 ? 0.25 : Math.max(0.35, 1 - (p[2] / TOP) * 0.55))
  return finishGlb('NC State Memorial Belltower', [
    { part: granite, material: <Swatch>{ ...finish('ncsu-granite', 0xdcdad3), floodlight: flood } },
    { part: dark, material: finish('belfry-shadow', 0x4f555c) },
    { part: dial, material: PALETTE.trim },
    { part: roof, material: PALETTE.roof },
  ], { bearing: 0, height: TOP, replaces: ['way/47917976'] }, 5000)
}

if (import.meta.main) await writeModel('ral-memorial-belltower', build())
