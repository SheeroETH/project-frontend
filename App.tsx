import React from 'react';

import Hero from './components/Hero';
import PfpGenerator from './components/PfpGenerator';

const App: React.FC = () => {
  return (
    <div className="min-h-screen relative overflow-x-hidden">

      <div className="relative z-10">


        <main className="container mx-auto px-4">
          <Hero />
          <PfpGenerator />
        </main>


      </div>
    </div>
  );
};

export default App;
