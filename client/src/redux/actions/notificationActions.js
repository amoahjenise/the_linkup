import {
  FETCH_UNREAD_NOTIFICATIONS_COUNT,
  UPDATE_UNREAD_NOTIFICATIONS_COUNT,
  INCREMENT_UNREAD_NOTIFICATIONS_COUNT,
  DECREMENT_UNREAD_NOTIFICATIONS_COUNT,
} from "./actionTypes";

export const fetchUnreadNotificationsCount = () => {
  return {
    type: FETCH_UNREAD_NOTIFICATIONS_COUNT,
  };
};

export const updateUnreadNotificationsCount = (count) => {
  return {
    type: UPDATE_UNREAD_NOTIFICATIONS_COUNT,
    payload: Math.max(0, Number(count) || 0), // Validate count
  };
};

export const incrementUnreadNotificationsCount = () => {
  return {
    type: INCREMENT_UNREAD_NOTIFICATIONS_COUNT,
  };
};

export const decrementUnreadNotificationsCount = () => {
  return {
    type: DECREMENT_UNREAD_NOTIFICATIONS_COUNT,
  };
};
