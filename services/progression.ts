
import { ChessService } from './chessLogic';
import { LevelTask } from '../types';

interface CheckParams {
  chess: ChessService;
  level: LevelTask;
  move?: { from: string; to: string; piece: string; captured?: string };
  selectedSquare?: string | null;
  isQuickGame?: boolean;
}

interface CheckResult {
  isComplete: boolean;
  isFail: boolean;
  failReason?: 'miss' | 'danger' | 'general';
}

export class ProgressionLogic {
  
  static check(params: CheckParams): CheckResult {
    const { chess, level, move, selectedSquare, isQuickGame } = params;

    // Quick Game Mode (Sandbox)
    if (isQuickGame) {
      // In quick game, checks/mates are handled by standard chess rules, 
      // but "Level Completion" isn't really a thing until checkmate/stalemate.
      // For now, we assume standard play.
      return { isComplete: false, isFail: false };
    }

    // 1. SELECT TASKS (Clicking a piece)
    if (level.goalType === 'select') {
      if (selectedSquare) {
        const piece = chess.getPiece(selectedSquare as any);
        if (piece && piece.type === level.requiredPiece && piece.color === 'w') {
           return { isComplete: true, isFail: false };
        }
      }
      return { isComplete: false, isFail: false };
    }

    // 2. MOVE / CAPTURE / SURVIVE (Require a Move)
    if (move) {
      
      // Safety Check (Universal Rule: Don't get captured immediately unless it's a sacrifice puzzle)
      // We assume beginner puzzles don't require sacrifices yet.
      const danger = chess.getCapturingMove(move.to);
      if (danger) {
        return { isComplete: false, isFail: true, failReason: 'danger' };
      }

      // GOAL: MOVE TO
      if (level.goalType === 'move_to') {
        // Specific target square
        if (level.targetSquare && level.targetSquare !== 'none') {
           if (move.to === level.targetSquare) {
             return { isComplete: true, isFail: false };
           } else {
             return { isComplete: false, isFail: true, failReason: 'miss' };
           }
        } 
        // Any move allowed (if targetSquare is 'none' or undefined)
        else {
           return { isComplete: true, isFail: false };
        }
      }

      // GOAL: CAPTURE
      if (level.goalType === 'capture') {
        if (move.captured) {
           // If a specific target square was defined, check it
           if (level.targetSquare && move.to !== level.targetSquare) {
             return { isComplete: false, isFail: true, failReason: 'miss' };
           }
           return { isComplete: true, isFail: false };
        } else {
           // Moved but didn't capture
           return { isComplete: false, isFail: true, failReason: 'miss' };
        }
      }

      // GOAL: SURVIVE (Escape Check/Threat)
      if (level.goalType === 'survive') {
         // If we made a move and didn't trigger the 'danger' check above, we survived!
         // (The danger check is already run at the start of this block)
         return { isComplete: true, isFail: false };
      }
    }

    return { isComplete: false, isFail: false };
  }
}
