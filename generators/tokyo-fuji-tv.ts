/**
 * Fuji Television headquarters (FCG Building, フジテレビ本社ビル), Daiba,
 * Odaiba, Tokyo: procedural, CC0-1.0.  bun generators/tokyo-fuji-tv.ts
 *
 * Kenzo Tange Associates, completed 1996. Two office slabs joined by an open
 * three-dimensional grid of sky corridors, with the 32 m titanium-clad
 * sphere (the observation deck, "Hachitama") held in the grid near the
 * north-east slab. Writes the low model and a detail model (drawn from zoom
 * 16) in the same frame.
 *
 * Frame: built turned to bearing 56.5, the building's long axis (OSM's walls
 * run at 56.5 and 146.5 degrees): +y runs along the building to the
 * north-east, +x across it to the south-east. Origin at the centroid of the
 * FCG outline (way/287770734); z = 0 is the ground (Odaiba is flat
 * reclaimed land). Coordinates below are written in OSM's frame around
 * 139.77430, 35.62674 turned to 56.5 degrees, and shifted by the centroid
 * (2.8, 9.9) on output.
 *
 * OSM (all replaced): the outline way/287770734 (123 m); the slabs
 * relation/3816594 (south-west slab, "A" here, 120 m, 29.6 x 68 m with two
 * stair shafts on its south-east face) and relation/3816590 + 3816588 (the
 * north-east slab "B", 124 m parapet round a roof at 119 m, 53.5 x 42 m);
 * the grid's sky-corridor floors relation/3816597, 3816598, 3816599 (56-63,
 * 82-88, 107-113 m; rings round four voids each: two longitudinal corridors
 * 5.5 m wide at x -12.8/-7.2 and 11.1/16.6, cross corridors 4.1 m wide);
 * the six column shafts at the grid's nodes (way/287770761, 764, 772, 766:
 * 113 m; way/287770759, 770: 56-113 m); the four glazed lift shafts
 * (way/287770777 + 760, 784 + 769, 781 + 767, 778 + 738: 118-127 m); the
 * sphere way/287906915 (circle r 15.9 m about (-5.2, 42.7); tagged 96-130 m);
 * the podium and annexes relation/3816589 (38 m), 3816591 (31), 3816592
 * (26), 3816593 (45, the curved block at the foot of B), 3816595 (25, the
 * louvred loggia along the south-east side), 3816596 (34), way/287770785
 * (33), way/287770740 (16, the south-west end), way/287770774 (43).
 *
 * Published (Wikipedia "Fuji Television", ja "フジテレビ本社ビル"): 25
 * storeys, 123.45 m; sphere 32 m across, 1,200 t, clad in titanium panels;
 * Kenzo Tange, 1996.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 * - "20190322 Odaiba Fuji Television Network building.jpg" (Balon Greyjoy,
 *   CC0): slab A's south-east face and the grid from the south.
 * - "Fuji Broadcasting Center and Aqua City Odaiba, Tokyo, North view
 *   20190419.jpg" (DXR, CC BY-SA 4.0): from the north-west across the bay:
 *   slab B in front, the sphere standing out of the grid's north-west face.
 * - "Sphere, Fuji Broadcasting Center, North view 20190419 1.jpg" (DXR, CC
 *   BY-SA 4.0): the sphere close up: panel seams, the glazed band 4-8 m above
 *   its equator, the square windows at the equator, the step 3 m below it.
 * - "FCG Building.JPG" and "FCG Headquarters Building.JPG"
 *   (Tokumeigakarinoaoshima, CC0): the whole south-east elevation, slab A,
 *   the grid's three tiers of voids, the sphere behind the grid beside B.
 * - "View of headquarters of Fuji television from Yurikamome.jpg" (Dquai,
 *   CC BY-SA 4.0): the corridors' window bands and the sphere's seam.
 * - "FCG Building 20200320.jpg" (Suicasmo, CC BY-SA 4.0) and "FCG Building
 *   20160813.jpg" (Raita Futo, CC BY 2.0): slab A's pilotis and crown.
 * - Night: "FCG Building 20180227 night.jpg" (Bain Steinway, CC BY-SA 4.0)
 *   and "Fuji Television Network 20211127 01.jpg" (先従隗始, CC0): lit
 *   office windows, the grid outlined in blue LED lines.
 *
 * Measured from OSM: every plan dimension, the slabs', corridors', columns'
 * and podium heights. Published: 123.45 m, the sphere's 32 m.
 * Estimated from photos: the sphere's height (centre 108 m: its bottom just
 * over the 82-88 m corridor, its equator at the top corridor; OSM's 96-130 m
 * puts the top above the building's published height); its seams and the
 * glazed band; the slabs' bays (A: 7 bays on the long faces, 3 on the ends)
 * and their two-storey window groups; the open crown frames (the top ~9 m of
 * both slabs is a frame of large square openings); the pilotis under A
 * (12 m); the blue LED lines (drawn on the grid's two long faces only).
 * Left out: the outdoor "symbol stairs" and escalator tube, roof antennas
 * other than the two radomes, the podium's louvre detail beyond fins.
 *
 * Colours (daylight photos): the aluminium panels a light warm grey
 * (#cbc8c3 overcast, lit ~#dcdbd6); the glazing slate blue; the sphere's
 * titanium a silver grey, metallic and light against the sky (re-sampled
 * from DXR's sphere close-up: #d7d0cb and #aba7a6 in the light, #8f8e90 on
 * the upper dome, #63615f in shade; drawn #b8b7b5); its glazed band darker
 * (#61686d, the window colour).
 *
 * Doubts: the sphere's exact height and how far it stands out of the grid's
 * north-west face (OSM's circle is followed); B's north-east and north-west
 * faces are seen only from afar; the corridor ends are drawn flush with the
 * grid's lines, where the real ones step out slightly.
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { prism, panels, lathe, capPoly, rect, writeModel, ccw, type XY, type Layer } from './tokyo-metropolitan-government-building'

const C: XY = [2.8, 9.9] // the outline's centroid in OSM's turned frame
const T = (r: XY[]): XY[] => r.map(([x, y]) => [x - C[0], y - C[1]] as XY)
const Rr = (x0: number, x1: number, y0: number, y1: number): XY[] => rect((x0 + x1) / 2, (y0 + y1) / 2, (x1 - x0) / 2, (y1 - y0) / 2)
const R = (x0: number, x1: number, y0: number, y1: number): XY[] => T(Rr(x0, x1, y0, y1))
const P = (pts: number[][]): XY[] => ccw(T(pts as XY[]))

// The grid (OSM).
const X1: [number, number] = [-12.8, -7.2], X2: [number, number] = [11.1, 16.6]
const YS: [number, number][] = [[-26.9, -17.7], [-5.7, -1.6], [20.2, 24.3], [45.7, 50.0], [61.9, 71.6]]
const LEVELS: [number, number][] = [[56, 63], [82, 88], [107, 113]]
const SPHERE = { x: -5.2, y: 42.7, z: 108, r: 16 }

type Lod = { detail: boolean }

function build({ detail }: Lod): Layer[] {
  const wall = new Part(), shade = new Part(), win = new Part(), ti = new Part(), glass = new Part(), neon = new Part()
  const box = (r: XY[], z0: number, z1: number, p = wall, bevel = 0.4, roof?: Part) => prism(p, r, z0, z1, { bevel, roof: roof ?? p })

  // ---- Slab A (south-west), 120 m ------------------------------------------
  const A = { x0: -12.9, x1: 16.7, y0: -94.9, y1: -26.9 }
  const PIL = 12 // pilotis under A
  if (detail) {
    // pilotis: the ground storeys set back behind the piers
    box(R(A.x0 + 2.2, A.x1 - 2.2, A.y0 + 2.2, A.y1 - 2.2), 0, PIL, shade, 0.2)
    for (const x of [A.x0 + 1.1, A.x1 - 1.1]) for (let k = 0; k <= 7; k++) {
      const y = A.y0 + 1.1 + ((A.y1 - A.y0 - 2.2) * k) / 7
      box(R(x - 1.1, x + 1.1, y - 1.1, y + 1.1), 0, PIL, wall, 0.25)
    }
    for (const y of [A.y0 + 1.1, A.y1 - 1.1]) for (let k = 1; k < 3; k++) {
      const x = A.x0 + 1.1 + ((A.x1 - A.x0 - 2.2) * k) / 3
      box(R(x - 1.1, x + 1.1, y - 1.1, y + 1.1), 0, PIL, wall, 0.25)
    }
    box(R(A.x0, A.x1, A.y0, A.y1), PIL, 120, wall, 0.5, shade)
  } else box(R(A.x0, A.x1, A.y0, A.y1), 0, 120, wall, 0.5, shade)
  // the two stair shafts on its south-east face
  for (const [y0, y1] of [[-79, -69], [-53.3, -43.1]]) {
    box(R(A.x1 - 0.5, 23.7, y0, y1), 0, 120, wall, 0.4)
    // glazed full height above the podium, like the grid's lift shafts
    facePanels(glass, [23.7, y0], [23.7, y1], 27, 117, 20, 90, 0.55, 1)
  }
  slabFace(Rr(A.x0, A.x1, A.y0, A.y1), PIL + 1.5, 111, 120, { long: 7, short: 3 }, (i, m) => false)
  // roof plant at A
  box(R(-6, 10, -86, -38), 120, 123, shade, 0.3)

  // ---- Slab B (north-east), parapet 124 m round a roof at 119 m ------------
  const B = { x0: -36.8, x1: 16.7, y0: 71.5, y1: 113.5 }
  box(R(B.x0, B.x1, B.y0, B.y1), 0, 119, wall, 0.5, shade)
  const pt = 5.5 // parapet frame thickness
  box(R(B.x0, B.x1, B.y0, B.y0 + pt), 119, 124, wall, 0.3)
  box(R(B.x0, B.x1, B.y1 - pt, B.y1), 119, 124, wall, 0.3)
  box(R(B.x0, B.x0 + pt, B.y0 + pt, B.y1 - pt), 119, 124, wall, 0.3)
  box(R(B.x1 - pt, B.x1, B.y0 + pt, B.y1 - pt), 119, 124, wall, 0.3)
  slabFace(Rr(B.x0, B.x1, B.y0, B.y1), 46.5, 114, 124, { long: 6, short: 5 }, () => false)
  // B's lower storeys show only where nothing stands in front: its north-west
  // and north-east faces down to the street, the others above the podium.
  facePanels(win, [B.x0, B.y1], [B.x0, B.y0], 8, 45, 5, 9.6, 0.62, 0.62)
  facePanels(win, [B.x1, B.y1], [B.x0, B.y1], 8, 45, 6, 9.6, 0.62, 0.62)

  // ---- Podium and annexes --------------------------------------------------
  box(P([[16.5, -21.6], [25.8, -21.6], [25.9, 103.0], [21.0, 103.0], [21.0, 100.1], [16.3, 100.1], [16.7, 97.4], [16.6, 71.6], [-27.7, 71.5], [-27.7, 17.4], [-18.4, 17.3], [-18.4, -31.1], [-12.8, -31.2], [-12.8, -26.9], [16.5, -26.9]]), 0, 38, wall, 0.4, shade)
  box(R(25.8, 28.4, -41.7, 94.7), 0, 31, wall, 0.3, shade)
  box(R(25.7, 34.1, -78.8, 100.6), 0, 25, wall, 0.4, shade)
  box(R(16.7, 25.8, -68.9, -53.3), 0, 26, wall, 0.3, shade)
  box(R(23.7, 25.8, -78.8, -68.9), 0, 26, wall, 0.3, shade)
  box(R(16.5, 25.8, -43.1, -21.6), 0, 34, wall, 0.3, shade)
  box(R(23.7, 25.8, -53.3, -43.1), 0, 34, wall, 0.3, shade)
  box(P([[16.7, 97.4], [20.6, 97.4], [21.0, 77.9], [20.4, 73.7], [18.9, 68.7], [16.6, 65.0], [11.1, 61.0], [8.6, 59.6], [4.4, 58.9], [1.1, 58.4], [-1.5, 58.6], [-5.5, 60.7], [-10.0, 63.8], [-12.6, 65.5], [-16.6, 67.1], [-19.9, 67.2], [-23.6, 66.3], [-25.8, 64.5], [-25.7, 71.6], [16.6, 71.6]]), 0, 45, wall, 0.3, shade)
  box(P([[-32.1, 71.5], [-32.2, 11.2], [-25.9, 11.2], [-25.9, 4.0], [-18.4, 4.0], [-18.4, 17.3], [-27.7, 17.4], [-27.7, 71.5]]), 0, 33, wall, 0.3, shade)
  box(P([[-5.0, -94.9], [-5.0, -103.6], [-18.1, -103.6], [-18.1, -112.2], [-25.7, -112.2], [-25.7, -123.0], [25.2, -123.0], [25.2, -103.9], [10.7, -103.9], [10.7, -94.9]]), 0, 16, wall, 0.3, shade)
  box(R(21.0, 29.3, 103.0, 110.0), 0, 43, wall, 0.3, shade)
  // the podium's window bands and the loggia's louvred screen
  facePanels(win, [34.1, -78.8], [34.1, 100.6], 4, 22, 9, 6, 0.8, 0.55)
  facePanels(win, [-32.1, 71.5], [-32.2, 11.2], 4, 30, 8, 6.5, 0.7, 0.5)
  facePanels(win, [-25.7, -123.0], [25.2, -123.0], 3, 14, 8, 5.5, 0.75, 0.55)
  if (detail) for (let y = -77.3; y < 100; y += 3) box(R(34.1, 34.7, y - 0.25, y + 0.25), 2, 24.5, wall, 0.08)

  // ---- The grid of sky corridors ------------------------------------------
  const ylo = YS[0][0], yhi = YS[YS.length - 1][1]
  for (const [z0, z1] of LEVELS) {
    for (const [x0, x1] of [X1, X2]) {
      box(R(x0, x1, ylo, yhi), z0, z1, wall, 0.35, wall)
      // soffit, a shade darker
      capPoly(shade, R(x0 + 0.05, x1 - 0.05, ylo, yhi), z0 - 0.02, false)
    }
    for (const [y0, y1] of YS) box(R(X1[1] - 0.1, X2[0] + 0.1, y0, y1), z0, z1, wall, 0.35, wall)
    // window bands: one continuous band per face low, one per bay in detail
    const zz0 = z0 + (z1 - z0) * 0.32, zz1 = z0 + (z1 - z0) * 0.72
    for (const [x, side] of [[X1[0], -1], [X1[1], 1], [X2[0], -1], [X2[1], 1]] as [number, number][]) {
      for (let k = 0; k < YS.length - 1; k++) {
        const ya = YS[k][1], yb = YS[k + 1][0]
        const a: XY = side > 0 ? [x, ya] : [x, yb], b: XY = side > 0 ? [x, yb] : [x, ya]
        facePanels(win, a, b, zz0, zz1, detail ? 4 : 30, zz1 - zz0, detail ? 0.82 : 0.94, 1)
      }
      // the end bays and nodes on the outer faces carry windows too
      if ((side < 0 && x === X1[0]) || (side > 0 && x === X2[1])) for (const [y0, y1] of YS) {
        const a: XY = side > 0 ? [x, y0] : [x, y1], b: XY = side > 0 ? [x, y1] : [x, y0]
        facePanels(win, a, b, zz0, zz1, detail ? 3 : 30, zz1 - zz0, 0.8, 1)
      }
    }
    for (const [y0, y1] of YS.slice(1, -1)) for (const [y, side] of [[y0, -1], [y1, 1]] as [number, number][]) {
      const a: XY = side > 0 ? [X2[0], y] : [X1[1], y], b: XY = side > 0 ? [X1[1], y] : [X2[0], y]
      facePanels(win, a, b, zz0, zz1, detail ? 4 : 30, zz1 - zz0, detail ? 0.82 : 0.94, 1)
    }
  }
  // column shafts at the nodes
  for (const [x0, x1] of [X1, X2]) for (const [k, [y0, y1]] of YS.entries()) {
    if (k === 0 || k === YS.length - 1) continue
    const zb = k === 2 ? 56 : 38
    box(R(x0, x1, y0, y1), zb, 113, wall, 0.3)
    if (detail) {
      // a slot window per storey down each outer face of the shaft
      for (let z = zb + 2; z < 110; z += 4.9) {
        if (LEVELS.some(([a, b]) => z + 2.4 > a - 0.3 && z < b + 0.3)) continue
        const xo = x0 === X1[0] ? x0 : x1, s = xo === x0 ? -1 : 1
        const a: XY = s > 0 ? [xo, y0] : [xo, y1], b: XY = s > 0 ? [xo, y1] : [xo, y0]
        facePanels(win, a, b, z, z + 2.4, 3, 2.4, 0.55, 1)
        for (const [y, sy] of [[y0, -1], [y1, 1]] as [number, number][]) {
          const c: XY = sy > 0 ? [x1, y] : [x0, y], d: XY = sy > 0 ? [x0, y] : [x1, y]
          facePanels(win, c, d, z, z + 2.4, 3, 2.4, 0.5, 1)
        }
      }
    }
  }
  // the grid's roof: a low parapet round each corridor top
  if (detail) for (const [x0, x1] of [X1, X2]) {
    box(R(x0, x0 + 0.4, ylo, yhi), 113, 114.2, wall, 0.08)
    box(R(x1 - 0.4, x1, ylo, yhi), 113, 114.2, wall, 0.08)
  }

  // ---- Glazed lift shafts ----------------------------------------------------
  const lifts: { r: [number, number, number, number]; h: number; cap: [number, number, number, number]; capH: number; out: number }[] = [
    { r: [16.0, 24.3, -10.3, -5.9], h: 118, cap: [20.2, 22.5, -9.7, -6.5], capH: 121, out: 1 },
    { r: [15.5, 24.7, 41.1, 45.3], h: 118, cap: [20.3, 22.6, 41.8, 44.6], capH: 121, out: 1 },
    { r: [-18.4, -10.6, -0.9, 6.8], h: 120, cap: [-15.7, -13.1, 0.9, 4.8], capH: 123, out: -1 },
    { r: [11.1, 23.3, 50.5, 54.8], h: 124, cap: [15.3, 19.6, 51.2, 54.4], capH: 127, out: 1 },
  ]
  for (const { r: [x0, x1, y0, y1], h, cap, capH, out } of lifts) {
    box(R(x0, x1, y0, y1), 0, h, wall, 0.35)
    box(R(...cap), h, capH, wall, 0.2)
    // the glazed strip down the outer face, and a narrower one on each side
    const xo = out > 0 ? x1 : x0
    const a: XY = out > 0 ? [xo, y0] : [xo, y1], b: XY = out > 0 ? [xo, y1] : [xo, y0]
    facePanels(glass, a, b, 26, h - 2.5, 20, h - 28.5, 0.62, 1)
    for (const [y, sy] of [[y0, -1], [y1, 1]] as [number, number][]) {
      const c: XY = sy > 0 ? [x1, y] : [x0, y], d: XY = sy > 0 ? [x0, y] : [x1, y]
      facePanels(glass, c, d, 40, h - 2.5, 20, h - 42.5, 0.45, 1)
    }
  }

  // ---- The sphere ----------------------------------------------------------
  sphere(ti, win, detail)

  // ---- Blue LED lines on the grid's long faces ----------------------------
  const lw = detail ? 0.35 : 0.6
  for (const [x, s] of [[X1[0], -1], [X2[1], 1]] as [number, number][]) {
    const xo = x + s * 0.06
    for (const [z0, z1] of LEVELS) for (const z of [z0 + 0.4, z1 - 0.4]) {
      const r = R(Math.min(x, xo + s * lw), Math.max(x, xo + s * lw), ylo + 0.3, yhi - 0.3)
      prism(neon, r, z - lw / 2, z + lw / 2, { bevel: 0, roof: neon })
    }
    for (const [k, [y0, y1]] of YS.entries()) {
      if (k === 0 || k === YS.length - 1) continue
      for (const y of [y0 + 0.4, y1 - 0.4]) {
        const r = R(Math.min(x, xo + s * lw), Math.max(x, xo + s * lw), y - lw / 2, y + lw / 2)
        prism(neon, r, k === 2 ? 56 : 38.5, 112.6, { bevel: 0, roof: neon })
      }
    }
  }

  // ---- Roof radomes on B and A (detail) ------------------------------------
  if (detail) for (const [x, y, z, r] of [[-30, 107, 119, 2.6], [8, 79, 119, 2.0], [12, -90, 123, 2.2], [-8, -33, 123, 1.8]]) {
    const [cx, cy] = T([[x, y]])[0]
    box(rect(cx, cy, 0.5, 0.5), z, z + 4, wall, 0.1)
    lathe(wall, Array.from({ length: 9 }, (_, i) => { const a = -Math.PI / 2 + (i / 8) * Math.PI; return [r * Math.cos(a), z + 4 + r + r * Math.sin(a)] as [number, number] }), 10, [cx, cy])
  }

  /** Window panels and the crown's open frames on every face of a slab. */
  function slabFace(ring: XY[], z0: number, z1: number, top: number, bays: { long: number; short: number }, _skip: (i: number, m: XY) => boolean) {
    const r = ccw(ring)
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length]
      const L = Math.hypot(b[0] - a[0], b[1] - a[1])
      const n = L > 45 ? bays.long : bays.short
      const rows = Math.round((z1 - z0) / 9.6)
      facePanels(win, a, b, z0, z1, L / n, (z1 - z0) / rows, detail ? 0.7 : 0.66, 0.62, detail ? 2 : 1)
      if (detail) {
        // Tange's frame: square piers between the bays, a beam every two storeys
        const ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L, nx = uy, ny = -ux
        const fb = (s0: number, s1: number, za: number, zb: number, d: number) => {
          const q = (s: number, o: number): XY => [a[0] + ux * s + nx * o, a[1] + uy * s + ny * o]
          prism(wall, ccw(T([q(s0, 0), q(s1, 0), q(s1, d), q(s0, d)])), za, zb, { bevel: 0.12 })
        }
        for (let k = 1; k < n; k++) fb((L * k) / n - 0.55, (L * k) / n + 0.55, z0 - 1.5, top, 0.45)
        for (let j = 0; j <= rows; j++) { const z = z0 + ((z1 - z0) * j) / rows; fb(0.3, L - 0.3, z - 0.35, z + 0.35, 0.3) }
      }
      // the crown: a frame of big square openings
      facePanels(shade, a, b, z1 + 0.6, top - 0.8, L / (n * 2), top - z1 - 1.4, 0.72, 0.86)
    }
  }

  const parts: Layer[] = [
    { part: wall, material: finish('fcg-panel', 0xdcdbd6) },
    { part: shade, material: finish('fcg-recess', 0xa9adae) },
    { part: win, material: { ...PALETTE.window, color: 0x6a8091 } },
    { part: ti, material: finish('fcg-titanium', 0xb8b7b5, 0.4) },
    { part: glass, material: { ...PALETTE.glass, color: 0x86a0b2 } },
    { part: neon, material: finish('neon-fcg-blue', 0x93a8e4) },
  ]
  return parts
}

