
import React, { useState, useEffect } from 'react';
import { Cloud, Sun, MapPin, Thermometer, Wind, Loader2, CloudRain, CloudLightning } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { WeatherData } from '../types.ts';

const Header: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchWeather = async (lat?: number, lon?: number) => {
    setIsLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const locationPrompt = lat && lon 
        ? `緯度 ${lat}, 經度 ${lon} 的目前位置` 
        : "台北市";

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `請搜尋「${locationPrompt}」的即時天氣資訊。
        請提供以下 JSON 格式數據（僅提供 JSON）：
        {
          "location": "城市名稱 (含區域)",
          "condition": "天氣狀況描述 (例如：晴朗、多雲、有雨)",
          "temp": 目前溫度數值,
          "feelsLike": 體感溫度數值
        }`,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text || "";
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[0]);
        setWeather(data);
      } else {
        setWeather({
          location: "台北市",
          condition: "數據讀取中",
          temp: 25,
          feelsLike: 27
        });
      }
    } catch (error) {
      console.error("Weather fetch failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
        () => fetchWeather()
      );
    } else {
      fetchWeather();
    }
    
    const interval = setInterval(() => fetchWeather(), 1800000);
    return () => clearInterval(interval);
  }, []);

  const formattedTime = time.toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  const formattedDate = time.toLocaleDateString('ja-JP', {
    month: 'short',
    day: 'numeric',
    weekday: 'short'
  });

  const getWeatherIcon = (condition: string = "") => {
    const c = condition.toLowerCase();
    if (c.includes("晴") || c.includes("sun")) return <Sun className="w-5 h-5 text-orange-400" />;
    if (c.includes("雨") || c.includes("rain")) return <CloudRain className="w-5 h-5 text-blue-400" />;
    if (c.includes("電") || c.includes("storm")) return <CloudLightning className="w-5 h-5 text-yellow-500" />;
    return <Cloud className="w-5 h-5 text-slate-400" />;
  };

  return (
    <div className="h-full flex flex-col justify-between text-zen-text">
      {/* Top Section - Aligned to Start (Top) */}
      <div className="flex justify-between items-start w-full">
        <div className="flex flex-col">
          {/* Time digits with leading-none to ensure alignment starts from the top of character box */}
          <span className="text-6xl font-light tracking-tighter leading-none mb-4">{formattedTime}</span>
          <span className="text-sm font-medium opacity-50 tracking-widest uppercase">{formattedDate}</span>
        </div>

        {/* Real-time Weather Pill - Now Top-Aligned */}
        <div className="flex flex-col items-end">
          <div className="bg-white/50 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/60 shadow-sm flex items-center gap-3 hover:bg-white/80 transition-all duration-300">
            <div className="p-2 bg-white/80 rounded-xl shadow-inner">
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-zen-matcha" />
              ) : (
                getWeatherIcon(weather?.condition)
              )}
            </div>
            {!isLoading && weather && (
              <div className="flex flex-col leading-tight">
                <div className="flex items-center gap-1 text-[13px] font-bold text-zen-matcha">
                  <Thermometer className="w-3.5 h-3.5" />
                  <span>{weather.feelsLike}°</span>
                </div>
                <div className="text-[9px] opacity-40 font-bold uppercase tracking-wider text-right">Apparent</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex justify-between items-end mt-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-zen-text/80">
            <MapPin className="w-3 h-3 text-zen-matcha animate-pulse" />
            <span className="tracking-tight">{isLoading ? "定位中..." : (weather?.location || "台北市")}</span>
          </div>
          <div className="text-[10px] opacity-50 font-medium tracking-wide flex items-center gap-2">
             <span>{isLoading ? "讀取數據..." : weather?.condition}</span>
             {!isLoading && <span className="w-1 h-1 bg-zen-text/20 rounded-full" />}
             {!isLoading && <span className="font-bold text-zen-text">{weather?.temp}°C</span>}
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-2 opacity-30">
          <Wind className="w-4 h-4" />
          <div className="w-16 h-px bg-zen-text/30 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default Header;
