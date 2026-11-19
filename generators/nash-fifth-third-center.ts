/**
 * Fifth Third Center (built as Third National Financial Center, then
 * SunTrust Center; 424 Church Street), Nashville (1986, Kohn Pedersen Fox)
 * — original procedural geometry, CC0-1.0.
 * bun generators/nash-fifth-third-center.ts [out.glb]
 * (Uses the small kit exported by generators/nash-pinnacle.ts.)
 *
 * Identity: OSM has two overlapping ways for this one building.
 * way/130913032 ("Fifth Third Bank Building", wikidata Q1411817, which is
 * "Fifth Third Center", the 1986 KPF tower) is the whole tower's outline, a
 * U in plan; way/465454850 (building=commercial, height 149, 30 levels,
 * unnamed) is the gabled upper block inside it, its 149 m being the CTBUH
 * height. Lidar confirms both are one tower: the U is the 2022 roofline
 * and the inner rectangle is the gable. Built once, replacing both.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground under the footprint. Anchor = area centroid of
 * way/130913032 (36.1637505, -86.7801499). Bearing 63°: the tower's long
 * axis (51 m) runs along +y (63°, toward 4th Avenue); +x faces 153°, the
 * plaza side on the south-south-east, and -x faces 333°, Church Street's
 * side (the pediment face in LeMay's photo up the street).
 *
 * What makes it recognisable, each drawn as plain geometry:
 * - the low, full-width stone pediment on top, with a glazed semicircular
 *   lunette in it, over the tower's main faces: a gable roof whose ridge
 *   runs across the building (lidar: eaves ~126 m, ridge 133.7 m);
 * - the faces split into stone corner towers with paired window columns
 *   and a glass centre bay between them;
 * - on the plaza side, two stone wings standing out from the tower (to
 *   108.7 m), each topped by an open square stone frame, with the glass
 *   centre recessed between them and stepping down (97 and 109 m);
 * - pale warm grey granite, blue reflective glass.
 *
 * Evidence
 * - OSM: way/130913032 outline (read in this frame: x -18.5 to 22.3, y
 *   -25.5 to 25.3, the plaza-side notch x > 12.6, |y| < 11.5); way/465454850.
 * - Lidar: USGS 3DEP TN_DavidsonCo_1_2022 (2022 flight), 0.5 m grid, read in
 *   this frame. Heights above the lowest ground under the footprint (the
 *   north-east, 3.0 m above the box's ground_min). Measured: main walls
 *   120.4 m; gable ridge 133.7 m along x = -14..8, eaves ~126 m at |y| = 20;
 *   wings 108.7 m; glass recess tops 97 and 109 m. The lidar sits ~1 m off
 *   OSM; OSM is used for the plan.
 * - Published: 133 m roof (Wikipedia "Fifth Third Center (Nashville)"; CTBUH's
 *   150 m is disputed there), 31 floors, 1986, Kohn Pedersen Fox, Postmodern.
 * - Photos (Wikimedia Commons), all EVIDENCE:
 *   Fifth Third Bank Building, Church Street and 5th Avenue, Nashville, TN
 *     (54384181507), Warren LeMay, CC BY-SA 2.0 (the pediment face, square-on:
 *     used for the tower/centre split, the lunette and the pediment pitch);
 *   ... (54385242299), Warren LeMay, CC BY-SA 2.0 (the plaza side looking up:
 *     wings, open frames, glass centre);
 *   ... (54385282233), Warren LeMay, CC BY-SA 2.0 (the plaza portico);
 *   Fifth Third Center Nashville From Plaza.jpg, Wobbanight, CC0;
 *   High-rises Downtown Nashville TN 2013-07-20 005.jpg, Thomas R Machnitzki,
 *     CC BY 3.0 (from the south-west, far).
 *   No look-only sources were used. No commercial imagery.
 * - Colours from those photos, pulled to the palette: warm grey-beige
 *   granite, sky-blue reflective glass.
 * - Night: the office windows and the glass bays glow (window); the
 *   lunette too (it is lit glass in night views of the skyline).
 *
 * Estimated: the stone base height (17 m) and its tall openings; the
 * lunette's radius; the open frames' height (4 m); the window grouping
 * (three storeys a panel; the real towers group them by four).
 * Left out: the plaza portico's tapered piers, the 5/3 logo, mullions.
 * Doubts: the end faces (toward 4th and 5th Avenues) are only seen at a
 * slant; they are drawn with the same tower windows.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, at, poly, prism, bevel, rect, rows, panels, lip, cap, ccw, walls, save, type Layer } from './nash-pinnacle'

function build(): Layer[] {
  const stone = new Part(), win = new Part(), roof = new Part()

  const X0 = -18.5, X1 = 12.6, XW = 22.3, Y0 = -25.5, Y1 = 25.3, YN = 11.5
  const Z_BASE = 17, Z_TOP = 120.4, Z_EAVE = 123.9, Z_RIDGE = 133.7, Z_WING = 108.7, Z_REC = 97, GX = 8.2
  const rs = (z0: number, z1: number) => rows(z0, z1, Z_BASE, 11.7, 1.6, 0.8, 0.6)

  // --- main block (the U without the plaza notch), with the plaza-side
  // glass recess between the wings ---
  const main = bevel(ccw([[X0, Y0], [X1, Y0], [X1, -YN], [GX, -YN], [GX, YN], [X1, YN], [X1, Y1], [X0, Y1]]), 0.4)
  prism(stone, main, 0, Z_TOP, roof)
  lip(stone, main, Z_TOP - 0.8, Z_TOP, 0.35)
  // the recess: glass box between the wings, x GX..X1, stepping down
  prism(stone, rect(GX, -YN, X1 - 2.2, YN), 0, Z_REC + 12, roof)
  prism(stone, rect(X1 - 2.2, -YN, X1, YN), 0, Z_REC, roof)

  // --- wings on the plaza side ---
  for (const s of [1, -1]) {
    const yA = s > 0 ? YN : Y0, yB = s > 0 ? Y1 : -YN
    const w = bevel(rect(X1 - 0.5, yA, XW, yB), 0.4)
    prism(stone, w, 0, Z_WING - 4, roof)
    lip(stone, w, Z_WING - 4.6, Z_WING - 4, 0.3)
    // the open frame on top: four corner posts and a lintel ring
    const x0 = X1 + 0.5, x1 = XW, y0 = yA, y1 = yB, t = 1.8
    for (const [px, py] of [[x0, y0], [x1 - t, y0], [x1 - t, y1 - t], [x0, y1 - t]]) prism(stone, rect(px, py, px + t, py + t), Z_WING - 4, Z_WING - 1.4, null)
    for (const r of [rect(x0, y0, x1, y0 + t), rect(x0, y1 - t, x1, y1), rect(x0, y0 + t, x0 + t, y1 - t), rect(x1 - t, y0 + t, x1, y1 - t)]) {
      prism(stone, r, Z_WING - 1.4, Z_WING, stone)
      cap(stone, ccw(r), Z_WING - 1.4, false)
    }
    // mid post on the long sides (the frames show two openings a side)
    const ym = (y0 + y1) / 2
    prism(stone, rect(x1 - t, ym - t / 2, x1, ym + t / 2), Z_WING - 4, Z_WING - 1.4, null)
    prism(stone, rect(x0, ym - t / 2, x0 + t, ym + t / 2), Z_WING - 4, Z_WING - 1.4, null)
  }

  // --- the gabled crown: attic band, then the pediments and roof ---
  const gab: XY[] = rect(X0, Y0, GX, Y1)
  walls(stone, ccw(gab), Z_TOP, Z_EAVE)
  for (const x of [X0, GX]) {
    const hint = x === X0 ? -1 : 1
    poly(stone, [[x, Y0, Z_EAVE], [x, Y1, Z_EAVE], [x, 0, Z_RIDGE]], [hint, 0, 0])
  }
  poly(roof, [[X0 - 0.5, Y0 - 0.5, Z_EAVE - 0.2], [GX + 0.5, Y0 - 0.5, Z_EAVE - 0.2], [GX + 0.5, 0, Z_RIDGE + 0.2], [X0 - 0.5, 0, Z_RIDGE + 0.2]], [0, -1, 1])
  poly(roof, [[X0 - 0.5, Y1 + 0.5, Z_EAVE - 0.2], [GX + 0.5, Y1 + 0.5, Z_EAVE - 0.2], [GX + 0.5, 0, Z_RIDGE + 0.2], [X0 - 0.5, 0, Z_RIDGE + 0.2]], [0, 1, 1])
  // undersides of the overhang
  poly(stone, [[X0 - 0.5, Y0 - 0.5, Z_EAVE - 0.2], [GX + 0.5, Y0 - 0.5, Z_EAVE - 0.2], [GX + 0.5, Y0, Z_EAVE], [X0 - 0.5, Y0, Z_EAVE]], [0, 0, -1])
  poly(stone, [[X0 - 0.5, Y1 + 0.5, Z_EAVE - 0.2], [GX + 0.5, Y1 + 0.5, Z_EAVE - 0.2], [GX + 0.5, Y1, Z_EAVE], [X0 - 0.5, Y1, Z_EAVE]], [0, 0, -1])
  // the lunette on both pediments: a glazed semicircle on the attic line
  for (const [x, h] of [[X0 - 0.06, -1], [GX + 0.06, 1]] as [number, number][]) {
    const r = 10, zc = Z_TOP + 1.1, N = 12
    for (let i = 0; i < N; i++) {
      const a0 = Math.PI * i / N, a1 = Math.PI * (i + 1) / N
      poly(win, [[x, 0, zc], [x, r * Math.cos(a0), zc + r * Math.sin(a0)], [x, r * Math.cos(a1), zc + r * Math.sin(a1)]], [h, 0, 0])
    }
    poly(win, [[x, -r, zc], [x, r, zc], [x, r, zc - 3.6], [x, -r, zc - 3.6]], [h, 0, 0])
  }

  // --- facades ---
  // A face a→b (ring order, outside to the right) split into segments
  // [s0, s1, kind]: 'tower' = stone with paired window columns, 'glass' =
  // a glass bay of broad panels between thin stone piers.
  type Seg = [number, number, 'tower' | 'glass']
  function face(a: XY, b: XY, z0: number, z1: number, segs: Seg[]) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    for (const [s0, s1, kind] of segs) {
      const w = (s1 - s0) * L
      if (kind === 'tower') {
        // two window columns, each ~32% of the tower's width, centred
        const cw = 0.34, gap = 0.1
        for (const c of [0.5 - gap / 2 - cw, 0.5 + gap / 2]) {
          panels(win, a, b, rs(z0, z1), w, 0, s0 + (s1 - s0) * c, s0 + (s1 - s0) * (c + cw), 0.05, 0)
        }
      } else {
        panels(win, a, b, rs(z0, z1).map(([p, q]) => [p - 0.6, q + 0.6] as [number, number]), 3.0, 0.3, s0, s1, 0.05, 0.5)
      }
    }
  }
  const tw = 12.5
  // Church Street face (x = X0): towers at the ends, glass between
  {
    const a: XY = [X0, Y1], b: XY = [X0, Y0], L = Y1 - Y0
    face(a, b, Z_BASE, Z_TOP, [[0, tw / L, 'tower'], [tw / L, 1 - tw / L, 'glass'], [1 - tw / L, 1, 'tower']])
  }
  // end faces (y = Y0 and y = Y1): main block as tower + glass, wing as tower
  for (const s of [1, -1]) {
    const y = s > 0 ? Y1 : Y0
    const a: XY = s > 0 ? [XW, y] : [X0, y], b: XY = s > 0 ? [X0, y] : [XW, y], L = XW - X0
    const wing = (XW - X1) / L, t = tw / L
    if (s > 0) face(a, b, Z_BASE, Z_WING - 4.6, [[0, wing + 0.02, 'tower']])
    else face(a, b, Z_BASE, Z_WING - 4.6, [[1 - wing - 0.02, 1, 'tower']])
    if (s > 0) face(a, b, Z_BASE, Z_TOP, [[wing + 0.02, 1 - t, 'glass'], [1 - t, 1, 'tower']])
    else face(a, b, Z_BASE, Z_TOP, [[0, t, 'tower'], [t, 1 - wing - 0.02, 'glass']])
  }
  // plaza side: the wings' outer faces as towers, their inner faces glass,
  // the main block's faces above the wings and the recess as glass
  for (const s of [1, -1]) {
    const yA = s > 0 ? YN : Y0, yB = s > 0 ? Y1 : -YN
    face([XW, yA], [XW, yB], Z_BASE, Z_WING - 4.6, [[0, 1, 'tower']])
    const yi = s > 0 ? YN : -YN
    if (s > 0) face([X1, yi], [XW, yi], Z_BASE, Z_WING - 4.6, [[0.05, 0.95, 'glass']])
    else face([XW, yi], [X1, yi], Z_BASE, Z_WING - 4.6, [[0.05, 0.95, 'glass']])
    // main block's plaza face above the wing
    face([X1, yA], [X1, yB], Z_WING, Z_TOP, [[0, 1, 'tower']])
  }
  // the recessed main face over the glass box
  face([GX, -YN], [GX, YN], Z_REC + 12, Z_TOP, [[0, 1, 'glass']])
  // the glass box's own faces: broad panels
  panels(win, [X1, -YN], [X1, YN], rs(Z_BASE, Z_REC), 3.2, 0.45, 0, 1, 0.05, 0.7)
  panels(win, [X1 - 2.2, -YN], [X1 - 2.2, YN], rs(Z_REC, Z_REC + 12), 3.2, 0.45, 0, 1, 0.05, 0.7)

  // --- the stone base: tall openings, 0 → Z_BASE ---
  const baseRing = ccw([[X0, Y0], [XW, Y0], [XW, -YN], [X1, -YN], [X1, YN], [XW, YN], [XW, Y1], [X0, Y1]])
  for (let i = 0; i < baseRing.length; i++) {
    const a = baseRing[i], b = baseRing[(i + 1) % baseRing.length]
    panels(win, a, b, [[1.0, Z_BASE - 3]], 5.5, 2.4, 0, 1, 0.05, 2.0)
  }
  lip(stone, ccw(main), Z_BASE - 0.6, Z_BASE, 0.3)

  return [
    { part: stone, material: finish('fifth-third-granite', 0xdad4c9) },
    { part: win, material: { ...PALETTE.window, color: 0x7d9ab4 } },
    { part: roof, material: PALETTE.roof },
  ]
}

if (import.meta.main) {
  await save('nash-fifth-third-center', 'Fifth Third Center', build(), {
    bearing: 63, height: 133.7, replaces: ['way/130913032', 'way/465454850'],
  })
}
