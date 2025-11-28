
export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
export type PieceColor = 'w' | 'b';

export type GameMode = 'guidance' | 'free' | 'variant';
export type GameDifficulty = 'easy' | 'normal' | 'hard';

export interface LevelTask {
  id: string;
  instruction: string;
  mentorText: string;
  fen: string; // The board setup
  goalType: 'move_to' | 'capture' | 'survive' | 'select';
  targetSquare?: string; // e.g., 'e4'
  requiredPiece?: PieceType; // The piece that must move
  nextLevelId?: string;
  hideKings?: boolean; // If true, visually hide kings (even if present in FEN for validity)
  timeLimit?: number; // Optional: Seconds to complete the level
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  levels: LevelTask[];
}

export interface GameState {
  currentChapterIndex: number;
  currentLevelIndex: number;
  fen: string;
  selectedSquare: string | null;
  history: string[]; // history of moves in current level
  isCompleted: boolean;
  message: string | null; // Feedback message
  messageType: 'neutral' | 'success' | 'error' | 'hint';
}

export interface UserSettings {
  highContrast: boolean;
  textSize: 'normal' | 'large';
  showHints: boolean;
  showPieceLabels: boolean;
  soundEnabled: boolean;
}

export interface UserProgress {
  unlockedChapterIdx: number;
  unlockedLevelIdx: number;
}

export interface GameConfig {
  mode: GameMode;
  difficulty: GameDifficulty;
  hintsEnabled: boolean;
  variantFen?: string;
  variantName?: string;
}

export interface VariantScenario {
  id: string;
  name: string;
  description: string;
  fen: string;
}

export type ViewState = 'menu' | 'levels' | 'game' | 'settings' | 'intro' | 'quickMenu';

export const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
