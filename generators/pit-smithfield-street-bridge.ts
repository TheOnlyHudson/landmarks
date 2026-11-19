/**
 * Smithfield Street Bridge (1883, Gustav Lindenthal; widened 1889 and 1911;
 * rehabilitated 1994-95) — procedural, CC0-1.0, no textures.
 * bun generators/pit-smithfield-street-bridge.ts
 *
 * Two lenticular (Pauli) truss spans over the Monongahela, each a lens of an
 * arched upper chord and a hanging eyebar lower chord meeting at tall end
 * posts, three trusses side by side (the third added in the 1889 widening),
 * so two roadways, one between each pair; cantilevered sidewalks outside;
 * cast-iron Gothic portals (two arches, three posts with finials, a
 * crenellated top) at both ends; plate-girder approach spans to Carson
 * Street on the south bank and to Fort Pitt Boulevard on the north;
 * sandstone piers. Trusses painted blue, portals cream-gold, the deck steel
 * rust-red.
 *
 * The whole bridge is one placement, abutment to abutment, as the OSM
 * outline covers it. Writes a low model (chords as solid bands, posts,
 * diagonals, top struts, portals, deck fascias and soffit, piers, lamp
 * points along the upper chords) and a detail model (adds the lateral
 * bracing, the floor beams, sidewalk railings, denser lights and the portal
 * lanterns), drawn from detailZoom 16.
 *
 * Frame: x across the bridge (+x east-south-east, upstream), y along it
 * toward downtown (north-north-east), z up, metres; origin on the centre
 * truss over the middle river pier, on the water. Placed at bearing 27.1°,
 * the trusses' line in lidar (the three truss planes hold their x within
 * 0.5 m over both spans at that bearing).
 *
 * Height. z = 0 is the Monongahela's surface: lidar water 216.3 m NAVD88 in
 * PA_WesternPA_2_2019, and the map's terrain (Mapterhorn) reads the river at
 * 216.29 m, so the two frames agree within 0.1 m. Ground under the end
 * piers, bents and abutments is the map's terrain above that (`GROUND`, 4 m
 * table in this frame), so the feet land on the terrain the map draws.
 *
 * Roadway heights the trusses, sidewalks and fascias are built around (no
 * road surface is drawn; the map draws the two roadways between the
 * trusses). Lidar roadway, lower readings across the lanes, every ~20 m
 * (`ROAD`): 9.4 m at the Carson Street abutment (y = −289), rising 2.3 %
 * over the south approach to 13.4 m at the south lens end (y = −108),
 * 14.1 m at y = −67, a flat crest of 14.8 m over the middle pier, 14.2 m at
 * y = +63, 13.5 m at the north lens end (+110) and 12.9 m at the Fort Pitt
 * Boulevard abutment (+162); in NAVD88 add 216.3 m (225.7, 230.4–231.1,
 * 229.8, 229.2 m). The OSM outline and the roadway ways (way/54219346,
 * 132781832, 132781828, 132781833) carry no height or ele; these are the
 * heights to give the map (docs/bridge-heights.md).
 *
 * Sources:
 * - OSM: outline way/467059561 (man_made=bridge, bridge:structure=truss,
 *   layer 2, wikidata Q7545513), y = −289 (Carson Street) to +162 (Fort Pitt
 *   Boulevard), with a flare on the west side at y = −245 to −205 for the
 *   Station Square ramp (service way/132777749). OSM's outline sits about
 *   2.5 m west of the lidar deck (an offset in OSM's own source imagery);
 *   the model follows lidar. No commercial imagery was used for this model.
 *   No building or building:part lies under the bridge's deck.
 * - Lidar, USGS 3DEP PA_WesternPA_2_2019 (flown 2019), 1 m grid over the
 *   whole bridge: truss planes at x = −7.6, 0, +7.6; lens ends at
 *   y = −108, 0 and +110 (spans 108 and 110 m); upper chord tops 22.3 m at
 *   the south end, 23.5 m over the middle pier, 22.1 m at the north end,
 *   rising 7.3 m to 30.2 m at both midspans (a parabola, checked within
 *   0.3 m at 10 m steps); portal walls 1 m deep at y = −109.5 and +111.3,
 *   their crenellated tops 23.1 m (9.7 m above the road), post caps
 *   24.4–25.2 m, finial tips 26.5–27.2 m (thin, so lidar under-reads them),
 *   post caps 2–3 cells wide at x = −8.5, 0, +8 and two rows (about 2 m)
 *   deep;
 *   sidewalk railings at x = −12.3 and +11.3; road heights as above.
 * - Published (Wikipedia "Smithfield Street Bridge"; HAER PA-2; ASCE
 *   landmark citation): opened 1883, two lenticular spans of 360 ft
 *   (109.7 m), 1,184 ft overall, the oldest steel bridge in the US, widened
 *   1889 (third truss) and 1911, portals of 1915 restored 1995, painted blue
 *   and gold.
 * - Photos (Wikimedia Commons):
 *   - "Smithfield Street Bridge, 2023-03-01" (Cbaile19, CC0): both spans
 *     from Mount Washington, three trusses, panel count (about 16 per
 *     span), the south portal;
 *   - "Smithfield Street Bridge, 2024-12-15", "-1", "-3", "-4", "-5"
 *     (Cbaile19, CC0): side elevations from the south bank: lens shape,
 *     piers, the rust-red deck girders, the portal over the south pier;
 *   - "North portal, Smithfield Street Bridge, 2021-05-11, 01" (Cbaile19,
 *     CC0): the portal face-on: two semicircular arches, three posts,
 *     crenellation, finials with stars;
 *   - "South gateway, Smithfield Street Bridge, 2023-03-01" (Cbaile19, CC0):
 *     the portal from above, its depth, the upper chords' ends behind it;
 *   - "Smithfield Street Bridge truss, 2021-05-11" (Cbaile19, CC0) and
 *     "Pittsburgh Smithfield Street bridge" (Scillystuff, CC BY-SA 3.0): the
 *     eyebar lower chord, the X-braced panels, the top lateral struts;
 *   - "Smithfield Street Bridge Overview (2473518444)" (daveynin, CC BY
 *     2.0) and "Smithfield Street Bridge, Pittsburgh, 2025-12-22"
 *     (Cbaile19, CC0): colours, the cantilevered sidewalk brackets;
 *   - "Pittsburgh skyline with Smithfield Street Bridge" (Cbaile19, CC0).
 * - Night: "Smithfield St Bridge (50208287308)" (thederek412, public
 *   domain): rows of lights along every upper chord, the portals floodlit
 *   gold; "Smithfield Street Bridge at Night" (Jmblough, CC BY-SA 4.0): the
 *   north portal floodlit. So: `lamp` beads along the upper chords,
 *   `_FLOODLIGHT` on the portals.
 *
 * Estimated: the panel count (16 per span, from the photos); chord sections
 * (upper 0.9 × 1.0 m, eyebars 0.8 × 0.6 m; drawn 1.1 × 1.2 m in the low
 * model so they read at phone size); the lower chord's sag, to 0.7 m above
 * the road at midspan (photos show the eyebars at the sidewalk there); the
 * deck depth (2.2 m below the road, from the side photos); pier plans and
 * tops (stone, battered, tops just under the girders); the arch springing
 * (3.4 m above the road, semicircular, from the face-on photo); finial
 * shape.
 * Portals (review round 2, made bolder): from the face-on photo (a3, north
 * portal; scaled by the lidar wall top, 9.7 m over the road) the posts are
 * about 1.9 m wide, the arches 6.5 m wide springing 3.0 m up (crowns 6.1 m),
 * the frieze just over the crowns, merlons 1.3 m tall on a wall top 8.4 m up,
 * caps to 11.3 m and the finials' stars at about 14.5 m. Drawn as flat-faced
 * frames: posts 2.0 m square at x = −8.2, 0, +8.2, caps 2.7 m, wall 1.6 m
 * deep, finials as a drum, a swelling crown (1.15 m radius), a neck and a
 * spike to 14.9 m with the star bead at 14.3 m.
 * Piers (round 2): lidar sees no stone beyond the deck's west edge
 * (x = −12.3; water returns from x = −13 outward at all three river piers),
 * so the piers are drawn 22.4 m across at the cap (−12.1 to +11.1, centred
 * under the deck) rather than 26 m; their length along the bridge (10–11 m
 * at the lens ends, 9 m at the middle pier) stays estimated from the side
 * photos, as the deck hides them from lidar and NAIP. The approach supports are not in lidar or in a clear photo: the
 * south approach's bank pier (y = −158), steel bent (−200; ground clearance under the girders is only 1–2 m
 * further south) and
 * abutment (−289), and the north approach's second pier (+140, read from the
 * daveynin overview) and abutment wall (+162) are placed where the terrain
 * and the photos allow, not measured.
 * Colour: truss blue from sunlit photos (#4d6f9b) pulled to #56769c; portal
 * cream-gold (#ecdc9a in sun) to #e6d79c; deck girders rust-red (#a3654b)
 * to #a86c52; the piers' soot-weathered sandstone (#3e3833 to #4d4740 in
 * the side photos) drawn as a warm charcoal-brown #594d44, as dark as
 * STYLE.md's charcoal limit allows, so the piers read massive and dark.
 */
