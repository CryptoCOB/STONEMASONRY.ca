// Auto-generating sitemap content - No manual maintenance required
// This creates and maintains the sitemap automatically based on business data

import { generateDynamicSEO } from './autoSEO';

export const generateAutoSitemap = (): string => {
  const seoData = generateDynamicSEO();
  // Updated primary domain to stonemasonry.ca (brand migration from Simcoe Stone Masonry)
  const baseUrl = 'https://stonemasonry.ca';
  const currentDate = new Date().toISOString().split('T')[0];

  // Auto-updating core pages
  const corePages = [
    { url: '', priority: '1.0', changefreq: 'weekly' },
    { url: '/#emergency-repair', priority: '0.9', changefreq: 'weekly' },
    { url: '/contact', priority: '0.9', changefreq: 'monthly' },
    { url: '/portfolio', priority: '0.8', changefreq: 'monthly' },
    { url: '/about', priority: '0.7', changefreq: 'monthly' },
    { url: '/#services', priority: '0.8', changefreq: 'monthly' }
  ];

  // Auto-generating service pages based on current services
  const servicePages = seoData.services.map(service => ({
    url: `/services/${service.toLowerCase().replace(/\s+/g, '-')}`,
    priority: '0.7',
    changefreq: 'monthly'
  }));

  // Auto-generating location pages based on service areas
  const locationPages = seoData.serviceAreas.map(area => ({
    url: `/locations/${area.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    priority: '0.6',
    changefreq: 'monthly'
  }));

  // Auto-generating seasonal content pages
  const currentMonth = new Date().getMonth();
  const seasonalPages = getSeasonalPages(currentMonth);

  // Combine all pages
  const allPages = [...corePages, ...servicePages, ...locationPages, ...seasonalPages];

  // Generate XML
  let sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

  allPages.forEach(page => {
    sitemapXML += `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
  });

  sitemapXML += '</urlset>';
  return sitemapXML;
};

// Auto-generate seasonal pages based on current month
const getSeasonalPages = (month: number) => {
  const seasonalContent = [
    { url: '/seasonal/spring-stone-projects', months: [2, 3, 4, 5] },
    { url: '/seasonal/summer-outdoor-spaces', months: [6, 7, 8] },
    { url: '/seasonal/fall-fireplace-prep', months: [9, 10, 11] },
    { url: '/seasonal/winter-emergency-repair', months: [0, 1, 11] }
  ];

  return seasonalContent
    .filter(content => content.months.includes(month))
    .map(content => ({
      url: content.url,
      priority: '0.6',
      changefreq: 'seasonal' as const
    }));
};

// Auto-generate robots.txt content
export const generateAutoRobots = (): string => {
  const seoData = generateDynamicSEO();

  return `# Stone Masonry - Auto-Generated SEO Robots.txt
# Auto-updated: ${new Date().toISOString().split('T')[0]}

User-agent: *
Allow: /

# Strategic crawling optimization (auto-updated)
${seoData.services.slice(0, 8).map(service =>
    `Allow: /services/${service.toLowerCase().replace(/\s+/g, '-')}`
  ).join('\n')}
${seoData.serviceAreas.slice(0, 6).map(area =>
    `Allow: /locations/${area.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
  ).join('\n')}

# Core pages
Allow: /emergency-repair
Allow: /portfolio
Allow: /about
Allow: /contact

# Block non-essential directories
Disallow: /private/
Disallow: /temp/
Disallow: /admin/
Disallow: /src/
Disallow: /node_modules/
Disallow: /*.json$
Disallow: /*.md$
Disallow: /*.lock$
Disallow: /*.log$
Disallow: /api/
Disallow: /testing/

# Enhanced sitemap reference
Sitemap: https://stonemasonry.ca/sitemap.xml

# Search engine optimizations
User-agent: Googlebot
Crawl-delay: 1
Allow: /images/
Allow: /static/

User-agent: Bingbot
Crawl-delay: 1
Allow: /images/
Allow: /static/

# Social media bots
User-agent: facebookexternalhit
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: LinkedInBot
Allow: /

# SEO tools (controlled access)
User-agent: AhrefsBot
Crawl-delay: 10

User-agent: SemrushBot
Crawl-delay: 10`;
};
