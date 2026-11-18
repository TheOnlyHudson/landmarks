/**
 * Ivan the Great Bell Tower with the Assumption Belfry and the Filaret
 * annexe, Moscow Kremlin: procedural, CC0-1.0.
 * bun generators/moscow-ivan-the-great-bell-tower.ts
 *
 * The bell-tower ensemble on the east side of Cathedral Square: Bon
 * Fryazin's octagonal tower of 1505-08, raised by Boris Godunov in 1600 to
 * 81 m, three white octagons stepping in with arched bell openings, then a
 * ring of gilded kokoshniks, the round drum with its blue band of gold
 * lettering and the gilded dome; north of it Petrok Maly's Assumption
 * Belfry (1532-43, rebuilt 1814-15), a broad two-tier block of big bell
 * arches under a drum and gilded dome; and Patriarch Filaret's annexe of
 * 1624 on its north end, under a tent roof with four small corner tents;
 * along the west front the arcaded porch, the stair up to it and the low
 * terrace by the tower's foot.
 *
 * Frame: built turned so +y runs along the ensemble (bearing 341.8) and +x
 * to its east; the placement's bearing is 341.8. Origin: the area centroid
 * of OSM relation/1359278 (belfry and annexe) and relation/1359281 (the
 * tower) together.
 *
 * Evidence
 * - OSM, fetched 2026-11-18: relation/1359281 (the tower's outline, a
 *   14.9 m octagon) with its parts relation/3059074 (0-25 m) and
 *   way/228393890 (25-46 m, 10.2 m across), way/228393887 (46-51.5 m,
 *   8.4 m), way/228393888 (51.5-67 m, the drum, 7.4 m) and the dome's
 *   stacked rings to 73 m (way/228403053-228403100); relation/1359278 (the
 *   belfry and annexe) with relation/3059065 (the body, 31 m),
 *   relation/3059073 (the bell tier's roof to 38 m), way/228393886 and
 *   way/228393889 (the belfry drum, 9 m across from 35.5 m, then 7.6 m to
 *   51 m) and its dome's rings to 57.5 m, relation/3059127-3059128 (the
 *   annexe's platform and tent, 32-42 m), relation/3059123-3059126 and
 *   way/228396001-228396074 (the four corner tents, to 38.5 m),
 *   relation/3059071 (the annexe's north end, 30 m), relation/3059066,
 *   3059120, way/1571402927 and the columns relation/3059067-3059072 (the
 *   west porch, 10-14.5 m), way/1571284353-1571284354 (the stair, to 13 m),
 *   relation/21784107 (the link to the tower, 13 m), relation/3059106 and
 *   3059121 (the terrace, 4-5.5 m).
 * - Published (ru.wikipedia, "Колокольня Ивана Великого"): 81 m with the
 *   cross; walls 5 m thick in the lowest tier; a gilded copper onion dome;
 *   gold letters on a blue ground under it; the belfry's four-tier base
 *   and three-bay bell tier with a gilded dome; the annexe's tent roof.
 * - Photos, Wikimedia Commons:
 *   - "7328. Bell tower Ivan the Great in Moscow Kremlin.jpg",
 *     Александровы АГ, CC BY-SA 4.0 (the whole ensemble from the west)
 *   - "Ivan the Great Bell Tower 01 by shakko.jpg", shakko, CC BY-SA 3.0
 *     (from the south-west)
 *   - "Moscow. Kremlin. Ivan the Great Bell Tower P5152511 2600.jpg",
 *     Alexxx1979, CC BY-SA 4.0 (from the west across the square)
 *   - "Ivan the Great Bell Tower - exterior, 2006 (01).jpg", Bahnfrend,
 *     CC BY-SA 4.0 (the top: kokoshniks, the lettered band, the dome)
 *   - "Russia-Moscow-Ivan the Great Bell-Tower Complex.jpg", Alex Zelenko,
 *     CC BY-SA 4.0 (the belfry and the annexe's tent)
 *   - "Ivan the Great Bell Tower in Moscow Kremlin 1.jpg", Dmitry Ivanov,
 *     CC BY-SA 4.0 (from the south-east over the trees)
 *
 * Heights are OSM's. Widths: the first tier is OSM's 14.9 m octagon; the
 * upper tiers are 9.7 m and 7.6 m across and the drum 6.6 m, from their
 * ratios to the first tier in shakko's photo (0.65, 0.51, 0.44), narrower
 * than OSM's parts, which take in the cornices. The bell openings are open
 * arches, drawn as dark voids under deep white reveals: on the first tier
 * 2.7 m wide from 17.8 to 22.9 m, on the second 2.2 m wide from 39.6 m,
 * small ones on the third; the belfry's two tiers of great arches (4.8 m
 * wide in the middle of the west front) and the porch's arcade likewise.
 * Estimated from the photos: the openings' sizes and heights; the kokoshnik ring at 51.5-53.5 m; the drum's
 * slit windows and the dark lettered band between gilded rims
 * (60.6-64 m); the row of small kokoshniks on the annexe's parapet; the tower's dome 7.8 m wide
 * and 7 m tall from 64.5 m, its spike to 73 m (OSM's top) and a 6 m cross,
 * so the top is at 79 m against the published 81 (OSM's ground may sit a
 * little above the base the published figure starts from). The belfry's
 * bell arches, parapet and dome (6.5 m tall from 48.5 m, spike to 57 m,
 * a 3 m cross); the annexe's tent's small cupola.
 *
 * Doubts: OSM puts the tower's middle stage in one piece from 25 to 46 m,
 * where the photos show a cornice and bell openings near its top; the
 * stage is drawn as one with a ledge at 37 m. The east side is seen only
 * from far off.
 *
 * Night: walls floodlit, domes lit; windows glow.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { ngon, prism } from './sf-de-young'
import { archPanel, block, quadOut, cross, dome, drum, finishModel, floodDomes, floodWalls, hood, wedge, zakomaraBlock } from './moscow-church-kit'

const white = new Part(), trim = new Part(), gold = new Part(), roof = new Part(), win = new Part(), dark = new Part()
const W: V3 = [-1, 0, 0], AY: V3 = [0, 1, 0]

/** A regular octagon tier, flats facing the axes, `r` to the flats. */
function oct(p: Part, c: [number, number], z0: number, z1: number, r: number, top: Part | null = p) {
  prism(p, ngon(c[0], c[1], r / Math.cos(Math.PI / 8), 8, Math.PI / 8), z0, z1, top)
}
/** Round-headed openings on all eight faces of an octagon. */
function octArches(p: Part, c: [number, number], r: number, sill: number, w: number, jamb: number, hoodTo?: Part) {
  for (let i = 0; i < 8; i++) {
    const t = (Math.PI / 4) * i, n: V3 = [Math.cos(t), Math.sin(t), 0], u: V3 = [-n[1], n[0], 0]
    const o: V3 = [c[0] + r * n[0], c[1] + r * n[1], sill]
    archPanel(p, o, u, n, w, jamb, 8)
    if (hoodTo) hood(hoodTo, [o[0], o[1], sill + jamb], u, n, w / 2 + 0.05, 0.3, 0.25, 6)
  }
}

