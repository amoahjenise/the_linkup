import axios from "axios";

// Add this configuration globally for Axios to include credentials
// axios.defaults.withCredentials = true;

const BASE_URL = process.env.REACT_APP_MESSAGING_SERVICE_URL;

const handleError = (error) => {
  console.error("Error:", error);
  throw error;
};

export const getConversations = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/conversations/${userId}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getConversationMessages = async (conversationId, userId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/conversation/messages/${conversationId}/${userId}`
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const createNewConversation = async (
  requesterId,
  receiverId,
  message,
  linkupId
) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/create-conversation`, {
      sender_id: requesterId,
      receiver_id: receiverId,
      message_content: message,
      linkup_id: linkupId,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
