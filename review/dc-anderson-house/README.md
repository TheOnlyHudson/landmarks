# Anderson House — draft for visual review

Original procedural model of the Society of the Cincinnati's headquarters at 2118 Massachusetts Avenue NW, Washington, DC. Creator: Salty Pancakes (`saltypancakes-1`); procedural modeling: OpenAI Codex (GPT-6).

![Three-quarter view](quarter-render.png)

[Front](front-render.png) · [Rear](rear-render.png) · [Night](night-render.png) · [Ground review](sheet-1.png)

## Evidence

- [OpenStreetMap way 66646611](https://www.openstreetmap.org/way/66646611), OSM contributors, ODbL. Footprint from the May 22, 2026 DC extract [archived here](https://github.com/kameronlee/heat-aware-pedestrian-routing/blob/456fd09d67aae857907e8c2b7fa6c19332734bd5/data/raw/osm/district-of-columbia-latest.osm.pbf).
- [NPS National Historic Landmark nomination](https://npgallery.nps.gov/NRHP/GetAsset/548abe2d-6b5f-498c-bf0f-eb61942fac68), architectural description on pages 4–5. Supports the U-shaped composition, curved portico, gateway arches, rear terrace and window types.
- [DC OCTO 2022 lidar, NOAA Digital Coast 9837](https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html). Local DSM/DEM measurements relative to footprint p10 ground: main roof median 19.98 m; wing medians 19.07 and 19.16 m; portico median 12.59 m; rear terrace median 6.69 m. Local frame bearing 25.4°, anchor −77.04771675, 38.91071298.

## Required photographic review remains open

The workspace could read the reference descriptions, but direct image downloads from Wikimedia and the Library of Congress were blocked. The web connector returned image placeholders rather than inspectable image content. **No render-to-photograph match is claimed. This is a draft, not a visually verified final model.**

Identified reusable reference images:

- [Exterior photograph](https://commons.wikimedia.org/wiki/File:Larz_Anderson_House_-_Washington,_D.C..jpg), AgnosticPreachersKid, CC BY-SA 3.0, 2008.
- [HABS northeast-front photograph](https://www.loc.gov/pictures/item/dc0009.photos.027161p/), National Park Service, public domain.

The model uses footprint, measured roof levels and published descriptions. Cornice heights, gateway dimensions, window spacing, capitals, roof simplification and chimney placement remain estimates. Color is a restrained limestone/slate interpretation. Fine sculpture, exact masonry jointing, dormers and interiors are omitted. Night glazing is a display convention, not a verified lighting survey. The garden surface is left to the map.

## Technical checks

- 3,295 triangles, 145,948 bytes, five materials, no textures.
- Stored replacement footprint refreshed for way 66646611.
- OSM overlap check passes against the archived neighborhood extract.
- Terrain check passes against local DC OCTO 2022 bare-earth data using the project's draping algorithm. This does not verify live Mapterhorn terrain.
- Front, rear and day/night render geometry inspected. Photo comparison remains outstanding as described above.
