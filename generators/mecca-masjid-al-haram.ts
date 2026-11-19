/**
 * Masjid al-Haram, the Great Mosque of Mecca, with the Kaaba.
 *
 * Writes two levels of detail in the same frame (x east, y north, metres,
 * origin at the anchor 39.8249 E, 21.4246 N on the lowest ground, bearing 0):
 * - models/mecca-masjid-al-haram.glb, the low model (about 5,300 triangles,
 *   under 250 KB): the black Kaaba with its gold band on the white mataf, the
 *   golden Ottoman portico as a real arcade, the court ring stepping up in
 *   three white tiers round the whole court (real arches on its tall east
 *   side, rows of arched panels elsewhere), the white roofs and terraces
 *   carrying raised rows of grey prayer areas and roof structures, and the
 *   grey marble walls with grouped arched
 *   windows of the first and King Fahd expansions, the
 *   Mas'a, the King Abdullah expansion and the northern ring, the five gate
 *   porches with real arched openings, and all 13 minarets with recessed
 *   galleries and crescent finials;
 * - models/mecca-masjid-al-haram.detail.glb, drawn from zoom 16 (about
 *   33,000 triangles): the same with columned minaret galleries, white roof
 *   parapets, two levels of recessed arched windows along every long facade,
 *   real arches on all three court tiers, the portico's small domes
 *   and merlon cresting, gallery floors inside the court arches, arcaded drums
 *   under the King Fahd, Safa and Marwa domes, the window band over each
 *   gate, the Kaaba's door curtain and inscription panels, and Maqam Ibrahim.
 *
 * What it does not draw: the Abraj Al Bait towers to the south (their own
 * model), the plazas, the toilet kiosks and tunnels in them, and the
 * building site north-east of the northern ring (way/1368514394).
 *
 * Sources (open only; no commercial imagery or 3D tiles):
 * - OSM: relation/1472531 (building=mosque, height 21, three outers and the
 *   mataf as inner ring) and its parts: 12795517 (main), 18852997 (King Fahd
 *   expansion), 12790673 (Mas'a, 30 m) with 967545524-526 (30-34 m),
 *   136524020 (Safa dome 30-40 m), 136524024 (Marwa 34-44 m), 925367096
 *   (Ottoman portico, 9.5 m), 13020659 (King Abdullah expansion, 35.5 m),
 *   967545704 (its top storey, 42 m), 967545511-522 (roof pavilions, 42-46
 *   m), 948830305-308 (gate domes, 42-48 m), 556587834 and 967545671 (central
 *   dome, 42-54.5 m), 301818188-190 (King Fahd roof domes, 21-33 m), the
 *   Kaaba way/103914569 with parts 950018448-452, Hijr Ismail way/315911894,
 *   Maqam Ibrahim way/473301379, the bridges 620454084/089/091/092 (9.5-21 m)
 *   and 948830389-392 (9.5-25 m), and every minaret's stack of parts: nine
 *   older minarets (about 47 parts each, 21 m roof to the finial at 89 m) and
 *   four King Abdullah minarets (relations 13020567-658, finial at 137.5 m).
 *   Fetched with the OSM API map call on 2026-11-18.
 * - Published: 13 minarets (Wikipedia, Masjid al-Haram, infobox; four added
 *   by the King Abdullah expansion); older minarets 89 m (Wikipedia; the OSM
 *   stacks agree); the tallest 139 m (Wikipedia infobox; OSM 137.5 m, used);
 *   Kaaba 13.1 m high, sides 11.03 x 12.86 m, the hizam band at two-thirds
 *   height (Wikipedia, Kaaba).
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   c02 "Great Mosque of Mecca1.jpg", Saudipics.com, CC BY-SA 4.0: the aerial
 *     from the clock tower: court, portico ring, roofs, King Fahd domes, Mas'a.
 *   a1 "Masjidul-HaramAerealView.jpg", Wurzelgnohm, CC0: night aerial, plan.
 *   a2 "Makkah 550m.jpg", Wurzelgnohm, CC0: aerial looking north, Mas'a, Marwa.
 *   d119 "Masjid al-Haram 2022.jpg", مريم محمد الغلبان, CC0: the court in
 *     2022: Kaaba, portico, the tall court arcade with gallery floors.
 *   c21 "The Ka'ba, Great Mosque of Mecca, Saudi Arabia (4).jpg", Richard
 *     Mortel, CC BY 2.0: the Kaaba's north-east face, band, door, Maqam.
 *   a3 "ملک عبد اللہ گیٹ.jpg", HolyArtThou, CC BY-SA 4.0: the Ottoman portico:
 *     golden stone, pointed arches on columns, merlons, small domes.
 *   c01 "Al Masjid Al Haram - panoramio.jpg", Tevfik Teker, CC BY 3.0: a gate
 *     with its minarets: portal arches, window band, cresting, galleries.
 *   c00 "Masjid al Haram Exterior.jpg", King Eliot, CC BY-SA 4.0: the King
 *     Fahd side: grey marble facade, minarets.
 *   c22 "Masjed Haram from tower.jpg", Swerveut, CC BY-SA 3.0: minaret stages,
 *     green balcony roofs, bulb and finial.
 *   c27 "Exterior view of the Grand Mosque of Mecca, Saudi Arabia (8).jpg" and
 *   c33 "Exterior of the Grand Mosque of Makkah, Saudi Arabia (3)
 *     (52501415146).jpg", Richard Mortel, CC BY 2.0: facades, gates by night.
 *   d121 "Masjid al-Ḥaram 2.jpg", Tahir mq, CC BY-SA 4.0: the King Fahd roof
 *     domes: brown domes, green band, arcaded white drums.
 *   c05, c13 "Masjidil Haram (Umroh Ramadhan 2023)-11.jpg" and "-27.jpg",
 *     Indonesiagood, CC BY 4.0: King Abdulaziz gate (2023), the King Abdullah
 *     expansion's colonnade and the plain northern ring.
 *   e206 "المسجد الحرام في مكة.jpg", M sh شراونة محمد, CC BY-SA 4.0: the King
 *     Abdullah expansion's facade and minaret (grey shaft, white galleries).
 * - Terrain: Mapterhorn z12 (no z13+ here), `tools/terrain.ts grid`.
 * - No lidar and no NAIP exist here.
 * Look-only references: none.
 *
 * Numbers:
 * - Plan: OSM, simplified 0.4-1.5 m (3 m on the long outlines in the low model).
 * - Heights: OSM part heights as listed (measured by OSM mappers; no lidar).
 * - Kaaba: published (above); its OSM footprint scaled 1.08 to the published
 *   sides. The gold band drawn 1.5 m tall (real about 0.95 m) so it reads.
 * - Gate porches 33 m (old gates) photo-scaled from c01/c22 against the 89 m
 *   minarets; portal crowns at 0.45 of that (c01). King Abdullah gate 48 m:
 *   estimated, no open photo of that gate's face.
 * - Gate porches stand 3 m proud of the OSM outline so their arches open in
 *   front of the wall (the outline runs flush across them); estimated.
 * - Court ring (the 2011-2021 mataf expansion): three tiers stepping back
 *   8 m each over white terraces, to 15, 19 and 21 m, the tall tier with a
 *   gallery floor inside its arches (c02, d119), estimated by eye; portico arcade crowns 7.4 m, domes 2.5 m radius (a3).
 * - Minaret shafts drawn 1.2 (older) and 1.12 (King Abdullah) times their OSM
 *   widths so they survive at phone size.
 * - The mataf floor is drawn as a 0.4 m white marble slab: the one piece of
 *   paving in the model, because the white ring round the black Kaaba is the
 *   landmark's identity. Hijr Ismail 1.3 m (OSM 1.23 m).
 * - Colours from the photos, pulled to the palette: grey-veined marble
 *   facades and the raised rows on the roofs and terraces (c02: white
 *   marble roofs carrying many dark grey rows) #c4c3bd; white marble roofs,
 *   court, terraces, parapets, pavilions and minarets #f2efe8; portico domes
 *   lead grey (the marble material); kiswa at the palette's charcoal
 *   limit #4a4f57; gold #c6a978, pulled toward the portico's pale golden stone
 *   (a3, d119), also used for the band, door curtain, finials and domes; minaret green #6e9c82 (c22).
 *
 * Doubts:
 * - Six materials are not enough: the King Fahd, Safa and Marwa domes are
 *   brown copper in the photos (d121) and the Kaaba band is a deeper gold,
 *   but both share the pale golden material of the portico.
 * - The roof rows stand for the prayer rows and structures on the real
 *   roofs; their spacing and direction are estimated from c02, and they are
 *   lighter than the dark grey-green rows in c02 because they share the
 *   facade marble (six materials).
 * - The low model drops the crescents (gilt stems only) to fit 250 KB.
 * - The northern ring (the third outer of the relation, 121,000 m²) carries
 *   only the relation's 21 m; its look is from the edge of c13 (plain stone
 *   with arched windows). Its north-west tip sits under the map's z12
 *   terrain by up to 3 m: that terrain predates the levelling of the Shamiya
 *   hill for the expansion, so the ring is built level (`terrain.ts check`
 *   reports about 300 m² buried, 0.1% of the tops).
 * - The King Abdullah expansion's roof pavilions and domes are drawn plain
 *   white from OSM shapes; no open photo shows its roof.
 * - The King Abdulaziz gate was rebuilt 2021-2024 with grey minarets of a new
 *   design (c05); it is drawn like the other older gates, as OSM maps it.
 * - The portico's eastern gap follows OSM way/925367096.
 * - The 80 px view shows a white mass with the court and the minaret spikes;
 *   the 13 m Kaaba is about one pixel there.
 */
import { Part, writeGlb, type V3, type MaterialSpec } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]
const TAU = Math.PI * 2
const BEARING = 0

