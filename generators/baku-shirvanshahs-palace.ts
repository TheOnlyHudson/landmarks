/**
 * Palace of the Shirvanshahs (Şirvanşahlar Sarayı), Icherisheher, Baku:
 * procedural, CC0-1.0.
 *   bun generators/baku-shirvanshahs-palace.ts   (writes the low and the detail model)
 *
 * The 15th-century palace complex, on three terraces stepping down the
 * Old City's hill to the south-west. Identity, in order: the two-storey
 * palace block on the upper terrace, its west wing with the high portal and
 * the drum and dome of its octagonal front hall; the Divankhana to the
 * north, an octagonal pavilion of pointed arches on a podium under a low
 * faceted dome, in a court framed on three sides by a pointed arcade, with
 * the domed corner block and the high portal on its west; the
 * Shirvanshahs' family tomb on the middle terrace, a square block under a
 * pointed, faceted stone dome, its carved portal on the east; the Shah
 * Mosque beside it, two smooth domes and the minaret at its north-east
 * corner (a plain shaft, an inscription band, a stalactite corbel under the
 * railed balcony, a slimmer top and a ribbed cap); the Seyid Yahya Bakuvi
 * mausoleum's octagon and tent roof to the south; Murad's Gate on the east;
 * the vented domes of the half-buried bath on the lower terrace; the
 * enclosure walls following the ground.
 *
 * Map frame: x east, y north, z up, metres; bearing 0. Origin: the area
 * centroid of the complex's outline way/299450008 (historic=castle), at
 * 49.833251, 40.366169. y = 0 is the lowest ground under the footprint;
 * each building stands at its own terrace's level (below), its walls run
 * down to y = 0 and sink into the hill.
 *
 * Evidence
 * - OSM (ODbL, OSM API 2026-11): the complex outline way/299450008; the
 *   palace way/1311487140 ("Residential Building of the Shirvanshahs",
 *   levels 4), its west wing (12 x 8 m) the domed front hall; the
 *   Divankhana pavilion way/1311487144 (an octagon 11.8 m across) and its
 *   U-shaped arcade way/1311487151; the family tomb way/299450764; the Shah
 *   Mosque way/299450765; the Seyid Yahya Bakuvi tomb way/1311487146 (an
 *   octagon 4.7 m across); Murad's Gate node/3745031602; the bath
 *   way/1311487141 (historic=archaeological_site).
 * - Published: Wikipedia "Palace of the Shirvanshahs": palace of two
 *   storeys, its main entrance on the west through a high portal into a
 *   tall domed octagonal hall; the Divankhana an octagonal rotunda in an
 *   open arcade, a faceted stone dome, a portal on its west, a court framed
 *   on three sides by a pointed arcade; the tomb (1435/36) with a richly
 *   carved portal and a dome; the mosque with two domes and the minaret
 *   (1441) above its north-east corner; the Seyid Yahya mausoleum an octagon
 *   under a pyramidal tent roof; Murad's Gate (1585/86) a wide lancet
 *   opening with a deep stalactite niche; the bath sunk into the ground,
 *   only its domes with perforated lanterns above it.
 * - Photos (Wikimedia Commons, evidence):
 *   p1 Urek Meniashvili, CC BY-SA 3.0, "Palace of Shirvanshahs common.JPG":
 *      from the lower (bath) terrace on the west: tomb, mosque, minaret,
 *      the palace's front-hall dome, the Divankhana's domed block and portal
 *      https://commons.wikimedia.org/wiki/File:Palace_of_Shirvanshahs_common.JPG
 *   p2 Petar Milošević, CC BY-SA 4.0, "Palace of the Shirvanshahs, Baku
 *      (Şirvanşahlar sarayı).jpg": the same side, telephoto; proportions of
 *      the tomb, its dome and the minaret are measured on it
 *      https://commons.wikimedia.org/wiki/File:Palace_of_the_Shirvanshahs,_Baku_(%C5%9Eirvan%C5%9Fahlar_saray%C4%B1).jpg
 *   p3 Diego Delso, CC BY-SA 4.0, "Palacio de los Shirvanshah ... DD
 *      165-167 HDR.jpg": the Divankhana pavilion and arcades
 *      https://commons.wikimedia.org/wiki/File:Palacio_de_los_Shirvanshah,_Baku,_Azerbaiy%C3%A1n,_2016-09-26,_DD_165-167_HDR.jpg
 *   p5 Ludvig14, CC BY-SA 4.0, "Baku ShirvanshahsPalace DivanKhana 004
 *      1502.jpg": the pavilion: podium, columns, arches, colours
 *      https://commons.wikimedia.org/wiki/File:Baku_ShirvanshahsPalace_DivanKhana_004_1502.jpg
 *   p6 Bernard Gagnon, CC BY 4.0, "Shirvanshahs Palace Mosque 02.jpg": the
 *      tomb's dome and the minaret's top
 *      https://commons.wikimedia.org/wiki/File:Shirvanshahs_Palace_Mosque_02.jpg
 *   p7 Toghrul Rahimli, CC BY-SA 4.0, "İçərişəhər. Şirvanşahlar sarayı
 *      ümumi.jpg": from the east-north-east: minaret, the tomb's portal
 *      and dome, the crenellated walls
 *      https://commons.wikimedia.org/wiki/File:%C4%B0%C3%A7%C9%99ri%C5%9F%C9%99h%C9%99r._%C5%9Eirvan%C5%9Fahlar_saray%C4%B1_%C3%BCmumi.jpg
 *   p8 Bernard Gagnon, CC BY 4.0, "Shirvanshahs Palace Hammam 01.jpg": the
 *      bath's lantern domes
 *      https://commons.wikimedia.org/wiki/File:Shirvanshahs_Palace_Hammam_01.jpg
 *   p9 Frokor, CC BY-SA 3.0, "Palace of the Shirvanshahs - outside.JPG":
 *      the Divankhana's domed block and portal from the north-west street
 *      https://commons.wikimedia.org/wiki/File:Palace_of_the_Shirvanshahs_-_outside.JPG
 *   p10 Sefer azeri, CC BY-SA 4.0, "Şirvanşahlar sarayı 2016.jpg": as p1,
 *      with the Seyid Yahya tent roof at the right
 *      https://commons.wikimedia.org/wiki/File:%C5%9Eirvan%C5%9Fahlar_saray%C4%B1_2016.jpg
 * - Look-only: none.
 *
 * Numbers
 * - Plans: measured from OSM. Terrace levels: from the map's own terrain
 *   (Mapterhorn z12, below), relative to the lowest ground under the
 *   complex: bath terrace about 1, tomb 1.6, mosque 2.6, palace and
 *   Divankhana about 7; this matches the photos (the palace and Divankhana
 *   stand on a high retaining wall above the tomb and mosque).
 * - Heights above each building's own ground, estimated from p2 (scale from
 *   the tomb's 10.2 m west face, 0.017 m/px, and the minaret shaft taken as
 *   3.0 m, 0.032 m/px): the tomb block 6.0, its dome 5.2 across (half the face, p1 and p2), top
 *   10.6;
 *   the mosque block 7.0, domes 5.0 and 4.8 across; the minaret's band at
 *   13.8, balcony 16.6, top 21.4; the palace 7.8 (two low storeys; p2 puts
 *   its roof about 3.5 m over the mosque's), its front hall to 8.8, the
 *   portal 10.8, the dome 6.4 across, top 12.0 (p1: below the minaret's balcony). The Divankhana's podium
 *   1.6 and its arcade 6.4 over it, columns 3.0, arches springing at 2.9
 *   (p5), the court
 *   arcade 5.2 with 2.8 m bays (p3). Seyid Yahya's walls 5.0 and tent roof
 *   to 9.4 (p10). Murad's Gate 8.5 high, 7 wide (estimated; no photo).
 * - Colours from daylight photos: the limestone #eee6bb (p1 sun, yellow
 *   cast), #f3cba3 (p2 evening), #b9ac92 and #cec1aa (p10, hazy), #9c8e80
 *   (p5 shade): drawn #e2d4b8; the domes, a shade greyer in every photo,
 *   #d3c4a8; flat roofs and paving #c8bba2; the grilles and doorways dark.
 *
 * - Lead review 1 changes: the tomb's dome enlarged to 8.4 m across (about
 *   the block's width, p2) and pointed, rising to 13.9, with sixteen facets
 *   (twelve in the low model) and raised pale lozenges for its star
 *   pattern in the detail model; the mosque's domes 5.6 m across, near
 *   hemispheres on low drums; the palace lowered to 6.5 m (front hall 7.5,
 *   its dome top about 17.6) so it stays under the minaret's balcony
 *   (19.2) as in p10, its portal niche 1.8 m deep; the stone re-sampled
 *   warm yellow (#d6bf92 sunlit): drawn #d8c296, domes #cbb487, roofs
 *   #bfae8a. These supersede the heights and colours above.
 *
 * Doubts
 * - The building with the dome and high portal west of the Divankhana's
 *   court (p1, p9, p10) is not mapped in OSM as its own building; it is
 *   drawn as a domed block at the court's north-west corner and a portal on
 *   the middle of its west arm, placed from the photos only.
 * - Murad's Gate and the bath's domes have no photo taken from where their
 *   shape can be measured; the gate is drawn plain. The enclosure walls are
 *   drawn 3 m over the higher ground beside them, without merlons.
 * - The Divankhana's carved portal on the rotunda's west face and the
 *   stalactite niches are in the detail model only; the star pattern of the
 *   tomb's dome is left out.
 * - OSM draws the Divankhana pavilion with one square corner; it is drawn
 *   as the regular octagon the photos show, on the same centre and size.
 * - The palace's lower row of windows, the tomb's two slits and the domes'
 *   finials are in the detail model only, to keep the low one under
 *   250 KB.
 * - Terrain: Mapterhorn here is z12 only, smoothing the terraces into a
 *   slope; each building is set at the slope's level under its centre.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { prism, flat, lathe, offset, ccw, type XY } from './sf-de-young'
import { wallPlate, pointedArch } from './berlin-oberbaum-bridge'
import { wallLoop, polyPath, capPath, writeModel, type Hole } from './baku-maiden-tower'

// Mapterhorn z12 under the site, metres; rows north to south from y = 70, columns west to east from x = -70, 5 m apart.
const TERRAIN = [
  [8.1, 8.3, 8.5, 8.7, 8.8, 9.1, 9.4, 9.8, 10.2, 10.6, 11.1, 11.5, 11.9, 12.3, 12.7, 13.0, 13.4, 13.5, 13.6, 13.7, 13.8, 13.8, 13.9, 13.7, 13.6, 13.4, 13.1, 12.8, 12.5],
  [8.1, 8.3, 8.5, 8.7, 8.8, 9.1, 9.4, 9.8, 10.2, 10.7, 11.2, 11.6, 12.0, 12.3, 12.7, 13.0, 13.4, 13.6, 13.7, 13.9, 14.1, 14.2, 14.4, 14.2, 14.1, 13.9, 13.6, 13.2, 12.9],
  [8.0, 8.2, 8.3, 8.5, 8.7, 8.9, 9.3, 9.6, 10.0, 10.5, 10.9, 11.3, 11.7, 12.1, 12.5, 12.9, 13.3, 13.6, 13.8, 14.1, 14.2, 14.4, 14.6, 14.4, 14.3, 14.1, 13.8, 13.4, 13.0],
  [7.8, 8.0, 8.2, 8.3, 8.5, 8.7, 9.1, 9.4, 9.8, 10.2, 10.6, 11.0, 11.5, 11.9, 12.4, 12.9, 13.3, 13.7, 13.9, 14.2, 14.4, 14.6, 14.8, 14.6, 14.4, 14.3, 13.9, 13.6, 13.2],
  [7.6, 7.8, 8.0, 8.2, 8.3, 8.6, 8.9, 9.2, 9.6, 9.9, 10.3, 10.7, 11.2, 11.7, 12.3, 12.8, 13.3, 13.7, 14.0, 14.4, 14.6, 14.7, 14.9, 14.8, 14.6, 14.4, 14.1, 13.7, 13.4],
  [7.6, 7.8, 8.0, 8.0, 8.0, 8.2, 8.4, 8.6, 8.9, 9.3, 9.7, 10.2, 10.7, 11.2, 11.8, 12.4, 12.9, 13.4, 13.8, 14.2, 14.5, 14.7, 14.9, 14.8, 14.7, 14.6, 14.2, 13.8, 13.4],
  [7.6, 7.8, 7.9, 7.8, 7.8, 7.8, 7.9, 8.0, 8.2, 8.7, 9.2, 9.7, 10.2, 10.7, 11.3, 11.9, 12.6, 13.1, 13.5, 14.0, 14.3, 14.6, 14.9, 14.9, 14.8, 14.8, 14.3, 13.9, 13.4],
  [7.6, 7.8, 7.8, 7.6, 7.5, 7.4, 7.4, 7.4, 7.6, 8.1, 8.6, 9.2, 9.7, 10.2, 10.8, 11.5, 12.2, 12.8, 13.3, 13.8, 14.2, 14.5, 14.9, 14.9, 14.9, 14.9, 14.4, 13.8, 13.3],
  [7.2, 7.4, 7.5, 7.2, 7.0, 6.8, 6.8, 6.8, 7.1, 7.6, 8.1, 8.7, 9.3, 9.8, 10.5, 11.2, 11.9, 12.5, 13.1, 13.6, 14.0, 14.4, 14.7, 14.7, 14.6, 14.5, 14.0, 13.5, 13.0],
  [6.9, 7.1, 7.1, 6.8, 6.5, 6.3, 6.3, 6.3, 6.6, 7.1, 7.6, 8.2, 8.8, 9.5, 10.1, 10.8, 11.5, 12.2, 12.8, 13.5, 13.9, 14.2, 14.5, 14.4, 14.3, 14.2, 13.7, 13.2, 12.6],
  [6.5, 6.6, 6.6, 6.3, 6.0, 5.8, 5.8, 5.8, 6.1, 6.6, 7.1, 7.7, 8.4, 9.1, 9.8, 10.5, 11.2, 11.8, 12.5, 13.2, 13.6, 13.9, 14.2, 14.1, 13.9, 13.7, 13.2, 12.7, 12.2],
  [5.9, 6.0, 6.0, 5.7, 5.4, 5.3, 5.4, 5.5, 5.7, 6.3, 6.8, 7.4, 8.1, 8.8, 9.5, 10.1, 10.8, 11.5, 12.1, 12.7, 13.0, 13.3, 13.5, 13.4, 13.2, 13.1, 12.5, 12.0, 11.5],
  [5.3, 5.3, 5.3, 5.1, 4.9, 4.8, 4.9, 5.1, 5.4, 5.9, 6.4, 7.0, 7.7, 8.4, 9.1, 9.8, 10.5, 11.1, 11.6, 12.2, 12.4, 12.6, 12.9, 12.7, 12.5, 12.4, 11.8, 11.3, 10.8],
  [4.7, 4.7, 4.7, 4.5, 4.4, 4.4, 4.6, 4.8, 5.1, 5.6, 6.2, 6.8, 7.5, 8.1, 8.8, 9.5, 10.1, 10.7, 11.2, 11.7, 11.9, 12.1, 12.2, 12.1, 11.9, 11.7, 11.2, 10.6, 10.1],
  [4.2, 4.2, 4.2, 4.1, 4.0, 4.1, 4.3, 4.6, 4.9, 5.5, 6.0, 6.6, 7.3, 8.0, 8.6, 9.2, 9.8, 10.3, 10.7, 11.2, 11.4, 11.5, 11.7, 11.5, 11.2, 11.0, 10.5, 9.9, 9.4],
  [3.7, 3.7, 3.7, 3.7, 3.6, 3.7, 4.1, 4.4, 4.8, 5.3, 5.8, 6.4, 7.1, 7.8, 8.4, 8.9, 9.5, 9.9, 10.3, 10.6, 10.8, 11.0, 11.2, 10.9, 10.6, 10.3, 9.8, 9.3, 8.7],
  [3.2, 3.2, 3.3, 3.3, 3.3, 3.5, 3.8, 4.2, 4.6, 5.1, 5.6, 6.2, 6.9, 7.5, 8.1, 8.6, 9.1, 9.4, 9.8, 10.1, 10.3, 10.4, 10.6, 10.3, 10.0, 9.7, 9.2, 8.6, 8.1],
  [2.8, 2.9, 3.0, 3.0, 3.1, 3.3, 3.7, 4.0, 4.4, 4.9, 5.5, 6.0, 6.6, 7.2, 7.7, 8.1, 8.6, 8.9, 9.3, 9.6, 9.7, 9.8, 9.9, 9.7, 9.4, 9.2, 8.6, 8.1, 7.6],
  [2.3, 2.5, 2.6, 2.8, 2.9, 3.1, 3.5, 3.8, 4.3, 4.8, 5.3, 5.8, 6.4, 6.9, 7.3, 7.7, 8.1, 8.4, 8.7, 9.1, 9.2, 9.2, 9.2, 9.0, 8.8, 8.6, 8.1, 7.6, 7.1],
  [2.0, 2.2, 2.4, 2.6, 2.8, 3.1, 3.4, 3.7, 4.1, 4.5, 5.0, 5.5, 6.0, 6.5, 6.9, 7.2, 7.5, 7.9, 8.2, 8.5, 8.6, 8.6, 8.6, 8.5, 8.3, 8.1, 7.6, 7.1, 6.6],
  [1.7, 2.0, 2.2, 2.5, 2.8, 3.0, 3.3, 3.5, 3.9, 4.3, 4.7, 5.1, 5.5, 6.0, 6.3, 6.7, 7.0, 7.3, 7.5, 7.8, 7.9, 8.0, 8.1, 8.0, 7.8, 7.6, 7.1, 6.6, 6.0],
  [1.4, 1.8, 2.1, 2.4, 2.7, 3.0, 3.2, 3.4, 3.7, 4.0, 4.4, 4.7, 5.1, 5.5, 5.8, 6.2, 6.5, 6.7, 6.9, 7.1, 7.3, 7.4, 7.6, 7.4, 7.3, 7.1, 6.6, 6.1, 5.5],
  [1.2, 1.6, 1.9, 2.3, 2.6, 2.9, 3.1, 3.2, 3.4, 3.7, 4.0, 4.3, 4.6, 5.0, 5.3, 5.6, 5.9, 6.1, 6.3, 6.4, 6.6, 6.8, 6.9, 6.8, 6.6, 6.4, 6.0, 5.5, 5.0],
  [0.9, 1.3, 1.7, 2.1, 2.4, 2.7, 2.9, 3.1, 3.2, 3.4, 3.5, 3.8, 4.1, 4.4, 4.7, 5.0, 5.2, 5.4, 5.6, 5.7, 5.9, 6.1, 6.2, 6.1, 5.9, 5.8, 5.3, 4.9, 4.5],
  [0.6, 1.1, 1.6, 1.9, 2.3, 2.5, 2.7, 2.9, 3.0, 3.0, 3.0, 3.2, 3.6, 3.9, 4.2, 4.3, 4.5, 4.7, 4.9, 5.0, 5.2, 5.4, 5.6, 5.4, 5.2, 5.1, 4.7, 4.4, 4.0],
  [0.4, 0.9, 1.4, 1.7, 2.0, 2.2, 2.4, 2.6, 2.6, 2.6, 2.5, 2.7, 3.0, 3.3, 3.5, 3.7, 3.8, 4.0, 4.1, 4.2, 4.4, 4.6, 4.7, 4.6, 4.5, 4.4, 4.0, 3.7, 3.3],
  [0.3, 0.8, 1.2, 1.4, 1.7, 1.9, 2.1, 2.2, 2.3, 2.2, 2.0, 2.1, 2.4, 2.6, 2.8, 3.0, 3.1, 3.2, 3.3, 3.4, 3.5, 3.7, 3.9, 3.8, 3.8, 3.7, 3.3, 3.0, 2.6],
  [0.1, 0.6, 1.0, 1.2, 1.4, 1.5, 1.7, 1.9, 1.9, 1.7, 1.6, 1.6, 1.8, 1.9, 2.1, 2.3, 2.5, 2.5, 2.5, 2.5, 2.7, 2.8, 3.0, 3.0, 3.0, 3.0, 2.6, 2.3, 2.0],
  [0.0, 0.5, 0.8, 1.0, 1.2, 1.3, 1.4, 1.6, 1.5, 1.4, 1.2, 1.2, 1.3, 1.4, 1.5, 1.7, 1.8, 1.8, 1.8, 1.8, 1.9, 2.0, 2.1, 2.1, 2.1, 2.1, 1.9, 1.6, 1.3],
]
const terrain = (x: number, y: number) => {
  const c = Math.min(27.999, Math.max(0, (x + 70) / 5)), r = Math.min(27.999, Math.max(0, (70 - y) / 5))
  const c0 = Math.floor(c), r0 = Math.floor(r), fc = c - c0, fr = r - r0
  const T = TERRAIN
  return (T[r0][c0] * (1 - fc) + T[r0][c0 + 1] * fc) * (1 - fr) + (T[r0 + 1][c0] * (1 - fc) + T[r0 + 1][c0 + 1] * fc) * fr
}

// ---- OSM plans (model frame) ------------------------------------------
const COMPLEX: XY[] = [[-10.52, 43.01], [14.49, 42.75], [32.51, 20.19], [51.18, -5.2], [50.71, -13.27], [50.42, -23.97], [27.9, -36.09], [4.92, -40.5], [-2.76, -17.05], [-15.37, -16.66], [-21.51, -16.72], [-23.23, -17.95], [-25.87, -18.02], [-39.4, -17.79], [-42.96, -11.62], [-44.86, -12.68], [-56.74, -19.3], [-61.6, -12.61], [-68.09, 10.59], [-53.75, 13.56], [-49.52, 12.54], [-46.84, 11.82], [-13.63, 17.21], [-12.41, 17.4], [-10.71, 17.75], [-10.65, 20.51]]
const PALACE_OSM: XY[] = [[8.56, -9.19], [8.48, -16.48], [20.73, -16.6], [20.77, -12.44], [26.06, -12.49], [26.11, -6.91], [31.29, -6.97], [31.36, -0.44], [35.64, -0.49], [35.72, 7.78], [32.39, 7.82], [32.51, 20.19], [14.61, 20.36], [11.39, 20.39], [8.63, 20.41], [8.6, 16.22], [8.47, 3.03], [8.43, -1.37], [-3.91, -1.25], [-3.99, -9.07]]
// the main block without its west wing (the domed front hall), which is drawn on its own
const PALACE: XY[] = PALACE_OSM.slice(0, 18)
const WING: XY[] = [[-3.99, -9.07], [8.5, -9.19], [8.45, -1.37], [-3.91, -1.25]]
/** A ring inset by d (any winding in, counter-clockwise out). */
const inset = (r: XY[], d: number) => offset(ccw(r), -d)
const PAVILION_OSM: XY[] = [[9.32, 30.99], [5.73, 34.49], [0.99, 34.53], [-2.51, 31.05], [-2.51, 22.73], [5.63, 22.73], [9.3, 26.28]]
// OSM draws the pavilion 11.8 m across with one corner square; the photos show a regular octagon: drawn so, on the same centre
const PAVILION: XY[] = Array.from({ length: 8 }, (_, i) => {
  const a = Math.PI / 8 + (i * Math.PI) / 4, R = 5.9 / Math.cos(Math.PI / 8)
  return [3.4 + R * Math.cos(a), 28.6 + R * Math.sin(a)] as XY
})
const TOMB: XY[] = [[-42.75, 7.05], [-40.74, -2.91], [-27.35, -0.24], [-29.36, 9.72]]
const MOSQUE: XY[] = [[-25.89, -4.27], [-25.87, -18.02], [-23.23, -17.95], [-21.51, -16.72], [-15.37, -16.66], [-14.99, -4.25]]
const YAHYA: XY[] = [[23.84, -30.24], [25.33, -30.84], [26.15, -32.7], [25.53, -34.15], [23.66, -34.95], [22.21, -34.38], [21.41, -32.52], [21.97, -31.05]]

