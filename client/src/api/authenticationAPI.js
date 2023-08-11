import axios from "axios";

const BASE_URL = process.env.REACT_APP_AUTH_SERVICE_URL;

const handleError = (error, action) => {
  console.error(`Error ${action}:`, error);
  throw error;
};

export const authenticateUser = async (phoneNumber, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/authenticate-user`, {
      phoneNumber,
      password,
    });
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

export const verifyRefreshToken = async (refreshToken) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/verify-refresh-token`,
      { refreshToken },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleError(error, "verifying refresh token");
  }
};

export const verifyAccessToken = async (accessToken) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/verify-access-token`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleError(error, "verifying access token");
  }
};

export const logout = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/api/logout`);
    return response.data;
  } catch (error) {
    handleError(error, "logging out");
  }
};
