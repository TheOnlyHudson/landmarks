/**
 * Lake Harriet Bandshell (1986, Bentz/Thompson/Rietow), Minneapolis:
 * procedural, CC0-1.0.
 * bun generators/msp-lake-harriet-bandshell.ts [out.glb]
 *
 * Map frame: turned to the building, placement bearing 346: model +y points
 * north-north-west, toward the seating; +x runs along the building (bearing
 * 76, OSM's long walls). Origin at the area centroid of OSM way/39053367
 * (-93.307729, 44.928145). y = 0 is the lowest ground under it (lidar
 * 259.3 m); the site falls under 1 m toward the lake.
 *
 * Form: a shingled pavilion on Lake Harriet's north shore. The long front
 * toward the seats opens in a great elliptical stage arch, framed by two
 * white ribs with X lattice between them, under a bell-cast hood rising into
 * the main roof; inside, a white shell narrows to a glazed back wall with a
 * white grid, over a raised stage. A bell-cast hipped shingle roof runs along
 * the hall. Four square towers stand at the corners, the front pair taller:
 * shingled bodies, an open white X-lattice loggia band, steep flared pyramid
 * roofs with flagstaffs. Toward the lake a broad cross gable carries a great
 * round-headed window with a white grid.
 *
 * Sources
 * - OSM (ODbL): way/39053367 ("Lake Harriet Bandshell", building=public):
 *   outline, the corner towers' bulges, the long axis at bearing 76.
 * - USGS 3DEP lidar MN_CentralMissRiver_4_B22 (flown 2022), 0.5 m grid,
 *   above the ground: ridge 15.5-16 along the hall, about 1 m behind its
 *   centre line; eaves 9-11 (the flare included); tower roofs return
 *   9-11 (their thin tips are missed); a flagstaff to 19.
 * - Photos (Wikimedia Commons, evidence):
 *   Schwerdf (Commons user), "Lake Harriet Bandshell 2014-09-21.jpg", CC BY 4.0
 *   (the front from the seats, frontal: arch, ribs, lattice, towers, glazed
 *   back, roof); Chad Davis, "Lake Harriet Bandshell, Minneapolis
 *   (49160147127).jpg", CC BY 2.0 (the front at dusk, lit); Runner1928,
 *   "Lake Harriet Park 06.jpg", CC BY-SA 4.0 (the lake side: the rear gable
 *   and its window, the rear towers); Runner1928, "Lake Harriet Park
 *   01.jpg", CC BY-SA 4.0 (from the park, far); William Wesen,
 *   "Harrietbandshell.jpg", public domain.
 * - Published: built 1986 to a design by Bentz/Thompson/Rietow, replacing
 *   earlier bandstands on the site (Minneapolis Park and Recreation Board;
 *   Wikipedia, "Lake Harriet").
 * Measured (lidar): ridge height and line, eaves, the plan.
 * Estimated from the photos (scaled to the lidar ridge): the arch (half-width
 *   6.9, springing 3.4, crown 10.8), the ribs and lattice, the alcove's depth
 *   (6 m) and the stage (1.2 m), the towers (front 3.6 m square, body 5.4,
 *   loggia to 7.3, roof to 14.6; rear 3.0 m, roof to 12.0), the rear gable
 *   (apex 14.2) and window (7.2 m wide, crown 10.0), the roof's flare.
 * Left out: flags, the benches and plaza, the stage's side doors and
 *   railings, the shingles' coursing.
 * Doubts: the towers are drawn square; the rear pair may be octagonal (seen
 *   only at an angle in one photo); the hood over the arch is simplified to a
 *   ruled surface; the alcove's plan is estimated.
 * Night: the stage shell is lit full and the white trim mostly (the dusk
 *   photo), the shingles a little (`floodlight`); windows are `window`.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'
import { type XY, type Face, prism, rect, chamfer, flatShape, extrudeShape, archShape, arc, lathe, finishGlb, writeModel } from './sea-tacoma-union-station'

// Model frame: x along the building (bearing 76), y toward the seating (bearing 346).
const BX = 9.6, BY0 = -5.0, BY1 = 5.0 // the main hall
const EAVE = 8.4, RIDGE = 15.6, RY = 1.0, RX = 6.0 // roof (lidar ridge 15.5-16 at y ~1)
const AW = 6.9, ASPRING = 3.4, ARISE = 7.4 // the stage arch: half-width, springing, rise (crown 10.8)
const STAGE = 1.2, ADEPTH = 6.0 // stage floor, alcove depth

/** The stage arch's curve: a half ellipse, from (-w, spring) over to (w, spring). */
const archCurve = (w: number, spring: number, rise: number, n = 14): XY[] =>
  Array.from({ length: n + 1 }, (_, k) => { const a = Math.PI - (Math.PI * k) / n; return [w * Math.cos(a), spring + rise * Math.sin(a)] as XY })

