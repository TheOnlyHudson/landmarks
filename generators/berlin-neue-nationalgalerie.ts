/**
 * Neue Nationalgalerie (Ludwig Mies van der Rohe, 1965-1968; restored by
 * David Chipperfield Architects 2015-2021), Potsdamer Straße 50,
 * Berlin-Tiergarten: original procedural geometry, CC0-1.0.
 * bun generators/berlin-neue-nationalgalerie.ts
 * Imports helpers from berlin-philharmonie.ts (merge that first).
 *
 * Map frame, BEARING 18.4 (the hall's axes; measured from the edges of the
 * roof, OSM way/25652320): +x model east, +y model north, z up, metres.
 * Origin = the area centroid of the podium outline way/25652321,
 * 13.367576 52.506970. z = 0 the lowest ground under the podium, at the
 * sculpture garden on the west; the terrace stands PODIUM metres above it.
 *
 * What makes it the Neue Nationalgalerie, and how each is drawn
 * - The roof: a flat black steel plate 64.8 m square and 1.8 m deep,
 *   floating on eight cruciform columns, two on each side, 28.8 m apart,
 *   so each corner cantilevers 18 m. Drawn as a real plate: the fascia with
 *   its vertical stiffeners every 3.6 m, the coffered underside of two-way
 *   steel ribs (every 3.6 m in the detail model, 7.2 m in the low one).
 * - The columns: cruciform in plan, tapering slightly, with a pin at the top.
 * - The glass hall: 50.4 m square, set back 7.2 m from the roof edge on
 *   every side; translucent glass in black steel mullions every 3.6 m, a
 *   transom at 3 m, the two dark service shafts and the cloakroom blocks
 *   seen through it.
 * - The granite podium (105 x 110 m) that levels the slope: about 1.3 m
 *   above Potsdamer Straße on the east, a full storey above the sculpture
 *   garden on the west, where the lower galleries' windows open; the stair
 *   up from the north.
 *
 * Sources
 * - OSM way/25652321 (the podium, tagged building:part=Sockelplattform,
 *   name, wikidata Q32659772), way/25652320 (the roof square, building=
 *   museum, 7.5-10 m), way/304729224 (the glass hall, 7.5 m), the eight
 *   columns way/304729192, /207, /208, /209, /215, /217, /218, /223.
 *   (c) OpenStreetMap contributors, ODbL.
 * - Published: de.wikipedia "Neue Nationalgalerie" (terrace 105 x 110 m,
 *   roof 64.8 m square, glass walls set back 7.2 m, eight columns, glass
 *   panes 5.40 x 3.40 m); en.wikipedia "Neue Nationalgalerie" (roof plate
 *   1.8 m deep, 18 m cantilever, clear height 8.4 m, 3.6 m grid).
 * - Mapterhorn terrain (bun tools/terrain.ts grid, z15): the terrace reads
 *   as a plateau 6.0 m over the sculpture garden and 1.1-1.5 m over
 *   Potsdamer Straße.
 * - Photos (Wikimedia Commons), opened and compared:
 *   "Neue Nationalgalerie 2022.jpg", Evgenii Salganik, CC BY-SA 4.0 (the
 *     north-east corner: fascia, ribs, columns, glass),
 *     https://commons.wikimedia.org/wiki/File:Neue_Nationalgalerie_2022.jpg
 *   "2021-09-02-Neue-Nationalgalerie-2021-a.jpg", Gunnar Klack,
 *     CC BY-SA 4.0 (the east front frontal: column spacing, proportions),
 *   "Neue Nationalgalerie Berlin - von oben.jpg", Raimond Spekking,
 *     CC BY-SA 4.0 (from the Kollhoff tower: roof top, podium, stair),
 *   "Neue Nationalgalerie Skulpturengarten Berlin-Tiergarten 01.jpg" and
 *     "Skulpturengarten Neue Nationalgalerie Berlin-Tiergarten.jpg",
 *     Singlespeedfahrer, CC0 (the terrace, the west and south sides),
 *   "2021-12-25 121520 Berlin Neue Nationalgalerie.jpg", Tim Rademacher,
 *     CC BY-SA 4.0 (the coffered underside),
 *   "Berlin Neue Nationalgalerie.JPG", Art4401, CC BY-SA 3.0 (the glazing,
 *     its transom and mullions).
 * - Look-only: none.
 *
 * Measured / published / estimated
 * - Published: roof 64.8 m, plate 1.8 m, clear height 8.4 m, hall 50.4 m,
 *   grid 3.6 m, columns 28.8 m apart (18 m cantilever; OSM's columns sit
 *   at 32.2 m, the frontal photo agrees with 28.8 m).
 * - From OSM: the podium's plan and the bearing.
 * - From the terrain: the podium's height (PODIUM).
 * - Colours: the steel at STYLE's charcoal (#4a4f57), the darkest thing in
 *   the model; the roof top a lighter grey; the glass dark (#46565c, 55%
 *   opaque).
 * - Estimated from the photos: column section (cross of 0.76 m arms, set 2 m in
 *   from the roof edge), the
 *   rib depth (1.0 m), the transom (3.0 m), the shafts, the stair.
 */
