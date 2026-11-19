/**
 * St. Mary's Assumption Church, 2030 Constance Street (front on Josephine
 * Street), Irish Channel, New Orleans (1858-60; Albert Diettel, German
 * Baroque in exposed brick) — procedural, CC0-1.0, no textures.
 * bun generators/nola-st-marys-assumption.ts
 *
 * Map frame: x = model east, y = model north, z up, metres; origin at the
 * anchor on the ground. Placed at bearing 54.3: model +y runs up the nave
 * from the front (model −y, facing compass 234°) to the sanctuary end,
 * where the bell tower stands at the north-west corner (model −x) against
 * the Redemptorist rectory. Anchor: the area centroid of OSM way/328032233.
 *
 * Identity, in order: the tall exposed-brick front with its big round-topped
 * gable over the centre bay (rose window, cross), the stepped and scrolled
 * shoulders down to the side bays, and the brick piers rising to pinnacles;
 * the deep round-arched brick portals; the tall round-arched windows; the
 * bell tower behind — a square brick base under curved pediments, two
 * octagonal stages, the clock stage ringed by small pinnacles, and the
 * pale cupola and lantern;
 * the long nave with its paired brick pinnacles over every pier and a dark
 * slate gable roof.
 *
 * Evidence
 * - OSM way/328032233 (building=yes, height 24.9 = the front gable; the
 *   tower is outside it): x ±11.5, y −21.6..21.6 in the model frame.
 * - Lidar: USGS 3DEP LA_2021GNO_1_C22 (Greater New Orleans, flown 2021-22),
 *   0.5 m grid in the model frame; ground 0.6 over the grid minimum = z 0.
 *   Front wall at y −22.5; nave eaves ~13.5, ridge 21.7; side pinnacles
 *   ~15.6 in pairs over the piers; front gable top 25.8, centre piers 22.6,
 *   corner piers 17.4, side-bay shoulders ~16.5; the tower centred at
 *   (−16.3, 18.5): square base 6.5 m to ~20, an octagon (r ~3.3) to ~26.5,
 *   the upper stages (r ~2.5) to ~37, the dome's top 43; the cross returns
 *   nothing.
 * - NAIP (USGS, public domain): the dark slate nave roof, the tower's place.
 * - Photos (Wikimedia Commons, all evidence):
 *   - "StMary26Oct07FrontIs.jpg", Infrogmation of New Orleans, CC BY-SA 3.0:
 *     the front and the south-east side, the tower top over the roof
 *     https://commons.wikimedia.org/wiki/File:StMary26Oct07FrontIs.jpg
 *   - "StMary26Oct07FrontA.jpg", Infrogmation of New Orleans, CC BY-SA 3.0:
 *     the front and the north-west side
 *     https://commons.wikimedia.org/wiki/File:StMary26Oct07FrontA.jpg
 *   - "New Orleans, Antisocialtory - St. Mary's Assumption Church.jpg",
 *     antisocialtory, CC BY 2.0: the north-west side and the whole tower
 *     https://commons.wikimedia.org/wiki/File:New_Orleans,_Antisocialtory_-_St._Mary%27s_Assumption_Church.jpg
 *   - "StMary26Oct07FromBelow.jpg", Infrogmation of New Orleans, CC BY-SA
 *     3.0: the tower over the rectory
 *     https://commons.wikimedia.org/wiki/File:StMary26Oct07FromBelow.jpg
 * - Published: Wikipedia, "St. Mary's Assumption Church (New Orleans)":
 *   1858-60, German Baroque, National Historic Landmark.
 *
 * Measured (lidar): the heights above and the plan. Estimated from the
 * photos against those: the gable's outline (an arch of r 4.6 springing at
 * 21.2 on the centre bay, scrolled shoulders), the rose window (r 1.1 at
 * 19.6), the portals (centre 3.0 m wide to 7.8, side 2.0 m to 6.4), the
 * windows (centre bay two lights 1.3 m, 8.6-17.4; side bays two narrow
 * lights 1.0 m, 8.6-15.6; nave sides 1.6 m, 4.0-12.4), the blind arcade
 * beside the doors, the tower's stage heights between the lidar rings,
 * its clock faces. The nave's bay rhythm (five piers a side) follows the
 * lidar's pinnacle pairs. Left out: the corbel tables, rustication and
 * brick ornament, the fence.
 *
 * Doubts: the tower's base is only seen above the rectory; its lower walls
 * against the rectory are kept plain. The rear end against the rectory is
 * not photographed. The tower is not in the church's OSM outline.
 *
 * Round-1 review: buff-tan brick (from the antisocialtory and Infrogmation
 * photos, pulled to palette lightness), bold paired gabled pinnacles on the
 * side piers, stepped pinnacles at the front, a pale cupola ringed by small
 * pinnacles in place of the green dome.
 *
 * Night: the windows glow; the front and tower are softly floodlit.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel, prism, type XY } from './nyc-570-lexington'
import { block, band, dome, wallFrame } from './nyc-city-hall'
import { slabY, slabX, arch, rect, disc, rectRing, barCross, gableRoof, type Side } from './nola-st-patricks-church'

const brick = new Part(), dark = new Part(), roof = new Part(), win = new Part(), white = new Part(), copper = new Part()

const NX = 11.5, YF = -22.5, YR = 22.0
const EAVE = 13.5, RIDGE = 21.7
const T = { x: -15.6, y: 18.3 }

const ngon = (cx: number, cy: number, r: number, n: number, phase = 0): XY[] =>
  Array.from({ length: n }, (_, i) => [cx + r * Math.cos(phase + (i * 2 * Math.PI) / n), cy + r * Math.sin(phase + (i * 2 * Math.PI) / n)] as XY)

/**
 * A bold brick pinnacle (the "chimney" pinnacles): a square shaft with a
 * cornice lip, a gabled cap (ridge along `axis`) and a small ball on top.
 */
