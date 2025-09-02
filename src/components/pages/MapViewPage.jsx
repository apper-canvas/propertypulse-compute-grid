import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import propertyService from "@/services/api/propertyService";
import { usePropertyFilters } from "@/hooks/usePropertyFilters";
import { formatPrice, formatPropertyType } from "@/utils/formatters";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icon with price label
const createCustomMarker = (property) => {
  return L.divIcon({
    html: `<div class="custom-marker">${formatPrice(property.price)}</div>`,
    className: 'custom-marker-container',
    iconSize: [80, 30],
    iconAnchor: [40, 30]
  });
};

// Generate coordinates for demo purposes (in real app, these would come from property data)
const generateCoordinates = (property) => {
  const cityCoords = {
    'Los Angeles': [34.0522, -118.2437],
    'San Francisco': [37.7749, -122.4194],
    'Malibu': [34.0259, -118.7798],
    'Palo Alto': [37.4419, -122.1430],
    'Brooklyn': [40.6782, -73.9442],
    'Austin': [30.2672, -97.7431],
    'Denver': [39.7392, -104.9903],
    'Seattle': [47.6062, -122.3321],
    'Savannah': [32.0835, -81.0998],
    'Miami': [25.7617, -80.1918],
    'Nashville': [36.1627, -86.7816],
    'Chicago': [41.8781, -87.6298],
    'Portland': [45.5152, -122.6784],
    'San Diego': [32.7157, -117.1611],
    'Phoenix': [33.4484, -112.0740],
    'Aspen': [39.1911, -106.8175]
  };
  
  const baseCoords = cityCoords[property.city] || [39.8283, -98.5795]; // Default to center of US
  // Add small random offset to avoid overlapping markers
  const latOffset = (Math.random() - 0.5) * 0.02;
  const lngOffset = (Math.random() - 0.5) * 0.02;
  
  return [baseCoords[0] + latOffset, baseCoords[1] + lngOffset];
};

const MapViewPage = ({ searchQuery = "", onSearch }) => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Apply filters to properties
  const { filteredProperties } = usePropertyFilters(properties);

  // Load properties
  useEffect(() => {
    const loadProperties = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await propertyService.getAll();
        setProperties(data);
      } catch (err) {
        setError(err.message || "Failed to load properties");
        console.error("Error loading properties:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, []);

  // Prepare properties with coordinates
  const propertiesWithCoords = useMemo(() => {
    return filteredProperties.map(property => ({
      ...property,
      coordinates: generateCoordinates(property)
    }));
  }, [filteredProperties]);

  const handlePropertyClick = (propertyId) => {
    navigate(`/property/${propertyId}`);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <div className="map-container">
      <MapContainer
        center={[39.8283, -98.5795]} // Center of United States
        zoom={4}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={(cluster) => {
            const count = cluster.getChildCount();
            let className = 'cluster-marker ';
            
            if (count < 10) {
              className += 'small';
            } else if (count < 50) {
              className += 'medium';
            } else {
              className += 'large';
            }

            return L.divIcon({
              html: `<div class="${className}">${count}</div>`,
              className: 'cluster-marker-container',
              iconSize: [40, 40]
            });
          }}
        >
          {propertiesWithCoords.map((property) => (
            <Marker
              key={property.Id}
              position={property.coordinates}
              icon={createCustomMarker(property)}
            >
              <Popup>
                <div className="w-full max-w-sm">
                  {/* Property Image */}
                  <div className="relative h-40 w-full mb-3">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute top-2 right-2">
                      <span className="bg-primary-600 text-white px-2 py-1 rounded-md text-xs font-medium">
                        {formatPropertyType(property.propertyType)}
                      </span>
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="px-3 pb-3">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">
                      {formatPrice(property.price)}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {property.address}
                    </p>
                    <p className="text-sm text-gray-500 mb-3">
                      {property.city}, {property.state} {property.zipCode}
                    </p>

                    {/* Property Stats */}
                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <ApperIcon name="Bed" className="h-4 w-4" />
                        <span>{property.bedrooms}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ApperIcon name="Bath" className="h-4 w-4" />
                        <span>{property.bathrooms}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ApperIcon name="Square" className="h-4 w-4" />
                        <span>{property.squareFeet?.toLocaleString()} sq ft</span>
                      </div>
                    </div>

                    {/* View Details Button */}
                    <button
                      onClick={() => handlePropertyClick(property.Id)}
                      className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <span>View Details</span>
                      <ApperIcon name="ArrowRight" className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
};

export default MapViewPage;