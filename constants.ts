
import { NewsItem, WeatherData } from './types';

export const FOCUS_DURATION = 25 * 60 * 1000;
export const BREAK_DURATION = 5 * 60 * 1000;

export const MOCK_WEATHER: WeatherData = {
  location: 'Taipei / 台北',
  condition: 'Sunny / 晴朗',
  temp: 26,
};

export interface ZenQuote {
  ja: string;
  en: string;
  tw: string;
}

export const ZEN_QUOTES: ZenQuote[] = [
  {
    ja: "一期一會",
    en: "Treasure every meeting, for it will never recur.",
    tw: "珍惜每個瞬間，因為它永不再來。"
  },
  {
    ja: "日日是好日",
    en: "Every day is a good day.",
    tw: "放下執著，每一天都是生命中最好的日子。"
  },
  {
    ja: "知足常樂",
    en: "Contentment is natural wealth.",
    tw: "知足便是最富有的狀態，能從平凡中見喜悅。"
  },
  {
    ja: "初心忘るべからず",
    en: "Don't forget your beginner's mind.",
    tw: "始終保持初學者的好奇與謙卑，莫忘初衷。"
  },
  {
    ja: "行雲流水",
    en: "Like drifting clouds and flowing water.",
    tw: "順應自然，不執著於定態，心境如流雲流水般自在。"
  },
  {
    ja: "和敬清寂",
    en: "Harmony, Respect, Purity, Tranquility.",
    tw: "在和諧與尊敬中尋找純淨，達到內心的寧靜。"
  }
];

export const MOCK_NEWS: NewsItem[] = [
  {
    id: 1,
    title: 'Mindfulness Research / 冥想與腦科學最新研究',
    category: 'Mindfulness / 正念',
    date: '2024-05-20',
    summary: 'Daily meditation enhances stress resilience and activates the prefrontal cortex. / 每日冥想可增強抗壓性，並活化大腦前額葉皮質。'
  },
  {
    id: 2,
    title: 'Future of AI / AI 與人類共生的未來展望',
    category: 'Tech / 科技',
    date: '2024-05-18',
    summary: 'Generative AI is becoming a standard tool for personal creativity. / 生成式 AI 正成為擴展個人創意標配工具。'
  },
  {
    id: 3,
    title: 'Zen Philosophy in Tech / 禪宗哲學在矽谷重新崛起',
    category: 'Zen / 禪意',
    date: '2024-05-15',
    summary: 'The "Here and Now" philosophy helps combat digital information overload. / 「此時此刻」的哲學有助於對抗數位資訊過載帶來的焦慮。'
  },
  {
    id: 4,
    title: 'Coding Trends 2024 / 2024 程式開發新趨勢',
    category: 'Tech / 科技',
    date: '2024-05-12',
    summary: 'Modern languages focus on safety and performance for large systems. / 現代程式語言更專注於大型系統的安全與效能平衡。'
  },
  {
    id: 5,
    title: 'Digital Detox Guide / 數位排毒：週末放下手機的建議',
    category: 'Life / 生活',
    date: '2024-05-10',
    summary: 'Reconnect with nature to give your brain a well-deserved break. / 重新與自然連結，讓大腦獲得應有的深層休息。'
  }
];
