import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { PLANETS } from '../data/content';

// ═══════════════════════════════════════════════════
//  App State — The memory of the universe
// ═══════════════════════════════════════════════════

interface VisitRecord {
  count: number;
  lastVisit: number;
  secretUnlocked: boolean;
}

interface AppState {
  // Phase management
  phase: 'opening' | 'solar' | 'planet';
  selectedPlanet: string | null;

  // Persistent exploration memory
  visitedPlanets: Set<string>;
  visitRecords: Map<string, VisitRecord>;
  allPlanetsVisited: boolean;
  totalVisits: number;

  // Audio
  audioPlaying: boolean;
  audioMuted: boolean;

  // Discovered secrets
  discoveredSecrets: Set<string>;
  easterEggFound: boolean;

  // Candle mechanic
  candleCarried: boolean;

  // Quiz
  quizScore: number | null;
  quizCompleted: boolean;

  // Void confession index
  voidIndex: number;

  // Wish revealed
  wishRevealed: boolean;

  // Special unlock: all planets visited
  universeComplete: boolean;

  // Return visit
  sessionCount: number;
}

interface AppContextType extends AppState {
  // Navigation
  goToSolar: () => void;
  goToPlanet: (id: string) => void;
  goBack: () => void;

  // Audio
  toggleAudio: () => void;
  toggleMute: () => void;
  setAudioPlaying: (v: boolean) => void;

  // Secrets
  discoverSecret: (id: string) => void;
  foundEasterEgg: () => void;

  // Candle
  setCandle: (v: boolean) => void;

  // Quiz
  setQuizScore: (s: number) => void;
  setQuizCompleted: () => void;

  // Void
  nextVoidConfession: () => void;

  // Wish
  revealWish: () => void;

  // Mutation
  resetJourney: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

// LocalStorage persistence key
const STORAGE_KEY = 'pravena_universe_v2';

const loadPersistedState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      ...parsed,
      visitedPlanets: new Set(parsed.visitedPlanets || []),
      visitRecords: new Map(Object.entries(parsed.visitRecords || {})),
      discoveredSecrets: new Set(parsed.discoveredSecrets || []),
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
  } catch {
    // Storage unavailable — graceful degradation
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const persisted = loadPersistedState();

  const [phase, setPhase] = useState<AppState['phase']>('opening');
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

  // Save session count once on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY) || '{}';
      const parsed = JSON.parse(raw);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...parsed, sessionCount }));
    } catch { /* ignore */ }
  }, []);

  // Computed
  const totalVisits = Array.from(visitRecords.values()).reduce((sum, r) => sum + r.count, 0);
  const allPlanetsVisited = PLANETS.every(p => visitedPlanets.has(p.id));

  // Persist on key state changes
  const persistTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (persistTimerRef.current) clearTimeout(persistTimerRef.current);
    persistTimerRef.current = setTimeout(() => {
      saveState({ visitedPlanets, visitRecords, discoveredSecrets, quizScore, quizCompleted, easterEggFound, universeComplete, sessionCount, wishRevealed, voidIndex });
    }, 300);
    return () => { if (persistTimerRef.current) clearTimeout(persistTimerRef.current); };
  }, [visitedPlanets, visitRecords, discoveredSecrets, quizScore, quizCompleted, easterEggFound, universeComplete, wishRevealed, voidIndex]);

  // Navigation
  const goToSolar = useCallback(() => {
    setSelectedPlanet(null);
    setPhase('solar');
  }, []);

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

  const goBack = useCallback(() => {
    setSelectedPlanet(null);
    setPhase('solar');
  }, []);

  // Check universe completion
  useEffect(() => {
    if (allPlanetsVisited && !universeComplete) {
      setTimeout(() => setUniverseComplete(true), 1000);
    }
  }, [allPlanetsVisited, universeComplete]);

  // Audio
  const toggleAudio = useCallback(() => setAudioPlayingState(prev => !prev), []);
  const toggleMute = useCallback(() => setAudioMuted(prev => !prev), []);
  const setAudioPlaying = useCallback((v: boolean) => setAudioPlayingState(v), []);

  // Secrets
  const discoverSecret = useCallback((id: string) => {
    setDiscoveredSecrets((prev: Set<string>) => new Set([...prev, id]));
  }, []);

  const foundEasterEgg = useCallback(() => {
    setEasterEggFound(true);
  }, []);

  // Candle
  const setCandle = useCallback((v: boolean) => setCandleCarried(v), []);

  // Quiz
  const setQuizScore = useCallback((s: number) => setQuizScoreState(s), []);
  const setQuizCompleted = useCallback(() => setQuizCompletedState(true), []);

  // Void
  const nextVoidConfession = useCallback(() => {
    setVoidIndex((prev: number) => prev + 1);
  }, []);

  // Wish
  const revealWish = useCallback(() => setWishRevealed(true), []);

  // Reset
  const resetJourney = useCallback(() => {
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
    window.location.reload();
  }, []);

  const value: AppContextType = {
    phase, selectedPlanet,
    visitedPlanets, visitRecords, allPlanetsVisited, totalVisits,
    audioPlaying, audioMuted,
    discoveredSecrets, easterEggFound,
    candleCarried,
    quizScore, quizCompleted,
    voidIndex,
    wishRevealed,
    universeComplete,
    sessionCount,
    goToSolar, goToPlanet, goBack,
    toggleAudio, toggleMute, setAudioPlaying,
    discoverSecret, foundEasterEgg,
    setCandle,
    setQuizScore, setQuizCompleted,
    nextVoidConfession,
    revealWish,
    resetJourney,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
