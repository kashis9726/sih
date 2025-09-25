import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { Users, Search, MessageSquare, Star, MapPin, Calendar, Filter } from 'lucide-react';

const Mentorship: React.FC = () => {
  const { user } = useAuth();
  const { users, getChatRoom } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterSkill, setFilterSkill] = useState('');

  const startMentorshipChat = (mentorId: string) => {
    if (!user) return;
    getChatRoom([user.id, mentorId]);
  };

  const mentors = users.filter(u => 
    u.role === 'alumni' && 
    u.isVerified &&
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (!filterDepartment || u.department === filterDepartment) &&
    (!filterSkill || u.skills?.some(skill => skill.toLowerCase().includes(filterSkill.toLowerCase())))
  );

  const departments = [...new Set(users.map(u => u.department).filter(Boolean))];
  const allSkills = [...new Set(users.flatMap(u => u.skills || []))];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Mentorship Directory</h1>
        <p className="text-gray-600">Connect with experienced alumni for guidance and career advice</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search mentors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          
          <select
            value={filterSkill}
            onChange={(e) => setFilterSkill(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Skills</option>
            {allSkills.map(skill => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
          </select>
          
          <button className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filters
          </button>
        </div>
      </div>

      {/* Mentors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mentors.map((mentor) => (
          <div key={mentor.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-4 mb-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {mentor.name.charAt(0).toUpperCase()}
                </div>
                {mentor.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate">{mentor.name}</h3>
                <p className="text-blue-600 font-medium">{mentor.position}</p>
                <p className="text-gray-600 text-sm">{mentor.company}</p>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              {mentor.department && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{mentor.department}</span>
                </div>
              )}
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Class of {mentor.graduationYear}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Star className="h-4 w-4" />
                <span>{mentor.points} contribution points</span>
              </div>
            </div>

            {mentor.bio && (
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{mentor.bio}</p>
            )}

            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Skills & Expertise</h4>
              <div className="flex flex-wrap gap-2">
                {mentor.skills?.slice(0, 4).map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                  >
                    {skill}
                  </span>
                ))}
                {(mentor.skills?.length || 0) > 4 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                    +{(mentor.skills?.length || 0) - 4} more
                  </span>
                )}
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => startMentorshipChat(mentor.id)}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Connect
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>

      {mentors.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No mentors found</h3>
          <p className="text-gray-600">
            Try adjusting your search criteria or check back later for new mentors.
          </p>
        </div>
      )}

      {user?.role === 'alumni' && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-blue-900 mb-2">Become a Mentor</h3>
              <p className="text-blue-800 mb-3">
                Share your expertise and help the next generation of professionals. 
                Enable mentorship in your profile settings to appear in the directory.
              </p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Update Profile Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mentorship;