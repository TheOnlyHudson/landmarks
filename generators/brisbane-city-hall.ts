/**
 * Brisbane City Hall (1920-1930; Hall & Prentice) — procedural, CC0-1.0,
 * no textures.
 * bun generators/brisbane-city-hall.ts
 *
 * Writes models/brisbane-city-hall.glb (low, ≤ 6,500 triangles) and
 * models/brisbane-city-hall.detail.glb (detail, ≤ 40,000) from one
 * description.
 *
 * The hall: a near-square sandstone block on a granite base, Italian
 * Renaissance, symmetrical about the axis through King George Square. The
 * square front (north-east) has a hexastyle Corinthian portico with the
 * sculpted pediment, giant Ionic colonnades in antis either side in front of
 * deep loggias, and raised corner pavilions with attics; the Adelaide Street
 * (south-east) and Ann Street (north-west) sides and the back have giant
 * pilasters between tall recessed window bays and a raised central
 * pavilion; round-headed windows run round the ground storey; an attic
 * storey stands over the main cornice. The clock tower (modelled on St
 * Mark's Campanile) rises behind the pediment: a base block, the plain
 * shaft with the four 4.8 m clock faces, a balustraded stage, the open
 * belfry of columns between corner piers, the cornice and balustrade with
 * corner balls, and the steep green copper pyramid with its armillary
 * sphere. The low copper dome of the main auditorium rises from the roof.
 *
 * Frame: x across the front (towards Adelaide Street, south-east), y towards
 * King George Square (north-east), z up, metres; origin at the centre of the
 * plan, which is the OSM outline's centroid (within 0.4 m). Placed at
 * bearing 48.9°, the front's outward normal from the OSM outline.
 *
 * Sources:
 * - OSM (© OpenStreetMap contributors, ODbL): way/10836280 (the outline,
 *   building=civic, 85.4 x 84.2 m: main walls x ±40, the front's column line
 *   at y 38.3, the portico 22.9 m wide projecting to y 43.6, corner
 *   pavilions 10.7 m wide projecting 1.4 m, the side faces' central
 *   projections 17.3 m long projecting 2.6 m, the back at y -40.5) and
 *   way/243893440 (the clock tower, height 85, 13.3 x 11.4 m; its centre
 *   lies 2 m off the axis, which the photos don't show: the tower is drawn
 *   on the axis).
 * - Published (Wikipedia "Brisbane City Hall", citing the Queensland
 *   Heritage Register entry 600065): the tower rises 87.47 m above the
 *   ground (King George Square), modelled on St Mark's Campanile; four clock
 *   faces 4.8 m across; Corinthian columns under the tympanum, Ionic
 *   columns either side; Helidon freestone over a Camp Mountain granite
 *   base; a circular auditorium under a copper dome; the tympanum 16.5 m
 *   long and 3 m high (drawn a little larger, to the OSM portico).
 * - Photos (Wikimedia Commons; EVIDENCE):
 *   "Christmas tree outside Brisbane City Hall, Australia in 2020, 02"
 *   (Kgbo, CC BY-SA 4.0; the front and Adelaide Street side from the east:
 *   every level below was measured on it, scaled to the published 87.47 m);
 *   "King George Square in 12.2013 07" (Chris Olszewski, CC BY-SA 3.0; the
 *   front straight on: portico of six Corinthian columns between antae on a
 *   podium storey with three doors, Ionic colonnades, tower stages, clock
 *   size against the shaft);
 *   "Brisbane City Hall, 275 George Street, 69 Ann Street, 300 George,
 *   Brisbane, Feb 2020" (Chris Olszewski, CC BY-SA 4.0; six Ionic columns
 *   per wing, the attic storey, the raised corner pavilion);
 *   "Brisbane City Hall, clock tower and dome, from Roma St Brisbane
 *   DSCF8372" (John Robert McPherson, CC BY-SA 4.0; the dome's rise, the
 *   belfry and spire);
 *   "Brisbane City Hall Clock Tower IMGP2762" (John Robert McPherson, CC0;
 *   belfry columns, parapet balls, the armillary sphere);
 *   "Brisbane City Hall from Adelaide St Brisbane P1060894" (John Robert
 *   McPherson, CC BY-SA 4.0; granite base, round-headed ground windows,
 *   loggia, pavilion cornice);
 *   "Brisbane City Hall Adelaide St Brisbane P1050525" and "P1050530"
 *   (John Robert McPherson, CC BY-SA 4.0; the arched windows' voussoirs,
 *   granite balustrade, the pilasters and two-storey recessed window bays);
 *   "Brisbane City Hall dome from Clock Tower Brisbane IMGP4731" (John
 *   Robert McPherson, CC BY-SA 4.0; the ribbed brown copper dome, its
 *   oculus ring, the grey metal roofs around it);
 *   "Brisbane City Hall floodlit King George Square Brisbane L1180674" (John
 *   Robert McPherson, CC BY-SA 4.0; night: the whole hall and tower
 *   floodlit, clock faces lit, the belfry lit inside).
 * - Measured from the 2020 Christmas-tree photo, metres above King George
 *   Square (scale 0.111 m/px from the published height; the clock faces
 *   come out 5.2 m against the published 4.8): column bases 6.7, capitals'
 *   tops 20.0, portico cornice 22.2, pediment apex 28.3 (drawn 27.6), wing
 *   attic top 24.4-25.6, pavilion attic top 28.3, tower base block top 31.1,
 *   clock centres 51.8, shaft top 60.5, belfry 63.3-73.3, cornice to 75,
 *   parapet 76, spire apex 85.5, the sphere's top 87.4. The shaft is 9 m
 *   across (1.7 clock diameters, from the 2013 front photo).
 * - Estimated: King George Square stands 2 m above the model's base (the
 *   lowest ground, on Adelaide Street, where the granite base shows
 *   tallest); the loggias 2.5 m deep; the dome 31 m across, centred 4 m
 *   behind the plan's centre, rising 5.8 m over a low drum (from the
 *   photo from the tower and the Roma Street view); the side and back
 *   elevations' bay rhythm (3.3 m) from the Adelaide Street photos; the
 *   roofs flat behind the attic (they are low hips and light courts).
 * - Colour: Helidon sandstone warm honey (#efc49e and #dbcbae sunlit,
 *   #a68767 in shade), drawn #dcbd94; the granite base mid grey (#606c73 in
 *   shade), drawn as the palette's roof grey; the spire's copper green-grey
 *   (#506768 in sun on the Roma St photo), drawn #6f8b83; the dome brown
 *   copper (#68605d-#796e6b), drawn #85776e; roofs grey (#a1a39d).
 *
 * Night: the stone is floodlit all round (in colour on festival nights,
 * warm by default); the clock faces are lit (`neon-clock`); the belfry's
 * inside and the windows glow (`window`).
 *
 * Review round 1: the porch's and loggias' back walls are drawn in window
 * slate (they read near-black in shade in every front photo, so each column
 * stands out); the portico is drawn 1 m in front of OSM's outline (to y
 * 44.6, its columns 5.4 m ahead of the wings' columns); the tympanum relief
 * is larger and stands 0.6 m proud.
 *
 * Doubts: the side and back elevations are drawn from street-level photos of
 * the Adelaide Street side only (Ann Street and the back assumed to match);
 * the light courts and hipped roofs are left out; the portico's steps and the
 * modern Adelaide Street awning are left out; the tower is put on the axis
 * against OSM's 2 m offset.
 */
