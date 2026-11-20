/**
 * City Market, Raleigh (1914, James Matthew Kennedy) — original procedural
 * geometry, CC0-1.0.
 * bun generators/ral-city-market.ts [out.glb]
 *
 * Uses the kit in ral-wells-fargo-capitol-center.ts.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of OSM way/47732366, 35.776510,
 * -78.635997. Bearing 2.5: the outline's long sides run 2.5° east of
 * north; in that frame it is x ±15.3, y −28…26.1, with the Martin Street
 * (south) front's middle 14.7 m recessed 4 m between two wings.
 *
 * Identity (photos below): Spanish Mission market hall. On Martin Street a
 * two-storey brick front block: a square tower in the west wing under a
 * low hipped tile roof with an oculus in its faces; in the recessed middle
 * a curved Mission parapet gable with pale stone caps over two round-headed
 * windows; an east wing under its own hipped tile roof. Behind it the long
 * one-storey market hall under a big hipped red tile roof whose eaves run
 * on, at a flatter pitch, over a deep canopy on thin red posts along both
 * sides, with a curved-gabled brick bay half way along each side. Brick
 * red-brown; tile orange-red; doors and window frames red.
 *
 * Evidence:
 *  - plan: OSM way/47732366. Tower 8 m square in the west wing and the
 *    front block 12 m deep: estimated from the OSM notch and Jmturner's
 *    photo. Side bays 8 m wide, centred 3 m north of the anchor: from the
 *    cross roofs on USGS NAIP. Canopy 3 m deep: estimated from the photos.
 *  - heights (no published figures; no lidar covers Raleigh): estimated by
 *    scaling Jmturner's photo on the red door (taken as 2.4 m): canopy
 *    eave 3.3 m, hall ridge 9.3 m, front block walls 8.5 m, middle gable
 *    crest 11 m, tower walls 10.5 m, tower roof peak 13 m, wing roof 11 m.
 *  - ground: Mapterhorn z13 under 1 m across the site; y = 0 the lowest
 *    corner (south-west). Elevation 0.
 *  - colours from the photos, pulled to the palette's lightness.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Raleigh-City-Market-20080321.jpeg, Jmturner, public domain
 *    https://commons.wikimedia.org/wiki/File:Raleigh-City-Market-20080321.jpeg
 *    (from the south-west: tower, Mission gable, hall roof and canopy,
 *    west side bay)
 *  - 39 City Market Raleigh, North Carolina, 2010.jpg, XeresNelro, CC BY-SA
 *    4.0 https://commons.wikimedia.org/wiki/File:39_City_Market_Raleigh,_North_Carolina,_2010.jpg
 *    (the front block close up: brick, arched windows, oculus, red doors)
 *  - Raleigh City Market 3-30-2013.jpg, Cgb628, CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:Raleigh_City_Market_3-30-2013.jpg
 *    (the canopy, its red posts and tile eaves)
 * USGS NAIP for the plan and roof. No look-only sources. No commercial
 * imagery.
 *
 * Doubts: the north end and east side are not photographed (assumed like
 * the west, hipped at the north end); where exactly the tower sits in the
 * front block is read from one photo against the OSM notch; NAIP shows a
 * dark patch near the tower that may be a flat roof; all heights are
 * photo estimates.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Face, rect, ringFaces, face, plate, cap } from './ral-wells-fargo-capitol-center'
import { add2, write } from './atl-one-atlantic-center'

const brick = new Part(), tile = new Part(), trim = new Part(), glass = new Part(), red = new Part()

const G = 0.5 // facade details start at the local ground
const X = 15.3, YS = -28, YN = 26.1, YH = -16 // hall from YH to YN

const P = (f: Face, s: number, z: number, out: number): V3 => {
  const q = add2(add2(f.a, f.t, s), f.n, out)
  return [q[0], q[1], z]
}

/** A hipped roof over a rectangle: eaves at ze, ridge at zr along the long axis. */
function hip(p: Part, x0: number, y0: number, x1: number, y1: number, ze: number, zr: number) {
  const w = x1 - x0, l = y1 - y0
  if (l >= w) {
    const r0 = y0 + w / 2, r1 = y1 - w / 2, xc = (x0 + x1) / 2
    p.quad([x1, y0, ze], [x1, y1, ze], [xc, r1, zr], [xc, r0, zr])
    p.quad([x0, y1, ze], [x0, y0, ze], [xc, r0, zr], [xc, r1, zr])
    p.tri([x0, y0, ze], [x1, y0, ze], [xc, r0, zr])
    p.tri([x1, y1, ze], [x0, y1, ze], [xc, r1, zr])
  } else {
    const r0 = x0 + l / 2, r1 = x1 - l / 2, yc = (y0 + y1) / 2
    p.quad([x0, y0, ze], [x1, y0, ze], [r1, yc, zr], [r0, yc, zr])
    p.quad([x1, y1, ze], [x0, y1, ze], [r0, yc, zr], [r1, yc, zr])
    p.tri([x1, y0, ze], [x1, y1, ze], [r1, yc, zr])
    p.tri([x0, y1, ze], [x0, y0, ze], [r0, yc, zr])
  }
}