function pinnacle(x: number, y: number, w: number, z0: number, z1: number, axis: 'x' | 'y' = 'y') {
  block(dark, x - w / 2, y - w / 2, x + w / 2, y + w / 2, z0, z1)
  block(dark, x - w / 2 - 0.15, y - w / 2 - 0.15, x + w / 2 + 0.15, y + w / 2 + 0.15, z1 - 0.35, z1)
  const g = w * 0.6, e = w / 2 + 0.15
  if (axis === 'y') slabY(dark, [[x - e, z1], [x + e, z1], [x, z1 + g]], y - e, y + e)
  else slabX(dark, [[y - e, z1], [y + e, z1], [y, z1 + g]], x - e, x + e)
  dome(dark, x, y, w * 0.2, z1 + g - 0.1, w * 0.25, 8, 2)
}
/** A tall stepped pinnacle: a broad lower block, a narrower upper one, a gabled cap. */
function steppedPinnacle(x: number, y: number, w: number, z0: number, h: number) {
  block(dark, x - w / 2, y - w / 2, x + w / 2, y + w / 2, z0, z0 + h * 0.45)
  block(dark, x - w / 2 - 0.15, y - w / 2 - 0.15, x + w / 2 + 0.15, y + w / 2 + 0.15, z0 + h * 0.45 - 0.3, z0 + h * 0.45)
  pinnacle(x, y, w * 0.72, z0 + h * 0.45, z0 + h, 'y')
}
/** A deep round-arched portal: stepped brick reveals, door leaves, a fanlight. */
function portal(x: number, w: number, zTop: number) {
  const y = YF
  slabY(dark, archPoly(x, w + 1.4, 0.0, zTop + 0.75), y - 0.55, y)
  slabY(brick, archPoly(x, w + 0.6, 0.0, zTop + 0.35), y - 0.75, y - 0.5)
  arch(dark, 'front', y - 0.75, x, w, 0.3, zTop, 0.06)               // the door leaves (painted red-brown)
  arch(win, 'front', y - 0.75, x, w * 0.8, zTop - w * 0.62, zTop - 0.2, 0.09)
  block(white, x - w / 2 - 0.9, y - 1.3, x + w / 2 + 0.9, y, 0, 0.3)  // the step
}
function archPoly(x: number, w: number, z0: number, zTop: number): [number, number][] {
  const r = w / 2, spring = zTop - r, pts: [number, number][] = [[x - r, z0], [x + r, z0]]
  for (let k = 0; k <= 10; k++) { const t = (k / 10) * Math.PI; pts.push([x + r * Math.cos(t), spring + r * Math.sin(t)]) }
  return pts
}
/** A round-arched window with a brick hood moulding. */
function window(side: Side, c: number, t: number, w: number, z0: number, zTop: number) {
  arch(dark, side, c, t, w + 0.5, z0 - 0.3, zTop + 0.3, 0.1)
  arch(win, side, c, t, w, z0, zTop, 0.16)
}

