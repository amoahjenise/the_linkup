import { combineReducers } from "redux";
import authReducer from "./authReducer";
import registrationReducer from "./registrationReducer";
import userReducer from "./userReducer";
import editingLinkupReducer from "./editingLinkupReducer";
import linkupReducer from "./linkupReducer";
import conversationReducer from "./conversationReducer";
import notificationReducer from "./notificationReducer";
import userSentRequestsReducer from "./userSentRequestsReducer";
import messageReducer from "./messageReducer";
import logoutReducer from "./logoutReducer";
import locationReducer from "./locationSlice";
import userSettingsReducer from "./userSettingsReducer";

const appReducer = combineReducers({
  auth: authReducer,
  logout: logoutReducer,
  registration: registrationReducer,
  userSettings: userSettingsReducer,
  loggedUser: userReducer,
  linkups: linkupReducer,
  editingLinkup: editingLinkupReducer,
  conversation: conversationReducer,
  messages: messageReducer,
  notifications: notificationReducer,
  userSentRequests: userSentRequestsReducer,
  location: locationReducer,
});

const rootReducer = (state, action) => {
  if (action.type === "LOGOUT") {
    // Preserve the userSettings state and reset other parts of the state
    const { userSettings } = state;
    state = { userSettings }; // Keep userSettings while resetting the rest
  }

  return appReducer(state, action);
};

export default rootReducer;
