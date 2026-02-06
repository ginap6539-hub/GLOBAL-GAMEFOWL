
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import { fetchSiteContent } from './services/supabase';
import { SiteContent } from './types';
import { DEFAULT_CONTENT } from './constants';

const AUTH_KEY = 'ggbs_admin_auth';

const App: React.FC = () => {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return sessionStorage.getItem(AUTH_KEY) === 'true';
  });
  const [loading, setLoading] = useState(true);

  const refreshContent = async () => {
    try {
      const data = await fetchSiteContent();
      setContent(data);
    } catch (err) {
      console.error('Failed to load content', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshContent();
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    setIsAdminAuthenticated(false);
  };

  if (loading) {
    return (
      <div className="bg-black h-screen flex items-center justify-center">
        <div className="text-red-600 font-oswald text-2xl animate-pulse uppercase tracking-widest">Loading GGBS...</div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home content={content} />} />
        <Route 
          path="/admin" 
          element={
            isAdminAuthenticated ? (
              <Admin onLogout={handleLogout} onUpdate={refreshContent} />
            ) : (
              <Navigate to="/" />
            )
          } 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
