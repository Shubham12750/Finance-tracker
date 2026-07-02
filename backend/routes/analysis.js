const express = require("express");
const router = express.Router();

/**
 * Investment Break-even Analysis Route
 * Calculates when investment returns will cover living expenses
 */
router.post("/analyze", async (req, res) => {
  try {
    const {
      startingAge = 21,
      currentAge,
      startingSalary,
      // New allocation fields
      needsRatio,
      wantsRatio,
      investmentRatio,
      emergencyFundRatio,
      // Legacy fields for backward compatibility
      expenseRatio,
      expectedReturn,
      inflationRate = 0.06,
      salaryGrowthRate = 0.08,
      // Investment time horizon
      investmentTimeHorizon = 35,
      // Investment strategy breakdown (optional for future use)
      investmentBreakdown,
      // Lifestyle saturation model
      useRealisticExpenses = true, // New parameter to enable realistic expense modeling
    } = req.body;

    // Calculate effective expense ratio and investment ratio from allocation fields
    const effectiveExpenseRatio =
      needsRatio && wantsRatio ? needsRatio + wantsRatio : expenseRatio;
    const effectiveInvestmentRatio = investmentRatio;

    // Validate required parameters
    if (
      !currentAge ||
      !startingSalary ||
      !effectiveExpenseRatio ||
      !effectiveInvestmentRatio ||
      !expectedReturn
    ) {
      return res.status(400).json({
        error: "Missing required parameters",
        required: [
          "currentAge",
          "startingSalary",
          "expenseRatio (or needsRatio + wantsRatio)",
          "investmentRatio",
          "expectedReturn",
        ],
      });
    }

    // Perform the analysis
    const analysisResults = calculateBreakEvenAnalysis({
      startingAge,
      currentAge,
      startingSalary,
      expenseRatio: effectiveExpenseRatio,
      investmentRatio: effectiveInvestmentRatio,
      needsRatio,
      wantsRatio,
      emergencyFundRatio,
      expectedReturn,
      inflationRate,
      salaryGrowthRate,
      investmentTimeHorizon,
      useRealisticExpenses,
    });

    // Generate scenario comparisons
    const scenarios = generateScenarioAnalysis({
      startingAge,
      currentAge,
      startingSalary,
      needsRatio,
      wantsRatio,
      emergencyFundRatio,
      inflationRate,
      salaryGrowthRate,
      investmentTimeHorizon,
      useRealisticExpenses,
    });

    const response = {
      ...analysisResults,
      scenarios,
      metadata: {
        analysisDate: new Date().toISOString(),
        parameters: req.body,
      },
    };

    res.json(response);
  } catch (error) {
    console.error("Analysis error:", error);
    res.status(500).json({
      error: "Analysis calculation failed",
      message: error.message,
    });
  }
});

/**
 * Calculate break-even analysis with comprehensive projections
 * @param {Object} params - Analysis parameters
 * @param {number} params.startingAge - The age when the user started their career/earning salary
 *                                      Used as baseline for inflation calculations from career start
 * @param {number} params.currentAge - The user's current age, starting point for projections
 * @param {number} params.startingSalary - Current annual salary (will be grown from current age)
 * @param {number} params.expenseRatio - Ratio of salary spent on expenses (needs + wants)
 * @param {number} params.investmentRatio - Ratio of salary invested
 * @param {number} params.expectedReturn - Expected annual return on investments
 * @param {number} params.inflationRate - Annual inflation rate for expense adjustments
 * @param {number} params.salaryGrowthRate - Annual salary growth rate
 */
