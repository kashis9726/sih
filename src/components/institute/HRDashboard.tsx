import React, { useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { Users, ShieldCheck, GraduationCap, BarChart3 } from 'lucide-react';

const InstituteHRDashboard: React.FC = () => {
  const { users, events } = useApp();

  const stats = useMemo(() => {
    const students = users.filter(u => u.role === 'student');
    const alumni = users.filter(u => u.role === 'alumni');
    const pending = users.filter(u => u.isVerified === false).length;
    const upcoming = events.filter(e => new Date(e.date) > new Date()).length;
    return { students: students.length, alumni: alumni.length, pending, upcoming };
  }, [users, events]);

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-elev-1 border border-white/50">
        <h1 className="text-2xl font-extrabold text-gray-900">Institute HR Dashboard</h1>
        <p className="text-gray-600">Approve accounts and monitor student progress.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600">Students</div>
            <div className="text-2xl font-bold text-gray-900">{stats.students}</div>
          </div>
          <div className="p-3 bg-blue-100 rounded-lg"><GraduationCap className="h-6 w-6 text-blue-700"/></div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600">Alumni</div>
            <div className="text-2xl font-bold text-gray-900">{stats.alumni}</div>
          </div>
          <div className="p-3 bg-purple-100 rounded-lg"><Users className="h-6 w-6 text-purple-700"/></div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600">Pending Approvals</div>
            <div className="text-2xl font-bold text-gray-900">{stats.pending}</div>
          </div>
          <div className="p-3 bg-amber-100 rounded-lg"><ShieldCheck className="h-6 w-6 text-amber-700"/></div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600">Upcoming Events</div>
            <div className="text-2xl font-bold text-gray-900">{stats.upcoming}</div>
          </div>
          <div className="p-3 bg-teal-100 rounded-lg"><BarChart3 className="h-6 w-6 text-teal-700"/></div>
        </div>
      </div>
    </div>
  );
};

export default InstituteHRDashboard;
