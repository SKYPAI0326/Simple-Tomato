
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Target } from 'lucide-react';
import { TimerMode, TimerState } from '../types.ts';
import { FOCUS_DURATION, BREAK_DURATION } from '../constants.ts';

const STORAGE_KEY = 'simple_tomato_timer_state';

// 咖啡蒸氣小組件
const CoffeeSteam: React.FC = () => (
  <div className="absolute -top-8 flex gap-1 opacity-60">
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className="w-1 h-6 bg-white rounded-full blur-[1px] animate-steam"
        style={{
          animationDelay: `${i * 0.4}s`,
          animationDuration: '2s'
        }}
      />
    ))}
    <style>{`
      @keyframes steam {
        0% { transform: translateY(0) scaleX(1) scaleY(1); opacity: 0; }
        15% { opacity: 0.6; }
        50% { transform: translateY(-15px) scaleX(1.5) scaleY(0.8); opacity: 0.3; }
        100% { transform: translateY(-30px) scaleX(2) scaleY(0.5); opacity: 0; }
      }
      .animate-steam {
        animation: steam linear infinite;
      }
    `}</style>
  </div>
);

/**
 * Zen 流轉視覺器
 * 結合線條、圓點與圓環的多層次動畫
 */
const ZenVisualizer: React.FC<{ active: boolean }> = ({ active }) => (
  <div className="relative flex flex-col items-center mt-10 w-48 h-12 justify-center">
    {/* 背景長線條 */}
    <div className={`h-[1px] bg-white/20 transition-all duration-1000 rounded-full ${active ? 'w-full' : 'w-16'}`} />
    
    {/* 核心流動線條 */}
    <div className={`absolute h-[2px] bg-white transition-all duration-1000 rounded-full blur-[0.5px] ${active ? 'w-32 opacity-60 animate-zen-line' : 'w-0 opacity-0'}`} />

    {/* 左右脈衝圓環 */}
    <div className="absolute w-full flex justify-between px-4">
      {[0, 1].map((i) => (
        <div key={i} className={`relative flex items-center justify-center`}>
           <div className={`absolute w-3 h-3 border border-white/40 rounded-full ${active ? 'animate-zen-ping' : 'opacity-0'}`} style={{ animationDelay: `${i * 0.5}s` }} />
           <div className={`w-1 h-1 bg-white rounded-full ${active ? 'opacity-100' : 'opacity-20'}`} />
        </div>
      ))}
    </div>

    {/* 漂浮粒子點 */}
    <div className="absolute flex gap-4">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={`w-1 h-1 rounded-full bg-white/80 transition-all duration-700 ${active ? 'animate-zen-float' : 'opacity-0 translate-y-2'}`}
          style={{ animationDelay: `${i * 0.2}s`, left: `${i * 20}%` }}
        />
      ))}
    </div>

    <style>{`
      @keyframes zen-line {
        0%, 100% { transform: scaleX(0.8); opacity: 0.3; }
        50% { transform: scaleX(1.2); opacity: 0.7; }
      }
      @keyframes zen-ping {
        0% { transform: scale(1); opacity: 0.8; }
        100% { transform: scale(4); opacity: 0; }
      }
      @keyframes zen-float {
        0%, 100% { transform: translateY(0) scale(1); opacity: 0.4; }
        50% { transform: translateY(-12px) scale(1.5); opacity: 0.9; }
      }
      .animate-zen-line { animation: zen-line 3s ease-in-out infinite; }
      .animate-zen-ping { animation: zen-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite; }
      .animate-zen-float { animation: zen-float 2.5s ease-in-out infinite; }
    `}</style>
  </div>
);

