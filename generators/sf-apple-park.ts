/**
 * Apple Park, Cupertino: the four-storey ring building ("the Spaceship"), a
 * continuous ring of curved glass walls stacked between thin white floor
 * canopies, under a dark solar roof with a raised skylight ridge along its
 * middle. Original procedural geometry, CC0-1.0.
 * bun generators/sf-apple-park.ts   (writes the low and the detail model)
 *
 * Frame: BEARING 0 (round). x east, y north, z up, metres. Origin = the
 * ring's centre, a circle fitted to the lidar roof edges (inner and outer
 * agree to 0.05 m; rms 0.4 m). y = 0 is the ground round the building,
 * 49.6 m NAVD88, the same inside and outside to within ~0.7 m.
 *
 * Evidence
 * - OSM relation/5281838 ("Apple Park", multipolygon, office, 4 levels,
 *   height 30): outer way/518136497, inner way/353667615; ten building:parts
 *   (way/785258427, 736351416/18/19/22/24/26/27/29/32, height 35, 3 levels,
 *   "glass", roof blue) tracing the ridge band at r 196-212. All replaced.
 *   The OSM rings (fitted R 240.8 and 179.5) sit ~5 m outside the lidar and
 *   NAIP edges on both faces; the model follows the lidar.
 * - USGS 3DEP lidar (CA_SantaClaraCounty_2020) at 1 m, read as a radial
 *   profile, median of 720 azimuths: canopy tips at r 173.3 (inner) and
 *   235.75 (outer); roof canopy top 15.9 at the tip, 16.9 at its root; a ~1 m
 *   dark step up to the solar roof at 17.9-18.1; the solar slopes rising 0.13
 *   in 1 to 20.7-20.95 at the ridge; the ridge from r 199.25 to 210.25, its
 *   rims at 22.7-22.8 (the highest point) and a shallow dip along its middle.
 *   The roof is continuous all round: the ring is never cut.
 * - USGS NAIP (0.64 m): the dark solar fields, the white edges, the ridge's
 *   blue skylights broken by dark panels, and nine glass bands across the
 *   whole roof width (the atria), at 1, 30.6, 60.25, 90.1, 134.6, 179.5, 225,
 *   270.4 and 315.75 degrees from the centre, each ~10 m wide.
 * - Published (Wikipedia, Foster + Partners): opened 2017; four storeys above
 *   ground; ~461 m across; curved glass panels about 14 m long; canopies at
 *   every floor; rooftop solar array.
 * - Photos (Wikimedia Commons): "Aerial view of Apple Park dllu.jpg" (Daniel
 *   L. Lu, CC BY-SA 4.0: from the south; the four white canopies on the outer
 *   face, the dark roof, the ridge, the south atrium's glass roof and door);
 *   "Apple park cupertino 2019 (cropped).jpg" (Arne Müseler, CC BY-SA 3.0 de:
 *   the canopies, the step, the solar fields, an atrium skylight); "Apple
 *   Park view from the Steve Jobs Theater.jpg" (Nicolapps, CC BY 4.0: the
 *   outer face from the south-east; canopy spacing, the thicker roof canopy,
 *   the 14 m glass panels and their joints); "Apple Park Inner.jpg"
 *   (Nicolapps, CC BY 4.0: the courtyard face, canopies projecting over
 *   floor-high curved glass); "Apple Park dusk aerial.jpg" (Dicklyon, CC
 *   BY-SA 4.0: the lit floors at dusk); "Apple Park 1 2018-01-23.jpg" and
 *   "Apple Park 1 2023-11-14.jpg" (FASTILY, CC BY-SA 4.0: the ring over the
 *   trees from the visitor centre).
 *
 * Estimated: the glass lines (3.7 m inside the canopy tips, from the lidar
 * step at the canopy root and the photos); floor canopies at 4.1, 8.0 and
 * 11.9 m (floor-to-floor 3.9, scaled from the canopy spacing in the SE photo
 * against the measured roof canopy), 0.45 m thick at the edge and 0.7 m at
 * the glass; the roof canopy's soffit at 15.1; the ridge rims 1 m wide; one
 * dark ridge panel in four (NAIP); 104 outer and 80 inner glass panels
 * (~14 m). The atria show outside only as their glass roofs and a
 * ground-floor entrance on each face; their glazing bars (detail model) are
 * spaced by eye. Not modelled: the courtyard landscape, paths and pond
 * (ground), the ridge's vent louvres, the joints in the solar fields.
 *
 * Two levels of detail: the low model (64 stations round the ring) and the
 * detail model (240 stations, chamfered canopy edges, mullion fins at every
 * glass joint, the recessed skylight strip with its dark panels, and the
 * atrium glazing bars and door mullions).
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

const BEARING = 0 // a ring: built north-up
const ANCHOR = { lng: -122.0089917, lat: 37.3348521 } // centre of the ring, fitted to the lidar roof edges

// ---------------------------------------------------------------------------
// Dimensions (metres; radii from the ring's centre, heights above the ground
// round the building, which is flat to within half a metre all the way round).

const R_OUT = 232.0 // outer glass line
const R_IN = 177.0 // inner (courtyard) glass line
const PROJ = 3.7 // floor and roof canopies project this far past the glass (lidar tips 235.7 and 173.3)
const FLOORS = [4.1, 8.0, 11.9] // tops of the three floor canopies (floor-to-floor 3.9)
const FLOOR_ROOT = 0.7 // canopy thickness where it meets the glass
const FLOOR_TIP = 0.45 // and at its white edge
const ROOF_SOFFIT = 15.1 // underside of the roof canopy
const ROOF_TIP = 15.9 // top of the roof canopy at its edge (lidar 15.9)
const ROOF_ROOT = 16.9 // top of the roof canopy at the glass line (lidar 16.9)
const EAVE = 18.0 // the solar roof's low edge, a dark step above the canopy (lidar 17.9-18.1)
const RIDGE_IN = 199.25, RIDGE_OUT = 210.25 // the skylight ridge (lidar)
const RIDGE_FOOT = 20.9 // where the solar slopes meet the ridge (lidar 20.7-20.95)
const RIDGE_TOP = 22.75 // the ridge's white rims (lidar 22.7-22.8), the building's highest point
const RIDGE_RIM = 1.0 // width of each white rim
const RIDGE_SKY = 22.45 // the recessed skylight strip between the rims (lidar dip, detail only)

/** Atria: glass roofs right across the ring (NAIP), compass degrees from the centre. */
const ATRIA = [1, 30.6, 60.25, 90.1, 134.6, 179.5, 225, 270.4, 315.75]
const ATRIUM_HALF = 1.4 // degrees: ~10 m wide at the ridge

