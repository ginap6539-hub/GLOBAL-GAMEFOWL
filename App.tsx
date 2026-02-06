
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import { getContent } from './services/storage';
import { SiteContent } from './types';

const App: React.FC = () => {
  const [content, setContent] = useState<SiteContent>(getContent());
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  const refreshContent = () => {
    setContent(getContent());
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home content={content} />} />
        <Route 
          path="/admin" 
          element={
            isAdminAuthenticated ? (
              <Admin onLogout={() => setIsAdminAuthenticated(false)} onUpdate={refreshContent} />
            ) : (
              <Navigate to="/" />
            )
          } 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      {/* Secret Trigger for Admin Login in Home */}
      <AdminTrigger onAuthenticated={() => setIsAdminAuthenticated(true)} />
    </Router>
  );
};

interface AdminTriggerProps {
  onAuthenticated: () => void;
}

const AdminTrigger: React.FC<AdminTriggerProps> = ({ onAuthenticated }) => {
  // This is handled inside Navbar for the actual click counting
  // This component just helps bridge the state to App.tsx if needed
  return null;
};

export default App;
