
import React from 'react';
import { ArrowLeft, Monitor, Type, Eye, Tag, Volume2, VolumeX } from 'lucide-react';
import { UserSettings } from '../types';
import { soundManager } from '../services/sound';

interface SettingsProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
  onBack: () => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onUpdateSettings, onBack }) => {
  
  const toggleContrast = () => {
    onUpdateSettings({ ...settings, highContrast: !settings.highContrast });
    soundManager.playSelect();
  };

  const toggleHints = () => {
    onUpdateSettings({ ...settings, showHints: !settings.showHints });
    soundManager.playSelect();
  };

  const togglePieceLabels = () => {
    onUpdateSettings({ ...settings, showPieceLabels: !settings.showPieceLabels });
    soundManager.playSelect();
  };

  const toggleTextSize = () => {
    onUpdateSettings({ 
      ...settings, 
      textSize: settings.textSize === 'normal' ? 'large' : 'normal' 
    });
    soundManager.playSelect();
  };

  const toggleSound = () => {
    const newState = !settings.soundEnabled;
    onUpdateSettings({ ...settings, soundEnabled: newState });
    soundManager.setEnabled(newState);
    if (newState) soundManager.playSelect();
  };

  return (
    <div className="min-h-screen bg-[#1a1a2e] flex flex-col items-center p-6 animate-in slide-in-from-right duration-300">
      <div className="w-full max-w-md">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => { soundManager.playSelect(); onBack(); }}
            className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
        </div>

        {/* Options */}
        <div className="space-y-4">
          
          {/* Sound */}
          <button 
            onClick={toggleSound}
            className="w-full bg-slate-800 p-6 rounded-xl flex items-center justify-between hover:bg-slate-700 transition group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-900 rounded-lg text-green-400 group-hover:text-green-300">
                {settings.soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
              </div>
              <div className="text-left">
                <h3 className="font-bold text-white">Sound Effects</h3>
                <p className="text-sm text-slate-400">{settings.soundEnabled ? 'On' : 'Off'}</p>
              </div>
            </div>
             <div className={`w-12 h-6 rounded-full relative transition-colors ${settings.soundEnabled ? 'bg-green-500' : 'bg-slate-600'}`}>
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.soundEnabled ? 'left-7' : 'left-1'}`} />
            </div>
          </button>

          {/* High Contrast */}
          <button 
            onClick={toggleContrast}
            className="w-full bg-slate-800 p-6 rounded-xl flex items-center justify-between hover:bg-slate-700 transition group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-900 rounded-lg text-blue-400 group-hover:text-blue-300">
                <Eye size={24} />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-white">High Contrast</h3>
                <p className="text-sm text-slate-400">Black & White board</p>
              </div>
            </div>
            <div className={`w-12 h-6 rounded-full relative transition-colors ${settings.highContrast ? 'bg-green-500' : 'bg-slate-600'}`}>
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.highContrast ? 'left-7' : 'left-1'}`} />
            </div>
          </button>

          {/* Text Size */}
          <button 
            onClick={toggleTextSize}
            className="w-full bg-slate-800 p-6 rounded-xl flex items-center justify-between hover:bg-slate-700 transition group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-900 rounded-lg text-purple-400 group-hover:text-purple-300">
                <Type size={24} />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-white">Text Size</h3>
                <p className="text-sm text-slate-400">{settings.textSize === 'large' ? 'Large' : 'Normal'}</p>
              </div>
            </div>
            <div className={`px-4 py-1 rounded bg-slate-900 font-bold ${settings.textSize === 'large' ? 'text-lg' : 'text-sm'}`}>
              Aa
            </div>
          </button>

          {/* Show Hints */}
          <button 
            onClick={toggleHints}
            className="w-full bg-slate-800 p-6 rounded-xl flex items-center justify-between hover:bg-slate-700 transition group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-900 rounded-lg text-yellow-400 group-hover:text-yellow-300">
                <Monitor size={24} />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-white">Move Hints</h3>
                <p className="text-sm text-slate-400">Highlight valid squares</p>
              </div>
            </div>
             <div className={`w-12 h-6 rounded-full relative transition-colors ${settings.showHints ? 'bg-green-500' : 'bg-slate-600'}`}>
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.showHints ? 'left-7' : 'left-1'}`} />
            </div>
          </button>

          {/* Show Piece Names */}
          <button 
            onClick={togglePieceLabels}
            className="w-full bg-slate-800 p-6 rounded-xl flex items-center justify-between hover:bg-slate-700 transition group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-900 rounded-lg text-pink-400 group-hover:text-pink-300">
                <Tag size={24} />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-white">Show Piece Names</h3>
                <p className="text-sm text-slate-400">Labels on board</p>
              </div>
            </div>
             <div className={`w-12 h-6 rounded-full relative transition-colors ${settings.showPieceLabels ? 'bg-green-500' : 'bg-slate-600'}`}>
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.showPieceLabels ? 'left-7' : 'left-1'}`} />
            </div>
          </button>

        </div>
      </div>
    </div>
  );
};

export default Settings;
