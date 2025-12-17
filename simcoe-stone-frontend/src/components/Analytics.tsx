// Analytics Integration - Track website performance and conversions
// Includes Google Analytics, conversion tracking, and performance monitoring

import React, { useEffect } from 'react';

interface AnalyticsProps {
  trackingId?: string;
  userId?: string;
}

const Analytics: React.FC<AnalyticsProps> = ({ 
  trackingId = 'G-XXXXXXXXXX', // Replace with actual GA4 tracking ID
  userId 
}) => {
  useEffect(() => {
    // Initialize Google Analytics
    if (typeof window !== 'undefined' && trackingId !== 'G-XXXXXXXXXX') {
      // Load Google Analytics script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
      document.head.appendChild(script);

      // Initialize gtag
      (window as any).dataLayer = (window as any).dataLayer || [];
      const gtag = (...args: any[]) => {
        (window as any).dataLayer.push(args);
      };
      (window as any).gtag = gtag;

      gtag('js', new Date());
      gtag('config', trackingId, {
        user_id: userId,
        custom_map: {
          custom_parameter_1: 'stone_masonry_service'
        }
      });

      // Track initial page view
      gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        content_group1: 'Stone Masonry Website'
      });
    }

    // Helper function for analytics
    const sendToAnalytics = (metric: any) => {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', metric.name, {
          event_category: 'Web Vitals',
          event_label: metric.id,
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          non_interaction: true
        });
      }
    };

    // Initialize performance monitoring
    if ('web-vital' in window) {
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(sendToAnalytics);
        getFID(sendToAnalytics);
        getFCP(sendToAnalytics);
        getLCP(sendToAnalytics);
        getTTFB(sendToAnalytics);
      });
    }

    // Track scroll depth
    let maxScroll = 0;
    const trackScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      
      if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
        maxScroll = scrollPercent;
        trackEvent('scroll_depth', {
          event_category: 'engagement',
          event_label: `${scrollPercent}%`,
          value: scrollPercent
        });
      }
    };

    // Track time on page
    const startTime = Date.now();
    const trackTimeOnPage = () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      trackEvent('time_on_page', {
        event_category: 'engagement',
        event_label: 'seconds',
        value: timeSpent
      });
    };

    // Add event listeners
    window.addEventListener('scroll', trackScroll, { passive: true });
    window.addEventListener('beforeunload', trackTimeOnPage);
    
    // Cleanup function
    return () => {
      window.removeEventListener('scroll', trackScroll);
      window.removeEventListener('beforeunload', trackTimeOnPage);
    };

  }, [trackingId, userId]);

  return null; // This component doesn't render anything
};

// Helper function to track custom events
export const trackEvent = (eventName: string, parameters: any = {}) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, parameters);
  }
};

// Track business-specific events
export const trackBusinessEvent = (eventType: string, data: any = {}) => {
  const businessEvents = {
    quote_request: {
      event_category: 'lead_generation',
      event_label: 'quote_form_submission',
      value: 1
    },
    phone_call: {
      event_category: 'lead_generation', 
      event_label: 'phone_click',
      value: 1
    },
    emergency_contact: {
      event_category: 'emergency_service',
      event_label: 'emergency_button_click',
      value: 1
    },
    portfolio_view: {
      event_category: 'engagement',
      event_label: 'portfolio_interaction',
      value: 1
    },
    service_interest: {
      event_category: 'interest',
      event_label: data.service_type || 'general',
      value: 1
    }
  };

  const eventData = businessEvents[eventType as keyof typeof businessEvents];
  if (eventData) {
    trackEvent(eventType, { ...eventData, ...data });
  }
};

// Track conversion events
export const trackConversion = (conversionType: string, value?: number) => {
  trackEvent('conversion', {
    event_category: 'conversions',
    event_label: conversionType,
    value: value || 1
  });
  
  // Also send to Google Ads conversion tracking if available
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'conversion', {
      send_to: 'AW-CONVERSION_ID/CONVERSION_LABEL', // Replace with actual conversion tracking
      value: value || 1,
      currency: 'CAD'
    });
  }
};

// Performance tracking component
export const PerformanceTracker: React.FC = () => {
  useEffect(() => {
    // Track page load performance
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        trackEvent('page_load_time', {
          event_category: 'performance',
          event_label: 'load_complete',
          value: Math.round(perfData.loadEventEnd - perfData.fetchStart)
        });
        
        trackEvent('dom_content_loaded', {
          event_category: 'performance',
          event_label: 'dom_ready',
          value: Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart)
        });
      }, 0);
    });
  }, []);

  return null;
};

export default Analytics;
