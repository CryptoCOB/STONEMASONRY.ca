import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Brand from './Brand';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 p-3 shadow-md lg:p-4 bg-gradient-to-r from-stone-100/90 via-stone-50/95 to-stone-100/90 backdrop-blur-sm border-b border-stone-200 text-stone-900">
      <div className="flex items-center justify-between container-custom">
        {/* Logo and Brand as a single clickable link */}
        <Link to="/" className="flex items-center space-x-2 group focus:outline-none lg:space-x-3">
          <img
            src="/LOGO-TRANSPARENT-STONEMASONRYCA.PNG"
            alt="STONEMASONRY.CA primary logo"
            className="object-contain w-10 h-10 transition-transform group-hover:scale-110 sm:w-12 sm:h-12 lg:w-14 lg:h-14"
            onError={(e) => { e.currentTarget.src = '/images/logo-stonemasonry.svg'; }}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            width={56}
            height={56}
          />
          <Brand className="ml-1" />
        </Link>

        {/* Desktop Navigation - Improved spacing and readability */}
        <div className="items-center hidden space-x-3 lg:space-x-5 xl:space-x-6 md:flex">
          <Link to="/" className="px-3 py-2 text-sm font-medium text-stone-800 transition-colors duration-300 rounded-md hover:text-primaryRed hover:bg-stone-200/40 lg:text-base">
            Home
          </Link>
          <Link to="/services" className="px-3 py-2 text-sm font-medium text-stone-800 transition-colors duration-300 rounded-md hover:text-primaryRed hover:bg-stone-200/40 lg:text-base">
            Services
          </Link>
          <Link to="/portfolio" className="px-3 py-2 text-sm font-medium text-stone-800 transition-colors duration-300 rounded-md hover:text-primaryRed hover:bg-stone-200/40 lg:text-base">
            Portfolio
          </Link>
          <Link to="/about" className="px-3 py-2 text-sm font-medium text-stone-800 transition-colors duration-300 rounded-md hover:text-primaryRed hover:bg-stone-200/40 lg:text-base">
            About
          </Link>

          {/* Dropdown for Resources - Enhanced for both desktop and mobile */}
          <div className="relative group">
            <button className="flex items-center px-3 py-2 text-sm font-medium text-stone-800 transition-colors duration-300 rounded-md hover:text-primaryRed hover:bg-stone-200/40 lg:text-base">
              Resources
              <svg className="w-4 h-4 ml-1 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <div className="absolute left-0 z-50 invisible mt-2 transition-all duration-300 bg-white border border-stone-200 rounded-lg shadow-xl opacity-0 w-52 group-hover:opacity-100 group-hover:visible">
              <div className="py-2">
                <Link to="/stone-care-guide" className="block px-4 py-3 text-sm text-stone-700 transition-colors duration-200 hover:bg-stone-100 hover:text-primaryRed">
                  Stone Care Guide
                </Link>
                <Link to="/faq" className="block px-4 py-3 text-sm text-stone-700 transition-colors duration-200 hover:bg-stone-100 hover:text-primaryRed">
                  FAQ
                </Link>
                <Link to="/all-services" className="block px-4 py-3 text-sm text-stone-700 transition-colors duration-200 hover:bg-stone-100 hover:text-primaryRed">
                  All Services
                </Link>
              </div>
            </div>
          </div>

          <Link to="/estimate" className="px-3 py-2 text-sm font-medium text-stone-800 transition-colors duration-300 rounded-md hover:text-primaryRed hover:bg-stone-200/40 lg:text-base">
            Estimate
          </Link>
          <Link to="/emergency" className="px-3 py-2 text-sm font-semibold text-yellow-600 transition-colors duration-300 rounded-md hover:text-primaryRed hover:bg-stone-200/40 lg:text-base">
            Emergency
          </Link>
          <Link to="/contact" className="px-3 py-2 text-sm font-medium text-stone-800 transition-colors duration-300 rounded-md hover:text-primaryRed hover:bg-stone-200/40 lg:text-base">
            Contact
          </Link>
          <Link
            to="/consultation"
            className="px-4 py-2 text-sm font-semibold text-white transition-all duration-300 transform rounded-lg bg-primaryRed hover:bg-red-700 hover:shadow-lg hover:scale-105 lg:text-base lg:px-6 lg:py-3"
          >
            Request Consultation
          </Link>
        </div>

        {/* Mobile Menu Button - Enhanced visibility and touch-friendly */}
        <div className="md:hidden">
          <button
            className="p-3 text-stone-800 transition-all duration-300 border-2 border-stone-300 rounded-lg hover:bg-stone-200/50 hover:border-primaryRed focus:outline-none focus:ring-2 focus:ring-primaryRed focus:border-primaryRed"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu - Improved for touch and better spacing */}
      {isMobileMenuOpen && (
        <div className="border-t border-stone-200 md:hidden bg-stone-100/90 backdrop-blur-sm">
          <div className="px-4 py-4 space-y-1">
            <Link
              to="/"
              className="block px-3 py-3 text-base font-medium text-stone-800 transition-colors duration-300 rounded-md hover:text-primaryRed hover:bg-stone-200/50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/services"
              className="block px-3 py-3 text-base font-medium text-stone-800 transition-colors duration-300 rounded-md hover:text-primaryRed hover:bg-stone-200/50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Services
            </Link>
            <Link
              to="/all-services"
              className="block py-2 pl-6 text-sm text-stone-700 transition-colors duration-300 rounded-md hover:text-primaryRed hover:bg-stone-200/50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              → All Services
            </Link>
            <Link
              to="/portfolio"
              className="block px-3 py-3 text-base font-medium text-stone-800 transition-colors duration-300 rounded-md hover:text-primaryRed hover:bg-stone-200/50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Portfolio
            </Link>
            <Link
              to="/about"
              className="block px-3 py-3 text-base font-medium text-stone-800 transition-colors duration-300 rounded-md hover:text-primaryRed hover:bg-stone-200/50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>

            {/* Resources Section */}
            <div className="pt-3 border-t border-white/20">
              <div className="px-3 py-2 text-sm font-semibold text-stone-600">Resources</div>
              <Link
                to="/stone-care-guide"
                className="block py-2 pl-6 text-sm text-stone-700 transition-colors duration-300 rounded-md hover:text-primaryRed hover:bg-stone-200/50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Stone Care Guide
              </Link>
              <Link
                to="/faq"
                className="block py-2 pl-6 text-sm text-stone-700 transition-colors duration-300 rounded-md hover:text-primaryRed hover:bg-stone-200/50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                FAQ
              </Link>
              <Link
                to="/estimate"
                className="block py-2 pl-6 text-sm text-stone-700 transition-colors duration-300 rounded-md hover:text-primaryRed hover:bg-stone-200/50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Free Estimate
              </Link>
            </div>

            <Link
              to="/emergency"
              className="block px-3 py-3 text-base font-semibold text-yellow-600 transition-colors duration-300 rounded-md hover:text-primaryRed hover:bg-stone-200/50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              🚨 Emergency Services
            </Link>
            <Link
              to="/contact"
              className="block px-3 py-3 text-base font-medium text-stone-800 transition-colors duration-300 rounded-md hover:text-primaryRed hover:bg-stone-200/50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              to="/consultation"
              className="block py-4 mx-2 mt-4 text-base font-semibold text-center text-white transition-all duration-300 rounded-lg bg-primaryRed hover:bg-red-700 hover:shadow-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Request Consultation
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
