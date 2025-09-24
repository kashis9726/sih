import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { 
  Lightbulb, 
  Plus, 
  Heart, 
  MessageCircle, 
  TrendingUp,
  Users,
  DollarSign,
  Target,
  Github,
  ExternalLink
} from 'lucide-react';

const StartupHub: React.FC = () => {
  const { user } = useAuth();
  const { startups, addStartup, likeStartup, updateUserPoints, users, getChatRoom } = useApp();
  const [showCreateStartup, setShowCreateStartup] = useState(false);
  const [newStartup, setNewStartup] = useState({
    title: '',
    tagline: '',
    stage: 'concept' as 'concept' | 'prototype' | 'mvp',
    problem: '',
    solution: '',
    progress: '',
    fundingNeeded: ''
  });

  const handleCreateStartup = () => {
    if (!user || !newStartup.title.trim() || !newStartup.tagline.trim()) return;

    const author = users.find(u => u.id === user.id) || user;
    const fallbackImage = `https://source.unsplash.com/1200x600/?${encodeURIComponent(newStartup.title || newStartup.tagline || 'startup')}`;

    addStartup({
      ownerId: user.id,
      owner: author,
      ...newStartup,
      // ensure image present for UI cards
      projectImage: fallbackImage as any,
      likes: [],
      comments: []
    });

    // Award points for posting startup
    updateUserPoints(user.id, 25);

    setNewStartup({
      title: '',
      tagline: '',
      stage: 'concept',
      problem: '',
      solution: '',
      progress: '',
      fundingNeeded: ''
    });
    setShowCreateStartup(false);
  };

  const connectWithAlumniByName = (alumniName: string) => {
    if (!user) return;
    const alumn = users.find(u => u.name.toLowerCase() === alumniName.toLowerCase());
    if (!alumn) {
      alert(`Could not find alumni user: ${alumniName}.`);
      return;
    }
    getChatRoom([user.id, alumn.id]);
    alert(`Chat room created with ${alumniName}. Open the chat panel from the header to start messaging.`);
  };

  const handleLike = (startupId: string) => {
    if (!user) return;
    likeStartup(startupId, user.id);
  };

  const getStageBadge = (stage: string) => {
    const colors = {
      concept: 'bg-yellow-100 text-yellow-800',
      prototype: 'bg-blue-100 text-blue-800',
      mvp: 'bg-green-100 text-green-800'
    };
    return colors[stage as keyof typeof colors];
  };

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'concept':
        return <Lightbulb className="h-4 w-4" />;
      case 'prototype':
        return <Target className="h-4 w-4" />;
      case 'mvp':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <Lightbulb className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Startup Hub 🚀</h1>
        <p className="text-gray-600">Showcase your innovative ideas and get support from the alumni network</p>
      </div>

      {/* Create Startup */}
      {user?.role === 'student' && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          {!showCreateStartup ? (
            <button
              onClick={() => setShowCreateStartup(true)}
              className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
            >
              <Plus className="h-5 w-5 mr-2" />
              Share Your Startup Idea
            </button>
          ) : (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Share Your Startup</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Startup Title
                  </label>
                  <input
                    type="text"
                    value={newStartup.title}
                    onChange={(e) => setNewStartup({ ...newStartup, title: e.target.value })}
                    placeholder="e.g., EcoTrack"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stage
                  </label>
                  <select
                    value={newStartup.stage}
                    onChange={(e) => setNewStartup({ ...newStartup, stage: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="concept">Concept</option>
                    <option value="prototype">Prototype</option>
                    <option value="mvp">MVP</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tagline
                </label>
                <input
                  type="text"
                  value={newStartup.tagline}
                  onChange={(e) => setNewStartup({ ...newStartup, tagline: e.target.value })}
                  placeholder="One-line description of your startup"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Problem Statement
                </label>
                <textarea
                  value={newStartup.problem}
                  onChange={(e) => setNewStartup({ ...newStartup, problem: e.target.value })}
                  placeholder="What problem are you solving?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Solution
                </label>
                <textarea
                  value={newStartup.solution}
                  onChange={(e) => setNewStartup({ ...newStartup, solution: e.target.value })}
                  placeholder="How does your startup solve this problem?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Progress
                </label>
                <textarea
                  value={newStartup.progress}
                  onChange={(e) => setNewStartup({ ...newStartup, progress: e.target.value })}
                  placeholder="What have you built so far? Include links to demos, GitHub repos, etc."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Support Needed
                </label>
                <textarea
                  value={newStartup.fundingNeeded}
                  onChange={(e) => setNewStartup({ ...newStartup, fundingNeeded: e.target.value })}
                  placeholder="What kind of support do you need? (mentorship, funding, partnerships, etc.)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowCreateStartup(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateStartup}
                  disabled={!newStartup.title.trim() || !newStartup.tagline.trim()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Share Startup
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Startups Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {startups.map((startup) => (
          <div key={startup.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                  {startup.owner.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{startup.title}</h3>
                  <p className="text-gray-600 text-sm">by {startup.owner.name}</p>
                </div>
              </div>
              
              <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStageBadge(startup.stage)}`}>
                {getStageIcon(startup.stage)}
                <span className="capitalize">{startup.stage}</span>
              </div>
            </div>

            <p className="text-gray-700 font-medium mb-4">{startup.tagline}</p>

            {/* Project image - always show with fallback */}
            {(() => {
              const cover = (startup as any).projectImage || (startup as any).attachments?.[0] || `https://source.unsplash.com/1200x600/?${encodeURIComponent(startup.title || startup.tagline || 'startup')}`;
              return (
                <img src={cover} alt={startup.title}
                     className="w-full h-44 object-cover rounded-lg mb-4" />
              );
            })()}

            <div className="space-y-4 mb-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1 flex items-center">
                  <Target className="h-4 w-4 mr-1 text-red-500" />
                  Problem
                </h4>
                <p className="text-sm text-gray-600 line-clamp-2">{startup.problem}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1 flex items-center">
                  <Lightbulb className="h-4 w-4 mr-1 text-yellow-500" />
                  Solution
                </h4>
                <p className="text-sm text-gray-600 line-clamp-2">{startup.solution}</p>
              </div>

              {startup.progress && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                    Progress
                  </h4>
                  <p className="text-sm text-gray-600 line-clamp-2">{startup.progress}</p>
                </div>
              )}

              {((startup as any).supportNeeded && (startup as any).supportNeeded.length > 0) ? (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1 flex items-center">
                    <DollarSign className="h-4 w-4 mr-1 text-blue-500" />
                    Support Needed
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(startup as any).supportNeeded.map((s: string, idx: number) => (
                      <span key={idx} className="px-2.5 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">{s}</span>
                    ))}
                  </div>
                </div>
              ) : (
                startup.fundingNeeded && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-1 flex items-center">
                      <DollarSign className="h-4 w-4 mr-1 text-blue-500" />
                      Support Needed
                    </h4>
                    <p className="text-sm text-gray-600 line-clamp-2">{startup.fundingNeeded}</p>
                  </div>
                )
              )}
            </div>

            {/* Alumni Support Offers */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Alumni Support Offers</h4>
              {Array.isArray((startup as any).alumniSupportOffers) && (startup as any).alumniSupportOffers.length > 0 ? (
                <div className="space-y-2">
                  {(startup as any).alumniSupportOffers.map((offer: any, idx: number) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-lg flex items-start gap-3">
                      {offer.alumniAvatar ? (
                        <img src={offer.alumniAvatar} alt={offer.alumniName} className="w-8 h-8 rounded-full" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-semibold">
                          {String(offer.alumniName || '?').slice(0,2).toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">
                          {offer.alumniName} <span className="ml-1 text-green-700">({offer.offerType})</span>
                        </p>
                        <p className="text-xs text-gray-600">{offer.message}</p>
                        {user && (
                          <button
                            onClick={() => connectWithAlumniByName(offer.alumniName)}
                            className="mt-2 text-xs text-blue-600 hover:underline"
                          >
                            Chat with {offer.alumniName}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500 italic">No alumni offers yet. Be the first to help!</p>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleLike(startup.id)}
                  className={`flex items-center space-x-1 text-sm transition-colors ${
                    startup.likes.includes(user?.id || '') 
                      ? 'text-red-600' 
                      : 'text-gray-600 hover:text-red-600'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${startup.likes.includes(user?.id || '') ? 'fill-current' : ''}`} />
                  <span>{startup.likes.length}</span>
                </button>
                
                <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  <MessageCircle className="h-4 w-4" />
                  <span>{startup.comments.length}</span>
                </button>
              </div>

              {user?.role === 'alumni' && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => alert('A support form modal would open here for alumni to submit their offer.')} 
                    className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-200 transition-colors">
                    Offer Support
                  </button>
                  <button
                    onClick={() => alert('Investment interest recorded. In a full app, a flow would follow up with the student.')}
                    className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-lg hover:bg-green-200 transition-colors">
                    Invest
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {startups.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
          <Lightbulb className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No startups yet</h3>
          <p className="text-gray-600">
            {user?.role === 'student'
              ? 'Be the first to share your innovative startup idea!'
              : 'Students will start sharing their innovative ideas soon.'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default StartupHub;