/**
 * Edenton Street United Methodist Church, Raleigh (sanctuary 1958, after the
 * 1956 fire; Poindexter Memorial Building 1937), with the attached
 * fellowship and education buildings: procedural, CC0-1.0.
 * bun generators/ral-edenton-street-umc.ts [out.glb]
 *
 * Identity: OSM relation/14713078 (225 West Edenton Street, wikidata
 * Q5337018), a multipolygon of six outer ways that together outline the
 * whole church block between McDowell and Dawson streets. The lead's point
 * (-78.6413, 35.7808) lies ~130 m south-east of it, across Edenton Street;
 * the relation is the church (address, photo of the tower on Edenton St).
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 2.7 (the OSM
 * edges run at 2.7° / 92.7°). Origin: the area centroid of the relation's
 * assembled outline (-78.6426408, 35.7817636). Because one relation covers
 * every building, the model draws all of them: the sanctuary and tower in
 * full, the others as plain gabled or flat masses.
 *
 * Ground: Mapterhorn z13 falls ~4 m from Edenton Street (south) to the back
 * of the block (north-east), the lowest point under the footprint, y = 0.
 * The church front stands on G = 3.2, the Poindexter front on 2.2, the west
 * building on 3.5; heights below are from those. Walls run down to y = 0.
 * Elevation 0.
 *
 * Plan (OSM ways in the model frame; parts from NAIP):
 *  - sanctuary (way/47776557): nave x -5.97 … 12.6, y -19 … 21.1, gabled
 *    N–S (NAIP: slate ridge on the axis); a hipped cross-wing at its north
 *    end, x -17.4 … 12.7, y 21.1 … 34.8; low entrance blocks either side of
 *    the tower along Edenton Street, y -25.2 … -19, rounded at the outer
 *    corners (photo e1);
 *  - tower: x -2.5 … 9.1 (OSM's front projection, 11.6 m), built as an
 *    11.6 m square base centred on the nave; it IS the church's south front
 *    (e1), with the low entrance wings set back either side;
 *  - Poindexter Memorial Building (way/47692680): x 33 … 54, slate roof
 *    N–S, hipped at the south, a cross gable over its central entrance
 *    (postcard pc, NAIP);
 *  - the link between them (way/199826256), gabled E–W (NAIP);
 *  - west building (way/47776552), gabled N–S, slate (NAIP; look-only l1);
 *    the flat-roofed block (way/1028702029) and the low hipped south piece
 *    (way/1028702030) between it and the sanctuary (NAIP).
 *
 * Heights (no lidar over Wake County; no published height for the 1958
 * tower was found: Wikipedia, Clio, WALTER, NCSU NC Architects give only the
 * burned 1887 tower's 183 ft). Tower: estimated by a pinhole-camera fit to e1.
 * e1 looks up ~28° from ~33 m; the fit takes the ground (image y 1530), the
 * tip at 52.5 m (kept from the approved model) and OSM's 11.6 m base width
 * (445 px), and reads the rest off the photo (all above G): doors 3.9 m wide
 * to 3.2; portal frame 5.5 m wide, pointed opening 4.2 m to apex 7.7, carved
 * band 8.5–9.5, frame top 9.8; base block and its corner piers (stone
 * tracery panels 9.0–11.7) to 12; shaft 9.8 m wide over its piers, piers
 * stepping in at 15.4, 20.3 (with gablets), 24.9 and 28.6 to 8.3 m; core
 * 7.8 m; belfry band 20.3, two blind lancets 20.8–22.6, louvred opening
 * 2.3 m wide 22.9–~29.3 in a 3.1 m stone frame; top stage 7.3 m to 31.3;
 * stone parapet (7.6 m, chamfered corners) to 34; spire 3.2 m across at its
 * foot, tip 52.5, cross to 54.1. The fit is sensitive to the camera
 * distance (±3 m on the parapet for ±3 m of distance). Look-only l2, taken
 * from farther off, agrees (parapet ~3.2 base widths up, spire ~1.5).
 * The old model's slim 40.6 m shaft was wrong: e1 shows a broad base
 * tapering in steps, with a taller spire. Entrance wings 6.2 to their
 * stone coping, a band at 4.7 (e1; were 11). Nave eaves 11.5, ridge 17.5
 * (its shoulders show either side of the tower in e1). Other
 * buildings from storey counts in pc and l1: Poindexter eaves 12, ridge 18;
 * west building eaves 11, ridge 17; link eaves 10, ridge 14; flat block 11;
 * south piece eaves 8, ridge 11.
 *
 * Photos:
 *  e1 "Edenton Street United Methodist Church.JPG", Farragutful, CC BY-SA 4.0
 *     (evidence), https://commons.wikimedia.org/wiki/File:Edenton_Street_United_Methodist_Church.JPG
 *     — the tower and front from Edenton Street (south): red brick, cast-stone
 *     trim, stepped buttresses, belfry lancet, copper spire, rounded corners.
 *  pc "Edenton Street Methodist Church and Poindexter Memorial Educational
 *     Building, Raleigh, N.C.", UNC Libraries Commons, public domain mark
 *     (evidence for the Poindexter building only; the church in it burned
 *     in 1956), https://www.flickr.com/photos/122654055@N06/22477711963
 * Look-only (CC BY-NC-ND, looked at, not copied; the model doesn't rest on
 * them alone):
 *  l1 "Edenton Street United Methodist Church steeple and …", alex_ford,
 *     https://www.flickr.com/photos/23089745@N03/5505030478 — from a high
 *     building: the octagonal stone base and banded copper spire, slate
 *     roofs and brick gables behind.
 *  l2 "Raleigh-PhotoWalk-44", gcraig3si, https://www.flickr.com/photos/8946362@N07/6202523240
 * Aerial: USGS NAIP (public domain): roofs and the plan.
 *
 * Doubts: only the south front has a licensed photo. The nave's sides, the
 * cross-wing and the backs of all buildings are unphotographed: the nave's
 * five tall lancets a side are an assumption (the usual bay rhythm of a
 * 1950s Gothic sanctuary), not evidence; the other buildings' windows are
 * generic grouped panels. The tower's depth and the nave's heights are
 * estimates; the stage heights rest on one upward-looking photo and an
 * assumed total height (±4 m). The tower's sides and back are drawn like its
 * front; only the front is photographed in licensed form.
 * Colours: brick 0xb36e58 (e1's orange-red, pulled light), cast stone
 * 0xe8dfcf, slate 0x80868c (l1, NAIP), weathered copper 0x8e9c97 (e1).
 * Night: windows; no floodlighting evidence.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Face, ccw, prism, capRing, flatShape, extrudeShape, arc, lathe, disc, finishGlb, writeModel } from './sea-tacoma-union-station'
import { box, quadO, triO, panel } from './nash-tennessee-state-capitol'
import { prismX, prismY, roofX, roofY } from './ral-holy-name-of-jesus-cathedral'
import { pointedShape, lancet, wingWindows, pinnacle } from './ral-first-baptist-church'

/** A hipped roof over x0..x1 × y0..y1 (ridge along the longer side), eaves ze, ridge zr, overhang ov. */
function hipRoof(p: Part, x0: number, x1: number, y0: number, y1: number, ze: number, zr: number, ov = 0.4) {
  x0 -= ov; x1 += ov; y0 -= ov; y1 += ov
  const alongX = x1 - x0 >= y1 - y0
  const hw = alongX ? (y1 - y0) / 2 : (x1 - x0) / 2
  const k = (zr - ze) / (hw - ov)
  ze -= ov * k * 0.5
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
  const A: V3 = [x0, y0, ze], B: V3 = [x1, y0, ze], C: V3 = [x1, y1, ze], D: V3 = [x0, y1, ze]
  const r0: V3 = alongX ? [x0 + hw, cy, zr] : [cx, y0 + hw, zr]
  const r1: V3 = alongX ? [x1 - hw, cy, zr] : [cx, y1 - hw, zr]
  if (alongX) {
    quadO(p, A, B, r1, r0, [0, -1, 1]); quadO(p, C, D, r0, r1, [0, 1, 1])
    triO(p, D, A, r0, [-1, 0, 1]); triO(p, B, C, r1, [1, 0, 1])
  } else {
    quadO(p, B, C, r1, r0, [1, 0, 1]); quadO(p, D, A, r0, r1, [-1, 0, 1])
    triO(p, A, B, r0, [0, -1, 1]); triO(p, C, D, r1, [0, 1, 1])
  }
  capRing(p, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], ze, false) // soffit, facing down
}

