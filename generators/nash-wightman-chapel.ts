/**
 * Wightman Chapel, Scarritt Bennett Center, Nashville (1928, Henry C.
 * Hibbs; Collegiate Gothic, multi-coloured rubble stone with limestone
 * trim, slate roof): procedural, CC0-1.0.
 * bun generators/nash-wightman-chapel.ts [out.glb]
 *
 * WHERE IT IS — read this first. OSM way/558056306 is named "Whiteman
 * Chapel", but lidar shows it is a 46 × 24 m flat-roofed block (roof
 * 11.4 m) with no gable: not the chapel. The chapel is the gabled
 * building 65 m to the north, facing west down Grand Avenue across 19th
 * Avenue South (photo w01 looks straight along the street at its front).
 * In OSM it is not a building of its own: it is a corner of the single
 * campus-wide outline way/558056302 "Scarritt-Bennett Center". So this
 * model is placed on the real chapel, and `replaces` is left empty (listing
 * way/558056302 would hide the whole campus). The map will keep drawing
 * that outline's extrusion through the chapel until OSM is fixed (split
 * the chapel out of way/558056302, move the name off way/558056306).
 * The Scarritt bell tower (Laskey Hall's tower, 36 m, 40 m to the NE) is
 * a separate building and is not modelled.
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 278.5: +y
 * is the nave's axis pointing at the west front, +x is the south side.
 * Anchor -86.7968215, 36.1457937, on the ridge line at the nave's middle.
 * y = 0 is the ground round the chapel (lidar 161.6 m; flat within 0.3 m).
 *
 * Lidar (measured): USGS 3DEP TN_DavidsonCo_1_2022 (2022), 0.5 m grid, read
 * with tools/lidar_frame.py at bearing 278.5, above y = 0: nave 10 m wide
 * and 40 m long (y -20.5 .. 19.3), eaves 12.6, ridge 15.0; the gable
 * parapets at both ends 16.2; low aisles 2.3 m wide each side, 3.8–4.9;
 * a gabled side chapel bay each side at y -14.5 .. -5.5, ridge ~11; the
 * chancel behind the east end 6.6 m wide to y -24.5, ridge 11.9.
 *
 * Photos (Wikimedia Commons / Flickr; local copies in
 * landmarks-scratch/nash/work/nash-wightman-chapel/photos):
 *  w07 "Scarritt.JPG", Www78, CC BY-SA 3.0 (EVIDENCE) — the west front:
 *      five-light window, limestone frontispiece and doors, buttresses
 *      https://commons.wikimedia.org/wiki/File:Scarritt.JPG
 *  w02 "Scarritt Bennett, Wightman Chapel.jpg", Vhotchki, CC BY-SA 4.0 (EVIDENCE)
 *      https://commons.wikimedia.org/wiki/File:Scarritt_Bennett,_Wightman_Chapel.jpg
 *  w01 "Wightman Chapel at Scarritt-Barrett Center.jpg", Paul Sableman,
 *      CC BY 2.0 (EVIDENCE) — the front from down Grand Avenue
 *      https://commons.wikimedia.org/wiki/File:Wightman_Chapel_at_Scarritt-Barrett_Center.jpg
 *  w06 "Wightman Chapel", Mark Gstohl, CC BY 2.0 (EVIDENCE, Flickr) —
 *      interior: tall traceried side windows, six bays
 *      https://www.flickr.com/photos/48352971@N00/53176622
 *  w03 "Tower at Scarritt Bennett.jpg", Howie Luvzus, CC BY 2.0 (EVIDENCE)
 *      — shows the bell tower is a separate building
 *      https://commons.wikimedia.org/wiki/File:Tower_at_Scarritt_Bennett.jpg
 *  USGS NAIP (public domain): plan, dark slate roofs.
 * Look-only (seen, not relied on): Flickr "Wightman Chapel - Scarritt
 * College" by SeeMidTN.com (CC BY-NC 2.0); "Wightman Chapel @ Scarritt
 * Bennett Center" by fteleaders (CC BY-NC-ND 2.0).
 * No commercial imagery.
 *
 * Estimated (from w07 and w02, scaled to the lidar): the great window
 * (4.6 m wide, sill 6.4, apex 13.6, five lights), the frontispiece
 * (4.6 × 5.6 m, doors 2.6 × 3.0), buttress sizes and set-offs; six bays of
 * side windows (w06). Doubts: the east end and the north side are not
 * photographed; side chapel bays and chancel are from lidar alone.
 * Left out: copper gutters and downpipes, lanterns, carved panel and
 * lettering over the doors, the south wing that joins the campus.
 * Night: windows glow (stained glass lit from inside); doors `entrance`;
 * no floodlighting seen.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Face, flatShape, extrudeShape, rect, finishGlb, writeModel } from './sea-tacoma-union-station'
import { box, quadO, triO } from './nash-tennessee-state-capitol'

const HW = 5.0, YF = 19.3, YB = -20.5
const EAV = 12.6, RID = 15.0, GAB = 16.2

/** Closed walls on a rectangle, split into ≤ 5 m panels along the ground. */
function walls(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number) {
  const r: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  for (let i = 0; i < 4; i++) {
    const a = r[i], b = r[(i + 1) % 4], L = Math.hypot(b[0] - a[0], b[1] - a[1]), m = Math.max(1, Math.ceil(L / 5))
    const out: V3 = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L, 0]
    for (let k = 0; k < m; k++) {
      const P = (t: number, z: number): V3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, z]
      quadO(p, P(k / m, z0), P((k + 1) / m, z0), P((k + 1) / m, z1), P(k / m, z1), out)
    }
  }
}
/** A two-centred pointed arch outline. */
function pointed(s: number, w: number, z0: number, zs: number, k = 0.8, n = 4): XY[] {
  const r = k * w, h = w / 2, A = Math.acos((r - h) / r), out: XY[] = [[s - h, z0], [s + h, z0]]
  for (let i = 0; i <= n; i++) { const a = (i / n) * A; out.push([s + h - r + r * Math.cos(a), zs + r * Math.sin(a)]) }
  for (let i = n - 1; i >= 0; i--) { const a = (i / n) * A; out.push([s - h + r - r * Math.cos(a), zs + r * Math.sin(a)]) }
  return out
}
const apexOf = (w: number, k = 0.8) => { const r = k * w, h = w / 2; return Math.sqrt(r * r - (r - h) * (r - h)) }

