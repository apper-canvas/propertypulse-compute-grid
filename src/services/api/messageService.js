import { toast } from "react-toastify";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const messageService = {
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
          {"field": {"Name": "sender_id_c"}},
          {"field": {"Name": "recipient_id_c"}},
          {"field": {"Name": "message_content_c"}},
          {"field": {"Name": "agent_id_c"}},
          {"field": {"Name": "property_id_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords("message_c", params);

      if (!response.success) {
        console.error("Error fetching messages:", response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching messages:", error?.response?.data?.message || error);
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
          {"field": {"Name": "sender_id_c"}},
          {"field": {"Name": "recipient_id_c"}},
          {"field": {"Name": "message_content_c"}},
          {"field": {"Name": "agent_id_c"}},
          {"field": {"Name": "property_id_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        where: [
          {"FieldName": "agent_id_c", "Operator": "EqualTo", "Values": [parseInt(agentId)]}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords("message_c", params);

      if (!response.success) {
        console.error("Error fetching agent messages:", response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching agent messages:", error?.response?.data?.message || error);
      return [];
    }
  },

  async create(messageData) {
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
          Name: `Message to ${messageData.agent_name || 'Agent'}`,
          sender_id_c: messageData.sender_id_c ? parseInt(messageData.sender_id_c) : null,
          recipient_id_c: messageData.recipient_id_c ? parseInt(messageData.recipient_id_c) : null,
          message_content_c: messageData.message_content_c || "",
          agent_id_c: messageData.agent_id_c ? parseInt(messageData.agent_id_c) : null,
          property_id_c: messageData.property_id_c ? parseInt(messageData.property_id_c) : null
        }]
      };

      const response = await apperClient.createRecord("message_c", params);

      if (!response.success) {
        console.error("Error creating message:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create message:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }

        toast.success("Message sent successfully");
        return successful[0]?.data || null;
      }
    } catch (error) {
      console.error("Error creating message:", error?.response?.data?.message || error);
      toast.error("Failed to send message");
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
          {"field": {"Name": "sender_id_c"}},
          {"field": {"Name": "recipient_id_c"}},
          {"field": {"Name": "message_content_c"}},
          {"field": {"Name": "agent_id_c"}},
          {"field": {"Name": "property_id_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      };

      const response = await apperClient.getRecordById("message_c", id, params);

      if (!response?.data) {
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching message ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }
};

export default messageService;