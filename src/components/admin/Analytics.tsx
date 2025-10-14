import React, { useMemo } from 'react';
import { TrendingUp, Users, Calendar, Activity, Briefcase, BookOpen, MessageCircle, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import { useApp } from '../../contexts/AppContext';

const Analytics: React.FC = () => {
  const { users, posts, events, questions } = useApp();

  const totalUsers = users.length;
  const studentsCount = users.filter(u => u.role === 'student').length;
  const alumniCount = users.filter(u => u.role === 'alumni').length;
  const adminCount = users.filter(u => u.role === 'admin').length;
  const activeUsers = users.filter(u => u.isOnline).length;
  const totalEvents = events.length;
  const totalPosts = posts.length;
  const totalQuestions = questions.length;

  // Monthly growth simulation (you could track real data over time)
  const userGrowthData = [
    { month: 'Jan', students: Math.max(20, studentsCount - 50), alumni: Math.max(10, alumniCount - 25) },
    { month: 'Feb', students: Math.max(25, studentsCount - 40), alumni: Math.max(15, alumniCount - 20) },
    { month: 'Mar', students: Math.max(30, studentsCount - 30), alumni: Math.max(20, alumniCount - 15) },
    { month: 'Apr', students: Math.max(40, studentsCount - 20), alumni: Math.max(25, alumniCount - 10) },
    { month: 'May', students: Math.max(50, studentsCount - 10), alumni: Math.max(30, alumniCount - 5) },
    { month: 'Jun', students: studentsCount, alumni: alumniCount },
  ];

  const userDistributionData = [
    { name: 'Students', value: studentsCount, color: '#10B981' },
    { name: 'Alumni', value: alumniCount, color: '#3B82F6' },
    { name: 'Admin', value: adminCount, color: '#8B5CF6' },
  ];

  const departmentData = useMemo(() => {
    const deptMap = users.reduce((acc, user) => {
      const dept = user.department || 'Other';
      acc[dept] = acc[dept] || { name: dept, students: 0, alumni: 0 };
      if (user.role === 'student') acc[dept].students++;
      if (user.role === 'alumni') acc[dept].alumni++;
      return acc;
    }, {} as Record<string, any>);
    
    return Object.values(deptMap).slice(0, 6);
  }, [users]);

  const engagementRate = totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;
  
  const contentData = [
    { name: 'Blog Posts', count: posts.filter(p => p.type === 'post').length, color: '#10B981' },
    { name: 'Job Posts', count: posts.filter(p => p.type === 'job').length, color: '#F59E0B' },
    { name: 'Events', count: totalEvents, color: '#8B5CF6' },
    { name: 'Questions', count: totalQuestions, color: '#EF4444' },
  ];

  const stats = [
    { 
      label: 'Total Users', 
      value: totalUsers.toString(), 
      change: '+12%', 
      icon: Users, 
      color: 'bg-blue-500',
      description: `${studentsCount} students, ${alumniCount} alumni`
    },
    { 
      label: 'Active Now', 
      value: activeUsers.toString(), 
      change: '+8%', 
      icon: Activity, 
      color: 'bg-green-500',
      description: `${engagementRate}% engagement rate`
    },
    { 
      label: 'Total Events', 
      value: totalEvents.toString(), 
      change: '+23%', 
      icon: Calendar, 
      color: 'bg-purple-500',
      description: `${events.filter(e => new Date(e.date) > new Date()).length} upcoming`
    },
    { 
      label: 'Total Content', 
      value: (totalPosts + totalQuestions).toString(), 
      change: '+15%', 
      icon: TrendingUp, 
      color: 'bg-orange-500',
      description: `${totalPosts} posts, ${totalQuestions} questions`
    },
  ];

  const topContributors = users
    .filter(u => u.role !== 'admin')
    .sort((a, b) => b.points - a.points)
    .slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <TrendingUp className="h-7 w-7 mr-3 text-purple-600" />
              Analytics
            </h1>
            <p className="text-gray-600 mt-1">Platform insights and performance metrics</p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Live Data</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-green-600">{stat.change}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Growth Chart */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth Trend</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userGrowthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="students" stroke="#10B981" strokeWidth={2} name="Students" />
                  <Line type="monotone" dataKey="alumni" stroke="#3B82F6" strokeWidth={2} name="Alumni" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* User Distribution */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Distribution</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userDistributionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {userDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Department & Content Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Department Statistics */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Breakdown</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="students" fill="#10B981" name="Students" />
                  <Bar dataKey="alumni" fill="#3B82F6" name="Alumni" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Content Activity */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Activity</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={contentData} layout="horizontal" margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={80} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {contentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Top Contributors */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Award className="h-5 w-5 mr-2 text-yellow-600" />
          Top Contributors
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topContributors.map((contributor, index) => (
            <div key={contributor.id} className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mr-4 ${
                index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-600' :
                index === 2 ? 'bg-gradient-to-r from-orange-400 to-orange-600' :
                'bg-gradient-to-r from-blue-400 to-blue-600'
              }`}>
                #{index + 1}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{contributor.name}</h3>
                <p className="text-sm text-gray-600 capitalize">{contributor.role}</p>
                <p className="text-sm font-bold text-blue-600">{contributor.points} points</p>
              </div>
            </div>
          ))}
        </div>
        
        {topContributors.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No contributor data available
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;