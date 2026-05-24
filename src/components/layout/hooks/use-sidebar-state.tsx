"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const SIDEBAR_KEYBOARD_SHORTCUT = "s";

export type SidebarState = "expanded" | "collapsed";

const SIDEBAR_STATE_KEY = "sidebar_state";

type SidebarStateContextValue = {
  state: SidebarState;
  collapsed: boolean;
  toggle: () => void;
  setState: (state: SidebarState) => void;
};

const SidebarStateContext = createContext<SidebarStateContextValue | null>(null);

function getInitialState(): SidebarState {
  if (typeof window === "undefined") {
    return "expanded";
  }

  const stored = window.localStorage.getItem(SIDEBAR_STATE_KEY);
  return stored === "collapsed" ? "collapsed" : "expanded";
}

export function SidebarStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SidebarState>(() => getInitialState());

  useEffect(() => {
    window.localStorage.setItem(SIDEBAR_STATE_KEY, state);
  }, [state]);

  const collapsed = state === "collapsed";
  const toggle = useCallback(() => {
    setState((prev) => (prev === "expanded" ? "collapsed" : "expanded"));
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key.toLowerCase() !== SIDEBAR_KEYBOARD_SHORTCUT ||
        !(event.metaKey || event.ctrlKey) ||
        event.altKey
      ) {
        return;
      }

      event.preventDefault();
      toggle();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggle]);

  const value = useMemo(
    () => ({
      state,
      collapsed,
      toggle,
      setState,
    }),
    [state, collapsed, toggle],
  );

  return <SidebarStateContext.Provider value={value}>{children}</SidebarStateContext.Provider>;
}

export function useSidebarState() {
  const context = useContext(SidebarStateContext);
  if (!context) {
    throw new Error("useSidebarState must be used within a SidebarStateProvider.");
  }
  return context;
}
