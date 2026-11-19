/**
 * Ad Deir (the Monastery), Petra: procedural, CC0-1.0.
 * bun generators/petra-ad-deir.ts
 *
 * Writes two levels of detail in the same frame:
 * - models/petra-ad-deir.glb, the low model (budget 6,500 tris);
 * - models/petra-ad-deir.detail.glb, drawn from zoom 16 (budget 40,000):
 *   rounder columns and tholos, horned Nabataean capitals, the triglyphs
 *   of both Doric friezes, the door's hood and the urn's mouldings.
 *
 * Uses the rock-cut kit exported by petra-al-khazneh.ts (merge that first).
 *
 * Only the carved facade is modelled, as a shallow slab of rock with the
 * carving cut into it: no cliff, no terrain.
 *
 * Map frame: x east, y north, z up, metres. Built turned to bearing 58.4:
 * the model's +y runs into the rock, real ENE; the facade faces the model's
 * -y, real WSW (238.4°), across the plateau to the cafe (way/714022917,
 * 85 m away on that bearing), from where every frontal photo is taken. The
 * facing is the long side of the OSM outline (way/41032088: 45.7 m on
 * 147.5°/327.5°, 14 m deep). The anchor is the outline's centroid
 * (35.4309780, 30.3382077); the facade's wall plane is set 5.5 m in front
 * of it, so the columns stand at about the outline's front edge.
 *
 * Published (cited):
 * - facade 47 m high, 48 m wide; door 8 m high; Doric entablature whose
 *   metopes hold plain roundels; a broken pediment flanking a tholos with a
 *   conical roof and an urn; square-topped towers at either end
 *   (en.wikipedia "Ad Deir").
 *
 * Measured from Bernard Gagnon's frontal photo (taken from the hillside
 * opposite, so barely foreshortened: 15.3 px/m, its ground-to-urn 715 px
 * giving 46.7 m against the published 47):
 * - lower order: columns at x ±4.3, ±8.6, ±14.0 and engaged at the ends
 *   ±21.2, about 2.5 m thick; capitals to 14.9 m, entablature to 17.6 m.
 * - door 3.6 m wide, its hood to 11 m; side niches at ±17.4, 2.9 m wide,
 *   2.6-8.8 m, under segmental pediments.
 * - upper order: pedestals to 18.8 m, columns at the same x to 32 m,
 *   entablature with the roundel frieze to 36.4 m; half-pediments to
 *   40.6 m at their broken inner ends (x ±6.6); end towers ±19.6-24 with
 *   stepped square tops to 39.5 m; tholos 9.2 m across its cornice, cone to
 *   39.5 m, capital to 42.5 m, urn to 46.5 m.
 * - window-like niches: ±11.3 (20-27.1 m) and in the tholos (22-28.4 m).
 *
 * Estimated: every depth, from the oblique photos (Daniel Case, Argenberg):
 * columns half engaged; the recesses beside the tholos and between the
 * pavilions and the towers 3 m deep; the tholos centred 1.5 m behind the
 * wall plane. The capitals are the plain Nabataean horned type, drawn as a
 * flared block with corner horns.
 *
 * Colour: warmer and more ochre than the Treasury. Sunlit stone in Case's
 * photo #e4c1a3-#e8c7a7, shaded #8e6c56-#a26e59 (Gagnon, Case). The body is
 * a tan-ochre pulled to the palette's lightness; carved detail a little
 * paler; the recessed rock and the window-like niches (plain shallow
 * depressions, not openings) a little darker; the door a deep brown.
 *
 * Night: the Monastery is not floodlit as a rule; only a faint wash on the
 * lower storey (Petra by Night is at the Treasury).
 *
 * Elevation 0: the facade stands on the plateau, which the terrain shows.
 *
 * OSM (© OpenStreetMap contributors, ODbL), fetched Nov 2026: way/41032088
 * (building=yes, historic=tomb, tomb=rock-cut, wikidata Q345467) is the
 * only building under the model; the cafe way/714022917 is 85 m away.
 *
 * Photos (EVIDENCE, Wikimedia Commons):
 * - "Ad Deir, Petra.jpg", Bernard Gagnon, CC BY-SA 3.0,
 *   https://commons.wikimedia.org/wiki/File:Ad_Deir,_Petra.jpg
 *   (frontal from the hillside: every width and height)
 * - "Petra - Ad Deir facade.jpg", Alena Belova for Exhibo, CC BY-SA 4.0,
 *   https://commons.wikimedia.org/wiki/File:Petra_-_Ad_Deir_facade.jpg
 *   (frontal from the ground: capitals, niches, door hood)
 * - "Ad-Deir from angle.jpg", Daniel Case, CC BY-SA 3.0,
 *   https://commons.wikimedia.org/wiki/File:Ad-Deir_from_angle.jpg
 *   (oblique from the south-west of the facade: depths, sunlit colour)
 * - "Ad Deir (The Monastery), El Deir, Petra, Jordan.jpg", Vyacheslav
 *   Argenberg, CC BY 4.0,
 *   https://commons.wikimedia.org/wiki/File:Ad_Deir_(The_Monastery),_El_Deir,_Petra,_Jordan.jpg
 *   (frontal from the plateau: column spacing, the tholos)
 *
 * Look-only: none.
 *
 * Doubts: depths are estimates; the tholos's back half and the recesses'
 * real depth are not seen in any photo.
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { finish } from './palette'
import { box, bbox, prismY, lathe, limb, blob, column, shiftY, writeModel, face } from './petra-al-khazneh'

const BEARING = 58.4
/** The facade's wall plane sits this far in front of (south of) the anchor. */
const FRONT = -5.5

