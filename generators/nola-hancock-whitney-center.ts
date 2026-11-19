/**
 * Hancock Whitney Center (former One Shell Square; 701 Poydras Street, 1972,
 * Skidmore, Owings & Merrill), New Orleans — original procedural geometry,
 * CC0-1.0.
 * bun generators/nola-hancock-whitney-center.ts
 *
 * Plan frame: x along the tower's long faces, y across them (model north),
 * z up, metres; origin at the anchor on the ground. Anchor = centroid of the
 * OSM outline way/328669404, 29.9502763, -90.0707983. Its long faces run at
 * 103.86° / 283.86°, so the catalog bearing is 13.86 and the tower is square
 * to this frame (long faces face model north and south; south = Poydras St).
 *
 * Identity, in order: the plain pale travertine slab, tallest in Louisiana,
 * nothing but height; the close, continuous chamfered piers running from the
 * plaza to the roof on every face, with dark windows between; the solid
 * corner piers; the flat top; the recessed glass lobby behind the piers at
 * plaza level; the raised travertine plaza with its grand steps to Poydras;
 * the blue "Hancock Whitney" sign along the top of the Poydras face; the
 * 13-storey travertine west annex with its bold grid of large dark windows.
 *
 * Evidence:
 *  - plan: OSM outline way/328669404, a 59.47 × 42.60 m rectangle (measured
 *    in this frame from the OSM nodes). The 2021-22 lidar footprint agrees to
 *    ~1.5 m (it sits slightly west); the OSM outline is used.
 *  - heights: USGS 3DEP lidar LA_2021GNO_1_C22 (flown 2021-22), read in this
 *    frame with tools/lidar_frame.py. Street ≈ 0.5 m above ground_min, taken
 *    as y = 0. Main roof 207.0 → 206.5 m; roof edge 207.3 (a ~0.3 m lip);
 *    mechanical penthouse 212.9 → 212.4 m, about 30 × 18 m, central
 *    (measured). Published: 697 ft = 212.4 m, 51 floors (Wikipedia, CTBUH),
 *    which matches the penthouse top.
 *  - plaza: lidar plaza level 5.0 → 4.5 m above the street; it fills the
 *    strip between the tower and the 13-storey block to the west (OSM
 *    way/328669312, east face at x = -36.7), runs along the north face to
 *    y ≈ 26, and in front of the south face to y ≈ -31. Grand steps then
 *    fall to a ~2.0 m tree terrace (y -37 … -49) and on to the Poydras
 *    sidewalk (y ≈ -54) (all measured). Steps counted as broad treads, not
 *    every riser (estimated from Infrogmation's 2025 plaza photos).
 *    The east (St. Charles) face meets the street directly (lidar).
 *  - bays: 20 windows across a long face, 14 across a short face, counted on
 *    ajay_suresh's 2026 photo and Tony Webster's photo (estimated ±1). Window
 *    1.6 m wide on a ~2.9 m bay (just over half, as the photos read; the
 *    pier chamfers take a little back), corner piers 1.5 m, so the piers
 *    come out 1.3-1.4 m (estimated from the counts and the OSM plan size).
 *    Pier depth 0.3 m with 0.12 m chamfers, estimated from JasonParis's
 *    close-up. Each face's windows are one band per storey group laid
 *    behind the piers, so the piers cut it into openings.
 *    Floors grouped two to a panel, 24 groups from 12.5 m to 202.9 m with
 *    2.4 m spandrel bands, plus the taller top-floor row. Three-floor groups
 *    were tested side by side (review round 1): they read as tall slots
 *    against the photo's even grid, and the 80 px view was no calmer, so
 *    two floors were kept.
 *  - lobby: plaza level to 12.5 m, glass set 1.5 m behind the piers
 *    (estimated from Infrogmation's plaza photos and pasa47's close-up).
 *  - sign: blue box letters along the top of the Poydras (south) face from
 *    the west corner over about half its length (ajay_suresh 2026). Drawn as
 *    two plain boxes, one per word (STYLE: not a famous sign, so no
 *    lettering); `neon` so it glows blue at night, as in the 2022 night view.
 *  - west annex: OSM way/328669312 (703 Poydras, 13 levels), 38.25 × 72.05 m
 *    in this frame. Roof 46.8 → 46.3 m and a 10 × 14 m mechanical box to
 *    49.5 m (lidar, measured). 21 bays on the long faces and 11 on the short
 *    ones, 13 window rows over a solid travertine base at plaza level
 *    (counted on Infrogmation's 2007 photo from the west and ajay_suresh's
 *    2026 photo). Windows 2.5 m of a 3.4 m bay and 2.3 m of a 3.1 m storey,
 *    one panel per real window as the photos show (estimated).
 *  - colours: travertine pale warm grey (all daylight photos), pulled to the
 *    palette's lightness; tower windows the palette slate; the annex's
 *    darker glass and the lobby glass `window-2`, a darker slate. Penthouse
 *    and annex mechanical box in roof grey, as on the roof (review round 1).
 *
 * Photos (EVIDENCE):
 *  - Hancock Whitney Center - former One Shell Square - New Orleans February
 *    2026.jpg, ajay_suresh, CC BY 4.0 (from the south-west)
 *    https://commons.wikimedia.org/wiki/File:Hancock_Whitney_Center_-_former_One_Shell_Square_-_New_Orleans_February_2026.jpg
 *  - New Orleans, LA (Central Business District) - One Shell Square.jpg,
 *    JasonParis, CC BY 2.0
 *    https://commons.wikimedia.org/wiki/File:New_Orleans,_LA_(Central_Business_District)_-_One_Shell_Square.jpg
 *  - One Shell Square Nov 2012.jpg, Infrogmation of New Orleans, CC BY 2.0
 *    https://commons.wikimedia.org/wiki/File:One_Shell_Square_Nov_2012.jpg
 *  - CBD11Oct07OneShellSqFromPoydrasBack.jpg, Infrogmation of New Orleans,
 *    CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:CBD11Oct07OneShellSqFromPoydrasBack.jpg
 *  - CBD11Oct07GirodFireStationOneShell.jpg, Infrogmation of New Orleans,
 *    CC BY-SA 3.0 (from the north)
 *    https://commons.wikimedia.org/wiki/File:CBD11Oct07GirodFireStationOneShell.jpg
 *  - One Shell Square Plaza, New Orleans, March 2025 - 1, 2, 3.jpg,
 *    Infrogmation, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:One_Shell_Square_Plaza,_New_Orleans,_March_2025_-_1.jpg
 *  - Office Towers - New Orleans, March 2015 - One Shell Square.jpg, pasa47,
 *    CC BY 2.0
 *    https://commons.wikimedia.org/wiki/File:Office_Towers_-_New_Orleans,_March_2015_-_One_Shell_Square.jpg
 *  - Hancock Whitney Center (701 Poydras Street), Tony Webster, CC BY 2.0
 *    https://www.flickr.com/photos/87296837@N00/54573171600
 *  - Night view of NOLA Feb 2022.jpg, 2C2K Photography, CC BY 2.0
 *    https://commons.wikimedia.org/wiki/File:Night_view_of_NOLA_Feb_2022.jpg
 * Aerial: USGS NAIP. Look-only: none used. No commercial imagery.
 *
 * Ground: the terrain under the site is flat (Mapterhorn 0.1-1.9 m); the
 * raised plaza is not in it and is modelled here to its lidar height.
 * elevation 0.
 *
 * Doubts: the bay counts are counted from oblique photos (±1). Whether the
 * sign also runs on the north face is unknown (no clear photo); drawn on the
 * south face only. The north plaza strip is hidden from the lidar by the
 * tower and is assumed to match its ends. The annex's north and east faces
 * are not photographed; drawn like its west and south faces. OSM tags the
 * annex as a multi-storey car park, but every photo shows office glazing.
 *
 * Left out: floor-by-floor window rows on the tower (grouped two to a panel), the trees
 * and planters on the terrace, the entrance canopies, rooftop masts.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { type XY, rect, inset, walls, cap, parapetRoof, onWall, panel, rows, save } from './chi-aon-center'

const LX = 59.47 / 2, LY = 42.6 / 2 // half sizes of the tower outline
const PLINTH = 4.5 // plaza level above the street
const LOBBY = 12.5 // top of the plaza-level colonnade
const BAND = 205.8, ROOF = 206.5 // top band under the roof lip
const PENT = 212.4
const C = 1.5 // corner pier along each face
const W = 1.6 // window width (just over half the 2.9 m bay; the piers' chamfers take some back)
const D = 0.3 // pier depth above the lobby
const DL = 1.5 // lobby glass behind the face line
const CH = 0.12 // pier chamfer each side
const FLOORS = 2 // storeys per window panel (3 tested: reads as slots, see header)

// The west annex (way/328669312).
const AX0 = -74.95, AX1 = -36.7, AY0 = -47.7, AY1 = 24.35
const AROOF = 46.3, ABAND = 45.3

type Face = Omit<ReturnType<typeof onWall>, 'n'> & { a: XY; b: XY; n: number; pier: number; win0: number[] }

/**
 * A pier-and-window facade on every face of a counter-clockwise rectangle:
 * the window wall sits `d` behind the face between solid corner piers `c`
 * wide; `n(L)` windows `w` wide per face, piers (chamfered `ch`) between
 * them; one window band per storey group, laid behind the piers so the
 * piers cut it into openings.
 */