import { Part, type V3, type MaterialSpec } from './mesh'
import { PALETTE, finish } from './palette'
import { writeModel } from './london-buckingham-palace'
import { cbox, rect, qf, tf, cylinder, type Rect } from './dc-white-house'
import { ionic, faceOf, fpt, fpanel, fblock, type Face, type Lod } from './london-british-museum'
import { corinthian } from './berlin-altes-museum'
import { lathe, ellipsoid, TAU } from './nyc-columbus-monument'
import { relief } from './berlin-konzerthaus'
import { LOW, HIGH } from './london-albert-memorial'

export const ID = 'brisbane-city-hall'
export const BEARING = 48.9

type XY = [number, number]

// ---- Levels (model z; the base is Adelaide Street, the lowest ground) --------------

const S = 2.0          // King George Square
const Z_BASE = 3.0     // granite base top
const Z_G = 8.0        // ground storey top (string course to Z_P)
const Z_P = 8.7        // pedestals' top: column and pilaster bases
const Z_C = 18.3       // wings' and sides' capitals' tops (the Ionic order, shorter than the portico's)
const Z_K = 20.1       // their cornice bottom
const Z_E = 20.8       // their cornice top
const Z_A = 24.4       // attic top: level with the portico's cornice (2013 front photo)
const P_C = 22.0       // portico capitals' tops
const P_K = 23.7       // portico cornice bottom
const P_E = 24.4       // portico cornice top: the pediment's base
const D_BASE = 27.2    // the roofs' ridge round the dome's drum
const Z_PAV = 29.0     // pavilion attic top
const Z_PED = 29.6     // pediment apex

// ---- Plan ------------------------------------------------------------------------------

const XW = 40.0                     // side walls
const YB = -40.5                    // back wall
const YC = 38.3                     // front column line
const YL = 35.8                     // loggia back wall
const XP = 11.4                     // portico half-width
const YP = 44.6                     // portico front (OSM 43.6; drawn 1 m further so the porch reads, see header)
const PAV0 = 30.7, PAV1 = 41.3      // front/back pavilions across x
const YPF = 39.7                    // front pavilions' face
const YPB0 = 29.4                   // front pavilions' back along the side faces
const YBP1 = -31.3                  // back pavilions' inner end along the side faces
const XSC = 42.6, YSC0 = -9.4, YSC1 = 7.9 // side centre projections
const TY = 33.0                     // tower centre
const DY = -4.0, DR = 15.5          // dome centre and radius

type K = { sand: Part; roof: Part; win: Part; patina: Part; dome: Part; clock: Part; L: Lod; d: boolean }

/** A box between two plan corners, z0..z1, with an optional chamfer and top bevel. */
const bx = (p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, o: { c?: number; b?: number; top?: boolean; bottom?: boolean } = {}) =>
  cbox(p, rect(Math.min(x0, x1), Math.max(x0, x1), Math.min(y0, y1), Math.max(y0, y1)), z0, z1, o)

/** Both mirror images in x of a builder that takes the sign. */
const mirror = (f: (s: 1 | -1) => void) => { f(1); f(-1) }

/** The face looking +y along y = const, between x0 and x1 (its s runs from x1 towards x0). */
const faceN = (x0: number, x1: number, y: number) => faceOf([Math.max(x0, x1), y], [Math.min(x0, x1), y])
/** The face looking -y. */
const faceS = (x0: number, x1: number, y: number) => faceOf([Math.min(x0, x1), y], [Math.max(x0, x1), y])
/** s along face f of the plan point (x, y). */
const sAt = (f: Face, x: number, y = f.o[1]) => (x - f.o[0]) * f.u[0] + (y - f.o[1]) * f.u[1]

// ---- Windows ---------------------------------------------------------------------------

/**
 * A round-headed window on face f, centred at s, w wide, sill z0, springing
 * zs. Low: a flat panel. Detail: a stone frame standing 0.3 m proud (jambs,
 * a voussoir ring and a sill) with the glass between, so it reads recessed.
 */
function archWindow(k: K, f: Face, s: number, w: number, z0: number, zs: number) {
  const r = w / 2, n = k.d ? 6 : 4
  const d = 0.05
  fpanel(k.win, f, s - r, s + r, z0, zs, d)
  const c = fpt(f, s, zs, d)
  for (let i = 0; i < n; i++) {
    const a0 = Math.PI * i / n, a1 = Math.PI * (i + 1) / n
    tf(k.win, c, fpt(f, s + r * Math.cos(a0), zs + r * Math.sin(a0), d), fpt(f, s + r * Math.cos(a1), zs + r * Math.sin(a1), d), [f.n[0], f.n[1], 0])
  }
  if (!k.d) return
  const t = 0.42, o = 0.3
  // Jambs and sill.
  fblock(k.sand, f, s - r - t, s - r, z0, zs, 0, o)
  fblock(k.sand, f, s + r, s + r + t, z0, zs, 0, o)
  fblock(k.sand, f, s - r - t - 0.15, s + r + t + 0.15, z0 - 0.25, z0, 0, o + 0.1)
  // The voussoir ring: an arched band, its soffit facing the glass.
  const n3 = (a: number): V3 => [f.n[0], f.n[1], 0]
  for (let i = 0; i < n; i++) {
    const a0 = Math.PI * i / n, a1 = Math.PI * (i + 1) / n
    const P = (rr: number, a: number, dd: number) => fpt(f, s + rr * Math.cos(a), zs + rr * Math.sin(a), dd)
    const R1 = r + t + (i === 0 || i === n - 1 ? 0 : 0.12)
    qf(k.sand, P(r, a0, o), P(R1, a0, o), P(R1, a1, o), P(r, a1, o), n3(0))
    const am = (a0 + a1) / 2
    qf(k.sand, P(r, a0, 0), P(r, a1, 0), P(r, a1, o), P(r, a0, o), [-Math.cos(am) * f.u[0], -Math.cos(am) * f.u[1], -Math.sin(am)])
  }
  // Keystone.
  fblock(k.sand, f, s - 0.28, s + 0.28, zs + r - 0.05, zs + r + t + 0.3, 0, o + 0.08)
}

/** A run of round-headed ground-storey windows along face f between s0 and s1, `pitch` apart. */
function groundWindows(k: K, f: Face, s0: number, s1: number, pitch: number, w = 1.5) {
  const n = Math.max(1, Math.round((s1 - s0) / pitch))
  for (let i = 0; i < n; i++) {
    const s = s0 + (s1 - s0) * (i + 0.5) / n
    archWindow(k, f, s, w, Z_BASE + 0.9, Z_BASE + 0.9 + 2.6)
  }
}

// ---- Faces with pilasters ------------------------------------------------------------

/**
 * A pilastered elevation on face f from s0 to s1: the ground storey wall
 * (granite base, sandstone, string course), the upper wall set back `rec`
 * behind the face, giant pilasters (piers) standing to the face and 0.35 m
 * proud of it, and between them the two-storey window bays recessed into
 * the wall; the entablature and cornice over all. Draws only the outward
 * faces: the ends are closed by the neighbouring blocks.
 */