const Timer: React.FC = () => {
  const [state, setState] = useState<TimerState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.isActive && parsed.endTime) {
         const now = Date.now();
         if (parsed.endTime < now) {
            return { ...parsed, isActive: false, endTime: null, timeLeftWhenPaused: parsed.mode === TimerMode.FOCUS ? FOCUS_DURATION : BREAK_DURATION };
         }
      }
      return parsed;
    }
    return {
      mode: TimerMode.FOCUS,
      isActive: false,
      endTime: null,
      timeLeftWhenPaused: FOCUS_DURATION,
    };
  });

  const [displayTime, setDisplayTime] = useState(0);
  const animationRef = useRef<number>();

  const saveState = useCallback((newState: TimerState) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    setState(newState);
  }, []);

  const updateDisplay = useCallback(() => {
    if (state.isActive && state.endTime) {
      const now = Date.now();
      const diff = state.endTime - now;
      if (diff <= 0) {
        const nextMode = state.mode === TimerMode.FOCUS ? TimerMode.BREAK : TimerMode.FOCUS;
        const nextDuration = nextMode === TimerMode.FOCUS ? FOCUS_DURATION : BREAK_DURATION;
        saveState({
          mode: nextMode,
          isActive: false,
          endTime: null,
          timeLeftWhenPaused: nextDuration,
        });
        setDisplayTime(nextDuration);
      } else {
        setDisplayTime(diff);
        animationRef.current = requestAnimationFrame(updateDisplay);
      }
    } else {
      setDisplayTime(state.timeLeftWhenPaused);
    }
  }, [state, saveState]);

  useEffect(() => {
    updateDisplay();
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [updateDisplay]);

  const toggleTimer = () => {
    if (state.isActive) {
      saveState({ ...state, isActive: false, endTime: null, timeLeftWhenPaused: displayTime });
    } else {
      saveState({ ...state, isActive: true, endTime: Date.now() + state.timeLeftWhenPaused });
    }
  };

  const resetTimer = () => {
    const duration = state.mode === TimerMode.FOCUS ? FOCUS_DURATION : BREAK_DURATION;
    saveState({ ...state, isActive: false, endTime: null, timeLeftWhenPaused: duration });
  };

  const switchMode = (newMode: TimerMode) => {
    const duration = newMode === TimerMode.FOCUS ? FOCUS_DURATION : BREAK_DURATION;
    saveState({ mode: newMode, isActive: false, endTime: null, timeLeftWhenPaused: duration });
  };

  const minutes = Math.floor(displayTime / 1000 / 60);
  const seconds = Math.floor((displayTime / 1000) % 60);

  return (
    <div className="flex flex-col items-center w-full">
      {/* 模式切換器 */}
      <div className="flex gap-2 mb-10 bg-black/10 p-1.5 rounded-full backdrop-blur-sm">
        <button
          onClick={() => switchMode(TimerMode.FOCUS)}
          className={`px-5 py-2 rounded-full text-[10px] font-bold transition-all duration-500 flex items-center gap-2 ${
            state.mode === TimerMode.FOCUS ? 'bg-white text-zen-matcha shadow-sm' : 'text-white/60 hover:text-white'
          }`}
        >
          <Target className={`w-3.5 h-3.5 ${state.isActive && state.mode === TimerMode.FOCUS ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
          <span>FOCUS / 專注</span>
        </button>
        <button
          onClick={() => switchMode(TimerMode.BREAK)}
          className={`px-5 py-2 rounded-full text-[10px] font-bold transition-all duration-500 flex items-center gap-2 ${
            state.mode === TimerMode.BREAK ? 'bg-white text-zen-matcha shadow-sm' : 'text-white/60 hover:text-white'
          }`}
        >
          <div className="relative">
            {state.isActive && state.mode === TimerMode.BREAK && <CoffeeSteam />}
            <Coffee className={`w-3.5 h-3.5 ${state.isActive && state.mode === TimerMode.BREAK ? 'animate-bounce' : ''}`} />
          </div>
          <span>BREAK / 休息</span>
        </button>
      </div>

      {/* 時間顯示 */}
      <div className={`text-8xl font-light tracking-tighter mb-10 tabular-nums transition-all duration-700 ${state.isActive ? 'scale-110' : 'scale-100 opacity-90'}`}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>

      {/* 控制按鈕區 */}
      <div className="flex flex-col items-center">
        <div className="flex gap-6 items-center">
          <button
            onClick={toggleTimer}
            className="w-20 h-20 flex items-center justify-center bg-white text-zen-matcha rounded-full shadow-xl hover:scale-105 active:scale-95 transition-all group"
          >
            {state.isActive ? (
              <Pause className="w-10 h-10 transition-transform group-hover:rotate-90" />
            ) : (
              <Play className="w-10 h-10 ml-1 transition-transform group-hover:scale-110" />
            )}
          </button>
          
          <button
            onClick={resetTimer}
            className="w-16 h-16 flex items-center justify-center bg-white/10 text-white rounded-full border border-white/20 hover:bg-white/25 transition-all active:scale-90 group"
          >
            <RotateCcw className="w-6 h-6 group-hover:-rotate-180 transition-transform duration-700" />
          </button>
        </div>

        {/* 底部升級版視覺視覺器 */}
        <ZenVisualizer active={state.isActive} />
      </div>
    </div>
  );
};

export default Timer;
