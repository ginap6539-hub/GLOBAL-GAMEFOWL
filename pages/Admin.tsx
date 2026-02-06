
import React, { useState, useEffect } from 'react';
import { updateSiteContent, fetchInvestorLeads, fetchSiteContent, uploadFile } from '../services/supabase';
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
  const [activeTab, setActiveTab] = useState<'content' | 'investors'>('content');

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
      setSaveStatus('Database synced successfully!');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      alert('Error updating database: ' + (err as any).message);
    }
  };

  const handleBackToSite = () => {
    window.location.hash = '#/';
    window.location.reload();
  };

  if (!content) return <div className="p-8 text-center text-red-600 font-bold uppercase animate-pulse">Initializing Admin Engine...</div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8 font-inter">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-oswald font-bold tracking-tight">GGBS <span className="text-red-600">COMMAND CENTER</span></h1>
            <p className="text-zinc-500 uppercase text-xs tracking-[0.3em] font-bold mt-1">Management Console</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => setActiveTab('content')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'content' ? 'bg-red-600 shadow-lg shadow-red-600/20' : 'bg-zinc-900 border border-zinc-800'}`}
            >
              SITE CONTENT
            </button>
            <button 
              onClick={() => setActiveTab('investors')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'investors' ? 'bg-red-600 shadow-lg shadow-red-600/20' : 'bg-zinc-900 border border-zinc-800'}`}
            >
              LEADS ({investors.length})
            </button>
            <button 
              onClick={handleBackToSite}
              className="px-6 py-2 bg-white text-black rounded-xl text-sm font-bold hover:bg-zinc-200 transition-all"
            >
              LIVE SITE
            </button>
            <button 
              onClick={onLogout}
              className="px-6 py-2 bg-zinc-800 rounded-xl text-sm font-bold hover:bg-zinc-700 transition-all"
            >
              LOGOUT
            </button>
          </div>
        </div>

        {activeTab === 'content' ? (
          <div className="space-y-8 animate-fade-up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Media Section */}
              <div className="bg-zinc-900 rounded-3xl border border-white/5 p-8 space-y-6">
                <h3 className="text-lg font-oswald font-bold text-red-500 uppercase tracking-widest mb-4">Video Controls (MP4/MP3)</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-2 tracking-widest">Main Hero Video (Auto-play w/ Sound)</label>
                    <div className="flex items-center gap-4">
                      <input 
                        type="file" 
                        accept="video/mp4,video/x-m4v,video/*,audio/*"
                        onChange={(e) => handleFileUpload(e, 'heroVideoUrl')}
                        className="flex-1 bg-black border border-zinc-800 p-3 rounded-xl text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-red-600 file:text-white hover:file:bg-red-700 cursor-pointer"
                      />
                    </div>
                    {isUploading === 'heroVideoUrl' && <p className="text-xs text-red-500 mt-2 animate-pulse font-bold">UPLOADING HERO MEDIA...</p>}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-2 tracking-widest">Fight Demo Video (Auto-play w/ Sound)</label>
                    <div className="flex items-center gap-4">
                      <input 
                        type="file" 
                        accept="video/mp4,video/x-m4v,video/*"
                        onChange={(e) => handleFileUpload(e, 'fightVideoUrl')}
                        className="flex-1 bg-black border border-zinc-800 p-3 rounded-xl text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-red-600 file:text-white hover:file:bg-red-700 cursor-pointer"
                      />
                    </div>
                    {isUploading === 'fightVideoUrl' && <p className="text-xs text-red-500 mt-2 animate-pulse font-bold">UPLOADING DEMO MEDIA...</p>}
                  </div>
                </div>
              </div>

              {/* Branding Section */}
              <div className="bg-zinc-900 rounded-3xl border border-white/5 p-8 space-y-6">
                <h3 className="text-lg font-oswald font-bold text-red-500 uppercase tracking-widest mb-4">Graphics & Branding</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-2 tracking-widest">Global Logo (Upload Image)</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'logoUrl')}
                      className="w-full bg-black border border-zinc-800 p-3 rounded-xl text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-red-600 file:text-white cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-2 tracking-widest">Digital Gloves Image</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'glovesImageUrl')}
                      className="w-full bg-black border border-zinc-800 p-3 rounded-xl text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-red-600 file:text-white cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-2 tracking-widest">Evolution Section Image</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'evolutionImageUrl')}
                      className="w-full bg-black border border-zinc-800 p-3 rounded-xl text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-red-600 file:text-white cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 p-8 rounded-3xl border border-red-600/30 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-red-600/20 flex items-center justify-center">
                  <span className="text-red-500 text-xl font-bold">!</span>
                </div>
                <div>
                   <p className="text-white font-bold text-sm">Synchronize with Global Server</p>
                   <p className="text-zinc-500 text-xs uppercase font-bold tracking-widest">Status: {saveStatus || 'Awaiting Changes'}</p>
                </div>
              </div>
              <button 
                onClick={handleSave}
                disabled={!!isUploading}
                className="bg-red-600 hover:bg-red-700 disabled:bg-zinc-800 text-white px-12 py-5 rounded-2xl font-bold transition-all transform hover:scale-105 shadow-2xl shadow-red-600/40 uppercase tracking-widest"
              >
                {isUploading ? 'MEDIA UPLOADING...' : 'COMMIT DATABASE SYNC'}
              </button>
            </div>

            {/* Hidden/Secret Asset Preview */}
            <div className="p-8 bg-black/50 rounded-3xl border border-dashed border-zinc-800">
               <h4 className="text-[10px] uppercase font-bold text-zinc-600 mb-6 tracking-[0.4em]">Current Master Assets</h4>
               <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                 {Object.entries(content).map(([key, url]) => (
                   <div key={key} className="group relative aspect-square bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800 hover:border-red-600/50 transition-all">
                     {url.includes('.mp4') || url.includes('.m4v') ? (
                       <video src={url} className="w-full h-full object-cover" muted />
                     ) : (
                       <img src={url} className="w-full h-full object-cover" alt={key} />
                     )}
                     <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                        <span className="text-[8px] font-bold text-white uppercase text-center break-all">{key}</span>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        ) : (
          <div className="bg-zinc-900 rounded-3xl border border-white/5 p-10 animate-fade-up">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-oswald font-bold text-red-600 uppercase tracking-widest">Master Leads</h3>
              <div className="px-4 py-1 bg-red-600/20 text-red-500 rounded-full text-xs font-bold uppercase">{investors.length} TOTAL</div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-bold">
                    <th className="py-6 px-4">Timestamp</th>
                    <th className="py-6 px-4">Investor Identity</th>
                    <th className="py-6 px-4">Contact Logic</th>
                    <th className="py-6 px-4">Proposal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {investors.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-20 text-center text-zinc-600 font-bold uppercase tracking-widest">Access Restricted: No Leads Found</td>
                    </tr>
                  ) : (
                    investors.map((lead) => (
                      <tr key={lead.id} className="text-sm hover:bg-white/5 transition-colors group">
                        <td className="py-6 px-4 text-zinc-500 font-mono text-xs">{new Date(lead.created_at!).toLocaleString()}</td>
                        <td className="py-6 px-4 font-black text-white group-hover:text-red-500 transition-colors uppercase">{lead.name}</td>
                        <td className="py-6 px-4">
                          <p className="font-bold">{lead.email}</p>
                          <p className="text-zinc-500 text-xs font-bold mt-1 uppercase">PH: {lead.phone}</p>
                        </td>
                        <td className="py-6 px-4 text-zinc-400 italic font-medium leading-relaxed max-w-xs">{lead.message}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