// ============================================================ dimensions
const G = 3.2 // church front ground above y = 0
const NX0 = -5.97, NX1 = 12.6, NC = (NX0 + NX1) / 2, NHW = (NX1 - NX0) / 2
const NY0 = -19.0, NY1 = 21.1
const EAVE = G + 11.5, RIDGE = G + 17.5, LIFT = 0.12
const TX0 = -2.5, TX1 = 9.1, TY0 = -26.64, TC = (TX0 + TX1) / 2
const WING = G + 6.2, BASE = G + 12, S5 = G + 28.6, PAR0 = G + 31.3, CAP = G + 34, TIP = G + 52.5

// OSM rings (model frame)
const POINDEXTER: XY[] = [[49.18, 24.82], [49.19, 21.42], [53.81, 21.43], [53.81, -1.59], [54.10, -1.58], [54.10, -26.22], [48.99, -26.23], [49.00, -27.33], [38.64, -27.34], [38.64, -26.17], [34.00, -26.18], [33.99, -24.47], [32.99, -24.48], [32.99, -14.94], [33.79, -14.93], [33.73, 4.67], [33.75, 15.98], [33.79, 21.39], [38.43, 21.39], [38.42, 24.82]]
const LINK: XY[] = [[33.75, 15.98], [16.31, 16.01], [16.31, 14.69], [12.62, 14.69], [12.60, 4.78], [17.59, 4.79], [17.58, -0.22], [32.22, -0.24], [32.22, 4.66], [33.73, 4.67]]
const WEST: XY[] = [[-25.70, 1.93], [-25.73, -16.86], [-25.46, -25.17], [-27.04, -25.20], [-27.11, -28.35], [-27.98, -29.28], [-41.86, -29.31], [-42.77, -28.49], [-42.79, -24.31], [-47.28, -24.32], [-47.31, -18.16], [-44.94, -18.15], [-45.04, 14.09], [-47.50, 14.10], [-47.54, 19.60], [-45.10, 19.86], [-45.11, 25.19], [-25.62, 25.25], [-25.69, 21.10]]
const FLAT: XY[] = [[-25.69, 21.10], [-5.96, 21.09], [-5.97, 1.93], [-25.70, 1.93]]
const SOUTH: XY[] = [[-25.73, -16.86], [-9.84, -16.91], [-9.67, -8.70], [-5.96, -8.52], [-5.97, -23.60], [-8.29, -23.66], [-8.18, -25.30], [-9.48, -25.96], [-10.85, -26.12], [-10.76, -27.66], [-22.10, -27.52], [-22.34, -25.14], [-25.46, -25.17]]
const NORTH_WING: XY[] = [[-17.36, 21.10], [12.69, 21.10], [12.69, 14.69], [16.31, 14.69], [16.30, 24.66], [12.70, 24.66], [12.70, 34.83], [-17.36, 34.83]]

