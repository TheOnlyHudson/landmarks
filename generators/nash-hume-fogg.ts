/**
 * Hume-Fogg High School, 700 Broadway, Nashville (1912, William B.
 * Ittner with Asmus & Clark; Tudor Gothic Revival) — original procedural
 * geometry, CC0-1.0.
 * bun generators/nash-hume-fogg.ts
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 332, so +x
 * runs along Broadway toward 7th Avenue and the Broadway front is the -y
 * face; 8th Avenue is the -x side. Anchor = area centroid of the outer way
 * (way/264935628) of OSM relation/6861709, 36.159590, -86.781773. y = 0 is
 * the lowest ground under the footprint (7th Avenue at the north-east,
 * lidar ground_min + 0.6); Broadway in front is 2.8–4.6 m higher, 8th
 * Avenue ~4.
 *
 * Identity, in order: the four-storey block of grey rough-faced limestone
 * with a coped parapet; crenellated corner pavilions standing a little
 * proud; the entrance bay at the middle of the Broadway front, two
 * polygonal crenellated turrets flanking a crenellated centre with a big
 * Tudor-arched doorway, a corbel table, tiers of eight-light windows and a
 * carved band; big three-light window groups in even bays over a
 * basement; the lower rear wing on Commerce Street.
 *
 * Evidence:
 *  - plan: OSM relation/6861709 (outer 94 x 46 m plus the rear wing, two
 *    inner light wells), checked against the lidar: the Broadway face is
 *    at y = -28.6 (OSM -27.1) and the entrance bay stands 2.7 m further
 *    out with its turrets; the east light well is roofed over in the
 *    lidar and is drawn closed; the west one is a low roof at 7.3.
 *  - heights: USGS 3DEP lidar TN_DavidsonCo_1_2022 (2022), 0.5 m grid in
 *    the model frame, above y = 0: parapet 21.6–21.8 with corner merlons to
 *    23.5; entrance bay centre 24.7; turrets 27.3 (merlon tops); the
 *    auditorium roof between the wells 18.7; rear wing 16.4. Measured.
 *  - storeys, window groups and the entrance bay: from Rivera's square-on
 *    south face and LeMay's views of the west side (54383405777) and the
 *    entrance (54384484169), scaled to the lidar. Estimated.
 *  - colours: grey limestone (sampled #b1ada0 in sun, pulled light, a
 *    cool grey), pale dressings, dark-framed windows.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Hume-Fogg Academic High School (South face), (Southwest corner),
 *    Michael Rivera, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Hume-Fogg_Academic_High_School_(South_face).JPG
 *  - Hume-Fogg High School, Broadway and 7th Avenue, Nashville, TN
 *    (54383405777), (54384484169), (54384291336) and the rest of the set,
 *    Warren LeMay, CC BY-SA 2.0
 *    https://commons.wikimedia.org/wiki/File:Hume-Fogg_High_School,_Broadway_and_7th_Avenue,_Nashville,_TN_(54383405777).jpg
 *    https://commons.wikimedia.org/wiki/File:Hume-Fogg_High_School,_Broadway_and_7th_Avenue,_Nashville,_TN_(54384291336).jpg
 *  - Hume-Fogg School 2022.jpg, Antony-22, CC BY-SA 4.0 (south-east)
 *    https://commons.wikimedia.org/wiki/File:Hume-Fogg_School_2022.jpg
 * No look-only sources. No commercial imagery.
 *
 * Night: windows glow; the doors are `entrance`; the entrance bay carries
 * a light floodlight.
 *
 * Left out: the rough-faced coursing, carving and shields, the corbels,
 * individual glazing bars (three lights per group are drawn), railings,
 * the stair's cheek walls, lamps.
 *
 * Doubts: the rear (Commerce Street) face and the rear wing are not
 * photographed: the rear face is drawn like the sides, the rear wing
 * plain; window groups per wing are counted from oblique views and may be
 * off by one.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { prism, ccw, type XY } from './atl-westin-peachtree-plaza'
import { shape, rectOn, band, block, type Face } from './nash-ryman-auditorium'
import { wf, rect, chamfered, type Side } from './nash-downtown-presbyterian'

// Model frame, bearing 332: +y points away from Broadway, the front is the -y face.
const X0 = -47.0, X1 = 48.0, YF = -28.6, YB = 19.0
const TOP = 21.7
const AX = 0.5 // the entrance axis
// storey bands: basement, three floors (z0, z1 of the window panels)
const FLOORS: [number, number][] = [[4.9, 7.4], [8.7, 12.0], [13.0, 16.3], [17.3, 20.1]]

/** Merlons standing on a wall top along a face, from s0 to s1. */
function merlons(p: Part, f: Face, s0: number, s1: number, z: number, h = 1.3, w = 1.3, gap = 1.1, depth = 0.7) {
  const n = Math.max(1, Math.floor((s1 - s0 + gap) / (w + gap)))
  const used = n * w + (n - 1) * gap, a = s0 + (s1 - s0 - used) / 2
  for (let i = 0; i < n; i++) {
    const s = a + i * (w + gap)
    const ring = ccw([f.P(s, z, 0.05), f.P(s + w, z, 0.05), f.P(s + w, z, -depth), f.P(s, z, -depth)].map((q) => [q[0], q[1]] as XY))
    prism(p, ring, z - 0.05, z + h, p, 0.08)
  }
}
/** A four-centred (Tudor) arch outline. */
function tudor(sc: number, w: number, z0: number, zs: number, rise: number, seg = 8): XY[] {
  const h = w / 2, pts: XY[] = [[sc - h, z0], [sc + h, z0], [sc + h, zs]]
  for (let i = 1; i < seg; i++) {
    const t = i / seg, x = Math.cos(Math.PI * t), y = Math.sin(Math.PI * t)
    pts.push([sc + h * x, zs + rise * Math.pow(y, 0.7) * (1 - 0.15 * Math.abs(x))])
  }
  pts.push([sc - h, zs])
  return pts
}

function build() {
  const stone = new Part(), trim = new Part(), win = new Part(), roof = new Part(), door = new Part()

  /** A group of lights in one window opening: a panel with pale mullions. */
  const group = (f: Face, sc: number, w: number, z0: number, z1: number, lights: number, o = 0) => {
    rectOn(trim, f, sc - w / 2 - 0.2, sc + w / 2 + 0.2, z0 - 0.25, z1 + 0.15, o + 0.03)
    rectOn(win, f, sc - w / 2, sc + w / 2, z0, z1, o + 0.07)
    for (let k = 1; k < lights; k++) { const s = sc - w / 2 + (w * k) / lights; rectOn(trim, f, s - 0.09, s + 0.09, z0, z1, o + 0.1) }
  }

  // ── Massing (lidar roof heights) ──
  prism(stone, rect(X0, YF, X1, -12), 0, TOP, roof, 0.3)
  prism(stone, rect(X0, 6.3, X1, YB), 0, TOP - 0.1, roof, 0.3)
  prism(stone, rect(X0, -12.2, -25.6, 6.5), 0, TOP, roof, 0.3)
  prism(stone, rect(16.0, -12.2, X1, 6.5), 0, TOP - 0.1, roof, 0.3)
  prism(stone, rect(-25.8, -12.2, 16.2, 6.5), 0, 7.3, roof, 0.2) // the light well's floor and the low centre
  prism(stone, rect(-15.8, -12.2, 16.2, 6.5), 7.0, 18.7, roof, 0.2) // the auditorium between the wells
  prism(stone, rect(-15.5, YB - 0.2, 16.1, 38.4), 0, 16.4, roof, 0.3) // rear wing
  // the entrance bay: a block between two polygonal turrets, proud of the front
  const BAY0 = AX - 10, BAY1 = AX + 10, BF = -29.3
  prism(stone, rect(BAY0, BF, BAY1, -12.5), 0, 23.6, roof, 0.2)
  const TUR = [AX - 7.5, AX + 7.5]
  for (const cx of TUR) prism(stone, chamfered(cx, -29.0, 2.5, 2.5, 1.0), 0, 26.0, roof, 0.15)

  // ── Faces ──
  const F = wf('S', YF, X0, X1), Bk = wf('N', YB, X0, X1), E = wf('E', X1, YF, YB), W = wf('W', X0, YF, YB)
  for (const { f } of [F, Bk, E, W]) {
    band(trim, f, 0, f.L, 7.9, 8.25, 0.1) // water table over the basement
    band(trim, f, 0, f.L, TOP - 0.55, TOP, 0.18) // coping
    band(trim, f, 0, f.L, 20.45, 20.7, 0.08)
  }
  // crenellated corner pavilions: merlons along 9 m of every face from each corner
  for (const { f } of [F, Bk, E, W]) {
    merlons(stone, f, 0, 9.0, TOP)
    merlons(stone, f, f.L - 9.0, f.L, TOP)
    band(stone, f, 0.0, 9.0, 0.3, TOP, 0.25)
    band(stone, f, f.L - 9.0, f.L, 0.3, TOP, 0.25)
  }

  // Windows: three-light groups per bay, per storey, the bays even across each wing.
  const wing = (f: Face, s0: number, s1: number, n: number, o = 0) => {
    const bw = (s1 - s0) / n
    for (let i = 0; i < n; i++) {
      const sc = s0 + bw * (i + 0.5)
      FLOORS.forEach(([z0, z1], k) => group(f, sc, k === 0 ? 3.6 : 4.3, z0, z1, 3, o))
    }
  }
  // each corner pavilion: one group, standing on the pavilion's face
  for (const { f } of [F, Bk, E, W]) { wing(f, 0, 9, 1, 0.25); wing(f, f.L - 9, f.L, 1, 0.25) }
  {
    const { f, s } = F
    wing(f, s(X0 + 9), s(BAY0 - 0.4), 4)
    wing(f, s(BAY1 + 0.4), s(X1 - 9), 4)
  }
  for (const { f } of [E, W]) wing(f, 9, f.L - 9, 5)
  {
    const { f, s } = Bk
    wing(f, s(X1 - 9), s(16.6), 4)
    wing(f, s(-16.1), s(X0 + 9), 4)
  }

  // ── The entrance bay ──
  {
    const { f, s } = wf('S', BF, BAY0, BAY1)
    const m = s(AX), cw = 9.8
    // the great Tudor-arched doorway, its stone surround, doors and glazed head
    shape(trim, f, tudor(m, 7.6, 5.6, 9.6, 2.2), 0.05)
    shape(stone, f, tudor(m, 6.4, 5.6, 9.6, 1.8), 0.08)
    rectOn(door, f, m - 2.6, m + 2.6, 5.8, 8.6, 0.12)
    shape(win, f, tudor(m, 5.2, 8.7, 9.6, 1.5), 0.12)
    // the corbel table over the arch
    band(trim, f, m - cw / 2, m + cw / 2, 12.0, 12.7, 0.3)
    // a tier of eight lights, the carved band, two tiers of eight lights
    group(f, m, 8.6, 13.2, 15.4, 8)
    rectOn(trim, f, m - 4.4, m + 4.4, 15.7, 16.6, 0.06)
    group(f, m, 8.6, 17.0, 21.6, 8)
    rectOn(trim, f, m - 4.4, m + 4.4, 19.2, 19.45, 0.11)
    band(trim, f, 0, f.L, 23.0, 23.6, 0.15)
    merlons(stone, f, m - cw / 2, m + cw / 2, 23.6, 1.1, 1.1, 0.8)
    // the steps up to the door (the street is ~4.5 m above y = 0 here)
    for (let i = 0; i < 3; i++) block(trim, AX - 4.2 + i * 0.4, AX + 4.2 - i * 0.4, BF - 3.2 + i * 1.0, BF + 0.1, 0, 4.9 + i * 0.35)
  }
  // the turrets: windows on their three front faces, string courses, crenellations
  for (const cx of TUR) {
    const r = chamfered(cx, -29.0, 2.5, 2.5, 1.0)
    // faces of the octagon facing -y, ±45°, ±x (indices from chamfered's order)
    for (let i = 0; i < 8; i++) {
      const a = r[i], b = r[(i + 1) % 8]
      if (b[0] - a[0] < 0.1) continue // only the faces looking forward (outward normal y = -dx < 0)
      const f: Face = (() => {
        const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [t[1], -t[0]]
        return { L, t, n, P: (s: number, z: number, out = 0) => [a[0] + t[0] * s + n[0] * out, a[1] + t[1] * s + n[1] * out, z] as V3 }
      })()
      const w = Math.min(1.4, f.L - 0.5)
      for (const [z0, z1] of FLOORS.slice(1)) group(f, f.L / 2, w, z0 + 0.3, z1 - 0.2, 1)
      group(f, f.L / 2, w, 21.4, 23.4, 1)
      band(trim, f, 0, f.L, 24.6, 25.1, 0.15)
      merlons(stone, f, 0.1, f.L - 0.1, 26.0, 1.3, Math.min(1.0, f.L / 2 - 0.2), 0.5, 0.5)
    }
  }

  const flood = (p: V3, n: V3) => (n[2] > 0.6 ? 0 : p[1] < -27 && Math.abs(p[0] - AX) < 11 ? 0.6 : 0)
  return [
    { part: stone, material: { ...finish('hume-fogg-limestone', 0xcac8c0), floodlight: flood } },
    { part: trim, material: { ...finish('hume-fogg-dressings', 0xe8e4da), floodlight: flood } },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: door, material: PALETTE.entrance },
  ]
}

if (import.meta.main) {
  const { save } = await import('./atl-westin-peachtree-plaza')
  await save('nash-hume-fogg', 'Hume-Fogg High School', build(), { height: 27.3, anchor: [36.159590, -86.781773], bearing: 332 })
}