function pilastered(k: K, f: Face, s0: number, s1: number, pitch: number, o: { top?: number; ground?: boolean } = {}) {
  const rec = 0.55, top = o.top ?? Z_E
  const n = Math.max(1, Math.round((s1 - s0) / pitch)), bay = (s1 - s0) / n
  const pw = Math.min(1.3, bay * 0.4)
  // Granite base and ground storey, flush with the face.
  fblock(k.roof, f, s0, s1, 0, Z_BASE, 0, 0.25)
  fblock(k.sand, f, s0, s1, Z_BASE, Z_G, -0.6, 0)
  fblock(k.sand, f, s0, s1, Z_G, Z_P, -0.6, 0.25, true)
  if (o.ground !== false) groundWindows(k, f, s0, s1, pitch)
  // The recessed wall behind the bays, and the bays' windows on it.
  fpanel(k.sand, f, s0, s1, Z_P, Z_C, -rec)
  for (let i = 0; i < n; i++) {
    const a = s0 + i * bay + pw / 2, b = s0 + (i + 1) * bay - pw / 2
    fpanel(k.win, f, a + 0.2, b - 0.2, Z_P + 0.7, 13.0, -rec + 0.04)
    fpanel(k.win, f, a + 0.2, b - 0.2, 13.9, Z_C - 0.9, -rec + 0.04)
    // The spandrel's ledge between the two storeys of the bay.
    if (k.d) fblock(k.sand, f, a, b, 13.0, 13.9, -rec, -rec + 0.25, true)
  }
  // Piers with their pilasters.
  for (let i = 0; i <= n; i++) {
    const s = s0 + i * bay
    const a = Math.max(s0, s - pw / 2), b = Math.min(s1, s + pw / 2)
    if (!k.d) { pier(k.sand, f, a, b, Z_P, Z_C, -rec, 0.3); continue }
    fblock(k.sand, f, a, b, Z_P, Z_C, -rec, 0)
    fblock(k.sand, f, a + 0.12, b - 0.12, Z_P, Z_C - 0.9, 0, 0.3)
    // Capital block.
    fblock(k.sand, f, a, b, Z_C - 0.9, Z_C, 0, 0.42, true)
  }
  entablature(k, f, s0, s1, top)
}

/** A pier on face f: its front and two ends only (top and bottom are hidden). */
function pier(p: Part, f: Face, s0: number, s1: number, z0: number, z1: number, d0: number, d1: number) {
  const n: V3 = [f.n[0], f.n[1], 0], u: V3 = [f.u[0], f.u[1], 0]
  qf(p, fpt(f, s0, z0, d1), fpt(f, s1, z0, d1), fpt(f, s1, z1, d1), fpt(f, s0, z1, d1), n)
  qf(p, fpt(f, s0, z0, d0), fpt(f, s0, z0, d1), fpt(f, s0, z1, d1), fpt(f, s0, z1, d0), [-u[0], -u[1], 0])
  qf(p, fpt(f, s1, z0, d0), fpt(f, s1, z0, d1), fpt(f, s1, z1, d1), fpt(f, s1, z1, d0), u)
}

/** Architrave, frieze and cornice along face f from s0 to s1, the frieze on the face line. */
function entablature(k: K, f: Face, s0: number, s1: number, top = Z_E, ends = false, zc = Z_C, zk = Z_K) {
  fblock(k.sand, f, s0, s1, zc, zk, -0.6, 0.05, true)
  fblock(k.sand, f, s0 - (ends ? 0.7 : 0), s1 + (ends ? 0.7 : 0), zk, top, -0.6, 0.75, true)
  if (k.d) {
    // Dentils under the cornice.
    const n = Math.floor((s1 - s0) / 0.9)
    for (let i = 0; i < n; i++) {
      const s = s0 + 0.2 + i * 0.9
      fpanel(k.sand, f, s, s + 0.35, zk - 0.32, Z_K, 0.32)
      const P = (ss: number, d: number) => fpt(f, ss, zk - 0.32, d)
      qf(k.sand, P(s, 0.05), P(s + 0.35, 0.05), P(s + 0.35, 0.32), P(s, 0.32), [0, 0, -1])
    }
    // Bed moulding: a thin band between frieze and cornice.
    fblock(k.sand, f, s0, s1, zk - 0.45, zk - 0.32, 0.05, 0.22, true)
  }
}

/** The attic storey on face f, set back sb, z from Z_E to top, with a coping. */
function attic(k: K, f: Face, s0: number, s1: number, top: number, sb = 0.3) {
  fblock(k.sand, f, s0, s1, Z_E, top - 0.45, -1, -sb)
  fblock(k.sand, f, s0 - 0.2, s1 + 0.2, top - 0.45, top, -1, -sb + 0.3, true)
}

// ---- The front: loggias, pavilions, portico -----------------------------------------

/** One wing's Ionic colonnade in antis in front of its loggia (x from xa to xb, xa < xb). */
function wing(k: K, xa: number, xb: number) {
  const fF = faceN(xa, xb, 39.0) // podium front, facing +y
  // Podium storey (ground floor) from the loggia's back wall out to the podium front.
  bx(k.sand, xa, xb, YL, 39.0, Z_BASE, Z_P, { top: true })
  bx(k.roof, xa, xb, YL, 39.25, 0, Z_BASE, { top: true })
  fblock(k.sand, fF, 0, xb - xa, Z_G, Z_P, 0, 0.25, true)
  // Six columns, ground windows between them.
  const xs = Array.from({ length: 6 }, (_, i) => xa + 1.6 + i * (xb - xa - 3.2) / 5)
  if (!k.d) bx(k.sand, xa, xb, YC - 0.8, YC + 0.8, Z_P, Z_P + 0.9)
  for (const x of xs) {
    // Pedestal.
    if (k.d) bx(k.sand, x - 0.95, x + 0.95, YC - 0.95, YC + 0.95, Z_P, Z_P + 0.9, { b: 0.1 })
    ionic(k.L, k.sand, k.sand, x, YC, Z_P + 0.9, Z_C, 0.66, [1, 0])
  }
  for (let i = 0; i <= 6; i++) {
    const xl = i === 0 ? xa : xs[i - 1], xr = i === 6 ? xb : xs[i]
    if (xr - xl < 2) continue
    archWindow(k, fF, sAt(fF, (xl + xr) / 2), 1.4, Z_BASE + 0.9, Z_BASE + 3.4)
  }
  // Balustrade between the pedestals (detail), a solid low wall in the low model.
  for (let i = 0; i < 5; i++) {
    const x0 = xs[i] + 0.95, x1 = xs[i + 1] - 0.95
    if (!k.d) continue
    bx(k.sand, x0, x1, YC - 0.35, YC + 0.35, Z_P + 0.75, Z_P + 0.95, { bottom: true })
    const nb = Math.floor((x1 - x0) / 0.42)
    for (let j = 0; j < nb; j++) {
      const x = x0 + (j + 0.5) * (x1 - x0) / nb
      lathe(k.sand, [[0.13, Z_P + 0.15], [0.08, Z_P + 0.5], [0.08, Z_P + 0.75]], 5, x, YC, false)
    }
  }
  // The loggia's back wall with its window bays, one per intercolumniation.
  const fL = faceN(xa, xb, YL)
  // The loggia's back wall reads dark in every photo (deep shade, tall windows): drawn in window slate.
  fpanel(k.win, fL, 0, xb - xa, Z_P, Z_C, 0)
  for (let i = 0; i < 5; i++) {
    const a = sAt(fL, xs[i + 1] - 0.45), b = sAt(fL, xs[i] + 0.45)
    void a, void b
    if (k.d) {
      // Window aedicule: a small pediment hood over the lower window.
      fblock(k.sand, fL, a - 0.15, b + 0.15, 13.0, 13.35, 0, 0.3, true)
    }
  }
  // Loggia ceiling and the entablature on the columns.
  const fE = faceN(xa, xb, YC + 0.75)
  bx(k.sand, xa, xb, YL, YC + 0.75, Z_C, Z_K, { bottom: true, top: false })
  entablature(k, fE, 0, xb - xa)
  bx(k.sand, xa, xb, YL, YC + 0.15, Z_K, Z_E, { top: false })
  attic(k, fE, 0, xb - xa, Z_A, 0.4)
}

