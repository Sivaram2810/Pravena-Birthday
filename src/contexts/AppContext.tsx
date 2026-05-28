import React, { createContext, useContext, useState, useCallback } from 'react';

interface AppState {
  candleCarried: boolean;
  vaultUnlocked: boolean;
  currentPlanet: string | null;
  audioPlaying: boolean;
  audioMuted: boolean;
  visitedPlanets: Set<string>;
  quizScore: number | null;
}

interface AppContextType extends AppState {
  setCandle: (v: boolean) => void;
  unlockVault: () => void;
  setCurrentPlanet: (p: string | null) => void;
  toggleAudio: () => void;
  toggleMute: () => void;
  visitPlanet: (p: string) => void;
  setQuizScore: (s: number) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [candleCarried, setCandleCarried] = useState(false);
  const [vaultUnlocked, setVaultUnlocked] = useState(false);
  const [currentPlanet, setCurrentPlanetState] = useState<string | null>(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);
  const [visitedPlanets, setVisitedPlanets] = useState<Set<string>>(new Set());
  const [quizScore, setQuizScoreState] = useState<number | null>(null);

  const setCandle = useCallback((v: boolean) => setCandleCarried(v), []);
  const unlockVault = useCallback(() => setVaultUnlocked(true), []);
  const setCurrentPlanet = useCallback((p: string | null) => setCurrentPlanetState(p), []);
  const toggleAudio = useCallback(() => setAudioPlaying(prev => !prev), []);
  const toggleMute = useCallback(() => setAudioMuted(prev => !prev), []);
  const visitPlanet = useCallback((p: string) => setVisitedPlanets(prev => new Set([...prev, p])), []);
  const setQuizScore = useCallback((s: number) => setQuizScoreState(s), []);

  return (
    <AppContext.Provider value={{
      candleCarried, vaultUnlocked, currentPlanet, audioPlaying, audioMuted,
      visitedPlanets, quizScore,
      setCandle, unlockVault, setCurrentPlanet, toggleAudio, toggleMute,
      visitPlanet, setQuizScore,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
};