/** An open arch: a dark void under a white reveal standing `depth` proud, so it reads as a deep opening. */
function openArch(o: V3, u: V3, n: V3, w: number, jamb: number, depth: number) {
  archPanel(dark, o, u, n, w, jamb, 8)
  hood(trim, [o[0], o[1], o[2] + jamb], u, n, w / 2, 0.35, depth, 6)
  for (const sgn of [-1, 1]) {
    const x0 = o[0] + u[0] * sgn * (w / 2), y0 = o[1] + u[1] * sgn * (w / 2)
    const a: V3 = [x0, y0, o[2]], b: V3 = [x0 + u[0] * sgn * 0.35, y0 + u[1] * sgn * 0.35, o[2]]
    const pts = [a, b, [b[0] + n[0] * depth, b[1] + n[1] * depth, o[2]], [a[0] + n[0] * depth, a[1] + n[1] * depth, o[2]]] as V3[]
    for (const [p, q] of [[1, 2], [3, 0]]) {
      const P = pts[p], Q = pts[q], m = [(P[0] + Q[0]) / 2 - (a[0] + b[0]) / 2 - n[0] * depth / 2, (P[1] + Q[1]) / 2 - (a[1] + b[1]) / 2 - n[1] * depth / 2, 0] as V3
      quadOut(trim, P, Q, [Q[0], Q[1], o[2] + jamb], [P[0], P[1], o[2] + jamb], m)
    }
  }
}
/** Open bell arches on all eight faces of an octagon. */
function octOpen(c: [number, number], r: number, sill: number, w: number, jamb: number) {
  for (let i = 0; i < 8; i++) {
    const t = (Math.PI / 4) * i, n: V3 = [Math.cos(t), Math.sin(t), 0], u: V3 = [-n[1], n[0], 0]
    openArch([c[0] + r * n[0], c[1] + r * n[1], sill], u, n, w, jamb, 0.35)
  }
}