type Mats = { body: Part; carve: Part; rock: Part; dark: Part }

/** A horned Nabataean capital: a flared block with a horn at each corner. */
function nabataean(p: Part, x: number, y: number, z0: number, z1: number, r: number, detail: boolean, back = r) {
  const h = z1 - z0, ab = h * 0.22
  // flared block: square section widening upward (a 4-sided lathe turned 45°)
  const w0 = r * 0.95, w1 = r * 1.3
  const ring = (w: number, z: number, yb: number): V3[] => [[x - w, y - w, z], [x + w, y - w, z], [x + w, y + Math.min(w, yb), z], [x - w, y + Math.min(w, yb), z]]
  const a = ring(w0, z0, back), b = ring(w1, z1 - ab, back)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    const out: V3 = [[0, -1, 0], [1, 0, 0], [0, 1, 0], [-1, 0, 0]][i] as V3
    face(p, [a[i], a[j], b[j], b[i]], [out[0], out[1], -0.3])
  }
  box(p, x - w1 - 0.1, x + w1 + 0.1, y - w1 - 0.1, y + Math.min(w1, back) + 0.1, z1 - ab, z1, 'b')
  if (!detail) return
  // the horns: bold square bosses under each front corner of the abacus
  for (const sx of [-1, 1]) {
    box(p, x + sx * w1 - (sx > 0 ? 0.55 : -0.0) - (sx < 0 ? 0.0 : 0), x + sx * w1 + (sx < 0 ? 0.55 : 0), y - w1 - 0.05, y - w1 + 0.5, z1 - ab - h * 0.5, z1 - ab, 'n')
    limb(p, [x + sx * (w1 - 0.25), y - w1 - 0.1, z1 - ab - h * 0.45], [x + sx * (w1 + 0.05), y - w1 - 0.25, z1 - ab - h * 0.1], 0.18, 0.1, 6)
  }
}

