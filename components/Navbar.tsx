
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

    // Reset counter if no click for 3 seconds
    const timer = setTimeout(() => setClickCount(0), 3000);
    return () => clearTimeout(timer);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setShowLogin(false);
      sessionStorage.setItem('ggbs_admin_auth', 'true');
      window.location.hash = '#/admin';
      window.location.reload();
    } else {
      alert('Security Verification Failed.');
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
        <div className="fixed inset-0 bg-black/98 z-[99999] flex flex-col items-center justify-center p-6 backdrop-blur-2xl animate-fade-in overflow-hidden">
          <div 
            className="w-full max-w-md bg-zinc-900/90 p-12 rounded-[3rem] border border-red-600/30 shadow-[0_0_150px_rgba(220,38,38,0.3)] relative animate-fade-up" 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setShowLogin(false)}
              className="absolute top-8 right-8 text-zinc-600 hover:text-white transition-colors text-4xl leading-none"
            >
              &times;
            </button>

            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-red-600/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-red-600/20 shadow-inner">
                 <div className="w-10 h-10 border-t-4 border-r-4 border-red-600 rotate-45 translate-y-1"></div>
              </div>
              <h2 className="text-4xl font-oswald font-bold text-white uppercase tracking-tighter">Command Login</h2>
              <div className="w-12 h-1 bg-red-600 mx-auto rounded-full mt-3"></div>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-8">
              <div>
                <label className="block text-[10px] uppercase text-zinc-500 font-black mb-3 tracking-[0.3em] text-center">Identity Signature</label>
                <input 
                  type="text" 
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-black border-2 border-zinc-800 focus:border-red-600 p-5 rounded-2xl outline-none text-white transition-all text-center text-xl font-bold tracking-widest placeholder:text-zinc-800" 
                  placeholder="USER ID"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-zinc-500 font-black mb-3 tracking-[0.3em] text-center">Access Sequence</label>
                <input 
                  type="password" 
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black border-2 border-zinc-800 focus:border-red-600 p-5 rounded-2xl outline-none text-white transition-all text-center text-xl tracking-[0.8em] placeholder:tracking-widest placeholder:text-zinc-800" 
                  placeholder="••••••••"
                />
              </div>
              
              <div className="pt-6">
                <button 
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 p-6 rounded-[2rem] font-black transition-all transform active:scale-95 shadow-2xl shadow-red-600/40 text-white uppercase tracking-[0.4em] text-xs"
                >
                  Authorize Entry
                </button>
                <button 
                  type="button"
                  onClick={() => setShowLogin(false)}
                  className="w-full text-zinc-700 text-[10px] mt-8 hover:text-zinc-500 transition-colors uppercase font-black tracking-[0.2em]"
                >
                  Exit Control Interface
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
