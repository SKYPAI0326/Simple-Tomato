
import React, { useState, useEffect } from 'react';
import { ZEN_QUOTES } from '../constants.ts';
import { RefreshCw, Sparkles } from 'lucide-react';

const PhilosophyTile: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // 初始化時隨機選一個
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * ZEN_QUOTES.length);
    setIndex(randomIndex);
  }, []);

  const nextQuote = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    // 確保隨機選到跟現在不一樣的 (如果庫存大於 1)
    setTimeout(() => {
      let nextIdx = index;
      if (ZEN_QUOTES.length > 1) {
        while (nextIdx === index) {
          nextIdx = Math.floor(Math.random() * ZEN_QUOTES.length);
        }
      } else {
        nextIdx = (index + 1) % ZEN_QUOTES.length;
      }
      
      setIndex(nextIdx);
      setIsAnimating(false);
    }, 300);
  };

  const quote = ZEN_QUOTES[index];

  return (
    <div 
      onClick={nextQuote}
      className="group h-full w-full bg-zen-lightWood/40 rounded-lg p-8 flex flex-col justify-center items-center cursor-pointer hover:bg-zen-lightWood/60 transition-all border border-white/40 overflow-hidden relative shadow-sm"
    >
      <div className={`transition-all duration-300 transform flex flex-col items-center w-full max-w-2xl ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        <div className="relative mb-6">
          <Sparkles className="absolute -top-6 -left-6 w-4 h-4 text-zen-matcha/40 animate-pulse" />
          <p className="text-3xl md:text-4xl font-light tracking-[0.3em] text-zen-text text-center">
            {quote.ja}
          </p>
          <Sparkles className="absolute -bottom-6 -right-6 w-4 h-4 text-zen-matcha/40 animate-pulse delay-700" />
        </div>
        
        <div className="flex flex-col items-center gap-3">
          <div className="h-px w-12 bg-zen-text/10" />
          <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-zen-text text-center font-bold opacity-40">
            {quote.en}
          </p>
          <p className="text-sm md:text-base text-zen-text text-center opacity-70 font-medium">
            {quote.tw}
          </p>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 flex items-center gap-2 opacity-0 group-hover:opacity-30 transition-opacity">
        <span className="text-[10px] font-bold uppercase tracking-widest">Next Reflection</span>
        <RefreshCw className={`w-4 h-4 text-zen-text ${isAnimating ? 'animate-spin' : ''}`} />
      </div>
      
      <div className="absolute top-6 left-6 text-[9px] font-bold uppercase tracking-widest opacity-30 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-zen-matcha animate-pulse" />
        Mindful Reflection / 點擊感悟
      </div>

      {/* 裝飾線條 */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-zen-matcha/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </div>
  );
};

export default PhilosophyTile;
