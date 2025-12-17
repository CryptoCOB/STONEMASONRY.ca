import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdvancedSEO from './AdvancedSEO';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  publishDate: string;
  category: string;
  tags: string[];
  image: string;
  readTime: string;
}

interface CategoryFilter {
  name: string;
  count: number;
}

const StoneCareGuide: React.FC = () => {
  const blogPosts: BlogPost[] = [
    {
      id: 'general-stone-care-10-steps',
      title: 'The Ultimate 10-Step Natural Stone Care Guide',
      excerpt: 'A comprehensive 10-step guide for homeowners to clean, maintain, and protect their interior and exterior natural stone surfaces.',
      content: `Maintaining the beauty of natural stone is straightforward with a consistent routine. Follow these ten essential steps to ensure your stone installations last a lifetime.

**1. Know Your Stone:**
The first step in proper care is identification. Is your stone granite (hard, crystalline), limestone (softer, calcite-based), or sandstone (gritty, porous)? Each type has unique needs. If unsure, a professional can help identify it.

**2. Regular Dusting & Sweeping:**
For floors and surfaces, use a soft-bristle broom or a microfiber dust mop daily. Grit and sand are highly abrasive and can cause fine scratches on any stone surface over time.

**3. Clean with pH-Neutral Cleaners:**
Never use acidic cleaners (vinegar, lemon juice) or harsh alkaline cleaners (bleach, ammonia) on stone, especially limestone. Use a cleaner specifically formulated for natural stone or a small amount of pH-neutral dish soap in warm water.

**4. Blot Spills Immediately:**
Stone can be porous. Spills, particularly oil, wine, or coffee, can penetrate and stain. Don't wipe the spill, as this can spread it. Gently blot with a clean, absorbent cloth.

**5. Use Protective Mats and Coasters:**
On countertops, always use coasters under glasses. On floors, use non-slip mats or area rugs in high-traffic areas and at entryways to trap grit and absorb spills.

**6. Deep Clean Periodically:**
Beyond daily wiping, perform a periodic deep clean. Use your stone-safe cleaner and a soft brush to gently scrub the surface, paying special attention to grout lines.

**7. Rinse Thoroughly with Clean Water:**
After cleaning, rinse the surface with clean, clear water to remove any soap residue. Soap scum can dull the stone's surface and attract more dirt. Dry with a soft microfiber cloth to prevent water spots.

**8. Test Your Sealer Annually:**
A high-quality impregnating sealer is your stone's best defense. Test its effectiveness annually by dripping a small amount of water on the surface. If it beads up, the sealer is working. If it darkens the stone or soaks in, it's time to reseal.

**9. Inspect Grout and Mortar Joints:**
Check the joints between your stones for cracking or crumbling. Damaged mortar can allow water to penetrate behind the stone, leading to significant damage, especially outdoors.

**10. Know When to Call a Professional:**
For deep-set stains, significant cracks, widespread etching, or general restoration, professional help is invaluable. A master mason can restore, repair, and protect your stone far beyond DIY capabilities.`,
      publishDate: '2025-01-25',
      category: 'Maintenance',
      tags: ['general care', 'cleaning', 'maintenance', 'DIY', 'stone protection'],
      image: '/images/10-step-guilde-stone-care.png',
      readTime: '8 min read'
    },
    {
      id: 'stone-maintenance-winter',
      title: 'Protecting Your Stone Work Through Ontario Winters',
      excerpt: 'Essential winter maintenance tips to protect your stone masonry from freeze-thaw damage, salt exposure, and harsh Canadian weather.',
      content: `Ontario winters can be particularly harsh on stone masonry. Understanding proper winter care is essential for preserving your investment and avoiding costly spring repairs.

**Understanding Freeze-Thaw Damage:**
Water expands 9% when it freezes, creating immense pressure within stone pores and mortar joints. This cycle can cause cracks, spalling, and structural damage over time.

**Pre-Winter Preparation:**
• Inspect all mortar joints for cracks or gaps
• Seal any openings to prevent water infiltration  
• Clean stone surfaces of debris and organic matter
• Apply breathable stone sealer if recommended
• Ensure proper drainage around stone structures

**During Winter:**
• Remove snow promptly to prevent ice buildup
• Use calcium chloride instead of rock salt near stonework
• Never use metal tools directly on stone surfaces
• Monitor for ice dam formation on stone structures

**Professional Inspection:**
Schedule annual inspections with certified stone masons to identify potential issues before winter damage occurs. STONEMASONRY.CA offers comprehensive winter preparation services across Ontario.`,
      publishDate: '2025-01-15',
      category: 'Maintenance',
      tags: ['winter care', 'stone maintenance', 'freeze-thaw', 'Ontario weather'],
      image: '/images/protect-your-stone-during-ontario-winters.png',
      readTime: '5 min read'
    },
    {
      id: 'granite-care-guide',
      title: 'Granite Maintenance: Keeping Your Hardstone Pristine',
      excerpt: 'Learn how to maintain the durability and polish of granite countertops, floors, and features with these expert tips.',
      content: `Granite is a popular choice for its durability and beauty. Proper care will keep it looking new for decades.

**Daily Cleaning:**
For daily wipe-downs, use a soft cloth with warm water and a small amount of pH-neutral cleaner or a specialized stone cleaner. Dry the surface afterwards to prevent water spots and enhance shine.

**Stain Resistance & Sealing:**
While highly stain-resistant, granite is not stain-proof. Lighter-colored granites can be more porous. A sealer is recommended to prevent stains from oils and colored liquids. Perform the water test annually to see if resealing is necessary.

**Avoiding Damage:**
Granite is very hard, but it can be chipped by heavy impacts, especially at the edges of countertops. Avoid dropping heavy pots. While it's scratch-resistant, it's not scratch-proof. Always use cutting boards.

**Restoring Shine:**
If your granite countertop loses its luster, it may be due to soap film buildup. Clean it thoroughly with a stone-safe cleaner and rinse well. For long-term dullness, professional polishing may be required to restore its factory finish.`,
      publishDate: '2025-01-22',
      category: 'Materials',
      tags: ['granite', 'hard stone', 'countertops', 'polishing'],
      image: '/images/granite-maintenance.png',
      readTime: '4 min read'
    },
    {
      id: 'limestone-care-guide',
      title: 'Caring for Limestone: A Homeowner\'s Guide',
      excerpt: 'Specific maintenance tips for limestone surfaces, focusing on its sensitivity to acids and the importance of proper sealing.',
      content: `Limestone is a beautiful, classic stone, but as a calcium-carbonate-based material, it requires special care.

**Acids are the Enemy:**
Limestone is highly sensitive to acids. Contact with substances like lemon juice, vinegar, wine, or acidic cleaners will cause "etching"—a chemical reaction that dulls the surface. Clean up acidic spills immediately.

**Gentle Cleaning Routine:**
Only use pH-neutral cleaners on limestone. Never use all-purpose bathroom or tile cleaners, which are often acidic. Use a soft cloth or mop; avoid abrasive scrubbing pads.

**The Importance of Sealing:**
Sealing limestone is non-negotiable. A good quality impregnating sealer will penetrate the pores of the stone to resist staining and give you more time to clean up spills. Reseal every 1-2 years, or as needed based on the water test.

**Outdoor Limestone:**
For exterior limestone, avoid pressure washing, which can be too aggressive. Use a gentle wash and a soft-bristled brush. Ensure good drainage to prevent water from sitting on the surface.`,
      publishDate: '2025-01-20',
      category: 'Materials',
      tags: ['limestone', 'soft stone', 'acid sensitivity', 'sealing'],
      image: '/images/caring-for-limestone.png',
      readTime: '5 min read'
    },
    {
      id: 'choosing-right-stone',
      title: 'Choosing the Right Stone for Your Ontario Climate',
      excerpt: 'A comprehensive guide to selecting stone materials that thrive in Ontario\'s diverse climate conditions and seasonal extremes.',
      content: `Selecting the right stone for Ontario's climate is crucial for longevity and performance. Different stones have varying properties that affect their suitability for our region.

**Climate Considerations for Ontario:**
• Temperature range: -30°C to +35°C
• Freeze-thaw cycles: 50-100 annually
• High humidity in summer
• Snow loads and ice formation
• Acid rain in urban areas

**Best Stone Choices for Ontario:**

**Limestone:**
• Excellent for heritage restoration
• Good freeze-thaw resistance when dense
• Naturally available in Ontario
• Classic appearance for traditional homes

**Granite:**
• Superior durability and hardness
• Excellent freeze-thaw resistance
• Low water absorption
• Ideal for high-traffic areas

**Fieldstone:**
• Naturally weathered and durable
• Authentic Ontario appearance
• Excellent thermal properties
• Perfect for retaining walls

**Sandstone:**
• Good workability for detailed work
• Moderate durability
• Requires proper sealing in Ontario climate
• Beautiful natural color variations

**Avoid These Stones in Ontario:**
• Soft chalky limestone (poor freeze-thaw resistance)
• Highly porous stones without proper sealing
• Stones with visible cracks or fissures

**Professional Consultation:**
Our master stonemasons at STONEMASONRY.CA have over 20 years of experience selecting appropriate stones for Ontario projects. We consider your specific location, exposure, and aesthetic preferences to recommend the perfect stone for your project.`,
      publishDate: '2025-01-10',
      category: 'Materials',
      tags: ['stone selection', 'Ontario climate', 'limestone', 'granite', 'fieldstone'],
      image: '/images/stone-masonry-limestone-pattern-ashlar.jpg',
      readTime: '7 min read'
    },
    {
      id: 'stone-stain-removal',
      title: 'DIY Stone Stain Removal Guide',
      excerpt: 'Identify and remove common stains from your stone surfaces, from oil and rust to coffee and wine, using effective poultice techniques.',
      content: `Stains happen, but they don't have to be permanent. The key is to identify the stain type and use the right method to lift it out.

**The First Rule: Blot, Don't Wipe:**
Immediately blot liquid spills with a paper towel. Wiping spreads the spill into the stone's pores.

**The Power of the Poultice:**
A poultice is a paste-like substance applied to a stain to draw it out of the stone. You mix an absorbent material (like baking soda or paper towels) with a chemical agent, apply it to the stain, and let it dry.

**Poultice Recipes for Common Stains:**

**Oil-Based Stains (Grease, Cooking Oil):**
Mix baking soda with a small amount of water to form a thick paste. Apply to the stain, cover with plastic wrap, and tape the edges. Let it sit for 24 hours, then remove the paste and rinse the area.

**Organic Stains (Coffee, Tea, Wine):**
Mix a few drops of 12% hydrogen peroxide with a few drops of ammonia. Mix this into an absorbent powder until it forms a paste. Apply as described above. Be cautious and test in an inconspicuous area first.

**Rust Stains:**
Rust stains are difficult and may require a commercial rust remover. These products are often acidic and can etch the stone, so follow the manufacturer's directions precisely and consider professional help for severe stains.

**When to Stop:**
If a stain doesn't come out after a couple of attempts, stop. Further DIY efforts could damage the stone. It's time to call a professional who has access to stronger, specialized products.`,
      publishDate: '2025-01-18',
      category: 'DIY',
      tags: ['stain removal', 'poultice', 'DIY', 'cleaning', 'oil stains'],
      image: '/images/diy-stone-stain-removal.png',
      readTime: '6 min read'
    },
    {
      id: 'sandstone-flagstone-care',
      title: 'Sandstone & Flagstone: Patio and Walkway Care',
      excerpt: 'Essential care for porous stones like sandstone and flagstone, focusing on preventing efflorescence, moss growth, and water damage.',
      content: `Sandstone and flagstone are popular choices for patios and walkways due to their natural, earthy look. Their porous nature requires specific care.

**Regular Sweeping:**
Prevent debris, leaves, and soil from accumulating on the surface. This organic matter traps moisture, which can lead to moss growth and staining.

**Gentle Washing:**
Clean your sandstone surfaces with a gentle stream of water and a stiff-bristle (but not wire) brush. Avoid high-pressure washers, which can erode the soft surface of the stone and damage mortar joints.

**Dealing with Moss and Algae:**
For moss and algae growth, use a cleaner specifically formulated for this purpose. Test it on a small area first, as some chemicals can discolor sandstone.

**Efflorescence Management:**
Efflorescence appears as a white, powdery residue on the surface. It's salt migrating from within the stone. In most cases, it can be removed with a stiff, dry brush. For stubborn cases, specific efflorescence removers are available.

**Sealing is Crucial:**
Due to their high porosity, sealing sandstone and flagstone is highly recommended. Use a high-quality breathable, impregnating sealer to help prevent water absorption, freeze-thaw damage, and staining.`,
      publishDate: '2025-01-16',
      category: 'Maintenance',
      tags: ['sandstone', 'flagstone', 'patios', 'exterior care', 'porous stone'],
      image: '/images/sandstone&flagstone.png',
      readTime: '5 min read'
    },
    {
      id: 'stone-sealing-guide',
      title: 'To Seal or Not to Seal: A Guide to Stone Sealers',
      excerpt: 'Understand the types of stone sealers, how to test if your stone needs sealing, and a step-by-step guide to applying sealer like a pro.',
      content: `Sealing is one of the most important maintenance steps for protecting your natural stone investment.

**Why Seal Stone?**
Natural stone is porous. A sealer is a chemical solution that absorbs into the stone to clog its pores, creating a protective barrier against water and oil-based stains.

**Types of Sealers:**
There are two main types: topical and impregnating. Topical sealers form a film on the surface, which can trap moisture and often looks unnatural. Impregnating (or penetrating) sealers are almost always the right choice. They penetrate below the surface, don't change the appearance, and allow the stone to breathe.

**The Water Test: Does My Stone Need Sealing?**
Place a few drops of water on your stone in a well-trafficked area. Wait 15-30 minutes. If the water is still beaded up on the surface, your sealer is working. If the water has absorbed and darkened the stone, it's time to reseal.

**How to Apply Sealer:**
1. **Clean:** The surface must be perfectly clean and dry.
2. **Apply:** Apply a thin, even coat of sealer with a clean cloth or brush.
3. **Dwell:** Let the sealer dwell on the surface for the time recommended by the manufacturer (usually 5-15 minutes). This allows it to penetrate.
4. **Wipe Excess:** This is the most critical step. Before it dries, wipe off ALL excess sealer from the surface with a clean, dry microfiber cloth. Dried sealer residue will leave a hazy film that is very difficult to remove.
5. **Cure:** Let the surface cure for 24-48 hours before exposing it to heavy use or moisture.`,
      publishDate: '2025-01-14',
      category: 'DIY',
      tags: ['sealing', 'stone sealer', 'impregnator', 'maintenance', 'DIY'],
      image: '/images/to-seal-or-not-to-seal.png',
      readTime: '7 min read'
    },
    {
      id: 'fireplace-safety-inspection',
      title: 'Annual Stone Fireplace Safety Inspection Checklist',
      excerpt: 'Complete guide to inspecting your stone fireplace for safety issues, structural problems, and maintenance needs.',
      content: `Annual fireplace inspections are essential for safety and performance. Here's a comprehensive checklist for stone fireplace maintenance.

**Exterior Inspection:**

**Chimney Crown:**
• Check for cracks or deterioration
• Ensure proper water drainage
• Look for vegetation growth
• Verify crown extends beyond brick

**Mortar Joints:**
• Inspect for loose or missing mortar
• Check for white staining (efflorescence)
• Look for cracks larger than 1/8 inch
• Test mortar hardness with gentle pressure

**Stone Surfaces:**
• Check for loose or displaced stones
• Look for cracks or spalling
• Inspect for water damage stains
• Verify structural alignment

**Interior Inspection:**

**Firebox:**
• Check firebrick condition
• Inspect mortar joints in firebox
• Look for cracks in back wall
• Verify proper damper operation

**Hearth:**
• Inspect stone for cracks
• Check mortar joints
• Ensure proper extension from firebox
• Verify level installation

**Mantel and Surround:**
• Check attachment security
• Look for heat damage
• Inspect for loose stones
• Verify proper clearances

**Professional Services:**
STONEMASONRY.CA offers comprehensive fireplace inspections and maintenance services. Our certified technicians can identify potential issues and provide expert repairs to keep your fireplace safe and beautiful.

**When to Call Professionals:**
• Any structural cracks
• Loose or falling stones
• Water damage signs
• Poor draft or smoke issues
• Annual safety inspection`,
      publishDate: '2025-01-05',
      category: 'Safety',
      tags: ['fireplace safety', 'inspection', 'maintenance', 'chimney care'],
      image: '/images/annual-fireplace-safety-inspection.png',
      readTime: '6 min read'
    },
    {
      id: 'fieldstone-veneer-care',
      title: 'Maintaining Rustic Charm: Fieldstone & Veneer Care',
      excerpt: 'Tips for cleaning and maintaining the natural, rugged beauty of fieldstone walls, fireplaces, and exterior veneers.',
      content: `Fieldstone and natural stone veneers offer timeless, rustic appeal. Their irregular texture requires a specific approach to maintenance.

**Routine Cleaning:**
The deep, irregular joints of fieldstone are magnets for dust and cobwebs. For interior fieldstone, use a vacuum with a brush attachment to clean the surfaces and joints regularly.

**Exterior Washing:**
For exterior fieldstone walls, gentle washing is key. Use a garden hose with a spray nozzle to rinse away dirt. Avoid high-pressure washers, as the intense spray can dislodge stones or blast out mortar. A soft-bristled brush can be used for stubborn dirt.

**Mortar Joint Inspection:**
The mortar is the most vulnerable part of a fieldstone structure. Annually inspect all joints for signs of crumbling, cracking, or receding. Repointing (or tuckpointing) may be necessary to repair damaged joints and prevent water infiltration.

**Stain Management:**
Fireplaces often get soot stains. These can be cleaned with a specialized soot remover or a stiff brush and a stone-safe cleaner. Organic stains from leaves or algae on exterior walls can be cleaned with products designed for outdoor stone.

**To Seal or Not to Seal:**
Most fieldstone is left unsealed to maintain its natural, matte appearance. However, in areas prone to heavy water exposure or staining (like an outdoor kitchen backsplash), a breathable, penetrating sealer with a natural finish can be a good protective measure.`,
      publishDate: '2025-01-12',
      category: 'Maintenance',
      tags: ['fieldstone', 'veneer', 'rustic', 'exterior cleaning', 'mortar joints'],
      image: '/images/maintaining-rustic-charm.png',
      readTime: '5 min read'
    }
  ].sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());

  const [selectedPost, setSelectedPost] = React.useState<BlogPost | null>(null);
  const [selectedCategory, setSelectedCategory] = React.useState<string>('All');
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [enlargedImage, setEnlargedImage] = React.useState<string | null>(null);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const POSTS_PER_PAGE = 4;

  // Get unique categories and their counts
  const categories: CategoryFilter[] = React.useMemo(() => {
    const categoryMap = blogPosts.reduce((acc, post) => {
      acc[post.category] = (acc[post.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { name: 'All', count: blogPosts.length },
      ...Object.entries(categoryMap).map(([name, count]) => ({ name, count }))
    ];
  }, [blogPosts]);

  // Filter posts based on category and search
  const filteredPosts = React.useMemo(() => {
    return blogPosts.filter(post => {
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      const matchesSearch = searchTerm === '' ||
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [blogPosts, selectedCategory, searchTerm]);

  // Paginate the filtered posts
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = React.useMemo(() => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);
  }, [filteredPosts, currentPage, POSTS_PER_PAGE]);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm]);

  // Scroll to top when selecting a post
  React.useEffect(() => {
    if (selectedPost) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedPost]);

  return (
    <>
      <AdvancedSEO
        title="Stone Care Guide - Expert Maintenance Tips | Stone Masonry"
        description="Comprehensive stone care guides from Ontario's master stonemasons. Learn proper maintenance, cleaning techniques, and seasonal care for all types of natural stone."
        keywords={[
          "stone care guide Ontario",
          "natural stone maintenance",
          "granite care tips",
          "limestone maintenance",
          "winter stone care",
          "fireplace maintenance",
          "stone sealing guide",
          "masonry maintenance Ontario"
        ]}
        canonicalUrl="https://stonemasonry.ca/stone-care-guide"
        breadcrumbs={[
          { name: "Home", url: "https://stonemasonry.ca/" },
          { name: "Stone Care Guide", url: "https://stonemasonry.ca/stone-care-guide" }
        ]}
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100">
        <AnimatePresence mode="wait">
          {!selectedPost ? (
            // Blog List View
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Hero Header with Texture */}
              <div className="relative py-32 overflow-hidden header-quartz">
                <div className="relative z-10 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                  >
                    <h1 className="mb-6 text-4xl font-bold text-white md:text-5xl lg:text-6xl drop-shadow-lg">
                      Stone Care & Maintenance Guide
                    </h1>
                    <p className="max-w-3xl mx-auto text-xl text-slate-200 drop-shadow-md">
                      Expert advice and maintenance tips from Ontario's master stonemasons
                    </p>
                  </motion.div>
                </div>
              </div>

              <div className="py-20">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">

                  {/* Search and Filter Bar */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="mb-12"
                  >
                    <div className="p-6 bg-white border shadow-md rounded-xl border-slate-200">
                      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {/* Search */}
                        <div className="lg:col-span-2">
                          <label htmlFor="search" className="block mb-2 text-sm font-medium text-slate-700">
                            Search Articles
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              id="search"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              placeholder="Search by title, content, or tags..."
                              className="w-full px-4 py-3 pl-12 border rounded-lg border-slate-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                            <svg
                              className="absolute left-4 top-3.5 w-5 h-5 text-slate-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                              />
                            </svg>
                          </div>
                        </div>

                        {/* Category Filter */}
                        <div>
                          <label className="block mb-2 text-sm font-medium text-slate-700">
                            Filter by Category
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {categories.map((category) => (
                              <button
                                key={category.name}
                                onClick={() => setSelectedCategory(category.name)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedCategory === category.name
                                  ? 'bg-red-600 text-white shadow-md'
                                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                  }`}
                              >
                                {category.name} ({category.count})
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Blog Grid */}
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
                    {paginatedPosts.map((post, index) => (
                      <motion.article
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="flex flex-col overflow-hidden transition-all duration-300 bg-white border shadow-lg cursor-pointer group rounded-xl border-slate-200 hover:shadow-2xl hover:-translate-y-1"
                        onClick={() => setSelectedPost(post)}
                      >
                        <div className="relative h-56 overflow-hidden bg-slate-200">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="absolute inset-0 object-cover w-full h-full transition-transform duration-500 group-hover:scale-110 cursor-zoom-in"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEnlargedImage(post.image);
                            }}
                            onError={(e) => {
                              // Fallback to gradient if image fails to load
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                          <div className="absolute inset-0 transition-transform duration-500 bg-gradient-to-br from-stone-400 to-slate-600 group-hover:scale-110" style={{ display: 'none' }}></div>
                          <div className="absolute bottom-4 left-4">
                            <span className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-full shadow-lg">
                              {post.category}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col flex-grow p-6">
                          <div className="flex items-center mb-3 text-sm text-slate-500">
                            <time dateTime={post.publishDate}>
                              {new Date(post.publishDate).toLocaleDateString('en-CA', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </time>
                            <span className="mx-2">•</span>
                            <span>{post.readTime}</span>
                          </div>

                          <h2 className="mb-3 text-xl font-bold transition-colors duration-200 text-slate-800 line-clamp-2 group-hover:text-red-600">
                            {post.title}
                          </h2>

                          <p className="flex-grow mb-4 text-slate-600 line-clamp-3">
                            {post.excerpt}
                          </p>

                          <div className="flex flex-wrap gap-2 mt-auto">
                            {post.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 text-xs transition-colors duration-200 rounded bg-slate-100 text-slate-600 group-hover:bg-red-50 group-hover:text-red-700"
                              >
                                #{tag}
                              </span>
                            ))}
                            {post.tags.length > 3 && (
                              <span className="px-2 py-1 text-xs text-slate-500">
                                +{post.tags.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.article>
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {filteredPosts.length > POSTS_PER_PAGE && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="flex justify-center mt-12"
                    >
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-l-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-4 py-2 text-sm font-medium border-t border-b ${currentPage === page
                              ? 'bg-red-600 text-white border-red-600'
                              : 'text-slate-700 bg-white border-slate-300 hover:bg-slate-50'
                              }`}
                          >
                            {page}
                          </button>
                        ))}

                        <button
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-r-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {filteredPosts.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="py-20 text-center"
                    >
                      <p className="text-xl text-slate-600">
                        No articles found matching your criteria. Try adjusting your filters.
                      </p>
                    </motion.div>
                  )}

                  {/* Quick links to other sections */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="relative p-8 mt-20 overflow-hidden text-center bg-white border shadow-lg rounded-2xl border-slate-200"
                  >
                    <div className="relative z-10">
                      <h2 className="mb-4 text-2xl font-bold text-slate-800 md:text-3xl">
                        Explore Our Services
                      </h2>
                      <p className="max-w-2xl mx-auto mb-8 text-lg text-slate-600">
                        Discover our complete range of professional stone masonry services
                      </p>
                      <div className="flex flex-col justify-center gap-4 sm:flex-row">
                        <a
                          href="/portfolio"
                          className="inline-flex items-center px-8 py-4 font-semibold text-white transition-all duration-300 bg-red-600 rounded-lg shadow-lg hover:bg-red-700 hover:shadow-xl hover:scale-105"
                        >
                          View Our Portfolio
                          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </a>
                        <a
                          href="/all-services"
                          className="inline-flex items-center px-8 py-4 font-semibold transition-all duration-300 border-2 rounded-lg text-slate-700 border-slate-300 hover:border-slate-400 hover:bg-slate-50"
                        >
                          All Services
                        </a>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ) : (
            // Blog Post Detail View
            <motion.div
              key="detail"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="py-20">
                <div className="max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    onClick={() => setSelectedPost(null)}
                    className="flex items-center mb-8 font-semibold transition-all duration-200 text-slate-600 hover:text-slate-900 group"
                  >
                    <svg
                      className="w-5 h-5 mr-2 transition-transform duration-200 group-hover:-translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to All Articles
                  </motion.button>

                  <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="p-8 bg-white border shadow-xl rounded-2xl md:p-12 border-slate-200"
                  >
                    <div className="mb-8">
                      <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-slate-500">
                        <span className="px-3 py-1 font-medium text-white bg-red-600 rounded-full">
                          {selectedPost.category}
                        </span>
                        <time dateTime={selectedPost.publishDate}>
                          {new Date(selectedPost.publishDate).toLocaleDateString('en-CA', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </time>
                        <span>•</span>
                        <span>{selectedPost.readTime}</span>
                      </div>

                      <h1 className="mb-6 text-3xl font-bold leading-tight md:text-4xl lg:text-5xl text-slate-800">
                        {selectedPost.title}
                      </h1>

                      <p className="text-xl leading-relaxed text-slate-600">
                        {selectedPost.excerpt}
                      </p>
                    </div>

                    <div className="w-full h-px my-8 bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>

                    <div className="prose prose-lg max-w-none prose-slate">
                      {selectedPost.content.split('\n\n').map((paragraph, index) => {
                        if (paragraph.startsWith('**') && paragraph.endsWith(':**')) {
                          return (
                            <h3 key={index} className="flex items-center mt-8 mb-4 text-2xl font-bold text-slate-800">
                              <span className="mr-3 text-red-600">▸</span>
                              {paragraph.replace(/\*\*/g, '').replace(':', '')}
                            </h3>
                          );
                        } else if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                          return (
                            <h4 key={index} className="mt-6 mb-3 text-xl font-semibold text-slate-700">
                              {paragraph.replace(/\*\*/g, '')}
                            </h4>
                          );
                        } else if (paragraph.startsWith('•')) {
                          const items = paragraph.split('\n').filter(item => item.startsWith('•'));
                          return (
                            <ul key={index} className="pl-5 mb-6 space-y-3 list-none">
                              {items.map((item, itemIndex) => (
                                <li key={itemIndex} className="flex items-start">
                                  <span className="flex-shrink-0 w-2 h-2 mt-2 mr-3 bg-red-600 rounded-full"></span>
                                  <span className="text-slate-700">{item.replace('• ', '')}</span>
                                </li>
                              ))}
                            </ul>
                          );
                        } else if (paragraph.match(/^\d+\./)) {
                          // Handle numbered lists
                          return (
                            <div key={index} className="p-6 mb-6 border-l-4 border-red-600 rounded-r-lg bg-slate-50">
                              <p className="leading-relaxed text-slate-700">
                                <strong className="text-red-600">{paragraph.split('.')[0]}.</strong>
                                {paragraph.substring(paragraph.indexOf('.') + 1)}
                              </p>
                            </div>
                          );
                        } else {
                          return (
                            <p key={index} className="mb-6 leading-relaxed text-slate-700">
                              {paragraph}
                            </p>
                          );
                        }
                      })}
                    </div>

                    <div className="pt-8 mt-12 border-t border-slate-200">
                      <h3 className="mb-4 text-lg font-semibold text-slate-700">Article Tags</h3>
                      <div className="flex flex-wrap gap-2 mb-8">
                        {selectedPost.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 text-sm transition-colors duration-200 rounded-full bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-700"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="p-8 bg-gradient-to-br from-slate-100 to-stone-100 rounded-2xl">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <div className="flex items-center justify-center w-16 h-16 bg-red-600 rounded-full">
                              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                              </svg>
                            </div>
                          </div>
                          <div className="flex-grow">
                            <h3 className="mb-2 text-xl font-bold text-slate-800">
                              Need Professional Stone Care?
                            </h3>
                            <p className="mb-4 text-slate-600">
                              From intricate repairs to routine maintenance, STONEMASONRY.CA provides expert stone care services across Ontario. Our certified masons have the knowledge and experience to handle any stone care challenge.
                            </p>
                            <div className="flex flex-col gap-3 sm:flex-row">
                              <a
                                href="/consultation"
                                className="inline-flex items-center justify-center px-6 py-3 font-semibold text-white transition-all duration-300 bg-red-600 rounded-lg shadow hover:bg-red-700 hover:shadow-lg hover:scale-105"
                              >
                                Get Professional Consultation
                                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                              </a>
                              <a
                                href="/all-services"
                                className="inline-flex items-center justify-center px-6 py-3 font-semibold transition-all duration-300 border-2 rounded-lg text-slate-700 border-slate-300 hover:border-slate-400 hover:bg-slate-50"
                              >
                                View Our Services
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.article>

                  {/* Related Articles */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mt-16"
                  >
                    <h2 className="mb-8 text-2xl font-bold text-slate-800">Related Articles</h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {blogPosts
                        .filter(post =>
                          post.id !== selectedPost.id &&
                          (post.category === selectedPost.category ||
                            post.tags.some(tag => selectedPost.tags.includes(tag)))
                        )
                        .slice(0, 3)
                        .map((post) => (
                          <article
                            key={post.id}
                            onClick={() => setSelectedPost(post)}
                            className="p-6 transition-all duration-300 bg-white border rounded-lg shadow-md cursor-pointer border-slate-200 hover:shadow-lg hover:-translate-y-1"
                          >
                            <span className="inline-block px-3 py-1 mb-3 text-xs font-medium text-white bg-red-600 rounded-full">
                              {post.category}
                            </span>
                            <h3 className="mb-2 font-semibold text-slate-800 line-clamp-2">
                              {post.title}
                            </h3>
                            <p className="text-sm text-slate-600 line-clamp-2">
                              {post.excerpt}
                            </p>
                          </article>
                        ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Image Enlargement Modal */}
        <AnimatePresence>
          {enlargedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80"
              onClick={() => setEnlargedImage(null)}
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative max-w-4xl max-h-full"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={enlargedImage}
                  alt="Stone care guide"
                  className="object-contain max-w-full max-h-full rounded-lg shadow-2xl"
                />
                <button
                  onClick={() => setEnlargedImage(null)}
                  className="absolute p-2 transition-all duration-200 bg-white rounded-full top-4 right-4 bg-opacity-20 hover:bg-opacity-30"
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default StoneCareGuide;
