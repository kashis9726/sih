import React, { useMemo, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { Search, MessageSquare, UserCircle2 } from 'lucide-react';

const Blogs: React.FC = () => {
  const { user } = useAuth();
  const { posts, users, getChatRoom, addPost } = useApp();

  const [q, setQ] = useState('');
  const [tag, setTag] = useState('All');
  const [showComposer, setShowComposer] = useState(false);
  const [blogText, setBlogText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  const blogs = useMemo(() => {
    const list = posts.filter(p => p.type === 'post');
    const byQ = q ? list.filter(p => (p.content + ' ' + p.author.name).toLowerCase().includes(q.toLowerCase())) : list;
    // Prefer structured category/tags when available, fallback to content-search
    const byTag = tag === 'All'
      ? byQ
      : byQ.filter((p: any) => {
          const tgs: string[] = (p.tags || []).map((x: string) => x.toLowerCase());
          const cat: string = (p.category || '').toLowerCase();
          return tgs.includes(tag.toLowerCase()) || cat === tag.toLowerCase() || p.content.toLowerCase().includes(tag.toLowerCase());
        });
    return byTag;
  }, [posts, q, tag]);

  const startChat = (authorId: string) => {
    if (!user) return;
    getChatRoom([user.id, authorId]);
    // Header chat toggle will open the pane; here we just ensure room exists.
    alert('Chat room created. Open chat from the top bar to start messaging.');
  };

  const allTags = ['All','Career','Data','AI','FinTech','Mentorship','Startups','Research'];
  const categories = ['Career','Data','AI','FinTech','Mentorship','Startups','Research'];

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-elev-1 border border-white/50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Industry Blogs</h1>
            <p className="text-gray-600">Read stories, roadmaps, and tips from industry mentors. Connect directly with authors.</p>
          </div>
          {(user?.role === 'alumni') && (
            <button
              onClick={() => setShowComposer(!showComposer)}
              className="px-4 py-2 rounded-lg text-white bg-btn-gradient shadow-elev-1 hover:opacity-95"
            >
              {showComposer ? 'Close' : 'Write a Blog'}
            </button>
          )}
        </div>
        <div className="mt-4 flex flex-col md:flex-row gap-3 md:items-center">
          <div className="inline-flex bg-gray-100 rounded-lg p-1 w-full md:w-auto">
            {allTags.map(t => (
              <button key={t} onClick={()=>setTag(t)} className={`flex-1 md:flex-none px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${tag===t ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-600'}`}>{t}</button>
            ))}
          </div>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search posts or authors..." className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
          </div>
        </div>
        <div className="mt-3 bg-rose-50 border border-rose-200 text-rose-900 rounded-lg p-3 text-sm">
          Industry Blogs are long-form learnings and stories. For quick updates, see Industry Network. To connect with an author or find their profile, use the Mentor Directory.
        </div>
        {showComposer && (user?.role === 'alumni') && (
          <div className="mt-4 p-4 border border-gray-200 rounded-xl bg-white/90">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e)=>setCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select category</option>
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e)=>setTagsInput(e.target.value)}
                  placeholder="e.g., interview, resume, roadmap"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Your blog</label>
              <textarea
                value={blogText}
                onChange={(e)=>setBlogText(e.target.value)}
                placeholder="Share your experience, roadmap, tips..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={5}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Cover image URL (optional)</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e)=>setImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={()=>{ setShowComposer(false); setBlogText(''); setImageUrl(''); }} className="px-4 py-2 border rounded-lg">Cancel</button>
              <button
                onClick={()=>{
                  if (!user || !blogText.trim()) return;
                  const author = users.find(u => u.id === user.id) || user;
                  const tags = tagsInput.split(',').map(t=>t.trim()).filter(Boolean);
                  const fallbackKeyword = (category || tags[0] || 'technology').toLowerCase();
                  const autoImage = `https://source.unsplash.com/1200x600/?${encodeURIComponent(fallbackKeyword)}`;
                  addPost({
                    authorId: user.id,
                    author,
                    content: blogText.trim(),
                    image: (imageUrl.trim() || autoImage),
                    category,
                    tags,
                    likes: [],
                    comments: [],
                    type: 'post'
                  } as any);
                  setBlogText('');
                  setImageUrl('');
                  setCategory('');
                  setTagsInput('');
                  setShowComposer(false);
                }}
                disabled={!blogText.trim()}
                className="px-4 py-2 rounded-lg text-white bg-btn-gradient disabled:opacity-50"
              >
                Publish
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {blogs.map((b)=> (
          <div key={b.id} className="rounded-2xl border border-white/50 bg-white/90 backdrop-blur shadow-elev-1 hover:shadow-elev-2 transition overflow-hidden">
            {(() => {
              const anyB: any = b as any;
              const keyword = (anyB.title || anyB.category || (anyB.tags && anyB.tags[0]) || b.author?.company || 'Industry Blog').toString();
              const cover = (anyB.image || `https://placehold.co/1200x600?text=${encodeURIComponent(keyword)}`);
              return <img src={cover} alt="cover" className="w-full h-40 object-cover"/>;
            })()}
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  {b.author.profileImage ? (
                    <img src={b.author.profileImage} alt={b.author.name} className="w-full h-full object-cover"/>
                  ) : (
                    <UserCircle2 className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{b.author.name}</div>
                  <div className="text-xs text-gray-500">{new Date(b.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
              {(b as any).title && (
                <h2 className="text-lg font-bold text-gray-900 mb-2">{(b as any).title}</h2>
              )}
              <p className="text-gray-800 leading-relaxed">
                {b.content}
              </p>

              {(b as any).category || (b as any).tags ? (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {(b as any).category && (
                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                      {(b as any).category}
                    </span>
                  )}
                  {Array.isArray((b as any).tags) && (b as any).tags.map((t: string, idx: number) => (
                    <span key={idx} className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                      #{t}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="mt-4 flex justify-end gap-2">
                {user && (
                  <>
                    <button onClick={()=>startChat(b.authorId)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-btn-gradient shadow-elev-1">
                      <MessageSquare className="h-4 w-4" /> Connect with Author
                    </button>
                    <button
                      onClick={() => {
                        try {
                          window.dispatchEvent(new CustomEvent('app:navigate' as any, { detail: { page: 'alumni', search: b.author.name } } as any));
                        } catch {
                          alert(`Go to Mentor Directory and search for: ${b.author.name}`);
                        }
                      }}
                      className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-50"
                    >
                      View Profile
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {blogs.length === 0 && (
        <div className="bg-white/80 backdrop-blur rounded-2xl p-12 text-center shadow-elev-1 border border-white/50">
          <p className="text-gray-600">No blogs match your filters.</p>
        </div>
      )}
    </div>
  );
};

export default Blogs;
