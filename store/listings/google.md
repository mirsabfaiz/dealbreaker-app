# Google Play Store listing — Play Console

Paste these into the corresponding fields in Play Console.

## Application ID
`com.mirsabfaiz.dealbreaker` (already set in `android/app/build.gradle`)

## App name (50 chars max)
**Deal Breaker**

## Short description (80 chars max)
*(See `shared.md`)*

## Full description (4000 chars max)
*(See `shared.md` Long description.)*

## Categories
- Primary: **Health & Fitness**
- Tags: lifestyle, mental health (when prompted)

## Content rating questionnaire

The IARC questionnaire produces ratings for multiple regions
(ESRB North America, PEGI Europe, etc.) from one set of answers.
Honest answers for Deal Breaker:

| Question | Answer |
|---|---|
| Violence | No |
| Sexual content | No |
| Profanity | No |
| Drugs (references / depictions) | **Yes — references** (the app is about recovery from substances) |
| Drugs (encouragement of use) | **No** (the opposite) |
| Gambling | No |
| Crude humor | No |
| User-generated content shared with other users | **No** (no social features) |
| User-to-user communication | **No** |
| Shares user location | **No** |
| Allows in-app purchases | **Yes** (subscription) |
| Allows digital purchases for real money | **Yes** |

Expected resulting rating: **Mature 17+** (ESRB) / **PEGI 16** /
similar in other regions.

## Target audience and content

- **Target age range:** 18–65+
- **App designed for children:** No
- **Children's policy compliance:** N/A (not directed at children)

## Data Safety form

This is the Play equivalent of Apple's Privacy Nutrition Label.
Be conservative and accurate.

### Section 1: Data collection and security

| Question | Answer |
|---|---|
| Does your app collect or share any of the required user data types? | **Yes** (only because of subscription receipt) |
| Is all of the user data collected by your app encrypted in transit? | **Yes** (HTTPS-only via network security config) |
| Do you provide a way for users to request that their data is deleted? | **Yes** (Settings → Reset Everything wipes local data; we hold no server-side data) |

### Section 2: Data types

For Deal Breaker, the answer to almost every category should be **No**.
The one exception is:

**Financial info → Purchase history**: Yes
- Collected? Yes (the subscription receipt)
- Shared? Yes (with your receipt validation service if used; otherwise just Apple/Google)
- Optional/required? Required for the subscription
- Why? "App functionality" — to confirm subscription status
- Linked to user identity? **No** (receipt is anonymous to the dev)
- Used to track users across other apps/services? **No**

For every other category — Personal Info, Contacts, Location, Web
History, App Activity, Photos & Videos, Audio, Files, Calendar, Health
& Fitness, Messages, Identifiers, Diagnostics, etc. — the answer is
**No**. We do not collect these.

### Section 3: Data security practices

- Data encrypted in transit: **Yes**
- Users can request data deletion: **Yes** (in-app reset)

## Pricing & distribution

- **Pricing:** Free with in-app subscription
- **In-app products:** Subscription (set up in Play Console after first APK upload)
- **Countries:** All available (you can restrict during testing)
- **Contains ads:** **No**

## Permissions justification

The app declares only the **INTERNET** permission. No other permissions
are requested. Play Console may ask why — say:

> Required for the standard StoreKit / Play Billing receipt validation
> when starting or maintaining the in-app subscription. The app makes
> no other network calls.

## Subscription configuration (when ready)

In Play Console → Monetize → Products → Subscriptions:

- Product ID: `com.mirsabfaiz.dealbreaker.monthly`
- Name: "Deal Breaker Monthly"
- Description: "Full access to Deal Breaker — multi-addiction tracking, craving timers, journal, insights, and themes. Cancel anytime."
- Billing period: **Monthly**
- Default price: **US$4.99**
- Free trial: **14 days**
- Grace period: **3 days** (recommended — Google retries failed payments)

### Subscription benefits text (shown to users)
> Multi-addiction tracking, craving timers, journal entries, pattern insights, custom milestones, and theme variety. Cancel anytime through Google Play.

## Required URLs

- **Privacy policy:** `[PRIVACY_POLICY_URL]`
- **Website:** `[MARKETING_URL]`
- **Email:** `[SUPPORT_EMAIL]`
- **Phone:** optional (you can leave blank for personal-app launches)

## Account deletion link (NEW Play requirement, 2024+)

Play Console now requires a public-facing URL where users can request
account deletion **without logging in**, even for apps with no
account. For Deal Breaker (no account), the URL should explain how
the in-app reset works:

`[MARKETING_URL]/delete-data` → page that says:

> Deal Breaker stores all data on your device. To delete your data:
> open the app → Settings → Reset Everything. The data is wiped from
> device storage instantly. We never had a copy on a server, so
> there is nothing else to delete.
> 
> If you also want to stop your subscription billing, manage it
> through Google Play → your subscriptions.
> 
> For questions, email [SUPPORT_EMAIL].

Even though we have no server-side data, Play requires this page to
exist. Add it as a markdown file: `store/legal/delete-data.md`.
