/**
 * North Carolina State Legislative Building, Raleigh (1961–63; Edward
 * Durell Stone with Holloway & Reeves): procedural, CC0-1.0.
 * bun generators/ral-nc-legislative-building.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 3 (the OSM
 * walls run at 3°/93°). Origin: the area centroid of the OSM outline
 * way/47776644 (-78.638954, 35.783203). The building itself is drawn about
 * the centre of the inner OSM square way/1472099223, (-0.5, +2.2) in this
 * frame, and is symmetric about both of its axes, as the real one is.
 *
 * OSM (no heights or levels tagged):
 *  - way/47776644 "North Carolina Legislative Building" (Q7054610, source
 *    WakeGIS): 103 × 98 m. NAIP shows the building's own roof edge 82 m
 *    square, so the outline includes the raised terrace round it; drawn as
 *    a stone plinth (x -51.7..51.5, y -49.4..48.8, its small northern bumps
 *    left out).
 *  - way/1472099223 "North Carolina General Assembly": 71.8 × 72.3 m inside
 *    it: the line of the roof terrace's parapet (NAIP), i.e. the same
 *    building.
 * Published (Wikipedia, "North Carolina State Legislative Building"): opened
 * 1963, three floors, "roof gardens and garden courts at the four interior
 * corners".
 *
 * Plan, from USGS NAIP (public domain, 0.42 m/px; work/naip_crop.png):
 *  - the lower block's roof edge 82 m square (fascia ±41.3);
 *  - on its roof a cross-shaped upper storey: arms 25 m wide (slab edge
 *    ±12.6) reaching ±32 m, its slab white;
 *  - five copper pyramids in a plus: one on each arm (19 m square, centred
 *    19.5 m out) and a smaller one over the crossing (15 m). There are no
 *    pyramids on the corners: those are the four planted garden courts
 *    (12 m, centred ±20.5 m), on the terrace between the arms;
 *  - a row of planters on the lower terrace, set back behind its edge
 *    (l05), drawn as a thin green band 0.6 m wide and 0.5 m high.
 *
 * No lidar covers Wake County (3DEP has none), so every height is
 * photo-scaled (estimated):
 *  - lower storey 8.0 m to the top of its fascia: from people beside the
 *    piers in l10 (clear height ≈ 7 m under a ≈1 m slab), and the doors
 *    in l02/l09 (doors and transom ≈ 3 m against a 215 px storey);
 *  - between the piers the wall is full-height dark glass, from the plaza
 *    to the slab, set 2 m behind the piers (l01, l04, l05, l10);
 *  - pier spacing ≈ 4.8 m (l09: 95 px against the 8 m storey), 17 bays;
 *    piers 1.3 m wide, ≈3 m in front of the wall (l10);
 *  - upper arcade 3.8 m from the terrace floor (0.5 m over the lower
 *    slab, behind a planter row) to the slab underside, from
 *    people on the terrace in l07 and l09 (arch apexes ≈ 3.2 m over their
 *    feet); the arcade 1.8 m inside a 0.5 m slab, the glass 1.2 m behind
 *    the columns; nine pointed arches on each arm's end (l02, l06, l09);
 *  - the pyramids are low: 19.6 m square rising 3.8 m (≈21°). l02 and l09
 *    show the south arm's apex only ≈30 px over its eaves against a
 *    ≈200 px wide base; l05 (from above) agrees once its downward view is
 *    allowed for. A first pass at 29° looked far steeper than every photo.
 *    The middle pyramid (14.4 m) keeps the pitch on its smaller base, so
 *    it stays under the arm pyramids, as in l02/l06 where no apex shows
 *    over the south one's. White slab strips (≈2.5 m) part the pyramids
 *    and border the arms, as NAIP shows.
 *  - the plinth: the floor is set at the Jones Street front (south), which
 *    l02, l06 and l09 show level with the sidewalk. Mapterhorn (z13; z14–15
 *    tiles are missing here) has the ground falling ~4.5 m from the south
 *    front to the north-west corner, so the floor is 5.0 m over y = 0 and
 *    the plinth runs down to y = 0 (sinking into the slope on the south
 *    and east). Elevation 0.
 *
 * Photos (evidence; local copies in landmarks-scratch/ral/work/
 * ral-nc-legislative-building/photos):
 *  l01 "North-Carolina-Legislative-Building-20080321.jpeg", Jmturner, public
 *      domain: from the south-west, the lower colonnade, the white slabs,
 *      the arcade, the green copper before re-roofing.
 *  l02 "North Carolina Legislative Building.JPG", Abbylabar, CC BY-SA 3.0:
 *      south front, frontal: nine arches, the doors, the east and west
 *      pyramids each side of the south one.
 *  l04 "Raleigh - State Legislative Building.jpg", P. Hughes, CC BY 4.0:
 *      from the south-east (2020s): the current dark brown-grey copper of
 *      the re-roofed pyramids, piers, narrow windows and marble panels.
 *  l05 "NCLegislature.jpg", W Edward Callis III, public domain: from above
 *      the south: the plus of pyramids, the terrace, the hedges, the seal
 *      on the entrance plaza.
 *  l06 "NC Legislature.JPG", Yas, CC BY-SA 3.0: south front from the
 *      Bicentennial Plaza.
 *  l07 "North Carolina Teachers at the State Legislative Building
 *      (40785549033).jpg", Gerry Dincher, CC BY-SA 2.0 (2018): people on
 *      the terrace, the brown new copper.
 *  l09 Flickr 14550231682 "NC State Legislative Building", Gerry Dincher,
 *      CC BY-SA 2.0 (2014): south front.
 *  l10 Flickr 26041758304, NathaniaJohnson, CC BY 2.0 (2016): the ground
 *      floor colonnade close up, people for scale.
 * Aerial: USGS NAIP (public domain).
 *
 * Colours: marble piers and walls warm white; the slabs whiter; the
 * pyramids' copper as it is now (l04, l07: brown-grey, re-roofed after
 * 2014, when l09 still shows green), pulled toward the palette's lightness;
 * windows the palette slate; the terrace the palette roof grey; the hedges
 * and garden courts a muted green.
 * Estimated: every height above; the wall's setback behind the piers; the
 * arch spring (62% of the arcade). Invented: the north and west fronts
 * repeat the south and east (no licensed photo of the north front found;
 * NAIP shows the same plan on all four sides).
 * Left out: the copper's diamond seams, the terrace railings, the gold
 * leaf, flagpoles, planters, the skylight over the crossing (NAIP shows a
 * pale centre on the middle pyramid; drawn copper).
 * Doubts: no lidar, no Mapillary (no token); the north side's exposed
 * plinth rests on z13 terrain only; the storey heights rest on photo
 * scaling from people and doors.
 * Night: windows glow (`window`); the marble piers are floodlit softly from
 * below (`floodlight`), the pyramids stay dark.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'
import { type XY, type Face, prism, rect, chamfer, extrudeShape, flatShape, capRing, finishGlb, writeModel } from './sea-tacoma-union-station'
import { box, grow, slabRing, panel, triO } from './nash-tennessee-state-capitol'

const CX = -0.5, CY = 2.2 // building centre in the anchor frame
const F = 5.0 // floor (the Jones Street front) over y = 0
// lower block
const FAS = 41.3, PIER_O = 40.7, PIER_I = 39.4, WALL = 37.4
const SLAB0 = F + 7.0, SLAB1 = F + 8.0
// upper storey: a plus, slab edge half-width H and reach R
const H = 12.6, R = 32, OVER = 1.8, GLASS_IN = 1.2
const ARC0 = SLAB1 + 0.5, ARC1 = SLAB1 + 4.3, US1 = ARC1 + 0.5
const T = SLAB1 + 0.5 // the terrace floor
const SPRING = ARC0 + 0.62 * (ARC1 - ARC0)
// pyramids
const PB = 9.8, PD = 19.5, PC = 7.2, PITCH = 3.8 / 9.8

/** A plus-shaped ring: arms of half-width h reaching r, counter-clockwise. */
function plus(h: number, r: number): XY[] {
  const p: XY[] = [[h, -r], [h, -h], [r, -h], [r, h], [h, h], [h, r], [-h, r], [-h, h], [-r, h], [-r, -h], [-h, -h], [-h, -r]]
  return p.map(([x, y]) => [x + CX, y + CY])
}
const at = (x: number, y: number): XY => [x + CX, y + CY]
const sq = (x: number, y: number, h: number): XY[] => rect(CX + x - h, CY + y - h, CX + x + h, CY + y + h)

