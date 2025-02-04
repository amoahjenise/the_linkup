import axios from "axios";

// Add this configuration globally for Axios to include credentials
// axios.defaults.withCredentials = true;

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

const handleError = (error) => {
  console.error("Error:", error);
  throw error;
};

// Convert gender array to string format for API requests
const formatGender = (gender) => {
  return Array.isArray(gender) ? `{${gender.join(",")}}` : gender;
};

export const searchLinkups = async (searchTerm, userId, gender) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/linkup/linkups/search/${userId}`,
      {
        params: {
          search_term: searchTerm,
          gender: formatGender(gender), // Format gender for API
        },
      }
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getLinkups = async (
  userId,
  gender,
  sqlOffset,
  pageSize,
  latitude,
  longitude
) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/linkup/linkups/${userId}`,
      {
        params: {
          gender: formatGender(gender), // Format gender for API
          offset: sqlOffset,
          pageSize: pageSize,
          latitude: latitude,
          longitude: longitude,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getUserLinkups = async (userId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/linkup/linkups/user/${userId}`
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getLinkupStatus = async (linkupId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/linkup/linkups/status/${linkupId}`
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const createLinkup = async (linkUpData) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/linkup/linkups/create`, {
      linkup: linkUpData,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const deleteLinkup = async (linkupId) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/api/linkup/linkups/${linkupId}`
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const closeLinkup = async (linkupId) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/linkup/linkups/close/${linkupId}`
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const updateLinkup = async (linkupId, linkupData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/linkup/linkups/update/${linkupId}`,
      {
        linkup: linkupData,
      }
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
