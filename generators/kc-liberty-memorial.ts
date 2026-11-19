/**
 * National WWI Museum and Memorial (Liberty Memorial), Kansas City, Missouri
 * — original procedural geometry, CC0-1.0.
 * bun generators/kc-liberty-memorial.ts
 *
 * H. Van Buren Magonigle, dedicated 1926; museum under the deck by Ralph
 * Appelbaum / ASAI, 2006. Map frame: x east, y north, z up, metres, in the
 * memorial's own axes; placed at bearing 14.2° (the halls' and the deck's
 * long edges in OSM run 104.2°, and the 2020 lidar agrees). Origin: the
 * tower's centre (OSM way/466820799), on the lowest ground under the
 * outline (the foot of the north wall).
 *
 * Identity, from the photos:
 *  1. the 66 m fluted limestone shaft, tapering, with eight deep flutes,
 *     a plain drum at its foot and a round capped top (all photos);
 *  2. the four Guardian Spirits (Honor, Courage, Patriotism, Sacrifice)
 *     high on the diagonal lobes, hooded by stepped wings (DSC07430,
 *     panoramio, Daderot DSC07442);
 *  3. the "flame": steam lit orange from the top of the tower at night
 *     (night photos by MARELBU, panoramio, and CalendarGuy);
 *  4. Exhibit Hall (west) and Memory Hall (east), Egyptian-revival stone
 *     boxes with a two-column portico facing the tower and tall slot
 *     windows on their long sides (2025 photos by Antony-22; aerials);
 *  5. the great deck on its hill: a 14 m wall to the north (with the Great
 *     Frieze), the two winged sphinxes Memory and Future at the head of
 *     the south steps, the museum skylight and the sunken south entrance.
 *
 * Evidence:
 *  - OSM: tower way/466820799 (height=66); deck and museum
 *    way/587083043 (layer 1, the whole platform from the north wall to the
 *    south entrance, halls included); Exhibit Hall way/537927800 and Memory
 *    Hall way/537927801. All four are replaced. The museum is underground
 *    beneath way/587083043; it has no outline of its own.
 *  - Lidar, measured: USGS 3DEP MO_FEMANRCS_1_2020 (2020 flight), 1 m grid
 *    sampled in this frame. Heights above the lidar's lowest ground
 *    (262.1 m): deck 25.9 at the tower, 26.5 on the raised bands by the
 *    halls and along the north wall, south terrace 25.1, skylight 26.6,
 *    tower rim 91.0 and top 92.6 (so the tower stands 66.3 m above the
 *    deck, against a published 217 ft = 66.1 m), hall cornices 38.0 and
 *    roofs 39.3, sphinx heads ≈29.9, north lawn at the wall's foot 12.4,
 *    ground beside the halls' outer ends 19.0, entrance court 18.4–19.0.
 *    The model's z = 0 is 12.4 on that scale.
 *  - Published: tower 217 ft (Wikipedia; NRHP/NHL nomination); Guardian
 *    Spirits by Robert Aitken; Great Frieze by Edmond Amateis, 148 × 18 ft;
 *    sphinxes Memory (faces east, toward France) and Future (faces west),
 *    so the west one faces in toward the axis and so does the east one.
 *  - Measured from OSM: hall plans 27.9 × 14.0 m at x ±42.2…70.1; the deck
 *    from y −23 to +16.4 (+22.1 where the frieze wall projects), the south
 *    museum front out to y −47.5.
 *  - Estimated from photos: tower base drum Ø13 m and 3.5 m tall, shaft
 *    Ø11.2 → Ø9.4 m (taper read from Gabe S.'s far photo and the lidar top),
 *    flute depth, the guardians' size and height (≈deck +47 to +59 m), the
 *    cap drum and dome; hall portico (two columns, 9 m opening, 8 m tall)
 *    and the six slot windows per long side; sphinx size (≈6 × 3 × 4 m);
 *    door size at the south entrance; frieze panel position.
 *  - Invented: the steam plume's shape (it drifts; drawn as a still puff
 *    of three lobes, 4 m tall, so the lit "flame" reads at night).
 *  - Simplified: the north lawn berms beside the halls (lidar profile) are
 *    drawn as sloped grass prisms, since the map flattens the terrain
 *    inside the outline; the stairs on the north and south slopes outside
 *    the outline are left to the map; the stepped wing pilasters at the
 *    top of the shaft are folded into the guardians.
 *
 * Night (CalendarGuy's night photo): the whole shaft is floodlit near
 * white from foot to cap, the brightest thing in the scene; the frieze wall
 * and the museum's south front are lit and its entrance doors glow
 * (window); the halls stay dark, so their slot windows and porticoes share
 * the dark `glass` material with the skylights; the steam plume glows
 * (neon-steam). The real
 * steam is lit orange; a neon material glows in its own day colour, so the
 * plume is a pale warm steam colour by day and glows pale apricot at night,
 * not full orange: that would need a day colour of orange, which no day
 * photo shows.
 *
 * Photos (Wikimedia Commons, evidence): National World War I Museum and
 * Memorial aerial.jpg (National WWI Museum, CC0); National WWI Memorial &
 * Museum Aerial.jpg (Lectrician2, CC BY-SA 4.0); Liberty Memorial Kansas City
 * Mo (211698103).jpeg (Arcangelts, CC BY-SA 3.0); Liberty Memorial, Kansas
 * City, Missouri.jpg (Marshall Astor, CC BY-SA 2.0); Liberty Memorial -
 * Kansas City, MO - DSC07822/07430/07442.JPG (Daderot, public domain);
 * Kansas City, Missouri - Liberty Memorial - panoramio.jpg (MARELBU, CC BY
 * 3.0); The Liberty Memorial, Kansas City MO, 2008.JPG (Iknowthegoods, CC
 * BY-SA 3.0); Kansas City - Liberty Memorial - panoramio.jpg (MARELBU, CC BY
 * 3.0); National WWI Museum and Memorial from lawn.jpg (Gabe S., CC BY-SA
 * 4.0); National World War I Museum and Memorial (also known at The
 * Liberty Memorial.).jpg (CalendarGuy, CC BY-SA 4.0); National WWI Museum and
 * Memorial 2025a/c/d.jpg (Antony-22, CC BY-SA 4.0). USGS 3DEP lidar and
 * Mapterhorn terrain for heights. No commercial imagery.
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const TAU = Math.PI * 2
const L0 = 12.4                       // lidar height of this model's z = 0
const lz = (h: number) => h - L0      // lidar height → model z
const DECK = lz(25.9)                 // 13.5, the deck at the tower
const BAND = lz(26.5)                 // raised bands by the halls and the north wall
const TERRACE = lz(25.1)              // the south terrace over the museum
const COURT = lz(18.8)                // the sunken entrance court
const SIDE = lz(19.0)                 // ground beside the halls' outer ends

const stone = new Part()   // Indiana-type limestone, warm buff
const win = new Part()     // the museum's entrance doors (glow at night)
const glass = new Part()   // skylights, hall slot windows and porticoes (dark at night)
const roof = new Part()    // Memory Hall's roof (green-grey metal)
const lawn = new Part()    // berms beside the halls
const flame = new Part()   // the lit steam plume

// --- helpers ---------------------------------------------------------------
/** A rectangle ring, counter-clockwise from above, corners chamfered by c, long edges split ≤ 5 m. */
function ring(x0: number, x1: number, y0: number, y1: number, z: number, c: number, nx: number, ny: number): V3[] {
  const pts: V3[] = []
  const edge = (a: [number, number], b: [number, number], n: number) => {
    // With a chamfer the edge keeps its end point, and the cut runs to the next edge's start.
    for (let i = 0; i < n + (c > 0 ? 1 : 0); i++) pts.push([a[0] + (b[0] - a[0]) * i / n, a[1] + (b[1] - a[1]) * i / n, z])
  }
  edge([x0 + c, y0], [x1 - c, y0], nx)
  edge([x1, y0 + c], [x1, y1 - c], ny)
  edge([x1 - c, y1], [x0 + c, y1], nx)
  edge([x0, y1 - c], [x0, y0 + c], ny)
  return pts
}
/** A box with chamfered vertical edges and a chamfered top edge; sides split into ≤ 5 m strips. */
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, c = 0.3) {
  c = Math.min(c, (x1 - x0) / 3, (y1 - y0) / 3, (z1 - z0) / 2)
  const nx = Math.max(1, Math.ceil((x1 - x0) / 6)), ny = Math.max(1, Math.ceil((y1 - y0) / 6))
  const a = ring(x0, x1, y0, y1, z0, c, nx, ny)
  if (c <= 0) {
    // Split on a shared 5 m lattice, so boxes that meet share vertices: the
    // map lifts each vertex by the ground under it, and matching vertices
    // keep neighbours together. The top is a grid, not a fan of slivers,
    // so it bends smoothly instead of creasing.
    const cuts = (a0: number, a1: number) => {
      const v = [a0]
      for (let k = Math.floor(a0 / 5) + 1; k * 5 < a1 - 0.3; k++) if (k * 5 > a0 + 0.3) v.push(k * 5)
      v.push(a1)
      return v
    }
    const xs = cuts(x0, x1), ys = cuts(y0, y1)
    const loop: [number, number][] = [
      ...xs.slice(0, -1).map((x): [number, number] => [x, y0]),
      ...ys.slice(0, -1).map((y): [number, number] => [x1, y]),
      ...[...xs].reverse().slice(0, -1).map((x): [number, number] => [x, y1]),
      ...[...ys].reverse().slice(0, -1).map((y): [number, number] => [x0, y]),
    ]
    p.loft([loop.map(([x, y]): V3 => [x, y, z0]), loop.map(([x, y]): V3 => [x, y, z1])])
    for (let i = 0; i < xs.length - 1; i++)
      for (let j = 0; j < ys.length - 1; j++)
        p.quad([xs[i], ys[j], z1], [xs[i + 1], ys[j], z1], [xs[i + 1], ys[j + 1], z1], [xs[i], ys[j + 1], z1])
    // No floor on the ground: the map drapes z = 0 over the terrain.
    if (z0 > 0.01) p.cap(loop.map(([x, y]): V3 => [x, y, z0]), false)
    return
  }
  const b = ring(x0, x1, y0, y1, z1 - c, c, nx, ny)
  const t = ring(x0 + c, x1 - c, y0 + c, y1 - c, z1, c * 0.4, nx, ny)
  p.loft([a, b, t])
  p.cap(t, true)
  if (z0 > 0.01) p.cap(a, false)
}
/** A flat panel on a wall face: `axis` is the face normal ('x+','x-','y+','y-'), at plane `at`. */
function panel(p: Part, axis: 'x+' | 'x-' | 'y+' | 'y-', at: number, u0: number, u1: number, z0: number, z1: number, off = 0.04) {
  const s = axis[1] === '+' ? 1 : -1, w = at + s * off
  if (axis[0] === 'x') {
    const A: V3 = [w, u0, z0], B: V3 = [w, u1, z0], C: V3 = [w, u1, z1], D: V3 = [w, u0, z1]
    if (s > 0) p.quad(A, B, C, D); else p.quad(B, A, D, C)
  } else {
    const A: V3 = [u0, w, z0], B: V3 = [u1, w, z0], C: V3 = [u1, w, z1], D: V3 = [u0, w, z1]
    if (s < 0) p.quad(A, B, C, D); else p.quad(B, A, D, C)
  }
}
/** The ring, turned counter-clockwise from above if it isn't. */
function ccw(r: V3[]): V3[] {
  const a = r.reduce((s, p, i) => s + p[0] * r[(i + 1) % r.length][1] - r[(i + 1) % r.length][0] * p[1], 0)
  return a > 0 ? r : [...r].reverse()
}
/** A prism whose top follows profile (x, z) points, extruded from y0 to y1, down to z = 0. */
function berm(p: Part, prof: [number, number][], y0: number, y1: number) {
  for (let i = 0; i < prof.length - 1; i++) {
    const [xa, za] = prof[i], [xb, zb] = prof[i + 1]
    const lo = Math.min(xa, xb), hi = Math.max(xa, xb), zl = xa < xb ? za : zb, zh = xa < xb ? zb : za
    // top
    p.quad([lo, y0, zl], [hi, y0, zh], [hi, y1, zh], [lo, y1, zl])
    // the two long sides
    p.quad([lo, y0, 0], [hi, y0, 0], [hi, y0, zh], [lo, y0, zl])
    p.quad([hi, y1, 0], [lo, y1, 0], [lo, y1, zl], [hi, y1, zh])
  }
  const end = (x: number, z: number, dir: number) => {
    const A: V3 = [x, y0, 0], B: V3 = [x, y1, 0], C: V3 = [x, y1, z], D: V3 = [x, y0, z]
    if (dir > 0) p.quad(A, B, C, D); else p.quad(B, A, D, C)
  }
  const xs = prof.map((q) => q[0])
  const iMin = xs.indexOf(Math.min(...xs)), iMax = xs.indexOf(Math.max(...xs))
  end(prof[iMax][0], prof[iMax][1], 1)
  end(prof[iMin][0], prof[iMin][1], -1)
}

