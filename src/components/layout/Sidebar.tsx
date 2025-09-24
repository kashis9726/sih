import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Home, Bed as FeedIcon, Users, Calendar, Lightbulb, RefreshCw, MessageCircle, User, LogOut, BarChart3, GraduationCap, BookOpen } from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage }) => {
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: user?.role === 'admin' ? BarChart3 : Home },
    { id: 'feed', label: 'Alumni Feed', icon: FeedIcon },
    { id: 'blogs', label: 'Blogs', icon: BookOpen },
    { id: 'opportunities', label: 'Opportunities', icon: Lightbulb },
    { id: 'alumni', label: 'Alumni Directory', icon: Users },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'startups', label: 'Startup Hub', icon: Lightbulb },
    { id: 'reverse-pitching', label: 'Reverse Pitching', icon: RefreshCw },
    { id: 'qa', label: 'Q&A Board', icon: MessageCircle },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-indigo-600">
        <div className="flex items-center">
          <GraduationCap className="h-8 w-8 text-white mr-2" />
          <h1 className="text-xl font-extrabold text-white tracking-tight">AluVerse</h1>
        </div>
        {user && (
          <div className="mt-3 text-xs text-purple-100 flex items-center space-x-2">
            <span className="px-2 py-0.5 bg-white/10 rounded-full capitalize">{user.role}</span>
            <span>•</span>
            <span>{user.points} pts</span>
          </div>
        )}
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setCurrentPage(item.id)}
                  className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-all ${
                    currentPage === item.id
                      ? 'bg-purple-50 text-purple-700 ring-1 ring-purple-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`h-5 w-5 mr-3 ${currentPage === item.id ? 'text-purple-600' : 'text-gray-400'}`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => setCurrentPage('profile')}
          className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-all mb-2 ${
            currentPage === 'profile'
              ? 'bg-purple-50 text-purple-700 ring-1 ring-purple-200'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <User className="h-5 w-5 mr-3" />
          Profile
        </button>
        
        <button
          onClick={logout}
          className="w-full flex items-center px-3 py-2 text-left rounded-lg text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;