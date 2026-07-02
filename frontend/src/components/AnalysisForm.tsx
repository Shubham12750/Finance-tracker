import React, { useState, useEffect, useCallback, useRef } from "react";
import { Calculator } from "lucide-react";
import BasicInformation from "./sections/BasicInformation";
import FinancialAllocation from "./sections/FinancialAllocation";
import InvestmentStrategy from "./sections/InvestmentStrategy";
import MarketAssumptions from "./sections/MarketAssumptions";

interface AnalysisParams {
  startingAge: number;
  currentAge: number;
  startingSalary: number;
  needsRatio: number;
  wantsRatio: number;
  investmentRatio: number;
  emergencyFundRatio: number;
  expectedReturn: number;
  inflationRate: number;
  salaryGrowthRate: number;
  // Investment time horizon - how many years to invest
  investmentTimeHorizon: number;
  // Legacy fields for backward compatibility
  expenseRatio: number;
  // New parameter for realistic expense modeling
  useRealisticExpenses?: boolean;
  // Investment strategy breakdown
  investmentBreakdown?: {
    mutualFundsRatio: number;
    stocksRatio: number;
    debtRatio: number;
    fixedDepositsRatio: number;
    digitalGoldRatio: number;
    othersRatio: number;
  };
  // Custom expected returns for each investment type
  customReturns?: {
    mutualFundsReturn: number;
    stocksReturn: number;
    debtReturn: number;
    fixedDepositsReturn: number;
    digitalGoldReturn: number;
    othersReturn: number;
  };
}

interface AnalysisFormProps {
  onAnalysisChange: (params: AnalysisParams) => void;
  loading: boolean;
  onComplete?: () => void;
  isCompact?: boolean;
}

