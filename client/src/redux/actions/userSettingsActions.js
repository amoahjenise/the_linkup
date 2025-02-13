import { GET_USER_SETTINGS, SAVE_USER_SETTINGS } from "./actionTypes";

export const getUserSettings = (settings) => ({
  type: GET_USER_SETTINGS,
  payload: settings, // Action now receives the settings object
});

export const saveUserSettings = (userSettings) => ({
  type: SAVE_USER_SETTINGS,
  payload: userSettings,
});