// --- the deck and the museum podium ------------------------------------------
// Central deck between the halls, with the raised bands beside the halls.
box(stone, -28, 28, -22, 14, 0, DECK, 0)
for (const s of [-1, 1]) {
  const [a, b] = s < 0 ? [-42.2, -28] : [28, 42.2]
  box(stone, a, b, -22, 14, 0, BAND, 0)
  box(stone, s < 0 ? -42.2 : 31.5, s < 0 ? -31.5 : 42.2, 14, 16.4, 0, BAND, 0)
}
// The north band and the frieze wall's projection.
box(stone, -31.5, 31.5, 14, 22.1, 0, BAND, 0)
// North parapet, 1 m tall.
box(stone, -31.5, 31.5, 21.5, 22.1, BAND, BAND + 1.0, 0.15)
for (const s of [-1, 1]) {
  box(stone, s < 0 ? -42.2 : 31.5, s < 0 ? -31.5 : 42.2, 15.8, 16.4, BAND, BAND + 1.0, 0.15)
  box(stone, s < 0 ? -32.1 : 31.5, s < 0 ? -31.5 : 32.1, 16.4, 21.5, BAND, BAND + 1.0, 0.15)
}
// The Great Frieze: a broad relief panel on the north wall, 45 × 5.5 m.
box(stone, -22.5, 22.5, 22.0, 22.35, lz(19.0), lz(24.6), 0.1)

