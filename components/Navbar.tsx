
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ADMIN_USERNAME, ADMIN_PASSWORD } from '../constants';

const Navbar: React.FC = () => {
  const [clickCount, setClickCount] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogoClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount === 7) {
      setShowLogin(true);
      setClickCount(0);
    }
    // Reset counter if not clicked again within 3 seconds
    setTimeout(() => setClickCount(0), 3000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setShowLogin(false);
      window.location.hash = '#/admin'; // Force navigate for SPA setup
      window.location.reload(); // Refresh to ensure App catches auth
    } else {
      alert('Invalid Credentials');
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div 
          onClick={handleLogoClick}
          className="cursor-pointer select-none group"
        >
          <span className="text-3xl font-oswald font-bold tracking-tighter text-red-600 group-hover:text-red-500 transition-colors">
            GGBS
          </span>
          <span className="ml-2 text-xs text-white/50 opacity-0 group-hover:opacity-100 transition-opacity">
            (v1.0)
          </span>
        </div>

        <div className="hidden md:flex space-x-8 text-sm font-semibold uppercase tracking-widest">
          <a href="#about" className="hover:text-red-500 transition-colors">Digital Gloves</a>
          <a href="#evolution" className="hover:text-red-500 transition-colors">Noble Evolution</a>
          <a href="#revenue" className="hover:text-red-500 transition-colors">Revenue</a>
          <a href="#contact" className="hover:text-red-500 transition-colors">Contact</a>
        </div>

        <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full text-xs font-bold uppercase transition-all transform hover:scale-105">
          Invest Now
        </button>
      </div>

      {showLogin && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] px-4">
          <div className="bg-zinc-900 p-8 rounded-2xl border border-red-600/50 w-full max-w-md animate-fade-up">
            <h2 className="text-2xl font-oswald font-bold mb-6 text-center">ADMIN ACCESS</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs uppercase text-zinc-500 mb-1">Username</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-black border border-zinc-800 p-3 rounded-lg focus:border-red-600 outline-none" 
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-xs uppercase text-zinc-500 mb-1">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black border border-zinc-800 p-3 rounded-lg focus:border-red-600 outline-none" 
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 p-3 rounded-lg font-bold transition-colors"
              >
                LOGIN
              </button>
              <button 
                type="button"
                onClick={() => setShowLogin(false)}
                className="w-full text-zinc-500 text-sm mt-2"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
