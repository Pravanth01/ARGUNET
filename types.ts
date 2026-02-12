
export enum DebateRole {
  FOR = 'FOR',
  AGAINST = 'AGAINST'
}

export interface Player {
  name: string;
  role: DebateRole;
  score: number;
}

export interface Message {
  id: string;
  senderName: string;
  role: DebateRole;
  text: string;
  score: number;
  reasoning: string;
  timestamp: number;
}

export interface GameState {
  topic: string;
  players: [Player, Player];
  threshold: number;
  messages: Message[];
  turnIndex: number; // 0 or 1
  isGameOver: boolean;
  winner: Player | null;
  endAgreement: [boolean, boolean]; // Whether player 1 and 2 agreed to end early
}

export type View = 'LOBBY' | 'SETUP' | 'DEBATE' | 'RESULT';
