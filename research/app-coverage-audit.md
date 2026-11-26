# App coverage audit — 26 November 2026
The dashboard index.html retains the original companion's 118 checklist entries and two player profiles and bundles 16 existing research guides. It adds search/favorites for 22 Randy vehicle references, personal spawn sightings with type/chapter/time/build/map link/notes, JSON backup, map shortcuts and an experimental FullSweep feed. It is not hosted or packaged as an APK; browser and feed tests outstanding.
| Section | Useful now | Remaining work |
|---|---|---|
| Map | Existing external maps with layer toggles; experimental source-tagged feed | Matching licensed basemap, actual coordinates import and in-app pin toggles |
| Vehicles | Randy references, rare routes, garage guide, personal journal | Full vehicle catalog, verified fixed/random spawns, actual pictures/stat comparisons, shared sightings |
| Money | 22 banks, fence preferences, calculator | Measured cooldowns/net profit routes, other robbery categories |
| Glitches | Evidence log, candidate methods | Actual Series S reproduction after patch |
| Weapons | 15 free pickup leads | Full catalog, accurate map references and stats |
| Randy | Core, later and disputed list; RydeMe steps | Console test of driveway/partner sequence, exact game board |
| Gameplay | Accessibility, chapter priorities, stat upgrades | Verify contextual prompts and chapter availability |
| Progress | 118 checkboxes, independent players | More collectible sets, tested backup/restore |
| Codes | Selected 13 entries | Remaining fixed codes, randomized combinations |
| Routes | Suggested geographic clusters | Real coordinates, timing and route optimization |
## Source decisions
Cars for GTA6 & GTA5: https://play.google.com/store/apps/details?id=com.codevsit.carcompanion.gta confirms community map and comparison, but no public export found. GTABase Nov 26 reports 5,699 locations / 108 categories, 162 vehicle spawns and 254 standout vehicles: https://www.gtabase.com/gta-6/map/ . Counts are map entries, not guaranteed spawns. FullSweep documents keyless source-tagged locations with CORS and CC BY 4.0: https://fullsweepmap.com/developers/ . Its artwork is explicitly excluded. Added opt-in live list only, no coordinate overlay; actual response not verified, graceful fallback to external maps. GTA Town creator page advertises CC BY 4.0, but vehicle licensing page requires domain-specific key and conditions: https://gtatown.com/creators/data and https://gtatown.com/licence/data . No bulk import until clarified. Open GTA 6 Map JSON fetch unavailable during this pass. No private app data copied or shared feed fabricated.
## Release check
Open index.html with app/guide-data.js and app/guide-data-extra.js at their relative paths. Verify navigation, all 16 bundled guides, 22 car search entries, profile isolation, checklists, local storage, JSON round-trip, FullSweep response, mobile layout and external map links. The previous standalone companion.html is retained. No tests on Android performed. No teddy-bear exploit.
