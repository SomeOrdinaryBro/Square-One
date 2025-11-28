
import { Chess, Move, Square } from 'chess.js';
import { GameDifficulty, PieceColor, PieceType } from '../types';

export class ChessService {
  private game: Chess;

  constructor(fen?: string) {
    this.game = new Chess(fen);
  }

  getFen(): string {
    return this.game.fen();
  }

  getTurn(): PieceColor {
    return this.game.turn() as PieceColor;
  }

  getMoves(square: Square): string[] {
    return this.game.moves({ square, verbose: true }).map((m) => (m as Move).to);
  }

  // Get raw verbose moves for detailed validation
  getVerboseMoves(square: Square): Move[] {
      return this.game.moves({ square, verbose: true }) as Move[];
  }

  move(from: string, to: string): string | null {
    try {
      const moveResult = this.game.move({ from, to, promotion: 'q' }); // Auto-promote to Queen for simplicity in this game
      return moveResult ? this.game.fen() : null;
    } catch (e) {
      return null;
    }
  }

  makeRandomMove(): { from: string; to: string; fen: string } | null {
    const moves = this.game.moves({ verbose: true }) as Move[];
    if (moves.length === 0) return null;

    const randomMove = moves[Math.floor(Math.random() * moves.length)];
    this.game.move(randomMove);
    
    return {
      from: randomMove.from,
      to: randomMove.to,
      fen: this.game.fen()
    };
  }

  /** Basic heuristic evaluation for a move without mutating the live game */
  evaluateMove(move: Move): { score: number; isRisky: boolean } {
    const pieceValues: Record<PieceType, number> = {
      p: 100,
      n: 320,
      b: 330,
      r: 500,
      q: 900,
      k: 20000
    };

    const centralSquares = new Set(['d4', 'd5', 'e4', 'e5']);
    const expandedCenter = new Set([
      'c3', 'c4', 'c5', 'c6',
      'd3', 'd4', 'd5', 'd6',
      'e3', 'e4', 'e5', 'e6',
      'f3', 'f4', 'f5', 'f6'
    ]);

    const simulation = new Chess(this.game.fen());
    simulation.move(move);

    let score = 0;

    if (move.captured) {
      score += pieceValues[move.captured as PieceType] + 20;
    }

    if (move.promotion) {
      score += (pieceValues[move.promotion as PieceType] || 0) - pieceValues.p;
    }

    if (centralSquares.has(move.to)) score += 25;
    else if (expandedCenter.has(move.to)) score += 10;

    if (move.san.includes('+')) {
      score += 40;
    }

    const mobilityBonus = simulation.moves().length * 0.5;
    score += mobilityBonus;

    const dangerMove = simulation.moves({ verbose: true }).some((m) => (m as Move).to === move.to);
    if (dangerMove) {
      score -= 75;
    }

    return { score, isRisky: dangerMove };
  }

  getBestMoves(limit = 3): { from: string; to: string; score: number; isRisky: boolean }[] {
    const moves = this.game.moves({ verbose: true }) as Move[];
    const evaluated = moves.map((move) => {
      const { score, isRisky } = this.evaluateMove(move);
      return { move, score, isRisky };
    });

    return evaluated
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((item) => ({ from: item.move.from, to: item.move.to, score: Math.round(item.score), isRisky: item.isRisky }));
  }

  makeGreedyMove(): { from: string; to: string; fen: string } | null {
    const moves = this.game.moves({ verbose: true }) as Move[];
    if (moves.length === 0) return null;

    let bestMove = moves[0];
    let bestScore = -Infinity;

    moves.forEach((move) => {
      const { score } = this.evaluateMove(move);
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    });

    this.game.move(bestMove);

    return {
      from: bestMove.from,
      to: bestMove.to,
      fen: this.game.fen()
    };
  }

  getSmartMove(): { from: string; to: string; fen: string } | null {
    const moves = this.game.moves({ verbose: true }) as Move[];
    if (moves.length === 0) return null;

    let best:
      | {
          move: Move;
          score: number;
        }
      | null = null;

    moves.forEach((move) => {
      const baseEval = this.evaluateMove(move);

      const nextPosition = new Chess(this.game.fen());
      nextPosition.move(move);
      const replyService = new ChessService(nextPosition.fen());
      const counterMove = replyService.getBestMoves(1)[0];
      const counterScore = counterMove ? counterMove.score * 0.7 : 0;

      const netScore = baseEval.score - counterScore;

      if (!best || netScore > best.score) {
        best = { move, score: netScore };
      }
    });

    if (!best) return null;

    this.game.move(best.move);

    return {
      from: best.move.from,
      to: best.move.to,
      fen: this.game.fen()
    };
  }

  makeBotMove(difficulty: GameDifficulty): { from: string; to: string; fen: string } | null {
    if (difficulty === 'easy') return this.makeRandomMove();
    if (difficulty === 'normal') return this.makeGreedyMove();
    return this.getSmartMove();
  }

  isCheck(): boolean {
    return this.game.inCheck();
  }

  isGameOver(): boolean {
    return this.game.isGameOver();
  }
  
  // Find a move from the current turn player that lands on the specific square
  // Used to find if the opponent can capture the player's piece after a bad move
  getCapturingMove(targetSquare: string): { from: string; to: string } | null {
    const moves = this.game.moves({ verbose: true }) as Move[];
    // Find any move that lands on the target square.
    // Since this is called AFTER the player moves, it's the opponent's turn.
    // If they have a move to the square occupied by the player, it's a capture.
    const capture = moves.find((m) => m.to === targetSquare);
    
    if (capture) {
      return { from: capture.from, to: capture.to };
    }
    return null;
  }

  getPiece(square: Square) {
    return this.game.get(square);
  }
}
