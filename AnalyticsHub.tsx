import React, { useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { BarChart3, Users, CheckCircle2, FileText, GraduationCap, MessageSquare } from 'lucide-react';

const AnalyticsHub: React.FC = () => {
  const { user } = useAuth();
  const { users, posts } = useApp();

  const applications = useMemo(() => {
    try { const raw = JSON.parse(localStorage.getItem('applications') || '[]'); return Array.isArray(raw) ? raw : []; } catch { return []; }
  }, []);
  const mRequests = useMemo(() => {
    try { const raw = JSON.parse(localStorage.getItem('mentorship_requests') || '[]'); return Array.isArray(raw) ? raw : []; } catch { return []; }
  }, []);
  const mSessions = useMemo(() => {
    try { const raw = JSON.parse(localStorage.getItem('mentorship_sessions') || '[]'); return Array.isArray(raw) ? raw : []; } catch { return []; }
  }, []);

  const role = user?.role;

  const studentStats = useMemo(() => {
    const myApps = applications.filter((a: any) => a.studentId === user?.id);
    const myReqs = mRequests.filter((r: any) => r.studentId === user?.id);
    const mySess = mSessions.filter((s: any) => s.studentId === user?.id);
    return {
      appsTotal: myApps.length,
      appsAccepted: myApps.filter((a: any) => a.status === 'accepted').length,
      appsRejected: myApps.filter((a: any) => a.status === 'rejected').length,
      appsReview: myApps.filter((a: any) => a.status === 'reviewing' || a.status === 'submitted').length,
      mentorshipReqs: myReqs.length,
      mentorshipSessions: mySess.length,
    };
  }, [applications, mRequests, mSessions, user?.id]);

  const instituteStats = useMemo(() => {
    const students = users.filter(u => u.role === 'student');
    const alumni = users.filter(u => u.role === 'alumni');
    const approvalsPending = users.filter(u => u.isVerified === false).length;
    const appsAccepted = applications.filter((a: any) => a.status === 'accepted').length;
    const appsTotal = applications.length;
    const sessionsTotal = mSessions.length;
    return { students: students.length, alumni: alumni.length, approvalsPending, appsTotal, appsAccepted, sessionsTotal };
  }, [users, applications, mSessions]);

  const industryStats = useMemo(() => {
    const myPosts = posts.filter(p => p.authorId === user?.id && p.type === 'job');
    const myApps = applications.filter((a: any) => a.employerId === user?.id);
    return {
      postings: myPosts.length,
      applicants: myApps.length,
      accepted: myApps.filter((a: any) => a.status === 'accepted').length,
      rejected: myApps.filter((a: any) => a.status === 'rejected').length,
      reviewing: myApps.filter((a: any) => a.status === 'reviewing' || a.status === 'submitted').length,
    };
  }, [posts, applications, user?.id]);

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-elev-1 border border-white/50">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-6 w-6 text-indigo-600"/>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Analytics & Reporting</h1>
            <p className="text-gray-600">Role-aware insights from current activity.</p>
          </div>
        </div>
      </div>

      {role === 'student' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="text-sm text-gray-600">Applications</div>
            <div className="text-2xl font-bold">{studentStats.appsTotal}</div>
            <div className="mt-2 text-xs text-gray-600">Accepted: {studentStats.appsAccepted} • Rejected: {studentStats.appsRejected} • In review: {studentStats.appsReview}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="text-sm text-gray-600">Mentorship Requests</div>
            <div className="text-2xl font-bold">{studentStats.mentorshipReqs}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="text-sm text-gray-600">Mentorship Sessions</div>
            <div className="text-2xl font-bold">{studentStats.mentorshipSessions}</div>
          </div>
        </div>
      )}

      {role === 'institute_hr' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Students</div>
              <div className="text-2xl font-bold">{instituteStats.students}</div>
            </div>
            <GraduationCap className="h-6 w-6 text-blue-600"/>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Alumni</div>
              <div className="text-2xl font-bold">{instituteStats.alumni}</div>
            </div>
            <Users className="h-6 w-6 text-purple-600"/>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Pending Approvals</div>
              <div className="text-2xl font-bold">{instituteStats.approvalsPending}</div>
            </div>
            <CheckCircle2 className="h-6 w-6 text-amber-600"/>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Applications</div>
              <div className="text-2xl font-bold">{instituteStats.appsTotal}</div>
            </div>
            <FileText className="h-6 w-6 text-emerald-600"/>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Accepted</div>
              <div className="text-2xl font-bold">{instituteStats.appsAccepted}</div>
            </div>
            <CheckCircle2 className="h-6 w-6 text-emerald-600"/>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Mentorship Sessions</div>
              <div className="text-2xl font-bold">{instituteStats.sessionsTotal}</div>
            </div>
            <MessageSquare className="h-6 w-6 text-teal-600"/>
          </div>
        </div>
      )}

      {role === 'industry_hr' && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="text-sm text-gray-600">Your Postings</div>
            <div className="text-2xl font-bold">{industryStats.postings}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="text-sm text-gray-600">Applicants</div>
            <div className="text-2xl font-bold">{industryStats.applicants}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="text-sm text-gray-600">Accepted</div>
            <div className="text-2xl font-bold">{industryStats.accepted}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="text-sm text-gray-600">Rejected</div>
            <div className="text-2xl font-bold">{industryStats.rejected}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="text-sm text-gray-600">Reviewing + Submitted</div>
            <div className="text-2xl font-bold">{industryStats.reviewing}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsHub;
