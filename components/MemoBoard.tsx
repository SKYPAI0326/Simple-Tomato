
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, StickyNote, Send } from 'lucide-react';
import { Memo } from '../types';

const MEMO_STORAGE_KEY = 'simple_tomato_memos';

const MemoBoard: React.FC = () => {
  const [memos, setMemos] = useState<Memo[]>(() => {
    const saved = localStorage.getItem(MEMO_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');

  useEffect(() => {
    localStorage.setItem(MEMO_STORAGE_KEY, JSON.stringify(memos));
  }, [memos]);

  const addMemo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const newMemo: Memo = {
      id: crypto.randomUUID(),
      content: input,
      createdAt: Date.now(),
    };
    setMemos([newMemo, ...memos]);
    setInput('');
  };

  const deleteMemo = (id: string) => {
    setMemos(memos.filter((m) => m.id !== id));
  };

  return (
    <div className="h-full flex flex-col text-white">
      {/* Header - 嚴格控制 px-6 */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 bg-white/10 rounded-lg">
            <StickyNote className="w-3.5 h-3.5 text-white/80" />
          </div>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
            Zen Memos / 隨手筆記
          </h2>
        </div>
      </div>

      {/* Input Form - 嚴格與 Header 同寬 */}
      <div className="px-6 mb-6">
        <form onSubmit={addMemo} className="flex gap-2 group/form">
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="此刻的想法... / New note..."
              className="w-full bg-black/10 border border-white/10 rounded-xl px-4 py-3 placeholder:text-white/20 outline-none text-sm focus:bg-black/20 focus:border-white/30 transition-all duration-300 shadow-inner"
            />
          </div>
          <button
            type="submit"
            className="bg-white text-zen-wood px-4 rounded-xl hover:bg-white/90 active:scale-95 transition-all shadow-lg flex items-center justify-center group"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </form>
      </div>

      {/* List Area - 增加 pr-6 以平衡滾動條空間 */}
      <div className="flex-1 overflow-y-auto pl-6 pr-6 pb-6 space-y-2.5 custom-scrollbar">
        {memos.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-20 text-[10px] uppercase tracking-widest gap-2 py-10">
            <div className="w-12 h-px bg-white/50" />
            <span>Empty / 空無一物</span>
            <div className="w-12 h-px bg-white/50" />
          </div>
        ) : (
          memos.map((memo) => (
            <div
              key={memo.id}
              className="group bg-white/10 p-4 rounded-xl flex justify-between items-start gap-3 hover:bg-white/15 transition-all border border-white/5 hover:border-white/10"
            >
              <p className="text-xs flex-1 leading-[1.6] font-medium text-white/90 select-none">
                {memo.content}
              </p>
              <button
                onClick={() => deleteMemo(memo.id)}
                className="text-white/30 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-all duration-300 -mr-1 -mt-1 p-1 hover:bg-white/10 rounded-lg"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MemoBoard;
