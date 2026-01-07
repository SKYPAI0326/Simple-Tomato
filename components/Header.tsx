import React, { useState, useEffect } from 'react';
import { Cloud, Sun, MapPin, Thermometer, Wind, Loader2, CloudRain, CloudLightning, CloudSnow } from 'lucide-react';
// 確保型別定義檔案存在，若無可刪除這行 import 並將下方 weather 狀態設為 any
import { WeatherData } from '../types.ts'; 

const Header: React.FC = () => {
  const [time, setTime] = useState(new Date());
  // 如果沒有 types.ts，這裡可以改成 <any | null>
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. 時間邏輯 (原本就是真實的，保留)
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. 真實天氣獲取邏輯 (改用 Open-Meteo API)
  const fetchWeather = async (lat?: number, lon?: number) => {
    setIsLoading(true);
    try {
      // 如果沒有座標，預設為台北市 (25.0330, 121.5654)
      const latitude = lat || 25.0330;
      const longitude = lon || 121.5654;

      // 呼叫 Open-Meteo API (免費、免 Key、支援 https)
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`
      );

      if (!response.ok) throw new Error('Weather API failed');

      const data = await response.json();
      const current = data.current;
      
      // 解析 WMO 天氣代碼 (將數字轉為文字描述)
      const code = current.weather_code;
      let conditionText = "晴朗";
      if (code >= 1 && code <= 3) conditionText = "多雲";
      if (code >= 45 && code <= 48) conditionText = "有霧";
      if (code >= 51 && code <= 67) conditionText = "細雨";
      if (code >= 71 && code <= 77) conditionText = "下雪";
      if (code >= 80 && code <= 82) conditionText = "陣雨";
      if (code >= 95) conditionText = "雷雨";

      setWeather({
        location: lat ? "目前位置" : "台北市", // 若有定位則顯示目前位置
        condition: conditionText,
        temp: Math.round(current.temperature_2m),
        feelsLike: Math.round(current.apparent_temperature),
        weatherCode: code // 儲存代碼以便顯示圖示
      });

    } catch (error) {
      console.error("Weather fetch failed:", error);
      // 萬一 API 真的掛了，至少顯示一個預設值，而不是報錯
      setWeather({
        location: "連線異常",
        condition: "--",
        temp: 0,
        feelsLike: 0
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 3. 定位與自動更新邏輯
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
        (err) => {
          console.warn("Location access denied, using default.");
          fetchWeather(); // 拒絕定位時使用預設值
        }
      );
    } else {
      fetchWeather();
    }
    
    // 每 30 分鐘更新一次天氣
    const interval = setInterval(() => fetchWeather(), 1800000);
    return () => clearInterval(interval);
  }, []);

  // 格式化時間 (日文格式)
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

  // 4. 圖示顯示邏輯 (根據 WMO 代碼回傳對應圖示)
  const getWeatherIcon = (code?: number) => {
    if (code === undefined) return <Cloud className="w-5 h-5 text-slate-400" />;
    
    // 0: 晴天
    if (code === 0) return <Sun className="w-5 h-5 text-orange-400" />;
    // 1-3: 多雲
    if (code >= 1 && code <= 3) return <Cloud className="w-5 h-5 text-slate-400" />;
    // 45-48: 霧
    if (code >= 45 && code <= 48) return <Wind className="w-5 h-5 text-gray-400" />;
    // 51-67, 80-82: 雨
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return <CloudRain className="w-5 h-5 text-blue-400" />;
    // 71-77: 雪
    if (code >= 71 && code <= 77) return <CloudSnow className="w-5 h-5 text-blue-200" />;
    // 95+: 雷雨
    if (code >= 95) return <CloudLightning className="w-5 h-5 text-yellow-500" />;
    
    return <Cloud className="w-5 h-5 text-slate-400" />;
  };

  return (
    <div className="h-full flex flex-col justify-between text-zen-text">
      {/* Top Section */}
      <div className="flex justify-between items-start w-full">
        <div className="flex flex-col">
          <span className="text-6xl font-light tracking-tighter leading-none mb-4">{formattedTime}</span>
          <span className="text-sm font-medium opacity-50 tracking-widest uppercase">{formattedDate}</span>
        </div>

        {/* Real-time Weather Pill */}
        <div className="flex flex-col items-end">
          <div className="bg-white/50 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/60 shadow-sm flex items-center gap-3 hover:bg-white/80 transition-all duration-300">
            <div className="p-2 bg-white/80 rounded-xl shadow-inner">
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-zen-matcha" />
              ) : (
                // 這裡改用 weatherCode 判斷
                getWeatherIcon(weather?.weatherCode)
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
            <span className="tracking-tight">{isLoading ? "定位中..." : weather?.location}</span>
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
