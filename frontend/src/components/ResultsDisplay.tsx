import React, { useState } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  Target,
  BarChart3,
  PiggyBank,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  ComposedChart,
  Area,
  AreaChart,
} from "recharts";
import ActionableInsights from "./sections/ActionableInsights";

interface AnalysisResults {
  breakEvenAge: number | null;
  portfolioValue: number;
  annualReturn: number;
  annualExpenses: number;
  totalInvested: number;
  yearsToBreakEven: number | null;
  monthlySipNeeded: number;
  requiredMonthlySIP: number | null;
  breakEvenPortfolioValue: number | null;
  financialIndependenceRatio: number;
  // Time horizon specific fields
  timeHorizonAge?: number;
  portfolioValueAtTimeHorizon?: number | null;
  totalInvestedAtTimeHorizon?: number;
  inflationAdjustedPortfolioValue?: number | null;
  // New self-sustainability fields
  selfSustainabilityAge?: number | null;
  yearsToSelfSustainability?: number | null;
  selfSustainabilityPortfolioValue?: number | null;
  monthlyReturnAtSustainability?: number | null;
  warnings?: {
    breakEvenBeyondLifeExpectancy: boolean;
    breakEvenBeyondRetirement: boolean;
    noBreakEvenFound: boolean;
    // New self-sustainability warnings
    selfSustainabilityBeyondLifeExpectancy?: boolean;
    selfSustainabilityBeyondRetirement?: boolean;
    noSelfSustainabilityFound?: boolean;
    calculatedToAge: number;
  };
  allocationBreakdown?: {
    needsRatio: number;
    wantsRatio: number;
    investmentRatio: number;
    emergencyFundRatio: number;
    monthlyNeeds: number;
    monthlyWants: number;
    monthlyInvestments: number;
    monthlyEmergencyFund: number;
  };
  scenarios: {
    balanced: ScenarioResult;
    fire: ScenarioResult;
    aggressive: ScenarioResult;
    conservative: ScenarioResult;
    student: ScenarioResult;
    minimalist: ScenarioResult;
    lifestyle: ScenarioResult;
  };
  chartData: {
    ages: number[];
    portfolioValues: number[];
    annualReturns: number[];
    monthlyReturns?: number[]; // New for self-sustainability tracking
    annualExpenses: number[];
    salaries: number[];
    investments: number[];
    monthlyInvestments?: number[]; // New for monthly investment tracking
    cumulativeInvestments: number[];
  };
  metadata?: {
    analysisDate: string;
    parameters: Record<string, unknown>;
  };
}

interface ScenarioResult {
  name: string;
  description: string;
  needsRatio?: number;
  wantsRatio?: number;
  investmentRatio: number;
  emergencyFundRatio?: number;
  expenseRatio?: number; // For backward compatibility
  expectedReturn: number;
  results: Omit<AnalysisResults, "scenarios" | "metadata">;
}

interface ResultsDisplayProps {
  results: AnalysisResults;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "scenarios" | "charts" | "insights"
  >("insights");

