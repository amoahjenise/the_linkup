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
    payload: count,
  };
};

// Action to increment the unread notifications count
export const incrementUnreadNotificationsCount = () => {
  return {
    type: INCREMENT_UNREAD_NOTIFICATIONS_COUNT,
  };
};

// Action to decrement the unread notifications count
export const decrementUnreadNotificationsCount = () => {
  return {
    type: DECREMENT_UNREAD_NOTIFICATIONS_COUNT,
  };
};
