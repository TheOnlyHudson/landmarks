/**
 * Arts Centre Melbourne spire, over the Theatres Building, St Kilda Road
 * (Roy Grounds; spire 1984, rebuilt 1996-97): procedural, CC0-1.0.
 * bun generators/melbourne-arts-centre-spire.ts
 *
 * Writes models/melbourne-arts-centre-spire.glb (low) and
 * models/melbourne-arts-centre-spire.detail.glb (detail, from zoom 16).
 *
 * Only the spire is modelled, with its flared gold "tutu" skirt, standing
 * on the roof of the Theatres Building. OSM maps the spire as its own
 * building (way/271670390, 162 m, min_height 15 m) with the flare as a
 * building:part (way/272730480, 15-50 m); the Theatres Building drum is a
 * separate building (way/22664482, 15 m) that the map draws itself, so the
 * model stands on that roof with `elevation` 15 (OSM min_height), as the
 * Silvercup sign stands on its roof. y = 0 is the roof.
 *
 * Map frame: x east, y north, z up, metres; bearing 0, built in true
 * orientation. Origin = centroid of the OSM spire square (144.968426,
 * -37.821496). The square's sides run 13.4 degrees off east-west (OSM), and
 * the whole spire is turned with it.
 *
 * Identity, in order: the needle-thin white square lattice spire, 162 m;
 * its Eiffel-like flare at the foot into four white corner ribs; the gold
 * tubular net skirt between them, its lower edges swung up and out in four
 * scalloped arches (the "tutu"); the dark mast at the tip; the blue/violet
 * lighting at night.
 *
 * Evidence:
 *  - height: 162 m above the ground (published, Wikipedia "Arts Centre
 *    Melbourne"; OSM 162 m). Lattice top 148 m and mast above it from
 *    DXR's 2023 north view, scaled against the full 162 m.
 *  - shaft: about 6.2 m square where it leaves the flare (the OSM square,
 *    way/271670390), tapering to about 1.2 m at the lattice top (photos);
 *    panels of K-free X bracing with horizontals, as the photos show.
 *  - flare: the shaft's corner legs bend out from about 50 m (ground) and
 *    run on as the four white ribs to tips on the drum roof's edge, ~26 m
 *    out along the diagonals (photo-scaled against the drum, OSM 57 m wide).
 *  - skirt: the gold net (a diagonal grid of tubes) between each pair of
 *    ribs, its rim a bold gold truss arching up to ~17 m above the roof and
 *    bulging ~8 m beyond the tips' chord (DXR north view, Darius Family,
 *    Rexness detail).
 *  - colours: white steel, gold net (sunlit and shaded sides of the 2023
 *    photos), dark grey mast.
 *  - Members are drawn bolder and sparser than real (STYLE.md, bridges):
 *    the real net is about four times as dense.
 *
 * Night: the spire is floodlit blue-violet (Apacasstcur, "ACM Spire in
 * blue"): blue `neon` strips on the inner faces of the corner legs, the ribs
 * and the bracing glow at night and are barely seen by day; the rib and
 * neck light points are `lamp` beads.
 *
 * Photos (Wikimedia Commons):
 *  - "Arts Centre, Melbourne, north view 20230219 1.jpg", DXR, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Arts_Centre,_Melbourne,_north_view_20230219_1.jpg
 *  - "Arts Spire.jpg", Darius Family, CC BY 2.0
 *    https://commons.wikimedia.org/wiki/File:Arts_Spire.jpg
 *  - "Art Centre Spire Detail (4508414014).jpg", Rexness, CC BY-SA 2.0
 *    https://commons.wikimedia.org/wiki/File:Art_Centre_Spire_Detail_(4508414014).jpg
 *  - "Arts Centre Spire from footpath 2010.JPG", Tangerineduel, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Arts_Centre_Spire_from_footpath_2010.JPG
 *  - "The Arts Centre, Melbourne.jpg", Johntorcasio, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:The_Arts_Centre,_Melbourne.jpg
 *  - "ACM Spire in blue.jpg", Apacasstcur, CC BY-SA 4.0 (night)
 *    https://commons.wikimedia.org/wiki/File:ACM_Spire_in_blue.jpg
 * No lidar; no commercial imagery. Look-only: "Arts Centre Spire Pano,
 * Melbourne, jjron, 29.09.2010.jpg" (GFDL only, looked at, not used).
 *
 * Terrain: wrong for the site. Mapterhorn has z12 to z14 here (no z15) and
 * all three show a pit about 60 m across under the Theatres Building, its
 * floor near -75 m against ~9 m on St Kilda Road; nothing on the site goes
 * that deep, so it is an artefact in the terrain data. The map puts the
 * model's base on the lowest ground under the footprint, the pit floor, so
 * `terrain.ts check` (z14, elevation 15) reports 942 of 1154 m² of tops
 * buried, up to 73 m: the skirt and rib feet sit in the pit and the shaft
 * rises out of it. Per docs/evidence.md the model is kept true to the
 * photos and `elevation` stays at the roof's 15 m; no offset is made for
 * the pit, which would leave the spire floating once the terrain is fixed.
 *
 * Doubts: the roof under the skirt is the drum's, drawn by the map at a flat
 * 15 m; the real drum roof rises under the skirt (left to the map). The
 * rib tips' exact plan positions and the arch heights are photo estimates.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish } from './palette'

const ID = 'melbourne-arts-centre-spire'
const TAU = Math.PI * 2
const ROOF = 15 // OSM min_height: the Theatres Building roof the spire stands on
const NECK = 33, LATTICE_TOP = 148 - ROOF, MAST_TOP = 162 - ROOF
const ROT = (-13.4 * Math.PI) / 180 // the square's sides, CCW from east

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const crs = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))
const lerp3 = (a: V3, b: V3, t: number): V3 => add(a, mul(sub(b, a), t))

/** A tube of `sides` faces, `w` across, from a to b; open ends (they meet at joints). */
function tube(p: Part, a: V3, b: V3, w: number, sides = 4) {
  const d = unit(sub(b, a))
  const ref: V3 = Math.abs(d[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1]
  const e1 = unit(crs(d, ref)), e2 = crs(d, e1)
  const r = w / (sides === 4 ? Math.SQRT2 : sides === 3 ? 1.3 : 2)
  const off = sides === 4 ? Math.PI / 4 : 0
  const ring = (c: V3) => Array.from({ length: sides }, (_, i) => {
    const t = off + (i / sides) * TAU
    return add(c, add(mul(e1, r * Math.cos(t)), mul(e2, r * Math.sin(t))))
  })
  const A = ring(a), B = ring(b)
  for (let i = 0; i < sides; i++) {
    const j = (i + 1) % sides
    // outward = away from the axis; Part.tri winds to the normals given
    const n0 = unit(sub(A[i], a)), n1 = unit(sub(A[j], a))
    p.tri(A[i], A[j], B[j], undefined, undefined, undefined, [n0, n1, n1])
    p.tri(A[i], B[j], B[i], undefined, undefined, undefined, [n0, n1, n0])
  }
}
/** A polyline of tubes. */
const chain = (p: Part, pts: V3[], w: number, sides = 4) => { for (let i = 0; i < pts.length - 1; i++) tube(p, pts[i], pts[i + 1], w, sides) }
/** A small octahedral bead. */
function bead(p: Part, c: V3, r: number) {
  const X: V3[] = [[r, 0, 0], [0, r, 0], [-r, 0, 0], [0, -r, 0]]
  for (let i = 0; i < 4; i++) {
    const a = add(c, X[i]), b = add(c, X[(i + 1) % 4])
    p.tri(a, b, add(c, [0, 0, r]))
    p.tri(b, a, add(c, [0, 0, -r]))
  }
}

/** Corner k's horizontal unit direction (diagonal of the square). */
const diag = (k: number): V3 => {
  const t = ROT + Math.PI / 4 + (k * Math.PI) / 2
  return [Math.cos(t), Math.sin(t), 0]
}
/** The shaft's half-width at height z (above the neck). */
const hw = (z: number) => 0.45 + 2.6 * Math.pow(Math.max(0, LATTICE_TOP - z) / (LATTICE_TOP - NECK), 1.6)
/** Shaft corner k at height z. */
const corner = (k: number, z: number): V3 => add(mul(diag(k), hw(z) * Math.SQRT2), [0, 0, z])

// Rib: from the shaft corner at FLARE_Z, bending out to its tip on the roof.
const FLARE_Z = 38, TIP_R = 33, TIP_Z = 0.8
function rib(k: number, n: number): V3[] {
  const p0 = corner(k, FLARE_Z), p1: V3 = add(mul(diag(k), TIP_R), [0, 0, TIP_Z])
  // Hermite in (r, z): leaves the shaft along its taper, lands at ~32 degrees.
  const r0 = Math.hypot(p0[0], p0[1]), r1 = TIP_R
  const m0: [number, number] = [14, -32], m1: [number, number] = [34, -22]
  return Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n, t2 = t * t, t3 = t2 * t
    const h00 = 2 * t3 - 3 * t2 + 1, h10 = t3 - 2 * t2 + t, h01 = -2 * t3 + 3 * t2, h11 = t3 - t2
    const r = h00 * r0 + h10 * m0[0] + h01 * r1 + h11 * m1[0]
    const z = h00 * p0[2] + h10 * m0[1] + h01 * p1[2] + h11 * m1[1]
    return add(mul(diag(k), r), [0, 0, z])
  })
}

