import axios from "axios";

// Add this configuration globally for Axios to include credentials
// axios.defaults.withCredentials = true;

const BASE_URL = process.env.REACT_APP_LINKUP_SERVICE_URL;

const handleError = (error) => {
  console.error("Error:", error);
  throw error;
};

export const searchLinkups = async (
  searchTerm,
  userId,
  gender,
  sqlOffset,
  pageSize
) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/linkups/search/${userId}`,
      {
        params: {
          search_term: searchTerm,
          gender: gender,
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
    const response = await axios.get(`${BASE_URL}/api/linkups/${userId}`, {
      params: {
        gender: gender,
        offset: sqlOffset,
        pageSize: pageSize,
        latitude: latitude,
        longitude: longitude,
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getUserLinkups = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/linkups/user/${userId}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getLinkupStatus = async (linkupId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/linkups/status/${linkupId}`
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const createLinkup = async (linkUpData) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/linkups/create`, {
      linkup: linkUpData,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const deleteLinkup = async (linkupId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/api/linkups/${linkupId}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const closeLinkup = async (linkupId) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/linkups/close/${linkupId}`
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const updateLinkup = async (linkupId, linkupData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/linkups/update/${linkupId}`,
      {
        linkup: linkupData,
      }
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
