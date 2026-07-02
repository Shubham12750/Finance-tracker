// Load the analysis module
const { calculateBreakEvenAnalysis } = require("./routes/analysis");

// Test parameters that match the form defaults
const testParams = {
  startingSalary: 500000, // 5L
  currentAge: 25,
  startingAge: 21,
  investmentTimeHorizon: 35, // This should trigger time horizon calculations
  needsRatio: 0.5,
  wantsRatio: 0.3,
  investmentRatio: 0.15,
  emergencyFundRatio: 0.05,
  expectedReturn: 0.12,
  salaryGrowthRate: 0.08,
  inflationRate: 0.06,
  useRealisticExpenses: true,
};

console.log("=== Testing Time Horizon Calculations ===");
console.log("Test Parameters:");
console.log(
  `- Investment Time Horizon: ${testParams.investmentTimeHorizon} years`
);
console.log(`- Current Age: ${testParams.currentAge}`);
console.log(
  `- Expected Time Horizon Age: ${
    testParams.currentAge + testParams.investmentTimeHorizon
  }`
);
console.log("");

// Call the analysis function directly
const result = calculateBreakEvenAnalysis(testParams);

console.log("=== Time Horizon Results ===");
console.log(`Time Horizon Age: ${result.timeHorizonAge}`);
console.log(
  `Available Ages in Data: [${result.chartData.ages
    .slice(0, 10)
    .join(", ")}...${result.chartData.ages.slice(-5).join(", ")}]`
);
console.log(`Chart Data Length: ${result.chartData.ages.length}`);
console.log(`Max Age in Data: ${Math.max(...result.chartData.ages)}`);
console.log(
  `Portfolio Value at Time Horizon: ₹${
    result.portfolioValueAtTimeHorizon
      ? (result.portfolioValueAtTimeHorizon / 100000).toFixed(1) + "L"
      : "N/A"
  }`
);
console.log(
  `Total Invested at Time Horizon: ₹${(
    result.totalInvestedAtTimeHorizon / 100000
  ).toFixed(1)}L`
);
console.log(
  `Inflation Adjusted Portfolio Value: ₹${
    result.inflationAdjustedPortfolioValue
      ? (result.inflationAdjustedPortfolioValue / 100000).toFixed(1) + "L"
      : "N/A"
  }`
);

if (result.portfolioValueAtTimeHorizon && result.totalInvestedAtTimeHorizon) {
  const multiplier =
    result.portfolioValueAtTimeHorizon / result.totalInvestedAtTimeHorizon;
  console.log(`Wealth Multiplication Factor: ${multiplier.toFixed(1)}x`);
}

console.log("");
console.log("=== Basic Break-even Results ===");
console.log(`Break-even Age: ${result.breakEvenAge || "N/A"}`);
console.log(
  `Portfolio Value at Break-even: ₹${
    result.portfolioValue
      ? (result.portfolioValue / 100000).toFixed(1) + "L"
      : "N/A"
  }`
);

console.log("");
console.log("=== VALUE COMPARISON ===");
console.log(
  `Portfolio at Break-even (age ${result.breakEvenAge}): ₹${(
    result.portfolioValue / 100000
  ).toFixed(1)}L`
);
console.log(
  `Portfolio at Time Horizon (age ${result.timeHorizonAge}): ₹${(
    result.portfolioValueAtTimeHorizon / 100000
  ).toFixed(1)}L`
);
console.log(
  `Growth after Break-even: ₹${
    (
      (result.portfolioValueAtTimeHorizon - result.portfolioValue) /
      100000
    ).toFixed(1) + "L"
  }`
);
console.log(
  `Growth Multiple: ${(
    result.portfolioValueAtTimeHorizon / result.portfolioValue
  ).toFixed(1)}x`
);
console.log(
  `Additional Years of Growth: ${
    result.timeHorizonAge - result.breakEvenAge
  } years`
);
