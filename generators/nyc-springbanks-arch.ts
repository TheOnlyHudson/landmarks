/**
 * Springbanks Arch (Springbank Arch), Central Park, under the bridle path
 * and the old carriage road at the 102nd Street crossing (Calvert Vaux and
 * Jacob Wrey Mould, 1863) — procedural, CC0-1.0, no textures.
 * bun generators/nyc-springbanks-arch.ts
 *
 * Built with the portal kit in nyc-balcony-bridge.ts and the arch kit in
 * nyc-greyshot-arch.ts.
 *
 * Frame (mesh.ts map frame): y through the arch (bearing 17.6°, NNE, down
 * the spring's run toward the Loch: the placement's bearing), x across it
 * (bearing 107.6°), z up, metres; z = 0 is the stream bed at the north
 * portal. Anchor: the centroid of OSM way/387351393 (man_made=bridge,
 * "Springbanks Arch"), 22 m along y (the vault's length) by 7 m.
 *
 * Evidence
 * - OSM (ODbL): the bridge outline way/387351393.
 * - Published (Wikipedia, "List of bridges in Central Park", citing the
 *   Central Park Conservancy): faced with stone and topped by an
 *   entablature, the vault lined with red brick; the vault 71 ft (21.6 m)
 *   long, 17 ft 5 in (5.31 m) wide and 9 ft 2 in (2.79 m) high; a
 *   cast-iron railing 50 ft 8 in (15.44 m) long on the deck's side; a
 *   small flight of steps at the south end of the underpass.
 * - Map terrain (Mapterhorn z15, bearing 17.6, 2.5 m grid): the deck flat
 *   at 4.6–4.7 m from y +7.5 to −7.5 (5.0 m further south); the spring's
 *   bed 0–0.3 m north of y +12.5; the south end a shallower dip at 2.3–3 m.
 *   The portals stand at y +10.6 and −11.0; the entablature's top and the road
 *   fill at 4.1 m and the coping at 4.4 m, under the map's deck at 4.6.
 * - Photos (Wikimedia Commons; copies in
 *   landmarks-scratch/nyc-parks-2/work/nyc-springbanks-arch/photos):
 *   Epicgenius, "Central Park May 2019 71.jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Central_Park_May_2019_71.jpg
 *     (the north face from the path: the low elliptical arch with its
 *     moulded archivolt, the entablature, the wing walls sweeping down in
 *     quarter curves, the black cast-iron railing on the coping);
 *   Jim.henderson, "Springbank Arch (1) jeh.jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Springbank_Arch_(1)_jeh.jpg
 *     (the same face from down the stream: the railing's length and its
 *     scrolled end, the face's grey-buff ashlar);
 *   Jay (Commons author field), "Springbank Arch just before sunset 02.jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Springbank_Arch_just_before_sunset_02.jpg
 *     (the face at dusk: the vault lit inside).
 * - Estimated from the photos, scaled to the published span: the arch a
 *   semi-ellipse springing 1.2 m up with its crown at 3.2 m (2.8 m over the
 *   path, 0.4 m over the stream bed); the archivolt 0.55 m; the face
 *   8.0 m between the wings, each wing 3.4 m long falling from 3.65 m to
 *   1.2 m and sweeping 1.4 m forward in plan; the railing 1.1 m high over
 *   14.8 m.
 *
 * Simplified: the railing's scrollwork is one see-through grey band
 * between black rails and posts; the ashlar is plain.
 *
 * Doubts: the published railing is on the "southern side", but the
 * photographed face, with the spring running from it toward the Loch, is
 * the north face; the railing is drawn on both faces and the south face
 * (no licensed photo) is drawn like the north one. The south portal's
 * ground is higher (the steps); the terrain covers its lower part.
 */
import { Part, type V3 } from './mesh'
import { finishModel } from './nyc-570-lexington'
import { band, box, qn } from './nyc-greyshot-arch'
import { archPr, barrel, openFace, ring } from './nyc-balcony-bridge'

const face = new Part(), trim = new Part(), brick = new Part(), iron = new Part(), lattice = new Part(), road = new Part()
const A = 2.65, SPRING = 1.2, RISE = 2.0, ENT = 4.1, COPE = 4.4, FILL = 4.1, HC = 4.0, WL = 3.4, WLO = 1.2, PT = 0.7, DEPTH = 2.5
const pr = archPr('ellipse', A, RISE, SPRING, 12)
/** The wing's top, a quarter curve from the entablature's foot down to WLO. */
const wingTop = (u: number) => WLO + (ENT - 0.45 - WLO) * Math.sqrt(Math.max(0, 1 - (u / WL) ** 2))
/** How far the wing has swept forward of the face at u along it. */
const wingOut = (u: number) => 1.4 * (1 - Math.sqrt(Math.max(0, 1 - (u / WL) ** 2)))

