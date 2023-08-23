import { SET_MESSAGES_DATA } from "./actionTypes";

// In your actions.js
export const setMessagesData = (
  participants,
  initialMessage,
  notificationId,
  linkupId
) => ({
  type: SET_MESSAGES_DATA,
  payload: { participants, initialMessage, notificationId, linkupId },
});
