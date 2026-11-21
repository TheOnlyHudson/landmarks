/**
 * Heydar Aliyev Center, Baku (Zaha Hadid Architects, 2007-2012): procedural,
 * CC0-1.0.  bun generators/baku-heydar-aliyev-center.ts
 *
 * Writes two levels of detail in the same frame:
 * - models/baku-heydar-aliyev-center.glb, the low model (budget 6,500 tris);
 * - models/baku-heydar-aliyev-center.detail.glb, from zoom 16: the same forms
 *   with ~3x the stations along every facade, 9-segment lip rolls, a finer
 *   roof mesh and glass lines every 5 m / 4 m instead of 10 m / 12 m.
 *
 * Form (round 2, after lead review): the skin is built in two kinds of
 * piece, all one white material:
 * - Ribbons: the skin's thick free edge swept along a facade path (the OSM
 *   outline, Chaikin-smoothed). Each station's section runs from the soffit,
 *   round a rounded lip that leans out over the glass (up to 4 m at the big
 *   arch's crown, band 2.4-4.7 m deep), up the outer face and back over the
 *   top into the roof. The glass wall stands 1.6-3 m back under the lip,
 *   tilted out toward its top. Smooth normals from the swept grid; end caps
 *   ear-clipped from the section. Ribbons: the south-west arch (low west
 *   arch touching down, then the big arch: long west leg, rounded crown
 *   ~39 m to the glass top / ~44 m to the skin, steep east side); the
 *   north-west glass face rising in a long concave sweep from 2.5 m to
 *   47 m, the peak's own north-west flank; four nested white folds on the
 *   far side of the peak (fins to the ground, 34/26/19/13 m, flush, rounded
 *   at their ends) with dark glass slots 4 m deep between
 *   them; the east wing's lifted edge and two more lips stacked 4 m and 8 m
 *   behind it over dark bands, curling round the east end.
 * - The roof: a height field over the outline pulled 2.5 m in behind the
 *   ribbons, Delaunay-triangulated, rising from each ribbon's top into the
 *   interior swells, and kept just under every ribbon's skin. The peak is a
 *   broad, smooth, round-topped hill (lathe-like: polar point rings, base
 *   ~50 m across) 7 m inside the north-west face, which rises into it.
 *
 * Map frame: x east, y north, z up, metres, bearing 0. Anchor = area
 * centroid of the outline, 49.8675821 E, 40.3960622 N. Elevation 0.
 *
 * OSM (© OpenStreetMap contributors, ODbL), fetched Nov 2026:
 * - relation/19380164 (building=yes, amenity=exhibition_centre, wikidata
 *   Q43928, height=15 which is wrong for the peak and not used): outer
 *   way/294358406, the footprint used here; inner way/1416637848, a 10 x 30 m
 *   void under the skin near the peak's base, not modelled (no photo shows
 *   it from outside; the skin is drawn closed over it).
 * - node/13018215782 "Heydar Aliyev Center" (inside the outline).
 * - Neighbours checked with osm.py buildings, none under the model:
 *   way/399442046 Baku Convention Centre (60 m NW), way/357399579 and
 *   way/447574853/447574855/447574857 (east of the plaza), way/193628919,
 *   way/193628920, way/295062087, way/1057737464, way/1416637837,
 *   way/1416637847 (all 60 m+ away).
 * The outline is drawn coarsely in OSM (long straight NW and NE sides): the
 * glass lines here follow it, so they are as straight as it is.
 *
 * Published (cited):
 * - Zaha Hadid Architects, competition 2007, opened 10 May 2012; 57,500 m2,
 *   eight levels, 1,000-seat auditorium, museum, galleries (en.wikipedia
 *   "Heydar Aliyev Center").
 * - Roof height 74 m (en.wikipedia infobox, uncited there). NOT matched:
 *   the peak is drawn at 58 m. Two photo scalings give 48-55 m above the
 *   plaza (below); round 2 raised it to 58 m so it stands clearly over the
 *   arch crown in every view, as in the photos. 74 m is probably measured
 *   from the low end of the park, which falls away south-west. Doubt.
 *
 * Estimated from the photos (photo scaling):
 * - Big arch crown ~40 m to the glass top, ~44 m to the skin: o7, people (1.7 m) at the glass under the arch
 *   ~15 px, crown 355 px above the plaza (=> ~40 m); ground storey 6-7 m,
 *   drawn as the white canopy band across the tall glass at 6-7.2 m.
 * - Peak (drawn 58 m; see above): c4 and c9 (from the south-west, ~400 m away), the peak's top
 *   stands 1.07-1.09x the arch crown's above the visible base, and is farther
 *   away (x1.15); and c4's ~150 m projected width gives 48 m.
 * - Plan positions: big arch on the south-west facade, crown near its east
 *   end, steep east side, long diagonal west rim (c4, c9, c6, c7, e3: the
 *   Convention Centre lies beyond the arch's west foot in e3); low west arch
 *   at the west corner, glazed, facing south-west (c9, o5, o6); the peak
 *   about 20 m inside the north-west glass face, north of the arch (c4/c9
 *   put it ~30 m left of the crown seen from the south-west; o5/o6 from the
 *   west put it north); the north-west face a long glass curtain rising
 *   steeply to the peak, with the ribbed skin stepping down to the west arch
 *   (o13); the east wing low, its front a lifted edge 6-11 m over a glass
 *   band, rising at its east end (c4, c7, o7); the north-east sides closed
 *   white skin down to the ground (e2).
 * - Glass: dark, reflecting the sky, ~#56687a in shade; drawn `window`
 *   0x5b6f80 (it is lit from inside at night, c5). Mullions pale grey.
 * - Skin: pure white GFRC panels; drawn 0xf6f6f3, floodlit warm at night
 *   (c5: the skin is washed in warm light all over).
 * Invented: the exact edge-height profile between photographed points; the
 * shape of the roof behind the silhouettes (no aerial photo); the courtyard
 * (OSM's notch on the south side, read as an entrance under a 6 m canopy).
 *
 * Ground: Mapterhorn here is only z12 and a surface model; it shows ~15 m of
 * relief across the footprint, while the photos show the plaza level with
 * the building and the park falling away south-west. Kept true to the
 * photos (docs/evidence.md, "Terrain that is wrong for the site").
 *
 * Photos (evidence; author, licence):
 * - c4 "The Aliyev Center In Context", Francisco Anzola, CC BY 3.0,
 *   https://commons.wikimedia.org/wiki/File:The_Aliyev_Center_In_Context_(220956695).jpeg
 * - c9 "Baku 15 06 14 216000.jpeg", Robot8A, CC BY-SA 4.0,
 *   https://commons.wikimedia.org/wiki/File:Baku_15_06_14_216000.jpeg
 * - c5 "Heydar Aliyev Center, Baku - HyderAliyevCenter8319.jpg" (night),
 *   lumoplank, CC0,
 *   https://commons.wikimedia.org/wiki/File:Heydar_Aliyev_Center,_Baku_-_HyderAliyevCenter8319.jpg
 * - c6, c7 "HEIDAR ALIYEV CENTER WIDE ANGLE" / "... AND GARDENS", Avisadehh,
 *   CC0, https://commons.wikimedia.org/wiki/File:HEIDAR_ALIYEV_CENTER_WIDE_ANGLE.%D7%96%D7%95%D7%95%D7%99%D7%AA_%D7%A8%D7%97%D7%91%D7%94_%D7%9E%D7%A8%D7%9B%D7%96_%D7%94%D7%99%D7%99%D7%93%D7%A8_%D7%90%D7%9C%D7%99%D7%99%D7%91.jpg
 * - e2 "Bakı, Heydər Əliyev Mərkəzi - 2.jpg", Tərxan Paşazadə, CC BY-SA 4.0,
 *   https://commons.wikimedia.org/wiki/File:Bak%C4%B1,_Heyd%C9%99r_%C6%8Fliyev_M%C9%99rk%C9%99zi_-_2.jpg
 * - e3 "Azarbaijan.jpg", shaasu1, CC BY-SA 4.0,
 *   https://commons.wikimedia.org/wiki/File:Azarbaijan.jpg
 * - o5, o6 "Futuristic design of the Heydar Aliyev Cultural Ce..." / "The
 *   Heydar Aliyev Centre was closed by the time we...", shankar s., CC BY 2.0,
 *   https://www.flickr.com/photos/77742560@N06/36234035314 and /37068822405
 * - o7 "Heydar Aliyev Center", Aleksandr Zykov, CC BY-SA 2.0,
 *   https://www.flickr.com/photos/84292292@N00/27761588499
 * - o13 "Side view of Heydar Aliyev Center", amanderson2, public domain mark,
 *   https://www.flickr.com/photos/49399018@N00/30679898326
 * - o14 "Stairs and Heydar Aliyev Center", amanderson2, public domain mark,
 *   https://www.flickr.com/photos/49399018@N00/30081984043
 * Look-only (not relied on): Eric Esquivel's and leonyaakov's Flickr photos
 * (CC BY-NC-SA 2.0), seen in the Openverse search only.
 * No Mapillary (no token on this machine). No aerial or drone photo found.
 *
 * Doubts: there is no open aerial and the OSM outline is coarse, so where
 * the peak and the courtyard sit is inferred from photo parallax. The two
 * key views pull against each other: o13 puts the peak on top of the
 * north-west glass wall, which on this outline places it ~45 m left of the
 * arch crown seen from the south-west, where c4 and c9 show ~30 m; the
 * model follows o13 (lead review, round 3), so from the south-west the
 * peak stands a little too far left and the glass wall's edge shows as a
 * straight edge at the far left. o7 (close, on
 * the plaza) shows the peak right of the arch, which this plan does not
 * give. The north-east bulk is drawn as low swells; e2 shows bigger
 * bellied volumes from a road whose position is not certain. 74 m is not
 * matched (58 m drawn).
 */