// South: steps down from the deck to the terrace over the museum.
for (let k = 0; k < 3; k++) {
  const z = DECK - (k + 1) * (DECK - TERRACE) / 4
  box(stone, -16, 16, -22 - (k + 1) * 0.5, -22 - k * 0.5, 0, z + (DECK - TERRACE) / 4, 0.05)
}
box(stone, -42.2, -16, -23.0, -22, 0, DECK, 0)
box(stone, 16, 42.2, -23.0, -22, 0, DECK, 0)
box(stone, -42.2, 42.2, -41.3, -23.5, 0, TERRACE, 0)
box(stone, -16, 16, -23.5, -23.0, 0, TERRACE + (DECK - TERRACE) / 4, 0.05)
// The museum's south front, sunk into the entrance court, with a parapet.
box(stone, -21.8, 21.8, -47.5, -41.3, 0, TERRACE + 0.4, 0)
box(stone, -21.8, 21.8, -47.5, -46.9, TERRACE + 0.4, TERRACE + 1.1, 0.15)
// The entrance: three pairs of bronze-and-glass doors under the lettering.
panel(win, 'y-', -47.5, -7.5, 7.5, COURT, COURT + 4.2)

// Museum skylight south of the tower (glass on a stone curb), and the small one by the east sphinx.
box(stone, -6.8, 6.8, -38.2, -24.6, 0, TERRACE + 0.6, 0.15)
box(glass, -6.2, 6.2, -37.6, -25.2, TERRACE + 0.5, lz(26.6), 0.1)
box(stone, 20.5, 27.5, -28.5, -24.0, 0, TERRACE + 0.5, 0.1)
box(glass, 21.0, 27.0, -28.0, -24.5, TERRACE + 0.4, TERRACE + 0.9, 0.05)

