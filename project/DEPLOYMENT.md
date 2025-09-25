# Deployment Guide

How to deploy AluVerse to fix the "Page not found" error with Single Page Applications.

## The Problem

React apps use client-side routing. When someone visits `yourdomain.com/dashboard` directly, the server looks for a `/dashboard` file and returns 404.

## Solution

Redirect all routes to `index.html` so React Router handles routing client-side.

## Deployment Options

### 1. Vercel

The project includes a `vercel.json` file with proper routing configuration:

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "routes": [
    {
      "src": "/assets/(.*)",
      "dest": "/assets/$1"
    },
    {
      "src": "/(.*\\..+)",
      "dest": "/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

**Deploy to Vercel:**
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### 2. Netlify

The project includes both `netlify.toml` and `_redirects` files:

**netlify.toml:**
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**_redirects:**
```
/*    /index.html   200
```

**Deploy to Netlify:**
1. Drag and drop the `dist` folder to netlify.com
2. Or connect your GitHub repository

### 3. Firebase Hosting

The project includes `firebase.json`:

```json
{
  "hosting": {
    "public": "dist",
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

**Deploy to Firebase:**
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### 4. Apache Shared Hosting

The project includes `.htaccess` file:

```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QR,L]
```

**Deploy to Apache:**
1. Build the project: `npm run build`
2. Upload the contents of the `dist` folder to your web hosting
3. The `.htaccess` file will handle routing automatically

### 5. Nginx

Add this to your Nginx server configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/your/dist/folder;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 6. GitHub Pages

For GitHub Pages, you need a custom 404.html that redirects to index.html:

Create `public/404.html`:
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>AluVerse</title>
    <script type="text/javascript">
      var pathSegmentsToKeep = 0;
      var l = window.location;
      l.replace(
        l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
        l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +
        l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
        (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
        l.hash
      );
    </script>
  </head>
  <body>
  </body>
</html>
```

## Build and Deploy Steps

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Test locally:**
   ```bash
   npm run preview
   ```

3. **Deploy the `dist` folder contents** to your chosen hosting platform.

## Troubleshooting

- **Still getting 404 errors?** Make sure the server is serving the correct configuration file (`.htaccess`, `_redirects`, etc.)
- **Assets not loading?** Check that the `assets` folder is deployed correctly
- **Blank page?** Check browser console for JavaScript errors

## Environment Variables

If you're using environment variables:

1. Create `.env.production` for production settings
2. Configure your hosting platform to set the environment variables
3. Make sure variables are prefixed with `VITE_` for Vite to include them

The deployment configurations are now properly set up to handle SPA routing across all major hosting platforms!