import { writeGlb, type MaterialSpec, Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'

type XY = [number, number]

// OSM relation/19380164 outer way/294358406, in the model frame (x east,
// y north, metres from the area centroid 49.8675821 E, 40.3960622 N).
// Counter-clockwise.
const OUTLINE: XY[] = [[-110.6, -38.0], [-86.2, -52.4], [-81.5, -55.4], [-78.2, -58.6], [-75.4, -62.1], [-73.0, -65.8], [-70.3, -70.9], [-67.6, -75.6], [-64.8, -78.5], [-61.8, -80.1], [-58.1, -81.2], [-54.5, -81.0], [-50.7, -79.7], [-47.7, -77.4], [-43.7, -73.7], [-40.4, -69.2], [-35.7, -60.0], [-18.6, -17.6], [0.5, -33.5], [3.8, -37.9], [5.4, -42.1], [6.3, -48.4], [4.1, -54.0], [-1.3, -59.7], [-8.5, -65.6], [-14.9, -70.5], [-17.6, -73.8], [-18.6, -75.8], [-18.9, -79.2], [42.4, -54.6], [85.6, -37.3], [93.3, -33.4], [97.8, -29.1], [100.5, -24.0], [101.6, -16.3], [100.2, -8.9], [88.5, 17.2], [85.5, 22.8], [82.4, 27.4], [80.3, 30.0], [55.2, 52.8], [7.9, 95.7], [5.1, 98.2], [-0.8, 91.8], [-11.4, 80.3], [-23.4, 67.3], [-34.2, 55.4], [-40.3, 48.9], [-111.2, -29.8], [-112.2, -31.2], [-112.6, -33.4], [-112.1, -36.0]]

// ------------------------------------------------------------- helpers --

const smooth = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t))
const smax = (a: number, b: number, k = 4) => k * Math.log(Math.exp(a / k) + Math.exp(b / k))
const bump = (p: XY, c: XY, h: number, sx: number, sy: number, rot = 0) => {
  const dx = p[0] - c[0], dy = p[1] - c[1]
  const ca = Math.cos(rot), sa = Math.sin(rot)
  const u = (dx * ca + dy * sa) / sx, v = (-dx * sa + dy * ca) / sy
  return h * Math.exp(-(u * u + v * v))
}
/** A smooth (Catmull-Rom) curve through sorted [x, y] keys. */
function keyed(keys: [number, number][], x: number) {
  if (x <= keys[0][0]) return keys[0][1]
  for (let i = 0; i < keys.length - 1; i++) {
    const [x0, y0] = keys[i], [x1, y1] = keys[i + 1]
    if (x <= x1) {
      const ym = i > 0 ? keys[i - 1][1] : y0, yp = i + 2 < keys.length ? keys[i + 2][1] : y1
      const t = (x - x0) / (x1 - x0), t2 = t * t, t3 = t2 * t
      return 0.5 * (2 * y0 + (-ym + y1) * t + (2 * ym - 5 * y0 + 4 * y1 - yp) * t2 + (-ym + 3 * y0 - 3 * y1 + yp) * t3)
    }
  }
  return keys[keys.length - 1][1]
}

