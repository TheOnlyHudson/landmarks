/**
 * Royal Opera House Muscat (2007-2011; WATG with Oman's Diwan): procedural,
 * CC0-1.0.  bun generators/muscat-royal-opera-house.ts
 *
 * Uses the shared kit exported by muscat-sultan-qaboos-grand-mosque.ts.
 *
 * Frame: built in a frame turned to bearing 62.5, the main block's edge
 * directions in OSM (62-63 and 152-153 degrees): model +y runs east-north-
 * east, +x south-south-east. The anchor is the centroid of OSM way/137570071
 * (58.4680019, 23.6142079), at (-19.1, -58.8) in the authoring frame.
 *
 * Plan (OSM way/137570071, measured in the turned frame): the main block
 * x -78..67, y -57..42; the projecting grand portico on its +x side
 * (x 52-67, y -23..2, 25 m: the five-arch front of o01, o14); the entrance
 * pavilion with three arches on the plaza side (x 22.6-36.6, y -57.5..-46,
 * c03, o08); a 23 m wide range down the plaza's west edge (x -13..10.6) and
 * the long arcaded wing (x -60..-26, y -246..-115; o08 left) with the thin
 * ranges joining them. The outline's courtyards are left open.
 *
 * Heights: no published figures were found; all photo-scaled (people in
 * c03 and o08: 1.7 m): the base tier and wings 10.5-11 m with Omani rounded
 * merlons; the entrance pavilion 13 m, the portico 17 m with its towers 21;
 * the middle tier 20 m with four corner towers to 25 m and slit windows
 * (o12, c03); the auditorium block 31 m with a row of pointed arched
 * windows under its cornice (c00, c03, o12: 11-13 arches a face), and the
 * fly tower 36 m and the opposite raised box 34 m (c00). Lead review
 * round 1: every arcade (plaza ground arcade at ~4.8 m bays, portico,
 * entrance pavilion, the auditorium's top loggia) is a deep recess, 2-4.5 m,
 * dark inside (shade #8a8379); merlons bolder (1.4 m, 1.9 m in the low
 * model) and the corner towers raised to 26.5 m. Which end the stage
 * is at is a guess from c00.
 *
 * Colour: limestone #f0e9dc (o12 sunlit #dbd0c9, c03 #a8a38c in haze: a
 * warm white); shade #8a8379 in arcades and loggias; windows the palette's
 * slate (the real ones are dark wooden screens); doors wood #8a5a3c.
 * Night: the facade is floodlit warm (o00), arcades glow; _FLOODLIGHT on
 * the stone, the loggias' backs are `entrance`-lit through the door
 * material only.
 *
 * Photos (EVIDENCE):
 * - c00 "03 Maskat Operna hiša (1)", Ljuba brank, CC BY-SA 4.0, https://commons.wikimedia.org/wiki/File:03_Maskat_Operna_hi%C5%A1a_(1).jpg (from the road, the tiers)
 * - c01 "03 Maskat Operna hiša (6)", Ljuba brank, CC BY-SA 4.0, Commons
 * - c03 "Opera house Muscat", Arsalaan Ahmad, CC BY-SA 4.0, https://commons.wikimedia.org/wiki/File:Opera_house_Muscat.jpg (plaza front)
 * - c11 "Royal Opera House Muscat - Outside View II", Taha Al-Hayali, CC BY-SA 4.0, Commons (entrance pavilion)
 * - o01 "Royal Opera House, Oman", prasad.om, CC BY 2.0, https://www.flickr.com/photos/43810986@N03/9840485503 (portico)
 * - o08, o12, o13, o14 "Royal Opera House Muscat, Oman", dconvertini, CC BY-SA 2.0, https://www.flickr.com/photos/42477684@N08/54522672887, .../54523737439, .../54523737464, .../54523795518 (plaza, tiers, portico)
 * - o00 "An Evening at the Opera", andryn2006, CC BY-SA 2.0, https://www.flickr.com/photos/84985982@N00/17299497068 (night)
 * Look-only: none.
 *
 * Doubts: no aerial or published heights; the roof tiers' extents are
 * inferred from oblique photos and placed symmetrically on the auditorium;
 * the far (north-west) sides are unphotographed and drawn like the others;
 * the long south wing is in the opera's OSM outline but only its plaza
 * face is photographed (o08).
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import {
  box, boxFaces, bays, merlons, panel, plane, at, nrm, setShift, wallBand, quad,
  type Plane, type P2, type Opening,
} from './muscat-sultan-qaboos-grand-mosque'

type Mats = { stone: Part; shade: Part; win: Part; door: Part }
type Style = 'arc' | 'win' | 'top' | 'plain' | 'portico' | 'pav' | 'none'

function faceStyle(M: Mats, D: boolean, pl: Plane, L: number, z0: number, H: number, st: Style) {
  const seg = D ? 4 : 3
  if (st === 'none') return
  if (st === 'arc') {
    // ground loggia of pointed arches, small windows above (o08, c03)
    // (lead review round 1: bigger, more numerous, deep and dark)
    const n = Math.max(1, Math.round(L / (D ? 4.8 : 8.5)))
    wallBand(M.stone, M.shade, pl, 0, L, z0, z0 + 8.5, bays(0, L, n, (c, w) => ({ c, hw: Math.min(w / 2 - (D ? 0.6 : 0.9), D ? 1.75 : 2.4), zb: z0, crown: z0 + 7.6, depth: 3.5, back: M.shade })), seg)
    if (H > z0 + 8.5) wallBand(M.stone, M.shade, pl, 0, L, z0 + 8.5, H, [], seg)
  } else if (st === 'win' || st === 'plain') {
    const n = st === 'plain' ? 0 : Math.max(0, Math.round(L / (D ? 6 : 22)))
    if (D && n) wallBand(M.stone, M.shade, pl, 0, L, z0, H, bays(0, L, n, (c) => ({ c, hw: 0.8, zb: z0 + 2.6, crown: z0 + Math.min(H - z0 - 2.2, 6.6), depth: 0.5, back: M.win })), seg)
    else {
      wallBand(M.stone, M.shade, pl, 0, L, z0, H, [], seg)
      if (n) for (const o of bays(0, L, n, (c) => ({ c, hw: 1, zb: 0, crown: 0, depth: 0 }))) panel(M.win, pl, o.c, z0 + 2.6, 1.8, Math.min(H - z0 - 4.8, 4.2), 'pointed', 2)
    }
  } else if (st === 'top') {
    // the auditorium's arcaded loggia under the cornice (o12, c03): deep arched openings, dark inside
    const n = Math.max(1, Math.round(L / (D ? 4.4 : 7)))
    wallBand(M.stone, M.shade, pl, 0, L, z0, z0 + 3, [], seg)
    wallBand(M.stone, M.shade, pl, 0, L, z0 + 3, H, bays(0, L, n, () => 0 as never).map((_, i) => ({ c: (L / n) * (i + 0.5), hw: D ? 1.45 : 1.6, zb: z0 + 3.6, crown: z0 + 9.6, depth: D ? 3.0 : 2.0, back: M.shade })), D ? 6 : 3)
  } else if (st === 'portico') {
    // five tall pointed arches into a deep loggia, doors at the back (o01, o14)
    wallBand(M.stone, M.shade, pl, 0, L, z0, H, bays(0, L, 5, (c, w) => ({ c, hw: w / 2 - 0.6, zb: z0, crown: z0 + 11.8, depth: 4.5, back: M.shade, door: { part: M.door, h: 4.2 } })), seg)
  } else if (st === 'pav') {
    // the entrance pavilion: a taller middle arch between two (c03, c11)
    const w = L / 3
    wallBand(M.stone, M.shade, pl, 0, L, z0, H, [0, 1, 2].map((i) => ({ c: w * (i + 0.5), hw: i === 1 ? 2.0 : 1.5, zb: z0, crown: z0 + (i === 1 ? 8.6 : 6.8), depth: 2.4, back: M.shade, door: { part: M.door, h: 3.4 } })), seg)
  }
}

/** A block: four faces in the given styles (S, E, N, W in the turned frame), a flat top, rounded merlons. */
function block(M: Mats, D: boolean, x0: number, x1: number, y0: number, y1: number, z0: number, H: number, st: Style[], crest = true) {
  box(null, M.stone, x0, x1, y0, y1, z0, H)
  boxFaces(x0, x1, y0, y1).forEach(([pl, L], i) => {
    faceStyle(M, D, pl, L, z0, H, st[i])
    if (crest && st[i] !== 'none') merlons(M.stone, pl, 0, L, H, D ? 1.4 : 1.9, D ? 1.1 : 1.8, D ? 2.8 : 6.2, 0.5, D, D)
  })
}

