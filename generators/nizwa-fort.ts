/**
 * Nizwa Fort, Nizwa (the great round tower, 1650s-1670s, Imam Sultan bin
 * Saif al-Ya'arubi, on the older castle): procedural, CC0-1.0.
 * bun generators/nizwa-fort.ts
 *
 * Uses the shared kit exported by muscat-sultan-qaboos-grand-mosque.ts.
 *
 * Frame: bearing 0. Authored in an OSM-local frame (origin 57.5300 E,
 * 22.9332 N); the anchor is the centroid of the fort's OSM outline
 * (way/131222068), 57.5300402, 22.9331982, at (4.1, -0.2) in it.
 *
 * Plan (OSM, measured): the round tower (way/269171324, man_made=tower) a
 * 42 m circle centred at (29.4, 5.8); the castle west of it inside the fort
 * outline (way/131222068), x -42..29, y -40..31. The castle's layout is
 * read from the fort's own relief model on site (c07, a photo of it; the
 * relief is a 1995 museum piece and is used only for the arrangement) and
 * from photos: the high north range along the north wall with the square
 * keep at its east end by the tower (c20, c39), a west range with a corner
 * tower, an open courtyard between, the walled south yard with the
 * bastion OSM draws at its south point and the gate block south-west of
 * the tower (c22).
 *
 * Heights. Published: the tower about 30 m high and 36 m across (Ministry
 * of Heritage and Tourism; Wikipedia gives 36 m diameter, 30 m height).
 * OSM's 42 m circle includes the stone plinth at the foot (c22), so
 * the wall body takes the published 36 m: a 1.1 m plinth to OSM's 20.6 m
 * radius, then a gentle taper from 18.9 m to 18.0 m at the top (lead
 * review round 1: a near-square silhouette, no skirt) (c22 shows the lower
 * third flaring), a string course at 20.3, the parapet top 29 and its
 * merlons to 30. On top (c54, c31): an open court sunk to 21.5 m inside an
 * inner wall with arched gun niches, a walkway ring at 27 m, the parapet
 * pierced by small round-headed embrasures, the little block in the court
 * and the flagpole, about 17 m above the parapet (c03). Castle (photo-scaled against the tower in c39 and c20):
 * north range 14 m, keep 21 m, west range 11 m, corner tower 15 m, south
 * walls 9 m, the gate block 10 m, the bastion 11 m; crenellation with
 * pointed, rounded merlons (Omani) on every roof edge.
 *
 * Colour: sarooj plaster #d9c4b2, a desaturated pinkish grey-beige (c22,
 * the most neutral light, #beb9b3; c54 sunlit #c4a781; c48 in low sun
 * #a27459 is warmer than the material), pulled to the palette's
 * lightness (lead review round 1: less yellow, slightly pink); shade #a69281 in niches and embrasures;
 * windows the palette's slate (wooden screens); doors wood. Night: the
 * tower and walls are floodlit warm (c14, c39), so the plaster carries
 * _FLOODLIGHT.
 *
 * Photos (EVIDENCE, Wikimedia Commons):
 * - c22 "Nizwa, forte, esterno, corpo circolare 02", Francesco Bini, CC BY-SA 4.0 (tower from the south-east, gate block)
 * - c20 "Nizwa, forte, esterno, 01,0", Francesco Bini, CC BY-SA 4.0 (north range and keep from the courtyard)
 * - c54 "Nizwa Fort Main Tower (41505471734)", Hans Birger Nilsen, CC BY-SA 2.0 (the tower's top court)
 * - c31 "Nizwa Fort, Oman 2024 7", dconvertini, CC BY-SA 4.0 (tower top)
 * - c48 "Nizwa Fort, Oman 2024 18", dconvertini, CC BY-SA 4.0 (tower)
 * - c39 "Oman, Nizwa, Fort Nizwa (at night)", Dr. Thomas Liptak, CC BY-SA 4.0 (castle court and keep)
 * - c10 "Nizwa Fort (8729892924)", Francisco Anzola, CC BY 2.0 (tower and street walls)
 * - c45 "Nizwa Fort, Oman (4324819262)", yeowatzup, CC BY 2.0 (parapet)
 * - c03 "Nizwa (11)", Andries Oudshoorn, CC BY-SA 2.0 (distant, proportions, flagpole)
 * - c07 "Nizwa Fort (01)", Ji-Elle, CC BY-SA 3.0 (the site's relief model: layout only)
 * Facts: https://en.wikipedia.org/wiki/Nizwa_Fort
 * Look-only: none.
 *
 * Doubts: the castle's internal ranges and their heights are simplified to
 * a few blocks from the relief model and oblique photos; the tower's
 * staircases and the courtyard well are left out; the batter is estimated.
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import {
  bays, box, lathe, merlons, panel, plane, prism, quad, setShift, wallBand, flip, TAU,
  type Plane, type P2, type Opening,
} from './muscat-sultan-qaboos-grand-mosque'

type Mats = { plaster: Part; shade: Part; win: Part; door: Part }
const TX = 29.4, TY = 5.8 // tower centre

/** Faces of a convex ring (counter-clockwise) as outward planes: [plane, length]. */
function ringFaces(ring: P2[]): [Plane, number][] {
  return ring.map((A, i) => {
    const B = ring[(i + 1) % ring.length]
    const L = Math.hypot(B[0] - A[0], B[1] - A[1]), t: P2 = [(B[0] - A[0]) / L, (B[1] - A[1]) / L]
    return [plane(A, t, [t[1], -t[0]]), L] as [Plane, number]
  })
}