function resample(r: XY[], step: number, closed = true) {
  const pts: XY[] = [], s: number[] = []
  let acc = 0
  const n = closed ? r.length : r.length - 1
  for (let i = 0; i < n; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const k = Math.max(1, Math.ceil(L / step))
    for (let j = 0; j < k; j++) {
      pts.push([a[0] + ((b[0] - a[0]) * j) / k, a[1] + ((b[1] - a[1]) * j) / k])
      s.push(acc + (L * j) / k)
    }
    acc += L
  }
  if (!closed) {
    pts.push(r[r.length - 1])
    s.push(acc)
  }
  return { pts, s, total: acc }
}

function inside(p: XY, r: XY[]) {
  let c = false
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    const a = r[i], b = r[j]
    if (a[1] > p[1] !== b[1] > p[1] && p[0] < ((b[0] - a[0]) * (p[1] - a[1])) / (b[1] - a[1]) + a[0]) c = !c
  }
  return c
}

function delaunay(pts: XY[]): [number, number, number][] {
  const n = pts.length
  const P = [...pts, [-1e4, -1e4], [1e4, -1e4], [0, 1e4]] as XY[]
  type T = { a: number; b: number; c: number; x: number; y: number; r2: number }
  const circ = (a: number, b: number, c: number): T => {
    const [ax, ay] = P[a], [bx, by] = P[b], [cx, cy] = P[c]
    const d = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by))
    const ux = ((ax * ax + ay * ay) * (by - cy) + (bx * bx + by * by) * (cy - ay) + (cx * cx + cy * cy) * (ay - by)) / d
    const uy = ((ax * ax + ay * ay) * (cx - bx) + (bx * bx + by * by) * (ax - cx) + (cx * cx + cy * cy) * (bx - ax)) / d
    return { a, b, c, x: ux, y: uy, r2: (ax - ux) ** 2 + (ay - uy) ** 2 }
  }
  let tris: T[] = [circ(n, n + 1, n + 2)]
  for (let i = 0; i < n; i++) {
    const [px, py] = P[i]
    const bad: T[] = [], keep: T[] = []
    for (const t of tris) ((px - t.x) ** 2 + (py - t.y) ** 2 < t.r2 ? bad : keep).push(t)
    const edges = new Map<string, [number, number]>()
    for (const t of bad)
      for (const [u, v] of [[t.a, t.b], [t.b, t.c], [t.c, t.a]]) {
        const k = u < v ? `${u},${v}` : `${v},${u}`
        if (edges.has(k)) edges.delete(k)
        else edges.set(k, [u, v])
      }
    for (const [u, v] of edges.values()) keep.push(circ(u, v, i))
    tris = keep
  }
  return tris.filter((t) => t.a < n && t.b < n && t.c < n).map((t) => [t.a, t.b, t.c])
}

const norm3 = (a: V3): V3 => {
  const l = Math.hypot(a[0], a[1], a[2]) || 1
  return [a[0] / l, a[1] / l, a[2] / l]
}
const crs = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const sub3 = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]

/** Ear-clipping triangulation of a simple polygon; returns index triples. */
function earClip(poly: XY[]): [number, number, number][] {
  let idx = poly.map((_, i) => i)
  let area = 0
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length]
    area += a[0] * b[1] - b[0] * a[1]
  }
  if (area < 0) idx.reverse()
  const cr = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const out: [number, number, number][] = []
  let guard = 0
  while (idx.length > 3 && guard++ < 5000) {
    let cut = false
    for (let i = 0; i < idx.length; i++) {
      const ia = idx[(i - 1 + idx.length) % idx.length], ib = idx[i], ic = idx[(i + 1) % idx.length]
      const A = poly[ia], B = poly[ib], C = poly[ic]
      if (cr(A, B, C) <= 1e-9) continue
      let ok = true
      for (const j of idx) {
        if (j === ia || j === ib || j === ic) continue
        const P = poly[j]
        if (cr(A, B, P) > 0 && cr(B, C, P) > 0 && cr(C, A, P) > 0) {
          ok = false
          break
        }
      }
      if (!ok) continue
      out.push([ia, ib, ic])
      idx.splice(i, 1)
      cut = true
      break
    }
    if (!cut) idx.splice(0, 1)
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}

// ----------------------------------------------------------- facade paths --

/** A facade line: the OSM outline smoothed (Chaikin) and resampled finely. */
type Path = { p: XY[]; n: XY[]; s: number[]; total: number; scale: number }
function path(raw: XY[]): Path {
  let r = raw
  for (let k = 0; k < 3; k++) {
    const o: XY[] = [r[0]]
    for (let i = 0; i < r.length - 1; i++) {
      const a = r[i], b = r[i + 1]
      o.push([0.75 * a[0] + 0.25 * b[0], 0.75 * a[1] + 0.25 * b[1]], [0.25 * a[0] + 0.75 * b[0], 0.25 * a[1] + 0.75 * b[1]])
    }
    o.push(r[r.length - 1])
    r = o
  }
  const f = resample(r, 0.25, false)
  const rawLen = resample(raw, 1, false).total
  const n = f.pts.map((_, i): XY => {
    const a = f.pts[Math.max(0, i - 3)], b = f.pts[Math.min(f.pts.length - 1, i + 3)]
    const tx = b[0] - a[0], ty = b[1] - a[1], l = Math.hypot(tx, ty)
    return [ty / l, -tx / l] // right of the direction of travel = outside
  })
  return { p: f.pts, n, s: f.s, total: f.total, scale: f.total / rawLen }
}
/** Index of the sample at s (metres along the raw OSM line). */
function idxAt(P: Path, sRaw: number) {
  const s = Math.max(0, Math.min(P.total, sRaw * P.scale))
  let lo = 0, hi = P.s.length - 1
  while (hi - lo > 1) {
    const m = (lo + hi) >> 1
    if (P.s[m] <= s) lo = m
    else hi = m
  }
  return s - P.s[lo] < P.s[hi] - s ? lo : hi
}
/** Point and outward normal at s (metres along the raw OSM line). */
function at(P: Path, sRaw: number) {
  const i = idxAt(P, sRaw)
  return { p: P.p[i], n: P.n[i] }
}

