import { useEffect, useState } from "react";

// Simple dark/light theme hook. The choice is stored in localStorage and
// applied by toggling the `dark` class on <html> (Tailwind darkMode: class).
const KEY = "mediscan-theme";

// Add or remove the `dark` class on the root element.
function apply(theme) {
  const root = document.documentElement;
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
}

export function useTheme() {
  // Initialise from localStorage (defaults to light; safe on the server).
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light";
    return localStorage.getItem(KEY) || "light";
  });

  // Whenever the theme changes, apply it to the DOM and persist it.
  useEffect(() => {
    apply(theme);
    localStorage.setItem(KEY, theme);
  }, [theme]);

  // Flip between dark and light.
  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  return { theme, toggle };
}