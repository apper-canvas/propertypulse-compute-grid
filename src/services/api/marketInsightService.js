import { toast } from 'react-toastify';

class MarketInsightService {
  constructor() {
    this.tableName = 'market_insight_c';
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

  transformFromDatabase(insight) {
    return {
      Id: insight.Id,
      name: insight.name_c || '',
      insightType: insight.insight_type_c || '',
      region: insight.region_c || '',
      statisticDate: insight.statistic_date_c || null,
      value: parseFloat(insight.value_c) || 0,
      neighborhood: insight.neighborhood_c || '',
      createdOn: insight.CreatedOn,
      modifiedOn: insight.ModifiedOn
    };
  }

  transformToDatabase(insight) {
    const data = {};
    
    if (insight.name !== undefined) data.name_c = insight.name;
    if (insight.insightType !== undefined) data.insight_type_c = insight.insightType;
    if (insight.region !== undefined) data.region_c = insight.region;
    if (insight.statisticDate !== undefined) data.statistic_date_c = insight.statisticDate;
    if (insight.value !== undefined) data.value_c = insight.value;
    if (insight.neighborhood !== undefined) data.neighborhood_c = insight.neighborhood;
    
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
          {"field": {"Name": "insight_type_c"}},
          {"field": {"Name": "region_c"}},
          {"field": {"Name": "statistic_date_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "neighborhood_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        orderBy: [{"fieldName": "statistic_date_c", "sorttype": "DESC"}],
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

      return response.data.map(insight => this.transformFromDatabase(insight));
    } catch (error) {
      console.error("Error fetching market insights:", error?.response?.data?.message || error);
      throw new Error("Failed to load market insights");
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
          {"field": {"Name": "insight_type_c"}},
          {"field": {"Name": "region_c"}},
          {"field": {"Name": "statistic_date_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "neighborhood_c"}},
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
      console.error(`Error fetching market insight ${id}:`, error?.response?.data?.message || error);
      throw new Error("Failed to load market insight");
    }
  }

  async getByType(insightType) {
    try {
      await this.delay();
      const apperClient = this.getApperClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "insight_type_c"}},
          {"field": {"Name": "region_c"}},
          {"field": {"Name": "statistic_date_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "neighborhood_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        where: [
          {
            "FieldName": "insight_type_c",
            "Operator": "ExactMatch",
            "Values": [insightType],
            "Include": true
          }
        ],
        orderBy: [{"fieldName": "statistic_date_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 50, "offset": 0}
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return (response.data || []).map(insight => this.transformFromDatabase(insight));
    } catch (error) {
      console.error(`Error fetching insights by type ${insightType}:`, error?.response?.data?.message || error);
      throw new Error("Failed to load market insights by type");
    }
  }

  async getByRegion(region) {
    try {
      await this.delay();
      const apperClient = this.getApperClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "insight_type_c"}},
          {"field": {"Name": "region_c"}},
          {"field": {"Name": "statistic_date_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "neighborhood_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        where: [
          {
            "FieldName": "region_c",
            "Operator": "ExactMatch",
            "Values": [region],
            "Include": true
          }
        ],
        orderBy: [{"fieldName": "statistic_date_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 50, "offset": 0}
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return (response.data || []).map(insight => this.transformFromDatabase(insight));
    } catch (error) {
      console.error(`Error fetching insights by region ${region}:`, error?.response?.data?.message || error);
      throw new Error("Failed to load market insights by region");
    }
  }

  async create(insight) {
    try {
      await this.delay();
      const apperClient = this.getApperClient();
      
      const params = {
        records: [this.transformToDatabase(insight)]
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
          console.error(`Failed to create market insight:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success('Market insight created successfully');
          return this.transformFromDatabase(successful[0].data);
        }
      }

      throw new Error('No successful creation response');
    } catch (error) {
      console.error("Error creating market insight:", error?.response?.data?.message || error);
      throw new Error("Failed to create market insight");
    }
  }

  async update(id, insight) {
    try {
      await this.delay();
      const apperClient = this.getApperClient();
      
      const params = {
        records: [{
          Id: id,
          ...this.transformToDatabase(insight)
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
          console.error(`Failed to update market insight:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success('Market insight updated successfully');
          return this.transformFromDatabase(successful[0].data);
        }
      }

      throw new Error('No successful update response');
    } catch (error) {
      console.error(`Error updating market insight ${id}:`, error?.response?.data?.message || error);
      throw new Error("Failed to update market insight");
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
          console.error(`Failed to delete market insight:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success('Market insight deleted successfully');
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error(`Error deleting market insight ${id}:`, error?.response?.data?.message || error);
      throw new Error("Failed to delete market insight");
    }
  }
}

const marketInsightService = new MarketInsightService();
export default marketInsightService;