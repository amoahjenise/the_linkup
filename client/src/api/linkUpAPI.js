import axios from "axios";

const BASE_URL = process.env.REACT_APP_LINKUP_SERVICE_URL;

const handleError = (error) => {
  console.error("Error:", error);
  throw error;
};

export const getLinkups = async (userId, gender) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/get-linkups/${userId}`, {
      params: {
        gender: gender,
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getUserLinkups = async (userId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/get-user-linkups/${userId}`
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const createLinkup = async (linkUpData) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/create-linkup`, {
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
      `${BASE_URL}/api/delete-linkup?id=${linkupId}`
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const markLinkupsAsExpired = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/api/mark-expired-linkups`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const updateLinkup = async (linkupId, linkupData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/update-linkup?id=${linkupId}`,
      {
        linkup: linkupData,
      }
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