const NW = path([[5.1, 98.2], [-0.8, 91.8], [-11.4, 80.3], [-23.4, 67.3], [-34.2, 55.4], [-40.3, 48.9], [-111.2, -29.8]])
const SW = path([[-110.6, -29.2], [-112.2, -31.2], [-112.6, -33.4], [-112.1, -36.0], [-110.6, -38.0], [-86.2, -52.4], [-81.5, -55.4], [-78.2, -58.6], [-75.4, -62.1], [-73.0, -65.8], [-70.3, -70.9], [-67.6, -75.6], [-64.8, -78.5], [-61.8, -80.1], [-58.1, -81.2]])
const SE = path([[-18.9, -79.2], [42.4, -54.6], [85.6, -37.3], [93.3, -33.4], [97.8, -29.1], [100.5, -24.0], [101.6, -16.3], [100.2, -8.9], [88.5, 17.2]])

// ---------------------------------------------------------------- ribbons --

/**
 * A ribbon is the skin's thick free edge swept along a facade: at each
 * station a section runs from the soffit (over the glass), round the lip
 * (leaning out over the glass), up the outer face and back over the top
 * into the roof. Heights in metres; offsets in metres out from the facade.
 */
type Ribbon = {
  P: Path
  s0: number
  s1: number
  R: (s: number) => number // underside of the lip (= top of the glass)
  b: (s: number) => number // depth of the rounded lip band
  L: (s: number) => number // how far the lip leans out past the facade
  top: (s: number) => number // height of the skin where it meets the roof
  back: (s: number) => number // how far back from the facade that is
  off?: number // facade offset (stacked layers sit further in)
  glass?: boolean
  zGlass0?: (s: number) => number // bottom of the glass, if not the ground
  drop?: number // how far the top falls again before it meets the roof
}

function section(rb: Ribbon, s: number, nLip: number, nFace: number): XY[] {
  const R = Math.max(0, rb.R(s)), b = rb.b(s), L = rb.L(s), back = rb.back(s)
  const top = Math.max(rb.top(s), R + b + 0.3)
  const r = b / 2, off = rb.off ?? 0
  const pts: XY[] = [[-1.6, R]]
  for (let k = 0; k <= nLip; k++) {
    const a = -Math.PI / 2 + (Math.PI * k) / nLip
    pts.push([L - r + r * Math.cos(a), R + r + r * Math.sin(a)])
  }
  // up the face and back over the top: stands up from the lip, then rolls
  // back into the roof
  const x0 = L - r, z0 = R + b, cx = L - r - 0.12 * (top - z0), cz = top, x2 = -back, z2 = Math.max(z0, top - (rb.drop ?? 0))
  for (let k = 1; k <= nFace; k++) {
    const t = k / nFace
    pts.push([(1 - t) ** 2 * x0 + 2 * (1 - t) * t * cx + t * t * x2, (1 - t) ** 2 * z0 + 2 * (1 - t) * t * cz + t * t * z2])
  }
  pts.push([-back - 4, z2 - 0.8])
  return pts.map(([o, z]) => [o + off, z])
}

/** Outer-surface height of a section at offset o (to keep the roof under it). */
function outerAt(sec: XY[], o: number) {
  let iMax = 0
  sec.forEach((q, i) => q[0] > sec[iMax][0] && (iMax = i))
  if (o >= sec[iMax][0]) return sec[iMax][1]
  for (let i = iMax; i < sec.length - 1; i++) {
    const [o0, z0] = sec[i], [o1, z1] = sec[i + 1]
    if ((o <= o0 && o >= o1) || (o >= o0 && o <= o1)) return z0 + ((z1 - z0) * (o - o0)) / (o1 - o0 || 1)
  }
  return -Infinity
}

