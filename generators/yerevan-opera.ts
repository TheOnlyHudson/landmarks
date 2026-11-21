/**
 * Armenian National Academic Theatre of Opera and Ballet (Alexander
 * Spendiaryan), Yerevan: procedural, CC0-1.0.
 *   bun generators/yerevan-opera.ts   (writes the low and the detail model)
 *
 * Alexander Tamanian's double theatre (opened 1933, finished 1953): two
 * halls back to back, the Spendiaryan opera hall facing Freedom Square
 * (north) and the Khachaturian concert hall facing the park (south), each
 * fronted by a great half-round drum, joined by square side wings and a
 * tall stage house between them. Identity, in order: the two round fronts,
 * each a lower drum of tall round-arched windows between pilasters under a
 * heavy dentil cornice and a terrace balustrade, with a set-back upper drum
 * above (an open loggia of paired columns on the north, paired engaged
 * columns before windows on the south); the tall stage house rising behind
 * with its heavy cornice; the plain square side wings; the grey stone.
 *
 * Frame: x east, y north (bearing 3.5), z up, metres. Origin: the area
 * centroid of the OSM outline, 44.5150857, 40.1860137.
 *
 * Evidence
 * - OSM (ODbL, OSM API 2026-11): relation/1267677 (building=theatre, 11
 *   levels, facade colour grey): the two half-round ends (radius 33 m,
 *   centred 19.7 m either side of the middle) and the side wings round two
 *   light courts; way/412870637 (building:part: the stage house, a bow-tie
 *   plan 47 x 35 m).
 * - Published: Wikipedia "Yerevan Opera Theatre": Tamanian; opened 20
 *   January 1933, the building finished 1953; two halls, the Spendiaryan
 *   opera and ballet hall (about 1,200 seats) and the Aram Khachaturian
 *   concert hall (about 1,400).
 * - Photos (Wikimedia Commons, evidence):
 *   o1 Diego Delso, CC BY-SA 4.0, "Ópera, Ereván, Armenia, 2016-10-03,
 *      DD 13.jpg": the north front square-on, far (panorama)
 *      https://commons.wikimedia.org/wiki/File:%C3%93pera,_Erev%C3%A1n,_Armenia,_2016-10-03,_DD_13.jpg
 *   o2 Vladimir Shioshvili, CC BY-SA 2.0, "Yerevan opera house new.jpg":
 *      the north front from low down
 *      https://commons.wikimedia.org/wiki/File:Yerevan_opera_house_new.jpg
 *   o3 Armenak Margarian, CC BY-SA 4.0, "Exterior of Opera house of Yerevan
 *      2019-05-16.jpg": the north front in sun
 *      https://commons.wikimedia.org/wiki/File:Exterior_of_Opera_house_of_Yerevan_2019-05-16.jpg
 *   o4 Matthias Süßen, CC BY-SA 4.0, "Jerewan-Oper-msu-wlm-2435.jpg": the
 *      north front square-on in sun
 *      https://commons.wikimedia.org/wiki/File:Jerewan-Oper-msu-wlm-2435.jpg
 *   o5 Antimion, CC BY-SA 3.0, "Yerevan Opera House from Cascade.jpg": from
 *      the Cascade (north) at night
 *      https://commons.wikimedia.org/wiki/File:Yerevan_Opera_House_from_Cascade.jpg
 *   o7 mcfarlandmo, CC BY 2.0, "Opera house of Yerevan.jpg": the south
 *      (Khachaturian) front close, with the Khachaturian statue
 *      https://commons.wikimedia.org/wiki/File:Opera_house_of_Yerevan.jpg
 *   o8 Marcin Konsek, CC BY-SA 4.0, "2014 Erywań, Ormiański Akademicki
 *      Teatr Opery i Baletu (01).jpg": the north front from the north-west,
 *      the west wing and the stage house
 *      https://commons.wikimedia.org/wiki/File:2014_Erywa%C5%84,_Ormia%C5%84ski_Akademicki_Teatr_Opery_i_Baletu_(01).jpg
 * - Look-only: none.
 *
 * Numbers
 * - Plan: OSM, measured (circle fits to the outline's ends).
 * - Heights estimated from o1 (far, square-on), correcting each feature
 *   for its depth behind the drum's front: the lower drum's cornice 20 m
 *   (taken as the reference: two tall storeys) and its terrace balustrade
 *   21.3; the side wings 19; the upper drum (radius 26) 1.6 times the
 *   wings, its cornice 32; the stage house's corner blocks 2.2 times the
 *   wings, 42 m (OSM's 11 levels agree), its middle 36. The north drum's
 *   seven wide bays 11.6 degrees (6.7 m) with arched windows 10.4-16.6 m,
 *   three narrower flank bays a side, doors 0.8-6.4 m (o1, o4).
 * - Colours: the stone sunlit #d3d4d0, #e4e4df, #ecebe9 (o4), #a4a3a5 in
 *   haze (o3): drawn a mid grey #a3a29b (lead review: sunlit about #9d9c95); doors oak brown (o4, o7).
 *
 * Doubts
 * - No height is published.
 * - The assignment called the stone pinkish-cream; every daylight photo
 *   shows grey stone (OSM also tags the facade grey), so it is grey.
 * - o5 shows the drums floodlit cyan at night; the model carries the
 *   standard warm floodlight and lit windows.
 * - The south drum is photographed only close (o7); its upper storey is
 *   drawn closed (engaged paired columns before windows), as o7 shows.
 * - The side wings' outer faces are only seen obliquely (o8): plain grey
 *   walls, a carved band and window panels.
 * - Terrain: Mapterhorn z12 shows the building as a 12 m bump; the
 *   square and park are flat, so the model is flat.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import {
  type XY, projector, toCCW, ringArea, clipRing, unionRings, rectRing, walls, capRing, band, faceOf, onFace, archOutline, facePanel,
  column, blockOnFace, ringPanels, save, wallLight, fquad, parapet, lathe, insidePoly, TAU,
} from './yerevan-government-house'

const ANCHOR: XY = [44.5150857, 40.1860137]
const BEARING = 3.5
const P = projector(ANCHOR[0], ANCHOR[1], BEARING)
void P

// plan (measured in the frame above from OSM)
const CN: XY = [0.5, 19.7], CS: XY = [0.5, -19.7], R = 33.0, RU = 26.0
const WING_E: XY[] = [[31.8, -25.1], [45.0, -25.2], [45.2, -10.3], [50.6, -5.6], [50.6, 4.4], [44.4, 9.7], [44.4, 24.1], [33.2, 24.0]]
const WING_W: XY[] = [[-32.9, -24.4], [-44.9, -24.5], [-45.0, -9.2], [-50.5, -4.0], [-50.5, 5.4], [-44.3, 10.8], [-44.4, 25.9], [-30.9, 26.0]]
const COURT_E: XY[] = [[31.6, 6.8], [31.6, -8.1], [43.4, -8.1], [47.0, -4.6], [46.9, 3.2], [42.7, 6.9]]
const COURT_W: XY[] = [[-31.6, -6.7], [-42.9, -6.7], [-46.4, -3.3], [-46.5, 4.5], [-42.3, 8.2], [-31.7, 8.2]]
const STAGE: XY[] = [[22.4, -16.9], [15.5, -17.0], [7.1, -10.4], [-11.3, -10.5], [-18.4, -15.9], [-24.7, -15.9], [-24.9, 18.1], [-17.5, 18.1], [-10.4, 12.6], [7.1, 12.7], [14.3, 17.3], [22.2, 17.3]]
const Z = { wing: 19.0, drum: 20.0, terrace: 21.3, upper: 32.0, stage: 42.0, stageMid: 36.0 }

const arcPts = (c: XY, r: number, a0: number, a1: number, n: number): XY[] => Array.from({ length: n + 1 }, (_, i) => { const t = a0 + ((a1 - a0) * i) / n; return [c[0] + r * Math.cos(t), c[1] + r * Math.sin(t)] as XY })

function build(detail: boolean) {
  const stone = new Part(), trim = new Part(), shade = new Part(), roof = new Part(), win = new Part(), door = new Part()
  const SEG = detail ? 10 : 6
  const NA = detail ? 48 : 28 // segments on a half drum

  // ── the stadium core: two half drums and the block between ──
  // the drum's wall runs through the bay boundaries so the bays' panels sit on it
  const bayEdges = (mid: number) => { const w = (11.6 * Math.PI) / 180, n = (8.5 * Math.PI) / 180, e: number[] = []; for (let i = -3; i <= 3; i++) e.push(mid - 3.5 * w - (3 - i >= 0 ? 0 : 0) + (i + 3) * w); const lo = mid - 3.5 * w, hi = mid + 3.5 * w; return [lo - 3 * n, lo - 2 * n, lo - n, ...e, hi, hi + n, hi + 2 * n, hi + 3 * n] }
  const halfArc = (c: XY, a0: number, a1: number, mid: number): XY[] => {
    const edges = bayEdges(mid), out: number[] = []
    const lo = edges[0], hi = edges[edges.length - 1]
    const m0 = Math.max(1, Math.round((lo - a0) / (TAU / NA / 1))), m1 = Math.max(1, Math.round((a1 - hi) / (TAU / NA)))
    for (let i = 0; i < m0; i++) out.push(a0 + ((lo - a0) * i) / m0)
    out.push(...edges)
    for (let i = 1; i <= m1; i++) out.push(hi + ((a1 - hi) * i) / m1)
    return out.map((t) => [c[0] + R * Math.cos(t), c[1] + R * Math.sin(t)] as XY)
  }
  const core: XY[] = [...halfArc(CS, Math.PI, TAU, -Math.PI / 2 + TAU), ...halfArc(CN, 0, Math.PI, Math.PI / 2)]
  const coreRing = toCCW(core)
  // the wings, each with its light court
  for (const [w, c] of [[WING_E, COURT_E], [WING_W, COURT_W]] as Array<[XY[], XY[]]>) {
    const outerOnly = clipRing(w, coreRing, true).filter((r) => Math.abs(ringArea(r)) > 5)
    for (const r of outerOnly) {
      walls(stone, r, 0, Z.wing, (a, b) => onCore([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]))
    }
    walls(stone, [...c].reverse(), 0, Z.wing)
    band(trim, w, Z.wing - 0.8, 0.8, 0.5)
    band(trim, w, 13.6, 0.9, 0.12) // the carved ornament band of the wings
    const roofRing = toCCW(w)
    capRing(roof, roofRing, Z.wing - 0.2, true, [toCCW(c).slice().reverse()])
    ringPanels(win, w, [{ z0: 2.0, z1: 6.4 }, { z0: 8.0, z1: 12.4 }], { bay: 4.6, w: 2.2, minLen: 8, hidden: [coreRing], seg: 3, frame: detail ? trim : undefined })
  }
  // the core's walls up to the drum cornice (the parts outside the wings show)
  const wingsU = unionRings([WING_E, WING_W])
  walls(stone, coreRing, 0, Z.drum, (a, b) => wingsU.some((wr) => insidePoly([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], wr)))
  // the dentil cornice and the terrace balustrade on the drums
  band(trim, coreRing, Z.drum - 1.2, 1.2, 0.7)
  capRing(shade, coreRing, Z.drum)
  // balustrade: a solid low wall (low), rails and balusters (detail)
  for (const [c, a0, a1] of [[CN, 0.17, Math.PI - 0.17], [CS, Math.PI + 0.17, TAU - 0.17]] as Array<[XY, number, number]>) {
    const pts = arcPts(c, R - 0.3, a0, a1, NA / 2)
    for (let k = 0; k < pts.length - 1; k++) {
      const f = faceOf(pts[k], pts[k + 1])
      // these faces run counter-clockwise: n points out
      if (!detail) blockOnFace(trim, f, 0, f.L, Z.drum, Z.terrace, 0.15, -0.35)
      else {
        blockOnFace(trim, f, 0, f.L, Z.drum, Z.drum + 0.2, 0.15, -0.35)
        blockOnFace(trim, f, 0, f.L, Z.terrace - 0.18, Z.terrace, 0.18, -0.38)
        const nb = Math.max(1, Math.round(f.L / 0.4))
        for (let q = 0; q < nb; q++) { const p = onFace(f, (q + 0.5) * f.L / nb, -0.1, 0); lathe(trim, [[0.1, Z.drum + 0.2], [0.13, Z.drum + 0.4], [0.07, Z.drum + 0.75], [0.1, Z.terrace - 0.18]], 6, [p[0], p[1]]) }
      }
    }
  }

  // the lower drums' bays: pilasters, arched windows (north) or two rows of square windows (south), doors
  const lowerBays = (c: XY, mid: number, north: boolean) => {
    // seven wide bays across the front, three narrower ones down each flank
    const wide = (11.6 * Math.PI) / 180, narrow = (8.5 * Math.PI) / 180
    const spans: Array<[number, number, boolean]> = []
    let t = mid - 3.5 * wide
    for (let i = 0; i < 3; i++) { spans.unshift([t - narrow, t, false]); t -= narrow }
    t = mid - 3.5 * wide
    for (let i = 0; i < 7; i++) { spans.push([t, t + wide, true]); t += wide }
    for (let i = 0; i < 3; i++) { spans.push([t, t + narrow, false]); t += narrow }
    spans.forEach(([a0, a1, big], i) => {
      const pa: XY = [c[0] + R * Math.cos(a0), c[1] + R * Math.sin(a0)], pb: XY = [c[0] + R * Math.cos(a1), c[1] + R * Math.sin(a1)]
      const f = faceOf(pa, pb)
      for (const s of i === spans.length - 1 ? [0, f.L] : [0]) blockOnFace(trim, f, s - 0.6, s + 0.6, 0.4, Z.drum - 1.2, 0.4, -0.1)
      const m = f.L / 2
      if (big && north) {
        facePanel(win, f, archOutline(m - 1.65, m + 1.65, 10.4, 15.0, SEG), 0.05)
        facePanel(trim, f, ringBand(m, 1.65, 2.2, 15.0, SEG), 0.14)
      } else {
        facePanel(win, f, rectRing(m - (big ? 1.7 : 1.1), 10.4, m + (big ? 1.7 : 1.1), 15.6), 0.05)
        if (detail) windowSurround(trim, f, m, big ? 1.7 : 1.1, 10.4, 15.6)
      }
      facePanel(door, f, rectRing(m - (big ? 1.3 : 0.9), 0.8, m + (big ? 1.3 : 0.9), 6.4), 0.05)
      if (detail) windowSurround(trim, f, m, big ? 1.3 : 0.9, 0.8, 6.4)
      blockOnFace(trim, f, 0.6, f.L - 0.6, 8.6, 9.1, 0.15, -0.05) // the band between storeys
    })
  }
  lowerBays(CN, Math.PI / 2, true)
  lowerBays(CS, -Math.PI / 2, false)

  // ── the upper drums ──
  for (const north of [true, false]) {
    const c = north ? CN : CS
    const a0 = north ? 0.12 : Math.PI + 0.12, a1 = north ? Math.PI - 0.12 : TAU - 0.12
    // the upper drum's ring: the arc closed across behind (inside the stage house)
    const arc = arcPts(c, RU, a0, a1, NA / 2)
    const DL = north ? 3.2 : 0 // the north loggia's depth
    const inner = arcPts(c, RU - DL, a0, a1, NA / 2)
    const close = (pts: XY[]) => toCCW(pts)
    const z0 = Z.drum, zc = Z.upper - 2.2 // the columns' top / the entablature's foot
    if (north) {
      // the loggia: back wall in shade, floor and ceiling, then the entablature drum
      walls(shade, close(inner), z0, zc, (a, b) => !arcEdge(a, b, c, RU - DL))
      walls(stone, close(inner), z0, zc, (a, b) => arcEdge(a, b, c, RU - DL))
      for (let k = 0; k < arc.length - 1; k++) {
        fquad(shade, [arc[k][0], arc[k][1], zc], [inner[k][0], inner[k][1], zc], [inner[k + 1][0], inner[k + 1][1], zc], [arc[k + 1][0], arc[k + 1][1], zc], [0, 0, -1])
        const fb = faceOf(inner[k], inner[k + 1])
        facePanel(win, fb, rectRing(0.35, z0 + 1.0, fb.L - 0.35, zc - 1.2), 0.04)
      }
      // paired columns on the drum's edge
      const npair = detail ? 16 : 14
      for (let i = 0; i <= npair; i++) {
        const t = a0 + 0.05 + ((a1 - a0 - 0.1) * i) / npair
        for (const d of [-0.035, 0.035]) {
          const p: XY = [c[0] + (RU - 0.6) * Math.cos(t + d), c[1] + (RU - 0.6) * Math.sin(t + d)]
          column(trim, p, 0.55, z0, zc, detail ? 12 : 6, detail ? 0.7 : 0.5, detail ? 0.4 : 0)
        }
      }
      // a low balustrade between the pairs
      for (let k = 0; k < arc.length - 1; k++) {
        const f = faceOf(arc[k], arc[k + 1])
        blockOnFace(trim, f, 0, f.L, z0, z0 + 1.0, -0.2, -0.6)
      }
    } else {
      walls(stone, close(arc), z0, zc)
      // paired engaged columns before windows
      const npair = 14
      for (let i = 0; i <= npair; i++) {
        const t = a0 + 0.05 + ((a1 - a0 - 0.1) * i) / npair
        for (const d of [-0.035, 0.035]) {
          const p: XY = [c[0] + (RU + 0.25) * Math.cos(t + d), c[1] + (RU + 0.25) * Math.sin(t + d)]
          column(trim, p, 0.42, z0, zc, detail ? 12 : 6, detail ? 0.55 : 0.4, 0)
        }
        if (i < npair) {
          const tm = t + ((a1 - a0 - 0.1) / npair) / 2, half = ((a1 - a0 - 0.1) / npair) * 0.3
          const f = faceOf([c[0] + RU * Math.cos(tm - half), c[1] + RU * Math.sin(tm - half)], [c[0] + RU * Math.cos(tm + half), c[1] + RU * Math.sin(tm + half)])
          facePanel(win, f, rectRing(0, z0 + 3.4, f.L, z0 + 7.2), 0.05)
        }
      }
    }
    // the entablature and its cornice, the roof
    const full = close(arc)
    walls(stone, full, zc, Z.upper)
    band(trim, full, Z.upper - 0.8, 0.8, 0.7)
    capRing(roof, full, Z.upper)
  }

  // ── the stage house: the corner blocks (the bow-tie's wide ends) rise above its middle ──
  {
    const r = toCCW(STAGE)
    const mid = clipRing(r, rectRing(-11.0, -40, 7.0, 40))
    const ends = clipRing(r, rectRing(-11.0, -40, 7.0, 40), true)
    for (const q of mid) {
      walls(stone, q, Z.drum, Z.stageMid - 1.2)
      band(trim, q, Z.stageMid - 1.2, 1.2, 0.6)
      capRing(roof, q, Z.stageMid)
    }
    for (const q of ends) {
      walls(stone, q, Z.drum, Z.stage - 1.6)
      band(trim, q, Z.stage - 1.6, 1.6, 0.9)
      capRing(roof, q, Z.stage)
      ringPanels(win, q, [{ z0: 35.0, z1: 38.6 }], { bay: 3.4, w: 1.5, minLen: 6, seg: 3 })
      if (detail) band(trim, q, 33.8, 0.5, 0.25)
    }
  }
  return { stone, trim, shade, roof, win, door }
}

const onCore = (m: XY) => Math.abs(Math.hypot(m[0] - CN[0], m[1] - CN[1]) - R) < 0.5 || Math.abs(Math.hypot(m[0] - CS[0], m[1] - CS[1]) - R) < 0.5 || (Math.abs(m[0]) < R + 0.5 && Math.abs(m[1]) < CN[1] + 0.1)
const arcEdge = (a: XY, b: XY, c: XY, r: number) => Math.abs(Math.hypot(a[0] - c[0], a[1] - c[1]) - r) < 0.05 && Math.abs(Math.hypot(b[0] - c[0], b[1] - c[1]) - r) < 0.05
/** An arch-shaped band on a face: between radii r0 and r1 round centre s, springing zs. */
function ringBand(s: number, r0: number, r1: number, zs: number, seg: number): XY[] {
  const out: XY[] = []
  for (let i = 0; i <= seg; i++) { const t = (Math.PI * i) / seg; out.push([s + r1 * Math.cos(t), zs + r1 * Math.sin(t)]) }
  for (let i = seg; i >= 0; i--) { const t = (Math.PI * i) / seg; out.push([s + r0 * Math.cos(t), zs + r0 * Math.sin(t)]) }
  return out
}
/** A flat stone surround round a rectangular opening. */
function windowSurround(p: Part, f: ReturnType<typeof faceOf>, s: number, h: number, z0: number, z1: number) {
  const t = 0.3
  blockOnFace(p, f, s - h - t, s - h, z0, z1, 0.12, -0.05)
  blockOnFace(p, f, s + h, s + h + t, z0, z1, 0.12, -0.05)
  blockOnFace(p, f, s - h - t, s + h + t, z1, z1 + t, 0.12, -0.05)
  blockOnFace(p, f, s - h - t, s + h + t, z0 - t, z0, 0.16, -0.05)
}

if (import.meta.main) {
  const make = (detail: boolean) => {
    const p = build(detail)
    return [
      { part: p.stone, material: { ...finish('yerevan-opera-stone', 0xa3a29b), floodlight: wallLight(0.85) } },
      { part: p.trim, material: { ...finish('opera-stone-trim', 0xb6b5ae), floodlight: wallLight(0.9) } },
      { part: p.shade, material: { ...finish('opera-stone-shade', 0x6f706c) } },
      { part: p.roof, material: PALETTE.roof },
      { part: p.win, material: PALETTE.window },
      { part: p.door, material: { name: 'entrance', color: 0x9a6a48, roughness: 0.7 } },
    ]
  }
  const meta = { osm: 'relation/1267677', bearing: BEARING, height: Z.stage }
  await save('yerevan-opera.glb', 'Armenian National Opera and Ballet Theatre', make(false), meta, 6500, 250 * 1024)
  await save('yerevan-opera.detail.glb', 'Armenian National Opera and Ballet Theatre', make(true), meta, 40000, 1536 * 1024)
}