function pierFacade(trav: Part, win: Part, outline: XY[], o: { c: number; w: number; d: number; ch: number; n: (L: number) => number; z0: number; z1: number; groups: [number, number][] }): Face[] {
  const faces: Face[] = outline.map((a, i) => {
    const b = outline[(i + 1) % 4], f = onWall(a, b), n = o.n(f.L)
    const pier = (f.L - 2 * o.c - n * o.w) / (n - 1)
    return { a, b, ...f, n, pier, win0: Array.from({ length: n }, (_, k) => o.c + k * (o.w + pier)) }
  })
  const shaft: XY[] = []
  for (const f of faces) {
    const p = (s: number, off: number): XY => { const v = f.P(s, 0, off); return [v[0], v[1]] }
    shaft.push(f.a, p(o.c, 0), p(o.c, -o.d), p(f.L - o.c, -o.d), p(f.L - o.c, 0))
  }
  walls(trav, shaft, o.z0, o.z1)
  for (const f of faces) {
    // underside of the band over the recess
    trav.quad(f.P(o.c, o.z1, 0), f.P(o.c, o.z1, -o.d), f.P(f.L - o.c, o.z1, -o.d), f.P(f.L - o.c, o.z1, 0))
    for (let k = 0; k < f.n - 1; k++) {
      const s0 = f.win0[k] + o.w, s1 = f.win0[k + 1]
      const r: V3[] = [f.P(s0, 0, -o.d), f.P(s0 + o.ch, 0, 0), f.P(s1 - o.ch, 0, 0), f.P(s1, 0, -o.d)]
      for (let q = 0; q < 3; q++) {
        const p = r[q], t = r[q + 1]
        trav.quad([p[0], p[1], o.z0], [t[0], t[1], o.z0], [t[0], t[1], o.z1], [p[0], p[1], o.z1])
      }
    }
    for (const [z0, z1] of o.groups) panel(win, f.a, f.b, o.c, f.L - o.c, z0, z1, -o.d + 0.04)
  }
  return faces
}

