
import React, { useState } from 'react';
import { ZEN_QUOTES } from '../constants.ts';
import { RefreshCw } from 'lucide-react';

const PhilosophyTile: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextQuote = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % ZEN_QUOTES.length);
      setIsAnimating(false);
    }, 300);
  };

  const quote = ZEN_QUOTES[index];

  return (
    <div 
      onClick={nextQuote}
      className="group h-full w-full bg-zen-lightWood/40 rounded-lg p-8 flex flex-col justify-center items-center cursor-pointer hover:bg-zen-lightWood/60 transition-all border border-white/40 overflow-hidden relative shadow-sm"
    >
      <div className={`transition-all duration-300 transform flex flex-col items-center ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        <p className="text-2xl md:text-3xl font-light tracking-[0.2em] text-zen-text text-center mb-4">
          "{quote.ja}"
        </p>
        <div className="flex flex-col items-center gap-2">
          <p className="text-[10px] md:text-xs uppercase tracking-widest text-zen-text text-center font-bold opacity-60">
            {quote.en}
          </p>
          <p className="text-xs md:text-sm text-zen-text text-center opacity-80">
            {quote.tw}
          </p>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-30 transition-opacity">
        <RefreshCw className={`w-4 h-4 text-zen-text ${isAnimating ? 'animate-spin' : ''}`} />
      </div>
      
      <div className="absolute top-4 left-4 text-[9px] font-bold uppercase tracking-widest opacity-30">
        Mindful Reflection / 點擊感悟
      </div>
    </div>
  );
};

export default PhilosophyTile;
