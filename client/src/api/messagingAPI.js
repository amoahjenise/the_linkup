import axios from "axios";

const BASE_URL = process.env.REACT_APP_MESSAGING_SERVICE_URL;

const handleError = (error) => {
  console.error("Error:", error);
  throw error;
};

export const createNewConversation = async (
  requesterId,
  receiverId,
  message
) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/create-conversation`, {
      sender_id: requesterId,
      recipient_id: receiverId,
      message_content: message,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
