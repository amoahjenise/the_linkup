import axios from "axios";

// Add this configuration globally for Axios to include credentials
// axios.defaults.withCredentials = true;

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

const handleError = (error) => {
  console.error("Error:", error);
  throw error;
};

export const getConversationByChannelUrl = async (channelUrl) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/messaging/conversation/channel/${channelUrl}`
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getLinkupByConversation = async (channelUrl) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/messaging/linkup-by-conversation/${channelUrl}`
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
