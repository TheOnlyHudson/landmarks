/**
 * Wake County Justice Center, Raleigh (2013; O'Brien/Atkins with
 * Fentress): procedural, CC0-1.0.
 * bun generators/ral-wake-county-justice-center.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 2 (the OSM
 * walls run at 2°/92°). Origin: the area centroid of OSM way/310012128
 * (-78.641175, 35.776579). y = 0 is the lowest ground under the footprint;
 * Mapterhorn (z13) varies about 2 m across it. Elevation 0.
 *
 * OSM: way/310012128 (building, height 78.3) is one outline for the whole
 * block between Salisbury, Martin, McDowell and Davie Streets' half-block:
 * 120 × 68 m, notched on the east. The only building under the model; the
 * Public Safety Center (way/47663708) is the separate jail tower to the
 * south.
 * USGS NAIP (public domain, 0.25 m/px): flat roofs, a tall part on the
 * south casting its shadow north-west; read alone it suggests a tower on
 * the south-east only, but p2 (from the north) shows the crown broader
 * than the courts block in front of it, so the tower is drawn as an
 * east-west slab over the south half (x -22..46; p1 shows it
 * slender from the east, which caps its width).
 *
 * No lidar covers Wake County. Heights: the tower's top 78.3 m (OSM
 * height); the rest is estimated, counting storeys at ≈3.9 m (78.3 m over
 * 20 floors): the podium 4 storeys (14 m, p1, p2), the north courts block
 * 13 storeys (51.5 m, p2: its top about 70% of the crown's height), the tower's shaft to 66 m and its crown of fins round a
 * glazed top, solid corners to 78.3 m (p1, p2, p3).
 *
 * Photos (evidence; local copies in landmarks-scratch/ral/work/
 * ral-wake-county-justice-center/p2):
 *  p1 "Wake County Justice Center.JPG", Alexisrael, CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Wake_County_Justice_Center.JPG:
 *     from Salisbury Street: the podium, the tower's blue glass corner and
 *     finned crown (the punched-window tower on the left is the Public
 *     Safety Center).
 *  p2 "Wake County Justice Center Raleigh, NC", James Willamor, CC BY-SA
 *     2.0, https://www.flickr.com/photos/81464596@N00/13138756803: from
 *     the north: podium, white screen, the glazed courts block, the crown
 *     behind.
 *  p3 "Raleigh, NC", James Willamor, CC BY-SA 2.0,
 *     https://www.flickr.com/photos/81464596@N00/6908496066 (the same view
 *     at sunset) and https://www.flickr.com/photos/81464596@N00/7054594077
 *     (with PNC Plaza, from the north-west).
 * Aerial: USGS NAIP (public domain).
 *
 * Colours: tan precast (p1, p2), blue-green glass (p1, p2), white metal
 * panels on the screen and roof plant (p2).
 * Estimated: every height but the top; the tower's plan (p2 against NAIP), the courts block's plan,
 * the west half's height. Invented:
 * the south and west faces' window rhythm.
 * Doubts: no photo from the south or west; the split between tower and
 * courts block rests on one aerial and two distant photos.
 * Night: windows glow.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { type XY, type Face, prism, capRing, ccw, finishGlb, writeModel, rect } from './sea-tacoma-union-station'
import { box, panel } from './nash-tennessee-state-capitol'

const OUTLINE: XY[] = [[-57.1,-33.9],[-56.7,28.2],[-54.9,28.2],[-54.9,31.2],[-36.5,31.3],[-36.5,34.1],[-2.8,34.3],[-2.7,31.9],[5.5,32.0],[5.5,33.3],[31.4,33.4],[31.5,31.1],[36.2,31.1],[36.2,33.0],[62.9,33.0],[62.9,4.8],[48.2,4.8],[48.2,-19.5],[47.5,-19.5],[47.5,-27.1],[63.2,-27.1],[63.2,-34.6],[62.5,-34.6],[-8.2,-34.2],[-24.4,-34.1]]
const POD = 14, COURTS = 51.5, SHAFT = 66, TOP = 78.3
const TW = rect(-22, -32, 46, 2) // the tower: a slab, broad to the north (p2)
const CB = rect(-26, 2, 30, 28) // the courts block

type Edge = { f: Face; L: number }
const edges = (r: XY[]): Edge[] => r.map((a, i) => {
  const b = r[(i + 1) % r.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
  return { f: { o: [a[0], a[1], 0] as V3, n: [(b[1] - a[1]) / L, -(b[0] - a[0]) / L] as XY }, L }
})

function build() {
  const tan = new Part(), win = new Part(), blue = new Part(), roof = new Part(), white = new Part()

  // ------------------------------------------------------------ the podium (p1, p2)
  const ring = ccw(OUTLINE)
  prism(tan, roof, ring, 0, POD)
  capRing(tan, ring, 0, false)
  for (const { f, L } of edges(ring)) {
    if (L < 6) continue
    panel(tan, f, L / 2, L, POD - 0.8, POD, 0.15) // coping
    // two bands of grouped windows, piers between
    const n = Math.max(1, Math.round(L / 6))
    for (let k = 0; k < n; k++) {
      const s = (L * (k + 0.5)) / n, w = L / n - 1.6
      panel(win, f, s, w, 2.0, 5.6, 0.06)
      panel(win, f, s, w, 7.2, 12.2, 0.06)
    }
  }
  // the white screen on the podium roof in front of the courts block (p2)
  box(white, -24, 28, 28, 32.5, POD - 0.01, POD + 6, roof, 0.1)
  { const f: Face = { o: [28, 32.5, 0], n: [0, 1] }; for (let k = 0; k < 8; k++) panel(win, f, 3.25 + k * 6.5, 2.4, POD + 0.6, POD + 3.4, 0.05) }

  // ------------------------------------------------------------ the courts block: piers and glazed bays (p2)
  prism(tan, roof, CB, POD - 0.01, COURTS)
  box(white, -14, 6, 18, 24, COURTS - 0.01, COURTS + 4, roof, 0.1)
  const bays = (r: XY[], z0: number, z1: number, glass: Part, span: number, groups: number[][]) => {
    for (const { f, L } of edges(r)) {
      const n = Math.max(2, Math.round(L / span))
      panel(tan, f, L / 2, L, z1 - 1.2, z1, 0.18) // coping
      for (let k = 0; k < n; k++) {
        const s = (L * (k + 0.5)) / n, w = L / n - 2.4
        for (const [a, b] of groups) panel(glass, f, s, w, a, b, 0.07)
      }
      void z0
    }
  }
  // three-storey glazed panels with spandrels between (11.7 m groups over the podium)
  bays(CB, POD, COURTS, blue, 5.5, [[POD + 1.0, POD + 10.6], [POD + 12.2, POD + 22.2], [POD + 23.8, POD + 33.8], [POD + 35.4, COURTS - 2.0]])

  // ------------------------------------------------------------ the tower (p1, NAIP)
  prism(tan, roof, TW, POD - 0.01, SHAFT)
  bays(TW, POD, SHAFT, win, 4.2, [[POD + 1, POD + 11.2], [POD + 12.8, POD + 23], [POD + 24.6, POD + 34.8], [POD + 36.4, POD + 46.4], [SHAFT - 4.4, SHAFT - 1.6]])
  // the blue glass corner (p1): a recessed band of glass up the north-east corner, broken by spandrels
  for (const [z0, z1] of [[POD + 1, POD + 11.2], [POD + 12.8, POD + 23], [POD + 24.6, POD + 34.8], [POD + 36.4, POD + 46.4]] as [number, number][]) {
    panel(blue, { o: [46, -32, 0], n: [1, 0] }, 30.5, 5.5, z0, z1, 0.09)
    panel(blue, { o: [46, 2, 0], n: [0, 1] }, 3.0, 5.5, z0, z1, 0.09)
  }
  // the crown: a white mechanical box ringed by tan fins stepping up to the middle of each face (p1, p2, p3)
  box(blue, -18, -28, 42, -2, SHAFT - 0.01, TOP - 2.5, roof, 0.1)
  for (const { f, L } of edges(TW)) {
    const n = Math.round(L / 3.6)
    for (let k = 0; k <= n; k++) {
      const s = 0.4 + ((L - 0.8) * k) / n
      const h = k === 0 || k === n ? TOP : TOP - 1.8 - (k % 2) * 1.6
      const p0 = (ss: number, dd: number): XY => [f.o[0] + -f.n[1] * ss + f.n[0] * dd, f.o[1] + f.n[0] * ss + f.n[1] * dd]
      const wf = k === 0 || k === n ? 1.6 : 0.45
      const a = p0(s - wf, -2.0), b = p0(s + wf, 0)
      box(tan, Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[0], b[0]), Math.max(a[1], b[1]), SHAFT - 0.01, h, tan)
    }
  }

  return finishGlb('Wake County Justice Center', [
    { part: tan, material: finish('wcjc-precast', 0xdfcfb4) },
    { part: win, material: PALETTE.window },
    { part: blue, material: windowVariant(2, 0x6f93ad) },
    { part: roof, material: PALETTE.roof },
    { part: white, material: finish('wcjc-panel', 0xeceae4) },
  ], { bearing: 2, height: TOP, replaces: ['way/310012128'] }, 6500)
}

if (import.meta.main) await writeModel('ral-wake-county-justice-center', build())