// ---------------------------------------------------------------------------

const deg = Math.PI / 180
type RZ = [number, number]
const P = (a: number, r: number, z: number): V3 => [r * Math.sin(a), r * Math.cos(a), z]

/** Angles (radians) round the ring: `n` uniform stations plus each atrium's edges. */
function stations(n: number): number[] {
  const edges = ATRIA.flatMap((c) => [c - ATRIUM_HALF, c + ATRIUM_HALF])
  const out = edges.slice()
  for (let i = 0; i < n; i++) {
    const d = (360 * i) / n
    if (edges.every((e) => Math.abs(((d - e + 540) % 360) - 180) > (360 / n) * 0.35)) out.push(d)
  }
  return out.map((d) => ((d % 360) + 360) % 360).sort((a, b) => a - b).map((d) => d * deg)
}
const inAtrium = (a: number) => ATRIA.some((c) => Math.abs((((a / deg - c) % 360) + 540) % 360 - 180) < ATRIUM_HALF - 1e-6)

/**
 * One face of the surface of revolution, between profile points A and B,
 * over the angles a0..a1. `hint` is a direction in the (r, z) plane on the
 * outside of the face; normals are smooth round the ring.
 */
function band(part: Part, a0: number, a1: number, A: RZ, B: RZ, hint: RZ) {
  const dr = B[0] - A[0], dz = B[1] - A[1], l = Math.hypot(dr, dz)
  let nr = dz / l, nz = -dr / l
  if (nr * hint[0] + nz * hint[1] < 0) { nr = -nr; nz = -nz }
  const N = (a: number): V3 => [nr * Math.sin(a), nr * Math.cos(a), nz]
  const p00 = P(a0, A[0], A[1]), p10 = P(a1, A[0], A[1]), p11 = P(a1, B[0], B[1]), p01 = P(a0, B[0], B[1])
  part.tri(p00, p10, p11, undefined, undefined, undefined, [N(a0), N(a1), N(a1)])
  part.tri(p00, p11, p01, undefined, undefined, undefined, [N(a0), N(a1), N(a0)])
}

