import React from "react";
import { motion } from "framer-motion";
import PropertyCard from "@/components/molecules/PropertyCard";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const PropertyGrid = ({ 
  properties, 
  loading, 
  error, 
  onRetry, 
  onToggleFilters,
  hasActiveFilters,
  activeFiltersCount 
}) => {
  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={onRetry} />;
  if (!properties || properties.length === 0) {
    return <Empty />;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex-1">
      {/* Results Header */}
      <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleFilters}
            className="lg:hidden flex items-center gap-2"
          >
            <ApperIcon name="Filter" className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <span className="bg-primary-500 text-white text-xs rounded-full px-2 py-0.5 ml-1">
                {activeFiltersCount}
              </span>
            )}
          </Button>
          <div className="text-sm text-gray-600">
            <span className="font-medium">{properties.length}</span> properties found
          </div>
        </div>
        
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest</option>
            <option>Square Feet</option>
          </select>
        </div>
      </div>

      {/* Property Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
      >
        {properties.map((property) => (
          <motion.div key={property.Id} variants={itemVariants}>
            <PropertyCard property={property} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default PropertyGrid;