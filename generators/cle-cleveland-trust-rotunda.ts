/**
 * Cleveland Trust Company Building (the rotunda, 1908, George B. Post & Sons;
 * since 2015 Heinen's), Euclid Avenue at East 9th Street, Cleveland:
 * procedural, CC0-1.0.
 * bun generators/cle-cleveland-trust-rotunda.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, bearing 0. The origin is the OSM
 * outline's area centroid (-81.686078, 41.500037); z = 0 is the lowest ground
 * under the footprint (Euclid Avenue's sidewalk on the north; the E. 9th side
 * is up to 1.3 m higher).
 *
 * Form: a granite Neoclassical bank on a corner. Each street front is a
 * corner bay with one tall window, a 20 m portico of six engaged Corinthian
 * columns under a low pediment, and an end bay; on Euclid the portico stands
 * 1.2 m proud. The corner itself is cut by a diagonal face with two columns
 * round one tall window. A rusticated base storey with round-arched windows
 * carries the giant order; an entablature, a heavy cornice and a balustrade
 * finish the walls. Over the rotunda a plain round drum with a cornice
 * carries three stepped rings and a shallow lead-grey dome, the building's
 * identity. The 1971 Breuer tower ("The 9", way/218110514) behind it is not
 * part of this model.
 *
 * Sources
 * - OSM (ODbL): outline way/218110515 (height 20, 3 levels, roof dome,
 *   Q21197553), dome part way/537153709 (height 28.4). The plan is OSM's
 *   (the portico's middle node dropped as collinear).
 * - Lidar (measured): USGS 3DEP OH_Statewide_Phase1_1_2019 (public domain,
 *   2019 flight), 0.5 m grid. Roof and balustrade 18.9 m; pediment apexes
 *   21.1-21.2 m (Euclid and E. 9th); drum cornice edge 24.0-24.2 m at
 *   r 11 m; the stepped rings to 25.9 m at r 9 m; dome apex 30.7 m. The dome
 *   is segmental, not a hemisphere: its profile fits a circular arc of
 *   R 10.8 m (29.4 m read at r 5 m, 29.5 m drawn). Back penthouse 21.8 m on
 *   the east. Two 45 m spikes over the west roof are noise (a crane?).
 * - Photos (evidence): w_lemay, "Cleveland Trust Company Building, Euclid
 *   Avenue and East 9th Street, Cleveland, OH" (Wikimedia Commons, CC BY-SA
 *   2.0; sunny, from the north-west corner: the two fronts, the corner face,
 *   drum and dome, colours);
 *   https://commons.wikimedia.org/wiki/File:Cleveland_Trust_Company_Building,_Euclid_Avenue_and_East_9th_Street,_Cleveland,_OH.jpg
 *   Ohio Office of Redevelopment, "Cleveland Trust rotunda" (Commons, CC BY
 *   2.0; the same corner, overcast);
 *   https://commons.wikimedia.org/wiki/File:Cleveland_Trust_rotunda.jpg
 *   Ohio Redevelopment Projects - ODSA, "Cleveland - Cleveland Trust Company
 *   (OHPTC)" and "... - 25892459751" (Commons, CC BY 2.0; from above on the
 *   north: the Euclid portico, the roof, the drum's rings, the dome);
 *   https://commons.wikimedia.org/wiki/File:Cleveland_-_Cleveland_Trust_Company_(OHPTC).jpg
 *   https://commons.wikimedia.org/wiki/File:Cleveland_-_Cleveland_Trust_Company_(OHPTC)_-_25892459751.jpg
 *   Tim Evanson, "Cleveland Trust Co Building and The 9" and "E 9th St
 *   pediment - Cleveland Trust Co" (Flickr, CC BY-SA 2.0; from the south
 *   on E. 9th, and the E. 9th pediment);
 *   https://www.flickr.com/photos/23165290@N00/29176398387
 *   https://www.flickr.com/photos/23165290@N00/30063709228
 *   Ohio Redevelopment Projects - ODSA, "Cleveland-Cleveland Trust Company
 *   (OHPTC) - 16193664810" (Commons, CC BY 2.0; the bronze Euclid door).
 * Estimated (from the photos, scaled to the lidar roof): base storey 5.1 m,
 *   sill band to 5.7 m, column tops 14.8 m, frieze to 17.0 m, cornice to
 *   18.2 m, balustrade (drawn solid) to 19.2 m; column spacing 3.6 m, column
 *   radius 0.78 m (drawn a little bold); window and arch sizes; the drum's wall radius (10.5 m)
 *   and the three rings' heights.
 * Colours: the granite is a warm light grey in sunlit photos (#bfb6a7),
 *   pulled to the palette's lightness; the dome a pale cool grey (lead-coated
 *   copper, #ced0d1 lit).
 * Left out: the pediment sculpture (a cartouche block stands for it), the
 *   wreath frieze on the drum, the dome's faint ribs, the street clock, signs.
 * Doubts: the south-east and east walls are party walls against The 9 and
 *   its neighbour, unphotographed, drawn plain. The E. 9th portico is drawn
 *   flush (OSM has no projection there) with six columns, as on Euclid; only
 *   four are clearly visible in the photos.
 * Night: the tall windows glow; the bronze doors are `entrance`.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, inset, cap, panel, onWall, halfColumn, lathe, save } from './chi-field-museum'
import { archPanel } from './cle-city-hall'
import { wallQuad } from './cle-200-public-square'

const Z = { base: 5.1, sill: 5.7, colTop: 14.8, frieze: 17.0, corn: 18.2, bal: 19.2, roof: 18.7 }
const ped = 21.2 // pediment apexes (lidar)

// The outline, counter-clockwise (OSM way/218110515, centroid frame).
const A: XY = [-22.8, 13.1], B: XY = [-26.0, 6.4], C: XY = [-8.4, -18.2], D: XY = [9.9, -5.8], E: XY = [14.4, -2.6]
const F: XY = [10.5, 19.2], P1: XY = [4.0, 18.0], P2: XY = [3.8, 19.2], P4: XY = [-16.2, 15.7], P5: XY = [-16.0, 14.5]
const RING: XY[] = [A, B, C, D, E, F, P1, P2, P4, P5]

const DOME_C: XY = [-2.9, 0.1]

function build() {
  const stone = new Part(), trim = new Part(), win = new Part(), dome = new Part(), roof = new Part(), door = new Part()

  // ------------------------------------------------------------ walls, bands, cornice
  for (let i = 0; i < RING.length; i++) wallQuad(stone, RING[i], RING[(i + 1) % RING.length], 0, Z.frieze)
  const band = (z0: number, z1: number, d: number) => {
    const o = inset(RING, -d)
    for (let i = 0; i < RING.length; i++) {
      const j = (i + 1) % RING.length
      wallQuad(trim, o[i], o[j], z0, z1)
    }
    // underside and top as rings
    for (let i = 0; i < RING.length; i++) {
      const j = (i + 1) % RING.length
      trim.quad([RING[j][0], RING[j][1], z0], [RING[i][0], RING[i][1], z0], [o[i][0], o[i][1], z0], [o[j][0], o[j][1], z0])
      trim.quad([RING[i][0], RING[i][1], z1], [RING[j][0], RING[j][1], z1], [o[j][0], o[j][1], z1], [o[i][0], o[i][1], z1])
    }
  }
  band(Z.base, Z.sill, 0.18) // the sill course over the rusticated base
  band(Z.colTop, Z.colTop + 0.6, 0.12) // architrave
  // the cornice: a stepped overhang
  {
    const o1 = inset(RING, -0.45), o2 = inset(RING, -0.95)
    for (let i = 0; i < RING.length; i++) {
      const j = (i + 1) % RING.length
      const q = (r: XY[], s: XY[], z0: number, z1: number, part = trim) => {
        part.quad([r[i][0], r[i][1], z0], [r[j][0], r[j][1], z0], [s[j][0], s[j][1], z1], [s[i][0], s[i][1], z1])
      }
      q(RING, o1, Z.frieze, Z.frieze + 0.3)
      q(o1, o1, Z.frieze + 0.3, Z.frieze + 0.6)
      q(o1, o2, Z.frieze + 0.6, Z.frieze + 0.75)
      q(o2, o2, Z.frieze + 0.75, Z.corn)
      // the top of the cornice, back to the balustrade's line
      const b = inset(RING, 0.3)
      trim.quad([o2[i][0], o2[i][1], Z.corn], [o2[j][0], o2[j][1], Z.corn], [b[j][0], b[j][1], Z.corn], [b[i][0], b[i][1], Z.corn])
    }
  }
  // roof
  cap(roof, inset(RING, 0.3), Z.roof)

  // ------------------------------------------------------------ the fronts
  const colR = 0.78
  /** One tall window over an arched base window (or a door) at s on wall a→b. */
  const bay = (a: XY, b: XY, s: number, w = 2.0, isDoor = false) => {
    // upper: two lights with a spandrel between, the banking hall's tall window
    panel(trim, a, b, s - w / 2 - 0.35, s + w / 2 + 0.35, Z.sill + 0.2, Z.colTop - 0.6, 0.03)
    panel(win, a, b, s - w / 2, s + w / 2, Z.sill + 0.5, 9.9, 0.06)
    panel(win, a, b, s - w / 2, s + w / 2, 10.6, Z.colTop - 1.0, 0.06)
    // base: a round-arched opening
    const aw = 2.1
    if (isDoor) {
      archPanel(trim, a, b, s - aw / 2 - 0.4, s + aw / 2 + 0.4, 0.4, 3.5, 0.03)
      archPanel(door, a, b, s - aw / 2, s + aw / 2, 0.4, 3.5, 0.06)
    } else {
      archPanel(win, a, b, s - aw / 2, s + aw / 2, 1.3, 3.4, 0.05)
    }
  }
  /** A portico of six engaged columns over s0..s1 of wall a→b, its centre bay a door. */
  const portico = (a: XY, b: XY, s0: number, s1: number, doorBay = true) => {
    const n = 6, sp = (s1 - s0 - 2 * 0.9) / (n - 1)
    for (let k = 0; k < n; k++) halfColumn(trim, trim, a, b, s0 + 0.9 + k * sp, Z.sill, Z.colTop, colR, 8)
    for (let k = 0; k < n - 1; k++) bay(a, b, s0 + 0.9 + (k + 0.5) * sp, 2.0, doorBay && k === 2)
  }
  /** A pediment over s0..s1 of wall a→b, standing on the cornice, `depth` deep, face `out` proud. */
  const pediment = (a: XY, b: XY, s0: number, s1: number, depth = 3.2, out = 0.95) => {
    const { P } = onWall(a, b)
    const m = (s0 + s1) / 2
    const z0 = Z.corn, z1 = ped
    const F0 = P(s0 - 0.2, z0, out), F1 = P(s1 + 0.2, z0, out), FT = P(m, z1, out)
    const B0 = P(s0 - 0.2, z0, -depth), B1 = P(s1 + 0.2, z0, -depth), BT = P(m, z1, -depth)
    trim.tri(F0, F1, FT) // raking frame
    trim.tri(B1, B0, BT)
    trim.quad(F1, B1, BT, FT) // the two slopes
    trim.quad(B0, F0, FT, BT)
    // the tympanum, a shade darker, inside the raking cornice
    const ti = 0.75, h = z1 - z0, half = (s1 - s0) / 2
    const k = (half - ti * 2.2) / half
    stone.tri(P(m - half * k, z0 + 0.35, out + 0.03), P(m + half * k, z0 + 0.35, out + 0.03), P(m, z0 + 0.35 + (h - 0.35 - ti) * 1, out + 0.03))
    // a cartouche for the sculpture group at the centre
    const cw = 0.9
    const c0 = P(m - cw, z0 + 0.35, out + 0.03), c1 = P(m + cw, z0 + 0.35, out + 0.03)
    const c2 = P(m + cw, z0 + 1.6, out + 0.03), c3 = P(m - cw, z0 + 1.6, out + 0.03)
    const d0 = P(m - cw, z0 + 0.35, out + 0.45), d1 = P(m + cw, z0 + 0.35, out + 0.45)
    const d2 = P(m + cw, z0 + 1.6, out + 0.45), d3 = P(m - cw, z0 + 1.6, out + 0.45)
    trim.quad(d0, d1, d2, d3)
    trim.quad(c1, c2, d2, d1)
    trim.quad(c3, c0, d0, d3)
    trim.quad(d3, d2, c2, c3)
  }

  // Euclid Avenue (north): corner bay, portico (proud 1.2 m), end bay
  {
    const Lc = Math.hypot(A[0] - P5[0], A[1] - P5[1])
    bay(P5, A, Lc / 2)
    const Le = Math.hypot(P1[0] - F[0], P1[1] - F[1])
    bay(F, P1, Le / 2)
    const Lp = Math.hypot(P4[0] - P2[0], P4[1] - P2[1])
    portico(P2, P4, 0, Lp)
    pediment(P2, P4, 0, Lp, 3.2, 0.95)
  }
  // East 9th Street (west): corner bay, portico (flush), end
  {
    bay(B, C, 3.5)
    portico(B, C, 7.0, 27.0)
    pediment(B, C, 7.0, 27.0, 3.2, 0.95)
  }
  // The diagonal corner: two columns round one tall window
  {
    const L = Math.hypot(B[0] - A[0], B[1] - A[1])
    halfColumn(trim, trim, A, B, L / 2 - 1.85, Z.sill, Z.colTop, colR, 8)
    halfColumn(trim, trim, A, B, L / 2 + 1.85, Z.sill, Z.colTop, colR, 8)
    bay(A, B, L / 2, 2.1)
  }

  // ------------------------------------------------------------ balustrade (drawn solid), off the pediments
  {
    const r0 = inset(RING, 0.3), r1 = inset(RING, 0.75)
    const segs: [number, number[]][] = [] // edge index, skipped s-range on that edge
    const skip: Record<number, [number, number]> = { 1: [6.8, 27.2], 7: [-1, 99] } // E 9th pediment; Euclid portico face
    for (let i = 0; i < RING.length; i++) {
      const j = (i + 1) % RING.length
      const L = Math.hypot(r0[j][0] - r0[i][0], r0[j][1] - r0[i][1])
      const runs: [number, number][] = skip[i] ? [[0, skip[i][0]], [skip[i][1], L]] : [[0, L]]
      for (const [s0, s1] of runs) {
        const e0 = Math.max(0, s0), e1 = Math.min(L, s1)
        if (e1 - e0 < 0.05) continue
        const at = (r: XY[], s: number, z: number): V3 => {
          const t = s / L
          return [r[i][0] + (r[j][0] - r[i][0]) * t, r[i][1] + (r[j][1] - r[i][1]) * t, z]
        }
        // r1's edge is shorter; scale s by its own length
        const L1 = Math.hypot(r1[j][0] - r1[i][0], r1[j][1] - r1[i][1])
        const at1 = (s: number, z: number): V3 => {
          const t = Math.min(1, Math.max(0, (s - (L - L1) / 2) / L1))
          return [r1[i][0] + (r1[j][0] - r1[i][0]) * t, r1[i][1] + (r1[j][1] - r1[i][1]) * t, z]
        }
        stone.quad(at(r0, e0, Z.corn), at(r0, e1, Z.corn), at(r0, e1, Z.bal - 0.25), at(r0, e0, Z.bal - 0.25))
        stone.quad(at1(e1, Z.roof), at1(e0, Z.roof), at1(e0, Z.bal - 0.25), at1(e1, Z.bal - 0.25))
        // coping
        trim.quad(at(r0, e0, Z.bal - 0.25), at(r0, e1, Z.bal - 0.25), at(r0, e1, Z.bal), at(r0, e0, Z.bal))
        trim.quad(at(r0, e0, Z.bal), at(r0, e1, Z.bal), at1(e1, Z.bal), at1(e0, Z.bal))
        trim.quad(at1(e1, Z.bal - 0.25), at1(e0, Z.bal - 0.25), at1(e0, Z.bal), at1(e1, Z.bal))
        // ends
        for (const [s, flip] of [[e0, true], [e1, false]] as [number, boolean][]) {
          if (s <= 0.01 || s >= L - 0.01) continue
          const q: V3[] = [at(r0, s, Z.corn), at1(s, Z.corn), at1(s, Z.bal), at(r0, s, Z.bal)]
          if (flip) stone.quad(q[0], q[1], q[2], q[3]); else stone.quad(q[3], q[2], q[1], q[0])
        }
      }
      void segs
    }
  }

  // ------------------------------------------------------------ the back penthouse (lidar 21.8 m)
  {
    const pr: XY[] = [[9.0, -4.6], [13.2, -1.8], [12.8, 1.2], [9.0, 1.2]]
    for (let i = 0; i < pr.length; i++) wallQuad(roof, pr[i], pr[(i + 1) % pr.length], Z.roof, 21.8)
    cap(roof, pr, 21.8)
  }

  // ------------------------------------------------------------ the drum and the dome
  {
    const [cx, cy] = DOME_C, seg = 24
    const L = (p: Part, prof: XY[]) => lathe(p, cx, cy, prof, seg)
    L(stone, [[10.5, Z.roof], [10.5, 22.6]])
    L(trim, [[10.5, 22.6], [10.75, 22.9]])
    L(trim, [[10.75, 22.9], [10.75, 23.3]])
    L(trim, [[10.75, 23.3], [11.15, 23.6]])
    L(trim, [[11.15, 23.6], [11.15, 24.1]])
    L(trim, [[11.15, 24.1], [10.6, 24.1]])
    // three stepped rings
    const rings: [number, number, number][] = [[10.6, 24.1, 24.65], [10.0, 24.65, 25.25], [9.4, 25.25, 25.85]]
    rings.forEach(([r, z0, z1], k) => {
      L(dome, [[r, z0], [r, z1]])
      L(dome, [[r, z1], [k < 2 ? rings[k + 1][0] : 9.0, z1]])
    })
    // the dome: a circular arc, R 10.8, apex 30.7 (lidar)
    const R = 10.78, zc = 30.7 - R, t0 = Math.asin(9.0 / R)
    const prof: XY[] = []
    for (let k = 0; k <= 9; k++) {
      const t = t0 * (1 - k / 9)
      prof.push([R * Math.sin(t), zc + R * Math.cos(t)])
    }
    L(dome, prof)
  }

  return [
    { part: stone, material: finish('cle-trust-granite', 0xddd5c6) },
    { part: trim, material: finish('cle-trust-granite-trim', 0xe9e2d5) },
    { part: win, material: PALETTE.window },
    { part: dome, material: finish('cle-trust-dome', 0xc6cbcd) },
    { part: roof, material: PALETTE.roof },
    { part: door, material: finish('entrance', 0x7a6a4c) },
  ]
}

if (import.meta.main) await save('cle-cleveland-trust-rotunda', 'Cleveland Trust Company Building', [41.500037, -81.686078], 0, build())