/** A box split into wall pieces no longer than `seg` metres (for the map's terrain drape). */
function slab(wall: Part, top: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, seg = 5) {
  const r = rect(x0, y0, x1, y1)
  for (let i = 0; i < 4; i++) {
    const a = r[i], b = r[(i + 1) % 4], L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.ceil(L / seg))
    for (let k = 0; k < n; k++) {
      const t0 = k / n, t1 = (k + 1) / n
      const p: XY = [a[0] + (b[0] - a[0]) * t0, a[1] + (b[1] - a[1]) * t0], q: XY = [a[0] + (b[0] - a[0]) * t1, a[1] + (b[1] - a[1]) * t1]
      wall.quad([p[0], p[1], z0], [q[0], q[1], z0], [q[0], q[1], z1], [p[0], p[1], z1])
    }
  }
  const nx = Math.max(1, Math.ceil((x1 - x0) / seg)), ny = Math.max(1, Math.ceil((y1 - y0) / seg))
  for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
    const a = x0 + (x1 - x0) * i / nx, b = x0 + (x1 - x0) * (i + 1) / nx, c = y0 + (y1 - y0) * j / ny, d = y0 + (y1 - y0) * (j + 1) / ny
    top.quad([a, c, z1], [b, c, z1], [b, d, z1], [a, d, z1])
  }
}

