/**
 * Bacardi Buildings, Miami (2100 Biscayne Boulevard; now the National
 * YoungArts Foundation campus): the 1963 tower by Enrique Gutiérrez, its
 * end walls clad in Francisco Brennand's blue-and-white azulejo murals, and
 * the 1973 "Jewel Box" by Ignacio Carrera-Justiz, a stained-glass mosaic box
 * raised on a single core — original procedural geometry, CC0-1.0.
 * bun generators/mia-bacardi-buildings.ts
 *
 * One model for the site: OSM maps both as building:parts of one building,
 * way/454144052, which covers the whole raised plaza between them, so they
 * are one placement and the model draws the plaza's plinth too.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of way/454144052, 25.797408, -80.1897131. Its
 * walls run at 359.0° / 89.0°, so the catalog bearing is 359.0.
 *
 * Identity, in order: the slim tower on Biscayne, raised on marble pilotis
 * over a glazed lobby, its long faces dark glass in three bays between white
 * marble piers under a perforated screen band, its short (north and south)
 * faces white tile walls with big blue leaf-and-wave murals; across the
 * plaza the wide, low mosaic box floating on its orange core; the plaza
 * itself raised behind a navy-tiled wall.
 *
 * Night: the Jewel Box's stained glass glows amber, red and blue from
 * inside (Daniel Christensen's night photo): its walls are `window-2`, which
 * glow warm. The tower's curtain wall is `window`. The core and the murals
 * are unlit.
 *
 * Evidence:
 *  - plan: OSM way/454144052 (the site, with the raised plaza),
 *    way/316753425 (tower, "Galleries & Offices", with the service core on
 *    its west side), way/316753396 (Jewel Box). USGS NAIP for the plaza and
 *    roofs.
 *  - heights: USGS lidar FL_TopobathyFLKeysNOAA_Hydroflattened_2019 (flown
 *    2019), 0.5 m grid, above Biscayne Boulevard (ground_min + 1.7 m):
 *    plaza 1.5; tower parapet 34.3 with the roof inside it ~31; the service
 *    core 37.3; Jewel Box roof 13.3. Lidar puts the tower at x 31–41,
 *    y −16..8.6 (10 × 24.5 m), matching OSM, and the Jewel Box at
 *    x −45..−21, a metre inside OSM's west and east lines.
 *  - from the photos, scaled by those: the tower's soffit at 5.5 m (a
 *    4 m lobby over the plaza, from Pessar's and Lundberg's photos), the screen band's depth (~5 m), three bays
 *    a long face; the Jewel Box's core 3.4 m tall and ~10 m square, the box
 *    8.4 m deep with pale glass-block bands along its top and bottom.
 *  - colour: the tower's near-black glass (pulled light to a warm charcoal
 *    #5a5551), white marble, the murals' cobalt blue on white tile; the
 *    Jewel Box's mosaic a pale grey-blue ground (white and grey-blue glass
 *    with dark leading) with big deep-blue and dark brown pictures and a
 *    thin dark frame, the core orange, the plinth's tile navy (drawn in the
 *    mural blue), the plaza's pavers tan.
 *  - the murals are a dense scatter of small stylised leaves and two waves,
 *    and the Jewel Box's pictures two long lenses a face, after the photos,
 *    not traced: the real pictures are far too fine to read at map size.
 *
 * Photos (Wikimedia Commons):
 *  - 20131012_Miami_3615_Bacardi_annex.jpg (Dan Lundberg, CC BY-SA 2.0)
 *  - 20131019_Miami_3688_Bacardi_plaza.jpg (Dan Lundberg, CC BY-SA 2.0)
 *  - Bacardi_Building_(27670845248).jpg (Phillip Pessar, CC BY 2.0)
 *  - Bacardi_Building_Biscayne_Boulevard_Miami_Florida.jpg (PhillipPessar,
 *    CC BY-SA 4.0)
 *  - Miami_Bacardi_Building_lit_up.jpg (Daniel Christensen, CC BY-SA 3.0),
 *    night
 * No look-only sources. No commercial imagery.
 *
 * Left out: the external stairs under the tower's overhang, the plaza's
 * railings, steps and planters, the Bacardi bat in the paving, the lettering,
 * the curtain wall's per-floor mullions (a few pale lines stand for them).
 *
 * Doubts: the tower's west face and the north mural are not in the photos
 * used; the north face is drawn like the south (the murals differ in
 * reality). The Jewel Box's west and north faces are drawn like the others.
 */
