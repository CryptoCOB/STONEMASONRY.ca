// Loading Spinner Component - Professional loading states
// Provides smooth loading experience during page transitions

import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  text = 'Loading...',
  fullScreen = false,
  className = ''
}) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  const containerClasses = fullScreen
    ? 'fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50'
    : 'flex items-center justify-center py-8';

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="flex flex-col items-center">
        {/* Stone-themed loading spinner */}
        <motion.div
          className={`${sizeClasses[size]} relative`}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          {/* Outer ring */}
          <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
          {/* Inner spinning ring */}
          <div className="absolute inset-0 border-4 border-transparent border-t-red-600 rounded-full"></div>
          {/* Stone icon in center */}
          <div className="absolute inset-2 bg-gradient-to-br from-stone-400 to-slate-600 rounded-full opacity-20"></div>
        </motion.div>

        {/* Loading text */}
        <motion.p
          className={`mt-4 text-slate-600 font-medium ${textSizeClasses[size]}`}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {text}
        </motion.p>

        {/* Professional touch - company name */}
        <p className="mt-2 text-xs font-semibold tracking-tight text-red-600">
          STONEMASONRY.CA
        </p>
      </div>
    </div>
  );
};

// Image loading component
export const ImageLoader: React.FC<{
  src: string;
  alt: string;
  className?: string;
  onLoad?: () => void;
}> = ({ src, alt, className = '', onLoad }) => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  return (
    <div className={`relative ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
          <LoadingSpinner size="small" text="" />
        </div>
      )}

      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'
          }`}
        onLoad={() => {
          setLoading(false);
          onLoad?.();
        }}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
      />

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 text-slate-500">
          <div className="text-center">
            <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-xs">Image not available</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Page loading wrapper
export const PageLoader: React.FC<{ children: React.ReactNode; loading: boolean }> = ({
  children,
  loading
}) => {
  if (loading) {
    return (
      <LoadingSpinner
        fullScreen
        size="large"
        text="Preparing your stone masonry experience..."
      />
    );
  }

  return <>{children}</>;
};

export default LoadingSpinner;
