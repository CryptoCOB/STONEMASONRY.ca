// Image preloader utility for progressive loading
// Handles preloading of critical and priority images

export interface PreloadImageOptions {
  priority?: 'high' | 'medium' | 'low';
  loading?: 'eager' | 'lazy';
}

export const preloadImage = (src: string, options: PreloadImageOptions = {}): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to preload image: ${src}`));
    
    // Set loading priority
    if (options.priority === 'high') {
      img.loading = 'eager';
    }
    
    img.src = src;
  });
};

export const preloadImages = async (
  sources: string[], 
  options: PreloadImageOptions = {}
): Promise<void[]> => {
  const promises = sources.map(src => preloadImage(src, options));
  return Promise.all(promises);
};

export const preloadCriticalImages = async (): Promise<void> => {
  const criticalImages = [
    '/images/og-image.jpg',
    '/images/logo.png',
    '/images/hero-bg.jpg'
  ];
  
  try {
    await preloadImages(criticalImages, { priority: 'high' });
  } catch (error) {
    console.warn('Some critical images failed to preload:', error);
  }
};

// Export an empty object to ensure this is treated as a module
export {};