/**
 * Dames Point Bridge (Napoleon Bonaparte Broward Bridge), Jacksonville
 * (1989) — procedural, CC0-1.0, no textures.
 * bun generators/jax-dames-point-bridge.ts
 *
 * The concrete cable-stayed bridge carrying I-295 over the St. Johns River
 * at Dames Point, with its two H-shaped pylons (two square legs tied by two
 * bow-tie struts over the deck and a beam under it), the harp-pattern stays
 * in two planes beside the deck, and the whole viaduct of the OSM outline
 * relation/14024722: the 792 m stayed unit, the 600 m north approach down to
 * its embankment, and the 1,800 m south approach, which falls to a low
 * trestle and curves west across the marsh to the Arlington side. No road
 * surfaces: the map draws I-295's lanes; the model draws the edge girders and
 * parapets beside them, the underside below, the piers and the pylons.
 *
 * Frame: x across (+x to the right going +y, i.e. west-south-west), y along
 * the bridge toward the south-south-east (bearing 159.5, the outline's
 * straight edges), z up, metres. Origin midway between the pylons on the
 * outline's centre line: -81.556944, 30.384530 (not the outline's centroid,
 * which falls off the bridge where it curves). z = 0 is the river: the map's
 * water (Mapterhorn) reads -0.8 m and the lidar's -0.53 m NAVD88, so lidar
 * heights are used +0.53 m and map ground +0.8 m. elevation 0.
 *
 * Roadway built to (lidar, FL_Peninsular_FDEM_Duval_2018, lower quartile of
 * the deck's lowest returns): 56.3 m at midspan (y = 0), 52.0 at the pylons,
 * a 5 % grade both ways from y = ±200 to ±1000 (12.3 m), then 6.6 at
 * y = 1160, a level trestle at 5.0–5.3 m from 1240 to 1520 m of arc, a rise
 * to 8.8 at 1900 and down to 6.4 at the south end (2,177 m of arc from the
 * origin); 12.3 m at the north end (y = -1000), on its embankment.
 *
 * Replaces: the outline relation/14024722 (man_made=bridge; no building or
 * building:part under it).
 *
 * Sources
 * - OSM (© OpenStreetMap contributors): the outline relation/14024722
 *   (outer way/1050719705, wikidata Q4116335): straight on bearing 159.5
 *   from its north end (y = -999) to y = 1150, 28 m wide; then curving
 *   right (west) for 1 km to its south end. The centre line of the curve
 *   (SOUTH_PATH) is the outline's midline, sampled every 50 m.
 * - Lidar (measured; USGS 3DEP FL_Peninsular_FDEM_Duval_2018, flown 2018,
 *   2 m strips 44–60 m wide along the bridge): pylon peaks 145.4 m above
 *   the water at y = -192..-189 and 203..207 (main span 396 m between their
 *   centres); the legs 4 m across, centred about 15 m either side of the
 *   axis; the upper strut's top 119.5 m at the legs dipping to 116.6 at
 *   the middle (the bow-tie); the roadway profile above.
 * - Map terrain: Mapterhorn z15 sampled along the centre line every 50 m:
 *   the river from y = -310 to 240, land 2.5–4.5 m on both sides of it,
 *   water and marsh (0–0.3 m) from y = 800 round the curve to within 30 m
 *   of the south end, which climbs to 6.3 m; the north end on a 12 m
 *   embankment.
 * - Published (Wikipedia, "Dames Point Bridge"): opened 1989; cable-stayed,
 *   concrete; main span 1,300 ft (396 m, as the lidar); side spans 650 ft
 *   (198 m), so the stayed unit ends at y = ±396.
 * Photos (evidence, Wikimedia Commons):
 * - Jonathan Zander (Digon3), "Dames Point Bridge, Jacksonville FL Pano
 *   2.jpg", CC BY-SA 3.0 (broadside from the north bank: the H pylons, the
 *   heights of the two struts, the harp stays from the lower strut to the
 *   top, the end piers as two-column portals, the deck's thin pale edge):
 *   https://commons.wikimedia.org/wiki/File:Dames_Point_Bridge,_Jacksonville_FL_Pano_2.jpg
 * - Ebyabe, "Jacksonville FL Dames Point Bridge south01.jpg", CC BY-SA 3.0
 *   (on the deck: the bow-tie struts, the legs outside the parapets):
 *   https://commons.wikimedia.org/wiki/File:Jacksonville_FL_Dames_Point_Bridge_south01.jpg
 * - P. Hughes, "Jacksonvile - Dames Point Bridge 01.jpg", CC BY 4.0 (from
 *   high upstream: the approach's two-column piers, the pale concrete):
 *   https://commons.wikimedia.org/wiki/File:Jacksonvile_-_Dames_Point_Bridge_01.jpg
 * - Tonopia, "Dames Point Bridge at Night - 17 June 2013.jpg", CC BY-SA 3.0
 *   (night: the stays lit white along their length, the legs lit from the
 *   deck): https://commons.wikimedia.org/wiki/File:Dames_Point_Bridge_at_Night_-_17_June_2013.jpg
 *
 * Numbers
 * - Pylons at y = ±198 (lidar), legs 4.2 m across × 6.5 m along at
 *   x = ±15.6 (lidar, photo-scaled), from a pile cap in the river (0–4 m,
 *   estimated) to 145.4 m; under the deck half as wide again (photo).
 * - Struts: bow-ties centred at 115 m (lidar) and 71 m (photo-scaled from
 *   Zander's panorama against the lidar's top and deck), 9 m deep at the
 *   legs and 3 m in the middle, 3 m thick; a beam under the deck.
 * - Stays: 10 per fan (half or fewer of the real ones, STYLE.md), anchored
 *   up the legs from 60 to 141 m (photo), parallel (harp), landing on the
 *   deck edge from 16 to 192 m out from the pylon; 0.4 m thick.
 * - Deck: edge girders 2.4 m deep under a 1.0 m parapet (one band), 26 m
 *   overall (lidar, between the legs; the outline is 28 m); the underside
 *   1.6 m under the roadway (estimated).
 * - Approach piers: two columns under a cap beam, every 45 m on the high
 *   approaches and 30 m where the road is under 12 m (estimated from the
 *   photos; the lidar can't see under the deck).
 * - Colour: pale weathered concrete from the daylight photos, #d4d1c8; the
 *   stays white-grey; the underside in shade.
 *
 * Night: the stays carry floodlight 0.8 and the pylons' side faces 1 (the
 *   night photo shows both lit).
 *
 * Doubts
 * - The lower strut's height is photo-scaled; the lidar can't separate it.
 * - Approach pier spacing and the shape of the piers are estimated; the
 *   back spans may have auxiliary piers the photos don't show clearly.
 * - The real stays are denser and in a fan-harp mix near the top; drawn as
 *   a pure harp at half density.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { band, face, footedLoft, piecewise, rod, stations } from './bridge-kit'
import { beam, box, countParts, loftSolid, one } from './sf-golden-gate-bridge'
import { finish } from './palette'

// ---- Layout --------------------------------------------------------------------
const T = 198            // pylon centres at y = ±T
const END = 396          // the stayed unit's end piers (side spans 198 m)
const HALF = 13          // half the deck's width (lidar: 26 m between the legs)
const LEG_X = 15.6, LEG_W = 4.2, LEG_T = 6.5
const TOP = 145.4
const NORTH_END = -999

/** The roadway above the river (lidar), by y on the straight and by arc length on the curve. */
const road = piecewise([
  [-1000, 12.3], [-200, 52.1], [-160, 53.5], [-120, 54.7], [-80, 55.5], [-40, 56.1], [0, 56.3], [40, 56.1],
  [80, 55.5], [120, 54.7], [160, 53.5], [200, 51.9], [1000, 12.3], [1040, 10.4], [1080, 8.9], [1120, 7.5],
  [1160, 6.6], [1200, 5.8], [1240, 5.3], [1280, 5.1], [1320, 5.0], [1480, 5.1], [1520, 5.2], [1560, 5.5],
  [1600, 5.8], [1640, 6.3], [1700, 7.1], [1740, 7.7], [1780, 8.2], [1820, 8.5], [1860, 8.7], [1900, 8.8],
  [1940, 8.7], [1980, 8.6], [2020, 8.3], [2060, 8.0], [2100, 7.6], [2140, 7.2], [2180, 6.8], [2220, 6.4],
])

