/**
 * Saenger Theatre, 1111 Canal Street at North Rampart, New Orleans (Emile
 * Weil, 1927; restored and reopened 2013) — procedural, CC0-1.0, no
 * textures.
 * bun generators/nola-saenger-theatre.ts
 *
 * Built with the classical kit exported from nola-gallier-hall.ts.
 *
 * Map frame: x = model east, y = model north, z up, metres; origin at the
 * anchor on the ground. Placed at bearing 38, the bearing of the long
 * North Rampart wall, so model -y is the Canal Street front (facing compass
 * 218), model +x the North Rampart Street side (compass 128), model -x
 * Basin Street and +y the Iberville end. Which end is Canal was checked
 * against the OSM street ways (Canal Street runs past the 40 m end).
 * Anchor: the area centroid of OSM way/367725783.
 *
 * Identity: the tall vertical "SAENGER" blade sign standing out from the
 * Canal front near the Rampart corner (a dark green-grey blade with cream
 * lit letters, a fan crest and a spike) over its fan-topped marquee; the
 * four-storey red-brick block along Canal with its white ground floor and
 * white cornice; the cream terracotta entrance bay with its great arched
 * window; the long brick auditorium wall on Rampart with cream bands,
 * arched upper windows, a second marquee and the canopy along the street;
 * the gabled auditorium roof and the taller fly tower at the Iberville end.
 *
 * Famous-sign exception (STYLE.md, "Famous signs"): the blade sign carries
 * its lettering, on both faces, as strokes built with
 * generators/lettering.ts, traced from Ajay Suresh's photo below: Roman
 * capitals with small serifs, upright, stacked one above the other.
 *
 * Evidence
 * - OSM way/367725783 (theatre, height 31.3, 4 levels, Q7398302): the plan,
 *   97 m along Rampart, 40 m wide, 36 m on Canal.
 * - Lidar: USGS 3DEP LA_2021GNO_1_C22 (Greater New Orleans, flown 2021-22),
 *   1 m grid read in the model frame. Ground 0.5. The Canal block y = -51
 *   to -14: parapet 17.2, with a raised spine over the lobby to 22.6 and a
 *   light well; a flat front of the auditorium 20.6 (y = -14 to -9); the
 *   auditorium a gable along y, ridge 27.0 at x = 1, eaves 20.2, to y = 35;
 *   the fly tower at the Iberville end, parapet 29.9, roof 27.3; the Rampart
 *   canopy at 5.0-5.6, 3.5 m out, y = -14 to 48. A V-shaped billboard frame
 *   on the Canal block's roof (to 31.6) is not part of the theatre and is
 *   left out. The blade sign is too thin for the 1 m grid.
 * - Terrain (Mapterhorn): flat. elevation 0.
 * - Photos (Wikimedia Commons, all evidence):
 *   - "Saenger Theatre - New Orleans (55151712266).jpg", ajay_suresh,
 *     CC BY 4.0: the corner block and the blade sign from Canal & Rampart
 *     (the sign traced from it)
 *     https://commons.wikimedia.org/wiki/File:Saenger_Theatre_-_New_Orleans_(55151712266).jpg
 *   - "View of the Saenger Theatre in New Orleans from the east.jpg", Dllu,
 *     CC BY-SA 4.0: the Rampart side at night (the canopy, the arched
 *     windows, the bands, the stage house)
 *     https://commons.wikimedia.org/wiki/File:View_of_the_Saenger_Theatre_in_New_Orleans_from_the_east.jpg
 *   - "North Rampart Street, New Orleans 1 May 2025 - Saenger Theatre
 *     side.jpg", Infrogmation, CC BY-SA 4.0: the entrance bay face on
 *     https://commons.wikimedia.org/wiki/File:North_Rampart_Street,_New_Orleans_1_May_2025_-_Saenger_Theatre_side.jpg
 *   - "Saenger Theatre, Canal & Rampart, New Orleans 16 April 2025 - 1.jpg",
 *     Infrogmation, CC BY-SA 4.0: the sign above the corner block's
 *     cornice, from across Canal
 *     https://commons.wikimedia.org/wiki/File:Saenger_Theatre,_Canal_%26_Rampart,_New_Orleans_16_April_2025_-_1.jpg
 *
 * Measured (lidar): every block height and extent above, the canopy.
 * Estimated from Ajay Suresh's photo, scaled by the entrance bay (18.4)
 * and the marquee (lidar 5.3-6.6): the sign (z 7.0-22.9, letters 1.75 m
 * tall on a 1.95 m pitch; the photo scales the blade to about 2.5-3 m
 * deep, but it is drawn 5 m deep with letters 2.3 m wide, the fan crest to
 * 27.4 and the spike to 30.9, after review, so the sign stays the dominant
 * feature at phone size), the marquees, the window bays, the bands. The sign's position
 * along Canal (x = 11) is estimated from the photo. The auditorium's Basin
 * Street side and the back are not photographed and are drawn plain
 * brick.
 * Left out: the fire escapes, the light bulbs, the marquee's own lettering,
 * the billboard.
 *
 * Night: the sign letters and crest and the marquee's fan are `neon-*`;
 * the Rampart front is floodlit; the windows glow.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { prism, cornice, box, save, type XY } from './atl-flatiron-building'
import { faceOf, fp, fprism, fpanel, farch, fblock, qf, rect, type Face } from './nola-gallier-hall'
import { Pen, strokes } from './lettering'

const brick = new Part(), trim = new Part(), win = new Part(), roof = new Part(), sign = new Part(), neon = new Part()

const XR = 19.76 // the North Rampart wall (model +x)
const YC = -51.1, YBAY = -23, YAUD = -14, YGAB = -9, YFLY = 35, YB = 52.2
const XB = -19.95 // Basin Street side

// ── the Canal corner block: four brick storeys over a white ground floor ──
const block: XY[] = [[XB, -51.26], [XR, -51.0], [XR, YAUD], [XB, YAUD]]
prism(trim, block, 0, 5.0, null, 0)
prism(brick, block, 5.0, 15.6, null, 0)
prism(trim, block, 15.6, 17.2, roof, 0.25)
cornice(trim, block, 16.2, 1.0, 0.6, null)
// the raised spine over the lobby (lidar 19-22.6)
box(brick, -2, 6, YC + 1, YAUD, 15.6, 21.0, roof, 0.2)

const storeys: [number, number][] = [[5.8, 7.6], [8.4, 10.2], [11.0, 12.8], [13.5, 15.1]]
const canal = faceOf([XB, -51.26], [XR, -51.0])
const cx = (x: number) => x - XB // s along the Canal face
const XS = 11.0, BAY0 = 7.6, BAY1 = 14.4 // the blade's line and the Canal entrance bay
for (const x of [-17.6, -13.9, -10.2, -6.5, -2.8, 0.9, 4.6, 17.1]) {
  if (x < BAY0) {
    fpanel(win, canal, cx(x) - 1.3, cx(x) + 1.3, 0.5, 3.7, 0.06) // shop window in the white ground storey
    // a thin dark-green awning, sloping out over the window
    const A = fp(canal, cx(x) - 1.55, 0.05, 4.6), B = fp(canal, cx(x) + 1.55, 0.05, 4.6)
    const C = fp(canal, cx(x) + 1.55, 1.5, 3.9), D = fp(canal, cx(x) - 1.55, 1.5, 3.9)
    const dn = (q: V3): V3 => [q[0], q[1], q[2] - 0.12]
    qf(sign, A, B, C, D, [0, -0.5, 1]); qf(sign, dn(A), dn(B), dn(C), dn(D), [0, 0.5, -1])
    qf(sign, D, C, dn(C), dn(D), [0, -1, 0]); qf(sign, A, D, dn(D), dn(A), [-1, 0, 0]); qf(sign, B, C, dn(C), dn(B), [1, 0, 0])
  }
  for (const [z0, z1] of storeys) fpanel(win, canal, cx(x) - 0.65, cx(x) + 0.65, z0, z1)
}
for (const x of [-19.4, -11.9, -4.6, 2.8]) fblock(trim, canal, cx(x) - 0.6, cx(x) + 0.6, 0, 5.0, 0.4) // white piers
// the Canal entrance bay: cream terracotta, the great arched window, the doors
fblock(trim, canal, cx(BAY0), cx(BAY1), 0, 18.4, 0.4)
farch(win, canal, cx(XS), 3.0, 7.6, 15.4, 0.45)
fpanel(win, canal, cx(XS) - 2.6, cx(XS) + 2.6, 0.4, 4.0, 0.45)

// the Rampart face of the corner block
const ramp = faceOf([XR, -51.0], [XR, 46.29]) // s runs from Canal back toward Iberville
const rs = (y: number) => y + 51.0
for (let k = 0; k < 6; k++) {
  const y = -48.5 + k * 4.4
  fpanel(win, ramp, rs(y) - 1.4, rs(y) + 1.4, 0.6, 4.2, 0.3)
  for (const [z0, z1] of storeys) fpanel(win, ramp, rs(y) - 0.65, rs(y) + 0.65, z0, z1)
}
// the Basin face of the corner block: windows above, plain below
const basin = faceOf([XB, YAUD], [XB, -51.26])
for (let k = 0; k < 8; k++) {
  for (const [z0, z1] of storeys) fpanel(win, basin, 2.5 + k * 4.3 - 0.65, 2.5 + k * 4.3 + 0.65, z0, z1)
  fpanel(win, basin, 2.5 + k * 4.3 - 1.4, 2.5 + k * 4.3 + 1.4, 0.6, 4.2, 0.05)
}

// ── the entrance bay: cream terracotta, the great arched window ──
fblock(trim, ramp, rs(YBAY), rs(YAUD), 0, 20.0, 0.4)
fprism(trim, ramp, [[rs(YBAY) - 0.2, 20.0], [rs(YAUD) + 0.2, 20.0], [rs(YAUD) + 0.2, 20.8], [rs(YBAY) - 0.2, 20.8]], 0, 0.7)
farch(win, ramp, rs((YBAY + YAUD) / 2), 3.2, 8.4, 16.8, 0.45)
fpanel(win, ramp, rs((YBAY + YAUD) / 2) - 2.6, rs((YBAY + YAUD) / 2) + 2.6, 0.4, 4.0, 0.45) // the doors

// ── the auditorium: brick walls, flat at the front, then a gable roof ──
prism(brick, rect(XB, YAUD, XR, YFLY), 0, 19.3, null, 0)
cornice(trim, rect(XB, YAUD, XR, YFLY), 19.3, 1.0, 0.5, null)
box(roof, XB + 0.5, XR - 0.5, YAUD + 0.5, YGAB, 19.3, 20.6, roof, 0.1)
const zr = 27.0, xr = 1.0, ze = 20.3
qf(roof, [XB - 0.3, YGAB, ze], [XB - 0.3, YFLY, ze], [xr, YFLY, zr], [xr, YGAB, zr], [-1, 0, 2.5])
qf(roof, [XR + 0.3, YGAB, ze], [xr, YGAB, zr], [xr, YFLY, zr], [XR + 0.3, YFLY, ze], [1, 0, 2.5])
fprism(brick, faceOf([XR, YGAB], [XB, YGAB]), [[0, ze], [XR - XB, ze], [XR - xr, zr]], -0.3, 0)
// the Rampart wall: cream base, a frieze band, a balcony band, arched upper windows
fblock(trim, ramp, rs(YAUD), rs(YFLY), 0, 4.9, 0.2)
fblock(trim, ramp, rs(YAUD), rs(YFLY), 11.2, 12.0, 0.25)
fblock(trim, ramp, rs(-11), rs(4), 7.6, 8.0, 0.9) // the balcony
for (let k = 0; k < 6; k++) farch(win, ramp, rs(-8.0 + k * 2.6), 1.6, 13.0, 17.6)
for (let k = 0; k < 6; k++) fpanel(win, ramp, rs(8.0 + k * 4.2) - 0.55, rs(8.0 + k * 4.2) + 0.55, 6.4, 9.0)

// ── the fly tower at the Iberville end ──
const fly: XY[] = [[XB, YFLY], [XR, YFLY], [XR, 46.29], [17.84, 46.27], [17.85, YB], [-17.92, 51.97], [-17.93, 36.36], [XB, 36.35]]
prism(brick, fly, 0, 29.9, roof, 0.25)
cornice(trim, fly, 28.9, 1.0, 0.4, null)
for (let k = 0; k < 3; k++) for (const [z0, z1] of [[10.0, 12.2], [14.0, 16.2]] as [number, number][]) fpanel(win, ramp, rs(38 + k * 3.2) - 0.5, rs(38 + k * 3.2) + 0.5, z0, z1)

// ── the canopy along Rampart ──
fprism(roof, ramp, [[rs(YAUD), 4.9], [rs(48), 4.9], [rs(48), 5.6], [rs(YAUD), 5.6]], 0, 3.5, true)

// ── the marquee under the blade: a box with a fan on top ──
{
  const F = ramp
  // the Rampart entrance's marquee (no blade here)
  const m0 = rs(YBAY + 0.6), m1 = rs(YAUD - 0.6)
  fprism(sign, F, [[m0, 4.4], [m1, 4.4], [m1, 6.6], [m0, 6.6]], 0.45, 3.0, true)
  const c = (m0 + m1) / 2, r = 1.3, fan: XY[] = []
  for (let i = 0; i <= 8; i++) { const a = (i / 8) * Math.PI; fan.push([c + r * Math.cos(a), 6.6 + r * 0.75 * Math.sin(a)]) }
  fprism(neon, F, fan, 2.7, 3.0, true)
}
{
  // the Canal marquee under the blade
  const F = canal, m0 = cx(BAY0 - 0.6), m1 = cx(BAY1 + 0.6)
  fprism(sign, F, [[m0, 4.4], [m1, 4.4], [m1, 6.8], [m0, 6.8]], 0.45, 3.4, true)
  const c = (m0 + m1) / 2, r = 1.6, fan: XY[] = []
  for (let i = 0; i <= 8; i++) { const a = (i / 8) * Math.PI; fan.push([c + r * Math.cos(a), 6.8 + r * 0.75 * Math.sin(a)]) }
  fprism(neon, F, fan, 3.05, 3.4, true)
}

// ── the blade sign ──
{
  // The blade stands out from the Canal front along -y at x = XS; its two faces look along Canal (±x).
  const yw = -51.1, out0 = yw - 0.4, out1 = yw - 5.4, zb = 7.0, zt = 22.9, th = 0.45
  const ym = (out0 + out1) / 2, w = out0 - out1
  const faceS = faceOf([XS - th, out0], [XS - th, out1]) // faces -x (up Canal); u from the wall outward
  const faceN = faceOf([XS + th, out1], [XS + th, out0]) // faces +x (toward the river); u from the street in
  // the blade, its foot curving in, and the crest: a fan over the S with scrolls
  fprism(sign, faceS, [[0, zb + 0.8], [w * 0.5, zb], [w, zb + 0.8], [w, zt], [0, zt]], -2 * th, 0, true)
  // the crest: a bold fan rising over the blade, with scroll ears either side
  fprism(sign, faceS, [[-0.3, zt], [w + 0.3, zt], [w + 0.8, zt + 1.0], [w + 0.4, zt + 2.2], [w * 0.5 + 1.0, zt + 3.8], [w * 0.5, zt + 4.5], [w * 0.5 - 1.0, zt + 3.8], [0.0, zt + 2.2], [-0.35, zt + 1.0]], -2 * th, 0, true)
  for (const F of [faceS, faceN]) {
    // the fan's rays, lit
    for (const a of [-1.15, -0.6, 0, 0.6, 1.15]) {
      const tx = Math.sin(a), tz = Math.cos(a), ox = Math.cos(a) * 0.16, oz = -Math.sin(a) * 0.16, L0 = 0.5, L1 = a === 0 ? 4.0 : 3.1
      const c: XY = [w * 0.5, zt + 0.15]
      fprism(neon, F, [[c[0] + tx * L0 - ox, c[1] + tz * L0 - oz], [c[0] + tx * L0 + ox, c[1] + tz * L0 + oz], [c[0] + tx * L1 + ox, c[1] + tz * L1 + oz], [c[0] + tx * L1 - ox, c[1] + tz * L1 - oz]], 0, 0.1)
    }
    // the scroll ears
    for (const u of [-0.05, w + 0.35]) {
      const ring: XY[] = Array.from({ length: 10 }, (_, i) => [u + 0.45 * Math.cos((i / 10) * 2 * Math.PI), zt + 1.1 + 0.45 * Math.sin((i / 10) * 2 * Math.PI)] as XY)
      fprism(neon, F, ring, 0, 0.1)
    }
    // a cream border round the blade
    for (const [a, b, z0, z1] of [[0.08, 0.24, zb + 1.3, zt - 0.08], [w - 0.24, w - 0.08, zb + 1.3, zt - 0.08], [0.3, w - 0.3, zb + 1.1, zb + 1.27]] as [number, number, number, number][])
      fprism(neon, F, [[a, z0], [b, z0], [b, z1], [a, z1]], 0, 0.08)
  }
  // the spike
  box(sign, XS - 0.12, XS + 0.12, ym - 0.12, ym + 0.12, zt + 4.4, zt + 8.0, null, 0)
  box(sign, XS - 0.3, XS + 0.3, ym - 0.3, ym + 0.3, zt + 4.4, zt + 4.9, sign, 0.05)

  // ── the letters, traced from the photo: Roman capitals with small serifs ──
  // Letter units: cap height 1, condensed widths (about 0.75) as in the photo.
  const L: Record<string, () => Pen> = {
    S: () => new Pen()
      .moveTo([0.68, 0.86]).cubicTo([0.6, 1.0], [0.12, 1.02], [0.1, 0.76], 6)
      .cubicTo([0.08, 0.52], [0.66, 0.5], [0.68, 0.24], 6)
      .cubicTo([0.68, -0.02], [0.14, -0.02], [0.06, 0.14], 6),
    A: () => new Pen()
      .moveTo([0.0, 0.0]).lineTo([0.38, 1.0]).lineTo([0.76, 0.0])
      .moveTo([0.17, 0.36]).lineTo([0.6, 0.36])
      .moveTo([-0.08, 0.0]).lineTo([0.14, 0.0]).moveTo([0.62, 0.0]).lineTo([0.84, 0.0]),
    E: () => new Pen()
      .moveTo([0.66, 0.86]).lineTo([0.66, 1.0]).lineTo([0.06, 1.0]).lineTo([0.06, 0.0]).lineTo([0.68, 0.0]).lineTo([0.68, 0.14])
      .moveTo([0.06, 0.52]).lineTo([0.5, 0.52]),
    N: () => new Pen()
      .moveTo([0.06, 0.0]).lineTo([0.06, 1.0]).lineTo([0.7, 0.0]).lineTo([0.7, 1.0])
      .moveTo([-0.06, 0.0]).lineTo([0.18, 0.0]).moveTo([0.58, 1.0]).lineTo([0.82, 1.0]),
    G: () => new Pen()
      .moveTo([0.7, 0.84]).cubicTo([0.6, 1.02], [0.06, 1.06], [0.04, 0.5], 7)
      .cubicTo([0.04, -0.06], [0.62, -0.04], [0.7, 0.14], 6).lineTo([0.7, 0.44]).lineTo([0.42, 0.44]),
    R: () => new Pen()
      .moveTo([0.06, 0.0]).lineTo([0.06, 1.0]).lineTo([0.44, 1.0])
      .cubicTo([0.76, 1.0], [0.76, 0.5], [0.44, 0.5], 6).lineTo([0.06, 0.5])
      .moveTo([0.36, 0.5]).lineTo([0.74, 0.0])
      .moveTo([-0.06, 0.0]).lineTo([0.2, 0.0]),
  }
  const word = 'SAENGER', H = 1.75, HU = 3.0, pitch = 1.95, ztop = zt - 0.4 // letters wide on the broad blade
  for (let i = 0; i < word.length; i++) {
    const pen = L[word[i]](), v0 = ztop - H - i * pitch
    // read from up Canal (-x): the reader's right is -y
    const placeS = (u: number, v: number, wq: number): V3 => [XS - th - wq, ym + 0.375 * HU - u * HU, v0 + v * H]
    strokes(neon, pen.paths, { width: 0.14, depth: 0.12, place: placeS })
    // read from down Canal (+x): the reader's right is +y
    const placeN = (u: number, v: number, wq: number): V3 => [XS + th + wq, ym - 0.375 * HU + u * HU, v0 + v * H]
    strokes(neon, pen.paths, { width: 0.14, depth: 0.12, place: placeN })
  }
}

const rampartLight = (p: V3, n: V3) => (n[2] > 0.7 ? 0 : n[0] > 0.5 && p[1] < YFLY ? 0.6 : 0)
await save('nola-saenger-theatre', 'Saenger Theatre', [
  { part: brick, material: { ...finish('saenger-brick', 0xbd8670), floodlight: rampartLight } },
  { part: trim, material: { ...finish('saenger-terracotta', 0xf0e6d2), floodlight: rampartLight } },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: sign, material: finish('saenger-sign', 0x4d6a5a) },
  { part: neon, material: finish('neon-saenger', 0xf6eed8) },
], { bearing: 38, osm: 'way/367725783', height: 29.9 }, 6500)
