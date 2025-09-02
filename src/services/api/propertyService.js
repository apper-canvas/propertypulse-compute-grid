import { toast } from "react-toastify";

const propertyService = {
  // Simulate API delay for better UX
  delay: (ms = 300) => new Promise(resolve => setTimeout(resolve, ms)),

  // Get ApperClient instance
  getApperClient() {
    const { ApperClient } = window.ApperSDK;
    return new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  },

  // Transform database field names to frontend format
  transformFromDatabase(property) {
    return {
      Id: property.Id,
      title: property.title_c || '',
      price: property.price_c || 0,
      address: property.address_c || '',
      city: property.city_c || '',
      state: property.state_c || '',
      zipCode: property.zip_code_c || '',
      propertyType: property.property_type_c || '',
      bedrooms: property.bedrooms_c || 0,
      bathrooms: property.bathrooms_c || 0,
      squareFeet: property.square_feet_c || 0,
      description: property.description_c || '',
      images: property.images_c ? property.images_c.split(',') : [],
      features: property.features_c ? property.features_c.split(',') : [],
      listingDate: property.listing_date_c || new Date().toISOString(),
      status: property.status_c || 'active'
    };
  },

  // Transform frontend data to database format
  transformToDatabase(property) {
    const updateableFields = {
      title_c: property.title,
      price_c: property.price,
      address_c: property.address,
      city_c: property.city,
      state_c: property.state,
      zip_code_c: property.zipCode,
      property_type_c: property.propertyType,
      bedrooms_c: property.bedrooms,
      bathrooms_c: property.bathrooms,
      square_feet_c: property.squareFeet,
      description_c: property.description,
      images_c: Array.isArray(property.images) ? property.images.join(',') : property.images,
      features_c: Array.isArray(property.features) ? property.features.join(',') : property.features,
      listing_date_c: property.listingDate,
      status_c: property.status
    };

    // Remove undefined fields
    Object.keys(updateableFields).forEach(key => {
      if (updateableFields[key] === undefined) {
        delete updateableFields[key];
      }
    });

    return updateableFields;
  },

async getAll() {
    try {
      await this.delay();
      const apperClient = this.getApperClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "city_c"}},
          {"field": {"Name": "state_c"}},
          {"field": {"Name": "zip_code_c"}},
          {"field": {"Name": "property_type_c"}},
          {"field": {"Name": "bedrooms_c"}},
          {"field": {"Name": "bathrooms_c"}},
          {"field": {"Name": "square_feet_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "features_c"}},
          {"field": {"Name": "listing_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "neighborhood_c"}},
          {"field": {"Name": "school_district_c"}},
          {"field": {"Name": "year_built_c"}},
          {"field": {"Name": "commute_score_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await apperClient.fetchRecords('property_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(property => this.transformFromDatabase(property));
    } catch (error) {
      console.error("Error fetching properties:", error?.response?.data?.message || error);
      throw new Error("Failed to load properties");
    }
  },

  async getById(Id) {
    try {
      await this.delay();
      const apperClient = this.getApperClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "city_c"}},
          {"field": {"Name": "state_c"}},
          {"field": {"Name": "zip_code_c"}},
          {"field": {"Name": "property_type_c"}},
          {"field": {"Name": "bedrooms_c"}},
          {"field": {"Name": "bathrooms_c"}},
          {"field": {"Name": "square_feet_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "features_c"}},
          {"field": {"Name": "listing_date_c"}},
          {"field": {"Name": "status_c"}}
        ]
      };

      const response = await apperClient.getRecordById('property_c', Id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error("Property not found");
      }

      return this.transformFromDatabase(response.data);
    } catch (error) {
      console.error(`Error fetching property ${Id}:`, error?.response?.data?.message || error);
      throw new Error("Property not found");
    }
  },

  async create(propertyData) {
    try {
      await this.delay();
      const apperClient = this.getApperClient();
      
      const params = {
        records: [this.transformToDatabase(propertyData)]
      };

      const response = await apperClient.createRecord('property_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create property:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Property created successfully");
          return this.transformFromDatabase(successful[0].data);
        }
      }
      
      throw new Error("Failed to create property");
    } catch (error) {
      console.error("Error creating property:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(Id, propertyData) {
    try {
      await this.delay();
      const apperClient = this.getApperClient();
      
      const updateData = this.transformToDatabase(propertyData);
      updateData.Id = Id;
      
      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('property_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update property:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Property updated successfully");
          return this.transformFromDatabase(successful[0].data);
        }
      }
      
      throw new Error("Failed to update property");
    } catch (error) {
      console.error("Error updating property:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(Id) {
    try {
      await this.delay();
      const apperClient = this.getApperClient();
      
      const params = { 
        RecordIds: [Id]
      };

      const response = await apperClient.deleteRecord('property_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete property:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Property deleted successfully");
          return true;
        }
      }
      
      throw new Error("Failed to delete property");
    } catch (error) {
      console.error("Error deleting property:", error?.response?.data?.message || error);
      throw error;
    }
  },

  // Additional property-specific methods using ApperClient
  async getByPriceRange(minPrice, maxPrice) {
    try {
      await this.delay();
      const apperClient = this.getApperClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "city_c"}},
          {"field": {"Name": "state_c"}},
          {"field": {"Name": "zip_code_c"}},
          {"field": {"Name": "property_type_c"}},
          {"field": {"Name": "bedrooms_c"}},
          {"field": {"Name": "bathrooms_c"}},
          {"field": {"Name": "square_feet_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "features_c"}},
          {"field": {"Name": "listing_date_c"}},
          {"field": {"Name": "status_c"}}
        ],
        where: [
          {"FieldName": "price_c", "Operator": "GreaterThanOrEqualTo", "Values": [minPrice]},
          {"FieldName": "price_c", "Operator": "LessThanOrEqualTo", "Values": [maxPrice]}
        ]
      };

      const response = await apperClient.fetchRecords('property_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return (response.data || []).map(property => this.transformFromDatabase(property));
    } catch (error) {
      console.error("Error fetching properties by price range:", error?.response?.data?.message || error);
      throw new Error("Failed to load properties");
    }
  },

  async getByLocation(city, state) {
    try {
      await this.delay();
      const apperClient = this.getApperClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "city_c"}},
          {"field": {"Name": "state_c"}},
          {"field": {"Name": "zip_code_c"}},
          {"field": {"Name": "property_type_c"}},
          {"field": {"Name": "bedrooms_c"}},
          {"field": {"Name": "bathrooms_c"}},
          {"field": {"Name": "square_feet_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "features_c"}},
          {"field": {"Name": "listing_date_c"}},
          {"field": {"Name": "status_c"}}
        ],
        where: [
          {"FieldName": "city_c", "Operator": "ExactMatch", "Values": [city]},
          {"FieldName": "state_c", "Operator": "ExactMatch", "Values": [state]}
        ]
      };

      const response = await apperClient.fetchRecords('property_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return (response.data || []).map(property => this.transformFromDatabase(property));
    } catch (error) {
      console.error("Error fetching properties by location:", error?.response?.data?.message || error);
      throw new Error("Failed to load properties");
    }
  },
async searchProperties(query, advancedFilters = {}) {
    try {
      await this.delay();
      const apperClient = this.getApperClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "city_c"}},
          {"field": {"Name": "state_c"}},
          {"field": {"Name": "zip_code_c"}},
          {"field": {"Name": "property_type_c"}},
          {"field": {"Name": "bedrooms_c"}},
          {"field": {"Name": "bathrooms_c"}},
          {"field": {"Name": "square_feet_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "features_c"}},
          {"field": {"Name": "listing_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "neighborhood_c"}},
          {"field": {"Name": "school_district_c"}},
          {"field": {"Name": "year_built_c"}},
          {"field": {"Name": "commute_score_c"}}
        ],
        where: [],
        whereGroups: []
      };

      // Basic text search
      if (query && query.trim()) {
        params.whereGroups.push({
          "operator": "OR",
          "subGroups": [
            {"conditions": [{"fieldName": "address_c", "operator": "Contains", "values": [query]}], "operator": ""},
            {"conditions": [{"fieldName": "city_c", "operator": "Contains", "values": [query]}], "operator": ""},
            {"conditions": [{"fieldName": "state_c", "operator": "Contains", "values": [query]}], "operator": ""},
            {"conditions": [{"fieldName": "title_c", "operator": "Contains", "values": [query]}], "operator": ""},
            {"conditions": [{"fieldName": "description_c", "operator": "Contains", "values": [query]}], "operator": ""},
            {"conditions": [{"fieldName": "features_c", "operator": "Contains", "values": [query]}], "operator": ""}
          ]
        });
      }

      // Advanced filters
      if (advancedFilters.schoolDistricts && advancedFilters.schoolDistricts.length > 0) {
        params.where.push({
          "FieldName": "school_district_c",
          "Operator": "ExactMatch",
          "Values": advancedFilters.schoolDistricts,
          "Include": true
        });
      }

      if (advancedFilters.neighborhoods && advancedFilters.neighborhoods.length > 0) {
        params.where.push({
          "FieldName": "neighborhood_c",
          "Operator": "ExactMatch",
          "Values": advancedFilters.neighborhoods,
          "Include": true
        });
      }

      if (advancedFilters.maxCommuteTime && advancedFilters.maxCommuteTime < 60) {
        params.where.push({
          "FieldName": "commute_score_c",
          "Operator": "LessThanOrEqualTo",
          "Values": [advancedFilters.maxCommuteTime],
          "Include": true
        });
      }

      if (advancedFilters.propertyAge) {
        const currentYear = new Date().getFullYear();
        const minYear = currentYear - advancedFilters.propertyAge.max;
        const maxYear = currentYear - advancedFilters.propertyAge.min;
        
        params.where.push({
          "FieldName": "year_built_c",
          "Operator": "Between",
          "Values": [minYear, maxYear],
          "Include": true
        });
      }

      const response = await apperClient.fetchRecords('property_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return (response.data || []).map(property => this.transformFromDatabase(property));
    } catch (error) {
      console.error("Error searching properties:", error?.response?.data?.message || error);
      throw new Error("Failed to search properties");
    }
  }
};

export default propertyService;