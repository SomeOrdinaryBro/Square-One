
import React from 'react';
import { ArrowLeft, Lock, CheckCircle, PlayCircle, Star } from 'lucide-react';
import { CURRICULUM } from '../data/curriculum';
import { UserProgress } from '../types';

interface LevelSelectProps {
  progress: UserProgress;
  onSelectLevel: (chapterIdx: number, levelIdx: number) => void;
  onPlayIntro: () => void;
  onBack: () => void;
}

const LevelSelect: React.FC<LevelSelectProps> = ({ progress, onSelectLevel, onPlayIntro, onBack }) => {
  return (
    <div className="min-h-screen bg-[#1a1a2e] p-4 md:p-8 overflow-y-auto">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 sticky top-0 bg-[#1a1a2e]/95 backdrop-blur-md py-4 z-30 border-b border-slate-800">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition"
          >
            <ArrowLeft size={28} />
          </button>
          <h1 className="text-3xl font-black text-white tracking-tight">Chapters</h1>
        </div>

        {/* Chapters List */}
        <div className="space-y-8 pb-12">
          
          {/* Prologue Card */}
          <div className="bg-gradient-to-br from-blue-900 to-slate-800 rounded-2xl overflow-hidden border border-blue-500/30 hover:border-blue-400 transition-all group shadow-xl">
             <div className="p-8 flex flex-col md:flex-row items-center gap-8">
                <div className="p-5 bg-blue-950/50 rounded-full text-yellow-400 group-hover:scale-110 transition-transform shadow-inner">
                   <Star size={40} fill="currentColor" />
                </div>
                <div className="flex-1 text-center md:text-left">
                   <h2 className="text-2xl font-bold text-white mb-2">Prologue: Why Chess?</h2>
                   <p className="text-blue-200 text-base">The basics before the board. Start here if you are new.</p>
                </div>
                <button 
                  onClick={onPlayIntro}
                  className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-3 px-8 rounded-xl shadow-lg flex items-center gap-2 transform group-hover:translate-x-1 transition"
                >
                   <PlayCircle size={20} /> Watch Intro
                </button>
             </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {CURRICULUM.map((chapter, cIdx) => {
              const isChapterUnlocked = cIdx <= progress.unlockedChapterIdx;
              const isChapterCompleted = cIdx < progress.unlockedChapterIdx;

              return (
                <div 
                  key={chapter.id} 
                  className={`relative bg-slate-800/50 rounded-2xl overflow-hidden border transition-all ${isChapterUnlocked ? 'border-slate-700 hover:border-slate-600' : 'border-slate-800 opacity-60 grayscale'}`}
                >
                  {!isChapterUnlocked && (
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center z-20">
                      <div className="flex flex-col items-center text-slate-500 gap-2">
                        <Lock className="w-12 h-12" />
                        <span className="font-bold uppercase tracking-widest text-sm">Locked</span>
                      </div>
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h2 className={`text-xl font-bold ${isChapterUnlocked ? 'text-white' : 'text-slate-500'}`}>
                        <span className="text-slate-500 mr-2">#{cIdx + 1}</span>
                        {chapter.title}
                      </h2>
                      {isChapterCompleted && <CheckCircle className="text-green-500 w-6 h-6" />}
                    </div>
                    <p className="text-slate-400 text-sm mb-6 max-w-lg">{chapter.description}</p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {chapter.levels.map((level, lIdx) => {
                        const isLevelUnlocked = isChapterCompleted || (isChapterUnlocked && lIdx <= progress.unlockedLevelIdx);
                        const isCurrent = isChapterUnlocked && !isChapterCompleted && lIdx === progress.unlockedLevelIdx;
                        
                        return (
                          <button
                            key={level.id}
                            disabled={!isLevelUnlocked}
                            onClick={() => onSelectLevel(cIdx, lIdx)}
                            className={`
                              relative text-left px-4 py-3 rounded-xl flex flex-col justify-between h-20 transition-all border
                              ${isCurrent 
                                ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-900/50 scale-105 z-10' 
                                : isLevelUnlocked 
                                    ? 'bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600 hover:border-slate-500' 
                                    : 'bg-slate-800/50 border-transparent text-slate-600 cursor-not-allowed'}
                            `}
                          >
                             <span className="text-xs font-bold uppercase tracking-wider opacity-70">Level {lIdx + 1}</span>
                             <div className="self-end">
                                {isLevelUnlocked ? <PlayCircle size={20} /> : <Lock size={16} />}
                             </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelSelect;
