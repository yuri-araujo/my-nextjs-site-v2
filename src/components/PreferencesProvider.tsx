"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";
import { dictionary, type Dictionary, type Lang } from "@/lib/i18n";

export type Theme = "dark" | "light";

type PreferencesContextValue = {
  theme: Theme;
  toggleTheme: () => void;
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  t: Dictionary;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);
const PREFS_EVENT = "ya-prefs-change";

function subscribePrefs(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(PREFS_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(PREFS_EVENT, onStoreChange);
  };
}

function getThemeSnapshot(): Theme {
  try {
    const saved = window.localStorage.getItem("ya-theme");
    return saved === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

function getLangSnapshot(): Lang {
  try {
    const saved = window.localStorage.getItem("ya-lang");
    return saved === "pt" ? "pt" : "en";
  } catch {
    return "en";
  }
}

export function PreferencesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useSyncExternalStore<Theme>(
    subscribePrefs,
    getThemeSnapshot,
    () => "dark"
  );
  const lang = useSyncExternalStore<Lang>(
    subscribePrefs,
    getLangSnapshot,
    () => "en"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleTheme = useCallback(() => {
    const next: Theme = getThemeSnapshot() === "dark" ? "light" : "dark";
    try {
      window.localStorage.setItem("ya-theme", next);
    } catch {
      // ignore storage errors
    }
    window.dispatchEvent(new Event(PREFS_EVENT));
  }, []);

  const setLang = useCallback((next: Lang) => {
    try {
      window.localStorage.setItem("ya-lang", next);
    } catch {
      // ignore storage errors
    }
    window.dispatchEvent(new Event(PREFS_EVENT));
  }, []);

  const toggleLang = useCallback(() => {
    const next: Lang = getLangSnapshot() === "en" ? "pt" : "en";
    setLang(next);
  }, [setLang]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      if (event.key.toLowerCase() === "t") {
        toggleTheme();
      } else if (event.key.toLowerCase() === "l") {
        toggleLang();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggleTheme, toggleLang]);

  return (
    <PreferencesContext.Provider
      value={{
        theme,
        toggleTheme,
        lang,
        setLang,
        toggleLang,
        t: dictionary[lang],
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) {
    throw new Error("usePreferences must be used within PreferencesProvider");
  }
  return ctx;
}
