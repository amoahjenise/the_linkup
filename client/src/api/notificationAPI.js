import axios from "axios";

const BASE_URL = process.env.REACT_APP_NOTIFICATIONS_SERVICE_URL;

const handleError = (error) => {
  console.error("Error:", error);
  throw error;
};

export const getUnreadNotifications = async (id) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/get-unread-notifications`,
      {
        params: {
          requesterId: id,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const markNotificationAsRead = (notificationId) => {
  return axios
    .put(`${BASE_URL}/api/mark-as-read/${notificationId}`, { status: "read" })
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};
