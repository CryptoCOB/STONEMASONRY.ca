import React, { useState, useEffect } from 'react';
import { getOptimizedImageUrl, LazyImageProps, getResponsiveSize } from '../utils/imageOptimizer';

/**
 * LazyImage component for optimized, lazy-loaded images
 * Automatically handles WebP/AVIF conversion and responsive sizing
 */
const LazyImage: React.FC<LazyImageProps> = ({ 
  src, 
  alt, 
  width, 
  height, 
  className = '', 
  size
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [imageSize, setImageSize] = useState<'sm' | 'md' | 'lg' | 'xl'>(size || 'md');
  
  useEffect(() => {
    // If size is not explicitly set, determine based on screen size
    if (!size) {
      setImageSize(getResponsiveSize());
      
      // Update size on window resize
      const handleResize = () => {
        setImageSize(getResponsiveSize());
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [size]);
  
  useEffect(() => {
    // Set up intersection observer for lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '200px' } // Start loading when image is within 200px of viewport
    );
    
    const currentElement = document.getElementById(`lazy-image-${src}`);
    if (currentElement) {
      observer.observe(currentElement);
    }
    
    return () => observer.disconnect();
  }, [src]);
  
  // Get optimized image URL
  const optimizedSrc = getOptimizedImageUrl(src, imageSize);
  
  return (
    <div 
      id={`lazy-image-${src}`}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {/* Low-quality placeholder */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={{ width, height }}
        />
      )}
      
      {/* Actual image (only load when in view) */}
      {isInView && (
        <img
          src={optimizedSrc}
          alt={alt}
          width={width}
          height={height}
          className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setIsLoaded(true)}
          loading="lazy"
        />
      )}
    </div>
  );
};

export default LazyImage;
