import { combineReducers } from "redux";
import authReducer from "./authReducer";
import registrationReducer from "./registrationReducer";
import userReducer from "./userReducer";
import editingLinkupReducer from "./editingLinkupReducer";
import linkupReducer from "./linkupReducer";
import conversationReducer from "./conversationReducer";

const appReducer = combineReducers({
  auth: authReducer,
  registration: registrationReducer,
  loggedUser: userReducer,
  linkups: linkupReducer,
  editingLinkup: editingLinkupReducer,
  messagesData: conversationReducer,
});

const rootReducer = (state, action) => {
  if (action.type === "LOGOUT") {
    // Reset the state to initial values for all reducers
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;
