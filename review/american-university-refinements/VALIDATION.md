# Verification

- `bun run typecheck`: passed.
- `bun run validate`: passed; release `landmarks-75836c4a46e6429e44b7`, 1,330 catalog landmarks and 1,410 model files on the tested base.
- `bun test`: 74 passed, 0 failed (13 files).
- `bun run build`: passed in a clean 53-commit shallow checkout of the submitted branch. It includes the preceding campus models and every refinement commit. The release digest matches validation. History contains 1,379 versions from 52 relevant commits, with no unavailable snapshots in that checkout. The longer full-repository history build was stopped after this complete branch build succeeded.
- Chromium checks passed for Hurst Hall, Federal Hall, SIS and Ward: actual model loading, creator/AI credits, source links, the High/Low control and default, the available history control, and day/night model loading.
- All 50 reviewed models and 28 High LOD variants pass geometry/file budgets; see model-stats.md.
- Ground checks use DC OCTO 2022 local bare-earth data and the project's draping algorithm. The 28 shared campus models, 21 separately refined buildings and Ward pass. Live Mapterhorn terrain was inaccessible and remains unverified.
- Current OSM excerpt checks pass for the newly changed entrance extents at Hurst, Battelle-Tompkins, Mary Graydon and Kerwin, and the Ward site; the other independently refined models were checked during their review.
- The branch merges without conflicts with upstream `b2b81a94` at submission time.

The before/after contact sheets show the draped model bounds; their height labels include placement effects and are not surveyed architectural-height measurements. Model dimensions and uncertainty are recorded in generator headers. No Google Earth/Street View images or AU tour illustrations were used as geometry evidence for this refinement pass.
