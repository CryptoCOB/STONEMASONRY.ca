import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const FloatingCallButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button after scrolling 300px from top
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const handleCall = () => {
    // STONEMASONRY.CA primary business phone
    window.location.href = 'tel:+17053415285';
  };

  return (
    <motion.div
      className={`fixed bottom-6 right-6 z-50 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: isVisible ? 1 : 0,
        opacity: isVisible ? 1 : 0
      }}
      transition={{
        duration: 0.3,
        type: "spring",
        stiffness: 260,
        damping: 20
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.button
        onClick={handleCall}
        className="flex items-center gap-3 px-4 py-3 text-white transition-all duration-300 rounded-full shadow-lg bg-primaryRed hover:bg-red-700 hover:shadow-xl backdrop-blur-sm"
        animate={{
          boxShadow: [
            "0 4px 15px rgba(220, 38, 38, 0.4)",
            "0 6px 25px rgba(220, 38, 38, 0.6)",
            "0 4px 15px rgba(220, 38, 38, 0.4)"
          ]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Phone Icon */}
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
        </motion.div>

        {/* Call Me Text */}
        <motion.span
          className="hidden text-sm font-semibold sm:inline-block font-heading"
          animate={{
            opacity: [0.8, 1, 0.8]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          Call Me
        </motion.span>

        {/* Pulse Ring Effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-primaryRed"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
      </motion.button>

      {/* Tooltip on Mobile */}
      <div className="absolute bottom-full right-0 mb-2 sm:hidden">
        <motion.div
          className="px-3 py-1 text-xs text-white rounded-lg bg-gray-800/90 backdrop-blur-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.9, y: 0 }}
          transition={{ delay: 1 }}
        >
          Tap to call
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800/90"></div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FloatingCallButton;
