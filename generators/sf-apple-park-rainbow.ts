/**
 * The rainbow at Apple Park, Cupertino ("Apple Stage", also called the
 * Rainbow Stage): six free-standing arches in the colours of Apple's old
 * logo, green, yellow, orange, red, purple and blue, stood one behind the
 * other on the lawn in the middle of the ring building's courtyard. Each arch
 * is a little smaller than the one in front, so from the open lawn to the
 * north-east they nest into one rainbow; from the side they read as a
 * telescope of ribs. Original procedural geometry, CC0-1.0.
 * bun generators/sf-apple-park-rainbow.ts
 *
 * History. Designed by Apple's industrial design team under Jony Ive for the
 * employee event of 17 May 2019 that opened the campus (aluminium frames
 * with a laminated polycarbonate skin; Tait, Stageco, Foster + Partners).
 * Meant to come down, it stayed. Removed in early March 2025 and rebuilt
 * as a sturdier permanent structure by April 2025, in the same place and
 * layout (9to5Mac, 3 Mar 2025; heise, 16 Apr 2025; Cult of Mac). The 2026
 * Commons photo below shows the rebuilt arches standing. It is a separate
 * structure on the courtyard lawn, about 120 m inside the ring's glass, so it
 * is its own model and placement rather than part of sf-apple-park.
 *
 * Frame: BEARING 32. x along the arches' span (towards 122 degrees, ESE),
 * y along the row (towards 32 degrees, NNE: the green front arch), z up,
 * metres. Origin = the middle of the row, under the crowns, on the lawn.
 * The lawn is flat: lidar ground 0.2-0.5 m above the box's minimum all
 * round, so y = 0 is that lawn.
 *
 * Evidence
 * - OSM way/744204115 "Apple Stage" (alt_name Rainbow Stage, building =
 *   decoration, amenity = theatre, open air), a 24 x 11 m box at bearing
 *   ~121 degrees, mapped 2019-2021. Replaced. Its ends stop short of the
 *   arch legs (the lidar spans ~30 m).
 * - USGS 3DEP lidar, CA_SantaClaraCounty_2020 (the original 2019 arches), at
 *   0.5 m, read with tools/lidar_frame.py at bearing 32: six ribs about 1 m
 *   deep at y = +5.2, +3.0, +0.7, -1.4, -3.0, -4.5 (row ~9.7 m centre to
 *   centre); crowns 13.25, 12.65, 12.13, 11.45, 10.92, 10.25 m above the
 *   lawn, green to blue. A circle fitted to each rib's top surface puts every
 *   centre ~2.15 m below the lawn (segmental arches, not semicircles), outer
 *   radii 15.4, 14.8, 14.3, 13.75, 13.1, 12.4 (0.6 m smaller per arch), all
 *   centred on one vertical line within ~0.3 m. Green's legs land ~15 m
 *   either side of the centre.
 * - USGS NAIP (Plus) at 0.1 m resampled: the six coloured ribs, green on the
 *   north-east, blue on the south-west, evenly spaced, at ~122 degrees.
 * - Photos: "Apple Park Stage.jpg" (Nicolapps, CC BY 4.0, 12 July 2026,
 *   https://commons.wikimedia.org/wiki/File:Apple_Park_Stage.jpg): the
 *   rebuilt arches from the north, front-left: six separate ribs with clear
 *   sky between them, green largest and in front, blue smallest at the back,
 *   rounded edges, colour on every face, the legs going straight into the
 *   grass with no plinth, nothing under them but lawn. Colours read from its
 *   sunlit faces.
 *
 * Look-only (not relied on for shape or colour; listed so a reviewer knows):
 * - the photo linked on PR #93, squarespace-cdn "Arch 2.png" (commercial,
 *   ~2024, original arches): straight on from the north-east, showing the
 *   six arches nesting into one rainbow, which the model reproduces from the
 *   lidar alone;
 * - eecue.com/photo/73d2489c2a (Dave Bullock, all rights reserved, May 2025,
 *   rebuilt arches): from underneath; ribs about as deep as they are wide.
 *
 * Measured (lidar): crown heights, radii, the 2.15 m sunken centre, the row
 * spacing (averaged to an even 1.95 m) and the bearing. Estimated: each rib
 * 1.0 m deep (lidar rib width) and 1.0 m from inner to outer edge (scaled in
 * the Commons photo against the green crown and a visitor at its foot);
 * 0.18 m rounded edges. The colours are from the photo, a little muted.
 * Doubts: the lidar is of the 2019 arches; the 2025 rebuild is reported as
 * "slightly modified" and the 2026 photo shows the same layout, size and
 * colours, but its exact dimensions are not published. No open night photo
 * shows it lit (the 2019 event added stage lighting, now gone), so it stays
 * unlit at night. The removable stage deck under the arches is not there in
 * the 2026 photo and is not modelled; the lawn is the map's.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish } from './palette'

const BEARING = 32 // the row of arches runs towards 32 degrees; spans at 122 (lidar, NAIP, OSM ~121)
const ANCHOR = { lng: -122.0089378, lat: 37.3345434 } // middle of the row, from the lidar circle fits

// ---------------------------------------------------------------------------
// Dimensions (metres)

const SUNK = 2.15 // every arc's centre lies this far below the lawn (lidar fits)
const R_GREEN = 15.4 // outer radius of the front (green) arch
const STEP_R = 0.6 // each arch behind is this much smaller
const PITCH = 1.95 // centre to centre along the row
const BAND = 1.0 // inner to outer edge
const DEPTH = 1.0 // front to back of each rib
const ROUND = 0.18 // the rounded edges, drawn as a chamfer
const SEGMENTS = 24 // along each arch

// Front to back: the old Apple logo's stripes, top to bottom.
const COLOURS = [
  finish('rainbow-green', 0x6fae4c),
  finish('rainbow-yellow', 0xe2cc4a),
  finish('rainbow-orange', 0xe8823a),
  finish('rainbow-red', 0xd4474a),
  finish('rainbow-purple', 0xa3428a),
  finish('rainbow-blue', 0x4a7cc4),
]

/**
 * One arch: a chamfered rectangular rib swept round a circle whose centre is
 * SUNK below the lawn, cut off where it meets the lawn so its feet stand flat
 * on y = 0. Each face carries its own normals, smooth along the arc.
 */
