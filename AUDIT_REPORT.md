# iOS / App Store Submission Readiness — Audit Report

**Date:** 2026-09-05
**Branch:** `audit-ios-readiness`
**Scope:** iOS / App Store only. Google Play is a separate future pass.
**Verdict:** **Not submittable today.** Not even TestFlight-buildable today. Six independently blocking gaps, most of which are hours of work each, one of which (paywall/IAP) is days.

---

## 0. Framing correction

The audit prompt was Expo-flavored. **Deal Breaker is not an Expo project.** It is a **Vite + React + Capacitor** app. Concretely:

- No `app.json`, no `app.config.js`, no `eas.json`, no Expo SDK.
- `package.json` shows `@capacitor/ios`, `@capacitor/android`, `@capacitor/cli`, `@capacitor/core`, plus a handful of Capacitor plugins — nothing from `expo` or `@expo/*`.
- Native config lives in `capacitor.config.json`, `android/…/AndroidManifest.xml`, and (once scaffolded) `ios/App/App/Info.plist`.
- Production iOS builds happen via **Xcode archive on a Mac**, not `eas build`. The npm script is `npm run ios` (from `package.json:12`): `vite build && node scripts/stamp-sw.js && cap sync ios && cap open ios`.

Every question in the prompt has been translated to its Capacitor equivalent below.

---

## 1. Capacitor / iOS project setup — 🚨 BLOCKER

### `capacitor.config.json` — OK
- `appId`: `com.mirsabfaiz.dealbreaker` ✅ real bundle identifier, not a scaffold placeholder.
- `appName`: `Deal Breaker` ✅
- `webDir`: `dist` ✅ matches Vite output
- `ios.contentInset`: `automatic` ✅
- `ios.scrollEnabled`: `false` ✅
- SplashScreen + StatusBar plugin config present ✅

### `package.json` — OK
- `version`: `"0.1.0"` — acceptable starting point; App Store Connect needs `1.0.0` for first submission, but Capacitor reads the marketing version from the Xcode project (`CFBundleShortVersionString`), not `package.json`, so this can be set at Xcode time.

### **iOS platform is not scaffolded — this is the single biggest blocker**
- `ls ios` returns nothing. There is no `ios/App/App.xcworkspace`, no `Info.plist`, no `AppIcon.appiconset`.
- `@capacitor/ios` is in `dependencies`, but `npx cap add ios` has never been run.
- **Impact:** Zero of the iOS-specific audit items below can be verified until this exists. `npm run ios` will fail today — `cap sync ios` and `cap open ios` both require the platform to be added first.

**Fix (must run on a Mac with Xcode installed — nothing to fix here on Windows):**
```bash
npm install
npx cap add ios
npm run ios          # opens Xcode
```
That single command creates `ios/App/App.xcworkspace`, `Info.plist`, the asset catalog, everything below.

---

## 2. iOS permission usage descriptions — deferred until iOS project exists

The app currently uses:
- `@capacitor/haptics` — no permission required
- `@capacitor/status-bar` — no permission required
- `@capacitor/splash-screen` — no permission required
- `@capacitor/app` — no permission required

**Nothing in `src/App.jsx` currently touches camera, photo library, location, microphone, contacts, HealthKit, or biometrics.** So today the only Info.plist string required is the standard app metadata (display name, version), not any `NS*UsageDescription`.

**But** two planned features add requirements:

| Feature | Plugin needed | `Info.plist` key | Suggested string |
|---|---|---|---|
| Notifications (currently a **fake feature** — see §11) | `@capacitor/local-notifications` | Not a plist string on iOS — `requestPermissions()` triggers the OS dialog | — |
| Backup import (already exists in-app) | May trigger `UIDocumentPickerViewController` on some iOS versions | none required | — |