/** A Doric frieze from x0 to x1 at front y: triglyphs and roundels in the metopes. */
function frieze(p: Part, x0: number, x1: number, y: number, z0: number, z1: number, detail: boolean, step = 2.4) {
  const n = Math.max(1, Math.round((x1 - x0) / step))
  const st = (x1 - x0) / n
  const h = z1 - z0
  for (let i = 0; i <= n; i++) {
    const x = x0 + i * st
    if (detail) {
      const tw = Math.min(0.9, st * 0.3)
      box(p, Math.max(x0, x - tw / 2), Math.min(x1, x + tw / 2), y - 0.15, y + 0.1, z0 + 0.05, z1 - 0.05, 'nb')
      for (const k of [-1, 1]) box(p, x + k * tw * 0.17 - 0.06, x + k * tw * 0.17 + 0.06, y - 0.25, y - 0.1, z0 + 0.15, z1 - 0.1, 'nb')
    }
    if (i < n) {
      const cx = x + st / 2
      const r = Math.min(h * 0.36, st * 0.3)
      // a roundel: a short drum standing out of the metope
      const seg = detail ? 14 : 8
      const pts = Array.from({ length: seg }, (_, k) => {
        const t = (k / seg) * Math.PI * 2
        return [cx + r * Math.cos(t), (z0 + z1) / 2 + r * Math.sin(t)] as [number, number]
      })
      prismY(p, pts, y - 0.3, y + 0.05, false)
    }
  }
}

