
import React from 'react';

interface HeroProps {
  videoUrl: string;
}

const Hero: React.FC<HeroProps> = ({ videoUrl }) => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Video Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
      
      {/* Background Video */}
      <video 
        autoPlay 
        loop 
        playsInline 
        className="absolute inset-0 w-full h-full object-cover scale-105 blur-[2px] brightness-50"
      >
        <source src={videoUrl} type="video/mp4" />
      </video>

      <div className="relative z-20 text-center px-6 max-w-5xl animate-fade-up">
        <h2 className="text-red-600 font-oswald font-bold tracking-[0.3em] mb-4 md:text-xl">THE FUTURE OF GAMEFOWL SPORTS</h2>
        <h1 className="text-5xl md:text-8xl font-oswald font-extrabold mb-6 leading-none tracking-tighter">
          GLOBAL GAMEFOWL <br />
          <span className="text-red-600">BOXING SPORTS</span>
        </h1>
        <p className="text-zinc-300 md:text-xl max-w-2xl mx-auto leading-relaxed mb-10 font-medium">
          Transforming a brutal tradition into a high-tech, non-lethal global phenomenon. 
          Innovation meets integrity.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <a href="#about" className="bg-white text-black px-10 py-5 rounded-full font-bold uppercase text-sm hover:bg-zinc-200 transition-all transform hover:scale-105 shadow-xl">Learn About the Gloves</a>
          <a href="#revenue" className="bg-red-600 text-white px-10 py-5 rounded-full font-bold uppercase text-sm hover:bg-red-700 transition-all transform hover:scale-105 shadow-xl shadow-red-600/20">View Revenue Projection</a>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce">
        <div className="w-1 h-12 bg-gradient-to-b from-red-600 to-transparent rounded-full"></div>
      </div>
    </section>
  );
};

export default Hero;
