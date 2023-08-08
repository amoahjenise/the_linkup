import axios from "axios";

const BASE_URL = process.env.REACT_APP_USER_SERVICE_URL;

export const createUser = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/create-user`, userData);
    return response;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const getUserById = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/get-user-by-id`, {
      params: { userId },
    });

    return {
      success: true,
      user: response.data.user,
    };
  } catch (error) {
    console.error("Error fetching user:", error);
    return {
      success: false,
      error: "Failed to fetch user data.",
    };
  }
};

export const updateUserBio = async (userId, bio) => {
  try {
    const response = await axios.post(`${BASE_URL}/update-user-bio/${userId}`, {
      bio,
    });
    return {
      success: true,
      bio: response.data.bio,
    };
  } catch (error) {
    console.error("Error updating user bio:", error);
    throw error;
  }
};

export const updateUserAvatar = async (userId, avatar) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/update-user-avatar/${userId}`,
      {
        avatar,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating user avatar:", error);
    throw error;
  }
};
