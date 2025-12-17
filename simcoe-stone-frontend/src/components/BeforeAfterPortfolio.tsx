import React, { useState } from 'react';
import { motion } from 'framer-motion';
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

const BeforeAfterPortfolio: React.FC = () => {
  const [showAfter, setShowAfter] = useState<{ [key: number]: boolean }>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const beforeAfterProjects: BeforeAfterProject[] = portfolioData.beforeAfterProjects;

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(beforeAfterProjects.map(project => project.category)))];

  // Filter projects by category
  const filteredProjects = selectedCategory === 'All' 
    ? beforeAfterProjects 
    : beforeAfterProjects.filter(project => project.category === selectedCategory);

  const toggleImage = (projectId: number) => {
    setShowAfter(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-primaryRed mb-4 font-heading">
            Before & After Gallery
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            See the incredible transformations we've achieved for our clients. Click on any image to toggle between before and after views.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-primaryRed text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={showAfter[project.id] ? project.image_after : project.image_before}
                  alt={showAfter[project.id] ? project.alt_after : project.alt_before}
                  className="w-full h-full object-cover transition-all duration-500"
                />
                
                {/* Toggle Button */}
                <button
                  onClick={() => toggleImage(project.id)}
                  className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-opacity-70 transition-all"
                >
                  {showAfter[project.id] ? 'Show Before' : 'Show After'}
                </button>

                {/* Before/After Label */}
                <div className="absolute bottom-4 left-4 bg-primaryRed text-white px-3 py-1 rounded-full text-sm font-medium">
                  {showAfter[project.id] ? 'After' : 'Before'}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2 font-heading">
                  {project.title}
                </h3>
                <p className="text-gray-600 mb-4 text-sm">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <span className="text-primaryRed mr-1">📍</span>
                    {project.location}
                  </div>
                  <div className="flex items-center">
                    <span className="text-primaryRed mr-1">🏗️</span>
                    {project.stone_type}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-6 text-lg">
            Ready to transform your space? Let's create something amazing together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/free-estimate"
              className="inline-block bg-primaryRed text-white px-8 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              Get Free Estimate
            </a>
            <a
              href="/contact"
              className="inline-block bg-white text-gray-800 border-2 border-primaryRed px-8 py-3 rounded-lg font-medium hover:bg-primaryRed hover:text-white transition-colors"
            >
              Contact Us
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BeforeAfterPortfolio;
