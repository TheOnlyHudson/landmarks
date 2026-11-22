/**
 * Orrin G. Hatch United States Courthouse (2014, Thomas Phifer and
 * Partners), 351 South West Temple, Salt Lake City. Procedural, CC0-1.0.
 * bun generators/slc-orrin-g-hatch-courthouse.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0. Origin: the area
 * centroid of OSM way/226319125 (-111.8930447, 40.7612725). The site is
 * flat (Mapterhorn: within 0.5 m under the outline), y = 0 at the ground.
 *
 * Form, from the photos: a near-cube ("the Borg cube"), its four walls a
 * glass curtain wall veiled by dense pale aluminium fins, so that it reads
 * silver-grey with blue sky reflections. The upper volume overhangs a
 * recessed, darker glazed base. Near the top of each face, tall dark slots
 * (recessed light wells, two-thirds of the way up to the roof) break the
 * fins; one sits at a corner and a pair near the middle of the north face.
 * A flat roof with a thin pale parapet.
 *
 * Numbers:
 *  - plan: OSM way/226319125, 57.1 x 55.0 m (the overhanging upper volume);
 *  - height: 61 m, OSM height tag; the building was finished in 2014, after
 *    the 2013 lidar flight, so lidar was not used;
 *  - the recessed base: 9.5 m tall, set back 3 m (estimated from p2, the
 *    soffit line just over the trees, and the description of the overhang);
 *  - slots: 3 m wide, from 40 m to the roof (estimated from p1 by the face
 *    width); fins drawn every 2.9 m, 0.8 m deep (the real fins are about 0.6 m apart;
 *    drawn at a fifth of their density so they read without shimmer); the
 *    paler top band (the top floor, where the fins close up) from p1.
 *
 * Photos (EVIDENCE):
 *  p1 https://commons.wikimedia.org/wiki/File:Orrin_G._Hatch_United_States_Courthouse,_SLC,_UT,_north_side_2024-09-01.jpg
 *     Xnatedawgx, CC BY-SA 4.0 (the north face straight on, east face beyond)
 *  p2 https://commons.wikimedia.org/wiki/File:United_States_Courthouse_for_the_District_of_Utah_(36686746041).jpg
 *     Ben P L, CC BY-SA 2.0 (a corner from below)
 *  p3 https://commons.wikimedia.org/wiki/File:U.S._Courthouse_for_the_District_of_Utah.JPG
 *     Swilsonmc, CC BY-SA 3.0 (the upper floors from a distance, over the
 *     Exchange Place buildings)
 * Doubts: only the north face is seen straight on; the slots on the south,
 *  east and west faces are placed by turning the north face's pattern
 *  round the cube (p2 and p3 show slots at corners and mid-face, but not
 *  their exact places); the base's setback and height are estimates.
 */
import { Part, writeGlb } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { box, panel, prism, rect, type Face } from './slc-beehive-house'

const glassWall = new Part(), fin = new Part(), slot = new Part(), roof = new Part(), base = new Part()
const HX = 28.55, HY = 27.5, H = 61.0, ZB = 9.5, SB = 3.0

// recessed base: dark lobby glazing on a pale plinth band
box(base, -HX + SB, -HY + SB, HX - SB, HY - SB, 0, ZB)
// the overhanging upper volume: the curtain wall
prism(glassWall, rect(-HX, -HY, HX, HY), ZB, H - 1.2, false, true)
// soffit under the overhang, and the pale parapet / roof
prism(fin, rect(-HX, -HY, HX, HY), ZB, ZB + 0.6, false, true)
prism(fin, rect(-HX - 0.1, -HY - 0.1, HX + 0.1, HY + 0.1), H - 1.2, H, false)
prism(fin, rect(-HX + 0.5, -HY + 0.5, HX - 0.5, HY - 0.5).reverse(), H - 1.0, H, false)
prism(roof, rect(-HX + 0.5, -HY + 0.5, HX - 0.5, HY - 0.5), H - 1.6, H - 1.0, true)
// the paler top floor band, where the fins close up (p1)
prism(fin, rect(-HX - 0.05, -HY - 0.05, HX + 0.05, HY + 0.05), H - 4.6, H - 1.2, false)
// top of the parapet ring
{
  const o = rect(-HX - 0.1, -HY - 0.1, HX + 0.1, HY + 0.1), i = rect(-HX + 0.5, -HY + 0.5, HX - 0.5, HY - 0.5)
  for (let k = 0; k < 4; k++) {
    const l = (k + 1) % 4
    fin.quad([i[k][0], i[k][1], H], [o[k][0], o[k][1], H], [o[l][0], o[l][1], H], [i[l][0], i[l][1], H])
  }
}

