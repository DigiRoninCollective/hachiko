# Canva Integration Setup Guide

This guide will help you set up the real Canva API integration for your Hachiko fortune generator.

## 🚀 Quick Setup

### 1. Create Canva Developer Account
1. Go to [Canva Developers](https://www.canva.com/developers/)
2. Sign up for a developer account
3. Navigate to the dashboard

### 2. Create OAuth Application
1. Click "Create Integration" 
2. Choose "Connect API" (not Apps SDK)
3. Fill in the details:
   - **Integration Name**: "Hachiko Fortune Generator"
   - **Description**: "Professional design creation for Hachiko token wisdom"
   - **Website**: `https://your-domain.com`
   - **Redirect URI**: `https://your-domain.com/canva-callback`

### 3. Configure Scopes
Under "Scopes", enable these permissions:
- ✅ `design:content:read` - Read design content
- ✅ `design:content:write` - Create and edit designs  
- ✅ `design:meta:read` - Read design metadata
- ✅ `asset:read` - Read assets
- ✅ `asset:write` - Upload assets
- ✅ `brandtemplate:meta:read` - Read brand templates
- ✅ `brandtemplate:content:read` - Read brand template content
- ✅ `profile:read` - Read user profile

### 4. Get Credentials
1. Save your **Client ID** 
2. Generate and save your **Client Secret** (you can only view it once!)

### 5. Environment Variables
Add these to your `.env.local` file:

```env
NEXT_PUBLIC_CANVA_CLIENT_ID=your_client_id_here
CANVA_CLIENT_SECRET=your_client_secret_here
```

### 6. Create Callback Page
Create `src/app/canva-callback/page.tsx`:

```tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CanvaCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      
      if (code) {
        // Exchange code for token
        // This would be handled by your CanvaAPI class
        localStorage.setItem('canva_auth_code', code);
        router.push('/?canva_connected=true');
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-[#1E3A8A] flex items-center justify-center">
      <div className="text-white">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
        <p>Connecting to Canva...</p>
      </div>
    </div>
  );
}
```

## 🎨 Template Setup

### Create Custom Templates
1. Design your fortune card templates in Canva
2. Save them as brand templates
3. Get their template IDs
4. Update the template mapping in `src/lib/canva-api.ts`:

```typescript
private getTemplateId(templateName: string): string {
  const templateMap: Record<string, string> = {
    'minimal-elegant': 'YOUR_ACTUAL_TEMPLATE_ID',
    'mystical-wisdom': 'YOUR_MYSTICAL_TEMPLATE_ID', 
    'modern-bold': 'YOUR_MODERN_TEMPLATE_ID',
    'vintage-classic': 'YOUR_VINTAGE_TEMPLATE_ID'
  };
  
  return templateMap[templateName] || templateMap['minimal-elegant'];
}
```

## 🔧 Testing the Integration

### 1. Test OAuth Flow
```bash
# Start your development server
pnpm dev

# Navigate to your site
# Click "Connect to Canva"
# You should be redirected to Canva for authorization
```

### 2. Test Design Creation
1. Get a fortune from the generator
2. Click "Connect to Canva" 
3. Complete OAuth flow
4. Select a template
5. Click "Create in Canva"
6. Should open Canva editor with your fortune design

## 🚀 Production Deployment

### Environment Variables
```env
# Production
NEXT_PUBLIC_CANVA_CLIENT_ID=prod_client_id
CANVA_CLIENT_SECRET=prod_client_secret

# Development  
NEXT_PUBLIC_CANVA_CLIENT_ID=dev_client_id
CANVA_CLIENT_SECRET=dev_client_secret
```

### Security Notes
- Never expose client secret in frontend code
- Use server-side API routes for token exchange
- Implement proper error handling
- Add rate limiting for API calls

## 🎯 Advanced Features

### Custom Asset Upload
```typescript
// Upload Hachiko logo to use in designs
const logoFile = new File([logoData], 'hachiko-logo.png', { type: 'image/png' });
const assetId = await canvaAPI.uploadAsset(logoFile, 'Hachiko Logo');
```

### Batch Design Creation
```typescript
// Create multiple designs at once
const fortunes = [
  { fortune: "Loyalty is eternal...", category: "Loyalty" },
  { fortune: "Devotion strengthens bonds...", category: "Devotion" }
];

const designs = await Promise.all(
  fortunes.map(f => canvaAPI.createFortuneDesign(f))
);
```

### Export Options
```typescript
// Export in different formats
const pngUrl = await canvaAPI.exportDesign(designId, 'png');
const pdfUrl = await canvaAPI.exportDesign(designId, 'pdf');
const svgUrl = await canvaAPI.exportDesign(designId, 'svg');
```

## 🐛 Troubleshooting

### Common Issues
1. **"Invalid redirect_uri"** - Make sure redirect URI matches exactly in Canva dashboard
2. **"Insufficient scopes"** - Enable all required scopes in your Canva app
3. **"CORS errors"** - Use server-side API routes for token exchange
4. **"Template not found"** - Verify template IDs are correct and accessible

### Debug Mode
Add this to your Canva API class for debugging:
```typescript
constructor(clientId: string, clientSecret: string) {
  this.clientId = clientId;
  this.clientSecret = clientSecret;
  
  // Enable debug mode
  if (process.env.NODE_ENV === 'development') {
    console.log('Canva API initialized in debug mode');
  }
}
```

## 📞 Support

- [Canva Developer Documentation](https://www.canva.dev/docs/connect/)
- [Canva API Reference](https://www.canva.dev/docs/connect/api/)
- [Community Forum](https://community.canva.dev/)

---

**Ready to launch!** Once set up, users will be able to create professional Canva designs from their Hachiko fortunes, opening up incredible viral potential for your token project. 🐕✨
