
import React, { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, Loader2, RefreshCw, Search, Globe, Unplug, Sparkles } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { NewsItem } from '../types.ts';

const NewsBoard: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isKeyMissing, setIsKeyMissing] = useState(!process.env.API_KEY);

  const handleConnectAPI = async () => {
    try {
      if ((window as any).aistudio) {
        await (window as any).aistudio.openSelectKey();
        setIsKeyMissing(false);
        setErrorMessage(null);
        fetchLiveNews();
      }
    } catch (e) {
      console.error("Connection failed", e);
    }
  };

  const fetchLiveNews = async (query: string = "Latest global technology and productivity news") => {
    if (!process.env.API_KEY) {
      setIsKeyMissing(true);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // 優化 Prompt，要求更嚴格的格式化列表
      const prompt = `Find 6 most recent and relevant news about: "${query}". 
      Write a concise list where each line follows this exact format:
      [TITLE] | [SOURCE] | [URL]
      
      Example:
      2024 Taipei New Year Countdown Event Guide | Travel Taipei | https://example.com/news1
      
      Only provide the list, no introductory text.`;

      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const responseText = result.text || "";
      const liveNews: NewsItem[] = [];

      // 1. 解析 LLM 輸出的文字 (這部分的標題最準確)
      const lines = responseText.split('\n').filter(line => line.includes('|'));
      lines.forEach((line, index) => {
        const parts = line.split('|').map(p => p.trim());
        if (parts.length >= 3) {
          const [title, source, url] = parts;
          // 清除標題開頭的序號 (如 "1. ")
          const cleanTitle = title.replace(/^[\d.\-\s*]+/, '').replace(/[*#]/g, '').trim();
          if (url.startsWith('http')) {
            liveNews.push({
              id: index,
              title: cleanTitle,
              source: source || "Live News",
              url: url,
              date: new Date().toLocaleDateString('ja-JP')
            });
          }
        }
      });

      // 2. 解析元數據 (作為備用或補充)
      const chunks = result.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const groundItems = chunks
        .filter(chunk => chunk.web && chunk.web.uri)
        .map((chunk, index) => {
          const uri = chunk.web.uri;
          let hostname = "News";
          try { hostname = new URL(uri).hostname.replace('www.', ''); } catch(e) {}
          
          return {
            id: index + 100,
            // 如果元數據的標題太短或看起來像網址，標記為低優先權
            title: chunk.web.title || hostname,
            source: hostname,
            url: uri,
            date: new Date().toLocaleDateString('ja-JP')
          };
        });

      // 重要：優先保留 liveNews (AI 產生的精確標題)
      const combined = [...liveNews, ...groundItems];
      const uniqueNews = combined.filter((v, i, a) => 
        // 根據 URL 去重，保留第一個出現的 (即 liveNews 優先)
        a.findIndex(t => t.url === v.url) === i
      );

      // 過濾掉標題過短或無意義的結果
      const filteredNews = uniqueNews.filter(n => n.title.length > 4);

      if (filteredNews.length === 0) {
        setErrorMessage("暫無相關新聞內容。");
      } else {
        setNews(filteredNews.slice(0, 6));
      }

    } catch (error: any) {
      console.error("News Fetch Error:", error);
      if (error.message?.includes("API key")) {
        setIsKeyMissing(true);
      } else {
        setErrorMessage("無法獲取新聞標題");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveNews();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchLiveNews(searchQuery);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white/40 backdrop-blur-xl rounded-lg border border-white/60 shadow-sm overflow-hidden group hover:bg-white/50 transition-all duration-500 relative">
      
      {/* Header */}
      <div className="p-6 pb-4 border-b border-zen-text/5">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-zen-matcha/10 rounded-xl text-zen-matcha">
              <Newspaper className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-zen-text tracking-wide text-sm">Live Feed</span>
              <span className="text-[9px] uppercase tracking-widest font-bold opacity-30 flex items-center gap-1">
                <Globe className="w-2 h-2" /> AI Sync
              </span>
            </div>
          </div>
          <button 
            onClick={() => fetchLiveNews(searchQuery || undefined)} 
            disabled={isLoading || isKeyMissing}
            className="p-2 hover:bg-black/5 rounded-full transition-colors disabled:opacity-30 group/btn"
          >
            <RefreshCw className={`w-4 h-4 text-zen-text/40 ${isLoading ? 'animate-spin' : 'group-hover/btn:rotate-180 transition-transform duration-500'}`} />
          </button>
        </div>

        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zen-text/30" />
          <input
            type="text"
            value={searchQuery}
            disabled={isKeyMissing}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜尋新聞、趨勢..."
            className="w-full bg-white/40 border border-white/50 rounded-xl pl-9 pr-4 py-2 text-xs text-zen-text outline-none focus:bg-white/80 focus:border-zen-matcha/30 transition-all disabled:opacity-50"
          />
        </form>
      </div>

      {/* List Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {isLoading ? (
          <div className="h-full flex flex-col items-center justify-center gap-3 text-zen-text/30">
            <Loader2 className="w-8 h-8 animate-spin text-zen-matcha" />
            <span className="text-[10px] font-bold tracking-widest uppercase animate-pulse">Analyzing...</span>
          </div>
        ) : news.length > 0 ? (
          news.map((item) => (
            <a 
              key={item.url} 
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 rounded-2xl bg-white/20 hover:bg-white/90 transition-all duration-300 group/item border border-transparent hover:border-white/80 hover:shadow-md"
            >
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-start gap-3">
                  <h3 className="text-[14px] font-bold text-zen-text leading-[1.5] group-hover/item:text-zen-matcha transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <ExternalLink className="w-3.5 h-3.5 text-zen-matcha opacity-0 group-hover/item:opacity-100 shrink-0 mt-1 transition-all" />
                </div>
                <div className="flex items-center justify-between text-[10px] font-bold tracking-wider uppercase opacity-40">
                  <span className="bg-black/5 px-2 py-0.5 rounded-md truncate max-w-[150px]">{item.source}</span>
                  <span>{item.date}</span>
                </div>
              </div>
            </a>
          ))
        ) : !isKeyMissing && (
           <div className="h-full flex flex-col items-center justify-center opacity-20 text-[10px] font-bold tracking-widest uppercase py-10">
            No News Content
          </div>
        )}

        {/* Minimal Connect Overlay when Key is missing */}
        {isKeyMissing && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center transition-all duration-500 z-10">
            <Unplug className="w-6 h-6 text-zen-matcha/40 mb-3" />
            <p className="text-[10px] font-bold tracking-[0.2em] text-zen-text/40 uppercase mb-4">Offline Mode</p>
            <button 
              onClick={handleConnectAPI}
              className="px-6 py-2.5 bg-zen-matcha text-white rounded-full text-[10px] font-bold tracking-widest uppercase shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Sync Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsBoard;
