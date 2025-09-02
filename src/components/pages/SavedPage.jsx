import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const SavedPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ApperIcon name="Heart" className="h-10 w-10 text-red-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Saved Properties
        </h1>
        
        <p className="text-gray-600 mb-6">
          Save your favorite properties to easily compare and revisit them later. Your saved properties will appear here.
        </p>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">How to save properties:</h3>
          <div className="space-y-3 text-left">
            <div className="flex items-start gap-3 text-sm text-gray-600">
              <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-primary-600">1</span>
              </div>
              <span>Browse properties on the main page</span>
            </div>
            <div className="flex items-start gap-3 text-sm text-gray-600">
              <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-primary-600">2</span>
              </div>
              <span>Click on a property to view details</span>
            </div>
            <div className="flex items-start gap-3 text-sm text-gray-600">
              <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-primary-600">3</span>
              </div>
              <span>Click the "Save Property" button</span>
            </div>
          </div>
        </div>
        
        <Button 
          onClick={() => window.location.href = "/browse"}
          className="flex items-center gap-2"
        >
          <ApperIcon name="Search" className="h-4 w-4" />
          Browse Properties
        </Button>
      </div>
    </div>
  );
};

export default SavedPage;