// userSettingsReducer.js
import {
  GET_USER_SETTINGS,
  SAVE_USER_SETTINGS,
  SET_DEFAULT_SETTINGS,
} from "../actions/actionTypes";

const initialState = {
  userSettings: null, // Changed from {} to null to distinguish "not loaded" vs "empty"
  error: null,
  successMessage: "",
  loading: false,
};

const defaultSettings = {
  distanceRange: [0, 50], // 0-50km default
  ageRange: [18, 99], // 18-99 age range
  genderRange: ["Men", "Women"], // Default to both men and women
  notificationEnabled: true,
  locationSharingEnabled: true,
};

const userSettingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_USER_SETTINGS:
      return {
        ...state,
        userSettings: action.payload || defaultSettings, // Fallback to defaults if null
      };
    case SAVE_USER_SETTINGS:
      return {
        ...state,
        userSettings: action.payload,
      };
    case SET_DEFAULT_SETTINGS:
      return {
        ...state,
        userSettings: defaultSettings,
      };
    default:
      return state;
  }
};

export default userSettingsReducer;
