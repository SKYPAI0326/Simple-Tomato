
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, StickyNote } from 'lucide-react';
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
    <div className="h-full flex flex-col p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <StickyNote className="w-4 h-4 opacity-70" />
          <h2 className="text-xs font-bold uppercase tracking-widest opacity-70">Memo / 隨手筆記</h2>
        </div>
      </div>

      <form onSubmit={addMemo} className="flex gap-2 mb-6">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="New note... / 新筆記..."
          className="flex-1 bg-white/20 border-none rounded-lg px-4 py-2 placeholder:text-white/40 outline-none text-sm focus:bg-white/30 transition-all"
        />
        <button
          type="submit"
          className="bg-white text-zen-wood p-2 rounded-lg hover:scale-105 active:scale-95 transition-all"
        >
          <Plus className="w-5 h-5" />
        </button>
      </form>

      <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
        {memos.length === 0 ? (
          <div className="h-full flex items-center justify-center opacity-30 text-xs italic">
            No notes yet. / 尚無內容。
          </div>
        ) : (
          memos.map((memo) => (
            <div
              key={memo.id}
              className="group bg-white/10 p-3 rounded-lg flex justify-between items-start gap-2 hover:bg-white/20 transition-all border border-white/5"
            >
              <p className="text-xs flex-1 leading-relaxed">{memo.content}</p>
              <button
                onClick={() => deleteMemo(memo.id)}
                className="text-white/40 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MemoBoard;
