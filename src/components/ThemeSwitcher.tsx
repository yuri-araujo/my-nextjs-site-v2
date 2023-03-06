import React from "react";

import { BsMoonStars, BsSun } from "react-icons/bs";

function ThemeSwitcher() {
  const [theme, setTheme] = React.useState<string | null>("dark");

  React.useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const handleThemeSwitch = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <label className="swap swap-rotate text-2xl hover:text-orange-600 dark:hover:text-indigo-400">
      <input type="checkbox" onClick={handleThemeSwitch} />
      <BsMoonStars className="swap-off" />
      <BsSun className="swap-on" />
    </label>
  );
}

export default ThemeSwitcher;
