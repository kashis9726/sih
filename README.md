# AluVerse - Alumni Management Platform

Modern React + TypeScript application for alumni networking and management with role-based access control.

## ✨ Live Demo

🌐 **Public URL**: https://kashis9726.github.io/AluVerse-project/

## 🚀 Quick Access

The application now starts with a **login page** where you can access different user roles:

### 📱 Demo Login Options:
- **🎓 Student Demo** - Access student dashboard and features
- **👨‍🎓 Alumni Demo** - Access alumni networking and career features  
- **👨‍💼 Admin Demo** - Access administrative dashboard and analytics

### 🔑 Manual Login Credentials:
- **Student**: `student@demo.com` / `demo`
- **Alumni**: `alumni@demo.com` / `demo`  
- **Admin**: `admin@demo.com` / `demo`

## Features

### 🎓 Student Dashboard
- Course tracking and academic progress
- Mentorship requests and connections
- Career guidance and internship opportunities
- Alumni networking and events

### 👨‍🎓 Alumni Dashboard  
- **Alumni Directory** - Connect with fellow alumni
- **Startup Hub** - Share and discover startup ideas
- **Reverse Pitching** - Industry experts pitch to students
- **Blog System** - Share insights and experiences
- **Q&A Platform** - Ask questions, get answers
- **Mentorship** - Mentor current students

### 👨‍💼 Admin Dashboard
- **User Management** - Manage students, alumni, and permissions
- **Analytics Dashboard** - Comprehensive platform analytics
- **Event Management** - Create and manage alumni events
- **Content Moderation** - Monitor blogs, Q&A, and posts

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
