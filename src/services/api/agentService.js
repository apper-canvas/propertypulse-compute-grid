import { toast } from "react-toastify";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const agentService = {
  async getAll() {
    await delay(300);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "agent_name_c"}},
          {"field": {"Name": "photo_url_c"}},
          {"field": {"Name": "specialties_c"}},
          {"field": {"Name": "ratings_c"}},
          {"field": {"Name": "bio_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        orderBy: [{"fieldName": "agent_name_c", "sorttype": "ASC"}]
      };

      const response = await apperClient.fetchRecords("agent_c", params);

      if (!response.success) {
        console.error("Error fetching agents:", response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching agents:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    await delay(300);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "agent_name_c"}},
          {"field": {"Name": "photo_url_c"}},
          {"field": {"Name": "specialties_c"}},
          {"field": {"Name": "ratings_c"}},
          {"field": {"Name": "bio_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      };

      const response = await apperClient.getRecordById("agent_c", id, params);

      if (!response?.data) {
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching agent ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(agentData) {
    await delay(300);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const params = {
        records: [{
          Name: agentData.agent_name_c,
          agent_name_c: agentData.agent_name_c,
          photo_url_c: agentData.photo_url_c || "",
          specialties_c: agentData.specialties_c || "",
          ratings_c: agentData.ratings_c ? Number(agentData.ratings_c) : 0,
          bio_c: agentData.bio_c || "",
          phone_c: agentData.phone_c || "",
          email_c: agentData.email_c || ""
        }]
      };

      const response = await apperClient.createRecord("agent_c", params);

      if (!response.success) {
        console.error("Error creating agent:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create agent:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }

        toast.success("Agent created successfully");
        return successful[0]?.data || null;
      }
    } catch (error) {
      console.error("Error creating agent:", error?.response?.data?.message || error);
      toast.error("Failed to create agent");
      return null;
    }
  },

  async update(id, agentData) {
    await delay(300);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const params = {
        records: [{
          Id: id,
          Name: agentData.agent_name_c,
          agent_name_c: agentData.agent_name_c,
          photo_url_c: agentData.photo_url_c || "",
          specialties_c: agentData.specialties_c || "",
          ratings_c: agentData.ratings_c ? Number(agentData.ratings_c) : 0,
          bio_c: agentData.bio_c || "",
          phone_c: agentData.phone_c || "",
          email_c: agentData.email_c || ""
        }]
      };

      const response = await apperClient.updateRecord("agent_c", params);

      if (!response.success) {
        console.error("Error updating agent:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update agent:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }

        toast.success("Agent updated successfully");
        return successful[0]?.data || null;
      }
    } catch (error) {
      console.error("Error updating agent:", error?.response?.data?.message || error);
      toast.error("Failed to update agent");
      return null;
    }
  },

  async delete(id) {
    await delay(300);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [id]
      };

      const response = await apperClient.deleteRecord("agent_c", params);

      if (!response.success) {
        console.error("Error deleting agent:", response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete agent:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }

        toast.success("Agent deleted successfully");
        return true;
      }
    } catch (error) {
      console.error("Error deleting agent:", error?.response?.data?.message || error);
      toast.error("Failed to delete agent");
      return false;
    }
  },

  async searchBySpecialty(specialty) {
    await delay(300);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "agent_name_c"}},
          {"field": {"Name": "photo_url_c"}},
          {"field": {"Name": "specialties_c"}},
          {"field": {"Name": "ratings_c"}},
          {"field": {"Name": "bio_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "email_c"}}
        ],
        where: [
          {"FieldName": "specialties_c", "Operator": "Contains", "Values": [specialty]}
        ],
        orderBy: [{"fieldName": "ratings_c", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords("agent_c", params);

      if (!response.success) {
        console.error("Error searching agents:", response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error searching agents:", error?.response?.data?.message || error);
      return [];
    }
  }
};

export default agentService;