# American University refinements and Ward Circle

This review compares the 49 existing campus buildings with their refined versions. The 28 buildings using the shared campus generator now also ship a separate High LOD for close viewing (zoom 17). The other 21 receive improvements in their existing model. The existing Bender Library clock and corrected interlocking AU roof monogram are preserved.

Before sheets use the models at upstream `3cf86601`. After sheets use High LOD where available and the refined normal model otherwise. Day/night pairs use the same geometry. Terrain in these sheets comes from **DC OCTO 2022 bare-earth lidar**, processed through the project's draping routine; the live Mapterhorn tile endpoint was inaccessible. These are not checks against live map tiles.

Close views: [historic and academic buildings](close/), [Ward statue](ward-close.png). [Model budgets](model-stats.md) · [Verification](VALIDATION.md) · [Prepared PR description](PULL_REQUEST.md).

## Main changes

- Recessed glazing, wall reveals and restrained sash profiles at close range; historic multi-light windows and shutters where documented.
- Hurst, Battelle-Tompkins and Mary Graydon entrance steps; the President's Office chimneys; Kerwin's paired seven-column entrance colonnades.
- East Campus and northern residences: facade rhythm, entrance glazing, parapets and service roofs.
- Kay's entrance and crown, McKinley's entrance/dome, Kogod's additions and roof screen, and SIS's courtyard/clerestory/solar roof features.
- Sports and science buildings: roof equipment, sunshades, solar arrays, garage openings and measured service-building roof slopes. The historic painted AU logo remains a historical roof depiction; current solar installation information does not establish the painted logo's current visibility.
- New General Artemas Ward Memorial in Ward Circle, based on public records and open evidence.

## Accuracy limits

These are stylized map models, not photogrammetric reconstructions. Heights and footprints use the May 2026 OSM extract and DC OCTO 2022 lidar where applicable. Small window divisions, reveals, roof equipment, several entrances and colors remain approximate. Some generic upper roof outlines retain simplified lidar-derived contours. Rear elevations with no reusable photographic evidence remain plain or retain estimated bay spacing; added detail does not imply a survey of each window.

The smallest service buildings have verified footprints/heights but unverified official names and facade treatments. The newer Meltzer Center/Sports Center Annex postdate the lidar; published information supports their form and intermediate levels are estimated. The Ward figure is a simplified sculptural likeness, with no claim of facial fidelity. Exact live Mapterhorn terrain remains unverified.

## Sources and credits

Model creators: **Salty Pancakes** (`saltypancakes-1`) and **OpenAI Codex** (GPT-6). Each generator records its evidence and dimensional caveats. The following table collects the public model reference records; factual publications are cited for their facts, not as reusable photographs. No Google Earth or Street View imagery is included.

### Anderson Hall

