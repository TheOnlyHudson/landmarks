/**
 * Pullen Park Carousel and its carousel house, Raleigh (Dentzel carousel,
 * 1900/1911, at Pullen Park since 1921; present house of the 2011
 * renovation) — original procedural geometry, CC0-1.0.
 * bun generators/ral-pullen-park-carousel.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centre of OSM way/47933092 ("Carousel", historic,
 * NRHP 76001344, Q7259432), 35.779940, -78.663785. Bearing 0. The OSM
 * outline is a twenty-sided polygon, corners 12.75 m from the centre at
 * compass angles 3° + 18°k; the model follows it. (OSM way/47933095,
 * "Carousel Pavilion", is a separate picnic shelter 25–40 m to the west;
 * it does not overlap and is not part of this model.)
 *
 * Identity (photos below): a carousel house under a ten-sided roof. A low
 * red brick plinth; pale green shingled piers either side of a tall glazed
 * bay in red frames on each of the ten faces, with glazed door bays turning
 * the corners; a deep dark green eave with a pale soffit; a pale grey
 * shingle roof with red hip caps rising to a clerestory drum whose faces
 * each carry a window, an oval and a window in red frames, under a dark
 * green cornice, a low cap and a weathervane. The glazing is opaque
 * `window` (dark by day as in the photo, lit at night when the carousel
 * runs); the carousel itself is inside and not modelled, since from map
 * angles the roof hides it (a translucent version was tried and read as
 * washed-out white glass).
 *
 * Evidence:
 *  - plan: OSM way/47933092 (twenty even sides, 12.75 m to the corners):
 *    the walls follow it, alternating window faces (with piers) and door
 *    faces; the roof, eave and drum are ten-sided with their corners over
 *    the door faces, as in RadioFan's photo.
 *  - heights (no published figures; no lidar covers Raleigh): estimated by
 *    scaling RadioFan's photo on the doors (taken as 2.3 m): plinth 0.8 m,
 *    eave soffit 4.3 m, fascia to 4.8 m, eave 1.6 m deep; roof at ~38° up
 *    to the drum (radius 6.4 m) at 11.2 m; drum to 13.6 m; cornice 14 m;
 *    cap 14.9 m; vane 16.2 m.
 *  - ground: Mapterhorn z13 falls 2.2 m from north to south across the
 *    site. y = 0 is the lowest ground (south); the doors and plinth are set
 *    from 0.6 m, the ground at the centre, so the north plinth sinks into
 *    the slope. Elevation 0.
 *  - colours from the photo, pulled to the palette's lightness.
 *
 * Photos (EVIDENCE):
 *  - Pullen Park carousel building.jpg, RadioFan, CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:Pullen_Park_carousel_building.jpg
 *    (the house: plinth, piers, bays, eave, roof, hip caps, drum, vane)
 *  - Pullen Park Carousel 01.JPG, Hudacko, CC BY-SA 3.0, and Pullen Park
 *    carousel, twbuckner, CC BY 2.0
 *    https://commons.wikimedia.org/wiki/File:Pullen_Park_Carousel_01.JPG
 *    https://www.flickr.com/photos/43554380@N00/6450018355
 *    (interior only: the carousel, not modelled)
 * Published: Wikipedia, "Pullen Park Carousel" (Dentzel, 52 animals).
 * No look-only sources. No commercial imagery.
 *
 * Doubts: only one licensed exterior photo, from one side; the house is
 * assumed the same all round. The ten-facet reading of the roof is from
 * that photo against an OSM outline drawn with twenty even sides. The
 * "PP" plaques, the eave brackets and the vane's figure are left out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Face, ringFaces, plate } from './ral-wells-fargo-capitol-center'
import { add2, capPoly, write } from './atl-one-atlantic-center'

const shingle = new Part(), green = new Part(), red = new Part(), roof = new Part(), win = new Part()

const N = 20, R = 12.75, A0 = 3 // wall corners at compass angles A0 + 18°k (the OSM outline)
const G = 0.6, PLINTH = G + 0.8, SOFFIT = 4.3, FASCIA = 4.8, EAVE_OUT = 1.6
const DRUM_R = 6.4, DRUM0 = 11.2, DRUM1 = 13.6, CAP0 = 14.0, CAP1 = 14.9, VANE = 16.2
// The roof, eave and drum have ten facets whose corners stand over the door faces.
const A10 = A0 - 27, R10 = (R * Math.cos(Math.PI / 20) + EAVE_OUT) / Math.cos(Math.PI / 10)

/** A regular n-gon, counter-clockwise from above, corners at compass angles a0 − 360k/n. */
function gon(r: number, n = N, a0 = A0): XY[] {
  const out: XY[] = []
  for (let k = 0; k < n; k++) {
    const a = ((a0 - (360 * k) / n) * Math.PI) / 180 // decreasing compass angle = counter-clockwise
    out.push([r * Math.sin(a), r * Math.cos(a)])
  }
  return out
}
const at = (p: XY, z: number): V3 => [p[0], p[1], z]
const P = (f: Face, s: number, z: number, out: number): V3 => {
  const q = add2(add2(f.a, f.t, s), f.n, out)
  return [q[0], q[1], z]
}
const UP: V3 = [0, 0, 1]