const inPoly = (p: XY, r: XY[]) => {
  let c = false
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    const [xi, yi] = r[i], [xj, yj] = r[j]
    if (yi > p[1] !== yj > p[1] && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) c = !c
  }
  return c
}
// the lowest ground under the complex: its outline's corners and the grid inside
const G0 = (() => {
  let m = Infinity
  for (const p of COMPLEX) m = Math.min(m, terrain(p[0], p[1]))
  for (let x = -70; x <= 70; x += 5) for (let y = -70; y <= 70; y += 5) if (inPoly([x, y], COMPLEX)) m = Math.min(m, terrain(x, y))
  return m
})()
/** Ground above y = 0 at a point. */
const gl = (x: number, y: number) => Math.max(0, terrain(x, y) - G0)
const centroid = (r: XY[]): XY => [r.reduce((s, p) => s + p[0], 0) / r.length, r.reduce((s, p) => s + p[1], 0) / r.length]

// ---- helpers ------------------------------------------------------------
type Face = { A: XY; u: XY; n: XY; L: number }
/** A wall face from A to B; its outward normal is to the right going A -> B (counter-clockwise rings). */
const face = (A: XY, B: XY): Face => {
  const L = Math.hypot(B[0] - A[0], B[1] - A[1])
  const u: XY = [(B[0] - A[0]) / L, (B[1] - A[1]) / L]
  return { A, u, n: [u[1], -u[0]], L }
}
const onFace = (f: Face, s: number, w: number, z: number): V3 => [f.A[0] + f.u[0] * s + f.n[0] * w, f.A[1] + f.u[1] * s + f.n[1] * w, z]

