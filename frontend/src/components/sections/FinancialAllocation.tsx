import React from "react";
import {
  HelpCircle,
  TrendingUp,
  AlertTriangle,
  PiggyBank,
  RotateCcw,
} from "lucide-react";

interface FinancialAllocationProps {
  formData: {
    needsRatio: number;
    wantsRatio: number;
    investmentRatio: number;
    emergencyFundRatio: number;
  };
  selectedStrategy: string;
  allocationStrategies: Record<
    string,
    {
      name: string;
      description: string;
      needs: number;
      wants: number;
      investments: number;
      emergencyFund: number;
    }
  >;
  tooltipVisible: string | null;
  onStrategyChange: (strategy: string) => void;
  onRatioChange: (field: string, value: number) => void;
  onAmountChange: (field: string, amount: number) => void;
  onResetAllocation?: () => void;
  showTooltip: (field: string) => void;
  hideTooltip: () => void;
  getTooltipContent: (field: string) => string;
  calculateAmount: (ratio: number) => string;
  getMonthlyAmount: (ratio: number) => number;
}

const FinancialAllocation: React.FC<FinancialAllocationProps> = ({
  formData,
  selectedStrategy,
  allocationStrategies,
  tooltipVisible,
  onStrategyChange,
  onRatioChange,
  onAmountChange,
  onResetAllocation,
  showTooltip,
  hideTooltip,
  getTooltipContent,
  calculateAmount,
  getMonthlyAmount,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
        Financial Allocation
      </h3>

      <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Allocate your monthly salary across different categories. You can input
        either percentages or exact monthly amounts. The percentages should
        total 100%.
      </div>

      {/* Strategy Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Choose Allocation Strategy
        </label>
        <select
          value={selectedStrategy}
          onChange={(e) => onStrategyChange(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
                     focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          {Object.entries(allocationStrategies).map(([key, strategy]) => (
            <option key={key} value={key}>
              {strategy.name}
            </option>
          ))}
        </select>

        {selectedStrategy !== "custom" && (
          <div className="mt-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                {
                  allocationStrategies[
                    selectedStrategy as keyof typeof allocationStrategies
                  ].name
                }{" "}
                Strategy
              </p>
              <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded">
                Preset Applied
              </span>
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-300 mb-3">
              {
                allocationStrategies[
                  selectedStrategy as keyof typeof allocationStrategies
                ].description
              }
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3">
              <div className="bg-white dark:bg-gray-800 p-2 lg:p-3 rounded border min-w-0">
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  Needs
                </div>
                <div className="font-semibold text-blue-700 dark:text-blue-300 text-sm">
                  {(
                    allocationStrategies[
                      selectedStrategy as keyof typeof allocationStrategies
                    ].needs * 100
                  ).toFixed(0)}
                  %
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-2 lg:p-3 rounded border min-w-0">
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  Wants
                </div>
                <div className="font-semibold text-orange-700 dark:text-orange-300 text-sm">
                  {(
                    allocationStrategies[
                      selectedStrategy as keyof typeof allocationStrategies
                    ].wants * 100
                  ).toFixed(0)}
                  %
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-2 lg:p-3 rounded border min-w-0">
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  Invest.
                </div>
                <div className="font-semibold text-green-700 dark:text-green-300 text-sm">
                  {(
                    allocationStrategies[
                      selectedStrategy as keyof typeof allocationStrategies
                    ].investments * 100
                  ).toFixed(0)}
                  %
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-2 lg:p-3 rounded border min-w-0">
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  Emergency
                </div>
                <div className="font-semibold text-red-700 dark:text-red-300 text-sm">
                  {(
                    allocationStrategies[
                      selectedStrategy as keyof typeof allocationStrategies
                    ].emergencyFund * 100
                  ).toFixed(0)}
                  %
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedStrategy === "custom" && (
          <div className="mt-3 p-0 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl border border-orange-200 dark:border-orange-700 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-orange-100 dark:bg-orange-900/40 border border-orange-200 dark:border-orange-700">
                  <PiggyBank className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </span>
                <div>
                  <div className="text-base font-semibold text-orange-800 dark:text-orange-200 leading-tight">
                    Custom Allocation Strategy
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                    Adjust the sliders below to create your personalized
                    allocation.
                  </div>
                </div>
              </div>
              {onResetAllocation && (
                <button
                  type="button"
                  onClick={onResetAllocation}
                  className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg border border-red-200 dark:border-red-700 shadow-sm transition-colors"
                  title="Reset Allocation"
                >
                  <span className="mr-1">
                    <RotateCcw className="h-4 w-4" />
                  </span>
                  Reset
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Only show allocation controls for custom strategy */}
      {selectedStrategy === "custom" && (
        <>
          {/* Needs */}
          <div className="relative">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Needs (Essentials)
                </label>
                <button
                  type="button"
                  onMouseEnter={() => showTooltip("needs")}
                  onMouseLeave={hideTooltip}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <HelpCircle className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    max="70"
                    value={(formData.needsRatio * 100).toFixed(1)}
                    onChange={(e) =>
                      onRatioChange(
                        "needsRatio",
                        parseFloat(e.target.value) / 100
                      )
                    }
                    className="w-16 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    %
                  </span>
                </div>
                <span className="text-xs text-gray-400">or</span>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={getMonthlyAmount(formData.needsRatio)}
                    onChange={(e) =>
                      onAmountChange("needs", parseFloat(e.target.value) || 0)
                    }
                    className="w-20 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Monthly"
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    /mo
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right mb-2">
              <div className="text-xs text-primary-600 dark:text-primary-400 font-medium">
                {calculateAmount(formData.needsRatio)} per month
              </div>
            </div>

            {tooltipVisible === "needs" && (
              <div className="absolute top-8 left-0 right-0 bg-gray-800 dark:bg-gray-700 text-white text-xs p-2 rounded shadow-lg z-10">
                {getTooltipContent("needs")}
              </div>
            )}

            {/* Only show sliders for custom strategy */}
            {selectedStrategy === "custom" && (
              <>
                <input
                  type="range"
                  min="0.25"
                  max="0.70"
                  step="0.001"
                  value={formData.needsRatio}
                  onChange={(e) =>
                    onRatioChange("needsRatio", parseFloat(e.target.value))
                  }
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>25%</span>
                  <span>70%</span>
                </div>
              </>
            )}
          </div>

          {/* Wants */}
          <div className="relative">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Wants (Lifestyle)
                </label>
                <button
                  type="button"
                  onMouseEnter={() => showTooltip("wants")}
                  onMouseLeave={hideTooltip}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <HelpCircle className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    max="40"
                    value={(formData.wantsRatio * 100).toFixed(1)}
                    onChange={(e) =>
                      onRatioChange(
                        "wantsRatio",
                        parseFloat(e.target.value) / 100
                      )
                    }
                    className="w-16 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    %
                  </span>
                </div>
                <span className="text-xs text-gray-400">or</span>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={getMonthlyAmount(formData.wantsRatio)}
                    onChange={(e) =>
                      onAmountChange("wants", parseFloat(e.target.value) || 0)
                    }
                    className="w-20 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Monthly"
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    /mo
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right mb-2">
              <div className="text-xs text-warning-600 dark:text-warning-400 font-medium">
                {calculateAmount(formData.wantsRatio)} per month
              </div>
            </div>

            {tooltipVisible === "wants" && (
              <div className="absolute top-8 left-0 right-0 bg-gray-800 dark:bg-gray-700 text-white text-xs p-2 rounded shadow-lg z-10">
                {getTooltipContent("wants")}
              </div>
            )}

            {/* Only show sliders for custom strategy */}
            {selectedStrategy === "custom" && (
              <>
                <input
                  type="range"
                  min="0.05"
                  max="0.40"
                  step="0.001"
                  value={formData.wantsRatio}
                  onChange={(e) =>
                    onRatioChange("wantsRatio", parseFloat(e.target.value))
                  }
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>5%</span>
                  <span>40%</span>
                </div>
              </>
            )}
          </div>

          {/* Investments */}
          <div className="relative">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Investments (Wealth Building)
                </label>
                <button
                  type="button"
                  onMouseEnter={() => showTooltip("investments")}
                  onMouseLeave={hideTooltip}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <HelpCircle className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    max="50"
                    value={(formData.investmentRatio * 100).toFixed(1)}
                    onChange={(e) =>
                      onRatioChange(
                        "investmentRatio",
                        parseFloat(e.target.value) / 100
                      )
                    }
                    className="w-16 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    %
                  </span>
                </div>
                <span className="text-xs text-gray-400">or</span>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={getMonthlyAmount(formData.investmentRatio)}
                    onChange={(e) =>
                      onAmountChange(
                        "investment",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="w-20 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Monthly"
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    /mo
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right mb-2">
              <div className="text-xs text-success-600 dark:text-success-400 font-medium">
                {calculateAmount(formData.investmentRatio)} per month
              </div>
            </div>

            {tooltipVisible === "investments" && (
              <div className="absolute top-8 left-0 right-0 bg-gray-800 dark:bg-gray-700 text-white text-xs p-2 rounded shadow-lg z-10">
                {getTooltipContent("investments")}
              </div>
            )}

            {/* Only show sliders for custom strategy */}
            {selectedStrategy === "custom" && (
              <>
                <input
                  type="range"
                  min="0.10"
                  max="0.50"
                  step="0.001"
                  value={formData.investmentRatio}
                  onChange={(e) =>
                    onRatioChange("investmentRatio", parseFloat(e.target.value))
                  }
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>10%</span>
                  <span>50%</span>
                </div>
              </>
            )}
          </div>

          {/* Emergency Fund */}
          <div className="relative">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Emergency Fund
                </label>
                <button
                  type="button"
                  onMouseEnter={() => showTooltip("emergencyFund")}
                  onMouseLeave={hideTooltip}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <HelpCircle className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    max="25"
                    value={(formData.emergencyFundRatio * 100).toFixed(1)}
                    onChange={(e) =>
                      onRatioChange(
                        "emergencyFundRatio",
                        parseFloat(e.target.value) / 100
                      )
                    }
                    className="w-16 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    %
                  </span>
                </div>
                <span className="text-xs text-gray-400">or</span>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={getMonthlyAmount(formData.emergencyFundRatio)}
                    onChange={(e) =>
                      onAmountChange(
                        "emergencyFund",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="w-20 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Monthly"
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    /mo
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right mb-2">
              <div className="text-xs text-red-600 dark:text-red-400 font-medium">
                {calculateAmount(formData.emergencyFundRatio)} per month
              </div>
            </div>

            {tooltipVisible === "emergencyFund" && (
              <div className="absolute top-8 left-0 right-0 bg-gray-800 dark:bg-gray-700 text-white text-xs p-2 rounded shadow-lg z-10">
                {getTooltipContent("emergencyFund")}
              </div>
            )}

            {/* Only show sliders for custom strategy */}
            {selectedStrategy === "custom" && (
              <>
                <input
                  type="range"
                  min="0.05"
                  max="0.25"
                  step="0.001"
                  value={formData.emergencyFundRatio}
                  onChange={(e) =>
                    onRatioChange(
                      "emergencyFundRatio",
                      parseFloat(e.target.value)
                    )
                  }
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>5%</span>
                  <span>25%</span>
                </div>
              </>
            )}
          </div>

          {/* Allocation Summary */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Monthly Allocation Summary
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300 flex items-center space-x-1">
                  <PiggyBank className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                  <span>Needs (Essentials):</span>
                </span>
                <div className="text-right">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {(formData.needsRatio * 100).toFixed(1)}%
                  </span>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {calculateAmount(formData.needsRatio)}
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300 flex items-center space-x-1">
                  <TrendingUp className="h-4 w-4 text-warning-600 dark:text-warning-400" />
                  <span>Wants (Lifestyle):</span>
                </span>
                <div className="text-right">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {(formData.wantsRatio * 100).toFixed(1)}%
                  </span>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {calculateAmount(formData.wantsRatio)}
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300 flex items-center space-x-1">
                  <TrendingUp className="h-4 w-4 text-success-600 dark:text-success-400" />
                  <span>Investments:</span>
                </span>
                <div className="text-right">
                  <span className="font-medium text-success-600 dark:text-success-400">
                    {(formData.investmentRatio * 100).toFixed(1)}%
                  </span>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {calculateAmount(formData.investmentRatio)}
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300 flex items-center space-x-1">
                  <PiggyBank className="h-4 w-4 text-red-600 dark:text-red-400" />
                  <span>Emergency Fund:</span>
                </span>
                <div className="text-right">
                  <span className="font-medium text-red-600 dark:text-red-400">
                    {(formData.emergencyFundRatio * 100).toFixed(1)}%
                  </span>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {calculateAmount(formData.emergencyFundRatio)}
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-600 pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    Total Allocated:
                  </span>
                  <span
                    className={`font-bold ${
                      Math.abs(
                        formData.needsRatio +
                          formData.wantsRatio +
                          formData.investmentRatio +
                          formData.emergencyFundRatio -
                          1
                      ) < 0.01
                        ? "text-success-600 dark:text-success-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {(
                      (formData.needsRatio +
                        formData.wantsRatio +
                        formData.investmentRatio +
                        formData.emergencyFundRatio) *
                      100
                    ).toFixed(1)}
                    %
                  </span>
                </div>
                {Math.abs(
                  formData.needsRatio +
                    formData.wantsRatio +
                    formData.investmentRatio +
                    formData.emergencyFundRatio -
                    1
                ) >= 0.01 && (
                  <div className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center space-x-1">
                    <AlertTriangle className="h-3 w-3" />
                    <span>Total should equal 100%</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FinancialAllocation;