/** Map ground above the river (Mapterhorn +0.8), by y; the curve's marsh is at the water. */
const groundY = piecewise([
  [-1006, 11.8], [-985, 6], [-956, 3.8], [-900, 4.8], [-800, 5.0], [-700, 4.4], [-600, 4.2], [-500, 4.1],
  [-456, 3.4], [-356, 3.1], [-326, 1.5], [-316, 0], [234, 0], [244, 1.5], [294, 3.2], [344, 3.4], [394, 4.4],
  [444, 3.2], [494, 2.9], [694, 2.8], [744, 3.1], [794, 1.3], [844, 0.5], [944, 0.3], [994, 0],
])
const ground = (x: number, y: number) => {
  if (y < 1100) return Math.max(0, groundY(y))
  // the south end: Mapterhorn 0.6 m at 2151, 6.3 at the end (by distance from the end)
  const d = Math.hypot(x - SOUTH_PATH[SOUTH_PATH.length - 1][0], y - SOUTH_PATH[SOUTH_PATH.length - 1][1])
  return piecewise([[0, 6.3], [12, 4], [25, 1.4], [40, 0]])(d)
}

// The south approach's centre line (the outline's midline), from the end pier.
const SOUTH_PATH: [number, number][] = [
  [0, END], [0, 1150], [1.1, 1201], [3.2, 1251], [7.0, 1301], [12.2, 1351], [18.7, 1401], [26.9, 1451],
  [36.5, 1501], [47.8, 1551], [60.7, 1601], [75.1, 1651], [91.0, 1701], [108.5, 1751], [128.2, 1801],
  [149.5, 1851], [172.6, 1901], [197.5, 1951], [224.8, 2001], [254.1, 2051], [285.8, 2101], [320.1, 2151], [334, 2170],
]
const NORTH_PATH: [number, number][] = [[0, -END], [0, NORTH_END]]

