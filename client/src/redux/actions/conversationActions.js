// actions/conversationActions.js

import {
  SET_CONVERSATIONS,
  SET_SELECTED_CONVERSATION,
  SET_MESSAGES,
  NEW_MESSAGE,
  UPDATE_CONVERSATION,
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