/** A flat-faced box in a local frame at angle a: t tangential, r radial, z up. */
function box(part: Part, a: number, r0: number, r1: number, t0: number, t1: number, z0: number, z1: number, faces: string) {
  const er: V3 = [Math.sin(a), Math.cos(a), 0], et: V3 = [Math.cos(a), -Math.sin(a), 0]
  const at = (r: number, t: number, z: number): V3 => [er[0] * r + et[0] * t, er[1] * r + et[1] * t, z]
  const neg = (v: V3): V3 => [-v[0], -v[1], -v[2]]
  const face = (q: V3[], n: V3) => {
    part.tri(q[0], q[1], q[2], undefined, undefined, undefined, [n, n, n])
    part.tri(q[0], q[2], q[3], undefined, undefined, undefined, [n, n, n])
  }
  if (faces.includes('o')) face([at(r1, t0, z0), at(r1, t1, z0), at(r1, t1, z1), at(r1, t0, z1)], er)
  if (faces.includes('i')) face([at(r0, t0, z0), at(r0, t1, z0), at(r0, t1, z1), at(r0, t0, z1)], neg(er))
  if (faces.includes('s')) {
    face([at(r0, t1, z0), at(r1, t1, z0), at(r1, t1, z1), at(r0, t1, z1)], et)
    face([at(r0, t0, z0), at(r1, t0, z0), at(r1, t0, z1), at(r0, t0, z1)], neg(et))
  }
  if (faces.includes('t')) face([at(r0, t0, z1), at(r1, t0, z1), at(r1, t1, z1), at(r0, t1, z1)], [0, 0, 1])
  if (faces.includes('b')) face([at(r0, t0, z0), at(r1, t0, z0), at(r1, t1, z0), at(r0, t1, z0)], [0, 0, -1])
}

type Parts = { white: Part; glazing: Part; solar: Part; glass: Part; door: Part }

function build(detail: boolean): Parts {
  const p: Parts = { white: new Part(), glazing: new Part(), solar: new Part(), glass: new Part(), door: new Part() }
  const A = stations(detail ? 240 : 64)

  for (let i = 0; i < A.length; i++) {
    const a0 = A[i], a1 = i + 1 < A.length ? A[i + 1] : A[0] + 2 * Math.PI
    const mid = (a0 + a1) / 2
    const atrium = inAtrium(mid)

    for (const s of [1, -1]) {
      const Rg = s > 0 ? R_OUT : R_IN
      const d = (x: number) => Rg + s * x
      const out: RZ = [s, 0], up: RZ = [0, 1], down: RZ = [0, -1]

      // Glass walls between the canopies; the ground floor of an atrium is its entrance.
      const walls: RZ[] = [[0, FLOORS[0] - FLOOR_ROOT], ...FLOORS.map((t, k): RZ => [t, (k < 2 ? FLOORS[k + 1] - FLOOR_ROOT : ROOF_SOFFIT)])]
      walls.forEach(([z0, z1], k) => band(k === 0 && atrium ? p.door : p.glazing, a0, a1, [Rg, z0], [Rg, z1], out))

      // Floor canopies: real slabs, a flat top, a white edge and a soffit rising to it.
      for (const t of FLOORS) {
        if (detail) {
          const c = 0.18 // a small chamfer on the top edge catches the light
          band(p.white, a0, a1, [d(0), t], [d(PROJ - c), t], up)
          band(p.white, a0, a1, [d(PROJ - c), t], [d(PROJ), t - c], [s, 1])
          band(p.white, a0, a1, [d(PROJ), t - c], [d(PROJ), t - FLOOR_TIP], out)
        } else {
          band(p.white, a0, a1, [d(0), t], [d(PROJ), t], up)
          band(p.white, a0, a1, [d(PROJ), t], [d(PROJ), t - FLOOR_TIP], out)
        }
        band(p.white, a0, a1, [d(PROJ), t - FLOOR_TIP], [d(0), t - FLOOR_ROOT], down)
      }

      // The roof canopy: thicker, its top falling to the edge.
      band(p.white, a0, a1, [d(0), ROOF_ROOT], [d(PROJ - (detail ? 0.25 : 0)), ROOF_TIP], up)
      if (detail) band(p.white, a0, a1, [d(PROJ - 0.25), ROOF_TIP], [d(PROJ), ROOF_TIP - 0.25], [s, 1])
      band(p.white, a0, a1, [d(PROJ), ROOF_TIP - (detail ? 0.25 : 0)], [d(PROJ), ROOF_SOFFIT], out)
      band(p.white, a0, a1, [d(PROJ), ROOF_SOFFIT], [d(0), ROOF_SOFFIT], down)

      // The dark step up to the solar roof, and the solar slope to the ridge
      // (a glass roof across an atrium).
      band(p.solar, a0, a1, [d(0), ROOF_ROOT], [d(0), EAVE], out)
      const foot = s > 0 ? RIDGE_OUT : RIDGE_IN
      band(atrium ? p.glass : p.solar, a0, a1, [d(0), EAVE], [foot, RIDGE_FOOT], up)
      band(p.solar, a0, a1, [foot, RIDGE_FOOT], [foot, RIDGE_TOP], out)

      // The ridge's white rims.
      const rim = foot - s * RIDGE_RIM
      band(p.white, a0, a1, [foot, RIDGE_TOP], [rim, RIDGE_TOP], up)
      if (detail) band(p.white, a0, a1, [rim, RIDGE_TOP], [rim, RIDGE_SKY], [-s, 0])
    }

    // The skylight strip along the ridge: glass panels with a dark panel
    // every fourth bay (NAIP), all glass across an atrium.
    const r0 = RIDGE_IN + RIDGE_RIM, r1 = RIDGE_OUT - RIDGE_RIM
    const z = detail ? RIDGE_SKY : RIDGE_TOP
    const dark = detail && !atrium && i % 4 === 3
    band(dark ? p.solar : p.glass, a0, a1, [r0, z], [r1, z], [0, 1])
  }

  if (detail) {
    // Mullions: the curtain wall is ~14 m curved panels (photos); each joint
    // a slim fin standing proud of the glass, floor to floor.
    for (const s of [1, -1]) {
      const Rg = s > 0 ? R_OUT : R_IN, n = s > 0 ? 104 : 80
      const walls: RZ[] = [[0, FLOORS[0] - FLOOR_ROOT], ...FLOORS.map((t, k): RZ => [t, (k < 2 ? FLOORS[k + 1] - FLOOR_ROOT : ROOF_SOFFIT)])]
      for (let k = 0; k < n; k++) {
        const a = ((k + 0.5) / n) * 2 * Math.PI
        for (const [z0, z1] of walls) {
          const r0 = s > 0 ? Rg - 0.05 : Rg - 0.22, r1 = s > 0 ? Rg + 0.22 : Rg + 0.05
          box(p.white, a, r0, r1, -0.09, 0.09, z0, z1, (s > 0 ? 'o' : 'i') + 's')
        }
      }
    }

    // Atria: glazing bars across the glass roofs, and door frames at the entrances.
    for (const c of ATRIA) {
      for (let k = -3; k <= 3; k++) {
        const a = (c + (k * ATRIUM_HALF) / 3.5) * deg
        for (const s of [1, -1]) {
          const Rg = s > 0 ? R_OUT : R_IN, foot = s > 0 ? RIDGE_OUT : RIDGE_IN
          // A bar following the slope from the eave to the ridge foot.
          const n = 6
          for (let j = 0; j < n; j++) {
            const ra = Rg + ((foot - Rg) * j) / n, rb = Rg + ((foot - Rg) * (j + 1)) / n
            const za = EAVE + ((RIDGE_FOOT - EAVE) * j) / n, zb = EAVE + ((RIDGE_FOOT - EAVE) * (j + 1)) / n
            box(p.solar, a, Math.min(ra, rb), Math.max(ra, rb), -0.12, 0.12, Math.min(za, zb), Math.max(za, zb) + 0.15, 'st')
          }
          // Door mullions at the ground-floor entrance.
          box(p.white, a, s > 0 ? Rg - 0.05 : Rg - 0.2, s > 0 ? Rg + 0.2 : Rg + 0.05, -0.1, 0.1, 0, FLOORS[0] - FLOOR_ROOT, (s > 0 ? 'o' : 'i') + 's')
        }
      }
    }
  }
  return p
}

