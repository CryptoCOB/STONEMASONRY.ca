import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SEO from './SEO';
import { postJson } from '../utils/apiClient';

interface FormData {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  message: string;
}

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const projectTypes = [
    'Stone Patios & Walkways',
    'Retaining Walls',
    'Fireplaces & Chimneys',
    'Heritage Restoration',
    'Commercial Projects',
    'Residential Landscaping',
    'Other'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await postJson('/quote-requests', {
        contact_name: formData.name,
        contact_email: formData.email,
        contact_phone: formData.phone,
        project_type: formData.projectType,
        description: formData.message
      });

      setSubmitStatus('success');

      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        phone: '',
        projectType: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact-form" className="section-padding bg-white">
      <SEO
        title="Contact STONEMASONRY.CA | Luxury Stonework Consultation"
        description="Connect with STONEMASONRY.CA for elite stone masonry services, heritage restoration, and custom architectural stonework across Ontario's cottage country and luxury residential markets."
        keywords="stonemasonry.ca, luxury stonework consultation, heritage stone restoration, custom architectural masonry, muskoka stone specialists"
        canonicalUrl="https://stonemasonry.ca/contact"
      />
      <div className="container-custom" id="contact">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-white heading-h1">
            Request Consultation
          </h2>
          <p className="text-gray-300 body-large container-content">
            Transform your luxury property with premium stonework. We specialize in cottage country estates and high-end residential projects. Contact us for a professional consultation and project assessment.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 lg:gap-12 lg:grid-cols-1">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto"
          >
            <form
              name="contact-form"
              method="POST"
              onSubmit={handleSubmit}
              className="p-8 bg-white rounded-lg shadow-lg"
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block mb-2 font-medium text-gray-700">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border rounded-lg border-lightGrey focus:ring-2 focus:ring-primaryRed focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block mb-2 font-medium text-gray-700">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border rounded-lg border-lightGrey focus:ring-2 focus:ring-primaryRed focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2">
                <div>
                  <label htmlFor="phone" className="block mb-2 font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg border-lightGrey focus:ring-2 focus:ring-primaryRed focus:border-transparent"
                    placeholder="(705) 341-5285"
                  />
                </div>
                <div>
                  <label htmlFor="projectType" className="block mb-2 font-medium text-gray-700">
                    Project Type *
                  </label>
                  <select
                    id="projectType"
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border rounded-lg border-lightGrey focus:ring-2 focus:ring-primaryRed focus:border-transparent"
                  >
                    <option value="">Select project type</option>
                    {projectTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="message" className="block mb-2 font-medium text-gray-700">
                  Project Description *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full p-3 border rounded-lg border-lightGrey focus:ring-2 focus:ring-primaryRed focus:border-transparent"
                  placeholder="Please describe your project, including size, materials, timeline, and any specific requirements..."
                />
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Request Consultation'}
                </button>
              </div>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className="p-4 mt-4 text-green-700 bg-green-100 border border-green-400 rounded-lg">
                  Thank you! Your quote request has been submitted successfully. We'll get back to you within 24 hours.
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="p-4 mt-4 text-red-700 bg-red-100 border border-red-400 rounded-lg">
                  Sorry, there was an error submitting your request. Please try again or contact us directly.
                </div>
              )}
            </form>
          </motion.div>
        </div>

        {/* Master Craftsman Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-8 lg:mt-12"
        >
          <div className="relative overflow-hidden rounded-lg shadow-xl">
            <img
              src="/images/about-craftsman.png"
              alt="Master Stone Craftsman at Work"
              className="w-full h-48 sm:h-56 lg:h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent">
              <div className="absolute bottom-4 left-4 right-4">
                <h4 className="text-white font-bold text-lg mb-2">Expert Craftsmanship</h4>
                <p className="text-gray-200 text-sm">
                  Decades of experience in traditional and modern stone masonry techniques
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactForm;
