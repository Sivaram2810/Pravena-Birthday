import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { PLANETS } from '../data/content';

interface VisitRecord {
  count: number;
  lastVisit: number;
  secretUnlocked: boolean;
}

interface AppState {
  phase: 'opening' | 'solar' | 'planet';
  selectedPlanet: string | null;
  visitedPlanets: Set<string>;
  visitRecords: Map<string, VisitRecord>;
  allPlanetsVisited: boolean;
  totalVisits: number;
  audioPlaying: boolean;
  audioMuted: boolean;
  discoveredSecrets: Set<string>;
  easterEggFound: boolean;
  candleCarried: boolean;
  quizScore: number | null;
  quizCompleted: boolean;
  voidIndex: number;
  wishRevealed: boolean;
  universeComplete: boolean;
  sessionCount: number;
}

interface AppContextType extends AppState {
  goToSolar: () => void;
  goToPlanet: (id: string) => void;
  goBack: () => void;
  toggleAudio: () => void;
  toggleMute: () => void;
  setAudioPlaying: (v: boolean) => void;
  discoverSecret: (id: string) => void;
  foundEasterEgg: () => void;
  setCandle: (v: boolean) => void;
  setQuizScore: (s: number) => void;
  setQuizCompleted: () => void;
  nextVoidConfession: () => void;
  revealWish: () => void;
  resetJourney: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEY = 'pravena_universe_v3';

const loadPersistedState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      ...parsed,
      visitedPlanets: new Set<string>(parsed.visitedPlanets || []),
      visitRecords: new Map<string, VisitRecord>(Object.entries(parsed.visitRecords || {})),
      discoveredSecrets: new Set<string>(parsed.discoveredSecrets || []),
    };
  } catch {
    return null;
  }
};

const saveState = (state: Partial<AppState>) => {
  try {
    const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ...current,
      visitedPlanets: [...(state.visitedPlanets || new Set())],
      visitRecords: Object.fromEntries(state.visitRecords || new Map()),
      discoveredSecrets: [...(state.discoveredSecrets || new Set())],
      quizScore: state.quizScore,
      quizCompleted: state.quizCompleted,
      easterEggFound: state.easterEggFound,
      universeComplete: state.universeComplete,
      sessionCount: state.sessionCount,
      wishRevealed: state.wishRevealed,
      voidIndex: state.voidIndex,
    }));
  } catch { /* ignore */ }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const persisted = loadPersistedState();

  const [phase, setPhase] = useState<'opening' | 'solar' | 'planet'>('opening');
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [visitedPlanets, setVisitedPlanets] = useState<Set<string>>(persisted?.visitedPlanets || new Set());
  const [visitRecords, setVisitRecords] = useState<Map<string, VisitRecord>>(persisted?.visitRecords || new Map());
  const [audioPlaying, setAudioPlayingState] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);
  const [discoveredSecrets, setDiscoveredSecrets] = useState<Set<string>>(persisted?.discoveredSecrets || new Set());
  const [easterEggFound, setEasterEggFound] = useState(persisted?.easterEggFound || false);
  const [candleCarried, setCandleCarried] = useState(false);
  const [quizScore, setQuizScoreState] = useState<number | null>(persisted?.quizScore ?? null);
  const [quizCompleted, setQuizCompletedState] = useState(persisted?.quizCompleted || false);
  const [voidIndex, setVoidIndex] = useState(persisted?.voidIndex || 0);
  const [wishRevealed, setWishRevealed] = useState(persisted?.wishRevealed || false);
  const [universeComplete, setUniverseComplete] = useState(persisted?.universeComplete || false);
  const [sessionCount] = useState((persisted?.sessionCount || 0) + 1);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY) || '{}';
      const parsed = JSON.parse(raw);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...parsed, sessionCount }));
    } catch { /* ignore */ }
  }, []);

  const totalVisits = Array.from(visitRecords.values()).reduce((sum, r) => sum + r.count, 0);
  const allPlanetsVisited = PLANETS.every(p => visitedPlanets.has(p.id));

  const persistTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (persistTimerRef.current) clearTimeout(persistTimerRef.current);
    persistTimerRef.current = setTimeout(() => {
      saveState({ visitedPlanets, visitRecords, discoveredSecrets, quizScore, quizCompleted, easterEggFound, universeComplete, sessionCount, wishRevealed, voidIndex });
    }, 300);
    return () => { if (persistTimerRef.current) clearTimeout(persistTimerRef.current); };
  }, [visitedPlanets, visitRecords, discoveredSecrets, quizScore, quizCompleted, easterEggFound, universeComplete, wishRevealed, voidIndex]);

  const goToSolar = useCallback(() => { setSelectedPlanet(null); setPhase('solar'); }, []);
  const goToPlanet = useCallback((id: string) => {
    setSelectedPlanet(id);
    setPhase('planet');
    setVisitedPlanets(prev => new Set([...prev, id]));
    setVisitRecords(prev => {
      const next = new Map(prev);
      const existing = next.get(id) || { count: 0, lastVisit: 0, secretUnlocked: false };
      const planet = PLANETS.find(p => p.id === id);
      const newCount = existing.count + 1;
      next.set(id, {
        count: newCount,
        lastVisit: Date.now(),
        secretUnlocked: existing.secretUnlocked || (planet ? newCount >= planet.secretRevealAt : false),
      });
      return next;
    });
  }, []);
  const goBack = useCallback(() => { setSelectedPlanet(null); setPhase('solar'); }, []);

  useEffect(() => {
    if (allPlanetsVisited && !universeComplete) {
      setTimeout(() => setUniverseComplete(true), 1000);
    }
  }, [allPlanetsVisited, universeComplete]);

  const toggleAudio = useCallback(() => setAudioPlayingState(prev => !prev), []);
  const toggleMute = useCallback(() => setAudioMuted(prev => !prev), []);
  const setAudioPlaying = useCallback((v: boolean) => setAudioPlayingState(v), []);
  const discoverSecret = useCallback((id: string) => {
    setDiscoveredSecrets((prev: Set<string>) => new Set([...prev, id]));
  }, []);
  const foundEasterEgg = useCallback(() => { setEasterEggFound(true); }, []);
  const setCandle = useCallback((v: boolean) => setCandleCarried(v), []);
  const setQuizScore = useCallback((s: number) => setQuizScoreState(s), []);
  const setQuizCompleted = useCallback(() => setQuizCompletedState(true), []);
  const nextVoidConfession = useCallback(() => { setVoidIndex((prev: number) => prev + 1); }, []);
  const revealWish = useCallback(() => setWishRevealed(true), []);
  const resetJourney = useCallback(() => {
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
    window.location.reload();
  }, []);

  const value: AppContextType = {
    phase, selectedPlanet, visitedPlanets, visitRecords, allPlanetsVisited, totalVisits,
    audioPlaying, audioMuted, discoveredSecrets, easterEggFound, candleCarried,
    quizScore, quizCompleted, voidIndex, wishRevealed, universeComplete, sessionCount,
    goToSolar, goToPlanet, goBack, toggleAudio, toggleMute, setAudioPlaying,
    discoverSecret, foundEasterEgg, setCandle, setQuizScore, setQuizCompleted,
    nextVoidConfession, revealWish, resetJourney,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
