
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
  
  const [dbUrl, setDbUrl] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('ggbs_supabase_url') || '' : ''));
  const [dbKey, setDbKey] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('ggbs_supabase_key') || '' : ''));

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
      if (typeof window !== 'undefined') {
        localStorage.setItem('ggbs_local_content', JSON.stringify(newContent));
      }
      setSaveStatus(`${fieldName} ready.`);
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err: any) {
      alert(`Upload Error: ${err.message || 'Storage bucket not accessible. Ensure "media" bucket exists in Supabase Storage.'}`);
    } finally {
      setIsUploading(null);
    }
  };

  const handleSave = async () => {
    if (!content) return;
    try {
      await updateSiteContent(content);
      onUpdate();
      setSaveStatus('DATABASE SYNC SUCCESS!');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err: any) {
      const msg = err.message || '';
      if (msg.includes('relation') || msg.includes('not found')) {
        alert("SQL Error: The 'site_settings' table does not exist in your Supabase database. Go to the Config tab for the Setup SQL.");
      } else {
        alert(`Sync Failed: ${msg}. Check your keys in the Config tab.`);
      }
    }
  };

  const saveDbSettings = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ggbs_supabase_url', dbUrl.trim());
      localStorage.setItem('ggbs_supabase_key', dbKey.trim());
    }
    const client = getSupabaseClient();
    setIsConnected(!!client);
    setSaveStatus('Engine Updated.');
    setTimeout(() => setSaveStatus(null), 3000);
    if (client) {
       // Force a reload of data with new keys
       fetchSiteContent().then(setContent);
       fetchInvestorLeads().then(setInvestors);
    }
  };

  if (!content) return (
    <div className="h-screen bg-black flex flex-col items-center justify-center">
      <div className="w-10 h-10 border-t-2 border-red-600 rounded-full animate-spin mb-4"></div>
      <div className="text-red-600 font-oswald font-bold uppercase tracking-widest animate-pulse">Establishing Command Link...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-12 font-inter">
      <div className="max-w-7xl mx-auto">
        
        {/* Superior Header Control */}
        <div className="w-full bg-zinc-900/60 p-8 md:p-14 rounded-[3rem] border border-white/5 shadow-2xl mb-12 flex flex-col lg:flex-row items-center justify-between gap-10 backdrop-blur-xl">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-5 mb-3">
              <h1 className="text-5xl font-oswald font-bold uppercase tracking-tighter">GGBS <span className="text-red-600">PRO</span></h1>
              <div className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-2 ${isConnected ? 'bg-green-600/10 text-green-500 border border-green-500/20' : 'bg-red-600/10 text-red-500 border border-red-500/20'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                {isConnected ? 'DATABASE LINKED' : 'OFFLINE MODE'}
              </div>
            </div>
            <p className="text-zinc-600 uppercase text-[9px] tracking-[0.8em] font-black">Global Management Interface</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            <button onClick={() => setActiveTab('content')} className={`px-8 py-4 rounded-2xl text-[9px] font-black tracking-widest transition-all uppercase ${activeTab === 'content' ? 'bg-red-600 text-white shadow-xl' : 'bg-zinc-800 text-zinc-500 hover:text-white'}`}>Media Management</button>
            <button onClick={() => setActiveTab('investors')} className={`px-8 py-4 rounded-2xl text-[9px] font-black tracking-widest transition-all uppercase ${activeTab === 'investors' ? 'bg-red-600 text-white shadow-xl' : 'bg-zinc-800 text-zinc-500 hover:text-white'}`}>Investor Leads</button>
            <button onClick={() => setActiveTab('database')} className={`px-8 py-4 rounded-2xl text-[9px] font-black tracking-widest transition-all uppercase ${activeTab === 'database' ? 'bg-red-600 text-white shadow-xl' : 'bg-zinc-800 text-zinc-500 hover:text-white'}`}>Engine Config</button>
            <button onClick={() => { window.location.hash = '#/'; window.location.reload(); }} className="px-8 py-4 bg-white text-black rounded-2xl text-[9px] font-black tracking-widest hover:bg-red-600 hover:text-white transition-all uppercase">Back to Site</button>
            <button onClick={onLogout} className="px-8 py-4 bg-zinc-900 border border-zinc-800 text-red-600 rounded-2xl text-[9px] font-black tracking-widest hover:bg-red-600 hover:text-white transition-all uppercase">Secure Logout</button>
          </div>
        </div>

        {activeTab === 'content' ? (
          <div className="space-y-12 animate-fade-up">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="bg-zinc-900/40 rounded-[3rem] border border-white/5 p-10 space-y-10 shadow-2xl">
                <h3 className="text-xl font-oswald font-bold text-white uppercase tracking-[0.2em] border-b border-white/5 pb-4">Cinematic Content</h3>
                <div className="space-y-8">
                  <div>
                    <label className="block text-[9px] font-black uppercase text-zinc-600 mb-3 tracking-[0.3em]">Hero Background Video (MP4)</label>
                    <input type="file" accept="video/*" onChange={(e) => handleFileUpload(e, 'heroVideoUrl')} className="w-full bg-black/40 border-2 border-zinc-800 p-5 rounded-2xl text-xs file:bg-red-600 file:text-white file:border-0 file:rounded-xl file:px-6 file:py-2 file:text-[10px] file:font-black cursor-pointer"/>
                    {isUploading === 'heroVideoUrl' && <p className="text-red-500 text-[8px] font-black mt-2 animate-pulse uppercase">Syncing to Cloud...</p>}
                  </div>
                  <div>
                    <label className="block text-[9px] font-black uppercase text-zinc-600 mb-3 tracking-[0.3em]">Fight Showcase Video (MP4)</label>
                    <input type="file" accept="video/*" onChange={(e) => handleFileUpload(e, 'fightVideoUrl')} className="w-full bg-black/40 border-2 border-zinc-800 p-5 rounded-2xl text-xs file:bg-red-600 file:text-white file:border-0 file:rounded-xl file:px-6 file:py-2 file:text-[10px] file:font-black cursor-pointer"/>
                    {isUploading === 'fightVideoUrl' && <p className="text-red-500 text-[8px] font-black mt-2 animate-pulse uppercase">Syncing to Cloud...</p>}
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900/40 rounded-[3rem] border border-white/5 p-10 space-y-10 shadow-2xl">
                <h3 className="text-xl font-oswald font-bold text-white uppercase tracking-[0.2em] border-b border-white/5 pb-4">Visual Identity</h3>
                <div className="space-y-8">
                  <div>
                    <label className="block text-[9px] font-black uppercase text-zinc-600 mb-3 tracking-[0.3em]">Corporate Logo (Transparent)</label>
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'logoUrl')} className="w-full bg-black/40 border-2 border-zinc-800 p-5 rounded-2xl text-xs file:bg-red-600 file:text-white file:border-0 file:rounded-xl file:px-6 file:py-2 file:text-[10px] file:font-black cursor-pointer"/>
                  </div>
                  <div>
                    <label className="block text-[9px] font-black uppercase text-zinc-600 mb-3 tracking-[0.3em]">Digital Gloves Prototype Shot</label>
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'glovesImageUrl')} className="w-full bg-black/40 border-2 border-zinc-800 p-5 rounded-2xl text-xs file:bg-red-600 file:text-white file:border-0 file:rounded-xl file:px-6 file:py-2 file:text-[10px] file:font-black cursor-pointer"/>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-red-600 p-12 rounded-[4rem] flex flex-col md:flex-row items-center justify-between gap-10 shadow-3xl shadow-red-600/20">
              <div className="text-center md:text-left">
                <h4 className="text-4xl font-oswald font-bold text-white uppercase leading-none mb-3 tracking-tighter">Global Data Deployment</h4>
                <p className="text-red-100 text-[9px] font-black uppercase tracking-[0.5em]">{saveStatus || 'Ready for Database Write'}</p>
              </div>
              <button 
                onClick={handleSave}
                disabled={!!isUploading}
                className="bg-white text-red-600 px-20 py-8 rounded-[2rem] font-black uppercase text-xs tracking-[0.5em] hover:bg-black hover:text-white transition-all disabled:opacity-50 shadow-2xl active:scale-95"
              >
                {isUploading ? 'MEDIA PROCESSING...' : 'EXECUTE GLOBAL SYNC'}
              </button>
            </div>
          </div>
        ) : activeTab === 'investors' ? (
          <div className="w-full bg-zinc-900/40 rounded-[3rem] border border-white/5 p-12 animate-fade-up shadow-2xl">
             <div className="flex justify-between items-center mb-12 border-b border-zinc-800 pb-10">
               <h3 className="text-3xl font-oswald font-bold text-red-600 uppercase tracking-tighter">Investment Proposals</h3>
               <span className="bg-zinc-800 text-zinc-400 px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest">{investors.length} INCOMING LEADS</span>
             </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.4em]">
                  <tr>
                    <th className="pb-8 px-6 text-left">Entity</th>
                    <th className="pb-8 px-6 text-left">Contact Info</th>
                    <th className="pb-8 px-6 text-left">Investment Proposal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/30">
                  {investors.length === 0 ? (
                    <tr><td colSpan={3} className="py-24 text-center text-zinc-700 font-black uppercase text-xs tracking-[0.5em]">No Data in Vault</td></tr>
                  ) : (
                    investors.map((lead) => (
                      <tr key={lead.id} className="group hover:bg-white/5 transition-all">
                        <td className="py-10 px-6 font-black text-white text-xl uppercase tracking-tight">{lead.name}</td>
                        <td className="py-10 px-6">
                           <p className="font-bold text-zinc-300 mb-1">{lead.email}</p>
                           <p className="text-zinc-600 text-[9px] font-black tracking-widest">{lead.phone}</p>
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
          /* Secure Config Tab with SQL Instructions */
          <div className="space-y-12 animate-fade-up">
            <div className="w-full bg-zinc-900/60 rounded-[4rem] border border-white/5 p-12 md:p-20 max-w-4xl mx-auto text-center shadow-3xl">
              <h3 className="text-5xl font-oswald font-bold text-white uppercase tracking-tighter mb-6">Database Engine</h3>
              <p className="text-zinc-500 mb-16 text-lg max-w-2xl mx-auto font-light leading-relaxed">
                Enter your Supabase credentials below to activate the live synchronization engine.
              </p>
              
              <div className="space-y-10 text-left bg-black/40 p-10 rounded-[3rem] border border-white/5 shadow-inner">
                <div className="group">
                  <label className="block text-[9px] font-black uppercase text-red-600 mb-4 tracking-[0.4em] ml-2">Supabase Project URL</label>
                  <input 
                    type="text" 
                    value={dbUrl}
                    onChange={(e) => setDbUrl(e.target.value)}
                    className="w-full bg-black/60 border-2 border-zinc-800 group-focus-within:border-red-600 p-7 rounded-[2rem] outline-none text-white font-mono text-sm transition-all" 
                    placeholder="https://abc.supabase.co"
                  />
                </div>
                <div className="group">
                  <label className="block text-[9px] font-black uppercase text-red-600 mb-4 tracking-[0.4em] ml-2">Anon API Public Key</label>
                  <input 
                    type="password" 
                    value={dbKey}
                    onChange={(e) => setDbKey(e.target.value)}
                    className="w-full bg-black/60 border-2 border-zinc-800 group-focus-within:border-red-600 p-7 rounded-[2rem] outline-none text-white font-mono text-sm transition-all" 
                    placeholder="eyJhbGciOiJIUzI1Ni..."
                  />
                </div>
                <button 
                  onClick={saveDbSettings}
                  className="w-full bg-white text-black p-8 rounded-[3rem] font-black uppercase text-xs tracking-[0.7em] hover:bg-red-600 hover:text-white transition-all transform active:scale-95 shadow-3xl mt-4"
                >
                  Save and Connect
                </button>
              </div>
            </div>

            {/* SQL Setup Guide */}
            <div className="w-full bg-zinc-900/40 rounded-[4rem] border border-red-600/20 p-12 md:p-20 max-w-5xl mx-auto shadow-3xl">
               <div className="flex flex-col md:flex-row gap-12 items-start">
                  <div className="flex-1">
                    <h3 className="text-3xl font-oswald font-bold text-red-600 uppercase tracking-tighter mb-6">System Initialization (Required)</h3>
                    <p className="text-zinc-400 mb-8 leading-relaxed">
                      If you are seeing "Sync Failed", it means your database doesn't have the correct tables yet. 
                      Copy the code on the right, go to your <b>Supabase SQL Editor</b>, paste it, and click <b>RUN</b>.
                    </p>
                    <ol className="space-y-4 text-xs font-black uppercase tracking-widest text-zinc-500">
                      <li>1. Open Supabase Dashboard</li>
                      <li>2. Click "SQL Editor" on the left</li>
                      <li>3. Click "+ New Query"</li>
                      <li>4. Paste the code & click Run</li>
                    </ol>
                  </div>
                  <div className="flex-1 w-full">
                    <div className="bg-black/80 p-8 rounded-[2rem] border border-zinc-800 font-mono text-[10px] text-green-500 overflow-x-auto">
                      <pre>{`-- INITIALIZATION SCRIPT
CREATE TABLE IF NOT EXISTS site_settings (
  id INT PRIMARY KEY,
  logo_url TEXT,
  hero_video_url TEXT,
  fight_video_url TEXT,
  gloves_image_url TEXT,
  evolution_image_url TEXT,
  revenue_image_url TEXT
);

INSERT INTO site_settings (id) VALUES (1) 
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS investors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT, email TEXT, phone TEXT, message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`}</pre>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
