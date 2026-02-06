
import React, { useState, useRef } from 'react';

interface HeroProps {
  videoUrl: string;
}

const Hero: React.FC<HeroProps> = ({ videoUrl }) => {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Video Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
      
      {/* Background Video */}
      <video 
        ref={videoRef}
        autoPlay 
        loop 
        playsInline 
        muted={isMuted}
        className="absolute inset-0 w-full h-full object-cover scale-105 blur-[1px] brightness-50"
      >
        <source src={videoUrl} type="video/mp4" />
      </video>

      {/* Floating Sound Toggle */}
      <button 
        onClick={toggleSound}
        className="absolute bottom-10 right-10 z-30 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-full hover:bg-red-600 transition-all group"
      >
        {isMuted ? (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
        ) : (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
        )}
      </button>

      <div className="relative z-20 text-center px-6 max-w-5xl animate-fade-up">
        <h2 className="text-red-600 font-oswald font-bold tracking-[0.5em] mb-4 md:text-xl uppercase">The Future of Gamefowl</h2>
        <h1 className="text-5xl md:text-9xl font-oswald font-black mb-8 leading-none tracking-tighter uppercase">
          GLOBAL GAMEFOWL <br />
          <span className="text-red-600">BOXING SPORTS</span>
        </h1>
        <p className="text-zinc-400 md:text-2xl max-w-3xl mx-auto leading-relaxed mb-12 font-medium tracking-tight">
          Transforming a brutal tradition into a high-tech, <br className="hidden md:block"/> non-lethal global phenomenon. Innovation meets integrity.
        </p>
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
          <a href="#about" className="bg-white text-black px-12 py-6 rounded-full font-black uppercase text-xs tracking-[0.3em] hover:bg-red-600 hover:text-white transition-all transform hover:scale-105 shadow-2xl">Discover Invention</a>
          <a href="#invest" className="bg-red-600 text-white px-12 py-6 rounded-full font-black uppercase text-xs tracking-[0.3em] hover:bg-red-700 transition-all transform hover:scale-105 shadow-2xl shadow-red-600/30">Invest in GGBS</a>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce">
        <div className="w-[1px] h-16 bg-gradient-to-b from-red-600 to-transparent"></div>
      </div>
    </section>
  );
};

export default Hero;
