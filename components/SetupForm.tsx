
import React, { useState } from 'react';

interface SetupFormProps {
  onStart: (p1: string, p2: string, threshold: number, topic: string) => void;
  isLoading: boolean;
}

const SetupForm: React.FC<SetupFormProps> = ({ onStart, isLoading }) => {
  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');
  const [topic, setTopic] = useState('');
  const [threshold, setThreshold] = useState(30);

  return (
    <div className="w-full max-w-5xl px-6 py-12 flex flex-col items-center max-h-screen overflow-y-auto no-scrollbar fade-in">
      <div className="text-center mb-16">
        <h1 className="text-8xl md:text-9xl font-black mb-4 tracking-tighter uppercase italic text-white">
          ARGU<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">NET</span>
        </h1>
        <div className="flex items-center justify-center gap-4">
            <div className="h-[1px] w-12 bg-white/10"></div>
            <p className="text-slate-500 font-bold tracking-[0.5em] uppercase text-[10px]">Neural Battle Interface v4</p>
            <div className="h-[1px] w-12 bg-white/10"></div>
        </div>
      </div>
      
      <div className="w-full mb-12">
        <div className="glass-dark p-12 rounded-[3rem] relative overflow-hidden group border-white/5 transition-all hover:border-white/10">
          <label className="text-blue-400 text-[11px] font-black uppercase tracking-[0.4em] mb-4 block">Core Argument Topic</label>
          <input
            placeholder="WHAT SHALL WE DISPUTE?"
            className="w-full bg-transparent border-b-2 border-white/5 py-4 text-3xl md:text-5xl font-black outline-none focus:border-blue-500 transition-all placeholder:text-white/5 text-white uppercase italic"
            value={topic}
            onChange={e => setTopic(e.target.value)}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-10 w-full mb-12">
        {/* Affirmative */}
        <div className="glass-dark p-12 rounded-[3.5rem] relative group border-blue-500/20 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[60px] pointer-events-none"></div>
          <h2 className="text-5xl font-black italic tracking-tighter text-blue-500 mb-8 uppercase drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">FOR</h2>
          <div className="relative">
            <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-3 block">Affirmative Representative</label>
            <input
              placeholder="PLAYER 01"
              className="w-full bg-transparent border-b-2 border-white/5 py-3 text-2xl font-black outline-none focus:border-blue-500 transition-all text-white uppercase"
              value={p1}
              onChange={e => setP1(e.target.value)}
            />
          </div>
        </div>

        {/* Negative */}
        <div className="glass-dark p-12 rounded-[3.5rem] relative group border-purple-500/20 overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/10 blur-[60px] pointer-events-none"></div>
          <h2 className="text-5xl font-black italic tracking-tighter text-purple-500 mb-8 uppercase drop-shadow-[0_0_15px_rgba(168,85,247,0.3)] text-right">AGAINST</h2>
          <div className="relative">
            <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-3 block text-right">Negative Representative</label>
            <input
              placeholder="PLAYER 02"
              className="w-full bg-transparent border-b-2 border-white/5 py-3 text-2xl font-black outline-none focus:border-purple-500 transition-all text-right text-white uppercase"
              value={p2}
              onChange={e => setP2(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="w-full max-w-xl">
        <div className="glass-dark p-10 rounded-[2.5rem] mb-12 flex flex-col gap-8">
             <div className="flex justify-between items-end">
                <div className="flex flex-col">
                   <h3 className="text-slate-500 font-black text-[10px] uppercase tracking-widest mb-2">Victory Threshold</h3>
                   <span className="text-5xl font-black text-white">{threshold} <span className="text-sm text-slate-700">PTS</span></span>
                </div>
                <div className="text-right text-[10px] text-slate-500 uppercase font-bold tracking-widest leading-tight max-w-[120px]">REQUIRED RATING FOR DOMINANCE</div>
             </div>
             <input
                type="range" min="10" max="100" step="5"
                className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
                value={threshold}
                onChange={e => setThreshold(Number(e.target.value))}
             />
        </div>

        <button
          disabled={isLoading || !p1 || !p2 || !topic}
          onClick={() => onStart(p1, p2, threshold, topic)}
          className="relative group w-full bg-white text-slate-950 py-7 rounded-[2rem] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-20 shadow-[0_0_40px_rgba(255,255,255,0.1)] overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <span className="relative z-10 font-black uppercase tracking-[0.5em] text-xs group-hover:text-white transition-colors duration-300">
            {isLoading ? "CALIBRATING ARENA..." : "COMMENCE SIMULATION"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default SetupForm;
