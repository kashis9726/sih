import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home, 
  Bed as FeedIcon, 
  Users, 
  Calendar, 
  Lightbulb, 
  RefreshCw, 
  MessageCircle, 
  User, 
  LogOut, 
  BarChart3, 
  GraduationCap, 
  BookOpen,
  Award,
  Briefcase,
  UserCheck,
  Settings,
  Shield,
  TrendingUp,
  FileText,
  Star,
  Target
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage }) => {
  const { user, logout } = useAuth();

  // Define role-specific menu items
  const getMenuItems = () => {
    switch (user?.role) {
      case 'student':
        return [
          { id: 'dashboard', label: 'Student Dashboard', icon: Home },
          { id: 'alumni', label: 'Mentor Directory', icon: Users },
          { id: 'opportunities', label: 'Internships', icon: Briefcase },
          { id: 'events', label: 'Events', icon: Calendar },
          { id: 'startups', label: 'Startup Ideas', icon: Lightbulb },
          { id: 'qa', label: 'Ask Questions', icon: MessageCircle },
          { id: 'blogs', label: 'Industry Blogs', icon: BookOpen },
          { id: 'reverse-pitching', label: 'Challenges Hub', icon: RefreshCw },
        ];

      case 'alumni':
        return [
          { id: 'dashboard', label: 'Industry Dashboard', icon: Home },
          { id: 'feed', label: 'Industry Network', icon: FeedIcon },
          { id: 'alumni', label: 'Mentor Directory', icon: Users },
          { id: 'blogs', label: 'Share Knowledge', icon: BookOpen },
          { id: 'startups', label: 'Startup Hub', icon: Lightbulb },
          { id: 'opportunities', label: 'Job Postings', icon: Briefcase },
          { id: 'events', label: 'Industry Events', icon: Calendar },
          { id: 'reverse-pitching', label: 'Mentor Students', icon: UserCheck },
          { id: 'qa', label: 'Q&A Board', icon: MessageCircle },
        ];

      case 'admin':
        return [
          { id: 'dashboard', label: 'Admin', icon: BarChart3 },
          { id: 'users', label: 'User Management', icon: Shield },
          { id: 'analytics', label: 'Analytics', icon: TrendingUp },
          { id: 'events', label: 'Event Management', icon: Calendar },
          { id: 'content', label: 'Content Moderation', icon: FileText },
          { id: 'alumni', label: 'Mentor Directory', icon: Users },
          { id: 'opportunities', label: 'Internship Management', icon: Briefcase },
          { id: 'settings', label: 'System Settings', icon: Settings },
        ];

      default:
        return [
          { id: 'dashboard', label: 'Dashboard', icon: Home },
        ];
    }
  };

  const menuItems = getMenuItems();

  // Role-specific styling
  const getRoleStyles = () => {
    switch (user?.role) {
      case 'student':
        return {
          gradient: 'from-green-600 to-emerald-600',
          textColor: 'text-green-100',
          bgColor: 'bg-white/10'
        };
      case 'alumni':
        return {
          gradient: 'from-blue-600 to-indigo-600',
          textColor: 'text-blue-100',
          bgColor: 'bg-white/10'
        };
      case 'admin':
        return {
          gradient: 'from-purple-600 to-pink-600',
          textColor: 'text-purple-100',
          bgColor: 'bg-white/10'
        };
      default:
        return {
          gradient: 'from-gray-600 to-gray-700',
          textColor: 'text-gray-100',
          bgColor: 'bg-white/10'
        };
    }
  };

  const roleStyles = getRoleStyles();

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className={`p-6 border-b border-gray-200 bg-gradient-to-r ${roleStyles.gradient}`}>
        <div className="flex items-center">
          <GraduationCap className="h-8 w-8 text-white mr-2" />
          <h1 className="text-xl font-extrabold text-white tracking-tight">Prashishksan</h1>
        </div>
        {user && (
          <div className={`mt-3 text-xs ${roleStyles.textColor} flex items-center space-x-2`}>
            <span className={`px-2 py-0.5 ${roleStyles.bgColor} rounded-full capitalize`}>
              {user.role}
            </span>
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