/** A raised pavilion block with an attic: plan rectangle r, giant pilasters on its open faces. */
function pavilion(k: K, r: Rect, faces: Face[]) {
  bx(k.roof, r.x0 - 0.25, r.x1 + 0.25, r.y0 - 0.25, r.y1 + 0.25, 0, Z_BASE)
  bx(k.sand, r.x0, r.x1, r.y0, r.y1, Z_BASE, P_K, { top: false })
  if (k.d) bx(k.sand, r.x0 - 0.2, r.x1 + 0.2, r.y0 - 0.2, r.y1 + 0.2, Z_G, Z_P, { bottom: true, top: false })
  bx(k.sand, r.x0 - 0.75, r.x1 + 0.75, r.y0 - 0.75, r.y1 + 0.75, P_K, P_E, { bottom: true, b: k.d ? 0.2 : 0 })
  bx(k.sand, r.x0 - 0.1, r.x1 + 0.1, r.y0 - 0.1, r.y1 + 0.1, P_E, Z_PAV - 0.5, { top: false })
  bx(k.sand, r.x0 - 0.45, r.x1 + 0.45, r.y0 - 0.45, r.y1 + 0.45, Z_PAV - 0.5, Z_PAV, { bottom: true, b: k.d ? 0.15 : 0 })
  for (const f of faces) {
    const L = f.len
    // Paired pilasters at the ends, a tall framed window between them.
    for (const [a, b] of k.d ? [[0.4, 1.5], [1.9, 3.0], [L - 3.0, L - 1.9], [L - 1.5, L - 0.4]] : [[0.4, 3.0], [L - 3.0, L - 0.4]]) {
      fblock(k.sand, f, a, b, Z_P, P_C - 0.9, 0, 0.3)
      if (k.d) fblock(k.sand, f, a - 0.1, b + 0.1, P_C - 0.9, P_C, 0, 0.4, true)
    }
    const m = L / 2
    fblock(k.sand, f, m - 1.9, m + 1.9, Z_P + 0.4, P_C - 0.6, 0, 0.25)
    fpanel(k.win, f, m - 1.4, m + 1.4, Z_P + 0.8, 14.9, 0.27)
    fpanel(k.win, f, m - 1.4, m + 1.4, 16.0, P_C - 1.1, 0.27)
    if (k.d) fblock(k.sand, f, m - 2.2, m + 2.2, P_C - 0.6, P_C - 0.2, 0, 0.45, true)
    archWindow(k, f, m, 1.6, Z_BASE + 0.9, Z_BASE + 3.5)
    // Attic panel.
    if (k.d) fblock(k.sand, f, m - 3.0, m + 3.0, P_E + 0.9, Z_PAV - 1.4, 0.1, 0.3)
    if (k.d) fblock(k.sand, f, 0, L, P_K - 0.45, P_K, 0.75, 0.95, true)
  }
}

/** The Corinthian portico on its podium, the pediment with its sculpture. */
function portico(k: K) {
  // Podium storey with three doors.
  bx(k.roof, -XP - 0.3, XP + 0.3, YC, YP + 0.3, 0, Z_BASE)
  bx(k.sand, -XP, XP, YC, YP, Z_BASE, Z_P, { top: true })
  const fF = faceN(-XP, XP, YP)
  fblock(k.sand, fF, -0.3, 2 * XP + 0.3, Z_G, Z_P, 0, 0.3, true)
  for (const x of [-6, 0, 6]) {
    const s = x + XP
    fpanel(k.win, fF, s - 1.25, s + 1.25, S, S + 4.3, 0.04)
    fblock(k.sand, fF, s - 1.65, s + 1.65, S + 4.3, S + 4.9, 0, 0.35, true)
    fblock(k.sand, fF, s - 1.65, s - 1.25, S, S + 4.3, 0, 0.2)
    fblock(k.sand, fF, s + 1.25, s + 1.65, S, S + 4.3, 0, 0.2)
  }
  // Six Corinthian columns between square antae; the antae return as the
  // portico's side walls.
  const YCOL = YP - 0.9
  for (const x of [-7.5, -4.5, -1.5, 1.5, 4.5, 7.5]) {
    bx(k.sand, x - 0.95, x + 0.95, YCOL - 0.95, YCOL + 0.95, Z_P, Z_P + 0.9, { b: k.d ? 0.1 : 0 })
    corinthian(k.L, k.sand, k.sand, x, YCOL, Z_P + 0.9, P_C, 0.72, k.d)
  }
  mirror((s) => {
    const x0 = s * (XP - 1.5), x1 = s * XP
    bx(k.sand, x0, x1, YL, YP - 0.05, Z_P, P_C - 1.0, { top: false })
    bx(k.sand, x0 - s * 0.1, x1 + s * 0.12, YL, YP + 0.08, P_C - 1.0, P_C, { top: false, bottom: true })
  })
  // The back wall of the portico, its windows and the central door's hood.
  const fB = faceN(-XP + 1.5, XP - 1.5, YL)
  // The porch's back wall: dark, as the deep porch reads in the photos.
  fpanel(k.win, fB, 0, fB.len, Z_P, P_C, 0)
  for (const x of [-6, 0, 6]) {
    const s = x + fB.len / 2
    if (k.d) fblock(k.sand, fB, s - 2.3, s + 2.3, 15.0, 15.35, 0, 0.35, true)
  }
  // Entablature round three sides, the portico's ceiling.
  bx(k.sand, -XP, XP, YL, YP + 0.1, P_C, P_K, { bottom: true, top: false })
  entablature(k, fF, 0, 2 * XP, P_E, true, P_C, P_K)
  for (const s of [1, -1] as const) {
    const fS = s > 0 ? faceOf([XP, YC + 0.2], [XP, YP]) : faceOf([-XP, YP], [-XP, YC + 0.2])
    entablature(k, fS, 0, fS.len, P_E, false, P_C, P_K)
  }
  bx(k.sand, -XP + 0.1, XP - 0.1, YL, YP, P_K, P_E, { top: false })
  // The pediment: tympanum set back behind a raking cornice, a gable roof
  // running back into the tower's base.
  const yT = YP + 0.1, yR = YP + 0.95, yBack = TY + 6.2
  const h = Z_PED - P_E, w = XP + 0.75
  const tymp = (y: number): V3[] => [[-w, y, P_E], [w, y, P_E], [0, y, P_E + h]]
  tf(k.sand, ...(tymp(yT) as [V3, V3, V3]), [0, 1, 0])
  // Gable roof, from the raking cornice's back to the tower block.
  for (const s of [1, -1]) {
    const n: V3 = [s * h, 0, w]
    qf(k.roof, [s * w, yBack, P_E], [s * w, yR, P_E], [0, yR, Z_PED], [0, yBack, Z_PED], n)
  }
  // Raking cornices: bands 0.75 deep standing 0.5 proud of the tympanum.
  const slope = Math.atan2(h, w), t = 1.0
  for (const s of [1, -1]) {
    const A: V3 = [s * (w + 0.35), yR, P_E - 0.1], B: V3 = [0, yR, Z_PED + 0.25]
    const dn: V3 = [s * Math.sin(slope) * t, 0, -Math.cos(slope) * t]
    const A2: V3 = [A[0] + dn[0], A[1], A[2] + dn[2]], B2: V3 = [B[0] + dn[0] * 0, B[1], B[2] - t / Math.cos(slope)]
    for (const [P, Q] of [[A, B], [A2, B2]]) void P, void Q
    qf(k.sand, A, B, B2, A2, [0, 1, 0])
    qf(k.sand, [A[0], yT, A[2]], [B[0], yT, B[2]], B, A, [s * Math.sin(slope), 0, Math.cos(slope)])
    qf(k.sand, [A2[0], yT, A2[2]], [B2[0], yT, B2[2]], B2, A2, [-s * Math.sin(slope), 0, -Math.cos(slope)])
  }
  // Horizontal cornice under the tympanum.
  fblock(k.sand, faceN(-w, w, yT), 0, 2 * w, P_E, P_E + 0.4, 0, 0.5)
  // Sculpture in the tympanum: figures in relief, the tallest at the centre.
  relief(k.sand, k.d ? HIGH : LOW, k.d ? 15 : 7, w - 0.9, h - 0.2, P_E + 0.4, 0, (u) => [u, yT + 0.6])
  if (k.d) {
    // Lion heads over the capitals.
    for (const x of [-XP + 0.75, -7.5, -4.5, -1.5, 1.5, 4.5, 7.5, XP - 0.75])
      ellipsoid(k.sand, [x, YP + 0.2, P_C + 0.85], [0.35, 0.25, 0.38], 6, 3)
  }
}

