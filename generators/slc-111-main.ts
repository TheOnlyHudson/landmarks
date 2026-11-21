/**
 * 111 Main (2016, SOM), Salt Lake City: procedural, CC0-1.0.
 * bun generators/slc-111-main.ts   (kit: slc-wells-fargo-center.ts)
 *
 * Map frame: x east, y north, z up, metres; bearing 0. Origin: the area
 * centroid of OSM way/445788207 (-111.890523, 40.766796). y = 0 is the
 * lowest ground under the outline.
 *
 * Form: a plain glass box, 48 x 38 m, on a recessed glazed lobby, its
 * floors drawn as white slab-edge bands (two storeys to a band, as STYLE.md
 * asks; the real edges are one a storey), white fins at the corners, and a
 * two-storey crown of pale fritted glass with the white diagonal "hat
 * truss" showing through it. The tower hangs from that truss so its lower
 * floors can span the Eccles Theater's back of house; the truss is what the
 * roof shows from above (NAIP) and what reads as the crown from the street.
 * The tower's south face meets the Eccles Theater (separate model,
 * slc-eccles-theater); OSM's outlines only touch, so the models don't overlap.
 *
 * OSM: way/445788207 (23 levels, height 118). Published: 24 storeys,
 * about 118 m (387 ft) (Wikipedia, "111 Main"). The 2013 lidar predates the
 * tower, so heights are the published/OSM figure and the photos.
 * Estimated from photos: lobby 8 m, recessed 1.5 m (p2); crown 10 m, the
 * top two storeys of fritted glass (p1); bands every 8.3 m; the X truss two
 * bays per face (NAIP, p1).
 *
 * Photos (EVIDENCE):
 *  p1 https://commons.wikimedia.org/wiki/File:111_south_main_slc.jpg
 *     Ricardo630, CC BY-SA 4.0 (the north face, from the north)
 *  p2 https://commons.wikimedia.org/wiki/File:Eccles_Theater_-_Salt_Lake_City,_Utah_-_13_April_2025.jpg
 *     Beneathtimp, CC0 (the south and west faces behind the theatre, from the south-west)
 * NAIP (USGS, public domain) for the roof and the truss.
 * Doubts: only two licensed photos; the east face is unphotographed, drawn
 * like the others; the lobby's real depth and the cantilever under the
 * south-east corner are not shown in any photo.
 */
import { Part, type V3 } from './mesh'
import { PALETTE } from './palette'
import { type XY, prism, cap, edges, edgeNormal, panel, boxOn, rect, chamfer, save } from './slc-wells-fargo-center'

const glassWall = new Part(), white = new Part(), crown = new Part(), roof = new Part(), lobby = new Part()

const FOOT: XY[] = [[-30.3, -16.0], [17.9, -16.2], [17.9, 21.8], [-30.1, 22.2]]
const Z_LOBBY = 8, Z_CROWN = 108, Z_TOP = 118

// Lobby: glass set 1.5 m back under the tower, white corner piers.
const inner: XY[] = [[-28.8, -14.5], [16.4, -14.7], [16.4, 20.3], [-28.6, 20.7]]
prism(lobby, inner, 0, Z_LOBBY, false)
for (const [x, y] of FOOT) prism(white, rect(x - 1.2, y - 1.2, x + 1.2, y + 1.2).map(([a, b]) => [Math.max(-30.3, Math.min(17.9, a)), Math.max(-16.2, Math.min(22.2, b))] as XY), 0, Z_LOBBY, false)
cap(white, FOOT, Z_LOBBY, false) // soffit over the recess

// Tower shaft.
const SHAFT = chamfer(FOOT, 0.4)
prism(glassWall, SHAFT, Z_LOBBY, Z_CROWN, false)
// Slab-edge bands and corner fins.
for (let z = Z_LOBBY; z < Z_CROWN - 1; z += 8.33)
  for (const [a, b] of edges(SHAFT)) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L > 2) boxOn(white, a, b, 0, L, z, z + 0.7, 0.25)
  }
for (const [a, b] of edges(FOOT)) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  // a few pale mullion lines, at the thirds of each face
  for (const t of [1 / 3, 2 / 3]) panel(white, a, b, L * t - 0.2, L * t + 0.2, Z_LOBBY, Z_CROWN, 0.12)
}

// Crown: fritted glass, white rails top and bottom, the X truss on each face.
prism(crown, SHAFT, Z_CROWN, Z_TOP, false)
cap(roof, SHAFT, Z_TOP - 0.3, true)
for (const [a, b] of edges(SHAFT)) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (L < 2) continue
  boxOn(white, a, b, 0, L, Z_CROWN, Z_CROWN + 1.0, 0.3)
  boxOn(white, a, b, 0, L, Z_TOP - 0.9, Z_TOP + 0.4, 0.3, 0.3)
  // two X panels per face: diagonal strips flush on the glass
  const n = edgeNormal(a, b), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  const P = (s: number, z: number, o: number): V3 => [a[0] + t[0] * s + n[0] * o, a[1] + t[1] * s + n[1] * o, z]
  const strip = (s0: number, z0: number, s1: number, z1: number) => {
    const w = 0.55, o = 0.1
    white.quad(P(s0 - w, z0, o), P(s0 + w, z0, o), P(s1 + w, z1, o), P(s1 - w, z1, o))
  }
  const z0 = Z_CROWN + 1, z1 = Z_TOP - 0.9
  for (let k = 0; k < 2; k++) {
    const s0 = (L * k) / 2 + 0.8, s1 = (L * (k + 1)) / 2 - 0.8
    strip(s0, z0, s1, z1)
    strip(s1, z0, s0, z1)
  }
}
// Rooftop plant.
prism(roof, rect(-14, -4, 4, 10), Z_TOP - 0.3, Z_TOP + 2.5)

save('slc-111-main', '111 Main', [
  // The curtain wall's blue-green glass (p1, p2), pulled light; it is lit office floors at night.
  { part: glassWall, material: { name: 'window', color: 0x62809c, roughness: 0.3 } },
  { part: white, material: PALETTE.trim },
  // The crown's fritted glass reads pale and milky by day and stays dark at night.
  { part: crown, material: { name: 'glass', color: 0xbfd0da, roughness: 0.3 } },
  { part: roof, material: PALETTE.roof },
  { part: lobby, material: { name: 'entrance', color: 0x8ea3b2, roughness: 0.3 } },
], Z_TOP + 2.5)