/** Eaves soffit under a roof ring overhanging a wall ring at height z. */
function soffit(p: Part, x0: number, y0: number, x1: number, y1: number, d: number, z: number) {
  const o = rect(x0 - d, y0 - d, x1 + d, y1 + d), i = rect(x0, y0, x1, y1)
  for (let k = 0; k < 4; k++) {
    const l = (k + 1) % 4
    p.quad([i[k][0], i[k][1], z], [i[l][0], i[l][1], z], [o[l][0], o[l][1], z], [o[k][0], o[k][1], z])
  }
}

/** The curved Mission parapet profile, 0 at the ends to 1 at the crest. */
function mission(u: number): number {
  const a = Math.abs(u)
  const ease = (t: number) => 0.5 - 0.5 * Math.cos(Math.PI * Math.min(1, Math.max(0, t)))
  if (a < 0.18) return 1
  if (a < 0.5) return 1 - 0.45 * ease((a - 0.18) / 0.32)
  if (a < 0.68) return 0.55
  return 0.55 * (1 - ease((a - 0.68) / 0.32))
}

/** A curved parapet gable standing on face f between s0 and s1, from z0 up by rise. */
function gable(f: Face, s0: number, s1: number, z0: number, rise: number, th = 0.4) {
  const n = 16
  const pts: Array<[number, number]> = []
  for (let i = 0; i <= n; i++) {
    const s = s0 + ((s1 - s0) * i) / n
    pts.push([s, z0 + rise * mission((2 * i) / n - 1)])
  }
  for (let i = 0; i < n; i++) {
    const [sa, za] = pts[i], [sb, zb] = pts[i + 1]
    brick.quad(P(f, sa, z0, 0), P(f, sb, z0, 0), P(f, sb, zb - 0.3, 0), P(f, sa, za - 0.3, 0))
    brick.quad(P(f, sb, z0, -th), P(f, sa, z0, -th), P(f, sa, za - 0.3, -th), P(f, sb, zb - 0.3, -th))
    // the pale stone cap along the top
    trim.quad(P(f, sa, za - 0.3, 0.08), P(f, sb, zb - 0.3, 0.08), P(f, sb, zb, 0.08), P(f, sa, za, 0.08))
    trim.quad(P(f, sa, za, 0.08), P(f, sb, zb, 0.08), P(f, sb, zb, -th - 0.08), P(f, sa, za, -th - 0.08))
    trim.quad(P(f, sb, zb - 0.3, -th - 0.08), P(f, sa, za - 0.3, -th - 0.08), P(f, sa, za, -th - 0.08), P(f, sb, zb, -th - 0.08))
  }
}

/** A round-headed window, red-framed: glass with a pale sill and keystone. */
function archWin(f: Face, s: number, w: number, z0: number, spring: number) {
  const r = w / 2, segs = 10
  plate(red, f, s - r - 0.15, s + r + 0.15, z0 - 0.1, spring, 0.04)
  plate(glass, f, s - r, s + r, z0, spring, 0.07)
  for (let i = 0; i < segs; i++) {
    const a0 = (Math.PI * i) / segs, a1 = (Math.PI * (i + 1)) / segs
    red.tri(P(f, s, spring, 0.04), P(f, s + (r + 0.15) * Math.cos(a0), spring + (r + 0.15) * Math.sin(a0), 0.04), P(f, s + (r + 0.15) * Math.cos(a1), spring + (r + 0.15) * Math.sin(a1), 0.04))
    glass.tri(P(f, s, spring, 0.07), P(f, s + r * Math.cos(a0), spring + r * Math.sin(a0), 0.07), P(f, s + r * Math.cos(a1), spring + r * Math.sin(a1), 0.07))
  }
  plate(trim, f, s - r - 0.35, s + r + 0.35, z0 - 0.35, z0 - 0.1, 0.12, 0.12) // sill
  plate(trim, f, s - 0.25, s + 0.25, spring + r - 0.1, spring + r + 0.45, 0.1, 0.1) // keystone
}

