/**
 * Soldiers and Sailors Memorial Hall (Allegheny County Soldiers' Memorial,
 * Palmer & Hornbostel, 1907-1911), Fifth Avenue at Bigelow Boulevard,
 * Oakland, Pittsburgh — original procedural geometry, CC0-1.0.
 * bun generators/pit-soldiers-and-sailors.ts
 *
 * This file also exports two classical helpers (`column`, `shiftParts`)
 * that pit-mellon-institute.ts and pit-carnegie-institute.ts import; the
 * hall is only written when this file runs itself, so merge it first.
 *
 * Map frame of the model: x, y, z up, metres; origin at the anchor on the
 * lowest ground under the footprint. Anchor = area centroid of the OSM
 * outline way/154945608, -79.9564360 40.4450470. The hall stands at 45° to
 * the streets: the catalog bearing is 316.7, so model +y points north-west
 * (the back, toward O'Hara Street), -y south-east (the front, up the lawn
 * from Fifth Avenue), +x north-east (Bigelow Boulevard), -x south-west
 * (University Place). The hall itself is centred 0.3 m east and 5.8 m north
 * of the anchor in this frame (the outline's centroid is pulled south-east
 * by the front terrace); everything is drawn about the hall's centre and
 * shifted.
 *
 * Identity, in order: the dark stepped pyramid roof (the "Mausoleum of
 * Halicarnassus" crown) with its white terracotta cresting, corner
 * acroteria and top ornament; the square buff stone block with a deep
 * colonnade of eight columns in antis on every face between solid corner
 * pavilions; the attic of white grilles, set back on the terrace roof; the
 * narrower clerestory storey with seven small windows under the cresting;
 * the rusticated basement storey; on the front, the low frontispiece with
 * three doors up a flight of steps, between lawn terraces over the front
 * basement.
 *
 * Evidence:
 *  - plan: OSM outline way/154945608 (the basement 53.8 × 52 m and the
 *    front terrace 73 m wide), turned into this frame. The main block,
 *    attic and clerestory squares from the lidar edges (below).
 *  - heights, measured: USGS 3DEP lidar PA_WesternPA_2_2019 (flight 2019),
 *    0.5 m grid, above the ground round the sides and back (286.0 m
 *    NAVD88; the site is level within 0.6 m and the map's terrain agrees):
 *    basement roof 6.0 (edge ±27); front terrace 5.8; frontispiece 8.2;
 *    main cornice 22.3 at ±23; attic terrace 27.1 at ±22.3; clerestory
 *    with its cresting 33.6 at ±18; pyramid 35.6 at 15 m from the centre
 *    and 39.3 at 10 m (slope 0.74), apex 46.7; top ornament 50.5; corner
 *    acroteria ~37.
 *  - published: completed 1911, Henry Hornbostel (Palmer & Hornbostel),
 *    modelled on the Mausoleum at Halicarnassus (Wikipedia, "Soldiers and
 *    Sailors Memorial Hall and Museum"; National Register 1985).
 *  - photos (Wikimedia Commons, all EVIDENCE):
 *    "Soldiers and Sailors Hall, Oakland, Pittsburgh, 2023-05-20, 01.jpg"
 *      https://commons.wikimedia.org/wiki/File:Soldiers_and_Sailors_Hall,_Oakland,_Pittsburgh,_2023-05-20,_01.jpg
 *      Cbaile19, CC0 — the front head-on: storeys, colonnade, porch, roof.
 *    "Soldiers and Sailors Hall, Oakland, Pittsburgh, 2023-05-20, 02.jpg"
 *      https://commons.wikimedia.org/wiki/File:Soldiers_and_Sailors_Hall,_Oakland,_Pittsburgh,_2023-05-20,_02.jpg
 *      Cbaile19, CC0 — the front from the lawn walk.
 *    "Soldiers and Sailors Hall, Oakland, Pittsburgh, 2023-05-20, 03.jpg"
 *      https://commons.wikimedia.org/wiki/File:Soldiers_and_Sailors_Hall,_Oakland,_Pittsburgh,_2023-05-20,_03.jpg
 *      Cbaile19, CC0 — from the south lawn: the front and the south-west
 *      side, the low terrace wing.
 *    "Soldiers and Sailors Hall from the corner of O’Hara Street and University Place, 2023-09-25, 01.jpg"
 *      https://commons.wikimedia.org/wiki/File:Soldiers_and_Sailors_Hall_from_the_corner_of_O%E2%80%99Hara_Street_and_University_Place,_2023-09-25,_01.jpg
 *      Cbaile19, CC0 — the west corner: the south-west and north-west
 *      sides, basement storey, side colonnades.
 *    "Soldiers and Sailors Hall, Oakland, Pittsburgh, 2021-10-07, 01.jpg"
 *      https://commons.wikimedia.org/wiki/File:Soldiers_and_Sailors_Hall,_Oakland,_Pittsburgh,_2021-10-07,_01.jpg
 *      Cbaile19, CC0 — the front from Fifth Avenue; colour in sun.
 *    "Allegheny County Soldiers’ Memorial, Oakland, Pittsburgh, 2026-10-23.jpg"
 *      https://commons.wikimedia.org/wiki/File:Allegheny_County_Soldiers%E2%80%99_Memorial,_Oakland,_Pittsburgh,_2026-10-23.jpg
 *      Cbaile19, CC0 — the front in full sun; stone and roof colour.
 *    "Soldiers and Sailors Hall, Oakland, 2022-11-05, 01.jpg"
 *      https://commons.wikimedia.org/wiki/File:Soldiers_and_Sailors_Hall,_Oakland,_2022-11-05,_01.jpg
 *      Cbaile19, CC0 — at night: the front floodlit, the clerestory lit.
 *    USGS NAIP orthophoto (public domain): the plan, the roof's dark tile
 *    and the green-grey rim of the attic terrace.
 *  - colour: buff sandstone in sun, pulled to the palette's lightness; the
 *    cresting, acroteria and attic grilles white terracotta (trim); the
 *    pyramid's glazed tile dark blue-grey, kept dark as the defining
 *    feature but no darker than the palette allows. The attic terrace
 *    and the cornice ledge are green-grey in NAIP; they share one muted
 *    grey-green finish with the lawn terraces on the front basement.
 * Estimated: the storey heights inside the main block (columns 10.4-19.8,
 * the tall windows behind them, the attic grilles, the clerestory windows),
 * from the head-on photo scaled to the lidar cornice and attic; the column
 * count (8 a face; the photos show the front and two sides, the back is
 * assumed to repeat them); the frontispiece's doors and the step flight;
 * the door level (~3 m, between the approach walk and the lawn terraces).
 * Doubts: the front terrace's top reads 5.8 m in the lidar with no ground
 * returns, so it is drawn as a lawn-topped stone podium (OSM maps it as
 * part of the building); the approach walk between its two halves is the
 * map's ground. The back (north-west) face is seen only obliquely.
 *
 * Left out: the statue over the porch, the inscriptions and carved
 * tablets, lamps, the column flutes and capitals, the small ornaments
 * along the cresting (drawn as one bold white band).
 *
 * Night: the main block is floodlit from the lawn (stone `floodlight`,
 * strongest on the front, none on the roof); the clerestory windows and the
 * doors glow. The tall windows behind the colonnades are dark at night in
 * the night photo, so they are drawn in the roof's dark tile colour, which
 * also matches their daytime grey-blue.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, inset, lathe, onWall, panel, rect, save, walls, type XY } from './chi-aon-center'
import { band, grow, poly, wallsSplit } from './pit-allegheny-county-courthouse'

// ---------------------------------------------------------------------------
// Classical helpers, shared with pit-mellon-institute.ts and
// pit-carnegie-institute.ts.

/**
 * A round column at (cx, cy): a square plinth (`base` high), a shaft from
 * radius r tapering to 0.88 r, and a square abacus `cap` high under z1.
 */
