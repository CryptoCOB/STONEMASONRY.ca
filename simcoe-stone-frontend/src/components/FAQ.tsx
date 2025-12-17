import React from 'react';
import { motion } from 'framer-motion';
import AdvancedSEO from './AdvancedSEO';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ: React.FC = () => {
  const faqData: FAQItem[] = [
    {
      question: "Do you provide 24/7 emergency stone repair services in Ontario?",
      answer: "Yes, STONEMASONRY.CA provides 24/7 emergency stone repair services across Ontario. Our emergency response team can handle urgent masonry issues including collapsed retaining walls, damaged fireplaces, and structural stone problems. Call (705) 341-5285 for immediate assistance.",
      category: "Emergency Services"
    },
    {
      question: "What's the investment range for luxury stone fireplace projects?",
      answer: "Luxury stone fireplace projects typically range from $25,000 to $150,000+ for premium installations, with truly bespoke masterpieces reaching $200,000+. Our investments reflect the highest quality natural stone, master craftsmanship, and custom artistry that creates stunning focal points for luxury homes and estates. We cater exclusively to discerning clients who demand exceptional quality and timeless elegance.",
      category: "Pricing"
    },
    {
      question: "What types of stone do you use for masonry projects?",
      answer: "We work with premium natural stones including limestone, granite, fieldstone, flagstone, and sandstone, as well as high-quality manufactured stone veneer. Our stone selection includes Ontario-sourced materials for authentic regional appearance and imported stones for unique projects.",
      category: "Materials"
    },
    {
      question: "How long does a retaining wall installation take?",
      answer: "Retaining wall installation typically takes 3-7 days depending on length, height, and complexity. Small residential walls (under 4 feet) usually take 2-3 days, while larger commercial projects may require 1-2 weeks. Weather and soil conditions can affect timeline.",
      category: "Timeline"
    },
    {
      question: "Do you offer heritage stone restoration services?",
      answer: "Yes, we specialize in heritage stone restoration for historic buildings, churches, and heritage homes across Ontario. Our master craftsmen use traditional techniques and matching materials to preserve the original character while ensuring structural integrity.",
      category: "Specialty Services"
    },
    {
      question: "What areas in Ontario do you serve?",
      answer: "We serve Barrie, Midland, Orillia, Collingwood, Muskoka, and surrounding regions across Ontario. We travel throughout the province for larger commercial projects and heritage restoration work.",
      category: "Service Areas"
    },
    {
      question: "Are you licensed and insured for masonry work?",
      answer: "Yes, STONEMASONRY.CA is fully licensed, bonded, and insured with comprehensive liability coverage. We maintain all required provincial certifications and our master craftsmen have over 20 years of experience in stone masonry.",
      category: "Credentials"
    },
    {
      question: "Do you provide consultations for luxury property projects?",
      answer: "Yes, we provide professional consultations for luxury residential and cottage country projects. Our consultations include detailed site assessment, premium material selection, design collaboration, and comprehensive project planning. We specialize in high-end stonework that enhances property value.",
      category: "Consultations"
    },
    {
      question: "What warranty do you offer on stone masonry work?",
      answer: "We offer a comprehensive 5-year warranty on workmanship for all stone masonry projects, and up to 25 years on structural elements like retaining walls. Our warranty covers installation defects and structural issues, giving you peace of mind.",
      category: "Warranty"
    },
    {
      question: "Can you repair existing stone work and chimneys?",
      answer: "Absolutely! We specialize in stone repair, restoration, and chimney repair services. Common repairs include repointing mortar joints, replacing damaged stones, chimney crown repair, and structural reinforcement. We match existing materials for seamless repairs.",
      category: "Repairs"
    },
    {
      question: "How do I care for and maintain limestone structures?",
      answer: "Limestone requires gentle care due to its calcium carbonate composition. Clean with pH-neutral stone cleaners only, never use acidic products like vinegar or lemon juice. Seal limestone annually with a breathable penetrating sealer. For Ontario winters, remove ice and snow promptly to prevent freeze-thaw damage. Avoid pressure washing - use soft brushing with mild soap instead.",
      category: "Stone Care"
    },
    {
      question: "What's the best way to maintain granite stonework?",
      answer: "Granite is highly durable but benefits from proper care. Clean with warm water and mild dish soap using a soft cloth. Seal granite surfaces every 1-2 years, especially in high-traffic areas. For outdoor granite, remove organic stains (leaves, moss) promptly to prevent discoloration. Granite can handle pressure washing on low settings if needed for deep cleaning.",
      category: "Stone Care"
    },
    {
      question: "How should I maintain natural fieldstone walls and features?",
      answer: "Fieldstone maintenance focuses on mortar joint care and drainage. Inspect mortar joints annually and repoint as needed to prevent water infiltration. Ensure proper drainage around fieldstone structures. Remove vegetation growing between stones promptly. Clean with water and soft brushing - avoid harsh chemicals that can damage the varied stone types in fieldstone.",
      category: "Stone Care"
    },
    {
      question: "What special care does sandstone require in Ontario's climate?",
      answer: "Sandstone is porous and requires protective measures for Ontario winters. Apply penetrating sealers annually before winter. Clean gently with soft brushes and avoid pressure washing which can damage the surface. Remove salt deposits immediately as they can cause spalling. For stained sandstone, use specialized stone cleaning products rather than household cleaners.",
      category: "Stone Care"
    },
    {
      question: "How do I protect flagstone patios and walkways year-round?",
      answer: "Flagstone care varies by stone type but generally requires sealing every 2-3 years. Remove snow and ice carefully using plastic shovels to avoid scratching. Clean stains immediately - oil stains need specialized stone degreasers. Re-sand joints annually and remove weeds promptly. In cottage country, consider winter covers for decorative flagstone areas.",
      category: "Stone Care"
    },
    {
      question: "What's the proper winter care for stone fireplaces and chimneys?",
      answer: "Winter fireplace care includes annual chimney inspections, proper seasoned wood usage, and moisture control. Ensure the chimney cap and crown are intact to prevent water damage. Keep the damper closed when not in use to prevent cold air infiltration. For stone surrounds, avoid salt-based ice melters on nearby surfaces as they can cause stone damage through migration.",
      category: "Stone Care"
    }
  ];

  const categories = Array.from(new Set(faqData.map(item => item.category)));

  const [selectedCategory, setSelectedCategory] = React.useState<string>('All');
  const [openItems, setOpenItems] = React.useState<Set<number>>(new Set());

  const filteredFAQs = selectedCategory === 'All'
    ? faqData
    : faqData.filter(item => item.category === selectedCategory);

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <>
      <AdvancedSEO
        title="Frequently Asked Questions - Stone Masonry Ontario | STONEMASONRY.CA"
        description="Get answers to common questions about stone masonry, fireplace installation, retaining walls, emergency repairs, stone care maintenance, and heritage restoration in Ontario."
        keywords={[
          "stone masonry FAQ Ontario",
          "fireplace installation cost",
          "retaining wall timeline",
          "emergency stone repair",
          "heritage restoration Ontario",
          "stone mason questions",
          "masonry warranty Ontario",
          "limestone care maintenance",
          "granite stone maintenance",
          "flagstone patio care",
          "stone fireplace maintenance",
          "sandstone care Ontario",
          "fieldstone wall maintenance"
        ]}
        canonicalUrl="https://stonemasonry.ca/faq"
        faqData={faqData.map(item => ({
          question: item.question,
          answer: item.answer
        }))}
        breadcrumbs={[
          { name: "Home", url: "https://stonemasonry.ca/" },
          { name: "FAQ", url: "https://stonemasonry.ca/faq" }
        ]}
      />

      <div className="min-h-screen py-20 bg-gradient-to-br from-slate-50 to-stone-100">
        <div className="max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h1 className="mb-6 text-4xl font-bold md:text-5xl text-slate-800">
              Frequently Asked Questions
            </h1>
            <p className="max-w-3xl mx-auto text-xl text-slate-600">
              Expert answers to your stone masonry questions, including professional stone care and maintenance guidance from our experienced stone craftsmen
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`px-6 py-3 rounded-full transition-all duration-300 font-semibold ${selectedCategory === 'All'
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                  }`}
              >
                All Questions
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-full transition-all duration-300 font-semibold ${selectedCategory === category
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </motion.div>

          {/* FAQ Items */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-4"
          >
            {filteredFAQs.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="overflow-hidden bg-white border shadow-md rounded-xl border-slate-200"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="flex items-center justify-between w-full px-8 py-6 text-left transition-colors duration-200 hover:bg-slate-50"
                >
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-slate-800">
                      {item.question}
                    </h3>
                    <span className="inline-block px-3 py-1 text-sm text-red-700 bg-red-100 rounded-full">
                      {item.category}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: openItems.has(index) ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="ml-4 text-slate-400"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.div>
                </button>

                <motion.div
                  initial={false}
                  animate={{
                    height: openItems.has(index) ? 'auto' : 0,
                    opacity: openItems.has(index) ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-8 pb-6">
                    <p className="leading-relaxed text-slate-600">
                      {item.answer}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="p-12 mt-16 text-center bg-white border shadow-lg rounded-2xl border-slate-200"
          >
            <h2 className="mb-4 text-3xl font-bold text-slate-800">
              Still Have Questions?
            </h2>
            <p className="mb-8 text-lg text-slate-600">
              Our stone masonry experts are here to help with your specific project needs
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="tel:+17053415285"
                className="px-8 py-4 font-semibold text-white transition-colors duration-300 bg-red-600 rounded-lg shadow-lg hover:bg-red-700"
              >
                📞 Call (705) 341-5285
              </a>
              <a
                href="/consultation"
                className="px-8 py-4 font-semibold text-white transition-colors duration-300 rounded-lg shadow-lg bg-slate-800 hover:bg-slate-700"
              >
                Request Consultation
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default FAQ;
