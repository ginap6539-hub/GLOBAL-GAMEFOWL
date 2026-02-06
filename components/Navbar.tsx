
import React, { useState } from 'react';
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
      // Redirect to admin hash route and refresh to update app state
      window.location.hash = '#/admin';
      window.location.reload();
    } else {
      alert('Access Denied: Invalid Credentials');
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

        <div className="hidden md:flex space-x-8 text-sm font-semibold uppercase tracking-widest text-zinc-400">
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
        <div className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-4 backdrop-blur-xl animate-fade-in">
          <div 
            className="relative bg-zinc-900 p-10 rounded-[2.5rem] border border-red-600/50 shadow-[0_0_100px_rgba(220,38,38,0.4)] w-full max-w-md transform transition-all animate-fade-up" 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setShowLogin(false)}
              className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors text-3xl font-light"
            >
              &times;
            </button>

            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-red-600/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-600/20">
                 <div className="w-8 h-8 border-t-2 border-r-2 border-red-600 rotate-45 translate-y-1"></div>
              </div>
              <h2 className="text-3xl font-oswald font-bold text-white uppercase tracking-tighter">Secure Login</h2>
              <p className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] font-bold mt-2">GGBS Management Interface</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="group">
                <label className="block text-[10px] uppercase text-zinc-300 font-bold mb-2 tracking-widest ml-1">Administrator ID</label>
                <input 
                  type="text" 
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-black border-2 border-zinc-800 group-focus-within:border-red-600 p-5 rounded-2xl outline-none text-white transition-all text-center text-xl font-bold tracking-widest placeholder:text-zinc-800" 
                  placeholder="ID NUMBER"
                  autoFocus
                />
              </div>
              <div className="group">
                <label className="block text-[10px] uppercase text-zinc-300 font-bold mb-2 tracking-widest ml-1">Security Access Key</label>
                <input 
                  type="password" 
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black border-2 border-zinc-800 group-focus-within:border-red-600 p-5 rounded-2xl outline-none text-white transition-all text-center text-xl tracking-[0.5em] placeholder:tracking-widest placeholder:text-zinc-800" 
                  placeholder="••••••••"
                />
              </div>
              
              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 p-5 rounded-2xl font-bold transition-all transform active:scale-95 shadow-2xl shadow-red-600/30 text-white uppercase tracking-widest text-sm"
                >
                  Verify & Enter
                </button>
                <button 
                  type="button"
                  onClick={() => setShowLogin(false)}
                  className="w-full text-zinc-600 text-[10px] mt-6 hover:text-zinc-400 transition-colors uppercase font-black tracking-[0.2em]"
                >
                  Terminate Connection
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