/** A slab in the face's plane, `t` thick, centred `off` out from it: outline and holes in (s, z). */
function plate(p: Part, f: Face, outline: XY[], holes: XY[][], t: number, off: number, reveal?: Part) {
  wallPlate(p, outline, holes, t, (s, w, z) => onFace(f, s, off + w, z), [f.n[0], f.n[1], 0], { reveal })
}

/** A flat quad on a face, `d` out from it (a door leaf, a grille). */
function panel(p: Part, f: Face, s0: number, s1: number, z0: number, z1: number, d = 0.03) {
  const n: V3 = [f.n[0], f.n[1], 0]
  const q = [onFace(f, s0, d, z0), onFace(f, s1, d, z0), onFace(f, s1, d, z1), onFace(f, s0, d, z1)]
  p.tri(q[0], q[1], q[2], undefined, undefined, undefined, [n, n, n])
  p.tri(q[0], q[2], q[3], undefined, undefined, undefined, [n, n, n])
}

/**
 * A pishtaq: a portal frame standing `proj` proud of the face, `w` wide and
 * rising to `top`, with a deep pointed niche from the ground `z0` to its
 * apex, a door leaf at its back, and (detail) stalactite tiers in its head.
 */
function pishtaq(o: { wall: Part; door: Part; f: Face; s: number; w: number; z0: number; top: number; proj: number; aw: number; zs: number; detail: boolean; seg: number; through?: boolean }) {
  const { wall, door, f, s, w, z0, top, proj, aw, zs, detail, seg } = o
  const s0 = s - w / 2, s1 = s + w / 2, a0 = s - aw / 2, a1 = s + aw / 2
  const sill = z0 + 0.25
  const arch = pointedArch(a0, a1, sill, zs, seg, 0.68)
  plate(wall, f, [[s0, 0], [s1, 0], [s1, top], [s0, top]], [arch], proj, proj / 2)
  // a raised frame round the niche, and the cornice
  if (detail) {
    const fr = 0.35
    plate(wall, f, [[s0, top - 0.5], [s1, top - 0.5], [s1, top], [s0, top]], [], 0.2, proj + 0.1)
    for (const e of [s0 + fr / 2 + 0.25, s1 - fr / 2 - 0.25]) plate(wall, f, [[e - fr / 2, sill], [e + fr / 2, sill], [e + fr / 2, top - 0.5], [e - fr / 2, top - 0.5]], [], 0.12, proj + 0.06)
  }
  if (!o.through) {
    const dh = Math.min(zs - sill - 0.2, 3.2)
    panel(door, f, s - Math.min(1.0, aw / 2 - 0.4), s + Math.min(1.0, aw / 2 - 0.4), sill, sill + dh)
    if (detail) {
      // stalactite tiers in the niche's head: three corbelled shelves stepping out
      const rise = (aw / 2) * Math.sqrt(0.68 * 0.68 * 4 - (0.68 * 2 - 1) ** 2) // the pointed arch's height over its springing
      for (let k = 0; k < 3; k++) {
        const z = zs + 0.15 + k * (rise * 0.22), half = aw / 2 - 0.1 - k * (aw * 0.13), d = 0.25 + k * 0.22
        if (half < 0.3) break
        const n = 5 - k
        for (let i = 0; i < n; i++) {
          const c = s - half + ((i + 0.5) * 2 * half) / n, hw = half / n - 0.04
          plate(wall, f, [[c - hw, z], [c + hw, z], [c + hw, z + rise * 0.2], [c - hw, z + rise * 0.2]], [], d, d / 2)
        }
      }
    }
  }
}

