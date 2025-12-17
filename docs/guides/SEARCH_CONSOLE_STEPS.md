# Google Search Console Action Steps

## 1. Add & Verify Property
- Open: https://search.google.com/search-console
- Click: Add Property > Domain (preferred) > enter `stonemasonry.ca`
- DNS Verify: Add provided TXT record at domain host (Cloudflare/Registrar). Wait for propagation (use `nslookup -type=TXT stonemasonry.ca`).

## 2. Set Preferred Domain & Targeting
- Ensure canonical pages resolve at `https://stonemasonry.ca` (no www variant). 301 redirect any alternates.
- International Targeting: Leave default (Canada inferred via `en_CA` locale + hosting).

## 3. Submit Updated Sitemap
- Navigate: Indexing > Sitemaps
- Enter: `https://stonemasonry.ca/sitemap.xml`
- Submit and confirm status becomes Success.

## 4. Inspect High-Value URLs
Use URL Inspection for:
- `/`
- `/emergency-repair`
- `/services/fireplace-installation`
- `/service-areas/barrie-stone-masonry`
- `/all-services`
If “URL is on Google” shows outdated HTML, Click: REQUEST INDEXING.

## 5. Trigger Reindex After Major Changes
Batch (limit ~10/day):
1. URL Inspection > Enter URL
2. TEST LIVE URL
3. If Passed: REQUEST INDEXING

Priority Order: Home > Emergency Repair > New Service Pages > Service Area Pages > All Services > About > FAQ.

## 6. Coverage & Enhancements Monitoring
- Check: Pages (Indexing > Pages) for Excluded or Crawled - currently not indexed.
- Fix any soft 404s (ensure new dynamic service pages return 200 and substantive content).
- Enhancements: Validate `Breadcrumb`, `FAQ` (if used on pages), `ItemList` (services) in Search Console Enhancements.

## 7. Performance Benchmarks
- Compare pre-change vs post-change: Queries for `stone masonry ontario`, `emergency stone repair`, `fireplace installation barrie`.
- Set date comparison: Last 28 days vs Previous Period after 2–3 weeks.

## 8. Page Experience / Core Web Vitals
- Use PageSpeed Insights for `/` and one service page. Optimize any CLS > 0.1 or LCP > 2.5s (consider image compression & `preload` for hero font if needed).

## 9. Log Anomalies
Maintain a simple log (date, URL, action, status) in `SEO_ACTION_LOG.md` to track reindex requests.

## 10. Recrawl Triggers
Trigger reindex when:
- New service/service-area page added
- Substantial copy changes (>25% text)
- Structural data schema expansion
- Navigation changes altering internal linking distribution

---
**Fast Checklist**
[ ] DNS Verified Domain Property
[ ] Sitemap Submitted (green status)
[ ] 10 Priority URLs Requested for Indexing
[ ] No Server Errors (Coverage report)
[ ] Enhancements Valid (Breadcrumb, ItemList, LocalBusiness)
[ ] Performance Benchmarked Initial Snapshot