/**
 * The skirt lobe between ribs k and k+1 as a surface S(u, v): u across from
 * rib k to rib k+1, v down from the shaft (v = 0) to the rim (v = 1).
 * Along each rib it follows the rib; between them it hangs from the shaft
 * side at the neck and runs down and out to the arched rim.
 */
function lobe(k: number) {
  const R0 = rib(k, 24), R1 = rib((k + 1) % 4, 24)
  const ribAt = (R: V3[], v: number) => {
    const f = v * (R.length - 1), i = Math.min(R.length - 2, Math.floor(f))
    return lerp3(R[i], R[i + 1], f - i)
  }
  const mid = unit(add(diag(k), diag((k + 1) % 4)))
  return (u: number, v: number): V3 => {
    const a = ribAt(R0, v), b = ribAt(R1, v)
    const base = lerp3(a, b, u)
    // between the ribs the net billows out and its rim arches up
    const s = Math.sin(Math.PI * u)
    const out = 13 * s * Math.pow(v, 1.4)
    const up = 16 * s * Math.pow(v, 2.0) - 3 * s * Math.sin(Math.PI * v)
    return add(add(base, mul(mid, out)), [0, 0, up])
  }
}

function build(detail: boolean) {
  const white = new Part(), gold = new Part(), blue = new Part(), mast = new Part(), lamp = new Part()
  const W_LEG = detail ? 0.7 : 0.85, W_BRACE = detail ? 0.3 : 0.42, W_NET = detail ? 0.32 : 0.55, W_RIM = detail ? 1.1 : 1.3
  const SIDES = detail ? 6 : 4

  // ---- shaft: four corner legs and X-braced panels with horizontals
  const levels: number[] = []
  for (let z = FLARE_Z; z < LATTICE_TOP - 0.1;) {
    levels.push(z)
    z += Math.max(detail ? 3.2 : 6, hw(z) * (detail ? 1.6 : 2.6))
  }
  levels.push(LATTICE_TOP)
  for (let k = 0; k < 4; k++) {
    chain(white, levels.map((z) => corner(k, z)), W_LEG, SIDES)
    for (let i = 0; i < levels.length - 1; i++) {
      const a0 = corner(k, levels[i]), b0 = corner((k + 1) % 4, levels[i])
      const a1 = corner(k, levels[i + 1]), b1 = corner((k + 1) % 4, levels[i + 1])
      const bs = detail ? 4 : 3
      tube(white, a0, b0, W_BRACE, bs)
      tube(white, a0, b1, W_BRACE, bs)
      tube(white, b0, a1, W_BRACE, bs)
      // blue light strip on the outer face of the horizontal
      const o = mul(unit(add(diag(k), diag((k + 1) % 4))), W_BRACE * 0.6 + 0.03), h: V3 = [0, 0, 0.22]
      const A = add(a0, o), B = add(b0, o)
      blue.quad(sub(A, h), sub(B, h), add(B, h), add(A, h))
      blue.quad(sub(A, h), add(A, h), add(B, h), sub(B, h))
    }
    // the blue light strip on the leg's outer edge: a hairline by day, the blue glow at night
    for (let i = 0; i < levels.length - 1; i++) {
      const a = corner(k, levels[i]), b = corner(k, levels[i + 1])
      const inA = mul(diag(k), W_LEG * 0.71 + 0.03), e: V3 = [-diag(k)[1] * 0.3, diag(k)[0] * 0.3, 0]
      const A = add(a, inA), B = add(b, inA)
      blue.quad(sub(A, e), add(A, e), add(B, e), sub(B, e))
      blue.quad(sub(A, e), sub(B, e), add(B, e), add(A, e))
    }
  }
  // top cap of the lattice and the mast
  for (let k = 0; k < 4; k++) tube(white, corner(k, LATTICE_TOP), corner((k + 1) % 4, LATTICE_TOP), W_BRACE, 4)
  tube(mast, [0, 0, LATTICE_TOP - 3], [0, 0, MAST_TOP - 4], 0.6, 6)
  tube(mast, [0, 0, MAST_TOP - 4], [0, 0, MAST_TOP], 0.3, 6)

  // ---- the flare: the corner legs bend out into the four white ribs
  const NR = detail ? 24 : 12
  const ribs = [0, 1, 2, 3].map((k) => rib(k, NR))
  for (const R of ribs) {
    chain(white, R, W_LEG * 1.25, SIDES)
    // blue light strip along the rib's top
    for (let i = 0; i < R.length - 1; i++) {
      const d = unit(sub(R[i + 1], R[i])), side = unit(crs(d, [0, 0, 1])), down = unit(crs(side, d))
      const o = mul(down, -(W_LEG * 0.9 + 0.03))
      const A = add(R[i], o), B = add(R[i + 1], o), e = mul(side, 0.32)
      blue.quad(sub(A, e), add(A, e), add(B, e), sub(B, e))
      blue.quad(sub(A, e), sub(B, e), add(B, e), add(A, e))
    }
    // the rib's foot: a steel shoe down to the roof
    {
      const t = R[R.length - 1], h = 0.9
      const ring: V3[] = [[t[0] - h, t[1] - h, 0], [t[0] + h, t[1] - h, 0], [t[0] + h, t[1] + h, 0], [t[0] - h, t[1] + h, 0]]
      const up = (q: V3): V3 => [q[0], q[1], t[2] + 0.4]
      for (let i = 0; i < 4; i++) { const a = ring[i], b = ring[(i + 1) % 4]; white.quad(a, b, up(b), up(a)) }
      white.quad(up(ring[0]), up(ring[1]), up(ring[2]), up(ring[3]))
    }
    // light points along the rib
    const nb = detail ? 10 : 5
    for (let i = 1; i <= nb; i++) bead(lamp, R[Math.round((i / (nb + 1)) * NR)], detail ? 0.45 : 0.6)
  }
  // the neck: bracing rings where the legs leave the shaft, down to the neck
  for (const z of [NECK + 4, NECK + 10]) {
    const pts = ribs.map((R) => {
      let best = R[0]
      for (const p of R) if (Math.abs(p[2] - z) < Math.abs(best[2] - z)) best = p
      return best
    })
    for (let k = 0; k < 4; k++) tube(white, pts[k], pts[(k + 1) % 4], W_BRACE * 1.4, 4)
  }

  // ---- the gold skirt: a diagonal net of tubes in each lobe, an arched rim truss
  const NU = detail ? 16 : 5, NV = detail ? 14 : 3
  for (let k = 0; k < 4; k++) {
    const S = lobe(k)
    // rim: the arched lower edge, a bold truss (two chords, struts in the detail)
    const rimN = detail ? 28 : 12
    const rim = Array.from({ length: rimN + 1 }, (_, i) => S(i / rimN, 1))
    chain(gold, rim, W_RIM, SIDES)
    if (detail) {
      const rim2 = Array.from({ length: rimN + 1 }, (_, i) => S(i / rimN, 0.93))
      chain(gold, rim2, W_RIM * 0.7, SIDES)
      for (let i = 0; i <= rimN; i++) tube(gold, rim[i], rim2[i], W_NET, 4)
      for (let i = 0; i < rimN; i++) tube(gold, rim[i], rim2[i + 1], W_NET, 4)
    }
    // diagonal net lines: u - v = c and u + v = c in the (u, v) square
    const step = 1 / NU
    for (const dir of [1, -1]) {
      for (let c = -1 + step; c < 2 - 1e-6; c += step) {
        const pts: V3[] = []
        for (let i = 0; i <= NV * 2; i++) {
          const v = i / (NV * 2), u = dir > 0 ? c + v : c - v
          if (u < -1e-6 || u > 1 + 1e-6) continue
          pts.push(S(u, v))
        }
        if (pts.length > 1) chain(gold, pts, W_NET, detail ? 4 : 3)
      }
    }
    // the net's top edge along the shaft side
    chain(gold, Array.from({ length: 5 }, (_, i) => S(i / 4, 0)), W_NET, 4)
    // light points along the rim in the detail model
    if (detail) for (let i = 2; i < rimN; i += 3) bead(lamp, add(rim[i], [0, 0, 0.8]), 0.4)
  }

  return [
    { part: white, material: finish('spire-white', 0xf2f1ec, 0.6) },
    { part: gold, material: finish('spire-gold', 0xd0a650, 0.5) },
    { part: blue, material: finish("neon-spire-blue", 0x5a6ad6) },
    { part: mast, material: finish('spire-mast', 0x6e737a) },
    { part: lamp, material: finish('lamp-spire', 0xe9e6dc) },
  ]
}

async function write(file: string, parts: ReturnType<typeof build>, maxTri: number, maxBytes: number) {
  const used = parts.filter((x) => x.part.triangles > 0)
  const triangles = used.reduce((s, x) => s + x.part.triangles, 0)
  if (used.length > 6) throw new Error(`${used.length} materials`)
  // the lowest vertex must sit at y = 0: the rib tips' feet
  const glb = writeGlb('Arts Centre Melbourne Spire', used, { frame: 'Y up, -Z north, +X east; metres; origin on the Theatres Building roof', bearing: 0, elevation: ROOF, height: MAST_TOP })
  if (triangles > maxTri || glb.length > maxBytes) throw new Error(`${file}: budget exceeded: ${triangles} triangles / ${glb.length} bytes`)
  await Bun.write(file, glb)
  console.log(`${file}: ${triangles} triangles, ${glb.length} bytes`)
}

if (import.meta.main) {
  const dir = new URL('../models/', import.meta.url).pathname
  await write(`${dir}${ID}.glb`, build(false), 6500, 250_000)
  await write(`${dir}${ID}.detail.glb`, build(true), 40_000, 1_536_000)
}
