import { UPDATE_UNREAD_NOTIFICATIONS_COUNT } from "../actions/actionTypes";

const initialState = {
  unreadCount: 0,
};

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_UNREAD_NOTIFICATIONS_COUNT:
      return {
        ...state,
        unreadCount: action.payload,
      };
    default:
      return state;
  }
};

export default notificationReducer;
