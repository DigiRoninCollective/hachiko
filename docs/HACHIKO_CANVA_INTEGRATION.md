# Hachiko Fortune Generator + Canva App Integration

This guide shows how to integrate your Hachiko fortune generator website with the Canva App for creating AI-powered fortune cards.

## 🎯 Integration Overview

We have two components that work together:

1. **Hachiko Fortune Generator Website** (`/home/zkronin/projects/nomnom/`)
   - Generates loyalty-themed wisdom quotes
   - Provides quick download and Canva integration options
   - Built with Next.js, React, and Tailwind CSS

2. **Hachiko Canva App** (`/home/zkronin/projects/nomnom/hachiko-fortunes/`)
   - Runs inside Canva editor as a plugin
   - Uses AI to generate custom fortune card designs
   - Built with Canva Apps SDK and React

## 🔄 User Experience Flow

### **Option 1: Quick Download Path**
```
User gets fortune → Click "Download Now" → Beautiful image generated → Share on social media
```

### **Option 2: Canva AI Design Path**
```
User gets fortune → Click "Design in Canva" → Opens Canva with fortune → AI generates custom design → Full editing capabilities
```

## 🛠️ Technical Integration

### **Website Integration Code**

The website already has the Canva integration component:

```tsx
// src/components/CanvaFortuneIntegration.tsx
import CanvaFortuneIntegration from "./CanvaFortuneIntegration";

// Used in LoyaltyFortuneGenerator.tsx
{currentFortune && (
  <div id="canva-integration" className="max-w-4xl mx-auto mt-16">
    <CanvaFortuneIntegration fortune={currentFortune} />
  </div>
)}
```

### **Canva App Configuration**

The Canva app has been customized for Hachiko:

```tsx
// hachiko-fortunes/src/components/prompt_input.tsx
const examplePrompts: string[] = [
  "Hachiko waiting faithfully at Shibuya station with golden light",
  "Loyal dog silhouette against sunset with Japanese architecture",
  "Elegant fortune card with loyalty symbols and warm colors",
  // ... 20+ Hachiko-themed prompts
];
```

## 🚀 Deployment Steps

### **Step 1: Setup Canva App**

1. **Navigate to Canva App Directory**:
   ```bash
   cd /home/zkronin/projects/nomnom/hachiko-fortunes
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm start
   ```

4. **Preview in Canva**:
   ```bash
   canva apps preview
   ```

### **Step 2: Configure Environment**

Create `.env` file in the Canva app directory:

```env
CANVA_APP_ID=your_app_id_here
CANVA_APP_ORIGIN=https://app-yourid.canva-apps.com
CANVA_BACKEND_PORT=3001
CANVA_FRONTEND_PORT=8080
CANVA_BACKEND_HOST=http://localhost:3001
```

### **Step 3: Connect Website to Canva**

The website already has the integration, but you need to:

1. **Update Canva API Credentials** in `src/lib/canva-api.ts`:
   ```env
   NEXT_PUBLIC_CANVA_CLIENT_ID=your_canva_client_id
   CANVA_CLIENT_SECRET=your_canva_client_secret
   ```

2. **Create Canva Developer Account** at canva.com/developers

3. **Create OAuth App** with:
   - Redirect URI: `https://your-domain.com/canva-callback`
   - Scopes: `design:content:read`, `design:content:write`, etc.

## 🎨 Design System Integration

### **Brand Colors**
Both systems use the same Hachiko brand palette:
- **Deep Blue**: `#1E3A8A` (primary background)
- **Gold**: `#F59E0B` (primary accent)
- **Warm Brown**: `#92400E` (secondary accent)
- **Cream**: `#FEF3C7` (light accent)

### **Typography**
- **Website**: Inter font via Tailwind CSS
- **Canva App**: Canva's UI Kit typography system

### **Iconography**
- **Website**: Lucide React icons
- **Canva App**: Canva's built-in icon system

## 📊 User Analytics & Tracking

### **Website Events**
```typescript
// Track fortune generation
analytics.track('fortune_generated', {
  category: fortune.category,
  timestamp: Date.now()
});

// Track download choice
analytics.track('download_option_chosen', {
  option: 'quick_download' | 'canva_design',
  fortune_id: fortune.id
});
```

### **Canva App Events**
```typescript
// Track AI design generation
analytics.track('ai_design_generated', {
  prompt_length: prompt.length,
  generation_time: generationDuration
});
```

## 🔧 Advanced Features

### **1. Fortune-to-Prompt Mapping**

Create intelligent prompts based on fortune categories:

```typescript
const generatePromptFromFortune = (fortune: FortuneData): string => {
  const categoryPrompts = {
    "Loyalty": "Elegant design featuring loyalty symbols with gold accents",
    "Devotion": "Watercolor style illustration of faithful devotion",
    "Companionship": "Warm design showing friendship and companionship",
    "Wisdom": "Zen-inspired design with wisdom elements"
  };
  
  return `${categoryPrompts[fortune.category]}, featuring the quote: "${fortune.fortune}"`;
};
```

### **2. Template Suggestion System**

Suggest templates based on fortune content:

```typescript
const suggestTemplate = (fortune: FortuneData): string => {
  if (fortune.fortune.includes("time") || fortune.fortune.includes("wait")) {
    return "minimal-elegant";
  } else if (fortune.fortune.includes("heart") || fortune.fortune.includes("love")) {
    return "vintage-classic";
  }
  return "modern-bold";
};
```

### **3. Cross-Platform Sync**

Allow users to save favorites between website and Canva:

```typescript
const syncToFavorites = async (fortune: FortuneData, designUrl?: string) => {
  await fetch('/api/favorites', {
    method: 'POST',
    body: JSON.stringify({
      fortune,
      designUrl,
      timestamp: Date.now()
    })
  });
};
```

## 📈 Monetization Opportunities

### **Premium Templates**
- **Basic**: Free templates (4 included)
- **Premium**: $2.99/month - 20+ exclusive templates
- **Pro**: $9.99/month - Unlimited templates + advanced features

### **AI Credits**
- **Free**: 5 AI designs per day
- **Premium**: 50 AI designs per day
- **Pro**: Unlimited AI designs

### **Brand Partnerships**
- Partner with Japanese brands for sponsored templates
- Affiliate links for Canva Pro subscriptions
- Custom fortune card printing services

## 🎯 Success Metrics

### **User Engagement**
- Fortune generation rate
- Download vs. Canva design split
- Time spent in Canva editor
- Social media sharing rate

### **Technical Performance**
- Image generation speed
- Canva app load time
- Error rates and fallback success
- Mobile vs. desktop usage

### **Business Impact**
- Daily active users
- Premium conversion rate
- Social media reach
- Brand mentions and engagement

## 🚀 Next Steps

1. **Complete Canva App Setup**
   - Finish customizing the Canva app
   - Test AI generation quality
   - Submit to Canva App Store

2. **Integrate Analytics**
   - Add tracking to both platforms
   - Set up conversion funnels
   - Monitor user behavior

3. **Launch Marketing Campaign**
   - Promote AI fortune card creation
   - Share user designs on social media
   - Partner with Japanese culture influencers

4. **Scale Features**
   - Add more template categories
   - Implement premium features
   - Expand to other platforms (Instagram, TikTok)

---

This integration creates a **powerful synergy** between your Hachiko fortune generator and Canva's AI capabilities, giving users both instant gratification and professional creative tools. 🐕✨
