/**
 * Saltair (III), 12408 Saltair Drive, Magna, on the south shore of the Great
 * Salt Lake by I-80. Procedural, CC0-1.0. bun generators/slc-saltair.ts
 *
 * The third Saltair pavilion (1981-82): a surplus Second World War aircraft
 * hangar re-clad in cream stucco and given the Moorish onion-domed towers
 * and great arched front of the 1893 Saltair. Today a concert venue.
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 34.2: model
 * +y runs along the building's long axis to the north-east, +x is the
 * south-east front (the parking lot side, with the arch). Origin: the area
 * centroid of OSM way/33411930 (-112.1880833, 40.7471098). y = 0 is the
 * lowest ground under the outline (Mapterhorn: lake flats, the site is flat
 * within about 0.6 m); the front ground stands about G = 0.4 higher.
 *
 * Plan (OSM way/33411930, footprint in this frame): the main block x -23.6
 * to 15.5 (south-west wing front) / 17.1 (north-east wing front), y -33.2 to
 * 32.2; a central block projects to x 25.1 between y -11.7 and 7.4. NAIP
 * (2021, 0.17 m) agrees: the four corner domes, the two front-centre domes
 * flanking the arch, a flat pale roof with skylights. NAIP puts the centre
 * towers a few metres behind OSM's projecting line; the towers here stand at
 * the OSM front, the doubt is noted.
 *
 * Heights (estimated, photo-scaled; no lidar covers the site): p4 shows the
 * 21 m south-west wing face straight on (~22 px/m): ground-storey band
 * 3.9 m, cornice 8.2 m, parapet 10.2 m; the centre tower's dark green bands
 * at 5.7 and 10.5 m, tower top 13.0 m, its dome about 4.1 m tall and wide.
 * p1 (front, 2002) gives the corner towers to about 11 m with domes ~4 m
 * and the arch crown near 15 m with a ~10 m span.
 *
 * Identifying features, from the photos: the six copper onion domes (four
 * corner towers, two taller centre towers with dark green string bands),
 * the great semicircular maroon arch with its dark inner ring and glazed
 * lunette between the centre towers, the barrel roof behind it showing
 * above the parapet, the cream stucco walls in three storeys with the
 * ground-floor blind ogee arcade (p4), and a small pointed cupola on the
 * south-west wing roof (p1).
 *
 * Photos (EVIDENCE):
 *  p1 https://commons.wikimedia.org/wiki/File:Saltair-2002-exterior-MCB.jpg
 *     Michael C. Berch, CC BY-SA 2.5 (south-east front, straight on, 2002)
 *  p2 https://commons.wikimedia.org/wiki/File:Saltair_Pavilion_UT1.jpg
 *     Acroterion, CC BY-SA 4.0 (from the lake flats, far, the domes in a row)
 *  p3 https://commons.wikimedia.org/wiki/File:Saltair_(7002365583).jpg
 *     InSapphoWeTrust, CC BY-SA 2.0 (front, from the south: tower, arch, tower)
 *  p4 https://commons.wikimedia.org/wiki/File:Saltair_(7002365399).jpg
 *     InSapphoWeTrust, CC BY-SA 2.0 (south-west wing front, straight on)
 *  p5 https://commons.wikimedia.org/wiki/File:SaltairUtah20050522.jpg
 *     BigBen212, CC BY-SA 3.0 (a long side from the salt flats; direction unsure)
 * Aerial: USGS NAIP (public domain), plan and dome positions.
 * Lidar: none (no USGS 3DEP point cloud listed for the site).
 * Doubts: the domes have weathered unevenly (in p3/p4, about 2012, the
 * south-west centre dome is green-bronze, the rest copper-brown; in p1 all
 * are new copper): all are drawn one weathered copper. The rear (north-west)
 * wall is seen only far off in p5: drawn with the same storeys and plain
 * windows. Ground-floor openings on the north-east wing are hidden by trees
 * in p1: given the same arcade as the south-west wing.
 * Left out: the trailer and fences, the entrance canopy, small vents.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { poly, prism, box, rect, type XY, type Face, NRM } from './slc-beehive-house'

/** A flat shape on a wall, given as (u along the wall, z) points; face/plane as in `panel`. */
export function wallShape(p: Part, face: Face, plane: number, pts: [number, number][], off = 0.05) {
  const n = NRM[face]
  const at = ([u, z]: [number, number]): V3 => (face === 'S' || face === 'N' ? [u, plane + n[1] * off, z] : [plane + n[0] * off, u, z])
  poly(p, pts.map(at), [n[0], n[1], 0])
}
/** An ogee (onion-pointed) arch outline: jambs from z0 to the springing zs, width w, centre u. */
export function ogee(u: number, w: number, z0: number, zs: number, seg = 4): [number, number][] {
  const r = w / 2, hp = 0.75 * r
  const left: [number, number][] = [[u - r, z0], [u - r, zs]]
  for (let k = 1; k <= seg; k++) { const a = (k / seg) * Math.PI / 2; left.push([u - r / 2 - (r / 2) * Math.cos(a), zs + (r / 2) * Math.sin(a)]) }
  for (let k = 1; k <= seg; k++) { const b = (k / seg) * Math.PI / 2; left.push([u - r / 2 + (r / 2) * Math.sin(b), zs + r / 2 + hp * (1 - Math.cos(b))]) }
  const right = left.slice(0, -1).reverse().map(([x, z]) => [2 * u - x, z] as [number, number])
  return [...left, ...right]
}
/** A body of revolution from a (radius, height) profile, bottom to top, closed at the top if r = 0. */
export function lathe(p: Part, cx: number, cy: number, z0: number, prof: [number, number][], seg = 14, capBottom = false) {
  const ring = (r: number, z: number): V3[] => Array.from({ length: seg }, (_, i) => {
    const a = (i / seg) * 2 * Math.PI
    return [cx + r * Math.cos(a), cy + r * Math.sin(a), z0 + z] as V3
  })
  const rings = prof.map(([r, z]) => ring(Math.max(r, 0.001), z))
  p.loft(rings)
  if (capBottom) p.cap(rings[0], false)
}
/** An onion dome of base radius R and height H (finial included) on a short drum. */
export function onion(p: Part, cx: number, cy: number, z0: number, R: number, H: number) {
  const prof: [number, number][] = [
    [R * 0.92, 0], [R * 1.12, H * 0.1], [R * 1.2, H * 0.24], [R * 1.12, H * 0.4], [R * 0.86, H * 0.55],
    [R * 0.52, H * 0.69], [R * 0.24, H * 0.8], [R * 0.09, H * 0.88], [R * 0.06, H * 0.95], [0, H],
  ]
  lathe(p, cx, cy, z0, prof, 14, true)
}

