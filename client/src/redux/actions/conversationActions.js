// conversationActions.js
import {
  NEW_MESSAGE,
  SET_CONVERSATIONS,
  SET_SELECTED_CONVERSATION,
  SET_MESSAGES,
  UPDATE_CONVERSATION,
  INCREMENT_UNREAD_COUNT,
  DECREMENT_UNREAD_COUNT,
  RESET_UNREAD_COUNT,
  SET_IS_IN_CONVERSATION,
} from "./actionTypes";

// Action to update the selected conversation with new message content and timestamp
export const updateConversation = (updatedConversation) => ({
  type: UPDATE_CONVERSATION,
  updatedConversation,
});

export const setConversations = (conversations) => ({
  type: SET_CONVERSATIONS,
  conversations,
});

export const setSelectedConversation = (conversation) => ({
  type: SET_SELECTED_CONVERSATION,
  conversation,
});

export const setMessages = (participants, messages, linkupId) => ({
  type: SET_MESSAGES,
  participants,
  messages,
  linkupId,
});

export const newMessage = (messageData) => ({
  type: NEW_MESSAGE,
  messageData,
});

// Action to increment the unread count by 1
export const incrementUnreadCount = (conversationId) => ({
  type: INCREMENT_UNREAD_COUNT,
  conversationId,
});

// Action to decrement the unread count by 1
export const decrementUnreadCount = (conversationId) => ({
  type: DECREMENT_UNREAD_COUNT,
  conversationId,
});

// Action to reset the unread count to 0
export const resetUnreadCount = (conversationId) => ({
  type: RESET_UNREAD_COUNT,
  conversationId,
});

export const setIsInConversation = (isInConversation) => ({
  type: SET_IS_IN_CONVERSATION,
  payload: isInConversation,
});