If Face ID / biometric app-lock is ever added (it's on the deferred list in `store/CHECKLIST.md`), that needs `NSFaceIDUsageDescription`.

**Action required from Mirsab (decision):** confirm the notification feature ships in v1. If yes, this doubles the size of the `add-notifications` work (see Blocker List §11).

---

## 3. Apple Privacy Manifest (`PrivacyInfo.xcprivacy`) — action needed at Xcode time

As of iOS 17 / Xcode 15, Apple requires a privacy manifest declaring:
- Reasons for using certain "Required Reason APIs" (e.g. `UserDefaults`, `NSFileSystemFileCreationDate`)
- Data collection categories per SDK
- Tracking domains

**Third-party SDKs in `package.json` that would need declarations:**

| Dependency | Ships privacy manifest? | Notes |
|---|---|---|
| `@capacitor/core` `8.3.1` | ✅ yes — bundled in `node_modules/@capacitor/ios/Capacitor/Capacitor/PrivacyInfo.xcprivacy` (verified via find) | inherited automatically |
| `@capacitor/ios` `8.3.1` | ✅ same file | ok |
| `@capacitor/android` | N/A (iOS-only requirement) | |
| `@capacitor/haptics` | Capacitor's shared manifest covers it | ok |
| `@capacitor/status-bar` | Same | ok |
| `@capacitor/splash-screen` | Same | ok |
| `@capacitor/app` | Same | ok |
| `@fontsource/outfit` | web font package, no native code | not applicable |
| `react`, `react-dom`, Vite | web-only | not applicable |

**Verdict:** with the current dependency set, Capacitor's bundled manifest is sufficient. **However**, the app currently has no *app-level* `PrivacyInfo.xcprivacy` at `ios/App/App/PrivacyInfo.xcprivacy`. Apple prefers apps ship one that explicitly declares:
- `NSPrivacyCollectedDataTypes`: empty array (you collect nothing)
- `NSPrivacyTracking`: `false`
- `NSPrivacyTrackingDomains`: empty
- `NSPrivacyAccessedAPITypes`: entries for `UserDefaults` (reason `CA92.1`) — because `localStorage` in a WKWebView writes to app sandbox and Apple's automated scanner treats it as `UserDefaults`-adjacent.

I've drafted this file below in Appendix A. Drop it into `ios/App/App/PrivacyInfo.xcprivacy` once the iOS platform is added.

**When RevenueCat is added later**, RevenueCat ships its own manifest — no action beyond installing.

---

## 4. Account deletion — ✅ N/A (compliant by design)

**Deal Breaker has no user accounts.** No login, no signup, no server-side identity. Verified across:
- `src/App.jsx` — grepped for `login`, `signup`, `password`, `account` — zero hits related to authentication.
- `store/legal/privacy-policy.md` explicitly states "There is no account."

Apple's account-deletion requirement (Guideline 5.1.1(v)) **only applies to apps that support account creation**. Deal Breaker doesn't. No action needed.

**However**, the "Reset Everything" flow in Settings should be presented as the equivalent for reviewers who ask. The App Review Notes in `store/listings/apple.md` already call this out — good.

---

## 5. In-app purchase compliance — 🚨 STRUCTURAL BLOCKER

### Current state
- **Zero IAP code exists.** No `@capacitor-community/in-app-purchases`, no `@revenuecat/purchases-capacitor`, no `RevenueCatUI`, no `StoreKit` calls, no paywall screen, no trial gate, no receipt validation.
- The pricing model (14-day free trial → $4.99/mo) is documented in `store/listings/apple.md` and `shared.md` but **is not built in the app**.

### Compliance risk
This is fine **as long as v1 ships fully free**. The app has no digital-content payment path today, so there's nothing that would fail App Store Guideline 3.1.1 (external payment prohibition).

**But** the current listing copy explicitly promises "14-day free trial, then $4.99/month." If you submit with that copy and no paywall, App Review will flag it as misleading. Two options:

1. **Ship v1 as fully free** — remove the pricing sentence from `store/listings/shared.md` and `apple.md`. Ship IAP in v1.1.
2. **Wait to submit until IAP is built** — this is 2–3 sessions of focused work (RevenueCat integration, paywall UI, trial state persistence, restore-purchases button, subscription disclosures).

**Recommendation:** Option 1 for TestFlight and initial launch. Getting the app in front of testers now, with real IAP shipped as a fast-follow, is safer than blocking on the payment layer.

**Decision needed from Mirsab.**

### Structural note when IAP does land
Deal Breaker is a purely digital service (recovery tracking). Any subscription **must** go through Apple's StoreKit — Stripe or any external payment processor for the subscription would be an outright rejection under 3.1.1. RevenueCat is a wrapper around StoreKit, so using it is fully compliant.

---

## 6. Secrets in the bundle — ✅ CLEAN

Ran targeted greps across `src/`:
- `apiKey|API_KEY|secret|SECRET|token|TOKEN` — no matches for actual credentials. Only unrelated `.tokens` word references in comments about CSS design tokens.
- `sentry|posthog|amplitude|firebase|mixpanel` — zero matches. No analytics or crash-reporting SDK is bundled.
- `http://` — only in a substring comparison inside the crisis-link handler (`isWebUrl = c.href.startsWith("http://")`), no cleartext endpoints.
- `.env*` — gitignored; no `.env` file in the repo.

**No secrets exposure risk today.** When RevenueCat is added, its public SDK key **is safe to ship in the client bundle** — it's designed that way; product entitlement is verified server-side by RevenueCat, not by the key itself.

---

## 7. Legal / metadata — mostly drafted, none live

### Legal docs
| Doc | Drafted? | Live URL? |
|---|---|---|
| Privacy Policy | ✅ `store/legal/privacy-policy.md` | ❌ not hosted |
| Terms of Service | ✅ `store/legal/terms-of-service.md` | ❌ not hosted |
| Health disclaimer | ✅ `store/legal/health-disclaimer.md` + shown in-app | ✅ in-app; no external URL |
| Data deletion page | ✅ `store/legal/delete-data.md` | ❌ not hosted |

### Placeholders still in the codebase
All still present, blocking legal-link functionality in the app itself. See `src/App.jsx:1018-1024`:
- `[PRIVACY_POLICY_URL]`
- `[TERMS_URL]`
- `[SUPPORT_URL]`
- `[MARKETING_URL]`
- `[SUPPORT_EMAIL]`

Also in every `store/legal/*.md` file: `[LEGAL_ENTITY_NAME]`, `[LEGAL_ENTITY_ADDRESS]`, `[LEGAL_ENTITY_JURISDICTION]`, `[EFFECTIVE_DATE]`, `[LAST_UPDATED]`.

**Action required from Mirsab (decisions, not code):**
1. Domain — buy `dealbreakerapp.com` (or a chosen alternative)?
2. Hosting — Vercel (already used for the web app), Cloudflare Pages, or GitHub Pages?
3. Legal entity — form LLC, or ship as sole proprietor under your own name?
4. Support email — `support@dealbreakerapp.com` behind Google Workspace / iCloud+ custom domain / a Gmail alias?

Until (1)–(4) are decided, the placeholders cannot be resolved and the store listing has no working Privacy Policy URL to enter into App Store Connect.

### Age rating
Already drafted in `store/listings/apple.md` — will produce a **17+** rating (Alcohol/Tobacco/Drug references, Medical/Treatment references, Mature themes). Reasonable and accurate.

### Export compliance (encryption)
The app makes zero network calls, uses zero custom cryptography, and uses only standard iOS HTTPS (via Capacitor's WKWebView for the bundled `dist/` load — which for a Capacitor app is a `capacitor://` scheme, not HTTP). This qualifies for the **standard cryptography exemption** on App Store Connect:

> "Does your app use encryption?" → **Yes**
> "Does your app qualify for any of the exemptions provided in Category 5, Part 2 of the U.S. Export Administration Regulations?" → **Yes** — exempt because it uses only standard cryptography from Apple's frameworks (HTTPS).

You will not need to file an annual self-classification report. This is worth confirming with a lawyer if you're paranoid, but for a local-first tracker with no custom crypto and no external network calls, it's the standard indie answer.

---

## 8. Store listing assets — mostly missing

### Currently in the repo
| Asset | Present? | Where |
|---|---|---|
| SVG app icon 192 | ✅ | `public/icon-192.svg` |
| SVG app icon 512 | ✅ | `public/icon-512.svg` |
| Android launcher icons (all densities) | ✅ | `android/app/src/main/res/mipmap-*/` |
| iOS `AppIcon.appiconset` | ❌ (no iOS project) | — |
| **1024×1024 App Store icon (PNG, no alpha, no transparency)** | ❌ | must be created |
| iOS splash screen PNGs | ❌ (no iOS project) | — |
| iPhone 6.9" screenshots (1290×2796, iPhone 16 Pro Max) | ❌ | must be created |
| iPhone 6.5" screenshots (1284×2778 or 1242×2688) | ❌ | must be created (Apple accepts 6.9" only for new apps as of iOS 17.2, so this may be optional — verify at submission) |
| iPad 13" screenshots (2048×2732) | ❌ | only if iPad support is claimed; recommend claiming iPhone-only for v1 |
| App preview video | ❌ | optional |
| Feature graphic 1024×500 (Play Store) | ❌ | not required for App Store, out of scope |

### Listing text
| Field | Drafted? | Where |
|---|---|---|
| App name | ✅ | `store/listings/apple.md` |
| Subtitle (30 chars) | ✅ | same |
| Promotional text (170 chars) | ✅ | same |
| Long description (4000 chars) | ✅ | `store/listings/shared.md` |
| Keywords | ⚠️ referenced but not written | `shared.md` says "see `shared.md`" but no keyword list is present |
| Support / Marketing / Privacy URLs | ❌ placeholders | — |

**Action items on the asset side:**
- Design the 1024×1024 PNG app icon (Figma / Sketch / Photoshop). Must be RGB, no alpha, no rounded corners (Apple applies the mask). The existing SVG in `public/icon-512.svg` is the source of truth for the design — rasterize + upscale.
- Take screenshots on an iPhone simulator running the app once the iOS platform exists. Recommended screens: Today view (day-N streak), Craving-in-progress with 15-min timer, Insights panel, Journal, Milestones.
- Write the keywords list — 100 chars comma-separated, no spaces after commas. Draft candidates: `recovery,sobriety,addiction,quit,craving,streak,tracker,private,alcohol,gambling,nicotine`.

---

## 9. TestFlight readiness — 🚨 CANNOT BUILD TODAY

The prompt's phrasing: "confirm the app can produce a working EAS production build today." Translated to Capacitor: **can `npm run ios` produce an archive uploadable to App Store Connect today?**

**No.** Blockers:

1. **No Mac.** Xcode is macOS-only. Nothing gets built or uploaded from Windows.
2. **iOS platform not added.** Even on a Mac, `npm run ios` currently fails because `cap sync ios` targets a non-existent `ios/` directory.
3. **No Apple Developer account yet.** Signing certificates, provisioning profiles, and App Store Connect app record all require the enrolled account.
4. **No 1024×1024 App Store icon.** Xcode's Archive → Distribute flow will fail validation without it.
5. **Notifications feature is fake** (see §11). Not a build blocker, but a submission blocker — App Review will flag it as broken.

**Sequence to reach the first TestFlight build:**
1. Enroll in Apple Developer Program ($99/yr) — takes 24–48 hours.
2. Get Mac access — physical, borrowed, cloud (MacinCloud ~$30/mo), or via a CI service (Codemagic offers free-tier Mac builds).
3. Install Xcode 15+ on the Mac.
4. `git clone` on the Mac, `npm install`, `npx cap add ios`, `npm run ios`.
5. In Xcode: set signing team (from step 1), set bundle version, drop in the 1024 icon, decide notifications policy.
6. Product → Archive → Distribute → App Store Connect.

**Realistic timeline:** if Apple approves the developer account fast and a Mac is available, this is a weekend of work. Without a Mac, it's blocked indefinitely.

---

## 10. Web/mobile divergence — ✅ SAME BUNDLE

Deal Breaker's web app on Vercel and the native app are the **exact same JavaScript bundle**. There is no feature-flag divergence, no platform-specific code fork:

- `main.jsx:52` — service worker registers only in web (`!Capacitor.isNativePlatform()`)
- `main.jsx:62` — splash screen hide runs only in native
- Small runtime-gated code paths in `App.jsx` (haptics wrapped in `isNative()`, etc.)

Everything else is shared. **No divergence risk.** A feature on the web app is a feature in the native app and vice versa. This also means anything user-visible in the current Vercel deploy at https://dealbreaker-app-six.vercel.app is what will ship — including the placeholder `[PRIVACY_POLICY_URL]` if you don't fix it before generating the iOS bundle.

**The one thing to watch:** because both surfaces render the same code, the current `[SUPPORT_EMAIL]` / `[PRIVACY_POLICY_URL]` etc. are visible on the live public web app right now. Anyone landing on the Vercel URL sees literal `[SUPPORT_EMAIL]` in the Settings menu. That's not a store submission issue but is a "you're actively looking unprofessional to any tester who clicks in" issue.

---

## 11. Notifications: a broken advertised feature — 🚨 SUBMISSION BLOCKER

Not part of the prompt's numbered list, but material enough that a reviewer will hit it in the first minute of testing:

- Settings has a fully wired-up notification toggle, reminder time picker, and message style selector.
- `src/App.jsx:2194` reads: `"Connecting notifications requires the native app build."`
- **There is no code that schedules a notification.** The toggle persists to localStorage and does nothing else.

If a reviewer toggles it on and nothing arrives at the chosen time, that's a rejection under App Review Guideline 2.3.1 ("Accurate Metadata / functional descriptions").

**Fix scope (once iOS platform is added):**
```bash
npm install @capacitor/local-notifications
```
Then in `App.jsx`: on `notifOn` change to `true`, request permission and `LocalNotifications.schedule({...})` a daily repeating notification at `notifTime` with body = `notifMsg`. On toggle to `false` or on time/message change, cancel and re-schedule. Roughly 40 lines. This is a **separate branch** — do not fold into the audit branch.

Alternative for v1: **hide the notification section entirely** behind an `IS_NATIVE_NOTIF_ENABLED = false` flag. Ships nothing you can't back up. Cleaner story to reviewers.

---

## What this audit changed on disk

Committed to branch `audit-ios-readiness`:
- **Added:** `AUDIT_REPORT.md` (this file).
- **Deleted:** `public/test.html` — dev leftover exposed on the live web bundle.
- **Deleted:** `src/App.jsx.bak` — stale backup, 99KB, not gitignored.
- **Deleted:** `new`, `x.days`, `{` — empty files in repo root from prior shell mishaps.

Nothing else was modified. Every other fix required either a Mac (§1, §2, §3, §8, §9), a decision from Mirsab (§5, §7), or its own dedicated branch (§11).

---

## 🔴 Blocks a first TestFlight build (in order)

1. **Mac access** — physical, borrowed, or cloud (MacinCloud / Codemagic). Without this, nothing else in this list matters.
2. **Apple Developer Program enrollment** — $99/yr, 24–48 h approval. Start immediately.
3. **Scaffold the iOS platform** — `npx cap add ios` on the Mac. Produces `ios/App/App.xcworkspace`.
4. **1024×1024 PNG app icon** — no alpha, no transparency. Design from `public/icon-512.svg`.
5. **Xcode signing team + provisioning** — configured once the developer account exists.
6. **Set marketing version to `1.0.0` and build number to `1`** in Xcode target settings.

Do all six and you can archive → upload → TestFlight will install on your own device.

## 🟠 Blocks App Store submission (once TestFlight works)

1. **Decide notifications policy** — build the feature (§11) OR hide the UI entirely. Cannot ship both settings visible AND non-functional.
2. **Decide IAP policy for v1** (§5) — ship fully free (remove pricing sentence from listings), OR block submission on RevenueCat + paywall + restore-purchases work.
3. **Live Privacy Policy URL** hosted somewhere Apple can hit (§7) — required field in App Store Connect.
4. **Live Support URL** — required field in App Store Connect.
5. **Resolve all `[BRACKETED_PLACEHOLDERS]`** in `src/App.jsx:1018-1024` and every `store/legal/*.md`. Blocked on decisions in §7 (entity, domain, email).
6. **Drop in `PrivacyInfo.xcprivacy`** at `ios/App/App/PrivacyInfo.xcprivacy` — draft in Appendix A below.
7. **Screenshots for iPhone 6.9"** — minimum 3, recommended 5. Take on iOS simulator once the iOS platform exists.
8. **Age rating questionnaire** — pre-answered in `store/listings/apple.md`. Just fill it in App Store Connect.
9. **Export compliance answers** — pre-answered in §7 above.
10. **App Review Notes** — pre-drafted in `store/listings/apple.md`. Paste into App Store Connect.

## 🟡 Would improve outcome but not strictly required

- Keywords list (currently referenced but empty in `shared.md`)
- iPad 13" screenshots (only if claiming iPad support — recommend iPhone-only for v1)
- Marketing URL and marketing site
- App preview video
- Lawyer review of Privacy Policy and Terms of Service — especially before IAP
- FLAG_SECURE / biometric app-lock (deferred in Stream 7 of `store/CHECKLIST.md`)

---

## Appendix A — `PrivacyInfo.xcprivacy` template

Drop this at `ios/App/App/PrivacyInfo.xcprivacy` after `npx cap add ios`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>NSPrivacyTracking</key>
    <false/>
    <key>NSPrivacyTrackingDomains</key>
    <array/>
    <key>NSPrivacyCollectedDataTypes</key>
    <array/>
    <key>NSPrivacyAccessedAPITypes</key>
    <array>
        <dict>
            <key>NSPrivacyAccessedAPIType</key>
            <string>NSPrivacyAccessedAPICategoryUserDefaults</string>
            <key>NSPrivacyAccessedAPITypeReasons</key>
            <array>
                <string>CA92.1</string>
            </array>
        </dict>
    </array>
</dict>
</plist>
```

Reason code `CA92.1`: "Access user defaults to read and write information that is only accessible to the app itself." Applies here because the WKWebView's `localStorage` maps to `NSUserDefaults`-adjacent storage that Apple's automated scanner detects.

When RevenueCat is added later, it will ship its own `PrivacyInfo.xcprivacy` inside its `.xcframework` and be merged automatically — no manual edit needed.