function calculateBreakEvenAnalysis(params) {
  const {
    startingAge,
    currentAge,
    startingSalary,
    expenseRatio,
    investmentRatio,
    needsRatio,
    wantsRatio,
    emergencyFundRatio,
    expectedReturn,
    inflationRate,
    salaryGrowthRate,
    investmentTimeHorizon = 35,
    useRealisticExpenses = true,
  } = params;

  let portfolioValue = 0;
  let breakEvenAge = null;
  let selfSustainabilityAge = null; // New: when monthly returns = monthly investment
  let totalInvested = 0;

  const projectionData = {
    ages: [],
    portfolioValues: [],
    annualReturns: [],
    monthlyReturns: [], // New: track monthly returns for self-sustainability
    annualExpenses: [],
    salaries: [],
    investments: [],
    monthlyInvestments: [], // New: track monthly investment amounts
    cumulativeInvestments: [],
  };

  // Calculate projections year by year from current age until break-even or reasonable limit
  // We'll calculate up to age 100 to ensure we capture most scenarios
  const maxAge = 100;
  let calculatedToAge = currentAge;

  for (let age = currentAge; age <= maxAge; age++) {
    calculatedToAge = age;
    // Years since career started (for inflation calculations on expenses)
    const yearsFromStart = age - startingAge;
    // Years from current age (for salary growth calculations)
    const yearsFromCurrent = age - currentAge;

    // Check if we're still within the investment time horizon
    const stillInvesting = yearsFromCurrent < investmentTimeHorizon;

    // Calculate current salary with growth from current age forward
    const currentSalary =
      startingSalary * Math.pow(1 + salaryGrowthRate, yearsFromCurrent);

    let adjustedExpenses, adjustedInvestmentRatio;

    if (useRealisticExpenses && needsRatio && wantsRatio) {
      // Use realistic expense model with lifestyle saturation
      const expenseData = calculateRealisticExpenses({
        currentSalary,
        startingSalary,
        needsRatio,
        wantsRatio,
        investmentRatio,
        inflationRate,
        yearsFromStart,
      });
      adjustedExpenses = expenseData.adjustedExpenses;
      adjustedInvestmentRatio = expenseData.adjustedInvestmentRatio;
    } else {
      // Use legacy model (expenses grow with salary)
      adjustedExpenses =
        currentSalary *
        expenseRatio *
        Math.pow(1 + inflationRate, yearsFromStart);
      adjustedInvestmentRatio = investmentRatio;
    }

    // Calculate annual investment with adjusted ratio (only if still within time horizon)
    const annualInvestment = stillInvesting
      ? currentSalary * adjustedInvestmentRatio
      : 0;
    const monthlyInvestment = annualInvestment / 12;

    // Add new investment to portfolio (only if still investing)
    if (stillInvesting) {
      portfolioValue += annualInvestment;
      totalInvested += annualInvestment;
    }

    // Calculate annual return from portfolio BEFORE applying growth
    const annualReturn = portfolioValue * expectedReturn;

    // Apply returns to the portfolio (this happens regardless of whether we're still investing)
    portfolioValue *= 1 + expectedReturn;

    // Calculate monthly return from portfolio for self-sustainability check
    const monthlyReturn = annualReturn / 12;

    // Check for break-even point (when annual returns cover realistic expenses)
    if (annualReturn >= adjustedExpenses && breakEvenAge === null) {
      breakEvenAge = age;
    }

    // Check for self-sustainability point (when monthly returns equal current monthly investment)
    // Note: We use the current year's monthly investment amount for comparison
    if (monthlyReturn >= monthlyInvestment && selfSustainabilityAge === null) {
      selfSustainabilityAge = age;
    }

    // Store data for charts (limit chart data to first 60 years for performance, but always include time horizon)
    const chartLimit = Math.max(
      currentAge + 60,
      currentAge + investmentTimeHorizon
    );
    if (age <= chartLimit) {
      projectionData.ages.push(age);
      projectionData.portfolioValues.push(Math.round(portfolioValue));
      projectionData.annualReturns.push(Math.round(annualReturn));
      projectionData.monthlyReturns.push(Math.round(monthlyReturn));
      projectionData.annualExpenses.push(Math.round(adjustedExpenses));
      projectionData.salaries.push(Math.round(currentSalary));
      projectionData.investments.push(Math.round(annualInvestment));
      projectionData.monthlyInvestments.push(Math.round(monthlyInvestment));
      projectionData.cumulativeInvestments.push(Math.round(totalInvested));
    }

    // If we found both break-even and self-sustainability and have sufficient chart data, we can stop
    // But always continue until at least the time horizon age
    const minRequiredAge = Math.max(
      breakEvenAge ? breakEvenAge + 5 : 0,
      selfSustainabilityAge ? selfSustainabilityAge + 5 : 0,
      currentAge + investmentTimeHorizon
    );

    if (breakEvenAge && selfSustainabilityAge && age >= minRequiredAge) {
      break;
    }
  }

  // Calculate key metrics
  const finalPortfolioValue =
    projectionData.portfolioValues[projectionData.portfolioValues.length - 1];
  const finalAnnualReturn =
    projectionData.annualReturns[projectionData.annualReturns.length - 1];
  const finalExpenses =
    projectionData.annualExpenses[projectionData.annualExpenses.length - 1];
  const currentMonthlySIP = (startingSalary * investmentRatio) / 12;

  // Calculate portfolio value at investment time horizon
  const timeHorizonAge = currentAge + investmentTimeHorizon;
  const timeHorizonIndex = projectionData.ages.indexOf(timeHorizonAge);

  const portfolioValueAtTimeHorizon =
    timeHorizonIndex >= 0
      ? projectionData.portfolioValues[timeHorizonIndex]
      : null;

  const totalInvestedAtTimeHorizon =
    timeHorizonIndex >= 0
      ? projectionData.cumulativeInvestments[timeHorizonIndex]
      : totalInvested;

  // Calculate inflation-adjusted value of portfolio at time horizon
  // This shows what the portfolio value means in today's purchasing power
  const inflationAdjustedPortfolioValue = portfolioValueAtTimeHorizon
    ? portfolioValueAtTimeHorizon /
      Math.pow(1 + inflationRate, investmentTimeHorizon)
    : null;

  // Calculate required SIP for earlier break-even (if no break-even found)
  let requiredMonthlySIP = null;
  if (!breakEvenAge) {
    // Calculate required investment ratio for break-even by age 50
    const targetAge = 50;
    let minRatio = investmentRatio;
    let maxRatio = 0.8;

    // Simple calculation without recursion
    while (maxRatio - minRatio > 0.01 && maxRatio <= 0.8) {
      const testRatio = (minRatio + maxRatio) / 2;

      // Quick test calculation
      let testPortfolio = 0;
      let testBreakEven = null;

      for (let age = currentAge; age <= targetAge && !testBreakEven; age++) {
        const yearsFromCurrent = age - currentAge;
        const testSalary =
          startingSalary * Math.pow(1 + salaryGrowthRate, yearsFromCurrent);
        const testExpenses =
          testSalary *
          expenseRatio *
          Math.pow(1 + inflationRate, age - startingAge);
        const testInvestment = testSalary * testRatio;

        testPortfolio += testInvestment;

        const testReturn = testPortfolio * expectedReturn;
        testPortfolio *= 1 + expectedReturn;
        if (testReturn >= testExpenses) {
          testBreakEven = age;
        }
      }

      if (testBreakEven && testBreakEven <= targetAge) {
        maxRatio = testRatio;
        requiredMonthlySIP = (startingSalary * testRatio) / 12;
      } else {
        minRatio = testRatio;
      }

      // Prevent infinite loop
      if (minRatio >= 0.79) break;
    }
  }

  // Life expectancy constants for warnings
  const averageLifeExpectancy = 75; // Global average
  const typicalRetirementAge = 65;

  // Calculate warning flags
  const isBreakEvenBeyondLifeExpectancy =
    breakEvenAge && breakEvenAge > averageLifeExpectancy;
  const isBreakEvenBeyondRetirement =
    breakEvenAge && breakEvenAge > typicalRetirementAge;

  return {
    breakEvenAge,
    portfolioValue: breakEvenAge
      ? projectionData.portfolioValues[
          projectionData.ages.indexOf(breakEvenAge)
        ]
      : finalPortfolioValue, // fallback to final value if no break-even
    annualReturn: finalAnnualReturn,
    annualExpenses: finalExpenses,
    totalInvested: Math.round(totalInvested),
    yearsToBreakEven: breakEvenAge ? breakEvenAge - currentAge : null,
    monthlySipNeeded: Math.round(currentMonthlySIP),
    requiredMonthlySIP: requiredMonthlySIP
      ? Math.round(requiredMonthlySIP)
      : null,
    // Time horizon specific metrics
    timeHorizonAge,
    portfolioValueAtTimeHorizon: portfolioValueAtTimeHorizon
      ? Math.round(portfolioValueAtTimeHorizon)
      : null,
    totalInvestedAtTimeHorizon: Math.round(totalInvestedAtTimeHorizon),
    inflationAdjustedPortfolioValue: inflationAdjustedPortfolioValue
      ? Math.round(inflationAdjustedPortfolioValue)
      : null,
    // New self-sustainability metrics
    selfSustainabilityAge,
    yearsToSelfSustainability: selfSustainabilityAge
      ? selfSustainabilityAge - currentAge
      : null,
    selfSustainabilityPortfolioValue: selfSustainabilityAge
      ? projectionData.portfolioValues[
          projectionData.ages.indexOf(selfSustainabilityAge)
        ]
      : null,
    monthlyReturnAtSustainability: selfSustainabilityAge
      ? projectionData.monthlyReturns[
          projectionData.ages.indexOf(selfSustainabilityAge)
        ]
      : null,
    chartData: projectionData,
    breakEvenPortfolioValue: breakEvenAge
      ? projectionData.portfolioValues[
          projectionData.ages.indexOf(breakEvenAge)
        ]
      : null,
    financialIndependenceRatio: breakEvenAge
      ? finalAnnualReturn / finalExpenses
      : 0,
    // Warning flags for unrealistic scenarios
    warnings: {
      breakEvenBeyondLifeExpectancy: isBreakEvenBeyondLifeExpectancy,
      breakEvenBeyondRetirement: isBreakEvenBeyondRetirement,
      noBreakEvenFound: !breakEvenAge,
      // New self-sustainability warnings
      selfSustainabilityBeyondLifeExpectancy:
        selfSustainabilityAge && selfSustainabilityAge > averageLifeExpectancy,
      selfSustainabilityBeyondRetirement:
        selfSustainabilityAge && selfSustainabilityAge > typicalRetirementAge,
      noSelfSustainabilityFound: !selfSustainabilityAge,
      calculatedToAge: calculatedToAge,
    },
    // Include allocation breakdown if available
    allocationBreakdown:
      needsRatio && wantsRatio && emergencyFundRatio
        ? {
            needsRatio,
            wantsRatio,
            investmentRatio,
            emergencyFundRatio,
            monthlyNeeds: Math.round((startingSalary * needsRatio) / 12),
            monthlyWants: Math.round((startingSalary * wantsRatio) / 12),
            monthlyInvestments: Math.round(
              (startingSalary * investmentRatio) / 12
            ),
            monthlyEmergencyFund: Math.round(
              (startingSalary * emergencyFundRatio) / 12
            ),
          }
        : null,
  };
}

