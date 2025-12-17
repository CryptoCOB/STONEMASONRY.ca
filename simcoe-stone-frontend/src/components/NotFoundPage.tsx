// 404 Error Page - Professional and helpful for lost visitors
// Includes SEO optimization and helpful navigation

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdvancedSEO from './AdvancedSEO';

const NotFoundPage: React.FC = () => {
  return (
    <>
      <AdvancedSEO
        title="Page Not Found | STONEMASONRY.CA"
        description="Sorry, the page you're looking for doesn't exist. Find professional stone masonry services and request your consultation today."
        canonicalUrl="https://stonemasonry.ca/404"
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 flex items-center justify-center px-4">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Large 404 with stone texture */}
            <div className="mb-8">
              <h1 className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-stone-600 to-slate-800">
                404
              </h1>
              <div className="w-32 h-1 bg-red-600 mx-auto rounded"></div>
            </div>

            {/* Error message */}
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Page Not Found
            </h2>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Sorry, the page you're looking for seems to have been moved or doesn't exist.
              But don't worry - we're here to help with all your stone masonry needs!
            </p>

            {/* Quick navigation options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-6 bg-white rounded-xl shadow-lg border border-slate-200"
              >
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Looking for Services?</h3>
                <p className="text-slate-600 mb-4">View our complete range of stone masonry services</p>
                <Link
                  to="/#services"
                  className="inline-block px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  View Services
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-6 bg-white rounded-xl shadow-lg border border-slate-200"
              >
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Need Emergency Repair?</h3>
                <p className="text-slate-600 mb-4">24/7 emergency stone repair services available</p>
                <Link
                  to="/emergency-repair"
                  className="inline-block px-6 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                >
                  Emergency Service
                </Link>
              </motion.div>
            </div>

            {/* Main call-to-action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                to="/"
                className="px-8 py-4 bg-slate-800 text-white rounded-lg font-semibold hover:bg-slate-700 transition-colors flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Return Home
              </Link>

              <Link
                to="/contact"
                className="px-8 py-4 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Get Consultation
              </Link>
            </div>

            {/* Contact information */}
            <div className="p-6 bg-white rounded-xl shadow-lg border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">
                Still Need Help? Contact Us Directly
              </h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="tel:+17053415285"
                  className="flex items-center text-slate-600 hover:text-red-600 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  (705) 341-5285
                </a>
                <span className="text-slate-400 hidden sm:block">•</span>
                <span className="text-slate-600">24/7 Emergency Service Available</span>
              </div>
            </div>

            {/* Popular pages */}
            <div className="mt-8 text-left">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 text-center">Popular Pages</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <Link to="/portfolio" className="text-red-600 hover:text-red-700 transition-colors">
                  View Portfolio
                </Link>
                <Link to="/about" className="text-red-600 hover:text-red-700 transition-colors">
                  About Us
                </Link>
                <Link to="/faq" className="text-red-600 hover:text-red-700 transition-colors">
                  FAQ
                </Link>
                <Link to="/consultation" className="text-red-600 hover:text-red-700 transition-colors">
                  Consultation
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