// ---------------------------------------------------------------------------
// The nave
// ---------------------------------------------------------------------------

prism({ wall: brick, win: null, roof: null, ring: rectRing(-NX, YF + 0.6, NX, YR), z0: 0, z1: EAVE, facade: null, bevel: 0.15 })
gableRoof(roof, 0, NX, YF + 1.0, YR + 0.2, EAVE + 0.3, RIDGE, 0.25)
slabY(brick, [[-NX, EAVE], [NX, EAVE], [0, RIDGE]], YR - 0.4, YR)
// cornice and parapet along the sides
for (const s of [-1, 1]) {
  block(dark, s < 0 ? -NX - 0.4 : NX - 0.1, YF + 0.6, s < 0 ? -NX + 0.1 : NX + 0.4, YR, EAVE - 0.9, EAVE - 0.4)
  block(brick, s < 0 ? -NX - 0.1 : NX - 0.5, YF + 0.6, s < 0 ? -NX + 0.5 : NX + 0.1, YR, EAVE - 0.4, EAVE + 0.5)
  block(white, s < 0 ? -NX - 0.25 : NX - 0.65, YF + 0.6, s < 0 ? -NX + 0.65 : NX + 0.25, YR, 0, 0.55)
}
// Piers (pilaster strips) with paired pinnacles, five a side and the corners; windows between.
const PIERS = [-15.0, -7.5, 0.0, 7.5, 15.0]
for (const s of [-1, 1]) {
  const side: Side = s < 0 ? 'west' : 'east'
  const xo = s * NX
  for (const y of [...PIERS, YR - 0.8]) {
    block(dark, s < 0 ? xo - 0.7 : xo, y - 1.0, s < 0 ? xo : xo + 0.7, y + 1.0, 0.5, EAVE + 0.5)
    for (const d of [-0.78, 0.78]) pinnacle(xo - s * 0.05, y + d, 1.05, EAVE + 0.5, EAVE + 3.6, 'x')
  }
  const stops = [YF + 1.5, ...PIERS, YR - 0.8]
  for (let i = 0; i < stops.length - 1; i++) {
    const y = (stops[i] + stops[i + 1]) / 2
    if (s < 0 && y > 15) continue // the tower stands here
    window(side, xo, y, 1.6, 4.0, 12.4)
  }
}

// ---------------------------------------------------------------------------
// The front
// ---------------------------------------------------------------------------

