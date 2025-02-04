// import { markMessagesAsReadBatch } from "../../api/messagingAPI";

import {
  // MARK_MESSAGES_AS_READ,
  INCREMENT_UNREAD_MESSAGES_COUNT,
  SET_UNREAD_MESSAGES_COUNT,
} from "./actionTypes";

export const setUnreadMessagesCount = (count) => {
  return {
    type: SET_UNREAD_MESSAGES_COUNT,
    payload: count,
  };
};

export const incrementUnreadMessagesCount = () => {
  return {
    type: INCREMENT_UNREAD_MESSAGES_COUNT,
  };
};

// Action Creator
// export const markMessagesAsRead = (messageId, receiverId) => (dispatch) => {
//   return markMessagesAsReadBatch([messageId], receiverId)
//     .then(() => {
//       // Dispatch an action to update the Redux store with the read message
//       dispatch({ type: MARK_MESSAGES_AS_READ, messageId });
//     })
//     .catch((error) => {
//       console.error("Error marking message as read:", error);
//     });
// };
