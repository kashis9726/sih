import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from './Sidebar';
import Header from './Header';
import Dashboard from '../dashboard/Dashboard';
import Feed from '../feed/Feed';
import Events from '../events/Events';
import StartupHub from '../startup/StartupHub';
import ReversePitching from '../reverse-pitching/ReversePitching';
import Opportunities from '../opportunities/Opportunities';
import Blogs from '../blogs/Blogs';
import AlumniDirectory from '../people/AlumniDirectory';
import QABoard from '../qa/QABoard';
import Chat from '../chat/Chat';
import Profile from '../profile/Profile';
import AdminDashboard from '../admin/AdminDashboard';
import UserManagement from '../admin/UserManagement';
import Analytics from '../admin/Analytics';
import ContentModeration from '../admin/ContentModeration';
import SystemSettings from '../admin/SystemSettings';
import AIRecommender from '../student/AIRecommender';
import SkillGap from '../student/SkillGap';
import MentorshipStudent from '../mentorship/MentorshipStudent';
import MentorshipMentor from '../mentorship/MentorshipMentor';
import Applications from '../projects/Applications';
import HRDashboard from '../industry/HRDashboard';
import PostEditor from '../industry/PostEditor';
import Applicants from '../industry/Applicants';
import InstituteHRDashboard from '../institute/HRDashboard';
import Approvals from '../institute/Approvals';
import AnalyticsHub from '../analytics/AnalyticsHub';
import Matches from '../matching/Matches';

const Layout: React.FC = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [chatOpen, setChatOpen] = useState(false);

  // Global navigation via CustomEvent: dispatch new CustomEvent('app:navigate', { detail: { page: 'alumni', search: 'Name' } })
  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ page?: string; search?: string }>;
      if (ce.detail?.page) {
        if (ce.detail.search && ce.detail.page === 'alumni') {
          try { localStorage.setItem('directorySearch', ce.detail.search); } catch {}
        }
        setCurrentPage(ce.detail.page);
      }
    };
    window.addEventListener('app:navigate' as any, handler as any);
    return () => window.removeEventListener('app:navigate' as any, handler as any);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        if (user?.role === 'admin') return <AdminDashboard />;
        if (user?.role === 'industry_hr') return <HRDashboard />;
        if (user?.role === 'institute_hr') return <InstituteHRDashboard />;
        return <Dashboard />;
      case 'feed':
        return <Feed />;
      case 'events':
        return <Events />;
      case 'opportunities':
        return <Opportunities />;
      case 'applications':
        return <Applications />;
      case 'matches':
        return <Matches />;
      case 'hr-post':
        return <PostEditor />;
      case 'hr-applicants':
        return <Applicants />;
      case 'approvals':
        return <Approvals />;
      case 'blogs':
        return user?.role === 'student' ? <Dashboard /> : <Blogs />;
      case 'startups':
        return <StartupHub />;
      case 'reverse-pitching':
        return <ReversePitching />;
      case 'qa':
        return <QABoard />;
      case 'alumni':
        return <AlumniDirectory />;
      case 'ai-recommender':
        return <AIRecommender />;
      case 'skill-gap':
        return <SkillGap />;
      case 'mentorship':
        return user?.role === 'alumni' ? <MentorshipMentor /> : <MentorshipStudent />;
      case 'profile':
        return <Profile />;
      // Admin-specific pages
      case 'users':
        return user?.role === 'admin' ? <UserManagement /> : <Dashboard />;
      case 'analytics':
        if (user?.role === 'admin') return <Analytics />;
        if (user?.role === 'institute_hr' || user?.role === 'industry_hr') return <AnalyticsHub />;
        return <Dashboard />;
      case 'content':
        return user?.role === 'admin' ? <ContentModeration /> : <Dashboard />;
      case 'settings':
        return user?.role === 'admin' ? <SystemSettings /> : <Dashboard />;
      default:
        return user?.role === 'admin' ? <AdminDashboard /> : <Dashboard />;
    }
  };

  return (
    <div className="relative min-h-screen bg-app-gradient">
      {/* 3D animated background blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <span className="absolute -top-16 -left-24 h-80 w-80 rounded-full blur-3xl opacity-50 animate-drift-slower" style={{ background: 'radial-gradient(circle at 30% 30%, rgba(217,70,239,0.45), transparent 60%)' }} />
        <span className="absolute top-1/2 -translate-y-1/2 -right-24 h-96 w-96 rounded-full blur-3xl opacity-50 animate-float-slow" style={{ background: 'radial-gradient(circle at 70% 30%, rgba(245,158,11,0.35), transparent 60%)' }} />
        <span className="absolute -bottom-24 left-1/4 h-96 w-96 rounded-full blur-3xl opacity-40 animate-drift-slower" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(20,184,166,0.35), transparent 60%)' }} />
      </div>

      <div className="relative z-10 flex">
        <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      <div className="flex-1 flex flex-col">
        <Header onChatToggle={() => setChatOpen(!chatOpen)} />
        
        <main className="flex-1 p-6 overflow-auto">
          {renderPage()}
        </main>
      </div>

      {chatOpen && (
        <div className="w-80 bg-white/80 backdrop-blur border-l border-white/50 shadow-elev-1">
          <Chat onClose={() => setChatOpen(false)} />
        </div>
      )}
      </div>
    </div>
  );
};

export default Layout;