// --- the sphinxes, Memory (west) and Future (east), facing in ---------------
function sphinx(sx: number) {
  // Each about 10.5 m long, 5 m wide and 6.7 m tall over the deck (lidar ≈4 m
  // at its 1 m sampling; photos show the hood well above a person's head).
  const k = 1.55, cx = 21 * sx, cy = -20.0
  const X = (u: number) => cx - sx * u * k   // u grows toward the axis (the face)
  const Y = (v: number) => cy + v * k
  const Z = (h: number) => DECK + h * k
  const xr = (u0: number, u1: number): [number, number] => [Math.min(X(u0), X(u1)), Math.max(X(u0), X(u1))]
  let [a, b] = xr(-3.4, 3.4)
  box(stone, a, b, Y(-1.6), Y(1.6), DECK, Z(0.9), 0.15)                    // plinth
  ;[a, b] = xr(-3.1, 1.6)
  box(stone, a, b, Y(-1.25), Y(1.25), Z(0.9), Z(2.3), 0.4)                 // couchant body
  ;[a, b] = xr(0.4, 3.2)
  box(stone, a, b, Y(-1.15), Y(1.15), Z(0.9), Z(1.5), 0.25)                // forepaws
  // The hooded head: the wings fold over the face, a rounded mass leaning forward.
  const hood: V3[][] = []
  const prof: [number, number, number][] = [[2.0, 1.1, 1.2], [3.2, 1.3, 1.3], [3.9, 1.05, 1.05], [4.3, 0.5, 0.6]]
  for (const [h, ru, rv] of prof) {
    const u0 = 1.4 + (h - 2.0) * 0.3   // leans toward the face as it rises
    const r: V3[] = []
    for (let i = 0; i < 10; i++) {
      const t = (i / 10) * TAU
      r.push([X(u0 + ru * Math.cos(t)), Y(rv * 1.15 * Math.sin(t)), Z(h)])
    }
    hood.push(ccw(r))
  }
  stone.loft(hood)
  stone.cap(hood[hood.length - 1], true)
}
sphinx(-1)
sphinx(1)

