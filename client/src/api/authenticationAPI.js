import axios from "axios";

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

const handleError = (error, action) => {
  console.error(`Error ${action}:`, error);
  throw error;
};

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/auth/register-user`,
      userData
    );
    return response;
  } catch (error) {
    return handleError(error, "Failed to create new user.");
  }
};

export const authenticateUser = async (clerkUserId) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/auth/authenticate-user`,
      null,
      {
        params: { clerkUserId },
      }
    );
    return response.data;
  } catch (error) {
    handleError(error, "authenticating user");
  }
};

export const getUserByClerkId = async (clerkUserId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/auth/get-user-by-clerk-id`,
      {
        params: { clerkUserId },
      }
    );
    return response.data;
  } catch (error) {
    handleError(error, "fetching user");
  }
};
