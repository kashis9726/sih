import React, { useState, useMemo } from 'react';
import { Shield, Users, UserCheck, UserX, Search, Award, Activity, Eye, BookOpen, MessageCircle, Calendar, TrendingUp } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

const UserManagement: React.FC = () => {
  const { users, posts, events, questions } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = selectedRole === '' || user.role === selectedRole;
      const statusFilter = selectedStatus === '' || 
                         (selectedStatus === 'online' && user.isOnline) ||
                         (selectedStatus === 'offline' && !user.isOnline) ||
                         (selectedStatus === 'verified' && user.isVerified) ||
                         (selectedStatus === 'unverified' && !user.isVerified);
      
      return matchesSearch && matchesRole && statusFilter;
    });
  }, [users, searchTerm, selectedRole, selectedStatus]);

  const totalUsers = users.length;
  const studentsCount = users.filter(u => u.role === 'student').length;
  const alumniCount = users.filter(u => u.role === 'alumni').length;
  const adminCount = users.filter(u => u.role === 'admin').length;
  const onlineUsers = users.filter(u => u.isOnline).length;
  const verifiedAlumni = users.filter(u => u.role === 'alumni' && u.isVerified).length;

  const topContributors = users
    .sort((a, b) => b.points - a.points)
    .slice(0, 8);

  const recentActivities = useMemo(() => {
    const activities: Array<{id: string, type: string, user: any, action: string, time: Date, details?: string}> = [];

    // Add post activities
    posts.slice(-10).forEach(post => {
      const author = users.find(u => u.id === post.authorId);
      if (author) {
        activities.push({
          id: `post-${post.id}`,
          type: post.type === 'job' ? 'job' : 'blog',
          user: author,
          action: post.type === 'job' ? 'posted a job' : 'wrote a blog',
          time: new Date(post.createdAt),
          details: post.content?.split('\n')[0]?.slice(0, 50) + '...' || ''
        });
      }
    });

    // Add event activities
    events.slice(-10).forEach(event => {
      const organizer = users.find(u => u.id === event.organizerId);
      if (organizer) {
        activities.push({
          id: `event-${event.id}`,
          type: 'event',
          user: organizer,
          action: 'created an event',
          time: new Date(event.date),
          details: event.title
        });
      }
    });

    // Add Q&A activities
    questions.slice(-10).forEach(question => {
      const author = users.find(u => u.id === question.authorId);
      if (author) {
        activities.push({
          id: `question-${question.id}`,
          type: 'question',
          user: author,
          action: 'asked a question',
          time: new Date(question.createdAt),
          details: question.title
        });
      }
    });

    return activities
      .sort((a, b) => b.time.getTime() - a.time.getTime())
      .slice(0, 15);
  }, [users, posts, events, questions]);

  const timeAgo = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Shield className="h-7 w-7 mr-3 text-purple-600" />
              User Management
            </h1>
            <p className="text-gray-600 mt-1">Manage all users, activities and contributions</p>
          </div>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
            Add New User
          </button>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{totalUsers}</div>
            <div className="text-sm text-blue-800">Total Users</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{studentsCount}</div>
            <div className="text-sm text-green-800">Students</div>
          </div>
          <div className="bg-indigo-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-indigo-600">{alumniCount}</div>
            <div className="text-sm text-indigo-800">Industry</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{adminCount}</div>
            <div className="text-sm text-purple-800">Admins</div>
          </div>
          <div className="bg-emerald-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-emerald-600">{onlineUsers}</div>
            <div className="text-sm text-emerald-800">Online Now</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{verifiedAlumni}</div>
            <div className="text-sm text-orange-800">Verified Industry</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">All Roles</option>
            <option value="student">Students</option>
            <option value="alumni">Industry</option>
            <option value="admin">Admins</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Table */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            User Directory ({filteredUsers.length} users)
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 font-medium text-gray-900">User</th>
                  <th className="text-center py-3 font-medium text-gray-900">Role</th>
                  <th className="text-center py-3 font-medium text-gray-900">Department</th>
                  <th className="text-center py-3 font-medium text-gray-900">Status</th>
                  <th className="text-center py-3 font-medium text-gray-900">Points</th>
                  <th className="text-center py-3 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.slice(0, 20).map((user) => (
                  <tr key={user.id} className="border-b border-gray-100">
                    <td className="py-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{user.name}</div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-center py-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'alumni' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="text-center py-3 text-xs text-gray-600">
                      {user.department || '-'}
                    </td>
                    <td className="text-center py-3">
                      <div className="flex items-center justify-center space-x-1">
                        <span className={`w-2 h-2 rounded-full ${user.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                        <span className={`text-xs ${user.isOnline ? 'text-green-600' : 'text-gray-500'}`}>
                          {user.isOnline ? 'Online' : 'Offline'}
                        </span>
                        {user.role === 'alumni' && (
                          <span className={`ml-1 text-xs ${user.isVerified ? 'text-blue-600' : 'text-yellow-600'}`}>
                            {user.isVerified ? '✓' : '⏳'}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="text-center py-3 font-semibold text-gray-900">{user.points}</td>
                    <td className="text-center py-3">
                      <div className="flex items-center justify-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        {user.role === 'alumni' && !user.isVerified && (
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

          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No users found matching your criteria
            </div>
          )}
        </div>

        {/* Top Contributors */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Award className="h-5 w-5 mr-2 text-yellow-600" />
              Top Contributors
            </h2>
            <div className="space-y-3">
              {topContributors.map((user, index) => (
                <div key={user.id} className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    index === 0 ? 'bg-yellow-100 text-yellow-800' :
                    index === 1 ? 'bg-gray-100 text-gray-800' :
                    index === 2 ? 'bg-orange-100 text-orange-800' :
                    'bg-blue-50 text-blue-600'
                  }`}>
                    #{index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{user.name}</div>
                    <div className="text-xs text-gray-500 capitalize">{user.role}</div>
                  </div>
                  <div className="text-sm font-bold text-blue-600">{user.points}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-green-600" />
              Recent Activities
            </h2>
            <div className="space-y-3">
              {recentActivities.slice(0, 10).map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`p-1.5 rounded-lg ${
                    activity.type === 'job' ? 'bg-emerald-50 text-emerald-600' :
                    activity.type === 'blog' ? 'bg-blue-50 text-blue-600' :
                    activity.type === 'event' ? 'bg-purple-50 text-purple-600' :
                    'bg-orange-50 text-orange-600'
                  }`}>
                    {activity.type === 'job' ? <Users className="h-3 w-3" /> :
                     activity.type === 'blog' ? <BookOpen className="h-3 w-3" /> :
                     activity.type === 'event' ? <Calendar className="h-3 w-3" /> :
                     <MessageCircle className="h-3 w-3" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm">
                      <span className="font-medium text-gray-900">{activity.user.name}</span>
                      <span className="text-gray-600"> {activity.action}</span>
                    </div>
                    {activity.details && (
                      <div className="text-xs text-gray-500 truncate mt-1">{activity.details}</div>
                    )}
                    <div className="text-xs text-gray-400 mt-1">{timeAgo(activity.time)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;