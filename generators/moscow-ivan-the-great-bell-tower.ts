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
 * Heights are OSM's. Estimated from the photos: the bell openings' sizes
 * and heights on each tier; the kokoshnik ring at 51.5-53.5 m; the drum's
 * windows and the lettered band (60.5-63.5 m); the tower's dome 7.8 m wide
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
import { archPanel, block, cross, dome, drum, finishModel, floodDomes, floodWalls, hood, wedge, zakomaraBlock } from './moscow-church-kit'

const white = new Part(), trim = new Part(), gold = new Part(), roof = new Part(), win = new Part(), blue = new Part()
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

// ---------------------------------------------------------------- Ivan the Great
const IC: [number, number] = [4.45, -16.6]
oct(white, IC, 0, 25, 7.4, null)
oct(trim, IC, 24.2, 25.4, 7.75)                       // cornice
oct(white, IC, 25.4, 37, 5.1, null)
oct(trim, IC, 36.6, 37.4, 5.35, null)                 // ledge
oct(white, IC, 37.4, 46, 5.1, null)
oct(trim, IC, 45.4, 46.4, 5.45)
oct(white, IC, 46.4, 51.5, 4.2, null)
oct(trim, IC, 51.2, 51.9, 4.4)
octArches(win, IC, 7.4, 16.0, 2.6, 4.2, trim)         // bells of the first tier
octArches(win, IC, 7.4, 6.0, 1.2, 1.8)
octArches(win, IC, 5.1, 39.6, 2.4, 3.6, trim)         // second tier
octArches(win, IC, 5.1, 29.0, 1.0, 1.6)
octArches(win, IC, 4.2, 47.2, 2.0, 2.8, trim)         // third tier
// the kokoshnik ring and the drum with its lettered band
for (let i = 0; i < 8; i++) {
  const t = (Math.PI / 4) * i, n: V3 = [Math.cos(t), Math.sin(t), 0], u: V3 = [-n[1], n[0], 0]
  hood(gold, [IC[0] + 3.55 * n[0], IC[1] + 3.55 * n[1], 52.0], u, n, 1.2, 0.3, 0.35, 6)
}
drum({ wall: white, win, trim, c: IC, z0: 51.9, z1: 60.5, r: 3.6, n: 16, windows: 8, winW: 0.7, winH: 2.6, sill: 55.0, cornice: 0.25 })
drum({ wall: blue, c: IC, z0: 60.5, z1: 63.5, r: 3.65, n: 16, cornice: 0 })
drum({ wall: trim, c: IC, z0: 63.5, z1: 64.5, r: 3.6, n: 16, cornice: 0.35 })
{ const t = dome(gold, IC, 64.5, 3.9, 7.0, 'helmet', 16, 1.5, 3.85); cross(gold, IC, t - 0.1, 6.0, 'y', 0.35) }

// ---------------------------------------------------------------- the link, the stair, the terrace
block(white, -2.6, -13.2, 0, 11.3, -8.7, 13, roof)
wedge(white, -7.6, -11.7, -2.6, -1.1, 13, 0.6, 'y1', trim)
block(white, -14.9, -15.9, 0, -2.7, -7.4, 4.0, roof)
block(trim, -14.9, -15.9, 4.0, -2.7, -15.5, 5.5, trim)

// the west porch: an open arcade on piers, a terrace with a parapet over it
block(white, -8.7, -1.1, 0, -2.6, 15.8, 13.0, roof)
block(trim, -9.0, -1.4, 13.0, -2.6, 16.1, 14.5, roof)
for (const y of [1.25, 7.1, 13.2]) {
  archPanel(roof, [-8.7, y, 0.7], AY, W, y === 7.1 ? 4.6 : 3.6, 6.4, 10)
  hood(trim, [-8.7, y, 7.1], AY, W, (y === 7.1 ? 4.6 : 3.6) / 2 + 0.05, 0.35, 0.25, 8)
}
archPanel(roof, [-5.65, -1.1, 0.7], [1, 0, 0], [0, -1, 0], 3.6, 5.4, 8)