import { Part, cross, sub, writeGlb, type V3, type MaterialSpec } from './mesh'
import { band, bead, chamferedRect, face, footedLoft, groundAt, merged, piecewise, rod, stations, strip, type GroundGrid } from './bridge-kit'
import { finish } from './palette'

const GROUND: GroundGrid = {"y0":-300,"x0":-20,"step":4,"z":[[8.9,9.1,9.3,9.4,9.5,9.5,9.5,9.5,8.9,7.7,7.2],[8.7,9.2,9.5,9.5,9.5,9.6,9.5,9.6,8.9,7.7,7.1],[8.4,9.1,9.3,9.4,9.4,9.5,9.5,9.4,8.9,7.7,7.0],[8.1,8.5,8.7,8.9,9.0,9.2,9.3,9.2,8.7,7.6,6.9],[7.8,8.2,8.3,8.5,8.7,8.8,8.9,9.0,8.8,7.7,6.7],[7.5,8.0,8.1,8.2,8.2,8.4,8.5,8.6,8.6,7.6,6.6],[7.2,7.7,7.8,7.8,7.7,7.7,7.6,7.6,7.5,7.0,6.3],[6.9,7.1,7.2,7.0,6.9,6.7,6.6,6.5,6.4,6.3,6.3],[6.6,6.6,6.5,6.5,6.4,6.4,6.3,6.3,6.3,6.3,6.4],[6.6,6.5,6.4,6.4,6.4,6.4,6.4,6.4,6.4,6.4,6.5],[6.5,6.5,6.6,6.5,6.6,6.6,6.7,6.7,6.7,6.6,6.6],[6.4,7.0,6.8,6.8,6.9,6.9,7.0,7.1,7.0,6.7,6.7],[6.5,7.1,6.9,6.9,7.0,7.0,7.1,7.2,7.1,6.8,6.8],[6.6,7.1,6.8,6.9,6.9,7.0,7.1,7.2,7.2,6.8,6.8],[6.7,6.7,6.6,6.7,6.8,6.9,7.0,7.1,7.2,6.9,6.8],[6.7,6.7,6.7,6.7,6.8,6.9,7.0,7.1,7.1,6.9,6.9],[6.8,6.8,6.8,6.8,6.9,6.9,7.0,7.1,7.1,6.8,6.9],[6.8,6.8,6.9,6.9,6.9,6.9,7.0,7.0,7.1,6.8,6.8],[6.8,6.9,6.9,6.9,6.9,7.0,7.0,7.1,7.0,6.8,6.7],[6.8,6.9,6.9,7.0,7.0,7.0,7.1,7.1,7.0,6.7,6.7],[6.9,6.9,7.0,7.0,7.1,7.1,7.2,7.2,7.1,6.7,6.6],[6.9,7.0,7.0,7.1,7.1,7.2,7.2,7.3,7.1,6.7,6.6],[6.9,7.0,7.1,7.1,7.2,7.3,7.3,7.3,7.2,6.7,6.5],[7.0,7.1,7.2,7.2,7.2,7.3,7.3,7.3,7.3,6.8,6.5],[6.9,7.2,7.1,7.2,7.2,7.2,7.2,7.3,7.4,6.7,6.4],[6.8,7.0,6.9,6.9,6.9,7.0,7.0,7.1,7.0,6.6,6.3],[6.7,6.8,6.7,6.6,6.6,6.6,6.5,6.4,6.4,6.4,6.1],[6.5,6.7,6.6,6.5,6.4,6.3,6.2,6.1,6.2,6.1,5.9],[5.9,6.0,6.1,6.1,6.0,5.9,5.8,5.8,5.8,5.8,5.7],[5.8,5.8,5.8,5.6,5.5,5.4,5.2,5.1,5.0,4.8,4.6],[5.0,4.9,4.7,4.8,4.6,4.5,4.3,4.1,3.8,3.7,3.7],[3.7,3.8,3.9,4.1,4.0,4.0,4.0,4.1,4.2,4.2,4.3],[4.3,4.3,4.3,4.3,4.3,4.4,4.4,4.4,4.4,4.3,4.3],[4.5,4.5,4.4,4.4,4.3,4.2,4.2,4.2,4.2,4.1,4.1],[4.3,4.3,4.2,3.6,3.4,3.3,3.1,3.2,4.0,4.3,4.3],[4.1,3.8,3.4,2.2,1.8,1.6,1.6,2.0,2.9,4.4,4.4],[0.7,0.5,0.3,0.3,0.2,0.2,0.3,0.5,0.7,0.8,0.5],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.2,0.4,0.5,0.7],[0.8,0.8,0.8,0.4,0.4,0.5,0.8,1.0,1.1,1.3,1.4],[0.9,0.9,0.9,0.8,0.9,1.1,1.2,1.3,1.4,1.5,1.6],[1.3,1.1,1.1,1.2,1.3,1.4,1.4,1.5,1.6,1.7,1.9],[1.6,1.3,1.3,1.4,1.5,1.6,1.7,1.8,1.8,2.0,2.1],[1.7,1.6,1.6,1.6,1.7,1.8,1.9,2.0,2.0,2.1,2.3],[1.9,1.9,1.9,1.9,1.9,2.0,2.1,2.2,2.3,2.4,2.5],[2.1,2.1,2.2,2.2,2.2,2.2,2.4,2.4,2.5,2.6,2.8]]}

