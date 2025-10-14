import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { Users, CheckCircle2, XCircle } from 'lucide-react';

interface Application {
  id: string;
  studentId: string;
  postId: string;
  employerId: string;
  status: 'submitted' | 'reviewing' | 'accepted' | 'rejected' | 'withdrawn';
  createdAt: string;
}

const Applicants: React.FC = () => {
  const { user } = useAuth();
  const { users, posts } = useApp();
  const [apps, setApps] = useState<Application[]>([]);

  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem('applications') || '[]');
      const arr: Application[] = (Array.isArray(raw) ? raw : []);
      setApps(arr);
    } catch {}
  }, []);

  const mine = useMemo(() => apps.filter(a => a.employerId === user?.id), [apps, user?.id]);

  const setAndPersist = (next: Application[]) => {
    setApps(next);
    localStorage.setItem('applications', JSON.stringify(next));
  };

  const updateStatus = (id: string, status: Application['status']) => {
    const next = apps.map(a => a.id === id ? { ...a, status } : a);
    setAndPersist(next);
    // Notify student
    try {
      const app = next.find(a => a.id === id);
      if (!app) return;
      const notif = { id: `nt-${Date.now()}`, userId: app.studentId, type: 'application_update', message: `Your application is ${status}.`, createdAt: new Date().toISOString(), readAt: null };
      const arr = JSON.parse(localStorage.getItem('notifications') || '[]');
      const out = Array.isArray(arr) ? [notif, ...arr] : [notif];
      localStorage.setItem('notifications', JSON.stringify(out));
    } catch {}
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-elev-1 border border-white/50">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-blue-600"/>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Applicants</h1>
            <p className="text-gray-600">Review and update application statuses.</p>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-elev-1 border border-white/50">
        {mine.length === 0 ? (
          <div className="text-gray-600 text-sm">No applications yet.</div>
        ) : (
          <div className="space-y-3 text-sm">
            {mine.map(a => {
              const student = users.find(u => u.id === a.studentId);
              const post = posts.find(p => p.id === a.postId);
              return (
                <div key={a.id} className="border rounded-xl bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <div className="font-medium text-gray-900 truncate">{post ? post.content.split('\n')[0] : 'Posting'}</div>
                      <div className="text-xs text-gray-600">Applicant: {student?.name}</div>
                      <div className="text-xs text-gray-600">Status: {a.status}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={()=>updateStatus(a.id, 'reviewing')} className="px-3 py-1.5 rounded-lg border text-blue-700 hover:bg-blue-50">Review</button>
                      <button onClick={()=>updateStatus(a.id, 'accepted')} className="px-3 py-1.5 rounded-lg border text-emerald-700 hover:bg-emerald-50 inline-flex items-center"><CheckCircle2 className="h-4 w-4 mr-1"/> Accept</button>
                      <button onClick={()=>updateStatus(a.id, 'rejected')} className="px-3 py-1.5 rounded-lg border text-red-700 hover:bg-red-50 inline-flex items-center"><XCircle className="h-4 w-4 mr-1"/> Reject</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Applicants;
