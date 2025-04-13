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
        userSettings: {
          ...defaultSettings, // Default values as fallback
          ...action.payload, // Override with actual values from DB
          distanceRange:
            action.payload.distance_range || defaultSettings.distanceRange,
          ageRange: action.payload.age_range || defaultSettings.ageRange,
          genderRange:
            action.payload.gender_preferences || defaultSettings.genderRange,
          notificationEnabled:
            action.payload.notification_enabled !== undefined
              ? action.payload.notification_enabled
              : defaultSettings.notificationEnabled,
          locationSharingEnabled:
            action.payload.location_sharing_enabled !== undefined
              ? action.payload.location_sharing_enabled
              : defaultSettings.locationSharingEnabled,
        },
        loading: false,
        error: null,
      };

    case SAVE_USER_SETTINGS:
      return {
        ...state,
        userSettings: action.payload,
        successMessage: "Settings saved successfully",
        error: null,
      };

    case SET_DEFAULT_SETTINGS:
      return {
        ...state,
        userSettings: defaultSettings,
        error: null,
      };

    default:
      return state;
  }
};

export default userSettingsReducer;
