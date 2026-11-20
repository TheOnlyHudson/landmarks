/**
 * IDS Center (1972, Philip Johnson and John Burgee), Minneapolis — original
 * procedural geometry, CC0-1.0.
 * bun generators/msp-ids-center.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor (the OSM
 * outline's area centroid, -93.2719525, 44.9761346) on the lowest ground
 * under the footprint. Placed at bearing 30: the model's +y runs along
 * Nicollet Mall and Marquette Avenue (north-north-east), +x along 7th and
 * 8th Streets (east-south-east). The block: tower at the 8th Street /
 * Nicollet corner (south-west in the model), Marquette Hotel at 7th /
 * Marquette (north-east), the office annex at 8th / Marquette (south-east),
 * a two-storey retail wing at 7th / Nicollet (north-west), and the Crystal
 * Court filling the middle under its stepped glass roof.
 *
 * Identity, as the photos show it:
 * - an octagon-ish plan whose four corners are cut by seven re-entrant
 *   "zogs" each, which read from the street as dark and light vertical
 *   stripes down the corners (drawn so: the short return faces are dark
 *   charcoal with slate glass, the long ones light glass);
 * - light sky-blue reflective glass with a fine grid (light window
 *   variant, pale trim floor and mullion lines);
 * - a dark charcoal louvred crown about four storeys deep, slightly proud
 *   of the glass, over a band of darker glass, with the zogs carried up
 *   through it; flat top with two antenna masts;
 * - the Crystal Court's glass roof stepping up in tiers toward the tower.
 *
 * Sources
 * - OSM: outline way/1385236413 (building=office "IDS Center"), parts
 *   way/166748034 "IDS Tower" (height 241, 57 levels), way/156909891
 *   "Crystal Court" (height 36), way/156909956 "The Marquette Hotel"
 *   (height 70, 19 levels), way/156909957 (annex, height 38, 12 levels),
 *   way/156909969 (retail wing, 2 levels). The five parts tile the outline
 *   exactly. The tower's plan in OSM is a 72.9 x 41.2 m rectangle with
 *   seven steps of 3.05 x 1.47 m cut into each corner, mirror-symmetric;
 *   it is redrawn here from those numbers so it is exactly symmetric.
 * - Lidar (measured): USGS 3DEP MN_CentralMissRiver_4_B22 (flown 2022) and
 *   MN_FullState (older). Both lose the tower above ~70 m (no roof
 *   returns), so the tower's height is published, not measured; its walls
 *   in the point cloud sit on the OSM outline to within 1–2 m. Heights
 *   above the block's ground (which falls under a metre across it): hotel
 *   slab 64 m with a 70 m block at its south-west (Crystal Court) side,
 *   and an 11 m low wing on 7th Street; annex 38.2 m; retail wing 12.3 m;
 *   Crystal Court roof tiers at about 18, 22, 26, 30 and 34 m rising toward
 *   the tower, 34–38 m in the tower's north-east zog notch.
 * - Published: roof 241 m (792 ft), 57 storeys, antennas to about 277 m
 *   (910 ft) (Wikipedia, "IDS Center"; CTBUH).
 * - USGS NAIP orthophoto (public domain): plan check of the block.
 * - Photos (Wikimedia Commons; evidence):
 *   - "Minneapolis April 2025 52 (IDS Center).jpg", Michael Barera, CC BY-SA
 *     4.0, https://commons.wikimedia.org/wiki/File:Minneapolis_April_2025_52_(IDS_Center).jpg
 *     (from 7th & Marquette, looking south-west: hotel and tower);
 *   - "IDS Center, October 2024.jpg", Bspor.88, CC0,
 *     https://commons.wikimedia.org/wiki/File:IDS_Center,_October_2024.jpg (crown);
 *   - "IDS Center April 18 2026.jpg", Hurstbergn, CC BY 4.0,
 *     https://commons.wikimedia.org/wiki/File:IDS_Center_April_18_2026.jpg (crown, zogs);
 *   - "IDS Center.jpg", Greg Gjerdingen, CC BY 2.0,
 *     https://commons.wikimedia.org/wiki/File:IDS_Center.jpg (whole tower from the south);
 *   - "IDS Center-Minneapolis-20050608.jpg", Michael Hicks, CC BY 2.0,
 *     https://commons.wikimedia.org/wiki/File:IDS_Center-Minneapolis-20050608.jpg
 *     (from above, south-east: annex roof, court glass, hotel, low louvre band);
 *   - "IDS Center, Minneapolis (33418042996).jpg", Sharon Mollerus, CC BY 2.0,
 *     https://commons.wikimedia.org/wiki/File:IDS_Center,_Minneapolis_(33418042996).jpg (zogs from below);
 *   - "IDS Center and Wells Fargo Center - Downtown Minneapolis Skyscrapers
 *     (53076885497).jpg", Tony Webster, CC BY 2.0 (crown louvres, roof);
 *   - "IDS Tower.jpg", Tim Wilson, CC BY 2.0,
 *     https://commons.wikimedia.org/wiki/File:IDS_Tower.jpg (night: windows lit, crown dark).
 *   No look-only sources were used.
 *
 * Estimated: the crown's depth (14 m, from its proportion to the tower's
 * width in three photos), the darker glass band under it (three storeys),
 * the crown standing 0.35 m proud; the low louvre band at 36–44 m (from
 * the aerial, where it sits about level with the annex roof); the dark
 * 7 m tower base; the antennas' positions (a third of the way in from each
 * end along the long axis, from three photos); the court tiers' outlines
 * (traced from the lidar at 2 m); storey grouping (three storeys a panel).
 * Invented: nothing beyond simplification. Doubts: the retail wing's
 * facade (no clear photo; drawn as dark glass); the hotel is dark glass
 * per Barera and the Hicks aerial (lead review); the hotel's north strip on
 * 7th Street (lidar says 11 m, drawn so); the tower's top is not in either
 * lidar flight. The glass corners are left sharp, not bevelled: a
 * chamfer on 56 zog corners would double the plan and the zogs already
 * break every corner into small steps.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { ccw, capRing, edgeBase, finishGlb, outward, type Prism, type XY } from './sea-columbia-center'

// ---------------------------------------------------------------- tower plan

const C: XY = [-16.15, -29.95] // tower centre, model frame
const A = 36.45, B = 20.6 // half length (x), half width (y)
const TREAD = 3.05, RISER = 1.47, ZOGS = 7

/** The tower ring, counter-clockwise, offset outward by d. */
function towerRing(d = 0): XY[] {
  const ne: XY[] = []
  let x = A - ZOGS * TREAD, y = B
  ne.push([x, y])
  for (let k = 0; k < ZOGS; k++) {
    y -= RISER
    ne.push([x, y])
    x += TREAD
    ne.push([x, y])
  }
  // ne runs clockwise from the north face's east end to the east face's top
  const se = [...ne].reverse().map(([a, b]): XY => [a, -b])
  const sw = ne.map(([a, b]): XY => [-a, -b])
  const nw = [...ne].reverse().map(([a, b]): XY => [-a, b])
  const cw = [...ne, ...se, ...sw, ...nw]
  const r = ccw(cw.map(([a, b]): XY => [a + C[0], b + C[1]]))
  if (!d) return r
  return r.map((q, i) => {
    const p = r[(i - 1 + r.length) % r.length], s = r[(i + 1) % r.length]
    const n1 = outward(p, q), n2 = outward(q, s)
    return [q[0] + d * (n1[0] + n2[0]), q[1] + d * (n1[1] + n2[1])] as XY
  })
}

