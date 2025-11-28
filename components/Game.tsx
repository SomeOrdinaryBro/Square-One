import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Board from './Board';
import Mentor from './Mentor';
import { CURRICULUM } from '../data/curriculum';
import { ChessService } from '../services/chessLogic';
import { MentorLogic } from '../services/mentorLogic';
import { ProgressionLogic } from '../services/progression';
import { soundManager } from '../services/sound';
import { ChevronRight, RefreshCw, Clock, LogOut, ArrowLeft, Lightbulb } from 'lucide-react';
import { GameConfig, GameDifficulty, UserSettings, LevelTask, START_FEN } from '../types';

interface GameProps {
  initialChapterIdx: number;
  initialLevelIdx: number;
  isQuickGame?: boolean;
  gameConfig?: GameConfig;
  settings: UserSettings;
  onExit: () => void;
  onLevelComplete: (nextChapterIdx: number, nextLevelIdx: number) => void;
}

const Game: React.FC<GameProps> = ({
  initialChapterIdx,
  initialLevelIdx,
  isQuickGame,
  gameConfig,
  settings,
  onExit,
  onLevelComplete
}) => {
  const chapterIdx = initialChapterIdx;
  const levelIdx = initialLevelIdx;

  const isQuickPlay = !!gameConfig || isQuickGame;

  const quickLevel = useMemo<LevelTask>(() => {
    const guidanceCopy =
      gameConfig?.mode === 'guidance'
        ? 'Guided play: follow the glowing suggestions or explore your own lines.'
        : 'Play freely against our built-in bot.';

    return {
      id: 'quick',
      instruction: gameConfig?.variantName
        ? `${gameConfig.variantName}: Start from the curated setup.`
        : guidanceCopy,
      mentorText: gameConfig?.mode === 'guidance'
        ? "I'll highlight strong moves and warn you about traps."
        : "Make a move and I'll respond.",
      fen: gameConfig?.variantFen || START_FEN,
      goalType: 'survive',
      hideKings: false
    };
  }, [gameConfig]);

  const chapter = isQuickPlay ? { title: 'Quick Game', levels: [quickLevel] } : CURRICULUM[chapterIdx];
  const level = isQuickPlay ? quickLevel : chapter.levels[levelIdx];

  const [fen, setFen] = useState(level.fen);
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [validMoves, setValidMoves] = useState<string[]>([]);
  
  const [feedback, setFeedback] = useState<{ text: string; mood: 'neutral' | 'success' | 'error' | 'hint' }>({
    text: level.mentorText,
    mood: 'neutral'
  });
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  const [isMistake, setIsMistake] = useState(false);
  
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  const [streak, setStreak] = useState(0);
  const [retries, setRetries] = useState(0);
  const lastInteractionRef = useRef<number>(Date.now());
  const lastClickTimeRef = useRef<number>(0);
  const idleTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [guidanceMoves, setGuidanceMoves] = useState<{ from: string; to: string; score: number; isRisky: boolean }[]>([]);
  const [dangerSquares, setDangerSquares] = useState<string[]>([]);

  const botDifficulty: GameDifficulty = gameConfig?.difficulty || 'easy';
  const showGuidance = isQuickPlay && gameConfig?.mode === 'guidance';

  // Micro-loading state for curtain effect
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    soundManager.setEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  useEffect(() => {
    // 1. Trigger Micro-Loading Curtain
    setIsLoading(true);
    const loadTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 400); // 400ms curtain lift

    setFen(level.fen);
    setSelectedSquare(null);
    setValidMoves([]);
    setIsLevelComplete(false);
    setIsMistake(false);
    setGuidanceMoves([]);
    setDangerSquares([]);

    const greeting = isQuickPlay || retries === 0
      ? level.mentorText
      : MentorLogic.getGreeting(streak, retries);
    setFeedback({ text: greeting, mood: 'neutral' });

    if (timerRef.current) clearInterval(timerRef.current);
    if (level.timeLimit && !isQuickPlay) {
      setTimeLeft(level.timeLimit);
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === null || prev <= 0) return 0;
          return prev - 1;
        });
      }, 1000);
    } else {
      setTimeLeft(null);
    }

    return () => {
      clearTimeout(loadTimeout);
      if (timerRef.current) clearInterval(timerRef.current);
      if (idleTimerRef.current) clearInterval(idleTimerRef.current);
    };
  }, [level, isQuickPlay, retries, streak]);

  useEffect(() => {
    idleTimerRef.current = setInterval(() => {
        if (isLevelComplete || isMistake || isQuickPlay) return;
        const now = Date.now();
        const timeSinceLastAction = now - lastInteractionRef.current;
        if (timeSinceLastAction > 12000 && feedback.mood !== 'hint' && feedback.mood !== 'error') {
            const hint = MentorLogic.getIdleHint(level);
            setFeedback({ text: hint, mood: 'hint' });
        }
    }, 2000);
    return () => { if (idleTimerRef.current) clearInterval(idleTimerRef.current); };
  }, [isLevelComplete, isMistake, isQuickPlay, feedback.mood, level]);

  useEffect(() => {
    if (timeLeft === 10 || timeLeft === 5) {
       if (!isLevelComplete && !isMistake) {
          setFeedback({ text: MentorLogic.getPanicMessage(), mood: 'hint' });
          soundManager.playPanic();
       }
    }
    if (timeLeft === 0 && !isLevelComplete && !isMistake) {
      if (timerRef.current) clearInterval(timerRef.current);
      setFeedback({ text: "Time's up! React faster!", mood: 'error' });
      soundManager.playError();
      setStreak(0);
    }
  }, [timeLeft, isLevelComplete, isMistake]);

  const handleRestart = () => {
    soundManager.playSelect();
    setRetries(prev => prev + 1);
    setIsLoading(true); // Short flicker for restart
    setTimeout(() => setIsLoading(false), 200);

    setFen(level.fen);
    setSelectedSquare(null);
    setValidMoves([]);
    setIsLevelComplete(false);
    setIsMistake(false);

    const greeting = isQuickPlay
      ? level.mentorText
      : MentorLogic.getGreeting(streak, retries + 1);
    setFeedback({ text: greeting, mood: 'neutral' });

    if (timerRef.current) clearInterval(timerRef.current);
    if (level.timeLimit && !isQuickPlay) {
        setTimeLeft(level.timeLimit);
        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => (prev && prev > 0 ? prev - 1 : 0));
        }, 1000);
    }
  };

  const refreshGuidance = useCallback((currentFen: string) => {
    if (!showGuidance) {
      setGuidanceMoves([]);
      setDangerSquares([]);
      return;
    }

    const chess = new ChessService(currentFen);
    if (chess.getTurn() !== 'w') {
      setGuidanceMoves([]);
      setDangerSquares([]);
      return;
    }

    const bestMoves = chess.getBestMoves(3);
    setGuidanceMoves(bestMoves);
    setDangerSquares(bestMoves.filter((m) => m.isRisky).map((m) => m.to));
  }, [showGuidance]);

  useEffect(() => {
    refreshGuidance(fen);
  }, [fen, refreshGuidance]);

  const handleSquareClick = (square: string) => {
    if (isLevelComplete || isMistake || (timeLeft === 0) || isLoading) return;
    
    const now = Date.now();
    if (now - lastClickTimeRef.current < 200) {
        setFeedback({ text: MentorLogic.getSpamWarning(), mood: 'error' });
        soundManager.playError();
        lastClickTimeRef.current = now;
        return;
    }
    lastClickTimeRef.current = now;
    lastInteractionRef.current = now;

    const chess = new ChessService(fen);
    const piece = chess.getPiece(square as any);

    if (isQuickPlay) {
      if (selectedSquare === null) {
        if (piece && piece.color === 'w') {
          setSelectedSquare(square);
          soundManager.playSelect();
          if (settings.showHints || showGuidance) {
            const moves = chess.getMoves(square as any);
            setValidMoves(moves);
          }
          setFeedback({ text: 'White to move. Pick a destination.', mood: 'neutral' });
        } else if (piece && piece.color === 'b') {
          setFeedback({ text: "You're playing White this round.", mood: 'error' });
          soundManager.playError();
        }
        return;
      }

      if (square === selectedSquare) {
        setSelectedSquare(null);
        setValidMoves([]);
        setFeedback({ text: 'Selection canceled.', mood: 'neutral' });
        soundManager.playSelect();
        return;
      }

      const moves = chess.getMoves(selectedSquare as any);
      const verboseMoves = chess.getVerboseMoves(selectedSquare as any);
      const chosenMove = verboseMoves.find((m) => (m as any).to === square);
      const isValidMove = moves.includes(square);

      if (isValidMove) {
        const capturedPiece = chess.getPiece(square as any);
        const moveEval = chosenMove ? chess.evaluateMove(chosenMove as any) : null;
        const moveResultFen = chess.move(selectedSquare, square);

        if (moveResultFen) {
          setFen(moveResultFen);
          setSelectedSquare(null);
          setValidMoves([]);

          if (moveEval?.isRisky && showGuidance) {
            setFeedback({ text: 'Careful: that move can be captured immediately.', mood: 'error' });
          } else {
            setFeedback({ text: 'Your move played. Bot is thinking...', mood: 'neutral' });
          }

          if (capturedPiece) {
            soundManager.playCapture();
          } else {
            soundManager.playMove();
          }

          setTimeout(() => {
            const botChess = new ChessService(moveResultFen);
            const botMove = botChess.makeBotMove(botDifficulty);
            if (botMove) {
              setFen(botMove.fen);
              if (botChess.isCheck()) {
                soundManager.playPanic();
              } else if (botChess.getPiece(botMove.to as any)) {
                soundManager.playCapture();
              } else {
                soundManager.playMove();
              }
              setFeedback({ text: 'Bot moved. Your turn.', mood: 'neutral' });
            }
          }, 400);
        }
      } else {
        setFeedback({ text: 'Invalid move. Try a highlighted square.', mood: 'error' });
        soundManager.playError();
      }

      return;
    }

    if (level.hideKings && piece && piece.type === 'k') return;

    if (selectedSquare === null) {
      if (piece && piece.color === 'w') {
        if (level.requiredPiece && piece.type !== level.requiredPiece) {
             setFeedback({ text: "Not that one! Try the other piece.", mood: 'error' });
             soundManager.playError();
             return;
        }
        setSelectedSquare(square);
        soundManager.playSelect();
        if (settings.showHints) {
           const moves = chess.getMoves(square as any);
           setValidMoves(moves);
        }
        const tip = MentorLogic.getPieceTip(piece.type);
        setFeedback({ text: tip, mood: 'neutral' });

        const result = ProgressionLogic.check({
            chess, level, selectedSquare: square, isQuickGame: isQuickPlay
        });
        if (result.isComplete) {
            handleSuccess();
        }
      } else if (piece && piece.color === 'b') {
        setFeedback({ text: "That's an enemy piece! You control White.", mood: 'error' });
        soundManager.playError();
      }
      return;
    }

    if (square === selectedSquare) {
      setSelectedSquare(null);
      setValidMoves([]);
      setFeedback({ text: "Selection canceled.", mood: 'neutral' });
      soundManager.playSelect();
      return;
    }

    const moves = chess.getMoves(selectedSquare as any);
    const isValidMove = moves.includes(square);

    if (isValidMove) {
      const capturedPiece = chess.getPiece(square as any); 
      const previousFen = fen;
      const moveResultFen = chess.move(selectedSquare, square);

      if (moveResultFen) {
        setFen(moveResultFen);
        setSelectedSquare(null);
        setValidMoves([]);

        const moveData = {
            from: selectedSquare,
            to: square,
            piece: (chess.getPiece(square as any))?.type || '',
            captured: capturedPiece ? capturedPiece.type : undefined
        };
        
        if (capturedPiece) {
            soundManager.playCapture();
        } else {
            soundManager.playMove();
        }

        const nextChess = new ChessService(moveResultFen);
        const result = ProgressionLogic.check({
            chess: nextChess,
            level,
            move: moveData,
            isQuickGame: isQuickPlay
        });

        if (result.isComplete) {
            handleSuccess();
        } else if (result.isFail) {
            handleMistake(previousFen, result.failReason || 'general');
        } else {
            if (isQuickPlay) {
                 setTimeout(() => {
                    const botMove = nextChess.makeRandomMove();
                    if (botMove) {
                        setFen(botMove.fen);
                        setFeedback({ text: "My turn...", mood: 'neutral' });
                        if (nextChess.getPiece(botMove.to as any)) {
                            soundManager.playCapture();
                        } else {
                            soundManager.playMove();
                        }
                    }
                 }, 500);
            } else {
                 setFeedback({ text: "Good move.", mood: 'neutral' });
            }
        }
      }
    } else {
        setFeedback({ text: "Invalid move. Follow the rules!", mood: 'error' });
        soundManager.playError();
    }
  };

  const handleSuccess = () => {
    setFeedback({ text: MentorLogic.getSuccessReaction(streak), mood: 'success' });
    setIsLevelComplete(true);
    setStreak(prev => prev + 1);
    setRetries(0);
    soundManager.playSuccess();
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleMistake = (restoreFen: string, reason: 'danger' | 'miss' | 'general') => {
    setFeedback({ text: MentorLogic.getMistakeReaction(reason), mood: 'error' });
    setIsMistake(true);
    soundManager.playError();
    
    setTimeout(() => {
        setFen(restoreFen);
        setIsMistake(false);
        setStreak(0);
        setRetries(prev => prev + 1);
        soundManager.playSelect(); 
    }, 2000);
  };

  const handleNextLevel = () => {
      soundManager.playSelect();
      let nextChapter = chapterIdx;
      let nextLevel = levelIdx + 1;
      if (nextLevel >= CURRICULUM[chapterIdx].levels.length) {
          nextChapter = chapterIdx + 1;
          nextLevel = 0;
      }
      if (nextChapter >= CURRICULUM.length) {
          onExit(); 
      } else {
          onLevelComplete(nextChapter, nextLevel); 
      }
  };

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-slate-200 flex flex-col lg:flex-row overflow-hidden relative">
      
      {/* LEFT (Desktop) / TOP (Mobile): BOARD AREA */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 lg:p-8 bg-slate-900/50 relative">
         
         <div className="lg:hidden w-full flex justify-between items-center mb-4">
            <button onClick={() => {soundManager.playSelect(); onExit();}} className="p-2 bg-slate-800 active:scale-95 transition-transform rounded-full"><ArrowLeft size={20}/></button>
            <div className="text-sm font-bold text-slate-400">
                {isQuickPlay ? 'Quick Game' : `Ch ${chapterIdx+1}: ${chapter.title}`}
            </div>
            <div className="w-8" />
         </div>

         <div className={`w-full max-w-[600px] aspect-square relative shadow-2xl rounded-xl transition-all duration-500 transform ${isLoading ? 'opacity-0 translate-y-4 scale-95' : 'opacity-100 translate-y-0 scale-100'}`}>
             <Board
               fen={fen}
               selectedSquare={selectedSquare}
               validMoves={validMoves}
               targetSquare={isQuickPlay ? undefined : level.targetSquare}
               hideKings={level.hideKings}
               isMistake={isMistake}
               guidanceMoves={showGuidance ? guidanceMoves : []}
               dangerSquares={showGuidance ? dangerSquares : []}
               highContrast={settings.highContrast}
               showPieceLabels={settings.showPieceLabels}
               onSquareClick={handleSquareClick}
             />
         </div>
      </div>

      {/* RIGHT (Desktop) / BOTTOM (Mobile): SIDEBAR CONTROLS */}
      <div className={`w-full lg:w-[450px] bg-slate-800 border-l border-slate-700 flex flex-col shadow-2xl z-10 transition-transform duration-500 ${isLoading ? 'translate-x-full lg:translate-x-0 opacity-50' : 'translate-x-0 opacity-100'}`}>
         
         <div className="hidden lg:flex items-center justify-between p-6 border-b border-slate-700 bg-slate-800">
             <div className="flex items-center gap-3">
                 <button onClick={() => {soundManager.playSelect(); onExit();}} className="p-2 hover:bg-slate-700 active:bg-slate-600 rounded-lg text-slate-400 hover:text-white transition active:scale-95">
                     <LogOut size={20} />
                 </button>
                 <div>
                     <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                         {isQuickPlay ? 'Quick Play' : `Chapter ${chapterIdx + 1}`}
                     </h2>
                     <h1 className="text-lg font-bold text-white leading-none">
                         {isQuickPlay ? (gameConfig?.variantName || 'Quick Match') : chapter.title}
                     </h1>
                 </div>
             </div>
             
             {timeLeft !== null && (
                 <div className={`flex items-center gap-2 font-mono font-bold text-xl ${timeLeft < 10 ? 'text-red-500' : 'text-blue-400'}`}>
                     <Clock size={20} /> {timeLeft}s
                 </div>
             )}
         </div>

         <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto">
            {!isQuickPlay && (
                <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div
                       className="bg-blue-500 h-full transition-all duration-500"
                        style={{ width: `${((levelIdx + 1) / chapter.levels.length) * 100}%` }}
                     />
                 </div>
             )}

             <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                 <div className="text-xs font-bold text-slate-500 uppercase mb-2">Current Objective</div>
                 <div className="text-white font-medium text-lg">
                     {level.instruction}
                 </div>
             </div>

             {isQuickPlay && (
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/80 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <Lightbulb size={16} className="text-amber-300" />
                      {showGuidance ? 'Guidance enabled' : 'Hints disabled'}
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10 font-semibold text-slate-200">
                      {botDifficulty.toUpperCase()} Bot
                    </span>
                  </div>
                  {showGuidance && guidanceMoves.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs text-slate-400 uppercase tracking-wide">Suggested moves</p>
                      <div className="grid grid-cols-1 gap-2">
                        {guidanceMoves.map((move) => (
                          <div key={`${move.from}-${move.to}`} className="flex items-center justify-between rounded-lg border border-blue-500/20 bg-blue-500/5 px-3 py-2">
                            <div className="font-mono text-sm text-white">
                              {move.from} → {move.to}
                            </div>
                            <div className={`text-xs font-semibold ${move.isRisky ? 'text-amber-300' : 'text-blue-200'}`}>
                              {move.isRisky ? 'Risky' : 'Strong'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {!showGuidance && (
                    <p className="text-sm text-slate-400">Pure free play. No hints will be shown.</p>
                  )}
                </div>
             )}

             <div className="flex-1">
                 <Mentor text={feedback.text} mood={feedback.mood} />
             </div>
         </div>

         <div className="p-6 border-t border-slate-700 bg-slate-800">
             {isLevelComplete ? (
                 <button 
                    onClick={handleNextLevel}
                    className="w-full bg-green-600 hover:bg-green-500 active:bg-green-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                 >
                    <span>Next Level</span> <ChevronRight size={24} />
                 </button>
             ) : (
                 <div className="flex gap-3">
                     <button 
                        onClick={handleRestart}
                        className="flex-1 bg-slate-700 hover:bg-slate-600 active:bg-slate-600 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition active:scale-[0.98]"
                     >
                        <RefreshCw size={18} /> Restart
                     </button>
                 </div>
             )}
         </div>

      </div>

    </div>
  );
};

export default Game;