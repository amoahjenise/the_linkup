import { combineReducers } from "redux";
import authReducer from "./authReducer";
import registrationReducer from "./registrationReducer";
import loggedUserReducer from "./loggedUserReducer";

const appReducer = combineReducers({
  auth: authReducer,
  registration: registrationReducer,
  loggedUser: loggedUserReducer,
});

const rootReducer = (state, action) => {
  if (action.type === "LOGOUT") {
    // Reset the state to initial values for all reducers
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;
