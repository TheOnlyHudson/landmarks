/**
 * Caesars New Orleans casino (1999 as Harrah's New Orleans; reclad and
 * renamed Caesars in 2024), 8 Canal Street, New Orleans — procedural, CC0-1.0.
 * bun generators/nola-harrahs.ts
 *
 * Identity: the long casino at the foot of Canal Street under its three
 * green metal gable roofs (the big central hall, the Canal Street hall and
 * the Poydras hall) with two green-domed cupolas on the central ridge; the
 * cream-stone temple front toward Canal Street since the 2024 renovation:
 * a low pediment with a gold laurel medallion, the gold "CAESARS" letters on
 * the frieze wall, an attic band of small windows, and six columns before
 * five gold-framed bays over a wide flight of steps; gold-framed bays with
 * pale sign panels all round the ground storey.
 *
 * Not modelled: the new hotel tower (opened 2024) on the east, where OSM
 * still maps a three-storey part (way/331120088, under construction in the
 * 2023 NAIP image), the 2006 hotel tower across Poydras (way/328669264) and
 * the garage. OSM has no outline way for the casino: way/331115230 is a
 * building:part covering the whole block, and `replaces` lists it with
 * every part the model covers.
 *
 * Frame: bearing 334 (the halls' long axis; +y toward Canal Street),
 * origin at the centroid of way/331115230 (-90.065131 29.949360). y = 0 is
 * the street; the terrain is flat (lidar ground within 1 m).
 *
 * Evidence
 * - OSM: way/331115230 and its parts (heights 9 to 29 m; most are wrong
 *   against the lidar and are not used).
 * - Lidar: USGS 3DEP LA_2021GNO_1_C22 (2021-22), 1 m grid, read in the
 *   frame: the central hall's ridge 35.2 and eaves 20.1 (57 m span); the
 *   Canal Street hall's ridge 26.6, eaves 21; the Poydras hall's ridge
 *   26.1, eaves 19.8; the flat wings 15.4 and 12.9; the cupolas' tops 45.
 *   The 2024 recladding changed the walls, not the roofs (the 2026 photos
 *   show the same green gables and dome).
 * - USGS NAIP 2023-05-04: the plan, the green standing-seam roofs and the
 *   two cupolas, the dark flat roofs.
 * - Photos (Wikimedia Commons), all EVIDENCE:
 *   - "Caesars New Orleans February 2026.jpg", ajay_suresh, CC BY 4.0
 *     (from Canal at Tchoupitoulas): the temple front, the Canal Street
 *     wing, the cupola
 *     https://commons.wikimedia.org/wiki/File:Caesars_New_Orleans_February_2026.jpg
 *   - "Caesar's Casino, New Orleans, 26 May 2026 - 1" to "- 10",
 *     Infrogmation, CC BY-SA 4.0: the front, the columns and bays, the
 *     letters (No. 10), the gold-framed ground storey (No. 2, 6), the
 *     pediment and its green rake
 *     https://commons.wikimedia.org/wiki/File:Caesar%27s_Casino,_New_Orleans,_26_May_2026_-_10.jpg
 *     https://commons.wikimedia.org/wiki/File:Caesar%27s_Casino,_New_Orleans,_26_May_2026_-_2.jpg
 *     https://commons.wikimedia.org/wiki/File:Caesar%27s_Casino,_New_Orleans,_26_May_2026_-_7.jpg
 *   - "Harrah's New Orleans, exterior, August 2021 - 01.jpg", Infrogmation
 *     of New Orleans, CC BY-SA 4.0: the roofs and cupola before the
 *     recladding (for the roof forms only)
 *     https://commons.wikimedia.org/wiki/File:Harrah%27s_New_Orleans,_exterior,_August_2021_-_01.jpg
 *
 * Measured: the plan (OSM, NAIP), every roof and wing height (lidar).
 * Estimated from the photos: the front's storeys (podium 1.5, columns to
 * 10, entablature to 12, frieze wall with the letters to 17.5, attic band
 * to 20.6, pediment to the ridge), the bays (five, 3.8 m), the columns
 * (r 0.55), the letters (1.9 m tall, about 15 m long), the ground-storey
 * bays round the other faces (7 m apart, frames to 9 m), the cupolas'
 * drums (r 3.5).
 * Lettering: "CAESARS" (the sign is the casino's name on its front),
 * traced as the photo's flared capitals with the A drawn as a bare chevron.
 * Left out: the medallion's head and laurel (a gold ring), the "CASINO"
 * panel lettering, the porte-cochère, railings, palms.
 *
 * Doubts: no post-2024 photo of the Poydras (south) and river-side faces;
 * they are given the same gold-framed ground storey, and the Poydras hall's
 * gable a plain pediment. The old OSM part heights disagree with the lidar
 * everywhere; the lidar is used.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { prism, circle, toFrame, capPoly, offset, save, type XY } from './atl-flatiron-building'
import { faceOf, fpanel, fblock, fprism, qf, tf, shaft, drum } from './nola-gallier-hall'
import { Pen, strokes, type Pt } from './lettering'

const ANCHOR = { lng: -90.065131, lat: 29.94936 }, BEARING = 334
const OSM: Record<string, [number, number][]> = {
  '331120095': [[-90.0643732, 29.9490049], [-90.0644905, 29.9489461], [-90.0643987, 29.9487794], [-90.0643403, 29.9488114], [-90.0644051, 29.9489282], [-90.0643442, 29.9489595], [-90.0643732, 29.9490049]],
  '331115230': [[-90.0655554, 29.9503972], [-90.0655779, 29.9503855], [-90.0658365, 29.9502513], [-90.0658611, 29.9502385], [-90.0658343, 29.9501915], [-90.0658573, 29.9501817], [-90.0657907, 29.9500651], [-90.0654985, 29.9495562], [-90.0657794, 29.9494108], [-90.06576, 29.949377], [-90.0657979, 29.9493607], [-90.0656906, 29.9491758], [-90.0657144, 29.9491649], [-90.0656845, 29.9491121], [-90.0657448, 29.949084], [-90.0657304, 29.9490581], [-90.0656896, 29.949077], [-90.0655901, 29.9488988], [-90.0656271, 29.9488824], [-90.0656133, 29.9488572], [-90.0655558, 29.948885], [-90.0655246, 29.9488303], [-90.0655019, 29.9488425], [-90.0653821, 29.948629], [-90.0652676, 29.9486855], [-90.0652397, 29.9486996], [-90.0648936, 29.9488768], [-90.0648793, 29.9488527], [-90.0647099, 29.9485504], [-90.0646743, 29.9484915], [-90.0646238, 29.9485176], [-90.0643756, 29.948646], [-90.0643347, 29.9486672], [-90.0643987, 29.9487794], [-90.0644905, 29.9489461], [-90.0643732, 29.9490049], [-90.0643496, 29.9490167], [-90.0644119, 29.9491259], [-90.0647524, 29.9497355], [-90.0649021, 29.9499984], [-90.0649848, 29.9499585], [-90.0652124, 29.9498422], [-90.065469, 29.9502987], [-90.0655067, 29.9503647], [-90.0655295, 29.9503518], [-90.0655554, 29.9503972]],
  '331120097': [[-90.065469, 29.9502987], [-90.0654082, 29.9503248], [-90.0653339, 29.9501948], [-90.0652506, 29.9500488], [-90.0651051, 29.9501273], [-90.065086, 29.9501355], [-90.0649848, 29.9499585], [-90.0652124, 29.9498422], [-90.065469, 29.9502987]],
  '331125063': [[-90.0652506, 29.9500488], [-90.0653339, 29.9501948], [-90.0653184, 29.9501988], [-90.0653025, 29.9502017], [-90.0652863, 29.9502035], [-90.0652701, 29.9502041], [-90.0652539, 29.9502035], [-90.0652377, 29.9502018], [-90.0652218, 29.9501989], [-90.0652062, 29.950195], [-90.0651911, 29.9501899], [-90.0651764, 29.9501837], [-90.0651625, 29.9501766], [-90.0651492, 29.9501684], [-90.0651368, 29.9501594], [-90.0651252, 29.9501495], [-90.0651146, 29.9501387], [-90.0651051, 29.9501273], [-90.0652506, 29.9500488]],
  '331120098': [[-90.0657794, 29.9494108], [-90.0658417, 29.94952], [-90.0657863, 29.9495478], [-90.0656184, 29.9496317], [-90.0658051, 29.9499544], [-90.065853, 29.9500383], [-90.0657907, 29.9500651], [-90.0654985, 29.9495562], [-90.0657794, 29.9494108]],
  '331125061': [[-90.0658051, 29.9499544], [-90.0658488, 29.9499356], [-90.0658198, 29.9498849], [-90.0658482, 29.9498727], [-90.0657757, 29.9497457], [-90.0658354, 29.9497201], [-90.0658043, 29.9496658], [-90.0658439, 29.9496488], [-90.0657863, 29.9495478], [-90.0656184, 29.9496317], [-90.0658051, 29.9499544]],
  '331120087': [[-90.0647099, 29.9485504], [-90.0648239, 29.9484955], [-90.0648541, 29.9485484], [-90.0649143, 29.9485211], [-90.0649563, 29.9485946], [-90.064968, 29.9486175], [-90.0649833, 29.9486113], [-90.0649993, 29.9486062], [-90.0650156, 29.9486024], [-90.0650323, 29.9485998], [-90.0650492, 29.9485984], [-90.0650662, 29.9485983], [-90.0650831, 29.9485994], [-90.0650998, 29.9486019], [-90.0651162, 29.9486055], [-90.0651323, 29.9486103], [-90.0651477, 29.9486163], [-90.0651626, 29.9486235], [-90.0651766, 29.9486317], [-90.0651898, 29.9486409], [-90.0652021, 29.9486511], [-90.0652133, 29.9486621], [-90.0652233, 29.9486739], [-90.0652322, 29.9486865], [-90.0652397, 29.9486996], [-90.0648936, 29.9488768], [-90.0648793, 29.9488527], [-90.0647099, 29.9485504]],
  '331125055': [[-90.0652676, 29.9486855], [-90.0652475, 29.9486562], [-90.0652234, 29.9486315], [-90.0652017, 29.9486148], [-90.0651802, 29.948602], [-90.0651573, 29.9485914], [-90.0651251, 29.9485809], [-90.065107, 29.948577], [-90.0650822, 29.9485738], [-90.0650557, 29.9485729], [-90.0650292, 29.9485747], [-90.0650059, 29.9485786], [-90.0649849, 29.948584], [-90.0649563, 29.9485946], [-90.064968, 29.9486175], [-90.0649833, 29.9486113], [-90.0649993, 29.9486062], [-90.0650156, 29.9486024], [-90.0650323, 29.9485998], [-90.0650492, 29.9485984], [-90.0650662, 29.9485983], [-90.0650831, 29.9485994], [-90.0650998, 29.9486019], [-90.0651162, 29.9486055], [-90.0651323, 29.9486103], [-90.0651477, 29.9486163], [-90.0651626, 29.9486235], [-90.0651766, 29.9486317], [-90.0651898, 29.9486409], [-90.0652021, 29.9486511], [-90.0652133, 29.9486621], [-90.0652233, 29.9486739], [-90.0652322, 29.9486865], [-90.0652397, 29.9486996], [-90.0652676, 29.9486855]],
  '331120085': [[-90.0646238, 29.9485176], [-90.0643756, 29.948646], [-90.0643558, 29.9486098], [-90.0643607, 29.9485894], [-90.0643781, 29.9485668], [-90.0644082, 29.9485409], [-90.0644323, 29.948525], [-90.0644583, 29.9485075], [-90.0644953, 29.9484927], [-90.064555, 29.9484747], [-90.0645756, 29.9484706], [-90.064595, 29.9484676], [-90.0646238, 29.9485176]],
  '331120086': [[-90.065582, 29.9488004], [-90.0656109, 29.9487866], [-90.0656253, 29.9487912], [-90.0656527, 29.9487795], [-90.0656828, 29.9488041], [-90.0657104, 29.9488307], [-90.0657355, 29.9488593], [-90.0657577, 29.9488895], [-90.065777, 29.9489212], [-90.0657932, 29.9489542], [-90.0658062, 29.9489882], [-90.065816, 29.9490231], [-90.0658224, 29.9490585], [-90.0658254, 29.9490942], [-90.0658057, 29.9491024], [-90.0658057, 29.9491242], [-90.0657746, 29.9491377], [-90.0657448, 29.949084], [-90.0657304, 29.9490581], [-90.0656896, 29.949077], [-90.0655901, 29.9488988], [-90.0656271, 29.9488824], [-90.065582, 29.9488004]],
  '331120090': [[-90.0655019, 29.9488425], [-90.0654417, 29.9487335], [-90.0655097, 29.9487018], [-90.0655694, 29.9488063], [-90.0655246, 29.9488303], [-90.0655019, 29.9488425]],
  '331120093': [[-90.0657929, 29.9492081], [-90.0657571, 29.9491454], [-90.0657144, 29.9491649], [-90.0656906, 29.9491758], [-90.0657278, 29.9492379], [-90.0657929, 29.9492081]],
  '331120091': [[-90.0656133, 29.9488572], [-90.065582, 29.9488004], [-90.0655694, 29.9488063], [-90.0655246, 29.9488303], [-90.0655558, 29.948885], [-90.0656133, 29.9488572]],
  '331120092': [[-90.0657144, 29.9491649], [-90.0657571, 29.9491454], [-90.0657746, 29.9491377], [-90.0657448, 29.949084], [-90.0656845, 29.9491121], [-90.0657144, 29.9491649]],
  '331120089': [[-90.0658365, 29.9502513], [-90.0655779, 29.9503855], [-90.0655967, 29.9504184], [-90.0656426, 29.9503954], [-90.0658576, 29.9502882], [-90.0658365, 29.9502513]],
  '482906822': [[-90.0658481, 29.9502926], [-90.065862, 29.9503126], [-90.0658528, 29.95032], [-90.0658411, 29.9503298], [-90.0658236, 29.9503445], [-90.0657993, 29.9503625], [-90.0657653, 29.950385], [-90.0657261, 29.9503981], [-90.0656909, 29.9504043], [-90.0656698, 29.950406], [-90.0656473, 29.9504017], [-90.0656426, 29.9503954], [-90.0658481, 29.9502926]],
}

const F = (id: string) => toFrame(OSM[id], ANCHOR, BEARING)
const stone = new Part(), trim = new Part(), gold = new Part(), green = new Part(), flat = new Part(), win = new Part()
const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

// ───────────────────────────── the flat wings ─────────────────────────────

const WEST: XY[] = [[-19.1, -57.3], [-20, 32.6], [-53.8, 32.5], [-53.7, 28.3], [-57.8, 28.3], [-57.4, 5.4], [-62.1, 5.3], [-62.1, -26.4], [-59.8, -29.2], [-59.8, -36], [-57.2, -35.7], [-57.2, -62], [-41.4, -61]].reverse() as XY[]
const EAST: XY[] = [[38.8, -51], [51, -53.7], [51, 53.7], [16.3, 51.3], [16.2, 41.3], [22.3, 41.3], [22.6, 33.8], [38.8, 34.3]]
const FLATS: Array<[XY[], number]> = [
  [F('331115230'), 12.9],
  [F('331120097'), 12.9], [F('331125063'), 12.0], [F('331120098'), 12.9], [F('331125061'), 11.9],
  [F('331120087'), 12.9], [F('331125055'), 9.0], [F('331120085'), 10.0], [F('331120086'), 13.7],
  [F('331120090'), 13.7], [F('331120093'), 13.7], [F('331120091'), 21.6], [F('331120092'), 21.6],
  [F('331120095'), 12.9],
]
for (const [ring, h] of FLATS) prism(stone, ring, 0, h, flat, 0.3)
prism(stone, WEST, 12.5, 15.4, flat, 0.3)
prism(stone, EAST, 12.5, 15.4, flat, 0.3)
// the Canal Street hall's flanks
prism(stone, rect(-23, -17.5, 41, 112), 12.5, 15.4, flat, 0.3)
prism(stone, rect(10.5, 16.2, 41, 112), 12.5, 15.4, flat, 0.3)

// ───────────────────────────── the three gabled halls ─────────────────────────────

/** A hall: walls to the eaves, two green slopes overhanging `o`, stone gable ends. */
function hall(x0: number, x1: number, y0: number, y1: number, ze: number, zr: number, o = 0.6, z0 = 12.5) {
  prism(stone, rect(x0, x1, y0, y1), z0, ze, null, 0)
  const xm = (x0 + x1) / 2, s = (zr - ze) / (xm - x0), t = 0.35
  for (const y of [y0, y1]) tf(stone, [x0, y, ze], [x1, y, ze], [xm, y, zr], [0, y === y0 ? -1 : 1, 0])
  for (const side of [-1, 1]) {
    const xe = side < 0 ? x0 - o : x1 + o, ze2 = ze - o * s
    const n: V3 = [side * s, 0, 1]
    qf(green, [xe, y0 - o, ze2], [xm, y0 - o, zr + 0.02], [xm, y1 + o, zr + 0.02], [xe, y1 + o, ze2], n)
    qf(green, [xe, y0 - o, ze2 - t], [xm, y0 - o, zr - t], [xm, y1 + o, zr - t], [xe, y1 + o, ze2 - t], [-n[0], 0, -1]) // soffit
    qf(green, [xe, y0 - o, ze2 - t], [xe, y1 + o, ze2 - t], [xe, y1 + o, ze2], [xe, y0 - o, ze2], [side, 0, 0]) // fascia
    for (const y of [y0 - o, y1 + o]) qf(green, [xe, y, ze2 - t], [xm, y, zr - t], [xm, y, zr + 0.02], [xe, y, ze2], [0, y < y0 ? -1 : 1, 0]) // rake edge
  }
  // a cornice band along the eaves
  for (const x of [x0, x1]) prism(trim, rect(x - 0.35, x + 0.35, y0, y1), ze - 0.7, ze - 0.1, trim, 0.1)
}
const H1 = { x0: -17.5, x1: 10.5, y0: 41, y1: 121.0, ze: 21.0, zr: 26.6 }
const H2 = { x0: -19, x1: 38.8, y0: -57.5, y1: 41, ze: 20.1, zr: 35.2 }
const H3 = { x0: -1.5, x1: 32, y0: -103.5, y1: -57.5, ze: 19.8, zr: 26.1 }
hall(H1.x0, H1.x1, H1.y0, H1.y1, H1.ze, H1.zr)
hall(H2.x0, H2.x1, H2.y0, H2.y1, H2.ze, H2.zr, 0.7)
hall(H3.x0, H3.x1, H3.y0, H3.y1, H3.ze, H3.zr)

