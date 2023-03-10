import { create } from "zustand";

type ThemeStore = {
  isDark: boolean;
  switchTheme: () => void;
};

export const useThemeStore = create<ThemeStore>((set) => ({
  isDark: true,
  switchTheme: () => set((state) => ({ isDark: !state.isDark })),
}));
