import { toast } from "react-toastify";
import propertyService from "./propertyService";

// Storage key for localStorage
const STORAGE_KEY = 'savedProperties';

// Helper function to get saved properties from localStorage
const getSavedFromStorage = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error reading saved properties from storage:', error);
    return [];
  }
};

// Helper function to save to localStorage
const saveToStorage = (savedProperties) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedProperties));
    return true;
  } catch (error) {
    console.error('Error saving to storage:', error);
    toast.error('Unable to save property - storage unavailable');
    return false;
  }
};

const savedPropertiesService = {
  // Get all saved properties with full property details
  async getAll() {
    try {
      const savedProperties = getSavedFromStorage();
      const allProperties = await propertyService.getAll();
      
      // Enrich saved properties with full property data
      const enrichedSaved = savedProperties.map(saved => {
        const property = allProperties.find(p => p.Id === saved.propertyId);
        return {
          ...saved,
          property: property || null
        };
      }).filter(item => item.property !== null); // Filter out properties that no longer exist
      
      // Sort by savedAt date (most recent first) by default
      return enrichedSaved.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
    } catch (error) {
      console.error('Error fetching saved properties:', error);
      return [];
    }
  },

  // Check if a property is saved
  async isSaved(propertyId) {
    try {
      const savedProperties = getSavedFromStorage();
      return savedProperties.some(saved => saved.propertyId === parseInt(propertyId));
    } catch (error) {
      console.error('Error checking if property is saved:', error);
      return false;
    }
  },

  // Save a property
  async save(propertyId, notes = '') {
    try {
      const savedProperties = getSavedFromStorage();
      const numericPropertyId = parseInt(propertyId);
      
      // Check if already saved
      const existingIndex = savedProperties.findIndex(saved => saved.propertyId === numericPropertyId);
      if (existingIndex !== -1) {
        return { success: false, message: 'Property already saved' };
      }
      
      // Add new saved property
      const newSavedProperty = {
        propertyId: numericPropertyId,
        savedAt: new Date().toISOString(),
        notes: notes.trim()
      };
      
      savedProperties.push(newSavedProperty);
      
      if (saveToStorage(savedProperties)) {
        toast.success('Property saved successfully');
        return { success: true, data: newSavedProperty };
      } else {
        return { success: false, message: 'Failed to save property' };
      }
    } catch (error) {
      console.error('Error saving property:', error);
      toast.error('Unable to save property');
      return { success: false, message: 'Error saving property' };
    }
  },

  // Remove a saved property
  async remove(propertyId) {
    try {
      const savedProperties = getSavedFromStorage();
      const numericPropertyId = parseInt(propertyId);
      
      const filteredProperties = savedProperties.filter(saved => saved.propertyId !== numericPropertyId);
      
      if (filteredProperties.length === savedProperties.length) {
        return { success: false, message: 'Property not found in saved list' };
      }
      
      if (saveToStorage(filteredProperties)) {
        toast.success('Property removed from saved');
        return { success: true };
      } else {
        return { success: false, message: 'Failed to remove property' };
      }
    } catch (error) {
      console.error('Error removing saved property:', error);
      toast.error('Unable to remove property');
      return { success: false, message: 'Error removing property' };
    }
  },

  // Update notes for a saved property
  async updateNotes(propertyId, notes) {
    try {
      const savedProperties = getSavedFromStorage();
      const numericPropertyId = parseInt(propertyId);
      
      const propertyIndex = savedProperties.findIndex(saved => saved.propertyId === numericPropertyId);
      if (propertyIndex === -1) {
        return { success: false, message: 'Property not found in saved list' };
      }
      
      savedProperties[propertyIndex].notes = notes.trim();
      
      if (saveToStorage(savedProperties)) {
        toast.success('Notes updated successfully');
        return { success: true, data: savedProperties[propertyIndex] };
      } else {
        return { success: false, message: 'Failed to update notes' };
      }
    } catch (error) {
      console.error('Error updating notes:', error);
      toast.error('Unable to update notes');
      return { success: false, message: 'Error updating notes' };
    }
  },

  // Get count of saved properties
  async getCount() {
    try {
      const savedProperties = getSavedFromStorage();
      return savedProperties.length;
    } catch (error) {
      console.error('Error getting saved properties count:', error);
      return 0;
    }
  },

  // Toggle save status of a property
  async toggle(propertyId) {
    const isSaved = await this.isSaved(propertyId);
    if (isSaved) {
      return await this.remove(propertyId);
    } else {
      return await this.save(propertyId);
    }
  }
};

export default savedPropertiesService;