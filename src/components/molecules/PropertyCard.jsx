import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { formatPrice, formatBedBath, formatSquareFeet, formatPropertyType } from "@/utils/formatters";
import savedPropertiesService from "@/services/api/savedPropertiesService";

const PropertyCard = ({ property }) => {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const checkSavedStatus = async () => {
      const saved = await savedPropertiesService.isSaved(property.Id);
      setIsSaved(saved);
    };
    checkSavedStatus();
  }, [property.Id]);

  const handleToggleSave = async (e) => {
    e.stopPropagation(); // Prevent card click navigation
    const result = await savedPropertiesService.toggle(property.Id);
    if (result.success) {
      setIsSaved(!isSaved);
    }
  };

  const handleCardClick = () => {
    navigate(`/property/${property.Id}`);
  };

  const getStatusBadge = (status) => {
    const variants = {
      active: "success",
      pending: "warning",
      sold: "error"
    };
    return variants[status] || "default";
  };

  return (
    <Card 
      className="property-card cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden group"
      onClick={handleCardClick}
    >
      {/* Property Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
{/* Status Badge */}
        <div className="absolute top-4 left-4">
          <Badge variant={getStatusBadge(property.status)} className="capitalize">
            {property.status}
          </Badge>
        </div>

        {/* Save Heart Icon */}
        <button
          onClick={handleToggleSave}
          className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white rounded-full shadow-sm transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          aria-label={isSaved ? "Remove from saved" : "Save property"}
        >
          <ApperIcon 
            name="Heart" 
            className={`h-5 w-5 transition-colors duration-200 ${
              isSaved 
                ? "text-red-500 fill-current" 
                : "text-gray-600 hover:text-red-500"
            }`}
          />
        </button>

        {/* Property Type Badge */}
        <div className="absolute top-16 right-4">
          <Badge variant="primary" className="bg-white/90 text-gray-900">
            {formatPropertyType(property.propertyType)}
          </Badge>
        </div>
      </div>

      {/* Property Details */}
      <div className="p-6">
        {/* Price */}
        <div className="mb-3">
          <h3 className="font-display text-2xl font-bold text-primary-700 mb-1">
            {formatPrice(property.price)}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-1">
            {property.address}
          </p>
          <p className="text-sm text-gray-500">
            {property.city}, {property.state} {property.zipCode}
          </p>
        </div>

        {/* Property Features */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <ApperIcon name="Bed" className="h-4 w-4" />
            <span>{property.bedrooms} bed</span>
          </div>
          <div className="flex items-center gap-1">
            <ApperIcon name="Bath" className="h-4 w-4" />
            <span>{property.bathrooms} bath</span>
          </div>
          <div className="flex items-center gap-1">
            <ApperIcon name="Square" className="h-4 w-4" />
            <span>{formatSquareFeet(property.squareFeet)}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
          {property.description}
        </p>

        {/* Features Tags */}
        {property.features && property.features.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {property.features.slice(0, 3).map((feature, index) => (
              <Badge key={index} variant="default" className="text-xs">
                {feature}
              </Badge>
            ))}
            {property.features.length > 3 && (
              <Badge variant="default" className="text-xs">
                +{property.features.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Hover Action */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 px-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <div className="flex items-center justify-between">
          <span className="font-medium">View Details</span>
          <ApperIcon name="ArrowRight" className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
};

export default PropertyCard;