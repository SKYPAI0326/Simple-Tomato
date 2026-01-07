import React, { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, Loader2, RefreshCw } from 'lucide-react';

// 定義新聞資料的結構
interface NewsItem {
  id: number;
  title: string;
  source: string;
  url: string; // 雖然是假資料，但我們可以預留連結欄位
  date: string;
}

const NewsBoard: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 模擬抓取新聞的過程
  const fetchNews = () => {
    setIsLoading(true);
    
    // 這裡我們使用 setTimeout 模擬網路請求，讓體驗更真實
    setTimeout(() => {
      setNews([
        { 
          id: 1, 
          title: "數位極簡主義：如何在雜訊中找回專注力", 
          source: "Zen Tech", 
          url: "#", 
          date: "2024-03-20" 
        },
        { 
          id: 2, 
          title: "SpaceX 星艦計畫取得新突破，重塑太空探索", 
          source: "TechDaily", 
          url: "#", 
          date: "2024-03-19" 
        },
        { 
          id: 3, 
          title: "正念冥想對工程師大腦的可塑性影響研究", 
          source: "Mind Science", 
          url: "#", 
          date: "2024-03-18" 
        },
        { 
          id: 4, 
          title: "AI 時代的程式設計哲學：從 Coding 到 Prompting", 
          source: "DevLog", 
          url: "#", 
          date: "2024-03-18" 
        },
        { 
          id: 5, 
          title: "辦公桌上的微型花園：提升工作效率的綠色佈局", 
          source: "LifeStyle", 
          url: "#", 
          date: "2024-03-17" 
        }
      ]);
      setIsLoading(false);
    }, 1500); // 延遲 1.5 秒
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="h-full flex flex-col bg-white/40 backdrop-blur-xl rounded-3xl border border-white/60 shadow-sm overflow-hidden group hover:bg-white/50 transition-all duration-500">
      
      {/* Header */}
      <div className="p-6 pb-4 flex justify-between items-center border-b border-zen-text/5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-zen-matcha/10 rounded-xl text-zen-matcha">
            <Newspaper className="w-5 h-5" />
          </div>
          <span className="font-bold text-zen-text tracking-wide">Daily Feed</span>
        </div>
        <button 
          onClick={fetchNews} 
          disabled={isLoading}
          className="p-2 hover:bg-black/5 rounded-full transition-colors disabled:opacity-30"
        >
          <RefreshCw className={`w-4 h-4 text-zen-text/40 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* News List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
        {isLoading ? (
          <div className="h-full flex flex-col items-center justify-center gap-3 text-zen-text/30">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="text-xs font-medium tracking-widest uppercase">Curating...</span>
          </div>
        ) : (
          news.map((item) => (
            <div 
              key={item.id} 
              className="p-4 rounded-2xl hover:bg-white/60 transition-all duration-300 cursor-pointer group/item border border-transparent hover:border-white/50"
            >
              <div className="flex justify-between items-start gap-4">
                <h3 className="text-sm font-medium text-zen-text leading-snug group-hover/item:text-zen-matcha transition-colors line-clamp-2">
                  {item.title}
                </h3>
                <ExternalLink className="w-3 h-3 text-zen-text/20 shrink-0 mt-1 opacity-0 group-hover/item:opacity-100 transition-opacity" />
              </div>
              <div className="mt-2 flex items-center justify-between text-[10px] font-bold tracking-wider uppercase opacity-40">
                <span>{item.source}</span>
                <span>{item.date}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NewsBoard;
