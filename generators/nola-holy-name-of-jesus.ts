/**
 * Holy Name of Jesus Church, Loyola University, 6367 St. Charles Avenue, New
 * Orleans (1914-18, Wogan & Bernard; English Gothic) — procedural, CC0-1.0,
 * no textures. bun generators/nola-holy-name-of-jesus.ts
 *
 * Also exports the Loyola brick-and-stone palette used by nola-marquette-hall.
 *
 * Map frame: x = model east, y = model north, z up, metres; origin at the
 * anchor on the ground. Placed at bearing 26.3: model +y runs up the nave
 * from the St. Charles Avenue front (model −y, facing compass 206.3°) to the
 * apse. Anchor: the area centroid of OSM relation/4577137 (geometry below is drawn
 * about a point 3.04 m west, 0.30 m south of it in this frame, then shifted).
 *
 * Identity, in order: the massive square tower centred on the avenue front,
 * dark red brick with pale stone corner buttresses, a tall traceried belfry
 * window a face, and its openwork stone crown with four tall corner
 * pinnacles, smaller ones between and a cross; the pale stone portal under
 * the tower; the long nave behind with a pierced parapet and pinnacled piers
 * over big traceried clerestory windows, the low grey roof hidden behind it;
 * the lower aisles with crenellated parapets; the apse; the low arcaded
 * cloister walk along the east side facing Marquette Hall's lawn.
 *
 * NOTE: the lead's brief said "light stone/terracotta church with a tall
 * square corner tower". Every photo shows red brick with pale stone trim and
 * a tower centred on the front; the model follows the photos.
 *
 * Evidence
 * - OSM relation/4577137 (building=church, height=50, wikidata Q133049494;
 *   outer ways 327443108 and 327443096, the latter shared with Marquette
 *   Hall's relation/4577139).
 * - Lidar: USGS 3DEP LA_2021GNO_1_C22 (Greater New Orleans, flown 2021-22),
 *   0.5 m grid read in this frame; ground 0.7 over the grid minimum = z 0.
 *   Tower x −4.4..6.3, y −33..−22.5, roof deck 39.3, crown ~43.5,
 *   pinnacles 48.4-49.1; nave parapet 21.4 over x ±6.3, ridge 24.3; aisles
 *   x ±(6.3..11) at 10.8; apse to y 27.3; sacristy 7.8; the front side
 *   blocks 11.2-12; the east gabled block ridge 17.4; the east porch 8.4;
 *   the cloister walk 3.4.
 * - NAIP (USGS, public domain): the grey nave roof, the tower's plan.
 * - Photos (Wikimedia Commons, all evidence):
 *   - "Holy Name of Jesus Church, Loyola U New Orleans October 2025 - 1.jpg"
 *     and "- 2.jpg", Infrogmation, CC BY-SA 4.0: the tower face-on from St.
 *     Charles, and from down the avenue
 *     https://commons.wikimedia.org/wiki/File:Holy_Name_of_Jesus_Church,_Loyola_U_New_Orleans_October_2025_-_1.jpg
 *     https://commons.wikimedia.org/wiki/File:Holy_Name_of_Jesus_Church,_Loyola_U_New_Orleans_October_2025_-_2.jpg
 *   - "New Orleans (LA, USA) Holy Name of Jesus Church.jpg", Arnoldius,
 *     CC BY-SA 4.0: the east side and tower from the south-east
 *     https://commons.wikimedia.org/wiki/File:New_Orleans_(LA,_USA)_Holy_Name_of_Jesus_Church.jpg
 *   - "Loyola - New Orleans - Holy Name Church 2013.jpg", Ed Bierman,
 *     CC BY 2.0: the east elevation (clerestory, aisle, cloister)
 *     https://commons.wikimedia.org/wiki/File:Loyola_-_New_Orleans_-_Holy_Name_Church_2013.jpg
 *   - "The Holy Name of Jesus Catholic Church.JPG", Paolo Zampella,
 *     CC BY-SA 3.0: the tower's stages and crown from below
 *     https://commons.wikimedia.org/wiki/File:The_Holy_Name_of_Jesus_Catholic_Church.JPG
 *   - "Loyola-New Orleans.jpg", Pierre5018, CC BY-SA 4.0: the east side
 *     https://commons.wikimedia.org/wiki/File:Loyola-New_Orleans.jpg
 * - Published: Wikipedia, "Loyola University New Orleans" / parish
 *   history: built 1914-18, English Gothic.
 *
 * Measured (lidar): every height and plan dimension above. Estimated from
 * the face-on photo against the lidar tower height: the stage line (26),
 * belfry window (3.6 m wide, 26.8-37.5), the window over the portal
 * (10.5-18), the portal (7 m surround to 9.0, doors to 4.8), the crown's
 * small pinnacles and cross. Clerestory and aisle bays: eight, read from the
 * east photos; window heights estimated. The west side (no clear photo) is
 * drawn as the mirror of the east, without the cloister.
 *
 * Doubts: the west elevation and the apse are hidden by trees and
 * neighbours in every photo found; they are kept plain.
 *
 * Night: the tower is floodlit (`floodlight`), the windows glow.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'
import { finishModel, prism, type XY } from './nyc-570-lexington'
import { block, wallFrame } from './nyc-city-hall'
import { quad, tri, slabY, slabX, pointedShape, wall, type Side, rect, buttress, pinnacle, merlons, barCross, rectRing, gableRoof } from './nola-st-patricks-church'

/** The kit's flat pointed-arch panel, with fewer segments (3 a side) to save bytes. */
export function pointed(p: Part, side: Side, c: number, t: number, w: number, z0: number, zTop: number, d = 0.05, k = 1, segs = 3) {
  const [a, b, s] = wall(side, c)
  const f = wallFrame(a, b, d), pts = pointedShape(s(t), w, z0, zTop, k, segs)
  const cz = Math.max(z0, zTop - w * 1.2)
  for (let i = 0; i < pts.length; i++) {
    const A = pts[i], B = pts[(i + 1) % pts.length]
    if (Math.hypot(A[0] - B[0], A[1] - B[1]) < 1e-6) continue
    p.tri(f.at(s(t), cz), f.at(A[0], A[1]), f.at(B[0], B[1]))
  }
}

