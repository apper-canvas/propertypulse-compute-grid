import React from "react";
import Label from "@/components/atoms/Label";
import { formatPrice } from "@/utils/formatters";

const PriceRange = ({ min, max, minValue, maxValue, onChange }) => {
  const handleMinChange = (e) => {
    const value = parseInt(e.target.value);
    onChange(value, maxValue);
  };

  const handleMaxChange = (e) => {
    const value = parseInt(e.target.value);
    onChange(minValue, value);
  };

  return (
    <div className="space-y-4">
      <Label>Price Range</Label>
      
      <div className="px-3">
        {/* Min Price Slider */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Min: {formatPrice(minValue)}</span>
          </div>
          <input
            type="range"
            min={min}
            max={max}
            value={minValue}
            onChange={handleMinChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb-primary"
          />
        </div>

        {/* Max Price Slider */}
        <div className="mb-2">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Max: {formatPrice(maxValue)}</span>
          </div>
          <input
            type="range"
            min={min}
            max={max}
            value={maxValue}
            onChange={handleMaxChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb-primary"
          />
        </div>
      </div>

      {/* Price Range Display */}
      <div className="bg-gray-50 p-3 rounded-lg">
        <div className="text-sm text-gray-600 text-center">
          {formatPrice(minValue)} - {formatPrice(maxValue)}
        </div>
      </div>
    </div>
  );
};

export default PriceRange;