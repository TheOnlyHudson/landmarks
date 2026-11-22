/**
 * Cincinnati Observatory, 3489 Observatory Place, Mount Lookout,
 * Cincinnati — original procedural geometry, CC0-1.0.
 * bun generators/cin-observatory.ts
 *
 * Two buildings on the hilltop lawn: the 1873 main building (Samuel
 * Hannaford; Greek Revival in red brick) with its tetrastyle portico and
 * the big silver telescope dome behind it, and the smaller 1904 building
 * to the south-east with its own dome on a round drum and a cone-roofed
 * stair turret. (OSM names the first way "Herget Building" and the second
 * "Mitchel Building"; the model does not depend on which is which.)
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 5.7 (both buildings' grid, from lidar). Anchor =
 * the midpoint between the two buildings, -84.422367, 39.138922; the main
 * building is centred at about (-21.5, 21), the second at (21, -23).
 *
 * Identity (from the photos below):
 *  1. The big hemispherical silver dome on a short drum, rising from the
 *     middle of the main building.
 *  2. The cream tetrastyle portico with a pediment and an oculus, on a
 *     raised porch with steps, between red-brick wings with cream
 *     cornices and a roof balustrade, over a grey stone basement.
 *  3. The second building: low red brick with its dome on a round drum at
 *     the east end and a round turret with a cone roof.
 *
 * Plan: lidar edges (OSM way/76811703 and way/76811742 are drawn about
 * 5 degrees off the lidar and photos; the model follows lidar): main
 * block x -32.5..-10.8, y 17.0..28.5 with the raised centre x -27..-16 and
 * the portico x -26..-16.5, y 10.5..17; second building x 14..28,
 * y -32..-14, its drum centred (26, -22.3) r 4, turret (25.8, -13.2) r 2.
 *
 * Heights: USGS 3DEP lidar OH_StatewideP3_6_B21 (Ohio statewide phase 3,
 * flown about 2021), 0.5 m grid. y = 0 is the lowest ground, east of the
 * second building (lidar ground_min + 7.6); the main building stands on
 * ground 2.3 m higher. Measured: main wings 9.8 (balustrade 10.5), raised
 * centre 12.4, dome apex 18.3 (radius about 5), portico ridge 11.1;
 * second building 6.4, its dome apex 10.9, turret cone 9.4. Estimated
 * from the photos: the drum, the dome's spring, the columns, porch,
 * windows and cornices.
 *
 * Ground: Mapterhorn and lidar show the knoll falling about 2.5 m from
 * the main building to the east side of the second; elevation 0.
 *
 * Night: the windows glow; the domes stay unlit metal.
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 *  - Cincinnati Observatory.JPG, Analogue Kid at en.wikipedia, CC BY 2.5
 *    (the main front and dome)
 *    https://commons.wikimedia.org/wiki/File:Cincinnati_Observatory.JPG
 *  - Cincinnati Observatory, Hyde Park, Cincinnati, OH (46854731212).jpg,
 *    Warren LeMay, CC0 (the main front head-on)
 *    https://commons.wikimedia.org/wiki/File:Cincinnati_Observatory,_Hyde_Park,_Cincinnati,_OH_(46854731212).jpg
 *  - ... (46906858191).jpg, Warren LeMay, CC0 (a long side and the dome)
 *    https://commons.wikimedia.org/wiki/File:Cincinnati_Observatory,_Hyde_Park,_Cincinnati,_OH_(46906858191).jpg
 *  - ... (46854731362).jpg and (46906851451).jpg, Warren LeMay, CC0 (the
 *    second building's turret; both buildings across the lawn)
 *    https://commons.wikimedia.org/wiki/File:Cincinnati_Observatory,_Hyde_Park,_Cincinnati,_OH_(46854731362).jpg
 *    https://commons.wikimedia.org/wiki/File:Cincinnati_Observatory,_Hyde_Park,_Cincinnati,_OH_(46906851451).jpg
 * Aerial: USGS NAIP (public domain) for the plan and roofs.
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the brief called the domes copper; every photo shows them
 * silver-grey metal, as modelled. The second building's west and north
 * sides are only seen far off; its windows are estimated.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, cornice, gableRoof, onWall, rectShape, revolve, save, type XY } from './atl-tech-tower'

const circ = (s: number, z: number, r: number, n = 12): [number, number][] =>
  Array.from({ length: n }, (_, i) => [s + r * Math.cos((i / n) * Math.PI * 2), z + r * Math.sin((i / n) * Math.PI * 2)] as [number, number])

/** A dome of radius r springing at z0 with apex at z1 (an ellipsoid cap), smooth. */
function dome(p: Part, c: XY, r: number, z0: number, z1: number, n = 16, rings = 6) {
  const prof: [number, number][] = []
  for (let i = 0; i <= rings; i++) {
    const t = (i / rings) * (Math.PI / 2)
    prof.push([r * Math.cos(t), z0 + (z1 - z0) * Math.sin(t)])
  }
  prof[rings][0] = 0
  revolve(p, c, prof, n, 0, false, false)
}

