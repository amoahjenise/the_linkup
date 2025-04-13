import {
  SET_DEFAULT_SETTINGS,
  GET_USER_SETTINGS,
  SAVE_USER_SETTINGS,
} from "./actionTypes";

// Just pass through the raw API response
export const setDefaultSettings = () => ({
  type: SET_DEFAULT_SETTINGS,
});

// For GET - pass the raw backend response
export const getUserSettings = (settings) => ({
  type: GET_USER_SETTINGS,
  payload: settings,
});

// For SAVE - also pass the raw backend response
export const saveUserSettings = (settings) => ({
  type: SAVE_USER_SETTINGS,
  payload: settings,
});
