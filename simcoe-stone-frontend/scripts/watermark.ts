/**
 * SSM Watermark Utility - TypeScript
 * Automatically stamps gallery images with SSM seal for brand protection
 * Part of SSM::PROJECT::FULLSTACK::BUILD_O1 sigil implementation
 */

interface WatermarkOptions {
  sealPath?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  opacity?: number;
  size?: number;
  margin?: number;
}

interface WatermarkLog {
  timestamp: string;
  imagesProcessed: number;
  project: string;
  status: string;
}

declare global {
  interface Window {
    SSMWatermark?: SSMWatermarkUtil;
  }
}

class SSMWatermarkUtil {
  private sealPath: string;
  private position: string;
  private opacity: number;
  private size: number;
  private margin: number;

  constructor(options: WatermarkOptions = {}) {
    this.sealPath = options.sealPath || '/images/SSM_Logo.svg';
    this.position = options.position || 'bottom-right';
    this.opacity = options.opacity || 0.8;
    this.size = options.size || 120;
    this.margin = options.margin || 20;
  }

  /**
   * Apply watermark to a single image element
   */
  watermarkImage(imageElement: HTMLImageElement, options: WatermarkOptions = {}): void {
    const sealPath = options.sealPath || this.sealPath;
    const position = options.position || this.position;
    const opacity = options.opacity || this.opacity;
    const size = options.size || this.size;
    const margin = options.margin || this.margin;
    
    // Create canvas for watermarking
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // Set canvas dimensions to match image
    canvas.width = imageElement.naturalWidth;
    canvas.height = imageElement.naturalHeight;
    
    // Draw original image
    ctx.drawImage(imageElement, 0, 0);
    
    // Load and draw SSM seal
    const seal = new Image();
    seal.onload = () => {
      // Calculate position
      const { x, y } = this.calculatePosition(
        canvas.width, 
        canvas.height, 
        size, 
        position, 
        margin
      );
      
      // Apply opacity
      ctx.globalAlpha = opacity;
      
      // Draw watermark
      ctx.drawImage(seal, x, y, size, size);
      
      // Replace original image src with watermarked version
      imageElement.src = canvas.toDataURL('image/png');
      
      // Add watermark attribute for tracking
      imageElement.setAttribute('data-ssm-watermarked', 'true');
      imageElement.setAttribute('data-watermark-position', position);
    };
    
    seal.src = sealPath;
  }

  /**
   * Calculate watermark position based on image dimensions
   */
  private calculatePosition(
    imageWidth: number, 
    imageHeight: number, 
    sealSize: number, 
    position: string, 
    margin: number
  ): { x: number; y: number } {
    let x: number, y: number;
    
    switch (position) {
      case 'top-left':
        x = margin;
        y = margin;
        break;
      case 'top-right':
        x = imageWidth - sealSize - margin;
        y = margin;
        break;
      case 'bottom-left':
        x = margin;
        y = imageHeight - sealSize - margin;
        break;
      case 'bottom-right':
      default:
        x = imageWidth - sealSize - margin;
        y = imageHeight - sealSize - margin;
        break;
    }
    
    return { x, y };
  }

  /**
   * Auto-watermark all gallery images on page load
   */
  autoWatermarkGallery(): void {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.processGalleryImages());
    } else {
      this.processGalleryImages();
    }
  }

  /**
   * Process all gallery images that need watermarking
   */
  processGalleryImages(): void {
    // Find all gallery images (adjust selector as needed)
    const galleryImages = document.querySelectorAll('img.portfolio-image, img.gallery-image, img[data-gallery="true"]');
    
    galleryImages.forEach((imgElement) => {
      const img = imgElement as HTMLImageElement;
      
      // Skip if already watermarked
      if (img.getAttribute('data-ssm-watermarked') === 'true') {
        return;
      }
      
      // Apply watermark when image loads
      if (img.complete) {
        this.watermarkImage(img);
      } else {
        img.addEventListener('load', () => this.watermarkImage(img));
      }
    });
  }

  /**
   * Batch watermark images with different positions
   */
  batchWatermark(images: HTMLImageElement[], positions: string[] = ['bottom-right']): void {
    images.forEach((img, index) => {
      const position = positions[index % positions.length];
      this.watermarkImage(img, { position: position as WatermarkOptions['position'] });
    });
  }

  /**
   * Log watermarking activity for project tracking
   */
  logWatermarkActivity(imageCount: number, timestamp: Date = new Date()): void {
    const logEntry: WatermarkLog = {
      timestamp: timestamp.toISOString(),
      imagesProcessed: imageCount,
      project: 'SSM::PROJECT::FULLSTACK::BUILD_O1',
      status: 'watermark_applied'
    };
    
    console.log('SSM Watermark Log:', logEntry);
    
    // Store in localStorage for project tracking
    const logs = JSON.parse(localStorage.getItem('ssm_watermark_logs') || '[]');
    logs.push(logEntry);
    localStorage.setItem('ssm_watermark_logs', JSON.stringify(logs));
  }
}

// Export for use in React components
export default SSMWatermarkUtil;

// Auto-initialize for immediate use
if (typeof window !== 'undefined') {
  window.SSMWatermark = new SSMWatermarkUtil();
  
  // Auto-watermark on page load
  window.SSMWatermark.autoWatermarkGallery();
}