// each face: plane, half-length, and u running left to right seen from outside
const faces: [Face, number, number, number][] = [
  ['N', HY, HX, -1], // seen from the north, left is east (+x)
  ['S', -HY, HX, 1],
  ['E', HX, HY, 1], // seen from the east, left is south... u = y, left = -y
  ['W', -HX, HY, -1],
]
// slot positions as fractions of the face, left to right (p1, north face)
const SLOTS = [0.035, 0.39, 0.47]
const SW = 3.0, SZ0 = 40.0
for (const [f, plane, half, dir] of faces) {
  const n = f === 'N' ? [0, 1] : f === 'S' ? [0, -1] : f === 'E' ? [1, 0] : [-1, 0]
  const uAt = (t: number) => dir * (-half + t * 2 * half)
  const slotU = SLOTS.map(uAt)
  // fins every 2.9 m, stopped where a slot opens
  const count = Math.round((2 * half) / 2.9)
  for (let k = 0; k <= count; k++) {
    const u = -half + (k / count) * 2 * half
    const inSlot = slotU.some((s) => Math.abs(s - u) < SW / 2 + 0.3)
    const z1 = inSlot ? SZ0 : H - 1.2
    const d = 0.8, w = k === 0 || k === count ? 0.9 : 0.32
    if (f === 'N' || f === 'S') {
      const y0 = plane, y1 = plane + n[1] * d
      box(fin, u - w / 2, Math.min(y0, y1), u + w / 2, Math.max(y0, y1), ZB, z1)
    } else {
      const x0 = plane, x1 = plane + n[0] * d
      box(fin, Math.min(x0, x1), u - w / 2, Math.max(x0, x1), u + w / 2, ZB, z1)
    }
  }
  // the dark slots, cut through the parapet look: a panel up to the roof line
  for (const u of slotU) panel(slot, f, plane, u, SW, SZ0, H - 0.2, 'flat', 0.08)
  // lobby glazing in the base, in broad panels
  const bp = plane - (f === 'N' || f === 'E' ? SB : -SB)
  const bh = half - SB
  for (let k = 0; k < 4; k++) panel(slot, f, bp, -bh + (k + 0.5) * (bh / 2), bh / 2 - 1.2, 0.4, ZB - 0.8, 'flat', 0.05)
}

// ---------------------------------------------------------------- output ---
// Colours from p1-p3: silver-grey fins, a pale grey-blue reflecting glass
// wall (light window variant), dark slots and lobby glass, pale roof (OSM
// roof:colour #E5E1DD), a pale grey stone/metal base.
const parts = [
  { part: glassWall, material: windowVariant(2, 0xa9bccb) },
  { part: fin, material: finish('hatch-fin', 0xdadddf) },
  { part: slot, material: PALETTE.window },
  { part: roof, material: finish('hatch-roof', 0xd8d4ce) },
  { part: base, material: finish('hatch-base', 0xc9ccce) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Orrin G. Hatch United States Courthouse', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: H,
})
await Bun.write(new URL('../models/slc-orrin-g-hatch-courthouse.glb', import.meta.url), glb)
console.log(`slc-orrin-g-hatch-courthouse.glb: ${triangles} triangles, ${glb.length} bytes`)
