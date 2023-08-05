import axios from "axios";

const API_BASE_URL = "https://64a9f80a8b9afaf4844b2957.mockapi.io/api/v1"; // Replace with your API base URL

export const getUnreadNotifications = () => {
  return axios
    .get(`${API_BASE_URL}/notifications?status=unread`)
    .then((response) => response.data)
    .catch((error) => {
      console.log("Error fetching unread notifications:", error);
      throw error;
    });
};

export const markNotificationAsRead = (notificationId) => {
  return axios
    .put(`${API_BASE_URL}/notifications/${notificationId}`, { status: "read" })
    .then((response) => response.data)
    .catch((error) => {
      console.log("Error marking notification as read:", error);
      throw error;
    });
};

export const sendNotification = (recipientId, message) => {
  return axios
    .post(`${API_BASE_URL}/notifications`, { recipientId, message })
    .then((response) => response.data)
    .catch((error) => {
      console.log("Error sending notification:", error);
      throw error;
    });
};
