import React from "react";
import ApperIcon from "@/components/ApperIcon";

const MapViewPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ApperIcon name="Map" className="h-10 w-10 text-primary-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Map View Coming Soon
        </h1>
        
        <p className="text-gray-600 mb-6">
          We&apos;re working on an interactive map view to help you visualize property locations and explore neighborhoods.
        </p>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Planned Features:</h3>
          <div className="space-y-2 text-left">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ApperIcon name="Check" className="h-4 w-4 text-green-500" />
              <span>Interactive property markers</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ApperIcon name="Check" className="h-4 w-4 text-green-500" />
              <span>Neighborhood information</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ApperIcon name="Check" className="h-4 w-4 text-green-500" />
              <span>School districts and amenities</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ApperIcon name="Check" className="h-4 w-4 text-green-500" />
              <span>Transportation and commute times</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapViewPage;