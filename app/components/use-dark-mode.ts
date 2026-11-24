import { useEffect, useState } from "react";

/**
 * Whether the page is in dark mode, and a toggle that flips it. The choice is
 * saved under `cadence-theme`, which the inline script in `app/root.tsx`
 * reads before first paint.
 */
export function useDarkMode() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggleDarkMode() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("cadence-theme", next ? "dark" : "light");
    } catch {}
  }

  return { isDark, toggleDarkMode };
}
