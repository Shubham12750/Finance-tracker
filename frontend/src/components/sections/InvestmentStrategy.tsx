import React from "react";
import {
  HelpCircle,
  Info,
  TrendingUp,
  BarChart3,
  Building,
  Landmark,
  Coins,
  FileText,
  Settings,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";

interface InvestmentBreakdown {
  mutualFundsRatio: number;
  stocksRatio: number;
  debtRatio: number;
  fixedDepositsRatio: number;
  digitalGoldRatio: number;
  othersRatio: number;
}

interface CustomReturns {
  mutualFundsReturn: number;
  stocksReturn: number;
  debtReturn: number;
  fixedDepositsReturn: number;
  digitalGoldReturn: number;
  othersReturn: number;
}

interface InvestmentStrategyConfig {
  name: string;
  description: string;
  mutualFunds: number;
  stocks: number;
  debt: number;
  fixedDeposits: number;
  digitalGold: number;
  others: number;
}

interface InvestmentStrategyProps {
  selectedInvestmentStrategy: string;
  investmentStrategies: Record<string, InvestmentStrategyConfig>;
  investmentBreakdown: InvestmentBreakdown;
  customReturns: CustomReturns | undefined;
  useCustomReturns: boolean;
  expectedReturn: number;
  investmentRatio: number;
  tooltipVisible: string | null;
  onInvestmentStrategyChange: (strategy: string) => void;
  onInvestmentBreakdownChange: (
    field: keyof InvestmentBreakdown,
    value: number
  ) => void;
  onCustomReturnChange: (field: keyof CustomReturns, value: number) => void;
  onCustomReturnsToggle: (enabled: boolean) => void;
  onResetInvestmentAllocation?: () => void;
  onTooltipShow: (type: string) => void;
  onTooltipHide: () => void;
  getInvestmentAmount: (ratio: number) => string;
  calculateAmount: (ratio: number) => string;
}

const InvestmentStrategy: React.FC<InvestmentStrategyProps> = ({
  selectedInvestmentStrategy,
  investmentStrategies,
  investmentBreakdown,
  customReturns,
  useCustomReturns,
  expectedReturn,
  investmentRatio,
  tooltipVisible,
  onInvestmentStrategyChange,
  onInvestmentBreakdownChange,
  onCustomReturnChange,
  onCustomReturnsToggle,
  onResetInvestmentAllocation,
  onTooltipShow,
  onTooltipHide,
  getInvestmentAmount,
  calculateAmount,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
        Investment Strategy
      </h3>

      <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Allocate your investment amount across different asset classes. Choose a
        preset strategy or customize your own allocation.
      </div>

      {/* Investment Strategy Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Choose Investment Strategy
        </label>
        <select
          value={selectedInvestmentStrategy}
          onChange={(e) => onInvestmentStrategyChange(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
                     focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          {Object.entries(investmentStrategies).map(([key, strategy]) => (
            <option key={key} value={key}>
              {strategy.name}
            </option>
          ))}
        </select>

        {selectedInvestmentStrategy !== "custom" && (
          <div className="mt-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-green-800 dark:text-green-200 font-medium">
                {
                  investmentStrategies[
                    selectedInvestmentStrategy as keyof typeof investmentStrategies
                  ].name
                }{" "}
                Strategy
              </p>
              <span className="text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-800 px-2 py-1 rounded">
                Preset Applied
              </span>
            </div>
            <p className="text-xs text-green-700 dark:text-green-300 mb-3">
              {
                investmentStrategies[
                  selectedInvestmentStrategy as keyof typeof investmentStrategies
                ].description
              }
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="bg-white dark:bg-gray-800 p-2 rounded border">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Mutual Funds
                </div>
                <div className="font-semibold text-blue-700 dark:text-blue-300">
                  {(
                    investmentStrategies[
                      selectedInvestmentStrategy as keyof typeof investmentStrategies
                    ].mutualFunds * 100
                  ).toFixed(0)}
                  %
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {getInvestmentAmount(
                    investmentStrategies[
                      selectedInvestmentStrategy as keyof typeof investmentStrategies
                    ].mutualFunds
                  )}
                  /mo
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-2 rounded border">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Stocks
                </div>
                <div className="font-semibold text-green-700 dark:text-green-300">
                  {(
                    investmentStrategies[
                      selectedInvestmentStrategy as keyof typeof investmentStrategies
                    ].stocks * 100
                  ).toFixed(0)}
                  %
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {getInvestmentAmount(
                    investmentStrategies[
                      selectedInvestmentStrategy as keyof typeof investmentStrategies
                    ].stocks
                  )}
                  /mo
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-2 rounded border">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Debt
                </div>
                <div className="font-semibold text-yellow-700 dark:text-yellow-300">
                  {(
                    investmentStrategies[
                      selectedInvestmentStrategy as keyof typeof investmentStrategies
                    ].debt * 100
                  ).toFixed(0)}
                  %
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {getInvestmentAmount(
                    investmentStrategies[
                      selectedInvestmentStrategy as keyof typeof investmentStrategies
                    ].debt
                  )}
                  /mo
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-2 rounded border">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Fixed Deposits
                </div>
                <div className="font-semibold text-orange-700 dark:text-orange-300">
                  {(
                    investmentStrategies[
                      selectedInvestmentStrategy as keyof typeof investmentStrategies
                    ].fixedDeposits * 100
                  ).toFixed(0)}
                  %
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {getInvestmentAmount(
                    investmentStrategies[
                      selectedInvestmentStrategy as keyof typeof investmentStrategies
                    ].fixedDeposits
                  )}
                  /mo
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-2 rounded border">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Digital Gold
                </div>
                <div className="font-semibold text-amber-700 dark:text-amber-300">
                  {(
                    investmentStrategies[
                      selectedInvestmentStrategy as keyof typeof investmentStrategies
                    ].digitalGold * 100
                  ).toFixed(0)}
                  %
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {getInvestmentAmount(
                    investmentStrategies[
                      selectedInvestmentStrategy as keyof typeof investmentStrategies
                    ].digitalGold
                  )}
                  /mo
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-2 rounded border">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Others
                </div>
                <div className="font-semibold text-purple-700 dark:text-purple-300">
                  {(
                    investmentStrategies[
                      selectedInvestmentStrategy as keyof typeof investmentStrategies
                    ].others * 100
                  ).toFixed(0)}
                  %
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {getInvestmentAmount(
                    investmentStrategies[
                      selectedInvestmentStrategy as keyof typeof investmentStrategies
                    ].others
                  )}
                  /mo
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedInvestmentStrategy === "custom" && (
          <>
            <div className="mt-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/40 dark:to-gray-900/20 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md px-0 py-0">
              <div className="flex items-center gap-4 px-6 py-5">
                <span className="inline-flex items-center justify-center h-11 w-11 rounded-full bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-sm">
                  <Settings className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                </span>
                <div>
                  <div className="text-lg font-bold text-gray-800 dark:text-gray-100 leading-tight">
                    Custom Investment Strategy
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Adjust the sliders below to create your personalized
                    allocation.
                  </div>
                </div>
              </div>
            </div>
            {onResetInvestmentAllocation && (
              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={onResetInvestmentAllocation}
                  className="flex items-center gap-1 px-3 py-2 text-xs font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800/40 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg border border-gray-300 dark:border-gray-600 shadow transition-colors duration-200"
                  title="Reset Allocation"
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Reset
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Investment Allocation Sliders */}
      {investmentBreakdown && selectedInvestmentStrategy === "custom" && (
        <div className="space-y-4">
          {/* Mutual Funds */}
          <div className="relative">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Mutual Funds (SIPs)
                </label>
                <button
                  type="button"
                  onMouseEnter={() => onTooltipShow("mutualFunds")}
                  onMouseLeave={onTooltipHide}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <HelpCircle className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  max="80"
                  value={(investmentBreakdown.mutualFundsRatio * 100).toFixed(
                    1
                  )}
                  onChange={(e) =>
                    onInvestmentBreakdownChange(
                      "mutualFundsRatio",
                      parseFloat(e.target.value) / 100
                    )
                  }
                  className="w-16 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  %
                </span>
              </div>
            </div>

            {tooltipVisible === "mutualFunds" && (
              <div className="absolute top-8 left-0 right-0 bg-gray-800 dark:bg-gray-700 text-white text-xs p-2 rounded shadow-lg z-10">
                Systematic Investment Plans in diversified mutual funds for
                long-term wealth creation
              </div>
            )}

            {/* Only show sliders for custom strategy */}
            {selectedInvestmentStrategy === "custom" && (
              <>
                <input
                  type="range"
                  min="0.0"
                  max="0.8"
                  step="0.001"
                  value={investmentBreakdown.mutualFundsRatio}
                  onChange={(e) =>
                    onInvestmentBreakdownChange(
                      "mutualFundsRatio",
                      parseFloat(e.target.value)
                    )
                  }
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>0%</span>
                  <span>80%</span>
                </div>
              </>
            )}
          </div>

          {/* Stocks */}
          <div className="relative">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4 text-green-600 dark:text-green-400" />
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Direct Stocks
                </label>
                <button
                  type="button"
                  onMouseEnter={() => onTooltipShow("stocks")}
                  onMouseLeave={onTooltipHide}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <HelpCircle className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  max="50"
                  value={(investmentBreakdown.stocksRatio * 100).toFixed(1)}
                  onChange={(e) =>
                    onInvestmentBreakdownChange(
                      "stocksRatio",
                      parseFloat(e.target.value) / 100
                    )
                  }
                  className="w-16 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  %
                </span>
              </div>
            </div>

            {tooltipVisible === "stocks" && (
              <div className="absolute top-8 left-0 right-0 bg-gray-800 dark:bg-gray-700 text-white text-xs p-2 rounded shadow-lg z-10">
                Direct investment in individual company stocks for higher growth
                potential
              </div>
            )}

            {/* Only show sliders for custom strategy */}
            {selectedInvestmentStrategy === "custom" && (
              <>
                <input
                  type="range"
                  min="0.0"
                  max="0.5"
                  step="0.001"
                  value={investmentBreakdown.stocksRatio}
                  onChange={(e) =>
                    onInvestmentBreakdownChange(
                      "stocksRatio",
                      parseFloat(e.target.value)
                    )
                  }
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>0%</span>
                  <span>50%</span>
                </div>
              </>
            )}
          </div>

          {/* Debt */}
          <div className="relative">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                <Building className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Debt Instruments
                </label>
                <button
                  type="button"
                  onMouseEnter={() => onTooltipShow("debt")}
                  onMouseLeave={onTooltipHide}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <HelpCircle className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  max="40"
                  value={(investmentBreakdown.debtRatio * 100).toFixed(1)}
                  onChange={(e) =>
                    onInvestmentBreakdownChange(
                      "debtRatio",
                      parseFloat(e.target.value) / 100
                    )
                  }
                  className="w-16 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  %
                </span>
              </div>
            </div>

            {tooltipVisible === "debt" && (
              <div className="absolute top-8 left-0 right-0 bg-gray-800 dark:bg-gray-700 text-white text-xs p-2 rounded shadow-lg z-10">
                Government bonds, corporate bonds, and debt mutual funds for
                stable returns
              </div>
            )}

            {/* Only show sliders for custom strategy */}
            {selectedInvestmentStrategy === "custom" && (
              <>
                <input
                  type="range"
                  min="0.0"
                  max="0.4"
                  step="0.001"
                  value={investmentBreakdown.debtRatio}
                  onChange={(e) =>
                    onInvestmentBreakdownChange(
                      "debtRatio",
                      parseFloat(e.target.value)
                    )
                  }
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>0%</span>
                  <span>40%</span>
                </div>
              </>
            )}
          </div>

          {/* Fixed Deposits */}
          <div className="relative">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                <Landmark className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Fixed Deposits
                </label>
                <button
                  type="button"
                  onMouseEnter={() => onTooltipShow("fixedDeposits")}
                  onMouseLeave={onTooltipHide}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <HelpCircle className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  max="30"
                  value={(investmentBreakdown.fixedDepositsRatio * 100).toFixed(
                    1
                  )}
                  onChange={(e) =>
                    onInvestmentBreakdownChange(
                      "fixedDepositsRatio",
                      parseFloat(e.target.value) / 100
                    )
                  }
                  className="w-16 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  %
                </span>
              </div>
            </div>

            {tooltipVisible === "fixedDeposits" && (
              <div className="absolute top-8 left-0 right-0 bg-gray-800 dark:bg-gray-700 text-white text-xs p-2 rounded shadow-lg z-10">
                Bank fixed deposits and recurring deposits for guaranteed
                returns
              </div>
            )}

            {/* Only show sliders for custom strategy */}
            {selectedInvestmentStrategy === "custom" && (
              <>
                <input
                  type="range"
                  min="0.0"
                  max="0.3"
                  step="0.001"
                  value={investmentBreakdown.fixedDepositsRatio}
                  onChange={(e) =>
                    onInvestmentBreakdownChange(
                      "fixedDepositsRatio",
                      parseFloat(e.target.value)
                    )
                  }
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>0%</span>
                  <span>30%</span>
                </div>
              </>
            )}
          </div>

          {/* Digital Gold */}
          <div className="relative">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                <Coins className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Digital Gold
                </label>
                <button
                  type="button"
                  onMouseEnter={() => onTooltipShow("digitalGold")}
                  onMouseLeave={onTooltipHide}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <HelpCircle className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  max="15"
                  value={(investmentBreakdown.digitalGoldRatio * 100).toFixed(
                    1
                  )}
                  onChange={(e) =>
                    onInvestmentBreakdownChange(
                      "digitalGoldRatio",
                      parseFloat(e.target.value) / 100
                    )
                  }
                  className="w-16 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  %
                </span>
              </div>
            </div>

            {tooltipVisible === "digitalGold" && (
              <div className="absolute top-8 left-0 right-0 bg-gray-800 dark:bg-gray-700 text-white text-xs p-2 rounded shadow-lg z-10">
                Digital gold investments for portfolio diversification and
                inflation hedge
              </div>
            )}

            {/* Only show sliders for custom strategy */}
            {selectedInvestmentStrategy === "custom" && (
              <>
                <input
                  type="range"
                  min="0.0"
                  max="0.15"
                  step="0.001"
                  value={investmentBreakdown.digitalGoldRatio}
                  onChange={(e) =>
                    onInvestmentBreakdownChange(
                      "digitalGoldRatio",
                      parseFloat(e.target.value)
                    )
                  }
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>0%</span>
                  <span>15%</span>
                </div>
              </>
            )}
          </div>

          {/* Others */}
          <div className="relative">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Others
                </label>
                <button
                  type="button"
                  onMouseEnter={() => onTooltipShow("others")}
                  onMouseLeave={onTooltipHide}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <HelpCircle className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  max="20"
                  value={(investmentBreakdown.othersRatio * 100).toFixed(1)}
                  onChange={(e) =>
                    onInvestmentBreakdownChange(
                      "othersRatio",
                      parseFloat(e.target.value) / 100
                    )
                  }
                  className="w-16 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  %
                </span>
              </div>
            </div>

            {tooltipVisible === "others" && (
              <div className="absolute top-8 left-0 right-0 bg-gray-800 dark:bg-gray-700 text-white text-xs p-2 rounded shadow-lg z-10">
                REITs, commodities, crypto, PPF, EPF, and other alternative
                investments
              </div>
            )}

            {/* Only show sliders for custom strategy */}
            {selectedInvestmentStrategy === "custom" && (
              <>
                <input
                  type="range"
                  min="0.0"
                  max="0.2"
                  step="0.001"
                  value={investmentBreakdown.othersRatio}
                  onChange={(e) =>
                    onInvestmentBreakdownChange(
                      "othersRatio",
                      parseFloat(e.target.value)
                    )
                  }
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>0%</span>
                  <span>20%</span>
                </div>
              </>
            )}
          </div>

          {/* Investment Allocation Summary */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Investment Allocation Summary
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Mutual Funds (SIPs):
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-medium text-blue-700 dark:text-blue-300">
                    {(investmentBreakdown.mutualFundsRatio * 100).toFixed(1)}%
                  </span>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {getInvestmentAmount(investmentBreakdown.mutualFundsRatio)}
                    /month
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Direct Stocks:
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-medium text-green-700 dark:text-green-300">
                    {(investmentBreakdown.stocksRatio * 100).toFixed(1)}%
                  </span>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {getInvestmentAmount(investmentBreakdown.stocksRatio)}/month
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Building className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Debt Instruments:
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-medium text-yellow-700 dark:text-yellow-300">
                    {(investmentBreakdown.debtRatio * 100).toFixed(1)}%
                  </span>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {getInvestmentAmount(investmentBreakdown.debtRatio)}/month
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Landmark className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Fixed Deposits:
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-medium text-orange-700 dark:text-orange-300">
                    {(investmentBreakdown.fixedDepositsRatio * 100).toFixed(1)}%
                  </span>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {getInvestmentAmount(
                      investmentBreakdown.fixedDepositsRatio
                    )}
                    /month
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Coins className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Digital Gold:
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-medium text-amber-700 dark:text-amber-300">
                    {(investmentBreakdown.digitalGoldRatio * 100).toFixed(1)}%
                  </span>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {getInvestmentAmount(investmentBreakdown.digitalGoldRatio)}
                    /month
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Others:
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-medium text-purple-700 dark:text-purple-300">
                    {(investmentBreakdown.othersRatio * 100).toFixed(1)}%
                  </span>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {getInvestmentAmount(investmentBreakdown.othersRatio)}/month
                  </div>
                </div>
              </div>
              <div className="border-t border-green-200 dark:border-green-600 pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    Total Investment Allocated:
                  </span>
                  <div className="text-right">
                    <span
                      className={`font-bold ${
                        Math.abs(
                          investmentBreakdown.mutualFundsRatio +
                            investmentBreakdown.stocksRatio +
                            investmentBreakdown.debtRatio +
                            investmentBreakdown.fixedDepositsRatio +
                            investmentBreakdown.digitalGoldRatio +
                            investmentBreakdown.othersRatio -
                            1
                        ) < 0.01
                          ? "text-success-600 dark:text-success-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {(
                        (investmentBreakdown.mutualFundsRatio +
                          investmentBreakdown.stocksRatio +
                          investmentBreakdown.debtRatio +
                          investmentBreakdown.fixedDepositsRatio +
                          investmentBreakdown.digitalGoldRatio +
                          investmentBreakdown.othersRatio) *
                        100
                      ).toFixed(1)}
                      %
                    </span>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {calculateAmount(investmentRatio)}/month
                    </div>
                  </div>
                </div>
                {Math.abs(
                  investmentBreakdown.mutualFundsRatio +
                    investmentBreakdown.stocksRatio +
                    investmentBreakdown.debtRatio +
                    investmentBreakdown.fixedDepositsRatio +
                    investmentBreakdown.digitalGoldRatio +
                    investmentBreakdown.othersRatio -
                    1
                ) >= 0.01 && (
                  <div className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center space-x-1">
                    <AlertTriangle className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                    <span>Total should equal 100%</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Investment Return Configuration */}
          <div className="mt-6 space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span>Expected Returns Configuration</span>
            </h4>

            <div className="text-xs text-gray-600 dark:text-gray-400 mb-4">
              Configure expected annual returns for each asset class. These
              rates are used to calculate your overall portfolio's weighted
              average return.
            </div>

            {/* Toggle for Custom Returns */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full ">
                  <BarChart3 className="h-4 w-4 text-green-600 dark:text-green-400" />
                </span>
                <div>
                  <div className="text-sm font-semibold text-green-800 dark:text-green-200 leading-tight">
                    Use Custom Return Rates
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                    Override default historical averages with your own
                    expectations
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0 flex items-center justify-end w-full sm:w-auto mt-2 sm:mt-0">
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={useCustomReturns}
                    onChange={(e) => onCustomReturnsToggle(e.target.checked)}
                    className="sr-only peer"
                  />
                  <span
                    className={`w-12 h-7 flex items-center rounded-full border transition-colors duration-300 relative px-1 ${
                      useCustomReturns
                        ? "bg-green-500 border-green-500"
                        : "bg-gray-200 dark:bg-gray-600 border-gray-300 dark:border-gray-500"
                    }`}
                  >
                    <span
                      className="h-5 w-5 bg-white dark:bg-gray-200 rounded-full shadow-md absolute transition-transform duration-300"
                      style={{
                        transform: useCustomReturns
                          ? "translateX(20px)"
                          : "translateX(0)",
                        transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
                      }}
                    ></span>
                  </span>
                </label>
              </div>
            </div>

            {/* Custom Returns Configuration */}
            {useCustomReturns && customReturns && (
              <div className="space-y-3 p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                <h5 className="text-xs font-semibold text-orange-800 dark:text-orange-200 mb-3">
                  Custom Return Rates (Annual %)
                </h5>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Mutual Funds Return */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center space-x-1">
                      <TrendingUp className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                      <span>Mutual Funds (SIPs)</span>
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="5"
                        max="25"
                        step="0.1"
                        value={(customReturns.mutualFundsReturn * 100).toFixed(
                          1
                        )}
                        onChange={(e) =>
                          onCustomReturnChange(
                            "mutualFundsReturn",
                            parseFloat(e.target.value) / 100
                          )
                        }
                        className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        %
                      </span>
                    </div>
                  </div>

                  {/* Stocks Return */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center space-x-1">
                      <BarChart3 className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                      <span>Direct Stocks</span>
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="8"
                        max="30"
                        step="0.1"
                        value={(customReturns.stocksReturn * 100).toFixed(1)}
                        onChange={(e) =>
                          onCustomReturnChange(
                            "stocksReturn",
                            parseFloat(e.target.value) / 100
                          )
                        }
                        className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        %
                      </span>
                    </div>
                  </div>

                  {/* Debt Return */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center space-x-1">
                      <Building className="h-3.5 w-3.5 text-yellow-600 dark:text-yellow-400" />
                      <span>Debt Instruments</span>
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="4"
                        max="12"
                        step="0.1"
                        value={(customReturns.debtReturn * 100).toFixed(1)}
                        onChange={(e) =>
                          onCustomReturnChange(
                            "debtReturn",
                            parseFloat(e.target.value) / 100
                          )
                        }
                        className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        %
                      </span>
                    </div>
                  </div>

                  {/* Fixed Deposits Return */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center space-x-1">
                      <Landmark className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" />
                      <span>Fixed Deposits</span>
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="3"
                        max="10"
                        step="0.1"
                        value={(
                          customReturns.fixedDepositsReturn * 100
                        ).toFixed(1)}
                        onChange={(e) =>
                          onCustomReturnChange(
                            "fixedDepositsReturn",
                            parseFloat(e.target.value) / 100
                          )
                        }
                        className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        %
                      </span>
                    </div>
                  </div>

                  {/* Digital Gold Return */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center space-x-1">
                      <Coins className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                      <span>Digital Gold</span>
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="5"
                        max="15"
                        step="0.1"
                        value={(customReturns.digitalGoldReturn * 100).toFixed(
                          1
                        )}
                        onChange={(e) =>
                          onCustomReturnChange(
                            "digitalGoldReturn",
                            parseFloat(e.target.value) / 100
                          )
                        }
                        className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        %
                      </span>
                    </div>
                  </div>

                  {/* Others Return */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center space-x-1">
                      <FileText className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                      <span>Others (PPF, REITs, etc.)</span>
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="4"
                        max="18"
                        step="0.1"
                        value={(customReturns.othersReturn * 100).toFixed(1)}
                        onChange={(e) =>
                          onCustomReturnChange(
                            "othersReturn",
                            parseFloat(e.target.value) / 100
                          )
                        }
                        className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        %
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 p-3 bg-orange-100 dark:bg-orange-900/30 rounded border border-orange-200 dark:border-orange-700">
                  <div className="flex items-center space-x-2">
                    <Info className="h-4 w-4 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                    <p className="text-xs text-orange-800 dark:text-orange-200">
                      <span className="font-medium">
                        Weighted Average Return:
                      </span>{" "}
                      {(expectedReturn * 100).toFixed(2)}% (calculated from your
                      investment allocation × custom return rates)
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Default Returns Display */}
            {!useCustomReturns && (
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h5 className="text-xs font-semibold text-blue-800 dark:text-blue-200 mb-3">
                  Default Return Rates (Annual %) - Based on Historical Averages
                </h5>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center space-x-1 text-gray-600 dark:text-gray-300">
                      <TrendingUp className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                      <span>Mutual Funds:</span>
                    </span>
                    <span className="font-medium text-blue-700 dark:text-blue-300">
                      14.0%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center space-x-1 text-gray-600 dark:text-gray-300">
                      <BarChart3 className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                      <span>Stocks:</span>
                    </span>
                    <span className="font-medium text-green-700 dark:text-green-300">
                      16.0%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center space-x-1 text-gray-600 dark:text-gray-300">
                      <Building className="h-3.5 w-3.5 text-yellow-600 dark:text-yellow-400" />
                      <span>Debt:</span>
                    </span>
                    <span className="font-medium text-yellow-700 dark:text-yellow-300">
                      8.0%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center space-x-1 text-gray-600 dark:text-gray-300">
                      <Landmark className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" />
                      <span>Fixed Deposits:</span>
                    </span>
                    <span className="font-medium text-orange-700 dark:text-orange-300">
                      6.5%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center space-x-1 text-gray-600 dark:text-gray-300">
                      <Coins className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                      <span>Digital Gold:</span>
                    </span>
                    <span className="font-medium text-amber-700 dark:text-amber-300">
                      10.0%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center space-x-1 text-gray-600 dark:text-gray-300">
                      <FileText className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                      <span>Others:</span>
                    </span>
                    <span className="font-medium text-purple-700 dark:text-purple-300">
                      9.0%
                    </span>
                  </div>
                </div>
                <div className="mt-3 p-2 bg-blue-100 dark:bg-blue-900/30 rounded border border-blue-200 dark:border-blue-700">
                  <div className="flex items-center space-x-2">
                    <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <p className="text-xs text-blue-800 dark:text-blue-200">
                      <span className="font-medium">
                        Weighted Average Return:
                      </span>{" "}
                      {(expectedReturn * 100).toFixed(2)}% (calculated from your
                      investment allocation × historical averages)
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestmentStrategy;
