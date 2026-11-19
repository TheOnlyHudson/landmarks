/**
 * Asahi Beer Hall (Super Dry Hall, スーパードライホール) and its Flamme d'Or,
 * Azumabashi, Sumida, Tokyo (Philippe Starck, 1989) — procedural, CC0-1.0.
 * bun generators/tokyo-asahi-beer-hall.ts
 *
 * The golden-glass Asahi Beer Tower beside it is its own model,
 * tokyo-asahi-beer-tower (OSM maps it as its own building).
 *
 * Map frame: x across the hall, y along it, z up, metres; origin on the
 * ground at the centroid of the OSM outline way/155874922 (139.8003214,
 * 35.7098319). The outline's long sides run at 34.9°, so the catalog
 * bearing is 34.9: +y points north-east, towards the tower and the flame's
 * round head; the flame's tail points south-west, out over the river side.
 *
 * Identity, in order: the golden flame lying on the roof, a fat teardrop
 * with its round head resting on the roof at the north-east end and its
 * long tapering tail lifting off and running out past the south-west end;
 * the black polished-granite hall, a box whose four faces curve out as they
 * rise (an upturned beer glass / cauldron), with a scatter of small round
 * windows; the pale granite plinth it stands on.
 *
 * Evidence:
 *  - plan: OSM way/155874922, 37.0 × 23.8 m (the box's top edge; height
 *    44.1 m, 5 levels). Published: Starck, 1989; the flame weighs 360 t and
 *    is hollow, built by shipbuilders (en.wikipedia, Asahi Beer Hall).
 *  - flame, measured on Phlizz's and Tokumeigakarinoaoshima's level views
 *    from across the river (box top 37 m = 755 px): 34.3 m long, the head
 *    starting 8.1 m in from the north-east edge and the tip 5.2 m past the
 *    south-west edge; head 10.2 m high; 6.6 m thick at mid-length, 2.7 m at
 *    the box edge; its underside lifts 1.8 m off the roof at mid-length and
 *    4.3 m at the edge; the tail curls up, its tip ~9 m above the roof,
 *    nearly level with the head's top (Phlizz). Round 2 of review asked for
 *    the tail to rise more steeply, as it looks from the street (Kakidai's
 *    WSW view): it now curls up to ~33° at the tip, ending ~11 m above the
 *    roof, and the head sits 0.6 m down into the roof. The level river
 *    views measure a lower tail (tip ~8-9 m); this is a compromise, and it
 *    puts the tip at 44.9 m, 0.8 m over OSM's 44.1. Round in section (the
 *    near-axial views show a round head). Top of flame 44.1 m (OSM), so the
 *    roof is at 33.9 m.
 *  - box: flare measured on the same views, the long ends 2.2 m further
 *    out at the roof than 15 m below it; drawn as inset d(1 - t²) from the
 *    roof (t = 1) down, d = 2.9 m at the ends and 2.0 m on the long sides.
 *  - plinth: 4.5 m high (estimate, the flights of steps up to the plaza in
 *    Vellut's and Kakidai's street views).
 *  - portholes: three rows on the long sides and two on the ends, ~0.9 m
 *    across (photos), drawn as flush discs.
 *  - colours: the flame gold #e2b742 in sun (drawn #d5ac45); the granite
 *    black, drawn at the style's darkest charcoal #4a4f57.
 *  - night: the flame is floodlit gold (Basile Morin's dusk photo); the
 *    green katakana sign on the box's top band is left out.
 *  - terrain: see the report; elevation 0.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Flamme d'Or (Asahi Beer Hall).jpg, Phlizz, CC BY-SA 4.0 (west, level)
 *  - Super Dry Hall (1).JPG, (2).JPG, Tokumeigakarinoaoshima, CC0 (west and north-west)
 *  - Asahi Beer Tower and Super Dry Hall.JPG, Tokumeigakarinoaoshima, CC0
 *  - Asahi Beer Hall (9000621334).jpg, Guilhem Vellut, CC BY 2.0 (street, below)
 *  - Asahi Beer Hall @ Asakusa (11625399834).jpg, Guilhem Vellut, CC BY 2.0 (the flame's head)
 *  - Asahi Breweries Azumabashi Headquarters Building 02.jpg, Kakidai, CC BY-SA 4.0 (street, south-east)
 *  - Asahi Breweries headquarters building with the Asahi Flame and Skytree.jpg, Basile Morin, CC BY-SA 4.0 (dusk)
 *  - Asahi HQ1.jpg, Akonnchiroll, CC0 (north, across the river)
 *  - Views from Tokyo Skytree 350 Asahi Breweries DSCN3683 20121101.JPG, Ogiyoshisan, CC BY-SA 3.0 (from above)
 * No commercial imagery. No look-only references.
 *
 * Doubts: the plinth (the plaza around the hall is shared with the tower,
 * and the map's terrain may or may not show it); the box's exact flare on
 * the long sides (seen only at a slant); the porthole layout (simplified).
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { box, grid, disc, quadOut, save, type Mat } from './tokyo-sensoji'

const HX = 11.9, HY = 18.5 // half sizes of the box's top edge
const P = 4.5 // plinth top
const R = 33.9 // roof
const DX = 2.0, DY = 2.9 // flare: inset at the plinth, long sides and ends

function build() {
  const granite = new Part(), black = new Part(), gold = new Part(), win = new Part()

  // Plinth: pale granite, a little wider than the box's foot.
  box(granite, -(HX - DX) - 1.2, -(HY - DY) - 1.2, 0, HX - DX + 1.2, HY - DY + 1.2, P, 'b')

  // The box: four faces, each curving out as it rises. Inset d(1 - t²).
  const T = [0, 0.2, 0.4, 0.55, 0.7, 0.82, 0.92, 1]
  const at = (sx: number, sy: number, t: number): V3 => [sx * (HX - DX * (1 - t * t)), sy * (HY - DY * (1 - t * t)), P + (R - P) * t]
  const corners: [number, number][] = [[-1, -1], [1, -1], [1, 1], [-1, 1]]
  for (let k = 0; k < 4; k++) {
    const [ax, ay] = corners[k], [bx, by] = corners[(k + 1) % 4]
    // Each face: i along the face (two columns), j up; outward = cross(along, up).
    const face = [[ax, ay], [bx, by]].map(([sx, sy]) => T.map((t) => at(sx, sy, t)))
    grid(black, face)
  }
  // Roof.
  const top = corners.map(([sx, sy]) => at(sx, sy, 1))
  quadOut(black, top[0], top[1], top[2], top[3], [0, 0, 1])
  // A slim parapet lip round the roof.
  for (let k = 0; k < 4; k++) {
    const a = top[k], b = top[(k + 1) % 4]
    const out: V3 = [Math.sign(a[0] + b[0]) * (Math.abs(a[0] + b[0]) > 1 ? 1 : 0), Math.sign(a[1] + b[1]) * (Math.abs(a[1] + b[1]) > 1 ? 1 : 0), 0]
    quadOut(black, a, b, [b[0], b[1], R + 0.5], [a[0], a[1], R + 0.5], out)
    quadOut(black, [a[0], a[1], R + 0.5], [b[0], b[1], R + 0.5], [b[0] * 0.98, b[1] * 0.98, R + 0.5], [a[0] * 0.98, a[1] * 0.98, R + 0.5], [0, 0, 1])
  }

  // Portholes: flush round windows on each face, following its curve.
  const rows = [0.32, 0.52, 0.72]
  const port = (sx: number, sy: number, u: number, t: number) => {
    // u along the face (-1..1), on the face with normal (sx, 0) or (0, sy).
    const p = sx ? at(sx, 1, t) : at(1, sy, t)
    const q = sx ? [p[0] + sx * 0.03, u * (HY - DY * (1 - t * t)) * 0.9, p[2]] : [u * (HX - DX * (1 - t * t)) * 0.9, p[1] + sy * 0.03, p[2]]
    const n: V3 = sx ? [sx, 0, 0] : [0, sy, 0]
    const r = 0.45, K = 8
    for (let i = 0; i < K; i++) {
      const a0 = (i / K) * Math.PI * 2, a1 = ((i + 1) / K) * Math.PI * 2
      const off = (a: number): V3 => (sx ? [0, r * Math.cos(a), r * Math.sin(a)] : [r * Math.cos(a), 0, r * Math.sin(a)])
      const A = off(a0), B = off(a1)
      const c = q as V3
      const tri = (x: V3, y: V3, z: V3) => {
        const v = [y[0] - x[0], y[1] - x[1], y[2] - x[2]], w = [z[0] - x[0], z[1] - x[1], z[2] - x[2]]
        const cr = [v[1] * w[2] - v[2] * w[1], v[2] * w[0] - v[0] * w[2], v[0] * w[1] - v[1] * w[0]]
        if (cr[0] * n[0] + cr[1] * n[1] + cr[2] * n[2] >= 0) win.tri(x, y, z)
        else win.tri(x, z, y)
      }
      tri(c, [c[0] + A[0], c[1] + A[1], c[2] + A[2]], [c[0] + B[0], c[1] + B[1], c[2] + B[2]])
    }
  }
  for (const t of rows) {
    for (const s of [-1, 1]) {
      for (const u of [-0.75, -0.45, -0.15, 0.15, 0.45, 0.75]) port(s, 0, u + (t === 0.52 ? 0.1 : 0), t)
      for (const u of [-0.5, 0, 0.5]) if (t !== 0.52) port(0, s, u, t)
    }
  }

  flame(gold)

  const lit = (_: V3, n: V3) => (n[2] > 0.7 ? 0.6 : 1)
  const parts: Mat[] = [
    { part: black, material: finish('black-granite', 0x4a4f57, 0.35) },
    { part: granite, material: finish('granite-grey', 0xbdb7ad) },
    { part: gold, material: { ...finish('flamme-gold', 0xd5ac45, 0.4), floodlight: lit } },
    { part: win, material: PALETTE.window },
  ]
  return parts
}

/**
 * The Flamme d'Or: a round-sectioned teardrop swept along a spine. d runs
 * from the head's end (0) to the tip (34.3 m), along -y.
 */