// ---- Parts ---------------------------------------------------------------------
type Kit = { pylon: Part; deck: Part; under: Part; stays: Part; veil: Part }

// ---- Pylons --------------------------------------------------------------------
/** A bow-tie strut between the legs' inner faces, centred at height zc. */
function bowTie(p: Part, yt: number, zc: number) {
  const xi = LEG_X - LEG_W / 2, hl = 4.5, hm = 1.5, t = 1.5
  const C = one(p)
  for (const s of [-1, 1]) {
    const ring = (y: number): V3[] => s < 0
      ? [[-xi, y, zc - hl], [0, y, zc - hm], [0, y, zc + hm], [-xi, y, zc + hl]]
      : [[0, y, zc - hm], [xi, y, zc - hl], [xi, y, zc + hl], [0, y, zc + hm]]
    loftSolid(C, [ring(yt - t), ring(yt + t)])
  }
}

function pylon(k: Kit, yt: number) {
  const C = one(k.pylon)
  // the pile cap in the river
  box(C, -LEG_X - 6, LEG_X + 6, yt - 8, yt + 8, 0, 4.0, { r: 1.5 })
  for (const s of [-1, 1]) {
    const x = s * LEG_X
    // below the deck the legs are half as wide again (Zander's panorama)
    box(C, x - LEG_W / 2 - 0.9, x + LEG_W / 2 + 0.9, yt - LEG_T / 2 - 1.5, yt + LEG_T / 2 + 1.5, 4.0, road(yt) - 3.0, { r: 0.4 })
    box(C, x - LEG_W / 2, x + LEG_W / 2, yt - LEG_T / 2, yt + LEG_T / 2, road(yt) - 3.0, TOP, { r: 0.4, top: 0.4 })
  }
  // the beam under the deck, with haunches against the legs
  box(C, -LEG_X, LEG_X, yt - 3.0, yt + 3.0, road(yt) - 5.2, road(yt) - 2.6, { r: 0.3 })
  bowTie(k.pylon, yt, 71)
  bowTie(k.pylon, yt, 115)
}

// ---- Stays ---------------------------------------------------------------------
const N_STAYS = 10, Z_LOW = 60, Z_HIGH = 141, D_NEAR = 16, D_FAR = 192
function stays(k: Kit, yt: number) {
  for (const s of [-1, 1])
    for (const dir of [-1, 1]) {
      const line: [V3, V3][] = []
      for (let i = 0; i < N_STAYS; i++) {
        const f = i / (N_STAYS - 1)
        const z = Z_LOW + (Z_HIGH - Z_LOW) * f
        const y = yt + dir * (D_NEAR + (D_FAR - D_NEAR) * f)
        const top: V3 = [s * LEG_X, yt + dir * (LEG_T / 2), z]
        const foot: V3 = [s * (HALF - 0.3), y, road(y) + 0.8]
        line.push([top, foot])
        rod(k.stays, top, foot, 0.4, 3)
      }
      // the veil: one translucent sheet between the first and last stays
      const [[t0, d0], [t1, d1]] = [line[0], line[N_STAYS - 1]]
      k.veil.tri(t0, d0, d1); k.veil.tri(t0, d1, t1)
    }
}

