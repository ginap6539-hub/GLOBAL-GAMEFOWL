
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
      // Cache locally so we don't lose the selection
      localStorage.setItem('ggbs_local_content', JSON.stringify(newContent));
      setSaveStatus(`${fieldName} is ready.`);
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      alert(`Upload Error: ${err instanceof Error ? err.message : 'Storage Connection Failed'}`);
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
      alert(err instanceof Error ? err.message : 'Database Sync Error');
    }
  };

  const saveDbSettings = () => {
    localStorage.setItem('ggbs_supabase_url', dbUrl.trim());
    localStorage.setItem('ggbs_supabase_key', dbKey.trim());
    setIsConnected(!!getSupabaseClient());
    setSaveStatus('Engine Re-Linked.');
    setTimeout(() => setSaveStatus(null), 3000);
    setActiveTab('content');
  };

  const handleBackToSite = () => {
    window.location.hash = '#/';
    window.location.reload();
  };

  if (!content) return (
    <div className="h-screen bg-black flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-t-4 border-red-600 rounded-full animate-spin mb-6"></div>
      <div className="text-red-600 font-oswald text-2xl font-bold uppercase tracking-[0.4em] animate-pulse">Establishing Command...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-12 font-inter">
      <div className="max-w-7xl mx-auto flex flex-col">
        
        {/* Superior Header Control */}
        <div className="w-full bg-zinc-900/60 p-8 md:p-14 rounded-[4rem] border border-white/5 shadow-3xl mb-12 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-5 mb-4">
              <h1 className="text-5xl md:text-7xl font-oswald font-bold tracking-tighter uppercase leading-none">GGBS <span className="text-red-600">PRO</span></h1>
              <div className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-3 ${isConnected ? 'bg-green-600/10 text-green-500 border border-green-500/20' : 'bg-red-600/10 text-red-500 border border-red-500/20'}`}>
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'}`}></div>
                {isConnected ? 'ONLINE: DB SYNC READY' : 'OFFLINE: LOCAL ONLY'}
              </div>
            </div>
            <p className="text-zinc-600 uppercase text-[10px] tracking-[1em] font-black ml-1">Elite Management Interface</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => setActiveTab('content')} className={`px-10 py-5 rounded-[2rem] text-[10px] font-black tracking-widest transition-all uppercase ${activeTab === 'content' ? 'bg-red-600 text-white shadow-2xl shadow-red-600/30 scale-105' : 'bg-zinc-800 text-zinc-500 hover:text-white'}`}>Master Assets</button>
            <button onClick={() => setActiveTab('investors')} className={`px-10 py-5 rounded-[2rem] text-[10px] font-black tracking-widest transition-all uppercase ${activeTab === 'investors' ? 'bg-red-600 text-white shadow-2xl shadow-red-600/30 scale-105' : 'bg-zinc-800 text-zinc-500 hover:text-white'}`}>Investors ({investors.length})</button>
            <button onClick={() => setActiveTab('database')} className={`px-10 py-5 rounded-[2rem] text-[10px] font-black tracking-widest transition-all uppercase ${activeTab === 'database' ? 'bg-red-600 text-white shadow-2xl shadow-red-600/30 scale-105' : 'bg-zinc-800 text-zinc-500 hover:text-white'}`}>Connection</button>
            <div className="w-px h-12 bg-zinc-800 mx-4 hidden md:block self-center"></div>
            <button onClick={handleBackToSite} className="px-10 py-5 bg-white text-black rounded-[2rem] text-[10px] font-black tracking-widest hover:bg-red-600 hover:text-white transition-all uppercase">Live Site</button>
            <button onClick={onLogout} className="px-10 py-5 bg-zinc-900 border border-zinc-800 text-red-600 rounded-[2rem] text-[10px] font-black tracking-widest hover:bg-red-600 hover:text-white transition-all uppercase">Logout</button>
          </div>
        </div>

        {activeTab === 'content' && (
          <div className="w-full space-y-12 animate-fade-up">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Media Studio */}
              <div className="bg-zinc-900/40 rounded-[4rem] border border-white/5 p-12 space-y-12 shadow-2xl hover:border-red-600/10 transition-colors">
                <div className="flex items-center gap-8 mb-4">
                  <div className="w-16 h-16 rounded-[2rem] bg-red-600/10 flex items-center justify-center border border-red-600/20">
                     <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                  </div>
                  <h3 className="text-3xl font-oswald font-bold text-white uppercase tracking-[0.3em]">Cinema Control</h3>
                </div>
                
                <div className="space-y-10">
                  <div className="group">
                    <label className="block text-[10px] font-black uppercase text-zinc-600 mb-5 tracking-[0.4em] group-hover:text-red-500 transition-colors">Hero Master Video (MP4)</label>
                    <div className="relative">
                      <input type="file" accept="video/*" onChange={(e) => handleFileUpload(e, 'heroVideoUrl')} className="w-full bg-black/60 border-2 border-zinc-800 p-8 rounded-3xl text-sm file:mr-6 file:py-3 file:px-10 file:rounded-2xl file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-red-600 file:text-white cursor-pointer hover:border-red-600/30 transition-all"/>
                      {isUploading === 'heroVideoUrl' && <div className="absolute inset-0 bg-black/95 rounded-3xl flex items-center justify-center text-red-600 font-black tracking-widest animate-pulse">PROCESSING VIDEO...</div>}
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-[10px] font-black uppercase text-zinc-600 mb-5 tracking-[0.4em] group-hover:text-red-500 transition-colors">Fight Demo Loop (MP4)</label>
                    <div className="relative">
                      <input type="file" accept="video/*" onChange={(e) => handleFileUpload(e, 'fightVideoUrl')} className="w-full bg-black/60 border-2 border-zinc-800 p-8 rounded-3xl text-sm file:mr-6 file:py-3 file:px-10 file:rounded-2xl file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-red-600 file:text-white cursor-pointer hover:border-red-600/30 transition-all"/>
                      {isUploading === 'fightVideoUrl' && <div className="absolute inset-0 bg-black/95 rounded-3xl flex items-center justify-center text-red-600 font-black tracking-widest animate-pulse">PROCESSING VIDEO...</div>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Identity Graphics */}
              <div className="bg-zinc-900/40 rounded-[4rem] border border-white/5 p-12 space-y-12 shadow-2xl hover:border-red-600/10 transition-colors">
                <div className="flex items-center gap-8 mb-4">
                  <div className="w-16 h-16 rounded-[2rem] bg-red-600/10 flex items-center justify-center border border-red-600/20">
                     <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  </div>
                  <h3 className="text-3xl font-oswald font-bold text-white uppercase tracking-[0.3em]">Asset Library</h3>
                </div>
                
                <div className="space-y-10">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-zinc-600 mb-5 tracking-[0.4em]">Corporate Logo Asset</label>
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'logoUrl')} className="w-full bg-black/60 border-2 border-zinc-800 p-8 rounded-3xl text-sm file:mr-6 file:py-3 file:px-10 file:rounded-2xl file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-red-600 file:text-white cursor-pointer"/>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-zinc-600 mb-5 tracking-[0.4em]">Digital Gloves Prototype</label>
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'glovesImageUrl')} className="w-full bg-black/60 border-2 border-zinc-800 p-8 rounded-3xl text-sm file:mr-6 file:py-3 file:px-10 file:rounded-2xl file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-red-600 file:text-white cursor-pointer"/>
                  </div>
                </div>
              </div>
            </div>

            {/* Global Dispatch Action */}
            <div className="bg-red-600 p-12 md:p-16 rounded-[5rem] flex flex-col md:flex-row items-center justify-between gap-12 shadow-[0_0_120px_rgba(220,38,38,0.4)] transform transition-all hover:scale-[1.005]">
              <div className="text-center md:text-left">
                <h4 className="text-4xl md:text-5xl font-oswald font-bold text-white uppercase leading-none mb-6">Commit Global Sync</h4>
                <div className="flex items-center justify-center md:justify-start gap-4">
                   <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                   <p className="text-red-100 text-[10px] font-black uppercase tracking-[0.5em]">{saveStatus || (isConnected ? 'Engine Ready for Dispatch' : 'Awaiting Engine Link')}</p>
                </div>
              </div>
              <button 
                onClick={handleSave}
                disabled={!!isUploading}
                className="bg-white text-red-600 px-24 py-10 rounded-[3.5rem] font-black uppercase text-xs tracking-[0.7em] hover:bg-black hover:text-white transition-all transform active:scale-95 disabled:opacity-50 shadow-3xl"
              >
                {isUploading ? 'OPTIMIZING...' : 'PUSH CHANGES WORLDWIDE'}
              </button>
            </div>
          </div>
        ) : activeTab === 'investors' ? (
          <div className="w-full bg-zinc-900/40 rounded-[4rem] border border-white/5 p-16 animate-fade-up shadow-3xl">
             <div className="flex flex-col md:flex-row justify-between items-center mb-16 border-b border-zinc-800 pb-12 gap-8">
               <h3 className="text-5xl font-oswald font-bold text-red-600 uppercase tracking-tighter">Secure Leads Vault</h3>
               <span className="bg-zinc-800 text-zinc-400 px-10 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.3em]">{investors.length} ACTIVE OPPORTUNITIES</span>
             </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.5em]">
                    <th className="pb-12 px-8 text-left">Capture Log</th>
                    <th className="pb-12 px-8 text-left">Investor Identity</th>
                    <th className="pb-12 px-8 text-left">Communication Channel</th>
                    <th className="pb-12 px-8 text-left">Proposal Brief</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/40">
                  {investors.length === 0 ? (
                    <tr><td colSpan={4} className="py-56 text-center text-zinc-700 font-black uppercase tracking-[1em] text-sm animate-pulse">Vault is currently empty</td></tr>
                  ) : (
                    investors.map((lead) => (
                      <tr key={lead.id} className="group hover:bg-white/5 transition-all">
                        <td className="py-14 px-8 text-xs font-mono text-zinc-500 whitespace-nowrap">{new Date(lead.created_at!).toLocaleString()}</td>
                        <td className="py-14 px-8 font-black text-white group-hover:text-red-500 transition-colors uppercase text-2xl tracking-tight">{lead.name}</td>
                        <td className="py-14 px-8">
                          <p className="font-bold text-lg text-zinc-300 mb-1">{lead.email}</p>
                          <p className="text-zinc-600 text-[10px] font-black tracking-widest uppercase">Direct: {lead.phone}</p>
                        </td>
                        <td className="py-14 px-8 text-zinc-400 text-base italic leading-relaxed max-w-md">{lead.message}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Secure Database Connection Tab */
          <div className="w-full bg-zinc-900/60 rounded-[5rem] border border-white/5 p-12 md:p-32 animate-fade-up max-w-5xl mx-auto text-center shadow-3xl">
            <div className="w-28 h-28 bg-red-600/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-12 border border-red-600/20 shadow-inner">
               <svg className="w-14 h-14 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <h3 className="text-6xl md:text-7xl font-oswald font-bold text-white uppercase tracking-tighter mb-10 leading-none">System Engine Link</h3>
            <p className="text-zinc-500 mb-20 text-xl leading-relaxed max-w-3xl mx-auto font-light">
              Connect your professional Supabase instance to enable global synchronization. This allows all uploads to be stored in your SQL database permanently.
            </p>
            
            <div className="space-y-12 text-left bg-black/30 p-10 md:p-20 rounded-[4rem] border border-white/5 shadow-inner">
              <div className="group">
                <label className="block text-[10px] font-black uppercase text-red-600 mb-5 tracking-[0.5em] ml-4">Supabase API Endpoint (URL)</label>
                <input type="text" value={dbUrl} onChange={(e) => setDbUrl(e.target.value)} className="w-full bg-black/60 border-2 border-zinc-800 group-focus-within:border-red-600 p-10 rounded-[2.5rem] outline-none text-white font-mono text-sm shadow-inner transition-all" placeholder="https://your-id.supabase.co" />
              </div>
              <div className="group">
                <label className="block text-[10px] font-black uppercase text-red-600 mb-5 tracking-[0.5em] ml-4">Supabase Master Secret (Anon Key)</label>
                <input type="password" value={dbKey} onChange={(e) => setDbKey(e.target.value)} className="w-full bg-black/60 border-2 border-zinc-800 group-focus-within:border-red-600 p-10 rounded-[2.5rem] outline-none text-white font-mono text-sm shadow-inner transition-all" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX..." />
              </div>
              <button onClick={saveDbSettings} className="w-full bg-white text-black p-10 rounded-[3.5rem] font-black uppercase text-[10px] tracking-[1em] hover:bg-red-600 hover:text-white transition-all transform active:scale-95 shadow-3xl mt-8">Connect System Engine</button>
            </div>
            
            <div className="mt-24 p-12 border border-white/5 rounded-[3rem] bg-zinc-950/40 text-left">
              <h5 className="text-red-600 font-bold uppercase text-xs tracking-widest mb-6 flex items-center gap-3">
                <div className="w-2 h-2 bg-red-600 rounded-full"></div> Setup Requirements
              </h5>
              <ol className="text-zinc-500 text-sm space-y-4 list-decimal pl-6 font-medium leading-relaxed">
                <li>Create a <b>PUBLIC</b> storage bucket named <code className="text-zinc-300 bg-white/5 px-2 py-1 rounded font-bold">media</code> in Supabase.</li>
                <li>Ensure a table named <code className="text-zinc-300 bg-white/5 px-2 py-1 rounded font-bold">site_settings</code> exists with ID column.</li>
                <li>Your keys are stored safely in your current browser session.</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
