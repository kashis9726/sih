import React, { useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { Briefcase, Users, FileText } from 'lucide-react';

const HRDashboard: React.FC = () => {
  const { user } = useAuth();
  const { posts, users } = useApp();

  const myPosts = useMemo(() => posts.filter(p => p.authorId === user?.id && p.type === 'job'), [posts, user?.id]);
  const applications = useMemo(() => {
    try {
      const raw = JSON.parse(localStorage.getItem('applications') || '[]');
      const arr = Array.isArray(raw) ? raw : [];
      return arr.filter((a: any) => a.employerId === user?.id);
    } catch {
      return [];
    }
  }, [user?.id]);

  const recentApplicants = useMemo(() => {
    return applications
      .slice(0,5)
      .map((a: any) => users.find(u => u.id === a.studentId))
      .filter(Boolean);
  }, [applications, users]);

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-elev-1 border border-white/50">
        <h1 className="text-2xl font-extrabold text-gray-900">Industry HR Dashboard</h1>
        <p className="text-gray-600">Manage postings and review applicants.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600">Your Postings</div>
            <div className="text-2xl font-bold text-gray-900">{myPosts.length}</div>
          </div>
          <div className="p-3 bg-emerald-100 rounded-lg"><Briefcase className="h-6 w-6 text-emerald-700"/></div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600">Applications</div>
            <div className="text-2xl font-bold text-gray-900">{applications.length}</div>
          </div>
          <div className="p-3 bg-blue-100 rounded-lg"><FileText className="h-6 w-6 text-blue-700"/></div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600">Recent Applicants</div>
            <div className="text-2xl font-bold text-gray-900">{recentApplicants.length}</div>
          </div>
          <div className="p-3 bg-purple-100 rounded-lg"><Users className="h-6 w-6 text-purple-700"/></div>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;