// --- Exhibit Hall (west) and Memory Hall (east) ------------------------------
const HY0 = -7.5, HY1 = 6.5, HC = -0.5
const CORNICE = lz(38.0), ROOF = lz(39.3)
function hall(s: number) {
  const xin = 42.2 * s, xout = 70.1 * s, rec = 2.0
  const [a, b] = s < 0 ? [xout, xin] : [xin, xout]
  const xr = s < 0 ? [xout, xin + s * rec] : [xin + s * rec, xout]
  // Main block, set back from the inner face by the portico's depth.
  box(stone, xr[0], xr[1], HY0, HY1, 0, CORNICE - 0.9, 0.3)
  // The portico's antae and lintel at the inner face.
  const ax: [number, number] = s < 0 ? [xin + s * rec, xin] : [xin, xin + s * rec]
  box(stone, ax[0], ax[1], HY0, HC - 4.5, 0, CORNICE - 0.9, 0.3)
  box(stone, ax[0], ax[1], HC + 4.5, HY1, 0, CORNICE - 0.9, 0.3)
  box(stone, ax[0], ax[1], HC - 4.5, HC + 4.5, BAND + 8.4, CORNICE - 0.9, 0.2)
  box(stone, ax[0], ax[1], HC - 4.6, HC + 4.6, 0, BAND + 0.45, 0.1)  // portico floor and step
  // Two square columns in antis.
  for (const yc of [HC - 1.5, HC + 1.5]) {
    const cx = xin + s * 0.9
    box(stone, cx - 0.55, cx + 0.55, yc - 0.55, yc + 0.55, BAND + 0.45, BAND + 8.4, 0.12)
  }
  // The portico's dark back wall: the hall's bronze doors and grilles.
  panel(glass, s < 0 ? 'x+' : 'x-', xin + s * rec, HC - 4.5, HC + 4.5, BAND + 0.45, BAND + 8.4)
  // Cornice and attic, then the low metal roof.
  box(stone, a - 0.35, b + 0.35, HY0 - 0.35, HY1 + 0.35, CORNICE - 0.9, CORNICE, 0.25)
  box(stone, a + 0.8, b - 0.8, HY0 + 0.8, HY1 - 0.8, CORNICE, ROOF - 0.5, 0.2)
  const r0 = ring(a + 1.4, b - 1.4, HY0 + 1.4, HY1 - 1.4, ROOF - 0.5, 0, 1, 1)
  const r1 = ring(a + 3.4, b - 3.4, HY0 + 3.4, HY1 - 3.4, ROOF, 0, 1, 1)
  // Memory Hall (east) has the green-grey metal roof seen in the aerials;
  // Exhibit Hall's roof reads as plain pale stone in them.
  const top = s > 0 ? roof : stone
  top.loft([r0, r1])
  top.cap(r1, true)
  // Six tall slot windows on each long side, centred, from the band up.
  for (const [face, y] of [['y-', HY0], ['y+', HY1]] as const) {
    for (let k = 0; k < 6; k++) {
      const xm = s * (56.15 + (k - 2.5) * 2.7)
      panel(glass, face, y, xm - 0.7, xm + 0.7, BAND + 1.0, BAND + 8.6)
    }
  }
}
hall(-1)
hall(1)

