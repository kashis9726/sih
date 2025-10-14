import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { Users, Search, Send, CheckCircle2 } from 'lucide-react';

interface MentorCard {
  id: string;
  name: string;
  company?: string;
  skills?: string[];
  isVerified?: boolean;
}

interface MentorshipRequest {
  id: string;
  studentId: string;
  mentorId: string;
  goal: string;
  preferredTimes: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

const MentorshipStudent: React.FC = () => {
  const { user } = useAuth();
  const { users } = useApp();
  const [q, setQ] = useState('');
  const [goal, setGoal] = useState('Career guidance for internships');
  const [timePref, setTimePref] = useState('Weekends, 5-7pm');
  const [requests, setRequests] = useState<MentorshipRequest[]>([]);

  useEffect(() => {
    try { setRequests(JSON.parse(localStorage.getItem('mentorship_requests') || '[]')); } catch {}
  }, []);

  const mentors: MentorCard[] = useMemo(() => {
    return users
      .filter(u => u.role === 'alumni' && (u.isVerified ?? true))
      .map(u => ({ id: u.id, name: u.name, company: u.company, skills: u.skills, isVerified: u.isVerified }))
      .filter(m => {
        if (!q) return true;
        const hay = `${m.name} ${m.company || ''} ${(m.skills || []).join(' ')}`.toLowerCase();
        return hay.includes(q.toLowerCase());
      });
  }, [users, q]);

  const myRequests = requests.filter(r => r.studentId === user?.id);

  const sendRequest = (mentorId: string) => {
    if (!user) return alert('Please login as a student.');
    const newReq: MentorshipRequest = {
      id: `mr-${Date.now()}`,
      studentId: user.id,
      mentorId,
      goal,
      preferredTimes: timePref,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    const next = [newReq, ...requests];
    setRequests(next);
    localStorage.setItem('mentorship_requests', JSON.stringify(next));

    // Notify mentor
    try {
      const notif = {
        id: `nt-${Date.now()}`,
        userId: mentorId,
        type: 'mentorship_request',
        message: `${user.name} requested mentorship: ${goal}`,
        createdAt: new Date().toISOString(),
        readAt: null as string | null,
      };
      const arr = JSON.parse(localStorage.getItem('notifications') || '[]');
      const out = Array.isArray(arr) ? [notif, ...arr] : [notif];
      localStorage.setItem('notifications', JSON.stringify(out));
    } catch {}
    alert('Request sent to mentor.');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-elev-1 border border-white/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-blue-600"/>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">Mentorship</h1>
              <p className="text-gray-600">Find mentors and send a request with your goal and availability.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <input value={goal} onChange={e=>setGoal(e.target.value)} className="px-3 py-2 border rounded-lg w-64" placeholder="Your goal"/>
            <input value={timePref} onChange={e=>setTimePref(e.target.value)} className="px-3 py-2 border rounded-lg w-52" placeholder="Preferred times"/>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Directory */}
        <div className="lg:col-span-2 bg-white/80 backdrop-blur rounded-2xl p-6 shadow-elev-1 border border-white/50">
          <div className="flex items-center gap-2 mb-4">
            <Search className="h-4 w-4 text-gray-500"/>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search mentor name, company or skills..." className="flex-1 px-3 py-2 border rounded-lg"/>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mentors.map(m => (
              <div key={m.id} className="border rounded-xl bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{m.name}</div>
                    <div className="text-sm text-gray-600">{m.company || 'Alumni'}</div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {(m.skills||[]).slice(0,5).map((s,i)=>(<span key={i} className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700 border">{s}</span>))}
                    </div>
                  </div>
                  <button onClick={()=>sendRequest(m.id)} className="px-3 py-1.5 rounded-lg border text-gray-700 hover:bg-gray-50 inline-flex items-center text-sm">
                    <Send className="h-4 w-4 mr-1"/> Request
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My Requests */}
        <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-elev-1 border border-white/50">
          <div className="flex items-center justify-between mb-3">
            <div className="font-semibold text-gray-900">My Requests</div>
          </div>
          <div className="space-y-3 text-sm">
            {myRequests.length === 0 ? (
              <div className="text-gray-600">No requests yet.</div>
            ) : myRequests.map(r => {
              const mentor = users.find(u=>u.id===r.mentorId);
              return (
                <div key={r.id} className="border rounded-lg p-3 bg-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{mentor?.name}</div>
                      <div className="text-xs text-gray-600">Goal: {r.goal}</div>
                      <div className="text-xs text-gray-600">Pref: {r.preferredTimes}</div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${r.status==='accepted'?'bg-emerald-100 text-emerald-700':r.status==='declined'?'bg-red-100 text-red-700':'bg-amber-100 text-amber-700'}`}>{r.status}</span>
                  </div>
                  {r.status==='accepted' && (
                    <div className="mt-2 inline-flex items-center text-emerald-700 text-xs"><CheckCircle2 className="h-4 w-4 mr-1"/>Your session will be scheduled by the mentor.</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorshipStudent;