if (import.meta.main) {
  const stucco = new Part(), shade = new Part(), band = new Part(), maroon = new Part(), copper = new Part(), win = new Part()
  const G = 0.4
  const Z_BAND = G + 4.4, Z_CORN = G + 9.0, Z_PAR = G + 11.4
  const X_BACK = -23.6, X_SW = 15.5, X_NE = 17.1, Y_S = -33.2, Y_N = 32.2
  const CY0 = -13.2, CY1 = 8.9, X_FRONT = 25.1

  // ------------------------------------------------------------- main block ---
  const ring: XY[] = [[X_BACK, Y_S], [X_SW, Y_S], [X_SW, CY0], [X_SW, CY1], [X_NE, CY1], [X_NE, Y_N], [X_BACK, Y_N]]
  prism(stucco, ring, 0, Z_PAR, false)
  // flat roof just under the parapet top (the parapet reads as a 0.6 m lip)
  poly(shade, ring.map(([x, y]) => [x, y, Z_PAR - 0.05] as V3), [0, 0, 1])
  /** A projecting band round a rectilinear ring (outset `o`). */
  const outset = (r: XY[], o: number): XY[] => r.map((v, i) => {
    const a = r[(i + r.length - 1) % r.length], b = r[(i + 1) % r.length]
    const n1 = [(v[1] - a[1]), -(v[0] - a[0])], n2 = [(b[1] - v[1]), -(b[0] - v[0])]
    const l1 = Math.hypot(n1[0], n1[1]) || 1, l2 = Math.hypot(n2[0], n2[1]) || 1
    const m = [n1[0] / l1 + n2[0] / l2, n1[1] / l1 + n2[1] / l2]
    // right-angle corners: the vertex moves by o along each edge normal
    return [v[0] + o * m[0], v[1] + o * m[1]] as XY
  })
  // drop the collinear vertex on the south-west front (it only splits the face)
  const ringC: XY[] = [[X_BACK, Y_S], [X_SW, Y_S], [X_SW, CY1], [X_NE, CY1], [X_NE, Y_N], [X_BACK, Y_N]]
  prism(stucco, outset(ringC, 0.18), Z_BAND - 0.25, Z_BAND, true, true)
  prism(stucco, outset(ringC, 0.35), Z_CORN - 0.45, Z_CORN, true, true)
  prism(stucco, outset(ringC, 0.22), Z_PAR, Z_PAR + 0.3, true, true)

  // facades: blind ogee arcade on the ground storey, paired windows in the
  // middle storey, long windows in the attic, bay by bay (p4: ~2.6 m bays)
  function facade(face: Face, plane: number, u0: number, u1: number, arcade: boolean) {
    const n = Math.max(2, Math.round((u1 - u0) / 2.65)), w = (u1 - u0) / n
    for (let i = 0; i < n; i++) {
      const u = u0 + (i + 0.5) * w
      if (arcade) wallShape(shade, face, plane, ogee(u, w * 0.66, G + 0.1, G + 2.0), 0.04)
      else wallShape(win, face, plane, [[u - 0.55, G + 1.0], [u + 0.55, G + 1.0], [u + 0.55, G + 2.6], [u - 0.55, G + 2.6]], 0.05)
      wallShape(shade, face, plane, [[u - w * 0.4, Z_BAND + 0.5], [u + w * 0.4, Z_BAND + 0.5], [u + w * 0.4, Z_CORN - 0.8], [u - w * 0.4, Z_CORN - 0.8]], 0.03)
      wallShape(win, face, plane, [[u - 0.5, Z_BAND + 1.3], [u + 0.5, Z_BAND + 1.3], [u + 0.5, Z_BAND + 2.4], [u - 0.5, Z_BAND + 2.4]], 0.06)
    }
    // attic: windows in pairs of bays
    for (let i = 0; i + 1 < n; i += 2) {
      const a = u0 + i * w + 0.5, b = u0 + (i + 2) * w - 0.5
      wallShape(win, face, plane, [[a, Z_CORN + 0.45], [b, Z_CORN + 0.45], [b, Z_PAR - 0.6], [a, Z_PAR - 0.6]], 0.05)
    }
  }
  const T = 2.7 // half the corner tower
  facade('E', X_SW, Y_S + T + 0.3, CY0 - 0.2, true)
  facade('E', X_NE, CY1 + 0.2, Y_N - T - 0.3, true)
  facade('S', Y_S, X_BACK + T + 0.3, X_SW - T - 0.3, true)
  facade('N', Y_N, X_BACK + T + 0.3, X_NE - T - 0.3, true)
  facade('W', X_BACK, Y_S + T + 0.3, Y_N - T - 0.3, false)

  // ---------------------------------------------------------- corner towers ---
  const ZT = G + 12.0
  for (const [cx, cy] of [[X_SW, Y_S], [X_NE, Y_N], [X_BACK, Y_S], [X_BACK, Y_N]] as XY[]) {
    box(stucco, cx - T, cy - T, cx + T, cy + T, 0, ZT)
    box(stucco, cx - T - 0.3, cy - T - 0.3, cx + T + 0.3, cy + T + 0.3, Z_CORN - 0.45, Z_CORN, true)
    box(stucco, cx - T - 0.35, cy - T - 0.35, cx + T + 0.35, cy + T + 0.35, ZT, ZT + 0.4, true)
    box(stucco, cx - 2.0, cy - 2.0, cx + 2.0, cy + 2.0, ZT + 0.4, ZT + 1.0)
    onion(copper, cx, cy, ZT + 1.0, 2.0, 4.8)
    // a tall recessed panel on each outer face of the lower stage
    for (const f of ['S', 'N', 'E', 'W'] as Face[]) {
      const plane = f === 'S' ? cy - T : f === 'N' ? cy + T : f === 'E' ? cx + T : cx - T
      const u = f === 'S' || f === 'N' ? cx : cy
      wallShape(shade, f, plane, [[u - 1.5, G + 1.0], [u + 1.5, G + 1.0], [u + 1.5, Z_BAND + 2.6], [u - 1.5, Z_BAND + 2.6]], 0.03)
      wallShape(shade, f, plane, ogee(u, 1.3, Z_CORN + 0.6, Z_CORN + 1.4, 3), 0.04)
    }
  }

  // ------------------------------------------------------ centre and arch ---
  const ZC = G + 15.0, TC = 2.8
  // the block behind the towers, at wing height
  box(stucco, X_SW, CY0, 20.1, CY1, 0, Z_PAR)
  for (const cy of [CY0 + TC, CY1 - TC]) {
    const cx = X_FRONT - TC
    box(stucco, cx - TC, cy - TC, cx + TC, cy + TC, 0, ZC)
    // dark green string bands (p1, p3, p4)
    box(band, cx - TC - 0.3, cy - TC - 0.3, cx + TC + 0.3, cy + TC + 0.3, G + 6.1, G + 6.7, true)
    box(band, cx - TC - 0.3, cy - TC - 0.3, cx + TC + 0.3, cy + TC + 0.3, G + 11.6, G + 12.2, true)
    box(stucco, cx - TC - 0.4, cy - TC - 0.4, cx + TC + 0.4, cy + TC + 0.4, ZC, ZC + 0.45, true)
    box(stucco, cx - 2.1, cy - 2.1, cx + 2.1, cy + 2.1, ZC + 0.45, ZC + 1.0)
    onion(copper, cx, cy, ZC + 1.0, 2.15, 5.2)
    // the ogee window in the middle stage, a blind panel below
    for (const f of ['S', 'N', 'E'] as Face[]) {
      const plane = f === 'S' ? cy - TC : f === 'N' ? cy + TC : cx + TC
      const u = f === 'E' ? cy : cx
      wallShape(win, f, plane, ogee(u, 1.6, G + 7.8, G + 9.9, 3), 0.05)
      wallShape(shade, f, plane, [[u - 1.6, G + 0.8], [u + 1.6, G + 0.8], [u + 1.6, G + 5.4], [u - 1.6, G + 5.4]], 0.03)
    }
  }
  // the barrel roof and the great arch between the towers
  {
    const yc = (CY0 + CY1) / 2, zs = G + 9.5, R = 5.8, XA = 23.6
    const r1 = 4.6, r2 = 3.8 // maroon ring r1..R, dark inner ring r2..r1, lunette inside
    const seg = 12
    const arc = (r: number, x: number): V3[] => Array.from({ length: seg + 1 }, (_, k) => {
      const a = Math.PI - (k / seg) * Math.PI
      return [x, yc + r * Math.cos(a), zs + r * Math.sin(a)] as V3
    })
    // barrel shell (outer), from inside the main block to the arch face
    const back = arc(R, X_SW + 0.5), front = arc(R, XA)
    for (let k = 0; k < seg; k++) poly(maroon, [back[k], front[k], front[k + 1], back[k + 1]], [0, Math.cos(Math.PI - (k + 0.5) / seg * Math.PI), Math.sin((k + 0.5) / seg * Math.PI)])
    poly(maroon, back, [-1, 0, 0])
    // the arch face: rings and lunette
    const ringFace = (p: Part, ra: number, rb: number, x: number) => {
      const A = arc(ra, x), B = arc(rb, x)
      for (let k = 0; k < seg; k++) poly(p, [A[k], A[k + 1], B[k + 1], B[k]], [1, 0, 0])
    }
    ringFace(maroon, r1, R, XA)
    ringFace(band, r2, r1, XA + 0.04)
    poly(win, arc(r2, XA + 0.02), [1, 0, 0])
    // below the springing: the entrance bay between the towers, glazed,
    // framed by the dark and maroon jambs coming down to the canopy level
    const ya = CY0 + 2 * TC, yb = CY1 - 2 * TC
    box(stucco, 20.1, ya, XA, yb, 0, zs)
    wallShape(win, 'E', XA, [[yc - r2, G + 0.2], [yc + r2, G + 0.2], [yc + r2, zs], [yc - r2, zs]], 0.03)
    for (const s of [-1, 1]) {
      wallShape(band, 'E', XA, [[yc + s * r2, G + 3.4], [yc + s * r1, G + 3.4], [yc + s * r1, zs], [yc + s * r2, zs]], 0.04)
      const lo = Math.min(yc + s * r1, yc + s * (yb - yc)), hi = Math.max(yc + s * r1, yc + s * (yb - yc))
      wallShape(maroon, 'E', XA, [[lo, G + 3.4], [hi, G + 3.4], [hi, zs], [lo, zs]], 0.04)
    }
    // the glazing's dark frame: two mullions up into the lunette, a transom at the springing (p3)
    for (const du of [-1.3, 1.3]) {
      const top = zs + Math.sqrt(r2 * r2 - du * du) - 0.1
      wallShape(band, 'E', XA, [[yc + du - 0.12, G + 3.4], [yc + du + 0.12, G + 3.4], [yc + du + 0.12, top], [yc + du - 0.12, top]], 0.06)
    }
    wallShape(band, 'E', XA, [[yc - r2, zs - 0.12], [yc + r2, zs - 0.12], [yc + r2, zs + 0.12], [yc - r2, zs + 0.12]], 0.06)
    // the doors under the glazing (entrance, as window glass; glows at night)
    wallShape(band, 'E', XA, [[yc - r1, G + 3.1], [yc + r1, G + 3.1], [yc + r1, G + 3.5], [yc - r1, G + 3.5]], 0.08)
  }

  // the small pointed cupola on the south-west wing roof (p1)
  box(stucco, 6.0, -24.8, 7.6, -23.2, Z_PAR - 0.1, Z_PAR + 0.9)
  onion(copper, 6.8, -24.0, Z_PAR + 0.9, 0.8, 2.1)

  // ---------------------------------------------------------------- output ---
  // Colours from p1 (sunlit, 2002) and p3/p4 (overcast): warm cream-tan
  // stucco, a darker tan in the recesses and on the roof, dark green string
  // bands, maroon arch, weathered copper domes.
  const parts = [
    { part: stucco, material: finish('saltair-stucco', 0xe6d8bd) },
    { part: shade, material: finish('saltair-recess', 0xc8b89b) },
    { part: band, material: finish('saltair-green', 0x4d6255) },
    { part: maroon, material: finish('saltair-arch', 0x8c4a40) },
    { part: copper, material: finish('saltair-copper', 0xa86a45) },
    { part: win, material: PALETTE.window },
  ]
  const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
  if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Saltair', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
    bearing: 34.2, elevation: 0, height: G + 15 + 1 + 5.2,
  })
  await Bun.write(new URL('../models/slc-saltair.glb', import.meta.url), glb)
  console.log(`slc-saltair.glb: ${triangles} triangles, ${glb.length} bytes`)
}
