import {
  FETCH_UNREAD_NOTIFICATIONS_COUNT,
  UPDATE_UNREAD_NOTIFICATIONS_COUNT,
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