import { Part, type V3 } from './mesh'
import { finish, windowVariant, PALETTE } from './palette'
import { block, cap, inset, onWall, panel, rect, save, walls, type XY } from './chi-aon-center'

/** A pointed oval (a leaf) flush on the wall a→b, centred at s, z, length l, width w, turned `deg` from vertical. */
function leaf(p: Part, a: XY, b: XY, s: number, z: number, l: number, w: number, deg: number, out = 0.05) {
  const { P } = onWall(a, b)
  const t = (deg * Math.PI) / 180, c = Math.cos(t), sn = Math.sin(t)
  const n = 10, pts: V3[] = []
  for (let i = 0; i < n; i++) {
    // A lens: full width at the middle, pointed at both ends.
    const u = (i / n) * 2 * Math.PI, sn0 = Math.sin(u)
    const y = (l / 2) * Math.cos(u), x = (w / 2) * Math.sign(sn0) * Math.abs(sn0) ** 1.4
    pts.push(P(s + x * c + y * sn, z - x * sn + y * c, out))
  }
  const C = P(s, z, out)
  for (let i = 0; i < n; i++) p.tri(C, pts[(i + 1) % n], pts[i])
}

/** A wavy band across the wall a→b from s0 to s1 around height z, amplitude amp, thickness th. */
function wave(p: Part, a: XY, b: XY, s0: number, s1: number, z: number, amp: number, th: number, waves = 2, out = 0.05) {
  const { P } = onWall(a, b)
  const n = 12
  for (let i = 0; i < n; i++) {
    const f0 = i / n, f1 = (i + 1) / n
    const sa = s0 + (s1 - s0) * f0, sb = s0 + (s1 - s0) * f1
    const za = z + amp * Math.sin(f0 * waves * 2 * Math.PI), zb = z + amp * Math.sin(f1 * waves * 2 * Math.PI)
    p.quad(P(sa, za - th / 2, out), P(sb, zb - th / 2, out), P(sb, zb + th / 2, out), P(sa, za + th / 2, out))
  }
}

