import axios from "axios";

const BASE_URL = process.env.REACT_APP_AUTH_SERVICE_URL;

export const authenticateUser = async (phoneNumber, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/authenticate-user`, {
      phoneNumber,
      password,
    });

    return response;
  } catch (error) {
    console.error("Error authenticating user:", error);
    throw error;
  }
};

export const getUserByPhoneNumber = async (phoneNumber) => {
  try {
    const response = await axios.get(`${BASE_URL}/get-user-by-phonenumber`, {
      params: { phoneNumber },
    });
    return response;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export const verifyCode = async (phoneNumber, verificationCode) => {
  try {
    const response = await axios.post(`${BASE_URL}/verify-code`, {
      phoneNumber,
      verificationCode,
    });
    return response;
  } catch (error) {
    console.error("Error verifying phone number:", error);
    throw error;
  }
};

export const sendVerificationCode = async (phoneNumber) => {
  try {
    const response = await axios.post(`${BASE_URL}/send-verification-code`, {
      phoneNumber,
    });
    return response;
  } catch (error) {
    console.error("Error sending verification code:", error);
    throw error;
  }
};

export const verifyRefreshToken = async (refreshToken) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/verify-refresh-token`,
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
    console.error("Error verifying refresh token:", error);
    throw error;
  }
};

export const verifyAccessToken = async (accessToken) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/verify-access-token`,
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
    console.error("Error verifying access token:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/logout`);
    return response.data;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};