export function column(shaft: Part, block: Part, cx: number, cy: number, r: number, z0: number, z1: number, o: { base?: number; cap?: number; seg?: number } = {}) {
  const base = o.base ?? 0.5, ab = o.cap ?? 0.5, seg = o.seg ?? 10
  const s = r * 1.25
  if (base > 0) { walls(block, rect(cx - s, cy - s, cx + s, cy + s), z0, z0 + base); cap(block, rect(cx - s, cy - s, cx + s, cy + s), z0 + base) }
  lathe(shaft, cx, cy, [[r, z0 + base], [r * 0.88, z1 - ab]], seg)
  if (ab > 0) {
    const t = r * 1.2
    walls(block, rect(cx - t, cy - t, cx + t, cy + t), z1 - ab, z1)
    cap(block, rect(cx - t, cy - t, cx + t, cy + t), z1 - ab, false)
  }
}

/** Move every vertex of the parts by (dx, dy) in the map frame (stored as glTF x, -z). */
export function shiftParts(parts: Part[], dx: number, dy: number) {
  for (const p of parts) for (let i = 0; i < p.pos.length; i += 3) { p.pos[i] += dx; p.pos[i + 2] -= dy }
}

/** A box [x0,y0,x1,y1] from z0 to z1, walls split for the terrain, flat top in `top`. */
export function box(wall: Part, top: Part | null, r: [number, number, number, number], z0: number, z1: number, step = 5) {
  wallsSplit(wall, rect(...r), z0, z1, step)
  if (top) cap(top, rect(...r), z1)
}

