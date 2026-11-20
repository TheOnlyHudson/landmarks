/**
 * Carl B. Stokes United States Courthouse (801 West Superior Avenue, 2002,
 * Kohn Pedersen Fox), on the bluff over the Cuyahoga, Cleveland:
 * procedural, CC0-1.0.
 * bun generators/cle-stokes-courthouse.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, bearing 0 (the plan has no
 * single axis: a quarter-round face to the river, straight faces to the
 * city). Origin at the centroid of OSM way/255085692 (-81.697290,
 * 41.496455). z = 0 is the lowest ground under the outline, at the river
 * side's south tip; Superior Avenue on the north side is ~16 m higher, so
 * the lower floors on that side sink into the hill.
 *
 * Identity, in order: the pale limestone tower whose river face is one
 * great convex curve (a circle 67.6 m in radius, fitted to OSM's outline)
 * meeting a long straight face toward Public Square; the tall slotted attic
 * at the top under a thin, dark, cantilevered roof ring that overhangs
 * every face and is open in the middle; the lower annex in the angle on
 * Superior with its own L-shaped canopy on piers.
 *
 * Evidence:
 *  - plan: OSM way/255085692 (outline) and way/333533686 (the tower part,
 *    height 130, 23 levels); the annex is the outline minus the part.
 *    Terminal Tower's ways are not touched.
 *  - heights: measured, USGS 3DEP OH_Statewide_Phase1_1_2019 (2019 flight),
 *    1 m grid, above z = 0: the roof ring's top 132.9, the open roof inside
 *    it 128.2, a small penthouse to 134.8; the annex's canopy 50.0, its roof
 *    43.2. The ring overhangs the walls by ~3.5-4 m on the curved and east
 *    faces (lidar edge against OSM). Published: 130 m, 23 storeys.
 *  - attic and facade: from Cards84664's view down from Terminal Tower
 *    (NE), THD3's and Mr.Z-man's from the street (N), Andy's from the river
 *    (SW), Lemay's of the curved face (SW) and Aivazovsky's (NE street): the
 *    slotted attic ~16 m tall. The facade is a pale limestone grid of
 *    punched windows (~3 m bays, 4.8 m storeys = 112 m / 23, estimated),
 *    drawn as one panel per two window columns spanning two storeys, with
 *    stone piers (2.4 m) and spandrels (3 m) between; the straight face's
 *    plain stone margins (~12% of its length each end, from Aivazovsky and
 *    Mr.Z-man) and its narrow-piered glazed centre, run up through the
 *    attic; the curved face's two-storey-high glazed band at about floors
 *    9-12 (Lemay), drawn as tall panels; the lobby glazing at the foot.
 *    Rework (facade only, Nov 2026): the earlier tall narrow window strips
 *    were replaced by this grid; massing, crown and placement unchanged.
 *  - colour: cream limestone; the roof ring grey metal, dark from below
 *    and pale from above (Cards84664), drawn between.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Carl_B_Stokes_Courthouse_2022.png, Cards84664, CC BY-SA 4.0 (from above, NE)
 *  - Carl_B._Stokes_Federal_Court_House_Building_(2018).jpg, Cards84664, CC BY-SA 4.0
 *  - CarlStokesFCH.jpg, THD3, CC BY-SA 3.0 (N, Superior)
 *  - Stokes_Courthouse.jpg, Mr.Z-man, CC BY-SA 3.0
 *  - Federal_Court_House.jpg, Andy from Pittsburgh, CC BY 2.0 (from the river, SW)
 *  - Carl_B._Stokes_United_States_Courthouse,_Cleveland,_OH_(28692186017).jpg,
 *    Warren LeMay, CC0 (curved face from the river side, SW)
 *  - Stokescourttower.jpg, Aivazovsky, CC BY-SA 3.0 (NE, from W. Superior)
 *  - Carl_B._Stokes_Federal_Courthouse.jpg, Andrew Bardwell, CC BY-SA 2.0 (N face)
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the lower floors of the river side (behind trees in every photo)
 * are drawn like the floors above; the statue and the entrance arch on
 * Superior are reduced to a stone arch; mullions and the attic's fins are
 * simplified to slots.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, inset, walls, cap, panel, block, rect, save } from './chi-field-museum'
import { archPanel, ringTop } from './cle-city-hall'

function build() {
  const stone = new Part(), trim = new Part(), win = new Part(), metal = new Part(), roof = new Part(), slot = new Part()

  // Tower plan, counter-clockwise: east edge, the straight face, north,
  // west, then the curved face round to the south tip.
  const CX = 28.81, CY = 24.01, R = 67.61
  const arc: XY[] = []
  for (let k = 0; k <= 12; k++) {
    const a = ((-170.5 + (k / 12) * (170.5 - 93.8)) * Math.PI) / 180
    arc.push([CX + R * Math.cos(a), CY + R * Math.sin(a)])
  }
  const T: XY[] = [[29.1, -43.0], [30.4, -17.2], [-11.1, 33.0], [-37.7, 36.5], ...arc]
  const ROOF = 128.2, ATTIC = 112.0, RING0 = 131.2, RING1 = 132.9

  walls(stone, T, 0, ROOF)
  cap(roof, inset(T, 0.4), ROOF)
  walls(trim, inset(T, -0.2), ATTIC - 1.4, ATTIC) // band under the attic
  // The roof ring: overhanging ~3.8 m, open ~6 m in.
  const out = inset(T, -3.8), inn = inset(T, 6.0)
  ringTop(metal, out, inn, RING1)
  for (let k = 0; k < out.length; k++) {
    const l = (k + 1) % out.length
    metal.quad([inn[k][0], inn[k][1], RING0], [inn[l][0], inn[l][1], RING0], [out[l][0], out[l][1], RING0], [out[k][0], out[k][1], RING0])
  }
  walls(metal, out, RING0, RING1)
  walls(metal, [...inn].reverse(), RING0, RING1)
  // Posts carrying the ring over the open roof, and the small penthouse.
  for (let k = 0; k < inn.length; k += 2) {
    const [x, y] = inset(T, 3.0)[k]
    block(stone, null, rect(x - 0.6, y - 0.6, x + 0.6, y + 0.6), ROOF, RING0, 0.1)
  }
  block(stone, roof, rect(-12, -8, 6, 8), ROOF, 134.8, 0.3)

  // Windows: the limestone grid of punched windows, drawn as one panel per
  // bay (two real window columns) spanning two storeys, with stone piers and
  // spandrels between. Storeys 4.8 m; groups on a common 9.6 m grid from
  // 5.2 m, each bay starting above its own ground (the site falls 16 m from
  // Superior to the river).
  const ANNEX_TOP = 43.2, G0 = 5.2, GH = 9.6, GTOP = ATTIC - 1.0
  const firstGroup = (g: number) => G0 + GH * Math.max(0, Math.ceil((g + 2.5 - G0) / GH))
  for (let i = 0; i < T.length; i++) {
    const a = T[i], b = T[(i + 1) % T.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (i === 1) {
      // The straight face toward the city: plain stone margins at both ends,
      // a glazed centre of narrow-piered bays running up through the attic.
      const m = 0.12 * L, n = 12, bw = (L - 2 * m) / n
      for (let q = 0; q < n; q++) {
        const s0 = m + q * bw + 0.6, s1 = m + (q + 1) * bw - 0.6
        for (let z = firstGroup(ANNEX_TOP); z + GH <= GTOP + 0.01; z += GH) panel(win, a, b, s0, s1, z + 0.9, z + GH - 0.9, 0.05)
        panel(win, a, b, s0, s1, ATTIC + 0.8, ROOF - 0.4, 0.05)
      }
      continue
    }
    const n = Math.max(1, Math.round(L / 5.6)), bw = L / n
    const court = i >= 5 && i <= 14 // the courtroom band across the curved face
    for (let q = 0; q < n; q++) {
      const s0 = q * bw + 1.2, s1 = (q + 1) * bw - 1.2
      const ym = a[1] + (b[1] - a[1]) * ((q + 0.5) / n)
      // the tall lobby glazing at the foot, where the ground leaves a part group
      const g = ground(ym), z1 = firstGroup(g)
      if (z1 - 1.5 - (g + 1.0) > 5) panel(win, a, b, s0 + 0.2, s1 - 0.2, g + 1.0, z1 - 1.5, 0.05)
      for (let z = z1; z + GH <= GTOP + 0.01; z += GH) {
        if (court && z > 40 && z < 46) {
          // two groups glazed as one tall bay
          panel(win, a, b, s0 + 0.2, s1 - 0.2, z + 1.5, z + 2 * GH - 1.5, 0.05)
          z += GH
          continue
        }
        panel(win, a, b, s0, s1, z + 1.5, z + GH - 1.5, 0.05)
      }
      // the attic's tall slots between its fins, two per bay
      const h = (s1 - s0) / 2
      panel(slot, a, b, s0 - 0.6, s0 + h - 0.4, ATTIC + 0.8, ROOF - 0.4, 0.05)
      panel(slot, a, b, s0 + h + 0.4, s1 + 0.6, ATTIC + 0.8, ROOF - 0.4, 0.05)
    }
  }
  // The entrance on Superior: a tall stone arch.
  {
    const a = T[2], b = T[3], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    archPanel(trim, a, b, L / 2 - 3.2, L / 2 + 3.2, 16.0, 26.0, 0.08)
    archPanel(win, a, b, L / 2 - 2.0, L / 2 + 2.0, 16.0, 26.0, 0.12)
  }

  // The annex in the angle on Superior, with its L-shaped canopy on piers.
  const A: XY[] = [[30.4, -17.2], [32.7, 27.9], [-11.1, 33.0]]
  walls(stone, A, 0, ANNEX_TOP)
  cap(roof, A, ANNEX_TOP)
  for (const [a, b] of [[A[0], A[1]], [A[1], A[2]]] as [XY, XY][]) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.round(L / 4.4), bw = L / n
    for (let q = 0; q < n; q++) for (const z of [18.6, 30.6]) panel(win, a, b, q * bw + 0.75, (q + 1) * bw - 0.75, z, z + 10.0, 0.05)
    // Piers along the outer edge, and the canopy over them.
    const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nrm: XY = [u[1], -u[0]]
    for (let q = 0; q <= Math.round(L / 6); q++) {
      const s = 1 + q * ((L - 2) / Math.round(L / 6)), x = a[0] + u[0] * s - nrm[0] * 0.8, y = a[1] + u[1] * s - nrm[1] * 0.8
      block(stone, null, rect(x - 0.5, y - 0.5, x + 0.5, y + 0.5), ANNEX_TOP, 49.2, 0.1)
    }
    const p0: XY = [a[0] + nrm[0] * 1.2, a[1] + nrm[1] * 1.2], p1: XY = [b[0] + nrm[0] * 1.2, b[1] + nrm[1] * 1.2]
    const q0: XY = [a[0] - nrm[0] * 4.0, a[1] - nrm[1] * 4.0], q1: XY = [b[0] - nrm[0] * 4.0, b[1] - nrm[1] * 4.0]
    const slab: XY[] = [p0, p1, q1, q0]
    block(metal, metal, orient(slab), 49.2, 50.0, 0.1)
  }

  return [
    { part: stone, material: finish('cle-stokes-limestone', 0xece6da) },
    { part: trim, material: finish('cle-stokes-limestone-trim', 0xf6f1e8) },
    { part: win, material: PALETTE.window },
    { part: slot, material: finish('cle-stokes-attic-slot', 0x6f7882) },
    { part: metal, material: finish('cle-stokes-roof-ring', 0x858c94) },
    { part: roof, material: PALETTE.roof },
  ]
}

/** The ground under the tower's walls above z = 0, from the map's terrain, by model y. */
function ground(y: number): number {
  const t: [number, number][] = [[-44, 0], [-30, 1.5], [-16, 4], [0, 10], [12, 12], [36, 16]]
  if (y <= t[0][0]) return t[0][1]
  for (let i = 1; i < t.length; i++) if (y <= t[i][0]) return t[i - 1][1] + (t[i][1] - t[i - 1][1]) * (y - t[i - 1][0]) / (t[i][0] - t[i - 1][0])
  return t[t.length - 1][1]
}

/** A ring turned counter-clockwise. */
function orient(r: XY[]): XY[] {
  const a = r.reduce((s, p, i) => { const q = r[(i + 1) % r.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0)
  return a < 0 ? [...r].reverse() : r
}

if (import.meta.main) await save('cle-stokes-courthouse', 'Carl B. Stokes United States Courthouse', [41.496455, -81.69729], 0, build())
