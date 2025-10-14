import React, { useMemo, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { mentorScore, jobScore } from '../../utils/matching';
import { Users, Briefcase, Search } from 'lucide-react';

const Matches: React.FC = () => {
  const { user } = useAuth();
  const { users, posts } = useApp();
  const [tab, setTab] = useState<'mentors'|'internships'>('mentors');
  const [q, setQ] = useState('');

  const studentsSkills = (user?.skills || []).map(s => s.toLowerCase());

  const mentorMatches = useMemo(() => {
    const pool = users
      .filter(u => (u.role === 'alumni' || u.role === 'industry_hr') && (u.isVerified ?? true) && u.id !== user?.id)
      .filter(u => {
        if (!q) return true;
        const hay = `${u.name} ${u.company || ''} ${(u.skills||[]).join(' ')}`.toLowerCase();
        return hay.includes(q.toLowerCase());
      })
      .map(u => ({ mentor: u, score: user ? mentorScore(user, u) : 0 }))
      .sort((a,b) => b.score - a.score)
      .slice(0, 10);
    return pool;
  }, [users, user?.id, q, studentsSkills.join(',')]);

  const jobMatches = useMemo(() => {
    const pool = posts
      .filter(p => p.type === 'job')
      .filter(p => {
        if (!q) return true;
        const hay = `${p.content} ${p.author?.name || ''}`.toLowerCase();
        return hay.includes(q.toLowerCase());
      })
      .map(p => ({ post: p, score: user ? jobScore(user, p) : 0 }))
      .sort((a,b) => b.score - a.score)
      .slice(0, 10);
    return pool;
  }, [posts, q, studentsSkills.join(',')]);

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-elev-1 border border-white/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {tab==='mentors' ? <Users className="h-6 w-6 text-indigo-600"/> : <Briefcase className="h-6 w-6 text-emerald-600"/>}
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">Matches</h1>
              <p className="text-gray-600">Personalized mentor and internship suggestions.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="inline-flex bg-gray-100 rounded-lg p-1">
              <button onClick={()=>setTab('mentors')} className={`px-3 py-1.5 rounded-md text-sm font-medium ${tab==='mentors'?'bg-white text-primary-700 shadow-sm':'text-gray-600'}`}>Mentors</button>
              <button onClick={()=>setTab('internships')} className={`px-3 py-1.5 rounded-md text-sm font-medium ${tab==='internships'?'bg-white text-primary-700 shadow-sm':'text-gray-600'}`}>Internships</button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"/>
              <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by name, company, skills, or title" className="pl-9 pr-3 py-2 border rounded-lg"/>
            </div>
          </div>
        </div>
      </div>

      {tab==='mentors' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mentorMatches.map(({mentor, score}) => (
            <div key={mentor.id} className="border rounded-xl bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-gray-900 font-medium">{mentor.name}</div>
                  <div className="text-xs text-gray-600">{mentor.company || 'Alumni/Mentor'}</div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">Score: {score.toFixed(2)}</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {(mentor.skills||[]).slice(0,6).map((s,i)=>(<span key={i} className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700 border">{s}</span>))}
              </div>
              <div className="mt-3 flex justify-end">
                <button onClick={() => window.dispatchEvent(new CustomEvent('app:navigate' as any, { detail: { page: 'mentorship' } }))} className="px-3 py-1.5 rounded-lg border text-gray-700 hover:bg-gray-50 text-sm">Request Mentorship</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobMatches.map(({post, score}) => (
            <div key={post.id} className="border rounded-xl bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <div className="text-gray-900 font-medium truncate">{(post.content||'').split('\n')[0]}</div>
                  <div className="text-xs text-gray-600">by {post.author?.name}</div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Score: {score.toFixed(2)}</span>
              </div>
              <div className="mt-3 flex justify-end">
                <button onClick={() => window.dispatchEvent(new CustomEvent('app:navigate' as any, { detail: { page: 'opportunities' } }))} className="px-3 py-1.5 rounded-lg border text-gray-700 hover:bg-gray-50 text-sm">View & Apply</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Matches;
