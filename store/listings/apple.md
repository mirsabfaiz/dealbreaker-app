# Apple App Store listing — App Store Connect

Paste these into the corresponding fields in App Store Connect.

## Bundle ID
`com.mirsabfaiz.dealbreaker` (already set in Xcode project)

## App name (30 chars max)
**Deal Breaker**

## Subtitle (30 chars max)
**A private recovery tracker.**
*(28 chars — verify)*

## Promotional text (170 chars, can change without re-submission)
**Multi-addiction recovery tracking that respects your privacy. No
account, no public feed — just a calm space for the daily work. 14-day
free trial.**
*(156 chars — verify)*

## Description (4000 chars max)
*(See `shared.md` Long description. Confirm under 4000 chars after
any edits.)*

## Keywords (100 chars max, comma-separated, no spaces after commas)
*(See `shared.md`)*

## Support URL
`[SUPPORT_URL]`

## Marketing URL (optional but recommended)
`[MARKETING_URL]`

## Privacy Policy URL
`[PRIVACY_POLICY_URL]`

## Categories
- Primary: **Health & Fitness**
- Secondary: **Lifestyle**

## Age rating
17+ — substance use references; no explicit content. Run the
questionnaire honestly:

- Frequent/Intense Realistic Violence → No
- Frequent/Intense Cartoon or Fantasy Violence → No
- Frequent/Intense Profanity or Crude Humor → No
- Frequent/Intense Mature/Suggestive Themes → **Yes** (recovery / addiction discussion)
- Frequent/Intense Horror/Fear Themes → No
- Frequent/Intense Medical/Treatment Information → **Yes**
- Frequent/Intense Alcohol, Tobacco, or Drug Use or References → **Yes** (the entire premise)
- Frequent/Intense Simulated Gambling → No
- Frequent/Intense Sexual Content or Nudity → No
- Frequent/Intense Graphic Sexual Content and Nudity → No
- Made for Kids → No
- Unrestricted Web Access → No
- Gambling and Contests → No

This will produce a **17+** rating, which is appropriate.

## App Privacy (Privacy Nutrition Label)

**Data Used to Track You:** **None**.

**Data Linked to You:** **None**.

**Data Not Linked to You:**
- Purchases (subscription receipt) — required for app functionality
- (Nothing else)

When asked which data type each category covers:
- The receipt corresponds to "Purchases" → "Subscription history."
- It is collected because Apple's StoreKit / your receipt validator
  requires it. Linked to identity? No (the receipt is anonymous to
  us; Apple knows the user, we don't).
- Used for tracking? No.
- Required for app functionality? Yes.

**No other data category should be checked.** You are not collecting
journal entries, contact info, identifiers, location, financial info
beyond the receipt itself, health data on a server, etc.

## App Review Information

### Sign-in required?
No

### Demo account
Not applicable. The app has no login.

### Notes for the reviewer
```
Deal Breaker is a fully local-first recovery tracker. No account,
no login, no server. All user data is stored exclusively on the
device. The only network call is the StoreKit receipt validation
during/after the free trial.

To test the full feature set without subscribing, please use the
"Reset Everything" option in Settings to start over, then walk
through the setup flow.

The app discusses substance use and recovery throughout. This is
intentional and central to the product. A health disclaimer is
shown to first-time users and is accessible at any time via
Settings → Privacy & policies → Health disclaimer.

We are aware of Apple's enhanced review under section 5.1.2(iii)
for health-adjacent apps. The app does not provide medical advice,
diagnosis, or treatment recommendations. The disclaimer makes this
explicit and points users to crisis resources (988 in the US).
```

### Contact information
Phone, email, name — fill in your actual contact info.

## Subscription configuration (when ready)

In App Store Connect → Features → In-App Purchases:

- Type: **Auto-Renewable Subscription**
- Subscription Group: "Deal Breaker Premium"
- Reference Name: "Monthly"
- Product ID: `com.mirsabfaiz.dealbreaker.monthly`
- Subscription duration: **1 month**
- Free trial: **2 weeks** (Apple's standard option)
- Price: **$4.99/month** (US base, Apple sets equivalent global pricing)

### Subscription review information
- Localization: English (start with US)
- Display name: **Deal Breaker Monthly**
- Description: "Full access to Deal Breaker — multi-addiction tracking, craving timers, journal, insights, and themes. Cancel anytime."
- Promotional image: optional (1024×1024 of subscription value prop)

### Subscription privacy / terms

App Store requires a privacy policy URL and (recommended) a terms
URL on the subscription itself. Use [PRIVACY_POLICY_URL] and
[TERMS_URL].

## Required text in description per Apple guidelines

Apple now requires that any auto-renewable subscription has the
following information visible **inside the app and in the App Store
description**:

- Length of subscription (1 month)
- Price (US$4.99)
- Title of publication / service ("Deal Breaker Monthly")
- That payment is charged to Apple ID account
- That the subscription auto-renews unless turned off at least 24
  hours before the end of the current period
- That account will be charged for renewal within 24 hours prior to
  the end of the current period
- That subscriptions can be managed by the user
- Links to Privacy Policy and Terms of Service

A copy of this text is in `subscription-disclosure.md` and should be
embedded both in the in-app paywall screen and as the last paragraph
of the App Store description.
