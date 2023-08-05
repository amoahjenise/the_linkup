import axios from "axios";

const API_BASE_URL = "https://64a9f80a8b9afaf4844b2957.mockapi.io/api/v1"; // "https://link-us-up-live.free.beeceptor.com";

export const getActiveLinkUps = () => {
  // API call to fetch all link ups
  return axios
    .get(`${API_BASE_URL}/linkups`)
    .then((response) => {
      console.log(response);
      // Filter active link ups based on the "status" property
      const activeLinkUps = response.data.filter(
        (linkUp) => linkUp.status === "Active"
      );
      // Sort link ups by createdAt in descending order
      const sortedLinkUps = activeLinkUps.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      return sortedLinkUps;
    })
    .catch((error) => {
      // Handle error if needed
      console.log(error);
      return []; // Return an empty array if there's an error
    });
};

export const createLinkUp = (linkUpData) => {
  // API call to create a new link up
  return axios.post(`${API_BASE_URL}/linkups`, linkUpData);
};

export const updateLinkUp = (linkUpId, linkUpData) => {
  // API call to update a link up
  return axios.put(`${API_BASE_URL}/linkups/${linkUpId}`, linkUpData);
};

// Add more API functions as needed for your application
