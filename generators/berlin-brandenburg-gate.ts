/**
 * Brandenburger Tor, Pariser Platz, Berlin (Carl Gotthard Langhans,
 * 1788-1791; Quadriga by Johann Gottfried Schadow, 1793): original procedural
 * geometry, CC0-1.0.
 * bun generators/berlin-brandenburg-gate.ts → models/berlin-brandenburg-gate.glb
 *
 * Map frame, turned to BEARING 353.8 (the axis of the two column rows in
 * OSM): +y runs along the gate (compass 353.8, "north"), +x out of the city
 * side (compass 83.8, east, to Pariser Platz and Unter den Linden). z up,
 * metres, z = 0 the ground (Pariser Platz is flat). Origin = the centroid of
 * the twelve OSM columns.
 *
 * What makes it the Brandenburg Gate, and how each is drawn
 * - Twelve Doric columns with bases, six on each face, in two rows: big
 *   tapering 12-sided shafts, a flared echinus and square abacus (photos).
 * - The five passages between the columns: the middle one wider, separated by
 *   solid transverse walls behind the column pairs, the walls paler than the
 *   weathered columns, with their relief panels and roundels on the passage
 *   sides (flush panels).
 * - The deep entablature with the triglyph frieze and cornice running the
 *   whole length, past the end columns.
 * - The attic: the raised central block with Schadow's relief on the city
 *   (east) face, the stepped side parts with green copper on the steps, and
 *   the plain end blocks.
 * - The Quadriga in green copper on the central block, facing east into the
 *   city: four horses abreast stepping out, the two-wheeled chariot, and
 *   Victoria with her wings and the staff carrying the oak wreath, Iron Cross
 *   and eagle. Drawn bolder than life (horses girth 1.4, wreath 1.3 m) to
 *   read at 200 px.
 *
 * Not included: the two gatehouses (Torhäuser) and their colonnades either
 * side (OSM way/375247938, way/518071762, way/206159289, way/518071779 and
 * their parts) are separate OSM buildings outside the gate's outline; the map
 * keeps drawing them.
 *
 * Sources
 * - OSM way/518071791 (building=gate, height 26, wikidata Q82425) and its
 *   parts: the 12 columns (way/206159275..86, 13.5 m), the transverse walls
 *   (way/206159287, 288, 290, 292, 293, 206001643, 13.5 m), the entablature
 *   (way/496376285, 13.5-16; way/206004656, 16-16.8, copper), the attic
 *   (way/1222287190 16.8-20; way/1222287191 and way/496376284 16.8-19.7),
 *   (c) OpenStreetMap contributors, ODbL.
 * - Berlin LoD2 3D building model (Geoportal Berlin / gdi.berlin.de, tile
 *   LoD2_389_5819, Datenlizenz Deutschland Zero 2.0): the gate's ground
 *   34.88 m NHN, top of the attic 19.5-20.7 m above it, footprint
 *   15 x 33.4 m matching OSM. LoD2 has no Quadriga.
 * - Wikipedia (de) "Brandenburger Tor": 20.3 m high without the Quadriga,
 *   about 26 m with it, 62.5 m wide with the wings, 11 m deep; columns 13.5 m
 *   high, 1.73 m at the base; middle passage 5.65 m, the others 3.80 m;
 *   horses 12 Fuss (3.77 m); the relief on the city side only; the Quadriga
 *   faces east into the city.
 * - Photos (Wikimedia Commons), opened and compared:
 *   "Brandenburger Tor morgens.jpg", Thomas Wolf (www.foto-tw.de), CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Brandenburger_Tor_morgens.jpg
 *     (east face from Pariser Platz, level: columns, walls with roundels and
 *     panels, attic relief, steps, the Quadriga from the front);
 *   "Berlin Brandenburger Tor BW 1.jpg", Berthold Werner, CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Berlin_Brandenburger_Tor_BW_1.jpg
 *     (west face, frontal: column spacing, entablature and attic widths, the
 *     plain west attic, Victoria from behind);
 *   "Berlin, Brandenburger Tor -- 2019 -- 6335.jpg", Dietmar Rabich, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Berlin,_Brandenburger_Tor_--_2019_--_6335.jpg
 *     (the Quadriga close up: horse poses, the chariot, Victoria, the staff;
 *     the stepped attic with copper flashing);
 *   "Brandenburg Gate - Brandenburger Tor - Berlin - Germany - 01.jpg", Norbert Nagel, CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Brandenburg_Gate_-_Brandenburger_Tor_-_Berlin_-_Germany_-_01.jpg
 *     (from the south-east: the Quadriga's height over the attic, the walls'
 *     relief panels, roundels and lower panels);
 *   "Berlin, Brandenburger Tor -- 2013 -- 4589.jpg", Dietmar Rabich, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Berlin,_Brandenburger_Tor_--_2013_--_4589.jpg
 *   "Brandenburger Tor nachts.jpg", Thomas Wolf (www.foto-tw.de), CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Brandenburger_Tor_nachts.jpg
 *     (night: the whole gate floodlit warm, the Quadriga lit from below).
 * - Look-only: none.
 *
 * Measured / published / estimated
 * - Published: column height 13.5, base diameter 1.73, passage widths (so the
 *   column and wall centres at y = +-3.725, +-9.325, +-14.925), attic top 20.3.
 * - OSM: the row spacing (x = +-4.2), the end walls reaching 1.5 m past the
 *   end columns, the entablature 13.5-16.8, the attic parts.
 * - Estimated from the photos (scaled by the column height): the wall
 *   thickness 1.8 m, capital 12.3-13.5, architrave/frieze/cornice split
 *   (14.7 / 15.95 / 16.8), the attic course heights (front course 17.3,
 *   steps to 19.4, end blocks and central block 19.7 / 20.3), the relief
 *   panel, the Quadriga's size (horse withers 2.3 m, drawn heavy; Victoria
 *   3.4 m standing in the car; the wreath at 25.75, the eagle to 27.5).
 * - Invented: the exact horse poses (one foreleg lifted, the outer horses
 *   turned out a little), the chariot's shape, the eagle's outline.
 *
 * Doubts
 * - The total height: the morning photo scales the eagle to ~28 m, Nagel's
 *   to ~27.2 m, the published figure is ~26 m; the model reaches 27.5.
 * - The walls' lower panels (two tall recesses per face) are left out; only
 *   the relief panel and the roundel are drawn.
 * - The metope reliefs, the relief figures and the coffered passage
 *   ceilings are left out.
 */