// ---------------------------------------------------------------- data ---
// OSM outlines in the model frame (x east, y north, metres from the anchor
// 39.8249 E, 21.4246 N), simplified (Douglas-Peucker, 0.4-1.5 m).
const RING: Record<string, XY[]> = {
  main: [[-38.7,-216.5],[-35.7,-221.1],[-37.3,-224.6],[-60.5,-239.8],[-63.0,-236.1],[-57.8,-232.4],[-57.4,-230.4],[-63.6,-222.6],[-66.1,-222.0],[-82.7,-232.8],[-83.2,-235.4],[-77.5,-243.9],[-73.8,-243.5],[-68.4,-239.7],[-66.1,-243.4],[-97.1,-263.6],[-108.1,-314.9],[-93.5,-336.1],[-95.3,-346.3],[-93.5,-348.8],[-98.4,-351.6],[-99.4,-356.6],[-77.7,-389.2],[-72.7,-390.1],[-68.4,-386.9],[-66.4,-390.0],[-57.6,-391.8],[-43.0,-414.4],[8.4,-425.2],[39.4,-404.8],[42.2,-409.1],[35.8,-413.3],[35.5,-415.8],[40.0,-423.0],[43.1,-423.8],[60.1,-412.9],[60.6,-409.6],[55.8,-402.7],[53.1,-401.9],[48.2,-405.2],[45.3,-400.9],[71.3,-384.5],[75.0,-383.8],[78.6,-389.0],[117.7,-396.9],[121.5,-395.2],[123.1,-392.0],[127.2,-392.8],[135.0,-391.1],[135.7,-394.7],[173.3,-387.6],[172.3,-380.4],[180.5,-374.9],[182.3,-377.6],[223.9,-350.0],[221.2,-345.8],[235.4,-336.6],[237.5,-333.0],[241.8,-336.9],[246.8,-336.2],[249.9,-332.2],[249.7,-330.3],[259.8,-332.3],[271.1,-329.5],[279.5,-325.0],[286.0,-315.1],[287.1,-305.4],[285.6,-290.5],[290.9,-290.2],[283.8,-233.3],[299.6,-231.9],[295.4,-195.6],[279.5,-197.4],[270.8,-119.4],[275.6,-119.1],[269.9,-67.5],[264.7,-29.6],[259.6,-30.2],[253.0,23.3],[269.2,24.3],[264.6,61.4],[259.9,61.1],[256.0,93.6],[247.6,92.9],[247.2,97.6],[197.1,91.7],[197.3,86.8],[188.6,85.8],[192.5,51.8],[189.3,51.4],[193.5,15.6],[209.6,18.4],[215.6,-35.3],[200.7,-37.2],[205.0,-71.8],[220.9,-70.6],[222.1,-79.8],[210.6,-80.9],[209.6,-74.2],[144.4,-60.4],[131.1,-53.2],[84.0,-61.8],[69.8,-66.0],[5.7,-107.7],[-4.0,-119.5],[-30.4,-158.9],[-30.2,-173.7]],
  ka: [[168.8,137.8],[168.8,144.7],[163.9,149.6],[158.0,149.6],[158.3,160.9],[129.8,161.5],[129.6,141.2],[89.0,136.5],[88.8,137.6],[25.8,126.9],[20.5,144.5],[-4.4,136.2],[0.6,123.0],[-42.7,94.4],[-45.9,99.1],[-52.8,100.3],[-56.1,98.0],[-58.4,101.2],[-100.7,73.8],[-98.3,70.3],[-101.4,68.2],[-102.7,61.4],[-99.4,56.8],[-142.0,28.9],[-152.5,37.7],[-155.1,35.3],[-170.7,19.1],[-156.7,6.4],[-173.6,-22.1],[-177.5,-28.0],[-178.7,-27.3],[-190.8,-47.1],[-189.6,-47.9],[-209.7,-82.1],[-228.3,-75.0],[-238.4,-101.5],[-227.8,-105.8],[-230.1,-111.0],[-227.5,-117.4],[-221.1,-120.1],[-214.7,-117.6],[-212.9,-113.5],[-183.5,-125.3],[-184.5,-127.8],[-163.8,-136.0],[-162.8,-133.6],[-109.0,-154.5],[-110.0,-157.0],[-99.7,-161.2],[-89.2,-165.2],[-88.1,-162.7],[-58.3,-174.1],[-56.1,-168.8],[-51.4,-168.8],[-43.7,-149.9],[-47.7,-146.7],[-46.4,-143.7],[-32.5,-119.0],[-24.2,-108.0],[-22.4,-109.1],[-21.1,-107.3],[-19.5,-108.6],[-6.3,-94.2],[-8.0,-90.0],[-1.8,-83.7],[7.4,-76.0],[11.7,-73.3],[13.4,-75.1],[37.4,-58.6],[36.6,-56.4],[58.5,-46.0],[61.5,-49.0],[80.4,-42.6],[79.9,-40.8],[81.8,-40.1],[81.0,-38.1],[83.8,-37.4],[126.3,-31.6],[126.2,-34.6],[128.0,-34.5],[127.9,-36.2],[148.2,-36.8],[150.0,-32.3],[155.8,-32.6],[156.8,-1.0],[159.2,-0.9],[159.6,10.4],[159.8,21.2],[157.4,21.2],[159.7,115.5],[166.8,115.7],[167.1,136.2]],
  arc: [[169.1,267.1],[170.0,293.8],[160.4,293.4],[161.5,326.6],[182.4,325.7],[187.2,383.1],[163.7,384.0],[164.4,431.9],[99.1,430.4],[96.3,451.1],[-2.0,440.1],[-100.7,412.7],[-183.1,376.7],[-241.9,345.4],[-321.2,281.2],[-398.7,208.5],[-447.9,135.4],[-485.0,71.6],[-465.3,61.0],[-470.2,52.1],[-420.5,28.7],[-435.7,-15.0],[-405.6,-27.2],[-407.5,-33.6],[-341.4,-60.4],[-323.0,-17.8],[-335.8,-12.1],[-320.5,17.4],[-313.0,13.8],[-305.0,27.2],[-338.0,46.5],[-322.3,71.9],[-288.2,50.5],[-278.1,66.3],[-286.1,71.3],[-268.4,95.4],[-256.8,86.3],[-226.2,119.4],[-242.2,135.2],[-233.5,144.8],[-231.4,142.7],[-218.5,155.6],[-221.0,157.9],[-210.5,167.4],[-208.4,165.0],[-190.0,180.8],[-192.2,183.6],[-182.6,190.1],[-175.9,182.2],[-169.5,186.6],[-193.4,219.9],[-180.9,228.5],[-175.4,226.1],[-172.3,227.6],[-168.2,223.0],[-160.2,228.0],[-162.8,232.9],[-159.6,235.2],[-160.0,241.6],[-147.8,249.1],[-124.6,215.0],[-118.2,218.2],[-123.7,227.3],[-113.1,233.3],[-111.2,230.8],[-95.5,238.7],[-96.8,242.0],[-80.3,250.3],[-77.8,248.0],[-56.7,255.7],[-46.6,232.7],[-18.1,241.9],[-7.2,246.0],[-16.2,268.7],[22.5,278.6],[24.0,272.2],[32.8,274.1],[25.9,310.1],[63.2,316.1],[70.5,279.7],[79.4,280.0],[78.7,287.9],[122.7,290.2],[122.6,268.6],[148.3,267.9]],
  kaRoof: [[154.3,136.5],[155.5,136.4],[155.5,146.1],[157.8,146.1],[158.3,160.9],[129.8,161.5],[130.2,134.6],[89.7,130.7],[68.4,127.4],[28.2,118.1],[20.5,144.5],[-4.4,136.2],[5.0,111.6],[-42.5,87.9],[-45.4,92.4],[-51.4,88.2],[-55.6,94.2],[-54.0,95.2],[-58.4,101.2],[-100.7,73.8],[-96.4,67.5],[-91.6,70.8],[-84.6,61.0],[-132.9,21.0],[-152.5,37.7],[-155.1,35.3],[-170.7,19.1],[-150.1,1.6],[-183.6,-49.9],[-202.1,-85.5],[-228.3,-75.0],[-238.4,-101.5],[-224.6,-107.1],[-223.6,-104.7],[-214.6,-108.6],[-214.1,-107.3],[-74.7,-161.5],[-66.1,-141.0],[-95.7,-127.0],[-84.0,-104.5],[-82.2,-105.5],[-76.5,-96.5],[-78.3,-95.5],[-63.4,-74.5],[-46.9,-56.1],[-27.2,-38.1],[-25.9,-39.8],[-17.9,-33.4],[-19.3,-31.8],[8.9,-13.2],[9.9,-14.9],[18.5,-10.4],[17.6,-8.3],[41.8,2.5],[66.1,10.9],[90.6,16.4],[91.2,14.5],[101.4,15.7],[101.2,17.5],[127.1,20.1],[127.9,-12.7],[150.2,-13.7]],
  masa: [[259.8,-332.3],[271.1,-329.5],[279.5,-325.0],[286.0,-315.1],[287.1,-305.4],[285.6,-290.5],[290.9,-290.2],[283.8,-233.3],[299.6,-231.9],[295.4,-195.6],[279.5,-197.4],[270.8,-119.4],[275.6,-119.1],[269.9,-67.5],[264.7,-29.6],[259.6,-30.2],[253.0,23.3],[269.2,24.3],[264.6,61.4],[259.9,61.1],[256.0,93.6],[247.6,92.9],[247.2,97.6],[197.1,91.7],[197.3,86.8],[188.6,85.8],[192.5,51.8],[189.3,51.4],[193.5,15.6],[209.6,18.4],[215.6,-35.3],[200.7,-37.2],[205.0,-71.8],[220.9,-70.6],[245.0,-283.3],[234.7,-299.8],[233.7,-307.2],[237.5,-317.3],[248.4,-330.0]],
  masa1: [[295.4,-195.6],[275.9,-197.9],[280.3,-233.6],[299.6,-231.9]],
  masa2: [[215.6,-35.3],[200.7,-37.2],[205.0,-71.8],[223.6,-70.4],[218.6,-35.0]],
  masa3: [[211.6,18.5],[208.7,42.0],[247.8,46.4],[251.1,23.2],[269.2,24.3],[264.6,61.4],[259.9,61.1],[256.0,93.6],[247.6,92.9],[247.2,97.6],[197.1,91.7],[197.3,86.8],[188.6,85.8],[192.5,51.8],[189.3,51.4],[193.5,15.6],[209.6,18.4]],
  safa: [[255.9,-302.3],[255.5,-307.1],[256.7,-311.8],[259.4,-315.9],[263.3,-318.7],[268.0,-320.2],[272.9,-320.0],[277.4,-318.2],[281.1,-315.0],[283.5,-310.7],[283.7,-301.6],[281.6,-297.5],[274.1,-292.1],[264.9,-292.4],[260.9,-294.6]],
  marwa: [[216.2,88.3],[207.0,76.9],[208.7,62.3],[220.2,53.2],[234.8,54.8],[244.0,66.3],[242.4,80.8],[230.9,89.9]],
  kaaba: [[132.0,-238.1],[140.4,-232.4],[133.9,-222.7],[125.3,-228.1]],
  hijr: [[133.1,-219.8],[130.7,-216.7],[126.6,-215.9],[124.6,-216.6],[122.9,-218.1],[121.9,-220.0],[121.7,-222.2],[122.2,-224.3],[123.4,-225.8],[124.4,-225.1],[122.9,-222.1],[123.9,-218.8],[125.2,-217.7],[128.4,-217.2],[130.0,-217.8],[132.0,-220.4]],
  bN1: [[-229.6,-78.4],[-331.9,-38.5],[-339.5,-56.0],[-236.5,-96.4]],
  bN2: [[-155.1,35.3],[-237.6,107.1],[-250.3,93.3],[-168.4,21.5]],
  bN3: [[16.8,143.3],[-18.1,241.9],[-34.3,236.4],[-1.2,137.3]],
  bN4: [[138.2,268.2],[133.3,161.4],[152.2,161.0],[155.1,267.2]],
  bS1: [[69.8,-66.0],[84.0,-61.8],[77.7,-43.5],[64.3,-48.0]],
  bS2: [[-8.2,-96.2],[-18.0,-107.0],[-4.0,-119.5],[5.7,-107.7]],
  bS3: [[-45.0,-153.1],[-50.1,-165.8],[-30.2,-173.7],[-30.4,-158.9]],
  bS4: [[131.1,-53.2],[144.4,-60.4],[144.6,-36.7],[130.9,-36.3]],
  kaDomeA: [[-52.7,34.4],[-55.6,19.9],[-47.4,7.5],[-32.8,4.6],[-20.3,12.8],[-17.4,27.3],[-25.6,39.7],[-40.2,42.6]],
  kaDomeB: [[-45.9,29.9],[-47.7,21.4],[-42.9,14.2],[-34.3,12.5],[-27.1,17.3],[-25.3,25.8],[-30.1,33.0],[-38.7,34.7]],
  gateW: [[-82.7,-232.8],[-83.2,-235.4],[-77.5,-243.9],[-73.8,-243.5],[-57.8,-232.4],[-57.4,-230.4],[-63.6,-222.6],[-66.1,-222.0],[-76.7,-224.3]],
  gateS: [[37.6,-419.2],[40.0,-423.0],[43.1,-423.8],[60.1,-412.9],[60.6,-409.6],[55.8,-402.7],[53.1,-401.9],[35.8,-413.3],[35.5,-415.8]],
  kf: [[71.3,-384.5],[-37.3,-224.6],[-60.5,-239.8],[-63.0,-236.1],[-57.8,-232.4],[-57.4,-230.4],[-63.6,-222.6],[-66.1,-222.0],[-82.7,-232.8],[-83.2,-235.4],[-77.5,-243.9],[-73.8,-243.5],[-68.4,-239.7],[-66.1,-243.4],[-97.1,-263.6],[-108.1,-314.9],[-93.5,-336.1],[-95.3,-346.3],[-93.5,-348.8],[-98.4,-351.6],[-99.4,-356.6],[-77.7,-389.2],[-72.7,-390.1],[-68.4,-386.9],[-66.4,-390.0],[-57.6,-391.8],[-43.0,-414.4],[8.4,-425.2],[39.4,-404.8],[42.2,-409.1],[35.8,-413.3],[35.5,-415.8],[40.0,-423.0],[43.1,-423.8],[60.1,-412.9],[60.6,-409.6],[55.8,-402.7],[53.1,-401.9],[48.2,-405.2],[45.3,-400.9]],
}

