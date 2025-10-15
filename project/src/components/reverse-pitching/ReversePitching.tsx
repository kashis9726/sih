import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { RefreshCw, Plus, Clock, DollarSign, Users, Target } from 'lucide-react';

const ReversePitching: React.FC = () => {
  const { user } = useAuth();
  const { reversePitches, addReversePitch, updateUserPoints, users, submitReverseSolution, acceptReverseSolution } = useApp();
  const [showCreatePitch, setShowCreatePitch] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  const [newPitch, setNewPitch] = useState({
    title: '',
    description: '',
    industry: '',
    budget: '',
    deadline: ''
  });
  const [activeSubmitPitch, setActiveSubmitPitch] = useState<string | null>(null);
  const [solutionText, setSolutionText] = useState('');

  const handleCreatePitch = () => {
    if (!user || !newPitch.title.trim() || !newPitch.description.trim()) return;

    const author = users.find(u => u.id === user.id) || user;
    
    addReversePitch({
      authorId: user.id,
      author,
      ...newPitch,
      deadline: newPitch.deadline ? new Date(newPitch.deadline) : undefined,
      submissions: []
    });

    // Award points for posting problem
    updateUserPoints(user.id, 15);

    setNewPitch({
      title: '',
      description: '',
      industry: '',
      budget: '',
      deadline: ''
    });
    setShowCreatePitch(false);
  };

  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'E-commerce',
    'Manufacturing', 'Transportation', 'Real Estate', 'Media', 'Other'
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Reverse Pitching 💡</h1>
        <p className="text-gray-600">
          Industry mentors post real-world problems/challenges and students propose innovative solutions, ideas, or prototypes. This is not a job board — rewards are for winning solutions.
        </p>
      </div>

      {showInfo && (
        <div className="bg-purple-50 border border-purple-200 text-purple-900 rounded-xl p-4 flex items-start gap-3">
          <div className="flex-1 text-sm">
            <p className="font-semibold mb-1">How it works</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Industry mentors post a clearly defined problem and optionally a Solution Reward (mentorship, incubation, prize).</li>
              <li>Students submit ideas, plans, or prototype outlines to solve the problem.</li>
              <li>Mentors review submissions, give feedback, and select a winning solution.</li>
            </ul>
          </div>
          <button onClick={() => setShowInfo(false)} className="text-xs text-purple-700 hover:underline">Dismiss</button>
        </div>
      )}

      {/* Create Problem */}
      {(user?.role === 'alumni' || user?.role === 'admin') && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          {!showCreatePitch ? (
            <button
              onClick={() => setShowCreatePitch(true)}
              className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105"
            >
              <Plus className="h-5 w-5 mr-2" />
              Post Industry Problem
            </button>
          ) : (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Post a Real Industry Problem</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Problem Title
                </label>
                <input
                  type="text"
                  value={newPitch.title}
                  onChange={(e) => setNewPitch({ ...newPitch, title: e.target.value })}
                  placeholder="e.g., Optimizing Supply Chain Logistics"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry
                  </label>
                  <select
                    value={newPitch.industry}
                    onChange={(e) => setNewPitch({ ...newPitch, industry: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select Industry</option>
                    {industries.map(industry => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Solution Reward (Optional)
                  </label>
                  <input
                    type="text"
                    value={newPitch.budget}
                    onChange={(e) => setNewPitch({ ...newPitch, budget: e.target.value })}
                    placeholder="e.g., ₹10,000 + Mentorship or Incubation Support"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deadline (Optional)
                  </label>
                  <input
                    type="date"
                    value={newPitch.deadline}
                    onChange={(e) => setNewPitch({ ...newPitch, deadline: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Problem Description
                </label>
                <textarea
                  value={newPitch.description}
                  onChange={(e) => setNewPitch({ ...newPitch, description: e.target.value })}
                  placeholder="Describe the problem in detail. What challenges are you facing? What constraints exist? What would success look like?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={6}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowCreatePitch(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePitch}
                  disabled={!newPitch.title.trim() || !newPitch.description.trim()}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Post Problem
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Problems Grid */}
      <div className="space-y-6">
        {reversePitches.map((pitch) => (
          <div key={pitch.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-medium">
                  {pitch.author.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{pitch.title}</h3>
                  <p className="text-gray-600 text-sm">
                    Posted by {pitch.author.name} • {pitch.author.company}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {new Date(pitch.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              {pitch.industry && (
                <div className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
                  {pitch.industry}
                </div>
              )}
            </div>

            <p className="text-gray-700 mb-6 leading-relaxed">{pitch.description}</p>

            <div className="flex items-center space-x-6 text-sm text-gray-600 mb-6">
              {pitch.budget && (
                <div className="flex items-center space-x-1">
                  <DollarSign className="h-4 w-4" />
                  <span>Solution Reward: {pitch.budget}</span>
                </div>
              )}
              
              {pitch.deadline && (
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>Due: {new Date(pitch.deadline).toLocaleDateString()}</span>
                </div>
              )}
              
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{(pitch.submissions as any)?.length || 0} submissions</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <Target className="h-3 w-3 text-green-600" />
                </div>
                <span className="text-sm text-gray-600">
                  {((pitch.submissions as any)?.length || 0) === 0 
                    ? 'No submissions yet' 
                    : `${(pitch.submissions as any)?.length} student${((pitch.submissions as any)?.length) === 1 ? '' : 's'} submitted solutions`
                  }
                </span>
              </div>

              {user?.role === 'student' && (
                <button
                  onClick={() => { setActiveSubmitPitch(pitch.id); setSolutionText(''); }}
                  className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors">
                  Submit Solution
                </button>
              )}

              {user?.id === pitch.authorId && (
                <details className="ml-3">
                  <summary className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors cursor-pointer select-none">View Submissions</summary>
                  <div className="mt-3 space-y-3">
                    {((pitch.submissions as any) || []).length === 0 && (
                      <div className="text-sm text-gray-500">No submissions yet</div>
                    )}
                    {((pitch.submissions as any) || []).map((s: any) => (
                      <div key={s.id} className="p-3 rounded-lg border border-gray-200 flex items-start justify-between">
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{s.student?.name || 'Student'}</div>
                          <div className="text-sm text-gray-700 whitespace-pre-line mt-1">{s.content}</div>
                          <div className="text-xs text-gray-500 mt-1">{new Date(s.createdAt).toLocaleString()}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${s.status==='accepted' ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'}`}>{s.status || 'pending'}</span>
                          {s.status !== 'accepted' && (
                            <button
                              onClick={() => { acceptReverseSolution(pitch.id, s.id); alert('Accepted! Alumni rewarded +10 points.'); }}
                              className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs hover:bg-emerald-700">
                              Accept
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </details>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Submit Solution Modal */}
      {activeSubmitPitch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setActiveSubmitPitch(null)} />
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-elev-2 border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Submit Solution</h3>
            <p className="text-sm text-gray-600 mb-4">Share a concise approach or prototype outline. Accepted solutions award points and may lead to mentorship.</p>
            <textarea
              value={solutionText}
              onChange={(e) => setSolutionText(e.target.value)}
              placeholder="Describe your approach, assumptions, and expected outcome..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={6}
            />
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setActiveSubmitPitch(null)} className="px-4 py-2 rounded-lg border">Cancel</button>
              <button
                onClick={() => {
                  if (!user || !solutionText.trim()) return;
                  submitReverseSolution(activeSubmitPitch, { studentId: user.id, content: solutionText.trim() });
                  setActiveSubmitPitch(null);
                  setSolutionText('');
                  alert('Solution submitted! You earned +25 points.');
                }}
                className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700">
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {reversePitches.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
          <RefreshCw className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No challenges yet</h3>
          <p className="text-gray-600">
            {user?.role === 'alumni' || user?.role === 'admin'
              ? 'Be the first to post a challenge for students to solve!'
              : 'Industry mentors will start posting challenges soon.'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default ReversePitching;