import axios from "axios";

const BASE_URL = process.env.REACT_APP_LINKUP_SERVICE_URL;

const handleError = (error) => {
  console.error("Error:", error);
  throw error;
};

export const getPendingLinkups = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/get-linkups`);
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