{
  const CX = 4.3                // centre-bay half width (to the inner faces of the tall piers)
  const PX = 5.0, PW = 1.5      // tall piers: centre and width
  // the wall: side bays to their shoulders, the centre bay to the arch springing
  slabY(brick, [[-NX, 0], [NX, 0], [NX, 16.8], [PX, 16.8], [PX, 21.2], [-PX, 21.2], [-PX, 16.8], [-NX, 16.8]], YF, YF + 0.8, [0, 8])
  // the round-topped gable: an arch of r 4.6 springing at 21.2, with a heavy brick rim
  const ga = (r: number, z: number, n = 12): [number, number][] => {
    const pts: [number, number][] = [[-r, z - 0.01], [r, z - 0.01]]
    for (let k = 0; k <= n; k++) { const t = (k / n) * Math.PI; pts.push([r * Math.cos(t), z + r * Math.sin(t) * 1.0]) }
    return pts
  }
  slabY(brick, ga(4.6, 21.2), YF, YF + 0.8)
  slabY(dark, ga(4.6 + 0.45, 21.2).map(([x, z]) => [x, z] as [number, number]), YF - 0.25, YF + 0.05)
  slabY(brick, ga(4.6 - 0.1, 21.2), YF - 0.3, YF - 0.2)
  // its finial block and the cross
  block(dark, -0.7, YF - 0.25, 0.7, YF + 0.6, 25.6, 26.4)
  dome(dark, 0, YF + 0.15, 0.6, 26.4, 0.55, 10, 2)
  barCross(dark, 0, YF + 0.15, 26.9, 2.3, 1.3, 0.3)
  // the rose window in the gable
  disc(dark, 'front', YF - 0.3, 0, 19.6, 1.45, 0.06, 16)
  disc(win, 'front', YF - 0.3, 0, 19.6, 1.1, 0.12, 16)
  // the scrolled shoulders: a quarter-round sweep from the tall piers down to the side bays, a disc at the foot
  for (const s of [-1, 1]) {
    // the shoulder: a sloped coping falling from the tall pier to the corner, a disc at its foot
    slabY(brick, [[s * (PX + PW / 2), 16.7], [s * (NX - 0.8), 16.7], [s * (NX - 0.8), 17.3], [s * (PX + PW / 2), 20.0]], YF, YF + 0.8, [s * (PX + 2.5), 17.4])
    slabY(dark, [[s * (PX + PW / 2), 19.8], [s * (NX - 0.8), 17.1], [s * (NX - 0.8), 17.6], [s * (PX + PW / 2), 20.4]], YF - 0.15, YF + 0.85, [s * (PX + 2.5), 18.2])
    disc(dark, 'front', YF, s * (PX + 1.95), 17.9, 0.6, 0.12, 12)
    disc(brick, 'front', YF - 0.12, s * (PX + 1.95), 17.9, 0.35, 0.06, 12)
  }
  // the tall piers either side of the centre bay, to their pinnacles, and the corner piers
  for (const s of [-1, 1]) {
    const x = s * PX
    prism({ wall: dark, win: null, roof: dark, ring: rectRing(x - PW / 2, YF - 0.6, x + PW / 2, YF + 0.8), z0: 0, z1: 21.6, facade: null, bevel: 0.08 })
    block(dark, x - PW / 2 - 0.15, YF - 0.75, x + PW / 2 + 0.15, YF + 0.9, 21.6, 22.0)
    steppedPinnacle(x, YF + 0.07, 1.4, 22.0, 3.4)
    const xc = s * (NX - 0.5)
    prism({ wall: dark, win: null, roof: dark, ring: rectRing(xc - 0.75, YF - 0.5, xc + 0.75, YF + 0.9), z0: 0, z1: 17.4, facade: null, bevel: 0.08 })
    steppedPinnacle(xc, YF + 0.2, 1.5, 17.4, 3.6)
    // storey cornices across the side bays and the centre
    block(dark, Math.min(s * (PX + PW / 2), s * (NX - 1.25)), YF - 0.3, Math.max(s * (PX + PW / 2), s * (NX - 1.25)), YF, 8.3, 8.8)
    block(dark, Math.min(s * (PX + PW / 2), s * (NX - 1.25)), YF - 0.3, Math.max(s * (PX + PW / 2), s * (NX - 1.25)), YF, 16.1, 16.65)
  }
  block(dark, -PX + PW / 2, YF - 0.3, PX - PW / 2, YF, 17.9, 18.3)
  block(white, -NX - 0.3, YF - 0.7, NX + 0.3, YF, 0, 0.55)          // the white painted base
  // portals in the side bays; a blind arcade under a cornice in the centre bay
  for (const s of [-1, 1]) portal(s * 8.3, 2.5, 7.0)
  for (let k = 0; k < 7; k++) arch(dark, 'front', YF, -3.3 + k * 1.1, 0.75, 1.0, 5.4, 0.08)
  block(dark, -PX + PW / 2, YF - 0.35, PX - PW / 2, YF, 5.9, 6.5)
  // windows: two tall lights in the centre bay, two in each side bay over the door
  for (const d of [-1.25, 1.25]) window('front', YF, d, 1.35, 8.0, 17.4)
  for (const s of [-1, 1]) for (const d of [-0.85, 0.85]) window('front', YF, s * 8.3 + d, 1.05, 9.4, 15.6)
}

