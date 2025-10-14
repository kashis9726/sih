import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { Briefcase, Clock3, CheckCircle2, XCircle } from 'lucide-react';

interface Application {
  id: string;
  studentId: string;
  postId: string;
  employerId: string;
  status: 'submitted' | 'reviewing' | 'accepted' | 'rejected' | 'withdrawn';
  createdAt: string;
}

const Applications: React.FC = () => {
  const { user } = useAuth();
  const { posts, users } = useApp();
  const [apps, setApps] = useState<Application[]>([]);

  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem('applications') || '[]');
      const arr: Application[] = (Array.isArray(raw) ? raw : []).map((a: any) => ({
        id: String(a.id),
        studentId: String(a.studentId),
        postId: String(a.postId),
        employerId: String(a.employerId),
        status: (a.status === 'reviewing' || a.status === 'accepted' || a.status === 'rejected' || a.status === 'withdrawn') ? a.status : 'submitted',
        createdAt: String(a.createdAt || new Date().toISOString()),
      }));
      setApps(arr);
    } catch {}
  }, []);

  const myApps = useMemo(() => apps.filter(a => a.studentId === user?.id), [apps, user?.id]);

  const withdraw = (id: string) => {
    const next = apps.map(a => a.id === id ? { ...a, status: 'withdrawn' as const } : a);
    setApps(next);
    localStorage.setItem('applications', JSON.stringify(next));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-elev-1 border border-white/50">
        <div className="flex items-center gap-3">
          <Briefcase className="h-6 w-6 text-emerald-600"/>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">My Applications</h1>
            <p className="text-gray-600">Track your internship/project applications and status.</p>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-elev-1 border border-white/50">
        {myApps.length === 0 ? (
          <div className="text-gray-600 text-sm">You have not applied yet. Explore opportunities and apply.</div>
        ) : (
          <div className="space-y-3">
            {myApps.map(a => {
              const p = posts.find(p => p.id === a.postId);
              const employer = users.find(u => u.id === a.employerId);
              return (
                <div key={a.id} className="border rounded-xl bg-white p-4 shadow-sm flex items-center justify-between">
                  <div className="min-w-0">
                    <div className="text-gray-900 font-medium truncate">{p ? p.content.split('\n')[0] : 'Posting'}</div>
                    <div className="text-xs text-gray-600 inline-flex items-center"><Clock3 className="h-4 w-4 mr-1"/> {new Date(a.createdAt).toLocaleString()}</div>
                    <div className="text-xs text-gray-600">Employer: {employer?.name || 'Alumni/Industry'}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${a.status==='accepted'?'bg-emerald-100 text-emerald-700':a.status==='rejected'?'bg-red-100 text-red-700':a.status==='withdrawn'?'bg-gray-100 text-gray-700':a.status==='reviewing'?'bg-blue-100 text-blue-700':'bg-amber-100 text-amber-700'}`}>{a.status}</span>
                    {a.status==='submitted' && (
                      <button onClick={()=>withdraw(a.id)} className="px-3 py-1.5 rounded-lg border text-gray-700 hover:bg-gray-50 inline-flex items-center text-xs">
                        <XCircle className="h-4 w-4 mr-1"/> Withdraw
                      </button>
                    )}
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

export default Applications;
