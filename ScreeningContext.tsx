'use client';

// ─── ScreeningContext ────────────────────────────────────────────────────────
// Provides image data and analysis results across the multi-page flow.
// Uses sessionStorage so state survives Next.js App Router navigations without
// needing a global state library.
// ─────────────────────────────────────────────────────────────────────────────

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { AnalysisResult, ScreeningState } from '@/lib/types';

const STORAGE_KEY = 'scoliocheck_session';

interface ScreeningContextValue extends ScreeningState {
  setImage:  (dataUrl: string, isDemoMode: boolean) => void;
  setResult: (result: AnalysisResult) => void;
  reset:     () => void;
}

const defaultState: ScreeningState = {
  imageDataUrl: null,
  result:       null,
  isDemoMode:   false,
};

const ScreeningContext = createContext<ScreeningContextValue | null>(null);

export function ScreeningProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ScreeningState>(defaultState);

  // Rehydrate from sessionStorage on mount
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) setState(JSON.parse(raw));
    } catch {
      // sessionStorage unavailable (SSR, private mode) – continue without
    }
  }, []);

  const persist = useCallback((next: ScreeningState) => {
    setState(next);
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // noop
    }
  }, []);

  const setImage = useCallback(
    (dataUrl: string, isDemoMode: boolean) => {
      persist({ imageDataUrl: dataUrl, result: null, isDemoMode });
    },
    [persist],
  );

  const setResult = useCallback(
    (result: AnalysisResult) => {
      setState((prev) => {
        const next: ScreeningState = { ...prev, result };
        try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /**/ }
        return next;
      });
    },
    [],
  );

  const reset = useCallback(() => {
    try { sessionStorage.removeItem(STORAGE_KEY); } catch { /**/ }
    setState(defaultState);
  }, []);

  return (
    <ScreeningContext.Provider value={{ ...state, setImage, setResult, reset }}>
      {children}
    </ScreeningContext.Provider>
  );
}

export function useScreening(): ScreeningContextValue {
  const ctx = useContext(ScreeningContext);
  if (!ctx) throw new Error('useScreening must be used within <ScreeningProvider>');
  return ctx;
}
