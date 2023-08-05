// Define the initial state for authentication
const initialState = {
  isAuthenticated: false,
  phoneNumber: "",
};

// Define the action types
const LOGIN = "LOGIN";
const LOGOUT = "LOGOUT";
const UPDATE_PHONE_NUMBER = "UPDATE_PHONE_NUMBER";

// Define the action creators

export const login = () => ({
  type: LOGIN,
});

export const logout = () => ({
  type: LOGOUT,
});

export const updatePhoneNumber = (phoneNumber) => ({
  type: UPDATE_PHONE_NUMBER,
  payload: phoneNumber,
});

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        isAuthenticated: true,
      };
    case LOGOUT:
      return initialState;
    case UPDATE_PHONE_NUMBER:
      return {
        ...state,
        phoneNumber: action.payload,
      };
    default:
      return state;
  }
};

export default authReducer;