// ---- Sides and back --------------------------------------------------------------------

function sides(k: K) {
  mirror((s) => {
    // Side faces between the pavilions and the central projection.
    const run = (y0: number, y1: number) => {
      const f = s > 0 ? faceOf([XW, y0], [XW, y1]) : faceOf([-XW, y1], [-XW, y0])
      pilastered(k, f, 0, f.len, k.d ? 3.3 : 4.1)
      attic(k, f, 0, f.len, Z_A)
    }
    run(YBP1, YSC0)
    run(YSC1, YPB0)
    // Bodies behind those faces.
    bx(k.sand, s * (XW - 0.6), s * (XW - 3), YBP1, YPB0, Z_BASE, Z_A - 0.5, { top: false })
    // The central projection: a raised pavilion with an attic.
    const r = s > 0 ? rect(XW - 1, XSC, YSC0, YSC1) : rect(-XSC, -XW + 1, YSC0, YSC1)
    pavilion(k, r, [s > 0 ? faceOf([XSC, YSC0], [XSC, YSC1]) : faceOf([-XSC, YSC1], [-XSC, YSC0])])
    // Front pavilion (corner of the square and the side street).
    const rf = s > 0 ? rect(PAV0, PAV1, YPB0, YPF) : rect(-PAV1, -PAV0, YPB0, YPF)
    pavilion(k, rf, s > 0
      ? [faceN(PAV0, PAV1, YPF), faceOf([PAV1, YPB0], [PAV1, YPF])]
      : [faceN(-PAV1, -PAV0, YPF), faceOf([-PAV1, YPF], [-PAV1, YPB0])])
    // Back pavilion.
    const rb = s > 0 ? rect(PAV0, PAV1, YB, YBP1) : rect(-PAV1, -PAV0, YB, YBP1)
    pavilion(k, rb, s > 0
      ? [faceS(PAV0, PAV1, YB), faceOf([PAV1, YB], [PAV1, YBP1])]
      : [faceS(-PAV1, -PAV0, YB), faceOf([-PAV1, YBP1], [-PAV1, YB])])
  })
  // The back between the back pavilions.
  const f = faceS(-PAV0, PAV0, YB)
  pilastered(k, f, 0, f.len, k.d ? 3.3 : 4.1)
  attic(k, f, 0, f.len, Z_A)
  bx(k.sand, -PAV0, PAV0, YB + 0.6, YB + 3, Z_BASE, Z_A - 0.5, { top: false })
  // The roof behind the attic: one grey deck, the dome rising through it.
  // The roof behind the attic: low hips rising from the attic to the dome's drum.
  {
    const r0 = (z: number): V3[] => [[-XW + 0.5, YB + 0.5, z], [XW - 0.5, YB + 0.5, z], [XW - 0.5, YL, z], [-XW + 0.5, YL, z]]
    const R = DR + 1.2, r1 = (z: number): V3[] => [[-R, DY - R, z], [R, DY - R, z], [R, DY + R, z], [-R, DY + R, z]]
    k.roof.loft([r0(Z_A - 0.6), r1(D_BASE + 0.6)])
    k.roof.cap(r1(D_BASE + 0.6), true)
  }
  // Front wings' ends abut the pavilions and the portico.
  wing(k, XP, PAV0)
  wing(k, -PAV0, -XP)
}

// ---- The dome --------------------------------------------------------------------------

function dome(k: K) {
  const seg = k.d ? 32 : 16
  // Drum, then a low segmental dome to the oculus ring.
  cylinder(k.sand, 0, DY, DR + 0.4, D_BASE + 0.6, D_BASE + 1.6, seg)
  lathe(k.sand, k.d ? [[DR + 0.4, D_BASE + 1.6], [DR + 0.8, D_BASE + 1.6], [DR + 0.8, D_BASE + 2.0], [DR, D_BASE + 2.0]] : [[DR + 0.4, D_BASE + 1.6], [DR, D_BASE + 2.0]], seg, 0, DY, false)
  const rise = 5.0, z0 = D_BASE + 2.0, R = (DR * DR + rise * rise) / (2 * rise)
  const prof: [number, number][] = []
  const rings = k.d ? 9 : 5
  for (let i = 0; i <= rings; i++) {
    const r = DR - (DR - 3.2) * i / rings
    prof.push([r, z0 + Math.sqrt(R * R - r * r) - (R - rise)])
  }
  smoothLathe(k.dome, prof, seg, 0, DY)
  // The oculus ring and its low lantern.
  const zt = prof[prof.length - 1][1]
  lathe(k.dome, k.d ? [[3.2, zt], [3.4, zt + 0.5], [2.4, zt + 0.7], [0.8, zt + 0.95]] : [[3.2, zt], [3.4, zt + 0.5], [1.2, zt + 0.9]], k.d ? 20 : 8, 0, DY, true)
  if (k.d) {
    // The copper's standing seams as low ribs.
    for (let i = 0; i < 24; i++) {
      const a = TAU * i / 24, c = Math.cos(a), s = Math.sin(a)
      for (let j = 0; j < prof.length - 1; j++) {
        const [r0, h0] = prof[j], [r1, h1] = prof[j + 1]
        const P = (r: number, z: number, dd: number, side: number): V3 => [(r + dd) * c - side * 0.09 * s, DY + (r + dd) * s + side * 0.09 * c, z + dd * 0.5]
        qf(k.dome, P(r0, h0, 0.12, -1), P(r0, h0, 0.12, 1), P(r1, h1, 0.12, 1), P(r1, h1, 0.12, -1), [c, s, 0.6])
      }
    }
  }
}

