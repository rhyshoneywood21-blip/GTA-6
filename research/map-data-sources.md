# Map and vehicle data sources — 26 Nov 2026

## App references
- GTA 6 Life (Aria Solutions): https://play.google.com/store/apps/details?id=com.ariasolutions.gta6life
  - Public map https://gta6-life.com/en/tools/interactive-map/ reports 3,476 entries across 15 categories on Nov 26, including 676 vehicle-category entries. These are markers, not unique car models.
  - Vehicle view https://gta6-life.com/en/tools/interactive-map/vehicles/
  - Public guide site https://gta6-life.com/en/guides/
  - Link/reference only unless data reuse permission is established.
- Cars for GTA6 & GTA5 (Codevsit): https://play.google.com/store/apps/details?id=com.codevsit.carcompanion.gta
  - Listing describes vehicle database, comparison, community spawn map, favorites, player photos. No public API established. Do not copy APK, private database or screenshots without permission. GTA5 data must not be mixed into GTA6.
## Candidate reusable sources
- Open GTA 6 Map https://github.com/fbritoferreira/gta6 ; https://fbritoferreira.github.io/gta6/assets.json
  - Project declares CC BY 4.0 for its data, with attribution and modification notice. JSON and tiles advertised. First candidate for evaluating an independently rendered map. Check third-party imagery rights separately and verify coordinate schema before import.
- FullSweep https://fullsweepmap.com/developers/
  - Public keyless JSON API; declared CC BY 4.0 for data. Stats, locations and landmarks endpoints. Coordinates are pixels on its 3344×4820 basemap, not game coordinates. Do not merge with other coordinate systems without validated transform. Artwork rights separate. Example stats are not verified current counts.
- Vice City API https://vice-city.app/developers
  - v1.27.0 Nov 25 documentation lists 388 vehicle entries, 256 weapons, 188 missions, 55 trophies, 35 completion requirements. Vehicle spawn GeoJSON uses game world units. Free testing key, larger usage may require paid plan; confirm terms and upstream permissions before caching or redistributing. Credit https://vice-city.app/credits. No API keys in public GitHub or bundled app.
- GTADB https://github.com/rolux/gtadb.org ; https://map.gtadb.org
  - CC BY 4.0 landmark dataset; check exact revision, tile/photo-specific rights, and official vs community reconstruction. Do not use pre-release estimates as confirmed spawns.
- GTA6Map https://github.com/gta6map/gta6map.github.io
  - Repository README declares public domain for its own landmarks and tiles; check underlying artwork separately.
## Reference-only maps
- GTABase map https://www.gtabase.com/gta-6/map/ reports 5,661 entries / 104 categories Nov 25. Vehicle spawns https://www.gtabase.com/gta-6/map/?feature=vehicle-spawn reports 162 Nov 26. Counts fluctuate; link rather than bulk copy pending license.
- Randy https://gta6gps.com/map/game/randys-wish-list
- GTAMap.io https://gtamap.io/
## Data acceptance rules
Separate vehicle model from individual spawn. Track source ID, source URL, license, dataset revision, position and CRS, map layer, verification state, story chapter, static/random/mission-only status, last checked patch. Keep conflicting records as alternatives. Never fabricate coordinates or guarantee random spawns. External providers may share upstream datasets and are not independent corroboration. No paid keys or private app data accessed. API docs were visible through indexed extracts; full opens failed for two providers. No live API payload or license audit completed.
