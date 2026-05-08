# Deal Breaker — store launch prep

Everything in this directory is launch-prep material: legal docs to publish,
app store listing copy, asset specs, and the master submission checklist.

## Structure

```
store/
├── README.md                  ← this file
├── CHECKLIST.md               ← master pre-launch checklist
├── PLACEHOLDERS.md            ← list of [BRACKETED_TOKENS] to replace before publishing
├── legal/
│   ├── privacy-policy.md      ← public, required by both stores
│   ├── terms-of-service.md    ← public, recommended
│   └── health-disclaimer.md   ← shown in-app + linked from store listing
└── listings/
    ├── apple.md               ← App Store Connect copy
    ├── google.md              ← Play Console copy
    └── shared.md              ← descriptions used across both stores
```

## How these get used

**Legal docs** publish as static markdown rendered to a Vercel/Netlify/
Cloudflare Pages site. The store-listing forms reference public URLs like
`https://dealbreakerapp.com/privacy-policy`. Until hosting is wired up,
the placeholder URLs in the docs stand in.

**Listing copy** is pasted into App Store Connect (Apple) and Play
Console (Google) at submission time. The shared.md file holds copy used
in both — keep them in sync deliberately.

## ⚠️ Not legal advice

These drafts are pragmatic templates based on what other indie apps in
this category publish. They are **not legal advice**. Before public
launch — especially before subscription billing turns on — have a
lawyer review the privacy policy and terms of service. App stores will
accept these as written, but a lawyer can catch jurisdictional issues
and tighten liability language.

## Update flow

When the LLC is formed, the support email is decided, or the hosted URLs
change, edit `PLACEHOLDERS.md` to track the substitution and search-and-
replace the token across all files in this directory.