/** A smooth-shaded lathe (radius, z) about (cx, cy), uncapped. */
function smoothLathe(p: Part, prof: [number, number][], seg: number, cx: number, cy: number) {
  const nr = prof.map((_, i) => {
    const [r0, z0] = prof[Math.max(0, i - 1)], [r1, z1] = prof[Math.min(prof.length - 1, i + 1)]
    const l = Math.hypot(z1 - z0, r1 - r0) || 1
    return [(z1 - z0) / l, -(r1 - r0) / l] as XY
  })
  for (let k = 0; k < seg; k++) {
    const a = TAU * k / seg, b = TAU * (k + 1) / seg
    const P = ([r, z]: [number, number], t: number): V3 => [cx + r * Math.cos(t), cy + r * Math.sin(t), z]
    const N = (n: XY, t: number): V3 => [n[0] * Math.cos(t), n[0] * Math.sin(t), n[1]]
    for (let i = 0; i < prof.length - 1; i++) {
      p.tri(P(prof[i], a), P(prof[i], b), P(prof[i + 1], b), undefined, undefined, undefined, [N(nr[i], a), N(nr[i], b), N(nr[i + 1], b)])
      p.tri(P(prof[i], a), P(prof[i + 1], b), P(prof[i + 1], a), undefined, undefined, undefined, [N(nr[i], a), N(nr[i + 1], b), N(nr[i + 1], a)])
    }
  }
}

// ---- The clock tower ---------------------------------------------------------------------

const T_BLOCK = 33.1, T_SHAFT = 62.5, T_BELL0 = 65.3, T_BELL1 = 75.3, T_CORN = 77.0, T_PAR = 78.1
const HB = 6.0, HS = 4.5 // half-widths: base block, shaft

function tower(k: K) {
  const cy = TY
  // Base block, from the roof to the shaft, with a cornice and corner scrolls.
  bx(k.sand, -HB, HB, cy - HB, cy + HB, Z_A - 0.6, T_BLOCK - 0.8, { c: k.d ? 0.2 : 0, top: false })
  bx(k.sand, -HB - 0.4, HB + 0.4, cy - HB - 0.4, cy + HB + 0.4, T_BLOCK - 0.8, T_BLOCK, { b: 0.2, bottom: true })
  // A plinth course where the shaft starts.
  bx(k.sand, -HS - 0.35, HS + 0.35, cy - HS - 0.35, cy + HS + 0.35, T_BLOCK, T_BLOCK + 1.2, { b: 0.15 })
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    // Scroll consoles leaning on the shaft's corners (the acroteria-like volutes).
    const x = sx * (HS + 0.35), y = cy + sy * (HS + 0.35)
    const lo: V3[] = [[x, y, T_BLOCK], [x + sx * 1.4, y, T_BLOCK], [x + sx * 1.4, y + sy * 1.4, T_BLOCK], [x, y + sy * 1.4, T_BLOCK]]
    const hi: V3[] = lo.map(([px, py]) => [x + (px - x) * 0.15, y + (py - y) * 0.15, T_BLOCK + 2.2])
    solidLoft(k.sand, [lo, hi])
    if (k.d) ellipsoid(k.sand, [x + sx * 0.75, y + sy * 0.75, T_BLOCK + 0.9], [0.45, 0.45, 0.45], 6, 3)
  }
  // The shaft, with a slight chamfer at the corners.
  bx(k.sand, -HS, HS, cy - HS, cy + HS, T_BLOCK + 1.2, T_SHAFT, { c: 0.15, top: false })
  if (k.d) {
    // Rustication: shallow horizontal grooves read as bands every 2.4 m.
    for (let z = T_BLOCK + 3.6; z < 46; z += 3.2)
      bx(k.sand, -HS - 0.06, HS + 0.06, cy - HS - 0.06, cy + HS + 0.06, z, z + 0.12, { top: false, c: 0.15 })
    // The panel framing the clock: a raised border.
    for (const f of shaftFaces(cy, HS)) {
      fblock(k.sand, f, 0.5, 0.95, 47.6, 60.2, 0, 0.12)
      fblock(k.sand, f, f.len - 0.95, f.len - 0.5, 47.6, 60.2, 0, 0.12)
      fblock(k.sand, f, 0.5, f.len - 0.5, 47.2, 47.6, 0, 0.12)
    }
  }
  // Clock faces: a stone ring and the lit dial on each face.
  const ZCL = S + 51.8, RC = 2.4
  for (const f of shaftFaces(cy, HS)) clockFace(k, f, f.len / 2, ZCL, RC)
  // The stage under the belfry: string course, balustraded band, cornice.
  bx(k.sand, -HS - 0.35, HS + 0.35, cy - HS - 0.35, cy + HS + 0.35, T_SHAFT, T_SHAFT + 0.5, { bottom: true, b: 0.1 })
  bx(k.sand, -HS, HS, cy - HS, cy + HS, T_SHAFT + 0.5, T_BELL0 - 0.7, { top: false })
  for (const f of shaftFaces(cy, HS)) {
    // Three sunk balustrade panels per face, real recesses: the frame stands proud.
    const zb0 = T_SHAFT + 0.8, zb1 = T_BELL0 - 1.0
    fblock(k.sand, f, 0, f.len, zb0 - 0.3, zb0, 0, 0.25, true)
    if (!k.d) { fblock(k.sand, f, 0, f.len, zb1, zb1 + 0.3, 0, 0.25); continue }
    for (const s of [0, 0.32, 0.68, 1]) fblock(k.sand, f, s * f.len - 0.25 + (s === 0 ? 0.25 : 0) - (s === 1 ? 0.25 : 0), s * f.len + 0.25 + (s === 0 ? 0.25 : 0) - (s === 1 ? 0.25 : 0), zb0, zb1, 0, 0.25)
    fblock(k.sand, f, 0, f.len, zb1, zb1 + 0.3, 0, 0.25)
    if (k.d) for (let i = 0; i < 3; i++) {
      const a = f.len * [0, 0.32, 0.68][i] + 0.3, b = f.len * [0.32, 0.68, 1][i] - 0.3
      const nb = Math.round((b - a) / 0.6)
      for (let j = 0; j < nb; j++) {
        const s = a + (j + 0.5) * (b - a) / nb, p = fpt(f, s, 0, 0.12)
        lathe(k.sand, [[0.13, zb0 + 0.25], [0.07, zb0 + 0.7], [0.08, zb1]], 5, p[0], p[1], false)
      }
    }
  }
  bx(k.sand, -HS - 0.45, HS + 0.45, cy - HS - 0.45, cy + HS + 0.45, T_BELL0 - 0.7, T_BELL0, { bottom: true, b: 0.15 })
  belfry(k, cy)
  // Cornice in two steps, the balustrade parapet with corner pedestals and balls.
  bx(k.sand, -HS - 0.2, HS + 0.2, cy - HS - 0.2, cy + HS + 0.2, T_BELL1, T_BELL1 + 0.8, { bottom: true })
  bx(k.sand, -HS - 0.75, HS + 0.75, cy - HS - 0.75, cy + HS + 0.75, T_BELL1 + 0.8, T_CORN, { bottom: true, b: 0.2 })
  if (k.d) for (const f of shaftFaces(cy, HS + 0.2)) {
    const n = Math.floor(f.len / 0.5)
    for (let i = 0; i < n; i++) fblock(k.sand, f, 0.1 + i * 0.5, 0.35 + i * 0.5, T_BELL1 + 0.45, T_BELL1 + 0.8, 0, 0.3, true)
  }
  const HPa = HS + 0.35
  for (const f of shaftFaces(cy, HPa)) {
    if (k.d) {
      const nb = Math.floor((f.len - 2) / 0.45)
      for (let j = 0; j < nb; j++) {
        const s = 1 + (j + 0.5) * (f.len - 2) / nb, p = fpt(f, s, 0, -0.2)
        lathe(k.sand, [[0.12, T_CORN + 0.2], [0.07, T_CORN + 0.55], [0.08, T_PAR - 0.2]], 5, p[0], p[1], false)
      }
    } else fblock(k.sand, f, 1, f.len - 1, T_CORN, T_PAR - 0.2, -0.35, -0.1)
    fblock(k.sand, f, 0, f.len, T_PAR - 0.2, T_PAR, -0.45, 0.05, true)
  }
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const x = sx * (HPa - 0.5), y = cy + sy * (HPa - 0.5)
    bx(k.sand, x - 0.55, x + 0.55, y - 0.55, y + 0.55, T_CORN, T_PAR + 0.3, { b: k.d ? 0.08 : 0 })
    ellipsoid(k.sand, [x, y, T_PAR + 0.75], [0.45, 0.45, 0.45], k.d ? 8 : 5, k.d ? 4 : 3)
  }
  spire(k, cy)
}

