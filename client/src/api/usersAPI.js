import axios from "axios";

const API_BASE_URL = "https://64a9f80a8b9afaf4844b2957.mockapi.io/api/v1"; // "https://link-us-up-live.free.beeceptor.com";

export const getActiveUsers = () => {
  // API call to fetch all link ups
  return axios
    .get(`${API_BASE_URL}/users`)
    .then((response) => {
      console.log(response);
      // Filter active users based on the "status" property
      return response.data.filter((linkUp) => linkUp.status === "Active");
    })
    .catch((error) => {
      // Handle error if needed
      console.log(error);
      return []; // Return an empty array if there's an error
    });
};

export const createUser = (registrationData) => {
  // API call to create a new link up
  return axios.post(`${API_BASE_URL}/users`, registrationData);
};

export const updateUser = (userId, userData) => {
  // API call to update a link up
  return axios.put(`${API_BASE_URL}/users/${userId}`, userData);
};

// Add more API functions as needed for your application
