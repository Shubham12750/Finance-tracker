import React from "react";
import { Calculator, Info, Loader2 } from "lucide-react";

interface SubmitSectionProps {
  loading: boolean;
}

const SubmitSection: React.FC<SubmitSectionProps> = ({ loading }) => {
  return (
    <>
      {/* Tips */}
      <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <Info className="h-5 w-5 text-primary-600 dark:text-primary-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-primary-700 dark:text-primary-300">
            <p className="font-medium mb-1">Quick Tips:</p>
            <ul className="space-y-1 text-xs">
              <li>• Higher investment ratio = Earlier break-even</li>
              <li>• 14%+ returns are achievable with equity focus</li>
              <li>• Lower expense ratio dramatically improves timeline</li>
              <li>
                • Salary growth rate affects both expenses and investments
              </li>
              <li>• 8-12% annual salary growth is typical for careers</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full btn-primary flex items-center justify-center space-x-2"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Analyzing...</span>
          </>
        ) : (
          <>
            <Calculator className="h-4 w-4" />
            <span>Analyze Break-Even Point</span>
          </>
        )}
      </button>
    </>
  );
};

export default SubmitSection;
