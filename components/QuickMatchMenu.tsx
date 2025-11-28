import React, { useMemo, useState } from 'react';
import { Brain, Compass, Swords, Zap, ArrowLeft } from 'lucide-react';
import { GameConfig, GameDifficulty } from '../types';
import { VARIANTS } from '../data/variants';

interface QuickMatchMenuProps {
  onStart: (config: GameConfig) => void;
  onBack: () => void;
}

const difficultyCopy: Record<GameDifficulty, string> = {
  easy: 'Casual',
  normal: 'Standard',
  hard: 'Challenging'
};

const difficultyBadge: Record<GameDifficulty, string> = {
  easy: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40',
  normal: 'bg-blue-500/20 text-blue-200 border-blue-400/40',
  hard: 'bg-rose-500/20 text-rose-200 border-rose-400/40'
};

const QuickMatchMenu: React.FC<QuickMatchMenuProps> = ({ onStart, onBack }) => {
  const [guidanceDifficulty, setGuidanceDifficulty] = useState<GameDifficulty>('normal');
  const [freeDifficulty, setFreeDifficulty] = useState<GameDifficulty>('easy');
  const [variantDifficulty, setVariantDifficulty] = useState<GameDifficulty>('normal');
  const [selectedVariantId, setSelectedVariantId] = useState<string>(VARIANTS[0]?.id || '');

  const selectedVariant = useMemo(
    () => VARIANTS.find((v) => v.id === selectedVariantId) || VARIANTS[0],
    [selectedVariantId]
  );

  const difficultyPill = (
    current: GameDifficulty,
    setter: (value: GameDifficulty) => void
  ) => (
    <div className="inline-flex rounded-full border border-white/5 bg-white/5 p-1 shadow-inner">
      {(['easy', 'normal', 'hard'] as GameDifficulty[]).map((value) => (
        <button
          key={value}
          onClick={() => setter(value)}
          className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200 ${
            current === value
              ? `${difficultyBadge[value]} shadow-lg`
              : 'text-slate-300 hover:text-white'
          }`}
        >
          {difficultyCopy[value]}
        </button>
      ))}
    </div>
  );

  const renderVariantSelector = () => (
    <div className="flex flex-col gap-3 mt-3">
      <div className="flex gap-2 flex-wrap">
        {VARIANTS.map((variant) => (
          <button
            key={variant.id}
            onClick={() => setSelectedVariantId(variant.id)}
            className={`px-3 py-2 rounded-xl border text-sm transition-all ${
              variant.id === selectedVariantId
                ? 'border-blue-400/60 bg-blue-500/10 text-white shadow-lg'
                : 'border-slate-700 bg-slate-800 text-slate-200 hover:border-blue-400/40 hover:text-white'
            }`}
          >
            {variant.name}
          </button>
        ))}
      </div>
      {selectedVariant && (
        <div className="text-sm text-slate-300 bg-slate-800/60 border border-slate-700 rounded-xl p-3">
          <p className="font-semibold text-white">{selectedVariant.name}</p>
          <p className="text-slate-300 leading-relaxed">{selectedVariant.description}</p>
          <p className="mt-2 text-xs text-slate-400 font-mono">FEN: {selectedVariant.fen}</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6 md:p-10 animate-in fade-in duration-500">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition active:scale-95"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Quick Match</p>
            <h1 className="text-3xl md:text-4xl font-black">Choose how you want to play</h1>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-3xl border border-blue-500/30 bg-gradient-to-br from-blue-900/40 via-slate-900 to-slate-900 shadow-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-200">
                <Brain />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-blue-200">Guidance Mode</p>
                <h2 className="text-2xl font-extrabold">Learn with hints</h2>
              </div>
            </div>
            <p className="text-slate-200 leading-relaxed">
              Get real-time arrows, best-move highlights, and gentle danger warnings while you play. Perfect for warming up or exploring ideas.
            </p>
            {difficultyPill(guidanceDifficulty, setGuidanceDifficulty)}
            <button
              onClick={() =>
                onStart({
                  mode: 'guidance',
                  difficulty: guidanceDifficulty,
                  hintsEnabled: true
                })
              }
              className="mt-auto w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-bold py-3 rounded-2xl shadow-xl active:scale-[0.98]"
            >
              <Zap size={18} /> Start Guided Play
            </button>
          </div>

          <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-900/30 via-slate-900 to-slate-900 shadow-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-200">
                <Swords />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">Free Play</p>
                <h2 className="text-2xl font-extrabold">Just you vs the bot</h2>
              </div>
            </div>
            <p className="text-slate-200 leading-relaxed">
              Standard chess starting position. Pick a difficulty and duel our built-in engine without any training wheels.
            </p>
            {difficultyPill(freeDifficulty, setFreeDifficulty)}
            <button
              onClick={() =>
                onStart({
                  mode: 'free',
                  difficulty: freeDifficulty,
                  hintsEnabled: false
                })
              }
              className="mt-auto w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-emerald-900 font-bold py-3 rounded-2xl shadow-xl active:scale-[0.98]"
            >
              <Compass size={18} /> Start Free Play
            </button>
          </div>

          <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-900/30 via-slate-900 to-slate-900 shadow-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-200">
                <Compass />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-purple-200">Variants</p>
                <h2 className="text-2xl font-extrabold">Curated drills</h2>
              </div>
            </div>
            <p className="text-slate-200 leading-relaxed">
              Jump into themed scenarios like Pawn Wars or Endgame Drills. Use hints or go without—your choice.
            </p>
            {difficultyPill(variantDifficulty, setVariantDifficulty)}
            {renderVariantSelector()}
            <button
              onClick={() =>
                onStart({
                  mode: 'variant',
                  difficulty: variantDifficulty,
                  hintsEnabled: true,
                  variantFen: selectedVariant?.fen,
                  variantName: selectedVariant?.name
                })
              }
              className="mt-auto w-full flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-400 text-white font-bold py-3 rounded-2xl shadow-xl active:scale-[0.98]"
            >
              <Brain size={18} /> Launch Variant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickMatchMenu;
