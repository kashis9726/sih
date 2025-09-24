import React from 'react';
import { TrendingUp, Users, Calendar, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const Analytics: React.FC = () => {
  const userGrowthData = [
    { month: 'Jan', students: 120, alumni: 85 },
    { month: 'Feb', students: 145, alumni: 95 },
    { month: 'Mar', students: 180, alumni: 110 },
    { month: 'Apr', students: 220, alumni: 130 },
    { month: 'May', students: 260, alumni: 155 },
    { month: 'Jun', students: 300, alumni: 180 },
  ];

  const engagementData = [
    { name: 'Students', value: 45, color: '#10B981' },
    { name: 'Alumni', value: 35, color: '#3B82F6' },
    { name: 'Admin', value: 20, color: '#8B5CF6' },
  ];

  const stats = [
    { label: 'Total Users', value: '1,247', change: '+12%', icon: Users, color: 'bg-blue-500' },
    { label: 'Active Sessions', value: '329', change: '+8%', icon: Activity, color: 'bg-green-500' },
    { label: 'Events This Month', value: '48', change: '+23%', icon: Calendar, color: 'bg-purple-500' },
    { label: 'Engagement Rate', value: '78%', change: '+5%', icon: TrendingUp, color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center mb-6">
          <TrendingUp className="h-7 w-7 mr-3 text-purple-600" />
          Platform Analytics
        </h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${stat.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <div className="flex items-center">
                      <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                      <span className="ml-2 text-sm text-green-600">{stat.change}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Growth Chart */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="students" fill="#10B981" />
                  <Bar dataKey="alumni" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* User Distribution */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={engagementData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {engagementData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;