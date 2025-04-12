import {
  UPDATE_UNREAD_NOTIFICATIONS_COUNT,
  INCREMENT_UNREAD_NOTIFICATIONS_COUNT,
  DECREMENT_UNREAD_NOTIFICATIONS_COUNT,
} from "../actions/actionTypes";

const initialState = {
  unreadCount: 0,
};

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_UNREAD_NOTIFICATIONS_COUNT:
      return {
        ...state,
        unreadCount: Math.max(0, Number(action.payload) || 0), // Double validation
      };

    case INCREMENT_UNREAD_NOTIFICATIONS_COUNT:
      return {
        ...state,
        unreadCount: state.unreadCount + 1, // Increment can't make it negative
      };

    case DECREMENT_UNREAD_NOTIFICATIONS_COUNT:
      return {
        ...state,
        unreadCount: Math.max(0, state.unreadCount - 1), // Prevent negative
      };

    default:
      return state;
  }
};

export default notificationReducer;
