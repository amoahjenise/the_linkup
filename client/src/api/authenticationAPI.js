import axios from "axios";

const BASE_URL = process.env.REACT_APP_AUTH_SERVICE_URL;

const handleError = (error, action) => {
  console.error(`Error ${action}:`, error);
  throw error;
};

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/register-user`,
      userData
    );
    return response;
  } catch (error) {
    return handleError(error, "Failed to create new user.");
  }
};

export const authenticateUser = async (phoneNumber, password) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/authenticate-user`,
      { phoneNumber, password },
      { withCredentials: true } // Set withCredentials to true in the request config
    );
    return response.data;
  } catch (error) {
    handleError(error, "authenticating user");
  }
};

export const getUserByPhoneNumber = async (phoneNumber) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/get-user-by-phonenumber`,
      {
        params: { phoneNumber },
      }
    );
    return response.data;
  } catch (error) {
    handleError(error, "fetching user");
  }
};

export const verifyCode = async (phoneNumber, verificationCode) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/verify-code`, {
      phoneNumber,
      verificationCode,
    });
    return response.data;
  } catch (error) {
    handleError(error, "verifying phone number");
  }
};

export const sendVerificationCode = async (phoneNumber) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/send-verification-code`,
      {
        phoneNumber,
      }
    );
    return response.data;
  } catch (error) {
    handleError(error, "sending verification code");
  }
};

export const verifyRefreshToken = async (userId) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/verify-refresh-token`, {
      userId,
    });
    return response.data;
  } catch (error) {
    handleError(error, "verifying refresh token");
  }
};

export const clearAccessToken = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/api/clear-access-token`);
    return response.data;
  } catch (error) {
    handleError(error, "clearing access token");
  }
};