// ---------------------------------------------------------------- the Assumption Belfry
const BX0 = -2.6, BX1 = 11.2, BY0 = -8.7, BY1 = 15.7
block(white, BX0, BY0, 0, BX1, BY1, 31, null)
block(trim, BX0 - 0.4, BY0 - 0.4, 30.0, BX1 + 0.4, BY1 + 0.4, 31.0, null)
// the bell tier above the cornice: a parapet of small kokoshniks round a ridged roof
zakomaraBlock({ wall: white, roof, edge: gold, xb: [BX0, 1.0, 4.3, 7.6, BX1], yb: [BY0, -4.3, 0.1, 4.5, 8.9, 12.3, BY1], z0: 31, zs: 33.4, rise: (w) => w * 0.3, n: 2, overhang: 0.25, underside: false })
// west front: two tiers of three great arches, the bells in the upper
for (const y of [-3.4, 3.5, 10.4]) {
  archPanel(win, [BX0, y, 15.5], AY, W, 4.2, 6.8, 10)
  hood(trim, [BX0, y, 22.3], AY, W, 2.15, 0.45, 0.35, 8)
  archPanel(win, [BX0, y, 24.6], AY, W, 1.4, 2.4, 6)
}
for (const x of [1.0, 4.3, 7.6]) {
  archPanel(win, [x, BY0, 15.5], [1, 0, 0], [0, -1, 0], 2.8, 6.8, 8)
  archPanel(win, [x, BY0, 24.6], [1, 0, 0], [0, -1, 0], 1.2, 2.2, 6)
}
for (const y of [-3.4, 3.5, 10.4]) archPanel(win, [BX1, y, 15.5], AY, [1, 0, 0], 3.6, 6.8, 8)
// drum and dome
const BC: [number, number] = [3.95, 4.0]
drum({ wall: white, trim, c: BC, z0: 34, z1: 41, r: 4.4, n: 16, cornice: 0.3 })
for (let i = 0; i < 12; i++) {
  const t = (Math.PI / 6) * i + Math.PI / 12, n: V3 = [Math.cos(t), Math.sin(t), 0], u: V3 = [-n[1], n[0], 0]
  hood(gold, [BC[0] + 3.95 * n[0], BC[1] + 3.95 * n[1], 41.3], u, n, 0.8, 0.25, 0.3, 4)
}
drum({ wall: white, win, trim, c: BC, z0: 41, z1: 48.5, r: 3.8, n: 16, windows: 8, winW: 0.7, winH: 2.4, sill: 44.0, cornice: 0.3 })
{ const t = dome(gold, BC, 48.5, 4.1, 6.5, 'helmet', 16, 1.6, 4.05); cross(gold, BC, t - 0.1, 3.0, 'y', 0.25) }

// ---------------------------------------------------------------- the Filaret annexe
block(white, -3.2, BY1, 0, 5.5, 24.0, 31, null)
block(white, BX0, 24.0, 0, 4.9, 28.9, 30, roof)
block(white, 5.5, BY1, 0, BX1, 16.5, 31, roof)
block(trim, -3.6, BY1, 30.0, 5.9, 24.4, 32.0, roof)
for (const x of [-1.0, 2.6]) {
  archPanel(win, [x, 28.9, 18.0], [1, 0, 0], [0, 1, 0], 1.6, 3.6, 8)
  archPanel(win, [x, 28.9, 6.0], [1, 0, 0], [0, 1, 0], 1.4, 2.6, 6)
}
for (const y of [17.8, 21.6]) archPanel(win, [-3.2, y, 21.0], AY, W, 1.6, 3.4, 8)
// the tent and its little cupola, and the four corner tents
const FC: [number, number] = [1.15, 19.85]
oct(white, FC, 32, 33.5, 2.9)
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
  { part: blue, material: { ...finish('ivan-band-blue', 0x4f6487), floodlight: floodWalls } },
], { bearing: 341.8, anchor: [55.7508451, 37.6180623], replaces: ['relation/1359281', 'relation/1359278'] })
