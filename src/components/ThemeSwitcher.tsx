import React from "react";
import { create } from "zustand";

import { BsMoonStars, BsSun } from "react-icons/bs";
import { useThemeStore } from "@/state/theme-store";

function ThemeSwitcher() {
  const { isDark, switchTheme } = useThemeStore();

  React.useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <label className="swap swap-rotate text-2xl hover:text-red-600 dark:hover:text-indigo-300">
      <input type="checkbox" onClick={switchTheme} />
      <BsMoonStars className="swap-off" />
      <BsSun className="swap-on" />
    </label>
  );
}

export default ThemeSwitcher;
