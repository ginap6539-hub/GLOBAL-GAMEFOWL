
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ADMIN_USERNAME, ADMIN_PASSWORD } from '../constants';

interface NavbarProps {
  logoUrl?: string;
}

const Navbar: React.FC<NavbarProps> = ({ logoUrl }) => {
  const [clickCount, setClickCount] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogoClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    
    if (newCount === 7) {
      setShowLogin(true);
      setClickCount(0);
    }

    const timer = setTimeout(() => setClickCount(0), 3000);
    return () => clearTimeout(timer);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setShowLogin(false);
      sessionStorage.setItem('ggbs_admin_auth', 'true');
      window.location.href = window.location.origin + window.location.pathname + '#/admin';
      window.location.reload();
    } else {
      alert('Invalid Credentials');
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div 
          onClick={handleLogoClick}
          className="cursor-pointer select-none group flex items-center"
        >
          {logoUrl ? (
            <img src={logoUrl} alt="GGBS Logo" className="h-10 object-contain" />
          ) : (
            <span className="text-3xl font-oswald font-bold tracking-tighter text-red-600 group-hover:text-red-500 transition-colors">
              GGBS
            </span>
          )}
        </div>

        <div className="hidden md:flex space-x-8 text-sm font-semibold uppercase tracking-widest">
          <a href="#about" className="hover:text-red-500 transition-colors">Digital Gloves</a>
          <a href="#evolution" className="hover:text-red-500 transition-colors">Noble Evolution</a>
          <a href="#revenue" className="hover:text-red-500 transition-colors">Revenue</a>
          <a href="#invest" className="hover:text-red-500 transition-colors">Invest</a>
        </div>

        <a href="#invest" className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full text-xs font-bold uppercase transition-all transform hover:scale-105">
          Invest Now
        </a>
      </div>

      {showLogin && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[999] px-4 backdrop-blur-md overflow-y-auto">
          <div 
            className="relative bg-zinc-900 p-10 rounded-3xl border border-red-600 shadow-[0_0_100px_rgba(220,38,38,0.4)] w-full max-w-md my-8 transform transition-all animate-fade-up" 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setShowLogin(false)}
              className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors text-3xl font-light"
            >
              &times;
            </button>

            <div className="text-center mb-10">
              <h2 className="text-4xl font-oswald font-bold text-white mb-2 uppercase tracking-tighter">Admin Portal</h2>
              <div className="w-12 h-1 bg-red-600 mx-auto rounded-full"></div>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-[10px] uppercase text-red-500 font-bold mb-2 tracking-[0.2em]">Identification</label>
                <input 
                  type="text" 
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-black border border-zinc-700 p-4 rounded-xl focus:border-red-600 outline-none text-white transition-all text-center text-lg font-bold tracking-widest" 
                  placeholder="USERNAME"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-red-500 font-bold mb-2 tracking-[0.2em]">Security Pass</label>
                <input 
                  type="password" 
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black border border-zinc-700 p-4 rounded-xl focus:border-red-600 outline-none text-white transition-all text-center text-lg tracking-widest" 
                  placeholder="••••••••"
                />
              </div>
              
              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 p-5 rounded-2xl font-bold transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl shadow-red-600/30 text-white uppercase tracking-widest text-sm"
                >
                  Authorize Access
                </button>
                <button 
                  type="button"
                  onClick={() => setShowLogin(false)}
                  className="w-full text-zinc-500 text-xs mt-6 hover:text-zinc-300 transition-colors uppercase font-bold tracking-widest"
                >
                  Return to Site
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
