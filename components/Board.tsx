
import React, { useMemo } from 'react';
import Square from './Square';
import { ChessService } from '../services/chessLogic';

interface BoardProps {
  fen: string;
  selectedSquare: string | null;
  validMoves: string[];
  targetSquare?: string;
  hideKings?: boolean;
  isMistake?: boolean;
  guidanceMoves?: { from: string; to: string; score: number; isRisky?: boolean }[];
  dangerSquares?: string[];
  highContrast?: boolean;
  showPieceLabels?: boolean;
  onSquareClick: (square: string) => void;
}

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

const Board: React.FC<BoardProps> = ({ 
  fen, 
  selectedSquare, 
  validMoves, 
  targetSquare,
  hideKings,
  isMistake,
  guidanceMoves,
  dangerSquares,
  highContrast,
  showPieceLabels,
  onSquareClick
}) => {
  const chess = useMemo(() => new ChessService(fen), [fen]);

  // Styling based on mode
  const boardBorder = highContrast ? 'border-4 border-black' : 'border-4 border-slate-700';
  const shadow = highContrast ? 'shadow-none' : 'shadow-2xl shadow-black/50';

  return (
    <div className={`w-full h-full rounded-xl overflow-hidden ${boardBorder} ${shadow} bg-slate-900 relative`}>
      <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
        {RANKS.map((rank, rankIndex) => (
          FILES.map((file, fileIndex) => {
            const squareId = `${file}${rank}`;
            const isBlack = (rankIndex + fileIndex) % 2 === 1;
            let piece = chess.getPiece(squareId as any);

            // Hide kings if requested for specific lessons
            if (hideKings && piece && piece.type === 'k') {
              piece = null;
            }
            
            return (
              <Square
                key={squareId}
                squareId={squareId}
                isBlack={isBlack}
                piece={piece}
                isSelected={selectedSquare === squareId}
                isValidMove={validMoves.includes(squareId)}
                isTarget={targetSquare === squareId}
                isGuidanceFrom={guidanceMoves?.some((m) => m.from === squareId)}
                isGuidanceTo={guidanceMoves?.some((m) => m.to === squareId)}
                isDanger={dangerSquares?.includes(squareId)}
                highContrast={highContrast}
                showPieceLabels={showPieceLabels}
                onClick={() => onSquareClick(squareId)}
              />
            );
          })
        ))}
      </div>

      {/* Global Mistake Overlay (Red Flash) */}
      {isMistake && (
        <div className="absolute inset-0 z-50 pointer-events-none border-[12px] border-red-500/50 animate-pulse rounded-lg bg-red-900/10 mix-blend-multiply" />
      )}
    </div>
  );
};

export default Board;