  const formatCurrency = (amount: number) => {
    if (!amount || amount === 0) return "₹0";

    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    } else {
      return `₹${Math.round(amount).toLocaleString()}`;
    }
  };

  // Prepare chart data
  const chartData = results.chartData.ages.map((age, index) => ({
    age,
    portfolioValue: results.chartData.portfolioValues[index] / 100000, // Convert to lakhs
    annualReturn: results.chartData.annualReturns[index] / 100000,
    annualExpenses: results.chartData.annualExpenses[index] / 100000,
    salary: results.chartData.salaries?.[index] / 100000 || 0,
    investment: results.chartData.investments?.[index] / 100000 || 0,
    cumulativeInvestment:
      results.chartData.cumulativeInvestments?.[index] / 100000 || 0,
  }));

  const scenarioData = [
    {
      name: results.scenarios.balanced.name,
      breakEvenAge: results.scenarios.balanced.results.breakEvenAge,
      hasBreakEven: results.scenarios.balanced.results.breakEvenAge !== null,
      portfolioValue: results.scenarios.balanced.results.portfolioValue,
      needsRatio: Math.round(
        (results.scenarios.balanced.needsRatio || 0.5) * 100
      ),
      wantsRatio: Math.round(
        (results.scenarios.balanced.wantsRatio || 0.3) * 100
      ),
      investmentRatio: Math.round(
        results.scenarios.balanced.investmentRatio * 100
      ),
      emergencyFundRatio: Math.round(
        (results.scenarios.balanced.emergencyFundRatio || 0.05) * 100
      ),
      expenseRatio: Math.round(
        ((results.scenarios.balanced.needsRatio || 0.5) +
          (results.scenarios.balanced.wantsRatio || 0.3)) *
          100
      ),
      expectedReturn: Math.round(
        results.scenarios.balanced.expectedReturn * 100
      ),
      description: results.scenarios.balanced.description,
    },
    {
      name: results.scenarios.fire.name,
      breakEvenAge: results.scenarios.fire.results.breakEvenAge,
      hasBreakEven: results.scenarios.fire.results.breakEvenAge !== null,
      portfolioValue: results.scenarios.fire.results.portfolioValue,
      needsRatio: Math.round((results.scenarios.fire.needsRatio || 0.4) * 100),
      wantsRatio: Math.round((results.scenarios.fire.wantsRatio || 0.1) * 100),
      investmentRatio: Math.round(results.scenarios.fire.investmentRatio * 100),
      emergencyFundRatio: Math.round(
        (results.scenarios.fire.emergencyFundRatio || 0.1) * 100
      ),
      expenseRatio: Math.round(
        ((results.scenarios.fire.needsRatio || 0.4) +
          (results.scenarios.fire.wantsRatio || 0.1)) *
          100
      ),
      expectedReturn: Math.round(results.scenarios.fire.expectedReturn * 100),
      description: results.scenarios.fire.description,
    },
    {
      name: results.scenarios.aggressive.name,
      breakEvenAge: results.scenarios.aggressive.results.breakEvenAge,
      hasBreakEven: results.scenarios.aggressive.results.breakEvenAge !== null,
      portfolioValue: results.scenarios.aggressive.results.portfolioValue,
      needsRatio: Math.round(
        (results.scenarios.aggressive.needsRatio || 0.45) * 100
      ),
      wantsRatio: Math.round(
        (results.scenarios.aggressive.wantsRatio || 0.15) * 100
      ),
      investmentRatio: Math.round(
        results.scenarios.aggressive.investmentRatio * 100
      ),
      emergencyFundRatio: Math.round(
        (results.scenarios.aggressive.emergencyFundRatio || 0.1) * 100
      ),
      expenseRatio: Math.round(
        ((results.scenarios.aggressive.needsRatio || 0.45) +
          (results.scenarios.aggressive.wantsRatio || 0.15)) *
          100
      ),
      expectedReturn: Math.round(
        results.scenarios.aggressive.expectedReturn * 100
      ),
      description: results.scenarios.aggressive.description,
    },
    {
      name: results.scenarios.conservative.name,
      breakEvenAge: results.scenarios.conservative.results.breakEvenAge,
      hasBreakEven:
        results.scenarios.conservative.results.breakEvenAge !== null,
      portfolioValue: results.scenarios.conservative.results.portfolioValue,
      needsRatio: Math.round(
        (results.scenarios.conservative.needsRatio || 0.5) * 100
      ),
      wantsRatio: Math.round(
        (results.scenarios.conservative.wantsRatio || 0.2) * 100
      ),
      investmentRatio: Math.round(
        results.scenarios.conservative.investmentRatio * 100
      ),
      emergencyFundRatio: Math.round(
        (results.scenarios.conservative.emergencyFundRatio || 0.15) * 100
      ),
      expenseRatio: Math.round(
        ((results.scenarios.conservative.needsRatio || 0.5) +
          (results.scenarios.conservative.wantsRatio || 0.2)) *
          100
      ),
      expectedReturn: Math.round(
        results.scenarios.conservative.expectedReturn * 100
      ),
      description: results.scenarios.conservative.description,
    },
    {
      name: results.scenarios.student.name,
      breakEvenAge: results.scenarios.student.results.breakEvenAge,
      hasBreakEven: results.scenarios.student.results.breakEvenAge !== null,
      portfolioValue: results.scenarios.student.results.portfolioValue,
      needsRatio: Math.round(
        (results.scenarios.student.needsRatio || 0.6) * 100
      ),
      wantsRatio: Math.round(
        (results.scenarios.student.wantsRatio || 0.25) * 100
      ),
      investmentRatio: Math.round(
        results.scenarios.student.investmentRatio * 100
      ),
      emergencyFundRatio: Math.round(
        (results.scenarios.student.emergencyFundRatio || 0.05) * 100
      ),
      expenseRatio: Math.round(
        ((results.scenarios.student.needsRatio || 0.6) +
          (results.scenarios.student.wantsRatio || 0.25)) *
          100
      ),
      expectedReturn: Math.round(
        results.scenarios.student.expectedReturn * 100
      ),
      description: results.scenarios.student.description,
    },
    {
      name: results.scenarios.minimalist.name,
      breakEvenAge: results.scenarios.minimalist.results.breakEvenAge,
      hasBreakEven: results.scenarios.minimalist.results.breakEvenAge !== null,
      portfolioValue: results.scenarios.minimalist.results.portfolioValue,
      needsRatio: Math.round(
        (results.scenarios.minimalist.needsRatio || 0.35) * 100
      ),
      wantsRatio: Math.round(
        (results.scenarios.minimalist.wantsRatio || 0.15) * 100
      ),
      investmentRatio: Math.round(
        results.scenarios.minimalist.investmentRatio * 100
      ),
      emergencyFundRatio: Math.round(
        (results.scenarios.minimalist.emergencyFundRatio || 0.15) * 100
      ),
      expenseRatio: Math.round(
        ((results.scenarios.minimalist.needsRatio || 0.35) +
          (results.scenarios.minimalist.wantsRatio || 0.15)) *
          100
      ),
      expectedReturn: Math.round(
        results.scenarios.minimalist.expectedReturn * 100
      ),
      description: results.scenarios.minimalist.description,
    },
    {
      name: results.scenarios.lifestyle.name,
      breakEvenAge: results.scenarios.lifestyle.results.breakEvenAge,
      hasBreakEven: results.scenarios.lifestyle.results.breakEvenAge !== null,
      portfolioValue: results.scenarios.lifestyle.results.portfolioValue,
      needsRatio: Math.round(
        (results.scenarios.lifestyle.needsRatio || 0.45) * 100
      ),
      wantsRatio: Math.round(
        (results.scenarios.lifestyle.wantsRatio || 0.35) * 100
      ),
      investmentRatio: Math.round(
        results.scenarios.lifestyle.investmentRatio * 100
      ),
      emergencyFundRatio: Math.round(
        (results.scenarios.lifestyle.emergencyFundRatio || 0.05) * 100
      ),
      expenseRatio: Math.round(
        ((results.scenarios.lifestyle.needsRatio || 0.45) +
          (results.scenarios.lifestyle.wantsRatio || 0.35)) *
          100
      ),
      expectedReturn: Math.round(
        results.scenarios.lifestyle.expectedReturn * 100
      ),
      description: results.scenarios.lifestyle.description,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Result Summary */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Analysis Results
          </h2>
          {results.breakEvenAge ? (
            <div
              className={`flex items-center ${
                results.warnings?.breakEvenBeyondLifeExpectancy
                  ? "text-amber-600 dark:text-amber-400"
                  : results.warnings?.breakEvenBeyondRetirement
                  ? "text-orange-600 dark:text-orange-400"
                  : "text-success-600 dark:text-success-400"
              }`}
            >
              {results.warnings?.breakEvenBeyondLifeExpectancy ||
              results.warnings?.breakEvenBeyondRetirement ? (
                <Clock className="h-5 w-5 mr-2" />
              ) : (
                <CheckCircle className="h-5 w-5 mr-2" />
              )}
              <span className="font-medium">
                {results.warnings?.breakEvenBeyondLifeExpectancy
                  ? "Break-even Beyond Life Expectancy"
                  : results.warnings?.breakEvenBeyondRetirement
                  ? "Break-even After Retirement"
                  : "Break-even Achievable!"}
              </span>
            </div>
          ) : (
            <div className="flex items-center text-danger-600 dark:text-danger-400">
              <XCircle className="h-5 w-5 mr-2" />
              <span className="font-medium">
                {results.warnings?.calculatedToAge
                  ? `No Break-even by Age ${results.warnings.calculatedToAge}`
                  : "No Break-even Found"}
              </span>
            </div>
          )}
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <Target className="h-8 w-8 text-success-600 dark:text-success-400" />
              <span className="text-2xl font-bold text-success-700 dark:text-success-300">
                {results.breakEvenAge || "N/A"}
              </span>
            </div>
            <p className="text-success-600 dark:text-success-400 font-medium mt-2">
              Break-even Age
            </p>
            <p className="text-xs text-success-500 dark:text-success-400 mt-1">
              Returns cover expenses
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <Clock className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                {results.selfSustainabilityAge || "N/A"}
              </span>
            </div>
            <p className="text-emerald-600 dark:text-emerald-400 font-medium mt-2">
              Self-Sustaining Age
            </p>
            <p className="text-xs text-emerald-500 dark:text-emerald-400 mt-1">
              No fresh capital needed
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <PiggyBank className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              <span className="text-2xl font-bold text-primary-700 dark:text-primary-300">
                {formatCurrency(results.portfolioValue)}
              </span>
            </div>
            <p className="text-primary-600 dark:text-primary-400 font-medium mt-2">
              Portfolio Value
            </p>
            <p className="text-xs text-primary-500 dark:text-primary-400 mt-1">
              At break-even
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <Clock className="h-8 w-8 text-warning-600 dark:text-warning-400" />
              <span className="text-2xl font-bold text-warning-700 dark:text-warning-300">
                {results.yearsToBreakEven || "N/A"}
              </span>
            </div>
            <p className="text-warning-600 dark:text-warning-400 font-medium mt-2">
              Years to Break-even
            </p>
            <p className="text-xs text-warning-500 dark:text-warning-400 mt-1">
              Until expense coverage
            </p>
          </div>
        </div>

        {/* Time Horizon Portfolio Analysis */}
        {results.timeHorizonAge && results.portfolioValueAtTimeHorizon && (
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 flex items-center">
                <Target className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
                Portfolio After{" "}
                {results.timeHorizonAge -
                  (results.metadata?.parameters?.currentAge || 25)}{" "}
                Years of Investment (Age {results.timeHorizonAge})
              </h3>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-100 dark:border-blue-700">
                <div className="flex items-center justify-between mb-2">
                  <PiggyBank className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  <span className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                    {formatCurrency(results.portfolioValueAtTimeHorizon)}
                  </span>
                </div>
                <p className="text-blue-600 dark:text-blue-400 font-medium">
                  Portfolio Value (Nominal)
                </p>
                <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">
                  After{" "}
                  {results.timeHorizonAge -
                    (results.metadata?.parameters?.currentAge || 25)}{" "}
                  years of investing
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-green-100 dark:border-green-700">
                <div className="flex items-center justify-between mb-2">
                  <BarChart3 className="h-8 w-8 text-green-600 dark:text-green-400" />
                  <span className="text-2xl font-bold text-green-700 dark:text-green-300">
                    {results.inflationAdjustedPortfolioValue
                      ? formatCurrency(results.inflationAdjustedPortfolioValue)
                      : "N/A"}
                  </span>
                </div>
                <p className="text-green-600 dark:text-green-400 font-medium">
                  Today's Purchasing Power
                </p>
                <p className="text-xs text-green-500 dark:text-green-400 mt-1">
                  Inflation-adjusted value
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-purple-100 dark:border-purple-700">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  <span className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                    {formatCurrency(results.totalInvestedAtTimeHorizon || 0)}
                  </span>
                </div>
                <p className="text-purple-600 dark:text-purple-400 font-medium">
                  Total Invested
                </p>
                <p className="text-xs text-purple-500 dark:text-purple-400 mt-1">
                  Your contributions over{" "}
                  {results.timeHorizonAge -
                    (results.metadata?.parameters?.currentAge || 25)}{" "}
                  years
                </p>
              </div>
            </div>

            {/* Wealth Multiplication Factor */}
            {results.portfolioValueAtTimeHorizon &&
              results.totalInvestedAtTimeHorizon && (
                <div className="mt-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                        Wealth Multiplication Factor
                      </h4>
                      <p className="text-xs text-yellow-600 dark:text-yellow-300 mt-1">
                        Your investment will grow by{" "}
                        {(
                          (results.portfolioValueAtTimeHorizon || 0) /
                          (results.totalInvestedAtTimeHorizon || 1)
                        ).toFixed(1)}
                        x through compound returns
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-yellow-700 dark:text-yellow-300">
                        {(
                          (results.portfolioValueAtTimeHorizon || 0) /
                          (results.totalInvestedAtTimeHorizon || 1)
                        ).toFixed(1)}
                        x
                      </div>
                      <div className="text-xs text-yellow-600 dark:text-yellow-400">
                        Return multiple
                      </div>
                    </div>
                  </div>
                </div>
              )}

            <div className="mt-4 text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/10 rounded-lg p-3">
              <p className="font-medium mb-1">
                💡 Understanding these numbers:
              </p>
              <ul className="space-y-1 list-disc list-inside">
                <li>
                  <strong>Portfolio Value (Nominal):</strong> The actual amount
                  you'll have after{" "}
                  {results.timeHorizonAge -
                    (results.metadata?.parameters?.currentAge || 25)}{" "}
                  years of investing (at age {results.timeHorizonAge})
                </li>
                <li>
                  <strong>Today's Purchasing Power:</strong> What that money can
                  buy in today's terms (accounting for{" "}
                  {(
                    (results.metadata?.parameters?.inflationRate || 0.06) * 100
                  ).toFixed(1)}
                  % annual inflation)
                </li>
                <li>
                  <strong>Total Invested:</strong> The sum of all your monthly
                  contributions over the investment period
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Self-Sustainability Explanation */}
        {results.selfSustainabilityAge && (
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-emerald-500 rounded-full p-2">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
                    Self-Sustaining Investment Achieved!
                  </h4>
                  <p className="text-xs text-emerald-600 dark:text-emerald-300">
                    At age {results.selfSustainabilityAge}, your monthly returns
                    will equal your monthly investment amount
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-emerald-700 dark:text-emerald-300">
                  {results.monthlyReturnAtSustainability
                    ? formatCurrency(results.monthlyReturnAtSustainability)
                    : "N/A"}
                </div>
                <div className="text-xs text-emerald-600 dark:text-emerald-400">
                  Monthly return at that age
                </div>
                <div className="text-xs text-emerald-500 dark:text-emerald-400 mt-1">
                  Portfolio Value:{" "}
                  {results.selfSustainabilityPortfolioValue
                    ? formatCurrency(results.selfSustainabilityPortfolioValue)
                    : "N/A"}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Warning Messages */}
        {results.warnings && (
          <div className="space-y-3 mt-6">
            {results.warnings.breakEvenBeyondLifeExpectancy && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-amber-800 dark:text-amber-200">
                      Break-even Beyond Average Life Expectancy
                    </h4>
                    <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                      Your break-even age of {results.breakEvenAge} years
                      exceeds the average life expectancy (75 years). Consider
                      increasing your investment ratio or reducing expenses to
                      achieve financial independence earlier.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {results.warnings.breakEvenBeyondRetirement &&
              !results.warnings.breakEvenBeyondLifeExpectancy && (
                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-orange-800 dark:text-orange-200">
                        Break-even After Typical Retirement Age
                      </h4>
                      <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                        Your break-even age of {results.breakEvenAge} years is
                        after the typical retirement age (65 years). You may
                        want to adjust your allocation strategy for earlier
                        financial independence.
                      </p>
                    </div>
                  </div>
                </div>
              )}

            {results.warnings.noBreakEvenFound && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-red-800 dark:text-red-200">
                      No Break-even Found
                    </h4>
                    <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                      No break-even point was found even when calculating up to
                      age {results.warnings.calculatedToAge}. Your current
                      allocation strategy may need significant adjustment to
                      achieve financial independence.
                    </p>
                    <div className="mt-2 text-xs text-red-600 dark:text-red-400">
                      <p>Consider:</p>
                      <ul className="list-disc list-inside space-y-1 mt-1">
                        <li>Increasing your investment ratio</li>
                        <li>Reducing your expense ratio (needs + wants)</li>
                        <li>Exploring higher-return investment options</li>
                        <li>
                          Increasing your salary through skills development
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {results.warnings?.noSelfSustainabilityFound &&
              !results.warnings?.noBreakEvenFound && (
                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-orange-800 dark:text-orange-200">
                        Self-Sustainability Not Achieved
                      </h4>
                      <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                        While you can achieve financial independence at age{" "}
                        {results.breakEvenAge}, your monthly investment returns
                        won't equal your monthly investment amount within the
                        calculated timeframe. Consider increasing your
                        investment ratio for faster wealth accumulation.
                      </p>
                    </div>
                  </div>
                </div>
              )}
          </div>
        )}

        {/* Detailed Breakdown */}
        {results.breakEvenAge && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mt-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              Break-even Details
            </h3>
            <div className="grid md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">
                  Annual Investment Returns:
                </span>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(results.annualReturn)}
                </p>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">
                  Annual Expenses:
                </span>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(results.annualExpenses)}
                </p>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">
                  Salary at Break-even:
                </span>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {results.chartData.salaries && results.breakEvenAge
                    ? formatCurrency(
                        results.chartData.salaries[
                          results.chartData.ages.indexOf(results.breakEvenAge)
                        ]
                      )
                    : "N/A"}
                </p>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">
                  Total Amount Invested:
                </span>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(results.totalInvested)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Allocation Breakdown */}
        {results.allocationBreakdown && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800 mt-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
              Monthly Allocation Breakdown
            </h3>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(results.allocationBreakdown.monthlyNeeds)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  💡 Needs
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  {(results.allocationBreakdown.needsRatio * 100).toFixed(1)}%
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {formatCurrency(results.allocationBreakdown.monthlyWants)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  🎯 Wants
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  {(results.allocationBreakdown.wantsRatio * 100).toFixed(1)}%
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(
                    results.allocationBreakdown.monthlyInvestments
                  )}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  📈 Investments
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  {(results.allocationBreakdown.investmentRatio * 100).toFixed(
                    1
                  )}
                  %
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {formatCurrency(
                    results.allocationBreakdown.monthlyEmergencyFund
                  )}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  🚨 Emergency
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  {(
                    results.allocationBreakdown.emergencyFundRatio * 100
                  ).toFixed(1)}
                  %
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="flex space-x-6 mb-6 border-b border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab("insights")}
            className={`pb-4 text-sm font-medium transition-colors relative ${
              activeTab === "insights"
                ? "text-primary-600 dark:text-primary-400"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Action Plan
            {activeTab === "insights" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 rounded-t-md"></div>}
          </button>
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-4 text-sm font-medium transition-colors relative ${
              activeTab === "overview"
                ? "text-primary-600 dark:text-primary-400"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Overview
            {activeTab === "overview" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 rounded-t-md"></div>}
          </button>
          <button
            onClick={() => setActiveTab("scenarios")}
            className={`pb-4 text-sm font-medium transition-colors relative ${
              activeTab === "scenarios"
                ? "text-primary-600 dark:text-primary-400"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Scenarios
            {activeTab === "scenarios" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 rounded-t-md"></div>}
          </button>
          <button
            onClick={() => setActiveTab("charts")}
            className={`pb-4 text-sm font-medium transition-colors relative ${
              activeTab === "charts"
                ? "text-primary-600 dark:text-primary-400"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Charts
            {activeTab === "charts" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 rounded-t-md"></div>}
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "insights" && (
          <ActionableInsights
            results={{
              breakEvenAge: results.breakEvenAge,
              portfolioValue: results.portfolioValue,
              monthlySipNeeded: results.monthlySipNeeded,
              currentAge: results.metadata?.parameters?.currentAge || 25,
              investmentRatio:
                results.allocationBreakdown?.investmentRatio || 0.2,
              expectedReturn:
                results.metadata?.parameters?.expectedReturn || 0.12,
              yearsToBreakEven: results.yearsToBreakEven,
              totalInvested: results.totalInvested,
              annualExpenses: results.annualExpenses,
              // Add self-sustainability fields
              selfSustainabilityAge: results.selfSustainabilityAge,
              yearsToSelfSustainability: results.yearsToSelfSustainability,
              selfSustainabilityPortfolioValue:
                results.selfSustainabilityPortfolioValue,
              monthlyReturnAtSustainability:
                results.monthlyReturnAtSustainability,
              warnings: results.warnings,
            }}
          />
        )}

        {activeTab === "overview" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Investment Growth Timeline
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="age" />
                  <YAxis
                    label={{
                      value: "Amount (₹ Lakhs)",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Tooltip
                    formatter={(value: number, name: string) => {
                      const formatValue = `₹${value.toFixed(1)}L`;
                      let label = "";
                      switch (name) {
                        case "portfolioValue":
                          label = "Portfolio Value";
                          break;
                        case "annualReturn":
                          label = "Annual Return";
                          break;
                        case "annualExpenses":
                          label = "Annual Expenses";
                          break;
                        default:
                          label = name;
                      }
                      return [formatValue, label];
                    }}
                    labelFormatter={(age) => `Age: ${age}`}
                    contentStyle={{
                      backgroundColor: "var(--tooltip-bg)",
                      borderColor: "var(--tooltip-border)",
                      borderRadius: "8px",
                      color: "var(--tooltip-text)",
                      boxShadow:
                        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    }}
                    labelStyle={{ color: "var(--tooltip-text)" }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="portfolioValue"
                    fill="#ccff00"
                    fillOpacity={0.1}
                    stroke="#ccff00"
                    name="Portfolio Value"
                  />
                  <Line
                    type="monotone"
                    dataKey="annualReturn"
                    stroke="#22c55e"
                    strokeWidth={2}
                    name="Annual Return"
                  />
                  <Line
                    type="monotone"
                    dataKey="annualExpenses"
                    stroke="#ef4444"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Annual Expenses"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-success-50 dark:bg-success-900/20 rounded-lg p-4 border border-success-200 dark:border-success-800">
                <h4 className="font-semibold text-success-900 dark:text-success-300 mb-2">
                  Key Insights
                </h4>
                <ul className="text-sm text-success-700 dark:text-success-400 space-y-1">
                  <li>
                    • Investment returns grow exponentially due to compounding
                  </li>
                  <li>• Break-even occurs when returns exceed expenses</li>
                  <li>• Early years require consistent contributions</li>
                  <li>• Portfolio becomes self-sustaining after break-even</li>
                </ul>
              </div>

              <div className="bg-warning-50 dark:bg-warning-900/20 rounded-lg p-4 border border-warning-200 dark:border-warning-800">
                <h4 className="font-semibold text-warning-900 dark:text-warning-300 mb-2">
                  Action Items
                </h4>
                <ul className="text-sm text-warning-700 dark:text-warning-400 space-y-1">
                  <li>
                    • Start SIP of {formatCurrency(results.monthlySipNeeded)}
                    /month
                  </li>
                  <li>• Focus on equity investments for higher returns</li>
                  <li>• Review and optimize expenses annually</li>
                  <li>• Increase investment amount with salary hikes</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === "scenarios" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Strategy Comparison
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Compare different financial allocation strategies and their
                impact on your break-even age. Each strategy represents a
                different balance between expenses, investments, and expected
                returns.
              </p>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={scenarioData.filter((s) => s.hasBreakEven)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis
                  label={{
                    value: "Break-even Age",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip
                  formatter={(value: number) => [`Age ${value}`, "Break-even Age"]}
                  contentStyle={{
                    backgroundColor: "var(--tooltip-bg)",
                    borderColor: "var(--tooltip-border)",
                    borderRadius: "8px",
                    color: "var(--tooltip-text)",
                    boxShadow:
                      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  }}
                  labelStyle={{ color: "var(--tooltip-text)" }}
                />
                <Bar dataKey="breakEvenAge" fill="#5285ff" />
              </BarChart>
            </ResponsiveContainer>

            {scenarioData.filter((s) => !s.hasBreakEven).length > 0 && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2" />
                  <span className="text-amber-800 dark:text-amber-200 font-medium">
                    Note:{" "}
                    {scenarioData
                      .filter((s) => !s.hasBreakEven)
                      .map((s) => s.name)
                      .join(", ")}
                    {scenarioData.filter((s) => !s.hasBreakEven).length === 1
                      ? " scenario does"
                      : " scenarios do"}{" "}
                    not achieve break-even by age 100
                  </span>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scenarioData.map((scenario) => (
                <div
                  key={scenario.name}
                  className={`rounded-lg p-5 border transition-all hover:shadow-md ${
                    scenario.hasBreakEven
                      ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                      : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {scenario.name}
                    </h4>
                    {scenario.hasBreakEven ? (
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    )}
                  </div>

                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    {scenario.description}
                  </div>

                  <div className="space-y-3">
                    <div className="bg-white dark:bg-gray-800 rounded-md p-3 border border-gray-100 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                          Break-even Age:
                        </span>
                        <span
                          className={`text-sm font-bold ${
                            scenario.hasBreakEven
                              ? "text-green-700 dark:text-green-300"
                              : "text-red-700 dark:text-red-300"
                          }`}
                        >
                          {scenario.hasBreakEven
                            ? `Age ${scenario.breakEvenAge}`
                            : "No Break-even"}
                        </span>
                      </div>
                      {scenario.hasBreakEven && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Portfolio: {formatCurrency(scenario.portfolioValue)}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Needs:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {scenario.needsRatio}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Wants:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {scenario.wantsRatio}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Investment:
                        </span>
                        <span className="font-medium text-blue-700 dark:text-blue-300">
                          {scenario.investmentRatio}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Emergency:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {scenario.emergencyFundRatio}%
                        </span>
                      </div>
                      <div className="flex justify-between col-span-2 pt-1 border-t border-gray-200 dark:border-gray-600">
                        <span className="text-gray-600 dark:text-gray-400">
                          Expected Return:
                        </span>
                        <span className="font-medium text-green-700 dark:text-green-300">
                          {scenario.expectedReturn}% p.a.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "charts" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Portfolio Growth Over Time
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="age" />
                  <YAxis
                    label={{
                      value: "Amount (₹ Lakhs)",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Tooltip
                    formatter={(value: number, name: string) => {
                      const formatValue = `₹${value.toFixed(1)}L`;
                      let label = "";
                      switch (name) {
                        case "portfolioValue":
                          label = "Portfolio Value";
                          break;
                        case "annualReturn":
                          label = "Annual Return";
                          break;
                        case "annualExpenses":
                          label = "Annual Expenses";
                          break;
                        default:
                          label = name;
                      }
                      return [formatValue, label];
                    }}
                    labelFormatter={(age) => `Age: ${age}`}
                    contentStyle={{
                      backgroundColor: "var(--tooltip-bg)",
                      borderColor: "var(--tooltip-border)",
                      borderRadius: "8px",
                      color: "var(--tooltip-text)",
                      boxShadow:
                        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    }}
                    labelStyle={{ color: "var(--tooltip-text)" }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="portfolioValue"
                    stroke="#5285ff"
                    fill="#5285ff"
                    fillOpacity={0.3}
                    name="Portfolio Value"
                  />
                  <Area
                    type="monotone"
                    dataKey="annualReturn"
                    stroke="#22c55e"
                    fill="#22c55e"
                    fillOpacity={0.2}
                    name="Annual Return"
                  />
                  <Area
                    type="monotone"
                    dataKey="annualExpenses"
                    stroke="#ef4444"
                    fill="#ef4444"
                    fillOpacity={0.1}
                    name="Annual Expenses"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Complete Financial Overview
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="age" />
                  <YAxis
                    label={{
                      value: "Amount (₹ Lakhs)",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Tooltip
                    formatter={(value: number, name: string) => {
                      const formatValue = `₹${value.toFixed(1)}L`;
                      let label = "";
                      switch (name) {
                        case "portfolioValue":
                          label = "Portfolio Value";
                          break;
                        case "annualReturn":
                          label = "Annual Return";
                          break;
                        case "annualExpenses":
                          label = "Annual Expenses";
                          break;
                        default:
                          label = name;
                      }
                      return [formatValue, label];
                    }}
                    labelFormatter={(age) => `Age: ${age}`}
                    contentStyle={{
                      backgroundColor: "var(--tooltip-bg)",
                      borderColor: "var(--tooltip-border)",
                      borderRadius: "8px",
                      color: "var(--tooltip-text)",
                      boxShadow:
                        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    }}
                    labelStyle={{ color: "var(--tooltip-text)" }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="portfolioValue"
                    stroke="#5285ff"
                    fill="#5285ff"
                    fillOpacity={0.1}
                    name="Portfolio Value"
                  />
                  <Line
                    type="monotone"
                    dataKey="annualReturn"
                    stroke="#22c55e"
                    strokeWidth={3}
                    name="Annual Return"
                  />
                  <Line
                    type="monotone"
                    dataKey="annualExpenses"
                    stroke="#ef4444"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Annual Expenses"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Returns vs Expenses Crossover
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="age" />
                  <YAxis
                    label={{
                      value: "Annual Amount (₹ Lakhs)",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      `₹${value.toFixed(1)}L`,
                      name === "annualReturn"
                        ? "Annual Return"
                        : "Annual Expenses",
                    ]}
                    labelFormatter={(age) => `Age: ${age}`}
                    contentStyle={{
                      backgroundColor: "var(--tooltip-bg)",
                      borderColor: "var(--tooltip-border)",
                      borderRadius: "8px",
                      color: "var(--tooltip-text)",
                      boxShadow:
                        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    }}
                    labelStyle={{ color: "var(--tooltip-text)" }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="annualReturn"
                    stroke="#22c55e"
                    strokeWidth={3}
                    name="Annual Return"
                  />
                  <Line
                    type="monotone"
                    dataKey="annualExpenses"
                    stroke="#ef4444"
                    strokeWidth={3}
                    strokeDasharray="5 5"
                    name="Annual Expenses"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsDisplay;
