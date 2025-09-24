import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { 
  Users, 
  TrendingUp, 
  Calendar, 
  Award,
  UserCheck,
  UserX,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Download,
  Eye,
  Briefcase,
  BookOpen,
  MessageCircle,
  RefreshCw,
  Rocket
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart as RCBarChart,
  Bar,
  PieChart as RCPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { users, posts, events, startups, questions, reversePitches } = useApp();
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.isOnline).length;
  const studentsCount = users.filter(u => u.role === 'student').length;
  const alumniCount = users.filter(u => u.role === 'alumni').length;
  const verifiedAlumni = users.filter(u => u.role === 'alumni' && u.isVerified).length;
  const pendingVerification = users.filter(u => u.role === 'alumni' && !u.isVerified).length;

  const departments = [...new Set(users.map(u => u.department).filter(Boolean))];
  const years = [...new Set(users.map(u => u.graduationYear).filter(Boolean))].sort().reverse();

  const filteredUsers = users.filter(u => {
    return (!selectedDepartment || u.department === selectedDepartment) &&
           (!selectedYear || u.graduationYear === parseInt(selectedYear));
  });

  const departmentStats = departments.map(dept => {
    const deptUsers = users.filter(u => u.department === dept);
    const deptStudents = deptUsers.filter(u => u.role === 'student').length;
    const deptAlumni = deptUsers.filter(u => u.role === 'alumni').length;
    const availableMentors = deptUsers.filter(u => u.role === 'alumni' && u.isVerified).length;
    const jobsPosted = posts.filter(p => p.type === 'job' && deptUsers.some(u => u.id === p.authorId)).length;
    
    return {
      name: dept,
      students: deptStudents,
      alumni: deptAlumni,
      mentors: availableMentors,
      jobs: jobsPosted,
      active: deptUsers.filter(u => u.isOnline).length
    };
  });

  const industryDistribution = users
    .filter(u => u.role === 'alumni' && u.company)
    .reduce((acc, user) => {
      const company = user.company || 'Unknown';
      acc[company] = (acc[company] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const topContributors = users
    .filter(u => u.id !== user?.id)
    .sort((a, b) => b.points - a.points)
    .slice(0, 10);

  const stats = [
    {
      title: 'Total Users',
      value: totalUsers,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%',
      description: `${studentsCount} students, ${alumniCount} alumni`
    },
    {
      title: 'Active Now',
      value: activeUsers,
      icon: Activity,
      color: 'bg-green-500',
      change: '+5%',
      description: 'Currently online'
    },
    {
      title: 'Total Events',
      value: events.length,
      icon: Calendar,
      color: 'bg-purple-500',
      change: '+8%',
      description: `${events.filter(e => new Date(e.date) > new Date()).length} upcoming`
    },
    {
      title: 'Startups',
      value: startups.length,
      icon: TrendingUp,
      color: 'bg-orange-500',
      change: '+15%',
      description: 'Student innovations'
    }
  ];

  // Clean monthly trend data
  const monthlyTrend = [
    { month: 'Jan', students: 25, alumni: 8 },
    { month: 'Feb', students: 30, alumni: 10 },
    { month: 'Mar', students: 45, alumni: 12 },
    { month: 'Apr', students: 40, alumni: 15 },
    { month: 'May', students: 55, alumni: 18 },
    { month: 'Jun', students: 60, alumni: 22 },
    { month: 'Jul', students: 70, alumni: 25 },
    { month: 'Aug', students: 68, alumni: 28 },
    { month: 'Sep', students: 72, alumni: 26 },
    { month: 'Oct', students: 80, alumni: 30 },
    { month: 'Nov', students: 78, alumni: 32 },
    { month: 'Dec', students: 85, alumni: 35 },
  ];

  const alumniHosted = events.filter(e => e.organizer?.role === 'alumni').length;
  const instituteHosted = events.filter(e => e.organizer?.role === 'admin').length;
  const eventsHostedData = [
    { name: 'Alumni Hosted', count: alumniHosted || 8, fill: '#6366F1' },
    { name: 'Institute Hosted', count: instituteHosted || 5, fill: '#10B981' },
  ];

  const pieColors = ['#6366F1', '#22C55E', '#F59E0B', '#EC4899', '#06B6D4', '#8B5CF6'];
  const industryPieData = Object.entries(industryDistribution)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, value]) => ({ name, value }));

  // Derived live counters
  const jobsCount = posts.filter(p => p.type === 'job').length;
  const blogsCount = posts.filter(p => p.type === 'post').length;
  const postsThisWeek = posts.filter(p => Date.now() - new Date(p.createdAt).getTime() <= 7 * 24 * 60 * 60 * 1000).length;
  const questionsCount = questions.length;
  const reverseCount = reversePitches.length;

  const timeAgo = (d: Date | string) => {
    const diff = Date.now() - new Date(d).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hours ago`;
    const days = Math.floor(hrs / 24);
    return `${days} day${days>1?'s':''} ago`;
  };

  // Recent Activity feed
  const recentActivity = useMemo(() => {
    const items: Array<{id:string; type:string; title:string; meta:string; at: Date}> = [];
    posts.slice(-20).forEach(p => {
      const first = (p.content || '').split('\n')[0];
      if (p.type === 'job') items.push({ id: `post-${p.id}`, type: 'job', title: first, meta: p.author?.name || 'Opportunity', at: new Date(p.createdAt) });
      else if (p.type === 'post') items.push({ id: `post-${p.id}`, type: 'blog', title: first.slice(0, 60), meta: p.author?.name || 'Blog', at: new Date(p.createdAt) });
    });
    events.slice(-20).forEach(e => items.push({ id: `event-${e.id}`, type: 'event', title: e.title, meta: e.location || 'Event', at: new Date(e.date) }));
    startups.slice(-20).forEach(s => items.push({ id: `startup-${s.id}`, type: 'startup', title: s.title, meta: s.tagline || 'Startup', at: new Date(s.createdAt) } as any));
    reversePitches.slice(-20).forEach(rp => items.push({ id: `rp-${rp.id}`, type: 'reverse', title: rp.title, meta: rp.industry || 'Reverse Pitch', at: new Date(rp.createdAt) } as any));
    questions.slice(-20).forEach(q => items.push({ id: `q-${q.id}`, type: 'question', title: q.title, meta: (q.tags||[]).join(', '), at: new Date(q.createdAt) } as any));
    // Recent answers
    questions.forEach(q => q.answers?.forEach(a => items.push({ id: `ans-${a.id}`, type: 'answer', title: `Answer: ${q.title.slice(0,40)}`, meta: a.author?.name || 'Answer', at: new Date(a.createdAt) })));
    return items.sort((a,b) => b.at.getTime() - a.at.getTime()).slice(0, 12);
  }, [posts, events, startups, reversePitches, questions]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin</h1>
            <p className="text-gray-600 mt-1">Monitor network activity and manage users</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </button>
          </div>
        </div>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                </div>
                <div className={`p-3 ${stat.color} text-white rounded-lg`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Growth Trends */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
            User Growth Trends
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                  axisLine={{ stroke: '#e0e0e0' }}
                  tickLine={{ stroke: '#e0e0e0' }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  axisLine={{ stroke: '#e0e0e0' }}
                  tickLine={{ stroke: '#e0e0e0' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="students" 
                  stroke="#3B82F6" 
                  strokeWidth={3} 
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }} 
                  name="Students" 
                />
                <Line 
                  type="monotone" 
                  dataKey="alumni" 
                  stroke="#10B981" 
                  strokeWidth={3} 
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }} 
                  name="Alumni" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Events Hosted Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-purple-600" />
            Events by Host
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RCBarChart data={eventsHostedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 11 }}
                  axisLine={{ stroke: '#e0e0e0' }}
                  tickLine={{ stroke: '#e0e0e0' }}
                />
                <YAxis 
                  allowDecimals={false} 
                  tick={{ fontSize: 12 }}
                  axisLine={{ stroke: '#e0e0e0' }}
                  tickLine={{ stroke: '#e0e0e0' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar 
                  dataKey="count" 
                  radius={[6, 6, 0, 0]}
                  fill="#6366F1"
                />
              </RCBarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Activity Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500 font-medium">Jobs & Internships</div>
            <div className="text-xl font-bold text-gray-900">{jobsCount}</div>
          </div>
          <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
            <Briefcase className="h-5 w-5"/>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500 font-medium">Blog Posts</div>
            <div className="text-xl font-bold text-gray-900">{blogsCount}</div>
          </div>
          <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
            <BookOpen className="h-5 w-5"/>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500 font-medium">Questions</div>
            <div className="text-xl font-bold text-gray-900">{questionsCount}</div>
          </div>
          <div className="p-2 bg-orange-100 text-orange-700 rounded-lg">
            <MessageCircle className="h-5 w-5"/>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500 font-medium">Reverse Pitches</div>
            <div className="text-xl font-bold text-gray-900">{reverseCount}</div>
          </div>
          <div className="p-2 bg-purple-100 text-purple-700 rounded-lg">
            <Rocket className="h-5 w-5"/>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500 font-medium">This Week</div>
            <div className="text-xl font-bold text-gray-900">{postsThisWeek}</div>
          </div>
          <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
            <Activity className="h-5 w-5"/>
          </div>
        </div>
      </div>

      {/* Department Analytics */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <PieChartIcon className="h-5 w-5 mr-2 text-indigo-600" />
          Department Overview
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Department Stats Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 text-gray-600 font-medium">Department</th>
                  <th className="text-center py-2 text-gray-600 font-medium">Students</th>
                  <th className="text-center py-2 text-gray-600 font-medium">Alumni</th>
                  <th className="text-center py-2 text-gray-600 font-medium">Mentors</th>
                  <th className="text-center py-2 text-gray-600 font-medium">Jobs</th>
                </tr>
              </thead>
              <tbody>
                {departmentStats.map((dept, idx) => (
                  <tr key={dept.name} className="border-b border-gray-100">
                    <td className="py-3 font-medium text-gray-900">{dept.name}</td>
                    <td className="py-3 text-center text-blue-600 font-semibold">{dept.students}</td>
                    <td className="py-3 text-center text-green-600 font-semibold">{dept.alumni}</td>
                    <td className="py-3 text-center text-purple-600 font-semibold">{dept.mentors}</td>
                    <td className="py-3 text-center text-orange-600 font-semibold">{dept.jobs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Industry Distribution Chart */}
          <div className="flex items-center justify-center">
            {industryPieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <RCPieChart>
                  <Pie
                    data={industryPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {industryPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RCPieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <PieChartIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>No industry data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Activity className="h-5 w-5 mr-2 text-green-600" />
          Recent Activity
        </h2>
        <div className="space-y-3">
          {recentActivity.length > 0 ? (
            recentActivity.map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    item.type === 'job' ? 'bg-emerald-100 text-emerald-700' :
                    item.type === 'blog' ? 'bg-blue-100 text-blue-700' :
                    item.type === 'event' ? 'bg-purple-100 text-purple-700' :
                    item.type === 'question' ? 'bg-orange-100 text-orange-700' :
                    item.type === 'startup' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {item.type === 'job' && <Briefcase className="h-4 w-4" />}
                    {item.type === 'blog' && <BookOpen className="h-4 w-4" />}
                    {item.type === 'event' && <Calendar className="h-4 w-4" />}
                    {item.type === 'question' && <MessageCircle className="h-4 w-4" />}
                    {item.type === 'startup' && <Rocket className="h-4 w-4" />}
                    {item.type === 'reverse' && <RefreshCw className="h-4 w-4" />}
                    {item.type === 'answer' && <MessageCircle className="h-4 w-4" />}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{item.title}</div>
                    <div className="text-xs text-gray-500">{item.meta}</div>
                  </div>
                </div>
                <div className="text-xs text-gray-400">{timeAgo(item.at)}</div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-8">
              <Activity className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p>No recent activity</p>
            </div>
          )}
        </div>
      </div>

      {/* Top Contributors */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Award className="h-5 w-5 mr-2 text-yellow-600" />
          Top Contributors
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {topContributors.slice(0, 8).map((contributor, idx) => (
            <div key={contributor.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                idx === 0 ? 'bg-yellow-500 text-white' :
                idx === 1 ? 'bg-gray-400 text-white' :
                idx === 2 ? 'bg-amber-600 text-white' :
                'bg-blue-100 text-blue-700'
              }`}>
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{contributor.name}</p>
                <p className="text-sm text-gray-500 capitalize">{contributor.role}</p>
              </div>
              <div className="flex-shrink-0">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  {contributor.points} pts
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;