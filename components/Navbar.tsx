
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
  const navigate = useNavigate();

  const handleLogoClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    
    if (newCount === 7) {
      setShowLogin(true);
      setClickCount(0);
    }

    // Reset counter if not clicked again within 3 seconds
    const timer = setTimeout(() => setClickCount(0), 3000);
    return () => clearTimeout(timer);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setShowLogin(false);
      // Persist auth state
      sessionStorage.setItem('ggbs_admin_auth', 'true');
      // Force a hard reload to the admin route to ensure App state refreshes
      window.location.href = window.location.origin + window.location.pathname + '#/admin';
      window.location.reload();
    } else {
      alert('Invalid Credentials. Use: admin / password123');
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
          <span className="ml-2 text-[10px] text-white/20 opacity-0 group-hover:opacity-100 transition-opacity uppercase font-bold">
            (Click 7x for Admin)
          </span>
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
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[999] px-4 backdrop-blur-sm">
          <div 
            className="relative bg-zinc-900 p-8 rounded-2xl border border-red-600 shadow-[0_0_50px_rgba(220,38,38,0.3)] w-full max-w-md animate-fade-up" 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setShowLogin(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors text-2xl"
            >
              &times;
            </button>

            <h2 className="text-3xl font-oswald font-bold mb-2 text-center text-white">ADMIN ACCESS</h2>
            <p className="text-zinc-500 text-center text-xs uppercase tracking-widest mb-8 font-bold">Restricted Area</p>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-xs uppercase text-zinc-300 font-bold mb-2 tracking-widest">Username (ID)</label>
                <input 
                  type="text" 
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-black border-2 border-zinc-800 p-4 rounded-xl focus:border-red-600 outline-none text-white transition-all font-semibold" 
                  placeholder="Enter admin ID"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-xs uppercase text-zinc-300 font-bold mb-2 tracking-widest">Password</label>
                <input 
                  type="password" 
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black border-2 border-zinc-800 p-4 rounded-xl focus:border-red-600 outline-none text-white transition-all font-semibold" 
                  placeholder="••••••••"
                />
              </div>
              
              <div className="pt-2">
                <button 
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 p-4 rounded-xl font-bold transition-all transform active:scale-95 shadow-lg shadow-red-600/20 text-white uppercase tracking-widest"
                >
                  LOG IN TO DASHBOARD
                </button>
                <button 
                  type="button"
                  onClick={() => setShowLogin(false)}
                  className="w-full text-zinc-500 text-sm mt-4 hover:text-zinc-300 transition-colors uppercase font-bold tracking-tighter"
                >
                  Cancel and Return
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