/** Loyola's dark red brick, pulled to the palette's lightness, and its pale cast stone. */
export const LOYOLA_BRICK: Swatch = finish('loyola-brick', 0xa45f50)
export const LOYOLA_STONE: Swatch = finish('loyola-stone', 0xece2d2)

/** A gable roof with its ridge along x at y = cy (half-width hy), x0..x1. */
export function gableRoofX(p: Part, cy: number, hy: number, x0: number, x1: number, ze: number, zr: number, o = 0.3) {
  const ye = hy + o, zo = ze - (o * (zr - ze)) / hy
  for (const s of [-1, 1]) quad(p, [x0, cy + s * ye, zo], [x1, cy + s * ye, zo], [x1, cy, zr], [x0, cy, zr], [0, (s * (zr - ze)) / hy, 1])
}

/** Crenellations along the edge of a flat roof: a coping band and merlons, all in stone. */
export function crenels(p: Part, a: XY, b: XY, z: number, h = 0.8, w = 1.0, gap = 1.2, t = 0.35) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.round((L + gap) / (w + gap)))
  merlons(p, a, b, z, z + h, n, w, t)
}

function build() {
  const brick = new Part(), stone = new Part(), roof = new Part(), win = new Part(), door = new Part()

  // ---------------- Dimensions (lidar, above ground) ----------------
  const NX = 6.3, NY0 = -22.5, NY1 = 21.0, PAR = 21.4, RIDGE = 24.3
  const AX = 11.0, AISLE = 10.8
  const TX0 = -4.4, TX1 = 6.3, TY0 = -33.0, TY1 = -22.5, TC = (TX0 + TX1) / 2
  const DECK = 39.3, CROWN = 42.0, PIN = 48.8

  // ---------------- Nave (clerestory), pierced parapet, low roof ----------------
  prism({ wall: brick, win: null, roof: null, ring: rectRing(-NX, NY0, NX, NY1), z0: 0, z1: PAR - 1.2, facade: null, bevel: 0.1 })
  gableRoof(roof, 0, NX - 0.5, NY0, NY1, PAR - 1.3, RIDGE, 0)
  for (const s of [-1, 1]) {
    const x = s * NX
    // parapet: a broad pale stone openwork band (reads light in every photo)
    block(stone, s < 0 ? x - 0.2 : x - 0.35, NY0 + 0.5, s < 0 ? x + 0.35 : x + 0.2, NY1, PAR - 1.7, PAR)
  }
  // eight bays: clerestory windows between pinnacled piers; aisle windows below
  const B0 = -16.0, BAY = 4.6, NB = 8
  for (const s of [-1, 1]) {
    const side = s < 0 ? 'west' : 'east'
    for (let k = 0; k <= NB; k++) {
      const y = B0 + k * BAY
      // pier on the clerestory with a stone pinnacle above the parapet
      block(brick, s < 0 ? -NX - 0.5 : NX, y - 0.35, s < 0 ? -NX : NX + 0.5, y + 0.35, AISLE, PAR - 1.2)
      pinnacle(stone, s * (NX + 0.05) - 0.35, y - 0.35, s * (NX + 0.05) + 0.35, y + 0.35, PAR - 1.2, PAR + 0.5, PAR + 1.6, 0.06)
      // aisle buttress with stone set-offs
      buttress(brick, s < 0 ? -AX - 0.7 : AX, y - 0.4, s < 0 ? -AX : AX + 0.7, y + 0.4, 0, 8.6, 'x', 0.7, stone)
    }
    for (let k = 0; k < NB; k++) {
      const y = B0 + (k + 0.5) * BAY
      pointed(stone, side, s * NX, y, 3.7, 13.0, 19.2, 0.04, 0.8)
      pointed(win, side, s * NX, y, 3.2, 13.3, 18.8, 0.08, 0.8)
      for (const d of [-0.55, 0.55]) rect(stone, side, s * NX, y + d * s, 0.16, 13.3, 17.6, 0.12)
      if (s > 0 || true) {
        pointed(stone, side, s * AX, y, 3.2, 2.6, 8.6, 0.04, 0.8)
        pointed(win, side, s * AX, y, 2.8, 2.9, 8.2, 0.08, 0.8)
        for (const d of [-0.48, 0.48]) rect(stone, side, s * AX, y + d, 0.16, 2.9, 7.2, 0.12)
      }
    }
  }
  // aisles: flat roofs with crenellated stone parapets
  for (const s of [-1, 1]) {
    const xa = s < 0 ? -AX : NX, xb = s < 0 ? -NX : AX
    prism({ wall: brick, win: null, roof: roof, coping: stone, ring: rectRing(xa, -16.9, xb, NY1), z0: 0, z1: AISLE, facade: null, bevel: 0.15 })
    crenels(stone, [s * AX, -16.6], [s * AX, NY1 - 0.3], AISLE - 0.05)
  }

  // ---------------- Transept stubs (gabled, mid-nave) ----------------
  for (const s of [-1, 1]) {
    const x0 = s < 0 ? -13.8 : AX, x1 = s < 0 ? -AX : 13.6
    prism({ wall: brick, win: null, roof: null, ring: rectRing(x0, 9.8, x1, 16.3), z0: 0, z1: 11.2, facade: null, bevel: 0.1 })
    gableRoofX(roof, 13.05, 3.25, s < 0 ? x0 : NX, s < 0 ? -NX : x1, 11.2, 15.2, 0.2)
    const xe = s < 0 ? x0 : x1
    slabX(brick, [[9.8, 11.1], [16.3, 11.1], [13.05, 15.2]], s < 0 ? xe : xe - 0.3, s < 0 ? xe + 0.3 : xe)
    slabX(stone, [[9.5, 11.0], [13.05, 15.5], [16.6, 11.0], [16.6, 11.5], [13.05, 16.0], [9.5, 11.5]], s < 0 ? xe - 0.2 : xe - 0.1, s < 0 ? xe + 0.1 : xe + 0.2, [13.05, 13])
    const side = s < 0 ? 'west' : 'east'
    pointed(stone, side, xe, 13.05, 3.6, 4.0, 12.6, 0.04)
    pointed(win, side, xe, 13.05, 3.0, 4.4, 12.2, 0.08)
    for (const d of [-0.75, 0.75]) rect(stone, side, xe, 13.05 + d, 0.16, 4.4, 10.4, 0.12)
  }

  // ---------------- Apse and sacristy ----------------
  {
    const n = 4, cy = NY1, r = NX, ring: XY[] = []
    for (let k = 0; k <= n; k++) { const a = (k / n) * Math.PI; ring.push([r * Math.cos(a), cy + r * Math.sin(a)]) }
    const apex: V3 = [0, cy, RIDGE]
    for (let k = 0; k < n; k++) {
      const a = ring[k], b = ring[k + 1], m: V3 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - cy, 0]
      quad(brick, [a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], PAR - 1.2], [a[0], a[1], PAR - 1.2], m)
      quad(stone, [a[0], a[1], PAR - 1.2], [b[0], b[1], PAR - 1.2], [b[0], b[1], PAR - 0.6], [a[0], a[1], PAR - 0.6], m)
      tri(roof, [a[0], a[1], PAR - 0.6], [b[0], b[1], PAR - 0.6], apex, [m[0], m[1], 4])
      const c = [(a[0] + b[0]) / 2 + m[0] * 0.012, (a[1] + b[1]) / 2 + m[1] * 0.012], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      const u = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], w = 0.9
      quad(win, [c[0] - u[0] * w, c[1] - u[1] * w, 11.5], [c[0] + u[0] * w, c[1] + u[1] * w, 11.5], [c[0] + u[0] * w, c[1] + u[1] * w, 18.0], [c[0] - u[0] * w, c[1] - u[1] * w, 18.0], m)
    }
  }
  prism({ wall: brick, win: null, roof: roof, coping: stone, ring: rectRing(-5.9, 25.5, 7.8, 36.3), z0: 0, z1: 7.8, facade: null, bevel: 0.15 })
  prism({ wall: brick, win: null, roof: roof, coping: stone, ring: rectRing(-2.3, 36.3, 4.6, 39.9), z0: 0, z1: 7.8, facade: null, bevel: 0.15 })
  for (const x of [-3.5, 0.95, 5.4]) { pointed(win, 'rear', 36.3, x, 1.3, 2.5, 6.2, 0.06) }

  // ---------------- Front side blocks, east gabled block and porch ----------------
  for (const [x0, x1] of [[-11.5, TX0], [TX1, 14.0]] as [number, number][]) {
    prism({ wall: brick, win: null, roof: roof, coping: stone, ring: rectRing(x0, -28.4, x1, -16.9), z0: 0, z1: 11.4, facade: null, bevel: 0.15 })
    crenels(stone, [x0 + 0.2, -28.4], [x1 - 0.2, -28.4], 11.35)
    const xm = (x0 + x1) / 2
    pointed(stone, 'front', -28.4, xm, 2.8, 2.6, 9.6, 0.04)
    pointed(win, 'front', -28.4, xm, 2.3, 2.9, 9.2, 0.08)
    rect(stone, 'front', -28.4, xm, 0.16, 2.9, 7.8, 0.12)
  }
  crenels(stone, [-11.5, -28.1], [-11.5, -17.2], 11.35)
  // the east gabled block (its gable faces the lawn) and the gabled porch
  prism({ wall: brick, win: null, roof: null, ring: rectRing(TX1, -22.4, 13.5, -15.8), z0: 0, z1: 12.0, facade: null, bevel: 0.1 })
  gableRoofX(roof, -19.1, 3.3, TX1, 13.5, 12.0, 17.4, 0.2)
  slabX(brick, [[-22.4, 11.9], [-15.8, 11.9], [-19.1, 17.4]], 13.2, 13.5)
  slabX(stone, [[-22.7, 11.8], [-19.1, 17.6], [-15.5, 11.8], [-15.5, 12.3], [-19.1, 18.1], [-22.7, 12.3]], 13.4, 13.7, [-19.1, 14.5])
  pointed(stone, 'east', 13.5, -19.1, 3.0, 4.0, 15.2, 0.04)
  pointed(win, 'east', 13.5, -19.1, 2.5, 4.3, 14.8, 0.08)
  for (const d of [-0.62, 0.62]) rect(stone, 'east', 13.5, -19.1 + d, 0.16, 4.3, 12.4, 0.12)
  prism({ wall: brick, win: null, roof: null, ring: rectRing(13.5, -22.2, 20.0, -16.0), z0: 0, z1: 6.0, facade: null, bevel: 0.1 })
  gableRoofX(roof, -19.1, 3.1, 13.5, 20.0, 6.0, 8.4, 0.15)
  slabX(stone, [[-22.2, 5.9], [-16.0, 5.9], [-19.1, 8.6]], 19.8, 20.15)
  pointed(stone, 'east', 20.15, -19.1, 3.0, 0, 5.4, 0.04)
  pointed(door, 'east', 20.15, -19.1, 2.2, 0, 4.6, 0.08)
  prism({ wall: brick, win: null, roof: roof, coping: stone, ring: rectRing(14.0, -26.4, 21.6, -23.8), z0: 0, z1: 4.2, facade: null, bevel: 0.1 })

  // ---------------- The cloister walk along the east side ----------------
  prism({ wall: brick, win: null, roof: roof, coping: stone, ring: rectRing(AX, -15.7, 17.6, 9.8), z0: 0, z1: 3.4, facade: null, bevel: 0.1 })
  prism({ wall: brick, win: null, roof: roof, coping: stone, ring: rectRing(13.6, 9.8, 17.6, 26.0), z0: 0, z1: 3.4, facade: null, bevel: 0.1 })
  block(stone, 17.5, -15.7, 17.8, 26.0, 3.0, 3.9)
  for (let y = -14.0; y < 25.5; y += 3.6) {
    pointed(stone, 'east', 17.6, y, 2.2, 0.0, 2.8, 0.04)
    pointed(door, 'east', 17.6, y, 1.7, 0.0, 2.4, 0.08)
  }

  // ---------------- The tower ----------------
  prism({ wall: brick, win: null, roof: roof, coping: stone, ring: rectRing(TX0, TY0, TX1, TY1), z0: 0, z1: DECK, facade: null, bevel: 0.1 })
  // stage line, cornice under the crown
  prism({ wall: stone, win: null, roof: null, ring: rectRing(TX0 - 0.2, TY0 - 0.2, TX1 + 0.2, TY1 + 0.2), z0: 25.8, z1: 26.4, facade: null, bevel: 0.05 })
  prism({ wall: stone, win: null, roof: null, ring: rectRing(TX0 - 0.35, TY0 - 0.35, TX1 + 0.35, TY1 + 0.35), z0: DECK - 0.8, z1: DECK + 0.2, facade: null, bevel: 0.05 })
  // the openwork crown: a stone screen with dark openings, all four faces
  const cr = rectRing(TX0 - 0.15, TY0 - 0.15, TX1 + 0.15, TY1 + 0.15)
  prism({ wall: stone, win: null, roof: stone, ring: cr, z0: DECK + 0.2, z1: CROWN, facade: null, bevel: 0.05 })
  for (const [side, c, m, L] of [['front', TY0 - 0.15, TC, TX1 - TX0], ['rear', TY1 + 0.15, TC, TX1 - TX0], ['west', TX0 - 0.15, (TY0 + TY1) / 2, TY1 - TY0], ['east', TX1 + 0.15, (TY0 + TY1) / 2, TY1 - TY0]] as ['front' | 'rear' | 'west' | 'east', number, number, number][]) {
    for (const k of [-1.5, -0.5, 0.5, 1.5]) pointed(door, side, c, m + k * (L - 3.4) / 4, 1.2, DECK + 0.6, CROWN - 0.3, 0.05)
    // the belfry window: stone surround, glass, two mullions and a transom
    pointed(stone, side, c + (side === 'front' ? 0.15 : side === 'rear' ? -0.15 : side === 'west' ? 0.15 : -0.15), m, 4.3, 26.5, 38.0, 0.04)
    const cc = c + (side === 'front' ? 0.15 : side === 'rear' ? -0.15 : side === 'west' ? 0.15 : -0.15)
    pointed(win, side, cc, m, 3.6, 26.8, 37.5, 0.08)
    for (const d of [-0.6, 0.6]) rect(stone, side, cc, m + d, 0.18, 26.8, 35.4, 0.12)
    rect(stone, side, cc, m, 3.6, 31.4, 31.65, 0.12)
    // corner buttresses' pale stone niches (the tall panels each side of the belfry)
    for (const d of [-1, 1]) rect(stone, side, cc, m + d * ((side === 'front' || side === 'rear' ? TX1 - TX0 : TY1 - TY0) / 2 - 1.0), 0.9, 27.0, 35.5, 0.6)
    if (side !== 'front') { pointed(win, side, cc, m, 1.3, 13.5, 21.5, 0.08) }
  }
  // clasping corner buttresses with stone set-offs, and the pinnacles
  for (const [cx, cy] of rectRing(TX0, TY0, TX1, TY1)) {
    const sx = cx < TC ? -1 : 1, sy = cy < (TY0 + TY1) / 2 ? -1 : 1
    for (const [z0, z1, d] of [[0, 13.0, 0.9], [13.0, 26.0, 0.7], [26.0, DECK - 0.8, 0.5]] as [number, number, number][]) {
      const xa = cx + sx * d, ya = cy + sy * d, xi = cx - sx * 1.6, yi = cy - sy * 1.6
      block(brick, Math.min(xi, xa), Math.min(cy, ya), Math.max(xi, xa), Math.max(cy, ya), z0, z1)
      block(brick, Math.min(cx, xa), Math.min(yi, ya), Math.max(cx, xa), Math.max(yi, ya), z0, z1)
      block(stone, Math.min(xi, xa) - 0.05, Math.min(cy, ya) - 0.05, Math.max(xi, xa) + 0.05, Math.max(cy, ya) + 0.05, z1 - 0.45, z1)
      block(stone, Math.min(cx, xa) - 0.05, Math.min(yi, ya) - 0.05, Math.max(cx, xa) + 0.05, Math.max(yi, ya) + 0.05, z1 - 0.45, z1)
    }
    const px = cx + sx * 0.15, py = cy + sy * 0.15, w = 1.2
    pinnacle(stone, px - w / 2, py - w / 2, px + w / 2, py + w / 2, DECK - 0.8, PIN - 3.6, PIN, 0.12)
  }
  // smaller pinnacles along each face of the crown, and the cross over the front
  for (const t of [1 / 3, 2 / 3]) {
    const x = TX0 + (TX1 - TX0) * t, y = TY0 + (TY1 - TY0) * t
    for (const yy of [TY0 - 0.1, TY1 + 0.1]) pinnacle(stone, x - 0.35, yy - 0.35, x + 0.35, yy + 0.35, CROWN - 0.2, CROWN + 1.6, CROWN + 3.2, 0.06)
    for (const xx of [TX0 - 0.1, TX1 + 0.1]) pinnacle(stone, xx - 0.35, y - 0.35, xx + 0.35, y + 0.35, CROWN - 0.2, CROWN + 1.6, CROWN + 3.2, 0.06)
  }
  barCross(stone, TC, TY0 + 0.3, CROWN, 4.0, 1.8, 0.35)
  // the portal and the window over it
  slabY(stone, [[TC - 3.5, 0], [TC + 3.5, 0], [TC + 3.5, 6.2], [TC, 9.6], [TC - 3.5, 6.2]], TY0 - 0.5, TY0 + 0.1, [TC, 4])
  pointed(door, 'front', TY0 - 0.5, TC, 4.2, 0.3, 7.9, 0.06)
  rect(stone, 'front', TY0 - 0.5, TC, 0.35, 0.3, 4.9, 0.1)
  rect(stone, 'front', TY0 - 0.5, TC, 4.2, 4.8, 5.1, 0.1)
  pointed(win, 'front', TY0 - 0.5, TC, 3.4, 5.1, 7.5, 0.1)
  pointed(stone, 'front', TY0, TC, 4.5, 10.2, 18.6, 0.04)
  pointed(win, 'front', TY0, TC, 3.8, 10.5, 18.0, 0.08)
  for (const d of [-0.65, 0.65]) rect(stone, 'front', TY0, TC + d, 0.18, 10.5, 16.0, 0.12)
  block(stone, TC - 4.5, TY0 - 2.2, TC + 4.5, TY0 - 0.5, 0, 0.5)

  // ---------------- Finish ----------------
  // Built about an earlier anchor; shift to the true area centroid of relation/4577137.
  const SH: XY = [-3.04, -0.3]
  for (const p of [brick, stone, roof, win, door]) for (let i = 0; i < p.pos.length; i += 3) { p.pos[i] += SH[0]; p.pos[i + 2] -= SH[1] }
  const lit = (q: V3, n: V3): number => {
    const p: V3 = [q[0] - SH[0], q[1] - SH[1], q[2]]
    const up = n[2] > 0.7 ? 0.3 : 1
    if (p[1] < TY1 + 0.5 && p[0] > TX0 - 2 && p[0] < TX1 + 2) return up * (p[2] > 25 ? 1 : 0.8)
    return 0.05
  }
  finishModel('Holy Name of Jesus Church', 'nola-holy-name-of-jesus', [
    { part: brick, material: { ...LOYOLA_BRICK, floodlight: lit } },
    { part: stone, material: { ...LOYOLA_STONE, floodlight: lit } },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: door, material: finish('hnj-door', 0x4f4440) },
  ], { bearing: 26.3, osm: 'relation/4577137', height: PIN }, 6500)
}

if (import.meta.main) build()
