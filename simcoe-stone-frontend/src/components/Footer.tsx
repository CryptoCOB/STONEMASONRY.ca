import React from 'react';
import Brand from './Brand';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="text-white bg-white">
      <div className="mx-auto max-w-7xl">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 px-6 py-12 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="xl:col-span-2"
          >
            <h3 className="mb-4">
              <Brand as="span" className="text-2xl md:text-3xl" />
            </h3>
            <p className="mb-3 italic font-semibold text-primaryRed font-heading">
              "If You Can Dream It, We Can Build It"
            </p>
            <p className="mb-4 text-gray-800">
              Expert stone masonry services in Ontario and surrounding areas. Quality craftsmanship with over 25 years of experience.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/stone.masonry"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 transition-colors hover:text-blue-500"
                aria-label="Visit our Facebook page"
                title="Facebook"
              >
                <span className="sr-only">Facebook</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/stonemasonry/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 transition-colors hover:text-pink-500"
                aria-label="Visit our Instagram page"
                title="Instagram"
              >
                <span className="sr-only">Instagram</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.83-8.519c-.315 0-.595-.113-.823-.34-.227-.228-.34-.508-.34-.823 0-.315.113-.595.34-.823.228-.227.508-.34.823-.34.315 0 .595.113.823.34.227.228.34.508.34.823 0 .315-.113.595-.34.823-.228.227-.508.34-.823.34zm-4.262 1.531c-1.716 0-3.108 1.392-3.108 3.108s1.392 3.108 3.108 3.108 3.108-1.392 3.108-3.108-1.392-3.108-3.108-3.108z" />
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@stonemasonry?lang=en"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 transition-colors hover:text-primaryRed"
                aria-label="Visit our TikTok page"
                title="TikTok"
              >
                <span className="sr-only">TikTok</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
              </a>
              <a
                href="https://wa.me/33744298025?text=Hi%2C%20I%27m%20interested%20in%20your%20stone%20masonry%20services"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 transition-colors hover:text-green-500"
                aria-label="Chat with us on WhatsApp"
                title="WhatsApp"
              >
                <span className="sr-only">WhatsApp</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                </svg>
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="mb-4 text-lg font-semibold font-heading text-gray-800">Quick Links</h4>
            <ul className="space-y-2 text-gray-700">
              <li><a href="/" className="transition-colors hover:text-primaryRed">Home</a></li>
              <li><a href="/portfolio" className="transition-colors hover:text-primaryRed">Portfolio</a></li>
              <li><a href="/about" className="transition-colors hover:text-primaryRed">About Us</a></li>
              <li><a href="/contact" className="transition-colors hover:text-primaryRed">Contact</a></li>
              <li><a href="/all-services" className="transition-colors hover:text-primaryRed">All Services</a></li>
              <li><a href="/emergency" className="transition-colors hover:text-primaryRed">Emergency Services</a></li>
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            <h4 className="mb-4 text-lg font-semibold font-heading text-gray-800">Resources</h4>
            <ul className="space-y-2 text-gray-700">
              <li><a href="/faq" className="transition-colors hover:text-primaryRed">FAQ</a></li>
              <li><a href="/stone-care-guide" className="transition-colors hover:text-primaryRed">Stone Care Guide</a></li>
              <li><a href="/consultation" className="transition-colors hover:text-primaryRed">Consultation</a></li>
              <li><a href="/portfolio" className="transition-colors hover:text-primaryRed">Project Gallery</a></li>
              <li><a href="/#testimonials" className="transition-colors hover:text-primaryRed">Testimonials</a></li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="mb-4 text-lg font-semibold font-heading text-gray-800">Contact Info</h4>
            <div className="space-y-3 text-gray-700">
              <div className="flex items-start">
                <span className="mt-1 mr-3 text-xl text-primaryRed">📍</span>
                <span>Serving Ontario<br />Canada</span>
              </div>
              <div className="flex items-center">
                <span className="mr-3 text-xl text-primaryRed">📞</span>
                <a
                  href="tel:+17053415285"
                  className="transition-colors hover:text-primaryRed"
                  aria-label="Call us at (705) 341-5285"
                >
                  (705) 341-5285
                </a>
              </div>
              <div className="flex items-center">
                <span className="mr-3 text-xl text-primaryRed">✉️</span>
                <a
                  href="mailto:info@stonemasonry.ca"
                  className="transition-colors hover:text-primaryRed"
                  aria-label="Email us at info@stonemasonry.ca"
                >
                  info@stonemasonry.ca
                </a>
              </div>
              <div className="flex items-start">
                <span className="mt-1 mr-3 text-xl text-primaryRed">🕒</span>
                <span>Mon-Fri: 7AM-7PM<br />Sat: 8AM-4PM<br />Sun: By appointment</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Internal Linking Cluster */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="px-6 pt-4 pb-10 border-t border-gray-300"
        >
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <h5 className="mb-3 text-sm font-semibold tracking-wide uppercase text-primaryRed">Core Services</h5>
              <ul className="space-y-1 text-sm text-gray-700">
                <li><a href="/services/emergency-repair" className="hover:text-primaryRed">Emergency Stone Repair</a></li>
                <li><a href="/services/fireplace-installation" className="hover:text-primaryRed">Custom Fireplaces</a></li>
                <li><a href="/services/retaining-walls" className="hover:text-primaryRed">Retaining Walls</a></li>
                <li><a href="/services/heritage-restoration" className="hover:text-primaryRed">Heritage Restoration</a></li>
                <li><a href="/services/stone-veneer" className="hover:text-primaryRed">Stone Veneer Installation</a></li>
              </ul>
            </div>
            <div>
              <h5 className="mb-3 text-sm font-semibold tracking-wide uppercase text-primaryRed">Outdoor & Structural</h5>
              <ul className="space-y-1 text-sm text-gray-700">
                <li><a href="/services/patio-construction" className="hover:text-primaryRed">Stone Patios</a></li>
                <li><a href="/services/walkway-installation" className="hover:text-primaryRed">Walkway Installation</a></li>
                <li><a href="/services/chimney-repair" className="hover:text-primaryRed">Chimney Repair & Rebuilds</a></li>
                <li><a href="/services/foundation-repair" className="hover:text-primaryRed">Foundation Repair</a></li>
                <li><a href="/services/brick-repair" className="hover:text-primaryRed">Brick Repair</a></li>
              </ul>
            </div>
            <div>
              <h5 className="mb-3 text-sm font-semibold tracking-wide uppercase text-primaryRed">Service Areas (Ontario)</h5>
              <ul className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                <li><a href="/service-area/barrie" className="hover:text-primaryRed">Barrie</a></li>
                <li><a href="/service-area/midland" className="hover:text-primaryRed">Midland</a></li>
                <li><a href="/service-area/orillia" className="hover:text-primaryRed">Orillia</a></li>
                <li><a href="/service-area/collingwood" className="hover:text-primaryRed">Collingwood</a></li>
                <li><a href="/service-area/muskoka" className="hover:text-primaryRed">Muskoka</a></li>
                <li><a href="/service-area/innisfil" className="hover:text-primaryRed">Innisfil</a></li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Certifications & Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="px-6 py-8 border-t border-gray-700"
        >
          <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-8">
            <div className="text-center">
              <div className="px-4 py-2 text-sm font-semibold text-white rounded-full shadow-lg bg-primaryRed">
                ✓ FULLY INSURED
              </div>
            </div>
            <div className="text-center">
              <div className="px-4 py-2 text-sm font-semibold text-white rounded-full shadow-lg bg-primaryRed">
                ✓ WSIB COVERED
              </div>
            </div>
            <div className="text-center">
              <div className="px-4 py-2 text-sm font-semibold text-white rounded-full shadow-lg bg-primaryRed">
                ✓ 25+ YEARS EXPERIENCE
              </div>
            </div>
            <div className="text-center">
              <div className="px-4 py-2 text-sm font-semibold text-white rounded-full shadow-lg bg-primaryRed">
                ✓ PROFESSIONAL CONSULTATIONS
              </div>
            </div>
            <div className="text-center">
              <div className="px-4 py-2 text-sm font-semibold text-white rounded-full shadow-lg bg-primaryRed">
                ✓ SATISFACTION GUARANTEED
              </div>
            </div>
            <div className="text-center">
              <div className="px-4 py-2 text-sm font-semibold text-white rounded-full shadow-lg bg-primaryRed">
                ✓ EMERGENCY SERVICES
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Footer */}
        <div className="px-6 py-6 border-t border-gray-700">
          <div className="flex flex-col items-center justify-between lg:flex-row">
            <p className="mb-4 text-sm text-gray-800 lg:mb-0">
              © {currentYear} STONEMASONRY.CA. All rights reserved. | Proudly serving Ontario since 1998
            </p>
            <div className="flex flex-wrap justify-center space-x-4 lg:justify-end lg:space-x-6">
              <a href="/faq" className="text-sm text-gray-700 transition-colors hover:text-primaryRed">
                FAQ
              </a>
              <a href="/stone-care-guide" className="text-sm text-gray-700 transition-colors hover:text-primaryRed">
                Stone Care
              </a>
              <button className="text-sm text-gray-700 transition-colors hover:text-primaryRed">
                Privacy Policy
              </button>
              <button className="text-sm text-gray-700 transition-colors hover:text-primaryRed">
                Terms of Service
              </button>
              <button className="text-sm text-gray-700 transition-colors hover:text-primaryRed">
                Sitemap
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
