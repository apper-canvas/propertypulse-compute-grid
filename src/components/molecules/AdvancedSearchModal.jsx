import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';
import { formatPrice } from '@/utils/formatters';

const AdvancedSearchModal = ({ isOpen, onClose, filters, onFiltersChange, onApplyFilters }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const schoolDistrictOptions = [
    'Beverly Hills Unified',
    'Los Angeles Unified',
    'Santa Monica-Malibu Unified',
    'Palo Alto Unified',
    'San Francisco Unified',
    'Manhattan School District',
    'Brooklyn School District'
  ];

  const neighborhoodOptions = [
    'Downtown',
    'Beverly Hills',
    'Santa Monica',
    'Venice Beach',
    'Hollywood',
    'Manhattan',
    'Brooklyn Heights',
    'SoHo',
    'Chelsea'
  ];

  const featureOptions = [
    'Swimming Pool',
    'Gym/Fitness Center',
    'Parking Garage',
    'Balcony/Terrace',
    'Fireplace',
    'Walk-in Closet',
    'Hardwood Floors',
    'Stainless Steel Appliances',
    'In-Unit Laundry',
    'Central Air',
    'Dishwasher',
    'Pet Friendly'
  ];

  const handleLocalFilterChange = (key, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleArrayFilterChange = (key, value, checked) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: checked
        ? [...(prev[key] || []), value]
        : (prev[key] || []).filter(item => item !== value)
    }));
  };

  const handleApply = () => {
    Object.keys(localFilters).forEach(key => {
      onFiltersChange(key, localFilters[key]);
    });
    onApplyFilters();
  };

  const handleReset = () => {
    const resetFilters = {
      query: "",
      minPrice: 0,
      maxPrice: 5000000,
      propertyTypes: [],
      minBeds: 0,
      minBaths: 0,
      minSquareFeet: 0,
      maxSquareFeet: 10000,
      schoolDistricts: [],
      neighborhoods: [],
      commuteTime: 0,
      maxCommuteTime: 60,
      propertyAge: { min: 0, max: 100 },
      features: []
    };
    setLocalFilters(resetFilters);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Advanced Search</h2>
          <Button variant="ghost" onClick={onClose} className="p-2">
            <ApperIcon name="X" className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* School Districts */}
            <Card className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <ApperIcon name="GraduationCap" className="h-5 w-5 mr-2" />
                School Districts
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {schoolDistrictOptions.map(district => (
                  <label key={district} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={(localFilters.schoolDistricts || []).includes(district)}
                      onChange={(e) => handleArrayFilterChange('schoolDistricts', district, e.target.checked)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{district}</span>
                  </label>
                ))}
              </div>
            </Card>

            {/* Neighborhoods */}
            <Card className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <ApperIcon name="MapPin" className="h-5 w-5 mr-2" />
                Neighborhoods
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {neighborhoodOptions.map(neighborhood => (
                  <label key={neighborhood} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={(localFilters.neighborhoods || []).includes(neighborhood)}
                      onChange={(e) => handleArrayFilterChange('neighborhoods', neighborhood, e.target.checked)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{neighborhood}</span>
                  </label>
                ))}
              </div>
            </Card>

            {/* Commute Time */}
            <Card className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <ApperIcon name="Clock" className="h-5 w-5 mr-2" />
                Max Commute Time
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum commute time: {localFilters.maxCommuteTime || 60} minutes
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="60"
                    step="5"
                    value={localFilters.maxCommuteTime || 60}
                    onChange={(e) => handleLocalFilterChange('maxCommuteTime', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0 min</span>
                    <span>30 min</span>
                    <span>60+ min</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Property Age */}
            <Card className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <ApperIcon name="Calendar" className="h-5 w-5 mr-2" />
                Property Age
              </h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Min Age (years)
                    </label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={localFilters.propertyAge?.min || 0}
                      onChange={(e) => handleLocalFilterChange('propertyAge', {
                        ...localFilters.propertyAge,
                        min: parseInt(e.target.value) || 0
                      })}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Age (years)
                    </label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={localFilters.propertyAge?.max || 100}
                      onChange={(e) => handleLocalFilterChange('propertyAge', {
                        ...localFilters.propertyAge,
                        max: parseInt(e.target.value) || 100
                      })}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  {['New (0-5)', 'Modern (6-15)', 'Established (16-30)', 'Mature (31+)'].map((ageRange, index) => (
                    <Button
                      key={ageRange}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const ranges = [[0, 5], [6, 15], [16, 30], [31, 100]];
                        handleLocalFilterChange('propertyAge', {
                          min: ranges[index][0],
                          max: ranges[index][1]
                        });
                      }}
                    >
                      {ageRange}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Features */}
          <Card className="p-4 mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ApperIcon name="Star" className="h-5 w-5 mr-2" />
              Property Features
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {featureOptions.map(feature => (
                <label key={feature} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(localFilters.features || []).includes(feature)}
                    onChange={(e) => handleArrayFilterChange('features', feature, e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{feature}</span>
                </label>
              ))}
            </div>
          </Card>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <Button variant="ghost" onClick={handleReset}>
            Reset All Filters
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleApply}>
              Apply Filters
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdvancedSearchModal;