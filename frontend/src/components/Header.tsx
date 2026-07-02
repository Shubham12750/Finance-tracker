import React from "react";
import { TrendingUp } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-slate-900 shadow-sm border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-slate-900 dark:text-white" />
              <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                FinanceTracker
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#analyzer"
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              Analyzer
            </a>
            <a
              href="#about"
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              About
            </a>
            <a
              href="#contact"
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              Contact
            </a>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-6">
            <ThemeToggle />
            <div className="hidden md:flex items-center space-x-4">
              <a
                href="#login"
                className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-primary-600 transition-colors"
              >
                Log In
              </a>
              <button className="btn-primary text-sm px-5 py-2">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