function build(D: boolean): Mats {
  setShift(-19.1, -58.8)
  const M: Mats = { stone: new Part(), shade: new Part(), win: new Part(), door: new Part() }
  const B = (x0: number, x1: number, y0: number, y1: number, z0: number, H: number, st: Style[], crest = true) => block(M, D, x0, x1, y0, y1, z0, H, st, crest)
  // base tier of the main block
  B(-66, 52, -46, 28, 0, 10.5, ['arc', 'win', 'win', 'win'])
  B(-78, -66, -23.5, 12.6, 0, 9, ['win', 'none', 'win', 'win'])
  B(-68, -35.6, 28, 41.5, 0, 9.5, ['none', 'win', 'win', 'win'])
  B(-35.6, -12.5, 28, 35.6, 0, 9.5, ['none', 'win', 'win', 'none'])
  B(22.5, 36.1, 28, 36.5, 0, 9.5, ['none', 'win', 'win', 'win'])
  B(52, 58, 1.9, 28.7, 0, 9.5, ['none', 'win', 'win', 'none'])
  B(52, 60, -44.6, -23.2, 0, 9.5, ['arc', 'win', 'none', 'none'])
  // the grand portico and its towers
  // (o14: five arches across the whole 25 m projection, a plain parapet; towers with slits behind it)
  B(52, 67, -23.2, 1.9, 0, 16.5, ['win', 'portico', 'win', 'none'], false)
  for (const [y0, y1] of [[-32, -24.2], [2.9, 10.7]]) B(45, 53, y0, y1, 10.5, 21, ['plain', 'plain', 'plain', 'plain'])
  // the entrance pavilion on the plaza
  B(22.6, 36.6, -57.5, -46, 0, 13, ['pav', 'win', 'none', 'win'])
  // ranges to the south-west and the long wing
  B(-63.3, -29, -56, -46, 0, 9, ['arc', 'win', 'none', 'win'])
  B(-13, 10.6, -115.5, -46, 0, 10.5, ['win', 'arc', 'none', 'win'])
  B(-69.6, -62.6, -117, -72, 0, 9, ['win', 'win', 'win', 'win'])
  B(-62.6, -12.5, -82, -72, 0, 9, ['win', 'none', 'win', 'none'])
  B(-60.5, -26, -237, -115, 0, 11, ['win', 'arc', 'win', 'win'])
  B(-43, -32, -246, -237, 0, 8, ['win', 'win', 'none', 'win'])
  // middle tier, corner towers
  B(-50, 45, -38, 24, 10.5, 20, ['win', 'win', 'win', 'win'])
  for (const [x, y] of [[-50, -38], [37, -38], [-50, 16], [37, 16]] as P2[]) {
    box(null, M.stone, x, x + 8, y, y + 8, 20, 26.5)
    boxFaces(x, x + 8, y, y + 8).forEach(([pl, L]) => {
      wallBand(M.stone, M.shade, pl, 0, L, 20, 26.5, [], 2)
      if (D) for (const s of [2.8, 4, 5.2]) panel(M.win, pl, s, 21.2, 0.45, 2.4, 'flat')
      else panel(M.win, pl, L / 2, 21.2, 2.0, 2.4, 'flat')
      merlons(M.stone, pl, 0, L, 26.5, D ? 1.4 : 1.8, D ? 1.1 : 1.6, D ? 2.0 : 2.7, 0.45, D, D)
    })
  }
  // the auditorium block, fly tower and the raised box at its other end
  B(-32, 22, -28, 16, 20, 31, ['top', 'top', 'top', 'top'])
  B(-29, 19, 6, 16, 31, 36, ['plain', 'plain', 'plain', 'plain'], false)
  B(-29, 19, -28, -19, 31, 34, ['plain', 'plain', 'plain', 'plain'], false)
  return M
}

