import {
  LOGIN,
  LOGOUT,
  UPDATE_PHONE_NUMBER,
  UPDATE_DEACTIVATED_USER,
} from "./actionTypes";

// Action creator for login
export const login = () => ({
  type: LOGIN,
});

// Action creator for updating phone number
export const updatePhoneNumber = (phoneNumber) => ({
  type: UPDATE_PHONE_NUMBER,
  payload: phoneNumber,
});

export const updateDeactivatedUser = (user) => ({
  type: UPDATE_DEACTIVATED_USER,
  payload: user,
});

// Action creator for logout
export const performLogout = () => ({
  type: LOGOUT,
});