// ---- Deck of the stayed unit -----------------------------------------------------
function stayedDeck(k: Kit) {
  const ys = stations(-END - 1, END + 1, 20)
  for (const s of [-1, 1]) {
    // the edge girder and its parapet as one band
    band(k.deck, s * (HALF - 0.8), s * HALF, ys, (y) => road(y) + 1.0, (y) => road(y) - 2.6, { out: true, in: true, top: true, bottom: true, ends: true })
  }
  band(k.under, -HALF + 1.0, HALF - 1.0, ys, (y) => road(y) - 0.6, (y) => road(y) - 1.6, { bottom: true })
}

/** A portal pier square to the road at centre c, along-direction t, normal n: two columns under a cap beam. */
function portal(k: Kit, c: [number, number], n: [number, number], zr: number, colX = 10.5, colW = 2.4) {
  const capTop = zr - 2.6, gz = Math.max(...[-HALF, HALF].map((o) => ground(c[0] + n[0] * o, c[1] + n[1] * o)))
  const capBot = Math.max(capTop - 2.0, gz + 1.0)
  if (capTop - capBot < 0.6) return
  const t: [number, number] = [-n[1], n[0]]
  const P = (o: number, u: number): [number, number] => [c[0] + n[0] * o + t[0] * u, c[1] + n[1] * o + t[1] * u]
  const ccw = (pl: [number, number][]) => {
    const a = pl.reduce((acc, p, i) => acc + p[0] * pl[(i + 1) % pl.length][1] - pl[(i + 1) % pl.length][0] * p[1], 0)
    return a < 0 ? [...pl].reverse() : pl
  }
  const rect = (o0: number, o1: number, h: number) => ccw([P(o0, -h), P(o1, -h), P(o1, h), P(o0, h)])
  const cap = rect(-HALF + 0.6, HALF - 0.6, 1.4)
  footedLoft(k.deck, ground, [{ plan: cap, z: capBot }, { plan: cap, z: capTop }], 40)
  const C = one(k.deck)
  C([0, 0, -1]).tri([...cap[0], capBot] as V3, [...cap[2], capBot] as V3, [...cap[1], capBot] as V3)
  C([0, 0, -1]).tri([...cap[0], capBot] as V3, [...cap[3], capBot] as V3, [...cap[2], capBot] as V3)
  for (const s of [-1, 1]) {
    const col = rect(s * colX - colW / 2, s * colX + colW / 2, colW / 2)
    footedLoft(k.deck, ground, [{ plan: col, z: 'ground' }, { plan: col, z: capBot + 0.1 }], 4, false)
  }
}

// ---- Approaches along a path ---------------------------------------------------------
type Station = { c: [number, number]; n: [number, number]; s: number }
function pathStations(path: [number, number][], step: number): Station[] {
  const cum = [0]
  for (let i = 0; i + 1 < path.length; i++) cum.push(cum[i] + Math.hypot(path[i + 1][0] - path[i][0], path[i + 1][1] - path[i][1]))
  const out: Station[] = stations(0, cum[cum.length - 1], step).map((s) => {
    let i = 0
    while (i + 2 < cum.length && cum[i + 1] < s) i++
    const f = (s - cum[i]) / (cum[i + 1] - cum[i]), [a, b] = [path[i], path[i + 1]]
    return { c: [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f], n: [0, 0], s }
  })
  // the normal toward the side that is +x when the path runs toward +y
  const sy = Math.sign(path[path.length - 1][1] - path[0][1])
  for (let i = 0; i < out.length; i++) {
    const a = out[Math.max(0, i - 1)].c, b = out[Math.min(out.length - 1, i + 1)].c
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]), tx = (b[0] - a[0]) / l, ty = (b[1] - a[1]) / l
    out[i].n = [ty * sy, -tx * sy]
  }
  return out
}