function build() {
  const marble = new Part(), glass = new Part(), mosaic = new Part(), blue = new Part(), orange = new Part(), paving = new Part()
  const navy = blue // the Jewel Box's deep blue is the azulejo blue

  // --- The raised plaza: the OSM outline as a 1.5 m plinth, navy tile
  // walls, tan pavers on top.
  const SITE: XY[] = ([[50.5, 30.2], [50.4, -20.8], [45.3, -20.8], [45.3, -24.0], [31.0, -24.0], [31.1, -15.4], [31.1, -10.1], [26.0, -10.2], [25.9, 1.8], [20.3, 1.8], [20.3, -21.2], [16.7, -21.2], [16.7, -24.1], [-50.7, -24.0], [-50.8, -20.8], [-53.7, -20.8], [-53.7, 18.3], [19.2, 18.2], [19.3, 30.2]] as XY[]).reverse()
  const PZ = 1.5
  // Split the plinth walls into short pieces so they follow the ground.
  for (let i = 0; i < SITE.length; i++) {
    const a = SITE[i], b = SITE[(i + 1) % SITE.length], L = Math.hypot(b[0] - a[0], b[1] - a[1]), k = Math.max(1, Math.ceil(L / 5))
    for (let j = 0; j < k; j++) {
      const p0: XY = [a[0] + ((b[0] - a[0]) * j) / k, a[1] + ((b[1] - a[1]) * j) / k], p1: XY = [a[0] + ((b[0] - a[0]) * (j + 1)) / k, a[1] + ((b[1] - a[1]) * (j + 1)) / k]
      blue.quad([p0[0], p0[1], 0], [p1[0], p1[1], 0], [p1[0], p1[1], PZ], [p0[0], p0[1], PZ])
    }
  }
  cap(paving, SITE, PZ)

  // --- The tower.
  const X0 = 30.9, X1 = 40.8, Y0 = -15.6, Y1 = 8.6
  const SOF = 5.5, TOP = 34.3, SCR = 29.0
  const body = rect(X0, Y0, X1, Y1)
  // Glazed lobby under the overhang, set in 1.6 m.
  walls(glass, rect(X0 + 1.6, Y0 + 2.2, X1 - 1.6, Y1 - 2.2), PZ, SOF)
  // The body: walls from the soffit up, soffit underneath, roof inside the
  // screen parapet.
  walls(marble, body, SOF, TOP)
  cap(marble, body, SOF, false)
  cap(marble, inset(body, 0.3), 31.2)
  walls(marble, [...inset(body, 0.3)].reverse(), 31.2, TOP)
  {
    const o = body, i = inset(body, 0.3)
    for (let k = 0; k < 4; k++) {
      const l = (k + 1) % 4
      marble.quad([i[k][0], i[k][1], TOP], [o[k][0], o[k][1], TOP], [o[l][0], o[l][1], TOP], [i[l][0], i[l][1], TOP])
    }
  }
  // Long faces (east, west): dark glass in three bays between marble piers
  // that run down to the plaza as the pilotis; the screen band on top.
  const longFaces: [XY, XY][] = [[[X1, Y0], [X1, Y1]], [[X0, Y1], [X0, Y0]]]
  const L = Y1 - Y0, piers = [0, L / 3, (2 * L) / 3, L]
  for (const [a, b] of longFaces) {
    const { P } = onWall(a, b)
    for (let k = 0; k < 3; k++) {
      const s0 = piers[k] + 0.55, s1 = piers[k + 1] - 0.55
      panel(glass, a, b, s0, s1, SOF + 0.4, SCR, 0.05)
      panel(glass, a, b, s0, s1, SCR + 0.25, TOP - 0.45, 0.05)
      // A few pale lines: two mullions a bay, a floor line every two floors.
      for (const f of [1 / 3, 2 / 3]) panel(marble, a, b, s0 + (s1 - s0) * f - 0.07, s0 + (s1 - s0) * f + 0.07, SOF + 0.4, TOP - 0.45, 0.08)
      for (let z = SOF + 7.2; z < SCR - 1; z += 7.2) panel(marble, a, b, s0, s1, z - 0.08, z + 0.08, 0.08)
      panel(marble, a, b, s0, s1, SCR - 0.05, SCR + 0.3, 0.08)
    }
    // Piers: proud of the glass, from the plaza to the top.
    for (const s of piers) {
      const s0 = Math.max(0, s - 0.5), s1 = Math.min(L, s + 0.5)
      const A0 = P(s0, PZ, 0.0), B0 = P(s1, PZ, 0.0), A1 = P(s0, PZ, 0.45), B1 = P(s1, PZ, 0.45)
      const up = (v: V3, z: number): V3 => [v[0], v[1], z]
      marble.quad(A1, B1, up(B1, TOP), up(A1, TOP))
      marble.quad(A0, A1, up(A1, TOP), up(A0, TOP))
      marble.quad(B1, B0, up(B0, TOP), up(B1, TOP))
      marble.quad(up(A1, TOP), up(B1, TOP), up(B0, TOP), up(A0, TOP))
      // Below the soffit the pier is a free-standing column: its back too.
      const Ai = P(s0, PZ, -0.5), Bi = P(s1, PZ, -0.5)
      marble.quad(B0, Bi, up(Bi, SOF), up(B0, SOF))
      marble.quad(Ai, A0, up(A0, SOF), up(Ai, SOF))
      marble.quad(Bi, Ai, up(Ai, SOF), up(Bi, SOF))
    }
  }
  // Short faces (south, north): the azulejo murals, framed in marble.
  const muralFaces: [XY, XY][] = [[[X0, Y0], [X1, Y0]], [[X1, Y1], [X0, Y1]]]
  const W = X1 - X0
  for (const [a, b] of muralFaces) {
    // A dense scatter of leaves over the whole face, four or five to a row,
    // leaning every way, with two thin waves: the blue covers about half the
    // white, as in Pessar's and Lundberg's photos of the south mural. A fixed
    // pseudo-random sequence, so the model is reproducible.
    let seed = 7
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
    for (let r = 0; r < 17; r++) {
      const z = SOF + 1.2 + r * 1.62
      if (Math.abs(z - 17.4) < 0.7 || Math.abs(z - 26.0) < 0.7) continue // the waves
      const k = r % 2 ? 4 : 5
      for (let j = 0; j < k; j++) {
        const f = (j + 0.5 + (rnd() - 0.5) * 0.5) / k
        const l = 1.6 + rnd() * 0.9, w = 0.75 + rnd() * 0.35
        leaf(blue, a, b, 0.7 + f * (W - 1.4), Math.min(TOP - 1.4, z + (rnd() - 0.5) * 0.5), l, w, (rnd() - 0.5) * 140)
      }
    }
    wave(blue, a, b, 0.5, W - 0.5, 17.4, 0.45, 0.4, 2.5)
    wave(blue, a, b, 0.5, W - 0.5, 26.0, 0.4, 0.4, 3)
  }

  // The service core on the west side, rising above the roof.
  block(marble, marble, rect(26.0, -10.2, X0, 1.8), PZ, 37.3, 0.2)

  // --- The Jewel Box: a mosaic box 8.4 m deep floating on its orange core.
  const JX0 = -45.5, JX1 = -20.8, JY0 = -16.6, JY1 = 8.4
  const JB = 4.9, JT = 13.3
  const box = rect(JX0, JY0, JX1, JY1)
  walls(mosaic, box, JB + 0.6, JT - 0.6)
  walls(marble, box, JB, JB + 0.6)
  walls(marble, box, JT - 0.6, JT)
  // The thin dark metal frame round the box: top and bottom edges and the
  // corners.
  walls(glass, inset(box, -0.06), JT - 0.28, JT)
  walls(glass, inset(box, -0.06), JB, JB + 0.28)
  for (let i = 0; i < 4; i++) {
    const a = box[i], b = box[(i + 1) % 4], Lb = Math.hypot(b[0] - a[0], b[1] - a[1])
    panel(glass, a, b, 0, 0.3, JB, JT, 0.07)
    panel(glass, a, b, Lb - 0.3, Lb, JB, JT, 0.07)
  }
  cap(marble, box, JB, false)
  cap(marble, box, JT)
  const CX = (JX0 + JX1) / 2, CY = (JY0 + JY1) / 2
  block(orange, null, rect(CX - 5, CY - 5, CX + 5, CY + 5), PZ, JB, 0)
  // The mosaic's motifs: on each face two big dark pictures on the pale
  // ground, a deep-blue vase-and-flower and a dark brown one, end to end
  // (Lundberg's photo); drawn as two long lenses filling most of the band's
  // height. The brown shares the tower glass's warm charcoal, to stay
  // within six materials.
  for (let i = 0; i < 4; i++) {
    const a = box[i], b = box[(i + 1) % 4], Lb = Math.hypot(b[0] - a[0], b[1] - a[1])
    leaf(navy, a, b, Lb * 0.27, 9.1, Lb * 0.46, 5.4, 90)
    leaf(glass, a, b, Lb * 0.74, 9.1, Lb * 0.42, 5.0, 90)
  }

  return [
    { part: marble, material: finish('bac-marble', 0xf3f2ee) },
    { part: glass, material: { ...PALETTE.window, color: 0x5a5551 } },
    { part: mosaic, material: windowVariant(2, 0xc9d2d8) },
    { part: blue, material: finish('bac-azulejo', 0x3f5aa6) },
    { part: orange, material: finish('bac-core', 0xd2713f) },
    { part: paving, material: finish('bac-paving', 0xcdb8a4) },
  ]
}

if (import.meta.main) await save('mia-bacardi-buildings', 'Bacardi Buildings', [25.797408, -80.1897131], 359.0, build(), 6500)
