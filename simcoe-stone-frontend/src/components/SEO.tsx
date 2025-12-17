import React, { useEffect } from 'react';
import { generatePageTitle, generateMetaDescription } from '../utils/autoSEO';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogType?: string;
  ogImage?: string;
  ogImageAlt?: string;
  twitterCard?: string;
  noIndex?: boolean;
  pageType?: 'home' | 'services' | 'contact' | 'emergency' | 'about';
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords = 'stone masonry, custom stonework, masonry repairs, emergency masonry, Ontario masonry, stonemason, fireplace construction, retaining walls',
  canonicalUrl = 'https://stonemasonry.ca',
  ogType = 'website',
  ogImage = '/images/og-image.jpg',
  ogImageAlt = 'STONEMASONRY.CA - Expert stonework services',
  twitterCard = 'summary_large_image',
  noIndex = false,
  pageType = 'home'
}) => {
  // Auto-generate SEO content if not provided
  const autoTitle = title || generatePageTitle(pageType);
  const autoDescription = description || generateMetaDescription(pageType);

  useEffect(() => {
    // Update document title with auto-generated content
    document.title = autoTitle;

    // Function to update or create meta tag
    const updateMetaTag = (name: string, content: string, isProperty: boolean = false) => {
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;

      if (!meta) {
        meta = document.createElement('meta');
        if (isProperty) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Basic meta tags with auto-generated content
    updateMetaTag('description', autoDescription);
    updateMetaTag('keywords', keywords);

    // Robots meta tag
    updateMetaTag('robots', noIndex ? 'noindex, nofollow' : 'index, follow');

    // Open Graph meta tags with auto-generated content
    updateMetaTag('og:title', autoTitle, true);
    updateMetaTag('og:description', autoDescription, true);
    updateMetaTag('og:type', ogType, true);
    updateMetaTag('og:url', canonicalUrl, true);
    updateMetaTag('og:image', `${window.location.origin}${ogImage}`, true);
    updateMetaTag('og:image:alt', ogImageAlt, true);
    updateMetaTag('og:site_name', 'STONEMASONRY.CA', true);
    updateMetaTag('og:locale', 'en_CA', true);

    // Twitter Card meta tags with auto-generated content
    updateMetaTag('twitter:card', twitterCard);
    updateMetaTag('twitter:title', autoTitle);
    updateMetaTag('twitter:description', autoDescription);
    updateMetaTag('twitter:image', `${window.location.origin}${ogImage}`);
    updateMetaTag('twitter:image:alt', ogImageAlt);

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    // Additional SEO meta tags
    updateMetaTag('author', 'STONEMASONRY.CA');
    updateMetaTag('viewport', 'width=device-width, initial-scale=1');
    updateMetaTag('theme-color', '#8B5A3C'); // Brand brown color

    // Language and region
    updateMetaTag('language', 'en');
    updateMetaTag('geo.region', 'CA-ON');
    updateMetaTag('geo.placename', 'Ontario, Canada');

    // Business-specific meta tags
    updateMetaTag('business:contact_data:street_address', '123 Stone Way');
    updateMetaTag('business:contact_data:locality', 'Barrie');
    updateMetaTag('business:contact_data:region', 'Ontario');
    updateMetaTag('business:contact_data:postal_code', 'L4M 2A1');
    updateMetaTag('business:contact_data:country_name', 'Canada');
    updateMetaTag('business:contact_data:phone_number', '+17053415285');

  }, [autoTitle, autoDescription, keywords, canonicalUrl, ogType, ogImage, ogImageAlt, twitterCard, noIndex, pageType]);

  return null; // This component doesn't render anything visible
};

export default SEO;
