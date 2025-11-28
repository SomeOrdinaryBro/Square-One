import React from 'react';
import { PIECE_IMAGES, PIECE_NAMES } from '../constants';

interface SquareProps {
  squareId: string;
  isBlack: boolean;
  piece: { type: string; color: string } | null;
  isSelected: boolean;
  isValidMove: boolean;
  isTarget: boolean;
  isGuidanceFrom?: boolean;
  isGuidanceTo?: boolean;
  isDanger?: boolean;
  highContrast?: boolean;
  showPieceLabels?: boolean;
  onClick: () => void;
}

const Square: React.FC<SquareProps> = ({
  squareId,
  isBlack,
  piece,
  isSelected,
  isValidMove,
  isTarget,
  isGuidanceFrom,
  isGuidanceTo,
  isDanger,
  highContrast,
  showPieceLabels,
  onClick,
}) => {
  const pieceKey = piece ? `${piece.color}-${piece.type}` : null;
  
  let baseColor;
  if (highContrast) {
    baseColor = isBlack ? 'bg-black' : 'bg-white';
  } else {
    baseColor = isBlack ? 'bg-slate-600' : 'bg-slate-300';
  }
  
  let stateOverlay = '';
  
  if (isSelected) {
    stateOverlay = 'ring-inset ring-4 ring-blue-500 z-10';
  } else if (isValidMove) {
    if (piece) {
       stateOverlay = 'ring-inset ring-4 ring-red-400 bg-red-500/20';
    } else {
       stateOverlay = ''; 
    }
  }

  const coordColor = highContrast 
    ? (isBlack ? 'text-white' : 'text-black')
    : (isBlack ? 'text-white/30' : 'text-black/30');

  return (
    <div
      onClick={onClick}
      className={`relative w-full h-full flex items-center justify-center cursor-pointer select-none transition-colors duration-300 ${baseColor} ${stateOverlay}`}
      title={piece && PIECE_NAMES[piece.type]}
    >
      <span className={`absolute top-0.5 right-0.5 text-[8px] md:text-[10px] font-mono leading-none pointer-events-none ${coordColor}`}>
        {squareId}
      </span>

      {(isTarget || isGuidanceFrom) && !piece && (
        <div className="absolute inset-1 border-4 border-yellow-400 rounded-full opacity-80 pointer-events-none" />
      )}

      {(isTarget || isGuidanceFrom) && piece && (
        <div className="absolute inset-0 border-[6px] border-yellow-400/70 z-10 pointer-events-none" />
      )}

      {isGuidanceTo && (
        <div className="absolute inset-0 bg-blue-400/20 ring-2 ring-blue-400/60 rounded-lg pointer-events-none animate-pulse" />
      )}

      {isDanger && (
        <div className="absolute inset-0 bg-red-500/15 ring-2 ring-red-500/40 rounded-lg pointer-events-none" />
      )}
      
      {isValidMove && !piece && !isTarget && (
        <div className={`absolute w-3 h-3 md:w-4 md:h-4 rounded-full opacity-30 ${highContrast ? 'bg-white mix-blend-difference' : 'bg-black'}`} />
      )}
      
      {pieceKey && (
        <img
            src={PIECE_IMAGES[pieceKey]}
            alt={PIECE_NAMES[piece.type]}
            // Apple-style Physics: use cubic-bezier for a snappy "lift" effect
            style={{ transitionTimingFunction: 'var(--ease-spring)' }}
            className={`
                w-[85%] h-[85%] object-contain select-none pointer-events-none 
                transition-transform duration-300
                ${isSelected ? '-translate-y-2 scale-110 drop-shadow-xl' : 'drop-shadow-sm'}
            `}
            draggable={false}
        />
      )}

      {showPieceLabels && piece && PIECE_NAMES[piece.type] && (
        <div className="absolute bottom-0 inset-x-0 flex justify-center pb-[2px] z-10 pointer-events-none">
          <span className="text-[6px] md:text-[9px] font-bold uppercase tracking-wider bg-black/70 text-white px-1.5 rounded-full backdrop-blur-[1px] shadow-sm">
            {PIECE_NAMES[piece.type]}
          </span>
        </div>
      )}
    </div>
  );
};

export default Square;