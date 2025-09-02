import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import savedPropertiesService from "@/services/api/savedPropertiesService";
import { formatAddress, formatPrice, formatPropertyType, formatSquareFeet } from "@/utils/formatters";
import propertyService from "@/services/api/propertyService";
import ApperIcon from "@/components/ApperIcon";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

const PropertyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const checkSavedStatus = async () => {
      if (id) {
        const saved = await savedPropertiesService.isSaved(id);
        setIsSaved(saved);
      }
    };
    checkSavedStatus();
  }, [id]);

  const handleToggleSave = async () => {
    const result = await savedPropertiesService.toggle(id);
    if (result.success) {
      setIsSaved(!isSaved);
    }
};

  const loadProperty = async () => {
    try {
      setLoading(true);
      setError("");
      const propertyData = await propertyService.getById(parseInt(id));
      setProperty(propertyData);
    } catch (err) {
      setError(err.message || "Property not found");
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
    if (property && property.images) {
      setCurrentImageIndex((prev) => 
        prev === property.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (property && property.images) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? property.images.length - 1 : prev - 1
      );
    }
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  const getStatusBadge = (status) => {
    const variants = {
      active: "success",
      pending: "warning", 
      sold: "error"
    };
    return variants[status] || "default";
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadProperty} />;
  if (!property) return <Error message="Property not found" />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button
            variant="ghost"
            onClick={handleBackClick}
            className="flex items-center gap-2 hover:bg-gray-100"
          >
            <ApperIcon name="ArrowLeft" className="h-5 w-5" />
            <span>Back to Properties</span>
          </Button>
        </div>
      </div>

      {/* Hero Section - Photo Carousel */}
      <section className="relative h-[60vh] lg:h-[70vh] bg-black">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImageIndex}
            src={property.images[currentImageIndex]}
            alt={`${property.title} - Image ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        </AnimatePresence>

        {/* Navigation Arrows */}
        {property.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110"
            >
              <ApperIcon name="ChevronLeft" className="h-6 w-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110"
            >
              <ApperIcon name="ChevronRight" className="h-6 w-6" />
            </button>
          </>
        )}

        {/* Image Counter */}
        <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {currentImageIndex + 1} / {property.images.length}
        </div>

        {/* Property Status Badge */}
        <div className="absolute top-4 left-4">
          <Badge variant={getStatusBadge(property.status)} className="capitalize">
            {property.status}
          </Badge>
        </div>

        {/* Image Thumbnails */}
        {property.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 rounded-lg p-2">
            {property.images.map((image, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`w-16 h-12 rounded overflow-hidden border-2 transition-all duration-200 ${
                  index === currentImageIndex 
                    ? 'border-white' 
                    : 'border-transparent hover:border-white/50'
                }`}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Main Content */}
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Details - Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm p-8"
            >
              <div className="space-y-6">
                {/* Header */}
                <div>
                  <h1 className="font-display text-4xl font-bold text-gray-900 mb-3">
                    {property.title}
                  </h1>
                  <p className="text-xl text-gray-600 mb-2">
                    {formatAddress(property.address, property.city, property.state)}
                  </p>
                  <p className="text-lg text-gray-500">
                    {property.zipCode}
                  </p>
                </div>

                {/* Price */}
                <div className="py-4">
                  <div className="font-display text-4xl font-bold text-primary-700 mb-2">
                    {formatPrice(property.price)}
                  </div>
                  <Badge variant="primary" className="text-sm">
                    {formatPropertyType(property.propertyType)}
                  </Badge>
                </div>

                {/* Key Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-gray-200">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-600 mb-1">
                      <ApperIcon name="Bed" className="h-5 w-5" />
                    </div>
                    <div className="font-bold text-2xl text-gray-900">{property.bedrooms}</div>
                    <div className="text-sm text-gray-600">Bedrooms</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-600 mb-1">
                      <ApperIcon name="Bath" className="h-5 w-5" />
                    </div>
                    <div className="font-bold text-2xl text-gray-900">{property.bathrooms}</div>
                    <div className="text-sm text-gray-600">Bathrooms</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-600 mb-1">
                      <ApperIcon name="Square" className="h-5 w-5" />
                    </div>
                    <div className="font-bold text-2xl text-gray-900">{formatSquareFeet(property.squareFeet)}</div>
                    <div className="text-sm text-gray-600">Sq Ft</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-600 mb-1">
                      <ApperIcon name="Home" className="h-5 w-5" />
                    </div>
                    <div className="font-bold text-lg text-gray-900">{formatPropertyType(property.propertyType)}</div>
                    <div className="text-sm text-gray-600">Type</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm p-8"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">About This Property</h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {property.description}
              </p>
            </motion.div>

            {/* Features & Amenities */}
            {property.features && property.features.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl shadow-sm p-8"
              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Features & Amenities</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {property.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 text-gray-700 py-2">
                      <div className="bg-green-100 rounded-full p-1">
                        <ApperIcon name="Check" className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="text-base">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Property Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-sm p-8"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Property Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Property ID</span>
                    <span className="font-medium">#{property.id}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Property Type</span>
                    <span className="font-medium">{formatPropertyType(property.propertyType)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Bedrooms</span>
                    <span className="font-medium">{property.bedrooms}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Bathrooms</span>
                    <span className="font-medium">{property.bathrooms}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Square Feet</span>
                    <span className="font-medium">{formatSquareFeet(property.squareFeet)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Listing Date</span>
                    <span className="font-medium">
                      {new Date(property.listingDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Status</span>
                    <Badge variant={getStatusBadge(property.status)} className="capitalize">
                      {property.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Year Built</span>
                    <span className="font-medium">2020</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar - Right Column */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="sticky top-8 space-y-6"
            >
              {/* Agent Card */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Listing Agent</h3>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <ApperIcon name="User" className="h-8 w-8 text-gray-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Sarah Johnson</h4>
                    <p className="text-sm text-gray-600">Licensed Real Estate Agent</p>
                    <p className="text-sm text-gray-500">Premium Properties Group</p>
                  </div>
                </div>
                <div className="space-y-3 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <ApperIcon name="Phone" className="h-4 w-4" />
                    <span>(555) 123-4567</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <ApperIcon name="Mail" className="h-4 w-4" />
                    <span>sarah.johnson@premium.com</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <ApperIcon name="Star" className="h-4 w-4" />
                    <span>4.9 Rating • 127 Reviews</span>
                  </div>
                </div>
<Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => navigate(`/agents/1?propertyId=${property.Id}`)}
                >
                  <ApperIcon name="Phone" className="h-5 w-5 mr-2" />
                  Contact Agent
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="bg-white rounded-xl shadow-sm p-6">
<div className="space-y-3">
                  <Button 
                    variant="secondary" 
                    className="w-full" 
                    size="lg"
                    onClick={handleToggleSave}
                  >
                    <ApperIcon 
                      name="Heart" 
                      className={`h-5 w-5 mr-2 transition-colors duration-200 ${
                        isSaved 
                          ? "text-red-500 fill-current" 
                          : "text-gray-600"
                      }`}
                    />
                    {isSaved ? "Remove from Saved" : "Save Property"}
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    <ApperIcon name="Share" className="h-5 w-5 mr-2" />
                    Share Property
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    <ApperIcon name="Calculator" className="h-5 w-5 mr-2" />
                    Mortgage Calculator
                  </Button>
                </div>
              </div>

              {/* Quick Facts */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Quick Facts</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price per Sq Ft:</span>
                    <span className="font-medium">
                      ${Math.round(property.price / property.squareFeet).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lot Size:</span>
                    <span className="font-medium">0.25 acres</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Year Built:</span>
                    <span className="font-medium">2020</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Property Type:</span>
                    <span className="font-medium">{formatPropertyType(property.propertyType)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Days on Market:</span>
                    <span className="font-medium">
                      {Math.floor((new Date() - new Date(property.listingDate)) / (1000 * 60 * 60 * 24))} days
                    </span>
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