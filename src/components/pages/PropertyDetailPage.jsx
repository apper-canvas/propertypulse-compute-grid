import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import propertyService from "@/services/api/propertyService";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { formatPrice, formatSquareFeet, formatAddress, formatPropertyType } from "@/utils/formatters";

const PropertyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const loadProperty = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await propertyService.getById(parseInt(id));
      setProperty(data);
    } catch (err) {
      setError("Failed to load property details");
      console.error("Error loading property:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperty();
  }, [id]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const nextImage = () => {
    if (property?.images) {
      setCurrentImageIndex((prev) => 
        prev === property.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (property?.images) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? property.images.length - 1 : prev - 1
      );
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadProperty} />;
  if (!property) return <Error message="Property not found" />;

  const getStatusBadge = (status) => {
    const variants = {
      active: "success",
      pending: "warning",
      sold: "error"
    };
    return variants[status] || "default";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="secondary"
            onClick={handleBackClick}
            className="flex items-center gap-2"
          >
            <ApperIcon name="ArrowLeft" className="h-4 w-4" />
            Back to Properties
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="relative aspect-[16/10]">
                <img
                  src={property.images[currentImageIndex]}
                  alt={`${property.title} - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Navigation Arrows */}
                {property.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 rounded-full p-2 shadow-lg transition-all"
                    >
                      <ApperIcon name="ChevronLeft" className="h-6 w-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 rounded-full p-2 shadow-lg transition-all"
                    >
                      <ApperIcon name="ChevronRight" className="h-6 w-6" />
                    </button>
                  </>
                )}

                {/* Image Indicators */}
                {property.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {property.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          index === currentImageIndex 
                            ? "bg-white" 
                            : "bg-white/50 hover:bg-white/75"
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                  <Badge variant={getStatusBadge(property.status)} className="capitalize text-sm">
                    {property.status}
                  </Badge>
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {property.images.length > 1 && (
                <div className="p-4 border-t border-gray-200">
                  <div className="grid grid-cols-6 gap-2">
                    {property.images.slice(0, 6).map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                          index === currentImageIndex 
                            ? "border-primary-500" 
                            : "border-transparent hover:border-gray-300"
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${property.title} thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Property Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm p-8"
            >
              <div className="space-y-6">
                {/* Header */}
                <div>
                  <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">
                    {property.title}
                  </h1>
                  <p className="text-lg text-gray-600">
                    {formatAddress(property.address, property.city, property.state)}
                  </p>
                  <p className="text-gray-500">
                    {property.zipCode}
                  </p>
                </div>

                {/* Key Stats */}
                <div className="flex items-center gap-8 py-6 border-y border-gray-200">
                  <div className="flex items-center gap-2 text-gray-600">
                    <ApperIcon name="Bed" className="h-5 w-5" />
                    <span className="font-medium">{property.bedrooms}</span>
                    <span>Bedrooms</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <ApperIcon name="Bath" className="h-5 w-5" />
                    <span className="font-medium">{property.bathrooms}</span>
                    <span>Bathrooms</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <ApperIcon name="Square" className="h-5 w-5" />
                    <span className="font-medium">{formatSquareFeet(property.squareFeet)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <ApperIcon name="Home" className="h-5 w-5" />
                    <span className="font-medium">{formatPropertyType(property.propertyType)}</span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
                  <p className="text-gray-700 leading-relaxed">
                    {property.description}
                  </p>
                </div>

                {/* Features */}
                {property.features && property.features.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Features</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {property.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-gray-700">
                          <ApperIcon name="Check" className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="sticky top-8 space-y-6"
            >
              {/* Price Card */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="text-center mb-6">
                  <div className="font-display text-3xl font-bold text-primary-700 mb-2">
                    {formatPrice(property.price)}
                  </div>
                  <Badge variant="primary" className="text-sm">
                    {formatPropertyType(property.propertyType)}
                  </Badge>
                </div>

                <div className="space-y-4">
                  <Button className="w-full" size="lg">
                    <ApperIcon name="Heart" className="h-5 w-5 mr-2" />
                    Save Property
                  </Button>
                  <Button variant="secondary" className="w-full" size="lg">
                    <ApperIcon name="Phone" className="h-5 w-5 mr-2" />
                    Contact Agent
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    <ApperIcon name="Share" className="h-5 w-5 mr-2" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Quick Info */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Property Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Property ID:</span>
                    <span className="font-medium">#{property.Id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Listing Date:</span>
                    <span className="font-medium">
                      {new Date(property.listingDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <Badge variant={getStatusBadge(property.status)} className="capitalize">
                      {property.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;