function build() {
  const brick = new Part(), stone = new Part(), slate = new Part(), copper = new Part(), win = new Part(), door = new Part()

  // ============================================================ sanctuary: nave, cross-wing, entrance blocks
  prismY(brick, NY0, NY1 + 0.5, [[NX0, 0], [NX1, 0], [NX1, EAVE], [NC, RIDGE], [NX0, EAVE]])
  roofY(slate, NY0 - 0.4, NY1, NC, NHW, EAVE + LIFT, RIDGE + LIFT, 0.4, 0.25)
  // stone coping up the south gable, seen either side of the tower
  for (const sg of [-1, 1]) {
    const xa = NC + sg * NHW, xb = NC
    const sec: XY[] = [[xa, EAVE - 0.2], [xb, RIDGE], [xb, RIDGE + 0.6], [xa, EAVE + 0.4]]
    prismY(stone, NY0 - 0.25, NY0 + 0.6, sec)
  }
  prism(brick, null, ccw(NORTH_WING), 0, EAVE)
  hipRoof(slate, -17.36, 12.7, 21.1, 34.83, EAVE + LIFT, G + 19)
  capRing(slate, [[12.69, 14.69], [16.31, 14.69], [16.30, 24.66], [12.69, 24.66]], EAVE + 0.02)
  // low entrance wings either side of the tower, rounded at the outer corners,
  // well below the tower base (e1: top ~6.6 m, a stone band at ~4.9 m)
  for (const sg of [-1, 1]) {
    const xo = sg < 0 ? NX0 : NX1, xi = sg < 0 ? TX0 : TX1, R = 2.6
    const ring: XY[] = sg < 0
      ? [[xi, -25.2], [xi, NY0 + 0.2], [xo, NY0 + 0.2], ...arc(xo + R, -25.2 + R, R, 180, 270, 6).slice(0, -1)]
      : [[xi, -25.2], ...arc(xo - R, -25.2 + R, R, 270, 360, 6).slice(1), [xo, NY0 + 0.2], [xi, NY0 + 0.2]]
    const r = ccw(ring)
    prism(brick, null, r, 0, WING)
    prism(stone, stone, r, WING, WING + 0.45)
    prism(stone, null, r.map(([x, y]) => [x + (x < TC ? -0.06 : 0.06) * (Math.abs(x - xi) > 0.1 ? 1 : 0), y - 0.06] as XY), G + 4.7, G + 5.0)
  }

  // nave flanks: five tall lancets a side (assumed, see doubts) between brick buttresses
  for (const sg of [-1, 1]) {
    const f: Face = sg < 0 ? { o: [NX0, 0, 0], n: [-1, 0] } : { o: [NX1, 0, 0], n: [1, 0] }
    for (let k = 0; k < 5; k++) {
      const y = -12 + k * 6.6, s = sg < 0 ? -y : y
      lancet(win, stone, f, s, 2.2, G + 3.5, G + 9.6, 2)
      const sb = s + 3.3
      extrudeShape(brick, f, [[sb - 0.45, 0], [sb + 0.45, 0], [sb + 0.45, EAVE - 1.5], [sb - 0.45, EAVE - 1.5]], 0, 0.7)
    }
  }
  // cross-wing ends (east, west): one big lancet each
  lancet(win, stone, { o: [-17.36, 28, 0], n: [-1, 0] }, 0, 3.6, G + 3, G + 10, 3)
  lancet(win, stone, { o: [12.7, 29.8, 0], n: [1, 0] }, 0, 3.0, G + 3, G + 10, 3)

  // ============================================================ the tower: the church's south front
  // Heights from a camera fit to e1 (see header). Plan: an 11.6 m square
  // base (OSM's front projection), corner piers stepping in, a core 7.8 m wide.
  const TCY = TY0 + 5.8, B = 5.8, C = 3.9
  const fS = (s: number): Face => ({ o: [TC + s, TY0, 0], n: [0, -1] })
  // the base block, its front piers proud of the portal wall, a stone weathering on top
  box(brick, TC - B, TY0, TC + B, TY0 + 2 * B, 0, BASE)
  box(stone, TC - B - 0.12, TY0 - 0.5, TC + B + 0.12, TY0 + 2 * B + 0.12, BASE - 0.35, BASE - 0.05)
  for (const sx of [-1, 1]) {
    const xa = TC + sx * B, xb = TC + sx * (B - 1.7)
    box(brick, Math.min(xa, xb), TY0 - 0.4, Math.max(xa, xb), TY0 + 1.2, 0, BASE - 0.3, null)
    // the stone tracery panel near each pier's top (e1), front and outer side
    const s = sx * (B - 0.85)
    extrudeShape(stone, { o: [TC, TY0 - 0.4, 0], n: [0, -1] }, [[s - 0.65, G + 9.0], [s + 0.65, G + 9.0], [s + 0.65, BASE - 0.3], [s - 0.65, BASE - 0.3]], 0, 0.12)
    flatShape(door, { o: [TC, TY0 - 0.4, 0], n: [0, -1] }, pointedShape(s, 0.7, G + 9.4, G + 10.5, 0.8, 3), 0.14)
    const fs: Face = { o: [TC + sx * B, TY0 + 0.4, 0], n: [sx, 0] }
    extrudeShape(stone, fs, [[-0.65, G + 9.0], [0.65, G + 9.0], [0.65, BASE - 0.3], [-0.65, BASE - 0.3]], 0, 0.12)
  }
  // the deep stone portal: a frame 5.5 m wide to G+9.8, pointed opening 4.2 m
  // wide (apex G+7.7), stone tympanum over the double doors, carved band above
  {
    const zs = G + 4.6, top = G + 9.8, segs = 6
    const pa = pointedShape(0, 4.2, G, zs, 0.8, segs)
    const apex = pa[2 + segs], leftFlank = pa.slice(3 + segs).reverse() // springing → near apex
    const half: XY[] = [[-2.75, G], [-2.1, G], ...leftFlank, apex, [0, top], [-2.75, top]]
    for (const m of [1, -1]) extrudeShape(stone, fS(0), half.map(([s, z]) => [s * m, z] as XY), 0, 0.75)
    // the recess reads dark round a lighter stone tympanum (the deep reveal in shadow)
    flatShape(door, fS(0), pointedShape(0, 4.2, G + 3.2, zs, 0.8, segs), 0.03)
    flatShape(stone, fS(0), pointedShape(0, 3.2, G + 3.3, zs - 0.15, 0.8, segs), 0.05)
    flatShape(door, fS(0), [[-1.95, G], [1.95, G], [1.95, G + 3.2], [-1.95, G + 3.2]], 0.05)
    flatShape(stone, fS(0), [[-0.15, G], [0.15, G], [0.15, G + 3.3], [-0.15, G + 3.3]], 0.07)
    // the carved band: a deeper strip with dark tracery quatrefoils
    extrudeShape(stone, fS(0), [[-2.9, G + 8.5], [2.9, G + 8.5], [2.9, G + 9.5], [-2.9, G + 9.5]], 0.75, 0.9)
    for (const s of [-1.9, 0, 1.9]) flatShape(door, fS(0), [[s - 0.55, G + 8.75], [s, G + 9.3], [s + 0.55, G + 8.75], [s, G + 8.6]], 0.92)
    // steps
    box(stone, TC - 3.6, TY0 - 2.0, TC + 3.6, TY0, 0, G + 0.3)
    box(stone, TC - 3.2, TY0 - 1.2, TC + 3.2, TY0, G + 0.3, G + 0.6, stone)
  }
  // the shaft: core to the belfry top; corner piers step in with stone caps
  box(brick, TC - C, TCY - C, TC + C, TCY + C, BASE - 0.3, S5)
  const piers: [number, number, number][] = [[BASE, G + 15.4, 4.9], [G + 15.4, G + 20.3, 4.6], [G + 20.3, G + 24.9, 4.4], [G + 24.9, S5, 4.15]]
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const [z0, z1, e] of piers) {
    const xa = TC + sx * e, xb = TC + sx * (e - 1.6), ya = TCY + sy * e, yb = TCY + sy * (e - 1.6)
    const x0 = Math.min(xa, xb), x1 = Math.max(xa, xb), y0 = Math.min(ya, yb), y1 = Math.max(ya, yb)
    box(brick, x0, y0, x1, y1, z0 - 0.3, z1 - 0.3, null)
    box(stone, x0 - 0.08, y0 - 0.08, x1 + 0.08, y1 + 0.08, z1 - 0.3, z1)
  }
  // gablets on the piers at the belfry band (e1), on the two outer faces of each
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    const e = 4.4, m = e - 0.8
    const tri: XY[] = [[-0.8, G + 19.6], [0.8, G + 19.6], [0, G + 21.1]]
    extrudeShape(stone, { o: [TC + sx * m, TCY + sy * e, 0], n: [0, sy] }, tri, 0, 0.18)
    extrudeShape(stone, { o: [TC + sx * e, TCY + sy * m, 0], n: [sx, 0] }, tri, 0, 0.18)
  }
  // the belfry on each face: stone band, two blind lancets, the tall louvred
  // opening in a stone frame with a traceried head and a centre mullion
  box(stone, TC - C - 0.12, TCY - C - 0.12, TC + C + 0.12, TCY + C + 0.12, G + 19.9, G + 20.4)
  for (const n of [[0, -1], [0, 1], [-1, 0], [1, 0]] as XY[]) {
    const f: Face = { o: [TC + n[0] * C, TCY + n[1] * C, 0], n }
    extrudeShape(stone, f, pointedShape(0, 3.1, G + 20.4, G + 27.4, 0.75), 0, 0.12)
    flatShape(door, f, pointedShape(0, 2.3, G + 22.9, G + 27.6, 0.75), 0.15)
    flatShape(stone, f, pointedShape(0, 1.5, G + 27.6, G + 28.2, 0.75, 3), 0.17)
    flatShape(stone, f, [[-0.1, G + 22.9], [0.1, G + 22.9], [0.1, G + 28.2], [-0.1, G + 28.2]], 0.17)
    for (const s of [-0.6, 0.6]) flatShape(door, f, pointedShape(s, 0.8, G + 20.8, G + 22.0, 0.8, 3), 0.15)
  }
  // top stage, then the stone parapet with chamfered corners and corner pinnacles
  box(brick, TC - 3.65, TCY - 3.65, TC + 3.65, TCY + 3.65, S5 - 0.3, PAR0)
  const oct = (h: number, c: number): XY[] => ccw([[TC - h + c, TCY - h], [TC + h - c, TCY - h], [TC + h, TCY - h + c], [TC + h, TCY + h - c], [TC + h - c, TCY + h], [TC - h + c, TCY + h], [TC - h, TCY + h - c], [TC - h, TCY - h + c]])
  prism(stone, null, oct(3.8, 0.9), PAR0, CAP - 0.35)
  prism(stone, stone, oct(3.95, 0.95), CAP - 0.35, CAP) // the parapet's cornice lip
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) pinnacle(stone, TC + sx * 3.1, TCY + sy * 3.1, 0.6, CAP, CAP + 0.5, CAP + 1.6)
  // the banded copper spire, octagonal
  lathe(copper, TC, TCY, [[1.6, CAP], [1.5, CAP + 1.2], [0.12, TIP]], 8, 22.5, 382.5)
  box(stone, TC - 0.1, TCY - 0.1, TC + 0.1, TCY + 0.1, TIP - 0.2, TIP + 1.6, null)
  box(stone, TC - 0.55, TCY - 0.1, TC + 0.55, TCY + 0.1, TIP + 0.8, TIP + 1.0, null)
  // ============================================================ the other buildings
  // Poindexter Memorial Building (1937): red brick, stone trim, slate, three storeys (pc)
  {
    const PG = 2.2, E = PG + 12, R = PG + 18
    prism(brick, null, ccw(POINDEXTER), 0, E)
    hipRoof(slate, 33.0, 54.1, -27.3, 24.8, E + LIFT, R)
    // front cross gable over the entrance
    prismY(brick, -27.34, -16, [[37.6, E - 0.5], [49.6, E - 0.5], [43.6, E + 5.6]])
    roofY(slate, -27.6, -14, 43.6, 6.0, E + LIFT, E + 5.6 + LIFT, 0.3, 0.2)
    // stone quoins up the gable's corners (pc)
    for (const x of [37.6, 49.6]) box(stone, x - 0.4, -27.6, x + 0.4, -26.9, PG, E)
    const f: Face = { o: [43.6, -27.34, 0], n: [0, -1] }
    extrudeShape(stone, f, [[-1.8, PG], [1.8, PG], [1.8, PG + 5.0], [-1.8, PG + 5.0]], 0, 0.15)
    flatShape(door, { o: [43.6, -27.49, 0], n: [0, -1] }, [[-1.1, PG], [1.1, PG], [1.1, PG + 3.4], [-1.1, PG + 3.4]], 0.04)
    panel(win, f, 0, 1.4, PG + 9.0, PG + 11.0)
    wingWindows(win, ccw(POINDEXTER), [[PG + 1.0, PG + 3.4], [PG + 4.6, PG + 10.0]], 3.4, 1.8, 7)
  }
  // link (gabled E–W)
  prism(brick, null, ccw(LINK), 0, 10)
  roofX(slate, 12.6, 33.8, 7.9, 8.1, 10 + LIFT, 14 + LIFT, 0.3, 0.25)
  prismX(brick, 12.65, 33.7, [[-0.2, 9.9], [16.0, 9.9], [7.9, 14]])
  wingWindows(win, ccw(LINK), [[1.2, 3.6], [4.8, 8.6]], 3.6, 2.0, 8)
  // west building (gabled N–S)
  {
    const WG = 3.5, E = WG + 11, R = WG + 17
    prism(brick, null, ccw(WEST), 0, E)
    roofY(slate, -29.7, 25.6, -35.4, 9.9, E + LIFT, R + LIFT, 0.4, 0.25)
    prismY(brick, -29.3, 25.2, [[-45.3, E - 0.3], [-25.5, E - 0.3], [-35.4, R]])
    wingWindows(win, ccw(WEST), [[WG + 1.0, WG + 3.4], [WG + 4.6, WG + 9.6]], 3.6, 2.0, 7)
  }
  // flat-roofed block and the low hipped south piece
  prism(brick, null, ccw(FLAT), 0, G + 9)
  capRing(slate, ccw(FLAT), G + 9)
  prism(stone, null, ccw(FLAT), G + 9, G + 9.6)
  wingWindows(win, ccw(FLAT), [[G + 1.0, G + 3.4], [G + 4.6, G + 7.8]], 3.6, 2.2, 7)
  prism(brick, null, ccw(SOUTH), 0, G + 8)
  hipRoof(slate, -25.5, -6.0, -27.6, -16.9, G + 8 + LIFT, G + 11)
  capRing(slate, ccw(SOUTH), G + 8 + 0.01)
  wingWindows(win, ccw(SOUTH), [[G + 1.0, G + 3.0], [G + 4.0, G + 6.8]], 3.6, 2.0, 7)

  return finishGlb('Edenton Street United Methodist Church', [
    { part: brick, material: finish('esumc-brick', 0xb36e58) },
    { part: stone, material: finish('esumc-cast-stone', 0xe8dfcf) },
    { part: slate, material: finish('esumc-slate', 0x80868c) },
    { part: copper, material: finish('esumc-copper', 0x8e9c97) },
    { part: win, material: PALETTE.window },
    { part: door, material: finish('esumc-door', 0x4f5550) },
  ], { bearing: 2.7, height: TIP + 1.6, replaces: ['relation/14713078'] }, 6500)
}

if (import.meta.main) await writeModel('ral-edenton-street-umc', build())