// ---------------------------------------------------------------- Ivan the Great
// Tier widths across the flats: the first from OSM's outline (14.9 m); the
// upper ones from the photos' ratios to it (0.65, 0.51, the drum 0.44),
// as OSM's upper parts include their cornices.
const IC: [number, number] = [4.45, -16.6]
oct(white, IC, 0, 24.4, 7.4, null)
oct(trim, IC, 23.8, 25.4, 7.8)                        // the broad cornice of the first tier
oct(white, IC, 25.4, 45.6, 4.85, null)
oct(trim, IC, 37.0, 37.6, 5.05, null)                 // string course
oct(trim, IC, 45.0, 46.4, 5.25)                       // cornice of the second tier
oct(white, IC, 46.4, 51.4, 3.8, null)
oct(trim, IC, 51.0, 51.9, 4.0)
// open bell arches: dark voids under deep white reveals, sized from the photos
octOpen(IC, 7.4, 17.8, 2.7, 3.6)                      // the first tier's bells
octArches(win, IC, 7.4, 8.5, 0.9, 1.6)
octOpen(IC, 4.85, 39.6, 2.2, 3.4)                     // the second tier's bells
octArches(win, IC, 4.85, 31.0, 0.8, 1.4)
octArches(dark, IC, 3.8, 47.4, 1.6, 2.4)         // the third tier's
// the ring of white kokoshniks with gilded edges at the drum's foot
for (let i = 0; i < 8; i++) {
  const t = (Math.PI / 4) * i, n: V3 = [Math.cos(t), Math.sin(t), 0], u: V3 = [-n[1], n[0], 0]
  const o: V3 = [IC[0] + 3.3 * n[0], IC[1] + 3.3 * n[1], 51.9]
  archPanel(white, o, u, n, 2.6, 0.9, 6, 0.3)
  hood(gold, [o[0], o[1], 52.8], u, n, 1.3, 0.2, 0.38, 4)
}
// the drum: slit windows, then the lettered band under the dome between gilded rims
drum({ wall: white, win, trim, c: IC, z0: 51.9, z1: 60.6, r: 3.3, n: 16, windows: 8, winW: 0.6, winH: 2.8, sill: 55.6, cornice: 0.2 })
drum({ wall: gold, c: IC, z0: 60.6, z1: 60.95, r: 3.42, n: 16, cornice: 0 })
drum({ wall: dark, c: IC, z0: 60.95, z1: 63.6, r: 3.38, n: 16, cornice: 0 })
drum({ wall: gold, c: IC, z0: 63.6, z1: 64.0, r: 3.45, n: 16, cornice: 0 })
drum({ wall: trim, c: IC, z0: 64.0, z1: 64.5, r: 3.35, n: 16, cornice: 0.3 })
{ const t = dome(gold, IC, 64.5, 3.75, 7.0, 'helmet', 16, 1.5, 3.65); cross(gold, IC, t - 0.1, 6.0, 'y', 0.35) }

// ---------------------------------------------------------------- the link, the stair, the terrace
block(white, -2.6, -13.2, 0, 11.3, -8.7, 13, roof)
wedge(white, -7.6, -11.7, -2.6, -1.1, 13, 0.6, 'y1', trim)
block(white, -14.9, -15.9, 0, -2.7, -7.4, 4.0, roof)
block(trim, -14.9, -15.9, 4.0, -2.7, -15.5, 5.5, trim)

// the west porch: an open arcade on piers (dark voids under deep reveals), a terrace with a parapet over it
block(white, -8.7, -1.1, 0, -2.6, 15.8, 13.0, roof)
block(trim, -9.0, -1.4, 13.0, -2.6, 16.1, 14.5, roof)
for (const y of [1.25, 7.1, 13.2]) openArch([-8.7, y, 0.7], AY, W, y === 7.1 ? 4.8 : 3.8, 6.2, 0.6)
openArch([-5.65, -1.1, 0.7], [1, 0, 0], [0, -1, 0], 3.6, 5.6, 0.6)
openArch([-5.65, 15.8, 0.7], [1, 0, 0], [0, 1, 0], 3.6, 5.6, 0.6)

