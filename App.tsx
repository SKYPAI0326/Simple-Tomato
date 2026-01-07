
import React from 'react';
import Header from './components/Header.tsx';
import Timer from './components/Timer.tsx';
import MemoBoard from './components/MemoBoard.tsx';
import NewsBoard from './components/NewsBoard.tsx';
import PhilosophyTile from './components/PhilosophyTile.tsx';

const App: React.FC = () => {
  return (
    <div className="min-h-screen font-zen selection:bg-zen-matcha/30 flex flex-col items-center bg-zen-bg overflow-x-hidden">
      <div className="w-full max-w-7xl mx-auto flex flex-col p-4 md:p-10">
        
        {/* Main Interface Content */}
        <main className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-[220px]">
          
          {/* Row 1 & 2: Main Blocks */}
          <div className="md:col-span-2 md:row-span-2 bg-zen-matcha rounded-lg shadow-lg flex flex-col items-center justify-center p-8 text-white relative overflow-hidden group">
            <div className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-widest opacity-60">Timer / 番茄鐘</div>
            <Timer />
          </div>

          <div className="md:col-span-2 md:row-span-2 overflow-hidden">
            <NewsBoard />
          </div>

          <div className="md:col-span-2 md:row-span-2 bg-zen-wood rounded-lg shadow-lg border border-white/20 overflow-hidden">
            <MemoBoard />
          </div>

          {/* Row 3: Align Header and Philosophy Tile */}
          <div className="md:col-span-2 bg-white/60 backdrop-blur-md rounded-lg p-6 flex flex-col justify-between border border-white/40 shadow-sm hover:shadow-md transition-all h-full min-h-[220px]">
            <Header />
          </div>

          <div className="md:col-span-2 lg:col-span-4 h-full min-h-[220px]">
            <PhilosophyTile />
          </div>

        </main>

        <footer className="w-full py-12 text-center text-zen-text opacity-30 text-xs">
          <p>© 2024 Simple Tomato. Crafting moments of focus. / 雕琢專注的每一刻。</p>
        </footer>
      </div>

      {/* Subtle Texture Overlay */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-[0.03] -z-20 bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')]" />
    </div>
  );
};

export default App;