/** A gable roof along y over x ∈ [-w, w], with gable walls at the listed ends. */
function gableRoof(roof: Part, wall: Part, cx: number, w: number, y0: number, y1: number, ze: number, zr: number, alongX = false) {
  const P = (x: number, y: number, z: number): V3 => (alongX ? [cx + y, x, z] : [cx + x, y, z])
  for (const s of [-1, 1]) {
    const o = alongX ? [0, s * (zr - ze), w] as V3 : [s * (zr - ze), 0, w] as V3
    quadO(roof, P(s * w, y0, ze), P(s * w, y1, ze), P(0, y1, zr), P(0, y0, zr), o)
  }
  for (const [y, s] of [[y0, -1], [y1, 1]] as [number, number][]) triO(wall, P(-w, y, ze), P(w, y, ze), P(0, y, zr), alongX ? [s, 0, 0] : [0, s, 0])
}

function build() {
  const stone = new Part(), lime = new Part(), roof = new Part(), win = new Part(), door = new Part()

  // ---------------------------------------------------------- nave
  walls(stone, -HW, YB, HW, YF, 0, EAV)
  // roof with a small overhang; coped gable parapets at both ends rise above it
  for (const s of [-1, 1]) quadO(roof, [s * (HW + 0.3), YB, EAV - 0.15], [s * (HW + 0.3), YF, EAV - 0.15], [0, YF, RID], [0, YB, RID], [s * (RID - EAV), 0, HW])
  for (const [y, s] of [[YF, 1], [YB, -1]] as [number, number][]) {
    const t = s > 0 ? y - 0.6 : y
    // gable wall up to the parapet, then a limestone coping
    quadO(stone, [-HW, y, EAV], [HW, y, EAV], [0.6, y, GAB - 0.3], [-0.6, y, GAB - 0.3], [0, s, 0])
    for (const sx of [-1, 1]) {
      const a: V3 = [sx * (HW + 0.15), 0, EAV - 0.2], b: V3 = [0, 0, GAB]
      quadO(lime, [a[0], t, a[2]], [0, t, b[2]], [0, t + 0.6, b[2]], [a[0], t + 0.6, a[2]], [sx * (GAB - EAV), 0, HW])
      quadO(lime, [a[0], y, a[2]], [0, y, b[2]], [0, y, b[2] - 0.35], [a[0], y, a[2] - 0.35], [0, s, 0])
    }
    // the raised gable's back face above the roof
    triO(stone, [-HW, t, EAV], [HW, t, EAV], [0, t, GAB - 0.3], [0, -s, 0])
  }

  // ---------------------------------------------------------- aisles, side chapels, chancel
  for (const sx of [-1, 1]) {
    const xo = sx * (HW + 2.3)
    walls(stone, Math.min(sx * HW, xo), -19.0, Math.max(sx * HW, xo), 14.0, 0, 3.8)
    quadO(roof, [xo + sx * 0.2, -19.0, 3.7], [xo + sx * 0.2, 14.0, 3.7], [sx * HW, 14.0, 4.9], [sx * HW, -19.0, 4.9], [sx * 1.2, 0, 2.5])
    for (const y of [-19.0, 14.0]) triO(stone, [xo, y, 3.8], [sx * HW, y, 4.9], [sx * HW, y, 3.8], [0, y > 0 ? 1 : -1, 0])
    // gabled side chapel bay, ridge across the aisle
    walls(stone, Math.min(sx * HW, sx * 8.0), -14.5, Math.max(sx * HW, sx * 8.0), -5.5, 0, 8.0)
    const P = (u: number, y: number, z: number): V3 => [sx * u, y, z]
    for (const sy of [-1, 1]) quadO(roof, P(HW, -10 + sy * 4.7, 7.9), P(8.3, -10 + sy * 4.7, 7.9), P(8.3, -10, 11.0), P(HW, -10, 11.0), [0, sy * 3.1, 4.5])
    triO(stone, P(8.0, -14.5, 8.0), P(8.0, -5.5, 8.0), P(8.0, -10, 10.9), [sx, 0, 0])
    // its traceried window
    const f: Face = { o: [sx * 8.0, -10, 0], n: [sx, 0] }
    flatShape(lime, f, pointed(0, 3.0, 2.2, 6.0, 0.8, 4), 0.04)
    flatShape(win, f, pointed(0, 2.4, 2.5, 6.0, 0.8, 4), 0.07)
  }
  walls(stone, -3.3, -24.5, 3.3, YB, 0, 9.0)
  gableRoof(roof, stone, 0, 3.5, -24.6, YB, 8.9, 11.9)

  // ---------------------------------------------------------- side windows and buttresses (six bays)
  for (const sx of [-1, 1]) {
    const f: Face = { o: [sx * HW, 0, 0], n: [sx, 0] }
    for (let k = 0; k < 6; k++) {
      const y = YF - 3.3 - k * 5.8
      if (y < -4.5 && y > -15.5) continue // the side chapel bay
      const s = sx * y
      flatShape(lime, f, pointed(s, 2.6, 5.6, 9.4, 0.8, 4), 0.04)
      flatShape(win, f, pointed(s, 2.0, 5.9, 9.6, 0.8, 4), 0.07)
      flatShape(lime, f, rect(s - 0.08, 5.9, s + 0.08, 9.6 + apexOf(2.0) - 0.15), 0.09)
    }
    for (let k = 0; k < 7; k++) {
      const y = YF - 0.4 - k * 5.8
      if (y < YB + 1) continue
      box(stone, sx > 0 ? HW : -HW - 0.7, y - 0.4, sx > 0 ? HW + 0.7 : -HW, y + 0.4, 4.9, 11.2, lime, 0.05)
    }
  }

  // ---------------------------------------------------------- the west front
  const F: Face = { o: [0, YF, 0], n: [0, 1] } // s runs toward -x
  // great five-light window with a limestone surround and mullions
  const GW = 4.6, G0 = 6.4, GS = 11.0
  flatShape(lime, F, pointed(0, GW + 0.9, G0 - 0.4, GS, 0.75, 6), 0.05)
  flatShape(win, F, pointed(0, GW, G0, GS, 0.75, 6), 0.09)
  for (let k = 1; k < 5; k++) {
    const s = -GW / 2 + (k * GW) / 5
    flatShape(lime, F, rect(s - 0.09, G0, s + 0.09, GS + apexOf(GW, 0.75) * Math.sqrt(1 - (s / (GW / 2)) ** 2) * 0.82), 0.11)
  }
  flatShape(lime, F, rect(-GW / 2, 10.0, GW / 2, 10.18), 0.11)
  // frontispiece: limestone block with a sloped cap, Tudor-arched doors
  extrudeShape(lime, F, [[-2.3, 0], [2.3, 0], [2.3, 5.2], [1.9, 5.9], [-1.9, 5.9], [-2.3, 5.2]], 0, 0.7)
  const Fd: Face = { o: [0, YF + 0.7, 0], n: [0, 1] }
  flatShape(stone, Fd, [[-1.6, 0.3], [1.6, 0.3], [1.6, 3.4], [1.0, 3.95], [-1.0, 3.95], [-1.6, 3.4]], 0.02)
  flatShape(door, Fd, rect(-1.3, 0.3, 1.3, 3.3), 0.05)
  // big front buttresses either side of the window, with set-offs, and the corner ones
  for (const sx of [-1, 1]) {
    for (const [x0, w, d, tops] of [[sx * 3.3, 1.3, 1.6, [6.8, 10.6]], [sx * (HW - 0.1), 1.1, 1.2, [5.0, 9.0]]] as [number, number, number, number[]][]) {
      const xa = x0 - w / 2, xb = x0 + w / 2
      box(stone, xa, YF, xb, YF + d, 0, tops[0], lime, 0.05)
      box(stone, xa + 0.1, YF, xb - 0.1, YF + d * 0.55, tops[0], tops[1], lime, 0.05)
    }
  }

  // ---------------------------------------------------------- materials and night
  return finishGlb('Wightman Chapel', [
    { part: stone, material: finish('wightman-rubble', 0xcbbda5) },
    { part: lime, material: finish('wightman-limestone', 0xebe5d8) },
    { part: roof, material: finish('wightman-slate', 0x8b9096) },
    { part: win, material: PALETTE.window },
    { part: door, material: { name: 'entrance', color: 0x8a6440, roughness: 0.7 } },
  ], { bearing: 278.5, height: GAB, replaces: [] }, 5000)
}

if (import.meta.main) await writeModel('nash-wightman-chapel', build())
