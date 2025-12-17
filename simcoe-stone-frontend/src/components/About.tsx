import React from 'react';
import { motion } from 'framer-motion';
import SEO from './SEO';

const About: React.FC = () => {
  return (
    <>
      {/* Hero Header with Texture */}
      <section className="relative py-32 overflow-hidden header-quartz">
        <div className="relative z-10 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="mb-6 text-4xl font-bold text-white md:text-5xl lg:text-6xl drop-shadow-lg">
              About STONEMASONRY.CA
            </h1>
            <p className="max-w-3xl mx-auto text-xl text-slate-200 drop-shadow-md">
              Crafting beautiful stonework across Ontario for over two decades
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-gradient-to-br from-white via-slate-50 to-stone-50 relative overflow-hidden">
        {/* Animated Background Elements */}
        <motion.div
          className="absolute top-20 right-10 w-40 h-40 bg-red-600/5 rounded-full blur-3xl"
          animate={{
            y: [0, -50, 0],
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-40 left-20 w-32 h-32 bg-red-600/8 rounded-full blur-2xl"
          animate={{
            y: [0, 60, 0],
            scale: [1, 0.7, 1],
            opacity: [0.4, 0.8, 0.4]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
        />

        <SEO
          title="About Us | STONEMASONRY.CA | Our Story & Expertise"
          description="Learn about STONEMASONRY.CA's dedication to quality craftsmanship, our experienced team, and our commitment to exceptional stone masonry services in Ontario."
          keywords="about STONEMASONRY.CA, stone masonry company, masonry expertise, Ontario masonry company, professional stonemasons"
          canonicalUrl="https://stonemasonry.ca/about"
        />
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <motion.h2
                className="heading-h1 text-primaryRed mb-4 md:mb-6 text-center lg:text-left"
                animate={{
                  textShadow: [
                    "0 0 20px rgba(220, 38, 38, 0.3)",
                    "0 0 30px rgba(220, 38, 38, 0.5)",
                    "0 0 20px rgba(220, 38, 38, 0.3)"
                  ]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                About STONEMASONRY.CA
              </motion.h2>
              <motion.div
                className="bg-lightGrey border-l-4 border-primaryRed p-3 md:p-4 mb-4 md:mb-6 mx-2 md:mx-0 relative overflow-hidden"
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 20px 40px -10px rgba(220, 38, 38, 0.2)"
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-red-600/5 to-transparent"
                  animate={{
                    x: [-100, 300],
                    opacity: [0, 0.3, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <p className="text-lg md:text-xl font-heading font-semibold text-primaryRed italic text-center lg:text-left relative z-10">
                  "If You Can Dream It, We Can Build It"
                </p>
                <p className="text-gray-700 mt-2 text-sm md:text-base text-center lg:text-left relative z-10">
                  Our mission statement reflects our commitment to turning your vision into reality through masterful stonework.
                </p>
              </motion.div>
              <p className="body-regular text-stoneGrey mb-4 md:mb-6 text-center lg:text-left leading-relaxed">
                With over 25 years of experience in stone masonry, we have built our reputation on quality craftsmanship,
                attention to detail, and unwavering commitment to customer satisfaction. Our team of skilled artisans
                brings passion and expertise to every project, whether it's a heritage restoration or a modern installation.
              </p>
              <p className="body-regular text-stoneGrey mb-6 md:mb-8 text-center lg:text-left leading-relaxed">
                We specialize in working with natural stone, brick, and block materials, offering comprehensive services
                from design consultation to project completion. Our work is fully insured and backed by our satisfaction guarantee.
              </p>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 px-2 md:px-0">
                <motion.div
                  className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 10px 25px -5px rgba(220, 38, 38, 0.1)"
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    className="w-3 h-3 bg-primaryRed rounded-full mt-2 mr-3 flex-shrink-0"
                    animate={{
                      scale: [1, 1.2, 1],
                      boxShadow: [
                        "0 0 0 0 rgba(220, 38, 38, 0.7)",
                        "0 0 0 10px rgba(220, 38, 38, 0)",
                        "0 0 0 0 rgba(220, 38, 38, 0)"
                      ]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <div>
                    <h3 className="font-heading font-semibold text-gray-800 text-sm md:text-base group-hover:text-primaryRed transition-colors">Expert Craftsmanship</h3>
                    <p className="text-stoneGrey text-xs md:text-sm leading-tight">25+ years of professional stone masonry experience</p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 10px 25px -5px rgba(220, 38, 38, 0.1)"
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    className="w-3 h-3 bg-primaryRed rounded-full mt-2 mr-3 flex-shrink-0"
                    animate={{
                      scale: [1, 1.2, 1],
                      boxShadow: [
                        "0 0 0 0 rgba(220, 38, 38, 0.7)",
                        "0 0 0 10px rgba(220, 38, 38, 0)",
                        "0 0 0 0 rgba(220, 38, 38, 0)"
                      ]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1
                    }}
                  />
                  <div>
                    <h3 className="font-heading font-semibold text-gray-800 text-sm md:text-base group-hover:text-primaryRed transition-colors">Quality Materials</h3>
                    <p className="text-stoneGrey text-xs md:text-sm leading-tight">Premium natural stone and masonry materials</p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 10px 25px -5px rgba(220, 38, 38, 0.1)"
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    className="w-3 h-3 bg-primaryRed rounded-full mt-2 mr-3 flex-shrink-0"
                    animate={{
                      scale: [1, 1.2, 1],
                      boxShadow: [
                        "0 0 0 0 rgba(220, 38, 38, 0.7)",
                        "0 0 0 10px rgba(220, 38, 38, 0)",
                        "0 0 0 0 rgba(220, 38, 38, 0)"
                      ]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 2
                    }}
                  />
                  <div>
                    <h3 className="font-heading font-semibold text-gray-800 text-sm md:text-base group-hover:text-primaryRed transition-colors">Fully Insured</h3>
                    <p className="text-stoneGrey text-xs md:text-sm leading-tight">Comprehensive insurance coverage for all projects</p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 10px 25px -5px rgba(220, 38, 38, 0.1)"
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    className="w-3 h-3 bg-primaryRed rounded-full mt-2 mr-3 flex-shrink-0"
                    animate={{
                      scale: [1, 1.2, 1],
                      boxShadow: [
                        "0 0 0 0 rgba(220, 38, 38, 0.7)",
                        "0 0 0 10px rgba(220, 38, 38, 0)",
                        "0 0 0 0 rgba(220, 38, 38, 0)"
                      ]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 3
                    }}
                  />
                  <div>
                    <h3 className="font-heading font-semibold text-gray-800 text-sm md:text-base group-hover:text-primaryRed transition-colors">Satisfaction Guarantee</h3>
                    <p className="text-stoneGrey text-xs md:text-sm leading-tight">100% satisfaction guarantee on all our work</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative group"
            >
              <motion.div
                className="relative overflow-hidden rounded-lg shadow-xl"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src="/images/about-craftsman.png"
                  alt="Stone Masonry craftsman working on a stone project"
                  loading="lazy"
                  className="w-full h-[400px] md:h-[500px] object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.div>
            </motion.div>
          </div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
          >
            <motion.div
              className="text-center p-4 rounded-lg bg-white/50 backdrop-blur-sm"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.8)" }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="text-2xl md:text-3xl font-bold text-primaryRed font-heading"
                animate={{
                  textShadow: [
                    "0 0 10px rgba(220, 38, 38, 0.3)",
                    "0 0 20px rgba(220, 38, 38, 0.6)",
                    "0 0 10px rgba(220, 38, 38, 0.3)"
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                25+
              </motion.div>
              <div className="text-gray-700 font-semibold text-sm md:text-base">Years Experience</div>
            </motion.div>

            <motion.div
              className="text-center p-4 rounded-lg bg-white/50 backdrop-blur-sm"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.8)" }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="text-2xl md:text-3xl font-bold text-primaryRed font-heading"
                animate={{
                  textShadow: [
                    "0 0 10px rgba(220, 38, 38, 0.3)",
                    "0 0 20px rgba(220, 38, 38, 0.6)",
                    "0 0 10px rgba(220, 38, 38, 0.3)"
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                500+
              </motion.div>
              <div className="text-gray-700 font-semibold text-sm md:text-base">Projects Completed</div>
            </motion.div>

            <motion.div
              className="text-center p-4 rounded-lg bg-white/50 backdrop-blur-sm"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.8)" }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="text-2xl md:text-3xl font-bold text-primaryRed font-heading"
                animate={{
                  textShadow: [
                    "0 0 10px rgba(220, 38, 38, 0.3)",
                    "0 0 20px rgba(220, 38, 38, 0.6)",
                    "0 0 10px rgba(220, 38, 38, 0.3)"
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2
                }}
              >
                100%
              </motion.div>
              <div className="text-gray-700 font-semibold text-sm md:text-base">Satisfaction Rate</div>
            </motion.div>

            <motion.div
              className="text-center p-4 rounded-lg bg-white/50 backdrop-blur-sm"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.8)" }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="text-2xl md:text-3xl font-bold text-primaryRed font-heading"
                animate={{
                  textShadow: [
                    "0 0 10px rgba(220, 38, 38, 0.3)",
                    "0 0 20px rgba(220, 38, 38, 0.6)",
                    "0 0 10px rgba(220, 38, 38, 0.3)"
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 3
                }}
              >
                24/7
              </motion.div>
              <div className="text-gray-700 font-semibold text-sm md:text-base">Support Available</div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default About;