/** A band swept along stations between lateral offsets o0 and o1, from bot(arc) to top(arc). */
function sweep(p: Part, st: Station[], o0: number, o1: number, top: (q: Station) => number, bot: (q: Station) => number,
  faces: { out?: boolean; in?: boolean; top?: boolean; bottom?: boolean; end?: boolean }) {
  const at = (q: Station, o: number, z: number): V3 => [q.c[0] + q.n[0] * o, q.c[1] + q.n[1] * o, z]
  const outO = Math.abs(o1) >= Math.abs(o0) ? o1 : o0, inO = outO === o1 ? o0 : o1, sg = Math.sign(outO - inO)
  for (let i = 0; i + 1 < st.length; i++) {
    const [a, b] = [st[i], st[i + 1]]
    const n: V3 = [(a.n[0] + b.n[0]) / 2, (a.n[1] + b.n[1]) / 2, 0]
    for (const [o, on, k] of [[outO, faces.out, sg], [inO, faces.in, -sg]] as [number, boolean | undefined, number][])
      if (on) face(p, at(a, o, bot(a)), at(b, o, bot(b)), at(b, o, top(b)), at(a, o, top(a)), [n[0] * k, n[1] * k, 0])
    if (faces.top) face(p, at(a, o0, top(a)), at(a, o1, top(a)), at(b, o1, top(b)), at(b, o0, top(b)), [0, 0, 1])
    if (faces.bottom) face(p, at(a, o0, bot(a)), at(a, o1, bot(a)), at(b, o1, bot(b)), at(b, o0, bot(b)), [0, 0, -1])
  }
  if (faces.end) {
    const q = st[st.length - 1], q2 = st[st.length - 2]
    face(p, at(q, o0, bot(q)), at(q, o1, bot(q)), at(q, o1, top(q)), at(q, o0, top(q)), [q.c[0] - q2.c[0], q.c[1] - q2.c[1], 0])
  }
}

/** One approach from the stayed unit's end pier outward; arc(s) is the road table's coordinate. */
function approach(k: Kit, path: [number, number][], arc: (s: number) => number) {
  const st = pathStations(path, 40)
  const r = (q: Station) => road(arc(q.s))
  // fade the girder into the ground where the deck comes down to it
  const bot = (q: Station, d: number) => Math.max(r(q) - d, ground(q.c[0], q.c[1]))
  for (const s of [-1, 1]) {
    sweep(k.deck, st, s * (HALF - 0.8), s * HALF, (q) => r(q) + 1.0, (q) => bot(q, 2.4), { out: true, in: true, top: true, bottom: true, end: true })
  }
  sweep(k.under, st, -HALF + 1.0, HALF - 1.0, (q) => r(q) - 0.6, (q) => bot(q, 1.6), { bottom: true })
  // piers: 45 m apart while the road is high, 30 m on the low trestle
  const fine = pathStations(path, 5), L = fine[fine.length - 1].s
  for (let s = 45; s < L - 10; s += road(arc(s)) > 12 ? 45 : 30) {
    const q = fine[Math.round(s / 5)] ?? fine[fine.length - 1]
    portal(k, q.c, q.n, road(arc(q.s)))
  }
}

// ---- Build -------------------------------------------------------------------------
function build(): Kit {
  const k: Kit = { pylon: new Part(), deck: new Part(), under: new Part(), stays: new Part(), veil: new Part() }
  for (const yt of [-T, T]) { pylon(k, yt); stays(k, yt) }
  stayedDeck(k)
  // the stayed unit's end piers: portals with the columns under the girders
  for (const y of [-END, END]) portal(k, [0, y], [1, 0], road(y), 11.5, 3.0)
  approach(k, NORTH_PATH, (s) => -END - s)
  approach(k, SOUTH_PATH, (s) => END + s)
  return k
}

if (import.meta.main) {
  const k = build()
  const flood = (_p: V3, n: V3) => (n[2] > 0.7 ? 0.25 : 1)
  const PYLON = { ...finish('pylon-concrete', 0xd4d1c8), floodlight: flood }
  const DECK = finish('deck-concrete', 0xcfccc3)
  const UNDER = finish('deck-underside', 0x9a978f)
  const STAY = { ...finish('stay-white', 0xeeede8), floodlight: () => 0.8 }
  const VEIL = { ...finish('stay-veil', 0xeeede8), opacity: 0.25, doubleSided: true }
  const list = [
    { part: k.pylon, material: PYLON }, { part: k.deck, material: DECK }, { part: k.under, material: UNDER },
    { part: k.stays, material: STAY }, { part: k.veil, material: VEIL },
  ]
  const tris = countParts(list)
  const glb = writeGlb('Dames Point Bridge', list, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin midway between the pylons, on the river',
    bearing: 159.5, elevation: 0, pylons: [-T, T], stayedUnitEnds: [-END, END],
    roadway: { midspan: road(0), atPylons: road(T), northEnd: road(NORTH_END), southEnd: road(2177) },
  })
  console.log(`jax-dames-point-bridge.glb: ${tris} triangles, ${glb.length} bytes; ` + list.map((p) => `${p.material.name} ${p.part.triangles}`).join(', '))
  if (tris > 6500 || glb.length > 250 * 1024) throw new Error('over budget')
  await Bun.write(new URL('../models/jax-dames-point-bridge.glb', import.meta.url), glb)
}