import { Part, type V3 } from './mesh'
import { writeModel } from './london-buckingham-palace'
import { welded, type XY } from './berlin-kit'
import { polyPrism, outQuad, upTri, edgePanel, mat } from './berlin-philharmonie'

export const BEARING = 18.4
type Q = { detail: boolean }
const LOW: Q = { detail: false }

/** Terrace height over the lowest ground under the footprint (terrain 6.0 m over the garden, less 0.3 m). */
export const PODIUM = 5.7
/** Podium outline, way/25652321 in the turned frame. */
const POD: XY[] = [[-54.0, 40.3], [-34.5, 40.4], [-34.4, 51.2], [54.5, 51.6], [55.1, 1.4], [54.5, -42.0], [18.4, -42.1], [18.4, -52.9], [-1.6, -53.0], [-53.8, -53.2]]
/** Centre of the roof square. */
const C: XY = [0.45, 0.95]

/** An axis-aligned box. */
function box(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, bottom = false) {
  polyPrism(p, p, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], z0, z1, bottom)
}

export function build(Q: Q) {
  const gran = new Part(), steel = new Part(), roof = new Part(), glass = new Part(), win = new Part()
  const Z = PODIUM, R = 32.4, CLR = 8.4, PL = 1.8, G = 25.2
  const cx = C[0], cy = C[1]

  // ===== Podium ===============================================================
  polyPrism(gran, gran, POD, 0, Z)
  // A low granite coping round the terrace edge.
  // The lower galleries' windows towards the sculpture garden (west), and the south front.
  // Only the west side faces the garden a storey down; elsewhere the terrace is barely above the street.
  for (const [a, b] of [[POD[0], POD[9]]] as [XY, XY][]) for (let k = 0; k < 6; k++) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), w = (L - 10) / 6
    edgePanel(win, a, b, 5 + k * w + 0.6, 5 + (k + 1) * w - 0.6, 0.8, 4.2)
  }
  // The stair up from the north (Sigismundstraße side), in flights.
  {
    const n = Q.detail ? 12 : 6, x0 = 8, x1 = 44, y0 = 51.6, depth = 9, zb = 2.6
    for (let k = 0; k < n; k++) box(gran, x0, y0, x1, y0 + depth * (1 - k / n), 0, zb + (Z - zb) * (k + 1) / n)
  }

  // ===== The glass hall ======================================================
  const zf = Z, zc = Z + CLR
  // Translucent walls (both faces, the material is double-sided).
  const hall: XY[] = [[cx - G, cy - G], [cx + G, cy - G], [cx + G, cy + G], [cx - G, cy + G]]
  for (let i = 0; i < 4; i++) {
    const a = hall[i], b = hall[(i + 1) % 4]
    glass.quad([a[0], a[1], zf], [b[0], b[1], zf], [b[0], b[1], zc], [a[0], a[1], zc])
  }
  // Black steel mullions every 3.6 m, the transom at 3 m, the sill and head.
  const mw = 0.14, md = 0.25
  for (let i = 0; i < 4; i++) {
    const a = hall[i], b = hall[(i + 1) % 4], L = 2 * G, ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L
    const nx = uy, ny = -ux
    for (let k = 0; k < 14; k++) {
      const s = k * 3.6, px = a[0] + ux * s, py = a[1] + uy * s
      const r: XY[] = [[px - ux * mw, py - uy * mw], [px + ux * mw, py + uy * mw], [px + ux * mw + nx * md, py + uy * mw + ny * md], [px - ux * mw + nx * md, py - uy * mw + ny * md]]
      polyPrism(steel, null, r, zf, zc)
    }
    for (const [z0, z1] of [[zf, zf + 0.25], [zf + 2.95, zf + 3.15], [zc - 0.3, zc]]) {
      const r: XY[] = [[a[0], a[1]], [b[0], b[1]], [b[0] + nx * md, b[1] + ny * md], [a[0] + nx * md, a[1] + ny * md]]
      polyPrism(steel, steel, r, z0, z1, true)
    }
  }
  // The two freestanding service shafts (dark, floor to ceiling) and the cloakroom blocks.
  for (const s of [-1, 1]) {
    box(steel, cx + s * 10.8 - 1.4, cy - 3.6, cx + s * 10.8 + 1.4, cy + 3.6, zf, zc)
    box(steel, cx + s * 10.8 - 1.8, cy - 13.0, cx + s * 10.8 + 1.8, cy - 7.4, zf, zf + 3.4)
  }

  // ===== Columns ==============================================================
  const ZT = zc
  const colAt: XY[] = []
  for (const s of [-14.4, 14.4]) colAt.push([cx + s, cy - R + 2.0], [cx + s, cy + R - 2.0], [cx - R + 2.0, cy + s], [cx + R - 2.0, cy + s])
  for (const [x, y] of colAt) {
    // Cruciform: two flanged arms crossing; tapering a little to the top.
    const arm = (w0: number, w1: number, t: number) => {
      for (const [ax, ay] of [[1, 0], [0, 1]]) {
        const r = (w: number, tt: number): XY[] => ax ? [[x - w, y - tt], [x + w, y - tt], [x + w, y + tt], [x - w, y + tt]] : [[x - tt, y - w], [x + tt, y - w], [x + tt, y + w], [x - tt, y + w]]
        const b0 = r(w0, t), b1 = r(w1, t)
        for (let i = 0; i < 4; i++) {
          const j = (i + 1) % 4
          outQuad(steel, [b0[i][0], b0[i][1], Z], [b0[j][0], b0[j][1], Z], [b1[j][0], b1[j][1], ZT - 0.25], [b1[i][0], b1[i][1], ZT - 0.25], [x, y, (Z + ZT) / 2])
        }
        upTri(steel, [b1[0][0], b1[0][1], ZT - 0.25], [b1[1][0], b1[1][1], ZT - 0.25], [b1[2][0], b1[2][1], ZT - 0.25])
        upTri(steel, [b1[0][0], b1[0][1], ZT - 0.25], [b1[2][0], b1[2][1], ZT - 0.25], [b1[3][0], b1[3][1], ZT - 0.25])
      }
    }
    arm(0.38, 0.32, 0.09)
    // Flanges at the ends of the arms make the cross read thick at a distance.
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const ex = x + dx * 0.34, ey = y + dy * 0.34, fw = 0.15, ft = 0.05
      const r: XY[] = dx ? [[ex - ft, ey - fw], [ex + ft, ey - fw], [ex + ft, ey + fw], [ex - ft, ey + fw]] : [[ex - fw, ey - ft], [ex + fw, ey - ft], [ex + fw, ey + ft], [ex - fw, ey + ft]]
      polyPrism(steel, steel, r, Z, ZT - 0.25)
    }
    // The pin bearing.
    box(steel, x - 0.22, y - 0.22, x + 0.22, y + 0.22, ZT - 0.25, ZT)
  }

  // ===== The roof plate ======================================================
  const zr0 = ZT, zr1 = ZT + PL, rib = 3.6
  const sq: XY[] = [[cx - R, cy - R], [cx + R, cy - R], [cx + R, cy + R], [cx - R, cy + R]]
  // Fascia (edge beam) full depth, roof top, and the soffit recessed 1 m above the ribs' bottom.
  polyPrism(steel, null, sq, zr0, zr1)
  for (const [a, b, c] of [[0, 1, 2], [0, 2, 3]]) upTri(roof, [sq[a][0], sq[a][1], zr1], [sq[b][0], sq[b][1], zr1], [sq[c][0], sq[c][1], zr1])
  const rd = 1.0, ins = 0.35
  const inner: XY[] = [[cx - R + ins, cy - R + ins], [cx + R - ins, cy - R + ins], [cx + R - ins, cy + R - ins], [cx - R + ins, cy + R - ins]]
  // Inner face of the edge beam (facing in), then the recessed soffit facing down.
  for (let i = 0; i < 4; i++) {
    const a = inner[i], b = inner[(i + 1) % 4]
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2
    outQuad(steel, [a[0], a[1], zr0], [b[0], b[1], zr0], [b[0], b[1], zr0 + rd], [a[0], a[1], zr0 + rd], [mx + (mx - cx), my + (my - cy), zr0 + rd / 2])
    const o = sq[i], p = sq[(i + 1) % 4]
    // The beam's bottom face between the outer edge and the inner face.
    upTri(steel, [o[0], o[1], zr0], [a[0], a[1], zr0], [b[0], b[1], zr0], false)
    upTri(steel, [o[0], o[1], zr0], [b[0], b[1], zr0], [p[0], p[1], zr0], false)
  }
  upTri(steel, [inner[0][0], inner[0][1], zr0 + rd], [inner[2][0], inner[2][1], zr0 + rd], [inner[1][0], inner[1][1], zr0 + rd], false)
  upTri(steel, [inner[0][0], inner[0][1], zr0 + rd], [inner[3][0], inner[3][1], zr0 + rd], [inner[2][0], inner[2][1], zr0 + rd], false)
  // Two-way ribs under the soffit.
  const nr = Math.round(2 * R / rib)
  for (let k = 1; k < nr; k++) {
    const s = -R + k * rib, w = 0.18
    for (const along of [0, 1]) {
      const r: XY[] = along ? [[cx + s - w, cy - R + ins], [cx + s + w, cy - R + ins], [cx + s + w, cy + R - ins], [cx + s - w, cy + R - ins]]
        : [[cx - R + ins, cy + s - w], [cx + R - ins, cy + s - w], [cx + R - ins, cy + s + w], [cx - R + ins, cy + s + w]]
      polyPrism(steel, null, r, zr0, zr0 + rd)
      upTri(steel, [r[0][0], r[0][1], zr0], [r[2][0], r[2][1], zr0], [r[1][0], r[1][1], zr0], false)
      upTri(steel, [r[0][0], r[0][1], zr0], [r[3][0], r[3][1], zr0], [r[2][0], r[2][1], zr0], false)
    }
  }
  // Vertical stiffeners on the fascia every 3.6 m (a third of them in the low model).
  const st = 3.6
  for (let i = 0; i < 4; i++) {
    const a = sq[i], b = sq[(i + 1) % 4], ux = (b[0] - a[0]) / (2 * R), uy = (b[1] - a[1]) / (2 * R), nx = uy, ny = -ux
    for (let s = st; s < 2 * R - 0.1; s += st) {
      const px = a[0] + ux * s, py = a[1] + uy * s, w = 0.1, d = 0.16
      polyPrism(steel, steel, [[px - ux * w, py - uy * w], [px + ux * w, py + uy * w], [px + ux * w + nx * d, py + uy * w + ny * d], [px - ux * w + nx * d, py - uy * w + ny * d]], zr0 + 0.05, zr1 - 0.05)
    }
  }
  // A thin pale border line on the roof top (the coping seen from the tower).
  return { gran, steel, roof, glass, win }
}

function write(Q: Q, file: string, maxTris: number) {
  const b = build(Q)
  writeModel('Neue Nationalgalerie', 'berlin-neue-nationalgalerie', [
    { part: welded(b.gran), material: mat('nng-granite', 0xd5d0c6) },
    { part: welded(b.steel, 20), material: { ...mat('nng-steel', 0x4a4f57, 0.5), floodlight: (p: V3, n: V3) => (n[2] < -0.5 ? 0.6 : 0) } },
    { part: welded(b.roof), material: mat('roof', 0x6c6e70) },
    { part: b.glass, material: { ...mat('glass', 0x46565c, 0.15), opacity: 0.55, doubleSided: true } },
    { part: welded(b.win), material: mat('window', 0x64798a, 0.35) },
  ], { bearing: BEARING, osm: 'way/25652321', height: PODIUM + 8.4 + 1.8 }, maxTris, file)
}

if (import.meta.main) {
  write(LOW, 'berlin-neue-nationalgalerie', 6500)
}
