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
    return {
      success: true,
      message: "User bio updated successfully",
      data: response.data,
    };
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
      success: true,
      message: "User avatar updated successfully",
      data: response.data,
    };
  } catch (error) {
    return handleError(error, "Failed to update user avatar");
  }
};
