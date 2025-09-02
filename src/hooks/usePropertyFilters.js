import { useState, useMemo } from "react";

export const usePropertyFilters = (properties) => {
  const [filters, setFilters] = useState({
    query: "",
    minPrice: 0,
    maxPrice: 5000000,
    propertyTypes: [],
    minBeds: 0,
    minBaths: 0,
    minSquareFeet: 0,
    maxSquareFeet: 10000
  });

  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
      // Search query filter
      if (filters.query) {
        const query = filters.query.toLowerCase();
        const searchText = `${property.address} ${property.city} ${property.state} ${property.title} ${property.description}`.toLowerCase();
        if (!searchText.includes(query)) return false;
      }

      // Price filter
      if (property.price < filters.minPrice || property.price > filters.maxPrice) {
        return false;
      }

      // Property type filter
      if (filters.propertyTypes.length > 0 && !filters.propertyTypes.includes(property.propertyType)) {
        return false;
      }

      // Bedroom filter
      if (property.bedrooms < filters.minBeds) {
        return false;
      }

      // Bathroom filter
      if (property.bathrooms < filters.minBaths) {
        return false;
      }

      // Square footage filter
      if (property.squareFeet < filters.minSquareFeet || property.squareFeet > filters.maxSquareFeet) {
        return false;
      }

      return true;
    });
  }, [properties, filters]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      query: "",
      minPrice: 0,
      maxPrice: 5000000,
      propertyTypes: [],
      minBeds: 0,
      minBaths: 0,
      minSquareFeet: 0,
      maxSquareFeet: 10000
    });
  };

  return {
    filters,
    filteredProperties,
    updateFilter,
    clearFilters,
    hasActiveFilters: JSON.stringify(filters) !== JSON.stringify({
      query: "",
      minPrice: 0,
      maxPrice: 5000000,
      propertyTypes: [],
      minBeds: 0,
      minBaths: 0,
      minSquareFeet: 0,
      maxSquareFeet: 10000
    })
  };
};