// ---------------------------------------------------------------- panels

type Grid = { base: number; group: number; spandrel: number; bayW: number; pier: number; inset: number; proud?: number }

/**
 * Window panels on the wall over edge a→b (counter-clockwise ring) between
 * z0 and z1: storey groups counted from `base`, so they line up across
 * faces, and bays split by piers.
 */
function facePanels(part: Part, a: XY, b: XY, z0: number, z1: number, g: Grid) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (L < 2 * g.inset + 0.8) return
  const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = outward(a, b), pr = g.proud ?? 0.05
  const bays = Math.max(1, Math.round((L - 2 * g.inset) / g.bayW)), w = (L - 2 * g.inset) / bays
  const P = (s: number): XY => [a[0] + t[0] * s + n[0] * pr, a[1] + t[1] * s + n[1] * pr]
  for (let k = Math.floor((z0 - g.base) / g.group); g.base + k * g.group < z1; k++) {
    const lo = Math.max(g.base + k * g.group + g.spandrel / 2, z0 + 0.3)
    const hi = Math.min(g.base + (k + 1) * g.group - g.spandrel / 2, z1 - 0.3)
    if (hi - lo < 1.5) continue
    for (let j = 0; j < bays; j++) {
      const s = g.inset + j * w + (j ? g.pier / 2 : 0), e = g.inset + (j + 1) * w - (j < bays - 1 ? g.pier / 2 : 0)
      const p = P(s), q = P(e)
      part.quad([p[0], p[1], lo], [q[0], q[1], lo], [q[0], q[1], hi], [p[0], p[1], hi])
    }
  }
}

