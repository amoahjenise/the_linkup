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
        unreadCount: action.payload,
      };
    case INCREMENT_UNREAD_NOTIFICATIONS_COUNT:
      return {
        ...state,
        unreadCount: state.unreadCount + 1,
      };
    case DECREMENT_UNREAD_NOTIFICATIONS_COUNT:
      return {
        ...state,
        unreadCount: state.unreadCount - 1,
      };
    default:
      return state;
  }
};

export default notificationReducer;
