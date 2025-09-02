import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="flex-1 flex items-center justify-center p-12">
      <div className="text-center max-w-md mx-auto">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ApperIcon name="AlertCircle" className="h-8 w-8 text-red-600" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Oops! Something went wrong
        </h3>
        
        <p className="text-gray-600 mb-8">
          {message}. Please try again or contact support if the problem persists.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {onRetry && (
            <Button onClick={onRetry} className="flex items-center gap-2">
              <ApperIcon name="RefreshCw" className="h-4 w-4" />
              Try Again
            </Button>
          )}
          <Button
            variant="secondary"
            onClick={() => window.location.reload()}
            className="flex items-center gap-2"
          >
            <ApperIcon name="RotateCcw" className="h-4 w-4" />
            Refresh Page
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Error;