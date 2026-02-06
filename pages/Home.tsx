
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
    <div className="bg-black text-white min-h-screen">
      <Navbar logoUrl={content.logoUrl} />
      
      <Hero videoUrl={content.heroVideoUrl} />

      {/* Section: Digital Boxing Gloves */}
      <section id="about" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <RevealOnScroll>
            <div className="relative group">
              <img 
                src={content.glovesImageUrl} 
                alt="Digital Gloves" 
                className="rounded-2xl shadow-2xl border border-white/10 group-hover:border-red-600 transition-colors duration-500 w-full object-cover aspect-[4/3]"
              />
              <div className="absolute -bottom-6 -right-6 bg-red-600 p-6 rounded-2xl hidden md:block">
                <p className="text-4xl font-oswald font-bold leading-none">FIRST</p>
                <p className="text-xs font-bold uppercase tracking-widest mt-1">Digital Glove Invention</p>
              </div>
            </div>
          </RevealOnScroll>
          
          <RevealOnScroll>
            <h2 className="text-4xl md:text-5xl font-oswald font-bold mb-8 leading-tight">
              THE <span className="text-red-600 italic">DIGITAL</span> BOXING GLOVES
            </h2>
            <div className="space-y-6 text-zinc-400 text-lg">
              <p>
                This Filipino-invented gloves is patented in the Philippines. Conceptualized and created by Filipinos 
                with in-depth experience in IT and Gamefowls.
              </p>
              <p className="border-l-4 border-red-600 pl-6 py-2 bg-zinc-900/50 rounded-r-lg">
                Wireless devices connect via a <span className="text-white font-bold">special frequency</span> to a 'Blackbox' computer. 
                Unhackable and offline to ensure utmost accuracy and integrity.
              </p>
              <p>
                Invented to replace dangerous blades and eliminate death, preserving the noble spirit of the rooster 
                while creating a sustainable sport.
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Section: Fight Video & Evolution */}
      <section id="evolution" className="bg-zinc-900 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <RevealOnScroll>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-oswald font-bold mb-4 uppercase">A NOBLE EVOLUTION</h2>
              <div className="w-24 h-1 bg-red-600 mx-auto"></div>
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <RevealOnScroll>
              <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-black group">
                <video 
                  autoPlay 
                  muted 
                  loop 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                >
                  <source src={content.fightVideoUrl} type="video/mp4" />
                </video>
              </div>
              <p className="mt-4 text-zinc-500 text-sm text-center">Live Demo: High-Speed Tracking Accuracy</p>
            </RevealOnScroll>

            <RevealOnScroll>
              <div className="h-full flex flex-col justify-center">
                <h3 className="text-2xl font-oswald font-bold mb-6 text-red-500 uppercase tracking-widest">Global Impact</h3>
                <p className="text-zinc-400 text-lg mb-8">
                  Gamefowl boxing is projected to captivate broader markets, especially in countries advocating against animal cruelty. 
                  By upholding these values, we unlock massive imminent revenue streams while modernizing a centuries-old tradition.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/40 p-6 rounded-xl border border-white/5">
                    <p className="text-3xl font-oswald font-bold text-white mb-1">PLUG & PLAY</p>
                    <p className="text-xs text-zinc-500 uppercase font-bold">Facility Ready</p>
                  </div>
                  <div className="bg-black/40 p-6 rounded-xl border border-white/5">
                    <p className="text-3xl font-oswald font-bold text-white mb-1">10-15M</p>
                    <p className="text-xs text-zinc-500 uppercase font-bold">Launch Funding Req.</p>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* Section: Revenue */}
      <section id="revenue" className="py-24 px-6 max-w-7xl mx-auto">
        <RevealOnScroll>
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="flex-1 w-full order-2 lg:order-1">
              <RevenueChart />
            </div>
            <div className="flex-1 order-1 lg:order-2">
              <h2 className="text-4xl md:text-5xl font-oswald font-bold mb-6">BILLIONS IN <span className="text-red-600">POTENTIAL</span></h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-red-600/10 p-3 rounded-lg text-red-600 font-bold">01</div>
                  <div>
                    <h4 className="text-white font-bold text-lg">Massive Audience</h4>
                    <p className="text-zinc-400">1 Million Bettors projected per fight globally.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-red-600/10 p-3 rounded-lg text-red-600 font-bold">02</div>
                  <div>
                    <h4 className="text-white font-bold text-lg">Daily Scale</h4>
                    <p className="text-zinc-400">250 Fights per day supported by our operational manpower.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-red-600/10 p-3 rounded-lg text-red-600 font-bold">03</div>
                  <div>
                    <h4 className="text-white font-bold text-lg">$250,000,000</h4>
                    <p className="text-zinc-400 text-sm">Minimum projected Gross Profit per Day based on 10% rake.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* Section: Investor Form */}
      <section id="invest" className="py-24 px-6 bg-zinc-900/50">
        <div className="max-w-4xl mx-auto">
          <RevealOnScroll>
            <div className="text-center mb-12">
                <h2 className="text-4xl font-oswald font-bold text-red-600 mb-4">READY TO INVEST?</h2>
                <p className="text-zinc-400">Join the revolution of non-lethal gamefowl boxing. Leave your details below.</p>
            </div>
            {success ? (
                <div className="bg-green-600/20 border border-green-600 p-8 rounded-2xl text-center">
                    <h3 className="text-2xl font-bold mb-2">Submission Received!</h3>
                    <p>Thank you for your interest. Our team will contact you shortly.</p>
                    <button onClick={() => setSuccess(false)} className="mt-4 text-zinc-400 underline uppercase text-xs font-bold">Send another message</button>
                </div>
            ) : (
                <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-black p-8 md:p-12 rounded-3xl border border-white/5 shadow-2xl">
                    <div className="space-y-2">
                        <label className="text-xs uppercase font-bold text-zinc-500">Full Name</label>
                        <input 
                            required
                            type="text" 
                            className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl focus:border-red-600 outline-none"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs uppercase font-bold text-zinc-500">Email Address</label>
                        <input 
                            required
                            type="email" 
                            className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl focus:border-red-600 outline-none"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs uppercase font-bold text-zinc-500">Phone / WhatsApp</label>
                        <input 
                            required
                            type="text" 
                            className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl focus:border-red-600 outline-none"
                            placeholder="+63 ..."
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs uppercase font-bold text-zinc-500">Interest / Message</label>
                        <input 
                            className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl focus:border-red-600 outline-none"
                            placeholder="Brief message..."
                            value={formData.message}
                            onChange={(e) => setFormData({...formData, message: e.target.value})}
                        />
                    </div>
                    <div className="md:col-span-2 mt-4">
                        <button 
                            disabled={submitting}
                            type="submit" 
                            className="w-full bg-red-600 hover:bg-red-700 py-4 rounded-xl font-bold uppercase tracking-widest transition-all disabled:opacity-50"
                        >
                            {submitting ? 'Submitting...' : 'Send Investment Proposal'}
                        </button>
                    </div>
                </form>
            )}
          </RevealOnScroll>
        </div>
      </section>

      {/* Section: Contact */}
      <footer id="contact" className="bg-black border-t border-zinc-800 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <RevealOnScroll>
              <div>
                <h2 className="text-3xl font-oswald font-bold mb-8 text-red-600 uppercase">Partner With Us</h2>
                <p className="text-zinc-400 mb-12 text-lg">
                  We are looking for partners that can facilitate global branding and licensing. 
                  Join the forefront of the next global sports revolution.
                </p>
                <div className="space-y-4">
                  <p className="text-zinc-500 text-sm uppercase tracking-widest font-bold">Investors Desk</p>
                  <p className="text-white">Pursuant to the success of this Project, rest assured of our submissiveness to any capable investor's terms and conditions.</p>
                </div>
              </div>
            </RevealOnScroll>

            <RevealOnScroll>
              <div className="bg-zinc-900 p-10 rounded-3xl border border-white/5 space-y-8">
                <div>
                  <h4 className="text-red-600 font-bold uppercase mb-2">Bernard D. Parrocha</h4>
                  <p className="text-zinc-400">Viber / Whatsapp: <span className="text-white">09560415294</span></p>
                  <p className="text-zinc-400">Email: <span className="text-white">parocha.bernard@yahoo.com</span></p>
                </div>
                <div className="w-full h-px bg-zinc-800"></div>
                <div>
                  <h4 className="text-red-600 font-bold uppercase mb-2">Edgardo P. Go</h4>
                  <p className="text-zinc-400">Viber / Whatsapp: <span className="text-white">09060746562</span></p>
                  <p className="text-zinc-400">Email: <span className="text-white">edp.go@yahoo.com</span></p>
                </div>
              </div>
            </RevealOnScroll>
          </div>
          <div className="mt-24 pt-8 border-t border-zinc-900 text-center text-zinc-600 text-sm">
            &copy; 2025 GGBS Global Gamefowl Boxing Sports. All Rights Reserved. Filipino Invented. Globally Patented.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
