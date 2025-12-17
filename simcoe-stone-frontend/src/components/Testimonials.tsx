import React from 'react';
import { motion } from 'framer-motion';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  project: string;
  quote: string;
  rating: number;
  image?: string;
}

const Testimonials: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Sarah & Michael Johnson",
      location: "Barrie, ON",
      project: "Custom Fireplace & Patio",
      quote: "Absolutely exceptional work! Our new stone fireplace and patio exceeded our expectations. The attention to detail and craftsmanship is outstanding. We couldn't be happier with the results.",
      rating: 5
    },
    {
      id: 2,
      name: "Robert Chen",
      location: "Innisfil, ON",
      project: "Retaining Wall System",
      quote: "Professional, reliable, and skilled. The retaining wall project was completed on time and within budget. The quality of work speaks for itself - it's been three years and it still looks perfect.",
      rating: 5
    },
    {
      id: 3,
      name: "Lisa Thompson",
      location: "Kawartha Lakes, ON",
      project: "Heritage Restoration",
      quote: "Our heritage home restoration was a challenging project, but the team handled it with expertise and care. They preserved the historical character while ensuring structural integrity.",
      rating: 5
    },
    {
      id: 4,
      name: "David & Jennifer Miller",
      location: "Barrie, ON",
      project: "Outdoor Living Space",
      quote: "From the initial design consultation to the final installation, everything was handled professionally. Our new outdoor space has become the favorite gathering spot for our family and friends.",
      rating: 5
    },
    {
      id: 5,
      name: "Commercial Properties Inc.",
      location: "Barrie, ON",
      project: "Commercial Facade",
      quote: "Working with STONEMASONRY.CA on our commercial building facade was seamless. They delivered quality work on schedule and maintained excellent communication throughout the project.",
      rating: 5
    },
    {
      id: 6,
      name: "Mark & Susan Williams",
      location: "Barrie, ON",
      project: "Custom Walkway",
      quote: "The natural stone walkway transformed our front entrance completely. Neighbors constantly ask who did the work. We highly recommend their services for any stone masonry needs.",
      rating: 5
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`w-4 h-4 sm:w-5 sm:h-5 ${index < rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <section id="testimonials" className="section-padding bg-lightGrey">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="heading-h1 text-primaryRed mb-4 sm:mb-6">
            What Our Clients Say
          </h2>
          <p className="body-large text-gray-600 container-content px-4">
            Don't just take our word for it - hear from satisfied customers who have experienced our craftsmanship
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-4 sm:px-0">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className="bg-white p-6 sm:p-8 rounded-xl card-shadow hover:transform hover:scale-105 transition-all duration-300 touch-manipulation"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              {/* Stars */}
              <div className="flex justify-center mb-4 sm:mb-6">
                <div className="flex space-x-1">
                  {renderStars(testimonial.rating)}
                </div>
              </div>

              {/* Quote */}
              <blockquote className="text-gray-700 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8 text-center italic">
                "{testimonial.quote}"
              </blockquote>

              {/* Client Info */}
              <div className="text-center">
                <h4 className="font-heading font-semibold text-gray-800 text-sm sm:text-base mb-1">
                  {testimonial.name}
                </h4>
                <p className="text-gray-500 text-xs sm:text-sm mb-2">
                  {testimonial.location}
                </p>
                <div className="inline-block px-3 py-1 bg-primaryRed/10 text-primaryRed rounded-full text-xs sm:text-sm font-medium">
                  {testimonial.project}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Badges */}
        <motion.div
          className="mt-12 sm:mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 px-4 sm:px-0">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-primaryRed mb-2">
                500+
              </div>
              <div className="text-gray-600 text-xs sm:text-sm lg:text-base">
                Happy Clients
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-primaryRed mb-2">
                25+
              </div>
              <div className="text-gray-600 text-xs sm:text-sm lg:text-base">
                Years Experience
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-primaryRed mb-2">
                100%
              </div>
              <div className="text-gray-600 text-xs sm:text-sm lg:text-base">
                Satisfaction
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-primaryRed mb-2">
                5★
              </div>
              <div className="text-gray-600 text-xs sm:text-sm lg:text-base">
                Average Rating
              </div>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-12 sm:mt-16 px-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="heading-h3 text-primaryRed mb-4 sm:mb-6">
            Ready to Join Our Satisfied Customers?
          </h3>
          <p className="body-regular text-gray-600 mb-6 sm:mb-8 container-content">
            Let us bring your stone masonry vision to life with the same quality and care that our clients rave about.
          </p>
          <button
            className="btn-primary text-base sm:text-lg min-h-[48px] px-8 py-4 w-full sm:w-auto"
            onClick={() => {
              const contactSection = document.getElementById('contact-form');
              if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
              } else {
                // Fallback: scroll to bottom of page if contact form not found
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
              }
            }}
          >
            Start Your Project Today
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