type Lines = { floors: number; mullion: number }
function buildRibbon(rb: Ribbon, step: number, nLip: number, nFace: number, skin: Part, glass: Part, trim: Part, lines: Lines) {
  const n = Math.max(2, Math.ceil((rb.s1 - rb.s0) / step))
  const S = Array.from({ length: n + 1 }, (_, i) => rb.s0 + ((rb.s1 - rb.s0) * i) / n)
  const grid: V3[][] = S.map((s) => {
    const { p, n: nn } = at(rb.P, s)
    return section(rb, s, nLip, nFace).map(([o, z]): V3 => [p[0] + nn[0] * o, p[1] + nn[1] * o, z])
  })
  const m = grid[0].length
  // smooth normals: area-weighted face normals, oriented so the lip faces out
  const lipFront = 1 + Math.round(nLip / 2)
  const n0 = at(rb.P, S[0]).n
  const fn = crs(sub3(grid[1][lipFront], grid[0][lipFront]), sub3(grid[0][lipFront + 1], grid[0][lipFront]))
  const flip = fn[0] * n0[0] + fn[1] * n0[1] < 0 ? -1 : 1
  const acc: V3[][] = grid.map((row) => row.map((): V3 => [0, 0, 0]))
  for (let i = 0; i < n; i++)
    for (let j = 0; j < m - 1; j++) {
      const a = grid[i][j], b = grid[i + 1][j], d = grid[i][j + 1]
      const f = crs(sub3(b, a), sub3(d, a))
      for (const [ii, jj] of [[i, j], [i + 1, j], [i + 1, j + 1], [i, j + 1]]) {
        const t = acc[ii][jj]
        t[0] += f[0] * flip, t[1] += f[1] * flip, t[2] += f[2] * flip
      }
    }
  const N = acc.map((row) => row.map(norm3))
  for (let i = 0; i < n; i++)
    for (let j = 0; j < m - 1; j++) {
      const A = grid[i][j], B = grid[i + 1][j], C = grid[i + 1][j + 1], D = grid[i][j + 1]
      const nA = N[i][j], nB = N[i + 1][j], nC = N[i + 1][j + 1], nD = N[i][j + 1]
      skin.tri(A, B, C, [0, 0], [0, 0], [0, 0], [nA, nB, nC])
      skin.tri(A, C, D, [0, 0], [0, 0], [0, 0], [nA, nC, nD])
    }
  // end caps: the section's own outline, ear-clipped in its plane
  const secs = [section(rb, S[0], nLip, nFace), section(rb, S[n], nLip, nFace)]
  for (const [k, i, dir] of [[0, 0, -1], [1, n, 1]] as [number, number, number][]) {
    const poly = secs[k]
    const row = grid[i]
    const a = at(rb.P, S[i]).p, b = at(rb.P, S[i] + dir).p
    const want: V3 = [b[0] - a[0], b[1] - a[1], 0]
    for (const [p, q, r] of earClip(poly)) {
      const A = row[p], B = row[q], C = row[r]
      const f = crs(sub3(B, A), sub3(C, A))
      if (f[0] * want[0] + f[1] * want[1] >= 0) skin.tri(A, B, C)
      else skin.tri(A, C, B)
    }
  }
  if (rb.glass === false) return
  // the glass wall, set back and tilted out under the lip
  const off = rb.off ?? 0
  const g = (s: number, R: number, z: number): V3 => {
    const { p, n: nn } = at(rb.P, s)
    const o = off - 3 + (1.4 * z) / Math.max(R, 0.01)
    return [p[0] + nn[0] * o, p[1] + nn[1] * o, z]
  }
  const out = (q: V3, s: number, dz = 0): V3 => {
    const k = at(rb.P, s).n
    return [q[0] + k[0] * 0.07, q[1] + k[1] * 0.07, q[2] + dz]
  }
  const put = (part: Part, nn: XY, a: V3, b: V3, c: V3, d: V3) => {
    const f = crs(sub3(b, a), sub3(d, a))
    if (f[0] * nn[0] + f[1] * nn[1] >= 0) part.quad(a, b, c, d)
    else part.quad(a, d, c, b)
  }
  const kM = Math.max(1, Math.round(lines.mullion / ((rb.s1 - rb.s0) / n)))
  for (let i = 0; i < n; i++) {
    const r0 = Math.max(0, rb.R(S[i])), r1 = Math.max(0, rb.R(S[i + 1]))
    const z0 = Math.min(rb.zGlass0?.(S[i]) ?? 0, r0), z1 = Math.min(rb.zGlass0?.(S[i + 1]) ?? 0, r1)
    if (r0 - z0 < 0.5 && r1 - z1 < 0.5) continue
    const nn = at(rb.P, S[i]).n
    put(glass, nn, g(S[i], r0, z0), g(S[i + 1], r1, z1), g(S[i + 1], r1, r1), g(S[i], r0, r0))
    if (rb.zGlass0) continue
    for (let z = lines.floors; z < Math.min(r0, r1) - 1; z += lines.floors)
      put(trim, nn, out(g(S[i], r0, z), S[i], -0.2), out(g(S[i + 1], r1, z), S[i + 1], -0.2), out(g(S[i + 1], r1, z), S[i + 1], 0.2), out(g(S[i], r0, z), S[i], 0.2))
    if (i % kM === 0 && r0 > 2) {
      const lo = g(S[i], r0, 0), hi = g(S[i], r0, r0 - 0.1)
      const pa = at(rb.P, S[i]).p, pb = at(rb.P, S[i] + 0.5).p
      const tx = pb[0] - pa[0], ty = pb[1] - pa[1], l = Math.hypot(tx, ty) || 1
      const w: V3 = [(tx / l) * 0.17, (ty / l) * 0.17, 0]
      put(trim, nn, out([lo[0] - w[0], lo[1] - w[1], lo[2]], S[i]), out([lo[0] + w[0], lo[1] + w[1], lo[2]], S[i]), out([hi[0] + w[0], hi[1] + w[1], hi[2]], S[i]), out([hi[0] - w[0], hi[1] - w[1], hi[2]], S[i]))
    }
  }
}

// ------------------------------------------------------------- the design --

/** Height of the auditorium peak; the north-west glass rises to it. */
export const PEAK_H = 58
const PEAK_S = 140 // metres along the north-west face, from its north-east end

const RIBBONS: Ribbon[] = []
// North-west face: one glass wall rising from 2.5 m to just under the peak.
const nwR = (s: number) => keyed([[0, 2.5], [30, 4], [60, 7], [90, 12], [110, 18], [122, 26], [130, 35], [136, 43], [140, 47]], s)
RIBBONS.push({
  P: NW, s0: 0, s1: PEAK_S, R: nwR, b: () => 3.5, L: (s) => 0.5 + 0.04 * nwR(s),
  top: (s) => nwR(s) + 5.3 + Math.max(0, s - 132) * 0.3, back: (s) => 7 + 0.12 * nwR(s),
})
// ...then four nested white folds stepping down to the west arch, each a
// fin to the ground with a dark slot of glass between it and the next.
export const FINS: [number, number, number][] = [
  [PEAK_S + 1.4, PEAK_S + 8.2, 34],
  [PEAK_S + 9.6, PEAK_S + 16.4, 26],
  [PEAK_S + 17.8, PEAK_S + 24.6, 19],
  [PEAK_S + 26.0, PEAK_S + 32.4, 13],
]
FINS.forEach(([a, b, h], i) => {
  const c = (a + b) / 2, hw = (b - a) / 2
  RIBBONS.push({
    P: NW, s0: a, s1: b, R: () => 0, b: () => 2.4, L: () => 0.8, glass: false,
    top: (s) => Math.max(3, h * Math.max(0, 1 - ((s - c) / hw) ** 2) ** 0.15), back: () => 12 + 0.1 * h, drop: 0.18 * h,
  })
})
// South-west facade: the low west arch at the corner touching down, then
// the big arch's long concave west leg up to a rounded crown, and a steep
// east side.
const swR = (s: number) =>
  Math.max(0, keyed([[0, 0], [3, 5], [7, 8.5], [11, 9], [15, 6], [19, 0.2], [24, -0.5], [28, 0.3], [32, 4], [36, 10], [40, 17], [44, 24], [48, 30], [52, 34.5], [56, 37.5], [60, 39], [64, 39], [67, 37], [70, 32], [73, 22], [76, 9], [79.5, -0.5]], s))
