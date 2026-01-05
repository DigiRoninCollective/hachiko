#!/bin/bash

# 🚀 NomNom Hachiko Token - Render Deployment Script
# This script helps you prepare and deploy to Render

echo "🎯 NomNom Hachiko Token - Render Deployment Helper"
echo "=================================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📝 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit: NomNom Hachiko Token application"
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

# Check if remote is set
if ! git remote get-url origin &>/dev/null; then
    echo "⚠️ No GitHub remote found!"
    echo "Please set up your GitHub repository first:"
    echo "1. Create a new repository on GitHub"
    echo "2. Run: git remote add origin https://github.com/YOUR_USERNAME/nomnom.git"
    echo "3. Run: git push -u origin main"
    echo ""
    echo "Then come back and run this script again!"
    exit 1
fi

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "🔄 Switching to main branch..."
    git checkout main
fi

# Add all changes
echo "📦 Adding all changes..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "feat: Ready for Render deployment

✨ Features:
- Complete Hachiko token website
- Interactive chat with wallet integration  
- Wisdom generator functionality
- Responsive design for all devices
- Gold-themed UI with Solana branding

🔧 Technical:
- Next.js 16 with app router
- Production build optimized
- Environment variables configured
- Rate limiting ready for production

🚀 Ready for Render deployment!"

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push origin main

echo ""
echo "🎉 SUCCESS! Your code is now on GitHub!"
echo ""
echo "📋 Next Steps for Render Deployment:"
echo "1. Go to https://dashboard.render.com"
echo "2. Click 'New +' → 'Web Service'"
echo "3. Connect your GitHub repository"
echo "4. Configure settings:"
echo "   - Build Command: npm run build"
echo "   - Start Command: npm run start"
echo "   - Environment: Node"
echo "5. Set environment variables (see .env.example)"
echo "6. Click 'Create Web Service'"
echo ""
echo "🌐 Your app will be available at: https://nomnom-hachiko.onrender.com"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT_GUIDE.md"
