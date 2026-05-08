# Placeholders to replace before publishing

Search the entire `store/` directory (and `src/App.jsx` for in-app
references) for each token below. Replace once each token is finalized.

| Token | What it stands for | Replace when |
|---|---|---|
| `[LEGAL_ENTITY_NAME]` | Your LLC's full registered name, or your personal name if shipping as sole proprietor | LLC formed (or you decide to ship in your name) |
| `[LEGAL_ENTITY_ADDRESS]` | The mailing address registered with the LLC, or a P.O. box. Required by GDPR. | Same as above |
| `[LEGAL_ENTITY_JURISDICTION]` | "Delaware, USA" / "California, USA" / etc. — where the entity is registered | Same as above |
| `[SUPPORT_EMAIL]` | The email where users reach support — likely `support@dealbreakerapp.com` once domain is registered | Domain + email forwarding set up |
| `[PRIVACY_POLICY_URL]` | Final hosted URL of `legal/privacy-policy.md`, e.g. `https://dealbreakerapp.com/privacy-policy` | Hosting deployed |
| `[TERMS_URL]` | Same for `legal/terms-of-service.md` | Hosting deployed |
| `[SUPPORT_URL]` | A landing page or FAQ URL where users find help, e.g. `https://dealbreakerapp.com/support` | Hosting deployed |
| `[MARKETING_URL]` | The marketing site root, e.g. `https://dealbreakerapp.com` | Hosting deployed |
| `[EFFECTIVE_DATE]` | The date the privacy policy / ToS first goes live publicly. Use ISO format `2026-MM-DD`. | First publish |
| `[LAST_UPDATED]` | Same format. Update whenever you materially change the docs. | Each material change |

## In-code references

The same tokens appear in `src/App.jsx` for in-app links. Search-and-replace
needs to cover that file too. Best places to look:

- Settings → "Privacy & policies" card (added in this branch)
- Health disclaimer modal text
- Onboarding card legal references
