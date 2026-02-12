
import React, { useState, useEffect } from 'react';
import { DebateRole, GameState, Player, Message } from './types';
import { calculateScore } from './services/debateEngine';
import SetupForm from './components/SetupForm';
import DebateArena from './components/DebateArena';
import Results from './components/Results';

const STORAGE_KEY = 'argunet_v5_local_deploy';

const App: React.FC = () => {
  const [view, setView] = useState<'SETUP' | 'DEBATE' | 'RESULT'>('SETUP');
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.isGameOver) {
          setGameState(parsed);
          setView('DEBATE');
        }
      } catch (e) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    if (gameState) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    }
  }, [gameState]);

  const handleStart = async (p1: string, p2: string, threshold: number, topic: string) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    
    const newState: GameState = {
      topic,
      players: [
        { name: p1, role: DebateRole.FOR, score: 0 },
        { name: p2, role: DebateRole.AGAINST, score: 0 }
      ],
      threshold,
      messages: [],
      turnIndex: 0,
      isGameOver: false,
      winner: null,
      endAgreement: [false, false]
    };
    setGameState(newState);
    setLoading(false);
    setView('DEBATE');
  };

  const handleSendMessage = async (text: string) => {
    if (!gameState || gameState.isGameOver) return;

    const idx = gameState.turnIndex;
    const player = gameState.players[idx];
    
    setLoading(true);
    // Local deterministic logic engine
    const evaluation = await calculateScore(text);
    setLoading(false);

    const updatedPlayers = [...gameState.players] as [Player, Player];
    updatedPlayers[idx].score += evaluation.score;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderName: player.name,
      role: player.role,
      text,
      score: evaluation.score,
      reasoning: evaluation.reasoning,
      timestamp: Date.now()
    };

    let isGameOver = updatedPlayers[idx].score >= gameState.threshold;
    let winner = isGameOver ? updatedPlayers[idx] : null;

    setGameState({
      ...gameState,
      players: updatedPlayers,
      messages: [...gameState.messages, newMessage],
      turnIndex: (idx + 1) % 2,
      isGameOver,
      winner,
      endAgreement: [false, false]
    });

    if (isGameOver) setView('RESULT');
  };

  const handleEndAgreement = (playerIndex: number) => {
    if (!gameState) return;
    const newAgreements = [...gameState.endAgreement] as [boolean, boolean];
    newAgreements[playerIndex] = !newAgreements[playerIndex];

    if (newAgreements[0] && newAgreements[1]) {
      const p1 = gameState.players[0];
      const p2 = gameState.players[1];
      const winner = p1.score > p2.score ? p1 : (p2.score > p1.score ? p2 : null);
      
      setGameState({ ...gameState, endAgreement: newAgreements, isGameOver: true, winner });
      setView('RESULT');
    } else {
      setGameState({ ...gameState, endAgreement: newAgreements });
    }
  };

  const reset = () => {
    localStorage.removeItem(STORAGE_KEY);
    setGameState(null);
    setView('SETUP');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-0 md:p-6 overflow-hidden">
      {view === 'SETUP' && <SetupForm onStart={handleStart} isLoading={loading} />}
      {view === 'DEBATE' && gameState && (
        <DebateArena 
          gameState={gameState} 
          onSend={handleSendMessage} 
          isLoading={loading} 
          onEnd={handleEndAgreement} 
        />
      )}
      {view === 'RESULT' && gameState && <Results gameState={gameState} onReset={reset} />}
    </div>
  );
};

export default App;
