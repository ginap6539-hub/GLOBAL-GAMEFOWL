
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
  
  // DB Settings State
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

    if (!supabase) {
      alert("Database engine is not connected. Please go to the 'DB Settings' tab first.");
      setActiveTab('database');
      return;
    }

    setIsUploading(fieldName);
    try {
      const publicUrl = await uploadFile(file);
      setContent({ ...content, [fieldName]: publicUrl });
      setSaveStatus(`${fieldName} uploaded!`);
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
      setSaveStatus('Global database synchronized!');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      alert('Sync Error: ' + (err as any).message);
    }
  };

  const saveDbSettings = () => {
    localStorage.setItem('ggbs_supabase_url', dbUrl);
    localStorage.setItem('ggbs_supabase_key', dbKey);
    alert('Database keys saved. Restarting connection...');
    window.location.reload();
  };

  const handleBackToSite = () => {
    window.location.hash = '#/';
    window.location.reload();
  };

  if (!content) return (
    <div className="h-screen bg-black flex flex-col items-center justify-center space-y-4">
      <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      <div className="text-red-600 font-oswald text-2xl font-bold uppercase animate-pulse tracking-widest">Waking Console...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 md:p-10 font-inter">
      <div className="max-w-7xl mx-auto">
        {/* Navigation Bar */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-16 gap-8 bg-zinc-900 p-8 rounded-[3rem] border border-white/5 shadow-2xl">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl md:text-5xl font-oswald font-bold tracking-tight">GGBS <span className="text-red-600">MASTER</span></h1>
            <p className="text-zinc-600 uppercase text-[10px] tracking-[0.6em] font-black mt-2">Central Ops Console v2.1</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <button 
              onClick={() => setActiveTab('content')}
              className={`px-6 py-4 rounded-2xl text-[10px] font-black tracking-widest transition-all uppercase ${activeTab === 'content' ? 'bg-red-600 text-white shadow-xl shadow-red-600/30' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
            >
              Control Center
            </button>
            <button 
              onClick={() => setActiveTab('investors')}
              className={`px-6 py-4 rounded-2xl text-[10px] font-black tracking-widest transition-all uppercase ${activeTab === 'investors' ? 'bg-red-600 text-white shadow-xl shadow-red-600/30' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
            >
              Leads ({investors.length})
            </button>
            <button 
              onClick={() => setActiveTab('database')}
              className={`px-6 py-4 rounded-2xl text-[10px] font-black tracking-widest transition-all uppercase ${activeTab === 'database' ? 'bg-red-600 text-white shadow-xl shadow-red-600/30' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
            >
              DB Settings
            </button>
            <div className="w-px h-12 bg-zinc-800 mx-2 hidden md:block"></div>
            <button 
              onClick={handleBackToSite}
              className="px-6 py-4 bg-white text-black rounded-2xl text-[10px] font-black tracking-widest hover:bg-zinc-200 transition-all uppercase"
            >
              Live Site
            </button>
            <button 
              onClick={onLogout}
              className="px-6 py-4 bg-zinc-800 text-red-500 rounded-2xl text-[10px] font-black tracking-widest hover:bg-red-600 hover:text-white transition-all uppercase"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Global Connection Warning */}
        {!supabase && activeTab !== 'database' && (
          <div className="bg-red-600/10 border-2 border-red-600 p-8 rounded-[2.5rem] mb-12 flex flex-col md:flex-row items-center justify-between gap-6 animate-pulse">
            <div>
              <h3 className="text-xl font-bold text-red-500 uppercase mb-1">Database Engine Offline</h3>
              <p className="text-red-500/80 text-sm font-medium">To enable global updates and file uploads, you must configure your Supabase keys.</p>
            </div>
            <button onClick={() => setActiveTab('database')} className="bg-red-600 text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Connect Database Now</button>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-10 animate-fade-up">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Media Control Section */}
              <div className="bg-zinc-900 rounded-[3rem] border border-white/5 p-12 space-y-10">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-red-600/10 flex items-center justify-center border border-red-600/20">
                     <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                  </div>
                  <h3 className="text-2xl font-oswald font-bold text-white uppercase tracking-widest">Video Engine</h3>
                </div>
                
                <div className="space-y-10">
                  <div className="group">
                    <label className="block text-[10px] font-black uppercase text-zinc-500 mb-4 tracking-[0.3em] group-hover:text-red-500 transition-colors">Main Hero Cinema (MP4 Upload)</label>
                    <div className="relative">
                      <input 
                        type="file" 
                        accept="video/*"
                        onChange={(e) => handleFileUpload(e, 'heroVideoUrl')}
                        className="w-full bg-black border-2 border-zinc-800 p-6 rounded-3xl text-sm file:mr-6 file:py-3 file:px-8 file:rounded-2xl file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-red-600 file:text-white cursor-pointer"
                      />
                      {isUploading === 'heroVideoUrl' && <div className="absolute inset-0 bg-black/90 rounded-3xl flex items-center justify-center text-red-600 font-bold tracking-widest animate-pulse">UPLOADING MEDIA...</div>}
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-[10px] font-black uppercase text-zinc-500 mb-4 tracking-[0.3em] group-hover:text-red-500 transition-colors">Fight Demo Channel (MP4 Upload)</label>
                    <div className="relative">
                      <input 
                        type="file" 
                        accept="video/*"
                        onChange={(e) => handleFileUpload(e, 'fightVideoUrl')}
                        className="w-full bg-black border-2 border-zinc-800 p-6 rounded-3xl text-sm file:mr-6 file:py-3 file:px-8 file:rounded-2xl file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-red-600 file:text-white cursor-pointer"
                      />
                      {isUploading === 'fightVideoUrl' && <div className="absolute inset-0 bg-black/90 rounded-3xl flex items-center justify-center text-red-600 font-bold tracking-widest animate-pulse">UPLOADING MEDIA...</div>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Brand Control Section */}
              <div className="bg-zinc-900 rounded-[3rem] border border-white/5 p-12 space-y-10">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-red-600/10 flex items-center justify-center border border-red-600/20">
                     <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  </div>
                  <h3 className="text-2xl font-oswald font-bold text-white uppercase tracking-widest">Brand Graphics</h3>
                </div>
                
                <div className="space-y-10">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-zinc-500 mb-4 tracking-[0.3em]">Master Logo (Replace GGBS Text)</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'logoUrl')}
                      className="w-full bg-black border-2 border-zinc-800 p-6 rounded-3xl text-sm file:mr-6 file:py-3 file:px-8 file:rounded-2xl file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-red-600 file:text-white cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-zinc-500 mb-4 tracking-[0.3em]">Digital Gloves Product Image</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'glovesImageUrl')}
                      className="w-full bg-black border-2 border-zinc-800 p-6 rounded-3xl text-sm file:mr-6 file:py-3 file:px-8 file:rounded-2xl file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-red-600 file:text-white cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Global Sync Action */}
            <div className="bg-red-600 p-12 rounded-[4rem] flex flex-col md:flex-row items-center justify-between gap-10 shadow-3xl shadow-red-600/30">
              <div className="text-center md:text-left">
                <h4 className="text-3xl font-oswald font-bold text-white uppercase leading-none mb-3">Commit Global Sync</h4>
                <p className="text-red-100 text-[10px] font-bold uppercase tracking-[0.3em]">Status: {saveStatus || 'Awaiting Master Command'}</p>
              </div>
              <button 
                onClick={handleSave}
                disabled={!!isUploading || !supabase}
                className="bg-white text-red-600 px-20 py-8 rounded-[2.5rem] font-black uppercase text-xs tracking-[0.5em] hover:bg-black hover:text-white transition-all transform active:scale-95 disabled:opacity-50"
              >
                {isUploading ? 'MEDIA PROCESSING...' : 'DEPLOY CHANGES'}
              </button>
            </div>
          </div>
        ) : activeTab === 'investors' ? (
          <div className="bg-zinc-900 rounded-[3rem] border border-white/5 p-12 animate-fade-up">
             <div className="flex justify-between items-center mb-12">
               <h3 className="text-4xl font-oswald font-bold text-red-600 uppercase tracking-tighter">Secure Leads Vault</h3>
               <span className="bg-red-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{investors.length} INVESTORS</span>
             </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-600 text-[10px] font-black uppercase tracking-widest">
                    <th className="pb-8 px-6 text-left">Time Log</th>
                    <th className="pb-8 px-6 text-left">Investor Entity</th>
                    <th className="pb-8 px-6 text-left">Communication Channel</th>
                    <th className="pb-8 px-6 text-left">Proposal Brief</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {investors.length === 0 ? (
                    <tr><td colSpan={4} className="py-32 text-center text-zinc-700 font-black uppercase tracking-[0.4em]">Vault is currently empty</td></tr>
                  ) : (
                    investors.map((lead) => (
                      <tr key={lead.id} className="group hover:bg-white/5 transition-all">
                        <td className="py-10 px-6 text-xs font-mono text-zinc-500 whitespace-nowrap">{new Date(lead.created_at!).toLocaleString()}</td>
                        <td className="py-10 px-6 font-black text-white group-hover:text-red-500 transition-colors uppercase text-lg">{lead.name}</td>
                        <td className="py-10 px-6">
                          <p className="font-bold text-sm">{lead.email}</p>
                          <p className="text-zinc-500 text-[10px] font-black mt-2 tracking-widest">PH: {lead.phone}</p>
                        </td>
                        <td className="py-10 px-6 text-zinc-400 text-sm italic leading-relaxed">{lead.message}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Database Settings Tab */
          <div className="bg-zinc-900 rounded-[4rem] border border-white/5 p-12 md:p-24 animate-fade-up max-w-4xl mx-auto text-center">
            <div className="w-24 h-24 bg-red-600/10 rounded-[2rem] flex items-center justify-center mx-auto mb-10 border border-red-600/20 shadow-2xl">
               <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path></svg>
            </div>
            <h3 className="text-5xl font-oswald font-bold text-white uppercase tracking-tighter mb-6">Database Connectivity</h3>
            <p className="text-zinc-500 mb-16 text-lg leading-relaxed max-w-2xl mx-auto font-light">
              To allow all viewers globally to see your video and image changes, you must link your dedicated Supabase project. These keys are stored in your browser's secure memory.
            </p>
            
            <div className="space-y-10 text-left">
              <div className="group">
                <label className="block text-[10px] font-black uppercase text-red-600 mb-4 tracking-[0.3em] ml-2">Supabase Project URL</label>
                <input 
                  type="text" 
                  value={dbUrl}
                  onChange={(e) => setDbUrl(e.target.value)}
                  className="w-full bg-black border-2 border-zinc-800 group-focus-within:border-red-600 p-8 rounded-3xl outline-none text-white font-mono text-sm shadow-inner transition-all" 
                  placeholder="https://abc...supabase.co"
                />
              </div>
              <div className="group">
                <label className="block text-[10px] font-black uppercase text-red-600 mb-4 tracking-[0.3em] ml-2">Supabase Service Key (Anon)</label>
                <input 
                  type="password" 
                  value={dbKey}
                  onChange={(e) => setDbKey(e.target.value)}
                  className="w-full bg-black border-2 border-zinc-800 group-focus-within:border-red-600 p-8 rounded-3xl outline-none text-white font-mono text-sm shadow-inner transition-all" 
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                />
              </div>
              <button 
                onClick={saveDbSettings}
                className="w-full bg-white text-black p-8 rounded-[3rem] font-black uppercase text-xs tracking-[0.6em] hover:bg-red-600 hover:text-white transition-all transform active:scale-95 shadow-3xl shadow-black/50 mt-4"
              >
                Establish Database Link
              </button>
            </div>
            
            <p className="mt-16 text-zinc-600 text-[10px] font-bold uppercase tracking-[0.3em]">
              * Required: Storage Bucket named "media" set to PUBLIC status in Supabase.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