const lit = (p: V3, n: V3) => (n[2] > 0.8 ? 0.2 : 0.85)
function materials(M: Mats): Array<{ part: Part; material: MaterialSpec }> {
  return [
    { part: M.stone, material: { ...finish('rohm-limestone', 0xf0e9dc), floodlight: lit } },
    { part: M.shade, material: { ...finish('rohm-shade', 0x8a8379), floodlight: () => 0.8 } },
    { part: M.win, material: PALETTE.window },
    { part: M.door, material: { ...PALETTE.entrance, color: 0x8a5a3c } },
  ]
}

async function write(file: string, parts: Array<{ part: Part; material: MaterialSpec }>, maxTris: number, maxBytes: number) {
  const triangles = parts.reduce((t, { part }) => t + part.triangles, 0)
  const glb = writeGlb('Royal Opera House Muscat', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor', bearing: 62.5, elevation: 0, height: 36,
  })
  console.log(`${file}: ${triangles} triangles, ${glb.length} bytes`)
  if (triangles > maxTris) throw new Error(`${file}: triangle budget exceeded: ${triangles}`)
  if (glb.length > maxBytes) throw new Error(`${file}: size budget exceeded: ${glb.length} bytes`)
  await Bun.write(new URL(`../models/${file}`, import.meta.url).pathname, glb)
}

if (import.meta.main) {
  await write('muscat-royal-opera-house.detail.glb', materials(build(true)), 40_000, 1536 * 1024)
  await write('muscat-royal-opera-house.glb', materials(build(false)), 6500, 250 * 1024)
}
