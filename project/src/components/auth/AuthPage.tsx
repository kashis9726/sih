import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { GraduationCap, Users, Mail, Lock, User, Building, Calendar } from 'lucide-react';

const AuthPage: React.FC = () => {
  const { login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student' as 'student' | 'alumni' | 'admin',
    department: '',
    graduationYear: new Date().getFullYear(),
    company: '',
    position: '',
    skills: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let success = false;
      if (isLogin) {
        success = await login(formData.email, formData.password);
      } else {
        const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s);
        success = await signup({
          ...formData,
          skills: skillsArray
        });
      }

      if (!success) {
        alert(isLogin ? 'Invalid credentials' : 'User already exists or signup failed');
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (role: 'student' | 'alumni' | 'admin') => {
    const credentials = {
      student: { email: 'student@demo.com', password: 'demo' },
      alumni: { email: 'alumni@demo.com', password: 'demo' },
      admin: { email: 'admin@demo.com', password: 'demo' }
    };

    // Create demo users if they don't exist
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const demoUser = users.find((u: any) => u.email === credentials[role].email);
    
    if (!demoUser) {
      const newUser = {
        id: Date.now().toString(),
        name: `Demo ${role.charAt(0).toUpperCase() + role.slice(1)}`,
        email: credentials[role].email,
        role,
        department: 'Computer Science',
        graduationYear: role === 'student' ? 2025 : 2020,
        company: role === 'alumni' ? 'Tech Corp' : undefined,
        position: role === 'alumni' ? 'Senior Developer' : undefined,
        skills: ['JavaScript', 'React', 'Node.js'],
        points: Math.floor(Math.random() * 1000),
        badges: ['🎓 Top Mentor'],
        isVerified: true,
        isOnline: false,
        bio: `Demo ${role} account for testing purposes.`
      };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
    }

    await login(credentials[role].email, credentials[role].password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <GraduationCap className="h-12 w-12 text-blue-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-900">Prashishksan</h1>
          </div>
          <p className="text-gray-600">Connect. Learn. Grow Together.</p>
        </div>

        <div className="mb-6">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                isLogin ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                !isLogin ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="relative">
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="student">Student</option>
                  <option value="alumni">Industry</option>
                  <option value="admin">Institute</option>
                </select>
              </div>

              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {formData.role === 'student' && (
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    placeholder="Expected Graduation Year"
                    value={formData.graduationYear}
                    onChange={(e) => setFormData({ ...formData, graduationYear: parseInt(e.target.value) })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}

              {formData.role === 'alumni' && (
                <>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Current Company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Position"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </>
              )}

              <input
                type="text"
                placeholder="Skills (comma-separated)"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50"
          >
            {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600 mb-4">Quick Demo Access:</p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => quickLogin('student')}
              className="bg-green-100 text-green-700 py-2 px-3 rounded-lg text-xs font-medium hover:bg-green-200 transition-colors"
            >
              Student Demo
            </button>
            <button
              onClick={() => quickLogin('alumni')}
              className="bg-blue-100 text-blue-700 py-2 px-3 rounded-lg text-xs font-medium hover:bg-blue-200 transition-colors"
            >
              Industry Demo
            </button>
            <button
              onClick={() => quickLogin('admin')}
              className="bg-purple-100 text-purple-700 py-2 px-3 rounded-lg text-xs font-medium hover:bg-purple-200 transition-colors"
            >
              Institute Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;