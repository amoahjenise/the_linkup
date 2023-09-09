import axios from "axios";

const BASE_URL = process.env.REACT_APP_USER_SERVICE_URL;

const handleError = (error, errorMessage) => {
  console.error(errorMessage, error);
  return {
    success: false,
    message: errorMessage,
    error: error.message,
  };
};

export const deleteUser = async (userId) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/delete-user/${userId}`);
    console.log("deleteUser", response);
    return response;
  } catch (error) {
    return handleError(error, "Failed to delete user");
  }
};

export const createUser = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/create-user`, userData);
    console.log("createUser", response);
    return response;
  } catch (error) {
    return handleError(error, "Failed to create new user.");
  }
};

export const getUserById = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/get-user-by-id`, {
      params: { userId },
    });
    console.log("getUserById", response);
    return response;
  } catch (error) {
    return handleError(error, "Failed to fetch user data.");
  }
};

export const updateUserBio = async (userId, bio) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/api/update-user-bio/${userId}`,
      {
        bio,
      }
    );
    console.log("updateUserBio", response);
    return response;
  } catch (error) {
    return handleError(error, "Failed to update the user's bio.");
  }
};

export const updateUserAvatar = async (userId, avatar) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/api/update-user-avatar/${userId}`,
      {
        avatar,
      }
    );
    console.log("updateUserAvatar", response);
    return response;
  } catch (error) {
    return handleError(error, "Failed to update the user's avatar.");
  }
};

export const setUserStatusActive = async (userId) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/api/set-user-status-active/${userId}`
    );
    console.log("setUserStatusActive", response);
    return response;
  } catch (error) {
    return handleError(
      error,
      "Failed to update the user's status to 'active'."
    );
  }
};