// Berms beside the halls: the lawns slope from the deck bands down to the
// ground at the halls' outer ends (lidar rows y = +8…+16 and −8…−20).
for (const s of [-1, 1]) {
  const prof: [number, number][] = [[42.2, BAND], [46, lz(25.3)], [52, lz(24.1)], [58, lz(22.4)], [64, lz(20.9)], [70, lz(19.6)], [75.3, SIDE]]
  const P = prof.map(([x, z]): [number, number] => [s * x, z + 0.15])
  berm(lawn, P, HY1, 16.4)
  berm(lawn, P, -23, HY0)
}

// --- the tower --------------------------------------------------------------
const N = 64                          // points round the shaft, 8 per lobe
/** Plan radius of the fluted shaft at angle t, for an outer radius R. */
function shaftR(t: number, R: number) {
  const lobe = TAU / 8
  const u = (((t + lobe / 2) % lobe) + lobe) % lobe / lobe * 2 - 1   // −1…1 across a lobe
  const groove = Math.abs(u) > 0.8 ? 1.15 : 0
  return R - 0.5 * u * u - groove
}
function shaftRing(z: number, R: number): { p: V3[]; n: V3[] } {
  const p: V3[] = [], n: V3[] = []
  for (let i = 0; i < N; i++) {
    const t = ((i + 0.5) / N) * TAU
    const r = shaftR(t, R), dr = (shaftR(t + 0.01, R) - shaftR(t - 0.01, R)) / 0.02
    p.push([r * Math.cos(t), r * Math.sin(t), z])
    // outward normal of the plan curve r(t)
    const tx = dr * Math.cos(t) - r * Math.sin(t), ty = dr * Math.sin(t) + r * Math.cos(t)
    const l = Math.hypot(tx, ty)
    n.push(Math.abs(dr) > 3 ? [Math.cos(t + Math.sign(dr) * Math.PI / 2) * -1, Math.sin(t + Math.sign(dr) * Math.PI / 2) * -1, 0] : [ty / l, -tx / l, 0])
  }
  return { p, n }
}
function smoothLoft(part: Part, rings: { p: V3[]; n: V3[] }[]) {
  for (let k = 0; k < rings.length - 1; k++) {
    const A = rings[k], B = rings[k + 1]
    for (let i = 0; i < A.p.length; i++) {
      const j = (i + 1) % A.p.length
      part.tri(A.p[i], A.p[j], B.p[j], undefined, undefined, undefined, [A.n[i], A.n[j], B.n[j]])
      part.tri(A.p[i], B.p[j], B.p[i], undefined, undefined, undefined, [A.n[i], B.n[j], B.n[i]])
    }
  }
}
function circle(r: number, z: number, n = 32): V3[] {
  return Array.from({ length: n }, (_, i): V3 => [r * Math.cos((i / n) * TAU), r * Math.sin((i / n) * TAU), z])
}
function lathe(part: Part, prof: [number, number][], n = 32, top = true) {
  const rings = prof.map(([r, z]) => circle(r, z, n))
  const nrm = (k: number, i: number): V3 => {
    const a = prof[Math.max(0, k - 1)], b = prof[Math.min(prof.length - 1, k + 1)]
    const dr = b[0] - a[0], dz = b[1] - a[1], l = Math.hypot(dr, dz) || 1
    const t = (i / n) * TAU
    return [(dz / l) * Math.cos(t), (dz / l) * Math.sin(t), -dr / l]
  }
  for (let k = 0; k < rings.length - 1; k++)
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      part.tri(rings[k][i], rings[k][j], rings[k + 1][j], undefined, undefined, undefined, [nrm(k, i), nrm(k, j), nrm(k + 1, j)])
      part.tri(rings[k][i], rings[k + 1][j], rings[k + 1][i], undefined, undefined, undefined, [nrm(k, i), nrm(k + 1, j), nrm(k + 1, i)])
    }
  if (top) part.cap(rings[rings.length - 1], true)
}

