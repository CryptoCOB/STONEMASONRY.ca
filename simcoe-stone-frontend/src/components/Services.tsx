import React from 'react';
import { motion } from 'framer-motion';

interface Service {
  id: number;
  title: string;
  description: string;
  icon: React.ReactElement | string;
  features: string[];
}

const Services: React.FC = () => {
  const services: Service[] = [
    {
      id: 1,
      title: "Custom Fireplaces",
      description: "Handcrafted stone fireplaces that become the centerpiece of your home",
      icon: <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2L2 7v10c0 5.55 3.84 9.64 9 11 5.16-1.36 9-5.45 9-11V7l-10-5z" />
        <path d="M8 12h8M8 15h8M8 9h8" stroke="white" strokeWidth="1" fill="none" />
      </svg>,
      features: ["Natural Stone", "Custom Design", "Professional Installation", "Lifetime Warranty"]
    },
    {
      id: 2,
      title: "Retaining Walls",
      description: "Engineered stone walls that provide both function and beauty",
      icon: <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M3 21h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18V7H3v2zm0-4h18V3H3v2z" />
      </svg>,
      features: ["Structural Engineering", "Drainage Systems", "Natural Materials", "Landscaping Integration"]
    },
    {
      id: 3,
      title: "Architectural Masonry",
      description: "Premium stonework for commercial and residential buildings",
      icon: <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2L7 5v6l5 2 5-2V5l-5-3zm3 8.5l-3 1.2-3-1.2V7l3-1.5L15 7v3.5z" />
        <path d="M2 17h20v2H2zm0 3h20v2H2z" />
      </svg>,
      features: ["Heritage Restoration", "Modern Architecture", "Custom Fabrication", "Project Management"]
    },
    {
      id: 4,
      title: "Outdoor Living Spaces",
      description: "Transform your backyard with custom stone patios and walkways",
      icon: <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66C7.74 17.33 9.74 12 16.92 10.34L17 8zm-3.28 2.9c2.5 0 4.5 2 4.5 4.5s-2 4.5-4.5 4.5-4.5-2-4.5-4.5 2-4.5 4.5-4.5z" />
      </svg>,
      features: ["Patio Design", "Walkway Installation", "Garden Features", "Outdoor Kitchens"]
    },
    {
      id: 5,
      title: "Stone Veneer Installation",
      description: "Enhance your property’s appearance with expertly installed stone veneer",
      icon: <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M2 3h20v6H2V3zm0 7h8v4H2v-4zm9 0h11v4H11v-4zM2 15h6v6H2v-6zm7 0h15v6H9v-6z" />
      </svg>,
      features: ["Interior & Exterior", "Wide Selection", "Energy Efficient", "Low Maintenance"]
    },
    {
      id: 6,
      title: "Chimney Restoration",
      description: "Restore and repair stone chimneys for safety and aesthetics",
      icon: <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 10V8h-6V6c0-1.1-.9-2-2-2s-2 .9-2 2v2H4v2c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2zm-8-4c0-.55.45-1 1-1s1 .45 1 1v2h-2V6zm-8 6h4v8H4v-8zm6 0h4v8h-4v-8zm6 0h4v8h-4v-8z" />
      </svg>,
      features: ["Structural Repairs", "Waterproofing", "Historic Preservation", "Custom Caps"]
    },
    {
      id: 7,
      title: "Stone Steps & Staircases",
      description: "Durable and elegant stone steps for entrances and landscapes",
      icon: "🚪",
      features: ["Custom Sizing", "Slip Resistant", "Landscape Integration", "Long-lasting Materials"]
    },
    {
      id: 8,
      title: "Stone Pillars & Columns",
      description: "Add grandeur with custom stone pillars and columns",
      icon: "🗿",
      features: ["Architectural Detailing", "Structural Support", "Custom Shapes", "Decorative Finishes"]
    },
    {
      id: 9,
      title: "Driveway & Pathway Paving",
      description: "Create stunning driveways and pathways with natural stone paving",
      icon: "🚗",
      features: ["Pattern Design", "Heavy Duty", "Weather Resistant", "Professional Installation"]
    },
    {
      id: 10,
      title: "Water Features & Fountains",
      description: "Install elegant stone water features for tranquil outdoor spaces",
      icon: "💧",
      features: ["Custom Basins", "Integrated Lighting", "Natural Stone", "Low Maintenance"]
    },
    {
      id: 11,
      title: "Stone Garden Walls",
      description: "Define your garden with beautifully crafted stone walls",
      icon: "🌸",
      features: ["Curved Designs", "Flower Bed Integration", "Mortared & Dry Stack", "Weather Resistant"]
    },
    {
      id: 12,
      title: "Stone BBQ Islands",
      description: "Upgrade your outdoor cooking with custom stone BBQ islands",
      icon: "🍖",
      features: ["Built-in Grills", "Countertops", "Storage Solutions", "Weatherproof Construction"]
    },
    {
      id: 13,
      title: "Stone Benches & Seating",
      description: "Create inviting spaces with handcrafted stone benches",
      icon: "🪑",
      features: ["Ergonomic Design", "Custom Engraving", "Durable Materials", "Garden Integration"]
    },
    {
      id: 14,
      title: "Stone Fire Pits",
      description: "Gather around a custom stone fire pit for cozy evenings",
      icon: "🔥",
      features: ["Circular & Square Designs", "Heat Resistant", "Safety Features", "Custom Sizing"]
    },
    {
      id: 15,
      title: "Stone Address Markers",
      description: "Personalize your property with elegant stone address markers",
      icon: "🏷️",
      features: ["Custom Engraving", "Weatherproof", "Unique Shapes", "Easy Installation"]
    },
    {
      id: 16,
      title: "Stone Mailboxes",
      description: "Enhance curb appeal with a custom stone mailbox",
      icon: "📬",
      features: ["Secure Construction", "Decorative Detailing", "Weather Resistant", "Custom Numbers"]
    },
    {
      id: 17,
      title: "Stone Pool Coping",
      description: "Finish your pool with luxurious stone coping and edging",
      icon: "🏊",
      features: ["Slip Resistant", "Custom Profiles", "Saltwater Safe", "Elegant Finishes"]
    },
    {
      id: 18,
      title: "Stone Accent Walls",
      description: "Make a statement with dramatic stone accent walls indoors or out",
      icon: "🖼️",
      features: ["Feature Wall Design", "Wide Stone Selection", "Professional Installation", "Custom Patterns"]
    },
    {
      id: 19,
      title: "Stone Window Sills & Surrounds",
      description: "Frame your windows with custom stone sills and surrounds",
      icon: "🪟",
      features: ["Precision Cutting", "Weatherproof", "Architectural Detailing", "Custom Colors"]
    },
    {
      id: 20,
      title: "Stone Archways",
      description: "Add timeless elegance with handcrafted stone archways",
      icon: "🌉",
      features: ["Custom Curves", "Structural Integrity", "Decorative Carving", "Historic Styles"]
    },
    {
      id: 21,
      title: "Stone Balustrades & Railings",
      description: "Install classic stone balustrades for balconies and staircases",
      icon: "🛤️",
      features: ["Custom Profiles", "Safety Compliance", "Elegant Detailing", "Durable Materials"]
    },
    {
      id: 22,
      title: "Stone Patio Fireplaces",
      description: "Enjoy outdoor living with a custom stone patio fireplace",
      icon: "🏕️",
      features: ["Weatherproof Construction", "Integrated Seating", "Custom Mantels", "Efficient Drafting"]
    },
    {
      id: 23,
      title: "Stone Sculpture & Art Pieces",
      description: "Commission unique stone sculptures for gardens or interiors",
      icon: "🎨",
      features: ["Custom Designs", "Hand Carved", "Premium Stone", "Artistic Detailing"]
    },
    {
      id: 24,
      title: "Stone Facade Restoration",
      description: "Restore historic stone facades to their original grandeur",
      icon: "🏰",
      features: ["Historic Accuracy", "Gentle Cleaning", "Mortar Matching", "Protective Sealing"]
    },
    {
      id: 25,
      title: "Stone Bridge Construction",
      description: "Build charming stone bridges for gardens and landscapes",
      icon: "🌁",
      features: ["Custom Spans", "Load Bearing", "Decorative Railings", "Natural Integration"]
    }
  ];

  // Define the main 4 services to display on homepage
  const mainServices = services.slice(0, 4);

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
              Our Services at STONEMASONRY.CA
            </h1>
            <p className="max-w-3xl mx-auto text-xl text-slate-200 drop-shadow-md">
              From concept to completion, we deliver exceptional stonework that exceeds expectations
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-lightGrey">
        <div className="container-custom">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {mainServices.map((service, index) => (
              <motion.div
                key={service.id}
                className="p-8 transition-all duration-300 bg-white rounded-lg card-shadow hover:transform hover:scale-105"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="mb-4 text-center">
                  {typeof service.icon === 'string' ? (
                    <span className="text-4xl">{service.icon}</span>
                  ) : (
                    <div className="flex justify-center text-primaryRed">{service.icon}</div>
                  )}
                </div>
                <h3 className="mb-4 text-xl font-semibold text-center font-heading text-gray-800">
                  {service.title}
                </h3>
                <p className="mb-6 text-center text-gray-600">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                      <span className="mr-2 text-primaryRed">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <button
                className="text-lg btn-primary"
                onClick={() => {
                  const contactSection = document.getElementById('contact-form');
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Request Custom Quote
              </button>
              <button
                className="text-lg btn-secondary"
                onClick={() => window.location.href = '/all-services'}
              >
                View All Services
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Services;
