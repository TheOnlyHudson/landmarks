/**
 * Columbia City Hall (built 1870–74 as the U.S. Court House and Post
 * Office, Alfred B. Mullett, Supervising Architect; city hall since 1936),
 * Main and Laurel Streets, Columbia, SC — original procedural geometry,
 * CC0-1.0.
 * bun generators/cola-city-hall.ts
 *
 * Map frame: x east, y north, z up, metres; built in a frame turned to the
 * downtown grid, bearing 70 (+y toward 70°, along Laurel Street; +x toward
 * 160°). -y is the Main Street end (the CITY HALL door), -x the Laurel
 * Street front with the pediment. Anchor = centroid of OSM way/330010799
 * ("Columbia City Hall", building=government, 3 levels, roof:shape=hipped),
 * 34.008988, -81.037360.
 *
 * Identity: a three-storey Renaissance Revival palazzo of pale grey
 * granite: a rusticated ground storey of round-arched openings, pedimented
 * windows on the first floor, plain windows above, a bracketed cornice,
 * shallow centre pavilions on every face, the one on the Laurel front
 * crowned by a low pediment with three oculi under it, a low hipped roof and
 * tall stone chimneys.
 *
 * Evidence:
 *  - plan: OSM way/330010799: long faces 35.7 m in three parts (10.7,
 *    15.4, 9.6 m; drawn symmetric at 10.15, 15.4, 10.15), the centre
 *    pavilion 0.6 m proud; ends 20.8 m (5.9, 9.0, 5.9 m), the pavilion
 *    0.7 m proud.
 *  - heights: estimated from Milligan's photo of the Laurel front, scaled
 *    from the 15.4 m pavilion: ground storey ~6.9 m, first floor to
 *    ~14.4 m, cornice top ~20.3 m, pediment apex ~24 m, chimneys ~24.2 m; the hipped roof
 *    kept low (1.6 m) as it hides behind the cornice in the photos.
 *    No lidar used (the cost rule: photo scale settles a three-storey
 *    block).
 *  - bays: wings two bays on the long faces, the pavilions three; one bay
 *    per wing and pavilion on the ends (Milligan; Hathorn; the 1900 photo).
 *  - colour: pale grey granite (both modern photos).
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 *  - Columbia City Hall; Columbia, South Carolina; February 24, 2016.jpg,
 *    Stephen Matthew Milligan, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Columbia_City_Hall;_Columbia,_South_Carolina;_February_24,_2016.jpg
 *  - Columbia, SC, City Hall IMG 4807.JPG, Billy Hathorn, CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:Columbia,_SC,_City_Hall_IMG_4807.JPG
 *  - Columbia City Hall 1900.jpg, U.S. Federal Judicial Center, public domain
 *    https://commons.wikimedia.org/wiki/File:Columbia_City_Hall_1900.jpg
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the south front and the east end are unphotographed; they are
 * drawn like the faces opposite but without the pediment, which only the
 * Laurel front is seen to carry. Chimney positions are read from one
 * photo. Rustication grooves, brackets and window hoods' detail are left
 * out.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { box, cornice, prism, save, type XY } from './atl-flatiron-building'
import { archOn, discOn, gable, hip, rectOn } from './cola-palmetto-building'

const stone = new Part(), trim = new Part(), win = new Part(), roof = new Part(), door = new Part()

const WX = 10.4, WY = 17.85, PX = 4.5, PY = 7.7, PJX = 0.6, PJY = 0.7
const G1 = 6.9, G2 = 14.4, CORN = 19.6, TOP = 20.3

const ring: XY[] = [
  [-WX, -WY], [-PX, -WY], [-PX, -WY - PJY], [PX, -WY - PJY], [PX, -WY], [WX, -WY],
  [WX, -PY], [WX + PJX, -PY], [WX + PJX, PY], [WX, PY], [WX, WY],
  [PX, WY], [PX, WY + PJY], [-PX, WY + PJY], [-PX, WY], [-WX, WY],
  [-WX, PY], [-WX - PJX, PY], [-WX - PJX, -PY], [-WX, -PY],
]

prism(stone, ring, 0, CORN, null, 0)
// Plinth, the string courses over each storey, and the bracketed cornice.
cornice(trim, ring, 0, 0.9, 0.2)
cornice(trim, ring, G1 - 0.5, 0.7, 0.3)
cornice(trim, ring, G2 - 0.4, 0.6, 0.25)
cornice(trim, ring, CORN - 0.3, TOP - CORN + 0.3, 1.0, roof)
// Low hipped roof and the Laurel front's pediment.
hip(roof, -WX + 0.6, WX - 0.6, -WY + 0.6, WY - 0.6, TOP, 1.6)
gable(stone, [-WX - PJX, PY], [-WX - PJX, -PY], -0.6, 2 * PY + 0.6, TOP, 3.7, 4.0, 0.4)
// Chimneys.
for (const x of [-7.6, 7.6]) for (const y of [-11.5, 11.5]) box(stone, x - 0.7, x + 0.7, y - 1.0, y + 1.0, TOP, 24.2, trim, 0.2)

// Quoin strips at the pavilions' edges.
for (let i = 0; i < ring.length; i++) {
  const a = ring[i], b = ring[(i + 1) % ring.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (L > 1 && L < 16 && (Math.abs(a[0]) > WX + 0.1 || Math.abs(a[1]) > WY + 0.1)) {
    rectOn(trim, a, b, 0, 0.9, 0.9, CORN - 0.3, 0.1)
    rectOn(trim, a, b, L - 0.9, L, 0.9, CORN - 0.3, 0.1)
  }
}

// Windows: arched ground storey, hooded first floor, plain second floor.
function bay(a: XY, b: XY, s: number, groundDoor: boolean, oculus: boolean) {
  if (groundDoor) {
    rectOn(door, a, b, s - 1.0, s + 1.0, 0.9, 4.2)
    archOn(win, a, b, s - 1.0, s + 1.0, 4.2, 5.6)
  } else archOn(win, a, b, s - 0.95, s + 0.95, 1.4, 5.6)
  rectOn(win, a, b, s - 0.75, s + 0.75, G1 + 1.2, G2 - 1.6)
  gable(trim, a, b, s - 1.15, s + 1.15, G2 - 1.4, 0.6, 0.2, 0.2)
  rectOn(win, a, b, s - 0.7, s + 0.7, G2 + 1.0, oculus ? 17.6 : 18.0)
  if (oculus) discOn(win, a, b, s, 18.7, 0.5)
}
for (let i = 0; i < ring.length; i++) {
  const a = ring[i], b = ring[(i + 1) % ring.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (L < 3) continue
  const pav = Math.abs(a[0]) > WX + 0.1 || Math.abs(a[1]) > WY + 0.1
  const laurel = pav && a[0] < -WX
  const main = pav && a[1] < -WY
  if (L > 14) for (const s of [L / 2 - 3.6, L / 2, L / 2 + 3.6]) bay(a, b, s, false, laurel)
  else if (L > 9.5) for (const s of [L * 0.32, L * 0.7]) bay(a, b, s, false, false)
  else bay(a, b, L / 2, main, false)
}

await save('cola-city-hall', 'Columbia City Hall', [
  { part: stone, material: finish('city-hall-granite', 0xdedbd3) },
  { part: trim, material: finish('city-hall-trim', 0xeeece5) },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: door, material: PALETTE.entrance },
], { height: 24.2, anchor: [34.008988, -81.03736], bearing: 70 })