if (import.meta.main) {
  const brick = new Part(), trim = new Part(), base = new Part(), win = new Part(), metal = new Part(), roof = new Part()

  // ───────────── main building ─────────────
  {
    const G = 2.3 // its ground above y = 0
    const X0 = -32.5, X1 = -10.8, Y0 = 17.0, Y1 = 28.5, ZW = 9.8, AX = -21.6
    const CX0 = -27.0, CX1 = -16.2, ZC = 12.4
    // grey stone basement and the brick body
    box(base, X0 - 0.15, X1 + 0.15, Y0 - 0.15, Y1 + 0.15, 0, G + 1.5, null, 0)
    box(brick, X0, X1, Y0, Y1, G + 1.5, ZW - 0.8, null, 0)
    cornice(trim, [[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1]], ZW - 0.8, 0.8, 0.4, roof)
    // roof balustrade on the wings (a solid pale band with dark slots reads at map size)
    for (const [xa, xb] of [[X0, CX0], [CX1, X1]]) {
      const ring: XY[] = [[xa + 0.1, Y0 + 0.1], [xb, Y0 + 0.1], [xb, Y1 - 0.1], [xa + 0.1, Y1 - 0.1]]
      for (let i = 0; i < 4; i++) {
        const a = ring[i], b = ring[(i + 1) % 4]
        if ((xa === X0 && i === 1) || (xb === X1 && i === 3)) continue // the side touching the raised centre
        trim.quad([a[0], a[1], ZW], [b[0], b[1], ZW], [b[0], b[1], ZW + 0.75], [a[0], a[1], ZW + 0.75])
        trim.quad([b[0], b[1], ZW], [a[0], a[1], ZW], [a[0], a[1], ZW + 0.75], [b[0], b[1], ZW + 0.75])
      }
    }
    // the raised centre round the dome
    box(brick, CX0, CX1, Y0 + 0.4, Y1 - 0.4, ZW - 0.8, ZC - 0.5, null, 0)
    cornice(trim, [[CX0, Y0 + 0.4], [CX1, Y0 + 0.4], [CX1, Y1 - 0.4], [CX0, Y1 - 0.4]], ZC - 0.5, 0.5, 0.3, roof)
    // drum and the silver dome
    const DC: XY = [AX, 22.6]
    revolve(trim, DC, [[5.3, ZC], [5.3, ZC + 1.2], [5.5, ZC + 1.3], [5.5, ZC + 1.6], [5.1, ZC + 1.6]], 16, 0, false, false)
    dome(metal, DC, 5.1, ZC + 1.6, 18.3, 16, 6)
    // the dome's shutter slot: a dark band from the drum to near the top
    {
      const n = 6
      for (let i = 0; i < n; i++) {
        const t0 = (i / n) * (Math.PI / 2) * 0.92, t1 = ((i + 1) / n) * (Math.PI / 2) * 0.92
        const P = (t: number, s: number): V3 => { const r = 5.1 * Math.cos(t) + 0.04, z = ZC + 1.6 + (18.3 - ZC - 1.6) * Math.sin(t) + 0.04 * Math.sin(t); return [DC[0] + s, DC[1] - Math.sqrt(Math.max(0, r * r - s * s)), z] }
        roof.quad(P(t0, -0.55), P(t0, 0.55), P(t1, 0.55), P(t1, -0.55))
      }
    }
    // the portico: porch, steps, four columns, entablature, pediment with an oculus
    const PX0 = -26.2, PX1 = -17.0, PY0 = 10.6, ZP = G + 1.4, ZCOL = 8.2, ZE = 9.2, ZR = 11.1
    box(base, PX0, PX1, PY0 + 1.6, Y0, 0, ZP, trim, 0.1)
    for (let k = 0; k < 3; k++) box(trim, AX - 1.6, AX + 1.6, PY0 + 1.6 - (k + 1) * 0.45 - 0.05, PY0 + 1.6 - k * 0.45, 0, ZP - (k + 1) * 0.45, trim, 0.03)
    for (let k = 0; k < 4; k++) {
      const cx = PX0 + 0.9 + k * ((PX1 - PX0 - 1.8) / 3)
      revolve(trim, [cx, PY0 + 2.3], [[0.42, ZP], [0.42, ZP + 0.2], [0.36, ZP + 0.3], [0.3, ZCOL - 0.4], [0.45, ZCOL]], 10, 0, false, false)
    }
    box(brick, PX0 + 0.3, PX1 - 0.3, PY0 + 3.6, Y0 + 0.2, ZP, ZE, null, 0)
    box(trim, PX0, PX1, PY0 + 1.5, Y0 + 0.2, ZCOL, ZE, null, 0)
    gableRoof(roof, trim, PX0, PX1, PY0 + 1.5, Y0 + 0.6, ZE, ZR, 'y', 0.3, 0.3)
    onWall(brick, [PX0, PY0 + 1.5], [PX1, PY0 + 1.5], [[0.8, ZE + 0.15], [PX1 - PX0 - 0.8, ZE + 0.15], [(PX1 - PX0) / 2, ZR - 0.4]], 0.03)
    onWall(trim, [PX0, PY0 + 1.5], [PX1, PY0 + 1.5], circ((PX1 - PX0) / 2, ZE + 0.85, 0.5), 0.06)
    // the door and windows behind the columns
    const fP: [XY, XY] = [[PX0 + 0.3, PY0 + 3.6], [PX1 - 0.3, PY0 + 3.6]]
    const LW = PX1 - PX0 - 0.6
    onWall(trim, fP[0], fP[1], rectShape(LW / 2 - 0.9, LW / 2 + 0.9, ZP, ZP + 3.4), 0.05)
    onWall(win, fP[0], fP[1], rectShape(LW / 2 - 0.7, LW / 2 + 0.7, ZP + 2.6, ZP + 3.2), 0.08)
    for (const s of [1.6, LW - 1.6]) onWall(win, fP[0], fP[1], rectShape(s - 0.6, s + 0.6, ZP + 0.6, ZP + 3.4), 0.06)
    // windows: tall sashes in cream frames; small basement windows
    const fronts: Array<[XY, XY, number[]]> = [
      [[X0, Y0], [CX0 + 0.8, Y0], [2.6]],
      [[CX1 - 0.8, Y0], [X1, Y0], [3.0]],
      [[X1, Y1], [X0, Y1], [2.2, 5.6, 9.0, 12.7, 16.1, 19.5]],
      [[X0, Y1], [X0, Y0], [3.0, 8.5]],
      [[X1, Y0], [X1, Y1], [3.0, 8.5]],
    ]
    for (const [a, b, ss] of fronts) for (const s of ss) {
      onWall(trim, a, b, rectShape(s - 0.75, s + 0.75, G + 2.3, G + 5.6), 0.04)
      onWall(win, a, b, rectShape(s - 0.55, s + 0.55, G + 2.45, G + 5.4), 0.08)
      onWall(win, a, b, rectShape(s - 0.4, s + 0.4, 0.6, G + 1.0), 0.17)
    }
  }

  // ───────────── the second building ─────────────
  {
    const X0 = 14.0, X1 = 28.0, Y0 = -32.0, Y1 = -14.0, ZW = 6.4
    box(base, X0 - 0.1, X1 + 0.1, Y0 - 0.1, Y1 + 0.1, 0, 1.4, null, 0)
    box(brick, X0, X1, Y0, Y1, 1.4, ZW - 0.6, null, 0)
    cornice(trim, [[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1]], ZW - 0.6, 0.6, 0.3, roof)
    // round drum and dome at the east end
    const D: XY = [26.0, -22.3]
    revolve(base, D, [[4.0, 0], [4.0, 1.4]], 16, 0, false, false)
    revolve(brick, D, [[4.0, 1.4], [4.0, 7.2]], 16, 0, false, false)
    revolve(trim, D, [[4.0, 7.2], [4.25, 7.4], [4.25, 7.8], [3.9, 7.8]], 16, 0, true, false)
    dome(metal, D, 3.9, 7.8, 10.9, 16, 5)
    // round stair turret with a cone roof at the north-east corner
    const T: XY = [25.8, -13.2]
    revolve(brick, T, [[2.0, 0], [2.0, 6.6]], 12, 0, false, false)
    revolve(trim, T, [[2.0, 6.6], [2.2, 6.8], [2.2, 7.1]], 12, 0, true, false)
    revolve(roof, T, [[2.2, 7.1], [0, 9.6]], 12, 0, false, true)
    // windows on the long sides and the front
    const fs: Array<[XY, XY, number[]]> = [
      [[X0, Y1], [X0, Y0], [3, 7, 11, 15]],
      [[X0, Y0], [X1, Y0], [3.5, 7.0]],
      [[X1, Y1], [X0, Y1], [5.5, 9.5]],
    ]
    for (const [a, b, ss] of fs) for (const s of ss) {
      onWall(trim, a, b, rectShape(s - 0.7, s + 0.7, 1.9, 4.9), 0.04)
      onWall(win, a, b, rectShape(s - 0.5, s + 0.5, 2.05, 4.7), 0.08)
    }
  }

  await save('cin-observatory', 'Cincinnati Observatory', [
    { part: brick, material: finish('obs-brick', 0xbb6a52) },
    { part: trim, material: PALETTE.trim },
    { part: base, material: finish('obs-basement', 0xbdb6a8) },
    { part: win, material: PALETTE.window },
    { part: metal, material: finish('obs-dome-metal', 0xc9cdd2, 0.4) },
    { part: roof, material: PALETTE.roof },
  ], { height: 18.3, anchor: [39.138922, -84.422367], bearing: 5.7 })
}