/**
 * Generate multiple scenario analyses for comparison
 */
function generateScenarioAnalysis(baseParams) {
  const scenarios = {
    // Form-based allocation strategies
    balanced: {
      name: "⚖️ 50/30/20 Rule",
      description: "Popular balanced approach for most people",
      needsRatio: 0.5,
      wantsRatio: 0.3,
      investmentRatio: 0.15,
      emergencyFundRatio: 0.05,
      expectedReturn: 0.12,
    },
    fire: {
      name: "🔥 FIRE Strategy",
      description: "Financial Independence Retire Early - aggressive saving",
      needsRatio: 0.4,
      wantsRatio: 0.1,
      investmentRatio: 0.4,
      emergencyFundRatio: 0.1,
      expectedReturn: 0.14,
    },
    aggressive: {
      name: "🚀 Aggressive Investor",
      description: "Maximize wealth building with high investment ratio",
      needsRatio: 0.45,
      wantsRatio: 0.15,
      investmentRatio: 0.3,
      emergencyFundRatio: 0.1,
      expectedReturn: 0.16,
    },
    conservative: {
      name: "🛡️ Conservative Saver",
      description: "Security-focused with larger emergency fund",
      needsRatio: 0.5,
      wantsRatio: 0.2,
      investmentRatio: 0.15,
      emergencyFundRatio: 0.15,
      expectedReturn: 0.12,
    },
    student: {
      name: "🎓 Fresh Graduate",
      description: "Starting career with lower investment capacity",
      needsRatio: 0.6,
      wantsRatio: 0.25,
      investmentRatio: 0.1,
      emergencyFundRatio: 0.05,
      expectedReturn: 0.12,
    },
    minimalist: {
      name: "🧘 Minimalist",
      description: "Low expenses, high savings rate",
      needsRatio: 0.35,
      wantsRatio: 0.15,
      investmentRatio: 0.35,
      emergencyFundRatio: 0.15,
      expectedReturn: 0.14,
    },
    lifestyle: {
      name: "🍸 Lifestyle Focused",
      description: "Higher wants allocation for lifestyle enjoyment",
      needsRatio: 0.45,
      wantsRatio: 0.35,
      investmentRatio: 0.15,
      emergencyFundRatio: 0.05,
      expectedReturn: 0.12,
    },
  };

  const scenarioResults = {};

  Object.keys(scenarios).forEach((key) => {
    const scenario = scenarios[key];
    const scenarioParams = {
      ...baseParams,
      needsRatio: scenario.needsRatio,
      wantsRatio: scenario.wantsRatio,
      investmentRatio: scenario.investmentRatio,
      emergencyFundRatio: scenario.emergencyFundRatio,
      expenseRatio: scenario.needsRatio + scenario.wantsRatio,
      expectedReturn: scenario.expectedReturn,
    };

    scenarioResults[key] = {
      ...scenario,
      results: calculateBreakEvenAnalysis(scenarioParams),
    };
  });

  return scenarioResults;
}



