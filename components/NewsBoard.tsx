
import React, { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, Loader2, RefreshCw, Search, Globe, AlertCircle } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { NewsItem } from '../types.ts';

const NewsBoard: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchLiveNews = async (query: string = "Latest global technology and productivity news") => {
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      if (!process.env.API_KEY) {
        throw new Error("API Key is missing. Please check your environment configuration.");
      }

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // 更簡潔且容錯率高的 Prompt
      const prompt = `Search for 6 latest news articles about: "${query}".
      For each article, provide: Headline, Source name, and URL.
      Format: [HEADLINE] | [SOURCE] | [URL]`;

      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const response = result;
      const responseText = response.text || "";
      let liveNews: NewsItem[] = [];

      // 1. 嘗試解析文字 (處理可能的 Markdown 代碼塊)
      const cleanText = responseText.replace(/```[a-z]*\n?/g, '').replace(/```/g, '');
      const lines = cleanText.split('\n').filter(l => l.includes('|'));
      
      lines.forEach((line, index) => {
        const parts = line.split('|').map(p => p.trim());
        if (parts.length >= 3) {
          const [headline, source, url] = parts;
          // 移除標題開頭的數字或星號
          const cleanHeadline = headline.replace(/^[\d.\-\s*]+/, '');
          if (url.startsWith('http')) {
            liveNews.push({
              id: index,
              title: cleanHeadline,
              source: source,
              url: url,
              date: new Date().toLocaleDateString('ja-JP')
            });
          }
        }
      });

      // 2. 備援與補充：從 Grounding Chunks 提取 (這是系統要求的核心來源)
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const groundItems = chunks
        .filter(chunk => chunk.web && chunk.web.uri)
        .map((chunk, index) => ({
          id: index + 100,
          title: chunk.web.title || "Latest Update",
          source: new URL(chunk.web.uri).hostname.replace('www.', ''),
          url: chunk.web.uri,
          date: new Date().toLocaleDateString('ja-JP')
        }));

      // 合併兩者，以 URL 為唯一標識去重
      const combined = [...liveNews, ...groundItems];
      const uniqueNews = combined.filter((v, i, a) => a.findIndex(t => t.url === v.url) === i);

      if (uniqueNews.length === 0) {
        setErrorMessage("未找到相關新聞，請嘗試更換關鍵字。");
      } else {
        setNews(uniqueNews.slice(0, 6));
      }

    } catch (error: any) {
      console.error("News Fetch Error:", error);
      setErrorMessage(error.message || "連線至 Gemini 時發生錯誤");
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
    <div className="h-full flex flex-col bg-white/40 backdrop-blur-xl rounded-lg border border-white/60 shadow-sm overflow-hidden group hover:bg-white/50 transition-all duration-500">
      
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
                <Globe className="w-2 h-2" /> Google Search API
              </span>
            </div>
          </div>
          <button 
            onClick={() => fetchLiveNews(searchQuery || undefined)} 
            disabled={isLoading}
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
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜尋新聞、科技趨勢..."
            className="w-full bg-white/40 border border-white/50 rounded-xl pl-9 pr-4 py-2 text-xs text-zen-text outline-none focus:bg-white/80 focus:border-zen-matcha/30 transition-all"
          />
        </form>
      </div>

      {/* List Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {isLoading ? (
          <div className="h-full flex flex-col items-center justify-center gap-3 text-zen-text/30">
            <Loader2 className="w-8 h-8 animate-spin text-zen-matcha" />
            <span className="text-[10px] font-bold tracking-widest uppercase animate-pulse">正在從網路選取資訊...</span>
          </div>
        ) : errorMessage ? (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center gap-4">
            <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
              <AlertCircle className="w-6 h-6 text-red-400 mx-auto mb-2" />
              <p className="text-xs text-red-600 font-medium">{errorMessage}</p>
            </div>
            <button 
              onClick={() => fetchLiveNews()}
              className="text-[10px] font-bold uppercase tracking-widest text-zen-matcha hover:underline"
            >
              嘗試重新載入
            </button>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default NewsBoard;
