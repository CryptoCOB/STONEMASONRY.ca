import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AdvancedSEO from './AdvancedSEO';

interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  features: string[];
}

interface ServiceCardProps {
  service: Service;
  index: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, index }) => (
  <motion.div
    className="p-6 transition-all duration-300 bg-white rounded-lg card-shadow hover:transform hover:scale-105 hover:shadow-xl"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: index * 0.05 }}
    viewport={{ once: true }}
  >
    <div className="mb-4 text-3xl text-center">{service.icon}</div>
    <h3 className="mb-3 text-lg font-semibold text-center font-heading text-charcoal">
      {service.title}
    </h3>
    <p className="mb-4 text-sm text-center text-gray-600">
      {service.description}
    </p>
    <ul className="space-y-1">
      {service.features.map((feature, featureIndex) => (
        <li key={featureIndex} className="flex items-center text-xs text-gray-700">
          <span className="mr-2 text-primaryRed">✓</span>
          {feature}
        </li>
      ))}
    </ul>
  </motion.div>
);

const AllServices: React.FC = () => {
  const allServices: Service[] = [
    {
      id: 1,
      title: "Custom Fireplaces",
      description: "Handcrafted stone fireplaces that become the centerpiece of your home",
      icon: "🔥",
      features: ["Natural Stone", "Custom Design", "Professional Installation", "Lifetime Warranty"]
    },
    {
      id: 2,
      title: "Retaining Walls",
      description: "Engineered stone walls that provide both function and beauty",
      icon: "🏗️",
      features: ["Structural Engineering", "Drainage Systems", "Natural Materials", "Landscaping Integration"]
    },
    {
      id: 3,
      title: "Architectural Masonry",
      description: "Premium stonework for commercial and residential buildings",
      icon: "🏛️",
      features: ["Heritage Restoration", "Modern Architecture", "Custom Fabrication", "Project Management"]
    },
    {
      id: 4,
      title: "Outdoor Living Spaces",
      description: "Transform your backyard with custom stone patios and walkways",
      icon: "🌿",
      features: ["Patio Design", "Walkway Installation", "Garden Features", "Outdoor Kitchens"]
    },
    {
      id: 5,
      title: "Stone Veneer Installation",
      description: "Enhance your property's appearance with expertly installed stone veneer",
      icon: "🧱",
      features: ["Interior & Exterior", "Wide Selection", "Energy Efficient", "Low Maintenance"]
    },
    {
      id: 6,
      title: "Chimney Restoration",
      description: "Restore and repair stone chimneys for safety and aesthetics",
      icon: "🏠",
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
      description: "Create comfortable stone seating areas for gardens and patios",
      icon: "🪑",
      features: ["Ergonomic Design", "Weather Resistant", "Custom Curves", "Integrated Planters"]
    },
    {
      id: 14,
      title: "Stone Planters & Garden Beds",
      description: "Enhance your landscaping with custom stone planters",
      icon: "🌱",
      features: ["Drainage Systems", "Various Sizes", "Curved Designs", "Integrated Irrigation"]
    },
    {
      id: 15,
      title: "Stone Pool Decking",
      description: "Install slip-resistant stone decking around swimming pools",
      icon: "🏊",
      features: ["Non-slip Surface", "Heat Resistant", "Chlorine Resistant", "Easy Maintenance"]
    },
    {
      id: 16,
      title: "Stone Window Sills & Trim",
      description: "Add elegance with custom stone window features",
      icon: "🪟",
      features: ["Weather Sealing", "Custom Profiles", "Variety of Stones", "Precision Installation"]
    },
    {
      id: 17,
      title: "Stone Mailbox Posts",
      description: "Create impressive entrances with stone mailbox installations",
      icon: "📫",
      features: ["Integrated Lighting", "Address Numbers", "Landscape Integration", "Durable Construction"]
    },
    {
      id: 18,
      title: "Stone Outdoor Kitchens",
      description: "Build complete outdoor cooking spaces with stone construction",
      icon: "👨‍🍳",
      features: ["Built-in Appliances", "Storage Solutions", "Bar Seating", "Weather Protection"]
    },
    {
      id: 19,
      title: "Stone Fire Pits",
      description: "Gather around custom stone fire pits for outdoor entertainment",
      icon: "🔥",
      features: ["Gas or Wood Burning", "Safety Features", "Integrated Seating", "Custom Sizes"]
    },
    {
      id: 20,
      title: "Stone Archways & Entrances",
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

  return (
    <>
      <AdvancedSEO
        title="Complete Stone Masonry Services | STONEMASONRY.CA"
        description="Discover our complete range of professional stone masonry services including fireplaces, retaining walls, patios, restoration, and custom stonework across Ontario."
        keywords={["stone masonry services", "fireplace installation", "retaining walls", "stone patios", "masonry restoration", "custom stonework", "Ontario masonry"]}
        canonicalUrl="https://stonemasonry.ca/all-services"
        serviceType="Stone Masonry Services"
      />

      {/* Hero Header with Texture */}
      <section className="relative py-32 overflow-hidden header-quartz">
        <div className="relative z-10 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="mb-6 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl font-heading">
              STONEMASONRY.CA Service Portfolio
            </h1>
            <p className="max-w-3xl mx-auto text-xl leading-relaxed text-slate-200 font-body">
              Professional stonework solutions for every project - from custom fireplaces to complete architectural masonry
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-lightGrey">
        <div className="container-custom">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-charcoal font-heading">
              Professional Services by STONEMASONRY.CA
            </h2>
            <p className="max-w-3xl mx-auto text-lg text-gray-600">
              Our expert craftsmen provide comprehensive stone masonry services across Ontario,
              combining traditional techniques with modern innovation.
            </p>
          </div>

          {/* Fireplaces & Chimneys Section */}
          <div id="fireplaces" className="mb-16 scroll-mt-24">
            <h3 className="mb-8 text-2xl font-bold text-center text-charcoal font-heading">
              Fireplaces & Chimneys
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {allServices.filter(service =>
                service.title.toLowerCase().includes('fireplace') ||
                service.title.toLowerCase().includes('chimney')
              ).map((service, index) => (
                <ServiceCard key={service.id} service={service} index={index} />
              ))}
            </div>
          </div>

          {/* Retaining Walls Section */}
          <div id="retaining-walls" className="mb-16 scroll-mt-24">
            <h3 className="mb-8 text-2xl font-bold text-center text-charcoal font-heading">
              Retaining Walls
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {allServices.filter(service =>
                service.title.toLowerCase().includes('retaining') ||
                service.title.toLowerCase().includes('garden walls')
              ).map((service, index) => (
                <ServiceCard key={service.id} service={service} index={index} />
              ))}
            </div>
          </div>

          {/* Stone Patios & Walkways Section */}
          <div id="patios" className="mb-16 scroll-mt-24">
            <h3 className="mb-8 text-2xl font-bold text-center text-charcoal font-heading">
              Stone Patios & Walkways
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {allServices.filter(service =>
                service.title.toLowerCase().includes('outdoor living') ||
                service.title.toLowerCase().includes('driveway') ||
                service.title.toLowerCase().includes('pathway') ||
                service.title.toLowerCase().includes('pool decking') ||
                service.title.toLowerCase().includes('steps')
              ).map((service, index) => (
                <ServiceCard key={service.id} service={service} index={index} />
              ))}
            </div>
          </div>

          {/* Heritage Restoration Section */}
          <div id="restoration" className="mb-16 scroll-mt-24">
            <h3 className="mb-8 text-2xl font-bold text-center text-charcoal font-heading">
              Heritage Restoration
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {allServices.filter(service =>
                service.title.toLowerCase().includes('restoration') ||
                service.title.toLowerCase().includes('historic') ||
                service.title.toLowerCase().includes('heritage')
              ).map((service, index) => (
                <ServiceCard key={service.id} service={service} index={index} />
              ))}
            </div>
          </div>

          {/* Commercial Projects Section */}
          <div id="commercial" className="mb-16 scroll-mt-24">
            <h3 className="mb-8 text-2xl font-bold text-center text-charcoal font-heading">
              Commercial Projects
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {allServices.filter(service =>
                service.title.toLowerCase().includes('architectural') ||
                service.title.toLowerCase().includes('bridge') ||
                service.title.toLowerCase().includes('pillars') ||
                service.title.toLowerCase().includes('columns')
              ).map((service, index) => (
                <ServiceCard key={service.id} service={service} index={index} />
              ))}
            </div>
          </div>

          {/* Residential Landscaping Section */}
          <div id="residential" className="mb-16 scroll-mt-24">
            <h3 className="mb-8 text-2xl font-bold text-center text-charcoal font-heading">
              Residential Landscaping
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {allServices.filter(service =>
                service.title.toLowerCase().includes('water features') ||
                service.title.toLowerCase().includes('bbq') ||
                service.title.toLowerCase().includes('fire pit') ||
                service.title.toLowerCase().includes('outdoor kitchen') ||
                service.title.toLowerCase().includes('benches') ||
                service.title.toLowerCase().includes('planters') ||
                service.title.toLowerCase().includes('mailbox') ||
                service.title.toLowerCase().includes('veneer')
              ).map((service, index) => (
                <ServiceCard key={service.id} service={service} index={index} />
              ))}
            </div>
          </div>

          {/* Additional Services Section */}
          <div className="mb-16">
            <h3 className="mb-8 text-2xl font-bold text-center text-charcoal font-heading">
              Additional Services
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {allServices.filter(service =>
                !service.title.toLowerCase().includes('fireplace') &&
                !service.title.toLowerCase().includes('chimney') &&
                !service.title.toLowerCase().includes('retaining') &&
                !service.title.toLowerCase().includes('garden walls') &&
                !service.title.toLowerCase().includes('outdoor living') &&
                !service.title.toLowerCase().includes('driveway') &&
                !service.title.toLowerCase().includes('pathway') &&
                !service.title.toLowerCase().includes('pool decking') &&
                !service.title.toLowerCase().includes('steps') &&
                !service.title.toLowerCase().includes('restoration') &&
                !service.title.toLowerCase().includes('historic') &&
                !service.title.toLowerCase().includes('heritage') &&
                !service.title.toLowerCase().includes('architectural') &&
                !service.title.toLowerCase().includes('bridge') &&
                !service.title.toLowerCase().includes('pillars') &&
                !service.title.toLowerCase().includes('columns') &&
                !service.title.toLowerCase().includes('water features') &&
                !service.title.toLowerCase().includes('bbq') &&
                !service.title.toLowerCase().includes('fire pit') &&
                !service.title.toLowerCase().includes('outdoor kitchen') &&
                !service.title.toLowerCase().includes('benches') &&
                !service.title.toLowerCase().includes('planters') &&
                !service.title.toLowerCase().includes('mailbox') &&
                !service.title.toLowerCase().includes('veneer')
              ).map((service, index) => (
                <ServiceCard key={service.id} service={service} index={index} />
              ))}
            </div>
          </div>

          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="p-8 mx-auto bg-white rounded-lg shadow-lg max-w-2xl">
              <h3 className="mb-4 text-2xl font-bold text-charcoal font-heading">
                Ready to Build with STONEMASONRY.CA?
              </h3>
              <p className="mb-6 text-gray-600">
                Contact our master craftsmen for a personalized consultation and transparent project planning.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Link to="/estimate" className="text-lg btn-primary">
                  Get Estimate
                </Link>
                <Link to="/contact" className="text-lg btn-secondary">
                  Contact Us
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default AllServices;