// KA roof pavilions (OSM 967545511-522) and gate domes (948830305-308)
const KA_PAVILIONS: XY[][] = [
  [[94.2,95.8],[95.3,80.4],[123.1,82.4],[122.0,97.8]],
  [[96.9,56.7],[98.0,41.3],[125.8,43.3],[124.7,58.7]],
  [[47.4,86.5],[50.7,71.4],[78.0,77.3],[74.7,92.4]],
  [[55.7,48.2],[59.0,33.1],[86.3,39.0],[83.0,54.1]],
  [[-15.2,62.3],[-8.9,48.2],[16.6,59.4],[10.4,73.5]],
  [[0.7,26.4],[6.9,12.3],[32.5,23.5],[26.2,37.6]],
  [[-100.3,1.7],[-89.9,-9.7],[-69.2,9.0],[-79.7,20.4]],
  [[-73.8,-27.3],[-63.3,-38.7],[-42.7,-20.1],[-53.2,-8.6]],
  [[-143.1,-51.7],[-130.3,-60.5],[-114.4,-37.7],[-127.2,-28.9]],
  [[-110.7,-74.1],[-97.9,-82.9],[-82.0,-60.1],[-94.8,-51.3]],
  [[-166.3,-91.7],[-152.5,-98.8],[-139.6,-74.2],[-153.5,-67.1]],
  [[-131.3,-109.8],[-117.5,-116.9],[-104.6,-92.3],[-118.4,-85.2]],
]
const KA_GATE_DOMES: XY[][] = [
  [[74.3,68.3],[68.7,71.9],[62.2,70.5],[58.7,65.0],[60.1,58.6],[65.6,55.0],[72.1,56.4],[75.7,61.9]],
  [[102.7,66.4],[107.7,62.1],[114.3,62.5],[118.6,67.5],[118.2,74.0],[113.2,78.3],[106.6,77.9],[102.2,72.9]],
  [[-120.1,-59.9],[-114.7,-63.6],[-108.1,-62.5],[-104.4,-57.1],[-105.5,-50.6],[-110.7,-47.0],[-117.5,-48.0],[-121.2,-53.4]],
  [[-129.2,-85.8],[-135.0,-82.8],[-141.3,-84.7],[-144.4,-90.5],[-142.4,-96.8],[-136.6,-99.8],[-130.2,-97.9],[-127.2,-92.1]],
]

// The Ottoman portico (way/925367096) and the open mataf (inner ring of
// relation/1472531), unsimplified. The portico's inner edge is the mataf's
// edge on the north, west and south; on the east the mataf runs to the
// main building.
const PORTICO_INNER: XY[] = [[170.3, -159.7], [148.0, -154.8], [125.1, -149.9], [93.8, -170.5], [62.3, -191.6], [57.7, -214.6], [54.1, -235.4], [74.3, -267.6], [94.7, -298.6], [117.1, -303.4], [139.0, -307.7], [153.5, -297.6], [159.1, -293.9], [163.7, -291.0], [177.2, -282.1], [188.8, -299.4]]
const PORTICO_OUTER: XY[] = [[188.8, -299.4], [150.5, -324.2], [135.7, -327.6], [120.6, -324.3], [112.6, -322.8], [104.9, -321.0], [91.0, -318.1], [78.1, -309.6], [61.3, -284.7], [57.2, -278.6], [53.1, -272.2], [37.1, -247.1], [34.0, -231.9], [38.0, -209.9], [42.8, -188.0], [51.4, -175.2], [82.8, -153.9], [114.0, -134.0], [129.5, -131.1], [151.8, -135.1], [174.4, -140.4]]
const MATAF_EAST: XY[] = [[174.4, -140.4], [182.0, -153.0], [186.7, -159.8], [190.4, -165.3], [196.2, -210.2], [201.0, -255.4], [188.8, -299.4]]

// Minaret axes: centres of the OSM minaret parts (relations 13020567-658 and
// the 47-part clusters of each older minaret).
const OLD_GATES: Array<{ name: string; a: XY; b: XY }> = [
  { name: 'Fath', a: [147.6, -68.3], b: [181.9, -75.5] },
  { name: 'Umrah', a: [-22.7, -180.2], b: [-30.2, -214.7] },
  { name: 'King Fahd', a: [-74.1, -383.6], b: [-92.8, -355.2] },
  { name: 'King Abdulaziz', a: [81.6, -382.4], b: [117.3, -389.6] },
]
const SAFA_MINARET: XY = [243.4, -330.5]
const KA_GATE = { a: [-50.9, 91.5] as XY, b: [-93.8, 63.3] as XY }
const KA_CORNERS: XY[] = [[-221.0, -111.2], [160.5, 141.3]]
const KF_DOMES: XY[] = [[-22.0, -306.0], [-11.0, -323.0], [0.0, -339.0]]
const KAABA_C: XY = [132.9, -230.3]

// ------------------------------------------------------------- heights ---
const H_MAIN = 21 // relation/1472531 height; first and second Saudi expansions
const H_PORTICO = 9.5 // way/925367096
const H_MASA = 30 // relation/12790673
const H_ARC = 21 // northern ring: relation/1472531's height
const H_KA = 35.5 // relation/13020659
const H_KA_TOP = 42 // way/967545704
const H_GATE = 33 // old gate blocks, photo-scaled (c01, c22) against the 89 m minarets
const H_KA_GATE = 48 // estimated: no open photo of the King Abdullah gate itself
const H_KAABA = 13.1 // published (Wikipedia, Kaaba)
const FLOOR = 0.4 // the mataf's marble floor, drawn (see header)

// The map's ground (Mapterhorn z12, `tools/terrain.ts grid ... 500 50 --zoom 12`),
// metres above 289.0 m, rows from north (y = +500) to south, columns west to
// east, 50 m apart. The model's y = 0 is the lowest ground under it, 290.0 m.
const TER: number[][] = [
  [49.6,73.6,75.9,73.9,75.9,84.0,90.0,95.3,92.1,73.4,65.4,64.6,44.8,27.8,19.2,10.4,7.6,9.5,11.8,13.1,14.1], // z -500.0
  [37.7,56.5,61.9,58.6,62.8,75.7,81.2,79.1,66.7,47.8,35.5,33.2,30.8,27.5,19.6,13.8,9.8,10.2,13.2,14.5,13.7], // z -450.0
  [17.6,30.5,36.2,35.6,50.3,66.4,63.1,46.1,33.4,25.5,15.7,13.5,19.4,21.0,18.4,16.1,15.8,12.5,10.6,12.3,13.2], // z -400.0
  [12.1,13.6,17.1,18.2,33.2,45.8,35.7,22.6,18.3,17.6,13.3,10.1,17.1,21.2,17.6,17.5,18.2,13.4,10.7,10.1,13.9], // z -350.0
  [10.6,13.8,17.6,22.3,27.9,24.1,12.1,13.8,16.2,15.4,10.2,8.4,12.6,13.0,13.1,16.5,18.9,14.8,13.6,10.1,15.2], // z -300.0
  [10.3,16.2,23.1,25.2,24.8,17.1,9.5,11.0,10.7,11.4,7.9,7.0,7.5,8.1,9.8,14.9,18.1,15.2,15.7,11.0,14.5], // z -250.0
  [10.7,12.5,13.8,12.8,11.6,13.6,10.8,9.0,6.3,5.1,6.2,7.0,6.5,6.8,10.3,15.4,15.8,14.2,14.2,10.7,13.1], // z -200.0
  [13.2,10.4,9.9,12.1,8.1,9.8,8.8,6.6,2.9,6.0,8.9,8.3,8.8,7.0,7.5,12.4,12.4,11.8,10.8,9.1,12.2], // z -150.0
  [13.4,12.5,10.1,11.5,10.3,9.7,9.5,7.1,5.4,11.1,13.8,12.5,15.0,15.7,10.6,9.4,11.4,11.0,9.7,9.7,11.7], // z -100.0
  [13.6,8.9,8.2,10.0,7.9,8.5,11.6,9.1,5.8,6.7,8.0,9.8,17.4,19.1,13.3,10.6,11.9,10.6,10.1,10.3,11.5], // z -50.0
  [14.6,8.4,7.6,8.8,6.9,6.7,8.9,12.5,7.8,4.5,2.4,6.1,17.3,13.0,7.5,8.6,7.0,6.5,8.0,8.4,11.7], // z 0.0
  [11.2,6.7,6.2,9.2,7.6,8.3,13.3,17.2,12.8,7.3,2.6,4.0,7.3,5.1,6.0,10.3,6.8,3.5,4.8,5.6,10.7], // z 50.0
  [14.8,7.7,5.5,6.9,7.0,8.6,14.9,17.8,13.4,5.5,2.5,1.3,0.7,4.7,9.6,9.8,7.1,12.4,16.3,16.0,11.1], // z 100.0
  [16.0,7.6,4.6,4.7,7.7,7.6,9.2,12.3,9.8,6.7,6.1,0.0,1.5,8.4,11.0,9.7,15.4,39.1,44.4,34.0,15.7], // z 150.0
  [4.6,5.1,4.3,2.4,5.3,6.5,5.9,6.0,4.6,9.6,10.7,3.3,3.0,8.4,12.3,14.1,26.4,53.7,59.3,52.6,39.3], // z 200.0
  [1.8,8.0,11.2,7.0,4.8,4.7,5.0,5.0,10.4,19.3,15.3,5.4,4.6,8.8,18.2,26.6,35.6,54.7,64.6,66.1,59.8], // z 250.0
  [7.2,5.6,7.8,6.6,5.1,3.6,3.6,6.2,18.9,21.5,20.7,15.6,10.1,16.5,21.7,30.0,37.9,53.5,61.2,59.4,58.8], // z 300.0
  [12.1,6.9,6.8,10.5,11.8,9.5,6.1,7.3,20.8,23.2,21.7,21.5,23.5,20.2,16.1,21.1,33.9,46.7,46.4,44.1,45.5], // z 350.0
  [23.1,20.2,15.0,18.5,26.2,28.6,17.0,5.6,10.6,14.1,14.5,11.7,12.5,13.3,11.0,14.8,29.0,26.0,23.3,23.9,24.7], // z 400.0
  [37.9,30.9,27.7,25.8,33.3,43.3,33.3,12.5,6.9,4.7,5.3,4.3,4.4,7.5,8.5,10.8,16.6,13.2,13.5,16.1,16.8], // z 450.0
  [37.3,32.9,33.2,31.6,33.5,41.0,42.3,35.0,22.8,12.5,7.2,3.3,3.0,5.3,8.3,10.2,12.0,14.0,22.9,30.1,33.3], // z 500.0
]
/** The map's ground above the model's base at (x, y), bilinear. */
function ground(x: number, y: number): number {
  const fj = Math.min(19.999, Math.max(0, (x + 500) / 50)), fi = Math.min(19.999, Math.max(0, (500 - y) / 50))
  const i = Math.floor(fi), j = Math.floor(fj), ti = fi - i, tj = fj - j
  const v = TER[i][j] * (1 - ti) * (1 - tj) + TER[i][j + 1] * (1 - ti) * tj + TER[i + 1][j] * ti * (1 - tj) + TER[i + 1][j + 1] * ti * tj
  return Math.max(0, v - 1.0)
}