/**
 * Panels on one wall, a to b with the wall's outside on the right (so the
 * ring is counter-clockwise from above): `bay` metres a bay (fill fw), rows
 * `row` high (fill fh), set 0.06 m proud. `split` divides each panel by a
 * pale mullion gap into that many columns.
 */
function facePanels(p: Part, a: XY, b: XY, z0: number, z1: number, bay: number, row: number, fw: number, fh: number, split = 1) {
  [a, b] = T([a, b]) as [XY, XY]
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (L < 1.5 || z1 <= z0) return
  const ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L, nx = uy, ny = -ux, out = 0.06
  const n = Math.max(1, Math.round(L / bay)), bw = L / n
  const rows = Math.max(1, Math.round((z1 - z0) / row)), rh = (z1 - z0) / rows
  const Q = (s: number, z: number): V3 => [a[0] + ux * s + nx * out, a[1] + uy * s + ny * out, z]
  for (let k = 0; k < n; k++) for (let j = 0; j < rows; j++) {
    const w = bw * fw, s0 = bw * k + (bw - w) / 2
    const za = z0 + rh * j + (rh * (1 - fh)) / 2, zb = za + rh * fh
    for (let m = 0; m < split; m++) {
      const g = split > 1 ? 0.35 : 0, sw = (w - g * (split - 1)) / split
      const sa = s0 + m * (sw + g)
      p.quad(Q(sa, za), Q(sa + sw, za), Q(sa + sw, zb), Q(sa, zb))
    }
  }
}