// ---------------------------------------------------------------------------
// The hall

function build() {
  const stone = new Part(), white = new Part(), win = new Part(), tile = new Part(), door = new Part(), lawn = new Part()

  const B = 27 // basement half-width (x); its y runs -25..27
  const M = 23 // main block half-width
  const A = 22.3 // attic
  const C = 17.8 // clerestory
  const Z = { base: 6, plinth: 10.4, col: 19.8, cornice: 22.4, attic: 27.1, clere: 31.0, crest: 32.8, apex: 46.7, orn: 50.5 }

  // ---- basement storey, rusticated, with white grilles
  const baseR: [number, number, number, number] = [-B, -25, B, 27]
  box(stone, stone, baseR, 0, Z.base)
  band(stone, rect(...baseR), grow(baseR, 0.3), Z.base - 0.7, Z.base)
  {
    const fs: [XY, XY][] = [[[B, -25], [B, 27]], [[B, 27], [-B, 27]], [[-B, 27], [-B, -25]]]
    for (const [a, b] of fs) {
      const { L } = onWall(a, b), n = 13, pitch = L / n
      for (let i = 0; i < n; i++) {
        const s = (i + 0.5) * pitch
        // the back face has two doors either side of the middle
        if (a[1] === 27 && (i === 4 || i === 8)) { panel(door, a, b, s - 1.0, s + 1.0, 0.2, 3.4, 0.05); continue }
        panel(white, a, b, s - 0.65, s + 0.65, 2.2, 3.5, 0.05)
      }
    }
  }

  // ---- the main block: plinth storey, recessed colonnade, entablature
  const mr = rect(-M, -M, M, M)
  walls(stone, mr, Z.base, Z.plinth)
  band(stone, mr, grow([-M, -M, M, M], 0.25), Z.plinth - 0.6, Z.plinth)
  // the colonnade storey: each face recessed 1.8 m between corner pavilions
  const PAV = 9.3, REC = 1.8
  const ring: XY[] = []
  const corners: XY[] = [[-M, -M], [M, -M], [M, M], [-M, M]]
  for (let k = 0; k < 4; k++) {
    const a = corners[k], b = corners[(k + 1) % 4]
    const { u, n } = onWall(a, b)
    const at = (s: number, o: number): XY => [a[0] + u[0] * s + n[0] * o, a[1] + u[1] * s + n[1] * o]
    ring.push(at(0, 0), at(PAV, 0), at(PAV, -REC), at(2 * M - PAV, -REC), at(2 * M - PAV, 0))
  }
  walls(stone, ring, Z.plinth, Z.col)
  // entablature over the colonnade, with the cornice projecting
  walls(stone, mr, Z.col, Z.cornice - 0.8)
  band(stone, mr, grow([-M, -M, M, M], 0.9), Z.cornice - 0.8, Z.cornice, 0.5)
  // the soffits over the recesses
  for (let k = 0; k < 4; k++) {
    const a = corners[k], b = corners[(k + 1) % 4]
    const { P } = onWall(a, b)
    stone.quad(P(PAV, Z.col, -REC), P(2 * M - PAV, Z.col, -REC), P(2 * M - PAV, Z.col, 0), P(PAV, Z.col, 0))
  }

  // colonnade: eight columns in antis per face, tall windows behind them
  for (let k = 0; k < 4; k++) {
    const a = corners[k], b = corners[(k + 1) % 4]
    const { P } = onWall(a, b)
    const s0 = PAV, s1 = 2 * M - PAV, n = 8, pitch = (s1 - s0) / n
    for (let i = 0; i < n; i++) {
      const s = s0 + (i + 0.5) * pitch
      const c = P(s, 0, -REC / 2)
      column(stone, stone, c[0], c[1], 0.62, Z.plinth, Z.col, { base: 0.5, cap: 0.55, seg: 10 })
      if (i < n - 1) {
        const sw = s + pitch / 2
        const wa = P(sw - 1.2, 0, -REC + 0.05), wb = P(sw + 1.2, 0, -REC + 0.05)
        tile.quad([wa[0], wa[1], 12.6], [wb[0], wb[1], 12.6], [wb[0], wb[1], 19.3], [wa[0], wa[1], 19.3])
      }
    }
    // the corner pavilions: a sunk tablet each
    for (const s of [PAV / 2, 2 * M - PAV / 2]) panel(stone, a, b, s - 2.6, s + 2.6, 12.0, 19.0, 0.12)
  }

  // ---- attic with white grilles, the terrace roof and its corner boxes
  walls(stone, rect(-A, -A, A, A), Z.cornice, Z.attic - 0.5)
  band(stone, rect(-A, -A, A, A), grow([-A, -A, A, A], 0.35), Z.attic - 0.5, Z.attic, 0.2)
  {
    const o = grow([-A, -A, A, A], 0.35), i = rect(-C, -C, C, C)
    for (let k = 0; k < 4; k++) { const j = (k + 1) % 4; lawn.quad([i[k][0], i[k][1], Z.attic], [o[k][0], o[k][1], Z.attic], [o[j][0], o[j][1], Z.attic], [i[j][0], i[j][1], Z.attic]) }
    // and over the cornice ledge round the attic
    const m = grow([-M, -M, M, M], 0.9), ai = rect(-A, -A, A, A)
    for (let k = 0; k < 4; k++) { const j = (k + 1) % 4; lawn.quad([ai[k][0], ai[k][1], Z.cornice], [m[k][0], m[k][1], Z.cornice], [m[j][0], m[j][1], Z.cornice], [ai[j][0], ai[j][1], Z.cornice]) }
  }
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const x0 = sx > 0 ? C + 0.6 : -A + 0.4, x1 = sx > 0 ? A - 0.4 : -C - 0.6
    const y0 = sy > 0 ? C + 0.6 : -A + 0.4, y1 = sy > 0 ? A - 0.4 : -C - 0.6
    box(stone, stone, [x0, y0, x1, y1], Z.attic, Z.attic + 1.9, 10)
  }
  for (let k = 0; k < 4; k++) {
    const a: XY = [[-A, -A], [A, -A], [A, A], [-A, A]][k] as XY, b: XY = [[A, -A], [A, A], [-A, A], [-A, -A]][k] as XY
    const { L } = onWall(a, b)
    const s0 = PAV - 0.7, s1 = L - PAV + 0.7, n = 8, pitch = (s1 - s0) / n
    for (let i = 0; i < n; i++) { const s = s0 + (i + 0.5) * pitch; panel(white, a, b, s - 1.35, s + 1.35, 23.7, 25.6, 0.05) }
    for (const s of [PAV / 2 - 0.7, L - PAV / 2 + 0.7]) panel(white, a, b, s - 1.8, s + 1.8, 23.7, 25.6, 0.05)
  }

  // ---- clerestory with seven windows a side, then the white cresting
  walls(stone, rect(-C, -C, C, C), Z.attic, Z.clere)
  for (let k = 0; k < 4; k++) {
    const a: XY = [[-C, -C], [C, -C], [C, C], [-C, C]][k] as XY, b: XY = [[C, -C], [C, C], [-C, C], [-C, -C]][k] as XY
    const { L } = onWall(a, b)
    for (let i = 0; i < 7; i++) { const s = 4.2 + i * (L - 8.4) / 6; panel(win, a, b, s - 0.7, s + 0.7, 28.0, 30.2, 0.05) }
  }
  const CR = C + 0.5
  band(white, rect(-C, -C, C, C), grow([-C, -C, C, C], 0.5), Z.clere, Z.crest, 0.35)
  // the cresting's antefix row, drawn as a thin crenellated band
  {
    const top = Z.crest + 0.6
    for (let k = 0; k < 4; k++) {
      const a: XY = [[-CR, -CR], [CR, -CR], [CR, CR], [-CR, CR]][k] as XY, b: XY = [[CR, -CR], [CR, CR], [-CR, CR], [-CR, -CR]][k] as XY
      const { P, L } = onWall(a, b)
      const n = 24, w = L / n
      for (let i = 1; i < n - 1; i++) {
        const s = (i + 0.5) * w
        const q = [P(s - w * 0.32, Z.crest, -0.25), P(s + w * 0.32, Z.crest, -0.25), P(s + w * 0.12, top, -0.25), P(s - w * 0.12, top, -0.25)]
        white.quad(q[0], q[1], q[2], q[3])
      }
    }
  }
  // corner acroteria: bold white blocks with a pointed top
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const cx = sx * (CR - 1.1), cy = sy * (CR - 1.1), h = 1.15
    const r = rect(cx - h, cy - h, cx + h, cy + h)
    walls(white, r, Z.crest, 35.6)
    const t: V3 = [cx, cy, 37.0]
    for (let i = 0; i < 4; i++) { const p0 = r[i], p1 = r[(i + 1) % 4]; poly(white, [[p0[0], p0[1], 35.6], [p1[0], p1[1], 35.6], t], [(p0[0] + p1[0]) / 2 - cx, (p0[1] + p1[1]) / 2 - cy, 0.5]) }
  }

  // ---- the pyramid roof, dark glazed tile, and the top ornament
  {
    const e = C + 0.2, z0 = Z.crest - 0.2
    const apexR = 1.0, apexZ = Z.apex - 0.74 * apexR
    const base: V3[] = rect(-e, -e, e, e).map(([x, y]) => [x, y, z0] as V3)
    const top: V3[] = rect(-apexR, -apexR, apexR, apexR).map(([x, y]) => [x, y, apexZ] as V3)
    const norms: XY[] = [[0, -1], [1, 0], [0, 1], [-1, 0]]
    for (let k = 0; k < 4; k++) { const j = (k + 1) % 4; poly(tile, [base[k], base[j], top[j], top[k]], [norms[k][0], norms[k][1], 1]) }
    cap(tile, rect(-apexR, -apexR, apexR, apexR), apexZ)
    // the ornament: a white pedestal with an urn-like top
    walls(white, rect(-1.0, -1.0, 1.0, 1.0), apexZ, Z.apex + 0.6)
    lathe(white, 0, 0, [[1.15, Z.apex + 0.6], [1.15, Z.apex + 1.0], [0.9, Z.apex + 1.4], [1.05, 48.6], [0.7, 49.6], [0.5, Z.orn - 0.2], [0, Z.orn]], 10)
  }

  // ---- the front: frontispiece with three doors, steps, lawn terraces
  {
    // the frontispiece projects 4.5 m from the main block, up to 8.2
    const pr: [number, number, number, number] = [-8.6, -27.5, 8.6, -M]
    box(stone, stone, pr, 0, 8.2)
    band(stone, rect(...pr), grow(pr, 0.25), 7.4, 8.2, 0.2)
    const fa: XY = [-8.6, -27.5], fb: XY = [8.6, -27.5]
    for (const s of [3.1, 8.6, 14.1]) {
      panel(door, fa, fb, s - 0.95, s + 0.95, 3.0, 6.3, 0.05)
      // a small pediment over each door, flush
      const { P } = onWall(fa, fb)
      poly(white, [P(s - 1.6, 6.6, 0.07), P(s + 1.6, 6.6, 0.07), P(s, 7.3, 0.07)], [0, -1, 0])
    }
    // the statue's pedestal on the porch roof
    box(stone, stone, [-1.0, -26.6, 1.0, -24.6], 8.2, 9.6, 10)
    // the flight up to the doors (from the walk at ~0.6 to the door level 3.0)
    const steps = 8
    for (let i = 0; i < steps; i++) {
      const z = 0.6 + ((i + 1) * 2.4) / steps, y1 = -27.5, y0 = -31.5 + (i * 4) / steps
      box(stone, stone, [-6.2, y0, 6.2, y1], 0, z, 13)
    }
    // the lawn terraces either side of the walk, on the front basement
    const T = 36.5, TY0 = -38.5, TY1 = -25, TZ = 5.8
    const terr: XY[] = [[-T, TY0], [-12, TY0], [-12, -31.5], [-8.6, -31.5], [-8.6, -27.5], [8.6, -27.5], [8.6, -31.5], [12, -31.5], [12, TY0], [T, TY0], [T, TY1], [-T, TY1]]
    wallsSplit(stone, terr, 0, TZ + 0.5)
    const inner = inset(terr, 0.6)
    walls(stone, [...inner].reverse(), TZ, TZ + 0.5)
    for (let k = 0; k < terr.length; k++) {
      const j = (k + 1) % terr.length
      stone.quad([terr[k][0], terr[k][1], TZ + 0.5], [terr[j][0], terr[j][1], TZ + 0.5], [inner[j][0], inner[j][1], TZ + 0.5], [inner[k][0], inner[k][1], TZ + 0.5])
    }
    cap(lawn, inner, TZ)
    // grilles along the terrace's outer faces
    const tf: [XY, XY][] = [[[-T, TY0], [-12, TY0]], [[12, TY0], [T, TY0]], [[T, TY0], [T, TY1]], [[-T, TY1], [-T, TY0]]]
    for (const [a, b] of tf) {
      const { L } = onWall(a, b), n = Math.max(1, Math.round(L / 4.5))
      for (let i = 0; i < n; i++) { const s = (i + 0.5) * L / n; panel(white, a, b, s - 0.6, s + 0.6, 2.0, 3.2, 0.05) }
    }
  }

  // centre the hall on its own spot relative to the outline's centroid
  shiftParts([stone, white, win, tile, door, lawn], 0.3, 5.8)

  const lit = (p: V3, n: V3) => {
    if (n[2] > 0.5) return 0.05
    if (p[2] < 5.5) return 0.15
    return p[2] > 32.5 ? 0.35 : n[1] < -0.7 ? 0.85 : 0.5
  }
  return [
    { part: stone, material: { ...finish('memorial-sandstone', 0xdccaa5), floodlight: lit } },
    { part: white, material: { ...PALETTE.trim, floodlight: (p: V3, n: V3) => (n[2] > 0.5 ? 0.1 : p[2] > 30 ? 0.7 : 0.4) } },
    { part: win, material: PALETTE.window },
    { part: tile, material: finish('memorial-tile', 0x59616c) },
    { part: door, material: PALETTE.entrance },
    { part: lawn, material: finish('terrace-green', 0x9cae94) },
  ]
}

if (import.meta.main) await save('pit-soldiers-and-sailors', 'Soldiers and Sailors Memorial Hall', [40.445047, -79.956436], 316.7, build() as any, 5000)
