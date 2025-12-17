import React from 'react';
import { Helmet } from 'react-helmet-async';

interface AdvancedSEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  serviceType?: string;
  breadcrumbs?: Array<{ name: string; url: string }>;
  faqData?: Array<{ question: string; answer: string }>;
  reviewData?: {
    ratingValue: string;
    reviewCount: string;
    bestRating?: string;
    worstRating?: string;
  };
}

const AdvancedSEO: React.FC<AdvancedSEOProps> = ({
  title = "STONEMASONRY.CA - Expert Stone Work & 24/7 Emergency Repairs | Canada",
  description = "Award-winning stone masonry services across Ontario. Custom stonework, emergency repairs, fireplaces, retaining walls. Licensed, insured, 20+ years experience. Call (705) 341-5285.",
  keywords = [
    "stone masonry Ontario",
    "stone repair emergency",
    "fireplace installation Barrie",
    "retaining wall construction",
    "custom stonework",
    "masonry contractor Ontario",
    "stone restoration",
    "chimney repair",
    "brick repair",
    "patio construction",
    "walkway installation",
    "heritage stone restoration",
    "commercial masonry",
    "residential stonework"
  ],
  canonicalUrl = "https://stonemasonry.ca",
  ogImage = "/images/og-stone-masonry.jpg",
  serviceType,
  breadcrumbs = [],
  faqData = [],
  reviewData = {
    ratingValue: "4.9",
    reviewCount: "127",
    bestRating: "5",
    worstRating: "1"
  }
}) => {
  const businessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://stonemasonry.ca",
    "name": "STONEMASONRY.CA",
    "alternateName": ["Stone Masonry", "STONEMASONRY.CA", "SSM"],
    "description": "Professional stone masonry services including custom stonework, emergency repairs, and restoration across Ontario. Specializing in fireplaces, retaining walls, patios, and heritage stone restoration.",
    "url": "https://stonemasonry.ca",
    "telephone": "+17053415285",
    "email": "info@stonemasonry.ca",
    "priceRange": "$$",
    "paymentAccepted": ["Cash", "Credit Card", "Check", "Bank Transfer"],
    "currenciesAccepted": "CAD",
    "logo": {
      "@type": "ImageObject",
      "url": "https://stonemasonry.ca/images/logo.jpg",
      "width": 300,
      "height": 150
    },
    "image": [
      "https://stonemasonry.ca/images/portfolio/fireplace-custom-stone.jpg",
      "https://stonemasonry.ca/images/portfolio/retaining-wall-natural-stone.jpg",
      "https://stonemasonry.ca/images/portfolio/patio-interlocking-stone.jpg"
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Serving All of Ontario",
      "addressLocality": "Barrie",
      "addressRegion": "ON",
      "postalCode": "L4M 2A1",
      "addressCountry": "CA"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "44.3894",
      "longitude": "-79.6903"
    },
    "areaServed": [
      {
        "@type": "City",
        "name": "Barrie",
        "sameAs": "https://en.wikipedia.org/wiki/Barrie"
      },
      {
        "@type": "City",
        "name": "Midland",
        "sameAs": "https://en.wikipedia.org/wiki/Midland,_Ontario"
      },
      {
        "@type": "City",
        "name": "Orillia",
        "sameAs": "https://en.wikipedia.org/wiki/Orillia"
      },
      {
        "@type": "City",
        "name": "Collingwood",
        "sameAs": "https://en.wikipedia.org/wiki/Collingwood,_Ontario"
      }
    ],
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": "44.3894",
        "longitude": "-79.6903"
      },
      "geoRadius": "150000"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Stone Masonry Services",
      "itemListElement": [
        {
          "@type": "Service",
          "name": "24/7 Emergency Stone Repair",
          "description": "Immediate response for emergency stone and masonry repairs",
          "provider": {
            "@type": "LocalBusiness",
            "name": "STONEMASONRY.CA"
          }
        },
        {
          "@type": "Service",
          "name": "Custom Fireplace Installation",
          "description": "Design and installation of custom stone fireplaces",
          "provider": {
            "@type": "LocalBusiness",
            "name": "STONEMASONRY.CA"
          }
        },
        {
          "@type": "Service",
          "name": "Retaining Wall Construction",
          "description": "Professional retaining wall design and construction",
          "provider": {
            "@type": "LocalBusiness",
            "name": "STONEMASONRY.CA"
          }
        },
        {
          "@type": "Service",
          "name": "Heritage Stone Restoration",
          "description": "Specialized restoration of historic stone structures",
          "provider": {
            "@type": "LocalBusiness",
            "name": "STONEMASONRY.CA"
          }
        }
      ]
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "07:00",
        "closes": "19:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "08:00",
        "closes": "16:00"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": reviewData.ratingValue,
      "reviewCount": reviewData.reviewCount,
      "bestRating": reviewData.bestRating,
      "worstRating": reviewData.worstRating
    },
    "sameAs": [
      "https://www.facebook.com/stonemasonry",
      "https://www.instagram.com/stonemasonry",
      "https://www.linkedin.com/company/stonemasonry",
      "https://www.bbb.org/ca/on/barrie/profile/masonry-contractors"
    ],
    "founder": {
      "@type": "Person",
      "name": "Master Stonemason",
      "jobTitle": "Founder & Master Craftsman"
    },
    "numberOfEmployees": "5-15",
    "yearEstablished": "2003",
    "slogan": "Crafting Stone Legacies Since 2003",
    "knowsAbout": [
      "Natural Stone Installation",
      "Heritage Restoration",
      "Emergency Repair Services",
      "Custom Stonework Design",
      "Masonry Restoration"
    ]
  };

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "https://stonemasonry.ca",
    "name": "STONEMASONRY.CA",
    "alternateName": ["Stone Masonry"],
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://stonemasonry.ca/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "url": "https://stonemasonry.ca",
    "name": "STONEMASONRY.CA",
    "logo": "https://stonemasonry.ca/images/logo-stonemasonry.svg",
    "sameAs": [
      "https://www.facebook.com/stonemasonry",
      "https://www.instagram.com/stonemasonry",
      "https://www.linkedin.com/company/stonemasonry"
    ]
  };

  const breadcrumbSchema = breadcrumbs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  } : null;

  const faqSchema = faqData.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  const serviceSchema = serviceType ? {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": serviceType,
    "provider": {
      "@type": "LocalBusiness",
      "name": "STONEMASONRY.CA",
      "url": "https://stonemasonry.ca"
    },
    "serviceType": serviceType,
    "areaServed": "Ontario, Canada"
  } : null;

  const serviceListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Primary Stone Masonry Services",
    "itemListOrder": "https://schema.org/ItemListUnordered",
    "numberOfItems": 10,
    "itemListElement": [
      "24/7 Emergency Stone Repair",
      "Custom Fireplace Installation",
      "Retaining Wall Construction",
      "Heritage Stone Restoration",
      "Chimney Repair & Rebuilds",
      "Natural Stone Patios & Walkways",
      "Stone Veneer Installation",
      "Foundation & Structural Masonry Repair",
      "Outdoor Living Spaces (Kitchens, Fire Pits)",
      "Commercial Stonework"
    ].map((service, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Service",
        "name": service,
        "provider": {
          "@type": "LocalBusiness",
          "name": "STONEMASONRY.CA",
          "@id": "https://stonemasonry.ca#business"
        },
        "areaServed": {
          "@type": "AdministrativeArea",
          "name": "Ontario"
        }
      }
    }))
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Advanced Meta Tags */}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="STONEMASONRY.CA" />
      <meta property="og:locale" content="en_CA" />
      <meta property="og:updated_time" content={new Date().toISOString()} />
      <meta name="twitter:site" content="@stonemasonry" />
      <meta name="twitter:creator" content="@stonemasonry" />
      <link rel="alternate" href="https://stonemasonry.ca" hrefLang="en-ca" />
      <link rel="alternate" href="https://stonemasonry.ca" hrefLang="x-default" />
      <link rel="sitemap" type="application/xml" href="https://stonemasonry.ca/sitemap.xml" />
      <link rel="preload" as="image" href="/images/logo-stonemasonry.svg" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />

      {/* Twitter Card */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />

      {/* Business Specific */}
      <meta name="geo.region" content="CA-ON" />
      <meta name="geo.placename" content="Barrie, Ontario" />
      <meta name="geo.position" content="44.3894;-79.6903" />
      <meta name="ICBM" content="44.3894, -79.6903" />

      {/* Performance & Technical */}
      <meta httpEquiv="x-dns-prefetch-control" content="on" />
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      {/* Schema.org structured data */}
      <script type="application/ld+json">
        {JSON.stringify(businessSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(webSiteSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>

      {breadcrumbSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}

      {faqSchema && (
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      )}

      {serviceSchema && (
        <script type="application/ld+json">
          {JSON.stringify(serviceSchema)}
        </script>
      )}
      <script type="application/ld+json">
        {JSON.stringify(serviceListSchema)}
      </script>
    </Helmet>
  );
};

export default AdvancedSEO;
