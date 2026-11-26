# Android companion roadmap
Working title: Leonida Companion (unofficial). No final app branding selected.
## Stage 1 — current
Existing companion.html provides local two-player checklist, guide links and money calculator. Add external map hub first. No installable APK yet.
## Stage 2 — independent map
Evaluate licensed Open GTA 6 Map JSON, verify coordinates against the matching map tiles, preserve attribution, and show categories with toggles, search, hide-found, favorites, zoom and pan. Maintain independent Player 1/2 completion records. Support vehicle model cards with multiple spawn alternatives, chapter gates, fixed/random labels, and Randy target filters. Do not reuse copyrighted images without permission. Keep source links visible.
## Stage 3 — installable web app
Use a responsive app shell, manifest, icons, service worker with versioned offline cache for our own guide content, and JSON backup/restore. Host over HTTPS (GitHub Pages or equivalent). Test on real Android, including low-memory devices, airplane mode and data updates. No background location or account permissions needed. Map downloads only if provider permits.
## Stage 4 — Android APK
Wrap tested web app with Capacitor or implement native shell; select supported Android toolchain at implementation time. Build debug APK via Gradle / GitHub Actions, verify on phone, then signed release if desired. Store signing material outside public repository. No game injection, console integration or access to installed third-party apps. Public distribution requires rights and store-policy review.
## Product scope
Home: chapter and player shortcuts; Map: category toggles and found status; Vehicles: model, spawns, Randy, owned and favorites; Money: robbery/fence routes and net income; Guides: RydeMe, upgrades, codes, controls; Research: patch date, evidence and status; Settings: accessibility and progress export.
## Definition of done for first map
A matching licensed tile/coordinate source, validated real gameplay markers, category toggle test, search, independent progress persistence, attribution, offline behavior documented, no guessed pins. No claim of a complete map until coverage measured. 