const T0 = DECK
// Foot: the inscribed drum, Ø13 m, 3.5 m tall, with a soft top edge.
lathe(stone, [[6.5, T0 - 0.2], [6.5, T0 + 3.2], [6.2, T0 + 3.5]], 48, true)
// The fluted shaft, Ø11.2 → Ø9.4 m, to the cap at +61.5 m.
const R0 = 5.6, R1 = 4.7, TOP = T0 + 61.5
const shaftAt = (z: number) => shaftRing(z, R0 + (R1 - R0) * (z - (T0 + 3.5)) / (TOP - T0 - 3.5))
smoothLoft(stone, [shaftAt(T0 + 3.4), shaftAt(T0 + 30), shaftAt(TOP)])
// Cap drum, cornice and shallow dome (lidar: rim 65.1, top 66.7 above the deck).
lathe(stone, [[4.85, TOP - 0.05], [4.6, TOP + 0.1], [4.6, T0 + 64.5], [4.85, T0 + 64.6], [4.85, T0 + 65.1],
  [4.3, T0 + 65.2], [3.6, T0 + 65.9], [2.4, T0 + 66.45], [1.0, T0 + 66.7], [0.01, T0 + 66.75]], 24, false)

// The four Guardian Spirits on the diagonal lobes, hooded by stepped wings.
for (let q = 0; q < 4; q++) {
  const t = Math.PI / 4 + q * Math.PI / 2
  const c = Math.cos(t), s = Math.sin(t)
  const zr = (z: number) => R0 + (R1 - R0) * (z - (T0 + 3.5)) / (TOP - T0 - 3.5)
  // Build each block in a local frame: u across the lobe, w outward, z up.
  const block = (u0: number, u1: number, w0: number, w1: number, z0: number, z1: number) => {
    const P = (u: number, w: number, z: number): V3 => [c * w - s * u, s * w + c * u, z]
    const b = ccw([P(u0, w0, z0), P(u1, w0, z0), P(u1, w1, z0), P(u0, w1, z0)])
    const tp = ccw([P(u0, w0, z1), P(u1, w0, z1), P(u1, w1, z1), P(u0, w1, z1)])
    stone.loft([b, tp])
    stone.cap(tp, true)
    stone.cap(b, false)
  }
  const zb = T0 + 47.5, zh = T0 + 56.6
  const w = zr(zh) - 0.6
  block(-0.85, 0.85, w, w + 1.05, zb, zh)                       // the robed figure
  block(-0.5, 0.5, w + 0.15, w + 1.0, zh, zh + 1.4)             // head and headdress
  for (const side of [-1, 1]) {                                  // stepped wings either side
    block(side < 0 ? -1.75 : 0.85, side < 0 ? -0.85 : 1.75, w - 0.1, w + 0.6, zb + 2.5, zh + 2.6)
    block(side < 0 ? -2.3 : 1.75, side < 0 ? -1.75 : 2.3, w - 0.3, w + 0.25, zb + 5.0, zh + 2.0)
  }
}

