
import { Chess, Move, Square } from 'chess.js';
import { PieceType } from '../types';

export class ChessService {
  private game: Chess;

  constructor(fen?: string) {
    this.game = new Chess(fen);
  }

  getFen(): string {
    return this.game.fen();
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