// ── The walls: the twenty faces alternate a window face (shingled pier, window
// bay, shingled pier) and a door face, glazed doors turning the roof's corner.
const wallRing = gon(R)
ringFaces(wallRing, 0, SOFFIT).forEach((f, k) => {
  const door = k % 2 === 1
  const pier = door ? 0 : 0.95
  if (!door) {
    plate(shingle, f, 0, pier, PLINTH, SOFFIT, 0, 0)
    plate(shingle, f, f.len - pier, f.len, PLINTH, SOFFIT, 0, 0)
    plate(red, f, 0, f.len, 0, PLINTH, 0, 0) // the brick plinth
  } else plate(red, f, 0, f.len, 0, G, 0, 0)
  const z0 = door ? G : PLINTH, z1 = SOFFIT - 0.35
  plate(green, f, 0, f.len, z1, SOFFIT, 0.02, 0) // frieze under the soffit
  // the glazing, with its red frame proud of it
  plate(win, f, pier, f.len - pier, z0, z1, 0.02)
  const s0 = pier, s1 = f.len - pier, fw = 0.15
  plate(red, f, s0, s0 + fw, z0, z1, 0.05, 0.05)
  plate(red, f, s1 - fw, s1, z0, z1, 0.05, 0.05)
  plate(red, f, s0, s1, z1 - fw, z1, 0.05, 0.05)
  plate(red, f, s0, s1, G + 2.75, G + 2.75 + fw, 0.05, 0.05) // transom
  if (!door) plate(red, f, s0, s1, z0, z0 + fw, 0.05, 0.05)
  for (const t of door ? [0.5] : [1 / 3, 2 / 3]) {
    const s = s0 + (s1 - s0) * t
    plate(red, f, s - fw / 2, s + fw / 2, z0, z1, 0.05, 0.05)
  }
})

// ── The eave: the soffit, dark green fascia.
const eaveRing = gon(R10, 10, A10)
capPoly(shingle, eaveRing, SOFFIT, false) // the soffit
for (const f of ringFaces(eaveRing, SOFFIT, FASCIA)) plate(green, f, 0, f.len, SOFFIT, FASCIA, 0, 0)

// ── The roof: pale grey shingle up to the drum, red hip caps.
const drumRing = gon(DRUM_R, 10, A10)
roof.loft([eaveRing.map((p) => at(p, FASCIA)), drumRing.map((p) => at(p, DRUM0))])
for (let k = 0; k < 10; k++) {
  const E = eaveRing[k], D = drumRing[k]
  const d: XY = [D[0] - E[0], D[1] - E[1]], L = Math.hypot(d[0], d[1])
  const w: XY = [(-d[1] / L) * 0.16, (d[0] / L) * 0.16]
  const e0 = at(add2(E, w, -1), FASCIA + 0.07), e1 = at(add2(E, w, 1), FASCIA + 0.07)
  const d0 = at(add2(D, w, -1), DRUM0 + 0.07), d1 = at(add2(D, w, 1), DRUM0 + 0.07)
  red.tri(e0, e1, d1, undefined, undefined, undefined, [UP, UP, UP])
  red.tri(e0, d1, d0, undefined, undefined, undefined, [UP, UP, UP])
}