/** A grid of recessed windows along each long edge of a polyPath. */
function windowRow(path: ReturnType<typeof polyPath>, ring: XY[], z0: number, h: number, w: number, step: number, part: Part, skip: (mid: XY, n: XY) => boolean = () => false, depth = 0.35): Hole[] {
  const holes: Hole[] = []
  const n = ring.length
  for (let k = 0; k < n; k++) {
    const a = path[2 * k], b = path[2 * k + 1], L = b.s - a.s
    if (L < step) continue
    const m = Math.floor(L / step)
    for (let i = 0; i < m; i++) {
      const d = (L - (m - 1) * step) / 2 + i * step
      const mid: XY = [a.p[0] + ((b.p[0] - a.p[0]) * d) / L, a.p[1] + ((b.p[1] - a.p[1]) * d) / L]
      if (skip(mid, a.n)) continue
      holes.push({ s0: a.s + d - w / 2, s1: a.s + d + w / 2, z0, z1: z0 + h, depth, part })
    }
  }
  return holes
}

/** A dome on a drum: drum from z0 to z1 at radius rd (n sides), dome of radius r rising `rise`, pointed by `point`; a finial. */
function domeOn(drum: Part, dome: Part, c: XY, z0: number, z1: number, rd: number, r: number, rise: number, n: number, o: { point?: number; faceted?: boolean; finial?: number; K?: number } = {}) {
  if (z1 > z0) {
    lathe(drum, [[rd, z0], [rd, z1 - 0.25], [rd + 0.15, z1 - 0.25], [rd + 0.15, z1], [r, z1]], n, c, Math.PI / n, false)
  }
  const pt = o.point ?? 0.15, K = o.K ?? (n > 12 ? 9 : 6)
  const prof: Array<[number, number]> = []
  for (let k = 0; k <= K; k++) {
    const a = (k / K) * (Math.PI / 2)
    // a slightly pointed profile: the radius shrinks a little faster than a circle's near the crown
    const rr = r * Math.cos(a) * (1 - pt * Math.sin(a) ** 3), zz = z1 + rise * Math.sin(a)
    prof.push([Math.max(rr, 0), zz])
  }
  prof[prof.length - 1] = [0, z1 + rise * (1 + pt * 0.6)]
  lathe(dome, prof, n, c, Math.PI / n, !o.faceted)
  const top = z1 + rise * (1 + pt * 0.6)
  if (o.finial && n > 12) lathe(drum, [[0.18, top - 0.1], [0.18, top + o.finial * 0.6], [0.3, top + o.finial * 0.75], [0, top + o.finial]], 6, c, 0, false)
  return top
}