// attic windows along the halls' long walls, above the flat wings (small dark slots, as on the front)
for (const h of [H1, H2, H3]) {
  for (const [a, b] of [[[h.x1, h.y0], [h.x1, h.y1]], [[h.x0, h.y1], [h.x0, h.y0]]] as [XY, XY][]) {
    const Fc = faceOf(a, b)
    for (let s = 3; s < Fc.L - 3; s += 4.2) fpanel(win, Fc, s, s + 1.8, h.ze - 2.6, h.ze - 1.1)
  }
}

// ───────────────────────────── the cupolas ─────────────────────────────

for (const [cx, cy, zb] of [[10, 31, 31], [9.5, -51, 31]] as [number, number, number][]) {
  const n = 8, R = 3.6, ring = circle([cx, cy], R, n, Math.PI / 8)
  prism(stone, ring, zb, 38.6, null, 0)
  prism(trim, circle([cx, cy], R + 0.4, n, Math.PI / 8), 38.4, 39.1, trim, 0.15)
  for (let i = 0; i < n; i++) fpanel(win, faceOf(ring[i], ring[(i + 1) % n]), 0.6, 2.15, 34.6, 37.6)
  // the dome: a smooth half-sphere in green, and a small lantern
  const rows = 4, segs = 12
  for (let k = 0; k < rows; k++) {
    const a0 = (k / rows) * (Math.PI / 2), a1 = ((k + 1) / rows) * (Math.PI / 2)
    for (let i = 0; i < segs; i++) {
      const b0 = (i / segs) * Math.PI * 2, b1 = ((i + 1) / segs) * Math.PI * 2
      const P = (a: number, b: number): V3 => [cx + 3.7 * Math.cos(a) * Math.cos(b), cy + 3.7 * Math.cos(a) * Math.sin(b), 39.1 + 4.6 * Math.sin(a)]
      const N = (a: number, b: number): V3 => [Math.cos(a) * Math.cos(b), Math.cos(a) * Math.sin(b), Math.sin(a) * 0.8]
      green.tri(P(a0, b0), P(a0, b1), P(a1, b1), undefined, undefined, undefined, [N(a0, b0), N(a0, b1), N(a1, b1)])
      if (k < rows - 1) green.tri(P(a0, b0), P(a1, b1), P(a1, b0), undefined, undefined, undefined, [N(a0, b0), N(a1, b1), N(a1, b0)])
    }
  }
  shaft(green, cx, cy, 0.45, 0.2, 43.4, 45.2, 8)
}