for (const [s, y] of [[1, 10.6], [-1, -11.0]] as const) {
  const yb = y - s * DEPTH, yp = y - s * PT
  // the face between the wings, the archivolt, the barrel (brick) behind
  openFace(face, y, s, pr, -HC, HC, () => ENT, 4)
  ring(trim, y, s, pr, 0.55, 0.12)
  barrel(brick, pr, y, yb)
  openFace(face, yb, -s, pr, -HC, HC, () => FILL, 2)
  // the entablature: a frieze band and a projecting cornice
  band(trim, s, Math.abs(y), 0.1, [-HC, HC], () => ENT - 0.45, () => ENT - 0.1)
  // the coping slab on top, overhanging the face; the road fill behind it
  const [ya, yc] = s > 0 ? [yp, y + 0.15] : [y - 0.15, yp]
  box(trim, -HC - 0.15, HC + 0.15, ya, yc, ENT - 0.1, COPE)
  qn(road, [-HC, yp, FILL], [HC, yp, FILL], [HC, yb, FILL], [-HC, yb, FILL], [0, 0, 1])
  for (const x of [-HC, HC]) qn(face, [x, yp, 0], [x, yb, 0], [x, yb, ENT], [x, yp, ENT], [Math.sign(x), 0, 0])
  // the wings: walls sweeping down from the entablature's foot, coped
  for (const sx of [-1, 1]) {
    const us = Array.from({ length: 7 }, (_, i) => (WL * i) / 6)
    for (let i = 0; i + 1 < us.length; i++) {
      const a = us[i], b = us[i + 1], xa = sx * (HC + a), xb = sx * (HC + b), ta = wingTop(a), tb = wingTop(b)
      // the wing curves forward in plan, a quarter sweep
      const fa = y + s * wingOut(a), fb = y + s * wingOut(b), pa = fa - s * PT, pb = fb - s * PT
      const nf: V3 = [-sx * (wingOut(b) - wingOut(a)), s * (b - a), 0]
      qn(face, [xa, fa, 0], [xb, fb, 0], [xb, fb, tb], [xa, fa, ta], nf)
      qn(face, [xa, pa, 0], [xb, pb, 0], [xb, pb, tb], [xa, pa, ta], [-nf[0], -nf[1], 0])
      // the coping along the sweep, a rounded roll proud on both sides
      const oa = fa + s * 0.1, ob = fb + s * 0.1, ia = pa - s * 0.1, ib = pb - s * 0.1
      qn(trim, [xa, oa, ta + 0.05], [xb, ob, tb + 0.05], [xb, ib, tb + 0.05], [xa, ia, ta + 0.05], [-(tb - ta) * sx, 0, b - a])
      qn(trim, [xa, oa, ta - 0.3], [xb, ob, tb - 0.3], [xb, ob, tb + 0.05], [xa, oa, ta + 0.05], nf)
      qn(trim, [xa, ia, ta - 0.3], [xb, ib, tb - 0.3], [xb, ib, tb + 0.05], [xa, ia, ta + 0.05], [-nf[0], -nf[1], 0])
    }
    const xe = sx * (HC + WL), fe = y + s * wingOut(WL)
    qn(face, [xe, fe, 0], [xe, fe - s * PT, 0], [xe, fe - s * PT, WLO], [xe, fe, WLO], [sx, 0, 0])
  }
  // the cast-iron railing on the coping: rails and posts in its black
  // paint, the open scrollwork between them a lighter see-through grey
  const yr = y - s * 0.3, RL = HC + WL, z0 = COPE, z1 = COPE + 1.1
  box(lattice, -RL, RL, yr - 0.025, yr + 0.025, z0 + 0.12, z1 - 0.08)
  box(iron, -RL, RL, yr - 0.06, yr + 0.06, z1 - 0.08, z1)
  box(iron, -RL, RL, yr - 0.05, yr + 0.05, z0, z0 + 0.12)
  for (let k = 0; k <= 8; k++) {
    const x = -RL + (2 * RL * k) / 8 // posts
    box(iron, x - 0.07, x + 0.07, yr - 0.08, yr + 0.08, z0, z1 + 0.12)
  }
}

finishModel('Springbanks Arch', 'nyc-springbanks-arch', [
  { part: face, material: { name: 'stone', color: 0xa9a497, roughness: 0.9 } },
  { part: trim, material: { name: 'trim', color: 0xbdb7a8, roughness: 0.85 } },
  { part: brick, material: { name: 'brick', color: 0xa87562, roughness: 0.9 } },
  { part: iron, material: { name: 'cast-iron', color: 0x4a4f57, roughness: 0.6 } },
  { part: lattice, material: { name: 'railing-scrollwork', color: 0x7d828a, roughness: 0.7 } },
  { part: road, material: { name: 'road-fill', color: 0x8e8e8c, roughness: 0.95 } },
], { bearing: 17.6, osm: 'way/387351393', height: COPE + 1.22 }, 5000)
