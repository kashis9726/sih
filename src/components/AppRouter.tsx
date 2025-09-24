import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AuthPage from './auth/AuthPage';
import Layout from './layout/Layout';

const AppRouter: React.FC = () => {
  const { user, login, signup } = useAuth();

  // Auto-login with demo user and load demo data in production
  useEffect(() => {
    const setupDemoEnvironment = async () => {
      // Only run in production if no user is logged in
      if (!user && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        try {
          // First, try to load demo dataset
          try {
            const res = await fetch('/demo-dataset.json');
            const data = await res.json();
            // Write each key to localStorage
            Object.entries(data).forEach(([key, value]) => {
              localStorage.setItem(key, JSON.stringify(value));
            });
            console.log('✅ Demo dataset loaded successfully');
          } catch (error) {
            console.warn('Demo dataset not found, continuing with auto-login');
          }

          // Try to login with demo credentials
          const loginSuccess = await login('demo@alumni.com', 'demo123');

          if (!loginSuccess) {
            // If login fails, try to create demo user
            const signupSuccess = await signup({
              name: 'Demo User',
              email: 'demo@alumni.com',
              password: 'demo123',
              role: 'student',
              department: 'Computer Science',
              graduationYear: 2024
            });

            if (signupSuccess) {
              // Login after successful signup
              await login('demo@alumni.com', 'demo123');
            }
          }
        } catch (error) {
          console.error('Demo user setup failed:', error);
        }
      }
    };

    setupDemoEnvironment();
  }, [user, login, signup]);

  // Show loading while setting up demo user
  if (!user && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading AluVerse...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return <Layout />;
};

export default AppRouter;