/** The four faces of a square about (0, cy), half-width h, counter-clockwise (outward normals). */
function shaftFaces(cy: number, h: number): Face[] {
  const c: XY[] = [[-h, cy - h], [h, cy - h], [h, cy + h], [-h, cy + h]]
  return c.map((a, i) => faceOf(a, c[(i + 1) % 4]))
}

/** A clock: a raised stone ring, the dial (lit at night), and in the detail the hands and hour marks. */
function clockFace(k: K, f: Face, s: number, z: number, r: number) {
  const n = k.d ? 24 : 10
  const P = (rr: number, a: number, d: number) => fpt(f, s + rr * Math.cos(a), z + rr * Math.sin(a), d)
  const N: V3 = [f.n[0], f.n[1], 0]
  for (let i = 0; i < n; i++) {
    const a0 = TAU * i / n, a1 = TAU * (i + 1) / n
    tf(k.clock, P(0, 0, 0.12), P(r, a0, 0.12), P(r, a1, 0.12), N)
    qf(k.sand, P(r, a0, 0.3), P(r + 0.4, a0, 0.3), P(r + 0.4, a1, 0.3), P(r, a1, 0.3), N)
    if (!k.d) continue
    const am = (a0 + a1) / 2
    qf(k.sand, P(r + 0.4, a0, 0), P(r + 0.4, a1, 0), P(r + 0.4, a1, 0.3), P(r + 0.4, a0, 0.3), [Math.cos(am) * f.u[0], Math.cos(am) * f.u[1], Math.sin(am)])
    qf(k.sand, P(r, a0, 0.12), P(r, a1, 0.12), P(r, a1, 0.3), P(r, a0, 0.3), [-Math.cos(am) * f.u[0], -Math.cos(am) * f.u[1], -Math.sin(am)])
  }
  if (!k.d) return
  // Hour marks and the hands (ten past ten), in the window slate.
  for (let i = 0; i < 12; i++) {
    const a = TAU * i / 12, c = Math.cos(a), sn = Math.sin(a), w = 0.07
    const A = (rr: number, side: number) => fpt(f, s + rr * c - side * w * sn, z + rr * sn + side * w * c, 0.16)
    qf(k.win, A(r - 0.55, -1), A(r - 0.55, 1), A(r - 0.12, 1), A(r - 0.12, -1), N)
  }
  for (const [a, l, w] of [[TAU * 0.25 - TAU * 10.17 / 12, 1.25, 0.12], [TAU * 0.25 - TAU * 2 / 12, 2.0, 0.08]] as const) {
    const c = Math.cos(a), sn = Math.sin(a)
    const A = (rr: number, side: number) => fpt(f, s + rr * c - side * w * sn, z + rr * sn + side * w * c, 0.2)
    qf(k.win, A(-0.25, -1), A(-0.25, 1), A(l, 1), A(l, -1), N)
  }
}

/** The open belfry: corner piers, four columns a face, the bell chamber's dark core. */
function belfry(k: K, cy: number) {
  const h = HS - 0.1, z0 = T_BELL0, z1 = T_BELL1, P = 1.5
  // Corner piers, L-shaped in plan: two boxes each.
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    bx(k.sand, sx * h, sx * (h - P), cy + sy * h, cy + sy * (h - 0.6), z0, z1, { top: false, c: k.d ? 0.08 : 0 })
    bx(k.sand, sx * h, sx * (h - 0.6), cy + sy * h, cy + sy * (h - P), z0, z1, { top: false, c: k.d ? 0.08 : 0 })
  }
  // Four columns a face on a low plinth, arcade-free (the entablature spans them).
  for (const f of shaftFaces(cy, h)) {
    for (let i = 1; i <= 4; i++) {
      const s = P + (f.len - 2 * P) * (i - 0.5) / 4
      const p = fpt(f, s, 0, -0.45)
      if (k.d) bx(k.sand, p[0] - 0.42, p[0] + 0.42, p[1] - 0.42, p[1] + 0.42, z0, z0 + 0.5, { b: 0.06 })
      if (k.d) ionic({ hi: true, seg: 8 }, k.sand, k.sand, p[0], p[1], z0 + 0.5, z1 - 0.9, 0.3, [Math.abs(f.u[0]), Math.abs(f.u[1])])
      else { cylinder(k.sand, p[0], p[1], 0.36, z0, z1 - 1.3, 5, 0.3); bx(k.sand, p[0] - 0.45, p[0] + 0.45, p[1] - 0.45, p[1] + 0.45, z1 - 1.3, z1 - 0.9, { top: false }) }
    }
    // Architrave band over the openings.
    fblock(k.sand, f, P, f.len - P, z1 - 0.9, z1, -0.9, 0, true)
    // Sill under the openings.
    fblock(k.sand, f, P, f.len - P, z0 - 0.05, z0 + 0.15, -0.9, 0.05)
  }
  // The bell chamber: a dark core well inside the columns, and its floor.
  bx(k.win, -h + 1.5, h - 1.5, cy - h + 1.5, cy + h - 1.5, z0, z1 - 0.9, { top: false })
  bx(k.sand, -h + 0.6, h - 0.6, cy - h + 0.6, cy + h - 0.6, z0 - 0.1, z0 + 0.1, { top: true })
  bx(k.sand, -h, h, cy - h, cy + h, z1 - 0.95, z1 - 0.9, { bottom: true, top: false })
  if (k.d) {
    // The bells' frame: the diamond lattice seen through the columns.
    for (const f of shaftFaces(cy, h - 1.5)) {
      const m = f.len / 2, zc = (z0 + z1) / 2 - 0.4
      for (const [a, b] of [[[m - 2.2, zc], [m, zc + 2.6]], [[m, zc + 2.6], [m + 2.2, zc]], [[m + 2.2, zc], [m, zc - 2.6]], [[m, zc - 2.6], [m - 2.2, zc]]] as [XY, XY][]) {
        const A = fpt(f, a[0], a[1], 0.15), B = fpt(f, b[0], b[1], 0.15)
        const dx = b[0] - a[0], dz = b[1] - a[1], L = Math.hypot(dx, dz), ex = -dz / L * 0.12, ez = dx / L * 0.12
        const E = (pt: V3, sg: number): V3 => [pt[0] + f.u[0] * ex * sg, pt[1] + f.u[1] * ex * sg, pt[2] + ez * sg]
        qf(k.sand, E(A, -1), E(B, -1), E(B, 1), E(A, 1), [f.n[0], f.n[1], 0])
      }
    }
  }
}

