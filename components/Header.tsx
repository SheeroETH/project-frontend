import React from 'react';
import { ShoppingBag, Users, Zap } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center items-center pointer-events-none">
      <div className="bg-[#1a1a1a] text-white px-6 py-3 rounded-full flex items-center space-x-6 shadow-xl pointer-events-auto border border-gray-800">
        <button className="flex items-center space-x-2 hover:text-gray-300 transition-colors font-semibold text-sm">
          <ShoppingBag size={16} className="text-white" />
          <span>Buy $BABY</span>
        </button>
        
        <div className="h-4 w-px bg-gray-600"></div>

        <button className="flex items-center space-x-2 hover:text-gray-300 transition-colors font-semibold text-sm">
          <Users size={16} />
          <span>Community</span>
        </button>

        <div className="h-4 w-px bg-gray-600"></div>

        <button className="flex items-center space-x-2 hover:text-gray-300 transition-colors font-semibold text-sm">
          <span className="text-xl">👶</span>
          <span>BabyFactory</span>
        </button>

        <div className="h-4 w-px bg-gray-600"></div>

        <button className="flex items-center space-x-2 hover:text-gray-300 transition-colors font-semibold text-sm">
          <Zap size={16} />
          <span>DexScreener</span>
        </button>
      </div>
    </div>
  );
};

export default Header;
