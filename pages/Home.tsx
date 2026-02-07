
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import RevealOnScroll from '../components/RevealOnScroll';
import RevenueChart from '../components/RevenueChart';
import { SiteContent } from '../types';
import { submitInvestorLead } from '../services/supabase';

interface HomeProps {
  content: SiteContent;
}

const Home: React.FC<HomeProps> = ({ content }) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitInvestorLead(formData);
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      alert('Failed to submit. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen selection:bg-red-600 selection:text-white overflow-x-hidden">
      <Navbar logoUrl={content.logoUrl} />
      
      <Hero videoUrl={content.heroVideoUrl} />

      {/* Section: Digital Boxing Gloves with Auto-Popups */}
      <section id="about" className="py-32 px-6 max-w-7xl mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <RevealOnScroll>
            <div className="relative group perspective-1000">
              <img 
                src={content.glovesImageUrl} 
                alt="Digital Gloves" 
                className="rounded-[3rem] shadow-3xl border border-white/10 group-hover:border-red-600/60 transition-all duration-1000 w-full object-cover aspect-[4/3] transform group-hover:rotate-y-6"
              />
              
              {/* Dynamic Pop-up Details */}
              <div className="absolute -top-10 -left-10 bg-red-600 p-8 rounded-[2.5rem] shadow-3xl animate-bounce hover:animate-none cursor-help group/pop">
                <span className="text-4xl font-oswald font-black leading-none">AI</span>
                <div className="absolute top-0 left-full ml-4 w-48 bg-zinc-900 p-4 rounded-2xl opacity-0 group-hover/pop:opacity-100 transition-opacity border border-red-600 shadow-2xl pointer-events-none z-50">
                  <p className="text-[9px] font-black uppercase text-red-500 mb-1">Tracking Engine</p>
                  <p className="text-[11px] font-medium leading-tight">Proprietary AI determines hit impact and frequency in real-time.</p>
                </div>
              </div>

              <div className="absolute -bottom-8 -right-8 bg-white text-black p-8 rounded-[2.5rem] shadow-3xl rotate-3 group-hover:rotate-0 transition-transform cursor-help group/pop2">
                <p className="text-5xl font-oswald font-black leading-none uppercase">P2P</p>
                <div className="absolute bottom-full right-0 mb-4 w-56 bg-zinc-900 text-white p-5 rounded-3xl opacity-0 group-hover/pop2:opacity-100 transition-opacity border border-white/20 shadow-2xl pointer-events-none z-50">
                  <p className="text-[9px] font-black uppercase text-zinc-500 mb-2">Network Security</p>
                  <p className="text-xs italic">"Unhackable frequency ensures zero betting manipulation."</p>
                </div>
              </div>
            </div>
          </RevealOnScroll>
          
          <RevealOnScroll>
            <h2 className="text-5xl md:text-8xl font-oswald font-bold mb-10 leading-[0.85] tracking-tighter uppercase">
              REDEFINING <span className="text-red-600 italic underline decoration-4 underline-offset-8">COMBAT</span>
            </h2>
            <div className="space-y-8 text-zinc-400 text-lg leading-relaxed">
              <p className="text-2xl font-light">
                Developed by elite IT engineers and lifelong gamefowl experts, our patented digital gloves preserve tradition without the lethality.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-zinc-900/50 rounded-3xl border border-white/5 hover:bg-zinc-800 transition-colors cursor-pointer group">
                  <p className="text-red-600 font-black text-[10px] uppercase mb-2">Tech Spec</p>
                  <p className="text-white text-sm font-bold group-hover:text-red-500 transition-colors">100% Water Proof</p>
                </div>
                <div className="p-6 bg-zinc-900/50 rounded-3xl border border-white/5 hover:bg-zinc-800 transition-colors cursor-pointer group">
                  <p className="text-red-600 font-black text-[10px] uppercase mb-2">Response</p>
                  <p className="text-white text-sm font-bold group-hover:text-red-500 transition-colors">0.01ms Latency</p>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Section: Fight Video & Evolution with Auto-Play */}
      <section id="evolution" className="bg-zinc-950 py-32 px-6 border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto">
          <RevealOnScroll>
            <div className="text-center mb-24">
              <h2 className="text-6xl md:text-9xl font-oswald font-bold mb-6 uppercase tracking-tighter leading-none">NOBLE <span className="text-red-600">EVOLUTION</span></h2>
              <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[1em] mb-12">The Shift of Centuries</p>
              <div className="w-48 h-1 bg-red-600 mx-auto rounded-full"></div>
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
            <RevealOnScroll>
              <div className="relative group">
                <div className="aspect-video rounded-[4rem] overflow-hidden shadow-[0_0_100px_rgba(239,68,68,0.15)] border-[1px] border-white/10 relative">
                  <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3s]"
                  >
                    <source src={content.fightVideoUrl} type="video/mp4" />
                  </video>
                  {/* Floating Video Overlay Labels */}
                  <div className="absolute top-10 left-10 flex gap-4 animate-pulse">
                    <div className="bg-red-600/90 px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-2">
                       <div className="w-1.5 h-1.5 bg-white rounded-full"></div> LIVE SIMULATION
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-10 -left-10 md:left-20 w-48 bg-white p-6 rounded-3xl shadow-3xl text-black">
                   <p className="text-[10px] font-black uppercase mb-1">Impact Detection</p>
                   <p className="text-2xl font-oswald font-black text-red-600">99.8% ACC</p>
                </div>
              </div>
            </RevealOnScroll>

            <RevealOnScroll>
              <div className="h-full flex flex-col justify-center">
                <h3 className="text-4xl font-oswald font-bold mb-8 text-white uppercase tracking-tighter">EMBRACING THE GLOBAL STAGE</h3>
                <p className="text-zinc-500 text-xl mb-12 leading-relaxed font-light">
                  By removing lethality, we open the doors to mainstream television, global betting platforms, and animal welfare compliance. 
                  This isn't just a gadget; it's a new billion-dollar sports league.
                </p>
                
                <div className="space-y-6">
                   <div className="flex items-center gap-6 p-8 bg-zinc-900/40 rounded-[2.5rem] border border-white/5 hover:border-red-600/50 transition-all group">
                      <img src={content.evolutionImageUrl} alt="Evolution" className="w-20 h-20 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all" />
                      <div>
                        <h4 className="text-white font-bold uppercase tracking-widest text-sm">Mainstream Entry</h4>
                        <p className="text-zinc-500 text-xs">Facility Ready, Regulations Compliant.</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-6 p-8 bg-zinc-900/40 rounded-[2.5rem] border border-white/5 hover:border-red-600/50 transition-all group">
                      <img src={content.revenueImageUrl} alt="Revenue" className="w-20 h-20 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all" />
                      <div>
                        <h4 className="text-white font-bold uppercase tracking-widest text-sm">Scale Readiness</h4>
                        <p className="text-zinc-500 text-xs">Targeting 250 Fights Per Day Globally.</p>
                      </div>
                   </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* Section: Revenue with Detail Pop-up */}
      <section id="revenue" className="py-40 px-6 max-w-7xl mx-auto">
        <RevealOnScroll>
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="flex-1 w-full order-2 lg:order-1 relative">
              <RevenueChart />
              <div className="absolute -top-12 -right-12 bg-zinc-900 p-8 rounded-[3rem] border border-red-600/30 hidden lg:block shadow-3xl animate-pulse">
                <p className="text-xs font-black text-red-500 uppercase tracking-widest mb-1">Daily Cap</p>
                <p className="text-4xl font-oswald font-black text-white">$250M+</p>
              </div>
            </div>
            <div className="flex-1 order-1 lg:order-2">
              <h2 className="text-6xl md:text-8xl font-oswald font-bold mb-10 tracking-tighter leading-none">THE <span className="text-red-600">MATH</span> OF SUCCESS</h2>
              <div className="space-y-6">
                {[
                  { id: '01', title: 'User Base', desc: '1,000,000 Active Bettors per Session.' },
                  { id: '02', title: 'Volume', desc: 'Average $10 Bet per User.' },
                  { id: '03', title: 'Profit', desc: '10% Corporate Rake on Gross Volume.' },
                ].map((item) => (
                  <div key={item.id} className="flex items-center gap-8 p-10 bg-zinc-950 rounded-[3rem] border border-white/5 hover:bg-zinc-900 transition-all group">
                    <div className="text-5xl font-oswald font-black text-zinc-800 group-hover:text-red-600 transition-colors">{item.id}</div>
                    <div>
                      <h4 className="text-white font-bold text-xl uppercase mb-1 tracking-tight">{item.title}</h4>
                      <p className="text-zinc-500 text-lg font-light leading-snug">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* Section: Investor Form */}
      <section id="invest" className="py-40 px-6 bg-gradient-to-b from-zinc-950 to-black">
        <div className="max-w-4xl mx-auto">
          <RevealOnScroll>
            <div className="text-center mb-20">
                <h2 className="text-7xl font-oswald font-bold text-white mb-6 tracking-tighter uppercase">JOIN THE <span className="text-red-600">BOARD</span></h2>
                <p className="text-zinc-500 text-xl font-light max-w-2xl mx-auto">Global licensing and facilities management opportunities are now open for qualified entities.</p>
            </div>
            {success ? (
                <div className="bg-red-600 p-20 rounded-[4rem] text-center animate-fade-up shadow-3xl shadow-red-600/30">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 text-red-600">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <h3 className="text-4xl font-oswald font-black text-white mb-4 uppercase tracking-tighter">DATA TRANSMITTED</h3>
                    <p className="text-red-100 text-lg mb-10 opacity-80">Our executive desk has received your proposal. Stand by for authentication.</p>
                    <button onClick={() => setSuccess(false)} className="bg-white text-red-600 px-14 py-5 rounded-full font-black uppercase text-xs tracking-widest hover:bg-black hover:text-white transition-all shadow-xl">New Signal</button>
                </div>
            ) : (
                <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-zinc-900/20 p-12 md:p-20 rounded-[4rem] border border-white/5 shadow-inner backdrop-blur-xl relative">
                    <div className="space-y-4">
                        <label className="text-[10px] uppercase font-black text-red-600 tracking-[0.4em] ml-2">Entity Name</label>
                        <input 
                            required
                            type="text" 
                            className="w-full bg-black/60 border-2 border-zinc-900 p-6 rounded-3xl focus:border-red-600 outline-none text-white transition-all font-bold text-lg"
                            placeholder="GLOBAL CORP"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] uppercase font-black text-red-600 tracking-[0.4em] ml-2">Communications Link</label>
                        <input 
                            required
                            type="email" 
                            className="w-full bg-black/60 border-2 border-zinc-900 p-6 rounded-3xl focus:border-red-600 outline-none text-white transition-all font-bold text-lg"
                            placeholder="ADMIN@CORP.COM"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] uppercase font-black text-red-600 tracking-[0.4em] ml-2">Terminal Number</label>
                        <input 
                            required
                            type="text" 
                            className="w-full bg-black/60 border-2 border-zinc-900 p-6 rounded-3xl focus:border-red-600 outline-none text-white transition-all font-bold text-lg"
                            placeholder="+1 / +63"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] uppercase font-black text-red-600 tracking-[0.4em] ml-2">Strategy Summary</label>
                        <input 
                            className="w-full bg-black/60 border-2 border-zinc-900 p-6 rounded-3xl focus:border-red-600 outline-none text-white transition-all font-bold text-lg"
                            placeholder="PROPOSAL DETAILS..."
                            value={formData.message}
                            onChange={(e) => setFormData({...formData, message: e.target.value})}
                        />
                    </div>
                    <div className="md:col-span-2 mt-8">
                        <button 
                            disabled={submitting}
                            type="submit" 
                            className="w-full bg-red-600 hover:bg-red-700 py-8 rounded-[2rem] font-black uppercase tracking-[0.5em] text-xs transition-all transform active:scale-[0.97] shadow-3xl shadow-red-600/30 text-white"
                        >
                            {submitting ? 'ENCRYPTING...' : 'DISPATCH PROPOSAL'}
                        </button>
                    </div>
                </form>
            )}
          </RevealOnScroll>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-black border-t border-white/5 py-40 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-32 items-center">
            <RevealOnScroll>
              <div>
                <h2 className="text-6xl font-oswald font-black mb-12 text-white uppercase tracking-tighter leading-none">THE DAWN OF <br /><span className="text-red-600">GGBS</span></h2>
                <div className="p-12 bg-zinc-900/30 border-l-8 border-red-600 rounded-r-[3rem]">
                  <p className="text-white text-2xl font-light italic leading-relaxed">
                    "GGBS is more than a sport; it is an ethical paradigm shift for the modern world."
                  </p>
                </div>
              </div>
            </RevealOnScroll>

            <RevealOnScroll>
              <div className="grid grid-cols-1 gap-8">
                {[
                  { name: 'Bernard D. Parrocha', phone: '09560415294', email: 'parocha.bernard@yahoo.com' },
                  { name: 'Edgardo P. Go', phone: '09060746562', email: 'edp.go@yahoo.com' }
                ].map((exec) => (
                  <div key={exec.name} className="bg-zinc-900/50 p-12 rounded-[3.5rem] border border-white/5 hover:border-red-600/40 transition-all group cursor-pointer">
                    <h4 className="text-red-600 font-black uppercase text-xs tracking-widest mb-6">{exec.name}</h4>
                    <p className="text-4xl font-oswald font-black text-white mb-4 group-hover:text-red-500 transition-colors">{exec.phone}</p>
                    <p className="text-zinc-500 text-lg font-medium">{exec.email}</p>
                  </div>
                ))}
              </div>
            </RevealOnScroll>
          </div>
          <div className="mt-40 pt-16 border-t border-zinc-900/50 text-center">
             <span className="text-zinc-700 text-[9px] font-black uppercase tracking-[1em]">Filipino Invention • Global Patent • © 2025</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
