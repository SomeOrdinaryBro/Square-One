import React from 'react';
import { Play, BookOpen, Settings as SettingsIcon, Zap } from 'lucide-react';
import { UserProgress } from '../types';

interface MainMenuProps {
  progress: UserProgress;
  onNewGame: () => void;
  onContinue: () => void;
  onSelectLevel: () => void;
  onQuickGame: () => void;
  onSettings: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({
  progress,
  onNewGame,
  onContinue,
  onSelectLevel,
  onQuickGame,
  onSettings
}) => {
  const hasProgress = progress.unlockedChapterIdx > 0 || progress.unlockedLevelIdx > 0;

  return (
    <div className="min-h-screen bg-[#1a1a2e] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-700">
      <div className="mb-12 animate-fade-in-up">
        <div className="inline-block p-4 rounded-3xl bg-slate-800/50 mb-6 border border-slate-700 shadow-xl backdrop-blur-md">
           <div className="flex gap-2">
             <div className="w-8 h-8 bg-blue-500 rounded-lg shadow-lg"></div>
             <div className="w-8 h-8 bg-white rounded-lg shadow-lg"></div>
           </div>
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tight drop-shadow-sm">
          Square One
        </h1>
        <p className="text-xl text-slate-400 font-medium tracking-wide">Chess from the very beginning.</p>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-sm animate-scale-in delay-200">
        {hasProgress && (
          <button 
            onClick={onContinue}
            className="group relative bg-green-600 hover:bg-green-500 active:bg-green-700 text-white font-bold py-5 px-6 rounded-2xl shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-4 animate-fade-in-up delay-100"
          >
            <Play className="fill-current w-6 h-6" />
            <span className="text-xl">Continue Learning</span>
            {/* Static badge instead of ping animation */}
            <div className="absolute -right-2 -top-2 w-4 h-4 bg-red-500 rounded-full border-2 border-[#1a1a2e]" />
          </button>
        )}

        <button 
          onClick={onNewGame}
          className="bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold py-5 px-6 rounded-2xl shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-4 animate-fade-in-up delay-200"
        >
          <BookOpen className="w-6 h-6" />
          <span className="text-xl">New Game</span>
        </button>

        <div className="grid grid-cols-2 gap-4 animate-fade-in-up delay-300">
            <button 
            onClick={onSelectLevel}
            className="bg-slate-700 hover:bg-slate-600 active:bg-slate-800 text-white font-semibold py-4 px-6 rounded-2xl shadow-md transition-all active:scale-[0.98] flex flex-col items-center gap-2 backdrop-blur-sm border border-white/5"
            >
            <BookOpen className="opacity-70 w-6 h-6" />
            <span>Chapters</span>
            </button>

            <button 
            onClick={onQuickGame}
            className="bg-purple-700 hover:bg-purple-600 active:bg-purple-800 text-white font-bold py-4 px-6 rounded-2xl shadow-md transition-all active:scale-[0.98] flex flex-col items-center gap-2"
            >
            <Zap className="w-6 h-6" />
            <span>Quick Play</span>
            </button>
        </div>

        <button 
          onClick={onSettings}
          className="mt-2 bg-transparent hover:bg-slate-800 active:bg-slate-900 text-slate-400 hover:text-white font-semibold py-4 px-6 rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 border border-slate-700 border-dashed hover:border-solid animate-fade-in-up delay-300"
        >
          <SettingsIcon className="w-5 h-5" />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
};

export default MainMenu;