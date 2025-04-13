import {
  GET_USER_SETTINGS,
  SAVE_USER_SETTINGS,
  SET_DEFAULT_SETTINGS,
} from "../actions/actionTypes";

const initialState = {
  userSettings: null,
  error: null,
  loading: false,
};

const defaultSettings = {
  distanceRange: [0, 50],
  ageRange: [18, 99],
  genderPreferences: ["Men", "Women"],
  notificationEnabled: true,
  locationSharingEnabled: true,
};

// Helper function to normalize settings from backend
const normalizeSettings = (payload) => ({
  ...defaultSettings, // Default values as fallback
  ...payload, // Override with any existing values
  distanceRange:
    payload.distance_range ||
    payload.distanceRange ||
    defaultSettings.distanceRange,
  ageRange: payload.age_range || payload.ageRange || defaultSettings.ageRange,
  genderPreferences:
    payload.gender_preferences ||
    payload.genderPreferences ||
    defaultSettings.genderPreferences,
  notificationEnabled:
    payload.notification_enabled !== undefined
      ? payload.notification_enabled
      : payload.notificationEnabled !== undefined
      ? payload.notificationEnabled
      : defaultSettings.notificationEnabled,
  locationSharingEnabled:
    payload.location_sharing_enabled !== undefined
      ? payload.location_sharing_enabled
      : payload.locationSharingEnabled !== undefined
      ? payload.locationSharingEnabled
      : defaultSettings.locationSharingEnabled,
});

const userSettingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_USER_SETTINGS:
      return {
        ...state,
        userSettings: normalizeSettings(action.payload),
        loading: false,
        error: null,
      };

    case SAVE_USER_SETTINGS:
      return {
        ...state,
        userSettings: normalizeSettings(action.payload),
        loading: false,
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
