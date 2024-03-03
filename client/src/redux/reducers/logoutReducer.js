// logoutReducer.js
import { LOGOUT_REQUEST } from "../actions/actionTypes";

const initialState = {
  isSigningOut: false, // You can add more logout-related state here if needed
};

const logoutReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGOUT_REQUEST:
      return {
        ...state,
        isSigningOut: true, // Set isSigningOut to true when logout request is initiated
      };
    default:
      return state;
  }
};

export default logoutReducer;
