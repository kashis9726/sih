import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { Heart, MessageCircle, Share2, Image, Briefcase, Lightbulb, Target, TrendingUp } from 'lucide-react';

const Feed: React.FC = () => {
  const { user } = useAuth();
  const { posts, addPost, likePost, users, updateUserPoints } = useApp();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({
    content: '',
    type: 'post' as 'post' | 'job' | 'achievement' | 'startup',
    startupData: {
      title: '',
      tagline: '',
      stage: 'concept' as 'concept' | 'prototype' | 'mvp',
      problem: '',
      solution: '',
      progress: '',
      supportNeeded: ''
    }
  });
  const [filterType, setFilterType] = useState<'all' | 'post' | 'job' | 'achievement' | 'startup'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreatePost = () => {
    if (!newPost.content.trim() || !user) return;
    
    // Additional validation for startup posts
    if (newPost.type === 'startup' && (!newPost.startupData.title || !newPost.startupData.tagline)) {
      alert('Please fill in startup title and tagline');
      return;
    }

    const author = users.find(u => u.id === user.id) || user;
    
    addPost({
      authorId: user.id,
      author,
      content: newPost.content,
      likes: [],
      comments: [],
      type: newPost.type,
      startupData: newPost.type === 'startup' ? newPost.startupData : undefined
    });

    // Award points for posting
    updateUserPoints(user.id, newPost.type === 'startup' ? 25 : 10);

    setNewPost({ 
      content: '', 
      type: 'post',
      startupData: {
        title: '',
        tagline: '',
        stage: 'concept',
        problem: '',
        solution: '',
        progress: '',
        supportNeeded: ''
      }
    });
    setShowCreatePost(false);
  };

  const handleLike = (postId: string) => {
    if (!user) return;
    likePost(postId, user.id);
  };

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case 'job':
        return 'bg-green-100 text-green-800';
      case 'achievement':
        return 'bg-yellow-100 text-yellow-800';
      case 'startup':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case 'job':
        return <Briefcase className="h-4 w-4" />;
      case 'achievement':
        return <Heart className="h-4 w-4" />;
      case 'startup':
        return <Lightbulb className="h-4 w-4" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
    }
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

  const getStageBadge = (stage: string) => {
    const colors = {
      concept: 'bg-yellow-100 text-yellow-800',
      prototype: 'bg-blue-100 text-blue-800',
      mvp: 'bg-green-100 text-green-800'
    };
    return colors[stage as keyof typeof colors];
  };

  const filteredPosts = posts.filter((p) => {
    const matchesType = filterType === 'all' ? true : p.type === filterType;
    const matchesSearch = searchQuery
      ? p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.startupData?.title?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.startupData?.tagline?.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
    return matchesType && matchesSearch;
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Industry Network</h1>
        <p className="text-gray-600">Stay updated with the latest from industry mentors and students</p>
        <div className="mt-3 bg-blue-50 border border-blue-200 text-blue-900 rounded-lg p-3 text-sm">
          The Industry Network is a live stream of short updates like jobs, wins, and quick notes. For finding specific people, use the Mentor Directory. For long-form learnings, see Industry Blogs.
        </div>
        <div className="mt-4 flex flex-col md:flex-row md:items-center gap-3">
          <div className="inline-flex bg-gray-100 rounded-lg p-1 w-full md:w-auto">
            {[
              { id: 'all', label: 'All' },
              { id: 'job', label: 'Jobs' },
              { id: 'achievement', label: 'Achievements' },
              { id: 'startup', label: 'Startups' },
              { id: 'post', label: 'Posts' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id as any)}
                className={`flex-1 md:flex-none px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  filterType === (tab.id as any) ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts or authors..."
              className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Create Post */}
      {(user?.role === 'alumni' || user?.role === 'admin' || user?.role === 'student') && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          {!showCreatePost ? (
            <button
              onClick={() => setShowCreatePost(true)}
              className="w-full flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-gray-600">Share something with the community...</span>
            </button>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <select
                  value={newPost.type}
                  onChange={(e) => setNewPost({ ...newPost, type: e.target.value as any })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="post">General Post</option>
                  {(user?.role === 'alumni' || user?.role === 'admin') && (
                    <option value="job">Job Opportunity</option>
                  )}
                  <option value="achievement">Achievement</option>
                  {user?.role === 'student' && (
                    <option value="startup">Startup Idea</option>
                  )}
                </select>
              </div>
              
              <textarea
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                placeholder={newPost.type === 'startup' ? "Describe your startup and what makes it unique..." : "What would you like to share?"}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={4}
              />

              {/* Startup-specific fields */}
              {newPost.type === 'startup' && (
                <div className="space-y-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h3 className="text-lg font-semibold text-purple-900">Startup Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Startup Title*
                      </label>
                      <input
                        type="text"
                        value={newPost.startupData.title}
                        onChange={(e) => setNewPost({ 
                          ...newPost, 
                          startupData: { ...newPost.startupData, title: e.target.value } 
                        })}
                        placeholder="e.g., EcoTrack"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stage
                      </label>
                      <select
                        value={newPost.startupData.stage}
                        onChange={(e) => setNewPost({ 
                          ...newPost, 
                          startupData: { ...newPost.startupData, stage: e.target.value as any } 
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="concept">Concept</option>
                        <option value="prototype">Prototype</option>
                        <option value="mvp">MVP</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tagline*
                    </label>
                    <input
                      type="text"
                      value={newPost.startupData.tagline}
                      onChange={(e) => setNewPost({ 
                        ...newPost, 
                        startupData: { ...newPost.startupData, tagline: e.target.value } 
                      })}
                      placeholder="One-line description of your startup"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Problem Statement
                      </label>
                      <textarea
                        value={newPost.startupData.problem}
                        onChange={(e) => setNewPost({ 
                          ...newPost, 
                          startupData: { ...newPost.startupData, problem: e.target.value } 
                        })}
                        placeholder="What problem are you solving?"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Solution
                      </label>
                      <textarea
                        value={newPost.startupData.solution}
                        onChange={(e) => setNewPost({ 
                          ...newPost, 
                          startupData: { ...newPost.startupData, solution: e.target.value } 
                        })}
                        placeholder="How does your startup solve this?"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Image className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowCreatePost(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreatePost}
                    disabled={!newPost.content.trim()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Posts */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <div key={post.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                {post.author.name.charAt(0).toUpperCase()}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
                  <span className="text-gray-500 text-sm">•</span>
                  <span className="text-gray-500 text-sm">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getPostTypeColor(post.type)}`}>
                    {getPostTypeIcon(post.type)}
                    <span className="capitalize">{post.type}</span>
                  </div>
                </div>
                
                <p className="text-gray-800 mb-4 leading-relaxed">{post.content}</p>
                
                {/* Startup Details Display */}
                {post.type === 'startup' && post.startupData && (
                  <div className="mb-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-lg font-bold text-purple-900">{post.startupData.title}</h4>
                        <p className="text-purple-700 font-medium">{post.startupData.tagline}</p>
                      </div>
                      <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStageBadge(post.startupData.stage)}`}>
                        {getStageIcon(post.startupData.stage)}
                        <span className="capitalize">{post.startupData.stage}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {post.startupData.problem && (
                        <div>
                          <h5 className="text-sm font-semibold text-gray-900 mb-1 flex items-center">
                            <Target className="h-4 w-4 mr-1 text-red-500" />
                            Problem
                          </h5>
                          <p className="text-sm text-gray-700">{post.startupData.problem}</p>
                        </div>
                      )}
                      
                      {post.startupData.solution && (
                        <div>
                          <h5 className="text-sm font-semibold text-gray-900 mb-1 flex items-center">
                            <Lightbulb className="h-4 w-4 mr-1 text-yellow-500" />
                            Solution
                          </h5>
                          <p className="text-sm text-gray-700">{post.startupData.solution}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center space-x-6 text-gray-500">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center space-x-2 hover:text-red-600 transition-colors ${
                      post.likes.includes(user?.id || '') ? 'text-red-600' : ''
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${post.likes.includes(user?.id || '') ? 'fill-current' : ''}`} />
                    <span>{post.likes.length}</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 hover:text-blue-600 transition-colors">
                    <MessageCircle className="h-5 w-5" />
                    <span>{post.comments.length}</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 hover:text-green-600 transition-colors">
                    <Share2 className="h-5 w-5" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
          <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
          <p className="text-gray-600">
            {user?.role === 'alumni' || user?.role === 'admin' || user?.role === 'student'
              ? 'Be the first to share something with the community!'
              : 'Alumni and students will start sharing updates soon. Stay tuned!'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default Feed;