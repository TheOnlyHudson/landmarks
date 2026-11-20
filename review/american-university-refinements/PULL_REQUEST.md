Refines all 49 American University Main/East campus buildings already in the catalog and adds the General Artemas Ward Memorial in Ward Circle. Twenty-eight campus buildings gain a separate High LOD for close viewing; the other 21 receive improvements to their existing models. Existing landmark IDs, the Class of 1992 clock and the corrected interlocking AU roof logo are preserved.

The refinements add recessed glazing and sash profiles, improve documented entrances and colonnades, and refine science/sports roofs, garage openings and the smaller service-building roof slopes. SIS now references the current OSM relation and its replacement footprint is refreshed. The Ward statue includes its granite pedestal, cloak, carried tricorne and cannon details.

### Review

[Before sheets](https://github.com/saltypancakes-1/landmarks/blob/ae55e74da108fa8cb5287789c8d9d07c71ff1a7f/review/american-university-refinements/before/) · [After sheets](https://github.com/saltypancakes-1/landmarks/blob/ae55e74da108fa8cb5287789c8d9d07c71ff1a7f/review/american-university-refinements/after/) · [Close views](https://github.com/saltypancakes-1/landmarks/blob/ae55e74da108fa8cb5287789c8d9d07c71ff1a7f/review/american-university-refinements/close/) · [Sources and accuracy notes](https://github.com/saltypancakes-1/landmarks/blob/ae55e74da108fa8cb5287789c8d9d07c71ff1a7f/review/american-university-refinements/README.md)

![Refined historic and academic buildings](https://raw.githubusercontent.com/saltypancakes-1/landmarks/ae55e74da108fa8cb5287789c8d9d07c71ff1a7f/review/american-university-refinements/after/sheet-4.png)

![General Artemas Ward Memorial](https://raw.githubusercontent.com/saltypancakes-1/landmarks/ae55e74da108fa8cb5287789c8d9d07c71ff1a7f/review/american-university-refinements/ward-close.png)

### Validation

- TypeScript and catalog validation pass.
- All 74 tests pass, with no failures.
- Browser checks pass for Hurst, Federal Hall, SIS and Ward: model loading, creator/AI credits, source links, High/Low switching, available history and day/night switching.
- Static build passes in a clean 53-commit checkout: 1,379 historical versions, no unavailable snapshots. Repository-wide history outside that checkout is not part of this smoke build.
- All 50 models and 28 High LOD variants stay within their geometry/material/file budgets.
- Day/night renders reviewed; before/after sheets retained for every existing campus building.
- Terrain checks pass against local DC OCTO 2022 ground data using the project’s draping algorithm. Live Mapterhorn tiles were inaccessible, so live-terrain verification remains outstanding.

### Evidence and limits

OSM May 2026 footprints, DC OCTO 2022 lidar, published AU/DC/NPS/Smithsonian facts and reusable reference photographs support the models. AU’s interactive tour is used only to cross-check building identity and floor labels for Kerwin, McKinley, Kogod, Hall of Science and SIS. Its proprietary artwork and photos are not geometry sources.

These remain stylized map assets. Window divisions, several entrances, roof equipment and some intermediate roof levels are approximate. The four minor service structures have measured footprints/heights but unverified official names and facade treatments. The newer Meltzer/Annex buildings postdate the lidar. The Ward figure is an interpreted likeness; incised lettering is omitted. The arena retains the requested historic painted roof depiction rather than asserting the logo is still visible beneath current solar installations. No requested model has been dropped from this refinement batch.

Model creators: Salty Pancakes (`saltypancakes-1`) and OpenAI Codex (GPT-6). Per-photo author/license/URL and dimensional caveats are recorded in generator headers and the linked review notes. Review artifacts can be removed before merge.

| Landmark | Low triangles | High triangles | High size |
|---|---:|---:|---:|
| Anderson Hall | 1,958 | 19784 | 855 KiB |
| Asbury Building | 804 | 6916 | 293 KiB |
| Battelle-Tompkins Memorial Building | 959 | 5376 | 228 KiB |
| Beeghly Building | 418 | 3878 | 168 KiB |
| Bender Library | 594 | 4382 | 184 KiB |
| Butler Pavilion | 323 | 3147 | 140 KiB |
| Cassell Hall | 1,092 | — | — |
| Centennial Hall Garage | 103 | — | — |
| Centennial Hall | 1,173 | 11491 | 507 KiB |
| Clark Hall | 258 | 2198 | 98 KiB |
| Constitution Hall | 942 | — | — |
| Don Myers Technology and Innovation Building | 635 | — | — |
| Duber Hall | 509 | — | — |
| East Quad Building | 170 | 1642 | 72 KiB |
| Federal Hall | 500 | — | — |
| Former Child Development Center | 72 | 624 | 30 KiB |
| Gray Hall | 244 | 2548 | 112 KiB |
| Hall of Science | 839 | — | — |
| Hamilton Building | 146 | 1374 | 63 KiB |
| Hughes Hall | 695 | 7405 | 334 KiB |
| Hurst Hall | 537 | 3249 | 139 KiB |
| Jack Child Hall | 78 | 790 | 38 KiB |
| Outbuilding near Jacobs Field | 40 | — | — |
| Katzen Arts Center | 1,120 | — | — |
| Kay Spiritual Life Center | 2,256 | — | — |
| Kerwin Hall | 1,976 | 6590 | 253 KiB |
| Kogod School of Business | 1,825 | — | — |
| Kreeger Building | 142 | 1510 | 68 KiB |
| Leonard Hall | 842 | 8610 | 389 KiB |
| Letts Hall | 2,094 | 20680 | 893 KiB |
| Mary Graydon Student Center | 1,521 | 12213 | 521 KiB |
| McCabe Hall | 252 | 2660 | 117 KiB |
| McDowell Hall | 897 | 9325 | 412 KiB |
| McKinley Building | 3,322 | — | — |
| East Shed near the Media Production Center | 30 | — | — |
| West Outbuilding near the Media Production Center | 30 | — | — |
| Media Production Center | 251 | 2307 | 98 KiB |
| Alan and Amy Meltzer Center for Athletic Performance | 438 | — | — |
| Nebraska Hall | 1,343 | — | — |
| Osborn Building | 158 | 1722 | 76 KiB |
| President’s Office | 410 | 1830 | 84 KiB |
| Hut near Reeves Field | 30 | — | — |
| Rockwood Building | 100 | 932 | 44 KiB |
| Roper Hall | 220 | 2216 | 98 KiB |
| Sports Center Annex | 183 | — | — |
| Sports Center (Bender Arena) | 554 | — | — |
| Sports Center Parking Garage | 1,714 | — | — |
| Watkins Building | 122 | 1474 | 66 KiB |
| American University School of International Service | 1,640 | — | — |
| General Artemas Ward Memorial | 4,906 | — | — |

🤖 Generated with [OpenAI Codex](https://openai.com/codex/).