/** An oculus: a round window with a pale cross of stones. */
function oculus(f: Face, s: number, zc: number, r: number) {
  const segs = 14
  for (let i = 0; i < segs; i++) {
    const a0 = (2 * Math.PI * i) / segs, a1 = (2 * Math.PI * (i + 1)) / segs
    trim.tri(P(f, s, zc, 0.04), P(f, s + (r + 0.3) * Math.cos(a0), zc + (r + 0.3) * Math.sin(a0), 0.04), P(f, s + (r + 0.3) * Math.cos(a1), zc + (r + 0.3) * Math.sin(a1), 0.04))
    glass.tri(P(f, s, zc, 0.07), P(f, s + r * Math.cos(a0), zc + r * Math.sin(a0), 0.07), P(f, s + r * Math.cos(a1), zc + r * Math.sin(a1), 0.07))
  }
  for (const [ds, dz] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) plate(trim, f, s + ds * (r + 0.2) - 0.25, s + ds * (r + 0.2) + 0.25, zc + dz * (r + 0.2) - 0.3, zc + dz * (r + 0.2) + 0.3, 0.1, 0.1)
}

/** Brick walls round a ring, with a pale string course. */
function walls(ring: XY[], z1: number) {
  for (const f of ringFaces(ring, 0, z1)) {
    plate(brick, f, 0, f.len, 0, z1, 0, 0)
    plate(trim, f, 0, f.len, G, G + 0.6, 0.06, 0.06) // water table
  }
}

// ── The market hall: brick walls under the canopy, hipped tile roof, canopy on posts.
const CAN = 3, EAVE = 3.3, KNEE = 4.2, RIDGE = 7.6
const hallWall = rect(-X + CAN, YH, X - CAN, YN - CAN)
for (const f of ringFaces(hallWall, 0, KNEE)) {
  plate(brick, f, 0, f.len, 0, KNEE, 0, 0)
  // shopfront windows and red doors, one every 4.5 m
  const n = Math.max(1, Math.round(f.len / 4.5))
  for (let k = 0; k < n; k++) {
    const s0 = (k * f.len) / n + 0.8, s1 = ((k + 1) * f.len) / n - 0.8
    if (k % 3 === 1) plate(red, f, s0 + 0.6, s1 - 0.6, G, G + 2.5, 0.05)
    else plate(glass, f, s0, s1, G + 0.9, G + 2.7, 0.05)
  }
}
// the canopy band (flatter) from the eaves at the outline to the knee over the walls, then the main roof
{
  const o = rect(-X, YH, X, YN), i = rect(-X + CAN, YH + CAN, X - CAN, YN - CAN)
  for (let k = 0; k < 4; k++) {
    const l = (k + 1) % 4
    tile.quad([o[k][0], o[k][1], EAVE], [o[l][0], o[l][1], EAVE], [i[l][0], i[l][1], KNEE], [i[k][0], i[k][1], KNEE])
    tile.quad([o[l][0], o[l][1], EAVE - 0.25], [o[k][0], o[k][1], EAVE - 0.25], [i[k][0], i[k][1], KNEE - 0.25], [i[l][0], i[l][1], KNEE - 0.25]) // underside
    const f = face(o[k], o[l], EAVE - 0.25, EAVE)
    plate(trim, f, 0, f.len, EAVE - 0.45, EAVE, 0, 0) // pale fascia
  }
  hip(tile, -X + CAN, YH + CAN, X - CAN, YN - CAN, KNEE, RIDGE)
  // thin red posts along the canopy edge
  for (const xs of [-X + 0.3, X - 0.3]) {
    for (let y = YH + 2; y < YN - 0.5; y += 4.2) {
      const post = rect(xs - 0.17, y - 0.17, xs + 0.17, y + 0.17)
      for (const f of ringFaces(post, 0, EAVE - 0.3)) plate(red, f, 0, f.len, 0, EAVE - 0.3, 0, 0)
    }
  }
}