const ROAD: [number, number][] = [
  [-300, 9.4], [-289, 9.4], [-282, 9.8], [-264, 10.1], [-246, 10.3], [-228, 10.8], [-210, 11.2], [-192, 11.6], [-174, 12.0],
  [-156, 12.5], [-138, 12.9], [-120, 13.2], [-108, 13.4], [-87, 13.8], [-67, 14.1], [-47, 14.4], [-27, 14.6], [-7, 14.8],
  [10, 14.75], [23, 14.7], [43, 14.5], [63, 14.2], [83, 13.9], [103, 13.6], [110, 13.5], [127, 13.2], [145, 13.0], [170, 12.9],
]
const road = piecewise(ROAD)
const ground = (x: number, y: number) => (y > -150 && y < 148 ? 0 : Math.max(0, groundAt(GROUND, x, y)))

const BEARING = 27.1
const XT = [-7.6, 0, 7.6]
const Y_S = -108, Y_M = 0, Y_N = 110          // lens ends
const P_S = -109.5, P_N = 111.3               // portal planes
const END_S = -289, END_N = 162               // abutment faces (outline ends)
const WALK_W = -12.3, WALK_E = 11.3           // sidewalk outer edges
const DECK_DOWN = 2.2                         // girder bottom below the road
const RISE = 7.3                              // upper chord rise over its end chord
const PANELS = 16
const PIER_X = -0.5                           // pier centre line, under the deck's (x = -12.3 to +11.3)
const POST_X = [-8.2, 0, 8.2]                  // portal posts (lidar: caps at x = -8.5, 0, +8)
const POST_W = 2.0, PORTAL_D = 1.6            // post shaft width, wall depth (lidar: about 2 m over the caps)

