import { LOGIN, LOGOUT } from "./actionTypes";

// Action creator for login
export const login = () => ({
  type: LOGIN,
});

// Action creator for logout
export const logout = () => ({
  type: LOGOUT,
});
