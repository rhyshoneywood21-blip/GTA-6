# Release readiness and data quality gates — 26 November 2026
Goal: one phone-friendly companion for two Xbox Series S story-mode players. "100% completion guide" is distinct from "100% accurate app"; no guarantee of zero errors.
## Release gates
| Gate | Status | Acceptance criteria |
|---|---|---|
| Vehicle catalogue | Open | Import permitted dataset, record version and model IDs, distinguish variants, compare coverage against in-game index |
| Vehicle locations | Open | Every pin has source, coordinate system, date, classification (fixed/random/mission/sighting), chapter if known, verification level |
| Community sightings | Open | Source link/proof, platform, no fabricated records; private journal already exists, shared feed not yet implemented |
| Map | Partial | Test existing embed on phone, zoom/filter/search; validate sample pins against game screenshots; independent map progress not yet synced |
| Money / guides | Partial | Sources, unlock prerequisites, gross versus net, no guarantee of repeatability |
| Glitches | Source-based inclusion | Include documented and reported methods with steps, source/date, patch uncertainty and save-risk notes. Local console reproduction optional; not a release blocker. |
| Weapons | Location-focused | Free and hidden pickups, unique finds and useful unlocks; no full catalogue, stats or shop prices required. |
| Completion | Partial | 35 requirements tracked; source-based collectible pins imported, individual rewards and coverage to expand |
| Accessibility | Partial | Test navigation, text size, touch targets, contrast and player profile isolation on Android |
| App quality | Open | Run browser tests for search, all routes, persistence, backups, map failures and offline behavior |
| APK | Open | Package and test on actual devices; no signing keys in public repository |
## New data-source checks
- Cars for GTA6 & GTA5: https://play.google.com/store/apps/details?id=com.codevsit.carcompanion.gta — confirms community map, vehicle list and comparison. No public export verified.
- HotWired: https://hotwired.gg/ — screenshot-backed community sightings, platform and spawn descriptions, plus unchecked reports. Useful reference link; no bulk reuse permission verified.
- GTABase fixed spawn map: https://www.gtabase.com/gta-6/map/?feature=vehicle-spawn — 162 mapped entries at check time; not a complete game catalogue.
- GTA6Gang: https://gta6gang.com/pages/gta6-open-data.html — advertises CC BY 4.0 downloadable tables. Full page returned cache miss. Verify file schema, licence and revision before importing.
- GTA Town: https://gtatown.com/creators/data — advertises vehicle and collectible JSON, including 2710 collectible/pickup rows. Separate licence conditions still need checking; no import.
- Open GTA 6 Map: https://github.com/fbritoferreira/gta6 — advertises JSON and tiles. Confirm post-release accuracy, coordinate system and tile rights.
- FullSweep: https://fullsweepmap.com/developers/ and https://www.fullsweepmap.com/ — public API, but homepage reports 75 pre-release predicted pins and 1317 community landmarks; not a confirmed in-game spawn dataset. Never treat the entire feed as verified. Pixel coordinates are specific to its basemap.
- Vice City API: https://vice-city.app/developers — API and upstream credits; review keys, usage restrictions and map rights before import.
## Practical order
1. Finish non-vehicle research: pickup locations, money, reported glitches, tips, codes, collectibles, maps, Randy/RydeMe.
2. Then complete vehicle data and location coverage; preserve source and uncertainty.
3. Only afterward consolidate the content into the existing ten app sections, test functionality and package APK.
No story mission walkthroughs, exhaustive weapon statistics or teddy-bear warehouse exploit. Console testing of reported gameplay methods is optional; app functionality testing remains a release requirement.
## Known limits
No access to installed apps, no confirmed complete community spawn database, no console exploit test and no phone runtime test. Some source pages inaccessible. Data is changing; release claims must state version and coverage. No background work is running.
