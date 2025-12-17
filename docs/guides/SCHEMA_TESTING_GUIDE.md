# Structured Data Testing & Validation Guide

## 1. Primary Tools
- Google Rich Results Test: https://search.google.com/test/rich-results
- Schema.org Validator: https://validator.schema.org/
- SERP Simulator (optional): https://technicalseo.com/tools/schema-markup-generator/
- Chrome DevTools: View Source & Elements > search `ld+json`

## 2. Core Schemas Implemented
| Schema Type | Source File | Purpose |
|-------------|-------------|---------|
| LocalBusiness | `AdvancedSEO.tsx` | Entity identity & NAP consistency |
| Organization | `AdvancedSEO.tsx` | Brand authority & social profiles |
| WebSite + SearchAction | `AdvancedSEO.tsx` | Eligible site search enhancement |
| OfferCatalog + Service | `AdvancedSEO.tsx` | Service vertical reinforcement |
| ItemList (Primary Services) | `AdvancedSEO.tsx` | Topical breadth & internal link mapping |
| BreadcrumbList | Dynamic via props | Contextual hierarchy |
| FAQPage (optional when passed) | Via `faqData` | Rich result FAQ eligibility |
| Service (page-level) | `ServicePage.tsx` via props | Individual service intent |

## 3. Validation Workflow (Per Template)
1. Open page (e.g. `https://stonemasonry.ca/services/fireplace-installation`).
2. Right-click > View Page Source.
3. Find `ld+json` blocks; copy each into validator.
4. Confirm no errors; warnings acceptable if non-critical (e.g., missing `image` on some Services).
5. Run Rich Results Test; ensure relevant enhancements (Breadcrumbs, FAQ if present) show as valid.

## 4. ItemList Integrity Checks
- Ensure `numberOfItems` matches actual `itemListElement.length`.
- Each `ListItem` includes: `@type`, `position`, nested `Service` with `name` + `provider`.
- Provider `@id` consistency: `https://stonemasonry.ca#business` (if referenced) should align with LocalBusiness root.

## 5. LocalBusiness Mandatory Fields Present
- `@type`, `name`, `@id`, `url`, `address`, `telephone`, `geo`, `aggregateRating`.
- Optional but added: `hasOfferCatalog`, `sameAs`, `openingHoursSpecification`.

## 6. Common Error Resolutions
| Error / Warning | Cause | Fix |
|-----------------|-------|-----|
| Missing `image` | Service items lack imagery | Add `image` property or ignore (non-fatal) |
| Invalid `position` | Non-sequential list index | Regenerate list mapping index+1 |
| Mismatched `alternateName` | Array syntax issue | Ensure valid JSON array strings |
| `aggregateRating` missing fields | Values null or strings | Provide numeric values (convert if needed) |

## 7. FAQPage Eligibility
- Only include FAQ schema on pages where Q&A content is user-visible.
- Avoid site-wide duplication (risk of manual action) — scope to dedicated FAQ page or section.

## 8. Periodic Revalidation Triggers
Re-run schema testing when:
- Adding/removing services
- Modifying LocalBusiness contact info
- Introducing new content types (e.g., `HowTo`, `ImageObject` galleries)
- Deployment of large refactor affecting `<Helmet>` blocks

## 9. Optional Future Enhancements
- Add `Review` objects (individual) referencing `aggregateRating`.
- Implement `HowTo` for DIY stone care guide sections.
- Add `ImageObject` metadata for top portfolio assets (alt, caption, license).
- Introduce `FAQPage` only on `/faq` with curated top 5–8 questions (avoid overstuffing).

## 10. Quick Validation Checklist
[ ] LocalBusiness valid
[ ] Organization valid
[ ] WebSite + SearchAction valid
[ ] ItemList returns all services
[ ] BreadcrumbList present where hierarchical navigation exists
[ ] No critical errors (0 red flags)
[ ] Warnings reviewed (acceptable/intentional)
[ ] Service pages individually show Service schema