/** A crenellated block over a convex ring; `win` puts a row of small screened windows on faces longer than 6 m. */
function block(M: Mats, D: boolean, ring: P2[], H: number, o: { win?: number[]; skip?: number[] } = {}) {
  prism(null, M.plaster, ring, 0, H)
  ringFaces(ring).forEach(([pl, L], i) => {
    const ops: Opening[] = D && L > 6 && o.win
      ? o.win.flatMap((z) => bays(0, L, Math.max(1, Math.round(L / 5)), (c) => ({ c, hw: 0.55, zb: z, crown: z + 1.3, flat: true, depth: 0.35, back: M.win })))
      : []
    // two window rows need two bands
    const rows = [...new Set(ops.map((q) => q.zb))].sort((a, b) => a - b)
    let z = 0
    for (const r of rows) {
      const top = r + 2.4
      wallBand(M.plaster, M.shade, pl, 0, L, z, Math.min(top, H), ops.filter((q) => q.zb === r), 4)
      z = Math.min(top, H)
    }
    if (z < H) wallBand(M.plaster, M.shade, pl, 0, L, z, H, [], 4)
    if (!D && L > 6 && o.win) for (const q of bays(0, L, Math.max(1, Math.round(L / 9)), (c) => ({ c, hw: 0, zb: 0, crown: 0, depth: 0 }))) panel(M.win, pl, q.c, o.win[o.win.length - 1], 1.1, 1.3, 'flat')
    if (!o.skip?.includes(i)) merlons(M.plaster, pl, 0, L, H, D ? 1.25 : 1.4, D ? 0.85 : 1.1, D ? 1.6 : 4.0, 0.5, D, true)
  })
}

/** A thin crenellated wall along A-B, t thick. */
function wall(M: Mats, D: boolean, A: P2, B: P2, t: number, H: number) {
  const L = Math.hypot(B[0] - A[0], B[1] - A[1]), u: P2 = [(B[0] - A[0]) / L, (B[1] - A[1]) / L], v: P2 = [u[1] * t / 2, -u[0] * t / 2]
  const ring: P2[] = [[A[0] - v[0], A[1] - v[1]], [B[0] - v[0], B[1] - v[1]], [B[0] + v[0], B[1] + v[1]], [A[0] + v[0], A[1] + v[1]]]
  block(M, D, ring, H, { skip: [1, 3] })
}

/** The round tower. */
function tower(M: Mats, D: boolean) {
  const n = D ? 64 : 28
  const P = M.plaster
  // battered drum with its string course, up to the parapet top
  lathe(P, TX, TY, [[20.6, 0], [20.6, 1.1], [18.9, 1.1], [18.75, 6], [18.5, 13], [18.3, 20.1], [18.5, 20.3], [18.3, 20.5], [18.0, 29], [17.0, 29]], n, {})
  // parapet inside face, with real embrasures in the detail model
  const nf = D ? 56 : 0
  if (D) {
    const R = 17.0, ap = R * Math.cos(Math.PI / nf), fw = 2 * R * Math.sin(Math.PI / nf)
    for (let i = 0; i < nf; i++) {
      const t = (TAU * (i + 0.5)) / nf
      // inward-facing facet: normal points to the centre
      const pl = plane([TX + ap * Math.cos(t), TY + ap * Math.sin(t)], [Math.sin(t), -Math.cos(t)], [-Math.cos(t), -Math.sin(t)])
      wallBand(P, M.shade, pl, -fw / 2, fw / 2, 27, 29, [{ c: 0, hw: 0.32, zb: 27.4, crown: 28.6, round: true, depth: 1.15, back: M.shade }], 4)
    }
  } else lathe(P, TX, TY, [[17.0, 29], [17.0, 27]], n, {})
  // merlons on the rim, one per facet
  const nm = D ? 58 : 42, Rm = 17.95
  for (let i = 0; i < nm; i++) {
    const t = (TAU * i) / nm, fw = 2 * Rm * Math.sin(Math.PI / nm)
    const pl = plane([TX + Rm * Math.cos(t), TY + Rm * Math.sin(t)], [-Math.sin(t), Math.cos(t)], [Math.cos(t), Math.sin(t)])
    merlons(P, pl, -fw / 2, fw / 2, 29, D ? 1.1 : 1.3, D ? 0.95 : 1.6, fw, 0.6, D, true)
  }
  // walkway ring, the inner wall down to the sunk court, its gun niches, the court floor
  lathe(P, TX, TY, [[17.0, 27], [15.5, 27], [15.5, 21.5], [0, 21.5]], n, {})
  if (D) for (let i = 0; i < 16; i++) {
    const t = (TAU * (i + 0.5)) / 16, r = 15.45
    panel(M.shade, plane([TX + r * Math.cos(t), TY + r * Math.sin(t)], [Math.sin(t), -Math.cos(t)], [-Math.cos(t), -Math.sin(t)]), 0, 21.5, 1.6, 2.6, 'round', 4)
  }
  // the block in the court and the flagpole (c54, c22)
  box(P, P, TX - 6.5, TX + 6.5, TY - 2.4, TY + 2.4, 21.5, 24.4)
  lathe(P, TX + 9, TY - 4, [[0.3, 21.5], [0.13, 46], [0, 46.1]], D ? 6 : 4, {})
  // loopholes round the drum
  const nl = D ? 18 : 0
  for (let i = 0; i < nl; i++) {
    const t = (TAU * i) / nl
    for (const [z, r] of [[23, 18.24], [13.8, 18.53]] as [number, number][]) {
      if (z < 20 && i % 2) continue
      panel(M.shade, plane([TX + r * Math.cos(t), TY + r * Math.sin(t)], [-Math.sin(t), Math.cos(t)], [Math.cos(t), Math.sin(t)]), 0, z, 0.9, 0.9, 'flat')
    }
  }
}

