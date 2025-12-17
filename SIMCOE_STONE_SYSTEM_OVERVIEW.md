# Simcoe Stone Masonry - Complete System Overview

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Technical Architecture](#technical-architecture)
3. [Component Structure](#component-structure)
4. [Pages & Routes](#pages--routes)
5. [Features & Functionality](#features--functionality)
6. [SEO & Performance](#seo--performance)
7. [Business Information](#business-information)
8. [Deployment & Configuration](#deployment--configuration)
9. [Development Guidelines](#development-guidelines)

---

## 🏗️ Project Overview

### **Business Context**
- **Company**: Simcoe Stone Masonry
- **Industry**: Professional stone masonry services
- **Location**: Ontario, Canada
- **Services**: Custom stonework, emergency repairs, restoration, fireplaces, retaining walls, patios

### **Website Purpose**
- Professional business website showcasing stone masonry expertise
- Portfolio presentation with honest before/after transformations
- Lead generation through estimate requests and consultations
- Emergency repair service accessibility
- Educational content for stone care and maintenance

### **Target Audience**
- Homeowners seeking quality stonework
- Commercial property developers
- Architects and contractors
- Emergency repair customers

---

## 🛠️ Technical Architecture

### **Core Technologies**
```
Frontend Framework: React 18 + TypeScript
Styling: Tailwind CSS
Animations: Framer Motion
Build Tool: Vite
Deployment: Netlify
Forms: Netlify Forms
Analytics: Google Analytics 4
```

### **Project Structure**
```
simcoe-stone-frontend/
├── public/
│   ├── images/                 # Project images and assets
│   ├── _redirects             # Netlify routing configuration
│   └── index.html
├── src/
│   ├── components/            # React components
│   ├── data/                  # JSON data files
│   ├── styles/                # Global styles
│   └── App.tsx               # Main application component
├── package.json
└── build/                    # Production build output
```

### **Development Environment**
- **Node.js**: Latest LTS version
- **Package Manager**: npm
- **Development Server**: React Scripts
- **Hot Reload**: Enabled for development
- **TypeScript**: Strict mode enabled

---

## 🧩 Component Structure

### **Layout Components**
| Component | Purpose | Features |
|-----------|---------|----------|
| `Navbar.tsx` | Main navigation | Responsive menu, animated logo, mobile hamburger |
| `Footer.tsx` | Site footer | Contact info, social links, company details |
| `NotFoundPage.tsx` | 404 error page | Custom error handling with navigation |

### **Page Components**
| Component | Route | Purpose |
|-----------|-------|---------|
| `Hero.tsx` | `/` | Homepage hero section with animations |
| `About.tsx` | `/about` | Company information and team |
| `Services.tsx` | `/services` | Service offerings and descriptions |
| `Portfolio.tsx` | `/portfolio` | Project showcase and gallery |
| `ContactForm.tsx` | `/contact` | Contact information and form |
| `Estimate.tsx` | `/estimate` | Estimate request form |
| `EmergencyRepair.tsx` | `/emergency` | Emergency service information |
| `FAQ.tsx` | `/faq` | Frequently asked questions |
| `StoneCareGuide.tsx` | `/stone-care-guide` | Maintenance instructions |

### **Feature Components**
| Component | Purpose | Functionality |
|-----------|---------|---------------|
| `MixedPortfolio.tsx` | Portfolio display | Before/after toggles, project showcases |
| `Testimonials.tsx` | Customer reviews | Animated testimonial cards |
| `SocialShare.tsx` | Social media integration | Share buttons, follow links |
| `AdvancedSEO.tsx` | SEO optimization | Meta tags, structured data |
| `Analytics.tsx` | Tracking & metrics | Google Analytics integration |
| `MobileOptimization.tsx` | Mobile enhancements | Touch-friendly components |

### **Utility Components**
| Component | Purpose | Features |
|-----------|---------|----------|
| `SEO.tsx` | Basic SEO | Title and meta description |
| `StructuredData.tsx` | Schema markup | Business schema for search engines |
| `AutoSEOEnhancer.tsx` | Advanced SEO | Dynamic meta tags and optimization |

---

## 🌐 Pages & Routes

### **Main Navigation Routes**
```
/ (Home)                    - Landing page with hero and overview
/services                   - Service offerings and pricing
/portfolio                  - Project gallery and case studies
/about                      - Company information and team
/stone-care-guide          - Maintenance and care instructions
/faq                       - Frequently asked questions
/estimate                  - Estimate request form
/emergency                 - Emergency repair services
/contact                   - Contact information and form
/consultation              - Consultation booking
```

### **Legacy Routes (Redirects)**
```
/free-estimate             - Redirects to /estimate
/emergency-repair          - Redirects to /emergency
```

### **Error Handling**
```
/*                         - 404 Not Found page with navigation
```

---

## ⚡ Features & Functionality

### **Core Features**
- ✅ **Responsive Design**: Mobile-first approach with breakpoints
- ✅ **Portfolio System**: Mixed approach with genuine before/after and showcases
- ✅ **Contact Forms**: Netlify Forms integration with validation
- ✅ **Emergency Services**: Dedicated emergency repair section
- ✅ **SEO Optimization**: Comprehensive SEO with structured data
- ✅ **Performance**: Optimized images and lazy loading
- ✅ **Analytics**: Google Analytics 4 integration

### **Portfolio System**
```typescript
// Two-tier portfolio structure
beforeAfterProjects: [
  // Genuine transformation projects with toggle functionality
  {
    id: "two-story-scaffolding",
    title: "Two-Story Scaffolding Stone Installation",
    image_before: "/images/two-story-before.jpg",
    image_after: "/images/two-story-after.jpg"
  }
]

showcaseProjects: [
  // Individual project showcases
  {
    id: "custom-fireplace-1",
    title: "Custom Natural Stone Fireplace",
    image: "/images/custom-fireplace-1.jpg"
  }
]
```

### **Animation System**
- **Framer Motion**: Smooth page transitions and micro-interactions
- **Floating Elements**: Animated background elements for visual appeal
- **Hover Effects**: Interactive buttons and cards
- **Scroll Animations**: Trigger animations on scroll

### **Mobile Optimization**
- **Touch-Friendly**: Minimum 44px touch targets
- **Performance**: Optimized for mobile devices
- **Contact Buttons**: Fixed mobile contact bar
- **Responsive Images**: Optimized for different screen sizes

---

## 🎯 SEO & Performance

### **SEO Implementation**
```typescript
// Advanced SEO Features
- Dynamic meta tags per page
- Structured data (JSON-LD)
- Open Graph tags for social sharing
- Canonical URLs
- Breadcrumb navigation
- XML sitemap generation
- Local business schema
```

### **Performance Optimizations**
- **Image Optimization**: WebP format, lazy loading
- **Code Splitting**: Component-based chunks
- **Caching**: Browser and CDN caching
- **Minification**: CSS and JavaScript compression
- **CDN**: Netlify global CDN distribution

### **Analytics & Tracking**
```typescript
// Google Analytics 4 Events
- Page views
- Form submissions
- Phone number clicks
- Emergency service requests
- Portfolio interactions
- Social media shares
```

---

## 🏢 Business Information

### **Contact Details**
```
Company: Simcoe Stone Masonry
Email: stonemasonrysimcoe@gmail.com
Phone: (705) 341-5285
Service Area: Ontario, Canada
Website: https://simcoestonemasonry.ca
```

### **Social Media**
```
Facebook: @stonemasonrysimcoe
Instagram: @stonemasonrysimcoe
TikTok: @stonemasonrysimcoe
LinkedIn: /company/simcoe-stone-masonry
```

### **Business Hours**
```
Monday - Friday: 7:00 AM - 7:00 PM
Saturday: 8:00 AM - 4:00 PM
Sunday: By appointment only
Emergency: 24/7 availability
```

### **Services Offered**
1. **Residential Services**
   - Custom fireplace installation
   - Retaining wall construction
   - Patio and walkway installation
   - Stone veneer application

2. **Commercial Services**
   - Building facade work
   - Landscape masonry
   - Heritage restoration

3. **Emergency Services**
   - 24/7 emergency repairs
   - Structural assessments
   - Safety consultations

---

## 🚀 Deployment & Configuration

### **Netlify Configuration**
```toml
# netlify.toml
[build]
  publish = "build"
  command = "npm run build"

[[redirects]]
  from = "/free-estimate"
  to = "/estimate"
  status = 301

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### **Environment Variables**
```bash
# Production Environment
REACT_APP_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
REACT_APP_SITE_URL=https://simcoestonemasonry.ca
REACT_APP_CONTACT_EMAIL=stonemasonrysimcoe@gmail.com
```

### **Build Process**
```bash
# Development
npm start                    # Start development server
npm run build               # Create production build
npm run test                # Run test suite

# Deployment
git push origin main        # Auto-deploy to Netlify
```

---

## 📋 Development Guidelines

### **Code Standards**
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality enforcement
- **Prettier**: Code formatting
- **Component Structure**: Functional components with hooks

### **File Naming Conventions**
```
Components: PascalCase.tsx (e.g., ContactForm.tsx)
Utilities: camelCase.ts (e.g., analytics.ts)
Styles: kebab-case.css (e.g., global-styles.css)
Images: kebab-case.jpg (e.g., hero-background.jpg)
```

### **Component Template**
```typescript
import React from 'react';
import { motion } from 'framer-motion';

interface ComponentProps {
  // Define props with TypeScript
}

export const ComponentName: React.FC<ComponentProps> = ({ props }) => {
  // Component logic
  return (
    <motion.div className="tailwind-classes">
      {/* JSX content */}
    </motion.div>
  );
};

export default ComponentName;
```

### **Styling Guidelines**
- **Tailwind CSS**: Utility-first approach
- **Responsive Design**: Mobile-first breakpoints
- **Color Palette**: Consistent brand colors
- **Typography**: Hierarchical text sizing

---

## 📊 Key Metrics & KPIs

### **Website Performance**
- **Page Load Speed**: < 3 seconds
- **Core Web Vitals**: Green scores
- **Mobile Performance**: 90+ Lighthouse score
- **SEO Score**: 95+ Lighthouse score

### **Business Metrics**
- **Lead Generation**: Estimate form submissions
- **Emergency Calls**: Phone click tracking
- **Portfolio Engagement**: Before/after toggles
- **Social Media**: Follow and share tracking

---

## 🔧 Maintenance & Updates

### **Regular Maintenance**
- **Security Updates**: Monthly dependency updates
- **Content Updates**: Portfolio additions, service updates
- **Performance Monitoring**: Monthly performance audits
- **SEO Monitoring**: Keyword ranking tracking

### **Future Enhancements**
- **Blog System**: Stone care and project articles
- **Customer Portal**: Project tracking for clients
- **Online Booking**: Advanced scheduling system
- **AR Visualization**: Stone pattern preview tools

---

## 📞 Support & Contact

### **Technical Support**
- **Development Team**: Available for updates and modifications
- **Hosting Support**: Netlify support team
- **Domain Management**: Domain registrar support

### **Business Support**
- **Email**: stonemasonrysimcoe@gmail.com
- **Phone**: (705) 341-5285
- **Emergency**: 24/7 availability

---

*Last Updated: January 2025*  
*Version: 2.0*  
*Build Status: Production Ready* ✅

---

## 🎯 Quick Reference

### **Essential Commands**
```bash
npm start                   # Development server
npm run build              # Production build
npm test                   # Test suite
```

### **Important Files**
- `src/App.tsx` - Main application router
- `src/components/Navbar.tsx` - Navigation component
- `public/_redirects` - Netlify routing
- `package.json` - Dependencies and scripts

### **Key URLs**
- **Production**: https://simcoestonemasonry.ca
- **Repository**: Available on request
- **Analytics**: Google Analytics dashboard
- **Forms**: Netlify Forms dashboard
