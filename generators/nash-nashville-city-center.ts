/**
 * Nashville City Center (511 Union Street; the "First Horizon" tower),
 * Nashville (1988) — original procedural geometry, CC0-1.0.
 * bun generators/nash-nashville-city-center.ts [out.glb]
 * (Uses the small kit exported by generators/nash-pinnacle.ts.)
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground under the footprint. Anchor = area centroid of the OSM
 * outline way/130913036 (36.1639160, -86.7817157). Bearing 62.4°: the
 * straight north-east face (on Union Street's side) is square to +y.
 *
 * The brief expected a gabled crown with stepped setbacks. The photos show
 * otherwise: the tower rises straight up from a wedge-shaped plan, with
 * small stepped notches down its north-west and south-west corners, a
 * broad curved prow on the south-east, and a flat top whose pale stone
 * parapet rises from the north-west end toward the curved prow, so the
 * roofline sweeps upward over the curve (Soloviev's and Wobbanight's
 * photos). That swept, sloping top over the curve is its crown, and is
 * drawn as a sloping roof plane cut through the walls.
 *
 * What makes it recognisable, each drawn as plain geometry:
 * - the curved south-east prow and the sloping, swept-up parapet over it;
 * - pale cream stone with long horizontal window ribbons running unbroken
 *   round the corners and the prow: drawn as continuous dark ribbons, one
 *   per two storeys (so half as many bands as floors, no per-floor
 *   pinstripe), with white stone bands between them;
 * - the stepped notches on the north-west and south-west corners (OSM);
 * - a recessed glass ground floor behind round-ish stone columns.
 *
 * Evidence
 * - OSM: outline way/130913036 (building, 27 levels, height 122, wikidata
 *   Q6966961), used as drawn for the plan.
 * - Lidar: USGS 3DEP TN_DavidsonCo_1_2022 (2022 flight), 0.5 m grid, read in
 *   this frame. Heights above the lowest ground under the footprint (the
 *   north-east side; the south side is ~3 m higher). Measured: roof 105 m,
 *   parapet 101 m at the north-west end, 107 m mid-way along the north-east
 *   face, 110-111 m over the prow (the highest returns). The lidar footprint
 *   matches OSM within a metre.
 * - Published: 122.5 m (402 ft), 27 floors, 1988 (Wikipedia, "List of
 *   tallest buildings in Nashville"; OSM height 122). The lidar's highest
 *   roof is 111 m above the low side; the published figure probably counts
 *   mechanical screens or a lower datum. The lidar is used.
 * - Photos (Wikimedia Commons), all EVIDENCE:
 *   Nashville City Center tower.jpg, Quintin Soloviev, CC BY 4.0 (the curved
 *     prow and the swept parapet, from a tower to the south-east);
 *   Nashville City Center Tower.jpg, Brichar60, CC BY-SA 4.0 (from the
 *     west: the stepped notched corners, the flat faces);
 *   Nashville City Center 1.jpg, Wobbanight, CC0 (the curved prow from the
 *     street, the base colonnade).
 *   No look-only sources were used. No commercial imagery.
 * - Colours from those photos, pulled to the palette: cream-white stone
 *   (warm, a little greyer than trim), blue-grey reflective ribbons.
 * - Night: office ribbons glow (window).
 *
 * Estimated: the parapet slope (a plane from 101 m at the north-west end to
 * 111 m at the prow, fitted to the lidar parapet and the photo's sweep);
 * the window share of each band (5.1 m of glass in each 7.7 m pair of storeys); the base (8.5 m, with columns 3 m apart).
 * Left out: the First Horizon signs, the dark glass slot at the prow's
 * north-east end, mullions.
 * Doubts: the published 122 m against the lidar's 111 m (above).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, at, ccw, bevel, outN, triangulate, save, type Layer } from './nash-pinnacle'

function build(): Layer[] {
  const stone = new Part(), win = new Part(), roof = new Part(), lobby = new Part()

  // The OSM outline in this frame (bearing 62.4°, origin at its centroid).
  const ring: XY[] = ccw(bevel([
    [-22.2, -25.2], [-21.6, -26.6], [-11.5, -21.7], [-10.9, -22.9], [0.0, -17.5], [0.7, -18.7], [13.8, -12.2],
    [17.1, -10.5], [19.7, -8.8], [22.2, -6.6], [24.5, -4.0], [25.2, -3.0], [26.6, -0.5], [27.8, 2.3], [28.6, 5.2],
    [29.1, 8.9], [29.2, 18.2], [-19.2, 18.1], [-19.2, 16.6], [-21.0, 16.5], [-21.0, 5.9], [-22.4, 5.9], [-22.3, -6.1],
    [-23.9, -6.1], [-23.9, -25.2],
  ] as XY[], 0.3))

  // the sloping roof plane: 101 m at the north-west end, 111 m at the prow
  const top = (p: XY) => 101 + (p[0] + 23.9) / 53.1 * 10
  const Z_BASE = 8.5, FLOOR = 3.85, Z0 = Z_BASE + 0.4

  // walls 0 → the roof plane (ground pieces ≤ 5 m long), and the roof
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.ceil(L / 5))
    for (let k = 0; k < n; k++) {
      const p: XY = [a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n]
      const q: XY = [a[0] + (b[0] - a[0]) * (k + 1) / n, a[1] + (b[1] - a[1]) * (k + 1) / n]
      stone.quad(at(p, Z_BASE), at(q, Z_BASE), at(q, top(q)), at(p, top(p)))
      // the recessed ground floor: glass 1.2 m in, with the stone columns at the face
      const nn = outN(a, b), r = 1.2
      const pi: XY = [p[0] - nn[0] * r, p[1] - nn[1] * r], qi: XY = [q[0] - nn[0] * r, q[1] - nn[1] * r]
      lobby.quad(at(pi, 0), at(qi, 0), at(qi, Z_BASE), at(pi, Z_BASE))
      stone.quad(at(q, Z_BASE), at(p, Z_BASE), at(pi, Z_BASE), at(qi, Z_BASE)) // soffit
    }
  }
  // columns along the face, ~3.4 m apart, set just inside the face line
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < 2.5) continue
    const nn = outN(a, b), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
    const m = Math.max(1, Math.round(L / 3.4))
    for (let k = 0; k <= m; k++) {
      if ((k === 0 || k === m) && L < 6) continue
      const t = Math.min(Math.max(k * L / m, 0.5), L - 0.5)
      const c: XY = [a[0] + u[0] * t - nn[0] * 0.5, a[1] + u[1] * t - nn[1] * 0.5]
      const h = 0.45, sq: XY[] = [[-h, -h], [h, -h], [h, h], [-h, h]].map(([x, y]) => [c[0] + u[0] * x - nn[0] * y, c[1] + u[1] * x - nn[1] * y] as XY)
      const w = ccw(sq)
      for (let j = 0; j < 4; j++) stone.quad(at(w[j], 0), at(w[(j + 1) % 4], 0), at(w[(j + 1) % 4], Z_BASE), at(w[j], Z_BASE))
    }
  }
  // the sloping roof
  for (const [ia, ib, ic] of triangulate(ring)) {
    const A = ring[ia], B = ring[ib], C = ring[ic]
    roof.tri([A[0], A[1], top(A) - 0.8], [B[0], B[1], top(B) - 0.8], [C[0], C[1], top(C) - 0.8])
  }
  // parapet: inner face and cap (0.8 m)
  {
    const inner = ring.map((p, i) => {
      const a = ring[(i - 1 + ring.length) % ring.length], b = ring[(i + 1) % ring.length]
      const n1 = outN(a, p), n2 = outN(p, b), m: XY = [n1[0] + n2[0], n1[1] + n2[1]], d = 1 + n1[0] * n2[0] + n1[1] * n2[1]
      return [p[0] - m[0] / d * 0.6, p[1] - m[1] / d * 0.6] as XY
    })
    for (let i = 0; i < ring.length; i++) {
      const j = (i + 1) % ring.length
      const v = (p: XY, dz = 0): V3 => [p[0], p[1], top(p) + dz]
      stone.quad(v(inner[j], -0.8), v(inner[i], -0.8), v(inner[i]), v(inner[j]))
      stone.quad(v(ring[i]), v(ring[j]), v(inner[j]), v(inner[i]))
    }
  }

  // window ribbons: continuous bands two storeys tall wrapping every face,
  // corner notch and the curved prow without a break, white stone bands
  // between them. They stop below the crown band, which is thinnest at the
  // north-west end and tallest over the prow, as the parapet slopes.
  {
    const off = ring.map((p, i) => {
      const a = ring[(i - 1 + ring.length) % ring.length], b = ring[(i + 1) % ring.length]
      const n1 = outN(a, p), n2 = outN(p, b), m: XY = [n1[0] + n2[0], n1[1] + n2[1]], d = 1 + n1[0] * n2[0] + n1[1] * n2[1]
      return [p[0] + m[0] / d * 0.05, p[1] + m[1] / d * 0.05] as XY
    })
    const Z_LAST = 96.5
    for (let g = 0; ; g++) {
      const z0 = Z0 + g * 2 * FLOOR + 1.3, z1 = Z0 + (g + 1) * 2 * FLOOR - 1.3
      if (z1 > Z_LAST) break
      for (let i = 0; i < off.length; i++) {
        const p = off[i], q = off[(i + 1) % off.length]
        win.quad(at(p, z0), at(q, z0), at(q, z1), at(p, z1))
      }
    }
  }

  return [
    { part: stone, material: finish('city-center-stone', 0xe4ddd0) },
    { part: win, material: { ...PALETTE.window, color: 0x7389a0 } },
    { part: lobby, material: PALETTE.entrance },
    { part: roof, material: PALETTE.roof },
  ]
}

if (import.meta.main) {
  await save('nash-nashville-city-center', 'Nashville City Center', build(), {
    bearing: 62.4, height: 111.2, replaces: ['way/130913036'],
  })
}
