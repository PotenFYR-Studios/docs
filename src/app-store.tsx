/*
 * app-store.ts-tiny React context store (no external state lib): toasts,
 * cheat-sheet/terminal/search overlay and toast state.
 */
import * as React from "react";

export type Toast = {
  id: number;
  icon?: "sparkles" | "flame" | "terminal" | "egg";
  title: string;
  body?: string;
};

type AppState = {
  toasts: Toast[];
  pushToast: (t: Omit<Toast, "id">) => void;
  dismissToast: (id: number) => void;

  cheatOpen: boolean;
  setCheatOpen: (v: boolean) => void;

  deckOpen: boolean;
  setDeckOpen: (v: boolean) => void;

  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;

  rogMode: boolean;
  setRogMode: (v: boolean) => void;
};

const Ctx = React.createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);
  const [cheatOpen, setCheatOpen] = React.useState(false);
  const [deckOpen, setDeckOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [rogMode, setRogMode] = React.useState(false);

  const dismissToast = React.useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const pushToast = React.useCallback(
    (t: Omit<Toast, "id">) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev.slice(-3), { ...t, id }]);
      setTimeout(() => dismissToast(id), 4200);
    },
    [dismissToast]
  );

  const value = React.useMemo(
    () => ({ toasts, pushToast, dismissToast, cheatOpen, setCheatOpen, deckOpen, setDeckOpen, searchOpen, setSearchOpen, rogMode, setRogMode }),
    [toasts, pushToast, dismissToast, cheatOpen, deckOpen, searchOpen, rogMode]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppStore(): AppState {
  const v = React.useContext(Ctx);
  if (!v) throw new Error("useAppStore outside provider");
  return v;
}
