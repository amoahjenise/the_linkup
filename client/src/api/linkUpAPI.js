import axios from "axios";

const BASE_URL = process.env.REACT_APP_LINKUP_SERVICE_URL;

export const getPendingLinkups = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/get-linkups`);
    const pendingLinkUps = response.data.linkups.filter(
      (linkUp) => linkUp.status === "pending"
    );
    const sortedLinkUps = pendingLinkUps.sort(
      (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
    );
    return {
      success: true,
      message: "Pending link-ups fetched successfully",
      linkUps: sortedLinkUps,
    };
  } catch (error) {
    console.log("Error fetching link-ups:", error);
    return { success: false, message: "Error fetching link-ups", linkUps: [] };
  }
};

export const createLinkUp = async (linkUpData) => {
  try {
    const response = await axios.post(`${BASE_URL}/create-linkup`, {
      linkup: linkUpData,
    });
    const createdLinkUp = response.data.linkup;
    return {
      success: true,
      message: "Link-up created successfully",
      linkUp: createdLinkUp,
    };
  } catch (error) {
    console.log("Error creating link-up:", error);
    return { success: false, message: "Error creating link-up", linkUp: null };
  }
};

export const updateLinkUp = async (linkUpId, linkUpData) => {
  try {
    const response = await axios.put(`${BASE_URL}/update-linkup/${linkUpId}`, {
      linkup: linkUpData,
    });
    const updatedLinkUp = response.data.linkup;
    return {
      success: true,
      message: "Link-up updated successfully",
      linkUp: updatedLinkUp,
    };
  } catch (error) {
    console.log("Error updating link-up:", error);
    return { success: false, message: "Error updating link-up", linkUp: null };
  }
};
