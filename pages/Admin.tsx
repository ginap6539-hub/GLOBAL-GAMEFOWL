
import React, { useState, useEffect } from 'react';
import { updateSiteContent, fetchInvestorLeads, fetchSiteContent } from '../services/supabase';
import { SiteContent, InvestorLead } from '../types';

interface AdminProps {
  onLogout: () => void;
  onUpdate: () => void;
}

const Admin: React.FC<AdminProps> = ({ onLogout, onUpdate }) => {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [investors, setInvestors] = useState<InvestorLead[]>([]);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!content) return;
    const { name, value } = e.target;
    setContent(prev => prev ? ({ ...prev, [name]: value }) : null);
  };

  const handleSave = async () => {
    if (!content) return;
    try {
      await updateSiteContent(content);
      onUpdate();
      setSaveStatus('Database updated successfully!');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      alert('Error updating database: ' + (err as any).message);
    }
  };

  const handleBackToSite = () => {
    window.location.hash = '#/';
    window.location.reload();
  };

  if (!content) return <div className="p-8 text-center text-red-600">Loading Admin Config...</div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-oswald font-bold">ADMIN <span className="text-red-600">CONTROL PANEL</span></h1>
            <p className="text-zinc-500">Manage database assets & investment requests</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setActiveTab('content')}
              className={`px-6 py-2 rounded-lg transition-colors ${activeTab === 'content' ? 'bg-red-600' : 'bg-zinc-800'}`}
            >
              Assets
            </button>
            <button 
              onClick={() => setActiveTab('investors')}
              className={`px-6 py-2 rounded-lg transition-colors ${activeTab === 'investors' ? 'bg-red-600' : 'bg-zinc-800'}`}
            >
              Investor Leads ({investors.length})
            </button>
            <button 
              onClick={handleBackToSite}
              className="px-6 py-2 border border-zinc-800 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              View Site
            </button>
            <button 
              onClick={onLogout}
              className="px-6 py-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {activeTab === 'content' ? (
          <div className="bg-zinc-900 rounded-2xl border border-white/5 p-8 space-y-8 animate-fade-up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase text-zinc-500 border-b border-zinc-800 pb-2">Branding & Videos</h3>
                <div>
                  <label className="block text-xs mb-1 text-zinc-400">Custom Logo URL (Replaces GGBS Text)</label>
                  <input 
                    type="text" 
                    name="logoUrl" 
                    value={content.logoUrl}
                    onChange={handleChange}
                    className="w-full bg-black border border-zinc-800 p-3 rounded-lg focus:border-red-600 outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1 text-zinc-400">Hero Background Video URL</label>
                  <input 
                    type="text" 
                    name="heroVideoUrl" 
                    value={content.heroVideoUrl}
                    onChange={handleChange}
                    className="w-full bg-black border border-zinc-800 p-3 rounded-lg focus:border-red-600 outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1 text-zinc-400">Fight Demonstration Video URL</label>
                  <input 
                    type="text" 
                    name="fightVideoUrl" 
                    value={content.fightVideoUrl}
                    onChange={handleChange}
                    className="w-full bg-black border border-zinc-800 p-3 rounded-lg focus:border-red-600 outline-none" 
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase text-zinc-500 border-b border-zinc-800 pb-2">Gallery Images</h3>
                <div>
                  <label className="block text-xs mb-1 text-zinc-400">Digital Gloves Image URL</label>
                  <input 
                    type="text" 
                    name="glovesImageUrl" 
                    value={content.glovesImageUrl}
                    onChange={handleChange}
                    className="w-full bg-black border border-zinc-800 p-3 rounded-lg focus:border-red-600 outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1 text-zinc-400">Evolution Section Image URL</label>
                  <input 
                    type="text" 
                    name="evolutionImageUrl" 
                    value={content.evolutionImageUrl}
                    onChange={handleChange}
                    className="w-full bg-black border border-zinc-800 p-3 rounded-lg focus:border-red-600 outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1 text-zinc-400">Revenue Background URL</label>
                  <input 
                    type="text" 
                    name="revenueImageUrl" 
                    value={content.revenueImageUrl}
                    onChange={handleChange}
                    className="w-full bg-black border border-zinc-800 p-3 rounded-lg focus:border-red-600 outline-none" 
                  />
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-zinc-800 flex items-center justify-between">
              {saveStatus ? (
                <span className="text-green-500 font-bold">{saveStatus}</span>
              ) : (
                <span className="text-zinc-600 text-sm">Supabase Real-time Database</span>
              )}
              <button 
                onClick={handleSave}
                className="bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-xl font-bold transition-all transform hover:scale-105"
              >
                SYNC TO DATABASE
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-zinc-900 rounded-2xl border border-white/5 p-8 animate-fade-up">
            <h3 className="text-xl font-oswald font-bold mb-6 text-red-600">INVESTOR INQUIRIES</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-500 text-xs uppercase tracking-widest">
                    <th className="py-4 px-2">Date</th>
                    <th className="py-4 px-2">Name</th>
                    <th className="py-4 px-2">Contact</th>
                    <th className="py-4 px-2">Message</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {investors.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-zinc-600">No investment leads yet.</td>
                    </tr>
                  ) : (
                    investors.map((lead) => (
                      <tr key={lead.id} className="text-sm hover:bg-white/5 transition-colors">
                        <td className="py-4 px-2 text-zinc-500">{new Date(lead.created_at!).toLocaleDateString()}</td>
                        <td className="py-4 px-2 font-bold">{lead.name}</td>
                        <td className="py-4 px-2">
                          <p>{lead.email}</p>
                          <p className="text-zinc-500 text-xs">{lead.phone}</p>
                        </td>
                        <td className="py-4 px-2 text-zinc-400">{lead.message}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="mt-12 p-8 bg-zinc-900/50 rounded-2xl border border-dashed border-zinc-800">
            <h3 className="text-sm font-bold mb-4 text-zinc-400">PREVIEW CURRENT ASSETS</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
               {content.logoUrl && (
                  <div className="aspect-square bg-black rounded-lg overflow-hidden border border-zinc-800 p-2 flex items-center justify-center">
                    <img src={content.logoUrl} className="max-h-full max-w-full object-contain" alt="Logo Preview" />
                  </div>
               )}
               <div className="aspect-square bg-black rounded-lg overflow-hidden border border-zinc-800">
                  <img src={content.glovesImageUrl} className="w-full h-full object-cover" alt="Preview" />
               </div>
               <div className="aspect-square bg-black rounded-lg overflow-hidden border border-zinc-800">
                  <img src={content.evolutionImageUrl} className="w-full h-full object-cover" alt="Preview" />
               </div>
               <div className="aspect-square bg-black rounded-lg overflow-hidden border border-zinc-800">
                  <img src={content.revenueImageUrl} className="w-full h-full object-cover" alt="Preview" />
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
