/**
 * The Roman Theatre, Amman (Philadelphia), 2nd century AD.
 *
 * One model (turned to bearing 346, so local +y is the way the theatre
 * faces, NNW toward the Hashemite Plaza; origin at the OSM outline's
 * centroid 35.939337 E, 31.951606 N, on the lowest ground, the orchestra):
 * the semicircular cavea as real stepped seating, 35 rows in three bands
 * (13, 12 and 10 rows) divided by two walkways (diazomata) with their
 * retaining walls, the orchestra's podium wall, the summa cavea wall at
 * the top, the two side wings with the vaulted side entrances (paradoi),
 * the stage front, and the scaenae frons remains: a podium with its row of
 * columns (some standing full height under Corinthian capitals, most broken
 * off) before the back wall with its three doorways.
 *
 * The hill the cavea is cut into is not modelled: the cavea's back is closed
 * by a plain curved wall at the outline, and its ends by plain walls, so it
 * stands tidy and sinks into the map's terrain on the uphill side.
 * The forum colonnade stands on the Hashemite Plaza outside the OSM outline
 * (t03, t05), so it is not part of this model.
 *
 * Sources (open only; no commercial imagery or 3D tiles):
 * - OSM (API map call, 2026-11-18): way/608094627 (amenity=theatre,
 *   building=yes, historic, 138-161 AD); its back arc fits a circle of
 *   46.5 m radius centred 18.2 m behind the outline's straight front, and
 *   the cavea ends are cut straight by the outline's side walls. The modern
 *   wooden stage way/1547977346 and the stage-front wall way/1547977343.
 * - Published: 6,000 seats, steeply raked, three horizontal sections
 *   (diazomata), oriented north, paradoi at ground level with rooms that
 *   house two museums (en.wikipedia, Roman Theatre (Amman)).
 * - Photos (Wikimedia Commons; all EVIDENCE):
 *   t01 "Roman theater of Amman 01.jpg", Bernard Gagnon, CC BY-SA 4.0: from
 *     the Citadel: the three bands, the walkways, the top wall, the wings,
 *     the stage area. The main reference.
 *   t02 "Amman - Roman Theatre seen from the Citadel.jpg", Alena Belova for
 *     Exhibo, CC BY-SA 4.0: the theatre in the hillside, far.
 *   t03 "Roman Theatre in Amman 0190.jpg", Dosseman, CC BY-SA 4.0: the stage
 *     front from the wing: column bases on the stage podium, the plaza.
 *   t04 "Roman Theatre in Amman 0151.jpg", Dosseman, CC BY-SA 4.0: the
 *     scaenae frons remains: podium, columns (one full height with its
 *     Corinthian capital, others broken), back wall, the east parados arch.
 *   t05 "Roman Forum from theatre in Amman 0197.jpg", Dosseman, CC BY-SA 4.0:
 *     the forum colonnade (outside the outline).
 * - Terrain: Mapterhorn (`tools/terrain.ts`, z12 here); no lidar or NAIP.
 * Look-only references: none.
 *
 * Numbers:
 * - Plan: OSM (cavea radius 46.5 m, centre, front line, side cuts), exact
 *   to the outline.
 * - Rows: tread 0.85 m, riser 0.55 m (a steep 33° rake, as published
 *   "steeply raked"); orchestra radius 12.5 m; walkways 1.6 m with 1.8 m
 *   walls; the summa cavea wall 3.5 m. Top of the seats 24 m, wall 27.5 m.
 *   Row counts and proportions from t01. Estimated.
 * - Wings 14 m at the cavea, 8 m toward the front (t01); scaenae frons
 *   podium 2.8 m, columns 0.9 m thick, full ones 8.5 m, the ruined back wall 6 m
 *   (t04, t01). Estimated.
 * - Colours from the photos, pulled to the palette: honey limestone
 *   #e0cfb6 for walls and columns (t04 sunlit #c1b2a2), the seats a little
 *   greyer #d8cdbf (t01); openings the palette's slate.
 *
 * Doubts:
 * - The radial stairs (scalae) between the seat wedges are drawn only as
 *   1.4 m strips of the paler stone across the rows (4 wedges in the lower
 *   band, 6 above, after t01), not as their half-height steps.
 * - The east wing's modern museum building and the west wing's exact
 *   heights are estimated from t01 only.
 * - Which columns of the scaenae frons stand full height is simplified to a
 *   regular pattern (every fourth), after t03 and t04.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { type Mat, type P2, box, cap, facade, lathe, oquad, walls, ccw, writeModel } from './medina-prophets-mosque'

export const ART = { lng: 35.939337, lat: 31.951606, bearing: 346 }

const O: P2 = [-0.4, 10.3] // the cavea's centre
const R_OUT = 46.5, X_W = -41.8, X_E = 38.5 // the outline's side cuts
const SEG = 18 // segments round the semicircle

function build(): Mat[] {
  const stone = new Part(), seat = new Part(), dark = new Part()

  // ---------------------------------------------------- the cavea rows ---
  // each step: [r inner, r outer, top z]
  const steps: { r0: number; r1: number; z: number; kind: 'row' | 'walk' }[] = []
  let r = 12.5, z = 1.1
  const band = (n: number) => { for (let i = 0; i < n; i++) { z += 0.55; steps.push({ r0: r, r1: r + 0.85, z, kind: 'row' }); r += 0.85 } }
  const walk = (wall: number, w: number) => { z += wall; steps.push({ r0: r, r1: r + w, z, kind: 'walk' }); r += w }
  // the podium round the orchestra, then three bands with two walkways
  steps.push({ r0: 12.0, r1: 12.5, z: 1.1, kind: 'walk' })
  band(13); walk(0, 1.6); z += 1.8 - 0.55; band(12); walk(0, 1.6); z += 1.8 - 0.55; band(10)
  steps.push({ r0: r, r1: R_OUT - 0.7, z, kind: 'walk' })
  steps.push({ r0: R_OUT - 0.7, r1: R_OUT, z: z + 3.5, kind: 'walk' }) // the summa cavea wall

  /** The angle range of a ring of radius rr, cut by the side walls. */
  const range = (rr: number): [number, number] => {
    const a0 = rr > O[0] - X_W ? Math.PI + Math.acos((O[0] - X_W) / rr) : Math.PI
    const a1 = rr > X_E - O[0] ? 2 * Math.PI - Math.acos((X_E - O[0]) / rr) : 2 * Math.PI
    return [a0, a1]
  }
  const P = (rr: number, a: number, zz: number): V3 => [O[0] + rr * Math.cos(a), O[1] + rr * Math.sin(a), zz]
  let zPrev = 0
  for (const st of steps) {
    const [a0, a1] = range(st.r1)
    const n = Math.max(4, Math.round((SEG * (a1 - a0)) / Math.PI))
    // breakpoints: the even segments, plus the edges of the radial stairs (scalae)
    // between the seat wedges, which read as pale lines in t01
    const aisle = (0.7 / ((st.r0 + st.r1) / 2))
    const cuts = new Set<number>(Array.from({ length: n + 1 }, (_, i) => a0 + ((a1 - a0) * i) / n))
    const centres = st.kind === 'row' ? (st.r0 < 25 ? [1, 2, 3] : [1, 2, 3, 4, 5]).map((k, _, arr) => Math.PI + (Math.PI * k) / (arr.length + 1)) : []
    for (const c of centres) if (c - aisle > a0 && c + aisle < a1) { cuts.add(c - aisle); cuts.add(c + aisle) }
    const bp = [...cuts].sort((p, q) => p - q)
    for (let i = 0; i + 1 < bp.length; i++) {
      const a = bp[i], b = bp[i + 1], m = (a + b) / 2
      if (b - a < 1e-6) continue
      const part = st.kind === 'row' && !centres.some((c) => Math.abs(m - c) < aisle) ? seat : stone
      // riser: facing the orchestra (toward the centre)
      if (st.z - zPrev > 1e-6) {
        const na: V3 = [-Math.cos(a), -Math.sin(a), 0], nb: V3 = [-Math.cos(b), -Math.sin(b), 0]
        part.tri(P(st.r0, a, zPrev), P(st.r0, b, zPrev), P(st.r0, b, st.z), [0, 0], [0, 0], [0, 0], [na, nb, nb])
        part.tri(P(st.r0, a, zPrev), P(st.r0, b, st.z), P(st.r0, a, st.z), [0, 0], [0, 0], [0, 0], [na, nb, na])
      }
      void m
      // tread
      oquad(part, P(st.r0, a, st.z), P(st.r0, b, st.z), P(st.r1, b, st.z), P(st.r1, a, st.z), [0, 0, 1])
    }
    // the ends: plain walls from the ground, at the cut angles
    for (const [ang, sgn] of [[a0, -1], [a1, 1]] as [number, number][]) {
      const t: V3 = [-Math.sin(ang) * sgn, Math.cos(ang) * sgn, 0]
      oquad(stone, P(st.r0, ang, 0), P(st.r1, ang, 0), P(st.r1, ang, st.z), P(st.r0, ang, st.z), t)
    }
    zPrev = st.z
  }
  // the cut sides: plain walls in the outline's side planes, stepped with the rows
  for (const [X, out] of [[X_W, -1], [X_E, 1]] as [number, number][]) {
    const dx = Math.abs(X - O[0])
    for (const st of steps) {
      if (st.r1 <= dx) continue
      const y0 = O[1] - (st.r0 > dx ? Math.sqrt(st.r0 * st.r0 - dx * dx) : 0)
      const y1 = O[1] - Math.sqrt(st.r1 * st.r1 - dx * dx)
      oquad(stone, [X, y0, 0], [X, y1, 0], [X, y1, st.z], [X, y0, st.z], [out, 0, 0])
    }
  }
  // the back: a plain curved wall down to the ground (the hill is the map's)
  {
    const [a0, a1] = range(R_OUT), n = SEG
    for (let i = 0; i < n; i++) {
      const a = a0 + ((a1 - a0) * i) / n, b = a0 + ((a1 - a0) * (i + 1)) / n, m = (a + b) / 2
      oquad(stone, P(R_OUT, a, 0), P(R_OUT, b, 0), P(R_OUT, b, zPrev), P(R_OUT, a, zPrev), [Math.cos(m), Math.sin(m), 0])
    }
  }

  // ------------------------------------------------------------ wings ---
  // west: tall block at the cavea, lower toward the front; east the same,
  // with the vaulted paradoi opening onto the orchestra (t01, t04)
  const wing = (x0: number, x1: number, innerIsEast: boolean) => {
    const tall: P2[] = [[x0, 4], [x1, 4], [x1, 16.5], [x0, 16.5]]
    for (let i = 0; i < 4; i++) {
      const A = tall[i], B = tall[(i + 1) % 4]
      const inner = (innerIsEast && i === 1) || (!innerIsEast && i === 3)
      // the inner face, toward the stage, with its arched parados (t04)
      facade(stone, dark, A, B, 0, 14, inner ? [{ s0: 4.2, s1: 8.2, zb: 0, zs: 3.6, head: 'round', depth: 1.5 }] : [], { seg: 8 })
    }
    cap(stone, tall, 14, true)
    const low: P2[] = [[x0, 16.5], [x1, 16.5], [x1, 28.4], [x0, 28.4]]
    for (let i = 0; i < 4; i++) {
      if (i === 0) continue // against the tall block
      const A = low[i], B = low[(i + 1) % 4], L = Math.hypot(B[0] - A[0], B[1] - A[1])
      facade(stone, dark, A, B, 0, 8, i === 2 ? [0.3, 0.7].map((f) => ({ s0: L * f - 0.8, s1: L * f + 0.8, zb: 3.2, zs: 5.0, head: 'round' as const, depth: 0.5 })) : [], { seg: 6 })
    }
    cap(stone, low, 8, true)
  }
  wing(-46.5, -28, true)
  wing(26, 46, false)

  // ----------------------------------------------------- stage, frons ---
  // the stage front (pulpitum) on the line of way/1547977343, with niches
  facade(stone, dark, [-26, 16.5], [26, 16.5], 0, 1.5, [-21, -14, -7, 0, 7, 14, 21].map((c) => ({ s0: c + 26 - 1.0, s1: c + 26 + 1.0, zb: 0.2, zs: 0.9, head: 'round' as const, depth: 0.5 })), { seg: 6 })
  box(stone, -26, 26, 16.5, 23, 1.49, 1.5) // a thin cap so the stage edge reads
  // scaenae frons: podium with columns, then the back wall with three doors
  box(stone, -26, 26, 23, 26.4, 0, 2.8)
  for (let i = 0; i < 13; i++) {
    const cx = -24 + i * 4, full = i % 4 === 1
    const h = full ? 8.5 : [1.6, 2.6, 1.2, 3.4][i % 4]
    lathe(stone, cx, 24.6, [[0.75, 2.8], [0.75, 3.2], [0.45, 3.4], [0.45, 2.8 + h - (full ? 1.0 : 0)], ...(full ? [[0.75, 2.8 + h] as P2, [0.75, 2.8 + h + 0.25] as P2] : [[0.45, 2.8 + h] as P2]), [0, 2.8 + h + (full ? 0.25 : 0)]], 8, { smooth: true })
  }
  // an architrave piece over the two columns that still carry one (t04)
  box(stone, -21.0, -15.0, 24.0, 25.2, 11.3, 12.2)
  // back wall, facing the cavea, with the royal door and two side doors
  facade(stone, dark, [-26, 26.4], [26, 26.4], 0, 6.0, [
    { s0: 26 - 1.6, s1: 26 + 1.6, zb: 2.8, zs: 4.2, head: 'round', depth: 2.0 },
    { s0: 26 - 14.2, s1: 26 - 11.8, zb: 2.8, zs: 4.0, head: 'round', depth: 2.0 },
    { s0: 26 + 11.8, s1: 26 + 14.2, zb: 2.8, zs: 4.0, head: 'round', depth: 2.0 },
  ], { seg: 8 })
  oquad(stone, [26, 28.4, 0], [-26, 28.4, 0], [-26, 28.4, 6.0], [26, 28.4, 6.0], [0, 1, 0])
  cap(stone, [[-26, 26.4], [26, 26.4], [26, 28.4], [-26, 28.4]], 6.0, true)

  const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.25 : 0.8)
  return [
    { part: stone, material: { ...finish('amman-honey-limestone', 0xe0cfb6), floodlight: lit } },
    { part: seat, material: { ...finish('amman-theatre-seats', 0xd8cdbf), floodlight: lit } },
    { part: dark, material: PALETTE.window },
  ]
}

if (import.meta.main) {
  await writeModel('amman-roman-theatre.glb', 'Roman Theatre, Amman', build(), 6500, 250_000)
}