function arch(p: Part, rOut: number, yMid: number) {
  const rIn = rOut - BAND
  const y0 = yMid - DEPTH / 2, y1 = yMid + DEPTH / 2
  // the section in (radius, y), counter-clockwise seen from the arch's
  // start, with the outward normal of the face from each point to the next
  const sec: [number, number][] = [
    [rOut, y0 + ROUND], [rOut, y1 - ROUND], [rOut - ROUND, y1], [rIn + ROUND, y1],
    [rIn, y1 - ROUND], [rIn, y0 + ROUND], [rIn + ROUND, y0], [rOut - ROUND, y0],
  ]
  const faceN = sec.map(([r, y], i) => {
    const [r2, y2] = sec[(i + 1) % sec.length]
    const dr = r2 - r, dy = y2 - y, l = Math.hypot(dr, dy)
    return [dy / l, -dr / l] as [number, number] // turned to point out of the rib
  })
  const foot = (r: number) => Math.asin(SUNK / r) // where a radius meets the lawn
  const start = foot(rIn), end = Math.PI - start
  const angle = (k: number, r: number) =>
    k === 0 ? foot(r) : k === SEGMENTS ? Math.PI - foot(r) : start + ((end - start) * k) / SEGMENTS
  const at = (r: number, y: number, t: number): V3 => [r * Math.cos(t), y, Math.max(0, r * Math.sin(t) - SUNK)]
  const nAt = (nr: number, ny: number, t: number): V3 => [nr * Math.cos(t), ny, nr * Math.sin(t)]

  for (let k = 0; k < SEGMENTS; k++) {
    for (let i = 0; i < sec.length; i++) {
      const [ra, ya] = sec[i], [rb, yb] = sec[(i + 1) % sec.length]
      const [nr, ny] = faceN[i]
      const ta0 = angle(k, ra), tb0 = angle(k, rb), ta1 = angle(k + 1, ra), tb1 = angle(k + 1, rb)
      const a = at(ra, ya, ta0), b = at(rb, yb, tb0), c = at(rb, yb, tb1), d = at(ra, ya, ta1)
      const na = nAt(nr, ny, ta0), nb = nAt(nr, ny, tb0), nc = nAt(nr, ny, tb1), nd = nAt(nr, ny, ta1)
      p.tri(a, b, c, [0, 0], [0, 0], [0, 0], [na, nb, nc])
      p.tri(a, c, d, [0, 0], [0, 0], [0, 0], [na, nc, nd])
    }
  }
  // the feet, flat on the lawn, facing down
  for (const k of [0, SEGMENTS]) {
    const ring = sec.map(([r, y]) => at(r, y, angle(k, r)))
    p.cap(ring, false)
  }
}

export function build() {
  return COLOURS.map((material, i) => {
    const part = new Part()
    arch(part, R_GREEN - STEP_R * i, (PITCH * (COLOURS.length - 1)) / 2 - PITCH * i)
    return { part, material }
  })
}

const HEIGHT = R_GREEN - SUNK

const extras = {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: HEIGHT,
  frame: 'Y up, -Z north, +X east, metres; origin in the middle of the row of arches, on the lawn',
  replaces: ['way/744204115'],
}

if (import.meta.main) {
  const list = build()
  const tris = list.reduce((n, { part }) => n + part.triangles, 0)
  if (tris > 5000) throw new Error(`${tris} triangles, over 5000`)
  const glb = writeGlb('Apple Park rainbow', list, extras)
  await Bun.write(new URL('../models/sf-apple-park-rainbow.glb', import.meta.url), glb)
  console.log(`sf-apple-park-rainbow.glb: ${tris} triangles, ${glb.length} bytes`)
}