- [Building footprint, OpenStreetMap (May 22, 2026 extract)](https://www.openstreetmap.org/way/38076903) — OpenStreetMap contributors
- [Anderson, Centennial and Letts building plan](https://www.american.edu/emergency/upload/au-anderson-centennial-letts-emergency-plan-4-27-22.pdf) — American University
- [Tenleytown aerial photograph (2019, CC BY-SA 4.0)](https://commons.wikimedia.org/wiki/File:Tenleytown_aerial_2019.jpg) — Antony-22
- [2022 District of Columbia LiDAR, NOAA Digital Coast dataset 9837](https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html) — District of Columbia Office of the Chief Technology Officer

### Asbury Building

- [Building footprint, OpenStreetMap (May 22, 2026 extract)](https://www.openstreetmap.org/way/90190611) — OpenStreetMap contributors
- [Campus facilities presentation, June 24, 2025](https://www.american.edu/communityrelations/clc/upload/2025-06-24-clc-presentation.pdf) — American University
- [American University aerial photograph (2006, public domain)](https://commons.wikimedia.org/wiki/File:AUaerial.jpg) — A2Kafir
- [2022 District of Columbia LiDAR, NOAA Digital Coast dataset 9837](https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html) — District of Columbia Office of the Chief Technology Officer

### Battelle-Tompkins Memorial Building

- [Building footprint, OpenStreetMap (May 22, 2026 extract)](https://www.openstreetmap.org/way/38078786) — OpenStreetMap contributors
- [American University Historic District nomination](https://planning.dc.gov/publication/26-07-american-university-historic-district) — District of Columbia Office of Planning
- [American University aerial photograph (2006, public domain)](https://commons.wikimedia.org/wiki/File:AUaerial.jpg) — A2Kafir
- [2022 District of Columbia LiDAR, NOAA Digital Coast dataset 9837](https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html) — District of Columbia Office of the Chief Technology Officer

### Beeghly Building

- [Building footprint, OpenStreetMap (May 22, 2026 extract)](https://www.openstreetmap.org/way/90190991) — OpenStreetMap contributors
- [Campus facilities presentation, June 24, 2025](https://www.american.edu/communityrelations/clc/upload/2025-06-24-clc-presentation.pdf) — American University
- [Tenleytown aerial photograph (2019, CC BY-SA 4.0)](https://commons.wikimedia.org/wiki/File:Tenleytown_aerial_2019.jpg) — Antony-22
- [2022 District of Columbia LiDAR, NOAA Digital Coast dataset 9837](https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html) — District of Columbia Office of the Chief Technology Officer

### Bender Library

- [Building footprint, OpenStreetMap (May 22, 2026 extract)](https://www.openstreetmap.org/way/90190152) — OpenStreetMap contributors
- [American University Historic District nomination](https://planning.dc.gov/publication/26-07-american-university-historic-district) — District of Columbia Office of Planning
- [Bender Library (2006, public domain)](https://commons.wikimedia.org/wiki/File:LibraryRevamp.jpg) — Senordesupremo
- [2022 District of Columbia LiDAR, NOAA Digital Coast dataset 9837](https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html) — District of Columbia Office of the Chief Technology Officer

### Butler Pavilion

- [Building footprint, OpenStreetMap (May 22, 2026 extract)](https://www.openstreetmap.org/way/38075681) — OpenStreetMap contributors
- [Tenleytown aerial photograph (2019, CC BY-SA 4.0)](https://commons.wikimedia.org/wiki/File:Tenleytown_aerial_2019.jpg) — Antony-22
- [Campus map](https://www.american.edu/about/upload/campus-map.pdf) — American University
- [2022 District of Columbia LiDAR, NOAA Digital Coast dataset 9837](https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html) — District of Columbia Office of the Chief Technology Officer

### Cassell Hall

- [2022 Washington, DC aerial lidar](https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html) — District of Columbia Office of the Chief Technology Officer
- [Building footprint](https://www.openstreetmap.org/way/338514813) — OpenStreetMap contributors; ODbL-1.0
- [Zoning Commission Order 11-07A, finding 19](https://www.american.edu/finance/ppm/upload/zoning-order-11-07a.pdf) — District of Columbia Zoning Commission
- [Cassell Hall LEED case study](https://www.american.edu/about/sustainability/upload/cassell-leed-case-study.pdf) — American University
- [North Hall architectural systems](https://www.engr.psu.edu/ae/thesis/portfolios/2013/bmt5078/building-stats.htm) — Penn State Architectural Engineering

### Centennial Hall Garage

- [Building outline (May 2026)](https://www.openstreetmap.org/way/929483468) — OpenStreetMap contributors
- [2022 DC lidar, archived processing source](https://github.com/kameronlee/heat-aware-pedestrian-routing/blob/456fd09d67aae857907e8c2b7fa6c19332734bd5/data/metadata/lidar_sources.md) — District of Columbia Office of the Chief Technology Officer
- [Anderson, Centennial and Letts building plan](https://www.american.edu/emergency/upload/au-anderson-centennial-letts-emergency-plan-4-27-22.pdf) — American University

### Centennial Hall

- [Building footprint, OpenStreetMap (May 22, 2026 extract)](https://www.openstreetmap.org/way/38076901) — OpenStreetMap contributors
- [Anderson, Centennial and Letts building plan](https://www.american.edu/emergency/upload/au-anderson-centennial-letts-emergency-plan-4-27-22.pdf) — American University
- [Tenleytown aerial photograph (2019, CC BY-SA 4.0)](https://commons.wikimedia.org/wiki/File:Tenleytown_aerial_2019.jpg) — Antony-22
- [2022 District of Columbia LiDAR, NOAA Digital Coast dataset 9837](https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html) — District of Columbia Office of the Chief Technology Officer

### Clark Hall

- [Building footprint, OpenStreetMap (May 22, 2026 extract)](https://www.openstreetmap.org/way/90190590) — OpenStreetMap contributors
- [Campus plan pre-hearing submission, March 2021](https://www.american.edu/communityrelations/campus-plan/upload/pre-hearing-submission-filed-with-dc-zoning-commission-march-1-2021.pdf) — American University
- [Tenleytown aerial photograph (2019, CC BY-SA 4.0)](https://commons.wikimedia.org/wiki/File:Tenleytown_aerial_2019.jpg) — Antony-22
- [2022 District of Columbia LiDAR, NOAA Digital Coast dataset 9837](https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html) — District of Columbia Office of the Chief Technology Officer

### Constitution Hall

- [Mapped building footprint](https://www.openstreetmap.org/way/517997411) — OpenStreetMap contributors; ODbL-1.0
- [2022 Washington, DC aerial lidar](https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html) — District of Columbia Office of the Chief Technology Officer
- [East Campus](https://www.american.edu/about/sustainability/buildings/east-campus.cfm) — American University
- [Zoning Commission Order 11-07, findings 133–139](https://www.american.edu/communityrelations/campus-plan/upload/american-university-2021-campus-plan-ctr-appendices-sept-15-2020.pdf) — District of Columbia Zoning Commission
- [American University, East Campus Development](https://ehlert-bryan.com/project/american-university-east-campus/) — Ehlert Bryan
- [AU visitor directions through Constitution Hall](https://www.american.edu/cas/iwsm2026/directions.cfm) — American University

### Don Myers Technology and Innovation Building

- [Mapped building footprint](https://www.openstreetmap.org/way/535124892) — OpenStreetMap contributors; ODbL-1.0
- [2022 Washington, DC aerial lidar](https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html) — District of Columbia Office of the Chief Technology Officer
- [East Campus](https://www.american.edu/about/sustainability/buildings/east-campus.cfm) — American University
- [Zoning Commission Order 11-07, findings 133–139](https://www.american.edu/communityrelations/campus-plan/upload/american-university-2021-campus-plan-ctr-appendices-sept-15-2020.pdf) — District of Columbia Zoning Commission
- [American University, East Campus Development](https://ehlert-bryan.com/project/american-university-east-campus/) — Ehlert Bryan

### Duber Hall

- [Mapped building footprint](https://www.openstreetmap.org/way/535124891) — OpenStreetMap contributors; ODbL-1.0
- [2022 Washington, DC aerial lidar](https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html) — District of Columbia Office of the Chief Technology Officer
- [East Campus](https://www.american.edu/about/sustainability/buildings/east-campus.cfm) — American University
- [Zoning Commission Order 11-07, findings 133–139](https://www.american.edu/communityrelations/campus-plan/upload/american-university-2021-campus-plan-ctr-appendices-sept-15-2020.pdf) — District of Columbia Zoning Commission
- [American University, East Campus Development](https://ehlert-bryan.com/project/american-university-east-campus/) — Ehlert Bryan
- [East Campus Residence Hall (Congressional Hall)](https://commons.wikimedia.org/wiki/File:East_Campus_Residence_Hall.jpg) — Herrperry123; CC-BY-SA-4.0

### East Quad Building

- [Building footprint, OpenStreetMap (May 22, 2026 extract)](https://www.openstreetmap.org/way/90189728) — OpenStreetMap contributors
- [American University Historic District nomination](https://planning.dc.gov/publication/26-07-american-university-historic-district) — District of Columbia Office of Planning
- [American University aerial photograph (2006, public domain)](https://commons.wikimedia.org/wiki/File:AUaerial.jpg) — A2Kafir
- [2022 District of Columbia LiDAR, NOAA Digital Coast dataset 9837](https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html) — District of Columbia Office of the Chief Technology Officer

### Federal Hall

- [Mapped building footprint](https://www.openstreetmap.org/way/535124056) — OpenStreetMap contributors; ODbL-1.0
- [2022 Washington, DC aerial lidar](https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html) — District of Columbia Office of the Chief Technology Officer
- [East Campus](https://www.american.edu/about/sustainability/buildings/east-campus.cfm) — American University
- [Zoning Commission Order 11-07, findings 133–139](https://www.american.edu/communityrelations/campus-plan/upload/american-university-2021-campus-plan-ctr-appendices-sept-15-2020.pdf) — District of Columbia Zoning Commission
- [American University, East Campus Development](https://ehlert-bryan.com/project/american-university-east-campus/) — Ehlert Bryan

### Former Child Development Center

- [Building footprint, OpenStreetMap (May 22, 2026 extract)](https://www.openstreetmap.org/way/90190440) — OpenStreetMap contributors
- [Tenleytown aerial photograph (2019, CC BY-SA 4.0)](https://commons.wikimedia.org/wiki/File:Tenleytown_aerial_2019.jpg) — Antony-22
- [Campus plan pre-hearing submission, March 2021](https://www.american.edu/communityrelations/campus-plan/upload/pre-hearing-submission-filed-with-dc-zoning-commission-march-1-2021.pdf) — American University
- [2022 District of Columbia LiDAR, NOAA Digital Coast dataset 9837](https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html) — District of Columbia Office of the Chief Technology Officer

### Gray Hall

- [Building footprint, OpenStreetMap (May 22, 2026 extract)](https://www.openstreetmap.org/way/90190204) — OpenStreetMap contributors
- [Campus plan pre-hearing submission, March 2021](https://www.american.edu/communityrelations/campus-plan/upload/pre-hearing-submission-filed-with-dc-zoning-commission-march-1-2021.pdf) — American University
- [Tenleytown aerial photograph (2019, CC BY-SA 4.0)](https://commons.wikimedia.org/wiki/File:Tenleytown_aerial_2019.jpg) — Antony-22
- [2022 District of Columbia LiDAR, NOAA Digital Coast dataset 9837](https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html) — District of Columbia Office of the Chief Technology Officer

### Hall of Science

- [Building outline (May 2026)](https://www.openstreetmap.org/way/951907144) — OpenStreetMap contributors
- [Hall of Science and the garden-facing curtain wall](https://www.american.edu/news/hall-of-science-leed-glass-building.cfm) — American University
- [Building form and solar shades](https://ccnet.ballinger.com/design/hallofscience/) — Ballinger
- [2022 DC lidar, archived processing source](https://github.com/kameronlee/heat-aware-pedestrian-routing/blob/456fd09d67aae857907e8c2b7fa6c19332734bd5/data/metadata/lidar_sources.md) — District of Columbia Office of the Chief Technology Officer
- [AU interactive campus tour: building identity and floor labels (factual reference)](https://map-american.university-tour.com/hall-of-science-dollhouse) — American University

### Hamilton Building

- [Building footprint, OpenStreetMap (May 22, 2026 extract)](https://www.openstreetmap.org/way/90190208) — OpenStreetMap contributors
- [Campus map](https://www.american.edu/about/upload/campus-map.pdf) — American University
- [American University aerial photograph (2006, public domain)](https://commons.wikimedia.org/wiki/File:AUaerial.jpg) — A2Kafir
- [2022 District of Columbia LiDAR, NOAA Digital Coast dataset 9837](https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html) — District of Columbia Office of the Chief Technology Officer

### Hughes Hall

- [Building footprint, OpenStreetMap (May 22, 2026 extract)](https://www.openstreetmap.org/way/38094597) — OpenStreetMap contributors
- [American University Historic District nomination](https://planning.dc.gov/publication/26-07-american-university-historic-district) — District of Columbia Office of Planning
- [Tenleytown aerial photograph (2019, CC BY-SA 4.0)](https://commons.wikimedia.org/wiki/File:Tenleytown_aerial_2019.jpg) — Antony-22
- [2022 District of Columbia LiDAR, NOAA Digital Coast dataset 9837](https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html) — District of Columbia Office of the Chief Technology Officer

### Hurst Hall

- [Building footprint, OpenStreetMap (May 22, 2026 extract)](https://www.openstreetmap.org/way/90190366) — OpenStreetMap contributors
- [American University Historic District nomination](https://planning.dc.gov/publication/26-07-american-university-historic-district) — District of Columbia Office of Planning
- [American University](https://sah-archipedia.org/buildings/DC-01-NW37) — Society of Architectural Historians
- [American University aerial photograph (2006, public domain)](https://commons.wikimedia.org/wiki/File:AUaerial.jpg) — A2Kafir
- [2022 District of Columbia LiDAR, NOAA Digital Coast dataset 9837](https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html) — District of Columbia Office of the Chief Technology Officer

### Jack Child Hall

- [Building footprint, OpenStreetMap (May 22, 2026 extract)](https://www.openstreetmap.org/way/38110443) — OpenStreetMap contributors
- [Campus map](https://www.american.edu/about/upload/campus-map.pdf) — American University
- [American University aerial photograph (2006, public domain)](https://commons.wikimedia.org/wiki/File:AUaerial.jpg) — A2Kafir
- [2022 District of Columbia LiDAR, NOAA Digital Coast dataset 9837](https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html) — District of Columbia Office of the Chief Technology Officer

### Outbuilding near Jacobs Field

- [Building outline (May 2026)](https://www.openstreetmap.org/way/90190857) — OpenStreetMap contributors
- [2022 DC lidar, archived processing source](https://github.com/kameronlee/heat-aware-pedestrian-routing/blob/456fd09d67aae857907e8c2b7fa6c19332734bd5/data/metadata/lidar_sources.md) — District of Columbia Office of the Chief Technology Officer

### Katzen Arts Center

- [2022 Washington, DC aerial lidar](https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html) — District of Columbia Office of the Chief Technology Officer
- [Building footprint](https://www.openstreetmap.org/way/66878371) — OpenStreetMap contributors; ODbL-1.0
- [Katzen Arts Center](https://www.american.edu/cas/katzen/index.cfm) — American University
- [Katzen Art Center stonework](https://www.rugostone.com/projects/katzen-art-center-american-university/) — Rugo Stone
- [Katzen Art Museum from Ward Circle](https://commons.wikimedia.org/wiki/File:Katzen_Art_Museum_from_Ward_Circle.jpg) — Ser Amantio di Nicolao; CC-BY-SA-3.0
- [Rotunda and garage entrance from Massachusetts Avenue](https://commons.wikimedia.org/wiki/File:Rotunda_and_garage_entrance_of_Katzen_Art_Museum_from_Massachusetts_Avenue.jpg) — Ser Amantio di Nicolao; CC-BY-SA-3.0
- [Outer view of the rotunda](https://commons.wikimedia.org/wiki/File:Outer_view_of_rotunda,_Katzen_Art_Museum.jpg) — Ser Amantio di Nicolao; CC-BY-SA-3.0

### Kay Spiritual Life Center

- [Eric Freidheim Quadrangle.jpg](https://commons.wikimedia.org/wiki/File:Eric_Freidheim_Quadrangle.jpg) — Herrperry123; CC-BY-SA-4.0
- [History of the Kay Spiritual Life Center](https://www.american.edu/student-affairs/kay/kay-history.cfm) — American University
- [2022 DC OCTO lidar, building DSM and bare-earth DEM](https://github.com/kameronlee/heat-aware-pedestrian-routing/tree/456fd09d67aae857907e8c2b7fa6c19332734bd5) — District of Columbia Office of the Chief Technology Officer

### Kerwin Hall

- [Building footprint, OpenStreetMap (May 22, 2026 extract)](https://www.openstreetmap.org/way/90189816) — OpenStreetMap contributors
- [American University Historic District nomination](https://planning.dc.gov/publication/26-07-american-university-historic-district) — District of Columbia Office of Planning
- [American University aerial photograph (2006, public domain)](https://commons.wikimedia.org/wiki/File:AUaerial.jpg) — A2Kafir
- [2022 District of Columbia LiDAR, NOAA Digital Coast dataset 9837](https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html) — District of Columbia Office of the Chief Technology Officer
- [AU interactive campus tour: building identity and floor labels (factual reference)](https://map-american.university-tour.com/kerwin-dollhouse) — American University

### Kogod School of Business

- [Kogod School of Business at American University.jpg](https://commons.wikimedia.org/wiki/File:Kogod_School_of_Business_at_American_University.jpg) — Ser Amantio di Nicolao; CC-BY-SA-3.0
- [Kogod.JPG](https://commons.wikimedia.org/wiki/File:Kogod.JPG) — Senordesupremo; Public domain
- [Eric Freidheim Quadrangle.jpg](https://commons.wikimedia.org/wiki/File:Eric_Freidheim_Quadrangle.jpg) — Herrperry123; CC-BY-SA-4.0
- [Kogod School of Business, campus history walk](https://www.american.edu/events/inauguration/history-walk/11.cfm) — American University
- [2022 DC OCTO lidar, building DSM and bare-earth DEM](https://github.com/kameronlee/heat-aware-pedestrian-routing/tree/456fd09d67aae857907e8c2b7fa6c19332734bd5) — District of Columbia Office of the Chief Technology Officer
- [AU interactive campus tour: building identity and floor labels (factual reference)](https://map-american.university-tour.com/kogod-dollhouse) — American University

### Kreeger Building

- [Building footprint, OpenStreetMap (May 22, 2026 extract)](https://www.openstreetmap.org/way/90189977) — OpenStreetMap contributors
- [Campus map](https://www.american.edu/about/upload/campus-map.pdf) — American University
- [American University aerial photograph (2006, public domain)](https://commons.wikimedia.org/wiki/File:AUaerial.jpg) — A2Kafir
- [2022 District of Columbia LiDAR, NOAA Digital Coast dataset 9837](https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html) — District of Columbia Office of the Chief Technology Officer

### Leonard Hall

- [Building footprint, OpenStreetMap (May 22, 2026 extract)](https://www.openstreetmap.org/way/38094599) — OpenStreetMap contributors
- [American University Historic District nomination](https://planning.dc.gov/publication/26-07-american-university-historic-district) — District of Columbia Office of Planning
- [Tenleytown aerial photograph (2019, CC BY-SA 4.0)](https://commons.wikimedia.org/wiki/File:Tenleytown_aerial_2019.jpg) — Antony-22
- [2022 District of Columbia LiDAR, NOAA Digital Coast dataset 9837](https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html) — District of Columbia Office of the Chief Technology Officer

### Letts Hall

- [Building footprint, OpenStreetMap (May 22, 2026 extract)](https://www.openstreetmap.org/way/38076904) — OpenStreetMap contributors
- [Anderson, Centennial and Letts building plan](https://www.american.edu/emergency/upload/au-anderson-centennial-letts-emergency-plan-4-27-22.pdf) — American University
- [Tenleytown aerial photograph (2019, CC BY-SA 4.0)](https://commons.wikimedia.org/wiki/File:Tenleytown_aerial_2019.jpg) — Antony-22
- [2022 District of Columbia LiDAR, NOAA Digital Coast dataset 9837](https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html) — District of Columbia Office of the Chief Technology Officer

### Mary Graydon Student Center

- [Building footprint, OpenStreetMap (May 22, 2026 extract)](https://www.openstreetmap.org/way/38075678) — OpenStreetMap contributors
- [American University Historic District nomination](https://planning.dc.gov/publication/26-07-american-university-historic-district) — District of Columbia Office of Planning
- [Tenleytown aerial photograph (2019, CC BY-SA 4.0)](https://commons.wikimedia.org/wiki/File:Tenleytown_aerial_2019.jpg) — Antony-22
- [2022 District of Columbia LiDAR, NOAA Digital Coast dataset 9837](https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html) — District of Columbia Office of the Chief Technology Officer

### McCabe Hall

- [Building footprint, OpenStreetMap (May 22, 2026 extract)](https://www.openstreetmap.org/way/90190518) — OpenStreetMap contributors
- [Campus plan pre-hearing submission, March 2021](https://www.american.edu/communityrelations/campus-plan/upload/pre-hearing-submission-filed-with-dc-zoning-commission-march-1-2021.pdf) — American University
- [Tenleytown aerial photograph (2019, CC BY-SA 4.0)](https://commons.wikimedia.org/wiki/File:Tenleytown_aerial_2019.jpg) — Antony-22
- [2022 District of Columbia LiDAR, NOAA Digital Coast dataset 9837](https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html) — District of Columbia Office of the Chief Technology Officer

### McDowell Hall

- [Building footprint, OpenStreetMap (May 22, 2026 extract)](https://www.openstreetmap.org/way/38094598) — OpenStreetMap contributors
- [American University Historic District nomination](https://planning.dc.gov/publication/26-07-american-university-historic-district) — District of Columbia Office of Planning
- [Tenleytown aerial photograph (2019, CC BY-SA 4.0)](https://commons.wikimedia.org/wiki/File:Tenleytown_aerial_2019.jpg) — Antony-22
- [2022 District of Columbia LiDAR, NOAA Digital Coast dataset 9837](https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html) — District of Columbia Office of the Chief Technology Officer

### McKinley Building

- [McKinley Building today.jpg](https://commons.wikimedia.org/wiki/File:McKinley_Building_today.jpg) — Herrperry123; CC-BY-SA-4.0
- [AU McKineyHall ACC.jpeg](https://commons.wikimedia.org/wiki/File:AU_McKineyHall_ACC.jpeg) — Dual64bit; CC-BY-SA-3.0
- [McKinley Building and School of Communication facilities](https://www.american.edu/soc/resources/facilities.cfm) — American University
- [2022 DC OCTO lidar, building DSM and bare-earth DEM](https://github.com/kameronlee/heat-aware-pedestrian-routing/tree/456fd09d67aae857907e8c2b7fa6c19332734bd5) — District of Columbia Office of the Chief Technology Officer
- [AU interactive campus tour: building identity and floor labels (factual reference)](https://map-american.university-tour.com/mckinley-dollhouse) — American University

### East Shed near the Media Production Center

- [Building outline (May 2026)](https://www.openstreetmap.org/way/90190634) — OpenStreetMap contributors
- [2022 DC lidar, archived processing source](https://github.com/kameronlee/heat-aware-pedestrian-routing/blob/456fd09d67aae857907e8c2b7fa6c19332734bd5/data/metadata/lidar_sources.md) — District of Columbia Office of the Chief Technology Officer

### West Outbuilding near the Media Production Center

- [Building outline (May 2026)](https://www.openstreetmap.org/way/90190349) — OpenStreetMap contributors
- [2022 DC lidar, archived processing source](https://github.com/kameronlee/heat-aware-pedestrian-routing/blob/456fd09d67aae857907e8c2b7fa6c19332734bd5/data/metadata/lidar_sources.md) — District of Columbia Office of the Chief Technology Officer

### Media Production Center

- [Building footprint, OpenStreetMap (May 22, 2026 extract)](https://www.openstreetmap.org/way/38110446) — OpenStreetMap contributors
- [Campus map](https://www.american.edu/about/upload/campus-map.pdf) — American University
- [Tenleytown aerial photograph (2019, CC BY-SA 4.0)](https://commons.wikimedia.org/wiki/File:Tenleytown_aerial_2019.jpg) — Antony-22
- [2022 District of Columbia LiDAR, NOAA Digital Coast dataset 9837](https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html) — District of Columbia Office of the Chief Technology Officer

### Alan and Amy Meltzer Center for Athletic Performance

- [Building outline (May 2026)](https://www.openstreetmap.org/way/1509229469) — OpenStreetMap contributors
- [Building, photovoltaic array and green roof](https://www.american.edu/about/sustainability/buildings/meltzer-athletic-center.cfm) — American University
- [Published design heights and floor counts](https://www.american.edu/communityrelations/campus-plan/meltzer-center-feedback-and-reponses.cfm) — American University

### Nebraska Hall

- [2022 Washington, DC aerial lidar](https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html) — District of Columbia Office of the Chief Technology Officer
- [Building footprint](https://www.openstreetmap.org/way/38606608) — OpenStreetMap contributors; ODbL-1.0
- [Nebraska Residence Hall at American University](https://grunley.com/portfolio-project/american-university-nebraska-residence-hall/) — Grunley Construction Company
- [2011 Campus Plan](https://www.american.edu/finance/ppm/upload/campus-plan-document-for-web.pdf) — American University
- [Rear view of Nebraska Hall](https://commons.wikimedia.org/wiki/File:Rear_view_of_Nebraska_Hall_on_the_campus_of_American_University.jpg) — Ser Amantio di Nicolao; CC-BY-SA-3.0

### Osborn Building

- [Building footprint, OpenStreetMap (May 22, 2026 extract)](https://www.openstreetmap.org/way/90190449) — OpenStreetMap contributors
- [Campus map](https://www.american.edu/about/upload/campus-map.pdf) — American University
- [Tenleytown aerial photograph (2019, CC BY-SA 4.0)](https://commons.wikimedia.org/wiki/File:Tenleytown_aerial_2019.jpg) — Antony-22
- [2022 District of Columbia LiDAR, NOAA Digital Coast dataset 9837](https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html) — District of Columbia Office of the Chief Technology Officer

### President’s Office

- [Building footprint, OpenStreetMap (May 22, 2026 extract)](https://www.openstreetmap.org/way/38110182) — OpenStreetMap contributors
- [American University Historic District nomination](https://planning.dc.gov/publication/26-07-american-university-historic-district) — District of Columbia Office of Planning
- [American University aerial photograph (2006, public domain)](https://commons.wikimedia.org/wiki/File:AUaerial.jpg) — A2Kafir
- [2022 District of Columbia LiDAR, NOAA Digital Coast dataset 9837](https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html) — District of Columbia Office of the Chief Technology Officer

### Hut near Reeves Field

- [Building outline (May 2026)](https://www.openstreetmap.org/way/90190486) — OpenStreetMap contributors
- [2022 DC lidar, archived processing source](https://github.com/kameronlee/heat-aware-pedestrian-routing/blob/456fd09d67aae857907e8c2b7fa6c19332734bd5/data/metadata/lidar_sources.md) — District of Columbia Office of the Chief Technology Officer

### Rockwood Building

- [Building footprint, OpenStreetMap (May 22, 2026 extract)](https://www.openstreetmap.org/way/90190174) — OpenStreetMap contributors
- [Tenleytown aerial photograph (2019, CC BY-SA 4.0)](https://commons.wikimedia.org/wiki/File:Tenleytown_aerial_2019.jpg) — Antony-22
- [Campus plan pre-hearing submission, March 2021](https://www.american.edu/communityrelations/campus-plan/upload/pre-hearing-submission-filed-with-dc-zoning-commission-march-1-2021.pdf) — American University
- [2022 District of Columbia LiDAR, NOAA Digital Coast dataset 9837](https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html) — District of Columbia Office of the Chief Technology Officer

### Roper Hall

- [Building footprint, OpenStreetMap (May 22, 2026 extract)](https://www.openstreetmap.org/way/90190604) — OpenStreetMap contributors
- [Campus plan pre-hearing submission, March 2021](https://www.american.edu/communityrelations/campus-plan/upload/pre-hearing-submission-filed-with-dc-zoning-commission-march-1-2021.pdf) — American University
- [Tenleytown aerial photograph (2019, CC BY-SA 4.0)](https://commons.wikimedia.org/wiki/File:Tenleytown_aerial_2019.jpg) — Antony-22
- [2022 District of Columbia LiDAR, NOAA Digital Coast dataset 9837](https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html) — District of Columbia Office of the Chief Technology Officer

### Sports Center Annex

- [Building outline (May 2026)](https://www.openstreetmap.org/way/1509229468) — OpenStreetMap contributors
- [Published design heights and floor counts](https://www.american.edu/communityrelations/campus-plan/meltzer-center-feedback-and-reponses.cfm) — American University
- [Completed complex](https://www.american.edu/about/sustainability/buildings/meltzer-athletic-center.cfm) — American University

### Sports Center (Bender Arena)

- [Building outline (May 2026)](https://www.openstreetmap.org/way/33899314) — OpenStreetMap contributors
- [Complex and component buildings](https://aueagles.com/sports/2019/8/15/information-facilities-bender-arena.aspx?id=18) — American University Athletics
- [Photovoltaic array across Bender and Meltzer roofs](https://www.american.edu/about/sustainability/buildings/meltzer-athletic-center.cfm) — American University
- [2022 DC lidar, archived processing source](https://github.com/kameronlee/heat-aware-pedestrian-routing/blob/456fd09d67aae857907e8c2b7fa6c19332734bd5/data/metadata/lidar_sources.md) — District of Columbia Office of the Chief Technology Officer
- [University roof mark on Bender Arena](https://virtualglobetrotting.com/map/american-university/) — Virtual Globetrotting
- [American University monogram (public-domain text logo)](https://commons.wikimedia.org/wiki/File:American_University_logo.svg) — American University

### Sports Center Parking Garage

- [Building outline (May 2026)](https://www.openstreetmap.org/way/38075679) — OpenStreetMap contributors
- [Seven parking levels and the sports complex](https://aueagles.com/sports/2019/8/15/information-facilities-bender-arena.aspx?id=18) — American University Athletics
- [2022 DC lidar, archived processing source](https://github.com/kameronlee/heat-aware-pedestrian-routing/blob/456fd09d67aae857907e8c2b7fa6c19332734bd5/data/metadata/lidar_sources.md) — District of Columbia Office of the Chief Technology Officer

### Watkins Building

- [Building footprint, OpenStreetMap (May 22, 2026 extract)](https://www.openstreetmap.org/way/90190715) — OpenStreetMap contributors
- [Campus map](https://www.american.edu/about/upload/campus-map.pdf) — American University
- [American University aerial photograph (2006, public domain)](https://commons.wikimedia.org/wiki/File:AUaerial.jpg) — A2Kafir
- [2022 District of Columbia LiDAR, NOAA Digital Coast dataset 9837](https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html) — District of Columbia Office of the Chief Technology Officer

### American University School of International Service

- [School of International Service building, aerial view](https://commons.wikimedia.org/wiki/File:American_University_School_of_International_Service_building.jpg) — Jeff Watts / American University; CC-BY-SA-3.0
- [School of International Service Building, street view](https://commons.wikimedia.org/wiki/File:School_of_International_Service_Building.jpg) — Herrperry123; CC-BY-SA-4.0
- [School of International Service building and sustainability](https://www.american.edu/about/sustainability/buildings/school-of-international-service.cfm) — American University
- [School of International Service building footprint](https://www.openstreetmap.org/relation/914201) — OpenStreetMap contributors
- [2022 DC OCTO lidar, NOAA Digital Coast dataset 9837](https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html) — District of Columbia Office of the Chief Technology Officer
- [AU interactive campus tour: building identity and floor labels (factual reference)](https://map-american.university-tour.com/school-of-international-service-dollhouse) — American University

### General Artemas Ward Memorial

- [General Artemas Ward Memorial, description and photograph](https://www.nps.gov/places/000/general-artemas-ward-memorial.htm) — National Park Service / Claire Hassler; Public domain
- [Smithsonian sculpture inventory (published dimensions)](https://www.si.edu/object/siris_ari_20337) — Smithsonian American Art Museum
- [Statue in Ward Circle, Washington, DC](https://commons.wikimedia.org/wiki/File:Statue_in_Ward_Circle,_Washington,_DC.jpg) — Aaron Siirila; CC-BY-SA-2.5
- [Mapped monument setting](https://www.openstreetmap.org/way/1059688028) — OpenStreetMap contributors; ODbL-1.0
- [2022 District of Columbia LiDAR, NOAA Digital Coast dataset 9837](https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html) — District of Columbia Office of the Chief Technology Officer

The AU interactive tour was cross-checked for building identity and floor labels for Kerwin, McKinley, Kogod, Hall of Science and SIS. Its artwork and photography were not used as geometric evidence.
