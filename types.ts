
export interface Memo {
  id: string;
  content: string;
  createdAt: number;
}

export interface NewsItem {
  id: number;
  title: string;
  category: string;
  date: string;
  summary: string;
}

export enum TimerMode {
  FOCUS = 'FOCUS',
  BREAK = 'BREAK',
}

export interface TimerState {
  mode: TimerMode;
  isActive: boolean;
  endTime: number | null;
  timeLeftWhenPaused: number;
}

export interface WeatherData {
  location: string;
  condition: string;
  temp: number;
  feelsLike?: number;
}