// ------------------------------------------------------------- helpers ---
const sub2 = (a: XY, b: XY): XY => [a[0] - b[0], a[1] - b[1]]
const dot2 = (a: XY, b: XY) => a[0] * b[0] + a[1] * b[1]
const len2 = (a: XY) => Math.hypot(a[0], a[1])
const area = (r: XY[]) => r.reduce((s, p, i) => { const q = r[(i + 1) % r.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0) / 2
const ccw = (r: XY[]) => (area(r) > 0 ? r.slice() : r.slice().reverse())
const centroid = (r: XY[]): XY => [r.reduce((s, p) => s + p[0], 0) / r.length, r.reduce((s, p) => s + p[1], 0) / r.length]

/** Douglas-Peucker on an open polyline (endpoints kept). */
function dpLine(pts: XY[], eps: number): XY[] {
  if (pts.length < 3 || eps <= 0) return pts.slice()
  const a = pts[0], b = pts[pts.length - 1]
  const L = len2(sub2(b, a)) || 1e-9
  let dmax = 0, imax = 0
  for (let i = 1; i < pts.length - 1; i++) {
    const d = Math.abs((b[0] - a[0]) * (a[1] - pts[i][1]) - (a[0] - pts[i][0]) * (b[1] - a[1])) / L
    if (d > dmax) { dmax = d; imax = i }
  }
  if (dmax <= eps) return [a, b]
  return [...dpLine(pts.slice(0, imax + 1), eps).slice(0, -1), ...dpLine(pts.slice(imax), eps)]
}
/** Douglas-Peucker on a closed ring, split at its two farthest-apart points. */
function dpRing(r: XY[], eps: number): XY[] {
  if (eps <= 0) return r.slice()
  let j = 0
  r.forEach((p, i) => { if (len2(sub2(p, r[0])) > len2(sub2(r[j], r[0]))) j = i })
  return [...dpLine(r.slice(0, j + 1), eps).slice(0, -1), ...dpLine([...r.slice(j), r[0]], eps).slice(0, -1)]
}

/** A ring grown outward by d (mitred, capped at 3d). */
function offsetRing(ring: XY[], d: number): XY[] {
  const r = ccw(ring), n = r.length
  return r.map((p, i) => {
    const a = r[(i + n - 1) % n], b = r[(i + 1) % n]
    const e0 = sub2(p, a), e1 = sub2(b, p)
    const l0 = len2(e0) || 1, l1 = len2(e1) || 1
    const n0: XY = [e0[1] / l0, -e0[0] / l0], n1: XY = [e1[1] / l1, -e1[0] / l1]
    const m: XY = [n0[0] + n1[0], n0[1] + n1[1]]
    const lm = len2(m) || 1
    const k = Math.min(3, 1 / Math.max(0.33, dot2([m[0] / lm, m[1] / lm], n0)))
    return [p[0] + (m[0] / lm) * d * k, p[1] + (m[1] / lm) * d * k] as XY
  })
}

/** A convex planar polygon, fan-triangulated and wound to face `n`. */
function poly(p: Part, pts: V3[], n: V3) {
  for (let i = 1; i < pts.length - 1; i++) {
    const a = pts[0], b = pts[i], c = pts[i + 1]
    const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
    const g = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
    if (Math.hypot(g[0], g[1], g[2]) < 1e-9) continue
    if (g[0] * n[0] + g[1] * n[1] + g[2] * n[2] >= 0) p.tri(a, b, c)
    else p.tri(a, c, b)
  }
}

/** Ear-clipping triangulation of a simple polygon with holes (bridged in). Triangles are counter-clockwise. */
function triangulate(outer: XY[], holes: XY[][] = []): XY[][] {
  let pts = ccw(outer)
  const segsCross = (p1: XY, p2: XY, p3: XY, p4: XY) => {
    const d = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
    const d1 = d(p3, p4, p1), d2 = d(p3, p4, p2), d3 = d(p1, p2, p3), d4 = d(p1, p2, p4)
    return ((d1 > 1e-9 && d2 < -1e-9) || (d1 < -1e-9 && d2 > 1e-9)) && ((d3 > 1e-9 && d4 < -1e-9) || (d3 < -1e-9 && d4 > 1e-9))
  }
  const hs = holes.map((h) => ccw(h).reverse())
  hs.sort((a, b) => Math.max(...b.map((p) => p[0])) - Math.max(...a.map((p) => p[0])))
  for (const h of hs) {
    let hi = 0
    h.forEach((p, i) => { if (p[0] > h[hi][0]) hi = i })
    const M = h[hi]
    const edges: Array<[XY, XY]> = []
    for (const ring of [pts, ...hs]) ring.forEach((p, i) => edges.push([p, ring[(i + 1) % ring.length]]))
    const order = pts.map((_, i) => i).sort((i, j) => len2(sub2(pts[i], M)) - len2(sub2(pts[j], M)))
    const pi = order.find((i) => edges.every(([e0, e1]) => !segsCross(pts[i], M, e0, e1))) ?? order[0]
    const hr = [...h.slice(hi), ...h.slice(0, hi), M]
    pts = [...pts.slice(0, pi + 1), ...hr, ...pts.slice(pi)]
  }
  const idx = pts.map((_, i) => i)
  const out: XY[][] = []
  const cr = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const same = (a: XY, b: XY) => Math.abs(a[0] - b[0]) < 1e-7 && Math.abs(a[1] - b[1]) < 1e-7
  let guard = 0
  while (idx.length > 3 && guard++ < 100000) {
    let clipped = false
    for (let k = 0; k < idx.length; k++) {
      const a = pts[idx[(k + idx.length - 1) % idx.length]], b = pts[idx[k]], c = pts[idx[(k + 1) % idx.length]]
      if (cr(a, b, c) <= 1e-9) continue
      let ok = true
      for (const j of idx) {
        const q = pts[j]
        if (same(q, a) || same(q, b) || same(q, c)) continue
        if (cr(a, b, q) >= -1e-9 && cr(b, c, q) >= -1e-9 && cr(c, a, q) >= -1e-9) { ok = false; break }
      }
      if (!ok) continue
      out.push([a, b, c])
      idx.splice(k, 1)
      clipped = true
      break
    }
    if (!clipped) {
      // degenerate leftovers: drop a collinear or reflex vertex
      let k = idx.findIndex((_, k) => Math.abs(cr(pts[idx[(k + idx.length - 1) % idx.length]], pts[idx[k]], pts[idx[(k + 1) % idx.length]])) < 1e-6)
      if (k < 0) k = 0
      idx.splice(k, 1)
    }
  }
  if (idx.length === 3 && cr(pts[idx[0]], pts[idx[1]], pts[idx[2]]) > 1e-9) out.push([pts[idx[0]], pts[idx[1]], pts[idx[2]]])
  return out
}

/** A flat horizontal face over a (possibly concave) ring with holes. */
function cap(p: Part, outer: XY[], z: number, up = true, holes: XY[][] = []) {
  for (const [a, b, c] of triangulate(outer, holes)) {
    const A: V3 = [a[0], a[1], z], B: V3 = [b[0], b[1], z], C: V3 = [c[0], c[1], z]
    if (up) p.tri(A, B, C)
    else p.tri(A, C, B)
  }
}

/** One vertical wall quad, facing right of a->b. */
function wall(p: Part, a: XY, b: XY, z0: number, z1: number) {
  if (z1 <= z0 + 1e-6) return
  p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
}

/** Walls around a ring (any winding), facing out. */
function walls(p: Part, ring: XY[], z0: number, z1: number) {
  const r = ccw(ring)
  r.forEach((a, i) => wall(p, a, r[(i + 1) % r.length], z0, z1))
}

function prism(p: Part, ring: XY[], z0: number, z1: number, top = true, bottom = false, roof?: Part) {
  walls(p, ring, z0, z1)
  if (top) cap(roof ?? p, ring, z1, true)
  if (bottom) cap(p, ring, z0, false)
}

function circle(cx: number, cy: number, r: number, n: number, phase = 0): XY[] {
  return Array.from({ length: n }, (_, k) => {
    const a = phase + (k * TAU) / n
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as XY
  })
}

/** A square of half-size h about (cx, cy), turned by `ang`. */
function square(cx: number, cy: number, h: number, ang: number): XY[] {
  const c = Math.cos(ang), s = Math.sin(ang)
  return ([[-h, -h], [h, -h], [h, h], [-h, h]] as XY[]).map(([x, y]) => [cx + x * c - y * s, cy + x * s + y * c] as XY)
}

/**
 * A surface of revolution about a vertical axis; `prof` runs [r, z] from the
 * bottom up. Flat-shaded facets when `smooth` is false (octagonal shafts).
 */
function revolve(p: Part, cx: number, cy: number, prof: [number, number][], n: number, smooth: boolean | 'ring' = true, a0 = 0) {
  const m = prof.length
  const nrm2 = prof.map((_, i) => {
    const pa = prof[Math.max(0, i - 1)], pb = prof[Math.min(m - 1, i + 1)]
    const dr = pb[0] - pa[0], dz = pb[1] - pa[1]
    const l = Math.hypot(dr, dz) || 1
    return [dz / l, -dr / l] as [number, number]
  })
  for (let k = 0; k < n; k++) {
    const t0 = a0 + (TAU * k) / n, t1 = a0 + (TAU * (k + 1)) / n
    for (let i = 0; i < m - 1; i++) {
      const P = (j: number, t: number): V3 => [cx + prof[j][0] * Math.cos(t), cy + prof[j][0] * Math.sin(t), prof[j][1]]
      const N = (j: number, t: number): V3 => [nrm2[j][0] * Math.cos(t), nrm2[j][0] * Math.sin(t), nrm2[j][1]]
      const dr = prof[i + 1][0] - prof[i][0], dz = prof[i + 1][1] - prof[i][1]
      const l = Math.hypot(dr, dz) || 1
      if (l < 1e-9) continue
      const tm = (t0 + t1) / 2
      const S = (t: number): V3 => [(dz / l) * Math.cos(t), (dz / l) * Math.sin(t), -dr / l]
      const a = P(i, t0), b = P(i, t1), c = P(i + 1, t1), d = P(i + 1, t0)
      if (smooth === false) {
        // flat facet: let the winding decide the normal
        const F: V3 = [(dz / l) * Math.cos(tm), (dz / l) * Math.sin(tm), -dr / l]
        if (prof[i][0] > 1e-6) poly(p, [a, b, c], F)
        if (prof[i + 1][0] > 1e-6) poly(p, [a, c, d], F)
        continue
      }
      const nA = smooth === 'ring' ? S(t0) : N(i, t0), nB = smooth === 'ring' ? S(t1) : N(i, t1)
      const nC = smooth === 'ring' ? S(t1) : N(i + 1, t1), nD = smooth === 'ring' ? S(t0) : N(i + 1, t0)
      if (prof[i][0] > 1e-6) p.tri(a, b, c, undefined, undefined, undefined, [nA, nB, nC])
      if (prof[i + 1][0] > 1e-6) p.tri(a, c, d, undefined, undefined, undefined, [nA, nC, nD])
    }
  }
}

/** Points of a segmental dome: base radius r at z, rising h. */
function domeProfile(r: number, z: number, h: number, rings: number): [number, number][] {
  const R = (r * r + h * h) / (2 * h), zc = z + h - R
  const top = Math.asin(Math.min(1, r / R))
  return Array.from({ length: rings + 1 }, (_, k) => {
    const a = top * (1 - k / rings)
    return [R * Math.sin(a), zc + R * Math.cos(a)] as [number, number]
  })
}

type ArcadeOpts = {
  z0: number // bottom of the openings (and of the front face)
  top: number // top of the front face
  apex: number // crown of the arches
  bay: number // target bay width
  pier: number // pier width between openings
  depth: number // how far back the back panel stands
  segs: number // arch segments (per side for pointed arches)
  pointed?: boolean
  sill?: boolean // the opening has a floor at z0 (upper tiers, windows)
  nb?: number // force the bay count
  inset?: number // keep the first and last metres plain (corners)
  gallery?: number // an intermediate floor slab across each opening at this height
}

/**
 * A wall with real arched openings, facing right of a->b: front spandrels
 * and piers, jambs, soffits and a recessed back panel. The openings are
 * cut into the building's own volume (the back panel stands `depth` inside
 * the outline), so nothing projects past the OSM footprint.
 */
function arcade(front: Part, back: Part, a: XY, b: XY, o: ArcadeOpts) {
  const L = len2(sub2(b, a))
  const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  const n: XY = [u[1], -u[0]]
  const at = (d: number, off: number, z: number): V3 => [a[0] + u[0] * d + n[0] * off, a[1] + u[1] * d + n[1] * off, z]
  const N3: V3 = [n[0], n[1], 0]
  const ins = o.inset ?? 0
  const span = L - 2 * ins
  const nb = o.nb ?? Math.max(1, Math.round(span / o.bay))
  const bay = span / nb
  const w = bay / 2 - o.pier / 2
  if (w < 0.4 || span <= 0) { wall(front, a, b, o.z0, o.top); return }
  const e = 0.35 // pointed arches: centres 0.35 w inside the jambs
  const rise = o.pointed ? w * Math.sqrt(1 + 2 * e) : w
  const spring = Math.max(o.z0 + 0.3, o.apex - rise)
  const archPts = (c: number): Array<[number, number]> => {
    const pts: Array<[number, number]> = []
    if (!o.pointed) {
      for (let i = 0; i <= o.segs; i++) {
        const t = Math.PI - (Math.PI * i) / o.segs
        pts.push([c + w * Math.cos(t), spring + w * Math.sin(t)])
      }
      return pts
    }
    const R = w * (1 + e)
    const tA = Math.acos(-e / (1 + e)) // angle of the apex seen from the left centre
    for (let i = 0; i <= o.segs; i++) {
      const t = Math.PI - ((Math.PI - tA) * i) / o.segs
      pts.push([c + w * e + R * Math.cos(t), spring + R * Math.sin(t)])
    }
    for (let i = o.segs - 1; i >= 0; i--) {
      const [x, z] = pts[i]
      pts.push([2 * c - x, z])
    }
    return pts
  }
  // pier strips: from each opening's right jamb to the next one's left jamb
  let prev = 0
  for (let k = 0; k <= nb; k++) {
    const next = k < nb ? ins + (k + 0.5) * bay - w : L
    if (next > prev + 1e-6) poly(front, [at(prev, 0, o.z0), at(next, 0, o.z0), at(next, 0, o.top), at(prev, 0, o.top)], N3)
    prev = ins + (k + 0.5) * bay + w
  }
  for (let k = 0; k < nb; k++) {
    const c = ins + (k + 0.5) * bay
    const pts = archPts(c)
    const m = pts.length
    // spandrel above the arch, in vertical strips
    for (let i = 0; i < m - 1; i++) {
      const [d0, z0] = pts[i], [d1, z1] = pts[i + 1]
      poly(front, [at(d0, 0, z0), at(d1, 0, z1), at(d1, 0, o.top), at(d0, 0, o.top)], N3)
      // soffit, facing into the opening
      const mx = (d0 + d1) / 2 - c, mz = (z0 + z1) / 2 - spring
      const inward: V3 = [-(u[0] * mx), -(u[1] * mx), -Math.max(0.05, mz)]
      poly(front, [at(d0, 0, z0), at(d1, 0, z1), at(d1, -o.depth, z1), at(d0, -o.depth, z0)], inward)
    }
    // jambs
    poly(front, [at(c - w, 0, o.z0), at(c - w, 0, spring), at(c - w, -o.depth, spring), at(c - w, -o.depth, o.z0)], [u[0], u[1], 0])
    poly(front, [at(c + w, 0, o.z0), at(c + w, 0, spring), at(c + w, -o.depth, spring), at(c + w, -o.depth, o.z0)], [-u[0], -u[1], 0])
    if (o.sill) poly(front, [at(c - w, 0, o.z0), at(c + w, 0, o.z0), at(c + w, -o.depth, o.z0), at(c - w, -o.depth, o.z0)], [0, 0, 1])
    if (o.gallery !== undefined && o.gallery < spring) {
      // a gallery floor across the opening, set 0.6 m back, with its slab edge and parapet
      const g = o.gallery
      poly(front, [at(c - w, -0.6, g), at(c + w, -0.6, g), at(c + w, -o.depth, g), at(c - w, -o.depth, g)], [0, 0, 1])
      poly(front, [at(c - w, -0.6, g - 0.6), at(c + w, -0.6, g - 0.6), at(c + w, -0.6, g + 1.0), at(c - w, -0.6, g + 1.0)], N3)
      poly(front, [at(c - w, -0.6, g - 0.6), at(c + w, -0.6, g - 0.6), at(c + w, -o.depth, g - 0.6), at(c - w, -o.depth, g - 0.6)], [0, 0, -1])
    }
    // back panel: rectangle and arch head
    poly(back, [at(c - w, -o.depth, o.z0), at(c + w, -o.depth, o.z0), at(c + w, -o.depth, spring), at(c - w, -o.depth, spring)], N3)
    poly(back, pts.map(([d, z]) => at(d, -o.depth, z)), N3)
  }
}

/** A flat arched window panel on a wall, facing right of a->b (low LOD). */
function archPanel(p: Part, a: XY, b: XY, z0: number, z1: number, out = 0.05, pointed = false) {
  const L = len2(sub2(b, a))
  const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  const n: XY = [u[1], -u[0]]
  const at = (d: number, z: number): V3 => [a[0] + u[0] * d + n[0] * out, a[1] + u[1] * d + n[1] * out, z]
  const r = L / 2, zs = z1 - (pointed ? r * 1.3 : r)
  const pts: V3[] = [at(0, z0), at(L, z0), at(L, zs)]
  if (pointed) pts.push(at(L * 0.85, zs + r * 0.85), at(r, z1), at(L * 0.15, zs + r * 0.85))
  else for (let k = 1; k < 4; k++) { const t = (Math.PI * k) / 4; pts.push(at(r + r * Math.cos(t), zs + r * Math.sin(t))) }
  pts.push(at(0, zs))
  poly(p, pts, [n[0], n[1], 0])
}

/** A flat rectangular panel on a wall, facing right of a->b. */
function rectPanel(p: Part, a: XY, b: XY, z0: number, z1: number, out = 0.05) {
  const L = len2(sub2(b, a))
  const n: XY = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L]
  const A: XY = [a[0] + n[0] * out, a[1] + n[1] * out], B: XY = [b[0] + n[0] * out, b[1] + n[1] * out]
  poly(p, [[A[0], A[1], z0], [B[0], B[1], z0], [B[0], B[1], z1], [A[0], A[1], z1]], [n[0], n[1], 0])
}

// ---------------------------------------------------------------- build ---
type Mats = { marble: Part; white: Part; win: Part; kiswa: Part; gold: Part; green: Part }

function build(detail: boolean): Mats {
  const M: Mats = { marble: new Part(), white: new Part(), win: new Part(), kiswa: new Part(), gold: new Part(), green: new Part() }
  const D = detail
  // the low model draws the long outlines a little coarser (3 m)
  const E = D ? 0 : 3
  const RG = (k: keyof typeof RING) => (['main', 'ka', 'kaRoof', 'arc', 'masa', 'masa3'].includes(k as string) ? dpRing(RING[k], E) : RING[k])
  const PI_ = dpLine(PORTICO_INNER, E), PO_ = dpLine(PORTICO_OUTER, E), ME_ = dpLine(MATAF_EAST, E)

  // A gilt finial: stem, two balls and an upturned crescent, facing `ang`.
  function finial(cx: number, cy: number, z: number, h: number, ang: number) {
    const s = h / 5
    const nb = D ? 6 : 5
    if (D) {
      revolve(M.gold, cx, cy, [[0.28 * s, z], [0.28 * s, z + 1.0 * s]], nb, 'ring')
      revolve(M.gold, cx, cy, [[0, z + 0.9 * s], [0.6 * s, z + 1.35 * s], [0.6 * s, z + 1.65 * s], [0, z + 2.1 * s]], nb, true)
      revolve(M.gold, cx, cy, [[0.2 * s, z + 2.0 * s], [0.2 * s, z + 2.4 * s]], nb, 'ring')
      revolve(M.gold, cx, cy, [[0, z + 2.3 * s], [0.42 * s, z + 2.6 * s], [0.42 * s, z + 2.85 * s], [0, z + 3.15 * s]], nb, true)
    } else {
      revolve(M.gold, cx, cy, [[0.3 * s, z], [0.3 * s, z + 3.2 * s]], 4, false)
    }
    if (!D) return // the low model keeps the gilt stem only
    // crescent, horns up, in the vertical plane along `ang`
    const R = 1.0 * s, r = 0.82 * s, dy = 0.38 * s, zc = z + 3.15 * s + R
    const yi = (R * R - r * r + dy * dy) / (2 * dy), xi = Math.sqrt(Math.max(0, R * R - yi * yi))
    const k = D ? 6 : 2
    const outline: XY[] = []
    const thR = Math.atan2(yi, xi)
    for (let i = 0; i <= k; i++) { const t = thR - ((Math.PI + 2 * thR) * i) / k; outline.push([R * Math.cos(t), R * Math.sin(t)]) }
    const phL = Math.atan2(yi - dy, -xi), phR = Math.atan2(yi - dy, xi)
    let span = phR - phL
    if (span < 0) span += TAU
    for (let i = k - 1; i >= 1; i--) { const t = phL + (span * i) / k; outline.push([r * Math.cos(t), dy + r * Math.sin(t)]) }
    const ux = Math.cos(ang), uy = Math.sin(ang), th = 0.22 * s
    const P = ([x, y]: XY, off: number): V3 => [cx + ux * x - uy * off, cy + uy * x + ux * off, zc + y]
    const tris = triangulate(outline)
    for (const [a, b, c] of tris) {
      poly(M.gold, [P(a, th), P(b, th), P(c, th)], [-uy, ux, 0])
      poly(M.gold, [P(a, -th), P(c, -th), P(b, -th)], [uy, -ux, 0])
    }
    const ol = ccw(outline)
    ol.forEach((p0, i) => {
      const p1 = ol[(i + 1) % ol.length]
      const ex = p1[0] - p0[0], ey = p1[1] - p0[1]
      const nrm: V3 = [ux * ey, uy * ey, -ex]
      poly(M.gold, [P(p0, th), P(p1, th), P(p1, -th), P(p0, -th)], nrm)
    })
  }

  // Gallery posts: real columns round an open balcony.
  function posts(cx: number, cy: number, r: number, z0: number, z1: number, w: number, n = 8, a0 = Math.PI / 8) {
    for (const [x, y] of circle(cx, cy, r, n, a0)) walls(M.white, square(x, y, w / 2, Math.atan2(y - cy, x - cx)), z0, z1)
  }

  /**
   * The nine older minarets (first and King Fahd expansions), from the OSM
   * parts: square shaft to 39 m, an open gallery at 43-47.5 m under a green
   * roof, an octagonal shaft, a second gallery at 72.9-75.9 m, a ribbed bulb
   * and the gilt crescent to 89 m. Widths drawn 1.2 times the OSM ones so
   * the shafts survive at phone size.
   */
  function oldMinaret(cx: number, cy: number, ang: number) {
    const s = 1.2, n = D ? 8 : 6, a0 = ang + Math.PI / n, F: boolean | 'ring' = 'ring'
    walls(M.marble, square(cx, cy, 3.85 * s, ang), 0, 39)
    if (D) prism(M.white, square(cx, cy, 4.3 * s, ang), 39, 41)
    else cap(M.white, square(cx, cy, 3.85 * s, ang), 39, true)
    revolve(M.white, cx, cy, D ? [[4.0 * s, 41], [5.45 * s, 42], [5.45 * s, 43], [2.95 * s, 43]] : [[3.0 * s, 39], [5.45 * s, 43], [2.95 * s, 43]], n, F, a0)
    revolve(M.win, cx, cy, [[2.95 * s, 43], [2.95 * s, 47.5]], n, F, a0)
    if (D) revolve(M.white, cx, cy, [[2.95 * s, 47.5], [5.45 * s, 47.5], [5.45 * s, 49.7]], n, F, a0)
    revolve(M.green, cx, cy, D ? [[5.45 * s, 49.7], [2.95 * s, 51.2]] : [[5.45 * s, 47.5], [2.95 * s, 51.2]], n, F, a0)
    revolve(M.white, cx, cy, D ? [[2.95 * s, 51.2], [2.95 * s, 71.2], [3.85 * s, 72.0], [3.85 * s, 72.9], [1.9 * s, 72.9]] : [[2.95 * s, 51.2], [2.95 * s, 71.2], [3.85 * s, 76.9]], n, F, a0)
    if (D) {
      revolve(M.win, cx, cy, [[1.9 * s, 72.9], [1.9 * s, 75.9]], n, F, a0)
      revolve(M.white, cx, cy, [[1.9 * s, 75.9], [3.85 * s, 75.9], [3.85 * s, 76.9]], n, F, a0)
    }
    revolve(M.green, cx, cy, [[3.85 * s, 76.9], [1.85 * s, 78.8]], n, F, a0)
    revolve(M.white, cx, cy, D ? [[1.85 * s, 78.8], [1.85 * s, 80.4], [2.15 * s, 81.4], [2.0 * s, 82.8], [1.2 * s, 83.9], [0.4 * s, 84.5], [0, 84.7]] : [[1.85 * s, 78.8], [2.15 * s, 81.4], [0, 84.7]], D ? 8 : n, D || 'ring', a0)
    if (D) {
      posts(cx, cy, 4.75 * s, 43, 47.5, 0.6 * s)
      posts(cx, cy, 3.2 * s, 72.9, 75.9, 0.5 * s, 6, Math.PI / 6)
      // balcony parapets
    }
    finial(cx, cy, 84.4, 4.6 * s, ang)
  }

  /**
   * The four King Abdullah minarets, from the OSM parts: a grey granite square
   * shaft to 54.6 m, a corbelled gallery at 61.5-68.7 m, a white shaft to
   * 105 m, a second gallery at 109.8-114.1 m, the bulb at 129 m and the
   * finial to 137.5 m. Widths 1.12 times OSM.
   */
  function kaMinaret(cx: number, cy: number, ang: number) {
    const s = 1.12, n = D ? 8 : 6, a0 = ang + Math.PI / n, F: boolean | 'ring' = 'ring'
    walls(M.marble, square(cx, cy, 5.3 * s, ang), 0, 54.6)
    revolve(M.white, cx, cy, D ? [[5.4 * s, 54.6], [7.5 * s, 60.1], [7.5 * s, 61.5], [4.1 * s, 61.5]] : [[5.4 * s, 54.6], [7.5 * s, 61.0], [4.1 * s, 61.5]], n, F, a0)
    revolve(M.win, cx, cy, [[4.1 * s, 61.5], [4.1 * s, 68.7]], n, F, a0)
    if (D) revolve(M.white, cx, cy, [[4.1 * s, 68.7], [7.5 * s, 68.7], [7.5 * s, 70.9]], n, F, a0)
    revolve(M.green, cx, cy, D ? [[7.5 * s, 70.9], [4.1 * s, 74.3]] : [[7.5 * s, 68.7], [4.1 * s, 74.3]], n, F, a0)
    revolve(M.white, cx, cy, D ? [[4.1 * s, 74.3], [4.1 * s, 105.2], [5.4 * s, 107.3], [5.4 * s, 109.8], [2.6 * s, 109.8]] : [[4.1 * s, 74.3], [4.1 * s, 105.2], [5.3 * s, 115.1]], n, F, a0)
    if (D) {
      revolve(M.win, cx, cy, [[2.6 * s, 109.8], [2.6 * s, 114.1]], n, F, a0)
      revolve(M.white, cx, cy, [[2.6 * s, 114.1], [5.3 * s, 114.1], [5.3 * s, 115.1]], n, F, a0)
    }
    revolve(M.green, cx, cy, [[5.3 * s, 115.1], [2.65 * s, 118.9]], n, F, a0)
    revolve(M.white, cx, cy, D ? [[2.65 * s, 118.9], [2.75 * s, 122.2], [2.1 * s, 124.4], [2.4 * s, 125.4], [2.25 * s, 127.0], [1.3 * s, 128.4], [0.4 * s, 129.1], [0, 129.3]] : [[2.65 * s, 118.9], [2.6 * s, 124.4], [2.4 * s, 126.4], [0, 129.3]], D ? 8 : n, D || 'ring', a0)
    if (D) {
      posts(cx, cy, 6.6 * s, 61.5, 68.7, 0.8 * s)
      posts(cx, cy, 4.5 * s, 109.8, 114.1, 0.6 * s, 6, Math.PI / 6)
    }
    finial(cx, cy, 129.0, 8.5 * s, ang)
  }

  /** A dome on a drum: arcaded drum in the detail model, plain in the low one. */
  function drumDome(cx: number, cy: number, r: number, z: number, drumH: number, rise: number, domeMat: Part, band = true) {
    const nd = D ? 8 : 8
    const ring = circle(cx, cy, r, nd, Math.PI / nd)
    if (D) {
      const rr = ccw(ring)
      rr.forEach((p0, i) => arcade(M.white, M.win, p0, rr[(i + 1) % rr.length], { z0: z + 0.6, top: z + drumH, apex: z + drumH - 0.6, bay: 99, nb: 1, pier: 1.2, depth: 0.8, segs: 4, sill: true }))
      walls(M.white, ring, z, z + 0.6)
    } else walls(M.white, ring, z, z + drumH)
    const zc = z + drumH
    if (D) revolve(M.white, cx, cy, [[r, zc], [r + 0.4, zc], [r + 0.4, zc + 0.6], [r * 0.98, zc + 0.6]], nd, 'ring', Math.PI / nd)
    else cap(M.white, ring, zc + 0.6, true)
    if (!D) walls(M.white, ring, zc, zc + 0.6)
    if (band && D) revolve(M.green, cx, cy, [[r * 0.98, zc + 0.6], [r * 0.95, zc + 1.4]], nd, 'ring', Math.PI / nd)
    const z1 = band && D ? zc + 1.4 : zc + 0.6
    revolve(domeMat, cx, cy, domeProfile(r * (band && D ? 0.95 : 0.98), z1, rise, D ? 5 : 2), D ? 16 : 8, true)
    if (D) finial(cx, cy, z1 + rise - 0.2, Math.max(2.2, r * 0.32), 0)
  }

  // --------------------------------------------------------- the Kaaba ---
  {
    // OSM way/103914569, scaled 1.08 about its centre to the published sides
    // (11.03 x 12.86 m on average; OSM has 10.2 x 11.7).
    const k = 1.08
    const c = centroid(RING.kaaba)
    const kr = ccw(RING.kaaba.map(([x, y]) => [c[0] + (x - c[0]) * k, c[1] + (y - c[1]) * k] as XY))
    const out = (r: XY[], d: number) => r.map(([x, y]) => { const v = sub2([x, y], c), l = len2(v); return [x + (v[0] / l) * d, y + (v[1] / l) * d] as XY })
    // the marble plinth (shadharwan), a little proud of the walls
    prism(M.white, out(kr, 0.45), 0, FLOOR + 0.35, true)
    walls(M.kiswa, kr, FLOOR + 0.35, H_KAABA)
    cap(M.marble, kr, H_KAABA, true)
    // the parapet edge of the roof, under the kiswa
    // the gold band (hizam) at two-thirds height, drawn 1.5 m tall (real 0.95 m) so it reads
    const band = out(kr, 0.05)
    walls(M.gold, band, 8.55, 10.05)
    // the door with its gold curtain (sitara) on the north-east face, near
    // the east (Black Stone) corner
    const ne = kr.map((p, i) => [p, kr[(i + 1) % 4]] as [XY, XY]).find(([a, b]) => { const m = [(a[0] + b[0]) / 2 - c[0], (a[1] + b[1]) / 2 - c[1]]; return m[0] > 0 && m[1] > 0 })!
    const [na, nb2] = ne
    const L = len2(sub2(nb2, na)), u: XY = [(nb2[0] - na[0]) / L, (nb2[1] - na[1]) / L]
    const d0 = 1.6, d1 = 5.2
    const pa: XY = [na[0] + u[0] * d0, na[1] + u[1] * d0], pb: XY = [na[0] + u[0] * d1, na[1] + u[1] * d1]
    rectPanel(M.gold, pa, pb, FLOOR + 1.0, 8.3, 0.07)
    if (D) {
      // the gilt inscription panels under the band, flush on every face
      kr.forEach((a, i) => {
        const b = kr[(i + 1) % 4]
        const LL = len2(sub2(b, a)), uu: XY = [(b[0] - a[0]) / LL, (b[1] - a[1]) / LL]
        for (const f of [0.3, 0.7]) {
          const dd = LL * f
          if (a === na && dd > d0 - 1.5 && dd < d1 + 1.5) continue
          const q0: XY = [a[0] + uu[0] * (dd - 1.4), a[1] + uu[1] * (dd - 1.4)], q1: XY = [a[0] + uu[0] * (dd + 1.4), a[1] + uu[1] * (dd + 1.4)]
          rectPanel(M.gold, q0, q1, 7.5, 8.2, 0.07)
        }
      })
    }
    // Hijr Ismail: the low white marble crescent wall on the north-west face (way/315911894)
    prism(M.white, RING.hijr, 0, FLOOR + 1.3, true)
    if (D) {
      // Maqam Ibrahim: the small gilt cage off the door face (way/473301379)
      const q: XY = [145.7, -223.6]
      revolve(M.gold, q[0], q[1], [[0.9, 0], [0.9, 0.5], [0.75, 0.5], [0.75, 2.3], [0.85, 2.4], [0.6, 2.9], [0, 3.1]], 8, false)
    }
  }

  // ------------------------------------------- the mataf and the portico ---
  const MATAF: XY[] = [...PI_, ...ME_.slice(1, -1).reverse()]
  const COURT: XY[] = [...PO_, ...ME_.slice(1, -1)]
  // The white marble floor of the mataf, 0.4 m: the one piece of paving
  // drawn, because the white ring round the black Kaaba is the identity.
  cap(M.white, MATAF, FLOOR, true)
  if (D) walls(M.white, MATAF, 0, FLOOR)

  // The Ottoman portico (Selim II and Murad IV, 16th-17th c.): pointed
  // arches on columns facing the mataf, golden stone, a row of small domes.
  {
    const P = ccw([...PI_, ...PO_.slice(1)])
    cap(M.marble, P, H_PORTICO, true)
    // the arcade along the inner edge: front faces the mataf (right of a->b
    // when walking the inner edge from its north end to its south end, i.e.
    // reversed order)
    const inner = PI_.slice().reverse()
    for (let i = 0; i < inner.length - 1; i++) {
      const a = inner[i], b = inner[i + 1]
      if (len2(sub2(b, a)) < 4) { wall(M.gold, a, b, 0, H_PORTICO); continue }
      arcade(M.gold, M.win, a, b, { z0: FLOOR, top: H_PORTICO, apex: 7.4, bay: D ? 7 : 26, pier: D ? 1.1 : 3.0, depth: D ? 5 : 4, segs: D ? 3 : 2, pointed: true })
    }
    // the two ends
    wall(M.gold, PO_[PO_.length - 1], PI_[0], 0, H_PORTICO)
    // parapet: a gold band with merlons along the arcade front
    for (let i = 0; i < inner.length - 1; i++) {
      const a = inner[i], b = inner[i + 1]
      const L = len2(sub2(b, a)), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
      const off = (d: number, o: number): XY => [a[0] + u[0] * d - n[0] * o, a[1] + u[1] * d - n[1] * o]
      // a 0.9 m parapet standing on the roof edge, inside the outline
      const pr: XY[] = [off(0, 0), off(L, 0), off(L, 0.5), off(0, 0.5)]
      if (D) prism(M.gold, pr, H_PORTICO, H_PORTICO + 0.9, true)
      if (D) {
        const nm = Math.floor(L / 9)
        for (let k = 0; k < nm; k++) {
          const d = (k + 0.5) * (L / nm)
          prism(M.gold, [off(d - 0.35, 0), off(d + 0.35, 0), off(d + 0.35, 0.5), off(d - 0.35, 0.5)], H_PORTICO + 0.9, H_PORTICO + 1.7, true)
        }
      }
    }
    // small domes over the bays, on the portico's mid-line
    const midline: XY[] = []
    for (let i = 0; i < PI_.length; i++) {
      // pair each inner point with the nearest outer point
      const p = PI_[i]
      let best = PO_[0]
      for (const q of PO_) if (len2(sub2(q, p)) < len2(sub2(best, p))) best = q
      midline.push([(p[0] + best[0]) / 2, (p[1] + best[1]) / 2])
    }
    const step = D ? 13 : 1e9
    for (let i = 0; i < midline.length - 1; i++) {
      const a = midline[i], b = midline[i + 1]
      const L = len2(sub2(b, a))
      const nd = Math.max(1, Math.round(L / step))
      for (let k = 0; k < nd; k++) {
        const t = (k + 0.5) / nd
        const x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t
        // keep clear of the thin south-east tip
        if (len2(sub2([x, y], [185, -295])) < 10) continue
        if (D) revolve(M.marble, x, y, [[2.5, H_PORTICO], [2.5, H_PORTICO + 0.6], ...domeProfile(2.5, H_PORTICO + 0.6, 2.1, 2)], 8, true)
        else revolve(M.marble, x, y, [[2.6, H_PORTICO], ...domeProfile(2.6, H_PORTICO, 2.3, 1)], 4, false, Math.PI / 4)
      }
    }
  }

  // ------------------------------------------------- the main building ---
  // The first Saudi and King Fahd expansions and the Mas'a: one roof at 21 m
  // round the court.
  // The court: the 2011-2021 mataf expansion closes round the whole court in
  // three arcaded tiers stepping back over white marble terraces (photos
  // c02, d119): tier A from the portico roof (from the mataf floor on the
  // east) to 15 m, tier B to 19 m, tier C to the 21 m roof. Its outer rim
  // is the hole in the grey main roof.
  const TA = 15, TB = 19
  const R1 = dpRing(offsetRing(COURT, 8), E), R2 = dpRing(offsetRing(COURT, 16), E)
  cap(M.white, RG('main'), H_MAIN, true, [R2])
  cap(M.white, R1, TA, true, [COURT])
  cap(M.white, R2, TB, true, [R1])
  // dark prayer rows on the terraces, following the ring (c02)
  {
    const strip = (o0: number, o1: number, z: number) => {
      const a = dpRing(offsetRing(COURT, o1), D ? 0 : 4), b = dpRing(offsetRing(COURT, o0), D ? 0 : 4)
      walls(M.marble, a, z, z + 0.5)
      if (D) ccw(b).reverse().forEach((p, i, r) => wall(M.marble, p, r[(i + 1) % r.length], z, z + 0.5))
      cap(M.marble, a, z + 0.5, true, [b])
    }
    if (D) { strip(1.6, 3.4, TA); strip(4.8, 6.6, TA); strip(9.6, 11.4, TB); strip(12.8, 14.6, TB) }
    else { strip(2.2, 5.8, TA); strip(10.2, 13.8, TB) }
  }
  {
    const tier = (ring: XY[], lower: number, upper: number, first: boolean) => {
      const court = ccw(ring).reverse() // walking it this way the right side is the court
      for (let i = 0; i < court.length; i++) {
        const a = court[i], b = court[(i + 1) % court.length]
        const L = len2(sub2(b, a))
        const mid: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
        const onEast = first && mid[0] > 185 && mid[1] > -300 && mid[1] < -150
        const z0 = first ? (onEast ? FLOOR : H_PORTICO) : lower
        const tall = upper - z0 > 8
        if (L < (D ? 6 : 14)) { wall(M.white, a, b, z0, upper); continue }
        if (!D && !tall) {
          // low model: the short tiers as walls with rows of arched panels
          wall(M.white, a, b, z0, upper)
          if (upper - z0 < 3) continue
          const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
          const nb = Math.max(1, Math.floor(L / 16))
          for (let k = 0; k < nb; k++) {
            const c = (k + 0.5) * (L / nb), w = Math.min(2.6, (upper - z0) * 0.45)
            archPanel(M.win, [a[0] + u[0] * (c - w), a[1] + u[1] * (c - w)], [a[0] + u[0] * (c + w), a[1] + u[1] * (c + w)], z0 + 0.4, upper - 0.9, 0.06)
          }
          continue
        }
        arcade(M.white, M.win, a, b, { z0, top: upper - 0.9, apex: upper - 1.8, bay: D ? (tall ? 11.5 : 8.5) : 18, pier: D ? 1.8 : 2.6, depth: D ? 3 : 2.5, segs: D ? 3 : 3, sill: z0 > 1, gallery: D && tall ? 7.5 : undefined })
        wall(M.white, a, b, upper - 0.9, upper)
      }
    }
    tier(COURT, 0, TA, true)
    tier(R1, TA, TB, false)
    tier(R2, TB, H_MAIN, false)
  }
  // The outer walls, grey-veined marble: continuous rows of arched windows
  // on two levels between the gates (c02, c27, c33) — real recesses in the
  // detail model, grouped arched panels in the low one.
  function facade(ring: XY[], z1: number, opts: { bay: number; apex: number; z0: number; minL: number; lowBay: number }) {
    const r = ccw(ring)
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length]
      const L = len2(sub2(b, a))
      if (L < opts.minL) { wall(M.marble, a, b, 0, z1); continue }
      // windows start 3 m above the ground of their own wall
      const lift = Math.max(0, Math.max(ground(a[0], a[1]), ground(b[0], b[1])) + 3 - opts.z0)
      const z0 = opts.z0 + lift
      const mid = z0 + (z1 - 2 - z0) * 0.55
      if (D && z1 - 2 - z0 > 9) {
        wall(M.marble, a, b, 0, z0)
        arcade(M.marble, M.win, a, b, { z0, top: mid, apex: mid - 1.4, bay: opts.bay, pier: opts.bay * 0.32, depth: 1.0, segs: 3, sill: true, inset: 1.5 })
        arcade(M.marble, M.win, a, b, { z0: mid + 0.8, top: z1, apex: z1 - 3.2, bay: opts.bay, pier: opts.bay * 0.32, depth: 0.9, segs: 3, sill: true, inset: 1.5 })
        wall(M.marble, a, b, mid, mid + 0.8)
      } else {
        wall(M.marble, a, b, 0, z1)
        if (D || mid - 1.4 < z0 + 4) continue
        // groups of three narrow arched panels
        const ng = Math.max(1, Math.round((L - 4) / opts.lowBay))
        const gb = (L - 4) / ng
        const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
        for (let g = 0; g < ng; g++) for (const k of [-1, 0, 1]) {
          const c = 2 + (g + 0.5) * gb + k * 4.2, w = 1.5
          archPanel(M.win, [a[0] + u[0] * (c - w), a[1] + u[1] * (c - w)], [a[0] + u[0] * (c + w), a[1] + u[1] * (c + w)], z0, Math.min(z1 - 3, z0 + 10), 0.06, true)
        }
      }
    }
  }
  facade(RG('main'), H_MAIN, { bay: 7.5, apex: 15, z0: 3, minL: 16, lowBay: 44 })

  /**
   * Rows of low roof structures and prayer rows (the dark grey rows on the
   * white roofs in c02) across a roof: parallel grey marble strips `width` wide and `h` tall, every
   * `spacing` metres at angle `ang`, clipped to `rings` (even-odd: holes
   * count) and kept 3 m off their edges.
   */
  function roofRows(rings: XY[][], z: number, ang: number, spacing: number, width: number, h: number) {
    const u: XY = [Math.cos(ang), Math.sin(ang)], v: XY = [-u[1], u[0]]
    const all = rings.flat()
    const vs = all.map((p) => dot2(p, v))
    for (let off = Math.min(...vs) + spacing / 2; off < Math.max(...vs); off += spacing) {
      const ts: number[] = []
      for (const r of rings) r.forEach((p, i) => {
        const q = r[(i + 1) % r.length]
        const sp = dot2(p, v) - off, sq = dot2(q, v) - off
        if ((sp > 0) !== (sq > 0)) { const t = sp / (sp - sq); ts.push(dot2([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t], u)) }
      })
      ts.sort((x, y) => x - y)
      for (let k = 0; k + 1 < ts.length; k += 2) {
        const t0 = ts[k] + 3, t1 = ts[k + 1] - 3
        if (t1 - t0 < 10) continue
        const P = (t: number, o: number): XY => [u[0] * t + v[0] * (off + o), u[1] * t + v[1] * (off + o)]
        prism(M.marble, [P(t0, -width / 2), P(t1, -width / 2), P(t1, width / 2), P(t0, width / 2)], z, z + h, true)
      }
    }
  }
  /** A white parapet band standing on a roof edge, inside the outline (detail). */
  function parapet(ring: XY[], z: number, h: number, t: number) {
    const outer = ccw(ring), inner = offsetRing(outer, -t)
    walls(M.white, outer, z, z + h)
    inner.slice().reverse().forEach((p, i, r) => wall(M.white, p, r[(i + 1) % r.length], z, z + h))
    cap(M.white, outer, z + h, true, [inner])
  }
  // the main roof: rows along the King Fahd expansion's axis, round the court
  // and the Mas'a and domes
  roofRows([RG('main'), R2, RG('masa')], H_MAIN, Math.atan2(160, -108), D ? 13 : 34, D ? 3.0 : 3.6, D ? 0.8 : 1.2)
  if (D) parapet(RG('main'), H_MAIN, 1.3, 1.0)

  // The King Fahd expansion's three roof domes on arcaded drums (bronze,
  // green band), OSM ways 301818188-190: 15 m across, 21-33 m.
  for (const [x, y] of KF_DOMES) drumDome(x, y, 7.0, H_MAIN, 5.5, 5.6, M.gold)

  // The Mas'a (Safa-Marwa gallery) rises to 30 m on the east, with the
  // Safa dome at its south end and the Marwa dome at its north end.
  {
    walls(M.marble, RG('masa'), H_MAIN, H_MASA)
    cap(M.white, RG('masa'), H_MASA, true)
    for (const k of ['masa1', 'masa2', 'masa3'] as const) prism(M.white, RG(k), H_MASA, 34, true)
    const sc = centroid(RING.safa)
    drumDome(sc[0], sc[1], 12.5, H_MASA, 4.0, 6.0, M.gold)
    const mc = centroid(RING.marwa)
    drumDome(mc[0], mc[1], 14.5, 34, 3.0, 7.0, M.gold)
  }

  // ------------------------------------------- King Abdullah expansion ---
  {
    facade(RG('ka'), H_KA, { bay: 12.5, apex: 24, z0: 4, minL: 20, lowBay: 100 })
    cap(M.white, RG('ka'), H_KA, true)
    // the top storey (way/967545704)
    const top = ccw(RG('kaRoof'))
    walls(M.white, top, H_KA, H_KA_TOP)
    cap(M.white, top, H_KA_TOP, true)
    if (D) parapet(top, H_KA_TOP, 1.1, 0.8)
    // roof pavilions (OSM mansard parts 967545511-522), 42-46 m
    for (const pr of KA_PAVILIONS) {
      const c = centroid(pr)
      if (!D) continue // the low model leaves the roof pavilions out
      walls(M.white, pr, H_KA_TOP, 44.5)
      const inset = pr.map(([x, y]) => [c[0] + (x - c[0]) * 0.75, c[1] + (y - c[1]) * 0.75] as XY)
      const lo = ccw(pr), hi = ccw(inset)
      lo.forEach((p0, i) => {
        const p1 = lo[(i + 1) % 4], q0 = hi[i], q1 = hi[(i + 1) % 4]
        const e = sub2(p1, p0), nrm: V3 = [e[1], -e[0], 2]
        poly(M.white, [[p0[0], p0[1], 44.5], [p1[0], p1[1], 44.5], [q1[0], q1[1], 46], [q0[0], q0[1], 46]], nrm)
      })
      cap(M.white, hi, 46, true)
    }
    // the four gate domes (948830305-308) and the central dome (556587834, 967545671)
    for (const g of KA_GATE_DOMES) {
      const c = centroid(g)
      revolve(M.white, c[0], c[1], [[7.6, H_KA_TOP], ...domeProfile(7.6, H_KA_TOP + 0.8, 4.6, 2)], 8, true)
    }
    const cA = centroid(RING.kaDomeA)
    drumDome(cA[0], cA[1], 17.5, H_KA_TOP, 2.0, 7.0, M.white, false)
  }

  // The northern ring (outer 3 of relation/1472531), 21 m, plain marble with
  // tall arched windows. Built level: the map's terrain still shows the
  // Shamiya hill that was cut away for the expansion (see header).
  {
    const ring = ccw(RG('arc'))
    for (let i = 0; i < ring.length; i++) {
      const a = ring[i], b = ring[(i + 1) % ring.length]
      const L = len2(sub2(b, a))
      const z0 = Math.max(3, Math.max(ground(a[0], a[1]), ground(b[0], b[1])) + 3)
      if (D && L >= 45 && z0 + 10 < H_ARC - 2) {
        // recessed windows, real openings into the wall, 3 m above its ground
        wall(M.marble, a, b, 0, z0)
        arcade(M.marble, M.win, a, b, { z0, top: H_ARC, apex: z0 + 10, bay: 20, pier: 13.6, depth: 1.0, segs: 4, sill: true, inset: 2 })
        continue
      }
      wall(M.marble, a, b, 0, H_ARC)
      if (L < (D ? 30 : 60)) continue
      const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
      const nb = Math.max(1, Math.round((L - 4) / (D ? 16 : 100))), bay = (L - 4) / nb
      for (let k = 0; k < nb; k++) {
        const c = 2 + (k + 0.5) * bay, w = 3.2
        archPanel(M.win, [a[0] + u[0] * (c - w), a[1] + u[1] * (c - w)], [a[0] + u[0] * (c + w), a[1] + u[1] * (c + w)], 3, 13, 0.06)
      }
    }
    cap(M.white, ring, H_ARC, true)
    roofRows([ring], H_ARC, Math.atan2(1, 1), D ? 16 : 60, D ? 3.0 : 3.6, D ? 0.8 : 1.2)
    if (D) parapet(ring, H_ARC, 1.3, 1.0)
  }

  // Bridges between the buildings (OSM building=bridge, 9.5 m to 21 / 25 m).
  for (const k of ['bS1', 'bS2', 'bS3', 'bS4'] as const) prism(M.marble, RING[k], H_PORTICO, H_MAIN, true, D)
  for (const k of ['bN1', 'bN2', 'bN3', 'bN4'] as const) prism(M.marble, RING[k], H_PORTICO, 25, true, D)
  // Escalator blocks at the Umrah and King Abdulaziz gates (25 m).
  if (D) for (const k of ['gateW', 'gateS'] as const) prism(M.marble, RING[k], 0, 25, true, false, M.white)

  // ------------------------------------------------- gates and minarets ---
  function gate(a: XY, b: XY, h: number, apex: number, old: boolean) {
    const W = len2(sub2(b, a))
    const t: XY = [(b[0] - a[0]) / W, (b[1] - a[1]) / W]
    let n: XY = [t[1], -t[0]]
    const m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
    if (dot2(n, sub2(m, KAABA_C)) < 0) n = [-n[0], -n[1]]
    const hb = old ? 3.85 * 1.2 : 5.3 * 1.12
    // the building's outline in front of the gate, found by casting from
    // the midpoint between the minarets along n
    let hit = Infinity
    for (const ring of [RING.main, RING.ka]) ring.forEach((p, i) => {
      const q = ring[(i + 1) % ring.length], e = sub2(q, p)
      const den = n[0] * e[1] - n[1] * e[0]
      if (Math.abs(den) < 1e-9) return
      const w = sub2(p, m)
      const tt = (w[0] * e[1] - w[1] * e[0]) / den, uu = (w[0] * n[1] - w[1] * n[0]) / den
      if (tt > 0 && uu >= 0 && uu <= 1) hit = Math.min(hit, tt)
    })
    // the porch stands 3 m proud of the outline, so its arches open in front of the wall
    const fo = Math.min(15, Math.max(hb, (isFinite(hit) ? hit : hb) + 3.0)), bo = old ? 22 : 30
    const P = (along: number, off: number): XY => [a[0] + t[0] * along + n[0] * off, a[1] + t[1] * along + n[1] * off]
    // the block between the minarets; its front is flush with their shafts
    const f0 = P(0, fo), f1 = P(W, fo), b1 = P(W, -bo), b0 = P(0, -bo)
    // make sure f0 -> f1 has the front on its right
    const right: XY = [t[1], -t[0]]
    const [fa, fb] = dot2(right, n) > 0 ? [f0, f1] : [f1, f0]
    const ring: XY[] = dot2(right, n) > 0 ? [f0, f1, b1, b0] : [f1, f0, b0, b1]
    const rr = ccw(ring)
    rr.forEach((p0, i) => {
      const p1 = rr[(i + 1) % 4]
      const isFront = (len2(sub2(p0, fa)) < 0.01 && len2(sub2(p1, fb)) < 0.01)
      if (!isFront) wall(M.marble, p0, p1, 0, h)
    })
    // three tall arches in the front, between the minaret shafts
    const ua: XY = [(fb[0] - fa[0]) / W, (fb[1] - fa[1]) / W]
    const ga: XY = [fa[0] + ua[0] * hb, fa[1] + ua[1] * hb], gb: XY = [fb[0] - ua[0] * hb, fb[1] - ua[1] * hb]
    wall(M.marble, fa, ga, 0, h)
    wall(M.marble, gb, fb, 0, h)
    const lowTop = D ? apex + 2.5 : h - 2
    arcade(M.marble, M.win, ga, gb, { z0: 0, top: lowTop, apex, bay: 99, nb: 3, pier: 2.4, depth: 2.6, segs: D ? 6 : 3, pointed: !old })
    // the band of small arched windows over the portal (photos c01, c05)
    if (D) arcade(M.marble, M.win, ga, gb, { z0: lowTop, top: h - 2, apex: h - 3.6, bay: 99, nb: old ? 5 : 7, pier: 2.6, depth: 0.8, segs: 4, sill: true })
    wall(M.white, ga, gb, h - 2, h)
    cap(M.white, rr, h, true)
    // a crenellated cresting along the top front (detail)
    if (D) {
      const nm = Math.floor(W / 2)
      for (let k = 0; k < nm; k++) {
        const d = (k + 0.5) * (W / nm)
        const q0: XY = [fa[0] + ua[0] * (d - 0.5), fa[1] + ua[1] * (d - 0.5)], q1: XY = [fa[0] + ua[0] * (d + 0.5), fa[1] + ua[1] * (d + 0.5)]
        prism(M.white, [q0, q1, [q1[0] - n[0] * 0.6, q1[1] - n[1] * 0.6], [q0[0] - n[0] * 0.6, q0[1] - n[1] * 0.6]], h, h + 1.3, true)
      }
    }
    const ang = Math.atan2(t[1], t[0])
    if (old) { oldMinaret(a[0], a[1], ang); oldMinaret(b[0], b[1], ang) } else { kaMinaret(a[0], a[1], ang); kaMinaret(b[0], b[1], ang) }
  }
  for (const g of OLD_GATES) gate(g.a, g.b, H_GATE, 15, true) // portal crowns at 0.45 of the gate (c01)
  gate(KA_GATE.a, KA_GATE.b, H_KA_GATE, 24, false)
  oldMinaret(SAFA_MINARET[0], SAFA_MINARET[1], Math.atan2(-6, 1))
  for (const [x, y] of KA_CORNERS) kaMinaret(x, y, 0)

  return M
}