// ───────────────────────────── the temple front on Canal Street ─────────────────────────────

const YF = 121.0, XC = (H1.x0 + H1.x1) / 2
const FRONT = faceOf([13.5, YF], [-20.7, YF]) // outward +y; s runs from x 13.5 toward −x
const S = (x: number) => 13.5 - x
// the frontispiece block, its cornice, the attic band over it
prism(stone, rect(-20.7, 13.5, 108, YF), 0, 17.4, null, 0)
prism(trim, rect(-21.3, 14.1, 107.4, YF + 0.6), 17.3, 18.1, flat, 0.2)
prism(trim, rect(H1.x0 - 0.4, H1.x1 + 0.4, 108, YF + 0.4), 20.5, 21.1, null, 0.15)
for (let x = H1.x0 + 1.4; x < H1.x1 - 1.6; x += 2.9) fpanel(win, FRONT, S(x + 1.7), S(x), 18.7, 20.2, 0.05)
// the pediment: stone tympanum, a pale raking cornice under the green roof edge, the gold medallion
{
  const o = 0.6, sl = (H1.zr - H1.ze) / ((H1.x1 - H1.x0) / 2)
  for (const side of [-1, 1]) {
    const xe = side < 0 ? H1.x0 - 0.3 : H1.x1 + 0.3
    const a: V3 = [xe, YF + 0.25, H1.ze + 0.05], b: V3 = [XC, YF + 0.25, H1.zr - 0.1]
    const d: V3 = [0, 0, -0.55]
    qf(trim, [a[0], a[1], a[2] + d[2]], [b[0], b[1], b[2] + d[2]], b, a, [0, 1, 0])
    qf(trim, [a[0], YF, a[2] + d[2]], [b[0], YF, b[2] + d[2]], [b[0], a[1], b[2] + d[2]], [a[0], a[1], a[2] + d[2]], [0, 0, -1])
    void o; void sl
  }
  // the medallion: a gold ring round a pale disc
  const c: V3 = [XC, YF + 0.12, 23.15], n = 16, r0 = 1.25, r1 = 1.75
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2, b = ((i + 1) / n) * Math.PI * 2
    const P = (r: number, t: number, d = 0): V3 => [c[0] + r * Math.cos(t), c[1] + d, c[2] + r * Math.sin(t)]
    qf(gold, P(r0, a), P(r1, a), P(r1, b), P(r0, b), [0, 1, 0])
    tf(trim, P(0, 0, -0.05), P(r0, a, -0.05), P(r0, b, -0.05), [0, 1, 0])
  }
  fpanel(gold, FRONT, S(XC + 0.45), S(XC - 0.45), 22.55, 23.85, 0.16) // the head, as a gold block
}
// the portico: podium and steps, six columns, entablature; five gold-framed bays behind
{
  const xs = Array.from({ length: 6 }, (_, k) => H1.x0 + 1.2 + k * ((H1.x1 - H1.x0 - 2.4) / 5))
  prism(trim, rect(H1.x0 - 1.0, H1.x1 + 1.0, YF - 0.5, YF + 3.6), 0, 1.5, trim, 0.1)
  for (let k = 0; k < 3; k++) prism(trim, rect(H1.x0 - 1.0 - 0.3 * (k + 1), H1.x1 + 1.0 + 0.3 * (k + 1), YF + 3.6, YF + 4.4 + k * 0.8), 0, 1.5 - (k + 1) * 0.45, trim, 0)
  for (const x of xs) {
    drum(trim, x, YF + 2.4, 0.78, 1.5, 1.9, 12, false)
    shaft(trim, x, YF + 2.4, 0.58, 0.5, 1.9, 9.6, 12)
    prism(trim, rect(x - 0.75, x + 0.75, YF + 1.65, YF + 3.15), 9.6, 10.1, trim, 0.05)
  }
  prism(trim, rect(H1.x0 - 0.6, H1.x1 + 0.6, YF - 0.3, YF + 3.4), 10.1, 12.0, trim, 0.2)
  for (let k = 0; k < 5; k++) {
    const xa = xs[k] + 0.8, xb = xs[k + 1] - 0.8
    const s0 = S(xb), s1 = S(xa)
    fblock(gold, FRONT, s0, s0 + 0.35, 1.5, 9.4, 0.14)
    fblock(gold, FRONT, s1 - 0.35, s1, 1.5, 9.4, 0.14)
    fblock(gold, FRONT, s0, s1, 9.05, 9.4, 0.14)
    fblock(gold, FRONT, s0, s1, 6.1, 6.45, 0.14)
    fpanel(win, FRONT, s0 + 0.35, s1 - 0.35, 1.5, 6.1, 0.06) // the doors
    fpanel(trim, FRONT, s0 + 0.35, s1 - 0.35, 6.45, 9.05, 0.06) // the pale sign panel
    fpanel(gold, FRONT, (s0 + s1) / 2 - 0.5, (s0 + s1) / 2 + 0.5, 7.25, 8.25, 0.1) // its medallion
  }
}
// "CAESARS" across the frieze wall, in gold
{
  const pen = new Pen(), W = 0.78
  const glyph: Record<string, (x: number) => void> = {
    C: (x) => { const p: Pt[] = []; for (let i = 0; i <= 10; i++) { const a = 0.8 + (i / 10) * (2 * Math.PI - 1.6); p.push([x + W / 2 + (W / 2) * Math.cos(a), 0.5 + 0.5 * Math.sin(a)]) } pen.moveTo(p[0]); for (const q of p.slice(1)) pen.lineTo(q) },
    A: (x) => { pen.moveTo([x - 0.02, 0]).lineTo([x + W / 2, 1]).lineTo([x + W + 0.02, 0]) },
    E: (x) => { pen.moveTo([x + W - 0.05, 1]).lineTo([x, 1]).lineTo([x, 0]).lineTo([x + W - 0.05, 0]); pen.moveTo([x, 0.5]).lineTo([x + W * 0.7, 0.5]) },
    S: (x) => { pen.moveTo([x + 0.7, 0.86]).cubicTo([x + 0.56, 1.02], [x + 0.06, 1.02], [x + 0.07, 0.74]).cubicTo([x + 0.08, 0.5], [x + 0.71, 0.52], [x + 0.72, 0.26]).cubicTo([x + 0.73, -0.02], [x + 0.15, -0.02], [x + 0.02, 0.16]) },
    R: (x) => { pen.moveTo([x, 0]).lineTo([x, 1]).lineTo([x + 0.42, 1]).cubicTo([x + 0.78, 1], [x + 0.78, 0.5], [x + 0.42, 0.5]).lineTo([x, 0.5]); pen.moveTo([x + 0.36, 0.5]).lineTo([x + 0.76, 0]) },
  }
  const word = 'CAESARS', ADV = 1.2, CAP = 1.9
  ;[...word].forEach((ch, i) => glyph[ch](i * ADV))
  const len = (word.length - 1) * ADV + W
  const place = (u: number, v: number, w: number): V3 => [XC + (len / 2) * CAP - u * CAP, YF + w, 13.7 + v * CAP]
  strokes(gold, pen.paths, { width: 0.17, depth: 0.12, place })
}