// ── The curved-gabled side bays, half way along each side.
for (const sgn of [-1, 1]) {
  const y0 = -1, y1 = 7, xo = sgn * X, xi = sgn * (X - CAN - 1)
  const ring = sgn < 0 ? rect(xo, y0, xi, y1) : rect(xi, y0, xo, y1)
  for (const f of ringFaces(ring, 0, 6)) plate(brick, f, 0, f.len, 0, 6, 0, 0)
  const front = ringFaces(ring, 0, 6).find((f) => f.n[0] * sgn > 0.9)!
  gable(front, 0, front.len, 6, 2.6)
  archWin(front, front.len / 2, 2.2, G + 2.2, 4.0)
  // a short tile roof from the gable back into the hall roof
  const zr = 7.4
  const yc = (y0 + y1) / 2
  tile.quad([xo - sgn * 0.4, y0 - 0.3, 6.3], [xi, y0 - 0.3, 6.3], [xi, yc, zr], [xo - sgn * 0.4, yc, zr])
  tile.quad([xi, y1 + 0.3, 6.3], [xo - sgn * 0.4, y1 + 0.3, 6.3], [xo - sgn * 0.4, yc, zr], [xi, yc, zr])
}

// ── The front block on Martin Street.
const FW = 9.2, WING = 7.35
// west wing: the tower
{
  const ring = rect(-X, YS, -WING, YS + 8), TW = 12, TP = 14.5
  walls(ring, TW)
  for (const f of ringFaces(ring, 0, TW)) {
    plate(trim, f, 0, f.len, TW - 0.6, TW - 0.3, 0.08, 0.08) // cornice band
    if (f.n[1] < -0.9 || f.n[0] < -0.9) {
      oculus(f, f.len / 2, 9.6, 0.95)
      archWin(f, f.len / 2, 1.8, G + 4.4, G + 6.6)
    }
  }
  plate(red, ringFaces(ring, 0, TW)[0], 3.0, 5.0, G, G + 2.6, 0.06) // the corner door under the canopy
  hip(tile, -X - 0.6, YS - 0.6, -WING + 0.6, YS + 8.6, TW, TP)
  soffit(tile, -X, YS, -WING, YS + 8, 0.6, TW)
}
// the recessed middle: curved gable over two round-headed windows
{
  const ring = rect(-WING, YS + 4, WING, YH + 0.01)
  walls(ring, FW)
  const front = ringFaces(ring, 0, FW)[0]
  gable(front, 0, front.len, FW, 2.5)
  archWin(front, front.len * 0.3, 2.0, G + 4.3, G + 6.3)
  archWin(front, front.len * 0.7, 2.0, G + 4.3, G + 6.3)
  for (const s of [front.len * 0.3, front.len * 0.7]) plate(glass, front, s - 1.2, s + 1.2, G + 0.9, G + 2.9, 0.05)
  // the sign band and a red door between
  plate(trim, front, front.len * 0.38, front.len * 0.62, G + 3.0, G + 3.6, 0.08, 0.08)
  plate(red, front, front.len / 2 - 0.9, front.len / 2 + 0.9, G, G + 2.6, 0.06)
  cap(tile, ring, FW - 0.3) // its low roof behind the gable
}
// east wing under its own hipped tile roof
{
  const ring = rect(WING, YS, X, YH + 0.01), WR = 11.6
  walls(ring, FW)
  for (const f of ringFaces(ring, 0, FW)) {
    if (f.n[1] < -0.9) {
      archWin(f, f.len / 2, 1.8, G + 4.3, G + 6.2)
      plate(glass, f, 1.5, f.len - 1.5, G + 0.9, G + 2.9, 0.05)
    }
    if (f.n[0] > 0.9) {
      // the east face: a curved parapet gable over two round-headed windows (XeresNelro)
      gable(f, 0, f.len, FW, 2.6)
      for (const t of [0.3, 0.7]) {
        archWin(f, f.len * t, 2.0, G + 4.4, G + 6.4)
        plate(red, f, f.len * t - 0.8, f.len * t + 0.8, G, G + 2.6, 0.06)
      }
    }
  }
  hip(tile, WING - 0.6, YS - 0.6, X + 0.6, YH + 0.6, FW, WR)
  soffit(tile, WING, YS, X, YH, 0.6, FW)
}

await write('ral-city-market', 'City Market', [
  { part: brick, material: finish('market-brick', 0xc08e74) },
  { part: tile, material: finish('market-tile', 0xc4705a) },
  { part: trim, material: PALETTE.trim },
  { part: glass, material: PALETTE.window },
  { part: red, material: finish('market-red', 0xa8483c) },
], { bearing: 2.5, elevation: 0, height: 14.5, replaces: ['way/47732366'] })
