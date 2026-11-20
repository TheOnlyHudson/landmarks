/**
 * Martin Marietta Center for the Performing Arts, Raleigh (formerly the
 * Progress Energy / Duke Energy Center; Raleigh Memorial Auditorium 1932,
 * Atwood & Weeks; wrapped by the 2001 expansion): procedural, CC0-1.0.
 * bun generators/ral-martin-marietta-center.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 2.5 (the OSM
 * walls run at 2.5°/92.5°). Origin: the area centroid of OSM way/47759870
 * (-78.639660, 35.771186). y = 0 is the lowest ground under the footprint.
 * Mapterhorn (z13) falls about 5.5 m from the plaza in front of the portico
 * (north, ≈5.6 m above y = 0) to the service yard on the south; every
 * height on the north side is taken from that plaza level G = 5.6 m.
 * Elevation 0.
 *
 * OSM: way/47759870 (building, "Martin Marietta Center for the Performing
 * Arts") is one outline for the whole complex: the portico (x -7.8..22.9,
 * y 34.1..49.5), the 1932 auditorium behind it, the 2001 halls west (curved
 * west wall) and east, the glazed lobbies along the north side and the
 * service block on the south. No parts, no heights. Nothing else in OSM is
 * under the model.
 * USGS NAIP (public domain, 0.33 m/px; within a few metres of
 * OSM here): a green copper hipped band round a flat white roof over the
 * auditorium (x -8..28, y -14..32), a paler green stage house behind it,
 * flat white roofs over the west and east halls and the south block, lower
 * brown roofs in the slots either side of the auditorium.
 *
 * No lidar covers Wake County. Heights are estimated:
 *  - the portico from p1 (front view, ≈14 px/m across the 30.7 m front):
 *    pedestals 4.8 m (p1: about half a column shaft), column shafts and
 *    capitals to 14.3 m (shafts 1.9 m across at the base), entablature to
 *    17 m with a plain frieze band, the pediment's apex 21 m above the plaza
 *    (a 14.6° pitch; p1 reads about 12-14° after the upward tilt); eight fluted Doric
 *    columns on rusticated pedestals across the front, four deep on each
 *    side (p1, p5);
 *  - the auditorium's cornice 2.6 m under the portico's and its copper hip
 *    rising 2.1 m to a flat top, so the band stays under the portico
 *    cornice and the pediment stands clear from the street (p1 shows no
 *    roof behind the pediment; p4 shows the band's width);
 *  - the 2001 halls: the stone blocks about 3 m under the portico cornice
 *    (p1, p4: lower than the portico and set back), the glazed lobbies two
 *    storeys, ≈9.5 m, under a sloped green band (p4);
 *  - the stage house a low block over the rear, its green cap just above
 *    the auditorium roof (p4).
 *
 * Photos (evidence; local copies in landmarks-scratch/ral/work/
 * ral-martin-marietta-center/p2):
 *  p1 "Raleigh Memorial Auditorium - #Raleigh North Carolina", Jed_Record,
 *     CC BY 2.0, https://www.flickr.com/photos/94224615@N00/14638876045:
 *     the portico head on from Fayetteville Street, glass behind it.
 *  p2 "Raleigh Memorial Auditorium, 2013.jpg", Bigmacthealmanac, CC BY-SA
 *     4.0, https://commons.wikimedia.org/wiki/File:Raleigh_Memorial_Auditorium,_2013.jpg:
 *     from the north-west: the portico's west side and the lobby glass.
 *  p3 "Progress-Energy-Center-for-the-Performing-Arts-20080321.jpeg",
 *     Jmturner, public domain,
 *     https://commons.wikimedia.org/wiki/File:Progress-Energy-Center-for-the-Performing-Arts-20080321.jpeg:
 *     from the north-east: portico, auditorium roof, east lobby and hall.
 *  p4 "Raleigh Memorial Auditorium", chucka_nc, CC BY-SA 2.0,
 *     https://www.flickr.com/photos/7475921@N05/44435238321: from a tower
 *     to the north-east: the whole complex, copper roofs, the stage house.
 *  p5 "Eeeyaaahaa^ - panoramio.jpg", Scott Thompson, CC BY 3.0,
 *     https://commons.wikimedia.org/wiki/File:Eeeyaaahaa%5E_-_panoramio.jpg:
 *     the portico's side close up, pedestals and glass.
 *  p6 the fayettevillestreet.com Christmas photos, CC BY-SA 4.0 (Commons,
 *     "Duke Energy Center for the Performing Arts - Raleigh Memorial
 *     Auditorium - Christmas Tree*.jpg"): night lighting.
 *  p7 "Raleigh Memorial Auditorium Raleigh, N. C. (5812047098).jpg",
 *     Boston Public Library, CC BY 2.0: the 1932 building before the wrap.
 * Aerial: USGS NAIP (public domain).
 *
 * Colours: pale grey-cream limestone (p1, p2); copper patina (p4).
 * Estimated: every height; the stage house's size; the pattern of windows
 * on the halls (only the north faces are photographed). Left out: the
 * inscription, acroterion detail, rustication lines, the plaza, pool and
 * the sculpture column in front.
 * Doubts: no photo of the south and west faces; the halls' heights rest
 * on two oblique photos.
 * Night: the portico is floodlit (p6) and the lobby glass behind it glows.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'
import { type XY, type Face, prism, capRing, ccw, finishGlb, writeModel, lathe, rect } from './sea-tacoma-union-station'
import { box, panel, triO, quadO } from './nash-tennessee-state-capitol'

const G = 5.6 // the plaza in front of the portico, above y = 0
const PX = 7.55, PW = 15.35, PY0 = 34.1, PY1 = 49.5 // portico: centre x, half width, depth
const PED = G + 4.8, COL = G + 14.3, ENT = G + 16.4, COR = G + 17, APEX = G + 21
const LOBBY = G + 9.6

/** The OSM outline (way/47759870) in this frame. */
const OUTLINE: XY[] = [[22.9,49.5],[22.9,34.4],[59.7,34.4],[59.7,38.0],[71.0,38.0],[71.0,28.1],[68.2,28.1],[68.2,26.2],[70.0,26.2],[70.0,3.6],[63.6,3.6],[63.7,-9.7],[45.0,-9.7],[45.0,-15.2],[36.9,-15.2],[36.9,-9.2],[33.6,-9.2],[33.6,1.9],[29.7,1.9],[29.7,-37.7],[27.2,-38.0],[27.2,-46.1],[16.5,-46.1],[16.5,-50.1],[14.9,-50.1],[14.9,-57.1],[11.2,-57.1],[11.2,-64.2],[-14.4,-64.2],[-14.4,-46.2],[-12.9,-46.2],[-12.9,-38.2],[-15.4,-38.2],[-15.4,-18.9],[-14.1,-18.9],[-14.1,-14.1],[-23.0,-14.1],[-23.0,-35.7],[-29.4,-35.7],[-29.4,-41.6],[-46.7,-41.6],[-46.7,-35.9],[-49.5,-35.9],[-49.5,-23.7],[-56.0,-23.7],[-57.1,-19.9],[-59.2,-10.9],[-60.1,-6.6],[-60.9,-1.1],[-61.2,3.9],[-61.3,7.9],[-61.3,11.8],[-61.3,15.4],[-61.2,19.8],[-61.2,25.9],[-60.1,25.9],[-60.1,28.0],[-63.2,28.0],[-63.2,37.9],[-51.2,37.9],[-51.2,34.1],[-7.8,34.1],[-7.8,49.5]]