// ---------------------------------------------------------------------------
// The bell tower
// ---------------------------------------------------------------------------

{
  const { x, y } = T, h = 3.85
  prism({ wall: brick, win: null, roof: dark, ring: rectRing(x - h, y - h, x + h, y + h), z0: 0, z1: 20.0, facade: null, bevel: 0.12 })
  band(dark, rectRing(x - h, y - h, x + h, y + h), 19.4, 20.0, 0.25)
  band(dark, rectRing(x - h, y - h, x + h, y + h), 13.0, 13.5, 0.15)
  for (const [px, py] of [[x - h, y - h], [x + h, y - h], [x + h, y + h], [x - h, y + h]] as XY[]) {
    block(dark, px - 0.6, py - 0.6, px + 0.6, py + 0.6, 0, 20.0)
  }
  // a curved pediment on each face over a round window, a tall arched light below
  const faces: [Side, number, number][] = [['west', x - h - 0.1, y], ['east', x + h + 0.1, y], ['front', y - h - 0.1, x], ['rear', y + h + 0.1, x]]
  for (const [side, c, t] of faces) {
    disc(win, side, c, t, 17.6, 0.6, 0.06, 12)
    disc(dark, side, c, t, 17.6, 0.85, 0.03, 12)
    for (const d of [-0.8, 0.8]) window(side, c, t + d, 0.9, 9.5, 16.0)
  }
  // pediments: half-discs standing on the cornice
  const ped = (r: number): [number, number][] => { const p: [number, number][] = []; for (let k = 0; k <= 8; k++) { const t = (k / 8) * Math.PI; p.push([r * Math.cos(t), 20.0 + r * 0.75 * Math.sin(t)]) } return p }
  slabY(dark, ped(2.4).map(([u, z]) => [x + u, z] as [number, number]), y - h - 0.2, y - h + 0.5, [x, 20.3])
  slabY(dark, ped(2.4).map(([u, z]) => [x + u, z] as [number, number]), y + h - 0.5, y + h + 0.2, [x, 20.3])
  for (const s of [-1, 1]) slabX(dark, ped(2.4).map(([u, z]) => [y + u, z] as [number, number]), Math.min(x + s * (h + 0.2), x + s * (h - 0.5)), Math.max(x + s * (h + 0.2), x + s * (h - 0.5)), [y, 20.3])
  // the lower octagon (r 3.0 across the flats) to 26.5, the upper (2.5) to 33.6
  const o1 = ngon(x, y, 3.0 / Math.cos(Math.PI / 8), 8, Math.PI / 8)
  const o2 = ngon(x, y, 2.5 / Math.cos(Math.PI / 8), 8, Math.PI / 8)
  prism({ wall: brick, win: null, roof: dark, ring: o1, z0: 19.8, z1: 26.0, facade: null, bevel: 0.06 })
  band(dark, o1, 25.6, 26.4, 0.25)
  prism({ wall: brick, win: null, roof: dark, ring: o2, z0: 26.0, z1: 33.4, facade: null, bevel: 0.06 })
  band(dark, o2, 33.0, 33.7, 0.3)
  for (let k = 0; k < 8; k++) {
    for (const [o, z0, z1, w] of [[o1, 21.5, 25.0, 0.9], [o2, 27.2, 32.3, 1.0]] as [XY[], number, number, number][]) {
      const a = o[k], b = o[(k + 1) % 8], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      const f = wallFrame(a, b, 0.06), r = w / 2, spring = z1 - r
      const pts: [number, number][] = [[L / 2 - r, z0], [L / 2 + r, z0]]
      for (let i = 0; i <= 8; i++) { const t = (i / 8) * Math.PI; pts.push([L / 2 + r * Math.cos(t), spring + r * Math.sin(t)]) }
      for (let i = 0; i < pts.length; i++) {
        const A = pts[i], B = pts[(i + 1) % pts.length]
        if (Math.hypot(A[0] - B[0], A[1] - B[1]) < 1e-6) continue
        win.tri(f.at(L / 2, z0 + 0.3), f.at(A[0], A[1]), f.at(B[0], B[1]))
      }
    }
  }
  // the clock stage: round, four white faces, a cornice
  const c3 = ngon(x, y, 2.25, 16)
  prism({ wall: brick, win: null, roof: dark, ring: c3, z0: 33.4, z1: 37.4, facade: null, bevel: 0.04 })
  band(dark, c3, 36.9, 37.5, 0.25)
  for (const [side, c, t] of [['west', x - 2.25, y], ['east', x + 2.25, y], ['front', y - 2.25, x], ['rear', y + 2.25, x]] as [Side, number, number][]) {
    disc(white, side, c, t, 35.3, 0.9, 0.1, 14)
    rect(dark, side, c - (side === 'west' ? 0.06 : side === 'east' ? -0.06 : 0), t, 0.1, 35.3, 35.95, 0.16)
  }
  // small pale pinnacles round the clock stage on the octagon's corners
  for (const [px, py] of ngon(x, y, 2.7, 8, Math.PI / 8)) {
    block(copper, px - 0.22, py - 0.22, px + 0.22, py + 0.22, 33.7, 35.3)
    dome(copper, px, py, 0.3, 35.3, 0.7, 6, 2)
  }
  // the pale cupola, the lantern and the cross
  dome(copper, x, y, 2.4, 37.4, 3.9, 16, 5)
  const lan = ngon(x, y, 0.6, 8)
  prism({ wall: copper, win: null, roof: copper, ring: lan, z0: 40.9, z1: 42.6, facade: null, bevel: 0.03 })
  dome(copper, x, y, 0.75, 42.6, 0.7, 8, 2)
  barCross(copper, x, y, 43.2, 1.4, 0.8, 0.14)
}

// ---------------------------------------------------------------------------
// Finish
// ---------------------------------------------------------------------------

const lit = (p: V3, n: V3): number => {
  const up = n[2] > 0.7 ? 0.3 : 1
  if (p[1] < YF + 1 && n[1] < -0.3) return up
  if (Math.hypot(p[0] - T.x, p[1] - T.y) < 4.5 && p[2] > 20) return 0.8 * up
  return 0.05 * up
}
finishModel("St. Mary's Assumption Church", 'nola-st-marys-assumption', [
  { part: brick, material: { ...finish('sma-brick', 0xd3b48e), floodlight: lit } },
  { part: dark, material: { ...finish('sma-brick-trim', 0xb6966f), floodlight: lit } },
  { part: roof, material: finish('sma-slate', 0x7a828c) },
  { part: win, material: PALETTE.window },
  { part: white, material: finish('sma-white', 0xf1ece2) },
  { part: copper, material: finish('sma-cupola', 0xdcdedb) },
], { bearing: 54.3, osm: 'way/328032233', height: 44.6 }, 6500)
