
import React, { useState, useRef, useEffect } from 'react';
import { GameState, DebateRole } from '../types';

interface Props {
  gameState: GameState;
  onSend: (text: string) => void;
  isLoading: boolean;
  onEnd: (idx: number) => void;
}

const DebateArena: React.FC<Props> = ({ gameState, onSend, isLoading, onEnd }) => {
  const [text, setText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [gameState.messages, isLoading]);

  const current = gameState.players[gameState.turnIndex];

  return (
    <div className="w-full h-screen flex flex-col bg-[#020617] animate-in fade-in duration-700 font-sans">
      {/* High-Impact Top Dashboard */}
      <div className="shrink-0 z-50 glass-dark border-b border-white/5 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-3 items-center gap-4">
          
          {/* Player 1 Stats (Left) */}
          <div className={`flex flex-col items-start transition-all duration-500 ${gameState.turnIndex === 0 ? 'scale-105 opacity-100' : 'opacity-40 grayscale-[0.5]'}`}>
            <div className="flex items-center gap-3 mb-1">
              <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Affirmative</span>
            </div>
            <h3 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tighter truncate w-full">{gameState.players[0].name}</h3>
            <div className="flex items-baseline gap-2 mt-1">
               <span className="text-3xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">{gameState.players[0].score}</span>
               <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">PTS</span>
            </div>
            <button 
              onClick={() => onEnd(0)}
              className={`mt-3 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border ${gameState.endAgreement[0] ? 'bg-red-600 border-red-600 text-white' : 'border-red-500/30 text-red-500 hover:bg-red-500/10'}`}
            >
              {gameState.endAgreement[0] ? 'VOTED END' : 'END DEBATE'}
            </button>
          </div>

          {/* Central Arena Info */}
          <div className="flex flex-col items-center justify-center text-center">
            <h2 className="text-sm font-black italic tracking-tighter text-white/20 mb-2">ARGU<span className="text-blue-500/20">NET</span></h2>
            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl max-w-full">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Current Topic</p>
              <p className="text-[11px] font-bold text-slate-200 truncate uppercase leading-tight">{gameState.topic}</p>
            </div>
            <div className="mt-2 flex items-center gap-2">
               <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Limit:</span>
               <span className="text-xs font-black text-blue-500">{gameState.threshold}</span>
            </div>
          </div>

          {/* Player 2 Stats (Right) */}
          <div className={`flex flex-col items-end transition-all duration-500 ${gameState.turnIndex === 1 ? 'scale-105 opacity-100' : 'opacity-40 grayscale-[0.5]'}`}>
            <div className="flex items-center gap-3 mb-1 flex-row-reverse">
              <span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_10px_#a855f7]"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-500">Negative</span>
            </div>
            <h3 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tighter text-right truncate w-full">{gameState.players[1].name}</h3>
            <div className="flex items-baseline gap-2 mt-1 flex-row-reverse">
               <span className="text-3xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">{gameState.players[1].score}</span>
               <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">PTS</span>
            </div>
            <button 
              onClick={() => onEnd(1)}
              className={`mt-3 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border ${gameState.endAgreement[1] ? 'bg-red-600 border-red-600 text-white' : 'border-red-500/30 text-red-500 hover:bg-red-500/10'}`}
            >
              {gameState.endAgreement[1] ? 'VOTED END' : 'END DEBATE'}
            </button>
          </div>

        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0 bg-[#010411] relative overflow-hidden shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]">
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-6 md:p-14 space-y-12 chat-scroll">
            {gameState.messages.length === 0 && !isLoading && (
              <div className="h-full flex flex-col items-center justify-center opacity-10">
                <div className="w-16 h-16 rounded-3xl border border-white/10 flex items-center justify-center text-3xl font-black mb-6">?</div>
                <p className="text-[10px] font-black uppercase tracking-[0.6em]">Awaiting Simulation Start</p>
              </div>
            )}

            {gameState.messages.map((m) => (
                <div key={m.id} className={`flex flex-col ${m.role === DebateRole.FOR ? 'items-start' : 'items-end'} animate-in slide-in-from-bottom-10 duration-700`}>
                    <div className={`relative max-w-[85%] md:max-w-[70%]`}>
                        <div className={`absolute -top-6 ${m.role === DebateRole.FOR ? 'left-4 text-blue-500' : 'right-4 text-purple-500'} text-[9px] font-black uppercase tracking-[0.4em]`}>
                            {m.senderName}
                        </div>
                        <div className={`p-8 md:p-10 rounded-[3rem] text-[16px] font-medium leading-relaxed glass-dark border-white/5 ${
                            m.role === DebateRole.FOR 
                            ? 'rounded-tl-none border-l-4 border-l-blue-500/50 bg-blue-500/[0.02]' 
                            : 'rounded-tr-none border-r-4 border-r-purple-500/50 text-right bg-purple-500/[0.02]'
                        }`}>
                            {m.text}
                            <div className={`mt-10 flex items-center justify-between border-t border-white/5 pt-8 text-[11px] font-black tracking-widest ${m.role === DebateRole.FOR ? '' : 'flex-row-reverse'}`}>
                                <span className="text-slate-600 italic max-w-[70%] line-clamp-1">{m.reasoning}</span>
                                <span className={`px-5 py-2 rounded-full border border-white/5 ${m.role === DebateRole.FOR ? 'text-blue-400' : 'text-purple-400'}`}>+{m.score} PTS</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            
            {isLoading && (
                <div className={`flex flex-col ${current.role === DebateRole.FOR ? 'items-start' : 'items-end'}`}>
                    <div className="glass-dark border-white/10 px-10 py-6 rounded-[2.5rem] flex items-center gap-6 shadow-2xl">
                        <div className="flex gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 italic">Processing Argument...</span>
                    </div>
                </div>
            )}
            <div ref={bottomRef} className="h-20" />
        </div>

        {/* Input Dock */}
        <div className="p-8 md:p-12 border-t border-white/5 glass-dark shrink-0">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-3 mb-5 px-4">
                    <div className={`w-3 h-3 rounded-full ${current.role === DebateRole.FOR ? 'bg-blue-500 shadow-[0_0_12px_#3b82f6]' : 'bg-purple-500 shadow-[0_0_12px_#a855f7]'}`}></div>
                    <span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500">
                        Current Speaker: <span className="text-white italic">{current.name}</span>
                    </span>
                </div>
                <div className="flex gap-6">
                    <textarea
                        rows={1}
                        className="flex-1 bg-white/5 border border-white/10 rounded-[2.5rem] px-8 py-5 outline-none focus:border-white/20 transition-all text-lg font-medium placeholder:text-white/10 resize-none text-white shadow-inner"
                        placeholder="INPUT ARGUMENT..."
                        value={text}
                        onChange={e => setText(e.target.value)}
                        disabled={isLoading}
                        onKeyDown={e => {
                            if(e.key === 'Enter' && !e.shiftKey && text.trim()) {
                                e.preventDefault();
                                onSend(text);
                                setText('');
                            }
                        }}
                    />
                    <button
                        disabled={isLoading || !text.trim()}
                        onClick={() => { onSend(text); setText(''); }}
                        className="bg-white text-slate-950 px-12 rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-[11px] transition-all hover:bg-blue-500 hover:text-white active:scale-95 disabled:opacity-20 shadow-xl"
                    >
                        SUBMIT
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DebateArena;