export function build() {
  const wall = new Part(), roof = new Part(), trim = new Part(), win = new Part(), shell = new Part(), floor = new Part()
  const F = (o: V3, n: XY): Face => ({ o, n })
  const front = F([0, BY1, 0], [0, 1]) // seen from the seats, s runs west: s = -x

  // ---- the hall: shingled walls with the stage alcove cut into the front
  const yb = BY1 - ADEPTH
  prism(wall, null, chamfer(rect(-BX, BY0, BX, yb), 0.2), 0, EAVE)
  for (const sg of [-1, 1]) prism(wall, null, rect(Math.min(sg * AW, sg * BX), yb, Math.max(sg * AW, sg * BX), BY1), 0, EAVE)
  // the wall over the arch: between the arch and the hood above it
  const outer = archCurve(AW + 1.3, ASPRING, ARISE + 1.6)
  const inner = archCurve(AW, ASPRING, ARISE)
  extrudeShape(wall, front, [...inner.map(([s, z]) => [s, z] as XY), ...outer.slice().reverse()], -0.3, 0, false)
  // the white arch ribs: an outer band, an inner band, and X lattice between
  const band = (c: XY[], c2: XY[], d: number) => extrudeShape(trim, front, [...c, ...c2.slice().reverse()], 0, d)
  band(archCurve(AW + 1.3, ASPRING, ARISE + 1.6), archCurve(AW + 0.95, ASPRING, ARISE + 1.25), 0.25)
  band(archCurve(AW + 0.35, ASPRING, ARISE + 0.35), archCurve(AW, ASPRING, ARISE), 0.25)
  const o = archCurve(AW + 0.95, ASPRING, ARISE + 1.25, 10), i = archCurve(AW + 0.35, ASPRING, ARISE + 0.35, 10)
  for (let k = 0; k < 10; k++) {
    for (const [a, b] of [[o[k], i[k + 1]], [i[k], o[k + 1]]]) {
      const dx = b[0] - a[0], dz = b[1] - a[1], l = Math.hypot(dx, dz), w = 0.09
      const nx = (-dz / l) * w, nz = (dx / l) * w
      flatShape(trim, front, [[a[0] + nx, a[1] + nz], [b[0] + nx, b[1] + nz], [b[0] - nx, b[1] - nz], [a[0] - nx, a[1] - nz]], 0.2)
    }
  }
  // posts carrying the arch, beside the towers
  for (const sg of [-1, 1]) prism(trim, trim, chamfer(rect(sg * AW - 0.45, BY1 - 0.1, sg * AW + 0.45, BY1 + 0.6), 0.1), 0, ASPRING + 0.2)
  // the alcove: white shell vault narrowing to the glazed back wall
  const rings: V3[][] = []
  for (let k = 0; k <= 4; k++) {
    const t = k / 4, y = BY1 - t * ADEPTH, w = AW - 1.1 * t, rise = ARISE - 1.6 * t
    rings.push(archCurve(w, ASPRING - 0.2 * t, rise, 12).map(([x, z]) => [-x, y, z] as V3)) // s = -x on this face
  }
  for (let k = 0; k < 4; k++)
    for (let j = 0; j < rings[k].length - 1; j++) shell.quad(rings[k][j], rings[k][j + 1], rings[k + 1][j + 1], rings[k + 1][j]) // seen from below and inside
  for (const sg of [-1, 1]) {
    // straight side walls from the springing down, following the narrowing
    const a: V3 = [sg * AW, BY1, 0], b: V3 = [sg * (AW - 1.1), yb, 0]
    const quad = [a, b, [b[0], b[1], ASPRING - 0.2], [a[0], a[1], ASPRING]] as V3[]
    if (sg > 0) shell.quad(quad[1], quad[0], quad[3], quad[2])
    else shell.quad(quad[0], quad[1], quad[2], quad[3])
  }
  // the glazed back of the stage, with its white grid
  const back = F([0, yb + 0.02, 0], [0, 1])
  const bw = AW - 1.1
  flatShape(shell, back, archShape(0, 2 * bw, 0, ASPRING - 0.2, 10).map(([s, z]) => [s, z * 1] as XY), 0.0)
  flatShape(win, back, rect(-bw + 0.8, STAGE + 0.4, bw - 0.8, STAGE + 5.8), 0.03)
  for (let k = 1; k < 5; k++) flatShape(trim, back, rect(-bw + 0.8 + ((2 * bw - 1.6) * k) / 5 - 0.07, STAGE + 0.4, -bw + 0.8 + ((2 * bw - 1.6) * k) / 5 + 0.07, STAGE + 5.8), 0.06)
  for (const z of [STAGE + 2.2, STAGE + 4.0]) flatShape(trim, back, rect(-bw + 0.8, z - 0.07, bw - 0.8, z + 0.07), 0.06)
  // the stage platform
  prism(floor, floor, [[-AW, BY1], [-(AW - 1.1), yb], [AW - 1.1, yb], [AW, BY1]].reverse() as XY[], 0, STAGE)
  extrudeShape(trim, front, rect(-AW, STAGE - 0.25, AW, STAGE), 0, 0.03)

  // ---- the roof: shingled, bell-cast hip, ridge along the hall; a hood over the arch
  const ring = (inset: number, z: number): V3[] => [[-BX - 0.5 + inset, BY0 - 0.5 + inset, z], [BX + 0.5 - inset, BY0 - 0.5 + inset, z], [BX + 0.5 - inset, BY1 + 0.5 - inset, z], [-BX - 0.5 + inset, BY1 + 0.5 - inset, z]]
  const e0 = ring(0, EAVE), e1 = ring(1.4, EAVE + 1.6)
  // the flared lower band
  for (let k = 0; k < 4; k++) { const l = (k + 1) % 4; roof.quad(e0[k], e0[l], e1[l], e1[k]) }
  // the upper hip to the ridge
  const R0: V3 = [-RX, RY, RIDGE], R1: V3 = [RX, RY, RIDGE]
  roof.quad(e1[0], e1[1], R1, R0) // south
  roof.quad(e1[2], e1[3], R0, R1) // north
  roof.tri(e1[1], e1[2], R1) // east
  roof.tri(e1[3], e1[0], R0) // west
  // the hood over the arch: the outer arch curve at the front, carried back up into the roof
  const hoodF = archCurve(AW + 1.5, ASPRING, ARISE + 1.8, 14)
  for (let j = 0; j < hoodF.length - 1; j++) {
    const [s0, z0] = hoodF[j], [s1, z1] = hoodF[j + 1]
    const A: V3 = [-s0, BY1 + 0.35, z0], B: V3 = [-s1, BY1 + 0.35, z1]
    const lift = (z: number) => Math.max(z, Math.min(RIDGE - 0.6, z + 2.6))
    const C: V3 = [-s1 * 0.8, RY + 1.2, lift(z1)], D: V3 = [-s0 * 0.8, RY + 1.2, lift(z0)]
    if (z0 < EAVE - 0.5 && z1 < EAVE - 0.5) continue
    roof.quad(A, B, C, D)
  }
  // a small cupola-like flagstaff base on the ridge
  prism(trim, trim, rect(-0.3, RY - 0.3, 0.3, RY + 0.3), RIDGE - 0.4, RIDGE + 2.6)

  // ---- four towers: square, shingled, a white open lattice band, steep bell-cast pyramid roofs
  const tower = (cx: number, cy: number, h: number, body: number, top: number, big: boolean) => {
    prism(wall, null, chamfer(rect(cx - h, cy - h, cx + h, cy + h), 0.15), 0, body)
    prism(trim, null, chamfer(rect(cx - h - 0.15, cy - h - 0.15, cx + h + 0.15, cy + h + 0.15), 0.1), body, body + 0.35)
    // the lattice loggia: corner posts and X bracing on each face over a dark opening
    prism(win, null, rect(cx - h + 0.3, cy - h + 0.3, cx + h - 0.3, cy + h - 0.3), body + 0.35, body + 1.9)
    for (const [dx, dy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) prism(trim, null, rect(cx + dx * h - 0.2, cy + dy * h - 0.2, cx + dx * h + 0.2, cy + dy * h + 0.2), body + 0.35, body + 1.9)
    for (const [n, o] of [[[0, 1], [cx, cy + h - 0.3, 0]], [[0, -1], [cx, cy - h + 0.3, 0]], [[1, 0], [cx + h - 0.3, cy, 0]], [[-1, 0], [cx - h + 0.3, cy, 0]]] as [XY, V3][]) {
      const f = F(o, n), z0 = body + 0.35, z1 = body + 1.9, L = h - 0.3
      for (const [a, b] of [[[-L, z0], [L, z1]], [[-L, z1], [L, z0]]] as [XY, XY][]) {
        const dx = b[0] - a[0], dz = b[1] - a[1], l = Math.hypot(dx, dz), w = 0.1
        flatShape(trim, f, [[a[0] - (dz / l) * w, a[1] + (dx / l) * w], [b[0] - (dz / l) * w, b[1] + (dx / l) * w], [b[0] + (dz / l) * w, b[1] - (dx / l) * w], [a[0] + (dz / l) * w, a[1] - (dx / l) * w]], 0.04)
      }
    }
    prism(trim, null, chamfer(rect(cx - h - 0.3, cy - h - 0.3, cx + h + 0.3, cy + h + 0.3), 0.1), body + 1.9, body + 2.2)
    // pyramid, flared at the foot
    const b0 = body + 2.2, H = h + 0.55
    const base: V3[] = [[cx - H, cy - H, b0], [cx + H, cy - H, b0], [cx + H, cy + H, b0], [cx - H, cy + H, b0]]
    const kick: V3[] = base.map(([x, y]) => [cx + (x - cx) * 0.72, cy + (y - cy) * 0.72, b0 + 0.9] as V3)
    const apex: V3 = [cx, cy, top]
    for (let k = 0; k < 4; k++) { const l = (k + 1) % 4; roof.quad(base[k], base[l], kick[l], kick[k]); roof.tri(kick[k], kick[l], apex) }
    prism(trim, trim, rect(cx - 0.08, cy - 0.08, cx + 0.08, cy + 0.08), top - 0.2, top + (big ? 2.4 : 1.6)) // flagstaff
    // a door or window low on the outer face
    return { cx, cy }
  }
  for (const sg of [-1, 1]) {
    tower(sg * 11.2, 3.9, 1.8, 5.4, 14.6, true) // front towers, flanking the stage
    tower(sg * 11.2, -3.8, 1.5, 4.6, 12.0, false) // rear towers
    // the links between the towers and the hall
    prism(wall, roof, rect(Math.min(sg * BX, sg * 11.2), -3.4, Math.max(sg * BX, sg * 11.2), 3.4), 0, 4.4)
    // doors in the front towers' faces
    flatShape(trim, F([sg * 11.2, 3.9 + 1.75, 0], [0, 1]), rect(-0.7, 0, 0.7, 2.4), 0.04)
    flatShape(win, F([sg * 11.2, 3.9 + 1.75, 0], [0, 1]), rect(-0.55, 0.1, 0.55, 2.3), 0.07)
  }

  // ---- the rear, toward the lake: a cross gable with the great round-headed window
  const RG = 5.4, RAPEX = 14.2
  prism(wall, null, rect(-RG, BY0 - 0.6, RG, BY0 + 0.1), 0, EAVE)
  const rear = F([0, BY0 - 0.6, 0], [0, -1]) // seen from the lake, s runs east: s = x
  extrudeShape(wall, rear, [[-RG, EAVE - 0.01], [RG, EAVE - 0.01], [0, RAPEX]], -0.1, 0, false)
  extrudeShape(trim, rear, [[-RG - 0.3, EAVE - 0.2], [-RG + 0.2, EAVE - 0.2], [0, RAPEX - 0.45], [RG - 0.2, EAVE - 0.2], [RG + 0.3, EAVE - 0.2], [0, RAPEX + 0.25]], 0, 0.25)
  for (const sg of [-1, 1]) {
    const a: V3 = [sg * (RG + 0.4), BY0 - 0.8, EAVE - 0.2], b: V3 = [sg * (RG + 0.4), RY, EAVE - 0.2], c: V3 = [0, RY, RAPEX], d: V3 = [0, BY0 - 0.8, RAPEX]
    if (sg > 0) roof.quad(a, b, c, d)
    else roof.quad(b, a, d, c)
  }
  extrudeShape(trim, rear, archShape(0, 7.8, 1.0, 6.4, 12), 0, 0.06)
  flatShape(win, rear, archShape(0, 7.2, 1.3, 6.4, 12), 0.1)
  for (const s of [-2.4, -1.2, 0, 1.2, 2.4]) flatShape(trim, rear, rect(s - 0.08, 1.3, s + 0.08, 6.4 + Math.sqrt(Math.max(0, 12.96 - s * s)) - 0.1), 0.14)
  for (const z of [3.0, 4.8, 6.6]) flatShape(trim, rear, rect(-3.6, z - 0.08, 3.6, z + 0.08), 0.14)
  for (const s of [-7.5, 7.5]) { flatShape(trim, rear, rect(s - 0.9, 2.2, s + 0.9, 4.2), 0.06); flatShape(win, F([0, BY0, 0], [0, -1]), rect(s - 0.7, 2.4, s + 0.7, 4.0), 0.1) }

  const lit = (_p: V3, n: V3) => (n[2] > 0.7 ? 0.1 : 0.55)
  return finishGlb('msp-lake-harriet-bandshell', [
    { part: wall, material: { ...finish('bandshell-shingle', 0xc7a885), floodlight: lit } as Swatch },
    { part: roof, material: finish('bandshell-roof', 0xb5a28a) },
    { part: trim, material: { ...PALETTE.trim, floodlight: () => 0.8 } as Swatch },
    { part: win, material: PALETTE.window },
    { part: shell, material: { ...finish('bandshell-shell', 0xf4f1ea), doubleSided: true, floodlight: () => 1 } as Swatch },
    { part: floor, material: finish('bandshell-stage', 0xa98d72) },
  ], { name: 'Lake Harriet Bandshell' }, 5000)
}

if (import.meta.main) await writeModel('msp-lake-harriet-bandshell', build())
