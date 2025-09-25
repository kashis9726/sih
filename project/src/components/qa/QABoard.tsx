import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { MessageCircle, Search, Tag, Clock, X } from 'lucide-react';

const QABoard: React.FC = () => {
  const { user } = useAuth();
  const { questions, addQuestion, addAnswer, updateUserPoints, users } = useApp();
  const [showCreateQuestion, setShowCreateQuestion] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'latest' | 'answers' | 'upvotes'>('latest');
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [newAnswer, setNewAnswer] = useState('');
  const [newQuestion, setNewQuestion] = useState({
    title: '',
    content: '',
    tags: ''
  });

  const handleCreateQuestion = () => {
    if (!user || !newQuestion.title.trim() || !newQuestion.content.trim()) return;

    const author = users.find(u => u.id === user.id) || user;
    const tagsArray = newQuestion.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    addQuestion({
      authorId: user.id,
      author,
      title: newQuestion.title,
      content: newQuestion.content,
      tags: tagsArray,
      answers: []
    });

    // Award points for asking question
    updateUserPoints(user.id, 5);

    setNewQuestion({
      title: '',
      content: '',
      tags: ''
    });
    setShowCreateQuestion(false);
  };

  const tagMatch = (qTags: string[]) =>
    selectedTags.length === 0 || selectedTags.every(t => qTags.map(x => x.toLowerCase()).includes(t.toLowerCase()));

  const filteredQuestions = questions
    .filter(question =>
      (question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
       question.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
       question.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) &&
      tagMatch(question.tags)
    )
    .sort((a, b) => {
      if (sortBy === 'latest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'answers') {
        return b.answers.length - a.answers.length;
      }
      // upvotes
      const upA = a.answers.reduce((s, ans) => s + ans.upvotes.length, 0);
      const upB = b.answers.reduce((s, ans) => s + ans.upvotes.length, 0);
      return upB - upA;
    });

  const popularTags = [...new Set(questions.flatMap(q => q.tags))]
    .slice(0, 8);

  return (
    <div className="space-y-6">
      {/* Hero / Title */}
      <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-elev-1 border border-white/50">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 mb-1 tracking-tight">Q&A Community</h1>
            <p className="text-gray-600">Ask questions, share knowledge, and learn from our alumni network.</p>
          </div>
          {user && (
            <button
              onClick={() => setShowCreateQuestion(true)}
              className="px-4 py-2 rounded-full text-white shadow-elev-1 hover:opacity-95 active:scale-[0.98] transition bg-btn-gradient"
            >
              Ask Question
            </button>
          )}
        </div>

        {/* Category Bar */}
        <div className="mt-4 flex flex-wrap gap-2">
          {['All','Career','Technical','Academic','Life'].map(cat => {
            const active = selectedTags.includes(cat.toLowerCase());
            return (
              <button
                key={cat}
                onClick={() => {
                  if (cat === 'All') { setSelectedTags([]); return; }
                  setSelectedTags(prev => active ? prev.filter(t => t !== cat.toLowerCase()) : [...prev, cat.toLowerCase()]);
                }}
                className={`px-3 py-1.5 rounded-full text-sm font-medium shadow-sm transition ${
                  cat==='Technical' ? 'bg-emerald-100 text-emerald-700' :
                  cat==='Career' ? 'bg-pink-100 text-pink-700' :
                  cat==='Academic' ? 'bg-amber-100 text-amber-700' :
                  cat==='Life' ? 'bg-violet-100 text-violet-700' :
                  'bg-gray-100 text-gray-700'
                } ${active ? 'ring-2 ring-primary-300' : ''}`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search and Create */}
      <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-elev-1 border border-white/50">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search questions, topics, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="latest">Latest</option>
              <option value="answers">Most Answers</option>
              <option value="upvotes">Most Upvotes</option>
            </select>
          </div>
        </div>

        {/* Popular Tags */}
        {popularTags.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Filter by Topics</h3>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag, index) => {
                const active = selectedTags.includes(tag);
                return (
                  <button
                    key={index}
                    onClick={() =>
                      setSelectedTags((prev) =>
                        active ? prev.filter(t => t !== tag) : [...prev, tag]
                      )
                    }
                    className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                      active ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    #{tag}
                  </button>
                );
              })}
              {selectedTags.length > 0 && (
                <button
                  onClick={() => setSelectedTags([])}
                  className="px-3 py-1 text-sm font-medium rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Create Question Modal */}
      {showCreateQuestion && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Ask a Question</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Title
              </label>
              <input
                type="text"
                value={newQuestion.title}
                onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
                placeholder="e.g., How to transition from student to industry professional?"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Details
              </label>
              <textarea
                value={newQuestion.content}
                onChange={(e) => setNewQuestion({ ...newQuestion, content: e.target.value })}
                placeholder="Provide more context about your question..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={newQuestion.tags}
                onChange={(e) => setNewQuestion({ ...newQuestion, tags: e.target.value })}
                placeholder="e.g., career, internship, resume"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateQuestion(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateQuestion}
                disabled={!newQuestion.title.trim() || !newQuestion.content.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Post Question
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Answers Modal */}
      {activeQuestionId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => { setActiveQuestionId(null); setNewAnswer(''); }} />
          <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-elev-2 border border-gray-200 p-6 max-h-[85vh] overflow-auto">
            {(() => {
              const q = questions.find(q => q.id === activeQuestionId);
              if (!q) return null;
              return (
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{q.title}</h3>
                      <div className="text-sm text-gray-600">Asked by {q.author.name} • {new Date(q.createdAt).toLocaleString()}</div>
                    </div>
                    <button aria-label="Close" onClick={() => { setActiveQuestionId(null); setNewAnswer(''); }} className="p-2 rounded-lg hover:bg-gray-100">
                      <X className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>
                  <p className="text-gray-800 mb-4 whitespace-pre-line">{q.content}</p>

                  {q.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {q.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs">#{tag}</span>
                      ))}
                    </div>
                  )}

                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Answers ({q.answers.length})</h4>
                  <div className="space-y-3">
                    {q.answers.length === 0 && (
                      <div className="p-3 rounded-lg border border-gray-200 text-sm text-gray-600">No answers yet. {user?.role === 'alumni' ? 'Be the first to help.' : ''}</div>
                    )}
                    {q.answers.map((ans, idx) => (
                      <div key={idx} className="p-3 rounded-lg border border-gray-200">
                        <div className="text-sm text-gray-600 mb-1">By {ans.author.name} • {new Date(ans.createdAt).toLocaleString()}</div>
                        <div className="text-gray-800 whitespace-pre-line">{ans.content}</div>
                      </div>
                    ))}
                  </div>

                  {(user?.role === 'alumni' || user?.role === 'admin') && (
                    <div className="mt-5">
                      <h5 className="text-sm font-medium text-gray-900 mb-2">Write your answer</h5>
                      <textarea
                        value={newAnswer}
                        onChange={(e)=>setNewAnswer(e.target.value)}
                        rows={4}
                        placeholder="Share your expertise and actionable guidance..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <div className="mt-2 flex justify-end gap-2">
                        <button onClick={() => { setActiveQuestionId(null); setNewAnswer(''); }} className="px-4 py-2 rounded-lg border">Close</button>
                        <button
                          onClick={() => {
                            if (!user || !newAnswer.trim() || !activeQuestionId) return;
                            const author = users.find(u => u.id === user.id) || user;
                            addAnswer(activeQuestionId, { authorId: user.id, author, content: newAnswer.trim(), upvotes: [] } as any);
                            setNewAnswer('');
                          }}
                          disabled={!newAnswer.trim()}
                          className="px-4 py-2 rounded-lg text-white bg-btn-gradient disabled:opacity-50"
                        >
                          Publish Answer
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((question) => (
          <div key={question.id} className="bg-white/90 backdrop-blur rounded-2xl p-6 shadow-elev-1 border border-white/50 hover:shadow-elev-2 transition">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                {question.author.name.charAt(0).toUpperCase()}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{question.title}</h3>
                <p className="text-gray-700 mb-3 line-clamp-2">{question.content}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Asked by {question.author.name}</span>
                    <span>•</span>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(question.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-sm">
                    <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700">{question.answers.length} Answers</span>
                    <button
                      onClick={() => setActiveQuestionId(question.id)}
                      className="px-4 py-1.5 rounded-full bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm"
                    >
                      View Answers
                    </button>
                    {(user?.role === 'alumni' || user?.role === 'admin') && (
                      <button
                        onClick={() => setActiveQuestionId(question.id)}
                        className="px-4 py-1.5 rounded-full text-white shadow-elev-1 hover:opacity-95 active:scale-[0.98] transition bg-btn-gradient"
                      >
                        Answer
                      </button>
                    )}
                  </div>
                </div>

                {question.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {question.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full flex items-center"
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredQuestions.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
          <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery ? 'No questions found' : 'No questions yet'}
          </h3>
          <p className="text-gray-600">
            {searchQuery 
              ? 'Try adjusting your search terms or browse popular topics.'
              : user 
              ? 'Be the first to ask a question and start building our knowledge base!'
              : 'Sign in to ask or answer questions.'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default QABoard;