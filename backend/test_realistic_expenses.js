const express = require("express");
const analysisRouter = require("./routes/analysis.js");

// Create a simple test to demonstrate the difference between realistic and legacy expense models

const testParams = {
  startingAge: 21,
  currentAge: 25,
  startingSalary: 50000,
  needsRatio: 0.5,
  wantsRatio: 0.3,
  investmentRatio: 0.2,
  emergencyFundRatio: 0.0,
  expectedReturn: 0.12,
  inflationRate: 0.06,
  salaryGrowthRate: 0.08,
};

console.log("🔍 Testing Realistic vs Legacy Expense Models\n");
console.log("📊 Test Parameters:");
console.log(`Starting Salary: ₹${testParams.startingSalary.toLocaleString()}`);
console.log(`Current Age: ${testParams.currentAge}`);
console.log(
  `Needs: ${testParams.needsRatio * 100}%, Wants: ${
    testParams.wantsRatio * 100
  }%, Investment: ${testParams.investmentRatio * 100}%`
);
console.log(`Expected Return: ${testParams.expectedReturn * 100}%\n`);

// Simulate manual calculation to show the difference
console.log("💡 Demonstrating the Expense Model Difference:\n");

const yearsToProject = [0, 5, 10, 15, 20];

yearsToProject.forEach((years) => {
  const age = testParams.currentAge + years;
  const futureSelary =
    testParams.startingSalary *
    Math.pow(1 + testParams.salaryGrowthRate, years);

  // Legacy model (current implementation)
  const legacyExpenses =
    futureSelary *
    (testParams.needsRatio + testParams.wantsRatio) *
    Math.pow(1 + testParams.inflationRate, years);

  // Realistic model with corrected inflation treatment
  const baseNeeds = testParams.startingSalary * testParams.needsRatio;
  const baseWants = testParams.startingSalary * testParams.wantsRatio;

  // Saturation points grow with full inflation
  const needsSaturation =
    baseNeeds * 2.5 * Math.pow(1 + testParams.inflationRate, years);
  const wantsSaturation =
    baseWants * 1.8 * Math.pow(1 + testParams.inflationRate, years);

  const theoreticalNeeds = futureSelary * testParams.needsRatio;
  const theoreticalWants = futureSelary * testParams.wantsRatio;

  // Apply realistic inflation logic
  let realisticNeeds, realisticWants;

  if (theoreticalNeeds <= needsSaturation) {
    // Needs haven't saturated - minimal inflation adjustment
    realisticNeeds =
      theoreticalNeeds * Math.pow(1 + testParams.inflationRate * 0.2, years);
  } else {
    // Needs saturated - use inflation-adjusted saturation point
    realisticNeeds = needsSaturation;
  }

  if (theoreticalWants <= wantsSaturation) {
    // Wants controlled growth
    const controlledWantsGrowthRate = Math.min(
      0.03,
      testParams.inflationRate * 0.5
    );
    realisticWants = baseWants * Math.pow(1 + controlledWantsGrowthRate, years);
  } else {
    // Wants saturated
    realisticWants = wantsSaturation;
  }

  const realisticExpenses = realisticNeeds + realisticWants;

  console.log(`📅 Age ${age} (Year ${years}):`);
  console.log(`   Salary: ₹${Math.round(futureSelary).toLocaleString()}`);
  console.log(
    `   Legacy Expenses: ₹${Math.round(
      legacyExpenses
    ).toLocaleString()} (${Math.round(
      (legacyExpenses / futureSelary) * 100
    )}% of salary)`
  );
  console.log(
    `   Realistic Expenses: ₹${Math.round(
      realisticExpenses
    ).toLocaleString()} (${Math.round(
      (realisticExpenses / futureSelary) * 100
    )}% of salary)`
  );
  console.log(
    `   Savings with Realistic Model: ₹${Math.round(
      legacyExpenses - realisticExpenses
    ).toLocaleString()}\n`
  );
});

console.log("🎯 Key Insights:");
console.log("1. Legacy model: Expenses grow indefinitely with salary");
console.log(
  "2. Realistic model: Expenses saturate, allowing higher investment rates"
);
console.log("3. This makes financial independence much more achievable!");
console.log("\n💰 Inflation Treatment Explained:");
console.log("📈 Legacy Model:");
console.log("   - Expenses = Salary × ExpenseRatio × (1 + inflation)^years");
console.log("   - This compounds BOTH salary growth (8%) AND inflation (6%)");
console.log("   - Results in ~14.5% annual expense growth (unrealistic!)");
console.log("\n🎯 Realistic Model:");
console.log("   - Saturation caps grow with full inflation (6%)");
console.log("   - Needs get minimal inflation adjustment (1.2% = 6% × 0.2)");
console.log("   - Wants get controlled growth (1.5% = min(3%, 6% × 0.5))");
console.log("   - This prevents runaway expense inflation!");