/**
 * An arcade along face f: a slab `t` thick behind the face line with
 * `bays` pointed openings across [s0, s1], built directly (piers,
 * spandrels, soffits) rather than by cutting holes, to keep it light.
 */
function arcadeFront(wall: Part, f: Face, s0: number, s1: number, z0: number, top: number, bays: number, open: number, zs: number, t: number, seg: number, o: { base?: number; back?: boolean } = {}) {
  const zb = o.base ?? 0
  const N: V3 = [f.n[0], f.n[1], 0], B: V3 = [-f.n[0], -f.n[1], 0]
  const P = (s: number, w: number, z: number) => onFace(f, s, w, z)
  const q = (a: V3, b: V3, c: V3, d: V3, n: V3) => { wall.tri(a, b, c, undefined, undefined, undefined, [n, n, n]); wall.tri(a, c, d, undefined, undefined, undefined, [n, n, n]) }
  const tri = (a: V3, b: V3, c: V3, n: V3) => wall.tri(a, b, c, undefined, undefined, undefined, [n, n, n])
  const bw = (s1 - s0) / bays
  for (let i = 0; i < bays; i++) {
    const e0 = s0 + i * bw, e1 = e0 + bw, c = (e0 + e1) / 2, a0 = c - open / 2, a1 = c + open / 2
    const arch = pointedArch(a0, a1, z0, zs, seg, 0.7).slice(2) // (a1, zs) over the apex to (a0, zs)
    for (const [w, n] of (o.back === false ? [[0, N]] : [[0, N], [-t, B]]) as Array<[number, V3]>) {
      q(P(e0, w, zb), P(a0, w, zb), P(a0, w, zs), P(e0, w, zs), n)
      q(P(a1, w, zb), P(e1, w, zb), P(e1, w, zs), P(a1, w, zs), n)
      if (z0 > zb + 0.01) q(P(a0, w, zb), P(a1, w, zb), P(a1, w, z0), P(a0, w, z0), n)
      const m = arch.length - 1
      const topAt = (k: number) => e1 + ((e0 - e1) * k) / m
      tri(P(e1, w, zs), P(e1, w, top), P(a1, w, zs), n)
      tri(P(e0, w, zs), P(a0, w, zs), P(e0, w, top), n)
      for (let k = 0; k < m; k++) q(P(arch[k][0], w, arch[k][1]), P(arch[k + 1][0], w, arch[k + 1][1]), P(topAt(k + 1), w, top), P(topAt(k), w, top), n)
    }
    // the soffit and jambs, facing into the opening, and the sill
    const loop: XY[] = [[a1, z0], ...arch, [a0, z0]]
    for (let k = 0; k < loop.length - 1; k++) {
      const [sa, za] = loop[k], [sb, zb] = loop[k + 1]
      const ds = sb - sa, dz = zb - za, l = Math.hypot(ds, dz) || 1
      // the inward normal in the face's plane: to the left of the walk from a1 round to a0
      const ns = -dz / l, nzz = ds / l
      const n: V3 = [f.u[0] * ns, f.u[1] * ns, nzz]
      q(P(sa, 0, za), P(sb, 0, zb), P(sb, -t, zb), P(sa, -t, za), n)
    }
    q(P(a0, 0, z0), P(a1, 0, z0), P(a1, -t, z0), P(a0, -t, z0), [0, 0, 1])
  }
  // the ends and the top
  q(P(s0, 0, zb), P(s0, -t, zb), P(s0, -t, top), P(s0, 0, top), [-f.u[0], -f.u[1], 0])
  q(P(s1, 0, zb), P(s1, -t, zb), P(s1, -t, top), P(s1, 0, top), [f.u[0], f.u[1], 0])
  q(P(s0, 0, top), P(s1, 0, top), P(s1, -t, top), P(s0, -t, top), [0, 0, 1])
}