const AnalysisForm: React.FC<AnalysisFormProps> = ({
  onAnalysisChange,
  loading,
  onComplete,
  isCompact = false,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  // Define allocation strategies
  const allocationStrategies = {
    custom: {
      name: "Custom",
      description: "Set your own allocation percentages",
      needs: 0.5,
      wants: 0.2,
      investments: 0.2,
      emergencyFund: 0.1,
    },
    balanced: {
      name: "50/30/20 Rule",
      description: "Popular balanced approach for most people",
      needs: 0.5,
      wants: 0.3,
      investments: 0.15,
      emergencyFund: 0.05,
    },
    fire: {
      name: "FIRE Strategy",
      description: "Financial Independence Retire Early - aggressive saving",
      needs: 0.4,
      wants: 0.1,
      investments: 0.4,
      emergencyFund: 0.1,
    },
    aggressive: {
      name: "Aggressive Investor",
      description: "Maximize wealth building with high investment ratio",
      needs: 0.45,
      wants: 0.15,
      investments: 0.3,
      emergencyFund: 0.1,
    },
    conservative: {
      name: "Conservative Saver",
      description: "Security-focused with larger emergency fund",
      needs: 0.5,
      wants: 0.2,
      investments: 0.15,
      emergencyFund: 0.15,
    },
    student: {
      name: "Fresh Graduate",
      description: "Starting career with lower investment capacity",
      needs: 0.6,
      wants: 0.25,
      investments: 0.1,
      emergencyFund: 0.05,
    },
    minimalist: {
      name: "Minimalist",
      description: "Low expenses, high savings rate",
      needs: 0.35,
      wants: 0.15,
      investments: 0.35,
      emergencyFund: 0.15,
    },
    lifestyle: {
      name: "Lifestyle Focused",
      description: "Higher wants allocation for lifestyle enjoyment",
      needs: 0.45,
      wants: 0.35,
      investments: 0.15,
      emergencyFund: 0.05,
    },
  };

  // Define investment strategies
  const investmentStrategies = {
    custom: {
      name: "Custom Investment Mix",
      description: "Set your own investment allocation percentages",
      mutualFunds: 0.6,
      stocks: 0.2,
      debt: 0.1,
      fixedDeposits: 0.05,
      digitalGold: 0.03,
      others: 0.02,
    },
    aggressive: {
      name: "Aggressive Growth",
      description: "High equity focus for maximum growth potential",
      mutualFunds: 0.5,
      stocks: 0.35,
      debt: 0.05,
      fixedDeposits: 0.02,
      digitalGold: 0.05,
      others: 0.03,
    },
    balanced: {
      name: "Balanced Portfolio",
      description: "Moderate risk with balanced equity and debt allocation",
      mutualFunds: 0.45,
      stocks: 0.25,
      debt: 0.15,
      fixedDeposits: 0.08,
      digitalGold: 0.04,
      others: 0.03,
    },
    conservative: {
      name: "Conservative Stability",
      description: "Lower risk with higher debt and fixed deposit allocation",
      mutualFunds: 0.3,
      stocks: 0.15,
      debt: 0.25,
      fixedDeposits: 0.2,
      digitalGold: 0.05,
      others: 0.05,
    },
    diversified: {
      name: "Diversified Mix",
      description: "Well-diversified across all asset classes",
      mutualFunds: 0.4,
      stocks: 0.2,
      debt: 0.2,
      fixedDeposits: 0.1,
      digitalGold: 0.06,
      others: 0.04,
    },
    sip_focused: {
      name: "SIP Focused",
      description: "Mutual fund heavy strategy with systematic investing",
      mutualFunds: 0.7,
      stocks: 0.15,
      debt: 0.08,
      fixedDeposits: 0.03,
      digitalGold: 0.02,
      others: 0.02,
    },
  };

  const [formData, setFormData] = useState<AnalysisParams>(() => {
    const defaultBreakdown = {
      mutualFundsRatio: 0.6,
      stocksRatio: 0.2,
      debtRatio: 0.1,
      fixedDepositsRatio: 0.05,
      digitalGoldRatio: 0.03,
      othersRatio: 0.02,
    };

    // Default expected returns for different asset classes (historical averages in India)
    const defaultReturns = {
      mutualFundsReturn: 0.14, // 14% - Equity mutual funds
      stocksReturn: 0.16, // 16% - Direct stocks (higher risk, higher return)
      debtReturn: 0.08, // 8% - Debt instruments
      fixedDepositsReturn: 0.065, // 6.5% - Fixed deposits
      digitalGoldReturn: 0.1, // 10% - Digital gold (inflation hedge)
      othersReturn: 0.09, // 9% - Mixed alternatives like PPF, REITs, etc.
    };

    const initialExpectedReturn =
      defaultBreakdown.mutualFundsRatio * defaultReturns.mutualFundsReturn +
      defaultBreakdown.stocksRatio * defaultReturns.stocksReturn +
      defaultBreakdown.debtRatio * defaultReturns.debtReturn +
      defaultBreakdown.fixedDepositsRatio * defaultReturns.fixedDepositsReturn +
      defaultBreakdown.digitalGoldRatio * defaultReturns.digitalGoldReturn +
      defaultBreakdown.othersRatio * defaultReturns.othersReturn;

    return {
      startingAge: 22, // Typical college graduation age
      currentAge: 25,
      startingSalary: 75000, // Keep as annual for backend compatibility
      needsRatio: 0.5, // 50% for needs (rent, food, utilities, etc.)
      wantsRatio: 0.2, // 20% for wants (entertainment, dining out, etc.)
      investmentRatio: 0.2, // 20% for investments
      emergencyFundRatio: 0.1, // 10% for emergency fund
      expectedReturn: initialExpectedReturn,
      inflationRate: 0.06,
      salaryGrowthRate: 0.1,
      // Investment time horizon - default to 35 years (until age 60)
      investmentTimeHorizon: 35,
      // Calculate legacy expenseRatio for backend compatibility
      expenseRatio: 0.7, // needs + wants
      // Expense model preference
      useRealisticExpenses: true, // Default to realistic model
      // Investment breakdown
      investmentBreakdown: defaultBreakdown,
      // Custom returns initialized with defaults
      customReturns: defaultReturns,
    };
  });

  const [monthlySalary, setMonthlySalary] = useState<number>(
    Math.round(75000 / 12)
  );
  const [selectedStrategy, setSelectedStrategy] = useState<string>("custom");
  const [selectedInvestmentStrategy, setSelectedInvestmentStrategy] =
    useState<string>("custom");
  const [useCustomReturns, setUseCustomReturns] = useState<boolean>(false);

  // Add toggle handler for boolean fields
  const handleToggle = (field: string, value: boolean) => {
    if (field === "useRealisticExpenses") {
      setFormData((prev) => ({
        ...prev,
        useRealisticExpenses: value,
      }));
    }
  };

  const [tooltipVisible, setTooltipVisible] = useState<string | null>(null);

  // Use ref to avoid stale closure issues
  const onAnalysisChangeRef = useRef(onAnalysisChange);
  const hasInitialAnalysisRun = useRef(false);
  onAnalysisChangeRef.current = onAnalysisChange;

  // Debounced auto-analysis effect
  const debounceTimeout = useRef<number | undefined>(undefined);
  const debouncedAnalysis = useCallback(
    (params: AnalysisParams) => {
      clearTimeout(debounceTimeout.current);
      debounceTimeout.current = window.setTimeout(() => {
        // Only trigger analysis if basic validation passes
        const isValid = validateBasicParams(params);
        if (isValid) {
          onAnalysisChangeRef.current(params);
        }
      }, 500); // 500ms debounce delay
    },
    [] // Empty dependencies to prevent recreation
  );

  // Basic validation to prevent unnecessary API calls
  const validateBasicParams = (params: AnalysisParams): boolean => {
    // Check if required fields are present and reasonable
    if (
      !params.currentAge ||
      params.currentAge < 18 ||
      params.currentAge > 100
    ) {
      return false;
    }

    if (!params.startingSalary || params.startingSalary <= 0) {
      return false;
    }

    // Check if allocation totals are reasonable
    const totalAllocation =
      params.needsRatio +
      params.wantsRatio +
      params.investmentRatio +
      params.emergencyFundRatio;

    if (totalAllocation < 0.01 || totalAllocation > 1.1) {
      return false;
    }

    // Investment ratio should be positive
    if (params.investmentRatio <= 0) {
      return false;
    }

    // Check investment breakdown if present
    if (params.investmentBreakdown) {
      const investmentTotal = Object.values(params.investmentBreakdown).reduce(
        (sum, val) => sum + val,
        0
      );
      if (investmentTotal < 0.01 && params.investmentRatio > 0) {
        return false;
      }
    }

    return true;
  };

  // Auto-analyze when form data changes
  useEffect(() => {
    const updatedFormData = {
      ...formData,
      startingSalary: monthlySalary * 12, // Convert monthly to annual
    };
    debouncedAnalysis(updatedFormData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // Only include the actual form values that should trigger re-analysis
    formData.startingAge,
    formData.currentAge,
    formData.needsRatio,
    formData.wantsRatio,
    formData.investmentRatio,
    formData.emergencyFundRatio,
    formData.expectedReturn,
    formData.inflationRate,
    formData.salaryGrowthRate,
    formData.investmentTimeHorizon,
    formData.useRealisticExpenses,
    formData.investmentBreakdown?.mutualFundsRatio,
    formData.investmentBreakdown?.stocksRatio,
    formData.investmentBreakdown?.debtRatio,
    formData.investmentBreakdown?.fixedDepositsRatio,
    formData.investmentBreakdown?.digitalGoldRatio,
    formData.investmentBreakdown?.othersRatio,
    monthlySalary,
    debouncedAnalysis,
  ]);

  // Initial analysis on component mount only
  useEffect(() => {
    if (!hasInitialAnalysisRun.current) {
      hasInitialAnalysisRun.current = true;
      const initialFormData = {
        ...formData,
        startingSalary: monthlySalary * 12,
      };
      // Run initial analysis without debounce, but with validation
      setTimeout(() => {
        if (validateBasicParams(initialFormData)) {
          onAnalysisChangeRef.current(initialFormData);
        }
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array for mount only

  // Calculate amounts based on monthly salary
  const calculateAmount = (ratio: number) => {
    return (monthlySalary * ratio).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    });
  };

  // Calculate monthly amount from ratio
  const getMonthlyAmount = (ratio: number) => {
    return Math.round(monthlySalary * ratio);
  };

  // Calculate ratio from monthly amount
  const getRatioFromAmount = (monthlyAmount: number) => {
    return monthlyAmount / monthlySalary;
  };

  // Calculate annual salary from monthly
  const getAnnualSalary = () => {
    return monthlySalary * 12;
  };

  // Calculate investment amount for each type
  const getInvestmentAmount = (investmentTypeRatio: number) => {
    const totalInvestmentAmount = monthlySalary * formData.investmentRatio;
    const investmentTypeAmount = totalInvestmentAmount * investmentTypeRatio;
    return investmentTypeAmount.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    });
  };

  // Calculate expected return based on investment breakdown
  const calculateExpectedReturn = (
    breakdown: AnalysisParams["investmentBreakdown"],
    customReturns?: AnalysisParams["customReturns"]
  ) => {
    // Use custom returns if provided and user has enabled custom returns, otherwise use defaults
    const expectedReturns =
      useCustomReturns && customReturns
        ? {
            mutualFunds: customReturns.mutualFundsReturn,
            stocks: customReturns.stocksReturn,
            debt: customReturns.debtReturn,
            fixedDeposits: customReturns.fixedDepositsReturn,
            digitalGold: customReturns.digitalGoldReturn,
            others: customReturns.othersReturn,
          }
        : {
            mutualFunds: 0.14, // 14% - Equity mutual funds
            stocks: 0.16, // 16% - Direct stocks (higher risk, higher return)
            debt: 0.08, // 8% - Debt instruments
            fixedDeposits: 0.065, // 6.5% - Fixed deposits
            digitalGold: 0.1, // 10% - Digital gold (inflation hedge)
            others: 0.09, // 9% - Mixed alternatives like PPF, REITs, etc.
          };

    const weightedReturn =
      breakdown.mutualFundsRatio * expectedReturns.mutualFunds +
      breakdown.stocksRatio * expectedReturns.stocks +
      breakdown.debtRatio * expectedReturns.debt +
      breakdown.fixedDepositsRatio * expectedReturns.fixedDeposits +
      breakdown.digitalGoldRatio * expectedReturns.digitalGold +
      breakdown.othersRatio * expectedReturns.others;

    return weightedReturn;
  };

  const handleStrategyChange = (strategyKey: string) => {
    setSelectedStrategy(strategyKey);

    if (strategyKey !== "custom") {
      const strategy =
        allocationStrategies[strategyKey as keyof typeof allocationStrategies];
      const updatedFormData = {
        ...formData,
        needsRatio: strategy.needs,
        wantsRatio: strategy.wants,
        investmentRatio: strategy.investments,
        emergencyFundRatio: strategy.emergencyFund,
        expenseRatio: strategy.needs + strategy.wants,
      };
      setFormData(updatedFormData);
    }
  };

  const handleInvestmentStrategyChange = (strategyKey: string) => {
    setSelectedInvestmentStrategy(strategyKey);

    if (strategyKey !== "custom") {
      const strategy =
        investmentStrategies[strategyKey as keyof typeof investmentStrategies];
      const newBreakdown = {
        mutualFundsRatio: strategy.mutualFunds,
        stocksRatio: strategy.stocks,
        debtRatio: strategy.debt,
        fixedDepositsRatio: strategy.fixedDeposits,
        digitalGoldRatio: strategy.digitalGold,
        othersRatio: strategy.others,
      };

      // Calculate new expected return based on investment breakdown
      const newExpectedReturn = calculateExpectedReturn(
        newBreakdown,
        formData.customReturns
      );

      const updatedFormData = {
        ...formData,
        investmentBreakdown: newBreakdown,
        expectedReturn: newExpectedReturn,
      };
      setFormData(updatedFormData);
    }
  };

  // Ensure investment allocations sum to 100%
  const ensureInvestmentTotal100 = (field: string, value: number) => {
    // Set to custom when user manually adjusts
    setSelectedInvestmentStrategy("custom");

    if (!formData.investmentBreakdown) return;

    const newBreakdown = { ...formData.investmentBreakdown, [field]: value };

    // Calculate total allocation
    const total =
      newBreakdown.mutualFundsRatio +
      newBreakdown.stocksRatio +
      newBreakdown.debtRatio +
      newBreakdown.fixedDepositsRatio +
      newBreakdown.digitalGoldRatio +
      newBreakdown.othersRatio;

    // If total exceeds 100%, proportionally reduce other fields
    if (total > 1) {
      const excess = total - 1;
      const fieldsToAdjust = [
        "mutualFundsRatio",
        "stocksRatio",
        "debtRatio",
        "fixedDepositsRatio",
        "digitalGoldRatio",
        "othersRatio",
      ].filter((f) => f !== field);

      fieldsToAdjust.forEach((adjustField) => {
        const currentValue =
          newBreakdown[adjustField as keyof typeof newBreakdown];
        const reduction = (currentValue / (total - value)) * excess;
        newBreakdown[adjustField as keyof typeof newBreakdown] = Math.max(
          0.01,
          currentValue - reduction
        );
      });
    }

    // Calculate new expected return based on updated breakdown
    const newExpectedReturn = calculateExpectedReturn(
      newBreakdown,
      formData.customReturns
    );

    setFormData((prev) => ({
      ...prev,
      investmentBreakdown: newBreakdown,
      expectedReturn: newExpectedReturn,
    }));
  };

  // Ensure allocations sum to 100%
  const ensureTotal100 = (field: string, value: number) => {
    // Set to custom when user manually adjusts
    setSelectedStrategy("custom");

    const newData = { ...formData, [field]: value };

    // Calculate total allocation
    const total =
      newData.needsRatio +
      newData.wantsRatio +
      newData.investmentRatio +
      newData.emergencyFundRatio;

    // If total exceeds 100%, proportionally reduce other fields
    if (total > 1) {
      const excess = total - 1;
      const fieldsToAdjust = [
        "needsRatio",
        "wantsRatio",
        "investmentRatio",
        "emergencyFundRatio",
      ].filter((f) => f !== field);

      fieldsToAdjust.forEach((adjustField) => {
        const currentValue =
          newData[
            adjustField as
              | "needsRatio"
              | "wantsRatio"
              | "investmentRatio"
              | "emergencyFundRatio"
          ];
        const reduction = (currentValue / (total - value)) * excess;
        newData[
          adjustField as
            | "needsRatio"
            | "wantsRatio"
            | "investmentRatio"
            | "emergencyFundRatio"
        ] = Math.max(0.05, currentValue - reduction);
      });
    }

    // Update legacy expenseRatio
    newData.expenseRatio = newData.needsRatio + newData.wantsRatio;

    setFormData(newData);
  };

  // Handle custom return changes
  const handleCustomReturnChange = (field: string, value: number) => {
    if (!formData.customReturns || !formData.investmentBreakdown) return;

    const updatedCustomReturns = {
      ...formData.customReturns,
      [field]: value,
    };

    // Recalculate expected return with new custom return
    const newExpectedReturn = calculateExpectedReturn(
      formData.investmentBreakdown,
      updatedCustomReturns
    );

    setFormData((prev) => ({
      ...prev,
      customReturns: updatedCustomReturns,
      expectedReturn: newExpectedReturn,
    }));
  };

  // Toggle custom returns mode
  const handleCustomReturnsToggle = (enabled: boolean) => {
    setUseCustomReturns(enabled);

    // Recalculate expected return based on current mode
    if (formData.investmentBreakdown) {
      const newExpectedReturn = calculateExpectedReturn(
        formData.investmentBreakdown,
        enabled ? formData.customReturns : undefined
      );

      setFormData((prev) => ({
        ...prev,
        expectedReturn: newExpectedReturn,
      }));
    }
  };

  const handleChange = (field: keyof AnalysisParams, value: number) => {
    if (
      [
        "needsRatio",
        "wantsRatio",
        "investmentRatio",
        "emergencyFundRatio",
      ].includes(field)
    ) {
      ensureTotal100(field, value);
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleAmountChange = (field: string, monthlyAmount: number) => {
    const ratio = getRatioFromAmount(monthlyAmount);
    const ratioField = `${field}Ratio` as keyof AnalysisParams;
    ensureTotal100(ratioField, ratio);
  };

  const handleMonthlySalaryChange = (newMonthlySalary: number) => {
    setMonthlySalary(newMonthlySalary);
    // Update the annual salary in formData for consistency
    setFormData((prev) => ({
      ...prev,
      startingSalary: newMonthlySalary * 12,
    }));
  };

  const showTooltip = (field: string) => setTooltipVisible(field);
  const hideTooltip = () => setTooltipVisible(null);

  const getTooltipContent = (field: string) => {
    const tooltips = {
      needs:
        "Essential expenses like rent, groceries, utilities, transportation, and minimum loan payments. These are expenses you cannot avoid.",
      wants:
        "Non-essential expenses like dining out, entertainment, shopping, subscriptions, and lifestyle upgrades. These are nice to have but not necessary.",
      investments:
        "Money allocated for long-term wealth building including mutual funds, stocks, SIPs, PPF, and retirement accounts.",
      emergencyFund:
        "Safety net for unexpected expenses like medical emergencies, job loss, or major repairs. Ideally 6-12 months of expenses.",
    };
    return tooltips[field as keyof typeof tooltips] || "";
  };

  // Reset all financial allocation to zero
  const handleResetAllocation = () => {
    setSelectedStrategy("custom");
    const resetData = {
      ...formData,
      needsRatio: 0,
      wantsRatio: 0,
      investmentRatio: 0,
      emergencyFundRatio: 0,
      expenseRatio: 0,
    };
    setFormData(resetData);
  };

  // Reset all investment allocation to zero
  const handleResetInvestmentAllocation = () => {
    setSelectedInvestmentStrategy("custom");
    if (!formData.investmentBreakdown) return;

    const resetBreakdown = {
      mutualFundsRatio: 0,
      stocksRatio: 0,
      debtRatio: 0,
      fixedDepositsRatio: 0,
      digitalGoldRatio: 0,
      othersRatio: 0,
    };

    // Recalculate expected return with reset breakdown
    const newExpectedReturn = calculateExpectedReturn(
      resetBreakdown,
      formData.customReturns
    );

    setFormData((prev) => ({
      ...prev,
      investmentBreakdown: resetBreakdown,
      expectedReturn: newExpectedReturn,
    }));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <div className="mb-4 pb-2 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Tell us about yourself</h3>
        </div>
        <BasicInformation
          formData={{
            startingAge: formData.startingAge,
            currentAge: formData.currentAge,
          }}
          monthlySalary={monthlySalary}
          onStartingAgeChange={(value) => handleChange("startingAge", value)}
          onCurrentAgeChange={(value) => handleChange("currentAge", value)}
          onMonthlySalaryChange={handleMonthlySalaryChange}
          getAnnualSalary={getAnnualSalary}
        />
      </div>

      <div>
        <div className="mb-4 pb-2 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">How do you spend your money?</h3>
        </div>
        <FinancialAllocation
          formData={{
            needsRatio: formData.needsRatio,
            wantsRatio: formData.wantsRatio,
            investmentRatio: formData.investmentRatio,
            emergencyFundRatio: formData.emergencyFundRatio,
          }}
          selectedStrategy={selectedStrategy}
          allocationStrategies={allocationStrategies}
          tooltipVisible={tooltipVisible}
          onStrategyChange={handleStrategyChange}
          onRatioChange={(field, value) =>
            handleChange(field as keyof AnalysisParams, value)
          }
          onAmountChange={(field, amount) => handleAmountChange(field, amount)}
          onResetAllocation={handleResetAllocation}
          showTooltip={showTooltip}
          hideTooltip={hideTooltip}
          getTooltipContent={getTooltipContent}
          calculateAmount={calculateAmount}
          getMonthlyAmount={getMonthlyAmount}
        />

        {/* Investment Amount Highlight */}
        <div className="bg-primary-50 dark:bg-primary-900/10 border border-primary-200 dark:border-primary-800 rounded-lg p-4 mt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-primary-500 rounded-full p-2">
                <Calculator className="h-5 w-5 text-slate-900" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Monthly Investment Amount
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Total amount allocated to investments each month
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {calculateAmount(formData.investmentRatio)}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                ({(formData.investmentRatio * 100).toFixed(1)}% of salary)
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-4 pb-2 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Your investment strategy</h3>
        </div>
        <div className="space-y-6">
          <InvestmentStrategy
            selectedInvestmentStrategy={selectedInvestmentStrategy}
            investmentStrategies={investmentStrategies}
            investmentBreakdown={formData.investmentBreakdown!}
            customReturns={formData.customReturns}
            useCustomReturns={useCustomReturns}
            expectedReturn={formData.expectedReturn}
            investmentRatio={formData.investmentRatio}
            tooltipVisible={tooltipVisible}
            onInvestmentStrategyChange={handleInvestmentStrategyChange}
            onInvestmentBreakdownChange={ensureInvestmentTotal100}
            onCustomReturnChange={handleCustomReturnChange}
            onCustomReturnsToggle={handleCustomReturnsToggle}
            onResetInvestmentAllocation={handleResetInvestmentAllocation}
            onTooltipShow={showTooltip}
            onTooltipHide={hideTooltip}
            getInvestmentAmount={getInvestmentAmount}
            calculateAmount={calculateAmount}
          />

          <MarketAssumptions
            expectedReturn={formData.expectedReturn}
            inflationRate={formData.inflationRate}
            salaryGrowthRate={formData.salaryGrowthRate}
            investmentTimeHorizon={formData.investmentTimeHorizon}
            useCustomReturns={useCustomReturns}
            useRealisticExpenses={formData.useRealisticExpenses}
            onChange={(field, value) =>
              handleChange(field as keyof AnalysisParams, value)
            }
            onToggle={handleToggle}
          />
        </div>
      </div>

      {/* Auto-analysis indicator */}
      {loading && (
        <div className="text-center py-4">
          <div className="inline-flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Analyzing...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisForm;