function pyramid(p: Part, x: number, y: number, h: number, z: number) {
  const [cx, cy] = at(x, y), top: V3 = [cx, cy, z + h * PITCH]
  const c: V3[] = [[cx - h, cy - h, z], [cx + h, cy - h, z], [cx + h, cy + h, z], [cx - h, cy + h, z]]
  const outs: V3[] = [[0, -1, PITCH], [1, 0, PITCH], [0, 1, PITCH], [-1, 0, PITCH]]
  for (let k = 0; k < 4; k++) triO(p, c[k], c[(k + 1) % 4], top, outs[k])
}

function build() {
  const marble = new Part(), slab = new Part(), win = new Part(), copper = new Part(), terrace = new Part(), green = new Part()

  // ------------------------------------------------------------ plinth (the raised terrace)
  const plinth = rect(-51.7, -49.4, 51.5, 48.8)
  prism(marble, marble, plinth, 0, F)

  // ------------------------------------------------------------ lower storey
  // the wall behind the colonnade: full-height dark glass, 2 m behind the piers
  prism(win, null, sq(0, 0, WALL), F, SLAB0)
  // the slab over the colonnade: a white fascia, soffit under, terrace on top
  const fas = chamfer(sq(0, 0, FAS), 0.4)
  prism(slab, null, fas, SLAB0, SLAB1)
  capRing(slab, fas, SLAB0, false)
  capRing(terrace, fas, SLAB1, true)
  // piers, 17 bays a side, and the windows between them on the wall
  const N = 17, span = 2 * (PIER_O - 0.65)
  const sides: { n: XY; o: (s: number, d: number) => V3 }[] = [
    { n: [0, -1], o: (s, d) => [CX + s, CY - d, 0] },
    { n: [1, 0], o: (s, d) => [CX + d, CY + s, 0] },
    { n: [0, 1], o: (s, d) => [CX - s, CY + d, 0] },
    { n: [-1, 0], o: (s, d) => [CX - d, CY - s, 0] },
  ]
  for (const { o } of sides) {
    for (let k = 0; k <= N; k++) {
      const s = -span / 2 + (k * span) / N
      if (k > 0 && k < N) {
        // a free-standing pier, 1.3 wide, between the plaza and the slab
        const a = o(s - 0.65, PIER_I), b = o(s + 0.65, PIER_O)
        box(marble, Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[0], b[0]), Math.max(a[1], b[1]), F, SLAB0, null, 0.15)
      }
    }
  }
  // corner piers
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    const x = CX + sx * (PIER_O - 0.65), y = CY + sy * (PIER_O - 0.65)
    box(marble, x - 0.65, y - 0.65, x + 0.65, y + 0.65, F, SLAB0, null, 0.15)
  }
  // a thin row of planters set back behind the roof's edge, and the four
  // garden courts (l05: low shrubs in planters on the terrace)
  const HO = sq(0, 0, 38.8), HI = sq(0, 0, 38.2), HT = T + 0.5
  prism(green, null, HO, SLAB1, HT)
  prism(green, null, [...HI].reverse(), T, HT)
  for (let k = 0; k < 4; k++) {
    const l = (k + 1) % 4
    green.quad([HI[k][0], HI[k][1], HT], [HO[k][0], HO[k][1], HT], [HO[l][0], HO[l][1], HT], [HI[l][0], HI[l][1], HT])
  }
  capRing(terrace, HI, T, true)
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) box(green, ...corners(sq(sx * 20.5, sy * 20.5, 6)), T, T + 0.7, green, 0.3)

  // ------------------------------------------------------------ upper storey: glass behind a white arcade
  prism(win, null, grow(plus(H - OVER, R - OVER), -GLASS_IN), T, ARC1)
  const arc = plus(H - OVER, R - OVER)
  for (let i = 0; i < arc.length; i++) {
    const a = arc[i], b = arc[(i + 1) % arc.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const n: XY = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L]
    const f: Face = { o: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 0], n }
    const bays = Math.round(L / 2.5), bw = L / bays
    for (let k = 0; k <= bays; k++) {
      const s = -L / 2 + k * bw
      // the column and its flare into the slab: a pointed arch between each pair
      const lo = k === 0 ? 0 : -1, hi = k === bays ? 0 : 1
      const hw = 0.22, fw = bw / 2
      const shape: XY[] = [
        [s - hw, T], [s + hw, T], [s + hw, SPRING], [s + (hi ? fw : hw), ARC1], [s - (lo ? fw : hw), ARC1], [s - hw, SPRING],
      ]
      extrudeShape(slab, f, shape, -0.45, 0)
    }
  }
  // the upper slab, white, deep over the arcade
  const us = plus(H, R)
  prism(slab, slab, us, ARC1, US1)
  capRing(slab, us, ARC1, false)

  // ------------------------------------------------------------ the five pyramids
  for (const [x, y] of [[0, -PD], [PD, 0], [0, PD], [-PD, 0]] as XY[]) pyramid(copper, x, y, PB, US1)
  pyramid(copper, 0, 0, PC, US1)

  const lit = (p: V3, n: V3) => (n[2] > 0.5 ? 0 : p[2] < SLAB0 && p[2] > F - 0.1 ? 0.8 - (0.4 * (p[2] - F)) / 7 : 0)
  return finishGlb('North Carolina State Legislative Building', [
    { part: marble, material: <Swatch>{ ...finish('nc-leg-marble', 0xebe4d8), floodlight: lit } },
    { part: slab, material: PALETTE.trim },
    { part: win, material: PALETTE.window },
    { part: copper, material: finish('nc-leg-copper', 0x857a71) },
    { part: terrace, material: finish('nc-leg-terrace', 0xc9c8c2) },
    { part: green, material: finish('nc-leg-hedge', 0x8a9a74) },
  ], { bearing: 3, height: US1 + PB * PITCH, replaces: ['way/47776644', 'way/1472099223'] }, 5000)
}

function corners(r: XY[]): [number, number, number, number] {
  return [r[0][0], r[0][1], r[2][0], r[2][1]]
}

if (import.meta.main) await writeModel('ral-nc-legislative-building', build())
