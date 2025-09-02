import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No properties found", 
  description = "Try adjusting your search criteria or filters to find more properties.",
  actionLabel = "Clear Filters",
  onAction
}) => {
  return (
    <div className="flex-1 flex items-center justify-center p-12">
      <div className="text-center max-w-md mx-auto">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ApperIcon name="Home" className="h-10 w-10 text-gray-400" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        
        <p className="text-gray-600 mb-8">
          {description}
        </p>
        
        <div className="space-y-4">
          {onAction && (
            <Button onClick={onAction} variant="primary">
              {actionLabel}
            </Button>
          )}
          
          <div className="text-sm text-gray-500">
            <p>Popular searches:</p>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              <Button variant="ghost" size="sm" className="text-xs">
                Los Angeles
              </Button>
              <Button variant="ghost" size="sm" className="text-xs">
                New York
              </Button>
              <Button variant="ghost" size="sm" className="text-xs">
                Miami
              </Button>
              <Button variant="ghost" size="sm" className="text-xs">
                Chicago
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Empty;