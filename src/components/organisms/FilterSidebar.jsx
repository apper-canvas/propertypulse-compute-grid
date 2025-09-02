import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import PriceRange from "@/components/molecules/PriceRange";
import PropertyTypeFilter from "@/components/molecules/PropertyTypeFilter";
import BedroomBathroomFilter from "@/components/molecules/BedroomBathroomFilter";
import SquareFootageFilter from "@/components/molecules/SquareFootageFilter";

const FilterSidebar = ({ 
  filters, 
  onFilterChange, 
  onClearFilters, 
  hasActiveFilters,
  isOpen,
  onClose 
}) => {
  const sidebarContent = (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-primary-600 hover:text-primary-700"
            >
              Clear All
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="lg:hidden p-1"
          >
            <ApperIcon name="X" className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Filters Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-8">
          {/* Price Range */}
          <div>
            <PriceRange
              min={0}
              max={5000000}
              minValue={filters.minPrice}
              maxValue={filters.maxPrice}
              onChange={(min, max) => {
                onFilterChange("minPrice", min);
                onFilterChange("maxPrice", max);
              }}
            />
          </div>

          {/* Property Type */}
          <div>
            <PropertyTypeFilter
              selectedTypes={filters.propertyTypes}
              onChange={(types) => onFilterChange("propertyTypes", types)}
            />
          </div>

          {/* Bedrooms & Bathrooms */}
          <div>
            <BedroomBathroomFilter
              bedrooms={filters.minBeds}
              bathrooms={filters.minBaths}
              onBedroomsChange={(beds) => onFilterChange("minBeds", beds)}
              onBathroomsChange={(baths) => onFilterChange("minBaths", baths)}
            />
          </div>

          {/* Square Footage */}
          <div>
            <SquareFootageFilter
              min={0}
              max={10000}
              minValue={filters.minSquareFeet}
              maxValue={filters.maxSquareFeet}
              onChange={(min, max) => {
                onFilterChange("minSquareFeet", min);
                onFilterChange("maxSquareFeet", max);
              }}
            />
          </div>
        </div>
      </div>

      {/* Apply Filters Button (Mobile) */}
      <div className="lg:hidden p-6 border-t border-gray-200">
        <Button
          onClick={onClose}
          className="w-full"
          size="lg"
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );

  // Desktop Sidebar
  const desktopSidebar = (
    <div className="hidden lg:block w-80 bg-white border-r border-gray-200 h-full">
      {sidebarContent}
    </div>
  );

  // Mobile Sidebar Overlay
  const mobileSidebar = isOpen && (
    <>
      {/* Backdrop */}
      <div 
        className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="lg:hidden fixed left-0 top-0 bottom-0 w-80 z-50 shadow-xl"
      >
        {sidebarContent}
      </motion.div>
    </>
  );

  return (
    <>
      {desktopSidebar}
      {mobileSidebar}
    </>
  );
};

export default FilterSidebar;