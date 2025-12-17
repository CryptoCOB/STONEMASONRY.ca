import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { EstimateRequestPayload } from '../types/api';
import { submitEstimateRequest } from '../utils/apiClient';
import AdvancedSEO from './AdvancedSEO';

const Estimate: React.FC = () => {
  const [formData, setFormData] = useState<EstimateRequestPayload>({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    location: '',
    timeline: '',
    budget: '',
    description: '',
    emergencyService: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const projectTypes = [
    'Custom Fireplace Installation',
    'Retaining Wall Construction',
    'Emergency Stone Repair',
    'Heritage Stone Restoration',
    'Patio Construction',
    'Walkway Installation',
    'Chimney Repair',
    'Stone Veneer Installation',
    'Commercial Masonry',
    'Other Custom Stonework'
  ];

  const budgetRanges = [
    '$25,000 - $50,000',
    '$50,000 - $100,000',
    '$100,000 - $200,000',
    '$200,000 - $500,000',
    '$500,000+',
    'Require Custom Proposal'
  ];

  const timelineOptions = [
    'ASAP - Emergency',
    'Within 2 weeks',
    'Within 1 month',
    'Within 3 months',
    'This year',
    'Planning for next year'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await submitEstimateRequest(formData);
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        projectType: '',
        location: '',
        timeline: '',
        budget: '',
        description: '',
        emergencyService: false
      });
    } catch (error) {
      console.error('Error submitting estimate request:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <>
      <AdvancedSEO
        title="STONEMASONRY.CA Estimate Ontario | Expert Quote in 24 Hours"
        description="Get your stone masonry estimate from Ontario's top-rated stone craftsmen. Expert quotes for fireplaces, retaining walls, emergency repairs. Licensed & insured."
        keywords={[
          "stone masonry estimate Ontario",
          "stone mason quote",
          "fireplace installation cost",
          "retaining wall estimate",
          "emergency stone repair quote",
          "masonry consultation",
          "stone work estimate Ontario"
        ]}
        canonicalUrl="https://stonemasonry.ca/estimate"
        serviceType="Stone Masonry Estimate"
        breadcrumbs={[
          { name: "Home", url: "https://stonemasonry.ca/" },
          { name: "Estimate", url: "https://stonemasonry.ca/estimate" }
        ]}
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-red-900">
        {/* Hero Section with Texture */}
        <div className="relative overflow-hidden py-32 header-quartz">
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center text-white"
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">
                Get Your <span className="text-red-400">Estimate</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-slate-200 max-w-3xl mx-auto drop-shadow-md">
                Expert stone masonry quotes delivered within 24 hours. Professional pricing from Ontario's trusted stone craftsmen.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
                >
                  <div className="text-4xl mb-4">⚡</div>
                  <h3 className="text-xl font-semibold mb-2">24-Hour Response</h3>
                  <p className="text-slate-300">Quick turnaround on all estimate requests</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
                >
                  <div className="text-4xl mb-4">💎</div>
                  <h3 className="text-xl font-semibold mb-2">Expert Craftsmanship</h3>
                  <p className="text-slate-300">20+ years of stone masonry experience</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
                >
                  <div className="text-4xl mb-4">🛡️</div>
                  <h3 className="text-xl font-semibold mb-2">Fully Licensed</h3>
                  <p className="text-slate-300">Licensed, bonded & insured professionals</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Form Section */}
        <div className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="bg-white rounded-2xl shadow-2xl p-8 md:p-12"
            >
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                  Tell Us About Your Project
                </h2>
                <p className="text-slate-600 text-lg">
                  The more details you provide, the more accurate your estimate will be
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8" name="estimate">

                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                      placeholder="(705) 555-0123"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Project Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                      placeholder="City, Ontario"
                    />
                  </div>
                </div>

                {/* Project Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Project Type *
                    </label>
                    <select
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Select project type</option>
                      {projectTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Timeline
                    </label>
                    <select
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Select timeline</option>
                      {timelineOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Budget Range
                  </label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select budget range</option>
                    {budgetRanges.map((range) => (
                      <option key={range} value={range}>{range}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Project Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    placeholder="Please describe your stone masonry project in detail. Include dimensions, materials preferences, and any specific requirements..."
                  ></textarea>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="emergencyService"
                    checked={formData.emergencyService}
                    onChange={handleChange}
                    className="w-5 h-5 text-red-600 border-slate-300 rounded focus:ring-red-500"
                  />
                  <label className="ml-3 text-sm font-medium text-slate-700">
                    This is an emergency repair requiring immediate attention
                  </label>
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-red-600 text-white py-4 px-8 rounded-lg text-lg font-semibold hover:bg-red-700 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3"></div>
                      Submitting...
                    </div>
                  ) : (
                    'Get My Estimate'
                  )}
                </motion.button>

                {submitStatus === 'success' && (
                  <div className="p-4 mt-4 text-green-700 bg-green-100 border border-green-400 rounded-lg">
                    Thank you! Your estimate request has been submitted. Our team will follow up within 24 hours.
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="p-4 mt-4 text-red-700 bg-red-100 border border-red-400 rounded-lg">
                    Sorry, there was an issue submitting your estimate request. Please try again or contact us directly.
                  </div>
                )}
              </form>

              <div className="mt-8 text-center text-sm text-slate-500">
                <p>
                  By submitting this form, you agree to be contacted by STONEMASONRY.CA regarding your project.
                  We respect your privacy and will never share your information.
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h3 className="text-3xl font-bold text-slate-800 mb-12">
                Why Choose STONEMASONRY.CA?
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-red-600 mb-2">20+</div>
                  <p className="text-slate-600">Years Experience</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-red-600 mb-2">500+</div>
                  <p className="text-slate-600">Projects Completed</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-red-600 mb-2">4.9</div>
                  <p className="text-slate-600">Star Rating</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-red-600 mb-2">24/7</div>
                  <p className="text-slate-600">Emergency Service</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Estimate;
