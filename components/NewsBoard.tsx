
import React, { useState, useEffect } from 'react';
import { Newspaper, ChevronRight, Search, Shuffle, Loader2, ExternalLink } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { MOCK_NEWS } from '../constants.ts';
import { NewsItem } from '../types.ts';

interface DynamicNewsItem extends NewsItem {
  url?: string;
}

const NewsBoard: React.FC = () => {
  const [keyword, setKeyword] = useState('最新科技');
  const [newsPool, setNewsPool] = useState<DynamicNewsItem[]>([]);
  const [displayedNews, setDisplayedNews] = useState<DynamicNewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initial load with mock data
    setNewsPool(MOCK_NEWS);
    shuffleNews(MOCK_NEWS);
  }, []);

  const shuffleNews = (pool: DynamicNewsItem[]) => {
    if (!pool || pool.length === 0) return;
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    setDisplayedNews(shuffled.slice(0, 3));
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!keyword.trim()) return;

    setIsLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `請搜尋過去 24 小時內與「${keyword}」相關的台灣繁體中文新聞。
        請列出至少 6 則新聞，每則新聞必須包含：
        1. 標題 (Title)
        2. 簡短摘要 (Summary, 約 40 字)
        請以條列方式呈現，並確保資訊準確且來自可靠來源。`,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text || "";
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      
      // Parse the text to extract titles and summaries
      // We look for patterns like "1. 標題: ..." or bold text
      const lines = text.split('\n').filter(l => l.trim().length > 0);
      const parsedItems: DynamicNewsItem[] = [];
      
      // Group lines that belong to the same news item
      let currentItem: Partial<DynamicNewsItem> = {};
      
      lines.forEach((line) => {
        const titleMatch = line.match(/^\d+\.\s*(?:標題[:：])?\s*(.*)/i) || line.match(/^\*\*(.*)\*\*/);
        const summaryMatch = line.match(/(?:摘要[:：])?\s*(.*)/i);

        if (titleMatch && !line.toLowerCase().includes('摘要')) {
          if (currentItem.title) {
            parsedItems.push(currentItem as DynamicNewsItem);
            currentItem = {};
          }
          currentItem.title = titleMatch[1].trim();
          currentItem.id = Date.now() + Math.random();
          currentItem.category = '即時新聞';
          currentItem.date = '24h內';
        } else if (currentItem.title && !currentItem.summary && line.length > 10) {
          currentItem.summary = line.replace(/摘要[:：]\s*/i, '').trim();
        }
      });

      if (currentItem.title) {
        parsedItems.push(currentItem as DynamicNewsItem);
      }

      // Map URLs from grounding chunks to the parsed items
      const finalItems: DynamicNewsItem[] = parsedItems.map((item, idx) => {
        // Find a corresponding chunk or fallback to the first available chunk
        const chunk = chunks[idx] || chunks[0];
        return {
          ...item,
          summary: item.summary || '點擊查看更多詳細內容。',
          url: chunk?.web?.uri || "#"
        };
      }).filter(item => item.url !== "#");

      if (finalItems.length > 0) {
        setNewsPool(finalItems);
        shuffleNews(finalItems);
      } else if (chunks.length > 0) {
        // Fallback: Use grounding chunks directly if text parsing fails
        const fallbackItems = chunks.map((chunk: any, idx: number) => ({
          id: Date.now() + idx,
          title: chunk.web?.title || `${keyword} 相關新聞`,
          category: '熱門搜尋',
          date: '最新',
          summary: '搜尋引擎找到的最新相關報導，點擊可閱讀全文。',
          url: chunk.web?.uri
        }));
        setNewsPool(fallbackItems);
        shuffleNews(fallbackItems);
      }
    } catch (error) {
      console.error("News search failed:", error);
      shuffleNews(MOCK_NEWS);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-6 text-zen-text relative">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Newspaper className="w-4 h-4 opacity-60 text-zen-matcha" />
          <h2 className="text-xs font-bold uppercase tracking-widest opacity-60">Live News / 精選動態</h2>
        </div>
        <button 
          onClick={() => shuffleNews(newsPool)}
          disabled={isLoading || newsPool.length === 0}
          className="p-1 hover:bg-zen-matcha/10 rounded-full transition-colors disabled:opacity-30 group"
          title="隨機挑選 3 則新聞"
        >
          <Shuffle className={`w-3 h-3 ${isLoading ? 'animate-pulse' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
        </button>
      </div>

      <form onSubmit={handleSearch} className="flex gap-1 mb-4">
        <div className="relative flex-1">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="輸入關鍵字搜尋 24h 新聞..."
            className="w-full bg-white/50 border border-white/20 rounded-lg pl-8 pr-2 py-2 text-xs outline-none focus:ring-1 focus:ring-zen-matcha/30 focus:bg-white transition-all placeholder:text-zen-text/30"
          />
          <Search className="absolute left-2.5 top-2.5 w-3 h-3 opacity-30" />
        </div>
        <button 
          type="submit"
          disabled={isLoading}
          className="bg-zen-matcha text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-zen-matcha/90 shadow-sm active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : '搜尋'}
        </button>
      </form>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
        {isLoading ? (
          <div className="h-full flex flex-col items-center justify-center opacity-40 gap-3">
            <div className="relative">
              <Loader2 className="w-8 h-8 animate-spin text-zen-matcha" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-1 h-1 bg-zen-matcha rounded-full animate-ping" />
              </div>
            </div>
            <span className="text-[10px] animate-pulse font-medium tracking-widest">SEARCHING THE WEB / 搜尋中</span>
          </div>
        ) : displayedNews.length > 0 ? (
          displayedNews.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block group p-4 bg-white/70 rounded-xl hover:bg-white transition-all border border-white/30 hover:border-zen-matcha/30 hover:shadow-md"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-[9px] uppercase font-bold text-zen-matcha px-2 py-0.5 bg-zen-matcha/10 rounded-md">
                  {item.category}
                </span>
                <span className="text-[9px] font-medium opacity-40">{item.date}</span>
              </div>
              <h3 className="text-sm font-bold mb-2 line-clamp-2 group-hover:text-zen-matcha transition-colors leading-snug">
                {item.title}
              </h3>
              <p className="text-[11px] opacity-70 line-clamp-3 leading-relaxed mb-3">
                {item.summary}
              </p>
              <div className="flex items-center justify-between pt-1 border-t border-black/5">
                <div className="flex items-center text-[9px] text-zen-matcha font-bold">
                  <span className="opacity-0 group-hover:opacity-100 transition-all transform -translate-x-2 group-hover:translate-x-0">
                    閱讀完整報導
                  </span>
                  <ChevronRight className="w-3 h-3 ml-1" />
                </div>
                <ExternalLink className="w-3 h-3 opacity-20 group-hover:opacity-60 transition-opacity" />
              </div>
            </a>
          ))
        ) : (
          <div className="h-full flex items-center justify-center opacity-30 text-xs italic">
            找不到相關動態，請嘗試其他關鍵字。
          </div>
        )}
      </div>

      <div className="mt-3 text-[8px] opacity-20 text-center tracking-tighter">
        Grounding sources provided by Google Search
      </div>
    </div>
  );
};

export default NewsBoard;
