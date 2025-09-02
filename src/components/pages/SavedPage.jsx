import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import savedPropertiesService from "@/services/api/savedPropertiesService";
import { formatPrice, formatPropertyType, formatSquareFeet } from "@/utils/formatters";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const SavedPage = () => {
  const navigate = useNavigate();
  const [savedProperties, setSavedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('savedAt');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingNotes, setEditingNotes] = useState(null);
  const [tempNotes, setTempNotes] = useState('');

  useEffect(() => {
    loadSavedProperties();
  }, []);

  const loadSavedProperties = async () => {
    setLoading(true);
    try {
      const saved = await savedPropertiesService.getAll();
      setSavedProperties(saved);
    } catch (error) {
      console.error('Error loading saved properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveProperty = async (propertyId) => {
    if (window.confirm('Remove this property from your saved list?')) {
      const result = await savedPropertiesService.remove(propertyId);
      if (result.success) {
        setSavedProperties(prev => prev.filter(item => item.propertyId !== propertyId));
      }
    }
  };

  const handleUpdateNotes = async (propertyId) => {
    const result = await savedPropertiesService.updateNotes(propertyId, tempNotes);
    if (result.success) {
      setSavedProperties(prev => prev.map(item => 
        item.propertyId === propertyId 
          ? { ...item, notes: tempNotes }
          : item
      ));
      setEditingNotes(null);
      setTempNotes('');
    }
  };

  const startEditingNotes = (propertyId, currentNotes) => {
    setEditingNotes(propertyId);
    setTempNotes(currentNotes || '');
  };

  const cancelEditingNotes = () => {
    setEditingNotes(null);
    setTempNotes('');
  };

  const sortedAndFilteredProperties = savedProperties
    .filter(item => {
      if (!searchQuery) return true;
      const property = item.property;
      const searchText = `${property.title} ${property.address} ${property.city}`.toLowerCase();
      return searchText.includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'savedAt':
          return new Date(b.savedAt) - new Date(a.savedAt);
        case 'price':
          return a.property.price - b.property.price;
        case 'priceDesc':
          return b.property.price - a.property.price;
        case 'propertyType':
          return a.property.propertyType.localeCompare(b.property.propertyType);
        default:
          return 0;
      }
    });

  if (loading) {
    return <Loading />;
  }

  if (savedProperties.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ApperIcon name="Heart" className="h-10 w-10 text-red-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            No Saved Properties
          </h1>
          
          <p className="text-gray-600 mb-6">
            Start building your collection by saving properties you're interested in. Click the heart icon on any property to add it here.
          </p>
          
          <Button 
            onClick={() => navigate("/browse")}
            className="flex items-center gap-2"
          >
            <ApperIcon name="Search" className="h-4 w-4" />
            Browse Properties
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Heart" className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Saved Properties
              </h1>
              <p className="text-gray-600">
                {savedProperties.length} {savedProperties.length === 1 ? 'property' : 'properties'} in your collection
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search saved properties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="savedAt">Date Saved</option>
                <option value="price">Price (Low to High)</option>
                <option value="priceDesc">Price (High to Low)</option>
                <option value="propertyType">Property Type</option>
              </select>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {sortedAndFilteredProperties.map((item) => (
              <motion.div
                key={item.propertyId}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  {/* Property Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={item.property.images[0]}
                      alt={item.property.title}
                      className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                      onClick={() => navigate(`/property/${item.property.Id}`)}
                    />
                    <div className="absolute top-4 right-4">
                      <button
                        onClick={() => handleRemoveProperty(item.propertyId)}
                        className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors duration-200"
                        title="Remove from saved"
                      >
                        <ApperIcon name="X" className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="absolute top-4 left-4">
                      <Badge variant="success" className="bg-white/90 text-gray-900">
                        {formatPropertyType(item.property.propertyType)}
                      </Badge>
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="p-6">
                    <div className="mb-3">
                      <h3 
                        className="font-display text-xl font-bold text-primary-700 mb-1 cursor-pointer hover:text-primary-800 transition-colors"
                        onClick={() => navigate(`/property/${item.property.Id}`)}
                      >
                        {formatPrice(item.property.price)}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-1">
                        {item.property.address}
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.property.city}, {item.property.state} {item.property.zipCode}
                      </p>
                    </div>

                    {/* Property Features */}
                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <ApperIcon name="Bed" className="h-4 w-4" />
                        <span>{item.property.bedrooms} bed</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ApperIcon name="Bath" className="h-4 w-4" />
                        <span>{item.property.bathrooms} bath</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ApperIcon name="Square" className="h-4 w-4" />
                        <span>{formatSquareFeet(item.property.squareFeet)}</span>
                      </div>
                    </div>

                    {/* Saved Date */}
                    <div className="flex items-center gap-2 mb-4 text-xs text-gray-500">
                      <ApperIcon name="Calendar" className="h-3 w-3" />
                      <span>Saved {new Date(item.savedAt).toLocaleDateString()}</span>
                    </div>

                    {/* Notes Section */}
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Personal Notes</span>
                        {editingNotes !== item.propertyId && (
                          <button
                            onClick={() => startEditingNotes(item.propertyId, item.notes)}
                            className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1"
                          >
                            <ApperIcon name="Edit" className="h-3 w-3" />
                            Edit
                          </button>
                        )}
                      </div>

                      {editingNotes === item.propertyId ? (
                        <div className="space-y-2">
                          <textarea
                            value={tempNotes}
                            onChange={(e) => setTempNotes(e.target.value)}
                            placeholder="Add your personal notes about this property..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                            rows="3"
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleUpdateNotes(item.propertyId)}
                            >
                              Save
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={cancelEditingNotes}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-600 min-h-[1.5rem]">
                          {item.notes || (
                            <span className="italic text-gray-400">
                              No notes added yet
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* No Search Results */}
        {sortedAndFilteredProperties.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <ApperIcon name="Search" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600">
              No saved properties match your search for "{searchQuery}"
            </p>
            <Button
              variant="ghost"
              onClick={() => setSearchQuery('')}
              className="mt-4"
            >
              Clear search
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedPage;