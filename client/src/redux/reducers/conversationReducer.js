// reducers/conversationReducer.js
import {
  NEW_MESSAGE,
  SET_CONVERSATIONS,
  SET_SELECTED_CONVERSATION,
  SET_MESSAGES,
  UPDATE_CONVERSATION,
} from "../actions/actionTypes";

const initialState = {
  conversations: [],
  selectedConversation: null,
  messages: [],
  linkupId: null,
};

const conversationReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_CONVERSATION:
      // Find the index of the conversation to update
      const conversationIndex = state.conversations.findIndex(
        (conversation) =>
          conversation.conversation_id ===
          action.updatedConversation.conversation_id
      );

      // Create a copy of the updated conversation
      const updatedConversation = {
        ...state.conversations[conversationIndex],
        last_message: action.updatedConversation.last_message,
        last_message_timestamp:
          action.updatedConversation.last_message_timestamp,
      };

      // Create a copy of the conversations array with the updated conversation
      const updatedConversations = [...state.conversations];
      updatedConversations[conversationIndex] = updatedConversation;

      return {
        ...state,
        conversations: updatedConversations,
      };
    case SET_CONVERSATIONS:
      return {
        ...state,
        conversations: action.conversations,
      };
    case SET_SELECTED_CONVERSATION:
      return {
        ...state,
        selectedConversation: action.conversation,
      };
    case SET_MESSAGES:
      return {
        ...state,
        participants: action.participants,
        messages: action.messages,
        linkupId: action.linkupId,
      };
    case NEW_MESSAGE:
      // Update the messages array in the selected conversation
      const updatedMessages = [
        ...state.messages,
        {
          message_id: action.messageData.message_id,
          conversation_id: action.messageData.conversation_id,
          sender_id: action.messageData.sender_id,
          sender_name: action.messageData.sender_name,
          sender_avatar: action.messageData.sender_avatar,
          content: action.messageData.content,
          timestamp: action.messageData.timestamp,
        },
      ];

      return {
        ...state,
        messages: updatedMessages,
      };
    default:
      return state;
  }
};

export default conversationReducer;