function build(detail: boolean) {
  const stone = new Part(), dome = new Part(), roof = new Part(), dark = new Part(), metal = new Part()
  const SEG = detail ? 7 : 3, ND = detail ? 24 : 10

  // ==== the palace, on the upper terrace ===================================
  {
    const b = gl(...centroid(PALACE_OSM)), H = b + 6.5, HW = b + 7.5
    const path = polyPath(PALACE)
    const prof = (h: number): Array<[number, number]> => [[0, 0], [0, h - 0.7], [0.22, h - 0.7], [0.22, h], [-0.5, h], [-0.5, h - 0.5]]
    // two rows of grilled windows; none on the short edge the wing covers
    const skip = (m: XY) => m[0] > 8.3 && m[0] < 8.7 && m[1] < -1.2 && m[1] > -9.3
    const holes = [
      ...(detail ? windowRow(path, PALACE, b + 1.6, 1.3, 0.9, 4.6, dark, skip) : []),
      ...windowRow(path, PALACE, b + 4.6, 1.5, 1.0, 4.6, dark, skip),
    ]
    // the main block (the wing rises a metre higher, drawn as its own block)
    wallLoop(stone, path, prof(H), holes)
    flat(roof, inset(PALACE, 0.5), H - 0.5)
    // the west wing: the domed octagonal front hall behind the high portal
    const wp = polyPath(WING)
    const wHoles = windowRow(wp, WING, b + 4.6, 1.5, 1.0, 4.6, dark, (m) => m[0] < -3.5 || m[0] > 8.2)
    wallLoop(stone, wp, [[0, 0], [0, HW - 0.7], [0.22, HW - 0.7], [0.22, HW], [-0.5, HW], [-0.5, HW - 0.5]], wHoles)
    flat(roof, inset(WING, 0.5), HW - 0.5)
    const wc: XY = [2.3, -5.2]
    domeOn(stone, dome, wc, HW - 0.5, HW + 0.4, 3.25, 3.2, 3.0, ND, { point: 0.1, finial: 0.8 })
    // the portal on its west face
    const fw = face([-3.91, -1.25], [-3.99, -9.07])
    pishtaq({ wall: stone, door: dark, f: fw, s: fw.L / 2, w: 5.8, z0: b, top: b + 10.0, proj: 1.8, aw: 3.4, zs: b + 5.6, detail, seg: SEG })
  }

  // ==== the Divankhana ======================================================
  {
    const b = gl(2.5, 30), TOP = b + 5.2
    // the court's arcade: three arms, the arches facing the court
    const arms: Array<{ outer: XY[]; front: [XY, XY]; bays: number }> = [
      { outer: [[-10.65, 20.51], [-7.55, 20.49], [-7.43, 39.85], [-10.52, 39.85]], front: [[-7.55, 20.49], [-7.43, 39.85]], bays: detail ? 7 : 6 },
      { outer: [[-10.52, 39.85], [14.49, 39.74], [14.49, 42.75], [-10.52, 43.01]], front: [[-7.43, 39.85], [11.55, 39.74]], bays: detail ? 7 : 6 },
      { outer: [[11.39, 20.39], [14.61, 20.36], [14.49, 39.74], [11.55, 39.74]], front: [[11.55, 39.74], [11.39, 20.39]], bays: detail ? 7 : 6 },
    ]
    for (const a of arms) {
      const f = face(a.front[0], a.front[1])
      arcadeFront(stone, f, 0, f.L, b, TOP, a.bays, 1.9, b + 2.7, 0.6, SEG, { back: detail })
      // the back wall and the roof over the gallery
      const r = a.outer
      const fo = (k: number) => face(r[k], r[(k + 1) % 4])
      for (let k = 0; k < 4; k++) {
        const f2 = fo(k)
        const off = (f2.A[0] - f.A[0]) * f.n[0] + (f2.A[1] - f.A[1]) * f.n[1] // distance off the arcade's line
        if (Math.abs(off) < 0.5 && Math.abs(f2.u[0] * f.u[0] + f2.u[1] * f.u[1]) > 0.9) continue
        plate(stone, f2, [[0, 0], [f2.L, 0], [f2.L, TOP], [0, TOP]], [], 0.7, -0.35)
      }
      prism(roof, r, TOP - 0.45, TOP, roof, 0)
    }
    // the domed block at the court's north-west corner, and the portal on the west arm
    const NW: XY[] = [[-11.0, 36.4], [-4.9, 36.4], [-4.9, 43.0], [-11.0, 43.0]]
    prism(stone, NW, 0, b + 6.4, roof, 0.3)
    domeOn(stone, dome, [-7.95, 39.7], b + 6.4, b + 7.0, 2.85, 2.75, 2.6, ND, { point: 0.12, finial: 0.6 })
    const fwa = face([-10.52, 39.85], [-10.65, 20.51])
    pishtaq({ wall: stone, door: dark, f: fwa, s: fwa.L * 0.55, w: 5.4, z0: b, top: b + 8.8, proj: 1.0, aw: 3.0, zs: b + 5.0, detail, seg: SEG })

    // the pavilion: podium, an arcade of eight pointed arches, the rotunda, a faceted dome
    const P0 = b + 1.6, PT = P0 + 6.4
    prism(stone, PAVILION, 0, P0, roof, 0.15)
    const ring = inset(PAVILION, 0.35)
    const cc = centroid(PAVILION)
    for (let k = 0; k < ring.length; k++) {
      const f = face(ring[k], ring[(k + 1) % ring.length])
      const open = Math.min(f.L - 1.6, 2.6)
      arcadeFront(stone, f, 0, f.L, P0, PT, 1, open, P0 + 2.9, 0.5, SEG, { base: P0, back: detail })
      // the column at the corner, its capital and base
      const c = ring[k]
      if (detail) lathe(stone, [[0.42, P0], [0.42, P0 + 0.45], [0.3, P0 + 0.5], [0.3, P0 + 2.5], [0.45, P0 + 2.7], [0.45, P0 + 3.0], [0, P0 + 3.0]], 8, c, 0, false)
      else lathe(stone, [[0.36, P0], [0.36, P0 + 3.0], [0, P0 + 3.0]], 6, c, 0, false)
    }
    // the rotunda inside, with its doorways, and the roof over everything
    const rot = PAVILION.map(([x, y]) => [cc[0] + (x - cc[0]) * 0.52, cc[1] + (y - cc[1]) * 0.52] as XY)
    const rp = polyPath(rot)
    const doors: Hole[] = []
    for (let k = 0; k < rot.length; k++) {
      const a = rp[2 * k], e = rp[2 * k + 1], L = e.s - a.s
      if (L > 1.6 && k % 2 === 0) doors.push({ s0: a.s + L / 2 - 0.5, s1: a.s + L / 2 + 0.5, z0: P0, z1: P0 + 2.2, depth: 0.5, part: dark })
    }
    wallLoop(roof, rp, [[0, P0], [0, PT]], doors) // in the gallery's shade: the darker paving colour
    flat(roof, ring, PT)
    for (let k = 0; k < ring.length; k++) {
      const f = face(ring[k], ring[(k + 1) % ring.length])
      plate(stone, f, [[-0.05, PT - 0.05], [f.L + 0.05, PT - 0.05], [f.L + 0.05, PT + 0.45], [-0.05, PT + 0.45]], [], 0.3, 0.0)
    }
    domeOn(stone, dome, cc, PT, PT + 0.35, 2.7, 2.6, 1.1, 8, { point: 0.05, faceted: true })
    if (detail) {
      // the carved portal on the rotunda's west face, a frame proud of it inside the gallery
      const r = ccw(rot)
      const k = r.findIndex((p, i) => face(p, r[(i + 1) % r.length]).n[0] < -0.9)
      const f = face(r[k], r[(k + 1) % r.length])
      pishtaq({ wall: stone, door: dark, f, s: f.L / 2, w: Math.min(3.4, f.L), z0: P0, top: PT - 0.5, proj: 0.4, aw: 1.6, zs: P0 + 2.6, detail, seg: SEG })
    }
  }

  // ==== the family tomb, on the middle terrace ==============================
  {
    const b = gl(...centroid(TOMB)), H = b + 6.0
    const path = polyPath(TOMB)
    const fwst = 0 // edge 0 is the west face
    const holes: Hole[] = [
      { s0: path[2 * fwst].s + 5.1 - 0.6, s1: path[2 * fwst].s + 5.1 + 0.6, z0: b + 2.6, z1: b + 3.9, depth: 0.4, part: dark },
      ...(detail ? [
        { s0: path[2 * fwst].s + 2.0 - 0.2, s1: path[2 * fwst].s + 2.0 + 0.2, z0: b + 1.2, z1: b + 2.0, depth: 0.4, part: dark },
        { s0: path[2 * fwst].s + 8.2 - 0.2, s1: path[2 * fwst].s + 8.2 + 0.2, z0: b + 1.2, z1: b + 2.0, depth: 0.4, part: dark },
      ] : []),
      ...windowRow(path, TOMB, b + 2.6, 1.2, 1.0, 6.8, dark, (m) => m[0] < -40 || m[0] > -29.5),
    ]
    wallLoop(stone, path, [[0, 0], [0, H - 0.5], [0.18, H - 0.5], [0.18, H], [-0.45, H], [-0.45, H - 0.4]], holes)
    flat(roof, inset(TOMB, 0.45), H - 0.4)
    const c: XY = [-35.6, 3.2]
    const NF = detail ? 16 : 12
    const dtop = domeOn(stone, dome, c, H - 0.4, H + 0.6, 4.35, 4.2, 6.0, NF, { point: 0.35, faceted: true, finial: 0.6, K: detail ? 9 : 6 })
    if (detail) {
      // the dome's two-tone star pattern: raised pale lozenges on the facets, in rows
      const z1 = H + 0.6, K = 9
      const rAt = (z: number) => { const t = Math.min(1, Math.max(0, (z - z1) / 6.0)); const a = Math.asin(Math.min(1, t)); return 4.2 * Math.cos(a) * (1 - 0.35 * Math.sin(a) ** 3) }
      void K; void dtop
      for (const [zc, hh, ww, shift] of [[z1 + 1.1, 0.9, 0.55, 0], [z1 + 2.7, 0.8, 0.45, 0.5], [z1 + 4.1, 0.6, 0.32, 0]] as Array<[number, number, number, number]>) {
        for (let i = 0; i < NF; i++) {
          const a = ((i + 0.5 + shift) * 2 * Math.PI) / NF + Math.PI / NF
          const r0 = rAt(zc) * Math.cos(Math.PI / NF) + 0.05
          const nrm: V3 = [Math.cos(a), Math.sin(a), 0.35]
          const P = (dw: number, dz: number): V3 => { const rr = rAt(zc + dz) * Math.cos(Math.PI / NF) + 0.06; return [c[0] + rr * Math.cos(a) - Math.sin(a) * dw, c[1] + rr * Math.sin(a) + Math.cos(a) * dw, zc + dz] }
          void r0
          stone.tri(P(0, -hh), P(ww, 0), P(0, hh), undefined, undefined, undefined, [nrm, nrm, nrm])
          stone.tri(P(0, -hh), P(0, hh), P(-ww, 0), undefined, undefined, undefined, [nrm, nrm, nrm])
        }
      }
    }
    // the carved portal on the east face, rising over the block
    const fe = face([-27.35, -0.24], [-29.36, 9.72])
    pishtaq({ wall: stone, door: dark, f: fe, s: fe.L / 2, w: 4.6, z0: b, top: b + 8.0, proj: 1.0, aw: 2.6, zs: b + 4.6, detail, seg: SEG })
  }

  // ==== the Shah Mosque and its minaret ======================================
  {
    const b = gl(...centroid(MOSQUE)), H = b + 7.0
    const path = polyPath(MOSQUE)
    const holes: Hole[] = [
      ...windowRow(path, MOSQUE, b + 3.2, 1.1, 0.9, 4.6, dark, (m) => m[1] > -5),
    ]
    // the north door, facing the tomb
    const fn = face([-14.99, -4.25], [-25.89, -4.27])
    wallLoop(stone, path, [[0, 0], [0, H - 0.5], [0.18, H - 0.5], [0.18, H], [-0.45, H], [-0.45, H - 0.4]], holes)
    flat(roof, inset(MOSQUE, 0.45), H - 0.4)
    pishtaq({ wall: stone, door: dark, f: fn, s: 6.2, w: 3.6, z0: b, top: b + 5.6, proj: 0.6, aw: 2.0, zs: b + 3.0, detail, seg: SEG })
    domeOn(stone, dome, [-20.5, -7.6], H - 0.4, H - 0.1, 2.85, 2.8, 2.8, ND, { point: 0.04, finial: 0.5 })
    domeOn(stone, dome, [-20.5, -13.6], H - 0.4, H - 0.1, 2.85, 2.8, 2.8, ND, { point: 0.04, finial: 0.5 })
    // the minaret, above the north-east corner
    const mc: XY = [-16.55, -5.85], NM = detail ? 20 : 10
    lathe(stone, [[1.5, 0], [1.5, b + 13.8], [1.6, b + 13.8], [1.6, b + 14.6], [1.5, b + 14.6]], NM, mc, 0, true)
    // the stalactite corbel: four tiers stepping out to the balcony
    const tiers = detail ? 4 : 2
    const prof: Array<[number, number]> = []
    for (let k = 0; k < tiers; k++) {
      const z = b + 14.6 + (k * 2.0) / tiers, r = 1.5 + (0.55 * (k + 1)) / tiers
      prof.push([1.5 + (0.55 * k) / tiers, z], [r - 0.06, z + 2.0 / tiers - 0.12], [r, z + 2.0 / tiers])
    }
    lathe(stone, [...prof, [2.08, b + 16.6], [2.08, b + 16.8], [1.1, b + 16.8]], NM, mc, 0, false)
    if (detail) {
      // the niches of each tier: small blocks round the corbel
      for (let k = 0; k < tiers; k++) {
        const z = b + 14.6 + (k * 2.0) / tiers, r = 1.5 + (0.55 * (k + 1)) / tiers, n = 16
        for (let i = 0; i < n; i++) {
          const a = ((i + (k % 2) * 0.5) * 2 * Math.PI) / n
          const f = face([mc[0] + r * Math.cos(a) - 0.2 * -Math.sin(a), mc[1] + r * Math.sin(a) - 0.2 * Math.cos(a)], [mc[0] + r * Math.cos(a) + 0.2 * -Math.sin(a), mc[1] + r * Math.sin(a) + 0.2 * Math.cos(a)])
          const ff = f.n[0] * Math.cos(a) + f.n[1] * Math.sin(a) > 0 ? f : face([mc[0] + r * Math.cos(a) + 0.2 * -Math.sin(a), mc[1] + r * Math.sin(a) + 0.2 * Math.cos(a)], [mc[0] + r * Math.cos(a) - 0.2 * -Math.sin(a), mc[1] + r * Math.sin(a) - 0.2 * Math.cos(a)])
          plate(stone, ff, [[0, z + 0.05], [0.4, z + 0.05], [0.4, z + 2.0 / tiers - 0.25], [0, z + 2.0 / tiers - 0.25]], [], 0.12, -0.02)
        }
      }
    }
    // the balcony's railing: a top rail on posts
    const NR = detail ? 16 : 10
    lathe(metal, detail ? [[2.02, b + 17.75], [2.02, b + 17.9], [1.94, b + 17.9], [1.94, b + 17.75], [2.02, b + 17.75]] : [[2.02, b + 17.7], [2.02, b + 17.9], [1.94, b + 17.9]], NR, mc, 0, false)
    for (let i = 0; i < NR; i += detail ? 1 : 2) {
      const a = (i * 2 * Math.PI) / NR, p: XY = [mc[0] + 1.98 * Math.cos(a), mc[1] + 1.98 * Math.sin(a)]
      prism(metal, [[p[0] - 0.04, p[1] - 0.04], [p[0] + 0.04, p[1] - 0.04], [p[0] + 0.04, p[1] + 0.04], [p[0] - 0.04, p[1] + 0.04]], b + 16.8, b + 17.8, null)
    }
    // the slimmer top and its ribbed cap
    lathe(stone, [[1.1, b + 16.8], [1.1, b + 20.0], [1.18, b + 20.0], [1.18, b + 20.2], [1.08, b + 20.2]], NM, mc, 0, true)
    const capN = detail ? 24 : 10
    const cap: Array<[number, number]> = []
    for (let k = 0; k <= 6; k++) { const a = (k / 6) * (Math.PI / 2); cap.push([1.08 * Math.cos(a), b + 20.2 + 1.15 * Math.sin(a)]) }
    lathe(dome, cap, capN, mc, 0, false)
    lathe(stone, [[0.12, b + 21.3], [0.12, b + 21.7], [0, b + 21.8]], 6, mc, 0, false)
  }

  // ==== the Seyid Yahya Bakuvi mausoleum ===================================
  {
    const b = gl(...centroid(YAHYA)), H = b + 5.0
    const path = polyPath(YAHYA)
    const holes: Hole[] = []
    for (const k of [1, 3, 5]) { const a = path[2 * k], e = path[2 * k + 1], L = e.s - a.s; holes.push({ s0: a.s + L / 2 - 0.3, s1: a.s + L / 2 + 0.3, z0: b + 2.4, z1: b + 3.3, depth: 0.3, part: dark }) }
    { const a = path[2 * 0], e = path[1], L = e.s - a.s; holes.push({ s0: a.s + L / 2 - 0.5, s1: a.s + L / 2 + 0.5, z0: b + 0.2, z1: b + 2.2, depth: 0.4, part: dark }) }
    wallLoop(stone, path, [[0, 0], [0, H - 0.3], [0.15, H - 0.3], [0.15, H]], holes)
    const c = centroid(YAHYA), eave = offset(ccw(YAHYA), 0.15)
    for (let k = 0; k < eave.length; k++) {
      const a = eave[k], e = eave[(k + 1) % eave.length]
      roofTri(dome, [a[0], a[1], H], [e[0], e[1], H], [c[0], c[1], b + 9.4])
    }
  }

  // ==== Murad's Gate ========================================================
  {
    const b = gl(50.9, -9.2)
    const f = face([50.71, -12.7], [51.1, -5.7]) // its east face, outward to the east
    const ff = f.n[0] > 0 ? f : face([51.1, -5.7], [50.71, -12.7])
    plate(stone, ff, [[0, 0], [ff.L, 0], [ff.L, b + 8.5], [0, b + 8.5]], [pointedArch(ff.L / 2 - 1.6, ff.L / 2 + 1.6, b + 0.02, b + 4.6, SEG, 0.68)], 2.6, -1.3)
    if (detail) plate(stone, ff, [[0, b + 8.0], [ff.L, b + 8.0], [ff.L, b + 8.5], [0, b + 8.5]], [], 0.2, 0.1)
  }

  // ==== the bath's lantern domes, on the lower terrace ======================
  for (const [x, y, r] of [[-55.5, -2.0, 1.7], [-50.5, 4.0, 1.5], [-58.0, 5.5, 1.4], [-52.0, -9.5, 1.3]].slice(0, detail ? 4 : 1) as Array<[number, number, number]>) {
    const g = gl(x, y)
    lathe(dome, [[r, 0], [r, g], [r * 0.92, g + r * 0.3], [r * 0.6, g + r * 0.55], [0.45, g + r * 0.62]], detail ? 14 : 7, [x, y], 0, true)
    lathe(stone, [[0.45, g + r * 0.62], [0.45, g + r * 0.62 + 0.4], [0.3, g + r * 0.62 + 0.55], [0, g + r * 0.62 + 0.62]], detail ? 10 : 6, [x, y], 0, false)
  }

  // ==== the enclosure walls, following the ground ===========================
  {
    const skipEdge = new Set([0, 9, 10, 11, 25]) // the arcade's back and the mosque's wall stand there
    const n = COMPLEX.length
    for (let k = 0; k < n; k++) {
      if (skipEdge.has(k)) continue
      const A = COMPLEX[k], B = COMPLEX[(k + 1) % n], f = face(B, A) // inward-running so its outward normal points out of the complex
      const steps = Math.max(1, Math.ceil(f.L / (detail ? 4 : 30)))
      const out: XY[] = [[0, 0]]
      for (let i = 0; i <= steps; i++) {
        const s = (f.L * i) / steps
        const p = onFace(f, s, 0, 0)
        const g = Math.max(gl(p[0], p[1]), gl(p[0] + f.n[0] * 3, p[1] + f.n[1] * 3), gl(p[0] - f.n[0] * 3, p[1] - f.n[1] * 3))
        out.push([s, g + 3.0])
      }
      out.push([f.L, 0])
      plate(stone, f, out, [], 1.0, -0.5)
    }
  }
  return { stone, dome, roof, dark, metal }
}

