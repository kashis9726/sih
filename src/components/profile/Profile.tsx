import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Edit3, Save, X, MapPin, Calendar, Building, Award, Star } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    skills: user?.skills?.join(', ') || '',
    company: user?.company || '',
    position: user?.position || '',
    startup: user?.startup || '',
    department: user?.department || '',
    graduationYear: user?.graduationYear || new Date().getFullYear()
  });

  const handleSave = () => {
    if (!user) return;
    
    const skillsArray = editData.skills.split(',').map(s => s.trim()).filter(s => s);
    
    updateUser({
      name: editData.name,
      bio: editData.bio,
      skills: skillsArray,
      company: editData.company,
      position: editData.position,
      startup: editData.startup,
      department: editData.department,
      graduationYear: editData.graduationYear
    });
    
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      name: user?.name || '',
      bio: user?.bio || '',
      skills: user?.skills?.join(', ') || '',
      company: user?.company || '',
      position: user?.position || '',
      startup: user?.startup || '',
      department: user?.department || '',
      graduationYear: user?.graduationYear || new Date().getFullYear()
    });
    setIsEditing(false);
  };

  if (!user) return null;

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'alumni':
        return 'bg-blue-100 text-blue-800';
      case 'student':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="text-2xl font-bold text-gray-900 border-b border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent"
                />
              ) : (
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              )}
              
              <div className="flex items-center space-x-3 mt-2">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getRoleBadgeColor(user.role)}`}>
                  {user.role}
                </span>
                {user.isVerified && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                    Verified
                  </span>
                )}
                <div className="flex items-center space-x-1 text-yellow-600">
                  <Star className="h-4 w-4" />
                  <span className="text-sm font-medium">{user.points} points</span>
                </div>
              </div>

              <p className="text-gray-600 mt-1">{user.email}</p>

              {(user.company || user.position) && (
                <div className="flex items-center space-x-2 mt-2 text-gray-600">
                  <Building className="h-4 w-4" />
                  <span>
                    {isEditing ? (
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={editData.position}
                          onChange={(e) => setEditData({ ...editData, position: e.target.value })}
                          placeholder="Position"
                          className="border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                        <input
                          type="text"
                          value={editData.company}
                          onChange={(e) => setEditData({ ...editData, company: e.target.value })}
                          placeholder="Company"
                          className="border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                      </div>
                    ) : (
                      `${user.position} at ${user.company}`
                    )}
                  </span>
                </div>
              )}

              {user.startup && (
                <div className="flex items-center space-x-2 mt-1 text-gray-600">
                  <Building className="h-4 w-4" />
                  <span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.startup}
                        onChange={(e) => setEditData({ ...editData, startup: e.target.value })}
                        placeholder="Startup"
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                    ) : (
                      `Startup: ${user.startup}`
                    )}
                  </span>
                </div>
              )}

              {user.department && (
                <div className="flex items-center space-x-2 mt-1 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.department}
                        onChange={(e) => setEditData({ ...editData, department: e.target.value })}
                        placeholder="Department"
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                    ) : (
                      user.department
                    )}
                  </span>
                </div>
              )}

              {user.graduationYear && (
                <div className="flex items-center space-x-2 mt-1 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editData.graduationYear}
                        onChange={(e) => setEditData({ ...editData, graduationYear: parseInt(e.target.value) })}
                        className="border border-gray-300 rounded px-2 py-1 text-sm w-20"
                      />
                    ) : (
                      `Class of ${user.graduationYear}`
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* About Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">About</h2>
            {isEditing ? (
              <textarea
                value={editData.bio}
                onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                placeholder="Tell us about yourself, your experience, and what you're passionate about..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
              />
            ) : (
              <p className="text-gray-700 leading-relaxed">
                {user.bio || 'No bio available. Edit your profile to add more information about yourself.'}
              </p>
            )}
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Skills & Expertise</h2>
            {isEditing ? (
              <div>
                <input
                  type="text"
                  value={editData.skills}
                  onChange={(e) => setEditData({ ...editData, skills: e.target.value })}
                  placeholder="e.g., JavaScript, React, Node.js, Python"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">Separate skills with commas</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {user.skills && user.skills.length > 0 ? (
                  user.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">No skills added yet. Edit your profile to add your expertise.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Badges */}
          {user.badges && user.badges.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Badges</h2>
              <div className="space-y-3">
                {user.badges.map((badge, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Award className="h-4 w-4 text-yellow-600" />
                    </div>
                    <span className="text-gray-900 font-medium">{badge}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Points</span>
                <span className="font-semibold text-gray-900">{user.points}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Account Status</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  user.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {user.isVerified ? 'Verified' : 'Pending Verification'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Member Since</span>
                <span className="font-semibold text-gray-900">2024</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                View Public Profile
              </button>
              <button className="w-full text-left px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                Download Resume
              </button>
              <button className="w-full text-left px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                Privacy Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;