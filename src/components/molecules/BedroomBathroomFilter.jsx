import React from "react";
import Label from "@/components/atoms/Label";
import Select from "@/components/atoms/Select";

const BedroomBathroomFilter = ({ bedrooms, bathrooms, onBedroomsChange, onBathroomsChange }) => {
  const bedroomOptions = [
    { value: 0, label: "Any" },
    { value: 1, label: "1+" },
    { value: 2, label: "2+" },
    { value: 3, label: "3+" },
    { value: 4, label: "4+" },
    { value: 5, label: "5+" }
  ];

  const bathroomOptions = [
    { value: 0, label: "Any" },
    { value: 1, label: "1+" },
    { value: 1.5, label: "1.5+" },
    { value: 2, label: "2+" },
    { value: 2.5, label: "2.5+" },
    { value: 3, label: "3+" },
    { value: 4, label: "4+" }
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label>Bedrooms</Label>
        <Select
          value={bedrooms}
          onChange={(e) => onBedroomsChange(Number(e.target.value))}
          className="h-10"
        >
          {bedroomOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>
      
      <div>
        <Label>Bathrooms</Label>
        <Select
          value={bathrooms}
          onChange={(e) => onBathroomsChange(Number(e.target.value))}
          className="h-10"
        >
          {bathroomOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
};

export default BedroomBathroomFilter;