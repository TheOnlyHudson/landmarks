/**
 * Century Post Office (Federal Building and U.S. Courthouse, Century
 * Station), Raleigh (1874–78, Alfred B. Mullett, Supervising Architect;
 * extended 1912–13 and 1938 in matching granite): procedural, CC0-1.0.
 * bun generators/ral-federal-building.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 3 (the OSM
 * walls run at 3°/93°). Origin: the area centroid of OSM way/47732371
 * (-78.639773, 35.776688). y = 0 is the lowest ground under the footprint;
 * Mapterhorn (z13) rises about 1.4 m from the south-west corner to
 * Fayetteville Street. Elevation 0.
 *
 * OSM: way/47732371 ("Federal Building", building:levels 4) is a plain
 * 48.2 × 35.8 m rectangle, the only building under the model. Its east
 * side, 35.8 m, is the Fayetteville Street front; the 48.2 m north side
 * is on Martin Street (p5, p6 are taken from that corner).
 * USGS NAIP (public domain, 0.20 m/px): a flat pale roof inside the
 * mansard, two brown roof lights in the middle.
 *
 * No lidar covers Wake County. Heights are estimated from p2 and p6 (the
 * 48.2 m Martin Street face scaled to OSM, ≈11 px/m) and p4 (a bay close
 * up): a granite plinth to 1.4 m, three storeys with string courses at 7
 * and 12.2 m, the bracketed cornice at 15.8–17.2 m, the slate mansard to
 * 22.6 m. Bays: 9 on Fayetteville Street, 13 on Martin Street (p1, p6),
 * each with a dormer over it (p4, p6); four columns in antis at the
 * central entrance (p1, p5). Quoined corners (p4).
 *
 * Photos (evidence; local copies in landmarks-scratch/ral/work/
 * ral-federal-building/p2):
 *  p1 "Federal-Building-Raleigh-20080321.jpeg", Jmturner, public domain,
 *     https://commons.wikimedia.org/wiki/File:Federal-Building-Raleigh-20080321.jpeg:
 *     the Fayetteville Street front from the north-east.
 *  p2 "Federal Building - Raleigh, NC - DSC06095.JPG", Daderot, public
 *     domain, https://commons.wikimedia.org/wiki/File:Federal_Building_-_Raleigh,_NC_-_DSC06095.JPG
 *  p3 "Old Federal Building, Raleigh, NC (27224609457).jpg", Warren
 *     LeMay, CC0, https://commons.wikimedia.org/wiki/File:Old_Federal_Building,_Raleigh,_NC_(27224609457).jpg
 *  p4 "Corner of building, Century Station Federal Building and Postal
 *     Station…", Carol M. Highsmith, public domain (Library of Congress),
 *     https://commons.wikimedia.org/wiki/File:Corner_of_building,_Century_Station_Federal_Building_and_Postal_Station_located_in_Raleigh,_North_Carolina_LCCN2013634048.tif
 *  p5, p6 "Century Station Federal Building and Postal Station located in
 *     Raleigh, North Carolina" (two views from Fayetteville and Martin),
 *     Carol M. Highsmith, public domain (Commons).
 *  p7 "Century Station Federal Building and Postal Station…" (a side
 *     entrance with pediment), Carol M. Highsmith, public domain.
 * Aerial: USGS NAIP (public domain).
 *
 * Colours: pale grey granite (p4), blue-grey slate (p4), white dormers.
 * Estimated: every height. Left out: brackets, dentils, window surrounds
 * and pediments, the slate's fish-scale bands, the lettering.
 * Doubts: the west (back) face and the later additions' joints are not
 * photographed; the entrance is drawn centred on the Fayetteville front,
 * which the oblique photos suggest but do not show square on.
 * Night: windows glow; the granite is unlit.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type Face, prism, capRing, finishGlb, writeModel, rect, lathe } from './sea-tacoma-union-station'
import { box, panel, quadO, triO } from './nash-tennessee-state-capitol'

const HX = 24.1, HY = 17.9
const PLINTH = 1.4, CORN0 = 15.8, CORN = 17.2, MTOP = 22.6, INSET = 2.2

function build() {
  const gran = new Part(), trim = new Part(), slate = new Part(), win = new Part(), roof = new Part(), ent = new Part()

  // ------------------------------------------------------------ the block
  prism(gran, null, rect(-HX, -HY, HX, HY), 0, CORN0)
  capRing(gran, rect(-HX, -HY, HX, HY), 0, false)
  // plinth, string courses, cornice
  box(gran, -HX - 0.25, -HY - 0.25, HX + 0.25, HY + 0.25, 0, PLINTH, null, 0.1)
  for (const z of [6.6, 11.8]) box(trim, -HX - 0.18, -HY - 0.18, HX + 0.18, HY + 0.18, z, z + 0.4, null)
  box(trim, -HX - 0.3, -HY - 0.3, HX + 0.3, HY + 0.3, CORN0, CORN0 + 0.6, null)
  box(trim, -HX - 0.85, -HY - 0.85, HX + 0.85, HY + 0.85, CORN0 + 0.6, CORN, trim, 0.25)

  // ------------------------------------------------------------ the mansard (p4)
  {
    const o = rect(-HX - 0.1, -HY - 0.1, HX + 0.1, HY + 0.1), i = rect(-HX + INSET, -HY + INSET, HX - INSET, HY - INSET)
    const outs: V3[] = [[0, -1, 0.35], [1, 0, 0.35], [0, 1, 0.35], [-1, 0, 0.35]]
    for (let k = 0; k < 4; k++) {
      const a = o[k], b = o[(k + 1) % 4], c = i[(k + 1) % 4], d = i[k]
      quadO(slate, [a[0], a[1], CORN], [b[0], b[1], CORN], [c[0], c[1], MTOP], [d[0], d[1], MTOP], outs[k])
    }
    capRing(roof, i, MTOP, true)
    // the curb at the top of the slope
    box(trim, -HX + INSET - 0.15, -HY + INSET - 0.15, HX - INSET + 0.15, HY - INSET + 0.15, MTOP - 0.05, MTOP + 0.35, roof)
    // the two roof lights (NAIP)
    for (const [x0, x1] of [[-6, -1], [10, 17]]) box(roof, x0, -5, x1, 7, MTOP + 0.3, MTOP + 0.8)
  }

  // ------------------------------------------------------------ the faces: windows, quoins, dormers
  const faces: { f: Face; L: number; bays: number; front?: boolean }[] = [
    { f: { o: [HX, -HY, 0], n: [1, 0] }, L: 2 * HY, bays: 9, front: true }, // Fayetteville Street
    { f: { o: [-HX, -HY, 0], n: [0, -1] }, L: 2 * HX, bays: 13 }, // Davie Street side
    { f: { o: [-HX, HY, 0], n: [-1, 0] }, L: 2 * HY, bays: 9 },
    { f: { o: [HX, HY, 0], n: [0, 1] }, L: 2 * HX, bays: 13 }, // Martin Street
  ]
  const slopeRun = INSET + 0.1, slopeRise = MTOP - CORN
  for (const { f, L, bays, front } of faces) {
    const step = (L - 4) / bays
    for (let k = 0; k < bays; k++) {
      const s = 2 + step * (k + 0.5)
      const isDoor = front && Math.abs(s - L / 2) < step * 1.6
      if (!isDoor) panel(win, f, s, 1.5, 2.3, 5.8, 0.06)
      panel(win, f, s, 1.5, 7.7, 11.2, 0.06)
      panel(win, f, s, 1.5, 12.8, 15.3, 0.06)
      panel(win, f, s, 0.9, 0.35, 1.05, 0.28) // basement lights in the plinth
      // a dormer over each bay, standing on the slope (p4)
      const d0 = 0.5, z0 = CORN + 0.15, z1 = CORN + 3.9, w = 2.3
      const back = slopeRun * ((z1 - CORN) / slopeRise) // where its top meets the slope
      const P = (ss: number, z: number, dd: number): V3 => {
        const t: [number, number] = [-f.n[1], f.n[0]]
        return [f.o[0] + t[0] * ss + f.n[0] * dd, f.o[1] + t[1] * ss + f.n[1] * dd, z]
      }
      const out: V3 = [f.n[0], f.n[1], 0]
      quadO(trim, P(s - w / 2, z0, d0), P(s + w / 2, z0, d0), P(s + w / 2, z1, d0), P(s - w / 2, z1, d0), out)
      for (const e of [-1, 1]) quadO(trim, P(s + (e * w) / 2, z0, d0), P(s + (e * w) / 2, z0, -back), P(s + (e * w) / 2, z1, -back), P(s + (e * w) / 2, z1, d0), [e * -f.n[1], e * f.n[0], 0])
      // its flat cornice cap, dark as in p4
      box(slate, Math.min(P(s - w / 2 - 0.2, 0, d0 + 0.25)[0], P(s + w / 2 + 0.2, 0, -back)[0]), Math.min(P(s - w / 2 - 0.2, 0, d0 + 0.25)[1], P(s + w / 2 + 0.2, 0, -back)[1]),
        Math.max(P(s - w / 2 - 0.2, 0, d0 + 0.25)[0], P(s + w / 2 + 0.2, 0, -back)[0]), Math.max(P(s - w / 2 - 0.2, 0, d0 + 0.25)[1], P(s + w / 2 + 0.2, 0, -back)[1]), z1, z1 + 0.4)
      panel(win, { o: P(0, 0, d0), n: f.n }, s, 1.3, z0 + 0.5, z1 - 0.6, 0.04)
    }
    // quoins: raised blocks up each corner (p4)
    for (let j = 0, z = PLINTH; z < CORN0 - 0.6; j++, z += 1.2) {
      const w = j % 2 ? 1.0 : 1.6
      for (const s of [0.05 + w / 2, L - 0.05 - w / 2]) panel(gran, f, s, w, z, z + 0.95, 0.12)
    }
  }

  // ------------------------------------------------------------ the Fayetteville Street entrance (p1, p5): four columns in antis
  {
    const f = faces[0].f, L = faces[0].L
    const cx = HX, mid = -HY + L / 2
    // a shallow recess: the doors and transom at the back
    panel(ent, f, L / 2, 7.6, PLINTH, 5.0, 0.04)
    panel(win, f, L / 2, 7.6, 5.0, 6.2, 0.05)
    // antae and the band over them
    for (const e of [-1, 1]) box(gran, cx, mid + e * 4.6 - 0.6, cx + 1.4, mid + e * 4.6 + 0.6, PLINTH, 6.6)
    box(trim, cx, mid - 5.3, cx + 1.5, mid + 5.3, 5.6, 6.6, trim)
    for (const k of [-1.5, -0.5, 0.5, 1.5]) lathe(trim, cx + 0.9, mid + k * 2.1, [[0.38, PLINTH], [0.33, 5.6]], 10)
    // steps
    box(gran, cx, mid - 4.4, cx + 2.4, mid + 4.4, 0, PLINTH - 0.4, gran)
  }
  void triO

  return finishGlb('Century Post Office', [
    { part: gran, material: finish('cpo-granite', 0xe2ddd5) },
    { part: trim, material: finish('cpo-trim', 0xf3efe8) },
    { part: slate, material: finish('cpo-slate', 0x6f7782) },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: ent, material: PALETTE.entrance },
  ], { bearing: 3, height: MTOP + 1.1, replaces: ['way/47732371'] }, 6500)
}

if (import.meta.main) await writeModel('ral-federal-building', build())
