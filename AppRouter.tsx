import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AuthPage from './auth/AuthPage';
import Layout from './layout/Layout';

const AppRouter: React.FC = () => {
  const { user } = useAuth();

  // Load demo dataset on first visit
  useEffect(() => {
    const loadDemoData = async () => {
      // Only load once
      if (localStorage.getItem('demoDataLoaded')) {
        return;
      }

      try {
        const res = await fetch(`${import.meta.env.BASE_URL}demo-dataset.json`);
        const data = await res.json();
        // Write each key to localStorage
        Object.entries(data).forEach(([key, value]) => {
          localStorage.setItem(key, JSON.stringify(value));
        });
        localStorage.setItem('demoDataLoaded', 'true');
        console.log('✅ Demo dataset loaded successfully');
      } catch (error) {
        console.warn('Demo dataset not found, continuing without demo data');
      }
    };

    loadDemoData();
  }, []);

  // Always show login page first if no user is logged in
  if (!user) {
    return <AuthPage />;
  }

  return <Layout />;
};

export default AppRouter;