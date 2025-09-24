# AluVerse - Alumni Management Platform

Modern React + TypeScript application for alumni networking and management.

## Features

- **Alumni Directory** - Connect with fellow alumni
- **Startup Hub** - Share and discover startup ideas
- **Reverse Pitching** - Industry experts pitch to students
- **Blog System** - Share insights and experiences
- **Q&A Platform** - Ask questions, get answers
- **Admin Dashboard** - Comprehensive analytics and management

## Tech Stack

- React 18 + TypeScript
- Vite (Build Tool)
- Tailwind CSS
- Recharts
- Supabase (optional backend)

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

The project includes deployment configurations for:

- **Vercel**: `vercel.json` (recommended)
- **Netlify**: `netlify.toml` and `_redirects`
- **Apache**: `.htaccess`

Refer to `DEPLOYMENT.md` for detailed deployment instructions.

## Project Structure

```
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   ├── contexts/           # React contexts  
│   ├── types/              # TypeScript definitions
│   ├── utils/              # Utility functions
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── dist/                   # Production build
└── package.json            # Dependencies
```
