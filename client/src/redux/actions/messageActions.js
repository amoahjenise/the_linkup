import {
  INCREMENT_UNREAD_MESSAGES_COUNT,
  SET_UNREAD_MESSAGES_COUNT,
} from "./actionTypes";

export const setUnreadMessagesCount = (count) => {
  // Validate count to ensure it's never negative
  const validatedCount = Math.max(0, Number(count) || 0);

  return {
    type: SET_UNREAD_MESSAGES_COUNT,
    payload: validatedCount,
  };
};

export const incrementUnreadMessagesCount = () => {
  return {
    type: INCREMENT_UNREAD_MESSAGES_COUNT,
  };
};
