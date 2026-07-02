import React from "react";
import { Heart, TrendingUp } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16 transition-colors duration-200">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <TrendingUp className="h-6 w-6 text-primary-600" />
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              Investment Break-Even Analyzer
            </span>
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Empowering you to make informed financial decisions and achieve
            financial independence.
          </p>

          <div className="flex items-center justify-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500 dark:text-red-400" />
            <span>for your financial future</span>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              © 2025 Investment Analyzer. Educational tool for financial
              planning. Always consult with financial advisors for investment
              decisions.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