import { Part, type V3, type MaterialSpec } from './mesh'
import { tube, ellipsoid, lathe, solid, slab, face, smooth, TAU } from './nyc-columbus-monument'
import { writeModel, box, cbox } from './london-buckingham-palace'
import { place, figure, animal, ell, tri, type Q } from './london-albert-memorial'

export const BEARING = 353.8

/** A flat panel on the plane x = x0 (facing +x if dir > 0), y0..y1, z0..z1. */
function xPanel(p: Part, x0: number, dir: 1 | -1, y0: number, y1: number, z0: number, z1: number, d = 0.06) {
  const x = x0 + dir * d
  face(p, [x, y0, z0], [x, y1, z0], [x, y1, z1], [x, y0, z1], [x - dir, (y0 + y1) / 2, (z0 + z1) / 2])
}
/** A flat panel on the plane y = y0 (facing +y if dir > 0). */
function yPanel(p: Part, y0: number, dir: 1 | -1, x0: number, x1: number, z0: number, z1: number, d = 0.06) {
  const y = y0 + dir * d
  face(p, [x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1], [(x0 + x1) / 2, y - dir, (z0 + z1) / 2])
}
/** A flat disc on the plane y = y0, facing dir. */
function yDisc(p: Part, y0: number, dir: 1 | -1, cx: number, cz: number, r: number, n = 10, d = 0.06) {
  const y = y0 + dir * d
  const pts = Array.from({ length: n }, (_, i): V3 => [cx + r * Math.cos(i * TAU / n), y, cz + r * Math.sin(i * TAU / n)])
  for (let i = 1; i < n - 1; i++) tri(p, pts[0], pts[i], pts[i + 1], [cx, y - dir, cz])
}

