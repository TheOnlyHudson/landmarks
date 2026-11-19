/**
 * Cape Florida Light, Bill Baggs Cape Florida State Park, Key Biscayne
 * (1825, raised to its present height in 1855; NRHP 70000180) — original
 * procedural geometry, CC0-1.0.
 * bun generators/mia-cape-florida-light.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (a round tower).
 * Anchor = centroid of the OSM outline way/305533830 (25.6665909,
 * -80.1559656). y = 0 is the ground at the foot of the tower (lidar ground
 * is flat at 1.3 m above the lidar's ground_min all round it).
 *
 * Identity: the tall white brick tower tapering straight up; the black iron
 * top: bracketed gallery with its railing, the watch room, the lantern's
 * ledge, the glazed lantern and its domed cap with ventilator ball.
 *
 * Evidence:
 *  - lidar FL_TopobathyFLKeysNOAA_Hydroflattened_2019 (flown 2019), 0.5 m
 *    grid (measured, above the ground): returns at r 2.5-2.8 at 27.7 (the
 *    lantern ledge / gallery railing), the lantern roof 30.8 at r <= 2,
 *    the ventilator tip 32.6; the shaft's slanted returns put its radius
 *    near 3.3 at the foot.
 *  - OSM way/305533830: a 7.5 m circle, height 29 (the published 95 ft).
 *  - photo proportions, scaled from the base to the lidar tip (Strzelecki,
 *    almost square-on, 28.2 px/m): foot 6.6 m across, 3.9 m under the
 *    gallery at 25.8; gallery deck 26.1-26.4, railing to 27.3, black watch
 *    room to 28.0, lantern ledge 28.0 (r 2.4), glazing 28.1-30.4 (r 1.55),
 *    dome to 31.3, ball and vane to 32.6.
 *  - estimated: the corbel under the gallery, the railing drawn as a solid
 *    thin band (it is open iron work), the three small square windows up
 *    the stair (photos show one on each side at different heights), the
 *    door's direction (drawn facing the keeper's cottage, west-south-west;
 *    the photo of the door doesn't fix its compass side).
 *  - colour: white-painted brick; black iron; the lantern's glass reads
 *    a dark green-grey by day (Pessar, Hughes).
 *
 * Night: the lantern is a working light (white flash), so its glazing is
 * `neon-cfl-lantern` in its day colour. The tower itself is not floodlit.
 *
 * Photos (Wikimedia Commons):
 *  - "Cape Florida Light(js)01.jpg", Jerzy Strzelecki, CC BY 3.0
 *  - "Key Biscayne - Cape Florida Lighthouse.jpg", P. Hughes, CC BY-SA 4.0
 *  - "Cape Florida Light 1825 (13948609788).jpg", Phillip Pessar, CC BY 2.0
 * Look-only: none.
 *
 * Doubts: the door's compass side; the keeper's cottage (way/313369992,
 * 43 m WSW) is left to the map.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { lathe, save, type XY } from './chi-aon-center'

const SEG = 16
const R0 = 3.3, R1 = 1.95, ZT = 25.8
const rAt = (z: number) => R0 + ((R1 - R0) * z) / ZT

function build() {
  const white = new Part(), black = new Part(), lantern = new Part()
  const L = (p: Part, prof: XY[]) => lathe(p, 0, 0, prof, SEG)

  // the white shaft
  L(white, [[R0, 0], [rAt(13), 13], [R1, ZT]])
  // black corbel under the gallery, deck edge, deck
  L(black, [[R1 - 0.05, ZT - 0.5], [2.75, 26.1]])
  L(black, [[2.75, 26.1], [2.75, 26.4]])
  L(black, [[2.75, 26.4], [2.55, 26.4]])
  // railing band (outer, top, inner)
  L(black, [[2.62, 26.4], [2.62, 27.3]])
  L(black, [[2.62, 27.3], [2.48, 27.3]])
  L(black, [[2.48, 27.3], [2.48, 26.4]].reverse() as XY[])
  L(black, [[2.48, 26.4], [1.7, 26.4]])
  // watch room
  L(black, [[1.7, 26.4], [1.7, 27.85]])
  // lantern ledge
  L(black, [[1.7, 27.85], [2.4, 27.85]])
  L(black, [[2.4, 27.85], [2.4, 28.05]])
  L(black, [[2.4, 28.05], [1.55, 28.05]])
  // glazed lantern with a black sill and astragal ring
  L(lantern, [[1.55, 28.05], [1.55, 29.15]])
  L(black, [[1.58, 29.15], [1.58, 29.3]])
  L(lantern, [[1.55, 29.3], [1.55, 30.4]])
  // dome cap: eave, dome, ventilator ball, vane
  L(black, [[1.8, 30.4], [1.8, 30.55]])
  L(black, [[1.55, 30.4], [1.8, 30.4]])
  L(black, [[1.8, 30.55], [1.45, 30.8], [0.9, 31.1], [0.3, 31.3]])
  L(black, [[0.3, 31.3], [0.42, 31.5], [0.42, 31.75], [0.25, 31.95], [0.08, 32.0], [0.06, 32.6], [0, 32.6]])

  // doorway at the foot, facing the keeper's cottage (west-south-west)
  const a = (250 * Math.PI) / 180 // compass bearing 250
  const dir: V3 = [Math.sin(a), Math.cos(a), 0], side: V3 = [Math.cos(a), -Math.sin(a), 0]
  const at = (s: number, z: number, out: number): V3 => {
    const r = rAt(z) + out
    return [dir[0] * r + side[0] * s, dir[1] * r + side[1] * s, z]
  }
  const flush = (p: Part, s0: number, s1: number, z0: number, z1: number, out: number) =>
    p.quad(at(s1, z0, out), at(s0, z0, out), at(s0, z1, out), at(s1, z1, out))
  flush(white, -0.75, 0.75, 0, 2.7, 0.04) // pale surround
  flush(black, -0.5, 0.5, 0, 2.3, 0.07) // door leaf
  // small square stair windows up the shaft, on three sides
  for (const [deg, z] of [[70, 8.5], [190, 14.5], [320, 20.5]] as [number, number][]) {
    const b = (deg * Math.PI) / 180, d: V3 = [Math.sin(b), Math.cos(b), 0], t: V3 = [Math.cos(b), -Math.sin(b), 0]
    const P = (s: number, zz: number): V3 => [d[0] * (rAt(zz) + 0.05) + t[0] * s, d[1] * (rAt(zz) + 0.05) + t[1] * s, zz]
    black.quad(P(0.35, z), P(-0.35, z), P(-0.35, z + 0.9), P(0.35, z + 0.9))
  }

  return [
    { part: white, material: finish('cfl-white', 0xf3f0e8) },
    { part: black, material: finish('cfl-black', 0x4a4f57) },
    { part: lantern, material: finish('neon-cfl-lantern', 0x8d978f, 0.3) },
  ]
}

if (import.meta.main) await save('mia-cape-florida-light', 'Cape Florida Light', [25.6665909, -80.1559656], 0, build(), 5000)