type Span = { ya: number; yb: number; ea: number; eb: number }
const SPANS: Span[] = [
  { ya: Y_S, yb: Y_M, ea: 22.3, eb: 23.5 },
  { ya: Y_M, yb: Y_N, ea: 23.5, eb: 22.1 },
]
const spanAt = (y: number) => SPANS.find((s) => y >= s.ya - 1e-6 && y <= s.yb + 1e-6)!
/** Upper chord top, and the lower chord's centre line. */
function chords(s: Span) {
  const mid = (s.ya + s.yb) / 2, E = (y: number) => s.ea + ((s.eb - s.ea) * (y - s.ya)) / (s.yb - s.ya)
  const f = (y: number) => 1 - ((2 * (y - s.ya)) / (s.yb - s.ya) - 1) ** 2
  const sag = E(mid) - 1.0 - (road(mid) + 0.7)
  return { top: (y: number) => E(y) + RISE * f(y), low: (y: number) => E(y) - 1.0 - sag * f(y) }
}

const norm = (a: V3): V3 => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]

/** An upright box. */
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, bottom = true) {
  face(p, [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], [0, 0, 1])
  if (bottom) face(p, [x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [0, 0, -1])
  face(p, [x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], [0, -1, 0])
  face(p, [x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1], [0, 1, 0])
  face(p, [x0, y0, z0], [x0, y1, z0], [x0, y1, z1], [x0, y0, z1], [-1, 0, 0])
  face(p, [x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1], [1, 0, 0])
}

/** The four sides of an upright box, no top or bottom. */
function sides(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) {
  face(p, [x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], [0, -1, 0])
  face(p, [x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1], [0, 1, 0])
  face(p, [x0, y0, z0], [x0, y1, z0], [x0, y1, z1], [x0, y0, z1], [-1, 0, 0])
  face(p, [x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1], [1, 0, 0])
}

/** A rectangular section (w across x, h in the y-z plane) swept along a path in a plane x = const. */
function chordBand(p: Part, path: V3[], w: number, h: number, faces = { top: true, bottom: true }) {
  const X: V3 = [1, 0, 0]
  const rings = path.map((c, i) => {
    const t = norm(sub(path[Math.min(i + 1, path.length - 1)], path[Math.max(i - 1, 0)]))
    const U = norm(cross(X, t))
    const hu = mul(U, h / 2), wx = mul(X, w / 2)
    return { U, pts: [sub(sub(c, wx), hu), sub(add(c, wx), hu), add(add(c, wx), hu), add(sub(c, wx), hu)] as V3[] }
  })
  for (let i = 0; i < rings.length - 1; i++) {
    const a = rings[i].pts, b = rings[i + 1].pts, U = norm(add(rings[i].U, rings[i + 1].U))
    if (faces.top) face(p, a[3], a[2], b[2], b[3], U)
    if (faces.bottom) face(p, a[0], a[1], b[1], b[0], mul(U, -1))
    face(p, a[1], a[2], b[2], b[1], X)
    face(p, a[0], a[3], b[3], b[0], [-1, 0, 0])
  }
}

/** A vertical round-ish spire: rings of [radius, z] about (cx, cy), n sides, closed to a point at the top. */
function spire(p: Part, cx: number, cy: number, rings: [number, number][], n = 6) {
  const pt = (r: number, z: number, k: number): V3 => [cx + r * Math.cos((2 * Math.PI * (k + 0.5)) / n), cy + r * Math.sin((2 * Math.PI * (k + 0.5)) / n), z]
  for (let i = 0; i < rings.length - 1; i++) {
    const [r0, z0] = rings[i], [r1, z1] = rings[i + 1]
    for (let k = 0; k < n; k++) {
      const a = pt(r0, z0, k), b = pt(r0, z0, k + 1), c = pt(r1, z1, k + 1), d = pt(r1, z1, k)
      const am = (2 * Math.PI * (k + 1)) / n
      const nn = norm([Math.cos(am) * (z1 - z0), Math.sin(am) * (z1 - z0), r0 - r1])
      if (r1 < 1e-3) { if (cross(sub(b, a), sub(c, a)).every((v) => v === 0)) continue; p.tri(a, b, c); continue }
      face(p, a, b, c, d, nn)
    }
  }
}

/**
 * One cast-iron portal, its wall centred on y = py, facing ±y: a flat-faced
 * openwork frame of three square posts, two semicircular arches and a
 * crenellated top, each post crowned by a cap and a bold lantern finial.
 */
function portal(p: Part, stars: Part, lanterns: Part | null, py: number) {
  const rT = road(py), D = PORTAL_D / 2
  const y0 = py - D, y1 = py + D
  const PH = POST_W / 2, CAP = PH + 0.35
  const WALL_TOP = rT + 8.4, MERLON = 1.3
  const SPRING = rT + 3.0
  for (const x of POST_X) {
    box(p, x - CAP, x + CAP, py - CAP, py + CAP, rT - 0.6, rT + 1.2, false)                 // plinth
    box(p, x - PH, x + PH, py - PH, py + PH, rT + 1.2, rT + 10.3, false)                     // shaft
    box(p, x - CAP, x + CAP, py - CAP, py + CAP, rT + 10.3, rT + 11.3)                       // cap
    // Lantern finial: a drum, a swelling crown, a neck and a spike.
    spire(p, x, py, [[0.85, rT + 11.3], [0.85, rT + 12.0], [1.15, rT + 12.5], [0.75, rT + 13.2], [0.3, rT + 13.5], [0.22, rT + 14.4], [0.0, rT + 14.9]])
    bead(stars, [x, py, rT + 14.3], 0.55, !lanterns) // the dark iron star on each finial
    if (lanterns) for (const s of [-1, 1]) bead(lanterns, [x, py + s * (PH + 0.3), rT + 4.2], 0.3)
  }
  // Two bays, each a semicircular arch springing from the posts' faces.
  for (const [xl, xr] of [[POST_X[0] + PH, POST_X[1] - PH], [POST_X[1] + PH, POST_X[2] - PH]]) {
    const cx = (xl + xr) / 2, R = (xr - xl) / 2, N = 8
    for (let i = 0; i < N; i++) {
      const a0 = Math.PI - (Math.PI * i) / N, a1 = Math.PI - (Math.PI * (i + 1)) / N
      const xa = cx + R * Math.cos(a0), xb = cx + R * Math.cos(a1)
      const za = SPRING + R * Math.sin(a0), zb = SPRING + R * Math.sin(a1)
      face(p, [xa, y0, za], [xb, y0, zb], [xb, y0, WALL_TOP], [xa, y0, WALL_TOP], [0, -1, 0])
      face(p, [xa, y1, za], [xb, y1, zb], [xb, y1, WALL_TOP], [xa, y1, WALL_TOP], [0, 1, 0])
      const am = (a0 + a1) / 2
      face(p, [xa, y0, za], [xb, y0, zb], [xb, y1, zb], [xa, y1, za], [-Math.cos(am), 0, -Math.sin(am)])
    }
    face(p, [xl, y0, WALL_TOP], [xr, y0, WALL_TOP], [xr, y1, WALL_TOP], [xl, y1, WALL_TOP], [0, 0, 1])
    // A frieze band under the crenellation, standing a little proud.
    for (const [yy, s] of [[y0, -1], [y1, 1]] as [number, number][]) {
      const yo = yy + s * 0.2
      face(p, [xl, yo, rT + 6.7], [xr, yo, rT + 6.7], [xr, yo, rT + 7.4], [xl, yo, rT + 7.4], [0, s, 0])
      face(p, [xl, yy, rT + 7.4], [xr, yy, rT + 7.4], [xr, yo, rT + 7.4], [xl, yo, rT + 7.4], [0, 0, 1])
      face(p, [xl, yy, rT + 6.7], [xl, yo, rT + 6.7], [xr, yo, rT + 6.7], [xr, yy, rT + 6.7], [0, 0, -1])
    }
    // Merlons.
    const n = 7, pitch = (xr - xl) / n
    for (let k = 0; k < n; k++) {
      const xm = xl + pitch * (k + 0.5)
      box(p, xm - pitch * 0.3, xm + pitch * 0.3, y0, y1, WALL_TOP, WALL_TOP + MERLON, false)
    }
  }
}

/** Builds the bridge and writes its low and detail GLBs. */
async function build() {
  const blueLow = new Part(), blueDet = new Part(), cream = new Part(), creamDet = new Part()
  const rust = new Part(), rustDet = new Part(), stone = new Part(), lampsLow = new Part(), lampsDet = new Part()
  const both = (f: (p: Part) => void, ...ps: Part[]) => ps.forEach(f)

  // ---- Lens trusses -------------------------------------------------------------------
  for (const s of SPANS) {
    const { top, low } = chords(s)
    const nodes = stations(s.ya, s.yb, (s.yb - s.ya) / PANELS)
    const fine = stations(s.ya, s.yb, (s.yb - s.ya) / (PANELS * 2))
    for (const x of XT) {
      // Upper chord: a box girder; lower chord: the eyebar bundle.
      chordBand(blueDet, fine.map((y) => [x, y, top(y) - 0.5] as V3), 0.9, 1.0)
      chordBand(blueLow, nodes.map((y) => [x, y, top(y) - 0.6] as V3), 1.1, 1.2, { top: true, bottom: false })
      chordBand(blueDet, fine.map((y) => [x, y, low(y)] as V3), 0.8, 0.6)
      chordBand(blueLow, nodes.map((y) => [x, y, low(y)] as V3), 1.0, 0.7, { top: true, bottom: false })
      // Posts at the panel points, from the floor to the upper chord.
      for (let i = 1; i < nodes.length - 1; i++) {
        const y = nodes[i], zb = road(y) - 0.4, zt = top(y) - 0.9
        box(blueDet, x - 0.3, x + 0.3, y - 0.25, y + 0.25, zb, zt, false)
        strip(blueLow, [x, y, zb], [x, y, zt], 0.9, [1, 0, 0])
      }
      // X-bracing in every panel, chord to chord.
      for (let i = 0; i < nodes.length - 1; i++) {
        const ya = nodes[i], yb = nodes[i + 1]
        const at = (y: number, up: boolean): V3 => [x, y, up ? top(y) - 1.0 : low(y) + 0.3]
        if (i === 0 || i === nodes.length - 2) continue // the end panels close to a point
        for (const [a, b] of [[at(ya, true), at(yb, false)], [at(ya, false), at(yb, true)]] as [V3, V3][]) {
          strip(blueDet, a, b, 0.3, [1, 0, 0])
          strip(blueLow, a, b, 0.3, [1, 0, 0])
        }
      }
      // A floor girder along the truss line at the curb, which the posts land on.
      const fy = stations(s.ya, s.yb, 6.9)
      band(blueDet, x - 0.35, x + 0.35, fy, (y) => road(y) + 0.9, (y) => road(y) - DECK_DOWN + 0.2, { out: true, in: true, top: true })
      if (x !== 0) band(blueLow, x - 0.35, x + 0.35, fy, (y) => road(y) + 0.9, (y) => road(y) - DECK_DOWN + 0.2, { out: true })
    }
    // End posts over the piers.
    for (const y of [s.ya, s.yb]) for (const x of XT) {
      const ztop = (y === Y_M ? 23.5 : y === Y_S ? 22.3 : 22.1) + 0.1
      both((p) => box(p, x - 0.55, x + 0.55, y - 0.6, y + 0.6, road(y) - DECK_DOWN, ztop, false), blueLow, blueDet)
    }
    // Top struts between the trusses: every panel (detail), every other one (low).
    for (let i = 1; i < nodes.length - 1; i++) {
      const y = nodes[i], z = top(y) - 0.7
      for (const [xa, xb] of [[XT[0], XT[1]], [XT[1], XT[2]]]) {
        box(blueDet, xa + 0.45, xb - 0.45, y - 0.2, y + 0.2, z - 0.25, z + 0.25)
        if (i % 2 === 0) box(blueLow, xa + 0.55, xb - 0.55, y - 0.25, y + 0.25, z - 0.3, z + 0.3)
        // Detail: lateral X-bracing in the plane of the top struts.
        if (i < nodes.length - 2) {
          const y2 = nodes[i + 1], z2 = top(y2) - 0.7
          rod(blueDet, [xa + 0.45, y, z], [xb - 0.45, y2, z2], 0.06, 3)
          rod(blueDet, [xb - 0.45, y, z], [xa + 0.45, y2, z2], 0.06, 3)
        }
      }
    }
    // Lights strung along each upper chord.
    for (const x of XT) {
      for (const y of stations(s.ya + 3, s.yb - 3, 1.6)) bead(lampsDet, [x, y, top(y) + 0.15], 0.17)
      for (const y of stations(s.ya + 3, s.yb - 3, 7.2)) bead(lampsLow, [x, y, top(y) + 0.3], 0.45, true)
    }
  }

  // ---- Portals ------------------------------------------------------------------------------
  portal(cream, blueLow, null, P_S); portal(cream, blueLow, null, P_N)
  portal(creamDet, blueDet, lampsDet, P_S); portal(creamDet, blueDet, lampsDet, P_N)

  // ---- Deck: sidewalks, fascias, soffit -------------------------------------------------
  const ysFor = (step: number) => [...new Set([...stations(END_S, END_N, step), ...ROAD.map(([y]) => y).filter((y) => y > END_S && y < END_N)])].sort((a, b) => a - b)
  const ys = ysFor(6), ysLow = ysFor(10)
  for (const [inX, outX] of [[-8.1, WALK_W], [8.1, WALK_E]]) {
    const x0 = Math.min(inX, outX), x1 = Math.max(inX, outX)
    // Walking surface and outer girder face (rust), from the sidewalk down to the girder bottom.
    for (const [p, yy] of [[rust, ysLow], [rustDet, ys]] as [Part, number[]][]) band(p, x0, x1, yy, (y) => road(y) + 0.25, (y) => road(y) - DECK_DOWN, { top: true, out: true, ends: true })
    // Detail: the outer railing (top rail and posts) and the inner curb rail.
    const s = Math.sign(outX)
    band(rustDet, outX - s * 0.12, outX - s * 0.02, ys, (y) => road(y) + 1.4, (y) => road(y) + 1.25)
    for (const y of stations(END_S, END_N, 2.5)) rod(rustDet, [outX - s * 0.07, y, road(y) + 0.25], [outX - s * 0.07, y, road(y) + 1.3], 0.05, 3)
  }
  // Under the roadways between the curb girders, and outside the main spans where there are no truss lines.
  for (const [p, yy] of [[rust, ysLow], [rustDet, ys]] as [Part, number[]][]) band(p, WALK_W, WALK_E, yy, (y) => road(y) - DECK_DOWN + 0.15, (y) => road(y) - DECK_DOWN, { bottom: true })
  for (const [ya, yb] of [[END_S, Y_S], [Y_N, END_N]]) {
    const yy = ys.filter((y) => y >= ya && y <= yb)
    for (const x of XT) band(rustDet, x - 0.3, x + 0.3, yy, (y) => road(y) - 0.4, (y) => road(y) - DECK_DOWN + 0.15, { out: true, in: true, top: true })
  }
  // The Station Square ramp's flare on the west side: fascia and underside only (the map draws the ramp).
  {
    const yy = stations(-241, -207, 4)
    both((p) => band(p, -25.5, WALK_W, yy, (y) => road(y) - 0.3, (y) => road(y) - DECK_DOWN, { out: true, bottom: true, ends: true }), rust, rustDet)
  }
  // Detail: floor beams under the roadways.
  for (const y of stations(END_S + 3, END_N - 3, 6.9))
    band(rustDet, WALK_W + 0.5, WALK_E - 0.5, [y - 0.2, y + 0.2], () => road(y) - DECK_DOWN, () => road(y) - DECK_DOWN - 0.6, { bottom: true, ends: true, in: true, out: true })

  // ---- Piers, bents, abutments --------------------------------------------------------
  // River piers stand on the water (flat), so their edges need no splitting; the bank piers follow the terrain.
  const pier = (yc: number, hx: number, hy: number, seg: number) => {
    const t = road(yc) - DECK_DOWN, cx = PIER_X
    footedLoft(stone, ground, [
      { plan: chamferedRect(cx - hx - 0.6, cx + hx + 0.6, yc - hy - 0.6, yc + hy + 0.6, 1.6), z: 'ground' },
      { plan: chamferedRect(cx - hx, cx + hx, yc - hy, yc + hy, 1.2), z: t - 0.9 },
      { plan: chamferedRect(cx - hx - 0.4, cx + hx + 0.4, yc - hy - 0.4, yc + hy + 0.4, 1.4), z: t - 0.9 },
      { plan: chamferedRect(cx - hx - 0.4, cx + hx + 0.4, yc - hy - 0.4, yc + hy + 0.4, 1.4), z: t },
    ], seg)
  }
  pier(Y_S - 0.5, 11.2, 5.0, 40)
  pier(Y_M, 11.0, 4.2, 40)
  pier(Y_N + 0.5, 11.2, 5.0, 40)
  pier(140, 11.0, 2.8, 5)
  pier(-158, 11.0, 2.8, 5)
  for (const yb of [-200]) {
    const t = road(yb) - DECK_DOWN
    for (const x of [-9, 0, 8]) {
      const g = Math.max(ground(x, yb), 0)
      both((p) => sides(p, x - 0.5, x + 0.5, yb - 0.5, yb + 0.5, g, t - 0.7), rust, rustDet)
    }
    both((p) => box(p, WALK_W + 0.3, WALK_E - 0.3, yb - 0.6, yb + 0.6, t - 0.7, t), rust, rustDet)
  }
  for (const [ya, dir] of [[END_S, 1], [END_N, -1]] as [number, number][]) {
    const [y0, y1] = dir > 0 ? [ya, ya + 3] : [ya - 3, ya]
    footedLoft(stone, ground, [
      { plan: chamferedRect(WALK_W, WALK_E, y0, y1, 0), z: 'ground' },
      { plan: chamferedRect(WALK_W, WALK_E, y0, y1, 0), z: road(ya) - 0.45 },
    ], 3, false)
  }

  // ---- Materials --------------------------------------------------------------------------------
  const portalLit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.4 : 1)
  const BLUE: MaterialSpec = { ...finish('truss-blue', 0x56769c), doubleSided: true }
  const CREAM: MaterialSpec = { ...finish('portal-cream', 0xe6d79c), floodlight: portalLit }
  const RUST: MaterialSpec = finish('girder-rust', 0xa86c52)
  const STONE: MaterialSpec = finish('pier-sandstone', 0x594d44)
  const LAMP: MaterialSpec = { name: 'lamp', color: 0xd9d4c6 }

  const low = [
    { part: blueLow, material: BLUE }, { part: cream, material: CREAM }, { part: rust, material: RUST },
    { part: stone, material: STONE }, { part: lampsLow, material: LAMP },
  ]
  const detail = [
    { part: blueDet, material: BLUE }, { part: creamDet, material: CREAM }, { part: rustDet, material: RUST },
    { part: stone, material: STONE }, { part: lampsDet, material: LAMP },
  ]
  const extras = {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin on the centre truss over the middle pier, on the water',
    bearing: BEARING, elevation: 0, lensEnds: [Y_S, Y_M, Y_N], portals: [P_S, P_N], ends: [END_S, END_N],
    roadway: { carson: road(END_S), southLens: road(Y_S), middlePier: road(Y_M), northLens: road(Y_N), fortPitt: road(END_N) },
    waterNAVD88: 216.3,
  }
  const count = (l: { part: Part }[]) => l.reduce((n, { part }) => n + part.triangles, 0)
  for (const [file, list, maxTris, maxBytes] of [
    ['pit-smithfield-street-bridge.glb', low, 6500, 250 * 1024],
    ['pit-smithfield-street-bridge.detail.glb', detail, 40000, 1536 * 1024],
  ] as const) {
    const tris = count([...list])
    if (tris > maxTris) throw new Error(`${file}: ${tris} triangles, over ${maxTris}`)
    const glb = writeGlb('Smithfield Street Bridge', [...list], extras)
    if (glb.length > maxBytes) throw new Error(`${file}: ${glb.length} bytes, over ${maxBytes}`)
    await Bun.write(new URL(`../models/${file}`, import.meta.url), glb)
    console.log(`${file}: ${tris} triangles, ${glb.length} bytes`)
  }
}

if (import.meta.main) await build()
