import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import projectsData from '../data/projects.json';

interface PortfolioItem {
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

const Portfolio: React.FC = () => {
  // Use the first 8 projects from projects.json for homepage display
  const portfolioItems: PortfolioItem[] = projectsData.slice(0, 8) as PortfolioItem[];

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showBeforeAfter, setShowBeforeAfter] = useState<{ [key: number]: boolean }>({});
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 4;

  const navigate = useNavigate();

  // Get unique categories from the portfolio items
  const categories = ['All', ...Array.from(new Set(portfolioItems.map(item => item.category)))];

  const filteredItems = selectedCategory === 'All'
    ? portfolioItems
    : portfolioItems.filter(item => item.category === selectedCategory);

  // Paginate the filtered items
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const paginatedItems = React.useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredItems, currentPage]);

  // Reset to first page when category changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  const toggleBeforeAfter = (itemId: number) => {
    setShowBeforeAfter(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  return (
    <section id="portfolio" className="section-padding bg-lightGrey">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-primaryRed font-heading md:text-4xl">
            STONEMASONRY.CA Project Portfolio
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-gray-600 font-body">
            Discover our exceptional stone masonry projects across Ontario.
            From custom fireplaces to complete architectural stonework.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 mb-8 sm:gap-4"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 text-sm rounded-full transition-all duration-300 font-medium ${selectedCategory === category
                  ? 'bg-primaryRed text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {paginatedItems.map((item, index) => (
            <motion.div
              key={item.id}
              className="overflow-hidden transition-all duration-300 bg-white rounded-lg shadow-lg group hover:shadow-xl"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="relative h-64 overflow-hidden">
                <motion.img
                  src={showBeforeAfter[item.id] ? item.image_after : item.image_before}
                  alt={showBeforeAfter[item.id] ? item.alt_after : item.alt_before}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                  whileHover={{ scale: 1.05 }}
                />

                {/* Before/After Toggle Button */}
                <button
                  onClick={() => toggleBeforeAfter(item.id)}
                  className="absolute px-3 py-1 text-xs font-medium text-white transition-colors rounded-full top-4 right-4 bg-black/70 hover:bg-black/90"
                >
                  {showBeforeAfter[item.id] ? 'Show Before' : 'Show After'}
                </button>

                {/* Category Badge */}
                <div className="absolute px-3 py-1 text-xs font-medium text-white rounded-full top-4 left-4 bg-primaryRed">
                  {item.category}
                </div>

                {/* Before/After Label */}
                <div className="absolute px-3 py-1 text-xs font-medium rounded-full bottom-4 left-4 bg-white/90 text-gray-800">
                  {showBeforeAfter[item.id] ? 'After' : 'Before'}
                </div>
              </div>

              <div className="p-6">
                <h3 className="mb-2 text-lg font-semibold text-gray-800 font-heading">
                  {item.title}
                </h3>
                <p className="mb-3 text-sm text-gray-600 line-clamp-2">
                  {item.description}
                </p>

                <div className="flex items-center justify-between mb-3 text-xs text-gray-500">
                  <span className="flex items-center">
                    📍 {item.location}
                  </span>
                  <span>{item.stone_type}</span>
                </div>

                <div className="text-xs text-gray-400">
                  Completed: {new Date(item.completion_date).toLocaleDateString()}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination Controls */}
        {filteredItems.length > ITEMS_PER_PAGE && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex justify-center mt-8"
          >
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 text-sm font-medium border-t border-b ${currentPage === page
                      ? 'bg-primaryRed text-white border-primaryRed'
                      : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </motion.div>
        )}

        {/* View More Button */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <button
            onClick={() => navigate('/portfolio')}
            className="text-lg transition-colors btn-primary hover:bg-red-700"
          >
            View Complete Portfolio
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Portfolio;
