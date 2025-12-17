import React, { useEffect } from 'react';

interface LocalBusinessStructuredDataProps {
  businessName?: string;
  description?: string;
  telephone?: string;
  address?: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo?: {
    latitude: string;
    longitude: string;
  };
  priceRange?: string;
  sameAs?: string[];
  openingHours?: string[];
  image?: string;
  services?: string[];
}

const StructuredData: React.FC<LocalBusinessStructuredDataProps> = ({
  businessName = 'STONEMASONRY.CA',
  description = 'Expert stone masonry services including custom stonework, repairs, and 24/7 emergency services for residential and commercial properties across Ontario.',
  telephone = '+17053415285',
  address = {
    streetAddress: '123 Stone Way',
    addressLocality: 'Barrie',
    addressRegion: 'ON',
    postalCode: 'L4M 2A1',
    addressCountry: 'CA'
  },
  geo = {
    latitude: '44.3894',
    longitude: '-79.6903'
  },
  priceRange = '$$',
  sameAs = [
    'https://www.facebook.com/stonemasonrycom',
    'https://www.instagram.com/stonemasonry',
    'https://www.linkedin.com/company/stone-masonry'
  ],
  openingHours = [
    'Monday-Friday 07:00-19:00',
    'Saturday 08:00-16:00'
  ],
  image = '/images/stone-masonry-logo.png',
  services = [
    'Custom Stonework',
    'Stone Repairs',
    'Emergency Masonry Services',
    'Fireplace Construction',
    'Retaining Walls',
    'Patio Construction',
    'Walkway Installation',
    'Stone Restoration'
  ]
}) => {
  useEffect(() => {
    // Create structured data JSON-LD
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": "https://stonemasonry.ca",
      "name": businessName,
      "description": description,
      "url": "https://stonemasonry.ca",
      "telephone": telephone,
      "priceRange": priceRange,
      "image": image,
      "sameAs": sameAs,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": address.streetAddress,
        "addressLocality": address.addressLocality,
        "addressRegion": address.addressRegion,
        "postalCode": address.postalCode,
        "addressCountry": address.addressCountry
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": geo.latitude,
        "longitude": geo.longitude
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
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Masonry Services",
        "itemListElement": services.map(service => ({
          "@type": "OfferCatalog",
          "name": service
        }))
      },
      "serviceArea": {
        "@type": "GeoCircle",
        "geoMidpoint": {
          "@type": "GeoCoordinates",
          "latitude": geo.latitude,
          "longitude": geo.longitude
        },
        "geoRadius": "100000"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "127"
      }
    };

    // Remove existing structured data script if it exists
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Create and append new structured data script
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

    // Cleanup function to remove script when component unmounts
    return () => {
      const scriptToRemove = document.querySelector('script[type="application/ld+json"]');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [businessName, description, telephone, address, geo, priceRange, sameAs, openingHours, image, services]);

  return null; // This component doesn't render anything
};

export default StructuredData;
