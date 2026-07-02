import React from "react";
import {
  TrendingUp,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Lightbulb,
  BookOpen,
  Shield,
} from "lucide-react";

interface ActionableInsightsProps {
  results: {
    breakEvenAge: number | null;
    portfolioValue: number;
    monthlySipNeeded: number;
    currentAge: number;
    investmentRatio: number;
    expectedReturn: number;
    yearsToBreakEven: number | null;
    totalInvested: number;
    annualExpenses: number;
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
    };
  };
}

const ActionableInsights: React.FC<ActionableInsightsProps> = ({ results }) => {
  const formatCurrency = (amount: number) => {
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

  const getRetirementReadiness = () => {
    if (!results.breakEvenAge) return "poor";
    if (results.breakEvenAge <= 45) return "excellent";
    if (results.breakEvenAge <= 55) return "good";
    if (results.breakEvenAge <= 65) return "fair";
    return "poor";
  };

  const getSelfSustainabilityReadiness = () => {
    if (!results.selfSustainabilityAge) return "poor";
    if (results.selfSustainabilityAge <= 35) return "excellent";
    if (results.selfSustainabilityAge <= 45) return "good";
    if (results.selfSustainabilityAge <= 55) return "fair";
    return "poor";
  };

  const getInvestmentRating = () => {
    if (results.investmentRatio >= 0.3) return "aggressive";
    if (results.investmentRatio >= 0.2) return "moderate";
    if (results.investmentRatio >= 0.15) return "conservative";
    return "minimal";
  };

  const retirementReadiness = getRetirementReadiness();
  const selfSustainabilityReadiness = getSelfSustainabilityReadiness();
  const investmentRating = getInvestmentRating();

  return (
    <div className="space-y-6">
      {/* Quick Assessment */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Quick Financial Health Assessment
          </h3>
          {retirementReadiness === "excellent" ? (
            <CheckCircle className="h-6 w-6 text-green-500" />
          ) : retirementReadiness === "good" ? (
            <Target className="h-6 w-6 text-blue-500" />
          ) : retirementReadiness === "fair" ? (
            <Clock className="h-6 w-6 text-yellow-500" />
          ) : (
            <AlertTriangle className="h-6 w-6 text-red-500" />
          )}
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          <div
            className={`p-4 rounded-lg border ${
              retirementReadiness === "excellent"
                ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
                : retirementReadiness === "good"
                ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
                : retirementReadiness === "fair"
                ? "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800"
                : "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
            }`}
          >
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              Retirement Readiness
            </h4>
            <p className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
              {retirementReadiness}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {results.breakEvenAge
                ? `Break-even at age ${results.breakEvenAge}`
                : "No break-even found"}
            </p>
          </div>

          <div
            className={`p-4 rounded-lg border ${
              selfSustainabilityReadiness === "excellent"
                ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
                : selfSustainabilityReadiness === "good"
                ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
                : selfSustainabilityReadiness === "fair"
                ? "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800"
                : "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
            }`}
          >
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              Self-Sustainability
            </h4>
            <p className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
              {selfSustainabilityReadiness}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {results.selfSustainabilityAge
                ? `Self-sustaining at age ${results.selfSustainabilityAge}`
                : "No self-sustainability found"}
            </p>
          </div>

          <div className="p-4 rounded-lg border bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              Investment Profile
            </h4>
            <p className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
              {investmentRating}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {(results.investmentRatio * 100).toFixed(0)}% of income invested
            </p>
          </div>

          <div className="p-4 rounded-lg border bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              Expected Return
            </h4>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {(results.expectedReturn * 100).toFixed(1)}%
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Annual return rate
            </p>
          </div>
        </div>
      </div>

      {/* Immediate Action Items */}
      <div className="card">
        <div className="flex items-center mb-4">
          <Lightbulb className="h-5 w-5 text-yellow-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Immediate Action Items
          </h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <DollarSign className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-green-800 dark:text-green-200">
                Start Monthly SIP
              </h4>
              <p className="text-sm text-green-700 dark:text-green-300">
                Begin investing {formatCurrency(results.monthlySipNeeded)} per
                month through systematic investment plans (SIPs) in equity
                mutual funds.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-200">
                Build Emergency Fund
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Maintain 6-12 months of expenses (approximately{" "}
                {formatCurrency(results.annualExpenses)}) in a liquid savings
                account or high-yield fixed deposits.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <TrendingUp className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-purple-800 dark:text-purple-200">
                Optimize Tax Savings
              </h4>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                Utilize Section 80C (₹1.5L), ELSS funds, and consider NPS for
                additional tax benefits while building your investment corpus.
              </p>
            </div>
          </div>

          {results.warnings?.noBreakEvenFound && (
            <div className="flex items-start space-x-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-red-800 dark:text-red-200">
                  Urgent: Increase Investment Ratio
                </h4>
                <p className="text-sm text-red-700 dark:text-red-300">
                  Your current allocation won't achieve financial independence.
                  Consider increasing investment ratio to at least 25% and
                  reducing discretionary expenses.
                </p>
              </div>
            </div>
          )}

          {results.selfSustainabilityAge && (
            <div className="flex items-start space-x-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <Target className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-emerald-800 dark:text-emerald-200">
                  Self-Sustaining Investment Goal
                </h4>
                <p className="text-sm text-emerald-700 dark:text-emerald-300">
                  At age {results.selfSustainabilityAge}, your monthly
                  investment returns (
                  {results.monthlyReturnAtSustainability
                    ? formatCurrency(results.monthlyReturnAtSustainability)
                    : "N/A"}
                  ) will match your monthly investment amount. No fresh capital
                  needed beyond this point!
                </p>
              </div>
            </div>
          )}

          {results.warnings?.noSelfSustainabilityFound &&
            !results.warnings?.noBreakEvenFound && (
              <div className="flex items-start space-x-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                <Clock className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-orange-800 dark:text-orange-200">
                    Self-Sustainability Not Achieved
                  </h4>
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    While you can achieve financial independence, your monthly
                    returns won't equal monthly investments within the
                    calculated timeframe. Consider increasing investment amount
                    for faster wealth accumulation.
                  </p>
                </div>
              </div>
            )}
        </div>
      </div>

      {/* Long-term Strategy */}
      <div className="card">
        <div className="flex items-center mb-4">
          <Target className="h-5 w-5 text-blue-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Long-term Wealth Building Strategy
          </h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-white">
              Investment Milestones
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  First ₹1 Lakh
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  ~{Math.ceil(100000 / (results.monthlySipNeeded * 12))} years
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  First ₹10 Lakhs
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  ~{Math.ceil(1000000 / (results.monthlySipNeeded * 12))} years
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Self-Sustaining Investment
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {results.yearsToSelfSustainability
                    ? `${results.yearsToSelfSustainability} years`
                    : "Not achievable"}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Financial Independence
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {results.yearsToBreakEven
                    ? `${results.yearsToBreakEven} years`
                    : "Not achievable"}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-white">
              Periodic Reviews
            </h4>
            <div className="space-y-3">
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h5 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Quarterly (Every 3 months)
                </h5>
                <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                  Review portfolio performance and rebalance if needed
                </p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h5 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Annually
                </h5>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  Increase SIP amount with salary hikes and inflation
                </p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <h5 className="text-sm font-medium text-green-800 dark:text-green-200">
                  Life Events
                </h5>
                <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                  Adjust strategy for marriage, children, job changes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Education */}
      <div className="card">
        <div className="flex items-center mb-4">
          <BookOpen className="h-5 w-5 text-indigo-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Learn & Improve
          </h3>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
            <h4 className="font-medium text-indigo-800 dark:text-indigo-200 mb-2">
              Investment Basics
            </h4>
            <ul className="text-sm text-indigo-700 dark:text-indigo-300 space-y-1">
              <li>• Understanding mutual funds</li>
              <li>• Risk vs. Return concepts</li>
              <li>• Tax implications</li>
              <li>• Asset allocation principles</li>
            </ul>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
              Advanced Strategies
            </h4>
            <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
              <li>• Portfolio rebalancing</li>
              <li>• Goal-based investing</li>
              <li>• International diversification</li>
              <li>• Alternative investments</li>
            </ul>
          </div>

          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2">
              Financial Planning
            </h4>
            <ul className="text-sm text-purple-700 dark:text-purple-300 space-y-1">
              <li>• Insurance planning</li>
              <li>• Estate planning basics</li>
              <li>• Retirement corpus calculation</li>
              <li>• Goal prioritization</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tools & Resources */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recommended Tools & Platforms
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
              Investment Platforms
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Mutual Fund SIPs
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Direct plans preferred
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Demat Account
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  For stocks & ETFs
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Tax-saving ELSS
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  80C benefits
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
              Tracking & Monitoring
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Investment Tracking Apps
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Portfolio monitoring
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Budget Management
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Expense tracking
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Financial Calculators
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Goal planning
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionableInsights;
