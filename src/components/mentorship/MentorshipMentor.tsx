import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { CheckCircle2, Clock3, Users, XCircle } from 'lucide-react';

interface MentorshipRequest {
  id: string;
  studentId: string;
  mentorId: string;
  goal: string;
  preferredTimes: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

interface MentorshipSession {
  id: string;
  requestId: string;
  mentorId: string;
  studentId: string;
  scheduledAt: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  rating?: number;
  feedback?: string;
}

const MentorshipMentor: React.FC = () => {
  const { user } = useAuth();
  const { users } = useApp();
  const [requests, setRequests] = useState<MentorshipRequest[]>([]);
  const [sessions, setSessions] = useState<MentorshipSession[]>([]);

  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem('mentorship_requests') || '[]');
      const typed: MentorshipRequest[] = (Array.isArray(raw) ? raw : []).map((r: any) => ({
        id: String(r.id),
        studentId: String(r.studentId),
        mentorId: String(r.mentorId),
        goal: String(r.goal || ''),
        preferredTimes: String(r.preferredTimes || ''),
        status: (r.status === 'accepted' ? 'accepted' : r.status === 'declined' ? 'declined' : 'pending') as 'pending' | 'accepted' | 'declined',
        createdAt: String(r.createdAt || new Date().toISOString()),
      }));
      setRequests(typed);
    } catch {}
    try { setSessions(JSON.parse(localStorage.getItem('mentorship_sessions') || '[]')); } catch {}
  }, []);

  const incoming = useMemo(() => requests.filter(r => r.mentorId === user?.id), [requests, user?.id]);
  const mySessions = useMemo(() => sessions.filter(s => s.mentorId === user?.id), [sessions, user?.id]);

  const setAndPersistRequests = (next: MentorshipRequest[]) => {
    setRequests(next);
    localStorage.setItem('mentorship_requests', JSON.stringify(next));
  };
  const setAndPersistSessions = (next: MentorshipSession[]) => {
    setSessions(next);
    localStorage.setItem('mentorship_sessions', JSON.stringify(next));
  };

  const accept = (r: MentorshipRequest) => {
    const nextReq: MentorshipRequest[] = requests.map(x => x.id === r.id ? { ...x, status: 'accepted' as const } : x);
    setAndPersistRequests(nextReq);
    const session: MentorshipSession = {
      id: `ms-${Date.now()}`,
      requestId: r.id,
      mentorId: r.mentorId,
      studentId: r.studentId,
      scheduledAt: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString(), // +3 days placeholder
      status: 'scheduled',
    };
    setAndPersistSessions([session, ...sessions]);

    // Notify student about acceptance and session scheduling
    try {
      const now = Date.now();
      const notifs = JSON.parse(localStorage.getItem('notifications') || '[]');
      const out = Array.isArray(notifs) ? notifs : [];
      out.unshift({ id: `nt-${now}`, userId: r.studentId, type: 'mentorship_accept', message: 'Your mentorship request was accepted.', createdAt: new Date(now).toISOString(), readAt: null });
      out.unshift({ id: `nt-${now+1}`, userId: r.studentId, type: 'mentorship_session', message: 'A mentorship session has been scheduled.', createdAt: new Date(now+1).toISOString(), readAt: null });
      localStorage.setItem('notifications', JSON.stringify(out));
    } catch {}
  };

  const decline = (r: MentorshipRequest) => {
    const nextReq: MentorshipRequest[] = requests.map(x => x.id === r.id ? { ...x, status: 'declined' as const } : x);
    setAndPersistRequests(nextReq);

    // Notify student about decline
    try {
      const now = Date.now();
      const notifs = JSON.parse(localStorage.getItem('notifications') || '[]');
      const out = Array.isArray(notifs) ? notifs : [];
      out.unshift({ id: `nt-${now}`, userId: r.studentId, type: 'mentorship_decline', message: 'Your mentorship request was declined.', createdAt: new Date(now).toISOString(), readAt: null });
      localStorage.setItem('notifications', JSON.stringify(out));
    } catch {}
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-elev-1 border border-white/50">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-indigo-600"/>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Mentorship</h1>
            <p className="text-gray-600">Manage incoming requests and scheduled sessions.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Incoming Requests */}
        <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-elev-1 border border-white/50">
          <div className="font-semibold text-gray-900 mb-3">Incoming Requests</div>
          <div className="space-y-3 text-sm">
            {incoming.length === 0 ? (
              <div className="text-gray-600">No requests right now.</div>
            ) : incoming.map(r => {
              const student = users.find(u => u.id === r.studentId);
              return (
                <div key={r.id} className="border rounded-lg p-3 bg-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{student?.name}</div>
                      <div className="text-xs text-gray-600">Goal: {r.goal}</div>
                      <div className="text-xs text-gray-600">Pref: {r.preferredTimes}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => accept(r)} className="px-3 py-1.5 rounded-lg border text-emerald-700 hover:bg-emerald-50 inline-flex items-center text-xs">
                        <CheckCircle2 className="h-4 w-4 mr-1"/> Accept
                      </button>
                      <button onClick={() => decline(r)} className="px-3 py-1.5 rounded-lg border text-red-700 hover:bg-red-50 inline-flex items-center text-xs">
                        <XCircle className="h-4 w-4 mr-1"/> Decline
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* My Sessions */}
        <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-elev-1 border border-white/50">
          <div className="font-semibold text-gray-900 mb-3">My Sessions</div>
          <div className="space-y-3 text-sm">
            {mySessions.length === 0 ? (
              <div className="text-gray-600">No sessions yet.</div>
            ) : mySessions.map(s => {
              const student = users.find(u => u.id === s.studentId);
              return (
                <div key={s.id} className="border rounded-lg p-3 bg-white flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{student?.name}</div>
                    <div className="text-xs text-gray-600 inline-flex items-center"><Clock3 className="h-4 w-4 mr-1"/> {new Date(s.scheduledAt).toLocaleString()}</div>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">{s.status}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorshipMentor;
