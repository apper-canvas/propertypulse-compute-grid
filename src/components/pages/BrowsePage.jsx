import React, { useState, useEffect } from "react";
import { usePropertyFilters } from "@/hooks/usePropertyFilters";
import { usePagination } from "@/hooks/usePagination";
import propertyService from "@/services/api/propertyService";
import FilterSidebar from "@/components/organisms/FilterSidebar";
import PropertyGrid from "@/components/organisms/PropertyGrid";
import Pagination from "@/components/molecules/Pagination";

const BrowsePage = ({ searchQuery, onSearch }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);

  // Property filtering
  const { 
    filters, 
    filteredProperties, 
    updateFilter, 
    clearFilters, 
    hasActiveFilters 
  } = usePropertyFilters(properties);

  // Pagination
  const {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    resetPage,
    hasNextPage,
    hasPreviousPage
  } = usePagination(filteredProperties, 12);

  // Load properties
  const loadProperties = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await propertyService.getAll();
      setProperties(data);
    } catch (err) {
      setError("Failed to load properties");
      console.error("Error loading properties:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  // Handle search from header
  useEffect(() => {
    if (searchQuery !== undefined) {
      updateFilter("query", searchQuery);
      resetPage();
    }
  }, [searchQuery, updateFilter, resetPage]);

  // Reset pagination when filters change
  useEffect(() => {
    resetPage();
  }, [filters, resetPage]);

  const handleFilterChange = (key, value) => {
    updateFilter(key, value);
  };

  const handleClearFilters = () => {
    clearFilters();
    if (onSearch) onSearch("");
  };

  const toggleFilterSidebar = () => {
    setIsFilterSidebarOpen(!isFilterSidebarOpen);
  };

  const activeFiltersCount = Object.values(filters).reduce((count, value) => {
    if (Array.isArray(value)) {
      return count + (value.length > 0 ? 1 : 0);
    }
    if (typeof value === "string") {
      return count + (value.trim() !== "" ? 1 : 0);
    }
    if (typeof value === "number") {
      const isDefaultValue = 
        (value === 0 && (filters.minPrice === 0 || filters.minBeds === 0 || filters.minBaths === 0 || filters.minSquareFeet === 0)) ||
        (value === 5000000 && filters.maxPrice === 5000000) ||
        (value === 10000 && filters.maxSquareFeet === 10000);
      return count + (isDefaultValue ? 0 : 1);
    }
    return count;
  }, 0);

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Filter Sidebar */}
      <FilterSidebar
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
        isOpen={isFilterSidebarOpen}
        onClose={() => setIsFilterSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6">
          <PropertyGrid
            properties={paginatedItems}
            loading={loading}
            error={error}
            onRetry={loadProperties}
            onToggleFilters={toggleFilterSidebar}
            hasActiveFilters={hasActiveFilters}
            activeFiltersCount={activeFiltersCount}
          />

          {/* Pagination */}
          {!loading && !error && filteredProperties.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
              hasNextPage={hasNextPage}
              hasPreviousPage={hasPreviousPage}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowsePage;