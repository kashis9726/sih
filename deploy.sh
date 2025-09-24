#!/bin/bash

echo "🚀 AluVerse Deployment Script"
echo "================================"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit - AluVerse ready for deployment"
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

# Build the project
echo "🔨 Building project for production..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please fix errors and try again."
    exit 1
fi

echo ""
echo "🎉 Your app is ready for deployment!"
echo ""
echo "📋 Next Steps:"
echo "1. Push your code to GitHub:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "2. Deploy to Vercel:"
echo "   - Go to https://vercel.com"
echo "   - Click 'Import Project'"
echo "   - Connect your GitHub repository"
echo "   - Vercel will auto-detect Vite and deploy!"
echo ""
echo "3. Alternative - Deploy to Netlify:"
echo "   - Go to https://netlify.com"
echo "   - Drag and drop your 'dist' folder"
echo "   - Your site will be live instantly!"
echo ""
echo "🔗 Your public URLs will be:"
echo "   Vercel: https://your-project-name.vercel.app"
echo "   GitHub Pages: https://yourusername.github.io/your-repo-name"
