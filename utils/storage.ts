
import { UserProgress, UserSettings } from "../types";

const PROGRESS_KEY = 'chessZero_progress';
const SETTINGS_KEY = 'chessZero_settings';

const DEFAULT_SETTINGS: UserSettings = {
  highContrast: false,
  textSize: 'normal',
  showHints: true,
  showPieceLabels: true, // Beginner friendly default
  soundEnabled: true
};

const DEFAULT_PROGRESS: UserProgress = {
  unlockedChapterIdx: 0,
  unlockedLevelIdx: 0
};

export const getProgress = (): UserProgress => {
  try {
    const stored = localStorage.getItem(PROGRESS_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_PROGRESS;
  } catch (e) {
    return DEFAULT_PROGRESS;
  }
};

export const saveProgress = (progress: UserProgress) => {
  try {
    const current = getProgress();
    // Only update if the new progress is further ahead
    if (
      progress.unlockedChapterIdx > current.unlockedChapterIdx ||
      (progress.unlockedChapterIdx === current.unlockedChapterIdx && progress.unlockedLevelIdx > current.unlockedLevelIdx)
    ) {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    }
  } catch (e) {
    console.error("Failed to save progress", e);
  }
};

export const resetProgress = () => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(DEFAULT_PROGRESS));
}

export const getSettings = (): UserSettings => {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = (settings: UserSettings) => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error("Failed to save settings", e);
  }
};
