
import React from 'react';
import { GameState, DebateRole } from '../types';

interface Props {
  gameState: GameState;
  onReset: () => void;
}

const Results: React.FC<Props> = ({ gameState, onReset }) => {
  const winner = gameState.winner;
  const isTie = !winner && gameState.endAgreement[0] && gameState.endAgreement[1];
  
  return (
    <div className="w-full min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-1000 overflow-y-auto no-scrollbar">
      
      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 blur-[120px] rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/5 blur-[100px] rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-6xl w-full">
        <h2 className="text-[12px] font-black uppercase tracking-[1.5em] text-slate-600 mb-8 opacity-50">Simulation Signal Terminated</h2>
        
        <div className="mb-16">
          <h1 className="text-7xl md:text-[12rem] font-black tracking-tighter text-white leading-none italic uppercase drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            DEBATE <span className="text-transparent bg-clip-text bg-gradient-to-br from-red-500 via-purple-600 to-blue-600">ENDED</span>
          </h1>
          <p className="mt-8 text-2xl md:text-5xl font-bold text-slate-400 tracking-tight">THANK YOU FOR PLAYING</p>
        </div>

        {/* Winner Highlight */}
        {!isTie && winner && (
          <div className="glass-dark border-white/10 p-12 rounded-[4rem] mb-16 max-w-2xl mx-auto shadow-2xl animate-in zoom-in-95 duration-1000 delay-300">
            <span className="text-[11px] font-black uppercase tracking-[0.5em] text-blue-500 block mb-4">VICTORIOUS INTELLECT</span>
            <h2 className="text-6xl md:text-8xl font-black text-white italic uppercase tracking-tighter mb-4">{winner.name}</h2>
            <div className="h-1.5 w-32 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full mb-8"></div>
            <div className="flex justify-center gap-12">
               <div className="text-left">
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Final Score</p>
                  <p className="text-5xl font-black text-white">{winner.score}</p>
               </div>
               <div className="text-right">
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Efficiency</p>
                  <p className="text-5xl font-black text-blue-500">{(winner.score / (gameState.messages.length || 1)).toFixed(1)}</p>
               </div>
            </div>
          </div>
        )}

        {isTie && (
          <div className="mb-16">
            <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter">MUTUAL STALEMATE</h2>
            <p className="text-slate-500 mt-4 font-bold tracking-widest">BOTH PARTIES CONCEDED AT PARITY</p>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-20 opacity-80">
           <div className="glass-dark p-8 rounded-[2.5rem] border-white/5">
              <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1 block">Subject</span>
              <p className="text-white font-bold truncate uppercase">{gameState.topic}</p>
           </div>
           <div className="glass-dark p-8 rounded-[2.5rem] border-white/5">
              <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1 block">Rounds</span>
              <p className="text-white font-bold">{gameState.messages.length}</p>
           </div>
           <div className="glass-dark p-8 rounded-[2.5rem] border-white/5">
              <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1 block">Arena Cap</span>
              <p className="text-white font-bold">{gameState.threshold} PTS</p>
           </div>
        </div>

        <button 
          onClick={onReset}
          className="group relative bg-white text-slate-950 px-20 py-8 rounded-full font-black uppercase tracking-[0.8em] text-[12px] transition-all hover:scale-105 active:scale-95 shadow-[0_20px_60px_rgba(255,255,255,0.1)] overflow-hidden"
        >
          <span className="relative z-10 group-hover:text-white transition-colors duration-300 italic">Initialize New Arena</span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
        </button>
      </div>
    </div>
  );
};

export default Results;
