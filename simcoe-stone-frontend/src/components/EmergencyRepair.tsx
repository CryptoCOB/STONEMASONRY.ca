import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SEO from './SEO';

interface EmergencyService {
  id: number;
  title: string;
  description: string;
  icon: string;
  responseTime: string;
  urgency: 'critical' | 'urgent' | 'standard';
}

const EmergencyRepair: React.FC = () => {
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);

  const emergencyServices: EmergencyService[] = [
    {
      id: 1,
      title: "Structural Stone Collapse",
      description: "Immediate response for collapsed retaining walls, chimneys, or foundation issues",
      icon: "🚨",
      responseTime: "2-4 hours",
      urgency: 'critical'
    },
    {
      id: 2,
      title: "Water Damage Repair",
      description: "Emergency repairs for stone damage caused by flooding or severe weather",
      icon: "💧",
      responseTime: "4-8 hours",
      urgency: 'urgent'
    },
    {
      id: 3,
      title: "Fire Damage Restoration",
      description: "Fireplace and stone restoration after fire damage",
      icon: "🔥",
      responseTime: "Same day",
      urgency: 'urgent'
    },
    {
      id: 4,
      title: "Safety Hazard Assessment",
      description: "Immediate safety evaluation and temporary stabilization",
      icon: "⚠️",
      responseTime: "1-2 hours",
      urgency: 'critical'
    },
    {
      id: 5,
      title: "Storm Damage Repair",
      description: "Post-storm assessment and emergency repairs for damaged stonework",
      icon: "⛈️",
      responseTime: "4-12 hours",
      urgency: 'urgent'
    },
    {
      id: 6,
      title: "Temporary Stabilization",
      description: "Emergency structural support and protective measures",
      icon: "🛡️",
      responseTime: "2-6 hours",
      urgency: 'standard'
    }
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'urgent': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const CallModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        className="bg-white rounded-xl p-6 max-w-md w-full"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center">
          <div className="text-6xl mb-4">📞</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Emergency Contact</h3>
          <div className="bg-primaryRed text-white p-4 rounded-lg mb-4">
            <p className="text-sm uppercase tracking-wide mb-2">24/7 Emergency Hotline</p>
            <p className="text-3xl font-bold">(705) 341-5285</p>
            <p className="text-sm mt-1">(705) 341-5285</p>
          </div>
          <p className="text-gray-600 mb-6">
            Available 24/7 for emergency masonry repairs. Average response time: 2-4 hours.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => setIsCallModalOpen(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
            <a
              href="tel:7053415285"
              className="flex-1 px-4 py-2 bg-primaryRed text-white rounded-lg hover:bg-red-700"
            >
              Call Now
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );

  return (
    <section id="emergency-repair" className="section-padding bg-gradient-to-br from-red-50 to-orange-50">
      <SEO
        title="Emergency Masonry Repair | 24/7 Response | STONEMASONRY.CA"
        description="24/7 emergency stone masonry repair services available across Ontario. Immediate response for structural collapse, chimney damage, foundation issues, and water damage."
        keywords="emergency masonry repair, 24/7 stone repair, structural collapse repair, chimney emergency, masonry water damage"
        canonicalUrl="https://stonemasonry.ca/emergency-repair"
        ogType="service"
      />
      <div className="container-custom">
        {/* Header */}
        <motion.div
          className="mb-12 text-center sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
            🚨 EMERGENCY SERVICES
          </div>
          <h2 className="mb-4 heading-h1 text-primaryRed sm:mb-6">
            24/7 Emergency Stone Repair
          </h2>
          <p className="px-4 text-gray-600 body-large container-content">
            When disaster strikes, STONEMASONRY.CA responds immediately. Our emergency repair team is available around the clock for critical structural issues.
          </p>
        </motion.div>

        {/* Emergency Contact Card */}
        <motion.div
          className="mb-12 mx-auto max-w-2xl bg-white border-l-4 border-primaryRed rounded-xl shadow-lg p-6 sm:p-8"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="text-center">
            <div className="text-5xl mb-4">📞</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Emergency Hotline</h3>
            <div className="text-3xl font-bold text-primaryRed mb-4">(705) 341-5285</div>
            <p className="text-gray-600 mb-6">
              Average response time: 2-4 hours | Available 24/7/365
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setIsCallModalOpen(true)}
                className="btn-primary text-lg min-h-[48px] px-8 py-4"
              >
                📞 Call Emergency Line
              </button>
              <a
                href="sms:7053415285"
                className="btn-secondary text-lg min-h-[48px] px-8 py-4"
              >
                💬 Text for Help
              </a>
            </div>
          </div>
        </motion.div>

        {/* Emergency Services Grid */}
        <div className="grid grid-cols-1 gap-6 px-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-8 sm:px-0">
          {emergencyServices.map((service) => (
            <motion.div
              key={service.id}
              className="p-6 transition-all duration-300 bg-white rounded-xl sm:p-8 card-shadow hover:transform hover:scale-105"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-4xl">{service.icon}</div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getUrgencyColor(service.urgency)}`}>
                  {service.urgency.toUpperCase()}
                </span>
              </div>

              <h3 className="mb-3 heading-h3 text-gray-800">
                {service.title}
              </h3>

              <p className="mb-4 text-sm leading-relaxed text-gray-600 sm:text-base">
                {service.description}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Response Time</p>
                  <p className="text-sm font-semibold text-primaryRed">{service.responseTime}</p>
                </div>
                <button
                  onClick={() => setIsCallModalOpen(true)}
                  className="px-4 py-2 text-sm font-semibold text-white bg-primaryRed rounded-lg hover:bg-red-700 transition-colors"
                >
                  Get Help
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Emergency Process */}
        <motion.div
          className="mt-16 p-8 bg-white rounded-xl shadow-lg"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-primaryRed mb-8 text-center">Emergency Response Process</h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: 1, title: "Call/Text", description: "Contact our 24/7 emergency line", icon: "📞" },
              { step: 2, title: "Assessment", description: "Immediate safety evaluation on-site", icon: "🔍" },
              { step: 3, title: "Stabilization", description: "Emergency repairs and safety measures", icon: "🛠️" },
              { step: 4, title: "Planning", description: "Comprehensive repair plan and timeline", icon: "📋" }
            ].map((step) => (
              <div key={step.step} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-primaryRed text-white rounded-full flex items-center justify-center text-2xl">
                  {step.icon}
                </div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  {step.step}. {step.title}
                </h4>
                <p className="text-gray-600 text-sm">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <p className="text-sm text-yellow-800 text-center">
            ⚠️ <strong>For life-threatening emergencies, call 911 immediately.</strong> Our emergency repair service is for structural masonry issues that pose safety risks.
          </p>
        </motion.div>
      </div>

      {/* Call Modal */}
      {isCallModalOpen && <CallModal />}
    </section>
  );
};

export default EmergencyRepair;
