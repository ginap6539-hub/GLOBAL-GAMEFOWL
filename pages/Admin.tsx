
import React, { useState, useEffect } from 'react';
import { updateSiteContent, fetchInvestorLeads, fetchSiteContent, uploadFile, supabase } from '../services/supabase';
import { SiteContent, InvestorLead } from '../types';

interface AdminProps {
  onLogout: () => void;
  onUpdate: () => void;
}

const Admin: React.FC<AdminProps> = ({ onLogout, onUpdate }) => {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [investors, setInvestors] = useState<InvestorLead[]>([]);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'investors' | 'database'>('content');
  
  const [dbUrl, setDbUrl] = useState(localStorage.getItem('ggbs_supabase_url') || '');
  const [dbKey, setDbKey] = useState(localStorage.getItem('ggbs_supabase_key') || '');

  useEffect(() => {
    const loadData = async () => {
      const site = await fetchSiteContent();
      const leads = await fetchInvestorLeads();
      setContent(site);
      setInvestors(leads);
    };
    loadData();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof SiteContent) => {
    const file = e.target.files?.[0];
    if (!file || !content) return;

    setIsUploading(fieldName);
    try {
      const publicUrl = await uploadFile(file);
      const newContent = { ...content, [fieldName]: publicUrl };
      setContent(newContent);
      // Save locally immediately
      localStorage.setItem('ggbs_local_content', JSON.stringify(newContent));
      setSaveStatus(`${fieldName} ready to sync.`);
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      alert(`Upload failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsUploading(null);
    }
  };

  const handleSave = async () => {
    if (!content) return;
    try {
      await updateSiteContent(content);
      onUpdate();
      setSaveStatus('GLOBAL SYNC SUCCESSFUL!');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Sync Error');
    }
  };

  const saveDbSettings = () => {
    localStorage.setItem('ggbs_supabase_url', dbUrl.trim());
    localStorage.setItem('ggbs_supabase_key', dbKey.trim());
    alert('Database configurations saved. Restarting connection...');
    window.location.reload();
  };

  const handleBackToSite = () => {
    window.location.hash = '#/';
    window.location.reload();
  };

  if (!content) return (
    <div className="h-screen bg-black flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      <div className="text-red-600 font-oswald text-xl font-bold uppercase animate-pulse tracking-widest">Accessing Command Center...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-10 font-inter">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Centered Header Section */}
        <div className="w-full bg-zinc-900/50 p-8 md:p-12 rounded-[3.5rem] border border-white/5 shadow-3xl mb-12 flex flex-col items-center text-center">
          <div className="mb-6">
            <h1 className="text-4xl md:text-6xl font-oswald font-bold tracking-tight">GGBS <span className="text-red-600">COMMAND</span></h1>
            <p className="text-zinc-500 uppercase text-[10px] tracking-[0.7em] font-black mt-3">Global Management Console v2.5</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <button 
              onClick={() => setActiveTab('content')}
              className={`px-8 py-4 rounded-2xl text-[10px] font-black tracking-widest transition-all uppercase ${activeTab === 'content' ? 'bg-red-600 text-white shadow-2xl shadow-red-600/40 scale-105' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
            >
              Master Assets
            </button>
            <button 
              onClick={() => setActiveTab('investors')}
              className={`px-8 py-4 rounded-2xl text-[10px] font-black tracking-widest transition-all uppercase ${activeTab === 'investors' ? 'bg-red-600 text-white shadow-2xl shadow-red-600/40 scale-105' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
            >
              Investors ({investors.length})
            </button>
            <button 
              onClick={() => setActiveTab('database')}
              className={`px-8 py-4 rounded-2xl text-[10px] font-black tracking-widest transition-all uppercase ${activeTab === 'database' ? 'bg-red-600 text-white shadow-2xl shadow-red-600/40 scale-105' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
            >
              DB Settings
            </button>
            <div className="w-px h-10 bg-zinc-800 mx-2 hidden md:block self-center"></div>
            <button 
              onClick={handleBackToSite}
              className="px-8 py-4 bg-white text-black rounded-2xl text-[10px] font-black tracking-widest hover:bg-red-600 hover:text-white transition-all uppercase"
            >
              Live Site
            </button>
            <button 
              onClick={onLogout}
              className="px-8 py-4 bg-zinc-900 border border-zinc-800 text-red-600 rounded-2xl text-[10px] font-black tracking-widest hover:bg-red-600 hover:text-white transition-all uppercase"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Global Connection Warning */}
        {!supabase && activeTab !== 'database' && (
          <div className="w-full bg-red-600/10 border-2 border-red-600 p-10 rounded-[3rem] mb-12 flex flex-col md:flex-row items-center justify-between gap-8 animate-pulse shadow-2xl shadow-red-600/10">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-red-500 uppercase mb-2">Supabase Engine Offline</h3>
              <p className="text-red-500/80 text-sm font-medium">You are in <b>Local Preview Mode</b>. Changes will only be visible to you until you connect your DB.</p>
            </div>
            <button onClick={() => setActiveTab('database')} className="bg-red-600 text-white px-12 py-5 rounded-2xl text-xs font-black uppercase tracking-widest whitespace-nowrap shadow-xl">Activate Global Sync</button>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="w-full space-y-12 animate-fade-up">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Media Controls */}
              <div className="bg-zinc-900 rounded-[3.5rem] border border-white/5 p-12 space-y-10 shadow-2xl">
                <div className="flex items-center gap-6 mb-4">
                  <div className="w-16 h-16 rounded-[1.8rem] bg-red-600/10 flex items-center justify-center border border-red-600/20">
                     <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                  </div>
                  <h3 className="text-2xl font-oswald font-bold text-white uppercase tracking-[0.2em]">Cinema Deck</h3>
                </div>
                
                <div className="space-y-10">
                  <div className="group">
                    <label className="block text-[10px] font-black uppercase text-zinc-500 mb-4 tracking-[0.4em] group-hover:text-red-500 transition-colors">Main Hero Video</label>
                    <div className="relative">
                      <input 
                        type="file" 
                        accept="video/*"
                        onChange={(e) => handleFileUpload(e, 'heroVideoUrl')}
                        className="w-full bg-black border-2 border-zinc-800 p-6 rounded-3xl text-xs file:mr-6 file:py-3 file:px-8 file:rounded-2xl file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-red-600 file:text-white cursor-pointer transition-all hover:border-red-600/50"
                      />
                      {isUploading === 'heroVideoUrl' && <div className="absolute inset-0 bg-black/95 rounded-3xl flex items-center justify-center text-red-600 font-black tracking-widest animate-pulse">PROCESSING...</div>}
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-[10px] font-black uppercase text-zinc-500 mb-4 tracking-[0.4em] group-hover:text-red-500 transition-colors">Fight Demo Channel</label>
                    <div className="relative">
                      <input 
                        type="file" 
                        accept="video/*"
                        onChange={(e) => handleFileUpload(e, 'fightVideoUrl')}
                        className="w-full bg-black border-2 border-zinc-800 p-6 rounded-3xl text-xs file:mr-6 file:py-3 file:px-8 file:rounded-2xl file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-red-600 file:text-white cursor-pointer transition-all hover:border-red-600/50"
                      />
                      {isUploading === 'fightVideoUrl' && <div className="absolute inset-0 bg-black/95 rounded-3xl flex items-center justify-center text-red-600 font-black tracking-widest animate-pulse">PROCESSING...</div>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Graphic Controls */}
              <div className="bg-zinc-900 rounded-[3.5rem] border border-white/5 p-12 space-y-10 shadow-2xl">
                <div className="flex items-center gap-6 mb-4">
                  <div className="w-16 h-16 rounded-[1.8rem] bg-red-600/10 flex items-center justify-center border border-red-600/20">
                     <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  </div>
                  <h3 className="text-2xl font-oswald font-bold text-white uppercase tracking-[0.2em]">Brand Vault</h3>
                </div>
                
                <div className="space-y-10">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-zinc-500 mb-4 tracking-[0.4em]">Primary Logo</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'logoUrl')}
                      className="w-full bg-black border-2 border-zinc-800 p-6 rounded-3xl text-xs file:mr-6 file:py-3 file:px-8 file:rounded-2xl file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-red-600 file:text-white cursor-pointer transition-all hover:border-red-600/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-zinc-500 mb-4 tracking-[0.4em]">Digital Gloves Asset</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'glovesImageUrl')}
                      className="w-full bg-black border-2 border-zinc-800 p-6 rounded-3xl text-xs file:mr-6 file:py-3 file:px-8 file:rounded-2xl file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-red-600 file:text-white cursor-pointer transition-all hover:border-red-600/50"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Global Deploy Action */}
            <div className="bg-red-600 p-12 rounded-[4rem] flex flex-col md:flex-row items-center justify-between gap-10 shadow-[0_0_100px_rgba(220,38,38,0.3)] transform transition-all hover:scale-[1.01]">
              <div className="text-center md:text-left">
                <h4 className="text-3xl font-oswald font-bold text-white uppercase leading-none mb-4">Push Global Update</h4>
                <p className="text-red-100 text-[10px] font-bold uppercase tracking-[0.4em]">Current Buffer: {saveStatus || 'Awaiting Command'}</p>
              </div>
              <button 
                onClick={handleSave}
                disabled={!!isUploading}
                className="bg-white text-red-600 px-24 py-8 rounded-[2.5rem] font-black uppercase text-xs tracking-[0.6em] hover:bg-black hover:text-white transition-all transform active:scale-95 disabled:opacity-50 shadow-2xl"
              >
                {isUploading ? 'MEDIA PROCESSING...' : 'DEPLOY TO WORLDWIDE'}
              </button>
            </div>
          </div>
        ) : activeTab === 'investors' ? (
          <div className="w-full bg-zinc-900 rounded-[3.5rem] border border-white/5 p-12 animate-fade-up shadow-2xl">
             <div className="flex justify-between items-center mb-12 border-b border-zinc-800 pb-10">
               <h3 className="text-4xl font-oswald font-bold text-red-600 uppercase tracking-tighter">Investor Database</h3>
               <span className="bg-red-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">{investors.length} ACTIVE LEADS</span>
             </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em]">
                    <th className="pb-10 px-8 text-left">Timeline</th>
                    <th className="pb-10 px-8 text-left">Identity</th>
                    <th className="pb-10 px-8 text-left">Contact Point</th>
                    <th className="pb-10 px-8 text-left">Proposal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {investors.length === 0 ? (
                    <tr><td colSpan={4} className="py-40 text-center text-zinc-700 font-black uppercase tracking-[0.5em]">No leads recovered from vault</td></tr>
                  ) : (
                    investors.map((lead) => (
                      <tr key={lead.id} className="group hover:bg-white/5 transition-all">
                        <td className="py-12 px-8 text-xs font-mono text-zinc-500 whitespace-nowrap">{new Date(lead.created_at!).toLocaleString()}</td>
                        <td className="py-12 px-8 font-black text-white group-hover:text-red-500 transition-colors uppercase text-xl">{lead.name}</td>
                        <td className="py-12 px-8">
                          <p className="font-bold text-base text-zinc-300">{lead.email}</p>
                          <p className="text-zinc-600 text-[10px] font-black mt-2 tracking-widest">PH: {lead.phone}</p>
                        </td>
                        <td className="py-12 px-8 text-zinc-400 text-sm italic leading-relaxed max-w-sm">{lead.message}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Database Setup Tab */
          <div className="w-full bg-zinc-900 rounded-[5rem] border border-white/5 p-12 md:p-24 animate-fade-up max-w-4xl mx-auto text-center shadow-2xl">
            <div className="w-24 h-24 bg-red-600/10 rounded-[2.2rem] flex items-center justify-center mx-auto mb-10 border border-red-600/20 shadow-inner">
               <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path></svg>
            </div>
            <h3 className="text-5xl font-oswald font-bold text-white uppercase tracking-tighter mb-8">Database Engine</h3>
            <p className="text-zinc-500 mb-16 text-lg leading-relaxed max-w-2xl mx-auto font-light">
              Enter your project credentials to enable worldwide synchronization. This creates a permanent link between your admin panel and the live website.
            </p>
            
            <div className="space-y-12 text-left">
              <div className="group">
                <label className="block text-[10px] font-black uppercase text-red-600 mb-4 tracking-[0.4em] ml-2">Supabase Public URL</label>
                <input 
                  type="text" 
                  value={dbUrl}
                  onChange={(e) => setDbUrl(e.target.value)}
                  className="w-full bg-black border-2 border-zinc-800 group-focus-within:border-red-600 p-8 rounded-[2rem] outline-none text-white font-mono text-sm shadow-inner transition-all" 
                  placeholder="https://your-id.supabase.co"
                />
              </div>
              <div className="group">
                <label className="block text-[10px] font-black uppercase text-red-600 mb-4 tracking-[0.4em] ml-2">Supabase API Secret (Anon Key)</label>
                <input 
                  type="password" 
                  value={dbKey}
                  onChange={(e) => setDbKey(e.target.value)}
                  className="w-full bg-black border-2 border-zinc-800 group-focus-within:border-red-600 p-8 rounded-[2rem] outline-none text-white font-mono text-sm shadow-inner transition-all" 
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5..."
                />
              </div>
              <button 
                onClick={saveDbSettings}
                className="w-full bg-white text-black p-8 rounded-[3rem] font-black uppercase text-xs tracking-[0.7em] hover:bg-red-600 hover:text-white transition-all transform active:scale-95 shadow-3xl mt-6"
              >
                Establish Secure Connection
              </button>
            </div>
            
            <div className="mt-20 p-8 border border-white/5 rounded-3xl bg-black/40">
              <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.4em]">
                * Configuration Check: Bucket "media" must be set to PUBLIC in Supabase Storage.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
