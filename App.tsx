import React, { useState, useEffect } from 'react';
import MainMenu from './components/MainMenu';
import LevelSelect from './components/LevelSelect';
import Game from './components/Game';
import Settings from './components/Settings';
import IntroChapter from './components/IntroChapter';
import { getProgress, getSettings, saveProgress, saveSettings, resetProgress } from './utils/storage';
import { UserProgress, UserSettings, ViewState } from './types';
import { soundManager } from './services/sound';

// Wrapper for smooth screen transitions
const ViewTransition = ({ children, viewKey }: { children: React.ReactNode, viewKey: string }) => (
  <div key={viewKey} className="view-container animate-fade-in-up">
    {children}
  </div>
);

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('menu');
  
  const [settings, setSettings] = useState<UserSettings>(getSettings());
  const [progress, setProgress] = useState<UserProgress>(getProgress());

  // Game launch params
  const [gameConfig, setGameConfig] = useState<{
    chapterIdx: number;
    levelIdx: number;
    isQuickGame: boolean;
  }>({ chapterIdx: 0, levelIdx: 0, isQuickGame: false });

  // 1. Hide Global Loader on Mount
  useEffect(() => {
    const loader = document.getElementById('global-loader');
    if (loader) {
      // Small delay to ensure React renders the initial frame
      setTimeout(() => {
        loader.classList.add('loaded');
        setTimeout(() => loader.remove(), 600); // Remove from DOM after transition
      }, 500);
    }
  }, []);

  // 2. Initialize Sound Interactions
  useEffect(() => {
    const handleInteraction = () => {
        soundManager.init();
        soundManager.setEnabled(settings.soundEnabled);
    };
    window.addEventListener('click', handleInteraction, { once: true });
    return () => window.removeEventListener('click', handleInteraction);
  }, [settings.soundEnabled]);

  // --- Handlers ---

  const handleNewGame = () => {
    if (progress.unlockedChapterIdx > 0 || progress.unlockedLevelIdx > 0) {
      if (confirm("Starting a new game will reset your progress. Are you sure?")) {
        resetProgress();
        setProgress({ unlockedChapterIdx: 0, unlockedLevelIdx: 0 });
        setGameConfig({ chapterIdx: 0, levelIdx: 0, isQuickGame: false });
        setView('intro');
      }
    } else {
      setGameConfig({ chapterIdx: 0, levelIdx: 0, isQuickGame: false });
      setView('intro');
    }
  };

  const handleIntroComplete = () => {
      setGameConfig({ chapterIdx: 0, levelIdx: 0, isQuickGame: false });
      setView('game');
  };

  const handleContinue = () => {
    setGameConfig({ 
        chapterIdx: progress.unlockedChapterIdx, 
        levelIdx: progress.unlockedLevelIdx,
        isQuickGame: false
    });
    setView('game');
  };

  const handleSelectLevel = (chapterIdx: number, levelIdx: number) => {
    setGameConfig({ chapterIdx, levelIdx, isQuickGame: false });
    setView('game');
  };

  const handleQuickGame = () => {
    setGameConfig({ chapterIdx: 0, levelIdx: 0, isQuickGame: true });
    setView('game');
  };

  const handleSettingsUpdate = (newSettings: UserSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleLevelComplete = (completedChapterIdx: number, completedLevelIdx: number) => {
      const newProgress = { 
          unlockedChapterIdx: completedChapterIdx, 
          unlockedLevelIdx: completedLevelIdx 
      };
      saveProgress(newProgress); 
      setProgress(getProgress()); 

      setGameConfig({ 
          chapterIdx: completedChapterIdx, 
          levelIdx: completedLevelIdx, 
          isQuickGame: false 
      });
  };

  // Render View based on state
  const renderView = () => {
    switch (view) {
      case 'menu':
        return (
          <MainMenu 
            progress={progress}
            onNewGame={handleNewGame}
            onContinue={handleContinue}
            onSelectLevel={() => setView('levels')}
            onQuickGame={handleQuickGame}
            onSettings={() => setView('settings')}
          />
        );
      case 'intro':
        return <IntroChapter onComplete={handleIntroComplete} />;
      case 'levels':
        return (
          <LevelSelect 
            progress={progress}
            onSelectLevel={handleSelectLevel}
            onPlayIntro={() => setView('intro')}
            onBack={() => setView('menu')}
          />
        );
      case 'settings':
        return (
          <Settings 
            settings={settings}
            onUpdateSettings={handleSettingsUpdate}
            onBack={() => setView('menu')}
          />
        );
      case 'game':
        return (
          <Game 
            key={`${gameConfig.chapterIdx}-${gameConfig.levelIdx}-${gameConfig.isQuickGame}`}
            initialChapterIdx={gameConfig.chapterIdx}
            initialLevelIdx={gameConfig.levelIdx}
            isQuickGame={gameConfig.isQuickGame}
            settings={settings}
            onExit={() => setView('menu')}
            onLevelComplete={handleLevelComplete}
          />
        );
      default:
        return null;
    }
  };

  return (
    <ViewTransition viewKey={view}>
      {renderView()}
    </ViewTransition>
  );
};

export default App;