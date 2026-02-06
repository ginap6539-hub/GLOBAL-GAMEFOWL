
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
    <div className="bg-black text-white min-h-screen selection:bg-red-600 selection:text-white">
      <Navbar logoUrl={content.logoUrl} />
      
      <Hero videoUrl={content.heroVideoUrl} />

      {/* Section: Digital Boxing Gloves */}
      <section id="about" className="py-32 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <RevealOnScroll>
            <div className="relative group">
              <img 
                src={content.glovesImageUrl} 
                alt="Digital Gloves" 
                className="rounded-[2.5rem] shadow-2xl border border-white/5 group-hover:border-red-600/50 transition-all duration-700 w-full object-cover aspect-[4/3] scale-[0.98] group-hover:scale-100"
              />
              <div className="absolute -bottom-8 -right-8 bg-red-600 p-8 rounded-3xl hidden md:block shadow-2xl shadow-red-600/20 rotate-3 group-hover:rotate-0 transition-transform">
                <p className="text-5xl font-oswald font-bold leading-none">FIRST</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Digital Invention</p>
              </div>
            </div>
          </RevealOnScroll>
          
          <RevealOnScroll>
            <h2 className="text-5xl md:text-7xl font-oswald font-bold mb-10 leading-[0.95] tracking-tighter">
              THE <span className="text-red-600">DIGITAL</span><br />BOXING GLOVES
            </h2>
            <div className="space-y-8 text-zinc-400 text-lg leading-relaxed">
              <p>
                This Filipino-invented gloves is patented in the Philippines. Conceptualized and created by Filipinos 
                with in-depth experience in IT and Gamefowls.
              </p>
              <p className="border-l-[6px] border-red-600 pl-8 py-4 bg-zinc-900/30 rounded-r-2xl text-white font-medium">
                Wireless devices connect via a <span className="text-red-500 font-bold">special frequency</span> to a 'Blackbox' computer. 
                Unhackable and offline to ensure utmost accuracy and integrity.
              </p>
              <p>
                Invented to replace dangerous blades and eliminate death, preserving the noble spirit of the rooster 
                while creating a sustainable global sport.
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Section: Fight Video & Evolution */}
      <section id="evolution" className="bg-zinc-950 py-32 px-6 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <RevealOnScroll>
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-8xl font-oswald font-bold mb-6 uppercase tracking-tighter">A NOBLE EVOLUTION</h2>
              <div className="w-32 h-1.5 bg-red-600 mx-auto rounded-full"></div>
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <RevealOnScroll>
              <div className="aspect-video rounded-[3rem] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.8)] border-[12px] border-zinc-900 group">
                <video 
                  autoPlay 
                  loop 
                  muted={false}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                >
                  <source src={content.fightVideoUrl} type="video/mp4" />
                </video>
              </div>
              <p className="mt-6 text-zinc-500 text-xs font-bold uppercase tracking-[0.3em] text-center">Live Demo: High-Speed Tracking Accuracy</p>
            </RevealOnScroll>

            <RevealOnScroll>
              <div className="h-full flex flex-col justify-center">
                <h3 className="text-3xl font-oswald font-bold mb-8 text-red-500 uppercase tracking-widest">Global Impact</h3>
                <p className="text-zinc-400 text-xl mb-10 leading-relaxed font-light">
                  Gamefowl boxing is projected to captivate broader markets, especially in countries advocating against animal cruelty. 
                  By upholding these values, we unlock massive imminent revenue streams while modernizing a centuries-old tradition.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-black/50 p-8 rounded-3xl border border-white/5 hover:border-red-600/30 transition-colors">
                    <p className="text-4xl font-oswald font-bold text-white mb-2">PLUG & PLAY</p>
                    <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest">Facility Ready</p>
                  </div>
                  <div className="bg-black/50 p-8 rounded-3xl border border-white/5 hover:border-red-600/30 transition-colors">
                    <p className="text-4xl font-oswald font-bold text-white mb-2">10-15M</p>
                    <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest">Funding Requirement</p>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* Section: Revenue */}
      <section id="revenue" className="py-32 px-6 max-w-7xl mx-auto">
        <RevealOnScroll>
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="flex-1 w-full order-2 lg:order-1">
              <RevenueChart />
            </div>
            <div className="flex-1 order-1 lg:order-2">
              <h2 className="text-5xl md:text-7xl font-oswald font-bold mb-8 tracking-tighter">BILLIONS IN <span className="text-red-600">POTENTIAL</span></h2>
              <div className="space-y-8">
                <div className="flex items-start gap-6">
                  <div className="bg-red-600 text-white w-12 h-12 flex items-center justify-center rounded-2xl font-black text-xl shadow-lg shadow-red-600/20">01</div>
                  <div>
                    <h4 className="text-white font-bold text-xl uppercase mb-1">Massive Audience</h4>
                    <p className="text-zinc-400 text-lg">1 Million Bettors projected per fight globally.</p>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="bg-red-600 text-white w-12 h-12 flex items-center justify-center rounded-2xl font-black text-xl shadow-lg shadow-red-600/20">02</div>
                  <div>
                    <h4 className="text-white font-bold text-xl uppercase mb-1">Daily Scale</h4>
                    <p className="text-zinc-400 text-lg">250 Fights per day supported by operational manpower.</p>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="bg-red-600 text-white w-12 h-12 flex items-center justify-center rounded-2xl font-black text-xl shadow-lg shadow-red-600/20">03</div>
                  <div>
                    <h4 className="text-white font-bold text-xl uppercase mb-1">$250,000,000</h4>
                    <p className="text-zinc-400 text-lg">Minimum projected Gross Profit per Day (10% rake).</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* Section: Investor Form */}
      <section id="invest" className="py-32 px-6 bg-gradient-to-b from-zinc-950 to-black">
        <div className="max-w-4xl mx-auto">
          <RevealOnScroll>
            <div className="text-center mb-16">
                <h2 className="text-6xl font-oswald font-bold text-red-600 mb-6 tracking-tighter">READY TO INVEST?</h2>
                <p className="text-zinc-400 text-xl font-light">Join the revolution of non-lethal gamefowl boxing. Leave your details below.</p>
            </div>
            {success ? (
                <div className="bg-green-600/10 border border-green-600 p-16 rounded-[3rem] text-center animate-fade-up">
                    <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <h3 className="text-3xl font-bold mb-4">Submission Received</h3>
                    <p className="text-zinc-400 mb-8">Thank you for your interest. Our executive team will contact you shortly.</p>
                    <button onClick={() => setSuccess(false)} className="bg-white text-black px-10 py-4 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-zinc-200 transition-all">Send Another Proposal</button>
                </div>
            ) : (
                <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-zinc-900/30 p-10 md:p-16 rounded-[3rem] border border-white/5 shadow-2xl backdrop-blur-sm">
                    <div className="space-y-3">
                        <label className="text-[10px] uppercase font-black text-red-600 tracking-[0.2em] ml-2">Full Name</label>
                        <input 
                            required
                            type="text" 
                            className="w-full bg-black/50 border border-zinc-800 p-5 rounded-2xl focus:border-red-600 outline-none text-white transition-all font-bold"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] uppercase font-black text-red-600 tracking-[0.2em] ml-2">Email Address</label>
                        <input 
                            required
                            type="email" 
                            className="w-full bg-black/50 border border-zinc-800 p-5 rounded-2xl focus:border-red-600 outline-none text-white transition-all font-bold"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] uppercase font-black text-red-600 tracking-[0.2em] ml-2">Contact Number</label>
                        <input 
                            required
                            type="text" 
                            className="w-full bg-black/50 border border-zinc-800 p-5 rounded-2xl focus:border-red-600 outline-none text-white transition-all font-bold"
                            placeholder="+63 ..."
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] uppercase font-black text-red-600 tracking-[0.2em] ml-2">Inquiry / Terms</label>
                        <input 
                            className="w-full bg-black/50 border border-zinc-800 p-5 rounded-2xl focus:border-red-600 outline-none text-white transition-all font-bold"
                            placeholder="Brief message..."
                            value={formData.message}
                            onChange={(e) => setFormData({...formData, message: e.target.value})}
                        />
                    </div>
                    <div className="md:col-span-2 mt-6">
                        <button 
                            disabled={submitting}
                            type="submit" 
                            className="w-full bg-red-600 hover:bg-red-700 py-6 rounded-2xl font-bold uppercase tracking-[0.3em] text-sm transition-all transform active:scale-[0.98] shadow-2xl shadow-red-600/20"
                        >
                            {submitting ? 'PROCESSING...' : 'DISPATCH INVESTMENT PROPOSAL'}
                        </button>
                    </div>
                </form>
            )}
          </RevealOnScroll>
        </div>
      </section>

      {/* Section: Contact */}
      <footer id="contact" className="bg-black border-t border-white/5 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
            <RevealOnScroll>
              <div>
                <h2 className="text-5xl font-oswald font-bold mb-10 text-red-600 uppercase tracking-tighter leading-none">Partner With <br />The Revolution</h2>
                <p className="text-zinc-400 mb-12 text-xl font-light leading-relaxed">
                  We are looking for partners that can facilitate global branding and licensing. 
                  Join the forefront of the next global sports revolution.
                </p>
                <div className="p-10 bg-zinc-900/20 border border-white/5 rounded-[2rem]">
                  <p className="text-zinc-500 text-[10px] uppercase tracking-[0.4em] font-black mb-4">Investors Desk</p>
                  <p className="text-white text-lg font-medium leading-relaxed italic">"Pursuant to the success of this Project, rest assured of our submissiveness to any capable investor's terms and conditions."</p>
                </div>
              </div>
            </RevealOnScroll>

            <RevealOnScroll>
              <div className="space-y-8">
                <div className="bg-zinc-900/30 p-10 rounded-[2.5rem] border border-white/5 hover:border-red-600/30 transition-all group">
                  <h4 className="text-red-600 font-bold uppercase text-xs tracking-widest mb-4">Bernard D. Parrocha</h4>
                  <div className="space-y-1">
                    <p className="text-zinc-500 text-xs uppercase font-bold">Direct Line:</p>
                    <p className="text-2xl font-bold text-white group-hover:text-red-500 transition-colors">09560415294</p>
                  </div>
                  <div className="mt-6">
                    <p className="text-zinc-500 text-xs uppercase font-bold">Email:</p>
                    <p className="text-lg font-medium text-zinc-300">parocha.bernard@yahoo.com</p>
                  </div>
                </div>

                <div className="bg-zinc-900/30 p-10 rounded-[2.5rem] border border-white/5 hover:border-red-600/30 transition-all group">
                  <h4 className="text-red-600 font-bold uppercase text-xs tracking-widest mb-4">Edgardo P. Go</h4>
                  <div className="space-y-1">
                    <p className="text-zinc-500 text-xs uppercase font-bold">Direct Line:</p>
                    <p className="text-2xl font-bold text-white group-hover:text-red-500 transition-colors">09060746562</p>
                  </div>
                  <div className="mt-6">
                    <p className="text-zinc-500 text-xs uppercase font-bold">Email:</p>
                    <p className="text-lg font-medium text-zinc-300">edp.go@yahoo.com</p>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>
          <div className="mt-32 pt-12 border-t border-zinc-900 text-center text-zinc-600 text-[10px] uppercase font-bold tracking-[0.4em]">
            &copy; 2025 GGBS Global Gamefowl Boxing Sports. Filipino Invented. Globally Patented.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
