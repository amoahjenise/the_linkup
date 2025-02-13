import { GET_USER_SETTINGS, SAVE_USER_SETTINGS } from "../actions/actionTypes";

const initialState = {
  userSettings: {},
  error: null,
  successMessage: "",
  loading: false,
};

const userSettingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_USER_SETTINGS:
      return {
        ...state,
        userSettings: {
          ...state.userSettings,
          ...action.payload,
        },
      };
    case SAVE_USER_SETTINGS:
      return {
        ...state,
        userSettings: action.payload, // Store the new settings
      };
    default:
      return state;
  }
};

export default userSettingsReducer;
