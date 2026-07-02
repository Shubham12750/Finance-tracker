// Test script to demonstrate why break-even age can be similar
// regardless of investment amount using REALISTIC EXPENSE MODEL

/**
 * Calculate realistic expenses with lifestyle saturation model
 * This is the same function used in the actual application
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
  // Base needs calculation with inflation
  const inflationFactor = Math.pow(1 + inflationRate, yearsFromStart);
  const baseNeeds = startingSalary * needsRatio * inflationFactor;

  // Wants calculation with lifestyle saturation
  const salaryMultiplier = currentSalary / startingSalary;
  const wantsSaturationPoint = 5; // Lifestyle saturates at 5x starting salary
  const wantsSaturationFactor =
    Math.min(salaryMultiplier, wantsSaturationPoint) / wantsSaturationPoint;
  const adjustedWants =
    startingSalary * wantsRatio * wantsSaturationFactor * inflationFactor;

  // Total adjusted expenses
  const adjustedExpenses = baseNeeds + adjustedWants;

  // Calculate adjusted investment ratio (can increase as expenses stabilize)
  const expenseRatio = adjustedExpenses / currentSalary;
  const maxInvestmentRatio = Math.min(
    0.6,
    investmentRatio + Math.max(0, wantsRatio - adjustedWants / currentSalary)
  );
  const adjustedInvestmentRatio = Math.min(
    maxInvestmentRatio,
    1 - expenseRatio - 0.05
  ); // Leave 5% buffer

  return {
    adjustedExpenses,
    adjustedInvestmentRatio,
    baseNeeds,
    adjustedWants,
    expenseRatio,
  };
}

function simulateBreakEven(needsRatio, wantsRatio, investmentRatio) {
  const startingSalary = 500000; // 5 lakh starting salary
  const expectedReturn = 0.12;
  const salaryGrowthRate = 0.08;
  const inflationRate = 0.06;
  const currentAge = 25;
  const startingAge = 21;

  let portfolioValue = 0;
  let age = currentAge;

  console.log(
    `\n=== Needs: ${(needsRatio * 100).toFixed(1)}%, Wants: ${(
      wantsRatio * 100
    ).toFixed(1)}%, Investment: ${(investmentRatio * 100).toFixed(1)}% ===`
  );

  for (let year = 0; year < 50; year++) {
    age = currentAge + year;
    const yearsFromStart = age - startingAge; // Years since career started

    // Calculate current salary
    const currentSalary = startingSalary * Math.pow(1 + salaryGrowthRate, year);

    // Use realistic expense model
    const expenseData = calculateRealisticExpenses({
      currentSalary,
      startingSalary,
      needsRatio,
      wantsRatio,
      investmentRatio,
      inflationRate,
      yearsFromStart,
    });

    const adjustedExpenses = expenseData.adjustedExpenses;
    const adjustedInvestmentRatio = expenseData.adjustedInvestmentRatio;

    // Calculate investment with adjusted ratio
    const annualInvestment = currentSalary * adjustedInvestmentRatio;

    // Add investment to portfolio
    portfolioValue += annualInvestment;

    // Apply returns
    portfolioValue *= 1 + expectedReturn;

    // Calculate annual return
    const annualReturn = portfolioValue * expectedReturn;

    // Check for break-even
    if (annualReturn >= adjustedExpenses) {
      console.log(`Break-even at age ${age}:`);
      console.log(
        `  Portfolio Value: ₹${(portfolioValue / 100000).toFixed(1)}L`
      );
      console.log(`  Annual Return: ₹${(annualReturn / 100000).toFixed(1)}L`);
      console.log(
        `  Annual Expenses: ₹${(adjustedExpenses / 100000).toFixed(1)}L`
      );
      console.log(`  Years to break-even: ${year}`);
      console.log(
        `  Total Invested: ₹${(
          (portfolioValue - annualReturn) /
          100000
        ).toFixed(1)}L (approx)`
      );
      console.log(`  Expense Breakdown:`);
      console.log(
        `    - Needs: ₹${(expenseData.baseNeeds / 100000).toFixed(1)}L`
      );
      console.log(
        `    - Wants: ₹${(expenseData.adjustedWants / 100000).toFixed(1)}L`
      );
      console.log(
        `    - Actual Investment Rate: ${(
          adjustedInvestmentRatio * 100
        ).toFixed(1)}%`
      );
      return age;
    }

    // Debug output for first few years
    if (year < 5) {
      console.log(
        `  Year ${year + 1}: Salary ₹${(currentSalary / 100000).toFixed(
          1
        )}L, Investment ₹${(annualInvestment / 100000).toFixed(
          1
        )}L, Expenses ₹${(adjustedExpenses / 100000).toFixed(1)}L`
      );
    }
  }

  console.log("No break-even found within 50 years");
  return null;
}

// Test different scenarios with realistic expense model
console.log("=".repeat(60));
console.log("BREAK-EVEN ANALYSIS: Using REALISTIC EXPENSE MODEL");
console.log("=".repeat(60));

// Scenario 1: Conservative approach
simulateBreakEven(0.5, 0.3, 0.15); // 50% needs, 30% wants, 15% investment

// Scenario 2: Balanced approach
simulateBreakEven(0.5, 0.3, 0.2); // 50% needs, 30% wants, 20% investment

// Scenario 3: Aggressive approach
simulateBreakEven(0.45, 0.25, 0.3); // 45% needs, 25% wants, 30% investment

console.log("\n" + "=".repeat(60));
console.log("SAME LIFESTYLE - DIFFERENT INVESTMENT:");
console.log("=".repeat(60));

// Keep lifestyle constant, vary investment (sacrifice wants for investment)
simulateBreakEven(0.5, 0.35, 0.15); // 50% needs, 35% wants, 15% investment
simulateBreakEven(0.5, 0.3, 0.2); // 50% needs, 30% wants, 20% investment
simulateBreakEven(0.5, 0.25, 0.25); // 50% needs, 25% wants, 25% investment
simulateBreakEven(0.5, 0.2, 0.3); // 50% needs, 20% wants, 30% investment

console.log("\n" + "=".repeat(60));
console.log("KEY INSIGHTS WITH REALISTIC MODEL:");
console.log("=".repeat(60));
console.log(
  "1. Wants expenses SATURATE as salary grows (lifestyle inflation control)"
);
console.log("2. Needs grow with inflation but wants don't grow proportionally");
console.log(
  "3. Higher investment ratios can lead to SIGNIFICANTLY earlier break-even"
);
console.log(
  "4. The model accounts for lifestyle saturation at 5x starting salary"
);
console.log(
  "5. Investment ratio can dynamically increase as expense ratio decreases"
);
