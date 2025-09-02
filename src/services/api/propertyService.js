import propertiesData from "@/services/mockData/properties.json";

const propertyService = {
  // Simulate API delay
  delay: (ms = 300) => new Promise(resolve => setTimeout(resolve, ms)),

  async getAll() {
    await this.delay();
    return [...propertiesData];
  },

  async getById(Id) {
    await this.delay();
    const property = propertiesData.find(p => p.Id === Id);
    if (!property) {
      throw new Error("Property not found");
    }
    return { ...property };
  },

  async create(propertyData) {
    await this.delay();
    const newProperty = {
      ...propertyData,
      Id: Math.max(...propertiesData.map(p => p.Id)) + 1,
      listingDate: new Date().toISOString(),
      status: "active"
    };
    propertiesData.push(newProperty);
    return { ...newProperty };
  },

  async update(Id, propertyData) {
    await this.delay();
    const index = propertiesData.findIndex(p => p.Id === Id);
    if (index === -1) {
      throw new Error("Property not found");
    }
    propertiesData[index] = { ...propertiesData[index], ...propertyData };
    return { ...propertiesData[index] };
  },

  async delete(Id) {
    await this.delay();
    const index = propertiesData.findIndex(p => p.Id === Id);
    if (index === -1) {
      throw new Error("Property not found");
    }
    const deleted = propertiesData.splice(index, 1)[0];
    return { ...deleted };
  },

  // Additional property-specific methods
  async getByPriceRange(minPrice, maxPrice) {
    await this.delay();
    return propertiesData.filter(p => p.price >= minPrice && p.price <= maxPrice);
  },

  async getByLocation(city, state) {
    await this.delay();
    return propertiesData.filter(p => 
      p.city.toLowerCase() === city.toLowerCase() && 
      p.state.toLowerCase() === state.toLowerCase()
    );
  },

  async searchProperties(query) {
    await this.delay();
    const searchTerm = query.toLowerCase();
    return propertiesData.filter(p => 
      p.address.toLowerCase().includes(searchTerm) ||
      p.city.toLowerCase().includes(searchTerm) ||
      p.state.toLowerCase().includes(searchTerm) ||
      p.title.toLowerCase().includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm) ||
      p.features.some(f => f.toLowerCase().includes(searchTerm))
    );
  }
};

export default propertyService;