// ---------------------------------------------------------------------------

const WHITE = finish('canopy-white', 0xeef0ee)
const GLAZING = windowVariant(2, 0x56697a)
const SOLAR = finish('solar-roof', 0x444d5c, 0.5)
const SKY = { ...PALETTE.glass, color: 0x55677f }
const DOOR = PALETTE.entrance

const extras = {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: RIDGE_TOP,
  frame: 'Y up, -Z north, +X east, metres; origin at the centre of the ring, on the ground',
  replaces: ['relation/5281838', 'way/785258427', 'way/736351416', 'way/736351418', 'way/736351419', 'way/736351422',
    'way/736351424', 'way/736351426', 'way/736351427', 'way/736351429', 'way/736351432'],
}

if (import.meta.main) {
  for (const [file, detail, maxTris, maxBytes] of [
    ['sf-apple-park.glb', false, 6500, 250 * 1024],
    ['sf-apple-park.detail.glb', true, 40000, 1536 * 1024],
  ] as const) {
    const p = build(detail)
    const list = [
      { part: p.white, material: WHITE },
      { part: p.glazing, material: GLAZING },
      { part: p.solar, material: SOLAR },
      { part: p.glass, material: SKY },
      { part: p.door, material: DOOR },
    ]
    const tris = list.reduce((n, { part }) => n + part.triangles, 0)
    if (tris > maxTris) throw new Error(`${file}: ${tris} triangles, over ${maxTris}`)
    const glb = writeGlb('Apple Park', list, extras)
    if (glb.length > maxBytes) throw new Error(`${file}: ${glb.length} bytes, over ${maxBytes}`)
    await Bun.write(new URL(`../models/${file}`, import.meta.url), glb)
    console.log(`${file}: ${tris} triangles, ${glb.length} bytes`)
  }
}
