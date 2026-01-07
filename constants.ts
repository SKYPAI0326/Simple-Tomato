
import { WeatherData, NewsItem } from './types';

export const FOCUS_DURATION = 25 * 60 * 1000;
export const BREAK_DURATION = 5 * 60 * 1000;

export const MOCK_WEATHER: WeatherData = {
  location: 'Taipei / 台北',
  condition: 'Sunny / 晴朗',
  temp: 26,
};

export const MOCK_NEWS: NewsItem[] = [
  { 
    id: 1, 
    title: "數位極簡主義：如何在雜訊中找回專注力", 
    source: "Zen Tech", 
    url: "https://www.bnext.com.tw/", 
    date: "2024-03-20" 
  },
  { 
    id: 2, 
    title: "SpaceX 星艦計畫取得新突破，重塑太空探索", 
    source: "TechDaily", 
    url: "https://techcrunch.com/", 
    date: "2024-03-19" 
  },
  { 
    id: 3, 
    title: "正念冥想對工程師大腦的可塑性影響研究", 
    source: "Mind Science", 
    url: "https://www.scientificamerican.com/", 
    date: "2024-03-18" 
  },
  { 
    id: 4, 
    title: "AI 時代的程式設計哲學：從 Coding 到 Prompting", 
    source: "DevLog", 
    url: "https://medium.com/", 
    date: "2024-03-18" 
  },
  { 
    id: 5, 
    title: "辦公桌上的微型花園：提升工作效率的綠色佈局", 
    source: "LifeStyle", 
    url: "https://vocus.cc/", 
    date: "2024-03-17" 
  }
];

export interface ZenQuote {
  ja: string;
  en: string;
  tw: string;
}

export const ZEN_QUOTES: ZenQuote[] = [
  { ja: "一期一會", en: "Treasure every meeting, for it will never recur.", tw: "珍惜每個瞬間，因為它永不再來。" },
  { ja: "日日是好日", en: "Every day is a good day.", tw: "放下執著，每一天都是生命中最好的日子。" },
  { ja: "知足常樂", en: "Contentment is natural wealth.", tw: "知足便是最富有的狀態，能從平凡中見喜悅。" },
  { ja: "初心忘るべからず", en: "Don't forget your beginner's mind.", tw: "莫忘初衷。" },
  { ja: "自然", en: "Nature, or being as one is.", tw: "順應自然，不造作。" },
  { ja: "無事", en: "No business; nothing special.", tw: "心中無事，便是好時節。" },
  { ja: "明鏡止水", en: "Clear and serene as a polished mirror and still water.", tw: "心如明鏡，平靜如水。" },
  { ja: "一石二鳥", en: "Two birds with one stone.", tw: "一箭雙鵰，在專注中尋求效率。" },
  { ja: "八風吹不動", en: "Unmoved by the eight winds.", tw: "不為榮、辱、利、衰等外境所動。" },
  { ja: "冷暖自知", en: "Knowing for oneself whether the water is warm or cold.", tw: "如人飲水，冷暖自知。" },
  { ja: "放下著", en: "Put it down.", tw: "放下心中的重擔與執著。" },
  { ja: "行雲流水", en: "Moving like floating clouds and flowing water.", tw: "行動自然流暢，毫無阻滯。" },
  { ja: "照顧腳下", en: "Watch your step.", tw: "腳踏實地，專注於當下的每一步。" },
  { ja: "本來無一物", en: "Originally there is nothing.", tw: "本來無一物，何處惹塵埃。" },
  { ja: "不立文字", en: "Not dependent on words.", tw: "真理不在言語中，在於體悟。" },
  { ja: "直指人心", en: "Pointing directly at the human heart.", tw: "直探本心，看清真實的自己。" },
  { ja: "平常心是道", en: "Ordinary mind is the Way.", tw: "在平凡的日常中體悟真理。" },
  { ja: "萬法歸一", en: "All things return to one.", tw: "萬物歸根，尋求內在的統一。" },
  { ja: "因果報應", en: "Cause and effect.", tw: "種下什麼因，收穫什麼果。" },
  { ja: "溫故知新", en: "To learn new things by reviewing old ones.", tw: "溫故而知新。" },
  { ja: "自業自得", en: "One's own act, one's own profit.", tw: "自作自受，對自己的行為負責。" },
  { ja: "空即是色", en: "Emptiness is form.", tw: "色即是空，空即是色。" },
  { ja: "如實知自心", en: "Knowing one's mind as it truly is.", tw: "如實看見自己的內心。" },
  { ja: "悟", en: "Enlightenment; awakening.", tw: "豁然開朗的覺醒。" },
  { ja: "閑古鳥", en: "The voice of a cuckoo in a quiet mountain.", tw: "在喧囂中尋找寧靜的聲音。" },
  { ja: "一塵不染", en: "Not a speck of dust.", tw: "純淨無瑕，不被外物所染。" },
  { ja: "心外無別法", en: "There is no truth outside of the mind.", tw: "萬法唯心造。" },
  { ja: "大巧若拙", en: "Great skill seems like clumsiness.", tw: "真正的智慧往往顯得樸實無華。" },
  { ja: "一即一切", en: "One is all.", tw: "微小的瞬間包含著整個宇宙。" },
  { ja: "無念", en: "No thought.", tw: "超越雜念，回歸純粹的覺知。" },
  { ja: "坐忘", en: "Sitting and forgetting.", tw: "忘卻自我，與世界合一。" },
  { ja: "幽玄", en: "Deep, mysterious grace.", tw: "深邃隱約的美感。" },
  { ja: "侘寂", en: "Wabi-sabi; finding beauty in imperfection.", tw: "在殘缺與簡樸中看見永恆之美。" }
];
