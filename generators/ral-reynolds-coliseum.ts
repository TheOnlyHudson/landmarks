/**
 * William Neal Reynolds Coliseum, NC State University, Raleigh (begun
 * 1942, opened 1949; renovated 2016): procedural, CC0-1.0.
 * bun generators/ral-reynolds-coliseum.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 24.3 (the
 * OSM long walls); +y is the main front, the limestone entrance pavilion.
 * Origin: the area centroid of OSM way/47837937 (-78.669897, 35.783531).
 * y = 0 is the lowest ground under the footprint, the south-west corner.
 * Mapterhorn (z13; z14–15 missing here) puts the front street ~4.8 m above
 * it and the rear ~0.5–2.5 m: the site falls to the south, so the rear
 * shows its basement. Front detail starts at GF = 4.8; the side windows
 * follow `ground(y)`. Elevation 0.
 *
 * OSM: way/47837937 "Reynolds Coliseum" (no height or levels): in this
 * frame a 53.2 × 112.2 m rectangle (x ±26.6, y −58.2..54.0) and the front
 * pavilion, 25.3 m wide, projecting 8.8 m (to y 62.7).
 * Published: 371 × 180 ft (113 × 55 m) outside, arena 312 × 108 ft
 * (1954 Dixie Classic programme, page 5; r09), so OSM agrees.
 * No lidar covers Wake County. Heights are estimated:
 *  - the pavilion 16.5 m over the front street, its piers 0.4 m more:
 *    scaled from r01 against its width (25.3 m, OSM) and door heights;
 *    the canopy's soffit 3.7 m up, its fascia 1.4 m deep (r01);
 *  - the brick body 13 m over the front street (17–18 m at the rear): in
 *    r06 and r08 the brick ends stand at three-quarters of the pavilion;
 *  - the arena's raised centre: NAIP shows a dark membrane roof 28 m wide
 *    over the arena, between white flat roofs over the side concourses,
 *    and casts a narrow shadow onto the west one. From the street (r01)
 *    no roof shows over the pavilion's parapet, so the raised centre is
 *    kept low and narrow: walls 0.6 m over the side roofs and a shallow
 *    arch (the arched trusses inside, r02) rising 1.8 m more, its crown
 *    (18.7 m) under the front block's parapet (18.8 m) and the pavilion
 *    (21.3 m), and 22.8 m wide, inside the pavilion's 25.4 m. NAIP's
 *    28 m membrane is the wider figure; the street view wins here.
 *  - windows: the pavilion's three tall windows 1.6 × 6.4 m (r01); the
 *    brick walls' bays from r06 and r08 (two-storey upper panels over a
 *    pale string course, shorter lower windows).
 *
 * Photos (evidence):
 *  r01 "ReynoldsColiseumOUTSIDE.jpg", Greenstrat, public domain (2006)
 *      https://commons.wikimedia.org/wiki/File:ReynoldsColiseumOUTSIDE.jpg
 *  r02 "Reynolds Coliseum.jpg", Greenstrat, public domain (interior)
 *      https://commons.wikimedia.org/wiki/File:Reynolds_Coliseum.jpg
 *  r03 "Reynolds Coliseum and NC State Hall of Fame", Gerry Dincher, CC BY-SA 2.0
 *      https://www.flickr.com/photos/11629603@N04/32427068434
 *  r04 "Reynold's Coliseum.jpg", Melizabethi123, CC BY-SA 3.0 (the front)
 *      https://commons.wikimedia.org/wiki/File:Reynold%27s_Coliseum.jpg
 *  r05 "Reynolds Coliseum, Raleigh, NC", chucka_nc, CC BY-SA 2.0 (dusk, piers lit red)
 *      https://www.flickr.com/photos/7475921@N05/36711454654
 *  r06 "William Neal Reynolds Coliseum on the North Carolina State campus"
 *      (postcard), UNC Libraries, public domain mark
 *      https://www.flickr.com/photos/122654055@N06/22706368009
 *  r08 "Reynolds Coliseum, 1953 Dixie Classic program page 05.jpg", NC State College, public domain (drawing)
 *      https://commons.wikimedia.org/wiki/File:Reynolds_Coliseum,_1953_Dixie_Classic_program_page_05.jpg
 *  r09 "1954 Dixie Classic program page 05.jpg", NC State College, public domain
 *      https://commons.wikimedia.org/wiki/File:1954_Dixie_Classic_program_page_05.jpg
 * Aerial: USGS NAIP (public domain): plan, the roofs and their colours.
 * Look-only: State Archives of North Carolina construction photos
 * (1944–49, "no known restrictions" on Flickr), looked at only for the
 * steel arched roof frame.
 *
 * Colours: limestone pale warm grey (r01); brick a muted red (r01's edge,
 * r06), pulled light; the arena roof a dark membrane, the side roofs white
 * (NAIP).
 * Invented: the rear (south) end and the long sides' current windows: no
 * licensed modern photo of them was found; drawn from the 1949 postcard
 * (r06) and drawing (r08). The 2016 renovation's glazed lobby (r03, inside)
 * isn't placed outside: its position isn't evidenced.
 * Left out: the flagpoles, the lettering on the canopy, the side stairs.
 * Night: the pavilion's piers are uplit (r05, red there): `_FLOODLIGHT` on
 * the limestone's front faces; the windows glow.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'
import { type XY, type Face, rect, prism, capRing, lathe, flatShape, finishGlb, writeModel } from './sea-tacoma-union-station'
import { box, panel } from './nash-tennessee-state-capitol'

const W = 26.6, Y0 = -58.2, Y1 = 54.0
const GF = 4.8
const BODY = GF + 11.5 // brick parapet
const FRONT = GF + 14.0, FY0 = 30 // the taller brick block behind the pavilion (r06)
const AX = 11.4, AEAVE = BODY + 0.6, ACROWN = AEAVE + 1.8 // the arena's raised centre, hidden behind the front (r01)
const PX = 12.7, PY1 = 62.7, PTOP = GF + 16.5
const ground = (y: number) => Math.max(0.6, 2.9 + 0.035 * y)

function build() {
  const brick = new Part(), lime = new Part(), win = new Part(), door = new Part(), dark = new Part(), trim = new Part()

  // ------------------------------------------------------------ the brick body
  const body = rect(-W, Y0, W, Y1)
  prism(brick, null, body, 0, BODY)
  // side roofs (white membrane) with a pale coping
  capRing(trim, rect(-W, Y0, -AX, Y1), BODY, true)
  capRing(trim, rect(AX, Y0, W, Y1), BODY, true)
  for (const [x0, x1] of [[-W, -AX], [AX, W]]) {
    capRing(trim, rect(x0, Y0, x1, Y0 + 1.5), BODY, true)
  }
  // coping band round the parapet
  const faces: { f: Face; L: number; y?: number }[] = [
    { f: { o: [-W, Y0, 0], n: [0, -1] }, L: 2 * W },
    { f: { o: [W, Y0, 0], n: [1, 0] }, L: Y1 - Y0 },
    { f: { o: [W, Y1, 0], n: [0, 1] }, L: 2 * W },
    { f: { o: [-W, Y1, 0], n: [-1, 0] }, L: Y1 - Y0 },
  ]
  for (const { f, L } of faces) panel(trim, f, L / 2, L, BODY - 0.6, BODY, 0.08)

  // the taller brick block at the front (r06: a storey and more over the long walls)
  box(brick, -W, FY0, W, Y1, BODY, FRONT, trim, 0)
  {
    const fr: Face = { o: [W, Y1, 0], n: [0, 1] }
    panel(trim, fr, W, 2 * W, FRONT - 0.6, FRONT, 0.08)
    for (const sx of [-1, 1]) {
      const f: Face = sx > 0 ? { o: [W, FY0, 0], n: [1, 0] } : { o: [-W, Y1, 0], n: [-1, 0] }
      panel(trim, f, (Y1 - FY0) / 2, Y1 - FY0, FRONT - 0.6, FRONT, 0.08)
      for (let k = 0; k < 4; k++) panel(win, f, 3 + k * 6, 3.4, BODY + 0.4, FRONT - 1.2, 0.05)
    }
  }
  // the arena's raised centre: low walls and a shallow arched roof
  const AY0 = Y0 + 1.5, AY1 = FY0
  prism(brick, null, rect(-AX, AY0, AX, AY1), BODY, AEAVE)
  const NS = 12
  const prof: XY[] = []
  for (let i = 0; i <= NS; i++) {
    const x = -AX + (2 * AX * i) / NS
    prof.push([x, AEAVE + (ACROWN - AEAVE) * (1 - (x / AX) ** 2)])
  }
  const nrm = (x: number): V3 => {
    const dz = (-2 * (ACROWN - AEAVE) * x) / (AX * AX), l = Math.hypot(dz, 1)
    return [-dz / l, 0, 1 / l]
  }
  for (let i = 0; i < NS; i++) {
    const [xa, za] = prof[i], [xb, zb] = prof[i + 1]
    const a: V3 = [xa, AY0, za], b: V3 = [xb, AY0, zb], c: V3 = [xb, AY1, zb], d: V3 = [xa, AY1, za]
    dark.tri(a, b, c, undefined, undefined, undefined, [nrm(xa), nrm(xb), nrm(xb)])
    dark.tri(a, c, d, undefined, undefined, undefined, [nrm(xa), nrm(xb), nrm(xa)])
  }
  // arched end walls
  for (const [y, s] of [[AY0, -1], [AY1, 1]] as [number, number][]) {
    for (let i = 0; i < NS; i++) {
      const [xa, za] = prof[i], [xb, zb] = prof[i + 1]
      const A: V3 = [xa, y, AEAVE], B: V3 = [xb, y, AEAVE], C: V3 = [xb, y, zb], D: V3 = [xa, y, za]
      if (s > 0) { brick.quad(B, A, D, C) } else { brick.quad(A, B, C, D) }
    }
  }

  // ------------------------------------------------------------ brick walls' windows
  const STRING = 9.4
  for (const { f, L } of faces) panel(trim, f, L / 2, L, STRING, STRING + 0.5, 0.07)
  // long sides: 16 bays
  for (const sx of [-1, 1]) {
    const f: Face = sx > 0 ? { o: [W, Y0, 0], n: [1, 0] } : { o: [-W, Y1, 0], n: [-1, 0] }
    const L = Y1 - Y0, bays = 16, bw = L / bays
    for (let k = 0; k < bays; k++) {
      const s = bw * (k + 0.5)
      const y = sx > 0 ? Y0 + s : Y1 - s
      panel(win, f, s, 3.4, STRING + 1.2, BODY - 1.6, 0.05)
      const g = ground(y)
      if (STRING - 0.8 - (g + 1.0) > 1.2) panel(win, f, s, 3.4, Math.max(g + 1.0, 3.2), STRING - 0.8, 0.05)
    }
  }
  // the rear end: eight bays
  {
    const f = faces[0].f, L = 2 * W, bays = 8, bw = L / bays
    for (let k = 0; k < bays; k++) {
      const s = bw * (k + 0.5)
      panel(win, f, s, 3.2, STRING + 1.2, BODY - 1.6, 0.05)
      panel(win, f, s, 3.2, 3.2, STRING - 0.8, 0.05)
    }
  }
  // the front's brick wings either side of the pavilion: four bays each
  {
    const f = faces[2].f // s runs from x = +W westward
    for (const [s0, s1] of [[0.6, W - PX - 0.4], [W + PX + 0.4, 2 * W - 0.6]]) {
      const bw = (s1 - s0) / 4
      for (let k = 0; k < 4; k++) {
        const s = s0 + bw * (k + 0.5)
        panel(win, f, s, 1.8, GF + 1.0, STRING - 0.8, 0.05)
        panel(win, f, s, 1.8, STRING + 1.2, BODY - 1.6, 0.05)
        panel(win, f, s, 1.8, BODY + 0.4, FRONT - 1.2, 0.05)
      }
    }
  }

  // ------------------------------------------------------------ the limestone pavilion
  prism(lime, dark, rect(-PX, Y1 - 0.5, PX, PY1), 0, PTOP)
  const fp: Face = { o: [PX, PY1, 0], n: [0, 1] } // s runs west from x = +PX
  const S = (x: number) => PX - x // x → s on the front face
  // piers: outer pair and inner pair, standing proud and rising over the parapet
  const PIERS: [number, number][] = [[-11.2, -8.4], [-4.6, -2.0], [2.0, 4.6], [8.4, 11.2]]
  for (const [x0, x1] of PIERS) {
    box(lime, x0, PY1 - 0.2, x1, PY1 + 0.6, 0, PTOP + 0.4, lime, 0.15)
    // the ribbed ornament near the top of each pier: three stacked bars
    const xc = (x0 + x1) / 2
    for (let k = 0; k < 3; k++) {
      const z = PTOP - 2.2 - k * 0.55
      box(trim, xc - 0.5 + k * 0.1, PY1 + 0.6, xc + 0.5 - k * 0.1, PY1 + 0.95, z, z + 0.36, trim, 0)
    }
  }
  // the three tall windows between the inner piers and either side
  for (const x of [-6.5, 0, 6.5]) {
    panel(win, fp, S(x), 2.1, GF + 5.1, GF + 11.6, 0.05)
  }
  // the band over the windows
  panel(lime, fp, PX, 2 * PX, GF + 12.4, GF + 12.8, 0.12)
  // the side faces of the pavilion: a tall window each
  for (const sx of [-1, 1]) {
    const f: Face = sx > 0 ? { o: [PX, Y1, 0], n: [1, 0] } : { o: [-PX, PY1, 0], n: [-1, 0] }
    panel(win, f, (PY1 - Y1) / 2, 1.6, GF + 5.1, GF + 11.6, 0.05)
  }

  // the entrance canopy: a slab on round columns over three door groups
  const CY1 = PY1 + 3.6
  box(lime, -13.4, PY1, 13.4, CY1, GF + 3.7, GF + 5.1, trim, 0.2)
  for (const x of [-11, -3.6, 3.6, 11]) lathe(lime, x, CY1 - 0.7, [[0.45, 0], [0.45, GF + 3.7]], 12)
  for (const x of [-7.2, 0, 7.2]) {
    panel(door, fp, S(x), 3.6, GF, GF + 2.7, 0.05)
    panel(trim, fp, S(x), 4.2, GF - 0.01, GF + 3.0, 0.03)
    panel(win, fp, S(x), 3.6, GF + 2.9, GF + 3.6, 0.05)
  }

  const flood = (p: V3, n: V3) => (p[1] > PY1 - 0.5 && n[1] > 0.5 && p[2] > GF ? 0.85 : 0)
  return finishGlb('Reynolds Coliseum', [
    { part: brick, material: finish('rey-brick', 0xb87a66) },
    { part: lime, material: <Swatch>{ ...finish('rey-limestone', 0xe2ded4), floodlight: flood } },
    { part: win, material: PALETTE.window },
    { part: door, material: { ...PALETTE.entrance, color: 0x8a5a52 } },
    { part: dark, material: finish('rey-roof', 0x7d8389) },
    { part: trim, material: PALETTE.trim },
  ], { bearing: 24.3, height: ACROWN, replaces: ['way/47837937'] }, 5000)
}

if (import.meta.main) await writeModel('ral-reynolds-coliseum', build())