// ---------------------------------------------------------------- the Assumption Belfry
const BX0 = -2.6, BX1 = 11.2, BY0 = -8.7, BY1 = 15.7
block(white, BX0, BY0, 0, BX1, BY1, 31, null)
block(trim, BX0 - 0.4, BY0 - 0.4, 30.0, BX1 + 0.4, BY1 + 0.4, 31.0, null)
// the bell tier above the cornice: a parapet of small kokoshniks round a ridged roof
zakomaraBlock({ wall: white, roof, edge: gold, xb: [BX0, 1.0, 4.3, 7.6, BX1], yb: [BY0, -4.3, 0.1, 4.5, 8.9, 12.3, BY1], z0: 31, zs: 33.4, rise: (w) => w * 0.3, n: 2, overhang: 0.25, underside: false })
// two tiers of great open bell arches on the west, south and east fronts
for (const y of [-3.4, 3.5, 10.4]) {
  const big = y === 3.5
  openArch([BX0, y, big ? 14.2 : 15.2], AY, W, big ? 4.8 : 3.8, big ? 7.6 : 6.4, 0.6)
  openArch([BX0, y, 24.0], AY, W, big ? 4.2 : 3.2, big ? 3.6 : 3.0, 0.5)
  openArch([BX1, y, 15.2], AY, [1, 0, 0], 3.6, 6.4, 0.5)
}
for (const x of [1.0, 4.3, 7.6]) {
  openArch([x, BY0, 15.2], [1, 0, 0], [0, -1, 0], 2.8, 6.4, 0.5)
  openArch([x, BY0, 24.0], [1, 0, 0], [0, -1, 0], 2.6, 3.0, 0.45)
}
// drum and dome
const BC: [number, number] = [3.95, 4.0]
drum({ wall: white, trim, c: BC, z0: 34, z1: 41, r: 4.4, n: 16, cornice: 0.3 })
for (let i = 0; i < 12; i++) {
  const t = (Math.PI / 6) * i + Math.PI / 12, n: V3 = [Math.cos(t), Math.sin(t), 0], u: V3 = [-n[1], n[0], 0]
  hood(gold, [BC[0] + 3.95 * n[0], BC[1] + 3.95 * n[1], 41.3], u, n, 0.8, 0.25, 0.3, 3)
}
drum({ wall: white, win, trim, c: BC, z0: 41, z1: 48.5, r: 3.8, n: 16, windows: 8, winW: 0.7, winH: 2.4, sill: 44.0, cornice: 0.3 })
{ const t = dome(gold, BC, 48.5, 4.1, 6.5, 'helmet', 16, 1.6, 4.05); cross(gold, BC, t - 0.1, 3.0, 'y', 0.25) }

// ---------------------------------------------------------------- the Filaret annexe
block(white, -3.2, BY1, 0, 5.5, 24.0, 31, null)
block(white, BX0, 24.0, 0, 4.9, 28.9, 30, roof)
block(white, 5.5, BY1, 0, BX1, 16.5, 31, roof)
block(trim, -3.6, BY1, 29.6, 5.9, 24.4, 30.2, null)
// the parapet's row of small kokoshniks round the tent's platform
zakomaraBlock({ wall: white, roof, edge: gold, xb: [-3.2, -1.0, 1.15, 3.3, 5.5], yb: [BY1, 17.8, 19.85, 21.9, 24.0], z0: 30.2, zs: 31.0, rise: (w) => w / 2, n: 2, overhang: 0.2, keel: 0.4, underside: false })
for (const x of [-1.0, 2.6]) {
  archPanel(win, [x, 28.9, 18.0], [1, 0, 0], [0, 1, 0], 1.6, 3.6, 8)
  archPanel(win, [x, 28.9, 6.0], [1, 0, 0], [0, 1, 0], 1.4, 2.6, 6)
}
for (const y of [17.8, 21.6]) archPanel(win, [-3.2, y, 21.0], AY, W, 1.6, 3.4, 8)
// the tent and its little cupola, and the four corner tents
const FC: [number, number] = [1.15, 19.85]
oct(white, FC, 31.5, 33.5, 2.9)
tent(roof, FC, 33.5, 41.0, 2.9, 8)
drum({ wall: white, c: FC, z0: 40.6, z1: 41.8, r: 0.45, n: 8, cornice: 0 })
{ const t = dome(gold, FC, 41.8, 0.65, 1.1, 'onion', 8, 0.4, undefined, true); cross(gold, FC, t - 0.05, 1.3, 'y', 0.14) }
for (const c of [[-1.75, 22.6], [4.05, 22.6], [-1.75, 17.0], [4.05, 16.9]] as [number, number][]) {
  oct(white, c, 32, 34.5, 0.75)
  tent(roof, c, 34.5, 38.5, 0.75, 8)
}

/** An octagonal tent (shatyor) from radius r at z0 to a point at z1. */
function tent(p: Part, c: [number, number], z0: number, z1: number, r: number, n: number) {
  dome(p, c, z0, r / Math.cos(Math.PI / n), z1 - z0, 'tent', n, 0)
}

await finishModel('moscow-ivan-the-great-bell-tower', 'Ivan the Great Bell Tower', [
  { part: white, material: { ...finish('ivan-white', 0xf4eee5), floodlight: floodWalls } },
  { part: trim, material: { ...PALETTE.trim, floodlight: floodWalls } },
  { part: gold, material: { ...finish('kremlin-gold', 0xdcb25e), floodlight: floodDomes } },
  { part: roof, material: finish('kremlin-iron', 0x737b80) },
  { part: win, material: PALETTE.window },
  { part: dark, material: finish('ivan-shadow', 0x4a5468) },
], { bearing: 341.8, anchor: [55.7508451, 37.6180623], replaces: ['relation/1359281', 'relation/1359278'] })
