// reducers/conversationReducer.js
import {
  NEW_MESSAGE,
  SET_CONVERSATIONS,
  SET_SELECTED_CONVERSATION,
  SET_MESSAGES,
} from "../actions/actionTypes";

const initialState = {
  conversations: [],
  selectedConversation: null,
  messages: [],
  linkupId: null,
  conversationId: null,
};

const conversationReducer = (state = initialState, action) => {
  switch (action.type) {
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
        conversationId: action.conversationId,
      };
    case NEW_MESSAGE:
      // Update the messages array in the selected conversation
      const updatedMessages = [
        ...state.messages,
        {
          conversation_id: action.messageData.conversation_id,
          sender_name: action.messageData.sender_name,
          content: action.messageData.content,
          timestamp: action.messageData.timestamp,
          sender_avatar: action.messageData.sender_avatar,
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