function wall(part: Part, a: XY, b: XY, z0: number, z1: number) {
  if (z1 - z0 < 0.01) return
  part.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
}

/** A square mast from z0 to z1, tapering. */
function mast(part: Part, c: XY, z0: number, z1: number, w0: number, w1: number) {
  const ring = (w: number, z: number): V3[] => [[c[0] - w, c[1] - w, z], [c[0] + w, c[1] - w, z], [c[0] + w, c[1] + w, z], [c[0] - w, c[1] + w, z]]
  part.loft([ring(w0, z0), ring(w1, z1)])
  part.cap(ring(w1, z1), true)
}

// ---------------------------------------------------------------- the model

function build() {
  const trim = new Part(), glassLight = new Part(), glassDark = new Part(), dark = new Part(), court = new Part(), roof = new Part()

  // Heights (see header).
  const H = {
    roof: 241, crown: 227, darkBand: 215, base: 7, louvre0: 36, louvre1: 44,
    hotel: 64, hotelCore: 70, hotelLow: 11, annex: 38.2, retail: 12.3, court: 13, notch: 34,
    mast1: 277, mast2: 271,
  }

  // OSM parts in the model frame (bearing 30, about the anchor).
  const ANNEX: XY[] = [[20.28, -22.76], [20.2, -34.29], [20.17, -39.06], [26.13, -39.02], [26.13, -41.45], [27.96, -41.44], [27.96, -44.41], [29.52, -44.4], [29.51, -47.53], [31.14, -47.52], [31.14, -50.61], [50.76, -50.51], [50.8, 5.19], [47.89, 5.18], [47.89, 6.63], [44.7, 6.62], [44.7, 8.13], [41.62, 8.12], [41.62, 9.54], [38.69, 9.53], [38.7, 11.08], [26.55, 11.01], [26.52, -22.74]]
  const RETAIL: XY[] = [[-30.9, 2.36], [-51.92, 2.43], [-51.72, 48.95], [-24.4, 48.8], [-24.44, 47.35], [-21.42, 47.3], [-21.49, 45.88], [-18.45, 45.8], [-18.55, 44.4], [-15.47, 44.3], [-15.59, 25.84]]
  const COURT: XY[] = [[-30.9, 2.36], [-15.59, 25.84], [-15.43, 40.31], [-9.18, 40.4], [-9.21, 31.48], [-3.41, 31.5], [-3.42, 27.2], [2.64, 27.21], [2.63, 25.74], [8.69, 25.75], [8.68, 24.25], [26.47, 24.3], [26.45, 17.0], [35.86, 17.03], [35.79, 11.06], [26.55, 11.01], [26.52, -22.74], [20.28, -22.76], [20.31, -19.65], [17.33, -19.64], [17.34, -18.17], [14.3, -18.16], [14.3, -16.69], [11.25, -16.69], [11.27, -15.21], [8.22, -15.21], [8.23, -13.75], [5.18, -13.74], [5.19, -12.27], [2.14, -12.26], [2.15, -10.8], [-0.9, -10.8], [-0.89, -9.35], [-31.07, -9.31]]
  // The court's part of the tower's north-east zog notch, roofed at 34 m.
  const NOTCH: XY[] = [[26.52, -9.33], [-0.89, -9.35], [-0.9, -10.8], [2.15, -10.8], [2.14, -12.26], [5.19, -12.27], [5.18, -13.74], [8.23, -13.75], [8.22, -15.21], [11.27, -15.21], [11.25, -16.69], [14.3, -16.69], [14.3, -18.16], [17.34, -18.17], [17.33, -19.64], [20.31, -19.65], [20.28, -22.76], [26.52, -22.74]]
  // Hotel: the 64 m slab, the 70 m block on the court side, the 11 m strip on 7th Street.
  const HOTEL: XY[] = [[-9.2, 31.5], [-3.41, 31.5], [-3.42, 27.2], [2.64, 27.21], [2.63, 25.74], [8.69, 25.75], [8.68, 24.25], [26.47, 24.3], [26.45, 17.0], [38.74, 17.04], [38.75, 18.62], [41.83, 18.62], [41.84, 20.07], [44.96, 20.07], [44.98, 25.92], [51.19, 25.94], [51.25, 43.35], [10, 43.34], [10, 48.95], [-9.15, 48.93]]
  const HOTEL_CORE: XY[] = [[26.5, 17.02], [38.7, 17.04], [38.7, 36], [26.5, 36]]
  const HOTEL_LOW: XY[] = [[10, 43.34], [39.24, 43.33], [39.26, 49.05], [10, 48.97]]
  // Crystal Court roof tiers, rising toward the tower (traced from lidar).
  const TIERS: [XY[], number][] = [
    [[[-31.05, -9.31], [26.5, -9.33], [26.5, 23], [-17.4, 23]], 18],
    [[[-27, -9.31], [24, -9.33], [24, 16], [-20, 16], [-27, 5]], 22],
    [[[-22, -9.31], [21, -9.33], [21, 11], [-16, 11], [-22, 2]], 26],
    [[[-17, -9.31], [18, -9.33], [18, 5], [-12, 5], [-17, -1]], 30],
    [[[-13, -9.31], [14, -9.33], [14, -1], [-13, -1]], 34],
  ]

  const tower = towerRing(), crownRing = towerRing(0.35)
  const prisms: Prism[] = [
    { ring: tower, z1: H.crown, wall: trim, roof: roof, kind: 'tower' },
    { ring: ccw(ANNEX), z1: H.annex, wall: dark, roof: roof, kind: 'annex' },
    { ring: ccw(RETAIL), z1: H.retail, wall: dark, roof: roof, kind: 'retail' },
    { ring: ccw(COURT), z1: H.court, wall: court, roof: court, kind: 'court' },
    { ring: ccw(NOTCH), z1: H.notch, wall: court, roof: court, kind: 'court' },
    { ring: ccw(HOTEL), z1: H.hotel, wall: dark, roof: roof, kind: 'hotel' },
    { ring: ccw(HOTEL_CORE), z1: H.hotelCore, wall: dark, roof: roof, kind: 'hotel' },
    { ring: ccw(HOTEL_LOW), z1: H.hotelLow, wall: dark, roof: roof, kind: 'low' },
    ...TIERS.map(([r, z]): Prism => ({ ring: ccw(r), z1: z, wall: court, roof: court, kind: 'court' })),
  ]

  // Tower storeys (about 3.9 m): groups of four, two below the louvre band, eleven above it to
  // the dark band, then the dark band as one group.
  const lowG: Grid = { base: H.base, group: (H.louvre0 - H.base) / 2, spandrel: 0.6, bayW: 6, pier: 0.45, inset: 0.3 }
  const midG: Grid = { base: H.louvre1, group: (H.darkBand - H.louvre1) / 11, spandrel: 0.6, bayW: 6, pier: 0.45, inset: 0.3 }
  const zogG = (g: Grid): Grid => ({ ...g, inset: 0.22, bayW: 10 })
  const topG: Grid = { base: H.darkBand, group: H.crown - H.darkBand, spandrel: 0.6, bayW: 6, pier: 0.45, inset: 0.3 }
  const hotelG: Grid = { base: 10, group: 3 * 3.0, spandrel: 0.55, bayW: 6, pier: 0.45, inset: 0.4 }
  const annexG: Grid = { base: 8, group: 3 * 3.0, spandrel: 0.8, bayW: 6, pier: 0.6, inset: 0.5 }

  for (const P of prisms) {
    const r = P.ring
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length]
      const z0 = edgeBase(prisms, P, i)
      if (z0 >= P.z1 - 0.01) continue
      const L = Math.hypot(b[0] - a[0], b[1] - a[1])
      if (P.kind === 'tower') {
        const dx = Math.abs(b[0] - a[0]), riser = dx < 0.1 && L < 2, tread = Math.abs(L - TREAD) < 0.1
        const base = Math.max(z0, 0)
        wall(dark, a, b, base, Math.max(base, H.base))
        // Zog risers (the short return faces) are dark: they read as the
        // dark stripes down the corners in every photo.
        const body = riser ? dark : trim
        wall(body, a, b, Math.max(base, H.base), Math.max(base, H.louvre0))
        wall(roof, a, b, Math.max(base, H.louvre0), Math.max(base, H.louvre1))
        wall(body, a, b, Math.max(base, H.louvre1), H.crown)
        const tgt = riser ? glassDark : glassLight
        const gl = riser || tread ? zogG(lowG) : lowG, gm = riser || tread ? zogG(midG) : midG
        facePanels(tgt, a, b, Math.max(z0, H.base), H.louvre0, gl)
        facePanels(tgt, a, b, Math.max(z0, H.louvre1), H.darkBand, gm)
        facePanels(glassDark, a, b, Math.max(z0, H.darkBand), H.crown, riser || tread ? zogG(topG) : topG)
        continue
      }
      wall(P.wall, a, b, z0, P.z1)
      if (P.kind === 'hotel') {
        wall(dark, a, b, z0, Math.max(z0, Math.min(P.z1, 10)))
        facePanels(glassDark, a, b, Math.max(z0, 10), P.z1 - 1.2, hotelG)
        facePanels(glassDark, a, b, Math.max(z0, 1), Math.min(P.z1, 9.5), { ...hotelG, base: 1, group: 8.5 })
      } else if (P.kind === 'annex') {
        facePanels(glassDark, a, b, Math.max(z0, 1), P.z1 - 1.2, annexG)
      } else if (P.kind === 'retail' || P.kind === 'low') {
        facePanels(glassDark, a, b, Math.max(z0, 1), P.z1 - 1.2, { ...annexG, base: 1, group: P.z1 - 2.4 })
      }
    }
    capRing(P.roof, r, P.z1)
  }

  // Crown: the louvred band, 0.35 m proud, zogs carried through it.
  for (let i = 0; i < crownRing.length; i++) wall(dark, crownRing[i], crownRing[(i + 1) % crownRing.length], H.crown, H.roof)
  capRing(dark, crownRing, H.crown, false)
  // a low parapet lip and the roof inside it
  const lip = towerRing(-0.6)
  capRing(roof, lip, H.roof - 0.8)
  for (let i = 0; i < lip.length; i++) wall(dark, lip[(i + 1) % lip.length], lip[i], H.roof - 0.8, H.roof)
  // ring between crown top and lip top
  for (let i = 0; i < crownRing.length; i++) {
    const j = (i + 1) % crownRing.length
    const o0 = crownRing[i], o1 = crownRing[j], i0 = lip[i], i1 = lip[j]
    dark.quad([i0[0], i0[1], H.roof], [o0[0], o0[1], H.roof], [o1[0], o1[1], H.roof], [i1[0], i1[1], H.roof])
  }
  // Antennas: two masts on the long axis, a third in from each end.
  mast(dark, [C[0] - 11.5, C[1]], H.roof - 0.8, H.mast1, 0.55, 0.3)
  mast(dark, [C[0] + 11.5, C[1]], H.roof - 0.8, H.mast2, 0.55, 0.3)

  const replaces = ['way/1385236413', 'way/166748034', 'way/156909891', 'way/156909956', 'way/156909957', 'way/156909969']
  return finishGlb('msp-ids-center', 'IDS Center', [
    { part: trim, material: finish('ids-mullion', 0xcdd6de) },
    { part: glassLight, material: windowVariant(2, 0xa2bcd4) },
    { part: glassDark, material: PALETTE.window },
    { part: dark, material: finish('ids-crown', 0x55575b, 0.6) },
    { part: court, material: { ...PALETTE.glass, color: 0x9fc3d8 } },
    { part: roof, material: PALETTE.roof },
  ], { bearing: 30, height: H.mast1, replaces }, 6500)
}

if (import.meta.main) {
  const { glb, triangles } = build()
  const out = process.argv[2] ?? new URL('../models/msp-ids-center.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
}
