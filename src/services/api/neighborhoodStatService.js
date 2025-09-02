import { toast } from 'react-toastify';

class NeighborhoodStatService {
  constructor() {
    this.tableName = 'neighborhood_stat_c';
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getApperClient() {
    const { ApperClient } = window.ApperSDK;
    return new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  transformFromDatabase(stat) {
    return {
      Id: stat.Id,
      name: stat.name_c || '',
      neighborhoodName: stat.neighborhood_name_c || '',
      averagePrice: parseFloat(stat.average_price_c) || 0,
      salesVolume: parseInt(stat.sales_volume_c) || 0,
      daysOnMarket: parseInt(stat.days_on_market_c) || 0,
      marketActivityIndex: parseFloat(stat.market_activity_index_c) || 0,
      createdOn: stat.CreatedOn,
      modifiedOn: stat.ModifiedOn
    };
  }

  transformToDatabase(stat) {
    const data = {};
    
    if (stat.name !== undefined) data.name_c = stat.name;
    if (stat.neighborhoodName !== undefined) data.neighborhood_name_c = stat.neighborhoodName;
    if (stat.averagePrice !== undefined) data.average_price_c = stat.averagePrice;
    if (stat.salesVolume !== undefined) data.sales_volume_c = stat.salesVolume;
    if (stat.daysOnMarket !== undefined) data.days_on_market_c = stat.daysOnMarket;
    if (stat.marketActivityIndex !== undefined) data.market_activity_index_c = stat.marketActivityIndex;
    
    return data;
  }

  async getAll() {
    try {
      await this.delay();
      const apperClient = this.getApperClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "neighborhood_name_c"}},
          {"field": {"Name": "average_price_c"}},
          {"field": {"Name": "sales_volume_c"}},
          {"field": {"Name": "days_on_market_c"}},
          {"field": {"Name": "market_activity_index_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        orderBy: [{"fieldName": "average_price_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(stat => this.transformFromDatabase(stat));
    } catch (error) {
      console.error("Error fetching neighborhood stats:", error?.response?.data?.message || error);
      throw new Error("Failed to load neighborhood statistics");
    }
  }

  async getById(id) {
    try {
      await this.delay();
      const apperClient = this.getApperClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "neighborhood_name_c"}},
          {"field": {"Name": "average_price_c"}},
          {"field": {"Name": "sales_volume_c"}},
          {"field": {"Name": "days_on_market_c"}},
          {"field": {"Name": "market_activity_index_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      };

      const response = await apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data ? this.transformFromDatabase(response.data) : null;
    } catch (error) {
      console.error(`Error fetching neighborhood stat ${id}:`, error?.response?.data?.message || error);
      throw new Error("Failed to load neighborhood statistic");
    }
  }

  async getByNeighborhood(neighborhoodName) {
    try {
      await this.delay();
      const apperClient = this.getApperClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "neighborhood_name_c"}},
          {"field": {"Name": "average_price_c"}},
          {"field": {"Name": "sales_volume_c"}},
          {"field": {"Name": "days_on_market_c"}},
          {"field": {"Name": "market_activity_index_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        where: [
          {
            "FieldName": "neighborhood_name_c",
            "Operator": "ExactMatch",
            "Values": [neighborhoodName],
            "Include": true
          }
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}],
        pagingInfo: {"limit": 10, "offset": 0}
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return (response.data || []).map(stat => this.transformFromDatabase(stat));
    } catch (error) {
      console.error(`Error fetching stats for neighborhood ${neighborhoodName}:`, error?.response?.data?.message || error);
      throw new Error("Failed to load neighborhood statistics");
    }
  }

  async getTopPerforming(limit = 10) {
    try {
      await this.delay();
      const apperClient = this.getApperClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "neighborhood_name_c"}},
          {"field": {"Name": "average_price_c"}},
          {"field": {"Name": "sales_volume_c"}},
          {"field": {"Name": "days_on_market_c"}},
          {"field": {"Name": "market_activity_index_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        orderBy: [{"fieldName": "market_activity_index_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": limit, "offset": 0}
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return (response.data || []).map(stat => this.transformFromDatabase(stat));
    } catch (error) {
      console.error("Error fetching top performing neighborhoods:", error?.response?.data?.message || error);
      throw new Error("Failed to load top performing neighborhoods");
    }
  }

  async create(stat) {
    try {
      await this.delay();
      const apperClient = this.getApperClient();
      
      const params = {
        records: [this.transformToDatabase(stat)]
      };

      const response = await apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create neighborhood stat:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success('Neighborhood statistic created successfully');
          return this.transformFromDatabase(successful[0].data);
        }
      }

      throw new Error('No successful creation response');
    } catch (error) {
      console.error("Error creating neighborhood stat:", error?.response?.data?.message || error);
      throw new Error("Failed to create neighborhood statistic");
    }
  }

  async update(id, stat) {
    try {
      await this.delay();
      const apperClient = this.getApperClient();
      
      const params = {
        records: [{
          Id: id,
          ...this.transformToDatabase(stat)
        }]
      };

      const response = await apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update neighborhood stat:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success('Neighborhood statistic updated successfully');
          return this.transformFromDatabase(successful[0].data);
        }
      }

      throw new Error('No successful update response');
    } catch (error) {
      console.error(`Error updating neighborhood stat ${id}:`, error?.response?.data?.message || error);
      throw new Error("Failed to update neighborhood statistic");
    }
  }

  async delete(id) {
    try {
      await this.delay();
      const apperClient = this.getApperClient();
      
      const params = { 
        RecordIds: [id]
      };

      const response = await apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete neighborhood stat:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success('Neighborhood statistic deleted successfully');
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error(`Error deleting neighborhood stat ${id}:`, error?.response?.data?.message || error);
      throw new Error("Failed to delete neighborhood statistic");
    }
  }
}

const neighborhoodStatService = new NeighborhoodStatService();
export default neighborhoodStatService;