function flame(p: Part) {
  const LEN = 34.3, HEAD = 5.1, Y0 = HY - 8.1
  const rOf = (d: number) => {
    if (d < HEAD) return Math.sqrt(Math.max(0, HEAD * HEAD - (HEAD - d) ** 2))
    const u = (d - HEAD) / (LEN - HEAD)
    return HEAD * (1 - Math.pow(u, 1.6))
  }
  // The head sits down into the roof (0.6 m); the tail rises from mid-length,
  // steepening to ~33° at the tip, which ends ~11 m above the roof.
  const zOf = (d: number) => R + HEAD - 0.6 + (d > 14 ? 6.5 * ((d - 14) / (LEN - 14)) ** 2 : 0)
  // Sample more finely near the head and the tip.
  const ds: number[] = []
  for (let i = 0; i <= 26; i++) {
    const s = i / 26
    ds.push(LEN * (0.5 - 0.5 * Math.cos(Math.PI * s)))
  }
  const K = 20
  const rings = ds.map((d) => {
    const r = Math.max(rOf(d), 0.0005), z = zOf(d), y = Y0 - d
    // Tangent of the spine in the y-z plane, to keep the rings square to it.
    const dz = (zOf(d + 0.2) - zOf(d - 0.2)) / 0.4, ty = -1, l = Math.hypot(ty, dz)
    const ny = dz / l, nz = 1 / l // the ring's "up" direction, perpendicular to the spine
    return Array.from({ length: K + 1 }, (_, i) => {
      const a = (i / K) * Math.PI * 2
      const cx = r * Math.cos(a), cu = r * Math.sin(a)
      return [cx, y + cu * ny, z + cu * nz] as V3
    })
  })
  // grid P[i][j]: i around, j along the spine (head → tip, i.e. -y);
  // cross(around, along) must point outward.
  const G = Array.from({ length: K + 1 }, (_, i) => rings.map((ring) => ring[i]))
  grid(p, G, true)
}

if (import.meta.main) {
  await save('tokyo-asahi-beer-hall', "Asahi Beer Hall and the Flamme d'Or", build(), 'tokyo-asahi-beer-hall.glb', 6500, 250_000, { bearing: 34.9, elevation: 0, height: 44.9, osm: 'way/155874922' })
}
