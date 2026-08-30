import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Analysis, AnalysisInputs, CoachMessage } from "./types";
import { demoAnalysis } from "@/data/demo-analysis";

const STORAGE_KEY = "careerlens.analysis.v1";
const CHAT_KEY = "careerlens.coach.v1";

interface Store {
  analysis: Analysis | null;
  messages: CoachMessage[];
  setAnalysis: (a: Analysis) => void;
  loadDemo: () => void;
  clear: () => void;
  setMessages: (m: CoachMessage[]) => void;
  ready: boolean;
}

const AnalysisContext = createContext<Store | null>(null);

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [analysis, setAnalysisState] = useState<Analysis | null>(null);
  const [messages, setMessagesState] = useState<CoachMessage[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setAnalysisState(JSON.parse(raw) as Analysis);
      const chat = window.localStorage.getItem(CHAT_KEY);
      if (chat) setMessagesState(JSON.parse(chat) as CoachMessage[]);
    } catch {
      // Corrupt or unavailable storage: start from a clean state.
    }
    setReady(true);
  }, []);

  const setAnalysis = useCallback((a: Analysis) => {
    setAnalysisState(a);
    setMessagesState([]);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(a));
      window.localStorage.removeItem(CHAT_KEY);
    } catch {
      /* storage unavailable — analysis stays in memory for this session */
    }
  }, []);

  const loadDemo = useCallback(() => setAnalysis({ ...demoAnalysis, createdAt: new Date().toISOString() }), [setAnalysis]);

  const clear = useCallback(() => {
    setAnalysisState(null);
    setMessagesState([]);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem(CHAT_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const setMessages = useCallback((m: CoachMessage[]) => {
    setMessagesState(m);
    try {
      window.localStorage.setItem(CHAT_KEY, JSON.stringify(m));
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(
    () => ({ analysis, messages, setAnalysis, loadDemo, clear, setMessages, ready }),
    [analysis, messages, setAnalysis, loadDemo, clear, setMessages, ready],
  );

  return <AnalysisContext.Provider value={value}>{children}</AnalysisContext.Provider>;
}

export function useAnalysisStore(): Store {
  const ctx = useContext(AnalysisContext);
  if (!ctx) throw new Error("useAnalysisStore must be used inside AnalysisProvider");
  return ctx;
}

export const emptyInputs: AnalysisInputs = {
  resumeText: "",
  resumeFileName: null,
  portfolioUrl: "",
  portfolioText: "",
  githubUrl: "",
  repoUrl: "",
  jobDescription: "",
  jobUrl: "",
};