function build(D: boolean): Mats {
  setShift(4.1, -0.2)
  const M: Mats = { plaster: new Part(), shade: new Part(), win: new Part(), door: new Part() }
  tower(M, D)
  // north range along the north wall (c20), the keep at its east end, the link to the tower
  block(M, D, [[-41.9, 12], [-4, 12], [-4, 27.1], [-10.1, 26.4], [-41.9, 23.7]], 14, { win: [6.2, 10.2] })
  block(M, D, [[-4, 12.5], [8, 12.5], [8, 27.8], [-4, 27.1]], 21, { win: [15.2] })
  block(M, D, [[8, 19], [18, 21.5], [30.6, 26.7], [30.2, 31.4], [8, 28.6]], 12)
  // west range and its corner tower
  block(M, D, [[-41.6, -13.6], [-26, -13.6], [-26, 12], [-41.6, 12]], 11, { win: [5.5] })
  block(M, D, [[-41.9, -13.6], [-33, -13.6], [-33, -5], [-41.9, -5]], 15, { win: [9.5] })
  // the gate block south-west of the tower (c22): a pointed gate on its south face
  {
    const ring: P2[] = [[9, -32.5], [28.9, -31.9], [28.6, -16], [9, -16]]
    block(M, D, ring, 10, { skip: [1] })
    const pl = plane([9, -32.5], [1, 0.03], [0.03, -1])
    wallBand(M.plaster, M.shade, plane([pl.o[0], pl.o[1] - 0.05], pl.t, pl.n), 10, 14, 0, 6.4, [{ c: 12, hw: 1.5, zb: 0, crown: 5.4, depth: 1.6, back: M.shade, door: { part: M.door, h: 3.4 } }], D ? 6 : 3)
  }
  // south yard: walls and the bastion OSM draws at its south point
  for (const [a, b] of [
    [[-26, -13.6], [-21.2, -20.6]], [[-21.2, -20.6], [-20.4, -34.5]], [[-20.4, -34.5], [-7.7, -33.8]],
    [[0, -33.8], [9, -33.4]], [[-26, -13.6], [-21, -13.6]],
  ] as [P2, P2][]) wall(M, D, a, b, 2.2, 9)
  block(M, D, [[-7.7, -40.2], [0, -39.5], [0, -32.6], [-7.7, -32.6]], 11)
  return M
}

const lit = (p: V3, n: V3) => (n[2] > 0.8 ? 0.2 : p[2] > 18 ? 0.6 : 0.85)
function materials(M: Mats): Array<{ part: Part; material: MaterialSpec }> {
  return [
    { part: M.plaster, material: { ...finish('nizwa-sarooj', 0xd9c4b2), floodlight: lit } },
    { part: M.shade, material: { ...finish('nizwa-shade', 0xa69281), floodlight: () => 0.5 } },
    { part: M.win, material: PALETTE.window },
    { part: M.door, material: { ...PALETTE.entrance, color: 0x7a5236 } },
  ]
}

async function write(file: string, parts: Array<{ part: Part; material: MaterialSpec }>, maxTris: number, maxBytes: number) {
  const triangles = parts.reduce((t, { part }) => t + part.triangles, 0)
  const glb = writeGlb('Nizwa Fort', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor', bearing: 0, elevation: 0, height: 46.1,
  })
  console.log(`${file}: ${triangles} triangles, ${glb.length} bytes`)
  if (triangles > maxTris) throw new Error(`${file}: triangle budget exceeded: ${triangles}`)
  if (glb.length > maxBytes) throw new Error(`${file}: size budget exceeded: ${glb.length} bytes`)
  await Bun.write(new URL(`../models/${file}`, import.meta.url).pathname, glb)
}

if (import.meta.main) {
  await write('nizwa-fort.detail.glb', materials(build(true)), 40_000, 1536 * 1024)
  await write('nizwa-fort.glb', materials(build(false)), 5000, 250 * 1024)
}