/**
 * Health check for analysis service
 */
router.get("/health", (req, res) => {
  res.json({
    status: "OK",
    service: "Investment Analysis",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

/**
 * Calculate realistic expenses with lifestyle saturation model
 * This addresses the unrealistic assumption that expenses grow proportionally with salary forever
 */
function calculateRealisticExpenses({
  currentSalary,
  startingSalary,
  needsRatio,
  wantsRatio,
  investmentRatio,
  inflationRate,
  yearsFromStart,
}) {
  // Define lifestyle saturation parameters
  const NEEDS_SATURATION_MULTIPLIER = 2.5; // Needs saturate at 2.5x starting salary
  const WANTS_SATURATION_MULTIPLIER = 1.8; // Wants saturate at 1.8x starting salary
  const MIN_INVESTMENT_RATIO = investmentRatio; // Minimum investment ratio
  const MAX_INVESTMENT_RATIO = 0.7; // Maximum investment ratio (cap for safety)

  // Calculate base amounts at starting salary
  const baseNeeds = startingSalary * needsRatio;
  const baseWants = startingSalary * wantsRatio;

  // Calculate saturation points (adjusted for inflation from career start)
  const needsSaturationPoint =
    baseNeeds *
    NEEDS_SATURATION_MULTIPLIER *
    Math.pow(1 + inflationRate, yearsFromStart);
  const wantsSaturationPoint =
    baseWants *
    WANTS_SATURATION_MULTIPLIER *
    Math.pow(1 + inflationRate, yearsFromStart);

  // Calculate current theoretical needs/wants if they grew with salary (no additional inflation here)
  const theoreticalNeeds = currentSalary * needsRatio;
  const theoreticalWants = currentSalary * wantsRatio;

  // Apply saturation logic with consistent inflation treatment
  let actualNeeds, actualWants;

  // For needs: Apply saturation cap, then ensure inflation adjustment
  if (theoreticalNeeds <= needsSaturationPoint) {
    // Needs haven't hit saturation yet - they can grow with salary
    // Apply minimal inflation adjustment since salary growth already accounts for economic growth
    actualNeeds =
      theoreticalNeeds * Math.pow(1 + inflationRate * 0.2, yearsFromStart);
  } else {
    // Needs have hit saturation - use the inflation-adjusted saturation point
    actualNeeds = needsSaturationPoint;
  }

  // For wants: More controlled growth - lifestyle choice
  if (theoreticalWants <= wantsSaturationPoint) {
    // Wants can be controlled - grow slower than salary and inflation
    const controlledWantsGrowthRate = Math.min(0.03, inflationRate * 0.5); // Very conservative wants growth
    actualWants =
      baseWants * Math.pow(1 + controlledWantsGrowthRate, yearsFromStart);
  } else {
    // Wants have hit saturation - use the inflation-adjusted saturation point
    actualWants = wantsSaturationPoint;
  }

  const adjustedExpenses = actualNeeds + actualWants;

  // Calculate adjusted investment ratio
  // As expenses saturate, more income goes to investments
  const expenseRatio = adjustedExpenses / currentSalary;
  const remainingRatio = 1 - expenseRatio;

  // Split remaining ratio between emergency fund and investments
  const emergencyFundRatio = Math.min(0.1, remainingRatio * 0.2); // Cap emergency fund
  const adjustedInvestmentRatio = Math.min(
    MAX_INVESTMENT_RATIO,
    Math.max(MIN_INVESTMENT_RATIO, remainingRatio - emergencyFundRatio)
  );

  return {
    adjustedExpenses,
    adjustedInvestmentRatio,
    breakdown: {
      actualNeeds,
      actualWants,
      needsSaturated: theoreticalNeeds > needsSaturationPoint,
      wantsSaturated: theoreticalWants > wantsSaturationPoint,
      expenseRatio,
      emergencyFundRatio,
    },
  };
}

module.exports = router;
module.exports.calculateBreakEvenAnalysis = calculateBreakEvenAnalysis;