const swB = (s: number) => 2.4 + 0.06 * swR(s)
const swTop = (s: number) => keyed([[0, 3], [5, 11], [9, 13.5], [15, 12.5], [20, 12], [26, 15.5], [32, 21], [38, 28], [44, 35], [50, 39.5], [56, 42], [62, 43.5], [66, 43], [72, 30], [76, 14], [79.5, 3]], s)
RIBBONS.push({
  P: SW, s0: 0, s1: 79.5, R: swR, b: swB, L: (s) => 0.7 + 0.09 * swR(s),
  top: (s) => Math.max(swTop(s), swR(s) + swB(s) + 0.6), back: (s) => 9 + 0.15 * swTop(s),
})
// East wing: a long low shell; three stacked lips at its east end, each
// over a dark band, curling round the end.
const seR0 = (s: number) => keyed([[0, 5], [60, 5.5], [112, 6.5], [128, 7], [141, 6], [160, 3.2], [177, 0.4]], s)
const SEB = 1.7
const seR1 = (s: number) => seR0(s) + SEB + 1.5
const seR2 = (s: number) => seR1(s) + SEB + 1.5
RIBBONS.push(
  { P: SE, s0: 0, s1: 177, R: seR0, b: () => SEB, L: () => 0.6, top: (s) => seR0(s) + SEB + 0.4, back: () => 5 },
  { P: SE, s0: 52, s1: 166, R: seR1, b: () => SEB, L: () => 0.6, off: -4, top: (s) => seR1(s) + SEB + 0.4, back: () => 5, zGlass0: (s) => seR0(s) + SEB + 0.2 },
  { P: SE, s0: 96, s1: 157, R: seR2, b: () => SEB, L: () => 0.6, off: -8, top: (s) => seR2(s) + SEB + 0.4, back: () => 5, zGlass0: (s) => seR1(s) + SEB + 0.2 },
)

// Peak: a smooth, round-topped swell just inside the north-west face.
const PK = at(NW, PEAK_S)
export const PEAK: XY = [PK.p[0] - PK.n[0] * 7, PK.p[1] - PK.n[1] * 7]
/** Distance from the peak, stretched toward the north-west face it rolls up from. */
function peakR(p: XY) {
  const dx = p[0] - PEAK[0], dy = p[1] - PEAK[1]
  let u = dx * PK.n[0] + dy * PK.n[1]
  const v = -dx * PK.n[1] + dy * PK.n[0]
  if (u > 0) u /= 1.15
  return Math.hypot(u, v)
}
const PEAK_R = 14

/** The peak: a round-topped swell, turned like a lathe. */
function cone(p: XY) {
  const r = peakR(p)
  return PEAK_H * (0.8 * Math.exp(-((r / 17) ** 2)) + 0.2 / (1 + (r / 26) ** 2))
}

/** The roof's own swells, away from the facades. */
function interior(p: XY) {
  let h = 9
  const r = Math.hypot(p[0] - PEAK[0], p[1] - PEAK[1])
  // the big arch is the front of a high volume that runs back to the peak
  h = smax(h, bump(p, [-66, -52], 40, 17, 11, -0.6))
  h = smax(h, bump(p, [-40, -10], 35, 34, 28, 0.7))
  h = smax(h, bump(p, [45, 0], 17, 34, 26, 0.45))
  h = smax(h, bump(p, [10, 30], 15, 40, 30, 0.7))
  return h
}

// -------------------------------------------------------------- the roof --

/** Nearest station of each ribbon to a point: s, offset out, distance. */
function nearRibbon(p: XY) {
  const res: { rb: Ribbon; s: number; o: number; d: number; along: number }[] = []
  for (const rb of RIBBONS) {
    let best = -1, bd = Infinity
    const i0 = idxAt(rb.P, rb.s0), i1 = idxAt(rb.P, rb.s1)
    for (let i = i0; i <= i1; i++) {
      const q = rb.P.p[i], d = (q[0] - p[0]) ** 2 + (q[1] - p[1]) ** 2
      if (d < bd) (bd = d), (best = i)
    }
    if (best < 0) continue
    const q = rb.P.p[best], n = rb.P.n[best]
    const o = (p[0] - q[0]) * n[0] + (p[1] - q[1]) * n[1]
    const along = Math.sqrt(Math.max(0, bd - o * o))
    res.push({ rb, s: rb.P.s[best] / rb.P.scale, o, d: Math.sqrt(bd), along })
  }
  return res
}

/** The roof never rises through a ribbon: it stays just under its skin. */
function ribbonCap(p: XY) {
  let cap = Infinity
  if (peakR(p) < PEAK_R) return cap
  for (const { rb, s, o, along } of nearRibbon(p)) {
    if (along > 0.8) continue
    const sec = section(rb, s, 6, 8)
    const oMin = sec[sec.length - 1][0], oMax = sec.reduce((m, q) => Math.max(m, q[0]), -Infinity)
    if (o < oMin || o > oMax + 0.5) continue
    cap = Math.min(cap, outerAt(sec, o) - 0.5)
  }
  return cap
}

// Edge heights for the roof where no ribbon runs (round the courtyard and
// along the closed north-east side).
const OTHER_KEYS: [XY, number][] = [
  [[-58.1, -81.2], 0.5],
  [[-54.5, -81.0], 0.6],
  [[-43.7, -73.7], 1.0],
  [[-35.7, -60.0], 5.5],
  [[-18.6, -17.6], 6],
  [[5.4, -42.1], 6],
  [[-18.6, -75.8], 5.5],
  [[88.5, 17.2], 0.5],
  [[80.3, 30.0], 0],
  [[30.0, 74.0], 0],
  [[5.1, 98.2], 3],
]

