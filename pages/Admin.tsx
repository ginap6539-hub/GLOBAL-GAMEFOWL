
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

    setIsUploading(fieldName);
    try {
      const publicUrl = await uploadFile(file);
      setContent({ ...content, [fieldName]: publicUrl });
      setSaveStatus(`${fieldName} uploaded! Remember to sync.`);
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
      setSaveStatus('Global database synced successfully!');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      alert('Sync Error: ' + (err as any).message);
    }
  };

  const saveDbSettings = () => {
    localStorage.setItem('ggbs_supabase_url', dbUrl);
    localStorage.setItem('ggbs_supabase_key', dbKey);
    alert('Settings saved. Refreshing to apply connection...');
    window.location.reload();
  };

  const handleBackToSite = () => {
    window.location.hash = '#/';
    window.location.reload();
  };

  if (!content) return <div className="h-screen bg-black flex items-center justify-center text-red-600 font-oswald text-2xl font-bold uppercase animate-pulse">Initializing Command Center...</div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 md:p-8 font-inter">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-12 gap-6 bg-zinc-900/50 p-6 md:p-10 rounded-[2.5rem] border border-white/5">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl md:text-5xl font-oswald font-bold tracking-tight">GGBS <span className="text-red-600">COMMAND</span></h1>
            <p className="text-zinc-500 uppercase text-[10px] tracking-[0.5em] font-black mt-2">Central Management Console v2.0</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <button 
              onClick={() => setActiveTab('content')}
              className={`px-5 py-3 rounded-2xl text-[10px] font-black tracking-widest transition-all uppercase ${activeTab === 'content' ? 'bg-red-600 text-white shadow-xl shadow-red-600/20' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
            >
              Master Content
            </button>
            <button 
              onClick={() => setActiveTab('investors')}
              className={`px-5 py-3 rounded-2xl text-[10px] font-black tracking-widest transition-all uppercase ${activeTab === 'investors' ? 'bg-red-600 text-white shadow-xl shadow-red-600/20' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
            >
              Leads ({investors.length})
            </button>
            <button 
              onClick={() => setActiveTab('database')}
              className={`px-5 py-3 rounded-2xl text-[10px] font-black tracking-widest transition-all uppercase ${activeTab === 'database' ? 'bg-red-600 text-white shadow-xl shadow-red-600/20' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
            >
              DB Settings
            </button>
            <button 
              onClick={onLogout}
              className="px-5 py-3 bg-zinc-900 border border-zinc-800 text-zinc-500 rounded-2xl text-[10px] font-black tracking-widest hover:text-white transition-all uppercase"
            >
              Logout
            </button>
            <button 
              onClick={handleBackToSite}
              className="px-5 py-3 bg-white text-black rounded-2xl text-[10px] font-black tracking-widest hover:bg-red-600 hover:text-white transition-all uppercase"
            >
              View Live Site
            </button>
          </div>
        </div>

        {!supabase && activeTab !== 'database' && (
          <div className="bg-red-600/10 border border-red-600/50 p-6 rounded-2xl mb-8 flex items-center justify-between">
            <p className="text-red-500 font-bold text-sm">CRITICAL: Database connection not established. Uploads will fail.</p>
            <button onClick={() => setActiveTab('database')} className="bg-red-600 text-white px-4 py-2 rounded-xl text-xs font-bold">Fix Connection Now</button>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-8 animate-fade-up">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Media Section */}
              <div className="bg-zinc-900 rounded-[2.5rem] border border-white/5 p-8 md:p-12 space-y-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-red-600/10 flex items-center justify-center border border-red-600/20">
                     <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                  </div>
                  <h3 className="text-xl font-oswald font-bold text-white uppercase tracking-widest">Cinema Controls</h3>
                </div>
                
                <div className="space-y-8">
                  <div className="group">
                    <label className="block text-[10px] font-black uppercase text-zinc-500 mb-3 tracking-[0.2em] group-hover:text-red-500 transition-colors">Hero Master Video (MP4)</label>
                    <div className="relative">
                      <input 
                        type="file" 
                        accept="video/*,audio/*"
                        onChange={(e) => handleFileUpload(e, 'heroVideoUrl')}
                        className="w-full bg-black border-2 border-zinc-800 p-4 rounded-2xl text-xs file:mr-4 file:py-2 file:px-6 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-red-600 file:text-white hover:file:bg-red-700 cursor-pointer"
                      />
                      {isUploading === 'heroVideoUrl' && <div className="absolute inset-0 bg-black/80 rounded-2xl flex items-center justify-center text-red-600 font-bold text-xs tracking-widest animate-pulse">UPLOADING...</div>}
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-[10px] font-black uppercase text-zinc-500 mb-3 tracking-[0.2em] group-hover:text-red-500 transition-colors">Fight Demo Video (MP4)</label>
                    <div className="relative">
                      <input 
                        type="file" 
                        accept="video/*"
                        onChange={(e) => handleFileUpload(e, 'fightVideoUrl')}
                        className="w-full bg-black border-2 border-zinc-800 p-4 rounded-2xl text-xs file:mr-4 file:py-2 file:px-6 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-red-600 file:text-white hover:file:bg-red-700 cursor-pointer"
                      />
                      {isUploading === 'fightVideoUrl' && <div className="absolute inset-0 bg-black/80 rounded-2xl flex items-center justify-center text-red-600 font-bold text-xs tracking-widest animate-pulse">UPLOADING...</div>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Graphics Section */}
              <div className="bg-zinc-900 rounded-[2.5rem] border border-white/5 p-8 md:p-12 space-y-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-red-600/10 flex items-center justify-center border border-red-600/20">
                     <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  </div>
                  <h3 className="text-xl font-oswald font-bold text-white uppercase tracking-widest">Graphics Engine</h3>
                </div>
                
                <div className="space-y-8">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-zinc-500 mb-3 tracking-[0.2em]">Primary Logo</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'logoUrl')}
                      className="w-full bg-black border-2 border-zinc-800 p-4 rounded-2xl text-xs file:mr-4 file:py-2 file:px-6 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-red-600 file:text-white cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-zinc-500 mb-3 tracking-[0.2em]">Gloves Product Shot</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'glovesImageUrl')}
                      className="w-full bg-black border-2 border-zinc-800 p-4 rounded-2xl text-xs file:mr-4 file:py-2 file:px-6 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-red-600 file:text-white cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Global Sync Action */}
            <div className="bg-red-600/90 p-10 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-red-600/20 transform transition-all hover:scale-[1.01]">
              <div className="text-center md:text-left">
                <h4 className="text-2xl font-oswald font-bold text-white uppercase leading-none mb-2">Push Changes Globally</h4>
                <p className="text-red-100 text-[10px] font-bold uppercase tracking-[0.2em]">Current Status: {saveStatus || 'Ready for Sync'}</p>
              </div>
              <button 
                onClick={handleSave}
                disabled={!!isUploading || !supabase}
                className="bg-white text-red-600 px-16 py-6 rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] hover:bg-black hover:text-white transition-all transform active:scale-95 disabled:opacity-50"
              >
                {isUploading ? 'MEDIA PROCESSING...' : 'COMMIT MASTER SYNC'}
              </button>
            </div>
          </div>
        ) : activeTab === 'investors' ? (
          <div className="bg-zinc-900 rounded-[2.5rem] border border-white/5 p-8 md:p-12 animate-fade-up">
            <h3 className="text-3xl font-oswald font-bold text-red-600 uppercase mb-10 tracking-tighter">Verified Leads</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                    <th className="pb-6 px-4 text-left">Timestamp</th>
                    <th className="pb-6 px-4 text-left">Identity</th>
                    <th className="pb-6 px-4 text-left">Proposal Brief</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {investors.length === 0 ? (
                    <tr><td colSpan={3} className="py-20 text-center text-zinc-600 font-black uppercase tracking-widest">Zero leads captured in secure vault</td></tr>
                  ) : (
                    investors.map((lead) => (
                      <tr key={lead.id} className="group hover:bg-white/5 transition-all">
                        <td className="py-8 px-4 text-xs font-mono text-zinc-500">{new Date(lead.created_at!).toLocaleString()}</td>
                        <td className="py-8 px-4">
                          <p className="font-black text-white group-hover:text-red-500 transition-colors uppercase">{lead.name}</p>
                          <p className="text-zinc-500 text-[10px] font-bold mt-1">{lead.email} | PH: {lead.phone}</p>
                        </td>
                        <td className="py-8 px-4 text-zinc-400 text-sm italic max-w-sm line-clamp-2">{lead.message}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Database Settings Tab */
          <div className="bg-zinc-900 rounded-[2.5rem] border border-white/5 p-8 md:p-16 animate-fade-up max-w-3xl mx-auto text-center">
            <div className="w-20 h-20 bg-red-600/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-red-600/20">
               <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path></svg>
            </div>
            <h3 className="text-4xl font-oswald font-bold text-white uppercase tracking-tighter mb-4">Database Connection</h3>
            <p className="text-zinc-500 mb-12 text-sm leading-relaxed max-w-md mx-auto">
              To make your changes visible to everyone globally, enter your Supabase connection details below. These are stored locally in your browser for security.
            </p>
            
            <div className="space-y-6 text-left">
              <div>
                <label className="block text-[10px] font-black uppercase text-red-600 mb-2 tracking-widest ml-1">Supabase URL</label>
                <input 
                  type="text" 
                  value={dbUrl}
                  onChange={(e) => setDbUrl(e.target.value)}
                  className="w-full bg-black border-2 border-zinc-800 p-5 rounded-2xl focus:border-red-600 outline-none text-white font-mono text-xs" 
                  placeholder="https://your-project.supabase.co"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-red-600 mb-2 tracking-widest ml-1">Supabase Anon Key</label>
                <input 
                  type="password" 
                  value={dbKey}
                  onChange={(e) => setDbKey(e.target.value)}
                  className="w-full bg-black border-2 border-zinc-800 p-5 rounded-2xl focus:border-red-600 outline-none text-white font-mono text-xs" 
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                />
              </div>
              <button 
                onClick={saveDbSettings}
                className="w-full bg-white text-black p-6 rounded-[2rem] font-black uppercase text-xs tracking-[0.4em] hover:bg-red-600 hover:text-white transition-all transform active:scale-95 shadow-2xl"
              >
                Connect Database Engine
              </button>
            </div>
            
            <p className="mt-12 text-zinc-600 text-[10px] font-bold uppercase tracking-[0.2em]">
              * Don't forget to create a public bucket named "media" in Supabase Storage.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
