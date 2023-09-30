import axios from "axios";

// Add this configuration globally for Axios to include credentials
// axios.defaults.withCredentials = true;

const BASE_URL = process.env.REACT_APP_NOTIFICATIONS_SERVICE_URL;

const handleError = (error) => {
  console.error("Error:", error);
  throw error;
};

export const getNotifications = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/get-notifications`, {
      params: {
        userId: userId,
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/mark-as-read/${notificationId}`
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getUnreadNotificationsCount = async (userId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/get-unread-notifications-count`,
      {
        params: {
          userId: userId,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
