import {
  SET_DEFAULT_SETTINGS,
  GET_USER_SETTINGS,
  SAVE_USER_SETTINGS,
} from "./actionTypes";

// userSettingsActions.js
export const setDefaultSettings = () => ({
  type: SET_DEFAULT_SETTINGS,
});

export const getUserSettings = (settings) => ({
  type: GET_USER_SETTINGS,
  payload: settings, // Action now receives the settings object
});

export const saveUserSettings = (userSettings) => ({
  type: SAVE_USER_SETTINGS,
  payload: userSettings,
});
