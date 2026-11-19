/**
 * SkyHouse Raleigh (2015) — original procedural geometry, CC0-1.0.
 * bun generators/ral-skyhouse-raleigh.ts [out.glb]
 *
 * Uses the kit in ral-wells-fargo-capitol-center.ts.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of OSM way/297829073, 35.776649,
 * -78.637115. Bearing 2 (the downtown grid, from the outline's edges).
 *
 * Identity (photos below): a 23-storey residential slab running
 * east–west. The long faces alternate full-height glass bays and stacks
 * of projecting balconies between grey concrete piers; each end has two
 * glass corner bays either side of a balcony stack with a tall metal spine
 * fin that rises past the roof; a cream stone base of three storeys; and
 * on the roof a glazed amenity storey and a pavilion with a blue barrel
 * vault running along the slab, cream arched end walls and a pool terrace
 * at the west end. The amenity storey's glazing is lit at night (`window`).
 *
 * Evidence:
 *  - plan: OSM way/297829073, 55.5 × 26.7 m, turned 2°.
 *  - heights: 80.47 m published (OSM height 80.4672; 264 ft), 23 floors.
 *    Ground storey 5.5 m, then 3.2 m: residential roof 69.5 m, amenity
 *    storey to 74 m, pavilion walls to 75.5 m, vault crown 80.4 m, spine
 *    to 80.4 m: estimated from storey counts in Oakcitydylan's drone photo
 *    and City Dweller 2's photo. Base 12 m (three storeys). No lidar
 *    covers Raleigh.
 *  - bay rhythm (seven bays on a long face, three on an end), the vault's
 *    extent (x −15…22, y ±8.5) and the pool terrace: estimated from
 *    Oakcitydylan's drone photo and the NAIP roof.
 *  - colours: concrete grey, light sky-blue glass, darker balcony glazing,
 *    cream stone, blue vault; from the photos, pulled to the palette's
 *    lightness.
 *  - y = 0 is the street; elevation 0.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Skyhouse Raleigh-20170328.jpg, Oakcitydylan, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Skyhouse_Raleigh-20170328.jpg
 *    (drone from the west: roof pavilion, vault, pool, west end, south face)
 *  - Skyhouse Raleigh.jpg, Alexisrael, CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:Skyhouse_Raleigh.jpg
 *    (under construction: bays, balconies, concrete piers)
 *  - Skyhouse December 2023.jpg, City Dweller 2, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Skyhouse_December_2023.jpg
 *    (an end face square on: corner glass bays, spine, cream base)
 * USGS NAIP for the plan and roof. No look-only sources. No commercial
 * imagery.
 *
 * Doubts: no night photo was found, so the lit crown is assumed from the
 * glazed amenity storey; the north face is assumed to match the south;
 * the end faces' stepped top corners and the balcony railings are left
 * out; the rooftop pool is drawn as plain terrace.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { type XY, type Face, rect, ringFaces, face, curtain, coping, plate, cap, write } from './ral-wells-fargo-capitol-center'

const concrete = new Part(), light = new Part(), dark = new Part(), cream = new Part(), vault = new Part(), roof = new Part()

const X0 = -27.7, X1 = 27.8, Y0 = -13.4, Y1 = 13.3
const BASE = 12, RES = 69.5, AMEN = 74, WALLS = 75.5, CROWN = 80.4
const FLOOR = 3.2, G0 = 5.5

/** One face of the shaft, split into bays: 'g' glass, 'b' balconies. */
function bays(f: Face, kinds: string) {
  const pier = 1.2, n = kinds.length, w = (f.len - pier * (n + 1)) / n
  plate(concrete, f, 0, f.len, BASE, RES, 0, 0)
  for (let k = 0; k < n; k++) {
    const s0 = pier + k * (w + pier), s1 = s0 + w
    if (kinds[k] === 'g') {
      const sub = face([f.a[0] + f.t[0] * s0 + f.n[0] * 0.05, f.a[1] + f.t[1] * s0 + f.n[1] * 0.05], [f.a[0] + f.t[0] * s1 + f.n[0] * 0.05, f.a[1] + f.t[1] * s1 + f.n[1] * 0.05], BASE + 0.6, RES - 0.8)
      curtain(light, concrete, sub, { floor: FLOOR, every: 2, origin: G0, band: 0.5, mullion: 3.4, mullionW: 0.25 })
    } else {
      plate(dark, f, s0, s1, BASE + 0.6, RES - 0.8, 0.05)
      // balcony fronts (slab and railing read as one pale band), one every
      // two storeys, standing 1.4 m out, so the stack never reads as a dark stripe
      for (let z = G0 + 2 * FLOOR * Math.ceil((BASE + 1 - G0) / (2 * FLOOR)); z < RES - 1; z += 2 * FLOOR) {
        plate(concrete, f, s0 + 0.2, s1 - 0.2, z - 1.1, z, 1.4, 1.4)
      }
    }
  }
}

// The cream base: three storeys, shopfronts.
for (const f of ringFaces(rect(X0, Y0, X1, Y1), 0, BASE)) {
  plate(cream, f, 0, f.len, 0, BASE, 0, 0)
  const n = Math.max(2, Math.round(f.len / 5.5))
  for (let k = 0; k < n; k++) {
    const s0 = (k * f.len) / n + 0.9, s1 = ((k + 1) * f.len) / n - 0.9
    plate(dark, f, s0, s1, 0.6, 4.6, 0.05)
    plate(dark, f, s0, s1, 6.2, BASE - 1.4, 0.05)
  }
  coping(cream, { ...f, z1: BASE } as Face, 0.8, 0.3)
}

// The shaft: long faces alternate glass and balconies; ends glass–balconies–glass.
const ring = rect(X0, Y0, X1, Y1)
for (const f of ringFaces(ring, BASE, RES)) {
  bays(f, f.len > 40 ? 'gbgbgbg' : 'gbg')
  coping(concrete, f, 0.9, 0.2)
}
cap(roof, ring, RES)

// The spine fins on both ends: a tall metal blade up the balcony stack, past the roof.
for (const f of ringFaces(ring, 0, 0).filter((f) => f.len < 40)) {
  const m = f.len / 2
  plate(concrete, f, m - 0.45, m + 0.45, BASE + 2, CROWN, 1.9, 1.9)
  // its back, where it stands clear above the roof
  const p0: XY = [f.a[0] + f.t[0] * (m - 0.45), f.a[1] + f.t[1] * (m - 0.45)], p1: XY = [f.a[0] + f.t[0] * (m + 0.45), f.a[1] + f.t[1] * (m + 0.45)]
  const back = face(p1, p0, RES, CROWN)
  plate(concrete, back, 0, back.len, RES, CROWN, 0, 0)
}

// The amenity storey: glazed, set back 1.5 m, with a terrace round it.
const amen = rect(X0 + 1.5, Y0 + 1.5, X1 - 1.5, Y1 - 1.5)
for (const f of ringFaces(amen, RES, AMEN)) curtain(light, concrete, f, { floor: AMEN - RES, every: 1, mullion: 3.5, mullionW: 0.25 })
cap(roof, amen, AMEN)

// The pavilion: cream walls and a blue segmental barrel vault along x.
{
  const VX0 = -15, VX1 = 22, VW = 8.5
  const pav = rect(VX0, -VW, VX1, VW)
  for (const f of ringFaces(pav, AMEN, WALLS)) plate(cream, f, 0, f.len, AMEN, WALLS, 0, 0)
  const rise = CROWN - WALLS, R = (VW * VW + rise * rise) / (2 * rise), zc = CROWN - R
  const a0 = Math.asin(VW / R), segs = 10
  const pt = (i: number): [number, number] => {
    const a = -a0 + (2 * a0 * i) / segs
    return [R * Math.sin(a), zc + R * Math.cos(a)] // y, z
  }
  for (let i = 0; i < segs; i++) {
    const [y0, z0] = pt(i), [y1, z1] = pt(i + 1)
    const ny0 = Math.sin(-a0 + (2 * a0 * i) / segs), nz0 = Math.cos(-a0 + (2 * a0 * i) / segs)
    const ny1 = Math.sin(-a0 + (2 * a0 * (i + 1)) / segs), nz1 = Math.cos(-a0 + (2 * a0 * (i + 1)) / segs)
    const P: V3[] = [[VX0 - 0.4, y0, z0], [VX1 + 0.4, y0, z0], [VX1 + 0.4, y1, z1], [VX0 - 0.4, y1, z1]]
    const N: V3[] = [[0, ny0, nz0], [0, ny0, nz0], [0, ny1, nz1], [0, ny1, nz1]]
    vault.tri(P[0], P[1], P[2], undefined, undefined, undefined, [N[0], N[1], N[2]])
    vault.tri(P[0], P[2], P[3], undefined, undefined, undefined, [N[0], N[2], N[3]])
    // the arched end walls under the vault
    cream.tri([VX1, 0, WALLS], [VX1, y1, z1], [VX1, y0, z0])
    cream.tri([VX0, 0, WALLS], [VX0, y0, z0], [VX0, y1, z1])
  }
}

await write('ral-skyhouse-raleigh', 'SkyHouse Raleigh', [
  { part: concrete, material: finish('sky-concrete', 0xd4d1cb) },
  { part: light, material: windowVariant(2, 0x8aa8b9) },
  { part: dark, material: PALETTE.window },
  { part: cream, material: finish('sky-cream', 0xebe1cf) },
  { part: vault, material: finish('sky-vault', 0x7f9dc4) },
  { part: roof, material: PALETTE.roof },
], { bearing: 2, elevation: 0, height: CROWN, replaces: ['way/297829073'] })
