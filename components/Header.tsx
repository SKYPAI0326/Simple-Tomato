
import React, { useState, useEffect } from 'react';
import { Cloud, Sun, Thermometer, Wind, Loader2, CloudRain, CloudLightning, Info } from 'lucide-react';
import { WeatherData } from '../types.ts';

const Header: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchWeather = async (lat: number = 25.03, lon: number = 121.56) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,weather_code`
      );
      const data = await response.json();
      const current = data.current;
      
      const getCondition = (code: number) => {
        if (code === 0) return "晴朗 Clear";
        if (code <= 3) return "多雲 Cloudy";
        if (code >= 95) return "雷雨 Stormy";
        if (code >= 51) return "有雨 Rainy";
        return "陰天 Overcast";
      };

      setWeather({
        location: "",
        condition: getCondition(current.weather_code),
        temp: Math.round(current.temperature_2m),
        feelsLike: Math.round(current.apparent_temperature),
      });
    } catch (error) {
      console.error("Weather fetch failed:", error);
      setWeather({
        location: "",
        condition: "連線異常",
        temp: 0,
        feelsLike: 0,
      });
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
    if (condition.includes("晴")) return <Sun className="w-5 h-5 text-orange-400" />;
    if (condition.includes("雨")) return <CloudRain className="w-5 h-5 text-blue-400" />;
    if (condition.includes("雷")) return <CloudLightning className="w-5 h-5 text-yellow-500" />;
    return <Cloud className="w-5 h-5 text-slate-400" />;
  };

  return (
    <div className="h-full flex flex-col justify-between text-zen-text">
      <div className="flex justify-between items-start w-full">
        <div className="flex flex-col">
          <span className="text-6xl font-light tracking-tighter leading-none mb-4">{formattedTime}</span>
          <span className="text-sm font-medium opacity-50 tracking-widest uppercase">{formattedDate}</span>
        </div>

        {/* 右上角：體感溫度卡片 */}
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
              <div className="flex flex-col leading-tight items-end">
                <div className="flex items-center gap-1 text-[13px] font-bold text-zen-matcha">
                  <Thermometer className="w-3.5 h-3.5" />
                  <span>{weather.feelsLike}°</span>
                </div>
                <div className="text-[9px] opacity-40 font-bold uppercase tracking-wider whitespace-nowrap">
                   Apparent
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 左下角：實際天氣與氣溫 */}
      <div className="flex justify-between items-end mt-4">
        <div className="flex flex-col gap-1">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-zen-text opacity-40 flex items-center gap-2">
            <Info className="w-3 h-3" />
            Live Atmosphere / 當前氣候
          </div>
          <div className="text-xs font-bold text-zen-text/80 flex items-center gap-2">
             <span className="tracking-widest">{isLoading ? "讀取中..." : weather?.condition}</span>
             {!isLoading && <span className="w-1 h-1 bg-zen-text/20 rounded-full" />}
             {!isLoading && <span className="font-bold text-zen-matcha">{weather?.temp}°C</span>}
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-2 opacity-20">
          <Wind className="w-4 h-4" />
          <div className="w-16 h-px bg-zen-text/30 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default Header;
