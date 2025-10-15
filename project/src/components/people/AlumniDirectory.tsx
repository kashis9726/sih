import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { Search, MessageSquare, Building2, GraduationCap, Award } from 'lucide-react';

const AlumniDirectory: React.FC = () => {
  const { users, getChatRoom } = useApp();
  const { user } = useAuth();
  const [q, setQ] = useState('');
  const [dept, setDept] = useState('All');

  // Prefill search from global navigation
  useEffect(() => {
    try {
      const preset = localStorage.getItem('directorySearch');
      if (preset) {
        setQ(preset);
        localStorage.removeItem('directorySearch');
      }
    } catch {}
  }, []);

  const departments = useMemo(() => {
    const set = new Set<string>();
    users.forEach(u => { if (u.role === 'alumni' && u.department) set.add(u.department); });
    return ['All', ...Array.from(set)];
  }, [users]);

  const alumni = useMemo(() => {
    return users
      .filter(u => u.role === 'alumni')
      .filter(u => dept === 'All' ? true : u.department === dept)
      .filter(u => q ? (u.name + ' ' + (u.company||'') + ' ' + (u.department||'') + ' ' + (u.skills||[]).join(' ')).toLowerCase().includes(q.toLowerCase()) : true);
  }, [users, q, dept]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-elev-1 border border-white/50">
        <h1 className="text-2xl font-bold text-gray-900">Mentor Directory</h1>
        <p className="text-gray-600">Find industry mentors by department, company, or skills and connect instantly.</p>
        <div className="mt-3 bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-lg p-3 text-sm">
          The Mentor Directory helps you discover specific people or skills. For quick updates use Industry Network; for long-form learnings see Blogs.
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search industry mentors, companies, skills..." className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"/>
          </div>
          <select value={dept} onChange={(e)=>setDept(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent">
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <div className="flex items-center text-sm text-gray-600"><span className="px-2 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-100">{alumni.length} results</span></div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {alumni.map(a => (
          <div key={a.id} className="rounded-2xl border border-white/50 bg-white/90 backdrop-blur shadow-elev-1 hover:shadow-elev-2 transition overflow-hidden">
            <div className="p-6 flex items-start gap-4">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-purple-100 flex items-center justify-center text-purple-700 font-semibold">
                {a.profileImage ? <img src={a.profileImage} alt={a.name} className="w-full h-full object-cover"/> : a.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 truncate">{a.name}</h3>
                  {a.isVerified && <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Verified</span>}
                </div>
                <div className="mt-1 text-sm text-gray-600 flex items-center gap-3 flex-wrap">
                  {a.company && <span className="inline-flex items-center gap-1"><Building2 className="h-3.5 w-3.5"/>{a.company}</span>}
                  {a.department && <span className="inline-flex items-center gap-1"><GraduationCap className="h-3.5 w-3.5"/>{a.department}</span>}
                </div>
                {a.skills && a.skills.length>0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {a.skills.slice(0,5).map((s, i) => (
                      <span key={i} className="px-2 py-1 rounded-full text-xs bg-indigo-50 text-indigo-700 border border-indigo-100">{s}</span>
                    ))}
                  </div>
                )}
                {a.badges && a.badges.length>0 && (
                  <div className="mt-2 flex flex-wrap gap-1 text-sm text-purple-700">
                    {a.badges.slice(0,3).map((b, i) => <span key={i} className="text-xs"><Award className="inline h-3 w-3 mr-1 text-purple-500"/>{b}</span>)}
                  </div>
                )}
              </div>
            </div>
            <div className="px-6 pb-4 flex justify-end">
              <button
                onClick={() => {
                  if (!user) return alert('Please login first.');
                  getChatRoom([user.id, a.id]);
                  alert('Chat started. Open the messages from the top bar to talk.');
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-btn-gradient text-white shadow-elev-1 hover:opacity-95"
              >
                <MessageSquare className="h-4 w-4"/> Connect
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlumniDirectory;
