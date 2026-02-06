
import React, { useState } from 'react';
import { getContent, saveContent } from '../services/storage';
import { SiteContent } from '../types';

interface AdminProps {
  onLogout: () => void;
  onUpdate: () => void;
}

const Admin: React.FC<AdminProps> = ({ onLogout, onUpdate }) => {
  const [content, setContent] = useState<SiteContent>(getContent());
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContent(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    saveContent(content);
    onUpdate();
    setSaveStatus('Content saved successfully!');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleBackToSite = () => {
    window.location.hash = '#/';
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-oswald font-bold">ADMIN <span className="text-red-600">CONTROL PANEL</span></h1>
            <p className="text-zinc-500">Manage all visual assets of the GGBS Platform</p>
          </div>
          <div className="flex gap-4">
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

        <div className="bg-zinc-900 rounded-2xl border border-white/5 p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase text-zinc-500">Video Assets</h3>
              <div>
                <label className="block text-xs mb-1">Hero Background Video URL</label>
                <input 
                  type="text" 
                  name="heroVideoUrl" 
                  value={content.heroVideoUrl}
                  onChange={handleChange}
                  className="w-full bg-black border border-zinc-800 p-3 rounded-lg focus:border-red-600 outline-none" 
                />
              </div>
              <div>
                <label className="block text-xs mb-1">Fight Demonstration Video URL</label>
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
              <h3 className="text-sm font-bold uppercase text-zinc-500">Image Assets</h3>
              <div>
                <label className="block text-xs mb-1">Digital Gloves Image URL</label>
                <input 
                  type="text" 
                  name="glovesImageUrl" 
                  value={content.glovesImageUrl}
                  onChange={handleChange}
                  className="w-full bg-black border border-zinc-800 p-3 rounded-lg focus:border-red-600 outline-none" 
                />
              </div>
              <div>
                <label className="block text-xs mb-1">Evolution/Environment Image URL</label>
                <input 
                  type="text" 
                  name="evolutionImageUrl" 
                  value={content.evolutionImageUrl}
                  onChange={handleChange}
                  className="w-full bg-black border border-zinc-800 p-3 rounded-lg focus:border-red-600 outline-none" 
                />
              </div>
              <div>
                <label className="block text-xs mb-1">Revenue/Stats Background URL</label>
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
              <span className="text-zinc-600 text-sm italic">Last updated from your local storage</span>
            )}
            <button 
              onClick={handleSave}
              className="bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-xl font-bold transition-all transform hover:scale-105"
            >
              SAVE ALL CHANGES
            </button>
          </div>
        </div>

        <div className="mt-12 p-8 bg-zinc-900/50 rounded-2xl border border-dashed border-zinc-800">
          <h3 className="text-sm font-bold mb-4 text-zinc-400">PREVIEW CURRENT ASSETS</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <div className="aspect-square bg-black rounded-lg overflow-hidden border border-zinc-800">
                <img src={content.glovesImageUrl} className="w-full h-full object-cover" alt="Preview" />
             </div>
             <div className="aspect-square bg-black rounded-lg overflow-hidden border border-zinc-800">
                <img src={content.evolutionImageUrl} className="w-full h-full object-cover" alt="Preview" />
             </div>
             <div className="aspect-square bg-black rounded-lg overflow-hidden border border-zinc-800">
                <img src={content.revenueImageUrl} className="w-full h-full object-cover" alt="Preview" />
             </div>
             <div className="aspect-square bg-zinc-800 rounded-lg flex items-center justify-center text-xs text-zinc-500">
                Videos Preview in Site
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
