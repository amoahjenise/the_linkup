// actions/conversationActions.js

import {
  SET_CONVERSATIONS,
  SET_SELECTED_CONVERSATION,
  SET_MESSAGES,
  NEW_MESSAGE,
} from "./actionTypes";

export const setConversations = (conversations) => ({
  type: SET_CONVERSATIONS,
  conversations,
});

export const setSelectedConversation = (conversation) => ({
  type: SET_SELECTED_CONVERSATION,
  conversation,
});

export const setMessages = (
  participants,
  messages,
  linkupId,
  conversationId
) => ({
  type: SET_MESSAGES,
  participants,
  messages,
  linkupId,
  conversationId,
});

export const newMessage = (messageData) => ({
  type: NEW_MESSAGE,
  messageData,
});
