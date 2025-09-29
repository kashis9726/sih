import React, { useMemo, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { Bell, MessageSquare, Search, ChevronDown, Calendar, Briefcase, BookOpen, UserCircle2, Lightbulb } from 'lucide-react';

interface HeaderProps {
  onChatToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onChatToggle }) => {
  const { user } = useAuth();
  const { posts, events, chatRooms, users } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showMessages, setShowMessages] = useState(false);

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

  // Aggregate notifications: jobs/internships from posts (type 'job'), blog posts (type 'post'), startup posts (type 'startup'), upcoming events
  const jobNotifs = useMemo(() => posts.filter(p => p.type === 'job').slice(-5).reverse(), [posts]);
  const blogNotifs = useMemo(() => posts.filter(p => p.type === 'post').slice(-5).reverse(), [posts]);
  const startupNotifs = useMemo(() => posts.filter(p => p.type === 'startup').slice(-5).reverse(), [posts]);
  const upcomingEvents = useMemo(() => events.filter(e => new Date(e.date) > new Date()).slice(0,5), [events]);
  const notifCount = jobNotifs.length + blogNotifs.length + startupNotifs.length + upcomingEvents.length;

  // Recent chats: last 5 rooms sorted by updatedAt desc
  const recentChats = useMemo(() => {
    const withLast = chatRooms
      .map(r => ({
        ...r,
        last: r.messages[r.messages.length - 1]
      }))
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5);
    return withLast;
  }, [chatRooms]);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users, posts, events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              onClick={() => { setShowMessages(!showMessages); setShowNotifs(false); }}
              className="relative p-2 text-gray-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
            >
              <MessageSquare className="h-5 w-5" />
              {recentChats.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
                  {Math.min(recentChats.length, 9)}
                </span>
              )}
            </button>
            {showMessages && (
              <div className="absolute right-0 mt-2 w-[340px] bg-white rounded-xl shadow-elev-2 border border-gray-200 p-2 z-20">
                <div className="px-2 py-1 text-xs uppercase tracking-wide text-gray-500">Recent Messages</div>
                <div className="max-h-80 overflow-auto">
                  {recentChats.map((r) => {
                    const otherId = r.participants.find(id => id !== user?.id);
                    const other = users.find(u => u.id === otherId);
                    return (
                      <button key={r.id} onClick={() => { onChatToggle(); setShowMessages(false); }} className="w-full text-left flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50">
                        <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                          {other?.profileImage ? <img src={other.profileImage} alt={other.name} className="w-full h-full object-cover" /> : <UserCircle2 className="h-7 w-7 text-gray-400" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-semibold text-gray-900 truncate">{other?.name || 'Chat'}</div>
                            <span className="text-[10px] text-gray-500">{r.updatedAt ? new Date(r.updatedAt).toLocaleDateString() : ''}</span>
                          </div>
                          <div className="text-xs text-gray-600 truncate">{r.last ? (r.last.senderId === user?.id ? 'You: ' : '') + r.last.content : 'No messages yet'}</div>
                        </div>
                      </button>
                    );
                  })}
                  {recentChats.length === 0 && (
                    <div className="px-2 py-3 text-sm text-gray-600">No recent messages</div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button onClick={() => { setShowNotifs(!showNotifs); setShowMessages(false); }} className="relative p-2 text-gray-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors">
              <Bell className="h-5 w-5" />
              {notifCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
                  {Math.min(notifCount, 9)}
                </span>
              )}
            </button>
            {showNotifs && (
              <div className="absolute right-0 mt-2 w-[360px] bg-white rounded-xl shadow-elev-2 border border-gray-200 p-2 z-20">
                <div className="px-2 py-1 text-xs uppercase tracking-wide text-gray-500">Notifications</div>
                <div className="max-h-96 overflow-auto space-y-2">
                  {/* Jobs/Internships */}
                  {jobNotifs.map(n => (
                    <div key={n.id} className="flex items-start gap-3 px-2 py-2 rounded-lg hover:bg-gray-50">
                      <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700"><Briefcase className="h-4 w-4" /></div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-gray-900 truncate">New Opportunity</div>
                        <div className="text-xs text-gray-600 truncate">{n.content.split('\n')[0]}</div>
                      </div>
                    </div>
                  ))}
                  {/* Events */}
                  {upcomingEvents.map(e => (
                    <div key={e.id} className="flex items-start gap-3 px-2 py-2 rounded-lg hover:bg-gray-50">
                      <div className="p-2 rounded-lg bg-orange-50 text-orange-700"><Calendar className="h-4 w-4" /></div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-gray-900 truncate">Upcoming Event</div>
                        <div className="text-xs text-gray-600 truncate">{e.title} • {new Date(e.date).toLocaleDateString()}</div>
                      </div>
                    </div>
                  ))}
                  {/* Blogs */}
                  {blogNotifs.map(b => (
                    <div key={b.id} className="flex items-start gap-3 px-2 py-2 rounded-lg hover:bg-gray-50">
                      <div className="p-2 rounded-lg bg-teal-50 text-teal-700"><BookOpen className="h-4 w-4" /></div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-gray-900 truncate">New Blog</div>
                        <div className="text-xs text-gray-600 truncate">{b.content.slice(0,80)}{b.content.length>80?'...':''}</div>
                      </div>
                    </div>
                  ))}
                  {/* Startups */}
                  {startupNotifs.map(s => (
                    <div key={s.id} className="flex items-start gap-3 px-2 py-2 rounded-lg hover:bg-gray-50">
                      <div className="p-2 rounded-lg bg-purple-50 text-purple-700"><Lightbulb className="h-4 w-4" /></div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-gray-900 truncate">New Startup Idea</div>
                        <div className="text-xs text-gray-600 truncate">{s.startupData?.title || s.content.slice(0,60)}{(s.startupData?.title?.length || s.content.length) > 60 ? '...' : ''}</div>
                      </div>
                    </div>
                  ))}
                  {notifCount === 0 && (
                    <div className="px-2 py-3 text-sm text-gray-600">No new notifications</div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-gray-900">{user?.role === 'admin' ? 'Admin' : user?.name}</div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getRoleBadgeColor(user?.role || 'student')}`}>
                    {user?.role}
                  </span>
                  <span className="text-xs text-gray-500">{user?.points} pts</span>
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                <div className="px-4 py-2 border-b border-gray-100">
                  <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                  <div className="text-xs text-gray-500">{user?.email}</div>
                </div>
                {user?.badges && user.badges.length > 0 && (
                  <div className="px-4 py-2">
                    <div className="text-xs text-gray-500 mb-1">Badges</div>
                    <div className="flex flex-wrap gap-1">
                      {user.badges.map((badge, index) => (
                        <span key={index} className="text-xs">{badge}</span>
                      ))}
                    </div>
                  </div>
                )}
                <button
                  onClick={() => {
                    if (!confirm('Reset demo data? This will clear local data and reload.')) return;
                    const keys = ['users','posts','startups','reversePitches','events','questions','chatRooms'];
                    keys.forEach(k => localStorage.removeItem(k));
                    window.location.reload();
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Reset Demo Data
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;