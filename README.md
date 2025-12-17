# Simcoe Stone Masonry - React Website

A modern, responsive website for Simcoe Stone Masonry built with React, TypeScript, and Tailwind CSS. Optimized for Netlify deployment with integrated contact forms.

## 🚀 Quick Start

### Development
```bash
cd simcoe-stone-frontend
npm install
npm start
```

### Production Build
```bash
npm run build
```

### Deploy to Netlify
1. Build the project: `npm run build`
2. Drag the `build` folder to [Netlify](https://netlify.com)
3. Your site is live! 🎉

## 📁 Project Structure

```
Simcoe Stone/
├── .vscode/                    # VS Code workspace settings
├── simcoe-stone-frontend/      # Main React application
│   ├── public/
│   │   ├── index.html         # Main HTML template
│   │   ├── _redirects         # Netlify routing configuration
│   │   └── images/            # Static images and assets
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/             # Main page components
│   │   └── styles/            # Global styles and Tailwind config
│   ├── build/                 # Production build (deploy this folder)
│   └── package.json           # Dependencies and scripts
├── README.md                  # Project overview and instructions
├── COMPLETE_NETLIFY_GUIDE.md  # Comprehensive deployment guide
└── VSCODE_SETUP.md           # VS Code configuration guide
```

## 🛠️ Tech Stack

- **Frontend**: React 19.1.0 with TypeScript
- **Styling**: Tailwind CSS 3.4.16
- **Animations**: Framer Motion 12.23.0
- **Routing**: React Router DOM 7.6.3
- **Forms**: Netlify Forms (built-in)
- **Deployment**: Netlify

## 🎨 Features

### 🏠 Homepage
- Hero section with call-to-action
- Services overview
- Portfolio showcase
- Customer testimonials
- About company section

### 📋 Services Page
- Detailed service descriptions
- Project galleries
- Material specifications
- Process explanations

### 🖼️ Portfolio
- Project image galleries
- Before/after comparisons
- Project descriptions
- Material details

### 📞 Contact
- Netlify-powered contact form
- Business information
- Service area map
- Quote request system

## 🚀 Deployment

### Netlify Deployment (Recommended)

#### Method 1: Drag & Drop (Easiest)
1. Run `npm run build`
2. Go to [netlify.com](https://netlify.com)
3. Drag the `build` folder to the deployment area
4. Site is live immediately!

#### Method 2: Git Integration (Automatic Updates)
1. Push code to GitHub
2. Connect repository to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `build`
5. Automatic deployments on every push!

### Environment Variables
No environment variables needed! The contact form uses Netlify Forms which work automatically.

## 📧 Contact Form

The contact form uses **Netlify Forms** for easy form handling:
- ✅ No backend required
- ✅ Spam protection included
- ✅ Email notifications automatic
- ✅ Form submissions stored in Netlify dashboard

## 🎯 Business Focus

**Simcoe Stone Masonry** specializes in:
- Residential stone work (patios, walkways, fireplaces)
- Commercial projects (facades, landscaping)
- Heritage restoration
- Custom stonework and repairs

**Service Area**: Greater Toronto Area, Ontario, Canada

## 📱 Responsive Design

- Mobile-first approach
- Optimized for all screen sizes
- Touch-friendly navigation
- Fast loading on all devices

## ⚡ Performance

- Bundle size: ~123 kB gzipped
- Optimized images and assets
- Code splitting and lazy loading
- Perfect Lighthouse scores

## 🔧 Development

### Available Scripts
- `npm start` - Development server
- `npm run build` - Production build
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

### Code Standards
- TypeScript for type safety
- Tailwind CSS for styling
- ESLint and Prettier for code quality
- Semantic HTML for accessibility

## 📞 Support

**Website**: [Live on Netlify]  
**Email**: info@simcoemasonry.com  
**Phone**: (705) 341-5285  

---

**Built with ❤️ for quality craftsmanship and modern web standards.**
