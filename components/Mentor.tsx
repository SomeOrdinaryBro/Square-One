
import React, { useEffect, useState } from 'react';
import { Bot, CheckCircle, XCircle, Lightbulb } from 'lucide-react';

interface MentorProps {
  text: string;
  mood: 'neutral' | 'success' | 'error' | 'hint';
}

const Mentor: React.FC<MentorProps> = ({ text, mood }) => {
  // Removed internal animation state to keep UI stable

  // Mood styles
  let cardStyles = 'border-slate-700 bg-slate-800/80';
  let iconColor = 'text-blue-400';
  let Icon = Bot;

  if (mood === 'success') {
    cardStyles = 'border-green-500/30 bg-green-900/10';
    iconColor = 'text-green-400';
    Icon = CheckCircle;
  } else if (mood === 'error') {
    cardStyles = 'border-red-500/30 bg-red-900/10';
    iconColor = 'text-red-400';
    Icon = XCircle;
  } else if (mood === 'hint') {
    cardStyles = 'border-yellow-500/30 bg-yellow-900/10';
    iconColor = 'text-yellow-400';
    Icon = Lightbulb;
  }

  return (
    <div className={`w-full p-5 rounded-2xl border backdrop-blur-md shadow-sm transition-colors duration-300 flex gap-4 ${cardStyles}`}>
      <div className={`shrink-0 p-3 bg-slate-900/50 rounded-xl border border-white/5`}>
        <Icon className={`w-8 h-8 ${iconColor}`} />
      </div>
      <div className="flex-1 flex flex-col justify-center">
        <h3 className={`text-xs font-bold uppercase tracking-widest mb-1 ${iconColor}`}>Bit (Mentor)</h3>
        <p className="text-lg md:text-xl leading-snug text-slate-100 font-medium font-fredoka transition-opacity duration-200">
            "{text}"
        </p>
      </div>
    </div>
  );
};

export default Mentor;