/** A flight of `n` broad steps from h0 (at the start) down to h1, along +x or -y. */
function flight(wall: Part, top: Part, x0: number, x1: number, y0: number, y1: number, h0: number, h1: number, n: number, dir: 'x+' | 'y-') {
  for (let i = 0; i < n; i++) {
    const h = h0 - (h0 - h1) * (i + 1) / (n + 1) // each tread below the landing it leaves
    if (dir === 'y-') { const a = y0 - (y0 - y1) * i / n, b = y0 - (y0 - y1) * (i + 1) / n; slab(wall, top, x0, b, x1, a, 0, h) }
    else { const a = x0 + (x1 - x0) * i / n, b = x0 + (x1 - x0) * (i + 1) / n; slab(wall, top, a, y0, b, y1, 0, h) }
  }
}

function build() {
  const trav = new Part(), win = new Part(), lobby = new Part(), roof = new Part(), plaza = new Part(), sign = new Part()

  // ---- Tower
  const outline = rect(-LX, -LY, LX, LY)
  // Plinth below the plaza (solid travertine where the street meets it, east side).
  walls(trav, outline, 0, PLINTH)
  cap(trav, outline, PLINTH)

  // Shaft: piers and window bands, storeys grouped FLOORS to a panel.
  const top = 202.9, n = Math.round((top - LOBBY) / (4.0 * FLOORS))
  const groups: [number, number][] = [...rows(LOBBY, top, n, FLOORS === 2 ? 2.4 : 3.2), [203.7, BAND - 0.5]]
  const faces = pierFacade(trav, win, outline, { c: C, w: W, d: D, ch: CH, n: L => (L > 50 ? 20 : 14), z0: LOBBY, z1: BAND, groups })
  const shaft: XY[] = []
  for (const f of faces) {
    const p = (s: number, off: number): XY => { const v = f.P(s, 0, off); return [v[0], v[1]] }
    shaft.push(f.a, p(C, 0), p(C, -D), p(f.L - C, -D), p(f.L - C, 0))
  }
  cap(trav, shaft, LOBBY, false) // soffit over the colonnade

  // Lobby: glass core set back DL, with the piers as free columns in front.
  walls(lobby, inset(outline, DL), PLINTH, LOBBY)
  for (const f of faces) {
    const { P } = f
    const col = (s0: number, s1: number, sides: number) => {
      const r: V3[] = [P(s0, 0, -DL), P(s0, 0, 0), P(s1, 0, 0), P(s1, 0, -DL), P(s0, 0, -DL)]
      for (let k = 0; k < sides; k++) {
        const p = r[k], q = r[k + 1]
        trav.quad([p[0], p[1], PLINTH], [q[0], q[1], PLINTH], [q[0], q[1], LOBBY], [p[0], p[1], LOBBY])
      }
    }
    col(0, C, 4) // square corner column
    for (let k = 0; k < f.n - 1; k++) {
      const s0 = f.win0[k] + W, s1 = f.win0[k + 1]
      col(s0, s1, 3)
      const q = (s: number, off: number): V3 => { const v = P(s, 0, off); return [v[0], v[1], LOBBY] }
      trav.quad(q(s0, -D), q(s0, 0), q(s1, 0), q(s1, -D)) // column top beside the chamfers
    }
  }

  // Top band, bevelled, and the roof behind a low lip.
  const bev = inset(outline, 0.35)
  walls(trav, outline, BAND, ROOF - 0.35)
  walls(trav, outline, ROOF - 0.35, ROOF, bev)
  parapetRoof(trav, roof, bev, ROOF, 0.4, 0.35)

  // Mechanical penthouse, set back on the roof, in roof grey.
  const pent = rect(-15, -9, 15, 9)
  walls(roof, pent, ROOF - 0.35, PENT - 0.3)
  walls(roof, pent, PENT - 0.3, PENT, inset(pent, 0.3))
  cap(roof, inset(pent, 0.3), PENT)

  // The sign: two word boxes along the top of the south face, from the west corner.
  const SZ0 = BAND - 1.9, SZ1 = BAND + 0.1, OUT = 0.35
  for (const [x0, x1] of [[-LX + 1.5, -LX + 15.5], [-LX + 17.5, -LX + 31.5]]) {
    const a: V3 = [x0, -LY - OUT, SZ0], b: V3 = [x1, -LY - OUT, SZ0]
    sign.quad(a, b, [x1, -LY - OUT, SZ1], [x0, -LY - OUT, SZ1])
    sign.quad([x0, -LY, SZ1], [x0, -LY - OUT, SZ1], [x1, -LY - OUT, SZ1], [x1, -LY, SZ1])
    sign.quad([x0, -LY, SZ0], [x1, -LY, SZ0], [x1, -LY - OUT, SZ0], [x0, -LY - OUT, SZ0])
    sign.quad([x0, -LY, SZ0], [x0, -LY - OUT, SZ0], [x0, -LY - OUT, SZ1], [x0, -LY, SZ1])
    sign.quad([x1, -LY - OUT, SZ0], [x1, -LY, SZ0], [x1, -LY, SZ1], [x1, -LY - OUT, SZ1])
  }

  // ---- West annex: solid plinth, 13 storeys of large windows, flat roof.
  const annex = rect(AX0, AY0, AX1, AY1)
  walls(trav, annex, 0, PLINTH)
  cap(trav, annex, PLINTH)
  pierFacade(trav, lobby, annex, { c: 0.9, w: 2.5, d: 0.2, ch: 0.06, n: L => (L > 50 ? 21 : 11), z0: PLINTH, z1: ABAND, groups: rows(PLINTH, ABAND, 13, 0.8) })
  const abev = inset(annex, 0.3)
  walls(trav, annex, ABAND, AROOF - 0.3)
  walls(trav, annex, AROOF - 0.3, AROOF, abev)
  parapetRoof(trav, roof, abev, AROOF, 0.4, 0.4)
  const amech = rect(-63, -31, -53, -17)
  walls(roof, amech, AROOF - 0.4, 49.5)
  cap(roof, amech, 49.5)

  // ---- Raised plaza (4.5 m) and its steps.
  slab(trav, plaza, AX1, -47.8, -LX, 26, 0, PLINTH) // strip between the buildings
  slab(trav, plaza, -LX, LY, 24, 26, 0, PLINTH) // north strip
  slab(trav, plaza, -LX, -31, 16, -LY, 0, PLINTH) // south plaza
  flight(trav, plaza, 24, 30, LY, 26, PLINTH, 0, 5, 'x+') // north-east steps to St. Charles
  slab(trav, plaza, -LX, -49, 26, -37, 0, 2.0) // tree terrace
  slab(trav, plaza, 16, -37, 26, -LY, 0, 2.0)
  flight(trav, plaza, -LX, 16, -31, -37, PLINTH, 2.0, 6, 'y-') // grand steps, upper flight
  flight(trav, plaza, 16, 21, -37, -LY, PLINTH, 2.0, 4, 'x+') // side steps to the terrace
  flight(trav, plaza, -LX, 26, -49, -54, 2.0, 0, 5, 'y-') // lower flight to Poydras
  flight(trav, plaza, 26, 29, -49, -LY, 2.0, 0, 3, 'x+') // terrace to St. Charles

  return [
    { part: trav, material: finish('hw-travertine', 0xebe6dd) },
    { part: win, material: PALETTE.window },
    { part: lobby, material: windowVariant(2, 0x5a6d7d) },
    { part: roof, material: PALETTE.roof },
    { part: plaza, material: finish('hw-plaza', 0xe3ddd2) },
    { part: sign, material: finish('neon-hancock-blue', 0x3d8fd1) },
  ]
}

if (import.meta.main) await save('nola-hancock-whitney-center', 'Hancock Whitney Center', [29.9502763, -90.0707983], 13.86, build(), 6500)