// ---------------------------------------------------------------- write ---
// Night: the whole Haram is floodlit white, its roofs and courts lit by
// lamp masts as brightly as the walls (night photos a1, c19, c33).
const lit = (k: number) => (_p: V3, n: V3) => k * (n[2] > 0.8 ? 0.85 : 1)
function materials(M: Mats): Array<{ part: Part; material: MaterialSpec }> {
  return [
    { part: M.marble, material: { ...finish('haram-marble', 0xc4c3bd), floodlight: lit(0.85) } },
    { part: M.white, material: { ...finish('haram-white', 0xf2efe8), floodlight: lit(0.9) } },
    { part: M.win, material: PALETTE.window },
    { part: M.kiswa, material: { ...finish('kiswa', 0x4a4f57), floodlight: lit(0.5) } },
    { part: M.gold, material: { ...finish('haram-gold', 0xc6a978), floodlight: lit(0.9) } },
    { part: M.green, material: { ...finish('haram-green', 0x6e9c82), floodlight: lit(0.9) } },
  ]
}

async function write(file: string, parts: Array<{ part: Part; material: MaterialSpec }>, maxTris: number, maxBytes: number) {
  const triangles = parts.reduce((t, { part }) => t + part.triangles, 0)
  const glb = writeGlb('Masjid al-Haram', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
    bearing: BEARING, elevation: 0, height: 137.5,
  })
  console.log(`${file}: ${triangles} triangles, ${glb.length} bytes`)
  if (triangles > maxTris) throw new Error(`${file}: triangle budget exceeded: ${triangles}`)
  if (glb.length > maxBytes) throw new Error(`${file}: size budget exceeded: ${glb.length} bytes`)
  await Bun.write(new URL(`../models/${file}`, import.meta.url).pathname, glb)
}

if (import.meta.main) {
  await write('mecca-masjid-al-haram.glb', materials(build(false)), 6500, 250 * 1024)
  await write('mecca-masjid-al-haram.detail.glb', materials(build(true)), 40_000, 1536 * 1024)
}