function build(detail: boolean): Mats {
  const M: Mats = { body: new Part(), carve: new Part(), rock: new Part(), dark: new Part() }
  const { body, carve, rock, dark } = M
  const cseg = detail ? 20 : 10
  const W = 24 // half width
  const BACK = 7, TOP = 36.4 // the dressed rock ends at the upper cornice; above it the towers, pediments and tholos stand free

  // ---- lower storey ----
  const ZS = 0.6, LC = 13.5, LK = 14.9, LE = 17.6
  // the wall: a solid block from the wall plane back, cut for door and niches
  const DW = 1.8, DH = ZS + 8.0
  box(rock, -W - 0.8, -DW, 0, BACK, 0, LE, 'b')
  box(rock, DW, W + 0.8, 0, BACK, 0, LE, 'b')
  box(rock, -DW, DW, 0, BACK, DH, LE, 'b')
  box(rock, -DW, DW, 0, BACK, 0, ZS, 'b')
  box(dark, -DW, DW, 1.4, BACK - 0.3, ZS, DH, 'b')
  box(rock, -DW, DW, BACK - 0.3, BACK, ZS, DH, 'b')
  // the wall face itself is carved stone: a skin of body colour in front
  // (round the doorway, which is a real 1.4 m recess, dark at the back)
  box(body, -W, -DW, -0.12, 0.0, ZS, LK, 'b')
  box(body, DW, W, -0.12, 0.0, ZS, LK, 'b')
  box(body, -DW, DW, -0.12, 0.0, DH, LK, 'b')
  box(body, -W, W, -0.6, 0.4, 0, ZS, 'b') // stylobate step
  // door frame and hood
  for (const s of [-1, 1]) box(carve, s < 0 ? -DW - 0.6 : DW, s < 0 ? -DW : DW + 0.6, -0.45, 0, ZS, DH + 0.6, 'b')
  box(carve, -DW - 0.8, DW + 0.8, -0.55, 0, DH + 0.6, DH + 1.3, 'b')
  prismY(carve, [[-DW - 1.6, DH + 1.3], [DW + 1.6, DH + 1.3], [0, DH + 2.6]], -0.7, 0)
  if (detail) blob(carve, [0, -0.75, DH + 1.75], [0.45, 0.15, 0.35], 8, 3)
  // side niches with segmental pediments
  for (const s of [-1, 1]) {
    const cx = s * 17.4, nw = 1.45
    box(rock, cx - nw, cx + nw, -0.2, 0.2, 2.6, 8.8, 'b')
    box(carve, cx - nw, cx + nw, -0.4, 0.2, 2.3, 2.6, 'b') // its sill
    for (const k of [-1, 1]) box(carve, cx + k * nw - (k < 0 ? 0.45 : 0), cx + k * nw + (k > 0 ? 0.45 : 0), -0.4, 0, 2.3, 9.2, 'b')
    box(carve, cx - nw - 0.6, cx + nw + 0.6, -0.5, 0, 9.2, 9.7, 'b')
    // the segmental pediment: an arc band
    const pts: [number, number][] = []
    const R = 3.2, zc = 9.7 - R * Math.cos(Math.asin((nw + 0.6) / R))
    const amax = Math.asin((nw + 0.6) / R)
    const n = detail ? 10 : 6
    for (let i = 0; i <= n; i++) {
      const t = -amax + (2 * amax * i) / n
      pts.push([cx + R * Math.sin(t), zc + R * Math.cos(t)])
    }
    prismY(carve, [[cx - nw - 0.6, 9.7], [cx + nw + 0.6, 9.7], ...pts.reverse().map(([a, b]) => [a, b + 0.45] as [number, number])], -0.55, 0)
  }
  // columns: engaged at the wall plane
  const lcols = [-21.2, -14.0, -8.6, -4.3, 4.3, 8.6, 14.0, 21.2]
  const LR = 1.25
  for (const x of lcols) {
    column(body, x, 0, ZS, LC, LR, cseg, { arc: [-Math.PI / 2, Math.PI / 2] })
    nabataean(carve, x, 0, LC, LK, LR * 0.95, detail, 0)
  }
  // quarter pilasters at the outer edges
  for (const s of [-1, 1]) box(body, s < 0 ? -W : W - 1.2, s < 0 ? -W + 1.2 : W, -0.5, 0, ZS, LK, 'b')
  // lower entablature, broken forward over each column
  box(body, -W, W, -0.6, 0.5, LK, LE, 'b')
  frieze(carve, -W + 0.4, W - 0.4, -0.6, LK + 0.9, LE - 0.8, detail, 2.6)
  for (const x of [...lcols, -W + 0.6, W - 0.6]) {
    const hw = Math.abs(x) > 23 ? 0.6 : LR * 1.3
    box(body, x - hw, x + hw, -1.6, -0.6, LK, LE - 0.7, 'b')
  }
  bbox(body, -W - 0.3, W + 0.3, -1.3, 0.5, LE - 0.7, LE, 0.25)
  for (const x of lcols) bbox(body, x - LR * 1.45, x + LR * 1.45, -2.0, -1.0, LE - 0.7, LE, 0.2)

  // ---- upper storey ----
  const UP = 18.8, UC = 30.6, UK = 32.0, UE = 36.4, APEX = 40.6
  // pedestal band over the lower cornice
  box(body, -W, W, -0.9, 0.5, LE, UP - 0.4, 'b')
  // rock behind the upper storey; the recesses stand 3 m back
  const recess = [[-19.6, -15.8], [-6.6, -4.6], [4.6, 6.6], [15.8, 19.6]]
  box(rock, -W - 0.8, W + 0.8, 3.0, BACK, LE, TOP, 'b')
  box(rock, -W - 0.8, W + 0.8, 0.5, 3.0, UE, TOP, 'b')
  // pavilions and towers (front wall at y = 0)
  const solids: [number, number][] = [[-W, -19.6], [-15.8, -6.6], [6.6, 15.8], [19.6, W]]
  for (const [a, b] of solids) box(body, a, b, 0, 3.0, UP - 0.4, UE, 'b')
  // the tholos's core between the inner recesses
  box(rock, -4.6, 4.6, 1.5, 3.0, UP - 0.4, UE, 'b')
  for (const [a, b] of recess) {
    box(rock, a, b, 2.9, 3.0, UP - 0.4, UE, 'b')
    box(body, a, b, 0, 3.0, UK + 0.9, UE, 'b') // the lintel over the recess
  }
  // side frames of the slab
  for (const s of [-1, 1]) box(rock, s < 0 ? -W - 0.8 : W, s < 0 ? -W : W + 0.8, -0.3, 3.0, LE, TOP, 'b')
  // pedestals and columns
  const UR = 1.1
  const ucols = [-21.2, -14.0, -8.6, 8.6, 14.0, 21.2]
  for (const x of ucols) {
    box(body, x - UR * 1.35, x + UR * 1.35, -1.6, 0, UP - 0.4, UP, 'b')
    column(body, x, 0, UP, UC, UR, cseg, { arc: [-Math.PI / 2, Math.PI / 2] })
    nabataean(carve, x, 0, UC, UK, UR * 0.95, detail, 0)
  }
  // window-like niches in the pavilions
  for (const s of [-1, 1]) {
    const cx = s * 11.3
    box(rock, cx - 1.45, cx + 1.45, -0.1, 0.4, 20.0, 27.1, 'b')
    for (const k of [-1, 1]) box(carve, cx + k * 1.45 - (k < 0 ? 0.4 : 0), cx + k * 1.45 + (k > 0 ? 0.4 : 0), -0.35, 0, 19.7, 27.5, 'b')
    box(carve, cx - 1.85, cx + 1.85, -0.45, 0, 27.5, 28.1, 'b')
    box(carve, cx - 1.85, cx + 1.85, -0.35, 0, 19.4, 19.8, 'b')
  }
  // upper entablature over pavilions and towers, broken forward over columns
  for (const [a, b] of solids) {
    box(body, a, b, -0.7, 0, UK, UE - 1.2, 'b')
    frieze(carve, a + 0.3, b - 0.3, -0.7, UK + 1.1, UE - 1.4, detail, 2.3)
    bbox(body, a - 0.25, b + 0.25, -1.2, 0.5, UE - 1.2, UE, 0.25)
  }
  for (const x of ucols) box(body, x - UR * 1.3, x + UR * 1.3, -1.5, -0.7, UK, UK + 1.0, 'b')
  // half-pediments over the pavilions, broken at the inner ends
  for (const s of [-1, 1]) {
    const xo = s * 15.8 + s * 0.25, xi = s * 6.6 - s * 0.25
    const tri: [number, number][] = s < 0 ? [[xo, UE], [xi, UE], [xi, APEX]] : [[xi, UE], [xo, UE], [xi, APEX]]
    prismY(body, tri, -0.9, 3.0)
    const rake: [number, number][] = s < 0
      ? [[xo - 0.15, UE - 0.05], [xo + 0.8, UE - 0.05], [xi, APEX - 0.35], [xi, APEX + 0.45]]
      : [[xo - 0.8, UE - 0.05], [xo + 0.15, UE - 0.05], [xi, APEX + 0.45], [xi, APEX - 0.35]]
    prismY(carve, rake, -1.25, 3.0)
  }
  // square-topped towers at the ends: stepped blocks over the entablature
  for (const s of [-1, 1]) {
    const [a, b] = s < 0 ? [-W, -19.6] : [19.6, W]
    bbox(body, a + 0.2, b - 0.2, -0.9, 3.0, UE, UE + 1.3, 0.2)
    bbox(body, a + 0.6, b - 0.6, -0.5, 3.0, UE + 1.3, UE + 2.6, 0.2)
    bbox(body, a + 0.3, b - 0.3, -0.7, 3.0, UE + 2.6, UE + 3.1, 0.2)
  }
  // the tholos
  const TY = 0.8, TR = 3.1
  const tseg = detail ? 32 : 16
  lathe(body, 0, TY, [[2.7, UP - 0.4], [2.7, UK]], tseg, { a0: -Math.PI * 0.6, a1: Math.PI * 0.6 })
  box(body, -2.5, 2.5, TY - 3.6, TY - 1.2, UP - 0.4, UP, 'b')
  for (const deg of [-62, 62]) {
    const a = (deg * Math.PI) / 180
    const x = TR * Math.sin(a), y = TY - TR * Math.cos(a)
    column(body, x, y, UP, UC, UR, cseg)
    nabataean(carve, x, y, UC, UK, UR * 0.95, detail)
  }
  // the tholos niche
  box(rock, -1.45, 1.45, TY - 2.8, TY - 1.8, 22.0, 28.4, 'b')
  for (const k of [-1, 1]) box(carve, k * 1.45 - (k < 0 ? 0.4 : 0), k * 1.45 + (k > 0 ? 0.4 : 0), TY - 2.95, TY - 2.3, 21.7, 28.8, 'b')
  box(carve, -1.85, 1.85, TY - 3.05, TY - 2.3, 28.8, 29.4, 'b')
  // tholos entablature ring with its roundel frieze, the cone, capital, urn
  const arc = {} // full circles: above the rock's top the tholos stands free
  const RR = 4.6
  lathe(body, 0, TY, [[2.6, UK], [RR - 0.4, UK], [RR - 0.4, UK + 1.0], [RR - 0.55, UK + 1.1], [RR - 0.55, UE - 1.2], [RR, UE - 1.0], [RR + 0.1, UE - 0.2], [RR - 0.1, UE]], tseg, { ...arc, top: false })
  const nd = detail ? 11 : 7
  for (let i = 0; i < nd; i++) {
    const a = -Math.PI * 0.55 + (Math.PI * 1.1 * i) / (nd - 1)
    const r = RR - 0.5
    blob(carve, [r * Math.sin(a), TY - r * Math.cos(a), UK + 2.1], [0.55 * Math.abs(Math.cos(a)) + 0.12, 0.55 * Math.abs(Math.sin(a)) + 0.12, 0.55], detail ? 8 : 5, 3)
  }
  lathe(body, 0, TY, [[RR - 0.1, UE], [RR - 0.8, UE + 0.6], [2.2, UE + 2.2], [1.3, UE + 3.1]], tseg, { ...arc, top: true })
  const ZQ = UE + 3.1
  lathe(carve, 0, TY, [[1.1, ZQ], [1.15, ZQ + 1.6], [1.6, ZQ + 2.4], [1.75, ZQ + 2.6], [1.75, ZQ + 3.0]], detail ? 18 : 10, { top: true })
  const ZU = ZQ + 3.0
  lathe(carve, 0, TY, [[0.9, ZU], [0.8, ZU + 0.3], [1.3, ZU + 0.8], [1.65, ZU + 1.8], [1.4, ZU + 2.6], [0.75, ZU + 3.0], [0.85, ZU + 3.25], [0.4, ZU + 3.6], [0.12, ZU + 3.95]], detail ? 18 : 10, { top: true })

  for (const part of Object.values(M)) shiftY(part, FRONT)
  return M
}

// Night: a faint warm wash on the lower storey only.
const lit = (p: V3, n: V3) => (n[2] > 0.8 || n[1] > 0.5 ? 0 : p[2] < 18 ? 0.35 : 0.15)

function materials(M: Mats): Array<{ part: Part; material: MaterialSpec }> {
  return [
    { part: M.body, material: { ...finish('deir-sandstone', 0xdcaa80), floodlight: lit } },
    { part: M.carve, material: { ...finish('deir-carving', 0xe7c09c), floodlight: lit } },
    { part: M.rock, material: finish('deir-rock', 0xbb8a67) },
    { part: M.dark, material: finish('deir-shadow', 0x5e4436) },
  ]
}

if (import.meta.main) {
  const extras = { bearing: BEARING, elevation: 0, height: 46.5 }
  await writeModel('petra-ad-deir', 'Ad Deir', materials(build(false)), extras, 6500, 250_000)
  await writeModel('petra-ad-deir', 'Ad Deir', materials(build(true)), extras, 40_000, 1536 * 1024, '.detail')
}
