// Mobile Optimization Utilities
// Enhances mobile experience and performance

import React, { useState, useEffect } from 'react';

// Mobile detection hook
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};

// Mobile-optimized image component
export const MobileOptimizedImage: React.FC<{
  src: string;
  mobileSrc?: string;
  alt: string;
  className?: string;
  lazy?: boolean;
}> = ({ src, mobileSrc, alt, className = '', lazy = true }) => {
  const isMobile = useIsMobile();
  const imageSrc = isMobile && mobileSrc ? mobileSrc : src;

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      loading={lazy ? 'lazy' : 'eager'}
      style={{ 
        maxWidth: '100%', 
        height: 'auto',
        objectFit: 'cover'
      }}
    />
  );
};

// Mobile-friendly contact buttons
export const MobileContactButtons: React.FC = () => {
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 flex gap-2">
      <a
        href="tel:+17053415285"
        className="flex-1 bg-green-600 text-white text-center py-3 rounded-lg font-semibold shadow-lg flex items-center justify-center"
        onClick={() => {
          // Track mobile phone click
          if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'mobile_phone_click', {
              event_category: 'mobile_engagement',
              event_label: 'phone_button'
            });
          }
        }}
      >
        📞 Call Now
      </a>
      <a
        href="/consultation"
        className="flex-1 bg-red-600 text-white text-center py-3 rounded-lg font-semibold shadow-lg flex items-center justify-center"
        onClick={() => {
          // Track mobile quote click
          if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'mobile_quote_click', {
              event_category: 'mobile_engagement',
              event_label: 'quote_button'
            });
          }
        }}
      >
        💬 Consultation
      </a>
    </div>
  );
};

// Mobile navigation enhancement
export const MobileMenuButton: React.FC<{
  isOpen: boolean;
  onClick: () => void;
}> = ({ isOpen, onClick }) => {
  return (
    <button
      className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1"
      onClick={onClick}
      aria-label="Toggle mobile menu"
    >
      <span 
        className={`block h-0.5 w-6 bg-slate-800 transition-transform duration-300 ${
          isOpen ? 'rotate-45 translate-y-1.5' : ''
        }`}
      />
      <span 
        className={`block h-0.5 w-6 bg-slate-800 transition-opacity duration-300 ${
          isOpen ? 'opacity-0' : ''
        }`}
      />
      <span 
        className={`block h-0.5 w-6 bg-slate-800 transition-transform duration-300 ${
          isOpen ? '-rotate-45 -translate-y-1.5' : ''
        }`}
      />
    </button>
  );
};

// Touch-friendly components
export const TouchFriendlyButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'emergency';
}> = ({ children, onClick, href, className = '', variant = 'primary' }) => {
  const baseClasses = 'min-h-[44px] px-6 py-3 rounded-lg font-semibold transition-colors duration-200 text-center flex items-center justify-center';
  
  const variantClasses = {
    primary: 'bg-red-600 text-white hover:bg-red-700',
    secondary: 'bg-slate-600 text-white hover:bg-slate-700',
    emergency: 'bg-orange-600 text-white hover:bg-orange-700'
  };

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

  if (href) {
    return (
      <a href={href} className={buttonClasses}>
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={buttonClasses}>
      {children}
    </button>
  );
};

// Performance optimization for mobile
export const MobilePerformanceOptimizer: React.FC = () => {
  useEffect(() => {
    // Optimize for mobile performance
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      // Reduce animation complexity on mobile
      document.documentElement.style.setProperty('--animation-duration', '0.2s');
      
      // Preload critical mobile resources
      const preloadMobileAssets = () => {
        const mobileAssets = [
          '/images/mobile-hero.jpg',
          '/images/mobile-logo.png'
        ];

        mobileAssets.forEach(asset => {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'image';
          link.href = asset;
          document.head.appendChild(link);
        });
      };

      preloadMobileAssets();

      // Optimize scroll performance
      let ticking = false;
      const optimizedScroll = () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            // Perform scroll-based optimizations
            ticking = false;
          });
          ticking = true;
        }
      };

      window.addEventListener('scroll', optimizedScroll, { passive: true });
      
      return () => {
        window.removeEventListener('scroll', optimizedScroll);
      };
    }
  }, []);

  return null;
};

// Viewport meta tag optimizer
export const ViewportOptimizer: React.FC = () => {
  useEffect(() => {
    // Ensure proper viewport meta tag for mobile
    let viewportMeta = document.querySelector('meta[name="viewport"]') as HTMLMetaElement;
    
    if (!viewportMeta) {
      viewportMeta = document.createElement('meta');
      viewportMeta.name = 'viewport';
      document.head.appendChild(viewportMeta);
    }
    
    viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes';

    // Add mobile-specific meta tags
    const mobileMetaTags = [
      { name: 'format-detection', content: 'telephone=yes' },
      { name: 'mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
      { name: 'theme-color', content: '#dc2626' }
    ];

    mobileMetaTags.forEach(tag => {
      if (!document.querySelector(`meta[name="${tag.name}"]`)) {
        const meta = document.createElement('meta');
        meta.name = tag.name;
        meta.content = tag.content;
        document.head.appendChild(meta);
      }
    });
  }, []);

  return null;
};

const MobileOptimization = {
  useIsMobile,
  MobileOptimizedImage,
  MobileContactButtons,
  MobileMenuButton,
  TouchFriendlyButton,
  MobilePerformanceOptimizer,
  ViewportOptimizer
};

export default MobileOptimization;
