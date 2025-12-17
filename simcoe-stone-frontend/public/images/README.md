# 📸 Image Assets Guide

## 📁 Image Folder Structure

```
public/
└── images/
  ├── logo-stonemasonry.svg      # Company logo for navbar
    ├── heritage-restoration.png    # Heritage building restoration
    ├── modern-patio.png           # Modern residential patio
    ├── commercial-facade.png      # Commercial stone facade
    ├── retaining-wall.png         # Garden retaining wall
    ├── fireplace.png              # Custom stone fireplace
    ├── pathway.png                # Stone pathway and walkway
    └── stone-texture.jpg          # Background texture (used in CSS)
```

## 🔧 How Images Work

### 1. **Automatic Fallbacks**
- All images have automatic fallback to placeholder images
- Fallbacks use the stone brown color (`#8B4513`) with project titles
- No broken image icons will appear

### 2. **Image Requirements**
- **Format**: JPG recommended for photos
- **Size**: Minimum 400x300px for portfolio items
- **Aspect Ratio**: 4:3 recommended for portfolio grid
- **Quality**: Web-optimized (under 200KB per image)

### 3. **Current Image References**

#### Portfolio Component (`Portfolio.tsx`)
- `heritage-restoration.jpg` - Heritage stone restoration project
- `modern-patio.jpg` - Modern residential stone patio
- `commercial-facade.jpg` - Commercial building stone facade
- `retaining-wall.jpg` - Natural stone retaining wall
- `fireplace.jpg` - Custom stone fireplace installation
- `pathway.jpg` - Stone pathway with decorative borders

#### About Component (`About.tsx`)
- `about-craftsman.jpg` - Stone mason working on a project

#### CSS Background (`tailwind.config.js`)
- `stone-texture.jpg` - Stone texture background pattern

## 🎨 Image Specifications

### Portfolio Images
```css
Dimensions: 400x300px minimum
Aspect Ratio: 4:3
Format: JPG
Quality: 80-90%
File Size: <200KB each
```

### About Section Image
```css
Dimensions: 600x400px minimum
Aspect Ratio: 3:2
Format: JPG
Quality: 85-95%
File Size: <300KB
```

### Background Texture
```css
Dimensions: 512x512px or 1024x1024px
Format: JPG
Pattern: Seamless/tileable
File Size: <100KB
```

## 🚀 Adding New Images

### Step 1: Add Image File
```bash
# Place image in public/images/ folder
public/images/your-new-image.jpg
```

### Step 2: Reference in Component
```tsx
// In Portfolio component
{
  id: 7,
  title: "Your New Project",
  description: "Project description",
  image: "/images/your-new-image.jpg",
  category: "Category"
}
```

### Step 3: Optimize Image
- Resize to appropriate dimensions
- Compress to web-optimized quality
- Ensure good contrast and lighting

## 🎯 Image Best Practices

### Photography Tips
1. **Lighting**: Natural light preferred, avoid harsh shadows
2. **Angles**: Show craftsmanship details and overall project
3. **Composition**: Include context (surrounding area)
4. **Quality**: Sharp focus on stone work details

### Technical Optimization
1. **Compression**: Use tools like TinyPNG or ImageOptim
2. **Formats**: JPG for photos, PNG for graphics with transparency
3. **Responsive**: Images automatically scale via CSS
4. **Loading**: Images load progressively with CSS transitions

## 🔄 Fallback System

If images fail to load, the system automatically:

1. **Detects failure** via `onError` handler
2. **Switches source** to placeholder service
3. **Shows project title** on colored background
4. **Maintains layout** without breaking design

### Example Fallback URL
```
https://via.placeholder.com/400x300/8B4513/FFFFFF?text=Heritage+Stone+Restoration
```

## 📱 Responsive Behavior

Images automatically adapt to different screen sizes:

- **Desktop**: Full 400x300px display
- **Tablet**: Scaled to fit 2-column grid
- **Mobile**: Full-width single column
- **Hover Effects**: Scale and shadow animations

## 🎨 Current Image Status

| Image File | Status | Purpose | Component |
|------------|--------|---------|-----------|
| `heritage-restoration.jpg` | ⚠️ Placeholder | Portfolio showcase | Portfolio |
| `modern-patio.jpg` | ⚠️ Placeholder | Portfolio showcase | Portfolio |
| `commercial-facade.jpg` | ⚠️ Placeholder | Portfolio showcase | Portfolio |
| `retaining-wall.jpg` | ⚠️ Placeholder | Portfolio showcase | Portfolio |
| `fireplace.jpg` | ⚠️ Placeholder | Portfolio showcase | Portfolio |
| `pathway.jpg` | ⚠️ Placeholder | Portfolio showcase | Portfolio |
| `about-craftsman.jpg` | ⚠️ Placeholder | About section | About |
| `stone-texture.jpg` | ⚠️ Placeholder | CSS background | Tailwind |

**Legend:**
- ✅ **Real Image**: Actual project photo uploaded
- ⚠️ **Placeholder**: Using fallback placeholder
- ❌ **Missing**: Image referenced but not found

## 🎉 Quick Setup

To get started with real images:

1. **Take Photos**: Capture your best stone masonry projects
2. **Optimize**: Resize and compress images
3. **Upload**: Place files in `public/images/` folder
4. **Test**: Refresh website to see real images
5. **Backup**: Keep originals safe for future use

The fallback system ensures your website looks professional even while you're adding real project photos!