// The flame: a puff of steam over the dome, lit orange at night.
for (const [x, y, z, r, h] of [[0, 0, 67.3, 2.1, 1.6], [0.4, 0.2, 68.7, 1.6, 1.5], [0.9, 0.3, 70.0, 1.0, 1.2]] as const) {
  const prof: [number, number][] = []
  for (let k = 0; k <= 5; k++) {
    const a = -Math.PI / 2 + (k / 5) * Math.PI
    prof.push([Math.max(0.01, r * Math.cos(a)), T0 + z + h * 0.5 * Math.sin(a)])
  }
  const part = new Part()
  lathe(part, prof, 10, false)
  // shift the puff off-axis a little
  for (let i = 0; i < part.pos.length; i += 3) { part.pos[i] += x; part.pos[i + 2] -= y }
  flame.pos.push(...part.pos); flame.nrm.push(...part.nrm); flame.uv.push(...part.uv)
}

// --- write ------------------------------------------------------------------
const tower = (p: V3) => Math.hypot(p[0], p[1]) < 9 && p[2] > DECK - 0.5
const lit = (p: V3, n: V3) => {
  if (tower(p)) return 1   // floodlit from foot to cap
  if (n[1] > 0.7 && p[1] > 21.5 && Math.abs(p[0]) < 32 && p[2] < BAND) return 0.85   // the frieze wall
  if (n[1] < -0.7 && p[1] < -47 && p[2] < TERRACE + 1.2) return 0.8                    // the museum's south front
  return 0
}
const STONE: MaterialSpec = { ...finish('memorial-limestone', 0xefe3cb), floodlight: lit }
const parts = [
  { part: stone, material: STONE },
  { part: win, material: PALETTE.window },
  // Dark slate-teal: the halls' bronze and glass openings and the museum skylights by day; dark at night.
  { part: glass, material: finish('glass', 0x6f8792, 0.3) },
  { part: roof, material: finish('hall-roof', 0x9fb2aa) },
  { part: lawn, material: finish('lawn', 0x9db37f, 0.95) },
  { part: flame, material: finish('neon-steam', 0xf3e4d4, 0.6) },
]
const triangles = parts.reduce((a, { part }) => a + part.triangles, 0)
console.log(parts.map(({ part, material }) => `${material.name}: ${part.triangles}`).join('\n'))
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('National WWI Museum and Memorial', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres, origin at ground', height: T0 + 70.6, bearing: 14.2,
})
await Bun.write(new URL('../models/kc-liberty-memorial.glb', import.meta.url), glb)
console.log(`kc-liberty-memorial.glb: ${triangles} triangles, ${glb.length} bytes`)