/** A window light: red frame and glass, flat on face f, rectangular or oval. */
function light(f: Face, s: number, w: number, z0: number, z1: number, oval = false) {
  if (!oval) {
    plate(red, f, s - w / 2 - 0.12, s + w / 2 + 0.12, z0 - 0.12, z1 + 0.12, 0.04)
    plate(win, f, s - w / 2, s + w / 2, z0, z1, 0.07)
    return
  }
  const zc = (z0 + z1) / 2, rx = w / 2, rz = (z1 - z0) / 2, segs = 14
  for (let i = 0; i < segs; i++) {
    const a0 = (2 * Math.PI * i) / segs, a1 = (2 * Math.PI * (i + 1)) / segs
    red.tri(P(f, s, zc, 0.04), P(f, s + (rx + 0.12) * Math.cos(a0), zc + (rz + 0.12) * Math.sin(a0), 0.04), P(f, s + (rx + 0.12) * Math.cos(a1), zc + (rz + 0.12) * Math.sin(a1), 0.04))
    win.tri(P(f, s, zc, 0.07), P(f, s + rx * Math.cos(a0), zc + rz * Math.sin(a0), 0.07), P(f, s + rx * Math.cos(a1), zc + rz * Math.sin(a1), 0.07))
  }
}

// ── The clerestory drum: on each face a window, an oval, a window; cornice, cap, vane.
for (const f of ringFaces(drumRing, DRUM0, DRUM1)) {
  plate(green, f, 0, f.len, DRUM0, DRUM1, 0, 0)
  const lo = DRUM0 + 0.45, hi = DRUM1 - 0.45, ww = (f.len - 1.6) / 3
  light(f, 0.4 + ww / 2, ww, lo, hi)
  light(f, f.len / 2, ww * 0.75, lo, hi, true)
  light(f, f.len - 0.4 - ww / 2, ww, lo, hi)
}
const capRing = gon(DRUM_R + 0.6, 10, A10)
for (const f of ringFaces(capRing, DRUM1, CAP0)) plate(green, f, 0, f.len, DRUM1, CAP0, 0, 0)
for (let k = 0; k < 10; k++) {
  const l = (k + 1) % 10
  green.quad(at(drumRing[l], DRUM1), at(drumRing[k], DRUM1), at(capRing[k], DRUM1), at(capRing[l], DRUM1))
  roof.tri(at(capRing[k], CAP0), at(capRing[l], CAP0), [0, 0, CAP1])
}
{
  // the weathervane: a dark post, a ball and an arrow, bold enough to read
  const post = gon(0.15, 4, 45)
  for (const f of ringFaces(post, CAP1 - 0.2, VANE)) plate(green, f, 0, f.len, CAP1 - 0.2, VANE, 0, 0)
  const ball = gon(0.35, 6, 0)
  for (const f of ringFaces(ball, 15.2, 15.7)) plate(green, f, 0, f.len, 15.2, 15.7, 0, 0)
  capPoly(green, ball, 15.7, true)
  capPoly(green, ball, 15.2, false)
  const arrow: XY[] = [[-1.0, -0.06], [1.0, -0.06], [1.0, 0.06], [-1.0, 0.06]]
  for (const f of ringFaces(arrow, VANE - 0.25, VANE)) plate(green, f, 0, f.len, VANE - 0.25, VANE, 0, 0)
  capPoly(green, arrow, VANE, true)
}

await write('ral-pullen-park-carousel', 'Pullen Park Carousel', [
  { part: shingle, material: finish('pullen-shingle', 0xc9dab4) },
  { part: green, material: finish('pullen-green', 0x4f6e60) },
  { part: red, material: finish('pullen-red', 0xb0503f) },
  { part: roof, material: finish('pullen-roof', 0xb4b8b8) },
  { part: win, material: PALETTE.window },
], { bearing: 0, elevation: 0, height: VANE, replaces: ['way/47933092'] })
