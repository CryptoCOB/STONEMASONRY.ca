/**
 * Stone Masonry Image Optimization Utility
 * Handles WebP/AVIF conversion, responsive sizing, and lazy loading
 */

/**
 * Get optimized image URL based on format support and screen size
 * @param originalSrc Original image path
 * @param size Desired image size (sm, md, lg, xl)
 * @returns Optimized image URL
 */
export const getOptimizedImageUrl = (originalSrc: string, size: 'sm' | 'md' | 'lg' | 'xl' = 'md'): string => {
  // Extract file path and extension
  const lastDotIndex = originalSrc.lastIndexOf('.');
  const basePath = lastDotIndex !== -1 ? originalSrc.substring(0, lastDotIndex) : originalSrc;

  // Define size dimensions
  const dimensions = {
    sm: '400',
    md: '800',
    lg: '1200',
    xl: '1600'
  };

  // Check if WebP is supported in the browser
  const supportsWebP = () => {
    const elem = document.createElement('canvas');
    if (elem.getContext && elem.getContext('2d')) {
      return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    return false;
  };

  // Use standard dimensions pattern for cloud-based image optimization
  // For local files, this would need a server-side component
  const optimizedPath = `${basePath}-${dimensions[size]}.${supportsWebP() ? 'webp' : 'jpg'}`;

  return optimizedPath;
};

/**
 * Image lazy loading component props
 */
export interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Helper function to generate srcset for responsive images
 * @param basePath Base image path without extension
 * @param extension Image extension
 * @returns Properly formatted srcset string
 */
export const generateSrcSet = (basePath: string, extension: string): string => {
  return `
    ${basePath}-400.${extension} 400w,
    ${basePath}-800.${extension} 800w,
    ${basePath}-1200.${extension} 1200w,
    ${basePath}-1600.${extension} 1600w
  `;
};

/**
 * Determine appropriate image size based on screen width
 * @returns Appropriate image size for current viewport
 */
export const getResponsiveSize = (): 'sm' | 'md' | 'lg' | 'xl' => {
  const width = window.innerWidth;
  if (width < 640) return 'sm';
  if (width < 1024) return 'md';
  if (width < 1536) return 'lg';
  return 'xl';
};
