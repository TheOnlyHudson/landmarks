/**
 * Ellie Caulkins Opera House, Denver: the shell of the 1908 Municipal
 * Auditorium (Robert Willison; the opera house built inside it in 2005) —
 * original procedural geometry, CC0-1.0.
 * bun generators/den-ellie-caulkins-opera-house.ts
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 45: the
 * model's +y is north-east (Curtis Street side), +x south-east (the curved
 * 14th Street front). Anchor -104.9971552, 39.7447486, the centroid of OSM
 * way/304212732. y = 0 is the lowest ground, on the 14th Street side.
 *
 * Identity (from the photos below):
 *  1. A long four-storey block of buff brick with pale stone dressings: an
 *     arcade of round-arched openings on the ground floor, square windows,
 *     then round-headed windows above, a deep bracketed cornice and a plain
 *     attic.                                               (beall, dcpa1)
 *  2. The 14th Street front bows out in a shallow curve between two corner
 *     pavilions.                                         (beall, naip, OSM)
 *  3. The corner pavilions: tall stone pilaster strips and, over each face,
 *     a semicircular hood with an oculus standing above the cornice.
 *                                                   (beall, dcpa1, dcpa)
 *  4. The stage house behind: a tall plain buff block with a low gable,
 *     ridge running across the building.                (beall, lidar, naip)
 *  5. A long low gabled roof over the hall, grey.             (naip, lidar)
 *
 * Plan: OSM way/304212732 squared up (its walls are within 0.2 m of the
 * axes in this frame); the curve and the pavilions' projection to x = 43
 * are OSM's. OSM's outline sits about 1.5 m south-west of the lidar's;
 * OSM is kept. The stage house is OSM way/538121561, the hall roof
 * way/538121560.
 *
 * Heights: USGS 3DEP lidar CO_DRCOG_2_2020 (flown 2020), 1 m grid, read
 * with tools/lidar_frame.py at bearing 45; ground 0.2 m (14th Street) to
 * 1.2 m (Curtis Street, north-west end); heights here from 0.5 m.
 * Measured: parapet 22.4 all round; hall roof eaves 22.4, ridge 28.9 at
 * y = 2.3; stage house eaves 33.5, ridge 36.9 along y at x = 14; a lower
 * flat roof at the north-west end (20.8) and behind the curved front.
 * Estimated from beall and dcpa1 scaled to the parapet: cornice 18.4-19.6,
 * string course 7.2, the window rows (ground arches to 6.5, square windows
 * 8-11, round-headed 12.6-16.2), bay spacing (about 6.2 m), the hoods
 * (radius 3.3, springing 20.7, tops 24.0, 1.2 m deep). The lidar shows
 * nothing above 23.2 at the pavilions, so the real hoods may stand up to
 * 0.8 m lower; they are kept a little proud of the attic so they read.
 * The plinth runs to 2.2 m so the 2 m rise of the streets doesn't bury it.
 * Pavilions are drawn 8 m wide on each face at all four corners; only the
 * two 14th Street ones are well photographed.
 *
 * Photos (evidence):
 *  beall   "Denver Municipal Auditorium.JPG", Jeffrey Beall, CC BY-SA 3.0,
 *          https://commons.wikimedia.org/wiki/File:Denver_Municipal_Auditorium.JPG
 *          (the 14th and Curtis corner, from the east)
 *  dcpa1   "dcpa1", Kayla Ferguson, CC0,
 *          https://www.flickr.com/photos/143916901@N05/37335298035
 *          (Curtis Street end with the Galleria arch)
 *  dcpa    "Dcpa2 - Flickr - socialgalavant.jpg", Kayla Ferguson, CC0,
 *          https://commons.wikimedia.org/wiki/File:Dcpa2_-_Flickr_-_socialgalavant.jpg
 *          (north-west face, from inside the Galleria)
 *  high    "Colorado LCCN2011635035.tif", Carol M. Highsmith, public domain,
 *          https://commons.wikimedia.org/wiki/File:Colorado_LCCN2011635035.tif
 *          (the Galleria along the north-west face)
 *  dnc1, dnc2  "Ellie Caulkins Opera House 2008 DNC (2798269034).jpg" and
 *          "(2798299750).jpg", freewheelinbiker, CC BY 2.0,
 *          https://commons.wikimedia.org/wiki/File:Ellie_Caulkins_Opera_House_2008_DNC_(2798269034).jpg
 *  naip    USGS NAIP orthophoto (public domain), plan and roof colours.
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the north-west face (dcpa) has fewer, more irregular windows
 * than the repeated bays drawn there. The south-west face (against the Buell Theatre) and the far ends
 * of the long faces have no clear photo; they repeat the Curtis Street
 * bays. The Galleria's glass arch, which abuts the north-west face, is not
 * part of this building and is not drawn. Cornice brackets, balustrades,
 * the frieze lettering and the window surrounds' pediments are left out.
 *
 * Night: windows glow (window); the stone is not floodlit in the evidence.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { archShape, box, gableRoof, onWall, prism, rectShape, save, type XY } from './atl-tech-tower'
import { cornice, offset } from './atl-flatiron-building'
import { disc } from './den-cathedral-basilica'

if (import.meta.main) {
  const brick = new Part(), trim = new Part(), roof = new Part(), win = new Part(), door = new Part(), shade = new Part()

  const X0 = -37.3, X1 = 43.0, Y0 = -27.4, Y1 = 29.2
  const CURVE: XY[] = [[41.1, -9.6], [42.2, -4.9], [42.9, 0.0], [43.0, 4.9], [42.5, 10.5], [41.3, 16.0]]
  const RING: XY[] = [[X0, Y0], [X1, Y0], [X1, -14.2], [39.4, -14.2], ...CURVE, [39.5, 21.3], [X1, 21.3], [X1, Y1], [X0, Y1]]
  const CORN = 18.4, ATTIC = 19.6, PARA = 22.4

  // ── the shell ──
  prism(brick, RING, 0, CORN, null, 0)
  // the deep cornice: a shadowed soffit (second, darker tone) under a stone band
  cornice(shade, RING, CORN, 0.6, 0.9, null)
  prism(trim, offset(RING, 0.9), CORN + 0.6, ATTIC, trim, 0.2)
  prism(brick, offset(RING, -0.15), ATTIC, PARA, null, 0)
  prism(trim, offset(RING, 0.05), PARA - 0.35, PARA, roof, 0.15)
  prism(trim, offset(RING, 0.08), 0, 2.2, null, 0) // plinth, tall enough for the 2 m rise of the street
  prism(trim, offset(RING, 0.1), 7.0, 7.45, null, 0.08) // string course

  // ── roofs: the hall's long gable and the stage house ──
  gableRoof(roof, brick, -28.5, 34.7, -22.7, 27.2, PARA, 28.9, 'x', 0.3, 0.2)
  box(brick, 5.2, 22.8, -15.2, 22.2, PARA - 1, 33.5, null, 0.3)
  gableRoof(roof, brick, 5.2, 22.8, -15.2, 22.2, 33.5, 36.9, 'y', 0.35, 0.25)
  prism(trim, offset([[5.2, -15.2], [22.8, -15.2], [22.8, 22.2], [5.2, 22.2]], 0.1), 32.9, 33.5, null, 0.1)

  // ── openings on a wall a→b (outside to the right), one bay at s ──
  const bay = (a: XY, b: XY, s: number, w = 1) => {
    // ground floor: a round-arched opening, door below a fanlight
    onWall(trim, a, b, archShape(s, 4.2 * w, 2.2, 5.0, 8), 0.1)
    onWall(win, a, b, archShape(s, 3.3 * w, 4.0, 5.0, 8), 0.15)
    onWall(door, a, b, rectShape(s - 1.65 * w, s + 1.65 * w, 1.2, 4.0), 0.15)
    // second storey: square windows in a stone frame
    onWall(trim, a, b, rectShape(s - 1.45 * w, s + 1.45 * w, 7.75, 11.75), 0.05)
    onWall(win, a, b, rectShape(s - 1.05 * w, s + 1.05 * w, 8.1, 11.3), 0.1)
    // third storey: round-headed windows
    onWall(trim, a, b, archShape(s, 2.9 * w, 12.2, 15.3, 8), 0.05)
    onWall(win, a, b, archShape(s, 2.2 * w, 12.6, 15.3, 8), 0.1)
  }
  const along = (a: XY, b: XY) => Math.hypot(b[0] - a[0], b[1] - a[1])
  const run = (a: XY, b: XY, s0: number, s1: number, n: number) => {
    for (let i = 0; i < n; i++) bay(a, b, s0 + ((i + 0.5) * (s1 - s0)) / n)
  }
  const PW = 8 // pavilion width on each face
  // the four faces, each a→b with the outside to the right
  const S_: [XY, XY] = [[X0, Y0], [X1, Y0]], N_: [XY, XY] = [[X1, Y1], [X0, Y1]], W_: [XY, XY] = [[X0, Y1], [X0, Y0]]
  run(...S_, PW, X1 - X0 - PW, 11)
  run(...N_, PW, X1 - X0 - PW, 11)
  run(...W_, PW, Y1 - Y0 - PW, 7)
  // the curved front: one bay on each facet, stone pilasters at the joints
  const CF: XY[] = [[39.4, -14.2], ...CURVE, [39.5, 21.3]]
  for (let i = 0; i < CF.length - 1; i++) {
    const a = CF[i], b = CF[i + 1], L = along(a, b)
    bay(a, b, L / 2, Math.min(1, L / 5.6))
    if (i > 0) onWall(trim, a, b, rectShape(-0.4, 0.4, 7.45, CORN), 0.12)
  }

  // ── corner pavilions: projecting blocks, pilaster strips, hoods ──
  const hood = (a: XY, b: XY, s: number) => {
    const R = 3.3, zs = 20.7, L = along(a, b), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nn: XY = [t[1], -t[0]]
    const P = (u: number, z: number, d: number): V3 => [a[0] + t[0] * u + nn[0] * d, a[1] + t[1] * u + nn[1] * d, z]
    // a solid half-disc slab, 0.9 m deep, standing on the parapet line
    const seg = 10, arc: [number, number][] = []
    for (let i = 0; i <= seg; i++) { const q = (i / seg) * Math.PI; arc.push([s + R * Math.cos(q), zs + R * Math.sin(q)]) }
    for (let i = 0; i < seg; i++) {
      const [u0, z0] = arc[i], [u1, z1] = arc[i + 1]
      brick.quad(P(u0, z0, 0.5), P(u0, z0, -0.7), P(u1, z1, -0.7), P(u1, z1, 0.5))
      brick.quad(P(u1, z1, 0.5), P(u1, z1, -0.7), P(u0, z0, -0.7), P(u0, z0, 0.5))
    }
    onWall(brick, a, b, arc.map(([u, z]) => [u, z] as [number, number]), 0.5)
    onWall(brick, b, a, arc.map(([u, z]) => [L - u, z] as [number, number]), 0.7)
    // the moulded arch ring, the oculus and a ledge at the springing
    for (let i = 0; i < seg; i++) {
      const q0 = (i / seg) * Math.PI, q1 = ((i + 1) / seg) * Math.PI, r0 = R - 0.6
      onWall(trim, a, b, [[s + R * Math.cos(q0), zs + R * Math.sin(q0)], [s + R * Math.cos(q1), zs + R * Math.sin(q1)],
        [s + r0 * Math.cos(q1), zs + r0 * Math.sin(q1)], [s + r0 * Math.cos(q0), zs + r0 * Math.sin(q0)]], 0.56)
    }
    onWall(trim, a, b, disc(s, zs + 1.25, 1.0, 12), 0.56)
    onWall(win, a, b, disc(s, zs + 1.25, 0.72, 12), 0.6)
  }
  const pav = (x0: number, x1: number, y0: number, y1: number, faces: [XY, XY, number][]) => {
    box(brick, x0, x1, y0, y1, 0, CORN, null, 0)
    cornice(shade, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], CORN, 0.6, 0.9, null)
    box(trim, x0 - 0.9, x1 + 0.9, y0 - 0.9, y1 + 0.9, CORN + 0.6, ATTIC, trim, 0.2)
    box(brick, x0 + 0.6, x1 - 0.6, y0 + 0.6, y1 - 0.6, ATTIC, 21.2, trim, 0.2)
    for (const [a, b, s] of faces) {
      const L = along(a, b)
      void L
      onWall(trim, a, b, rectShape(s - PW / 2 + 0.25, s - PW / 2 + 1.55, 1.2, CORN), 0.06)
      onWall(trim, a, b, rectShape(s + PW / 2 - 1.55, s + PW / 2 - 0.25, 1.2, CORN), 0.06)
      bay(a, b, s, 0.95)
      hood(a, b, s)
    }
  }
  const o = 0.35 // projection
  // east (14th and Curtis) and south (14th, by the Buell) — fronting 14th St
  pav(X1 - PW, X1 + o, 21.3, Y1 + o, [[[X1 + o, 21.3], [X1 + o, Y1 + o], (Y1 + o - 21.3) / 2], [[X1 + o, Y1 + o], [X1 - PW, Y1 + o], (PW + o) / 2]])
  pav(X1 - PW, X1 + o, Y0 - o, -14.2, [[[X1 + o, Y0 - o], [X1 + o, -14.2], (-14.2 - Y0 + o) / 2], [[X1 - PW, Y0 - o], [X1 + o, Y0 - o], (PW + o) / 2]])
  // north and west corners, on the Galleria
  pav(X0 - o, X0 + PW, Y1 - PW, Y1 + o, [[[X0 + PW, Y1 + o], [X0 - o, Y1 + o], (PW + o) / 2], [[X0 - o, Y1 + o], [X0 - o, Y1 - PW], (PW + o) / 2]])
  pav(X0 - o, X0 + PW, Y0 - o, Y0 + PW, [[[X0 - o, Y0 - o], [X0 + PW, Y0 - o], (PW + o) / 2], [[X0 - o, Y0 + PW], [X0 - o, Y0 - o], (PW + o) / 2]])

  await save('den-ellie-caulkins-opera-house', 'Ellie Caulkins Opera House', [
    { part: brick, material: finish('buff-brick', 0xd0bf9d) },
    { part: trim, material: finish('buff-stone', 0xe6dbc3) },
    { part: shade, material: finish('buff-shade', 0xae9f82) },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: door, material: finish('door-green', 0x5e6c60) },
  ], {}, 6500)
}
