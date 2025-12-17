// Auto-updating JSON-LD structured data injector
// Automatically maintains and updates structured data without manual intervention

import React, { useEffect } from 'react';
import { generateAutoStructuredData } from '../utils/autoSEO';

interface AutoStructuredDataProps {
  pageType?: 'home' | 'services' | 'contact' | 'emergency' | 'about';
}

const AutoStructuredData: React.FC<AutoStructuredDataProps> = ({ pageType = 'home' }) => {
  useEffect(() => {
    // Remove any existing structured data
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Generate fresh structured data
    const structuredData = generateAutoStructuredData();

    // Add page-specific structured data based on pageType
    const pageSpecificData = getPageSpecificData(pageType);
    const combinedData = [structuredData, ...pageSpecificData];

    // Inject new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(combinedData);
    document.head.appendChild(script);

    // Cleanup on unmount
    return () => {
      const scriptToRemove = document.querySelector('script[type="application/ld+json"]');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [pageType]);

  return null; // This component doesn't render anything
};

// Auto-generate page-specific structured data
const getPageSpecificData = (pageType: string) => {

  switch (pageType) {
    case 'services':
      return [{
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Professional STONEMASONRY.CA Services",
        "provider": {
          "@type": "LocalBusiness",
          "name": "STONEMASONRY.CA"
        },
        "serviceType": "Stone Masonry",
        "areaServed": ["Barrie, ON", "Ontario (province-wide)", "Muskoka Region"],
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Stone Masonry Services",
          "itemListElement": [
            { "@type": "Offer", "name": "Fireplace Installation" },
            { "@type": "Offer", "name": "Stone Patios" },
            { "@type": "Offer", "name": "Retaining Walls" },
            { "@type": "Offer", "name": "Emergency Stone Repair" }
          ]
        }
      }];

    case 'contact':
      return [{
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "name": "Contact STONEMASONRY.CA",
        "description": "Get your free stone masonry quote today",
        "mainEntity": {
          "@type": "LocalBusiness",
          "name": "STONEMASONRY.CA",
          "telephone": "+1-705-341-5285"
        }
      }];

    case 'emergency':
      return [{
        "@context": "https://schema.org",
        "@type": "EmergencyService",
        "name": "24/7 Emergency Stone Repair",
        "provider": {
          "@type": "LocalBusiness",
          "name": "STONEMASONRY.CA"
        },
        "serviceType": "Emergency Stone Repair",
        "availableChannel": {
          "@type": "ServiceChannel",
          "availableLanguage": "en",
          "servicePhone": "+1-705-341-5285"
        }
      }];

    case 'about':
      return [{
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "name": "About STONEMASONRY.CA",
        "description": "Professional stone masonry contractor serving Ontario since 2008",
        "mainEntity": {
          "@type": "LocalBusiness",
          "name": "STONEMASONRY.CA",
          "foundingDate": "2008"
        }
      }];

    default: // home page
      return [{
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "STONEMASONRY.CA",
        "url": "https://stonemasonry.ca",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://stonemasonry.ca/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }];
  }
};

export default AutoStructuredData;
