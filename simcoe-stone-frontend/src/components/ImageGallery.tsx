import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: string;
}

const ImageGallery: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const galleryImages: GalleryImage[] = [
    {
      id: 1,
      src: "/images/kawartha lakes masonry home.jpg",
      alt: "Kawartha Lakes Masonry Home",
      category: "Residential"
    },
    {
      id: 2,
      src: "/images/front-stone-walk.jpg",
      alt: "Front Stone Walkway",
      category: "Walkways"
    },
    {
      id: 3,
      src: "/images/stone-front-door.jpg",
      alt: "Stone Front Door Entrance",
      category: "Residential"
    },
    {
      id: 4,
      src: "/images/basement-stone.jpg",
      alt: "Basement Stone Foundation",
      category: "Foundations"
    },
    {
      id: 5,
      src: "/images/brink-wall.jpg",
      alt: "Brick Wall Construction",
      category: "Masonry"
    },
    {
      id: 6,
      src: "/images/in-progress-front-stone-stair.jpg",
      alt: "Front Stone Stairway in Progress",
      category: "Walkways"
    },
    {
      id: 7,
      src: "/images/in-progress-front-stone-stair-35.jpg",
      alt: "Stone Stairway Installation",
      category: "Walkways"
    },
    {
      id: 8,
      src: "/images/pre-contraction.jpg",
      alt: "Pre-Construction Planning",
      category: "Planning"
    },
    {
      id: 9,
      src: "/images/winter-pre.jpg",
      alt: "Winter Pre-Construction",
      category: "Planning"
    },
    {
      id: 10,
      src: "/images/about-craftsman.png",
      alt: "Master Craftsman at Work",
      category: "Craftsmanship"
    },
    {
      id: 11,
      src: "/images/commercial-facade.png",
      alt: "Commercial Building Facade",
      category: "Commercial"
    },
    {
      id: 12,
      src: "/images/fireplace.png",
      alt: "Custom Stone Fireplace",
      category: "Fireplaces"
    },
    {
      id: 13,
      src: "/images/heritage-restoration.png",
      alt: "Heritage Stone Restoration",
      category: "Restoration"
    },
    {
      id: 14,
      src: "/images/modern-patio.png",
      alt: "Modern Stone Patio",
      category: "Patios"
    },
    {
      id: 15,
      src: "/images/pathway.png",
      alt: "Stone Garden Pathway",
      category: "Walkways"
    },
    {
      id: 16,
      src: "/images/retaining-wall.png",
      alt: "Retaining Wall Construction",
      category: "Retaining Walls"
    },
    {
      id: 17,
      src: "/images/stone-texture.png",
      alt: "Natural Quartz Texture Detail",
      category: "Materials"
    },
    {
      id: 18,
      src: "/images/luxury-limestone-home-complete-facade.jpg",
      alt: "Luxury Limestone Home Complete Facade",
      category: "Residential"
    },
    {
      id: 19,
      src: "/images/custom-indoor-fireplace-natural-stone.jpg",
      alt: "Custom Indoor Fireplace Natural Stone",
      category: "Fireplaces"
    },
    {
      id: 20,
      src: "/images/luxury-stone-fireplace-sunroom.jpg",
      alt: "Luxury Stone Fireplace Sunroom",
      category: "Fireplaces"
    },
    {
      id: 21,
      src: "/images/retaining-wall.png",
      alt: "Curved Stone Wall Limestone Columns",
      category: "Retaining Walls"
    },
    {
      id: 22,
      src: "/images/heritage-chimney-masonry-construction.jpg",
      alt: "Heritage Chimney Masonry Construction",
      category: "Restoration"
    },
    {
      id: 23,
      src: "/images/stone-stairs-driveway.jpg",
      alt: "Stone Stairs and Driveway Integration",
      category: "Walkways"
    },
    {
      id: 24,
      src: "/images/stone-veneer-house-build-progress.jpg",
      alt: "Stone Veneer House Build Progress",
      category: "Residential"
    },
    {
      id: 25,
      src: "/images/turret-stone-facade-restoration-limestone.jpg",
      alt: "Turret Stone Facade Restoration Limestone",
      category: "Restoration"
    },
    {
      id: 26,
      src: "/images/two-story-scaffolding.jpg",
      alt: "Two Story Scaffolding Construction",
      category: "Commercial"
    },
    {
      id: 27,
      src: "/images/two-story-scaffolding-after.jpg",
      alt: "Two Story Scaffolding After Completion",
      category: "Commercial"
    },
    {
      id: 28,
      src: "/images/stone-veneer-house-build-progress.jpg",
      alt: "Before Brick Facade Restoration",
      category: "Restoration"
    },
    {
      id: 29,
      src: "/images/stone-texture.png",
      alt: "Limestone Pattern Ashlar Work",
      category: "Materials"
    },
    {
      id: 30,
      src: "/images/basement-masonry-foundation-construction.jpg",
      alt: "Limestone Window Feature Detail",
      category: "Residential"
    },
    {
      id: 31,
      src: "/images/basement-masonry-foundation-construction.jpg",
      alt: "Basement Masonry Foundation Construction",
      category: "Foundations"
    }
  ];

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(galleryImages.map(img => img.category)))];

  // Filter images by category
  const filteredImages = activeCategory === 'All'
    ? galleryImages
    : galleryImages.filter(img => img.category === activeCategory);

  return (
    <section className="py-16 bg-lightGrey sm:py-24">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          className="mb-12 text-center sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="mb-4 heading-h1 text-primaryRed sm:mb-6">
            Project Gallery
          </h2>
          <p className="px-4 text-gray-600 body-large container-content mb-8">
            Explore our completed projects and works in progress
          </p>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === category
                    ? 'bg-primaryRed text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6 sm:px-0">
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.id}
              className="relative overflow-hidden transition-all duration-300 bg-white rounded-lg cursor-pointer group card-shadow hover:shadow-xl"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              onClick={() => setSelectedImage(image)}
            >
              <div className="relative h-64 overflow-hidden sm:h-72">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/400x300/8B4513/FFFFFF?text=" + encodeURIComponent(image.alt);
                  }}
                />
                <div className="absolute inset-0 transition-opacity duration-300 bg-black/40 opacity-0 group-hover:opacity-100"></div>
                <div className="absolute transition-transform duration-300 transform translate-y-full bottom-4 left-4 right-4 group-hover:translate-y-0">
                  <span className="inline-block px-3 py-1 text-sm font-semibold text-white rounded-full bg-primaryRed">
                    {image.category}
                  </span>
                  <p className="mt-2 text-sm font-medium text-white">
                    {image.alt}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal for enlarged image */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
            >
              <motion.div
                className="relative max-w-4xl max-h-screen overflow-hidden bg-white rounded-lg"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="absolute z-10 flex items-center justify-center w-8 h-8 text-white bg-black/50 rounded-full top-4 right-4 hover:bg-black/70"
                  onClick={() => setSelectedImage(null)}
                >
                  ✕
                </button>
                <img
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  className="object-contain w-full h-full max-h-[80vh]"
                />
                <div className="p-4 bg-white">
                  <h3 className="mb-2 text-lg font-semibold text-gray-800">
                    {selectedImage.alt}
                  </h3>
                  <span className="inline-block px-3 py-1 text-sm font-semibold text-white rounded-full bg-primaryRed">
                    {selectedImage.category}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ImageGallery;
