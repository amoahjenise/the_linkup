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
} from "../actions/actionTypes";

const initialState = {
  isInConversation: false,
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

      if (conversationIndex !== -1) {
        // Create a copy of the updated conversation
        const updatedConversation = {
          ...state.conversations[conversationIndex],
          last_message: action.updatedConversation.last_message,
          last_message_timestamp:
            action.updatedConversation.last_message_timestamp,
          unread_count: action.updatedConversation.unread_count,
        };

        // Create a copy of the conversations array with the updated conversation
        const updatedConversations = [...state.conversations];
        updatedConversations[conversationIndex] = updatedConversation;

        return {
          ...state,
          conversations: updatedConversations,
        };
      }

      return state;

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

    case INCREMENT_UNREAD_COUNT:
      // Find the index of the conversation to update
      const conversationIndexToIncrement = state.conversations.findIndex(
        (conversation) => conversation.conversation_id === action.conversationId
      );

      if (conversationIndexToIncrement !== -1) {
        // Create a copy of the conversation with the incremented unread_count
        const conversationToIncrement = {
          ...state.conversations[conversationIndexToIncrement],
          unread_count:
            state.conversations[conversationIndexToIncrement].unread_count + 1,
        };

        // Create a copy of the conversations array with the updated conversation
        const conversationsWithIncrement = [...state.conversations];
        conversationsWithIncrement[conversationIndexToIncrement] =
          conversationToIncrement;

        return {
          ...state,
          conversations: conversationsWithIncrement,
        };
      }

      return state;

    case DECREMENT_UNREAD_COUNT:
      // Find the index of the conversation to update
      const conversationIndexToDecrement = state.conversations.findIndex(
        (conversation) => conversation.conversation_id === action.conversationId
      );

      if (conversationIndexToDecrement !== -1) {
        // Create a copy of the conversation with the decremented unread_count
        const conversationToDecrement = {
          ...state.conversations[conversationIndexToDecrement],
          unread_count:
            state.conversations[conversationIndexToDecrement].unread_count - 1,
        };

        // Create a copy of the conversations array with the updated conversation
        const conversationsWithDecrement = [...state.conversations];
        conversationsWithDecrement[conversationIndexToDecrement] =
          conversationToDecrement;

        return {
          ...state,
          conversations: conversationsWithDecrement,
        };
      }

      return state;

    case RESET_UNREAD_COUNT:
      // Find the index of the conversation to update
      const conversationIndexToReset = state.conversations.findIndex(
        (conversation) => conversation.conversation_id === action.conversationId
      );

      if (conversationIndexToReset !== -1) {
        // Create a copy of the conversation with the reset unread_count
        const conversationToReset = {
          ...state.conversations[conversationIndexToReset],
          unread_count: 0, // Reset to 0
        };

        // Create a copy of the conversations array with the updated conversation
        const conversationsWithReset = [...state.conversations];
        conversationsWithReset[conversationIndexToReset] = conversationToReset;

        return {
          ...state,
          conversations: conversationsWithReset,
        };
      }

      return state;

    case SET_IS_IN_CONVERSATION:
      return { ...state, isInConversation: action.payload };

    default:
      return state;
  }
};

export default conversationReducer;
