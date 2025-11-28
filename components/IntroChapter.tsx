import React, { useState, useEffect } from 'react';
import { PIECE_IMAGES } from '../constants';
import { ChevronRight, ShieldCheck, ShieldAlert, Crown, ArrowUp, Users, Swords } from 'lucide-react';

interface IntroChapterProps {
  onComplete: () => void;
}

const IntroChapter: React.FC<IntroChapterProps> = ({ onComplete }) => {
  const [scene, setScene] = useState(0);
  const [turnStep, setTurnStep] = useState(0);
  const [choiceFeedback, setChoiceFeedback] = useState<'none' | 'correct' | 'wrong'>('none');

  const nextScene = () => {
    setChoiceFeedback('none');
    setTurnStep(0);
    setScene(prev => prev + 1);
  };

  const handleTurnClick = () => {
    if (turnStep === 0) {
      setTurnStep(1); 
      setTimeout(() => {
        setTurnStep(2); 
      }, 1000);
    }
  };

  const renderScene = () => {
    switch (scene) {
      /* -------------------------------------------------------------------------- */
      /* SCENE 0: THE CLASH (Title)                                                 */
      /* -------------------------------------------------------------------------- */
      case 0:
        return (
          <div className="flex flex-col items-center animate-in fade-in duration-1000 text-center">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-8 tracking-tight">Two Kingdoms.</h2>
            <div className="flex gap-8 md:gap-12 mb-12 items-center justify-center">
              <div className="w-24 h-24 md:w-32 md:h-32 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                <img src={PIECE_IMAGES['w-k']} alt="White King" className="w-full h-full object-contain" />
              </div>
              <Swords className="w-12 h-12 text-slate-500" />
              <div className="w-24 h-24 md:w-32 md:h-32 drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]">
                <img src={PIECE_IMAGES['b-k']} alt="Black King" className="w-full h-full object-contain" />
              </div>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-red-500 tracking-tight">One Battle.</h2>
            <p className="mt-6 text-slate-400 max-w-sm">No luck. No dice. Just pure strategy.</p>
            <button 
              onClick={nextScene}
              className="mt-12 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold py-4 px-12 rounded-full text-xl shadow-lg transition-transform active:scale-[0.98]"
            >
              Start
            </button>
          </div>
        );

      /* -------------------------------------------------------------------------- */
      /* SCENE 1: THE RHYTHM (Turns)                                                */
      /* -------------------------------------------------------------------------- */
      case 1:
        return (
          <div className="flex flex-col items-center text-center max-w-lg animate-in fade-in duration-500">
            <h2 className="text-3xl font-bold text-white mb-2">The Rhythm</h2>
            <p className="text-lg text-slate-300 mb-8">Chess is a conversation. <br/>You move. Then they move.</p>
            
            <div className="bg-slate-800 p-6 rounded-2xl border-2 border-slate-700 mb-8 shadow-2xl relative">
              <div className="grid grid-cols-3 gap-1 w-48 h-64 bg-slate-900 p-2 rounded-lg">
                 {[...Array(12)].map((_, i) => {
                   const isWhitePos = (turnStep === 0 && i === 10) || (turnStep >= 1 && i === 7);
                   const isBlackPos = (turnStep < 2 && i === 1) || (turnStep === 2 && i === 4);
                   return (
                     <div key={i} className={`rounded ${i % 2 === 0 ? 'bg-slate-700' : 'bg-slate-600'} flex items-center justify-center relative`}>
                        {isWhitePos && <img src={PIECE_IMAGES['w-p']} className="w-10 h-10 object-contain transition-all duration-500" />}
                        {isBlackPos && <img src={PIECE_IMAGES['b-p']} className="w-10 h-10 object-contain transition-all duration-500" />}
                        {turnStep === 0 && i === 7 && (
                          <div className="absolute w-3 h-3 bg-green-500 rounded-full opacity-75" />
                        )}
                     </div>
                   );
                 })}
              </div>
            </div>

            {turnStep === 0 && (
               <button 
                onClick={handleTurnClick}
                className="bg-green-600 hover:bg-green-500 active:bg-green-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg flex items-center gap-2 active:scale-[0.98] transition-transform"
               >
                 Your Turn: Move White <ArrowUp size={20} />
               </button>
            )}

            {turnStep === 1 && (
               <div className="text-slate-400 font-mono py-3 flex items-center gap-2">
                 Waiting for opponent...
               </div>
            )}

            {turnStep === 2 && (
               <button 
                onClick={nextScene}
                className="bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in active:scale-[0.98] transition-transform"
               >
                 Good. Continue <ChevronRight size={20} />
               </button>
            )}
          </div>
        );

      /* -------------------------------------------------------------------------- */
      /* SCENE 2: THE ARMY                                                          */
      /* -------------------------------------------------------------------------- */
      case 2:
        return (
          <div className="flex flex-col items-center text-center max-w-lg animate-in fade-in duration-500">
             <div className="w-20 h-20 mb-4 text-yellow-400">
               <Users className="w-full h-full" />
             </div>
             <h2 className="text-3xl font-bold text-white mb-4">You Are Not Alone</h2>
             <p className="text-xl text-slate-300 mb-8">The King is important, but he is weak. <br/>You have an army to protect him.</p>
             
             <div className="flex items-end justify-center gap-2 md:gap-4 mb-12 h-24">
                <img src={PIECE_IMAGES['w-r']} className="w-12 h-12 object-contain animate-in fade-in slide-in-from-bottom duration-700 delay-100" />
                <img src={PIECE_IMAGES['w-n']} className="w-12 h-12 object-contain animate-in fade-in slide-in-from-bottom duration-700 delay-200" />
                <img src={PIECE_IMAGES['w-b']} className="w-12 h-12 object-contain animate-in fade-in slide-in-from-bottom duration-700 delay-300" />
                <img src={PIECE_IMAGES['w-k']} className="w-20 h-20 object-contain -mb-2 z-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
                <img src={PIECE_IMAGES['w-b']} className="w-12 h-12 object-contain animate-in fade-in slide-in-from-bottom duration-700 delay-300" />
                <img src={PIECE_IMAGES['w-n']} className="w-12 h-12 object-contain animate-in fade-in slide-in-from-bottom duration-700 delay-200" />
                <img src={PIECE_IMAGES['w-r']} className="w-12 h-12 object-contain animate-in fade-in slide-in-from-bottom duration-700 delay-100" />
             </div>

             <button onClick={nextScene} className="bg-slate-700 hover:bg-slate-600 active:bg-slate-800 text-white py-3 px-8 rounded-xl font-bold flex items-center gap-2 active:scale-[0.98] transition-transform">
               Meet the Enemy <ChevronRight />
             </button>
          </div>
        );

      /* -------------------------------------------------------------------------- */
      /* SCENE 3: THE THREAT                                                        */
      /* -------------------------------------------------------------------------- */
      case 3:
        return (
          <div className="flex flex-col items-center text-center max-w-lg animate-in fade-in duration-500">
             <h2 className="text-3xl font-bold text-red-500 mb-4">The Danger</h2>
             <p className="text-lg text-slate-300 mb-6">Enemy pieces control squares. <br/>If you step there, you get captured.</p>

             <div className="bg-slate-800 p-4 rounded-xl border border-red-900/50 mb-8 relative overflow-hidden">
                <div className="grid grid-cols-5 gap-1 w-64 h-64 bg-slate-900 p-1 rounded">
                   {[...Array(25)].map((_, i) => {
                      const x = i % 5;
                      const y = Math.floor(i / 5);
                      const isEnemyRook = x === 2 && y === 0;
                      const isDangerZone = x === 2 && y > 0; 
                      const isKing = x === 1 && y === 4; 

                      return (
                         <div key={i} className={`rounded relative flex items-center justify-center ${
                             isDangerZone ? 'bg-red-900/40 border border-red-500/20' : (i % 2 === 0 ? 'bg-slate-700' : 'bg-slate-600')
                         }`}>
                             {isEnemyRook && <img src={PIECE_IMAGES['b-r']} className="w-10 h-10 object-contain" />}
                             {isKing && <img src={PIECE_IMAGES['w-k']} className="w-10 h-10 object-contain" />}
                             {isDangerZone && <div className="absolute w-2 h-2 bg-red-500 rounded-full opacity-50" />}
                         </div>
                      )
                   })}
                </div>
                <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-black/80 text-xs px-2 py-1 rounded text-red-400 border border-red-500">
                    DANGER ZONE
                </div>
             </div>

             <button onClick={nextScene} className="bg-slate-700 hover:bg-slate-600 active:bg-slate-800 text-white py-3 px-8 rounded-xl font-bold active:scale-[0.98] transition-transform">
               I understand
             </button>
          </div>
        );

      /* -------------------------------------------------------------------------- */
      /* SCENE 4: CHECKMATE                                                         */
      /* -------------------------------------------------------------------------- */
      case 4:
        return (
          <div className="flex flex-col items-center text-center max-w-lg animate-in fade-in duration-500">
             <div className="flex items-center gap-3 mb-4">
                <ShieldAlert className="text-red-500 w-8 h-8" />
                <h2 className="text-3xl font-bold text-white">Checkmate</h2>
             </div>
             <p className="text-xl text-slate-300 mb-8">
               You win by trapping the enemy King so he has <span className="text-red-400 font-bold">NOWHERE</span> to run.
             </p>
             
             <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 mb-8">
                <div className="grid grid-cols-3 gap-1 w-48 h-48 mx-auto bg-slate-900 p-1 rounded">
                    {[0,1,2,3,4,5,6,7,8].map(i => (
                        <div key={i} className={`w-full h-full flex items-center justify-center rounded border transition-colors duration-1000 ${i === 4 ? 'bg-slate-700 border-transparent' : 'bg-red-500/20 border-red-500/50'}`}>
                             {i === 4 && <img src={PIECE_IMAGES['b-k']} className="w-10 h-10 object-contain" />}
                             {i !== 4 && <div className="w-2 h-2 bg-red-500 rounded-full" />}
                        </div>
                    ))}
                </div>
                <div className="mt-2 text-red-400 font-mono text-sm uppercase tracking-widest">
                    No Safe Moves
                </div>
             </div>

             <button onClick={nextScene} className="bg-slate-700 hover:bg-slate-600 active:bg-slate-800 text-white py-3 px-8 rounded-xl font-bold active:scale-[0.98] transition-transform">
               Test Me
             </button>
          </div>
        );

      /* -------------------------------------------------------------------------- */
      /* SCENE 5: QUIZ                                                              */
      /* -------------------------------------------------------------------------- */
      case 5:
        return (
            <div className="flex flex-col items-center text-center w-full max-w-2xl animate-in fade-in duration-500">
                <h2 className="text-2xl font-bold text-white mb-4">Final Test: Which King is Safe?</h2>
                <p className="text-slate-400 mb-8">Click the board where the King can escape.</p>

                <div className="flex flex-col md:flex-row gap-8 w-full justify-center">
                    
                    <button 
                        onClick={() => setChoiceFeedback('wrong')}
                        className={`flex-1 bg-slate-800 p-4 rounded-xl border-4 transition-all active:scale-[0.98] ${choiceFeedback === 'wrong' ? 'border-red-500' : 'border-slate-700 hover:border-slate-500'}`}
                    >
                        <div className="grid grid-cols-3 gap-1 aspect-square mb-2 bg-slate-900 p-2 rounded pointer-events-none">
                             {[0,1,2,3,4,5,6,7,8].map(i => (
                                <div key={i} className={`rounded flex items-center justify-center ${i===4 ? '' : 'bg-red-500/20'}`}>
                                    {i===4 && <img src={PIECE_IMAGES['b-k']} className="w-8 h-8 object-contain" />}
                                </div>
                             ))}
                        </div>
                        <p className="font-bold text-slate-400">Situation A</p>
                    </button>

                     <button 
                        onClick={() => {
                            setChoiceFeedback('correct');
                            setTimeout(nextScene, 1500);
                        }}
                        className={`flex-1 bg-slate-800 p-4 rounded-xl border-4 transition-all active:scale-[0.98] ${choiceFeedback === 'correct' ? 'border-green-500 ring-4 ring-green-500/30' : 'border-slate-700 hover:border-slate-500'}`}
                    >
                         <div className="grid grid-cols-3 gap-1 aspect-square mb-2 bg-slate-900 p-2 rounded pointer-events-none">
                             {[0,1,2,3,4,5,6,7,8].map(i => (
                                <div key={i} className={`rounded flex items-center justify-center ${i===4 ? '' : (i===5 ? 'bg-green-500/40' : 'bg-red-500/20')}`}>
                                    {i===4 && <img src={PIECE_IMAGES['w-k']} className="w-8 h-8 object-contain" />}
                                    {i===5 && <div className="w-4 h-4 bg-green-500 rounded-full opacity-50" />}
                                </div>
                             ))}
                        </div>
                        <p className="font-bold text-slate-400">Situation B</p>
                    </button>
                </div>

                <div className="h-12 mt-6 flex items-center justify-center">
                    {choiceFeedback === 'wrong' && (
                        <div className="flex items-center gap-2 text-red-400">
                            <ShieldAlert /> <span>Nope! He is surrounded. Try again.</span>
                        </div>
                    )}
                     {choiceFeedback === 'correct' && (
                        <div className="flex items-center gap-2 text-green-400">
                            <ShieldCheck /> <span>Correct! He has a green square to escape!</span>
                        </div>
                    )}
                </div>
            </div>
        );

      /* -------------------------------------------------------------------------- */
      /* SCENE 6: OUTRO                                                             */
      /* -------------------------------------------------------------------------- */
      case 6:
         return (
             <div className="flex flex-col items-center text-center animate-in fade-in duration-500">
                 <div className="w-24 h-24 mb-6 drop-shadow-2xl">
                    <img src={PIECE_IMAGES['w-r']} className="w-full h-full object-contain" />
                 </div>
                 <h2 className="text-4xl font-black text-white mb-6">Ready to lead?</h2>
                 <p className="text-xl text-slate-300 mb-12 max-w-md">
                    We will start with your soldiers. One by one.
                    <br/>
                    <span className="text-blue-400 text-lg mt-2 block font-bold">One square at a time.</span>
                 </p>
                 <button 
                    onClick={onComplete}
                    className="bg-green-600 hover:bg-green-500 active:bg-green-700 text-white font-bold py-4 px-16 rounded-xl text-2xl shadow-xl transform transition active:scale-[0.98]"
                 >
                    Let's Go!
                 </button>
             </div>
         );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a2e] flex flex-col items-center justify-center p-6 overflow-hidden">
      {renderScene()}
      
      {/* Progress Dots */}
      <div className="fixed bottom-8 flex gap-3">
        {[0, 1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300 ${i === scene ? 'bg-blue-500 scale-150' : 'bg-slate-700'}`} />
        ))}
      </div>
    </div>
  );
};

export default IntroChapter;