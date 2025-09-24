# Instructions for GitHub Pages Deployment
# Copy this file and replace YOUR_REPO_NAME with your actual repository name

# 1. Update vite.config.ts - Replace 'YOUR_REPO_NAME' with your actual repository name
#    base: process.env.NODE_ENV === 'production' ? '/YOUR_REPO_NAME/' : '/',

# 2. Build the project
npm run build

# 3. Deploy to GitHub Pages:
#    - Upload the 'dist' folder contents to your GitHub repository
#    - Go to Settings > Pages > Source: "Deploy from a branch"
#    - Select your main branch

# 4. Your app will be live at:
#    https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/

# 5. If you get a blank page, check:
#    - Make sure the base path in vite.config.ts matches your repo name
#    - Clear browser cache
#    - Check browser console for errors