/** One triangle of a tent roof, wound to face outwards and up. */
function roofTri(p: Part, a: V3, b: V3, apex: V3) {
  const u: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v: V3 = [apex[0] - a[0], apex[1] - a[1], apex[2] - a[2]]
  const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  if (n[2] >= 0) p.tri(a, b, apex)
  else p.tri(b, a, apex)
  // the eave's underside
}

if (import.meta.main) {
  const make = (detail: boolean) => {
    const p = build(detail)
    const lit = (_q: V3, n: V3) => (n[2] > 0.7 ? 0.3 : 0.8)
    return [
      { part: p.stone, material: { ...finish('shirvanshah-limestone', 0xd8c296), floodlight: lit } },
      { part: p.dome, material: { ...finish('shirvanshah-dome', 0xcbb487), floodlight: (_q: V3, n: V3) => (n[2] > 0.8 ? 0.3 : 0.65) } },
      { part: p.roof, material: { ...finish('shirvanshah-roof', 0xbfae8a) } },
      { part: p.dark, material: { ...finish('shirvanshah-grille', 0x5a554d, 0.9) } },
      { part: p.metal, material: { ...finish('shirvanshah-railing', 0x4c4945, 0.6) } },
    ]
  }
  const meta = { bearing: 0, osm: 'way/299450008' }
  await writeModel('baku-shirvanshahs-palace.glb', 'Palace of the Shirvanshahs', make(false), meta, 6500, 250 * 1024)
  await writeModel('baku-shirvanshahs-palace.detail.glb', 'Palace of the Shirvanshahs', make(true), meta, 40000, 1536 * 1024)
}
