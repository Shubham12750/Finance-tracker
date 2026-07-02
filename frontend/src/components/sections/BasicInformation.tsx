import React from "react";

interface BasicInformationProps {
  formData: {
    startingAge: number;
    currentAge: number;
  };
  monthlySalary: number;
  onStartingAgeChange: (value: number) => void;
  onCurrentAgeChange: (value: number) => void;
  onMonthlySalaryChange: (value: number) => void;
  getAnnualSalary: () => number;
}

const BasicInformation: React.FC<BasicInformationProps> = ({
  formData,
  monthlySalary,
  onStartingAgeChange,
  onCurrentAgeChange,
  onMonthlySalaryChange,
  getAnnualSalary,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
        Basic Information
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="relative group">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Starting Career Age
            <span className="ml-1 text-blue-500 cursor-help">ⓘ</span>
          </label>
          <input
            type="number"
            value={formData.startingAge}
            onChange={(e) => onStartingAgeChange(parseInt(e.target.value))}
            className="input-field"
            min="18"
            max="30"
          />
          <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-2 px-3 w-64 z-10">
            The age when you started earning your first salary. Used to
            calculate inflation adjustments from the beginning of your career.
          </div>
        </div>

        <div className="relative group">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Current Age
            <span className="ml-1 text-blue-500 cursor-help">ⓘ</span>
          </label>
          <input
            type="number"
            value={formData.currentAge}
            onChange={(e) => onCurrentAgeChange(parseInt(e.target.value))}
            className="input-field"
            min={formData.startingAge}
            max="60"
          />
          <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-2 px-3 w-64 z-10">
            Your current age. The analysis will project from this age forward to
            calculate break-even point.
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Current Monthly Salary (₹)
        </label>
        <input
          type="number"
          value={monthlySalary}
          onChange={(e) => onMonthlySalaryChange(parseInt(e.target.value) || 0)}
          className="input-field"
          min="0"
          step="1"
          placeholder="Enter monthly salary"
        />
        <div className="mt-1 space-y-1">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Your current monthly salary before taxes
          </p>
          <p className="text-xs text-primary-600 dark:text-primary-400 font-medium">
            Annual equivalent: ₹{getAnnualSalary().toLocaleString("en-IN")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BasicInformation;
