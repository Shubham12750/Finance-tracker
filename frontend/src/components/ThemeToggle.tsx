import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const ThemeToggle: React.FC = () => {
  const { toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative inline-flex items-center justify-center w-12 h-12 rounded-lg
        transition-all duration-200 ease-in-out
        ${
          isDark
            ? "bg-gray-800 hover:bg-gray-700 text-yellow-400"
            : "bg-white hover:bg-gray-50 text-gray-600"
        }
        border border-gray-200 dark:border-gray-700
        shadow-sm hover:shadow-md
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        dark:focus:ring-offset-gray-900
      `}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <div className="relative w-5 h-5">
        <Sun
          className={`
            absolute inset-0 w-5 h-5 transition-all duration-300 ease-in-out
            ${
              isDark
                ? "opacity-0 rotate-90 scale-0"
                : "opacity-100 rotate-0 scale-100"
            }
          `}
        />
        <Moon
          className={`
            absolute inset-0 w-5 h-5 transition-all duration-300 ease-in-out
            ${
              isDark
                ? "opacity-100 rotate-0 scale-100"
                : "opacity-0 -rotate-90 scale-0"
            }
          `}
        />
      </div>
    </button>
  );
};

export default ThemeToggle;
