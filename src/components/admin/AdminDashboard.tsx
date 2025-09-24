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
  const [liveMode, setLiveMode] = useState(false);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [insightsText, setInsightsText] = useState('');
  const [insightsError, setInsightsError] = useState<string | null>(null);

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
  // Realtime demo: jitters the last points periodically when enabled
  useEffect(() => {
    if (!liveMode) return;
    const id = setInterval(() => {
      setMonthlyTrend(prev => {
        return prev.map((pt, idx) => {
          // slightly jitter last 4 months
          if (idx >= prev.length - 4) {
            const jitter = (v: number) => Math.max(0, v + Math.round((Math.random() - 0.5) * 4));
            return { ...pt, students: jitter(pt.students), alumni: jitter(pt.alumni) };
          }
          return pt;
        });
      });
    }, 3000);
    return () => clearInterval(id);
  }, [liveMode]);

  const generateInsights = async () => {
    setInsightsLoading(true);
    setInsightsError(null);
    setInsightsText('');
    try {
      const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        setInsightsError('Gemini API key not set. Define VITE_GEMINI_API_KEY in your environment to enable AI insights.');
        setInsightsLoading(false);
        return;
      }
      const payload = {
        contents: [
          {
            parts: [
              {
                text: `You are an analytics assistant. Summarize and suggest actions for an institute platform given these stats. Use concise bullet points.\n\nUsers: total ${totalUsers}, students ${studentsCount}, alumni ${alumniCount}, verifiedAlumni ${verifiedAlumni}.\nActivity: postsThisWeek ${postsThisWeek}, jobs ${jobsCount}, blogs ${blogsCount}, questions ${questionsCount}, reversePitches ${reverseCount}.\nEvents: alumniHosted ${alumniHosted}, instituteHosted ${instituteHosted}.\nDepartments: ${departmentStats.map(d=>`${d.name}:{students:${d.students}, alumni:${d.alumni}, mentors:${d.mentors}, jobs:${d.jobs}}`).join(' ')}\nTrend (recent months): ${monthlyTrend.slice(-4).map(m=>`${m.month} S:${m.students} A:${m.alumni}`).join(', ')}\nReturn: 3-5 insights and 3 concrete next actions.`
              }
            ]
          }
        ]
      };
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(`Gemini error ${res.status}`);
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No insights returned.';
      setInsightsText(text);
    } catch (e: any) {
      setInsightsError(e?.message || 'Failed to generate insights');
    } finally {
      setInsightsLoading(false);
    }
  };

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

  // Demo analytics data (fallback trends)
  const baseMonthlyTrend = [
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

  const [monthlyTrend, setMonthlyTrend] = useState(baseMonthlyTrend);

  const alumniHosted = events.filter(e => e.organizer?.role === 'alumni').length;
  const instituteHosted = events.filter(e => e.organizer?.role === 'admin').length;
  const eventsHostedData = [
    { name: 'Alumni', count: alumniHosted || 6 },
    { name: 'Institution', count: instituteHosted || 3 },
  ];

  const pieColors = ['#6366F1', '#22C55E', '#F59E0B', '#EC4899', '#06B6D4', '#8B5CF6'];
  const industryPieData = Object.entries(industryDistribution)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, value]) => ({ name, value }));

  const [selectedPie, setSelectedPie] = useState<{ name: string; value: number } | null>(null);

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
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Monitor network activity and manage users</p>
          </div>
          <div className="flex items-center gap-3">
            <label className="inline-flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={liveMode} onChange={(e)=>setLiveMode(e.target.checked)} />
              Live demo
            </label>
            <button onClick={generateInsights} className="px-3 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">{insightsLoading ? 'Generating…' : 'AI Insights (Gemini)'}
            </button>
          </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Growth Trends */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
            Engagement Trends
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrend} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="students" stroke="#3B82F6" strokeWidth={2} dot={false} name="Students" />
                <Line type="monotone" dataKey="alumni" stroke="#10B981" strokeWidth={2} dot={false} name="Alumni" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Events Hosted Comparison */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Events Hosted</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RCBarChart data={eventsHostedData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  <Cell key="cell-0" fill="#6366F1" />
                  <Cell key="cell-1" fill="#F59E0B" />
                </Bar>
              </RCBarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
          <div className="flex space-x-2">
            <button
              onClick={async () => {
                try {
                  const res = await fetch('/demo-dataset.json');
                  const data = await res.json();
                  // Write each key to localStorage
                  Object.entries(data).forEach(([key, value]) => {
                    localStorage.setItem(key, JSON.stringify(value));
                  });
                  window.location.reload();
                } catch (e) {
                  alert('Failed to import demo dataset');
                }
              }}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              title="Import demo dataset from JSON"
            >
              Import Demo Dataset
            </button>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
              title="Clear local data and reload demo content"
            >
              Reset Demo Data
            </button>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </button>
          </div>
        </div>
      </div>

      {/* Live Counters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500">Jobs & Internships</div>
            <div className="text-xl font-bold text-gray-900">{jobsCount}</div>
          </div>
          <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg"><Briefcase className="h-5 w-5"/></div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500">Blogs</div>
            <div className="text-xl font-bold text-gray-900">{blogsCount}</div>
          </div>
          <div className="p-2 bg-teal-100 text-teal-700 rounded-lg"><BookOpen className="h-5 w-5"/></div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500">Q&A Questions</div>
            <div className="text-xl font-bold text-gray-900">{questionsCount}</div>
          </div>
          <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg"><MessageCircle className="h-5 w-5"/></div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500">Reverse Pitch</div>
            <div className="text-xl font-bold text-gray-900">{reverseCount}</div>
          </div>
          <div className="p-2 bg-fuchsia-100 text-fuchsia-700 rounded-lg"><RefreshCw className="h-5 w-5"/></div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500">Posts this week</div>
            <div className="text-xl font-bold text-gray-900">{postsThisWeek}</div>
          </div>
          <div className="p-2 bg-orange-100 text-orange-700 rounded-lg"><Activity className="h-5 w-5"/></div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-green-600 font-medium text-sm">{stat.change}</span>
                <p className="text-gray-500 text-sm mt-1">{stat.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Statistics */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Department-wise Statistics</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 font-medium text-gray-900">Department</th>
                    <th className="text-center py-3 font-medium text-gray-900">Students</th>
                    <th className="text-center py-3 font-medium text-gray-900">Alumni</th>
                    <th className="text-center py-3 font-medium text-gray-900">Mentors</th>
                    <th className="text-center py-3 font-medium text-gray-900">Jobs</th>
                    <th className="text-center py-3 font-medium text-gray-900">Active</th>
                    <th className="text-center py-3 font-medium text-gray-900">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {departmentStats.map((dept, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-3 font-medium text-gray-900">{dept.name}</td>
                      <td className="text-center py-3 text-green-600">{dept.students}</td>
                      <td className="text-center py-3 text-blue-600">{dept.alumni}</td>
                      <td className="text-center py-3 text-purple-600">{dept.mentors}</td>
                      <td className="text-center py-3 text-orange-600">{dept.jobs}</td>
                      <td className="text-center py-3">
                        <span className="w-2 h-2 bg-green-500 rounded-full inline-block mr-1"></span>
                        {dept.active}
                      </td>
                      <td className="text-center py-3">
                        <button className="text-blue-600 hover:text-blue-800 transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Verification Queue */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Alumni Verification</h2>
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Verified Alumni</span>
                <span className="flex items-center text-green-600 font-semibold">
                  <UserCheck className="h-4 w-4 mr-1" />
                  {verifiedAlumni}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Pending Verification</span>
                <span className="flex items-center text-orange-600 font-semibold">
                  <UserX className="h-4 w-4 mr-1" />
                  {pendingVerification}
                </span>
              </div>
            </div>
            
            {pendingVerification > 0 && (
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                Review Pending ({pendingVerification})
              </button>
            )}
          </div>

          {/* Industry Distribution */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <PieChartIcon className="h-5 w-5 mr-2" />
              Alumni by Company
            </h2>
            <div className="h-64">
              {industryPieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RCPieChart>
                    <Pie
                      data={industryPieData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={90}
                      label
                      onClick={(data) => setSelectedPie({ name: (data as any).name, value: (data as any).value })}
                    >
                      {industryPieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={pieColors[index % pieColors.length]}
                          className="cursor-pointer"
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RCPieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-sm text-gray-500">No data available</div>
              )}
            </div>
            {selectedPie && (
              <div className="mt-3 inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium">
                <span>{selectedPie.name}</span>
                <span className="px-2 py-0.5 bg-white rounded-full border border-indigo-200">{selectedPie.value}</span>
                <button className="text-indigo-500 hover:text-indigo-700" onClick={() => setSelectedPie(null)}>Clear</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Rocket className="h-5 w-5 mr-2 text-orange-600" />
          Recent Activity
        </h2>
        <div className="divide-y divide-gray-100">
          {recentActivity.map(item => (
            <div key={item.id} className="py-3 flex items-center gap-3">
              <div className={`p-2 rounded-lg ${item.type==='job' ? 'bg-emerald-50 text-emerald-700' : item.type==='blog' ? 'bg-teal-50 text-teal-700' : item.type==='event' ? 'bg-orange-50 text-orange-700' : item.type==='startup' ? 'bg-purple-50 text-purple-700' : item.type==='reverse' ? 'bg-fuchsia-50 text-fuchsia-700' : item.type==='answer' ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-700'}`}>
                {item.type==='job' ? <Briefcase className="h-4 w-4"/> : item.type==='blog' ? <BookOpen className="h-4 w-4"/> : item.type==='event' ? <Calendar className="h-4 w-4"/> : item.type==='startup' ? <TrendingUp className="h-4 w-4"/> : item.type==='reverse' ? <RefreshCw className="h-4 w-4"/> : <MessageCircle className="h-4 w-4"/>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-900 truncate">{item.title}</div>
                <div className="text-xs text-gray-600 truncate">{item.meta}</div>
              </div>
              <div className="text-xs text-gray-500">{timeAgo(item.at)}</div>
            </div>
          ))}
          {recentActivity.length === 0 && (
            <div className="py-6 text-sm text-gray-500">No recent activity</div>
          )}
        </div>
      </div>

      {/* User Management */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">User Directory</h2>
          <div className="flex items-center space-x-3">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Years</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 font-medium text-gray-900">Name</th>
                <th className="text-left py-3 font-medium text-gray-900">Email</th>
                <th className="text-center py-3 font-medium text-gray-900">Role</th>
                <th className="text-center py-3 font-medium text-gray-900">Department</th>
                <th className="text-center py-3 font-medium text-gray-900">Year</th>
                <th className="text-center py-3 font-medium text-gray-900">Status</th>
                <th className="text-center py-3 font-medium text-gray-900">Points</th>
                <th className="text-center py-3 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.slice(0, 20).map((userItem) => (
                <tr key={userItem.id} className="border-b border-gray-100">
                  <td className="py-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                        {userItem.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-900">{userItem.name}</span>
                    </div>
                  </td>
                  <td className="py-3 text-gray-600">{userItem.email}</td>
                  <td className="text-center py-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      userItem.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                      userItem.role === 'alumni' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {userItem.role}
                    </span>
                  </td>
                  <td className="text-center py-3 text-gray-600">{userItem.department || '-'}</td>
                  <td className="text-center py-3 text-gray-600">{userItem.graduationYear || '-'}</td>
                  <td className="text-center py-3">
                    <div className="flex items-center justify-center space-x-1">
                      <span className={`w-2 h-2 rounded-full ${userItem.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                      <span className={`text-xs ${userItem.isOnline ? 'text-green-600' : 'text-gray-500'}`}>
                        {userItem.isOnline ? 'Online' : 'Offline'}
                      </span>
                    </div>
                  </td>
                  <td className="text-center py-3 font-semibold text-gray-900">{userItem.points}</td>
                  <td className="text-center py-3">
                    <div className="flex items-center justify-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                      {userItem.role === 'alumni' && !userItem.isVerified && (
                        <button className="text-green-600 hover:text-green-800 transition-colors">
                          <UserCheck className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Contributors */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Award className="h-5 w-5 mr-2" />
          Top Contributors
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {topContributors.slice(0, 5).map((contributor, index) => (
            <div key={contributor.id} className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-2">
                {contributor.name.charAt(0)}
              </div>
              <h3 className="font-medium text-gray-900 text-sm">{contributor.name}</h3>
              <p className="text-xs text-gray-500">{contributor.role}</p>
              <p className="text-sm font-semibold text-blue-600 mt-1">{contributor.points} points</p>
              <div className="text-xs text-yellow-600 mt-1">#{index + 1}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;