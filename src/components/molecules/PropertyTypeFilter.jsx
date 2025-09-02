import React from "react";
import Label from "@/components/atoms/Label";
import Badge from "@/components/atoms/Badge";

const PropertyTypeFilter = ({ selectedTypes, onChange }) => {
  const propertyTypes = [
    { value: "house", label: "House" },
    { value: "condo", label: "Condo" },
    { value: "townhome", label: "Townhome" },
    { value: "apartment", label: "Apartment" },
    { value: "single-family", label: "Single Family" },
    { value: "multi-family", label: "Multi Family" }
  ];

  const toggleType = (type) => {
    if (selectedTypes.includes(type)) {
      onChange(selectedTypes.filter(t => t !== type));
    } else {
      onChange([...selectedTypes, type]);
    }
  };

  return (
    <div className="space-y-3">
      <Label>Property Type</Label>
      <div className="space-y-2">
        {propertyTypes.map(type => (
          <label
            key={type.value}
            className="flex items-center cursor-pointer group"
          >
            <input
              type="checkbox"
              checked={selectedTypes.includes(type.value)}
              onChange={() => toggleType(type.value)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 focus:ring-offset-0 mr-3"
            />
            <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
              {type.label}
            </span>
          </label>
        ))}
      </div>

      {selectedTypes.length > 0 && (
        <div className="pt-2">
          <div className="flex flex-wrap gap-2">
            {selectedTypes.map(type => (
              <Badge
                key={type}
                variant="primary"
                className="cursor-pointer hover:bg-primary-200 transition-colors"
                onClick={() => toggleType(type)}
              >
                {propertyTypes.find(pt => pt.value === type)?.label}
                <span className="ml-1">×</span>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyTypeFilter;