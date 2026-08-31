import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/useTheme";

// Header button that flips between dark and light mode (state lives in useTheme).
export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      onClick={toggle}
      className="ml-1 rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      title={isDark ? "Light mode" : "Dark mode"}
      aria-label="Toggle dark mode"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}