# GTA VI | Xbox Series S gameplay handbook

Research baseline: **26 November 2026**. Latest identified Xbox build: **1.0.2.2 (23 November)**. Story mode only.

This is a spoiler-light, living research reference for two players who want easier gameplay, high payouts, fast travel and collectibles. The repository is public: do not add personal account details or private screenshots.

## Current priority — complete research before app release
No full story mission walkthroughs. Keep only relevant unlock requirements. APK/UI development paused; existing portable version is an earlier prototype.

**Current scope:** weapons are locations, free/hidden pickups, unique finds and useful unlocks only; no exhaustive weapon catalogue, damage ratings or shop prices required. Include source-backed community tips, glitches and farming methods even without Xbox reproduction. Label evidence and patch uncertainty; console verification is optional, not a release blocker. Keep save-risk warnings and exclude the teddy-bear warehouse method. Finish non-vehicle content, then vehicle data, then app packaging.
- [Data-first research report](research/data-first-pass.md)
- [Vehicle master research index](data/vehicles-master.json) — 757 exact-name candidate labels, not a verified unique model count.
- [Vehicle catalogue source facts](data/vehicle-catalogue.json) — 381 entries; 224 reported seat values.
- [Safes and reported codes](data/safes-map.json)
- [Weapon pickup locations](data/weapon-pickups.json)
- [Robbery pins](data/crime-pins.json) · [Collectible pins](data/collectibles-pins.json) · [Activity pins](data/activities-pins.json)

## Latest gameplay research — consolidated pass
- **[Research index and map coverage](research/non-vehicle-consolidated.md)**
- [Secret discoveries and permanent upgrades](guides/secret-discoveries.md)
- [Free and hidden pickup routes](guides/free-pickups-expanded.md)
- [Side income and farming sessions](guides/side-income-expanded.md)
- [Reported glitch additions](research/reported-glitch-additions.md)
- [Additional codes and puzzles](guides/code-puzzles.md)
- [Collectible rewards and cheat unlocks](guides/collectibles-and-cheat-rewards.md)
- [Updated hidden Xbox tricks](guides/quick-tricks.md)
- [Updated Randy/RydeMe report](guides/randy-rydeme.md)

## Existing prototype and guides
- **[Portable Leonida Companion](Leonida-Companion.html)** — [download raw HTML](https://raw.githubusercontent.com/rhyshoneywood21-blip/GTA-6/main/Leonida-Companion.html). Includes 6,642 source-based map records, vehicle cards and 23 guides. Not phone-tested.
- **[Android build workflow](https://github.com/rhyshoneywood21-blip/GTA-6/actions)** — manual-only during research; actual successful build not yet verified.
- [Ultimate pass release and quality report](research/ultimate-pass-release.md)
- [Quick lookup library: missions, codes, maps, races and equipment](guides/reference-library.md)
- [Expanded robbery and money guide](guides/robbery-expansion.md)
- [Equipment and phone reference](guides/equipment-and-phone.md)
- [Collectibles field guide](guides/collectible-field-guide.md)
- [Vehicle spawn field guide](guides/vehicle-spawn-field-guide.md)
- [Patch and troubleshooting guide](guides/troubleshooting-and-patch.md)
- **[New Leonida Companion dashboard](index.html)** — app source; requires the three bundled guide-data scripts under app/. Not hosted yet.
- [App coverage audit](research/app-coverage-audit.md) — what is ready and what still needs research.
- [Android APK and independent map roadmap](app/ROADMAP.md)
- [Map and vehicle data source research](research/map-data-sources.md)
- **[Expanded Randy vehicle checklist (16 core + later/disputed)](guides/randy-full-checklist.md)**
- [All 22 bank targets](guides/bank-checklist.md) · [CSV](data/banks.csv)
- [All 39 gang operations](guides/operations-checklist.md)
- [35 completion requirements](guides/completion.md)
- [Garage prices and ownership](guides/garage-and-vehicles.md)
- [Free weapon pickup routes](guides/free-weapon-route.md)
- [Rare vehicle routes](guides/rare-vehicle-route.md)
- [Xbox accessibility and partner controls](guides/xbox-accessibility.md)
- [Racing and money efficiency](guides/racing-and-money-efficiency.md)
- [Phone companion (offline HTML)](companion.html) — download and open in a browser; not a hosted site
- [Research pass 3–4 evidence and corrections](research/2026-11-26-pass-3-4.md)

- **[Play tonight — quick-start](guides/quick-start.md)** (chapter-by-chapter priorities)
- [Safe and garage codes](guides/safe-codes.md)
- [Permanent stat upgrades](guides/permanent-upgrades.md)
- [All seven fences and eight large vault targets](guides/fences-and-banks.md)
- [Research pass 2: evidence and corrections](research/2026-11-26-pass-2.md)
- [Randy's Wish List and RydeMe](guides/randy-rydeme.md)
- [Money, banks and fencing](guides/money.md)
- [Accessibility, controls and character upgrades](guides/gameplay.md)
- [Exploit evidence and testing log](research/exploits.md)
- [Free equipment, vehicles and exploration](guides/discoveries.md)

## Evidence rules
- **Documented:** official documentation or established walkthroughs; not necessarily tested on Series S.
- **Reported after patch:** dated community evidence after Nov 23, but upload date alone does not establish installed build.
- **Unverified:** insufficient evidence, conflicting reports or no direct reproduction.
- **Locally tested:** only after a player records platform, build, steps and outcome. No local tests recorded yet.

Save in a separate slot before testing exploits. Never assume a video proves an exploit works on your save. Check map markers and button prompts in-game. AI-generated maps are illustrative, not navigational references. No warehouse farming method is included.

## Patch monitoring
- [Rockstar support](https://support.rockstargames.com/)
- [Pure Xbox November 23 patch report](https://www.purexbox.com/news/2026/11/gta-6-update-now-live-on-xbox-series-xs-includes-seven-official-fixes)
- [Glitch tracker](https://www.vicevaulted.com/tracker) (community aggregator; not proof)

## Quick priorities
1. Enable accessibility options for the player who needs them.
2. Finish the Chapter 3 key-cloner unlock and use the in-game Wish List as the authority.
3. Test partner delivery on one car before grinding.
4. Fence narcotics with Tyrone and jewelry/marked bills with Yasmani once unlocked.
5. Unlock the bank vault activity in Chapter 4 for repeatable legitimate in-game payouts.
6. Collect permanent stat improvements and free equipment.

Research is versioned here; GitHub does not increase ChatGPT's runtime or cause autonomous research between turns.

## Non-vehicle research pass — 26 November
- [weapons master](guides/weapons-master.md)
- [money methods master](guides/money-methods-master.md)
- [safe code expanded](guides/safe-code-expanded.md)
- [collectible rewards](guides/collectible-rewards.md)
- [hidden mechanics expanded](guides/hidden-mechanics-expanded.md)
- [glitch evidence nov26](research/glitch-evidence-nov26.md)
- [randy rydeme](guides/randy-rydeme.md)
- [Archived weapon research](data/weapons-catalogue.json): retained for reference only; not required in the finished app.
- Five existing non-vehicle map subsets rechecked: 3,026 distinct IDs, no duplicated IDs or invalid coordinate bounds. 18 of the 121 safe pins have explicit numeric code observations. These checks do not verify in-game positions or whether codes are fixed. Vehicles, UI and APK untouched. Remaining research: safe codes, collectible rewards and locations, money routes, hidden discoveries and additional reported glitches. Full weapon statistics and local glitch reproduction are no longer required.