/** The copper pyramid, bellcast at the foot, its stem and the armillary sphere. */
function spire(k: K, cy: number) {
  const z0 = T_PAR - 0.1, zA = 87.4
  const sq = (h: number, z: number): V3[] => [[-h, cy - h, z], [h, cy - h, z], [h, cy + h, z], [-h, cy + h, z]]
  const rings = [sq(4.35, z0), sq(4.0, z0 + 0.6), sq(3.55, z0 + 1.6), sq(0.45, zA - 0.3)]
  solidLoft(k.patina, rings)
  if (k.d) {
    // Hip rolls along the four arrises and a ring of standing seams.
    for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
      const a: V3 = [sx * 4.3, cy + sy * 4.3, z0 + 0.05], b: V3 = [sx * 0.45, cy + sy * 0.45, zA - 0.3]
      tubeAlong(k.patina, a, b, 0.14, 5)
    }
  }
  // Stem, a collar, the sphere (two crossed rings and a ball in the detail).
  cylinder(k.patina, 0, cy, 0.42, zA - 0.4, zA + 0.5, 8, 0.3)
  lathe(k.patina, [[0.3, zA + 0.5], [0.55, zA + 0.65], [0.25, zA + 0.8]], 8, 0, cy, true)
  const zs = zA + 1.55
  if (k.d) {
    for (const ax of [0, 1, 2]) torus(k.patina, [0, cy, zs], 0.72, 0.07, ax)
    ellipsoid(k.patina, [0, cy, zs], [0.3, 0.3, 0.3], 8, 4)
    cylinder(k.patina, 0, cy, 0.06, zs + 0.7, zs + 1.25, 5)
  } else ellipsoid(k.patina, [0, cy, zs], [0.72, 0.72, 0.72], 6, 4)
}

/** A thin round bar from a to b. */
function tubeAlong(p: Part, a: V3, b: V3, r: number, n: number) {
  const d: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], L = Math.hypot(...d)
  const u: V3 = [d[0] / L, d[1] / L, d[2] / L]
  let e: V3 = [-u[1], u[0], 0]
  if (Math.hypot(...e) < 1e-3) e = [1, 0, 0]
  const el = Math.hypot(...e); e = [e[0] / el, e[1] / el, e[2] / el]
  const f: V3 = [u[1] * e[2] - u[2] * e[1], u[2] * e[0] - u[0] * e[2], u[0] * e[1] - u[1] * e[0]]
  const R = (c: V3, a: number): V3 => [c[0] + r * (Math.cos(a) * e[0] + Math.sin(a) * f[0]), c[1] + r * (Math.cos(a) * e[1] + Math.sin(a) * f[1]), c[2] + r * (Math.cos(a) * e[2] + Math.sin(a) * f[2])]
  for (let i = 0; i < n; i++) {
    const a0 = TAU * i / n, a1 = TAU * (i + 1) / n
    const N = (a: number): V3 => [Math.cos(a) * e[0] + Math.sin(a) * f[0], Math.cos(a) * e[1] + Math.sin(a) * f[1], Math.cos(a) * e[2] + Math.sin(a) * f[2]]
    p.tri(R(a, a0), R(a, a1), R(b, a1), undefined, undefined, undefined, [N(a0), N(a1), N(a1)])
    p.tri(R(a, a0), R(b, a1), R(b, a0), undefined, undefined, undefined, [N(a0), N(a1), N(a0)])
  }
}

/** A ring of round section about centre c, radius R, bar r, its axis along x, y or z. */
function torus(p: Part, c: V3, R: number, r: number, axis: number) {
  const n = 12, m = 4
  const P = (a: number, b: number): [V3, V3] => {
    const cr = R + r * Math.cos(b), z = r * Math.sin(b)
    const loc: V3 = [cr * Math.cos(a), cr * Math.sin(a), z], nl: V3 = [Math.cos(b) * Math.cos(a), Math.cos(b) * Math.sin(a), Math.sin(b)]
    const sw = (v: V3): V3 => axis === 2 ? v : axis === 0 ? [v[2], v[0], v[1]] : [v[0], v[2], v[1]]
    const w = sw(loc)
    return [[c[0] + w[0], c[1] + w[1], c[2] + w[2]], sw(nl)]
  }
  for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) {
    const a0 = TAU * i / n, a1 = TAU * (i + 1) / n, b0 = TAU * j / m, b1 = TAU * (j + 1) / m
    const [A, nA] = P(a0, b0), [B, nB] = P(a1, b0), [C, nC] = P(a1, b1), [D, nD] = P(a0, b1)
    p.tri(A, B, C, undefined, undefined, undefined, [nA, nB, nC])
    p.tri(A, C, D, undefined, undefined, undefined, [nA, nC, nD])
  }
}

/** A closed loft through square-ish rings (CCW from above), capped on top. */
function solidLoft(p: Part, rings: V3[][]) {
  p.loft(rings)
  p.cap(rings[rings.length - 1], true)
}

// ---- Build ---------------------------------------------------------------------------------

function build(d: boolean): K {
  const k: K = { sand: new Part(), roof: new Part(), win: new Part(), patina: new Part(), dome: new Part(), clock: new Part(), L: { hi: d, seg: d ? 12 : 8 }, d }
  const tot = () => [k.sand, k.roof, k.win, k.patina, k.dome, k.clock].reduce((t, p) => t + p.triangles, 0)
  let last = 0
  const step = (name: string, f: () => void) => { f(); if (process.env.DEBUG) console.log(name, tot() - last); last = tot() }
  step('portico', () => portico(k))
  step('sides', () => sides(k))
  step('dome', () => dome(k))
  step('tower', () => tower(k))
  return k
}

// Night: floodlit from the square and the streets, all round; faces looking up barely.
const sandLit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.3 : 0.95) * (p[2] > 62 ? 0.85 : 1)
const SAND: MaterialSpec = { ...finish('helidon-sandstone', 0xdcbd94), floodlight: sandLit }
const PATINA: MaterialSpec = { ...finish('spire-copper', 0x6f8b83), floodlight: (_p, n) => (n[2] > 0.9 ? 0.2 : 0.55) }
const DOME = finish('dome-copper', 0x85776e)
const CLOCK = finish('neon-clock', 0xefe7d4)

const parts = (k: K) => [
  { part: k.sand, material: SAND },
  { part: k.roof, material: PALETTE.roof },
  { part: k.win, material: PALETTE.window },
  { part: k.patina, material: PATINA },
  { part: k.dome, material: DOME },
  { part: k.clock, material: CLOCK },
]

if (import.meta.main) {
  const extras = { bearing: BEARING, anchor: [153.023484, -27.468965], kingGeorgeSquare: S }
  writeModel('Brisbane City Hall', ID, parts(build(false)), extras, 6500)
  writeModel('Brisbane City Hall', ID, parts(build(true)), extras, 40000, `${ID}.detail`)
}
