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
    console.log("RESPONSE", response);

    return {
      success: response.data.success,
      message: response.data.message,
    };
  } catch (error) {
    return handleError(error, "Failed to delete user");
  }
};

export const createUser = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/create-user`, userData);
    return {
      success: true,
      message: "User created successfully",
      data: response.data,
    };
  } catch (error) {
    return handleError(error, "Failed to create user");
  }
};

export const getUserById = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/get-user-by-id`, {
      params: { userId },
    });
    return response.data;
  } catch (error) {
    return handleError(error, "Failed to fetch user data");
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
    console.log(JSON.stringify(response));
    return response.data;
  } catch (error) {
    return handleError(error, "Failed to update user bio");
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
    return {
      success: response.data.success,
      message: response.data.message,
      data: response.data,
    };
  } catch (error) {
    return handleError(error, "Failed to update user avatar");
  }
};

export const setUserStatusActive = async (userId) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/api/set-user-status-active/${userId}`
    );
    return {
      success: response.data.success,
      message: response.data.message,
    };
  } catch (error) {
    return handleError(error, "Failed to update user status to 'active'");
  }
};
