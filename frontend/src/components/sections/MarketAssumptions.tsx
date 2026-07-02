import React from "react";
import { Info } from "lucide-react";

interface MarketAssumptionsProps {
  expectedReturn: number;
  inflationRate: number;
  salaryGrowthRate: number;
  investmentTimeHorizon: number;
  useCustomReturns: boolean;
  useRealisticExpenses?: boolean;
  onChange: (field: string, value: number) => void;
  onToggle?: (field: string, value: boolean) => void;
}

const MarketAssumptions: React.FC<MarketAssumptionsProps> = ({
  expectedReturn,
  inflationRate,
  salaryGrowthRate,
  investmentTimeHorizon,
  useCustomReturns,
  useRealisticExpenses = true,
  onChange,
  onToggle,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
        Market Assumptions
      </h3>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Expected Annual Return
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min="8"
              max="20"
              step="0.1"
              value={(expectedReturn * 100).toFixed(1)}
              onChange={(e) =>
                onChange("expectedReturn", parseFloat(e.target.value) / 100)
              }
              className="w-16 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <span className="text-xs text-gray-500 dark:text-gray-400">%</span>
          </div>
        </div>

        {/* Expected Return Explanation */}
        <div className="mb-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start space-x-2">
            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-blue-800 dark:text-blue-200">
              <p className="font-medium mb-1">
                Auto-calculated using weighted average from Investment Strategy:
              </p>
              <p>
                This return is dynamically calculated based on your investment
                allocation and
                {useCustomReturns
                  ? " your custom return rates (configured in Investment Strategy section)"
                  : " historical averages (Mutual Funds: 14%, Stocks: 16%, Debt: 8%, FDs: 6.5%, Gold: 10%, Others: 9%)"}
                . You can{" "}
                {useCustomReturns
                  ? "adjust the return rates in the Investment Strategy section above or "
                  : "enable custom return rates in the Investment Strategy section or "}
                override this value manually if needed.
              </p>
            </div>
          </div>
        </div>

        <input
          type="range"
          min="0.08"
          max="0.20"
          step="0.001"
          value={expectedReturn}
          onChange={(e) =>
            onChange("expectedReturn", parseFloat(e.target.value))
          }
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>8%</span>
          <span>20%</span>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Inflation Rate
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min="3"
              max="10"
              step="0.1"
              value={(inflationRate * 100).toFixed(1)}
              onChange={(e) =>
                onChange("inflationRate", parseFloat(e.target.value) / 100)
              }
              className="w-16 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <span className="text-xs text-gray-500 dark:text-gray-400">%</span>
          </div>
        </div>
        <input
          type="range"
          min="0.03"
          max="0.10"
          step="0.001"
          value={inflationRate}
          onChange={(e) =>
            onChange("inflationRate", parseFloat(e.target.value))
          }
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>3%</span>
          <span>10%</span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Average rate at which general prices increase over time
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Salary Growth Rate
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min="5"
              max="15"
              step="0.1"
              value={(salaryGrowthRate * 100).toFixed(1)}
              onChange={(e) =>
                onChange("salaryGrowthRate", parseFloat(e.target.value) / 100)
              }
              className="w-16 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <span className="text-xs text-gray-500 dark:text-gray-400">%</span>
          </div>
        </div>
        <input
          type="range"
          min="0.05"
          max="0.15"
          step="0.001"
          value={salaryGrowthRate}
          onChange={(e) =>
            onChange("salaryGrowthRate", parseFloat(e.target.value))
          }
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>5%</span>
          <span>15%</span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Expected annual increase in salary due to promotions, experience, and
          inflation adjustments
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Investment Time Horizon
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min="5"
              max="50"
              step="1"
              value={investmentTimeHorizon}
              onChange={(e) =>
                onChange("investmentTimeHorizon", parseInt(e.target.value))
              }
              className="w-16 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              years
            </span>
          </div>
        </div>
        <input
          type="range"
          min="5"
          max="50"
          step="1"
          value={investmentTimeHorizon}
          onChange={(e) =>
            onChange("investmentTimeHorizon", parseInt(e.target.value))
          }
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>5 years</span>
          <span>50 years</span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          How many years you plan to invest actively. After this period, your
          investments continue to grow but you stop adding new money.
        </p>
      </div>

      {/* Expense Model Toggle */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Expense Growth Model
          </label>
          <div className="flex items-center space-x-2">
            <span
              className={`text-xs ${
                useRealisticExpenses
                  ? "text-gray-500"
                  : "text-primary-600 font-medium"
              }`}
            >
              Legacy
            </span>
            <button
              type="button"
              onClick={() =>
                onToggle?.("useRealisticExpenses", !useRealisticExpenses)
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                useRealisticExpenses
                  ? "bg-primary-600"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  useRealisticExpenses ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span
              className={`text-xs ${
                useRealisticExpenses
                  ? "text-primary-600 font-medium"
                  : "text-gray-500"
              }`}
            >
              Realistic
            </span>
          </div>
        </div>

        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
          <div className="flex items-start space-x-2">
            <Info className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-amber-800 dark:text-amber-200">
              <p className="font-medium mb-1">
                {useRealisticExpenses
                  ? "🎯 Realistic Model (Recommended)"
                  : "⚠️ Legacy Model"}
                :
              </p>
              {useRealisticExpenses ? (
                <p>
                  Expenses grow realistically with lifestyle saturation. Needs
                  cap at 2.5x starting salary, wants cap at 1.8x. This allows
                  investment ratio to increase as income grows beyond lifestyle
                  needs, making financial independence achievable.
                </p>
              ) : (
                <p>
                  Expenses grow proportionally with salary + inflation
                  indefinitely. This often leads to unrealistic scenarios where
                  expenses exceed salary at higher income levels, making
                  break-even impossible with traditional allocation ratios.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketAssumptions;
