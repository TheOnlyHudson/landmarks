/**
 * One Woodward Avenue (formerly the Michigan Consolidated Gas Company
 * Building, Detroit, 1962, Minoru Yamasaki) — original procedural geometry,
 * CC0-1.0.
 * bun generators/det-one-woodward.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/69000331,
 * 42.3289108,-83.0454709. Its walls run at 329.9° / 59.9°, so the catalog
 * bearing is 329.9 and the square tower is square to this frame; -y faces
 * Jefferson Avenue and the river.
 *
 * Identity, in order: a plain white square slab; each face divided into
 * four broad bays by bold marble piers running from the ground to the top;
 * the bays filled with tall, narrow, close-set windows; the top storeys a
 * screen of fins with no glass; a two-storey glass lobby set back behind
 * the piers at the foot; a narrower penthouse clad in the same fins
 * standing in the middle of the roof.
 *
 * Evidence:
 *  - plan: OSM outline, 39 × 38 m (published 128 × 128 ft footprint is
 *    the same within a metre or so). Lidar footprint is ~1 m south of the
 *    outline; the model keeps the outline.
 *  - lidar: USGS_LPC_MI_WayneCo_2017_LAS_2018 (flown 2017), 1 m grid, read
 *    in this frame (street ~1.8 m above the reference): roof 114 m,
 *    parapet 116 m; penthouse x -10..10, y -10..8, to 131 m.
 *  - published: 32 storeys, 131 m (Wikipedia; OSM 130).
 *  - photos: four bays to a face, pier width (~1.6 m), lobby height
 *    (~8 m, two storeys) and set-back (~2.5 m), the fin screen over the top
 *    ~3 storeys, the penthouse's width (about half the face) and its fins
 *    (Chris Woodrich's telephoto of the tops and the 2025 view from Windsor).
 *  - colour: white marble (`ow-marble`, a cool white pulled to the
 *    palette); window slots palette window; the screen's shadowed slots a
 *    grey (`roof`).
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - One_Woodward_Avenue,_Detroit,_Michigan,_2025-07-05.jpg, Crisco 1492,
 *    CC BY-SA 4.0 (south face from Windsor)
 *  - Michigan_Consolidated_Gas_Company_Building_Detroit_MI.jpg, Andrew
 *    Jameson, CC BY-SA 3.0 (two faces from the south-east)
 *  - OneWoodwardAvenue_base.jpg, Ken Lund, CC BY-SA 2.0 (the lobby)
 *  - Pinnacles_of_Guardian_Building,_One_Woodward_Avenue,_and_Hudson's_
 *    Detroit,_Detroit,_Michigan,_2025-08-01.jpg, Chris Woodrich (Crisco
 *    1492), CC BY-SA 4.0 (the penthouse)
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the windows are drawn as six slots a bay over two storeys,
 * against about seven a bay a storey in reality, so they read at phone
 * size without shimmering. The bank's rooftop sign is left out.
 *
 * Left out: the pointed-arch heads of the window slots, the fins' spiky
 * tops, the sign, the plaza and its sculpture, the skyway.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { block, cap, inset, panel, rect, rows, save, walls, type XY } from './chi-aon-center'

function build() {
  const marble = new Part(), win = new Part(), roof = new Part(), lobby = new Part()

  const H = 19.3 // half the face (39 × 38 m outline, made square)
  const HY = 19.1
  const ROOF = 114, PARAPET = 116, LOBBY = 8, SCREEN = 104.5
  const PIER = 1.6, DEPTH = 0.7 // pier width; how far the piers stand proud of the bays

  const faces: [XY, XY][] = [[[-H, -HY], [H, -HY]], [[H, -HY], [H, HY]], [[H, HY], [-H, HY]], [[-H, HY], [-H, -HY]]]

  // the shaft's bays sit DEPTH behind the face; the piers carry the face line
  const shaft = rect(-H + DEPTH, -HY + DEPTH, H - DEPTH, HY - DEPTH)
  walls(marble, shaft, LOBBY, PARAPET - 0.4)
  walls(marble, shaft, PARAPET - 0.4, PARAPET, inset(shaft, 0.3))
  cap(roof, inset(shaft, 0.3), ROOF)
  // parapet's inner face down to the roof
  walls(marble, [...inset(shaft, 0.3)].reverse(), ROOF, PARAPET)
  // the glass lobby, set back
  const lob = rect(-H + 2.6, -HY + 2.6, H - 2.6, HY - 2.6)
  walls(lobby, lob, 0, LOBBY)
  // soffit over the lobby
  {
    const o = shaft, i = lob
    for (let k = 0; k < 4; k++) {
      const l = (k + 1) % 4
      marble.quad([i[k][0], i[k][1], LOBBY], [i[l][0], i[l][1], LOBBY], [o[l][0], o[l][1], LOBBY], [o[k][0], o[k][1], LOBBY])
    }
  }

  // piers: five to a face (two at the corners), full height, standing proud
  for (const [a, b] of faces) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
    for (let k = 0; k <= 4; k++) {
      const s = k === 0 ? PIER / 2 : k === 4 ? L - PIER / 2 : (k * L) / 4
      if (k === 0) continue // the corner pier is the previous face's last
      const c: XY = [a[0] + u[0] * s, a[1] + u[1] * s]
      const half = PIER / 2
      const p: XY[] = [
        [c[0] - u[0] * half, c[1] - u[1] * half],
        [c[0] + u[0] * half, c[1] + u[1] * half],
        [c[0] + u[0] * half - n[0] * (k === 4 ? PIER : DEPTH + 0.2), c[1] + u[1] * half - n[1] * (k === 4 ? PIER : DEPTH + 0.2)],
        [c[0] - u[0] * half - n[0] * (k === 4 ? PIER : DEPTH + 0.2), c[1] - u[1] * half - n[1] * (k === 4 ? PIER : DEPTH + 0.2)],
      ]
      const area = p.reduce((acc, q, i) => { const r = p[(i + 1) % 4]; return acc + q[0] * r[1] - r[0] * q[1] }, 0)
      block(marble, marble, area > 0 ? p : [...p].reverse(), 0, PARAPET + 0.3, 0.2)
    }
  }

  // window slots in the bays, and the fin screen at the top
  const groups = rows(LOBBY + 1.2, SCREEN - 0.6, 12, 0.9)
  for (const [a0, b0] of faces) {
    // the bay wall, DEPTH behind the face
    const L0 = Math.hypot(b0[0] - a0[0], b0[1] - a0[1]), u: XY = [(b0[0] - a0[0]) / L0, (b0[1] - a0[1]) / L0], n: XY = [u[1], -u[0]]
    const a: XY = [a0[0] - n[0] * DEPTH, a0[1] - n[1] * DEPTH], b: XY = [b0[0] - n[0] * DEPTH, b0[1] - n[1] * DEPTH]
    for (let bay = 0; bay < 4; bay++) {
      const s0 = (bay * L0) / 4 + (bay === 0 ? PIER : PIER / 2) + 0.5
      const s1 = ((bay + 1) * L0) / 4 - (bay === 3 ? PIER : PIER / 2) - 0.5
      const k = 6, pitch = (s1 - s0) / k, w = pitch * 0.58
      for (let q = 0; q < k; q++) {
        const c = s0 + (q + 0.5) * pitch
        for (const [z0, z1] of groups) panel(win, a, b, c - w / 2, c + w / 2, z0, z1, 0.05)
        panel(roof, a, b, c - w * 0.35, c + w * 0.35, SCREEN + 0.6, PARAPET - 1.2, 0.05)
      }
    }
  }

  // the penthouse: the same fins on a narrower block
  const ph = rect(-10, -9.5, 10, 9.5)
  walls(marble, ph, ROOF, 131 - 0.4)
  walls(marble, ph, 130.6, 131, inset(ph, 0.3))
  cap(roof, inset(ph, 0.3), 131)
  for (let i = 0; i < 4; i++) {
    const a = ph[i], b = ph[(i + 1) % 4], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const k = Math.round(L / 1.6)
    for (let q = 0; q < k; q++) {
      const c = (q + 0.5) * (L / k)
      panel(roof, a, b, c - 0.35, c + 0.35, PARAPET + 0.8, 129.8, 0.05)
    }
  }

  return [
    { part: marble, material: finish('ow-marble', 0xf1efe9) },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    // the lobby glazing reads dark grey-green by day; named `entrance` so it glows at night
    { part: lobby, material: { ...PALETTE.entrance, color: 0x8b9aa3 } },
  ]
}

if (import.meta.main) await save('det-one-woodward', 'One Woodward Avenue', [42.3289108, -83.0454709], 329.9, build(), 5000)