function build() {
  const stone = new Part(), trim = new Part(), win = new Part(), roof = new Part(), cu = new Part(), ent = new Part()

  // ------------------------------------------------------------ the low wrap: the whole outline at lobby height
  const ring = ccw(OUTLINE.filter((p) => !(p[1] > 34.2 && p[0] > -7.9 && p[0] < 23))) // portico drawn on its own
  prism(stone, roof, ring, 0, LOBBY)
  capRing(stone, ring, 0, false)
  // a pale coping round it
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 2) continue
    const n: XY = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L], f: Face = { o: [a[0], a[1], 0], n }
    panel(trim, f, L / 2, L, LOBBY - 0.7, LOBBY, 0.05)
  }

  // the glazed lobbies along the north (p2, p4): big glass, a few mullions, a green sloped band on top
  const lobby = (x0: number, x1: number, y: number) => {
    const f: Face = { o: [x1, y, 0], n: [0, 1] }, L = x1 - x0 // s runs west from x1
    panel(win, f, L / 2, L - 1.2, G + 0.2, LOBBY - 1.0, 0.06)
    const n = Math.max(2, Math.round(L / 6.5))
    for (let k = 1; k < n; k++) panel(trim, f, (L * k) / n, 0.35, G + 0.2, LOBBY - 1.0, 0.09)
    panel(trim, f, L / 2, L - 1.2, G + 4.6, G + 5.0, 0.09)
    // the sloped copper band (p4)
    quadO(cu, [x0, y + 0.01, LOBBY - 0.6], [x1, y + 0.01, LOBBY - 0.6], [x1, y - 3, LOBBY + 1.6], [x0, y - 3, LOBBY + 1.6], [0, 1, 1])
    triO(cu, [x0, y + 0.01, LOBBY - 0.6], [x0, y - 3, LOBBY + 1.6], [x0, y - 3, LOBBY - 0.6], [-1, 0, 0])
    triO(cu, [x1, y + 0.01, LOBBY - 0.6], [x1, y - 3, LOBBY + 1.6], [x1, y - 3, LOBBY - 0.6], [1, 0, 0])
  }
  lobby(-51.2, -7.8, 34.1)
  lobby(-63.2, -51.2, 37.9)
  lobby(22.9, 59.7, 34.4)
  lobby(59.7, 71.0, 38.0)

  // ------------------------------------------------------------ the 2001 halls
  // west (Meymandi Concert Hall): the curved west wall follows OSM
  const WEST: XY[] = ccw([[-24, -35.7], [-49.5, -35.7], [-49.5, -23.7], [-56.0, -23.7], [-57.1, -19.9], [-59.2, -10.9], [-60.1, -6.6], [-60.9, -1.1], [-61.2, 3.9], [-61.3, 11.8], [-61.2, 25.9], [-60.1, 25.9], [-60.1, 30.5], [-24, 30.5]])
  const WTOP = G + 13.8
  prism(stone, roof, WEST, LOBBY, WTOP)
  // east (Fletcher Opera Theater)
  const EAST = rect(38.5, -9.7, 70.0, 32.0)
  const ETOP = G + 13.5
  prism(stone, roof, EAST, LOBBY, ETOP)
  // copings
  for (const [r, top] of [[WEST, WTOP], [EAST, ETOP]] as [XY[], number][]) {
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      if (L < 0.5) continue
      const n: XY = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L], f: Face = { o: [a[0], a[1], 0], n }
      panel(trim, f, L / 2, L + 0.02, top - 1.1, top, 0.06)
    }
  }
  // windows on the halls' north faces (p3, p4): tall grouped panels
  {
    const fw: Face = { o: [-24, 30.5, 0], n: [0, 1] }
    for (const s of [8, 18, 28]) panel(win, fw, s, 6, LOBBY + 1.6, WTOP - 1.8)
    const fe: Face = { o: [70.0, 32.0, 0], n: [0, 1] }
    for (const s of [6, 15.75, 25.5]) panel(win, fe, s, 6, LOBBY + 1.6, ETOP - 1.8)
    // east face: three tall groups
    const fx: Face = { o: [70.0, -9.7, 0], n: [1, 0] }
    for (const s of [7, 18, 29]) panel(win, fx, s, 6, LOBBY + 1.6, ETOP - 1.8)
    // west hall's curved face: a band of tall windows on the straight part
    const fwx: Face = { o: [-61.25, 25.9, 0], n: [-1, 0] }
    for (const s of [4, 11, 18]) panel(win, fwx, s, 5, LOBBY + 1.6, WTOP - 1.8)
  }
  // the slots either side of the auditorium: lower roofs (NAIP)
  box(stone, -24, -14.1, -8.2, 34.1, LOBBY - 0.01, G + 12, roof)
  box(stone, 28.2, -9.2, 38.5, 34.4, LOBBY - 0.01, G + 12, roof)

  // ------------------------------------------------------------ the 1932 auditorium
  const AX0 = -8.2, AX1 = 28.2, AY0 = -14.1, AY1 = 34.1
  const AC = COR - 2.6 // its cornice a little under the portico's, so the pediment stands clear
  box(stone, AX0, AY0, AX1, AY1, LOBBY - 0.01, AC - 0.6, null)
  box(trim, AX0 - 0.35, AY0 - 0.35, AX1 + 0.35, AY1, AC - 0.6, AC, null)
  // copper hipped band round a flat roof (NAIP, p4)
  {
    const z0 = AC, z1 = AC + 2.1, d = 7
    const o: V3[] = [[AX0, AY0, z0], [AX1, AY0, z0], [AX1, AY1, z0], [AX0, AY1, z0]]
    const i: V3[] = [[AX0 + d, AY0 + d, z1], [AX1 - d, AY0 + d, z1], [AX1 - d, AY1 - d, z1], [AX0 + d, AY1 - d, z1]]
    const outs: V3[] = [[0, -1, 1], [1, 0, 1], [0, 1, 1], [-1, 0, 1]]
    for (let k = 0; k < 4; k++) quadO(cu, o[k], o[(k + 1) % 4], i[(k + 1) % 4], i[k], outs[k])
    quadO(roof, i[0], i[1], i[2], i[3], [0, 0, 1])
    capRing(trim, [[AX0, AY0], [AX1, AY0], [AX1, AY1], [AX0, AY1]].map((p) => p as XY), z0, true)
  }
  // the stage house behind it (p4: a green-capped block over the rear)
  {
    const x0 = -1, x1 = 21, y0 = -34, y1 = -13, top = AC + 2.2
    box(stone, x0, y0, x1, y1, LOBBY - 0.01, top - 0.6, null)
    box(trim, x0 - 0.3, y0 - 0.3, x1 + 0.3, y1 + 0.3, top - 0.6, top, null)
    const o: V3[] = [[x0, y0, top], [x1, y0, top], [x1, y1, top], [x0, y1, top]]
    const r: V3[] = [[x0 + 5, (y0 + y1) / 2, top + 1.5], [x1 - 5, (y0 + y1) / 2, top + 1.5]]
    quadO(cu, o[0], o[1], r[1], r[0], [0, -1, 1])
    quadO(cu, o[2], o[3], r[0], r[1], [0, 1, 1])
    triO(cu, o[1], o[2], r[1], [1, 0, 1])
    triO(cu, o[3], o[0], r[0], [-1, 0, 1])
  }
  // the south service block (OSM's south lobe) to its own height
  box(stone, -14.4, -64.2, 11.2, -38.2, LOBBY - 0.01, G + 11.5, roof)

  // ------------------------------------------------------------ the portico (the hero)
  // base under it, down to y = 0 (buried on the north by the plaza)
  box(stone, PX - PW, PY0, PX + PW, PY1, 0, G + 0.3, stone, 0.2)
  // glass behind the colonnade, full height (p1, p5)
  {
    const gx0 = PX - 12.2, gx1 = PX + 12.2, gy1 = 46.6
    box(win, gx0, PY0 - 0.2, gx1, gy1, G + 0.3, COL, null)
    const f: Face = { o: [gx1, gy1, 0], n: [0, 1] }
    for (const s of [6.1, 12.2, 18.3]) panel(ent, f, s, 2.6, G + 0.3, G + 3.4, 0.05)
    for (let k = 1; k < 7; k++) panel(trim, f, (24.4 * k) / 7, 0.3, G + 0.3, COL, 0.08)
    panel(trim, f, 12.2, 24.4, G + 5.6, G + 6.0, 0.08)
  }
  // columns: eight across the front, four deep each side
  const cols: XY[] = []
  const xs = Array.from({ length: 8 }, (_, k) => PX - 13.7 + (27.4 * k) / 7)
  for (const x of xs) cols.push([x, 48.0])
  for (const y of [44.1, 40.2, 36.3]) for (const x of [PX - 13.7, PX + 13.7]) cols.push([x, y])
  for (const [x, y] of cols) {
    box(stone, x - 1.25, y - 1.25, x + 1.25, y + 1.25, G + 0.3, PED - 0.4, null, 0.15)
    box(trim, x - 1.35, y - 1.35, x + 1.35, y + 1.35, PED - 0.4, PED, null, 0.1)
    lathe(trim, x, y, [[0.95, PED], [0.82, COL - 0.8]], 12)
    lathe(trim, x, y, [[0.82, COL - 0.8], [1.1, COL - 0.45]], 12)
    box(trim, x - 1.2, y - 1.2, x + 1.2, y + 1.2, COL - 0.45, COL, null)
  }
  // entablature and cornice
  box(trim, PX - PW + 0.45, PY0, PX + PW - 0.45, PY1 - 0.45, COL, ENT, null)
  box(trim, PX - PW, PY0, PX + PW, PY1, ENT, COR, null, 0.15)
  // frieze band (the inscription) a shade off the architrave
  panel(stone, { o: [PX + PW - 0.45, PY1 - 0.45, 0], n: [0, 1] }, PW - 0.45, 2 * PW - 0.9, COL + 0.9, ENT - 0.15, 0.04)
  // the pediment: a low gable, ridge running back to the auditorium
  {
    const xl = PX - PW, xr = PX + PW, yb = PY0, yf = PY1
    quadO(cu, [xl, yf, COR], [PX, yf, APEX], [PX, yb, APEX], [xl, yb, COR], [-(APEX - COR), 0, PW])
    quadO(cu, [PX, yf, APEX], [xr, yf, COR], [xr, yb, COR], [PX, yb, APEX], [APEX - COR, 0, PW])
    // raking cornice and recessed tympanum
    const lip = 0.8, rake = 1.0
    for (const sx of [-1, 1]) {
      const xe = PX + sx * PW
      quadO(trim, [xe, yf, COR], [PX, yf, APEX], [PX, yf, APEX - rake], [xe, yf, COR - 0.01], [0, 1, 0])
      quadO(trim, [xe, yf, COR - 0.01], [PX, yf, APEX - rake], [PX, yf - lip, APEX - rake], [xe, yf - lip, COR - 0.01], [0, 0, -1])
    }
    const xi = PW * (1 - rake / (APEX - COR))
    triO(stone, [PX - xi, yf - lip, COR], [PX + xi, yf - lip, COR], [PX, yf - lip, APEX - rake], [0, 1, 0])
    triO(stone, [xl, yb, COR], [xr, yb, COR], [PX, yb, APEX], [0, -1, 0])
    // acroteria: apex and corners (p1)
    box(trim, PX - 0.95, yf - 1.4, PX + 0.95, yf - 0.1, APEX - 0.4, APEX + 1.6, trim, 0.15)
    for (const sx of [-1, 1]) box(trim, PX + sx * (PW - 0.8) - 0.75, yf - 1.3, PX + sx * (PW - 0.8) + 0.75, yf - 0.1, COR, COR + 1.4, trim, 0.12)
  }

  // the portico is floodlit from the plaza (p6): column faces and the pediment front
  const lit = (p: V3, n: V3) => (p[1] > PY0 - 0.5 && p[0] > PX - PW - 0.5 && p[0] < PX + PW + 0.5 && n[2] < 0.7 ? (p[2] < COR + 0.1 ? 0.9 : 0.6) : 0)

  return finishGlb('Martin Marietta Center for the Performing Arts', [
    { part: stone, material: <Swatch>{ ...finish('mmc-limestone', 0xe4ded2), floodlight: lit } },
    { part: trim, material: <Swatch>{ ...finish('mmc-limestone-trim', 0xf1ebdf), floodlight: lit } },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: cu, material: PALETTE.copper },
    { part: ent, material: PALETTE.entrance },
  ], { bearing: 2.5, height: APEX + 1.6, replaces: ['way/47759870'] }, 6500)
}

if (import.meta.main) await writeModel('ral-martin-marietta-center', build())
