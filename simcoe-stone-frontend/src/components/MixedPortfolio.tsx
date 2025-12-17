import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import portfolioData from '../data/portfolio.json';

interface BeforeAfterProject {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  image_before: string;
  image_after: string;
  alt_before: string;
  alt_after: string;
  completion_date: string;
  stone_type: string;
}

interface ShowcaseProject {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  image: string;
  alt: string;
  completion_date: string;
  stone_type: string;
}

const MixedPortfolio: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showBefore, setShowBefore] = useState<{ [key: number]: boolean }>({});
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);

  const beforeAfterProjects: BeforeAfterProject[] = portfolioData.beforeAfterProjects;
  const showcaseProjects: ShowcaseProject[] = portfolioData.showcaseProjects;

  // Get all categories from both project types
  const allCategories = [
    ...beforeAfterProjects.map(project => project.category),
    ...showcaseProjects.map(project => project.category)
  ];
  const categories = ['All', ...Array.from(new Set(allCategories))];

  // Filter projects by category
  const filteredBeforeAfter = selectedCategory === 'All'
    ? beforeAfterProjects
    : beforeAfterProjects.filter(project => project.category === selectedCategory);

  const filteredShowcase = selectedCategory === 'All'
    ? showcaseProjects
    : showcaseProjects.filter(project => project.category === selectedCategory);

  const toggleBeforeAfter = (projectId: number) => {
    setShowBefore(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-stone-50 to-stone-100 py-20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div
        className="absolute top-20 left-10 w-32 h-32 bg-red-600/10 rounded-full blur-xl"
        animate={{
          y: [0, -30, 0],
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-40 right-20 w-24 h-24 bg-red-600/15 rounded-full blur-xl"
        animate={{
          y: [0, 40, 0],
          scale: [1, 0.8, 1],
          opacity: [0.4, 0.7, 0.4]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-slate-800 mb-6"
            animate={{
              textShadow: [
                "0 0 20px rgba(100, 116, 139, 0.3)",
                "0 0 30px rgba(100, 116, 139, 0.5)",
                "0 0 20px rgba(100, 116, 139, 0.3)"
              ]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            Our Portfolio
          </motion.h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Explore our collection of transformative before & after projects and stunning showcase pieces.
            Each project represents our commitment to exceptional craftsmanship and attention to detail.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category, index) => (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full transition-all duration-300 font-semibold relative overflow-hidden ${selectedCategory === category
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                  }`}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {selectedCategory === category && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-700"
                    layoutId="activeCategory"
                    transition={{ duration: 0.3 }}
                  />
                )}
                <span className="relative z-10">{category}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Before & After Transformations Section */}
        {filteredBeforeAfter.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <motion.h2
                className="text-3xl md:text-4xl font-bold text-slate-800 mb-4"
                animate={{
                  textShadow: [
                    "0 0 15px rgba(220, 38, 38, 0.3)",
                    "0 0 25px rgba(220, 38, 38, 0.5)",
                    "0 0 15px rgba(220, 38, 38, 0.3)"
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                🔄 Before & After Transformations
              </motion.h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Witness the dramatic transformations we create. Click any image to toggle between before and after views.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {filteredBeforeAfter.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{
                    y: -8,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                    scale: 1.02
                  }}
                  className="bg-white rounded-xl overflow-hidden shadow-lg border border-slate-200 group"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <motion.img
                      key={showBefore[project.id] === false ? 'after' : 'before'}
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      src={showBefore[project.id] === false ? project.image_after : project.image_before}
                      alt={showBefore[project.id] === false ? project.alt_after : project.alt_before}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 cursor-zoom-in"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEnlargedImage(showBefore[project.id] === false ? project.image_after : project.image_before);
                      }}
                    />

                    {/* Before/After Toggle Button */}
                    <motion.button
                      onClick={() => toggleBeforeAfter(project.id)}
                      className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-semibold hover:bg-opacity-90 transition-all duration-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {showBefore[project.id] === false ? 'AFTER' : 'BEFORE'}
                    </motion.button>

                    {/* Toggle Instructions */}
                    <motion.div
                      className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-xs"
                      animate={{
                        opacity: [0.7, 1, 0.7]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      Click to toggle
                    </motion.div>

                    {/* Animated Border Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute inset-0 border-2 border-red-500/50 rounded-lg animate-pulse"></div>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-red-600 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                      {project.description}
                    </p>

                    <div className="flex items-center justify-between text-sm mb-4">
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full font-medium">
                        {project.category}
                      </span>
                      <span className="text-slate-500">{project.location}</span>
                    </div>

                    <div className="grid grid-cols-1 gap-3 text-sm">
                      <div>
                        <span className="font-semibold text-slate-700">Stone Type:</span>
                        <p className="text-slate-600">{project.stone_type}</p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <span className="text-xs text-slate-500">
                        Completed: {new Date(project.completion_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Project Showcase Section */}
        {filteredShowcase.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <motion.h2
                className="text-3xl md:text-4xl font-bold text-slate-800 mb-4"
                animate={{
                  textShadow: [
                    "0 0 15px rgba(100, 116, 139, 0.3)",
                    "0 0 25px rgba(100, 116, 139, 0.5)",
                    "0 0 15px rgba(100, 116, 139, 0.3)"
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                🏆 Project Showcase
              </motion.h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                A collection of our finest work showcasing the quality and craftsmanship that defines STONEMASONRY.CA.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredShowcase.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{
                    y: -6,
                    boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.2)",
                    scale: 1.01
                  }}
                  className="bg-white rounded-lg overflow-hidden shadow-md border border-slate-200 group"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[4/3] overflow-hidden cursor-zoom-in" onClick={() => setEnlargedImage(project.image)}>
                    <img
                      src={project.image}
                      alt={project.alt}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-slate-800 bg-opacity-80 text-white px-2 py-1 rounded-full text-xs font-medium">
                        {project.category}
                      </span>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-white text-sm opacity-90">{project.location}</p>
                      </div>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-slate-800 mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                      {project.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 mb-3">
                      {project.description}
                    </p>

                    <div className="text-xs text-slate-500">
                      <div className="mb-1">
                        <span className="font-medium">{project.stone_type}</span>
                      </div>
                      <div>
                        Completed: {new Date(project.completion_date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <motion.div
            className="bg-gradient-to-r from-red-600 to-red-700 text-white p-8 rounded-2xl shadow-xl max-w-4xl mx-auto"
            whileHover={{
              scale: 1.02,
              boxShadow: "0 25px 50px -12px rgba(220, 38, 38, 0.3)"
            }}
            transition={{ duration: 0.3 }}
          >
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-4"
              animate={{
                textShadow: [
                  "0 0 20px rgba(255, 255, 255, 0.3)",
                  "0 0 30px rgba(255, 255, 255, 0.6)",
                  "0 0 20px rgba(255, 255, 255, 0.3)"
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Ready to Transform Your Property?
            </motion.h2>
            <p className="text-xl mb-6 opacity-90">
              Contact us today for a consultation and let's discuss how we can bring your stone masonry vision to life.
            </p>
            <motion.button
              className="bg-white text-red-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-red-50 transition-all duration-300 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Request Consultation
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Image Enlargement Modal */}
      <AnimatePresence>
        {enlargedImage && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setEnlargedImage(null)}
          >
            <motion.div
              className="relative max-w-4xl max-h-screen overflow-hidden bg-white rounded-lg"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute z-10 flex items-center justify-center w-8 h-8 text-white bg-black/50 rounded-full top-4 right-4 hover:bg-black/70 transition-colors duration-200"
                onClick={() => setEnlargedImage(null)}
              >
                ✕
              </button>
              <img
                src={enlargedImage}
                alt="Enlarged portfolio view"
                className="object-contain w-full h-full max-h-[80vh]"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MixedPortfolio;
