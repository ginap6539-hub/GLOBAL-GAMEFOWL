
import React, { useState, useEffect } from 'react';
import { updateSiteContent, fetchInvestorLeads, fetchSiteContent, uploadFile, getSupabaseClient } from '../services/supabase';
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
  const [isConnected, setIsConnected] = useState(false);
  
  const [dbUrl, setDbUrl] = useState(localStorage.getItem('ggbs_supabase_url') || '');
  const [dbKey, setDbKey] = useState(localStorage.getItem('ggbs_supabase_key') || '');

  useEffect(() => {
    const loadData = async () => {
      const site = await fetchSiteContent();
      const leads = await fetchInvestorLeads();
      setContent(site);
      setInvestors(leads);
      setIsConnected(!!getSupabaseClient());
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
      localStorage.setItem('ggbs_local_content', JSON.stringify(newContent));
      setSaveStatus(`${fieldName} preview updated.`);
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      alert(`File Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsUploading(null);
    }
  };

  const handleSave = async () => {
    if (!content) return;
    try {
      await updateSiteContent(content);
      onUpdate();
      setSaveStatus('DATABASE SYNC SUCCESSFUL!');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Sync Error');
    }
  };

  const saveDbSettings = () => {
    localStorage.setItem('ggbs_supabase_url', dbUrl.trim());
    localStorage.setItem('ggbs_supabase_key', dbKey.trim());
    setIsConnected(!!getSupabaseClient());
    setSaveStatus('Database credentials updated.');
    setTimeout(() => setSaveStatus(null), 3000);
    setActiveTab('content');
  };

  const handleBackToSite = () => {
    window.location.hash = '#/';
    window.location.reload();
  };

  if (!content) return (
    <div className="h-screen bg-black flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      <div className="text-red-600 font-oswald text-xl font-bold uppercase animate-pulse tracking-widest text-center px-6">Initializing Command Console...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-10 font-inter">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="w-full bg-zinc-900/40 p-8 md:p-12 rounded-[3.5rem] border border-white/5 shadow-3xl mb-12 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-4 mb-2">
              <h1 className="text-4xl md:text-5xl font-oswald font-bold tracking-tight uppercase">GGBS <span className="text-red-600">HUB</span></h1>
              <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-2 ${isConnected ? 'bg-green-600/20 text-green-500 border border-green-500/30' : 'bg-red-600/20 text-red-500 border border-red-500/30'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                {isConnected ? 'LIVE SYNC ACTIVE' : 'LOCAL MODE'}
              </div>
            </div>
            <p className="text-zinc-600 uppercase text-[9px] tracking-[0.8em] font-black">Management System v3.0</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            <button 
              onClick={() => setActiveTab('content')}
              className={`px-6 py-4 rounded-2xl text-[9px] font-black tracking-widest transition-all uppercase ${activeTab === 'content' ? 'bg-red-600 text-white shadow-xl shadow-red-600/30' : 'bg-zinc-800 text-zinc-500 hover:text-white'}`}
            >
              Master Assets
            </button>
            <button 
              onClick={() => setActiveTab('investors')}
              className={`px-6 py-4 rounded-2xl text-[9px] font-black tracking-widest transition-all uppercase ${activeTab === 'investors' ? 'bg-red-600 text-white shadow-xl shadow-red-600/30' : 'bg-zinc-800 text-zinc-500 hover:text-white'}`}
            >
              Leads ({investors.length})
            </button>
            <button 
              onClick={() => setActiveTab('database')}
              className={`px-6 py-4 rounded-2xl text-[9px] font-black tracking-widest transition-all uppercase ${activeTab === 'database' ? 'bg-red-600 text-white shadow-xl shadow-red-600/30' : 'bg-zinc-800 text-zinc-500 hover:text-white'}`}
            >
              Connection
            </button>
            <div className="w-px h-10 bg-zinc-800 mx-2 hidden md:block self-center"></div>
            <button 
              onClick={handleBackToSite}
              className="px-6 py-4 bg-white text-black rounded-2xl text-[9px] font-black tracking-widest hover:bg-red-600 hover:text-white transition-all uppercase"
            >
              Live Site
            </button>
            <button 
              onClick={onLogout}
              className="px-6 py-4 bg-zinc-900 border border-zinc-800 text-red-600 rounded-2xl text-[9px] font-black tracking-widest hover:bg-red-600 hover:text-white transition-all uppercase"
            >
              Logout
            </button>
          </div>
        </div>

        {!isConnected && activeTab !== 'database' && (
          <div className="bg-red-600/10 border-2 border-red-600/30 p-8 rounded-[2.5rem] mb-12 flex flex-col md:flex-row items-center justify-between gap-6 animate-fade-in shadow-2xl">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-red-500 uppercase mb-1">Attention: Database Not Linked</h3>
              <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider">Changes will only be saved to your current browser until you link your Supabase account.</p>
            </div>
            <button onClick={() => setActiveTab('database')} className="bg-red-600 text-white px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-transform">Configure Link Now</button>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-12 animate-fade-up">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Video Panel */}
              <div className="bg-zinc-900/60 rounded-[3rem] border border-white/5 p-10 space-y-10 shadow-2xl">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-red-600/10 flex items-center justify-center border border-red-600/20">
                     <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                  </div>
                  <h3 className="text-xl font-oswald font-bold text-white uppercase tracking-[0.2em]">Video Controls</h3>
                </div>
                
                <div className="space-y-8">
                  <div className="group">
                    <label className="block text-[9px] font-black uppercase text-zinc-600 mb-4 tracking-[0.3em] group-hover:text-red-500 transition-colors">Hero Background Video (MP4)</label>
                    <div className="relative">
                      <input 
                        type="file" 
                        accept="video/*"
                        onChange={(e) => handleFileUpload(e, 'heroVideoUrl')}
                        className="w-full bg-black/40 border-2 border-zinc-800 p-5 rounded-2xl text-xs file:mr-4 file:py-2 file:px-6 file:rounded-xl file:border-0 file:text-[9px] file:font-black file:uppercase file:bg-red-600 file:text-white cursor-pointer hover:border-zinc-700 transition-all"
                      />
                      {isUploading === 'heroVideoUrl' && <div className="absolute inset-0 bg-black/90 rounded-2xl flex items-center justify-center text-red-600 font-black tracking-widest animate-pulse">OPTIMIZING VIDEO...</div>}
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-[9px] font-black uppercase text-zinc-600 mb-4 tracking-[0.3em] group-hover:text-red-500 transition-colors">Fight Demo Channel (MP4)</label>
                    <div className="relative">
                      <input 
                        type="file" 
                        accept="video/*"
                        onChange={(e) => handleFileUpload(e, 'fightVideoUrl')}
                        className="w-full bg-black/40 border-2 border-zinc-800 p-5 rounded-2xl text-xs file:mr-4 file:py-2 file:px-6 file:rounded-xl file:border-0 file:text-[9px] file:font-black file:uppercase file:bg-red-600 file:text-white cursor-pointer hover:border-zinc-700 transition-all"
                      />
                      {isUploading === 'fightVideoUrl' && <div className="absolute inset-0 bg-black/90 rounded-2xl flex items-center justify-center text-red-600 font-black tracking-widest animate-pulse">OPTIMIZING VIDEO...</div>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Graphic Panel */}
              <div className="bg-zinc-900/60 rounded-[3rem] border border-white/5 p-10 space-y-10 shadow-2xl">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-red-600/10 flex items-center justify-center border border-red-600/20">
                     <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  </div>
                  <h3 className="text-xl font-oswald font-bold text-white uppercase tracking-[0.2em]">Graphic Assets</h3>
                </div>
                
                <div className="space-y-8">
                  <div>
                    <label className="block text-[9px] font-black uppercase text-zinc-600 mb-4 tracking-[0.3em]">Master Brand Logo</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'logoUrl')}
                      className="w-full bg-black/40 border-2 border-zinc-800 p-5 rounded-2xl text-xs file:mr-4 file:py-2 file:px-6 file:rounded-xl file:border-0 file:text-[9px] file:font-black file:uppercase file:bg-red-600 file:text-white cursor-pointer hover:border-zinc-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black uppercase text-zinc-600 mb-4 tracking-[0.3em]">Gloves Product Shot</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'glovesImageUrl')}
                      className="w-full bg-black/40 border-2 border-zinc-800 p-5 rounded-2xl text-xs file:mr-4 file:py-2 file:px-6 file:rounded-xl file:border-0 file:text-[9px] file:font-black file:uppercase file:bg-red-600 file:text-white cursor-pointer hover:border-zinc-700"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Global Push Section */}
            <div className="bg-red-600 p-10 md:p-14 rounded-[4rem] flex flex-col md:flex-row items-center justify-between gap-10 shadow-3xl shadow-red-600/20 transform transition-all hover:scale-[1.01]">
              <div className="text-center md:text-left">
                <h4 className="text-3xl font-oswald font-bold text-white uppercase leading-none mb-4">Finalize Global Update</h4>
                <p className="text-red-100 text-[9px] font-black uppercase tracking-[0.3em]">Current System Status: {saveStatus || (isConnected ? 'Operational' : 'Local Preview Only')}</p>
              </div>
              <button 
                onClick={handleSave}
                disabled={!!isUploading}
                className="bg-white text-red-600 px-16 py-7 rounded-[2.5rem] font-black uppercase text-[10px] tracking-[0.5em] hover:bg-black hover:text-white transition-all transform active:scale-95 disabled:opacity-50 shadow-2xl"
              >
                {isUploading ? 'OPTIMIZING MEDIA...' : 'PUSH CHANGES WORLDWIDE'}
              </button>
            </div>
          </div>
        ) : activeTab === 'investors' ? (
          <div className="bg-zinc-900/60 rounded-[3.5rem] border border-white/5 p-12 animate-fade-up shadow-2xl">
             <div className="flex justify-between items-center mb-12 border-b border-zinc-800 pb-10">
               <h3 className="text-4xl font-oswald font-bold text-red-600 uppercase tracking-tighter">Verified Leads</h3>
               <span className="bg-zinc-800 text-zinc-400 px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest">{investors.length} INVESTORS</span>
             </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.4em]">
                    <th className="pb-10 px-6 text-left">Time Log</th>
                    <th className="pb-10 px-6 text-left">Identity</th>
                    <th className="pb-10 px-6 text-left">Message / Terms</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/30">
                  {investors.length === 0 ? (
                    <tr><td colSpan={3} className="py-40 text-center text-zinc-700 font-black uppercase tracking-[0.5em]">No data captured in secure vault</td></tr>
                  ) : (
                    investors.map((lead) => (
                      <tr key={lead.id} className="group hover:bg-white/5 transition-all">
                        <td className="py-10 px-6 text-xs font-mono text-zinc-500 whitespace-nowrap">{new Date(lead.created_at!).toLocaleString()}</td>
                        <td className="py-10 px-6">
                           <p className="font-black text-white group-hover:text-red-500 transition-colors uppercase text-lg">{lead.name}</p>
                           <p className="text-zinc-600 text-[9px] font-black mt-1 tracking-widest">{lead.email} | {lead.phone}</p>
                        </td>
                        <td className="py-10 px-6 text-zinc-400 text-sm italic leading-relaxed max-w-sm">{lead.message}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Database Connection Tab */
          <div className="bg-zinc-900/60 rounded-[4rem] border border-white/5 p-12 md:p-24 animate-fade-up max-w-4xl mx-auto text-center shadow-2xl">
            <div className="w-20 h-20 bg-red-600/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-red-600/20 shadow-inner">
               <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <h3 className="text-5xl font-oswald font-bold text-white uppercase tracking-tighter mb-6 leading-none">Database Link</h3>
            <p className="text-zinc-500 mb-16 text-lg leading-relaxed max-w-2xl mx-auto font-light">
              Enter your Supabase credentials below to activate global synchronization. Once linked, any updates you make will be visible to all visitors worldwide instantly.
            </p>
            
            <div className="space-y-10 text-left">
              <div className="group">
                <label className="block text-[9px] font-black uppercase text-red-600 mb-4 tracking-[0.4em] ml-2">Supabase Project URL</label>
                <input 
                  type="text" 
                  value={dbUrl}
                  onChange={(e) => setDbUrl(e.target.value)}
                  className="w-full bg-black/60 border-2 border-zinc-800 group-focus-within:border-red-600 p-7 rounded-[2rem] outline-none text-white font-mono text-sm shadow-inner transition-all" 
                  placeholder="https://abc123...supabase.co"
                />
              </div>
              <div className="group">
                <label className="block text-[9px] font-black uppercase text-red-600 mb-4 tracking-[0.4em] ml-2">Project Secret (Anon Key)</label>
                <input 
                  type="password" 
                  value={dbKey}
                  onChange={(e) => setDbKey(e.target.value)}
                  className="w-full bg-black/60 border-2 border-zinc-800 group-focus-within:border-red-600 p-7 rounded-[2rem] outline-none text-white font-mono text-sm shadow-inner transition-all" 
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX..."
                />
              </div>
              <button 
                onClick={saveDbSettings}
                className="w-full bg-white text-black p-8 rounded-[3rem] font-black uppercase text-xs tracking-[0.7em] hover:bg-red-600 hover:text-white transition-all transform active:scale-95 shadow-3xl mt-4"
              >
                Connect System Engine
              </button>
            </div>
            
            <p className="mt-16 text-zinc-600 text-[9px] font-black uppercase tracking-[0.4em]">
              * Secure: Credentials are stored locally in your browser.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
