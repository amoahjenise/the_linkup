import axios from "axios";

// Add this configuration globally for Axios to include credentials
// axios.defaults.withCredentials = true;

const BASE_URL = process.env.REACT_APP_BACKEND_URL;
const AUTH_SERVICE_URL = process.env.REACT_APP_BACKEND_URL;

const refreshToken = async () => {
  try {
    const response = await axios.post(
      `${AUTH_SERVICE_URL}/api/user/refresh-token`,
      {
        refreshToken: localStorage.getItem("refresh_token"),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to refresh access token", error);
    return { success: false };
  }
};
export const handleError = async (error, errorMessage) => {
  console.error(errorMessage, error);
  if (error.response && error.response.status === 401) {
    // If the error is due to an expired token, attempt to refresh the token
    const response = await refreshToken();
    if (response.success) {
      // If token refresh is successful, retry the original API call
      const { accessToken } = response;
      if (accessToken) {
        error.config.headers.Authorization = `Bearer ${accessToken}`;
        return axios.request(error.config); // Retry the original request
      } else {
        // If there's still no access token, consider it an unauthorized error
        return { unauthorizedError: true };
      }
    } else {
      // If there's still no access token, consider it an unauthorized error
      return { unauthorizedError: true };
    }
  }
  // Re-throw the original error if it's not an unauthorized error
  throw error;
};

export const getUserById = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/user/get-user-by-id`, {
      params: { userId },
    });
    return response;
  } catch (error) {
    try {
      const errorResult = await handleError(
        error,
        "Failed to fetch user data."
      );
      if (errorResult.unauthorizedError) {
        // Return an error object indicating unauthorized
        return { unauthorizedError: true };
      }
      // Handle other errors as needed
      console.error("Error:", error);
      return {
        success: false,
        message: "An error occurred.",
        error: error.message,
      };
    } catch (error) {
      // Handle errors from the `handleError` function if needed
      console.error("Error in handleError:", error);
      return {
        success: false,
        message: "An error occurred.",
        error: error.message,
      };
    }
  }
};

export const getUserByClerkId = async (clerkUserId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/user/get-user-by-clerk-id`,
      {
        params: { clerkUserId },
      }
    );
    return response.data;
  } catch (error) {
    try {
      const errorResult = await handleError(
        error,
        "Failed to fetch user data."
      );
      if (errorResult.unauthorizedError) {
        // Return an error object indicating unauthorized
        return { unauthorizedError: true };
      }
      // Handle other errors as needed
      console.error("Error:", error);
      return {
        success: false,
        message: "An error occurred.",
        error: error.message,
      };
    } catch (error) {
      // Handle errors from the `handleError` function if needed
      console.error("Error in handleError:", error);
      return {
        success: false,
        message: "An error occurred.",
        error: error.message,
      };
    }
  }
};

export const deactivateUser = async (userId) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/user/deactivate-user/${userId}`
    );
    return response;
  } catch (error) {
    try {
      return await handleError(error, "Failed to deactivate user");
    } catch (error) {
      // Handle other errors as needed
      console.error("Error:", error);
      return {
        success: false,
        message: "An error occurred.",
        error: error.message,
      };
    }
  }
};

export const createUser = async (userData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/user/create-user`,
      userData
    );
    return response;
  } catch (error) {
    try {
      return await handleError(error, "Failed to create new user");
    } catch (error) {
      // Handle other errors as needed
      console.error("Error:", error);
      return {
        success: false,
        message: "An error occurred.",
        error: error.message,
      };
    }
  }
};

export const updateUser = async (userData) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/api/user/update-user`,
      userData
    );
    console.log("Updated User: ", response);
    return response;
  } catch (error) {
    return handleError(error, "Failed to update existing user.");
  }
};

export const updateUserBio = async (userId, bio) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/api/user/update-user-bio/${userId}`,
      {
        bio,
      }
    );
    return response;
  } catch (error) {
    try {
      return await handleError(error, "Failed to update the user's bio.");
    } catch (error) {
      // Handle other errors as needed
      console.error("Error:", error);
      return {
        success: false,
        message: "An error occurred.",
        error: error.message,
      };
    }
  }
};

export const updateUserAvatar = async (userId, avatar) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/api/user/update-user-avatar/${userId}`,
      {
        avatar,
      }
    );
    return response;
  } catch (error) {
    try {
      return await handleError(error, "Failed to update the user's avatar.");
    } catch (error) {
      // Handle other errors as needed
      console.error("Error:", error);
      return {
        success: false,
        message: "An error occurred.",
        error: error.message,
      };
    }
  }
};

export const updateUserName = async (userId, name) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/api/user/update-user-name/${userId}`,
      {
        name,
      }
    );
    return response;
  } catch (error) {
    try {
      return await handleError(error, "Failed to update the user's name.");
    } catch (error) {
      // Handle other errors as needed
      console.error("Error:", error);
      return {
        success: false,
        message: "An error occurred.",
        error: error.message,
      };
    }
  }
};

export const setUserStatusActive = async (userId) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/api/user/set-user-status-active/${userId}`
    );
    return response;
  } catch (error) {
    try {
      return await handleError(
        error,
        "Failed to update the user's status to 'active'."
      );
    } catch (error) {
      // Handle other errors as needed
      console.error("Error:", error);
      return {
        success: false,
        message: "An error occurred.",
        error: error.message,
      };
    }
  }
};
