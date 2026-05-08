# App store launch checklist

Track every step from "private repo" to "live on both stores." Cross
items off as they're done. Items marked **YOU** require you (not
Claude) to act.

---

## Stream 1 — Documents & legal

- [x] Privacy policy drafted (`store/legal/privacy-policy.md`)
- [x] Terms of Service drafted (`store/legal/terms-of-service.md`)
- [x] Health disclaimer drafted (`store/legal/health-disclaimer.md`)
- [x] Account/data deletion page drafted (`store/legal/delete-data.md`)
- [ ] **YOU** Form LLC (or decide to ship as sole proprietor) → fill in `[LEGAL_ENTITY_NAME]` etc. via `PLACEHOLDERS.md`
- [ ] **YOU** Lawyer review of privacy policy + ToS (highly recommended before subscription billing turns on)

## Stream 2 — Hosting & infrastructure

- [ ] **YOU** Buy domain (e.g. `dealbreakerapp.com`) — optional but recommended
- [ ] **YOU** Set up Vercel / Netlify / Cloudflare Pages account
- [ ] Deploy `store/legal/` as a static site (one of the docs renderers like Astro, Eleventy, or even raw markdown via Cloudflare's markdown rendering)
- [ ] Verify live URLs:
  - [ ] `[PRIVACY_POLICY_URL]` resolves
  - [ ] `[TERMS_URL]` resolves
  - [ ] `[MARKETING_URL]/delete-data` resolves
  - [ ] `[SUPPORT_URL]` resolves
- [ ] **YOU** Set up support email (custom domain or aliased Gmail)
- [ ] Replace all placeholders in `store/` and `src/App.jsx` once URLs and entity are finalized

## Stream 3 — In-app compliance changes

- [ ] Settings card with links to Privacy Policy / Terms / Health disclaimer / Support
- [ ] Health disclaimer modal shown on first run (after onboarding)
- [ ] Health disclaimer always accessible from Settings
- [ ] Crisis resource list embedded in the disclaimer text
- [ ] Make Export Backup and Reset Everything more discoverable in Settings
- [ ] Subscription disclosure block (when subscription ships)
- [ ] Auto-renewal terms text (when subscription ships)

## Stream 4 — Marketing & assets

- [ ] App icon at 1024×1024 PNG (Apple)
- [ ] App icon at 512×512 PNG (Google Play)
- [ ] Adaptive icon foreground + background (Android)
- [ ] iOS app icons at all required densities
- [ ] Splash screen artwork (currently default)
- [ ] Feature graphic 1024×500 (Play Store)
- [ ] Screenshots — iOS:
  - [ ] 6.9" (iPhone 16 Pro Max)
  - [ ] 6.5" (iPhone 14 Plus)
  - [ ] 5.5" (older devices)
  - [ ] iPad 13"
- [ ] Screenshots — Android:
  - [ ] Phone (at least 2)
  - [ ] 7" tablet (optional)
  - [ ] 10" tablet (optional)
- [ ] App preview video (optional but boosts conversion)
- [ ] Marketing copy reviewed (`store/listings/`)

## Stream 5 — Developer accounts & store setup

- [ ] **YOU** Apple Developer Program enrollment (`https://developer.apple.com/programs/enroll/`) — start NOW, takes days
- [ ] **YOU** Google Play Console enrollment (`https://play.google.com/console/signup`)
- [ ] **YOU** ID verification completed (both)
- [ ] **YOU** Bank/tax info added in App Store Connect for payouts
- [ ] **YOU** Bank/tax info added in Play Console for payouts
- [ ] **YOU** App Store Connect: create app record, fill metadata
- [ ] **YOU** Play Console: create app record, fill metadata

## Stream 6 — Subscription configuration

- [ ] **YOU** App Store Connect: create subscription product `com.mirsabfaiz.dealbreaker.monthly`, $4.99/mo, 14-day trial
- [ ] **YOU** Play Console: create subscription product matching above
- [ ] RevenueCat account created (or alternative receipt validator)
- [ ] RevenueCat → publishable iOS / Android keys added to app
- [ ] Paywall UI built in app
- [ ] Trial countdown / "you have N days left" UI built
- [ ] "Manage subscription" deep-link from in-app settings
- [ ] "Restore purchases" button on iOS (Apple requires)

## Stream 7 — Final hardening (deferred from previous branch)

- [ ] M2 — `FLAG_SECURE` (block screenshots / app switcher previews) with user toggle
- [ ] M3 — Biometric / passcode app lock
- [ ] M6 — ProGuard / R8 minification on release builds
- [ ] Verify production builds in actual release configuration (debugging off, etc.)

## Stream 8 — Pre-submission verification

- [ ] All placeholders replaced with real values across `store/` and `src/`
- [ ] Manual end-to-end test of the live build on Android emulator + physical device if possible
- [ ] Crash test — force render errors in production, confirm friendly fallback shows
- [ ] Network test — verify no cleartext requests in `chrome://inspect` or proxy
- [ ] Backup test — Export → reinstall → Import → data restored
- [ ] Reset test — Reset Everything → confirm zero localStorage
- [ ] All in-app legal links open the correct URLs
- [ ] Health disclaimer appears on first run

## Stream 9 — Submission

- [ ] **YOU** Build production iOS archive in Xcode (needs Mac), upload to App Store Connect
- [ ] **YOU** Build signed release APK / AAB, upload to Play Console internal testing track
- [ ] **YOU** Internal testing — invite trusted testers
- [ ] **YOU** Address any review feedback
- [ ] **YOU** Submit for store review
- [ ] **YOU** Respond to any reviewer questions (Apple is strict on health-adjacent apps; expect at least one round of back-and-forth)

## Stream 10 — Day of launch

- [ ] Marketing site live with all docs at expected URLs
- [ ] Support email actively monitored
- [ ] Analytics/crash reporting set up (optional — but if added, update privacy policy first)
- [ ] Social channels set up (optional — your brand says no, but you may want to be reachable)
- [ ] Announcement plan