// ───────────────────────────── the ground storey round the block ─────────────────────────────

// gold-framed bays with pale sign panels over dark glass, on every outside
// wall that faces a street (an edge whose outside is inside no other part)
const RINGS = FLATS.map(([r]) => r)
const inside = (p: XY, ring: XY[]) => {
  let c = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j]
    if (yi > p[1] !== yj > p[1] && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) c = !c
  }
  return c
}
const TOWER = rect(51, 80, -55, 22) // the new hotel tower's site, not modelled
for (const [ring, h] of FLATS) {
  if (h < 9.5) continue
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length], E = faceOf(a, b)
    if (E.L < 6.5) continue
    const m: XY = [(a[0] + b[0]) / 2 + E.n[0] * 1.5, (a[1] + b[1]) / 2 + E.n[1] * 1.5]
    if (RINGS.some((r) => r !== ring && inside(m, r)) || inside(m, TOWER) || m[1] > YF - 1) continue
    const n = Math.max(1, Math.floor(E.L / 7)), pitch = E.L / n
    for (let k = 0; k < n; k++) {
      const s0 = k * pitch + 1.2, s1 = (k + 1) * pitch - 1.2
      fpanel(gold, E, s0, s0 + 0.35, 1.0, 8.6, 0.08)
      fpanel(gold, E, s1 - 0.35, s1, 1.0, 8.6, 0.08)
      fpanel(gold, E, s0 + 0.35, s1 - 0.35, 8.25, 8.6, 0.08)
      fpanel(win, E, s0 + 0.3, s1 - 0.3, 1.0, 5.6, 0.05)
      fpanel(trim, E, s0 + 0.3, s1 - 0.3, 5.9, 8.3, 0.05)
    }
    fblock(trim, E, 0, E.L, h - 1.0, h - 0.4, 0.3) // cornice band
    fblock(flat, E, 0, E.L, 0, 1.0, 0.1) // dark planter base
  }
}

// ───────────────────────────── write ─────────────────────────────


const frontLit = (p: V3, n: V3) => (n[1] > 0.5 && p[1] > YF - 1 ? 0.8 : n[2] < 0.5 ? 0.15 : 0)
await save('nola-harrahs', 'Caesars New Orleans', [
  { part: stone, material: { ...finish('caesars-stone', 0xe6dccb), floodlight: frontLit } },
  { part: trim, material: { ...PALETTE.trim, color: 0xf3ecdf, floodlight: frontLit } },
  { part: gold, material: finish('caesars-gold', 0xc39d52) },
  { part: green, material: finish('casino-green-roof', 0x6e9a8a) },
  { part: flat, material: { ...PALETTE.roof, color: 0x8c9196 } },
  { part: win, material: PALETTE.window },
], { bearing: BEARING, osm: 'way/331115230', height: 45.2 }, 6500)