/** The titanium sphere with its glazed band, seams and equator windows. */
function sphere(ti: Part, win: Part, detail: boolean) {
  const [cx, cy] = T([[SPHERE.x, SPHERE.y]])[0]
  const { z: cz, r } = SPHERE
  const k = detail ? 40 : 16
  // profile from the bottom pole up, as [radius, z]; seams are small steps in.
  const arc = (a0: number, a1: number, n: number, rr = r) =>
    Array.from({ length: n + 1 }, (_, i) => { const a = a0 + ((a1 - a0) * i) / n; return [rr * Math.cos(a), cz + rr * Math.sin(a)] as [number, number] })
  const deg = Math.PI / 180
  const zA = Math.asin(-10.6 / r), zB = Math.asin(-2.9 / r), zC = Math.asin(4.1 / r), zD = Math.asin(8.3 / r)
  const lo = detail ? 1 : 0
  const prof: [number, number][] = [
    [0, cz - r],
    ...arc(-90 * deg, zA, detail ? 6 : 3).slice(1),
    ...(detail ? [[r * Math.cos(zA) - 0.35, cz - 10.6] as [number, number]] : []),
    ...arc(zA, zB, detail ? 5 : 2, r - 0.35 * lo).slice(1),
    ...(detail ? [[r * Math.cos(zB) - 0.3, cz - 2.9] as [number, number], [r * Math.cos(zB), cz - 2.9] as [number, number]] : []),
    ...arc(zB, zC, detail ? 4 : 2).slice(1),
  ]
  lathe(ti, prof, k, [cx, cy])
  // the glazed band, a ledge under it
  const band = arc(zC, zD, detail ? 3 : 1, r + 0.02)
  lathe(win, band, k, [cx, cy])
  if (detail) lathe(ti, [[r * Math.cos(zC) + 0.6, cz + 4.1], [r * Math.cos(zC) + 0.6, cz + 3.6], [r * Math.cos(zC) - 0.2, cz + 3.6]].reverse() as [number, number][], k, [cx, cy])
  lathe(ti, [...arc(zD, 90 * deg, detail ? 9 : 4)].slice(0, -1).concat([[0, cz + r]]), k, [cx, cy])
  // square windows round the equator
  if (detail) for (let i = 0; i < 18; i++) {
    const a = (i / 18) * Math.PI * 2 + 0.1
    const u: V3 = [Math.cos(a), Math.sin(a), 0], t: V3 = [-Math.sin(a), Math.cos(a), 0]
    const rr = r + 0.04, h = 1.1, w = 1.2
    const at = (s: number, z: number): V3 => [cx + u[0] * rr + t[0] * s, cy + u[1] * rr + t[1] * s, cz + z]
    win.quad(at(-w, -h), at(w, -h), at(w, h), at(-w, h))
  }
}

if (import.meta.main) {
  const meta = { bearing: 56.5, elevation: 0, height: 127 }
  await writeModel('tokyo-fuji-tv', 'tokyo-fuji-tv.glb', 'Fuji Television headquarters', build({ detail: false }), meta, 6500, 250 * 1024)
  await writeModel('tokyo-fuji-tv', 'tokyo-fuji-tv.detail.glb', 'Fuji Television headquarters', build({ detail: true }), meta, 40000, 1536 * 1024)
}