function build() {
  const wall = new Part(), sand = new Part(), trim = new Part(), copper = new Part(), quad = new Part()

  // ===== Plan =============================================================
  const XC = 4.2 // column rows
  const YC = [-14.925, -9.325, -3.725, 3.725, 9.325, 14.925] // column/wall centres
  const WT = 0.9 // half the wall thickness
  const YE = 16.4 // outer face of the end walls
  const ZK = 13.5 // top of the capitals
  const ZA = 14.7, ZF = 15.95, ZR = 16.8 // architrave top, frieze top, cornice top

  // ===== Transverse walls (pale), with their relief panels =================
  for (let i = 0; i < 6; i++) {
    const y = YC[i]
    const y0 = i === 0 ? -YE : y - WT, y1 = i === 5 ? YE : y + WT
    cbox(wall, -XC + 0.2, y0, XC - 0.2, y1, 0, ZK, 0.15)
    // A base course, and the panels on the faces that look into a passage.
    cbox(sand, -XC + 0.1, y0 - 0.08, XC - 0.1, y1 + 0.08, 0, 0.6, 0.1)
    for (const dir of [-1, 1] as const) {
      if ((i === 0 && dir < 0) || (i === 5 && dir > 0)) continue
      const yf = dir > 0 ? y1 : y0
      yPanel(sand, yf, dir, -2.1, 2.1, 5.6, 7.6) // the rectangular relief
      yDisc(sand, yf, dir, 0, 9.4, 0.85, 10) // the roundel
      yPanel(trim, yf, dir, -2.6, 2.6, 2.0, 2.2, 0.04) // a dado line
    }
  }
  // The end walls' outer faces carry pilaster strips where the wings abut.
  for (const s of [-1, 1] as const) yPanel(sand, s * YE, s, -XC - 0.1, XC + 0.1, 0.6, ZK, 0.05)

  // ===== Columns: Doric with bases =========================================
  for (const sx of [-1, 1]) for (const y of YC) {
    const cx = sx * XC
    cbox(sand, cx - 1.0, y - 1.0, cx + 1.0, y + 1.0, 0, 0.35, 0.12) // granite plinth
    // Shaft and echinus smooth-shaded round, creased at the base torus and the capital.
    smooth(sand, (q) => lathe(q, [[0.98, 0.35], [0.98, 0.52], [0.865, 0.64], [0.72, 12.25]], 12, cx, y, false), 40)
    smooth(sand, (q) => lathe(q, [[0.72, 12.25], [0.8, 12.55], [1.0, 12.85]], 12, cx, y, true), 40)
    cbox(sand, cx - 1.02, y - 1.02, cx + 1.02, y + 1.02, 12.85, ZK, 0.08) // abacus
  }

  // ===== Entablature =======================================================
  const XA = 4.95, YA = 16.3 // architrave/frieze faces
  cbox(sand, -XA, -YA, XA, YA, ZK, ZA, 0.2)
  // The architrave's soffit over the passages and between the rows.
  sand.quad([-XA, YA, ZK], [XA, YA, ZK], [XA, -YA, ZK], [-XA, -YA, ZK])
  cbox(sand, -XA + 0.08, -YA + 0.08, XA - 0.08, YA - 0.08, ZA, ZF, 0.2) // frieze, set back a hair
  trim.quad([-XA - 0.02, -YA - 0.02, ZA - 0.18], [XA + 0.02, -YA - 0.02, ZA - 0.18], [XA + 0.02, -YA - 0.02, ZA], [-XA - 0.02, -YA - 0.02, ZA])
  // Triglyphs: over each column and two over each interval (the Doric rhythm).
  const tg: number[] = []
  for (let i = 0; i < 6; i++) {
    tg.push(YC[i])
    if (i < 5) {
      const n = i === 2 ? 3 : 2
      for (let k = 1; k <= n; k++) tg.push(YC[i] + (YC[i + 1] - YC[i]) * k / (n + 1))
    }
  }
  tg.push(-YA + 0.45, YA - 0.45)
  for (const sx of [-1, 1] as const) for (const y of tg) {
    xPanel(trim, sx * (XA - 0.08), sx, y - 0.32, y + 0.32, ZA + 0.05, ZF - 0.05, 0.1)
  }
  for (const sy of [-1, 1] as const) for (const x of [-3.3, -1.1, 1.1, 3.3]) yPanel(trim, sy * (YA - 0.08), sy, x - 0.32, x + 0.32, ZA + 0.05, ZF - 0.05, 0.1)
  // Cornice: a moulded bed and the projecting corona.
  cbox(trim, -XA - 0.3, -YA - 0.3, XA + 0.3, YA + 0.3, ZF, ZF + 0.35, 0.2)
  cbox(trim, -XA - 0.75, -YA - 0.65, XA + 0.75, YA + 0.65, ZF + 0.35, ZR, 0.25)
  // Soffit of the corona, seen from the street.
  trim.quad([-XA - 0.75, YA + 0.65, ZF + 0.35], [XA + 0.75, YA + 0.65, ZF + 0.35], [XA + 0.75, -YA - 0.65, ZF + 0.35], [-XA - 0.75, -YA - 0.65, ZF + 0.35])

  // ===== Attic =============================================================
  const XT = 4.85
  // Low front course all round, the steps rising behind it, copper on the treads.
  cbox(wall, -XT, -YA + 0.3, XT, YA - 0.3, ZR, 17.3, 0.15)
  const nSteps = 5
  for (let k = 0; k < nSteps; k++) {
    const x = XT - 0.32 * (k + 1), z1 = 17.3 + 0.42 * (k + 1)
    for (const sy of [-1, 1]) {
      const ya = sy > 0 ? 5.0 : -12.7, yb = sy > 0 ? 12.7 : -5.0
      box(wall, -x, ya, x, yb, 17.3 + 0.42 * k, z1, false)
      copper.quad([-x, ya, z1], [x, ya, z1], [x, yb, z1], [-x, yb, z1])
    }
  }
  // End blocks, plain, to the attic cornice.
  for (const sy of [-1, 1]) {
    const ya = sy > 0 ? 12.7 : -YA + 0.3, yb = sy > 0 ? YA - 0.3 : -12.7
    cbox(wall, -XT, ya, XT, yb, 17.3, 19.35, 0.15)
    cbox(trim, -XT - 0.15, ya - (sy < 0 ? 0.15 : 0), XT + 0.15, yb + (sy > 0 ? 0.15 : 0), 19.35, 19.75, 0.12)
  }
  // The raised central block, its cornice, and the relief on the city (east) face.
  const YM = 5.1, ZM = 19.8, ZT = 20.35
  cbox(wall, -XT - 0.15, -YM, XT + 0.15, YM, ZR, ZM, 0.15)
  cbox(trim, -XT - 0.45, -YM - 0.3, XT + 0.45, YM + 0.3, ZM, ZT, 0.2)
  copper.quad([-XT - 0.3, -YM - 0.15, ZT + 0.01], [XT + 0.3, -YM - 0.15, ZT + 0.01], [XT + 0.3, YM + 0.15, ZT + 0.01], [-XT - 0.3, YM + 0.15, ZT + 0.01])
  xPanel(sand, XT + 0.15, 1, -4.4, 4.4, 17.55, 19.45, 0.08)
  // West face: the empty panel's frame only.
  xPanel(trim, -XT - 0.15, -1, -4.4, 4.4, 19.25, 19.45, 0.05)
  xPanel(trim, -XT - 0.15, -1, -4.4, 4.4, 17.55, 17.75, 0.05)

  // ===== The Quadriga =====================================================
  {
    const Qs: Q = { tube: 6, ell: 7, rows: 4, ring: 8, detail: true }
    const Z0 = ZT
    const yaw = -Math.PI / 2 // local +y (forward) → model +x (east)
    // Four horses abreast, stepping out: the outer two turned out a little.
    const lanes = [-2.55, -0.85, 0.85, 2.55]
    for (const ly of lanes) {
      const outer = Math.abs(ly) > 1.5
      place(quad, [1.2, ly, Z0], yaw - (outer ? Math.sign(ly) * 0.16 : Math.sign(ly) * 0.04), 1,
        (q) => animal(q, Qs, 'horse', 2.3, { rear: 0.08, lift: 0.55, toss: 0.1, girth: 1.65 }), 88)
    }
    // The chariot: a deep car behind the horses, its two wheels, the pole.
    const cx = -1.9
    solid(quad, [ell(cx, 0, Z0 + 0.45, 0.85, 1.1, 8), ell(cx + 0.15, 0, Z0 + 1.6, 1.0, 1.2, 8)])
    for (const s of [-1, 1]) {
      const n = 10, r = 0.95, yw = s * 1.35
      const ring = (dy: number) => Array.from({ length: n }, (_, k): V3 => [cx + r * Math.cos(k * TAU / n), yw + dy, Z0 + r + 0.02 + r * Math.sin(k * TAU / n)])
      const o0 = ring(-0.14), o1 = ring(0.14)
      for (let k = 0; k < n; k++) face(quad, o0[k], o0[(k + 1) % n], o1[(k + 1) % n], o1[k], [cx, yw, Z0 + r])
      for (let k = 1; k < n - 1; k++) { tri(quad, o1[0], o1[k], o1[k + 1], [cx, yw - s, Z0 + r]); tri(quad, o0[0], o0[k], o0[k + 1], [cx, yw + s, Z0 + r]) }
    }
    tube(quad, [[cx + 0.9, 0, Z0 + 0.9], [0.6, 0, Z0 + 1.7]], [0.13, 0.11], 4)
    // Victoria, standing in the car, facing east with the horses, her wings
    // raised behind her, the staff held up in her right hand.
    place(quad, [cx - 0.1, 0, Z0 + 0.9], yaw, 1, (q) => {
      figure(q, Qs, 3.4, {
        girth: 1.35,
        wings: { span: 0.62, lift: 0.95, back: 0.55 },
        arms: [
          // Right arm (+x local is her right... facing +y, her right is +x) up to the staff.
          [[0.13, 0, 0.8], [0.28, 0.1, 0.88], [0.36, 0.15, 0.95]],
          // Left arm forward, holding the reins.
          [[-0.13, 0, 0.8], [-0.2, 0.2, 0.68], [-0.15, 0.4, 0.66]],
        ],
      })
    }, 88)
    // The staff (her right side: local +x → model -y when facing +x), wreath, cross and eagle.
    const sy = -1.35, sx = cx + 0.4
    tube(quad, [[sx, sy, Z0 + 2.6], [sx, sy, Z0 + 4.35]], [0.11, 0.1], 5)
    {
      // Oak wreath: a bold ring in the plane facing east, the Iron Cross inside.
      const n = 12, R = 0.6, zc = Z0 + 5.1
      const ring = (r: number, dx: number) => Array.from({ length: n }, (_, k): V3 => [sx + dx, sy + r * Math.cos(k * TAU / n), zc + r * Math.sin(k * TAU / n)])
      const a0 = ring(R + 0.18, -0.12), a1 = ring(R + 0.18, 0.12), b0 = ring(R - 0.18, -0.12), b1 = ring(R - 0.18, 0.12)
      for (let k = 0; k < n; k++) {
        const j = (k + 1) % n, c: V3 = [sx, sy, zc]
        face(quad, a1[k], a1[j], b1[j], b1[k], [sx - 1, sy, zc]) // east face
        face(quad, a0[k], a0[j], b0[j], b0[k], [sx + 1, sy, zc]) // west face
        face(quad, a0[k], a0[j], a1[j], a1[k], c) // outer rim
        face(quad, b0[k], b1[k], b1[j], b0[j], [sx, sy + (b0[k][1] - sy) * 3, zc + (b0[k][2] - zc) * 3]) // inner rim
      }
      // The cross: two bars in the ring.
      box(quad, sx - 0.08, sy - 0.5, sx + 0.08, sy + 0.5, zc - 0.13, zc + 0.13)
      box(quad, sx - 0.08, sy - 0.13, sx + 0.08, sy + 0.13, zc - 0.5, zc + 0.5)
      // The staff on through the wreath to the eagle.
      tube(quad, [[sx, sy, zc + R + 0.15], [sx, sy, zc + R + 0.3]], [0.09, 0.08], 5)
      // The Prussian eagle: body, head, and wings spread up and out.
      const ez = zc + R + 0.3
      ellipsoid(quad, [sx, sy, ez + 0.25], [0.2, 0.2, 0.38], 7, 4)
      ellipsoid(quad, [sx + 0.12, sy, ez + 0.7], [0.14, 0.12, 0.14], 6, 3)
      for (const s of [-1, 1]) slab(quad, [sx, sy + s * 0.12, ez + 0.4], [0, s * Math.cos(0.75), Math.sin(0.75)], [0.15, 0, 0.98],
        [[0, -0.12], [0.75, -0.04], [0.85, 0.2], [0.5, 0.3], [0.05, 0.16]], 0.1)
    }
  }
  return { wall, sand, trim, copper, quad }
}

if (import.meta.main) {
  const { wall, sand, trim, copper, quad } = build()
  // Night: the gate is floodlit warm from all round, brightest on the faces,
  // the attic and Quadriga lit from below; the tops of the steps barely.
  const lit = (p: V3, n: V3) => (n[2] > 0.9 ? 0.25 : Math.min(1, 0.65 + p[2] / 40))
  const mat = (name: string, color: number, roughness = 0.85): MaterialSpec => ({ name, color, roughness })
  writeModel('Brandenburg Gate', 'berlin-brandenburg-gate', [
    { part: wall, material: { ...mat('brandenburg-wall', 0xeee3cb), floodlight: lit } },
    { part: sand, material: { ...mat('brandenburg-sandstone', 0xd8ccb2), floodlight: lit } },
    { part: trim, material: { ...mat('trim', 0xf3e9d6), floodlight: lit } },
    { part: copper, material: { ...mat('copper', 0x80a28d), floodlight: () => 0.15 } },
    { part: quad, material: { ...mat('quadriga-copper', 0x5f9a85, 0.6), floodlight: (p, n) => (n[2] < -0.2 ? 0.9 : 0.7) } },
  ], { bearing: BEARING, osm: 'way/518071791', height: 27.2 }, 6500)
}
