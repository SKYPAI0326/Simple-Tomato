
import React from 'react';
import Header from './components/Header.tsx';
import Timer from './components/Timer.tsx';
import MemoBoard from './components/MemoBoard.tsx';
import NewsBoard from './components/NewsBoard.tsx';
import PhilosophyTile from './components/PhilosophyTile.tsx';
import { Settings } from 'lucide-react';

const App: React.FC = () => {
  const handleOpenSettings = async () => {
    try {
      if ((window as any).aistudio) {
        await (window as any).aistudio.openSelectKey();
        // 選擇金鑰後重新整理以套用新環境變數
        window.location.reload();
      }
    } catch (error) {
      console.error("Failed to open key selector:", error);
    }
  };

  return (
    <div className="min-h-screen font-zen selection:bg-zen-matcha/30 flex flex-col items-center bg-zen-bg overflow-x-hidden">
      <div className="w-full max-w-7xl mx-auto flex flex-col p-4 md:p-10">
        
        {/* Main Interface Content */}
        <main className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-[220px]">
          
          {/* Row 1 & 2: Timer Block */}
          <div className="md:col-span-2 md:row-span-2 bg-zen-matcha rounded-lg shadow-lg flex flex-col items-center justify-center p-8 text-white relative overflow-hidden group">
            <div className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-widest opacity-60">Timer / 番茄鐘</div>
            <Timer />
          </div>

          {/* Row 1 & 2: News Board */}
          <div className="md:col-span-2 md:row-span-2 overflow-hidden">
            <NewsBoard />
          </div>

          {/* Row 1 & 2: Memo Board */}
          <div className="md:col-span-2 md:row-span-2 bg-zen-wood rounded-lg shadow-lg border border-white/20 overflow-hidden">
            <MemoBoard />
          </div>

          {/* Row 3: Info & Philosophy */}
          <div className="md:col-span-2 bg-white/60 backdrop-blur-md rounded-lg p-6 flex flex-col justify-between border border-white/40 shadow-sm hover:shadow-md transition-all h-full min-h-[220px]">
            <Header />
          </div>

          <div className="md:col-span-2 lg:col-span-4 h-full min-h-[220px]">
            <PhilosophyTile />
          </div>

        </main>

        <footer className="w-full py-12 flex flex-col md:flex-row items-center justify-between text-zen-text px-4">
          <div className="text-[10px] opacity-30 font-medium tracking-widest uppercase mb-4 md:mb-0">
            © 2024 Simple Tomato. Crafting moments of focus.
          </div>
          
          <div className="flex items-center gap-6">
             <button 
              onClick={handleOpenSettings}
              className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-20 hover:opacity-100 transition-all duration-500"
             >
               <Settings className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform duration-700" />
               <span>System Config</span>
             </button>
             <div className="w-px h-3 bg-zen-text/10" />
             <div className="text-[10px] opacity-30 italic">Stay Mindful.</div>
          </div>
        </footer>
      </div>

      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-[0.03] -z-20 bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')]" />
    </div>
  );
};

export default App;
