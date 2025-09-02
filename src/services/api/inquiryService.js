import { toast } from "react-toastify";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const inquiryService = {
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
          {"field": {"Name": "user_id_c"}},
          {"field": {"Name": "agent_id_c"}},
          {"field": {"Name": "property_id_c"}},
          {"field": {"Name": "inquiry_status_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords("inquiry_c", params);

      if (!response.success) {
        console.error("Error fetching inquiries:", response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching inquiries:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getByAgentId(agentId) {
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
          {"field": {"Name": "user_id_c"}},
          {"field": {"Name": "agent_id_c"}},
          {"field": {"Name": "property_id_c"}},
          {"field": {"Name": "inquiry_status_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        where: [
          {"FieldName": "agent_id_c", "Operator": "EqualTo", "Values": [parseInt(agentId)]}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords("inquiry_c", params);

      if (!response.success) {
        console.error("Error fetching agent inquiries:", response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching agent inquiries:", error?.response?.data?.message || error);
      return [];
    }
  },

  async create(inquiryData) {
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
          Name: inquiryData.Name || `Inquiry for ${inquiryData.agent_name || 'Agent'}`,
          user_id_c: inquiryData.user_id_c ? parseInt(inquiryData.user_id_c) : null,
          agent_id_c: inquiryData.agent_id_c ? parseInt(inquiryData.agent_id_c) : null,
          property_id_c: inquiryData.property_id_c ? parseInt(inquiryData.property_id_c) : null,
          inquiry_status_c: inquiryData.inquiry_status_c || "New"
        }]
      };

      const response = await apperClient.createRecord("inquiry_c", params);

      if (!response.success) {
        console.error("Error creating inquiry:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create inquiry:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }

        toast.success("Inquiry submitted successfully");
        return successful[0]?.data || null;
      }
    } catch (error) {
      console.error("Error creating inquiry:", error?.response?.data?.message || error);
      toast.error("Failed to submit inquiry");
      return null;
    }
  },

  async update(id, inquiryData) {
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
          Name: inquiryData.Name || `Updated Inquiry`,
          user_id_c: inquiryData.user_id_c ? parseInt(inquiryData.user_id_c) : null,
          agent_id_c: inquiryData.agent_id_c ? parseInt(inquiryData.agent_id_c) : null,
          property_id_c: inquiryData.property_id_c ? parseInt(inquiryData.property_id_c) : null,
          inquiry_status_c: inquiryData.inquiry_status_c || "New"
        }]
      };

      const response = await apperClient.updateRecord("inquiry_c", params);

      if (!response.success) {
        console.error("Error updating inquiry:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update inquiry:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }

        toast.success("Inquiry updated successfully");
        return successful[0]?.data || null;
      }
    } catch (error) {
      console.error("Error updating inquiry:", error?.response?.data?.message || error);
      toast.error("Failed to update inquiry");
      return null;
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
          {"field": {"Name": "user_id_c"}},
          {"field": {"Name": "agent_id_c"}},
          {"field": {"Name": "property_id_c"}},
          {"field": {"Name": "inquiry_status_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      };

      const response = await apperClient.getRecordById("inquiry_c", id, params);

      if (!response?.data) {
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching inquiry ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }
};

export default inquiryService;