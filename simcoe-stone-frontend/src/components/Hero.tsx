import React from 'react';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  return (
    <section className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-white via-gray-50 to-white">
      {/* Enhanced Animated Background Elements */}
      <motion.div
        className="absolute w-24 h-24 rounded-full top-10 left-10 bg-gradient-to-br from-primaryRed/30 to-primaryRed/10"
        animate={{
          y: [0, -25, 0],
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.8, 0.4],
          rotate: [0, 180, 360]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute w-20 h-20 rounded-full bottom-20 right-20 bg-gradient-to-br from-black/30 to-black/10"
        animate={{
          y: [0, 25, 0],
          scale: [1, 0.8, 1],
          opacity: [0.5, 0.9, 0.5],
          rotate: [360, 180, 0]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      <motion.div
        className="absolute w-16 h-16 rounded-full top-1/3 right-10 bg-gradient-to-br from-primaryRed/35 to-primaryRed/15"
        animate={{
          x: [0, -20, 0],
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.7, 0.3],
          rotate: [0, -180, -360]
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />

      {/* Additional floating elements for richness */}
      <motion.div
        className="absolute w-8 h-8 rounded-full top-1/4 left-1/4 bg-primaryRed/20"
        animate={{
          y: [0, -15, 0],
          x: [0, 10, 0],
          opacity: [0.2, 0.6, 0.2]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3
        }}
      />
      <motion.div
        className="absolute w-6 h-6 rounded-full bottom-1/3 left-20 bg-black/25"
        animate={{
          y: [0, 12, 0],
          x: [0, -8, 0],
          opacity: [0.3, 0.7, 0.3]
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5
        }}
      />

      <div className="relative z-10 px-4 text-center text-gray-900 container-custom sm:px-6 lg:px-8 xl:px-12">
        <motion.h1
          className="mb-6 text-3xl font-extrabold leading-tight tracking-tight text-center sm:mb-8 sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-heading relative"
          initial={{ opacity: 0, y: 45, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        >
          <motion.span
            className="inline-block text-transparent bg-clip-text drop-shadow-[0_0_30px_rgba(220,38,38,0.45)]"
            style={{
              backgroundImage: `url(/LOGO-TRANSPARENT-STONEMASONRYCA.PNG), linear-gradient(135deg,#dc2626,#ef4444,#b91c1c)`,
              backgroundSize: 'cover, 300% 300%',
              backgroundBlendMode: 'overlay',
              WebkitBackgroundClip: 'text'
            }}
            animate={{
              textShadow: [
                '0 0 40px rgba(220,38,38,0.55)',
                '0 0 65px rgba(220,38,38,0.85)',
                '0 0 40px rgba(220,38,38,0.55)'
              ]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            whileHover={{ scale: 1.04 }}
          >
            STONEMASONRY.CA
          </motion.span>
        </motion.h1>
        <motion.div
          className="max-w-6xl mx-auto mb-8 sm:mb-10 lg:mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Mission Statement - Prominent Position */}
          <motion.div
            className="p-6 mb-6 border-2 shadow-2xl rounded-xl sm:p-8 sm:mb-8 bg-gradient-to-br from-white/95 via-white/90 to-gray-50/95 border-primaryRed/60 backdrop-blur-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            whileHover={{
              scale: 1.03,
              boxShadow: "0 35px 70px -15px rgba(220, 38, 38, 0.4)",
              borderColor: "rgba(220, 38, 38, 0.9)",
              y: -5
            }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.h2
              className="flex flex-col items-center justify-center gap-3 mb-4 text-2xl font-bold sm:flex-row sm:gap-4 sm:mb-5 sm:text-3xl md:text-4xl lg:text-5xl font-heading text-primaryRed"
              animate={{
                textShadow: [
                  "0 0 25px rgba(220,38,38,0.4)",
                  "0 0 40px rgba(220,38,38,0.8)",
                  "0 0 25px rgba(220,38,38,0.4)"
                ]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <motion.div
                className="flex items-center justify-center rounded-full shadow-lg w-14 h-14 bg-gradient-to-br from-primaryRed/30 to-primaryRed/10"
                animate={{
                  rotate: [0, 8, -8, 0],
                  scale: [1, 1.15, 1],
                  boxShadow: [
                    "0 4px 15px rgba(220,38,38,0.3)",
                    "0 8px 25px rgba(220,38,38,0.5)",
                    "0 4px 15px rgba(220,38,38,0.3)"
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                whileHover={{
                  scale: 1.2,
                  rotate: 15
                }}
              >
                <svg className="w-7 h-7 text-primaryRed" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 9.64 9 11 5.16-1.36 9-5.45 9-11V7l-10-5z" />
                  <path d="M8 12h8v2H8zm0-3h8v2H8z" fill="white" />
                </svg>
              </motion.div>
              <motion.span
                className="text-center"
                whileHover={{ scale: 1.05 }}
              >
                If You Can Dream It, We Can Build It
              </motion.span>
            </motion.h2>
            <motion.p
              className="text-lg font-semibold text-center text-black sm:text-xl md:text-2xl lg:text-3xl font-heading"
              animate={{
                opacity: [0.8, 1, 0.8]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              whileHover={{
                scale: 1.02,
                color: "#dc2626"
              }}
            >
              Your imagination sets the standard — our craftsmanship rises to meet it.
            </motion.p>
          </motion.div>

          {/* Supporting Text with Professional Touch */}
          <div className="space-y-3 text-base leading-relaxed text-black sm:space-y-4 sm:text-lg md:text-xl font-body">
            <p className="text-center">
              At STONEMASONRY.CA, we transform luxury properties and cottage estates with premium stonework.
              Specializing in high-end residential projects across Canada and cottage country.
            </p>
            <p className="text-sm font-medium text-center text-primaryRed sm:text-base">
              Licensed • Insured • Servicing Canada Since 1985
            </p>
          </div>
        </motion.div>
        <motion.p
          className="max-w-4xl mx-auto mb-4 text-lg text-black sm:mb-6 sm:text-xl md:text-2xl font-body"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Crafting Exceptional Stonework Across Canada Since 1985
        </motion.p>
        <motion.p
          className="max-w-3xl mx-auto mb-8 text-base text-black sm:mb-10 sm:text-lg md:text-xl font-body"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          Professional stonework, custom fireplaces, retaining walls, and architectural masonry
          that stands the test of time.
        </motion.p>
        <motion.div
          className="flex flex-col justify-center gap-5 sm:flex-row sm:gap-8 lg:gap-10"
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <motion.button
            className="group relative w-full sm:w-auto px-8 py-4 text-base sm:px-10 sm:py-5 sm:text-lg lg:px-12 lg:py-6 lg:text-xl btn-primary min-h-[52px] font-bold overflow-hidden"
            onClick={() => {
              const contactSection = document.getElementById('contact-form');
              if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 15px 35px rgba(220, 38, 38, 0.4)"
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <motion.div
              className="absolute inset-0 opacity-0 bg-gradient-to-r from-red-600 to-red-700 group-hover:opacity-100"
              transition={{ duration: 0.3 }}
            />
            <span className="relative z-10">Get Estimate</span>
          </motion.button>
          <motion.button
            className="group relative w-full sm:w-auto px-8 py-4 text-base sm:px-10 sm:py-5 sm:text-lg lg:px-12 lg:py-6 lg:text-xl btn-secondary min-h-[52px] font-bold overflow-hidden"
            onClick={() => {
              const portfolioSection = document.getElementById('portfolio');
              if (portfolioSection) {
                portfolioSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 15px 35px rgba(0, 0, 0, 0.2)"
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <motion.div
              className="absolute inset-0 opacity-0 bg-gradient-to-r from-gray-700 to-gray-800 group-hover:opacity-100"
              transition={{ duration: 0.3 }}
            />
            <span className="relative z-10">View Our Work</span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
