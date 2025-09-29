import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Post, Startup, ReversePitch, Event, Question, ChatRoom, User, Answer, Message } from '../types';

interface AppContextType {
  posts: Post[];
  startups: Startup[];
  reversePitches: ReversePitch[];
  events: Event[];
  questions: Question[];
  chatRooms: ChatRoom[];
  users: User[];
  addPost: (post: Omit<Post, 'id' | 'createdAt'>) => void;
  addStartup: (startup: Omit<Startup, 'id' | 'createdAt'>) => void;
  addReversePitch: (pitch: Omit<ReversePitch, 'id' | 'createdAt'>) => void;
  addEvent: (event: Omit<Event, 'id' | 'createdAt'>) => void;
  addQuestion: (question: Omit<Question, 'id' | 'createdAt'>) => void;
  addAnswer: (questionId: string, answer: Omit<Answer, 'id' | 'createdAt'>) => void;
  likePost: (postId: string, userId: string) => void;
  likeStartup: (startupId: string, userId: string) => void;
  joinEvent: (eventId: string, userId: string) => void;
  getChatRoom: (participantIds: string[]) => ChatRoom;
  sendMessage: (roomId: string, message: any) => void;
  updateUserPoints: (userId: string, points: number) => void;
  submitReverseSolution: (pitchId: string, payload: { studentId: string; content: string }) => void;
  acceptReverseSolution: (pitchId: string, submissionId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [startups, setStartups] = useState<Startup[]>([]);
  const [reversePitches, setReversePitches] = useState<ReversePitch[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Load data from localStorage
    setPosts(JSON.parse(localStorage.getItem('posts') || '[]'));
    setStartups(JSON.parse(localStorage.getItem('startups') || '[]'));
    setReversePitches(JSON.parse(localStorage.getItem('reversePitches') || '[]'));
    setEvents(JSON.parse(localStorage.getItem('events') || '[]'));
    setQuestions(JSON.parse(localStorage.getItem('questions') || '[]'));
    setChatRooms(JSON.parse(localStorage.getItem('chatRooms') || '[]'));
    setUsers(JSON.parse(localStorage.getItem('users') || '[]'));

    // Backfill: if users exist from an older run but posts are empty, inject a few demo blogs/jobs
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const existingPosts = JSON.parse(localStorage.getItem('posts') || '[]');
    if (existingUsers && existingUsers.length > 0 && (!existingPosts || existingPosts.length === 0)) {
      try {
        const now = new Date();
        const alumni2 = existingUsers.find((u: any) => u.id === 'u-alumni-2') || existingUsers.find((u: any) => u.role === 'alumni');
        const alumni4 = existingUsers.find((u: any) => u.id === 'u-alumni-4') || existingUsers.find((u: any) => u.role === 'alumni');
        const student1 = existingUsers.find((u: any) => u.id === 'u-student-1') || existingUsers.find((u: any) => u.role === 'student');
        const demoBackfill: any[] = [];
        if (alumni2) {
          demoBackfill.push({
            id: 'pb-1',
            authorId: alumni2.id,
            author: alumni2,
            content: 'My Data Science Journey: From Campus to Industry — curated resources and tips.',
            image: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=1200&auto=format&fit=crop',
            likes: [],
            comments: [],
            createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24),
            type: 'post',
            category: 'Data',
            tags: ['AI','Career']
          });
        }
        if (alumni4) {
          demoBackfill.push({
            id: 'pb-2',
            authorId: alumni4.id,
            author: alumni4,
            content: 'Building a FinTech from Zero to One: lessons from the trenches.',
            image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&auto=format&fit=crop',
            likes: [],
            comments: [],
            createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 36),
            type: 'post',
            category: 'FinTech',
            tags: ['Startups','Founder']
          });
        }
        if (student1) {
          demoBackfill.push({
            id: 'pb-3',
            authorId: student1.id,
            author: student1,
            content: 'Freelance: Dashboard Revamp for Startup • Budget: ₹30,000 • React + Tailwind',
            image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&auto=format&fit=crop',
            likes: [],
            comments: [],
            createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 6),
            type: 'job'
          });
        }

        localStorage.setItem('posts', JSON.stringify(demoBackfill));
        setPosts(demoBackfill as any);
      } catch {}
    }

    // Seed demo data if storage is empty for a lively first-run experience
    if (!existingUsers || existingUsers.length === 0) {
      const demoUsers: User[] = [
        {
          id: 'u-admin',
          name: 'Admin',
          email: 'admin@demo.com',
          role: 'admin',
          department: 'Administration',
          profileImage: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=256&auto=format&fit=crop',
          points: 920,
          badges: ['🏆 Admin', '🎯 Visionary'],
          isVerified: true,
          isOnline: true,
        },
        {
          id: 'u-alumni-1',
          name: 'Darshan Patel',
          email: 'darshan@alumni.com',
          role: 'alumni',
          department: 'Computer Science',
          graduationYear: 2019,
          skills: ['React', 'Node.js', 'Cloud'],
          company: 'TechCorp',
          position: 'Senior Engineer',
          bio: 'Mentoring students in web and cloud.',
          profileImage: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=256&auto=format&fit=crop',
          points: 780,
          badges: ['🎓 Top Mentor', '💼 Job Creator'],
          isVerified: true,
          isOnline: true,
        },
        {
          id: 'u-alumni-2',
          name: 'Aesha Shah',
          email: 'aesha@alumni.com',
          role: 'alumni',
          department: 'Electronics',
          graduationYear: 2018,
          skills: ['AI', 'ML', 'Data'],
          company: 'Amazon',
          position: 'ML Engineer',
          bio: 'Helping with AI/ML career paths.',
          profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=256&auto=format&fit=crop',
          points: 650,
          badges: ['📈 Career Guide'],
          isVerified: true,
          isOnline: false,
        },
        {
          id: 'u-alumni-3',
          name: 'Isha Mehta',
          email: 'isha@alumni.com',
          role: 'alumni',
          department: 'Information Technology',
          graduationYear: 2020,
          skills: ['Data Science', 'Python', 'Visualization'],
          company: 'Google',
          position: 'Data Analyst',
          bio: 'Data storyteller and mentor.',
          profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=256&auto=format&fit=crop',
          points: 540,
          badges: ['🎖️ Event Organizer'],
          isVerified: true,
          isOnline: true,
        },
        {
          id: 'u-alumni-4',
          name: 'Drashti Desai',
          email: 'drashti@alumni.com',
          role: 'alumni',
          department: 'Electronics',
          graduationYear: 2017,
          skills: ['Entrepreneurship', 'FinTech'],
          company: 'FinTech Labs',
          position: 'Founder',
          bio: 'Hiring interns for fintech products.',
          profileImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=256&auto=format&fit=crop',
          points: 610,
          badges: ['🎖️ Event Organizer'],
          isVerified: true,
          isOnline: false,
        },
        {
          id: 'u-alumni-5',
          name: 'Saksh Verma',
          email: 'saksh@alumni.com',
          role: 'alumni',
          department: 'Information Technology',
          graduationYear: 2016,
          skills: ['Backend', 'Scala', 'Distributed Systems'],
          company: 'ScaleX',
          position: 'Staff Engineer',
          bio: 'Sharing my journey from campus projects to distributed systems at scale.',
          profileImage: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=256&auto=format&fit=crop',
          points: 700,
          badges: ['📈 Career Guide'],
          isVerified: true,
          isOnline: true,
        },
        {
          id: 'u-student-1',
          name: 'Kashis',
          email: 'kashis@student.com',
          role: 'student',
          department: 'Computer Science',
          graduationYear: 2025,
          skills: ['JavaScript', 'UI/UX'],
          bio: 'Frontend enthusiast and hackathon lover.',
          profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256&auto=format&fit=crop',
          points: 420,
          badges: ['🏅 Event Attendee'],
          isOnline: true,
        },
        {
          id: 'u-student-2',
          name: 'Daksh Verma',
          email: 'daksh@student.com',
          role: 'student',
          department: 'Mechanical',
          graduationYear: 2026,
          skills: ['Product', 'CAD'],
          bio: 'Building products and communities.',
          profileImage: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=256&auto=format&fit=crop',
          points: 310,
          badges: ['💬 Helpful'],
          isOnline: false,
        },
        {
          id: 'u-student-3',
          name: 'Meera Joshi',
          email: 'meera@student.com',
          role: 'student',
          department: 'Civil',
          graduationYear: 2025,
          skills: ['IoT', 'Sustainability'],
          bio: 'Passionate about green cities and circular economy.',
          profileImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=256&auto=format&fit=crop',
          points: 280,
          badges: ['🌱 Eco Innovator'],
          isOnline: true,
        },
        {
          id: 'u-bot',
          name: 'Echo Bot',
          email: 'echo@bot.com',
          role: 'alumni',
          department: 'Automation',
          points: 0,
          badges: ['🤖 Auto'],
          profileImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=256&auto=format&fit=crop',
          isVerified: true,
          isOnline: true,
        },
      ];

      const now = new Date();

      const demoPosts: Post[] = [
        {
          id: 'p-1',
          authorId: 'u-alumni-1',
          author: demoUsers[1],
          content: 'Opening 2 internship positions for React/Node at TechCorp. Apply via Opportunities! 🚀',
          likes: ['u-student-1', 'u-student-2'],
          comments: [],
          createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2),
          type: 'job',
        },
        {
          id: 'p-2',
          authorId: 'u-student-1',
          author: demoUsers[5],
          content: 'Won 2nd place in the campus ideathon with an AI notes summarizer 🎉',
          likes: ['u-alumni-1'],
          comments: [],
          createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 10),
          type: 'achievement',
        },
        // Blog-style alumni posts (type 'post')
        {
          id: 'p-3',
          authorId: 'u-alumni-2',
          author: demoUsers[2],
          content: 'My Data Science Journey: From Campus to Amazon — Tips and resources for students getting started.',
          image: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=1200&auto=format&fit=crop',
          likes: ['u-student-1', 'u-student-2'],
          comments: [],
          createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 40),
          type: 'post',
        },
        {
          id: 'p-4',
          authorId: 'u-alumni-4',
          author: demoUsers[4],
          content: 'Building a FinTech from Zero to One: What I learned in 3 years.',
          image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&auto=format&fit=crop',
          likes: ['u-student-1'],
          comments: [],
          createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 72),
          type: 'post',
        },
        // Zeviur internship by Kashis (will appear under Opportunities)
        {
          id: 'p-5',
          authorId: 'u-student-1',
          author: demoUsers[5],
          content: 'Data Science Intern @ Zeviur • Internship\nStipend: ₹20,000/month\nLocation: Remote\nSkills: Python, SQL, Pandas, Visualization\n\n6-month research-focused internship working with datasets to build dashboards and analytical models.',
          image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop',
          likes: ['u-alumni-2'],
          comments: [],
          createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 6),
          type: 'job',
        },
        // Blog by Kashis (student) that invites alumni to connect
        {
          id: 'p-6',
          authorId: 'u-student-1',
          author: demoUsers[5],
          content: 'My Alumni Mentor Story: How one conversation changed my internship prep. If you are an alumni in Data Science, I would love your feedback on my roadmap! 💬',
          image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&auto=format&fit=crop',
          likes: ['u-alumni-1', 'u-alumni-2'],
          comments: [],
          createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 3),
          type: 'post',
        },
        // More internships by Drashti (FinTech Labs)
        {
          id: 'p-7',
          authorId: 'u-alumni-4',
          author: demoUsers[4],
          content: 'Data Analytics Intern @ FinTech Labs • Internship\nStipend: ₹25,000/month\nLocation: Hybrid (Ahmedabad)\nSkills: SQL, Python, Excel, Looker/PowerBI\n\nWork with transaction datasets to build dashboards and growth insights.',
          image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=1200&auto=format&fit=crop',
          likes: ['u-student-1', 'u-student-2'],
          comments: [],
          createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 5),
          type: 'job',
        },
        {
          id: 'p-8',
          authorId: 'u-alumni-4',
          author: demoUsers[4],
          content: 'Product Ops Intern @ FinTech Labs • Internship\nStipend: ₹18,000/month\nLocation: Remote\nSkills: Documentation, User Research, Analytics\n\nHelp us run user studies, write docs, and coordinate releases across teams.',
          image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&auto=format&fit=crop',
          likes: ['u-student-2'],
          comments: [],
          createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 2),
          type: 'job',
        },
        // Freelance opportunity by Alumni (Darshan)
        {
          id: 'p-9',
          authorId: 'u-alumni-1',
          author: demoUsers[1],
          content: 'Freelance: Dashboard Revamp for Startup • Freelance\nBudget: ₹30,000 (4 weeks)\nLocation: Remote\nSkills: React, Tailwind, Charts\n\nLooking for a student to redesign a dashboard with a fresh 3D/gradient look and interactive charts.',
          image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&auto=format&fit=crop',
          likes: ['u-student-1'],
          comments: [],
          createdAt: new Date(now.getTime() - 1000 * 60 * 45),
          type: 'job',
        },
        // Extra demo blog by Kashis (student)
        {
          id: 'p-11',
          authorId: 'u-student-1',
          author: demoUsers[5],
          content: 'What I learned interviewing with startups: projects that stand out and how to talk about impact.',
          image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&auto=format&fit=crop',
          likes: ['u-alumni-2'],
          comments: [],
          createdAt: new Date(now.getTime() - 1000 * 60 * 30),
          type: 'post',
        },
        // Alumni experience share by Saksh
        {
          id: 'p-12',
          authorId: 'u-alumni-5',
          author: demoUsers.find(u=>u.id==='u-alumni-5') as any,
          content: 'From Campus to Distributed Systems: lessons on scaling services, picking the right abstractions, and early career decisions.',
          image: 'https://images.unsplash.com/photo-1517433456452-f9633a875f6f?w=1200&auto=format&fit=crop',
          likes: ['u-student-1','u-student-2'],
          comments: [],
          createdAt: new Date(now.getTime() - 1000 * 60 * 25),
          type: 'post',
        },
        // Blog by Kashis about internship at Google
        {
          id: 'p-10',
          authorId: 'u-student-1',
          author: demoUsers[5],
          content: 'How I prepared for my Google Internship (SWE) — timelines, resources, and mock interview tactics. Happy to answer questions — DM me! 🎯',
          image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop',
          likes: ['u-alumni-2', 'u-student-2'],
          comments: [],
          createdAt: new Date(now.getTime() - 1000 * 60 * 20),
          type: 'post',
        },
        // User-requested demo blogs
        {
          id: 'p-13',
          authorId: 'u-student-1',
          author: demoUsers[5],
          // title/domain per request
          // title
          // domain -> category
          content: "I'm excited to share my story of how I transitioned from a student at LDCE to a founder in the FinTech space. Here are some lessons I learned along the way...",
          image: 'https://placehold.co/1200x600/F06292/fff?text=FinTech',
          likes: [],
          comments: [],
          createdAt: new Date('2025-10-01T00:00:00'),
          type: 'post',
          // extra fields (handled loosely in UI)
          title: 'My Journey into FinTech: From Student to Startup' as any,
          category: 'FinTech' as any,
          tags: ['FinTech','Startup','Journey'] as any,
        } as any,
        {
          id: 'p-14',
          authorId: 'u-student-2',
          author: demoUsers[6],
          content: "Thinking about a career in data? I'll walk you through a typical day on the job, the tools I use, and the skills you'll need to succeed.",
          image: 'https://placehold.co/1200x600/4CAF50/fff?text=Data',
          likes: [],
          comments: [],
          createdAt: new Date('2025-09-28T00:00:00'),
          type: 'post',
          title: 'A Day in the Life of a Data Scientist' as any,
          category: 'Data' as any,
          tags: ['Data','Career','Tools'] as any,
        } as any,
        {
          id: 'p-15',
          authorId: 'u-alumni-1',
          author: demoUsers[1],
          content: 'From my final year project to my post-graduate research, here\'s a detailed look at my journey and advice for students interested in a research career.',
          image: 'https://placehold.co/1200x600/2196F3/fff?text=Research',
          likes: [],
          comments: [],
          createdAt: new Date('2025-09-25T00:00:00'),
          type: 'post',
          title: 'My Research Experience at a Leading University' as any,
          category: 'Research' as any,
          tags: ['Research','Academia','Advice'] as any,
        } as any,
      ];

      // Enrich demo blogs with structured category and tags (kept via casts to avoid type churn)
      try {
        const p3: any = (demoPosts as any[]).find(p => p.id === 'p-3');
        if (p3) { p3.category = 'Data'; p3.tags = ['AI','Career','Amazon']; }
        const p4: any = (demoPosts as any[]).find(p => p.id === 'p-4');
        if (p4) { p4.category = 'FinTech'; p4.tags = ['Startups','Founder','Product']; }
        const p6: any = (demoPosts as any[]).find(p => p.id === 'p-6');
        if (p6) { p6.category = 'Mentorship'; p6.tags = ['Career','Roadmap','Alumni']; }
        const p10: any = (demoPosts as any[]).find(p => p.id === 'p-10');
        if (p10) { p10.category = 'Career'; p10.tags = ['Interview','Google','Prep']; }
        const p11: any = (demoPosts as any[]).find(p => p.id === 'p-11');
        if (p11) { p11.category = 'Career'; p11.tags = ['Startups','Interviews','Impact']; }
        const p12: any = (demoPosts as any[]).find(p => p.id === 'p-12');
        if (p12) { p12.category = 'Backend'; p12.tags = ['Distributed Systems','Scala','Architecture']; }
      } catch {}

      const demoEvents: Event[] = [
        {
          id: 'e-1',
          organizerId: 'u-alumni-2',
          organizer: demoUsers[2],
          title: 'AI Career Roadmap',
          description: 'A walkthrough of AI/ML roles, skills, and projects.',
          date: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 3),
          location: 'Online',
          type: 'webinar',
          attendees: ['u-student-1', 'u-student-2'],
          createdAt: now,
        },
        {
          id: 'e-2',
          organizerId: 'u-admin',
          organizer: demoUsers[0],
          title: 'Alumni-Student Meetup',
          description: 'Networking, mentorship signups, and project showcases.',
          date: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 10),
          location: 'Auditorium',
          type: 'seminar',
          attendees: ['u-student-1'],
          createdAt: now,
        },
      ];

      const demoQuestions: Question[] = [
        {
          id: 'q-1',
          authorId: 'u-student-2',
          author: demoUsers[6],
          title: 'How to build a strong resume for internships?',
          content: 'What projects and sections matter the most for a 2nd-year student? Any templates?',
          tags: ['career', 'resume', 'internships'],
          answers: [
            {
              id: 'a-1',
              authorId: 'u-alumni-1',
              author: demoUsers[1],
              content: 'Focus on 2–3 solid projects with clear impact, add relevant skills, and keep it to 1 page.',
              upvotes: ['u-student-1'],
              createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 3),
            },
          ],
          createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 4),
        },
        {
          id: 'q-2',
          authorId: 'u-student-1',
          author: demoUsers[5],
          title: 'Best way to prepare for React interviews?',
          content: 'What topics should I master for frontend internships focused on React?',
          tags: ['react', 'frontend', 'interview'],
          answers: [],
          createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 8),
        },
        {
          id: 'q-3',
          authorId: 'u-student-1',
          author: demoUsers[5],
          title: 'How can I start freelancing as a student?',
          content: 'Where do I find first clients? What should I put in a proposal and how do I price small projects?',
          tags: ['freelance', 'career', 'pricing'],
          answers: [
            {
              id: 'a-2',
              authorId: 'u-alumni-4',
              author: demoUsers[4],
              content: 'Start with 2 sample projects in your portfolio, offer a fixed-scope MVP for ₹5k–₹10k, deliver in a week, and ask for a testimonial. Use LinkedIn + college network for first 3 leads.',
              upvotes: ['u-student-2'],
              createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 2),
            },
          ],
          createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 5),
        },
      ];

      const demoStartups: Startup[] = [
        {
          id: 's-1',
          ownerId: 'u-student-1',
          owner: demoUsers[5],
          title: 'NoteWise',
          tagline: 'AI-powered lecture summarizer',
          stage: 'mvp',
          problem: 'Students miss context from long lectures',
          solution: 'Summarize and highlight key concepts using LLMs',
          progress: 'MVP built, 50 beta users',
          fundingNeeded: '$2k for infra',
          attachments: ['https://images.unsplash.com/photo-1551281044-8af0d9d4f063?w=1200&auto=format&fit=crop'],
          likes: ['u-alumni-1', 'u-alumni-2'],
          comments: [],
          createdAt: now,
        },
        // AgriSmart by Sahil Khan (Prototype)
        {
          id: 's-2',
          ownerId: 'u-student-1',
          owner: demoUsers[5],
          title: 'AgriSmart',
          tagline: 'AI-powered solutions for smart farming',
          stage: 'prototype',
          problem: 'Lack of real-time crop monitoring and predictive analytics for farmers, leading to suboptimal yields and resource wastage.',
          solution: 'IoT sensors + AI dashboards provide real-time soil, weather, and crop health data, offering predictive insights for irrigation, fertilization, and pest control.',
          progress: 'Developed a working prototype of sensors and a basic dashboard. Successfully tested in a small farm environment.',
          fundingNeeded: '',
          attachments: [],
          likes: [],
          comments: [],
          createdAt: now,
          // extra structured fields consumed by UI with casts
          projectImage: 'https://placehold.co/600x400/8BC34A/fff?text=AgriSmart+Project' as any,
          supportNeeded: ['Mentorship (Agri-Tech)', 'Seed Funding ($10K)', 'Networking (VCs)'] as any,
          alumniSupportOffers: [
            {
              alumniName: 'Priya Sharma',
              alumniAvatar: 'https://placehold.co/100x100/FF9800/fff?text=PS',
              offerType: 'Contact & Experience',
              message: 'I\'m a seasoned agronomist and investor. Happy to connect and offer insights on market entry and scalable growth strategies. I can introduce you to key industry players.'
            }
          ] as any,
        } as any,
        // EduConnect by Rahul Mehta (Concept)
        {
          id: 's-3',
          ownerId: 'u-student-2',
          owner: demoUsers[6],
          title: 'EduConnect',
          tagline: 'Gamified learning platform for K-12 students',
          stage: 'concept',
          problem: 'Traditional learning methods often fail to engage younger students, leading to disinterest and difficulty in grasping complex concepts.',
          solution: 'An interactive mobile app with gamified lessons, quizzes, and personalized learning paths, adapting to each student\'s pace and style.',
          progress: 'Market research completed, initial wireframes designed. Seeking feedback on UI/UX and educational content strategy.',
          fundingNeeded: '',
          attachments: [],
          likes: [],
          comments: [],
          createdAt: now,
          projectImage: 'https://placehold.co/600x400/9C27B0/fff?text=EduConnect+Platform' as any,
          supportNeeded: ['Mentorship (Ed-Tech)', 'UI/UX Feedback', 'Networking (Educators)'] as any,
          alumniSupportOffers: [
            {
              alumniName: 'Ankit Gupta',
              alumniAvatar: 'https://placehold.co/100x100/607D8B/fff?text=AG',
              offerType: 'Experience',
              message: 'I have experience in building educational apps. Can offer advice on gamification mechanics and content structuring. Let\'s chat.'
            },
            {
              alumniName: 'Sneha Reddy',
              alumniAvatar: 'https://placehold.co/100x100/E91E63/fff?text=SR',
              offerType: 'Contact',
              message: 'I know a few school principals who might be interested in piloting your platform. Happy to make introductions.'
            }
          ] as any,
        } as any,
        // EcoCycle by Meera Joshi (MVP Developed -> mvp)
        {
          id: 's-4',
          ownerId: 'u-student-3',
          owner: (demoUsers as any[]).find(u => u.id === 'u-student-3')!,
          title: 'EcoCycle',
          tagline: 'Smart waste management system for urban areas',
          stage: 'mvp',
          problem: 'Inefficient waste collection and segregation in cities, leading to environmental pollution and resource wastage.',
          solution: 'IoT-enabled smart bins that optimize collection routes, integrated with a recycling marketplace for sorted waste.',
          progress: 'Minimum Viable Product (MVP) for smart bins developed and tested. Seeking partnerships with municipal corporations.',
          fundingNeeded: '',
          attachments: [],
          likes: [],
          comments: [],
          createdAt: now,
          projectImage: 'https://placehold.co/600x400/00BCD4/fff?text=EcoCycle+Waste' as any,
          supportNeeded: ['Funding (Pre-Seed)', 'Networking (Municipalities)', 'Logistics Expertise'] as any,
          alumniSupportOffers: [] as any,
        } as any,
      ];

      const demoReversePitches: ReversePitch[] = [
        {
          id: 'rp-1',
          authorId: 'u-alumni-1',
          author: demoUsers[1],
          title: 'TechCorp AI Internship Program',
          description: 'We are hiring 2 AI interns to work on model optimization. Pitch why we should pick you!',
          industry: 'AI',
          budget: '$500/month stipend',
          deadline: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 20),
          submissions: [],
          createdAt: now,
        },
        // Problem-first challenges with solution rewards
        {
          id: 'rp-2',
          authorId: 'u-alumni-2',
          author: demoUsers[2],
          title: 'Reduce Model Inference Cost by 30% without Quality Loss',
          description: 'At Amazon-scale, even small gains matter. Propose ideas to reduce inference costs for a multilingual classification model while maintaining F1. You may consider quantization, distillation, batching strategies, or caching. Share a brief plan, expected trade-offs, and evaluation design.',
          industry: 'Technology',
          budget: '₹15,000 + 1:1 Mentorship for winning proposal',
          deadline: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 10),
          submissions: [],
          createdAt: now,
        },
        {
          id: 'rp-3',
          authorId: 'u-alumni-4',
          author: demoUsers[4],
          title: 'FinTech: KYC Drop-off Reduction Ideas',
          description: 'Our onboarding sees a 22% drop-off at KYC. Suggest product/UX and lightweight ML heuristics to improve completion while keeping compliance intact. Include a simple funnel hypothesis, proposed experiments, and how you would measure uplift.',
          industry: 'Finance',
          budget: '₹12,000 + Product Mentorship + Potential Internship Fast-track',
          deadline: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 15),
          submissions: [],
          createdAt: now,
        },
      ];

      const demoChatRooms: ChatRoom[] = [
        {
          id: 'c-1',
          participants: ['u-student-1', 'u-alumni-1'],
          messages: [
            {
              id: 'm-1',
              senderId: 'u-student-1',
              sender: demoUsers[5],
              content: 'Hi Rahul! Could you review my resume? 😊',
              timestamp: new Date(now.getTime() - 1000 * 60 * 30),
              type: 'text',
            },
            {
              id: 'm-2',
              senderId: 'u-alumni-1',
              sender: demoUsers[1],
              content: 'Sure, send it across. Also join the AI webinar this Friday!',
              timestamp: new Date(now.getTime() - 1000 * 60 * 25),
              type: 'text',
            },
          ],
          createdAt: new Date(now.getTime() - 1000 * 60 * 40),
          updatedAt: new Date(now.getTime() - 1000 * 60 * 25),
        },
        {
          id: 'c-2',
          participants: ['u-student-2', 'u-alumni-2'],
          messages: [],
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 'c-3',
          participants: ['u-student-1', 'u-bot'],
          messages: [
            {
              id: 'm-1',
              senderId: 'u-bot',
              sender: demoUsers.find(u=>u.id==='u-bot')!,
              content: 'Hello! I am Echo Bot. Send me a message and I will echo it back 🤖',
              timestamp: new Date(now.getTime() - 1000 * 60 * 10),
              type: 'text',
            },
          ],
          createdAt: now,
          updatedAt: now,
        },
      ];

      localStorage.setItem('users', JSON.stringify(demoUsers));
      localStorage.setItem('posts', JSON.stringify(demoPosts));
      localStorage.setItem('events', JSON.stringify(demoEvents));
      localStorage.setItem('questions', JSON.stringify(demoQuestions));
      localStorage.setItem('startups', JSON.stringify(demoStartups));
      localStorage.setItem('reversePitches', JSON.stringify(demoReversePitches));
      localStorage.setItem('chatRooms', JSON.stringify(demoChatRooms));

      // Initialize state with the seeded data
      setUsers(demoUsers);
      setPosts(demoPosts);
      setEvents(demoEvents);
      setQuestions(demoQuestions);
      setStartups(demoStartups);
      setReversePitches(demoReversePitches);
      setChatRooms(demoChatRooms);
    }
  }, []);

  const addPost = (postData: Omit<Post, 'id' | 'createdAt'>) => {
    const newPost: Post = {
      ...postData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem('posts', JSON.stringify(updatedPosts));

    // Gamification: Opportunity Giver badge for job posters
    if (newPost.type === 'job' && newPost.authorId) {
      const authoredJobs = updatedPosts.filter(p => p.type === 'job' && p.authorId === newPost.authorId).length;
      const thresholds = [1, 3, 10];
      const labels = ['🎯 Opportunity Giver I', '🎯 Opportunity Giver II', '🎯 Opportunity Giver III'];
      thresholds.forEach((t, idx) => {
        if (authoredJobs >= t) {
          const u = users.find(u => u.id === newPost.authorId);
          if (u && !(u.badges || []).includes(labels[idx])) {
            const updatedUsers = users.map(x => x.id === u.id ? { ...x, badges: [...(x.badges||[]), labels[idx]] } : x);
            setUsers(updatedUsers);
            localStorage.setItem('users', JSON.stringify(updatedUsers));
          }
        }
      });
    }
  };

  const addStartup = (startupData: Omit<Startup, 'id' | 'createdAt'>) => {
    const newStartup: Startup = {
      ...startupData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    const updatedStartups = [newStartup, ...startups];
    setStartups(updatedStartups);
    localStorage.setItem('startups', JSON.stringify(updatedStartups));
  };

  const addReversePitch = (pitchData: Omit<ReversePitch, 'id' | 'createdAt'>) => {
    const newPitch: ReversePitch = {
      ...pitchData,
      id: Date.now().toString(),
      createdAt: new Date(),
    } as ReversePitch;
    const updated = [newPitch, ...reversePitches];
    setReversePitches(updated);
    localStorage.setItem('reversePitches', JSON.stringify(updated));
  };

  const addEvent = (eventData: Omit<Event, 'id' | 'createdAt'>) => {
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    const updatedEvents = [newEvent, ...events];
    setEvents(updatedEvents);
    localStorage.setItem('events', JSON.stringify(updatedEvents));
  };

  const addQuestion = (questionData: Omit<Question, 'id' | 'createdAt'>) => {
    const newQuestion: Question = {
      ...questionData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    const updatedQuestions = [newQuestion, ...questions];
    setQuestions(updatedQuestions);
    localStorage.setItem('questions', JSON.stringify(updatedQuestions));
  };

  const addAnswer = (questionId: string, answerData: Omit<Answer, 'id' | 'createdAt'>) => {
    const updatedQuestions = questions.map((q) => {
      if (q.id === questionId) {
        const newAnswer: Answer = {
          ...answerData,
          id: Date.now().toString(),
          createdAt: new Date(),
        } as Answer;
        return { ...q, answers: [...q.answers, newAnswer] };
      }
      return q;
    });
    setQuestions(updatedQuestions);
    localStorage.setItem('questions', JSON.stringify(updatedQuestions));

    // Gamification: award points for answering and Helpful Mentor badges for alumni
    if ((answerData as any).authorId) {
      updateUserPoints((answerData as any).authorId, 5);
      const authorId = (answerData as any).authorId as string;
      const totalAnswersByAuthor = updatedQuestions.reduce((acc, q) => acc + (q.answers || []).filter(a => (a as any).authorId === authorId).length, 0);
      const thresholds = [1, 5, 15];
      const labels = ['💡 Helpful Mentor I', '💡 Helpful Mentor II', '💡 Helpful Mentor III'];
      thresholds.forEach((t, idx) => {
        if (totalAnswersByAuthor >= t) {
          const u = users.find(u => u.id === authorId);
          if (u && !(u.badges || []).includes(labels[idx])) {
            const updatedUsers = users.map(x => x.id === u.id ? { ...x, badges: [...(x.badges||[]), labels[idx]] } : x);
            setUsers(updatedUsers);
            localStorage.setItem('users', JSON.stringify(updatedUsers));
          }
        }
      });
    }
  };

  const likePost = (postId: string, userId: string) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const likes = post.likes.includes(userId)
          ? post.likes.filter(id => id !== userId)
          : [...post.likes, userId];
        return { ...post, likes };
      }
      return post;
    });
    setPosts(updatedPosts);
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
  };

  const likeStartup = (startupId: string, userId: string) => {
    const updatedStartups = startups.map(startup => {
      if (startup.id === startupId) {
        const likes = startup.likes.includes(userId)
          ? startup.likes.filter(id => id !== userId)
          : [...startup.likes, userId];
        return { ...startup, likes };
      }
      return startup;
    });
    setStartups(updatedStartups);
    localStorage.setItem('startups', JSON.stringify(updatedStartups));
  };

  const joinEvent = (eventId: string, userId: string) => {
    const updatedEvents = events.map(event => {
      if (event.id === eventId) {
        const attendees = event.attendees.includes(userId)
          ? event.attendees.filter(id => id !== userId)
          : [...event.attendees, userId];
        return { ...event, attendees };
      }
      return event;
    });
    setEvents(updatedEvents);
    localStorage.setItem('events', JSON.stringify(updatedEvents));
  };

  const getChatRoom = (participantIds: string[]): ChatRoom => {
    const sortedIds = participantIds.sort();
    let room = chatRooms.find(room => 
      room.participants.length === sortedIds.length &&
      room.participants.every(id => sortedIds.includes(id))
    );

    if (!room) {
      room = {
        id: Date.now().toString(),
        participants: sortedIds,
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const updatedRooms = [...chatRooms, room];
      setChatRooms(updatedRooms);
      localStorage.setItem('chatRooms', JSON.stringify(updatedRooms));
    }

    return room;
  };

  const sendMessage = (roomId: string, messageData: any) => {
    let targetRoom: ChatRoom | undefined = chatRooms.find(r => r.id === roomId);
    if (!targetRoom) return;

    const newMessage = {
      ...messageData,
      id: Date.now().toString(),
      timestamp: new Date()
    };

    // First, append user's message
    targetRoom = {
      ...targetRoom,
      messages: [...targetRoom.messages, newMessage],
      updatedAt: new Date()
    };

    const newRoomsAfterUser = chatRooms.map(r => (r.id === roomId ? targetRoom! : r));

    // Echo bot auto-reply if bot is a participant and sender is not the bot
    const botParticipant = targetRoom.participants.includes('u-bot');
    const senderIsBot = messageData.senderId === 'u-bot';
    let finalRooms = newRoomsAfterUser;
    if (botParticipant && !senderIsBot) {
      const botUser = users.find(u => u.id === 'u-bot');
      const botReply: Message = {
        id: (Date.now() + 1).toString(),
        senderId: 'u-bot',
        sender: botUser as User,
        content: `Echo: ${messageData.content}`,
        timestamp: new Date(),
        type: 'text'
      };
      const updatedTarget: ChatRoom = {
        ...targetRoom,
        messages: [...targetRoom.messages, botReply],
        updatedAt: new Date()
      };
      finalRooms = newRoomsAfterUser.map(r => (r.id === roomId ? updatedTarget : r));
    }

    setChatRooms(finalRooms);
    localStorage.setItem('chatRooms', JSON.stringify(finalRooms));
  };

  const updateUserPoints = (userId: string, points: number) => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, points: user.points + points } : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const submitReverseSolution = (pitchId: string, payload: { studentId: string; content: string }) => {
    const student = users.find(u => u.id === payload.studentId);
    const updated = reversePitches.map(rp => {
      if (rp.id !== pitchId) return rp;
      const submission: any = {
        id: Date.now().toString(),
        studentId: payload.studentId,
        student,
        content: payload.content,
        createdAt: new Date(),
        status: 'pending'
      };
      const next = { ...(rp as any), submissions: [...(rp.submissions || []), submission] } as ReversePitch as any;
      return next as ReversePitch;
    });
    setReversePitches(updated);
    localStorage.setItem('reversePitches', JSON.stringify(updated));
    updateUserPoints(payload.studentId, 25);
  };

  const acceptReverseSolution = (pitchId: string, submissionId: string) => {
    const rp = reversePitches.find(r => r.id === pitchId);
    if (!rp) return;
    const updated = reversePitches.map(r => {
      if (r.id !== pitchId) return r;
      const subs = (r.submissions || []).map((s: any) => s.id === submissionId ? { ...s, status: 'accepted' } : s);
      return { ...(r as any), submissions: subs } as ReversePitch;
    });
    setReversePitches(updated);
    localStorage.setItem('reversePitches', JSON.stringify(updated));
    if (rp.authorId) updateUserPoints(rp.authorId, 10);

    // Gamification: Reverse Solver badges for student on acceptance
    const acceptedSub = (rp.submissions || []).find((s: any) => s.id === submissionId);
    const studentId = acceptedSub?.studentId as string | undefined;
    if (studentId) {
      const acceptedCount = updated.reduce((acc, r) => acc + ((r.submissions || []).filter((s: any) => s.studentId === studentId && s.status === 'accepted').length), 0);
      const thresholds = [1, 3, 10];
      const labels = ['🏆 Reverse Solver I', '🏆 Reverse Solver II', '🏆 Reverse Solver III'];
      thresholds.forEach((t, idx) => {
        if (acceptedCount >= t) {
          const u = users.find(u => u.id === studentId);
          if (u && !(u.badges || []).includes(labels[idx])) {
            const updatedUsers = users.map(x => x.id === u.id ? { ...x, badges: [...(x.badges||[]), labels[idx]] } : x);
            setUsers(updatedUsers);
            localStorage.setItem('users', JSON.stringify(updatedUsers));
          }
        }
      });
    }
  };

  return (
    <AppContext.Provider value={{
      posts,
      startups,
      reversePitches,
      events,
      questions,
      chatRooms,
      users,
      addPost,
      addStartup,
      addReversePitch,
      submitReverseSolution,
      acceptReverseSolution,
      addEvent,
      addQuestion,
      addAnswer,
      likePost,
      likeStartup,
      joinEvent,
      getChatRoom,
      sendMessage,
      updateUserPoints
    }}>
      {children}
    </AppContext.Provider>
  );
};