/** The roof's outline: the OSM outline, pulled 2.5 m in behind the ribbons. */
type Edge = { p: XY; h: number; blend: number; ribbon: boolean }
const EDGE: Edge[] = resample(OUTLINE, 0.5).pts.map((q) => {
  let best: { rb: Ribbon; s: number; o: number; d: number; along: number } | null = null
  for (const r of nearRibbon(q)) if (r.d < 3.5 && (!best || r.d < best.d)) best = r
  if (best) {
    const { rb } = best
    const s = Math.max(rb.s0, Math.min(rb.s1, best.s))
    const n = at(rb.P, s).n
    let h = Math.max(rb.top(s), rb.R(s) + rb.b(s))
    if (rb.P === SE) for (const r of RIBBONS) if (r.P === SE && s >= r.s0 && s <= r.s1) h = Math.max(h, r.top(s))
    if (rb.glass === false) h *= 0.75 // behind the fins the roof falls away
    return { p: [q[0] - n[0] * 2.5, q[1] - n[1] * 2.5], h: h - 0.4, blend: 14, ribbon: true }
  }
  let ws = 0, hs = 0
  for (const [k, hv] of OTHER_KEYS) {
    const w = 1 / (Math.hypot(k[0] - q[0], k[1] - q[1]) + 0.5) ** 3
    ws += w
    hs += w * hv
  }
  return { p: q, h: hs / ws, blend: 11, ribbon: false }
})
const ROOF_OUTLINE = EDGE.map((e) => e.p)

function edgeField(p: XY) {
  let dmin = Infinity, ws = 0, hs = 0, ds = 0
  for (let i = 0; i < EDGE.length; i += 2) {
    const q = EDGE[i].p
    const d2 = (q[0] - p[0]) ** 2 + (q[1] - p[1]) ** 2 + 0.01
    if (d2 < dmin) dmin = d2
    const w = 1 / (d2 * d2)
    ws += w
    hs += w * EDGE[i].h
    ds += w * EDGE[i].blend
  }
  return { d: Math.sqrt(dmin), hb: hs / ws, blend: ds / ws }
}

export function roofHeight(p: XY) {
  const { d, hb, blend } = edgeField(p)
  const w = smooth(d / blend)
  return Math.min(smax(hb * (1 - w) + interior(p) * w, cone(p), 2), ribbonCap(p))
}

// ------------------------------------------------------------------ build --

type LOD = { edge: number; grid: number; peakGrid: number; rings: number[]; step: number; finStep: number; seStep: number; nLip: number; nFace: number; floors: number; mullion: number }

