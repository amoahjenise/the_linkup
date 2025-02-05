import {
  SET_LOADING,
  SET_ERROR,
  DEACTIVATE_USER_REQUEST,
  DEACTIVATE_USER_SUCCESS,
  DEACTIVATE_USER_FAILURE,
  FETCH_USER_DATA_SUCCESS,
  FETCH_USER_DATA_FAILURE,
  SET_CURRENT_USER,
  UPDATE_CURRENT_USER,
  SAVE_SETTINGS,
} from "../actions/actionTypes";

const initialState = {
  user: {},
  settings: {}, // Ensure settings are stored here
  error: null,
  successMessage: "",
  loading: false,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case FETCH_USER_DATA_SUCCESS:
      return {
        ...state,
        user: action.payload,
        settings: action.payload.settings || {}, // Ensure settings are included
        error: null,
      };
    case FETCH_USER_DATA_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    case DEACTIVATE_USER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        successMessage: "",
      };
    case DEACTIVATE_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        successMessage: action.payload.message,
      };
    case DEACTIVATE_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case SET_CURRENT_USER:
      return {
        ...state,
        user: action.payload,
      };
    case UPDATE_CURRENT_USER:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
        },
      };
    case SAVE_SETTINGS: // New case to update settings
      return {
        ...state,
        settings: action.payload, // Store the new settings
      };
    default:
      return state;
  }
};

export default userReducer;
