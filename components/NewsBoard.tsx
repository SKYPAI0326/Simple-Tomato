
import React, { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, Loader2, RefreshCw, Search, Globe, AlertCircle } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { NewsItem } from '../types.ts';

const NewsBoard: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [status, setStatus] = useState<'idle' | 'searching' | 'error'>('idle');

  const fetchLiveNews = async (query: string = "Latest global technology and productivity news") => {
    setIsLoading(true);
    setStatus('searching');
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      
      // 改良後的 Prompt，強制要求特定格式，這比純靠 Metadata 穩定
      const prompt = `Please search for the latest news about: "${query}". 
      List 6 specific article headlines with their source and URL. 
      Format each line strictly as: [HEADLINE] | [SOURCE] | [URL]
      Example: SpaceX launches new satellite | TechCrunch | https://techcrunch.com/article
      Ensure headlines are descriptive article titles, not just website names.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const responseText = response.text || "";
      let liveNews: NewsItem[] = [];

      // 1. 解析 AI 生成的文字內容 (這通常包含最好的標題)
      const lines = responseText.split('\n');
      lines.forEach((line, index) => {
        if (line.includes('|')) {
          const parts = line.split('|').map(p => p.trim().replace(/^[\d.\-\s*]+/, ''));
          if (parts.length >= 3) {
            const [headline, source, url] = parts;
            if (url.startsWith('http')) {
              liveNews.push({
                id: index,
                title: headline,
                source: source,
                url: url,
                date: new Date().toLocaleDateString('ja-JP')
              });
            }
          }
        }
      });

      // 2. 如果文字解析失敗，嘗試從 Grounding Chunks 提取 (備援)
      if (liveNews.length === 0) {
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        liveNews = chunks
          .filter(chunk => chunk.web)
          .map((chunk, index) => ({
            id: index + 100,
            title: chunk.web.title || "Latest Update",
            source: new URL(chunk.web.uri).hostname.replace('www.', ''),
            url: chunk.web.uri,
            date: new Date().toLocaleDateString('ja-JP')
          }));
      }

      // 移除重複項並過濾無效標題
      const finalNews = liveNews
        .filter(item => item.title && item.title.length > 5)
        .filter((v, i, a) => a.findIndex(t => (t.url === v.url)) === i);

      setNews(finalNews.slice(0, 6));
      setStatus('idle');
    } catch (error) {
      console.error("AI Fetch failed:", error);
      setStatus('error');
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

  const openNews = (url: string) => {
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
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
                <Globe className="w-2 h-2" /> Real-time search
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
            placeholder="搜尋具體新聞主題..."
            className="w-full bg-white/40 border border-white/50 rounded-xl pl-9 pr-4 py-2 text-xs text-zen-text outline-none focus:bg-white/80 focus:border-zen-matcha/30 transition-all"
          />
        </form>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {isLoading ? (
          <div className="h-full flex flex-col items-center justify-center gap-3 text-zen-text/30">
            <Loader2 className="w-8 h-8 animate-spin text-zen-matcha" />
            <span className="text-[10px] font-bold tracking-widest uppercase animate-pulse">正在精選文章標題...</span>
          </div>
        ) : news.length > 0 ? (
          news.map((item) => (
            <div 
              key={item.url} 
              onClick={() => openNews(item.url)}
              className="p-4 rounded-2xl bg-white/20 hover:bg-white/90 transition-all duration-300 cursor-pointer group/item border border-transparent hover:border-white/80 hover:shadow-md"
            >
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-start gap-3">
                  <h3 className="text-[14px] font-bold text-zen-text leading-[1.5] group-hover/item:text-zen-matcha transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <ExternalLink className="w-3.5 h-3.5 text-zen-matcha opacity-0 group-hover/item:opacity-100 shrink-0 mt-1 transition-all" />
                </div>
                <div className="flex items-center justify-between text-[10px] font-bold tracking-wider uppercase opacity-40">
                  <span className="bg-black/5 px-2 py-0.5 rounded-md truncate max-w-[120px]">{item.source}</span>
                  <span>{item.date}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center opacity-30 text-xs italic gap-4">
             <p>找不到新聞文章，請試試別的關鍵字。</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsBoard;