function build(lod: LOD) {
  const skin = new Part(), glass = new Part(), trim = new Part()
  for (const rb of RIBBONS) {
    const se = rb.P === SE, fin = rb.glass === false
    buildRibbon(rb, se ? lod.seStep : fin ? lod.finStep : lod.step, se ? Math.max(3, lod.nLip - 2) : lod.nLip, se ? Math.max(2, lod.nFace - 3) : lod.nFace, skin, glass, trim, lod)
  }
  // dark slots between the peak, the fins and the west arch
  const slots: [number, number, number][] = [[PEAK_S, FINS[0][0], nwR(PEAK_S) + 4]]
  FINS.forEach((f, i) => slots.push([f[1], i + 1 < FINS.length ? FINS[i + 1][0] : NW.total / NW.scale + 1.5, f[2]]))
  for (const [a, b, h] of slots) {
    const A = at(NW, a - 0.4), B = at(NW, b + 0.4)
    const pa: V3 = [A.p[0] - A.n[0] * 4, A.p[1] - A.n[1] * 4, 0], pb: V3 = [B.p[0] - B.n[0] * 4, B.p[1] - B.n[1] * 4, 0]
    const q = [pa, pb, [pb[0], pb[1], h], [pa[0], pa[1], h]] as V3[]
    const f = crs(sub3(pb, pa), [0, 0, 1])
    if (f[0] * A.n[0] + f[1] * A.n[1] >= 0) glass.quad(q[0], q[1], q[2], q[3])
    else glass.quad(q[0], q[3], q[2], q[1])
  }

  // the roof: a height field over the pulled-in outline
  // even spacing along the (densely sampled) roof outline
  const Bd = { pts: [] as XY[] }
  {
    let acc = 0, next = 0
    for (let i = 0; i < ROOF_OUTLINE.length; i++) {
      const p = ROOF_OUTLINE[i], q = ROOF_OUTLINE[(i + 1) % ROOF_OUTLINE.length]
      const L = Math.hypot(q[0] - p[0], q[1] - p[1])
      while (next <= acc + L) {
        const t = (next - acc) / (L || 1)
        Bd.pts.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t])
        next += lod.edge
      }
      acc += L
    }
  }
  const pts: XY[] = [...Bd.pts]
  const nb = pts.length
  for (let i = 0; i < nb; i += 2) {
    const A = Bd.pts[(i - 1 + nb) % nb], C = Bd.pts[(i + 1) % nb]
    const tx = C[0] - A[0], ty = C[1] - A[1], l = Math.hypot(tx, ty)
    const n: XY = [-ty / l, tx / l]
    for (const o of lod.rings) {
      const p: XY = [Bd.pts[i][0] + n[0] * o, Bd.pts[i][1] + n[1] * o]
      if (!inside(p, ROOF_OUTLINE) || edgeField(p).d < o * 0.8) continue
      if (Math.hypot(p[0] - PEAK[0], p[1] - PEAK[1]) < 30) continue
      if (pts.some((q, k) => k >= nb && Math.hypot(q[0] - p[0], q[1] - p[1]) < lod.edge * 0.9)) continue
      pts.push(p)
    }
  }
  const jitter = (i: number, j: number) => ((Math.sin(i * 12.9898 + j * 78.233) * 43758.5453) % 1) * 0.2
  const ringMax = lod.rings[lod.rings.length - 1]
  for (let x = -115; x <= 105; x += lod.grid)
    for (let y = -85; y <= 100; y += lod.grid) {
      const p: XY = [x + jitter(x, y) * lod.grid, y + jitter(y, x) * lod.grid]
      if (!inside(p, ROOF_OUTLINE) || Math.hypot(p[0] - PEAK[0], p[1] - PEAK[1]) < 30) continue
      if (edgeField(p).d < ringMax + lod.grid * 0.5) continue
      pts.push(p)
    }
  // polar rings round the peak, so it turns like a lathe
  for (let r = lod.peakGrid; r < 30; r += lod.peakGrid) {
    const k = Math.max(6, Math.round((2 * Math.PI * r) / lod.peakGrid))
    for (let j = 0; j < k; j++) {
      const a = (2 * Math.PI * (j + 0.5 * ((r / lod.peakGrid) % 2))) / k
      const p: XY = [PEAK[0] + r * Math.cos(a), PEAK[1] + r * Math.sin(a)]
      if (!inside(p, ROOF_OUTLINE) || edgeField(p).d < lod.edge * 0.8) continue
      pts.push(p)
    }
  }
  pts.push(PEAK)
  const H = pts.map((p, i) => (i < nb ? Math.min(edgeField(p).hb, ribbonCap(p)) : roofHeight(p)))
  const e = 0.4
  const N = pts.map((p): V3 => {
    const hx = (roofHeight([p[0] + e, p[1]]) - roofHeight([p[0] - e, p[1]])) / (2 * e)
    const hy = (roofHeight([p[0], p[1] + e]) - roofHeight([p[0], p[1] - e])) / (2 * e)
    return norm3([-hx, -hy, 1])
  })
  for (const [a, b, c] of delaunay(pts)) {
    const m: XY = [(pts[a][0] + pts[b][0] + pts[c][0]) / 3, (pts[a][1] + pts[b][1] + pts[c][1]) / 3]
    if (!inside(m, ROOF_OUTLINE)) continue
    const v = (i: number): V3 => [pts[i][0], pts[i][1], H[i]]
    skin.tri(v(a), v(b), v(c), [0, 0], [0, 0], [0, 0], [N[a], N[b], N[c]])
  }

  // where the roof's own edge is lifted (round the courtyard): a rim,
  // soffit and glass under it
  const RIM = 1.2, SET = 2.5
  const isRib = Bd.pts.map((p) => {
    let bi = 0, bd = Infinity
    EDGE.forEach((ed, i) => {
      const d = (ed.p[0] - p[0]) ** 2 + (ed.p[1] - p[1]) ** 2
      if (d < bd) (bd = d), (bi = i)
    })
    return EDGE[bi].ribbon
  })
  for (let i = 0; i < nb; i++) {
    const j = (i + 1) % nb
    if (isRib[i] || isRib[j]) continue
    const ha = H[i], hb = H[j]
    if (ha < 0.4 && hb < 0.4) continue
    const A = Bd.pts[i], Bp = Bd.pts[j]
    const tx = Bp[0] - A[0], ty = Bp[1] - A[1], l = Math.hypot(tx, ty)
    const nI: XY = [-ty / l, tx / l]
    const ra = Math.max(0, ha - RIM), rb = Math.max(0, hb - RIM)
    skin.quad([A[0], A[1], ra], [Bp[0], Bp[1], rb], [Bp[0], Bp[1], hb], [A[0], A[1], ha])
    if (ra < 0.05 && rb < 0.05) continue
    const Ai: XY = [A[0] + nI[0] * SET, A[1] + nI[1] * SET], Bi: XY = [Bp[0] + nI[0] * SET, Bp[1] + nI[1] * SET]
    skin.quad([A[0], A[1], ra], [Ai[0], Ai[1], ra], [Bi[0], Bi[1], rb], [Bp[0], Bp[1], rb])
    glass.quad([Ai[0], Ai[1], 0], [Bi[0], Bi[1], 0], [Bi[0], Bi[1], rb], [Ai[0], Ai[1], ra])
  }
  return { skin, glass, trim }
}

// -------------------------------------------------------------- materials --

const WHITE: MaterialSpec = { ...finish('hac-white', 0xf6f6f3, 0.6), floodlight: (_p, n) => 0.75 - 0.35 * Math.max(0, n[2]) }
const GLASS: MaterialSpec = { ...PALETTE.window, color: 0x5b6f80 }
const MULLION: MaterialSpec = finish('mullion', 0xd9dde0)

const extras = {
  license: 'CC0-1.0',
  frame: 'Y up, -Z north, +X east, metres; origin at the area centroid of OSM relation/19380164, on the plaza',
  bearing: 0,
  elevation: 0,
}

if (import.meta.main) {
  const LOW: LOD = { edge: 3, grid: 8, peakGrid: 3.2, rings: [3, 7, 12], step: 2.2, finStep: 1.7, seStep: 4, nLip: 4, nFace: 4, floors: 10, mullion: 12 }
  const DETAIL: LOD = { edge: 1.2, grid: 2.8, peakGrid: 1.3, rings: [1.2, 2.6, 4.2, 6, 8.5], step: 0.8, finStep: 0.7, seStep: 1.2, nLip: 9, nFace: 10, floors: 5, mullion: 4 }
  for (const [file, lod, maxTris, maxBytes] of [
    ['baku-heydar-aliyev-center.glb', LOW, 6500, 250 * 1024],
    ['baku-heydar-aliyev-center.detail.glb', DETAIL, 40000, 1536 * 1024],
  ] as const) {
    const m = build(lod)
    const list = [
      { part: m.skin, material: WHITE },
      { part: m.glass, material: GLASS },
      { part: m.trim, material: MULLION },
    ]
    let tris = 0
    for (const { part } of list) tris += part.triangles
    console.log(`${file}: ${tris} triangles (skin ${m.skin.triangles}, glass ${m.glass.triangles}, trim ${m.trim.triangles})`)
    if (tris > maxTris) throw new Error(`${file}: ${tris} triangles, over ${maxTris}`)
    const glb = writeGlb('Heydar Aliyev Center', list, extras)
    if (glb.length > maxBytes) throw new Error(`${file}: ${glb.length} bytes, over ${maxBytes}`)
    await Bun.write(new URL(`../models/${file}`, import.meta.url), glb)
    console.log(`  ${glb.length} bytes`)
  }
}
