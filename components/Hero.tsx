import React from 'react';
import { Hammer } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="text-center pt-6 pb-2 flex flex-col items-center">

      {/* Secondary Pill */}
      <div className="mb-6 animate-fade-in-down">
        <button className="bg-[#1a1a1a] text-white px-5 py-2 rounded-full text-xs font-bold flex items-center space-x-2 border border-gray-700 hover:scale-105 transition-transform shadow-lg">
          <Hammer size={14} className="text-[#EDEEFF]" />
          <span>Build your $BABY</span>
        </button>
      </div>

      <h1 className="text-4xl md:text-6xl lg:text-8xl font-semibold text-black tracking-normal mb-4 drop-shadow-sm">
        Baby Factory
      </h1>
      <p className="text-gray-500 text-lg md:text-xl font-light tracking-wide">
        Create your own Baby pfp in just one click!
      </p>
    </div>
  );
};

export default Hero;
