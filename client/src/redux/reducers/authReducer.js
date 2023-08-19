import {
  LOGIN,
  UPDATE_PHONE_NUMBER,
  UPDATE_DEACTIVATED_USER,
} from "../actions/actionTypes";

// Define the initial state for authentication
const initialState = {
  isAuthenticated: false,
  phoneNumber: "",
  deactivatedUser: null, // Handles the scenario where a deleted user is trying to authenticate.
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        isAuthenticated: true,
      };
    case UPDATE_PHONE_NUMBER:
      return {
        ...state,
        phoneNumber: action.payload,
      };
    case UPDATE_DEACTIVATED_USER:
      return {
        ...state,
        deactivatedUser: action.payload,
      };
    default:
      return state;
  }
};

export default authReducer;
